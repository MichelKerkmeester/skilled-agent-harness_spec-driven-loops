# Pi Remote — Goal Prompt

Short goal prompt (kept under 4000 characters). The full, unabridged version is `goal.md`.

## Goal

Build an installable iPhone PWA that remote-controls the `pi` coding agent on a Mac over a private Tailscale tailnet, the way Claude Code pairs with the Claude mobile app, but self-hosted. Bring the mobile chat UI/UX up to the quality of the Claude and GPT apps, and add four agent controls: model switching, effort/reasoning-level switching, typed `/` commands, and a Build/Plan toggle. Apply the Claude "ink on parchment" design system across the whole PWA.

Key unlock: the `pi` child already exposes every needed capability over RPC (`get_available_models`/`set_model`, `get_available_thinking_levels`/`set_thinking_level`, `get_commands`, and `/plan` via the plan-mode extension). So the work is protocol-forwarding plus composer UX, not new agent capability.

## Non-negotiable security

Loopback relay, tailnet-only Serve with Funnel off, foreground authority, redaction everywhere, one-use ticketed and revision-checked mutations that fail closed, host/extension-enforced plan mode, content-free push. Full-access desktop-parity mode is an explicit operator opt-in (`--full-access` / `PI_REMOTE_FULL_ACCESS=1`); the phone can never enable it. The restyle keeps light and dark and meets WCAG contrast.

## Current state

App built, deployed, and running in full-access desktop-parity mode. Research and the optimized phased plan (including a verified Claude restyle plan) are complete. Nothing has been built from the plan yet. Repo: `github.com/MichelKerkmeester/remote-cli-agent-chat`.

## Plan (optimized build order)

```
Phase 0 -> 1A -> 1B -> 1C ---\
         (runtime lane)       >- Merge Gate A -> 2A -> 2B -> 3A -> 3B -> 4A -> 4B
    \-> F1 -> F2 ------------/
        (Claude foundation, parallel)
```

- Phase 0: verify the deployed full-access runtime and `/plan` over RPC. Gates everything.
- 1A/1B/1C: the dark runtime control plane (contracts + plan bridge, serialized authority + redaction, relay endpoints + unstyled harness). No UI.
- F1/F2 (parallel lane): install Claude tokens + self-hosted fonts, then the pre-paint theme bootstrap + service-worker cache. Inert, fenced off from app/protocol source until Merge Gate A.
- 2A/2B: mobile Model/Effort/Build|Plan controls, then commands + explicit composer + draft recovery.
- 3A/3B: turn-oriented transcript with typed-evidence parity, then named streaming phases + reader-controlled live edge + plan handoff.
- 4A/4B: global Claude visual cutover + restrained motion, then the physical-iPhone release and rollback gate.

First testable slice: Phase 1C (control plane proven end to end). First phone-visible milestone: Phase 2A.

## Next step

Phase 0. Then run the runtime lane (1A to 1C) and the Claude foundation lane (F1, F2) in parallel, joining at Merge Gate A.

## Docs

`goal.md` (full vision + posture), `HANDOVER.md` (resume + decisions + bug fixes), and the `047-pi-remote-desktop-parity-chat-ux` spec packet (`research/research.md`, `implementation-phases.md`, `restyle-plan.md`).
