DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY: Segment 1 | Iteration 1 of 5 | Questions 0/5 answered | Last focus: none yet | Last 2 ratios: N/A -> N/A | Stuck count: 0 | Resource map: not present; skipping coverage gate.

Research Topic: Validate two launcher/MCP/embedder runtime root causes and produce a unified design-conformance fix plan. T1: hf-local model server spurious spawn via boot-time liveness probe (GET /api/health) treated as embed demand. T2: mk_code_index + mk_skill_advisor secondary-session disconnect because packet 012's daemon IPC bridge socket is not serving at runtime.
Iteration: 1 of 5
Focus Area: **T2 first (highest-value correction).** Packet `012-daemon-bridge-socket-for-skill-advisor-and-code-index` BUILT a daemon IPC bridge so secondary launchers attach instead of exiting `LEASE_HELD_BY (no-bridge-socket)`. But live `lsof` shows NO listener on `/tmp/mk-code-index/daemon-ipc.sock` and `/tmp/mk-skill-advisor/daemon-ipc.sock` (while `/tmp/mk-spec-memory/daemon-ipc.sock` HAS one). Determine WHY the daemon bridge is not binding/serving at runtime. Classify: regression vs conditional gate vs silent bind failure vs EADDRINUSE-unlink race. READ the working reference (mk-spec-memory's `socket-server.ts` + where it calls `startIpcSocketServer`), then the two target daemons (`system-skill-advisor/mcp_server/advisor-server.ts` + `lib/ipc/socket-server.ts`; `system-code-graph/mcp_server/index.ts` + `lib/ipc/socket-server.ts`), and packet 012's `implementation-summary.md`/`plan.md`. Check whether `startIpcSocketServer` is actually CALLED in the built/running daemon (grep dist/ if present), whether it is gated by an env flag (`SPECKIT_LAUNCHER_BRIDGE_DISABLED`), and whether a later packet regressed it.
Remaining Key Questions:
1. T1: cold-state `GET /api/health` probe causes a spawn? confirm trigger + predicted stderr line.
2. T1-fix: does HfLocalProvider's embed path rely on GET /api/health to wake the server?
3. T2: why is packet 012's daemon bridge socket not serving at runtime (no lsof listener)?
4. T2-design: reconcile with 006-mcp-launcher-concurrency (010, 012, 007).
5. Cross-cutting: are T1+T2 both launcher-overlap concurrency consequences; minimal unified fix surface?
Last 3 Iterations Summary: none yet

## STATE FILES

All paths relative to repo root `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`. Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/027-launcher-concurrency-spawn-and-bridge-investigation`

- Config: {spec}/research/deep-research-config.json
- State Log: {spec}/research/deep-research-state.jsonl
- Strategy: {spec}/research/deep-research-strategy.md  (READ the Known Context — it has the prior static findings, live evidence, grounding specs, and key files)
- Registry: {spec}/research/deep-research-findings-registry.json
- Write iteration narrative to: {spec}/research/iterations/iteration-001.md
- Write per-iteration delta file to: {spec}/research/deltas/iter-001.jsonl

(Replace {spec} with the spec folder path above.)

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- READ-ONLY: do NOT modify any source/config; do NOT connect to/curl `hf-embed.sock` (a request triggers the spawn under study); do NOT scan the code graph (intentionally empty).
- Do not implement fixes. Report findings only.
- Validate/refute the prior hypotheses in the strategy's Known Context — do not just restate them. T2's mechanism was already corrected once (it is daemon-side per packet 012, not launcher-side); your job is to find WHY it is not serving at runtime.
- Quote `file:line` evidence for every claim.

## OUTPUT CONTRACT (all THREE required)

1. **Iteration narrative** at `{spec}/research/iterations/iteration-001.md` with headings: Focus, Actions Taken, Findings (with file:line evidence + confidence), Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL record** APPENDED (single line + newline) to `{spec}/research/deep-research-state.jsonl`, type EXACTLY `"iteration"`:
   `{"type":"iteration","iteration":1,"newInfoRatio":<0..1>,"status":"<insight|evidence|partial>","focus":"T2 daemon bridge not serving","graphEvents":[/* optional {type,id,label,relation?,source?,target?} */]}`
   Use `echo '<single-line-json>' >> {spec}/research/deep-research-state.jsonl`.

3. **Per-iteration delta file** at `{spec}/research/deltas/iter-001.jsonl`: one `{"type":"iteration",...}` record (same as #2) plus one record per finding/observation/invariant/edge/ruled_out (each its own JSON line).

Estimate newInfoRatio honestly (1.0 = all new; lower as knowledge saturates). Begin.
