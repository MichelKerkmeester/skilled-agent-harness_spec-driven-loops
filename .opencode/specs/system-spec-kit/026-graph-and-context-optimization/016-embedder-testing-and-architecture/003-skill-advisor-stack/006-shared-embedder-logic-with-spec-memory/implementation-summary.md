---
title: "Implementation Summary: shared embedder logic with spec-memory [template:level_1/implementation-summary.md]"
description: "PRE-IMPLEMENTATION scaffold for shared embedder logic with spec-memory."
trigger_phrases:
  - "shared embedder logic skill-advisor"
  - "skill-advisor spec-memory embedder parity"
importance_tier: "important"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/006-shared-embedder-logic-with-spec-memory"
    last_updated_at: "2026-05-21T10:16:26Z"
    last_updated_by: "codex"
    recent_action: "Pre-implementation scaffold created"
    next_safe_action: "Extract shared embedder factory and add parity regression"
    blockers: []
    completion_pct: 0
---
# Implementation Summary: shared embedder logic with spec-memory

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status: PRE-IMPLEMENTATION.** This packet is a scaffold. The concrete source/test files below are planned targets so the strict validator and future implementer have actionable anchors.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Planned - PRE-IMPLEMENTATION |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `003-skill-advisor-stack` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

No implementation has shipped yet. The planned build targets are:

- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts:1` - planned shared registry source.
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:1` - planned shared provider factory entrypoint.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts:1` - planned consumer update.
- `.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/shared-factory-parity.vitest.ts:1` - planned regression.

This scaffold itself created the canonical packet files: `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `description.json`, and `graph-metadata.json`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The packet was created from the Level 1 structural contract and the requested 008 structural template. No runtime source code was changed in this scaffold. Future implementation should follow `plan.md` Phase A-D and preserve the predecessor links in `spec.md`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001

Do not touch CocoIndex in this packet because operator states it is already on the same model.

### D-002

Prefer one shared factory contract over two synchronized registries; duplicated defaults are the failure mode.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Planned verification:

- New parity regression exits 0.
- Existing embedder registry tests exit 0.
- Strict-validate exits 0.

Scaffold verification must run:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/006-shared-embedder-logic-with-spec-memory --strict
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. No shared module is implemented by this scaffold.
2. Exact module path may need adjustment after reading package exports.
<!-- /ANCHOR:limitations -->
