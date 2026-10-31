---
title: "Implementation Plan: Phase 3: Goal Authoring Standards and Exemplars"
description: "The phase derives five goal-authoring standards from the template and Human Voice Rules, then checks them against four cited corpus examples."
trigger_phrases:
  - "goal standards plan"
  - "goal rubric verification"
  - "negative and positive goal examples"
  - "goal authoring reference"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: Goal Authoring Standards and Exemplars

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | system-spec-kit goal contract and Human Voice Rules |
| **Storage** | sk-create-goal references and assets |
| **Testing** | Manual corpus rubric, HVR publish checklist and strict spec validation |

### Overview
The mode needs a content standard above the goal template's shape: the template asks for a purpose-led sentence, frozen decisions, three to seven checkable criteria and a volatile log (.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:49,53,96-115). This phase puts five reader-applied standards and four cited corpus examples into the mode packet, following the standards-plus-authoring-hook pattern in phase 004 of create-repo-rule (specs/sk-doc/z_archive/040-create-repo-rules/004-creation-standards-and-guardrails/spec.md:41-53; specs/sk-doc/z_archive/040-create-repo-rules/004-creation-standards-and-guardrails/plan.md:22-33).

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 2 has passed its parent handoff: packaging gate reports PASS and the parent-skill check is OK (specs/sk-doc/060-create-goal-mode/spec.md:143).
- [ ] The template, HVR references and four corpus examples are available at their cited paths.

### Definition of Done
- [ ] Each of the five standards states its failure and a reader check.
- [ ] The exemplar rubric rejects all three bad cases and passes the good child objective.
- [ ] The mode index and authoring workflow load the reference.
- [ ] The phase passes strict validation after generated metadata is refreshed.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Corpus-derived, reader-applied standards with positive and negative controls. Phase 004 of create-repo-rule derives its standards from a corpus, checks the standards against real examples and requires the thin sample to fail (specs/sk-doc/z_archive/040-create-repo-rules/004-creation-standards-and-guardrails/spec.md:64-68,109-112).

### Key Components
- **Authoring standards**: Five checks for objective, decisions, completion criteria, volatile log and voice. Each check states the failure it prevents.
- **Exemplar set**: Three cited failure cases and one cited good phase-child objective, each with a rubric result.
- **Mode hooks**: The reference index links both documents and the skill loads them during authoring.

### Data Flow
The goal template and HVR provide source constraints. The corpus provides examples for each standard. The standards define the checks. The exemplar set records the three bad outcomes and the passing child example.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a planned documentation phase, not a bug fix. Its future target files are the standards reference, exemplar asset, reference index and skill workflow listed in spec.md. The repository's create-repo-rule standards phase used a reference document and a SKILL.md loading hook for the same kind of quality layer (specs/sk-doc/z_archive/040-create-repo-rules/004-creation-standards-and-guardrails/spec.md:41-53).

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| .skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md | Goal-content quality bar | Create | Five checks each state a failure and an observable reader test |
| .skilled/skills/sk-doc/sk-create-goal/assets/goal-exemplars.md | Corpus controls | Create | Three failures and one passing child example cite verified source lines |
| .skilled/skills/sk-doc/sk-create-goal/references/README.md | Reference index | Modify | Index links to standards and exemplars |
| .skilled/skills/sk-doc/sk-create-goal/SKILL.md | Authoring workflow | Modify | Workflow loads the standards at the authoring step |

Required inventories:
- Corpus examples: the three bad goal cases and one good child goal named in spec.md, plus the good child's decisions, criteria and log passages.
- Evidence axes: five standards by the applicable source passages. Record each standard's failure, reader check and at least one real goal example.
- Invariant: the rubric rejects all known-bad examples and accepts the known-good child objective.

<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in tasks.md. Each step has an observable check.

### Phase 1: Setup
- T001-T005: Confirm phase inputs, inspect cited source lines and map each standard to its failure and evidence. Check: the evidence map names all five standards and all four source examples.

### Phase 2: Implementation
- T006-T012: Write the standards and exemplar documents, then connect them to the mode reference index and skill workflow. Check: the named four target files exist and contain the planned sections and links.

### Phase 3: Verification
- T013-T015: Apply the same rubric to all four examples, run the Human Voice Rules publish checklist and run the phase validator. Check: 3/3 bad examples fail, 1/1 good example passes, both authored docs score at least 85 with no hard blockers and strict validation reports the phase result.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Negative controls | Placeholder objective, cross-file criterion and mismatched child count | Apply the reader rubric; record three failures in assets/goal-exemplars.md |
| Positive control | Phase-child research objective, decisions, criteria and log | Apply the relevant standards; record the objective pass and the supporting source spans in assets/goal-exemplars.md |
| Voice review | Standards and exemplar documents | Apply hvr-rules.md and the hvr-publish-supplement.md checklist; record score and blockers |
| Citation review | Each repository claim and each exemplar | Reopen cited spans with nl -ba and compare the quoted content |
| Packet gate | This phase folder | bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode/003-authoring-standards-and-exemplars --strict; require RESULT: PASSED |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 2 mode packet and handoff | Internal | Pending | The mode index and skill workflow cannot be updated before they exist (specs/sk-doc/060-create-goal-mode/spec.md:143) |
| Goal template | Internal | Available | Standards could contradict the required goal shape (.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:49-128) |
| Human Voice Rules and publish supplement | Internal | Available | Voice and publish checks would lack their source standard (.skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:31-35; .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-publish-supplement.md:67-83) |
| Four corpus examples | Internal | Available | The positive and negative controls could not be verified (specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:41-45) |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The rubric passes any known-bad case, rejects the known-good objective or conflicts with a parent decision.
- **Procedure**: Before editing, copy the four mode files to /tmp/create-goal-phase-003-rollback. To undo the phase, copy those versions back over the four mode files. Correct the source-to-standard mapping, then rerun the same corpus rubric and strict validator. Do not alter the phase planning packet, source corpus or runtime state.

<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 2 handoff | Implementation |
| Implementation | Setup evidence map | Verification |
| Verification | Standards and exemplars | Phase 4 |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 1-2 hours |
| Implementation | Medium | 2-3 hours |
| Verification | Medium | 1-2 hours |
| **Total** | | **4-7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Save the four planned mode documentation files under /tmp/create-goal-phase-003-rollback before editing.
- [ ] Confirm no runtime state or data migration is in scope.

### Rollback Procedure
1. Copy the saved versions from /tmp/create-goal-phase-003-rollback back to the four mode documentation paths.
2. Rerun the four-example rubric and verify its expected 3-fail, 1-pass result.
3. Rerun strict validation and inspect the reported rule IDs.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable; this phase changes documentation only.

<!-- /ANCHOR:enhanced-rollback -->

---
