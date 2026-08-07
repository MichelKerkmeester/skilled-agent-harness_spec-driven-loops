---
title: "Implementation Plan: OpenCode Route-Line Bounding"
description: "Bound renderCompiledRouteSummaryLine behind an independent flag, add a reveal/clarification path for truncated target lists, and register the block under phase 001's canonical ID scheme."
trigger_phrases:
  - "route line bounding plan"
  - "compiled route cap implementation"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/002-opencode-route-line-bounding"
    last_updated_at: "2026-08-06T00:00:00Z"
    last_updated_by: "opus"
    recent_action: "Authored the implementation plan for bounding the compiled-route line"
    next_safe_action: "Author tasks.md task breakdown matching the three implementation phases"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-skill-advisor.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: OpenCode Route-Line Bounding

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (OpenCode plugin, CommonJS/ESM hybrid) |
| **Framework** | OpenCode plugin bridge (`mk-skill-advisor.js`) over the skill-advisor MCP bridge |
| **Storage** | None; rendering is pure over the in-memory `compiledRouteSummary` object |
| **Testing** | Node test runner via `.opencode/plugins/tests/mk-skill-advisor.test.cjs` |

### Overview
Add a bounded-rendering branch to `renderCompiledRouteSummaryLine`: when `summary.targets.length` exceeds a fixed cap, render the first N targets, append `+K more` where `K` is the omitted count, and append a short content digest of the full target list (`sha256` truncated to a fixed prefix length, computed the same way the module's existing `createHash('sha256')` usage nearby already does). Gate the bounded branch behind an independent flag read the same way the module reads its other options (`loadConfig`/`options`), off by default so legacy unbounded behavior is preserved until phase `007-guardrail-controls-and-activation` decides to flip it. Add a reveal/clarification accessor that returns the full, untruncated target list given the same `summary` object, so nothing the bounded line omits is unrecoverable. Register the compiled-route block under phase 001's `policy-plan.ts` registry as `runtime.opencode-compiled-route.v1`, hashing the full target list (not the bounded rendering) so the receipt always reflects ground truth.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (uncapped `targets.join(',')` tail; research.md rank 2)
- [x] Success criteria measurable (byte-identical flag-off parity, reveal-path recoverability, digest stability)
- [x] Dependencies identified (phase 001's `policy-plan.ts` registry must exist first)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001 through REQ-006 in `spec.md`)
- [ ] Tests passing (`mk-skill-advisor.test.cjs` bounded/flag-off/reveal cases)
- [ ] Docs updated (spec/plan/tasks/checklist/implementation-summary reconciled to the shipped state)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Flag-gated additive branch: the existing unbounded renderer stays the default path; the bounded renderer is a parallel branch selected only when the independent flag is on, with a companion reveal accessor for the data it truncates.

### Key Components
- **`renderCompiledRouteSummaryLine` (modified)**: Gains a bounded-mode branch selected by the new flag; unbounded behavior is preserved byte-for-byte when the flag is off.
- **Reveal/clarification accessor (new, same module)**: Given the same `summary` object, returns the complete target list independent of the bounded line's truncation.
- **`policy-plan.ts` registry entry (extended)**: `runtime.opencode-compiled-route.v1` block registration, hashing the full target list from `summary.targets` regardless of render mode.

### Data Flow
1. The existing advisor response path produces `response.metadata?.compiledRouteSummary` unchanged.
2. `renderCompiledRouteSummaryLine` checks the independent flag: off -> legacy unbounded render (unchanged); on -> bounded render with `+K more` and a content digest of the full list.
3. The reveal accessor, called separately (not part of the per-turn render path), returns the complete target list from the same `summary` object when explicitly invoked.
4. `policy-plan.ts` records the `runtime.opencode-compiled-route.v1` receipt using the full (untruncated) target list as the hash input, independent of which render mode produced the emitted line.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase 001's `policy-plan.ts` registry and receipt builder are available to extend
- [ ] Capture the target-count distribution from phase 001's fixture data to choose the bounding cap

### Phase 2: Core Implementation
- [ ] Add the independent flag read (off by default) to `mk-skill-advisor.js`'s existing options loading path
- [ ] Implement the bounded-mode branch in `renderCompiledRouteSummaryLine` (`+K more` marker plus content digest)
- [ ] Implement the reveal/clarification accessor returning the full target list
- [ ] Register `runtime.opencode-compiled-route.v1` in `policy-plan.ts`, hashing the full target list

### Phase 3: Verification
- [ ] Add a fixture with a target list larger than the cap; assert every original name is present in the bounded line or recoverable via the reveal path
- [ ] Add a flag-off parity fixture asserting byte-identical output to the phase 001 unbounded baseline
- [ ] Add a digest-stability fixture pair (unchanged target set -> stable digest; changed target set -> changed digest)
- [ ] Run the plugin test suite and confirm no regression in existing `mk-skill-advisor.test.cjs` cases
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Parity | Flag-off output byte-identical to unbounded baseline | Node test runner (`mk-skill-advisor.test.cjs`) |
| Unit | Bounded-mode rendering, `+K more` marker, digest computation | Node test runner |
| Recoverability | Reveal path returns every name a bounded line omits | Node test runner |
| Regression | Existing route/outcome fields unaffected by bounding | Node test runner |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase `001-measurement-and-receipts-foundation` (`policy-plan.ts` registry) | Internal | Blocked until 001 ships | Cannot register `runtime.opencode-compiled-route.v1` or prove parity through a receipt |
| `mk-skill-advisor.js` compiled-route response shape (`response.metadata?.compiledRouteSummary`) | Internal | Green | Bounding has nothing to bound |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fixture shows a required target name lost with no reveal-path recovery, the flag-off path diverges from the unbounded baseline, or the digest is unstable for an unchanged target set.
- **Procedure**: Disable the independent flag (default-off already) and revert the bounded-mode branch in `renderCompiledRouteSummaryLine`; the unbounded legacy path is untouched by this phase's changes and requires no separate restoration.
<!-- /ANCHOR:rollback -->
