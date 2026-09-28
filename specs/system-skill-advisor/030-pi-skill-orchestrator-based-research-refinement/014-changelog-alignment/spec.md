---
title: "Feature Specification: Changelog Alignment for the Skill Advisor Work"
description: "The skill advisor changelog breaks the sk-create-changelog contract and records nothing after 2026-09-12, and seven other components packet 030 changed have no entry for it. This phase aligns the advisor entries, writes the missing ones and adds the advisor work to the v4.0.0.2 release notes."
trigger_phrases:
  - "skill advisor changelog alignment"
  - "packet 030 changelog entries"
  - "advisor changelog four-part names"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Changelog Alignment for the Skill Advisor Work

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 14 |
| **Predecessor** | 013-review-follow-ups |
| **Successor** | None |
| **Handoff Criteria** | Every entry this phase writes or edits passes `validate_document.py` and the HVR scan, and packet 030 validates strict |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of packet 030. Phases 2 to 13 changed the skill advisor and five other components, and none of that reached a changelog except two cli entries.

**Scope Boundary**: changelog entries, the `SKILL.md` versions they move and the artifacts that follow those versions mechanically. No code changes.

**Dependencies**:
- The sk-create-changelog contract (`.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` v1.3.1.0) and its template.
- The frontmatter versioning standard for the `SKILL.md` anchor.
- `compiled-route-manifest.cjs` and `sync-skills-hermes.cjs` for the artifacts a `SKILL.md` edit invalidates.

**Deliverables**:
- The advisor changelog aligned with the contract, plus entries v0.11.2.0 and v0.12.0.0.
- One entry each for system-spec-kit, the deep-loop runtime, deep-review, deep-research, cli-codex, the cli-external-orchestration hub and sk-code-opencode.
- A skill advisor section in `.skilled/changelog/skilled/v4.0.0.2.md`.

**Changelog**:
- This phase writes global component entries. It adds no packet-local changelog.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor is the only skill whose changelog still uses three-part file names, 10 of its 12 entries, while the contract and the other 539 entries under `.skilled/skills` use four parts. Two entries carry the wrong title shape and list a topic phrase before an identity phrase, and one carries the wrong H1 shape with a topic phrase of eight words. Nothing after v0.11.1.0 of 2026-09-12 is recorded, although the source-root move, packets 028 and 029 and all of packet 030 changed the advisor, and packet 030 also changed system-spec-kit, the deep-loop runtime and commands, cli-codex, the cli-external-orchestration hub playbook and sk-code-opencode without an entry for any of them.

### Purpose
Every change the skill advisor work shipped is findable in the changelog of the component it changed and in the v4.0.0.2 release notes, in the form the contract defines.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename the 10 three-part advisor entries to four parts with `git mv`, update each title and identity phrase to the new version and name versions in four parts where the text names an advisor version.
- Give v0.11.0.0 and v0.11.1.0 the contract title and put their identity phrases first. Give v0.5.0.0 the `# v<version>, <title>` H1 and cut its topic phrase to six words or fewer.
- Write advisor v0.11.2.0 for the source-root move and the other advisor changes that shipped with Skilled v4.0.0.0 and v4.0.0.1, and v0.12.0.0 for the packet 030 hook work.
- Write system-spec-kit v4.1.4.0, deep-loop runtime v1.5.1.0, deep-review v1.11.1.0, deep-research v1.15.1.0, cli-codex v1.9.5.0, cli-external-orchestration v1.7.1.0 and sk-code-opencode v1.0.1.0.
- Set each bumped `SKILL.md` to its new anchor, with the four other cli-external-orchestration hub root artifacts that state the hub version, re-mint each hub route manifest the route guard reports stale and rebuild the affected Hermes copies.
- Add the skill advisor work to `.skilled/changelog/skilled/v4.0.0.2.md`.
- Bind this phase in the parent goal, shortening decision prose per cut-order step 5 so the parent stays inside 4,000 characters.

### Out of Scope
- The 35 entries in other skills whose title reads `<component> changelog v<version>` - fleet-wide drift outside the advisor work, reported instead.
- A changelog component for `.pi/extensions/pi-cache-optimizer` - none exists and the contract forbids creating one, so its fix is named in the release notes only.
- Rewording the body text of legacy advisor entries - the 059 retrofit already rewrote them in the current format.
- cli-cursor v1.5.0.0 and cli-devin v1.4.5.0 content - written by phases 11 and 12, checked here and left as they are when they pass.
- Links to the old advisor file names in archived or historical spec records - they describe what was true when written.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/changelog/v0.*.md` | Rename and Modify | 10 renames, title, phrase and H1 fixes on the entries that need them |
| `.skilled/skills/system-skill-advisor/changelog/v0.11.2.0.md`, `v0.12.0.0.md` | Create | The two missing advisor entries |
| Seven component `changelog/` folders | Create | One entry each, as listed in scope |
| Seven `SKILL.md` files | Modify | Version set to the new anchor |
| `cli-external-orchestration/{ROUTER.md,description.json,hub-router.json,mode-registry.json}` | Modify | The hub version they restate |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/*/manifest.json` | Modify | Re-minted for the hubs whose inputs changed |
| `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/*/manifest.json` | Modify | The authored copy of each re-minted manifest |
| `.hermes/skills/*/SKILL.md` | Modify | Rebuilt for each bumped `SKILL.md` |
| `.skilled/changelog/skilled/v4.0.0.2.md` | Modify | The skill advisor section |
| `../goal.md`, `../spec.md` | Modify | The 014 binding and phase map rows |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No three-part `v*.md` file remains in the advisor changelog, and every advisor entry's title and identity phrases name its file's version |
| REQ-002 | Advisor v0.11.2.0 and v0.12.0.0 exist and record every user-visible advisor change since v0.11.1.0, each traceable to a commit |
| REQ-003 | Every entry this phase writes or edits passes `validate_document.py` and has zero hard HVR findings |
| REQ-004 | Packet 030 validates strict and recursive with `RESULT: PASSED` for every folder |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Each other component packet 030 changed has an entry for that change, strictly greater than its previous newest version |
| REQ-006 | Each bumped `SKILL.md` equals its newest entry, the route guard reports every hub fresh and the Hermes check reports every copy in sync |
| REQ-007 | `.skilled/changelog/skilled/v4.0.0.2.md` describes the skill advisor work and passes `validate_document.py` and the HVR scan |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A lookup for `system-skill-advisor v0.12.0.0` or any renamed advisor version finds its entry by its identity phrase.
- **SC-002**: A reader of each changed component's changelog finds the packet 030 change to that component without opening the spec packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The retrieval corpus fixture lists the advisor file names | A stale fixture after the renames | Every trigger-index rebuild rewrites it, and the index is rebuilt after the commit |
| Risk | A `SKILL.md` edit leaves a hub manifest or Hermes copy stale and the pre-push guard refuses the push | Med | Re-mint and rebuild through their own tools, then run the route guard and the Hermes check before committing |
| Risk | An entry claims a change the code does not make | Med | Each claim is written from a commit body or a phase summary and checked against the code it names |
| Risk | Another session writes a newer entry to the same component first | Low | Recheck each folder's newest version immediately before writing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Accuracy
- **NFR-A01**: Every claim in a new entry traces to a commit in this workstream or to the code it describes.
- **NFR-A02**: Legacy entries keep every change their current text records.

### Voice
- **NFR-V01**: New prose follows the Human Voice Rules, with no em dash, semicolon or serial comma.
- **NFR-V02**: Entries follow the contract's omission rules: no file inventories, test counts or review-pass counts.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A rename target name already exists: stop, since the contract never overwrites an entry.
- A body names a version of another component, such as `cli-cursor v1.5.0.0`: leave it, since only advisor versions changed name.

### Error Scenarios
- The route guard reports a hub stale after the re-mint: find which input changed and re-mint that hub, never excuse it.
- The Hermes sync touches copies other than the bumped ones: copy back only the bumped skills' files.

### State Transitions
- Another session edits a file in scope mid-phase: leave its change unstaged and record it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | About 45 files, all documentation or derived artifacts |
| Risk | 6/25 | No code changes. Reversible by `git revert` |
| Research | 10/20 | The change history of five components across 40 commits |
| **Total** | **31/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose a new phase 014 of packet 030 on 2026-09-28.
<!-- /ANCHOR:questions -->

---
