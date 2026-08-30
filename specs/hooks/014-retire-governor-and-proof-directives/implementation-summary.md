---
title: "Implementation Summary: Retire the Governor and Proof-Over-Appearance Directives"
description: "Two constant directives removed from the canonical renderer and both fallback emitters; the one with an enforcing gate stays."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/014-retire-governor-and-proof-directives"
    last_updated_at: "2026-08-30T18:28:13Z"
    last_updated_by: "template-author"
    recent_action: "Removed both directives across all runtimes and updated every assertion"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-retire-governor-and-proof-directives"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Level** | 2 |
| **Date** | 2026-08-30 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two of the three constant directives are gone from every runtime. `mcp-server/lib/render.ts` lost both
constants and the concatenation that appended them; `mcp-server/lib/policy-plan.ts` lost their block
registrations, their stable ids, and the recovery branches that rebuilt them from rendered text.

The two fallback emitters — `plugin-bridges/system-skill-advisor-bridge.mjs` and `.opencode/plugins/system-skill-advisor.js` — mattered more than the canonical owner. Each carries its own literal
copy for when the compiled module is unavailable, so removing the exported symbols alone would
have left every runtime still injecting on its fallback path. The search that proved the removal
therefore matched literal directive text, not symbol names.

Pi needed no edit: `hooks/pi/prompt-advisor.ts` forwards the shared context rather than owning a copy, which was
verified rather than assumed.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Canonical owner first, then the mirrors, then the assertions — with the suites run in between so
the failures were observed rather than predicted. Twenty-five assertions failed at that midpoint,
which is what confirmed the removal reached the delivery path.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

**The hygiene directive stays.** It is not the same kind of thing: it names one prohibition and a
pre-commit gate rejects commits that violate it. A rule with an enforcer earns its place every
turn; a disposition already carried by the system prompt does not.

**Tests were re-pointed, not deleted.** Several asserted a retired directive as a proxy for "the
directive block was delivered at all". Deleting them would have dropped delivery coverage
entirely, so each now asserts the surviving directive.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Repository search for either directive's literal text | No hit in source, tests, fixtures or docs |
| Compiled renderer exports | `DIRECTIVES_LABEL`, `HYGIENE_DIRECTIVE` — nothing else directive-shaped |
| Negative control | 25 assertions failed against the un-updated tests, confirming the removal reached delivery |
| Advisor suites (legacy, hooks, compat, policy-plan, plugin) | 137/137 |
| OpenCode plugin suite | 28/28 |
| `tsc` | 0 errors |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A live end-to-end hook run could not be captured.** The advisor daemon cold-started and the hook failed open with `{}` (`CHILD_TIMEOUT`), which is its documented behaviour and is pinned by an existing test. The compiled renderer's exports were inspected directly instead.
2. **Archived benchmark reports still contain the old directive text.** They are dated records of past runs and were deliberately not rewritten.
<!-- /ANCHOR:limitations -->
