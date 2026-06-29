---
title: "Implementation Plan: Recommended fix-shape column for the hardening matrix"
description: "Additive plan to add a recommend-only fix-shape + owner column to every probe table in the audit hardening matrix, preserving the audit/implement boundary."
trigger_phrases:
  - "harden fix shape column plan"
  - "hardening matrix recommended fix owner"
  - "audit recommend fix shape sk-code implements"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/009-harden-fix-shapes"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark plan tasks complete with evidence; rename L2 anchors to canonical form"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/references/hardening_edge_cases.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase ships content only: the spec names no validator, so the column shape is grep-checkable but no checker is bundled"
      - "Owners reuse the file's routing set plus the named a11y and evidence routes, not a parallel vocabulary"
---
# Implementation Plan: Recommended fix-shape column for the hardening matrix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | sk-design design-audit reference (markdown craft asset) |
| **Target artifact** | `.opencode/skills/sk-design/design-audit/references/hardening_edge_cases.md` |
| **Edit type** | Additive table column; existing probe/symptom/finding content preserved |
| **Boundary** | Audit recommends a fix shape and owner; `sk-code` implements the fix |
| **Enforcement** | Hybrid: the column shape is deterministically checkable; fix correctness and taste stay advisory |

### Overview
Add a `Fix shape to recommend` column to every probe table in the hardening matrix so each edge case names the shape of its remedy and the owner who carries it, without crossing into implementation. Today the matrix proves a gap (probe, expected symptom, finding to file) and routes an owner in prose, but the recommended fix shape is systematic only in one section. This makes the fix shape a per-row, deterministic field across all probe tables. The audit still only recommends a shape and an owner; the correctness of the fix remains `sk-code` work after the user accepts it. All existing rows, columns, prose, and the routing summary are preserved.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Target file read in full; the eight probe tables and their three current columns are mapped — read in full; nine probe tables mapped including the §8B Device and Constrained Context table
- [x] Owner vocabulary confirmed from the file's routing summary (`foundations`, `interface`, `sk-code`) plus the audit findings schema — routing summary point 3 confirms the three owners
- [x] Audit/implement boundary statement located in the intro and routing summary — intro and routing summary point 4 carry the recommend-and-route boundary
- [x] Fix-shape grammar agreed: a fix shape names a remedy pattern and an owner, never implementation code — every cell is "remedy pattern. Owner: `x`."
- [x] Evergreen constraint understood: no spec IDs, packet numbers, or ephemeral paths in the authored content — evergreen grep over the new column is clean

### Definition of Done
- [x] Every probe row in every matrix table carries a non-empty recommended fix shape and a named owner — all 35 rows filled across nine tables
- [x] Owners are drawn only from the file's allowed routing vocabulary — 9 `foundations` + 9 `interface` + 17 `sk-code` = 35
- [x] Existing Probe / Expected symptom / Finding columns and all surrounding prose are preserved — 35 rows reformatted, 0 rows lost, symptoms/findings verbatim
- [x] The recommend-only boundary is intact and reinforced; no row introduces implementation code — routing summary point 4 names the column advisory; cells are remedy shapes
- [x] No IDs or paths are embedded in the new content; copy stays content-first house style — evergreen grep clean
- [x] No sibling reference file is modified (no-regression on the design-audit reference set) — only `hardening_edge_cases.md` modified

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive table-column extension of an existing audit reference. The matrix stays a recommend-and-route artifact; the new column carries the recommended remedy shape and its owner, never the implementation.

### Key Components
- **The eight probe tables**: Extreme Inputs, API and Network Errors, Permissions and Rate Limits, Concurrency, Internationalization and RTL, Text Expansion, CJK and Emoji, Overlays and Top Layer. Each gains a fourth column.
- **The owner vocabulary**: `foundations` for layout, spacing, logical-property and token fixes; `interface` for empty-state and error-state direction; `sk-code` for implementation. Accessibility halves route to the a11y quick-fixes asset already named in the file.
- **The boundary statement**: the intro and routing summary already say the audit proves the gap and names the owner, and does not harden the surface. The new column must read as a recommendation, not an instruction to the audit itself.
- **The existing inline precedent**: the Overlays and Top Layer section already carries a prose `Fix shape:` line. That content is normalized into the new column so the pattern is uniform across every table.

### Data Flow
1. The audit walks a probe against real evidence.
2. It observes the expected symptom when the surface is unhardened.
3. It files the finding with element, impact, severity and owner.
4. It now also names the recommended fix shape (a remedy pattern) and the owner in the new column.
5. It routes the finding to that owner; `sk-code` implements the accepted fix.

### Per-table fix-shape direction (recommend-only)
| Table | Representative fix-shape patterns | Typical owner |
|---|---|---|
| Extreme Inputs | overflow handling, `min-width: 0` on flex/grid child, content sizing, empty-state with next action | `foundations`, `interface` for empty state |
| API and Network Errors | contained error state, retry and backoff cue, field-level validation surfacing, re-auth route | `interface` for the state, `sk-code` for retry/timeout logic |
| Permissions and Rate Limits | read-only mode, disabled affordance with reason, rate-limit feedback and retry cue | `interface`, `foundations` for the a11y reason, `sk-code` |
| Concurrency | disable-on-inflight, conflict detection, optimistic-update rollback, state preservation across reload | `sk-code`, `interface` for the surfaced state |
| Internationalization and RTL | logical-property swap, locale-aware formatting, real plural path | `foundations`, `sk-code` |
| Text Expansion | content-sized container, expansion budget over fixed width | `foundations` |
| CJK and Emoji | Latin-agnostic line-height and wrapping, multibyte-safe truncation | `foundations`, `sk-code` |
| Overlays and Top Layer | top-layer escape via native dialog/popover, measured fixed position, or portal | `foundations`, `sk-code` |

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the column header text `Fix shape to recommend` — header confirmed, used verbatim on every table
- [x] Confirm the owner vocabulary and the a11y route already named in the file — `foundations`/`interface`/`sk-code` plus `assets/a11y_quick_fixes.md` and `accessibility_performance.md`
- [x] Agree the fix-shape grammar: remedy pattern plus owner, no code, no implementation steps — grammar locked as "remedy pattern. Owner: `x`."

### Phase 2: Core Implementation
- [x] Add the `Fix shape to recommend` column to each of the eight probe tables — added to all eight, plus the §8B Device and Constrained Context table (nine total)
- [x] Write one recommended fix shape and owner per probe row, using the per-table direction above — 35 rows filled, one shape + owner each
- [x] Normalize the existing Overlays prose `Fix shape:` line into the new column so the pattern is uniform — Overlays prose folded into the column, no content lost
- [x] Reinforce the recommend-only boundary in the intro or routing summary so the new column is read as a recommendation — routing summary point 4 states the column is advisory

### Phase 3: Verification
- [x] Every probe row carries a non-empty fix shape and a named owner — 35/35 rows filled
- [x] Every owner is drawn from the allowed routing vocabulary — 9 `foundations` + 9 `interface` + 17 `sk-code`
- [x] No row introduces implementation code; shapes are remedy patterns only — cells are remedy directions, not code
- [x] No IDs or paths appear in the new content; copy is content-first — evergreen grep clean
- [x] Existing columns, rows, prose and sibling references are unchanged — 0 rows lost, §8A to §8B to §9 ordering intact, only the target file touched

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Structural | The fourth column exists in all eight probe tables; every probe row has a non-empty fix-shape cell | Read plus grep over the table rows |
| Vocabulary | Each owner token is in the allowed routing set | Grep for owner tokens against the allowed set |
| Boundary | No row carries implementation code or step-by-step instructions; the audit still recommends and routes | Manual review |
| Evergreen | No spec IDs, packet numbers or ephemeral paths in the new content | Grep for digit-prefixed slugs and `specs/` paths |
| No-regression | Only the target file changed; existing rows and prose preserved | `git diff --stat` and a content diff of the target |

**Honest enforcement note:** the structural and vocabulary checks above are deterministic and could be enforced by a future matrix lint or benchmark lane, but this phase ships content only and adds no checker. The "matrix check" acceptance is therefore satisfied by review and grep, not by a gate that bites in CI. Whether a recommended fix shape is the right remedy for a given surface, and the correctness of the eventual fix, are owned by `sk-code` and human or rendered review and stay advisory.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Hardening matrix reference (target) | Internal | Green | The change cannot land |
| Owner routing vocabulary (this file's routing summary + audit findings schema) | Internal | Green | Owners cannot be assigned deterministically |
| Accessibility quick-fixes asset (already linked from the file) | Internal | Green | Permission a11y halves lose their route target |
| Hardening source pattern in the external corpus | Internal (read-only) | Green | Loss of the systematic fix-shape precedent only |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a fix shape crosses into implementation, an owner falls outside the allowed vocabulary, or a probe table is left without a fix shape on every row.
- **Procedure**: revert the single-file change to the target reference; no other file is touched.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──> Phase 2 (Core) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Core (column across nine tables) | Low-Medium | 1-1.5 hours |
| Verification | Low | 30 minutes |
| **Total** | | **~2-2.5 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Target file content diff reviewed before save — diff shows 35 rows reformatted, 0 rows lost
- [x] Confirmed no sibling reference was edited — only `hardening_edge_cases.md` modified
- [x] Confirmed the boundary statement still reads recommend-only — routing summary point 4 names the column advisory

### Rollback Procedure
1. **Immediate**: revert the single edited reference file
2. **Verify**: confirm the matrix renders with the original three columns and prose intact
3. **Scope**: no data, no schema, no code; the artifact is an advisory craft reference

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: single-file content revert; nothing downstream consumes the column as data in this phase

<!-- /ANCHOR:enhanced-rollback -->
