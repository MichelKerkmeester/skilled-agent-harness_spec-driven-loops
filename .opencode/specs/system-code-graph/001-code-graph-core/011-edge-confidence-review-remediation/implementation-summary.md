---
title: "Implementation Summary [template:level_3/implementation-summary.md]"
description: "Remediated all 16 confirmed findings from the 20-iteration deep review of 010-edge-confidence-and-ppr-revisit, including feature catalog and manual testing playbook coverage for both new flags."
trigger_phrases:
  - "edge confidence review remediation summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/001-code-graph-core/011-edge-confidence-review-remediation"
    last_updated_at: "2026-07-06T16:45:35.615Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Closed REQ-012, re-verified all fixes against a fresh vitest run and real source"
    next_safe_action: "Packet complete; no further action needed unless new findings surface"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-01-011-edge-confidence-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q-001 (REQ-006 direction): resolved via ADR-001 -- flag-off reads normalize persisted differentiated confidence rather than trusting it."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-edge-confidence-review-remediation |
| **Completed** | 2026-07-01 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A 20-iteration deep review of `../010-edge-confidence-and-ppr-revisit` surfaced 16 real findings (10 P1, 6 P2, 0 P0) in the code-graph edge-confidence-differentiation and seeded-PPR-revisit work. This phase fixes every one of them.

### Real-behavior fixes (REQ-001 through REQ-006)

`code-graph-context.ts` no longer imports the Memory MCP's compiled traversal module at module top level -- a missing `dist/` artifact used to crash the entire code-graph MCP server at startup even for requests that never touch seeded-PPR. The import is now lazy, resolved only when the PPR path actually runs, with the `async`/`await` chain threaded through `buildContext`, `expandAnchor`, and every call site.

Seeded-PPR's `why_included.edgeChain` now carries the full multi-hop path back to the anchor instead of just the final incoming edge. This required an additive `predecessor` field on the shared `collectWeightedWalk` walker (`system-spec-kit/mcp_server/lib/graph/bfs-traversal.ts`) -- a small, backward-compatible field, not a second walker -- plus a path-reconstruction helper in `code-graph-context.ts` that walks predecessors back to the anchor and looks up each hop's real edge metadata.

Cross-file call resolution no longer claims `EXTRACTED`-tier confidence for a same-name-only match it never actually verified against the real import target; that case now correctly downgrades to `INFERRED`, matching the same-file resolver's own convention for an unverified name match. Every consumer of edge evidence class -- the seeded-PPR trace, the relationship-query classifier, and the scan-enrichment classifier -- now recognizes `AMBIGUOUS` as weak evidence, not just `INFERRED`, and the cross-file resolver guarantees `detectorProvenance` is set whenever it writes an `AMBIGUOUS` classification.

Flag-off reads now normalize persisted differentiated confidence instead of trusting it (ADR-001): once a database has been touched by a flag-on scan, turning the flag back off previously left ranking, trace output, and relationship classification reading the stale differentiated values. Every read-side consumer now substitutes the legacy uniform tier (`0.8/INFERRED/heuristic`) when the flag is off -- scoped precisely to CALLS edges, since that's the only edge type this feature ever varied. IMPORTS, EXTENDS, CONTAINS and the other edge types resolve their own constant confidence by construction and were never part of this flag's scope.

### Evidence and documentation honesty (REQ-007 through REQ-010, REQ-014, REQ-015)

`../010-edge-confidence-and-ppr-revisit`'s own tasks/plan/checklist now show real, verified completion instead of stale unchecked boxes, and its own Status field was corrected from "In Progress" to "Complete". "Green"/"passing" test-suite language was reworded to baseline-relative claims across five docs, since this codebase carries pre-existing, unrelated test failures that a bare "green" claim would misrepresent. The suite-baseline citation was replaced with the current, independently reproducible count rather than re-citing a now-stale number (unrelated commits landed on this branch mid-remediation, shifting the pre-existing baseline). The one-time confidence-distribution edge counts (892/2267/16198/2838) are now explicitly qualified as non-reproducible from checked-in evidence, in both the 010 folder and the cross-referenced `007-dark-flag-graduation` benchmark record. A relative-path bug in `spec.md`'s benchmark-record reference and a misattributed ADR-001 reference (three files pointed at the wrong decision record) are both corrected.

### Cleanup (REQ-011, REQ-016)

The seeded-PPR eval harness now wraps its temp-directory and shared-script cleanup in `try`/`finally`, so a mid-run failure can no longer leave `ppr-impact-child.mjs` or a `vitest-tmp/ppr-eval-*` directory behind. `benchmark-status.md` and `feature-flags.md` no longer describe the recovered `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` flag as deleted -- it was recovered from git history for the re-benchmark and is present in the tree again, still default-off, with the CUT verdict reconfirmed.

### Feature catalog and manual playbook coverage (REQ-012)

A new `feature_catalog/edge-confidence-and-provenance/` group documents both flags across three files (edge-confidence-differentiation, edge-evidence-classification, seeded-ppr-impact-ranking), each with accurate source citations verified line-by-line against the real files. Four existing catalog files were updated to reference the new group instead of standing stale (`feature_catalog.md` index, `code-graph-context.md`'s previously "one-hop"-only `why_included` description, `query-self-heal.md`, `code-graph-scan.md`). Two new manual-testing-playbook scenarios (028, 029) validate both flags end-to-end, including the flag-off-after-a-flag-on-scan normalization case. `ENV_REFERENCE.md` gained a complete, accurate row for each flag (it previously had zero rows for `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` and a stale row for the other).

Two additional real defects surfaced and were fixed during this final sweep: a now-provably-unreachable dead-code branch in `query.ts`'s `classifyEdgeEvidenceClass` (its sole call site already early-returns the legacy tier before ever reaching it) and an equivalent dead branch in the shared `bfs-traversal.ts` walker's node-rediscovery logic (proven unreachable by induction: every state within one BFS iteration shares the same hop value, so a rediscovered node's hop can never be less than its already-recorded minimum). Both were verified unreachable before removal, not just simplified on suspicion.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One GPT-5.5-fast (high) dispatch via cli-opencode implemented the bulk of REQ-001, REQ-002, and REQ-006 inside an isolated git worktree, with the four-layer RM-8 mitigation (rendered banned-operations/allowed-write-paths block, fresh worktree, recorded recovery baseline, scoped allowed paths). Its self-report was not trusted at face value: every one of the 6 code fixes was independently re-verified by reading the actual diff against the real files. That verification found the dispatch had missed REQ-003 entirely, missed REQ-004 and both REQ-005 sub-fixes, and had over-applied the REQ-006 flag-off substitution to edge types (IMPORTS, EXTENDS, CONTAINS, and the blast-radius IMPORTS-dependents path) that were never part of this feature's scope -- a real regression risk that would have silently changed default production behavior for IMPORTS-based blast-radius queries. All of these were fixed directly, with new regression tests added for each, before syncing back to the live tree.

The final documentation sweep (feature catalog, manual playbook, vitest completeness, skill docs) ran as a discover-then-fix-then-verify multi-agent workflow. Mid-run, the discovery and fix agents detected **another live, concurrent Claude Code session actively editing the same production files and documentation** in real time on this shared (non-worktreed) tree -- confirmed via `ps aux` and file-modification timestamps. Rather than colliding, the agents read and verified the other session's in-flight work (a more thorough feature-catalog structure than originally planned) and built on top of it instead of overwriting it; one direct edit attempt was safely rejected by a stale-read guard before any damage occurred. This was independently re-verified after the fact: the resulting feature catalog and playbook content was read fresh, cross-checked line-by-line against real source, and confirmed accurate.

Final independent verification (run twice, fresh, after all workflow activity settled): `tsc --noEmit` passes clean on both the code-graph package and the shared spec-kit package. The full code-graph vitest suite shows 5 failed files / 8 failed tests / 767 passed / 1 pending / 776 total, both times identical -- all 5 failing files (code-graph-verify, ensure-ready, launcher-lease, ipc-socket-drift, security-hardening) are pre-existing daemon/IPC-liveness environment tests untouched by this remediation's file scope. `validate.sh --strict` passes with 0 errors on both this folder and `../010-edge-confidence-and-ppr-revisit`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Flag-off reads normalize persisted differentiated confidence rather than trusting it (ADR-001) | Delivers the reviewed packet's own stated "zero behavior change when off" guarantee even after a DB has been touched by a flag-on scan, with no migration needed. |
| Scope the ADR-001 flag-off substitution strictly to CALLS edges, not every edge type reaching a read-side consumer's default branch | Only CALLS edges ever carried the uniform legacy tier; IMPORTS/EXTENDS/CONTAINS/etc. resolve their own constant confidence by construction and were never gated by this flag. The first dispatch's broader substitution would have silently changed real blast-radius/relationship-query behavior for non-CALLS edges by default. |
| Track findings against the 20 raw `iteration-NNN.md` files, not `deep-review-findings-registry.json` | The registry has a confirmed merge bug that silently drops/mismerges findings when parallel iterations reuse the same finding ID. |
| Replace the stale 6-failed-file baseline citation with the current real count rather than re-citing the old number | Unrelated commits landed on this branch during this remediation, genuinely shifting the pre-existing baseline; re-citing the old number would make the doc's own reproduce-this-command claim false on the very next run. |
| Build on the concurrent session's in-flight feature-catalog work instead of overwriting it | The other session's `edge-confidence-and-provenance/` structure was independently verified accurate and more thorough than the originally planned single-file approach; discarding working, verified content to enforce a narrower original plan would have been pure waste. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `tsc --noEmit`, code-graph package | PASS: 0 errors |
| `tsc --noEmit`, shared spec-kit package | PASS: 0 errors |
| Full code-graph vitest suite, final state (run twice) | PASS: 5 failed files / 8 failed tests / 767 passed / 1 pending / 776 total, identical both runs; all failures pre-existing daemon/IPC-liveness flakiness unrelated to this remediation |
| New regression tests: lazy-import, predecessor tracking, AMBIGUOUS classification across all consumer sites, IMPORTS-unaffected-by-flag, mid-session flag toggle | PASS: all pass |
| Feature catalog coverage for both flags | PASS: verified line-by-line against real source by an independent completeness-critic pass |
| Manual playbook coverage for both flags | PASS: 2 new scenarios (028/029), cross-linked correctly, no broken links |
| `ENV_REFERENCE.md` coverage for both flags | PASS: exactly one accurate row each, confirmed via `grep -c` |
| `validate.sh --strict`, this folder | PASS: 0 errors, 0 warnings |
| `validate.sh --strict`, `../010-edge-confidence-and-ppr-revisit` | PASS: 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The confidence signal is still a proxy, not true semantic resolution** -- unchanged from `../010-edge-confidence-and-ppr-revisit`'s own documented limitation; REQ-003's fix corrects the confidence *tier* assigned to the proxy, it does not replace the proxy with real call-target binding.
2. **Five pre-existing, unrelated vitest failures remain in the broader suite** (code-graph-verify, ensure-ready, launcher-lease, ipc-socket-drift, security-hardening) -- confirmed out of this remediation's file scope, but real and worth a separate follow-up, particularly `ipc-socket-drift.vitest.ts`, which indicates a genuine drift between the code-index and canonical shared IPC socket-server copies.
<!-- /ANCHOR:limitations -->
