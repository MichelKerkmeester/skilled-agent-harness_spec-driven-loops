# Pi Remote — Project Goal

> Full, unabridged project goal and plan. This is the long-form companion to the short goal prompt (which stays under the 4000-character limit). When they disagree, this file is the source of truth for scope and direction.

---

## 1. What Pi Remote is

Pi Remote is an installable iPhone PWA that remote-controls the `pi` coding agent running on a Mac, over a private Tailscale tailnet — the way Claude Code pairs with the Claude mobile app, but self-hosted and private.

It is a small TypeScript monorepo (npm workspaces):

- `packages/pi-rpc-protocol` — shared typed protocol and guards for the Pi RPC surface and the phone/relay contracts.
- `apps/pi-remote-relay` — the loopback relay: supervises one `pi --mode rpc` child, owns auth/enrollment, redaction, sync, mutation approval, and the runtime store.
- `apps/pi-remote-web` — the React 19 + Vite + Tailwind 4 + React Aria PWA.
- `extensions/pi-remote-approval` — the tool-call approval extension (the mutation boundary).
- `deploy/` — tailnet-only Tailscale Serve setup and a sandbox profile.
- `scripts/boot.mjs` — one-command boot: preflight, build, ingress, enrollment, handoff.

Public repository: https://github.com/MichelKerkmeester/pi-mobile-pwa-tailscale

## 2. The goal

Bring the mobile experience to the quality bar of the Claude and GPT mobile apps — both interaction UX and visual styling — and add first-class agent controls, without weakening the security model.

Concretely, the phone must gain:

1. **Model switching** — an in-conversation model picker.
2. **Effort / reasoning-level switching** — an effort control showing only the levels the active model supports.
3. **Typed commands** — a `/` command surface plus quick actions.
4. **Plan-mode toggle** — a fast, host-confirmed Build/Plan switch.
5. **A chat UI/UX and visual style** close to Claude and GPT — turn-oriented transcript, calm streaming, restrained motion, and the Claude "ink on parchment" design system applied across the whole PWA.

The key research finding that de-risks all of this: **the `pi` child already exposes every needed capability over RPC** (`get_available_models`/`set_model`, `get_available_thinking_levels`/`set_thinking_level`, `get_commands`, and `/plan` via the plan-mode extension). So the work is protocol-forwarding plus composer UX, not new agent capability.

## 3. Non-negotiable security posture

Every change preserves these invariants. They are the reason the app exists and are never traded for convenience:

- **Loopback relay.** The relay and web preview bind to 127.0.0.1 only.
- **Tailnet-only ingress.** Reachable only through Tailscale Serve. Funnel is asserted OFF; nothing is public.
- **Foreground authority.** A mutation is only valid from a foreground, authenticated device with a live sync socket.
- **Redaction everywhere.** Browser DTOs never carry secrets, absolute paths, raw tool catalogs, or unredacted transcript content.
- **Mutation approval-gated and default-off.** The default supervisor runs read-only (`--no-tools`). Mutation is opt-in.
- **Ticketed, revision-checked control.** Every runtime or command mutation consumes a one-use ticket and an `expectedRevision`, is serialized through the supervisor, and fails closed. Delivery-unknown never auto-retries.
- **Host-enforced plan mode.** Plan restrictions are enforced by the extension, never by a client-only toggle.
- **Content-free push.** Attention/push payloads carry no model, command, or transcript strings.

### Full-access desktop-parity mode

The operator chose desktop-parity: `pi` runs with all tools and no per-action approval, exactly like desktop `pi`. This is wired as an explicit opt-in behind the boot flag `--full-access` (env `PI_REMOTE_FULL_ACCESS=1`), which selects `fullAccessPiArguments()` = `--mode rpc --no-session --approve` and skips the approval extension. The network boundary (loopback + tailnet-only + Funnel-off) is unchanged; only what the local agent may do changes, and only the host can enable it — the phone cannot.

## 4. Current state (as of this handover)

- **Built, verified, and live.** The full app builds; format/lint/typecheck pass; relay + web tests pass; release-verify passes (operator-only checks pending). The full-access deployment has been booted and verified end-to-end: Tailscale Serve up (tailnet-only), relay reachable and auth-gating, the live `pi` child running under full-access, and a scannable enrollment QR / raw code minted (30-minute window).
- **Deployed once-off setup is done and persists.** Tailscale installed + tailnet Serve/HTTPS enabled + `deploy/serve.env` created. Re-runs just need `npm run boot` (or double-click `Boot Pi Remote.command`).
- **Research complete.** Packet 044 (multi-surface UI/UX, 112 findings) and packet 047 (desktop-parity chat UX) — the latter a two-model fan-out (Grok 4.5 + GPT 5.6 SOL) merged into one synthesis.
- **Plan complete and optimized.** A phased implementation plan plus a Claude-restyle plan (independently verified and corrected), folded together and then re-sequenced for the best build order.

## 5. The plan (optimized build order)

Detailed docs live in the spec-kit packet `047-pi-remote-desktop-parity-chat-ux`:
- `research/research.md` — merged research synthesis (+ the two lineage reports).
- `restyle-plan.md` — verified Claude design-system restyle.
- `implementation-phases.md` — the optimized phase plan (source of truth for build order).

Recommended order:

```
Phase 0  →  1A → 1B → 1C  ─┐
           (runtime lane)   ├→ Merge Gate A → 2A → 2B → 3A → 3B → 4A → 4B
    └→  F1 → F2 ────────────┘
        (foundation lane, parallel)
```

- **Phase 0 — Runtime truth.** Verify the deployed full-access launch and that `/plan` works over RPC. Gates everything.
- **Phase 1A/1B/1C — Runtime control plane (backend, no UI).** Exact contracts + RPC-safe plan bridge (1A), serialized runtime authority + redaction (1B), narrow relay endpoints + an unstyled end-to-end harness (1C). **1C is the first testable slice.**
- **Foundation F1/F2 — Claude restyle, inert, parallel lane.** Install Claude tokens + self-hosted fonts (F1) and the pre-paint theme bootstrap + service-worker cache/rollback (F2). Nothing changes visually yet; fenced off from app/protocol source until Merge Gate A.
- **Merge Gate A.** Dark control plane + inert foundation pass together; root deps reconciled once.
- **Phase 2A/2B — Mobile controls.** Model/Effort/Build|Plan on the unchanged transcript (2A, first phone milestone), then commands + explicit composer + draft recovery (2B).
- **Phase 3A/3B — Conversational transcript.** Derived turns + typed-evidence parity (3A), then named streaming phases + reader-controlled live edge + plan handoff (3B).
- **Phase 4A/4B — Cutover + release.** Global Claude cutover + restrained motion + turn actions (4A), then the physical-iPhone release + rollback gate (4B).

## 6. The restyle target

The Claude design system from the shared design library: a warm-paper editorial aesthetic — bone-parchment canvas, warm carbon-ink text tiers, a single restrained clay-orange accent (a signature mark, never a CTA flood), Anthropic Serif for headlines and Anthropic Sans for body, flat surfaces with generous radii and hairline borders. It ships a Tailwind v4 theme that matches this stack. Fonts are self-hosted (Source Serif 4 + Inter, woff2, integrity-manifested) so the offline PWA stays self-contained. The light-first Claude palette gets a WCAG-compliant derived dark palette so the app keeps light + dark. A pre-paint bootstrap prevents theme flash.

## 7. Success criteria

- Model, effort, and plan-mode are changeable from the phone, always reflecting host-confirmed state (never optimistic), and survive reconnect / Pi restart.
- `/` commands and quick actions work, insert into the draft (never auto-submit), and expose no privileged commands or raw paths.
- The transcript reads like a modern chat app while every typed block (text, thinking, plan, tool, diff, usage) stays inspectable and replay-safe.
- The whole PWA wears the Claude design system in light and dark, meets WCAG contrast, respects reduced motion, and passes a physical-iPhone release checklist.
- Every security invariant in section 3 still holds, proven by tests and negative controls.

## 8. How to run it

```
# one command (or double-click "Boot Pi Remote.command")
npm run boot                 # read-only default
npm run boot -- --full-access  # desktop-parity (operator opt-in)
```

Boot prints a tailnet HTTPS URL and a scannable enrollment QR. On the iPhone: connect Tailscale to the same tailnet, open the URL in Safari, Add to Home Screen, launch, then scan the QR (or paste the raw code) on the "Bind this phone once" screen. Enrollment is in-memory only, so re-enroll after each boot; the enrollment window is 30 minutes.
