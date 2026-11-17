# Review Report - docs-metadata confirm 5b

Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder review, confirming round 5b).
Lineage: `docs-metadata-confirm-5b`, a fan-out leaf of review pass five.
Iterations: 3 of 3 (iteration cap reached). Stop reason: `maxIterationsReached`.

## Executive Summary

- Overall verdict: **PASS**
- hasAdvisories: **true**
- Active findings: **P0 0, P1 0, P2 4**
- Review scope: the seven `docs-metadata` paths of `review/review-scope-5b.txt` plus the two shared docs that describe the same surfaces (`ROUTER.md`, `README.md`), read against the generated artifacts, code and validators they name.
- Confirmation result: all eight DM5 fixes (`DM5-P2-001` to `DM5-P2-008`) are verified in place. Two fix-completion gaps remain (one at the skill README, one at the router), and two residual inventory lists remain in the two fixed documents. None is blocking.
- Operator review focus: Confirming round 5b of code review pass five of command surfacing. Read review/review-brief-5b.txt in the packet first and follow it. Review the files in review-scope-5b.txt whose area equals your lineage label without its -confirm-5b suffix, plus docs that describe them. Each finding is P0, P1 or P2 with file:line and a concrete input. Check that the shell write reader misses no in-place edit, the COMMAND reader reads only a line the model printed as its own, the arena builder refuses a dirty source, a stale build, an escaping or absolute link and answers a failed check with a JSON line, a live turn checks for a remote every turn and has no network push, the kill-switch names agree in code and docs, and docs agree with code. Never open command-prompts.jsonl, holdout-prompts.jsonl or behaviour-fresh-prompts.jsonl except through jq del(.prompt). Change no code and write only inside your lineage folder.

## Planning Trigger

`/speckit:plan` is **not** required for this lineage. The verdict is PASS with four P2 advisories; the advisories are documentation corrections that can be scheduled, not a remediation plan that blocks release.

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    { "id": "DMC5B-P2-001", "severity": "P2", "title": "The skill README still states 46 command rows while the fixed catalog states 47", "file": ".skilled/skills/system-skill-advisor/README.md:176", "dimension": "traceability" },
    { "id": "DMC5B-P2-002", "severity": "P2", "title": "The router still says the hook scope names five hook docs after the fix added a sixth", "file": ".skilled/skills/system-skill-advisor/ROUTER.md:103", "dimension": "traceability" },
    { "id": "DMC5B-P2-003", "severity": "P2", "title": "Section 18.5 still names numbered category slots that the playbook no longer has", "file": ".skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:341", "dimension": "maintainability" },
    { "id": "DMC5B-P2-004", "severity": "P2", "title": "The tests README package-topology block omits the doctor/ suite folder", "file": ".skilled/skills/system-skill-advisor/runtime/tests/README.md:57", "dimension": "maintainability" }
  ],
  "remediationWorkstreams": [],
  "findingClasses": ["instance-only"],
  "affectedSurfacesSeed": [
    "skill README command-bridge paragraph",
    "ROUTER.md typed leaf projection",
    "manual-testing playbook section 18.5 mapping notes",
    "tests README section 3 package topology"
  ],
  "specSeed": [
    "Record that the pass-five docs-metadata fixes are verified and that four P2 documentation corrections remain.",
    "Record the stop reason maxIterationsReached at 3 of 3 iterations for this confirming lineage."
  ],
  "planSeed": [
    "Change README.md:176 from 46 to 47 command rows.",
    "Change ROUTER.md:103 from five hook docs to six.",
    "Replace the numbered slot words in manual-testing-playbook.md:341, :345 and :346 with the feature-named folders.",
    "Add the doctor/ row to runtime/tests/README.md section 3."
  ],
  "fixCompletenessRequired": false
}
```

## Active Finding Registry

| ID | Severity | Title | Dimension | File:line | Finding class |
|---|---|---|---|---|---|
| DMC5B-P2-001 | P2 | The skill README still states 46 command rows while the fixed catalog states 47 | traceability | `.skilled/skills/system-skill-advisor/README.md:176` | instance-only |
| DMC5B-P2-002 | P2 | The router still says the hook scope names five hook docs after the fix added a sixth | traceability | `.skilled/skills/system-skill-advisor/ROUTER.md:103` | instance-only |
| DMC5B-P2-003 | P2 | Section 18.5 still names numbered category slots that the playbook no longer has | maintainability | `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:341` | instance-only |
| DMC5B-P2-004 | P2 | The tests README package-topology block omits the doctor/ suite folder | maintainability | `.skilled/skills/system-skill-advisor/runtime/tests/README.md:57` | instance-only |

### DMC5B-P2-001

- Evidence: the sentence "each of the 46 command rows the TypeScript scorer serves" while `command-bridges.generated.json:8` reports `"typescriptActive": 47` and the fixed leaf at `command-meaning-matching.md:26` says 47.
- Impact: a maintainer reading the skill README concludes one TypeScript-served row has no `embeddingText`.
- Fix recommendation: change 46 to 47.
- Disposition: advisory, unfixed in this read-only review. `scopeProof`: `rg -n "command rows the TypeScript scorer serves"` returns this line and the fixed leaf only. `affectedSurfaceHints`: skill README paragraph, catalog leaf, generated counts.

### DMC5B-P2-002

- Evidence: "the scope names its five hook docs" while `leaf-scopes.json:7` adds `hooks/dsh/README.md` beside five earlier entries and `leaf-manifest.json:52` lists it.
- Impact: a maintainer auditing the hook leaf set cannot tell whether the sixth entry is intentional.
- Fix recommendation: change five to six.
- Disposition: advisory. `scopeProof`: the manifest prints six `hooks/` leaves; `rg -n "five hook"` outside changelog returns only this line. `affectedSurfaceHints`: `ROUTER.md`, `leaf-scopes.json`, `leaf-manifest.json`.

### DMC5B-P2-003

- Evidence: the mapping notes at `:341`, `:345` and `:346` say "in `01`", "`02`", "`03`", "`04`" and "`05`", but the nine category folders are feature-named and no `NN--*` folder or numbered section exists.
- Impact: an operator cannot resolve the notes; the daemon row's "in `05`" points at neither the `## 11. AUTO UPDATE DAEMON` section nor the `auto-update-daemon/` folder.
- Fix recommendation: name the feature folders in those three cells.
- Disposition: advisory, residual of the fixed DM5-P2-002. `scopeProof`: `rg -n "in \`0[1-9]\`"` returns only those three lines. `affectedSurfaceHints`: playbook section 18.5, inputs section, category folders.

### DMC5B-P2-004

- Evidence: section 3 lists thirteen test folders and omits `doctor/`, which holds `doctor/skill-graph-freshness-panel.vitest.ts`; section 4 in the same file lists `doctor/` at `:190`.
- Impact: a maintainer scanning the topology block believes no doctor suite folder exists.
- Fix recommendation: add a `doctor/` row to section 3.
- Disposition: advisory, predates the fix commit. `scopeProof`: `find` prints fourteen directories; section 3 lists thirteen; the same omission exists at `2a1a42263cc`. `affectedSurfaceHints`: tests README sections 3 and 4, `runtime/tests/doctor/`.

## Remediation Workstreams

- **P0:** none.
- **P1:** none.
- **P2 advisories (separate, non-blocking):**
  - `DMC5B-P2-001` and `DMC5B-P2-002` are one-line count corrections in the skill's shared docs.
  - `DMC5B-P2-003` replaces four numbered slot words in the playbook's section 18.5 notes.
  - `DMC5B-P2-004` adds one row to the tests README's package-topology block.

## Spec Seed

- The pass-five docs-metadata fixes are verified: the changelog's `loadRate` and retired-name sentences, the catalog's 47-row count, the leaf manifest/aliases/scopes trio, the tests tree, and the playbook's verdict vocabulary, category-folder example and CL schedule.
- Four P2 documentation corrections remain open (README count, router count, playbook numbered slots, tests topology).
- The confirming lineage stopped at its iteration cap (3 of 3) with no P0/P1; the stop reason is `maxIterationsReached`.

## Plan Seed

1. `README.md:176`: 46 to 47.
2. `ROUTER.md:103`: five to six.
3. `manual-testing-playbook.md:341`, `:345`, `:346`: replace numbered slot words with the feature-named folders.
4. `runtime/tests/README.md`: add the `doctor/` row to section 3.

## Traceability Status

### Core Protocols

- `spec_code`: **partial**. The packet's top-level `spec.md` does not claim these docs; phase child `032-review-pass-five-remediation` owns the fix intent and its D10 names the playbook lines it changed. Three of the four advisories are residual lists outside that decision.
- `checklist_evidence`: **notApplicable**. No top-level `checklist.md`; the phase children own their checklists.

### Overlay Protocols

- `skill_agent`: **pass**. ROUTER, SKILL and the leaf metadata describe one leaf set; the only drift is the hook count at `ROUTER.md:103`.
- `agent_cross_runtime`: **pass**. No cross-runtime claim was changed by this fix, and no runtime trust boundary was touched.
- `feature_catalog_code`: **partial**. The catalog leaf's 47 matches `command-bridges.generated.json`; the same claim survives at `README.md:176`.
- `playbook_capability`: **partial**. The playbook's verdict vocabulary, category example and CL schedule verify; section 18.5's numbered slots remain.

### AC_COVERAGE

**exempt.** The root packet carries no `acceptance-criteria.md` and no `implementation-summary.md`, so the lifecycle predicate is not active.

## Deferred Items

- The legacy scenario row `.skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/ambiguous-brief-rendering.md:62` tells the operator to answer `PASS`, `PARTIAL` or `FAIL` while the root contract now defines `PASS`/`FAIL`/`SKIP`. It predates this fix and is outside the `docs-metadata` scope file, so it is deferred rather than graded; it is worth a follow-up because the package validator's `FORBIDDEN_VERDICTS` names `PARTIAL`.
- The coverage-graph seed was skipped because it writes a database outside the lineage write boundary; the coverage evidence is the reducer's four-of-four dimension table, not a graph score.

## Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none
- Pivot lineage: none
- Remaining frontier: none recorded
- Dimensions covered: 4 of 4 (traceability, maintainability, correctness, security)

## Search Ledger

- Required bug classes across the three iterations: `stale_count`, `contradictory_statement`, `missing_inventory_entry`, `stale_inventory_list`, `numbered_reference_rot`, `unsupported_behavior_claim`, `link_rot`, `stale_line_anchor`, `holdout_leak`, `prompt_text_in_docs`, `secret_exposure`, `trust_boundary_widening`, `unfixed_active_finding`.
- Covered: `stale_count`, `contradictory_statement`, `stale_inventory_list`, `numbered_reference_rot`.
- Ruled out: `missing_inventory_entry`, `unsupported_behavior_claim`, `link_rot`, `stale_line_anchor`, `holdout_leak`, `prompt_text_in_docs`, `secret_exposure`, `trust_boundary_widening`, `unfixed_active_finding`.
- Deferred: none. Blocked: none.
- Search debt: 0. Clean-search proof records: 12. Graph coverage mode: `graphless_fallback`.

## Audit Appendix

### Convergence

- Three iterations, all `complete`; no timeout, error or stuck status.
- New-finding ratios: 1.0, 0.5, 0.0. Iteration 3 added nothing.
- Stop reason `maxIterationsReached` at iteration 3 of 3; the iteration cap is a legal terminal stop.

### Coverage

- Traceability (iteration 1), maintainability and correctness (iteration 2), security (iteration 3).
- Required protocols executed: 6 of 6. Core one partial and one notApplicable; overlays two pass and two partial.

### Ruled-Out Claims

- The leaf metadata trio is not stale or hand-diverged: 120 leaves, 120 aliases, identical order, byte-identical projection.
- The tests tree neither invents nor omits an entry: 106 doc entries against 106 disk entries.
- The playbook's `CL-004` placeholder is deliberate and self-labelling; it does not contradict the section 8 heading.
- The playbook's `READY` release word and its new `SKIP` feature rule are intentional per D10 and the template.
- No reviewed doc leaks prompt text, a corpus file name or a credential shape.
- No active finding was silently fixed during the lineage; all four replay unchanged.

### Sources Reviewed

The nine reviewed docs, the generated bridge artifact, `derive-command-bridges.cjs`, `command-attach.ts`, `score-command-transcripts.mjs`, `ci-skill-root-metadata.cjs`, `validate-playbook-package.cjs`, the playbook template, `manual-testing-playbook.vitest.ts`, `review-brief-5b.txt`, `review-scope-5b.txt`, `review-focus-5b.txt`, `verify-5/report.md`, the remediation `plan.md`, and the two re-review reports.

### Cross-Reference Appendix

- Core: `spec_code` partial, `checklist_evidence` notApplicable.
- Overlay: `skill_agent` pass, `agent_cross_runtime` pass, `feature_catalog_code` partial, `playbook_capability` partial.

### Area Boundary

The focus names code behaviours outside this lineage's area: the shell write reader, the `COMMAND:` line reader, the arena builder's refusals and JSON line, the live-turn remote guard, and the kill-switch names. Those files are assigned to the `accuracy-runner-confirm-5b` and `kill-switch-cli-confirm-5b` lineages by `review-scope-5b.txt`; this lineage checked the `docs-metadata` files and the shared docs that describe them, and did not open the holdout corpora.
