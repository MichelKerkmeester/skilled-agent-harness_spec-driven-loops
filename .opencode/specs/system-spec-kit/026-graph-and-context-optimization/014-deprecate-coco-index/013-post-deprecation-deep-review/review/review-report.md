# Deep Review Report — Post-Deprecation Audit of the 014 CocoIndex/Rerank Arc

**Executor:** cli-devin / SWE-1.6 (4 read-only review iterations, one dimension each) + orchestrator exec-verify pass.
**Scope:** 30 defined surfaces across the deprecation's blast radius (live repo surface + kept exceptions), 6 clusters × 4 dimensions.
**Convergence:** 4/4 dimensions covered; new-findings ratio 4→2→1→0 (declining, iter-4 clean); exec-verify clean. Converged.

---

## 1. Executive Summary
**Verdict: FAIL** (1 active P0 — routes to remediation, not changelog). The deprecation was **thorough**: the independent re-sweep (incl. the `.gemini/`/`.codex/`/`cli-*/` scopes the original executor's greps excluded, and the `ccc` CLI token it missed) found **no new live coco/rerank coupling beyond a small, well-bounded residue**. Active findings: **P0:1, P1:2, P2:4** (+ 2 config-note items already remediated during this review). No behavioral regressions: memory typecheck clean, code-graph 562 tests pass, advisor routing correct, on-disk artifacts gone, port 8765 free.

## 2. Planning Trigger
The active **P0 (F001)** + 2 P1 route this to a remediation packet (`/spec_kit:plan`), not `/create:changelog`. All findings are reference/doc/config residue — each a small surgical fix; none require re-architecture.

## 3. Active Finding Registry
| ID | Sev | Surface | Finding | Evidence | Fix |
|----|-----|---------|---------|----------|-----|
| **F001** | **P0** | A1 4-runtime parity | `.gemini/GEMINI.md` routes Gemini to the **deleted** `mcp__cocoindex_code__search` | `.gemini/GEMINI.md:5` | Rewrite the SEARCH ROUTING line to the HYBRID policy (Code Graph + Grep) to match the other 4 routing docs |
| **F003** | **P1** | A4 command surface | `/memory:manage` still declares the `ccc <status\|reindex\|feedback>` subcommand + CCC MODE §16-17 for the removed `ccc_*` tools | `.opencode/commands/memory/manage.md:3,19,25,40,168,944` | Remove the ccc subcommand declarations + CCC MODE section |
| **F007** | **P1** | F26 governance | 014 phase-parent `spec.md` phase-map marks 002-012 "Complete" despite the residue this review found | `spec.md:101-114` | Add a "complete with known residue" qualifier or update the map after remediation |
| **F002** | **P2** | A5 runtime JSON | advisor `database/skill-graph.json` carries 8 stale `system-rerank-sidecar`/`mcp-coco-index`/`8765` ref-lines | `…/database/skill-graph.json:37,144,221-228,232,239,493-497,522` | Regenerate the `database/` copy. **Exec-verify: NOT active mis-routing** — the live advisor reads the recompiled `scripts/` copy (a code-search intent surfaced 0 coco). Stale-artifact cleanup only. |
| **F004** | **P2** | A3 | `.gitignore:123` stale `.cocoindex_code/` entry | `.gitignore:123` | Remove the entry |
| **F005** | **P2** | E24/F29 | `embedder_pluggability.md §3` carries an obsolescence banner but retains the dead `.venv/bin/ccc` commands | `…/references/memory/embedder_pluggability.md:228-242` | Collapse the §3-6 code-graph embedder columns entirely (banner is honest but the commands mislead) |
| **F006** | **P2** | B | `doctor_deep-loop.yaml:97` has a vestigial `mcp_server/database/*coco*` forbidden-target glob | `.opencode/commands/doctor/assets/doctor_deep-loop.yaml:97` | Remove the dead glob |

## 4. Remediation Workstreams
- **WS-1 (P0, do first):** `.gemini/GEMINI.md:5` → HYBRID routing. One-line fix; closes the 4-runtime-mirror gap.
- **WS-2 (P1):** `/memory:manage` — strip the `ccc` subcommand + CCC MODE §16-17 (6 sites).
- **WS-3 (P1):** 014 `spec.md` phase-map accuracy (after WS-1/2/4 land, or add a residue qualifier now).
- **WS-4 (P2 batch):** regenerate advisor `database/skill-graph.json`; remove `.gitignore:123`; collapse `embedder_pluggability.md §3-6` code-graph columns; remove `doctor_deep-loop.yaml:97` coco glob.

## 5. Spec Seed
A remediation packet (`014/.../014-coco-residue-remediation` or fold into 013): close F001 (P0) + F003/F007 (P1) + the F002/F004/F005/F006 (P2) batch. Scope-locked to the listed files; verify with a repo-wide alias grep (incl `.gemini`/`.codex`) + the 4-runtime routing-doc parity check.

## 6. Plan Seed
1. Fix `.gemini/GEMINI.md` routing (mirror `.claude/CLAUDE.md`). 2. Strip ccc from `/memory:manage`. 3. P2 batch (gitignore, advisor DB graph regen, embedder_pluggability, doctor glob). 4. Update 014 phase-map. 5. Re-grep to 0 live refs (excl documented exceptions); commit scope-strict.

## 7. Traceability Status
- **Core:** `spec_code` — the resource-map/phase-map "complete" claims partially FAIL (F007: residue contradicts "complete"). `checklist_evidence` — n/a (review packet).
- **Overlay:** `agent_cross_runtime` — DRIFT (F001: GEMINI.md disagrees with the other 4 routing docs); others (skill_agent, feature_catalog, playbook) — pass / no new drift.

## 8. Resource Map Coverage Gate
`resource_map_present = true` (`../resource-map.md`). The map's DELETE/EDIT classifications hold for the skill/code/config surfaces; the residue found is in surfaces the map under-scoped (the `ccc` CLI token + the `.gemini` runtime routing doc + the `database/` graph copy) — consistent with the session's known "research under-mapped" pattern. No map entry is still-live as a coupling.

## 9. Deferred Items
- **Remediated during this review (config reconciliation):** dead `SPECKIT_RERANK_LAYER` flag removed from `.claude/mcp.json`/`.agents/config.toml`/`.codex/config.toml`/`.gemini/settings.json`; `.devin/config.local.json` server key `mk_spec_memory`→`mk-spec-memory` (resolved the devin duplicate). All 9 MCP configs now consistent + 0 coco/rerank.
- **Documented exceptions confirmed inert (D4):** `process-memory-harness`/`process-sweep` coco/rerank kill-classes (match-only, never spawn), cli-* `pkill ccc search`, test-query fixtures (coco as search-term data), frozen benchmarks/observability/changelogs.
- **devin profile (outside repo):** `devin mcp list` shows a broken `spec_kit_memory` singular path (`.opencode/skill/…`) + duplicate memory registrations in `~/.config/devin/` — reconcile via `devin mcp remove spec_kit_memory` (the repo `.devin/config.json` + `config.local.json` are now correct).

## 10. Audit Appendix
- **Coverage:** D1 Correctness (iter-1, cluster A), D2 Security (iter-2, cluster B), D3 Traceability (iter-3, clusters B+F), D4 Maintainability (iter-4, clusters D+E). All read-only via the cli-devin review-iter recipe (sequential_thinking ≥5 thoughts enforced).
- **Exec-verify (orchestrator, execution-only targets):** memory typecheck 0 errors (surface 11); code-graph 59 files/562 pass/1 skip (surface 12); advisor code-search intent → 0 coco (surface 13/30); on-disk: no `~/.cocoindex_code`, no `.cocoindex_code`, port 8765 free, no real coco/rerank daemons (surface 25). The full system-spec-kit vitest (10,611 tests) is not run to completion (suite-size timeout, pre-existing — not coco-related); the coco-adjacent subset (201 tests) passed in prior verification.
- **Convergence evidence:** new-findings ratio per iter: 1.0 → ~0.2 → ~0.1 → 0.0. All 4 dimensions covered. P0 present → verdict FAIL (find-only; resolution = remediation).
