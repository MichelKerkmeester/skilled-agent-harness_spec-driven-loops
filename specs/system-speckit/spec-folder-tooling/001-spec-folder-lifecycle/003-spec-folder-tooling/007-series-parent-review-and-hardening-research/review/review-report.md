# Review Report: Phase 006, series parent rule and sibling listing

Target: `specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing` (spec-folder), 19 files in scope.
Run: 3 iterations, `stopPolicy: max-iterations`, executor cli-pi `opencode-go/deepseek-v4.1-flash` at thinking max. Stop reason: `maxIterationsReached`.

<!-- MACHINE-OWNED: START -->
## 1. Executive Summary

- **Verdict: CONDITIONAL**
- hasAdvisories: true
- Active findings: **P0 0, P1 4, P2 8**
- Dimensions covered: correctness, security, traceability, maintainability (4/4)
- Scope: the rule docs, `create.sh`, `phrase-judge.mjs`, three test files and the five 006 packet docs.

The code changes are sound. The listing and the seeded phrases behave as specified, and no injection or state-transition defect was found. All four P1 findings are documentation defects in the rule itself:

- The series-parent creation recipe does not run as written (R1-P1-001).
- The phase's own "every doc" requirements were checked only against the docs it edited, so one stale label and three threshold restatements remain (R1-P1-002, R1-P1-003, R3-P1-001).

Every finding below was re-verified by the orchestrator against the cited `file:line` after the loop (adversarial self-check, section 10).

## 2. Planning Trigger

`/speckit:plan` is required: the verdict is CONDITIONAL with four active P1 findings.

```json
{
  "Planning Packet": {
    "triggered": true,
    "verdict": "CONDITIONAL",
    "hasAdvisories": true,
    "activeFindings": ["R1-P1-001", "R1-P1-002", "R1-P1-003", "R3-P1-001", "R1-P2-001", "R1-P2-002", "R1-P2-003", "R2-P2-001", "R2-P2-002", "R2-P2-003", "R2-P2-004", "R3-P2-001"],
    "remediationWorkstreams": ["WS1 recipe fix", "WS2 same-class doc sweep", "WS3 listing and seeding hardening", "WS4 packet record reconciliation"],
    "specSeed": "Fix the series-parent recipe and finish the stale-label and threshold sweep repo-wide, including README, references/templates and feature-catalog.",
    "planSeed": "One phase, four workstreams; WS1 and WS2 are doc edits, WS3 is create.sh plus one test, WS4 edits the closed 006 packet's records.",
    "findingClasses": {"class-of-bug": ["R1-P1-001", "R1-P1-002", "R1-P1-003", "R3-P1-001", "R2-P2-001", "R2-P2-004"], "matrix/evidence": ["R2-P2-002", "R2-P2-003", "R3-P2-001"], "doc-drift": ["R1-P2-001", "R1-P2-002", "R1-P2-003"]},
    "affectedSurfacesSeed": [".skilled/skills/system-spec-kit/references/structure/phase-definitions.md", ".skilled/skills/system-spec-kit/README.md", ".skilled/skills/system-spec-kit/references/templates/level-selection-guide.md", ".skilled/skills/system-spec-kit/references/templates/level-specifications.md", ".skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/phase-system-knowledge-node.md", ".skilled/skills/system-spec-kit/references/workflows/quick-reference.md", ".skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md", ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh", "specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing/"],
    "fixCompletenessRequired": true
  }
}
```

## 3. Active Finding Registry

| ID | Sev | Dimension | File:line | Finding | Fix |
|----|-----|-----------|-----------|---------|-----|
| R1-P1-001 | P1 | correctness | `references/structure/phase-definitions.md:78` | The series-parent recipe says "scaffold the parent with `create.sh --phase`". That mode creates a parent plus `PHASE_COUNT` children, default 3 (`create.sh:62`), so the next steps ("move the existing packet in as child 001", "add the new work as child 002") collide with placeholder children. The final `create.sh --phase --parent` also omits its path. | Name `create.sh --level phase-parent` (or `--phase --phases 1 --phase-names <slug>`), say how the placeholder child is replaced, and spell out every argument. |
| R1-P1-002 | P1 | traceability | `.skilled/skills/system-spec-kit/README.md:178` | The README Gate 3 diagram still shows "Option E: Skip documentation". REQ-002 says no doc may; AC-002's evidence narrowed the search to the edited docs. | Relabel to Option D and rerun a repo-wide search for "Option E". |
| R1-P1-003 | P1 | traceability | `references/templates/level-selection-guide.md:83`, `references/templates/level-specifications.md:789` | Both restate the phase thresholds with no series-parent exception; REQ-003 requires every restatement to name it. | Add the one-line exception to each, or scope REQ-003 in REQ and AC text. |
| R3-P1-001 | P1 | traceability | `feature-catalog/tooling-and-scripts/phase-system-knowledge-node.md:29` | A third restatement of both thresholds without the exception. | Add the exception sentence; widen the sweep to `feature-catalog/`. |
| R1-P2-001 | P2 | traceability | `references/workflows/quick-reference.md:269` | Section 9's Option C line omits the series parent that `AGENTS.md` Option C now names. | Mirror the clause. |
| R1-P2-002 | P2 | maintainability | `references/retrieval/retrieval-conventions.md:249` | The "Warn On" class list does not name the new `template-default` judge class. | Add it with its meaning. |
| R1-P2-003 | P2 | traceability | `006/tasks.md:176` | The Verification Summary table still holds `[X]`/`[Y]`/`[Z]` placeholders. | Fill the counts. |
| R2-P2-001 | P2 | security | `runtime/cli/spec/create.sh:1109` | The listing prints folder names and `description.json` text after collapsing whitespace only; ESC and other control bytes pass to the terminal. Repo-controlled input, so hardening rather than a boundary crossing. | Strip `[\u0000-\u001f\u007f-\u009f]` from name and description; add an adversarial test. |
| R2-P2-002 | P2 | traceability | `006/acceptance-criteria.md:24` | The continuity block keeps scaffold values (`completion_pct: 0`, `last_updated_by: "scaffold"`) while the doc says Complete. | Refresh the block at close-out. |
| R2-P2-003 | P2 | traceability | `006/acceptance-criteria.md:60` | AC-004 claims sub-folder runs stay silent; no test covers the sub-folder path. | Add a `--subfolder --topic` listing test or narrow the AC. |
| R2-P2-004 | P2 | maintainability | `runtime/cli/spec/create.sh:401`, `retrieval/lib/phrase-judge.mjs:26` | The four template phrases live in three literals: the judge set, the shell guard and the perl block. A template wording change silently disables seeding (the guard returns 0). | One source of truth, or a guard that fails loudly on drift. |
| R3-P2-001 | P2 | traceability | `006/spec.md:76` | The scope bullet and Files to Change table omit `spec-folder-authoring-checklist.md`, which the packet changed. | Add the row. |

## 4. Remediation Workstreams

1. **WS1, recipe fix (P1):** R1-P1-001.
2. **WS2, same-class doc sweep (P1):** R1-P1-002, R1-P1-003, R3-P1-001, then R1-P2-001 and R1-P2-002. Sweep the whole repo, `.skilled/` and `references/templates/` and `feature-catalog/` included, not the edited set.
3. **WS3, listing and seeding hardening (P2):** R2-P2-001, R2-P2-004, R2-P2-003.
4. **WS4, packet record reconciliation (P2):** R1-P2-003, R2-P2-002, R3-P2-001.

## 5. Spec Seed

- The series-parent creation steps must run as written from a clean track, proven by a scratch run.
- REQ-style "no doc says X" and "every doc that restates Y" claims are verified by a repo-wide search, and the search command is recorded as the evidence.
- Terminal output built from repository metadata strips control characters.

## 6. Plan Seed

- T1 Rewrite the recipe in `phase-definitions.md` §2 and run it once in a scratch track.
- T2 Repo-wide `rg` for "Option E" and for the threshold wording; fix every hit outside changelogs and z_archive.
- T3 Add `template-default` to `retrieval-conventions.md`; mirror the series parent into quick-reference §9.
- T4 Sanitize the listing output in `create.sh`; add ESC and sub-folder tests to `create-track-refresh.vitest.ts`.
- T5 Single-source the template phrase list, or make the guard fail loudly.
- T6 Reconcile the 006 packet records (tasks summary, AC continuity, spec scope table).

## 7. Traceability Status

Core protocols:

- `spec_code`: **partial**. REQ-001, REQ-004, REQ-005, REQ-006 and REQ-007 hold in code and tests. REQ-002 and REQ-003 are unmet outside the edited docs (R1-P1-002, R1-P1-003, R3-P1-001).
- `checklist_evidence`: **partial**. CHK items carry evidence, but the Verification Summary table is unfilled (R1-P2-003). AC-004's sub-folder half has no test (R2-P2-003).

Overlay protocols:

- `skill_agent`: pass; `SKILL.md` rule 16 names the exception.
- `agent_cross_runtime`: not applicable; no agent definitions changed. The global `~/.claude/CLAUDE.md` copy of Gate 3 is a known, out-of-scope drift.
- `feature_catalog_code`: **fail**; the knowledge node restates the old rule (R3-P1-001).
- `playbook_capability`: pass; the playbook documents `--level phase-parent`, which is the evidence for R1-P1-001.

AC_COVERAGE: Level 2 packet, lifecycle Complete. 7 of 7 AC rows read Met, but AC-002, AC-003 and AC-004 are overstated by the findings above, so the status is advisory-shortfall.

## 8. Deferred Items

- The global `~/.claude/CLAUDE.md` Gate 3 option C wording (outside the repository).
- Backfilling the roughly 195 older specs that keep the template phrases.

## Dimension Expansion Map

- Swept: correctness (iteration 1), security, traceability and maintainability (iteration 2), maintainability plus re-verification of active findings (iteration 3).
- Pivots: none; convergence was telemetry only.
- Remaining frontier: none recorded.

## 9. Search Ledger

- `searchCoverage`: required bug classes stale_label, traceability_gap, doc_code_drift and injection. The first three are covered; injection was ruled out. `graphCoverageMode`: graphless_fallback.
- `candidateCoverage`: covered doc_code_drift, injection, misleading_instruction, stale_label, traceability_gap. Ruled out boundary_condition and state_transition.
- `searchDebt`: none (`hasSearchDebt: false`).

## 10. Audit Appendix

**Convergence:**

| Iteration | newFindingsRatio | Findings |
|-----------|------------------|----------|
| 1 | 1.0 | 3 P1, 3 P2 |
| 2 | 0.4 | 4 P2 |
| 3 | 0.167 | 1 P1, 1 P2 |

The reducer convergence score reached 0.833. The run stopped at the iteration ceiling, as configured.

**Adversarial self-check (orchestrator):** each of the 12 cited lines was opened after the loop.

- All 12 resolve, and each shows the defect described.
- R1-P1-001 was confirmed against `create.sh:62` (`PHASE_COUNT=3`) and `create.sh:94-98` (the `phase-parent` level exists).
- R1-P1-003's second location, `level-specifications.md:789`, was confirmed by a repo search.
- No finding was downgraded. The P1s on REQ-002 and REQ-003 stand because those requirements say "no doc" and "every doc", and the packet's own evidence narrowed them.

**Claim adjudication:** every P1 carries a typed packet. Iteration 1's first adjudication record read `passed: false` because of an orchestrator-side parsing defect: the packets used bold prose labels. The detector was fixed and a corrected `passed: true` record was appended.

**Reviewer lens:** the review and the work under review come from the same model family (DeepSeek V4.1 Flash), so the orchestrator's re-verification above is the second lens.

**Core Protocols:** `spec_code` partial, `checklist_evidence` partial.
**Overlay Protocols:** `skill_agent` pass, `agent_cross_runtime` not applicable, `feature_catalog_code` fail, `playbook_capability` pass.

**Sources reviewed:** the 19 scope files listed in `deep-review-config.json`, plus `README.md`, `level-selection-guide.md`, `level-specifications.md`, the phase-system knowledge node and `retrieval-conventions.md`.
<!-- MACHINE-OWNED: END -->
