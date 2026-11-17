# Review Report: Command Surfacing Build, Pass Thirteen - data area

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Pass: the thirteenth review pass, `data` area of `review/review-scope-13.txt`. It read `b8ebee37d75..932aff4e437` for `.skilled/skills/system-skill-advisor/graph-metadata.json`, `.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/brief-command-policy-word.md` and `040-final-alignment-loop/decision-record.md`, then read each whole file at `932aff4e437`.
- Lineage: `data-13`, session `fanout-data-13-1794865302020-qunumz`, three iterations, stop reason `converged` at threshold 0.10, `blockedBy` empty. Brief `review/review-brief-13.txt`.

## 1. Executive Summary

- **Overall verdict: CONDITIONAL.** P0 0, P1 1, P2 2 -- the counts the verdict used.
- **hasAdvisories: false.** Two P2 advisories are open, but the verdict is CONDITIONAL on the active P1, so the advisory flag is not set.
- **Self-check outcomes.** F001 (P1) was confirmed by the full Hunter/Skeptic/Referee pass in iteration 1: every ordinary-sense prompt returned no skill under the stripped projection and the advisor at 0.82 with `passes_threshold: true` under the committed one. F002 (P2) was confirmed by the same A/B pair on the noun-phrase prompt. F003 (P2) was confirmed by running both shipped scorers on the same prompts. No finding was downgraded or called a false positive.
- **Review scope summary.** Three files. `graph-metadata.json` gained seven `intent_signals` phrases; the CL-009 playbook changed one prompt in three places and bumped its feature version `1.0.1.0 -> 1.0.2.0`; `decision-record.md` is new and holds ADR-001, which waives AC-004 for probe P05. The graph was recompiled: `skill-graph.json` carries the seven strings.
- **Operator review focus:** Review pass thirteen. First read specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-13.txt and follow it: it names your area by lineage label, the scope file, the graph and stop steps each iteration runs, and the holdout rule.

## 2. Planning Trigger

`/speckit:plan` is required: the verdict is CONDITIONAL on one active P1.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": ["F001", "F002", "F003"],
  "remediationWorkstreams": [
    {
      "id": "WS-1",
      "findingIds": ["F001"],
      "severity": "P1",
      "title": "Stop indexing common intent-signal words as advisor tokens",
      "scope": "graph-metadata intent_signals scoring surface: phrase-only author evidence, or a token stop set for the five generic signals; ordinary-sense fixtures in the specificity test"
    },
    {
      "id": "WS-2",
      "findingIds": ["F002"],
      "severity": "P2",
      "title": "Require a phrase boundary after a declared signal",
      "scope": "explicit author lane phrase matching for clean arena, plus the noun-phrase fixture"
    },
    {
      "id": "WS-3",
      "findingIds": ["F003"],
      "severity": "P2",
      "title": "Pin ordinary-sense prompts across both scorers",
      "scope": "declared-phrase-specificity cross-scorer cases and the Python fallback phrase reader"
    }
  ],
  "specSeed": [
    "State that an intent signal is author evidence for a phrase, and that its individual common words must not become routing tokens on their own.",
    "State that a declared signal matches a request phrase, not a longer noun phrase that happens to contain it.",
    "State that both shipped scorers must agree on the ordinary sense of every declared signal the specificity test pins."
  ],
  "planSeed": [
    "Add a phrase-only path or a token stop set for the five generic signals, and add the four ordinary-sense prompts as fixtures.",
    "Require a non-word boundary after a declared signal, or record the ordinary noun-phrase sense as a negative fixture.",
    "Extend the cross-scorer case list with the ordinary-sense prompts and align the Python phrase reader if it disagrees."
  ],
  "findingClasses": ["algorithmic", "algorithmic", "test-coverage"],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-skill-advisor/graph-metadata.json",
    ".skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts",
    ".skilled/skills/system-skill-advisor/runtime/tests/scorer/declared-phrase-specificity.vitest.ts"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Severity | Dimension | Location | Finding | Fix recommendation | Finding class | Scope proof | Affected surface hints |
|----|----------|-----------|----------|---------|--------------------|---------------|-------------|------------------------|
| F001 | P1 | correctness | `.skilled/skills/system-skill-advisor/graph-metadata.json:101` | New signals are indexed as common words, so ordinary prompts top the advisor | Score joined signals as phrases only, or exclude their single tokens from the lexical and graph lanes; add ordinary-sense fixtures | algorithmic | Four ordinary prompts return `system-skill-advisor` 0.82 `passes_threshold: true` with the committed projection and no skill with the seven signals removed | graph metadata, compiled graph, lexical lane, specificity test |
| F002 | P2 | correctness | `.skilled/skills/system-skill-advisor/graph-metadata.json:106` | `clean arena` fires inside a longer noun phrase and ranks the advisor above a design request | Require a phrase boundary after a declared signal, or add the noun-phrase sense as a negative fixture | algorithmic | `clean arena seating chart for the stadium` puts the advisor first at 0.82 and `sk-design` second; stripped projection returned only `sk-design` | graph metadata, explicit lane, specificity test |
| F003 | P2 | maintainability | `.skilled/skills/system-skill-advisor/runtime/tests/scorer/declared-phrase-specificity.vitest.ts:169` | The declared-phrase contract holds in one scorer and not the other | Add ordinary-sense prompts as cross-scorer fixtures once the scoring fix lands | test-coverage | The native scorer returns the advisor for `the arena is clean now` and the Python fallback returns no skill; the two pinned phrases do not diverge | specificity test, `skill_advisor.py`, graph metadata |

Impact notes:

- F001 changes the top recommendation, not just a tail entry: `fix the routing arm in the nginx config` puts the advisor ahead of `sk-code`, and `clean arena seating chart for the stadium` puts it ahead of `sk-design`. Every case is advisory only; no command is attached and no mutating command is offered.
- F002 and F003 are the same signal set seen from two other angles, but each has a separate fix point: phrase boundary, and cross-scorer fixtures.

## 4. Remediation Workstreams

1. **WS-1 (P1)** -- Change how the five generic signals are scored. Keep `routing arm`, `clean arena`, `advisor briefs`, `arena`-family wording as phrase evidence, or drop their single tokens from the lexical and graph lanes. Accept the four ordinary-sense prompts as the regression set.
2. **WS-2 (P2)** -- Tighten the explicit lane's phrase boundary or record the `clean arena seating ...` sense as a negative fixture.
3. **WS-3 (P2)** -- Add the ordinary-sense prompts to the cross-scorer case list so the Python fallback and the native scorer cannot drift apart on this class.

## 5. Spec Seed

- A declared intent signal is a phrase contract, not a bag of words.
- A common collocation is specific only when its context is; the advisor's precision rests on that distinction.
- Both shipped scorers read the same declared signal list and must agree on its ordinary sense.

## 6. Plan Seed

- Add the phrase-only/token-stop behavior to the signal scoring path and extend `declared-phrase-specificity.vitest.ts` with the four prompts.
- Add the noun-phrase negative fixture and the boundary rule.
- Add the cross-scorer fixture and align the Python phrase reader where it disagrees.

## 7. Traceability Status

Core protocols:

- `spec_code`: pass. The seven signals match T006's description (`040/tasks.md:49`) and the compiled `skill-graph.json` carries them; ADR-001 (`decision-record.md:37`), AC-004 (`acceptance-criteria.md:59`) and `probes.json` agree on P05 and P07-P09.
- `checklist_evidence`: pass. `probes.json` P05 is `command-doctor-helper` at 0.8 and P07/P08/P09 top the advisor; the final-tree rerun reproduces P05 at 0.8.

Overlay protocols:

- `skill_agent`: pass. The authored metadata and the compiled graph carry identical strings; no agent file is in this area.
- `agent_cross_runtime`: notApplicable. No runtime mirror or agent definition is touched.
- `feature_catalog_code`: pass. `scorer-fusion/five-lane-fusion.md:27` documents the lexical lane as token overlap, so the observed token behavior matches the documented design; the defect is the signal list's word choice, not the lane.
- `playbook_capability`: pass. `check for skilled updates` tops `command-doctor-update` at 0.8962 and renders `system-skilled-doctor → /doctor:update (ask)` in a parent and `(parent-named only)` in a child, matching `brief-command-policy-word.md:148` and `:160-161`.

`AC_COVERAGE`: **exempt**. The target spec folder has no `acceptance-criteria.md` and no `implementation-summary.md` at its own level; the phase children own their AC coverage.

## 8. Deferred Items

- The phrase `update skilled to the latest version` is still a declared `/doctor:update` trigger (`_routes.yaml:804`) but scores `sk-git` and never returns its command. The playbook avoids it now. The route file is outside this area, so this is deferred to a routing-area pass, not reported against the playbook.
- The Python fallback has no command-bridge layer, so P05 there returns `system-skill-advisor` rather than `command-doctor-helper`. That is a scorer-scope difference, not an ADR-001 contradiction.
- The `derived` block was not regenerated with the seven signals; a fresh extractor run does not add them to `trigger_phrases` or `keywords`, so this is not a stale routing surface.
- Holdout hygiene is clean for this area: the bridge generator reads route YAML and scorer sources, and `measure-brief-cost.mjs:124` refuses holdout rows.

## Dimension Expansion Map

- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Saturated directions: none. Pivot lineage: none.
- Selected review directions: correctness and traceability (iteration 1), security and maintainability (iteration 2), all four as final verification (iteration 3).
- Remaining frontier: none. This section records breadth only and does not change the verdict.

## 9. Search Ledger

`*No search-depth state captured (legacy v1 record)*`

The probes that stand in for a search ledger in this pass:

- Native scorer A/B: committed projection vs the seven signals removed, over eight ordinary prompts; four flip to the advisor, two change rank, two are unchanged.
- Signal list: 39 entries, 0 duplicates, no control, shell or JSON metacharacter.
- Playbook: `check for skilled updates` -> `command-doctor-update` 0.8962; old prompt -> `sk-git`; rendered labels match parent and child expectations.
- ADR: P05 tops `command-doctor-helper` at 0.8 before and after the signals.
- Cross-scorer: native vs Python over the same prompts; two divergences, both on the new phrases.
- Holdout: generator input list and the refusal path read; no corpus row reaches a generation or report path.
- State: three iteration records, three deltas whose first line equals its record, one registry with three open findings, four dimensions covered.

## 10. Audit Appendix

- **Convergence.** Iteration 3 returned `STOP`, `converged`, score 1.0, `blockedBy` `[]`. Ratios were 1.0, 0.1429, 0.0.
- **Coverage.** 4 of 4 dimensions; core protocols `spec_code` and `checklist_evidence` each recorded; overlay protocols recorded as pass or notApplicable.
- **Ruled-out claims.** A stale derived block; a holdout leak through bridge generation; secret or environment exposure in the playbook; JSON or shell injection through a signal; duplicate-signal amplification; the waived P05 returning to the advisor; a mid-pass change between iteration 1 and the final tree.
- **Sources reviewed.** `graph-metadata.json` (whole file and the signal block), `brief-command-policy-word.md` (whole file and the changed ranges), `decision-record.md`, `040/acceptance-criteria.md:59`, `040/tasks.md:37-121`, `040/scratch/probes.json`, `skill-graph.json`, `command-bridges.generated.json`, `.skilled/commands/doctor/_routes.yaml:786-809`, `lanes/explicit.ts`, `scorer/projection.ts:295-300`, `lib/render.ts:200-290`, `lib/command-attach.ts:64-200`, `declared-phrase-specificity.vitest.ts`, `skill_advisor.py:4200-4215`, `derive-command-bridges.cjs`, `measure-brief-cost.mjs:20-130`, `manual-testing-playbook.md:196`, `review-brief-13.txt`, `review-scope-13.txt`, and the lineage state, registry, deltas and strategy.
- **Core Protocol Appendix.** `spec_code` pass; `checklist_evidence` pass.
- **Overlay Protocol Appendix.** `skill_agent` pass; `agent_cross_runtime` notApplicable; `feature_catalog_code` pass; `playbook_capability` pass.
- **Ledger note.** `synthesis_complete` was committed before the iteration-3 `graph_convergence` row because the closeout ran before that event was appended. The content of both rows is correct and the latest convergence row is the `STOP`/`converged` decision; only the commit order differs from the canonical sequence.

Review verdict: CONDITIONAL
