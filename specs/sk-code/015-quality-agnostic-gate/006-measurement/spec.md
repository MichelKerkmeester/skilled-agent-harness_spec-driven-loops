---
title: "Feature Specification: Phase 6: measurement"
description: "Measures the quality gate that phases 001 to 005 build on seeded changes, a 50-file timing set and three routing canaries, and records each result against its design target. The live report folder is rendered from the measurement record by the benchmark report renderer this phase adds."
trigger_phrases:
  - "phase 6 measurement"
  - "quality gate measurement"
  - "catch rate and false positives"
  - "CQ-002 to CQ-008"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.3 -->
# Feature Specification: Phase 6: measurement

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-25 |
| **Branch** | `worktrees/218-ci-efficiency-build` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-consumers-and-routing (phases 001 to 004 are also required, see Dependencies) |
| **Successor** | None |
| **Handoff Criteria** | Seven CQ scenarios and three canaries are written and replay to their expected routes. The measurement record holds every design 6.5 target with its result. The report folder is rendered from the measurement record by the benchmark report renderer. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Make sk-code-quality a codebase-agnostic, executable author gate specification. It is the measurement phase. It runs last because its numbers describe the gate that phases 001 to 005 build.

**Scope Boundary**: Measurement and documentation only. Phase 6 adds no gate code and changes no gate behavior. A defect that measurement finds becomes a new change under the phase that owns the surface.

**Dependencies**:
- `001-honest-checker` supplies the narrowed hygiene patterns, URL span stripping, the issue and ticket rule and docstring scanning. Catch rate on fixture F01 and zero findings on F02 depend on it.
- `002-builtin-runner` supplies `quality-gate.cjs`, the built-in sensors, the envelope renderer and the fixture builder (design 6.1). Every measurement runs it.
- `003-config-and-doctor` supplies the configured required check and its `SKIPPED_ABSENT` path. CQ-006 and fixture F06 depend on it.
- `004-doctrine` supplies the amended Iron Law 3 (ADR-001 in `decision-record.md`) and the SKILLED-only universal checklist (ADR-002). CQ-003, CQ-004 and CQ-005 test them.
- `005-consumers-and-routing` supplies the verify reader rule behind CQ-007, the restraint keywords behind CQ-008, the surface `quality` declarations behind fixture F15, and the routes behind the three canaries.

**Deliverables**:
- Seven playbook scenarios, CQ-002 to CQ-008, under the quality playbook.
- Three compiled-routing canaries, CB-CR-006 to CB-CR-008.
- A measurement record and the raw live transcripts, both under `evidence/`.
- A report folder under the quality benchmark reports, rendered from the measurement record.
- Changelog entries at packet and quality-mode level, written at landing.

**Changelog**: When this phase lands, write its changelog entries at the parent packet and at the quality mode (design D21). The version number is chosen at landing (design risk 11).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The saved benchmark runs for `sk-code-quality` measure routing, not catching. Both record an intent recall of 0 (`specs/sk-code/014-code-modes-research/001-quality-mode-research/research/research.md:123`), and no run records a catch rate, a miss rate or the cost of a gate run. Until the gate runs on changes with known defects, its catch rate and its cost stay unknown.

### Purpose
Success is one measurement record and one report that state the catch rate, the misses, the false positives, the wall time and the intent recall of the gate built by phases 001 to 005. Each result sits against its design target, and every result is recorded as found, including the misses.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Write playbook scenarios CQ-002 to CQ-008 that run the gate on seeded changes and on the routing prompts.
- Add three compiled-routing canaries, CB-CR-006 to CB-CR-008, under the sk-code playbook.
- Measure the catch rate, the misses and the false positives on the seeded fixtures, and the wall time on a 50-file set.
- Record intent recall on four quality prompts, with no target (ADR-007).
- Write the report folder in the existing seven-file set (ADR-005), rendered from the measurement record (ADR-008).

### Out of Scope
- Building a benchmark runner, and any renderer beyond the single report renderer this phase adds (ADR-008). Nothing of the Lane C harness survives its retirement.
- Fixing a gate defect that measurement finds. A defect becomes a new change under the phase that owns the surface.
- The advisor replays and the stage-two node test in design 6.5. Phase 005 acceptance runs them.
- Scoring benchmark dimensions D1, D2, D3 and D5 or D4 usefulness. The retired harness owned them (`.skilled/skills/sk-code/benchmark/README.md:16,23`).
- Changing CI or pre-commit scope from whole-file to changed-line (ADR-004).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/` (seven files, listed in tasks.md Step 1) | Create | Scenario files CQ-002 to CQ-008 |
| `.skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/manual-testing-playbook.md` | Modify | Add CQ-002 to CQ-008 to the section 7 and section 9 indexes |
| `.skilled/skills/sk-code/manual-testing-playbook/compiled-routing/` (three files, listed in tasks.md Step 2) | Create | Canaries CB-CR-006 to CB-CR-008 |
| `specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/` | Create | Measurement record and raw live transcripts |
| `.skilled/skills/sk-code/sk-code-quality/benchmark/reports/*--quality-gate-fixtures--live/` (the execution date leads the folder name) | Create | Seven-file report folder, rendered from the measurement record |
| `.skilled/skills/sk-code/sk-code-quality/benchmark/reports/README.md` | Modify | One index row for the new folder |
| `.skilled/skills/sk-code/benchmark/scripts/render-report.cjs` | Create | Deterministic report renderer: one machine record in, the seven-file set out, with `--check` |
| `.skilled/skills/sk-code/benchmark/scripts/tests/render-report.test.cjs` | Create | Golden test that re-renders committed reports byte for byte |
| `.skilled/skills/sk-code/benchmark/README.md` | Modify | Section 7 names the renderer and how to run it |
| `.skilled/skills/sk-code/sk-code-quality/changelog/` (one new file, named for the landing version) | Create | Quality-mode changelog entry, version chosen at landing |
| `specs/sk-code/015-quality-agnostic-gate/changelog/` | Create | Packet changelog entry, written at landing |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Seven scenario files exist for CQ-002 to CQ-008. Each carries a frontmatter `id`, an exact prompt or fixture, the expected output and a `### Pass / Fail` section. |
| REQ-002 | The quality playbook root index lists CQ-002 to CQ-008 in section 7. |
| REQ-003 | Three canaries, CB-CR-006 to CB-CR-008, exist. Each one replays to the route design 6.5 expects. |
| REQ-004 | Catch rate on the F01 seeded exact labels is 1.0, which is 7 of 7 labels. |
| REQ-005 | The F02 false-positive set produces 0 findings. |
| REQ-006 | Built-in checks on the 50-file set finish in under 2000 ms on each of three runs. |
| REQ-007 | No live transcript contains a passing claim. |
| REQ-010 | The report folder holds the existing seven-file set. |
| REQ-012 | Every design 6.5 target appears in the report with its result and a met or not-met state. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | Intent recall is measured on four quality prompts and recorded as found, with no target. |
| REQ-009 | Misses and false positives are named in the measurement record, not counted only. |
| REQ-011 | `source.md` in the report records a repository-relative root and the scenario corpus, with no absolute path (synthesis rank 13 at `specs/sk-code/014-code-modes-research/001-quality-mode-research/research/synthesis-v1.md:207`). |
| REQ-013 | This spec and `plan.md` name each dependency on phases 001 to 005. |
| REQ-014 | ADR-001 to ADR-006 each state the alternative and the reversal, and each carries the status line "Accepted, pending operator confirmation at program end". |
| REQ-015 | Phase 6 changes no file under the quality scripts, the quality hooks or the gate code. The one exception is the benchmark report renderer and its golden test, which this phase adds under the sk-code benchmark tree (ADR-008, option a). |
| REQ-016 | Changelog entries at packet and quality-mode level are written at landing, with the version chosen then. |
| REQ-017 | Raw transcripts stay in `evidence/`, and `scratch/` is empty at close. |
| REQ-018 | The playbook scenarios write nothing into the repository working tree. Their fixtures live in temporary repositories (`sk-code-quality/manual-testing-playbook/manual-testing-playbook.md`, section 2, rule 5). |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').catch"` prints `{ seeded: 7, matched: 7, misses: [] }`.
- **SC-002**: `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').false_positives.f02_findings"` prints `0`.
- **SC-003**: `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').timing.max_ms"` prints a number below `2000`.
- **SC-004**: `rg -l -i 'gate passed|all checks pass|\bPASS\b' specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/transcripts | wc -l` prints `0`, and every hit that remains is read by hand.
- **SC-005**: The report folder lists seven files, and `rg -l '/Users/|/private/|/home/'` over it prints nothing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 001 to 005 are all Draft today | Measurement cannot run on a gate that does not exist | Steps 1 and 2 can be drafted early. Step 3 runs only after 001 to 005 land |
| Dependency | Live D4 runner and renderer (retired with the Lane C harness) | The report folder cannot be produced by the retired harness. High | ADR-008: this phase builds the report renderer, so the machine record renders into the seven-file set |
| Risk | Misses on F01 or false positives on F02 | Targets are not met. High | Record each result as found. Route each defect to the phase that owns the surface as a new change |
| Risk | Intent recall stays at 0 | The routing claim stays weak. Medium | Record it with no target (ADR-007). Do not tune routing against four prompts in this phase |
| Risk | The 50-file timing set runs slower on a real machine | The 2-second target is missed on that machine. Medium | Record the machine, run three times, and report the median and the maximum |
| Risk | The MTP rule says renderer-owned markdown is never hand-authored | A hand-written report breaks the playbook rule. High | Do not hand-write the report markdown. Render it with `benchmark/scripts/render-report.cjs` (ADR-008) |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Built-in checks finish in under 2000 ms for 50 changed `.js` files on each of three runs. The runs use `--no-run`, so no configured check runs (design 6.5).
- **NFR-P02**: N/A for throughput. The phase runs no service and answers no request, so NFR-P01 is the only timed path.

### Security
- **NFR-S01**: No envelope or report in this phase names a `local-*` skill. `rg -c 'local-' .skilled/skills/sk-code/sk-code-quality/benchmark/reports/*--quality-gate-fixtures--live/` prints nothing, because `rg -c` lists only files with a match. Fixture F15 uses the placeholder name `local-example` only inside the fixture (design 6.2).
- **NFR-S02**: No literal secret key reaches the evidence. Secret fixtures join their key from fragments at run time (design 6.1). `rg -l 'AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36}' specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence` prints nothing.

### Reliability
- **NFR-R01**: Every measurement run checks the read-only invariant. The fixture snapshot is equal before and after the run (design 6.1). The record sets `readonly_invariant` to `true`.
- **NFR-R02**: Every run is recorded with its gate value, including `ERROR`, `UNVERIFIED` and `NOTHING_CHECKED`. None is dropped from the record.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- /ANCHOR:edge-cases -->

### Data Boundaries
- Empty input: a change with no in-scope file returns `NOTHING_CHECKED` with exit 2. Fixture F05 and CQ-003 cover it (design 3.3).
- Maximum length: the timing set holds 50 files. A file over 2 MB goes to `coverage.unchecked` and is not timed (design 3.2).
- Invalid format: a binary file (a NUL byte in the first 8 KB) goes to `coverage.unchecked` with the reason `binary` (design 3.2).

### Error Scenarios
- External service failure: N/A. The gate makes no LLM or network call (design 8.2).
- Network timeout: N/A for the same reason. A configured check that times out reports `TIMEOUT` and counts as unverified (design 3.3).
- Concurrent access: measurement runs execute one at a time. Each fixture lives in its own temporary repository (design 6.1), so no run shares state with another.

### State Transitions
- Partial completion: if a run stops before all seven scenarios finish, the record lists the rest as not run. It never lists them as passed.
- Session expiry: a lost live transcript is rerun from its first step. The record keeps only transcripts saved in full.

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Seven playbook files, three canaries, one index, one measurement record, one report folder and two changelog entries |
| Risk | 14/25 | No runner survives for the live report (ADR-008). A miss changes what the program can claim |
| Research | 10/20 | Targets come from design 6.5. Intent recall was 0 in both saved runs, and its cause is UNKNOWN (`research.md:123`, `research.md:330`) |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **OQ-1 (answered)**: Who owns the live D4 runner and the report renderer? The Lane C harness, its runner and its renderer are retired, and D4 usefulness has no successor (`.skilled/skills/sk-code/benchmark/README.md:14,16`). The operator ruled that sk-code owns the gap and that this phase builds the renderer, which is ADR-008 option (a). Tasks T023 to T025 are unblocked.
<!-- /ANCHOR:questions -->
