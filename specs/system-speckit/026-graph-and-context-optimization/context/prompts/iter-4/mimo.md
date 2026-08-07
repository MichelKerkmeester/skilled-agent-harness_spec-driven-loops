# CONTEXT
READ-ONLY codebase-context analyzer, deep-context loop iteration 4 (final planned sweep). Iters 1–2
mapped the 026 narrative/decisions; iter 3 mapped the code-graph/memory/embedder CODE. THIS iteration
covers the REMAINING code band: the deep-loop runtime, daemon launchers/IPC, runtime hooks, the doctor
surface, and the skill-advisor. CODE-level: real `file:line`, real symbols + signatures.

# KNOWN CONTEXT (iter 3 already covered — do NOT repeat)
code-graph MCP tool handlers, memory continuity/indexer/quality-gate exports, local-first embedder
cascade + dispose. Skip those; cover the subsystems below.

# OBJECTIVE — code band part 2
Use Glob/Read/Grep over:
1. **deep-loop runtime** — `.opencode/skills/deep-loop-runtime/scripts/`
   (`fanout-run.cjs`, `fanout-merge.cjs`, `reduce-state.cjs`, `convergence.cjs`, `upsert.cjs`) and
   `lib/coverage-graph/`, `lib/council/multi-seat-dispatch.cjs`. Capture the reusable runtime helpers
   (writeStateAtomic, repairJsonlTail, buildLineageCommand, dispatchCouncilSeats, evaluate* convergence,
   coverage-graph upsert) — these are the shared substrate the deep loops reuse.
2. **daemon launchers + IPC** — `.opencode/bin/` (`mk-spec-memory-launcher.cjs`,
   `mk-code-index-launcher.cjs`, `lib/launcher-ipc-bridge.cjs`, `lib/launcher-session-proxy.cjs`).
   Capture the lease/owner-pid, transparent-recycle vs launcher-restart, IPC bridge seams.
3. **runtime hooks** — `.codex/hooks.json` + the hook system references under
   `.opencode/skills/system-spec-kit/references/hooks/` (SessionStart/UserPromptSubmit parity).
4. **doctor surface** — `.opencode/commands/doctor/` (subcommand router, mutation classes).
5. **skill-advisor** — `.opencode/skills/system-skill-advisor/` (advisor recommend/scoring, skill graph).

Capture reuse candidates (reusable helpers/handlers with signatures), integration points (the seams a
new loop/daemon/hook plugs into), conventions (atomic-write, JSONL-repair, single-dispatch discipline,
hook envelope shape), and dependencies (which subsystem imports which).

# STYLE / TONE / AUDIENCE
Same as iter 3: CODE-level, `file:line` evidence, real symbols; precise/neutral; for a
`/speckit:plan`/`implement` author building on this substrate.

# RESPONSE FORMAT
Return ONLY one JSON object, no prose/fences. Same schema as iter 3:
{ "findings": [ { "path","symbol","kind" (one of reuse_candidate|integration_point|convention|dependency|gap),
  "signature","reuse","evidence" (file:line),"relevance" (0..1),"notes" } ] }
omit unit_id; 15–30 NEW findings; emit a `gap` for any stale/moved path. Do not pad.
