---
title: "Feature Specification: Phase 3: design-handoffs"
description: "sk-code and mcp-figma point design work only at the Style Reference extractor, so an open spacing, type or colour value has no route to the skill that decides values. The fundamentals motion reference has no reduced-motion rule, and fundamentals has no project-profile slot. This phase adds one hand-off line in three files, a reduced-motion section and an optional profile slot with its precedence."
trigger_phrases:
  - "design handoffs"
  - "phase 3 design handoffs"
  - "open visual decision handoff"
  - "reduced motion section"
  - "project profile slot"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: design-handoffs

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-03 |
| **Branch** | `worktrees/314-frontend-upstream-proposals` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 5 |
| **Predecessor** | 002-tooling-fixes |
| **Successor** | 004-playbook-scenarios |
| **Handoff Criteria** | `rg -n "sk-design-fundamentals"` hits all three hand-off files, and reach on sk-design shows no new outrank |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Frontend upstream proposals from Barter's frontend practice program specification. It covers proposal ranks 5, 6 and 7, the design hand-offs that give the frontend surface's value decisions somewhere to land.

**Scope Boundary**: `sk-code/SKILL.md`, `sk-code/README.md`, `mcp-figma/SKILL.md`, and in sk-design-fundamentals only `SKILL.md` and `references/motion-principles.md`. No router phrase is added anywhere.

**Dependencies**:
- Phase 001, so the hand-off line can name the `sk-code-frontend` check as the place an open value surfaces.

**Deliverables**:
- One hand-off line in each of the three files.
- A reduced-motion section for web and native that names no library.
- A documented optional `references/<project>-profile.md` slot and the four-step precedence in fundamentals `SKILL.md`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-code names only `sk-design-md-generator` for design input (`sk-code/SKILL.md:64`, `sk-code/README.md:102`), and mcp-figma pairs only with that extractor, so neither tells an implementer where an open spacing, type or colour value is decided. The fundamentals motion reference has 200 lines and no reduced-motion rule. Fundamentals `SKILL.md` lets a token file, design system or Style Reference outrank its defaults (`:313`), but it has no slot for a project's house-style profile.

### Purpose
A value that the frame or the task leaves open goes to `sk-design-fundamentals` before it is built, motion honours the user's reduced-motion setting, and a project can add a house-style profile without editing fundamentals' router.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ grep -n "sk-design" .skilled/skills/sk-code/SKILL.md .skilled/skills/sk-code/README.md
.skilled/skills/sk-code/SKILL.md:64:- For a measured Style Reference (design tokens extracted from a live source), use `sk-design-md-generator` first.
.skilled/skills/sk-code/README.md:102:| `sk-design-md-generator` | Extracts a measured Style Reference (design tokens from a live source) that sk-code may implement |

$ grep -c "sk-design-fundamentals" .skilled/skills/mcp-tooling/mcp-figma/SKILL.md
0

$ wc -l .skilled/skills/sk-design/sk-design-fundamentals/references/motion-principles.md
200 .skilled/skills/sk-design/sk-design-fundamentals/references/motion-principles.md

$ grep -ciE "reduce|native|android|ios" .skilled/skills/sk-design/sk-design-fundamentals/references/motion-principles.md
0

$ grep -c -i "profile" .skilled/skills/sk-design/sk-design-fundamentals/SKILL.md
0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add one line to `sk-code/SKILL.md`, `sk-code/README.md` and `mcp-figma/SKILL.md`: a value the frame or the task leaves open goes to `sk-design-fundamentals` before it is implemented.
- Add a reduced-motion section to `motion-principles.md`: honour `prefers-reduced-motion` on the web and the platform reduce-motion setting on native, naming no animation library.
- Document an optional `references/<project>-profile.md` slot in fundamentals `SKILL.md`, loaded only when a request names that project's UI, with the precedence: repository mode, installed tokens, design scales, then profile.
- Confirm by reach on sk-design and sk-code that the phase added no routing phrase and moved no prompt.

### Out of Scope
- Any profile content, and any intent or phrase that loads a profile - a project's profile routing is project-owned, so a generic phrase here would pull prompts.
- Naming Reanimated or any version gate - the Reanimated gate is barter-expo's, per the proposals.
- The Barter App UI Profile - Barter-only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/SKILL.md` | Modify | One hand-off line |
| `.skilled/skills/sk-code/README.md` | Modify | One related-skills row or line |
| `.skilled/skills/mcp-tooling/mcp-figma/SKILL.md` | Modify | One hand-off line |
| `.skilled/skills/sk-design/sk-design-fundamentals/references/motion-principles.md` | Modify | Reduced-motion section |
| `.skilled/skills/sk-design/sk-design-fundamentals/SKILL.md` | Modify | Profile slot and precedence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `rg -n "sk-design-fundamentals"` prints one hand-off line in each of `sk-code/SKILL.md`, `sk-code/README.md` and `mcp-figma/SKILL.md`. |
| REQ-002 | `motion-principles.md` has a reduced-motion section that names `prefers-reduced-motion` for the web and the platform setting for native, and `rg -n -i "reanimated|framer|gsap"` on the file prints nothing. |
| REQ-003 | Fundamentals `SKILL.md` documents the optional `references/<project>-profile.md` slot and the four-step precedence in that order. |
| REQ-004 | No `ROUTER.md`, `hub-router.json` or `graph-metadata.json` changes in this phase (`git diff --stat` lists none). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Router reach on sk-design and sk-code at concurrency 2 matches the phase 002 final numbers. |
| REQ-006 | The profile slot says a profile loads only when a request names that project's UI, and that an unknown project loads none. |
| REQ-007 | `motion-principles.md` stays at 250 lines or fewer. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three hand-off files name `sk-design-fundamentals`, where today two name only the extractor and mcp-figma names neither.
- **SC-002**: The reduced-motion grep on `motion-principles.md` moves from 0 matches to at least one.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001's surface name | Low | The line names the skill, so it holds even if the surface name changes |
| Risk | The profile slot text adds a routing phrase by accident | Med | REQ-004 diff check plus REQ-005 reach comparison |
| Risk | The precedence reads as overriding a repository's own tokens | Med | State the order with repository mode first, matching `SKILL.md:313` |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A - doc-only change with no runtime path.
- **NFR-P02**: N/A - nothing is loaded at a new time except an operator-added profile.

### Security
- **NFR-S01**: N/A - no credential, network or data path.
- **NFR-S02**: N/A - doc-only.

### Reliability
- **NFR-R01**: The sk-design and sk-code reach numbers do not move.
- **NFR-R02**: The fundamentals playbook validator still passes after the edits.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a request that names no project loads no profile.
- Maximum input: a repository with its own token file, a design system and a profile applies them in the documented order, and the profile comes last.
- Failure path: a request naming a project with no profile file falls back to fundamentals defaults and says no profile was found.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Five doc files, a few lines each |
| Risk | 7/25 | Accidental routing phrase |
| Research | 3/20 | Wording only |
| **Total** | **16/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocks. The exact wording of the hand-off line is settled once at T004 and reused in all three files.
<!-- /ANCHOR:questions -->

---
