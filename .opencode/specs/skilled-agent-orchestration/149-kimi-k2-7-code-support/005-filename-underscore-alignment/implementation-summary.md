---
title: "Implementation Summary [template:level_1/implementation-summary.md]"
description: "Status: DONE. Renamed 5 markdown + 2 JSON files in sk-prompt-small-model dash to underscore and repaired all live references; the four model-profile filenames stay dashed; drift guard and strict validate green."
trigger_phrases:
  - "filename underscore alignment status"
  - "sk-prompt-small-model rename done"
  - "model_profiles.json renamed"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/149-kimi-k2-7-code-support/005-filename-underscore-alignment"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Renamed 7 targets (git mv), repaired ~27 live reference files, drift guard exit 0"
    next_safe_action: "Phase complete; strict-validate and close"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-small-model/assets/model_profiles.json"
      - ".opencode/skills/sk-prompt-small-model/assets/per_model_budgets.json"
      - ".opencode/skills/sk-prompt-small-model/references/pattern_index.md"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-005-filename-underscore-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 005-filename-underscore-alignment |
| **Status** | DONE - 7 targets renamed, live references repaired, drift guard + strict validate green |
| **Created** | 2026-06-16 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

> **Status: DONE.** `sk-prompt-small-model`'s dash-named documentation and asset files now follow the house underscore convention, with every live inbound reference repaired. The four `references/models/<id>.md` profiles were deliberately left dashed because a pre-commit drift guard derives their path from the dashed model id.

### Renamed: 5 markdown + 2 JSON (git mv, history preserved)

| Old | New |
|-----|-----|
| `assets/confidence-scoring-rubric.md` | `assets/confidence_scoring_rubric.md` |
| `references/context-budget.md` | `references/context_budget.md` |
| `references/output-verification.md` | `references/output_verification.md` |
| `references/pattern-index.md` | `references/pattern_index.md` |
| `references/quota-fallback.md` | `references/quota_fallback.md` |
| `assets/model-profiles.json` | `assets/model_profiles.json` |
| `assets/per-model-budgets.json` | `assets/per_model_budgets.json` |

### Repaired: live references across 27 files

The skill's own files (`SKILL.md`, `README.md`, `description.json`, `graph-metadata.json`, the renamed files' internal cross-links, `references/models/_index.md`, and the four model profiles' content references); `cli-opencode` (`SKILL.md`, `references/context-budget.md`, `assets/prompt_templates.md`, the `permissions-matrix` config + reference, two `manual_testing_playbook` files); `cli-claude-code/SKILL.md` and `cli-codex/SKILL.md`; the `pre-commit` hook hint string; the drift guard's functional `json.load(... model_profiles.json)` path; and the repo-root `README.md`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-prompt-small-model/assets/*` + `references/*` (7 targets) | Renamed | Dash to underscore via `git mv` |
| `sk-prompt-small-model/{SKILL.md,README.md,description.json,graph-metadata.json}` | Modified | Inbound references repointed |
| `sk-prompt-small-model/references/**` (renamed + `_index.md` + 4 model profiles) | Modified | Cross-links repointed to new names |
| `cli-opencode/**` (SKILL.md, references, assets, playbooks) | Modified | Cross-skill references repointed (path-qualified for the context-budget collision) |
| `cli-claude-code/SKILL.md`, `cli-codex/SKILL.md` | Modified | `model_profiles.json` references |
| `.opencode/scripts/git-hooks/pre-commit` | Modified | `pattern_index.md` hint string |
| `system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh` | Modified | Functional `json.load` path to `model_profiles.json` |
| `README.md` (root) | Modified | `pattern_index.md` reference |
| `154/spec.md`, `154/graph-metadata.json` | Modified | Phase-5 map row + `children_ids` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Discovery first: the full reference inventory was mapped, and opening `check-prompt-quality-card-sync.sh` confirmed it computes `references/models/<id>.md` from the dashed model id, which is the reason the four model-profile files are excluded. Then `git mv` renamed the 7 targets. A single controlled pass rewrote references: the 6 globally-unique filenames were replaced by full filename token across the live file list (extension-anchored, so model ids and prose are never touched), and `context-budget.md` was handled path-qualified (`sk-prompt-small-model/references/context-budget.md`) plus two targeted same-skill link edits, leaving cli-opencode's own `context-budget.md` and the links to it intact. The closing gate is the card-sync drift guard, a live-wiring stale-reference grep, JSON validity checks, and strict `validate.sh` on this phase.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the 4 model-profile filenames dashed | The drift guard derives the path from the dashed model id (external provider identifier); renaming would fail its existence check and block every commit |
| Also rename the 2 dash-named JSON assets | The user chose full underscore alignment for assets; only one code consumer (the drift guard `json.load`) needed updating, and `per-model-budgets.json` has no code consumer |
| Limit reference repair to the skill + live wiring | The user chose not to rewrite the ~293 historical/archived spec-doc references or changelogs, which are point-in-time records |
| Path-qualify the `context-budget` replacement | `cli-opencode` owns a same-named file; a blanket replace would wrongly rename it. Path-qualified plus targeted same-skill edits keeps both correct |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| All 7 targets renamed, history preserved | PASS (`git status --short` shows R / RM for all 7) |
| Drift guard loads the renamed registry and resolves all 4 model profiles | PASS (`check-prompt-quality-card-sync.sh .` -> `GUARD PASS`, exit 0) |
| No stale references to the 6 unique old dash names in live wiring | PASS (live-wiring grep returns 0 hits) |
| Remaining dashed `context-budget.md` refs are the intentional cli-opencode keep | PASS (4 refs, all pointing at cli-opencode's own file) |
| Both renamed JSONs parse; `profile_ref` still points at dashed model files | PASS (`python3 json.load` valid; 4 `profile_ref` lines unchanged) |
| Model profiles kept dashed and present | PASS (4 files + `_index.md` present in `references/models/`) |
| `validate.sh <this phase> --strict` | PASS (exit 0) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Historical and archived references were intentionally not updated.** ~293 spec-doc references (across `z_archive`, 026, 027, 152, 154) and changelog entries still name the old dash filenames. This was the user's chosen scope (point-in-time records), not an oversight.
2. **cli-opencode's own `context-budget.md` keeps its dash.** This phase is scoped to `sk-prompt-small-model` filenames; aligning cli-opencode's own filenames would be a separate change. References from it to the sk-prompt-small-model canonical were repointed correctly.
3. **The four model-profile filenames remain dashed by contract.** They mirror external model ids enforced by the drift guard; this is intentional, and a future change would require also teaching the guard a dash/underscore translation.
<!-- /ANCHOR:limitations -->
