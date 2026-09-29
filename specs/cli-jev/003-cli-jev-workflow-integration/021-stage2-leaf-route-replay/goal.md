---
title: "Goal: Phase 21: stage2-leaf-route-replay"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "leaf route replay goal"
  - "leaf-route-replay completion criteria"
  - "stage2 replay verdict"
  - "router.md read recount"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/021-stage2-leaf-route-replay"
    last_updated_at: "2026-09-29T14:00:00Z"
    last_updated_by: "spec-leaf"
    recent_action: "Authored the Planned phase from research R25"
    next_safe_action: "Build per plan.md in number order, released 2026-09-29 (parent D3)"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/021-stage2-leaf-route-replay/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/021-stage2-leaf-route-replay/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-021-stage2-leaf-route-replay"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 21: stage2-leaf-route-replay

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Rebuild the stage-2 leaf-route replay that research R25 proposed as a zero-call script, score it on the committed `expected_leaf_resources` gold, recount the `ROUTER.md` reads it would save, and ship a tested tie-break arm that judges a Jev or Deem pick against the replay's own answer on tied rows only.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changed paths: new `leaf-route-replay.cjs` and `tests/leaf-route-replay.test.cjs` in `.skilled/skills/sk-doc/sk-create-skill/scripts/`, two README rows and, per parent D6, sk-create-skill's `SKILL.md`, README, changelog and playbook and the sk-doc hub catalog. No `ROUTER.md`, map, manifest, playbook or engine changes |
| D2 | The keyword arm ports the retired replay's rules from `git show b45ea54cea3^`: word-boundary keywords, weighted scores and every intent within 1 point of the top. Leaves convert to typed pairs through the leaf contract. It makes zero calls |
| D3 | Gold is each playbook scenario's committed `expected_leaf_resources`. No model writes gold or a prose row. The replay verdict stops at `prose arm covers <P> of <N> rows` until the operator's prose file covers 90 percent of the scored rows |
| D4 | Spec section 4's Keep Rule decides each column on tied rows, in order: coverage `10*M >= 9*K`, `kill` when P(X >= L) <= 0.05, a mean F1 gain of 0.10 over the better of the union and the first tied intent, sign test p < 0.05 and flips `10*F <= 3*M`. Fewer than 5 improvable tied rows prints `no headroom` and calls nothing. A keep serves nothing |
| D5 | Jev first, else Deem (parent D1). Each arm runs only behind its own switch and gate: `jev 0.6.2` with `jev auth status --provider P` exiting 0, or a passing `cli-deem health`. A failed gate prints one skip line and exits 0. No key in any file |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs --report <dir>` exits 0, prints per-hub gold, tied and exact-match counts with mean F1, and `router reads: not measured`. Stub `jev` and `cli-deem` binaries first on `PATH` log zero calls
- [ ] That run prints `replay verdict: stop (prose arm covers 0 of <N> rows)`, and `cli-classifier` is reported as `stage1-only`
- [ ] `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-route-replay.test.cjs` exits 0 with at least 18 passing tests, among them a `verdict deem: keep`, a `stop (margin)` and a `no headroom` on synthetic routers
- [ ] `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `leaf-route-replay.cjs` exits 1, and `git status --porcelain` is identical before and after the runs in criterion 1
- [ ] `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on sk-create-skill's `SKILL.md`, `README.md` and new changelog file and on `feature-catalog/packet-authored-registry-routing/leaf-route-replay.md`
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
| Spec authored | Done | 2026-09-29: spec, plan, tasks and this goal written as Planned from research R25, docs only. Nothing is built |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel |
| Prose rows and model runs | Operator, outside this phase | Not part of this phase's completion |

### Deviations and findings

| Item | Note |
|------|------|
| The parser is gone | `router-replay.cjs` was deleted in `b45ea54cea3` on 2026-09-11, yet seven `ROUTER.md` files still say "the deterministic router-replay parses" their block (for example `sk-doc/ROUTER.md:149`). Raised as an open question for the hub owners |
| Gold recount 2026-09-29 | 56 playbook files hold a non-empty `expected_leaf_resources`: sk-doc 25, mcp-tooling 15, system-deep-loop 6, cli-external-orchestration 5, sk-design 4 and sk-code 1. Round 3 cited 34 for sk-doc (lineage-reported) |
| Seam lines rechecked 2026-09-29 | `compiled-route.cjs:87-92` (`normalizeTargets`) resolves unchanged. The record cites no other `file:line` |
| Keep rule scope | The research judged the classifier over all 34 sk-doc rows. Untied rows score the same in both arms, so the rule counts tied rows only |
<!-- /ANCHOR:log -->
