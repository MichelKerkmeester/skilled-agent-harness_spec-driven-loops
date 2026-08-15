---
title: "Pi Remote Mobile UI/UX Research"
description: "Deep-research packet: find concrete, adoptable improvements to the Pi Remote mobile PWA's interface, interaction design, information architecture, and ease-of-use logic and flows."
trigger_phrases:
  - "pi remote"
  - "pi mobile"
  - "mobile ui"
  - "ui ux research"
  - "approval card"
  - "attention inbox"
importance_tier: "normal"
contextType: "research"
---
# Pi Remote Mobile UI/UX Research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Research |
| **Created** | 2026-08-14 |
| **Branch** | `skilled/0147-pi-remote-experience` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Pi Remote mobile PWA (installable iPhone PWA, Vite + React 19 + Tailwind 4 + React Aria) remote-controls the Pi coding agent over a Tailscale tailnet. Its four surfaces — Home session list, Session typed-block transcript, Review approval card, and Attention Inbox — carry the full weight of steering a long-running coding agent from a phone. Ease-of-use is the product's core value: the operator must be able to launch, watch, steer, and safely approve agent work with low friction while the security posture (redaction everywhere, mutation approval-gated, foreground authority) stays explicit.

### Purpose
Research concrete, adoptable improvements to the app's interface, interaction design, information architecture, and ease-of-use logic and flows, benchmarked against mobile coding-agent, terminal, CI/CD, and remote-development clients (Claude mobile, Warp, Termius, Blink Shell, GitHub mobile, Vercel/Netlify mobile, Replit mobile, agent-control/remote-desktop apps), producing findings with sources and an application strategy that does not weaken the security posture. This packet is research-only: it does not proceed to implementation.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

<!-- DR-SEED:SCOPE -->
### In Scope
- Interface and interaction design improvements for Home, Session, Review, and Attention Inbox surfaces
- Information architecture and navigation patterns across the four surfaces
- Typed-block transcript rendering and live-streaming affordances
- Compose-box send/steer ease-of-use (keyboard, multi-line, quick actions, stop/undo)
- Review/approval presentation that keeps safety explicit and fast
- Attention/notification/inbox patterns that inform without noise or content leakage
- Mobile-PWA-specific adaptations (installable, offline, push, iPhone keyboard/screen-reader)

### Out of Scope
- Implementation of any improvement (research only)
- Visual rebrand or design-token overhaul beyond concrete adoptions
- Removing or weakening the security posture (redaction, mutation approval-gating, foreground authority)
- Non-mobile (desktop/web) redesign
- Performance profiling or infrastructure work unrelated to ease-of-use

### Files to Change
None (research-only packet). Evidence sources live under the Pi Remote app home:
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src` (App.tsx, state.ts, relay.ts, attention.ts, style.css, auth.ts, cache.ts, main.tsx)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs` (architecture.md, security.md, install-and-onboarding.md, platform-support.md, operations.md, etc.)

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

<!-- DR-SEED:REQUIREMENTS -->
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Produce research/research.md synthesizing findings across iterations with sources and application strategy | Findings cite sources or inference; each has an application path that preserves the security posture |
| REQ-002 | Benchmark mobile coding-agent, terminal, CI/CD, and remote-dev clients for adoptable UX patterns | Each adopted pattern names its source, the pattern, why it helps ease-of-use, and how to apply it to Pi Remote |
| REQ-003 | Cover all four Pi Remote surfaces (Home, Session, Review, Attention Inbox) | Findings map to specific surfaces and interaction flows |
| REQ-004 | Respect constraints: mobile-first iPhone, foreground authority, redaction everywhere, mutation approval-gated | No recommendation weakens these constraints |
| REQ-005 | Research-only: do not implement changes | Packet ends at research/research.md; implementation is a separate follow-up |

<!-- /ANCHOR:requirements -->

<!-- BEGIN GENERATED: deep-research/spec-findings -->
## Research Findings Summary

Deep-research completed (session 62836e1f-705d-4d35-b0f1-de74f57a4289, 10 iterations, stop `maxIterationsReached`). Canonical synthesis: `research/research.md`. 112 key findings, 29 ruled-out directions. Headline results:

- **IA (Q2):** Two persistent roots — `Sessions` and `Attention`; Session and Review are details. One addressable route state; content-free hints resolve through an authenticated barrier; warm/cold return contract.
- **Transcript (Q3):** Turn-oriented typed-block hierarchy with signal-based collapse defaults; two-state live edge with `N new blocks / Jump to latest`; content-free block-sequence anchors.
- **Approval (Q4):** Present "Exact redacted action" (never "full action"); progressive evidence with persistent decision summary; direct Deny/Approve-once; accept-edits as a separate future-authority grant (bounded presets, host-time status, host-confirmed revoke). Only allowlisted host-generated categorical descriptors are privacy-safe.
- **Compose (Q5):** State-derived Send/Steer/Later; touch Return = newline, modified-Enter = dispatch; editable draft beside immutable pending submit; host-bound undo/retry/stop.
- **Attention (Q6):** Server-owned device receipt lifecycle; leased foreground/typing suppression; dual unread/unresolved indicators; two-layer dedupe with bounded stale retention; per-device push-only preferences.
- **Session list (Q1):** Action-first priority queue (`Needs you` / `Working` / `Recent`) derived from coarse relay state.

Every recommendation preserves the security posture (redaction everywhere, mutation approval-gated, foreground authority, content-free push). Research-only — implementation is a separate follow-up.
<!-- END GENERATED: deep-research/spec-findings -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Research yields a concrete, prioritized set of adoptable UI/UX improvements with source citations
- **SC-002**: Every recommendation states why it improves ease-of-use and how to apply it without weakening security
- **SC-003**: Coverage spans Home, Session, Review, and Attention Inbox surfaces plus compose/approval flows
- **SC-004**: research/research.md exists with synthesized findings, convergence report, and references

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Recommending patterns that leak content (hints/redaction) | Weakens redaction posture | Benchmark content-free push patterns; flag any leak risk explicitly |
| Risk | Patterns that slow mutation approval | Weakens operator safety | Preserve approval-gated flow; recommend speed-ups that keep explicit consent |
| Dependency | Memory daemon flakiness | Prior context may be unavailable | Prefer direct file/WebFetch evidence; treat memory as optional accelerator |
| Dependency | External reference apps | Pattern claims may be stale | Cite sources per finding; prefer official docs and verified references |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which interaction patterns from leading mobile coding-agent/terminal/CI/remote-dev clients transfer to Pi Remote's surfaces, and which are PWA-specific adaptations?
- What information architecture and navigation patterns make four-surface mobile agent control coherent and low-effort?
- Which transcript and streaming patterns improve readability and steerability of a long-running agent transcript on a phone?
- How should mutation approval and redaction be presented so safety stays explicit and fast?
- Which compose-box affordances lower friction for steering a coding agent from an iPhone keyboard?
- What attention/notification/inbox patterns keep the operator informed without noise or content leakage?

<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
