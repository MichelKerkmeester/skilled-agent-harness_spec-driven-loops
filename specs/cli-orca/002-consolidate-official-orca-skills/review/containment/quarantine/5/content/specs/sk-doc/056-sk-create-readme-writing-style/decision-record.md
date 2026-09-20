---
title: "Decision Record: sk-create-readme writing-style guidance"
description: "The one superseded decision in this packet: the optional Problem section was added to the guidance, then removed after the operator dropped it from the root README."
trigger_phrases:
  - "sk-create-readme problem section decision"
  - "readme problem-first adr"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-doc/056-sk-create-readme-writing-style"
    last_updated_at: "2026-09-20T13:40:00Z"
    last_updated_by: "devin"
    recent_action: "Recorded ADR-001 superseding the Problem-section guidance"
    next_safe_action: "Packet closeable with nine Met rows and one Superseded row"
    blockers: []
    key_files:
      - "decision-record.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "devin-056-sk-create-readme"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Problem section dropped: the operator removed it from the root README after it shipped in the guidance, so the pattern lost its flagship example"
---
# Decision Record: sk-create-readme writing-style guidance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Drop the optional Problem section from the guidance

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-20 |
| **Deciders** | Operator |
<!-- /ANCHOR:adr-001-metadata -->

---

<!-- ANCHOR:adr-001-context -->
### Context

The first draft of this release documented an optional `Problem` section for
front-page READMEs, placed before Overview. The pattern came from the root README
rework, which led with `## 1. THE PROBLEM` before the benefit section. After the
guidance shipped in the working tree, the operator removed the Problem section
from the root README and opened with `## 1. SUMMARY` instead.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

Remove the Problem-section guidance from `SKILL.md` and `writing-patterns.md`,
and supersede REQ-004 / AC-004. The remaining marketing-register advice stays:
value-first ordering, benefit-led headings and decorative section emoji.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- The skill documents no problem-first section. An author who wants one writes
  it by hand, which is correct for a pattern the repository's own front page
  does not carry.
- The root README's `## 1. SUMMARY` shape needs no rule: `Overview` remains
  "Always" in the section table and Summary is a name variant within it.
- AC-004 reads Superseded with this record as its waiver backing.
<!-- /ANCHOR:adr-001-consequences -->
