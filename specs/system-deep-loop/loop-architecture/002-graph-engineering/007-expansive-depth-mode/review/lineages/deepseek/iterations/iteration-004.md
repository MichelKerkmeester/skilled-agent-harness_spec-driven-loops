# Review Iteration 004

## Dispatcher

- Mode: review (deep-review LEAF, inline executor for this detached lineage)
- Session: `fanout-deepseek-1795201537192-sq1ivw`, generation 1, lineageMode `new`
- Iteration: 4 of 24
- Focus: **Frontier node F-1-002: security**
- Dimension: security
- Frontier node: F-1-002 (depth 1 of 3), scope `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`, `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- Convergence before dispatch: `CONTINUE` / `noStopCandidate`, stuck 0, consecutive failures 0.
- Sources read this iteration: `steer.md` (absent), `deep-review-config.json`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `frontier-nodes.jsonl`, the three node files, both presentation assets, both compiled contracts.

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:100-200` (common env allowlist, per-kind prefixes, per-kind single keys, deny keys, state-dir keys, default homes)
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1078-1102` (`buildExecutorDispatchEnv`)
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1404-1425` (`DISPATCH_ENV_KEYS`, `assertDispatchEnvAllowed`)
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:112-143` (flag support, including the new pi and dsh `sandboxMode` entries)
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2976-2992` (opencode inline-config merge)
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3392-3448` (pi builder, read-only tool allowlist)
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3456,3574-3585` (dsh persona name grammar and patch path)
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4532-4620` (dispatch env assembly and the post-filter merge)
- `.skilled/commands/deep/assets/deep-review-presentation.txt:226`
- `.skilled/commands/deep/assets/deep-research-presentation.txt:199`
- `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown:371`
- `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown:350`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Both presentations and both compiled contracts still say `cli-pi` has "no sandbox flag" while the config now accepts `sandboxMode` for it** -- `.skilled/commands/deep/assets/deep-review-presentation.txt:226` -- This range added `sandboxMode` to `EXECUTOR_KIND_FLAG_SUPPORT['cli-pi']` (`executor-config.ts:134`) and the builder maps `read-only` onto `--tools read,grep,find,ls --no-extensions --no-skills --no-prompt-templates` (`fanout-run.cjs:3418-3420`). The per-kind help line still reads "No `--service-tier`, no sandbox flag", and the same sentence is carried into `deep-research-presentation.txt:199` and both compiled contracts. An operator who reads the shipped help concludes `--sandbox-mode` is unsupported for pi and does not request `read-only`, which is the only restriction a pi lineage has.
   - Finding class: cross-consumer
   - Scope proof: `rg -n "cli-pi —" .skilled/commands/deep` returns the four occurrences named above and no others; `rg -n "'cli-pi'" executor-config.ts` shows the single flag-support row that now includes `sandboxMode`. The sentence is defensible as "pi has no OS sandbox flag", which is why this is P2 rather than P1: the config field is accepted and the capability record calls the surface `tool-allowlist`, so the code's own contract is accurate.
   - Affected surface hints: ["deep-review-presentation.txt", "deep-research-presentation.txt", "compiled deep-review contract", "compiled deep-research contract", "EXECUTOR_KIND_FLAG_SUPPORT"]
   - Case: an operator wants a read-only pi lineage for a review that must not write. The help says pi has no sandbox flag, so they leave `--sandbox-mode` unset; the lineage runs at the `workspace-write` default, which for pi emits no restriction at all, and the leaf keeps write-capable tools.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | partial | `.skilled/commands/deep/assets/deep-review-presentation.txt:226`, `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:134` | The shipped help contradicts the flag-support table for pi; the rest of the executor help matches the schema. |
| `checklist_evidence` | notApplicable | - | No spec checklist for a commit-range target. |
| `skill_agent` | notApplicable | - | No agent definition in the range. |
| `agent_cross_runtime` | notApplicable | - | No runtime mirror in the range. |
| `feature_catalog_code` | pending | - | Owned by F-1-006; not re-run here. |

## Integration Evidence

- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4532,4580` spreads the built command's `env` into `extraEnv` after `buildExecutorDispatchEnv`'s per-kind filter, so the opencode `external_directory` deny is the value the child sees even when the parent set its own `OPENCODE_CONFIG_CONTENT`.
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2991` applies the deny last (`external_directory: 'deny'` after the spread of the inherited `permission` object), so an inherited `permission.external_directory: 'allow'` cannot win.
- `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:504-523` forwards the same `env` as `dispatchEnv`, and `executor-audit.ts:1413` admits `OPENCODE_CONFIG_CONTENT` for `cli-opencode`, so the single-executor path carries the deny too.

## Edge Cases

- **`HOME` reaches every child.** The common allowlist admits `HOME`, `USER` and `LOGNAME` so CLI auth can find the operator's credentials. That is the intended trust boundary: the child runs as the operator. Recorded as a boundary, not a finding.
- **`OPENCODE_` is a broad prefix.** It admits `OPENCODE_CONFIG_CONTENT` (needed) and `OPENCODE_HOME` (needed for state isolation) and any other `OPENCODE_*` value the operator exports. The deny merge makes the config key safe; no other `OPENCODE_*` key was found to weaken confinement.
- **dsh persona path.** `DSH_PERSONA_NAME` is `^[a-z0-9][a-z0-9-]{0,63}$` (`fanout-run.cjs:3456`), so a persona name cannot carry `/`, `.` or `..`; the patch path is built from a validated segment. No traversal path found.
- **pi `workspace-write` is a no-op.** The builder emits the same argv for `workspace-write` and `danger-full-access`, and `sandboxEnforcementFor` reports `none` for both. The capability record says `tool-allowlist`, which is accurate. The doc drift in P2-1 is the operator-facing consequence.

## Confirmed-Clean Surfaces

- **Opencode deny cannot be re-enabled by inheritance.** The merge sets `external_directory: 'deny'` after spreading the inherited permission object, and an unparseable or non-object inherited value fails the build rather than being replaced.
- **Dispatch env allowlist is per-kind.** `buildExecutorDispatchEnv` filters the parent environment to the common allowlist plus the kind's prefixes and single keys, then appends the dispatch stack. No kind admits another kind's credential prefix.
- **Deny keys override prefixes.** `EXECUTOR_ENV_DENY_KEYS_BY_KIND` removes the state-home variables a broad prefix would otherwise admit (`VIBE_HOME`, `DSH_HOME`), so a lineage cannot inherit the operator's harness state.
- **`assertDispatchEnvAllowed` fails closed.** A caller-named dispatch env key outside `DISPATCH_ENV_KEYS` throws before a receipt is written or a child is spawned.

## Ruled Out

- **An inherited `OPENCODE_CONFIG_CONTENT` bypassing the deny.** Ruled out: the deny is applied last and an unparseable inherited value is refused.
- **dsh persona path traversal.** Ruled out by the name grammar, which admits no path separator or dot.
- **A P1 for the pi help drift.** Ruled out: the sentence is defensible as "no OS sandbox flag", the config field is accepted, and the capability record states the real surface. Kept at P2 with that reasoning recorded.
- **A secret-leak finding from the per-kind env prefixes.** Ruled out: each prefix is the kind's own credential namespace, and the deny table removes the state-home names a prefix would otherwise carry.

## Next Focus

- Dimension: security
- Frontier node: F-1-004 (active, correctness covered; the reducer's breadth-first rule selects the shallowest node with the fewest visits)
- Focus area: the gateway's trust boundary: whether a caller-supplied `stem` or `event_type` can name an event the mode's authority does not allow, whether the `--run-directory` binding can be pointed at another run, and whether the projection can be made to write outside the run directory.
- Reason: F-1-002 security produced one P2 doc drift and no P0/P1; the gateway is the next trust boundary and has had only a correctness pass.
- Rotation status: F-1-002 correctness and security covered; F-1-004 security next.
- Blocked/productive carry-forward: productive (help-to-schema comparison found the pi drift); no blocked approaches.
- Required evidence: `append-mode-event.cjs` binding resolution, the ledger's run-directory validation, and the projection writer's path construction.
- Recovery note: none.

Review verdict: PASS
