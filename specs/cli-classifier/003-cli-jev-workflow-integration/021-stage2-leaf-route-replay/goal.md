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
    last_updated_at: "2026-09-29T18:05:00Z"
    last_updated_by: "closure-leaf"
    recent_action: "Closed the phase at its replay verdict stop: 6 of 6 goal criteria ticked, build fcacc26bf3"
    next_safe_action: "Operator records prose rows and a transcript directory, then asks for a model run"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-route-replay.test.cjs"
      - "specs/cli-jev/003-cli-jev-workflow-integration/021-stage2-leaf-route-replay/scratch/w4-session/session-evidence.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/021-stage2-leaf-route-replay/scratch/w4-build/design.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-021-stage2-leaf-route-replay"
      parent_session_id: null
    completion_pct: 100
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

- [x] `node .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs --report <dir>` exits 0, prints per-hub gold, tied and exact-match counts with mean F1, and `router reads: not measured`. Stub `jev` and `cli-deem` binaries first on `PATH` log zero calls
- [x] That run prints `replay verdict: stop (prose arm covers 0 of <N> rows)`, and `cli-classifier` is reported as `stage1-only`
- [x] `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-route-replay.test.cjs` exits 0 with at least 18 passing tests, among them a `verdict deem: keep`, a `stop (margin)` and a `no headroom` on synthetic routers
- [x] `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `leaf-route-replay.cjs` exits 1, and `git status --porcelain` is identical before and after the runs in criterion 1
- [x] `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on sk-create-skill's `SKILL.md`, `README.md` and new changelog file and on `feature-catalog/packet-authored-registry-routing/leaf-route-replay.md`
- [x] `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Build | Done | 2026-09-29: 16 build briefs and 3 review-fix briefs from `scratch/w4-build/briefs/`, code c1 to c7 on Devin DeepSeek and docs d08 to d15b on Pi MiMo, all exit 0 with `STATUS: DONE`. Committed as `fcacc26bf3`, 14 files, not pushed. Source: `SE` sections 1 and 4 |
| Zero-call replay (T014) | Done | Stubs first on `PATH`, exit 0, stub log never created, `<dir>` holds only `report.json`: sk-doc `gold=25 unscored=1 unknown=3 tied=2 f1=0.8259 exact=19`; mcp-tooling 15, system-deep-loop 6, cli-external-orchestration 5 and sk-design 4 all at `f1=1.000` with every gold row exact; `hub=sk-code gold=1 unscored=1 surface slice not replayed`; `hub=cli-classifier stage1-only`; `total gold=56 scored=55 tied=2 mean_f1=0.9209 exact=49`; `router reads: not measured`; `replay verdict: stop (prose arm covers 0 of 55 rows) N=55 P=0 keyword_f1=n/a prose_f1=n/a`. The report went to the session scratchpad. Source: `SE` section 2, `scratch/w4-build/replay-run.txt` |
| Tests (T013) | Done | `node --test` on `T`: `tests 37, pass 37, fail 0`, exit 0, with `no headroom`, a printed `verdict deem: keep` and `verdict deem: stop (margin)`. The whole `scripts/tests/` folder ends `tests 80, pass 79, fail 1`, the baseline's `skill-root-metadata-contract.test.cjs` failure. Source: `SE` section 2 |
| Docs (T011, T012) | Done | Nine changed docs, each `validate_document.py` `Total issues: 0`; the Hermes copy regenerated in `fcacc26bf3`; the sk-doc leaf manifest pair fresh, `checked=15 fresh=15 failed=0`. The trigger index `--check` reports stale on this phase's new catalog entry and changelog, and its regeneration is left to the orchestrator. Source: `SE` sections 2 and 4, read-only check 2026-09-29 |
| Review and commit (T017) | Done | Cross-family: Pi MiMo on the code DeepSeek wrote and DeepSeek on the docs MiMo wrote, both `VERDICT: FAIL` with 1 P1 each; f1 and f2 closed the code P1s, f3 closed three doc sentences, and both rechecks returned `VERDICT: PASS`. `fcacc26bf3`, `compiled-route-guard.cjs` exit 0 after. Source: `SE` sections 3 and 4 |
| Prose file, transcripts and model runs | Operator, outside this phase | The recount needs a transcript directory, the replay verdict a prose file covering 90 percent of the 55 scored rows, then one `--deem --out <dir>` run and, on the operator's flag, one `--jev --out <dir>` run. Not part of this phase's completion. Source: `SE` section 5 |

### Deviations and findings

| Item | Note |
|------|------|
| The parser is gone | `router-replay.cjs` was deleted in `b45ea54cea3` on 2026-09-11, yet seven `ROUTER.md` files still say "the deterministic router-replay parses" their block (for example `sk-doc/ROUTER.md:149`). Raised as an open question for the hub owners |
| Gold recount 2026-09-29 | 56 playbook files hold a non-empty `expected_leaf_resources`: sk-doc 25, mcp-tooling 15, system-deep-loop 6, cli-external-orchestration 5, sk-design 4 and sk-code 1. Round 3 cited 34 for sk-doc (lineage-reported) |
| Seam lines rechecked 2026-09-29 | `compiled-route.cjs:87-92` (`normalizeTargets`) resolves unchanged. The record cites no other `file:line` |
| Keep rule scope | The research judged the classifier over all 34 sk-doc rows. Untied rows score the same in both arms, so the rule counts tied rows only |
| Scored rows N=55 | The design's proof table expected the replay stop at `N=56`; the scorer counts 55 because sk-code's one gold row is unscored. The criterion carries `<N>`, so both readings pass. Source: `SE` section 2 |
| Gate order with both switches | Rulings item 5: each switch runs its own gate, Jev first, and a failed Jev gate still runs the Deem gate and the Deem arm. Parent D1 outranks the phase spec's "a failed gate never starts the other backend". Source: `scratch/w4-build/rulings.md` item 5 |
| Review fixes beyond the P1s | f3 made three doc sentences true to the code, two of them review P2s and one the session's `phantom_root_row` finding, because the goal asks for docs true to the code. Source: `SE` section 3 |
| P2 findings recorded, not chased (parent D5) | Six: the `kill` and `stop (coverage)` verdicts are untested as printed lines; a `jev auth test` exit 2 stops with `auth test failed` where the exit map says `usage error`; the README names the switches but not the gate commands or skip lines; a `jev auth test` past 90 s records `unmeasured` where REQ-007 says `unmeasured_timeout`; no test drives the Jev arm to a verdict line; `readProse`'s JSDoc and one test name still say "counted" for unparsed lines. Source: `SE` section 3 |
| Porcelain diff during the run | `git status --porcelain` before and after the zero-call run differs only by `?? .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/`, created by phase 031's concurrent code step. This phase wrote nothing. Source: `SE` section 2 |
<!-- /ANCHOR:log -->
