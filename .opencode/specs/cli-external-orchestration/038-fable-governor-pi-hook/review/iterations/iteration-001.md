# Deep Review Iteration 001

## Dimension

correctness

## Files Reviewed

- .opencode/hooks/dispatch/lib/dispatch-audit.mjs:27-37, 186-262
- .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs:1-330
- .opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs:71-143
- .opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs:13-85
- .opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts:236-303
- .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts:110-252
- .opencode/hooks/dispatch/pi/dispatch-audit.ts:20-41
- .opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:65-106
- .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:163-210
- .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/006-dispatch-authorization-hardening/checklist.md:117-120
- .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/009-injection-contract-directive-sync/spec.md:109-117

## Findings by Severity

### P0

None.

### P1

#### R1-P1-001 — Quoted executor forms bypass Pi dispatch inspection

- File: .opencode/hooks/dispatch/lib/dispatch-audit.mjs:186-193
- Claim: A user can execute a quoted external CLI through Pi Bash without the explicit-executor authorization check because the parser silently classifies the command as non-dispatch.
- Evidence: directExecutor rejects any quoted executable token, and hasDispatchEvidence excludes quoted executor tokens. inspectDispatch therefore returns kind none for the shell-equivalent command "devin" -p "task". matchDispatchShape delegates to inspectDispatch, while the Pi preflight exits before authorization for kind none. The old DISPATCH_SHAPES regex still expresses the broader shape, but it is no longer consulted by matchDispatchShape.
- Finding class: cross-consumer
- Scope proof: The producer is dispatch-audit.mjs:186-221 and 229-262; the downstream consumers are the Pi preflight inspection path and the Pi audit adapter. The existing factory tests cover transform ordering and session mismatch, but not quoted or path-qualified executor tokens.
- Affected surface hints: shell inspector; Pi preflight; Pi audit; dispatch-shape tests
- Counterevidence sought: Whether the Pi/Bash runtime rejects quoted executable tokens before this hook, or whether another mandatory guard reclassifies kind none.
- Alternative explanation: Rejecting quoted tokens may have been intended as conservative shell parsing, but quote removal is unambiguous for a standalone executable token and the earlier regex-based shape accepted the same form.
- Final severity: P1
- Confidence: 0.98
- Downgrade trigger: Only if upstream Pi rejects quoted executable tokens before this hook or a separate mandatory guard covers them.
- Recommendation: Normalize quote-safe executable tokens or classify these forms as ambiguous, then add inspectDispatch and registered Pi tool_call coverage for quoted and path-qualified executors.

### P2

None.

## Traceability Checks

- Core / spec_code: partial — Phase 006 covers raw capture and authorization matrices, but the quoted-executor equivalence class is absent.
- Core / checklist_evidence: partial — existing focused receipts cover transform order and session mismatch; they do not cover the discovered parser false negative.
- Overlay / skill_agent: not applicable in this correctness pivot.
- Overlay / agent_cross_runtime: deferred to a later dimension.
- Overlay / feature_catalog_code: not applicable.
- Overlay / playbook_capability: not applicable.

## Verdict

FAIL — one P1 correctness finding blocks a clean review verdict. No P0 or P2 findings were established.

## Next Dimension

security. Revisit the deferred receipt-binding and write-containment seams, then check injection and bridge boundaries.

Review verdict: FAIL
