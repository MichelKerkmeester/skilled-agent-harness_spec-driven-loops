# Deep Review Strategy — Post-Deprecation Audit of the 014 CocoIndex/Rerank Arc

## Topic
Independent deep review of the completed 014 CocoIndex + `system-rerank-sidecar` deprecation (~21 commits): did we miss any reference, break any behavior, or leave any inconsistency? Executor: **cli-devin / SWE-1.6** (read-only review-iter recipe). The executor's own greps had pattern/scope blind spots (`cocoindex` → `ccc` → `ccc_*`), so this review re-sweeps independently across **30 defined surfaces**.

## Review Dimensions (risk-ordered)
- [ ] **D1 Correctness** — removal didn't break behavior; no dangling/half-reverted state; cross-skill type consistency
- [ ] **D2 Security** — no orphan daemons / stale endpoints / secret-redaction regressions from the removal
- [ ] **D3 Traceability** — spec/code/doc alignment; the 4-runtime mirror parity; the resource-map classifications hold; memory/continuity accuracy
- [ ] **D4 Maintainability** — no misleading stale docs/config; the kept "documented exceptions" are justified

## Files Under Review — the 30 Surfaces (coverage matrix)

### A. Reference completeness
1. 4-runtime routing-doc parity: `.gemini/GEMINI.md` (⚠ CONFIRMED miss) vs `CLAUDE.md`/`AGENTS.md`/`.claude/CLAUDE.md`/`.codex/AGENTS.md`
2. Exhaustive alias sweep (incl `.gemini`/`.codex`/`cli-*`/hidden dirs): `CocoIndex`,`cocoindex_code`,`cocoindex-code`,bare `ccc `+subcmds,`ccc_*`,`8765`,`Qwen3-Reranker`,`SPECKIT_CROSS_ENCODER`,`RERANKER_LOCAL`,`.cocoindex_code`,`.mk_code_index`,`registered_embedders`,`sidecar_ledger`,`positional_scoring_fallback`,`cocoIndexAvailable`,`vector channel`
3. `.gitignore` `.cocoindex_code/` entry (⚠ CONFIRMED line 123)
4. `/memory:manage` `ccc <status|reindex|feedback>` subcommand + CCC MODE §16-17 (⚠ CONFIRMED)
5. Runtime/DB JSON: advisor `database/skill-graph.json` (⚠ CONFIRMED 5 refs), `.doctor-update.last-run.json`, `.utcp_config.json`, `.advisor-state`/cache JSON

### B. Config / registration / mirror integrity
6. 6 MCP configs (`opencode.json`,`.vscode/mcp.json`,`.gemini/settings.json`,`.codex/config.toml`,`.mcp.json`,`.devin/config.json`) coco-free + valid
7. Agent mirror parity (context, deep-review, @code) across 4 runtimes
8. Command mirror parity (`deep/*`,`doctor/*`,`memory/*`,`create/*`) incl `allowed-tools`
9. The 4 deep-loop executor YAMLs — `cocoindex_code` gone from `mcp_servers:`+`tools:`; loops start
10. graph-metadata across ALL skills + BOTH `skill-graph.json` (`scripts/`+`database/`) regenerated coco-free
   - ⚠ NOTE: `devin mcp list` shows a **broken `spec_kit_memory` path** (`.opencode/skill/` singular — 096 residue) + duplicate memory registrations (mk-spec-memory / mk_spec_memory / spec_kit_memory) — verify + classify.

### C. Build / test / dist / type integrity
11. Full `system-spec-kit` (memory) vitest — entire suite passes (timed out during the work)
12. Full `system-code-graph` suite + build — pass; 8 tools; dist coco-free
13. skill-advisor vitest + `skill_advisor.py` + `advisor_rebuild` — never recommends deleted `mcp-coco-index`; DB graph regenerated
14. dist freshness — every affected skill's `dist/` matches source (no stale coco dist)
15. Cross-skill TS type boundaries (the latent-002-break class) — any OTHER cross-skill contract break

### D. Behavioral / runtime correctness
16. `memory_search` — results/scoring unchanged (D1); removed coco-keyed vector warning didn't strand a real one
17. `code-graph` runtime — query/scan/status/context work; tree-sitter; no coco daemon dep
18. Memory hooks (`session-start`×rt, `compact-inject`, `session-prime`×rt) — run without removed coco fields
19. `session-resume` / context packaging — heavy `session-resume.ts` coco removal didn't break resume
20. deep loops + `/doctor` — start without coco MCP; `/doctor` coco-free + consistent with deleted playbooks

### E. Incident blast-radius + kept exceptions
21. 009 blind-rename revert — no dangling `codeGraph-*` artifacts/imports
22. Frozen-data reverts — incident-#3 benchmark/observability corruption fully reverted (no `rerank-rerank-consumer`/`code_graph-complete-fork`)
23. Latent-002-break class — ALL cross-skill consumers fixed (every skill tsc-clean)
24. Kept exceptions inert/justified: `process-memory-harness`/`process-sweep` (RM-8), cli-* `pkill ccc search`, `embedder_pluggability.md §3` banner, test-query fixtures — **flag if any is actually a LIVE coupling**
25. On-disk artifacts — `~/.cocoindex_code/`, HF cache, port 8765 free, no orphan ccc/rerank daemons

### F. Spec / doc / governance + decision integrity
26. 014 spec-folder — phase-map (002-012) matches reality; resource-map classifications hold; `validate.sh`; `FRONTMATTER_MEMORY_BLOCK` warning
27. Memory/continuity accuracy — `project_014` + 022-supersession + `MEMORY.md` (the "0 live refs" claim is disproven by §A)
28. D1/D2 decisions re-examined — D1 holds (no regression)? D2 (HYBRID) — real capability gap for "find code by concept"?
29. HYBRID doc-prose accuracy — no remaining "enable the sidecar"/"use CocoIndex" misleading text (GEMINI.md class); `embedder_pluggability §4-6` columns
30. Skill-advisor routing — code-search intents route to code-graph/Grep, not the deleted skill (scorer fixtures + lanes post-008)

## Cross-Reference Status
- **Core (hard):** `spec_code` (normative claims → shipped behavior), `checklist_evidence` (014 checklist marks have evidence) — PENDING
- **Overlay (advisory):** `skill_agent`, `agent_cross_runtime` (4-runtime parity — esp. GEMINI.md), `feature_catalog_code`, `playbook_capability` — PENDING

## Known Context (pre-seeded — VERIFY + EXTEND, don't re-discover)
**4 confirmed misses (verified read-only before this review):**
- `.gemini/GEMINI.md:5` routes to deleted `mcp__cocoindex_code__search` (other 4 routing docs clean) → **P0/P1 candidate** (4-runtime-mirror gap).
- `.gitignore:123` `.cocoindex_code/` stale ignore.
- `system-skill-advisor/mcp_server/database/skill-graph.json` 5 stale `system-rerank-sidecar`/`8765` refs (only `scripts/` copy recompiled).
- `/memory:manage manage.md` declares `ccc <status|reindex|feedback>` + CCC MODE §16-17 for removed `ccc_*` tools.
- `devin mcp` profile: broken `spec_kit_memory` singular path + duplicate memory registrations.

**Architecture facts:** code-graph engine = tree-sitter (NOT cocoindex; no `.venv/bin/ccc`). Memory search = embedder-backed hybrid (vector/bm25/fts/graph/degree). Both build green; both dists coco-free. Resource map: `../resource-map.md` exists → `resource_map_present = true` (audit coverage).

**Documented exceptions (intentionally kept — verify justified, not a live coupling):** see §24/§29.

## Review Boundaries / Charter
- **In scope:** the 014 deprecation's blast radius across the repo (live surface + kept exceptions) + the decision integrity (D1/D2).
- **Read-only:** review-iter recipe forbids Bash; cli-devin uses Read/Grep/Glob + sequential_thinking. Execution-only targets (11/12/13/16/17/20/25 — full vitest, MCP smoke, on-disk) get a **separate orchestrator exec-verify pass** folded into findings.

## Non-Goals
- Re-litigating whether CocoIndex/rerank SHOULD have been deprecated (decided).
- Editing frozen historical records (benchmarks/observability/changelogs/specs) — verify-only.
- Remediation (findings → a separate packet on operator go-ahead).

## Stop Conditions
- All 4 dimensions covered + required core traceability protocols pass + weighted new-findings ratio ≤ 0.10 over the last 2 iterations + coverage stabilized ≥ 1 pass, OR maxIterations (14) with documented gate results. Any new P0 blocks STOP.

## Next Focus
Iteration 1 → **D1 Correctness** over cluster A (reference completeness) + the §10/§24 devin-mcp + exception surfaces; verify the 4 pre-seeded misses.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [ ] security
- [ ] traceability

<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 1
- P1 (Required): 3
- P2 (Suggestions): 3
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **Agent mirror parity**: context and deep-review agents across .opencode, .claude, .gemini are clean — no coco references. (.codex uses canonical .opencode agents, no local copies found.) -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Agent mirror parity**: context and deep-review agents across .opencode, .claude, .gemini are clean — no coco references. (.codex uses canonical .opencode agents, no local copies found.)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Agent mirror parity**: context and deep-review agents across .opencode, .claude, .gemini are clean — no coco references. (.codex uses canonical .opencode agents, no local copies found.)

### **Command mirror parity**: deep/* commands are clean; doctor/* has one vestigial glob (F006). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Command mirror parity**: deep/* commands are clean; doctor/* has one vestigial glob (F006).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Command mirror parity**: deep/* commands are clean; doctor/* has one vestigial glob (F006).

### **Deep-loop YAMLs**: All 4 executor YAMLs are clean — no `cocoindex_code` in `mcp_servers:` or `tools:` sections. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Deep-loop YAMLs**: All 4 executor YAMLs are clean — no `cocoindex_code` in `mcp_servers:` or `tools:` sections.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Deep-loop YAMLs**: All 4 executor YAMLs are clean — no `cocoindex_code` in `mcp_servers:` or `tools:` sections.

### **Doc-prose accuracy (surface 29)**: No misleading instructions: -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Doc-prose accuracy (surface 29)**: No misleading instructions:
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Doc-prose accuracy (surface 29)**: No misleading instructions:

### **Incident-revert cleanliness (surfaces 21-22)**: No residue: -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Incident-revert cleanliness (surfaces 21-22)**: No residue:
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Incident-revert cleanliness (surfaces 21-22)**: No residue:

### **Kept exceptions (RM-8)**: All justified-inert, no live coupling: -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Kept exceptions (RM-8)**: All justified-inert, no live coupling:
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Kept exceptions (RM-8)**: All justified-inert, no live coupling:

### **MCP configs**: All 5 accessible configs (.vscode/mcp.json, .gemini/settings.json, .codex/config.toml, .mcp.json, .devin/config.json) are clean — no `cocoindex_code` server blocks, no `RERANK_SIDECAR` or `8765` env vars. (Note: `opencode.json` does not exist at the expected path.) -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **MCP configs**: All 5 accessible configs (.vscode/mcp.json, .gemini/settings.json, .codex/config.toml, .mcp.json, .devin/config.json) are clean — no `cocoindex_code` server blocks, no `RERANK_SIDECAR` or `8765` env vars. (Note: `opencode.json` does not exist at the expected path.)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **MCP configs**: All 5 accessible configs (.vscode/mcp.json, .gemini/settings.json, .codex/config.toml, .mcp.json, .devin/config.json) are clean — no `cocoindex_code` server blocks, no `RERANK_SIDECAR` or `8765` env vars. (Note: `opencode.json` does not exist at the expected path.)

### **Resource-map DELETE classifications**: Both deleted skills confirmed gone — mcp-coco-index and system-rerank-sidecar folders do not exist in .opencode/skills/. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Resource-map DELETE classifications**: Both deleted skills confirmed gone — mcp-coco-index and system-rerank-sidecar folders do not exist in .opencode/skills/.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Resource-map DELETE classifications**: Both deleted skills confirmed gone — mcp-coco-index and system-rerank-sidecar folders do not exist in .opencode/skills/.

### **Runtime routing parity**: CLAUDE.md, AGENTS.md, and .claude/CLAUDE.md all have the correct HYBRID search-routing policy (Code Graph + Grep). .codex/AGENTS.md is voice/tone only and uses the project-level AGENTS.md. The only drift is the known F001 in .gemini/GEMINI.md (routes to deleted mcp__cocoindex_code__search). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Runtime routing parity**: CLAUDE.md, AGENTS.md, and .claude/CLAUDE.md all have the correct HYBRID search-routing policy (Code Graph + Grep). .codex/AGENTS.md is voice/tone only and uses the project-level AGENTS.md. The only drift is the known F001 in .gemini/GEMINI.md (routes to deleted mcp__cocoindex_code__search).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Runtime routing parity**: CLAUDE.md, AGENTS.md, and .claude/CLAUDE.md all have the correct HYBRID search-routing policy (Code Graph + Grep). .codex/AGENTS.md is voice/tone only and uses the project-level AGENTS.md. The only drift is the known F001 in .gemini/GEMINI.md (routes to deleted mcp__cocoindex_code__search).

### **Security residue**: No live spawn/probe paths found. The `process-memory-harness.ts` coco/rerank patterns are MATCH-only rules for process classification (DEFAULT_PROCESS_RULES), not spawn commands. The `embedder_pluggability.md` ccc commands are documented as obsolete with a banner. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Security residue**: No live spawn/probe paths found. The `process-memory-harness.ts` coco/rerank patterns are MATCH-only rules for process classification (DEFAULT_PROCESS_RULES), not spawn commands. The `embedder_pluggability.md` ccc commands are documented as obsolete with a banner.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Security residue**: No live spawn/probe paths found. The `process-memory-harness.ts` coco/rerank patterns are MATCH-only rules for process classification (DEFAULT_PROCESS_RULES), not spawn commands. The `embedder_pluggability.md` ccc commands are documented as obsolete with a banner.

### **Skill-advisor routing**: The lexical lane correctly routes "find code" intents to system-code-graph with hints like "code graph", "structural search", "grep not enough", "find code", "where logic" (lexical.ts:29). The semantic-shadow lane uses embedders and does not reference coco-index. The intent-prompt corpus has "Use system-code-graph for structural code search" (intent-prompt-corpus.ts:43-46) which is correct. No routing to the deleted mcp-coco-index skill found. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Skill-advisor routing**: The lexical lane correctly routes "find code" intents to system-code-graph with hints like "code graph", "structural search", "grep not enough", "find code", "where logic" (lexical.ts:29). The semantic-shadow lane uses embedders and does not reference coco-index. The intent-prompt corpus has "Use system-code-graph for structural code search" (intent-prompt-corpus.ts:43-46) which is correct. No routing to the deleted mcp-coco-index skill found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Skill-advisor routing**: The lexical lane correctly routes "find code" intents to system-code-graph with hints like "code graph", "structural search", "grep not enough", "find code", "where logic" (lexical.ts:29). The semantic-shadow lane uses embedders and does not reference coco-index. The intent-prompt corpus has "Use system-code-graph for structural code search" (intent-prompt-corpus.ts:43-46) which is correct. No routing to the deleted mcp-coco-index skill found.

### **Static behavioral review (surfaces 16-20)**: No dangling references or broken paths: -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Static behavioral review (surfaces 16-20)**: No dangling references or broken paths:
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Static behavioral review (surfaces 16-20)**: No dangling references or broken paths:

### `code-graph-boundary.ts` - no references to removed cocoIndex/cocoIndexAvailable fields. The file uses the readiness marker pattern (line 152-183) and MCP RPC to code-graph (line 269-302), with no coco coupling. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `code-graph-boundary.ts` - no references to removed cocoIndex/cocoIndexAvailable fields. The file uses the readiness marker pattern (line 152-183) and MCP RPC to code-graph (line 269-302), with no coco coupling.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `code-graph-boundary.ts` - no references to removed cocoIndex/cocoIndexAvailable fields. The file uses the readiness marker pattern (line 152-183) and MCP RPC to code-graph (line 269-302), with no coco coupling.

### `compact-inject.ts` (claude) - no references to removed cocoIndex/cocoIndexAvailable fields. The file uses the 3-source merge pipeline (line 210) and auto-surface from memory (line 284), with no coco coupling. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `compact-inject.ts` (claude) - no references to removed cocoIndex/cocoIndexAvailable fields. The file uses the 3-source merge pipeline (line 210) and auto-surface from memory (line 284), with no coco coupling.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `compact-inject.ts` (claude) - no references to removed cocoIndex/cocoIndexAvailable fields. The file uses the 3-source merge pipeline (line 210) and auto-surface from memory (line 284), with no coco coupling.

### `embedder_pluggability.md:189` - explicit obsolescence banner: "⚠️ Obsolete as of the 014 CocoIndex deprecation. system-code-graph no longer has a pluggable embedder or a CocoIndex/`ccc` vector layer — it is now a structural tree-sitter indexer." -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `embedder_pluggability.md:189` - explicit obsolescence banner: "⚠️ Obsolete as of the 014 CocoIndex deprecation. system-code-graph no longer has a pluggable embedder or a CocoIndex/`ccc` vector layer — it is now a structural tree-sitter indexer."
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `embedder_pluggability.md:189` - explicit obsolescence banner: "⚠️ Obsolete as of the 014 CocoIndex deprecation. system-code-graph no longer has a pluggable embedder or a CocoIndex/`ccc` vector layer — it is now a structural tree-sitter indexer."

### `memory-search.ts` - no references to removed cocoIndex/cocoIndexAvailable fields, calibration logic, or daemon-probe code. The file uses the 4-stage pipeline architecture (line 16) and has no coco-specific imports or logic. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `memory-search.ts` - no references to removed cocoIndex/cocoIndexAvailable fields, calibration logic, or daemon-probe code. The file uses the 4-stage pipeline architecture (line 16) and has no coco-specific imports or logic.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `memory-search.ts` - no references to removed cocoIndex/cocoIndexAvailable fields, calibration logic, or daemon-probe code. The file uses the 4-stage pipeline architecture (line 16) and has no coco-specific imports or logic.

### `process-memory-harness.ts:89-138` - coco/rerank patterns are MATCH-only rules in `DEFAULT_PROCESS_RULES` for process classification, never spawn commands. Lines 91-101 define cocoindex-daemon/cocoindex-mcp patterns; line 127-131 define rerank-sidecar pattern. All are used only for `pattern.test()` matching in `classifyProcesses()` line 446, not for execution. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `process-memory-harness.ts:89-138` - coco/rerank patterns are MATCH-only rules in `DEFAULT_PROCESS_RULES` for process classification, never spawn commands. Lines 91-101 define cocoindex-daemon/cocoindex-mcp patterns; line 127-131 define rerank-sidecar pattern. All are used only for `pattern.test()` matching in `classifyProcesses()` line 446, not for execution.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `process-memory-harness.ts:89-138` - coco/rerank patterns are MATCH-only rules in `DEFAULT_PROCESS_RULES` for process classification, never spawn commands. Lines 91-101 define cocoindex-daemon/cocoindex-mcp patterns; line 127-131 define rerank-sidecar pattern. All are used only for `pattern.test()` matching in `classifyProcesses()` line 446, not for execution.

### `process-sweep.vitest.ts:141-157` - test fixture preserves ccc-daemon classification as historical test coverage for the process-sweep logic. The test verifies that ccc daemons without owner tokens are preserved (line 153-156), not spawned. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `process-sweep.vitest.ts:141-157` - test fixture preserves ccc-daemon classification as historical test coverage for the process-sweep logic. The test verifies that ccc daemons without owner tokens are preserved (line 153-156), not spawned.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `process-sweep.vitest.ts:141-157` - test fixture preserves ccc-daemon classification as historical test coverage for the process-sweep logic. The test verifies that ccc daemons without owner tokens are preserved (line 153-156), not spawned.

### `session-prime.ts` (claude) - no references to removed cocoIndex/cocoIndexAvailable fields. The file uses getStartupBriefFromMarker (line 26) and handles compact/startup/resume/clear sources, with no coco coupling. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `session-prime.ts` (claude) - no references to removed cocoIndex/cocoIndexAvailable fields. The file uses getStartupBriefFromMarker (line 26) and handles compact/startup/resume/clear sources, with no coco coupling.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `session-prime.ts` (claude) - no references to removed cocoIndex/cocoIndexAvailable fields. The file uses getStartupBriefFromMarker (line 26) and handles compact/startup/resume/clear sources, with no coco coupling.

### `session-prime.ts` (gemini) - no references to removed cocoIndex/cocoIndexAvailable fields. Same pattern as claude version, uses getStartupBriefFromMarker (line 33), with no coco coupling. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `session-prime.ts` (gemini) - no references to removed cocoIndex/cocoIndexAvailable fields. Same pattern as claude version, uses getStartupBriefFromMarker (line 33), with no coco coupling.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `session-prime.ts` (gemini) - no references to removed cocoIndex/cocoIndexAvailable fields. Same pattern as claude version, uses getStartupBriefFromMarker (line 33), with no coco coupling.

### `session-resume.ts` - no references to removed cocoIndex/cocoIndexAvailable fields. The file uses code-graph-boundary for status (line 14-15) and builds resume context, with no coco coupling. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `session-resume.ts` - no references to removed cocoIndex/cocoIndexAvailable fields. The file uses code-graph-boundary for status (line 14-15) and builds resume context, with no coco coupling.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `session-resume.ts` - no references to removed cocoIndex/cocoIndexAvailable fields. The file uses code-graph-boundary for status (line 14-15) and builds resume context, with no coco coupling.

### cli-* SKILL.md files (cli-codex:357, cli-claude-code:350, cli-opencode:296, cli-devin:372, cli-gemini:309) - `pkill -9 -f "ccc search"` lines are documented cleanup safety mechanisms for orphaned dispatcher processes, not live coupling to the deleted ccc CLI. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: cli-* SKILL.md files (cli-codex:357, cli-claude-code:350, cli-opencode:296, cli-devin:372, cli-gemini:309) - `pkill -9 -f "ccc search"` lines are documented cleanup safety mechanisms for orphaned dispatcher processes, not live coupling to the deleted ccc CLI.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: cli-* SKILL.md files (cli-codex:357, cli-claude-code:350, cli-opencode:296, cli-devin:372, cli-gemini:309) - `pkill -9 -f "ccc search"` lines are documented cleanup safety mechanisms for orphaned dispatcher processes, not live coupling to the deleted ccc CLI.

### No `codeGraph-*` rename artifacts found outside review docs (009 incident revert was clean). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No `codeGraph-*` rename artifacts found outside review docs (009 incident revert was clean).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No `codeGraph-*` rename artifacts found outside review docs (009 incident revert was clean).

### No `rerank-rerank-consumer` or `code_graph-complete-fork` falsification found outside review docs (010 incident-#3 revert was clean). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No `rerank-rerank-consumer` or `code_graph-complete-fork` falsification found outside review docs (010 incident-#3 revert was clean).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No `rerank-rerank-consumer` or `code_graph-complete-fork` falsification found outside review docs (010 incident-#3 revert was clean).

### No live "enable the sidecar" or "use CocoIndex" instructions found in live docs (SKILL.md files, README.md, references/). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No live "enable the sidecar" or "use CocoIndex" instructions found in live docs (SKILL.md files, README.md, references/).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No live "enable the sidecar" or "use CocoIndex" instructions found in live docs (SKILL.md files, README.md, references/).

### Only historical reference found: `changelog/v3.2.0.0.md:209` mentions "Must use CocoIndex" style instructions in past tense as part of historical context about routing enforcement changes. This is not a live instruction. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Only historical reference found: `changelog/v3.2.0.0.md:209` mentions "Must use CocoIndex" style instructions in past tense as part of historical context about routing enforcement changes. This is not a live instruction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Only historical reference found: `changelog/v3.2.0.0.md:209` mentions "Must use CocoIndex" style instructions in past tense as part of historical context about routing enforcement changes. This is not a live instruction.

### Test fixtures use "coco" as search-term data only: `F-AC3-happy-path.json:22` expects "phase 7 cocoindex" as absent trigger (test data); `409-fixture.json:3` uses "CocoIndex complete-fork" as historical query data for memory retrieval testing (frozen benchmark data). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Test fixtures use "coco" as search-term data only: `F-AC3-happy-path.json:22` expects "phase 7 cocoindex" as absent trigger (test data); `409-fixture.json:3` uses "CocoIndex complete-fork" as historical query data for memory retrieval testing (frozen benchmark data).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Test fixtures use "coco" as search-term data only: `F-AC3-happy-path.json:22` expects "phase 7 cocoindex" as absent trigger (test data); `409-fixture.json:3` uses "CocoIndex complete-fork" as historical query data for memory retrieval testing (frozen benchmark data).

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Synthesis (all 4 dimensions covered: correctness, security, traceability, maintainability). The review is complete with no new findings in iteration 4. All kept exceptions are justified-inert, behavioral paths are clean, incident reverts left no residue, and doc prose is accurate. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
