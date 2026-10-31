Review iteration 4: maintainability of the renamed runtime’s documentation and internal vocabulary.

Target: `.opencode/specs/system-speckit/053-spec-kit-runtime-rename`
Dimension: maintainability
Angle: stale helper names, test-root constants, README commands, public API vocabulary, direct-import policy, and safe follow-on change paths.

Review targets:

- `.opencode/skills/system-spec-kit/runtime/api/README.md`
- `.opencode/skills/system-spec-kit/runtime/stress-test/README.md`
- `.opencode/skills/system-spec-kit/runtime/tests/_support/README.md`
- `.opencode/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts`
- `.opencode/skills/system-spec-kit/runtime/tests/env-reference-drift.vitest.ts`
- `.opencode/skills/system-spec-kit/runtime/tests/council-playbook-anchor-integrity.vitest.ts`
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts`
- `.opencode/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs`
- `.opencode/skills/system-spec-kit/runtime/scripts/finalize-dist.mjs`
- `.opencode/skills/system-spec-kit/package-lock.json`

Questions:

1. Does the moved vocabulary make ownership and future edits unambiguous?
2. Do test helpers and direct-import policies point at the new package without misleading aliases?
3. Is the `chokidar` fallback rationale supported by the workspace lockfile rather than a dead dependency?

Do not edit implementation or documentation; record advisory evidence only.
