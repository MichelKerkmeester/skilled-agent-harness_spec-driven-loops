---
title: "Goal: Make sk-code-quality a codebase-agnostic, executable author gate"
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
    packet_pointer: "sk-code/015-quality-agnostic-gate"
    last_updated_at: "2026-10-26T14:10:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed phase 006 and widened the binding and count criteria to the eight phases"
    next_safe_action: "Confirm the operator decisions in spec.md section 5 at program end"
    blockers: []
    key_files:
      - "spec.md"
      - "goal.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-26-skcode-015"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Make sk-code-quality a codebase-agnostic, executable author gate

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make sk-code-quality codebase agnostic, useful and integrated properly, as an executable gate that works in any repository, blocks on evidence it can prove, reports the checks it cannot run and hands one machine verdict to the agents that act on it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| G1 | A phase's spec documents land in a commit before any file that phase changes. |
| G2 | Every number in a document comes from a scratch measurement or the design. |
| G3 | Code comments state the durable reason only. No packet path, phase number, or REQ, ADR, task or finding id appears in a comment that a task produces. |
| G4 | Each phase passes `validate.sh --strict` on its own folder before the next phase starts. |
| G5 | Each phase ships its own changelog entry and version bump. |
| G6 | The six operator decisions in spec.md section 5 keep their defaults until the operator confirms them at program end. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-honest-checker | `001-honest-checker/goal.md` |
| 002-builtin-runner | `002-builtin-runner/goal.md` |
| 003-config-and-doctor | `003-config-and-doctor/goal.md` |
| 004-doctrine | `004-doctrine/goal.md` |
| 005-consumers-and-routing | `005-consumers-and-routing/goal.md` |
| 006-measurement | `006-measurement/goal.md` |
| 007-checker-debt-closeout | `007-checker-debt-closeout/goal.md` |
| 008-runner-limit-closeout | `008-runner-limit-closeout/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Recursive strict validation of the packet prints the pass line: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate --recursive --strict | tail -1` prints `RESULT: PASSED`.
- [ ] Every phase is Complete in the map: `grep -cE '^\| [1-8] \|.*\| Complete \|$' specs/sk-code/015-quality-agnostic-gate/spec.md` prints 8.
- [ ] Every phase folder holds a goal file, one for each binding row: `ls specs/sk-code/015-quality-agnostic-gate/00[1-8]-*/goal.md | wc -l` prints 8.
- [ ] Both quality suites exit 0: `node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs` and `bash .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.test.sh`. The node suite includes the foreign fixture F01, a repository with no `.skilled/` tree, which must come out BLOCKED.
- [ ] The runner resolves this repository to SKILLED: `node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --files .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh --format json | grep -c '"SKILLED"'` prints 1 or more.
- [ ] The consumers read the envelope: `grep -c checker_outputs .skilled/skills/sk-code/shared/references/workflow-verify.md` prints 1 or more, and `grep -c 'Quality Gate:' .skilled/agents/code.md` prints 1 or more.
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
| Packet scaffolded | Done | `create.sh` scaffold at Level 2, with six phase folders under `specs/sk-code/015-quality-agnostic-gate/` |
| Parent spec and goal authored | Done | The parent spec carries the eight-row phase map and this goal binds all eight phases |
| Phases 001 to 008 | Done | Every row of the spec phase map reads Complete, and each phase passed `validate.sh --strict` on its own folder before landing |

### Deviations and findings

| Item | Note |
|------|------|
| Placement | The design recommends a child of 014 at `004`. This packet is top-level at `015`. The operator confirms the placement at program end (spec.md section 4). |
| Design line cites | Re-checked against the tree after commits `2d068d4b7f` and `c3ca0efaa9`. Every cite this packet repeats still holds. |
| Two closeout phases | Phases 007 and 008 were added to close the checker and runner limitations that phases 001 and 002 recorded. The binding table and the two count criteria were widened from six phases to eight to match, as an amendment to this goal. |
| Operator decisions | Six decisions took the design defaults. They are recorded as ADRs in spec.md section 5, with status Accepted, pending operator confirmation at program end. |
<!-- /ANCHOR:log -->
