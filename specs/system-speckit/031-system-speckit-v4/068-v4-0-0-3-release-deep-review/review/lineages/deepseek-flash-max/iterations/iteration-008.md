---
title: "Deep Review Iteration 008 — traceability: requirements, checklist evidence, release-doc claims"
trigger_phrases: []
---

# Iteration 8: Traceability — `spec_code`, `checklist_evidence`, and a lead-sanctioned contract conflict

## Focus

Dimension: **traceability**. Protocol: `spec_code` (packet REQ-001..REQ-005 and AC-001..AC-007 against
observed behavior) plus `checklist_evidence` (the packet's own checklist rows and this run's health
ledger). Sources include the updated lead steer, whose binding ruling on the config-status conflict
is logged here as F007, and the run's `orchestration-status.log`, which carries the dispatch,
stall, containment-advisory, failure and retry events this pass maps.

## Files Reviewed

- `review/lineages/deepseek-flash-max/steer.md` (updated lead ruling, re-read before this iteration)
- `specs/.../068-.../spec.md`, `acceptance-criteria.md`, `tasks.md`, `goal-file-manifest.txt` (requirements and verification rows)
- `review/deep-review-config.json` (stop policy), `review/orchestration-status.log` (run events)
- `review/lineages/{luna-max,swe2-max,deepseek-flash-max}/iterations/**` (counts and citation sample)
- `.skilled/skills/system-deep-loop/deep-review/SKILL.md` (NEVER list) and `.skilled/commands/deep/assets/deep-review-auto.yaml` (terminal config step)

## Findings

### P0 Findings

None.

### P1 Findings

None new. Carried: F001 and F002 remain active (unchanged this iteration).

### P2 Findings

- **F007**: The deep-review contract calls the config read-only after init while its own workflow flips the config status at the terminal step — `.skilled/skills/system-deep-loop/deep-review/SKILL.md:392` — The NEVER list states "**Modify config after init**, `deep-review-config.json` is read-only after initialization", while `deep-review-auto.yaml:2322-2325` defines `step_update_config_status` as `edit: "{state_paths.config}"` with `set_field: { status: "complete" }`. The lead's binding ruling for this run resolves the conflict in favor of the workflow step and invites this wording-gap finding. Concrete failure scenario: an executor that follows the NEVER list literally leaves a finished run's config at `running`/`initialized`, and any resume/lifecycle reader that trusts `status` then treats a completed run as unfinished; an executor that performs the flip has violated the contract text it was given. The repair is one sentence — scope the rule to review *parameters* (immutable after init) and name the terminal status flip as the workflow's own step.

  Finding class: `instance-only`
  Scope proof: Read both sides at their exact lines and confirmed the workflow step's target path and field; the lead ruling equally names both sides.
  Affected surface hints: [`.skilled/skills/system-deep-loop/deep-review/SKILL.md`, `.skilled/commands/deep/assets/deep-review-auto.yaml`]

## Traceability Checks

### `spec_code` — requirements to evidence

| REQ | Status | Evidence |
|-----|--------|----------|
| REQ-001 (three lineages to 10/15/10, no convergence stop) | **in progress** | `review/deep-review-config.json` carries `stopPolicy: max-iterations`; this lineage is at 7 iterations and running. Mid-run counts observed: `luna-max` 2, `deepseek-flash-max` 7, `swe2-max` 2. luna-max failed attempt 1 (exit 0 without `review-report.md`) and was retried per NFR-R01: `orchestration-status.log` records `failed` + `retry_scheduled` + a fresh `started` at 04:22:09. No convergence stop has occurred. |
| REQ-002 (fresh Opus 5.5 synthesizes the merged report) | **unmet (run incomplete)** | `review/review-report.md` does not exist yet; the merge (T009) and synthesis (T010) are downstream of the lineage runs. Not a defect, a sequencing fact. |
| REQ-003 (change nothing outside this packet and the parent phase map) | **holds so far** | `git status --short` at the repo root lists exactly ` M specs/system-speckit/033-system-speckit-v4/spec.md` (the planned phase-map row) and `?? specs/system-speckit/033-system-speckit-v4/068-…/` (the packet, untracked). No path outside `specs/system-speckit/033-system-speckit-v4/`. |
| REQ-004 (every finding cites file:line or a commit) | **pass on the reviewed sample** | This lineage's F001-F007 each carry a path:line or commit id in their evidence; `luna-max` and `swe2-max` iteration files carry `[SOURCE: …]`/path citations (sample: luna iterations 1-2, three citations each). Finding-class fields are present on every finding in this lineage's records (CHK-FIX-001). |
| REQ-005 (packet passes `validate.sh --strict`, committed and pushed) | **unmet; one observed obstacle** | The packet is untracked (`??`), so nothing is committed or pushed. `validate.sh` cannot be run inside this lineage (write containment), but the shipped modules were executed instead: the packet's own `graph-metadata.json` currently resolves `GENERATED_METADATA_INTEGRITY` to `error` (`SOURCE_FINGERPRINT_MISSING`); the fan-out's post-run refresh runs `generate-description.js` + `backfill-graph-metadata.js` against the run's spec folder after all lineages settle (`fanout-run.cjs:3000-3060`), so the gate should clear before the operator validates — if that refresh is skipped because the CLI dist is missing, the packet will fail its own AC-007. |

### `checklist_evidence`

| Row | Status | Evidence |
|-----|--------|----------|
| CHK-011 (run ends without a write-containment violation) | **pass so far** | `orchestration-status.log` holds one `containment_advisory` event (luna-max, iteration 1, three preserved-untracked paths) and no violation event; the advisory path is the runner's designed preserve-not-revert branch. |
| CHK-012 (lineage failures retried or resumed and recorded) | **pass so far** | The luna-max failure and its retry are both recorded with timestamps and the missing-artifact reason (04:22:09). |
| CHK-013 (official workflow scripts, not a hand-rolled loop) | **pass** | Three `started` events in the run ledger; the lineage directories carry `containment/`, `locks-and-fencing-v1/` and the gateway's ledgers, which only the official runner creates. |
| CHK-021 (iteration counts 10/15/10 on disk) | **pending** | Mid-run counts 2/7/2. |
| CHK-030 (no credential or `.env` value in any review artifact) | **pass** | Sweep of the whole `review/` tree for private-key, AWS-key-id, GitHub, Anthropic, Slack and `sk-ant-` shapes returned no matches (positive control: the same pattern matched `AKIAIOSFODNN7EXAMPLE` fed through stdin). |
| CHK-031 (executors write only inside their lineage folder) | **pass so far** | Root `git status --short` shows no path outside the packet and the planned parent edit; no containment violation event. |
| CHK-050 / CHK-051 (temp files and strays) | **pass with one note** | This lineage wrote only under its own directory: `iterations/`, `deltas/`, `records/` (single-record event files handed to the append gateway), plus the gateway's own ledger frames. The `records/` directory is an intentional audit trail, not a stray; nothing was written outside the lineage. |

## Claim Adjudication

No new P0/P1; F007 is the lead-sanctioned wording gap, evidenced at both exact lines. The traceability rows above are observations (counts, log events, git status, an executed sweep with a positive control), not inferences; where a row is downstream of the still-running fan-out it says "unmet" rather than guessing.

## Ruled Out

- "The luna-max failure indicates a dispatch defect": ruled out — the runner recorded exit 0 with a missing expected artifact, scheduled a retry, and relaunched; that is NFR-R01's designed path, and the retry's first two iterations now exist without duplicate iteration numbers.
- "The stall detector aborted a working lineage": ruled out on the ledger — three `stall_detected` events (04:19:48 and later) are followed by continued `progress` events for the same labels, so the default action is detect-only; no lineage was killed by it.
- "The containment advisory means the run wrote outside its lane": ruled out on the event payload — it carries three advisories with `preserved_untracked` dispositions, which is the preserve branch, and no violation event exists.

## Dead Ends

- Verifying AC-005/AC-007 (report and push): impossible mid-run and outside the lineage's write authority; recorded as unmet with the sequencing reason rather than guessed.

## Assessment

- New findings ratio: 1.0 (one new P2; weighted new = weighted total = 1)
- Dimensions addressed: traceability (first pass)
- Novelty justification: `spec_code` and `checklist_evidence` were executed against the live run ledger and tree instead of the packet's prose. The pass produced one contract conflict (F007, lead-ruled) and a set of observed statuses that later iterations and the synthesis can carry forward.

## Next Focus

Dimension: maintainability. Focus area: `cli-external-orchestration` and `cli-classifier` (Jev) mode registries and dispatch contracts, then `system-skill-advisor` surfaces; record which overlay protocols (`skill_agent`, `agent_cross_runtime`) each touch. Required evidence: registry/mode-table entries checked against the implementations they name. Rotations status: maintainability pass 1 of 2.

Review verdict: CONDITIONAL
