---
title: "Feature Specification: Phase 10: Prose clarity pass"
description: "Make every skill doc, and the command and agent docs that teach routing, readable after one pass."
trigger_phrases:
  - "prose clarity pass"
  - "skill routing phase 10"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 10: Prose clarity pass

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-28 |
| **Branch** | `worktrees/254-skill-routing-and-clarity` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 11 |
| **Predecessor** | 009-standalone-skills |
| **Successor** | 011-regeneration-and-verification |
| **Handoff Criteria** | Every P0 requirement below is met and `validate.sh --strict` passes for this folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the skill routing and clarity program. Its plan comes from the phase 001 research at `../001-deep-research/research/research.md`.

**Scope Boundary**: the files listed under Files to Change. Anything else is a later phase or out of scope.

**Dependencies**:
- Phases 005 to 009

**Deliverables**:
- The changes in scope, and the gate output that proves them.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Skill docs use terms before defining them, mix project history into instructions, and carry single lines of 1,000 to 2,200 characters. The operator finds the sk-code mode skills hard to read.

### Purpose
Make every skill doc, and the command and agent docs that teach routing, readable after one pass.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ python3 - <<'PY'
import glob
fence = "`" * 3
over = 0
worst = (0, "")
in_fence = False
paths = sorted(glob.glob(".skilled/skills/**/SKILL.md", recursive=True))
for path in paths:
    for number, line in enumerate(open(path, encoding="utf-8"), 1):
        text = line.rstrip("\n")
        if text.lstrip().startswith(fence):
            in_fence = not in_fence
            continue
        if in_fence or text.lstrip().startswith("|"):
            continue
        if len(text) > 400:
            over += 1
            worst = max(worst, (len(text), path + ":" + str(number)))
print("SKILL.md files scanned: " + str(len(paths)))
print("prose lines over 400 characters: " + str(over))
print("longest: " + str(worst[0]) + " characters at " + worst[1])
PY
SKILL.md files scanned: 59
prose lines over 400 characters: 368
longest: 2195 characters at .skilled/skills/sk-git/SKILL.md:307
```
The scan skips fenced blocks and table rows, so what it counts is prose. 368 lines across 59 files is the size of the pass REQ-002 asks for, and the longest line, 2,195 characters at `.skilled/skills/sk-git/SKILL.md:307`, is the 1,000 to 2,200 character line the problem statement names. Those were the readings before the pass. After it, the same scan with pinned lines skipped counts 0 prose lines over 400 characters, and `scratch/sweep.md` §1 holds the before and after per surface. The gate set is recorded beside them: 39 gates at exit 0 at `9fdae0b7d4`, with routing accuracy 155/195, 49/66 and 19/24 (`scratch/before.md`).
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Apply the clarity rules from the research: instructions first, each fact once, one idea per sentence, one glossary per hub, second person, no history in instructions, code blocks only for what a person runs or a parser reads.
- Split overlong lines and define each term once.
- Leave pinned lines and machine blocks unchanged.
- Correct stale CLI reference prose: `system-spec-kit/references/cli/memory-handback.md` lines 3, 16 and 22 call the siblings six although cli-hermes is the seventh; `references/cli/shared-smart-router.md` line 17 says the helper bodies are byte-identical across seven files although sibling `SKILL.md` files no longer inline them.
- Land the same clarity rules in sk-create-skill, so a new skill is written that way from the start: its templates, its writing guidance, and the authoring steps of the `/create:skill` and `/create:skill-parent` workflows.
- Make both default create flows run the human-voice check (`sk-create-with-human-voice` scoring) on the generated `SKILL.md` and `README.md`, instead of leaving it as a later pass.

### Out of Scope
- Routing structure - phases 003 to 009

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/**/SKILL.md` | Modify | Prose |
| `.skilled/commands/` | Modify | Routing prose |
| `.skilled/agents/` | Modify | Routing prose |
| `.skilled/skills/sk-doc/sk-create-skill/assets/`, `sk-create-skill/references/` | Modify | Templates and writing guidance carry the clarity rules |
| `.skilled/commands/create/` | Modify | Both creation workflows apply the rules and run the human-voice check |
| `.skilled/skills/system-spec-kit/references/cli/memory-handback.md`, `shared-smart-router.md` | Modify | Correct stale sibling count and helper-body claims |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `check-rule-copies.js`, `package_skill.py --strict` and `verify-doc-claims.cjs` pass after the pass. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | No line in a skill `SKILL.md` exceeds 400 characters outside code blocks and tables. |
| REQ-003 | sk-create-skill's templates, writing guidance and both `/create:skill` and `/create:skill-parent` authoring steps carry the clarity rules, so a new skill is written that way from the start. |
| REQ-004 | Both default create flows, `/create:skill` and `/create:skill-parent`, run the `sk-create-with-human-voice` scoring check on the generated `SKILL.md` and `README.md`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three checks pass.
- **SC-002**: A line-length scan finds no prose line over 400 characters.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 005 to 009 | Prose edits land on the final structure | Run after them |
| Risk | A rewrite changes a meaning a check depends on | Med | Run the checks after each skill |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: documentation and tooling changes with no service to measure.

### Security
- **NFR-S01**: No change names an operator-local surface in a tracked file.

### Reliability
- **NFR-R01**: Every gate this phase touches passes at least as well as in the phase 002 baseline.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a skill with no routing section is left as it is and recorded.
- Maximum input: the largest file in scope is changed last, after the shape is proven on smaller ones.
- Failure path: a gate that gets worse blocks the next file until it is fixed or the change is reverted.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | See Files to Change |
| Risk | 6/25 | Low blast radius |
| Research | 4/20 | Phase 001 settled the design |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking planning. Open research questions that bear on this phase are in `../001-deep-research/research/research.md` §12.
<!-- /ANCHOR:questions -->

---
