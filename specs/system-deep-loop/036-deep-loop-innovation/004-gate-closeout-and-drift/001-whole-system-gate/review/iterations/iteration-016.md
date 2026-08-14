# Iteration 016 — security

- Executor: cli-codex gpt-5.6-luna effort=xhigh service_tier=fast sandbox=read-only
- Completed: 2026-07-30T07:18:51.126Z
- New findings: 6 (of 6 reported; prior total 55)
- Coverage: {"filesExamined":18,"keyPaths":[".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs",".opencode/skills/system-deep-loop/runtime/scripts/codex-dispatch.cjs",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/permissions-gate.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts",".opencode/skills/system-deep-loop/runtime/lib/council/multi-seat-dispatch.cjs",".opencode/commands/deep/assets/deep-research-auto.yaml",".opencode/commands/deep/assets/deep-research-confirm.yaml",".opencode/commands/deep/assets/deep-review-auto.yaml",".opencode/commands/deep/assets/deep-review-confirm.yaml",".opencode/skills/system-deep-loop/deep-research/assets/deep-research-config.json",".opencode/skills/system-deep-loop/deep-review/assets/deep-review-config.json",".opencode/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/executor-selection-contract.md",".opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md",".opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts",".opencode/skills/system-deep-loop/runtime/tests/unit/permissions-gate.vitest.ts",".opencode/skills/system-deep-loop/runtime/feature-catalog/state-safety/permissions-gate.md"]}

## Summary
I examined fanout command construction, executor adapters, environment filtering, sandbox resolution, write containment, and the research/review command wrappers. The strongest issues are shell interpolation before fanout-run receives argv, and native/OpenCode dispatch paths that rely on prompt-only write boundaries while recording or assuming sandbox posture that is not enforced. Codex containment is narrower but bypassable for pre-existing dirty paths and silently disabled when artifacts resolve outside the worktree. The standalone Codex helper also forwards the complete parent environment to the child.

## Findings
- [P0] F-016-01 Fanout shell wrappers interpolate unescaped attacker-controlled values @ .opencode/commands/deep/assets/deep-research-auto.yaml:165
  - evidence: The command block inserts --spec-folder {spec_folder}, --research-topic "{research_topic}", --fanout-config-json '{config.fanout_json}', and --base-artifact-dir {artifact_dir} directly into a shell command. fanout-run.cjs only trims researchTopic before use; it does not receive these values until after shell parsing. A topic containing a quote followed by shell syntax, or JSON containing a single quote, can escape the intended argument and execute arbitrary commands. The same construction appears in the confirm and review wrappers.
  - recommendation: Invoke fanout-run through structured argv/execFile. Pass JSON and topic data through stdin or a file where possible. If shell execution is unavoidable, apply real shell quoting to every placeholder and reject control characters in namespace and path fields.
- [P0] F-016-02 Native fanout dispatch always bypasses permissions and has no write containment @ .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1593
  - evidence: The native adapter constructs opencode arguments containing --dangerously-skip-permissions and --dir process.cwd(). The worker calculates a sandbox mode but the native adapter ignores it. Post-dispatch containment is enabled only when lineage.kind === 'cli-codex', so native lineages have no structural enforcement of the prompt-level lineageDir boundary.
  - recommendation: Remove the unconditional permission bypass, dispatch native lineages inside an isolated worktree or path-scoped sandbox, and apply containment to every write-capable adapter. Fail closed when a native adapter cannot enforce the requested boundary.
- [P0] F-016-03 cli-opencode silently ignores read-only and workspace-write sandbox modes @ .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1630
  - evidence: The cli-opencode adapter always uses --dir process.cwd(). It adds --dangerously-skip-permissions only for danger-full-access; read-only and workspace-write produce no permission or sandbox flag. The worker still records the resolved sandbox mode, while its own comments state that the lineageDir boundary is prompt-only, and containment excludes cli-opencode.
  - recommendation: Reject unsupported sandbox modes instead of recording them as effective. Use an isolated worktree or a genuinely enforced read-only/path-scoped mechanism, and fail closed when OpenCode cannot provide the requested policy.
- [P1] F-016-04 Write containment exempts pre-existing dirty paths by pathname only @ .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:295
  - evidence: detectNewOutOfScopeViolations builds a Set of preDispatchDirtyPaths and skips any post-dispatch path found in that set. The comparison is path-only: a child can overwrite, truncate, or delete an already-dirty file outside its artifact directory and the guard will treat the path as an exempt pre-existing change.
  - recommendation: Snapshot file content or repository blob identity before dispatch and compare it afterward. Prefer clean isolated worktrees for write-capable children; do not exempt a path solely because it was dirty at startup.
- [P1] F-016-05 Containment fails open when the artifact scope is outside the worktree @ .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:238
  - evidence: resolveArtifactScope returns null when the artifact realpath is outside the Git worktree, and detectNewOutOfScopeViolations returns an empty violation list when scope is null. fanout-run.cjs validates the base directory against the physical spec-folder path, while its namespace validation is lexical; a repository-local symlink to an external spec location can therefore pass dispatch validation and cause containment to be skipped.
  - recommendation: Canonicalize spec and artifact paths before validation, require their realpaths to remain inside the intended worktree, and treat an unresolved or external scope as a hard dispatch failure rather than an empty violation set.
- [P1] F-016-06 Standalone Codex dispatch forwards the entire parent environment @ .opencode/skills/system-deep-loop/runtime/scripts/codex-dispatch.cjs:122
  - evidence: dispatchCodex calls spawnSync with env: { ...process.env, AI_SESSION_CHILD: '1' }. Unlike the fanout executor environment builder, this passes unrelated credentials, configuration variables, NODE_PATH, and other process controls into the external Codex child.
  - recommendation: Reuse an explicit executor environment allowlist and pass only required authentication, locale, path, and session variables. Exclude unrelated provider secrets, module-loading controls, and arbitrary user configuration.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 16,
  "dimension": "security",
  "summary": "I examined fanout command construction, executor adapters, environment filtering, sandbox resolution, write containment, and the research/review command wrappers. The strongest issues are shell interpolation before fanout-run receives argv, and native/OpenCode dispatch paths that rely on prompt-only write boundaries while recording or assuming sandbox posture that is not enforced. Codex containment is narrower but bypassable for pre-existing dirty paths and silently disabled when artifacts resolve outside the worktree. The standalone Codex helper also forwards the complete parent environment to the child.",
  "findings": [
    {
      "severity": "P0",
      "dimension": "security",
      "title": "Fanout shell wrappers interpolate unescaped attacker-controlled values",
      "file": ".opencode/commands/deep/assets/deep-research-auto.yaml",
      "line": 165,
      "evidence": "The command block inserts --spec-folder {spec_folder}, --research-topic \"{research_topic}\", --fanout-config-json '{config.fanout_json}', and --base-artifact-dir {artifact_dir} directly into a shell command. fanout-run.cjs only trims researchTopic before use; it does not receive these values until after shell parsing. A topic containing a quote followed by shell syntax, or JSON containing a single quote, can escape the intended argument and execute arbitrary commands. The same construction appears in the confirm and review wrappers.",
      "recommendation": "Invoke fanout-run through structured argv/execFile. Pass JSON and topic data through stdin or a file where possible. If shell execution is unavoidable, apply real shell quoting to every placeholder and reject control characters in namespace and path fields."
    },
    {
      "severity": "P0",
      "dimension": "security",
      "title": "Native fanout dispatch always bypasses permissions and has no write containment",
      "file": ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs",
      "line": 1593,
      "evidence": "The native adapter constructs opencode arguments containing --dangerously-skip-permissions and --dir process.cwd(). The worker calculates a sandbox mode but the native adapter ignores it. Post-dispatch containment is enabled only when lineage.kind === 'cli-codex', so native lineages have no structural enforcement of the prompt-level lineageDir boundary.",
      "recommendation": "Remove the unconditional permission bypass, dispatch native lineages inside an isolated worktree or path-scoped sandbox, and apply containment to every write-capable adapter. Fail closed when a native adapter cannot enforce the requested boundary."
    },
    {
      "severity": "P0",
      "dimension": "security",
      "title": "cli-opencode silently ignores read-only and workspace-write sandbox modes",
      "file": ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs",
      "line": 1630,
      "evidence": "The cli-opencode adapter always uses --dir process.cwd(). It adds --dangerously-skip-permissions only for danger-full-access; read-only and workspace-write produce no permission or sandbox flag. The worker still records the resolved sandbox mode, while its own comments state that the lineageDir boundary is prompt-only, and containment excludes cli-opencode.",
      "recommendation": "Reject unsupported sandbox modes instead of recording them as effective. Use an isolated worktree or a genuinely enforced read-only/path-scoped mechanism, and fail closed when OpenCode cannot provide the requested policy."
    },
    {
      "severity": "P1",
      "dimension": "security",
      "title": "Write containment exempts pre-existing dirty paths by pathname only",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts",
      "line": 295,
      "evidence": "detectNewOutOfScopeViolations builds a Set of preDispatchDirtyPaths and skips any post-dispatch path found in that set. The comparison is path-only: a child can overwrite, truncate, or delete an already-dirty file outside its artifact directory and the guard will treat the path as an exempt pre-existing change.",
      "recommendation": "Snapshot file content or repository blob identity before dispatch and compare it afterward. Prefer clean isolated worktrees for write-capable children; do not exempt a path solely because it was dirty at startup."
    },
    {
      "severity": "P1",
      "dimension": "security",
      "title": "Containment fails open when the artifact scope is outside the worktree",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts",
      "line": 238,
      "evidence": "resolveArtifactScope returns null when the artifact realpath is outside the Git worktree, and detectNewOutOfScopeViolations returns an empty violation list when scope is null. fanout-run.cjs validates the base directory against the physical spec-folder path, while its namespace validation is lexical; a repository-local symlink to an external spec location can therefore pass dispatch validation and cause containment to be skipped.",
      "recommendation": "Canonicalize spec and artifact paths before validation, require their realpaths to remain inside the intended worktree, and treat an unresolved or external scope as a hard dispatch failure rather than an empty violation set."
    },
    {
      "severity": "P1",
      "dimension": "security",
      "title": "Standalone Codex dispatch forwards the entire parent environment",
      "file": ".opencode/skills/system-deep-loop/runtime/scripts/codex-dispatch.cjs",
      "line": 122,
      "evidence": "dispatchCodex calls spawnSync with env: { ...process.env, AI_SESSION_CHILD: '1' }. Unlike the fanout executor environment builder, this passes unrelated credentials, configuration variables, NODE_PATH, and other process controls into the external Codex child.",
      "recommendation": "Reuse an explicit executor environment allowlist and pass only required authentication, locale, path, and session variables. Exclude unrelated provider secrets, module-loading controls, and arbitrary user configuration."
    }
  ],
  "refutations": [
    {
      "id": "F-010-03",
      "verdict": "deepened",
      "reason": "The fanout worker destructures only command, args, and input from buildLineageCommand before calling runLineageProcess. The returned effective configuration and invocation fingerprint are not carried into the actual spawn, so the security-relevant executor and sandbox identity remains detached from execution."
    }
  ],
  "coverage": {
    "filesExamined": 18,
    "keyPaths": [
      ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs",
      ".opencode/skills/system-deep-loop/runtime/scripts/codex-dispatch.cjs",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/permissions-gate.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/council/multi-seat-dispatch.cjs",
      ".opencode/commands/deep/assets/deep-research-auto.yaml",
      ".opencode/commands/deep/assets/deep-research-confirm.yaml",
      ".opencode/commands/deep/assets/deep-review-auto.yaml",
      ".opencode/commands/deep/assets/deep-review-confirm.yaml",
      ".opencode/skills/system-deep-loop/deep-research/assets/deep-research-config.json",
      ".opencode/skills/system-deep-loop/deep-review/assets/deep-review-config.json",
      ".opencode/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/executor-selection-contract.md",
      ".opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/permissions-gate.vitest.ts",
      ".opencode/skills/system-deep-loop/runtime/feature-catalog/state-safety/permissions-gate.md"
    ]
  }
}
```