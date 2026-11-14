---
title: "Goal: sk-code audit remediation"
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
    packet_pointer: "sk-code/hub-architecture/006-sk-code-audit-remediation"
    last_updated_at: "2026-11-14T12:45:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-audit-remediation-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: sk-code audit remediation

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close every finding from the 2026-11-14 sk-code audit with a proven fix or a recorded reason, so that a frontend request reaches the frontend surface and the hub's documents agree with its router.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A finding is fixed only after phase 001 marks it `Confirmed` or `Changed` in the findings ledger. |
| D2 | The 22 prompts in `001-finding-verification/scratch/probes.txt` are the measure of reach. A probe is never edited to make it pass. |
| D3 | The machine router blocks are the authority. Prose and packet documents change to match them. |
| D4 | Each fix is made at its source. No vocabulary generator, new framework section or script refactor is built. |
| D5 | Files outside `.skilled/skills/sk-code/` and the sk-code doctor script change only after the operator answers the open question that names them. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-finding-verification | `001-finding-verification/goal.md` |
| 002-frontend-reach | `002-frontend-reach/goal.md` |
| 003-frontend-content | `003-frontend-content/goal.md` |
| 004-vocabulary-single-source | `004-vocabulary-single-source/goal.md` |
| 005-hub-router-alignment | `005-hub-router-alignment/goal.md` |
| 006-skilled-packet-fixes | `006-skilled-packet-fixes/goal.md` |
| 007-review-packet-fixes | `007-review-packet-fixes/goal.md` |
| 008-quality-packet-fixes | `008-quality-packet-fixes/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -c '| - |$' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md` prints 0, so every finding row carries fix evidence or `no change`.
- [ ] For every line tagged `frontend` in `specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/scratch/probes.txt`, `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "<prompt>"` prints a decision that contains `"workflowMode":"sk-code-frontend"`, and for every line tagged `negative` it does not.
- [ ] `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` ends with `STATUS=PASS failed=0` and exits 0.
- [ ] `grep -L 'Closeable:\*\* Yes' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/0*/acceptance-criteria.md` prints nothing.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/hub-architecture/006-sk-code-audit-remediation --recursive --strict --quiet` prints `RESULT: PASSED` on every line.
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
| Parent spec, parent goal and the child planning documents authored | Done | Written on 2026-11-14 in worktree `worktrees/379-sk-code-audit-remediation` |
| Phase 001 finding verification | Pending | 37 rows are `Unverified` in the findings ledger |
| Operator answer 2026-11-14: fix the 23 drift-guard files outside sk-code (22 .pi/extensions ts headers, skilled-loop-shell.sh strict mode) | Done | AskUserQuestion answer, satisfies decision D5 for phase 005 |
| Operator answer 2026-11-14: sk-code-setup-check.cjs exits non-zero on STATUS=FAIL | Done | AskUserQuestion answer for phase 005 |
| Operator answer 2026-11-14: .tsx and .jsx are frontend file markers and tokens.css type tokens move to rem | Done | AskUserQuestion answer for phases 002 and 003 |
| Operator answer 2026-11-14: commit per phase on worktrees/379-sk-code-audit-remediation, no push; build with DeepSeek V4.1 Flash max over LLM Gateway via cli-pi, one change per dispatch | Done | AskUserQuestion answer and operator message |
| Phase 001 finding verification | Done | No ledger row is Unverified or TBD, router-baseline.txt holds 22 decisions and setup-baseline.txt one STATUS line, commit b1360e7b85 |
| Row H5 corrected to Changed | Recorded | sk-code-setup-check.cjs already exits 1 on STATUS=FAIL in this tree, so phase 005 keeps only the 23-file drift fix from that row |
| Phase 002 frontend reach | Done | Code 40b8d7e6b7. Rows F1 to F4 carry fix evidence. 15 DeepSeek V4.1 Flash dispatches through cli-pi |
| Operator confirmation requested | Open | .skilled/bin/tests/compiled-route-surface-hint.test.cjs line 163 changed outside sk-code under decision D5, because the planned FRONTEND block made its old expectation false |
| Phase 003 frontend content | Code done, closure waits on the operator | Code 62507384e6. AC-003 names a baseline of 48 where the tree held 57, and AC-004 asks for 400 lines where the frozen scope reaches 586 |
| Phase 003 frontend content | Done | Code 62507384e6. Rows F5 to F13 carry fix evidence. 27 DeepSeek V4.1 Flash dispatches through cli-pi. Operator answers of 2026-11-14 corrected the rule count to 57 and accepted 586 lines under ADR-001 |
| Operator answer 2026-11-14: phase 004 guards the frontend copies and records the sk-code-ci drift | Done | AskUserQuestion answer. CI holds 72 keywords in hub-router.json, 58 in the hub ROUTER.md row and 12 in the packet row, so no CI keyword changes in phase 004 |
| Phase 004 vocabulary single source | Done | Code 9a9bbb76aa. Row H1 carries fix evidence. New ledger row H7 records the sk-code-ci keyword copies, 72, 58 and 12, left for a later packet on the operator's answer |
| Phase 005 hub router alignment | Done | Code 19214454c5. Rows H2 to H6, SK-07 and QL-09 carry fix evidence. Hub version 3.12.0.0 with a release note naming the rows of phases 002 to 005. The battery ends STATUS=OK legs=9 and exits 0 |
| Operator answers 2026-11-14 for phase 005 | Done | Remove one blank line from skilled-loop-shell.sh in place of a top-level set. Revert the 22 Pi extension headers and exempt one-line re-export files in the drift guard, because the mirror-parity gate requires one line per file |
| Criterion 3 quotes a line the battery never prints | Open | The battery's pass line is STATUS=OK legs=9 with exit 0. Phase 005 ADR-001 records it. The criterion text is frozen, so the operator decides whether to amend it |

### Deviations and findings

| Item | Note |
|------|------|
| `recommend-level.sh --recommend-phases` returned `recommended_phases: false` | The operator asked for a phased packet and chose eight phases, so the packet is phased |
| The audit used the Pi route for DeepSeek V4.1 Flash, not the DeepSeek Harness | The harness skill pins `dsh` 0.2.2-rc.1 and the installed binary reports 0.2.2-rc.3 |
<!-- /ANCHOR:log -->
