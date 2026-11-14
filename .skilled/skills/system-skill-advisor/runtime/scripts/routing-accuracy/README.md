---
title: "system skill advisor runtime scripts routing accuracy: Code README"
description: "Code-facing README for .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy."
trigger_phrases:
  - "system-skill-advisor runtime/scripts/routing-accuracy"
  - "code README"
---

# system skill advisor runtime scripts routing accuracy

Operator and maintenance scripts for this skill.

---

## 1. OVERVIEW

### Purpose

This README documents the code-bearing folder `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy` so operators can understand its role without opening every source file first. It follows the sk-doc skill README structure while staying focused on code navigation.

### Usage

Use this file to identify the folder boundary, the likely verification path and the local source files that need sk-code conventions. Keep behavior details in source comments and higher-level workflow details in the owning `SKILL.md`.

### Key Statistics

| Metric | Value |
|---|---:|
| Code files | 14 |
| README scope | Direct files in this folder |
| Audit context | Internal validation notes |

---

## 2. QUICK START

**Step 1: Confirm the owner.**

Start with `.skilled/skills/system-skill-advisor/SKILL.md` for runtime routing and workflow boundaries.

**Step 2: Inspect the local code.**

```bash
rg --files .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy
```

Expected result: the command lists the source files summarized below.

**Step 3: Verify changes.**

Run individual scripts from the repository root with the documented arguments.

---

## 3. FEATURES

| Feature | What It Does |
|---|---|
| Folder boundary | Documents direct code files under `runtime/scripts/routing-accuracy`. |
| sk-code alignment | Points reviewers at OpenCode naming, header, error-handling and type-discipline checks. |
| Verification handoff | Records the expected owner and audit packet for follow-up work. |

### Attribution on every run line

Each line a behaviour run appends carries four fields beside the locator, exit and changed paths:

- `offeredCommand` is the slash command the advisor head named, or `null` when the head named none.
- `offeredPolicy` is the policy that directly follows that command, one of `run`, `start` or `ask`, or `null` when no policy follows it.
- `offeredAs` says where that command sat in the head: `head`, `partner` when it followed `vs` on an ambiguous head, or `null` when the head named none.
- `briefDelivered` says whether the advisor brief reached the session. It is `true` or `false` where the runtime keeps a readable record, and `unknown` where none exists or cannot be read, so a gap in the record never reads as a miss. A line written when the head moved stops before the offer is read, so it carries none of the four and holds headMoved instead.

The offer is a replay of the Claude prompt hook after the turn instead of a copy of the live session head. The head is the only text that names both the command and the policy, and not every runtime keeps it, so `replayOffer` runs the checkout's own hook and records what that checkout would have offered at the time of the run. A replay that finds no hook, a failing hook or a head without an offer writes null fields plus an `offerError` of `hook_missing`, `hook_failed` or `no_head`, so one bad line never aborts a run.

### Backfill a finished log

`run-command-behaviour.mjs --backfill <run-log> --out <new-log>` adds those four fields to a log written before they existed, and a `--backfill` run without `--out` is a usage error that exits 2. The mode refuses with exit 2 and a JSON body holding its `code`:

- `same_path` when `--out` resolves to the input log, because the backfill writes a new file.
- `holdout_row` or `unknown_row` when the corpus refuses a row id, because every prompt is resolved before the first line is written and a refused row leaves no output file behind.

A line whose locator names no checkout keeps null offer fields and `offerError` `no_checkout`, and the rest of the log is still written with `offerBackfilled: true`.

A line whose checkout is neither this project root nor an arena holding the `skilled-behaviour-arena` marker also keeps null offer fields, with `offerError` `untrusted_checkout`, because a run log is input and the folder it names may hold any code. Nothing from that folder runs, and the rest of the log is still written.

`--brief-only` keeps every offer field exactly as the input line holds it, present or absent, and recomputes only `briefDelivered`, because a recorded offer belongs to the head the turn saw and replaying it would describe a different head. Brief delivery now comes from the session records of Pi, Devin, DSH and Codex, while OpenCode stays `unknown` because its plugin adds the brief in memory and the store keeps no copy.

### The typed attachment block

`capture-command-routing-baseline.mjs` reports typed reach twice under `attachedMetrics`:

- `attachedMetrics.typed` counts `own`, `attached`, `combined` and `total` across the typed rows. `own` is a row the ranked bridge already landed, `attached` is a row the typed command itself delivered, and `combined` is their sum.
- `attachedMetrics.typedRows` keys one record per typed row id in sorted order with `expected_command`, `top`, `carried`, `command` and `policy`. `carried` is `own`, `attached` or null, so a missed row names the command it did carry instead of only lowering a count.

A typed command travels on its owner. It is delivered only when the leading recommendation is that command's owner skill or carries the same command row, so an unrelated leading skill never presents it. A typed command with no scorer row of its own has no other path to the reader, so its owner is ranked first.

### Measure the brief cost

`.skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs` reports what the Claude prompt hook actually sends the model for a typed row.

- Flags: `node measure-brief-cost.mjs [--rows <id,id>] [--root <dir>]` keeps every typed row on the `none` split, `--rows` narrows the run to named corpus ids and `--root` names the checkout the corpus and hook are read from, defaulting to the current directory. A holdout or unknown id exits 2 before anything is spawned, and no prompt is ever printed.
- Output keys: one JSON object holds `rows`, then `liveRows`, `totalBytes`, `medianBytes`, `maxBytes`, `medianHeadBytes` and `maxHeadBytes`. Each entry of `rows` carries `id`, `bytes`, `headBytes`, `estimatedTokens` and `live`, where bytes are the UTF-8 length of `hookSpecificOutput.additionalContext`, headBytes is the UTF-8 length of its first line, live says whether that first line starts `Advisor: live`, and tokens divide the context bytes by four, the renderer's own characters per token. Every byte statistic is taken over live rows only.
- Refusal: a run with no live head prints `{"error":"degraded_brief",...}` and exits 2, which happens when the sandboxed hook cannot reach a live advisor.
- Sandbox: the run makes one `ssa-cost-` directory under the OS temp dir and sets `SPECKIT_IPC_SOCKET_DIR` to it for every hook process, so the operator's warm daemon is never reached. Each hook process also runs without `AI_SESSION_CHILD`, so a run from a dispatched worker measures the brief an operator's own session receives rather than the child form. Each hook child runs with `TMPDIR` set to the sandbox, so a cost run writes no health record into the shared metrics folder. At the end it stops only a process whose command line names that directory and removes it.

### Reading the outcome

- A loaded document is not a followed step, so `loadRate` and `followedRange` say a workflow opened, not that its steps were taken.
- The behaviour rows are tuned rows, so `followedOffered` and `followedNotOffered` describe the corpus the brief was built against, not a fresh one.
- Each row ran once, so one run moves a rate by more than the range around it can settle.
- Two arms differ in more than the brief, so a `--pair` gain or loss is not the brief's effect alone.
- The offer on a stored run of a runtime other than Claude is the Claude hook's replay, recorded when the run was made, so the split by offer says what the Claude head carried for that row.

---

## 4. STRUCTURE

| Path | Purpose |
|---|---|
| `gate3-corpus-runner.mjs` | MJS source file in this folder. |
| `score-routing-corpus.py` | PY source file in this folder. |
| `command-prompts.jsonl` | Prompt corpus with a gold slash command per row, covering every tracked command. |
| `capture-command-routing-baseline.mjs` | Scores `command-prompts.jsonl` under the pinned regime and prints or writes the baseline. Its `attachedMetrics` key holds own-row, attached and combined plain reach per split and per command family, attached false offers, the typed rows where a command and its owner skill read as ambiguous, and the command attached to each published row. An attached hit counts only on a row the ranked bridge did not already land. Its `rows`, `attachedRows` and `typedRows` maps leave out every holdout row, so only holdout counts are published. The optional `--real-embedding` flag scores the same corpus against this machine's own skill graph database and live embedder in place of the fixture vectors and word overlap the default run substitutes, so its numbers describe an environment rather than a reproducible projection. It refuses `--write` because the committed baseline comes only from the fixture regime. Before scoring it proves two things, that a live embedder answers and serves the `nomic-embed-text` model family the stored vectors were built with, and that the skill graph database holds a populated `vec_cmd_*` command vector table. A missing piece exits 2 with a message that names it. Each row in its `rows` output also carries `offered`, which is true when any of the top three recommendations maps to a command bridge, so it measures reach rather than whether a brief head offered the command. Its `attachedMetrics.needs_mode_floor` counts the silent rows whose head would read `(needs a mode)`, and `needsModeRows` lists every row id whose head would, which happens only when the prompt names the hub that tops it. `attachedMetrics.plain_stages` holds one entry per plain split with seven counts, `total`, `own`, `ownerLed`, `routed`, `withCommand`, `attached` and `neither`, where `own`, `ownerLed` and `neither` split the rows and the counted stages nest from `ownerLed` down to `attached`. `attachedMetrics.fit` holds the two fit classes, `skillOnly` and `decline`, each with `carried` and `total`, and `decline` also carries `byKind` for its decline kinds, so a fit row is counted apart from every recall, reach, silence and agreement tally and reaches no row map. A fit row is frozen once captured, and no later edit, replacement or removal is allowed. Three of the eight slash-variant rows that name a command ask a question about it, and a question about a command carries no command by design, so `slash_variant.reached_top3` can reach 5 of 8. |
| `score-command-transcripts.mjs` | Scores captured sessions through the shared session readers. `--summary <run-log> [<run-log>...]` scores every row one or more run logs list, per runtime and arm, and `--runtime <name> --locator '<json>'` scores the one session a locator names. `--row-id <id>` narrows `--summary` to one row and is a usage error with `--runtime`. `--json` prints machine-readable output. `--pair <from>,<to>` compares two arms of one summary run row by row and adds a `paired` block, holding `from`, `to`, `rows`, `gained`, `lost`, `bothFollowed` and `neitherFollowed`, to a runtime that scored both arms, and the text output prints one `paired` line for it. `--pair` without `--summary` exits 2 with `--pair needs --summary`, and one arm name exits 2 with `--pair needs two arm names`. Each per-arm block reports `startRate`, `cappedStartRows`, `offered`, `cappedOfferRows`, `startedOfOffered`, `offerReached`, `deliveryUnknown`, `offerSeen`, `offerDeclined`, `offerFieldAbsent`, `unsafe`, `unsafeNoChangedPath`, `armIncomplete`, `byPolicy` and `workflow`, where `byPolicy` holds a `run`, `start` and `ask` tally of rows, capped rows, started rows and rows that wrote. The `workflow` block sorts each run into `command`, `skill`, `improvised`, `none` or `noOwner` and prints `share` as the runs that loaded the command's or the owning skill's own workflow before their first write, out of every run that acted. It shows a workflow was loaded, not that each step was followed. The block also carries `noneActed`, the `none` runs that read a file or ran a shell step, and `loadRate`, the runs that loaded the command's or the owning skill's workflow out of every scored run with an owner, which is the outcome reading because a run that skipped the workflow and wrote nothing cannot leave its count. The block also holds `asked`, an ask row whose run offered the command and wrote nothing, `askedActed`, the `asked` runs that also worked the task before they asked, `otherMode`, a load of a different mode under the owning hub, and `followedRate`, which is `command + skill + asked` over every owned scored run. `loadRate` has the same denominator, the six path counts, so no owned scored run leaves it. `followedRange` and `loadRange` sit beside those two rates as their Wilson interval at 1.96, rounded to two decimals and clamped to 0 and 1, so a small arm is not read as a precise rate, and both are null when the denominator is zero. `followedOffered` and `followedNotOffered` read the same followed count inside each group the offer puts a run in, and `offerUnknown` counts an owned run whose line holds no offer field, so a gap in the record is never read as no offer. A load is a read tool, a skill tool, a shell command that reads the file or a `prompts/<namespace>-<name>.md` mirror, and a write outside the run's checkout sets no boundary. A Codex shell step arrives as the JavaScript body of an `exec` call, and its command is the `cmd` strings of that body, one per line. A body that holds a gate lookup and a task command reads as a gate step. A search with `rg` or `grep` is not a load, a line inside a heredoc is not a command, and a bare document name is read in the folder an earlier `cd` of the same command entered. A start and a loop the run took are read from the same reads a load is, so a `cat` of the command's document counts and a search, an in-place `sed` or a heredoc line does not. A heredoc's end word may hold a hyphen or a dot. A command that sat on the partner side of an ambiguous head is counted in `offeredAsPartner` and not in `offered`. A run line stored before the writers kept `offeredAs` holds none, so its offer counts as before. The rate counts a workflow opened before the first write, not each step followed, on tuned rows with one run each. `cappedOfferRows` counts offers whose turn hit its cap, `offerReached` counts offers whose brief was not shown missing, so a row whose brief state is unknown counts, `deliveryUnknown` counts every run line whose brief state is `unknown`, scored or not, `offerSeen` and `offerDeclined` read the session's `COMMAND:` lines, and `offerFieldAbsent` counts rows that carry no offer field. `unsafe` also counts a workflow loop that started without its init, `unsafeNoChangedPath` counts the unsafe runs whose run line lists no changed path, apart from a loop without init, and a Claude turn that keeps only the `<command-name>` tag of a typed command counts as a start because Claude Code expands that command before the model sees it. A write to a git-ignored path or one the model reverted itself also leaves no changed path. The text output prints one `policy` line per policy under each arm. Exit 2 means nothing was scored: bad flags, a missing or malformed run log (`run_log_missing`, `run_log_malformed`), or a reader refusal printed with its own code such as `capability_gated` or `locator_unavailable`. |
| `command-offer.mjs` | Recovers the attribution fields for a run line. `parseOffer` reads the command and policy out of one head, `replayOffer` replays a checkout's Claude prompt hook after the turn, `briefDelivered` reads the session record, and `backfillRunLog` writes the fields onto a finished log with a refusal code for a holdout, unknown or same-path input, after `trustedCheckout` confirms each line's checkout is the project root or a marked arena. Each offer carries `offeredAs`, `head` or `partner`. A fallback head such as `Advisor: no skill matched.` counts as a delivered brief with a null offer, and a head quoted inside a tool result does not count. The offer on a stored run of a runtime other than Claude is the Claude hook's replay, recorded when the run was made, and no rescore rewrites it. |
| `run-command-behaviour.mjs` | Runs one live turn per row and records the locator, exit and changed paths. `--print-argv <runtime>` prints a runtime's argv, `--list <set>` prints a set's row ids, and a run takes `--runtime` with `--set` or repeated `--row-id`, `--out <run-log>`, optional `--arm`, `--fixture` and `--dry-run`. Without `--arm`, a selection whose ids are all started-command rows runs under arm `g2`, one that holds none runs under `pre` and a mix is refused with `mixed_row_arms`. Each `g2` run line records the `fixture` folder its prompt named, and `--backfill` replays that folder, or `g2-fixture` beside the log for a line that holds none. `--backfill <run-log> --out <new-log> [--brief-only]` rewrites a finished log with `offeredCommand`, `offeredPolicy`, `offeredAs` and `briefDelivered`, or only `briefDelivered` with `--brief-only`, instead of running a turn, and prints a JSON refusal with `same_path`, `holdout_row` or `unknown_row` when it cannot. After each turn it restores the checkout to HEAD and reports any `leftoverPaths` whose status still differs from the snapshot taken before the turn. Exit 3 (`head_moved`) ends the arm without that restore, because a commit or a stash made during the turn is not the runner's to discard, so the line records `restored: false` and the changed paths stay listed. A live turn gets only the allowlisted environment, the shell basics, the locale and XDG prefixes, each runtime's own prefixes and the Skilled switch prefixes, plus the GitHub and git overrides, so no GitHub token or git credential helper from the operator's shell reaches it. Exit 2 refuses instead of running: bad flags, an unknown runtime or set, a holdout or unknown row, a set with fewer rows than it needs (`set_short`), a dirty worktree outside the run log's folder (`worktree_dirty`), a checkout with a git remote (`remote_present`), a checkout without the arena builder's marker (`arena_unprepared`), a selection that mixes started-command rows with others (`mixed_row_arms`), or a Codex arm whose project hook is unapproved (`codex-hooks-unapproved`). |
| `command-routing-baseline.json` | Captured command routing numbers that `tests/command-routing-slice.vitest.ts` holds the scorer to. |
| `build-holdout.mjs` | Builds the frozen holdout from three separately authored fixtures that are disjoint from the labeled corpus, copying each row's own label and keeping its provenance in `source_type` and `origin_fixture`. Family-normalized dedup keeps the first occurrence and drops any prompt that collides with the training corpus. `--write` rewrites `holdout-prompts.jsonl`. |
| `capture-local-native-divergence-ledger.mjs` | Recomputes the strict Python/native top-1 divergence set the ratchet replays. An existing approval is kept only while its prompt hash and both current tops still match, so the output is a capture of live scoring rather than a hand-edited fixture. Scores both scorers against a skill graph indexed fresh into a temporary directory with the clock pinned to the capture day, and `--write` records the result. |
| `capture-scorer-eval-baseline.mjs` | Captures scorer accuracy across the full corpus, the independent holdout, the frozen ambiguity slice and the named intent buckets under the reproducible filesystem projection, then `--write` records `scorer-eval-baseline.json`. Fixture hashes pin the baseline to the exact corpora it was captured against, so editing a fixture forces a conscious re-capture. `--misses` prints one failing prompt per line. |
| `derive-ambiguity-slice.mjs` | Derives the frozen ambiguity slice as the corpus rows whose top-2 fused-score margin is at or below `tau`, keeping each row's existing gold label, so a regression that only hurts contested prompts still fails a gate. `--write` rewrites `ambiguity-prompts.jsonl`, and the frozen `margin_at_capture` documents why a row is in the slice without being trusted by the gate. |
| `prepare-behaviour-arena.mjs` | Builds the arena a live arm runs in: a clone of the branch tip with no remote and no outer repository, plus the ignored build trees copied in and stamped at copy time so the freshness guard reads them as fresh. It refuses a destination inside a repository or one that already exists, and skips every file whose name begins with `.env` so no secret follows the build output in. |
| `reject-unknown-options.mjs` | Shared argument guard that exits 2 on the first token outside a script's declared option list, because silently ignoring a misspelled flag would run the default behavior and make the no-op look successful. |
| `score-outcome-rerank.mjs` | Measures whether the outcome-weighted rerank improves routing over the similarity-only ordering, reported as MRR and right-skill@3 rather than @1 alone. The reliability fold is built on a train split of the labeled corpus and accuracy is measured only on a disjoint held-out split, so memorized labels do not transfer. Read-only against the skill graph. |
| `worktree-restore.mjs` | Restores one measured turn's checkout to the snapshot taken before it, leaving a path that was already dirty alone and dropping a staged path HEAD does not know. A second snapshot after the restore reports what still differs, so the caller fails the run instead of claiming a clean worktree. |
| `ambiguity-prompts.jsonl` | Frozen ambiguity slice written by `derive-ambiguity-slice.mjs` and read by `capture-scorer-eval-baseline.mjs`. Each row carries `id`, `prompt`, `skill_top_1`, `bucket`, `source_type`, `tau`, `margin_at_capture` and `captured_at`. |
| `doctor-prompts.jsonl` | Doctor routing slice read by `tests/doctor-routing-slice.vitest.ts`. Each row carries `id`, `prompt`, `expected_top`, `expected_second` and `wave`, where a wave scores only after every doctor bridge its rows expect is active, so a half-shipped bridge cannot fail the gate. |
| `holdout-prompts.jsonl` | Frozen holdout first written by `build-holdout.mjs` from three separately authored fixtures disjoint from the labeled corpus, and read by `capture-scorer-eval-baseline.mjs` as its unseen split. The file has been edited by hand since it was sealed, so `build-holdout.mjs --write` would now write a different set of rows. A sealed row is retired by deleting its line and recapturing `scorer-eval-baseline.json`, whose `holdoutSha256` fails the ratchet until that recapture runs. |
| `labeled-prompts.jsonl` | Labeled training corpus with `id`, `prompt`, `skill_top_1`, `skill_correct`, `bucket`, `source_type`, `notes`, `gate3_triggers` and `gate3_reason_category`. Scored by `score-routing-corpus.py`, `score-outcome-rerank.mjs` and `capture-scorer-eval-baseline.mjs`, and read by the divergence ledger, the ambiguity deriver, the holdout builder and the gate 3 corpus runner. |
| `scorer-eval-baseline.json` | Scorer eval baseline written by `capture-scorer-eval-baseline.mjs`: `schemaVersion`, `capturedAt`, `capturedAtSha`, `env`, the fixture hashes and `metrics` for the full corpus, holdout, ambiguity slice, gold-none false fire, intent buckets and unknown count. The ratchet gate re-scores live under the same environment and holds every metric to it. |

---

## 5. CONFIGURATION

| Setting | Default | Purpose |
|---|---|---|
| sk-code surface | OPENCODE | Applies OpenCode TypeScript, JavaScript, Python, Shell and config conventions. |
| README scope | Direct folder | This file documents this folder, not sibling folders. |

---

## 6. USAGE EXAMPLES

**Audit this folder**

```text
User request: Check .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy for sk-code and README coverage.
Skill routing: sk-code plus sk-doc.
Expected output: Findings recorded in the 026 audit report.
```

**Score captured runs**

```bash
node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs \
  --summary scratch/runs-pre.jsonl scratch/runs-post.jsonl --json
```

Exit 2 means no score was produced. A missing or malformed log prints `run_log_missing` or `run_log_malformed`, and a session the reader cannot open prints its own code, such as `capability_gated`.

**Inspect and run one behaviour turn**

```bash
node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs --print-argv claude
node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs \
  --runtime claude --set chat --out scratch/runs-pre.jsonl --dry-run
```

Exit 2 means the run was refused before or during its first prompt: bad flags, an unknown runtime or set, a holdout row, a dirty worktree outside the run log's folder, or a checkout that still has a git remote.

**Backfill a finished log**

```bash
node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs \
  --backfill scratch/runs-pre.jsonl --out scratch/runs-pre-attributed.jsonl
```

The output log holds the same lines plus `offeredCommand`, `offeredPolicy`, `offeredAs`, `offerError`, `briefDelivered` and `offerBackfilled`. Exit 2 means the output was refused, and the printed JSON names why: `same_path`, `holdout_row`, `unknown_row` or a missing `--out`.

---

## 7. TROUBLESHOOTING

| What You See | Cause | Fix |
|---|---|---|
| README appears stale | Source files changed after this audit | Refresh the structure table and rerun the 026 audit check. |
| Verification command is unclear | Folder is a helper boundary | Use the nearest package or skill-level verification command. |

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`system-skill-advisor/SKILL.md`](../../../SKILL.md) | Runtime instructions for the owning skill. |
| [`sk-code/SKILL.md`](../../../../sk-code/SKILL.md) | OpenCode coding standards and verification routing. |
| [`sk-doc skill-readme-template.md`](../../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md) | README structure used for this code README. |
