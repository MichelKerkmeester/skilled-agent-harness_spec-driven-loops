---
title: "Feature Specification: OpenCode Route-Line Bounding"
description: "Planning spec: bound/digest OpenCode's uncapped compiled-route target list behind an independent flag, with an explicit reveal/clarification path, gated on phase 001's receipts."
status: planned
completion_pct: 0
trigger_phrases:
  - "opencode route line bounding"
  - "compiled route target cap"
  - "bounded compiled routing summary"
importance_tier: "important"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/002-opencode-route-line-bounding"
    last_updated_at: "2026-08-06T00:00:00Z"
    last_updated_by: "opus"
    recent_action: "Authored the planning spec for bounding the OpenCode compiled-route line"
    next_safe_action: "Author plan.md phase breakdown for the bounded renderer and reveal path"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-skill-advisor.js"
      - ".opencode/specs/hooks/001-per-prompt-injection-audit/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: OpenCode Route-Line Bounding

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-08-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `001-measurement-and-receipts-foundation` |
| **Successor** | `003-opencode-transform-dedup` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`renderCompiledRouteSummaryLine` in `.opencode/plugins/mk-skill-advisor.js` appends an additive line to every OpenCode advisor response: `Compiled routing (served=...): hub=... outcome=... targets=...`, where `targets` is `summary.targets.join(',')` with no cap on list length. A hub route or bundle outcome with many targets grows this line unboundedly on every turn it fires, independent of and in addition to the advisor/directive payload research.md measured. The `hooks/001` research ranked this candidate #2: variable savings that "removes the uncapped tail," low-medium guardrail risk, OpenCode-scoped, "medium-high confidence; conditional GO." [SOURCE: research.md §9 Ranked Reductions, rank 2] [SOURCE: research.md §3 Canonical Block Ownership - OpenCode compiled route]

### Purpose
Bound or digest the compiled-route target list behind an independent flag, with an explicit reveal/clarification path, so a route with many targets stays inspectable without unconditionally paying the full byte cost on every delivery - gated on phase 001's canonical block identity and delivery receipts so the change is measurable, not eyeballed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A bounded rendering mode for `renderCompiledRouteSummaryLine`: cap the rendered `targets` list at a fixed count, append a `+K more` marker for the omitted remainder, and include a short content digest of the full (untruncated) target list so distinctness across turns remains verifiable without re-enumerating every name.
- An explicit reveal/clarification path: when the list is truncated, a caller (operator, follow-up turn, or diagnostic tool) can obtain the full target list on request rather than the guardrail losing required target names silently.
- An independent flag gating the bounded renderer, off by default, so this candidate ships and can be toggled without touching phases 001, 003, or 004.
- Registration of the compiled-route block under phase 001's canonical block-ID scheme (`runtime.opencode-compiled-route.v1`) so before/after parity is provable through a receipt, not visual inspection.
- Parity fixtures proving: (a) unbounded legacy behavior is preserved when the flag is off, and (b) the bounded line never drops a target name the reveal path cannot recover.

### Out of Scope
- Any change to route *resolution* or the underlying `compiledRouteSummary` decision logic - this phase only bounds the rendered line's presentation.
- OpenCode same-message transform dedup (phase `003-opencode-transform-dedup`).
- Full-first/route-only repeat delivery (phase `004-full-first-route-only-repeats`).
- Any non-OpenCode runtime - this candidate is OpenCode-scoped per research.md §9's Coverage column.
- Activating the flag by default - this phase ships shadow/off-by-default; default-on activation follows the parent program's phase `007-guardrail-controls-and-activation` gate.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/mk-skill-advisor.js` | Modify | Bound `renderCompiledRouteSummaryLine`; add the independent flag and the reveal/clarification path |
| `.opencode/plugins/tests/mk-skill-advisor.test.cjs` | Modify | Add bounded-rendering, flag-off-parity, and reveal-path test cases |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts` | Modify | Register the compiled-route block under `runtime.opencode-compiled-route.v1` (extends phase 001's registry) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The bounded renderer never drops a target name from what the reveal path can recover | A fixture with more targets than the cap shows every original target name present either in the rendered line or in the reveal-path output |
| REQ-002 | The bounding behavior is gated by an independent flag, off by default | With the flag off, `renderCompiledRouteSummaryLine` output is byte-identical to the pre-change unbounded baseline captured from phase 001's parity fixtures |
| REQ-003 | An explicit reveal/clarification path exists for a truncated line | A fixture requests the full target list after a truncated render and receives the complete, untruncated set |
| REQ-004 | The compiled-route block is registered under phase 001's canonical ID scheme | `runtime.opencode-compiled-route.v1` resolves through `policy-plan.ts` and produces a content hash over the full (untruncated) target list |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | A short content digest of the omitted tail is included in the bounded line | The digest changes when the omitted target set changes and stays stable when it does not, proven by two fixtures with different omitted sets |
| REQ-006 | Existing route/outcome fields (`hub`, `outcome`, `servingAuthority`) are unaffected by bounding | Fixture comparison shows only the `targets` segment differs between bounded and unbounded renders |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fixture with a target list larger than the cap renders a bounded line plus a `+K more` marker, and the reveal path returns the exact original target set.
- **SC-002**: With the flag off, `mk-skill-advisor.test.cjs` shows byte-identical output to the phase 001 unbounded baseline for every existing route fixture.
- **SC-003**: `runtime.opencode-compiled-route.v1`'s content hash changes if and only if the underlying target set changes (order-insensitive or order-sensitive, decided and proven during implementation).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A required target name is dropped by truncation and the reveal path cannot recover it | Would weaken routing legibility for a hub/bundle outcome the guardrail needs the operator to see | REQ-001/SC-001 fixture requires every original name recoverable via the reveal path before activation |
| Risk | The cap value is set too low and clarification becomes the common case instead of the exception | Would trade byte savings for interaction overhead without net benefit | Choose the cap from observed target-count distribution captured by phase 001's fixtures, not an arbitrary constant |
| Dependency | Phase `001-measurement-and-receipts-foundation` ships the canonical block-ID scheme and receipt shape this phase registers into | Without it, there is no receipt to prove the bounded line is byte-stable where it should be | This phase does not start implementation until 001's `policy-plan.ts` registry exists |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What is the actual target-count distribution for hub/bundle compiled routes in production, and does it justify a fixed cap or an adaptive one? Resolved from phase 001's fixture data during implementation.
- Should the content digest be order-sensitive (routing order matters) or order-insensitive (only membership matters)? Decided during implementation and proven by SC-003.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Program Parent**: See `../spec.md`
- **Predecessor Phase**: See `../001-measurement-and-receipts-foundation/spec.md`
- **Research Source**: See `../../001-per-prompt-injection-audit/research/research.md`

<!-- /ANCHOR:related-docs -->
