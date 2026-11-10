---
title: "Feature Specification: Phase 10: mixed-track-sweep-guard"
description: "Phase 008 regrouped ten spec tracks into 39 sub-tracks but left two packets flat beside the sub-tracks. Because a correct children list did not reveal that mixed layout, the sweep did not catch it. This phase moves both packets and makes the sweep fail mixed top-level tracks."
trigger_phrases:
  - "mixed track sweep guard"
  - "phase 10 mixed track sweep guard"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 10: mixed-track-sweep-guard

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-10 |
| **Branch** | `worktrees/336-subtrack-gap-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10 |
| **Predecessor** | 009-rename-rule-and-test-root-fixes |
| **Successor** | None |
| **Handoff Criteria** | None. This is the final phase. The repository sweep is clean, the reported test files show 89 passed and 0 failed, and the Barter host impact is recorded. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the Move the last two flat packets into sub-tracks and make the sweep fail a track that mixes flat packets with sub-tracks specification. Phase 008 regrouped ten spec tracks into 39 sub-tracks but left two packets flat while another session edited them. On 2026-11-10 the operator selected both destinations and chose a sweep-only guard.

**Scope Boundary**: Move the two selected packets, update their live references and description metadata, and make the sweep reject mixed top-level tracks. Keep `create.sh`, the Barter repository and other sweep rules out of scope.

**Dependencies**:
- The Phase 008 track regrouping and the operator-selected destinations and guard.

**Deliverables**:
- Move both flat packets into their selected sub-tracks and align their live references and description metadata.
- Add a shared track-layout classifier and make the sweep fail mixed top-level tracks.
- Update the fixture, sweep tests and documentation, and record the known Barter host effect.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
Phase 008 regrouped ten spec tracks into 39 sub-tracks but left two packets flat because another session was editing them. A correct `children_ids` list did not expose the mixed layout, so no existing check reported it and `refresh-track-roots.mjs --apply` could not clear it. On 2026-11-10 the operator saw `019-surface-consistency-research` beside four sub-tracks under `sk-code` and said this must not occur.

### Purpose
Move both packets into the operator-selected sub-tracks and make the sweep fail any top-level track that still holds flat packets beside sub-tracks.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
N/A: The supplied facts contain no pre-change command transcript. Reported baseline: Phase 008 regrouped ten spec tracks into 39 sub-tracks and left two packets flat beside them. On 2026-11-10 the operator saw one flat packet beside four sub-tracks under `sk-code`.

Reported completed checks: 194 references across 26 files and 1940 references across 122 files were rewritten. Nine description files were aligned, with 0 of 2563 entries out of line. The repository has 40 sub-tracks and no mixed tracks. The track-roots and archive-track suites report 89 passed and 0 failed. The track-roots file went from 28 to 29 tests.

The Barter host report lists three mixed tracks with two, six and two flat packets.
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Move `specs/sk-code/019-surface-consistency-research` to `specs/sk-code/code-surfaces/001-surface-consistency-research`.
- Move `specs/hooks-plugins-extensions/028-sweet-search-integration` to `specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration`.
- Add `trackLayout(children)` to `runtime/cli/lib/track-roots.mjs` and use it in the top-level sweep to reject mixed layouts.
- Update the shared fixture, sweep tests and documentation to cover the guard.

### Out of Scope
- Changing `create.sh` - the operator chose a sweep-only guard.
- Editing the Barter host repository - its follow-through is for the operator to decide.
- Changing another sweep rule - the guard only covers flat packets beside sub-tracks.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/sk-code/019-surface-consistency-research` to `specs/sk-code/code-surfaces/001-surface-consistency-research` | Move | Place the packet inside the selected sub-track |
| `specs/hooks-plugins-extensions/028-sweet-search-integration` to `specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration` | Move | Place the packet inside a new selected sub-track |
| Live references to both moved packet paths | Modify | Rewrite 194 references in 26 files for the first path and 1940 references in 122 files for the second |
| Nine `description.json` files | Modify | Align packet numbers and parent chains |
| `runtime/cli/lib/track-roots.mjs` | Modify | Add `trackLayout(children)` to classify flat packets and sub-tracks |
| `runtime/cli/spec/sweep-track-roots.mjs` | Modify | Fail mixed top-level tracks in working-tree and `--rev` modes |
| `runtime/cli/tests/fixtures/subtrack-tree.mjs` and `track-roots.vitest.ts` | Modify | Add the flat fixture option and mixed-track sweep coverage |
| Runtime and feature-catalog documentation, changelog and `SKILL.md` | Modify/Create | Document the guard and version update |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The two flat packets are moved to the selected sub-tracks and their live references and descriptions are aligned | The sweep prints `all track roots match their declared children`, and the metadata recheck finds 0 of 2563 entries out of line |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The sweep rejects a top-level track with flat packets beside sub-tracks, while a track without sub-tracks stays valid and sub-tracks are not checked | The mixed-track test exits 1 in working-tree and `--rev` modes with both required messages and identical output |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: After both moves, the repository has 40 sub-tracks, no track mixes flat packets with sub-tracks, and the sweep prints `all track roots match their declared children`.
- **SC-002**: `track-roots.vitest.ts` and `archive-track.vitest.ts` report 89 passed and 0 failed, with the mixed-track test covering working-tree and `--rev` output.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing Node ESM CLI and Vitest test setup | The helper, sweep and regression checks need the repository tooling | Keep the change within the existing CLI and test setup |
| Risk | The Barter host has three mixed tracks and its sweep will exit 1 after it vendors this version until those packets move | Barter's sweep is blocked by two flat packets in bartender, six in barter-scrooge and two in gitops-development | The operator decides the Barter follow-through. No Barter files were changed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- None. The operator selected both packet destinations and the sweep-only guard.
- The Barter follow-through remains for the operator to decide.
<!-- /ANCHOR:questions -->

---


