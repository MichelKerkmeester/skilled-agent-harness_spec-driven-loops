---
title: "Tasks: Phase 21: stage2-leaf-route-replay"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "leaf route replay tasks"
  - "tie-break arm tasks"
  - "stage2 replay tasks"
  - "router.md replay verification"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 21: stage2-leaf-route-replay

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

`S` is `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` and `T` is `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-route-replay.test.cjs`, both proposed. Parent D3, amended by the operator's "Bind and release", released this phase on 2026-09-29. Builds run in number order, and disjoint builds may run in parallel. Tasks marked "outside this phase" do not gate its completion.

Closure (2026-09-29). Built and committed as `fcacc26bf3`. `SE` is `scratch/w4-session/session-evidence.md`, this phase's build and session record. There is no `build-evidence.md`: the session ran the build itself from `scratch/w4-build/briefs/` under parent D5, and where a number here and `SE` disagree, `SE` wins.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record sk-create-skill's `node --test` pass and fail counts as the baseline, and confirm phase 020's build is not running (`.skilled/skills/sk-doc/sk-create-skill/scripts/tests/`). Evidence: the baseline is `pass 46`, `fail 1` in `skill-root-metadata-contract.test.cjs` (`scratch/w4-build/baseline/node-test.txt`). Phase 020 finished under the earlier roster, so its build was not running (parent `goal.md`, row "Directive amendment: no Claude leaves", `SE` section 1)
- [x] T002 Read the owners' contracts before writing: `leaf-resource-contract.cjs:166` and `:279`, `root-router-contract.cjs:139`, `validate-compiled-routing-scenarios.cjs:170-196` and `:304`, and each active hub's `ROUTER.md` machine block. Recover the retired replay with `git show b45ea54cea3^:.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs` to a scratch file outside the repository. Route the code write through sk-code's OpenCode route. Evidence: the design checks every cited `file:line` and finds the retired replay present at 741 lines with `AMBIGUITY_DELTA` at `:38` and the ported rules at `:449-463`, `:465-476` and `:485-489` (design section 1). Briefs c1 to c7 each bind sk-code's OpenCode route (design header)
- [x] T003 [P] Build the test fixtures: a synthetic active router with near-tied and far intents, a `stage1-only` router, a synthetic manifest, gold scenarios with partial and empty sets, a synthetic transcript directory and a prose file (`T`). Evidence: the fixtures are in `T`, and the final run is `tests 37, pass 37, fail 0` (`SE` section 2)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Router parser: `router_state`, `INTENT_SIGNALS` weights and keywords, and `RESOURCE_MAP` lists (`S`). Evidence: brief c1 wrote `parseRouter`, and design cases 1 and 2 cover an active block and a `stage1-only` one in the passing suite (`SE` section 2)
- [x] T005 Keyword arm ported from the retired `:38` and `:449-489`: word-boundary keywords, weighted scores, the one-point delta and `UNKNOWN` (`S`). Evidence: brief c1, design cases 3 to 6, and both reviewers rated REQ-002 met, with the port hand-checked against the recovered source (`SE` section 3, `logs/review-pi.last.txt`)
- [x] T006 Leaf conversion through `dualReadLegacyResource` with each hub's manifest and aliases, counting unresolvable paths (`S`). Evidence: brief c2, design cases 7 and 8 cover a resolved packet-qualified pair and an unresolvable path, and the real run prints `unresolvable=0` across the hubs with gold (`SE` section 2, `scratch/w4-build/replay-run.txt`)
- [x] T007 Gold loader and scorer: prompt and `leafPairs` from `parseScenario`, unscored rows counted, per-row F1 and exact match, the per-hub report and the `sk-code` surface-slice line (`S`). Evidence: brief c2, design cases 9 to 11, and the real run prints `total gold=56 scored=55 tied=2 mean_f1=0.9209 exact=49`, `hub=sk-code gold=1 unscored=1 surface slice not replayed` and `hub=cli-classifier stage1-only` (`SE` section 2)
- [x] T008 Recount behind `--transcripts <dir>`: Read calls on `ROUTER.md` per hub and ISO week with bytes, counts only. `router reads: not measured` without the flag (`S`). Evidence: brief c3, design cases 12, 13 and 28, and the real zero-call run prints `router reads: not measured`. The operator's transcript directory has not been read (T018, `SE` sections 2 and 5)
- [x] T009 Replay verdict behind `--prose <file>` per `spec.md` section 4's Replay Rule, with the coverage stop when the file is absent or short (`S`). Evidence: brief c3, design cases 14 to 16, and the real run prints `replay verdict: stop (prose arm covers 0 of 55 rows) N=55 P=0 keyword_f1=n/a prose_f1=n/a` (`SE` section 2, `scratch/w4-build/replay-run.txt`)
- [x] T010 Gates, arms and verdict per `spec.md` section 4's Keep Rule: the baseline choice, `no headroom`, the identity line, both skip line sets, the `--out` refusal before output, the payload and cost lines, three rotations, exit handling, `calls.jsonl` and the verdict line on stdout and in `report.json` (`S`). Evidence: briefs c4 to c7, design cases 17 to 27, and the passing suite covers the printed skip lines, the `--out` refusal, three rotations, the exit handling and the `keep`, `kill`, `stop (margin)` and `no headroom` outcomes. No live model call ran (`SE` sections 2 and 3)
- [x] T011 [P] One row each in `sk-create-skill/scripts/README.md` and `scripts/tests/README.md`. Evidence: briefs d15a and d15b, both rows are in `fcacc26bf3`, and each README passed `validate_document.py` (`SE` sections 2 and 4)
- [x] T012 The sk-doc docs through their modes: `sk-create-skill/SKILL.md`, README, the next changelog file, one playbook scenario with its index row, and the hub catalog entry `feature-catalog/packet-authored-registry-routing/leaf-route-replay.md` with its index row. Then regenerate the Hermes copy and the sk-doc leaf manifest pair. Regenerate the trigger index when its `--check` reports stale docs. Evidence: briefs d08 to d14 wrote the nine docs, each `validate_document.py` exit 0 with `Total issues: 0`; the Hermes copy was regenerated and the leaf manifest pair is fresh (`checked=15 fresh=15 failed=0`), all in `fcacc26bf3` (`SE` sections 2 and 4). The trigger index `--check` reports stale on this phase's new catalog entry and changelog, and its regeneration is a repo-wide write outside this folder, left to the orchestrator (read-only check 2026-09-29)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 `node --test` on `T` exits 0 with at least 18 passing tests: the happy path and edge case of each REQ-009 surface (`T`). Evidence: `tests 37, pass 37, fail 0`, exit 0, after the review fixes. The whole `scripts/tests/` folder prints `tests 80, pass 79, fail 1`, the baseline's one failure (`SE` section 2)
- [x] T014 One zero-call replay on the real tree with stub `jev` and `cli-deem` first on `PATH`. Both stub logs stay empty. Record per-hub gold, unscored, `UNKNOWN`, tied, F1 and exact-match counts and the replay verdict line in `goal.md`'s log. Evidence: exit 0, the stub log never created, `<dir>` holds only `report.json`. Per hub: sk-doc `gold=25 unscored=1 unknown=3 tied=2 f1=0.8259 exact=19`; mcp-tooling 15 at `f1=1.000`; system-deep-loop 6; cli-external-orchestration 5; sk-design 4; sk-code `gold=1 unscored=1 surface slice not replayed`; cli-classifier `stage1-only`; `total gold=56 scored=55 tied=2 mean_f1=0.9209 exact=49`; `router reads: not measured`; the verdict line is in `goal.md`'s log (`SE` section 2, `scratch/w4-build/replay-run.txt`)
- [x] T015 `git status --porcelain` is identical before and after T014, and `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `S` exits 1. Evidence: the key grep exits 1. Porcelain before and after the run differs only by `?? .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/`, which phase 031's code step created during the run, so this phase wrote nothing (`SE` section 2)
- [x] T016 `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on every doc T011 and T012 changed (parent D6). Evidence: exit 0 with `Total issues: 0` on all nine changed docs, the playbook index at `--type playbook` and the catalog index at `--type feature_catalog` (`SE` section 2)
- [x] T017 A cross-family review of `S` and `T` leaves no open P0 or P1 finding, and sk-create-skill's suite fails nothing beyond T001's baseline. Then the parent orchestrator commits with path-scoped commits (parent D5). Evidence: Pi MiMo on the code DeepSeek wrote and DeepSeek on the docs MiMo wrote, both `VERDICT: FAIL` with 1 P1 each; f1 and f2 closed the P1s, f3 closed three doc sentences, and both rechecks returned `VERDICT: PASS`. The suite fails nothing beyond T001's baseline. Committed as `fcacc26bf3`, 14 files, with `compiled-route-guard.cjs` exit 0 after (`SE` sections 3 and 4)
- [ ] T018 Outside this phase: the operator runs `--transcripts` on their session directory, supplies a prose file for the replay verdict and asks for one `--deem --out <dir>` run and, on their flag, one `--jev --out <dir>` run. Each line goes into `goal.md`'s log. Open for the operator: no transcript directory, prose file or model run happened in this build, so the recount line stays `not measured` and the replay verdict stays at the coverage stop (`SE` section 5)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] T001 to T017 marked `[x]`. T018 is outside this phase. Evidence: this closure pass, rows above
- [x] No `[B]` blocked tasks remaining. Evidence: no task carries `[B]`
- [x] Manual verification passed: the zero-call replay ran on the real tree. Evidence: exit 0 with the stub log never created, `total gold=56 scored=55 tied=2 mean_f1=0.9209 exact=49` and `replay verdict: stop (prose arm covers 0 of 55 rows)` (`SE` section 2)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research record**: See `../007-classifier-deep-research/research/research.md` (`### R25.`)
<!-- /ANCHOR:cross-refs -->

---
