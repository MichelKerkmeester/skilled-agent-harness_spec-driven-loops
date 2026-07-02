---
title: "Feature Specification: Edge-Confidence and Seeded-PPR Revisit Review Remediation"
description: "Remediate all 16 confirmed findings (10 P1, 6 P2, 0 P0) from the 20-iteration deep review of 002-code-graph/010-edge-confidence-and-ppr-revisit: a server-startup crash risk, four evidence/trace-consumer correctness gaps, a rollback-cleanliness gap, and ten doc/evidence-precision defects."
trigger_phrases:
  - "edge confidence review remediation"
  - "010 review findings fix"
  - "seeded ppr revisit remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-code-graph/011-edge-confidence-review-remediation"
    last_updated_at: "2026-07-01T17:09:48.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Scaffolded spec folder for review remediation"
    next_safe_action: "Fix validation errors, write implementation-summary.md, then dispatch T000-T018"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "../010-edge-confidence-and-ppr-revisit/review/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-01-011-edge-confidence-review-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Tracked as a new sibling phase (011) rather than reopening 010, since 010 is already synced/validated and this is a distinct remediation effort driven by an independent review, matching this packet's own precedent of using new sibling phases for supersession/correction passes."
      - "Q-001 (finding 6 rollback direction): resolved via decision-record.md ADR-001. Flag-off reads normalize/ignore persisted differentiated confidence, treating it as the legacy uniform tier; the product contract is not redefined."
---

> **Source of truth:** All 16 findings below are drawn directly from the 20 raw `iteration-NNN.md` files in `../010-edge-confidence-and-ppr-revisit/review/iterations/`, not from `review/deep-review-findings-registry.json`. The registry has a confirmed merge bug (silently drops a finding when two parallel iterations independently reuse the same ID number) discovered and documented during this review's own execution; the raw iteration files were treated as authoritative when reconciling the final list.

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: Edge-Confidence and Seeded-PPR Revisit Review Remediation

---

## EXECUTIVE SUMMARY

A 20-iteration deep review of `002-code-graph/010-edge-confidence-and-ppr-revisit` found 0 P0, 10 P1, and 6 P2 findings; this phase remediates all 16 under the same default-off-flag safety contract the reviewed packet already committed to.

**Key Decisions**: Flag-off reads normalize persisted differentiated confidence rather than trusting it (ADR-001); the reducer's registry is not treated as source of truth, the 20 raw iteration files are.

**Critical Dependencies**: None blocking -- Q-001 (REQ-006 direction) is resolved via ADR-001.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A 20-iteration deep review (GPT-5.5-fast high, via cli-opencode, `stop-policy=max-iterations` so it could not converge early) audited `002-code-graph/010-edge-confidence-and-ppr-revisit` for correctness, security, traceability, and maintainability. It found 0 P0, 10 P1, and 6 P2 findings. Both new flags (`SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION`, `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING`) stay default-off today, so nothing in production currently breaks -- but the moment either flag is exercised, six of the ten P1s produce real incorrect behavior (up to and including the code-graph MCP server failing to start), and four more P1s mean the packet's own completion evidence cannot be trusted at face value.

### Why This Matters

This packet's own safety story rests on "gate everything behind default-off flags, zero behavior change when off." Finding P1-6 (flag-off rollback is not clean) partially undermines that story: once a database has ever been touched by a flag-on scan, flag-off reads keep consuming the differentiated confidence left behind. Finding P1-1 (startup-blocking top-level import) is worse: it can prevent the entire code-graph MCP server from starting in any fresh checkout, independent of either flag's value, because the import runs before the flag is even checked.

### Goals

- Fix all 6 real-behavior P1s (findings 1-6) so the "zero behavior change with flags off" contract is actually true, including after a flag has been toggled on and back off.
- Fix all 4 doc/evidence P1s (findings 7-10) so the packet's own completion claims are honest and reproducible.
- Fix all 6 P2s for documentation/test-coverage completeness.
- Re-verify every fix independently (fresh command run or fresh read, not trusting the fix's own self-report), matching this packet's established verification discipline.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Code fixes (production, gated behind existing default-off flags, must remain byte-identical with both flags off):**
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts` (findings 1, 2, 4, 6)
- `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts` (findings 3, 5)
- `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts` (finding 5)
- `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts` (finding 5, evidence only)
- `.opencode/skills/system-code-graph/mcp_server/scripts/eval/score-seeded-ppr-retrieval.mjs` (P2-1)

**Test additions:**
- New regression coverage for findings 1 (missing-dist load path) and 4/5 (AMBIGUOUS trace/consumer classification) (P2-3)

**Doc fixes (this packet's own docs):**
- `../010-edge-confidence-and-ppr-revisit/{checklist.md,tasks.md,plan.md,implementation-summary.md,decision-record.md}` (findings 7, 8, 9, 10, P2-5)
- `.opencode/skills/system-code-graph/feature_catalog/**`, `.opencode/skills/system-code-graph/manual_testing_playbook/**` (P2-2)
- `.opencode/specs/system-speckit/028-memory-search-intelligence/{benchmark-status.md,feature-flags.md}` (P2-6)
- `../005-seeded-ppr-ranking/spec.md` path reference (P2-4)

### Out of Scope

- Re-opening the seeded-PPR CUT verdict itself. That verdict (reconfirmed and strengthened this cycle) is not in question; this phase fixes bugs found while auditing the code that produced it.
- Re-deriving true semantic call-target resolution (a parser rewrite) to fully close finding 3 -- the fix here is bounding the heuristic's confidence claim to what it can actually prove, not replacing the heuristic.
- Any change to sibling packets 000/001/003/004/005/006/007 (drift-remediation, memory, skill-advisor, deep-loop, spec-data-quality, review-remediation, dark-flag-graduation) beyond the two root-level doc files named above.
- Committing any change to git. All work lands as uncommitted diffs for operator review, per this session's standing rule.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 -- Real Behavior (fix before any flag is ever flipped on anywhere)

1. **REQ-001 (finding 1, startup crash):** Move the top-level `await import(...)` of the Memory MCP compiled traversal module in `code-graph-context.ts` behind a lazy, on-first-use resolver scoped to the seeded-PPR code path, so a missing `system-spec-kit/mcp_server/dist/lib/graph/bfs-traversal.js` artifact cannot prevent the code-graph MCP server from starting or from serving any non-PPR `code_graph_context` request.
2. **REQ-002 (finding 2, lost trace provenance):** Extend the seeded-PPR trace recording so `why_included.edgeChain` carries the full multi-hop path back to the anchor when `includeTrace` and the PPR flag are both enabled, not just the candidate's final incoming edge.
3. **REQ-003 (finding 3, name-only false confidence):** In `cross-file-edge-resolver.ts`, do not assign `0.9/EXTRACTED` confidence to a same-name candidate unless the candidate's file is verified to be (or is a legitimate proxy for) the import declaration's actual resolved module target; when that verification is not possible, downgrade to the existing `INFERRED` tier rather than `EXTRACTED`.
4. **REQ-004 (finding 4, AMBIGUOUS not flagged in trace):** Update the `why_included.ambiguous` derivation in `code-graph-context.ts` to also treat `evidenceClass === 'AMBIGUOUS'` as ambiguous, not only `'INFERRED'`.
5. **REQ-005 (finding 5, AMBIGUOUS not flagged in relationship/scan consumers):** Update the `code_graph_query` relationship-output and scan-enrichment classification logic in `handlers/query.ts` to also treat `evidenceClass === 'AMBIGUOUS'` as weak evidence, independent of `detectorProvenance`; additionally guarantee `detectorProvenance` is always set whenever `cross-file-edge-resolver.ts` writes an `AMBIGUOUS` classification, closing the null-provenance gap named in the finding.
6. **REQ-006 (finding 6, rollback not clean):** Decide and implement a resolution for flag-off reads consuming stale differentiated confidence (see decision-record.md ADR-001 for the two candidate resolutions and the chosen one). At minimum, document the actual contract precisely if a normalization fix is deferred.

### P1 -- Evidence & Completion Honesty (fix before claiming 010 complete)

7. **REQ-007 (finding 7):** Check the actually-completed boxes in `tasks.md`/`plan.md` (sync, doc updates, `validate.sh --strict`, overall Completion Criteria) to match `checklist.md`'s claim, since the underlying work is genuinely done.
8. **REQ-008 (finding 8):** Reword every acceptance/checklist use of "green"/"passing" for the flag-off suite to a baseline-relative formulation (e.g. "no new failures against the known failing baseline of N files"), preserving the cited failure counts.
9. **REQ-009 (finding 9):** Either (a) update the docs to cite the exact scoped command and directory that reproduces the claimed 6 failed/9 failed (later 5/8) baseline, or (b) if that scoped baseline is no longer the intended verification surface, replace it with the real, currently-reproducible full-suite baseline count and cite the exact command.
10. **REQ-010 (finding 10):** Either preserve a durable raw artifact containing the four-tier confidence distribution (892/2267/16198/2838 edges) from a real reindex, or qualify the existing prose to state plainly that this specific count was observed once in a since-removed implementation worktree and is not independently reproducible from checked-in evidence.

### P2 -- Documentation, Tests, Cleanup

11. **REQ-011 (P2-1):** Wrap `score-seeded-ppr-retrieval.mjs`'s temp-file/work-directory cleanup in `try/finally` so a mid-run failure cannot leave `ppr-impact-child.mjs` or a `vitest-tmp/ppr-eval-*` directory behind.
12. **REQ-012 (P2-2):** Add the new gated capabilities (edge-confidence differentiation, seeded-PPR revisit) to the code-graph feature catalog and add at least one manual-testing-playbook scenario exercising `code_graph_context` with both flags enabled.
13. **REQ-013 (P2-3):** Add regression tests for finding 1 (module import behaves safely when the compiled dist artifact is absent) and findings 4/5 (`AMBIGUOUS` evidence is correctly flagged in trace output and in relationship/scan consumers).
14. **REQ-014 (P2-4):** Fix `spec.md`'s benchmark-record relative path (currently one directory too shallow) to match the working path already used in `tasks.md`/`implementation-summary.md`.
15. **REQ-015 (P2-5):** Correct the ADR-001 near-miss attribution in `tasks.md`, `checklist.md`, and `implementation-summary.md` to point at `../005-seeded-ppr-ranking/decision-record.md` ADR-001, not this packet's own (different) ADR-001.
16. **REQ-016 (P2-6):** Update `benchmark-status.md` and `feature-flags.md` so they no longer describe the recovered `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` flag as deleted/removed from the tree.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 16 requirements (REQ-001 through REQ-016) implemented and independently re-verified (fresh command output or fresh read, not the fix dispatch's own self-report).
- Existing code-graph vitest suite passes with both flags off, byte-identical to the pre-fix baseline (regression-proven the same way as 010: a genuine before/after comparison, not just a single run).
- New regression tests (REQ-013) pass and demonstrably fail against the pre-fix code (proving they actually exercise the bug).
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` passes with 0 errors, 0 warnings.
- `../010-edge-confidence-and-ppr-revisit` docs pass strict validation again after REQ-007 through REQ-010 and REQ-014/015 land.
- Every doc change is honest about what changed and why; no claim is made that isn't independently checkable.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| REQ-001's lazy-import refactor introduces a new async-timing bug in the seeded-PPR path | M | Full regression run of the recovered PPR test suite plus the existing code-graph suite, flag on and off, before and after. |
| REQ-006's rollback fix (whichever direction ADR-001 picks) could itself change flag-off ranking for edges that were never touched by a flag-on scan | H | Gate the fix so a fresh, never-flag-on DB is provably byte-identical before and after; test explicitly against a mixed-state DB fixture. |
| REQ-003's confidence downgrade could reduce PPR quality further in the already-cut benchmark, inviting a "why bother, it's already cut" temptation to skip | L | This packet does not re-run the PPR benchmark; REQ-003 is a correctness fix for the confidence signal itself, independent of the PPR cut verdict, and applies whether or not PPR is ever revisited again. |
| Doc-fix requirements (7-10, 14-16) touch docs already carrying multiple layers of prior correction; risk of re-introducing a contradiction | M | Read each doc's full current state before editing, as this session already learned to do; verify with a fresh read-back, not the same dispatch that made the edit. |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No new performance-sensitive path is introduced; `contextEdgeReliability`/`rankContextEdges` retain their current per-request cost profile (REQ-001, REQ-006's flag check is a single boolean env read, already the existing pattern).

### Security
- **NFR-S01**: REQ-003's import-target verification is itself an input-trust hardening fix; no new auth/secret surface is touched.

### Reliability
- **NFR-R01**: Both flags (`SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION`, `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING`) remain default-off; flags-off behavior must stay byte-identical to the pre-fix baseline (proven via before/after vitest run, not asserted).

---

## 8. EDGE CASES

### Data Boundaries
- Mixed-state DB (some rows differentiated by a prior flag-on scan, some still legacy uniform) with the flag currently off: every read must resolve to the legacy uniform tier regardless of what is actually persisted (REQ-006 / ADR-001).
- Zero-candidate and multi-candidate cases for same-name call resolution (REQ-003): zero candidates must not produce `EXTRACTED` confidence; multiple candidates must not silently pick one without downgrading confidence.

### Error Scenarios
- Missing compiled `bfs-traversal.js` dist artifact when the seeded-PPR path is actually invoked: must fail gracefully with a clear error, not crash the whole MCP server at startup (REQ-001).
- Flag toggled mid-session (not just at process start): REQ-006's read-time check must reflect the current flag value on every read, not a value cached at process boot.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: 5 production + 2 doc trees, LOC: ~200 across 6 P1 code fixes, Systems: 1 (code-graph MCP server) |
| Risk | 15/25 | Auth: N, API: N (internal MCP tool surface only), Breaking: N (both flags stay default-off) |
| Research | 8/20 | Root causes already isolated to specific line ranges by the 20-iteration review; no new investigation needed |
| Multi-Agent | 5/15 | Single executor (GPT-5.5-fast via cli-opencode), one dispatch chain |
| Coordination | 6/15 | Depends on this folder's own ADR-001 for REQ-006 only; no cross-packet coordination |
| **Total** | **52/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | REQ-001's lazy-import refactor introduces a new async-timing bug in the seeded-PPR path | M | L | Full regression run of the recovered PPR test suite plus the existing code-graph suite, flag on and off, before and after |
| R-002 | REQ-006's rollback fix changes flag-off ranking for edges never touched by a flag-on scan | H | L | Gate the fix so a fresh, never-flag-on DB is provably byte-identical before and after; test explicitly against a mixed-state DB fixture |
| R-003 | REQ-003's confidence downgrade further reduces PPR quality in the already-cut benchmark | L | M | Out of scope by design: REQ-003 is a correctness fix for the confidence signal itself, independent of the PPR cut verdict; this packet does not re-run the PPR benchmark |
| R-004 | Doc-fix requirements (7-10, 14-16) touch docs already carrying multiple layers of prior correction, risking a new contradiction | M | M | Read each doc's full current state before editing; verify with a fresh read-back, not the same dispatch that made the edit |

---

## 11. USER STORIES

### US-001: Operator trusts the flags-off safety contract (Priority: P0)

**As an** operator who has experimented with `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION`, **I want** turning the flag back off to fully restore prior ranking/trace/relationship behavior, **so that** I can safely try the flag without a silent, undetectable residual effect.

**Acceptance Criteria**:
1. Given a DB previously touched by a flag-on scan, When the flag is off, Then every confidence/evidence-class consumer reads the legacy uniform tier regardless of what is persisted.

### US-002: Reviewer trusts the packet's own completion claims (Priority: P1)

**As a** reviewer reading `../010-edge-confidence-and-ppr-revisit`'s docs, **I want** every "done"/"green"/benchmark claim to be independently reproducible or explicitly qualified, **so that** I don't have to re-derive evidence the docs claim already exists.

**Acceptance Criteria**:
1. Given the current state of `checklist.md`/`implementation-summary.md`, When I try to reproduce a cited command or number, Then it either reproduces exactly or the doc says plainly why it cannot.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- **Q-001 (REQ-006 direction): RESOLVED.** `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION` gates both writes and reads: flag-off reads normalize/ignore persisted differentiated confidence, closing the rollback gap. See decision-record.md ADR-001 for the two rejected alternatives and the full rationale.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
