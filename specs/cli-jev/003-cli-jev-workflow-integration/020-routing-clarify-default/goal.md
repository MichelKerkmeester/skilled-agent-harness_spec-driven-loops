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
    last_updated_at: "2026-09-29T15:39:02Z"
    last_updated_by: "closure-leaf"
    recent_action: "Closed the phase at the label gate: 6 of 6 goal criteria ticked, build commit 65c71719ac"
    next_safe_action: "Orchestrator commits the phase docs. The operator labels at least 30 rows, then a model run"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs"
      - "specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/scratch/w4-build/build-evidence.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/scratch/w4-session/session-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-020-routing-clarify-default"
      parent_session_id: null
    completion_pct: 100
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

- [x] `node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --report <dir> --rows-out <file>` exits 0, prints clarify counts per hub and per source and `real clarify rate: not measured`, and stub `jev` and `cli-deem` binaries first on `PATH` log zero calls
- [x] The file `--rows-out` wrote in criterion 1 has an empty `label` on every line, and `score-clarify-default.cjs --score` on it prints `stop: fewer than 30 labeled rows` and exits 0
- [x] `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs` exits 0 with at least 16 passing tests, among them a `verdict deem: keep` and a `stop (margin)` on 30 synthetic labels
- [x] `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `score-clarify-default.cjs` exits 1, and `git status --porcelain` is identical before and after the runs in criteria 1 and 2
- [x] `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on sk-create-skill's `SKILL.md`, `README.md` and new changelog file and on `feature-catalog/compiled-routing-and-legacy-fallback/clarify-default-measurement.md`
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
| Spec authored | Done | 2026-09-29: spec, plan, tasks and this goal written as Planned from research R12, docs only. Nothing is built |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel |
| Build | Done | 2026-09-29: 21 briefs from `scratch/w4-build/briefs/`, Devin 9 code dispatches (01 to 08, 08b) and Pi 12 doc dispatches (09 to 17c), all exit 0 on the first attempt. Committed as `65c71719ac`, 14 files. Source: build record section 4, session record section 4 |
| Census (T013) | Done | Stubs first on `PATH`, exit 0, `stub/calls.log` never created: `total prompts=359 unparsed=24 route=239 clarify=3 defer=86 reject=7 clarify_mode=2 clarify_checklist=1 gold_in_alternatives=0`, `corpus: rows=265 none=24 skill_firing=241 mapped=146 no_compiled_hub=95`, `real clarify rate: not measured`, `rows written: 2 with_gold=0`. Canary clarify 1 each on system-deep-loop (checklist) and on cli-external-orchestration and sk-doc (mode). Source: build record section 5 P1, session record section 2 |
| Label gate (T014) | Done | `--score` on the real rows file: `rows: 2 labeled=0 operator=0 committed_gold=0` then `stop: fewer than 30 labeled rows (0 labeled)`, exit 0, also under `--deem --jev --out`, with no out folder and no stub call. Source: build record section 5 P2, session record section 2 |
| Tests (T012) | Done | `node --test T`: `tests 28, pass 28, fail 0`, exit 0, with `verdict deem: keep` and `stop (margin)` on 30 synthetic labels. The sk-create-skill dir run ends 47 tests, 46 pass, the same one pre-existing failure as the baseline. Source: build record sections 5 and P7 table, session record section 2 |
| Docs (T010, T011) | Done | Nine changed docs, each `validate_document.py` `Total issues: 0`; the Hermes copy regenerated in `65c71719ac`; the sk-doc leaf manifest `--check` unchanged; the trigger index in its own follow-up commit. Source: build record sections 4 and 6, session record section 4 |
| Review and commit (T017) | Done | Cross-family: Pi MiMo on the code `VERDICT: PASS`, Devin DeepSeek on the docs `VERDICT: PASS`, REQ-001 to REQ-010 met. 8 P2 findings recorded, not chased (parent D5). `65c71719ac`, `compiled-route-guard.cjs` exit 0 after. Source: session record sections 3 and 4 |
| Labels | Operator, past the gate | At least 30 labeled rows. The committed prompts give 2 rows, so the gate needs `--transcripts` or hand-picked prompts. Not part of this phase's completion |
| Live Jev run | Operator, past the gate | After the labels and the operator's yes: `node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --score <labeled rows> --jev --out <dir>`. No run happened in this build. Not part of this phase's completion |
| Phase docs | Done | Closure pass 2026-09-29: `tasks.md`, this log, `implementation-summary.md`, `spec.md` and `plan.md` record the evidence and correct the stale premises. Gate results are in `implementation-summary.md` Verification |

### Deviations and findings

| Item | Note |
|------|------|
| Canary recount 2026-09-29 | 86 cases across 7 hubs: 63 route, 11 defer, 9 reject and 3 clarify, where round 1 counted 84 cases with 10 defer. The 3 clarify rows carry `expectedIntents` `defer` or `unknown`, so none is gold for a default |
| Seam lines rechecked 2026-09-29 | `004-cli-external-orchestration/lib/router.cjs:199-218` resolves unchanged. `resolve.cjs:54-64` is now `:55-65` and the front door `compiled-route.cjs:25-47` is now `.skilled/bin/compiled-route.cjs:25-51` |
| Deep-loop clarify | `system-deep-loop`'s clarify alternatives are two `fallbackChecklist` sentences, read from its snapshot on 2026-09-29, so its rows cannot take a mode default and are counted apart |
| Shared-description ` [key]` suffix | Departs from REQ-006's "verbatim" for the two shared pairs, following 002's precedent (Deem refuses duplicate option descriptions). Source: build record section 8 |
| Rows file location | Run outputs went under `scratch/w4-build/runs/` rather than outside the repository as T014 asked; the brief's write scope wins. Source: build record section 8 |
| sk-doc suite skip | `test_rename_tooling_fixture_harness.py` skipped at baseline and final alike; it fails in a live tree with concurrent writers. Source: build record section 8 |
| Docs placed by `cp` | Long new docs and the playbook index were placed by `cp` from verified drafts and checked with `cmp`, instead of inline old and new text, to keep briefs under 90 lines. Source: build record section 8 |
| Interpretations | p is always the sign-test tail; A, B, W and L count over measured rows only; the `--out` refusal writes one line to stderr. Source: build record section 8 |
| P2 1: row ids repeat across hubs | Arm picks and `calls.jsonl` key on row id, so two same-id rows in one rows file would share answers. Source: session record section 3 |
| P2 2: `result.decision.action` outside the try | An engine result without `decision` ends the census with a stack instead of counting it unparsed. Source: session record section 3 |
| P2 3: `main().then` has no catch | A `describeModes` throw exits 1 with an unhandled-rejection stack. Source: session record section 3 |
| P2 4: Jev `auth test` past 90 s | Records `status: "unmeasured"`, not `unmeasured_timeout`. Source: session record section 3 |
| P2 5: ` [key]` suffix | The REQ-006 deviation above, flagged by both reviewers. Source: session record section 3 |
| P2 6: unreadable corpus file | Skipped with no count or line, against REQ-005's "never dropped silently". Source: session record section 3 |
| P2 7: catalog entry source table | Names only `labeled-prompts.jsonl` while the script also reads `holdout-prompts.jsonl` (70 of 265 corpus rows). Source: session record section 3 |
| P2 8: Deem arm stop paths untested | Exits 2, 3, 130, the exit-4 health recheck and `partial_rows` are untested while the Jev stop is pinned. Source: session record section 3 |
| Playbook gold recount | The spec counted 82 playbook files with `expected_workflow_mode`; the build counted 83. `spec.md` section 2 now says 83. Source: build record section 9 |
<!-- /ANCHOR:log -->
