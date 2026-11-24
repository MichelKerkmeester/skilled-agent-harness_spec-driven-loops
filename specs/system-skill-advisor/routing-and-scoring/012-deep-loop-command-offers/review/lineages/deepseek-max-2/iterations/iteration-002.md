# Review Iteration 002

## Dispatcher
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; dimension=security.
Artifact directory: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2`. Read-only review; no `steer.md` exists in this lineage.

## Files Reviewed
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489` (`trackedCommandForOwner`)
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1513` (`degradedRecommendations`)
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:187` (`parseRecommendations`)
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:245` (`withTypedCommand`)
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:383` (`runAdvisorSubprocess`)
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:466` (`buildSkillAdvisorBrief`)
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:227` (`commandLabel`)
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:198` (`parentNamedOnly`)
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257` (prompt cap)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:136` (`TRACKED_COMMANDS` policy)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5743` (`_apply_deep_loop_offer_gate`)
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:149` (hook wiring of the brief builder)

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **The hook brief renders a child-supplied command without the owner check the CLI path applies** -- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:231` -- The twelfth round added `trackedCommandForOwner` so a command string that crossed the child-process boundary prints only where the tracked table names it for the row's own skill, and it wired that check into `degradedRecommendations` only. The other degraded consumer, `buildSkillAdvisorBrief`, still takes `runAdvisorSubprocess` output straight to `renderSharedBrief` and `renderAdvisorBrief`, and `commandLabel` prints `recommendation.command ?? row?.command` with `recommendation.policy ?? row?.policy` after `sanitizeSkillLabel`, which normalises text and does not consult the table. A row the Python child emits with a `command` and a `policy` therefore prints verbatim on the hook path and is dropped on the CLI path.
Finding class: instance-only (a missing guard on one of two consumers of the same boundary).
Scope proof: the print site is `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:231`; the unvetted input arrives at `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:541` through `runAdvisorSubprocess`, whose rows come from `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:187`; the vetted sibling is `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1571`.
Affected surface hints: `.skilled/skills/system-skill-advisor/runtime/lib/render.ts`, `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts`, `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts`, `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`.
Case: the two command tables drift, as they did for the `deep-review` alias group, and the Python child reports `command: "/doctor:deep-loop"` on a `system-deep-loop` run row that the native table no longer attributes to that skill; the next prompt hook prints `system-deep-loop → /doctor:deep-loop (run)` as the offer, while the same row through the CLI fallback prints the bare skill, so the reader sees a runnable command on one degraded path and none on the other.
Claim adjudication:
```json
{"type":"incomplete_fix","claim":"REQ-038's owner check is applied on the CLI degraded path but not on the hook brief path, so a child-supplied command and policy render unvetted there.","evidenceRefs":["skilled/skills/system-skill-advisor/runtime/lib/render.ts:231",".skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1571",".skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:541",".skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:187"],"counterevidenceSought":"read parseRecommendations to see whether the child can supply a command at all (it can, whenever the field is a non-empty string), read render.ts for any owner or table lookup inside commandLabel (none: only sanitizeSkillLabel and a mutating-class lookup), and read the Python gate for the source of the command field (its own command table, so the string is table-derived, not prompt-derived, which is what keeps this P2 rather than P1).","alternativeExplanation":"The Python command table and the native TRACKED_COMMANDS are generated from one source, so drift is impossible and the missing check can never print a foreign command.","finalSeverity":"P2","confidence":"medium","downgradeTrigger":"a test or generator proves both tables are built from one shared source and cannot drift, which would make the missing check unobservable."}
```

## Traceability Checks
- `spec_code` (core, hard), status `partial`: REQ-038's rule is confirmed present at [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489] (`Object.hasOwn(TRACKED_COMMANDS, command)` plus the owner or alias match) and read where the supplied string reaches the row at [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1571]. Its absence from the hook path is the P2 above; the requirement text names the CLI degraded path only, so the requirement itself is not contradicted.
- NFR-S01 and CHK-031: both deep commands carry policy `ask` in the tracked table ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:122]) and the probe rows all read `pol=ask` (`scratch/probes/results-after.json`), so no deep command is started under `run`.

## Integration Evidence
- Hook surface checked: `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:149` types `buildBrief?: typeof buildSkillAdvisorBrief` and uses it as the primary builder, which is what makes the unvetted render path live rather than dead code.
- CLI fallback surface checked: `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:552` (`buildSkillAdvisorBriefFromCli`) parses the CLI's own `recommendations`, so it inherits the CLI's vetting and is not the gap.

## Edge Cases
- **Child session.** `parentNamedOnly` downgrades a `start` or `ask` policy to "parent-named only" for a child session ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:198]), so the missing owner check cannot let a child session start a run; the printed command still reaches an interactive reader as runnable text, which is why the finding is scored P2 rather than higher.
- **Prompt-derived command.** `withTypedCommand` overwrites the top row with a command derived from the prompt ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:251]), so the typed case does not depend on the child's string; only an untyped row carries the child's own field.

## Confirmed-Clean Surfaces
- **Prompt length is capped before scoring.** `prompt: z.string().min(1).max(ADVISOR_PROMPT_MAX_CHARS)` with 10,000 characters ([SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257]), so a pasted long prompt cannot drive the gate's regex work unbounded through the tool schema.
- **Rejected supplied commands lose every command field.** `trackedCommandForOwner` returns undefined and the row is pushed as a plain skill with no `command`, `policy`, `ownerSkillId` or `typed` ([SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1593]).
- **A mention is not a request.** `commandOnlyMentioned` runs before the deep-loop ask gate on the routed path ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1643]), so a doc path or a refusal of a typed command yields no offer.

## Ruled Out
1. **A child can inject an arbitrary command through `parseRecommendations`** -- the parser accepts any non-empty string ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:187]). Ruled out as a live injection: the Python rows' command comes from its own command table ([SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:2391]), and the gate there sets only the `typed` marker ([SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5811]); the prompt never supplies the string, so the realistic case is table drift, which is what the P2 records.
2. **The deep gate could start a run without asking** -- both deep commands carry `ask` ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:122]) and the probe rows read `pol=ask`; `parentNamedOnly` additionally downgrades a non-read-only `run` in a child session ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:198]).
3. **A long prompt makes the gate quadratic** -- ruled out as a security cost: the tool schema caps the prompt at 10,000 characters ([SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257]) and the lead scans are bounded ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:784]).

## Next Focus
- Dimension: maintainability
- Focus area: the drift-guard and shared-fixture design that keeps two gate copies honest (`tests/deep-loop-offer-cases.vitest.ts`, the fixture schema, and the reducer owner boundaries).
- Reason: third configured dimension; no P0 or P1 to carry forward.
- Rotation status: correctness and security reviewed (2/4).
- Required evidence: file:line for each guard pair and for the fixture columns the suites read.
- Blocked/productive carry-forward: security's P2 is a maintainability-adjacent gap; the maintainability pass must not re-report it.
- Recovery note: not applicable.

Review verdict: PASS
