# Iteration 005 — Spec-Alignment/Traceability

**Verdict:** PASS | **Findings:** P0=0 P1=0 P2=2 | **newFindingsRatio:** 1.0 | **adversarial P0 replays:** 0

## Findings

### [P2] TRACE-001 — docs-traceability  (confidence 0.85)
- **[SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/012-empty-graph-first-time-auto-scan/spec.md:77-86]** · finding_class: `docs-vs-code`
- **Evidence:**
```
Files to Change table lists `mcp_server/lib/index-scope-policy.ts`, `mcp_server/lib/ensure-ready.ts`, `mcp_server/tests/code-graph-default-scope.vitest.ts`, `mcp_server/tests/ensure-ready.vitest.ts`, `mcp_server/stress_test/code-graph/context-handler-normalization-stress.vitest.ts` — but the `bug-report-memory-db-corruption.md` artifact that also lives in this packet is not listed anywhere in spec.md scope or requirements.
```
- **Why:** The bug-report is a co-located packet artifact (created during the 012 save, per its own header lines 27-30) but the spec gives no forward pointer to it, so a reader auditing the packet from spec.md alone would not know the bug-report exists. The bug-report itself documents the rationale (lines 27-30: 'Filed in this packet because the corruption surfaced during the 012 memory save... affected component is system-spec-kit / mk-spec-memory, not code-graph'), so it is not a contradiction — only an unlinked artifact.
- **Fix:** Add a one-line note in spec.md §6 Risks/Dependencies or a 'Related artifacts' line pointing to bug-report-memory-db-corruption.md, or move the bug-report to a system-spec-kit packet since it is explicitly not a code-graph defect.

### [P2] TRACE-002 — docs-traceability  (confidence 0.8)
- **[SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/012-empty-graph-first-time-auto-scan/implementation-summary.md:92-101]** · finding_class: `docs-vs-code`
- **Evidence:**
```
Verification table maps tests to REQ-002 ('Still-blocked integration (empty + opted-in -> blocked, indexFiles not called)') and REQ-003 ('Auto-establish integration (empty + default -> indexFiles called, autoRescanSafety allowed)'), but there is no explicit verification row for REQ-001 (P0: 'Auto-establish must never run on a populated graph'). spec.md REQ-001 acceptance (lines 97) says 'verified by existing guarded tests' but the impl-summary does not name which existing test covers the populated-graph-not-auto-established path.
```
- **Why:** REQ-001 is the only P0 requirement; its verification is asserted indirectly ('existing guarded tests') rather than with a named test row. The code is correct — ensure-ready.ts line 668 gates `firstTimeAutoEstablish` on `state.freshness === 'empty'`, and ensure-ready.vitest.ts lines 340-373 exercise populated/guarded paths — so the P0 IS covered by code structure and existing tests, but the impl-summary traceability for the highest-severity requirement is thinner than for the P1s.
- **Fix:** Add a verification row to implementation-summary.md naming the existing populated-graph guarded test (ensure-ready.vitest.ts lines ~340-373) that proves REQ-001 (populated graph keeps the fingerprint guard, never auto-establishes).

## Coverage
Covered: full REQ-001..004 traceability from spec.md §4 to ensure-ready.ts (firstTimeAutoEstablish gate, lines 668-677) and index-scope-policy.ts (isDefaultEndUserScope predicate, lines 56-63), plus verification that read-path consumers (context.ts:184, query.ts:1192) pass allowGuardedInlineFullScan:true while detect-changes.ts (249-252) deliberately omits it (matches spec 'Out of Scope' for detect_changes). Confirmed all 5 cited test/source files exist on disk with current line numbers, and the integration tests (ensure-ready.vitest.ts:376-420) and unit tests (code-graph-default-scope.vitest.ts) assert exactly the REQ-002/REQ-003 acceptance criteria (indexFiles called + autoRescanSafety:'allowed' for default; not-called + 'blocked' for opted-in). REQ-001 (P0) verified correct by code structure (freshness==='empty' gate) and existing populated-graph guarded tests. REQ-004 verified: index-scope-policy.ts adds only the additive predicate, no edit to scope defaults. All findings are P2 docs/traceability only — no spec-vs-code contradiction, no P0/P1. NOT verified this pass: actual test execution results (did not run vitest/tsc — relied on impl-summary's reported PASS at lines 94-100); the exact contents of the stress-test pin change (file confirmed to exist + timestamped post-impl but its assertion body not read); whether the dist rebuild claim (impl-summary line 100) is current on disk.

Review verdict: PASS
