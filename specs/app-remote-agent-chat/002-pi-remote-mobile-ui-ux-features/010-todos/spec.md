---
title: "Support pi’s todos in the PWA"
description: "Render pi’s todo/plan list in the mobile chat with a UX better than the desktop terminal — clear task states, progress, and grouping — referencing how Manus and Claude present agent task lists."
trigger_phrases:
  - "pi todos pwa"
  - "agent todo list mobile"
  - "task list ui manus claude"
importance_tier: "important"
_memory:
  continuity:
    packet_pointer: "app-remote-agent-chat/002-pi-remote-mobile-ui-ux-features/010-todos"
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

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: phase -->

# Feature Specification: Support pi’s todos in the PWA

> **Research-first feature phase (research pending).** This documents feature
> intent only. The build-ready spec and `implementation-phases.md` are authored
> after the reference-screen research in [`research/`](research/) is synthesized.

## Summary

Render pi’s todo/plan list in the mobile chat with a UX better than the desktop terminal — clear task states, progress, and grouping — referencing how Manus and Claude present agent task lists.

## Problem & Goal

**Current state.** pi maintains a todo list on the desktop terminal; the PWA has no todo surface, so task progress is invisible from the phone.

**Desired end state.** A first-class todo surface: task rows with state (pending / active / done / blocked), progress affordance, grouping, and live updates, in the fixed ink-on-parchment system — ideally clearer than the terminal version.

## Scope

### In scope
- A new mobile surface for this pi capability, within the fixed ink-on-parchment design system and the read-only-by-default security posture.
- Reference-screen research (Mobbin/Refero via code mode) grounding the UI/UX in real, comparable apps before any build phase.

### Out of scope (frozen)
- **Design system:** ink-on-parchment (bone `#f8f8f6` / carbon ink / clay `#d97757`; Inter + Source Serif 4; light + dark; WCAG AA).
- **Security posture:** read-only default; one-use ticketed + revision-checked mutations that fail closed; redaction everywhere; host/extension-enforced plan mode.

## Target bar & references

Manus and Claude task/todo lists; plus Mobbin/Refero reference flows.

Reference apps to capture: Manus, Claude, plus Dot, Perplexity, Copilot, Grok, Pi, Meta AI, ChatGPT, Gemini, Genie via Mobbin/Refero.

## Acceptance criteria (provisional — finalized after research)

- The surface renders pi’s todo list correctly and updates live.
- Interaction and visuals reach the target bar in true-390px light + dark screenshots.
- No change weakens the frozen design system or security posture; any security-crossing implication is flagged for security-first design.

## Dependencies & affected areas

Likely: `packages/pi-rpc-protocol` (new block/event type), `apps/pi-remote-relay` (projection/redaction), `apps/pi-remote-web` (renderer + composer/transcript integration). Confirmed after research.

## Research

See [`research/`](research/) for the deep-loop-aligned research (pending run) and
[`001-research/`](001-research/) for the research phase in the packet graph.
