# Deep Review Iteration 2

## Review metadata

- Session: fanout-luna-max-pass3-1788562574615-h6l4fh
- Target: .opencode/specs/system-speckit/053-spec-kit-runtime-rename
- Dimension: security
- Angle: hook registration, process-boundary target resolution, environment-derived paths, and isolation
- Prior active findings: DR-001
- Executor: inline cli-codex, model gpt-5.6-luna

## Evidence reviewed

- The Claude and directive lifecycle shims resolve their normal target by walking from the installed module location to the preserved skill-advisor package. The walk is bounded to 14 ancestors. [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:19,50-68] [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts:17-19,43-55]
- Both shims accept an environment override when it is absolute and names a regular file. The override is not restricted to the repository or a dedicated test root. [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:37-55] [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts:30-45]
- Child execution is bounded by stdin and stdout caps, timeouts, SIGKILL, and JSON validation. [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:75-88,91-127] [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts:58-75]
- Gate path classification canonicalizes symlinked ancestors and exempts only documented roots after real-path containment checks. Child sessions short-circuit without state access. [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1176-1248,1265-1291,1406-1447]
- Hook registrations use the moved runtime path. The Devin fallback message still names the old generic package directory. [SOURCE: .devin/hooks.v1.json:35] [SOURCE: .claude/settings.json:28-90] [SOURCE: .codex/hooks.json:43-79] [SOURCE: .cursor/hooks.json:6-76]
- The HF model server binds only loopback hosts and resolves dependencies from the system-spec-kit package root. [SOURCE: .opencode/bin/hf-model-server.cjs:61,189,331,452]

## Finding

### DR-002 [P2] Hook target overrides accept any regular absolute file

- File: .opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:41-55
- Evidence: SPECKIT_USER_PROMPT_TARGET and the directive equivalent bypass the install-anchored advisor target whenever an operator-provided absolute regular file exists. The child receives the full inherited environment and is executed by the current Node process boundary. This is an explicit install or test escape hatch, not an unauthenticated remote input path, so the impact is advisory rather than a P0 or P1 exploit.
- Finding class: instance-only
- Scope proof: The reviewed fixed-target walk remains bounded and every adapter applies finite stdin, stdout, and timeout limits. The finding is limited to the two explicit override variables.
- Affected surface hints: Claude hook shims, install override contract, hook hardening tests
- Recommendation: Document the override as trusted operator or test-only input and optionally require the selected file to resolve beneath an approved repository or installation root. Add outside-root, directory, dangling-link, timeout, and oversized-output tests.

## Ruled out

- No path traversal was found in the shared Gate-3 core. Both lexical and real-path containment are checked before in-repository classification. [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1217-1248]
- No unbounded child execution was found in the reviewed Claude shims. Input, output, timeout, and JSON parsing guards are present. [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:75-127]
- No non-loopback HF server bind was found in the moved consumer path. [SOURCE: .opencode/bin/hf-model-server.cjs:61,331]

## Dimension result

- Security: PASS with one P2 defense-in-depth advisory. No P0 or P1 security defect was confirmed.
- Correctness: still CONDITIONAL because DR-001 remains active.
- Traceability: not yet reviewed.
- Maintainability: not yet reviewed.
- New findings: 0 P0, 0 P1, 1 P2.
- Convergence: telemetry only. The max-iterations policy requires continued review.

## Next angle

Iteration 3 broadens to traceability: compare the rename contract with the spec, plan, tasks, acceptance evidence, lockfile ownership, and live documentation.

Review verdict: CONDITIONAL
