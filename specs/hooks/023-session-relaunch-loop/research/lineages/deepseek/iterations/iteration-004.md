# Iteration 4: Phase 001-008 record drift against the current code

## Focus

Read the phase 001, 002 and 003 implementation records and the parent goal against the code as it now stands. The target was claims that outlived their revision, decisions whose stated mitigation does not hold, and limitations that later evidence has already retired.

## Findings

1. **P2 — Phase 003 fixed the transient-`process.ppid` killer target for Codex, but the same fallback remains in the Claude stop hook and phase 001 records it as a safe choice.** Phase 003's D77 review found that the Codex stop-arm targeted the transient `process.ppid` and changed it [SOURCE: specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/implementation-summary.md:86]. The Claude stop hook still resolves `CLAUDE_PID || process.ppid` [SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:131], and the phase 001 decision record presents that fallback as safe [SOURCE: specs/hooks/023-session-relaunch-loop/001-claude-relaunch-loop/implementation-summary.md:95]. `CLAUDE_PID` is present in the recorded live environment, so the live path works, but the fallback is the same defect D77 removed from Codex. Fix: use `findLoopChildPid` in the Claude fallback (the Codex implementation at `.skilled/hooks/session-relaunch/codex/stop-arm.mjs:118` is the template), then add a test that removes `CLAUDE_PID`.

2. **P2 — The background-task guard runs only for a pending record, so an armed record whose killer died can be re-armed while live background tasks run.** Phase 001 says the `Stop` payload carries `background_tasks` and that the design refuses an active shell child or pending background task [SOURCE: specs/hooks/023-session-relaunch-loop/001-claude-relaunch-loop/implementation-summary.md:80] [SOURCE: specs/hooks/023-session-relaunch-loop/001-claude-relaunch-loop/implementation-summary.md:96]. The adapter checks background tasks only when `record.status === 'pending'` [SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:109]; for an armed record with no live killer, the same Stop arms it and spawns a killer, which can kill the running tasks. Fix: apply the background-task guard to every path that will call `arm()`, not only the pending branch, and add a test with an armed record, no live killer, and one background task.

3. **P2 — The recorded mitigation for the fallback, "the loop-id ancestry check remains", cannot catch the wrong target because the transient shell is a legitimate descendant of the loop.** The phase 001 decision record cites the ancestry check as the remaining safety net for the parent-pid fallback [SOURCE: specs/hooks/023-session-relaunch-loop/001-claude-relaunch-loop/implementation-summary.md:95]. The killer's check only asks whether the loop is an ancestor of the target [SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:586]; every process between the runtime and the loop, including the `bash -c` hook wrapper, satisfies it. The check therefore confirms the target belongs to the loop but not that it is the runtime. Fix: validate that the target is the loop's direct child (the existing `findLoopChildPid` contract) rather than any descendant, or document that only the direct child is acceptable and enforce it.

4. **P3 — Phase 002's OpenCode limitation is stale after the later OpenCode runs and phase 004's evidence.** The phase 002 record says OpenCode `session.idle` on TUI quit and the wrapper-specific `process.ppid` were not directly captured [SOURCE: specs/hooks/023-session-relaunch-loop/002-pi-opencode-adapters/implementation-summary.md:65] [SOURCE: specs/hooks/023-session-relaunch-loop/002-pi-opencode-adapters/implementation-summary.md:156]. Later runs D, E and F record prepare, `killer-signal` and relaunch through the OpenCode plugin, and phase 004 closed the live checks, so the limitation no longer describes the evidence. Fix: rewrite the limitation to name what remains genuinely unverified (for example TUI prompt auto-submit) or mark it retired by the later runs.

## Ruled Out

- A parent-goal D3 violation: the claim seed takes `spec_folder` from the note at consume time [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:509], so the note-written value does reach the seed on every runtime even when the adapter's payload field is absent. The earlier doc-accuracy concern is about the ENV-REFERENCE wording, not the goal.
- A phase 008 limitation drift: "No live rerun" is accurate; the phase closed unit-level edge cases after the live runs.
- A phase 001 usage-accounting drift: the record says fill uses input, cache creation and cache read, and `readClaudeFill` sums exactly those three [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:112].

## Dead Ends

- Looking for a phase record that claims `CLAUDE_PID` is absent: every record that mentions it says it is recorded in the live hook environment, so the docs' "only for the shell-child check" wording is the sole contradiction.

## Edge Cases

- Ambiguous input: whether the fallback can be reached in a supported host version is unknown; the record proves it was present in the sampled version, not that it is guaranteed.
- Contradictory evidence: phase 003's D77 and phase 001's decision row disagree about whether the parent-pid fallback is acceptable; both are cited rather than reconciled.
- Missing dependencies: none.
- Partial success: the phase 002 limitation was checked against the relaunch log extract, which records OpenCode killer signals.

## Sources Consulted

- specs/hooks/023-session-relaunch-loop/goal.md
- specs/hooks/023-session-relaunch-loop/001-claude-relaunch-loop/implementation-summary.md
- specs/hooks/023-session-relaunch-loop/002-pi-opencode-adapters/implementation-summary.md
- specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/implementation-summary.md
- specs/hooks/023-session-relaunch-loop/008-review-3-remediation/implementation-summary.md
- specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/evidence/live-run10-2026-10-19/relaunch-run10.txt
- .skilled/hooks/session-relaunch/lib/killer.cjs
- .skilled/hooks/session-relaunch/claude/stop-arm.mjs
- .skilled/hooks/session-relaunch/codex/stop-arm.mjs

## Assessment

- New information ratio: 0.8
- Questions addressed: spec-record drift; goal conformance
- Questions answered: the phase-record drift question, with four records now reconciled against code

## Reflection

- What worked and why: reading the phase 003 review sentence beside the Claude source exposed the cross-phase inconsistency in one comparison.
- What did not work and why: phase 002's live-run table required the relaunch log extract to confirm the stale limitation; the summary alone could not date the evidence.
- What I would do differently: read the review sentences (D77, D83) before the decision tables, because they name defects the decision tables still bless.

## Recommended Next Focus

Architecture and standards: the ideal core-and-adapter boundary, the sk-code-skilled checklists for hooks/adapters, and the sk-doc README/playbook standards at the packet level.
