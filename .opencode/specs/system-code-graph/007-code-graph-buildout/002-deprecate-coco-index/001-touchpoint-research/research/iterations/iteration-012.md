# Iteration 012 — DeepSeek Adversarial Validation, Pass 2 / Final

## Focus (DeepSeek adversarial validation, pass 2 / final)

This is the FINAL hardening pass. It enumerates precisely every YAML workflow asset hardcoding the coco MCP tool, pins every pass-1 gap to an exact file:line, corrects the phase DAG with gap fixes folded in, and issues a final completeness verdict.

## YAML assets hardcoding the coco MCP tool

A fresh `rg` over `.opencode/commands` and `.opencode/skills` (excluding `.opencode/specs/**`) for `cocoindex_code|cocoindex|COCOINDEX` in YAML/yml files returned **27 unique files, 91 reference lines**. Zero hits under `.opencode/skills`.

**Ripgrep invocation:**
```
rg -n "cocoindex_code|cocoindex|COCOINDEX|coco.index" .opencode/commands -g '*.yaml' -g '*.yml'
```

### Speckit workflow assets (6 files, 18 lines)

| File | Line(s) | Mechanism |
|------|---------|-----------|
| `.opencode/commands/speckit/assets/speckit_plan_auto.yaml` | 534,543,552,561 | `mcp__cocoindex_code__search` in workflow instructions | [SOURCE: speckit_plan_auto.yaml:534,543,552,561] |
| `.opencode/commands/speckit/assets/speckit_plan_confirm.yaml` | 583,592,601,610 | Same pattern | [SOURCE: speckit_plan_confirm.yaml:583,592,601,610] |
| `.opencode/commands/speckit/assets/speckit_complete_auto.yaml` | 683,692,701,710 | Same pattern | [SOURCE: speckit_complete_auto.yaml:683,692,701,710] |
| `.opencode/commands/speckit/assets/speckit_complete_confirm.yaml` | 727,736,745,754 | Same pattern | [SOURCE: speckit_complete_confirm.yaml:727,736,745,754] |
| `.opencode/commands/speckit/assets/speckit_implement_auto.yaml` | 348 | `code_search_note` with `mcp__cocoindex_code__search` | [SOURCE: speckit_implement_auto.yaml:348] |
| `.opencode/commands/speckit/assets/speckit_implement_confirm.yaml` | 330 | Same pattern | [SOURCE: speckit_implement_confirm.yaml:330] |

### Deep-research / deep-review loop executor assets (4 files, 8 lines)

| File | Line(s) | Mechanism |
|------|---------|-----------|
| `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` | 87,88 | `tools:` lists `mcp__cocoindex_code__search`; `mcp_servers:` lists `cocoindex_code` | [SOURCE: deep_start-research-loop_auto.yaml:87-88] |
| `.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml` | 73,74 | Same pattern | [SOURCE: deep_start-research-loop_confirm.yaml:73-74] |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | 76,77 | Same pattern | [SOURCE: deep_start-review-loop_auto.yaml:76-77] |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` | 76,77 | Same pattern | [SOURCE: deep_start-review-loop_confirm.yaml:76-77] |

**CRITICAL:** These 4 loop executor YAML assets have a `mcp_servers` block that explicitly registers `cocoindex_code` as an MCP server. After coco is removed, the loop executors will fail at server registration if these blocks are not cleaned.

### Create workflow assets (12 files, 12 lines) — all use `code_search_note` pattern

| File | Line | Mechanism |
|------|------|-----------|
| `.opencode/commands/create/assets/create_sk_skill_auto.yaml` | 73 | `code_search_note: "Use CocoIndex (mcp__cocoindex_code__search)..."` | [SOURCE: create_sk_skill_auto.yaml:73] |
| `.opencode/commands/create/assets/create_sk_skill_confirm.yaml` | 73 | Same | [SOURCE: create_sk_skill_confirm.yaml:73] |
| `.opencode/commands/create/assets/create_agent_auto.yaml` | 80 | Same | [SOURCE: create_agent_auto.yaml:80] |
| `.opencode/commands/create/assets/create_agent_confirm.yaml` | 81 | Same | [SOURCE: create_agent_confirm.yaml:81] |
| `.opencode/commands/create/assets/create_changelog_auto.yaml` | 81 | Same | [SOURCE: create_changelog_auto.yaml:81] |
| `.opencode/commands/create/assets/create_changelog_confirm.yaml` | 81 | Same | [SOURCE: create_changelog_confirm.yaml:81] |
| `.opencode/commands/create/assets/create_feature_catalog_auto.yaml` | 70 | Same | [SOURCE: create_feature_catalog_auto.yaml:70] |
| `.opencode/commands/create/assets/create_feature_catalog_confirm.yaml` | 70 | Same | [SOURCE: create_feature_catalog_confirm.yaml:70] |
| `.opencode/commands/create/assets/create_testing_playbook_auto.yaml` | 70 | Same | [SOURCE: create_testing_playbook_auto.yaml:70] |
| `.opencode/commands/create/assets/create_testing_playbook_confirm.yaml` | 70 | Same | [SOURCE: create_testing_playbook_confirm.yaml:70] |
| `.opencode/commands/create/assets/create_folder_readme_auto.yaml` | 118 | Same | [SOURCE: create_folder_readme_auto.yaml:118] |
| `.opencode/commands/create/assets/create_folder_readme_confirm.yaml` | 113 | Same | [SOURCE: create_folder_readme_confirm.yaml:113] |

### Doctor YAML assets (5 files, 53 lines)

| File | Line(s) | Mechanism |
|------|---------|-----------|
| `.opencode/commands/doctor/_routes.yaml` | 20 | Stale comment: "stable code_graph/detect_changes/ccc MCP tools..." | [SOURCE: _routes.yaml:20] |
| `.opencode/commands/doctor/_routes.yaml` | 73 | `code-graph` route mcp_tools lists `mcp__cocoindex_code__search` | [SOURCE: _routes.yaml:73] |
| `.opencode/commands/doctor/_routes.yaml` | 106-120 | `cocoindex` route manifest: target+trigger phrases+ccc_* mcp_tools | [SOURCE: _routes.yaml:106-120] |
| `.opencode/commands/doctor/_routes.yaml` | 129 | `skill-advisor` route mcp_tools lists `mcp__cocoindex_code__search` | [SOURCE: _routes.yaml:129] |
| `.opencode/commands/doctor/assets/doctor_cocoindex.yaml` | 96,161 | Entire file (deleted in Phase 002) | [SOURCE: doctor_cocoindex.yaml:1-161] |
| `.opencode/commands/doctor/assets/doctor_mcp_install.yaml` | 46,84,101,159,252 | `cocoindex_code` entries in install-guide mapping, valid-values enum, and python_311 required_for | [SOURCE: doctor_mcp_install.yaml:46,84,101,159,252] |
| `.opencode/commands/doctor/assets/doctor_mcp_debug.yaml` | 46,88,99,156 | Same pattern for debug MCP | [SOURCE: doctor_mcp_debug.yaml:46,88,99,156] |
| `.opencode/commands/doctor/assets/doctor_update.yaml` | 297-299,304-305,393,480 | `cocoindex_venv_check`, subsystem table rows, smoke test step | [SOURCE: doctor_update.yaml:297,299,304,305,393,480] |

**NOTE:** `doctor_mcp_install.yaml`, `doctor_mcp_debug.yaml`, and `doctor_update.yaml` were **missed** by iteration-011's YAML asset enumeration. This pass-2 adds them.

### YAML count reconciliation

Iteration-011 estimated "~40" YAML workflow assets. The actual count is **27 unique files**, 91 total reference lines. The 13-file overcount was because:
- Some files have multiple coco reference lines (e.g., speckit files have 4 refs each, deep files have 2 refs each)
- Iteration-011 treated each reference line as a separate "asset"

### Skills YAML check: zero hits

An additional `rg` over `.opencode/skills` for the same pattern returned zero hits. No YAML assets under skills reference coco.

## Pass-1 gaps pinned

Every gap from iteration-011 is verified against the live filesystem with exact file:line.

### CRITICAL gaps (3)

| Gap | File:Line | Phase | Fix |
|-----|-----------|-------|-----|
| `/doctor cocoindex` route zombie window (Phase 002→006) | `_routes.yaml:106-120` + `doctor_cocoindex.yaml` (entire file) | **002** (was 006) | Move route removal + asset deletion into Phase 002, before CCC tools are deleted. Co-locate route cleanup with tool deletion. |
| ~40 YAML workflow assets hardcode coco — LOOP EXECUTORS BREAK | 27 YAML files (see §YAML assets above); 4 deep-loop executors are P0 breakage | **007** (expanded) | Expand Phase 007 scope to scan+rewrite all 27 YAML assets. The 4 deep executor files (`mcp_servers: [..., cocoindex_code]`) are the highest priority. |
| Iteration-009:100 false claim (no localhost:8765 probes) | `orphan-mcp-sweeper.sh:304` (`*:8765\ *` lsof pattern); `_routes.yaml:106-120` (cocoindex route) | **008** (sweeper), **002** (_routes) | Both found live. Sweeper goes to Phase 008; route goes to Phase 002. |

### MEDIUM gaps (2)

| Gap | File:Line | Phase | Fix |
|-----|-----------|-------|-----|
| Feature catalog CCC files (3) not classified to a phase | `feature_catalog/07--ccc-integration/01-ccc-reindex.md`, `02-ccc-feedback.md`, `03-ccc-status.md` (entire files) | **002** (DELETE) | DELETE in Phase 002 alongside CCC tool removal. Owned by system-code-graph; document tools being removed. |
| `mk-code-index-launcher.cjs` passes dead `COCOINDEX_BIN_PATH` | `mk-code-index-launcher.cjs:20` (`DOTENV_ALLOW_RE`) | **002** | Remove `COCOINDEX_BIN_PATH$` from DOTENV_ALLOW_RE regex. |

### LOW gaps (4)

| Gap | File:Line | Phase | Fix |
|-----|-----------|-------|-----|
| `mk-skill-advisor-launcher.cjs` passes dead `RERANK_SIDECAR_PORT` | `mk-skill-advisor-launcher.cjs:93` (env allow-list array) | **003** or **006** | Remove `'RERANK_SIDECAR_PORT'` from the DEFAULT_ALLOWED_ENV array. Phase 003 (co-located with memory rerank removal). |
| `_routes.yaml:20` stale comment ("ccc MCP tools are stable") | `_routes.yaml:20` | **002** | Edit comment to remove `ccc` reference. |
| `install_scripts/` directory — does not exist | n/a (glob returned 0 results) | n/a | DEAD LEAD — close. No file to classify. |
| HuggingFace cache policy — needs explicit documentation | n/a (runtime state, not a code file) | **008** | Document as shared-optional; leave HuggingFace caches in place. |

### Missed-by-pass-1 additions (found by pass-2)

| File:Line | Mechanism | Phase |
|-----------|-----------|-------|
| `doctor_mcp_install.yaml:46,84,101,159,252` | `cocoindex_code` install-guide entries, valid-values enum, python dependency check | **002** (doctor asset cleanup) |
| `doctor_mcp_debug.yaml:46,88,99,156` | Same pattern for MCP debug | **002** (doctor asset cleanup) |
| `doctor_update.yaml:297,299,304-305,393,480` | `cocoindex_venv_check`, subsystem table row, smoke test | **006** (runtime configs) |
| `.gemini/commands/doctor/update.toml:2` | Gemini-mirrored update command with `ccc_*` tool reference | **006** (runtime configs, 4-runtime mirror) |
| `scripts/README.md:78` | Second rerank-sidecar reference (in addition to line 66 already in iter-011) | **008** (runtime artifacts) |
| `_routes.yaml:73` | `code-graph` route mcp_tools includes `mcp__cocoindex_code__search` | **002** (not just skill-advisor route at line 129) |

## Corrected phase DAG

The original 8-phase DAG from iteration-007 is structurally correct but requires the following material corrections folded in:

### Phase 002 — decouple-code-graph (file count: ~20 → ~35)

**Phase 002 now absorbs:**
- CCC tool removal (ccc_status, ccc_reindex, ccc_feedback tool schemas + handlers + tests — original scope)
- Semantic routing neutralization in query-intent-classifier.ts (original scope)
- SKILL.md, ARCHITECTURE.md, README.md CCC refs (original scope)
- **NEW: `_routes.yaml` cocoindex route removal (lines 106-120) + deletion of `doctor_cocoindex.yaml`** — prevents zombie route window
- **NEW: `_routes.yaml:20` stale comment fix (remove "ccc")**
- **NEW: `_routes.yaml:73` remove `mcp__cocoindex_code__search` from code-graph route mcp_tools**
- **NEW: `doctor_mcp_install.yaml:46,84,101,159,252` cocoindex_code entries**
- **NEW: `doctor_mcp_debug.yaml:46,88,99,156` cocoindex_code entries**
- **NEW: Feature catalog `07--ccc-integration/` DELETE (3 files)**
- **NEW: `mk-code-index-launcher.cjs:20` remove `COCOINDEX_BIN_PATH$` from DOTENV_ALLOW_RE**
- **NEW: `INSTALL_GUIDE.md`, `tool_surface.md`, `ownership_boundary.md` ccc_* tool references**
- **NEW: `manual_testing_playbook/mcp-tool-surface/mcp-tool-manifest-post-rename.md` tool count update**

### Phase 003 — remove-memory-rerank-path (file count: ~5 → ~6)

**Phase 003 now additionally absorbs:**
- **NEW: `mk-skill-advisor-launcher.cjs:93` remove `'RERANK_SIDECAR_PORT'` from DEFAULT_ALLOWED_ENV**
  - Co-located with memory rerank removal; the env var becomes a no-op after sidecar decommission.

### Phase 006 — runtime-configs-4runtime-mirror (file count: ~103 → ~108)

**Phase 006 now additionally absorbs (explicitly):**
- **NEW: `doctor_update.yaml` coco refs (lines 297-299, 304-305, 393, 480)** — was missed by all prior passes
- **NEW: `.gemini/commands/doctor/update.toml:2` ccc_* ref** — Gemini mirror
- Already had: `_routes.yaml:129` skill-advisor coco ref, `update.md:28,221,337,360`, `manage.md:4,908-935`

### Phase 007 — docs-readme-search-routing (file count: ~47 → ~74)

**Phase 007 now explicitly covers YAML workflow asset rewrites (not just markdown docs):**
- All 22 create/speckit/deep workflow YAML assets (see §YAML assets above) — replace `mcp__cocoindex_code__search` with HYBRID policy directions
- The 4 deep-loop executor YAML assets require P0 attention: remove `cocoindex_code` from `mcp_servers:` blocks
- **NEW: `search.md:116` coco vector/semantic channel reference**
- **NEW: system-spec-kit `feature_catalog/47-orphan-mcp-sweeper-and-launchagent-template.md:21` ORPHAN_PRESERVE_RERANK_SIDECAR ref**

### Phase 008 — runtime-artifacts-cleanup (file count: ~8 → ~10)

**Phase 008 now additionally covers:**
- **NEW: `orphan-mcp-sweeper.sh:195-196`** rerank_sidecar:app process matching + ORPHAN_PRESERVE_RERANK_SIDECAR guard
- **NEW: `orphan-mcp-sweeper.sh:304`** port 8765 lsof probe
- **NEW: `scripts/README.md:66,78`** ORPHAN_PRESERVE_RERANK_SIDECAR documentation

### Corrected phase sequence (no reordering needed)

```
002-decouple-code-graph          (~35 files, was ~20)
    → 003-remove-memory-rerank-path        (~6 files, was ~5)
    → 004-remove-rerank-sidecar-skill      (~30 files, unchanged)
    → 005-remove-coco-index-skill          (~40 files, unchanged)
    → 006-runtime-configs-4runtime-mirror  (~108 files, was ~103)
    → 007-docs-readme-search-routing       (~74 files, was ~47)
    → 008-runtime-artifacts-cleanup        (~10 items, was ~8)
```

**Ordering rationale preserved.** The hard constraint "DECOUPLE BEFORE DELETE" is intact. The key change is that Phase 002 now absorbs the route manifest cocoindex cleanup, eliminating the zombie MCP tool window.

## Final verdict

**COMPLETE+CORRECT — READY TO SCAFFOLD DEPRECATION PHASES.**

### Evidence

1. **All 27 YAML workflow assets enumerated with exact file:line** (corrected from the "~40" estimate). The 4 deep-loop executor YAML files with `mcp_servers: [..., cocoindex_code]` are the highest-priority rewrite targets — they will break at runtime if not updated.

2. **All 3 CRITICAL pass-1 gaps resolved with specific fixes:**
   - Route zombie window closed by moving `_routes.yaml` cocoindex route removal into Phase 002
   - YAML asset rewrites scoped into expanded Phase 007
   - Iteration-009 false claim corrected: both `orphan-mcp-sweeper.sh:304` and `_routes.yaml:106-120` are live probes of coco/port-8765

3. **All 2 MEDIUM gaps verified and classified:**
   - Feature catalog CCC files (3) → Phase 002 DELETE
   - `mk-code-index-launcher.cjs:20` COCOINDEX_BIN_PATH → Phase 002 removal

4. **All 4 LOW gaps verified and classified.** No unclassified touchpoints remain. `install_scripts/` confirmed as dead lead (directory does not exist).

5. **6 pass-1 missed additions found and classified** (doctor_mcp_install.yaml, doctor_mcp_debug.yaml, doctor_update.yaml, Gemini update.toml, scripts/README.md:78, _routes.yaml:73). All assigned to correct phases.

6. **Zero YAML hits under `.opencode/skills`** — skills have no coco YAML dependencies beyond what's already mapped in markdown/docs.

### Residual risks (non-blocking)

| Risk | Mitigation |
|------|-----------|
| **27 YAML asset rewrites are a significant editorial surface** — risk of typos or incorrect HYBRID policy wording | Use a YAML schema validator after each asset edit; batch by workflow family (speckit first, then create, then deep) |
| **Deep loop executors use `mcp_servers` blocks** — removing `cocoindex_code` from the server list could expose YAML schema expectations (is the mcp_servers array allowed to shrink?) | Test loop executor startup with modified YAML before committing Phase 007 |
| **`doctor_update.yaml` Phase 8 migration includes `cocoindex_venv_check`** — this runs BEFORE coco deletion (the YAML is consumed in Phase 006 while coco still exists). | Verify Phase 8 migration sub-action handles a missing venv gracefully (it may already; `ccc search` smoke test at line 480 is the only runtime probe) |
| **Phase 002 file count expanded from ~20 to ~35** — increased blast radius for the first phase | Git commit before phase; all edits are in the same vertical (code-graph + doctor assets); rollback is a single `git revert` |

### Scaffold recommendation

The corrected phase DAG is ready to scaffold phase children under:
```
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/
```

Recommended scaffold order:
1. Create `002-decouple-code-graph/` phase child with the expanded ~35-file edit-set
2. Create `003-remove-memory-rerank-path/` → `004-remove-rerank-sidecar-skill/` → `005-remove-coco-index-skill/` as leaf phases
3. Create `006-runtime-configs-4runtime-mirror/` with the expanded ~108-file scope
4. Create `007-docs-readme-search-routing/` with the YAML asset rewrite substep (P0: deep-loop executors)
5. Create `008-runtime-artifacts-cleanup/` with sweeper/8765/sidecar cleanup steps
