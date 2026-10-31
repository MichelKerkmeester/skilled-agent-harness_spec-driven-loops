---
title: "Goal: Phase 25: reviewer-verdict-fallback"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "reviewer verdict fallback goal"
  - "score-verdict-fallback completion criteria"
  - "reviewer fallback keep rule"
  - "verdict regex miss gate"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback"
    last_updated_at: "2026-09-29T19:05:00Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Closed the phase at its label gate from the session evidence and set Status Complete"
    next_safe_action: "Operator: label 12 regex-miss outputs covering all three verdicts, then order a live run"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-025-reviewer-verdict-fallback"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 25: reviewer-verdict-fallback

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Count with zero calls how often recorded reviewer outputs miss the reviewer scorer's verdict regex, and settle offline, on a counted number per backend, whether a Jev or Deem choice over pass, fail and block classifies the labeled misses more accurately than zero-call rules.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changed paths: new `lib/score-verdict-fallback.cjs` and `tests/verdict-fallback.vitest.ts` under deep-improvement's `scripts/model-benchmark/`, two README rows and, per parent D6, deep-improvement's `SKILL.md`, README, changelog, catalog and playbook through sk-doc. `reviewer-scorer.cjs`, its fixtures, profile, schema and workflows are unchanged |
| D2 | The census imports `extractVerdict` unchanged and never dispatches a case. Only regex misses enter the labeled population |
| D3 | The operator labels each miss with the verdict it gives, `pass`, `fail` or `block`, and no model writes a label. `expectedVerdict` is never the label. Below 12 labeled misses, or with a verdict absent, the run prints its `stop:` line, and the phase may close there |
| D4 | Spec section 4's Keep Rule, per column, in order: 90 percent coverage, `kill` when p_loss is below 0.05, a 10-point gain over the better of the majority class and the loose last-word rule, p_win below 0.05 and a flip rate of at most 0.10 over three option orders. A baseline above 0.90 prints `no headroom` |
| D5 | Jev first, then Deem, each only on its own switch and checks, with no failover. An untracked outputs file needs `--accept-payload` before Jev. A `keep` wires nothing: a classifier `--grader` value needs a later phase the operator opens |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs` exits 0, prints `fixture cases: 8 hits: 8 misses: 0` and a `stop:`, `no headroom` or `planned calls:` line, and stub `cli-deem` and `jev` first on `PATH` log zero calls
- [x] With a stub `cli-deem health` reporting backend `stub`, `--deem` prints `deem arm skipped: stub backend`, and with a stub `jev auth status --provider official` exiting 3, `--jev` prints `jev arm skipped: no credential`. Each exits 0 with the rest of stdout byte-identical to the census
- [x] From `.skilled/skills/system-deep-loop/deep-improvement/scripts`, `npx vitest run model-benchmark/tests/verdict-fallback.vitest.ts` exits 0 with at least 16 passed and 0 failed
- [x] Either the census printed a `stop:` line below 12 labeled misses, or one live `--deem --out <dir>` run printed a `verdict deem:` line and wrote `calls.jsonl` lines each holding `wallMs`, `exitCode`, `modelId`, `modelCommit` and `sourceCommit`
- [x] `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `score-verdict-fallback.cjs` prints nothing, and `git status --porcelain` is the same before and after each run
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
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, this goal and a Planned `implementation-summary.md`, authored 2026-09-29 from R5 and open question 6 in `../001-deep-research/research/research.md` sections 11 and 12, and the carried table in `../007-classifier-deep-research/research/research.md` section 12 |
| Seam check | Done | At the worktree HEAD `reviewer-scorer.cjs:11`, `:117-123`, `:119`, `:155-167`, `:171`, `:192`, `:231-236` and `:273-292`, `reviewer-schema.md:74-76` and `:82-90`, `deep-model-benchmark-auto.yaml:206` and `deep-model-benchmark-confirm.yaml:228` hold the text R5 cites. No line moved |
| Census inputs | Done | This leaf replayed the exported `extractVerdict` on 2026-09-29: 4 fixtures, 8 cases, all `fail`, all with a recorded output, 8 hits and 0 misses. No `reviewer-report.json` exists in the worktree or the main checkout |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent goal D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel. Phase 024 shares doc paths, so the two build in turn |
| Label gate | Open (operator) | No regex-miss output exists: the census prints `stop: fewer than 12 labeled regex-miss outputs` from the final state, so no arm opened and T016 and T017 stay blocked (parent D4; `SE` section 2) |
| Build | Done | 2026-09-29: briefs c1 to c10, c1b and c6f for code and d11 to d19 for docs, from `scratch/w4-build/briefs/`, on Devin `deepseek-v4-1-flash-max` and Pi `llmgateway/mimo-v2.6-pro`, then DeepSeek V4.1 Flash on Cline after Devin's daily quota ran out; every step `STATUS: DONE`. Committed as `d657558a2e`, 12 files, not pushed. Source: `SE` sections 1 and 5 |
| Census and zero calls | Done | The default run with logging stubs for `cli-deem` and `jev` first on `PATH` exits 0 and prints `fixture cases: 8 hits: 8 misses: 0`, both baselines, `margin: 0.10`, the `keep rule:` line, the power line and `stop: fewer than 12 labeled regex-miss outputs`; neither stub log was written. Source: `SE` section 2 |
| Arm skips | Done | `--deem --out <dir>` with a stub health reporting backend `stub` exits 0 and adds only `deem arm skipped: stub backend`; `--jev --out <dir>` with a stub `auth status --provider official` exiting 3 exits 0 and adds only the identity line and `jev arm skipped: no credential`; each `--out` folder holds only `report.json`. `--deem` without `--out` exits 2 with `--deem needs --out <dir> so every call is recorded` before any call. Source: `SE` section 2 |
| Tests | Done | `verdict-fallback.vitest.ts` 31 of 31; `npx vitest run model-benchmark/tests/` prints `Test Files 15 passed (15)` and `Tests 236 passed (236)` against the pre-phase 14 files and 205 tests; the whole deep-improvement suite prints `43 failed` and `395 passed` of 438, with its 46 `FAIL` names identical to 024's baseline list. Source: `SE` section 2 |
| Read-only checks | Done | `git status --porcelain` is equal before and after every run, the key grep exits 1, and the comment hygiene checker exits 0 on the script and its test. Source: `SE` section 2 |
| Docs and packages | Done | Doc briefs d11 to d19 wrote nine docs; `validate_document.py` exits 0 on each; `sync-skills-hermes.cjs --check` prints `PASS: 72 Hermes skill copies in sync`; the catalog package reads `violations=36` with none in this phase's files; the playbook package passes with `violations=0 warnings=1`; `ci-leaf-manifest-freshness.cjs` prints `checked=15 fresh=15 failed=0`; README verdict parity prints `PARITY PASS`; `compiled-route-guard.cjs` exits 0. Source: `SE` sections 3 and 4 |
| Review and fixes | Done | Code (Pi MiMo, 871 s, read only): `VERDICT: FAIL`, 1 P1 and 3 P2; the P1 is closed by c11f and c11g and the recheck prints `VERDICT: PASS`. Docs and step 6 (DeepSeek on Cline, 354 s, read only): `VERDICT: FAIL`, 2 P1 and 2 P2; f1 closes the P1s and f2 and f3 close the doc issues, and the recheck prints `VERDICT: PASS`. The 4 remaining P2s are recorded below, not chased (parent D5). The SHA-1 over each review's files was equal before and after. Source: `SE` section 3 |
| Closure pass | Done | 2026-09-29: this pass ticked the six criteria, set Status Complete in `spec.md` and `implementation-summary.md`, and recorded the evidence here and in `tasks.md`. Gate results are in `implementation-summary.md` Verification |
| Open for the operator | Open | 1. At least 12 labeled regex-miss outputs with each verdict present, then a live Deem run, and a Jev run on the operator's yes. 2. The four P2 findings below. Source: `SE` section 6 |

### Deviations and findings

| Item | Note |
|------|------|
| Finding: a live run keeps no output text | `runCase` records a 16-character hash of each output (`reviewer-scorer.cjs:203`), so even a live reviewer run leaves nothing to label. How the operator gathers misses is spec section 7's first question |
| Baseline beyond today's behavior | Today a miss records `unknown`, which a model beats on every row. The keep rule compares against the better of the majority class and a loose last-word rule instead, so a `keep` means a model beats a regex change, the cheaper fix R5's fitness check names |
| Deviation: path resolution gains a repository-root step | After c6 the check failed 4 of 16, because the shipped profile names `fixtureDir` repository-relative and the design's order, as `reviewer-scorer.cjs` resolves it, worked only from the repository root. Fix c6f tries the repository root between the working directory and the profile's folder, a superset of the sibling's order, so any path the sibling resolves still resolves the same way. Source: `SE` section 1, `scratch/w4-session/notes.md`, a deviation from design section 2 |
| Executor switch: Devin quota | Devin's daily quota ran out at step c6 before it wrote anything, so step c6 went to Pi MiMo and c6f onward to DeepSeek V4.1 Flash on Cline, each `STATUS: DONE`. Source: `SE` section 1, parent goal row "Executor switch: DeepSeek on Cline (2026-09-29)" |
| Review P1 fixed: `pickProb` on every call record | The code review found `calls.jsonl` records kept `pick` but dropped the picked key's probability, which REQ-009 takes from phase 017's REQ-008. c11f adds `pickProb`, the probability from `answers.answer.probabilities` else null, and c11g pins it in the tests; the recheck prints `VERDICT: PASS` and agrees with the session ruling that this script's three options hold no `none` key to log. Source: `SE` section 3 |
| P2 1: `USAGE` is never printed | The `USAGE` comment says the line prints when the run cannot start, but no path prints it; an unknown switch prints only node's own message. Recorded, not chased (parent D5). Source: `SE` section 3 |
| P2 2: the Jev version gate reads one line | `jevGate` compares only the first stdout line to `jev 0.6.2`, where REQ-006 asks for exactly `jev 0.6.2`, so a version line followed by noise passes. Recorded, not chased (parent D5). Source: `SE` section 3 |
| P2 3: the bad-label test asserts the parser only | The test named "a bad label exits 2 naming the row" asserts only that `parseOutputs` throws and never runs `main`, so REQ-003's exit 2 is unasserted. Recorded, not chased (parent D5). Source: `SE` section 3 |
| P2 4: README frontmatter version drift | The deep-improvement `README.md` frontmatter stays 1.17.0.38 and the playbook root 1.17.0.44 while the release is 1.19.0.0. The drift predates this phase. Recorded, not chased (parent D5). Source: `SE` section 3 |
| No build-evidence.md | The build left no `scratch/w4-build/build-evidence.md`, so `SE` (`scratch/w4-session/session-evidence.md`) and its `notes.md` are the phase's build record. Source: `SE` header and section 6 |
<!-- /ANCHOR:log -->
