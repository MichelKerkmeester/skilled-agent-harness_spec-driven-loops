---
title: "Goal: Round-three remediation for sk-code"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation"
    last_updated_at: "2026-10-10T12:15:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-010-round-three-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Round-three remediation for sk-code

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Fix every new P1 and P2 finding from the third research round, build its seven recommended ideas and close the five round-two follow-ups, so the shared layer, hub, modes and surfaces state what is true and a documentation claim checker keeps them that way.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Claude agents on Opus 5.5 at medium effort plan each child; DeepSeek V4.1 Flash at max effort through cli-pi builds it; Claude agents on Sonnet 5.5 at high effort verify and review it as soon as its build reports done |
| D2 | The orchestrator reruns every criterion in a child's `goal.md` before calling it done, then makes one commit per child in folder order; never push |
| D3 | Each child owns its files exclusively; a fix that needs another child's file is handed to that child, never edited across the line |
| D4 | Builders do not run the Hermes generator in write mode; the orchestrator runs it once after the builds, and the Codex and Pi generators too when more than one child edits agents |
| D5 | Three failed repairs on one child stop that child; report the command and its output |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-shared-and-hub-docs | `001-shared-and-hub-docs/goal.md` |
| 002-review-mode | `002-review-mode/goal.md` |
| 003-quality-mode | `003-quality-mode/goal.md` |
| 004-webflow-and-obsidian | `004-webflow-and-obsidian/goal.md` |
| 005-opencode-and-guards | `005-opencode-and-guards/goal.md` |
| 006-deep-loop-follow-ups | `006-deep-loop-follow-ups/goal.md` |
| 007-spec-kit-hook-deadlines | `007-spec-kit-hook-deadlines/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] In the worktree, `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation --recursive --strict` prints `RESULT: PASSED` 8 times and `RESULT: FAILED` 0 times
- [ ] In the worktree, `grep -l 'completion_pct: 100' specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/00[1-7]-*/implementation-summary.md | wc -l` prints 7
- [ ] In the worktree, `git log --format='%(trailers:key=Spec,valueonly)' main..HEAD | grep -c '/010-round-three-remediation/'` prints 7, one per child, and `git status --short` prints nothing
- [ ] In the worktree, `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` exits 0 with the documentation claim checker among its guards, and `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js`, `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` and `node .skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs --all` each exit 0
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
| 001-shared-and-hub-docs | Done | 19 findings fixed; 105 build units, 20 extra (hub playbook, graph-metadata, guardrail pointers, cache path), 3 fix units; Sonnet verifier PASS, 170 of 170 tasks with orchestrator steps; strict PASSED |
| 002-review-mode | Done | 15 findings (f-iter011-002 item e excluded by D8); 69 units, 5 fix units; verifier PASS; 111 of 111 tasks; strict PASSED |
| 003-quality-mode | Done | 31 units, 13 fix units (doc-claims hits and one voice regression); verifier PASS; 78 of 78 tasks; strict PASSED |
| 004-webflow-and-obsidian | Done | 34 units, 20 fix units (residue and doc-claims hits); verifier PASS; 91 of 91 tasks; strict PASSED |
| 005-opencode-and-guards | Done | 79 units, 6 extra (guardrails move), 6 fix units (checker tier rule); doc-claims 4/4, all 4 drift guards PASSED; 125 of 125 tasks; strict PASSED |
| 006-deep-loop-follow-ups | Done | 18 units, 0 fixes; verifier PASS; 49 of 49 tasks; strict PASSED |
| 007-spec-kit-hook-deadlines | Done | 40 units, 4 fix units; 37 of 37 deadline tests; verifier PASS; 69 of 69 tasks; strict PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| Roles | The operator chose Opus 5.5 medium planners, DeepSeek V4.1 Flash max builders through cli-pi, and several Sonnet 5.5 high verifiers started as each build reports done |
| Scope | All NEW round-three findings and the seven recommended ideas, plus all five round-two follow-ups, three of them outside sk-code (system-deep-loop, cli-pi, system-spec-kit), at the operator's choice |
| Planner checks | Two 005 unit checks were wrong (T016 named an old signature, T019 checked an absence T022 creates). The edits were exact; the orchestrator corrected both checks and added a guard to the chain driver that stops when a file holds the exact planned text but its check fails |
| Cross-child moves | f-iter003-003 became a real move: 005 created workflow-guardrails.md, 001 replaced the three shared subsections with pointers. 001 also took the hub playbook and graph-metadata hits no child owned, and T167 so mode-registry.json follows 002's move of the review cache to the user cache directory |
| Doc-claims pass | After every build the new checker found 33 hits: real defects in 001, 003 and 004 files became fix units, and its tier rule misread a conditional ROUTER.md bullet, fixed in 005 (FX1 to FX6). 003 and 004 spec.md carry scope-amendment rows for the files this added. Result: doc-claims 4/4 |
| Orchestrator steps | sk-code and cli-external-orchestration re-mints with archive copies, leaf manifest, Hermes (9 copies), deep-review contract recompile (it also cleared an older agent-digest drift), sk-doc README fixtures, trigger index |
| Not built | f-iter011-002 item (e), AGENTS.md-level canary pins (002 D8: routine AGENTS.md edits would trip it); the sixteenth stdin reader claude/user-prompt-submit.ts (007 plan section 6); about 59 old underscore link labels in Webflow references and the Webflow playbook root overview section (004 known limitations); the implementation-phrasing order for Obsidian plus Webflow prompts (005 recorded) |
| Scratch hygiene | Base-commit source copies in 006 scratch/probe (12 MB, with node_modules symlinks), 006 scratch/before and 007 scratch/before were moved out of the packet before commit; 007 REQ-007 records how to rebuild them |
<!-- /ANCHOR:log -->
