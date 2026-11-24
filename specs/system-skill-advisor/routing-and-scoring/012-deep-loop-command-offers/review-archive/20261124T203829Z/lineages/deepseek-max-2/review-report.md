# Deep Review Report - 012-deep-loop-command-offers (lineage deepseek-max-2, generation 8)

## 1. EXECUTIVE SUMMARY

- **Overall verdict: CONDITIONAL.**
- **hasAdvisories: false** (the verdict is CONDITIONAL, so the advisory flag is not set even though four P2 findings are active).
- **P0 / P1 / P2: 0 / 0 / 4** — the counts this verdict used, read from `deep-review-findings-registry.json` after the final reduction.
- **Why CONDITIONAL and not PASS:** one open search-debt row. `feature_catalog_code` found a catalog sentence that the build has moved past, and the catalog page lies outside this lineage's seeded review scope, so the row was deferred rather than filed. With no active P0, no active P1 and no failed required gate, the search debt is the only reason the verdict is not PASS.
- **Self-check outcome:** no active P0 or P1 existed at synthesis, so no finding went through a confirm/downgrade/false-positive call. All four P2 findings were re-derived from the tree during the iteration that filed them (recomputed counts and set differences), not carried from a prior round.
- **Review scope:** 72 files pre-bound in `review-scope-files.txt`, the packet's 52 requirements, 111 tasks, 60 acceptance rows and nine decision records, read across 7 iterations all bound to the operator's traceability focus.
- **Operator review focus (config.reviewFocus, verbatim):** Traceability: finish the spec_code and checklist_evidence protocols. Check every REQ in spec.md against the code that implements it or the decision that records it, and every ticked task in tasks.md and every Met row in acceptance-criteria.md against evidence that really exists in the tree, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).
- **What the focus produced:** `spec_code` and `checklist_evidence` both finished (pass), 52 of 52 requirements bound, every acceptance `Evidence:` tail resolved, and four closure-record drifts found where nine previous rounds had left counts and one scope claim behind the tree. No word-rule or gate-behaviour gap was found in either gate copy.

## 2. PLANNING TRIGGER

`/speckit:plan` is **not required**. The verdict is CONDITIONAL on search debt alone, and the review doctrine's rule for that state is another `/deep:review` over the deferred surface, not a remediation plan. No P0 or P1 exists, and the four active findings are one-line documentation corrections that a docs pass can make without a spec change.

**Planning Packet**

```json
{
  "triggered": false,
  "reviewDidNotRun": false,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    "L2-P2-001",
    "L4-P2-001",
    "L4-P2-002",
    "L6-P2-001"
  ],
  "remediationWorkstreams": [
    {
      "id": "WS-1",
      "title": "One pass over three closure documents for the pair-count drift",
      "severity": "P2",
      "findings": ["L4-P2-001", "L6-P2-001"],
      "files": [
        "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md",
        "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md"
      ]
    },
    {
      "id": "WS-2",
      "title": "Record the eleventh fix round and the fifth/sixth reruns in the timeline",
      "severity": "P2",
      "findings": ["L2-P2-001"],
      "files": ["specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/timeline.md"]
    },
    {
      "id": "WS-3",
      "title": "Qualify T111's scope claim for the generated build directory",
      "severity": "P2",
      "findings": ["L4-P2-002"],
      "files": ["specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md"]
    },
    {
      "id": "WS-4",
      "title": "Next review pass over the deferred feature-catalog surface",
      "severity": "search-debt",
      "findings": [],
      "files": [".skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md"]
    }
  ],
  "specSeed": [
    "REQ-031's 'it names no list count' rule is the right call: the guard's surface grows, so a count in the requirement would drift every round. The same rule should govern the acceptance row that quotes it.",
    "REQ-034 should gain a clause asking every closure document to name the round that produced its count, so a later round cannot leave a stale figure behind.",
    "A requirement that asks for a rerun whose terminal gates read coverage pass (REQ-033) needs the rerun's dispatch to bind all four dimensions, because a lineage bound to one dimension cannot satisfy it."
  ],
  "planSeed": [
    "Correct the three closure records in one pass: tasks.md T076 and T092 (pair counts, and T092's claim that REQ-031 names ten per-entry lists and five that do not), acceptance-criteria.md AC-038 (22 pairs, RUN_ASK_REFUSAL_LEADS as last, and the twelve/ten split), and timeline.md's last entry and AC-040 milestone.",
    "Quote the guard's surface as a named set (VOCABULARY_PAIRS, NUMERIC_PAIRS, PATTERN_PAIRS, PATTERNS_NOT_COMPARED) rather than as counts, so a future pair does not date the text.",
    "Add one sentence to T111's verify clause: generated build output (`runtime/dist/`) is gitignored and is not seeded into the review scope.",
    "Add the read-only loop exception to the feature catalog's no-edit sentence, and re-run this review with the catalog page inside the scope so the deferred row closes."
  ],
  "findingClasses": ["docs-drift"],
  "affectedSurfacesSeed": [
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md",
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md",
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/timeline.md",
    ".skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md"
  ],
  "fixCompletenessRequired": false
}
```

## 3. ACTIVE FINDING REGISTRY

| ID | Severity | Title | Dimension | File:line | Evidence | Impact | Fix recommendation | Disposition | Finding class | Scope proof | Affected surface hints |
|----|----------|-------|-----------|-----------|----------|--------|--------------------|-------------|---------------|-------------|------------------------|
| `L2-P2-001` | P2 | The packet timeline stops one review round short of its own record | traceability | `timeline.md:41` | `timeline.md:41` says "Four traceability reruns alternated with fix rounds seven to ten"; `spec.md:309` records a fifth rerun and `tasks.md:209` an eleventh round with six ticked tasks | A reader dating a change from the timeline stops a round early | Name the fifth rerun and the eleventh round in section 2, and retarget the AC-040 milestone at the review now in flight | active | docs-drift | both documents are lines of `review-scope-files.txt`; packet-doc to packet-doc contradiction | `timeline.md` section 2 last entry; section 3 AC-040 milestone |
| `L4-P2-001` | P2 | Two ticked tasks state a drift-guard pair count the tree no longer has | traceability | `tasks.md:184` | T092 says "the drift guard compares fifteen pairs" and asks that REQ-031 name ten per-entry lists and five that do not; REQ-031 names no count and `VOCABULARY_PAIRS` holds 25 entries; T076 says "twenty-two pairs" | A reader sizes the guard from the wrong number | Quote the guard's named sets instead of counts, and update both tasks | active | docs-drift | `tasks.md` and `deep-loop-offer-cases.vitest.ts` both in scope; counts recomputed in scope | `tasks.md` T076 and T092 |
| `L4-P2-002` | P2 | T111's scope claim cannot hold for the generated `runtime/dist` entry | traceability | `tasks.md:218` | The scope file holds 72 lines, none of them `.skilled/skills/system-skill-advisor/runtime/dist`; `.gitignore:60` excludes `dist/` | A scripted re-check of T111 reports a false miss | Qualify the verify clause: generated build output is gitignored and not seeded | active | docs-drift | both files in scope; set difference over the declared change set | `tasks.md` T111 |
| `L6-P2-001` | P2 | AC-038's pair count and per-entry split no longer match the drift guard | traceability | `acceptance-criteria.md:95` | The cell says 22 pairs, `RUN_ASK_REFUSAL_LEADS` last, and a twelve/ten per-entry split; the tree holds 25 entries, `RUN_ASK_REFUSAL_VERBS` last, and 13 per-entry cases (`deep-loop-offer-cases.vitest.ts:121-147,474`) | A `Met` row describes a guard three pairs smaller than it is | Quote the sets, not the counts; the row's substance (a one-sided edit fails the guard) is unchanged | active | docs-drift | both files in scope; figures recomputed in scope | AC-038 verification cell; `tasks.md` T076 and T092 carry the same class |

## 4. REMEDIATION WORKSTREAMS

**P0 workstreams:** none.

**P1 workstreams:** none.

**P2 advisories (one docs pass, three files):**

1. **Closure-record counts (WS-1):** `acceptance-criteria.md:95` and `tasks.md:154,184`. Replace the three stale figures with the named sets they describe. The guard itself needs no change; `spec.md` REQ-031 already refuses to carry a count.
2. **Timeline round total (WS-2):** `timeline.md:41,53`. Add the fifth rerun (generation 7) and the eleventh fix round (T106 to T111), and retarget the AC-040 milestone.
3. **Scope claim (WS-3):** `tasks.md:218`. Qualify the claim for the gitignored generated directory.
4. **Deferred surface (WS-4, not a finding):** the feature catalog's no-edit sentence. Out of scope here by design; it is the search-debt row the verdict reads.

## 5. SPEC SEED

- REQ-031's "names no list count" rule should extend to the acceptance row that quotes the guard. A count in a closure record is the one thing every round has had to chase.
- REQ-034 could ask each closure document to name the round that produced its number, so a later round cannot silently date it.
- REQ-033 asks for a rerun whose terminal gates read coverage pass; a rerun bound to a single operator focus cannot satisfy that. The requirement should say what the rerun's dimension binding must be.

## 6. PLAN SEED

- Fix the three closure records in one pass and re-run the packet's own `scratch/citations/evidence-tails.py` afterwards; it already reports `problems=0`, so nothing else in the acceptance table needs touching.
- Use named sets (`VOCABULARY_PAIRS`, `NUMERIC_PAIRS`, `PATTERN_PAIRS`, `PATTERNS_NOT_COMPARED`) wherever a count would be written.
- Add the read-only loop exception to `feature-catalog/cli-surface/advisor-recommend.md:33`, then run a review whose scope seeds that page so the deferred row closes.

## 7. TRACEABILITY STATUS

**Core Protocols**

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` | pass | 52 of 52 requirement rows bound across iterations 1 to 3; the last slice's symbols are `command-attach.ts:539,1693`, `hub-router.json` `routerSignals`, `reduce-state.cjs:227,2378,2421` | none |
| `checklist_evidence` | pass | 47 of 111 ticked tasks read with counts recomputed (iteration 4), AC-001 to AC-029 (iteration 5), AC-030 to AC-042 recomputed (iteration 6); all 60 acceptance `Evidence:` tails resolve and the packet's checker reports `problems=0` | the four P2 docs-drift records above |

**Overlay Protocols**

| Protocol | Status | Evidence | Notes |
|----------|--------|----------|-------|
| `skill_agent` | pass | `deep-review/SKILL.md` and `.skilled/agents/deep-review.md` agree on the final-line contract, the status enum and the LEAF boundary | the depth triggers REQ-011 removed are absent from both |
| `agent_cross_runtime` | pass | `.opencode/agents/deep-review.md` identical; `.claude/agents/deep-review.md` differs on 22 lines of runtime frontmatter and path convention | mirrors are read-only packaging surfaces |
| `feature_catalog_code` | partial | `feature-catalog/cli-surface/advisor-recommend.md:33` states the universal no-edit rule; `command-attach.ts:1618-1620` exempts the deep loop's read-only modes | the page is outside the seeded scope, so the drift is deferred search debt |
| `playbook_capability` | pass | NC-012's three offer gates are writing-workflow gates, unchanged by REQ-040 | no scenario claims a deep-loop behaviour |

**AC_COVERAGE signal:** `advisory-shortfall` — 59 of 60 acceptance rows read `Met`, `Waived` or `Superseded`; `AC-040` reads `Unmet` because it asks for a rerun whose terminal gates read coverage pass, and this lineage covered one of the four configured dimensions. The closure statement already says `Closeable: No` for the same reason. The signal stays advisory while the validation rule is INFO.

## 8. DEFERRED ITEMS

- **The feature catalog's no-edit sentence** (`feature-catalog/cli-surface/advisor-recommend.md:33`): deferred, not filed, because the page is outside `review-scope-files.txt`. Recorded as search debt `SL-019` with both lines cited.
- **Correctness, security and maintainability were not re-reviewed by this lineage.** All seven iterations ran the operator's traceability focus. The registry reports `dimensionCoverage {correctness: false, security: false, traceability: true, maintainability: false}`; a follow-up run with those dimensions bound to its own iterations is the way to cover them.
- **Behavioural re-measurement** of the 69 probes, the 247-row corpus and the two test suites was not run from this lineage: the write surface is the lineage directory, and the gates belong to the build's own runs. The findings rest on the tree, on recomputed counts and on the recorded artefacts, not on a fresh run.
- **Frontier work:** the registry carries no `frontier` object (default depth mode), so there are no exhausted or blocked review nodes to list here.

## Dimension Expansion Map

No divergence occurred: no pivots, no saturated directions, no audited overrides and no frontier. The run used a fixed operator focus across all seven iterations, so the breadth record is the iteration sequence itself:

| Iteration | Direction | Outcome |
|-----------|-----------|---------|
| 1 | REQ-001 to REQ-014 against code and documents | clean |
| 2 | REQ-015 to REQ-034, ADR-005 and ADR-006 | 1 P2 (timeline) |
| 3 | REQ-035 to REQ-052, drift guard and reducer | clean |
| 4 | Ticked tasks, counts recomputed | 2 P2 (tasks) |
| 5 | AC-001 to AC-029 | clean |
| 6 | AC-030 to AC-042, sixth round | 1 P2 (AC-038) |
| 7 | Overlay protocols and consolidation | clean, one deferred row |

## 9. SEARCH LEDGER

- **searchCoverage:** required bug classes `mirror_drift`, `contract_contradiction`, `catalog_drift`, `playbook_precondition`; covered `catalog_drift`; ruled out `mirror_drift`, `contract_contradiction`, `playbook_precondition`; deferred `catalog page wording`; blocked none. `graphCoverageMode: graphless_fallback` (no coverage graph store was seeded in this lineage).
- **candidateCoverage:** five bug classes produced a finding (`stale_count`, `stale_evidence`, `overstated_verify`, `spec_code_gap`, `catalog_drift`); fifteen appear in `ruledOut`, two of them classes that produced a finding in an earlier iteration (`spec_code_gap`, `stale_count`), and thirteen were ruled out outright (`dangling_evidence`, `unbacked_waiver`, `missing_case`, `uncompared_pattern`, `mode_surface_drift`, `reducer_regression`, `unresolvable_reference`, `unimplemented_decision`, `missed_layer`, `mirror_drift`, `contract_contradiction`, `playbook_precondition`, `doc_code_drift`).
- **searchDebt: 1** — `SL-019`, the deferred catalog page. `hasSearchDebt: true`; this row is the verdict's only driver, and the next step it implies is another `/deep:review` bound to the catalog surface.
- **ruledOutCandidates: 15** — the ledger rows from iterations 1 to 7, each with the action that eliminated it (a set comparison for the gate patterns, a byte comparison for the mirrors, a prompt-by-prompt fixture lookup, a per-row evidence-tail resolution, and direct reads of the reducer helpers).
- **cleanSearchProof:** every ruled-out direction names the action that eliminated it and the file:line it read; no direction was closed on the absence of a hit alone. The two directions that needed a computation (the 43 compiled gate patterns, the scope set difference) were computed rather than assumed.

## 10. AUDIT APPENDIX

**Convergence summary**

- 7 of 7 iterations dispatched, all `status: complete`; stop reason `maxIterationsReached` under `stopPolicy: max-iterations`.
- `newFindingsRatio` by iteration: 0.00, 1.00, 0.00, 1.00, 0.00, 1.00, 0.00. Convergence was telemetry only; the run stopped at the cap by design.
- Findings: 4 active, all raised in this run, all P2, all docs-drift. None was carried in from an earlier generation.

**Coverage summary**

- `traceability`: covered (iterations 1 to 7, both core protocols and all four overlay protocols).
- `correctness`, `security`, `maintainability`: not covered by this lineage (operator focus).
- Dimension coverage ratio: 1 of 4 = 0.25.
- Per-iteration scope: 72 pre-bound files; no finding filed outside them.

**Ruled-out claims (15)**

- Compiled contracts stale against the edited presentations (compiler slice markers).
- A requirement with no acceptance row (52 of 52 covered).
- A declared change-set file missing from the tree (26 of 26 exist).
- A REQ-015 to REQ-034 prompt missing from the shared fixture (48 of 51 quoted strings resolve; 3 are not prompts).
- A drift-guard list with no Python counterpart (`SMALL_EDIT_WORDING` is the deliberate exception).
- A refinement folding across files (`refinesSameLocation`).
- A gate pattern neither compared nor listed (43 compiled = 43 accounted).
- `MODE_CUES` and the hub router keying different modes (both `research`, `review`).
- A degraded row keeping a withheld command (the branch strips four fields).
- A read-only loop lost to a no-edit clause (the guard at `command-attach.ts:1620`).
- A ticked task whose named test or fixture row is absent (every title and id resolves).
- A corpus-count drift (0 of 57 and 1 of 57).
- A citation tail on the wrong line (`problems=0`).
- A waiver without a decision record (four waived or superseded rows, four ADRs).
- A runtime mirror drifted in substance (frontmatter and path convention only).

**Sources reviewed**

Core protocols: `spec.md` (52 REQ rows), `tasks.md` (111 tasks, 51 CHK items), `acceptance-criteria.md` (60 rows), `decision-record.md` (9 ADRs), `implementation-summary.md`, `timeline.md`. Overlay protocols: `.skilled/skills/system-deep-loop/deep-review/SKILL.md`, `.skilled/agents/deep-review.md` and its two runtime mirrors, `feature-catalog/cli-surface/advisor-recommend.md`, `manual-testing-playbook/native-cli-tools/command-offer-fit-gates.md`. Code: `command-attach.ts`, `skill_advisor.py`, `explicit.ts`, `fusion.ts`, `subprocess.ts`, `skill-advisor-cli.ts`, `advisor-recommend.ts`, `reduce-state.cjs`, `compile-command-contracts.cjs`. Tests and fixtures: `deep-loop-offer-cases.vitest.ts`, `command-attach-guards.vitest.ts`, the scorer, handler, degraded-path and Python test files, and the 359-case shared fixture. Corpus: `command-prompts.jsonl` (247 rows), `command-routing-baseline.json`. Packet scratch: `probes/`, `behaviour/`, `citations/`.

---

*Compiled from 7 iteration files by lineage `deepseek-max-2`, session `fanout-deepseek-max-2-1795550334883-gjbarh`, generation 1, stop reason `maxIterationsReached`.*
