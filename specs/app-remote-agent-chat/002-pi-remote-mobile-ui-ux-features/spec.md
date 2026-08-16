---
title: "Feature Specification: Pi Remote — Mobile UI/UX Feature Parity"
description: "Pi Remote — Mobile UI/UX Feature Parity"
trigger_phrases:
  - "feature specification: pi remote — mobile ui/ux feature parity"
importance_tier: "important"
_memory:
  continuity:
    packet_pointer: "app-remote-agent-chat/002-pi-remote-mobile-ui-ux-features"
    last_updated_at: "2026-08-16T07:47:48Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded packet and migrated research to deep-loop research folders"
    next_safe_action: "Prepare reference-screen research per feature, then build 001 to 008"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: phase -->

# Feature Specification: Pi Remote — Mobile UI/UX Feature Parity

> **Phase-parent packet.** This file documents root purpose and the phase map only.
> Cross-feature detail lives in [`README.md`](README.md), [`ROADMAP.md`](ROADMAP.md),
> and [`ARCHITECTURE.md`](ARCHITECTURE.md); build detail lives in each feature phase
> child. Keep this file to root purpose only.

## 1. METADATA

- **Packet:** `app-remote-agent-chat/002-pi-remote-mobile-ui-ux-features`
- **Parent product:** Pi Remote — installable iPhone PWA that remote-controls the `pi` coding agent over a private Tailscale tailnet (see sibling packet `001-pi-remote-mobile-agent-like-cc`, which shipped the secure foundation).
- **Kind:** phase parent (one phase per feature; each feature phase is itself a parent whose first sub-phase is `001-research/`).
- **Structure:** research-first — no feature's build phases start until its research is synthesized into a build-ready decision.
- **Target bar:** the Claude iOS app and the Kimi Code app.

## 2. PROBLEM & PURPOSE

### Problem Statement

The secure foundation exists, but the mobile chat UI/UX is not yet at the quality bar of the Claude and GPT mobile apps, and several first-class agent controls that `pi` exposes on the desktop terminal are missing from the phone. Closing that gap must not weaken the fixed security posture or the fixed design system.

### Purpose

Bring the Pi Remote mobile experience — interaction UX and visual styling — to Claude/Kimi-app quality, and add the missing agent controls, as a set of independently shippable, research-backed feature phases.

## 3. SCOPE

### In Scope

- Eight feature phases (`001`–`008`), each research-first, each with a build-ready `spec.md` + `implementation-phases.md` and numbered build sub-phases.
- UI/UX work that stays within the fixed design system and the read-only-by-default security posture.
- Two features (`007-media-upload`, `008-inbound-media`) that inherently add a new binary content lane — designed security-first, gated by an adversarial security/redaction review of their spec before any build phase starts.

### Out of Scope (frozen)

- **Design system:** ink-on-parchment — bone `#f8f8f6` / carbon ink / clay `#d97757`; Inter + Source Serif 4; light + dark; WCAG AA. Not changed by this packet.
- **Security posture:** read-only default; one-use ticketed + revision-checked mutations that fail closed; redaction everywhere; host/extension-enforced plan mode; content-free push; operator-only `--full-access` (the phone can never enable it). Not weakened by this packet.

## 4. PHASE DOCUMENTATION MAP

Phase numbers follow **build order** (the sequence argued in `ROADMAP.md`), so the number is the order the feature is built, not an arbitrary index. Each feature phase's first sub-phase is `001-research/`; build sub-phases start at `002-`.

| Phase | Feature | Tier | Research | Build phases |
|-------|---------|------|----------|--------------|
| `001-change-model` | Change the active AI model | YES — harden + improve | 5 × DeepSeek | 3 |
| `002-change-effort` | Change the effort / reasoning level | YES — harden + improve | 5 × DeepSeek | 4 |
| `003-slash-commands` | Typed `/` commands with the real host command list, inline | PARTIAL — reach desired | 5 × SOL + 5 × Grok | 4 |
| `004-plan-mode-tab` | Switch to plan mode incl. a Tab/keyboard affordance | PARTIAL — reach desired | 5 × SOL + 5 × Grok | 5 |
| `005-file-preview` | See and preview a file like the Claude app | PARTIAL — reach desired | 5 × SOL + 5 × Grok | 4 |
| `006-rich-content-blocks` | Claude-style bash Command/Output cards + code/text artifact cards (copy + full-screen) | PARTIAL — reach desired | 5 × SOL + 5 × Grok | build |
| `007-media-upload` | Upload media from the iOS gallery into the chat | NO — net-new binary lane, security-first | 5 × SOL + 5 × Grok + 5 × DeepSeek | build |
| `008-inbound-media` | Preview media/screenshots that `pi` sends, inline | NO — net-new inbound content type, security-first | 5 × SOL + 5 × Grok + 5 × DeepSeek | build |
| `009-ask-question` | Support `pi`'s ask-question extension (terminal-style prompt UI) | NO — net-new surface | reference-screen research (pending) | pending |
| `010-todos` | Support `pi`'s todos (Manus/Claude-grade task list) | NO — net-new surface | reference-screen research (pending) | pending |

### Dependency and transition rules

- Build order is **`001 → 002 → 003 → 004 → 005 → 006 → 007 → 008`** (the ROADMAP argues this from dependency, leverage, and risk).
- `005-file-preview` establishes the read-only full-screen viewer shell that `006-rich-content-blocks` and `008-inbound-media` reuse.
- `007-media-upload` and `008-inbound-media` each add a binary content lane and are **hard-gated** on an adversarial security/redaction review of their spec before any build phase.

## 5. OPEN QUESTIONS

- Reliability of the UI/UX quality bar: a follow-on research loop gathers real reference screens per feature (Mobbin + Refero via code mode) to raise confidence beyond text-only synthesis.
- Two net-new feature phases are scaffolded and awaiting reference-screen research: `009-ask-question` (`pi`'s ask-question extension, terminal-style prompt UI) and `010-todos` (`pi`'s todos surface, Manus/Claude-grade — better than terminal parity).

## RELATED DOCUMENTS

- [`README.md`](README.md) — features, research budgets, layout.
- [`ROADMAP.md`](ROADMAP.md) — cross-feature build order and per-feature decisions.
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — how the features compose over the relay/protocol/web surfaces.
- [`goal.md`](goal.md) / [`goal-prompt.md`](goal-prompt.md) — long-form and short-form intent.
- Sibling packet `../001-pi-remote-mobile-agent-like-cc/` — the shipped secure foundation.
