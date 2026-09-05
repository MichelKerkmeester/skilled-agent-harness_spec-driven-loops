Review iteration 2: security of moved hook boundaries and path resolution.

Target: `.opencode/specs/system-speckit/053-spec-kit-runtime-rename`
Dimension: security
Angle: lifecycle hook target resolution, bounded payload/child execution, advisor handoff, model-server ownership, and path containment.

Review targets:

- `.opencode/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts`
- `.opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts`
- `.opencode/skills/system-spec-kit/runtime/hooks/codex/shared.ts`
- `.opencode/skills/system-spec-kit/runtime/hooks/devin/shared.ts`
- `.opencode/skills/system-spec-kit/runtime/hooks/cursor/shared.ts`
- `.opencode/skills/system-spec-kit/runtime/hooks/pi/lib/claude-hook-adapter.ts`
- `.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`
- `.opencode/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts`
- `.opencode/bin/hf-model-server.cjs`

Questions:

1. Are hook inputs bounded and delegated with time, buffer, and fail-open limits?
2. Can a rename-adjusted target path escape its intended project or advisor boundary?
3. Does the model-server/dependency seam remain owned by the correct package?

Do not execute hooks, model servers, tests, or repository gates. Record source evidence and observed path state only.
