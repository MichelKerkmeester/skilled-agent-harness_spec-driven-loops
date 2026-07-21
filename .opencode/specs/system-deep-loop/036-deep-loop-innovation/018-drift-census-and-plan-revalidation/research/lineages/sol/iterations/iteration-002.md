# Iteration 002: First-Order Resolution Census and Clean Control

## Focus

Run a first-order path, file, symbol, glob, and dependency resolution census over phases 004-017, without repeating phase 003's controls except for comparison, and identify a genuinely clean negative-control phase against `0ce43ff589..e4b242c3940c26b47950534e1a149c7e037e71fd`.

## Findings

### F-005: Phase 004 is a genuinely clean negative control

Phase 004 names its parent, the phase-tree manifest, and three child contracts using relative paths. The parent and manifest resolve at `.opencode/specs/system-deep-loop/036-deep-loop-innovation/spec.md` and `.opencode/specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json`; all three child specs also resolve at the exact folders listed by the phase map. [SOURCE: .opencode/specs/system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/spec.md:44-56] [SOURCE: .opencode/specs/system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/spec.md:60-68]

The checked surfaces were the phase-004 parent link, manifest link, child-folder map, child `spec.md` files, predecessor, successor, and 178-row corpus dependency. `git log --follow` shows that post-baseline commits `7f3216fc502420cb8aade4bbb639f9efe78b1ada` and `8d3b5b21d571153b92dfb02c04c231509d36c9b2` renumbered the containing packet twice. Those moves did not stale phase 004's relative targets, and no post-baseline commit renamed its three child contracts. Phase 004 is therefore a clean negative control for first-order drift: `still valid` on the resolution dimension.

### F-006: Phases 007-014 have no genuinely missing planned target in the current tree

The phase-map children named by phases 007-014 resolve in their own phase directories. Phase 012's prose uses packet-root shorthand (`036-deep-loop-innovation/spec.md`, `002-deep-loop-effectiveness-and-fanout/research/research-modes.md`, and `manifest/phase-tree.json`) rather than Markdown links, but the corresponding packet-root targets exist; these are labels whose resolution base must be the packet root, not the phase-012 directory. [SOURCE: .opencode/specs/system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/spec.md:43-55] [SOURCE: .opencode/specs/system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/spec.md:59-66]

Phase 013's eight listed workstream directories all exist, including `004-deep-improvement-common` and its three dependent variants. [SOURCE: .opencode/specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/spec.md:42-54] [SOURCE: .opencode/specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/spec.md:58-71] Their post-baseline creation is planned artifact realization, not evidence that a baseline target disappeared. The census therefore found no first-order missing-file drift for phases 007-014 after normalizing packet-root shorthand and excluding intentionally future implementation files.

### F-007: Phase 006 contains a malformed research reference, but it is not post-baseline drift

Phase 006 currently cites `../../002-deep-loop-effectiveness-and-fanout/research/research-modes.md`; from the phase-006 directory that escapes the `036-deep-loop-innovation` packet and does not resolve. The intended target exists one level up at `../002-deep-loop-effectiveness-and-fanout/research/research-modes.md`. [SOURCE: .opencode/specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/spec.md:54-56]

`git log --follow` traces this phase through authoring commit `3022e02d6b62a4121d00a1b8f62932aca5ada257` and pre-baseline normalization commit `fcade7e2cd58238d52fc5c56d3347d7868362c8a`; the post-baseline commits `7f3216fc502420cb8aade4bbb639f9efe78b1ada` and `8d3b5b21d571153b92dfb02c04c231509d36c9b2` only moved the packet container. The malformed depth is therefore a baseline reference defect, not a post-baseline drift finding. It is recorded for eventual refinement but excluded from the requested drift count.

### F-008: Phase 005's named files still resolve despite post-baseline runtime edits

The two explicit runtime source paths, both unit-test files, and the prototype source all exist at their intended runtime or packet roots. The abbreviated `runtime/tests/unit/*.vitest.ts` names in the phase spec normalize to `.opencode/skills/system-deep-loop/runtime/tests/unit/`, not the phase directory. [SOURCE: .opencode/specs/system-deep-loop/036-deep-loop-innovation/005-fanout-live-tools-unblock/spec.md:52-65] [SOURCE: .opencode/specs/system-deep-loop/036-deep-loop-innovation/005-fanout-live-tools-unblock/plan.md:60-66]

Post-baseline commit `e4b242c3940c26b47950534e1a149c7e037e71fd` modified `fanout-run.cjs`, but the named `buildLineageCommand` symbol remains at the cited line and is still exported and covered by tests. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1382] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2011] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:672-719] Thus phase 005 has no first-order path/file/symbol loss. Whether its live-tools premise has already shipped is second-order premise drift and remains for the next iteration.

### F-009: Phases 015-017 use resolvable packet-root dependencies, not missing current files

Phase 015 names the parent manifest, phase-003 census, phase-014 contracts, retained phase-007 semantics, and the successor gate. These targets exist after resolving shorthand from the packet root. [SOURCE: .opencode/specs/system-deep-loop/036-deep-loop-innovation/015-legacy-writer-retirement/spec.md:145-163] Phase 016 similarly names concrete child contracts and packet-root control files that are present; artifacts such as exact-SHA gate outputs are execution products and were never baseline files expected to resolve. [SOURCE: .opencode/specs/system-deep-loop/036-deep-loop-innovation/016-whole-system-gate/spec.md:151-164]

Phase 017's `changelog/`, metadata outputs, and final receipts are output locations or generated artifacts, while its phase-016 and packet-root inputs resolve. The two post-baseline packet renumbers (`7f3216fc502420cb8aade4bbb639f9efe78b1ada`, `8d3b5b21d571153b92dfb02c04c231509d36c9b2`) did not remove these dependencies. No first-order missing-target drift was established for phases 015-017.

## Sources Consulted

- Phase 004-017 `spec.md`, plus implementation plans/checklists/tasks where present
- `.opencode/specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json`
- Current phase child trees and runtime source/test paths
- Git history and rename-aware range `0ce43ff589..e4b242c3940c26b47950534e1a149c7e037e71fd`
- Commits `3022e02d6b62a4121d00a1b8f62932aca5ada257`, `fcade7e2cd58238d52fc5c56d3347d7868362c8a`, `7f3216fc502420cb8aade4bbb639f9efe78b1ada`, `8d3b5b21d571153b92dfb02c04c231509d36c9b2`, and `e4b242c3940c26b47950534e1a149c7e037e71fd`

## Assessment

`newInfoRatio: 0.78`. The iteration adds a complete first-order classification for phases 004-017, establishes phase 004 as the required clean negative control, and separates one real but pre-baseline malformed reference from post-baseline drift. Confidence is high for current path/file resolution and commit ancestry; symbol-level analysis was intentionally limited to phase 005's explicitly named command-builder surface.

## Reflection

### What Worked

- Resolving references according to their documented root prevented false missing-file findings from packet-root shorthand.
- Pairing current-tree existence checks with `git log --follow` distinguished renumber-safe relative paths from baseline defects.
- Treating authored future children and execution outputs separately avoided misclassifying planned artifacts as deleted files.

### What Failed or Was Ruled Out

- Ruled out phase 012's three packet-root labels as missing dependencies; they resolve when interpreted from the packet root.
- Ruled out phase 005's abbreviated test paths as missing; both files exist under the runtime root.
- Ruled out the phase-006 malformed `../../002-...` reference as post-baseline drift; it predates `0ce43ff589`.
- A raw code-span extractor over-counted branch names and output folders as file dependencies, so its unnormalized missing totals are not evidence.

## Recommended Next Focus

Test second-order premise drift, beginning with phase 013's eight-workstream taxonomy and phase 005's live-tools capability premise against commits `6cd8ab14e4e`, `708d25acf04`, `908efde8d8f`, and current runtime behavior.
