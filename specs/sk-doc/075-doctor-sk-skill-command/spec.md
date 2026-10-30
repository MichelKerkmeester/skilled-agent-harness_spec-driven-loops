---
title: "Feature Specification: Doctor skill command: check and convert a skill to the Skilled format and wire it into the advisor"
description: "A user skill, plain or in an older Skilled format, has no single command that reports how far it is from the Skilled format and then converts it and wires it into the advisor, mirrors and changelog. This packet builds /doctor:sk-skill with a read-only check target and a plan-then-yes convert target across ten phases."
trigger_phrases:
  - "doctor skill command phase parent spec"
  - "doctor skill check convert"
  - "convert skill to skilled format"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command"
    last_updated_at: "2026-10-30T13:20:00Z"
    last_updated_by: "markdown-agent-010"
    recent_action: "Phases 1 to 9 are closed and phase 10 recorded the final verification and the release entry"
    next_safe_action: "Read CI on main after the operator merges, then close phase 10"
    blockers: []
    key_files:
      - "scratch/design.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-281-doctor-skill-command"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Decisions D1 to D9 accepted as recommended, including optional phase 8"
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Doctor skill command: check and convert a skill to the Skilled format and wire it into the advisor

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-30 |
| **Branch** | `worktrees/281-doctor-skill-command` |
| **Parent Spec** | None (top-level packet) |
| **Parent Packet** | sk-doc/075-doctor-sk-skill-command |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Every child passes `validate.sh --strict` and phase 010 records the final verification and release notes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An adopter who brings a plain agent skill, or a Skilled skill whose machine router still sits inside `SKILL.md`, has no command that says how far the skill is from the current Skilled format, and no path that converts it in place. `/create:skill` scaffolds new folders and refuses an existing one (`.skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py:327-329`), and the canon says there is no convert-in-place path (`.skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md:79, 95`). Neither create command touches the runtime mirrors, the changelog index or the compiled skill graph, so a hand conversion can pass the format check and still be unreachable by the advisor.

### Purpose
Ship `/doctor:sk-skill` with a read-only `check` target that reports rows C1 to C13 for one skill or the whole fleet, and a `convert` target that prints a plan, writes only after an explicit yes, proves the parsed router is unchanged, and wires the converted skill into the advisor, Hermes mirror and changelog index. Version 1 converts plain skills and older Skilled skills into a standalone class S root, refuses hubs, and reports on mode-into-hub work without writing.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new doctor command `/doctor:sk-skill`, router `.skilled/commands/doctor/sk-skill.md`, with `check [<name-or-path>] [--json]` as the read-only default target and `convert <name-or-path> [--dry-run]` as the mutating target.
- Conversion of (a) plain agent skills and (b) older Skilled skills whose router lives in `SKILL.md` into a class S standalone root.
- Integration writes no script owns today: advisor scan, compiled skill graph refresh, Hermes skill mirror, changelog link and proposed regression rows.
- A read-only hub gap report, `check --into-hub <hub>` (optional phase 8, accepted).
- The Hermes skills and prompts checks in `/doctor:runtime-mirrors` (D8) and the leaf-manifest config template wording fix (D9).
- Docs and a changelog entry for every touched skill, then final verification and release notes.

### Out of Scope
- Converting a skill into a mode under an existing hub. It lands on 11 surfaces, five without a gate (`.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:245-264`), so v1 reports on it only.
- Converting a hub candidate. Convert refuses it and points to `/create:skill-parent`.
- Moving the router resolver and parser out of sk-code's `sk-code-skilled` surface into `sk-doc/shared` (D3).

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/commands/doctor/scripts/sk-skill-check.cjs` | Create | 001-check-engine | The `check` engine, rows C1 to C13, text and JSON |
| `.skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs` | Create | 001-check-engine | Shared probes: locate, classify, collisions, spawn wrappers |
| `.skilled/commands/doctor/sk-skill.md`, `assets/doctor-sk-skill-presentation.txt`, `assets/doctor-sk-skill-check.yaml` | Create | 002-check-plumbing | Router, presentation and check workflow |
| `.skilled/commands/doctor/_routes.yaml` | Modify | 002, 006, 009 | `check` and `convert` routes; Hermes check on the runtime-mirrors route |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modify | 002-check-plumbing | `families.doctor` entry for the new command |
| `.skilled/commands/doctor/scripts/sk-skill-convert.cjs` | Create | 003, 004, 005 | `plan`, `apply` and `preserve` |
| `.skilled/commands/doctor/scripts/lib/sk-skill-convert-transforms.cjs` | Create | 003, 004 | Pure text transforms, unit-tested without a repo |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs` | Modify | 005-integration | Opt-in `--skill <id>` for one standalone root |
| `.skilled/commands/doctor/assets/doctor-sk-skill-convert.yaml` | Create | 006-convert-plumbing | Read, refuse, plan, yes, write, re-read, undo |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json` | Modify | 006-convert-plumbing | Advisor bridge activation for `/doctor:sk-skill` |
| `README.md`, `.skilled/commands/README.txt`, sk-create-skill docs and changelogs | Modify | 007-docs-and-changelogs | Docs and one changelog entry per touched skill |
| `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml` | Modify | 009-mirror-and-template-fixes | Invoke `sync-skills-hermes.cjs --check` (D8) |
| `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-leaf-manifest-config-template.json` | Modify | 009-mirror-and-template-fixes | Replace "in-SKILL.md router" with "the router in the sibling ROUTER.md" (D9) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-check-engine/ | `sk-skill-check.cjs` and `lib/sk-skill-surface.cjs`: rows C1 to C13 in text and JSON, plus the fleet baseline | Complete |
| 2 | 002-check-plumbing/ | Router, presentation, check YAML, route, command contract, setup row, mirrors and contract test | Complete |
| 3 | 003-convert-legacy-skilled/ | `sk-skill-convert.cjs plan/apply` for older Skilled skills: V2, V3(b), backups, exclusive create, `parseRouter` proof | Complete |
| 4 | 004-convert-plain-skill/ | Plain-skill conversion: V1, V3(a), V4 preservation check, V5, V6, V7, V8 | Complete |
| 5 | 005-integration/ | Integration rows I1 to I6 and the opt-in `--skill` flag on the reach script | Complete |
| 6 | 006-convert-plumbing/ | Convert YAML, presentation states, advisor bridge activation, refusal-string contract test | Complete |
| 7 | 007-docs-and-changelogs/ | Docs list from design section 3 and a changelog for every touched skill | Complete |
| 8 | 008-hub-gap-report/ | Read-only `check --into-hub <hub>` 11-row gap report | Complete |
| 9 | 009-mirror-and-template-fixes/ | Hermes skills check in `/doctor:runtime-mirrors` (D8) and the template wording fix (D9) | Implemented |
| 10 | 010-verification-and-release/ | Final verification across the program and release notes | Implemented, CI on main pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-check-engine | 002-check-plumbing | Every shipped root reports its baseline verdict | `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` passes |
| 002-check-plumbing | 003-convert-legacy-skilled | `/doctor:sk-skill check` is routed and mirrored | `bash .skilled/commands/doctor/scripts/route-validate.sh` exit 0 and `run-all.sh` all PASS |
| 003-convert-legacy-skilled | 004-convert-plain-skill | Older Skilled fixture converts with an unchanged parsed router | Golden test in `sk-skill-convert.test.cjs` passes; second `apply` is a no-op |
| 004-convert-plain-skill | 005-integration | Plain fixture ends strict PASS and root metadata exit 0 | `package_skill.py --check --strict` PASS on the converted fixture |
| 005-integration | 006-convert-plumbing | Integration writes proven in a temp repo | `sync-skills-hermes.cjs --check` PASS and `skill-graph-freshness.cjs --strict` exit 0 |
| 006-convert-plumbing | 007-docs-and-changelogs | `convert` routed, refusals contract-tested | `doctor-phrase-reach.cjs` reaches `/doctor:sk-skill` |
| 007-docs-and-changelogs | 008-hub-gap-report | Docs and changelogs land with fresh derived files | `ci-leaf-manifest-freshness.cjs` and `ci-skill-derived-freshness.cjs` exit 0 |
| 008-hub-gap-report | 009-mirror-and-template-fixes | Gap report reads a shipped hub without writing | Every row present on a shipped hub |
| 009-mirror-and-template-fixes | 010-verification-and-release | D8 and D9 landed | `route-validate.sh` exit 0 with the new invocation |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Do the compiled-routing activation manifests under `.skilled/bin/lib/compiled-routing/` need a refresh once sk-doc docs are added? The design infers yes from commit `10c6791341`; phase 007 confirms it.
- Does a skill name that a future release might ship need more than a warning? `/doctor:update` tracks `skill` units (`.skilled/commands/doctor/scripts/release-update.cjs:30`); the design marks this inferred, not traced.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Design**: See `scratch/design.md` for the approved design, phase plan and decisions D1 to D9
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
