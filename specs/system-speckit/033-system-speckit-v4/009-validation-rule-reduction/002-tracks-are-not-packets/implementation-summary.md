---
title: "Implementation Summary: Tracks Are Not Packets"
description: "Fourteen tracks stopped failing rules they could never satisfy, and half the phase was dropped as unnecessary."
trigger_phrases:
  - "tracks are not packets"
  - "track directory exemption"
  - "three digit numeric prefix"
  - "track graded as packet"
  - "track identity definition"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/009-validation-rule-reduction/002-tracks-are-not-packets"
    last_updated_at: "2026-08-29T19:10:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Exempted track directories from packet rules"
    next_safe_action: "Begin the next phase: delete the rules that encode taste"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-speckit-041-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Tracks Are Not Packets

# Implementation Summary: Tracks Are Not Packets

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-tracks-are-not-packets |
| **Status** | Complete |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The gate now distinguishes a track directory from a packet. A track is the
drawer packets are filed in; it carries metadata so tracks are searchable, and
that metadata was enough to make it look like a phase parent. All fourteen were
graded as packets and all fourteen failed, including on a rule requiring a
three-digit numeric prefix that a track name can never have.

Identity requires three things together: sitting directly under the specs root,
a name that is not a packet number, and no spec of its own. The first draft used
only the first two and immediately exempted a test fixture that was a real
packet — which is exactly the failure mode an exemption has, and why the third
condition exists.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Both halves of the phase were tested before either was implemented, and one was
dropped. The phase had been scoped to also remove archived packets from the
graded set, on the understanding that a recursive run validated them. It does
not: a recursive run from a track reaches nine folders and no archive, and the
sweep already skips archived and scratch trees by name. Nothing was needed, so
nothing was written.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Rationale |
|----------|-----------|
| Test the premise before implementing | Half of it was false, and finding that out cost one command instead of a day |
| Require all three conditions for track identity | An exemption fails silently, so it should be as narrow as the evidence allows |
| Test the negative, not just the positive | That a track passes proves little; that a packet in a track's position still fails is the assertion worth having |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|-------|--------|----------|
| Tracks pass | PASS | All fourteen validated individually, zero errors and zero warnings |
| No packet exempted | PASS | No folder under the specs root carries a spec while failing the packet-name pattern |
| Exemption cannot over-reach | PASS | A test asserts a numbered packet in a track's position still fails on a missing document |
| No packet regressed | PASS | Same 250-packet sample, zero moved from pass to fail; 76.0% to 77.2% |
| Suites | PASS | 25 vitest in scripts, 31 in mcp-server, 117 in the chained shell suite |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Track identity is positional.** A track is recognised by where it sits and
   what it is called. Moving the specs root or renaming a track to look like a
   packet number would change how it is treated.

<!-- /ANCHOR:limitations -->
