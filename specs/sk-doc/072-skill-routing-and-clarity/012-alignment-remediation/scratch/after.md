---
title: "After: alignment remediation"
description: "The nine battery rows rerun after the fixes, the evidence for each finding group, the full gate set and the routing accuracy delta."
trigger_phrases:
  - "alignment remediation after"
importance_tier: "normal"
contextType: "implementation"
---
# After: alignment remediation

Recorded on 2026-10-28 in worktree `266-alignment-remediation`, over base `3b91c19634` plus this phase's diff, which is the commit that carries this file. Raw output sits in `.scratch-dc90/072-012/`: `evidence/after-rows.md`, `evidence/clean/after-rows.md`, `gates3-summary.txt`, `evidence/accuracy-before.json` and `evidence/accuracy-after.json`.

## 1. The Nine Battery Rows

Every row that failed now exits 0. The rows were rerun twice: once in the working shell, and once under `env -i` with only `HOME` and `PATH` set, so no operator override could carry a row. Both runs printed the same lines.

| Row | Before | After | Last output line now |
|-----|--------|-------|----------------------|
| `S2-skill-package` on cli-devin | 1 | 0 | `package_skill.py --check: PASS (exit 0)` |
| `S2-validate-document` on `hub-skill-scaffold.md` | 1 | 0 | `Total issues: 0` |
| `S2-validate-document` on `packet-skill-scaffold.md` | 1 | 0 | `Total issues: 0` |
| `S2-validate-document` on `skill-scaffold-template.md` | 1 | 0 | `Total issues: 0` |
| `S2-validate-document` on `auto-mode-contract.md` | 1 | 0 | `Total issues: 0` |
| `S5-derived-counts` | 1 | 0 | `SUMMARY files=55 pass=55 fail=0` |
| `S5-readme-references` | 1 | 0 | `SUMMARY files=55 pass=55 fail=0` |
| `S11-runtime-mirrors` | 1 | 0 | `[runtime-mirror-sync] PASS: 201 mirrors across 9 trees are in sync.` |
| `S15-ci-command-tree-parity` | 1 | 0 | `[runtime-mirror-sync] PASS: 201 mirrors across 9 trees are in sync.` |

## 2. Findings, by Group

| Group | Evidence |
|-------|----------|
| Runtime mirrors, REQ-001 | Rows S11 and S15 above. `node --test sync-runtime-mirrors.test.mjs`: 5 tests, 5 pass, covering a gitignored root, a tracked root, a `local-*` entry, an ignored link kept on write, and the MISSING branch |
| cli skills, REQ-002 | cli-devin's package check passes, and the gated preamble wording appears in no cli SKILL.md |
| cli-orca, REQ-003 | Live `advisor_recommend` from the worktree after a forced rebuild and a daemon restart. "List my Orca worktrees and open a terminal in the new one": cli-orca 0.8397. "list the managed worktrees in orca": cli-orca 0.9187. Both returned nothing before the scorer fix, which `route-gates.vitest.ts` now covers |
| Leaf scopes, REQ-004 | `leaf-scopes` is named in sk-create-skill's SKILL.md, the root-metadata contract and both playbook files, and the advisor SKILL.md names five leaf roots |
| README checkers, REQ-005 and REQ-015 | Rows S5 above. `--self-test` prints `SELF-TEST PASS`, and the four README-checker pytest files report 9, 28, 8 and 5 passed. ADR-001 records how each disposition shipped |
| sk-create-benchmark, REQ-006 | `changelog/v1.6.3.0.md` exists, and the package check passes |
| Comment and tests, REQ-007 | `index-scope.ts` no longer names the removed glob. The two plugins-link cases run inside the 96 passing `quality-gate-*` tests, and `test_audit_descriptions.py` reports 13 passed |
| OVERVIEW sections, REQ-008 | The four S2 rows above |
| prompt-improver, REQ-009 | The old path appears in neither the agent nor its three mirrors |
| Workflow filters and timeout, REQ-010 and REQ-011 | Each of the three workflows has two trigger blocks and two `.opencode/plugins` entries. `changed-packet-validation.yml` runs at 20 minutes, with `filter: blob:none` |
| sk-code code alignment, REQ-012 | No code file in the three modes, the shared scripts or the five sk-code doctor scripts is past 500 lines, and each carries its header. The comment-hygiene checker passes on all 101 changed code files and flags a probe that carries a requirement id. The rule canary reports 133 PASS |
| sk-code-skilled guides, REQ-013 | `run-all-drift-guards.sh`: all 4 guards passed |
| Playbooks, REQ-014 | `validate-playbook-package.cjs` reports `violations=0 warnings=0` on all five packages, and `verify-router-sync.cjs` reports 5/5 |

## 3. Gates and Accuracy

The full 38-gate set ran three times. The first run had three failures, and every fix after that went back through the gates. The final run passed 37 of 38 before the derived repair. The one failure was spec validation, and it passed after `repair-derived.cjs`.

Routing accuracy, captured before and after the scorer fix:

| Corpus | Before | After |
|--------|--------|-------|
| Full corpus top-1 | 155/195 | 155/195 |
| Holdout top-1 | 49/66 | 49/66 |
| Ambiguity top-1 | 19/24 | 19/24 |

The advisor vitest suite reports 156 files, 1348 passed and 8 skipped.
