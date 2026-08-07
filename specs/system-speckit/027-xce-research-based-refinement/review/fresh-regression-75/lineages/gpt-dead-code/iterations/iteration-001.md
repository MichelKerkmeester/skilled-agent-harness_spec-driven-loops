# Seat gpt-dead-code — iteration 1 (global #54)

- Model: `claude-opus-4-8` · Executor: claude · Angle: gpt-dead-code
- Verdict: **CONDITIONAL** · Findings: P0=0 P1=0 P2=1

## Analysis

I've completed a thorough read-only trace of the slice. Here is my analysis.

## Review: gpt-dead-code — Loop-YAML script-invocation wiring

**Method:** Grepped each script name in `deep-loop-{runtime,workflows}/.../scripts/*` against all `deep_*_{auto,confirm}.yaml`, then traced every zero-YAML-reference script to its transitive caller or its documented entry-point role before judging it dead.

### Runtime scripts (`deep-loop-runtime/scripts/`) — all reachable
- `convergence.cjs`, `upsert.cjs`, `loop-lock.cjs` — executed via `bash:`/`command:` in all four loops.
- `fanout-run.cjs` — executed (research/review; opt-in in context). `fanout-pool.cjs` / `fanout-salvage.cjs` — live top-level `require()` inside `fanout-run.cjs` (`fanout-run.cjs:34,325`), so transitively wired.
- `fanout-merge.cjs` — genuinely executed in research/review synthesis (`deep_research_auto.yaml:860`, `command:`); the deep-context `tool:`/"reuse its shape" reference (`deep_context_auto.yaml:490`) is by design — deep-context does a HOST merge and `reduce-state.cjs` is the writer.
- `query.cjs` — **not** loop-wired, but documented manual/doctor entry point (`script_interface_contract.md`, `feature_catalog/script-entry-points/query-script.md`, doctor `_routes.yaml`). Not dead.
- `lib/cli-guards.cjs`, `status.cjs` — required by multiple scripts / wired in ai-council.

### Per-mode workflow scripts — all reachable
- `reduce-state.cjs` (context/research/review) — the real reducer, executed (`deep_context_auto.yaml:521`). `shared/synthesis/resource-map.cjs` — required by each `reduce-state.cjs`. `orchestrate-topic.cjs`/`persist-artifacts.cjs` — transitive from `orchestrate-session.cjs` (YAML-wired). `advise-council-completion.cjs` — documented manual/pre-commit advisory CLI (ai-council SKILL.md step 6). 
- `runtime-capabilities.cjs` (research/review) — zero loop-YAML/`.cjs` invocations, but it is a **documented capability-matrix resolver** (`references/guides/capability_matrix.md`, SKILL.md "Scripts:") with unit-test coverage (matrix-conformance vitest). Intentional parity/conformance CLI, not dead.

**Conclusion on the assigned class:** No "reducer/script present but never invoked" defect. The deep-context reducer-unwired class does **not** recur — every reducer is wired.

### One fresh maintainability finding (P2)
deep-context invokes a *divergent* loop-lock CLI wrapper (`deep-loop-workflows/deep-context/scripts/loop-lock.cjs`, flags `--lock`/`--packet`/`--owner`, default TTL `3600000`) while all other loops use the runtime adapter (`deep-loop-runtime/scripts/loop-lock.cjs`, flags `--lock-path`/`--packet-id`/`--owner-pid`, default TTL `300000`). Both wrap the same `lib/deep-loop/loop-lock.ts`. Each YAML is internally consistent (no current correctness break), but the flag-name + 12× TTL-default drift directly contradicts the runtime adapter's own stated purpose ("share one locking contract instead of drifting per mode", `loop-lock.cjs:6-9`). A maintainer copying an invocation between loops would pass the wrong flag shape.

```json
{"seat":"gpt-dead-code","model":"openai/gpt-5.5-fast","angle":"Loop-YAML script-invocation wiring: a reducer/script present but never invoked by the loop YAML (the deep-context reducer-unwired class). Grep the loop YAMLs for each script call.","verdict":"CONDITIONAL","summary":"No reducer-unwired defect — every reducer/script is wired or a documented manual/conformance entry point. One P2: deep-context uses a divergent loop-lock wrapper (flags + TTL) vs the runtime adapter.","files_reviewed":[".opencode/commands/deep/assets/deep_context_auto.yaml",".opencode/commands/deep/assets/deep_research_auto.yaml",".opencode/commands/deep/assets/deep_review_auto.yaml",".opencode/commands/deep/assets/deep_ai-council_auto.yaml",".opencode/skills/deep-loop-runtime/scripts/loop-lock.cjs",".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs",".opencode/skills/deep-loop-workflows/deep-context/scripts/loop-lock.cjs",".opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs",".opencode/skills/deep-loop-workflows/deep-research/scripts/runtime-capabilities.cjs",".opencode/skills/deep-loop-workflows/deep-research/references/guides/capability_matrix.md"],"findings":[{"severity":"P2","dimension":"maintainability","title":"Two divergent loop-lock CLI wrappers over one lib: deep-context drifted in flag contract and default TTL","file":".opencode/skills/deep-loop-workflows/deep-context/scripts/loop-lock.cjs:60","evidence":"deep-context wrapper uses --lock/--packet/--owner (lines 60,86,88) with default ttlMs=3600000 (line 86); the runtime adapter scripts/loop-lock.cjs uses --lock-path/--packet-id/--owner-pid (lines 147-148,156) with default ttlMs=300000 (line 149). deep_context_auto.yaml:174 calls the workflows wrapper; deep_research/review/ai-council call the runtime adapter (verified via uniq of all acquire/release invocations). Neither acquire passes a TTL flag, so context locks live 1h vs 5min elsewhere. Both wrap lib/deep-loop/loop-lock.ts.","why":"The runtime adapter's own header (scripts/loop-lock.cjs:6-9) states it exists so callers 'share one locking contract instead of drifting per mode'; deep-context retaining a separate wrapper with different flag names and a 12x-different default TTL is exactly that drift. No current correctness break (each YAML matches its wrapper), but it is a maintenance hazard: an invocation copied between loops passes the wrong flag shape and silently fails (exit 3), and the stale-lock reclaim window differs across loops sharing the 'same source of truth' claim.","recommendation":"Point deep_context_auto/confirm.yaml at the runtime adapter (deep-loop-runtime/scripts/loop-lock.cjs) with --lock-path/--packet-id/--owner-pid, or align the deep-context wrapper's flag names and default TTL to the runtime adapter. If the host-driven loop genuinely needs in-process require (no re-exec) and a longer TTL, document that divergence explicitly in both wrapper headers so the difference is intentional, not accidental drift."}]}
```
