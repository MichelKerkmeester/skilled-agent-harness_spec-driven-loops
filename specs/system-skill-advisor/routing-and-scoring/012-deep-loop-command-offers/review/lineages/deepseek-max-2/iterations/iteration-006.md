# Review Iteration 006

## Dispatcher
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; dimension=traceability (overlay protocols).
Artifact directory: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2`. Read-only review; no `steer.md` exists in this lineage.

## Files Reviewed
- `.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:20` (catalog index)
- `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:33` (gate description)
- `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:41` (withholding description)
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:180` (NC-012 row)
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/command-offer-fit-gates.md:23` (gate 2)
- `.skilled/skills/system-skill-advisor/runtime/lib/README.md:146` (`command-attach.ts` description)
- `.skilled/skills/system-deep-loop/SKILL.md:31` (hub mode table)
- `.skilled/skills/system-deep-loop/deep-review/SKILL.md` (depth triggers removed)
- `.skilled/skills/system-deep-loop/deep-research/SKILL.md` (depth triggers removed)
- `.claude/agents/deep-review.md` and `.opencode/agents/deep-review.md` (runtime mirrors)
- `.skilled/agents/deep-review.md` (canonical agent)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1621` (no-edit guard, routed path)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1686` (no-edit guard, deferred path)

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **Four documentation surfaces still state the blanket no-edit rule REQ-040 reversed** -- `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:33` -- REQ-040 and AC-048 changed the rule so a no-edit clause no longer withholds a read-only loop, and the gate implements it: `attachCommand` keeps the command when the served mode is read-only ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1621]) and `deferredLoopCommand` keeps it the same way ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1686]). The feature catalog still says "A prompt that matches `NO_EDIT_REQUEST` gets no command from any hub, because a reader who rules out a change is never handed work that writes" ([SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:33]) and repeats it as "no command when the prompt rules out a change" ([SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:41]); the manual-testing playbook's NC-012 states gate 2 the same way ([SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/command-offer-fit-gates.md:23]); and the runtime module reference repeats it as "A prompt that matches `NO_EDIT_REQUEST` gets no command" ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/README.md:146]).
Finding class: class-of-bug (one reversed rule, three statements that still carry the old form).
Scope proof: the built rule is at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1621` and `:1686`; the four stale statements are `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:33`, `:41`, `.skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/command-offer-fit-gates.md:23` and `.skilled/skills/system-skill-advisor/runtime/lib/README.md:146`; the requirement and its owning row are `spec.md` REQ-040 and `acceptance-criteria.md` AC-048.
Affected surface hints: `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md`, `.skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/command-offer-fit-gates.md`, `.skilled/skills/system-skill-advisor/runtime/lib/README.md`.
Case: a reader takes the catalog's rule to the prompt "run a deep review of the parser but don't change anything", concludes the advisor withholds `/deep:review`, and reports the built gate as broken; a tester who extends NC-012's gate 2 to that prompt records a FAIL under the leaf's own "FAIL if ... any withheld command appears" criterion, because the built result is the opposite of what the gate-2 sentence promises.
Claim adjudication:
```json
{"type":"stale_rule_statement","claim":"The feature catalog and the NC-012 playbook still say a no-edit clause withholds every command, while REQ-040 and the gate keep a read-only loop's command.","evidenceRefs":[".skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:33",".skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:41",".skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/command-offer-fit-gates.md:23",".skilled/skills/system-skill-advisor/runtime/lib/README.md:146",".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1621",".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1686"],"counterevidenceSought":"read the catalog paragraph in full for a read-only-loop exception (none), read the playbook leaf's six prompts to see whether any covers a read-only loop (all six name creation or git work, so the leaf's own scenario does not exercise the reversed rule), and searched lib/README.md and the two catalog paragraphs for 'read-only' (no hit), which showed the exception is missing on all four surfaces rather than present somewhere.","alternativeExplanation":"the statements describe the creation-command gates only, and a reader will not apply them to a deep-loop command.","finalSeverity":"P2","confidence":"medium","downgradeTrigger":"a catalog or playbook sentence, in the same paragraph, naming the read-only loop exception would make the rule unambiguous."}
```

## Traceability Checks
- `feature_catalog_code` (overlay, hard), status `partial`: the catalog's `advisor-recommend` page describes the gate's reads correctly where it counts — `LOOP_REQUEST`, the depth-wording exclusion, `deferredLoopCommand` with one `MODE_CUES` cue, the history-lead withholding and the correction gate ([SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:33]) — and it carries one stale rule (F-006-001).
- `playbook_capability` (overlay, hard), status `partial`: NC-012 exists and its six prompts match their expected signals by construction (the readme and git commands are creation and doctor rows), while its general gate-2 sentence carries the stale no-edit rule (F-006-001).
- `skill_agent` (overlay, hard), status `pass`: the hub's mode table names the review packet and the `deep-review` agent for `/deep:review` ([SOURCE: .skilled/skills/system-deep-loop/SKILL.md:31]); the depth triggers the packet removed are gone (the T025 and T026 searches print nothing on both mode packets); and the hub names `/doctor:deep-loop` once, as REQ-011 requires.
- `agent_cross_runtime` (overlay, hard), status `pass`: the canonical agent is `.skilled/agents/deep-review.md` and both runtime mirrors exist as separate files with the same persona title ([SOURCE: .claude/agents/deep-review.md:1], [SOURCE: .opencode/agents/deep-review.md:1]). The packet's mirror-sync claim (REQ-007, T033) is a dated observation of the tool run, which this review may not re-run; the files it names are present.
- `spec_code` and `checklist_evidence` stay `pass` from iterations 4 and 5.

## Integration Evidence
- `runtime/lib/README.md` is the module reference every reader of the gate is pointed at, and it carries the blanket rule without the read-only exception ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/README.md:146]), which is why F-006-001 is a four-surface drift rather than one stale page.
- The playbook's index row for NC-012 ([SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:180]) points at the leaf this iteration read, so the overlay chain is traceable end to end.

## Edge Cases
- **A playbook whose own prompts do not exercise the stale rule.** NC-012's six prompts are a refusal, a question, a plain request, a no-edit creation request, a typo fix and a git query; none names a deep loop, so the leaf's PASS/FAIL list stays satisfiable while its general sentence is wrong. Recorded so the finding is read as rule drift, not as a broken scenario.
- **A mirror that cannot be re-checked.** `sync-runtime-mirrors.cjs --check` is the tool the packet cites; this review may not run repo tooling, so the mirror claim is checked by existence and by the canonical path convention, and the packet's dated run stands as the tool evidence.

## Confirmed-Clean Surfaces
- **The catalog index still lists the advisor's command surface** ([SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:20]), so the page F-006-001 corrects is reachable from the index rather than orphaned.
- **The hub and both mode packets agree on the mode-to-agent mapping** ([SOURCE: .skilled/skills/system-deep-loop/SKILL.md:31]).
- **The removed trigger phrases are absent from both mode packets** (T025 and T026's searches print nothing).

## Ruled Out
1. **The feature catalog names a module that does not exist** -- ruled out: my first read of the page was taken through `rg -r`, whose replacement text rewrote the matched identifiers in the output only; reading the file directly shows `attachCommand()` and `lib/command-attach.ts`, and `lib/command-attach.ts` exists. Recorded because the false positive is instructive, not because the catalog is wrong.
2. **The playbook scenario is broken by the reversed rule** -- ruled out for the leaf's own six prompts, which name creation and git work; the drift is in the general sentences (F-006-001).
3. **The runtime mirrors are missing** -- ruled out: `.claude/agents/deep-review.md` and `.opencode/agents/deep-review.md` both exist and open on the same persona.

## Next Focus
- Dimension: traceability (closeout)
- Focus area: the remaining `Met` rows with a date or commit in their evidence, the archive chain AC-040 rests on, and this run's own closeout: does the packet's closure statement survive everything this lineage found, and does the coverage the gate needs hold for all four dimensions?
- Reason: iteration 7 is the last; it must decide the verdict the synthesis will carry.
- Rotation status: all four dimensions reviewed; traceability complete after this iteration.
- Required evidence: full repo-relative `path:line`, and the coverage membership this run recorded.
- Blocked/productive carry-forward: five open P2s; no P0 or P1, so the verdict path stays PASS-with-advisories unless iteration 7 raises something.
- Recovery note: not applicable.

Review verdict: PASS
