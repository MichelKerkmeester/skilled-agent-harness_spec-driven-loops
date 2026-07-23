---
title: "Implementation Plan: Devin model registry and quota restoration"
description: "Plan for restoring the swe-1.6 registry entry, 3 sibling cli-devin executor rows, the swe-1.6.md model card, and the check-prompt-quality-card-sync.sh CI gate arrays, including a newly-identified CLI_EXECUTOR_HUB_METADATA dependency the restored rows will exercise."
trigger_phrases: ["devin model registry plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/005-devin-model-registry-and-quota"
    last_updated_at: "2026-07-23T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the implementation plan for this Planned phase"
    next_safe_action: "Confirm the phase 003 predecessor precondition, then execute Phase 1 (Setup) of tasks.md."
    blockers: ["Depends on phase 003 having registered cli-devin's trigger_phrases in the hub's shared graph-metadata.json."]
    key_files: ["sk-prompt/prompt-models/assets/model-profiles.json", "sk-prompt/prompt-models/references/models/swe-1.6.md", "system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Devin model registry and quota restoration

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON (`model-profiles.json`) + Markdown (`swe-1.6.md`) + Bash (`check-prompt-quality-card-sync.sh`) |
| **Framework** | sk-prompt `prompt-models` registry + system-skill-advisor CI gate |
| **Storage** | Flat-file JSON/Markdown/Bash under `.opencode/skills/` (no database) |
| **Testing** | `check-prompt-quality-card-sync.sh` (4 static checks) + `validate.sh --strict` |

### Overview
Restore the `swe-1.6` model entry and 3 sibling `cli-devin` executor rows in `model-profiles.json` against current model slugs, recreate `swe-1.6.md`, and restore + extend `check-prompt-quality-card-sync.sh`'s `cli_cards[]`/`cli_skills[]` arrays and its `CLI_EXECUTOR_HUB_METADATA` map so CHECK 4 correctly resolves `cli-devin` through the shared hub identity instead of a nonexistent per-skill file.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 001's live Devin CLI contract facts (model roster, tiers) are available as citable evidence.
- [x] Current `model-profiles.json` state confirmed (6 entries, `swe-1.6` absent, all executors `cli-opencode`/`cli-claude-code`) - confirmed this authoring session.
- [x] Current `check-prompt-quality-card-sync.sh` state confirmed (2-entry `cli_cards`/`cli_skills` arrays; `CLI_EXECUTOR_HUB_METADATA` missing both `cli-devin` and `cli-codex`) - confirmed this authoring session.

### Definition of Done
- [ ] All 5 P0 requirements (REQ-001 through REQ-005) met with evidence.
- [ ] `check-prompt-quality-card-sync.sh` exits 0.
- [ ] `validate.sh --strict` Errors: 0 for this phase folder.
- [ ] `implementation-summary.md` written with evidence for every REQ in `spec.md`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Data restoration + CI-gate extension. No runtime code changes.

### Key Components
- **`model-profiles.json`**: adds `swe-1.6` (Devin-exclusive, non-"adopted" shape mirroring `haiku`) and 3 new `cli-devin` executor rows on already-adopted models.
- **`swe-1.6.md`**: the model-card consumer of the registry entry, parallel to `kimi-k2.7-code.md`/`glm-5.2.md`.
- **`check-prompt-quality-card-sync.sh`**: gains a 3rd `cli_cards`/`cli_skills` entry and a `CLI_EXECUTOR_HUB_METADATA` row so CHECK 4's discovery-reachability logic resolves `cli-devin` correctly.

### Data Flow
`model-profiles.json`'s `recommended_frameworks` presence gates whether CHECK 3/4 treat a model as "adopted". `swe-1.6` stays unadopted (no `_index.md`/graph-metadata obligation), while the 3 sibling models' new `cli-devin` rows ARE adopted-model data and therefore DO exercise CHECK 4 against `cli-devin`'s (shared hub) `graph-metadata.json`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `model-profiles.json` | Registry data source | Modify (add `swe-1.6` + 3 executor rows) | `python3 -c "json.load(...)"` parses; diff shows additive-only changes to the 3 sibling rows. |
| `swe-1.6.md` | Consumer model card | Create | File exists; `model_id` frontmatter matches the registry id. |
| `check-prompt-quality-card-sync.sh` (`cli_cards[]`/`cli_skills[]`) | CHECK 1/2 targets | Modify | Script recognizes `cli-devin`'s `prompt-quality-card.md` and `SKILL.md`. |
| `check-prompt-quality-card-sync.sh` (`CLI_EXECUTOR_HUB_METADATA`) | CHECK 4 hub-identity resolver | Modify | CHECK 4 passes for `deepseek`/`kimi`/`glm`'s new `cli-devin` rows. |
| `cli-external-orchestration/graph-metadata.json` (shared hub) | CHECK 4 ground truth | Not a consumer of THIS phase - already required to carry `cli-devin` trigger phrases by phase 003 | Re-verified read-only by T002 before this phase edits anything. |
| `sk-prompt/prompt-models/SKILL.md` model-executor table | Parallel consumer, currently out of scope | Not touched | Flagged as an Open Question, not verified here. |

Required inventories:
- Same-class producers: `rg -n '"executor":\s*"cli-opencode"' sk-prompt/prompt-models/assets/model-profiles.json` - enumerates every model with a `cli-opencode` row; only `deepseek-v4-pro`/`kimi-k2.7-code`/`glm-5.2` are in scope per the parent packet (`minimax-m3` and `mimo-v2.5-pro` are NOT restored - the archived deprecation only stripped 3 sibling rows, not these 2).
- Consumers of changed symbols: `rg -n 'cli-devin|CLI_EXECUTOR_HUB_METADATA' .opencode/skills/system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh .opencode/skills/sk-prompt/prompt-models` - confirms every reference is updated together.
- Matrix axes: 3 sibling models × {`cli-opencode` row untouched, `cli-devin` row added} = 6 assertions; plus the `swe-1.6` addition = 1 assertion; plus 3 script data-structures (`cli_cards`, `cli_skills`, `CLI_EXECUTOR_HUB_METADATA`) = 3 assertions. Total: 10 verifiable data points.
- Algorithm invariant: N/A - no path/redaction/parser logic changed. The invariant here is registry/CI-gate consistency: every executor row an adopted model carries must be reachable in that executor's resolved `graph-metadata.json`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the phase 003 predecessor state (`cli-devin` registered in the hub's shared `graph-metadata.json` with `deepseek`/`kimi`/`glm` family tokens reachable).
- [ ] Snapshot the current `model-profiles.json` and `check-prompt-quality-card-sync.sh` for a pre-edit diff baseline.

### Phase 2: Core Implementation
- [ ] Add the `swe-1.6` model entry.
- [ ] Add `cli-devin` executor rows to `deepseek-v4-pro`, `kimi-k2.7-code`, `glm-5.2`.
- [ ] Recreate `swe-1.6.md`.
- [ ] Restore the `cli_cards[]`/`cli_skills[]` entries and add the `CLI_EXECUTOR_HUB_METADATA` row for `cli-devin`.

### Phase 3: Verification
- [ ] Run `check-prompt-quality-card-sync.sh`; confirm `GUARD PASS`.
- [ ] Diff the 3 sibling models' `cli-opencode` rows against the pre-edit baseline; confirm byte-identical.
- [ ] Grep `swe-1.6.md` for the phantom permission-mode wording bug; confirm 0 matches.
- [ ] `validate.sh --strict` on this phase folder; Errors: 0.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static parse | `model-profiles.json` is well-formed JSON | `python3 -c "json.load(...)"` |
| Static CI gate | 4-check drift guard, including the new `CLI_EXECUTOR_HUB_METADATA` path | `check-prompt-quality-card-sync.sh` |
| Regression diff | 3 sibling models' existing `cli-opencode` rows unchanged | `git diff` / manual field comparison |
| Wording guard | Phantom permission-mode phrase absent from new prose | `rg -n` |
| Spec validation | Level 2 doc-set structural compliance | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 `cli-devin` hub registration (shared `graph-metadata.json` trigger phrases) | Internal | Planned, not yet built | CHECK 4 fails for the 3 sibling models' new `cli-devin` rows until phase 003 lands. |
| Phase 004 hook-adapter-layer (direct predecessor) | Internal | Planned, not yet built | No hard dependency identified for this phase's own data files; the phase-sequence rule (validate each phase before the next) still applies. |
| `check-prompt-quality-card-sync.sh`'s existing 4-check design | Internal | Green | N/A - script is live and correct today for its current 2-model scope. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `check-prompt-quality-card-sync.sh` fails post-edit, or a sibling model's `cli-opencode` row is found altered.
- **Procedure**: Revert the 3 touched files to their pre-phase-005 revision. `swe-1.6` stays absent and the 3 sibling models stay `cli-opencode`-only, exactly matching the current (post-deprecation) state - no partial-restore state is left live.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: confirm predecessor state) ──► Phase 2 (Core: registry + card + script edits) ──► Phase 3 (Verify: CI gate + diff + validate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 003 hub registration (external) | Core |
| Core | Setup | Verify |
| Verify | Core | Phase 006 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15-30 min |
| Core Implementation | Medium | 1-2 hours |
| Verification | Low | 30-45 min |
| **Total** | | **2-3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Pre-edit snapshot of `model-profiles.json` and `check-prompt-quality-card-sync.sh` taken.
- [ ] No feature flag needed (static doc/data change).

### Rollback Procedure
1. Revert the 3 touched files via git.
2. Re-run `check-prompt-quality-card-sync.sh` to confirm it returns to its current (pre-phase-005) 2-model-array state.
3. Confirm no other file changed (`git status` clean outside the 3 declared files).

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A - flat-file revert only.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md`
- **Predecessor**: `../004-devin-hook-adapter-layer/plan.md`
- **Successor**: `../006-devin-manual-testing-playbook/plan.md`
