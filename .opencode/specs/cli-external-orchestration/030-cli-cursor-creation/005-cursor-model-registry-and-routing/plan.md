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
    recent_action: "All 3 phases complete; sync gate GUARD PASS"
    next_safe_action: "Write implementation-summary.md, run validate.sh --strict, commit"
    blockers: []
    key_files: ["spec.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 95
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
- [x] No fabricated Composer spec: context window / pricing are TBD; version slug (`composer-2.5`/`composer-2.5-fast`) is live-confirmed, not TBD.
- [x] The Composer profile matches the structural shape of the existing `references/models/*.md`.
- [x] `check-prompt-quality-card-sync.sh` passes with `cli-cursor` in its coverage arrays.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
`sk-prompt/prompt-models` owns per-model prompt-craft profiles (`references/models/*.md` + `assets/model-profiles.json`). Composer joins as a new Cursor-exclusive model profile; the hosted frontier models Cursor drives keep their provider-native profiles and gain only an executor-row note. `check-prompt-quality-card-sync.sh` (in `system-skill-advisor/mcp-server/scripts/`) keeps each executor's `prompt-quality-card.md` in sync with the canonical card and learns about `cli-cursor`.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `references/models/composer-2.5.md` | (new) Composer profile | Create | Structure matches siblings |
| `references/models/_index.md` | Model index | Update | Composer listed |
| `assets/model-profiles.json` | Model registry | Update | Composer entry + cli-cursor driving executor |
| `check-prompt-quality-card-sync.sh` | Card sync CI gate | Update | Gate passes with cli-cursor covered |
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read `references/models/glm-5.2.md` then `references/models/deepseek-v4-pro.md` (unbenchmarked-model precedent) as the structural template.
- [x] Resolved the open question: Composer-only.

### Phase 2: Core Implementation
- [x] Authored `references/models/composer-2.5.md` (filename matches registry `id`) with unexposed fields as TBD.
- [x] Added Composer to `_index.md` and a Composer entry to `assets/model-profiles.json` with `cli-cursor` as the driving executor.
- [x] Added `cli-cursor` to all 3 `check-prompt-quality-card-sync.sh` coverage points.

### Phase 3: Verification
- [x] Ran `check-prompt-quality-card-sync.sh`; `GUARD PASS` with `cli-cursor` covered.
- [x] Confirmed no fabricated numeric spec landed (`grep -n -i "TBD\|unconfirmed" composer-2.5.md` → 4 hits).
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Run `check-prompt-quality-card-sync.sh` as the primary gate — `GUARD PASS`. Structurally diffed `composer-2.5.md` against `deepseek-v4-pro.md` to confirm section parity (8 sections each). Grepped the Composer profile to confirm unexposed fields carry a TBD marker rather than a concrete number (4 hits, 0 fabricated). This phase's own `validate.sh --strict` must pass 0/0.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Phase 003 (skill packet) | Internal | Green (committed `11024cc893`) | `cli-cursor/assets/prompt-quality-card.md` must exist for the sync gate to check |
| `cursor-agent login` (auth) | External | Green — operator completed login | Version slug now live-confirmed; context window/pricing stay TBD (CLI never exposed them, even authenticated) |
| `sk-prompt/prompt-models` structure | Internal | Green (live) | Wrong profile shape if not mirrored |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Delete `references/models/composer-2.5.md`; revert the `_index.md`, `model-profiles.json`, and `check-prompt-quality-card-sync.sh` edits via `git checkout` of those paths. No runtime code is touched.
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
