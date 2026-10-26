---
title: "Goal: Phase 4: doctrine"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/004-doctrine"
    last_updated_at: "2026-10-26T09:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed the doctrine phase and recorded the landing log"
    next_safe_action: "Land after phase 003, then hand over to phase 005"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-doctrine-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 4: doctrine

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Amend the sk-code doctrine so an UNKNOWN surface gets the universal floor and the runner's built-in checks, the SKILLED house checklist loads only for SKILLED, and the implement, debug and verify handoffs name the runner.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Iron Law 3 takes the amended text, so an UNKNOWN surface gets the universal floor and the runner's built-in checks until the operator names its surface and commands (ADR-001). |
| D2 | `universal-checklist.md` is the SKILLED house checklist, and it loads only when SKILLED resolves for the target (ADR-002). |
| D3 | The review-severity column in `code-quality-standards.md` is a mapping that `sk-code-review` confirms before this phase closes. Review keeps its ids and meanings (ADR-003). |
| D4 | This phase edits the verify handoff in `workflow-verify.md`, so phase 005 does not edit it (ADR-004). |
| D5 | The operator-private skill id leaves the three checklist lines, and no other file changes for that id in this phase. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `rg -n "An UNKNOWN surface gets the universal floor" .skilled/skills/sk-code/shared/references/phase-detection.md` prints one line starting `109:`.
- [ ] `rg -n "built-in checks" .skilled/skills/sk-code/shared/references/stack-detection.md` prints two lines, starting `32:` and `49:`.
- [ ] `rg -n "^# SKILLED House Code Quality Checklist" .skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md` prints one line starting `14:`.
- [ ] `rg -l "local-" .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/` prints nothing.
- [ ] `rg -n "CHK-CSS-09" .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/naming-init-formatting-and-css.md` prints one line starting `65:` that contains `[P2]`.
- [ ] `rg -c "Review severity" .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` prints `4`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate/004-doctrine --strict --no-recursive` prints `RESULT: PASSED` as its last line.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Packet authored from the design | Done | Spec, plan, tasks, acceptance criteria, decision record and this goal were written in this pass |
| Design lines rechecked at the current tree | Done | Every Phase 4 citation matched its line. Commits `2d068d4b7f` and `c3ca0efaa9` changed only `sk-code/README.md`, `sk-code/ROUTER.md` and the advisor README, so no cited line moved |
| Landing recheck at HEAD `f69e5cd2e8` (T001) | Done | Every cited line matched, except two in `sk-code-quality/SKILL.md` that phase 002 moved: the P0 table now opens at line 224 with its pointer sentence on line 222, in place of lines 190 to 196, and ESCALATE IF item 1 sits on line 291, in place of line 254 |
| Doctrine and checklist edits | Done | Tasks T003 to T017, with three line anchors amended by ADR-005 |
| Changelogs and version bumps | Done | Tasks T018 to T020. Hub 3.4.0.0, sk-code-quality 1.8.0.0 and sk-code-skilled 2.1.0.0, as the coordinator pre-assigned |
| Review confirmation of the column | Done | Task T021. Twenty rows checked against the loaded `sk-code-review` contract, eighteen confirmed and two refined (ADR-003) |

### Deviations and findings

| Item | Note |
|------|------|
| Design phase 5 scope lists the verify reader rule | Taken into this phase at `workflow-verify.md` line 56, as ADR-004 records |
| Design phase 4 scope moves CHK-CSS-09 to P2, while CHK-CSS-10 and CHK-CSS-11 stay at P1 | Applied as designed. The base rule now sits below the rules that depend on it. Recorded for review |
| Design says a parse failure is P0 on every surface | A plain JavaScript parse finding stays heuristic, as the runner's rule table states in design section 3.4 |
| Design section 5.2 bundles the P0 table link with two rows that become UNVERIFIED | The link stays here. The two rows move to phase 002, which owns the UNVERIFIED state |
| Seven tracked files outside this phase name the operator-private id | Open question in spec.md. Not changed here. A recount at landing found seven tests or fixtures plus two released changelog entries under `.skilled/` |
| Finding classes (CHK-FIX-001) | The operator-private id in three checklist lines is class-of-bug, with the seven tests and fixtures above as its same-class sites. Iron Law 3 is cross-consumer, read by `stack-detection.md`, `code-quality-standards.md`, `workflow-verify.md` and `sk-code-quality/SKILL.md`. The CHK-CSS-09 severity is instance-only, with its two template rows moved with it |
| Phase 003 not on main in this worktree | Its names come from its `spec.md`, as the coordinator ruled. The config template is absent here (T002) |
| Packet-relative path in workflow step 2 | The first drift-guard run failed doc-claims on it. The step now names the full path to `runner-contract.md` |
<!-- /ANCHOR:log -->
