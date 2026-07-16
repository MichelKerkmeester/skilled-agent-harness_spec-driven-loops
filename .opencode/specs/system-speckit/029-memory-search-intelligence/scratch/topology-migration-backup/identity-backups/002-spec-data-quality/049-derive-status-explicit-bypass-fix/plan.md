---
title: "Implementation Plan: Phase 12: derive-status-explicit-bypass-fix"
description: "Route deriveStatus's explicit-status complete claim through the completion-evidence gate, wire the orchestrator entrypoint, and backfill regression coverage."
trigger_phrases:
  - "derive status explicit bypass fix plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-spec-data-quality/049-derive-status-explicit-bypass-fix"
    last_updated_at: "2026-07-04T17:11:49.896Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan from spec.md"
    next_safe_action: "Implement Phase 2 (deriveStatus fix)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-phase-012-derive-status-bypass-20260702"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 12: derive-status-explicit-bypass-fix

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (compiled to `mcp_server/dist/`) |
| **Framework** | Node.js, Zod schema validation |
| **Storage** | Flat-file spec-doc frontmatter + generated JSON (`graph-metadata.json`) |
| **Testing** | vitest, matching the existing suite pattern for both touched files |

### Overview
`deriveStatus` ranks docs `implementation-summary.md` > `checklist.md` > `tasks.md` > `plan.md` > `spec.md` and returns the first explicit `status:` frontmatter/table value found (`:1185-1195`), including `complete`, before the phase-010 completion-evidence fallback (`:1215-1239`) ever runs. The fix narrows the early return to non-`complete` values only; a `complete` claim instead falls through to the exact same evidence-gated derivation logic the no-checklist branch already uses (reusing `parseCompletionPct`/`hasOpenTaskItems`/`evaluateChecklistCompletion` — no new helper needed). Separately, `orchestrator.ts:563-568` calls `resolveGeneratedMetadataIntegrity` without the `statusCompletionConsistencyEnforced` option; the fix adds one line mirroring the CLI bridge's existing `isStatusCompletionConsistencyGateEnabled()` wiring.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md, sourced from `review-report.md` T2 findings)
- [x] Success criteria measurable (SC-001 through SC-004)
- [x] Dependencies identified (none - independent of phase 011)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001 through REQ-006)
- [ ] Tests passing (targeted suite, fresh run pasted as evidence)
- [ ] Phase 010 spec.md REQ wording amended
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Narrow an existing early-return condition, plus one additive constructor-option pass-through at a second call site. No new abstraction layer.

### Key Components
- **`deriveStatus` (graph-metadata-parser.ts:1167-1246)**: the explicit-status branch (`:1192-1195`) is the exact defect site; the completion-evidence gate it must now share (`:1215-1239`) already exists from phase 010.
- **`validateGeneratedMetadataIntegrity`/`validateFolder` (orchestrator.ts:563-568, 598-633)**: the MCP validation entrypoint; the fix is a single added option key, matching `scripts/validation/generated-metadata-integrity.ts:82-85`'s already-correct pattern exactly.
- **`isStatusCompletionConsistencyGateEnabled` (capability-flags.ts)**: already exists from phase 010; reused as-is, not modified.

### Data Flow
No new I/O. `deriveStatus` already has every doc it needs in `docs: ParsedSpecDoc[]`; falling through to the existing evidence-gate branches costs nothing new. `orchestrator.ts`'s fix reads the same flag the CLI bridge already reads via the same exported function.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deriveStatus` (graph-metadata-parser.ts:1167-1246) | Sole producer of `derived.status` repo-wide | Update: narrow early-return to non-`complete` explicit statuses | New unit tests + full existing suite green |
| `orchestrator.ts:563-568` | MCP validation entrypoint for generated-metadata integrity | Update: pass `statusCompletionConsistencyEnforced` | New orchestrator-level test + existing tests unaffected |
| `scripts/validation/generated-metadata-integrity.ts` (CLI bridge) | Already wires the flag correctly | Unchanged - used as the reference pattern | Existing tests unaffected |
| The other 7 pre-existing violation codes in `generated-metadata-integrity.ts` | Governed by the blanket `grandfather` flag | Not modified; review iteration 7 confirmed no regression risk | Existing tests unaffected |
| Every folder repo-wide whose `derived.status` currently comes from an explicit-status shortcut without real evidence | Passive data, not code | Not bulk-corrected by this phase (same deferral precedent as phase 010's 213-folder backlog) | Re-derivation on next regeneration only; no forced repo-wide rewrite |

Required inventories:
- Confirm `deriveStatus` remains the single producer of `derived.status`: `rg -n "deriveStatus|derived\.status\s*[:=]" .opencode/skills/system-spec-kit/mcp_server/lib` before finalizing.
- Confirm no other call site needs the same orchestrator wiring: `rg -n "resolveGeneratedMetadataIntegrity" .opencode/skills/system-spec-kit --glob '*.ts'` — expect exactly 2 call sites (CLI bridge, orchestrator.ts).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline And Inventory
- [ ] Run the existing test suite touching `graph-metadata-parser.ts`/`orchestrator.ts` before any edit, capture output
- [ ] Confirm the exact explicit-status branch line range and the pinned test asserting the bypass

### Phase 2: Core Fix
- [ ] Narrow `deriveStatus`'s explicit-status early return to skip only `complete` claims, falling through to the existing evidence-gated logic
- [ ] Add `statusCompletionConsistencyEnforced: isStatusCompletionConsistencyGateEnabled()` to `orchestrator.ts`'s `resolveGeneratedMetadataIntegrity` call, with the matching import added

### Phase 3: Test Corrections And New Coverage
- [ ] Fix the pinned test at `graph-metadata-schema.vitest.ts:510-520` to assert the corrected behavior
- [ ] Add tests: explicit-status-without-evidence non-complete, explicit-status-with-evidence still-complete
- [ ] Add an orchestrator-level `validateFolder()` test with the flag enabled and a status/completion-mismatch fixture
- [ ] (P2) Add direct parser tests for the 5 previously-code-read-only edge cases

### Phase 4: Documentation And Verification
- [ ] Amend phase 010's `spec.md` REQ-001/REQ-002/REQ-005 wording per the review's Spec Seed
- [ ] Run the targeted suite fresh, confirm zero regressions
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `deriveStatus` explicit-status branch, both directions (with/without evidence) | vitest |
| Unit | `orchestrator.ts` enforced-mode wiring | vitest |
| Regression | Full existing `graph-metadata-parser`/`generated-metadata-integrity`/`orchestrator` suites | Same runner |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | N/A | N/A | Isolated fix, no external dependency; independent of phase 011 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: full test suite regresses, or the orchestrator wiring accidentally enforces by default
- **Procedure**: revert the 2 modified source files via targeted `git checkout` of the prior commit; the flag itself remains default-off from phase 010, so no separate flag rollback is needed
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
