---
title: "Iteration 3: Traceability — runtime parity, release claims, and requirement rows"
trigger_phrases: []
---
# Iteration 3: Traceability — runtime parity, release claims, and requirement rows

## Focus

Whether each frozen decision is represented on every shipped surface: the reminder path per runtime, the capability set the ADR names, release-note and requirement claims about Devin, workspace normalization parity between plugin and core, and the tests that guard the byte-compatibility claim.

## Files Reviewed

- `.opencode/plugins/opencode-goal.js` (`renderGoalInjection`, `resolvePacketGoalForRecord`, `goalStateLines`, `bindGoal`)
- `.opencode/hooks/goal/pi/goal-context.ts:197`, `.opencode/hooks/goal/cursor/goal-inject.mjs:84`, `.opencode/hooks/goal/devin/goal-inject.mjs:70`
- `.opencode/hooks/goal/README.md:20-90`
- `.opencode/plugins/tests/opencode-goal-tool-path.test.cjs:175-195`
- `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:295-310`
- `specs/hooks/009-goal-isolation/spec.md:150`
- `.devin/hooks.v1.json:31-57`
- `.cursor/commands/goal-cursor.md`
- `.opencode/commands/speckit/assets/speckit-{plan,implement,complete,resume-auto,resume-confirm}.yaml` (goal blocks)
- `AGENTS.md:311-317,483`
- 004/005/006 implementation summaries (`036-goal-unification`)

## Scorecard

- Dimensions covered: traceability (primary), maintainability
- New findings: P0=0 P1=1 P2=5
- New findings ratio: 1.00

## Findings

### P0

- None.

### P1

- **F010**: OpenCode injection carries no resend reminder although ADR-004 says the reminder rides the injection path — `.opencode/plugins/opencode-goal.js:2707` — `renderResendReminder` is called only by the pi (`goal-context.ts:197`), cursor (`goal-inject.mjs:84`) and devin (`goal-inject.mjs:70`) adapters; `renderGoalInjection` builds the block without it and the plugin tests assert only a `resend_pending=` tool-output field (plugin `:2866`). ADR-004 states "The reminder rides the injection path and never blocks work", `README.md:60` says adapters append `renderResendReminder()` to the injection, and `CHANGELOG:303` tells users the agent "keeps reminding you to set it"; 005's summary documents reminders only for Pi and Cursor, so the narrowing exists in phase docs but not in the frozen decision or user-facing text. [SOURCE: .../decision-record.md:354] [SOURCE: .opencode/plugins/opencode-goal.js:2707]

### P2

- **F011**: Changelog contradicts itself on Devin: injection-only adapter regained vs 'deliberately decommissioned' — `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:305` — Line 303 says "Devin regained a goal adapter as injection-only"; line 305 says Devin goal hooks were "deliberately decommissioned, so Devin is not a goal target in the shipped release", while `.devin/hooks.v1.json:33,55` implements the adapter. [SOURCE: CHANGELOG-v4.0.0.0.md:303] [SOURCE: CHANGELOG-v4.0.0.0.md:305]
- **F012**: 009 REQ-010 still requires docs to call Devin decommissioned; ADR-005's promised amendment is absent — `specs/hooks/009-goal-isolation/spec.md:150` — REQ-010 reads "Current docs/matrices state that Devin goal adapters were decommissioned; no registration or missing adapter path is claimed", while ADR-005 says the hook README matrix and "009 REQ-010 evidence row" were amended together. The README row was updated; the requirement row was not, and 009's summary still records zero Devin registrations as PASS. [SOURCE: .../decision-record.md:456] [SOURCE: specs/hooks/009-goal-isolation/spec.md:150]
- **F013**: Plugin bind stores an unresolved workspace through a dead ternary, drifting from core's repo-root resolution — `.opencode/plugins/opencode-goal.js:1838` — `goalSlice.resolvePacketDir(workspace, '.')` returns null for every workspace (observed with node), so the ternary always falls back to the raw `options.directory || process.cwd()` (`:1817`); core stores `resolveRepoRoot`'s walk-up result (`goal-core.cjs:135-144,944`). Binding from a subdirectory fails on the plugin where core succeeds, and a relative stored workspace resolves against a later process cwd. [SOURCE: .opencode/plugins/opencode-goal.js:1838] [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:135]
- **F014**: No parity test between core renderGoalBrief and plugin renderGoalInjection despite a byte-for-byte claim — `.opencode/hooks/goal/README.md:37` — The two renderers are separate implementations with duplicated constants; grep finds no cross-implementation test, and the reminder gap (F010) is exactly the drift the claim is supposed to prevent. [SOURCE: .opencode/hooks/goal/README.md:37] [SOURCE: .opencode/plugins/opencode-goal.js:2707]
- **F015**: Cursor command hint advertises actions the command contract fails closed on — `.cursor/commands/goal-cursor.md:3` — The `argument-hint` lists `set|show|clear|complete|pause|resume`, while the contract returns `UNSUPPORTED_SESSION_BINDING` for everything except `packet` and the purpose section says binding or mutating is unsupported. [SOURCE: .cursor/commands/goal-cursor.md:3] [SOURCE: .cursor/commands/goal-cursor.md:17]

## Claim Adjudication

```json
{"findingId":"F010","claim":"The OpenCode plugin's injection path never appends the resend reminder, so the reminder ADR-004 places on the injection path exists only on Pi, Cursor and Devin.","evidenceRefs":[".opencode/plugins/opencode-goal.js:2707-2759",".opencode/hooks/goal/pi/goal-context.ts:197",".opencode/hooks/goal/cursor/goal-inject.mjs:84",".opencode/hooks/goal/devin/goal-inject.mjs:70",".opencode/plugins/tests/opencode-goal-tool-path.test.cjs:186-194",".../decision-record.md:354"],"counterevidenceSought":"Grepped every renderResendReminder call site; read the plugin injection builder end to end; checked the plugin tests for a reminder assertion; read the README, changelog and 005 summary statements to see whether OpenCode is explicitly excluded anywhere in the frozen decision text (it is not).","alternativeExplanation":"The tool-output `resend_pending=` field gives OpenCode a reminder at command entry, which is the other half of ADR-004's cadence; that signal is real but it is not the injection path the decision names, and it never reaches the model between tool calls.","finalSeverity":"P1","confidence":0.92,"downgradeTrigger":"Downgrade when ADR-004/README/changelog are amended to scope the reminder to Pi/Cursor/Devin and name the tool-output field as OpenCode's signal, or the plugin injection gains the line.","transitions":[{"iteration":3,"from":null,"to":"P1","reason":"Initial cross-surface trace"}]}
```

## Traceability Checks

- `spec_code` (core): every frozen goal ADR mapped to its shipped surface; four contradictions or gaps found (F002, F003, F005, F010).
- `checklist_evidence` (core): phase 007 is a scaffold (tasks T001-T009 unchecked, `Status: Draft`, no verification evidence), so the phase does not yet claim completion; no false completion claim found.
- `agent_cross_runtime` (overlay): pi/cursor/devin adapters match their rows; the OpenCode row diverges on the reminder (F010), the action set (F007) and workspace normalization (F013).
- `feature_catalog_code` (overlay): feature catalog `:784-788` already describes the packet-bound plugin; the 009 requirement row remains stale (F012).
- `playbook_capability` (overlay): the playbook, template and `spec-kit-docs.json` carry the same 3000/4000 pair; the runtime set path does not enforce them (F003).
- `skill_agent` (overlay): not applicable to this target.

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: traceability, maintainability
- Novelty justification: one runtime-parity contract gap and five documentation, requirement, or coverage-coherence defects; all verified at named lines.

## Ruled Out

- Devin adapter wiring: ruled out; both `SessionStart` and `UserPromptSubmit` invoke `goal-inject.mjs` (`.devin/hooks.v1.json:33,55`) and `README.md:74` documents the injection-only fallback ADR-005 authorized. [SOURCE: .devin/hooks.v1.json:33]
- AGENTS.md posture block: ruled out; the block is present at `AGENTS.md:311-317` with the no-halt sentence at `:315`, and the Quick Reference row at `:483`. [SOURCE: AGENTS.md:311]
- Resume surfaces are read-only: ruled out as a defect; `resume-auto`/`resume-confirm` never call `opencode_goal`, never bind, and carry the `never_halts` line (`:45-48`). [SOURCE: .opencode/commands/speckit/assets/speckit-resume-auto.yaml:45]
- Speckit goal-step wiring: ruled out; plan/implement/complete expose `goal_prompt_choice` plus the per-runtime `packet_goal.bind_by_runtime` invocation and the durable-hash resend trigger (`speckit-plan.yaml:177-192`). [SOURCE: .opencode/commands/speckit/assets/speckit-plan.yaml:177]
- Bind/resent/packet CLI envelope behavior: ruled out; `goal-core.test.cjs:841-862` pins bind, resent, log, unbind and the session-free packet read. [SOURCE: .opencode/hooks/goal/lib/goal-core.test.cjs:841]

## Dead Ends

- Assuming 005's narrower reminder sentence satisfies ADR-004: the ADR and README are the texts a follow-on run reads first, and neither excludes OpenCode.
- Assuming the byte-for-byte render claim is test-enforced: no cross-implementation test exists, so the claim is human-maintained.

Review verdict: CONDITIONAL
