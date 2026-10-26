---
title: "Implementation Summary"
description: "Seven add-ons instead of ten, one quiet validate run on the card, and a repair hint that leads with the fix, with no existing packet gaining a failure."
trigger_phrases:
  - "addon removal and speed refinements implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/013-addon-removal-and-speed-refinements"
    last_updated_at: "2026-10-26T11:20:00Z"
    last_updated_by: "conductor"
    recent_action: "Removed three add-ons and built the six speed refinements"
    next_safe_action: "Commit on the worktree branch"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-013-addon-removal-and-speed-refinements"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.3 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-recommend-level-quiet`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-addon-removal-and-speed-refinements |
| **Completed** | 2026-10-26 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--quiet` prints one line. The default report is unchanged. WEAK: Implemented the feature. -->

A model writing a spec packet now validates once with `--quiet`, fixes every failing rule per round, and gets the repair command as the first line of the hint. The spec kit ships seven add-on templates instead of ten, and the deep loops still write their own resource map.

### Phase 13: addon-removal-and-speed-refinements

The before-after, roadmap and resource-map add-on templates are gone, with every manifest entry, `create.sh` phrase and seed, phrase-tool map, name list, test pin and doc mention that offered them. Packets that already hold one of those files keep it; the validator no longer checks a file no template defines.

The card's validate step asks for one `--quiet` run after the last edit, reads the full report only on `FAILED`, fixes every failing rule in one round and stops after three rounds. The validator's hint prints `repair-derived.cjs --apply` first, then what it rewrites. The spec and acceptance-criteria templates say a new id takes the highest plus one, and the closure note forbids counts and id ranges. The work ships as system-spec-kit v2.9.4.0.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/templates/addons/{before-after,roadmap,resource-map}.md.tmpl` | Deleted | The three add-ons |
| `.skilled/skills/system-spec-kit/templates/spec-kit-docs.json`, `runtime/cli/spec/create.sh` | Modified | Seven add-ons; `--with-lazy-addons` asks for timeline and decision record |
| `runtime/cli/spec/template-phrase-{census,cleanup}.mjs`, `runtime/cli/utils/template-structure.js`, `runtime/cli/lib/frontmatter-migration.ts`, `runtime/lib/validation/spec-doc-structure.ts` (under the skill) | Modified | Drop the deleted templates |
| `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts`, `runtime/tests/repair-hint-order.vitest.ts` | Modified, Created | Repair command first, pinned by a test |
| `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` | Modified | One quiet validate run, rounds, repair step |
| `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl`, `templates/addons/acceptance-criteria.md.tmpl` | Modified | Id numbering and closure note |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/` (8 files) and the golden snapshot | Modified | Match the new template set and lines |
| `.skilled/commands/speckit/assets/speckit-{plan,implement,complete}.yaml` | Modified | Drop the unused `shared.resource_map` path |
| Spec-kit references, assets, catalog, playbook, skill README, `SKILL.md`, `.hermes` copy, root `README.md` | Modified, Deleted | List seven add-ons |
| `.skilled/skills/system-spec-kit/changelog/v2.9.4.0.md`, `SKILL.md` version | Created, Modified | Release record |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--quiet` and the default form, then the suite. All three passed. WEAK: Tested and shipped. -->

Baselines came first: the strict and six-rule censuses over 4,719 folders and the CLI test project. DeepSeek V4.1 Flash max made the edits through cli-pi, one change per brief: A, B, C, C2, C3, C4, D1, D2, D3, E, E2, E3, F and G, with briefs in `scratch/briefs/` and reports in `scratch/runs/`. One Opus medium checker reviewed each batch, and every finding went back as a follow-up brief. The censuses, the CLI project, six throwaway scaffolds and the guards then ran from the final tree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Flag over env var: callers already pass flags. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Drop the resource-map add-on only, keep the deep loops' map | The loops build their map from evidence and never read the template; the operator chose this on 2026-10-26 |
| Repair hint prints `--apply` first, dry run optional | A model acts on the first command it reads; the operator chose this on 2026-10-26 |
| Keep the runtime lists that recognise `resource-map.md` | 678 existing loop maps still resume and validate through them |
| `upgrade-legacy` leaves a root `resource-map.md` as written | No template defines its values, and the review found no caller that needs the fill |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `--quiet` line count: 1. Default line count: 17. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Six-rule census, 4,719 folders | `diff rules-before.tsv rules-after.tsv` printed nothing |
| Strict census, 4,719 folders | 2 of 4,719 rows changed, both toward PASS: `sk-prompt/z_archive/002` FAIL to PASS, `system-deep-loop/z_archive/015` 2 errors to 1; both lose the template check on a root `resource-map.md` (ADR-001); no folder gained a failure |
| CLI test project | 2,179 passed, 2 failed, 20 skipped of 2,201 against 2,184 passed of 2,204; 3 generated fill-guidance tests left with the deleted templates; `repo-era` fixed to 7 of 7; `recursive-child-manifest` timed out at 30 s under load and passes alone, 2 of 2 in 3.6 s |
| Changed test files rerun | Each of the 11 changed files run alone: 146 of 146 passed, every file exit 0. A combined run of the same 11 under load reported 1 failure whose name was not captured; no file fails alone |
| Throwaway scaffolds, Levels 1 to 3, with and without `--with-lazy-addons` | 6 of 6 `RESULT: PASSED`; track removed |
| Deep-loop map tests | `resource-map-extractor` 4 of 4; `fanout-root-resource-map` and `deep-research-reduce-state` 32 of 32 |
| Guards | `check-card-sync.sh` `CARD SYNC OK`; `check-example-drift.sh` `EXAMPLE_DRIFT_OK`; contract drift `OK commands=3`; Hermes `PASS: 67`; links `0 broken` |
| Sweeps | `rg -l 'before-after\.md\.tmpl\|roadmap\.md\.tmpl\|resource-map\.md\.tmpl' .skilled .hermes README.md` exit 1; seven files in `templates/addons/` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--quiet` does not hide stderr warnings. Redirect stderr when silence is required. WEAK: No limitations. -->

1. **The speed gain is not measured yet.** The refinements cut calls the speed loop counted, but no timed run has compared this tree with the one before it. Rerun the phase 011 speed loop to measure it.
2. **The era report counts every deep-loop map as legacy.** The loops stamp their maps `resource-map | v1.1`, and no template version is left to match. The count only feeds the printed report.
<!-- /ANCHOR:limitations -->

---
