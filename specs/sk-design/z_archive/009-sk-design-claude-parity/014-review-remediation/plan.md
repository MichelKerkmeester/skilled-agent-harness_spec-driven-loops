---
title: "Implementation Plan: sk-design Claude-Parity Review Remediation"
description: "Sequenced fix plan for the 11 active deep-review findings: shared output-policy resolver first, then prompt-data isolation, then renderer CSS safety, transition parser, traceability, and P2 advisories."
trigger_phrases:
  - "implementation"
  - "plan"
  - "review remediation"
  - "phase 014 plan"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/014-review-remediation"
    last_updated_at: "2026-07-06T18:20:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Wrote plan.md"
    next_safe_action: "Read affected source files, implement Seam B"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "review-remediation-014"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-design Claude-Parity Review Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node backend scripts) |
| **Framework** | None - standalone CLI scripts under `design-md-generator/backend/scripts` |
| **Storage** | Filesystem (generated report/preview/proof artifacts) |
| **Testing** | Node's built-in test runner via files under `backend/tests/` |

### Overview
Fix all 11 active findings from the 009 packet's deep review by introducing two shared modules (`output-policy.ts`, `render-safety.ts`) that centralize path resolution and CSS-value sanitization, then wiring the 5 P1 seams and 3 P2 advisories through them.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (from review-report.md)
- [x] Success criteria measurable (spec.md SC-001..004)
- [x] Dependencies identified (shared resolver used by 5 consumers)

### Definition of Done
- [ ] All 11 findings fixed or explicitly deferred with user approval
- [ ] Backend test suite passing including new regression tests
- [ ] Docs updated (spec/plan/tasks/checklist, feature catalog alignment)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Extract-shared-helper refactor: two new single-purpose modules consumed by existing scripts, no framework change.

### Key Components
- **`output-policy.ts`**: resolves a requested output path against the operator's cwd, enforces the current spec-folder or an approved `/tmp/skd-*` sandbox, and owns overwrite/`--force` semantics for fixed artifact names.
- **`render-safety.ts`**: property-specific CSS-value encoders (color, length/radius, font-family, font-size/weight, line-height, shadow, url) plus a safe style-attribute builder; unsafe values render as escaped text with a warning instead of being interpolated raw.
- **`build-write-prompt.ts` prompt encoder**: wraps all live-site-derived strings in an explicit data block, and surfaces deterministic component facts alongside it.

### Data Flow
Extraction (`extract.ts`) -> guided run (`guided-run.ts`) -> write prompt (`build-write-prompt.ts`) -> generated `design.md` -> report/preview/proof generation (`report-gen.ts`, `preview-gen.ts`, `proof.ts`). The output-policy resolver sits at every filesystem-write boundary; the render-safety module sits at every CSS-value-into-HTML boundary.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `extract.ts` output guard | Validates output path against one cwd assumption | Update to call `output-policy.ts` | Adversarial path test: relative, absolute, traversal, sandbox |
| `guided-run.ts` cwd handling | Validates relative output against one cwd, executes extraction from another | Update to call `output-policy.ts` for both | Test: guided run from non-repo-root cwd |
| `report-gen.ts` / `preview-gen.ts` renderers | Interpolate source-derived CSS/dark-mode values into style attributes raw | Update to call `render-safety.ts` | Malformed CSS-value fixture tests |
| `css-analyzer.ts` transition parser | `value.split(',')` on transition shorthand | Replace with paren-depth-aware split | `cubic-bezier(...)`, `steps(...)`, multi-transition tests |
| `build-write-prompt.ts` | Interpolates extracted strings directly into prompt, omits component facts | Add data-encoder wrapper + component-facts section | Malicious-string test, component-facts-present test |
| `feature_catalog/report-preview/report-preview.md` | Documents overwrite protection that isn't implemented | Align to implemented guard (code fix, not doc-only) | Diff catalog text against implemented behavior |
| `shared/procedure_card_schema.md` | Schema lint is manual-only | Wire into existing canon checker script | Canon checker run includes schema lint |
| `012-routing-benchmark-rigor/decision-record.md` | Byte-identical benchmark artifacts under two naming conventions | Pick one convention, document the decision | Diff shows single naming convention going forward |

Required inventories:
- Same-class producers: `rg -n "writeFileSync|path.resolve|path.join" .opencode/skills/sk-design/design-md-generator/backend/scripts/*.ts`
- Consumers of changed symbols: `rg -n "resolveOutputPath|renderSafeStyle|buildWritePrompt" .opencode/skills/sk-design/design-md-generator/backend`
- Matrix axes: output path (relative/absolute/traversal/sandbox) x caller (extract/guided-run/report-gen/preview-gen/proof) = 5x4 = 20 rows minimum for resolver coverage.
- Algorithm invariant: `resolveOutputPath` must never return a path outside the resolved spec-folder root or the approved sandbox root, for any input including `../`, symlink, or absolute-outside-root paths.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Seam B - Output/Artifact Policy (first, unifies P1-002/005/004)
- [ ] Create `output-policy.ts` with `resolveOutputPath()` and overwrite/`--force` semantics
- [ ] Wire `extract.ts`, `guided-run.ts`, `report-gen.ts`, `preview-gen.ts`, `proof.ts` through it
- [ ] Adversarial path tests (relative, absolute, traversal, sandbox, missing spec folder)

### Phase 2: Seam A - Prompt Data / Component Facts
- [ ] Add data-only encoder in `build-write-prompt.ts` (P1-003 first)
- [ ] Surface component facts through the encoder (P1-001)
- [ ] Malicious-string and component-facts-present tests

### Phase 3: Seam C - Renderer CSS-Value Safety
- [ ] Create `render-safety.ts` sanitizer helpers
- [ ] Wire `report-gen.ts` (dark-mode vars) and `preview-gen.ts` (CSS tokens) through it
- [ ] Malformed-value fixture tests

### Phase 4: Seam D - Transition Parser (independent, any time)
- [ ] Replace comma-split with paren-depth-aware parsing in `css-analyzer.ts`
- [ ] `cubic-bezier`/`steps` regression tests

### Phase 5: Seam E - Traceability + P2 Advisories
- [ ] Align `report-preview.md` with implemented overwrite guard (reuses Seam B)
- [ ] Wire procedure-card schema lint into canon checker (P2-001)
- [ ] Resolve duplicate benchmark artifact naming (P2-002)
- [ ] Add tests for focused extraction modules lacking coverage (P2-003)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `output-policy.ts`, `render-safety.ts`, `css-analyzer.ts` transition parsing | Node test runner (existing pattern in `backend/tests/*.test.ts`) |
| Regression | `build-write-prompt.ts` prompt-injection and component-facts cases | Node test runner |
| Manual | Run md-generator end-to-end on a sample site, confirm report/preview render safely with edge-case CSS values | md-generator CLI |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Existing `backend/tests/` Node test harness | Internal | Green | New tests follow existing pattern; no blocker expected |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any seam's fix breaks an existing passing test or changes observable output-artifact behavior in a way not covered by spec.
- **Procedure**: `git revert` the specific seam's commit; seams are implemented and committed independently enough to isolate.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Seam B) ──► Phase 2 (Seam A) ──► Phase 3 (Seam C) ──► Phase 5 (Seam E + P2)
                                                                 ▲
                                          Phase 4 (Seam D) ─────┘ (independent, runs anytime)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Seam B | None | Seam A, Seam E (overwrite guard reuse) |
| Seam A | Seam B (shares no files but sequenced per review Plan Seed) | Seam C (if same test fixtures) |
| Seam C | Seam A (if same owner/session) | None |
| Seam D | None | None (fully independent) |
| Seam E + P2 | Seam B | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Seam B | Medium | 5 files + resolver + tests |
| Seam A | Medium | 1 file + encoder + tests |
| Seam C | Medium | 2 files + new module + tests |
| Seam D | Low | 1 file + tests |
| Seam E + P2 | Low-Medium | Doc alignment + lint wiring + naming fix + tests |
| **Total** | | **Single remediation pass, 5 sequential phases** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] All new/modified tests pass locally before commit
- [ ] `validate.sh --strict` passes on the phase folder

### Rollback Procedure
1. Identify the failing seam's commit
2. `git revert <sha>` for that seam only
3. Re-run backend test suite to confirm the revert restores prior green state

### Data Reversal
- **Has data migrations?** No - filesystem artifacts only, regenerated on next run.
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
