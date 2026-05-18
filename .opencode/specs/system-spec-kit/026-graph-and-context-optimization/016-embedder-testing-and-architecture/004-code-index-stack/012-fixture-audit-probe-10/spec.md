---
title: "Spec: 016/004/012 Fixture Audit (Probe 10 first; full 18 second)"
description: "Audit the 18-pair code-retrieval fixture for expected-path correctness. Probe 10 (`context save command that reads structured JSON` expected as the `.js` dist artifact) is the immediate trigger — the `.ts` source variant is arguably more correct. Audit pass: read every probe's expected_source_path against the actual codebase, decide whether the expected path is the BEST answer to the query, recommend updates."
trigger_phrases:
  - "fixture audit probe 10"
  - "expected_source_path correctness"
  - "code-retrieval fixture review"
  - "dist vs source target"
  - "016/004/012 fixture audit"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/012-fixture-audit-probe-10"
    last_updated_at: "2026-05-18T19:23:09Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded research-only packet"
    next_safe_action: "Execute Phase 1 per plan.md"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004012"
      session_id: "016-004-012"
      parent_session_id: null
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 016/004/012 Fixture Audit (probe 10 first; full 18 second)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Planned (2026-05-18 evening) |
| Type | Research-only (no code changes); may produce a fixture update if any expected paths are wrong |
| Owner | Main agent |
| Parent | `../spec.md` (004-code-index-stack) |
| Triggered by | `../../007-ollama-and-bge-promotion-arc/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md` §7.4 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 18-pair code-retrieval fixture at `../002-baseline-fixture/evidence/code-retrieval-fixture.json` was authored without a peer review of "is the `expected_source_path` for each query actually the BEST answer?". The May 18 evening instrumented bench surfaced a specific case worth scrutinizing:

**Probe 10:**
- Query: `"context save command that reads structured JSON and refreshes graph metadata"`
- Expected: `.opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js`
- The reranker preferred `scripts/memory/generate-context.ts` (the source variant). That's arguably MORE correct semantically — the `.js` is a compiled dist artifact; the `.ts` source is where the actual logic lives.

If the fixture has wrong expected paths, bench numbers measure the fixture's bias as much as the embedder's competence. An audit pass clarifies which probes are testing retrieval quality vs which are testing "did you guess the same arbitrary artifact the fixture author chose".

5 probes were missed by ALL 4 candidates in the May 18 bench (probes 1, 6, 11, 12, 15). Those are the universal-ceiling probes — strong candidates for fixture-vs-corpus mismatch.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope:
- **Probe 10 deep-dive first** — confirm whether `.ts` source or `.js` dist is the right expected_source_path. Decide via: (a) what answers the query best in a human reading, (b) what a real operator would want surfaced.
- **Full 18-probe audit pass**:
  - Re-read each query
  - Resolve the current `expected_source_path` against the live codebase
  - Search the codebase for "what file would I actually expect to be top-1 for this query?"
  - Compare; flag mismatches
- **5 universal-ceiling probes get priority** — probes 1, 6, 11, 12, 15 were missed by ALL 4 candidates in the May 18 bench. Likely fixture issues, not embedder issues.
- **Recommend fixture update** if any probes have a clearly-better expected path.

Out of scope:
- Adding new probes (fixture stays at 18; an "expanded fixture" packet is separate work).
- Changing the query strings (only `expected_source_path` review).
- Re-benching with the updated fixture (separate concern; this packet only delivers the fixture diff if changes are warranted).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | `research.md` lists all 18 probes with: original `expected_source_path`, audit verdict (KEEP / CHANGE / AMBIGUOUS), rationale. |
| R2 | For each CHANGE verdict, the proposed new path is cited with a brief justification (1-2 sentences). |
| R3 | Probe 10's verdict gets dedicated treatment given it triggered this packet. |
| R4 | If ≥1 probe changes: a fixture diff is included in evidence (NEW expected_source_path values for the changed probes). |
| R5 | Strict-validate PASSED on this packet. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## SUCCESS CRITERIA

- All requirements satisfied per §4.
- Research evidence committed under `evidence/`.
- Strict-validate PASSED on this packet.
- Recommendation (SWAP/HOLD/NEEDS-CUSTOM for 011, or CHANGE/KEEP/AMBIGUOUS for 012) documented with rationale.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:approach -->
## 5. APPROACH

1. **Probe 10 first** — verify the existence of both `generate-context.ts` and `generate-context.js`. Read what's actually in each. Decide based on what answers "command that reads structured JSON and refreshes graph metadata" most directly.
2. **Universal-ceiling probes (1, 6, 11, 12, 15)** — read each query, find what the corpus actually has matching the intent. Did the fixture author cite a file that doesn't exist? An ambiguously-named file? A peripheral file?
3. **Remaining 12 probes** — quick check. KEEP unless there's a clearly-better path.
4. **Fixture diff** — if any CHANGEs land, produce the updated fixture JSON as evidence (don't commit the fixture itself — leave that to a follow-on after the new bench is re-run).
<!-- /ANCHOR:approach -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Risks:
- **Confirmation bias.** Auditing the fixture using post-bench failure information risks "moving the goalposts" — making the fixture easier so a favored embedder wins. Mitigation: do the audit blind to candidate-specific results; verdicts must stand on the query-vs-corpus match alone.
- **Stale codebase.** Files may have been added/removed since fixture authoring; expected paths could be valid-but-now-missing. Document any "expected path no longer exists" findings.
- **Multiple valid answers.** Some queries may have several legitimate top-1 candidates. AMBIGUOUS verdict is OK — flag for follow-on; don't force a single answer.

Dependencies:
- `../002-baseline-fixture/evidence/code-retrieval-fixture.json` (the 18-pair fixture file)
- `../../007-ollama-and-bge-promotion-arc/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md` (failure-mode pattern motivating the audit)
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- For probe 10 specifically: does the fixture intend to test "find the runtime artifact actually executed" (favors .js dist) or "find the implementation logic" (favors .ts source)? Different design intents, both legitimate.
- For the 5 universal-ceiling probes (1, 6, 11, 12, 15): is there a SECOND valid answer that any candidate hit? Worth checking before declaring "no embedder works for these".
- Should AMBIGUOUS verdicts be allowed, or should the fixture force a single answer for crisp hit/miss accounting?
<!-- /ANCHOR:questions -->

<!-- ANCHOR:cross-links -->
## 8. CROSS-LINKS

- **Trigger:** `../../007-ollama-and-bge-promotion-arc/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md` §7.4
- **Fixture file:** `../002-baseline-fixture/evidence/code-retrieval-fixture.json` (18 pairs)
- **Sibling investigation:** `../011-rerank-model-fit-investigation/` — orthogonal angle (does the cross-encoder need to change vs does the fixture need to change)
- **Bench packet to re-run after fixture update:** `../../007-ollama-and-bge-promotion-arc/003-bge-code-v1-confirmation-and-promote/`
<!-- /ANCHOR:cross-links -->
