---
title: "Implementation Summary: Phase 19: advisor-suggested-order"
description: "score-suggested-order.mjs measures offline whether a Jev or Deem whole-cluster order beats the skill advisor's best zero-call order and fits the 2,200 ms advisor budget inside a child like the prompt shim's. The zero-call run and live Deem and Jev runs printed `verdict deem: kill` and `verdict jev: kill` from the final state. Built as 6aa7ca0980."
trigger_phrases:
  - "advisor suggested order summary"
  - "score-suggested-order status"
  - "suggested order eval verdict"
  - "deem whole-cluster kill"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order"
    last_updated_at: "2026-09-30T10:07:58Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Recorded the operator's live Jev run and its kill verdict"
    next_safe_action: "Orchestrator commits the phase docs and the parent goal's log"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs"
      - ".skilled/skills/system-skill-advisor/runtime/tests/parity/score-suggested-order.vitest.ts"
      - "specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order/scratch/w4-build/build-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-019-advisor-suggested-order"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Deem's map holds every submitted key: 328 of 333 answers, 5 timeouts"
      - "Jev's map holds every submitted key: all 333 choice calls measured on attempt 1"
      - "A Deem whole-cluster order loses to the scorer's order: kill, 9 wins and 35 losses"
      - "A Jev whole-cluster order loses to the scorer's order: kill, 13 wins and 25 losses"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 19: advisor-suggested-order

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 019-advisor-suggested-order |
| **Status** | Complete |
| **Completed** | 2026-09-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`score-suggested-order.mjs` answers research R3 offline, with one verdict per backend. The default run makes zero model calls and prints 002's census, three zero-call orders scored with MRR, right@1 and right@3, the outcome-weighted rerank on held-out rows and the advisor-only child timing against the 2,200 ms budget. Behind `--jev` or `--deem` it asks a model for a whole-cluster order, every call timed inside a child spawned like the prompt shim's, and judges the column under the Keep Rule fixed in `spec.md` section 4. Phase 002 killed the pick-first form on both backends. This phase measured the order form it left open and the budget inside the child.

### Phase 19: advisor-suggested-order

**What the runs found.** Both live runs printed `kill` from the final state. Deem first, on 2026-09-29:

```text
verdict deem: kill K=111 M=108 W=9 L=35 F=86 p=1.0000 mrr=0.6176/0.7750 p95_ms=1686 model=deem-0.8-v1 model_commit=8cbabbb2c4a7ef13c6b43f0ef3ae4157983c6d21 source_commit=3883f79261e5c61d3e8f230cad02b50c6d2b1891
```

The Deem column's mean reciprocal rank fell to 0.6176 against the scorer's 0.7750 on the same 108 measured rows, with 9 wins and 35 losses and `p_loss=0.0001`. The zero-call run beside it printed `advisor child: p50=629 p95=929 max=2500 over_2200=4 children=241 killed=1`, so the advisor itself sits under the 2,200 ms ceiling at p95 while 4 of 241 children passed it under load. A `kill` closes the Deem whole-cluster order at `deem-0.8-v1` on `3883f792`, beside 002's kill of the pick-first form.

The operator's live Jev run printed `kill` on 2026-09-30:

```text
verdict jev: kill K=111 M=111 W=13 L=25 F=13 p=0.9832 mrr=0.7260/0.7811 p95_ms=1490 jev_version=0.6.2 provider=official model=jev-1.13.0
```

The Jev column's mean reciprocal rank of 0.7260 sits below the scorer's 0.7811 on the same 111 rows, with 13 wins and 25 losses and `p_loss=0.0365`. All 111 rows were measured and all 333 `choice` calls returned a probability for every submitted key. Its in-child p95 was 1,490 ms, under the 2,200 ms ceiling, and the advisor timed `p50=718 p95=1088 max=1668 over_2200=0 children=241 killed=0` beside it. A `kill` closes the Jev whole-cluster order at `jev-1.13.0` (`jev-cli` 0.6.2, provider `official`), beside 002's kill of the pick-first form. With both backends at `kill`, nothing is served and the advisor's order is unchanged. Source: `scratch/w4-session/jev-run/`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs` | Created | 710 lines: census, zero-call orders, advisor-only child timing, power line, both gates and arms, the timed child and the verdicts. Briefs 01 to 09 |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/score-suggested-order.vitest.ts` | Created | 856 lines, 45 cases with stub binaries, stub children and synthetic corpora. Briefs 01 to 09 and 06b |
| `runtime/tests/manual-testing-playbook.vitest.ts` | Modified | Its six scenario-count pins moved 48 to 49. Brief 13 |
| `feature-catalog/scorer-fusion/suggested-order-eval.md` and `feature-catalog/feature-catalog.md` | Created, Modified | The catalog entry and its index row, 45 features. Briefs 10 and 11 |
| `manual-testing-playbook/scorer-fusion/suggested-order-eval.md` and `manual-testing-playbook/manual-testing-playbook.md` | Created, Modified | Scenario SC-007 and its index row, 49 scenarios. Briefs 10 and 12 |
| `SKILL.md` | Modified | Version 0.13.0.0 to 0.14.0.0 and one pointer bullet, with `description` and the Keywords comment unchanged. Brief 14 |
| `README.md`, `runtime/scripts/routing-accuracy/README.md` and `runtime/tests/parity/README.md` | Modified | The §8 verification row and one row per new file. Briefs 15 and 16 |
| `changelog/v0.14.0.0.md` | Created | The release note. Brief 10 |
| `leaf-manifest.json` and `leaf-aliases.json` | Regenerated | `ci-skill-root-metadata.cjs --fix --skill system-skill-advisor`. Brief 17 |
| `.hermes/skills/system-skill-advisor/SKILL.md` | Regenerated | `sync-skills-hermes.cjs` |
| Trigger index and its fixtures | Regenerated | Rebuilt from an archive of HEAD in its own commit |
| `scratch/w4-build/` and `scratch/w4-session/` | Created | The build record and briefs, and the session's verification, review and live run |
| `spec.md`, `plan.md`, `tasks.md`, `goal.md` and this file | Modified | The closure pass recorded the evidence and corrected the stale premises |

Every path above except the Hermes copy and the trigger index sits under `.skilled/skills/system-skill-advisor/` or this folder. The build is committed as `6aa7ca0980`, 15 files, not pushed. The trigger index rebuild follows in its own commit.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The operator released the phase on 2026-09-29, when "Bind and release" amended parent D3. A build orchestrator leaf ran 18 single-change briefs from `scratch/w4-build/briefs/`: 12 to Devin `deepseek-v4-1-flash-max` and 6 to Pi `llmgateway/mimo-v2.6-pro` at high, each handback `STATUS: DONE` with only its named files in the tree diff. One re-dispatch, 06b, fixed a test that pinned machine speed. The operator then said "Dont use opus" and "No Claude leaves", and the session stopped the leaf during its final checks, so the session reran the live Deem run and the gates itself.

The cross-family review ran split by author family (parent D5): Pi MiMo read the code Devin wrote and Devin DeepSeek read the docs Pi wrote. The session committed the build as `6aa7ca0980`. This closure pass recorded the evidence in the phase docs and ran the four gates below.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Order the whole cluster, not the pick | 002 already killed the pick-first form on both backends, so a rerun of that question would teach nothing new |
| Time every call inside a child spawned like the shim's | Research condition C11 asks for a health-plus-call p95 measured inside the advisor child, and 002's p95s were timed outside it |
| Import 002's census and gates unchanged | The comparison stays on 002's rows and 53/70, and 002's verdicts stay reproducible |

### Deviations

One row per deviation the build record names, with the close-pass amendments. The fuller notes sit in `goal.md`'s log.

| Deviation | What it changed |
|-----------|-----------------|
| 1, Deem health timeout | The imported `deemGate` holds `HEALTH_TIMEOUT_MS` 10,000 ms, not REQ-002's first 2,000 ms. The gate runs unchanged, and the close pass picked the imported bound in REQ-002 |
| 2, skip output | A gate skip re-measures `advisor child:`, so its output is byte-identical to the default run apart from that one line |
| 3, refusal order | `--jev` or `--deem` without `--out` exits 2 before any output, this phase's REQ-010 order, where 002's script refused after its gate |
| 4, verdict `p=` | The field prints the sign-test P(X >= W). The loss test goes to `report.json` as `p_loss` |
| 5, flips | F counts, per measured row, 3 minus the most common top answer's count, so a three-way split adds 2 |
| 6, margin tolerance | `20*(SA-SB) >= M` compares with a 1e-9 tolerance so rounding cannot lose a sum at the margin |
| 7, `none` tie | A row abstains only when `none`'s mean is strictly above every cluster key's. A top tie reorders the cluster, and the close pass corrected the spec sentence to match |
| 8, option labels | One `optionArgs` helper appends ` [key]` when two cluster skills share a projection description, so no two options are identical text |
| 9, child daemons | `childEnv` sets `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=1`, so the capture-env daemon idles out after a minute instead of 30 |
| 10, size | The script is 710 lines and the test 856 with 45 cases, over the plan's 350 to 500 estimate. The extra is the timed child, both arms' exit handling and the report |
| 11, scoped generator | `ci-skill-root-metadata.cjs --fix` ran scoped to `system-skill-advisor`, because another skill's root was stale from another worker |
| Re-dispatch 06b | Brief 06's latency test pinned `killed=0` and flaked under load. The test-only re-dispatch dropped the pin and asserts `p95 > 2200` |
| Close amendments | REQ-002's health bound, the `none` tie sentence, T018's `done as not requested` clause and the `all` wording in `tasks.md` Completion Criteria, on build deviations 1 and 7, review P2 1 and parent D4 (2026-09-29) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

`E` is `scratch/w4-build/build-evidence.md`, `E-tail` is `scratch/w4-build/evidence-tail.draft.md` and `SE` is `scratch/w4-session/session-evidence.md`. The session reran the gates from the final state and wins where the two records differ.

| Check | Result |
|-------|--------|
| Baseline at HEAD `bf830c3d47` (`E` section 1) | `dist is fresh`, so no rebuild ran. Full advisor suite `Test Files 130 passed (130)`, `Tests 1030 passed \| 6 skipped (1036)`, exit 0. Typecheck clean. `validate_document.py` 9 of 9 exit 0. Playbook `scenarios=48`. Skill-root metadata 15 of 15. Phase docs `RESULT: PASSED` |
| Build briefs (`E-tail` section 3) | 18 dispatches, each `STATUS: DONE` and only its named files changed. The eval file grew 9 to 45 tests. The three new doc texts passed `validate_document.py --type` and were copied byte for byte |
| P1 zero-call, final state (`SE` section 2) | `STUB_LOG=<log> PATH="<stubs>:$PATH" node score-suggested-order.mjs` exit 0: `baseline: holdout_top1=53/70`, `comparator: name=scorer rows=111 mrr=0.7811 right1=76 right3=99`, `confidence rows=111 mrr=0.7766 right1=75 right3=99`, `always_second rows=111 mrr=0.5498 right1=25 right3=99`, `rerank rows=57 mrr=0.7588 right1=37 right3=51`, `power: movable=23 decided_ceiling=99 min_wins=16 win_rate_80=0.749`, `advisor child: p50=629 p95=929 max=2500 over_2200=4 children=241 killed=1`, `planned calls: jev=334 deem=333`, `margin: 0.05` and the `keep rule:` line. The stub log was never written |
| P2 gate skips (`SE` section 2) | Stub `cli-deem` reporting backend `stub` with `--deem`: exit 0, `deem arm skipped: stub backend`. Stub `jev` with `auth status` exit 3 and no `JEV_PROVIDER`: exit 0, `jev: path=<stub>/jev provider=official` then `jev arm skipped: no credential`. Against P1 with `advisor child:` masked, only those lines differ |
| P3 eval file (`SE` section 2) | `vitest run tests/parity/score-suggested-order.vitest.ts`: `Tests 45 passed (45)`, exit 0 |
| P4 live Deem run (`SE` section 2) | `node score-suggested-order.mjs --deem --out scratch/w4-session/p4-deem`, exit 0 in 597 s. `deem: health backend=torch model=deem-0.8-v1 model_commit=8cbabbb2c4a7ef13c6b43f0ef3ae4157983c6d21 source_commit=3883f79261e5c61d3e8f230cad02b50c6d2b1891`, `deem: calls=333 timeouts=5`, `column deem: rows=111 measured=108 wins=9 losses=35 ties=64 abstentions=13 flips=86 baseline=scorer p_loss=0.0001 calls=333 p50_ms=1140 p95_ms=1686` and the verdict line above. `calls.jsonl` holds 333 lines with `child_wall_ms`, `model_commit` and `source_commit`, 5 of them `unmeasured_timeout`. The advisor-side porcelain was the same before and after. Nothing left the machine |
| P4 live Jev run (`scratch/w4-session/jev-run/`) | `node score-suggested-order.mjs --jev --out <dir>`, exit 0 in 558 s, empty stderr. `jev: path=/Users/michelkerkmeester/.local/bin/jev provider=official`, `jev: calls=333 timeouts=0`, `column jev: rows=111 measured=111 wins=13 losses=25 ties=73 abstentions=8 flips=13 baseline=scorer p_loss=0.0365 calls=333 p50_ms=1089 p95_ms=1490` and the verdict line above. `calls.jsonl` holds 334 records, every one `measured` on attempt 1. The advisor timed `p50=718 p95=1088 max=1668 over_2200=0 children=241 killed=0` |
| P5 no key and read-only (`SE` section 2) | `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization'` on the script exit 1. Porcelain identical before and after P1 and P2 |
| G1 suite and typecheck (`SE` section 2) | Full advisor suite `Test Files 131 passed (131)`, `Tests 1075 passed \| 6 skipped (1081)`, exit 0, against T001's baseline of 130 files and 1,030 passed: +1 file, +45 tests, 0 new failures. `npm run typecheck` exit 0 |
| G2 docs (`SE` section 2) | `validate_document.py` exit 0 on all 9 changed docs. Comment hygiene checker exit 0 on the script, its test and the playbook pin test |
| Generators (`SE` section 2) | README verdict parity `diff_entries=0`. Hermes `system-skill-advisor` in sync. `skill_graph_compiler.py --validate-only` `VALIDATION PASSED` |
| Review, Pi MiMo on the code (`SE` section 3) | `VERDICT: PASS`, 2 P2. SHA-1 over the 14 reviewed files `331370a87a0ce94e9e5a13266a4846eabcc5bb63` unchanged across the run |
| Review, Devin DeepSeek on the docs (`SE` section 3) | `VERDICT: PASS`, 2 P2, REQ-001 to REQ-012 met |
| Closure pass: `repair-derived.cjs --folder <this phase> --apply` | `inspected=1 repaired=1 failed=0`, exit 0: the graph metadata re-derived from the closed docs |
| Closure pass: `validate.sh <this phase> --strict` | `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED`, exit 0, 0 `RESULT: FAILED` lines |
| Closure pass: `check-goal.cjs <this phase>` | `RESULT: PASSED (5/5 checks)`, exit 0 |
| Closure pass: `goal.cjs packet <this phase> --workspace "$PWD"` | Exit 0, `packet_budget=unknown` and `packet_durable_chars=3880`, under the 4,000 the brief sets |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The Jev run sent the routing corpus to the hosted classifier and printed `kill`.** The operator approved one live run on 2026-09-30: 333 calls, all `measured` on attempt 1, so every probability map held every submitted key. Both backends now print `kill` for the whole-cluster order, nothing is served and no row waits on operator labels. Evidence: `scratch/w4-session/jev-run/`.
2. **Four P2 review findings are recorded, not chased** (parent D5). They are the `none` tie rule, the `auth_test` line shape in `calls.jsonl`, `SKILL.md:383` not naming the switch literals and the catalog entry omitting the Deem arm's 25-key cluster cap. See `goal.md`'s log.
3. **Not every REQ-009 exit path has a test.** `score-suggested-order.mjs:508-517` implements `backend refused`, `server gone`, `model commit changed mid-run`, `key rejected` and `interrupted`. The vitest covers `backend refused` (`score-suggested-order.vitest.ts:626-636`), `key rejected` and the busy retry (`:693-731`). `server gone` and `model commit changed mid-run` have no case.
4. **The corpora never used a 4-key cluster.** The built cases use 2-key clusters with a 1-key solo row, and the order-builder case is 3-key (`score-suggested-order.vitest.ts:178`). No 4-key case was built (T003).
5. **No dispatch record shows a sk-code router call.** The code briefs followed brief 01's OpenCode patterns instead (T002).
<!-- /ANCHOR:limitations -->

---
