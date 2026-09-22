/** SSR-FPC sampling + field crew sizing for Tier-2 Gram Panchayat polls. */

export const TIER2_SAMPLE_BASELINE = 240;
export const SAMPLES_PER_SURVEYOR_DAY = 20;
export const MIN_INTERVIEW_SECONDS = 240; // 4 minutes
export const Z_95 = 1.96;

/** Cochran n0 at max variance (p=0.5). */
export function cochranN0(marginOfError: number, z = Z_95, p = 0.5): number {
  return (z * z * p * (1 - p)) / (marginOfError * marginOfError);
}

/** Finite Population Correction: n = n0 / (1 + (n0 - 1) / N) */
export function fpcSampleSize(n0: number, N: number): number {
  if (N <= 0) return Math.ceil(n0);
  return Math.ceil(n0 / (1 + (n0 - 1) / N));
}

/** Ward allocation: floor(240 / statutory_wards). Remainder assigned later. */
export function samplesPerWard(
  statutoryWards: number,
  total = TIER2_SAMPLE_BASELINE,
): number {
  if (statutoryWards <= 0) return 0;
  return Math.floor(total / statutoryWards);
}

export function sampleRemainder(
  statutoryWards: number,
  total = TIER2_SAMPLE_BASELINE,
): number {
  if (statutoryWards <= 0) return total;
  return total % statutoryWards;
}

/** Surveyors = ceil(240 / (days × 20)). Express=2→6, Standard=3→4, Economy=4→3. */
export function surveyorsRequired(
  timelineDays: 2 | 3 | 4,
  totalSamples = TIER2_SAMPLE_BASELINE,
): number {
  return Math.ceil(totalSamples / (timelineDays * SAMPLES_PER_SURVEYOR_DAY));
}

export function crewForTimeline(timelineDays: 2 | 3 | 4) {
  const surveyors = surveyorsRequired(timelineDays);
  const supervisors = 1;
  return {
    surveyors,
    supervisors,
    totalCrew: surveyors + supervisors,
    dailyTarget: Math.round(TIER2_SAMPLE_BASELINE / timelineDays),
    samplesPerWardHint: samplesPerWard,
  };
}

/** Approximate MoE for n=240, N≈3800, p=0.5 → ~±6.1%. */
export function approxMarginOfError(n: number, N: number, z = Z_95, p = 0.5): number {
  if (n <= 0 || N <= 0) return 1;
  const fpc = (N - n) / (N - 1);
  return z * Math.sqrt((p * (1 - p) * fpc) / n);
}
