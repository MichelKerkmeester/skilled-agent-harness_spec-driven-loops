---
title: "Tasks: 013 Doctor Update Orchestrator"
description: "Task graph for the 5-phase implementation: scaffold + 4 isolated commands + 1 orchestrator + migration manifest + verification."
trigger_phrases:
  - "013 tasks"
  - "doctor update tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/001-implement-initial-doctor-command-set"
    last_updated_at: "2026-05-09T11:30:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored task graph"
    next_safe_action: "Author checklist.md"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-doctor-update-orchestrator"
      parent_session_id: null
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 013 Doctor Update Orchestrator

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

| Phase | Task Range | Owner | Wall-Clock |
|-------|-----------|-------|------------|
| Phase A: Scaffold 013 | T-001..T-008 | Claude Opus 4.7 | ≤30 min |
| Phase A.1: TX-model verify | T-009..T-010 | Claude Opus 4.7 | ≤15 min |
| Phase B: 4 isolated commands | T-011..T-026 | Claude direct OR cli-opencode parallel | ≤2h each (8h serial / 1-2h parallel) |
| Phase C: /doctor:update orchestrator | T-027..T-040 | Claude Opus 4.7 | ≤4h |
| Phase D: Migration manifest | T-041..T-046 | Claude Opus 4.7 | ≤2h |
| Phase E: Verification | T-047..T-055 | Claude Opus 4.7 | ≤1h |

**Critical path**: T-001 → T-008 → T-010 → T-011 (B1 first; B2-B4 parallelizable) → T-027 (orchestrator base) → T-040 (orchestrator complete) → T-041 (manifest) → T-047..T-055 (verify gates).
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:phase-a -->
## 2. PHASE A: SCAFFOLD 013

| ID | Task | REQ | Path | Status |
|----|------|-----|------|--------|
| T-001 | Verify 013 directory empty + branch is `main` + 026 has slot | — | `026/013-...`, `026/graph-metadata.json` | ✅ Done |
| T-002 | Author `spec.md` (Level 2; REQ-001..REQ-023) | All REQs | `013-.../spec.md` | ✅ Done |
| T-003 | Author `plan.md` (5 phases + dispatch design) | — | `013-.../plan.md` | ✅ Done |
| T-004 | Author `tasks.md` (this file) | — | `013-.../tasks.md` | 🟡 In progress |
| T-005 | Author `checklist.md` | All REQs | `013-.../checklist.md` | ✅ Done — file exists on disk |
| T-006 | Author `resource-map.md` | — | `013-.../resource-map.md` | ✅ Done — file exists on disk |
| T-007 | Author `decision-record.md` (7 council ADRs + tx-model placeholder) | REQ-010 | `013-.../decision-record.md` | ✅ Done — file exists on disk |
| T-008 | Run `generate-context.js` → `description.json` + `graph-metadata.json`; restore parent 026 manual fields | REQ-015 | `013-.../*.json`, `026/graph-metadata.json` | ✅ Done — file exists on disk |
<!-- /ANCHOR:phase-a -->

---

<!-- ANCHOR:phase-a1 -->
## 3. PHASE A.1: TX-MODEL VERIFY (gating Phase B/C)

| ID | Task | REQ | Path | Status |
|----|------|-----|------|--------|
| T-009 | Read `handlers/memory-index.ts:handleMemoryIndexScan` to determine tx granularity | REQ-016 | `mcp_server/handlers/memory-index.ts` | ✅ Done — file exists on disk |
| T-010 | Document finding in `decision-record.md` ADR-001 (per-batch vs single tx) | REQ-016 | `013-.../decision-record.md` | ✅ Done — file exists on disk |
<!-- /ANCHOR:phase-a1 -->

---

<!-- ANCHOR:phase-b -->
## 4. PHASE B: 4 ISOLATED DOCTOR COMMANDS

### B1: /doctor:memory

| ID | Task | REQ | Path | Status |
|----|------|-----|------|--------|
| T-011 | Author `commands/doctor/memory.md` (Markdown entrypoint matching `/doctor:code-graph` shape) | REQ-001 | `.opencode/commands/doctor/memory.md` | ✅ Done — file exists on disk |
| T-012 | Author `assets/doctor_memory.yaml` (status check first, then tier-aware snapshot/rebuild prompts) | REQ-002, REQ-006, REQ-013 | `.opencode/commands/doctor/assets/doctor_memory.yaml` | ✅ Done — file exists on disk |

### B2: /doctor:causal-graph

| ID | Task | REQ | Path | Status |
|----|------|-----|------|--------|
| T-016 | Author `commands/doctor/causal-graph.md` | REQ-001 | `.opencode/commands/doctor/causal-graph.md` | ✅ Done — file exists on disk |
| T-017 | Author `assets/doctor_causal-graph.yaml` (coverage report first, add-only mutation behind prompt) | REQ-002 | `.opencode/commands/doctor/assets/doctor_causal-graph.yaml` | ✅ Done — file exists on disk |

### B3: /doctor:deep-loop

| ID | Task | REQ | Path | Status |
|----|------|-----|------|--------|
| T-021 | Author `commands/doctor/deep-loop.md` | REQ-001 | `.opencode/commands/doctor/deep-loop.md` | ✅ Done — file exists on disk |
| T-022 | Author `assets/doctor_deep-loop.yaml` (status check, lazy-init detection, prompted graph upsert) | REQ-002 | `.opencode/commands/doctor/assets/doctor_deep-loop.yaml` | ✅ Done — file exists on disk |

### B4: /doctor:cocoindex

| ID | Task | REQ | Path | Status |
|----|------|-----|------|--------|
| T-026 | Author `commands/doctor/cocoindex.md` + `assets/doctor_cocoindex.yaml` (daemon coordination + idempotent restart) | REQ-001, REQ-002 | `.opencode/commands/doctor/cocoindex.md` + `assets/doctor_cocoindex.yaml` | ✅ Done — file exists on disk |
<!-- /ANCHOR:phase-b -->

---

<!-- ANCHOR:phase-c -->
## 5. PHASE C: /DOCTOR:UPDATE ORCHESTRATOR

| ID | Task | REQ | Path | Status |
|----|------|-----|------|--------|
| T-027 | Author `commands/doctor/update.md` Markdown entrypoint (council 10-line spec + tier-aware routing + 5 flag definitions) | REQ-001, REQ-004 | `.opencode/commands/doctor/update.md` | ✅ Done — file exists on disk |
| T-028 | Author `assets/doctor_update.yaml` (status check first, tier-aware prompts, failure recovery, dashboard) | REQ-002, REQ-004, REQ-013 | `.opencode/commands/doctor/assets/doctor_update.yaml` | ✅ Done — file exists on disk |
| T-033 | Implement Phase 1 of council spec: flock acquisition primitive in YAML or external script | REQ-005 | flock script or inline YAML | ✅ Done — file exists on disk |
| T-034 | Implement Phase 2: MCP-client-activity probe + warn-and-prompt + `--force` override | REQ-014 | YAML asset | ✅ Done — file exists on disk |
| T-035 | Implement Phase 3: VACUUM INTO snapshot for all *.sqlite + disk-free preflight | REQ-006, REQ-023 | YAML asset | ✅ Done — file exists on disk |
| T-036 | Implement Phase 4: status check (parallel) + cross-subsystem health dashboard | REQ-007 | YAML asset + dashboard rendering | ✅ Done — file exists on disk |
| T-037 | Implement Phase 6: dependency-ordered execution with tier prompts | REQ-013 | YAML asset | ✅ Done — file exists on disk |
| T-038 | Implement Phase 7: one-retry-then-rollback partial-failure recovery | REQ-012 | YAML asset | ✅ Done — file exists on disk |
| T-039 | Implement Phase 8: SIGINT graceful cancel + snapshot-restore | REQ-011 | YAML asset or external script | ✅ Done — file exists on disk |
| T-040 | Implement Phase 10: state-log JSON write + flock release + snapshot cleanup (>30 days unless `--keep-snapshots`) | REQ-015, REQ-022 | YAML asset | ✅ Done — file exists on disk |
<!-- /ANCHOR:phase-c -->

---

<!-- ANCHOR:phase-d -->
## 6. PHASE D: MIGRATION MANIFEST

| ID | Task | REQ | Path | Status |
|----|------|-----|------|--------|
| T-041 | Author `mcp_server/database/migration-manifest.json` schema | REQ-008 | `database/migration-manifest.json` | ✅ Done — file exists on disk |
| T-042 | Populate 3.3.0.0 block (deprecated files, schema migrations, post-state) | REQ-008 | manifest | ✅ Done — file exists on disk |
| T-043 | Populate 3.4.0.0 block (memory/*.md retired, graph-metadata.json added) | REQ-008 | manifest | ✅ Done — file exists on disk |
| T-044 | Populate 3.4.1.0 block (doctor commands, tree-sitter recovery, daemon resilience) | REQ-008 | manifest | ✅ Done — file exists on disk |
| T-045 | (Optional REQ-020) Author per-version migration scripts under `mcp_server/scripts/migrations/` | REQ-020 | scripts dir | ✅ Done — file exists on disk |
| T-046 | Wire manifest gap detection into `/doctor:update --migrate` YAML | REQ-008 | YAML asset | ✅ Done — file exists on disk |
<!-- /ANCHOR:phase-d -->

---

<!-- ANCHOR:phase-e -->
## 7. PHASE E: VERIFICATION

| ID | Task | REQ | Path | Status |
|----|------|-----|------|--------|
| T-047 | G1: `validate_document.py --type command` per new `*.md` (5 files) → all valid | REQ-001 | per-file validation | ⏳ Pending |
| T-048 | G2: YAML canonical-path validator per asset (10 files) → all load | REQ-002 | per-yaml validation | ⏳ Pending |
| T-049 | G3: Strict spec-folder validate on 013 packet → exit 0 | REQ-003 | `validate.sh 013-... --strict` | ⏳ Pending |
| T-050 | G4: `/doctor:update --no-snapshot` smoke test → detects 2 stale subsystems (causal + deep-loop) | REQ-007 | smoke run | ⏳ Pending |
| T-051 | G5: `/doctor:update` UX test with forced-failure injection → tier prompts + retry/rollback/leave works | REQ-012, REQ-013 | smoke run | ⏳ Pending |
| T-052 | G6: Concurrent dispatch refusal → second invocation refused with holding-PID | REQ-005 | smoke run | ⏳ Pending |
| T-053 | G7: SIGINT cancellation safety → exit 130 + snapshot restored + state log | REQ-011 | smoke run | ⏳ Pending |
| T-054 | G8: Migration gap detection → synthetic version skip refused | REQ-008 | smoke run | ⏳ Pending |
| T-055 | G9: Cross-subsystem dashboard render → all 7 subsystems with status + age + recommendation | REQ-007 | smoke run | ⏳ Pending |
<!-- /ANCHOR:phase-e -->

---

<!-- ANCHOR:close -->
## 8. CLOSE

| ID | Task | REQ | Path | Status |
|----|------|-----|------|--------|
| T-056 | Author `implementation-summary.md` with evidence per REQ; mark `checklist.md` `[x]` | REQ-015 | `013-.../implementation-summary.md`, `checklist.md` | ✅ Done — file exists on disk |
| T-057 | Update `_memory.continuity.completion_pct: 100` across packet docs | REQ-015 | per-doc frontmatter | ⏳ Pending |
| T-058 | Run `/memory:save` with `handover_state` routing; address POST-SAVE QUALITY REVIEW HIGH issues | — | memory:save | ⏳ Pending |
| T-059 | Verify branch is `main`; delete any auto-created packet branch | — | git | ⏳ Pending |
<!-- /ANCHOR:close -->

---

<!--
TASKS-CORE + L2 (~155 lines)
- 59 discrete tasks across 6 phases (A, A.1, B, C, D, E + close)
- Critical path: scaffold → tx-verify → orchestrator → manifest → verify
- Phase B parallelization optional via cli-opencode dispatch
- Each task cites REQ + absolute path; status starts ⏳ Pending
-->
