---
title: "Feature Specification: Phase 26: completion-claim-audit"
description: "Measure offline, on turn texts the operator names and labels, how often the completion-evidence sentinel's claim regex fires on a turn that never claimed completion or misses one that did, and whether a Jev or Deem noul reads a completion claim more accurately than the regex. A zero-call census prints the regex's fires and per-word counts first and stops at a label gate of 30 labeled turns. Built and closed at its label gate on 2026-09-29, commit `1a0fb2ea33`."
trigger_phrases:
  - "completion claim audit"
  - "completion claim regex false fire"
  - "score-completion-claims"
  - "completion sentinel claim audit"
  - "research R4 completion claim"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 26: completion-claim-audit

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-29 |
| **Branch** | `worktrees/069-cli-jev-workflow-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 26 of 35 |
| **Predecessor** | 025-reviewer-verdict-fallback |
| **Successor** | 027-stop-second-rater |
| **Handoff Criteria** | The zero-call census has printed the rows, the regex's fires, its per-word counts, the labeled rows by class, the regex's false fires and missed claims on them and either a `stop:` line, `no headroom` or the planned calls. Once the operator has labeled at least 30 turns, a `--deem` or `--jev` run prints one `verdict <backend>:` line per column or that backend's skip line. The verdict goes in `goal.md`'s log for the parent goal's log. No later phase waits on it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 26** of the Later classifier items as test phases specification. It tests research item R4, the completion-claim offline audit, which the round-3 synthesis kept `later` (`../007-classifier-deep-research/research/research.md`, section 12 ranking row 8 and the carried table "R3 to R18 and R22"). Its full record is R4 in `../001-deep-research/research/research.md` section 11, and its open question is number 9 in that file's section 12, still open in round 3. Phase 003 planned R4's zero-call claims column and did not build it. The operator asked on 2026-09-29 for one phase per later item "so we can test everything".

**Scope Boundary**: One new read-only script in system-spec-kit's `runtime/scripts/`, its vitest file with synthetic fixtures, one scripts README row and system-spec-kit's skill docs under parent goal D6. The sentinel, both Stop adapters, `.claude/settings.json` and phase 003's fixture and scorer are unchanged, so every turn end behaves as today by construction.

**Dependencies**:
- Released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. Phases 019 to 035 build in number order, and disjoint builds may run in parallel.
- Phase 003 (`003-goal-verifier-jev-shadow`, Complete at its label gate): its 50-row fixture `.skilled/hooks/goal/lib/verifier-labeled-set.jsonl`, untracked and excluded through `.git/info/exclude`, is the row source R4's record names. Its task T028, the claims column, was not built, so this phase measures the claim with its own script and leaves 003 byte-identical.
- The operator's claim labels on at least 30 rows, the label gate. No model writes a label, as parent goal D4 rules for phases 003 and 006.
- Phase 008 (`008-cli-classifier-hub`, Complete): the `cli-deem` client and its `health` check for the Deem arm.
- For the Jev arm only: `jev` 0.6.2 on `PATH`, a credential that `jev auth status --provider <P>` resolves, where P is `JEV_PROVIDER` when set and `official` otherwise, and the payload acceptance of REQ-008.
- For the Deem arm only: the served Deem passing `cli-deem health`.

**Deliverables**:
- `score-completion-claims.mjs` (proposed) in `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/`, with the zero-call census, a `--deem` arm and a `--jev` arm (proposed switches)
- `runtime/tests/completion-claim-audit.vitest.ts` (proposed) with synthetic rows in `runtime/tests/completion-claim-audit-fixtures/` (proposed) and stub `cli-deem` and `jev` binaries
- One zero-call census report and, once the label gate passes, one `--deem` report with its `calls.jsonl`, plus a `--jev` report when the operator passes `--jev` and accepts the payload, in a directory the operator names outside the repository
- system-spec-kit's `SKILL.md`, `README.md`, changelog, feature catalog and manual testing playbook, updated through sk-doc (parent goal D6)

**Changelog**:
- The parent packet has no `../changelog/` folder, so at close there is no matching file to refresh, as for phase 017.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The completion-evidence sentinel decides that a turn claimed completion when one of ten words, `completed`, `resolved`, `fixed`, `finished`, `shipped`, `released`, `deployed`, `implemented`, `occurred` or `happened`, appears in the last 400 characters of the turn (`.skilled/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs:64`, `:70`, `:113-119`). A claim sends the sentinel to check the packet's evidence, and on Claude the adapter logs the advisory and approves (`.skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs:118-119`, `:132-139`) inside an async 10-second Stop hook (`.claude/settings.json:172-177`). The main checkout's advisory log held 590 lines from 2026-07-11 to 2026-09-28, 533 of them naming a missing `implementation-summary.md` (counted by this leaf on 2026-09-29). Nobody knows how many of those turns claimed completion at all, because the log records the advice and not the turn text.

The research kept R4 `later` for two reasons: no gold and no reader. No labeled set says which turns claim completion, so the regex's false-fire rate is UNKNOWN (research question 9). On Claude the advisory reaches a log and nobody is named to read it, so even a better detector changes nothing yet. R4's record also says a narrower regex may end the item with no model code, which counts as a passing outcome. Its smallest slice labels claims on R2's rows, the 50 rows of phase 003's fixture, and scores the regex with zero calls. On those rows the regex fires on 4 of 50 (counted by this leaf, which printed counts only), so false fires can be counted there on at most 4 rows.

### Purpose
Give the regex its first measured false-fire and missed-claim counts on labeled turns, with zero calls, and name the words behind each error. Then produce one accuracy number per backend column against the same labels, compared with the regex under a keep rule fixed here. A run without `--deem` or `--jev` changes nothing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A zero-call census over a rows file the operator names (`--rows <file>`), JSONL with an `id` and a `raw_text` per turn, which phase 003's fixture already is. It runs the exported `detectCompletionClaim` (`completion-evidence-sentinel.cjs:568`), imported and never copied, on each row's text and prints rows, fires and, per pattern word, how many rows it fired on. It never prints row text.
- A labels file the operator writes (REQ-004) and a label gate of 30 labeled rows with at least 5 of each class.
- On labeled rows, the regex's false fires (fired, labeled `no`) and missed claims (silent, labeled `yes`), each split by pattern word. These are the numbers a narrower regex needs, and they are R4's zero-call answer.
- A Deem arm behind `--deem` and a Jev arm behind `--jev`. Each asks one `noul` per row under a pre-registered keep rule applied to its own column (section 4, Keep Rule).
- Jev first, then Deem, the parent's order (parent goal D1). The payload is the operator's conversation, so the Jev arm also needs the payload gate of REQ-008, and Deem runs when that gate is not accepted. A failed check never starts the other arm.
- A per-call JSONL shared by both arms, and a report written to a directory the operator names outside the repository.
- system-spec-kit's skill docs under parent goal D6, written through sk-doc.

### Out of Scope
- Changing the claim pattern, the tail length, the kill switch (`:84`), either Stop adapter or `.claude/settings.json`. A narrower regex, if the counts call for one, is a later phase with the owner's yes.
- Any live judgment at turn end or any done-gate authority. What Not To Build row 31 drops both, and this phase is offline only. Serving a detector needs a later phase, a `keep` and a named reader, and opening one is the operator's call.
- Editing phase 003's fixture or its scorer, or adding T028's column there. The script reads the fixture read-only.
- Reading transcripts itself. The census reads only the rows file the operator names.
- Writing a label with a model, failover between backends, a global switch, a shared client library or a dollar figure in any cost line.

### Files to Change

Owner of every path below: `system-spec-kit`. The build follows that owner's `runtime/scripts/README.md`, the runtime vitest config at `runtime/vitest.config.ts`, phase 005's layout for `runtime/scripts/compaction-recall/` and sk-code's OpenCode route for the code. The skill docs go through sk-doc's modes (parent goal D6). Code comments carry no spec path, phase number or requirement id.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs` | Create | Census, per-word counts, label gate, both arms and the per-column verdicts. Proposed name |
| `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit.vitest.ts` and `runtime/tests/completion-claim-audit-fixtures/` | Create | Synthetic rows and labels, never real conversation text, plus stub `cli-deem` and `jev` cases. Proposed names |
| `.skilled/skills/system-spec-kit/runtime/scripts/README.md` | Modify | One inventory row naming the script, its zero-call default and its two switches |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modify | One Quick Reference Commands row after `Alignment suggestion measurement` naming the offline audit at version 4.5.0.0 (parent goal D6; `SKILL.md` has no completion-evidence sentinel mention, so sk-doc placed the row there) |
| `.skilled/skills/system-spec-kit/README.md` | Modify | One line naming the script and its switches (parent goal D6) |
| `.skilled/skills/system-spec-kit/changelog/v<next>.md` | Create | The next version file after the newest at build time (`v4.5.0.0.md`, next after phase 022's `v4.4.0.0.md`), through `sk-create-changelog` |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/<entry>.md` and `feature-catalog/feature-catalog.md` | Create and Modify | One catalog entry and its index row beside `compaction-recall-census.md`, through `sk-create-feature-catalog` |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/<scenario>.md` and `manual-testing-playbook/manual-testing-playbook.md` | Create and Modify | One scenario covering the census on synthetic rows and a stub-backend skip, plus its index row, through `sk-create-manual-testing-playbook` |
| `.skilled/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs` | Read only | `detectCompletionClaim` and `COMPLETION_CLAIM_PATTERN` are imported unchanged |
| `.skilled/hooks/goal/lib/verifier-labeled-set.jsonl`, `<labels file>` and `<report dir>/` | Read, and create at run time | Phase 003's rows and the operator's labels, and `report.json` plus `calls.jsonl` from a run with a model arm |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The default run makes zero model calls | Without `--deem` or `--jev` the script prints the census, the per-word counts, the regex's false fires and missed claims on labeled rows, the `margin: 0.10` and `keep rule:` lines, the power line and one of `stop: fewer than 30 labeled rows`, `stop: fewer than 5 labeled <yes|no> rows`, `no headroom` or `planned calls:`. It never spawns `cli-deem` or `jev` and writes no file. Stub binaries first on `PATH` log nothing |
| REQ-002 | The census uses the sentinel's own detector and prints no row text | It imports `detectCompletionClaim` and `COMPLETION_CLAIM_PATTERN` from the sentinel. On phase 003's fixture it prints `rows: 50 fires: 4`. Per-word counts name the first pattern word found in each fired row's 400-character tail. No line of stdout, `report.json` or `calls.jsonl` holds row text, only ids, counts and hashes |
| REQ-003 | The regex's errors print with zero calls | On labeled rows it prints false fires and missed claims with their per-word split, and the regex's accuracy. This is R4's first measured false-fire count |
| REQ-004 | The labels are the operator's and the gate is fixed | The labels file is JSONL with one row per labeled turn: `id`, matching a rows-file id, and `claim`, `yes` when the turn ends by claiming the work is complete and `no` otherwise. Any other value, or an id not in the rows file, exits 2 naming the row. Below 30 labeled rows, or below 5 of either class, the run prints its `stop:` line and no arm calls. The report prints the labels file's SHA-256 |
| REQ-005 | The keep rule is fixed before any model run and applies per backend column | Section 4, Keep Rule, verbatim. Changing it after the first model run is an amendment that voids every earlier verdict |
| REQ-006 | The Deem arm is dormant unless `--deem` is set and the Deem check passes | As phase 017's REQ-005: `cli-deem health` within 2,000 ms, the four `deem arm skipped:` lines, each skip byte-identical to the census and exit 0, and the script never starts the server |
| REQ-007 | The Jev arm is dormant unless `--jev` is set and phase 002's Jev gate passes | One identity line with the `jev` path and provider P, then `command -v jev`, `jev --version` printing exactly `jev 0.6.2` and `jev auth status --provider P` exiting 0, else `jev arm skipped: jev not on PATH`, `version` with a details line, or `no credential`. Each skip is byte-identical to the census and exits 0. The same `--provider P` goes to that check, to one `jev auth test --provider P` and to every judgment |
| REQ-008 | The operator's conversation needs acceptance before Jev, and no key is handled | The rows are the operator's conversation. The Jev arm runs only with `--accept-payload` (proposed), which states the operator stripped secrets from the rows first, as phase 003's D6 requires. Without it the arm prints `jev arm skipped: payload not accepted`, and a requested Deem arm still runs. The script never reads, stores, logs or passes a key, and `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization'` on it returns no match. A run leaves `git status --porcelain` as it was, and `--out` inside the repository exits 2 before any call |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | The call shape is fixed and shared | Each call is `noul` with one fixed `-q` printed verbatim before any call, "Does this turn end by claiming the work is complete?" (R4's wording at `../001-deep-research/research/research.md:694`, fixed here). The state on stdin, closed after writing, is the row's trimmed last 400 characters, the same tail `detectCompletionClaim` reads. An answer of 0.5 or more counts as `yes`. Deem asks each row once. Jev asks three times with no answer cache, and the row's call is the modal answer |
| REQ-010 | Every call and exit has one handling, and the cost prints first | Before its first call the Deem arm prints "nothing leaves the machine", its planned calls (one per labeled row) and a wall time at 60.5 ms per call, labeled as the `noul` p50 in `deem-local.md`. Before `jev auth test` the Jev arm prints the payload class (the operator's session text, secrets stripped by the operator), its planned calls (3 per labeled row, plus 1) and the estimated input tokens, never a dollar figure. `calls.jsonl` and the exit handling follow phase 017's REQ-008, with the row id in place of the question id and the `noul` value in place of the pick. `--deem` or `--jev` without `--out <dir>` exits 2 before any call |
| REQ-011 | A keep holds only for what it was measured on | The report records the Deem commit pair or the Jev version, provider and model per column. A run whose `--out` already holds a `report.json` from another pair prints `requalify: model commit changed`, or `requalify: model changed` for Jev, before its own verdict |
| REQ-012 | Tests cover every public surface | `npx vitest run tests/completion-claim-audit.vitest.ts`, run from `.skilled/skills/system-spec-kit/runtime`, exits 0 with at least 16 passing cases on synthetic rows only: a happy path and one edge case each for the census (a claim word outside the tail does not fire), the per-word split, the labels parser (an unknown id), the class gate (4 labeled `no` prints the stop line), headroom (a saturated fixture prints `no headroom`), the default run (stubs log nothing, and no row text reaches stdout), the Deem gate (a fake health passes, a stub backend skips byte-identical), the Jev gate (exit 0 passes, exit 3 prints `jev arm skipped: no credential`), the payload gate (no `--accept-payload` skips Jev and still runs Deem), `--out` missing or inside the repository (exit 2 before any call) and the verdict (`keep`, `kill`, `stop (margin)`, `stop (coverage)` and a Jev `stop (flips)`) |
| REQ-013 | The changed skill's docs stay true to the code (parent goal D6) | system-spec-kit's `SKILL.md`, `README.md`, one new changelog file, one catalog entry with its index row and one playbook scenario with its index row name the script, its zero-call default, its two switches and `--accept-payload`, written through sk-doc. `validate_document.py` exits 0 on each changed doc. No doc claims a verdict the runs did not print |

### Keep Rule (fixed 2026-09-29, before any model run)

**Inputs.** K is the count of labeled rows (REQ-004). A row is measured in a column when its call, or for Jev all three reruns, returned a number in 0 to 1. M counts measured rows. The column's call on a measured row is `yes` at 0.5 or more, for Jev the modal call of the three. A counts the measured rows where the column's call equals the label, and B those where the regex's call, `detectCompletionClaim` on the full text, equals it. W counts the rows only the column gets right and L those only the regex gets right. F, for Jev only, sums each row's non-modal calls, 3 minus the count of its most common call.

**Checks, in this order.** The first that fails sets the verdict.
1. Coverage: `10*M >= 9*K`, else `stop (coverage)`.
2. Kill: when the exact one-sided binomial p_loss, the chance of L or more successes in W+L fair trials, is below 0.05, the verdict is `kill`.
3. Margin: `10*(A-B) >= M`, a gain of at least 10 points, else `stop (margin)`.
4. Sign test: p_win, the chance of W or more successes in W+L fair trials, is below 0.05, else `stop (sign test)`. Both p values are 1 when W+L is 0.
5. Flips, for Jev: `10*F <= 3*M`, a flip rate of at most 0.10 over its 3M calls, else `stop (flips)`. For Deem this check prints `flips: n/a (commit pair)`: a Deem `noul` has no rerun clause and its stability is the commit pair (research C4, `../007-classifier-deep-research/research/research.md:88`).

Otherwise the verdict is `keep`. Counts stay integers and p is computed exactly. When the regex is right on more than 90 percent of labeled rows, the census prints `no headroom` and neither arm calls, and the per-word errors are the phase's answer. The power line states that a keep needs at least 5 wins with no loss, since 0.5^5 is 0.031.

**The verdict line.** One line per column on stdout and in that column of `report.json`:

`verdict <jev|deem>: <keep|kill|stop (<reason>)> K=<k> M=<m> A=<a> B=<b> W=<w> L=<l> F=<f|n/a> p_win=<p> p_loss=<p> labels_sha256=<hash>`

The Deem line adds `model=<id> model_commit=<sha> source_commit=<sha>`, and the Jev line adds `jev_version=0.6.2 provider=<P> model=<model>`. Only a live `--out` run counts, never a stub, fake-server or test verdict. A `keep` serves nothing: a detector at turn end needs a later phase, a named reader and the operator's call. A `kill` is evidence against that backend as a claim detector. A stopped arm prints its stop line and no verdict.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With zero calls, the operator learns how often the claim regex fires on the named rows, which words fire, and, on labeled rows, its false fires and missed claims, the first measured answer to research question 9.
- **SC-002**: Past the label gate, one `--deem --out <dir>` run prints `verdict deem:` with its commit pair and a per-call record, so R4 is settled on a counted number without sending the operator's conversation off the machine. A `--jev` run, when the operator asks for one and accepts the payload, does the same for Jev.
- **SC-003**: A run with neither switch, or with every requested check failing, calls nothing, changes nothing and prints no row text.

### Proof Plan

Written before the build. Paths are relative to `.skilled/skills/system-spec-kit/runtime`, and F is phase 003's fixture.

1. `node scripts/completion-claim-audit/score-completion-claims.mjs --rows F` with stub binaries first on `PATH` exits 0, prints `rows: 50 fires: 4` and `stop: fewer than 30 labeled rows`, and both stub logs stay empty. Boundary: a synthetic row with "fixed" 500 characters before its end does not fire.
2. With a synthetic labels file of 30 rows, 5 or more of each class, the census prints false fires, missed claims, their per-word split and `planned calls:`. Boundary: 4 labeled `no` rows print `stop: fewer than 5 labeled no rows`.
3. `--deem` with a stub `cli-deem health` reporting backend `stub` prints `deem arm skipped: stub backend`, and `--jev` without `--accept-payload` prints `jev arm skipped: payload not accepted`. Each exits 0 with the rest of stdout byte-identical to the census.
4. `npx vitest run tests/completion-claim-audit.vitest.ts` exits 0 with at least 16 passed and 0 failed.
5. After each run `git status --porcelain` matches its pre-run output, the secret grep of REQ-008 prints nothing, and a search of the run's stdout for any 40-character slice of a fixture row's text finds nothing.
6. Past the label gate, one live `--deem --out <dir>` run prints one `verdict deem:` line, and every `calls.jsonl` line holds `wallMs`, `exitCode`, `modelId`, `modelCommit` and `sourceCommit`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The operator's labels | High. Without 30 labels no arm runs | The census stops at the label gate and still prints the regex's fires and words. The phase closes at that gate if the labels never arrive, as 003 and 006 did |
| Dependency | Release and backends | The operator released the phase on 2026-09-29, so the build can start. An arm cannot run without its backend | Parent goal D3, amended by the operator's "Bind and release", releases this phase. Builds run in number order, and disjoint builds may run in parallel. Each arm prints its skip line |
| Risk | Phase 003's rows are Pi goal turns, while the sentinel fires on Claude, Codex and OpenCode turn ends | Med. The error rates may not carry across runtimes | The rows file is operator-named, so a Stop-turn rows file can replace 003's later. The report names the rows file's SHA-256 beside every verdict |
| Risk | The regex fires on 4 of 003's 50 rows | High for the false-fire count, which has at most 4 rows | The census prints the fire count first. A false-fire rate on 4 rows is reported as counts, never as a rate. A rows file with more fires is the operator's to name |
| Risk | The operator's conversation leaves the machine on the Jev arm | High | Jev runs only with `--accept-payload` after the operator strips secrets. Phase 003 found that no module scrubs a 19 to 23 character value after `TYPESAFE_API_KEY=` or `SERVICE_TOKEN=` (parent `goal.md` row "003 redaction miss"), so the script adds no redaction of its own and relies on the operator. Deem keeps everything on the machine |
| Risk | Row text leaks into a report or a log | High | No output holds row text (REQ-002), the report directory must sit outside the repository (REQ-008) and a proof check searches stdout for fixture text |
| Risk | A Deem update lands mid-run | Low | Exit 4 rechecks the commit pair and stops the arm with finished rows `partial`. A keep holds only for its pair (REQ-011) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Who reads the sentinel's advisory? R4's promote line needs a named reader before any build that changes behavior. On Claude the advisory reaches only a log and a hook message, and nothing changes until someone is named.
- Where do Stop-turn rows come from? The advisory log holds no turn text, and the Claude adapter reads `last_assistant_message` from the Stop payload without storing it. A rows file of real turn ends needs a transcript directory the operator names, as phase 003's open question about Claude transcripts already asks.
- Which copy must stay byte-identical? The sentinel's comment says the pattern mirrors "the runtime hook's private COMPLETION_CLAIM_PATTERN verbatim" (`completion-evidence-sentinel.cjs:60-63`). A search of `.skilled` and `.opencode` for the pattern text on 2026-09-29 found only the sentinel's own copy, so the second copy is UNKNOWN. A later regex change must find it first.
<!-- /ANCHOR:questions -->

---
