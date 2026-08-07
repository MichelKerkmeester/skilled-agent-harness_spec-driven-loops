---
title: "Feature Specification: Measurement & Receipts Foundation"
description: "Planning spec: add a runtime-neutral shadow planner beside render.ts with canonical block IDs, privacy-safe content/policy-set hashes, and delivery-receipt fields, proven against byte-stable parity fixtures across all six runtime serializers with zero output change."
status: planned
completion_pct: 0
trigger_phrases:
  - "measurement and receipts foundation"
  - "shadow planner canonical block ids"
  - "delivery receipt hashes injection bloat"
importance_tier: "important"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/001-measurement-and-receipts-foundation"
    last_updated_at: "2026-08-06T00:00:00Z"
    last_updated_by: "opus"
    recent_action: "Authored the planning spec for the measurement-and-receipts foundation phase"
    next_safe_action: "Author plan.md phase breakdown for the shadow planner and parity fixtures"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
      - ".opencode/specs/hooks/001-per-prompt-injection-audit/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-001"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Measurement & Receipts Foundation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-08-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | None (first phase of this program) |
| **Successor** | `002-opencode-route-line-bounding` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
No canonical, cross-runtime identity exists for the always-on directive, route, Gate, and Pi-dispatch blocks that `render.ts` and its six runtime adapters emit, and nothing records whether a block was actually delivered versus merely rendered. Every later reduction candidate (bounding the OpenCode compiled-route line, deduplicating same-message transforms, shipping route-only repeats, suppressing an open Gate epoch) needs a receipt to gate its activation on, or it risks silently dropping a guardrail the way an unconditional directive removal would. The `hooks/001` research ranked this candidate #1 with zero direct byte savings precisely because it is the hard prerequisite for every candidate ranked below it. [SOURCE: research.md §9 Ranked Reductions, rank 1] [SOURCE: research.md §10 Target Architecture]

### Purpose
Ship a shadow-only, privacy-safe measurement layer — canonical block IDs, a content hash and an ordered policy-set hash, delivery-receipt fields, and byte-stable parity fixtures across all six native serializers — with zero change to what any runtime actually emits, so phases 002-004 (and the later Gate/Pi/activation phases in the parent's map) have a receipt to gate their own activation on instead of shipping on assumption.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A runtime-neutral planner module beside `render.ts` that returns the ordered stable+dynamic block list for a delivery, with immutable per-block identities: `policy.comment-hygiene.v1`, `route.advisor.v1`, `gate.spec-folder-question.v1`, `runtime.pi-dispatch.v1`, and the remaining inventoried blocks from research.md §3 (governor, proof-over-appearance, SessionStart, OpenCode continuity, OpenCode compiled route) as extensions of the same ID scheme.
- A content hash (per block) and an ordered policy-set hash (per whole delivery) computed strictly from block ID + block content + block order — never from raw prompt text, file paths, or session identifiers.
- A delivery-receipt record shape: shadow ID, planned hash, emitted hash, exact byte count, lifecycle epoch, transform/message identity (where a runtime has one), and host-receipt status.
- Byte-stable parity fixtures for all six native serializers (Claude-derived envelopes for Claude Code/Codex/Devin, Cursor's configured `beforeSubmitPrompt` shape, OpenCode's `output.system` transform shape, and Pi's input-transform shape), each covering first-delivery, repeat, Gate-emitting, read-only, and failure/fallback cases.
- Shadow-only wiring: the planner computes and records a receipt beside each existing render/hook call site without its result being consumed by the emitted output.

### Out of Scope
- Any change to what a runtime actually receives - that begins at phase `002-opencode-route-line-bounding` and is explicitly gated on this phase's receipts.
- Bounding or digesting the OpenCode compiled-route line (phase 002).
- Deduplicating OpenCode same-message transforms (phase 003).
- Route-only repeat delivery or lifecycle-epoch suppression (phase 004).
- Measuring or claiming provider prompt-cache hits, retention, or billed-input savings - research.md §8 and §15 rule this out as a lever for this program; the planner records bytes and hashes, not cache state.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts` | Create | Canonical block registry, content/policy-set hashers, and delivery-receipt builder |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts` | Modify | Add a shadow-only call to the planner after the existing render path; no return-value consumption |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/policy-plan.vitest.ts` | Create | Unit tests for block IDs, hash purity, and receipt shape |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/parity/policy-plan-serializer-parity.vitest.ts` | Create | Byte-stable parity assertions across the six native serializers |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/parity/fixtures/policy-plan/` | Create | Fixture payloads per runtime x {first, repeat, Gate, read-only, failure} |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Canonical block IDs exist for the four named blocks and are extensible to the remaining inventoried blocks | `policy-plan.vitest.ts` asserts `policy.comment-hygiene.v1`, `route.advisor.v1`, `gate.spec-folder-question.v1`, and `runtime.pi-dispatch.v1` are stable exported string constants |
| REQ-002 | Content hash and ordered policy-set hash never embed raw prompt text, file paths, or session identifiers | An adversarial fixture feeds a prompt containing a path and a session token; the test asserts neither appears in the hashed input serialization |
| REQ-003 | The delivery-receipt record captures all seven required fields | A schema/type test enumerates shadow ID, planned hash, emitted hash, byte count, lifecycle epoch, transform/message identity, and host-receipt status, and rejects a receipt missing any one |
| REQ-004 | The shadow planner produces zero output diff against current renderer behavior | Parity fixtures across first/repeat/Gate/read-only/failure cases show emitted bytes identical to the pre-change baseline for all six runtimes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Byte-stable parity fixtures exist for all six native serializers | Fixture directory contains a case set for Claude, Codex, Devin, Cursor, OpenCode `output.system`, and Pi input transforms |
| REQ-006 | Configured vs. observed delivery lanes are recorded separately per runtime | A receipt for a configured-but-unobserved lane (e.g. Cursor's untested `beforeSubmitPrompt`) is never reported with the same host-receipt status as an observed one |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A diff-based regression proves render.ts's actual emitted string is byte-identical pre- and post-change across the full fixture matrix.
- **SC-002**: The planner unit suite and the parity suite both pass, covering every case named in REQ-004/REQ-005 (exact test count is fixed at implementation time by the case matrix, not pre-declared here).
- **SC-003**: The raw-data-leakage adversarial negative control (REQ-002) fails before the allow-list is enforced and passes after, proving the control is real.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A future call site lets the shadow planner's result leak into the real renderer output | Would silently change delivered bytes with no negative control caught it first | Keep the call site additive/read-only (no return-value consumption) and cover with SC-001's diff regression on every fixture case |
| Risk | Hash inputs accidentally include raw session state | Would violate the privacy-safe requirement and could leak paths/session IDs into a shadow log | REQ-002 adversarial fixture; explicit allow-list of hashed fields (block ID + content + order only) |
| Dependency | `render.ts`'s existing directive constants and the Gate/Pi owners named in research.md §3 remain the content source of truth | If the planner forks the content instead of wrapping the existing constants, the two can drift silently | Import the existing constants/owners directly; the planner computes identity and hashes over their current output, it does not redefine the text |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which runtimes expose a real host-delivery receipt today versus needing a shadow/behavioral-probe harness first? This phase's fixture matrix is expected to answer it per runtime, not resolve it in advance.
- What exact signal counts as a "host receipt" per runtime (envelope acknowledgement vs. a pinned behavioral probe) - resolved during implementation against each runtime's adapter, not blocking this shadow-only ship.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Program Parent**: See `../spec.md`
- **Research Source**: See `../../001-per-prompt-injection-audit/research/research.md`

<!-- /ANCHOR:related-docs -->
