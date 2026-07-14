---
title: "Decision Record: Codex hook install robustness"
description: "Two-model consult (SOL ultra vs Fable-5) and the adjudicated decisions: reject the runtime dispatcher, adopt a convergent/repair-default installer, add a linked-worktree anchor refusal, fail loud without a new global artifact, cut the launcher shim, dedupe the source hook file. Plus the open probe and the shipped containment note."
trigger_phrases: ["Codex install robustness decisions", "codex installer ADR", "convergent installer decision"]
importance_tier: important
contextType: implementation
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival/009-codex-hook-install-robustness"
    last_updated_at: "2026-07-14T19:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Shipped+verified durable convergent installer (D2/D3/D4/D6); self-test 9/9; probe resolved"
    next_safe_action: "packet complete; Part B (CLI spec consolidation) is a separate packet"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: ["Codex 0.144.4 marks a non-zero hook exit Failed but does NOT abort the session (fail-open holds), and `node <adapter> || printf <additionalContext>` reaches the model — so the inline || emit is valid and shipped (ADR-007 resolved)."]
---
# Decision Record: Codex hook install robustness
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

## Two-Model Consult

We consulted two models on the durable fix, each grounded in reads of the real installer `.opencode/bin/install-codex-hooks.mjs`. The orchestrator adjudicated in favor of Fable-5's plan.

- **GPT-5.6-sol (ultra)** recommended: (a) **verdict** — replace absolute anchors with a stable user-global **DISPATCHER** (`~/.local/share/mk-codex-hooks/runner.mjs`) that forwards stdin, resolves the active worktree from `payload.cwd` at runtime (`git -C <cwd> rev-parse --show-toplevel`), validates git-common-dir against an install-time trust record, then invokes the allowlisted repo-relative adapter; `~/.codex/hooks.json` becomes a global router and policy stays worktree-local. (b) **P0** convergent/repair-default installer. (c) **P1** a standalone global fail-loud SessionStart health checker. (d) **P2** a `doctor` launcher shim + optional LaunchAgent.
- **Fable-5** (independently verified) reviewed: **AGREE** with SOL's root-cause read and the convergent-installer half; but **CUT the dispatcher**. Evidence: the adapters ALREADY resolve repo STATE from `payload.cwd` (`spec-gate-enforce.mjs:69` `const projectDir = payload?.cwd || …`), so the dispatcher's headline benefit is redundant; a byte-compare of all 12 wired files (8 adapters + 4 dist lifecycle) between MAIN and the 0038 worktree found 12/12 IDENTICAL, so "wrong-branch code" is theoretical only; `dist/` is gitignored, so a cwd-resolving dispatcher would route fresh-worktree sessions to non-existent dist lifecycle hooks (recreating the dormancy it is meant to fix); and a global runner that resolves arbitrary cwd is an arbitrary-code-execution regression that then needs SOL's own trust record to patch. Fable also caught **two gaps SOL missed**: (1) without a LINKED-WORKTREE ANCHOR REFUSAL the installer just converges to the NEXT stale worktree (it derives its anchor from its own location); (2) the repo `.codex/hooks.json` lists `worktree-guard.sh` and `check-git-hooks.sh` TWICE (a reconciling installer must dedupe deterministically).

<!-- ANCHOR:adr-001 -->
## ADR-001: D1 — Reject SOL's runtime dispatcher
<!-- ANCHOR:adr-001-context -->
### Context
SOL proposed a stable user-global dispatcher (`~/.local/share/mk-codex-hooks/runner.mjs`) that resolves the active worktree from `payload.cwd` at runtime and routes to the repo-relative adapter, turning `~/.codex/hooks.json` into a global router. The question was whether that indirection is worth adding.
<!-- /ANCHOR:adr-001-context -->
<!-- ANCHOR:adr-001-decision -->
### Decision
**REJECT SOL's runtime dispatcher.** Rationale: redundant (adapters resolve state from `payload.cwd`), unnecessary (12/12 wired files byte-identical MAIN-vs-worktree), anti-correct (gitignored `dist` breaks lifecycle hooks in fresh worktrees), and a security regression (cwd-resolved global runner = ACE).
<!-- /ANCHOR:adr-001-decision -->
<!-- ANCHOR:adr-001-alternatives -->
### Alternatives
Adopt the dispatcher as SOL proposed (rejected on the four grounds above). Adopt the dispatcher but gate it behind the trust record (rejected: the trust record exists only to patch the ACE hole the dispatcher itself opens — net-new surface for no net benefit).
<!-- /ANCHOR:adr-001-alternatives -->
<!-- ANCHOR:adr-001-consequences -->
### Consequences
No global runner, no trust record. `~/.codex/hooks.json` stays a set of primary-checkout-anchored entries; the installer, not a runtime resolver, is the point of control. The dispatcher's one real benefit (worktree-local policy) is unneeded because the adapters already read `payload.cwd`.
<!-- /ANCHOR:adr-001-consequences -->
<!-- ANCHOR:adr-001-five-checks -->
### Five Checks
Clarity: no indirection layer. Systems: fewer moving parts on every session. Bias: verified with a byte-compare, not assumed. Sustainability: no global executable to maintain. Value: avoids an ACE regression.
<!-- /ANCHOR:adr-001-five-checks -->
<!-- ANCHOR:adr-001-impl -->
### Implementation Notes
Nothing to build. The rejection is load-bearing: subsequent ADRs must not smuggle a runtime resolver back in.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

<!-- ANCHOR:adr-002 -->
## ADR-002: D2 — Adopt a convergent/repair-default installer
<!-- ANCHOR:adr-002-context -->
### Context
The current installer's `hookIdentity()` (~line 43) discards the `cd` anchor, and the dedup filter (~line 98) compares commands after skipping identity, so a stale-anchored mk entry reads as "already installed" forever and re-runs report `added: 0`. The installer can never repair a stale anchor.
<!-- /ANCHOR:adr-002-context -->
<!-- ANCHOR:adr-002-decision -->
### Decision
**ADOPT a convergent/repair-default installer — SHIPPED.** Reconcile the mk-owned subset by `(owner,event,matcher,hookId)` with full command+anchor rewrite; preserve Superset/unknown entries verbatim; append exactly one entry per key; atomic temp+rename only on change; add `--check` (non-mutating). Drop SOL's `--reanchor` (redundant once repair is the default and identity is anchor-independent).
<!-- /ANCHOR:adr-002-decision -->
<!-- ANCHOR:adr-002-alternatives -->
### Alternatives
Keep identity-based dedup and add an explicit `--reanchor` flag (rejected: repair should be the default, not an opt-in the operator must remember after a worktree is reaped). Replace-not-merge (rejected: clobbers Superset/user entries).
<!-- /ANCHOR:adr-002-alternatives -->
<!-- ANCHOR:adr-002-consequences -->
### Consequences
Every run converges: a stale anchor is rewritten, a clean run is a no-op. Identity becomes anchor-independent so a re-run cannot mistake a stale entry for a current one. `--check` gives a non-mutating drift report reusable by the durable runtimes (ADR-004).
<!-- /ANCHOR:adr-002-consequences -->
<!-- ANCHOR:adr-002-five-checks -->
### Five Checks
Clarity: one reconcile path. Systems: touches only mk-owned keys. Bias: keyed on structure, not on brittle string identity. Sustainability: idempotent + atomic. Value: makes a re-run actually heal.
<!-- /ANCHOR:adr-002-five-checks -->
<!-- ANCHOR:adr-002-impl -->
### Implementation Notes
Key the mk subset explicitly; rewrite command+anchor from the resolved primary checkout; write via temp+rename only when the serialized content changes so a clean run touches no bytes. **Shipped** in `.opencode/bin/install-codex-hooks.mjs`; `hookIdentity()` was hardened to extract the first script after the `node`/`bash`/`python` runner so the D4a fallback text cannot corrupt the dedupe identity. Installer self-test 9/9 PASS (reconcile re-anchors a stale entry; a second reconcile reports `changed:false`; backup + JSON validation; `--check`/`--dry-run` mutually exclusive).
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

<!-- ANCHOR:adr-003 -->
## ADR-003: D3 — Add a linked-worktree anchor refusal
<!-- ANCHOR:adr-003-context -->
### Context
The installer derives its anchor from its own location. Run from a linked worktree, it would happily anchor policy at that disposable checkout — so a convergent installer alone would just converge to the NEXT stale worktree (Fable's gap #1).
<!-- /ANCHOR:adr-003-context -->
<!-- ANCHOR:adr-003-decision -->
### Decision
**ADD a linked-worktree anchor refusal — SHIPPED.** If `git rev-parse --git-common-dir` ≠ `<toplevel>/.git`, abort install unless `--allow-worktree`. Closes the recurrence class (installer must anchor at the primary checkout, never a linked worktree).
<!-- /ANCHOR:adr-003-decision -->
<!-- ANCHOR:adr-003-alternatives -->
### Alternatives
Warn but proceed (rejected: a warning does not stop the recurrence). Always resolve to the primary checkout silently (rejected: a deliberate `--allow-worktree` run should still be possible for testing; refusal-by-default with an explicit override is safer and more honest).
<!-- /ANCHOR:adr-003-alternatives -->
<!-- ANCHOR:adr-003-consequences -->
### Consequences
The stale-anchor recurrence class is closed at the source: policy can only be anchored at the primary checkout unless the operator explicitly overrides. Combined with ADR-002, a reaped worktree is both prevented (refusal) and repaired (convergence).
<!-- /ANCHOR:adr-003-consequences -->
<!-- ANCHOR:adr-003-five-checks -->
### Five Checks
Clarity: one guard at install time. Systems: uses `git rev-parse` only. Bias: fixes the real recurrence, not the symptom. Sustainability: no state to maintain. Value: prevents re-drift.
<!-- /ANCHOR:adr-003-five-checks -->
<!-- ANCHOR:adr-003-impl -->
### Implementation Notes
Compare `git rev-parse --git-common-dir` against `<toplevel>/.git`; abort with a clear message naming `--allow-worktree` as the deliberate override. **Shipped** as `assertSafeRepoAnchor` in `install-codex-hooks.mjs`; self-test 9/9 PASS (aborts when `--repo` points at a linked worktree; `--allow-worktree` bypasses).
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

<!-- ANCHOR:adr-004 -->
## ADR-004: D4 — Fail loud without a new global artifact
<!-- ANCHOR:adr-004-context -->
### Context
SOL wanted a standalone global fail-loud SessionStart health checker. But Codex's global file has no durable owner, and the guards are intentionally fail-open on POLICY (exit 0). The risk is not policy fail-open — it is silent RESOLUTION failure (a missing `cd`/`node`/file target) with no signal.
<!-- /ANCHOR:adr-004-context -->
<!-- ANCHOR:adr-004-decision -->
### Decision
**FAIL-LOUD without a new global artifact — SHIPPED.** The installer emits an inline `|| <additionalContext envelope: "mk codex hook could not resolve; re-run the codex hooks installer with --check">` per generated entry (guards stay fail-open on POLICY via their own exit-0 design, but resolution failure — missing `cd`/`node`/file — becomes loud), AND wires `install-codex-hooks.mjs --check` into the existing repo-local Claude/OpenCode SessionStart chain so the durable runtimes police the fragile global file. Do NOT build a standalone global checker; do NOT self-repair from SessionStart (the table is already loaded; concurrent sessions would race).
<!-- /ANCHOR:adr-004-decision -->
<!-- ANCHOR:adr-004-alternatives -->
### Alternatives
Standalone global health checker (rejected: a new always-on global artifact with no durable owner — the same fragility class as the file it polices). Self-repair from SessionStart (rejected: the hook table is already loaded for that session, and concurrent sessions would race on the write).
<!-- /ANCHOR:adr-004-alternatives -->
<!-- ANCHOR:adr-004-consequences -->
### Consequences
Resolution failure surfaces loudly per entry, and the two durable repo-local runtimes (which cannot fall off) become the watchdog for the fragile global file — no new global executable. The exact inline `||` shape depends on the OPEN PROBE (ADR-007).
<!-- /ANCHOR:adr-004-consequences -->
<!-- ANCHOR:adr-004-five-checks -->
### Five Checks
Clarity: loud on resolution failure, quiet on policy pass. Systems: reuses the durable SessionStart chain. Bias: polices the fragile file from the robust ones. Sustainability: no new global artifact. Value: converts silent dormancy into a visible signal.
<!-- /ANCHOR:adr-004-five-checks -->
<!-- ANCHOR:adr-004-impl -->
### Implementation Notes
**Shipped.** The `||` envelope was emitted after the OPEN PROBE (ADR-007) confirmed its shape on Codex 0.144.4: 16 of 19 mk commands are wrapped with `... || printf %s "<one-line JSON envelope>"` (the 3 Superset `notify.sh` correctly untouched), each with an event-specific `hookEventName` and a filename-free `additionalContext`. `--check` is wired as a read-only step in both durable runtimes — a 5th SessionStart hook in `.claude/settings.json` (non-blocking) and the new OpenCode plugin `.opencode/plugins/mk-codex-hooks-watchdog.js` (logs drift to a bounded workspace log, never stdout; fail-open; load-tested across 5 event shapes). It reports drift and never writes.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

<!-- ANCHOR:adr-005 -->
## ADR-005: D5 — Cut SOL's launcher shim + LaunchAgent
<!-- ANCHOR:adr-005-context -->
### Context
SOL's P2 proposed a `doctor` launcher shim plus an optional LaunchAgent to periodically re-run the installer. The threat (drift while no session is active) is real, but a persistent background agent is a heavy, always-on cost tier.
<!-- /ANCHOR:adr-005-context -->
<!-- ANCHOR:adr-005-decision -->
### Decision
**CUT SOL's P2 launcher shim + LaunchAgent** (real threat, wrong cost tier; the cross-runtime `--check` watchdog covers most of it).
<!-- /ANCHOR:adr-005-decision -->
<!-- ANCHOR:adr-005-alternatives -->
### Alternatives
Ship the LaunchAgent (rejected: a persistent per-user daemon for a problem the next SessionStart `--check` already catches). Ship only the `doctor` shim (deferred: could be a later convenience, but not part of the durable fix).
<!-- /ANCHOR:adr-005-alternatives -->
<!-- ANCHOR:adr-005-consequences -->
### Consequences
No background daemon. Drift is caught at the next Claude/OpenCode SessionStart via `--check` (ADR-004), which is when a developer is actually about to work, so the coverage gap (drift while nobody is working) has no practical impact.
<!-- /ANCHOR:adr-005-consequences -->
<!-- ANCHOR:adr-005-five-checks -->
### Five Checks
Clarity: no daemon. Systems: no launchd surface. Bias: sized to the real threat. Sustainability: nothing extra to run. Value: same coverage at lower cost.
<!-- /ANCHOR:adr-005-five-checks -->
<!-- ANCHOR:adr-005-impl -->
### Implementation Notes
None — this is a deliberate omission. Revisit only if drift-while-idle is ever observed to matter.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

<!-- ANCHOR:adr-006 -->
## ADR-006: D6 — Dedupe the source `.codex/hooks.json` duplicate groups
<!-- ANCHOR:adr-006-context -->
### Context
The repo `.codex/hooks.json` lists `worktree-guard.sh` and `check-git-hooks.sh` TWICE in the SessionStart groups (Fable's gap #2). A reconciling installer must resolve that deterministically or it could install two entries for one key.
<!-- /ANCHOR:adr-006-context -->
<!-- ANCHOR:adr-006-decision -->
### Decision
**DEDUPE the source `.codex/hooks.json` duplicate SessionStart groups — SHIPPED** (`worktree-guard.sh`, `check-git-hooks.sh` appeared twice).
<!-- /ANCHOR:adr-006-decision -->
<!-- ANCHOR:adr-006-alternatives -->
### Alternatives
Dedupe only at reconcile time and leave the source doubled (rejected: the source-of-truth should be correct; a doubled source is a latent trap for the next editor). Ignore it (rejected: non-deterministic reconcile output).
<!-- /ANCHOR:adr-006-alternatives -->
<!-- ANCHOR:adr-006-consequences -->
### Consequences
The source is clean and the reconcile is deterministic: each mk key resolves to exactly one installed entry regardless of run order.
<!-- /ANCHOR:adr-006-consequences -->
<!-- ANCHOR:adr-006-five-checks -->
### Five Checks
Clarity: one entry per guard. Systems: source matches installed. Bias: fixes the data, not just the reader. Sustainability: no latent double. Value: deterministic install.
<!-- /ANCHOR:adr-006-five-checks -->
<!-- ANCHOR:adr-006-impl -->
### Implementation Notes
Remove the duplicate SessionStart group entries in the source file; assert single-occurrence in the reconcile test. **Shipped**: `.codex/hooks.json` SessionStart was deduped from four mk groups down to two, so `worktree-guard.sh` and `check-git-hooks.sh` each remain once in the first group and the reconcile is deterministic.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

<!-- ANCHOR:adr-007 -->
## ADR-007: Codex non-zero hook-exit behavior (RESOLVED — pre-req for D4)
<!-- ANCHOR:adr-007-context -->
### Context
D4's inline `||` fail-loud envelope depends on how Codex 0.144.x treats a hook command's non-zero exit — whether it surfaces the stderr/`additionalContext`, marks the hook Failed, or ignores it. This was confirmed empirically by a live probe before the emit shipped.
<!-- /ANCHOR:adr-007-context -->
<!-- ANCHOR:adr-007-decision -->
### Decision
**RESOLVED — confirmed by a live probe on Codex 0.144.4.** A non-zero hook exit is marked "Failed" but does NOT abort the session (fail-open holds), and `node <adapter> || printf <additionalContext>` reaches the model (the model echoed the injected marker). The inline `||` emit is therefore valid and has shipped in `.codex/hooks.json` (D4a).
<!-- /ANCHOR:adr-007-decision -->
<!-- ANCHOR:adr-007-alternatives -->
### Alternatives
Ship the `||` envelope against an assumed behavior (rejected: a wrong shape could be silently ignored, defeating the fail-loud goal). Skip the inline emit entirely and rely only on `--check` (would have been the fallback had the probe shown Codex ignores non-zero exits — not needed: the probe showed 0.144.4 surfaces the fallback to the model, so the inline emit shipped).
<!-- /ANCHOR:adr-007-alternatives -->
<!-- ANCHOR:adr-007-consequences -->
### Consequences
The probe gated only the D4 emit; the reconcile (ADR-002), worktree refusal (ADR-003), `--check` wiring (ADR-004), and dedupe (ADR-006) proceeded independently and shipped. Because Codex 0.144.4 surfaces the fallback to the model (rather than ignoring the non-zero exit), the inline emit is the primary fail-loud signal, backed by the cross-runtime `--check` watchdog.
<!-- /ANCHOR:adr-007-consequences -->
<!-- ANCHOR:adr-007-five-checks -->
### Five Checks
Clarity: one unknown, one probe. Systems: affects only the emit shape. Bias: measure before shipping. Sustainability: pinned to the observed 0.144.x behavior. Value: prevents a silently-ignored fallback.
<!-- /ANCHOR:adr-007-five-checks -->
<!-- ANCHOR:adr-007-impl -->
### Implementation Notes
The live probe ran a deliberately non-zero-exit hook under `codex exec` on Codex 0.144.4 and observed: exit marked Failed, session not aborted, `additionalContext` from the `|| printf` fallback reached the model. The D4a emit was shaped to that result — a filename-free one-line JSON envelope per mk command — and validated (a failing adapter emits valid JSON), then confirmed in a real install where the fallback fired 0 times during normal operation.
<!-- /ANCHOR:adr-007-impl -->
<!-- /ANCHOR:adr-007 -->

<!-- ANCHOR:adr-008 -->
## ADR-008: Containment — interim re-anchor (SHIPPED)
<!-- ANCHOR:adr-008-context -->
### Context
Before the durable fix could be approved and built, the live `~/.codex/hooks.json` still had 14 mk entries anchored at the disposable worktree, so a worktree reap would silently drop 14/16 Codex guardrails. An interim fix was needed to remove that risk today.
<!-- /ANCHOR:adr-008-context -->
<!-- ANCHOR:adr-008-decision -->
### Decision
**SHIPPED this session.** Interim re-anchor executed: rewrote all 14 stale `…/Public/.worktrees/0038-codex-hook-parity` command prefixes → `…/Public` in `~/.codex/hooks.json`. Precondition verified (all referenced files exist in MAIN; 0 byte-diffs). Backup: `~/.codex/hooks.json.bak-2026-07-14T19-01-32`. Post-state: MAIN-repo 16, superset-notify 3, worktree 0. Smoke test (`codex exec` gpt-5.5 low, read-only): SessionStart 5/5, UserPromptSubmit 3/3, Stop 4/4 Completed, 0 Failed. Rollback = restore the timestamped backup.
<!-- /ANCHOR:adr-008-decision -->
<!-- ANCHOR:adr-008-alternatives -->
### Alternatives
Wait for the durable fix before doing anything (rejected: leaves the reap → silent dormancy window open). Delete the mk entries (rejected: that IS the dormancy we are preventing).
<!-- /ANCHOR:adr-008-alternatives -->
<!-- ANCHOR:adr-008-consequences -->
### Consequences
The reap → silent dormancy risk is removed TODAY. This is **containment, not the durable fix**: a plain installer re-run still cannot re-anchor until D2 lands, so the recurrence class stays open until the convergent installer + linked-worktree refusal ship.
<!-- /ANCHOR:adr-008-consequences -->
<!-- ANCHOR:adr-008-five-checks -->
### Five Checks
Clarity: one targeted rewrite. Systems: user-global file only, backed up. Bias: precondition byte-verified before writing. Sustainability: interim only — superseded by D2. Value: closes the live window now.
<!-- /ANCHOR:adr-008-five-checks -->
<!-- ANCHOR:adr-008-impl -->
### Implementation Notes
Keep the timestamped backup until the durable fix lands. Do not treat this as closing the packet — the durable-fix checks in `checklist.md` remain unchecked.
<!-- /ANCHOR:adr-008-impl -->
<!-- /ANCHOR:adr-008 -->
