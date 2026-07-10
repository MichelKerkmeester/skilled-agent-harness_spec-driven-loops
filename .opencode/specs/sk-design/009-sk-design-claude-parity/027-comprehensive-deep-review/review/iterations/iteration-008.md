# Iteration 008 - design-foundations Correctness + Security

## Dimension

- Focus: correctness and security for `.opencode/skills/sk-design/design-foundations/**`.
- Assignment boundary: reviewed the design-foundations packet only, plus required comparison inputs `mode-registry.json`, prior review state, findings registry, strategy, and review doctrine.
- Prior-state handling: `deep-review-state.jsonl` and `deltas/iter-005.jsonl` already contain the same tool-surface P1 under the title `Foundations contrast proof requires a script that the registry forbids`; this iteration confirms it but does not recount it as a new finding.

## Files Reviewed

- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-findings-registry.json:9`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-strategy.md:214`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-state.jsonl:4`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deltas/iter-005.jsonl:2`
- `.opencode/skills/sk-code/code-review/references/review_core.md:28`
- `.opencode/skills/sk-design/mode-registry.json:26`
- `.opencode/skills/sk-design/mode-registry.json:64`
- `.opencode/skills/sk-design/design-foundations/SKILL.md:4`
- `.opencode/skills/sk-design/design-foundations/SKILL.md:91`
- `.opencode/skills/sk-design/design-foundations/SKILL.md:93`
- `.opencode/skills/sk-design/design-foundations/SKILL.md:103`
- `.opencode/skills/sk-design/design-foundations/SKILL.md:259`
- `.opencode/skills/sk-design/design-foundations/SKILL.md:274`
- `.opencode/skills/sk-design/design-foundations/assets/contrast_pair_inventory.md:15`
- `.opencode/skills/sk-design/design-foundations/procedures/tweakable_design_controls.md:29`
- `.opencode/skills/sk-design/design-foundations/procedures/component_system_inventory.md:29`
- `.opencode/skills/sk-design/design-foundations/procedures/hierarchy_rhythm_review.md:29`
- `.opencode/skills/sk-design/design-foundations/scripts/contrast_check.py:94`
- `.opencode/skills/sk-design/design-foundations/scripts/baseline_rhythm_check.py:205`
- `.opencode/skills/sk-design/design-foundations/scripts/naming_doc_check.py:294`
- `.opencode/skills/sk-design/design-foundations/feature_catalog/feature_catalog.md:103`
- `.opencode/skills/sk-design/design-foundations/manual_testing_playbook/01--color/contrast-pair-inventory-before-audit.md:64`
- `.opencode/skills/sk-design/design-foundations/references/color/oklch_workflow.md:58`
- `.opencode/skills/sk-design/design-foundations/README.md:128`

## Findings by Severity (P0)

- None.

## Findings by Severity (P1)

- No new P1 findings counted in this iteration.
- Confirmed prior P1 from `iter-005`: `Foundations contrast proof requires a script that the registry forbids`.
- Claim: the foundations mode is declared read-only/no-Bash, but its mandatory contrast proof path requires running `scripts/contrast_check.py` through `python3`.
- Evidence: registry allows only `Read`, `Glob`, and `Grep` and forbids `Bash` for foundations at `.opencode/skills/sk-design/mode-registry.json:64`; packet frontmatter matches that read-only surface at `.opencode/skills/sk-design/design-foundations/SKILL.md:4`; the runtime loading table makes changed foreground/background proof mandatory and says every ratio is computed by `scripts/contrast_check.py` at `.opencode/skills/sk-design/design-foundations/SKILL.md:93`; the worksheet repeats the `python3 ../scripts/contrast_check.py` requirement and says it exits non-zero on body contrast failure at `.opencode/skills/sk-design/design-foundations/assets/contrast_pair_inventory.md:15`; direct fallback says the mode cannot rely on `Write`, `Edit`, `Bash`, or `Task` at `.opencode/skills/sk-design/design-foundations/SKILL.md:274`.
- Counterevidence sought: reviewed all three `procedures/` cards. They are read-only compatible and do not require command execution, but they also do not provide an alternate read-only calculator for mandatory color-pair proof. Reviewed `contrast_check.py`; it is a real executable script with CLI usage and non-zero gate semantics, not just a documentation example.
- Alternative explanation: the registry may intend to describe only workspace mutation, but it explicitly places `Bash` in `forbidden`, while the packet requires command execution for a ready/handoff proof path.
- Final severity: P1, confirmed from prior state and not recounted as a new finding.
- Confidence: high.
- Downgrade trigger: downgrade if the packet documents a genuinely read-only/user-supplied contrast proof path, makes script execution optional, or updates the registry/tool surface to allow the required Bash proof without mutating workspace.

## Findings by Severity (P2)

- None.

## Correctness Notes

- Tool-surface parity: real contradiction, not a false alarm. The public mode declares read-only operation, but the color contrast path has a mandatory script-backed proof gate.
- Procedure scope: the three private procedure cards themselves preserve read-only behavior, so the contradiction is concentrated in the color/contrast proof path rather than the procedure-card selection mechanism.
- Transform verbs: no contradiction found for `typeset` and `colorize`. `mode-registry.json` states `excludedAliases` governs free-text transform-verb framing, and foundations owns typography/color system work through its static-system triggers and references.

## Security Notes

- No new security finding. The confirmed contradiction exposes a forbidden execution surface, but the reviewed `contrast_check.py` path takes color literals from argv and performs numeric parsing/printing without shell composition or file writes.
- Adjacent optional scripts read caller-supplied markdown paths, but the reviewed lines do not show shell execution or workspace mutation. That does not change the tool-surface P1 because the mandatory contrast proof still needs Bash under the current registry.

## Traceability Checks

- `spec_code`: PASS. Assigned packet exists and the reviewed evidence stays within `.opencode/skills/sk-design/design-foundations/**` except for required registry/state/doctrine comparison inputs.
- `checklist_evidence`: N/A. This leaf review wrote evidence artifacts only and did not update checklist completion.
- `skill_agent`: PASS. Packet frontmatter and mode-registry agree at the coarse allowed-tool level, but the confirmed contrast proof path contradicts that shared declaration.
- `agent_cross_runtime`: N/A for this iteration. No agents were dispatched.
- `feature_catalog_code`: PARTIAL. Feature catalog claims Read/Glob/Grep-only operation for procedure cards; that remains true for procedures but incomplete for mandatory contrast proof.
- `playbook_capability`: PASS with caveat. The color playbook expects contrast inventory before handoff and includes command-backed discovery/proof evidence, supporting the P1 classification rather than refuting it.

## Verdict

CONDITIONAL. No new findings were counted, but this iteration confirms an active prior P1 in the assigned design-foundations correctness/security focus.

## Next Dimension

Iteration 9 should continue the same packet's traceability/maintainability/sk-doc pass without recounting this P1 unless it adds genuinely new evidence or changes severity.

Review verdict: CONDITIONAL
