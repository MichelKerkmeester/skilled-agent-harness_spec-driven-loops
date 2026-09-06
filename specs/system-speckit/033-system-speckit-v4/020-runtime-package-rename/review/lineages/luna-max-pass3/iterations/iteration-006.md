---
title: Deep Review Iteration 006 - security replay
sessionId: fanout-luna-max-pass3-1788565027234-d7pbnn
mode: review
dimension: security
---

# Iteration 006: security replay

## Route and scope

This pass executed inline under the bound `artifact_dir`. No nested executor was started. The selected files were:

- `.opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts`
- `.opencode/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts`
- `.opencode/skills/system-spec-kit/runtime/tests/user-prompt-submit-shim.vitest.ts`
- `.opencode/skills/system-spec-kit/runtime/tests/directive-lifecycle-boundary-bridge.vitest.ts`
- `.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`
- `.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs`
- `.opencode/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs`
- `.opencode/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.test.mjs`
- `.opencode/bin/lib/model-server-supervision.cjs`
- `.opencode/skills/system-spec-kit/runtime/tests/embedders/model-server-perimeter.vitest.ts`
- `.opencode/plugins/system-spec-gate.js`

## Review result

The replay found no new issue. The two Claude override functions use `isAbsolute` plus `statSync(...).isFile()` and fall back when the path is relative, missing, dangling, or a directory. The tests cover those cases. The normal resolution path remains an ancestor walk anchored from the installed module location. Gate-3 canonicalizes symlink and case variants before deciding containment, with focused tests for escape and in-repo links. Devin’s permission policy denies malformed requests, unsupported tool classes, and policy failures. The model-server supervision boundary rejects unsafe socket paths and rechecks stale nodes before unlinking.

F001 and F002 remain active P2 findings from earlier dimensions. The explicit override remains a trusted operator/test-input surface, as documented in `runtime/ENV-REFERENCE.md:184-185`; it is not promoted to P1 because it is not an ambient default and the source documents the trust boundary.

No P0 or P1 finding was observed. No claim-adjudication packet is required.

## Cross-reference checks

| Protocol | Result | Evidence |
|---|---|---|
| `spec_code` | partial | Security paths and direct tests align with the move. |
| `checklist_evidence` | partial | No checklist file; T009 and AC-010 remain open until packet closure work. |
| `skill_agent` | notApplicable | Not a skill-agent target. |
| `agent_cross_runtime` | notApplicable | No agent implementation is under review. |
| `feature_catalog_code` | partial | Excluded by scope. |
| `playbook_capability` | partial | Excluded except listed anchors. |

## Search ledger

- `hook_override_scope`: covered and ruled out as a release-blocking defect. The trust boundary is explicit and tests cover path-shape rejection.
- `path_traversal_classification`: covered and ruled out by realpath containment and symlink tests.
- `permission_fail_closed`: covered and ruled out by the Devin policy’s deny defaults and catch path.
- `network_bind_auth`: covered and ruled out for the local socket perimeter.
- `bounded_process_input`: covered and ruled out for both Claude bridges.
- Graph coverage: unavailable, with direct producer and consumer tracing.

## Convergence telemetry

`newFindingsRatio=0`, `convergenceScore=0.08`, `convergenceThreshold=3`, `decision=CONTINUE`, `telemetryOnly=true`.

## Next focus

Traceability replay of exact residue, symlink targets, runtime mirrors, preserved advisor ownership, and packet evidence.

Review verdict: PASS
