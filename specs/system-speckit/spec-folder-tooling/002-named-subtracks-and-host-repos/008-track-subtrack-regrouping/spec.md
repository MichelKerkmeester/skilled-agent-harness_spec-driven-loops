---
title: "Feature Specification: Phase 8: track-subtrack-regrouping"
description: "Large Skilled tracks keep active packets in flat lists, forcing readers to scan folder names for subsystem work. This packet applies the approved one-level subtrack maps to the ten tracks with eight or more active packets."
trigger_phrases:
  - "track subtrack regrouping"
  - "phase 8 track subtrack regrouping"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 8: track-subtrack-regrouping

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-10 |
| **Branch** | `worktrees/336-subtrack-gap-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-children-list-duplicates |
| **Successor** | None |
| **Handoff Criteria** | All ten tracks are regrouped, each per-track gate passes against its baseline, one commit exists per track, and the trigger index is rebuilt. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Regroup the large Skilled tracks into named sub-tracks specification.

**Scope Boundary**: Regroup the ten approved tracks with at least eight active packets. Keep the seven smaller tracks flat, leave both pinned packets and every `z_archive/` untouched.

**Dependencies**:
- [To be defined during planning]

**Deliverables**:
- [To be defined during planning]
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
Skilled's large spec tracks keep active packets in one flat folder list, so readers scan every folder name to find work on one subsystem. The ten largest tracks contain 29, 21, 19, 19, 19, 18, 17, 16, 9 and 8 active packets, while no Skilled track uses the supported one-level named subtrack layout.

### Purpose
Group every eligible active packet under its approved named subtrack so readers can navigate each large track by subsystem while smaller tracks stay flat.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->

```text
N/A: No verbatim command transcript was supplied. Operator-provided baseline captured 2026-11-10: every track passed strict validation except hooks-plugins-extensions, which had 2 failed folders from stale metadata paths in 001 and 008. The markdown link check recorded 14509 links and 0 broken.

The ten largest tracks held 29, 21, 19, 19, 19, 18, 17, 16, 9 and 8 active packets. Ten tracks meet the approved threshold, their maps define 40 subtracks, and about 175 packets move. Seven smaller tracks have 2 to 6 active packets and stay flat.
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Regroup the ten approved tracks with 8 or more active packets into their 40 operator-approved named subtracks, moving about 175 active packets. The tracks are hooks-plugins-extensions, system-speckit, sk-code, sk-doc, sk-git, system-skill-advisor, agents-md, cli-external-orchestration, system-deep-loop, and mcp-tooling.
- Move each assigned packet with `git mv` to `<track>/<sub-track>/<NNN>-<slug>`, numbering from 001 in original order and preserving the slug. Create each subtrack's `description.json` with `level` set to `sub-track`.
- Update each qualifying track root's `graph-metadata.json` and rewrite every live mention of a moved packet path across tracked files. Rebuild generated indexes rather than editing them.
- Run `refresh-track-roots.mjs --apply` and `repair-derived.cjs --roots specs/<track> --apply` for each track. Require all three per-track gates before its one commit, then rebuild the trigger index after all tracks.

### Out of Scope
- Keep agents, cli-classifier, cli-orca, commands, sk-design, sk-prompt, and system-skilled-doctor flat. Each has 2 to 6 active packets, below the approved threshold of 8.
- Moving `hooks-plugins-extensions/028-sweet-search-integration`, `sk-code/019-surface-consistency-research`, or any track's `z_archive/`. Another session is editing the pinned packets and archives are not in scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/<track>/<packet>/` | Move | Move each assigned active packet under its mapped one-level subtrack path, except the two pinned packets. |
| `specs/<track>/<sub-track>/description.json` | Create | Create one level `sub-track` descriptor for each of the 40 named subtracks. |
| `specs/<track>/graph-metadata.json` | Modify | Refresh each qualifying track root to match its new direct children. |
| Tracked files that contain moved packet paths | Modify | Rewrite live locators. Preserve historical event records listed in the method. |
| Generated indexes | Regenerate | Rebuild generated indexes, including the trigger index, rather than hand-editing them. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | For each of the ten approved maps, move every assigned active packet exactly once to `<track>/<sub-track>/<NNN>-<slug>`, with numbering from 001 in original order and the original slug retained. Keep the two pinned packets, all `z_archive/` directories, and the seven smaller tracks in place. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | Create one `description.json` at level `sub-track` for each of the 40 named subtracks, update each qualifying track root's `graph-metadata.json`, and run `refresh-track-roots.mjs --apply` plus `repair-derived.cjs --roots specs/<track> --apply` per track. |
| REQ-003 | Rewrite every live tracked mention of a moved packet path. Preserve changelogs, research and review iteration logs, `.jsonl` event streams, `scratch/`, `evidence/`, and test fixtures as historical records. Rewrite historical spec documents only when a moved path is a live locator. |
| REQ-004 | Before each track's one commit, require `sweep-track-roots.mjs` to print `all track roots match`, recursive strict validation to show no more failed folders than that track's baseline, and `check-markdown-links.cjs` to report 0 broken links. |
| REQ-005 | After all ten tracks are processed, rebuild the trigger index with `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: **Given** each of the ten approved maps, **When** its movable active packets are regrouped, **Then** each packet appears exactly once under its mapped subtrack and each original slug is preserved.
- **SC-002**: **Given** an approved map for a qualifying track, **When** the track is regrouped, **Then** its mapped subtracks each have a `description.json` with `level` set to `sub-track`, and packet numbering starts at 001 in original order.
- **SC-003**: **Given** all moved packet paths, **When** live tracked locators are rewritten and the link checker runs, **Then** `node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs` reports 0 broken links.
- **SC-004**: **Given** a processed track, **When** all three pre-commit gates run, **Then** the root sweep prints `all track roots match`, strict validation has no more failed folders than that track's baseline, and the link checker reports 0 broken links.
- **SC-005**: **Given** all ten track changes are processed, **When** `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` runs, **Then** the trigger index is rebuilt.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Operator-approved maps, Git, and the named system-spec-kit scripts | Without the maps or scripts, the affected track cannot be moved or gated. | Stop the affected track before its commit. No alternate map is approved. |
| Risk | Older commits' `Spec:` trailers retain old paths, and branches that edit moved packets can conflict when they merge. The heaviest known history is sk-git 028 with 40 commits, then 032 and 033 with 27 each. | Searches on a new path miss those older commits, and merges may need conflict resolution. | Preserve historical trailers, search the old path when tracing prior commits, and resolve path conflicts at merge time. |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: This migration runs no service and has no response-time target.
- **NFR-P02**: N/A: This migration runs no service and has no throughput target.

### Security
- **NFR-S01**: N/A: The approved changes add no authentication surface.
- **NFR-S02**: N/A: The approved changes do not handle service data or credentials.

### Reliability
- **NFR-R01**: N/A: This migration does not operate a service with an uptime target.
- **NFR-R02**: N/A: This migration does not define a service error-rate target.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: N/A: This is a finite filesystem migration over approved maps, not a runtime input handler.
- Maximum input: N/A: No maximum map size is specified. The approved scope is about 175 packet moves across 40 subtracks.
- Failure path: If any per-track gate fails, do not create that track commit. Correct the move or metadata state and rerun all three gates.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | N/A | No per-dimension score was supplied. |
| Risk | N/A | No per-dimension score was supplied. |
| Research | N/A | No per-dimension score was supplied. |
| **Total** | **N/A** | **No supplied scores to sum. Level 2 is the assigned level.** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- None. The approved maps, pinned paths, exclusions, and per-track gates are specified.
<!-- /ANCHOR:questions -->

---


