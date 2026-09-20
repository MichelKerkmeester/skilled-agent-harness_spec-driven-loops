---
title: "Implementation Summary: Phase 1 — author per-mode providers-and-models references"
description: "Each of the six cli modes now has a dedicated references/providers-and-models.md catalog listing its providers, models, effort tiers, and dispatch shapes."
trigger_phrases:
  - "cli providers and models reference"
  - "per-mode provider model catalog"
  - "providers-and-models.md authored"
  - "cli mode model roster reference"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-per-mode-provider-model-reference/001-author-per-mode-references"
    last_updated_at: "2026-08-11T07:16:29.084Z"
    last_updated_by: "implementer"
    recent_action: "Authored six per-mode providers-and-models.md catalogs"
    next_safe_action: "Register the new leaves and wire pointers (phase 002)"
    blockers: []
    key_files:
      - "cli-opencode/references/providers-and-models.md"
      - "cli-codex/references/providers-and-models.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-033-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-author-per-mode-references |
| **Completed** | 2026-07-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every one of the six cli modes now has a single dedicated file that answers "which providers, which models, which effort tiers, how to dispatch." Before this, that knowledge was scattered across each mode's SKILL.md roster, its cli-reference.md model section, and prompt-template pins.

### Per-mode providers-and-models.md catalogs

Each mode gained `references/providers-and-models.md` with a uniform 7-section shape (Overview, Providers & Models, Defaults & Quick Invocation, Reasoning-Effort/Thinking Lever, How to Invoke, Enforcement & Profiles, Related). cli-opencode is the multi-provider master (deepseek default, plus kimi/glm/minimax/xiaomi/OpenAI GPT-5.6). The single-provider modes each carry their own family: cli-codex (GPT-5.5/5.6 + `-c model_reasoning_effort=` ladder), cli-claude-code (Anthropic ids + `--effort`), cli-cursor (Composer + the enforced 10-id allowlist mirrored with an enforcement link), cli-devin (adaptive + sub-model roster), cli-pi (multi-provider passthrough + `--thinking`, no fixed default).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `cli-opencode/references/providers-and-models.md` | Created | Multi-provider master catalog |
| `cli-claude-code/references/providers-and-models.md` | Created | Anthropic catalog + `--effort` |
| `cli-codex/references/providers-and-models.md` | Created | GPT-5.5/5.6 + effort ladder |
| `cli-cursor/references/providers-and-models.md` | Created | Composer + 10-id allowlist (enforcement-linked) |
| `cli-devin/references/providers-and-models.md` | Created | adaptive + sub-model roster |
| `cli-pi/references/providers-and-models.md` | Created | Passthrough roster + `--thinking` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The cli-opencode catalog was authored first as a golden exemplar from its cli-reference.md source, then five parallel agents authored the remaining modes from that exemplar, each reading its own mode's cli-reference.md for exact model ids. Every file was verified for frontmatter, section structure, and link resolution.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One file per mode, uniform 7-section shape | Consistency across modes and native advisor-routability (each is a real leaf in its own references/) |
| Link out to enforcement code and prompt-craft profiles, never copy | Keeps the catalog a convenience index, not a second source of truth that would drift from `executor-config.ts` / `model-profiles.json` |
| Keep cursor's 10-id allowlist inline (mirrored) | Dispatching an off-list id hard-fails via `CURSOR_SUPPORTED_MODELS`; the safety contract must be readable inline |
| No fabricated default for cli-pi | Pi is a passthrough with provider `google` and no fixed default model |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| All six files exist with valid 6-field frontmatter | PASS |
| Uniform 7-section structure across all six | PASS |
| trigger_phrases in 3-8 range | PASS (5-6 each) |
| Relative `.md` links resolve on disk | PASS |
| External authority paths resolve (`model-profiles.json`, `fanout-run.cjs`, `executor-config.ts`) | PASS (stray `dispatch-model.cjs` mention removed) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live model ids drift.** The catalogs are a convenience index; each mode's own probe (`opencode models <provider>`, `cursor-agent --list-models`, etc.) remains the live source of truth, as each file states.
<!-- /ANCHOR:limitations -->
