# Review Iteration 013

## Dispatcher

- Mode: review (deep-review LEAF, inline executor for this detached lineage)
- Session: `fanout-deepseek-1795201537192-sq1ivw`, generation 1, lineageMode `new`
- Iteration: 13 of 24
- Focus: **Frontier node F-2-007: correctness**
- Dimension: correctness
- Frontier node: F-2-007 (depth 2 of 3, child of F-1-002), scope `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-adapter-capabilities.vitest.ts`
- Convergence before dispatch: `CONTINUE` / `noStopCandidate`, stuck 0, consecutive failures 0.
- Sources read this iteration: `steer.md` (absent), `deep-review-config.json`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `frontier-nodes.jsonl`, `fanout-run.cjs` builders and `sandboxEnforcementFor`, `executor-config.ts` capability records.

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2817-2825` (`sandboxEnforcementFor`)
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2870-2907` (codex)
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2909-2960` (claude)
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2994-3048` (opencode)
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3160-3230` (cursor)
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3290-3340` (devin)
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3392-3448` (pi)
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3560-3626` (dsh)
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:281-307` (preventive record and its comments)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **`sandboxEnforcementFor` cannot see the fan-out containment guard, so a devin workspace-write lineage records `none` although the capability record names that guard as its compensating control** -- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3337` -- The devin builder sets `compensatingControl: resolvedSandbox === 'read-only'`, so `workspace-write` and `danger-full-access` both report `sandboxEnforcement: none`. The capability record's own comment says devin's confinement for write lineages "is the fan-out's post-hoc write-containment guard, not an OS boundary" (`executor-config.ts:303`), and the builder comment repeats it. The guard runs for every lineage, but `sandboxEnforcementFor` only sees the command's own arguments, so the recorded value omits the control the record says is the confinement.
   - Finding class: class-of-bug
   - Scope proof: `rg -n "compensatingControl" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` shows the devin site at 3337 and the other builders' sites; `sandboxEnforcementFor` at 2819-2825 reads only `input.confines` and `input.compensatingControl`. The containment guard's enablement is at `fanout-run.cjs:4650-4655` (`containmentEnabled = true`), outside the builder's view.
   - Affected surface hints: ["devin command builder", "sandboxEnforcementFor", "invocation-metadata effectiveConfig", "fan-out write-containment guard"]
   - Case: a devin workspace-write lineage writes a path outside its lineage directory. The containment guard detects, records and quarantines it, but `invocation-metadata.json` says `sandboxEnforcement: none`, so an auditor reading the provenance concludes no control ran at all and cannot tell the guard's report from an unguarded run.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | partial | `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:303`, `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3337` | The capability record and the builder agree on the mechanism but disagree on what the recorded label should say for devin workspace-write. |
| `checklist_evidence` | notApplicable | - | No spec checklist for a commit-range target. |
| `skill_agent` | notApplicable | - | No agent definition in the range. |
| `agent_cross_runtime` | notApplicable | - | No runtime mirror in the range. |

## Integration Evidence

- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4650-4655` enables the write-containment guard for every dispatch kind (`containmentEnabled = true`), so the control the devin record names is real and runs; the gap is only that the label does not mention it.
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2821-2824` derives the label from `confines` and `compensatingControl` alone, and neither field can express a runner-level guard.
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:303` states the devin compensating control in prose, which is the only place it is recorded.

## Edge Cases

- **The label describes the command, not the run.** Read that way, `none` for devin workspace-write is accurate: the command carries no restriction. The finding is that the field's name and the record's comment invite the other reading, and no other field carries the guard.
- **The dsh case is the opposite direction.** R1-P2-001 reports a command that is confined while the label says `none`; this finding reports a runner-level control the label cannot see. Both are provenance fidelity, not behavior.
- **Cursor's read-only is labeled `compensating`.** `--mode plan` is an approval mode and the builder sets `compensatingControl` from its presence, which is the correct label for that mechanism.
- **Claude's workspace-write is labeled `preventive`.** The record justifies it as the CLI's tool gate running before a write/exec, and print mode cannot run Bash. The label is consistent with the record even though `acceptEdits` auto-approves edits; the record is the authority, so this is not reported as a finding.

## Confirmed-Clean Surfaces

- **Codex.** `--sandbox` is passed through, `confines` follows the mode, and the label is `preventive` for the two confined modes and `none` for full access.
- **Opencode.** `workspace-write` sets `compensatingControl` and the label is `compensating`; `danger-full-access` is `none`; `read-only` is refused before the label is computed.
- **Cursor.** `--sandbox enabled` yields `preventive`, `--sandbox disabled` yields `none`, and `--mode plan` yields `compensating`.
- **Pi.** `read-only` adds the tool allowlist and `compensatingControl` is derived from that same argv, so the label cannot drift from the command.
- **Vibe.** No sandbox surface, no compensating control, `none` in every mode, matching the record.

## Ruled Out

- **A P1 for claude's `preventive` label under `acceptEdits`.** Ruled out: the capability record is the stated authority and justifies the entry as the CLI's tool gate running before a write/exec, and print mode cannot run Bash. Recorded as a judgment call rather than a finding.
- **A duplicate of R1-P2-001.** Ruled out: that finding is the dsh command being confined while the label says `none`; this one is a runner-level guard the label cannot see.
- **A finding for the containment guard itself.** Ruled out: it runs for every kind and reports out-of-scope writes; the gap is the label, not the guard.

## Next Focus

- Dimension: security
- Frontier node: F-2-007 (still active; security next)
- Focus area: whether the containment guard's quarantine copy can itself write outside the lineage directory, and whether a devin `danger-full-access` lineage's guard report is distinguishable from an unguarded run.
- Reason: F-2-007 correctness produced one P2; the node's remaining risk is the guard's own write path, which correctness did not examine.
- Rotation status: F-2-007 correctness complete; security next.
- Blocked/productive carry-forward: productive (builder-by-builder matrix comparison found the devin gap); no blocked approaches.
- Required evidence: the containment guard's quarantine path construction and its report fields.
- Recovery note: none.

Review verdict: PASS
