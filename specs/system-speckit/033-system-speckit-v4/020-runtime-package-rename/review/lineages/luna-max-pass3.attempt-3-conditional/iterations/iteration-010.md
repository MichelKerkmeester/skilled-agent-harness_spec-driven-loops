# Deep Review Iteration 10

## Review metadata

- Session: fanout-luna-max-pass3-1788562574615-h6l4fh
- Target: .opencode/specs/system-speckit/053-spec-kit-runtime-rename
- Dimension: security
- Angle: hook override scope, Gate 3 path classification, Devin permission policy, and model-server bind/request authorization
- Prior active findings: DR-001, DR-002, DR-003, DR-004
- Executor: inline cli-codex, model gpt-5.6-luna

## Evidence reviewed

- The Claude prompt hook and directive lifecycle boundary accept explicit absolute regular-file overrides, then otherwise use a bounded install-anchored ancestor walk. The spawned process has bounded input, output, timeout, and kill settings. [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:37-68,91-128] [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts:30-75]
- Gate 3 resolves lexical and real paths before applying repository, specs, dist, node_modules, and temporary-directory exemptions. Child sessions with `AI_SESSION_CHILD=1` short-circuit before state reads or writes, and unexpected evaluation errors fail open. [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1217-1249,1265-1291,1406-1447]
- Devin permission handling requires the complete PermissionRequest identity, classifies only known write and exec tools, and denies malformed, unknown, or evaluation-failure cases. [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs:32-46,84-87,115-175]
- The model server rejects non-loopback binds unless remote binding and a non-empty token are explicitly enabled, then checks authorization on every request. [SOURCE: .opencode/bin/hf-model-server.cjs:175-203,320-331,970-988]
- The only residual security issue is the previously recorded operator-controlled override scope. No new P0 or P1 security issue was found.

## Finding refinement

### DR-002 [P2] Hook target overrides accept any regular absolute file

- File: .opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:37-55; .opencode/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts:30-45
- Evidence: An explicit environment override is accepted when it is absolute and resolves to a regular file. It is not constrained to the repository or an approved runtime root. The normal install-anchored walk is bounded and does not share this property. The process boundary limits stdin, stdout, and execution time.
- Finding class: instance-only
- Scope proof: The finding applies only to the two explicit override variables. Gate 3 path policy, Devin unknown-tool handling, child-session no-op behavior, and model-server transport authorization are separate controls and passed review.
- Affected surface hints: Claude lifecycle shims, installer environment, hook hardening tests
- Recommendation: Document the override as trusted operator or test-only input, or constrain it to an approved root.

## Cross-reference result

- Hook execution bounds: PASS. Input, output, timeout, and nonzero-exit handling are bounded and fail open.
- Gate 3 path policy: PASS. Realpath-aware containment and child-session short-circuit behavior are explicit.
- Devin permission policy: PASS. Identity and policy failures deny.
- Model-server transport: PASS. Non-loopback opt-in requires a non-empty token and every request is authorized.
- Override scope: CONDITIONAL under DR-002.

## Dimension result

- Security: PASS with one P2 advisory, DR-002. No P0 or P1 security finding was added.
- Correctness: CONDITIONAL because DR-001 and DR-004 remain active.
- Maintainability: CONDITIONAL with DR-003.
- Traceability: CONDITIONAL because AC-006 remains overstated and AC-010/T009 remain open.
- New findings: 0 P0, 0 P1, 0 P2. Refined findings: DR-002.
- Convergence: telemetry only. The configured maximum is reached, so this run now proceeds to synthesis.

## Synthesis handoff

All ten iterations completed inline. Early convergence signals were telemetry only. Final active findings are DR-001 and DR-004 at P1, plus DR-002 and DR-003 at P2. The release-readiness verdict is CONDITIONAL.

Review verdict: CONDITIONAL
