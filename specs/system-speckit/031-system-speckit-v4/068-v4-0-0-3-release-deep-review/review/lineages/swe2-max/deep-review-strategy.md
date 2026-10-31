# Deep Review Strategy — swe2-max lineage

## 1. TOPIC

Review the `v4.0.0.2..v4.0.0.3` release diff (633 commits, 1999 manifest files) for the swe2-max fan-out lineage. Steer focus area: `.skilled/skills/sk-*` and other sk-* skills, `.skilled/commands/` other than `doctor`, `.skilled/agents/` plus runtime agent mirrors, `.skilled/repo-rules/`, root `AGENTS.md` / `README.md`, and whether docs match the code they describe. Active expansion into the wider manifest is expected when findings point outside the focus area.

## 2. REVIEW BOUNDARIES

- Target is read-only; writes only inside this lineage directory.
- 10 iterations, `--stop-policy=max-iterations`; convergence is telemetry only.
- Evidence rule: every finding cites file:line or commit evidence plus a concrete failure scenario.
- Severity scale P0/P1/P2 only; no style nits as P1.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 5
- P2 (Suggestions): 9
- Resolved: 0

<!-- /ANCHOR:running-findings -->

## 6. WHAT WORKED

[None yet]

## 7. WHAT FAILED

[None yet]

## 8. KNOWN CONTEXT

- Review target pointers: `goal-file-manifest.txt` (1999 files in the release range, still existing at HEAD-of-range).
- Focus-area manifest slice: 435 files — `sk-code` (161, incl. `sk-code-webflow` 93 doc-heavy refs), `sk-doc` (107, incl. `sk-create-*` leaf skills and scripts), `sk-git` (45, mostly `scripts/` 18), `sk-design` (20), `commands/deep` (14), `commands/speckit` (9), `commands/create` (4), `sk-prompt` (4), `repo-rules` (13), `agents/` + mirrors, `AGENTS.md`, `README.md`.
- `resource-map.md` not present in the spec folder. Skipping coverage gate.
- Sibling lineages `luna-max` and `deepseek-flash-max` cover the rest of the manifest (doctor, system-* skills, hooks, workflows); findings that cross into their area are still recorded here when my evidence reaches them.
- The packet's own docs (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`) are the traceability baseline for `spec_code` / `checklist_evidence`.

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `checklist_evidence`: every finding carries file:line plus an empirical or traced failure scenario. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `checklist_evidence`: every finding carries file:line plus an empirical or traced failure scenario.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: every finding carries file:line plus an empirical or traced failure scenario.

### `checklist_evidence`: steer-required evidence (file:line + failure scenario) present for both findings. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence`: steer-required evidence (file:line + failure scenario) present for both findings.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: steer-required evidence (file:line + failure scenario) present for both findings.

### `feature_catalog_code`: `leaf-manifest.json` and `leaf-aliases.json` entries all resolve (71/71 paths exist on disk); `hard-rules.json` sidecar consumption claim in `git-preflight-advisory.mjs:10` verified — the dispatch preflight lints (`claude`/`codex`/`devin` variants) do read the same sidecar. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `feature_catalog_code`: `leaf-manifest.json` and `leaf-aliases.json` entries all resolve (71/71 paths exist on disk); `hard-rules.json` sidecar consumption claim in `git-preflight-advisory.mjs:10` verified — the dispatch preflight lints (`claude`/`codex`/`devin` variants) do read the same sidecar.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: `leaf-manifest.json` and `leaf-aliases.json` entries all resolve (71/71 paths exist on disk); `hard-rules.json` sidecar consumption claim in `git-preflight-advisory.mjs:10` verified — the dispatch preflight lints (`claude`/`codex`/`devin` variants) do read the same sidecar.

### `playbook_capability`: `hooks/README.md` claims commit-msg finds the validator "beside the real hook script" — verified via `mcg_validator_path` and the machine-wide `core.hooksPath` (`~/.config/git/hooks`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `playbook_capability`: `hooks/README.md` claims commit-msg finds the validator "beside the real hook script" — verified via `mcg_validator_path` and the machine-wide `core.hooksPath` (`~/.config/git/hooks`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: `hooks/README.md` claims commit-msg finds the validator "beside the real hook script" — verified via `mcg_validator_path` and the machine-wide `core.hooksPath` (`~/.config/git/hooks`).

### `skill_agent`: leaf-agent contract requires canonical `{"type":"iteration"}` records — verified compatible (gateway L442 passthrough and `iteration_recorded` schema `data.record: 'json'` accept the whole record and project it back unchanged at `deep-review-state-contract.ts:213-222`). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `skill_agent`: leaf-agent contract requires canonical `{"type":"iteration"}` records — verified compatible (gateway L442 passthrough and `iteration_recorded` schema `data.record: 'json'` accept the whole record and project it back unchanged at `deep-review-state-contract.ts:213-222`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: leaf-agent contract requires canonical `{"type":"iteration"}` records — verified compatible (gateway L442 passthrough and `iteration_recorded` schema `data.record: 'json'` accept the whole record and project it back unchanged at `deep-review-state-contract.ts:213-222`).

### `spec_code`: `state_write_protocol.applies_to` asserts all append directives route through the gateway; traced each directive's rendered shape against the gateway classifier — mismatch confirmed for all `type:"event"` rows. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code`: `state_write_protocol.applies_to` asserts all append directives route through the gateway; traced each directive's rendered shape against the gateway classifier — mismatch confirmed for all `type:"event"` rows.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: `state_write_protocol.applies_to` asserts all append directives route through the gateway; traced each directive's rendered shape against the gateway classifier — mismatch confirmed for all `type:"event"` rows.

### Verified in-release provenance: P1-1 introduced by the v4.0.0.3 cutover (v4.0.0.2 wrote the state log directly); P1-2 predates the release but sits inside the touched hunk set, so it is reported rather than excluded. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Verified in-release provenance: P1-1 introduced by the v4.0.0.3 cutover (v4.0.0.2 wrote the state log directly); P1-2 predates the release but sits inside the touched hunk set, so it is reported rather than excluded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Verified in-release provenance: P1-1 introduced by the v4.0.0.3 cutover (v4.0.0.2 wrote the state log directly); P1-2 predates the release but sits inside the touched hunk set, so it is reported rather than excluded.

<!-- /ANCHOR:exhausted-approaches -->

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

[None yet]

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Iteration 3 — correctness on `sk-doc` scripts and the shared script surface (`system-spec-kit` shared helpers the gate depends on), continuing down the manifest. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->

## 12. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| spec_code | core | pending | — |
| checklist_evidence | core | pending | — |
| skill_agent | overlay | pending | — |
| agent_cross_runtime | overlay | pending | — |
| feature_catalog_code | overlay | pending | — |
| playbook_capability | overlay | pending | — |

## 13. FILES UNDER REVIEW

| File | Dimension | Iteration | Outcome |
|------|-----------|-----------|---------|
| (populated per iteration) | — | — | — |

## Non-Goals

- No fixes; findings only (remediation is a later packet).
- No review of `commands/doctor/` (assigned to sibling lineages).
- No edits outside the lineage directory.

## Stop Conditions

- Hard cap at 10 iterations (`stopPolicy=max-iterations`).
- Convergence signals are recorded as telemetry but never shorten the run.
