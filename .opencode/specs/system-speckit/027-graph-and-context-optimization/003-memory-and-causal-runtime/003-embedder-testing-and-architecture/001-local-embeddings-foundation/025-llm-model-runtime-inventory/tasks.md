---
title: "Tasks: LLM and embedding-model runtime inventory per subsystem"
description: "Authoring checklist for the variant-a and variant-b inventory documents."
trigger_phrases:
  - "model inventory tasks"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/025-llm-model-runtime-inventory"
    last_updated_at: "2026-05-13T17:30:00Z"
    last_updated_by: "claude"
    recent_action: "Authored variant-a and variant-b inventory docs"
    next_safe_action: "Review accuracy with operator"
    blockers: []
    key_files:
      - "tasks.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Tasks: LLM and embedding-model runtime inventory per subsystem

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

| Marker | Meaning |
|--------|---------|
| `[ ]` | Open task |
| `[x]` | Completed task |
| `[B]` | Blocked task |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T001 Identify all subsystems that invoke the Memory MCP embedding provider directly or transitively.
- [x] T002 Map each Variant A subsystem to its runtime, model id, dimensions, and quantization.
- [x] T003 Identify all subsystems that invoke the CocoIndex sentence-transformers stack.
- [x] T004 Map each Variant B subsystem to its runtime, model id, and prompt template.
- [x] T005 Identify subsystems with no embedding model at all.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T006 Write `variant-a-quantized-gemma.md` with the resolved inventory.
- [x] T007 Write `variant-b-cocoindex-sbert.md` with the resolved inventory and call out structural-only subsystems.
- [x] T008 Author packet metadata (`description.json`, `graph-metadata.json`).
- [x] T009 Author Level 1 continuity docs (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T010 Run strict spec validation on the packet.
- [x] T011 Confirm variant documents cite canonical source files.
- [x] T012 Confirm structural-only subsystems are explicitly listed in `variant-b-cocoindex-sbert.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [x] All tasks marked `[x]`.
- [x] Strict validator passed.
- [x] Both variant documents reviewed for source-of-truth accuracy.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- Parent phase: `014-local-embeddings-setup-a` (phase parent under packet 026 graph-and-context-optimization).
- Sibling packets: `019-readme-resource-map`, `020-catalog-playbook-alignment-audit`.
- Source files: `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py`.
<!-- /ANCHOR:cross-refs -->
