---
title: "Feature Specification: Phase 7: children-list-duplicates"
description: "A track root's children_ids list can name one packet twice and still pass, because the track reader compares declared and on-disk packets as sets. The sweep exits 0 for that root and the writer reports it up to date, so the pre-push gate never sees the repeat. Skilled's own specs root list also names two packets that no longer exist, which a host mirror turns into foreign entries."
trigger_phrases:
  - "children list duplicates"
  - "phase 7 children list duplicates"
  - "children_ids repeated entry"
  - "declared more than once"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: children-list-duplicates

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-09 |
| **Branch** | `worktrees/336-subtrack-gap-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-review-follow-ups |
| **Successor** | None |
| **Handoff Criteria** | None: this is the last phase. Close requires `track-roots.vitest.ts` to pass with 28 tests and `validate.sh` on `007-children-list-duplicates` to print `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Sub-track gap fixes found in the Barter host specification.

**Scope Boundary**: The duplicate check in the track reader, the sweep and the writer, their tests, one feature-catalog sentence and the `children_ids` list in Skilled's `specs/graph-metadata.json`. List order stays outside the drift check.

**Dependencies**:
- Phases 001 to 006, which built the track reader, the sweep and the writer this phase extends.

**Deliverables**:
- The sweep flags a packet named twice in `children_ids` and exits 1.
- The writer removes the repeat with `--apply`.
- Skilled's specs root no longer lists two deleted packets.
- The Barter host follow-through is recorded as evidence.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
`compareTrackChildren` in `track-roots.mjs` compares a track root's declared `children_ids` with its on-disk packets as sets. A list that names one packet twice therefore still matches. The sweep prints a count that disagrees and still exits 0 for that root, and the writer prints `up to date` and never removes the repeat. The pre-push gate runs the same sweep, so it cannot see the repeat either.

A second defect sits in Skilled's own `specs/graph-metadata.json`. Its `children_ids` names `999-test-sandbox` and `999-playbook-test-memory-mcp-validation`, and neither packet exists. Nothing inside Skilled reads that file as a track. A host that mirrors Skilled's specs into a folder under its own `specs/` turns it into a track root, and its working-tree sweep then reports those two names as foreign entries and exits 1.

### Purpose
A repeated `children_ids` entry counts as drift in the sweep and the writer removes it, and a host mirror of Skilled's specs root carries no stale entry.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
# Barter host repository (barter/ai-speckit, 62 track roots and sub-tracks), measured by the orchestrator on 2026-11-09:
$ node .skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs --specs barter/ai-speckit/specs --rev HEAD
backend-system/partners-billing: declared=12 actual=11
fe-backoffice-app/auth-access: declared=9 actual=6
...
sweep-track-roots: all track roots match their declared children
exit 0
$ node .skilled/skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs --specs barter/ai-speckit/specs   (dry run)
backend-system/partners-billing: up to date
# Seven sub-tracks carry 17 repeated entries in total:
#   partners-billing 1, auth-access 3, dev-experience 4, platform 5,
#   account-settings 1, creator-workflows 1, subscriptions 2
# Baseline test run, from .skilled/skills/system-spec-kit/runtime/cli:
$ npx vitest run tests/track-roots.vitest.ts --config ../../vitest.config.ts --project cli
25 passed of 25
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Return a sorted `duplicates` list from `compareTrackChildren`, hold each name once in `declared` and set `matches` to false when a name repeats.
- Print `    declared more than once: <names>` in the sweep for such a root and count the root as drifted, so the sweep exits 1.
- Name the duplicates in the writer's dry run, and rewrite the list with each packet once under `--apply`.
- Add three tests to `track-roots.vitest.ts` and one sentence to the feature-catalog entry for track-root children lists.
- Align the two script README files, add the system-spec-kit changelog entry and raise the skill version, as the alignment review asked.
- Empty `children_ids` in Skilled's `specs/graph-metadata.json`, and record the Barter follow-through as evidence: the fixed writer run with `--apply` over `barter/ai-speckit/specs`, and new track metadata in `specs/skilled-barter-overlays/`.

### Out of Scope
- Making list order count as drift - an unsorted list that names each packet once is not a defect, and 15 Barter lists are unsorted.
- Regrouping any Skilled track into sub-tracks - the operator deferred it to a later phase.
- Changing Barter's mirror script or re-pinning Barter - Barter is a separate repository the operator commits.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs` | Modify | `compareTrackChildren` returns `duplicates` and fails `matches` on a repeat |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs` | Modify | Prints the `declared more than once` line and counts the root as drifted |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs` | Modify | Dry run names the duplicates and `--apply` writes each packet once |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/track-roots.vitest.ts` | Modify | Three new tests: the sweep flags a repeat, the writer removes it, an unsorted list still matches |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/track-root-children-lists.md` | Modify | One sentence in section 2 |
| `specs/graph-metadata.json` | Modify | Empty `children_ids` and clear the pointer to a deleted packet |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Modify | The sweep and writer rows describe the repeat check |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/README.md` | Modify | The reader row names `duplicates` |
| `.skilled/skills/system-spec-kit/changelog/v2.12.39.0.md` | Create | The release entry for this change |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modify | Version `2.12.39.0` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A track whose `children_ids` repeats a packet makes `sweep-track-roots.mjs` exit 1 and print the `declared more than once` line |
| REQ-002 | `refresh-track-roots.mjs --apply` on that track writes each packet once, and the sweep then exits 0 |
| REQ-003 | An unsorted list that names each packet exactly once still matches: the sweep exits 0 and the writer prints `up to date` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `track-roots.vitest.ts` passes with the 25 existing tests unchanged plus the three new ones, 28 in total |
| REQ-005 | After the writer ran, the sweep over `barter/ai-speckit/specs` at the working tree prints no `declared more than once` line |
| REQ-006 | The sweep reports `skilled-barter-overlays: declared=4 actual=4` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `npx vitest run tests/track-roots.vitest.ts --config ../../vitest.config.ts --project cli` from `.skilled/skills/system-spec-kit/runtime/cli` reports 28 passed of 28.
- **SC-002**: After the writer ran with `--apply`, the working-tree sweep over `barter/ai-speckit/specs` prints no `declared more than once` line.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | None outside the repository | None: the change needs no new package, file or flag | N/A: nothing outside the repository can block it |
| Risk | The pre-push gate runs the same sweep, so a repository with an existing repeated entry is blocked on its next push until it runs the writer once | Med | The gate's message already names the writer. Skilled's own 26 roots were swept on 2026-11-09 with no count mismatch |
<!-- /ANCHOR:risks -->

---

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: the change adds one set comparison to command-line scripts and runs no service.

### Security
- **NFR-S01**: N/A: the scripts read and write `graph-metadata.json` inside the specs folder and touch no credential.

### Reliability
- **NFR-R01**: Unreadable metadata keeps today's behavior: the sweep reports it and its exit status does not change.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: an empty `children_ids` matches a track with no packets.
- Maximum input: a list that repeats one packet many times reports that packet once.
- Failure path: unreadable metadata keeps today's behavior, so it is reported and the exit status does not change.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | N/A | Small: three source files, about 30 lines, no new file and no new flag |
| Risk | N/A | The pre-push gate may block a repository with an existing repeat until the writer runs once |
| Research | N/A | None left: the defect and its Barter footprint were measured on 2026-11-09 |
| **Total** | **N/A: `recommend-level.sh --loc 30 --files 6` printed Score 12/100. The orchestrator scaffolded this phase at Level 2** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Acceptance criteria**: `acceptance-criteria.md`
- **Summary**: `implementation-summary.md`
