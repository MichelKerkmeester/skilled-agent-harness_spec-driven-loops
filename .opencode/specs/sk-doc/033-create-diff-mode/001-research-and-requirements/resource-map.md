---
title: "Resource Map: Document Diff Research Preparation"
description: "Bounded inventory of packet artifacts, workflow contracts, and scripts used to prepare the document diff research phase."
trigger_phrases:
  - "document diff resource map"
  - "document diff known context"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/033-create-diff-mode/001-research-and-requirements"
    last_updated_at: "2026-07-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Prepared the bounded research resource map"
    next_safe_action: "Run strict readiness validation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "document-diff-research-preparation"
      parent_session_id: null
    completion_pct: 20
    open_questions:
      - "Which external sources will the research workflow select?"
    answered_questions: []
---

# Resource Map: Document Diff Research Preparation

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:when-to-use -->
## Purpose

This child-level map gives deep-research a bounded known-context inventory. It lists the packet artifacts, workflow contracts, and scripts used during preparation; it does not predict the future product implementation tree.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 38 files represented by 29 rows
- **By category**: READMEs=0, Documents=0, Commands=1, Agents=0, Skills=16, Specs=13, Scripts=8, Tests=0, Config=0, Meta=0
- **Missing on disk**: 1 planned output (`research/research.md`)
- **Scope**: child-level preparation artifacts and the local contracts that govern the future research run
- **Generated**: 2026-07-13T00:00:00+00:00

> **Theme summary - Commands**: the deep-research command is the only supported entry point for the future loop.
>
> **Theme summary - Skills**: Spec Kit owns packet structure, deep-research owns iterative evidence, and sk-code/sk-doc supply authoring boundaries.
>
> **Theme summary - Specs**: the new parent coordinates one Level 3 research child; the canonical synthesis is still planned.
>
> **Theme summary - Scripts**: template-backed creation, metadata generation, placeholder checks, and strict validation are the preparation toolchain.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:commands -->
## 3. Commands

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/commands/deep/research.md` | Cited | OK | Canonical future `/deep:research:auto` entry point |
<!-- /ANCHOR:commands -->

---

<!-- ANCHOR:skills -->
## 5. Skills

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/SKILL.md` | Analyzed | OK | Phase, Level 3, metadata, and validation contract |
| `.opencode/skills/system-spec-kit/references/workflows/quick_reference.md` | Analyzed | OK | Command and phased-packet guidance |
| `.opencode/skills/system-spec-kit/references/workflows/spec_folder_authoring_checklist.md` | Analyzed | OK | Authoring-time requirements |
| `.opencode/skills/system-spec-kit/references/workflows/spec_folder_write_recipe.md` | Analyzed | OK | Canonical scaffold and metadata sequence |
| `.opencode/skills/system-spec-kit/references/structure/phase_definitions.md` | Analyzed | OK | Qualification and lean-parent policy |
| `.opencode/skills/system-spec-kit/references/validation/phase_checklists.md` | Analyzed | OK | Research and readiness priorities |
| `.opencode/skills/system-deep-loop/SKILL.md` | Analyzed | OK | Research-mode routing hub |
| `.opencode/skills/system-deep-loop/deep-research/SKILL.md` | Analyzed | OK | Command ownership, state, convergence, and safety rules |
| `.opencode/skills/system-deep-loop/deep-research/references/guides/quick_reference.md` | Analyzed | OK | Invocation and output summary |
| `.opencode/skills/system-deep-loop/deep-research/references/protocol/loop_protocol.md` | Analyzed | OK | Charter, lifecycle, synthesis, and save contract |
| `.opencode/skills/system-deep-loop/deep-research/references/protocol/spec_check_protocol.md` | Analyzed | OK | Bounded `spec.md` write-back and conflict behavior |
| `.opencode/skills/system-deep-loop/deep-research/references/protocol/context_snapshot.md` | Analyzed | OK | Bounded known-context guidance |
| `.opencode/skills/system-deep-loop/deep-research/references/state/state_format.md` | Analyzed | OK | Research artifact ownership and location |
| `.opencode/skills/sk-doc/SKILL.md` | Analyzed | OK | Defers spec-folder authoring to Spec Kit |
| `.opencode/skills/sk-code/SKILL.md` | Analyzed | OK | OpenCode surface routing boundary |
| `.opencode/skills/sk-code/code-opencode/SKILL.md` | Analyzed | OK | Descriptor and spec authoring boundary |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/sk-doc/033-create-diff-mode/spec.md` | Created | OK | Lean phase-parent purpose and map |
| `.opencode/specs/sk-doc/033-create-diff-mode/description.json` | Created | OK | Parent discovery metadata |
| `.opencode/specs/sk-doc/033-create-diff-mode/graph-metadata.json` | Created | OK | Parent graph and active-child pointer |
| `.opencode/specs/sk-doc/033-create-diff-mode/001-research-and-requirements/spec.md` | Created | OK | Level 3 research charter |
| `.opencode/specs/sk-doc/033-create-diff-mode/001-research-and-requirements/plan.md` | Created | OK | Command-owned research plan |
| `.opencode/specs/sk-doc/033-create-diff-mode/001-research-and-requirements/tasks.md` | Created | OK | Preparation, research, and verification tasks |
| `.opencode/specs/sk-doc/033-create-diff-mode/001-research-and-requirements/checklist.md` | Created | OK | Readiness and research-exit gates |
| `.opencode/specs/sk-doc/033-create-diff-mode/001-research-and-requirements/decision-record.md` | Created | OK | Accepted product direction |
| `.opencode/specs/sk-doc/033-create-diff-mode/001-research-and-requirements/implementation-summary.md` | Created | OK | Current preparation state and limitations |
| `.opencode/specs/sk-doc/033-create-diff-mode/001-research-and-requirements/resource-map.md` | Created | OK | This bounded known-context ledger |
| `.opencode/specs/sk-doc/033-create-diff-mode/001-research-and-requirements/description.json` | Created | OK | Child discovery metadata |
| `.opencode/specs/sk-doc/033-create-diff-mode/001-research-and-requirements/graph-metadata.json` | Created | OK | Child graph metadata |
| `.opencode/specs/sk-doc/033-create-diff-mode/001-research-and-requirements/research/research.md` | Planned | PLANNED | Canonical future synthesis owned by deep-research |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:scripts -->
## 7. Scripts

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/scripts/spec/create.sh` | Executed | OK | Template-backed phased scaffold |
| `.opencode/skills/system-spec-kit/scripts/spec/recommend-level.sh` | Executed | OK | Level 3 and phase-qualification evidence |
| `.opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh` | Executed | OK | Failed safely and restored because a configured template path was missing |
| `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.sh` | Executed | OK | Approved Level 3 fallback |
| `.opencode/skills/system-spec-kit/scripts/spec/check-placeholders.sh` | Cited | OK | Final placeholder gate |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Cited | OK | Strict child and recursive parent gates |
| `.opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js` | Cited | OK | Discovery metadata refresh |
| `.opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js` | Cited | OK | Graph metadata refresh |
<!-- /ANCHOR:scripts -->

---

<!-- ANCHOR:author-instructions -->
## Maintenance Notes

- Keep paths relative to the repository root.
- Add research-produced sources to `research/resource-map.md`; this preparation map remains a bounded initialization inventory.
- Do not manually create or rewrite command-owned config, JSONL, strategy, dashboard, registry, iteration, delta, or synthesis files.
- After research, update this file only if a local contract used by the packet changed; implementation inventories belong in their later child phases.
<!-- /ANCHOR:author-instructions -->
