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
| Code files | 9 |
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

Each line a behaviour run appends carries three fields beside the locator, exit and changed paths:

- `offeredCommand` is the slash command the advisor head named, or `null` when the head named none.
- `offeredPolicy` is the policy that directly follows that command, one of `run`, `start` or `ask`, or `null` when no policy follows it.
- `briefDelivered` says whether the advisor brief reached the session. It is `true` or `false` where the runtime keeps a readable record, and `unknown` where none exists or cannot be read, so a gap in the record never reads as a miss.

The offer is a replay of the Claude prompt hook after the turn instead of a copy of the live session head. The head is the only text that names both the command and the policy, and not every runtime keeps it, so `replayOffer` runs the checkout's own hook and records what that checkout would have offered at the time of the run. A replay that finds no hook, a failing hook or a head without an offer writes null fields plus an `offerError` of `hook_missing`, `hook_failed` or `no_head`, so one bad line never aborts a run.

### Backfill a finished log

`run-command-behaviour.mjs --backfill <run-log> --out <new-log>` adds those three fields to a log written before they existed, and a `--backfill` run without `--out` is a usage error that exits 2. The mode refuses with exit 2 and a JSON body holding its `code`:

- `same_path` when `--out` resolves to the input log, because the backfill writes a new file.
- `holdout_row` or `unknown_row` when the corpus refuses a row id, because every prompt is resolved before the first line is written and a refused row leaves no output file behind.

A line whose locator names no checkout keeps null offer fields and `offerError` `no_checkout`, and the rest of the log is still written with `offerBackfilled: true`.

`--brief-only` keeps every offer field exactly as the input line holds it, present or absent, and recomputes only `briefDelivered`, because a recorded offer belongs to the head the turn saw and replaying it would describe a different head. Brief delivery now comes from the session records of Pi, Devin, DSH and Codex, while OpenCode stays `unknown` because its plugin adds the brief in memory and the store keeps no copy.

### The typed attachment block

`capture-command-routing-baseline.mjs` reports typed reach twice under `attachedMetrics`:

- `attachedMetrics.typed` counts `own`, `attached`, `combined` and `total` across the typed rows. `own` is a row the ranked bridge already landed, `attached` is a row the typed command itself delivered, and `combined` is their sum.
- `attachedMetrics.typedRows` keys one record per typed row id in sorted order with `expected_command`, `top`, `carried`, `command` and `policy`. `carried` is `own`, `attached` or null, so a missed row names the command it did carry instead of only lowering a count.

A typed command travels on its owner. It is delivered only when the leading recommendation is that command's owner skill or carries the same command row, so an unrelated leading skill never presents it. A typed command with no scorer row of its own has no other path to the reader, so its owner is ranked first.

### Measure the brief cost

`.skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs` reports what the Claude prompt hook actually sends the model for a typed row.

- Flags: `node measure-brief-cost.mjs [--rows <id,id>] [--root <dir>]` keeps every typed row on the `none` split, `--rows` narrows the run to named corpus ids and `--root` names the checkout the corpus and hook are read from, defaulting to the current directory. A holdout or unknown id exits 2 before anything is spawned, and no prompt is ever printed.
- Output keys: one JSON object holds `rows`, then `totalBytes`, `medianBytes` and `maxBytes`. Each entry of `rows` carries `id`, `bytes` and `estimatedTokens`, where bytes are the UTF-8 length of `hookSpecificOutput.additionalContext` and tokens divide that by four, the renderer's own characters per token.
- Sandbox: the run makes one `ssa-cost-` directory under the OS temp dir and sets `SPECKIT_IPC_SOCKET_DIR` to it for every hook process, so the operator's warm daemon is never reached. At the end it stops only a process whose command line names that directory and removes it.

---

## 4. STRUCTURE

| Path | Purpose |
|---|---|
| `gate3-corpus-runner.mjs` | MJS source file in this folder. |
| `score-routing-corpus.py` | PY source file in this folder. |
| `command-prompts.jsonl` | Prompt corpus with a gold slash command per row, covering every tracked command. |
| `capture-command-routing-baseline.mjs` | Scores `command-prompts.jsonl` under the pinned regime and prints or writes the baseline. Its `attachedMetrics` key holds own-row, attached and combined plain reach per split and per command family, attached false offers, the typed rows where a command and its owner skill read as ambiguous, and the command attached to each row. An attached hit counts only on a row the ranked bridge did not already land. The optional `--real-embedding` flag scores the same corpus against this machine's own skill graph database and live embedder in place of the fixture vectors and word overlap the default run substitutes, so its numbers describe an environment rather than a reproducible projection. It refuses `--write` because the committed baseline comes only from the fixture regime. Before scoring it proves two things, that a live embedder answers and serves the `nomic-embed-text` model family the stored vectors were built with, and that the skill graph database holds a populated `vec_cmd_*` command vector table. A missing piece exits 2 with a message that names it. Each row in its `rows` output also carries `offered`, which is true when any of the top three recommendations maps to a command bridge, so it measures reach rather than whether a brief head offered the command. |
| `score-command-transcripts.mjs` | Scores captured sessions through the shared session readers. `--summary <run-log> [<run-log>...]` scores every row one or more run logs list, per runtime and arm, and `--runtime <name> --locator '<json>'` scores the one session a locator names. `--row-id <id>` narrows either mode to one row and `--json` prints machine-readable output. Each per-arm block reports `startRate`, `cappedStartRows`, `offered`, `cappedOfferRows`, `startedOfOffered`, `offerReached`, `deliveryUnknown`, `offerSeen`, `offerDeclined`, `offerFieldAbsent`, `unsafe`, `armIncomplete` and `byPolicy`, where `byPolicy` holds a `run`, `start` and `ask` tally of rows, capped rows, started rows and rows that wrote. `cappedOfferRows` counts offers whose turn hit its cap, `offerReached` counts offers on a turn whose brief arrived, `deliveryUnknown` counts rows whose brief state is `unknown`, `offerSeen` and `offerDeclined` read the session's `COMMAND:` lines, and `offerFieldAbsent` counts rows that carry no offer field. `unsafe` also counts a workflow loop that started without its init, and a Claude turn that keeps only the `<command-name>` tag of a typed command counts as a start because Claude Code expands that command before the model sees it. The text output prints one `policy` line per policy under each arm. Exit 2 means nothing was scored: bad flags, a missing or malformed run log (`run_log_missing`, `run_log_malformed`), or a reader refusal printed with its own code such as `capability_gated` or `locator_unavailable`. |
| `command-offer.mjs` | Recovers the attribution fields for a run line. `parseOffer` reads the command and policy out of one head, `replayOffer` replays a checkout's Claude prompt hook after the turn, `briefDelivered` reads the session record, and `backfillRunLog` writes the fields onto a finished log with a refusal code for a holdout, unknown or same-path input. |
| `run-command-behaviour.mjs` | Runs one live turn per row and records the locator, exit and changed paths. `--print-argv <runtime>` prints a runtime's argv, `--list <set>` prints a set's row ids, and a run takes `--runtime` with `--set` or repeated `--row-id`, `--out <run-log>`, optional `--arm`, `--fixture` and `--dry-run`. `--backfill <run-log> --out <new-log> [--brief-only]` rewrites a finished log with `offeredCommand`, `offeredPolicy` and `briefDelivered` instead of running a turn, and prints a JSON refusal with `same_path`, `holdout_row` or `unknown_row` when it cannot. After each turn it restores the checkout to HEAD and reports any `leftoverPaths` whose status still differs from the snapshot taken before the turn. Exit 2 refuses instead of running: bad flags, an unknown runtime or set, a holdout or unknown row, a set with fewer rows than it needs (`set_short`), a dirty worktree outside the run log's folder (`worktree_dirty`), a checkout with a git remote (`remote_present`), or a Codex arm whose project hook is unapproved (`codex-hooks-unapproved`). |
| `command-routing-baseline.json` | Captured command routing numbers that `tests/command-routing-slice.vitest.ts` holds the scorer to. |

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

The output log holds the same lines plus `offeredCommand`, `offeredPolicy`, `offerError`, `briefDelivered` and `offerBackfilled`. Exit 2 means the output was refused, and the printed JSON names why: `same_path`, `holdout_row`, `unknown_row` or a missing `--out`.

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
