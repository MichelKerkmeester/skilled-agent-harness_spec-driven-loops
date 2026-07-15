# Deep Research Strategy — Skill-Advisor CLI Feasibility

## Topic

Dual-stack CLI fallback feasibility for mk_skill_advisor (9 tools). Forced 10 iterations, one KQ focus per iteration; spec-memory record is settled premise (read as input, do not relitigate).

## Done-Definition

Every KQ terminally answered with file:line or measured evidence; verdict-shaped research.md (parity matrix, loss table, prior-art transfer, go/no-go, deltas, effort).

## Key Questions

- [ ] KQ1: parity matrix, all 9 tools: STATELESS vs STATE-DAEMON classification, CLI mapping per tool, daemon-required vs direct-read paths. 
- [ ] KQ2: daemon-dependency audit: what dies per architecture — FS watcher auto-rebuild, daemon-lease sqlite, in-process prompt cache, telemetry sink, anything resident. 
- [ ] KQ3: affordance transfer: which spec-memory answers port verbatim and which do not — Zod schemas here ARE exportable, so confirm the codegen path is the closest sibl
- [ ] KQ4: prior-art deep-dive (CENTRAL): build the skill_advisor.py coverage matrix per tool; QUANTIFY Python-vs-native scorer divergence empirically (run BOTH paths on i
- [ ] KQ5: long-running ops: advisor_rebuild and skill_graph_scan duration profile + the skill_graph_compiler.py build chain — per-call CLI vs async job semantics. 
- [ ] KQ6: integration-surface map MEASURED: exact files/counts — UserPromptSubmit hooks (claude/gemini/codex), codex prompt-wrapper fallback, OpenCode plugin + plugin bri
- [ ] KQ7: hook-latency fit (SHARPEST HERE): the advisor brief sits on the prompt-submit critical path in every runtime — measure the current brief generation path cost an
- [ ] KQ8: dual-stack coexistence + races + THE ORPHAN INCIDENT: root-cause the six-orphaned-launchers class from the launcher source (which lifecycle path leaks), and spe
- [ ] KQ9: risk register + named design deltas (D-series) an implementation phase must absorb, each with file/mechanism/acceptance. 
- [ ] KQ10: verdict synthesis: go/no-go, architecture pick (including whether the CLI subsumes or wraps skill_advisor.py), bottom-up effort, explicit inheritance list, and 

## Known Context

- Spec-memory record (premise): generic CLI-over-daemon settled — exits 0/1/64/69/75, auto-spawn via launcher, codegen-from-registry, warm-only hook policy, ~40–46ms p95 node start / 0.48ms IPC RTT on this host.
- This system shares launcher-ipc-bridge.cjs + owner-lease architecture with mk-spec-memory.
- Read-only bash measurements permitted; no file mutation outside the lane artifact dir.

## Next Focus

Iteration 1: KQ1 (parity matrix). Then one KQ per iteration in order; newly discovered risks append as new KQs needing terminal classification.

## Parameters

- Max iterations: 10 (forced terminal cap; convergence pinned 0)
- Executor: cli-codex gpt-5.5, reasoning high, service tier fast, 1500s/iteration
