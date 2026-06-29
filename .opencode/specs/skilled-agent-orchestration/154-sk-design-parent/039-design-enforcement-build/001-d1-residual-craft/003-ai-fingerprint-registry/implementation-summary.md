---
title: "Implementation Summary: AI Fingerprint Registry"
description: "The prose-only AI-tell catalog now has a structured per-model registry, a generated self-defect card, and a parity validator that fails the moment a catalog tell lacks a registry row."
trigger_phrases:
  - "ai fingerprint registry summary"
  - "design audit registry implementation"
  - "ai tell parity validator"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/003-ai-fingerprint-registry"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Shipped 9-row AI tell registry, self-defect card, parity validator; verified PASS/BITE exits"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/assets/ai_fingerprint_registry.json"
      - ".opencode/skills/sk-design/design-audit/assets/ai_fingerprint_self_defect_card.md"
      - ".opencode/skills/sk-design/shared/scripts/ai-fingerprint-registry-check.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Parity enforceable now vs per-tell detection needing phase 004 fixtures: resolved as a deliberate, fixture_id-named forward split"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-ai-fingerprint-registry |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The audit mode used to detect model-specific AI tells from a prose catalog alone, so a tell could quietly drop out of the catalog and nothing would notice. You can now read the same nine tells as a structured registry, run one self-audit prompt per tell from a generated card, and trust a validator that fails the instant a catalog tell has no matching registry row. The prose catalog stays the human-readable layer; the registry is the machine-checkable layer beneath it, and the two are now held in lockstep at nine rows to nine tells.

This upgrade is additive. The registry mirrors the catalog rather than replacing it, the prose catalog and every existing asset are preserved, and the only edits to shipped craft files add discovery wiring and a cross-link.

### Per-Model AI-Tell Registry

`design-audit/assets/ai_fingerprint_registry.json` carries one row per catalog tell, keyed by a stable tell slug. Each row holds a fixed seven-field schema: `tell_id`, `model_family`, `self_defect_prompt`, `deterministic_check`, `fixture_id`, `severity_floor`, `owner`. Nine rows are seeded directly from the live catalog, grouped by model family:

| Model family | Rows | Tells |
|--------------|------|-------|
| Codex | 5 | ghost-card border-plus-shadow, over-rounded cards, sketchy SVG illustration, diagonal stripe background, element-tracking on display type |
| Gemini | 1 | image-hover animation |
| 2026-general | 3 | cream/sand body background, eyebrow above every section, uniform section fade-and-rise |

`model_family` is constrained to `codex`, `gemini`, or `general`; `severity_floor` to `P0`-`P3`; `owner` to `foundations`, `interface`, `motion`, or `sk-code`. Every `tell_id` and `fixture_id` must be a lowercase hyphen slug. The `fixture_id` column names the fixture each tell will be exercised against, by stable slug, so the forward dependency on the sibling fixture corpus is written into the data rather than left implicit.

### Generated Self-Defect Card

`design-audit/assets/ai_fingerprint_self_defect_card.md` collects every row's `self_defect_prompt` into one self-check surface, grouped under Codex, Gemini, and General headings. Nine prompts map one-to-one to the nine registry rows, so a reviewer can walk the card before filing or clearing the model-specific Anti-Patterns finding without leaving the audit mode.

### Catalog-to-Registry Parity Validator

`shared/scripts/ai-fingerprint-registry-check.mjs` is a Node ESM validator modeled on the existing `design-command-surface-check.mjs`. It parses the catalog's model-family sections into a tell list, reads the registry, and enforces parity in both directions. It fails when a catalog tell has no matching registry row (forward parity), when a row maps to no catalog tell (reverse parity, orphan rows), when a row is missing a required field or carries an out-of-vocabulary `model_family` / `severity_floor` / `owner`, when a `tell_id` or `fixture_id` is not a clean slug, and when a row's `model_family` disagrees with the catalog. It exits 0 on full parity, 1 on any parity or schema failure, and 2 on a usage or runtime error.

### Audit-Mode Wiring (Additive)

The registry, the card, and the validator are discoverable from the audit mode. `design-audit/SKILL.md` gains a resource-map description block plus a `RESOURCE_MAP` entry under the anti-patterns intent so the registry and card load alongside the prose catalog. `design-audit/references/ai_fingerprint_tells.md` gains a single additive cross-link to the structured mirror. No existing prose line was removed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/design-audit/assets/ai_fingerprint_registry.json` | Created | Nine-row per-model AI-tell registry with the seven-field schema |
| `.opencode/skills/sk-design/design-audit/assets/ai_fingerprint_self_defect_card.md` | Created | Generated self-defect card, one self-audit prompt per registry row |
| `.opencode/skills/sk-design/shared/scripts/ai-fingerprint-registry-check.mjs` | Created | Deterministic catalog-to-registry parity and schema validator |
| `.opencode/skills/sk-design/design-audit/SKILL.md` | Modified | Additive resource-map row plus RESOURCE_MAP entry for the registry and card |
| `.opencode/skills/sk-design/design-audit/references/ai_fingerprint_tells.md` | Modified | Additive cross-link to the structured registry mirror |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 xhigh fast) authored the three new files and made the two additive edits, seeding every registry row from the live catalog rather than inventing tells. The orchestrator then verified acceptance independently, reading exit codes without pipe-masking. The full registry passes at exit 0 with the validator printing `catalogTells=9 registryRows=9`, confirming the nine-to-nine parity. A scratch registry with one row removed, passed through `--registry`, fails at exit 1 and names the orphaned catalog tell (`catalog tell uniform-section-fade-and-rise: missing registry row`), proving the validator bites rather than rubber-stamping. `node --check` on the validator is clean, the registry JSON parses to nine rows, and both new files plus the two edits were grepped for spec, packet, and phase identifiers to keep them evergreen. Scope was confirmed clean: no fixture files were created here, since phase 004 owns the fixture corpus that the `fixture_id` column references.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Registry mirrors the catalog instead of replacing it | The prose catalog stays the human-readable layer; the registry adds a machine-checkable layer without forcing reviewers to abandon the catalog they already read |
| Parity is enforced now; per-tell detection waits on phase 004 fixtures | Parity and schema completeness need only the catalog and the registry, so they ship today; running a tell against real output needs the fixture corpus, which 004 owns |
| `fixture_id` names the fixture by stable slug before the corpus exists | Writing the forward dependency into the data keeps it explicit and grep-checkable rather than hiding it in prose |
| Validator enforces reverse parity (no orphan rows), not just forward parity | A row with no catalog tell is as much a drift signal as a tell with no row, so both directions fail the gate |
| Validator modeled on `design-command-surface-check.mjs` | Reuses the existing shared-validator convention and Node ESM runtime with no new dependency |
| Wiring edits are additive-only | The prose catalog and existing assets keep their content; discovery is added through one resource-map block and one cross-link, reversible by deletion |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node ai-fingerprint-registry-check.mjs` on the full registry | PASS, exit 0, "PASS ai-fingerprint-registry-check: catalogTells=9 registryRows=9" |
| Negative case: scratch registry with one row removed via `--registry` | FAIL, exit 1, "catalog tell uniform-section-fade-and-rise: missing registry row" |
| `node --check ai-fingerprint-registry-check.mjs` | PASS, syntax OK |
| Registry JSON parse + row count | PASS, parses to 9 rows |
| Parity count | 9 catalog tells = 9 registry rows |
| Catalog tell inventory | 9 H3 tells under CODEX / GEMINI / 2026-GENERAL TELLS sections |
| Self-defect card prompt count | 9 prompts, one per registry row |
| Evergreen audit | Stable tell slugs and skill-relative paths only; no spec or packet IDs in the three new files or the two edits |
| Scope audit | 3 new files + 2 additive edits; no fixture files created (phase 004 owns those); 0 removed prose lines |
| `validate.sh <folder> --strict` | Spec-doc rules clean; only the expected generated-metadata fingerprint residual remains for orchestrator regeneration |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Parity and completeness, not live detection.** The validator proves every catalog tell has a complete, well-formed registry row and that no row is orphaned. It does not yet run a tell against real design output; that becomes possible once phase 004 lands the fixtures named in the `fixture_id` column.
2. **The card is advisory.** Whether a model internalizes a self-defect prompt stays a judgment call. The card standardizes the prompts; it cannot enforce that they were applied.
3. **`fixture_id` targets do not resolve yet.** The validator checks that each `fixture_id` is present and slug-shaped, not that the fixture file exists. File resolution is deferred to the phase 004 fixture corpus.
4. **Generated metadata regenerates downstream.** `description.json` still reads Level 1 and `graph-metadata.json` carries a stale source fingerprint; the orchestrator regenerates both. They are not hand-written here.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
