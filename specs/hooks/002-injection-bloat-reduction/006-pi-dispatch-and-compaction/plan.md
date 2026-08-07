---
title: "Implementation Plan: Pi Dispatch and Compaction"
description: "Plan to enumerate the five preserved Pi dispatch semantics, design a prototype-flag-gated compact directive candidate, and a compaction-aware dedup reset, while the full directive stays the fail-open fallback."
trigger_phrases:
  - "pi dispatch directive plan"
  - "compact pi arbitration plan"
  - "pi compaction dedup reset"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/006-pi-dispatch-and-compaction"
    last_updated_at: "2026-08-06T00:00:00Z"
    last_updated_by: "opus"
    recent_action: "Authored the implementation plan for Pi dispatch directive compaction"
    next_safe_action: "Begin Phase 1 (semantics enumeration) once Phase 001 receipts land"
    blockers:
      - "001-measurement-and-receipts-foundation has not yet been built"
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-006"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Pi Dispatch and Compaction

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | system-skill-advisor Pi hook adapter (`prompt-advisor.ts`) |
| **Storage** | In-memory/session-scoped dispatch dedup state; no database |
| **Testing** | Existing Pi advisor test suite; new five-semantics matrix and fail-open negative control |

### Overview
Enumerate the five dispatch semantics an eliminated 130-byte reminder lost (native default, explicit current-turn override, preload, anti-signal, child exclusion), map each to a test case, and design a prototype-flag-gated compact directive candidate for `PI_SUBAGENT_DISPATCH_DIRECTIVE` in `prompt-advisor.ts`. The candidate stays shadow-only until executed and measured; the full 554-byte directive remains the unconditional fallback on every Pi advisor-failure path. A compaction-aware dedup reset ensures a Pi compact/session boundary always triggers full-directive replay on the next turn.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (compact Pi dispatch directive, prototype-only, fail-open preserved)
- [x] Success criteria measurable (semantics-to-test mapping, shadow-diff, executed byte count, fail-open negative control)
- [x] Dependencies identified (Phase 001 receipts; the five eliminated semantics from research.md)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001 through REQ-006)
- [ ] Tests passing (five-semantics matrix, fail-open negative control)
- [ ] Docs updated (spec/plan/tasks/checklist/implementation-summary, this packet)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Prototype-flag-gated candidate with a fail-open fallback: a shorter directive candidate exists behind an independent flag; the existing full directive is the unconditional default whenever the candidate is off, unproven, or the Pi advisor itself fails.

### Key Components
- **Five-semantics matrix (design artifact, not yet code)**: Native default, explicit current-turn override, preload, anti-signal, child exclusion, each mapped to a concrete test case.
- **Compact directive candidate (new, `prompt-advisor.ts`)**: A shorter serializer behind a prototype flag, shadow-only until executed and measured against the matrix.
- **Compaction-aware dedup reset (new, `prompt-advisor.ts`)**: Detects a Pi compact/session boundary and clears dispatch delivery state so the next turn replays the full directive.
- **Fail-open fallback (existing, unchanged)**: `PI_SUBAGENT_DISPATCH_DIRECTIVE` continues to emit in full whenever the Pi advisor fails, regardless of the prototype flag's state.

### Data Flow
1. A non-empty parent input reaches the Pi advisor; the existing full directive emits by default.
2. If the prototype flag is on and the advisor succeeds, the candidate directive is shadow-evaluated alongside the real emission, logging its would-be output without changing what is sent.
3. On a detected compaction/session boundary, dispatch dedup state clears and the next turn replays the full directive regardless of flag state.
4. If the Pi advisor fails at any point, the full directive emits unconditionally, independent of the prototype flag.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Enumerate the five preserved dispatch semantics from `prompt-advisor.ts` and the research's eliminated-alternatives entry
- [ ] Map each semantic to a concrete test case
- [ ] Locate the exact `PI_SUBAGENT_DISPATCH_DIRECTIVE` emission site and the advisor-failure fallback path

### Phase 2: Core Implementation
- [ ] Draft the compact directive candidate design (not yet executed) against the five-semantics matrix
- [ ] Design the prototype flag and its shadow-only evaluation path
- [ ] Design the compaction-aware dedup reset

### Phase 3: Verification
- [ ] Build and execute the shadow-mode prototype; confirm zero output diff against the 554 B baseline while off
- [ ] Run the five-semantics test matrix against the executed candidate
- [ ] Run the fail-open negative control with the prototype flag both on and off
- [ ] Record the executed byte count and compare it against the 177 B ceiling and 424 B modeled saving
- [ ] Document the per-block rollback (disable prototype flag, clear dedup state, full 554 B directive)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Semantics matrix | Native default, explicit current-turn override, preload, anti-signal, child exclusion | Existing Pi advisor test runner |
| Negative control | Advisor-failure fallback with prototype flag on and off | Existing Pi advisor test runner |
| Shadow parity | Candidate output vs. actual 554 B baseline | Shadow receipt diff |
| Compaction reset | Dedup state clears on compact/session boundary | New regression test |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001-measurement-and-receipts-foundation | Internal (sibling phase) | Not yet built | This candidate cannot activate without shared receipt fields; semantics-mapping and design can proceed now |
| research.md Eliminated Alternatives (five lost semantics) | Internal (research artifact) | Available | None; this is the acceptance-gate source of truth |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any of the five semantics regresses, the fail-open fallback stops emitting on advisor failure, or shadow-mode output diff is non-empty.
- **Procedure**: Disable the prototype flag, clear dispatch dedup state, and confirm the directive returns to the full 554 B baseline on every non-empty parent input.
<!-- /ANCHOR:rollback -->
