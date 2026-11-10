## Row 77 (ambiguous)
- Doc: `specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/iteration-003.md:97`
- Citation: `implementation-summary.md:73`
- Candidates: `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/003-valid-level2/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/004-valid-level3/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/007-valid-anchors/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/009-valid-priority-tags/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/010-valid-evidence/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/011-anchors-duplicate-ids/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/012-anchors-empty-memory/implementation-summary.md` and 3798 more

```text
- **Evidence refs:** Direct read of `:2568-2581`. The captured `sourceCode` is read at the top of the file (the surrounding `describe` block reads the production source as a string); the test bodies contain only `expect(...).toMatch(...)` calls. There is no `await processFile(...)` invocation in the test bodies.
- **Counterevidence sought:** any runtime assertion, any DB write check, or any `vi.mock` of `indexSingleFile` inside T47c or T47c-2. None present — the tests are pure source-pattern.
…st accidental regression, which is the same convention T47d (`:2583-2586`) uses for the file-watcher `reindexFn`. The deeper runtime correctness (does `fromScan: true` actually gate `persistQualityLoopContent`?) is covered by the two real-DB tests in `handler-memory-index.vitest.ts` (referenced at `implementation-summary.md:73, 119`). The gap is therefore between the GATE (covered at runtime) and the CALLER (covered by source-pattern) — not a real correctness hole, but a structural asymmetry.…
- **Final severity:** no finding — convention-consistent; documented for awareness.
- **Confidence:** 0.93.
```

## Row 79 (ambiguous)
- Doc: `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/002-release-readiness-deep-review-audits/005-mcp-tool-schema-governance-audit/review-report.md:44`
- Citation: `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:109`
- Candidates: `.pi/extensions/pi-cache-optimizer/index.ts`, `.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts`, `.skilled/skills/mcp-code-mode/mcp-server/index.ts`, `.skilled/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/index.ts`, `.skilled/skills/system-deep-loop/runtime/lib/agent-improvement-reducers/index.ts`, `.skilled/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/index.ts`, `.skilled/skills/system-deep-loop/runtime/lib/authority-root/index.ts`, `.skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/index.ts` and 61 more

```text
**Severity:** P1, schema drift / public tool fails closed.

…d dispatches to `handleCodeGraphVerify(parseArgs(args))` `.opencode/skills/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:77`. Central dispatch validates all code graph tools before calling their module dispatcher `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:79` and `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:109`. `TOOL_SCHEMAS` does not include `code_graph_verify` in the code graph block `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:632`, and `ALLOWED_PARAMETERS` jumps from `code_graph_context` to `detect_changes` w…

**Impact:** The tool does not silently accept unvalidated input; it fails closed before the handler. That still blocks release readiness because the canonical public registry advertises a tool that the strict validation layer cannot dispatch. It also violates the "every `TOOL_DEFINITIONS` entry has a matching Zod schema" requirement.
```

## Row 81 (ambiguous)
- Doc: `specs/system-deep-loop/036-deep-loop-innovation/001-research-inputs-and-architecture/002-deep-loop-effectiveness-and-fanout/research/iterations-modes/iteration-033.md:636`
- Citation: `n.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/iterations/iteration-008.md:4535`
- Candidates: `specs/agents/010-repo-rule-system-integration/research/lineages/deepseek/iterations/iteration-008.md`, `specs/agents/010-repo-rule-system-integration/research/lineages/rules-round2/iterations/iteration-008.md`, `specs/cli-external-orchestration/071-cli-hermes-creation/001-deep-research/research/lineages/deepseek/iterations/iteration-008.md`, `specs/cli-external-orchestration/071-cli-hermes-creation/011-dispatch-preflight-parity-research/research/lineages/deepseek/iterations/iteration-008.md`, `specs/cli-external-orchestration/071-cli-hermes-creation/012-runtime-surface-parity-research/research/lineages/deepseek/iterations/iteration-008.md`, `specs/cli-external-orchestration/z_archive/019-cli-opencode-minimax-optimization/002-minimax-efficiency-deep-research/research/iterations/iteration-008.md`, `specs/cli-external-orchestration/z_archive/026-cli-external-parent/review/iterations/iteration-008.md`, `specs/cli-external-orchestration/z_archive/029-cli-devin-revival/research-devin-hooks-portability/iterations/iteration-008.md` and 420 more

```text
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/z_archive/resource-map.md:897:| .opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/056-spec-kit-references-reorganization/description.json | Cited | OK | phase child; archived |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/z_archive/resource-map.md:898:| .opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/056-spec-kit-references-reorganization/graph-metadata.json | Cited | OK | phase child; archived |
…ction matchesSession(graph, record, sessionId, recordType) {\\\\n.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/iterations/iteration-008.md:4534:.opencode/skills/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:49:  if (!sessionId) return true;\\\\n.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/iterations/iteration-008.md:4535:.opencode/skills/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:53:  return actualSessionId === sessionId;\\\\n.opencode/specs/skilled-agent-orchestration/042-sk-dee…
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/z_archive/001-fix-command-dispatch/z_archive/resource-map.md:358:| .opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/056-spec-kit-references-reorganization/checklist.md
```

## Row 83 (ambiguous)
- Doc: `specs/agents/010-repo-rule-system-integration/research/lineages/deprecation-audit/iterations/iteration-002.md:34`
- Citation: `sk-code/sk-code-mobile-cli/SKILL.md:89`
- Candidates: `.hermes/skills/agent-ai-council/SKILL.md`, `.hermes/skills/agent-code/SKILL.md`, `.hermes/skills/agent-context/SKILL.md`, `.hermes/skills/agent-debug/SKILL.md`, `.hermes/skills/agent-deep-improvement/SKILL.md`, `.hermes/skills/agent-deep-research/SKILL.md`, `.hermes/skills/agent-deep-review/SKILL.md`, `.hermes/skills/agent-design/SKILL.md` and 131 more

```text
- **`node the retired scenario-persistence wrapper` placeholder** (a redacted command that no longer runs) survives in ~10 live files: `sk-create-manual-testing-playbook/SKILL.md:299`, its `manual-testing-playbook/manual-testing-playbook.md:237,276` and `operator-contract/persist-scenario-result.md:41,56,61,100`; `system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md:105,157` + `system-spec-kit/feature-catalog/ux-hooks/directive-lifecycle-dedup.md:80`; `sk-communication/manual-testing-playbook/manual-testing-playbook.md:95`; `sk-code/sk-code-mobile-cli/manual-testing-pl…
- **sk-create-benchmark teaches Lane C end-to-end**: `SKILL.md:111-112` (FAMILIES), `:120` (`SKILL_BENCHMARK` intent signal), `:146-148` (RESOURCE_MAP), `§10` heading at `:484`, `:646-650` ("`/deep:skill-benchmark` … run their lanes"), `:668` links the deleted `deep-improvement/references/skill-benchmark/scoring-contract.md` **and** the deleted `build-report.cjs`. Same dead links inside its own reference assets: `references/skill-benchmark/serving-snapshot-schema.md:211-213`, `assets/skill-benchmark/skill-benchmark-readme-template.md:179-182,189` (incl. `{{PATH_TO_SKILL_BENCHMARK_COMMAND}} -> …
…), hub `ROUTER.md:57,61` (heading "MACHINE-READABLE ROUTER (replay / benchmark source)" — "the deterministic router-replay parses"), `sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md:30` (lists "`/deep:skill-benchmark` router-replay" as consumer #1 of `projectHubRouter
```

## Row 86 (ambiguous)
- Doc: `specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/007-foundational-runtime/research/iterations/iteration-035.md:25`
- Citation: `session-stop.ts:313`
- Candidates: `.skilled/hooks/session-lifecycle/claude/session-stop.ts`, `.skilled/hooks/session-lifecycle/codex/session-stop.ts`, `.skilled/hooks/session-lifecycle/devin/session-stop.ts`, `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts`, `.skilled/skills/system-spec-kit/runtime/hooks/codex/session-stop.ts`, `.skilled/skills/system-spec-kit/runtime/hooks/devin/session-stop.ts`

```text
- **Severity:** P2
- **Description:** `touchedPaths` is another success-shaped durability signal that outruns the actual write contract. `recordStateUpdate()` appends the state path to `touchedPaths` unconditionally, even though `updateState()` can fail to persist or lose the unlocked `.tmp` race and only emit a warning.
…returns `false` on write or rename failure (`hook-state.ts:170-180`), and `updateState()` only logs `State update was not persisted` before returning the in-memory merged object anyway (`hook-state.ts:237-240`). `processStopHook()` then returns `touchedPaths` as part of `SessionStopProcessResult` (`session-stop.ts:313-317`). The replay harness locks in the happy-path interpretation by asserting one touched path inside the sandbox (`tests/hook-session-stop-replay.vitest.ts:17-24`), but it never forces `saveState()` failure or an overlapping writer before trusting that result.…
- **Downstream Impact:** Tooling or operators can treat `touchedPaths` as proof that the stop hook durably updated hook-state when the file on disk may still hold stale content. That masks local state-write races and makes later autosave/resume failures look like downstream bugs instead of an earlier failed write.

```

