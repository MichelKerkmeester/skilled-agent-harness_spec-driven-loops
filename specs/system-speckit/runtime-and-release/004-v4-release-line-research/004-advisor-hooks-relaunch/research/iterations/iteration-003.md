# Iteration 3 — Session relaunch: per-runtime flags, 80 percent trigger, carry-over

## Focus

Session relaunch (v4.0.0.13 endless sessions, v4.0.0.14 opt-in per-runtime handover). Read both
notes' handover sections, then `.skilled/hooks/session-relaunch/**` and the runtime adapters.
Three checks: (1) the `SYSTEM_SESSION_RELAUNCH_<RUNTIME>_ENABLED` flags for every runtime named in
v4.0.0.14 after the Hermes removal and the dsh addition; (2) the 80 percent threshold and where it
is computed; (3) model, effort and goal carry-over in the wrapper.

## Actions Taken

1. Read the handover sections of `v4.0.0.13.md` and `v4.0.0.14.md`. v4.0.0.14 names seven runtimes
   (`CLAUDE`, `CODEX`, `PI`, `OPENCODE`, `HERMES`, `CURSOR`, `DEVIN`) at line 55 and claims "every
   hook and plugin reads them the same way" at line 57.
2. Enumerated the relaunch adapter surface: `.skilled/hooks/session-relaunch/{bin,lib,claude,codex,pi,opencode,relative-repo,tests}`.
   No `cursor`, `devin`, `hermes` or `dsh` directory exists, and `grep -rln relaunch` over
   `.cursor/hooks`, `.devin/hooks`, `.dsh` returns nothing.
3. Located the single flag reader, `.skilled/hooks/shared/hook-flags.cjs`, and read its `RUNTIMES`
   list plus `runtimeEnableFlag()`. Diffed it across the release line:
   `git diff f459b06479..51f70a0317 -- .skilled/hooks/shared/hook-flags.cjs` shows exactly one
   changed line, `hermes` removed and nothing added.
4. Exercised the resolver directly (read-only `require`, no repo state touched) to see what each
   runtime name resolves to, including `dsh`.
5. Traced the threshold: `lib/nudge.cjs` (`DEFAULT_THRESHOLD`, `resolveThreshold`, `nextLevel`) and
   `lib/context-usage.cjs` for the ratio it measures against.
6. Traced carry-over: `.skilled/bin/skilled-loop` (the wrapper) for model and effort replay,
   `bin/session-relaunch.cjs` for the record and the goal packet, `lib/goal-handover.cjs` and
   `README.md` for receiver-side binding.
7. Checked the documented operator invocation in `.opencode/commands/speckit/handoff.md`.

## Findings

### f-iter003-001 — Effort carry-over exists for 3 of the 6 runtimes the wrapper launches (P2, drift)

v4.0.0.14 line 71: "The wrapper now replays the launch effort in each runtime's own flag."
The wrapper does replay it, but only for three runtimes. `effort_is_valid()` accepts
`claude:`, `codex:` and `pi:` levels and returns 1 for everything else, and
`append_effort_arguments()` has a `case` arm for `claude`, `codex` and `pi` only.
So a sender's proved effort on `opencode`, `cursor` or `devin` fails validation, is dropped, and
the relaunch falls back to the runtime default — silently, because `append_effort_arguments`
returns 0 on a failed check rather than warning. The note does not carve those runtimes out; it
names Cursor as one of the runtimes whose live model the wrapper reads.

Two readings are consistent with the code and I cannot separate them from source alone: either
those three runtimes have no effort flag to replay (in which case the note over-claims "in each
runtime's own flag" and should say "Claude Code, Codex and Pi"), or they have one and the wrapper
under-implements. Both cannot be true at once; the pair is the defect.

[SOURCE: .skilled/bin/skilled-loop:206] [SOURCE: .skilled/bin/skilled-loop:313]
[SOURCE: .skilled/bin/skilled-loop:303] [SOURCE: .skilled/changelog/skilled/v4.0.0.14.md:71]

- Release: v4.0.0.14
- Confidence: high that the code covers three runtimes; medium on which side is wrong.
- Verify: `grep -n "opencode\|cursor\|devin" .skilled/bin/skilled-loop | grep -i effort` → no match,
  against `grep -n "^    [a-z]*)" .skilled/bin/skilled-loop` which shows the three arms.

### f-iter003-002 — Outside the loop, `prepare` assumes `claude` when `--runtime` is omitted (P2, bug)

`SKILLED_LOOP_RUNTIME` defaults to the literal `'claude'`, and the effective runtime is
`loopId ? envRuntime : (flagRuntime ?? envRuntime)`. A session started before the operator added
the shell line — the exact population v4.0.0.13 line 65 describes as running "outside the loop" —
has no `SKILLED_LOOP_RUNTIME`, so a `prepare` that omits `--runtime` is evaluated as Claude Code.
Consequences, all silent:

- the per-runtime flag consulted is `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED`, so
  `SYSTEM_SESSION_RELAUNCH_ENABLED=1` with `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0` refuses a Pi
  or OpenCode hand-over and names the Claude switch as the reason;
- the pending record is written with `runtime: 'claude'`, so a later adapter or the killer
  treats the sender as Claude.

The handoff command doc tells the operator to pass `--runtime` but phrases the omission rule only
for `--session` ("Only Claude Code can omit it"), which reads as if `--runtime` were optional and
neutral. It is not neutral; it is a silent default to Claude.

[SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:476]
[SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:493]
[SOURCE: .opencode/commands/speckit/handoff.md:139]

- Release: v4.0.0.14 (the runtime flag was introduced here)
- Confidence: high; the ternary and the default are both in the cited lines.
- Verify: run
  `SYSTEM_SESSION_RELAUNCH_ENABLED=1 SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0 node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs prepare --handoff <path> --session x`
  and read the refusal's switch name; it names the Claude switch although no runtime was named.

### f-iter003-003 — v4.0.0.14 still names `HERMES` as one of the seven per-runtime flags (P2, drift)

The note lists `HERMES` in the `<RUNTIME>` set. v4.0.2.0 removed the runtime and
`sessions-relaunch`'s resolver dropped `hermes` from `RUNTIMES` in that same release, and
`ENV-REFERENCE.md` and both env examples list six runtimes with no `hermes`. The note was left
behind while `v4.0.0.1.md` was amended inside the same diff window, so amending a shipped note is
established practice here and this one was missed. A reader wiring `SYSTEM_SESSION_RELAUNCH_HERMES_ENABLED`
gets a flag that resolves to nothing and no warning.

[SOURCE: .skilled/changelog/skilled/v4.0.0.14.md:55]
[SOURCE: .skilled/hooks/shared/hook-flags.cjs:113]
[SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:109]

- Release: v4.0.2.0 (the removal) against v4.0.0.14 (the text)
- Confidence: high.
- Verify: `grep -n "HERMES" .skilled/changelog/skilled/v4.0.0.14.md` → one line;
  `grep -rn "hermes" .skilled/hooks/shared/hook-flags.cjs` → no match.

### f-iter003-004 — `dsh` is absent from the relaunch runtime set, so `SYSTEM_SESSION_RELAUNCH_DSH_ENABLED` is a no-op (P2, extension gap)

`RUNTIMES` is `["claude","codex","pi","opencode","cursor","devin"]`; `dsh` is not in it, so
`runtimeEnableFlag('session-relaunch','dsh')` returns `null` and a dsh caller falls through to the
global `SYSTEM_SESSION_RELAUNCH_ENABLED` with no way to opt out for that runtime alone. The same
list gates `--runtime` and `SKILLED_LOOP_RUNTIME` in the CLI, so `--runtime dsh` throws before any
note is read. This is coherent with dsh shipping no relaunch adapter at all (`.dsh/` holds only
`repo-guards`), and no doc or env example offers a dsh relaunch flag, so nothing is broken today.
What is wrong is the claim: v4.0.2.0 line 52 says "`dsh` sessions match Pi and OpenCode. They get
the advisor brief, goals and every guard" — true for those three, false for the relaunch loop,
which Pi and OpenCode also carry. A dsh session also inherits the f-iter003-002 default if it ever
calls `prepare`.

[SOURCE: .skilled/hooks/shared/hook-flags.cjs:113]
[SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:477]
[SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:52]

- Release: v4.0.2.0
- Confidence: high on the code; the parity sentence is scope-ambiguous, so I read the gap as a
  missing qualifier rather than a broken promise.
- Verify: `node -e 'const f=require("./.skilled/hooks/shared/hook-flags.cjs"); console.log(f.RUNTIMES, f.runtimeEnableFlag("session-relaunch","dsh"))'`
  → six names, `null`.

## Questions Answered

**Session relaunch (v4.0.0.13, v4.0.0.14)** — answered, with two halves that hold and two that do not.

Holds:
- the 80 percent trigger. `DEFAULT_THRESHOLD = 0.8` in `lib/nudge.cjs`, resolved env-then-config
  through `SESSION_RELAUNCH_THRESHOLD` and accepted only when finite in `(0, 1]`; the ratio comes
  from `lib/context-usage.cjs`, which reads the sender's own log tail and honours
  `SESSION_RELAUNCH_WINDOW_TOKENS`. The note and `ENV-REFERENCE.md` describe this correctly.
- model carry-over, and goal carry-over. `lib/relaunch-core.cjs` finds the sender's live model and
  effort per runtime, the wrapper validates the model id before it becomes an argument
  (`model_is_valid`, ≤128 chars), and drops a carried effort when the model switched underneath
  it — the reasoning is written in the code and the failure it prevents is real. The goal packet
  rides the note as `goal_packet`, `consume` reports it, `skilled-loop` exports
  `SESSION_RELAUNCH_GOAL_PACKET`, and `SESSION_RELAUNCH_GOAL=0` removes the field rather than
  leaving a stale one. Codex's inability to name a packet is documented rather than hidden.

Does not hold: effort carry-over beyond Claude Code, Codex and Pi (f-iter003-001); the
per-runtime flag set against the current runtime list (f-iter003-003, f-iter003-004); and the
omitted `--runtime` default (f-iter003-002).

## Questions Remaining

- Does OpenCode, Cursor or Devin expose an effort flag at launch at all? That single fact decides
  whether f-iter003-001 is a note fix or a wrapper fix, and it is not discoverable from this repo.
- Which layer supplies `SKILLED_LOOP_RUNTIME` for a session started before the shell line — is
  `prepare` expected to be called with `--runtime` by the command, the nudge, or the operator?
  The nudge is documented as passing both session id and runtime; the manual path is not.
- Does the killer treat a `runtime: 'claude'` record written by a Pi sender differently from a
  correctly typed one (f-iter003-002's second consequence)?
- Carried: hook safety (three-second stdin deadline, git-call time limit) is still unexamined.

## Next Focus

History after compaction (v4.0.2.0) and question-tool capture, both of which share the dsh and
per-runtime adapter surface opened here. The Claude/Codex hooks that fire at 80 percent were read
only through `lib/nudge.cjs`; a direct read of `.claude/hooks/context-nudge.mjs` and
`.codex/hooks/context-nudge.mjs` is still owed before the relaunch question can be closed as
saturated.

## SCOPE VIOLATIONS

None. Every read was outside the research folder and read-only; the only writes were
`iterations/iteration-003.md`, `deltas/iter-003.jsonl` and the gateway's own record. The one
executed code path was a `require` of `.skilled/hooks/shared/hook-flags.cjs` — a pure resolver
called with a literal env object, touching no repository file.

## Tooling Note

The append gateway accepted this iteration (exit 0, ledger sequence 7, `projectionRefreshed: true`),
but the state-log line it refreshed is a compact projection, not the record: its keys are
`type, iteration, run, status, newInfoRatio, ruledOut, timestamp`, with `run` holding `3` and no
`answeredQuestions`, `runId`, `sessionId` or `lineageId`. Anything that ticks a strategy box by
reading only `deep-research-state.jsonl` therefore cannot see the answered question; the delta file
carries the full record. Recorded as an observation, not a finding, because the reducer is specified
to read the state log and the delta files together and I have not exercised it.
