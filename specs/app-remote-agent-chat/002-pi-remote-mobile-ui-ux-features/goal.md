# Spec 002 — Goal

> Long-form intent for the Pi Remote mobile UI/UX feature-parity packet. The short
> companion is [`goal-prompt.md`](goal-prompt.md) (kept under 4000 characters). When
> they disagree, this file is the source of truth for scope and direction.

---

## 1. What this packet is

Pi Remote is an installable iPhone PWA that remote-controls the `pi` coding agent on a Mac over a private Tailscale tailnet. The sibling packet `001-pi-remote-mobile-agent-like-cc` shipped the secure foundation: the loopback relay, the typed RPC protocol, auth/enrollment, redaction, sync, the mutation-approval boundary, and content-free push.

Spec 002 is the **UI/UX feature-parity** packet. It brings the mobile chat experience — interaction and visual styling — to the quality bar of the Claude iOS app and the Kimi Code app, and adds the first-class agent controls that `pi` exposes on the desktop terminal but the phone is missing.

## 2. The goal

Reach Claude/Kimi-app quality for the mobile chat, and add the missing agent controls, **without weakening** the two fixed contracts:

- **Design system (frozen):** ink-on-parchment — bone `#f8f8f6` / carbon ink / clay `#d97757`; Inter + Source Serif 4; light + dark; WCAG AA.
- **Security posture (frozen):** read-only by default; one-use ticketed + revision-checked mutations that fail closed; redaction everywhere; host/extension-enforced plan mode; content-free push; operator-only `--full-access` that the phone can never enable.

Work is UI-only unless a feature inherently needs a new lane; those are flagged and designed security-first.

## 3. How it is structured

One **phase per feature**, research-first. Each feature phase is itself a phase-parent:

- `001-research/` — the first sub-phase. Independent, cited research passes (`iter-NN-<model>.md`) plus a build-ready `SYNTHESIS.md`. No build work starts until research is synthesized.
- `002-…`, `003-…` — numbered build sub-phases, one per phase in the feature's `implementation-phases.md`, each independently shippable and verifiable.

Research was run with no early convergence across three external model lanes (DeepSeek v4 Flash via the OpenCode Go gateway, GPT SOL high, Grok 4.6 xhigh), tiered by how net-new each feature is.

## 4. The features (build order)

1. **`001-change-model`** — host-authoritative model switcher (bottom sheet; browse read-only, confirm obtains a one-use revision-bound ticket).
2. **`002-change-effort`** — reusable effort picker inside the canonical model/effort sheet; confirmed state stays non-optimistic.
3. **`003-slash-commands`** — composer-anchored `/` autocomplete driven by the relay's live command catalog; selection inserts editable text and mutates nothing until explicit Send.
4. **`004-plan-mode-tab`** — always-visible host-confirmed mode button, structured Plan lifecycle, composer-scoped `Shift+Tab`; the phone never infers authority.
5. **`005-file-preview`** — first openable redacted file card and a history-backed full-screen read-only viewer over immutable relay-issued snapshots. Establishes the viewer shell others reuse.
6. **`006-rich-content-blocks`** — Claude-style bash Command/Output cards and code/text artifact cards with Copy + full-screen, reusing the `005` viewer.
7. **`007-media-upload`** — upload media from the iOS gallery into the chat. New binary lane (user → pi); security-first; hard-gated on an adversarial security/redaction review.
8. **`008-inbound-media`** — preview media/screenshots that `pi` sends, inline. New inbound binary lane (pi → phone); security-first; hard-gated; reuses the `005` viewer.

## 5. Open direction

- **Reliability of the UI/UX bar.** A follow-on research loop gathers real reference screens per feature (Mobbin + Refero via code mode) so the quality bar rests on real app references, not text-only synthesis. Reference apps: Dot, Perplexity, Copilot, Claude, Manus, Grok, Pi, Meta AI, ChatGPT, Gemini, Genie.
- **Two candidate features under evaluation:** `pi`'s ask-question extension (terminal-style prompt UI, as in OpenCode/Claude/Codex) and `pi`'s todos surface (terminal-parity or better, referencing Manus and Claude). Each would follow the same research-first phase structure.

## 6. Definition of done for the packet

Every feature phase has a synthesized research decision, a build-ready `spec.md` + `implementation-phases.md`, and numbered build sub-phases with their own docs and metadata. The mobile chat demonstrably approaches the Claude/Kimi bar in true-390px light + dark screenshots, and no change weakens the frozen design or security contracts.
