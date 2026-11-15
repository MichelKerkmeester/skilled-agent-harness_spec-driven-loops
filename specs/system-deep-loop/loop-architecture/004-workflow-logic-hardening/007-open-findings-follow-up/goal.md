---
title: "Goal: Phase 7: open-findings-follow-up"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "open findings follow up goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/007-open-findings-follow-up"
    last_updated_at: "2026-11-15T05:25:51Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 7: open-findings-follow-up

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Close the six findings the phase 006 report left open, each with a command that proves the fix, or name it not fixed with the numbers that blocked it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Phase 006 stays closed. Its documents are not edited. |
| D2 | No corpus floor is lowered and no ratchet baseline is recaptured to absorb a regression. A routing finding that cannot hold the phase 006 gate values ships no change and is reported not fixed. |
| D3 | The top-level spec-kit build is fixed, not the rebuild message, because six surfaces and a test already name that command. |
| D4 | A version string changes only for what was observed on the installed OpenCode 2.3.0. |
| D5 | Nothing is pushed or merged without the operator's go-ahead. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `npx vitest run tests/integration/bootstrap-stdin.vitest.ts` in the deep-loop runtime passes, and it failed before the bootstrap change.
- [x] After a watched-source edit, `npm --prefix .skilled/skills/system-spec-kit run build` alone lets `validate.sh --strict` run without a stale-dist error.
- [x] `rg -n '38 of the 42' .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` prints nothing.
- [x] The cli-opencode verified-version lines name OpenCode 2.3.0, and every `opencode run` flag the skill documents appears in `opencode run --help`.
- [x] Each advisor routing finding is either met with every advisor gate at or above its phase 006 value, or logged here as not fixed with the gate numbers.
- [x] `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase scaffolded | Done | `create.sh --phase --parent` at Level 1, the level `recommend-level.sh` printed for about 250 lines over 18 files. |
| Stdin test, failing first (T003) | Done | Before the fix 4 of 5 cases failed: each bootstrapped script exited 1 with EAGAIN at node:fs:1005 from readFileSync(0). The upsert --events - control passed. |
| Stdin fix (T004) | Done | The four scripts pass stdio inherit for stdin. bootstrap-stdin 5 passed, the convergence, query, status and upsert integration suites 58 passed. A socketpair and a non-blocking pipe on stdin now give INPUT_VALIDATION, exit 3. |
| Top-level build (T005) | Done | Repro: a whitespace edit to runtime/lib/validation/generated-metadata-integrity.ts, then npm --prefix .skilled/skills/system-spec-kit run build, then validate.sh printed compiled validation orchestrator is stale. After the build script runs prepare-build, tsc --build and finalize-dist.mjs, the same repro and a runtime/package.json edit each validate with RESULT: PASSED. |
| test-dist-freshness.sh side effect | Fixed | A second cause of the same stale message: the script deleted the real dist/lib/validation build records and its exit trap deleted them again. It now backs them up and restores them. Freshness check rc=0 before and after the script, and validation-exit-honesty runs 6 of 6 with none skipped (it skipped 2 while the dist read stale). |
| Coverage sentence (T006) | Done | The tree ships 45 commands and the six families' router_path entries match 42. The three left out are /prompt:improve, /local-skilled-alignment and /speckit:handoff. /goal-opencode no longer exists and /doctor:setup is now in the doctor list. The sentence names those three and states no count, so it cannot drift with the next command. |
| Finding 4 fixed: cli-opencode docs verified on OpenCode 2.3.0 (verified lines, auth list/login, debug agents), version 1.5.11.0 with changelog; install pin left at 2.1.4 for the operator; script te... | Done |  |
| Findings 1 and 2 fixed: two PHRASE_BOOSTS entries (deep review penalizes sk-git -0.5, ai council boosts the council command and penalizes sk-code -0.6); golden 39/39 with the two pinned prompts fai... | Done |  |
| Verification done: advisor 1710, runtime 2909, freshness 4/4, spec-kit CLI only typo-flags (two load timeouts pass alone); all six findings fixed | Done |  |

### Deviations and findings

| Item | Note |
|------|------|
| Level | A first scaffold at Level 2, chosen to match the sibling phases, was removed and recreated at Level 1, because the authoring card says to use the level the helper prints. |
<!-- /ANCHOR:log -->
