# Deep Review Iteration 3

## Dimension

Security documentation-truth audit: reviewed whether public README/AGENTS safety claims overstate or understate shipped autonomous Goal and Deep Loop fan-out guardrails.

## Files Reviewed

- `README.md:145-163` - install/configuration credential guidance for embedding providers.
- `README.md:778-818` - Deep Loop public autonomy and runtime safety claims.
- `README.md:1230-1233` - current Goal utility entry and autonomy guardrail wording.
- `AGENTS.md:20-143` - workflow, dispatch, and gate safety posture.
- `AGENTS_Barter.md:44-141` - Barter variant workflow, dispatch, and gate safety posture.
- `.opencode/plugins/mk-goal.js:37-60` - Goal autonomy environment constants and active modes.
- `.opencode/plugins/mk-goal.js:778-799` - atomic goal-state write behavior.
- `.opencode/plugins/mk-goal.js:1282-1316` - continuation prompt, caps, wall-clock and budget stop logic.
- `.opencode/plugins/mk-goal.js:1418-1498` - autonomy gate sequence: default-off, client/runtime checks, cooldown, blocked-prompt suppression.
- `.opencode/plugins/mk-goal.js:1728-1875` - plugin event hooks and goal tools.
- `.opencode/plugins/README.md:49` - plugin catalog contract for mk-goal.
- `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:35-59` - Goal plugin operator contract and environment controls.
- `.opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/009-convergence-design-and-hardening/spec.md:56-75` - shipped phase-009 hardening scope.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:290-305` - typed observability statuses for lag/stall/budget events.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1242-1292` - native and cli-opencode permission-bypass behavior.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1347-1355` - stall watchdog and lineage budget guard parsing.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1478-1492` - per-lineage budget-cap enforcement.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:459-529` - stall detection as time-since-last-progress, not queue backpressure.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:683-709` - lag-ceiling abort event emission.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:326-331` - near-duplicate dedup option/env control.

## Findings by Severity

### P0

None.

### P1

#### P1-004 [P1] Root Deep Loop docs omit the fan-out permission and guardrail safety posture

- Claim: The reviewed public Deep Loop section describes hands-off autonomous loops and trustworthy stops, but it does not disclose that fan-out can run OpenCode with `--dangerously-skip-permissions`, nor does it surface the phase-009 guardrails that bound and observe those autonomous subprocesses. This under-documents a security-relevant operator boundary for the same public surface that advertises autonomous execution.
- Evidence: `README.md:780` says loops run autonomous iterative workflows; `README.md:817-818` says they can run fully autonomous and carry executor config/state/scoring, but the reviewed README/AGENTS surfaces contain no `dangerously-skip-permissions`, stall watchdog, cost cap, or lag-ceiling wording except the unrelated Goal guardrail line at `README.md:1233`. The implementation shows native fan-out always includes `--dangerously-skip-permissions` at `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1246-1251`, cli-opencode adds it for `danger-full-access` lineages and warns that the lineageDir boundary is prompt-only at `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1280-1291`, and phase-009 guardrails exist at `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:290-305`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1347-1355`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1478-1492`, `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:459-529`, and `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:683-709`.
- Counterevidence sought: Searched reviewed surfaces for `dangerously-skip-permissions`, `stallWatchdog`, `stall watchdog`, `budget cap`, `cost cap`, `max_cost_units`, `lag_ceiling`, `near-duplicate`, `default-off`, `kill-switch`, and `cooldown`. README only exposes the Goal default-off/caps/cooldown/kill-switch line at `README.md:1233`; AGENTS only mentions generic default-off feature-flag gates at `AGENTS.md:350`.
- Alternative explanation: The root README may intentionally stay high-level while `.opencode/skills/deep-loop-runtime/README.md` documents fan-out internals. That does not fully mitigate this issue because the reviewed public README is the same surface that advertises autonomous Deep Loop execution and should name the key permission/sandbox boundary or link directly to it.
- Final severity: P1.
- Confidence: 0.86.
- Downgrade trigger: Downgrade to P2 if the product decision is that root README feature sections are marketing-only and the Deep Loop Runtime README is the sole operator contract, or if a reviewed root-surface link is added that explicitly names the permission-bypass and fan-out guardrail posture.
- Finding class: cross-consumer.
- Content hash: `docaudit-p1-004-deep-loop-fanout-autonomy-safety-posture-v1`.

### P2

None.

## Traceability Checks

- `feature_catalog_code`: Goal plugin autonomy guardrails are accurately represented in the current README utility entry: default-off continuation, caps/cooldown/kill-switch, atomic fail-closed state, and plugin-contract link are consistent with `.opencode/plugins/mk-goal.js` and `goal_plugin.md`.
- `spec_code`: Phase-009 hardening scope in `spec.md:56-75` is reflected in runtime code for stall/lag observability, budget cap, and near-duplicate dedup configuration, but not in the reviewed root README/AGENTS safety surfaces.
- `checklist_evidence`: No checklist mutation in this LEAF review iteration; evidence is captured in this iteration narrative, the JSONL state append, and the per-iteration delta.
- Credential/auth scan: README install/configuration guidance still presents cloud embedding keys as opt-in provider choices and did not show a stale credential or auth claim tied to phase-009 fan-out hardening.

## Verdict

CONDITIONAL. One new P1 finding was added for security-relevant documentation omission on the public autonomous Deep Loop surface. Existing P1s remain active.

## Next Dimension

Continue under `stopPolicy=max-iterations`: broaden into traceability/maintainability cross-checks for whether fixes to README Goal and Spec Kit naming would also require metadata, feature catalog, and changelog synchronization.

Review verdict: CONDITIONAL
