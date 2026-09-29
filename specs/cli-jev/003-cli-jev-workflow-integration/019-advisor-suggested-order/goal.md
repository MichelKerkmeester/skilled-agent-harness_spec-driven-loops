---
title: "Goal: Phase 19: advisor-suggested-order"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "advisor suggested order goal"
  - "score-suggested-order completion criteria"
  - "near-tie order keep rule"
  - "advisor child budget verdict"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order"
    last_updated_at: "2026-09-29T13:30:00Z"
    last_updated_by: "spec-leaf"
    recent_action: "Authored the Planned phase from research R3"
    next_safe_action: "Build per plan.md in number order, released 2026-09-29 (parent D3)"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-019-advisor-suggested-order"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 19: advisor-suggested-order

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Settle offline, with one verdict per backend, whether a Jev or Deem choice that reorders the skill advisor's whole near-tie cluster beats the best zero-call order and fits the 2,200 ms advisor budget when every call is timed inside a child spawned like the prompt shim's.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changed paths: new `score-suggested-order.mjs` in system-skill-advisor's `runtime/scripts/routing-accuracy/`, new `runtime/tests/parity/score-suggested-order.vitest.ts`, two folder README rows and, per parent D6, the advisor's `SKILL.md` (description and Keywords unchanged), README, changelog, catalog and playbook, with the playbook test's pin moved to 49. Phase 002's script is imported, never edited. No hook, scorer, ratchet or corpus file changes |
| D2 | The default run makes zero calls. It prints 002's census, three zero-call orders and the advisor-only child p50 and p95. Below 5 movable rows, or with an advisor p95 over 2,200 ms, it prints `no headroom` and no arm calls |
| D3 | A column's order is the cluster sorted by mean probability over three left rotations. Each call runs inside a child spawned with `process.execPath`, a 2,500 ms timeout and `SIGKILL`, which runs the advisor first. A partial probability map is `unmeasured` |
| D4 | Spec section 4's Keep Rule decides each column, in order: coverage `10*M >= 9*K`, `kill` when P(X >= L) <= 0.05, a mean reciprocal-rank gain of at least 0.05 over the best zero-call order, sign test p < 0.05, flips `10*F <= 3*M` and child p95 <= 2,200 ms. It prints `verdict <backend>: keep`, `kill` or `stop (<reason>)` with its identity. A keep serves nothing |
| D5 | Jev first, else Deem (parent D1). Each arm runs only behind its own switch and 002's gate: `jev 0.6.2` with `jev auth status --provider P` exiting 0, or a passing `cli-deem health`. A failed gate prints one skip line and exits 0. A `--jev` run happens only on the operator's flag. No key in any file and no failover |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs` exits 0 and prints `holdout_top1=53/70`, `advisor child: p50=`, `margin: 0.05` and either `no headroom` or `planned calls:`, while stub `jev` and `cli-deem` binaries first on `PATH` log zero calls
- [ ] With `--deem --out <dir>` and a stub `cli-deem health` reporting backend `stub` it prints `deem arm skipped: stub backend`, and with `--jev --out <dir>` and a stub whose `auth status --provider official` exits 3 it prints `jev arm skipped: no credential`. Both exit 0, and `diff` against criterion 1's stdout shows only the `deem arm skipped:` or `jev arm skipped:` line
- [ ] From `.skilled/skills/system-skill-advisor/runtime`, `npx vitest run tests/parity/score-suggested-order.vitest.ts` exits 0 with at least 20 passed tests and 0 failed
- [ ] Either a run with no switch printed `no headroom`, or one `--deem --out <dir>` run printed a `verdict deem:` line and wrote a `calls.jsonl` whose every line holds a child wall time, a model commit and a source commit
- [ ] `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `score-suggested-order.mjs` exits 1, and `git status --porcelain` is identical before and after the runs in criteria 1, 2 and 4
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
| Spec authored | Done | 2026-09-29: spec, plan, tasks and this goal written as Planned from research R3, docs only. Nothing is built |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel |

### Deviations and findings

| Item | Note |
|------|------|
| Prior verdicts | Phase 002 printed `kill` on both backends for the pick-first form: Jev `decided=38 wins=11 losses=27 p_loss=0.0069` on `jev-1.13.0`, Deem `decided=38 wins=8 losses=30 flip=0.3123` on `8cbabbb`/`c8a5523`. This phase tests the whole-cluster order and the in-child budget, which 002 did not |
| Seam lines rechecked 2026-09-29 | Commit `9ccb4dd416` moved the shim's budget clamp from `system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:105-108` to `:106-111` and its spawn from `:109-117` to `:113-120`, with the 2,200 ms ceiling unchanged. `user-prompt-submit.ts:22-24`, `ambiguity.ts:22-36`, `:44-58`, `lane-registry.ts:21-29`, `:33-38`, `fusion.ts:69`, `:111-114` and `shadow-sink.ts:86-100`, `:144-155` resolve unchanged |
| Latency prior | 002's `calls.jsonl` files give `choice` p95 of 340 ms on Deem and 2,830 ms on Jev, timed outside the advisor child. The Jev figure alone exceeds 2,200 ms |
<!-- /ANCHOR:log -->
