---
title: "Feature Specification: Series parent rule, sibling listing and trigger phrases for new packets"
description: "Agents keep opening a new top-level packet for each small change to the same artifact, because the phase rules give related small work no legal home and nothing shows them the recent packets in the track."
trigger_phrases:
  - "series parent rule"
  - "group related small packets"
  - "recent packets in this track"
  - "template default trigger phrases"
  - "same artifact different change"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Series parent rule, sibling listing and trigger phrases for new packets

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-06 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 12 |
| **Predecessor** | 005-phase-aware-archive |
| **Successor** | 007-series-parent-review-and-hardening-research |
| **Handoff Criteria** | The rule docs agree with each other, `create.sh` lists recent sibling packets and seeds real trigger phrases, and the affected test files pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the spec folder tooling parent. Phases 1 to 5 made `create.sh` and `archive.sh` put packets where they belong. This phase makes the tooling and the rules steer related small work into one parent instead of many top-level packets.

**Scope Boundary**: the phase rule docs, the Gate 3 wording in `AGENTS.md`, the speckit plan and complete command notes, `create.sh`, and the trigger-phrase judge. No change to the Gate 3 runtime hook, no regroup command, no backfill of existing packets.

**Dependencies**:
- The four phase parents grouped on 2026-10-06, which are the evidence for the rule.

**Deliverables**:
- A series parent rule, stated once and referenced everywhere the phase thresholds are restated.
- A listing of recent packets in the track, printed by `create.sh` before it allocates a number.
- Trigger phrases seeded from the packet's own name and description, and a warning when a spec keeps the template defaults.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
On 2026-09-29 five Level 1 packets were opened in one day, each fixing one line of the same write recipe, and 21 packets across three tracks had to be grouped by hand on 2026-10-06. The authors knew their siblings existed, since the specs cite "the neighbouring recipe fix", but the phase rules allow a parent only for one large piece of work (score 25 or more and Level 3), so a second small change to the same artifact had nowhere to go but a new top-level packet. `create.sh` also allocates the next number without showing what is already in the track, and 195 specs keep the template's generic trigger phrases, so search cannot find them by topic.

### Purpose
A different change to the same artifact joins or creates a series parent, and the tooling shows the agent the recent packets in the track before it opens a new one.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A series parent as a second phase-qualification path, stated in `phase-definitions.md` §2 and §4.
- The same rule reflected in `sub-folder-versioning.md`, `phase-system.md`, `quick-reference.md`, `SKILL.md`, `AGENTS.md` and the speckit plan and complete notes, with the stale Option D and Option E labels corrected.
- A listing of recent packets in the same track, printed by `create.sh` before it allocates a number for a new top-level packet.
- Trigger phrases seeded from the packet name and description when `create.sh` copies a `spec.md` template.
- A `GREP_CONVENTION` warning when a spec keeps the template's default trigger phrases.
- The series parent exception named in `.skilled/skills/system-spec-kit/references/workflows/spec-folder-authoring-checklist.md`.

### Out of Scope
- The Gate 3 runtime hook prompt - its text is compared byte for byte and it never sees a packet being created.
- A regroup command - one regroup so far is not a pattern.
- Backfilling the 195 specs that keep the template phrases - a warning never fails a run, and every edit forces metadata and index rebuilds.
- Regrouping the remaining clusters the census found - each needs an operator decision.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/references/structure/phase-definitions.md` | Modify | Series parent rule in §2, §4 exception and label fixes |
| `.skilled/skills/system-spec-kit/references/structure/sub-folder-versioning.md` | Modify | When to use a version and when a series parent |
| `.skilled/skills/system-spec-kit/references/structure/phase-system.md` | Modify | Point the threshold section at the exception |
| `.skilled/skills/system-spec-kit/references/workflows/quick-reference.md` | Modify | Section 8 rule, priority line, labels, `create.sh` instead of `mkdir` |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modify | Rule 16 names the exception |
| `.skilled/skills/system-spec-kit/references/workflows/spec-folder-authoring-checklist.md` | Modify | Names the series parent exception |
| `AGENTS.md` | Modify | Gate 3 Option C names the series parent |
| `.skilled/commands/speckit/assets/speckit-plan.yaml` | Modify | Option C instead of Option D for adding a phase |
| `.skilled/commands/speckit/assets/speckit-complete.yaml` | Modify | Option C instead of Option D for adding a phase |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | Recent sibling listing and seeded trigger phrases |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs` | Modify | Template default phrases count as generic |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/*.vitest.ts` | Modify | Coverage for the listing, the seeded phrases and the judge |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `phase-definitions.md` §2 defines a series parent: same artifact, same track, a different change. A correction of an existing packet's own change continues that packet instead. |
| REQ-002 | `phase-definitions.md` §4 allows a standard packet to become the first child of a series parent, and no doc still says Option D adds a phase or Option E skips. |
| REQ-003 | Every doc that restates the phase thresholds names the series parent exception. |
| REQ-004 | `create.sh` prints the recent packets in the target track to stderr before it allocates a number for a new top-level packet, and prints nothing extra for a phase child or a sub-folder. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | A `spec.md` that `create.sh` copies gets trigger phrases from the packet name and description instead of the four template defaults. |
| REQ-006 | `GREP_CONVENTION` warns on a spec whose trigger phrases are the template defaults. |
| REQ-007 | The affected test files pass, with the golden snapshot updated only for the seeded phrases. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader of any one rule doc reaches the same answer for "a second small change to the same file": join or create a series parent.
- **SC-002**: Creating a top-level packet in a track with packets from the last 14 days prints them, and a new spec's trigger phrases name its topic.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Series parents turn into catch-all buckets for a track | Med | The rule requires one named artifact, and a different artifact gets its own packet |
| Risk | The listing adds noise to every `create.sh` run | Low | stderr only, top-level packets only, 14 days and at most 10 entries |
| Risk | Changing scaffold output breaks callers that compare it | Med | Update the golden snapshot on purpose and rerun the scaffold gate test |
| Dependency | `AGENTS.md` is mirrored in the operator's global `~/.claude/CLAUDE.md` | Low | Report the drift, the global file is outside this repository |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The listing adds no more than one `node` call to a `create.sh` run.

### Security
- **NFR-S01**: The listing only reads `description.json` and `graph-metadata.json` inside the target track.

### Reliability
- **NFR-R01**: A missing or unreadable metadata file skips that packet and never fails `create.sh`.
- **NFR-R02**: `--json` output on stdout is unchanged by the listing.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty track: the listing prints nothing.
- More than 10 recent packets: the 10 newest are listed.
- A description with quotes or colons: the seeded phrase is escaped for YAML.

### Error Scenarios
- `node` missing: the listing is skipped silently and the packet is still created.
- No `created_at` in a packet's graph metadata: that packet is skipped.

### State Transitions
- Phase child or sub-folder creation: no listing, since the work is already grouped.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Eight docs, one shell script, one judge module, tests |
| Risk | 10/25 | Rule wording shared by every agent, scaffold output changes |
| Research | 6/20 | Done in the review that preceded this phase |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
