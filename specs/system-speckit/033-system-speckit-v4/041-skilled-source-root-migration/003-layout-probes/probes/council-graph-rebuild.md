---
title: "Council graph rebuild"
description: "Question 6: which command rebuilds the tracked council-graph.sqlite, whether its stored paths are regenerated or copied, and what the tracked copy actually holds."
---

# Council graph rebuild (Q6)

**Result:** a real rebuild command exists, but it replays one council session's artifacts into the database row by row. It does not reproduce the file. The tracked file holds 17 node rows and 11 edge rows of test and debug residue, and one namespace key names an `.opencode/specs/...` path. Every stored `artifact_path` is a relative `ai-council/...` literal the replay regenerates. `spec_folder` is copied verbatim from the `--spec-folder` argument. The file needs no path migration under any shape. It is a derived record: phase 008 leaves it as is or resets it, and phase 010 settles the main checkout's uncommitted copy with its owner.


All results here ran against worktree 055 at base `d26f0c60ca88dab922752ab3d9ce8a07463934ae`.

## Rebuild path (unit U8, verified)

| Item | Finding | Verified at |
|------|---------|-------------|
| Rebuild command | `node .opencode/skills/system-deep-loop/deep-ai-council/scripts/replay-graph-from-artifacts.cjs --spec-folder <path> --session-id <id> [--dry-run]` reads `<spec-folder>/ai-council/ai-council-state.jsonl` and replays it through `runtime/scripts/upsert.cjs --loop-type council` | `deep-ai-council/scripts/replay-graph-from-artifacts.cjs:21-32` (usage), `:422` (`return runRuntimeUpsert(payload, repoRoot)`), playbook step 4 at `deep-ai-council/manual-testing-playbook/council-graph-integration/council-graph-derived-projection-rebuilds-from-artifacts.md:58` |
| File creation | Created on first script invocation if absent | `runtime/database/README.md:27` |
| `artifact_path` on nodes and edges | Regenerated: the replay writes `'ai-council/ai-council-state.jsonl'` or `` `ai-council/${event.path}` ``, and the writer stores it verbatim | `replay-graph-from-artifacts.cjs:248`, `:262`, `:285`, `:305`; `runtime/lib/council/council-graph-db.ts:126`, `:143`, `:435`; `runtime/scripts/upsert.cjs:232`, `:280` |
| `spec_folder` on all three tables | Copied from the validated `--spec-folder` argument into every row | `upsert.cjs:153`; `council-graph-db.ts:121`, `:454`, `:555`, `:629` |
| Tracked or ignored | Tracked despite the ignore rule: `git ls-files --error-unmatch` succeeds, while `.gitignore:118` ignores `runtime/database/*.sqlite` | orchestrator, `git ls-files` in worktree 055 |

All paths above are under `.opencode/skills/system-deep-loop/` unless they start with `.gitignore`.

## What the tracked copy holds (orchestrator, on a `/tmp` copy opened immutable)

Copy `/tmp/skilled-probes-003/council-graph-copy.sqlite`, byte-identical to the worktree file (SHA-256 prefix `62f5e5e6384ff5dccff0` for both). Five tables: `council_nodes`, `council_edges`, `council_snapshots`, `sqlite_sequence`, `council_schema_version`.

| Column | Rows | Cells naming `.opencode` | Cells naming `/Users/` |
|--------|------|--------------------------|------------------------|
| `council_nodes.spec_folder` | 17 | 4 | 6 |
| `council_edges.spec_folder` | 11 | 3 | 4 |

The distinct `spec_folder` values are `./council-replay-debug.GrrKeV`, `.opencode/specs/system-spec-kit/030-deep-loop-skills-playbook-validation/010-resolve-all-partials-and-skip/scratch/dac025-pkt`, two absolute `council-replay-graph-*` temp directories under the main checkout, `sandbox/dac-019` and `sandbox/verify-sbx`. `council_snapshots` is empty. `artifact_path` holds only `ai-council/ai-council-state.jsonl` or NULL. These are test and debug namespaces, not a production council history.

## Implications

- Shape A: the one `.opencode/specs/...` key is a namespace string, not a path the runtime opens, and `.opencode/specs` keeps resolving through the link. No migration is needed.
- Shape B: `.opencode/specs -> ../specs` stays a real entry of `.opencode/`, so the result matches shape A.
- Shape C: the key stays a string no code resolves, so dropping entries changes nothing for this file. The main checkout's uncommitted copy belongs to another session and must be settled with that owner before phase 010 lands the move.

## Verification

- **Brief:** `/tmp/skilled-probes-003/briefs/u8-council-graph-writer.md`, the child preamble, a condensed read-only `context` persona and four literal lines naming the question, eight files, the table columns and the citation rule.
- **Dispatch:** `AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 pi -p --offline --provider llmgateway --model llmgateway/deepseek-v4.1-flash --thinking max --tools read,grep,find,ls --no-session "<brief>" </dev/null`, run from worktree 055.
- **Exit and timing:** exit 0, 18:55:01Z to 18:57:24Z, 7,100 bytes.
- **Stderr tail:** one line from the skill-advisor hook, `"status":"fail_open" ... "CLI fallback timed out"`. It is not a Pi or provider error.

| Returned citation | Status |
|-------------------|--------|
| `replay-graph-from-artifacts.cjs:21-32`, `:248`, `:262`, `:285`, `:305`, `:422` | matched |
| `council-graph-db.ts:121`, `:126`, `:143`, `:435`, `:454`, `:555`, `:629` | matched |
| `upsert.cjs:153`, `:232`, `:280` | matched |
| `council-graph-derived-projection-rebuilds-from-artifacts.md:58` | matched in the manual-testing-playbook copy; the feature-catalog file of the same name holds its source metadata at that line |
| `runtime/database/README.md:27` | matched |
| Lane gap "whether the file is tracked: UNKNOWN" | settled by the orchestrator: tracked |

## Briefs and citation checks

Each brief is reproduced verbatim. The citation check resolves every `path:line` a lane returned to a file, using the lane's own abbreviations (`$PI/`, `BUNDLE/`, `CURSORSKILLS/` = `~/.cursor/skills-cursor/`, `help:`, `str:`, `dump:`, `cap/`), and confirms the cited lines exist. A bare basename that matches several tracked files counts as matched only when every candidate holds the line. "Matched" means the line exists. Content was opened only for the citations the verification tables above name. "Struck" means the file did not resolve or the line runs past the end of the file.

### u8-council-graph-writer

**Brief:**

```text
GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and `SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is empty. This is a read-only task: your final message is the whole deliverable.

PERSONA (this repository's read-only `context` agent, condensed): you retrieve and verify, nothing else. You never write, edit, create, delete, stage or commit a file, and you never hand work to another agent. Every claim you make comes from a file you opened with your read, grep, find or ls tools, cites `path:line`, and anything you could not settle goes under a final "Gaps" heading as UNKNOWN.

Question: which command rebuilds the tracked file `.opencode/skills/system-deep-loop/runtime/database/council-graph.sqlite`, and are the file paths stored in it regenerated from inputs at rebuild time or copied from input records?
Read these files (paths relative to your working directory): .opencode/skills/system-deep-loop/runtime/database/README.md; .opencode/skills/system-deep-loop/runtime/lib/council/council-graph-db.ts; .opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs; .opencode/skills/system-deep-loop/runtime/scripts/status.cjs; .opencode/skills/system-deep-loop/runtime/scripts/query.cjs; .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs; .opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/replay-graph-from-artifacts.vitest.ts; .opencode/skills/system-deep-loop/deep-ai-council/manual-testing-playbook/council-graph-integration/council-graph-derived-projection-rebuilds-from-artifacts.md.
Answer with one markdown table whose columns are: Item (rebuild command, writer function, each stored path column) | Finding | Regenerated or copied | Evidence (path:line).
Cite path:line for every cell and write UNKNOWN when no line settles it.
```

**Dispatch:** `PI_CODING_AGENT_DIR=/tmp/skilled-probes-003/pi-agent AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 pi -p --offline --provider llmgateway --model llmgateway/deepseek-v4.1-flash --thinking max --tools read,grep,find,ls --no-session "<brief>" </dev/null`, run from worktree 055. (U8 to U10 ran before the developer-role rejection began, without `PI_CODING_AGENT_DIR`.)

**Citation check:** 23 matched, 2 struck.

| Citation | Status | Resolved to |
|----------|--------|-------------|
| `.../council-graph-integration/council-graph-derived-projection-rebuilds-from-artifacts.md:58` | matched | ambiguous: 2 files, line in range in 2 |
| `.opencode/skills/system-deep-loop/deep-ai-council/references/integration/graph-support.md:102-104` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/deep-ai-council/references/integration/graph-support.md (119 lines) |
| `.opencode/skills/system-deep-loop/deep-ai-council/scripts/replay-graph-from-artifacts.cjs:21-32` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/deep-ai-council/scripts/replay-graph-from-artifacts.cjs (444 lines) |
| `.opencode/skills/system-deep-loop/runtime/database/README.md:27` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/database/README.md (37 lines) |
| `.opencode/skills/system-deep-loop/runtime/scripts/status.cjs:147-157` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/scripts/status.cjs (211 lines) |
| `replay-graph-from-artifacts.cjs:63-66` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/deep-ai-council/scripts/replay-graph-from-artifacts.cjs (444 lines) |
| `upsert.cjs:167-169` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs (323 lines) |
| `replay-graph-from-artifacts.vitest.ts:255-273` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/replay-graph-from-artifacts.vitest.ts (285 lines) |
| `.opencode/skills/system-deep-loop/runtime/lib/council/council-graph-db.ts:714-737` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/lib/council/council-graph-db.ts (755 lines) |
| `upsert.cjs:291` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs (323 lines) |
| `council-graph-db.ts:126` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/lib/council/council-graph-db.ts (755 lines) |
| `upsert.cjs:232` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs (323 lines) |
| `replay-graph-from-artifacts.cjs:248` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/deep-ai-council/scripts/replay-graph-from-artifacts.cjs (444 lines) |
| `persist-artifacts.cjs:526` | struck | ambiguous: 2 files, line in range in 1 |
| `council-graph-db.ts:143` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/lib/council/council-graph-db.ts (755 lines) |
| `upsert.cjs:280` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs (323 lines) |
| `replay-graph-from-artifacts.cjs:271` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/deep-ai-council/scripts/replay-graph-from-artifacts.cjs (444 lines) |
| `council-graph-db.ts:121` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/lib/council/council-graph-db.ts (755 lines) |
| `upsert.cjs:153` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs (323 lines) |
| `council-graph-db.ts:119-177` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/lib/council/council-graph-db.ts (755 lines) |
| `.gitignore:118` | matched | ~/worktrees/public/055-skilled-source-root-migration/.gitignore (309 lines) |
| `council-graph-db.ts:130-131` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/lib/council/council-graph-db.ts (755 lines) |
| `.../council-graph-derived-projection-rebuilds-from-artifacts.md:30-33` | matched | ambiguous: 2 files, line in range in 2 |
| `...rebuilt-from-artifacts.md:45` | struck | file not resolved |
| `replay-graph-from-artifacts.cjs:422` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/deep-ai-council/scripts/replay-graph-from-artifacts.cjs (444 lines) |
