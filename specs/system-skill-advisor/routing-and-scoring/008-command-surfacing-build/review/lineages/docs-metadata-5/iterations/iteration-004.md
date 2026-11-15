# Review Iteration 004

## Dimension

Primary dimension: **security**. The pass checked holdout hygiene, prompt-leak claims and the two switch sentences that carry privacy weight: the direct-call kill switch and the launcher's daemon environment.

Review focus addressed: the operator focus asks for holdout hygiene and the direct-call switch paths. This iteration checked every scoped document for holdout file references or prompt-text leakage, then read the CLI's disable check and the launcher's child-environment allowlist at their exact call sites. No prompt corpus was opened; the check is path-and-code only.

## Dispatcher

- Mode: review, detached fan-out lineage `docs-metadata-5`.
- Session: `fanout-docs-metadata-5-1794760565927-i99t40`, generation 1, new lineage.
- Budget: 60 tool calls, 10 minutes. Consumed: 4 calls, about 2 minutes.
- Prior state: 8 open P2 findings, 0 P0, 0 P1; traceability, maintainability and correctness covered.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:55-78` (health record and direct-call switch)
- `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:23-27` (switch list and abstain order)
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1534-1545` (`invokeAdvisorRecommendPayload` disable check)
- `.skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:77-99` (flag resolution)
- `.skilled/bin/system-skill-advisor-launcher.cjs:131-180` and `312-345` (child environment allowlist)
- `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:440-500` (health record serialization and summary)
- Scoped holdout scan: all 14 scope files.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None. This iteration is clean. Three switch claims and the holdout rule checked out against code and the scoped text.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | No top-level spec reference; phase children `028-direct-call-off-switch` and `029-direct-call-kill-switch` own the switch intent. |
| `checklist_evidence` | core | notApplicable | No top-level `checklist.md`. |
| `skill_agent` | overlay | pass | The catalog's switch prose matches `advisor-disabled.ts` and the CLI call site. |
| `agent_cross_runtime` | overlay | pass | The launcher allowlist and the daemon-environment boundary were read at their exact lines. |
| `feature_catalog_code` | overlay | pass | The direct-call sentence is correct on order and scope. |
| `playbook_capability` | overlay | notApplicable | No playbook file changed this iteration. |

## Integration Evidence

- `invokeAdvisorRecommendPayload()` calls `disabledRecommendOutput(args)` before `invokeToolPayload(...)`, with the comment that the switch belongs to the caller and is answered before a daemon or local scorer is touched.
- `advisorDisabledBy()` resolves the switch through `hookFlags.hookFlagDecision('skill-advisor', ...)`, so the direct call and the hooks share one rule.
- `CHILD_ENV_ALLOWLIST` in the launcher has no advisor disable flag, and the comment at the force-local row states the switch is read by each caller and never by the shared daemon.
- `metrics.ts` serializes health records through `serializeAdvisorHookDiagnosticRecord()`; the record fields are runtime, status, freshness, duration and cache, with no prompt text.
- The changelog's sample record matches those fields and carries no prompt.
- Vibe passes `writeDiagnostic: () => {}`, so the runtime list's omission of Vibe is correct rather than a leak path.

## Edge Cases

- A quoted user prompt in a playbook scenario is prompt text, but it is scenario-authored, not a holdout row. The scoped documents quote only their own scenario prompts and never a corpus row, so no leakage finding exists.
- The changelog reports aggregate counts for sealed rows ("44 sealed plain rows", "28 of 45", "33 of 45", "8 of the 24 sealed decline rows"). These are counts only and do not identify a split row; the holdout rule permits counts.
- The launcher's allowlist is an allowlist, not a denylist. A future disable flag could be added to it by mistake, but no such key is present now; the finding would need a concrete key and none exists.
- The direct-call sentence says the switch is read "before it reaches a daemon and before the local scorer runs"; the code order proves both.
- No prompt corpus was opened. Holdout hygiene holds.

## Confirmed-Clean Surfaces

- No scoped document names `command-prompts.jsonl`, `holdout-prompts.jsonl` or `behaviour-fresh-prompts.jsonl`, and none prints a prompt attributed to a holdout split.
- The direct-call kill switch is read in the caller's process before any daemon connection or local scoring.
- The launcher forwards no advisor disable flag to the daemon child.
- The health record carries no prompt, skill label or error text unless `SKILL_ADVISOR_DEBUG` is set, and the changelog says exactly that.
- The sample health record in the changelog matches the serializer's field set.
- No scope violation occurred; no file outside the lineage directory was written.

## Ruled Out

- Holdout prompt leakage through a scoped document: none; no file path or attributed row.
- A kill switch that resolves after the daemon call: ruled out by the call order.
- A switch forwarded into the shared daemon: ruled out by the allowlist.
- Prompt text in the health record: ruled out by the serializer and the changelog's own sample.
- A Vibe health-record leak: ruled out by the no-op diagnostic writer.

## Next Focus

- Dimension: none remaining. All four configured dimensions have a full iteration.
- Focus area: synthesis only.
- Reason: `maxIterations=4` is reached with all dimensions covered and no active P0 or P1.
- Rotation status: complete.
- Blocked/productive carry-forward: none.
- Required evidence: the terminal convergence decision and the finding registry.
- Recovery note: none; no failed iteration.

Review verdict: PASS
