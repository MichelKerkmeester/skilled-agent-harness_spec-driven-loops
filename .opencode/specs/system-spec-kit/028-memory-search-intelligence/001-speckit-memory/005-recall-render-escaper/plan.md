---
title: "Implementation Plan: Recall→Render Trust Escaper + Substrate-Kind Recall Correctness (028/001 impl phase)"
description: "Implemented approach, sequencing, and remaining gate for the six write→recall→prompt spine candidates: C8 render escaper, capture-side injection filter, CAS-guard P2 polish, gated substrate-kind recall exclusion, residual-retention disclosure."
trigger_phrases:
  - "028 recall render escaper plan"
  - "C8 implementation plan"
  - "recall trust spine sequencing"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/005-recall-render-escaper"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implemented all ungated candidates and verified the focused memory MCP gate"
    next_safe_action: "Resolve substrate signal"
    blockers:
      - "M-system-kind-exclusion needs a substrate-only marker plus live-DB validation"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-005-recall-render-escaper-plan"
      parent_session_id: null
    completion_pct: 83
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Recall→Render Trust Escaper + Substrate-Kind Recall Correctness (028/001 impl phase)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node), Spec-Kit Memory MCP under `.opencode/skills/system-spec-kit/mcp_server/` |
| **Framework** | MCP stdio server; SQLite (vec + FTS5) storage |
| **Storage** | SQLite (`memory_index`, vector index, causal edges); retention sweep over the same store |
| **Testing** | vitest (`mcp_server/tests/*.vitest.ts`); `tsc` + build; `validate.sh --strict` on this folder |

### Overview
This sub-phase lands the highest-stakes spine — write → recall → prompt — plus two same-boundary recall-correctness candidates. The center of gravity is one coherent **recall-trust spine**: the C8 `source_kind`-labeled render escaper at the recall content formatter, its non-destructive capture-side injection-marker filter at the shared indexing core reached by `indexSingleFile`, and focused poison/injection vitests. The Constitutional-CAS-guard was already DONE in 030 (`e1c6a3c793`); this phase finishes its P2 polish and the additive residual-retention field. M-system-kind-exclusion remains gated because no safe substrate-only signal or live-DB validation input is available here. No candidate has a benchmarked benefit number — every change ships for correctness and reversibility (campaign caveat).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md §2-§3)
- [x] Per-candidate acceptance criteria research-cited (spec.md §4)
- [x] Shared-infra dependencies identified (this plan §6)
- [x] DONE candidates pinned to 030 §14 commit evidence

### Definition of Done
- [x] All ungated P0 acceptance criteria met (C8 + injection-filter), each with focused tests
- [x] CAS-guard P2 polish landed without touching the unconditional self-edit block
- [ ] Substrate-kind exclusion validated against the live DB (no canonical-spec-doc regression) — pending on substrate signal + live DB
- [x] `residual_retention` additive field on the existing sweep result, no deny-list registry
- [ ] `tsc` / build / focused vitest / `validate.sh --strict` green — typecheck and focused vitest are green; build was not run because the requested surface gate was typecheck + relevant vitest
- [ ] Each candidate committed in isolation on the 028 branch (no push without user go) — not applicable this turn; user explicitly said not to commit
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Boundary-hardening at two trust seams of an existing MCP server: the **capture** boundary (write → index) and the **render** boundary (recall → prompt). No new subsystem; each candidate is an additive guard or an honest-reporting field on an existing path.

### Key Components
- **Recall content formatter** (`shared-payload.ts` / `formatters/search-results.ts`): the single render seam that owns escaping (NOT `wrapForMCP`/`envelope.ts:284-295`, which serializes every response).
- **`indexSingleFile` chokepoint** (`context-server.ts:2190-2200`): the planned shared write path. In this codebase it delegates to `indexMemoryFile` / `processPreparedMemory`; the capture-side injection-marker flag installs in that shared indexing core so direct saves, scans, async ingest, and watcher routes are covered.
- **`redaction-gate.ts`**: secrets-only today (`:25-33` destructive PATTERNS); a SEPARATE non-destructive `detectInjectionMarkers` is added beside it (never merged into the secrets path).
- **`memory-crud-update.ts`**: the already-shipped constitutional CAS guard (`:118-142`); the P2 polish removes the now-dead downgrade branch.
- **`write-provenance.ts`** (`SourceKind` at `:7`): needs a real substrate signal distinct from canonical `source_kind='system'`.
- **`memory-retention-sweep.ts`** (`:373`): the existing `MemoryRetentionSweepResult` gains an additive `residual_retention` field.

### Data Flow
Capture: content → `indexSingleFile` / `indexMemoryFile` → `processPreparedMemory` → (secrets redaction) + non-destructive injection-marker flag metadata → index, hash over cleaned content. Recall: stored row (+`source_kind`) → ranking → recall content formatter → untrusted-content wrapper + tag-escape with normalized `source_kind` attribute → MCP text block → agent loop. Substrate-kind default exclusion is intentionally not active until its substrate signal and live-DB validation exist.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase touches security (injection/escaping), public recall responses (substrate-kind exclusion), persistence honesty (residual-retention), and a shared write-path policy (constitutional CAS), so the affected-surfaces inventory is mandatory.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Recall content formatter (`shared-payload.ts` / `search-results.ts`) | Renders recalled body raw into HOT-tier | Update — wrap + tag-escape gated by `source_kind` | `rg -n 'sanitizeSkillLabel' mcp_server`; poison vitest renders forged close-tag inert |
| `wrapForMCP` / `envelope.ts:284-295` | Serializes EVERY MCP response | Unchanged — NOT the C8 seam (would over-escape) | Confirm C8 lives in the content formatter, not here (iter-036) |
| `redaction-gate.ts:25-33` | Destructive secrets-only PATTERNS | Unchanged for secrets; add SEPARATE non-destructive marker detector | `rg -n 'detectInjectionMarkers' mcp_server` is a distinct symbol from the secrets path |
| `indexSingleFile` (`context-server.ts:2190-2200`) | Shared write chokepoint (save/ingest/watcher/startup) | Confirmed route into `indexMemoryFile` / `processPreparedMemory`; capture-side marker flag installed in the delegated shared indexing core | `tests/injection-marker-capture.vitest.ts` verifies the capture policy; route audit confirms direct save + scan/ingest/watcher share this core |
| `extraction-adapter.ts:247` (after-tool hook) | Only capture gate today (MCP results only) | Not a consumer for the new chokepoint flag | Confirm filter installs at `indexSingleFile`, not only the hook (I36-02) |
| `memory-crud-update.ts:118-142,451-452` | Shipped CAS guard + dead downgrade branch | Update — remove dead branch; document opt-in CAS posture | `tsc` clean; existing CAS tests still pass; non-constitutional path byte-identical |
| `write-provenance.ts:7` (`SourceKind`) | Defines `'system'` (also canonical spec-docs) | Held — no real substrate-internal marker was available in this phase | Pending live-DB query proves canonical spec-docs + 29 constitutional rules are NOT hidden before any default flip |
| `formatters/search-results.ts` default recall | Returns all kinds | Held — default recall remains unchanged for system-kind rows | Pending default-hidden + opt-in-visible tests once a substrate-only signal exists |
| `memory-retention-sweep.ts:373` (`MemoryRetentionSweepResult`) | Reports sweep outcome | Update — additive `residual_retention` field | Unit test asserts the field; no persistent deny-list registry created |

Required inventories:
- Same-class render seams: `rg -n 'wrapForMCP|serializeEnvelope|formatSearchResults|getTieredContent' mcp_server` — confirm the ONE seam that owns recall-content escaping.
- Consumers of `source_kind` / `SourceKind`: `rg -n 'source_kind|sourceKind|SourceKind' mcp_server --glob '*.ts'` before changing the default-recall filter.
- Algorithm invariant (escaping): a forged close-tag in a recalled body MUST render inert; the host prompt MUST be instruction-free and bound to the live wrapper-tag constant by a drift-test (H33-02).
- Algorithm invariant (injection-filter): anchored multi-token PHRASES only; ZERO benign-corpus false positives; hash over CLEANED content; residue-reject only when excision removed >half.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the recall content formatter + `indexSingleFile` + `redaction-gate.ts` seams; confirmed the single render seam is `formatters/search-results.ts`, not `wrapForMCP`.
- [x] Authored the benign-corpus fixture + the anchored-phrase marker list and validated zero false positives in focused vitest.
- [ ] Snapshot the live-DB `source_kind='system'` distribution to design the real substrate signal (avoid the ~49% canonical-spec-doc regression) — pending; live DB unavailable in this workspace.

### Phase 2: Core Implementation
- [x] **Recall-trust spine (one coherent change):** C8 render escaper at the content formatter + non-destructive `detectInjectionMarkers` capture filter in the shared indexing core + focused poison/injection vitests.
- [x] **Constitutional-CAS-P2-polish:** remove the now-dead downgrade-audit branch; document the always-on-SELF_EDIT / opt-in-CAS posture.
- [ ] **M-system-kind-exclusion:** derive a real substrate-internal signal + constitutional/spec-doc short-circuit + opt-in surface path; default-recall filter — left pending on gate.
- [x] **M-residual-retention-report:** additive `residual_retention` field on `MemoryRetentionSweepResult` (reading-b scope only).

### Phase 3: Verification
- [x] Poison/injection vitests pass for forged close-tag inertness, marker detection, marker-residue rejection, full recalled content, and compact anchor rendering.
- [x] Benign-corpus zero-FP fixture passes.
- [ ] Live-DB validation: canonical spec-docs + 29 constitutional rules NOT hidden by the substrate-kind exclusion — pending with REQ-005.
- [ ] Typecheck + relevant vitest are green; `validate.sh --strict` result is recorded in `implementation-summary.md`. Build and broad search/crud/health/promoter suites were not part of the requested gate.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | C8 escaper (forged close-tag, empty/null `source_kind` fail-closed); injection-marker detector (anchored phrases, residue-reject); CAS posture; substrate-kind default-hidden/opt-in-visible; `residual_retention` field | vitest |
| Probe (security) | Poisoned-RAG breakout, query-only injection, wrapper-breakout, zero-success ceiling, empty-probe-fails, full + compact recall | vitest (this phase's focused probe; the aggregate Red-team probe-gate CI is referenced, out of scope) |
| Corpus | Benign-corpus zero-FP gate for the marker list | vitest fixture (CI-gated) |
| Live-DB validation | Substrate-kind exclusion does not hide canonical spec-docs / constitutional rules | manual/scripted query against the live 734MB DB |
| Regression baseline | Re-run the existing search/crud/schema/health/promoter suites; capture starting numbers; report delta | vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Recall-trust spine internal coupling (C8 ↔ injection-filter ↔ probe) | Internal | Green | Build together as one spine; orthogonal in destructiveness, shared trust boundary |
| 027 fail-closed scrubber *pattern* | Internal (pattern reuse) | Green | C8 reuses the pattern, not 027's write-lane seam (synthesis §R27 #3); no hard code dep |
| `sanitizeSkillLabel` escaper primitive | Internal | Green | Promoted onto the recalled body; already exists (`lib/utils/skill-label-sanitizer`, `shared-payload.ts`) |
| Benign-corpus fixture + anchored-phrase list | New artifact | Green | Implemented in focused vitest; zero false positives observed |
| Live-DB snapshot of `source_kind='system'` | Validation input | Blocked | Required before flipping the substrate-kind default (avoids the ~49% regression) |
| Erasure path | External (does not exist) | Red | The `EraseReport.residual_retention` variant stays NO-GO; only the sweep-result field ships |
| M-redteam-probe-gate (aggregate CI) | Cross-cutting phase | Out of scope | This phase ships its own focused probe; the named aggregate gate is a sibling phase |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Each candidate is a separable diff; no commit was created because this turn explicitly prohibited commits.
- C8 + the capture filter default-on but additive: reverting restores the prior raw-render behavior (no schema change, no migration).
- The substrate-kind exclusion ships behind the opt-in (`includeSystem`-style) surface; if the live-DB validation regresses, the default flip is held and only the opt-in path lands.
- The CAS P2 polish is pure cleanup on already-shipped DONE code; reverting restores the dead branch with no behavior change.
- Nothing is pushed to main or deployed without explicit user go (branch-only, reversible).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: seams + fixtures + live-DB snapshot) ──> Phase 2 (Implementation) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation — recall-trust spine (C8 + injection-filter + probe) | Setup (benign-corpus fixture, render seam, `indexSingleFile`) | Verify |
| Implementation — CAS P2 polish | Setup (read shipped CAS guard) | Verify |
| Implementation — M-system-kind-exclusion | Setup (live-DB `source_kind` snapshot) | Verify (live-DB validation) |
| Implementation — M-residual-retention-report | Setup (read sweep result) | Verify |
| Verify | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

> Effort tags below are the research's structural-inference estimates, NOT benchmarked. C8/injection-filter = M; CAS P2 = S; M-system-kind re-scoped from S to a real correctness build; residual-retention = S.

| Candidate | Research Effort | Status |
|-----------|-----------------|--------|
| C8 source_kind-gated render escaper | M (reference-impl backed) | DONE |
| M-write-time-injection-filter | M (co-built with C8) | DONE |
| Constitutional-CAS-guard | S | DONE (`e1c6a3c793`) |
| Constitutional-CAS-P2-polish | S (cleanup) | DONE |
| M-system-kind-exclusion | S→ real build (re-scoped) | PENDING — gated on substrate signal + live-DB validation |
| M-residual-retention-report | S (additive field) | DONE |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Branch-only; nothing pushed/deployed without explicit user go
- [ ] Each candidate is a separable scoped commit on the 028 branch — not performed this turn per user instruction
- [ ] No schema migration; all changes additive/reversible

### Rollback Procedure
1. **Per-candidate revert**: after commit, `git revert <candidate-commit>` rolls back exactly one candidate; before commit, use the file-level diff hunks for the same separation.
2. **C8 + injection-filter**: reverting restores prior raw-render + secrets-only capture; no schema change.
3. **M-system-kind default**: ships behind the opt-in surface; if live-DB validation regresses, hold the default flip and land only the opt-in path.
4. **CAS P2 polish**: pure cleanup on DONE code; reverting restores the dead branch with no behavior change.
5. **Verify**: re-run the focused vitest + `validate.sh --strict` after any revert.

### Data Reversal
- **Has data migrations?** No — no schema change; `residual_retention` is an additive read-side report field, not a stored column.
- **Reversal procedure**: revert the commit; no data to preserve or unwind.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS
- **Spec / tasks / checklist:** `spec.md`, `tasks.md`, `checklist.md` (this folder).
- **Research:** `../research/research.md`; `../../research/roadmap.md`; `../../research/synthesis/{01,03,04}-*.md`.
- **Shipped record (do NOT modify):** `../../../030-memory-search-intelligence-impl/spec.md` §14.
