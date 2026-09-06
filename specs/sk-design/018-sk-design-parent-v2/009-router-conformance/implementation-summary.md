---
title: "Implementation Summary: router conformance"
description: "What shipped, what it cost, and what the gates could not have told anyone."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/009-router-conformance"
    last_updated_at: "2026-09-06T17:43:45Z"
    last_updated_by: "claude-code"
    recent_action: "Shipped the phase and verified it"
    next_safe_action: "None open for this phase"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/ROUTER.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-018-sk-design-parent-v2"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-router-conformance |
| **Completed** | 2026-09-06 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `sk-design` root router now reads like every other hub's.

### What was actually wrong

Nothing a gate could see. The root-router contract validator reports zero issues for all six hubs,
before and after this rewrite. It checks frontmatter, required sections and whether every resource
path resolves. It does not check the section skeleton, and that is where this file diverged: no
machine-readable section, no `DEFAULT_RESOURCE`, closing section numbered 3 where every peer numbers
it 4, and a prose paragraph where the peers carry a bulleted routing contract.

### The rewrite

The intent-model code block moved into `## 3. MACHINE-READABLE ROUTER (replay / benchmark source)`
with the note the peers carry about keeping prose and block in sync. `DEFAULT_RESOURCE` is declared
empty, with the reason written down. A new intent table names each of the five intents, its mode, and
what the request is asking for, because five intents across four modes is not obvious from keyword
lists. The closing section became four numbered and seven bulleted rules covering dominant intent,
near-ties, the same-mode tie that is specific to this hub, and the UNKNOWN fallback.

No `INTENT_SIGNALS` keyword and no `RESOURCE_MAP` path was touched.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/ROUTER.md` | Modified | 80 lines to 115: section skeleton, `DEFAULT_RESOURCE`, intent table, closing contract |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two conformant peers and the template were read first, because the convention is written in none of
them alone and no validator encodes it. Then the rewrite, then a rebuild and a replay to prove
nothing moved.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Conform to the peers rather than to the validator | The validator passes either way, which is how the divergence survived |
| Declare `DEFAULT_RESOURCE` though it is empty | A peer reader expects to find it; its absence reads as an omission |
| Add an intent table the peers do not have | Five intents across four modes is not legible from keyword lists |
| Touch no keyword and no path | Anything that moves routing belongs to a different phase |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Root-router contract validator | 0 issues |
| `RESOURCE_MAP` paths resolved against disk | 14 of 14 |
| Sixteen-phrase replay, generation 653 | Byte-identical to the closing-phase capture |
| Fleet metadata audit | 13/13 |
| Leaf-manifest freshness | 13 fresh |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Nothing enforces this convention.** The validator passed before and after. A future router can
   diverge exactly as this one did, and no gate will report it. Recorded as an open question rather
   than solved, because encoding a section skeleton in the contract is its own change.
2. **The intent table is this hub's addition.** No peer carries one, so a reader comparing routers
   will find this file slightly richer than the shape it conforms to.
<!-- /ANCHOR:limitations -->

---
