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

Remediation commits: scaffold 6e24bee94c, I-wave 115decdf80, P2-wave 29ab194160, final verdicts 89747c0d9c, closure (this commit). Per-entry verdicts/proofs/reasons: backlog/*.json. Successor stage: manual-testing-playbook scenarios for system-spec-kit, system-code-graph, system-skill-advisor via cli-opencode with MiMo v2.5 Pro (xiaomi/mimo-v2.5-pro --variant high) as the test subject.
