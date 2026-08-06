---
title: "Implementation Summary: OpenCode Transform Dedup"
description: "Planned, not yet built. This packet documents the intended stable-message-identity resolver, same-message dedup, and multi-transform receipts ahead of implementation."
trigger_phrases:
  - "transform dedup not yet built"
  - "message identity resolver placeholder"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/003-opencode-transform-dedup"
    last_updated_at: "2026-08-06T00:00:00Z"
    last_updated_by: "opus"
    recent_action: "Authored the forward-looking not-yet-built implementation placeholder"
    next_safe_action: "Implement opencode-message-identity.js per plan.md Phase 2 once phase 001 ships"
    blockers:
      - "Blocked on phase 001 shipping stable message identity and multi-transform receipts"
    key_files:
      - ".opencode/plugins/mk-skill-advisor.js"
      - ".opencode/plugins/mk-spec-memory.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-003"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary: OpenCode Transform Dedup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-opencode-transform-dedup |
| **Completed** | Not yet completed - planning only |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This packet is a planning spec: `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` describe the intended shared stable-message-identity resolver (`opencode-message-identity.js`), its consumption by `mk-skill-advisor.js` and `mk-spec-memory.js`, the same-message dedup gate, and the multi-transform receipt extension. None of these changes exist on disk yet, and this phase's implementation is explicitly blocked on phase `001-measurement-and-receipts-foundation` shipping stable message identity and multi-transform receipts first.

### Planned Files (not yet created)

| File | Planned Action | Purpose |
|------|-----------------|---------|
| `.opencode/plugins/lib/opencode-message-identity.js` | Create | Shared stable message-identity resolver and dedup-state tracker |
| `.opencode/plugins/mk-skill-advisor.js` | Modify | Consume the resolver; suppress genuine same-message duplicates |
| `.opencode/plugins/mk-spec-memory.js` | Modify | Consume the resolver; suppress genuine same-message duplicates |
| `.opencode/plugins/tests/mk-skill-advisor.test.cjs` | Modify | Dedup and non-dedup fixture cases |
| `.opencode/plugins/tests/mk-spec-memory.test.cjs` | Modify | Dedup and non-dedup fixture cases |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not applicable yet. `plan.md` section 4 lays out the intended delivery order: (1) confirm phase 001's identity/receipt infrastructure is shipped and green, and inventory both transform call sites' available session/message/turn fields, (2) build the shared resolver and dedup-state tracker and wire both plugins to it behind an independent flag, (3) prove same-message suppression, distinct-message non-suppression, fail-open on unresolved identity, and flag-off parity with fixtures, then run both plugin test suites. When implementation lands, this section will be rewritten to describe what was actually delivered, replacing this forward-looking description.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Identity from session + message/turn ID + ordinal, never prompt text | Research.md's Eliminated Alternatives explicitly rules out content-hash-alone dedup - identical text can be a genuinely distinct message |
| Fail-open (no suppression) when identity cannot be resolved | Matches the parent program's guardrail-preserving principle; an unresolvable identity must never become an excuse to drop a delivery |
| Shared resolver module consumed by both plugins, not duplicated logic | A cross-plugin duplicate can only be detected if both plugins check the same dedup state; independent per-plugin implementations could not see each other's deliveries |
| Hard-block this phase's implementation start on phase 001 | Dedup without stable identity/receipt infrastructure would be exactly the ruled-out content-hash approach in a different location |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Same-message duplicate suppression fixture in `mk-skill-advisor.test.cjs` | Not yet run |
| Distinct-message-identical-text non-suppression fixture in `mk-skill-advisor.test.cjs` | Not yet run |
| Identity-resolution-failure fail-open fixture in `mk-spec-memory.test.cjs` | Not yet run |
| Flag-off byte-identical parity fixture in `mk-spec-memory.test.cjs` | Not yet run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This is a planning artifact, not a shipped fix.** No code exists yet; every row above is a planned action, not a completed one.
2. **This phase is hard-blocked on phase `001-measurement-and-receipts-foundation`.** Implementation cannot begin - not just cannot activate - until stable message identity and multi-transform receipts exist.
3. **The exact OpenCode field(s) that provide a stable message/turn identity are not confirmed yet.** `spec.md` §7 leaves this open, to be resolved from phase 001's fixture work.
<!-- /ANCHOR:limitations -->
