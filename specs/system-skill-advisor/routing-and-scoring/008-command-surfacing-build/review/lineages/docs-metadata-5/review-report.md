# Review Report - docs-metadata lineage, command-surfacing pass five

## 1. Executive Summary

- **Overall verdict: FAIL** — gate-level, not defect-level. No P0 and no P1 finding exists. Eight P2 advisories are active. The FAIL comes from one required terminal quality gate: coverage stability was not achieved before the iteration cap (see section 8).
- **hasAdvisories: false** — the advisory flag applies only to a PASS verdict.
- **Active findings: P0=0, P1=0, P2=8.**
- **Review scope**: 14 files from `review/review-scope-5.txt` whose area is `docs-metadata`, plus the shared documents and code they describe. Reviewed across four iterations: traceability, maintainability, correctness and security.
- **Iterations**: 4 of 4. **Stop reason**: `maxIterationsReached`.
- **Release readiness**: `in-progress`.
- **Operator review focus (verbatim)**: "Code review pass five of command surfacing. Read review/review-brief-5.txt in the packet first and follow it. Review the files in review/review-scope-5.txt whose area equals your lineage label without its -5 suffix, plus docs that describe them. Each finding is P0, P1 or P2 with file:line and a concrete input. Check the kill switch and direct-call switch paths, command offers on refusal, question, history or mention, Vibe journal scoring, the doctor hooks-file reading, docs against code, and holdout hygiene. Never open command-prompts.jsonl, holdout-prompts.jsonl or behaviour-fresh-prompts.jsonl except through jq del(.prompt), and print counts only. Change no code and write only inside your lineage folder."

### Why the verdict is FAIL

The review itself is complete for its declared scope: all four configured dimensions have a full iteration, every active finding carries file:line evidence, and every finding sits inside the dispatched review scope. The terminal coverage gate still fails for two recorded reasons:

- `coverageAge = 0`. The fourth dimension (security) was covered in iteration 4, the same iteration the cap ended the loop, so the required one-pass coverage stabilization never ran.
- The reducer-owned `traceability` block is empty because this lineage's iteration records named the protocol field `protocol` where the reducer reads `protocolId`. The underlying core-protocol checks were executed and are reported in section 7; the gate cannot see them through the registry.

The first condition is a real config conflict: `maxIterations=4` with four dimensions and a one-pass stabilization requirement cannot satisfy coverage stability. The second is a bookkeeping defect in this lineage's record shape, not a missing check. Both are carried in section 8.

## 2. Planning Trigger

`/speckit:plan` is required for the eight advisory remediations and for the coverage-stability follow-up. The packet below is built from the reducer registry plus the iteration `findingDetails`; no field is inferred from prose.

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": ["DM5-P2-001", "DM5-P2-002", "DM5-P2-003", "DM5-P2-004", "DM5-P2-005", "DM5-P2-006", "DM5-P2-007", "DM5-P2-008"],
  "remediationWorkstreams": [
    "WS-1 Documentation counts and contradictions",
    "WS-2 Playbook structure and verdict vocabulary",
    "WS-3 Inventory and leaf metadata",
    "WS-4 Coverage stabilization and record-shape follow-up"
  ],
  "specSeed": [
    "State the meaning-match corpus size from the generated bridge file rather than a hand-written count.",
    "Define one scenario verdict vocabulary across the persistence contract, the review protocol and the release rule.",
    "Make the playbook wave plan and the category table one generated inventory.",
    "Add the DSH hook README to the authored leaf scope so the generated manifest and aliases include it."
  ],
  "planSeed": [
    "Correct the command-meaning row count and reconcile the create-skill alias sentence.",
    "Replace the retired NN__ directory instruction with the live feature-directory naming.",
    "Schedule CL-005..CL-010 in Wave 2 until the CL-004 scenario exists.",
    "Correct the load-rate and path-count wording in the workflow-measure note.",
    "Regenerate or restructure the tests README inventory and name the command-surfacing suites.",
    "Add hooks/dsh/README.md to leaf-scopes.json and regenerate leaf-manifest.json and leaf-aliases.json.",
    "Run one stabilization pass for coverage, or amend the iteration cap to five for a four-dimension review."
  ],
  "findingClasses": ["instance-only", "class-of-bug"],
  "affectedSurfacesSeed": [
    "changelog: workflow measure",
    "changelog: upgrade notes",
    "feature catalog: command meaning matching",
    "manual testing playbook: inputs",
    "manual testing playbook: result persistence",
    "manual testing playbook: wave plan",
    "tests README: directory tree",
    "leaf-manifest.json / leaf-aliases.json / leaf-scopes.json"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

All eight findings are P2, active, and evidenced with file:line. None relies on inference.

### DM5-P2-001 — Meaning-match row count is one behind the generated bridge corpus

- **Dimension**: traceability
- **File**: `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md:26`
- **Evidence**: the catalog says 46 rows; `command-bridges.generated.json` reports `counts.typescriptActive=47` and 47 entries with a non-empty `embeddingText`.
- **Case**: a maintainer checks whether a newly added row is covered, reads 46, and stops one row short of the served set.
- **Impact**: the catalog understates the semantic-lane corpus by one row.
- **Fix**: derive the count from the generated file, or state 47 and name the added row.
- **Disposition**: active. **Finding class**: instance-only.
- **Scope proof**: `rg -n "46 rows"` over the 14 scope files returns only line 26; the generated file is the only artifact the sentence names.
- **Affected surface hints**: ["feature catalog: command meaning matching", "generated command bridges", "meaning-match coverage"]

### DM5-P2-002 — Playbook inputs name a directory shape that no longer exists

- **Dimension**: maintainability
- **File**: `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:103`
- **Evidence**: the inputs section says `manual-testing-playbook/NN__category_name/`; the package holds nine feature-named directories with no numeric prefix. Line 38 also cites a retired `09--*` slot.
- **Case**: an operator looks for `manual-testing-playbook/01__native_cli_tools/` and finds nothing.
- **Impact**: the review protocol's first input step cannot be followed as written.
- **Fix**: name the live feature directories; drop or date-stamp the slot note.
- **Disposition**: active. **Finding class**: instance-only.
- **Scope proof**: `rg -n "NN__category_name|09--"` over the package returns only lines 38 and 103; every section table uses live paths.
- **Affected surface hints**: ["manual testing playbook: inputs", "playbook directory layout", "operator protocol"]

### DM5-P2-003 — Wave 2 schedules a scenario the package says is not authored

- **Dimension**: maintainability
- **File**: `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:155`
- **Evidence**: Wave 2 lists `CL-004`; the category table marks it "not yet authored" at line 194, and no `004-*.md` file exists.
- **Case**: an operator opens the CL-004 row during Wave 2 and cannot record a PASS, FAIL or SKIP.
- **Impact**: a release-gate wave cannot be executed as scheduled.
- **Fix**: schedule `CL-005..CL-010` until the scenario exists.
- **Disposition**: active. **Finding class**: instance-only.
- **Scope proof**: `rg -n "CL-004"` returns only the wave plan and the unauthored row.
- **Affected surface hints**: ["manual testing playbook: wave plan", "CL-004 scenario", "release readiness rule"]

### DM5-P2-004 — Upgrade note says the retired create-skill name has no alias while the release note says it still reads

- **Dimension**: traceability
- **File**: `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:251`
- **Evidence**: the upgrade note says "The old name has no alias"; the body at line 104 says a typed `/create:skill` reads as `/create:sk-skill`; `command-attach.ts:214` and `:240` implement that mapping in `RETIRED_COMMANDS`.
- **Case**: a maintainer reads only Upgrade Notes, removes `RETIRED_COMMANDS` as unused, and the promised mapping is lost.
- **Impact**: two opposite migration instructions in one release note.
- **Fix**: say the old name has no command file of its own and is redirected by `RETIRED_COMMANDS`.
- **Disposition**: active. **Finding class**: instance-only.
- **Scope proof**: both statements are in this changelog and describe the same typed spelling.
- **Affected surface hints**: ["changelog: upgrade notes", "changelog: retired command", "command-attach RETIRED_COMMANDS"]

### DM5-P2-005 — Tests README directory tree omits every command-surfacing suite added by this packet

- **Dimension**: maintainability
- **File**: `.skilled/skills/system-skill-advisor/runtime/tests/README.md:95`
- **Evidence**: the tree lists 39 `.ts`/`.json` files against 91 on disk; 52 are unlisted, including `command-attach-guards.vitest.ts`, `command-offer.vitest.ts`, `command-transcript-score.vitest.ts` and `command-bridges-drift-guard.vitest.ts`. All 39 listed files exist.
- **Case**: a maintainer diagnosing a refusal-gate regression reads the README and concludes no such suite exists.
- **Impact**: the tests README cannot route a reader to this packet's regression coverage.
- **Fix**: regenerate the tree or replace it with a stable subfolder map and name the suites in Key Files.
- **Disposition**: active. **Finding class**: class-of-bug.
- **Scope proof**: the same omission covers all six command-surfacing suites; 0 listed-but-absent files prove staleness, not invention.
- **Affected surface hints**: ["tests README: directory tree", "tests README: key files", "command-attach regression suites"]

### DM5-P2-006 — Generated leaf manifest skips the DSH hook README while listing its three siblings

- **Dimension**: traceability
- **File**: `.skilled/skills/system-skill-advisor/leaf-manifest.json:51`
- **Evidence**: `hooks/claude/README.md`, `hooks/lib/README.md` and `hooks/pi/README.md` are listed; `hooks/dsh/README.md` is absent from the manifest and aliases. The authored `leaf-scopes.json` names the three siblings and no DSH entry.
- **Case**: leaf retrieval for the DSH prompt-advisor documentation returns nothing while the parallel READMEs are reachable.
- **Impact**: the runtime added in this release has an unreachable operator README.
- **Fix**: add `hooks/dsh/README.md` to `leaf-scopes.json` and regenerate both metadata files.
- **Disposition**: active. **Finding class**: instance-only.
- **Scope proof**: manifest and aliases carry 119 identical leaves with 0 missing on disk; the three sibling rows prove the intended pattern.
- **Affected surface hints**: ["leaf-manifest.json", "leaf-aliases.json", "leaf-scopes.json", "hooks/dsh/README.md"]

### DM5-P2-007 — Playbook scenario verdict set disagrees with its result-persistence contract

- **Dimension**: maintainability
- **File**: `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:30`
- **Evidence**: the persistence contract names `PASS`, `FAIL` and `SKIP`; the scenario verdicts add `PARTIAL` at line 119, and the evidence rules require triage for it at line 84.
- **Case**: a scenario with complete behavior but incomplete evidence is recorded PARTIAL, and the contract has no defined slot for it.
- **Impact**: the protocol defines a verdict it cannot persist.
- **Fix**: add PARTIAL to the persistence contract with its storage rule, or drop it from scenario verdicts.
- **Disposition**: active. **Finding class**: instance-only.
- **Scope proof**: `rg -n "PARTIAL"` returns the verdict definition, feature rules and triage requirement; the contract and release rule name three outcomes.
- **Affected surface hints**: ["manual testing playbook: result persistence", "manual testing playbook: scenario verdicts", "release readiness rule"]

### DM5-P2-008 — Load-rate sentence and six-path heading do not match the published tally

- **Dimension**: correctness
- **File**: `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:176`
- **Evidence**: the note says `loadRate` counts runs that "loaded a workflow" and heads the section "Six Paths"; the scorer's numerator is `command + skill` only, `otherMode` is excluded, and the published tally carries a seventh path `noOwner`.
- **Case**: an arm with `command=6`, `skill=2`, `otherMode=2` and all other paths 0 yields a doc-implied load rate of 1.0, while the scorer reports 0.8.
- **Impact**: a release reader cannot recompute the rate from the described counts.
- **Fix**: state that `otherMode` loads a different workflow and stays out of the numerator, and define or exclude `noOwner`.
- **Disposition**: active. **Finding class**: instance-only.
- **Scope proof**: one formula in the note, one `loadRate` construction and one `workflowPath` union in the scorer.
- **Affected surface hints**: ["changelog: workflow measure", "transcript scorer loadRate", "transcript scorer workflow tally"]

## 4. Remediation Workstreams

### P0 — none

### P1 — none

### P2 advisories (ordered by reader cost)

1. **WS-1 Documentation counts and contradictions** — DM5-P2-001, DM5-P2-004, DM5-P2-008. Fix the stale corpus count, the alias contradiction and the workflow-measure definition.
2. **WS-2 Playbook structure and verdict vocabulary** — DM5-P2-002, DM5-P2-003, DM5-P2-007. Fix the retired directory instruction, the unauthored wave entry and the PARTIAL persistence gap.
3. **WS-3 Inventory and leaf metadata** — DM5-P2-005, DM5-P2-006. Regenerate the tests tree and add the DSH README to the authored leaf scope.
4. **WS-4 Coverage stabilization** — no finding; run a fifth pass or amend the cap so coverage stability can be recorded.

## 5. Spec Seed

- The feature catalog must derive corpus counts from generated artifacts; a hand-written count is a stale-count defect by construction.
- The manual-testing playbook needs one verdict vocabulary shared by the persistence contract, the scenario verdicts and the release rule.
- The playbook wave plan and the category table must share one source; the CL-004 drift proves two hand-maintained inventories cannot stay aligned.
- The skill-root leaf scope must include every maintained runtime's README, not three of four.
- Release notes that publish rates must state the exact numerator and denominator, including the paths that are excluded.

## 6. Plan Seed

- Correct `command-meaning-matching.md` to 47 rows and name the added row.
- Rewrite `changelog/v1.1.0.0.md:251` to match the body's `RETIRED_COMMANDS` behavior.
- Rewrite the workflow-measure paragraph to define `loadRate` as `command + skill` over the six owned paths and to define `noOwner`.
- Replace `manual-testing-playbook/NN__category_name/` with the live feature-directory naming.
- Remove CL-004 from Wave 2 or author the scenario.
- Add PARTIAL to the result-persistence contract, or remove it from the scenario verdicts.
- Regenerate `runtime/tests/README.md` from the directory listing and name the command-surfacing suites in Key Files.
- Add `hooks/dsh/README.md` to `leaf-scopes.json`; regenerate `leaf-manifest.json` and `leaf-aliases.json`.
- Schedule one stabilization pass for the coverage gate, or raise `maxIterations` to five in a future run.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` | partial | No top-level `spec.md` names the docs-metadata files; phase child `025-release-notes-and-doc-sync` owns the release-note intent. Doc-to-code claims were checked directly. | The packet-level spec-to-doc link is not recorded at the top level. |
| `checklist_evidence` | notApplicable | No top-level `checklist.md`; phase children own their checklists and are outside this lineage's declared scope. | None; the exclusion is explicit. |

### Overlay Protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `skill_agent` | pass | Scoped docs describe `system-skill-advisor` behavior; `SKILL.md` routes readers to the same playbook and catalog packages. | None. |
| `agent_cross_runtime` | pass | Vibe and Claude surfaces checked against their handlers; Codex, Cursor and Devin shims are outside the scope list. | Codex, Cursor and Devin were not re-verified in this pass. |
| `feature_catalog_code` | partial | Four catalog leaves checked against named code; DM5-P2-001 and DM5-P2-004 remain open. | Two advisories. |
| `playbook_capability` | partial | Inventory, wave plan and verdict vocabulary checked; DM5-P2-002, DM5-P2-003 and DM5-P2-007 remain open. | Three advisories. |

### AC_COVERAGE

`exempt` — the review target's top level has no `checklist.md` and no top-level `implementation-summary.md`; phase children own those artifacts and are outside this lineage's scope.

### Resource Map Coverage Gate

Skipped: `resource_map_present=false` at init, so the gate and its three bullets do not apply.

## 8. Deferred Items

1. **Coverage stabilization (gate-level FAIL cause).** All four dimensions are covered, but `coverageAge=0` because the last dimension landed in iteration 4. The 4-iteration cap and the one-pass stabilization rule conflict. Recovery: run a fifth pass, or amend a future run's `maxIterations` to five for a four-dimension review.
2. **Registry traceability block empty (gate-level false negative).** This lineage's `traceabilityChecks.results` rows used `protocol`, while `reviewTraceabilityCovered()` reads `protocolId`. The checks were executed and are reported in section 7; the registry cannot see them. Recovery: emit `protocolId` in future iteration records.
3. **Delta finding rows omit `dimension`, `findingClass`, `scopeProof` and `affectedSurfaceHints`.** The reducer's `openFindings` therefore defaults the dimension to `correctness` and stores null for the class and scope proof. This report uses the iteration `findingDetails` instead. Recovery: extend the delta finding row with those fields.
4. **Continuity save was not run.** The dispatch's write boundary forbids `generate-context.js`; the parent workflow owns that save outside this lineage.
5. **No packet lock was acquired.** The detached lineage is single-threaded and the fan-out harness owns the lineage boundary; the workflow's lock file is absent.

## Dimension Expansion Map

- **Completed pivots**: 0
- **Failed pivots**: 0
- **Audited overrides**: 0
- **Saturated directions**: none
- **Selected review directions**: traceability (iteration 1), maintainability (iteration 2), correctness (iteration 3), security (iteration 4)
- **Remaining frontier**: none. All four configured dimensions have a full iteration; no additional read-only direction was proposed by a pivot.

## 9. Search Ledger

- **Required bug classes**: 9 across the run, with 4 security classes added in iteration 4.
- **Covered (7)**: `stale_count`, `broken_path_reference`, `contradictory_statement`, `missing_inventory_entry`, `metadata_scope_gap`, `verdict_vocabulary_split`, `metric_formula_mismatch`.
- **Ruled out (13)**: `unsupported_behavior_claim`, `link_rot`, `graph_drift`, `stale_line_anchor`, `offer_counted_without_offer`, `load_counted_without_load`, `journal_scoring_divergence`, `holdout_leak`, `prompt_text_in_docs`, `kill_switch_bypass`, `daemon_switch_forwarding`, plus the repeated `missing_inventory_entry` and `broken_path_reference` checks in iteration 2.
- **Deferred**: none.
- **Blocked**: none.
- **Search debt**: 0.
- **Graph coverage mode**: `graphless_fallback` (no coverage graph nodes were available; every check used direct reads, exact searches, directory listings, link resolution and generated-artifact comparison).

### Clean Search Proof

Each ruled-out direction carries the citation that closed it:

- `link_rot` — every relative markdown link in the nine scoped documents resolves.
- `unsupported_behavior_claim` — the kill-switch vocabulary, the three mode suffixes and the small-edit vocabulary all match the named code.
- `graph_drift` — `graph-metadata.json` and `skill-graph.json` agree on 32 signals and every enhance edge.
- `stale_line_anchor` — all four cited option anchors in `advisor-recommend.md` land on the named declarations.
- `missing_inventory_entry` (iteration 2) — 13 of 13 named subfolders and 5 of 5 named files exist; the defect is omission.
- `broken_path_reference` (iteration 2) — the central doctor playbook link resolves.
- `offer_counted_without_offer` — the `asked` path requires an ask policy, no write and an observed ask-and-wait.
- `load_counted_without_load` — the load-rate numerator is `command + skill`, both witnessed loads.
- `journal_scoring_divergence` — Vibe journal records feed the same `workflowPath()`.
- `holdout_leak` — no scoped document names a holdout file or quotes an attributed holdout row.
- `prompt_text_in_docs` — the health-record schema and its sample carry no prompt text.
- `kill_switch_bypass` — the CLI reads the switch before any daemon or scorer work.
- `daemon_switch_forwarding` — the launcher's child-environment allowlist has no advisor disable key.

## 10. Audit Appendix

### Convergence Summary

- Iterations: 4. Stop reason: `maxIterationsReached`. Terminal gate rows: evidence pass, scope pass, coverage fail.
- Convergence script gates at the stop: `convergenceGate` pass (score 0.55), `dimensionCoverageGate` fail (`missing=[]`, `coverageAge=0`, `traceabilityCovered=false`), `p0ResolutionGate` pass, `evidenceDensityGate` pass, `hotspotSaturationGate` fail, `claimAdjudicationGate` pass, `fixCompletenessReplayGate` pass, `candidateCoverageGate` fail, `graphlessFallbackGate` fail.
- The terminal cap is legal at `maxIterationsReached`; the failed gates are recorded as synthesis evidence, and only coverage is a required terminal gate.

### Coverage Summary

- Dimensions: 4 of 4 covered. `correctness=true`, `security=true`, `traceability=true`, `maintainability=true`.
- Findings by iteration: 6 + 1 + 1 + 0 = 8 active P2, 0 resolved.
- `newFindingsRatio` by iteration: 1.00, 0.14, 0.13, 0.00.
- Files reviewed: all 14 scope files, plus 20 code and artifact surfaces read as evidence.

### Cross-Reference Appendix

**Core Protocols**: `spec_code` partial, `checklist_evidence` notApplicable.

**Overlay Protocols**: `skill_agent` pass, `agent_cross_runtime` pass with the Codex/Cursor/Devin caveat, `feature_catalog_code` partial, `playbook_capability` partial.

### Sources Reviewed

- All 14 files listed in `review/review-scope-5.txt` under `docs-metadata`.
- Code and artifacts read as evidence: `command-attach.ts`, `render.ts`, `fusion.ts`, `advisor-disabled.ts`, `skill-advisor-cli.ts`, `hook-flags.cjs`, `hook-flags.env.example`, `metrics.ts`, `post-dispatch-validate.ts` (gate shape), `score-command-transcripts.mjs`, `derive-command-bridges.cjs`, `command-bridges.generated.json`, `skill-advisor-launcher.cjs`, `prompt-advisor.mjs` (Vibe), `advisor-tool-schemas.ts`, `manual-testing-playbook.vitest.ts`, `leaf-scopes.json`, `graph-metadata.json`, `skill-graph.json` and the doctor playbook DOC-385..DOC-391 files.

### Deviations and Limits

- No prompt corpus was opened; holdout hygiene holds.
- No file outside the lineage directory was written.
- The packet lock was not acquired (harness-owned boundary).
- Continuity save was not run (dispatch write boundary).
- The Vibe journal scorer was checked by code path, not by scoring a live journal; the stored arm transcripts were not opened.
- The load-rate finding is a documentation-definition finding; the scorer's number was not recomputed from an arm.

### Rule Sources

Rule sources: `.skilled/skills/sk-code/sk-code-review/references/review-core.md`. Overrides: none. Refused: none. Ignored: none. Conflicts: none.
