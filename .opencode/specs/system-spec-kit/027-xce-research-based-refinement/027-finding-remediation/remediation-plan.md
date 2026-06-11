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

| Lane | P1 to verify | P2 | V-wave | I-wave | P2 triage | Committed |
|------|--------------|----|--------|--------|-----------|-----------|
| 001-write-safety-and-guards | 13 | 12 | pending | - | - | - |
| 002-causal-and-memo | 10 | 5 | pending | - | - | - |
| 003-search-and-triggers | 9 | 13 | pending | - | - | - |
| 004-vector-and-checkpoint-durability | 12 | 19 | pending | - | - | - |
| 005-bm25-indexing-fidelity | 4 | 1 | pending | - | - | - |
| 006-launchers-and-cli | 21 | 19 | pending | - | - | - |
| 007-continuity-and-save-concurrency | 13 | 15 | pending | - | - | - |
| 008-doc-truth-and-test-fidelity | 19 | 35 | pending | - | - | - |

## Resume instructions (fresh session)

Read this file + the two backlog JSONs. Seat briefs and outputs live in `/tmp/remediation/` (`v-<lane>.md|.out`, `i-<lane>.md|.json`). Update this table and each entry's `disposition` as waves land. Successor work after all lanes commit: run all manual-testing-playbook scenarios for system-spec-kit, system-code-graph, and system-skill-advisor via cli-opencode with MiMo v2.5 Pro (`xiaomi/mimo-v2.5-pro --variant high`) as the test subject.
