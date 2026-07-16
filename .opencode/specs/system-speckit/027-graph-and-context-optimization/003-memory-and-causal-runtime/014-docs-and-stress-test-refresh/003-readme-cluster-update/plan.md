---
title: "Implementation Plan: README cluster update [system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update/plan]"
description: "Plan for refreshing the system-spec-kit README cluster to the shipped 013 roadmap + sk-git convention: verify source anchors, edit the skill README (env row, schema narrative, front-proxy, error codes, sk-git, footer), add mcp_server README deep-reference parity, add the ENV_REFERENCE SPECKIT_BACKEND_ONLY row, then strict-validate."
trigger_phrases:
  - "readme cluster update plan"
  - "003 readme cluster update plan"
  - "readme schema v30 front-proxy doc plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-2 plan for the README cluster refresh"
    next_safe_action: "Edit the three artifact files, then validate.sh --strict"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/README.md"
      - ".opencode/skills/system-spec-kit/mcp_server/README.md"
      - ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Plan: README Cluster Update

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation (sk-doc validated) |
| **Subsystem** | system-spec-kit skill README cluster |
| **Storage** | n/a (docs-only) |
| **Testing** | `validate.sh --strict` on the packet; sk-doc structure checks on the edited READMEs |

### Overview
The README cluster is refreshed to match the deployed runtime. All behavioral claims are pre-verified against source: `SCHEMA_VERSION = 30` with migrations 28-30, `version: '1.7.2'` and `SPECKIT_BACKEND_ONLY` in `context-server.ts`, the checkpoint v1/v2 symbols and `.needs-rebuild` sentinel in `checkpoints.ts`, the `index` health block fields in `memory-crud-health.ts`, the front-proxy error contract in `launcher-session-proxy.cjs`, and the `wt/{NNNN}-{name}` convention in `sk-git/SKILL.md`. Edits are additive and surgical — new subsections/rows in the existing format — and the `36`-tool mk-spec-memory count is left unchanged after verification.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- All source anchors verified against deployed code (done at spec time).
- The three artifact files read in full before editing.
- Tool-count (`36`) and `-32001` (LIVE) accuracy guardrails internalized.

### Definition of Done
- `SPECKIT_BACKEND_ONLY` documented in the skill README and as an ENV_REFERENCE row.
- Schema v28->v30 + `.needs-rebuild` subsection present; front-proxy subsection + error-code note present.
- `mcp_server/README.md` deep-reference parity added; `36`-tool count unchanged.
- Footer bumped (version, 2026-06-02 last-updated, "Current docs cover" line).
- `validate.sh --strict` on the packet exits Errors: 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surgical, additive documentation edits keyed to verified source anchors. Each new prose block names the deployed source it describes (file:line where load-bearing) so the docs stay traceable and resist future drift.

### Key Components
- **Skill README (`README.md`):** env row (`SPECKIT_BACKEND_ONLY`); §3.2 schema v28->v30 + `.needs-rebuild` subsection; front-proxy / in-place daemon recycle / RSS-recycle subsection; error-code note (E429, -32001 retryable LIVE, -32002 fail-closed); sk-git `wt/{NNNN}-{name}` cross-ref; footer bump.
- **MCP server README (`mcp_server/README.md`):** deep-reference parity rows/subsections for checkpoint-v2, the enrichment marker columns, the front-proxy recycle contract, and schema v30; `36`-tool API reference preserved.
- **ENV_REFERENCE:** one `SPECKIT_BACKEND_ONLY` row in §2 Infrastructure, sourced to `context-server.ts`.

### Data Flow
verify anchors -> edit skill README (additive subsections + env row + footer) -> edit mcp_server README (parity) -> add ENV_REFERENCE row -> strict-validate packet -> reconcile implementation-summary.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Verify and Skill README
- Confirm `SCHEMA_VERSION`, `version: '1.7.2'`, `SPECKIT_BACKEND_ONLY` read site, checkpoint symbols, health-block fields, front-proxy error codes, and the sk-git convention against source.
- Confirm the `36`-tool count from `TOOL_DEFINITIONS` (`tool-schemas.ts`) before touching any number.
- Edit `README.md`: add the `SPECKIT_BACKEND_ONLY` env row; add the schema v28->v30 + `.needs-rebuild` subsection under §3.2; add the front-proxy subsection; add the error-code note; cross-reference the sk-git worktree convention; bump the footer.

### Phase 2: MCP Server README parity + ENV_REFERENCE
- Edit `mcp_server/README.md`: add deep-reference parity for checkpoint-v2, the enrichment marker, the front-proxy, and schema v30; keep the `36`-tool reference accurate.
- Edit `ENV_REFERENCE.md`: add the `SPECKIT_BACKEND_ONLY` row to §2 Infrastructure.

### Phase 3: Validate
- Run `validate.sh --strict` on the packet; iterate to Errors: 0.
- Reconcile `implementation-summary.md` and `checklist.md` with the shipped evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | This packet docs | `validate.sh --strict` (Errors: 0) |
| Doc structure | Edited READMEs | sk-doc `validate_document.py` / `extract_structure.py` (optional) |
| Accuracy review | Every added claim | Manual trace to the cited source anchor |

This packet runs NO code tests (docs-only): `test.ran=false`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Verified source anchors (schema, context-server, checkpoints, health, front-proxy, sk-git) | Internal | Green | claims become unverifiable; would HALT |
| Sibling `002-feature-catalog-update` | Internal | Green | feature files exist before the README links them (parent handoff) |
| sk-doc validators | Internal | Green | optional structure confirmation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a claim fails source verification, or `validate.sh --strict` reports errors.
- **Procedure**: revert the specific doc edit (docs-only, no runtime impact); re-verify the anchor; re-apply the corrected prose; re-run strict validation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Verify + Skill README) ──► Phase 2 (mcp_server README + ENV_REFERENCE) ──► Phase 3 (Validate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | Verified anchors | Phase 2 |
| Phase 2 | Phase 1 (skill README accurate) | Phase 3 |
| Phase 3 | Phase 2 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 — Verify + Skill README | Med | source verification + 5 additive edits |
| Phase 2 — mcp_server README + ENV row | Low | parity prose + 1 table row |
| Phase 3 — Validate | Low | strict validate + reconcile |
| **Total** | Med | **single docs pass, accuracy-gated** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-dispatch Checklist
- [ ] Source anchors re-verified before each added claim.
- [ ] Tool count confirmed at `36` before any number is touched.
- [ ] Scope locked to the three artifact files + this child folder.

### Rollback Procedure
1. If a claim is wrong: revert that edit, re-read the source, re-apply corrected prose.
2. If strict validation fails: read each failing rule, fix the packet doc, re-run.
3. No runtime rebuild/restart is involved (docs-only).

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: `git checkout` the doc file (orchestrator-owned); no index/DB effect.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS
- **Spec**: `spec.md` · **Tasks**: `tasks.md` · **Checklist**: `checklist.md` · **Decisions**: `decision-record.md`
- **Parent program**: `../spec.md`
