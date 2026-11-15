# Deep Research: What the `cli-mistral-vibe` deep-loop executor kind adds

**Topic:** In one short paragraph: what does the deep-loop executor kind `cli-mistral-vibe` add?
**Packet:** `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind`
**Lineage:** `vibe-1` (executor `cli-mistral-vibe`, model `deepseek-flash`)
**Iterations:** 1 of 1
**Status:** complete

## Table of Contents

1. The Deliverable in One Paragraph
2. Findings, Ranked
3. The Config Surface the Kind Adds
4. The Adapter the Kind Adds
5. The Scoring the Kind Adds
6. The Guards the Kind Adds
7. The Dispatch Contract the Kind Adds
8. Implementation Status Against the Packet
9. Test Coverage
10. Eliminated Alternatives
11. Divergence Map
12. Open Questions
13. References
14. Convergence Report

---

## 1. The Deliverable in One Paragraph

The `cli-mistral-vibe` executor kind adds Mistral Vibe as a ninth deep-loop executor, and it adds it as a fan-out-only, print-mode lineage runner rather than as another single-executor CLI. It contributes four things the eight earlier kinds did not have together: a deliberately narrow config surface (`model`, `timeoutSeconds`, `liveTools` — no reasoning, sandbox or persona field, because Vibe pins thinking per roster row and exposes no such flags); a dedicated adapter that gives every lineage its own `VIBE_HOME`, prompt file and output folder and launches `vibe --prompt-file … --output-dir … --trust --model … --auto-approve` behind a PATH, exact-version and roster preflight; the fan-out's first per-lineage outcome read from an executor's own `export.json`, which turns Vibe's exit 3 into a recorded `partial` that never counts as success; and a Vibe-specific guard set — a three-name recursion match on `vibe`/`vibe-rs`/`vibe-app-server` and an env allowlist that passes `VIBE_` and `MISTRAL_API_KEY` while denying an inherited `VIBE_HOME`. Both deep-loop YAMLs refuse single-executor use of the kind and point at `--count=2` or a second `--executor` group.

## 2. Findings, Ranked

| # | Finding | Priority | Source |
|---|---------|----------|--------|
| 1 | The kind adds a per-lineage outcome read from `vibe-output/export.json`: exit 0 with `exit_code` 0 is success, exit 3 with an export is `partial` and never success, anything else is failure. This is the fan-out's first per-lineage partial outcome. | P0 | `fanout-run.cjs:3131-3152`, `:4244-4250`, `:4477-4485` |
| 2 | The kind adds a dedicated adapter, `buildVibeLineageCommand`, that runs print mode only with a lineage-local `VIBE_HOME`, prompt file, output folder, `--trust` and `--auto-approve`. | P0 | `fanout-run.cjs:3154-3250`, `:3256` |
| 3 | The kind adds a three-part preflight: `command -v vibe`, an exact `3.1.2` version gate run in a throwaway home outside the checkout, and a roster check against `VIBE_ALLOWED_MODELS`. | P0 | `fanout-run.cjs:3101-3102`, `:3163-3190` |
| 4 | The kind adds a three-name recursion guard (`vibe`, `vibe-rs`, `vibe-app-server`) and a Vibe env allowlist that passes `VIBE_` plus `MISTRAL_API_KEY` and denies an inherited `VIBE_HOME`. | P0 | `executor-audit.ts:77`, `:108`, `:174`, `:190`, `:199` |
| 5 | The kind's config surface is the narrowest of the CLI kinds: `model`, `timeoutSeconds`, `liveTools` only. | P1 | `executor-config.ts:11-22`, `:141` |
| 6 | The kind is fan-out only, enforced by an `if_cli_mistral_vibe` branch in both deep-loop YAMLs that exits 2. | P1 | `deep-research-auto.yaml:1223-1232` |
| 7 | Model selection is by roster alias, not provider model name, and the allowlist is enforced twice — at parse time and at command-build time. | P1 | `executor-config.ts:301-307`, `:705-712`; `fanout-run.cjs:3186-3190` |
| 8 | The kind is implemented and tested while its own packet still reads `Status: Planned` with every AC `Unmet`. | P2 | `spec.md:24`, `acceptance-criteria.md:44` |

## 3. The Config Surface the Kind Adds

`cli-mistral-vibe` is the ninth entry in `EXECUTOR_KINDS`. Its `EXECUTOR_KIND_FLAG_SUPPORT` row is `['model', 'timeoutSeconds', 'liveTools']` — the shortest row of any CLI kind. The omissions are deliberate and each is documented in place: Vibe has no reasoning flag, so thinking is pinned per roster row in `.vibe/config.toml`; it has no OS sandbox flag, so `sandboxMode` is rejected rather than recorded as an effective boundary; and it has no persona surface, so `agentPersona` is absent. `EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY` records `false` for the kind with the reason that the roster row, not a confinement flag, decides what the model may reach. `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX` records `inherit: true` only, because no Vibe web-search switch is confirmed.

[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:11-22]
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:141]
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:168]
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:229-235]

## 4. The Adapter the Kind Adds

`buildVibeLineageCommand` is registered in `LINEAGE_COMMAND_ADAPTERS` beside the eight existing builders. It writes the prompt to `<lineage>/vibe-prompt.txt` so the prompt stays out of the process list, copies the repository `.vibe/config.toml` into a fresh `<lineage>/vibe-home`, writes a `trusted_folders.toml` naming the resolved lineage directory, and builds:

```
vibe --prompt-file <lineage>/vibe-prompt.txt \
     --output-dir <lineage>/vibe-output \
     --trust --model <alias> --auto-approve
```

with `cwd` at the lineage directory and `env: { VIBE_HOME: <lineage>/vibe-home }`. The lineage directory is `realpathSync`-resolved before the trust entry is written, because Vibe matches trust entries against the resolved cwd and a lineage under a symlinked temp root would otherwise load no project config. `resolvedSandbox` and `resolvedPermission` are recorded as `null` rather than echoing the requested values, because Vibe exposes no confinement flag and recording one would claim a boundary the process never had.

[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3154-3250]
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3256]

## 5. The Scoring the Kind Adds

`resolveVibeLineageOutcome` is the fan-out's first per-lineage verdict read from an executor's own export record rather than from the pool's settle status:

| Observed | Verdict |
|----------|---------|
| exit 0, `export.json` present, `exit_code` 0, `outcome` absent or `finished` | `success` |
| exit 3, `export.json` present | `partial` — recorded, never counted as success |
| anything else, including exit 0 with no export | `failure` |

The distinction matters because `RECURSION_GUARD_EXIT_CODE = 3` in `executor-audit.ts` and Vibe also uses exit 3 for a run stopped without finishing. The export record is what separates the two: a recursion-guard refusal leaves no `export.json`, so it scores `failure`, while a Vibe-side stop leaves one and scores `partial`. The verdict travels through the pool's bounded error shape as `VIBE_PARTIAL_REASON` and is read back into `result.outcome` for Vibe lineages only.

[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3131-3152]
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4305-4315]
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4477-4485]

## 6. The Guards the Kind Adds

The ancestor walk matches three names for this kind rather than one, because the Python launcher execs away and a running Vibe appears as `vibe-rs` or `vibe-app-server`, never as `vibe`. The env filter passes the `VIBE_` prefix and the single key `MISTRAL_API_KEY`; `VIBE_HOME` is listed as lineage state and then explicitly denied, so a leaf cannot inherit the operator's Vibe state even though the prefix would otherwise match it. The kind carries no session-env entry, because Vibe's session variable is unconfirmed and the table stays absent rather than carrying a guessed name.

[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:77]
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:108]
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:174]
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:190]
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:199]

## 7. The Dispatch Contract the Kind Adds

The kind is fan-out only. Both deep-loop YAMLs carry an `if_cli_mistral_vibe` branch that prints `cli-mistral-vibe runs only as a fan-out lineage; rerun with --count=2 or a second --executor group, or choose another executor kind` and exits 2 before any dispatch receipt is written. The reason is structural: the lineage-local `VIBE_HOME`, the output folder and the export scoring all live in the fan-out adapter, so a single-executor invocation would have nowhere to put them. This follows the `cli-deepseek-harness` precedent.

[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1223-1232]
[SOURCE: specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind/goal.md:44]

## 8. Implementation Status Against the Packet

The packet and the tree disagree. `spec.md` records `Status: Planned` and `acceptance-criteria.md` records every row as `Unmet`, yet the kind is present in all three runtime files, the stress fixture `tests/stress/cli-adapter/cli-mistral-vibe.vitest.ts` exists, `live-contracts.json` and `matrix-manifest.ts` both name the kind, and the three unit suites carry 34 `cli-mistral-vibe` references between them. The contradiction is recorded rather than resolved: resolving it needs to know whether the packet's status is stale bookkeeping or a deliberate hold pending the keyed run that an unset `MISTRAL_API_KEY` blocks, and neither is decidable from the files alone.

[SOURCE: specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind/spec.md:24]
[SOURCE: specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind/acceptance-criteria.md:44]
[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/live-contracts.json:50]
[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/matrix-manifest.ts:13]

## 9. Test Coverage

| Layer | Artifact | What it covers |
|-------|----------|----------------|
| Unit | `tests/unit/executor-config.vitest.ts` (18 refs) | Kind membership, flag support, `VIBE_SUPPORTED_MODELS`, parse-time rejection |
| Unit | `tests/unit/executor-audit.vitest.ts` (7 refs) | Recursion names, env allowlist, `VIBE_HOME` denial |
| Unit | `tests/unit/fanout-run.vitest.ts` (9 refs) | `buildVibeLineageCommand`, export scoring, partial outcome |
| Stress | `tests/stress/cli-adapter/cli-mistral-vibe.vitest.ts` | Adapter fixture against a shimmed `vibe` |
| Contract | `live-contracts.json`, `matrix-manifest.ts` | The kind in the live contract and the matrix |

[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-mistral-vibe.vitest.ts]
[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/live-contracts.json:50]
[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/matrix-manifest.ts:13]

## 10. Eliminated Alternatives

- **Comparing Mistral model quality against other executor kinds.** The topic asks what the kind adds to the runtime, not how well its models perform. No benchmark evidence exists in the packet, and a quality claim would need a keyed run that an unset `MISTRAL_API_KEY` blocks. (iteration 1)
- **Treating the packet's `Status: Planned` as the current implementation state.** The runtime source and test tree contradict it, so the status was recorded as drift rather than as evidence the kind is unbuilt. (iteration 1)
- **Reading the ACP supervisor as part of the kind.** `spec.md` lists it as out of scope and the adapter builds print mode only. (iteration 1)
- **Documenting a single-executor invocation path.** The YAML branch exists but deliberately refuses the kind, so there is no such path. This is a settled design decision (D4), not a gap. (iteration 1)

## 11. Divergence Map

- **Saturated directions:** none. One iteration ran, so no direction has been tried from multiple angles.
- **Pivots taken:** none.
- **Pivot failures:** none.
- **Audited overrides:** none.
- **Council artifact references:** none.
- **Remaining frontier:** the unresolved packet-versus-tree status contradiction in section 8, and the unobserved keyed end-to-end lineage that `MISTRAL_API_KEY` blocks.

## 12. Open Questions

1. Is the packet's `Status: Planned` with every AC `Unmet` stale bookkeeping, or a deliberate hold pending the keyed run? The files cannot decide it.
2. Does a live `cli-mistral-vibe` lineage actually write `vibe-output/export.json` with `exit_code` 0? The scoring path was read from source, not observed, because `MISTRAL_API_KEY` is unset.
3. Does the exit 3 `partial` path behave as specified against a real Vibe stop, as opposed to the shim the stress fixture uses?

## 13. References

- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind/goal.md`
- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind/spec.md`
- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind/acceptance-criteria.md`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- `.skilled/commands/deep/assets/deep-research-auto.yaml`
- `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/live-contracts.json`
- `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/matrix-manifest.ts`
- `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-mistral-vibe.vitest.ts`
- `research/iterations/iteration-001.md` (this lineage)

`resource-map.md` is not present in the packet; no map citation is included.

## 14. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 1
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 1: what the cli-mistral-vibe executor kind adds (ratio 1.0)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.
