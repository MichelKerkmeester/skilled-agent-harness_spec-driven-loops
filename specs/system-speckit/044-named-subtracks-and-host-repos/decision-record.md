---
title: "Decision Record: Named sub-track support in spec-kit, plus project-owned doctor entries, the vendored .skilled/specs link and a host-repository trigger index"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "044-named-subtracks-and-host-repos operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/044-named-subtracks-and-host-repos"
    last_updated_at: "2026-11-07T15:26:58.159Z"
    last_updated_by: "decision-record-writer"
    recent_action: "Recorded operator decisions"
    next_safe_action: "Review the recorded operator decisions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "decision-record-writer"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Named sub-track support in spec-kit, plus project-owned doctor entries, the vendored .skilled/specs link and a host-repository trigger index

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | A new host gets .skilled/ built in place, so .skilled/specs points at the host specs/ folder or is omitted, instead of one whole link to the checkout. | The operator chose the recommended option: a whole link resolves .skilled/specs into the Skilled checkout own specs, the wrong tree for a host. | None | REQ-010, AC-010, T015, implementation-summary.md Key Decisions |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01LiZmqrhGhP27DpaXaP2rzs:0 -->

Question:
```text
Packet 044, REQ-010 (no dangling .skilled/specs link in a host): worker D's fix makes /doctor:symlink build .skilled/ as a real folder with per-child links in every new host, instead of today's single whole link to the checkout. That way .skilled/specs points at the host's own specs/, or is left out when the host has none. Keep that default change?
```

Options:
```text
Keep D's merge build (Recommended)
Keep whole link, narrow fix
Defer REQ-010
```

Answer:
```text
Keep D's merge build (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
