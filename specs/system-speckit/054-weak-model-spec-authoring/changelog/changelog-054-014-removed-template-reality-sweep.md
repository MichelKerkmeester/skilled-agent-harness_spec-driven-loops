---
title: "Changelog: Phase 14: removed-template-reality-sweep [054-weak-model-spec-authoring/014-removed-template-reality-sweep]"
description: "Chronological changelog for the Phase 14: removed-template-reality-sweep phase."
trigger_phrases:
  - "weak model spec authoring removed template reality sweep changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-26

> Spec folder: `specs/system-speckit/054-weak-model-spec-authoring/014-removed-template-reality-sweep` (Level 2)
> Parent packet: `specs/system-speckit/054-weak-model-spec-authoring`

### Summary

Phase 014 swept the tree after the 2.11.0.0 release. One audit found 19 stale lines plus 3 nearby gaps that still offered the deleted before-after, roadmap or resource-map add-on. A second audit found 12 docs that contradicted the shipped code: 9 from the release and 3 older ones that called decision-record required at Level 3. Five briefs fixed them all, and a fresh review found nine follow-ups, which were fixed too. The /speckit workflows keep their own per-step strict gate.

### Changed

- Counts and lists: ten add-ons to seven, 16 passed to 24, 18 template kinds to 15, the add-on table, the packet-types tree and the link-guard output.
- `decision-record.md` reads as optional at Level 3 in the level specs, the quick reference, the level decision matrix and the `upgrade-level.sh` help text.
- `SKILL.md`, the orchestrate agent and its copies, and the card playbook say to validate once after the last doc write. `SKILL.md` adds that the /speckit workflows also run their own strict gate after each doc-writing step.
- The card's section 10 checklist line now points at the section 9 `--quiet` run.
- Ten deep-loop catalog and playbook lines call the loop map a renderer layout, not a template.
- One comment line in `upgrade-legacy.vitest.ts`.

### Verification

- Final sweep over `.skilled`, the runtime mirrors and the root README: 10 hits, all judged fine
- Opus medium review: OK with notes; all 9 findings fixed
- `check-markdown-links.cjs`: 0 broken
- Hermes check: `PASS: 67`
- `check-card-sync.sh`, `check-example-drift.sh` and `check-agent-mirror-sync.cjs --all` pass
- `bash -n upgrade-level.sh` exits 0; `templates/addons` holds 7 files

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.skilled/skills/system-spec-kit/feature-catalog/`, `manual-testing-playbook/`, `templates/README.md`, `runtime/cli/spec/README.md`, `references/structure/folder-structure.md` | Modified | Counts, lists and trees |
| `.skilled/skills/system-spec-kit/references/templates/level-specifications.md`, `references/workflows/quick-reference.md`, `assets/level-decision-matrix.md`, `runtime/cli/spec/upgrade-level.sh` | Modified | Decision-record optional at Level 3 |
| `.skilled/skills/system-spec-kit/SKILL.md` and its `.hermes` copy | Modified | Validate cadence |
| `.skilled/agents/orchestrate.md`, `.claude/agents/orchestrate.md`, `.codex/agents/orchestrate.toml`, `.pi/agents/orchestrate.md`, `.hermes/skills/agent-orchestrate/SKILL.md` | Modified | Validate once after the last doc write |
| `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` | Modified | Section 10 checklist line |
| `.skilled/skills/system-deep-loop/deep-research/` and `deep-review/` catalog and playbook files | Modified | Map wording |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts` | Modified | Comment only |
