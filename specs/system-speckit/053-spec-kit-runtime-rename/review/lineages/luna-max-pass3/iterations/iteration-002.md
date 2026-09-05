---
title: Deep Review Iteration 002 - security
sessionId: fanout-luna-max-pass3-1788565027234-d7pbnn
mode: review
dimension: security
---

# Iteration 002: security

## Route and scope

This pass executed inline under the bound `artifact_dir`. No nested executor was started. The selected files were:

- `.opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts`
- `.opencode/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts`
- `.opencode/skills/system-spec-kit/runtime/tests/user-prompt-submit-shim.vitest.ts`
- `.opencode/skills/system-spec-kit/runtime/tests/directive-lifecycle-boundary-bridge.vitest.ts`
- `.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`
- `.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs`
- `.opencode/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs`
- `.opencode/skills/system-spec-kit/runtime/tests/embedders/model-server-perimeter.vitest.ts`
- `.opencode/bin/lib/model-server-supervision.cjs`
- `.claude/settings.json`

## Review result

The Claude shims only honor absolute regular-file overrides and otherwise use the install-anchored ancestor walk. Their child execution is bounded by input/output caps and timeouts. Focused tests cover a valid absolute file, relative input, dangling link, and directory override at `user-prompt-submit-shim.vitest.ts:46-78`. The directive bridge uses the same regular-file check and has a failed-child test at `directive-lifecycle-boundary-bridge.vitest.ts:68-74`.

Gate-3 containment canonicalizes both project and target through real paths before exemptions at `spec-gate-core.mjs:1217-1248`, and the focused suite covers escaping and in-repo symlinks at `spec-gate-core.test.mjs:1431-1476`. Devin permission requests deny malformed or unknown tool classes and delegate writes and commands to shared policies at `permission-request-policy.mjs:115-142,160-175`. The model-server perimeter tests cover symlinked socket directories and nodes, ownership, and stale-socket reclaim.

F002 remains active as a traceability issue only. No new security finding was established. The explicit hook override is documented as trusted operator or test input in `runtime/ENV-REFERENCE.md:184-185`, so it is an advisory hardening consideration rather than a release blocker for this rename.

## Cross-reference checks

| Protocol | Result | Evidence |
|---|---|---|
| `spec_code` | partial | Security-sensitive moved adapters and their direct tests align. |
| `checklist_evidence` | partial | The packet still lacks `checklist.md` and has not closed T009. |
| `skill_agent` | notApplicable | Not a skill-agent target. |
| `agent_cross_runtime` | notApplicable | No agent runtime implementation is under review. |
| `feature_catalog_code` | partial | Out of bounded scope. |
| `playbook_capability` | partial | Only directly listed security anchors were inspected. |

## Search ledger

- `hook_target_resolution`: covered and ruled out for normal operation. Explicit overrides remain trusted-input surface.
- `path_traversal`: covered and ruled out by native realpath containment and symlink tests.
- `bounded_process_input`: covered and ruled out by finite stdin, stdout, timeout and JSON handling.
- `permission_fail_closed`: covered and ruled out by malformed and unknown-class deny paths.
- `network_bind_auth`: covered and ruled out for the reviewed model-server boundary.
- Graph coverage: unavailable, with direct producer and consumer tracing used instead.

## Convergence telemetry

`newFindingsRatio=0.12`, `convergenceScore=0.18`, `convergenceThreshold=3`, `decision=CONTINUE`, `telemetryOnly=true`. Early convergence cannot synthesize the run.

## Next focus

Traceability review across packet claims, exact old-path searches, preserved advisor ownership, and acceptance status.

Review verdict: PASS
