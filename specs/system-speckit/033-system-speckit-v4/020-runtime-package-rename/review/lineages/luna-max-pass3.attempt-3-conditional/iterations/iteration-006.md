# Deep Review Iteration 6

## Review metadata

- Session: fanout-luna-max-pass3-1788562574615-h6l4fh
- Target: .opencode/specs/system-speckit/053-spec-kit-runtime-rename
- Dimension: security
- Angle: adversarial replay of environment precedence, canonical paths, database isolation, and preserved boundaries
- Prior active findings: DR-001, DR-002, DR-003, DR-004
- Executor: inline cli-codex, model gpt-5.6-luna

## Evidence reviewed

- Devin permission requests require a complete event identity, classify only known write or exec tools, and deny malformed or unknown requests. [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs:32-46,84-87,115-143]
- The shared Gate-3 core resolves state at the repository root, canonicalizes symlinked paths, and applies containment before exemptions. [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:556-562,1176-1248]
- Child sessions short-circuit before gate state reads or writes. [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1265-1291,1412-1418]
- The HF model server refuses non-loopback binds without both explicit opt-in and a non-empty auth token, then checks authorization on each request. [SOURCE: .opencode/bin/hf-model-server.cjs:57-61,175-203,970-988]
- The reviewed adapters bound child input, output, and timeout and fail open on target or child errors. [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:37-55,75-127]

## Finding refinement

### DR-002 [P2] Hook target overrides accept any regular absolute file

- File: .opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:41-55
- Evidence: The adversarial replay confirms the override is limited to an absolute regular file but not to an approved root. The normal walk and all child resource bounds remain intact. Because the value is an operator or installer environment control, this remains a defense-in-depth P2 rather than an exploitable P0 or P1 issue.
- Finding class: instance-only
- Scope proof: The security replay covered both override variables, fixed-target ancestor walks, shared path canonicalization, child-session suppression, Devin policy classification, and model-server perimeter checks.
- Affected surface hints: Claude lifecycle shims, installer environment, hook hardening tests
- Recommendation: Keep the override trusted and explicit, or constrain it to an approved root and cover outside-root cases in focused tests.

## Ruled out

- A symlinked target cannot evade Gate-3 containment because both the repository and target are realpathed before the relative exemption checks. [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1193-1248]
- Child sessions cannot write or record state through the shared core because AI_SESSION_CHILD=1 returns before state access. [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1285-1291,1412-1418]
- Devin permission requests fail closed for malformed identities and unknown tool classes. [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs:84-87,136-143,160-175]
- The HF model-server move does not widen network exposure or remove request authorization. [SOURCE: .opencode/bin/hf-model-server.cjs:175-203,970-988]

## Dimension result

- Security: PASS with DR-002 as the only security advisory. No P0 or P1 security issue was confirmed.
- Correctness: CONDITIONAL because DR-001 and DR-004 remain active.
- Traceability: CONDITIONAL because AC-006 evidence remains unresolved.
- Maintainability: PASS with DR-003 advisory.
- New findings: 0 P0, 0 P1, 0 P2. Refined findings: DR-002.
- Convergence: telemetry only. Continue to the configured maximum.

## Next angle

Iteration 7 broadens traceability with a bounded exact-residue sweep and a reconciliation of preserved advisor references, live runtime docs, and package-level acceptance claims.

Review verdict: CONDITIONAL
