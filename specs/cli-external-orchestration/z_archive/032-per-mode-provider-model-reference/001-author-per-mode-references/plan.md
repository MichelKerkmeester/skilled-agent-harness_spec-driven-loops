---
title: "Implementation Plan: Phase 1 — author per-mode providers-and-models references"
description: "Author one dedicated references/providers-and-models.md per cli mode, sourced from each mode's cli-reference.md, linking (not copying) external enforcement code and prompt-craft profiles."
trigger_phrases:
  - "author per-mode provider model references plan"
  - "providers-and-models.md authoring plan"
  - "cli reference catalog plan"
  - "per-mode model catalog approach"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-per-mode-provider-model-reference/001-author-per-mode-references"
    last_updated_at: "2026-07-29T09:18:33Z"
    last_updated_by: "implementer"
    recent_action: "Authored six per-mode providers-and-models.md catalogs"
    next_safe_action: "Register the new leaves and wire pointers (phase 002)"
    blockers: []
    key_files:
      - "cli-opencode/references/providers-and-models.md"
      - "cli-codex/references/providers-and-models.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-033-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1 — author per-mode providers-and-models references

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference docs (spec-kit) |
| **Framework** | sk-doc reference-file template (`skill-reference-template.md`) |
| **Storage** | Filesystem — six new `references/providers-and-models.md` files |
| **Testing** | `validate.sh --strict` + frontmatter/section/link checks |

### Overview
Give every cli mode a single dedicated catalog that answers "which providers, which models, which effort tiers, how to dispatch." One `references/providers-and-models.md` per mode is authored directly from that mode's existing `cli-reference.md` roster; external enforcement code and prompt-craft profiles are linked by path, never copied, so the catalog stays a convenience index rather than a second source of truth.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation decomposition — one advisor-routable catalog leaf per mode, uniform 7-section shape (Overview, Providers & Models, Defaults & Quick Invocation, Reasoning-Effort/Thinking Lever, How to Invoke, Enforcement & Profiles, Related).

### Key Components
- **Golden exemplar (`cli-opencode`)**: multi-provider master catalog authored first to fix the shape and link style.
- **Five per-mode catalogs**: cli-claude-code, cli-codex, cli-cursor, cli-devin, cli-pi authored from the exemplar, each read from its own `cli-reference.md`.

### Data Flow
Each mode's `cli-reference.md` roster + `SKILL.md` roster (source of truth) → the new `providers-and-models.md`; external authorities (`model-profiles.json`, `executor-config.ts`, `fanout-run.cjs`) referenced by path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Purely additive phase — no existing producer/consumer behavior changes, so no fix-surface inventory applies. The only touched surface is the six new files themselves.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Six new `references/providers-and-models.md` | New catalog docs (no prior consumer) | create | `validate.sh --strict` + on-disk link resolution |
| Existing `cli-reference.md` / `SKILL.md` rosters | Source of truth for enumeration | unchanged (read-only source) | trim deferred to phase 003 |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the reference-file template
- [x] Read each mode's `cli-reference.md` model section + `SKILL.md` roster for exact model ids
- [x] Confirm external authority paths resolve on disk

### Phase 2: Core Implementation
- [x] Author `cli-opencode/references/providers-and-models.md` as the golden exemplar
- [x] Author the five single-provider catalogs from the exemplar (claude-code, codex, cursor, devin, pi)
- [x] Mirror cursor's enforced 10-id allowlist inline with an enforcement pointer; keep pi passthrough with no fabricated default

### Phase 3: Verification
- [x] Verify 5-field frontmatter + uniform 7-section structure on all six
- [x] Verify relative `.md` links and external authority paths resolve
- [x] `validate.sh 001-author-per-mode-references --strict` — Errors: 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | Frontmatter fields + 7-section shape ×6 | manual review |
| Link | Relative `.md` + external authority paths resolve | on-disk check |
| Spec | Level-1 conformance | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Reference-file template (`skill-reference-template.md`) | Internal | Green | No shape to author against |
| Per-mode `cli-reference.md` sources | Internal | Green | Cannot enumerate accurate model ids |
| External authorities (`model-profiles.json`, `executor-config.ts`, `fanout-run.cjs`) | Internal | Green | Links would not resolve |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Catalogs found inaccurate or unwanted before wiring (phase 002).
- **Procedure**: Delete the six new `providers-and-models.md` files. The phase is purely additive — nothing else references them yet, so removal restores the prior state with zero side effects.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
