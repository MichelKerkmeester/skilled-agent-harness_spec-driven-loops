# Deep Review Strategy — specs/sk-doc/062-doc-validation-off-switches

## Topic
Five-pass inline deep review, session `fanout-luna-1790598126829-x9gy4v`, executor `cli-codex` model `gpt-6-luna`.

## Review dimensions
- [x] Correctness — PASS for this pass; P2-LUNA-001 remains active.
- [x] Security — PASS; no security finding.
- [x] Traceability — CONDITIONAL; P1-LUNA-002 and P2-LUNA-003 remain active.
- [x] Maintainability — PASS for this pass; P2-LUNA-004 and P2-LUNA-005 remain active.
- [x] Cross-dimensional adversarial replay — CONDITIONAL; no additional findings.

## Completed dimensions
| Dimension | Verdict | Iteration | Summary |
|---|---|---:|---|
| Correctness | PASS | 1 | Environment sentinel edge, P2. |
| Security | PASS | 2 | No injection/config sourcing issue. |
| Traceability | CONDITIONAL | 3 | JSON wrapper failure, P1; local pass-status ambiguity, P2. |
| Maintainability | PASS | 4 | Internal whitespace and BOM parser parity, P2. |
| Cross-dimensional replay | CONDITIONAL | 5 | Reconfirmed all five active findings. |

## Running findings
- P0: 0 active
- P1: 1 active
- P2: 4 active
- Total active: 5

## What worked
- Producer-to-consumer tracing exposed a JSON channel defect not covered by producer tests.
- Four-reader source comparison found two parser edge cases outside the current table.

## What failed
- The existing report-status consumers do not preserve the producer's explicit skipped state.
- The parity matrix does not cover the sentinel, internal whitespace, or a BOM-prefixed switch key across all readers.

## Exhausted approaches
- Security-input review was exhausted after checking name validation, eval boundaries, plain-text config parsing, and guard entry points; no security issue found.

## Ruled out directions
- The direct `validate.sh` producer emits the skipped JSON object on stdout after argument parsing.
- Adjacent 061 changelog type detection does not alter the 062 validation guard at the CLI entry point.
- Targeted search of `.github` for both switches, `HOOK_FLAGS_CONFIG`, and `SPECKIT_VALIDATION` returned no matches.

## Next focus
No further iteration: the configured cap of five was reached. Remediation planning is triggered by the active P1.

## Known context
The target packet is Level 2. Its `goal-file-manifest.txt` enumerates 127 paths spanning this validation packet and adjacent changelog work. Review passes focused on the target's contracts, shared readers, direct consumers, tests, docs, and a sample of the adjacent 061 work; the manifest was not reread file-by-file. The packet root had no `resource-map.md` at init. No tests, validators, or git operations were run by this review.

## Cross-reference status
| Protocol | Level | Status | Iteration | Notes |
|---|---|---|---:|---|
| spec_code | core | partial | 3, 5 | Progressive JSON wrapper breaks parseability on skip. |
| checklist_evidence | core | partial | 3, 5 | AC/task evidence reviewed but not rerun; checklist.md absent, AC_COVERAGE exempt. |
| skill_agent | overlay | notApplicable | 5 | No agent contract changed. |
| agent_cross_runtime | overlay | notApplicable | 5 | No agent cross-runtime surface changed. |
| feature_catalog_code | overlay | pass | 5 | Validation rule-engine description matches the producer behavior; wrapper gap remains separately recorded. |
| playbook_capability | overlay | notApplicable | 5 | No playbook capability changed. |

## Dimension expansion and boundary
Five directions were completed: correctness, security, requirement/consumer traceability, reader parity, and final adversarial replay. Convergence telemetry at iteration 2 was not allowed to end the run. Remaining scope debt: exhaustive file-by-file review of all 127 manifest entries.

## Review boundaries
- Max iterations: 5; stop policy: max-iterations
- Convergence threshold: 0.10; mode: default
- Session lineage: `fanout-luna-1790598126829-x9gy4v`; generation 1; lineageMode new
- Resource map at target init: absent; coverage gate skipped
- Final release readiness: release-blocking until the P1 is fixed or deferred with approval
- Completed: 2026-09-28T13:11:42Z
