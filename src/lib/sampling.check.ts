/**
 * Runnable self-check for SSR-FPC + fraud gates.
 * Run: npx tsx src/lib/sampling.check.ts
 */
import {
  approxMarginOfError,
  crewForTimeline,
  fpcSampleSize,
  cochranN0,
  samplesPerWard,
  sampleRemainder,
  surveyorsRequired,
  TIER2_SAMPLE_BASELINE,
} from "./sampling";
import { applyFraudGates } from "./fraud";

function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error(`FAIL: ${msg}`);
}

// Express / Standard / Economy crew sizes
assert(surveyorsRequired(2) === 6, "2-day → 6 surveyors");
assert(surveyorsRequired(3) === 4, "3-day → 4 surveyors");
assert(surveyorsRequired(4) === 3, "4-day → 3 surveyors");
assert(crewForTimeline(3).supervisors === 1, "1 supervisor");

assert(samplesPerWard(12) === 20, "12 wards → 20/ward");
assert(samplesPerWard(13) === 18, "13 wards → 18/ward");
assert(sampleRemainder(13) === 6, "13-ward remainder 6");

const n0 = cochranN0(0.05);
const n = fpcSampleSize(n0, 3800);
assert(n > 300 && n < 400, `FPC n in band, got ${n}`);
const moe = approxMarginOfError(TIER2_SAMPLE_BASELINE, 3800);
assert(moe > 0.055 && moe < 0.07, `MoE ~6.1%, got ${(moe * 100).toFixed(2)}%`);

const fraudShort = applyFraudGates({
  interview_duration_seconds: 120,
  q1_civic_issue: "A",
  q8_candidate_priority_trait: "B",
});
assert(fraudShort.is_flagged_fraud && fraudShort.quota_replenish === 1, "duration fraud");

const fraudLine = applyFraudGates({
  interview_duration_seconds: 400,
  q1_civic_issue: "A",
  q8_candidate_priority_trait: "A",
  q9_ysrcp_governance_rating: "A",
  q10_nda_governance_rating: "A",
});
assert(fraudLine.is_straight_lined && fraudLine.quota_replenish === 1, "straight-line");

const ok = applyFraudGates({
  interview_duration_seconds: 400,
  q1_civic_issue: "Water",
  q8_candidate_priority_trait: "Honesty",
  q9_ysrcp_governance_rating: "Worse",
});
assert(!ok.is_flagged_fraud && ok.quota_replenish === 0, "clean row");

console.log("sampling.check.ts: all assertions passed");
