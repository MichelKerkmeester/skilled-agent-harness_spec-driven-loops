# Iteration 7 — correctness

## Dimension

Correctness: shell-shim wrapper discovery, interactive versus pass-through classification, TTY handling, and Hermes project-plugin environment.

## Files Reviewed

- .skilled/bin/skilled-loop-shell.sh:28-45, 54-179, 187-214
- .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs:8-58, 85-125, 147-203
- .hermes/plugins/repo-guards/__init__.py:5-20, 33-36
- .hermes/plugins/repo-guards/plugin.yaml:1-15
- specs/hooks/023-session-relaunch-loop/review/lineages/luna/steer.md:1-26

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Review Evidence

- The shim resolves only the seven named runtimes, skips nested loop launches, filters commands that do not open a session, and walks from PWD toward the filesystem root for the nearest .skilled/bin/skilled-loop.
- The wrapper lookup tests create a repository whose .skilled entry is a symlink, then check both the repository root and nested directories under both Bash and zsh. The interactive and pass-through matrices cover all seven shell functions.
- The launch function checks both stdin and stdout for a terminal before resolving a wrapper. Without both, it invokes the runtime binary directly.
- The Hermes wrapper invocation sets HERMES_ENABLE_PROJECT_PLUGINS=1 only as an environment prefix for that wrapped command. The next Claude launch and the caller shell remain unset in the inspected test case. The Hermes bridge documents this project-plugin opt-in, and plugin.yaml exposes the on_session_end and post_api_request hooks the handover path uses.
- No shim-classification, wrapper-discovery, TTY, or Hermes environment defect was identified in this pass. The code comments say the static pass-through lists come from each runtime's own help; source review found no counterexample in the listed cases.

## Traceability Checks

- spec_code: shell-shim behavior matches the lead's requirement to start interactive sessions through the nearest wrapper while allowing noninteractive commands to pass through.
- checklist_evidence: deferred to a later traceability pass.
- skill_agent: deferred to iteration 9 for the handoff command contract.
- agent_cross_runtime: checked all seven shell runtime functions; automatic and command-only paths remain distinct in the shim.

## Edge Cases and Ruled Out

- A linked .skilled directory is discoverable from the linking repository and its nested directories through the tested shell shim path.
- A session already carrying SKILLED_LOOP_ID does not enter a second wrapper.
- Unknown runtimes and directories without a wrapper resolve to no wrapper.
- Hermes project plugins are enabled for a wrapped Hermes launch without leaking the switch into the following command or the caller shell.
- If stdin or stdout is not a TTY, the shim bypasses the wrapper.

## SCOPE VIOLATIONS

- scope_violation: the workflow step_graph_upsert would write shared coverage-graph storage outside this lineage; it was skipped under the lineage-only write boundary.
- scope_violation: the workflow step_graph_convergence would append observability data to the shared graph database; no write-mode graph command was run. Graph work remains graphless_fallback under the configured max-iterations policy.

## EXECUTION CONFLICT

The reducer strategy marks dimensions complete and continues to label deferred chain directions as BLOCKED after one pass. The lead steer requires review of every runtime and chain stage, so the ten-iteration review continues against that steer.

## Next Focus

Trace realpath and state/config resolution through a linking repository whose .skilled directory is a symlink, then inspect the actual Claude, Codex, Pi, OpenCode, and Hermes hook registrations.

Review verdict: PASS

