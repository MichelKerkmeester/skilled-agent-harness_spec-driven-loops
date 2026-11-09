---
title: "Feature Specification: Phase 4: report total candidates in the trigger lookup"
description: "Add a totalCandidates count beside truncated in the trigger-index lookup answer, and document the research-folder exclusion in retrieval-conventions section 9."
trigger_phrases:
  - "total candidate count"
  - "trigger lookup total candidates"
  - "phase 4 total candidate count"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: report total candidates in the trigger lookup

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-09 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 6 |
| **Predecessor** | ../003-retrieval-feature-design-research/spec.md |
| **Successor** | ../005-stale-index-fallback/spec.md |
| **Handoff Criteria** | `totalCandidates` ships with tests, because phase 5 recomputes it after its fallback merge |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the sweet-search integration packet: a build phase for one retrieval improvement that phase 3 designed in full.

**Scope Boundary**: Only the files listed under Files to Change, all inside `.skilled/skills/system-spec-kit/` (plus the one command asset named there). No embeddings, MCP, daemon or new persistent index.

**Dependencies**:
- Design: `../003-retrieval-feature-design-research/research/research.md` and `../003-retrieval-feature-design-research/research/iterations/iteration-001.md` (lines 45-148). [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-001.md:45]
- Predecessor phase complete (see Handoff Criteria in `../spec.md`).

**Deliverables**:
- The code, contract text and tests listed below, with the full retrieval suite passing against its baseline.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The trigger lookup reports only a `truncated` boolean when it cuts results to `--limit`, so a caller cannot tell 21 candidates from 20,000 or judge whether raising the limit is worth it. Separately, the trigger index excludes `specs/**/research/**` except `research.md`, but section 9 of the retrieval conventions does not list that divergence.

### Purpose
Every lookup answer states how many documents ranked before the cap, and the coverage table matches what the code already does.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node lookup-trigger-index.mjs --limit 2 -- "spec folder validation strict"
candidates : 2 (truncated) from 2302 phrase(s)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `totalCandidates` to the lookup answer (JSDoc, literal default `0`, assignment from `ordered.length`).
- Change the human `candidates :` line only when truncated, to `N of TOTAL (truncated)`.
- Add the section 8 sentence and the section 9 `specs/**/research/**` row to the retrieval conventions.
- Add a third `SCOPED_DIVERGENCES` entry and two parity paths.

- Ship the feature with its docs: feature-catalog entry, conversational playbook scenario 489, every README that describes the changed tool, and a system-spec-kit changelog entry.
- Run `/local-skilled-alignment` on the phase change and resolve its findings until a recheck shows none open.
- Benchmark before and after on a fixed query set and publish the comparison table.

### Out of Scope
- The zero-hit fallback - phase 5.
- Any ripgrep-lane change - phase 6.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` | Modify | JSDoc (148-159), answer literal (168-179), cap block (232-240), `formatAnswer` (332) |
| `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Modify | Section 8 lookup sentence (279), section 9 exclusion row after `lineages` (312) |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts` | Modify | Unit and CLI cases for `totalCandidates` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/retrieval-coverage-parity.vitest.ts` | Modify | Third `SCOPED_DIVERGENCES` entry and two research-walk paths |
| `.skilled/skills/system-spec-kit/feature-catalog/retrieval/trigger-lookup-total-candidates.md` | Create | Catalog entry for the feature (sk-doc feature-catalog standard) |
| `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` | Modify | Index row for the new entry |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/trigger-lookup-total-candidates.md` | Create | Scenario 489: conversational prompt, commands, expected signals, pass/fail |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md` | Modify | Row 489 in section 7.8 |
| `.skilled/skills/system-spec-kit/README.md` | Modify | Describe the new behavior and output; keep counts and examples true |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md` | Modify | Describe the new behavior and output; keep counts and examples true |
| `.skilled/skills/system-spec-kit/runtime/data/README.md` | Modify | Describe the new behavior and output; keep counts and examples true |
| `.skilled/skills/system-spec-kit/changelog/v2.12.41.0.md` and `SKILL.md` version | Create / Modify | Changelog entry; use the next free version at build time |
| `.skilled/changelog/skilled/` newest open release notes | Modify | One line for the user-visible change, if the notes are still open |
| `benchmark/` (this phase folder) | Create | `queries.txt`, `before.json`, `after.json`, `results.md` |
| `alignment/` (this phase folder) | Create | Copy of the alignment `report.md` and `recheck.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The JSON answer carries `totalCandidates` equal to the ranked document count before `--limit` | On the fixture index, `lookup(loaded, 'spec folder question', { limit: 2 })` returns 2 results, `truncated: true`, `totalCandidates: 6` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Untruncated human output is byte-identical to today; section 9 lists the research-folder divergence | A default-limit run's `candidates :` line contains no ` of `; the parity suite passes with the new entry |
| REQ-003 | Docs ship with the code: catalog entry, scenario 489, READMEs and changelog | The alignment report lists no open S3, S4, S5 or S6 finding for this change |
| REQ-004 | The change aligns with sk-code and sk-doc across every surface it fires | `/local-skilled-alignment` recheck shows 0 open P0 and P1 findings; any P2 left open is listed with a reason in `implementation-summary.md` |
| REQ-005 | Before and after results are measured on the same query set | `benchmark/results.md` holds the comparison table below with real numbers |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npx vitest run trigger-index.vitest.ts retrieval-coverage-parity.vitest.ts` passes, including the nine new cases.
- **SC-002**: A truncated CLI run prints `candidates : 2 of N (truncated) from M phrase(s)`.
- **SC-003**: `/local-skilled-alignment` recheck on this change shows 0 open P0 and P1 findings.
- **SC-004**: `benchmark/results.md` shows these rows filled with measured values:

| Metric | Before | After target |
|--------|--------|--------------|
| Truncated answers that state a total | 0/6 (measured today) | 6/6 |
| Untruncated human output changed | n/a | 0/6 byte-identical |
| Median lookup time, 5 runs per query | record | within 10% of before |
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 3 design line numbers | Line ranges drift before the build | Re-read each cited range before editing |
| Risk | A caller that parses a closed field set breaks on the new key | Low | Phase 3 found five consumers, all reading named fields; rerun the full retrieval suite before and after |
| Risk | The benchmark compares runs on different index or worktree states | Med | Record the `trigger-index.json` sha256 in both JSON files and require it to match; do not rebuild the index between runs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Median lookup time over the benchmark set stays within 10% of the before run.
- **NFR-P02**: The cold-lookup p95 over `runtime/cli/retrieval/fixtures/prompt-set.json` stays at or under the 200 ms budget `/doctor:speckit` enforces.

### Security
- **NFR-S01**: The change reads no new file and writes nothing.
- **NFR-S02**: N/A. The lookup handles no credentials or user data.

### Reliability
- **NFR-R01**: Exit codes stay 0 for a hit, 1 for a clean no-hit, 2 or higher for an error.
- **NFR-R02**: The full retrieval suite has no new failure versus the baseline.

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a tokenless prompt returns `totalCandidates: 0`, `truncated: false` and exits 1.
- Maximum input: `--limit 0` means no cut, so `totalCandidates` equals the result count and `truncated` stays false.
- Failure path: a missing or unreadable index still exits 2 with the existing message; the new field never appears on that path.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One code file, one doc, two test files, about 48 lines |
| Risk | 4/25 | Additive JSON field, no exit-code change |
| Research | 2/20 | Designed in phase 3 |
| **Total** | **12/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The design in phase 3 settles the field names, output strings and test cases.
<!-- /ANCHOR:questions -->

---
