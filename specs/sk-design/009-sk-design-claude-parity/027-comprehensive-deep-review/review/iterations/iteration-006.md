# Iteration 006 - design-interface Correctness + Security

## Dimension

- Iteration: 6 of 20
- Wave: 2
- Assigned scope: `.opencode/skills/sk-design/design-interface/**` only
- Dimensions: correctness, security
- Prior findings acknowledged: P0=0, P1=4, P2=2; none were in `design-interface` and none were recounted.

## Files Reviewed

- `.opencode/skills/sk-design/design-interface/SKILL.md:1`
- `.opencode/skills/sk-design/design-interface/SKILL.md:49`
- `.opencode/skills/sk-design/design-interface/SKILL.md:85`
- `.opencode/skills/sk-design/design-interface/SKILL.md:120`
- `.opencode/skills/sk-design/design-interface/SKILL.md:171`
- `.opencode/skills/sk-design/design-interface/SKILL.md:244`
- `.opencode/skills/sk-design/design-interface/README.md:1`
- `.opencode/skills/sk-design/design-interface/README.md:96`
- `.opencode/skills/sk-design/design-interface/references/design-process/transform_application.md:1`
- `.opencode/skills/sk-design/design-interface/references/design-process/transform_application.md:17`
- `.opencode/skills/sk-design/design-interface/references/design-process/transform_application.md:36`
- `.opencode/skills/sk-design/design-interface/references/design-process/brief_to_dials.md:1`
- `.opencode/skills/sk-design/design-interface/references/design-process/design_principles.md:60`
- `.opencode/skills/sk-design/design-interface/references/design-process/variation_diversity.md:1`
- `.opencode/skills/sk-design/design-interface/procedures/aesthetic_direction.md:1`
- `.opencode/skills/sk-design/design-interface/procedures/aesthetic_direction.md:23`
- `.opencode/skills/sk-design/design-interface/procedures/variation_set.md:1`
- `.opencode/skills/sk-design/design-interface/procedures/variation_set.md:23`
- `.opencode/skills/sk-design/design-interface/procedures/discovery_question_round.md:23`
- `.opencode/skills/sk-design/design-interface/procedures/wireframe_exploration.md:23`
- `.opencode/skills/sk-design/design-interface/procedures/prototype_flow_spec.md:23`
- `.opencode/skills/sk-design/design-interface/procedures/deck_direction_spec.md:23`
- `.opencode/skills/sk-design/design-interface/manual_testing_playbook/procedure-card-contract/direct-fallback-without-subagents.md:1`
- `.opencode/skills/sk-design/design-interface/manual_testing_playbook/procedure-card-contract/direct-fallback-without-subagents.md:41`
- Packet-wide `Glob` and `Grep` coverage over `.opencode/skills/sk-design/design-interface/**` for references, links, transform claims, and Write/Edit/Bash/Task boundary language.

## Findings by Severity

### P0

None.

### P1

#### P1-006-001 [P1] Transform verbs route to interface, but the transform contract is not reachable from the mode router

- Claim: `design-interface` advertises ownership of make-frame transform verbs, but the only transform-specific reference file is not listed in the mode's resource-loading table, parseable `RESOURCE_MAP`, references list, or procedure-card list. A routed `make it bolder/quieter/distill/clarify/delight` request can therefore enter interface without loading the keep/remove ledger, before/after proof, opt-out, and reduced-motion contract that the packet itself says governs transforms.
- EvidenceRefs: `.opencode/skills/sk-design/design-interface/SKILL.md:49` routes make-frame transform verbs such as `make it bolder`, `make it quieter`, `clarify this`, and `delight the interaction` to interface; `.opencode/skills/sk-design/design-interface/references/design-process/transform_application.md:17` says this file is the interface-side landing lane for transform verbs; `.opencode/skills/sk-design/design-interface/references/design-process/transform_application.md:36` through `.opencode/skills/sk-design/design-interface/references/design-process/transform_application.md:49` defines the shared proof contract; `.opencode/skills/sk-design/design-interface/SKILL.md:120` through `.opencode/skills/sk-design/design-interface/SKILL.md:132` lists the parseable `RESOURCE_MAP` without `references/design-process/transform_application.md`; `.opencode/skills/sk-design/design-interface/SKILL.md:85` lists conditional procedure support without the transform contract; `.opencode/skills/sk-design/design-interface/SKILL.md:244` through `.opencode/skills/sk-design/design-interface/SKILL.md:267` lists core references without the transform contract.
- CounterevidenceSought: Grep searched the whole packet for `transform_application`, transform phrases, and transform source names. The only in-skill route citation was `SKILL.md:49`; no `RESOURCE_MAP`, procedure list, README, feature catalog, or playbook reference makes the file loadable for transform prompts.
- AlternativeExplanation: The generic `design_principles.md` and `brief_to_dials.md` references might be intended to cover transforms. That does not close the defect because `transform_application.md` exists specifically for transform verbs and adds requirements that the generic references do not carry: keep/remove ledger, before/after proof, earned moment, opt-out, and reduced-motion proof.
- Finding class: cross-consumer
- Scope proof: Packet-wide Grep over `design-interface/**/*.md` for `transform_application|make it bolder|make it quieter|distill|clarify|delight` found transform routing in `SKILL.md` and the transform reference itself, but no inclusion in the mode router/resource map or operator-facing procedure inventory.
- Recommendation: Add `references/design-process/transform_application.md` to the human-readable resource-loading table, parseable `RESOURCE_MAP`, references section, and relevant catalog/playbook coverage for transform prompts, or remove the transform-route claim if transforms are not meant to be active.
- finalSeverity: P1
- Confidence: 0.88
- DowngradeTrigger: Downgrade to P2 or no finding if a non-packet router is confirmed to inject `references/design-process/transform_application.md` for these aliases before interface executes, or if the transform contract is intentionally unpublished and the `SKILL.md:49` transform-route claim is removed.

### P2

#### P2-006-001 [P2] Procedure cards cite source-reference filenames that do not exist in the packet

- Evidence: The six private procedure cards carry `Source reference` entries for legacy-looking filenames, but those filenames are not present under `.opencode/skills/sk-design/design-interface/**`: `frontend-aesthetic-direction.md` at `.opencode/skills/sk-design/design-interface/procedures/aesthetic_direction.md:23`, `generate-variations.md` at `.opencode/skills/sk-design/design-interface/procedures/variation_set.md:23`, `discovery-questions.md` at `.opencode/skills/sk-design/design-interface/procedures/discovery_question_round.md:23`, `wireframe.md` at `.opencode/skills/sk-design/design-interface/procedures/wireframe_exploration.md:23`, `make-a-prototype.md` at `.opencode/skills/sk-design/design-interface/procedures/prototype_flow_spec.md:23`, and `make-a-deck.md` at `.opencode/skills/sk-design/design-interface/procedures/deck_direction_spec.md:23`.
- Impact: This is an advisory correctness/reference defect. The cards themselves remain usable and explicitly read-only, but the source-reference field cannot be followed inside the packet and looks stale against the current reference-base layout.
- Finding class: class-of-bug
- Scope proof: Packet `Glob` showed the current procedure and reference files; packet-wide Grep found these six source-reference filenames only as procedure-card source labels, not as existing files or linked local references.
- Recommendation: Replace the source-reference labels with current local references or clarify that these are upstream provenance labels rather than in-packet files.

## Traceability Checks

- `spec_code`: PASS for assigned scope. Review stayed inside `.opencode/skills/sk-design/design-interface/**` for target evidence and did not review sibling `design-foundations` or hub internals.
- `checklist_evidence`: N/A. This leaf review wrote evidence artifacts only and did not update checklist completion.
- `skill_agent`: PASS. The packet entry point declares `allowed-tools: [Read, Grep, Glob]` at `.opencode/skills/sk-design/design-interface/SKILL.md:4`, and the direct-fallback contract repeats that no Write/Edit/Bash/Task is allowed at `.opencode/skills/sk-design/design-interface/SKILL.md:171`.
- `agent_cross_runtime`: PASS for this iteration. No sub-agents were dispatched; direct-fallback playbook coverage at `.opencode/skills/sk-design/design-interface/manual_testing_playbook/procedure-card-contract/direct-fallback-without-subagents.md:41` requires Read/Glob/Grep only.
- `feature_catalog_code`: PARTIAL. Catalog-to-code traceability is assigned to iteration 7; this pass only used catalog absence as supporting scope proof for the transform loading defect.
- `playbook_capability`: PARTIAL. The direct-fallback playbook supports the read-only boundary. Transform-specific playbook coverage was not found during this correctness/security pass and is covered by P1-006-001's resource reachability finding.

## Verdict

CONDITIONAL. One new P1 correctness finding was found in `design-interface`: transform aliases are documented as interface-owned, but their transform-specific contract is not reachable from the mode router/reference inventory. One P2 stale-reference advisory was also recorded. No P0 or direct security boundary violation was found; the packet repeatedly preserves the Read/Glob/Grep-only fallback boundary.

## Next Dimension

Iteration 7 should continue with the same packet's traceability, maintainability, and sk-doc conformance without re-counting P1-006-001 or P2-006-001 unless it confirms new evidence or a severity change.

Review verdict: CONDITIONAL
