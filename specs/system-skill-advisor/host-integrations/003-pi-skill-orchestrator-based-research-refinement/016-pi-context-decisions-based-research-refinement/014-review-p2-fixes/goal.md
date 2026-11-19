---
title: "Goal: Review P2 Fixes"
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
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/014-review-p2-fixes"
    last_updated_at: "2026-11-19T10:45:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built and verified all criteria in worktree 475"
    next_safe_action: "Merge worktree 475 to main, no push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0f4e8d57-c5f3-4b3c-8df3-8c6a224f2889"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
# Goal: Review P2 Fixes

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The nine P2 findings of the five-pass review of the merged advisor code are closed, eight by a fix whose test failed first and R1-P2-004 as accepted behavior, with the strip output unchanged in both languages. Every follow-up the operator reopened this phase for is fixed: the DSH and Vibe receipt gaps, the Python flag, the threshold variables and every open 015 and 016 finding.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Fix order: R2-P2-001, R1-P2-001, R3-P2-001 with R4-P2-001, R1-P2-003, R5-P2-001, R1-P2-002, R4-P2-002 |
| D2 | R1-P2-004 changes no code. The fixture row `two-markers-in-user-task` keeps its `expected` value |
| D3 | The new marker lets whitespace after a boundary character skip newlines, so a whitespace run is scanned once. Every match ends where it did before, in TypeScript and Python alike |
| D4 | `skippedAdvisorResultFor` strips the prompt before its fire decision, and `shouldFireAdvisor` does not change. `SETUP_WORDING` keeps reading the user's text |
| D5 | `confidenceFloored` is carried through the subprocess parser, not dropped from the type |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] From `.skilled/skills/system-skill-advisor/runtime`, `npx vitest run tests/hooks tests/parity tests/handlers tests/legacy/advisor-prompt-policy.vitest.ts tests/subprocess-output-cap.vitest.ts tests/prompt-policy-gold-replay.vitest.ts tests/legacy/advisor-subprocess.vitest.ts tests/scorer/advisor-quality-049-003.vitest.ts` exits 0 with more than 488 tests passed, and `rg -n ': \{ effectiveEmitted: emitted \};' .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` prints nothing
- [ ] `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC=1 python3 .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` exits 0 from the repository root and prints `fail=0` with more than 117 passes, one of them a floored native row keeping `confidenceFloored`
- [ ] `stripLeadingPastedReply` on `Claude replied: ok.` plus 32,768 repeats of a space and a newline plus `x` returns in under 50 ms in the built TypeScript module and under 500 ms in Python, and the built `skippedAdvisorResultFor` returns `skipped` for `Claude replied: I used sk-doc to update the README. Now: thanks` and `null` for `Update the README with sk-doc conventions`
- [ ] `node --test .skilled/skills/system-skill-advisor/hooks/tests/dsh-prompt-advisor.test.mjs` exits 0, and the Vibe extension and launcher threshold tests exit 0 under vitest
- [ ] The routing-accuracy corpus gate from `.github/workflows/routing-registry-drift.yml` exits 0, and `rg -n '^version: 1.1.1.0' .skilled/skills/system-skill-advisor/SKILL.md` prints one line
- [ ] Every finding id in `015-skilled-alignment-check/evidence/findings.json` and `016-doc-alignment-check/evidence/findings.json` appears in this phase's `implementation-summary.md`
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Phase planned | Done | `spec.md`, `plan.md` and `tasks.md` written 2026-11-19. Baseline on main at `717347fbcba`: vitest 488 passed and 1 skipped, exit 0; Python `Summary: pass=117, fail=0`, exit 0 |
| Marker design checked | Done | Scratch harness: 0 match-end diffs against the current regex on 24 fixture rows and 300,000 fuzzed strings per language. 64K run: TypeScript 1,620 ms to 0 ms, Python 20,460 ms to 2 ms. The harness flagged a deliberately wrong candidate |
| Built and verified | Done | Worktree 475, seven commits. `VT` 500 passed, 1 skipped, exit 0. `PY` pass=120, fail=0, exit 0. Built TypeScript strip 1 ms, Python 2 ms. Built `skippedAdvisorResultFor`: `skipped` for the paste, `null` for the plain task. @review APPROVED, Luna refutation 5 of 6 hold, the sixth refuted only for the out-of-scope DSH caller |

### Deviations and findings

| Item | Note |
|------|------|
| Reopened 2026-11-19 | Operator: "Fix all follow ups". The objective gained the follow-ups and six new criteria; the original five still hold |
| Criterion 5 amended 2026-11-19 | The check `rg -n 'effectiveEmitted: emitted'` also matched `return { effectiveEmitted: emitted };` in `applyDirectiveLifecycle`, the dedup's own live fallback, so it could never print nothing. It now names the removed ternary arm only |
| Python test runner | The Python file is a custom harness that counts failures and does not raise, so its `Summary` line and exit status are the gate. pytest is not used |
| Parent D2 binds the build | The parent's D2 and D3 name the GPT-6 Luna swarm via cli-codex with the Vibe fallback, and D4 has the conductor run every check |
<!-- /ANCHOR:log -->
