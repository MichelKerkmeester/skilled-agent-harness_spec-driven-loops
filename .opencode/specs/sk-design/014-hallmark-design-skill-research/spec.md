---
title: "Hallmark design-skill study for sk-design (phase parent)"
description: "Phase-parent packet: study the external Hallmark design skill for reuse and learnings that improve sk-design's modes, commands, and logic."
trigger_phrases:
  - "hallmark design skill study parent"
  - "sk-design hallmark reuse packet"
  - "hallmark modes commands learnings"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-design/014-hallmark-design-skill-research"
    last_updated_at: "2026-07-20T09:19:14Z"
    last_updated_by: "spec-author"
    recent_action: "Create the phase parent, place the Hallmark repo under external/, scaffold 001-research"
    next_safe_action: "Run 001-research deep-research fanout after the Rust research completes"
    blockers: []
    key_files:
      - ".opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/spec.md"
      - ".opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent | v2.2 -->

# Hallmark design-skill study for sk-design

## 1. METADATA

- **Track:** sk-design
- **Packet:** 014-hallmark-design-skill-research (phase parent)
- **Subject:** `external/hallmark/` — Nutlope/Hallmark, cloned minus `.git` (a design skill for AI coding assistants).

## 2. PROBLEM & PURPOSE

Hallmark is an external, independently-designed design skill whose verbs and reference library overlap heavily with sk-design's five modes and styles database. This packet studies it for concrete reuse and learnings that improve sk-design — modes, commands, slop gates, and `design.md` extraction — without wholesale replacement.

## 3. SCOPE

- **In:** studying `external/hallmark/`, producing reuse/learning findings, and (in later phases) folding the highest-value adoptions into sk-design.
- **Out:** redistributing Hallmark content beyond its license; changing sk-design before the research converges.

## 4. PHASE DOCUMENTATION MAP

| Phase | Purpose | Status |
|---|---|---|
| `001-research` | Deep research: reuse/learning matrix + ranked adoptions + licensing verdict. | In progress |
| `002+` (planned) | Apply the approved adoptions to sk-design modes/commands. | Planned (pending 001 findings) |

## 5. OPEN QUESTIONS

- Which adoptions clear the value/effort bar for a follow-on implementation phase?
- Does the Hallmark LICENSE permit copy/redistribution or only learning?

## 6. RELATED DOCUMENTS

- `001-research/spec.md` — the research charter.
- `external/hallmark/README.md`, `external/hallmark/ROADMAP.md` — subject context.
