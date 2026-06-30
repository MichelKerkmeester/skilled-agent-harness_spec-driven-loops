---
title: "Implementation Summary: D2-R11 — Interface intent lanes as visible task projections"
description: "The /design:interface record now carries an 11-entry tasks[] array binding every interface-mode INTENT_SIGNALS lane to a class, projected as an INTERFACE TASK LANES section and reconciled by an interface-targeted gate in design-command-surface-check.mjs."
trigger_phrases:
  - "d2-r11 interface intent lanes summary"
  - "interface intent lanes design summary"
  - "interface task projections summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/011-interface-intent-lanes"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Bound interface tasks to INTENT_SIGNALS; checker PASS invalid=0 drift=0; 3 files scoped"
    next_safe_action: "Regenerate description.json + graph-metadata.json to clear residual generated-metadata"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r11-interface-intent-lanes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The lane set is reconciled to the live INTENT_SIGNALS keys parsed from design-interface SKILL.md, not authored once in prose"
      - "tasks stays interface-targeted and is not added to the global REQUIRED_FIELDS, so the 4 siblings keep drift=0"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-interface-intent-lanes |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
| **Enforcement class** | hybrid (metadata SSOT + deterministic surface gate) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `/design:interface` command used to collapse eleven distinct intent lanes into one opaque bridge: a caller could not tell that "invent a direction", "give me N options", "redesign this surface", "run the pre-ship gate", and "hand the build to sk-code" are separate jobs the command performs, nor that "quality" is really a sibling command and that register calibration, the copy gate, system grounding, and real-world reference are non-surfaced internal lanes. The interface record now enumerates all eleven lanes as visible task projections, each carrying a class, and a deterministic gate keeps that lane set exactly synced to the live router so the surface and the mode cannot silently diverge.

### Interface `tasks[]` bound to the eleven INTENT_SIGNALS lanes

`command-metadata.json` gained a `tasks` array on the `/design:interface` record only — one entry per `INTENT_SIGNALS` lane parsed from `design-interface/SKILL.md`, exactly eleven: `DESIGN_PRINCIPLES`, `VARIATION_DIVERSITY`, `REDESIGN_INTAKE`, `MECHANICAL_PREFLIGHT`, `REAL_UI_LOOP`, `AESTHETICS`, `UX_QUALITY`, `REGISTER_DIALS`, `COPY_MOCK_DATA`, `REAL_SYSTEM_GROUNDING`, `REAL_WORLD_REFERENCE`. Each entry binds the lane to a visible `label`, a `class`, and a `surface` (the `--mode` value it projects to, or the sibling/route it points at). Every prior interface-record field — `description`, `aliases`, `userIntent`, `copyGuard`, `returns`, `next`, `proofFields`, `registerPolicy`, `deferToHubWhen`, `preconditions`, `discriminator`, `outputContract`, `pipeline` — is preserved untouched.

### The four-class lane taxonomy

Every lane carries exactly one `class`, so each lane is unambiguous about whether it is a selectable task, a sibling's job, or non-surfaced plumbing:

- **`argument`** (6 lanes) — a distinct interface job the command performs, surfaced as a `--mode` value: direction (default), directions, redesign, preflight, handoff, aesthetic. The four lanes the research named for promotion — directions, preflight, redesign, handoff — are all `argument`.
- **`sibling-command`** (1 lane) — `UX_QUALITY` (quality) is owned by `/design:audit`, surfaced as a named route, never duplicated as a new interface command.
- **`internal`** (3 lanes) — `REGISTER_DIALS`, `COPY_MOCK_DATA`, `REAL_SYSTEM_GROUNDING` run inside the workflow and are named as not-surfaced, not-selectable.
- **`hidden`** (1 lane) — `REAL_WORLD_REFERENCE` is critique tooling deliberately not exposed to the caller.

### Projected INTERFACE TASK LANES section in the wrapper

`commands/design/interface.md` gained a `## 3. INTERFACE TASK LANES` body section projecting the lanes: the six `argument` labels with their `--mode` values, the `quality` lane routed to `/design:audit`, and the internal/hidden lanes flagged "not surfaced" and "not selectable". All prior sections and the wrapper frontmatter were preserved (the subsequent sections carry their existing higher numbers and named anchors); the four sibling wrappers were never touched.

### Interface-targeted gate in `design-command-surface-check.mjs`

The checker was extended additively. Stage 1 parses the `INTENT_SIGNALS` keys from `design-interface/SKILL.md` (`parseInterfaceIntentSignalKeys`) and `validateInterfaceTasks` then enforces: `tasks` is a non-empty array; every entry has non-empty `lane`/`label`/`class`/`surface`; `class` is one of the four-value enum; the lane set equals the parsed `INTENT_SIGNALS` keys exactly (missing/extra reported by name); plus the negative-fixture guard — no lane may be promoted into the `/design:*` command set, and no non-`argument` lane may name a `/design:*` command as its `surface`. Stage 2 (`expectedInterfaceTaskLanesDrift`) requires the `## INTERFACE TASK LANES` section, every lane label, the `/design:audit` route for the sibling-command lane, and the "not surfaced"/"not selectable" notes for internal/hidden lanes — reporting misses as drift `field: "task-lanes"`. Critically, `tasks` was NOT added to the global `REQUIRED_FIELDS`, so the four sibling records never need it and their drift stays 0.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/command-metadata.json` | Modified | Added an 11-entry `tasks` array to the `/design:interface` record only, reconciled to the live `INTENT_SIGNALS` keys; every prior interface-record field and all four sibling records preserved |
| `.opencode/commands/design/interface.md` | Modified | Added a `## INTERFACE TASK LANES` body section projecting the lanes; all prior sections + frontmatter preserved |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modified | Added the interface-targeted Stage-1 `tasks` validator (shape + class-enum + lane-set == INTENT_SIGNALS + negative-fixture guard) and the Stage-2 `task-lanes` body rule; `tasks` deliberately kept out of the global `REQUIRED_FIELDS` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The build ran SSOT-first: the `tasks` array landed in `command-metadata.json` before the wrapper section and the checker rules, so Stage-1 reconciliation could pass as soon as the gate arrived. The interface-targeted gate was kept interface-only on purpose — adding `tasks` to the global `REQUIRED_FIELDS` would have forced the four siblings to grow the field and broken their drift=0 baseline, so the validator resolves the `/design:interface` record by name and exempts the rest.

The first implementer dispatch (cli-codex gpt-5.5 xhigh fast) crashed at startup with zero work — a transient failure, no partial edits. A clean re-dispatch completed all three edits. The orchestrator then verified acceptance independently: `node design-command-surface-check.mjs` returns `STATUS=PASS invalid=0 drift=0` (exit 0) with the interface `tasks` plus every record's prior fields green and the four siblings unaffected; `node --check` passes on the checker; `command-metadata.json` parses as valid JSON; and `git status` shows exactly the three intended targets changed, with `mode-registry.json`, `design-interface/SKILL.md`, and the four sibling wrappers byte-unchanged. The gate was confirmed to bite with a synthetic break — setting a `tasks[].lane` to a non-`INTENT_SIGNALS` value flips the checker to `STATUS=INVALID` "tasks lane set must match interface INTENT_SIGNALS missing=[...] extra=[BOGUS...]" (`invalid=1`) — and restoring returns it to `invalid=0 drift=0`. Every change is additive; scope held to exactly three files.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Enumerate all eleven lanes with a class, not just the obvious `--mode` ones | A caller needs to know which lane covers their interface task; classing the sibling, internal, and hidden lanes proves each is accounted for, not silently dropped behind the bridge |
| Reconcile the `tasks` lane set to the live `INTENT_SIGNALS` keys in the checker | Authoring the lanes once in prose would drift; binding them to the parsed router block makes the surface-check fail until `tasks` is updated whenever a router lane is added or removed |
| Keep the gate interface-targeted; do NOT add `tasks` to global `REQUIRED_FIELDS` | The four sibling records have no intent-lane surface; forcing the field on them would break their drift=0 baseline, so the validator resolves the interface record by name and exempts the rest |
| Class `UX_QUALITY` as `sibling-command` routed to `/design:audit` | Quality review is owned by audit; surfacing it as a named route prevents duplicating it as a new interface command — enforced by the negative-fixture guard |
| Record the transient crash + clean re-dispatch honestly | The first codex attempt crashed at startup with zero work; the re-dispatch did the real edits — the build is sound, but the failure is logged, not hidden |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node design-command-surface-check.mjs` | PASS `STATUS=PASS invalid=0 drift=0` (exit 0); interface `tasks` + all prior fields green |
| Interface `tasks` shape | 11 entries, each with non-empty `lane`/`label`/`class`/`surface` |
| `class` enum | every entry is one of `argument`/`sibling-command`/`internal`/`hidden`; the four named lanes (directions/preflight/redesign/handoff) are `argument` |
| Lane-set reconciliation | `tasks[].lane` set equals the 11 `INTENT_SIGNALS` keys parsed from `design-interface/SKILL.md` exactly (no missing, no extra) |
| INTERFACE TASK LANES section | `interface.md` carries the projected section: 6 argument labels + the `/design:audit` route + the not-surfaced/not-selectable internal-hidden notes |
| Negative-fixture guard | no lane promoted into the command set; no non-`argument` lane names a `/design:*` command as its `surface` |
| Synthetic break (orchestrator-verified) | a `tasks[].lane` set to a non-`INTENT_SIGNALS` value → `STATUS=INVALID` "tasks lane set must match interface INTENT_SIGNALS missing=[...] extra=[BOGUS...]" (`invalid=1`); restoring → `invalid=0 drift=0` |
| No-regression | `tasks` NOT in global `REQUIRED_FIELDS`; the 4 sibling records keep `drift=0`; only `interface.md` changed among the command docs |
| `node --check` on checker | PASS (valid ESM) |
| `command-metadata.json` JSON parse | PASS (5 records) |
| Non-mutation | `git status`: `mode-registry.json`, `design-interface/SKILL.md`, and the 4 sibling wrappers byte-unchanged |
| Scope | `git status`: exactly 3 files changed (interface record in metadata, `interface.md`, checker) |

### Test Coverage Summary

| Surface | Channel | Status |
|---------|---------|--------|
| `tasks` shape + `class` enum + lane-set == INTENT_SIGNALS + negative-fixture guard | Stage 1 `validateInterfaceTasks` | PASS |
| INTERFACE TASK LANES section + labels + sibling route + internal/hidden notes | Stage 2 `expectedInterfaceTaskLanesDrift` | PASS |
| Prior D2 (toolPolicy/argumentHint/SSOT/examples/contract/discriminator/preconditions/register/pipeline/userIntent) | full run | PASS, intact |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Residual generated-metadata errors are expected.** Strict `validate.sh` reports a `GENERATED_METADATA_INTEGRITY` source-fingerprint mismatch (and may report a level/synopsis drift) because `spec.md` and `implementation-summary.md` changed after the last metadata generation, and `description.json` still records `level "1"`. These are regenerated by the orchestrator via `generate-context.js`; they are not hand-written here.
2. **The first implementer dispatch crashed at startup.** The initial cli-codex gpt-5.5 xhigh fast attempt failed at startup with zero work (no partial edits). A clean re-dispatch completed the build. The crash was transient; it is recorded here for honesty, not because it left residue.
3. **Lane classes are authored, then machine-guarded for shape — not for taste.** The checker proves the lane set matches `INTENT_SIGNALS`, the `class` is in the enum, and no non-`argument` lane is promoted to a command. It does not judge whether a given lane's authored `class` is the semantically best fit; that mapping was authored against the `SKILL.md` lane semantics and is a deterministic command-surface contract, not a design-taste claim.
<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification addendum
- Post-implementation: interface tasks[] (11 INTENT_SIGNALS lanes, each classed) + INTERFACE TASK LANES wrapper section + Stage-1/Stage-2 interface-targeted gate
- Strictly additive; tasks NOT in global REQUIRED_FIELDS; mode-registry + SKILL.md + 4 siblings untouched; final surface-check invalid=0 drift=0
-->
