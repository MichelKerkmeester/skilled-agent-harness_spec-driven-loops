---
title: "Implementation Summary: Catalog/playbook alignment audit for local embeddings default set"
description: "Summarizes the audit packet, required follow-on documentation updates, caveats, and non-impact classifications."
trigger_phrases:
  - "catalog playbook audit summary"
  - "local embedding defaults handoff"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/020-catalog-playbook-alignment-audit"
    last_updated_at: "2026-05-13T14:55:00Z"
    last_updated_by: "opencode"
    recent_action: "Applied embedding-doc follow-ups"
    next_safe_action: "Review and commit the scoped documentation updates when ready"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000020"
      session_id: "020-catalog-playbook-alignment-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which catalog and playbook entries need update/delete/edit/create actions after local embedding defaults changed?"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 020-catalog-playbook-alignment-audit |
| **Completed** | 2026-05-13 |
| **Level** | 3 |
| **Parent** | 014-local-embeddings-setup-a |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Created a Level 3 child phase packet that captures catalog/playbook alignment findings for local embedding defaults, then applied the approved documentation follow-ups. The packet records exact provider cascades, model IDs, target docs updated, caveat candidates, and non-impact surfaces without modifying runtime code.

### Source-of-Truth Defaults Recorded

| Surface | Default / Behavior |
|---------|--------------------|
| Memory provider cascade | explicit env -> Voyage -> OpenAI -> `llama-cpp` -> `hf-local` |
| Memory active local default | `llama-cpp` with `unsloth/embeddinggemma-300m-GGUF` |
| Memory fallback | `hf-local` with `onnx-community/embeddinggemma-300m-ONNX`, q8 |
| CocoIndex default model | `sbert/google/embeddinggemma-300m` |
| CocoIndex query prompt | `InstructionRetrieval` |
| CocoIndex repo default include | Code-only include; specs/docs excluded by default |
| Code Graph | No embedding defaults defined |

### P0/P1 Applied Updates

| Action | Target File | Required Change |
|--------|-------------|-----------------|
| Update | `.opencode/skills/system-spec-kit/feature_catalog/19--feature-flag-reference/05-5-embedding-and-api.md` | Added full provider cascade and `llama-cpp`/GGUF then `hf-local`/ONNX q8 defaults. |
| Update | `.opencode/skills/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/032-5-embedding-and-api.md` | Added tests for full cascade and local/fallback defaults. |
| Update | `.opencode/skills/system-spec-kit/feature_catalog/14--pipeline-architecture/23-embeddings-and-retry-api.md` | Added current default provider profile/model IDs. |
| Update | `.opencode/skills/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/219-embeddings-and-retry-api.md` | Added provider profile/model ID validation to the manual scenario. |
| Update | `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | Mirrored corrected embedding/API flag summary. |
| Update | `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Mirrored corrected EX-032 summary. |
| Update | `.opencode/skills/mcp-coco-index/feature_catalog/03--indexing-pipeline/04-embedding-provider-selection.md` | Replaced stale `all-MiniLM-L6-v2` wording with current EmbeddingGemma and `InstructionRetrieval` defaults. |
| Update | `.opencode/skills/mcp-coco-index/feature_catalog/08--configuration/01-user-settings.md` | Aligned settings documentation with EmbeddingGemma and `InstructionRetrieval`. |
| Update | `.opencode/skills/mcp-coco-index/feature_catalog/feature_catalog.md` | Removed stale root summary expectations for old model/Voyage defaults. |
| Update | `.opencode/skills/mcp-coco-index/manual_testing_playbook/03--configuration/001-default-model-verification.md` | Validates current default model and prompt instead of stale model. |
| Update | `.opencode/skills/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md` | Aligned root playbook summary with current CocoIndex defaults. |
| Update | `.opencode/skills/mcp-coco-index/README.md`, `INSTALL_GUIDE.md`, `SKILL.md`, `references/settings_reference.md`, `references/tool_reference.md`, `assets/config_templates.md` | Replaced stale current-default/recommended wording while preserving MiniLM and Voyage as alternatives. |

### P2/P3 Review and Caveat Candidates

| Action | Target File or Surface | Guidance |
|--------|------------------------|----------|
| Caveat | `.opencode/skills/mcp-coco-index/manual_testing_playbook/03--configuration/002-project-settings-inspection.md` | Scenario now treats docs/spec formats as not required in the default include set and checks exclusions when present. |
| Caveat | `.opencode/skills/mcp-coco-index/feature_catalog/06--patches-and-extensions/03-path-class-taxonomy.md` | Clarifies docs/spec taxonomy applies after include/exclude filters and protects explicit opt-in/legacy indexes. |
| Caveat | `.opencode/skills/mcp-coco-index/feature_catalog/06--patches-and-extensions/04-implementation-intent-reranking.md` | Clarifies docs/spec penalties do not imply docs/spec files are indexed by default. |
| No embedding-default update | system-spec-kit reranker docs | Keep reranker-specific; do not conflate reranker `llama-cpp` with embedding `llama-cpp`. |
| Non-impact | Code Graph docs | Code Graph does not define embedding defaults. |
| Non-impact or clarify | Skill Advisor docs | If touched, clarify `local/native` means scorer implementation, not embedding provider cascade. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The child folder was scaffolded with the system-spec-kit Level 3 contract, populated with the requested audit findings, and then updated after the user approved all follow-ups. Verification uses strict spec validation, stale-default grep checks, and recorded code graph refresh attempts.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Separate memory and CocoIndex defaults | They use different provider stacks and model identifiers. |
| Treat Code Graph as non-impact | The dispatch states Code Graph does not define embedding defaults. |
| Preserve reranker docs as reranker-specific | Reranker `llama-cpp` is not the memory embedding provider cascade. |
| Apply approved follow-up edits in this packet | The user explicitly requested all follow-ups after the audit packet was created. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Level 3 scaffold created | PASS: `create.sh --level 3 --path ...` created required docs and `description.json`. |
| Source-of-truth defaults captured | PASS: defaults listed in `spec.md` and this summary. |
| P0/P1 target paths captured | PASS: nine update rows listed. |
| P2/P3 caveats captured | PASS: review/caveat/non-impact rows listed. |
| Target docs modified | PASS: approved documentation-only target files were edited; runtime code stayed untouched. |
| Strict validation | PASS after final run. |
| Placeholder scan | PASS after final run. |
| Stale default grep | PASS after final run for stale current-default/recommended wording. |
| Code graph refresh | ATTEMPTED: stored-scope scans timed out twice; intermediate status showed `freshness: stale` with `selective_reindex` still required. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No runtime code was changed.** This packet only applies documentation and metadata follow-ups.
2. **Some older model names remain as documented alternatives.** `all-MiniLM-L6-v2` and `voyage-code-3` references are valid when clearly framed as alternatives, not current defaults.
3. **Code Graph refresh remains unresolved.** Two stored-scope code graph scans timed out; the last successful status payload still reported stale readiness.
4. **Code Graph and Skill Advisor remain non-impact.** They were not edited for embedding-provider defaults because they do not own those defaults.
<!-- /ANCHOR:limitations -->
