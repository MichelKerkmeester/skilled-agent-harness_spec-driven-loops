---
title: "Research — Support pi’s ask-question extension in the PWA"
description: "Research phase for 009-ask-question: reference-screen research pending"
trigger_phrases:
  - "pi ask question pwa"
  - "ask question prompt mobile"
  - "terminal-style question ui"
importance_tier: "important"
_memory:
  continuity:
    packet_pointer: "app-remote-agent-chat/002-pi-remote-mobile-ui-ux-features/009-ask-question/001-research"
    last_updated_at: "2026-08-16T08:22:22Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded feature phase; reference-screen research not yet run"
    next_safe_action: "Investigate reference screens, then synthesize the build spec"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Research — Support pi’s ask-question extension in the PWA

> First sub-phase of the `009-ask-question` feature. Lean spec-kit phase recording the
> research phase in the packet graph. Research **artifacts** live in
> [`../research/`](../research/); the reference-screen research is pending.

## Summary

Research-first: no build sub-phase starts until this feature’s reference-screen
research is synthesized into a build-ready decision in `../research/research.md`.

## Deliverable (in ../research/)

- `../research/BRIEF.md` — the research question (present).
- `../research/research.md` — the build-ready synthesized decision (pending).
- `../research/iterations/iteration-NNN.md` — the cited passes (pending).

## Acceptance criteria

- `../research/research.md` exists and states a single build-ready decision once research runs.
- The decision stays within the frozen design system and security posture.

## Security & Redaction

Read-only research: markdown only, no application-code / protocol / relay change.

## Dependencies & affected areas

None inbound. Outbound: `../research/research.md` will feed this feature’s build spec.
