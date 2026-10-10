---
title: "Goal: Follow-up fixes for the sk-code Ponytail refinement"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes"
    last_updated_at: "2026-10-10T08:10:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-007-follow-up-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Follow-up fixes for the sk-code Ponytail refinement

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close the five gaps found while building phases 002 to 006, so the review checker, the leaf-manifest generator, the agent-mirror gate, the hook stdin reader and the router-sync checks each do what their documentation says.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Claude agents on the haiku model at xhigh effort plan and build each child; they never commit |
| D2 | The orchestrator reruns every criterion in a child's `goal.md` before calling it done, then makes one commit per child in folder order; never push |
| D3 | If the restored router-sync guard fails on the current tree, stop and report before wiring it into the drift-guard umbrella |
| D4 | Three failed repairs on one child stop that child; report the command and its output |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-review-checker-gaps | `001-review-checker-gaps/goal.md` |
| 002-leaf-generator-ignores | `002-leaf-generator-ignores/goal.md` |
| 003-codex-mirror-gate | `003-codex-mirror-gate/goal.md` |
| 004-hook-stdin-deadline | `004-hook-stdin-deadline/goal.md` |
| 005-router-sync-guard | `005-router-sync-guard/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] In the worktree, `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes --recursive --strict` prints `RESULT: PASSED` 6 times and `RESULT: FAILED` 0 times
- [ ] In the worktree, `grep -l 'completion_pct: 100' specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/00[1-5]-*/implementation-summary.md | wc -l` prints 5
- [ ] In the worktree, `git log --format='%(trailers:key=Spec,valueonly)' main..HEAD | grep -c '/007-follow-up-fixes/'` prints 5, one per child, and `git status --short` prints nothing
- [ ] In the worktree, `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` exits 0, and `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs` prints `failed=0`
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
| 001 review checker gaps | Done | Six criteria rerun by the orchestrator; harness 48 PASS; six behavior probes match the new rules |
| 002 leaf generator ignores | Done | Six criteria rerun; freshness 14/14 with a `__pycache__` probe present |
| 003 codex mirror gate | Done | Six criteria rerun; Codex path now checks one agent |
| 004 hook stdin deadline | Done | Five criteria rerun; live adapter exits at 3032 ms with stdin held open |
| 005 router sync guard | Done | Six criteria rerun; umbrella prints all 3 guards PASSED; leg 1b opt-in, reports nine orphan docs on request |

### Deviations and findings

| Item | Note |
|------|------|
| D3 triggered by 005 | Check 1b fails on nine unrouted docs (three shared workflow docs, six sk-code-obsidian references); the operator chose to wire 1a, 2, 3 and 4 now and fix 1b later |
| Builders may edit goal.md's LOG section | The first build brief barred goal.md entirely while tasks wrote evidence there; corrected for every builder |
| Live pre-commit hook runs from the main checkout | The Codex filter change takes effect on commits only after this branch reaches main |
<!-- /ANCHOR:log -->
