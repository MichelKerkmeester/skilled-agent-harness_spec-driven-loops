# Iteration 3: Command, README, catalog and environment-reference alignment

## Focus

Audit the human-facing contract for the relaunch loop: `/speckit:handoff`, the code-folder README, the feature catalog entry, the environment reference, and the plugins-and-hooks playbook. The yardstick was the code path proven in iterations 1-2 plus the sk-doc command and document standards.

## Findings

1. **P2 — The handoff command says `prepare` leaves open notes unchanged; phase 008 changed it to complete this session's own open notes.** The command's receiving section states that `prepare` marks every note this session claimed as `done` and "leaves open notes ... unchanged" [SOURCE: .skilled/commands/speckit/handoff.md:133]. `supersedeClaimed` also completes an `open` note whose `session_id` is this session [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:515]. The README repeats only the claimed-note half [SOURCE: .skilled/hooks/session-relaunch/README.md:139] [SOURCE: .skilled/hooks/session-relaunch/README.md:141]. A reader following the command doc will assume an abandoned open note survives and may write a second note unnecessarily. Fix: state both classes in all three places (claimed by this session, or written by this session and still open), matching the phase 008 implementation summary.

2. **P2 — Three documents say `CLAUDE_PID` is used "only" for the shell-child check, but the Claude stop hook also uses it as the killer target.** The README [SOURCE: .skilled/hooks/session-relaunch/README.md:25], the feature catalog [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md:43] and the command doc [SOURCE: .skilled/commands/speckit/handoff.md:21] all scope the variable to the shell-child check. `stop-arm.mjs` reads it first when choosing the target pid [SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:131]. Either the fallback is a bug to remove (iteration 1's finding) or the docs are wrong; they cannot both hold. Fix: after choosing the target-resolution design in iteration 1, make the three docs state exactly where the variable is read.

3. **P2 — The environment reference has no `CLAUDE_PID` row although three shipped documents rely on the variable.** `ENV-REFERENCE.md` lists `SYSTEM_SPEC_FOLDER`, `HERMES_SPEC_FOLDER` and the `SESSION_RELAUNCH_*` switches but not `CLAUDE_PID` [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:109]. The README treats it as a supplied runtime variable [SOURCE: .skilled/hooks/session-relaunch/README.md:81], and the command doc repeats it [SOURCE: .skilled/commands/speckit/handoff.md:21]. An operator cannot tell whether to export it or whether the host provides it. Fix: add a row naming the source (host-provided, wrapper-exported, or operator-set), or remove the dependency in the same change that removes the docs' claim.

4. **P3 — The record-status table describes every arm event as a Stop event.** The README says `pending` means "Stop has not armed the record yet" and `armed` means "A matching Stop event ..." [SOURCE: .skilled/hooks/session-relaunch/README.md:127]. Only Claude and Codex arm on `Stop`; Pi arms on `agent_end` [SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:375], OpenCode on `session.idle` [SOURCE: .opencode/plugins/session-relaunch.js:294], and Hermes on `on_session_end` [SOURCE: .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:111]. Fix: say "the runtime's arm event" and list the five events once.

5. **P3 — The command orders continuity save before the note, while the nudge the automatic runtimes receive orders the note first.** The command's Outputs and Step 2 say to save continuity before the note is written [SOURCE: .skilled/commands/speckit/handoff.md:27] [SOURCE: .skilled/commands/speckit/handoff.md:61]. The nudge text starts with "Write the handoff note" and only then adds the save step [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:87] [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:112]. Both orders reach a saved packet before `prepare`, so the outcome is the same, but two contracts for one workflow invite a future edit that depends on order. Fix: choose one order and use it in the command and `handoffText`, with a one-line reason for the choice.

## Ruled Out

- A command-standard defect: the frontmatter description is one line and within the 110-character budget, `argument-hint` is present, `allowed-tools` is limited to Read, Write and Bash, and the sections match the command template's purpose/contract/steps/report shape [SOURCE: .skilled/skills/sk-doc/sk-create-command/assets/command-template.md:1].
- A Gate 3 exemption gap: the AGENTS.md sentence exempts runtime state under `.skilled/skills/.state/` [SOURCE: AGENTS.md:75], the spec-gate test covers the path, and the handoff note lives there.
- A playbook exit-code drift: the playbook's wrapper exit table matches `skilled-loop` lines 430-504, including the 130 path and the decode-failure warnings.

## Dead Ends

- Looking for a command-contract entry for `/speckit:handoff`: the contract covers router-shaped families only, and this command is direct-dispatch, so its absence is expected.

## Edge Cases

- Ambiguous input: `CLAUDE_PID`'s absence is still unresolved externally; this iteration records only the internal contradiction between docs and code.
- Contradictory evidence: the docs contradict `stop-arm.mjs`; both are cited in finding 2 rather than collapsed.
- Missing dependencies: none.
- Partial success: the env reference was checked for the other session-relaunch variables and they are present.

## Sources Consulted

- .skilled/commands/speckit/handoff.md
- .skilled/hooks/session-relaunch/README.md
- .skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md
- .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md
- .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md
- .skilled/skills/sk-doc/sk-create-command/assets/command-template.md
- AGENTS.md
- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs

## Assessment

- New information ratio: 0.9
- Questions addressed: command and documentation contract; Gate 3 exemption
- Questions answered: the command/documentation key question with five drifts; the Gate 3 exemption itself matches

## Reflection

- What worked and why: diffing each documented statement against the code line that implements it found the stale phase-008 behavior quickly.
- What did not work and why: the docs are internally consistent with each other on the `CLAUDE_PID` "only" claim, so only the code could disprove it.
- What I would do differently: check the feature catalog before the README, because it states the same claim in one sentence and makes the contradiction easier to confirm.

## Recommended Next Focus

Spec-record drift: the phase 001-008 implementation summaries, acceptance criteria and parent goal against the code and docs as they now stand, looking for claims that outlive their revision.
