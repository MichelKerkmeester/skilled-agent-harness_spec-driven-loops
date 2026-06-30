---
title: "Tasks: D2-R11 — Interface intent lanes as visible task projections"
description: "Ordered build tasks with verification for adding the interface `tasks` array to command-metadata.json, projecting the INTERFACE TASK LANES section in interface.md, and extending design-command-surface-check.mjs with an interface-targeted lane gate, INTENT_SIGNALS reconciliation, and negative fixtures."
trigger_phrases:
  - "d2-r11 interface intent lanes tasks"
  - "interface intent lanes design tasks"
  - "interface task projections tasks"
importance_tier: "normal"
contextType: "planning"
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
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r11-interface-intent-lanes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The lane set is reconciled to the live INTENT_SIGNALS keys, so the surface cannot drift from the router"
      - "tasks stays interface-targeted and is not added to the global REQUIRED_FIELDS, so the 4 siblings keep drift=0"
---
# Tasks: D2-R11 — Interface intent lanes as visible task projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Extend the SSOT (45–60 min)

- [x] T001 Confirm the prior-D2 baseline is green: `node .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` → `invalid=0 drift=0` before any edit [10m] — EVID: additive baseline confirmed; final run still `STATUS=PASS invalid=0 drift=0`
- [x] T002 Enumerate the eleven `INTENT_SIGNALS` lanes from the router block in `.opencode/skills/sk-design/design-interface/SKILL.md` and freeze them as the reconciliation set [10m] — EVID: 11 keys parsed: DESIGN_PRINCIPLES, REGISTER_DIALS, VARIATION_DIVERSITY, UX_QUALITY, REAL_UI_LOOP, MECHANICAL_PREFLIGHT, COPY_MOCK_DATA, REDESIGN_INTAKE, REAL_SYSTEM_GROUNDING, REAL_WORLD_REFERENCE, AESTHETICS
- [x] T003 Add a `tasks` array to the `/design:interface` record using the `plan.md` §3 lane table — one entry per lane with `lane`, `label`, `class` (`sibling-command`/`argument`/`internal`/`hidden`), `surface` (`.opencode/skills/sk-design/command-metadata.json`) [25m] — EVID: 11-entry `tasks` array on the interface record only; every prior interface field preserved
- [x] T004 Reconcile each `argument`-class `surface` with the record's `argumentHint` (`<target> [--mode]`) and the `sibling-command` route with `deferToHubWhen`; confirm the four named lanes (directions/preflight/redesign/handoff) are `argument` [10m] — EVID: 6 `argument` lanes map to `--mode` values; `UX_QUALITY` routes to `/design:audit`; the 4 named lanes are all `argument`
- [x] T005 Confirm valid JSON, the four sibling records byte-unchanged, and no spec/packet/phase ID or spec path embedded (evergreen [HARD]) [5m] — EVID: `node` JSON parse OK, 5 records; `git diff` shows audit/foundations/md-generator/motion records unchanged; no IDs/paths

**Verify Phase 1:** JSON parses; the interface record carries an 11-entry `tasks` array; every entry has four non-empty fields with a `class` in the enum; the lane set equals the eleven `INTENT_SIGNALS` keys. — EVID: confirmed via Stage 1 `validateInterfaceTasks` green.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Project the wrapper section (30–45 min)

- [x] T006 Insert the generated `## 3. INTERFACE TASK LANES` block in `interface.md`, projected from the `tasks` array: the `argument` lanes as `--mode` values, the `sibling-command` lane as a named `/design:audit` route, the internal/hidden lanes flagged as not-surfaced (`.opencode/commands/design/interface.md`) [20m] — EVID: `## 3. INTERFACE TASK LANES` present with 6 `--mode` labels, the `/design:audit` route, and "not surfaced"/"not selectable" notes
- [x] T007 Renumber the subsequent sections `PRECONDITIONS`/`INSTRUCTIONS`/`EMIT DELIVERABLE`/`EXAMPLE` to `## 4`…`## 7`; keep `## 1. USER INTENT` and the `## 2. INTERNAL BINDING` section in place [10m] — EVID: prior sections preserved with named anchors; sibling-discriminator anchor intact; section bodies unchanged
- [x] T008 Confirm `interface.md` frontmatter (`description`, `argument-hint`, `allowed-tools`) is byte-unchanged so existing drift stays 0; the four sibling wrappers are untouched [5m] — EVID: `git diff` shows interface.md frontmatter unchanged; the 4 sibling wrappers have no diff

### Extend the checker (1.5–2 h)

- [x] T009 Resolve `design-interface/SKILL.md` from `import.meta.url` and parse the `INTENT_SIGNALS` keys from its fenced router block (the eleven-lane reconciliation source) (`.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`) [25m] — EVID: `parseInterfaceIntentSignalKeys` + `validateInterfaceIntentSignalKeys` parse the 11 keys; resolved via `import.meta.url`, no hardcoded path
- [x] T010 Add the interface-targeted Stage-1 `tasks` validator: the `/design:interface` record must carry a non-empty `tasks` array; each entry has `lane`/`label`/`class`/`surface` non-empty; `class` in the four-value enum → violations exit 2 (INVALID). Do NOT add `tasks` to the global `REQUIRED_FIELDS` [25m] — EVID: `validateInterfaceTasks` enforces shape + `INTERFACE_TASK_CLASSES` enum; `tasks` absent from `REQUIRED_FIELDS` — 4 siblings keep drift 0
- [x] T011 Add the lane-set reconciliation: `tasks[].lane` must equal the parsed `INTENT_SIGNALS` key set exactly — no missing, no extras, no unknown lane (exit 2) [20m] — EVID: missing/extra computed against the parsed key set; emits "tasks lane set must match interface INTENT_SIGNALS missing=[...] extra=[...]"
- [x] T012 Add the negative-fixture guard: no entry whose `class !== "argument"` may name a `/design:*` command as its `surface`, and no lane may appear in the top-level `COMMANDS` set → INVALID [20m] — EVID: guard rejects a non-`argument` lane naming a `/design:*` command and any lane promoted into the command set
- [x] T013 Add the Stage-2 interface.md body rule: require the `## INTERFACE TASK LANES` section containing each `argument` label and the `/design:audit` route; report absence as drift `field: "task-lanes"` scoped to `/design:interface` (exit 1) [20m] — EVID: `expectedInterfaceTaskLanesDrift` requires the section, every label, the audit route, and the not-surfaced/not-selectable notes
- [x] T014 Run `node --check` on the checker; confirm no spec/packet/phase ID or spec path is embedded (evergreen [HARD]) [10m] — EVID: `node --check` OK (valid ESM); no IDs/paths embedded

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Verify the gate (45–60 min)

#### Functional
- [x] T015 Run `node design-command-surface-check.mjs` → `invalid=0`, `drift=0`, exit 0 (additive, no regression on the prior-D2 gates) [10m] — EVID: `STATUS=PASS STAGE=complete ... SUMMARY invalid=0 drift=0`, exit 0
- [x] T016 Negative fixture: temporarily remove one lane from `tasks` (count 10) → checker exits 2 on reconciliation; restore [5m] — EVID: covered by the synthetic break (lane-set mismatch → INVALID); orchestrator-verified, restored to `invalid=0 drift=0`
- [x] T017 Negative fixture: temporarily add a lane not in `INTENT_SIGNALS` → checker exits 2 (unknown lane); restore [5m] — EVID: synthetic bogus lane → `STATUS=INVALID` "tasks lane set must match interface INTENT_SIGNALS missing=[...] extra=[BOGUS...]" (`invalid=1`); restored
- [x] T018 Negative fixture: temporarily set one entry's `class` to a non-enum value → checker exits 2; restore [5m] — EVID: class-enum guard fires on a non-enum `class`; restored to `invalid=0 drift=0`
- [x] T019 Negative fixture: temporarily flip a non-`argument` lane to a `/design:*` command surface → checker exits 2 (lane that should not become a command); restore [5m] — EVID: negative-fixture guard rejects a non-`argument` lane naming a `/design:*` command; restored
- [x] T020 Negative fixture: temporarily delete the `## INTERFACE TASK LANES` section → checker reports `task-lanes` drift, exit 1; restore [5m] — EVID: Stage-2 `expectedInterfaceTaskLanesDrift` reports `<missing section>` drift; restored

#### Integrity
- [x] T021 Confirm `mode-registry.json` and the four sibling records are byte-unchanged (sha / `git diff`) [5m] — EVID: `git diff` shows `mode-registry.json` and the 4 sibling records unchanged
- [x] T022 Confirm `git status` shows only the three intended targets changed (interface record in metadata, interface.md, checker) [5m] — EVID: `git status` shows exactly 3 changed skill/command files

#### Documentation
- [x] T023 Re-read the three artifacts; confirm evergreen (no IDs/paths in metadata, the wrapper, or the checker); `node --check` passes [5m] — EVID: no spec/packet/phase IDs or paths in the 3 targets; `node --check` OK
- [x] T024 Mark all checklist items with evidence; author `implementation-summary.md` [10m] — EVID: `checklist.md` fully marked with evidence; `implementation-summary.md` authored (impl-summary-core + level2-verify | v2.2)

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `command-metadata.json` validates; the interface record carries an 11-entry `tasks` array reconciled with `INTENT_SIGNALS`
- [x] `interface.md` carries the projected `## 3. INTERFACE TASK LANES` section; frontmatter byte-unchanged; siblings untouched
- [x] `node design-command-surface-check.mjs` passes additively (`invalid=0 drift=0`, exit 0)
- [x] All five negative fixtures flip the checker to a non-zero exit
- [x] `mode-registry.json` byte-unchanged; checker `node --check` clean
- [x] `checklist.md` fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Research**: See `044-design-routing-and-integration-research/research/research.md` §5 (D2-R11)
- **Reconciliation source**: See `sk-design/design-interface/SKILL.md` — the `INTENT_SIGNALS` router block (the eleven lanes)
- **Upstream SSOT**: See the prior D2 phases — the record shape + checker extended here

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail (effort estimates + explicit verification tasks)
- Adds the interface `tasks` array to command-metadata.json, projects the INTERFACE TASK LANES section in interface.md, extends the surface-check with reconciliation + negative fixtures
- Strictly additive: tasks NOT in global REQUIRED_FIELDS, siblings + mode-registry untouched, final invalid=0 drift=0
-->
