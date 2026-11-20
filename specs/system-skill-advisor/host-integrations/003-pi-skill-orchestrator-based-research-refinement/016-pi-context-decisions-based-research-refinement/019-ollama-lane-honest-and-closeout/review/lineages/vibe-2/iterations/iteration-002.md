# Review Iteration 002

## Dispatcher

- Mode: review (fan-out lineage `vibe-2`)
- Session: `fanout-vibe-2-1795172940208-84a42n`, generation 1, lineageMode `new`
- Focus: Frontier node F-1-005, dimension `correctness`
- Review target type: `files`
- Operator review focus: the commit set `31ffd18beab`, `1ccbb3283c6`, `dc3979eb451`, `86038dfba80`, `c74042fd559`, `571575632a4`, `5c91b2f3f5d`, `0390556ee2b`, and the ten `docs(specs)` commits `2f5fe41bb9e`..`aaaff7dd9df`.

### How this iteration addressed the operator review focus

The focus asks whether a doc claim misleads an operator, and names the ablation result of 156 against 161 as the claim to check. This iteration read the two changelogs, the ablation feature-catalog page and the doctor embedder asset that commit `31ffd18beab` and `1ccbb3283c6` wrote, and checked each checkable statement against the code it names. The ablation pass bar, the corpus size, the environment variable names, the heartbeat thresholds and the doctor PASS/DEGRADED rules all hold. Two statements do not.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/changelog/v1.3.0.0.md:1-60`
- `.skilled/changelog/skilled/v4.1.0.0.md:216-232`
- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/ablation.md:1-60`
- `.skilled/skills/system-skill-advisor/runtime/tests/scorer/semantic-shadow-ablation.vitest.ts:1-441`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:234,1284`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:37`
- `.skilled/bin/system-skill-advisor-launcher.cjs:120-185,317-330,1554-1578`
- `.skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:86-150`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:195-245`
- `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:391-392`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl` (row count)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. R1-P1-001 from iteration 1 remains active and keeps this run at CONDITIONAL.

### P2 Findings

1. **The changelog says the launcher always sets `SYSTEM_SKILL_ADVISOR_DB_DIR`, but the code only fills it when the operator has not set it** -- `.skilled/changelog/skilled/v4.1.0.0.md:229` -- the changelog states "It always sets `SYSTEM_SKILL_ADVISOR_DB_DIR` for the daemon child." The launcher lists `SYSTEM_SKILL_ADVISOR_DB_DIR` in `CHILD_ENV_ALLOWLIST` (`system-skill-advisor-launcher.cjs:144`), so an operator value survives the filter, and the fill at `system-skill-advisor-launcher.cjs:326-328` is guarded by `if (filtered.SYSTEM_SKILL_ADVISOR_DB_DIR === undefined)`. The shipped behavior is the safer one; the sentence describes the opposite.
   Finding class: `traceability`
   Scope proof: the claim is in the declared review target `.skilled/changelog/skilled/v4.1.0.0.md`, and the code it names is in the declared target `.skilled/bin/system-skill-advisor-launcher.cjs`.
   Affected surface hints: `SYSTEM_SKILL_ADVISOR_DB_DIR` operator configuration, launcher child environment, heartbeat watchdog file location.
   Case: an operator sets `SYSTEM_SKILL_ADVISOR_DB_DIR` to a shared directory and reads the changelog. The changelog tells them the launcher always overrides it, so they conclude the setting is unsupported and remove it, losing a configuration the code honors.

2. **One changelog section cites two different corpus sizes for one measurement** -- `.skilled/changelog/skilled/v4.1.0.0.md:222` -- the "Ollama Off the Advisor Prompt Path" section says "The ablation scored 149 of 193 with the lane and 150 without" at line 222 and, three lines later at line 225, "The 196-prompt corpus had no embeddings". The corpus on disk has 196 rows (`labeled-prompts.jsonl`, 196 lines). The section never says whether three rows were excluded or the 193 is stale, so the two numbers cannot both describe the same run.
   Finding class: `traceability`
   Scope proof: both lines are in the declared review target `.skilled/changelog/skilled/v4.1.0.0.md`; the corpus row count is read from the declared target `.skilled/skills/system-skill-advisor`.
   Affected surface hints: `v4.1.0.0` changelog, `feature-catalog/scorer-fusion/ablation.md`, the ablation pass bar that keeps the lane weight at 0.
   Case: an operator compares the 149-of-193 figure in the prompt-path section with the 156-of-196 figure in the background-refresh section and cannot tell which corpus each used, so neither number can be reproduced or cited.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | partial | `.skilled/changelog/skilled/v4.1.0.0.md:229`, `.skilled/bin/system-skill-advisor-launcher.cjs:326` | Two changelog statements do not match the code they name. Recorded as R2-P2-001 and R2-P2-002. |
| `checklist_evidence` | notApplicable | `review/deep-review-config.json` `resource_map_present: false` | Files target, no checklist to reconcile. |
| `feature_catalog_code` | pass | `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/ablation.md:30-32`, `semantic-shadow-ablation.vitest.ts:389-394` | The catalog's ablation paragraph matches the test's pass bar and the registry default of 0. |

## Integration Evidence

- Ablation harness: `semantic-shadow-ablation.vitest.ts:326-345` runs the full arm with `laneWeightsOverride.semantic_shadow = 0.05` and the disabled arm with `disabledLanes: ['semantic_shadow']`, and asserts the exact-semantic rerank is off so the arms differ only in the lane.
- Pass bar: `semantic-shadow-ablation.vitest.ts:388-394` computes `lanePasses = fullCorrect > disabledCorrect && newNoneFires.length === 0` and asserts the registry default is 0 when the bar fails.
- `laneWeightsOverride` is honored: `fusion.ts:195` declares it and `fusion.ts:1284` passes it into weight resolution.
- Doctor embedder: `doctor-skill-advisor-embedder.yaml:148-149` reports PASS only on `coverageComplete` and a reachable backend, DEGRADED otherwise, and forbids FAIL on a zero lane weight.

## Edge Cases

- **Ambiguity: which corpus the 149-of-193 figure used.** The section does not name it. Recorded as R2-P2-002 rather than resolved by assuming the three rows were excluded.
- **Contradiction: two ablation results in one file.** 149/193 at line 222 and 156/196 at line 231 sit in different sections and may be two legitimate measurements. Both point the same direction, so the weight-0 conclusion is unaffected; only the corpus attribution is unclear.
- **Missing dependency: the ablation numbers are not asserted.** The test computes and logs `fullTop1Correct` and `disabledTop1Correct` but asserts only the pass bar, so the published 156 and 161 are a measurement record rather than a regression guard. Recorded, not converted into a pass.

## Confirmed-Clean Surfaces

- The corpus has 196 rows, matching the "196-row corpus" claim at `v4.1.0.0.md:231` and `ablation.md:30`.
- `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` is the real key (`lane-registry.ts:37`), is documented at `ENV-REFERENCE.md:391`, and is forwarded by the launcher (`system-skill-advisor-launcher.cjs:171`), so the "set it to turn the lane back on" instruction works.
- `OLLAMA_BASE_URL`, `OLLAMA_REQUEST_TIMEOUT_MS` and `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH` are in the child allowlist (`system-skill-advisor-launcher.cjs:184-189`), matching the forwarding claim.
- The heartbeat thresholds match the prose: `HEARTBEAT_STARTUP_GRACE_MS = 300_000` for "five minutes after spawn" and `HEARTBEAT_STALE_MS = 180_000` for "over three minutes old" (`system-skill-advisor-launcher.cjs:1557-1558,1571-1578`).
- `advisor_status` reports `vectorCoverage` with `stale` and `missing`, `commandVectorCoverage`, and `coverageComplete` (`advisor-status.ts:226-238`), matching the status claim.
- "Coverage requires at least one embeddable skill, so a command-only index can still reach the probe" matches `complete: skills.total > 0 && incompleteIds.length === 0` (`skill-graph-db.ts:1432`).

## Ruled Out

- **The ablation test compares two identical arms.** Ruled out: the full arm overrides the weight to 0.05 through `laneWeightsOverride`, which `fusion.ts:1284` honors, and the disabled arm disables the lane outright.
- **The ablation test would pass with the lane weight raised.** Ruled out: the assertion branches on the measured pass bar, so a passing measurement requires a nonzero default and a failing one requires 0.
- **The doctor route reports FAIL on a zero lane weight.** Ruled out: `doctor-skill-advisor-embedder.yaml:149` forbids it explicitly.

## Next Focus

- Dimension: `security`
- Focus area: frontier node F-1-002, security dimension — the `OLLAMA_*` passthrough, the launcher child environment allowlist, the database directory pin, and the trust boundary at the prompt-embedding adapter.
- Reason: F-1-005 correctness is complete; F-1-002 has `security` as its next uncovered dimension and the launcher changes are the security-relevant surface in the focus commit set.
- Rotation status: F-1-002 `correctness` complete, `security` next; F-1-005 `correctness` complete.
- Blocked/productive carry-forward: productive — reading the allowlist and the guard together produced a precise doc-versus-code finding.
- Required evidence: `git show 31ffd18beab` for the launcher and `.env.example` changes, plus the adapter's URL and timeout handling.
- Recovery note: none.

Review verdict: CONDITIONAL
