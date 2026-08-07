# Deep-Context Strategy — 026 graph-and-context-optimization

## Scope
All work done in `system-spec-kit/026-graph-and-context-optimization` — **both bands**:
- **Docs band:** the program narrative — what each of the 9 phases (000–008) / ~110 sub-phases delivered, key decisions, prior art.
- **Code band:** the live code subsystems the program produced/modified — code-graph MCP, memory+embedder runtime, deep-loop runtime, daemon launchers/IPC, hooks, doctor, templates, skill-advisor.

Read-only input root (canonical, git-tracked): `.opencode/specs/system-spec-kit/026-graph-and-context-optimization`
(the `specs/...` path the operator gave is a symlink to this).

## Executor pool (by-model-shared-scope)
| label | kind | model | framework | note |
|-------|------|-------|-----------|------|
| mimo | cli-opencode | xiaomi/mimo-v2.5-pro (--variant high) | COSTAR | single seat; pay-per-token Direct API; agreement = self-confirmation (agreementMin=1) |

> Single-lens run: cross-executor agreement is non-informative; confidence reflects one model's view + citation verification. Relevance gate (0.55) and frontier coverage are the real quality guards.

## Thresholds
- maxIterations: 10 (expected convergence ~iter 4–6; cap, not a target)
- convergenceThreshold: 0.10 (per-iteration new-agreement-eligible / merged-findings floor)
- relevanceGate: 0.55 · agreementMin: 1 · stuckThreshold: 2

## Seeded frontier (ranked SLICE anchors — Glob+Grep fallback; Code Graph MCP down)

### Docs band
1. `026/spec.md` — root program map, 8-track topology, status
2. `026/context-index.md` — migration bridge, old→new path resolution, consolidation history
3. `026/001-research-and-baseline/` (subtree) — external research corpus, recommendations, adoption decisions
4. `026/002-spec-kit-internals/spec.md` — resource-map/deep-loop plumbing, skill-advisor, template system, naming
5. `026/003-memory-and-causal-runtime/spec.md` — memory continuity, causal-graph routing, embedding architecture
6. `026/004-code-graph/spec.md` — code-graph package, CocoIndex decoupling, extraction/isolation
7. `026/005-graph-impact-and-affordance/spec.md` — DEFERRED adoption-uplift display work
8. `026/006-operator-tooling/spec.md` — hook parity, doctor command surface, session lifecycle
9. `026/007-mcp-daemon-reliability/spec.md` — IPC canonicalization, WAL/durability, watchdog, dispose
10. `026/008-runtime-defect-fixes/{spec,implementation-summary,plan,tasks}.md` — four live integration defects
11. `026/000-release-and-program-cleanup/spec.md` — release readiness, audits, stress, cleanup

### Code band
12. `.opencode/skills/system-code-graph/mcp_server/{index.ts,tools/code-graph-tools.ts,core/config.ts}` — code-graph MCP
13. `.opencode/skills/system-spec-kit/mcp_server/lib/memory/` — memory continuity runtime
14. `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/` + `shared/embeddings.ts` — embedding architecture
15. `.opencode/skills/deep-loop-runtime/scripts/{fanout-run,fanout-merge,reduce-state,convergence,upsert}.cjs` — deep-loop runtime
16. `.opencode/bin/{mk-spec-memory-launcher,mk-code-index-launcher}.cjs` + `lib/launcher-ipc-bridge.cjs` — daemon launchers/IPC
17. `.codex/hooks.json` + hook system references — runtime hook parity
18. `.opencode/commands/doctor/` — doctor command surface
19. `.opencode/skills/system-skill-advisor/` — skill-advisor system

## Iteration plan (focus advances across bands)
- iter 1 — Docs band: program narrative (anchors 1,2 + the 9 phase spec.md)
- iter 2 — Docs band: research + decisions (anchor 3 subtree + 008 impl-summary + high-signal decision-records)
- iter 3 — Code band: code-graph + memory + embedders (anchors 12–14)
- iter 4 — Code band: deep-loop runtime + launchers/IPC + hooks/doctor/advisor (anchors 15–19)
- iter 5+ — recovery/gap-fill on uncovered or low-relevance slices until saturation or cap

## Next Focus
iter 1 — Docs band program narrative: anchors 1, 2, and the 9 phase `spec.md` files.

## Known Context
None loaded (memory_context not run; the 026 docs are the authoritative source). Output packet lives in-folder at `026-graph-and-context-optimization/context/`.
