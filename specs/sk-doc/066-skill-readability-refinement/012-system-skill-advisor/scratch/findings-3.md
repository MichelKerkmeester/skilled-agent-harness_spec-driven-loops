### .skilled/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md

- [P2] .skilled/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md:16 | 3 | The intro repeats the Purpose instead of telling readers when to use the guide. | Replace with `Open this guide when proposing a scorer-weight change, comparing validation slices before promotion, or rolling back a weight change that regresses routing quality.`
- [P2] .skilled/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md:86 | 7 | One paragraph packs the edit locations, calibration requirement, experiment override, restart requirement and durable-tuning rule. | Replace with:
  ```md
  Edit `runtime/lib/scorer/lane-registry.ts:7-19` (live weights) or `lane-registry.ts:32-38` (shadow weights). Keep both sums close to 1.0 to preserve the calibration assumptions in `scoring-constants.ts`.

  For experiments:
  - `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` is allowlisted through the launcher and read by `lane-registry.ts`.
  - It requires a daemon restart to apply and suits short-lived experiments only.
  - Durable tuning stays a source edit shipped with measured evidence.
  ```
- [P2] .skilled/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md:115 | 9 | The body includes a spec path. | Replace with `Open a spec packet at the repository's required spec-packet location, documenting the trigger condition, baseline measurement, proposed weights, plus expected impact.`
- [P2] .skilled/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md:146 | 9 | The body points to a packet-specific file. | Replace with `Confirm the baseline numbers return. Document the rollback rationale in the original change summary.`

### .skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md

- [P2] .skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md:15 | 3 | The intro restates the Purpose instead of telling readers when to use the reference. | Replace with `Open this reference when running release validation after a scorer, metadata or graph change, diagnosing a slice failure, or deciding whether a lane-weight change can ship.`
- [P2] .skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md:52 | 9 | “In this packet” is temporary packet-scoped wording in the measurement cells on lines 52 and 53. | Replace `measurement unavailable in this packet` with `measurement unavailable` on both lines.
- [P2] .skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md:59 | 7 | One paragraph packs three separate metric thresholds and the policy-history qualifier. | Replace with:
  ```md
  **Bounded-delta gate (policy accepted 2026-08-02):** do not regress more than the bounded amount below the baseline captured on **2026-07-30**.
  - Full-corpus top-1 must remain at or above `0.7544` (`0.7744` baseline minus `0.0200`, captured 2026-07-30).
  - Holdout top-1 must remain at or above `0.7261` (`0.7361` baseline minus `0.0100`, captured 2026-07-30).
  - UNKNOWN must remain at or below `15` (`13` baseline plus `2`, captured 2026-07-30).

  The former absolute floors are retired as policy statements; the snapshot JSON and scorer are unchanged.
  ```