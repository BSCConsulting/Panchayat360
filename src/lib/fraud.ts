import { MIN_INTERVIEW_SECONDS } from "./sampling";

export type SurveyChoiceFields = {
  interview_duration_seconds: number;
  q1_civic_issue?: string | null;
  q8_candidate_priority_trait?: string | null;
  q9_ysrcp_governance_rating?: string | null;
  q10_nda_governance_rating?: string | null;
  q11_regime_comparison?: string | null;
  q12_immediate_priority_issue?: string | null;
  q14_voting_anchor_factor?: string | null;
};

/** Duration gate: <4 minutes → fraud. */
export function isDurationFraud(seconds: number): boolean {
  return seconds < MIN_INTERVIEW_SECONDS;
}

/** Straight-lining: all provided MCQ answers identical. */
export function isStraightLined(row: SurveyChoiceFields): boolean {
  const answers = [
    row.q1_civic_issue,
    row.q8_candidate_priority_trait,
    row.q9_ysrcp_governance_rating,
    row.q10_nda_governance_rating,
    row.q11_regime_comparison,
    row.q12_immediate_priority_issue,
    row.q14_voting_anchor_factor,
  ].filter((v): v is string => Boolean(v && String(v).trim()));

  if (answers.length < 3) return false;
  const first = answers[0]!.trim().toLowerCase();
  return answers.every((a) => a.trim().toLowerCase() === first);
}

export type FraudGateResult = {
  is_flagged_fraud: boolean;
  is_straight_lined: boolean;
  reason: "ok" | "duration" | "straight_line" | "both";
  /** When fraud, active ward quota should increment by +1. */
  quota_replenish: 0 | 1;
};

export function applyFraudGates(row: SurveyChoiceFields): FraudGateResult {
  const duration = isDurationFraud(row.interview_duration_seconds);
  const straight = isStraightLined(row);
  if (duration && straight) {
    return {
      is_flagged_fraud: true,
      is_straight_lined: true,
      reason: "both",
      quota_replenish: 1,
    };
  }
  if (duration) {
    return {
      is_flagged_fraud: true,
      is_straight_lined: false,
      reason: "duration",
      quota_replenish: 1,
    };
  }
  if (straight) {
    return {
      is_flagged_fraud: true,
      is_straight_lined: true,
      reason: "straight_line",
      quota_replenish: 1,
    };
  }
  return {
    is_flagged_fraud: false,
    is_straight_lined: false,
    reason: "ok",
    quota_replenish: 0,
  };
}
