# Deep Review Iteration 003

## Dimension

Security + maintainability for assigned hub shared infrastructure and benchmark artifacts only.

Scope reviewed:

- `.opencode/skills/sk-design/shared/**`
- `.opencode/skills/sk-design/benchmark/**`

Out of scope by dispatch contract:

- Hub tier root files.
- Feature catalog, changelog, and manual testing playbook directories.
- Mode packet internals outside the assigned shared/benchmark trees.
- Fix implementation.

## Files Reviewed

Shared files:

- `.opencode/skills/sk-design/shared/assets/context_loaded_card.md:1`
- `.opencode/skills/sk-design/shared/assets/proof_of_application_card.md:1`
- `.opencode/skills/sk-design/shared/assets/register_card.md:1`
- `.opencode/skills/sk-design/shared/assets/variant_parameter_contract.md:1`
- `.opencode/skills/sk-design/shared/anti_slop_principles.md:1`
- `.opencode/skills/sk-design/shared/cognitive_laws.md:1`
- `.opencode/skills/sk-design/shared/context_loading_contract.md:1`
- `.opencode/skills/sk-design/shared/design_dispatch_boundary.md:1`
- `.opencode/skills/sk-design/shared/design_proof_token.md:1`
- `.opencode/skills/sk-design/shared/design_token_vocabulary.md:1`
- `.opencode/skills/sk-design/shared/numeric_design_laws.md:1`
- `.opencode/skills/sk-design/shared/procedure_card_schema.md:1`
- `.opencode/skills/sk-design/shared/procedures/polish_gate_orchestration.md:1`
- `.opencode/skills/sk-design/shared/register.md:1`
- `.opencode/skills/sk-design/shared/sk_code_handoff.md:1`
- `.opencode/skills/sk-design/shared/scripts/ai-fingerprint-fixture-check.mjs:1`
- `.opencode/skills/sk-design/shared/scripts/ai-fingerprint-registry-check.mjs:1`
- `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:1`
- `.opencode/skills/sk-design/shared/scripts/md_table.py:1`
- `.opencode/skills/sk-design/shared/scripts/numeric_law_check.py:1`
- `.opencode/skills/sk-design/shared/scripts/procedure-card-schema-check.mjs:1`
- `.opencode/skills/sk-design/shared/scripts/proof_check.py:1`
- `.opencode/skills/sk-design/shared/scripts/variant_parameter_check.py:1`

Benchmark files:

- `.opencode/skills/sk-design/benchmark/README.md:1`
- `.opencode/skills/sk-design/benchmark/after-009/report.md:1`
- `.opencode/skills/sk-design/benchmark/after-009/report.json:1`
- `.opencode/skills/sk-design/benchmark/after-012-routing-rigor/report.md:1`
- `.opencode/skills/sk-design/benchmark/after-012-routing-rigor/report.json:1`
- `.opencode/skills/sk-design/benchmark/after-016-hub-routing/report.md:1`
- `.opencode/skills/sk-design/benchmark/after-016-hub-routing/report.json:1`
- `.opencode/skills/sk-design/benchmark/after-018-transport-integration/report.md:1`
- `.opencode/skills/sk-design/benchmark/after-018-transport-integration/report.json:1`
- `.opencode/skills/sk-design/benchmark/after-022-coverage-fill/report.md:1`
- `.opencode/skills/sk-design/benchmark/after-022-coverage-fill/report.json:1`
- `.opencode/skills/sk-design/benchmark/after-d3-proxy/skill-benchmark-report.md:1`
- `.opencode/skills/sk-design/benchmark/after-d3-proxy/skill-benchmark-report.json:1`
- `.opencode/skills/sk-design/benchmark/baseline/skill-benchmark-report.md:1`
- `.opencode/skills/sk-design/benchmark/baseline/skill-benchmark-report.json:1`

Supporting review doctrine and state files read:

- `.opencode/skills/sk-code/code-review/references/review_core.md:28`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-strategy.md:44`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-findings-registry.json:11`

## Findings by Severity

### P0

None.

### P1

#### P1-003-001 [P1] Source-proof validation accepts proof-card paths without repository containment

- Claim: `proof_check.py --require-source-proof` validates source-proof rows by opening `root / row["path"]` without rejecting absolute paths or `..` traversal, so a proof card can satisfy the source-proof gate using files outside the intended repository/source boundary.
- Evidence refs: `.opencode/skills/sk-design/shared/scripts/proof_check.py:84`, `.opencode/skills/sk-design/shared/scripts/proof_check.py:113`, `.opencode/skills/sk-design/shared/scripts/proof_check.py:261`, `.opencode/skills/sk-design/shared/scripts/proof_check.py:282`, `.opencode/skills/sk-design/shared/scripts/proof_check.py:299`, `.opencode/skills/sk-design/shared/assets/context_loaded_card.md:74`, `.opencode/skills/sk-design/shared/assets/context_loaded_card.md:76`, `.opencode/skills/sk-design/shared/assets/proof_of_application_card.md:106`.
- Evidence: Source proof rows are parsed directly from the markdown table into `row["path"]`; `_repo_root()` finds a repo root from the proof-card path, but `_validate_source_proof()` then opens `root / row["path"]` without normalizing and checking that the resulting path remains inside `root`. The fill-in cards document `--require-source-proof` as the deterministic gate that verifies cited source files by hash and literal echo.
- Counterevidence sought: Searched the assigned shared scripts for containment helpers (`relative_to`, `is_absolute`, parent checks, prefix checks) and found no containment guard in the source-proof path flow. `_repo_root()` constrains the base root, not the resolved row path.
- Alternative explanation: The tool may be intended for trusted local notes only, and it reads rather than writes. That reduces exploitability but does not remove the integrity bug: the gate's purpose is to prove cited local source evidence, and unconstrained paths let externally controlled proof-card content move evidence outside the intended boundary.
- Finding class: cross-consumer.
- Scope proof: The issue is isolated to source-proof validation; other shared scripts searched in this pass did not contain shell execution or write primitives, and this path is the only source-proof file-opening flow found in `shared/scripts`.
- Affected surface hints: `proof_check.py`, `context_loaded_card.md`, `proof_of_application_card.md`, source-proof cards, design evidence gates.
- Final severity: P1.
- Confidence: 0.87.
- Downgrade trigger: Downgrade to P2 if the owning workflow formally declares proof-card source rows fully trusted and outside any user/model-controlled handoff, or if an existing wrapper already enforces repository-relative paths before invoking this script.

#### P1-003-002 [P1] Live benchmark reports carry Mode-A caveats and PASS verdicts alongside P1 browser bottlenecks

- Claim: Several benchmark artifacts marked as live-mode reports are internally inconsistent: they declare `mode-b-live`/`trace mode: live`, then still say D1-inter and D4 are `_unscored-mode-a_` and need live mode, while also reporting a PASS verdict despite P1 browser funnel attrition rows.
- Evidence refs: `.opencode/skills/sk-design/benchmark/README.md:20`, `.opencode/skills/sk-design/benchmark/README.md:21`, `.opencode/skills/sk-design/benchmark/README.md:34`, `.opencode/skills/sk-design/benchmark/README.md:37`, `.opencode/skills/sk-design/benchmark/README.md:49`, `.opencode/skills/sk-design/benchmark/after-018-transport-integration/report.md:3`, `.opencode/skills/sk-design/benchmark/after-018-transport-integration/report.md:5`, `.opencode/skills/sk-design/benchmark/after-018-transport-integration/report.md:16`, `.opencode/skills/sk-design/benchmark/after-018-transport-integration/report.md:20`, `.opencode/skills/sk-design/benchmark/after-018-transport-integration/report.md:23`, `.opencode/skills/sk-design/benchmark/after-018-transport-integration/report.md:35`, `.opencode/skills/sk-design/benchmark/after-018-transport-integration/report.md:41`, `.opencode/skills/sk-design/benchmark/after-022-coverage-fill/report.md:3`, `.opencode/skills/sk-design/benchmark/after-022-coverage-fill/report.md:5`, `.opencode/skills/sk-design/benchmark/after-022-coverage-fill/report.md:16`, `.opencode/skills/sk-design/benchmark/after-022-coverage-fill/report.md:20`, `.opencode/skills/sk-design/benchmark/after-022-coverage-fill/report.md:23`, `.opencode/skills/sk-design/benchmark/after-022-coverage-fill/report.md:35`, `.opencode/skills/sk-design/benchmark/after-022-coverage-fill/report.md:41`.
- Evidence: The benchmark README defines router mode as deterministic CI baseline and live mode as the operator default for a true routing verdict, with D1-inter/D4 unscored in router mode. However, live reports such as `after-018-transport-integration` and `after-022-coverage-fill` still contain Mode-A unscored labels and "need live mode" caveats despite already declaring `trace mode: live`. The same reports declare PASS while listing a P1 `funnel_attrition` browser bottleneck.
- Counterevidence sought: The README clearly marks `baseline/` as the frozen comparison anchor and tells operators to add sibling baselines rather than overwrite it, so stale baseline trust is not the issue. The inconsistency is inside generated sibling reports that are otherwise presented as benchmark evidence.
- Alternative explanation: The PASS verdict may be aggregate-score-only and the P1 row may be an advisory bottleneck. If so, the report needs to label that explicitly; as written, a live evidence artifact contains mutually contradictory mode and severity semantics.
- Finding class: matrix/evidence.
- Scope proof: Grep across assigned `benchmark/*.md` found the same live-mode/Mode-A caveat pattern in at least `after-016-hub-routing`, `after-018-transport-integration`, and `after-022-coverage-fill`; router baseline reports legitimately carry the Mode-A caveat.
- Affected surface hints: benchmark reports, live routing verdict evidence, benchmark README semantics, deep-improvement report generator output.
- Final severity: P1.
- Confidence: 0.82.
- Downgrade trigger: Downgrade to P2 if benchmark consumers are documented to ignore live sibling reports for release decisions and only use `baseline/skill-benchmark-report.json` as an active gate.

### P2

None.

## Traceability Checks

- `spec_code`: PASS for assigned scope. `deep-review-strategy.md:44-46` assigns iteration 3 to `shared/**` and `benchmark/**`; this pass did not review outside that scope.
- `checklist_evidence`: N/A. This review produced evidence artifacts only and did not update checklist completion.
- `skill_agent`: PASS. Shared dispatch boundary documentation keeps agent/small-model proof mechanical and explicitly separates proof survival from design-quality claims at `.opencode/skills/sk-design/shared/design_dispatch_boundary.md:95` and `.opencode/skills/sk-design/shared/design_dispatch_boundary.md:115`.
- `agent_cross_runtime`: PARTIAL. Shared boundary and context-loading docs were sampled; mode-specific runtime agents were outside this iteration's assignment.
- `feature_catalog_code`: N/A. Feature catalog files are assigned to sibling iteration 4.
- `playbook_capability`: PARTIAL. Benchmark README ties reports to the manual testing playbook corpus at `.opencode/skills/sk-design/benchmark/README.md:18`; detailed playbook capability review is assigned elsewhere.

## Scope Violations

None. Reviewed target files remained read-only. Only the allowed iteration narrative, state JSONL append, and delta file are written by this iteration.

## Verdict

CONDITIONAL. Two new P1 findings were recorded in the assigned shared/benchmark scope.

## Next Dimension

Continue Wave 1 parallel coverage without duplicating this scope. Future benchmark follow-up should check the report generator outside this assignment if remediation is authorized.

Review verdict: CONDITIONAL
