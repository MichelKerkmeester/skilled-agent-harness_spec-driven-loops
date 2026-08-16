# Spec 002 — Goal Prompt

> Short-form intent (< 4000 chars). Long-form: [`goal.md`](goal.md).

**Product.** Pi Remote — an installable iPhone PWA that remote-controls the `pi` coding agent on a Mac over a private Tailscale tailnet. Monorepo: `packages/pi-rpc-protocol`, `apps/pi-remote-relay`, `apps/pi-remote-web` (React 19 + Vite + Tailwind 4 + React Aria), `extensions/pi-remote-approval`. The secure foundation shipped in sibling packet `001-pi-remote-mobile-agent-like-cc`.

**Goal.** Bring the mobile chat — interaction UX and visual styling — to the quality bar of the Claude iOS app and the Kimi Code app, and add the first-class agent controls `pi` exposes on the desktop terminal but the phone lacks. Do this without weakening two frozen contracts.

**Frozen — design system.** Ink-on-parchment: bone `#f8f8f6` / carbon ink / clay `#d97757`; Inter + Source Serif 4; light + dark; WCAG AA. Not changed by this packet.

**Frozen — security posture.** Read-only by default; one-use ticketed + revision-checked mutations that fail closed; redaction everywhere; host/extension-enforced plan mode; content-free push; operator-only `--full-access` the phone can never enable. Not weakened by this packet. Work is UI-only unless a feature inherently needs a new lane — flagged and designed security-first.

**Structure.** One phase per feature, research-first. Each feature phase is a phase-parent whose first sub-phase is `001-research/` (independent cited passes + a build-ready `SYNTHESIS.md`); build sub-phases start at `002-`, one per phase in that feature's `implementation-phases.md`, each independently shippable and verifiable.

**Features (build order = phase number).**
1. `001-change-model` — host-authoritative model switcher; browse read-only, confirm gets a one-use revision-bound ticket.
2. `002-change-effort` — effort picker inside the canonical model/effort sheet; confirmed state non-optimistic.
3. `003-slash-commands` — composer-anchored `/` autocomplete from the relay's live catalog; mutates nothing until explicit Send.
4. `004-plan-mode-tab` — always-visible host-confirmed mode button + structured Plan lifecycle + composer-scoped `Shift+Tab`.
5. `005-file-preview` — redacted file card + history-backed full-screen read-only viewer over immutable snapshots; the viewer shell others reuse.
6. `006-rich-content-blocks` — Claude-style bash Command/Output cards + code/text artifact cards (Copy + full-screen), reusing the `005` viewer.
7. `007-media-upload` — upload from the iOS gallery; new binary lane (user → pi), security-first, hard-gated on adversarial review.
8. `008-inbound-media` — preview media/screenshots `pi` sends, inline; new inbound lane (pi → phone), security-first, hard-gated, reuses the `005` viewer.

**Open direction.**
- Reliability: a follow-on research loop gathers real reference screens per feature (Mobbin + Refero via code mode) — Dot, Perplexity, Copilot, Claude, Manus, Grok, Pi, Meta AI, ChatGPT, Gemini, Genie — so the bar rests on real references.
- Two candidate features under evaluation, same research-first structure: `pi`'s ask-question extension (terminal-style prompt UI) and `pi`'s todos surface (terminal-parity or better, referencing Manus + Claude).

**Done.** Every feature phase has a synthesized decision, a build-ready spec + phased plan, and numbered build sub-phases with docs and metadata. The mobile chat approaches the Claude/Kimi bar in true-390px light + dark screenshots, with no change weakening the frozen design or security contracts.
