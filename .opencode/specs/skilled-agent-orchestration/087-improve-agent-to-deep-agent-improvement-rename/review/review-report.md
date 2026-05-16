# Deep Review Report: 087 Agent Rename

## 1. Executive Summary

Verdict: **CONDITIONAL**

hasAdvisories: `false`

Scope: `/spec_kit:deep-review:auto specs/skilled-agent-orchestration/087-improve-agent-to-deep-agent-improvement-rename --max-iterations=5`

Iterations completed: 4 of 5 allowed. Stop reason: all configured dimensions covered with active P1 findings; synthesis chosen instead of a fifth discovery pass.

Finding counts: P0=0, P1=6, P2=0.

Dimension coverage: correctness, security, traceability, and maintainability all covered. Security found no rename-introduced exploit path; all active findings are required correctness/traceability/maintainability fixes.

## 2. Planning Trigger

`/spec_kit:plan` is required before this packet can be treated as PASS. The review found no P0 blockers, but six active P1 findings contradict the packet's COMPLETE claims and active rename coverage.

Planning Packet:

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": ["F001", "F002", "F003", "F004", "F005", "F006"],
  "remediationWorkstreams": [
    "Fix active stale old-name references in command/docs/config surfaces",
    "Repair completion evidence and status ledgers",
    "Refresh resource-map coverage after fixes"
  ],
  "specSeed": [
    "Add acceptance criteria for active old-name reference inventory outside specs/z_archive",
    "Require task/checklist/resource-map state to match implementation-summary completion claims"
  ],
  "planSeed": [
    "Replace stale Gemini YAML asset references with improve_deep-agent-improvement_{auto,confirm}.yaml or document Gemini non-YAML behavior explicitly",
    "Replace active playbook/default benchmark/feature-catalog old agent paths with .opencode/agents/deep-agent-improvement.md",
    "Populate implementation-summary placeholders and mark task/checklist evidence truthfully",
    "Re-run active-scope old-name inventory and update resource-map OK rows only after verification"
  ],
  "findingClasses": ["cross-consumer", "matrix/evidence"],
  "affectedSurfacesSeed": [
    ".gemini/commands/improve/",
    ".opencode/skills/deep-agent-improvement/manual_testing_playbook/",
    ".opencode/skills/deep-agent-improvement/feature_catalog/",
    ".opencode/skills/deep-agent-improvement/assets/benchmark-profiles/default.json",
    "specs/skilled-agent-orchestration/087-improve-agent-to-deep-agent-improvement-rename/"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Sev | Dimension | Evidence | Summary | Disposition |
|----|-----|-----------|----------|---------|-------------|
| F001 | P1 | correctness | `.gemini/commands/improve/improve-agent.toml:60`; `.gemini/commands/improve/README.txt:158` | Gemini command docs still point at obsolete `improve_improve-agent_{auto,confirm}.yaml` names while OpenCode/Claude use renamed assets. | active |
| F002 | P1 | correctness | `.opencode/skills/deep-agent-improvement/manual_testing_playbook/08--agent-discipline-stress-tests/014-proposal-only-boundary.md:77`; `015-active-critic-overfit.md:73` | Active playbook commands still `cat .opencode/agents/improve-agent.md` after the file was renamed. | active |
| F003 | P1 | correctness | `implementation-summary.md:33`, `:43`, `:55`, `:79`, `:133`, `:147`, `:161` | Implementation summary claims COMPLETE while retaining `[POPULATE]` placeholders. | active |
| F004 | P1 | traceability | `implementation-summary.md:33`; `tasks.md:128-131`; `checklist.md:139-140` | Completion claims are not traceable to task/checklist ledgers, which remain unchecked. | active |
| F005 | P1 | traceability | `resource-map.md:57`, `:83`, `:112-113`; Gemini/playbook evidence from F001/F002 | Resource map marks active stale-reference surfaces OK despite current stale references. | active |
| F006 | P1 | maintainability | `.opencode/skills/deep-agent-improvement/feature_catalog/01--evaluation-loop/02-candidate-generation.md:18`; `default.json:6` | Active feature catalog, SKILL integration points, and benchmark defaults still publish old agent/YAML identity. | active |

No P0 findings were confirmed. No P2-only advisories were recorded.

## 4. Remediation Workstreams

Workstream A: active stale-reference cleanup.

Fix F001, F002, and F006 with one same-class old-name inventory pass over active, non-historical surfaces. Include Gemini command TOML/README, CP-041/CP-042 playbook files, feature catalog pages, SKILL integration references, and `benchmark-profiles/default.json`.

Workstream B: completion-evidence repair.

Fix F003 and F004 by replacing `[POPULATE]` placeholders with concrete evidence or explicit limitations, then marking `tasks.md` and `checklist.md` according to actual verification results.

Workstream C: resource-map correction.

Fix F005 after Workstreams A/B by changing false `OK` rows to accurate status/evidence and regenerating or manually reconciling the map against active old-name search results.

## 5. Spec Seed

- Add explicit acceptance criteria: active old-name inventory must include `.gemini/commands/improve`, `feature_catalog`, `manual_testing_playbook`, `SKILL.md`, benchmark profile JSON, and runtime docs outside `specs/`, `.opencode/specs/`, `z_archive`, and `barter` exclusions.
- Add completion invariant: `implementation-summary.md` cannot claim COMPLETE while any `[POPULATE]` placeholder, unchecked P0/P1 checklist total, or unchecked task completion criterion remains.
- Add resource-map invariant: `Updated | OK` rows must cite current verified evidence and cannot represent intended future state.

## 6. Plan Seed

1. Run active exact searches for `improve_improve-agent`, `.opencode/agents/improve-agent.md`, `@improve-agent`, `name: improve-agent`, and `name = "improve-agent"`, excluding historical spec/archive/barter paths.
2. Update each active stale reference to `deep-agent-improvement` naming or document a narrowly scoped non-rename reason where applicable.
3. Populate `implementation-summary.md` with actual completion date, delivery narrative, limitations, and commit/verification evidence.
4. Update `tasks.md`, `checklist.md`, and `resource-map.md` to match verified reality.
5. Re-run strict spec validation plus active residual searches and record outputs in the summary.

## 7. Traceability Status

Core Protocols:

| Protocol | Status | Evidence |
|----------|--------|----------|
| spec_code | partial | REQ-008 changelog shape passed; REQ-005/010/011/012 have contradicted or incomplete evidence in iterations 1 and 3. |
| checklist_evidence | fail | Checklist totals remain unchecked while `implementation-summary.md` claims completion. |

Overlay Protocols:

| Protocol | Status | Evidence |
|----------|--------|----------|
| skill_agent | partial | Renamed agent exists, but active playbook and skill docs/config still publish stale old paths. |
| agent_cross_runtime | partial | OpenCode/Claude command docs use renamed YAML assets; Gemini command docs still reference old names. |
| feature_catalog_code | fail | Feature catalog and benchmark defaults still publish old agent/YAML identity. |
| playbook_capability | fail | CP-041/CP-042 command blocks still load the removed `.opencode/agents/improve-agent.md`. |

## Resource Map Coverage Gate

- `Entries touched`: 3 review-generated evidence entries in `review/resource-map.md`.
- `Entries not touched`: root packet `resource-map.md` has active false-OK rows for Gemini command and playbook surfaces; classify these as `gap`, not `expected-by-scope`.
- `Implementation paths absent from resource-map`: active F006 surfaces are underrepresented by the root packet map, including feature catalog/SKILL/default benchmark stale-reference surfaces.

## 8. Deferred Items

- No P2 advisories were recorded.
- Review graph convergence returned `CONTINUE` because the graph namespace was empty; the markdown/JSONL/reducer artifacts are the authoritative review evidence for this run.
- Security-sensitive shell placeholder review was noted but not raised as a rename-introduced finding.

## 9. Audit Appendix

Iterations:

| Iteration | Dimension | New Findings | Ratio | Result |
|-----------|-----------|---------------|-------|--------|
| 1 | correctness | 3 P1 | 1.00 | conditional |
| 2 | security | 0 | 0.00 | pass |
| 3 | traceability | 2 P1 | 1.00 | conditional |
| 4 | maintainability | 1 P1 | 1.00 | conditional |

Quality gates:

- Evidence: PASS for review reporting. Each P1 has file-line evidence in iteration artifacts.
- Scope: PASS. Historical `z_archive`, unchanged `/improve:agent`, and Gemini command filename non-rename were not treated as defects.
- Coverage: PASS for configured dimensions, FAIL for release readiness because six P1 findings remain active.

Final release-readiness state: `in-progress`. No P0 means not `release-blocking`, but active P1s block PASS.
