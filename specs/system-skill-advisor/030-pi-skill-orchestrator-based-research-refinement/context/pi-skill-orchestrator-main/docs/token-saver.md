# Token Saver

[Back to the main README](../README.md) · [Documentation index](README.md)

Token Saver is an optional tool-output optimization layer in Pi Skill Orchestrator. It is off by default.

It targets more than one source of context use after lazy skill loading has done its job. Lazy skill loading removes the eager skill catalog. Token Saver reduces large tool results, defers unused non-core tool schemas, shortens unusually long tool descriptions, and trims routine model output/reasoning effort.

## Turn it on or off

Use the slash command:

```text
/token-saver on
/token-saver off
```

With no argument, the command toggles the current setting:

```text
/token-saver
```

You can also press `T` in the Skill Orchestrator manager.

The setting belongs to the active profile. Switching profiles restores that profile's Token Saver setting.

Check the setting:

```text
/token-saver status
```

Show session statistics:

```text
/token-saver stats
```

Clear the in-memory recovery store, transform caches, adaptive feedback, and counters without changing the on/off setting:

```text
/token-saver clear
```

## Why tool output needs its own strategy

Agent tools often return much more text than the model needs for the next decision.

Common examples include:

- a search with hundreds of similar matches;
- a test run with 500 passing tests and one failure;
- a build log with repeated progress messages;
- a directory listing with generated files;
- a JSON response with hundreds of similar objects;
- a large source file when the model only needs imports and public structure;
- a long `git diff` where only changed lines and hunk boundaries matter;
- repeated reads that return exactly the same content as an earlier turn.

Sending all of that text to the model on every turn can consume context without adding useful information.

## Where the design comes from

The implementation was informed by two open-source projects:

- [Headroom](https://github.com/headroomlabs-ai/headroom), which routes content to specialized compressors, keeps compression reversible, protects stable prompt prefixes, learns from retrieval behavior, and shapes output/effort.
- [RTK](https://github.com/rtk-ai/rtk), which reduces command output with filtering, grouping, truncation, deduplication, failure focus, structural views, progress removal, output recovery, and savings statistics.

Both upstream projects use the Apache License 2.0. Pi Skill Orchestrator does not copy their source code. The Token Saver implementation in this repository is an independent TypeScript implementation under this project's MIT license.

## The processing path

When Token Saver is on, Skill Orchestrator listens to Pi tool results.

It does not rerun the command. It does not change the command's exit status. It does not change images. It does not alter skill bodies.

For a large text result:

1. Save a recovery identity for the exact original.
2. Detect the content type.
3. Apply one content-aware strategy.
4. Compare the compacted result with the original.
5. Use the compacted result only when the reduction is worthwhile.
6. Keep the exact original in bounded session memory when a compacted result is delivered.
7. Add a short `full=<id>` recovery marker.
8. Let the model call `token_retrieve` if omitted detail is actually needed.

If any transform fails, the original result passes through unchanged. Explicit machine-readable requests such as `--json` also pass through unchanged.

For source-code reads, Token Saver uses a safety guard inspired by Headroom's read protection. If the current user task clearly asks to edit, fix, patch, refactor, or implement code, direct source reads stay exact. Exploratory source reads can still use the structural outline described below.

## Content-aware routing

Token Saver does not use one truncation rule for everything.

### JSON and JSON-like tool output

Large arrays use a deterministic smart-sampling strategy.

It keeps:

- the first entries;
- the last entries;
- error/failure entries;
- entries relevant to the current user task;
- numeric outliers;
- meaningful low-cardinality state changes;
- representative spread samples.

Constant primitive fields can be factored out so the same value is not repeated in every object.

Large strings inside structured data can be shortened. The exact original remains available through recovery.

### Search and grep output

Search results are grouped by file when file/line information is available.

Token Saver keeps:

- the first and last useful matches;
- error matches;
- task-relevant matches;
- representative matches from each file.

Long match lines are bounded so one line cannot dominate the result.

### Tests

Passing-test spam is collapsed.

Failure blocks, assertion text, stack/context lines, and test summaries are retained. The result keeps enough context to diagnose the failure without paying for every successful test name.

### Logs and build output

Token Saver removes ANSI formatting and progress noise, groups repeated patterns, and keeps failure/warning information.

Dynamic IDs and large counters are normalized for grouping, but the displayed representative line remains readable.

### Diffs

Diff compaction keeps:

- file headers;
- hunk headers;
- added lines;
- removed lines;
- a small amount of nearby context;
- rename, binary, new-file, and deleted-file metadata.

### Source reads

Large source reads become an explicit outline rather than pretending to be a complete file.

The outline favors:

- imports/includes;
- classes, types, interfaces, functions, and method signatures;
- decorators and annotations;
- error handlers;
- TODO/FIXME markers;
- lines relevant to the current task;
- a small beginning/end sample.

Omitted bodies are marked as omitted. Exact source remains available through `token_retrieve`.

This is a deterministic structural outline. It does not claim to be a parser-perfect AST rewrite.

### Directory and inventory output

Long listings keep the useful edges and important project files, then sample the bulk inventory.

This gives the model the shape of a project without spending tokens on hundreds of generated or repetitive paths.

### Tables

Headers, edge rows, errors, task-relevant rows, and representative samples are retained.

### YAML, TOML, INI, and config-like text

The compactor favors section names and key structure. Repetitive or low-value value lines can be omitted when the result is large enough to justify the transform.

### General text

Long plain text uses extractive compaction. It keeps headings, bullets, warnings, errors, task-relevant lines, the beginning, the end, and representative samples.

It does not use an extra LLM call to summarize the text. Spending tokens to save tokens would defeat the point for many local and low-cost workflows.

## Exact repeat deduplication

If the same large tool output appears again in the same session, Token Saver can replace the repeated body with a short reference to the earlier exact content.

The model can still recover the original with the same recovery ID.

This is useful for repeated file reads, unchanged status output, repeated searches, and tools that return the same inventory on several turns.

## Reversible recovery

Every delivered compacted result ends with a marker similar to:

```text
[token-saver: log; 18420→2410 chars; ~87% smaller; full=41f8a52d5a6b7c4d0e1f2233]
```

The model-facing recovery tool is:

```text
token_retrieve
```

It accepts:

| Parameter | Meaning |
| --- | --- |
| `id` | Recovery ID from `full=<id>`. |
| `startLine` | Optional 1-based first line. Default is 1. |
| `maxLines` | Optional maximum line count. Default is 240. Maximum is 1000. |

Line-range recovery is deliberate. If the model needs 30 omitted lines, it does not need to put a 20,000-line original back into context.

Recovery is reversible only while the exact original remains in Token Saver's bounded in-memory cache. Recovery IDs do not survive a Pi restart, `/reload`, `/resume`, `/new`, or `/fork`. Pi can persist the compacted tool-result text in session history after Token Saver has discarded the original. In that case, an old `full=<id>` marker is no longer recoverable. Token Saver does not create a persistent recovery database. If a workflow requires durable byte-exact tool history across session/process boundaries, leave Token Saver off for that workflow.

A single tool result that is larger than the complete recovery-store character budget is not compacted. It passes through unchanged rather than receiving a recovery ID that cannot work.

When Token Saver is off, `token_retrieve` is removed from Pi's active tool list so its tool schema does not consume model context.

## Adaptive recovery feedback

Recovery is also feedback.

When the model repeatedly asks for exact output from a tool type, Token Saver records that behavior for the current session. Future results from that tool type are compacted less aggressively.

This is local, session-only behavior. No usage data is sent anywhere.

## Lazy tool-schema loading

Tool definitions can be another large fixed cost. A Pi session can have many extension or connector tools even when a task needs only one or two of them.

When Token Saver turns on, it keeps Pi's core working tools active and defers other currently active non-core tool schemas. The model sees one small discovery tool instead:

```text
token_tool_search
```

If the model needs a deferred capability, it searches by capability. Token Saver returns and activates only a bounded matching set. Pi's current deferred-tool support then exposes those tools from that point forward.

This is the same idea that Skill Orchestrator already uses for skills: keep the big catalog outside model context and search metadata only when needed.

Turning Token Saver off restores the tool schemas that Token Saver deferred. Session shutdown also restores Token Saver's deferred tools and removes its helper schemas before Pi replaces, reloads, or exits the session. `/token-saver clear` resets the deferred-tool state and re-applies the current on/off policy.

Pi notes that activating a deferred tool can rebuild the system prompt when that tool defines active-only `promptSnippet` or `promptGuidelines` metadata. Token Saver cannot remove metadata owned by another extension. For the best provider-prefix cache stability, lazily loaded third-party tools should rely on their normal tool description and avoid active-only prompt metadata where practical.

## Tool-description compaction

Some active tools have long human descriptions. Token Saver shortens only unusually long **top-level tool descriptions** at the provider request boundary.

It does **not** change:

- tool names;
- parameter schemas;
- parameter descriptions;
- required fields;
- enums;
- validation rules.

This follows Headroom's tool-description compaction tactic without weakening the call contract.

## Cache-friendly behavior

Headroom's current design emphasizes stable prefixes because model providers can reuse a byte-identical prompt prefix.

Token Saver follows the same basic rule: it compacts the **new tool result** before that result becomes part of later turns. It does not continuously rewrite old conversation turns.

Once a compacted tool result is in the transcript, it stays stable.

The statistics command also reports system-prompt prefix changes observed while Token Saver is enabled. This is diagnostic only. The extension does not move dates, IDs, or other dynamic prompt content around on its own.

## Output and reasoning reduction

Token Saver adds a small fixed instruction when enabled:

- be concise;
- do not restate tool output or earlier context;
- use recovery only when omitted detail is required.

It also implements conservative effort routing after routine successful tool continuations such as reads, searches, status checks, and passing tests.

Effort routing is **clamp-only**. The extension only reduces an effort/budget field when that field already exists in the provider request. It does not invent provider-specific fields.

Supported existing request shapes include:

- `reasoning_effort`;
- `reasoning.effort`;
- `output_config.effort`;
- numeric `thinking.budget_tokens`.

Tool errors and non-routine commands keep the original effort. In a turn with multiple tool results, one error or non-routine result blocks effort reduction for that continuation even if another tool result succeeds.

## Bounded memory and caches

Token Saver stores recovery data in memory, not in a new on-disk database.

The recovery store is bounded by both entry count and total characters. Transform caches and duplicate-tracking tables are also bounded. Cached transform decisions expire after 30 minutes.

Session start, session shutdown, profile switching, and `/token-saver clear` reset recovery state. This is why old recovery IDs cannot be treated as durable session-history references.

## Statistics

Run:

```text
/token-saver stats
```

The report includes:

- number of compacted tool results;
- repeated-result/cache activity;
- recovery calls;
- original and compacted character counts;
- estimated input tokens saved using the same simple `characters / 4` style estimate used by RTK for rough accounting;
- recovery-store size;
- system-prompt prefix drift observations;
- deferred-tool searches and activations;
- characters removed from long tool descriptions on provider requests;
- counts by compaction strategy.

The token number is an estimate. It is not a provider bill and is not a tokenizer-exact count.

## Safety rules

Token Saver follows these rules:

- Off means off. Tool results pass through unchanged.
- Short output passes through unchanged.
- Skill bodies and Skill Orchestrator's own skill-selection output are not compacted.
- Images are not modified.
- Explicit machine-readable output requests pass through unchanged.
- Source reads stay exact when the current task clearly requires editing or patching code.
- Tool parameter schemas and parameter descriptions are never compacted.
- Tool error status is preserved.
- Error and failure text gets priority.
- A transform must save enough space to pay for its own recovery marker.
- Transform errors fail open to the original result.
- Exact original recovery data stays local to the Pi process and is not durable across restart/reload/resume/new/fork boundaries.
- Oversized originals that cannot fit in the bounded recovery store pass through unchanged.
- Profile switching and session shutdown clear recovery state and restore Token Saver's active-tool changes.
- The extension does not change Pi's global settings.

A compacted result is still a lossy view. If exact details matter, use `token_retrieve` or turn Token Saver off for that profile.

## Headroom and RTK tactic map

| Upstream tactic | Pi Skill Orchestrator implementation |
| --- | --- |
| Headroom ContentRouter | Deterministic content detector routes each result to one compactor. |
| Headroom tool search / schema deferral | Non-core active tool schemas move behind `token_tool_search` and are activated lazily by capability. |
| Headroom tool-description compaction | Only long top-level tool descriptions are shortened; parameter contracts stay exact. |
| SmartCrusher JSON sampling | Boundary/error/relevance/outlier/change-point/sampling logic plus constant-field factoring. |
| Search/log/diff compressors | Dedicated search, log/test, and diff paths. |
| Code-aware compression | Explicit source outline with signatures/imports/error handlers and recovery. |
| Table/config/text compression | Dedicated structural/extractive paths. |
| CCR reversible compression | Bounded in-memory original store plus `token_retrieve`; recovery is available only while the cache entry exists. |
| TOIN-style retrieval learning | Recovery requests raise the future detail budget for that tool type during the session. |
| Skip/result transform caches | Bounded TTL caches avoid repeated failed/expensive transforms. |
| Cache-mode/live-zone behavior | New tool results are compacted; old conversation turns are not continuously rewritten. |
| Protect exact source reads | Edit/patch-oriented source reads stay exact; exploratory reads may use structural outlines. |
| CacheAligner | Prefix drift is observed and reported, not rewritten. |
| Verbosity steering | Fixed concise-response guidance while Token Saver is on. |
| Effort routing | Clamp-only reduction on routine successful continuations when the provider already exposes an effort field. |
| RTK smart filtering | Content-specific extraction removes low-value noise. |
| RTK grouping | Search results, repeated logs, and repeated diagnostics are grouped. |
| RTK truncation/head-tail | Important edges and representative samples are retained. |
| RTK deduplication | Repeated lines/patterns collapse, and exact repeated tool results become short recovery references. |
| RTK error-only/failure focus | Test and error modes preserve failures and diagnostic context. |
| RTK tree compression | Large directory/listing results become compact structural views. |
| RTK progress filtering | ANSI/progress noise is removed from large logs. |
| RTK structure-only views | Source/config/JSON paths keep structure rather than raw bulk. |
| RTK structured-output passthrough | Explicit machine-readable output requests such as `--json` are not compacted. |
| RTK recall/tee concept | Original compacted results remain recoverable by content ID and line range. |
| RTK savings tracking | Character reduction and approximate token savings are tracked per session. |

## What is not emulated

The goal is to carry over token-saving tactics that fit Pi's public extension boundary without pretending unsupported behavior exists. These Headroom features are not reproduced as if they were native Pi features:

1. **Semantic caching of complete LLM responses.** Pi lets an extension inspect or modify a provider request, but it does not provide a supported extension hook that can return a cached assistant response instead of making the provider call.
2. **Provider-managed cache objects.** OpenAI, Anthropic, Google, and other providers expose different cache mechanisms. Skill Orchestrator preserves stable prefixes where it can, but it does not create or manage provider cache resources behind Pi's back.
3. **Confirmed-cold prefix recompaction.** Headroom can rewrite a whole prefix when it knows the provider cache has expired. Pi does not expose a provider-neutral cache-TTL contract to extensions. A guess could destroy a warm cache, so Skill Orchestrator does not guess.
4. **Plain-text reasoning-history rewriting.** Some Headroom paths can compact or drop reasoning text for providers that resend it. Pi supports providers with different reasoning representations, including encrypted or provider-owned forms. Skill Orchestrator only uses the safer request-time effort clamp.
5. **Persistent semantic memory across agents.** Headroom's memory system stores extracted facts with embeddings and explicit persistence semantics. Adding that silently under a token toggle would create a new privacy and storage contract. Skill Orchestrator keeps its recovery memory session-local instead.
6. **Full-response learning and instruction-file mutation.** `headroom learn` can mine prior sessions and write corrections to agent instruction files. Skill Orchestrator does not edit project instruction files as a side effect of token saving.
7. **External semantic code-navigation services.** Headroom can install Serena. Skill Orchestrator does not install another service or mutate external agent configuration. Its source-outline path provides a local token-saving view instead.
8. **ML text compression.** Headroom can use Kompress. Skill Orchestrator uses deterministic extractive fallbacks so Token Saver does not download a model or run a hidden second inference service.

RTK's shell proxy performs many reductions before its output reaches the agent. Skill Orchestrator applies equivalent command-aware reductions at Pi's `tool_result` boundary instead. This saves model-context tokens without rewriting the user's shell command or requiring an external proxy binary.

These limits are deliberate. They keep the toggle reversible, local, fail-open, and compatible with Pi's supported extension APIs.
