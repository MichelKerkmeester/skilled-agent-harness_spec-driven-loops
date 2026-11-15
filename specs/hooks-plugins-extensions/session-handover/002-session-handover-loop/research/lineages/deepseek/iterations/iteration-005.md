# Iteration 5: Ideal core-and-adapter boundary and standards conformance

## Focus

Assemble the architecture the first four iterations imply, then check the code, tests and docs against the sk-code-skilled universal, JavaScript, TypeScript and shell checklists and the sk-doc README and playbook standards. The aim is a small set of structural fixes that remove the drift classes rather than patching each instance.

## Findings

1. **P2 — One fact is written in several places across the core, adapters and wrapper, so a path or constant change needs synchronized edits.** The CLI invocation string is repeated in all five adapters [SOURCE: .skilled/hooks/session-relaunch/claude/context-nudge.mjs:20] [SOURCE: .skilled/hooks/session-relaunch/codex/shared.mjs:28] [SOURCE: .skilled/hooks/session-relaunch/hermes/context-nudge.mjs:15] [SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:99] [SOURCE: .opencode/plugins/session-relaunch.js:26]. The four handoff section names are declared twice [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:22] [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:29]. The seed phrase is built independently in the core, the nudge and the wrapper [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:567] [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:12] [SOURCE: .skilled/bin/skilled-loop:461]. The default hop cap of ten appears in `nudge.cjs`, both CLI switch reads, and `shouldRelaunch`'s default [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:27] [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:401] [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:404]. Fix: export one `SESSION_RELAUNCH_CONSTANTS` object (CLI path, sections, seed prefix, default hop cap) from the core, import it in every adapter and the nudge, and have the wrapper ask the CLI to render the manual command instead of keeping its own case table.

2. **P2 — There is no shared adapter conformance suite, so each adapter can diverge on the same core contract.** Each runtime has its own test file [SOURCE: .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:1] [SOURCE: .skilled/hooks/session-relaunch/tests/codex-adapters.test.cjs:1] [SOURCE: .skilled/hooks/session-relaunch/tests/hermes-adapters.test.cjs:1] [SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts:1] [SOURCE: .opencode/plugins/tests/session-relaunch.test.cjs:1], and iteration 2 found three places where the same fixture would produce different behavior: malformed seeds, unvalidated spec folders and corrupt note files. Fix: add a table-driven `adapter-conformance.test.cjs` that runs every exported adapter entry through one fixture set for seed detection, seed refusal, spec-folder normalization, pending and armed suppression, hop-cap silence and corrupt-note recovery; keep the per-runtime suites for host-specific payload shapes.

3. **P2 — Two pieces of logic that every adapter needs still live in the adapters rather than the core: killer target resolution and note-state classification.** Target resolution exists in five forms [SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:131] [SOURCE: .skilled/hooks/session-relaunch/codex/stop-arm.mjs:118] [SOURCE: .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:79] [SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:244] [SOURCE: .opencode/plugins/session-relaunch.js:190]. Note-state classification exists twice inside one file: existence outside a loop [SOURCE: .opencode/plugins/session-relaunch.js:64] and readability inside the seed path [SOURCE: .opencode/plugins/session-relaunch.js:72]. Fix: add `resolveKillerTarget(loopId, { env, pid })` and `noteState(notePath)` to `relaunch-core.cjs`, make every adapter call them, and delete the per-adapter variants. The core then owns the one rule that decides whether a PID or a note is trustworthy.

4. **P3 — The nudge's "exactly this shape" note block shows a placeholder in the `spec_folder` value slot, which invites copying an invalid value into the note.** The frontmatter example prints `spec_folder: <repo-relative packet path, "none" for Gate 3 D) Skip, or empty if unanswered>` [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:94] inside a block introduced as the exact shape to write [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:87]. `prepare` rejects that literal string because it is neither `none` nor a valid packet path [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:372]. Fix: print an empty `spec_folder:` value in the example and keep the three allowed forms in the guidance line below it, so the only copyable value is a valid one; add a nudge test asserting the placeholder never appears after `spec_folder:`.

5. **P3 — The tests README omits the OpenCode plugin suite from the folder inventory, so a reader cannot find one fifth of the regression coverage.** The README says the suite covers Claude, Codex, Hermes and Pi [SOURCE: .skilled/hooks/session-relaunch/tests/README.md:15], and its directory tree lists only the files under `tests/` [SOURCE: .skilled/hooks/session-relaunch/tests/README.md:21]. The OpenCode plugin and its tests live in `.opencode/plugins/` [SOURCE: .opencode/plugins/tests/session-relaunch.test.cjs:1]. Fix: name the OpenCode suite and its path in the Overview and Key Files, and say why it lives beside the plugin.

## Ruled Out

- A JavaScript or shell checklist violation in the shipped code: module headers, `'use strict'`, camelCase, bracketed log prefixes, quoted expansions, `set -euo pipefail`, documented exit codes and named constants are all present in the reviewed files.
- A README structure or sk-doc standards violation: the README has numbered ALL CAPS H2 sections, a directory tree, a switches table, troubleshooting and related links, and no anchor navigation.
- Treating the TypeScript `as string` import specifiers as a defect: the comment explains the dual-base module resolution the Pi loader needs, and the dynamic imports have a fallback.

## Dead Ends

- Looking for a shared conformance runner outside the per-runtime suites: none exists, and the deep-loop stress adapters are not wired to this hook.

## Edge Cases

- Ambiguous input: the ideal split between "adapter" and "core" is judgment, not a repo rule; this iteration states the split it recommends and the drift each move removes.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: the standards pass covers the files in the launch path; the Hermes Python plugin and Pi host internals were not reviewed line by line.

## Sources Consulted

- .skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md
- .skilled/skills/sk-code/sk-code-skilled/assets/checklists/javascript-checklist.md
- .skilled/skills/sk-code/sk-code-skilled/assets/checklists/typescript-checklist.md
- .skilled/skills/sk-code/sk-code-skilled/assets/checklists/shell-checklist.md
- .skilled/skills/sk-doc/sk-create-readme/references/readme/quality-and-checklist.md
- .skilled/hooks/session-relaunch/lib/nudge.cjs
- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs
- .skilled/hooks/session-relaunch/bin/session-relaunch.cjs
- .skilled/hooks/session-relaunch/tests/README.md
- .opencode/plugins/session-relaunch.js

## Assessment

- New information ratio: 0.7
- Questions addressed: architecture; standards conformance
- Questions answered: the ideal architecture and standards key question, with five structural fixes

## Reflection

- What worked and why: counting each duplicated literal exposed the drift surface in one pass; the target-resolution variants and the CLI path copies are the same class of defect.
- What did not work and why: the standards checklists are mostly satisfied, so the useful output is the small number of structural gaps, not a long list of checklist rows.
- What I would do differently: derive the conformance fixture set from the iteration 2 divergences first, then write the adapter table, so the suite encodes the observed failures rather than an imagined contract.

## Recommended Next Focus

None. The five-iteration cap is reached; synthesis consolidates the findings and the architecture recommendation.
