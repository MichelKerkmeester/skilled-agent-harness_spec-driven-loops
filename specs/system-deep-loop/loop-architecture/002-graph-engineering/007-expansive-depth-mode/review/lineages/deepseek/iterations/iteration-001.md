# Review Iteration 001

## Dispatcher

- Mode: review (deep-review LEAF, inline executor for this detached lineage)
- Session: `fanout-deepseek-1795201537192-sq1ivw`, generation 1, lineageMode `new`
- Iteration: 1 of 24
- Focus: **Frontier node F-1-002: correctness**
- Dimension: correctness
- Frontier node: F-1-002 (depth 1 of 3), scope `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`, `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- Sources read this iteration: `steer.md` (absent), `deep-review-config.json`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `frontier-nodes.jsonl`, the three node files, `executor-adapter-capabilities.vitest.ts`, `dispatch-iteration.cjs`, `deep-review/references/protocol/loop-protocol.md` (opencode paragraph).

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:112-307` (flag support, adapter capability record, preventive-sandbox record)
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2809-2840` (`emittedPermissionMode`, `sandboxEnforcementFor`, `finalizeLineageCommand`)
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2870-3048` (codex, claude, opencode builders)
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3392-3448` (pi builder)
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3560-3626` (dsh builder)
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4142-4188` (sandbox default resolution for a lineage)
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4532-4620` (dispatch env assembly)
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1404-1425` (`DISPATCH_ENV_KEYS`, `assertDispatchEnvAllowed`)
- `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:439-523,761-792` (single-executor opencode dispatch env)
- `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-adapter-capabilities.vitest.ts:212-348` (conformance test)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **dsh `danger-full-access` is narrowed to `workspace-write` while provenance records the requested mode and `none` enforcement** -- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3605` -- The dsh builder maps every non-`read-only` mode onto `--permission-mode workspace-write`, so a lineage that asked for `danger-full-access` runs confined to the workspace. `finalizeLineageCommand` then records `sandboxMode: "danger-full-access"` from the request and, because `sandboxEnforcementFor` treats `danger-full-access` as unconfined (`fanout-run.cjs:2821-2824`), records `sandboxEnforcement: "none"`. The emitted argv and the recorded provenance therefore disagree in both directions: the child is more confined than requested, and the record claims less confinement than the child has. `EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY['cli-deepseek-harness']` is `true` (`executor-config.ts:305`), which is the record the label contradicts.
   - Finding class: class-of-bug
   - Scope proof: `rg -n "permission-mode" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` shows one dsh emission site (3605) and one claude emission site (2919); the dsh collapse exists only at 3605. `rg -n "sandboxEnforcementFor" ...` shows the single label site (2819-2825). The conformance test that is supposed to catch drift (`executor-adapter-capabilities.vitest.ts:308-312`) asserts only that `read-only` differs from `danger-full-access`, so the `workspace-write` == `danger-full-access` collapse is invisible to it.
   - Affected surface hints: ["dsh command builder", "sandboxEnforcementFor", "invocation-metadata effectiveConfig", "executor adapter conformance test"]
   - Case: an `--executors` matrix row sets `sandboxMode: "danger-full-access"` for a `cli-deepseek-harness` lineage. The child runs under `--permission-mode workspace-write` with `--approval-policy never`, while `invocation-metadata.json` reports `sandboxMode: "danger-full-access"` and `sandboxEnforcement: "none"`. An operator or the merge reading that record concludes the lineage ran unconfined when it did not, and a lineage that needs to write outside the workspace fails with no recorded reason.

2. **The `auto-approve-flag` sandbox surface now describes a flag that is no longer mode-discriminating** -- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:165-170` -- The `ExecutorSandboxSurface` doc defines `auto-approve-flag` as "an auto-approve flag that only the unconfined mode turns on". This range moved `--auto` into the unconditional argv of the opencode builder (`fanout-run.cjs:3010-3019`), so `workspace-write` now carries `--auto` as well, and the record still labels the surface `auto-approve-flag` (`executor-config.ts:246-252`). A reader who uses the union's doc to infer that `--auto` implies `danger-full-access` gets the wrong answer for every opencode lineage.
   - Finding class: instance-only
   - Scope proof: `rg -n "\-\-auto" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` shows a single push site reached by both write modes; `rg -n "auto-approve-flag" .skilled/` shows the union member and its one record row only, so no other kind depends on the old meaning.
   - Affected surface hints: ["ExecutorSandboxSurface doc", "cli-opencode capability record", "opencode command builder"]
   - Case: a maintainer reads `ExecutorSandboxSurface` to decide whether an `--auto` in a captured argv proves the lineage ran unconfined. Under `workspace-write` the argv also contains `--auto`, so the inference is wrong and the reader either over-trusts or over-fears the flag depending on the direction they read it.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | partial | `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:294` | The protocol's opencode paragraph matches the builder: `--auto` always, inline `external_directory` deny under `workspace-write`, read-only refused. No drift found in that paragraph. The dsh sandbox paragraph was not located in this iteration, so the protocol is recorded `partial` rather than `pass`. |
| `checklist_evidence` | notApplicable | - | The review target is a commit range of implementation, docs and tests, not a spec packet with a checklist. Recorded `notApplicable` with `applicable: false`. |
| `skill_agent` | notApplicable | - | No agent definition is in the commit range. |
| `agent_cross_runtime` | notApplicable | - | No runtime mirror is in the commit range. |
| `feature_catalog_code` | pending | - | The runtime feature catalog is in scope (`runtime/feature-catalog/executor/executor-config.md`) but belongs to node F-1-006, not this node. Deferred there rather than recorded as run. |
| `playbook_capability` | pending | - | Manual-testing playbooks are in scope but belong to F-1-006. Deferred there. |

## Integration Evidence

- `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:504-523,761-792` forwards `buildLineageCommand`'s `env` as `dispatchEnv`, and `executor-audit.ts:1413` admits `OPENCODE_CONFIG_CONTENT` for `cli-opencode`, so the workspace-write deny reaches the child in the single-executor path as well as the fan-out path (`fanout-run.cjs:4532,4580`). Verified as a matched pair, not assumed.
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2642` merges the built command's env over the dispatch env only when `cwd` is set; the opencode builder always sets `cwd` (`fanout-run.cjs:3036`), so the deny is not dropped by the spawn path.

## Edge Cases

- **Commit-range target.** `reviewScopeFiles` is the 88-file `git diff --name-only` list, not a glob expansion; `frontier-admit.cjs scope` confirmed 88 touched files. Files deleted by the range have nothing to review and were not counted.
- **`danger-full-access` for dsh may be intentional narrowing.** The builder comment does not say so, and no test asserts it. Recorded as a provenance mismatch (P2) rather than a security regression, because the narrowing is fail-safe.
- **`sandboxEnforcementFor`'s `confines` heuristic is shared.** The same expression decides `preventive` for codex, claude, cursor and dsh. Only dsh can emit a mode other than the requested one, so the heuristic is correct for the other kinds; the finding is scoped to dsh rather than to the helper.

## Confirmed-Clean Surfaces

- **codex sandbox argv.** `fanout-run.cjs:2891` passes `--sandbox <resolvedSandbox>` verbatim, and the capability record's `sandbox-flag`/preventive `true` pair matches it.
- **pi read-only allowlist.** `fanout-run.cjs:3418-3420` adds `--tools read,grep,find,ls --no-extensions --no-skills --no-prompt-templates` only for `read-only`, and `compensatingControl` is derived from that same argv, so the label cannot drift from the command.
- **opencode read-only refusal.** `fanout-run.cjs:2832-2839` fails closed for any mode other than `workspace-write`/`danger-full-access`, matching the capability comment that no read-only boundary exists.
- **opencode inline-config merge.** `fanout-run.cjs:2976-2992` refuses an unparseable or non-object inherited `OPENCODE_CONFIG_CONTENT` instead of replacing it, and preserves unrelated keys.
- **Adapter capability record shape.** `executor-config.ts:197-279` holds one frozen record per kind, and `executor-adapter-capabilities.vitest.ts:213-220` asserts the key set and frozen-ness.

## Ruled Out

- **`--auto` on opencode as a privilege regression.** Ruled out: `read-only` is refused before spawn, and `workspace-write` pairs `--auto` with an `external_directory` deny that is covered by `dispatch-iteration.vitest.ts:504-528` and `fanout-run.vitest.ts:3826-3914`. The residual Bash write path is documented in the builder warning and in `loop-protocol.md:294`.
- **A separate finding for the conformance test's weak `permission-mode` assertion.** Ruled out as a duplicate: it is the reason P2-1 escaped, and it is recorded in that finding's scope proof rather than counted twice.
- **`emittedPermissionMode` misreporting another kind's flag.** Ruled out: it reads the argv it was given and each builder emits its own vocabulary; no cross-kind value is reused.
- **`DISPATCH_ENV_KEYS` blocking the fan-out merge.** Ruled out: `assertDispatchEnvAllowed` runs only in `runAuditedExecutorCommand`, and the fan-out path assembles `extraEnv` itself.

## Next Focus

- Dimension: security
- Frontier node: F-1-002 (still active; correctness covered, security next)
- Focus area: the same three files, read for trust boundaries rather than mode plumbing: whether the opencode `external_directory` deny can be bypassed by an inherited `OPENCODE_CONFIG_CONTENT` key ordering, whether `buildExecutorDispatchEnv`'s per-kind allowlist admits a secret-bearing variable for any kind, and whether the dsh persona patch path can escape `.dsh/agents`.
- Reason: correctness on this node produced two P2 provenance findings and no P0/P1; the node's remaining risk is the trust boundary between the parent environment and the child process, which correctness did not examine.
- Rotation status: F-1-002 correctness complete; security next.
- Blocked/productive carry-forward: productive (direct builder-to-record comparison found both findings); no blocked approaches.
- Required evidence: `executor-audit.ts` env allowlist table, `buildExecutorDispatchEnv`, and the dsh patch path resolution.
- Recovery note: none.

Review verdict: PASS
