---
title: "Changelog: Phase 13: addon-removal-and-speed-refinements [054-weak-model-spec-authoring/013-addon-removal-and-speed-refinements]"
description: "Chronological changelog for the Phase 13: addon-removal-and-speed-refinements phase."
trigger_phrases:
  - "weak model spec authoring addon removal and speed refinements changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-26

> Spec folder: `specs/system-speckit/054-weak-model-spec-authoring/013-addon-removal-and-speed-refinements` (Level 2)
> Parent packet: `specs/system-speckit/054-weak-model-spec-authoring`

### Summary

Phase 013 dropped the before-after, roadmap and resource-map add-on templates and built the six refinements the speed-loop analysis ranked. The card now runs one quiet validate, fixes every failing rule per round and stops after three rounds; the validator's repair hint leads with the command that fixes the packet; and the spec and acceptance-criteria templates say how ids are numbered. The deep loops still write their own resource map. No existing packet changed verdict, and the work ships as system-spec-kit v2.9.4.0.

### Added

- `runtime/tests/repair-hint-order.vitest.ts`: pins the repair hint's order, `--apply` command first.
- One plain line on id numbering in the `spec.md` and `acceptance-criteria.md` templates.
- `changelog/v2.9.4.0.md` for the skill.

### Changed

- The authoring card's section 9 runs `validate.sh --strict --quiet` once, reads the full report only on `FAILED`, fixes every failing rule per round and stops after three rounds.
- The validator's repair hint prints `repair-derived.cjs --folder <folder> --apply` first, then what it rewrites; the dry run is an optional last line.
- The acceptance-criteria closure note asks for Yes or No plus one sentence and forbids counts and id ranges.
- `--with-lazy-addons` scaffolds `timeline.md` and `decision-record.md`.
- The reference docs, catalog, playbook, skill README, `SKILL.md`, the Hermes copy and the root README list seven add-ons.
- `upgrade-legacy` leaves an existing root `resource-map.md` as written, because no template defines its values.

### Removed

- `templates/addons/before-after.md.tmpl`, `roadmap.md.tmpl` and `resource-map.md.tmpl`, with their manifest entries, `create.sh` phrases and seeds, phrase-tool maps, template-structure names and test pins.
- The unused `shared.resource_map` path in the `/speckit:plan`, `/speckit:implement` and `/speckit:complete` workflows.
- The resource-map template entries in the feature catalog and the manual testing playbook.

### Verification

- Six-rule census over 4,719 folders: identical to the baseline when sorted
- Strict census over 4,719 folders: 2 rows changed, both toward PASS, because a root `resource-map.md` is no longer template-checked (ADR-001); no folder gained a failure
- Changed test files, each run alone: 146 of 146 passed
- CLI test project: 2,179 passed against a baseline of 2,184; the 3 fewer tests left with the deleted add-ons, `repo-era` was then fixed, and `recursive-child-manifest` timed out under load and passes alone
- Throwaway scaffolds at Levels 1, 2 and 3, with and without `--with-lazy-addons`: all six print `RESULT: PASSED`
- Deep-loop resource-map tests: `resource-map-extractor` 4 of 4, `fanout-root-resource-map` and `deep-research-reduce-state` 32 of 32
- `check-card-sync.sh`, `check-example-drift.sh`, contract drift, Hermes check and the link checker all pass

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.skilled/skills/system-spec-kit/templates/addons/{before-after,roadmap,resource-map}.md.tmpl` | Deleted | The three add-ons |
| `.skilled/skills/system-spec-kit/templates/spec-kit-docs.json`, `runtime/cli/spec/create.sh` | Modified | Seven add-ons |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-{census,cleanup}.mjs`, `runtime/cli/utils/template-structure.js`, `runtime/cli/lib/frontmatter-migration.ts`, `runtime/lib/validation/spec-doc-structure.ts` | Modified | Drop the deleted templates |
| `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | Modified | Repair hint order |
| `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` | Modified | One quiet validate run |
| `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl`, `templates/addons/acceptance-criteria.md.tmpl` | Modified | Id numbering and closure note |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/` and the golden snapshot | Modified | Match seven add-ons and the new template lines |
| `.skilled/commands/speckit/assets/speckit-{plan,implement,complete}.yaml` | Modified | Drop the unused path |
| Spec-kit docs, catalog, playbook, `SKILL.md`, `.hermes` copy, root `README.md` | Modified or Deleted | Seven add-ons |
