# Deep Review Iteration 019

## Dimension

- Iteration: 19 of 20
- Wave: 5 final-wave re-verification
- Focus: correctness and traceability for cross-hub routing and metadata consistency
- Assignment boundary: `.opencode/skills/sk-design/hub-router.json`, `mode-registry.json`, `command-metadata.json`, `description.json`, and `graph-metadata.json`, checked against prior mode-level review findings from iterations 7, 9, 10, 11, 12, and 13.
- Doctrine loaded: `.opencode/skills/sk-code/code-review/references/review_core.md:28`

## Files Reviewed

- `.opencode/skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:166`
- `.opencode/skills/sk-code/code-review/references/review_core.md:28`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-config.json:44`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-findings-registry.json:133`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-strategy.md:73`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-007.md:68`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-009.md:43`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-010.md:41`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-011.md:37`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-012.md:57`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-013.md:48`
- `.opencode/skills/sk-design/hub-router.json:27`
- `.opencode/skills/sk-design/hub-router.json:84`
- `.opencode/skills/sk-design/mode-registry.json:38`
- `.opencode/skills/sk-design/mode-registry.json:50`
- `.opencode/skills/sk-design/mode-registry.json:71`
- `.opencode/skills/sk-design/mode-registry.json:92`
- `.opencode/skills/sk-design/mode-registry.json:113`
- `.opencode/skills/sk-design/mode-registry.json:134`
- `.opencode/skills/sk-design/mode-registry.json:145`
- `.opencode/skills/sk-design/command-metadata.json:49`
- `.opencode/skills/sk-design/command-metadata.json:213`
- `.opencode/skills/sk-design/command-metadata.json:377`
- `.opencode/skills/sk-design/command-metadata.json:631`
- `.opencode/skills/sk-design/command-metadata.json:772`
- `.opencode/skills/sk-design/description.json:3`
- `.opencode/skills/sk-design/description.json:42`
- `.opencode/skills/sk-design/graph-metadata.json:83`
- `.opencode/skills/sk-design/graph-metadata.json:142`

## Findings by Severity

### P0

- None.

### P1

#### P1-019-001 [P1] `command-metadata.json` systematically omits workflow procedure-card surfaces

- Claim: The accumulated mode-level findings are not isolated maintenance misses. The command metadata projection pattern omits every command-backed workflow mode's declared `proceduresPath`, so `/design:*` command choreography can drift from the procedure-card routing/proof contract even when `mode-registry.json` correctly declares the procedure surfaces.
- Evidence: `mode-registry.json` declares `proceduresPath` for all five command-backed workflow modes: interface at `.opencode/skills/sk-design/mode-registry.json:50`, foundations at `.opencode/skills/sk-design/mode-registry.json:71`, motion at `.opencode/skills/sk-design/mode-registry.json:92`, audit at `.opencode/skills/sk-design/mode-registry.json:113`, and md-generator at `.opencode/skills/sk-design/mode-registry.json:134`.
- Evidence: Each corresponding command choreography loads the packet `SKILL.md` and then only the packet `references/` surface, with no `procedures/` or `shared/procedures/` projection: audit at `.opencode/skills/sk-design/command-metadata.json:49` through `.opencode/skills/sk-design/command-metadata.json:52`, foundations at `.opencode/skills/sk-design/command-metadata.json:213` through `.opencode/skills/sk-design/command-metadata.json:216`, interface at `.opencode/skills/sk-design/command-metadata.json:377` through `.opencode/skills/sk-design/command-metadata.json:380`, md-generator at `.opencode/skills/sk-design/command-metadata.json:631` through `.opencode/skills/sk-design/command-metadata.json:634`, and motion at `.opencode/skills/sk-design/command-metadata.json:772` through `.opencode/skills/sk-design/command-metadata.json:775`.
- Evidence: A JSON-surface search for `design-*/procedures`, `shared/procedures`, or `procedure-card` under the sk-design JSON metadata matched `mode-registry.json` only, not `command-metadata.json`; this corroborates that the omission is systemic in the command projection rather than isolated to foundations, audit, or motion.
- Evidence: Prior mode-level reviews already confirmed the same symptom independently for foundations (`iteration-009.md:43`), audit (`iteration-010.md:41` and `iteration-011.md:37`), and motion (`iteration-012.md:57` and `iteration-013.md:48`). Interface's prior traceability pass separately found a command projection gap for transform-specific guidance at `iteration-007.md:68`, and this re-check shows its command choreography has the same no-procedures shape.
- Counterevidence sought: Checked whether `taskProjections`, `proofFields`, or command choreography compensate by naming procedure-card resources. Foundations and audit expose task projections for specific verbs but not procedure cards, interface exposes transform projections but not its six procedure cards, md-generator has empty `taskProjections`, and motion has empty `taskProjections`.
- Alternative explanation: The command runner may treat the packet `SKILL.md` load as sufficient because the packet can itself discover procedures. That would make the JSON omission less severe as runtime behavior, but it still contradicts the explicit metadata projection role being used for command choreography and has already produced repeated per-mode P1 traceability findings.
- Final severity: P1.
- Confidence: 0.88.
- Downgrade trigger: Downgrade to P2 if the command metadata schema is explicitly documented to intentionally omit private procedure-card surfaces for all modes, and the command runner is proven to always load and enforce procedure-card selection from `SKILL.md` regardless of `command-metadata.json` resource projections.

### P2

- None new. Existing P2-003 still covers `graph-metadata.json` derived facets omitting Open Design transport terms and was not re-counted.

## Traceability Checks

- `command-metadata pattern check`: FAIL with new systemic finding. The prior per-mode findings for foundations, audit, and motion are symptoms of a shared command metadata maintenance/generation gap, not isolated packet mistakes.
- `full router-table re-check`: PASS. `hub-router.json` still has six router signal entries with resources for interface, foundations, motion, audit, md-generator, and design-mcp-open-design at `.opencode/skills/sk-design/hub-router.json:27` through `.opencode/skills/sk-design/hub-router.json:90`; the remaining vocabulary classes cover the assigned modes through `.opencode/skills/sk-design/hub-router.json:397` through `.opencode/skills/sk-design/hub-router.json:409` for the transport axis. No mode-level finding changed the hub routing correctness picture.
- `mode-registry parity`: PASS. `mode-registry.json` still enumerates five `packetKind:"workflow"` modes and one `packetKind:"transport"` mode at `.opencode/skills/sk-design/mode-registry.json:38` through `.opencode/skills/sk-design/mode-registry.json:163`; packet names, commands, procedure paths, and transport no-command status remain coherent.
- `description.json freshness`: PASS. The description includes all six modes, distinguishes five workflow modes from the Open Design transport, and includes Open Design keywords at `.opencode/skills/sk-design/description.json:3` and `.opencode/skills/sk-design/description.json:42` through `.opencode/skills/sk-design/description.json:46`.
- `graph-metadata.json freshness`: PARTIAL existing advisory only. Derived trigger phrases and key topics still emphasize the five design/workflow modes and md-generator at `.opencode/skills/sk-design/graph-metadata.json:83` through `.opencode/skills/sk-design/graph-metadata.json:156`; this matches already-filed P2-003 and is not counted as a new finding.
- `spec_code`: PASS with finding. The reviewed metadata matches the hub mode set, but command metadata fails the procedure-card projection contract.
- `checklist_evidence`: N/A. This leaf review produced evidence artifacts only and did not modify checklist completion state.
- `skill_agent`: PASS. No sub-agents were dispatched.
- `agent_cross_runtime`: N/A. The target is skill hub metadata, not runtime agent definitions.
- `feature_catalog_code`: PARTIAL. Hub feature catalog and manual testing playbook evidence corroborate that procedure-card selection is a live hub feature, but detailed feature-file review is outside this iteration's disjoint assignment.
- `playbook_capability`: PARTIAL. Playbook procedure-card scenarios corroborate impact; no playbook files were reviewed for standalone findings in this cross-hub metadata pass.

## Verdict

CONDITIONAL. One new P1 cross-cutting command-metadata process finding was found. No new P0s or P2s were found; existing graph metadata freshness advisory was not re-counted.

## Next Dimension

Iteration 20 should complete the final sk-doc template sweep without re-reviewing these cross-hub metadata files. The wave-level reducer should merge P1-019-001 as the systemic parent/process finding for the already-filed foundations, audit, and motion command-metadata omissions.

Review verdict: CONDITIONAL
