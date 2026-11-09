---
title: "Feature Specification: Phase 5: zero-hit fallback to git-changed spec docs"
description: "When the committed trigger index returns no scored candidate, score the declared trigger phrases of spec docs that git reports as changed, so a newly created or edited packet is findable before the next index rebuild."
trigger_phrases:
  - "stale index fallback"
  - "trigger lookup zero hit fallback"
  - "phase 5 stale index fallback"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: zero-hit fallback to git-changed spec docs

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-09 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | ../004-total-candidate-count/spec.md |
| **Successor** | ../006-rg-flood-control/spec.md |
| **Handoff Criteria** | Keyed-lane changes complete with the 18-case matrix passing; phase 6 touches only the ripgrep lane |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the sweet-search integration packet: a build phase for one retrieval improvement that phase 3 designed in full.

**Scope Boundary**: Only the files listed under Files to Change, all inside `.skilled/skills/system-spec-kit/` (plus the one command asset named there). No embeddings, MCP, daemon or new persistent index.

**Dependencies**:
- Design: `../003-retrieval-feature-design-research/research/research.md` and `../003-retrieval-feature-design-research/research/iterations/iteration-002.md` (lines 46-176). [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-002.md:46]
- Predecessor phase complete (see Handoff Criteria in `../spec.md`).

**Deliverables**:
- The code, contract text and tests listed below, with the full retrieval suite passing against its baseline.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The trigger index is committed and rebuilt by hand, so a packet created or edited since the last build is invisible to the Gate 1 lookup. The lookup exits 1 with no sign that the index is stale, which looks the same as a topic nobody wrote about. This happened for every new phase of this packet.

### Purpose
A zero-hit lookup inside a git work tree also checks the declared phrases of changed spec docs, and says so in its answer, without changing any lookup that already finds a match.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node lookup-trigger-index.mjs --scoring-only -- "retrieval feature design research"
candidates : 0 from 2470 phrase(s)
exit=1
# the phrase is declared at 003-retrieval-feature-design-research/spec.md:5
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `lib/changed-docs.mjs`: list changed `*.md` with `git status --porcelain=v1 -z --untracked-files=all`, read their `trigger_phrases`, score them with `scorePhrase`.
- Add `lookupWithFallback()`, a `--no-stale-fallback` flag, an async `main()`, the `staleFallback` answer field and a `fallback :` human line.
- Recompute `totalCandidates` and `truncated` after the merge.
- Amend sections 4 and 5 of the retrieval conventions and the retrieval README.

- Ship the feature with its docs: feature-catalog entry, conversational playbook scenario 490, every README that describes the changed tool, and a system-spec-kit changelog entry.
- Run `/local-skilled-alignment` on the phase change and resolve its findings until a recheck shows none open.
- Benchmark before and after on a fixed query set and publish the comparison table.

### Out of Scope
- Grepping body text of changed files - that is the ripgrep lane's job.
- Rebuilding the trigger index automatically - `generate-trigger-index.mjs` stays the only writer.
- Mtime-based freshness or any queue file - the index has no build timestamp.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/changed-docs.mjs` | Create | Git candidate list, frontmatter phrase read, scoring, `MAX_FALLBACK_FILES = 200` |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` | Modify | Usage (17-31), JSDoc (148-159), comparator extraction and `lookupWithFallback()` (before 242), `parseArgs` (264-316), `formatAnswer` (323-338), async `main` (354-384) |
| `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Modify | Section 4 fallback note (after 180), section 5 determinism paragraph (212) |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md` | Modify | Flag list and fallback paragraph |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/stale-fallback.vitest.ts` | Create | 18-case git-fixture matrix plus the merged-count case |
| `.skilled/skills/system-spec-kit/feature-catalog/retrieval/stale-index-fallback.md` | Create | Catalog entry for the feature (sk-doc feature-catalog standard) |
| `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` | Modify | Index row for the new entry |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/stale-index-fallback.md` | Create | Scenario 490: conversational prompt, commands, expected signals, pass/fail |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md` | Modify | Row 490 in section 7.8 |
| `.skilled/skills/system-spec-kit/README.md` | Modify | Describe the new behavior and output; keep counts and examples true |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md` | Modify | Describe the new behavior and output; keep counts and examples true |
| `README.md` (root, Gate 1 paragraph at line 521) | Modify | Describe the new behavior and output; keep counts and examples true |
| `.skilled/commands/speckit/README.txt` | Modify | Describe the new behavior and output; keep counts and examples true |
| `.skilled/skills/system-spec-kit/changelog/v2.12.40.0.md` and `SKILL.md` version | Create / Modify | Changelog entry; use the next free version at build time |
| `.skilled/changelog/skilled/` newest open release notes | Modify | One line for the user-visible change, if the notes are still open |
| `.skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml` | Check | Its staleness report should name the fallback as the stopgap; change only if its wording now misleads |
| `benchmark/` (this phase folder) | Create | `queries.txt`, `before.json`, `after.json`, `results.md` |
| `alignment/` (this phase folder) | Create | Copy of the alignment `report.md` and `recheck.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A zero-hit lookup in a work tree returns matches from changed docs' declared phrases | Test: an untracked new packet with `trigger_phrases` is returned, exit 0, `staleFallback.matches: 1` |
| REQ-002 | A lookup that already has a scored match is unchanged | Test: existing `lookup`, `--scoring-only` and limit-contract blocks pass, and their JSON has no `staleFallback` key |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The fallback is off for an explicit `--index` and for `--no-stale-fallback` | Tests 8 and 9 in the phase 3 matrix: exit 1, no `staleFallback` field |
| REQ-004 | Staged additions, untracked folders and renames are covered; non-git and missing git degrade to `available: false` | Tests 2-7 in the phase 3 matrix pass |
| REQ-005 | Docs ship with the code: catalog entry, scenario 490, READMEs and changelog | The alignment report lists no open S3, S4, S5 or S6 finding for this change |
| REQ-006 | The change aligns with sk-code and sk-doc across every surface it fires | `/local-skilled-alignment` recheck shows 0 open P0 and P1 findings; any P2 left open is listed with a reason in `implementation-summary.md` |
| REQ-007 | Before and after results are measured on the same query set | `benchmark/results.md` holds the comparison table below with real numbers |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npx vitest run stale-fallback.vitest.ts trigger-index.vitest.ts` passes.
- **SC-002**: The measured command above returns this packet's phase 3 spec with exit 0 before any index rebuild.
- **SC-003**: `/local-skilled-alignment` recheck on this change shows 0 open P0 and P1 findings.
- **SC-004**: `benchmark/results.md` shows these rows filled with measured values:

| Metric | Before | After target |
|--------|--------|--------------|
| Stale phrases found | 0/10 (measured today: exit 1) | 10/10 |
| Already-matching queries with identical output | n/a | 10/10 |
| Undeclared phrases still exit 1 | 5/5 | 5/5 |
| Median time, matching queries | record | within 10% of before |
| Cold-lookup p95 over `fixtures/prompt-set.json` | record | at or under 200 ms, the `/doctor:speckit` budget |
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 3 design line numbers | Line ranges drift before the build | Re-read each cited range before editing |
| Risk | A repo-wide fallback costs about 0.9 s on a zero-hit, over the 200 ms p95 cold-lookup budget `/doctor:speckit` enforces | High | It runs only on a zero-hit, is scoped to `--spec-folder` when given (about 0.05 s) and capped at 200 files; measure the p95 over `fixtures/prompt-set.json` in the before run, and stop and ask before changing the budget if the after run breaks it |
| Risk | The benchmark compares runs on different index or worktree states | Med | Record the `trigger-index.json` sha256 and the `git status` line count in both JSON files; do not rebuild the index between runs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Matching queries stay within 10% of the before median; the fallback never runs for them.
- **NFR-P02**: The cold-lookup p95 over `fixtures/prompt-set.json` stays at or under 200 ms, the `/doctor:speckit` budget. If the fallback breaks it, stop and ask before changing the budget.

### Security
- **NFR-S01**: Git runs with an argv array, never a shell string, and reads only paths inside the repo root.
- **NFR-S02**: Only `*.md` files under the configured roots are read; symlinks that resolve outside the root are skipped.

### Reliability
- **NFR-R01**: No git, no repo or a git error degrades to `staleFallback.available: false` and the index-only result, never exit 2.
- **NFR-R02**: The full retrieval suite has no new failure versus the baseline.

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a tokenless prompt skips the fallback and exits 1 as today.
- Maximum input: more than 200 changed docs reads the first 200 by path order and sets `staleFallback.truncated: true`.
- Failure path: git missing or the folder is not a work tree gives `available: false`, exit 1, no stderr.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | New module plus CLI wiring, about 420-530 lines, 7 files |
| Risk | 12/25 | Changes CLI exit semantics on a zero-hit; touches a latency budget |
| Research | 4/20 | Designed in phase 3; budget check is new |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The design in phase 3 settles the field names, output strings and test cases.
<!-- /ANCHOR:questions -->

---
