# Iteration 3: Traceability — release requirements and state handoff

## Dimension
Traceability. This pass checked the packet's normative requirements and completion evidence against the fan-out configuration, lineage state and append-gateway contract. The focus follows the prior strategy and the lead steer.

## Files Reviewed
- `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and `goal.md` for requirements and checked setup claims.
- `goal-file-manifest.txt` and the root review configuration for the declared release range and three lineage caps.
- `review/orchestration-status.log` and the three lineage configurations and state logs for observed run progress.
- `.skilled/commands/deep/assets/deep-review-auto.yaml` for lifecycle and append-gateway requirements.
- `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` and the deep-review ledger schema and types for accepted event shapes.
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` for per-lineage caps and max-iterations validation.
- `.skilled/skills/system-deep-loop/runtime/tests/unit/append-mode-event-cli.vitest.ts`, `deep-review-ledger-schema.vitest.ts` and `render-command-contract.vitest.ts` for existing contract coverage. Tests were read, not executed.
- `review/lineages/luna-max/steer.md` for the release-range focus and review evidence expectations.

## Findings by Severity

### P0 Findings
None confirmed in this iteration.

### P1 Findings
1. **F001 remains active: oversized commit messages can hide forbidden trailers from every gate** — `.skilled/skills/sk-git/scripts/lib/message-contract.mjs:427`. This is carried forward from iteration 2. This pass did not re-adjudicate its severity. [SOURCE: `.skilled/skills/sk-git/scripts/lib/message-contract.mjs:426-427`]
   - Finding class: class-of-bug
   - Scope proof: Iteration 2 traced the shared validator to the commit, pre-push, agent and CI gates.
   - Affected surface hints: ["message-contract.mjs", "commit-msg", "pre-push", "agent gate", "message-contract CI"]
   - Recommendation: Reject oversized messages instead of validating only a truncated prefix.

### P2 Findings
1. **F002: auto-resume lifecycle event has no declared gateway-compatible shape** — `.skilled/commands/deep/assets/deep-review-auto.yaml:332`. The workflow's state-write contract sends every `append_jsonl` record through the append gateway. Its auto-resume step supplies a legacy `type: event` record, but the gateway accepts an explicit `stem`, an `event_type` envelope or a review `type: iteration` record. It has no branch for this resume event shape. The ledger schema marks `deep_review.run_resumed` as reserved, so the workflow has no declared registered resume producer. This leaves the resume transition absent from the authoritative event ledger even when iteration rows remain durable. [SOURCE: `.skilled/commands/deep/assets/deep-review-auto.yaml:97-112`] [SOURCE: `.skilled/commands/deep/assets/deep-review-auto.yaml:330-333`] [SOURCE: `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:355-463`] [SOURCE: `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts:594-628`]
   - Finding class: cross-consumer
   - Scope proof: Both the workflow and gateway are in the declared release manifest. The workflow explicitly applies its gateway contract to `append_jsonl` directives.
   - Affected surface hints: ["deep-review-auto.yaml resume branch", "append-mode-event.cjs", "deep-review ledger schema", "fan-out retry flow"]
   - Recommendation: Emit a schema-valid, registered resume event through the gateway and cover the auto-resume branch with a regression test.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| `spec_code` | partial | hard | `spec.md:107-116`; `fanout-run.cjs:1012-1063,1506-1529`; `deep-review-auto.yaml:332` | Per-lineage caps and stop policy align. The resume-event handoff is incomplete, and the merged report and final validation remain pending while the fan-out run is active. |
| `checklist_evidence` | partial | hard | `tasks.md:37-51,104-118,147-167`; `goal.md:82-83`; `review/orchestration-status.log:1-3,27` | Setup and launch claims have packet evidence. The route-smoke result is summarized as `PONG`, but no raw response transcript is preserved in this packet. A containment advisory lists untracked packet documents without attributing their creation to a lineage. |

## Assessment
- Dimensions addressed: traceability.
- New findings: P0=0, P1=0, P2=1.
- Active findings after this iteration: P0=0, P1=1, P2=1.
- New findings ratio: 0.1667. One new P2 is weighted against the active P1 and P2 findings.
- Novelty justification: The resume-event serialization gap is distinct from the prior message-length security finding.
- The configured `max-iterations` policy remains in force. Convergence is telemetry only, so the loop continues.

## Ruled Out
1. The per-lineage iteration caps do not conflict with the 10/15/10 fan-out configuration. `fanout-run.cjs` derives each prompt's `maxIterations` from that lineage's `iterations` value and checks the terminal cap. [SOURCE: `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1506-1529`] [SOURCE: `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1012-1063`]
2. The observed counts are progress, not a completed-run claim: Luna has 2 of 10, DeepSeek has 15 of 15 and SWE 2 has 5 of 10. The supervisor remains active. [SOURCE: `review/lineages/luna-max/deep-review-state.jsonl:1-3`] [SOURCE: `review/lineages/deepseek-flash-max/deep-review-config.json:13-47`] [SOURCE: `review/lineages/swe2-max/deep-review-config.json:14-30`] [SOURCE: `review/orchestration-status.log:164-169`]
3. The review scope remains the validated manifest, not every repository file. The manifest explicitly excludes `specs/**`, archives, build output, lockfiles, changelogs, fixtures and run results. [SOURCE: `goal-file-manifest.txt:1-2`]

## Edge Cases
- The prior iteration's claim-adjudication event was missing from the state projection. Its first input had an extra `generation` member in `scope`, which the closed ledger schema rejects. I staged a corrected input inside this lineage; the append gateway returned `ok: true`, receipt sequence 4 and `projectionRefreshed: true`. The reducer then rebuilt the registry with one open finding and reported zero corrupt records.
- The root orchestration log reports a containment advisory for untracked `goal.md`, `plan.md` and `tasks.md`. The runner preserved them and the record does not establish which process created them, so this review does not attribute them to Luna. [SOURCE: `review/orchestration-status.log:27`]
- `resource_map_present` is false in the lineage configuration, so the resource-map coverage audit remains skipped. [SOURCE: `review/lineages/luna-max/deep-review-config.json:13-16`]

## Confirmed-Clean Surfaces
- The root fan-out configuration binds concurrency 3 and the requested 10/15/10 lineage caps. The per-lineage configurations carry the corresponding individual caps.
- The append gateway's iteration-record branch accepts and projects the canonical `type: iteration` record used by the two existing iterations.

## Next Focus
- Dimension: maintainability
- Focus area: inspect shared fan-out and executor-routing boundaries for duplicated configuration or unclear ownership, expanding into changed callers only where the evidence points.
- Reason: the initial correctness, security and traceability passes now cover separate release surfaces.
- Rotation status: fresh dimension; no maintainability pass has run.
- Blocked/productive carry-forward: no blocked review direction; direct source reads and manifest-scoped diffs were productive.
- Required evidence: source-of-truth executor configuration, its fan-out consumers and the matching changed tests or documentation.

## Sources
- `specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/spec.md:40-51,74-116,133-184`
- `specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/plan.md:32-43,56-68,96-113`
- `specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/tasks.md:37-63,87-181`
- `specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/acceptance-criteria.md:55-63`
- `specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/goal.md:77-95`
- `specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/goal-file-manifest.txt:1-2,159,1045-1046,1090,1101,1103`
- `specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/review/deep-review-config.json:11-55`
- `specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/review/orchestration-status.log:1-3,27,164-169`
- `specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/review/lineages/luna-max/deep-review-config.json:13-48`
- `specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/review/lineages/luna-max/deep-review-state.jsonl:1-5`
- `specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/review/lineages/luna-max/deep-review-strategy.md:3-98`
- `specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/review/lineages/luna-max/steer.md:1-19`
- `specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/review/lineages/deepseek-flash-max/deep-review-config.json:13-47`
- `specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/review/lineages/swe2-max/deep-review-config.json:14-30`
- `.skilled/commands/deep/assets/deep-review-auto.yaml:97-117,313-349,1960-2017`
- `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:166-190,355-463`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts:133-140,452-461,489-492,551`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts:594-628`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:685-720,1012-1063,1506-1529`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:999-1038,1130-1156`
- `.skilled/skills/system-deep-loop/runtime/tests/unit/append-mode-event-cli.vitest.ts:820-867,895-913`
- `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-ledger-schema.vitest.ts:254-261`
- `.skilled/skills/system-deep-loop/runtime/tests/unit/render-command-contract.vitest.ts:387-400`

Review verdict: CONDITIONAL
