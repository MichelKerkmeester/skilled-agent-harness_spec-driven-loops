---
title: "Verification Checklist: All-surface guarded proxy + openDesignDesignPrecondition contract"
description: "P0/P1/P2 verification items for references/guarded_proxy.md and its policy block, including the three acceptance conditions and the evergreen [HARD] check."
trigger_phrases:
  - "guarded proxy checklist"
  - "opendesigndesignprecondition checklist"
  - "all-surface gate checklist"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: All-surface guarded proxy + openDesignDesignPrecondition contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Token boundary contract read and understood as the validity authority the precondition delegates to
  - **Evidence**: cite `design_proof_token.md` §6 (boundary) + §7 (acceptance)
- [ ] CHK-002 [P0] Tool inventory + classification grounded before authoring
  - **Evidence**: cite `tool_surface.md` §2 (11 read-only / 5 mutating / 2 destructive) + §3 (surface/gate/omit)
- [ ] CHK-003 [P1] Convergent-chokepoint evidence captured
  - **Evidence**: SKILL.md:209 (one daemon, four surfaces) + `design_gate` prose (SKILL.md:164–175)

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `guarded_proxy.md` markdown is valid; all nine sections present and ordered
  - **Evidence**: markdown lint clean; section headings 1–9 enumerated
- [ ] CHK-011 [P0] Embedded JSON policy block parses
  - **Evidence**: `jq` over the fenced JSON block exits 0
- [ ] CHK-012 [P1] Internal references resolve
  - **Evidence**: relative links to `design_proof_token.md` and `tool_surface.md` resolve; cited section names exist
- [ ] CHK-013 [P1] Doc follows `mcp-open-design/references/` style and frontmatter conventions
  - **Evidence**: matches sibling refs (e.g., `tool_surface.md`) frontmatter + heading shape

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] ACCEPTANCE — a design-feeding/mutating call WITHOUT a valid fresh token is DENIED on every wired surface (MCP, HTTP, CLI, Skills)
  - **Evidence**: each surface adapter routes through the precondition; deny path stated per surface
- [ ] CHK-021 [P0] ACCEPTANCE — a pure-transport exempt call PASSES (is not blocked)
  - **Evidence**: allowlist entry traced through to a pass decision; legitimate non-design transport not blocked
- [ ] CHK-022 [P0] ACCEPTANCE — the daemon-side residual is NAMED as out of scope, not silently passed
  - **Evidence**: residual section names raw-HTTP-port + in-app Skills-UI bypass; cause = bundled daemon unmodifiable
- [ ] CHK-023 [P0] Deny-by-default holds — an unlisted/unknown tool defaults to GUARDED, not exempt
  - **Evidence**: contract states unlisted → GUARDED; exemption is a positive allowlist
- [ ] CHK-024 [P1] Classifier completeness — every tool in `tool_surface.md` §2 maps to GUARDED or EXEMPT
  - **Evidence**: policy-block tool set diffed against the §2 inventory; no tool unclassified

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Precondition delegates token validity to the `DESIGN_PROOF_TOKEN` boundary contract (does NOT re-define token internals)
  - **Evidence**: precondition references `design_proof_token.md` §6/§7; no duplicated/weakened token rules
- [ ] CHK-031 [P0] Surface-binding check present — `boundSurface` must match the canonical request's target surface (cross-surface replay defense)
  - **Evidence**: precondition rejects token minted for surface A used on surface B
- [ ] CHK-032 [P0] Fail-closed semantics — missing token, unreadable input, validator exception, or ambiguous classification → DENY
  - **Evidence**: explicit fail-closed clause in the precondition section
- [ ] CHK-033 [P1] Request-normalization is lossless on security-relevant fields across all four surfaces
  - **Evidence**: canonical shape carries surface, tool, mutation class, `feedsDesignDecision`, target, token, payload digest inputs

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] Evergreen [HARD] — no spec/packet/phase IDs or spec paths in `guarded_proxy.md` or its policy block
  - **Evidence**: `rg` for `specs/`, `NNN-`, phase tokens returns nothing in the authored doc
- [ ] CHK-041 [P1] Scope held — only `guarded_proxy.md` + its policy authored; `SKILL.md` not rewritten (optional one-line cross-link only)
  - **Evidence**: git diff touches the new doc (+ at most one SKILL.md anchor line)
- [ ] CHK-042 [P1] spec/plan/tasks synchronized with the final doc
  - **Evidence**: all three reflect the as-built contract

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp/working notes in scratch only
  - **Evidence**: no temp files outside scratch
- [ ] CHK-051 [P1] scratch cleaned before completion
  - **Evidence**: scratch folder empty

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 8 | 0/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: TBD (status: planned)
**Verified By**: TBD

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
Acceptance items: CHK-020, CHK-021, CHK-022. Evergreen [HARD]: CHK-040.
-->
