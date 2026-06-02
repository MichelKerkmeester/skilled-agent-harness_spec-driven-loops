---
title: "Feature Specification: README cluster update for the 013 roadmap + sk-git worktree convention [system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update/spec]"
description: "Refresh the system-spec-kit README cluster (skill README, mcp_server README, ENV_REFERENCE) so operator-facing docs match the shipped runtime: SPECKIT_BACKEND_ONLY gate, schema v28->v30 narrative + .needs-rebuild sentinel, MCP front-proxy in-place daemon/RSS recycle, the E429/-32001/-32002 error-code surface, the sk-git wt/{NNNN}-{name} worktree convention, and a bumped version footer. Documentation-only; tool count stays 36 for the mk-spec-memory server."
trigger_phrases:
  - "readme cluster update"
  - "system-spec-kit readme schema v30 front-proxy"
  - "SPECKIT_BACKEND_ONLY env reference"
  - "memory front-proxy recycle error codes doc"
  - "003 readme cluster update packet"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Refreshed README cluster: env gate, schema v28-30, front-proxy, error codes, sk-git, footer"
    next_safe_action: "None binding; sibling 004 stress-test durability domain"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/README.md"
      - ".opencode/skills/system-spec-kit/mcp_server/README.md"
      - ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Feature Specification: README Cluster Update

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Shipped — README cluster (skill README, mcp_server README, ENV_REFERENCE) refreshed to the deployed runtime: SPECKIT_BACKEND_ONLY, schema v28->v30 + `.needs-rebuild` sentinel, MCP front-proxy recycle, E429/-32001/-32002 error codes, sk-git `wt/{NNNN}-{name}` convention, version footer bump (2026-06-02). |
| **Created** | 2026-06-02 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (014-docs-and-stress-test-refresh) |
| **Source Roadmap** | 013 memory-index-scan roadmap (phases 001-005) + the sk-git worktree convention |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The system-spec-kit README cluster lags the shipped runtime. Concretely, against the deployed source:

1. **`SPECKIT_BACKEND_ONLY` is undocumented.** The backend-only stdio gate is read at `mcp_server/context-server.ts:2126` (`process.env.SPECKIT_BACKEND_ONLY === '1'`) but appears in neither the skill README env section nor `mcp_server/ENV_REFERENCE.md`.
2. **Schema-version narrative is stale.** `lib/search/vector-index-schema.ts` is at `SCHEMA_VERSION = 30` (mig 28 active-row partial unique index `idx_memory_logical_key_active_unique`; mig 29 checkpoint-v2 cols `snapshot_format`/`snapshot_path`; mig 30 `post_insert_enrichment_*` cols + `idx_post_insert_enrichment_incomplete`). The READMEs never describe the v28->v30 progression or the `.needs-rebuild` sentinel.
3. **MCP front-proxy is undocumented.** `.opencode/bin/lib/launcher-session-proxy.cjs` adds in-place daemon recycle / RSS-recycle transparency with a typed error contract (`-32001` retryable recycle, `-32002` protocol fail-closed), bridged by `bridgeStdioThroughSessionProxy` in `mk-spec-memory-launcher.cjs`. Operators have no doc surface for the recycle behavior or the error codes.
4. **sk-git worktree convention is uncited.** The READMEs cross-link sk-git but never name the `wt/{NNNN}-{name}` branch + `.worktrees/{NNNN}-{name}` directory convention.

### Purpose
Make the README cluster an accurate operator-facing surface for the shipped 013 roadmap and the sk-git convention. The skill README gains an env row, a schema-narrative subsection, a front-proxy subsection, and an error-code note; `mcp_server/README.md` gains deep-reference parity (checkpoint-v2, enrichment marker, front-proxy, schema v30); `ENV_REFERENCE.md` gains the missing `SPECKIT_BACKEND_ONLY` row. This is **documentation-only**: no behavior changes, and the `36-tool` mk-spec-memory count is verified and preserved (the fix is adding new BEHAVIORS to prose, not bumping the count).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.opencode/skills/system-spec-kit/README.md`: add `SPECKIT_BACKEND_ONLY` env row; add a schema v28->v30 + `.needs-rebuild` sentinel subsection under §3.2 Memory System; add an MCP front-proxy / in-place daemon recycle / RSS-recycle transparency subsection; add an error-code note (E429, -32001 retryable recycle LIVE, -32002 protocol fail-closed); cross-reference the sk-git `wt/{NNNN}-{name}` convention; bump the footer (version + last-updated + "Current docs cover" line).
- `.opencode/skills/system-spec-kit/mcp_server/README.md`: deep-reference parity for checkpoint-v2 (`createCheckpoint`/`restoreCheckpoint`/`restoreCheckpointV2`, `VACUUM ... INTO`, `.needs-rebuild` sentinel), the enrichment marker columns, the front-proxy recycle contract, and schema v30; keep the 36-tool API reference accurate.
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`: add the `SPECKIT_BACKEND_ONLY` infrastructure row.

### Out of Scope
- Any runtime/source/behavior change (docs-only packet).
- The feature catalog and manual testing playbook refresh (sibling children 001/002).
- The stress-test durability domain (sibling child 004).
- Changing the `36`-tool count (verified correct for the mk-spec-memory server; `layer-definitions.ts` lists 43 across cross-server layers, which is a different surface).

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/README.md` | Modify | Env row, schema-narrative subsection, front-proxy subsection, error-code note, sk-git cross-ref, footer bump |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Modify | Deep-reference parity: checkpoint-v2, enrichment marker, front-proxy, schema v30 |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Add `SPECKIT_BACKEND_ONLY` infrastructure row |
| `003-readme-cluster-update/{spec,plan,tasks,checklist,decision-record,implementation-summary}.md`, `description.json`, `graph-metadata.json` | Create | Packet docs + metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
- R1: Every behavioral claim added to the cluster traces to a cited deployed source anchor (schema file, context-server line, checkpoints symbols, front-proxy error codes, health block, sk-git convention). No paraphrase that drifts from the source.
- R2: `SPECKIT_BACKEND_ONLY` is documented in both the skill README env surface and `ENV_REFERENCE.md`.
- R3: The error-code note states `-32001` precisely: it is STILL LIVE as the launcher retryable recycle error (`RETRYABLE_RECYCLE_ERROR`, `launcher-session-proxy.cjs:18-22`); only the index vector-drain outage path stopped surfacing its own `-32001` class. It is NOT "removed".

### P1 - Required (complete OR user-approved deferral)
- R4: The `36`-tool mk-spec-memory count is verified before any edit and left unchanged; new behaviors are added to prose regardless.
- R5: Schema v28->v30 narrative names mig 28 (active-row unique index), mig 29 (checkpoint-v2 cols), and mig 30 (enrichment marker cols) plus the `.needs-rebuild` sentinel.
- R6: `validate.sh --strict` on this packet ends Errors: 0.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC1:** `SPECKIT_BACKEND_ONLY` appears in `README.md` (env section) and as a row in `ENV_REFERENCE.md` §2 Infrastructure, both tracing to `context-server.ts:2126`.
- **SC2:** `README.md` §3.2 carries a schema v28->v30 + `.needs-rebuild` sentinel subsection naming all three migrations.
- **SC3:** `README.md` carries an MCP front-proxy / in-place daemon recycle / RSS-recycle subsection and an error-code note covering E429, `-32001` (retryable recycle, LIVE), and `-32002` (protocol fail-closed).
- **SC4:** `mcp_server/README.md` has deep-reference parity for checkpoint-v2, the enrichment marker, the front-proxy, and schema v30; the `36`-tool API reference is unchanged and accurate.
- **SC5:** The `README.md` footer version / "Last updated" (2026-06-02) / "Current docs cover" line are bumped; `validate.sh --strict` exits with Errors: 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Severity | Mitigation |
|------|----------|------------|
| Wrong claim about `-32001` (writing "removed") | High | Pin the precise statement: `-32001` is LIVE as the launcher retryable recycle error; only the index outage path stopped surfacing its own class. Cite `launcher-session-proxy.cjs:18-22`. |
| Bumping the tool count from 36 to 43 on a mismatch | High | `TOOL_DEFINITIONS` in `tool-schemas.ts` has exactly 36 entries (verified); `layer-definitions.ts` 43 is a cross-server layer surface. Leave 36; add behaviors only. |
| Doc drift from loose paraphrase | Medium | Read each source anchor before writing; keep file:line citations in prose where load-bearing. |
| Editing sibling/parent files | Medium | Scope locked to the three artifact files + this child folder; no parent metadata or sibling files touched. |
| Comment-hygiene HARD BLOCK | Process | Prose docs may reference spec folders; these are docs, not code comments. No spec-path/packet labels are added to any source CODE comment. |

### Dependencies
- Verified deployed source anchors: `vector-index-schema.ts` (`SCHEMA_VERSION = 30`, migs 28-30), `context-server.ts:1014` (`version: '1.7.2'`) and `:2126` (`SPECKIT_BACKEND_ONLY`), `lib/storage/checkpoints.ts` (checkpoint v1/v2 + `.needs-rebuild` sentinel), `handlers/memory-crud-health.ts` (`index` block fields), `launcher-session-proxy.cjs` (error codes), `sk-git/SKILL.md` (worktree convention).
- Sibling `002-feature-catalog-update` (feature files exist before the README cluster links them, per the parent Phase Handoff Criteria).
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Documentation-only; no runtime performance impact.

### Reliability
- **NFR-R01**: Added prose must not contradict the existing accurate surfaces (e.g. the already-correct `memory_health.index` field list around README L359-361 is left as-is unless wording drifts).

### Safety
- **NFR-S01**: No source/behavior change; the three artifact files are markdown docs and one ENV table.
- **NFR-S02**: No CODE comment gains a spec-folder path, packet id, or finding id (comment-hygiene HARD BLOCK); these are prose docs.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Error-Code Accuracy
- `-32001` reader must NOT conclude the code was removed. The launcher still freezes `RETRYABLE_RECYCLE_ERROR = { code: -32001, ... data: { retryable: true } }`; the recycle path is the live use. The narrowing is only that the index vector-drain *outage* path no longer emits its own `-32001` class.
- `-32002` is the non-retryable protocol fail-closed (`PROTOCOL_MISMATCH_ERROR`, terminal CLOSED) — distinct from the retryable recycle.

### Tool Count
- A reader who sees `43` in `layer-definitions.ts` must not "correct" the README's `36`: those count different surfaces. The mk-spec-memory live registry (`TOOL_DEFINITIONS`) is 36.

### Schema Narrative
- The narrative must name migrations by number and effect, not invent a v31 or imply the enrichment columns are anything other than additive marker columns (`post_insert_enrichment_*`).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 3 doc files; additive subsections + one env row + footer bump |
| Risk | 12/25 | Accuracy-critical (error-code + tool-count guardrails) but docs-only, revertable |
| Research | 6/20 | All anchors pre-verified against deployed source; no open design |
| **Total** | **30/70** | **Level 2** (accuracy-weighted docs change across a multi-file cluster) |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. The tool-count and `-32001` accuracy guardrails are resolved by direct source verification (36 live entries; `-32001` still frozen as the retryable recycle error).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent program**: `../spec.md` (014-docs-and-stress-test-refresh, phase parent)
- **Sibling (feature files)**: `../002-feature-catalog-update/`
- **Plan**: `plan.md` · **Tasks**: `tasks.md` · **Checklist**: `checklist.md` · **Decisions**: `decision-record.md`
- **Verified source anchors**: `mcp_server/lib/search/vector-index-schema.ts`, `mcp_server/context-server.ts`, `mcp_server/lib/storage/checkpoints.ts`, `mcp_server/handlers/memory-crud-health.ts`, `.opencode/bin/lib/launcher-session-proxy.cjs`, `sk-git/SKILL.md`
