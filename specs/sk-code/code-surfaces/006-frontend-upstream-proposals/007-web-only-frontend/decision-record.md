---
title: "Decision Record: Phase 7: web-only-frontend"
description: "Canonical sk-code drops its React Native layer: the frontend surface holds web practice and the Figma-to-code check, and React Native surfaces live in a project fork. Supersedes phase 001's ADR-001."
trigger_phrases:
  - "web only frontend decision record"
  - "remove react native decision"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/code-surfaces/006-frontend-upstream-proposals/007-web-only-frontend"
    last_updated_at: "2026-11-03T19:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded the web-only reversal; built in 1f9a9dea41"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Remove React Native from canonical Skilled (operator, 2026-11-03)."
---
# Decision Record: Phase 7: web-only-frontend

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
### ADR-001: Canonical sk-code is web-only for frontend practice

#### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-03 |
| **Deciders** | Operator (Michel Kerkmeester) |
| **Supersedes** | `001-frontend-surface-mode/decision-record.md` ADR-001 |

#### Context

Phase 001 chose web and native for `sk-code-frontend` and changed the sk-code router to say canonical sk-code owns stack-agnostic React Native practice. Skilled's own code holds no React Native, and the one React Native consumer is a project fork that overlays its own surfaces. Carrying the layer costs six references, six router intents and their vocabulary, and a wider claim for sk-code.

#### Decision

**Web only.** The six native references, the native intents, aliases and playbook scenario leave canonical sk-code. React Native is an unsupported stack again, and the router says React Native surfaces live in a project fork. The web layer, the core page and the Figma-to-code check stay.

#### Consequences

- A React Native prompt gets the unsupported-stack disambiguation instead of the frontend surface.
- A project fork that wants React Native guidance keeps its full native surface, rather than thinning it onto canonical files.

#### Implementation

**How to roll back**: `git revert` the removal commit, then `compiled-route-sync.cjs` and finalize.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Remove React Native from canonical Skilled | Skilled does not need it; the fork owns its native surfaces | 001 Q001 "Web and native" | ADR-001 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

- **Q001** was offered as "remove it, or keep it as is", with web-only recommended when the fork is the only React Native consumer. Answer: "Remove it dor skilled".
<!-- /ANCHOR:operator-answers-verbatim -->

---
