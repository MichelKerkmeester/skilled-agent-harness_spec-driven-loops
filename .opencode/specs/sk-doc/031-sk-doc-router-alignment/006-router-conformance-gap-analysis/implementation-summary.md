---
title: "Implementation Summary: create-skill router-marker conformance gap analysis"
description: "Live per-packet analysis of the create-skill smart-router-marker gap: 2 of 10 packets carry the keyed-discovery mechanism, 8 warn, and every warning is a documented posture (flat resources → honest N/A note) rather than a defect. Includes the keep-vs-wire decision framing and recommendation."
trigger_phrases:
  - "006 summary router marker gap analysis"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/018-sk-doc-router-alignment/006-router-conformance-gap-analysis"
    last_updated_at: "2026-07-13T14:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded per-packet conformance table + verdict + decision framing"
    next_safe_action: "Operator decision: keep N/A posture vs wire markers"
    blockers: []
    completion_pct: 100
    status: "Analysis complete — decision pending"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|-------|-------|
| **Packet** | 006 — create-skill router-marker conformance gap analysis |
| **Status** | Analysis complete — decision pending |
| **Parent** | `sk-doc/018-sk-doc-router-alignment` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A per-packet conformance analysis of all ten `create-*` packets, scored from live `package_skill.py --check --json` output on three axes: does the packet carry the create-skill keyed-discovery **mechanism** (`discover_markdown_resources` / `_guard_in_skill` / `UNKNOWN_FALLBACK`); does it carry an honest **N/A note**; does the advisory **marker warning** fire.

| Packet | Mechanism | N/A note | Marker warning | Errors |
|---|---|---|---|---|
| create-skill | Yes (canon) | n/a | No | 0 |
| create-flowchart | Yes | n/a | No | 0 |
| create-readme | No | Yes (precedent) | Yes | 0 |
| create-agent | No | Yes | Yes | 0 |
| create-command | No | Yes | Yes | 0 |
| create-feature-catalog | No | Yes | Yes | 0 |
| create-manual-testing-playbook | No | Yes | Yes | 0 |
| create-changelog | No | Yes | Yes | 0 |
| create-quality-control | No | Yes | Yes | 0 |
| create-benchmark | No | Documented exception (word cap) | Yes | 0 |

**Key facts:** every packet has `errors: 0` → `--check` PASS. Two packets carry the mechanism. Eight emit the marker warning; seven of those carry an explicit N/A note and the eighth (create-benchmark) documents the absence via its family-router table under the 5000-word cap.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read-only. The checker was run across all ten packet folders and the JSON results tabulated by hand; the N/A note was confirmed present on disk in the flat-resource packets (spot-checked create-agent and create-readme). No `SKILL.md`, hub-router, or advisor-registry file was modified.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

The pending decision is **keep the N/A posture vs wire the markers**:

| Option | What it does | Cost | Honesty |
|---|---|---|---|
| **A. Keep N/A posture (recommended)** | Leave the eight packets as-is; the advisory warning stays, explained by each packet's N/A note. | Zero. | Accurate — the note matches the flat-resource reality. |
| **B. Wire the markers** | Add `discover_markdown_resources` / `_guard_in_skill` / `UNKNOWN_FALLBACK` pseudocode to the eight packets to silence the warning. | Eight SKILL.md edits; create-benchmark is at the word cap and cannot absorb it without a cut. | Misleading — advertises keyed discovery over resources that have no keys. Contradicts sibling 005's documented decision. |

**Recommendation: Option A.** The evidence (warning-tier severity, create-readme precedent, mechanism intent) says the N/A posture *is* conformance for flat-resource packets. Option B trades honest documentation for a green checker line and would regress the deliberate decision recorded in 005.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

**Verdict: the eight warnings are correct-by-design, not a defect.** Evidence:

1. **Checker severity.** The missing-marker finding is a `warning`, never an `error`. `--check` passes for all ten. The checker treats the mechanism as *recommended*, not *required*.
2. **Canonical precedent.** `create-readme` — a reference packet — satisfies the standard with an N/A note, not the markers. The N/A note is the sanctioned way to answer the warning for flat-resource packets.
3. **Mechanism intent.** In `create-skill` §2 and `skill_smart_router.md`, the keyed-discovery mechanism exists to route across real `references/<key>/` keyed subdirectories. The eight packets have flat resources (keyed:0). Wiring the markers would add a router with no keys to route over.

So the "router discrepancy against the create-skill standard" is an advisory warning that the packets already answer honestly in prose. It is not evidence of incomplete work in siblings 001–005.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The checker also surfaces advisory warnings unrelated to the marker gap; these are separate workstreams, not part of this analysis:

- `create-agent`: `references/agent-vs-skill-vs-command.md` is hyphenated (snake_case advisory) — owned by `sk-doc/019-hyphen-naming-convention`.
- `create-command`: `assets/command_router_template.md` lacks the 5-field frontmatter block.
- `create-changelog` (3466 w) and `create-benchmark` (4999 w) exceed the 3000-word recommendation; create-benchmark is near the 5000 hard cap.
- All ten packets: missing recommended `INTEGRATION POINTS` and `RELATED RESOURCES` sections (universal advisory).
<!-- /ANCHOR:limitations -->

---

## Post-Completion Follow-Up
- If the operator selects Option B, open a new child (`007-wire-router-markers`) scoped to the eight-packet edit and the create-benchmark word-cap resolution.
