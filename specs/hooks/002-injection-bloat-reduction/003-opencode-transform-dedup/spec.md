---
title: "Feature Specification: OpenCode Transform Dedup"
description: "Planning spec: stable-message-identity dedup of OpenCode same-message system transforms across mk-skill-advisor.js and mk-spec-memory.js, enabled only after phase 001 ships stable message identity and multi-transform receipts."
status: in_progress
completion_pct: 85
trigger_phrases:
  - "opencode transform dedup"
  - "same message system transform dedup"
  - "stable message identity opencode"
importance_tier: "important"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/003-opencode-transform-dedup"
    last_updated_at: "2026-08-07T04:16:20Z"
    last_updated_by: "codex"
    recent_action: "Reconciled the verified identity/dedup implementation and residual adversarial coverage"
    next_safe_action: "Complete the remaining adversarial-table and P1 evidence rows before activation review"
    blockers:
      - "The generic adversarial table remains incomplete beyond the covered fallback delimiter collision"
    key_files:
      - ".opencode/plugins/mk-skill-advisor.js"
      - ".opencode/plugins/mk-spec-memory.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-003"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Feature Specification: OpenCode Transform Dedup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In progress (identity/dedup verified; adversarial-table residual remains) |
| **Created** | 2026-08-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `002-opencode-route-line-bounding` |
| **Successor** | `004-full-first-route-only-repeats` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
OpenCode's `mk-skill-advisor.js` and `mk-spec-memory.js` each register an independent `experimental.chat.system.transform` handler that can append to `output.system` for the same user message, with no shared coordination proving whether a policy/advisor block was already delivered for that exact message. Research measured this as rank 3: "at least representative 806 B per duplicate, plus conditional additions," medium guardrail risk, OpenCode-scoped, "medium; receipt-gated GO." A naive fix - deduplicating on prompt-text hash alone - is an eliminated alternative: identical text can be a genuinely distinct user message (a user resending "yes" or "continue"), so content hashing alone would silently drop a delivery the guardrail contract requires. [SOURCE: research.md §9 Ranked Reductions, rank 3] [SOURCE: research.md Eliminated Alternatives - "Use prompt hash alone for OpenCode dedup"]

### Purpose
Deduplicate same-message OpenCode system-transform contributions using stable message identity (not content hash alone), so a second transform firing for the exact same message does not repeat an already-delivered policy/advisor block, while every distinct user message - even one with identical text to a prior message - still receives its own full delivery. This phase does not start until phase 001 ships stable message identity and multi-transform receipts, per the parent program's measurement-first discipline.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A stable message-identity resolver for OpenCode transforms, combining session ID, message/turn ID, and transform-call ordinal - never prompt-text content alone - shared by `mk-skill-advisor.js` and `mk-spec-memory.js`.
- Dedup logic: within one resolved message identity, a transform's system-block contribution that would duplicate an already-delivered block (matched via phase 001's canonical block IDs and content hash) is suppressed; the first contribution for that message identity is always delivered.
- Multi-transform receipts extending phase 001's receipt shape: per message identity, which transforms fired and what each contributed, so a suppression decision is auditable after the fact.
- An independent flag gating dedup, which this phase's implementation MUST NOT enable until phase 001's stable message identity and multi-transform receipts are shipped and green - a hard precondition, not a scheduling preference.

### Out of Scope
- Deduplicating across genuinely distinct user messages, even when their text is identical - explicitly ruled out by research.md's Eliminated Alternatives; a distinct message always receives its own delivery regardless of content match.
- Route-only repeat delivery or full-first lifecycle-replay policy (phase `004-full-first-route-only-repeats`).
- Bounding the compiled-route line's presentation (phase `002-opencode-route-line-bounding`; this phase consumes its registry entry but does not change its rendering).
- Any non-OpenCode runtime - same-message multi-transform duplication is an OpenCode-specific architecture consequence.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/lib/opencode-message-identity.js` | Create | Shared stable message-identity resolver and dedup-state tracker |
| `.opencode/plugins/mk-skill-advisor.js` | Modify | Consume the shared resolver; check/register dedup state before appending system blocks |
| `.opencode/plugins/mk-spec-memory.js` | Modify | Consume the shared resolver; check/register dedup state before appending the continuity brief |
| `.opencode/plugins/tests/mk-skill-advisor.test.cjs` | Modify | Add same-message dedup and distinct-message non-dedup cases |
| `.opencode/plugins/tests/mk-spec-memory.test.cjs` | Modify | Add same-message dedup and distinct-message non-dedup cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Dedup never fires without stable message identity | Dedup logic is unreachable/no-op unless a resolved message identity (session + message/turn ID + ordinal) is present; falls back to full delivery when identity cannot be resolved |
| REQ-002 | A distinct user message with identical text to a prior message still receives full delivery | A fixture sends the same text as two separate resolved message identities; both receive the full block, none suppressed |
| REQ-003 | A genuine same-message duplicate transform contribution is suppressed | A fixture with two transforms firing for one resolved message identity shows the second transform's duplicate block suppressed and logged as such |
| REQ-004 | Dedup does not activate until phase 001's stable identity and multi-transform receipts are shipped and green | Implementation for this phase cannot begin (per `tasks.md` Phase 2 dependency) until phase 001's identity/receipt infrastructure exists |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Multi-transform receipts record which transforms fired and what each contributed, per message identity | A fixture with two transforms firing for one message identity produces a receipt listing both transforms and their delivery/suppression outcome |
| REQ-006 | Dedup is gated by an independent flag, off by default | With the flag off, both transforms fire and append independently exactly as before this phase |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A same-message duplicate fixture shows the second transform's block suppressed while the first is delivered in full.
- **SC-002**: A distinct-message-identical-text fixture shows both messages receiving full, undeduplicated delivery.
- **SC-003**: With the flag off, `mk-skill-advisor.test.cjs` and `mk-spec-memory.test.cjs` show byte-identical output to their pre-change baselines.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A distinct repeated user message (identical text) is incorrectly suppressed | Would silently drop a required delivery, repeating the exact failure mode the Eliminated Alternatives section rules out | REQ-002/SC-002 fixture is a hard gate; identity resolution never falls back to content hash alone |
| Risk | Message/turn ID is unavailable or unstable in some OpenCode session shapes | Dedup would either misfire or need to no-op | REQ-001 requires a no-op fallback to full delivery when identity cannot be resolved - fail-open, matching the parent program's guardrail-preserving principle |
| Dependency | Phase `001-measurement-and-receipts-foundation`'s stable message identity and multi-transform receipts | Without them there is no proof a suppression decision was correct | This phase's implementation is explicitly blocked on 001 per REQ-004 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What OpenCode session/event fields provide a stable message/turn identity in production (message ID, event sequence number, or a synthesized ordinal)? Resolved during phase 001's fixture work, consumed here.
- Should dedup scope be per-session-lifetime or per-lifecycle-epoch (aligning with phase 004's epoch model)? Decided during implementation once phase 004's epoch design is available for cross-check.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Program Parent**: See `../spec.md`
- **Predecessor Phase**: See `../002-opencode-route-line-bounding/spec.md`
- **Research Source**: See `../../001-per-prompt-injection-audit/research/research.md`

<!-- /ANCHOR:related-docs -->
