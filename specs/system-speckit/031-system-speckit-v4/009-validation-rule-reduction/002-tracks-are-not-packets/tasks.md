---
title: "Task Breakdown: Tracks Are Not Packets"
description: "Verify the premise, implement the exemption, prove it does not over-reach."
trigger_phrases:
  - "tracks are not packets"
  - "track directory exemption"
  - "three digit prefix rule"
  - "prove no over-reach"
  - "verify premise evidence"
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
# Task Breakdown: Tracks Are Not Packets

# Task Breakdown: Tracks Are Not Packets

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

- `[x]` complete · `[ ]` open
- `T-0NN` setup · `T-1NN` implementation · `T-2NN` verification

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T-001 [P1] Test both halves of the phase premise. Tracks: confirmed, five errors each across fourteen. Archives: refuted — a recursive run from a track reaches nine folders and no archive, and the sweep skips archived trees by name.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T-101 [P1] Recognise a track directory before level detection and return no packet findings.
- [x] T-102 [P0] Narrow the definition after the first draft exempted a genuine packet fixture; identity now needs the position, the name, and the absence of a spec.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T-201 [P1] All fourteen tracks pass. Evidence: each validated individually, zero errors and zero warnings.
- [x] T-202 [P0] No packet is exempted. Evidence: no folder directly under the specs root carries a spec while failing the packet-name pattern; a test asserts a numbered packet in that position still fails on a missing document.
- [x] T-203 [P0] No packet regressed. Evidence: same 250-packet sample, 0 moving from pass to fail; pass rate 76.0% to 77.2%.
- [x] T-204 [P1] Suites pass. Evidence: 25 vitest cases in scripts, 31 in mcp-server, 117 in the chained shell suite.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- Tracks report nothing; packets are graded exactly as before.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- `spec.md` — requirements REQ-001 and REQ-002
- `plan.md` — approach and rollback

<!-- /ANCHOR:cross-refs -->
