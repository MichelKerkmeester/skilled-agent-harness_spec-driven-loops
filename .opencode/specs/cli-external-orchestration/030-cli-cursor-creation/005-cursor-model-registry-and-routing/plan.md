---
title: "Implementation Plan: Cursor model registry and routing"
description: "Plan for adding a Composer profile and cli-cursor executor rows to sk-prompt/prompt-models and wiring the prompt-quality-card CI sync gate."
trigger_phrases: ["cli-cursor model registry plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/005-cursor-model-registry-and-routing"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "Authored plan.md for phase 005"
    next_safe_action: "Author tasks.md, checklist.md"
    blockers: ["Composer's exact specs auth-gated until cursor-agent login"]
    key_files: ["spec.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Cursor model registry and routing

<!-- ANCHOR:summary -->
## 1. SUMMARY
Add a Composer (Cursor-native) prompt-craft profile to `sk-prompt/prompt-models` mirroring the existing per-model profiles, record `cli-cursor` as a driving executor, and add `cli-cursor` to the `check-prompt-quality-card-sync.sh` CI gate — grounded in phase 001's confirmed facts, with every auth-gated numeric field left as an explicit TBD.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- [ ] No fabricated Composer spec: context window / pricing / version slug are TBD with a verify-at-impl-time note.
- [ ] The Composer profile matches the structural shape of the existing `references/models/*.md`.
- [ ] `check-prompt-quality-card-sync.sh` passes with `cli-cursor` in its coverage arrays.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
`sk-prompt/prompt-models` owns per-model prompt-craft profiles (`references/models/*.md` + `assets/model-profiles.json`). Composer joins as a new Cursor-exclusive model profile; the hosted frontier models Cursor drives keep their provider-native profiles and gain only an executor-row note. `check-prompt-quality-card-sync.sh` (in `system-skill-advisor/mcp-server/scripts/`) keeps each executor's `prompt-quality-card.md` in sync with the canonical card and learns about `cli-cursor`.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `references/models/composer.md` | (new) Composer profile | Create | Structure matches siblings |
| `references/models/_index.md` | Model index | Update | Composer listed |
| `assets/model-profiles.json` | Model registry | Update | Composer entry + cli-cursor driving executor |
| `check-prompt-quality-card-sync.sh` | Card sync CI gate | Update | Gate passes with cli-cursor covered |
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read an existing profile (`references/models/glm-5.2.md`) as the structural template.
- [ ] Resolve the open question: Composer-only vs. executor rows on every hosted frontier model.

### Phase 2: Core Implementation
- [ ] Author `references/models/composer.md` with auth-gated fields as TBD.
- [ ] Add Composer to `_index.md` and a Composer entry to `assets/model-profiles.json` with `cli-cursor` as a driving executor.
- [ ] Add `cli-cursor` to the `check-prompt-quality-card-sync.sh` coverage arrays.

### Phase 3: Verification
- [ ] Run `check-prompt-quality-card-sync.sh`; confirm it passes with `cli-cursor` covered.
- [ ] Confirm no fabricated numeric spec landed (grep the profile for TBD markers on auth-gated fields).
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Run `check-prompt-quality-card-sync.sh` as the primary gate. Structurally diff `composer.md` against a sibling profile to confirm section parity. Grep the Composer profile to confirm auth-gated fields carry a TBD marker rather than a concrete number. This phase's own `validate.sh --strict` must pass 0/0.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Phase 003 (skill packet) | Internal | Planned | `cli-cursor/assets/prompt-quality-card.md` must exist for the sync gate to check |
| `cursor-agent login` (auth) | External | Red — operator-only | Composer's exact specs stay TBD until authenticated |
| `sk-prompt/prompt-models` structure | Internal | Green (live) | Wrong profile shape if not mirrored |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Delete `references/models/composer.md`; revert the `_index.md`, `model-profiles.json`, and `check-prompt-quality-card-sync.sh` edits via `git checkout` of those paths. No runtime code is touched.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
Loosely follows phase 004; needs phase 003's card to exist for the sync gate to go green.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
| Phase | Complexity | Estimated Effort |
|---|---|---|
| Setup | Low | 15 min |
| Core implementation | Low | 1-2 hours (1 profile + 3 edits) |
| Verification | Low | 15 min (run the sync gate) |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK
Additive, low-blast: one new profile + three small registry/CI edits, fully reversible via `git checkout`. No data migration.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md`
- `../001-cursor-contract-pin/implementation-summary.md`
- `../../029-cli-devin-revival/005-devin-model-registry-and-quota/plan.md` (structural precedent)
