# Review Iteration 003

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Executor: `cli-pi` model `deepseek-v4.1-flash-1017`, run inline by lineage `deepseek-max-2` (generation 1, lineage mode `new`).
- Iteration 3 of 7, stop policy `max-iterations`.
- Dimension: **security**. Operator focus applied: no `gateClass` on protocol results, findings only on review-scope files, no `terminal_gates` row. Security is the third of the four dimensions the focus requires before the last iteration.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:42,76,77,84,141,202,313,317,328,1650,1653,1676`
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:45,189,191,192,580`
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:46,205,215,257`
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1558,1560,1566,1567`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` (`enrichCompiledRoutes` duplicate guard)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1064,1079,1084`
- `.skilled/skills/system-deep-loop/command-metadata.json` (`ask_first`, the two deep command rows)
- `spec.md` NFR-S01, NFR-S02, REQ-038, REQ-044, REQ-053, REQ-058

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The hook brief keeps the child process's `policy` and `ownerSkillId` on a row whose command the tracked table names, while the CLI degraded path takes both from the tracked table** -- `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:191` -- `trackedCommandForOwner` (`command-attach.ts:313`) returns the authoritative `{command, policy, ownerSkillId}` from `TRACKED_COMMANDS`, where `/deep:review` and `/deep:research` are both `policy: 'ask'` (`command-attach.ts:76`, `:77`, `:141`). The CLI degraded path consumes that result, printing `typed.policy` and `typed.ownerSkillId` (`skill-advisor-cli.ts:1566`, `:1567`). The brief calls the same function at `skill-advisor-brief.ts:191` but uses it only as a boolean: on success it returns `recommendation` unchanged (`:192`), so the `policy` and `ownerSkillId` strings that arrived from the child (`subprocess.ts:215`, `:216`, both accepted as any non-empty string) are what the head prints. A child row of `{"skill":"system-deep-loop","command":"/deep:review","policy":"run"}` therefore renders as `/deep:review (run)` on the hook brief while the tracked table says `ask`, which is the exact statement NFR-S01 forbids ("The `run` policy never starts a deep command. Both `/deep` commands keep `ask`").
   Finding class: `trust-boundary-inconsistency`
   Scope proof: all three files are review-scope files; the tracked table rows and both call sites were read directly, and the child-side acceptance of any non-empty string is at the cited line.
   Affected surface hints: `skill-advisor-brief.ts` `ownedCommandRecommendation`; `subprocess.ts` `parseRecommendations`; `command-attach.ts` `TRACKED_COMMANDS` and `trackedCommandForOwner`; the brief text a hook injects, which is what an AI acts on.
   Case: the Python fallback (or any child) emits a tracked deep command with `policy: "run"`; the hook brief prints `→ /deep:review (run)`, and an AI reading the brief starts a multi-pass run without the offer question the `ask` policy exists to force.
   ```json
   {"type":"claim-adjudication","claim":"The hook brief prints the child-supplied policy and owner for a tracked command, where the CLI path prints the tracked ones, so a child row can present a /deep command as policy run.","evidenceRefs":[".skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:191",".skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:192",".skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1566",".skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:215",".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:76"],"counterevidenceSought":"Read the tracked table for both deep commands, the CLI degraded path that shares the same helper, and parseRecommendations to see whether policy is validated against a vocabulary; also checked whether the brief re-derives the policy anywhere after the owner check.","alternativeExplanation":"The child is the repository's own Python advisor, so a `run` policy on a deep command cannot arise from a real producer today, which would make this hardening rather than a live defect.","finalSeverity":"P1","confidence":0.78,"downgradeTrigger":"Downgrade to P2 if parseRecommendations validates `policy` against the run/start/ask vocabulary and the tracked table, because the brief would then only ever see an authoritative value."}
   ```

### P2 Findings

None this iteration.

## Traceability Checks

| Protocol | Level | Status | Evidence | Summary |
|---|---|---|---|---|
| `spec_code` | core | pass | `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:313]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:191]` | REQ-058's claim that both paths call one `trackedCommandForOwner` holds; the finding is that one of the two paths uses only half of what it returns. |
| `checklist_evidence` | core | partial | `[SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:123]` | Carried: AC-066 states the owner check and is `Met`, and it is the row the finding narrows (the policy field it does not mention). Full ticked-task sweep is iteration 5. |

## Integration Evidence

- `command-attach.ts:76` and `:77` are the tracked rows both `/deep` commands resolve through: `/deep:research` and `/deep:review`, each `policy: 'ask'`, `ownerSkillId: 'system-deep-loop'`; `:84` shows `/doctor:deep-loop` at `policy: 'run'`, which is the read-only diagnosis command and not a deep run.
- `skill-advisor-cli.ts:1558` and `skill-advisor-brief.ts:191` are the two REQ-058 call sites; they are the same helper, consumed differently.
- `fusion.ts:1064` builds the doctor-naming pattern from `DEEP_LOOP_DOCTOR_COMMAND`, so the scorer and the attach layer cannot disagree on the command string (REQ-053).

## Edge Cases

- **A child row naming a command the table does not track.** Both paths drop the command, the policy and the owner, so the row falls back to its skill alone; the same helper and the same result on both paths, so no finding.
- **A child row with no `command` at all.** The brief returns the row unchanged, which is correct because there is nothing to vet.
- **The served head's typed-command override.** `attachTypedCommand` re-derives the typed command from the prompt through `typedCommandForTop`, which reads `TRACKED_COMMANDS`, so a prompt cannot inject a command by typing an untracked one.
- **`/doctor:deep-loop` at `policy: 'run'`.** Intentional: the command is read-only, and REQ-024 withholds it on a complaint that refuses any run or fix.

## Confirmed-Clean Surfaces

- `trackedCommandForOwner` uses `Object.hasOwn(TRACKED_COMMANDS, command)` before any lookup, so an inherited key such as `constructor` cannot resolve to a command.
- `parseRecommendations` throws on a non-array payload, a non-object row, and a missing skill or non-numeric confidence, so a malformed child cannot reach the brief as a half-formed row.
- `ownedCommandRecommendation` strips `command`, `policy`, `ownerSkillId` and the typed marker together when the command is not tracked, so a rejected command never leaves a dangling owner.
- `withholdDeepLoopDoctorWithoutRun` and the stuck branch of `attachCommand` read the same `RUN_REFUSED` predicate, so the scorer and the attach layer cannot disagree on a run-refusing complaint.

## Ruled Out

- **A typed command surviving on an untracked command string** -- ruled out: `typedCommandForTop` skips a command that is not a key of `TRACKED_COMMANDS` (`command-attach.ts:328`).
- **The `policy` field's type being unvalidated into a non-string** -- ruled out at the boundary: `parseRecommendations` keeps only a non-empty string, so the defect is the value's authority, not its type.
- **A secret or credential surface in the changed code** -- ruled out by reading: the packet's code reads the prompt string and static command tables only, matching NFR-S02.

## Next Focus

- Dimension: maintainability
- Focus area: the two-copy drift guard and the vocabulary tables it compares, plus the doc comments that carry the rules
- Reason: the fourth and last canonical dimension, and the packet's cost is concentrated in duplicated rule text
- Rotation status: security done; maintainability in iteration 4; traceability returns for iterations 5 to 7
- Blocked/productive carry-forward: `checklist_evidence` still `partial`
- Required evidence: `file:line` for each duplicated list and each guard that compares it

Review verdict: CONDITIONAL
