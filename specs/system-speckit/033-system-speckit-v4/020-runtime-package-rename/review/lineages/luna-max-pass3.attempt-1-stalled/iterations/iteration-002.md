# Deep Review Iteration 2

## Review metadata

- Session: `fanout-luna-max-pass3-1788556809353-mcpewh`
- Target: `.opencode/specs/system-speckit/053-spec-kit-runtime-rename`
- Dimension: security
- Angle: hook process boundaries, path containment, and dependency ownership
- Executor: inline `cli-codex`, model `gpt-5.6-luna`, max effort, fast tier
- Prior active finding carried forward: `DR-001` (P1 correctness)

## Evidence reviewed

- Claude and lifecycle bridges walk from their module location to the repository `.opencode` root, use fixed advisor-relative targets, bound child input/output, and time out the child. `[SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts:17-23,30-63]` `[SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:19-55,78-115]`
- Codex, Devin, Cursor, and Pi adapters validate bounded input or normalize the expected shape before spawning the existing Claude owner with a bounded output buffer and timeout. `[SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/codex/shared.ts:51-87,94-119]` `[SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/devin/shared.ts:70-127]` `[SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/cursor/shared.ts:120-163]` `[SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/pi/lib/claude-hook-adapter.ts:33-59]`
- The spec-gate path classifier canonicalizes symlinks and nearest existing ancestors before checking project containment and exemptions, preventing lexical `..` or symlink escapes from being misclassified. `[SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1172-1248]`
- Session-stop limits test-only script overrides and uses fixed runtime/scripts candidates otherwise. `[SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:59-87]`
- The HF model-server entry remains rooted through the Spec Kit package resolution seam; no runtime package ownership change was found in the reviewed source. `[SOURCE: .opencode/bin/hf-model-server.cjs:430-475]`

## Finding

### DR-002 — P2 security advisory — hook target override is not constrained to a regular in-tree file

The Claude user-prompt shim accepts any existing path supplied through `SPECKIT_USER_PROMPT_TARGET` and then executes it with the current process environment. The override is documented as a test/install seam, so this is not an evidence-backed privilege boundary break in the normal fixed-target path; however, an ambient environment value can redirect the hook to an arbitrary existing executable path. The directive-lifecycle shim has the same shape. `[SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:37-47]` `[SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:78-93]` `[SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts:30-37]`

Impact: defense-in-depth only for a same-user process environment; fixed repository target resolution remains bounded and fail-open. Suggested remediation is to require a regular file and an explicit test mode or approved root for the override, with tests for outside-root and directory values. This remains P2 because the override is operator-controlled and the normal path is not redirected.

## Dimension result

- Security: PASS with one P2 hardening advisory; no P0 or P1 security finding.
- Correctness: carried forward `DR-001`; no new correctness finding.
- Traceability: not yet reviewed.
- Maintainability: not yet reviewed.
- New findings: 0 P0, 0 P1, 1 P2.
- Convergence: telemetry only; continue because the stop policy is `max-iterations`.

## Ruled-out security directions

- Symlink/path escape in spec-gate classification: ruled out by realpath-based containment and explicit outside-repo exemption. `[SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1193-1248]`
- Unbounded hook payload/child output: ruled out by input limits, output limits, and timeout settings across the adapters reviewed above.
- Advisor ownership confusion: the fixed target intentionally points at the preserved `system-skill-advisor/mcp-server` package named by the packet’s preserved set. `[SOURCE: .opencode/specs/system-speckit/053-spec-kit-runtime-rename/spec.md:65-68]`

## Next angle

Iteration 3 broadens to traceability: reconcile the spec/plan/tasks/acceptance claims with live package paths, lockfile/dependency decisions, route references, and the packet’s required residue and review evidence.

Review verdict: PASS
