# Iteration 7: Testing Patterns — ExtensionAPI mocks, vitest for raw TS, env-inheritance child-process tests, coverage expectations

## Focus
Lane Q7 (approved orchestrator lane 7): Testing patterns for the fork — (1) upstream ExtensionAPI mock shapes, (2) vitest setup for raw TypeScript, (3) env-inheritance child-process tests for subagent handoff, (4) coverage expectations. All three upstream snapshots (pi-openai-fast-mode, pi-gpt-fast-mode, pi-fast-mode/TheBinaryGuy) plus phase-003 integration-and-tests docs and the installed pi toolchain were read as evidence. No ambiguity: the prompt pack lane text is unambiguous; reducer "Next Focus" (Q8) was ignored per the orchestrator lane override.

## Actions Taken
1. Enumerated test dirs across all three upstream context snapshots and read their package.json test scripts. [SOURCE: context/pi-openai-fast-mode/package.json, context/pi-gpt-fast-mode/package.json, context/pi-fast-mode/package.json]
2. Read the ExtensionAPI mock construction in pi-openai-fast-mode tests (FakePi factory). [SOURCE: context/pi-openai-fast-mode/tests/extension.test.ts:13-66]
3. Read pi-gpt-fast-mode command tests (node:test runner, raw .ts imports). [SOURCE: context/pi-gpt-fast-mode/tests/command.test.ts:1-47]
4. Read TheBinaryGuy pi-fast-mode test (type-only ExtensionAPI, env mutation, mkdtemp state isolation). [SOURCE: context/pi-fast-mode/test/openai-codex-fast-mode.test.ts:9-34,199,232,254]
5. Grepped all upstream test files for child_process/spawn/fork/process.env usage; grepped phase-003 docs for coverage/test-runner expectations; searched for vitest configs and pi-subagents tests (none found). [SOURCE: bash scan of context tests dirs, 003-integration-and-tests/plan.md:142-143, 003-integration-and-tests/spec.md:75]

## Findings
1. **Upstream ExtensionAPI mock taxonomy — structural fake (openai) vs type-only + pure functions (TBG) vs no API surface (gpt).** pi-openai-fast-mode hand-rolls a `FakePi` object: `vi.fn()` spies for `registerFlag`/`registerCommand`/`getFlag`/`on`; event handlers captured in a `Map<event, Function[]>` and invoked directly by the test; commands captured in a `Map<string, RegisteredCommand>`; ctx fabricated via `makeCtx(cwd, model)`. It does NOT mock the `@earendil-works/pi-coding-agent` module — the fake is a plain structural object passed into `createPiFastModeExtension(pi, ...)`. This is the pattern the fork should mirror for its own ExtensionAPI surface. [SOURCE: context/pi-openai-fast-mode/tests/extension.test.ts:13-66,70]
2. **TheBinaryGuy imports the real ExtensionAPI as a type-only import and never fakes it.** `import { initTheme, type ExtensionAPI } from "@earendil-works/pi-coding-agent"` — the test calls real `initTheme("dark", false)` and exercises pure exported functions (`supportsFastMode` via `it.each` tables, `readFastModeState`/`writeFastModeState`) against `mkdtempSync` temp dirs. The extension's own handler wiring is not integration-tested; only pure logic + state I/O are. [SOURCE: context/pi-fast-mode/test/openai-codex-fast-mode.test.ts:9-17,21-34]
3. **pi-gpt-fast-mode is the no-framework extreme: `node --test` with `assert/strict`, importing raw `.ts` modules directly** (`../src/command.ts`) relying on Node's type stripping — pure-function tests only (parseFastCommand, getCommandCompletions); zero extension-API surface exercised; no mocks at all. [SOURCE: context/pi-gpt-fast-mode/tests/command.test.ts:1-47, context/pi-gpt-fast-mode/package.json scripts]
4. **vitest runs raw TypeScript with zero configuration — no upstream ships a vitest.config.** All upstream `.test.ts` files import `../src/*` (or `../extensions/*.ts`) directly; vitest's default esbuild transform + `*.test.ts` discovery handles raw TS. Scripts: openai `"test": "vitest run"`; TBG `"check": "prettier --check . && tsc --noEmit && vitest run"` (format+typecheck+test gate). For the fork, phase-003 already mandates Vitest: unit suites (upstream + handoff) and integration suites (config scope resolution, indicator fallback), with spec.md requiring the "extended vitest suite (upstream + handoff + integration tests) green" — no config file is required; add `tsc --noEmit` as the typecheck gate to match TBG. [SOURCE: context/pi-openai-fast-mode/package.json, context/pi-fast-mode/package.json, 003-integration-and-tests/plan.md:49,142-143, 003-integration-and-tests/spec.md:75]
5. **No upstream child-process env-inheritance test exists — the pattern must be authored for the fork.** Grep of all three upstream test suites found zero `child_process`/`spawn`/`fork` usage. The nearest precedent is TheBinaryGuy mutating `process.env.PI_CODING_AGENT_DIR` in-process (lines 199, 232, 254) to exercise env-scoped path resolution. For the fork's handoff env-inheritance lane (Q2 mechanics), the required pattern: (a) unit assertion at the spawn call site that the child is spawned WITHOUT an `env` override (node child_process then inherits `process.env` by default), and (b) an integration test `spawnSync(process.execPath, [fixture], { env: { ...process.env, PI_FAST_MODE_W_SUBAGENT_SUPPORT: "true" } })` asserting the child process observes the var; both are author-from-scratch work. [INFERENCE: based on zero child_process matches across all upstream test files + node child_process default env inheritance semantics]
6. **Coverage expectations: no percentage gate exists anywhere upstream or in phase-003.** No `vitest.config.*` exists in any upstream (coverage thresholds require config, so none are enforced); TBG's check gate has no coverage step; phase-003 plan.md/spec.md demand green suites and live-session verification, not coverage %. Working expectation for the fork: functional greenness + `tsc --noEmit` + live-session verification; `vitest --coverage` is optional observability, not a gate. [SOURCE: find results (no vitest.config.* in any context snapshot), 003-integration-and-tests/plan.md:49,142-143, 003-integration-and-tests/spec.md:75]
7. **pi-subagents ships no test suite in the installed copy — the handoff suite has no upstream tests to port.** `find ~/.pi/agent -maxdepth 6 -name "*.test.ts"` returned nothing under pi-subagents; installed npm packages typically strip tests. The iteration-2 note "upstream handoff.ts + tests" therefore cannot be sourced from the installed package; the fork's handoff tests (spawn semantics, env propagation) must be authored against the documented spawn contract, not copied from upstream fixtures. [SOURCE: bash find over ~/.pi/agent (no test files); strategy.md what-worked iteration-2 claim]

## Ruled Out
- Reusing pi-gpt-fast-mode's `node --test` runner for the fork: phase-003 plan.md explicitly mandates Vitest for both unit and integration suites; node:test is evidence of a viable zero-dep alternative but not the fork's chosen lane. [SOURCE: 003-integration-and-tests/plan.md:142-143]
- Testing the fork's extension by mocking the `@earendil-works/pi-coding-agent` module wholesale: no upstream does this; structural fakes (openai) or type-only imports (TBG) are the shipped precedents.

## Dead Ends
- Searching installed pi-subagents for a test suite to port: none exists (finding 7). Not a blocker for the fork — handoff tests are net-new authoring.
- Searching for vitest coverage thresholds upstream: none configured anywhere (finding 6).

## Edge Cases
- Contradictory evidence: none. Iteration-2's "upstream handoff.ts + tests" reference could not be re-verified against the installed pi-subagents copy (no tests shipped); recorded as a coverage limitation (finding 7), not a contradiction.
- Missing dependencies: pi-subagents git source not present in the repo search window and no test dir in the installed package — partial evidence; the spawn-call-site test pattern (finding 5) is inferred from node semantics and should be validated against the handoff spawn code in a follow-up.
- Partial success: all three upstream suites read successfully; the only gap is empirical verification of the env-inheritance pattern, which is an implementation-phase step (out of scope for research).
- Ambiguous input: none.

## SCOPE VIOLATIONS
None. All writes confined to the three allowed artifacts. No implementation or reducer-owned file touched.

## Sources Consulted
- specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-openai-fast-mode/tests/extension.test.ts:13-66,70
- specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-openai-fast-mode/package.json (scripts)
- specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-gpt-fast-mode/tests/command.test.ts:1-47
- specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-gpt-fast-mode/package.json (scripts)
- specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-fast-mode/test/openai-codex-fast-mode.test.ts:9-34,199,232,254
- specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-fast-mode/package.json (scripts)
- specs/hooks/011-pi-fast-mode-w-subagent-support/003-integration-and-tests/plan.md:49,142-143
- specs/hooks/011-pi-fast-mode-w-subagent-support/003-integration-and-tests/spec.md:75
- bash scans: context test-dir enumeration; child_process/process.env grep; vitest.config find (none); ~/.pi/agent test find (none)

## Assessment
- New information ratio: 1.0 (7/7 findings fully new — lane Q7 had zero prior packet coverage)
- Questions addressed: Q7 Testing patterns (all four sub-questions: mocks, vitest setup, env-inheritance child-process tests, coverage)
- Questions answered: Q7 answered in full (F1-F6); residual gap recorded (F7: no upstream handoff tests to port)

## Reflection
- What worked and why: reading the three upstream suites side-by-side made the mock taxonomy a structural comparison rather than a guess — each package's runner choice (vitest fake / node:test pure / vitest type-only) correlates exactly with how much extension surface it exercises. The phase-003 docs settled the fork's runner question in one grep, so no runner debate was needed.
- What did not work and why: the search for an upstream env-inheritance test precedent was empty by construction (npm packages strip tests; none of the three upstreams spawn children) — a negative result that still answers the lane by proving the pattern must be authored.
- What I would do differently: validate the spawn-call-site assertion (finding 5a) against the actual handoff.ts spawn code in a Q2/Q7 follow-up once implementation starts; the env-inheritance test skeleton is inferred from node semantics until then.

## Questions Answered
- Q7 Testing patterns: upstream ExtensionAPI mocks (F1-F3), vitest setup for raw TypeScript (F4), env-inheritance child-process tests (F5), coverage expectations (F6)

## Questions Remaining
- Q8 Indicator UX under custom footers: pi-statusline setFooter replacement vs widget placement; custom footer behavior; status fallback; recommendation
- Q9 TheBinaryGuy pi-fast-mode edge cases worth adopting: footer-composition wrapper; atomic state writes; service_tier guard; payload.model guard; supportsFastMode regex; adopt vs reject
- Q10 Licensing, notices, docs, maintenance: MIT compliance; THIRD_PARTY_NOTICES; README provenance; PLUGINS.md and sync-manifest; npm keywords and pi key

## Next Focus
Q8 Indicator UX under custom footers (reducer next-focus aligns with the queue for iteration 8): pi-statusline setFooter replacement vs widget placement, custom footer behavior, status fallback, recommendation. Carry F7 forward: validate the handoff spawn call site to firm up the env-inheritance test pattern before the implementation phase.
