# Iteration 14: Phantom runtime core documentation

## Focus

Compare active runtime README contracts with the source tree and its nearby test
references. The goal was to find a documentation contract whose named runtime
surface disappeared during the decommission, not to repeat live database env or
install-guide findings. This was source-only research.

## Findings

1. **LUNA-051 — `runtime/core/README.md` documents a removed `db-state`/`core/index` subsystem and database rebinding API as if it were live. P1. CONFIRMED stale documentation and path references.** The README's architecture, directory tree, key-file table, boundaries, flow, and entrypoint table all name `db-state.ts`, `core/index.ts`, `init()`, `reinitializeDatabase()`, `registerDatabaseRebindListener()`, and index-scan lease functions. A direct source inventory of `runtime/core/` found only `config.ts` and the README; no `db-state.ts` or `core/index.ts` exists. The active import-policy tests still use `core/db-state` as a string fixture, which reinforces the retired API vocabulary without proving an importer. The result is a live maintainer-facing contract that describes database-backed vector-index behavior the current source tree no longer provides. Smallest fix: delete or rewrite the phantom subsystem sections to describe the actual `config.ts` boundary, then replace stale policy fixtures with current internal-path cases. [SOURCE: .opencode/skills/system-spec-kit/runtime/core/README.md:14-23,34-48,53-82,84-124] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/import-policy-rules.vitest.ts:6-20] [INFERENCE: source inventory showed only `config.ts` and `README.md` under runtime/core, so the documented API has no current implementation file]

2. **LUNA-052 — The same runtime core README prescribes two missing test files, making its validation recipe partially unrunnable. P2. CONFIRMED documentation drift.** The README instructs maintainers to run `tests/unit-path-security.vitest.ts`, `tests/symlink-realpath-hardening.vitest.ts`, and `tests/handler-memory-index.vitest.ts`. The first file exists, but direct path checks found the latter two absent from `runtime/tests/`; the current test inventory instead contains differently named path/memory suites. A maintainer following the package-owned validation recipe receives file-not-found failures or may assume coverage exists when it does not. Smallest fix: replace the recipe with the current test paths and add a source-to-README check for every explicitly named validation file. [SOURCE: .opencode/skills/system-spec-kit/runtime/core/README.md:128-136] [INFERENCE: direct checks found `runtime/tests/symlink-realpath-hardening.vitest.ts` and `runtime/tests/handler-memory-index.vitest.ts` missing while `unit-path-security.vitest.ts` exists]

## Ruled Out

- `runtime/data/README.md` is aligned with the trigger-index successor: it names `runtime/data/trigger-index.json`, its generator/lookup, and explicitly forbids databases/logs there. It was used as a contrast, not as a finding. [SOURCE: .opencode/skills/system-spec-kit/runtime/data/README.md:11-35]
- `runtime/README.md`'s `handlers/memory-index-discovery.ts` reference resolves to the current handler file and was not promoted as a phantom path. Its name is tracked as terminology drift elsewhere. [SOURCE: .opencode/skills/system-spec-kit/runtime/README.md:136-152]
- The active `references/memory/memory-system.md` is a successor retrieval/continuity reference that explicitly says there is no server or database in its retrieval table; its filename alone is not evidence of a retired implementation. [SOURCE: .opencode/skills/system-spec-kit/references/memory/memory-system.md:15-35]

## Dead Ends

- No other explicitly named source file in the sampled runtime/package READMEs was missing after excluding `dist` and archived/reference-only trees.

## Edge Cases

- `db-state.ts` may have been intentionally removed while its README was left as historical architecture. Because the README presents it in current responsibilities, entrypoints, and validation instructions, an explicit historical marker or deletion is still required.
- The missing test paths could be intentionally moved suites rather than lost coverage. That ambiguity affects the fix, not the confirmed failure of the published command recipe.

## Questions Remaining

- Q5 gains a confirmed phantom runtime API and unrunnable validation recipe.
- Q1 gains further evidence that database-state behavior was removed from source but not all documentation.
- Q2-Q4 and Q6-Q7 remain open for registrations, dependency/test edges, successor coverage, and gate integrity.

## Sources Consulted

- [SOURCE: .opencode/skills/system-spec-kit/runtime/core/README.md:14-23,34-48,53-82,84-124,128-136]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/import-policy-rules.vitest.ts:6-20]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/README.md:136-152]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/data/README.md:11-35]
- [SOURCE: .opencode/skills/system-spec-kit/references/memory/memory-system.md:15-35]

## Assessment

- New information ratio: 0.79
- Questions addressed: Q1, Q5
- Questions answered: Q1 = expanded (database-state source removal versus retained docs); Q5 = partial (phantom API and test paths found)
- Confidence: high for the README/source inventory mismatch and missing validation targets; medium for whether the missing module was intended as historical documentation

## Reflection

- What worked and why: checking the README's named files directly revealed a complete removed subsystem, rather than relying on stale terminology alone.
- What did not work and why: the source tree cannot establish the historical deletion reason, so the finding avoids claiming an accidental code removal.
- What I would do differently: next examine trigger-index generator/lookup freshness and coverage boundaries for successor behavior that can silently go stale even when its docs are current.

## Recommended Next Focus

Angle 6: audit the trigger-index generator, lookup, ripgrep conventions, and continuity writer as successors—especially corpus scope, current-source freshness, failure handling, and gaps versus the retired memory search/context capabilities.

