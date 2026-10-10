---
title: "Goal: Round-two follow-ups for sk-code"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups"
    last_updated_at: "2026-10-10T11:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-009-round-two-follow-ups"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Round-two follow-ups for sk-code

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close the five round-two follow-ups, so router check 1b runs by default, the ceiling report is listed and versioned, deep-review findings carry a reproducing case, AGENTS.md points to repo rules instead of restating them, and every hook stdin reader under `.skilled/hooks/` has a deadline.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Claude agents on Sonnet 5.5 at xhigh effort plan and build each child; they never commit |
| D2 | The orchestrator reruns every criterion in a child's `goal.md` before calling it done, then makes one commit per child in folder order; never push |
| D3 | AGENTS.md drops a clause only when a repo rule that loads in every situation the clause binds already carries it; the rule-copy canary anchors and the 16,384-byte prefix stay intact |
| D4 | Builders do not run the Hermes generator in write mode; the orchestrator runs it once after the builds |
| D5 | Three failed repairs on one child stop that child; report the command and its output |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-router-orphan-docs | `001-router-orphan-docs/goal.md` |
| 002-quality-report-listing | `002-quality-report-listing/goal.md` |
| 003-deep-review-case-rule | `003-deep-review-case-rule/goal.md` |
| 004-agents-md-pointers | `004-agents-md-pointers/goal.md` |
| 005-hook-stdin-deadlines | `005-hook-stdin-deadlines/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] In the worktree, `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups --recursive --strict` prints `RESULT: PASSED` 6 times and `RESULT: FAILED` 0 times
- [ ] In the worktree, `grep -l 'completion_pct: 100' specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/00[1-5]-*/implementation-summary.md | wc -l` prints 5
- [ ] In the worktree, `git log --format='%(trailers:key=Spec,valueonly)' main..HEAD | grep -c '/009-round-two-follow-ups/'` prints 5, one per child, and `git status --short` prints nothing
- [ ] In the worktree, `node .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs` exits 0 with check 1b among its legs, `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` exits 0, and `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` exits 0
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
| 001 router orphan docs | Pending | Not started |
| 002 quality report listing | Pending | Not started |
| 003 deep-review case rule | Pending | Not started |
| 004 AGENTS.md pointers | Pending | Not started |
| 005 hook stdin deadlines | Pending | Not started |

### Deviations and findings

| Item | Note |
|------|------|
| Builder model | The operator switched the builders from haiku to Sonnet 5.5 for this phase |
| Out of scope by design | The stdin readers under system-spec-kit/runtime/hooks (TypeScript, built to dist, another owner) and the global ~/.claude/CLAUDE.md |
| Design premise corrected in 001 | The design assumed each surface routes its symlinked copy of the shared workflow docs; no router names them, so the realpath fix would have found nothing and the three docs are allowlisted with the loading mechanism named |
| 005 criterion 3 baseline | The 73-file copy of the old hooks left the folder before the commit; criterion 3 rebuilds the baseline from commit 00b905bda0 with the same result |
| Follow-ups found, not built | (1) Routing the three shared workflow docs through each surface's RESOURCE_MAP, which changes what three surfaces load: an operator decision. (2) The stdin readers under system-spec-kit/runtime/hooks, some reached through symlinks from .skilled/hooks. (3) The quality README runs two Python checkers through bash. (4) The deep-review reducer reads `- **F###**:` bullets while the agent writes numbered findings. (5) The cli-pi env allowlist drops PI_BLACKHOLE_PASSIVE, which the cli-pi skill says to set. (6) The Obsidian playbook root fails validate_document.py with two existing issues |
<!-- /ANCHOR:log -->
