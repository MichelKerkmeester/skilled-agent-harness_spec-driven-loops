# Pi Remote — Handover

> Pick-up-where-we-left-off document. Read this, then `goal.md` for the full vision, then `implementation-phases.md` (in the spec-kit packet) for the build order.

---

## TL;DR

The app is built, deployed, and running in full-access desktop-parity mode. Research and the phased implementation plan (including a verified Claude-restyle plan) are complete and optimized. **Nothing has been built from the plan yet.** The unambiguous next step is **Phase 0** (verify the deployed full-access runtime + `/plan` over RPC), which gates everything else.

## What is done and live

- **App:** full monorepo builds; format, lint, typecheck, relay + web tests, and release-verify all pass (operator-only checks pending).
- **Deployment:** booted end-to-end and verified — Tailscale Serve up (tailnet-only, Funnel off), relay reachable and auth-gating, the live `pi` child running under `--full-access`, enrollment QR/code minted (30-minute window).
- **Full-access mode:** wired behind `--full-access` / `PI_REMOTE_FULL_ACCESS=1` → `fullAccessPiArguments()` in `apps/pi-remote-relay/src/index.ts`; boot flag in `scripts/boot.mjs`; verified against the real code and gate.
- **GitHub:** pushed to https://github.com/MichelKerkmeester/pi-mobile-pwa-tailscale (branch `main`). `deploy/serve.env`, the relay DB, `node_modules`, and runtime symlinks are gitignored.
- **Research + plan:** complete (see below).

## Where everything lives

App code: this repository (`apps/`, `packages/`, `extensions/`, `deploy/`, `scripts/`, `docs/`, `tests/`).

Planning artifacts (in the spec-kit packet `047-pi-remote-desktop-parity-chat-ux`, under the framework `specs/` tree — not in this repo):

- `research/research.md` — merged research synthesis (Grok 4.5 + GPT 5.6 SOL fan-out), plus `research/lineages/*/research.md`.
- `restyle-plan.md` — Claude design-system restyle (verified and corrected).
- `restyle-plan-verification.md` — the adversarial verification (9 must-fixes, all resolved).
- `implementation-phases.md` — the optimized phase plan. **Source of truth for build order.**
- Prior packet `044-pi-mobile-ui-ux-research` — earlier multi-surface UI/UX research (112 findings).

## Immediate next step

**Phase 0 — Deployed Runtime Boundary and Legacy-Contract Audit.** Verify the live full-access launch args and that RPC mode loads a usable `/plan` extension; add a black-box runtime verifier; capture a rollback baseline; correct legacy steering-only docs. It unblocks both the runtime lane (1A) and the foundation lane (F1).

Build order:
```
Phase 0 → 1A → 1B → 1C → [Merge Gate A] → 2A → 2B → 3A → 3B → 4A → 4B
    with F1 → F2 running in parallel after Phase 0, joining at Merge Gate A.
```
First testable slice: **Phase 1C** (unstyled harness proving the whole control plane). First phone-visible milestone: **Phase 2A**.

## Decisions log (this session)

- **Desktop parity over approval-gating.** Operator chose full-access (`pi` executes directly, no per-action approval). Wired as an explicit opt-in; network boundary unchanged.
- **App moved out of the framework repo** into this standalone repo, with runtime folders (`.opencode`, `.pi`, etc.) symlinked and gitignored.
- **Restyle = Claude design bundle**, applied via an isolated inert Foundation track (F1/F2) that runs parallel to the backend and only merges before the UI phases.
- **Dark mode kept.** Claude is light-first; the plan derives a WCAG-compliant dark palette rather than dropping dark support.
- **Research fan-out:** DeepSeek Flash was dropped from the research lineage (it cannot self-orchestrate the fan-out workflow, proven); Grok 4.5 + GPT SOL carried it. DeepSeek Flash was used successfully for direct write-from-spec tasks (code + doc edits).
- **Plan optimized** by splitting oversized phases into A/B/C slices and pulling the restyle onto a parallel lane.

## Open loose ends

- **Grok 4.6 allowlist is half-applied.** Added to `executor-config.ts` (+ tests) but the fan-out CJS copy keeps getting reverted by a concurrent `deep-031` deep-research run's write-containment. Land it (and the cli-pi direct-lineage-prompt fix in `fanout-run.cjs`) when that run is quiet. This is framework-tooling, not app code.
- **Packet relocation.** The 047 planning packet could be relocated under the `pi-remote` spec parent as phase `017` per the original Gate-3 choice — bookkeeping, not started.
- **Enrollment ergonomics.** Codes are in-memory + 30-minute TTL, so re-enroll after each boot. A persistent device-trust store is possible but is a deliberate security tradeoff (currently "nothing persisted").
- **Operator-only checks** for release-verify (real Tailscale Serve, on-device push, sandbox-exec, live Pi) remain the operator's to confirm.

## Bugs fixed this session (so they do not resurface)

- **pi version pin** in `boot.mjs` relaxed from an exact match to the `0.84` minor line (pi auto-updated to 0.84.2).
- **Tailscale Serve status parser** in `boot.mjs` rewrote to read the real `serve status --json` shape (`Web["host:443"].Handlers[...].Proxy`) and to poll until routes register.
- **`funnel off` clobbers serve config** on this Tailscale version — `assertFunnelOff()` made read-only (it no longer wipes the serve routes it just published).
- **Vite preview blocked the tailnet host** — added the tailnet host to `preview.allowedHosts` in `apps/pi-remote-web/vite.config.ts` (the app was unreachable from the phone until this).
- **Enrollment window** raised 5 → 30 minutes (`DEFAULT_CHALLENGE_TTL_MS` in the relay enrollment) to fit an async workflow.
- **Enrollment payload must be complete** — the web guard requires `expiresAt`; never hand out a trimmed code.

## How to resume / run

```
# from this repo root
npm run boot                     # read-only default
npm run boot -- --full-access    # desktop-parity (operator opt-in)
# or double-click "Boot Pi Remote.command"
```

Boot prints a tailnet HTTPS URL + a scannable enrollment QR. On the iPhone: Tailscale on the same tailnet → open the URL in Safari → Add to Home Screen → launch → on "Bind this phone once" tap Scan image → Take Photo (or paste the raw code) → Enroll. Re-enroll after each boot.

## Executor / dispatch reference (how the planning was produced)

- **GPT 5.6 SOL** via cli-codex: `codex exec --model gpt-5.6-sol -c model_reasoning_effort="high|xhigh" -c service_tier="fast" -c sandbox_mode="workspace-write" -c approval_policy="never"`. Used for the phase plan, the restyle plan, the adversarial verification, and the optimization pass.
- **Grok 4.5** via cli-cursor (`cursor-grok-4.5-high`) and **GPT SOL** via cli-codex: the two research lineages.
- **DeepSeek v4 Flash** via cli-pi: `pi -p "<prompt>" --provider opencode-go --model deepseek-v4-flash --thinking medium --tools read,write,edit,grep,find,ls,bash --no-extensions --no-context-files`. Used for the full-access wiring and folding the restyle into the phases. Note `--no-extensions` is required when running pi from the framework worktree (a plan-extension conflict otherwise).
- Dispatched non-interactive agents must set `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1` and be told the spec-folder scope is pre-resolved, or they stall at the framework's documentation gate.
