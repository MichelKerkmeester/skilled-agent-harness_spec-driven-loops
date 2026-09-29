---
title: "Goal: Phase 26: completion-claim-audit"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "completion claim audit goal"
  - "score-completion-claims completion criteria"
  - "completion claim keep rule"
  - "completion claim label gate"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit"
    last_updated_at: "2026-09-29T19:20:00Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Closed the phase at its label gate from the session evidence and set Status Complete"
    next_safe_action: "Operator: label 30 rows with 5 of each class, then order a live run"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-026-completion-claim-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 26: completion-claim-audit

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Count with zero calls how often the completion sentinel's claim regex fires wrongly or misses a claim on turns the operator labels, and settle offline, on a counted number per backend, whether a Jev or Deem noul reads a completion claim more accurately than that regex.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changed paths: new `runtime/scripts/completion-claim-audit/score-completion-claims.mjs`, `runtime/tests/completion-claim-audit.vitest.ts` and its fixtures directory, one scripts README row and, per parent D6, system-spec-kit's `SKILL.md`, README, changelog, catalog and playbook through sk-doc. The sentinel, both Stop adapters, `.claude/settings.json` and phase 003's fixture are unchanged |
| D2 | The census imports `detectCompletionClaim` unchanged and prints counts and ids, never row text |
| D3 | The operator labels each turn `yes` or `no` for a completion claim, and no model writes a label. Below 30 labeled rows, or 5 of either class, the run prints its `stop:` line, and the phase may close there |
| D4 | Spec section 4's Keep Rule, per column, in order: 90 percent coverage, `kill` when p_loss is below 0.05, a 10-point gain over the regex, p_win below 0.05 and, for Jev, a flip rate of at most 0.10 over three reruns. Deem prints `flips: n/a (commit pair)`. A regex above 0.90 prints `no headroom` |
| D5 | Jev first, then Deem, each only on its own switch and checks, with no failover. Jev also needs `--accept-payload`, since the rows are the operator's conversation. A `keep` serves nothing: a detector at turn end needs a later phase, a named reader and the operator's call |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] From `.skilled/skills/system-spec-kit/runtime`, `node scripts/completion-claim-audit/score-completion-claims.mjs --rows <phase 003 fixture>` exits 0, prints `rows: 50 fires: 4` and a `stop:`, `no headroom` or `planned calls:` line, and stub `cli-deem` and `jev` first on `PATH` log zero calls
- [x] With a stub `cli-deem health` reporting backend `stub`, `--deem` prints `deem arm skipped: stub backend`, and `--jev` without `--accept-payload` prints `jev arm skipped: payload not accepted`. Each exits 0 with the rest of stdout byte-identical to the census
- [x] From the same directory, `npx vitest run tests/completion-claim-audit.vitest.ts` exits 0 with at least 16 passed and 0 failed
- [x] Either the census printed a `stop:` line below 30 labeled rows, or one live `--deem --out <dir>` run printed a `verdict deem:` line and wrote `calls.jsonl` lines each holding `wallMs`, `exitCode`, `modelId`, `modelCommit` and `sourceCommit`
- [x] `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the script prints nothing, no row text appears in stdout, and `git status --porcelain` is the same before and after each run
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
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, this goal and a Planned `implementation-summary.md`, authored 2026-09-29 from R4 and open question 9 in `../001-deep-research/research/research.md` sections 11 and 12, and the carried table in `../007-classifier-deep-research/research/research.md` section 12 |
| Seam check | Done | At the worktree HEAD `completion-evidence-sentinel.cjs:60-63`, `:64`, `:70`, `:84`, `:113-119` and exports `:553-578`, `completion-evidence-stop.cjs:118-119` and `:132-139` and `.claude/settings.json:172-177` hold the text R4 cites. No line moved |
| Census inputs | Done | This leaf ran the exported `detectCompletionClaim` on the `raw_text` of phase 003's 50 rows on 2026-09-29 and printed counts only: 50 rows, 4 fires, 0 labeled. The main checkout's advisory log held 590 lines, 533 naming a missing `implementation-summary.md`, and no turn text |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent goal D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel |
| Label gate | Open (operator) | No claim label exists: the census prints `stop: fewer than 30 labeled rows` from the final state, so no arm opened and T016 and T017 stay blocked (parent D4; `SE` sections 2 and 6) |
| Build | Done | 2026-09-29: briefs c1 to c8 and c6f for code and d1 to d6b for docs, from `scratch/w4-build/briefs/`, code on DeepSeek V4.1 Flash through Cline and docs on Pi `llmgateway/mimo-v2.6-pro`; every step `STATUS: DONE`. Committed as `1a0fb2ea33`, 24 files, not pushed. Source: `SE` sections 1 and 5 |
| Census and zero calls | Done | The default run with logging stubs for `cli-deem` and `jev` first on `PATH` exits 0 and prints `rows: 50 fires: 4`, the per-word line, `margin: 0.10`, the `keep rule:` line, the power line and `stop: fewer than 30 labeled rows`; neither stub log was written. Source: `SE` section 2 |
| Arm skips | Done | `--deem --out <dir>` with a stub health reporting backend `stub` exits 0 and adds only `deem arm skipped: stub backend`; `--jev --out <dir>` with a stub `auth status` exiting 3 exits 0 and adds only the identity line and `jev arm skipped: no credential`; `--jev` without `--accept-payload` adds the identity line and `jev arm skipped: payload not accepted`; `--deem` without `--out` exits 2 with `--deem needs --out <dir> so every call is recorded` before any call. Source: `SE` section 2; `scratch/w4-session/docs/facts.txt` |
| Tests | Done | `completion-claim-audit.vitest.ts` prints `Tests 23 passed (23)`; the runtime root suite went from 108 files and 1,305 tests to 109 files and 1,328 tests with the same failing names before and after. Source: `SE` section 2 |
| Read-only checks | Done | `git status --porcelain` is equal before and after every run, the key grep exits 1, a 40-character slice of each of the 50 rows appears nowhere in any run's stdout, and the code review records no comment-hygiene violation. Source: `SE` sections 2 and 3; `facts.txt` |
| Docs and packages | Done | Doc briefs d1 to d6b wrote `runtime/scripts/README.md`, `SKILL.md` at version 4.5.0.0, `README.md`, `changelog/v4.5.0.0.md`, the catalog entry and its index, and the playbook scenario 462 and its index; `validate_document.py` exits 0 on all eight; `sync-skills-hermes.cjs --check` prints `PASS: 72 Hermes skill copies in sync`; the catalog package reads `violations=85`, phase 022's baseline, with none in this phase's files; the playbook package prints `scenarios=88 violations=0 warnings=1`; `ci-leaf-manifest-freshness.cjs` prints `checked=15 fresh=15 failed=0`; README verdict parity prints `PARITY PASS`; `compiled-route-guard.cjs` exits 0. Source: `SE` sections 2 and 4 |
| Review and fixes | Done | Code (Pi MiMo, 857 s, read only): `VERDICT: PASS`, 4 P2. Docs (DeepSeek on Cline, 422 s, read only): `VERDICT: FAIL`, 1 P1 and 2 P2; fix f1 closes the P1 and fix f2 the tree-line P2, and the recheck (60 s) prints `VERDICT: PASS` with nothing new at P0 or P1. The 3 remaining P2s are recorded below, not chased (parent D5). The SHA-1 over each review's files was equal before and after. Source: `SE` section 3 |
| Closure pass | Done | 2026-09-29: this pass ticked the six criteria, set Status Complete in `spec.md` and `implementation-summary.md`, and recorded the evidence here and in `tasks.md`. Gate results are in `implementation-summary.md` Verification |
| Open for the operator | Open | 1. At least 30 labeled rows (`--labels <file>`) with at least 5 of each class, then a live Deem run, and a Jev run on the operator's yes with `--accept-payload`. 2. The three P2 findings below. 3. The two spec section 7 questions: a named reader for the advisory and where real Stop-turn rows come from. Source: `SE` section 6 |

### Deviations and findings

| Item | Note |
|------|------|
| Phase 003's claims column was not built | 003 planned R4's zero-call column as its T028 and recorded it as not built. This phase measures the claim with its own script and leaves 003's scorer and fixture byte-identical |
| Finding: 4 fires cap the false-fire count | On 003's rows false fires can be counted on at most 4 turns, so the report gives counts, not a rate. A rows file of real Stop turns needs a transcript directory the operator names |
| UNKNOWN: the second pattern copy | The sentinel says it mirrors the runtime hook's private pattern verbatim (`:60-63`), and a search on 2026-09-29 found no other copy. A later regex change must locate it first |
| Deviation: release moved to v4.5.0.0 and playbook ID 462 | Orchestrator ruling 2: phase 022 had already created `changelog/v4.4.0.0.md` and bumped `SKILL.md` to 4.4.0.0 by the time this build started, so this phase writes `changelog/v4.5.0.0.md` and bumps `SKILL.md` to 4.5.0.0, and the playbook scenario is ID 462 after 022's 461. The design's `v4.4.0.0` was stale. Source: `scratch/w4-build/rulings.md` 2, `SE` section 1, `scratch/w4-session/docs/facts.txt` |
| Deviation: the SKILL.md anchor does not exist | The spec's Files to Change planned a sentence beside the completion-evidence sentinel's mention, but a grep on 2026-09-29 found no `sentinel` or `completion-evidence` line in `SKILL.md`. Ruling 3 places a Quick Reference Commands row directly after the `Alignment suggestion measurement` row. Source: design section 1 premise table (`missing`), `scratch/w4-build/rulings.md` 3 |
| Deviation: executor roster | Parent D5 was amended by the operator on 2026-09-29, DeepSeek V4.1 Flash on Cline replacing Devin. The code steps c1 to c8 ran on DeepSeek V4.1 Flash through Cline at `--thinking xhigh` and the doc steps d1 to d6b on Pi `llmgateway/mimo-v2.6-pro` at `high`, each `STATUS: DONE`; no Claude leaf wrote a file. Source: `SE` section 1, parent goal row "Executor switch: DeepSeek on Cline (2026-09-29)" |
| Deviation: the c6 fix | Step c6 left `labeled` undefined; the fix brief c6f closed it before c7 ran. Source: `SE` section 1 |
| Review P1 fixed: the catalog's allowlist sentence | The docs review found the catalog entry says every string the run prints or writes passes the allowlist, while the code checks only the census object once, before the first line prints. Fix f1 states what the code does, including that later lines such as the Deem health line do not pass the check, and the recheck prints `VERDICT: PASS`. Source: `SE` section 3 |
| Review P2 fixed: the scripts README tree line | The tree line said `Zero-call audit` where `--deem` and `--jev` make model calls; fix f2 adds `by default`, matching the inventory row below it. Source: `SE` section 3 |
| P2 1: the free-text guard reads only the census | MiMo and DeepSeek: the census object's strings are row ids, so the guard cannot fire, and the lines printed after it are not checked. Recorded, not chased (parent D5). Source: `SE` section 3 |
| P2 2: `firstClaimWord` matches substrings | MiMo: the per-word count matches substrings, not the pattern's `\b` words, so `affixed` counts as `fixed`. Recorded, not chased (parent D5). Source: `SE` section 3 |
| P2 3: no test runs a gate skip or a stop exit | MiMo and DeepSeek: no test runs an arm switch below the label gate or an `arm stopped:` exit, so those skip and stop lines are untested. Recorded, not chased (parent D5). Source: `SE` section 3 |
| No build-evidence.md | The build left no `scratch/w4-build/build-evidence.md`, so `SE` (`scratch/w4-session/session-evidence.md`) and its `notes.md` are the phase's build record. Source: `SE` header and section 6 |
<!-- /ANCHOR:log -->
