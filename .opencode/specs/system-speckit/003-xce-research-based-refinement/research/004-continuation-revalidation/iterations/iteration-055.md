# Iteration 055: Command Naming and Root Normalization

## Focus

Classify command-surface drift between `/speckit` and `/spec_kit`, and spec-root drift between `specs/` and `.opencode/specs`, across command docs, framework guidance, and packet references. This iteration treats the artifact root as packet-local and does not edit command or spec docs.

## Findings

1. The live OpenCode command directory is `speckit`, not `spec_kit`: file discovery found `.opencode/commands/speckit/...` and no `.opencode/commands/spec_kit/...` command directory. The command file itself advertises `/speckit:resume` in its format and examples. [SOURCE: .opencode/commands/speckit/resume.md:26-27]
2. Framework guidance still advertises `/spec_kit:resume` as canonical for recovery and phase-parent fallback, creating a command-name contradiction against the command-file surface. [SOURCE: AGENTS.md:116-119] [SOURCE: AGENTS.md:159-170] [SOURCE: AGENTS.md:289-295]
3. Deep-loop command docs reinforce `/speckit` for downstream planning and implementation even while the deep-research command itself searches both roots. Its examples list `Ready for: /speckit:plan`, and the research command chain is `/deep:start-research-loop` -> `/speckit:plan` -> `/speckit:implement`. [SOURCE: .opencode/commands/deep/start-research-loop.md:300-308] [SOURCE: .opencode/commands/deep/start-research-loop.md:421-424]
4. Root handling is intentionally alias-tolerant in command setup: deep-research and deep-ai-council both search `specs .opencode/specs` and tell users that `specs/...` may be accepted with `.opencode/specs/` aliases. [SOURCE: .opencode/commands/deep/start-research-loop.md:160-177] [SOURCE: .opencode/commands/deep/ask-ai-council.md:167-182]
5. The durable canonical root for tracked OpenCode packets is `.opencode/specs/`, while legacy/root `specs/` may exist; memory indexing explicitly canonicalizes `specs/` vs `.opencode/specs/` before indexing. [SOURCE: AGENTS.md:295] [SOURCE: .opencode/commands/memory/manage.md:280-284]

## Negative Knowledge / Ruled Out Directions

- Do not rename the command directory to `spec_kit` as a first move: command YAML assets and command examples are already named around `speckit`, so a rename would be a broad runtime migration rather than documentation normalization. [SOURCE: .opencode/commands/speckit/resume.md:49-53]
- Do not make `specs/` the canonical root for tracked OpenCode packets: the framework says current packet-local docs and metadata live under `.opencode/specs/`, with `specs/` only legacy/alias-compatible. [SOURCE: AGENTS.md:295]
- Do not remove alias acceptance from command setup: existing workflows explicitly search both roots and accept matching `.opencode/specs/` aliases. [SOURCE: .opencode/commands/deep/start-research-loop.md:160-177]

## Recommendation

Canonicalize command names to `/speckit:*` for the actual OpenCode command surface while documenting `/spec_kit:*` as a stale/legacy spelling to scrub or alias only if the runtime supports aliases. Canonicalize packet paths to `.opencode/specs/...` in authored docs and metadata, while retaining `specs/...` as an accepted user-input alias normalized at detection/indexing time.

## Cited Evidence

- .opencode/commands/speckit/resume.md:26-27
- AGENTS.md:116-119
- AGENTS.md:159-170
- AGENTS.md:289-295
- .opencode/commands/deep/start-research-loop.md:160-177
- .opencode/commands/deep/start-research-loop.md:300-308
- .opencode/commands/deep/start-research-loop.md:421-424
- .opencode/commands/deep/ask-ai-council.md:167-182
- .opencode/commands/memory/manage.md:280-284

## Assessment

- New information ratio: 0.80
- Questions addressed: command naming/root normalization
- Questions answered: `/speckit` should be the canonical command spelling for command docs; `.opencode/specs` should be canonical for tracked OpenCode packet docs with `specs` retained as an alias.

## Recommended Next Focus

Add a normalization checklist for docs: replace active command references to `/spec_kit:*` with `/speckit:*`, replace active packet references to `specs/...` with `.opencode/specs/...` except examples explicitly labeled accepted aliases, and keep alias canonicalization in detection/indexing.
