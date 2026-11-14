# Deep Review Report - doctor-docs pass four

- Session: `fanout-doctor-docs-4-1794669272137-9v23rz` (generation 1, lineage mode `new`)
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder), narrowed by `review-scope-4.txt` to the `doctor-docs` area
- Dimensions covered: correctness, security, traceability, maintainability (4 of 4)
- Iterations: 3 of 3
- Stop reason: `maxIterationsReached`
- Release readiness: `in-progress` (the loop hit its cap; this is not a converged stop)
- Review doctrine: `.skilled/skills/sk-code/sk-code-review/references/review-core.md`

## 1. Executive Summary

**Verdict: PASS** (`hasAdvisories: true`)

| Severity | Active |
|----------|-------:|
| P0 (Blockers) | 0 |
| P1 (Required) | 0 |
| P2 (Suggestions) | 1 |

The `doctor-docs` diff is small and correct. The new A11 detail carries the malformed-row count beside the missing count, and the new test pins it. The six removed doctor phrases are everyday repair and release words that pulled non-doctor requests onto `/doctor:setup` and `/doctor:update`; the removal reaches the derived bridge data, and every mutating doctor route still derives `ask`. The create presentation's option C is the canonical Gate 3 wording, and the command carries the same name on every command-carrying runtime. One advisory remains: the A11 troubleshooting row names a repair for missing rows only, while the new detail makes a malformed row a finding with nothing missing.

Operator review focus (verbatim): Code review pass four of command surfacing. FIRST read and follow specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-4.txt: it names the scope file, which files your lineage reviews, the checks and the severity rules. HOLDOUT RULE: never open command-prompts.jsonl or holdout-prompts.jsonl except through jq 'del(.prompt)', never run git diff, show or log -p over a path that includes command-prompts.jsonl without the pathspec ':(exclude)**/command-prompts.jsonl', and never print a prompt whose split is holdout. The reviewer changes no code and writes only inside its lineage folder.

The stop is the three-iteration cap, not a converged stop. All four dimensions are covered, the search debt is zero, and the only active finding is the P2 advisory; the verdict follows the finding contract (no P0/P1), while release readiness stays `in-progress` because the cap was reached before convergence.

## 2. Planning Trigger

`/speckit:plan` is **not required** for this result: there is no P0 or P1 finding, so the next command is `/create:changelog` for a PASS with advisories. The one P2 is an advisory documentation fix and is recorded as a workstream below.

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    {
      "id": "DR4-P2-001",
      "severity": "P2",
      "title": "A11 malformed-row finding has no specific repair, while the A11 troubleshooting row points at a tool that cannot fix it",
      "file": ".skilled/commands/doctor/assets/doctor-agents-md-presentation.txt:267",
      "evidence": "The A11-specific troubleshooting row names missing rows only and points at /doctor:agents-md embed, which adds missing rows and prints 'no other row was touched' (agents-md-embed.cjs:782-794). The changed detail makes a malformed row a finding with zero missing rows (agents-md-check.cjs:798-809).",
      "findingClass": "class-of-bug",
      "scopeProof": "One A11-specific row at doctor-agents-md-presentation.txt:267; the only other repair is the generic FINDING row at :262. agents-md-embed.cjs:782-804 never rewrites an existing row.",
      "affectedSurfaceHints": ["A11 row", "doctor-agents-md troubleshooting table", "agents-md-embed addRouterRows", "manual-testing-playbook doctor-agents-md-check"],
      "recommendation": "Extend the A11 row to name the malformed case and the actual repair (correct the row's cell count in REPO RULES.md), or state that embed only adds missing rows."
    }
  ],
  "remediationWorkstreams": [
    {
      "lane": "advisory-docs",
      "severity": "P2",
      "findingIds": ["DR4-P2-001"],
      "order": 1,
      "action": "Update the A11 troubleshooting row in doctor-agents-md-presentation.txt to cover a malformed-only finding; no code change is required."
    }
  ],
  "specSeed": [
    "Record the malformed-router-row repair in the doctor agents-md presentation contract: the operator corrects the row's cell count; embed only appends missing rows."
  ],
  "planSeed": [
    "Edit .skilled/commands/doctor/assets/doctor-agents-md-presentation.txt:267 so the A11 row names both the missing-row and malformed-row cases.",
    "Keep the generic FINDING row at :262 as the fallback, and add a presentation assertion only if the presentation file gains a test."
  ],
  "findingClasses": ["class-of-bug"],
  "affectedSurfacesSeed": ["A11 row", "doctor-agents-md troubleshooting table", "agents-md-embed addRouterRows", "manual-testing-playbook doctor-agents-md-check"],
  "fixCompletenessRequired": false
}
```

`fixCompletenessRequired` is false: the finding is a P2 documentation mapping, not a P0/P1 security, path, auth, persistence or cross-consumer defect. The producer/consumer pair (check detail and presentation repair) is named in the finding, and the instance-only opt-out does not apply because the class fix is one row.

## 3. Active Finding Registry

### P0 (Blockers)

None.

### P1 (Required)

None.

### P2 (Suggestions)

| ID | Dimension | File:line | Title | Disposition |
|----|-----------|-----------|-------|-------------|
| DR4-P2-001 | traceability (raised in correctness, carried through security, traceability and maintainability) | `.skilled/commands/doctor/assets/doctor-agents-md-presentation.txt:267` | A11 malformed-row finding has no specific repair, while the A11 troubleshooting row points at a tool that cannot fix it | active |

- **Evidence**: The A11-specific row says "A11 reports missing router rows" and names `/doctor:agents-md embed`, which "adds the shipped rows that are missing and touches no other row" (`agents-md-embed.cjs:794`). The changed A11 detail reports `0 shipped row(s) missing, N malformed row(s)` when a row's width is wrong (`agents-md-check.cjs:798-809`). The generic FINDING row at `:262` still says to read the detail and fix the requirement.
- **Impact**: An operator whose only defect is a malformed row is sent to a tool that cannot repair it; the finding persists after the suggested run. The generic row gives a fallback, so the impact is advisory.
- **Fix**: Extend the A11 row to name the malformed case and the manual cell-count repair, or state that embed only adds missing rows.
- **Finding class**: `class-of-bug`.
- **Scope proof**: `rg -n 'A11|missing router rows|malformed' .skilled/commands/doctor/assets/doctor-agents-md-presentation.txt` finds one A11-specific row at `:267`; the only other repair is the generic FINDING row at `:262`. `agents-md-embed.cjs:782-804` shows the router repair only calls `addRouterRows` and never rewrites an existing row.
- **Affected surface hints**: A11 row; doctor-agents-md troubleshooting table; agents-md-embed addRouterRows; manual-testing-playbook doctor-agents-md-check.
- **Downgrade trigger**: If the generic FINDING row at `:262` is accepted as the named repair for every A11 cause, downgrade this to a documentation observation.

## 4. Remediation Workstreams

### P0 - none

### P1 - none

### P2 advisory - one lane

| Order | Lane | Finding | Action |
|------:|------|---------|--------|
| 1 | `advisory-docs` | `DR4-P2-001` | In `.skilled/commands/doctor/assets/doctor-agents-md-presentation.txt`, make the A11 row cover a malformed-only finding and name the actual repair. No code or workflow change. |

## 5. Spec Seed

- The A11 detail contract now has two finding causes: missing shipped rows and malformed rows. The presentation contract should name a repair for each cause.
- The malformed-row repair is manual: correct the row's cell count in `REPO RULES.md`. `/doctor:agents-md embed` adds missing rows and touches no other row, so it is not the repair for this cause.
- The doctor phrase removal and the create Gate 3 wording need no spec change; they are consistent with the packet's 016 requirements and the canonical Gate 3 constant.

## 6. Plan Seed

1. Update the A11 troubleshooting row at `.skilled/commands/doctor/assets/doctor-agents-md-presentation.txt:267` to cover both `missing router rows` and `malformed router row` cases, keeping the generic FINDING row as the fallback.
2. If the presentation gains a test harness, add one assertion that the A11 row names the malformed case; the engine behavior is already pinned by `agents-md-check.test.cjs:742-765`.
3. No edit to `_routes.yaml`, `agents-md-check.cjs` or the test is needed for this advisory.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | A11 detail: `goal.md:216` (A-2 alignment), `014-review-remediation/tasks.md:115` (T027) and `agents-md-check.test.cjs:763-764`. Phrase removal: `a494145dd0` commit body, `024-fable-review-remediation/spec.md:111-112`, `016-claude-create-reach-and-doctor-default/spec.md:256` (REQ-007). |
| `checklist_evidence` | pass | AC-017 (`014-review-remediation/acceptance-criteria.md:72`), AC-003, AC-005 and AC-007 (`016-claude-create-reach-and-doctor-default/acceptance-criteria.md:58-62`) remain Met. The carried P2 is outside the checklist rows. |

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | notApplicable | No skill/agent pair changed. |
| `agent_cross_runtime` | pass | `.claude/commands/create/sk-skill.md` and `.cursor/commands/create-sk-skill.md` symlink the canonical file; `.codex/prompts/create-sk-skill.md`, `.pi/prompts/create-sk-skill.md` and `.dsh/prompts/create-sk-skill.md` carry the new name; `.devin` has no command mirror by design; no old-name command file remains. The changed presentation is runtime-neutral. |
| `feature_catalog_code` | pass | `doctor-command-routing.md:27-39` matches the generated policy (`mutates` routes ask; read-only routes get `readOnly`; reach probe rejects phrases under three words). |
| `playbook_capability` | partial | `doctor-agents-md-check.md:30,102` requires a repair for each finding; the A11-specific row covers missing rows only (the carried P2). The setup and update playbooks use typed commands and do not quote the removed phrases. |

**AC_COVERAGE**: `exempt` — the review target is the umbrella packet, which has no top-level `acceptance-criteria.md` or `implementation-summary.md`. The governing child-phase checklists were read: 016 AC-003, AC-005 and AC-007 remain Met, and 014 AC-017 remains Met.

## 8. Deferred Items

- `DR4-P2-001`: the A11 malformed-row repair mapping. Advisory; carried into the Planning Packet.
- The 016 real-embedder holdout count is cited from the commit body as unchanged; it was not re-inspected because the holdout rule forbids reading the prompt rows.
- The malformed count is derived as `lines.length - missing.length`; a future line family added to `lines` would silently join the count. No current input produces a wrong count, and the changed test covers the subtraction. Recorded as a note, not a finding.
- The `.skilled/commands/create/sk-skill.md` description says "OpenCode skills"; the line predates the rename (the old `skill.md` carried it), is not part of this diff, and the `.skilled/skills` target is the OpenCode-origin skill tree. Not a finding.
- No resource-map coverage gate: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/resource-map.md` is absent, so the gate is skipped.

## 9. Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

No divergent pivot ran; the loop used the normal dimension rotation across the three-iteration cap.

## 10. Search Ledger

- `requiredBugClasses`: `behavioral_contract`, `docs_code_divergence`, `mutating_attachment`, `cross_runtime_parity`, `derived_data_sync`, `holdout_leakage`, `maintainability_style`, `hidden_coupling`
- `covered`: all eight
- `ruledOut`: `behavioral_contract`, `mutating_attachment`, `cross_runtime_parity`, `derived_data_sync`, `holdout_leakage`, `maintainability_style`, `hidden_coupling`
- `deferred`: none
- `blocked`: none
- `graphCoverageMode`: `graphless_fallback`
- `candidateCoverage.covered`: all eight; `candidateCoverage.deferred`: none; `candidateCoverage.blocked`: none
- `searchDebt`: none (`hasSearchDebt: false`)
- `ruledOutCandidates`: SL-004 (cross-runtime), SL-005 (derived-data sync), SL-006 (holdout), SL-008 (mutating attachment), SL-009 (cross-runtime rename), SL-011 (A11 count), SL-012 (holdout), SL-013 (feature catalog), SL-014 (maintainability style), SL-015 (hidden coupling)
- `cleanSearchProof`: the same rows plus SL-007 (transcript-scorer phantom count, not applicable to this area)

No search-depth state was skipped for a required bug class. The one finding is `docs_code_divergence`; every other class was ruled out with the evidence in the iteration records and the registry.

## 11. Audit Appendix

### Iteration Table

| Iteration | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|----------:|-------|------------|------:|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/1 | complete |
| 2 | security + traceability | security, traceability | 0.00 | 0/0/1 | complete |
| 3 | maintainability | maintainability | 0.00 | 0/0/1 | complete |

### Convergence Replay

- Ratios: 1.00, 0.00, 0.00. The last two average 0.00, below the rolling stop threshold of 0.08, but the run hit the three-iteration cap before a legal converged stop could be claimed.
- Dimension coverage: 4 of 4; coverage age is satisfied.
- Required core protocols: `spec_code` pass, `checklist_evidence` pass. Overlays: four pass or notApplicable, one partial (the carried P2).
- Search debt: 0; candidate coverage: all eight required bug classes covered.
- Active P0/P1: 0/0. Active P2: 1. Verdict: PASS with advisories.
- Stop reason: `maxIterationsReached`. Release readiness: `in-progress`.

### File Coverage Matrix

| File | Dimensions | Last Iteration | Findings |
|------|-----------|----------------|----------|
| `.skilled/commands/doctor/scripts/agents-md-check.cjs` | correctness, security, traceability, maintainability | 3 | 0 direct; the changed output is the producer in `DR4-P2-001` |
| `.skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs` | correctness, maintainability | 3 | 0 |
| `.skilled/commands/doctor/_routes.yaml` | correctness, security, traceability, maintainability | 3 | 0 |
| `.skilled/commands/create/assets/create-skill-presentation.txt` | correctness, traceability, maintainability | 3 | 0 |
| `.skilled/commands/doctor/assets/doctor-agents-md-presentation.txt` | correctness, traceability, maintainability | 3 | 1 P2 (`DR4-P2-001`) |
| Shared docs and integration surfaces | as listed in the iteration files | 3 | 0 |

### Dimension Breakdown

- **Correctness**: the A11 count arithmetic is correct; the test covers the malformed-only case; the route phrase removal is a domain fix, not a reach break.
- **Security**: every mutating doctor route derives `ask`; refusals, questions and command-only mentions are suppressed; no holdout corpus was read.
- **Traceability**: the changed behavior matches the A11 alignment item, the T027/AC-017 contract, the `a494145dd0` phrase-domain reproduction, the 016 floors and the canonical Gate 3 constant.
- **Maintainability**: the changed hunks pass `git diff --check`; the new comment is durable; the test pins the contract; no unresolved TODO/FIXME/HACK marker was introduced.

### Resource Map Coverage Gate

Skipped: `resource-map.md` is absent at the review target at init. No touched/untouched/absent classification was produced.

### Holdout Hygiene

No `command-prompts.jsonl` or `holdout-prompts.jsonl` was opened. The only prompt material seen was a non-holdout `split: tune` row already materialized in a scratch artifact and the non-holdout tests that name prompts. The commit's holdout evidence is a count only.

### Lifecycle and State

- Session `fanout-doctor-docs-4-1794669272137-9v23rz`, parent `null`, generation 1, lineage mode `new`, continuedFromRun `null`.
- State log: one config row plus three canonical iteration records, all recorded through the append gateway.
- Findings registry: one active P2, zero resolved, zero repeated, zero search debt, zero corruption warnings.
- Delta files: `deltas/iter-001.jsonl`, `deltas/iter-002.jsonl`, `deltas/iter-003.jsonl`, each with one canonical iteration record first.
- Resource map: not emitted (`resource_map.emit` false and no map at init).

### Rule Sources

`Rule sources: none` — the review applied the shared `sk-code-review` doctrine and the packet's own contracts; the sk-code quality resolver was not run because its cache write lands outside this lineage's write surface.

Review verdict: PASS
