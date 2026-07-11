# Iteration 011 - DeepSeek Adversarial Validation, Pass 1

## Focus (DeepSeek adversarial validation, pass 1)

This pass challenges the accumulated touchpoint map from iterations 001-010. It runs fresh independent greps over the LIVE surface, stress-tests classifications, probes DAG ordering for hidden cycles, and validates the 2 key architectural decisions.

## New touchpoints missed by prior iterations

| Touchpoint | Mechanism | Class | Phase | Evidence |
|---|---|---|---|---|
| `.opencode/commands/doctor/_routes.yaml:106-120` | `/doctor cocoindex` route manifest entry with `ccc_status/reindex/feedback` MCP tools + trigger phrases | EDIT-remove-ref | 002 (co-locate with CCC tool removal) or 006 | [SOURCE: _routes.yaml:106-120] |
| `.opencode/commands/doctor/_routes.yaml:129` | `/doctor skill-advisor` route lists `mcp__cocoindex_code__search` as an MCP tool | EDIT-remove-ref | 006 (clean after coco MCP removed) | [SOURCE: _routes.yaml:129] |
| `.opencode/bin/mk-skill-advisor-launcher.cjs:93` | `RERANK_SIDECAR_PORT` env pass-through to skill-advisor process | EDIT-remove-ref | 003 or 006 | [SOURCE: mk-skill-advisor-launcher.cjs:93] |
| `.opencode/bin/mk-code-index-launcher.cjs:20` | `COCOINDEX_BIN_PATH$` in DOTENV_ALLOW_RE filter, passes bin path into code-graph process env | EDIT-remove-ref | 002 | [SOURCE: mk-code-index-launcher.cjs:20] |
| `.opencode/scripts/orphan-mcp-sweeper.sh:195-196` | `rerank_sidecar:app` process matching with `ORPHAN_PRESERVE_RERANK_SIDECAR` guard | EDIT-remove-ref | 008 | [SOURCE: orphan-mcp-sweeper.sh:195-196] |
| `.opencode/scripts/orphan-mcp-sweeper.sh:304` | Port `8765` match in lsof output pattern `*:8765 *` | EDIT-remove-ref | 008 | [SOURCE: orphan-mcp-sweeper.sh:304] |
| `.opencode/scripts/README.md:66` | `ORPHAN_PRESERVE_RERANK_SIDECAR` env var documentation | EDIT-remove-ref | 007 or 008 | [SOURCE: scripts/README.md:66] |
| `.opencode/skills/system-code-graph/feature_catalog/07--ccc-integration/01-ccc-reindex.md` | Feature catalog describing `ccc_reindex` tool | DELETE | 002 | [SOURCE: 01-ccc-reindex.md:1-64] |
| `.opencode/skills/system-code-graph/feature_catalog/07--ccc-integration/02-ccc-feedback.md` | Feature catalog describing `ccc_feedback` tool | DELETE | 002 | [SOURCE: glob 07--ccc-integration] |
| `.opencode/skills/system-code-graph/feature_catalog/07--ccc-integration/03-ccc-status.md` | Feature catalog describing `ccc_status` tool | DELETE | 002 | [SOURCE: glob 07--ccc-integration] |
| `.opencode/commands/speckit/assets/speckit_plan_auto.yaml:534,543,552,561` | "Use CocoIndex semantic search (mcp__cocoindex_code__search)" in YAML workflow instructions | EDIT-remove-ref | 007 | [SOURCE: speckit_plan_auto.yaml:534,543,552,561] |
| `.opencode/commands/speckit/assets/speckit_plan_confirm.yaml:583,592,601,610` | Same pattern in plan confirm workflow | EDIT-remove-ref | 007 | [SOURCE: speckit_plan_confirm.yaml:583,592,601,610] |
| `.opencode/commands/speckit/assets/speckit_complete_auto.yaml:683,692,701,710` | "Use CocoIndex semantic search" in complete auto workflow | EDIT-remove-ref | 007 | [SOURCE: speckit_complete_auto.yaml:683,692,701,710] |
| `.opencode/commands/speckit/assets/speckit_complete_confirm.yaml:727,736,745,754` | Same pattern in complete confirm workflow | EDIT-remove-ref | 007 | [SOURCE: speckit_complete_confirm.yaml:727,736,745,754] |
| `.opencode/commands/speckit/assets/speckit_implement_auto.yaml:348` | "Use CocoIndex (mcp__cocoindex_code__search)" in implement auto workflow | EDIT-remove-ref | 007 | [SOURCE: speckit_implement_auto.yaml:348] |
| `.opencode/commands/speckit/assets/speckit_implement_confirm.yaml:330` | Same pattern in implement confirm workflow | EDIT-remove-ref | 007 | [SOURCE: speckit_implement_confirm.yaml:330] |
| `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:87-88` | `mcp__cocoindex_code__search` tool + `cocoindex_code` MCP server for deep-research loop executor | EDIT-remove-ref | 007 | [SOURCE: deep_start-research-loop_auto.yaml:87-88] |
| `.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml:73-74` | Same pattern in confirm variant | EDIT-remove-ref | 007 | [SOURCE: deep_start-research-loop_confirm.yaml:73-74] |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:76-77` | `mcp__cocoindex_code__search` tool + `cocoindex_code` MCP server for deep-review loop executor | EDIT-remove-ref | 007 | [SOURCE: deep_start-review-loop_auto.yaml:76-77] |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml:76-77` | Same pattern in confirm variant | EDIT-remove-ref | 007 | [SOURCE: deep_start-review-loop_confirm.yaml:76-77] |
| `.opencode/commands/create/assets/create_sk_skill_auto.yaml:73` | "Use CocoIndex (mcp__cocoindex_code__search)" in sk-skill creation workflow | EDIT-remove-ref | 007 | [SOURCE: create_sk_skill_auto.yaml:73] |
| `.opencode/commands/create/assets/create_sk_skill_confirm.yaml:73` | Same in confirm variant | EDIT-remove-ref | 007 | [SOURCE: create_sk_skill_confirm.yaml:73] |
| `.opencode/commands/create/assets/create_agent_auto.yaml:80` | "Use CocoIndex" in agent creation workflow | EDIT-remove-ref | 007 | [SOURCE: create_agent_auto.yaml:80] |
| `.opencode/commands/create/assets/create_agent_confirm.yaml:81` | Same in confirm variant | EDIT-remove-ref | 007 | [SOURCE: create_agent_confirm.yaml:81] |
| `.opencode/commands/create/assets/create_changelog_auto.yaml:81` | "Use CocoIndex" in changelog creation workflow | EDIT-remove-ref | 007 | [SOURCE: create_changelog_auto.yaml:81] |
| `.opencode/commands/create/assets/create_changelog_confirm.yaml:81` | Same in confirm variant | EDIT-remove-ref | 007 | [SOURCE: create_changelog_confirm.yaml:81] |
| `.opencode/commands/create/assets/create_feature_catalog_auto.yaml:70` | "Use CocoIndex" in feature-catalog creation workflow | EDIT-remove-ref | 007 | [SOURCE: create_feature_catalog_auto.yaml:70] |
| `.opencode/commands/create/assets/create_feature_catalog_confirm.yaml:70` | Same in confirm variant | EDIT-remove-ref | 007 | [SOURCE: create_feature_catalog_confirm.yaml:70] |
| `.opencode/commands/create/assets/create_testing_playbook_auto.yaml:70` | "Use CocoIndex" in testing-playbook creation workflow | EDIT-remove-ref | 007 | [SOURCE: create_testing_playbook_auto.yaml:70] |
| `.opencode/commands/create/assets/create_testing_playbook_confirm.yaml:70` | Same in confirm variant | EDIT-remove-ref | 007 | [SOURCE: create_testing_playbook_confirm.yaml:70] |
| `.opencode/commands/create/assets/create_folder_readme_auto.yaml:118` | "Use CocoIndex" in folder-readme creation workflow | EDIT-remove-ref | 007 | [SOURCE: create_folder_readme_auto.yaml:118] |
| `.opencode/commands/create/assets/create_folder_readme_confirm.yaml:113` | Same in confirm variant | EDIT-remove-ref | 007 | [SOURCE: create_folder_readme_confirm.yaml:113] |
| `.opencode/commands/doctor/update.md:28` | Claims `ccc_*` as one of the existing tool surfaces; after CCC removal this is false | EDIT-remove-ref | 006 | [SOURCE: update.md:28] |
| `.opencode/commands/doctor/update.md:221` | `cocoindex` subsystem row in doctor update table (semantic store) | EDIT-remove-ref | 006 | [SOURCE: update.md:221] |
| `.opencode/commands/doctor/update.md:337` | `cocoindex` subsystem health row (UNHEALTHY, STALE, fix-daemon) | EDIT-remove-ref | 006 | [SOURCE: update.md:337] |
| `.opencode/commands/doctor/update.md:360` | `/doctor cocoindex` example command | EDIT-remove-ref | 006 | [SOURCE: update.md:360] |
| `.opencode/commands/memory/manage.md:4` | `mcp__mk_code_index__ccc_status/reindex/feedback` in allowed-tools frontmatter | EDIT-remove-ref | 006 | [SOURCE: manage.md:4] |
| `.opencode/commands/memory/manage.md:908-935` | CCC operations section documenting `ccc_status`, `ccc_reindex`, `ccc_feedback` | EDIT-remove-ref | 006 | [SOURCE: manage.md:908-935] |
| `.opencode/commands/memory/search.md:116` | "CocoIndex semantic search (mcp__cocoindex_code__search) integrates as the vector/semantic channel" | EDIT-remove-ref | 007 | [SOURCE: search.md:116] |
| `.opencode/skills/system-code-graph/references/runtime/ownership_boundary.md:66` | "11 tools through mk_code_index server: ... ccc_status, ccc_reindex and ccc_feedback" | EDIT-decouple | 002 | [SOURCE: ownership_boundary.md:66] |
| `.opencode/skills/system-code-graph/references/runtime/tool_surface.md:41,55,78` | Tool surface docs listing ccc_* tools in maintenance category | EDIT-decouple | 002 | [SOURCE: tool_surface.md:41,55,78] |
| `.opencode/skills/system-code-graph/manual_testing_playbook/mcp-tool-surface/mcp-tool-manifest-post-rename.md:24,41` | Test manifest expects exactly 11 tools including ccc_* | EDIT-decouple | 002 | [SOURCE: mcp-tool-manifest-post-rename.md:24,41] |
| `.opencode/skills/system-code-graph/INSTALL_GUIDE.md:17,111,133` | Install guide lists ccc_* in tool enumeration | EDIT-decouple | 002 | [SOURCE: INSTALL_GUIDE.md:17,111,133] |
| `.opencode/skills/system-code-graph/SKILL.md:285` | SKILL.md lists `ccc_status/reindex/feedback` in tool table | EDIT-decouple | 002 | [SOURCE: system-code-graph/SKILL.md:285] |
| `.gemini/commands/doctor/update.toml:2` | Gemini-mirrored update command references `ccc_*` tools | EDIT-remove-ref | 006 | [SOURCE: gemini/commands/doctor/update.toml:2] |
| `.opencode/skills/system-spec-kit/feature_catalog/tooling-and-scripts/47-orphan-mcp-sweeper-and-launchagent-template.md:21` | Feature catalog doc refs `ORPHAN_PRESERVE_RERANK_SIDECAR` | EDIT-remove-ref | 007 | [SOURCE: 47-orphan-mcp-sweeper-and-launchagent-template.md:21] |
| `.opencode/skills/system-code-graph/references/integrations/ccc_bridge_integration.md:1-158` | CCC bridge integration doc (already listed in iter-001 as DELETE) | DELETE | 002 | Already in iter-001 — confirmed |

## Mis-classifications / corrections

| Issue | Detail | Evidence |
|---|---|---|
| **Iteration-009 claims no localhost:8765 probes — FALSE** | Iteration-009:100 states "No runtime health checks or doctor probes that directly probe localhost:8765 or the coco daemon were found in the live codebase." This is contradicted by: (a) `orphan-mcp-sweeper.sh:304` matches port `8765` in lsof output, (b) `_routes.yaml:106-120` defines a live `/doctor cocoindex` route with trigger phrases like "cocoindex daemon hung" and "cocoindex reindex". Both are in the live codebase and both probe coco daemon state. | [SOURCE: orphan-mcp-sweeper.sh:304] [SOURCE: _routes.yaml:106-120] [CONTRADICTS: iteration-009.md:100] |
| **Feature catalog CCC files need explicit Phase assignment** | Iteration-010 open uncertainty #1 asks for classification. These 3 files live in `system-code-graph/feature_catalog/` and describe CCC tools being removed. Classification: **DELETE** in **Phase 002** (not Phase 005), because they are owned by system-code-graph and document tools that cease to exist during code-graph decoupling. | [SOURCE: feature_catalog/07--ccc-integration/01-ccc-reindex.md:1] |
| **`_routes.yaml:20` stale commentary** | Line 20 of `_routes.yaml` reads: "stable code_graph/detect_changes/ccc MCP tools are registered through mk-code-index". After Phase 002 removes CCC tools, this comment is false. Should be edited to remove `ccc`. | [SOURCE: _routes.yaml:20] |
| **`install_scripts/` claim likely a dead lead** | Iteration-005:90 and iteration-008:70 claim `install_scripts/README.md` references `install-cocoindex-code.sh`. Fresh investigation: the `install_scripts/` directory does NOT exist in the repo root. The claim originated from `install_guides/` path references in doctor YAML assets, not `install_scripts/`. This uncertainty is moot — no file to classify. | [SOURCE: glob install_scripts/**/* returned 0 results] |

## DAG ordering challenges

### CRITICAL: `/doctor cocoindex` route breaks between Phase 002 and Phase 006

The `_routes.yaml:106-120` route dispatches `/doctor cocoindex` → `doctor_cocoindex.yaml` using `mcp__mk_code_index__ccc_status/reindex/feedback` MCP tools. These CCC tools are removed in **Phase 002**. The route manifest entry is cleaned in **Phase 006**. Between those phases, the `/doctor cocoindex` route is a **zombie**: the YAML asset exists but the MCP tools it calls are gone. Calling `/doctor cocoindex` between Phase 002 and Phase 006 would produce MCP tool-not-found errors.

**Proposed fix A (preferred):** Move the `_routes.yaml` cocoindex route removal INTO Phase 002, co-located with CCC tool deletion. The route entry and `doctor_cocoindex.yaml` deletion become part of Phase 002's verify gate.

**Proposed fix B:** Accept the zombie window but document it as a known intermediate state. Only viable if the Phase 002→006 transition window is measured in minutes and no operator would trigger `/doctor cocoindex` in that window. Not recommended.

### MEDIUM: `_routes.yaml:129` skill-advisor route zombie `mcp__cocoindex_code__search`

The `/doctor skill-advisor` route lists `mcp__cocoindex_code__search` as a tool. After the coco MCP server is unregistered (Phase 005/006), this tool reference is dead. The route still works (it uses other tools) but the coco reference is stale.

**Proposed fix:** Remove `mcp__cocoindex_code__search` from `_routes.yaml:129` in Phase 006 alongside other config cleanup.

### MEDIUM: YAML workflow assets hardcode `mcp__cocoindex_code__search` — loop executor breakage

~40 YAML workflow assets across `.opencode/commands/` hardcode `mcp__cocoindex_code__search` in tool lists and workflow instructions. The deep-research and deep-review loop executors explicitly list `cocoindex_code` as an MCP server. If Phase 007 only updates markdown docs but leaves YAML assets unmodified:
- The deep-research loop executor tries to invoke `mcp__cocoindex_code__search` → **FAILS with tool-not-found**
- The deep-review loop executor has the same failure
- Speckit plan/complete/implement workflows instruct agents to "Use CocoIndex semantic search" for concept discovery → agents attempt to call a non-existent tool

**Proposed fix:** Expand Phase 007 (docs-readme-search-routing) to explicitly cover YAML workflow asset updates, not just markdown. Add a YAML asset scan + rewrite substep to Phase 007.

### LOW: `mk-code-index-launcher.cjs` passes dead COCOINDEX_BIN_PATH

After Phase 002 removes CCC tools, the launcher still passes `COCOINDEX_BIN_PATH` into the code-graph process environment. No consumer reads it, so no operational failure, but it's dead config.

**Proposed fix:** Remove `COCOINDEX_BIN_PATH$` from `DOTENV_ALLOW_RE` in Phase 002.

### DAG ordering verdict

**The core "decouple-before-delete" ordering is sound**, but the DAG is incomplete: it does not account for the route manifest (`_routes.yaml`) which bridges config (Phase 006) and tool availability (Phase 002). The fix in Phase 002 (removing CCC route entry before deleting CCC tools) closes this gap without restructuring the DAG.

## Key-decision validation

### (a) Memory default-path impact: CONFIRMED SAFE

The cross-encoder reranker is **strictly opt-in** with a double-gate:
1. `search-flags.ts:56-57`: `isCrossEncoderEnabled()` returns true only when `SPECKIT_CROSS_ENCODER=true` is explicitly set [SOURCE: search-flags.ts:56-57]
2. `cross-encoder.ts:209`: Provider resolution returns `'local'` only when `RERANKER_LOCAL=true` [SOURCE: cross-encoder.ts:209]

The default memory search path (no env vars set) uses RRF fusion with vector similarity + BM25, then pass-through scoring. Stage 3 cross-encoder reranking never fires on the default path. The `rerank: true` parameter on `memory_search` activates RRF pipeline reranking (not cross-encoder reranking) unless the opt-in flags are set.

**Impact:** Zero degradation for operators who never set `SPECKIT_CROSS_ENCODER=true`. Operators who DID opt in will receive positional fallback scores (0-0.5 range) with `scoringMethod:'fallback'` marker, as documented in iteration-002.

**Verdict:** Decision 1 is sound. The positional fallback is a safe degradation path.

### (b) HYBRID semantic-search replacement policy: PARTIALLY SOUND — YAML asset gap

The HYBRID policy (Grep + code-graph structural to replace semantic search) is conceptually correct for agent decision-tree updates. However, it has a critical execution gap:

**The 12 open uncertainty from iteration-010 asks if the deep-research/deep-review commands' code-bootstrap is broken. The answer is: YES, if YAML workflow assets are not updated.**

The deep-research/deep-review loop executors are driven by YAML workflow assets that explicitly list `cocoindex_code` as an MCP server and `mcp__cocoindex_code__search` as a tool (`deep_start-research-loop_auto.yaml:87-88`, `deep_start-review-loop_auto.yaml:76-77`). After coco is removed, these assets instruct the loop executor to use a non-existent MCP server. The loop executor will fail at startup or on first semantic-search instruction.

Additionally, ~30 YAML workflow assets across `.opencode/commands/` embed "Use CocoIndex semantic search" prompts. These are runtime instructions consumed by agents during workflow execution — not static documentation.

**Required fix:** Expand Phase 007 scope to include:
1. YAML workflow asset scan for `mcp__cocoindex_code__search` and `cocoindex_code` references
2. Replace coco search directives with HYBRID policy equivalents: "Use Grep for exact token matching; use code_graph_query for structural lookups; for concept discovery use Grep pattern construction + code_graph_context verification"
3. Remove `cocoindex_code` from MCP server lists in loop executor assets

**Verdict:** The HYBRID policy is sound in intent but its Phase 007 execution scope is under-specced. Without YAML asset coverage, critical workflows (deep-research, deep-review, speckit plan/complete/implement) break at runtime.

## Verdict

**INCOMPLETE — 3 CRITICAL, 2 MEDIUM, 4 LOW gaps found.**

### Prioritized gap list:

| Priority | Gap | Affected Phases | Fix |
|---|---|---|---|
| **CRITICAL** | `/doctor cocoindex` route breaks Phase 002→006 window; MCP tool-not-found error | 002, 006 | Move `_routes.yaml` coco route removal into Phase 002 |
| **CRITICAL** | YAML workflow assets (~40 files) hardcode `mcp__cocoindex_code__search`; loop executors fail at runtime | 007 | Expand Phase 007 to scan+rewrite YAML assets |
| **CRITICAL** | Iteration-009:100 false claim about no localhost:8765 probes; `orphan-mcp-sweeper.sh` and `_routes.yaml` both missed | 008, 006 | Add sweeper script and route manifest to Phase 008/006 |
| **MEDIUM** | Feature catalog CCC files (3) not classified to a phase; must be Phase 002 DELETE | 002 | Classify and add to Phase 002 file list |
| **MEDIUM** | `mk-code-index-launcher.cjs` passes dead `COCOINDEX_BIN_PATH` env; launcher survivor config | 002 | Remove COCOINDEX_BIN_PATH from DOTENV_ALLOW_RE |
| **LOW** | `mk-skill-advisor-launcher.cjs` passes dead `RERANK_SIDECAR_PORT` env | 003 or 006 | Clean the env pass-through |
| **LOW** | `_routes.yaml:20` stale comment claiming ccc tools are "stable" | 002 or 006 | Edit comment |
| **LOW** | `install_scripts/` uncertainty — directory does not exist; moot | n/a | Close as dead lead |
| **LOW** | HuggingFace cache policy still needs explicit documentation | 008 | Document as shared-optional, leave in place |
