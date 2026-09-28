---
title: "Implementation Summary: Goal Verifier Pi Census, Zero-Call Arms and Opt-In Jev Shadow Mode"
description: "Complete at the operator's label gate. The Pi census, the fixture builder and the zero-call scorer are built and committed as 1da5b193d2. The census counted 1,822 nudges in 41 session files, and the builder wrote 50 unlabeled Pi rows. The scorer prints stop: fewer than 30 rows until the operator labels at least 30 of them. No model arm, no --jev or --deem flag and no plugin change exist."
trigger_phrases:
  - "goal verifier jev summary"
  - "jev shadow mode status"
  - "labeled set scorer status"
  - "pi goal nudge census status"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/003-goal-verifier-jev-shadow"
    last_updated_at: "2026-09-28T21:30:00Z"
    last_updated_by: "closure-leaf"
    recent_action: "Closed the phase at the label gate: 7 of 7 goal criteria ticked, build commit 1da5b193d2"
    next_safe_action: "Orchestrator commits the phase docs. The operator labels at least 30 of the 50 fixture rows"
    blockers: []
    key_files:
      - ".skilled/hooks/goal/lib/count-pi-goal-nudges.mjs"
      - ".skilled/hooks/goal/lib/build-verifier-fixture.cjs"
      - ".skilled/hooks/goal/lib/score-verifier-labeled-set.cjs"
      - "specs/cli-jev/003-cli-jev-workflow-integration/003-goal-verifier-jev-shadow/scratch/w3-build/build-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "How many of the 431 truncated nudges are clamp artifacts?"
      - "Why do 12 of the 50 rows not reproduce their recorded verdict and reason?"
      - "Can the provider and model be read per call from a choice answer's JSON?"
      - "Is the labeled set committed?"
      - "Which option-order scheme does REQ-006 fix for a Deem choice?"
      - "Does parent D4 let a Claude row's native goal_status pre-label stand?"
      - "Which Claude transcript directory does the builder read?"
    answered_questions:
      - "The census and the builder's Pi rows read ~/.pi/agent/sessions (parent D4, 2026-09-28)"
      - "The npm jevctl prints a bare 0.2.3 for --version, so the gate refuses it"
      - "1,457 nudges in 28 sessions and 1,616 matches in 37 files are both subsets of 1,822 nudges in 41 files and differ by scope, not window"
      - "No recorded nudge is dated after 2026-08-10, so none follows the 2026-09-27 delivery change"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Goal Verifier Pi Census, Zero-Call Arms and Opt-In Jev Shadow Mode

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-goal-verifier-jev-shadow |
| **Status** | Complete |
| **Completed** | 2026-09-28, at the operator's label gate (parent D4) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now count how often Pi's hidden goal verdict fired, and the tools that measure the goal heuristic's error rates are ready for your labels. The phase stops at your label gate, so no model arm, no `--jev` or `--deem` flag and no plugin change exist.

### Phase 3: goal-verifier-jev-shadow

**The Pi census.** `count-pi-goal-nudges.mjs --dir <path>` walks a Pi session directory and counts `goal-verify-nudge` records per session file. It splits them by verdict and by the five reason categories and gives each file's first and last date. Its first line states the counting method. It prints no message text, and an unknown record type or a line that does not parse stops it with a named error and a non-zero exit. The run on `~/.pi/agent/sessions` printed these first and last lines:

```text
method: unit=one custom_message record with customType goal-verify-nudge, files_scanned=5919, window=2026-07-29..2026-08-10 from the record timestamp field
totals: sessions_with_nudges=41 nudges=1822 not-met=407 unclear=1415 other_verdict=0 met=not_recorded too_short=243 blocking=407 truncated=431 no_completion=621 weak_link=120 other=0 first=2026-07-29 last=2026-08-10
```

**Census reconciliation (T026).** The two earlier figures are both subsets of the 1,822, split by project directory:

| Scope | Files | Nudges | Dates |
|-------|-------|--------|-------|
| This repository's directory, top level | 27 | 1,452 | 2026-07-29 to 2026-08-10 |
| The same directory, nested subfolders | 10 | 164 | 2026-08-10 |
| One directory of a worktree of this repository | 1 | 5 | 2026-08-08 |
| One other project's directory | 3 | 201 | 2026-08-10 |
| Whole `~/.pi/agent/sessions` | 41 | 1,822 | 2026-07-29 to 2026-08-10 |

The figures differ by scope, not by unit or window. The raw count of 1,616 matches in 37 files is this repository's directory with its nested files, 1,452 + 164. The final synthesis's 1,457 nudges in 28 sessions are its 27 top-level files plus the one worktree file, 1,452 + 5, without the nested files. Every recorded nudge is dated 2026-07-29 to 2026-08-10, so none follows the 2026-09-27 delivery change, and no nudge was recorded after 2026-08-10. Pi records no `met` turn, so no rate from the census has a denominator.

**The fixture builder.** `build-verifier-fixture.cjs` writes one JSONL row per recorded Pi nudge or native Claude `goal_status` record, with the turn text behind it. Each row holds `id`, `source`, `objective`, `raw_text`, `ingested_text`, `raw_length`, `heuristic_recorded`, `recorded_reason`, `prelabel` and `label`. Pi rows are dealt round-robin across the reason categories. A Claude row keeps Claude Code's native verdict in `prelabel`, because that judge is a model and parent D4 lets no model write a label. Every `label` stays empty. The builder writes with mode `0600` and refuses to overwrite an existing file.

**The unlabeled rows (T034).** One run at the label gate on `~/.pi/agent/sessions`. No Claude transcript directory was named, so the run wrote Pi rows only:

| Measure | Value |
|---------|-------|
| Rows | 50: Pi 50, Claude 0 |
| Candidates plus skips | 1,257 + 144 + 421 = 1,822, equal to the census total |
| Rows per recorded reason | 10 each for too_short, blocking, truncated, no_completion and weak_link |
| Rows longer than 1,200 characters | 20 |
| Empty `label` and empty `prelabel` | 50 of 50 each |
| Rows whose recorded verdict and reason goal-core reproduces | 38 of 50 |
| File | `.skilled/hooks/goal/lib/verifier-labeled-set.jsonl`, mode `-rw-------`, 261,233 bytes, sha256 `25f40db4...66f4f` |
| Git state | Untracked, in no commit and listed in the local `.git/info/exclude` |

**The scorer.** `score-verifier-labeled-set.cjs --set <file> [--out <dir>]` loads a row file, maps goal-core's `not-met` to `not_met` and keeps `unclear` on its own row. Under 30 labeled rows it prints `stop: fewer than 30 rows`. Otherwise it runs three zero-call arms on identical rows: the plugin heuristic through the plugin's `__test` helpers on the ingested text, the same heuristic on the raw last 1,200 characters and goal-core parity. It then prints a confusion table per arm, the false `not_met` rows by heuristic check, the clamp-defect count and the wrapper count. Last comes one decision: `stop: no headroom` with the clamp-fix finding, `stop: no reachable rows` or three `gate:` lines. It spawns no model binary, and `--jev` and `--deem` exit 2 as unknown flags. On the unlabeled fixture it prints `scorer: rows=50 labeled=0 unlabeled=50 claude=0 pi=50` and `stop: fewer than 30 rows` with exit 0. In this worktree it needs `node --preserve-symlinks`, because it loads the plugin through the `.skilled/plugins` link and `.opencode/node_modules` is absent.

**The READMEs.** The goal hooks README lists the three scripts and their tests in its tree, key files and validation command, and gives a census command with its expected output. Its Imports row now says the scorer imports the plugin. The hub README's `goal/` tree lists the three scripts.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/goal/lib/count-pi-goal-nudges.mjs` | Created | The Pi census, 235 lines. Briefs 01 and 01b |
| `.skilled/hooks/goal/lib/count-pi-goal-nudges.test.mjs` | Created | 3 tests, 143 lines. Briefs 01 and 01b |
| `.skilled/hooks/goal/lib/build-verifier-fixture.cjs` | Created | The row builder, 447 lines. Briefs 02 and 03 |
| `.skilled/hooks/goal/lib/build-verifier-fixture.test.cjs` | Created | 5 tests, 205 lines. Briefs 02 and 03 |
| `.skilled/hooks/goal/lib/score-verifier-labeled-set.cjs` | Created | The zero-call scorer, 475 lines. Briefs 04, 05, 06, 07 and 07b |
| `.skilled/hooks/goal/lib/score-verifier-labeled-set.test.cjs` | Created | 12 tests, 312 lines. The same briefs |
| `.skilled/hooks/goal/README.md` | Modified | Five edits, +24/-5. Brief 08 |
| `.skilled/hooks/README.md` | Modified | Three tree lines, +3. Brief 09 |
| `.skilled/hooks/goal/lib/verifier-labeled-set.jsonl` | Created, untracked | The 50 unlabeled rows for you to label. Never committed |
| `scratch/w3-build/` | Created | The build record: `build-evidence.md`, 11 briefs, 8 baseline outputs and 22 dispatch status and handback files. The executor `.log` streams stay local |
| `spec.md`, `plan.md`, `tasks.md`, `goal.md` and this file | Modified | The closure pass recorded the evidence and corrected the stale premises |

`1da5b193d2` holds 50 paths: the eight outside this folder above and 42 under `scratch/w3-build/` (`git show --name-only 1da5b193d2`). `.opencode/plugins/opencode-goal.js`, `goal-core.cjs` and `secret-scrubber.ts` are unchanged.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The documents were written on 2026-09-26 from research R2, amended twice on 2026-09-27 and amended again on 2026-09-28 for the wave 3 directive, which stops the phase at your label gate. `goal.md`'s log lists each change.

The operator released the phase on 2026-09-28 (parent `goal.md` D3). After the operator's "Do fast fix" decision it was built in parallel with 017 and 006 on disjoint paths. A build orchestrator, Opus 5.5 at xhigh, captured the baselines at HEAD `996cf85eef` and wrote 11 single-change briefs into `scratch/w3-build/briefs/`, each under 90 lines with an accept line. It ran them one at a time by Bash on the roster the operator set that evening. Devin on `deepseek-v4-1-flash-max` built the census, the Pi half of the builder and the scorer's loader, arms and command line (briefs 01, 02, 04 and 06). Pi on `llmgateway/mimo-v2.6-pro` at `--thinking high` built the Claude half of the builder, the report and stop lines and both README edits (briefs 03, 05, 07, 08 and 09). It also ran two follow-ups the orchestrator's review found: 01b restored the method line's timestamp field, which REQ-013 requires, and 07b rewrote two file headers that brief 06 had made stale. No brief failed or was retried. After every dispatch the orchestrator read the handback, diffed the tree and ran the brief's own check and test. It ran the census and the builder itself, because their output is evidence.

The orchestrator session reran the gates from the final state and probed the fixture for leaks. A Claude `review` agent, a different family from the DeepSeek and MiMo writers, passed the code with no P0 or P1. Its 11 P2 findings are recorded, not fixed, under parent D5. The session listed the fixture in the local `.git/info/exclude` and committed the build as `1da5b193d2` without it. It deferred the trigger index rebuild until 005 and 006 are committed. This closure pass recorded that evidence in the phase docs and ran the phase gates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The scorer drives the plugin's own `maybeVerifyGoal` through `__test` | The heuristic function is not exported, and this measures the real verifier with no plugin edit |
| The wrapper rule holds rows the heuristic stopped at its length or blocking check | Those checks run first, so every blocking-pattern match is held without copying a regex that neither module exports |
| The Pi census comes first | Pi already records the verifier's verdicts, so the first slice measures a channel in real use with no label and no key |
| The phase stops at the label gate | Your answer to the parent's D4: no model writes a label, and the build delivers everything up to the point where you label |
| A Claude row's native verdict goes to `prelabel`, never to `label` | Claude Code's native goal judge is a model, and parent D4 lets no model write a label |
| The fixture stays out of every commit | It holds your own conversation text, and this repository is public (REQ-012). The session also listed it in the local `.git/info/exclude` |
| Stub binaries instead of a fake Deem server in the scorer test | No Deem arm exists at the gate, so stubs that log no call are the zero-call proof |
| The builder got its own test | Only a test proves that it refuses to overwrite and writes mode `0600`, and the coverage floor needs one |
| Record the review's P2s and fix none | Parent D5 as the operator amended it on 2026-09-28: fix P0 and P1, record P2 |
| The clamp fix and the redaction fixes go to their owners | This phase measures the defects and reports them. It edits neither the clamp nor any redaction rule (D8) |
| Criteria 4 to 7 amended at close | Each named work past the gate, or a `git status` that the commit made unreadable. Each now states what holds at the gate, and `goal.md`'s log gives each reason |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

The build orchestrator ran the build checks on 2026-09-28, and the orchestrator session reran the gates from the final state. `E` is `scratch/w3-build/build-evidence.md`.

| Check | Result |
|-------|--------|
| Build baseline, HEAD `996cf85eef`: goal hooks suite, the six files in the goal README section 8 | Tests 146, pass 146, fail 0, exit 0 (`E` section 1) |
| Build baseline: plugin goal suites with `goal-doc-contract.test.cjs` | Plain Node: 143 tests, 8 pass, 135 fail, each `ERR_MODULE_NOT_FOUND`, exit 1. With `--preserve-symlinks --preserve-symlinks-main`: 142 pass, 1 fail, exit 1 |
| Build baseline: `validate_document.py` on both READMEs, `validate.sh --strict`, `check-goal.cjs`, `verify_alignment_drift.py --root .skilled/hooks/goal` | `VALID` 0 issues each, `RESULT: PASSED` with 0 errors and 0 warnings, `RESULT: PASSED (5/5 checks)`, 13 files 0 findings, exit 0 each |
| Build: census on `~/.pi/agent/sessions`, 300 s alarm | Exit 0 in 7 s, 43 stdout lines, empty stderr. Every line matches one of the three fixed shapes, and `grep -c -E "goal_verify\|Evidence\|reason=\|\[active_goal"` finds 0 (`E` section 3) |
| Build: builder on `~/.pi/agent/sessions` | Exit 0 in 10 s, empty stderr, `built: rows=50 pi=50 claude=0 candidates_pi=1257 candidates_claude=0 skipped_pi_no_turn=144 skipped_pi_no_objective=421 skipped_claude=0 pi_recorded_reproduced=38` (`E` section 4) |
| Build: goal hooks suite, final, nine files | Tests 166, pass 166, fail 0, exit 0. Delta +20: census 3, builder 5, scorer 12 (`E` section 6) |
| Build: plugin goal suites, final | Plain 8 pass and 135 fail, with the flags 142 pass and 1 fail. Delta 0 on both |
| Build: scorer on the unlabeled fixture | `scorer: rows=50 labeled=0 unlabeled=50 claude=0 pi=50`, `stop: fewer than 30 rows`, empty stderr, no row text, exit 0 |
| Build: scorer on a synthetic 30-row set | 3 arms, 4 table rows each with `unclear` on its own row, `clamp_defects: 1`, `wrapper: held=1`, `better: arm=tail_window false_met=0 false_not_met_rate=0.00`, `stop: no headroom` and the clamp-fix finding, exit 0 |
| Build: model-arm grep on the scorer | 2 matches, both text: the header sentence "It spawns no model binary" and the `gate: deem arm condition holds` output line. 0 call sites |
| Build: scorer with `--jev`, then `--deem` | `error: unknown flag --jev` and `error: unknown flag --deem`, empty stdout, exit 2 each |
| Build: `git diff --quiet` on `opencode-goal.js`, then on `goal-core.cjs` and `secret-scrubber.ts` | No diff, exit 0 each |
| Build: scorer without the symlink flag | `error: cannot load the goal plugin at <path>: ERR_MODULE_NOT_FOUND. Where .opencode/node_modules is absent, run node with --preserve-symlinks`, exit 2 |
| Build: alignment drift, tracked files, then a copy of the six new code files | 13 files 0 findings, then 6 files 0 findings with and without `--check-exact-headers`, exit 0 each |
| Build: `node --check`, comment-hygiene grep and em-dash count on the six new files | Clean, no match, 0 em dashes |
| Build: the real goal state directory before and after the scorer runs | 1 file, its README, both times. No `goal-verifier-score-` temp directory left |
| Session: goal hooks suite from the final state | `tests 166, pass 166, fail 0`, exit 0 |
| Session: `validate_document.py` on both READMEs | `VALID`, 0 issues, exit 0 each |
| Session: `node --check` and the key and secret grep on the three scripts | Exit 0 each, then no match (grep exit 1). The comment-hygiene grep finds no match |
| Session: scorer flags | No flag exits 2 with `error: --set <file> is required`. `--set <fixture>` prints the stop line with exit 0. `--jev` and `--deem` exit 2 each |
| Session: fixture leak probe | 167 snippets of 40 characters from the fixture's text, searched over the 6 code files, 2 READMEs and this folder. The positive control matched all 50 rows. The only hit in any candidate file is a run of box-drawing characters from a code banner, and `scratch/` has no hit |
| Review (Claude `review` agent, code by DeepSeek via Devin and MiMo via Pi) | PASS, no P0 and no P1. The reviewer ran the three test files: 3 of 3, 5 of 5 and 12 of 12. REQ-013, REQ-001 at the gate, REQ-002, REQ-003, REQ-005, REQ-008 and REQ-012 met. REQ-004, REQ-006, REQ-007, REQ-009, REQ-010, REQ-011 and REQ-014 are past the gate, and REQ-015 was not built. 11 P2 findings recorded |
| Closure pass: `git grep` for the five new names at `996cf85eef` under `.skilled/hooks/goal/`, then at HEAD | No match (exit 1), then 6 files (exit 0) |
| Closure pass: `rg` for `VALID_VERIFIER_MODES` and `OPENCODE_GOAL_VERIFIER`, `realpath .skilled/plugins/opencode-goal.js` | The mode set is read only at `opencode-goal.js:134` and `:228`. The variable appears only in files `spec.md` already names. The link resolves to `.opencode/plugins/opencode-goal.js` |
| Closure pass: `git show --name-only 1da5b193d2`, `git diff --quiet 996cf85eef HEAD -- .opencode/plugins/opencode-goal.js`, `git ls-files --error-unmatch` on the fixture | 8 paths outside this folder, all REQ-012 files, plus 42 under `scratch/w3-build/`, 0 fixture matches. The plugin diff is empty, exit 0. The fixture is untracked, exit 1 |
| Closure pass: file writes in the scorer | One, `zero-call-report.txt` under `--out` at `score-verifier-labeled-set.cjs:464` |
| Closure pass: `repair-derived.cjs --folder <this phase> --apply` | `inspected=1 repaired=1 failed=0`, exit 0, re-deriving the graph metadata after the doc edits. Rerun after this table was filled in |
| Closure pass: `validate.sh <this phase> --strict` | `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED`, exit 0, 0 `RESULT: FAILED` lines. `STATUS_CROSS_DOC_CONSISTENCY` passed with both docs `Complete`, and `AC_COVERAGE` is not active at Level 1. Rerun after this table was filled in |
| Closure pass: `check-goal.cjs <this phase>` | `RESULT: PASSED (5/5 checks)`, exit 0 |
| Closure pass: `goal.cjs packet <this phase> --workspace "$PWD"` | Exit 0, `STATUS=OK`, `packet_budget=unknown` and `packet_durable_chars=8867`, as expected for a phase child |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The labels are yours, and everything after them waits.** Label at least 30 of the 50 rows in `.skilled/hooks/goal/lib/verifier-labeled-set.jsonl` as `met`, `not_met` or `blocked`, strip any secret and decide whether the file is ever committed. The 16 `[B]` tasks wait for that: T001 and T011 on your labels, T029, T030, T008, T009, T032, T033, T012 and T019 past the gate and T013 to T016, T020 and T036 only on a keep. Parent D4 puts all of them outside this phase's completion.
2. **Two questions for after the gate are open.** Whether a Claude row's native pre-label may stand under parent D4, and which Claude transcript directory the builder reads. Until you name one, the fixture holds Pi rows only.
3. **The redaction miss is recorded, not fixed.** A value of 19 to 23 characters after `TYPESAFE_API_KEY=` or `SERVICE_TOKEN=` survives `goal-core.cjs`, the plugin and `secret-scrubber.ts`, confirmed on synthetic strings. It goes to the goal hooks, plugin and system-spec-kit owners, and any Jev arm waits for all three cases to pass.
4. **12 of the 50 rows do not reproduce their recorded verdict and reason.** Two causes are suspected, neither confirmed: Pi judged against the goal record's full objective while the builder recovers only the brief's `objective:` line, and `objectiveFrom` reads every message role (review P2 1). Checking either needs the goal records or the fixture, which this build did not read.
5. **11 review P2 findings are open.** The builder reads objectives from every role, prints a raw stack for a missing `--pi` directory and writes an empty file when no nudge qualifies. Its `ingested_text` uses goal-core's redaction, which lacks the plugin's AIza, xox, AKIA and 48-character rules. The scorer has no test of `main`'s exit 1 on an invalid label, prints `stop: no headroom` on a set with no `met` label, writes `--out` outside any try and enforces no 50-row ceiling. The census aborts on a partial trailing line and has no `MALFORMED_RECORD` or `DIR_NOT_FOUND` test. The README shows the scorer's flags only in error text. The eleventh, the fixture's missing ignore, the session fixed in the local `.git/info/exclude`.
6. **This worktree has no `.opencode/node_modules`.** The plugin goal suites fail to load under plain Node here, and the scorer needs `--preserve-symlinks`. Installing the modules would be an install (parent D7), so nobody did.
7. **Two planned pieces were not built.** T028's optional claims column (REQ-015) and the census `--from` and `--to` window. The census reads every date.
8. **Pi records no `met` turn.** It sends a nudge only on a verdict other than `met`, so every rate from the census alone has an UNKNOWN denominator.
9. **Pi's records changed on 2026-09-27.** Since `e7c88670fb` a nudge reaches the session file only with the next user prompt. No recorded nudge is dated after 2026-08-10, so the census has not yet seen that change.
10. **Two steps are left to others.** The session deferred the trigger index rebuild until 005 and 006 are committed. `spec.md` asks for a refresh of `../changelog/` at close, but the parent folder has no `changelog/` directory and this closure pass may write only this folder's docs.
<!-- /ANCHOR:limitations -->

---
