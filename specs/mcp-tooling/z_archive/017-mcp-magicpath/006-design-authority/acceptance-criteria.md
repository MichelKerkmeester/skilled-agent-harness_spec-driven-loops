---
title: "Acceptance Criteria: Design authority for mcp-magicpath"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/017-mcp-magicpath/006-design-authority"
    last_updated_at: "2026-08-29T19:20:00Z"
    last_updated_by: "session"
    recent_action: "Closed the design-authority criteria against observed output"
    next_safe_action: "None; the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: Design authority for mcp-magicpath

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** mcp-tooling/017-mcp-magicpath/006-design-authority
**Level:** 2
**Status:** Complete
**Date:** 2026-08-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given any MagicPath request, When the packet is entered, Then the design authority is already loaded | Phase detection opens with `STEP 0: Adopt the design agent persona and load sk-design [MANDATORY, UNCONDITIONAL]`, ahead of both wiring and intent scoring; the loading table gained its first `ALWAYS` row | Met | - |
| AC-002 | REQ-002 | Given a write-capable persona, When it is adopted, Then the packet gains no write authority | Frontmatter still reads `allowed-tools: [Read, Bash, Grep, Glob, mcp__code_mode__call_tool_chain]`; the registry still reports `forbidden: ["Write","Edit","Task"]` with `mutatesWorkspace: false` | Met | - |
| AC-003 | REQ-003 | Given the registered surface, When the binding lands, Then the callables are unchanged | The emitter declares the same 14 tools after the change: `info,whoami,search_components,inspect_component,list_projects,list_components,list_teams,list_members,list_themes,get_theme,list_installed,selection,active_project,share_link` | Met | - |
| AC-004 | REQ-004 | Given the hub prose, When one transport's pairing diverges, Then no sentence still claims one pairing for all four | Pattern sweep over `README.md`, `SKILL.md` and `ROUTER.md` returned `0` matches for all three invalidated claims | Met | - |
| AC-005 | REQ-005 | Given the registry, When a reader looks up this mode's design partner, Then it resolves without reading prose | Not achievable. A bisect holding the pre-change registry constant showed the version bump and the axis rewrite both compile (hashes `80619309e451`, `0ed833d76d9f`) while any `crossHubPairing` entry yields `compile-error` with a null policy hash, including a bare `{"mcp-magicpath": "sk-design"}` | Superseded | ADR-001 |
| AC-006 | REQ-006 | Given the sibling convention, When this mode departs from it, Then the reason is recorded where the reader meets it | Stated in `references/design-authority.md` §3, the packet `SKILL.md` cross-workflow contracts, the hub axis description, and both changelog entries | Met | - |
| AC-007 | REQ-007 | Given the aggregation directory, When a reader looks for this mode, Then it is there and its neighbours still work | `mcp-magicpath -> ../../skills/mcp-tooling/mcp-magicpath/changelog` lists `v1.0.0.0.md` and `v1.1.0.0.md` | Met | - |
| AC-008 | REQ-008 | Given the leaf manifest, When the packet gains a reference, Then the manifest is regenerated rather than authored | Audit observed failing first: `STALE_GENERATED_FILE ... committed=26157199 fresh=e7efd9b6`, `passed=13 failed=1`; then `--fix` reported `fixed=1` and the clean re-run reported `checked=14 passed=14 failed=0 fixed=0` | Met | - |
| AC-009 | REQ-009 | Given the aggregation directory, When every hub member is looked for, Then each one is present | All ten entries resolve after adding `mcp-notion` (1 file) and `mcp-obsidian` (20 files) per ADR-004 | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Eight criteria are met against observed output and one is superseded by ADR-001, which names the compiler constraint that makes it unachievable rather than merely unfinished.

The superseded row is the one worth reading. This phase treated `"crossHubPairing": {}` as a gap, closed it, recorded the criterion as met, and was wrong: a pre-push gate refused the change, a bisect isolated the field, and the consuming compiler's own comment recorded both the deliberate emptying and the over-routing incident behind it. The criterion is superseded rather than quietly rewritten so the mistake stays legible.

Every other criterion is met against observed output rather than intent. The authority question that opened the phase was settled before any rule was written, and the settlement is verifiable: the permission list and the tool count are identical either side of the change, so adopting a write-capable persona demonstrably widened nothing.

What this phase does not establish is that the contract is obeyed at runtime. Every check here reads final state; none observes an agent actually loading the skill the contract names. That gap is real, is recorded as the first known limitation, and is the reason no criterion claims the pairing is enforced.
<!-- /ANCHOR:closure -->
