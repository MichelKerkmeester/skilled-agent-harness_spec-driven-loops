---
title: "Verification Checklist: /doctor + Install-Guide Alignment"
description: "QA verification for the five-cluster doc-alignment sweep, adversarial verification, and orchestrator fix-ups across the /doctor command surface and three subsystem install guides."
trigger_phrases:
  - "doctor install alignment checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-doctor-install-alignment"
    last_updated_at: "2026-06-02T20:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Verification items confirmed via adversarial verifiers + final re-grep"
    next_safe_action: "Commit"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/_routes.yaml"
      - ".opencode/commands/doctor/scripts/mcp-doctor.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-remediation-session"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Verification Checklist: /doctor + Install-Guide Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..007)
- [x] CHK-002 [P0] Technical approach defined in plan.md (disjoint five-cluster partition)
- [x] CHK-003 [P1] R1 ground truth re-confirmed: code-graph DB is skill-local (config.ts:20); old shared path superseded 2026-05-29
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Partition strictly disjoint by subsystem; no cross-cluster file contention
- [x] CHK-011 [P0] Legitimate historical/migration references preserved (config.ts supersession comment + database_path_policy.md migration log; Cluster C 0-edit by design)
- [x] CHK-012 [P1] 014 README additions preserved (Cluster B surgical line-level edits)
- [x] CHK-013 [P1] `opencode.json` remains valid JSON after the 35→36/33 edits
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Adversarial verifiers returned pass for clusters A/B/C/D
- [x] CHK-021 [P0] Cluster E issues caught by verifier and fixed by orchestrator (install README + nothing left stale)
- [x] CHK-022 [P0] `mcp-doctor.sh` passes `bash -n` after the inverted-logic fix
- [x] CHK-023 [P1] Final re-grep clean: no old-path-as-current, no "all 6", no "/doctor code_graph", no hf-local-as-default, no embeddinggemma
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] REQ-001 R1 code-graph DB path corrected to skill-local wherever presented as current — re-grep returns only historical/superseded refs
- [x] CHK-031 [P0] REQ-002 No legitimate historical reference rewritten — config.ts supersession comment + database_path_policy.md migration log intact (Cluster C 0-edit)
- [x] CHK-032 [P0] REQ-003 Counts match source — 36 tools (opencode.json:33 note), 5 registered MCP servers, Node >=20.11, no v1.8.1
- [x] CHK-033 [P1] REQ-004 R2 mutation classes match doctor.sh read-only reality (downgrades applied; skill-advisor + install/debug/update kept mutates)
- [x] CHK-034 [P1] REQ-005 R4 colon-form: `:apply`/`:apply-confirm` + per-subsystem forms dropped; surviving `/doctor:mcp` + `/doctor:update` kept; `code_graph`→`code-graph`
- [x] CHK-035 [P1] REQ-006 R5 install guides use launcher front-proxy; Ollama-default local-first; nomic-embed-text-v1.5; no Python sentence-transformers wording
- [x] CHK-036 [P1] REQ-007 R6 skill-advisor lane ids + semantic_shadow live + "8 public + 1 internal" + doctor_skill-advisor rebuild target + invalid MCP-call examples fixed
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No secrets introduced; docs/config-doc only
- [x] CHK-041 [P1] Embedding wording reflects local-first (no silent-cloud guidance); aligns with egress-conscious default
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] spec/plan/tasks/implementation-summary synchronized to shipped state (Status Complete; phase checkboxes reconciled)
- [x] CHK-051 [P2] Downstream embedding wording consumes packet `132-embedding-provider-local-first` as ground truth (Ollama default → HF Local → opt-in cloud)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] 25 files edited across 5 clusters; no temp/scratch artifacts introduced into the repo
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 (CHK-071 validate pending) |
| P1 Items | 13 | 11/13 (CHK-070/072 ship pending) |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-02

### Ship status

- [ ] CHK-070 [P1] description.json + graph-metadata.json present
- [ ] CHK-071 [P0] `validate.sh --strict` → Errors 0
- [ ] CHK-072 [P1] Committed to main with explicit pathspec (no `-A`)
<!-- /ANCHOR:summary -->
