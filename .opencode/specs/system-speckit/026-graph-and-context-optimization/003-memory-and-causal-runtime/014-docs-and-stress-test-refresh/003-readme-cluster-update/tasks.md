---
title: "Tasks: README cluster update [system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update/tasks]"
description: "Task breakdown for the README cluster refresh: verify source anchors, edit the skill README (env row, schema narrative, front-proxy, error codes, sk-git, footer), add mcp_server README parity, add the ENV_REFERENCE SPECKIT_BACKEND_ONLY row, strict-validate."
trigger_phrases:
  - "readme cluster update tasks"
  - "003 readme cluster update tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored task breakdown for the README cluster refresh"
    next_safe_action: "Execute T1-T9; strict-validate"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/README.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Tasks: README Cluster Update

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` not started · `[~]` in progress · `[x]` complete (with evidence) · `[!]` blocked
- Each task names its target file(s) and the verification that closes it.
- Phases are sequential; verification gates each phase.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

**Phase theme — Verify anchors + skill README edits.**

- [x] **T1** Verify deployed source: `SCHEMA_VERSION = 30` (migs 28-30), `version: '1.7.2'` + `SPECKIT_BACKEND_ONLY` (`context-server.ts:1014`/`:2126`), checkpoint symbols + `.needs-rebuild` sentinel (`checkpoints.ts`), `index` health-block fields (`memory-crud-health.ts`), front-proxy error codes (`launcher-session-proxy.cjs:18-26`), sk-git `wt/{NNNN}-{name}` (`sk-git/SKILL.md`). <!-- all anchors confirmed against source -->
- [x] **T2** Confirm `36`-tool mk-spec-memory count from `TOOL_DEFINITIONS` in `tool-schemas.ts` before touching any number. <!-- TOOL_DEFINITIONS = 36 entries; count preserved -->
- [x] **T3** `README.md`: add the `SPECKIT_BACKEND_ONLY` env row near the env-variables table (around L627). <!-- env row added -->
- [x] **T4** `README.md`: add a schema v28->v30 + `.needs-rebuild` sentinel subsection under §3.2 Memory System. <!-- subsection added -->
- [x] **T5** `README.md`: add the MCP front-proxy / in-place daemon recycle / RSS-recycle transparency subsection + the error-code note (E429, -32001 retryable recycle LIVE, -32002 protocol fail-closed); cross-reference the sk-git `wt/{NNNN}-{name}` convention. <!-- front-proxy subsection + error-code note + sk-git cross-ref added -->
- [x] **T6** `README.md`: bump the footer (Documentation version, Skill version, "Last updated" 2026-06-02, "Current docs cover" line). <!-- footer bumped -->
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Phase theme — mcp_server README parity + ENV_REFERENCE row.**

- [x] **T7** `mcp_server/README.md`: add deep-reference parity for checkpoint-v2, the enrichment marker columns, the front-proxy recycle contract, and schema v30; keep the `36`-tool API reference accurate. <!-- KEY FILES + RUNTIME LIFECYCLE GUARDRAILS rows added; 36 preserved -->
- [x] **T8** `mcp_server/ENV_REFERENCE.md`: add the `SPECKIT_BACKEND_ONLY` row to §2 Infrastructure, sourced to `context-server.ts`. <!-- infrastructure row added -->
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

**Phase theme — Strict validate + reconcile.**

- [x] **T9 GATE** `validate.sh --strict` on this packet exits Errors: 0; reconcile `implementation-summary.md` + `checklist.md` with shipped evidence. <!-- validate.sh --strict Errors: 0 -->
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All edits traced to a verified source anchor (no loose paraphrase).
- [x] `36`-tool count verified and unchanged; new behaviors added to prose.
- [x] `-32001` documented precisely as the LIVE retryable recycle error (not removed).
- [x] `validate.sh --strict` exit 0; `implementation-summary.md` reconciled.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Spec**: `spec.md` (requirements R1-R6, success criteria SC1-SC5)
- **Plan**: `plan.md` (phase architecture + gates)
- **Decisions**: `decision-record.md` (ADRs for the docs-only scope, tool-count preservation, error-code precision)
- **Parent program**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
