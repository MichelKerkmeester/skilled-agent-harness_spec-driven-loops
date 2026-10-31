---
title: "Feature Specification: Phase 3: context-type-unification"
description: "Make one allowed `contextType` list govern spec docs and skill docs, and bring the outliers into line."
trigger_phrases:
  - "context type unification"
  - "make one allowed contexttype list govern spec docs"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: context-type-unification

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-04 |
| **Branch** | `worktrees/086-okf-adoption-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 7 |
| **Predecessor** | 002-baseline-and-decisions |
| **Successor** | 004-citation-drift-detection |
| **Handoff Criteria** | One list is imported wherever doc frontmatter is checked, behavior that depends on a value is proven unchanged, and the outlier docs are mapped. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the R1 R5 R9 adoption across spec-kit and sk-doc specification.

**Scope Boundary**: The `contextType` and `importance_tier` values and the code that reads them. No other frontmatter key and no new key.

**Dependencies**:
- Phase 002 decisions D1 and D4.
- The spec-kit runtime built in the worktree, because `dist` is per worktree.

**Deliverables**:
- Code lists derived from `shared/context-types.ts`, or a recorded reason a list stays separate.
- The `sk-doc` contract, its validators and the spec-kit validators all agree on the list.
- A warn-only check for values outside the list.
- Reviewable cleanup commits for the outlier docs, with before and after counts.
- Tests.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`shared/context-types.ts` is the declared single source of truth with four values (`implementation`, `research`, `planning`, `general`) and two aliases (`decision` to `planning`, `discovery` to `general`), and the `sk-doc` contract lists the same four. Yet the input normalizer allows 10 values and the session extractor 11. Of 11,469 spec docs that carry `contextType`, 33 distinct values appear and three cover 92.8%. Skill docs use `reference` (48) and `review` (2) outside the contract, and `importance_tier` values `high` (12) and `supporting` (2) fall outside its six-value list. Some code branches on `review` and `planning`, so shrinking to four is not free.

### Purpose
One list, checked the same way on both sides, with existing outliers mapped and no behavior lost.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Derive the spec-kit code lists from `shared/context-types.ts`, as decision D1 allows.
- Keep behavior that depends on `review` and `planning` working, with a test for each.
- A warn-only check in both the spec-kit validators and the `sk-doc` validator for values outside the list and its aliases.
- Map the outliers: about 830 spec docs and 50 skill docs, plus 14 `importance_tier` values, in separate commits.
- Confirm the skill advisor, which stores `contextType` in its graph database, ranks the same before and after.
- Before the warning ships, fix every generator so new docs emit a canonical value or a legal alias: the spec-kit templates, the sk-doc frontmatter contract and the `/create:*` workflow assets.
- Cleanup lands before the warning, so `validate.sh --strict` on every existing packet and the sk-doc validator on every skill doc print no new warning on day one.
- Each warning names the file, the key, the value found and the canonical value to use.
- Check whether `files` in the `/speckit:save` tail (`speckit-save-context-tail.yaml:28-32`) is a session value or a mistake.
- Run `/doctor:skill-advisor` and `/doctor:skill-graph-freshness` after the advisor checker imports the shared list.

### Out of Scope
- A new `type` key or any OKF mapping - that belongs to the export idea, which is deferred.
- Making the list required - that would be a corpus migration.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/shared/context-types.ts` | Modify | Source of truth and alias table |
| `.skilled/skills/system-spec-kit/runtime/cli/utils/input-normalizer.ts` | Modify | Derive the list |
| `.skilled/skills/system-spec-kit/runtime/cli/extractors/session-extractor.ts` | Modify | Derive the list |
| `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` | Modify | Contract text and the outlier values |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modify | Warn-only list check |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` | Modify | Warn-only rule entry |
| `.skilled/commands/create/assets/create-*-auto.yaml`, `.skilled/commands/create/assets/create-*-confirm.yaml` | Modify | Seed values the shared list accepts |
| `.skilled/commands/speckit/assets/speckit-save-context-tail.yaml` | Modify | Session context types match the session list |
| `.skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.mjs` | Modify | Import the shared list |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Wherever doc frontmatter is checked, the list is imported from the shared file and not retyped. |
| REQ-002 | A test proves behavior that depends on `review` and `planning` is unchanged. |
| REQ-003 | The new check is warn-only and does not fail any existing packet or skill doc. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Cleanup lands in separate commits with the before and after count of distinct values. |
| REQ-005 | A skill advisor run before and after gives the same ranking on its existing test suite. |
| REQ-006 | Every edited skill doc has its four-part version bumped and a changelog entry, as the `sk-doc` versioning rule requires. |
| REQ-007 | Before the warning ships, a full run over existing packets and skill docs prints zero new warnings, and a doc made by each `/create:*` workflow and each spec-kit template passes without one. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The distinct-value count of `contextType` on spec docs falls from 33 to the canonical four plus aliases still present.
- **SC-002**: The advisor test suite result is identical before and after.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Skill advisor graph database stores the value | Ranking could change | Compare the suite output before and after, and rebuild the database in the worktree only |
| Risk | One key name carries two meanings | High | Phase 002 answers it from the call sites, and this phase changes only what that answer allows |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The check adds no noticeable time to `validate.sh` on one packet.
- **NFR-P02**: The check runs in both validators without a new dependency.

### Security
- **NFR-S01**: No behavior change for existing saves.
- **NFR-S02**: Cleanup commits touch only frontmatter values.

### Reliability
- **NFR-R01**: A failed cleanup commit is reverted whole.
- **NFR-R02**: A value outside the list produces a warning, never an error.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A doc with no `contextType`: the default stays `general`, as the advisor does today.
- A mixed-case value: lowercase before comparing, as the advisor does.
- A legacy alias: map it and keep it legal.

### Error Scenarios
- Advisor database rebuild fails: stop and keep the old database.
- A validator run on a packet under edit: warn only.
- Two worktrees edit the same doc: the second rebases.

### State Transitions
- Partial cleanup: each commit is complete on its own.
- A doc edited mid-cleanup: re-run the count before the next commit.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Two skills, six files and tests |
| Risk | 10/25 | Advisor storage and a shared key |
| Research | 8/20 | Call sites are known, meaning is not |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does `review` stay as a behavior-carrying value or fold into `general`?
- Are the 14 `importance_tier` outliers mapped to `important` and `normal`, or left as they are?
<!-- /ANCHOR:questions -->

---


