# CONTEXT
READ-ONLY codebase-context analyzer, deep-context loop iteration 5 — a COMPLETENESS-CRITIC / gap-fill
pass over `system-spec-kit/026-graph-and-context-optimization`. Iters 1–4 already mapped: the program
narrative, the decisions/ADRs/research recommendations, and the code band (code-graph MCP, memory,
embedders, deep-loop runtime, launchers/IPC, hooks, doctor, skill-advisor). 110 findings captured.

# OBJECTIVE — find what is MISSING (only genuinely NEW, high-value findings)
Ask: "what would a `/speckit:plan` author still not know?" Specifically hunt:
1. **000-release-and-program-cleanup track specifics** — only its `spec.md` was read. Glob its
   children (release-readiness, audit, cross-cutting-cleanup, stress-test, clean-room-license-audit,
   docs-and-catalogs-rollup) and capture material outcomes/constraints not already captured.
2. **Cross-cutting runtime gotchas** a planner must know — search `changelog/` and `decision-record.md`
   files for operationally important threads: deep-loop fan-out spawnSync serialization, changelog
   flat-per-track layout, concurrent-session shared git-index race, transparent daemon recycle vs
   launcher restart, `</dev/null` opencode dispatch requirement. Capture as `convention` or `gap`.
3. **High-value reuse/integration NOT yet captured** anywhere in 026's surfaces.
4. **Open gaps / deferred work** — confirm and close the gap list (005 deferred, 028 bridge transport,
   002/004 + 006/003 deferrals, any 007 planned-but-unshipped phases).

# IMPORTANT
Do NOT re-report anything from iters 1–4 (program topology, code-graph/memory/embedder/deep-loop/
launcher/hook/doctor/advisor symbols, ADR-014, trust-axis, single-writer lease, RC-1..RC-4, etc.).
If the scope is genuinely well-covered, it is CORRECT to return only a FEW new findings — do not invent
filler. Returning 0–8 findings is an acceptable, honest result here.

# STYLE / TONE / AUDIENCE
Evidence-cited (`file:line`), precise/neutral, for a `/speckit:plan` author.

# RESPONSE FORMAT
Return ONLY one JSON object, no prose/fences:
{ "findings": [ { "path","symbol","kind" (reuse_candidate|integration_point|convention|dependency|gap),
  "signature","reuse","evidence" (file:line),"relevance" (0..1),"notes" } ] }
omit unit_id; ONLY new findings; honesty over volume.
