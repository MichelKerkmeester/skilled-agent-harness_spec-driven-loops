# Deep Research Strategy — composer lineage

## 2. TOPIC
Dead code, deletable legacy files, backup/scratch residue, misplaced files, architecture and structure problems, and over-engineered subsystems across `.opencode/`, repository-root config, and runtime mirrors (`.claude/`, `.codex/`, `.cursor/`, `.devin/`).

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which bin/ and launcher scripts lack runtime callers outside documentation? (iteration 1)
- [x] What MCP-server legacy paths, broken symlinks, or deleted runtime artifacts remain? (iteration 2)
- [x] Which deep-loop runtime scripts are minimally referenced outside their own tree? (iteration 3)
- [x] Where do hub mode registries contradict live routing or retain removed modes? (iteration 4)
- [x] How do commands/, agents/, and runtime mirror directories diverge from `.opencode/` authority? (iteration 5)
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- No deletion, move, rename, or refactor of audited files (read-only phase).
- No audit of `.opencode/specs/` packet content (explicit exclusion).
- No remediation ranking merge across other fan-out lineages in this session.

---

## 5. STOP CONDITIONS
- `maxIterations: 5` with `stopPolicy: max-iterations` (forced depth; convergence is telemetry only).
- All five divergent surface angles visited once each.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Bin orphans: `cli-exit-taxonomy-smoke.cjs`, `check-no-spec-imports.cjs` (docs/tests only) — iteration 1, 5
- MCP legacy: deleted `:memory:` sidecar, vector shard migration, hook triplication — iteration 2
- Deep-loop: dual reducers, review-only append-state-record, fanout script weight — iteration 3
- Hub metadata: sk-design auditFrame drift, duplicate feature catalogs — iteration 4
- Mirrors: all agents differ opencode vs claude; colon-form doctor companions — iteration 5
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- String-literal reference counting across `.opencode/` excluding specs surfaced orphan smoke scripts and broken symlinks import graphs miss.
- Pivoting per iteration across bin → MCP → deep-loop → hub metadata → mirrors avoided re-deepening compiled-routing internals.
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Import-graph-only dead-code search: dynamic `require()` in `compiled-route.cjs` hides live rollout routers.
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Import-graph dead-code sweep — BLOCKED (iteration 1)
- What was tried: ripgrep for static imports of rollout `router.cjs` files
- Why blocked: runtime engine loads routers via `fs.existsSync` + dynamic `require`
- Do NOT retry: static import-only dead-code proofs for compiled-routing tree
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Treating all `009-parent-hub-rollout/**/router.cjs` as dead: ruled out — loaded by `014-runtime-engine/lib/compiled-route.cjs` (iteration 1)
- Treating committed `node_modules` under skills as CAT-3: ruled out — gitignored (iteration 1)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 5
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: bin → mcp-server → deep-loop runtime → hub metadata → commands/agents/mirrors
- Remaining frontier: none (synthesis complete)
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Whether `005-decision-evaluator` and `008-calibration` closure files are build-only dead weight or required for manifest sync (partial — listed in serving closure, not imported by runtime engine)
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Synthesis complete — 22 findings in `research.md`; stopReason max_iterations.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
- Phase 016 spec: audit-only; 20-pass research program; remediation is follow-on.
- Parent release-cleanup phases 001–015 swept documentation surfaces only.
- resource-map.md not present; skipping coverage gate.
- Bounded snapshot pointers: `.opencode/bin/`, `.opencode/skills/*/mcp-server/`, `.opencode/skills/system-deep-loop/runtime/`, hub `mode-registry.json` + `hub-router.json`, `.opencode/commands/`, `.opencode/agents/`, runtime mirrors.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05 (telemetry only; do not stop early)
- Per-iteration budget: 12 tool calls
- Executor: cli-cursor / composer-2.5-fast
- Lineage: composer / session fanout-composer-1785133613018-3fbdzo
- Started: 2026-07-27T06:30:00Z
