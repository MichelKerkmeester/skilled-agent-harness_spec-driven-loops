---
title: "Feature Specification: Phase 1: restraint-routing"
description: "Requests that ask for restraint (yagni, simplest solution, over-engineering, bloat) reach the sk-code quality mode, and a new doctor check fails on sk-code when its registry aliases, description keywords or canary routes drift from the router vocabulary."
trigger_phrases:
  - "restraint routing"
  - "phase 1 restraint routing"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: restraint-routing

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `scaffold/001-restraint-routing` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-review-contract |
| **Handoff Criteria** | Completion criteria C1 to C6 in goal.md pass from the final state, and the seven-hub run in C4 exits 0 for every hub |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Round two research recommendations specification.

**Scope Boundary**: The sk-code router vocabulary, the sk-code-quality mode aliases, the sk-code description keywords, one ROUTER.md row, one canary case, and one doctor check (5k) with its tests. No SKILL.md edit, no version bump, and no change to another hub's vocabulary.

**Dependencies**:
- Recommendation 1 of the second research round, ranked in section 7 of `../../001-ponytail-deep-research/research/lineages/r2-dsflash-llmgw/research.md`.
- The parent goal's D4: a new check that flags another hub's existing drift reports a warning, not a failure.
- The fixture copy and manifest re-mint steps in `../../002-surface-contract-alignment/tasks.md` (T034 and T035).

**Deliverables**:
- The restraint vocabulary on the quality mode in hub-router.json, mode-registry.json, description.json and ROUTER.md
- One single-mode canary case, copied to its authored copy, and a re-minted sk-code manifest
- Check 5k in parent-skill-check.cjs with legs alias, packet and canary, and a test for each leg

**Changelog**:
- No changelog entry is written by this phase. The hub version stays at 2.2.4.0 because the release authority is SKILL.md, which is out of scope, and the 002 and 004 phases wrote none. plan.md section 6 records the decision. The orchestrator decides any packet-level entry.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
At stage two, requests that ask for restraint reach no sk-code mode. The compiled route for `this module is over-engineered, apply yagni and find the simplest solution` returns `defer` today, and `rg -i -c 'yagni|simplif|over-?engineer|bloat'` finds no match in hub-router.json, mode-registry.json, description.json, ROUTER.md or the canary fixture. Stage one is partly covered already. The advisor sends `Simplify this code, it is bloated and over-engineered` to sk-code at 0.82, but it returns no hub for the yagni phrase at threshold 0.8. Nothing checks that the registry aliases, the router vocabulary, the description keywords and the canary corpus agree, so a gap like this stays silent.

### Purpose
A restraint request routes to sk-code-quality, and the four lexical surfaces of sk-code cannot drift apart without the doctor failing on sk-code.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the `quality-restraint` vocabulary class and attach it to the quality signal (REQ-002)
- Add the restraint aliases to the sk-code-quality mode and the restraint keywords to description.json (REQ-002, REQ-007)
- Name restraint and simplification requests in the ROUTER.md intent table (REQ-008)
- Add one single-mode canary case, copy it to the authored fixture, and re-mint the manifest (REQ-001, REQ-005)
- Add check 5k to parent-skill-check.cjs with the alias, packet and canary legs, plus their tests (REQ-003)

### Out of Scope
- Any SKILL.md edit: another child regenerates the Hermes copies in parallel, and a SKILL.md edit would land in its diff
- A version bump and a changelog entry: the hub release version lives in SKILL.md, so a bump needs that edit
- The advisor's stage-one graph: the sk-code graph-metadata.json derived fields are not regenerated here
- The machine-readable block in ROUTER.md section 11, which the replay consumers read
- Repairing the drift other hubs already carry: it is recorded and warned, not fixed
- `.skilled/agents` and `.skilled/repo-rules`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/hub-router.json` | Modify | Add the `quality-restraint` class and reference it from the `sk-code-quality` signal |
| `.skilled/skills/sk-code/mode-registry.json` | Modify | Add three aliases to the `sk-code-quality` mode |
| `.skilled/skills/sk-code/description.json` | Modify | Add four keywords |
| `.skilled/skills/sk-code/ROUTER.md` | Modify | Name restraint and simplification in the section 2 CODE_QUALITY row only |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | Modify | Add one single-mode canary case |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | Modify | Byte copy of the canary fixture above, the authored source that compiled-route-sync.cjs rebuilds from |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` | Regenerate | Written by the refresh command, never edited by hand |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json` | Modify | Byte copy of the manifest above |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Modify | Check 5k, its warn-only table and one call in main() |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` | Modify | Clean-fixture keywords, two FAILING_CASES rows, and two tests for canary and warn-only severity |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/001-restraint-routing/` | Create | This folder: scratch baselines, the derived metadata and implementation-summary.md |

Read only, never edited: `.skilled/skills/system-skill-advisor/runtime/tests/parent-skill-check-fixtures.vitest.ts`, `.skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh`, and the sk-code and sk-doc SKILL.md files named in tasks.md T012.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A restraint request routes to sk-code-quality, and every canary case passes | `compiled-route.cjs --hub sk-code` on the canary prompt returns action `route`, selection `single`, target `sk-code-quality` and no `servingAuthority` key. The canary assertion prints `cases 11 failures 0` |
| REQ-002 | The quality mode owns the restraint vocabulary | hub-router.json has class `quality-restraint`, listed in `routerSignals["sk-code-quality"].classes`. mode-registry.json lists `yagni`, `simplest solution` and `over-engineering check` among that mode's aliases |
| REQ-003 | Check 5k exists with alias, packet and canary legs, passes on sk-code, and has one test per leg | parent-skill-check on sk-code prints `PASS: 5k-alias`, `PASS: 5k-packet` and `PASS: 5k-canary`, exit 0. The invariants suite passes with a 5k-alias row, a 5k-packet row, a 5k-canary test and a warn-only test |
| REQ-004 | No hub gains a failure | All seven hubs exit 0 after the change. The drift that mcp-tooling, sk-design, sk-doc and system-deep-loop already carry reports as warnings, and plan.md section 3 names each one |
| REQ-005 | The sk-code manifest is re-minted, fresh, and matches its authored copies | The refresh command reports `"fresh":true` and `"refreshed":true`. `compiled-route-guard.cjs` lists sk-code fresh with exit 0. Both authored copies are byte-identical to their promoted files |
| REQ-006 | The sk-code drift guards pass | `run-all-drift-guards.sh` prints `run-all-drift-guards: all 3 guards PASSED`, exit 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | description.json carries the restraint keywords | `restraint`, `yagni`, `over-engineering` and `simplification` each appear once in the keywords array, and the file parses as JSON |
| REQ-008 | ROUTER.md section 2 names restraint and simplification requests | The CODE_QUALITY row names them. `validate_document.py` on ROUTER.md reports the same result as before the change |
| REQ-009 | Each new alias is replayed against an out-of-domain phrase, and both routing stages are recorded | The replay outputs are saved in scratch/. The stage-one advisor output is saved before and after. Any route that an out-of-domain phrase triggers is reported as a finding |
| REQ-010 | Only the listed paths change | `git status --porcelain` over the touched paths lists exactly the ten files in the table above. SKILL.md, `.skilled/agents` and `.skilled/repo-rules` are unchanged |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The canary prompt moves from `defer` to a single `sk-code-quality` route.
- **SC-002**: Drift fails check 5k on sk-code and only warns on a warn-only hub.
- **SC-003**: The compiled guard and the drift guards pass from the final state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Sibling children of 008 edit the sk-code tree in parallel | A byte change after the re-mint leaves the manifest stale | The re-mint is the last sk-code edit in tasks.md. The final gate reruns the guard, and the scope check names every path |
| Dependency | Leg (c) reads `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout` | A checkout without the compiled tree skips leg (c) | A skipped leg prints INFO, not PASS. C3 requires the `PASS: 5k-canary` line on sk-code |
| Risk | Warn-only applies per hub and per leg | A new alias drift on mcp-tooling, sk-design, sk-doc or system-deep-loop under the listed legs only warns | Plan section 3 names every item that warns today. The orchestrator can narrow the table to single items |
| Risk | The alias `simplest solution` matches work outside code | A non-code request could reach the quality mode | REQ-009 replays it against an out-of-domain phrase. A finding is reported, and the alias is not narrowed without a yes |
| Risk | Stage one may not read the new keywords | The advisor could keep returning no hub for the yagni phrase | The recorded source_docs of the sk-code graph do not list description.json. REQ-009 records the before and after advisor output, and the result is reported as measured |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Answered by the orchestrator, 2026-10-10: no version bump and no changelog entry. Phases 002 to 007 changed sk-code without either, and both need a SKILL.md edit this phase does not make.
- Answered: no. Advisor accuracy belongs to its own packet, and the planning probe shows stage one already sends "Simplify this code, it is bloated and over-engineered" to sk-code at 0.82.
- Answered: keep the table per leg. The parent goal's D4 asks for warnings on drift that already exists, and a per-item list would be a hardcoded allowlist that rots as aliases change.
<!-- /ANCHOR:questions -->

---
