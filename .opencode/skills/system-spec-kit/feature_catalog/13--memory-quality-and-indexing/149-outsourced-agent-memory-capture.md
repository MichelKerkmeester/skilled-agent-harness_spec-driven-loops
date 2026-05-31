---
title: "Outsourced agent memory capture"
description: "Outsourced agent memory capture keeps external CLI save payloads aligned with the current `generate-context.js` contract. It enforces hard-fail validation for explicit JSON data files, persists `nextSteps` fields into memory observations, and now documents the post-010 save gates that can still reject a valid handback after normalization."
trigger_phrases:
  - "outsourced agent memory capture"
  - "generate-context.js contract"
  - "external CLI save payload"
  - "nextSteps field persistence"
  - "agent handback validation"
---

# Outsourced agent memory capture

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Outsourced agent handback keeps external CLI save payloads aligned with the current `generate-context.js` contract. It enforces hard-fail validation for explicit JSON data files, persists `nextSteps` fields into memory observations, and now documents the post-010 save gates that can still reject a valid handback after normalization.

When work is delegated to an external helper (like a different AI tool), the results need to come back in a clean format the indexed-continuity store can understand. This feature makes sure that incoming data files are properly validated and that follow-up actions are captured, so nothing important gets lost when work passes between different tools.

---

## 2. HOW IT WORKS

Outsourced-agent handback is now implemented and aligned across runtime behavior, regression tests, the 8 CLI handback docs, and the feature catalog.

Current behavior is enforced in four slices:
1. `EXPLICIT_DATA_FILE_LOAD_FAILED` hard-fail in `data-loader.ts` for missing files, invalid JSON and validation failures when `dataFile` is provided explicitly.
2. `nextSteps` / `next_steps` persistence in normalization and extraction flow, producing `Next: ...`, `Follow-up: ...` and `NEXT_ACTION`.
3. 8 CLI handback docs (`cli-codex`, `cli-claude-code`, `cli-gemini`, `SKILL.md` + `prompt_templates.md`) documenting redact/scrub guidance, the accepted snake_case fields, the `INSUFFICIENT_CONTEXT_ABORT` and `CONTAMINATION_GATE_ABORT` outcomes, and minimum viable payload guidance.
4. File-backed handbacks skip runtime-capture alignment and `QUALITY_GATE_ABORT`, but they still hit the shared sufficiency and contamination gates after normalization.

Status: Implemented. Spec folder `015-outsourced-agent-handback` is complete and supersedes the earlier `013-outsourced-agent-memory` pass.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| scripts/loaders/data-loader.ts | Scripts | JSON-mode data loading with EXPLICIT_DATA_FILE_LOAD_FAILED hard-fail (3 throw paths) |
| scripts/utils/input-normalizer.ts | Scripts | nextSteps/next_steps field normalization into NEXT_ACTION observations |
| scripts/extractors/session-extractor.ts | Scripts | Next:/Follow-up: pattern extraction from session transcripts |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| scripts/tests/runtime-memory-inputs.vitest.ts | Automated test | Targeted regression coverage for explicit JSON-mode hard-fail behavior plus `nextSteps` / `next_steps` persistence into `NEXT_ACTION` |
| scripts/tests/outsourced-agent-handback-docs.vitest.ts | Automated test | CLI-handback doc regression coverage for rejection codes, payload richness guidance, and feature-catalog alignment |

### CLI Handback Docs

| File | Type | Role |
|---|---|---|
| .opencode/skills/cli-codex/SKILL.md | Manual playbook | Caller-side handback flow, redact/scrub guidance, post-010 rejection codes, and minimum payload guidance |
| .opencode/skills/cli-codex/assets/prompt_templates.md | Manual playbook | Prompt template for MEMORY_HANDBACK extraction, richer `FILES` payloads, and `/tmp/save-context-data-<session-id>.json` save flow |
| .opencode/skills/cli-claude-code/SKILL.md | Manual playbook | Caller-side handback flow, redact/scrub guidance, post-010 rejection codes, and minimum payload guidance |
| .opencode/skills/cli-claude-code/assets/prompt_templates.md | Manual playbook | Prompt template for MEMORY_HANDBACK extraction, richer `FILES` payloads, and `/tmp/save-context-data-<session-id>.json` save flow |
| .opencode/skills/cli-gemini/SKILL.md | Manual playbook | Caller-side handback flow, redact/scrub guidance, post-010 rejection codes, and minimum payload guidance |
| .opencode/skills/cli-gemini/assets/prompt_templates.md | Manual playbook | Prompt template for MEMORY_HANDBACK extraction, richer `FILES` payloads, and `/tmp/save-context-data-<session-id>.json` save flow |

---

## 4. SOURCE METADATA
- Group: Memory Quality And Indexing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `13--memory-quality-and-indexing/149-outsourced-agent-memory-capture.md`
Related references:
- [148-dry-run-preflight-for-memory-save.md](148-dry-run-preflight-for-memory-save.md) — Dry-run preflight for memory_save
- [150-session-enrichment-and-alignment-guards.md](150-session-enrichment-and-alignment-guards.md) — Stateless enrichment and alignment guards
