# Review Iteration 002

## Dispatcher

- Mode: review (fan-out lineage `vibe-1`)
- Session: `fanout-vibe-1-1795172940208-84a42n`, generation 1, lineageMode `new`
- Iteration: 2 of 16
- Dimension: correctness
- Frontier node: F-1-004 (depth 1 of 3) -- status and doctor surfaces
- Operator review focus: the commits `31ffd18beab`, `1ccbb3283c6`, `dc3979eb451`, `86038dfba80`, `c74042fd559`, `571575632a4`, `5c91b2f3f5d`, `0390556ee2b` and the ten `docs(specs)` commits, read at HEAD, reporting defects in shipped behavior only.
- How this iteration addressed the focus: it read the status and doctor half of `31ffd18beab` and `1ccbb3283c6` at HEAD -- `advisor_status`'s semantic-lane health, the schema, the doctor setup and embedder assets, and the create-command bridge gate -- which is the focus's "status and doctor coverage" clause.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:163-260` (`readSemanticLaneHealth`)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:382-420` (`probeSemanticLaneBackend`)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:534-580` (`includeSemanticHealth` wiring)
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:248-272` (`semanticLaneHealthSchema`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:386-400` (the lane's coverage gate)
- `.skilled/commands/doctor/assets/doctor-setup.yaml:59-61` (advisor and embedder legs, exit 75)
- `.skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml` (phase 6 verify)
- `.skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt:289-304`
- `.skilled/commands/doctor/assets/doctor-setup-presentation.txt:55,108`
- `.skilled/commands/create/assets/create-command-auto.yaml:470-496`
- `.skilled/commands/create/assets/create-command-confirm.yaml:482-493`
- `.skilled/commands/create/assets/create-command-presentation.txt:168`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:1305-1312`
- `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts:150-260,420-500`
- `.skilled/skills/system-skill-advisor/runtime/tests/skill-graph/embedding-coverage.vitest.ts:81-140`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **`advisor_status` reports the semantic lane enabled while the lane's own gate refuses to score** -- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:242` -- `laneEnabled` is computed from `hasActive && adapter && !dimMismatch && !staleness.stale && hasVecTable && embedded > 0 && !disabledReason` and never consults `coverageComplete`, while `scoreSemanticShadowLane` returns `[]` whenever `embeddingCoverage().complete` is false, so the status envelope can carry `coverageComplete: false` and `laneEnabled: true` at once.
   Finding class: `status_contract_mismatch`
   Scope proof: inside the declared review target (`.skilled/skills/system-skill-advisor`) and inside frontier node F-1-004's scope (`handlers/advisor-status.ts`, `schemas/advisor-tool-schemas.ts`).
   Affected surface hints: `advisor_status --include-semantic-health true`, the doctor embedder leg, the `advisor-status.md` feature-catalog claim that the field reports "whether the semantic lane is enabled", the `laneEnabled` schema field.
   Case: an operator enables the semantic lane and runs `node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --include-semantic-health true --format json`. Fifty of fifty-eight skills have current vectors and eight are stale, so `currentSkillCount` is 50, `no_skill_vectors` does not fire, `runtime.disabledReason` is null, and the envelope reports `coverageComplete: false` with `laneEnabled: true`. The operator concludes the lane is contributing; `scoreSemanticShadowLane` returns `[]` on every prompt because `embeddingCoverage().complete` is false. The handler's own comment at line 382 states the design intent -- "a lane that reports enabled through an outage sends operators to rebuild a fine index instead of starting the server" -- and incomplete coverage is the same class of false-enabled signal.

```json
{
  "type": "claim_adjudication",
  "claim": "advisor_status reports laneEnabled true while the semantic lane refuses to score because coverage is incomplete, so the status surface contradicts the scoring gate.",
  "evidenceRefs": [
    ".skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:242",
    ".skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:382",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:391",
    ".skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts:444",
    ".skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts:448",
    ".skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-status.md:1"
  ],
  "counterevidenceSought": "Checked whether probeSemanticLaneBackend clears laneEnabled on incomplete coverage (it clears it only for an unreachable backend or a non-Ollama backend), whether the doctor assets rely on laneEnabled (they explicitly refuse to: doctor-setup.yaml:60 and doctor-setup-presentation.txt:108 say never to use it as a success condition), and whether the schema or the feature-catalog page redefines the field as a weaker signal (the page says it reports 'whether the semantic lane is enabled').",
  "alternativeExplanation": "laneEnabled could be intended as 'the lane's prerequisites are present' rather than 'the lane is scoring'. The handler's own comment rejects that reading: it treats a false-enabled lane as an operator trap that sends them to the wrong repair.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "Downgrade to P2 if the feature-catalog page is amended to define laneEnabled as prerequisite presence only, and the doctor assets keep refusing to read it."
}
```

### P2 Findings

1. **No test exercises a stale or missing command vector, so the new command coverage fields are only asserted at zero** -- `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts:221` -- `writeCoverageHealthDb` inserts every command vector with the correct model id and the correct `hashEmbeddingContent(source.embeddingText)`, and `embedding-coverage.vitest.ts` does the same, so `commandVectorCoverage.stale` and `.missing` are asserted only as `0` in both suites.
   Finding class: `unchecked_behavior`
   Scope proof: inside the declared review target and inside frontier node F-1-004's scope (`handlers/advisor-status.ts` and its test).
   Affected surface hints: `advisor_status`'s `commandVectorCoverage.stale`/`.missing`, the doctor embedder leg's "show stale and missing skill and command counts" instruction, `embeddingCoverage().commands`.
   Case: a regression that hard-coded `commands.stale = 0` and `commands.missing = 0` in `embeddingCoverage` would pass both suites unchanged, because neither suite ever writes a command vector with a wrong hash or omits one. The doctor asset instructs the operator to report those two counts, so a silent zero would misreport an incomplete command corpus as complete.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | partial | `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-status.md:1`, `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:242` | The feature-catalog page says `laneEnabled` reports "whether the semantic lane is enabled"; the code reports prerequisite presence and omits coverage. |
| `checklist_evidence` | notApplicable | - | The review target is a file list, not a spec folder, so there is no `checklist.md`. |

## Integration Evidence

- `.skilled/commands/doctor/assets/doctor-setup.yaml:60` -- the embedder leg reads `data.semanticLaneHealth.coverageComplete` and `data.semanticLaneHealth.backend.state`, and explicitly refuses to use `laneEnabled` as a success condition.
- `.skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml` -- phase 6 verify reports PASS only on `coverageComplete` true plus `backend.state` reachable, and maps exit 75 with `staleDistWarning` to a build repair.
- `.skilled/commands/doctor/assets/doctor-setup-presentation.txt:108` -- the troubleshooting row states "A false `laneEnabled` alone is not a failure", which confirms the doctor treats the field as advisory while the feature-catalog page describes it as the enabled flag.
- `.skilled/commands/create/assets/create-command-auto.yaml:471` -- the create workflow gates on `derive-command-bridges.cjs --check` and fails the step on a non-zero exit; `derive-command-bridges.cjs:1305-1312` accepts `--check` and rejects any other argument.
- `.skilled/commands/create/assets/create-command-presentation.txt:168` -- the presentation renders the bridge check as `[PASS|FAIL]` from the same command.

## Edge Cases

- **Ambiguity: what `laneEnabled` means.** The feature-catalog page calls it "whether the semantic lane is enabled"; the doctor assets treat it as advisory. I kept the finding at P1 because the handler's own comment states the false-enabled case is the trap the field exists to avoid, and recorded the doc-versus-doctor split as the ambiguity.
- **Contradiction: the doctor refuses `laneEnabled` while the status doc advertises it.** Both sides are cited above; the adjudication is that the field is wrong, not the doctor.
- **Missing dependency: no `resource-map.md`**, so the Resource Map Coverage Gate is skipped rather than passed.
- **Partial success: the doctor assets are clean.** The exit-75 taxonomy, the `coverageComplete` gate and the bridge check all read correctly; only the status field they refuse to trust is wrong.

## Confirmed-Clean Surfaces

- `readSemanticLaneHealth` opens the database read-only with `fileMustExist: true` (`advisor-status.ts:178`) and closes it in `finally` (`advisor-status.ts:253`), so the status read never creates or migrates the database.
- The `embeddingCoverage` call inside `readSemanticLaneHealth` passes the explicit read-only handle (`advisor-status.ts:200`), so the status path does not repeat the read-write fallback reported as R1-P1-002.
- `probeSemanticLaneBackend` clears `laneEnabled` for an unreachable backend and for a non-Ollama backend (`advisor-status.ts:397`, `412-418`), so the outage case is handled.
- The schema marks `coverageComplete`, `stale` and `missing` optional (`advisor-tool-schemas.ts:254-270`), so an older database that cannot produce coverage still validates.
- The doctor setup asset maps exit 75 with `staleDistWarning` to FAIL with a build repair and exit 75 without it to SKIP, and names every retryable cause (`doctor-setup.yaml:59-60`).
- The create-command bridge gate is wired in both the auto and confirm workflows and in the presentation (`create-command-auto.yaml:471`, `create-command-confirm.yaml:483`, `create-command-presentation.txt:168`).

## Ruled Out

- **The doctor embedder leg can report PASS on incomplete coverage.** Ruled out: it requires `coverageComplete` true and `backend.state` reachable (`doctor-setup.yaml:60`).
- **The doctor can report FAIL because the lane weight is zero.** Ruled out: both the setup asset and the presentation forbid it (`doctor-setup.yaml:60`, `doctor-skill-advisor-presentation.txt:304`).
- **The create-command workflow can skip the bridge check.** Ruled out: the check is a validation row that fails the step on a non-zero exit (`create-command-auto.yaml:483`).
- **`advisor_status` can create the database.** Ruled out: the read-only handle uses `fileMustExist: true` and the absent-file branch returns before opening (`advisor-status.ts:168-174`).
- **The status schema rejects the new fields.** Ruled out: `stale`, `missing` and `coverageComplete` are declared optional on the strict schema (`advisor-tool-schemas.ts:254-270`).

## Next Focus

- Dimension: security
- Focus area: the launcher's child environment allowlist and the generation counter (`system-skill-advisor-launcher.cjs`, `lib/freshness/generation.ts`)
- Reason: both frontier nodes have their correctness pass; the next uncovered dimension is security, and the launcher's `CHILD_ENV_ALLOWLIST` plus the `SYSTEM_SKILL_ADVISOR_DB_DIR` pin are the trust-boundary surfaces the reviewed commits changed.
- Rotation status: F-1-001 correctness covered; F-1-004 correctness covered; security next.
- Blocked/productive carry-forward: productive -- reading the asset's own instructions against the handler's field found the mismatch; keep that order.
- Required evidence: what the allowlist admits and drops, whether the DB-dir pin can be overridden by the parent environment, and whether the generation path can be redirected outside the workspace.
- Recovery note: not applicable.

Review verdict: CONDITIONAL
