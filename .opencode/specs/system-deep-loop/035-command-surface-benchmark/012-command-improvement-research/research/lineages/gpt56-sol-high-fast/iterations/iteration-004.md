# Iteration 004 — Router and dispatch parity

## Focus

RQ4: improve argument-hint grammar, `$ARGUMENTS`/positional handling, `:auto`/`:confirm` resolution, and OpenCode/Codex/Claude parity.

## Evidence and findings

### F12 — The mirror promises positional semantics it does not implement

The Codex mirror generator flattens a namespaced command such as `deep/research.md` into `deep-research.md` and emits a wrapper whose only argument injection is `User request: $ARGUMENTS`. [SOURCE: .opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs:64-83] The wrapper claims arguments map to canonical `$ARGUMENTS` and positional `$1..$N`, but no substitution pass implements `$N`, and the current canonical command corpus does not exercise positional placeholders.

Candidate delta: choose one enforceable policy: either implement shell-independent tokenization and `$1..$N` substitution with quoting fixtures, or prohibit positional placeholders and remove the promise. Prefer prohibition until a real consumer requires positional semantics.

Acceptance criterion: a corpus scan rejects `$1..$N` while unsupported; if enabled later, fixtures cover quoted spaces, empty positions, `--` passthrough, Unicode, and literal dollar signs across all mirror runtimes.

### F13 — Attached OpenCode suffixes have no explicit flattened-mirror grammar

Canonical routers describe invocations such as `/deep:research:auto`, while Codex exposes the flattened `/deep-research` prompt and forwards free-form `$ARGUMENTS`. [SOURCE: .opencode/commands/deep/research.md:104-116] [SOURCE: .opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs:64-83] A user must effectively pass `auto` or `--auto` as an argument, but the canon does not declare equivalence between attached suffixes and leading tokens.

Candidate delta: define one normalized invocation record with `command`, `mode`, `arguments`, and `runtime`; add grammar adapters for OpenCode attached suffixes, Codex flattened prompts, and Claude command syntax before router logic runs.

Acceptance criterion: `/deep:research:auto topic`, `/deep-research auto topic`, and the Claude equivalent normalize to the same record; conflicting mode signals fail deterministically instead of using precedence hidden in prose.

### F14 — Argument hints describe syntax, not semantic optionality

`memory/save` declares required `<spec-folder>` but explicitly permits empty arguments and resolves a fallback target. [SOURCE: .opencode/commands/memory/save.md:1-15] Other routers declare a required value while delegating the missing-input response to the execution target, as `doctor/mcp` does. [SOURCE: .opencode/commands/doctor/mcp.md:1-15] [SOURCE: .opencode/commands/doctor/mcp.md:38-45] Angle brackets alone cannot represent fallback-resolvable or target-gated inputs.

Candidate delta: extend the authoring contract with input fields `name`, `surfaceRequired`, `resolution`, `gateOwner`, and `fallbackSource`; render `argument-hint` from those fields.

Acceptance criterion: `memory/save` renders an optional hint with documented fallback, while truly required commands render required syntax and name the layer that blocks missing input.

### F15 — Detached fan-out conflates lineage host and leaf executor

The Codex executor contract prohibits Codex self-invocation, while the detached fan-out prompt identifies `cli-codex` as executor and instructs the receiving Codex lineage to run the loop. [SOURCE: .opencode/skills/cli-external-orchestration/cli-codex/SKILL.md:20-45] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1003-1084] The workflow needs to distinguish “this process owns the lineage” from “this process must spawn a leaf executor.”

Candidate delta: introduce `lineageHost` and `leafExecutor` fields; resolve self-invocation before dispatch. A detached lineage already running in the requested runtime executes as the leaf and must not recursively launch itself.

Acceptance criterion: every dispatch event records both roles; same-runtime detached lineages produce one process lineage, while cross-runtime leaves produce exactly one child dispatch with route proof.

## Ruled out

- Guessing mode from arbitrary topic text. Only a grammar position or explicit flag should carry control semantics.
- Supporting `$N` on documentation alone. Cross-shell tokenization needs an implementation and fixtures.
- Treating runtime-specific command spellings as identical strings. They require adapters to one semantic record.
- Recursive Codex dispatch to honor an executor label. That violates the executor's own safety contract.

## Iteration assessment

New-info ratio: 0.70. The dispatch problem is a missing normalization layer: syntax, semantic optionality, mode selection, and host/leaf roles are currently interleaved in prose.
