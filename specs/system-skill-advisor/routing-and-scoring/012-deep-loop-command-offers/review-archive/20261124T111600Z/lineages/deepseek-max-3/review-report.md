# Deep Review Report

- Target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder)
- Run: `fanout-deepseek-max-3-1795514074741-gl47kr`, generation 4, lineageMode `new`, parent `2026-11-24T09:54:34.000Z`
- Lineage: `deepseek-max-3`, one of three in a command-owned fan-out of `/deep:review`
- Executor: `cli-pi` model `deepseek-v4.1-flash-1017`, reasoning effort `max`
- Iterations: 5 of 5, stop reason `maxIterationsReached`
- Operator review focus: traceability — finish `spec_code` and `checklist_evidence`, checking every REQ row and every ticked task and `Met` acceptance row against evidence in the tree, including the sixth fix round.

---

## 1. Executive Summary

- **Overall verdict: FAIL**
- **hasAdvisories: false** (advisories are a PASS-only flag; this run carries P2 findings under a FAIL)
- **Findings, the counts the verdict used: P0 = 0, P1 = 0, P2 = 5**
- **Self-check:** no P0 or P1 was raised, so no Hunter/Skeptic/Referee pass or claim-adjudication gate applied. Each P2 was re-read against its cited line before it was recorded; one candidate was withdrawn when its count proved to be a header mention rather than a row count.
- **Why FAIL rather than PASS with advisories:** the terminal coverage gate failed with `coverage-too-young`. All four canonical dimensions are covered and both core traceability protocols read `pass`, but the fourth dimension (`maintainability`) was first covered in the final iteration, so the run stopped with no stabilization pass after coverage completed. `review-verdict.cjs` makes a failed required gate a FAIL, and the strongest-restriction merge will read the same row.
- **Review scope:** the 46 paths in `review-scope-files.txt` — two gate copies, the scorer lanes, the two command documents, the two presentation assets, both deep-loop YAML workflows, the shared fixture and its suites, the reducer and close-out scripts, packet 013's closure docs, and the packet's own five documents.
- **What the review found:** the packet is in good shape after seven rounds. All 34 REQ rows resolve to a producer, an accepted decision or a stored measurement; all 87 task rows and 43 acceptance rows were checked, and fifteen ticked rows were rerun with their own commands. The five P2s are documentation-accuracy defects: one stale acceptance cell, one requirement whose wording outruns its test surface, one requirement that names the wrong test file, one question shape the offer gate reads as a request, and one closure document still carrying the scaffold's continuity block.
- **Operator review focus, verbatim:** Traceability: finish the spec_code and checklist_evidence protocols. Check every REQ in spec.md against the code that implements it or the decision that records it, and every ticked task in tasks.md and every Met row in acceptance-criteria.md against evidence that really exists in the tree, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).

## 2. Planning Trigger

`/speckit:plan` is required: the run stopped on a failed required gate, and the five P2 findings need a documentation lane plus one more review pass.

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": {
    "P0": 0,
    "P1": 0,
    "P2": 5,
    "ids": ["R2-P2-001", "R3-P2-001", "R3-P2-002", "R3-P2-003", "R5-P2-001"]
  },
  "remediationWorkstreams": [
    {
      "id": "WS-1",
      "priority": "gate",
      "title": "Give coverage a stabilization pass",
      "findingIds": [],
      "scope": ["specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review"],
      "done": "a follow-up review run ends with terminal gates evidence, scope and coverage all pass"
    },
    {
      "id": "WS-2",
      "priority": "P2",
      "title": "Correct the four documentation defects",
      "findingIds": ["R2-P2-001", "R3-P2-001", "R3-P2-002", "R3-P2-003", "R5-P2-001"],
      "scope": [
        ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts",
        ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py",
        ".skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json",
        "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md",
        "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md"
      ],
      "done": "the two interrogative forms withhold, REQ-031 and REQ-006 name what the tests hold, AC-029 quotes the current count, and the acceptance criteria carry a live continuity block"
    }
  ],
  "specSeed": {
    "packet": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers",
    "options": [
      "amend REQ-031 and REQ-006 in place, since neither changes behaviour",
      "record ADR-008 for the interrogative vocabulary addition and cite it from REQ-016"
    ]
  },
  "planSeed": [
    "add the first-person interrogative forms to COMMAND_ASK_NAMED_WORDS and the Python tuple, with a fixture row",
    "repoint REQ-006 and the Edge Cases at command-attach-guards.vitest.ts, or move the cases",
    "repair AC-029's quoted count and the acceptance criteria continuity block",
    "rerun one review pass with maintainability covered before the last iteration"
  ],
  "findingClasses": {
    "R2-P2-001": "class-of-bug",
    "R3-P2-001": "instance-only",
    "R3-P2-002": "instance-only",
    "R3-P2-003": "instance-only",
    "R5-P2-001": "instance-only"
  },
  "affectedSurfacesSeed": [
    "command-attach.ts COMMAND_ASK_NAMED_WORDS",
    "skill_advisor.py _COMMAND_ASK_LEAD_LIST",
    "tests/fixtures/deep-loop-offer-cases.json",
    "spec.md REQ-006, REQ-031 and the Edge Cases",
    "acceptance-criteria.md AC-029 and its frontmatter"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | Evidence | Finding class |
|---|---|---|---|---|---|
| R2-P2-001 | P2 | security | A question that leads with `how do` or `how can` still gets the command attached | `command-attach.ts:1061`, `skill_advisor.py:5227` | class-of-bug |
| R3-P2-001 | P2 | traceability | `AC-029` quotes a suite count the changelog no longer carries | `acceptance-criteria.md:86`, `v4.2.0.0.md:759` | instance-only |
| R3-P2-002 | P2 | traceability | `REQ-031` promises a fixture case for every list entry, and four of the twelve compared lists have none | `spec.md:243`, `deep-loop-offer-cases.vitest.ts:66` | instance-only |
| R3-P2-003 | P2 | traceability | `REQ-006` and the Edge Cases name a test file that holds none of the cases they describe | `spec.md:213`, `spec.md:321`, `command-attach-guards.vitest.ts:531` | instance-only |
| R5-P2-001 | P2 | maintainability | The acceptance criteria still carry the scaffold's continuity block | `acceptance-criteria.md:11` | instance-only |

Per finding, the fix-completeness triple:

- **R2-P2-001** — Fix: add `how do`, `how can`, `how should`, `how would` (and the `i`/`we` forms) to `COMMAND_ASK_NAMED_WORDS`, which reaches both copies through one list. Scope proof: both files in `reviewScopeFiles`, four shapes probed live in both languages. Affected surfaces: the list, the Python tuple, the fixture, `command-attach-guards.vitest.ts`. Case: an operator asks how to alias the command and is offered a run.
- **R3-P2-001** — Fix: restate the count as the changelog's current one, or point the cell at `implementation-summary.md:172`. Scope proof: the line and the cell were both printed. Affected surfaces: `acceptance-criteria.md`, the changelog. Case: a closure reader searches the changelog for 2,696 and cannot tell which document is stale.
- **R3-P2-002** — Fix: either amend `REQ-031` to name the lists it means, or add per-entry cases for the four parity-only lists. Scope proof: 248 fixture prompts matched entry by entry. Affected surfaces: `spec.md`, `acceptance-criteria.md` AC-038, the fixture and its suite. Case: a word added to both copies of a parity-only list breaks its alternation with every test green.
- **R3-P2-003** — Fix: repoint `REQ-006` and the Edge Cases at `command-attach-guards.vitest.ts`, which is where `CHK-022` already points. Scope proof: the named file was read whole and holds none of the cases. Affected surfaces: `spec.md`, `tasks.md` CHK-022, both test files. Case: a reader looking for the depth-word guarantee finds no depth word in the file the requirement names.
- **R5-P2-001** — Fix: run the continuity writer for the acceptance criteria, as the implementation summary already has. Scope proof: both frontmatter blocks read side by side. Affected surfaces: `acceptance-criteria.md`, the continuity writer, `implementation-summary.md`. Case: `/speckit:resume` reports `completion_pct: 0` and "Authored the acceptance criteria" for a packet at round seven.

## 4. Remediation Workstreams

**Gate work, first: WS-1.**

1. Run one more review pass over this packet — `/deep:review ... --extend=1` on the completed run, or a fresh lineage — with the sequencing that lets coverage stabilize: cover `maintainability` by the fourth iteration and use the fifth as a cross-reference pass over the other three. The gate that failed is `coverage-too-young`, which asks for one iteration after the last dimension is first covered (`convergence.cjs:1701`, `terminal-gates.cjs`).

**P2 documentation lane, second: WS-2.**

2. `R2-P2-001` — the only behavioural change in the set. One list in each copy, one fixture row, one guard case.
3. `R3-P2-003` — repoint two sentences in `spec.md`; no code change.
4. `R3-P2-002` — prefer the amendment: name the lists the clause covers, and leave the four parity-only lists to the parity test they already have. Add cases only where a word has no behavioural proof at all.
5. `R3-P2-001` — one cell in `acceptance-criteria.md`.
6. `R5-P2-001` — one continuity save.

**Advisory separation:** none of these five blocks a user; all five are record accuracy or a single question shape. They are listed in severity order only because the order is free.

## 5. Spec Seed

- Amend `REQ-031` to say which lists carry a per-entry fixture case, or widen the tests to the four remaining lists.
- Amend `REQ-006` and the Edge Cases' last sentence to name `command-attach-guards.vitest.ts`.
- Add the first-person interrogative forms to the offer gate's ask vocabulary, and cite the change from `REQ-016` so the question rule stays one sentence.
- Refresh the acceptance criteria's continuity block, and state in the packet's closure rules that a closure-document frontmatter refresh is part of a fix round's documentation lane.
- Record in the packet that a review run's coverage gate needs one iteration after the final dimension is first covered; a five-iteration, four-dimension run must therefore cover all four by iteration 4.

## 6. Plan Seed

1. Edit `COMMAND_ASK_NAMED_WORDS` (TypeScript) and `_COMMAND_ASK_LEAD_LIST` (Python) to add `how do`, `how can`, `how should`, `how would`; confirm the drift guard still reports twelve matching pairs.
2. Add fixture rows `ask-command-alias-question` and `ask-command-cost-question` with `asksForLoopRun: false` and no command, and one `command-attach-guards.vitest.ts` case each.
3. Repoint `spec.md:213` and `spec.md:321` at `command-attach-guards.vitest.ts`, and note the case lines (473, 531-543, 618).
4. Amend `REQ-031`'s second sentence, and extend `AC-038`'s cell to name the four lists it leaves to parity.
5. Restate `AC-029`'s quoted count against `.skilled/changelog/skilled/v4.2.0.0.md:759`.
6. Run the continuity writer for `acceptance-criteria.md`.
7. Rerun one review pass with the coverage sequencing above; confirm the terminal gates read evidence, scope and coverage pass, then flip `AC-040` and `T084`.

## 7. Traceability Status

**Core protocols**

| Protocol | Status | Evidence | Drift |
|---|---|---|---|
| `spec_code` | pass | all 34 REQ rows resolved; `spec.md:213`, `command-attach.ts:1291`, `hub-router.json:34`, `command-prompts.jsonl:1` | three rows need the documentation corrections in R3-P2-001 to R3-P2-003; REQ-033 is met by this run itself |
| `checklist_evidence` | pass | all 87 task rows and 43 acceptance rows checked; fifteen ticked rows rerun; `tasks.md:244`, `acceptance-criteria.md:86`, `command-prompts.jsonl:94` | the two open rows (`T084`, `CHK-020`) wait on this run; `AC-029`'s cell is stale |

**Overlay protocols** — `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`: not applicable to a spec-folder target whose claims run through the advisor runtime and the deep-loop command surfaces. None was claimed as covered.

**AC_COVERAGE (advisory):** 39 of 43 rows `Met`, 2 `Waived` (ADR-002, ADR-003), 1 `Superseded` (ADR-001), 1 `Unmet` (`AC-040`, this rerun's own row). All four non-`Met` rows name a record or a reason, so the signal is an advisory shortfall of one row that this run cannot close alone.

## 8. Deferred Items

- **Packet 013's degraded-path alignment.** `implementation-summary.md` records that the Python fallback serves the hub without a command for an untyped loop ask (limitation 8). Out of this packet's scope, and already documented.
- **The ten lists that carry parity tests but no per-entry case** beyond the four named in `R3-P2-002`. Deferred to the amendment rather than enumerated as findings.
- **The `how do`/`how can` gap's mirror in other hubs.** The ask vocabulary is shared, so other hubs inherit the same shape; this packet owns only the deep-loop rows, so the wider question is left to a future review of the advisor's command-naming guard.
- **No frontier follow-ups.** This run used default depth, so `deep-review-findings-registry.json` carries no `frontier` object.

## Dimension Expansion Map

- **Swept directions:** none recorded as saturated; five iterations covered four dimensions, and each iteration's approach was productive.
- **Completed pivots:** 0. **Failed pivots:** 0. **Audited overrides:** 0.
- **Selected directions:** correctness (gate behaviour), security (prompt as untrusted input), traceability twice (`spec_code`, then `checklist_evidence`), maintainability (two-language maintenance and closure metadata).
- **Remaining frontier:** none — default depth, no seed, no proposal.

## 9. Search Ledger

- **`searchCoverage`:** required bug classes `logic_error`, `state_transition`, `boundary_condition` (correctness), `trust_boundary`, `injection`, `secret_exposure`, `unbounded_input` (security), `spec_code_drift`, `stale_evidence`, `under_specified_test`, `decision_supersession` (traceability), `comment_hygiene`, `drift_guard_coverage`, `metadata_drift` (maintainability). All covered; the three clean classes are ruled out with the action that ruled them out.
- **`candidateCoverage`:** every class carries at least one ledger row with a cited action; `graphCoverageMode` is `graph` (the lineage seeded 50 nodes and 55 edges before iteration 1).
- **`searchDebt`:** empty — no class was deferred or blocked.
- **`ruledOutCandidates`:** eight directions, each with the probe or read that settled it (see iteration sections "Ruled Out").
- **`cleanSearchProof`:** the probe recompute over 40 prompts, the Python gate over 14, the 69-row probe pair comparison, the 116-citation resolution, fifteen command reruns, and the digest check over fifteen compiled sources.
- **`hasSearchDebt`: false.**

## 10. Audit Appendix

**Convergence summary.** Five iterations, stop reason `maxIterationsReached`, convergence ratio telemetry: 0.0, 1.0, 0.75, 0.0, 0.2. The cap was the stop, not convergence.

**Coverage summary.** `correctness`, `security`, `traceability`, `maintainability` — all four covered; coverage ratio 1.0. The coverage gate still failed on age, because the fourth dimension was first covered in the last iteration.

**Terminal gates.** evidence `pass` (`all-findings-cited`), scope `pass` (`all-findings-in-scope`), coverage `fail` (`coverage-too-young`). Failed required gate ids: `["coverage"]`.

**Ruled-out claims.** A refusal that still offers the command; a stuck complaint that refuses a run carrying the doctor row; a quadratic lead scan; a longer second typed command hiding the first; a prompt starting a deep run rather than being offered one; a path or quoted mention becoming a request; a secret in the changed files; a 90,000-character prefix defeating the window; a REQ row with no implementation; a stale compiled contract; a keep or negative regression; a missing near-miss or holdout row; a ticked task whose verification no longer holds; a waiver with no backing ADR; a Verification Summary miscount; a spec id in a code comment; a drift guard comparing against an empty list; a divergent closure story.

**Sources reviewed.** The 46 scope files, the 69-row probe pair, the hook transcript, the corpus, fifteen compiled digests, and the eight changed runtime files' comments.

**Cross-reference appendix — core protocols.** `spec_code` pass, `checklist_evidence` pass, with the drift each carries stated in section 7.

**Cross-reference appendix — overlay protocols.** All four `notApplicable`, none claimed as covered.
