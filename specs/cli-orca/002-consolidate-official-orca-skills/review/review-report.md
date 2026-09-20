# Deep Review Report: cli-orca

## 1. Executive Summary

Verdict: **CONDITIONAL**

hasAdvisories: `false`

Scope: `/deep:review` (:auto) over `.skilled/skills/cli-orca` (target type: skill) with
`--spec-folder specs/cli-orca/002-consolidate-official-orca-skills`,
`--executor=cli-pi --model=deepseek-v4.1-flash`, `--max-iterations=5`, `--stop-policy=max-iterations`.
Audit inputs reached the skill package, the mcp-tooling hub boundary, the skill-advisor identity and routing
surfaces, the sk-doc authoring contracts, and this packet's own completion records.

Iterations completed: 5 of 5 allowed. Stop reason: `maxIterationsReached` (terminal ceiling under the
`max-iterations` stop policy; convergence signals were telemetry only, per the loop contract).

Finding counts: P0=0, P1=1, P2=6 (active; 0 resolved).

Dimension coverage: correctness, security, traceability, maintainability (4 of 4). Correctness carries the only P1;
the remaining six are P2 advisories across security, traceability and maintainability.

Convergence: latest new-findings ratio 0.00, reducer `convergenceScore` 1.00, trend `0.40 -> 0.14 -> 0.00`,
`searchDebt` none. `graphConvergenceScore` is 0.00 because the coverage graph ran in `graphless_fallback` mode after
the seed (see Deferred Items) — the markdown, JSONL, registry and reducer artifacts are the authoritative evidence
for this run.

Resource Map Coverage Gate: armed (`resource_map_present: true` at init, detected at the packet root).

## 2. Planning Trigger

`/speckit:plan` is required before this target can be treated as PASS. The review found no P0 blockers, but one active
P1 contract finding (`P1-001`) plus six P2 advisories remain, and the skill's routing contract currently contradicts
the qualification rule stated in the same document.

Planning Packet:

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": ["P1-001", "P2-001", "P2-002", "P2-003", "P2-004", "P2-005", "P2-006"],
  "remediationWorkstreams": [
    "Add an enforcement point for Orca qualification in the Smart Router contract (P1-001)",
    "Align the ORCA_SKILLS signal set with the official-skill triggers the document claims (P2-001)",
    "Close resource-map coverage gaps and reconcile the packet's document count (P2-002, P2-004, P2-005)",
    "Annotate the destructive representative calls with their gate and authorization requirements (P2-003)",
    "Add a cross-document invariant check for the duplicated routing/ownership matrix (P2-006)"
  ],
  "specSeed": [
    "Add an acceptance criterion requiring the Smart Router contract to enforce the Orca-qualification rule it documents, with a negative fixture for generic terminal/browser vocabulary",
    "Add an acceptance criterion for resource-map completeness over the full review scope (every in-scope artifact family has a row or glob row)",
    "Add an acceptance criterion requiring destructive CLI examples to carry the archive-hook gate and the authorization annotation",
    "Require one canonical document count across tasks.md, acceptance-criteria.md and implementation-summary.md"
  ],
  "planSeed": [
    "Decide the P1-001 shape: prune generic keywords from INTENT_SIGNALS, and/or require a qualifier inside orca_qualified_phrases(), and/or mark the pseudocode explicitly non-normative in SKILL.md",
    "Extend the ORCA_SKILLS signal set so the official names listed as triggers are actually represented, or correct the trigger list",
    "Add resource-map rows for the benchmark evidence artifacts and the twelve feature-catalog/playbook sub-documents, then re-derive the map's Summary counts",
    "Refresh tasks.md:169 to the observed checked=32 and keep the count consistent with AC-009 and implementation-summary.md",
    "Add the gate and authorization annotations to orca-cli-reference.md:94 and :108, or make the example block's caveat explicit for destructive verbs",
    "Add a machine cross-document check over the six routing/ownership restatement sites (or declare one canonical copy and mark the rest as summaries)"
  ],
  "findingClasses": ["routing-contract", "resource-map", "unsafe_mutation_guidance", "traceability/evidence-consistency", "traceability/resource-map-coverage", "duplication_without_gate"],
  "affectedSurfacesSeed": [
    ".skilled/skills/cli-orca/SKILL.md",
    ".skilled/skills/cli-orca/README.md",
    ".skilled/skills/cli-orca/references/orca-cli-reference.md",
    "specs/cli-orca/002-consolidate-official-orca-skills/resource-map.md",
    "specs/cli-orca/002-consolidate-official-orca-skills/tasks.md"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Sev | Dimension | Raised in | Class | Evidence | Disposition |
|----|-----|-----------|-----------|-------|----------|-------------|
| P1-001 | P1 | correctness | iteration 1 (re-verified 5) | routing-contract | `.skilled/skills/cli-orca/SKILL.md:101`; contradicted by `:58`, `:268`, `:150-153` | active |
| P2-001 | P2 | correctness | iteration 1 | routing-contract | `.skilled/skills/cli-orca/SKILL.md:106` | active |
| P2-002 | P2 | correctness | iteration 1 | resource-map | `specs/cli-orca/002-consolidate-official-orca-skills/resource-map.md:65` | active |
| P2-003 | P2 | security | iteration 2 | unsafe_mutation_guidance | `.skilled/skills/cli-orca/references/orca-cli-reference.md:94` and `:108` | active |
| P2-004 | P2 | traceability | iteration 3 | traceability/evidence-consistency | `specs/cli-orca/002-consolidate-official-orca-skills/tasks.md:169` | active |
| P2-005 | P2 | traceability | iteration 3 | traceability/resource-map-coverage | `specs/cli-orca/002-consolidate-official-orca-skills/resource-map.md` | active |
| P2-006 | P2 | maintainability | iteration 4 | duplication_without_gate | `.skilled/skills/cli-orca/README.md:24` | active |

No P0 findings were confirmed. `fixCompletenessRequired` is true: every field below must be resolved or explicitly
waived before this target can claim PASS.

**P1-001 — Smart Router pseudocode admits generic non-Orca vocabulary, contradicting the qualification rule and NEVER #7**

- Evidence: `SKILL.md:104` `BROWSER` keywords include the bare `embedded browser`; `SKILL.md:103` `TERMINAL` keywords
  include `read the terminal`, `send to the terminal`, `terminal receipt`; `SKILL.md:150-153` `orca_qualified_phrases()`
  is a plain substring filter whose docstring claims "Only Orca-qualified phrases count"; `SKILL.md:155-158` `route()`
  falls to `UNKNOWN_FALLBACK` only when nothing matched; contradicted by `SKILL.md:58` and NEVER #7 at `:268`.
- Impact: an agent following the document's only machine-shaped routing statement can select an Orca lane for a request
  that never mentions Orca ("please read the terminal and share skills" routes into the AUTOMATIONS lane). Live advisor
  routing is not currently affected because `graph-metadata.json` `intent_signals` stay Orca-qualified.
- Fix recommendation: require a qualification check inside the router (prune the generic keywords, or gate on an
  `orca`-prefixed match), or mark the block explicitly non-normative and restate the contract in prose only.
- findingClass: `routing-contract` | scopeProof: `UNKNOWN` (not present in reducer-owned state) | affectedSurfaceHints: `UNKNOWN`
- Source: `review/iterations/iteration-001.md`, re-verified in `review/iterations/iteration-005.md`. Confidence 0.85. Downgrade trigger: a revision that prunes the generic keywords or adds the qualifier gate.

**P2-001 — ORCA_SKILLS signal set omits official names listed as triggers**

- Evidence: `SKILL.md:106` versus the trigger list and README §3 routing signals (`linear-tickets`, bare `orchestration`).
- Impact: the claimed "official-skill awareness in Orca context" capability is under-implemented in the signal table, so
  Orca-placed skill names can miss the skill lane.
- Fix recommendation: add the missing names to `ORCA_SKILLS`, or correct the trigger list to the representable set.
- findingClass: `routing-contract` | scopeProof: `UNKNOWN` | affectedSurfaceHints: `UNKNOWN`
- Source: `review/iterations/iteration-001.md`.

**P2-002 — Resource map omits the in-scope benchmark evidence artifacts**

- Evidence: `resource-map.md:65` against the benchmark report and replay file inside the review scope.
- Impact: the Resource Map Coverage Gate cannot audit those artifacts; declared surfaces and the map disagree.
- Fix recommendation: add rows for the benchmark evidence artifacts and refresh the map's Summary counts.
- findingClass: `resource-map` | scopeProof: `UNKNOWN` | affectedSurfaceHints: `UNKNOWN`
- Source: `review/iterations/iteration-001.md`, re-confirmed in iteration 5.

**P2-003 — Destructive representative calls miss the gate and authorization annotations**

- Evidence: `references/orca-cli-reference.md:94` shows `orca worktree rm --force --json` without the gated
  `--run-hooks` form that `references/mutation-and-browser-boundaries.md:62-68` requires; `:108` shows a bulk
  `orca terminal close --all` without an authorization note. The correction lives only at `:197` and in the
  troubleshooting, feature-catalog and boundaries documents.
- Impact: the example block is the copy path for agents; copied verbatim it performs a destructive mutation outside the
  documented gate. Held at P2 (not P1) because the block's own caveat at `:82` and the scattered corrections disclose it.
- Fix recommendation: annotate both examples inline, or make the block-level caveat explicit for destructive verbs.
- findingClass: `unsafe_mutation_guidance` | scopeProof: `UNKNOWN` | affectedSurfaceHints: `UNKNOWN`
- Source: `review/iterations/iteration-002.md`. Confidence 0.75. Upgrade trigger: if a playbook scenario copies the unannotated form, promote to P1.

**P2-004 — Task ledger records 31 checked documents while AC-009 and the implementation summary record 32**

- Evidence: `tasks.md:169` (`checked=31 blocking=0`) versus `acceptance-criteria.md:49` and
  `implementation-summary.md:106` (both 32). A full re-run of `validate_document.py` over the 32 shipped documents is
  clean (`pass=32 fail=0`), so the 31-count row is stale.
- Impact: a closure-gate record disagrees with its own acceptance criterion; no behavior depends on the count.
- Fix recommendation: refresh `tasks.md:169` to `checked=32 blocking=0`, or state the narrower scope explicitly.
- findingClass: `traceability/evidence-consistency` | scopeProof: `UNKNOWN` | affectedSurfaceHints: `UNKNOWN`
- Source: `review/iterations/iteration-003.md`. Confidence 0.9. Downgrade trigger: a sweep-scope note that shows 31 was deliberate.

**P2-005 — Resource map carries no row for twelve in-scope feature-catalog and playbook sub-documents**

- Evidence: the map's feature-catalog and playbook rows cover the index documents but not their sub-documents.
- Impact: same gate blindness as P2-002; the resource map understates the audited corpus.
- Fix recommendation: add rows (or glob rows where every file took the same action) and refresh the Summary counts.
- findingClass: `traceability/resource-map-coverage` | scopeProof: `UNKNOWN` | affectedSurfaceHints: `UNKNOWN`
- Source: `review/iterations/iteration-003.md`, re-confirmed in iteration 5.

**P2-006 — Routing and ownership invariants restated across six documents with no machine cross-document check**

- Evidence: `rg -l 'mcp-aside-devtools'` over the skill returns exactly six markdown documents: `SKILL.md`,
  `README.md`, `references/mutation-and-browser-boundaries.md`, `feature-catalog/feature-catalog.md`,
  `feature-catalog/routing/orca-qualified-vocabulary.md`, `feature-catalog/safety/mutation-and-ownership-boundaries.md`
  (plus the signal table, the pseudocode `FOREIGN_OWNERS` block and the advisor trigger phrases). Every scoped validator
  is per-document or structural, so drift between copies is caught only by manual review.
- Impact: the risk has already materialized once (P2-001 is a divergence in one of those copies); no validator re-runs
  the comparison when a document changes.
- Fix recommendation: add a machine cross-document check over the restatement sites, or declare one canonical copy and
  mark the others as summaries.
- findingClass: `duplication_without_gate` | scopeProof: `UNKNOWN` | affectedSurfaceHints: `UNKNOWN`
- Source: `review/iterations/iteration-004.md`. Confidence 0.8.

Reducer-owned dimension aggregation note: the findings registry labels all seven findings `dimension: correctness`
(its per-finding field), which is why the dashboard's dimension-coverage table attributes `Open findings 7` to
correctness. The `Dimension` column above reflects the dimension of the iteration that raised the finding, taken from
the typed `iteration` and `focus` fields of the same state records.

## 4. Remediation Workstreams

No P0 workstreams (no P0 findings).

Workstream A — P1 (blocking PASS): enforce Orca qualification in the router contract. Resolve P1-001 by making the
machine-shaped routing statement agree with `SKILL.md:58` and NEVER #7, and by adding a negative fixture so the
generic terminal/browser class cannot regress.

Workstream B — P2 advisories (separated, non-blocking):

- B1 routing-contract alignment (P2-001): reconcile `ORCA_SKILLS` with the trigger list.
- B2 resource-map completeness (P2-002, P2-005) and its packet reconciliation (P2-004): add the missing rows, refresh
  the Summary, then fix the document count so the three packet records agree.
- B3 copyable-example safety (P2-003): annotate the destructive representative calls.
- B4 duplication gate (P2-006): add the cross-document check or declare a canonical copy.

Sequencing: A first (it changes the document B1 edits), then B2 (map and packet records) after the content settles,
then B3 and B4.

## 5. Spec Seed

- Add an acceptance criterion that the Smart Router contract enforces the same qualification rule the document states,
  proven by a negative fixture for a generic terminal/browser request.
- Add an acceptance criterion for resource-map completeness over the whole review scope: every in-scope artifact family
  has a row or a glob row, and the Summary counts re-derive from the tables.
- Add an acceptance criterion that destructive CLI examples carry the archive-hook gate and an authorization note.
- Add a single-source-of-truth invariant for the document count referenced by `tasks.md`, `acceptance-criteria.md` and
  `implementation-summary.md`.

## 6. Plan Seed

1. Choose the P1-001 shape (prune generic keywords, add the qualifier gate, or mark the pseudocode non-normative) and
   apply it in `SKILL.md`.
2. Add the missing official-skill names to `ORCA_SKILLS` or correct the trigger list; re-check the README §3 signal
   inventory against the signal table.
3. Update `resource-map.md` with the benchmark artifacts and the twelve feature-catalog/playbook sub-documents; re-derive
   the Summary counts.
4. Refresh `tasks.md:169` to the observed count and keep it consistent with AC-009 and the implementation summary.
5. Annotate `orca-cli-reference.md:94` and `:108` with the gate and authorization requirements.
6. Add or adopt a cross-document check for the six routing/ownership restatement sites.
7. Re-run the cli-orca clause gates plus the advisor and holdout replays after the edits, then re-enter the review loop
   for a fresh pass over the changed surfaces.

## 7. Traceability Status

Core Protocols:

| Protocol | Status | Evidence |
|----------|--------|----------|
| spec_code | partial | REQ-001/002/003/005/006 re-verified across iterations 1-5 (class-S root shape, hub nine modes, no live `mcp-orca-cli` references, 8/8 snapshots byte-identical, advisor probes rank `cli-orca` first and the OpenOrca holdout returns zero). REQ-014 verified by acceptance-command replay (`git grep` pattern exits 1 on both trees, redaction marker present, JSON still parses). REQ-004/REQ-006 rest partly on captured replay evidence; REQ-011/012/013 remain Unmet by design; REQ-013/T044 open. P1-001 is the one contract contradiction. |
| checklist_evidence | partial | Row-level replay in iteration 3 corroborated AC-005, AC-006, AC-009 and AC-014 by direct command; AC-001/002/004 rest on prior-iteration evidence with no contradictory signal; AC-007/AC-008 confirmed. P2-004 is the one conflicting row (`tasks.md:169` 31 vs 32). |

Overlay Protocols:

| Protocol | Status | Evidence |
|----------|--------|----------|
| skill_agent | partial | No agent definition under `.skilled/agents/` or `.pi/agents/` pins `cli-orca` (advisor-routed, not agent-pinned); advisor identity live at generation 65. The divergence is the claimed-vs-implemented signal coverage in the skill's own contract (P1-001, P2-001). |
| agent_cross_runtime | pass | `.pi/skills/cli-orca` is a real directory (not a symlink) and `diff -rq` against `.skilled/skills/cli-orca` returns rc=0 with zero differing entries. |
| feature_catalog_code | pass | Catalog index maps to its five per-feature documents; 161 relative links resolve with 0 broken across 32 documents; the browser ownership matrix is consistent across `SKILL.md:51-55`, `mutation-and-browser-boundaries.md:80-86` and `README.md:24,35`. Map rows for the sub-documents remain missing (P2-005). |
| playbook_capability | pass | Eight deterministic scenarios (ORCA-001…ORCA-008, four waves) exist on disk with their contracts; execution verdicts are deferred to the post-remediation wave. |

AC_COVERAGE: `exempt` — the review target is a skill package, not a spec folder, so the signal is not scored here.
Carried packet-level observation only: the strict validator reports the packet's AC evidence citations as an advisory
shortfall (0/9 ACs cite `file:line`) while `AC_CLOSURE` passes 9/9; this is recorded in the packet's own gate output and
is not one of this review's findings.

## Resource Map Coverage Gate

- `Entries touched`: 0 of the 53 rows in `specs/cli-orca/002-consolidate-official-orca-skills/resource-map.md` are cross-checkable against applied reports, because `applied/T-*.md` does not exist in this packet — the directive's stated input is unpopulated, so the gate degraded to a scope-list proxy (the config's 86-file review scope).
- `Entries not touched`: the proxy re-check found no additional uncovered artifact family beyond the two recorded gaps, so the two uncovered families are classified `gap`: the benchmark evidence artifacts (P2-002) and the twelve feature-catalog/playbook sub-documents (P2-005). Every other declared surface was exercised by at least one iteration.
- `Implementation paths absent from resource-map`: none beyond those two gaps. The scoped script surfaces (`.skilled/bin/compiled-route-*.cjs`, the validators, the advisor handler) all carry rows, and no in-scope path discovered during the run lacked a map entry.

## 8. Deferred Items

- Six P2 advisories remain active; they are advisory only and do not block the verdict, but `fixCompletenessRequired`
  keeps them open until resolved or waived.
- Playbook execution verdicts (ORCA-001…ORCA-008) are deferred to the AC-013 post-remediation wave; the scenarios exist
  and were read, not executed.
- REQ-011/REQ-012/REQ-013 remain Unmet by design (they depend on the remediation work), and `tasks.md` T039-T046 stay
  open accordingly.
- `graphConvergenceScore` 0.00 with `graphCoverageMode: graphless_fallback`: after the seed the loop ran without graph
  deltas, so graph convergence returned no decision. The markdown/JSONL/registry/reducer artifacts are the authoritative
  review evidence for this run.
- Loop-runtime defects observed while driving the documented workflow (recorded for the runtime's owner, outside this
  packet's scope): `append-mode-event.cjs` refuses the iteration record shape the iteration prompt prescribes
  (`Unrecognized event format`) and refuses the corrected envelope on projection
  (`PROJECTION_FAILED: Projection replace would drop keys from the existing config row`), while the same pack instructs
  the writer to stop on exit 2; the canonical state records were written with the dedicated
  `append-state-record.cjs` writer, which requires the state-log path as an argument.
- The gateway refuses this workflow's own synthesis telemetry: `step_convergence_report` emits
  `{type: "event", event: "synthesis_complete", ...}`, which returns
  `Unrecognized event format: expected object with stem or event_type`. Two alternative shapes were tried and also
  refused — a `stem` envelope (`fields is not iterable`) and an `event_type` envelope
  (`Event type does not match the frozen namespace grammar`) — so the `synthesis_complete` event could not be recorded
  through the sanctioned gateway. The closeout state itself is intact: config `status` advanced `initialized` →
  `complete`, the single-writer lock was released with its acquire nonce (`released: true`, lock file removed), and the
  state log holds 12 records (1 config, 5 iterations, 6 events).

## Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none
- Pivot lineage: none
- Remaining frontier: none recorded
- Selected review directions: correctness, security, traceability, maintainability (one pass each), plus a fifth
  correctness close-out pass directed at the single active P1 producer and the pending resource-map coverage question.

## 9. Search Ledger

Reducer-owned coverage: `candidateCoverage` covered=5, ruledOut=18, deferred=0, blocked=0. `searchDebt`: none.
`hasSearchDebt: false`. Graph coverage mode: `graphless_fallback`.

Per-iteration search depth (schema v2, `reviewDepthApplicability.enforcement: strict`, `scopeClass: standard`):

| Iteration | Dimension | Bug classes required | Covered | Ruled out | Deferred | Ledger rows |
|-----------|-----------|----------------------|---------|-----------|----------|-------------|
| 1 | correctness | 8 | 3 | 5 | 0 | 8 (SL-001…SL-008) |
| 2 | security | 6 | 1 | 5 | 0 | 6 (SL-201…SL-206) |
| 3 | traceability | 5 | 2 | 3 | 0 | 5 (SL-301…SL-305) |
| 4 | maintainability | 6 | 1 | 5 | 0 | 6 (SL-401…SL-406) |
| 5 | correctness | 4 | 1 | 3 | 0 | 4 (SL-501…SL-504) |

Every ledger row carries exactly one disposition link; no row was left undisposed and no iteration declared the
trivial-scope exemption.

Ruled-out candidates (full list with evidence paths is rendered in `review/deep-review-dashboard.md` §10): snapshot byte
integrity, live stale `mcp-orca-cli` references, dangling local `references/*.md` paths, malformed in-scope
JSON/config/scripts, cross-runtime drift (iterations 1 and 3), secret exposure, credential leakage, prompt injection,
command injection, archive-hook authority bypass and browser ownership drift, missing iteration evidence, stale generated
graph metadata, comment-hygiene violations, script copy-paste, version drift, snapshot maintenance gap, foreign-owner
defer-guard bypass, routed-resource guard evasion, bare-token routing, and a new coverage gap beyond the recorded ones.

Clean-search proof: the ruled-out entries above are the clean-search record — each names the sweep performed (hash
comparison, exact search, recursive diff, command replay, direct read) and the evidence path that closed it.

*No search-depth state captured (legacy v1 record)* applies to nothing here: all five iterations carry
`reviewDepthSchemaVersion: 2` with populated `targetSelection`, `searchCoverage` and `searchLedger` fields.

## 10. Audit Appendix

Iterations:

| Iteration | Dimension | Files reviewed | New findings | Ratio | Result |
|-----------|-----------|----------------|--------------|-------|--------|
| 1 | correctness | 22 | 1 P1, 2 P2 | 0.38 | conditional |
| 2 | security | 14 | 1 P2 | 0.17 | conditional |
| 3 | traceability | 16 | 2 P2 | 0.40 | conditional |
| 4 | maintainability | 14 | 1 P2 | 0.14 | conditional |
| 5 | correctness | 11 | 0 | 0.00 | conditional |

Convergence summary: trend `0.40 -> 0.14 -> 0.00`, reducer `convergenceScore` 1.00, `persistentSameSeverity` 1
(P1-001 held its severity from iteration 1 through iteration 5), `severityChanged` 0, `corruptionCount` 0,
`blockedStopHistory` empty. Stop reason `maxIterationsReached`.

Coverage summary: 4 of 4 configured dimensions covered; 86 files in the declared review scope; 77 file-reads across the
five iterations (with overlap); no `deferred` bug class in any iteration's `searchCoverage`.

Dispatch evidence: five INTENT + COMPLETION receipt pairs under `review/dispatch-receipts/` (`review-i1-g1` …
`review-i5-g1`), five rendered prompt packs under `review/prompts/`, five iteration narratives and five delta ledgers;
each state record carries the route proof (`mode: review`, `target_agent: deep-review`,
`agent_definition_loaded: true`, `resolved_route: Resolved route: mode=review target_agent=deep-review`).

Cross-Reference Appendix — Core Protocols: `spec_code` (partial, see §7), `checklist_evidence` (partial, P2-004).

Cross-Reference Appendix — Overlay Protocols: `skill_agent` (partial, P1-001/P2-001), `feature_catalog_code` (pass,
P2-005 noted), `playbook_capability` (pass, execution deferred), `agent_cross_runtime` (pass).

Sources reviewed: `.skilled/skills/cli-orca` (SKILL.md, README.md, graph-metadata.json, leaf-manifest.json,
leaf-aliases.json, leaf-manifest.config.json, `references/**` including `references/orca-skills/**`, `assets/**`,
`feature-catalog/**`, `manual-testing-playbook/**`, `changelog/**`, `benchmark/**`); the mcp-tooling hub boundary files;
skill-advisor identity, route-exclusion and handler surfaces; the sk-doc shared contracts and the scoped validators; the
packet docs and its derived metadata; and the vendored `context/orca-main` snapshot legs used for byte comparison.

Run closeout: stop reason `maxIterationsReached`; config `status: complete`; lock released (`released: true`, lock file
removed), so the packet is free for a re-run. The `synthesis_complete` ledger event could not be appended through the
gateway — see Deferred Items for the three refused payload shapes.

Final release-readiness state: `in-progress`. No P0 keeps it out of `release-blocking`, but the active P1 blocks PASS.
