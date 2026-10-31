# Deep Review - Iteration 4 (maintainability)

## Dispatcher
Resolved route: mode=review, target_agent=@deep-review, execution=single_review_iteration, state_source=externalized_files. The agent definition `.skilled/agents/deep-review.md` was read before review (agent_definition_loaded: true). Session `2026-09-26T17:35:08Z`, generation 1, lineageMode `new`. Budget profile: `scan`, hard ceiling 13 tool calls. Per the STATE RECORDING clause of this dispatch, `append-mode-event.cjs` was NOT invoked and `deep-review-state.jsonl` was NOT written: the orchestrator records this iteration from the first line of `deltas/iter-004.jsonl`, which carries the complete iteration record.

## Dimension
maintainability. The dispatch set the bar: perfect sk-doc alignment of the skill and its manual testing playbook, finding what the automated gates do not check. The gates were not re-run per the dispatch; the orchestrator baseline measured this session is `validate-playbook-package.cjs` PASS (8 scenarios, 0 violations, 0 warnings), `validate_skill_package.py` PASS, and `validate_document.py` 0 issues on every published file. Five angles were swept: (1) structure against the `sk-create-skill/assets/skill/` templates; (2) the playbook against `sk-create-manual-testing-playbook/` SKILL.md sections 3 and 6, its two templates and `references/prompt-voice.md`; (3) the three changelogs against `sk-create-changelog/` plus version agreement across SKILL.md, README.md, the changelogs and `mode-registry.json`; (4) the HVR hard blockers in the mode's prose; (5) duplicated rule text and follow-on change cost.

## Files Reviewed
- `.skilled/skills/sk-doc/sk-create-goal/SKILL.md` - full read against `skill-md-template.md` (required sections, order, frontmatter keys).
- `.skilled/skills/sk-doc/sk-create-goal/README.md` - full read against `skill-readme-template.md` (body line-anchored from line 85).
- `.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md` - all 95 lines read.
- `.skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md`, `references/parent-and-nested-goals.md` - frontmatter and heading structure read.
- `.skilled/skills/sk-doc/sk-create-goal/assets/goal-exemplars.md`, `assets/goal-top-level-template.md`, `assets/goal-phase-parent-template.md`, `assets/goal-phase-child-template.md` - frontmatter blocks read, template bodies spot-checked.
- `.skilled/skills/sk-doc/sk-create-goal/changelog/v1.0.0.0.md`, `v1.1.0.0.md`, `v1.2.0.0.md` - full read against the changelog format contract.
- `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/manual-testing-playbook.md` - full read of sections 1-6 and all eight root summary prompts.
- All eight `manual-testing-playbook/goal-authoring/*.md` - field sweep of Real user request, Prompt, Pass/fail and the execution table header.
- `.skilled/skills/sk-doc/sk-create-skill/assets/skill/{skill-md-template,skill-readme-template,skill-reference-template,skill-asset-template}.md` - required-structure and frontmatter rules read.
- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md` (sections 3, 6, 7), `assets/manual-testing-playbook-snippet-template.md`, `references/prompt-voice.md` - read.
- `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` (format contract at section 5, validation at section 9), `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` (contextType enum), `.skilled/skills/sk-doc/mode-registry.json` (sk-create-goal entries).

## Findings by Severity (New)

### P0 (Critical)
None.

### P1 (Major)
None.

### P2 (Minor)

1. **R4-P2-001 - `contextType: reference` is outside the four-value enum in seven published files** -- `.skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md:10` -- The governing enum is `sk-create-frontmatter/assets/frontmatter-templates.md:373`: `| contextType | Enum | planning | research | implementation | general |`, and `sk-create-skill/assets/skill/skill-reference-template.md:84` repeats it ("contextType is one of planning|research|implementation|general"). Seven files read `contextType: reference`: `references/authoring-standards.md:10`, `references/budget-and-handoff.md:10`, `references/parent-and-nested-goals.md:11`, `assets/goal-exemplars.md:9`, `assets/goal-top-level-template.md:10`, `assets/goal-phase-parent-template.md:10`, `assets/goal-phase-child-template.md:10`. Impact: both create-skill templates state the Skill Advisor harvests this block as routing signal, so an out-of-enum value either drops or mis-buckets seven of the mode's ten frontmatter-bearing documents, and no gate catches it - `validate_document.py` reports 0 issues on every one of these files. It is the widest template-alignment gap in the mode, and the repair itself is a seven-file edit. Fix: replace the value in all seven files with an enum member - `contextType: general` matches the reference and asset examples in the templates; `contextType: implementation` fits the workflow-carrying references. **Finding class:** template_contract_drift. **Scope proof:** all cited files are inside the declared 89-file review scope. **Affected surface hints:** Skill Advisor routing harvest, the `sk-create-skill` reference/asset frontmatter contract, any future reference or asset added to this mode.

2. **R4-P2-002 - SKILL.md restates and mis-orders the cut order that `budget-and-handoff.md` section 3 owns as "the one full cut order"** -- `.skilled/skills/sk-doc/sk-create-goal/SKILL.md:108` -- `references/budget-and-handoff.md:17` says "Section 3 is the one full cut order and section 4 the one full rule for what a parent goal sent in chat contains. Other documents point here rather than restating them." Yet SKILL.md HOW IT WORKS step 6 restates the order: "If a parent is over budget, remove repeated child detail and compress decision prose first. Shorten criterion wording only when needed. Never remove a criterion or make one uncheckable." The canonical order at `budget-and-handoff.md:41-46` runs six steps: frontmatter check (1), log check (2), removal of legacy author instructions (3), then repeated child detail (4), decision prose (5), criterion wording (6). SKILL.md's "first" names steps 4-5 as the opening moves and silently omits step 3 - the step `changelog/v1.2.0.0.md` introduced. `README.md:98` shows the intended pattern: "Cut in the order section 3 of budget-and-handoff.md gives". Impact: one rule now lives in two places and must change twice; the copy in the mode's own contract is already one release stale, so a reader who follows SKILL.md alone skips the three canonical opening steps. Fix: replace the restated order in step 6 with a pointer - "If a parent is over budget, cut it in the [`references/budget-and-handoff.md`](references/budget-and-handoff.md) section 3 order and rerun the packet report after the cuts. Never remove a criterion or make one uncheckable." **Finding class:** duplicated_rule_text. **Scope proof:** both files are inside the declared 89-file review scope. **Affected surface hints:** SKILL.md HOW IT WORKS step 6, the `/create:goal` amend operation, `cut-over-budget-parent.md`, which grades "the documented cut order".

3. **R4-P2-003 - README's release-notes row names only `changelog/v1.0.0.0.md` although the mode is at 1.2.0.0** -- `.skilled/skills/sk-doc/sk-create-goal/README.md:183` -- The last row of README's related-resources table reads `changelog/v1.0.0.0.md | Release notes for this mode`, while `changelog/v1.1.0.0.md` and `changelog/v1.2.0.0.md` also exist and README's own frontmatter is `version: 1.2.0.0` (`README.md:11`). Impact: the index already missed two consecutive releases, so the failure is observed rather than hypothetical; a reader following README's release-notes pointer never reaches the v1.2.0.0 send-rule and cut-order changes this release depends on. Fix: point the row at the directory - `changelog/ | Release notes for this mode, newest first` - or add the two missing rows and record that each release adds one. **Finding class:** stale_pointer. **Scope proof:** README.md is inside the declared 89-file review scope. **Affected surface hints:** README related-resources table, the release procedure, where `sk-create-changelog` output lands.

4. **R4-P2-004 - `changelog/v1.0.0.0.md` ships a different changelog shape and carries no Upgrade section** -- `.skilled/skills/sk-doc/sk-create-goal/changelog/v1.0.0.0.md:12` -- `sk-create-changelog/SKILL.md:247` defines compact format as "summary, at-a-glance bullets, Upgrade" and `sk-create-changelog/SKILL.md:465` requires "Compact files include the summary narrative, `## What's New at a Glance` and `## Upgrade`". `v1.0.0.0.md` instead opens `## What Changed` with `#### New Features` and `#### Notes` and has no `## Upgrade` or `## Upgrade Notes` section at all, while its two siblings follow the compact contract (`## What's New at a Glance` at `v1.1.0.0.md:11` and `v1.2.0.0.md:11`, each followed by `## Upgrade`). The changelog creation workflow also requires that "upgrade guidance is present" (`sk-create-changelog/SKILL.md:385`). Impact: one directory speaks two shapes, so a reader or tool keyed to the format contract cannot parse the first release, and the absent Upgrade guidance fails the changelog skill's own pre-delivery check. Fix: retitle `## What Changed` to `## What's New at a Glance`, fold `#### Notes` into the bullet list, and add `## Upgrade` with "No migration required." (accurate for that release). **Finding class:** format_contract_drift. **Scope proof:** the three changelogs are inside the declared 89-file review scope. **Affected surface hints:** changelog consumers, the release procedure, `sk-create-changelog` validation item 8.

5. **R4-P2-005 - SCG-007's `Real user request` is the canonical prompt verbatim and carries `$SCRATCH`, losing the voice baseline** -- `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/route-session-goal-away.md:29` -- Lines 29 and 30 hold identical text ("Set the goal for $SCRATCH/specs/demo-packet to ship the demo counter this week and resend it so this session picks it up."), where every other scenario's `Real user request` is a plain-English paraphrase without shell variables (for example `top-level-goal.md:29`). `sk-create-manual-testing-playbook/references/prompt-voice.md` states "The `Real user request:` field is always natural-human and serves as the voice reference baseline", and the playbook root's global precondition 2 shows `$SCRATCH` is substituted before a prompt is sent, so no real user types it. Impact: the one scenario testing the redirect boundary - the case where voice and role matter most - carries no natural-human request to calibrate against, and an editor copying this file learns the wrong pattern. The operator validator checks only that the field exists, never its voice, so every automated gate passes this. Fix: give the file a distinct request, for example "Set the goal for my demo packet to ship the demo counter this week and resend it so this session picks it up.", keeping the canonical `Prompt:` unchanged. **Finding class:** voice_contract_drift. **Scope proof:** the scenario file is inside the declared 89-file review scope. **Affected surface hints:** `Real user request` fields across the playbook, the RCAF-versus-natural default split in `prompt-voice.md`, scenario authors copying SCG-007.

## Traceability Checks
- playbook_capability (overlay): the nine display fields are present in every scenario execution table (Feature ID, Feature Name, Scenario Name / Objective, Exact Prompt, Exact Command Sequence, Expected Signals, Evidence, Pass/Fail Criteria, Failure Triage at each scenario's table header), and all eight root summary prompts match their scenario contract and section 3 copies word for word (root playbook summary lines 31, 49, 67, 85, 103, 121, 139, 157).
- skill_agent (overlay): `.skilled/agents/deep-review.md` loaded as the agent definition; the mode's RULES subsections match the create-skill template naming requirement (ALWAYS, NEVER, ESCALATE IF).
- agent_cross_runtime: not exercised this iteration; the mirror-link defect R3-P2-002 raised in iteration 3 remains open and was not re-entered.
- feature_catalog_code: not applicable - the package ships no `feature-catalog/`, and the root playbook records that absence per scenario.
- spec_code and checklist_evidence (core protocols): not exercised - this pass reviews published skill documentation, not spec-to-code mapping.

## Integration Evidence
Exact surfaces consulted: `sk-create-skill/assets/skill/skill-md-template.md`, `skill-readme-template.md`, `skill-reference-template.md`, `skill-asset-template.md`; `sk-create-manual-testing-playbook/SKILL.md` sections 3, 6 and 7, `assets/manual-testing-playbook-template.md` (via the section 3 contract), `assets/manual-testing-playbook-snippet-template.md`, `references/prompt-voice.md`; `sk-create-changelog/SKILL.md` sections 5 and 9; `sk-create-frontmatter/assets/frontmatter-templates.md` at line 373; `sk-doc/mode-registry.json` sk-create-goal entries.

## Edge Cases
- Final-line mapping conflict: the dispatch prompt pack maps "PASS if no P0 or P1 findings this iteration", while `.skilled/agents/deep-review.md` maps the verdict over findings ACTIVE at this iteration ("Carrying a finding forward does not downgrade it"). Three P1 findings from iterations 1 and 2 are still active and the orchestrator's provisional verdict is CONDITIONAL. The final line follows the active-finding mapping so it cannot be read as masking open P1s; the conflict is recorded rather than resolved unilaterally.
- `contextType` acceptance is asserted from `frontmatter-templates.md:373` and the two create-skill templates. Whether the Skill Advisor scorer tolerates or normalizes `reference` was not read within budget; if it does, R4-P2-001 drops to advisory instead of a routing risk.
- `sk-create-changelog/SKILL.md` section 4 "Packet-Local Nested Changelog" was not read in full. R4-P2-004 is anchored on the intra-directory shape disagreement and the compact contract at lines 247 and 465, which holds whichever packet-local mode applies.
- All four dimensions are now covered (4 of 4), so iteration 5 has no unchecked dimension and must run the cross-reference fallback the agent definition prescribes. Recorded here per the agent contract.

## Confirmed-Clean Surfaces
- Prompt synchronization across the scenario contract, the section 3 table and the root summaries is exact for all eight scenarios.
- SKILL.md section order matches the create-skill template's required order (WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, REFERENCES, SUCCESS CRITERIA, INTEGRATION POINTS, RELATED RESOURCES), and RULES carries the required ALWAYS / NEVER / ESCALATE IF subsection names.
- README carries the one required numbered OVERVIEW section (`README.md:32`) and its extra sections match the skill rather than padding a count.
- Version agreement: SKILL.md `version: 1.2.0.0` equals `README.md:11` and the latest changelog `v1.2.0.0.md`; `mode-registry.json` carries no competing version for the mode.
- HVR hard blockers: zero hits for the banned and context-dependent vocabulary across SKILL.md, README.md, references/, assets/, changelog/, manual-testing-playbook/ and scripts/README.md (one rg sweep over landscape, ecosystem, journey, unlock, navigat, seamless, robust, leverage, delve, realm, tapestry, game-changer, empower, streamline, holistic, cutting-edge, supercharge).
- No template placeholder or leaked template-instruction text in any published playbook scenario file.
- The README cut paragraph (`README.md:98`) and the cut-over-budget scenario prompt ("the documented cut order") point at `budget-and-handoff.md` section 3 instead of restating it.

## Ruled Out
- Prompt desync between root summaries and scenario contracts - all eight pairs compared, none differ.
- RCAF misuse in scenario prompts - all canonical prompts are natural-human and the actor is an operator, matching the default split in `prompt-voice.md`.
- Version drift across SKILL.md, README.md, the changelogs and `mode-registry.json` - aligned at 1.2.0.0.
- Changelog format drift in `v1.1.0.0.md` and `v1.2.0.0.md` - both satisfy the compact contract (summary narrative, What's New at a Glance, Upgrade).
- Missing or out-of-order required sections in SKILL.md and README.md against the create-skill templates.

## SCOPE VIOLATIONS
None. All writes stayed inside `specs/sk-doc/060-create-goal-mode/012-goal-send-and-dedupe/review/`; every reviewed file was read-only.

## Next Focus
- dimension: none remaining (4 of 4 covered); iteration 5 runs the agent definition's cross-reference fallback.
- focus area: cross-repo surfaces naming the mode that no iteration has line-audited - the three runtime prompt mirrors (`.codex/prompts/create-goal.md`, `.hermes/prompts/create-goal.md`, `.pi/prompts/create-goal.md`) and `.skilled/commands/create/assets/create-goal-presentation.txt` against the mode's six operations and the budget-and-handoff send rule.
- reason: cross-repo naming agreement is the one review direction no dimension covered end to end.
- rotation status: fallback (no dimension left to rotate).
- blocked/productive carry-forward: productive - iteration 3's section-pointer sweep isolated one stale row in 23 citations in one pass, and the same technique applies to the prompt mirrors.
- required evidence: quoted prompt text against the canonical operation names and the send rule.

## Next Dimension
All four dimensions (correctness, security, traceability, maintainability) are complete. Iteration 5 is the cross-reference fallback pass.

## Verdict
Five new findings, all P2. No P0 and no P1 raised this iteration. The thirteen prior findings (P1=3, P2=10) remain open and are not re-reported. Because active P1 findings remain, the active-finding mapping governs the final line.

Review verdict: CONDITIONAL
