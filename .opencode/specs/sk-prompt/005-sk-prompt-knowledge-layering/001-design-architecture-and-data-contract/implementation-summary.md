---
title: "Implementation Summary: Design — 3-layer prompt-knowledge architecture + data contract"
description: "Phase 001 ratified Architecture A and locked three contracts (recommended_frameworks schema, per-model profile template, prompt-composition precedence rule) as the frozen design target for phases 002-008."
trigger_phrases:
  - "prompt knowledge architecture decision"
  - "recommended_frameworks schema"
  - "per-model profile template"
  - "prompt precedence rule"
  - "model-craft hub design"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/005-sk-prompt-knowledge-layering/001-design-architecture-and-data-contract"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "opus-orchestrator"
    recent_action: "Design ratified"
    next_safe_action: "Implement phases 002 and 003 against locked contracts"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/assets/model-profiles.json"
      - ".opencode/skills/sk-prompt-models/SKILL.md"
      - ".opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-130-001-design"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Prose home -> Architecture A (sk-prompt-models/references/models/)"
      - "Model scope -> all active small models at equal depth"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-design-architecture-and-data-contract |
| **Completed** | 2026-06-02 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 001 delivered the ratified Architecture A decision plus three locked contracts — the `recommended_frameworks` JSON schema, the 6-section per-model profile template, and the 3-tier prompt-composition precedence rule — recorded in spec.md sections 8-11. These contracts give phases 002-008 a frozen design target so implementation can proceed without relitigating the architecture.

### Architecture A Decision

Architecture A designates `sk-prompt-models` as the per-model prompt-craft content hub. The three-layer split assigns framework craft (model-agnostic) to `sk-prompt`, per-model craft prose to `sk-prompt-models/references/models/<id>.md`, and executor mechanics to `cli-*` skills. This split is fork-proof for models dispatchable from two executors, and matches the existing "canonical home for model specifics" language in CLAUDE.md.

### Three Locked Contracts

The `recommended_frameworks` schema (§9) is an additive optional object in `model-profiles.json`, with `primary`, `fallback`, `avoid`, `preplanning_density`, `evidence`, `profile_ref`, and `status` fields. The round-trip seam — `profile_ref` pointing to a `references/models/<id>.md` whose front-matter carries a matching `model_id` — is CI-checkable with `jq` + `test -f`.

The per-model profile template (§10) defines a fixed 6-section body: Identity, Recommended Framework, Benchmark Evidence, Tuned Template Snippet, Dispatch Gotchas, and See Also. The front-matter carries `model_id`, `profile_of`, `status`, and `last_benchmarked`.

The precedence rule (§11) replaces contradictory delegation rules across cli-X SKILL.md files with one 3-tier hierarchy: fast path (canonical quality card) → model override (honor `recommended_frameworks` / profile when present) → deep path (dispatch `@prompt-improver`).

### Files Changed

<!-- Include for Level 1-2. Omit for Level 3/3+ where the narrative carries. -->

| File | Action | Purpose |
|------|--------|---------|
| spec.md | Authored | Records ratified Architecture A and the three locked contracts (§8-§11) |
| plan.md | Authored | Design method and contract handoff to phases 002-008 |
| tasks.md | Authored | Task list for the three design phases; all tasks closed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Design-only phase; no production skill files changed. The contracts were authored directly in spec.md §8-§11 after a codebase audit, two opposing architect lenses, a sequential-thinking synthesis, and the user's two locked decisions (Architecture A; all active small models at equal depth). Delivery was verified by running `validate.sh --strict` on this folder.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Architecture A over B and C | Fork-proof split for dual-executor models; matches CLAUDE.md language; keeps `model-profiles.json` DATA in `sk-prompt` to avoid breaking backlinks |
| `recommended_frameworks` stays additive | Readers without the field keep working; no breaking schema change |
| Single precedence rule replaces per-cli mandates | Eliminates the cli-devin-mandate vs @prompt-improver-escalation contradiction without changing executor mechanics |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| validate.sh --strict on this spec folder | PASS |
| Contracts self-contained (downstream phases need only §8-§11) | PASS — confirmed by design review |
| No production files modified | PASS — design-only phase |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Models without direct benchmark evidence** (qwen3.6, deepseek-v4-pro, kimi-k2.6, glm-5.1) will carry `status: default-unverified` in `recommended_frameworks` until phase 003 populates the data.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
