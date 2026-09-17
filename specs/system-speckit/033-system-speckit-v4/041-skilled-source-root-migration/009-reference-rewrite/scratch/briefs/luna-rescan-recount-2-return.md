## Verdict

All five build the `.opencode/specs` compatibility alias, not the source tree, so the unclassified count is zero (`spec-root-fault-injection.vitest.ts:51-56`, `spec-root-phase-pointer.vitest.ts:58-64`, `spec-root-writer-autosave.vitest.ts:131-137`, `trigger-phrase-no-prose-bigrams.vitest.ts:38-55`, `workflow-canonical-save-metadata.vitest.ts:172-183`).

## Rows

| file:line | Path built | Classification | Evidence |
|---|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/spec-root-fault-injection.vitest.ts:51` | `workspacePath/.opencode/specs/<relativePacketPath>` | Alias | Constructed at `:51-56`; used as `legacyPacketPath` at `:180-196`. |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/spec-root-phase-pointer.vitest.ts:58` | `workspacePath/.opencode/specs/system-speckit/100-parent` | Alias | Constructed at `:58-64`; used to create and inspect the parent fixture at `:65-70`. |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/spec-root-writer-autosave.vitest.ts:131` | `workspacePath/.opencode/specs` | Alias | Used as the returned `SPEC_FILE` prefix at `:131-137`. |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-phrase-no-prose-bigrams.vitest.ts:38` | `tempRoot/.opencode/specs/system-speckit/026-graph-and-context-optimization/003-memory-quality-issues/009-trigger-bigram-fixture` | Alias | Constructed at `:38-46`; passed to the workflow at `:50-55` and checked at `:77-79`. |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/workflow-canonical-save-metadata.vitest.ts:176` | `tempRoot/.opencode/specs/system-speckit/917-canonical-save-metadata-fixture` | Alias | Constructed at `:176-182`; used as the fixture root at `:183-186` and by metadata refresh at `:227-246`. |
Codex exit 0, 2026-09-17T19:03:54Z to 2026-09-17T19:05:52Z, --model gpt-5.6-luna, reasoning xhigh, service tier fast, --sandbox read-only.
