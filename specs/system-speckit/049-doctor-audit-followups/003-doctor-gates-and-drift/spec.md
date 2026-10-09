---
title: "Feature Specification: Phase 3: doctor-gates-and-drift"
description: "The doctor's mutation-class gate covers one MCP skill where it once covered four, three test fixtures cannot load their shared module, the route validator never checks workflow activities, and several doctor texts and counts are wrong. This phase plans each correction and the one verification the audit never ran."
trigger_phrases:
  - "doctor gates drift"
  - "mutation class coverage"
  - "parent skill fixtures"
  - "route validate activities"
  - "env reference count"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 3: doctor-gates-and-drift

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The doctor command audit recorded nine defects in the doctor's own gates and texts. The mutation-class guard now reads a manifest that lists only Code Mode, so three MCP CLI skills lost their contract coverage. Three `parent-skill-check-*.test.cjs` suites fail because their temporary fixtures cannot resolve `@spec-kit/shared/frontmatter/parse-frontmatter.js`. `route-validate` checks script paths but never the workflow activities that invoke them. Several tooling texts name the wrong thing, one count is stale, one baseline points at a deleted corpus, and the speckit presentation uses a generic `/doctor` form that no command file registers. Two statements in the closed audit packet's own documents are also out of date. This phase plans each correction, and records the one comparison the audit never made — user-global Codex hook parity, which passes on this checkout.

**Key Decisions**: The mutation-class guard gets its own manifest so its coverage stops depending on a Code Mode workflow; the fixture failure is fixed at module resolution, not by weakening the assertion; the generic `/doctor` text is aligned to the command the loader actually registers unless the build finds a reason to add a root file.

**Critical Dependencies**: The pre-commit hook that invokes the mutation guard; the parent-skill checker's contract-library loading path; the command contract's naming rules for the `/doctor` family.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-03 |
| **Branch** | `worktrees/079-doctor-command-audit` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-release-update-customization-signals |
| **Successor** | None |
| **Handoff Criteria** | Every acceptance criterion is Met, Waived or Superseded, and the doctor gates this phase touches exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Fix the spec-kit defects the doctor command audit recorded specification.

**Scope Boundary**: The doctor's gate scripts and their tests, the doctor presentation and tooling text, the env reference count, the fable baseline, and the two closed-packet document corrections. The doctor workflows' execution logic and the audited subsystems are out of scope.

**Dependencies**:
- `.skilled/scripts/git-hooks/pre-commit` invokes `check-mcp-mutation-class.sh`, so the guard's manifest path must stay resolvable from that hook.
- The parent-skill checker resolves its contract libraries relative to the target hub; the fixture copies must resolve the same module graph.
- `route-validate.sh` parity and `command-catalog-mirror-check.cjs` must stay green through the presentation edits.

**Deliverables**:
- A guard-owned manifest restoring coverage for `mcp-figma`, `mcp-chrome-devtools` and `mcp-click-up`, with the guard reading it.
- Three passing `parent-skill-check-*.test.cjs` suites with the module-resolution fix.
- A `route-validate` assertion that covers workflow activities, plus its self-test.
- Recorded Codex hook parity, corrected tooling texts and counts, a corrected fable baseline, an aligned presentation, and the two closed-packet corrections.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Nine defects recorded across the audit remain open. The mutation-class guard reads `servers:` and `cli_skill_diagnostics:` from `doctor-mcp-install.yaml`, which now declares only `code_mode`, so `mcp-figma`, `mcp-chrome-devtools` and `mcp-click-up` lost their `mutating`/`read-only` coverage even though all six of their scripts exist. Three `parent-skill-check-*.test.cjs` suites fail with `FAIL: 12-lib: failed to load the root-router contract library: Cannot find module '@spec-kit/shared/frontmatter/parse-frontmatter.js'`; the same failure reproduces in the main checkout, so it is a fixture-resolution defect, not worktree noise. `route-validate.py` asserts only that `script_invocations` paths exist (`:18`, `:422-430`), so a passing run says nothing about whether a workflow activity invokes them. The skill-budget surface still carries wrong text: the rebuild presentation calls the target an "Advisor budget/status helper" (`doctor-rebuild-presentation.txt:172`), `audit_descriptions.py:290` prints "(Packet 086)", both `quick_validate.py` copies carry "(packet 086)" in the docstring, and the Claude budget is hardcoded at 8000 (`audit_descriptions.py:69`) instead of reading `SLASH_COMMAND_TOOL_CHAR_BUDGET`. `ENV-REFERENCE.md:34` states 144 variables while its tables hold more. `fable-baseline.json:2` points at a corpus that is gone. The speckit presentation uses `/doctor <target>` forms (`:3,31,41,79,86`) but no `.skilled/commands/doctor.md` exists; the router is `doctor/speckit.md`. Separately, the audit never compared the user-global Codex hook file; the planning run made that comparison with `--allow-worktree` and it passes (exit 0), so this phase records it rather than repairing it.

### Purpose
Restore the coverage the gates claim, make the failing fixtures pass, extend the route validator to the activities it never checked, and leave the doctor's texts and counts matched to what the tools do — with the closed packet's own documents corrected so they stop describing a tree that moved.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A guard-owned mutation-class manifest with the three MCP CLI skills restored, and the guard reading it.
- A fixture-resolution fix for the three `parent-skill-check-*.test.cjs` suites.
- A `route-validate` assertion over workflow activities, with a self-test fixture that fails when an activity is missing.
- Recorded user-global Codex hook parity (no repair unless the check reports drift).
- The four skill-budget text corrections, the env-reference recount, the fable-baseline correction, and the presentation's generic `/doctor` forms.
- Two corrections to `048`'s closed documents: the `003-update` Phase Context and two statements in `013`'s implementation summary.

### Out of Scope
- Changing the audit's verdicts or re-auditing any doctor target.
- Repairing the mcp CLI skills themselves; only their contract coverage is restored.
- Exercising any mutating doctor workflow on the live checkout.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/check-mcp-mutation-class.sh` | Modify | Read the guard-owned manifest |
| `.skilled/commands/doctor/assets/doctor-mcp-mutation-manifest.yaml` | Create | Four skills with install/doctor classes |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-*.test.cjs` | Modify | Resolve `@spec-kit/shared` from the fixture |
| `.skilled/commands/doctor/scripts/route-validate.py` | Modify | Assert workflow activities |
| `.skilled/commands/doctor/scripts/route-validate.sh` | Modify | Self-test fixture for the new assertion |
| `.skilled/commands/doctor/assets/doctor-rebuild-presentation.txt` | Modify | Skill-budget row text |
| `.skilled/commands/doctor/scripts/audit_descriptions.py` | Modify | Report title; read the budget env var |
| `.skilled/skills/sk-doc/scripts/quick_validate.py` | Modify | Docstring packet label |
| `.skilled/skills/sk-doc/shared/scripts/quick_validate.py` | Modify | Docstring packet label |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modify | Stated variable count |
| `.skilled/skills/system-spec-kit/runtime/cli/metrics/fable-baseline.json` | Modify | Dead corpus target |
| `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt` | Modify | Generic `/doctor` forms |
| `specs/system-speckit/048-doctor-command-audit/003-update/spec.md` | Modify | Phase Context reflects the redesign |
| `specs/system-speckit/048-doctor-command-audit/013-speckit-retrieval/implementation-summary.md` | Modify | Drop the dead pattern claim; name `/doctor:rebuild` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The mutation-class guard reads a manifest that is independent of `doctor-mcp-install.yaml` and covers `mcp-figma`, `mcp-chrome-devtools` and `mcp-click-up` alongside Code Mode, with their install and doctor classes |
| REQ-002 | The three `parent-skill-check-*.test.cjs` suites pass because their fixtures resolve `@spec-kit/shared/frontmatter/parse-frontmatter.js`, not because an assertion was weakened |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | `route-validate` verifies workflow activities: every route script invocation is accounted for in its workflow asset, and a self-test fixture fails when one is missing |
| REQ-005 | The skill-budget tooling text is corrected: the presentation row, the audit report title, both `quick_validate.py` docstrings, and the Claude budget reads `SLASH_COMMAND_TOOL_CHAR_BUDGET` with an 8000 fallback |
| REQ-006 | `ENV-REFERENCE.md`'s stated variable count equals a mechanical recount by the document's own method |
| REQ-007 | `fable-baseline.json` no longer points at a deleted corpus; the wrapper's behavior is verified either way |
| REQ-008 | The speckit presentation's generic `/doctor` forms name the command the loader registers, and the route and catalog gates stay green |
| REQ-009 | The two closed-packet statements are corrected: `048/003-update/spec.md` Phase Context and `048/013-speckit-retrieval/implementation-summary.md` (dead `doctor_*.yaml` claim; `/doctor:rebuild` owns regeneration) |

### P2 - Optional

| ID | Requirement |
|----|-------------|
| REQ-004 | The user-global Codex hook parity comparison is recorded in the phase evidence; a drift report triggers a repair, an OK report closes the finding |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash .skilled/commands/doctor/scripts/check-mcp-mutation-class.sh` exits 0 and its output names all four installers and the three CLI doctor scripts.
- **SC-002**: `node --test` over the three `parent-skill-check-*.test.cjs` files reports zero failures.
- **SC-003**: `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 with the new activity assertion, and its `--self-test` fails the fixture that omits an activity.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Pre-commit hook invoking the guard | A moved manifest path breaks the hook | Keep the guard's default path and update its header comment; run the pre-commit test |
| Risk | Activity assertion produces false failures on legitimate one-off scripts | Gate noise blocks unrelated work | Allow an explicit declared exception list, and prove the assertion with the self-test |
| Risk | Presentation reword breaks J1 parity | `route-validate.sh` fails | Run the validator after every presentation edit |
| Risk | Editing closed packets breaks their validation | Closed packets stop passing | Rerun `validate.sh --strict` on both edited packets |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The guard stays a single manifest read plus one scan per script; the activity assertion adds one YAML parse per route.

### Security
- **NFR-S01**: No new network or credential surface; the Codex hook check reads a user-global file and writes nothing.

### Reliability
- **NFR-R01**: The new assertions fail closed with a named rule id, and every existing rule id keeps its meaning.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: an empty manifest fails the guard with exit 2 rather than passing silently.
- Maximum length: the manifest is a hand-maintained list; the guard names any listed script that is missing.

### Error Scenarios
- External service failure: not applicable; every check is local.
- Network timeout: not applicable; the Codex hook check is a file comparison.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: 14, LOC: ~250, Systems: 4 (guard, fixtures, validator, docs) |
| Risk | 10/25 | Auth: N, API: N, Breaking: N |
| Research | 10/20 | Each finding was re-checked; the presentation naming needs one decision |
| Multi-Agent | 4/15 | Workstreams: 1 |
| Coordination | 8/15 | Dependencies: pre-commit hook, route validator, closed packets |
| **Total** | **52/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Restored guard rows fail on the CLI doctors' current scripts | M | M | Run the guard after restoring rows; fix the class labels or the scripts' guards, not the manifest |
| R-002 | Fixture fix masks the real module-resolution issue | M | L | Fix resolution explicitly and assert the module loads in the fixture |
| R-003 | Closed-packet edits invalidate their validation | M | L | Rerun strict validation on both packets and revert on failure |

---

## 11. USER STORIES

### US-001: A maintainer trusting the gates (Priority: P0)

**As a** maintainer, **I want** the mutation-class guard to cover every MCP CLI skill and the route validator to check workflow activities, **so that** a green gate means the contract holds, not that the gate stopped looking.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: A reader trusting the doctor's text (Priority: P1)

**As a** reader of the doctor's presentation and tooling reports, **I want** the descriptions, counts and invocation forms to match the tools, **so that** I can act on them without checking the source.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Does the activity assertion check only that scripts named in activities exist, or also that every route `script_invocations` entry appears in an activity? The build decides with the self-test fixture that proves the stronger reading.
- Does the generic `/doctor` form get a root command file, or does the presentation adopt the registered nested name? The build decides against the command contract's naming rules and records the choice in ADR-001.
- Does the fable baseline get repointed to an existing corpus, or marked as a captured snapshot with a dead source? The build searches the tree first and records what it finds.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---


