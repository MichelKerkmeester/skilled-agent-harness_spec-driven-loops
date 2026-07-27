---
title: "Implementation Plan: Pi docs, agents, governance, and closeout"
description: "Plan for adding cli-pi mentions across rosters/governance/hub docs (fresh current-tree touch-list) and running the terminal recursive closeout validation across the whole 031-cli-pi-creation packet."
trigger_phrases:
  - "cli-pi closeout plan"
  - "pi governance plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/011-docs-agents-governance-and-closeout"
    last_updated_at: "2026-07-27T05:34:01Z"
    last_updated_by: "claude-code"
    recent_action: "Authored plan.md: touch-list, devin-backfill decision, closeout validation"
    next_safe_action: "Wait for phases 001-010, then execute Phase 2 Implementation below in order"
    blockers: ["Phases 001-010 must land before this phase's edits describe real, shipped capabilities."]
    key_files: [".opencode/skills/cli-external-orchestration/README.md", "README.md", ".opencode/skills/README.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Pi docs, agents, governance, and closeout

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
| **Language/Stack** | Markdown (agent rosters, governance docs, hub README/SKILL.md) -- no application code |
| **Framework** | None -- prose/roster addition, not application code |
| **Storage** | None |
| **Testing** | `validate.sh --recursive --strict`, `parent-skill-check.cjs`, `rg` grep verification (no unit-test framework; this phase is docs-only) |

### Overview
Grep the current tree for every roster/governance/hub-doc surface that enumerates the 5 sibling CLI executors, add a symmetric `cli-pi` entry to each in that surface's existing phrasing pattern, explicitly record the resolution of 3 pre-existing sibling-symmetry gaps discovered during planning (hub README.md, root README.md, skills-catalog README.md all under-report the current 5-sibling set), then close with the terminal whole-packet `validate.sh --recursive --strict` and `parent-skill-check.cjs` runs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 001-010 confirmed landed (each phase's `implementation-summary.md` present and its own `validate.sh --strict` passing).
- [ ] Current-tree touch points re-confirmed via `rg`/`ls` immediately before editing (tree may have moved since this planning pass).
- [ ] The devin-backfill decision (Open Question in `spec.md`) is made explicitly, not deferred silently into the edits.

### Definition of Done
- [ ] Every identified surface shows a symmetric `cli-pi` mention matching that surface's existing phrasing pattern.
- [ ] The 2 regression-guard surfaces (`ADVISOR_RUNTIME_VALUES`, `post-implementation-deep-review.md`) show zero diff.
- [ ] `validate.sh --recursive --strict` and `parent-skill-check.cjs` both exit 0.
- [ ] `deep-improvement.md`'s pi-benchmark claim (if made) matches the live `dispatch-model.cjs` state.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Docs/governance addition against a live, already-uneven tree -- not a code architecture pattern. The "architecture" is the touch-point map across 3 symmetry tiers this planning pass confirmed: a **5-of-5 tier** (hub `SKILL.md` -- correctly enumerates all siblings, not edited here, phase 003's job), a **4-of-5 tier** (hub `README.md`, root `README.md` CROSS-AI section -- missing `cli-devin`), and a **2-of-5 tier** (root skills-catalog table row, `.opencode/skills/README.md` catalog row -- only `cli-opencode` + `cli-claude-code`).

### Key Components
- **Hub-level docs**: `.opencode/skills/cli-external-orchestration/README.md` -- frontmatter, tagline, AT A GLANCE, OVERVIEW, QUICK START; confirmed live at the 4-of-5 tier.
- **Root governance/catalog**: `README.md` (CROSS-AI CLI section at the 4-of-5 tier; skills-catalog table row at the 2-of-5 tier), `.opencode/skills/README.md` (catalog row at the 2-of-5 tier).
- **Conditional agent-roster surface**: `deep-improvement.md` (+ `.claude` mirror) Lane-B paragraph -- gated on live confirmation that `dispatch-model.cjs` actually supports `cli-pi`.
- **Regression guards**: `ADVISOR_RUNTIME_VALUES` (system-skill-advisor) and `post-implementation-deep-review.md` (system-spec-kit) -- explicitly left untouched, verified by empty diff.
- **Closeout validation**: `validate.sh --recursive --strict`, `parent-skill-check.cjs`.

### Data Flow
No runtime data flow -- the "flow" is documentary: live-tree grep (ground truth, re-run at implementation time) -> a per-surface symmetric `cli-pi` entry matching that surface's existing tier -> an explicit devin-backfill decision recorded in `tasks.md` -> whole-packet validation (proof).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Hub `README.md` | 4-of-5 sibling enumeration + hub tagline/version | Add `cli-pi`; resolve devin-backfill decision | Grep sweep + recorded decision |
| Root `README.md` (CROSS-AI section) | 4-of-5 sibling enumeration | Add `cli-pi`; resolve devin-backfill decision | Grep sweep + recorded decision |
| Root `README.md` (skills-catalog table row) | 2-of-5 sibling enumeration (stale) | Add `cli-pi` at minimum; decide whether to backfill to full parity | Grep sweep + recorded decision |
| `.opencode/skills/README.md` (catalog row) | 2-of-5 sibling enumeration (stale) | Add `cli-pi` at minimum; decide whether to backfill to full parity | Grep sweep + recorded decision |
| `deep-improvement.md` (+ `.claude` mirror) | Lane-B model-benchmark dispatch executor list, currently bare "cursor", no devin | Add `pi` ONLY if `dispatch-model.cjs` confirms support | Cross-check against phase 002/009 evidence before editing |
| `executor-config.vitest.ts`, `executor-audit.vitest.ts` | Phase 002's typed executor tests | Cross-check only, no primary edit here | Manual review confirms no stale-union assertion remains |
| `ADVISOR_RUNTIME_VALUES`, `post-implementation-deep-review.md` | Regression guards (D5/D4 precedent) | Unchanged | `git diff` empty |
| Whole packet `031-cli-pi-creation` | Spec docs | Validate | `validate.sh --recursive --strict` returns `Errors: 0` |
| `cli-external-orchestration` hub | Skill package | Validate | `parent-skill-check.cjs` 0 fails |

Required inventories:
- Same-class producers: `rg -n "cli-cursor|cli-devin" .opencode/skills/cli-external-orchestration/README.md README.md .opencode/skills/README.md` as the structural map for exactly where pi's equivalent addition should land, and at what existing symmetry tier.
- Consumers of the added fact "cli-pi exists": the 4 identified doc surfaces (hub README, root README x2 locations, skills-catalog README) plus the conditional `deep-improvement.md` pair -- 6 independent consumer surfaces, all inventoried in the Files-to-Change table in `spec.md`.
- Matrix axes: {surface tier (5-of-5 / 4-of-5 / 2-of-5)} x {devin-backfill decision: yes/no} determines the exact resulting sibling count per surface after the pi edit -- this must be verified per surface, not assumed uniform.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phases 001-010 have landed (review each phase's `implementation-summary.md`).
- [ ] Re-run `rg -l 'cli-opencode|cli-claude-code|cli-codex|cli-cursor|cli-devin'` over rosters/governance/hub-doc trees to reconfirm the touch-list and each surface's current symmetry tier.
- [ ] Decide the devin-backfill question (Open Question in `spec.md`): opportunistic backfill vs. strict pi-only scope-lock. Record the decision.
- [ ] Cross-check `dispatch-model.cjs`'s `KNOWN_EXECUTORS` and phase 002/009's `implementation-summary.md` to determine whether `deep-improvement.md` may claim pi as benchmarkable.

### Phase 2: Core Implementation
- [ ] Add `cli-pi` to the hub's own `README.md` (frontmatter, tagline, AT A GLANCE, OVERVIEW, QUICK START), applying the devin-backfill decision from Phase 1.
- [ ] Add `cli-pi` to root `README.md`'s CROSS-AI CLI section and skills-catalog table row, applying the same decision.
- [ ] Add `cli-pi` to `.opencode/skills/README.md`'s catalog row, applying the same decision.
- [ ] Conditionally add `pi` to `deep-improvement.md` + `.claude` mirror's Lane-B paragraph, only if Phase 1's cross-check confirmed live support.
- [ ] Reconcile completion metadata across all 11 phases.

### Phase 3: Verification
- [ ] Cross-check `executor-config.vitest.ts` and `executor-audit.vitest.ts` assert `cli-pi`'s presence, not a stale union.
- [ ] Confirm zero diff on the 2 regression-guard surfaces (`ADVISOR_RUNTIME_VALUES`, `post-implementation-deep-review.md`).
- [ ] Run `validate.sh --recursive --strict` on the whole packet and `parent-skill-check.cjs` against the hub.
- [ ] Grep sweep: confirm `cli-pi` present wherever the recorded devin-backfill decision says it should be, per surface.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep verification | `cli-pi` present in every target surface, at the tier the devin-backfill decision specifies | `rg -n` |
| Regression-guard verification | 2 excluded surfaces show zero diff | `git diff` |
| Whole-packet structural validation | All 11 phases + parent validate cleanly together | `validate.sh --recursive --strict` |
| Hub conformance | `cli-external-orchestration` hub stays canon-conformant | `parent-skill-check.cjs` |
| Cross-check (read-only) | Deep-loop executor tests assert `cli-pi` presence | Manual review of `executor-config.vitest.ts`, `executor-audit.vitest.ts` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001-010 | Internal (this packet) | Planned (not yet built as of this authoring pass) | Documenting docs before capabilities exist would describe an unshipped system; this phase must wait |
| `validate.sh`, `parent-skill-check.cjs` | Internal (system-spec-kit, doctor tooling) | Green (confirmed present at `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` and `.opencode/commands/doctor/scripts/parent-skill-check.cjs`) | Whole-packet closeout proof unavailable |
| Clean tree on governance/hub docs | External | Unverified at planning time; must recheck via `git status` before each edit | Risk of editing a concurrently-dirty file (this session already observed the phase folder itself get wiped mid-session by a concurrent process -- see plan's rollback note) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any of the identified restoration points lands against a drifted/incorrect path, or a regression-guard surface (`ADVISOR_RUNTIME_VALUES`, `post-implementation-deep-review.md`) is accidentally modified, or the devin-backfill edit accidentally lands on a surface where it wasn't the recorded decision.
- **Procedure**: `git diff` the specific file, revert only that file's hunk (`git checkout -- <path>` for an unstaged change, or a targeted `git revert` if already committed), then re-verify against the current-tree grep before re-attempting the edit.
<!-- /ANCHOR:rollback -->

---

## L2: PHASE DEPENDENCIES
Runs last; depends on phases 001-010 for the surfaces it references. Within this phase, Setup precedes Implementation, and Implementation precedes Verification -- the closeout validation is only meaningful once every restoration point in Implementation is in place.

## L2: EFFORT ESTIMATION
| Phase | Complexity | Estimated Effort |
|---|---|---|
| Setup (grep touch-list + devin-backfill decision) | Low-Medium | 30-45 min (the decision itself needs a deliberate call, not just a grep) |
| Core implementation | Medium | 1-2 hours (several small symmetric edits across 4-6 files, gated by the conditional Lane-B edit) |
| Verification | Low | 30-45 min (2 validators + manual test-file review + grep sweep) |

## L2: ENHANCED ROLLBACK
### Pre-deployment Checklist
- [ ] No data migration involved (docs-only phase).
- [ ] Current-tree grep re-run immediately before editing (tree may have moved since this planning pass -- this session directly observed the whole 031-cli-pi-creation packet's scaffold files vanish mid-session, replaced by an empty `.backup-*` directory, evidence that concurrent packet-wide scaffolding activity is a real, not theoretical, risk for this packet).
- [ ] Devin-backfill decision recorded before any edit that touches a 4-of-5 or 2-of-5 tier surface.

### Rollback Procedure
1. Identify the specific file(s) whose restoration went wrong via `git diff`.
2. Revert only those files (`git checkout -- <path>` unstaged, or a targeted `git revert` post-commit).
3. Re-run the current-tree grep to re-confirm the correct insertion point and tier.
4. Re-apply the restoration and re-run the affected verification command.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A -- plain file reverts as described above.

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md` (this phase)
- `../../029-cli-devin-revival/007-docs-agents-governance-and-closeout/plan.md`, `../../030-cli-cursor-creation/007-docs-agents-governance-and-closeout/plan.md` (sibling closeout precedents)
