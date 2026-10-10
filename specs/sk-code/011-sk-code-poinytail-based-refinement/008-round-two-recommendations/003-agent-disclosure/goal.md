---
title: "Goal: Phase 3: agent-disclosure"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "agent disclosure goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/003-agent-disclosure"
    last_updated_at: "2026-10-10T07:10:54Z"
    last_updated_by: "planner"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-008-003-agent-disclosure"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: agent-disclosure

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give the code, debug and orchestrate agents a reach list, a not-checked disclosure, a test harness read and hypothesis count for debug, and a Reach field in the orchestrator Task Format, in every canonical, Claude, Codex, Pi and Hermes copy, with every mirror check still green.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The added text is identical in each canonical file and its Claude fork. The Claude forks are edited by hand. The Codex, Pi and Hermes copies come only from their sync scripts, never by hand. |
| D2 | The new text names no path, and it contains no em dash and no triple single quote, so it reads the same in each copy and sits safely inside the Codex TOML literal string. |
| D3 | The not-checked disclosure is a native required field of the code RETURN. `agent-io-contract.md` stays unchanged, because that contract fixes only the optional result envelope. |
| D4 | Each sync script runs its `--check` before its regenerate step, and the build stops on any drifted copy outside the three agents, because each script rewrites every drifted copy it finds. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] From the repository root, `rg -c "Every place the change must reach is listed|Not checked:|not_checked|test harness and build config|how many were left out|Reach: \[" .skilled/agents/code.md .skilled/agents/debug.md .skilled/agents/orchestrate.md .claude/agents/code.md .claude/agents/debug.md .claude/agents/orchestrate.md` prints `.skilled/agents/code.md:3`, `.skilled/agents/debug.md:5`, `.skilled/agents/orchestrate.md:1`, `.claude/agents/code.md:3`, `.claude/agents/debug.md:5` and `.claude/agents/orchestrate.md:1`, and exits 0.
- [ ] From the repository root, `node .skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs --all && node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check && node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs && node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js; echo "exit=$?"` prints `all mirrors in sync`, `PASS: 187 mirrors across 8 trees are in sync.`, `STATUS=OK agent-roster-mirror` and `OK: all rule invariants present`, and `exit=0`.
- [ ] From the repository root, `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs --check && node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs --check && node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check; echo "exit=$?"` prints `[codex-agent-sync] PASS: 12 agents are in sync.`, `[pi-agent-sync] PASS: 12 agents are in sync.`, `PASS: 70 Hermes skill copies in sync` and `exit=0`.
- [ ] From the repository root, `git status --porcelain -- .hermes` prints exactly the three lines ` M .hermes/skills/agent-code/SKILL.md`, ` M .hermes/skills/agent-debug/SKILL.md` and ` M .hermes/skills/agent-orchestrate/SKILL.md`, and `git status --porcelain -- AGENTS.md "REPO RULES.md" .skilled/repo-rules .skilled/skills/sk-code .skilled/skills/sk-doc/sk-create-agent .skilled/skills/system-spec-kit/references/workflows/agent-io-contract.md .skilled/skills/system-spec-kit/runtime/cli .skilled/skills/system-deep-loop/deep-improvement .skilled/agents/review.md .skilled/agents/README.txt .claude/agents/review.md .claude/agents/README.txt .codex/agents/review.toml .pi/agents/review.md .hermes/skills/agent-review | diff specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/003-agent-disclosure/scratch/protected-before.txt -; echo "exit=$?"` prints no diff output and `exit=0`.
- [ ] From the repository root, `for f in .skilled/agents/code.md .skilled/agents/debug.md .skilled/agents/orchestrate.md .claude/agents/code.md .claude/agents/debug.md .claude/agents/orchestrate.md; do python3 -I .skilled/skills/sk-doc/shared/scripts/validate_document.py "$f" --type agent | grep "Total issues"; done` prints `Total issues: 1` six times and nothing else.
- [ ] From the repository root, `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/003-agent-disclosure --strict` prints `RESULT: PASSED`.
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
| C1 presence counts across the six agent files | Done | `rg -c` prints code 3, debug 5 and orchestrate 1 in both copies, exit 0 |
| C2 mirror, runtime, roster and rule gates | Done | PASS on orchestrator rerun: agent mirrors 12 in sync, runtime mirrors 187 in sync, STATUS=OK agent-roster-mirror, rule invariants OK; exit 0 |
| C3 Codex, Pi and Hermes `--check` | Done | PASS on orchestrator rerun after one run of each generator: Codex and Pi 12 agents in sync, Hermes 70 copies in sync; exit 0 |
| C4 Hermes scope and protected-path diff | Done | PASS on orchestrator rerun after the review-contract commit: `.hermes` shows exactly agent-code, agent-debug and agent-orchestrate; protected-path diff empty, exit 0 |
| C5 authoring validator, `Total issues: 1` six times | Done | Six `Total issues: 1` lines, exit 0. Kebab checker exit 0 on all six |
| C6 `validate.sh --strict` prints `RESULT: PASSED` | Done | `validate.sh --strict` prints `RESULT: PASSED` with `Errors: 0  Warnings: 0`, exit 0 |

### Deviations and findings

| Item | Note |
|------|------|
| Brief says `check-rule-copies.js` pins text in some agent files | It pins sk-code review files, the Iron Law files, `AGENTS.md` and the code-quality standards, and no agent file (`.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:38-122`). It still has to exit 0 |
| Brief says `agent-io-contract.md` may fix the RETURN fields | It fixes only the optional `AGENT_IO_RESULT` envelope (section 3), and no script reads the code RETURN fields. The not-checked line became a native field, and the contract file is unchanged |
| Brief says the repo close-out rule asks for the same disclosure | `evidence-and-proof.md` section 10 asks to name skipped steps and scope, and why. It does not ask for a `Not checked:` line. The match is partial |
| Brief says Phase 2 reads the harness "before reproducing" | Phase 1 uses only Read, Glob and Grep. Reproduction first appears in Phase 3 and Phase 4 (`debug.md` lines 248 to 250 and line 286), so the Phase 2 read comes first |
| Brief's line numbers in THE FIX | Each anchor sits within a few lines of the number given. Trust the anchor text in `tasks.md`, not the number |
| Brief says the Hermes regeneration writes only the agent copies | The sync script rewrites every drifted copy and prunes stale ones (`sync` function in `sync-skills-hermes.cjs`, lines 231 to 268). Phase 2 of `tasks.md` checks before it writes |
| Objective and criteria | `authoring-standards.md` section 4 and `parent-and-nested-goals.md` line 34 ask that the criteria repeat in the objective. The brief asks for a one-sentence objective, so the objective omits them. The orchestrator decides |
| Cursor and Devin copies | Confirmed as symlinks into `.claude/agents`, so they need no edit |
| Blank line before the not-checked line in Blocked and Escalation | T019 names a blank line before the not-checked line only for the Resolution shape. The Blocked and Escalation shapes take the same blank line, so all three shapes read alike |
| Generator write mode | Not run in this build. The parallel build order assigns regeneration to the orchestrator, so C2 to C4 wait for it |
| Sibling writes in the shared worktree | Child 002 changed `review.md`, its Claude fork, and the sk-code review files after this build's baseline. Each Hermes run rewrites every drifted copy, so the orchestrator's single run must cover review and sk-code-review as well |
<!-- /ANCHOR:log -->
