---
title: "Goal: Phase 4: agents-md-pointers"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/004-agents-md-pointers"
    last_updated_at: "2026-10-10T08:44:23Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-009-004-agents-md-pointers"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 4: agents-md-pointers

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Replace the stale four-item close-out list in AGENTS.md with a one-line pointer to `communication-handoff.md`, the Gate 6 rule that now owns the five-part status, and keep every other clause that no always-loading rule can carry.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The five-part close-out status is owned by `communication-handoff.md` section 1, the one rule file Gate 6 loads before every turn ends. AGENTS.md section 10 and `evidence-and-proof.md` section 10 hold a one-line pointer to it and no list. |
| D2 | AGENTS.md changes only at line 296. Every other clause is kept with its reason in the `plan.md` audit, and no byte before line 296 changes, so the 21 delivery-prefix anchors keep their end bytes. |
| D3 | The global `~/.claude/CLAUDE.md` is a symlink to the main checkout's AGENTS.md. It is never edited or copied over, and the summary records the operator's action as landing this branch in the main checkout. |
| D4 | The two rule files change in content and in the fourth version segment only. No rule file, trigger row, trigger phrase or Fires-when bullet is added, so `REPO RULES.md` and the trigger index stay untouched. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] From the repository root, `diff specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/004-agents-md-pointers/scratch/before/AGENTS.md AGENTS.md; echo "diff-exit=$?"; wc -c AGENTS.md` prints only the hunk `296c296` with the old and the new line 296, then `diff-exit=1` and `27252 AGENTS.md`, which is no larger than the 27266 before. The new line names `.skilled/repo-rules/communication-handoff.md` and `§1` and holds no close-out list.
- [ ] `rg -n -e '^[1-5]\. \*\*(What ran or was read|What is inferred|What only the operator can verify|The state of the work|Known residual risk)' .skilled/repo-rules/communication-handoff.md` prints lines 67, 69, 70, 71 and 72, `rg -n -e 'Five things, briefly' -e 'Known residual risk\.' .skilled/repo-rules/evidence-and-proof.md` prints nothing and exits 1, and `rg -n '^version: ' .skilled/repo-rules/communication-handoff.md .skilled/repo-rules/evidence-and-proof.md` prints `version: 1.6.0.5` and `version: 1.1.1.4`.
- [ ] `git status --porcelain -- AGENTS.md "REPO RULES.md" .skilled/repo-rules` prints exactly ` M .skilled/repo-rules/communication-handoff.md`, ` M .skilled/repo-rules/evidence-and-proof.md` and ` M AGENTS.md`, and `readlink ~/.claude/CLAUDE.md` still prints `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/AGENTS.md`.
- [ ] `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` exits 0, prints the `OK:` line with `21 delivery-prefix anchor(s)` and a prefix report identical to `scratch/rule-copies-before.txt` in this folder (every end byte at or under 16384), and `bash .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh` exits 0 and ends with `All rule-canary test cases passed`.
- [ ] `node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` exits 0 and ends with `[repo-rules-check] RESULT: PASSED (11/11 checks)`, the prose scan of the added lines in `tasks.md` T027 prints nothing for all three files, `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs --check` exits 0 with `PASS: 1 instruction files carry the root Gate 1 lookup.`, the three vitest files in `tasks.md` T028 print `Tests  12 passed (12)`, and the two pytest files print `13 passed`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/004-agents-md-pointers --strict` prints `RESULT: PASSED`.
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
| AGENTS.md line 296 is a one-line pointer and nothing else changed | Done | `diff` prints only `296c296`, `diff-exit=1`, `27252 AGENTS.md` |
| `communication-handoff.md` owns the five parts, `evidence-and-proof.md` points to it, both versions bumped | Done | Parts at lines 67, 69, 70, 71 and 72, `Five things, briefly` search exits 1, versions `1.6.0.5` and `1.1.1.4` |
| Only the three tracked files changed and the global file is untouched | Done | `git status --porcelain` prints exactly the three ` M` lines, `readlink ~/.claude/CLAUDE.md` unchanged |
| The canary and its self-test pass with an unchanged prefix report | Done | `21 delivery-prefix anchor(s)`, `diff-exit=0` against the saved report, `All rule-canary test cases passed` |
| The repo-rule checker, the prose scan and every AGENTS.md consumer test pass | Done | `RESULT: PASSED (11/11 checks)`, prose scan empty, Gate 1 sync PASS, `Tests  12 passed (12)`, `13 passed` |
| The folder validates with `RESULT: PASSED` | Done | `validate.sh --strict` exit 0, `Errors: 0`, `RESULT: PASSED` |
| Orchestrator rerun | Done | All six criteria rerun by the orchestrator on 2026-10-10 from the final tree, each passing |

### Deviations and findings

| Item | Note |
|------|------|
| The brief asks the summary to say the operator must copy the new AGENTS.md into `~/.claude/CLAUDE.md` | That file is a symlink to the main checkout's AGENTS.md (`ls -l` and `.devin/SYNC.md` line 90 both show it), so a copy would write through it. The summary records the symlink and the real action, landing this branch in the main checkout. |
| The audit finds one POINTER row in 44 | Twenty-one KEEP rows name a rule file that carries related text and each fails the binding test, as a gate, anchor, hard blocker, unconditional standard, AGENTS.md-owned clause or read-only-turn clause. `plan.md` section 3 has every row and reason. |
<!-- /ANCHOR:log -->
