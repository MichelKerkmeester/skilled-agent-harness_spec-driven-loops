---
title: "Implementation Summary: Phase 26: completion-claim-audit"
description: "Complete at its label gate. score-completion-claims.mjs runs the completion sentinel's own detector over a rows file the operator names, prints rows: 50 fires: 4 and the per-word counts with zero model calls, and stops at stop: fewer than 30 labeled rows; its 23 tests cover the census, the label gate and both dormant arms on stubs, and the system-spec-kit docs describe it. Built and committed as 1a0fb2ea33."
trigger_phrases:
  - "completion claim audit summary"
  - "completion claim audit status"
  - "score-completion-claims complete"
  - "completion claim audit results"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit"
    last_updated_at: "2026-09-29T19:20:00Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Closed the phase at its label gate from the session evidence and set Status Complete"
    next_safe_action: "Operator: label 30 rows with 5 of each class, then order a live run"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs"
      - "specs/cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit/scratch/w4-session/session-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-026-completion-claim-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Who reads the completion sentinel's advisory"
      - "Where do real Stop-turn rows come from"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 26: completion-claim-audit

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 026-completion-claim-audit |
| **Status** | Complete |
| **Completed** | 2026-09-29, at its label gate (parent D4) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

With zero model calls you can now read how often the completion-claim detector fires on the turns you name and which of the ten claim words it caught, and, once the label gate passes, how often it false-fires or misses a claim and how a Deem or Jev noul reads the same 400-character tail. Past the gate, a Deem arm and a Jev arm each ask one `noul` per labeled row and print one verdict per column under the Keep Rule in `spec.md` section 4. The phase closes at the label gate, so no model run, no verdict line and no live Jev run exist.

### Phase 26: completion-claim-audit

**The script.** `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs` (1,310 lines) imports `detectCompletionClaim` and `COMPLETION_CLAIM_PATTERN` from the sentinel through `createRequire` and never copies the pattern. Its usage is `node scripts/completion-claim-audit/score-completion-claims.mjs --rows <file> [--labels <file>] [--deem] [--jev] [--out <dir>] [--accept-payload]`, run from `.skilled/skills/system-spec-kit/runtime`. From the final state, with logging stubs for `cli-deem` and `jev` first on `PATH`:

```text
rows: 50 fires: 4
words: completed=1 resolved=1 fixed=1 finished=0 shipped=0 released=0 deployed=1 implemented=0 occurred=0 happened=0
labels: none
labeled: 0 (yes 0, no 0)
regex accuracy: n/a (no labels)
regex false fires: 0 (by word: none)
regex missed claims: 0 (by word: none)
margin: 0.10
keep rule: coverage 10*M >= 9*K, then kill when p_loss < 0.05, then margin 10*(A-B) >= M, then sign test p_win < 0.05, then for jev flips 10*F <= 3*M
power: a keep needs at least 5 wins with no loss, 0.5^5 = 0.03125 < 0.05
stop: fewer than 30 labeled rows
```

Exit 0, no file written, and neither stub log was created. The census scans each row's trimmed last 400 characters, counts at most one word per fired row in pattern order, and no line holds row text.

**Labels, gate and regex errors.** The labels file is JSONL, one `{ id, claim }` per turn with `claim` exactly `yes` or `no`; an unknown id or any other value exits 2 naming the row, and the run prints the file's SHA-256 on its `labels:` line. Below 30 labeled rows, or fewer than 5 of either class, the run prints its `stop:` line and no arm calls. On labeled rows it prints the regex's false fires and missed claims with their per-word split and the regex's accuracy, which is the margin's baseline; more than 0.90 prints `no headroom` and no arm calls.

**The arms.** `--jev` runs its gate and arm first, then `--deem`, each on its own switch and checks with no failover. A Deem health reporting backend `stub` adds only `deem arm skipped: stub backend`; a stub `auth status` exiting 3 adds only the identity line and `jev arm skipped: no credential`; `--jev` without `--accept-payload` adds the identity line and `jev arm skipped: payload not accepted`, and the Deem arm still runs. Each exits 0 with the census lines byte-identical. `--deem` or `--jev` without `--out <dir>` exits 2 with `--deem needs --out <dir> so every call is recorded` before any call, and an `--out` inside the repository exits 2 with `refused: report directory inside the repository`. A run with either switch writes `report.json` under `--out`; a run past the gate also appends `calls.jsonl`, one line per call with `wallMs`, `exitCode` and `noul`, plus the Deem commit pair or the Jev version, provider and model. Every call gets one handling: Deem asks once per row, Jev three times with no answer cache and the modal answer, and the exit tables stop an arm rather than crash it.

**The verdicts.** The Keep Rule is fixed in code in the spec's order: 90 percent coverage, `kill` when p_loss is below 0.05, a 10-point gain over the regex, p_win below 0.05, and for Jev a flip rate of at most 0.10 over three reruns. One line per column prints `verdict <backend>: <keep|kill|stop (reason)>` with integer counts and exact p values, and a stored report from another commit pair prints its `requalify:` line first. No run has printed a verdict line: every run stopped at the label gate.

**The tests.** `runtime/tests/completion-claim-audit.vitest.ts` (559 lines, 23 cases) runs the script through `spawnSync` with a temp stub directory first on `PATH`, over 13 synthetic fixture files in `runtime/tests/completion-claim-audit-fixtures/`. It covers the census happy path and the claim word outside the 400-character tail, the per-word split, the labels parser with an unknown id and a bad value, the class gate, `no headroom`, the bare run whose stubs log nothing and whose stdout holds no fixture text, both gates and their skip lines, the payload rule, `--out` missing and inside the repository, the requalify line and the verdicts `keep`, `kill`, `stop (margin)`, `stop (coverage)` and `stop (flips)` on stub answers.

**The docs (parent D6, through sk-doc).** `runtime/scripts/README.md`, `SKILL.md` at version 4.5.0.0 with a Quick Reference Commands row, `README.md`, `changelog/v4.5.0.0.md`, the catalog entry `feature-catalog/tooling-and-scripts/completion-claim-audit.md` with its index block, and the playbook scenario `manual-testing-playbook/tooling-and-scripts/completion-claim-audit.md` (ID 462) with its index row. Each passed `validate_document.py`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs` | Created | The census, the label gate, both arms and one verdict per column, 1,310 lines. Briefs c1 to c8, fix c6f |
| `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit.vitest.ts` | Created | 23 cases over every public surface with stub backends, 559 lines. Briefs c1 to c8, fix c6f |
| `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/` | Created | 13 synthetic rows and labels files; no real conversation text |
| `.skilled/skills/system-spec-kit/runtime/scripts/README.md` | Modified | The tree lines and the inventory row for the script. Brief d1, fix f2 |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modified | The Quick Reference Commands row; version from 4.4.0.0 to 4.5.0.0 (ruling 2). Brief d2 |
| `.skilled/skills/system-spec-kit/README.md` | Modified | One paragraph naming the script, its zero-call default and its switches. Brief d3 |
| `.skilled/skills/system-spec-kit/changelog/v4.5.0.0.md` | Created | The next changelog entry. Brief d4 |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/completion-claim-audit.md` | Created | One catalog entry, version 4.5.0.0. Brief d5a, fix f1 |
| `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` | Modified | The index block after the compaction recall census entry. Brief d5b |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/completion-claim-audit.md` | Created | Scenario 462 covering the census on synthetic rows and a stub-backend skip. Brief d6a |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md` | Modified | The scenario index row after `\| 461 \|`. Brief d6b |
| `.hermes/skills/system-spec-kit/SKILL.md` | Regenerated | The sync run's copy of `SKILL.md`, 72 copies in sync |
| `scratch/w4-build/`, `scratch/w4-session/` | Created | The build and session records: design, rulings, briefs, logs and evidence, untracked |
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, this file | Modified | This closure pass recorded the evidence and corrected the stale premises |

`1a0fb2ea33` feat(system-spec-kit): audit the completion-claim detector with zero calls holds 24 files: the script, its test, the 13 fixture files, the eight docs and the Hermes copy. Not pushed. The sentinel, both Stop adapters, `.claude/settings.json` and phase 003's fixture and scorer are unchanged, so every turn end behaves as today. The trigger index follows in its own commit.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The planning documents were written and released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. The session wrote every brief in `scratch/w4-build/briefs/`, ran the build through CLI executors and verified each result itself. Code steps c1 to c8 ran on DeepSeek V4.1 Flash through Cline at `--thinking xhigh`; the fix c6f closed step c6's undefined `labeled` before c7 ran. Doc steps d1 to d6b ran on Pi `llmgateway/mimo-v2.6-pro` at `high`, each written from a facts file the session built from its own runs. Parent D5, amended on 2026-09-29, allows only DeepSeek V4.1 Flash or MiMo v2.6 Pro to write, with no Claude leaves.

The build deviated from the design twice, both by orchestrator ruling. Ruling 2 moved the release to `v4.5.0.0` and playbook ID 462, because phase 022 had already used `v4.4.0.0` and 461. Ruling 3 placed the `SKILL.md` sentence as a Quick Reference Commands row after `Alignment suggestion measurement`, because the planned anchor, the completion-evidence sentinel's mention, does not exist in `SKILL.md` (grep, 2026-09-29).

The session then reran the proof plan from the final state, with logging stubs for `cli-deem` and `jev` first on `PATH`. The default run exits 0 and prints `rows: 50 fires: 4`, the per-word line, `margin: 0.10`, the `keep rule:` line, the power line and `stop: fewer than 30 labeled rows`; the stub log was never written. `--deem --out <dir>` against a stub health reporting backend `stub` exits 0 and adds only `deem arm skipped: stub backend`; `--jev --out <dir>` with a stub `auth status` exiting 3 exits 0 and adds only the identity line and `jev arm skipped: no credential`. `--deem` without `--out` exits 2 with `--deem needs --out <dir> so every call is recorded` before any call. `git status --porcelain` was equal before and after, the code SHA-1 `41bff71d04d3...` stayed the set the code review read, and no 40-character slice of any row's text reached stdout.

The suite ran from the final state: `completion-claim-audit.vitest.ts` 23 of 23, and the system-spec-kit root suite went from 108 files and 1,305 tests to 109 files and 1,328 tests with the same list of failing names before and after. The generators stayed fresh: `sync-skills-hermes.cjs --check` `PASS: 72 Hermes skill copies in sync`, `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`, README verdict parity `PARITY PASS`, README manifest `manifest=reproducible`, and `compiled-route-guard.cjs` exit 0; system-spec-kit is not a compiled hub, so no re-mint ran. The catalog package reads `violations=85`, phase 022's baseline, with none in this phase's files, and the playbook package passes with `scenarios=88 violations=0 warnings=1`, one scenario more than the baseline and one pre-existing warning.

Both cross-family reviews are read only, split by author family, with the SHA-1 over each review's files equal before and after. Pi MiMo reviewed the code (857 s) and printed `VERDICT: PASS` with 4 P2. DeepSeek on Cline reviewed the docs (422 s) and printed `VERDICT: FAIL` with 1 P1 and 2 P2: the catalog entry claimed the allowlist checks every string the run prints or writes, while the code checks only the census object once before the first line; and the scripts README tree line said `Zero-call audit` where `--deem` and `--jev` make model calls. Fix f1 corrected the catalog sentence and fix f2 added `by default` to the tree line, each revalidated at exit 0; the recheck (60 s) printed `VERDICT: PASS` with both closed and nothing new at P0 or P1. The three remaining P2 findings are recorded, not chased (parent D5).

The session committed the build as `1a0fb2ea33`, 24 files, not pushed. The trigger index follows in its own commit. This closure pass recorded the evidence in the phase docs and ran the phase gates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The census imports `detectCompletionClaim` | A copied pattern could drift from the one the Stop hook runs, and then the census would measure the wrong regex |
| The model reads the same 400-character tail | The regex sees only that tail, so a model reading more text would win on information rather than judgment |
| Jev needs `--accept-payload` | The rows are the operator's conversation, and phase 003 found secrets its redaction misses. Deem keeps the text on the machine |
| A `keep` serves nothing | R4 has no reader and What Not To Build row 31 drops live judgment, so a result changes behavior only through a later phase |
| Jev first, then Deem, with no failover | Parent D1 and ruling 4: each backend runs only on its own switch and checks, and a failed gate prints its skip line without starting the other backend in its place |
| Close at the label gate | Parent D4 and parent criterion 2: a phase that prints its label-gate stop from the final state is Complete, and only the operator writes labels |
| Fix every P1 and record P2 | Parent D5 as amended on 2026-09-29. The docs review's one P1 and two P2s were closed by f1 and f2, and the three remaining P2 findings are recorded |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

The orchestrator session reran the proof plan from the final state before the commit. The build left no `build-evidence.md`, so `SE` (`scratch/w4-session/session-evidence.md`) and its `notes.md` are the phase's build record, with the measured facts in `scratch/w4-session/docs/facts.txt`.

| Check | Result |
|-------|--------|
| Zero-call census, stubs first on `PATH` | Exit 0 with `rows: 50 fires: 4`, the per-word line, `margin: 0.10`, the `keep rule:` line, the power line and `stop: fewer than 30 labeled rows`; no file written and the stub log never created (`SE` section 2) |
| `--deem --out <dir>` with the stub health reporting backend `stub` | Exit 0, one added line `deem arm skipped: stub backend`, the rest of stdout byte-identical to the census (`SE` section 2) |
| `--jev --out <dir>` with the stub `auth status` exiting 3 | Exit 0, the identity line and `jev arm skipped: no credential`, the rest byte-identical (`SE` section 2) |
| `--jev` without `--accept-payload` | The identity line and `jev arm skipped: payload not accepted`, with the Deem arm still running (`facts.txt`; the `payload gate edge` test) |
| `--deem` without `--out` | Exit 2 with `--deem needs --out <dir> so every call is recorded`, before any call (`SE` section 2) |
| `npx vitest run tests/completion-claim-audit.vitest.ts` | `Tests 23 passed (23)`, exit 0, against REQ-012's floor of 16 (`SE` section 2) |
| system-spec-kit root suite | 109 files and 1,328 tests against 108 files and 1,305 tests before, with the same failing names before and after (`SE` section 2) |
| Secret grep, row text and porcelain | The key grep exits 1, rerun by this closure pass; a 40-character slice of each of the 50 rows found nothing in stdout; `git status --porcelain` equal before and after every run (`SE` section 2; `facts.txt`) |
| `validate_document.py` on the eight changed docs | Exit 0 on each, including the catalog root and the playbook root (`SE` section 2) |
| Generators and packages | `sync-skills-hermes.cjs --check` `PASS: 72 Hermes skill copies in sync`; `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`; README verdict parity `PARITY PASS`; README manifest `manifest=reproducible`; `compiled-route-guard.cjs` exit 0; catalog package `violations=85`, phase 022's baseline, none in this phase's files; playbook `scenarios=88 violations=0 warnings=1` (`SE` section 4) |
| Cross-family review | Pi MiMo on the code `VERDICT: PASS` (857 s, 4 P2); DeepSeek on Cline on the docs `VERDICT: FAIL` (422 s, 1 P1, 2 P2) closed by f1 and f2, recheck `VERDICT: PASS` (60 s); 3 P2 findings recorded. SHA-1 over each review's files equal before and after (`SE` section 3) |
| Build commit | `1a0fb2ea33` feat(system-spec-kit), 24 files, not pushed, confirmed by `git show --stat` at this closure pass (`SE` section 5) |
| Trigger index | Follows in its own commit after the build commit (`SE` section 5) |
| Closure pass: `repair-derived.cjs --folder <this phase> --apply` | `inspected=1 repaired=1 failed=0`, exit 0: `graph-metadata.json` rewritten, `description.json` unchanged; the `_memory` blocks are written by hand and left as recorded |
| Closure pass: `validate.sh <this phase> --strict` | `RESULT: PASSED`, 0 lines matching `RESULT: FAILED`, exit 0 |
| Closure pass: `check-goal.cjs <this phase>` | `RESULT: PASSED (5/5 checks)`, exit 0 |
| Closure pass: `goal.cjs packet <this phase> --workspace "$PWD"` | `packet_durable_chars=3318`, at or under 4000; `packet_budget=unknown` by design for a phase child; exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The labels are the operator's, and everything after them waits.** No claim label exists, so the census prints `stop: fewer than 30 labeled rows` and no arm calls. T016 and T017 wait on at least 30 labeled rows with at least 5 of each class, and parent D4 puts that outside this phase's completion.
2. **A live Deem run needs the labels.** After 30 labeled rows: `node scripts/completion-claim-audit/score-completion-claims.mjs --rows <file> --labels <file> --deem --out <dir>`. No model was called in this build: every run used the logging stubs.
3. **A live Jev run needs the labels and the operator's yes.** T017, plus `jev` 0.6.2, a credential the `auth status` check resolves, and `--accept-payload` when the rows are the operator's conversation. The build never waits for the flag.
4. **Serving is not in this phase.** A `keep` wires nothing: a detector at turn end needs a later phase, a named reader and the operator's call (goal D5).
5. **The power is low.** 30 labeled rows allow a keep only with at least 5 discordant wins and no loss, as the power line prints, and the regex fires on only 4 of today's 50 rows, so false fires can be counted on at most 4 turns.
6. **3 review P2 findings are recorded, not fixed** (parent D5): the free-text guard reads only the census object and cannot fire; `firstClaimWord` matches substrings, so `affixed` counts as `fixed`; and no test runs a label-gate skip or an `arm stopped:` exit.
7. **No `build-evidence.md`.** The build left no `scratch/w4-build/build-evidence.md`, so `SE` and its `notes.md` are the phase's build record, and both reviewers reviewed against the tree and the session's logs.
8. **The 13 fixture files were not in the code review's file list.** They are synthetic one-line texts the tests load, and a key grep over them exits 1 (`SE` section 3).
9. **Premise corrections at close.** `spec.md`'s Status and description now say Complete and commit `1a0fb2ea33`, its changelog cell names `v4.5.0.0.md` in place of the planning-time `v4.3.0.0.md`, its `SKILL.md` row names the Quick Reference Commands row since the planned sentinel mention does not exist, and `plan.md`'s builder roster now states parent D5 as the operator amended it on 2026-09-29, with DeepSeek V4.1 Flash on Cline in Devin's place and no Claude leaves.
10. **`../changelog/` has no directory.** `spec.md`'s Changelog note finds no parent changelog to refresh at close, and this closure pass may write only this folder's docs.
<!-- /ANCHOR:limitations -->

---
