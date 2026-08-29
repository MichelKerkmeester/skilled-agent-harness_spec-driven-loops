---
title: "Feature Specification: sk-code-obsidian Manual Testing Playbook"
description: "Routing-recall manual testing playbook for the sk-code-obsidian surface packet — seven scenarios (OB-001..OB-007) across the surface's five real intents, matching sk-code-mobile-cli's playbook shape."
trigger_phrases:
  - "sk-code-obsidian manual testing playbook"
  - "obsidian surface routing scenarios"
  - "OB-001 through OB-007"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/007-sk-code-obsidian-surface/007-manual-testing-playbook"
    last_updated_at: "2026-08-28T22:10:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored playbook scenarios"
    next_safe_action: "Author 008 scanners"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-obsidian-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "IMPLEMENTATION and CODE_QUALITY are the two doubled intents, chosen because they carry this surface's sharpest documented traps (operator, 2026-08-28)"
---
# Feature Specification: sk-code-obsidian Manual Testing Playbook

> Phase chain: parent [`../spec.md`](../spec.md), predecessor `006-assets-checklists`, successor
> `008-scanners-and-gates`.

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-28 |
| **Branch** | `worktrees/001-sk-code-obsidian-surface` |
| **Wave** | 1 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Before this phase, `sk-code-obsidian/` had no `manual-testing-playbook/` at all — `../goal.md` §6
names it explicitly as one of four items still missing against the `sk-code-mobile-cli` template
shape. Without it, nothing exercises the surface's `SKILL.md` §2b `INTENT_SIGNALS`/`RESOURCE_MAP`
routing contract against a reproducible operator scenario: a change to `SKILL.md` §2b could silently
break which reference/asset set a given prompt loads, and no test would catch it.

A second, sharper problem surfaced while grounding this phase's scenarios in the live packet
directory: `SKILL.md` §2b's `RESOURCE_MAP` names several reference and asset filenames that do not
exist in the shipped tree. `references/single-stylesheet-ownership.md`,
`references/screenshot-fixture-harness.md`, and `references/obsidian-api-boundary.md` are really
`references/stylesheet-ownership.md`, `references/screenshot-harness.md`, and
`references/obsidian-plugin-api.md`; `assets/renderer-implementation-checklist.md`,
`assets/comment-grammar-checklist.md`, and `assets/debug-checklist.md` do not exist at all — phase
`006-assets-checklists` shipped a different seven-name checklist set
(`screenshot-coverage-checklist.md`, `db-class-rename-checklist.md`,
`fixture-authoring-checklist.md`, `verification-checklist.md`, `folder-docs-checklist.md`,
`comment-banner-checklist.md`, `modal-coverage-checklist.md`). This mirrors the same five-vs-seven
drift `006-assets-checklists/spec.md` §2 already recorded against `SKILL.md` §4's checklist list.

### Purpose

Author `manual-testing-playbook/manual-testing-playbook.md` plus one scenario file per row, IDs
`OB-001` through `OB-007`, under `sk-code-obsidian/`, matching `sk-code-mobile-cli/manual-testing-
playbook/`'s exact shape (frontmatter, upper-case numbered sections, the result-persistence
contract block). The corpus covers all five of this surface's real intents — `IMPLEMENTATION`,
`CODE_QUALITY`, `DEBUGGING`, `VERIFICATION`, `STACK_STANDARDS` — with `IMPLEMENTATION` and
`CODE_QUALITY` doubled to seven scenarios total, and every `expected_resources` path grounded in the
live packet directory rather than in `SKILL.md` §2b's stale map, with the drift recorded rather than
silently repaired (`SKILL.md` is outside this phase's write boundary).

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md` — the root index, carrying
  the `MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT` marker retargeted to
  `sk-code-obsidian/benchmark/reports/<dated-run-label>/`.
- Seven scenario files, `OB-001` through `OB-007`, one per row in the root index's table.
- Replacing this leaf's own `spec.md`, `plan.md`, and `tasks.md` scaffolds with real content.

### Out of Scope

- `sk-code-obsidian/SKILL.md`, `README.md`, `references/`, `assets/`, and any hub routing file
  (`mode-registry.json`, `hub-router.json`, `ROUTER.md`, `shared/references/stack-detection.md`) —
  frozen for this phase; `SKILL.md` §2b's stale filenames are recorded in scenario failure-triage
  sections, never silently corrected here.
- `changelog/` and `scripts/run-source-gates.sh` — phases 008 and 011.
- Any change to the plugin's `src/`, `tools/`, or `styles.css` — phases 009-010.
- Building or running the Lane C harness (`run-skill-benchmark.cjs`) or the manual-scenario
  completion wrapper (`run-manual-playbook-scenario.cjs`) — this phase authors the corpus those
  tools consume; it does not execute a run.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md` | Create | Root index: scenario table, surface-detection assumption, result-persistence contract, doubled-intent rationale |
| `sk-code-obsidian/manual-testing-playbook/renderer-feature-routing.md` | Create | OB-001, IMPLEMENTATION — new renderer/row-pipeline column type |
| `sk-code-obsidian/manual-testing-playbook/modal-screenshot-routing.md` | Create | OB-002, IMPLEMENTATION — screenshot scenario for an unphotographed modal |
| `sk-code-obsidian/manual-testing-playbook/db-class-rename-routing.md` | Create | OB-003, CODE_QUALITY — `.db-*` class rename across `styles.css` |
| `sk-code-obsidian/manual-testing-playbook/folder-docs-routing.md` | Create | OB-004, CODE_QUALITY — the folder-doc pairing threshold |
| `sk-code-obsidian/manual-testing-playbook/debugging-routing.md` | Create | OB-005, DEBUGGING — a renderer drawing outside its frame on mobile |
| `sk-code-obsidian/manual-testing-playbook/verification-routing.md` | Create | OB-006, VERIFICATION — proving a change against the measured gate baseline |
| `sk-code-obsidian/manual-testing-playbook/stack-standards-routing.md` | Create | OB-007, STACK_STANDARDS — the Obsidian API boundary |
| `spec.md` | Replace scaffold | This document |
| `plan.md` | Replace scaffold | The execution plan for producing the eight-file corpus |
| `tasks.md` | Replace scaffold | The task breakdown for this phase |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Shape parity with `sk-code-mobile-cli/manual-testing-playbook/` | The root index carries the same intro/table/assumption-paragraph/result-persistence-contract shape; every scenario file carries the template's frontmatter keys and the five upper-case numbered sections (`OVERVIEW`, `SCENARIO CONTRACT`, `TEST EXECUTION`, `SOURCE FILES`, `SOURCE METADATA`). |
| REQ-002 | All five real intents covered, seven scenarios total | `IMPLEMENTATION`, `CODE_QUALITY`, `DEBUGGING`, `VERIFICATION`, `STACK_STANDARDS` each appear at least once; `IMPLEMENTATION` and `CODE_QUALITY` each appear twice. |
| REQ-003 | Every `expected_resources` path resolves under the skill root | Verified with `test -e` per path before being written into any scenario's frontmatter; 23 paths checked across the seven scenarios, all present. |
| REQ-004 | No invented `.db-*` class or fabricated file path | Every class name (`.db-board-card-field`), modal filename (`FormulaModal.ts`), and reference/asset path cited in any scenario was checked against `styles.css`, `src/`, `tools/screenshots/`, or the live `sk-code-obsidian/` directory tree — never invented for the example. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The `SKILL.md` §2b drift is recorded, not silently resolved | The root index and the affected scenarios' Failure Triage sections name the specific stale filenames (`single-stylesheet-ownership.md`, `screenshot-fixture-harness.md`, `obsidian-api-boundary.md`, `renderer-implementation-checklist.md`, `comment-grammar-checklist.md`, `debug-checklist.md`) against their real counterparts, since `SKILL.md` is outside this phase's write boundary. |
| REQ-006 | Doubled-intent choice is justified | The root index states why `IMPLEMENTATION` and `CODE_QUALITY` are the two doubled intents, tying each to a specific documented risk in `SKILL.md` §3/§3b rather than an arbitrary split. |
| REQ-007 | Result-persistence contract retargeted correctly | The root index's `MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT` block points at `sk-code-obsidian/benchmark/reports/<dated-run-label>/`, not the mobile-cli path it was copied from. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `manual-testing-playbook/manual-testing-playbook.md` plus seven scenario files exist
  under `sk-code-obsidian/`, IDs `OB-001` through `OB-007`.
- **SC-002**: Every scenario's `expected_surface` reads `OBSIDIAN`, `version` reads `1.0.0.0`, and
  `expected_intent` matches the root index's table.
- **SC-003**: All 23 `expected_resources` paths across the seven scenarios resolve under
  `sk-code-obsidian/` — verified this session with a `test -e` loop, not assumed from `SKILL.md`.
- **SC-004**: `spec.md`, `plan.md`, and `tasks.md` in this folder contain no scaffold placeholder
  text (`REQUIREMENT_PLACEHOLDER`, bare `**Given**`, or similar).
- **SC-005**: No scenario instructs execution of a Pi-Remote-style app command or a live plugin
  action; every scenario validates routing evidence only, matching the mobile-cli template's own
  "not on executing any... command directly" framing.

### Acceptance Scenarios

- **Scenario 1**: **Given** `sk-code-mobile-cli/manual-testing-playbook/token-edit-routing.md`
  states its scenario is "not on executing any Pi Remote app command directly, since `app-mobile/`
  does not live in this repository," **when** any `sk-code-obsidian` scenario's `## 1. OVERVIEW` is
  read, **then** it states the equivalent: the scenario validates which evidence loads, not the
  plugin behavior itself.
- **Scenario 2**: **Given** `SKILL.md` §2b's `IMPLEMENTATION` entry names
  `assets/renderer-implementation-checklist.md`, which does not exist, **when** `OB-001`'s Failure
  Triage section is read, **then** it names the real filename gap explicitly rather than silently
  substituting a different path without comment.
- **Scenario 3**: **Given** all seventeen files under `src/views/modals/` are unphotographed today,
  **when** `OB-002`'s prompt is read, **then** it names a real, currently-unphotographed modal
  (`FormulaModal.ts`, confirmed absent from `tools/screenshots/` this session) rather than a
  generic or invented modal name.
- **Scenario 4**: **Given** `npm run lint` carries a measured baseline of 115 problems, **when**
  `OB-006`'s desired user-visible outcome is read, **then** it requires reporting the lint delta
  against that baseline, not a bare "lint passes" claim.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `SKILL.md` §2b names filenames absent from the shipped tree | An operator following `SKILL.md` §2b's `RESOURCE_MAP` literally looks for `single-stylesheet-ownership.md` or `renderer-implementation-checklist.md` and finds neither | Every scenario's `expected_resources` uses only live, `test -e`-verified paths; the drift is named explicitly in the root index and in the affected scenarios' Failure Triage sections rather than hidden |
| Risk | A cited class, modal, or count drifts after this phase | A future operator follows a stale example (`FormulaModal.ts` gains a fixture, `.db-board-card-field` gets renamed by other work) | Each scenario's Failure Triage step names the specific live check (`grep`, `test -e`) to re-run before treating the scenario as broken |
| Dependency | `sk-code-mobile-cli/manual-testing-playbook/` as the shape template | Frontmatter keys, five-section order, result-persistence contract wording | Read in full (index plus `token-edit-routing.md` and `debugging-routing.md` closely) before drafting; `../goal.md` §3 makes deviation a frozen-constraint violation |
| Dependency | `sk-code-obsidian/references/` and `assets/` (phases 004-006) | The real, live paths every `expected_resources` list cites | Both directories already shipped; every path checked against them this session |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:edge-cases -->
## 7. EDGE CASES

### Structural Boundaries
- **A scenario needs to reference `SKILL.md` §2b's stale filename alongside the real one**: the
  Failure Triage section names both explicitly (stale path first, real path second), never silently
  substituting one for the other without comment.
- **`006-assets-checklists`' seven checklists don't map one-to-one onto `SKILL.md` §4's five-name
  proposal**: this phase's scenarios cite only the real, shipped checklist filenames; reconciling
  `SKILL.md` §4 itself remains `006-assets-checklists/spec.md` §8's deferred open question, not
  reopened here.

### Grounding Boundaries
- **A claim that cannot be checked against a real file**: none is made; every class name, modal
  filename, reference path, asset path, and command cited across the eight files was verified this
  session (`test -e`, `grep`, `wc -l`).

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Eight markdown files (one index, seven scenarios, ~1,600 lines total), no code, no skill-routing files touched |
| Risk | 5/25 | Read-only routing-recall authoring; nothing here executes against the plugin |
| Research | 12/20 | Required reading spans `sk-code-mobile-cli/manual-testing-playbook/` (index plus two scenario files), `sk-create-manual-testing-playbook/SKILL.md`, `sk-code-obsidian/SKILL.md` §2b, the live `references/`/`assets/` directories, and plugin source (`styles.css`, `src/views/modals/`, `tools/screenshots/`) |
| **Total** | **29/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

All resolved for this phase; one item is explicitly deferred rather than answered here:
- **Reconciling `SKILL.md` §2b's `RESOURCE_MAP` filenames against the real `references/`/`assets/`
  tree**: deferred — `SKILL.md` is outside this phase's write boundary. A future phase (or an
  amendment to `004-skill-core`) should update `SKILL.md` §2b's `RESOURCE_MAP` to match the real
  filenames phases 005 and 006 actually shipped.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent Spec**: [`../spec.md`](../spec.md)
- **Packet Goal**: [`../goal.md`](../goal.md)
- **Packet Roadmap**: [`../roadmap.md`](../roadmap.md)
- **Checklist Precedent**: [`../006-assets-checklists/spec.md`](../006-assets-checklists/spec.md)
- **Template**: `$HUB/.opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Deliverables**: `$HUB/.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/` (eight files)

<!-- /ANCHOR:related-docs -->
