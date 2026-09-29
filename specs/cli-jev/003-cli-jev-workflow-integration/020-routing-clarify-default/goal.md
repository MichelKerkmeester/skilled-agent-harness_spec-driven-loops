---
title: "Goal: Phase 20: routing-clarify-default"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "routing clarify default goal"
  - "score-clarify-default completion criteria"
  - "clarify label gate"
  - "clarify census verdict"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default"
    last_updated_at: "2026-09-29T13:30:00Z"
    last_updated_by: "spec-leaf"
    recent_action: "Authored the Planned phase from research R12"
    next_safe_action: "Build per plan.md in number order, released 2026-09-29 (parent D3)"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-020-routing-clarify-default"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 20: routing-clarify-default

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Count compiled-routing clarify outcomes over committed prompts with zero model calls and build the clarify gold that research R12 lacks, up to a 30-row label gate, with a tested scorer that past the gate judges a Jev or Deem default pick against the router's first alternative.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changed paths: new `score-clarify-default.cjs` and `tests/score-clarify-default.test.cjs` in `.skilled/skills/sk-doc/sk-create-skill/scripts/`, two README rows and, per parent D6, sk-create-skill's `SKILL.md`, README, changelog and playbook and the sk-doc hub catalog. No router, canary fixture, playbook scenario or front-door file changes |
| D2 | The census replays the canary cases, the hub playbook scenarios and the advisor corpus through each hub's compiled engine, read only, and counts clarify rows with mode alternatives apart from checklist ones. A transcript directory the operator names yields counts only, never text |
| D3 | Gold is a committed `expected_workflow_mode` among a row's alternatives, or an operator label. No model writes a label. Below 30 labeled rows the scorer prints `stop: fewer than 30 labeled rows` and this phase closes there |
| D4 | Spec section 4's Keep Rule decides each column past the gate, in order: coverage `10*M >= 9*K`, `kill` when P(X >= L) <= 0.05, a gain of at least 10 points over the first alternative, sign test p < 0.05 and flips `10*F <= 3*M`. It prints `verdict <backend>: keep`, `kill` or `stop (<reason>)`. A keep serves nothing |
| D5 | Jev first, else Deem (parent D1). Each arm runs only behind its own switch and gate: `jev 0.6.2` with `jev auth status --provider P` exiting 0, or a passing `cli-deem health`. A failed gate prints one skip line and exits 0. No key in any file |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --report <dir> --rows-out <file>` exits 0, prints clarify counts per hub and per source and `real clarify rate: not measured`, and stub `jev` and `cli-deem` binaries first on `PATH` log zero calls
- [ ] The file `--rows-out` wrote in criterion 1 has an empty `label` on every line, and `score-clarify-default.cjs --score` on it prints `stop: fewer than 30 labeled rows` and exits 0
- [ ] `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs` exits 0 with at least 16 passing tests, among them a `verdict deem: keep` and a `stop (margin)` on 30 synthetic labels
- [ ] `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `score-clarify-default.cjs` exits 1, and `git status --porcelain` is identical before and after the runs in criteria 1 and 2
- [ ] `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on sk-create-skill's `SKILL.md`, `README.md` and new changelog file and on `feature-catalog/compiled-routing-and-legacy-fallback/clarify-default-measurement.md`
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
| Spec authored | Done | 2026-09-29: spec, plan, tasks and this goal written as Planned from research R12, docs only. Nothing is built |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel |
| Labels | Operator, past the gate | At least 30 labeled rows. Not part of this phase's completion |

### Deviations and findings

| Item | Note |
|------|------|
| Canary recount 2026-09-29 | 86 cases across 7 hubs: 63 route, 11 defer, 9 reject and 3 clarify, where round 1 counted 84 cases with 10 defer. The 3 clarify rows carry `expectedIntents` `defer` or `unknown`, so none is gold for a default |
| Seam lines rechecked 2026-09-29 | `004-cli-external-orchestration/lib/router.cjs:199-218` resolves unchanged. `resolve.cjs:54-64` is now `:55-65` and the front door `compiled-route.cjs:25-47` is now `.skilled/bin/compiled-route.cjs:25-51` |
| Deep-loop clarify | `system-deep-loop`'s clarify alternatives are two `fallbackChecklist` sentences, read from its snapshot on 2026-09-29, so its rows cannot take a mode default and are counted apart |
<!-- /ANCHOR:log -->
