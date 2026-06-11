---
title: "Remediation Pipeline State"
description: "Live state surface for the epic finding-remediation lanes: wave status, seat dispatch state, and resume instructions for a fresh session."
trigger_phrases:
  - "remediation pipeline state"
  - "lane wave status"
  - "finding remediation resume"
importance_tier: "important"
contextType: "implementation"
---

# Remediation Pipeline State

Canonical inventory: `backlog/p1-backlog.json` (132 entries; disposition field is the source of truth) and `backlog/p2-backlog.json` (119 entries). Verify-first: nothing is fixed unverified.

## Pipeline per lane

1. **V-wave**: Fable 5 (xhigh, refute-first, file:line proof) over the lane's `to_verify` P1 entries. Native account until the claude2 session limit resets.
2. **I-wave**: gpt-5.5-fast `--variant high` via cli-opencode implements CONFIRMED entries only (minimal fix + regression; Gate-3 baked; ≤3 concurrent opencode launches).
3. **F-check**: Fable verifies the implementation against the proofs.
4. **P2 triage**: one seat per lane dispositions fix-or-waive and implements trivial fixes.
5. Targeted suites + tsc + strict validation; scoped lane commit; backlog dispositions updated.

## Wave status

ALL LANES CLOSED (2026-06-11). Final program census across 132 P1 + 119 P2 clusters:

| Outcome | P1 | P2 |
|---------|----|----|
| Fixed (verified, remediated, committed) | 51 | 56 + 17 doc-batch |
| Refuted with proof | 24 | - |
| Downgraded to P2 and triaged there | 63 (of which fixed/waived per P2 rules) | - |
| Waived with stated reason | - | 60 |
| Already fixed by earlier rounds | (counted in Fixed) | 3 |

Remediation commits: scaffold 6e24bee94c, I-wave 115decdf80, P2-wave 29ab194160, final verdicts 89747c0d9c, closure 8a08515d97. Per-entry verdicts/proofs/reasons: backlog/*.json.

## Playbook + stress stage (CLOSED 2026-06-11)

The successor stage ran to completion — see `playbook-report.md` for the full census, disposition tables, and incident note. Headline: 475/475 scenarios executed (MiMo v2.5 Pro subject), 61 FAILs re-verified by independent gpt-5.5 seats into 22 real defects (all fixed across ten commits: cbd59062f4, b510f37cec, 891310e726, 2ce26d094f, ea857be10c, 268ee4effc, 9b1fc48904, 28c2fb7178, 0504582b0e, 2c69e21741, dca74a8e7b), 22 sandbox-conditional, 17 subject errors. Stress stage: four gap-filling suites added; full stress config green twice (35 files / 118 tests). One operator-gated incident remains open: live main-DB B-tree corruption confined to derived/disposable structures (FTS shadow + telemetry tables), daemon down pending the repair decision.
