---
title: "Before: alignment remediation"
description: "The nine battery rows that failed in the alignment run over the routing program, each with its command, exit status and last output line, and where each finding stood when the phase started."
trigger_phrases:
  - "alignment remediation before"
importance_tier: "normal"
contextType: "implementation"
---
# Before: alignment remediation

Recorded on 2026-10-28 from the alignment run over `ceb89382e4^..76585ec323`, with 18 commits and 507 files in scope. The battery ran 388 rows: 379 passed and 9 failed. The four review lanes, the probes and the critic raised 34 findings, at P0 2, P1 5 and P2 27, and the critic overturned 6 of them. The run folder sits outside the repository, so this record copies what the phase acts on.

## 1. Failing Battery Rows

| Row | Exit | Last output line |
|-----|------|------------------|
| `S2-skill-package` on `cli-external-orchestration/cli-devin` | 1 | `Result: FAIL`, because `SKILL.md` is over 5000 words |
| `S2-validate-document` on `sk-create-skill/assets/parent-skill/scaffold/hub-skill-scaffold.md` | 1 | `Fix: Add section with name containing "overview"` |
| `S2-validate-document` on `sk-create-skill/assets/parent-skill/scaffold/packet-skill-scaffold.md` | 1 | `Fix: Add section with name containing "overview"` |
| `S2-validate-document` on `sk-create-skill/assets/skill/skill-scaffold-template.md` | 1 | `Fix: Add section with name containing "overview"` |
| `S2-validate-document` on `system-spec-kit/references/workflows/auto-mode-contract.md` | 1 | `Fix: Add section with name containing "overview"` |
| `S5-derived-counts`, `check_derived_readme_counts.py` over 55 READMEs | 1 | `SUMMARY files=55 pass=49 fail=6` |
| `S5-readme-references`, `check_readme_references.py` over the same 55 | 1 | `SUMMARY files=55 pass=44 fail=11` |
| `S11-runtime-mirrors`, `sync-runtime-mirrors.cjs --check` | 1 | `[runtime-mirror-sync] MISSING .opencode/commands/assets` |
| `S15-ci-command-tree-parity`, `validate-command-tree-parity.sh` | 1 | `[runtime-mirror-sync] MISSING .opencode/commands/assets` |

## 2. Where the Findings Stood

Each finding in `spec.md` §4 was checked against the file it names before any fix ran. All of them reproduced. Two P0 findings were the red CI gates in rows S11 and S15. The mirror check derived its expected set from every top-level entry under `.skilled/commands`, including `assets/`, which holds only ignored, operator-local entries. A CI checkout therefore has no target for that mirror.

The operator then widened the phase twice. The code in sk-code quality, review and CI was to be checked against sk-code-skilled, and the five sk-code testing playbooks were to be made correct. The audit for the first named:

- four files far past the 500-line guideline: `quality-gate.cjs` (2878 lines), `check-comment-hygiene.sh` (1013), `quality-config.cjs` (910) and `sk-code-quality-config.cjs` (699)
- scripts without a `MODULE:` header
- one function nested four levels deep

The playbook audit found 92 issues across the five packages.

## 3. File List

Every path in `spec.md` §3 existed apart from the rows marked `Create`. The doctor CI and quality scripts were added to the list during the work, because they hold the same code the sk-code alignment covers.
