# Phase 002 — Collision Resolution Decision (D4)

Two slug collisions exist in `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/`. Both are pairs of **distinct scenarios** (different Feature IDs, different content) that happen to share a slug — NOT duplicates. Per D4, resolve by assigning **distinct descriptive slugs** (no merge; merging would delete a real scenario).

## Pair 1 — `session-capturing-pipeline-quality`
| Old file | Feature ID | Scenario | New slug |
|----------|-----------|----------|----------|
| `219-session-capturing-pipeline-quality.md` | M-007 | Canonical memory/spec-kit operator workflow (177 lines, the primary feature) | `session-capturing-pipeline-quality.md` |
| `235-session-capturing-pipeline-quality.md` | 139 | Coverage sourced from M-007 session-capturing closure verification (68 lines) | `session-capturing-pipeline-quality-coverage.md` |

## Pair 2 — `template-compliance-contract-enforcement`
| Old file | Feature ID | Scenario | New slug |
|----------|-----------|----------|----------|
| `243-template-compliance-contract-enforcement.md` | 181 | Confirm the 3-layer system PRODUCES compliant docs on first generation (positive case) | `template-compliance-contract-enforcement-produces-compliant.md` |
| `250-template-compliance-contract-enforcement.md` | 208 | Confirm the contract BLOCKS non-compliant docs (negative case) | `template-compliance-contract-enforcement-blocks-non-compliant.md` |

## How phase 003 applies this
These 4 files are renamed MANUALLY (to the distinct slugs above) BEFORE running the migration tool on the `16--tooling-and-scripts` category, then their references are rewritten (root playbook links + each file's own SOURCE METADATA self-path + any cross-refs to the old numbered paths). After that, the 4 files are un-numbered, so the tool's `^[0-9]+-` matcher skips them and the tool runs clean on the rest of the tree (no collision abort). Feature IDs inside the files (M-007, 139, 181, 208) are unchanged — only filenames change.
