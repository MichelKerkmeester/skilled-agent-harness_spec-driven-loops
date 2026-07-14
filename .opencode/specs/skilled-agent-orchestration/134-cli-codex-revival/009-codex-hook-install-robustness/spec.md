---
title: "Feature Specification: Codex hook install robustness"
description: "Make the Codex hook installer converge and self-heal so a reaped git worktree can never silently drop Codex guardrails to fail-open dormancy. Interim re-anchor containment and the durable installer fix (convergent reconcile, linked-worktree refusal, inline fail-loud emit, cross-runtime --check watchdog, source dedupe) are shipped, installed, and verified."
trigger_phrases: ["Codex hook install robustness", "codex installer re-anchor", "codex hook dormancy"]
importance_tier: important
contextType: planning
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
# Feature Specification: Codex hook install robustness
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY
Codex hook parity (child 007) is functionally verified — the adapters fire and block live — but the way those adapters get INSTALLED into user-global `~/.codex/hooks.json` is fragile. The installer anchors every mk-owned command at an absolute checkout path (`cd <ABSOLUTE_CHECKOUT_PATH> && node …`), and before containment 14 of 16 mk-owned entries were anchored at a stale, disposable git worktree. Reaping that worktree would silently drop 14/16 Codex guardrails to fail-open dormancy with no alert — strictly worse than Claude and OpenCode, whose repo-local hooks cannot fall off. A plain installer re-run cannot repair this because `hookIdentity()` discards the `cd` anchor and the dedup filter compares commands after skipping identity, so a stale-anchored entry reads as "already installed" forever and re-runs report `added: 0`.

**Status (read this first)**: the interim re-anchor containment and the durable installer fix are both **DONE, INSTALLED, and live-verified**. The convergent/repair-default reconcile, the linked-worktree anchor refusal, the inline `||` fail-loud emit, the cross-runtime `--check` watchdog, and the source dedupe are all shipped; installer self-test is 9/9 PASS, the reconcile was applied to the live `~/.codex/hooks.json` (backed up) with `--check` exiting 0, and a live `codex exec` fired SessionStart 5/5, UserPromptSubmit 3/3, Stop 4/4 with 0 Failed. This packet documents the defect, the two-model consult, the adjudicated decisions, and the shipped-and-verified fix.

**Key decisions** (see `decision-record.md`): reject SOL's runtime dispatcher (ADR-001); adopt a convergent/repair-default installer (ADR-002, shipped); add a linked-worktree anchor refusal (ADR-003, shipped); fail loud without a new global artifact via an inline `||` envelope plus a cross-runtime `--check` watchdog (ADR-004, shipped); cut SOL's launcher shim + LaunchAgent (ADR-005); dedupe the duplicated source `.codex/hooks.json` groups (ADR-006, shipped). The probe that gated the D4 fallback shape is resolved (ADR-007); the interim containment is recorded in ADR-008.
<!-- /ANCHOR:executive-summary -->
<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-14 |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../007-codex-hook-parity/spec.md` |
| **Successor** | none |
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
Three AI runtimes share one repo and must enforce identical guardrails: Claude Code via repo-local `.claude/settings.json` hooks, OpenCode via repo-local `.opencode/plugins/`, and Codex CLI 0.144.x via user-global `~/.codex/hooks.json` only (Codex has no repo-local hook file). Each guardrail is a thin `runtime/hooks/codex/` adapter over a runtime-neutral core, dual-consumed by the Claude hook and the OpenCode plugin, with Codex as the third consumer. The adapters themselves are verified working (fixture matrix 32/32; live `codex exec` gpt-5.6-luna xhigh fired SessionStart 5/5, UserPromptSubmit 3/3, Stop 4/4, honored the injected Gate-3 menu, and blocked a live `apply_patch` via spec-gate-enforce).

The defect is **install robustness**. The installer `.opencode/bin/install-codex-hooks.mjs` merges the repo `.codex/hooks.json` into `~/.codex/hooks.json`, emitting commands shaped `bash -c 'cd <ABSOLUTE_CHECKOUT_PATH> && node .opencode/skills/.../adapter.mjs'`. Before containment, 14 of 16 mk-owned entries were anchored (`cd`) at a stale, disposable git worktree `<repo>/.worktrees/0038-codex-hook-parity`; only 2 pointed at MAIN; 3 Superset `notify.sh` entries were preserved. Reaping that worktree would silently drop 14/16 Codex guardrails to fail-open dormancy with no alert. The root cause of why a re-run cannot fix it: `hookIdentity()` (`install-codex-hooks.mjs` ~line 43) deliberately discards the `cd` anchor, and the dedup filter (~line 98) compares commands **after** skipping identity, so a stale-anchored entry reads as "already installed" forever — re-runs report `added: 0` and never re-anchor.

### Purpose
Make the installer converge and self-heal: repair (re-anchor) mk-owned entries by identity on every run, refuse to anchor at a linked worktree, fail loud when a generated entry becomes unresolvable, and let the durable Claude/OpenCode SessionStart chain police the fragile global file — all without adding a new always-on global artifact, a runtime dispatcher, or a trust record. Delivered: the interim re-anchor shipped first, then the durable installer fix (D2 reconcile, D3 linked-worktree refusal, D4 fail-loud emit + `--check` watchdog, D6 source dedupe) was implemented, installed against the live `~/.codex/hooks.json`, and verified (self-test 9/9, `--check` clean, live smoke green).
<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
- Convergent/repair-default reconcile in `install-codex-hooks.mjs`: reconcile the mk-owned subset by `(owner,event,matcher,hookId)` with full command+anchor rewrite; preserve Superset/unknown entries verbatim; append exactly one entry per key; atomic temp+rename only on change; add a non-mutating `--check`.
- A linked-worktree anchor refusal: abort install if the installer's anchor is a linked worktree, unless `--allow-worktree`.
- Fail-loud emission: an inline `|| <additionalContext envelope>` per generated entry, plus wiring `install-codex-hooks.mjs --check` into the existing repo-local Claude/OpenCode SessionStart chain.
- Deduping the duplicated SessionStart groups in the source `.codex/hooks.json`.
- The probe: empirically confirm how Codex 0.144.x treats a hook command's non-zero exit before shipping the inline `||` fallback (resolved on 0.144.4; see ADR-007).
### Out of Scope
- A runtime dispatcher / global router (`~/.local/share/mk-codex-hooks/runner.mjs`) — rejected in ADR-001.
- An install-time trust record for a cwd-resolving global runner — moot once the dispatcher is rejected.
- A standalone global fail-loud health checker, a `doctor` launcher shim, or a LaunchAgent — cut in ADR-005.
- Any change to a runtime-neutral core, a Claude hook, or an OpenCode plugin (adapters are byte-frozen from 007).
### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| `.opencode/bin/install-codex-hooks.mjs` | Modify | Convergent reconcile + `--check` + linked-worktree refusal + inline fail-loud emit (D2/D3/D4). |
| `.codex/hooks.json` | Modify | Dedupe the duplicate SessionStart groups (`worktree-guard.sh`, `check-git-hooks.sh`) (D6). |
| Repo-local Claude/OpenCode SessionStart wiring | Modify | Add the `install-codex-hooks.mjs --check` watchdog to the durable runtimes (D4). |
<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
### P0 - Blockers
| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-001 | The installer converges: a stale-anchored mk-owned entry is repaired on the next run | A run against a `~/.codex/hooks.json` whose mk entries `cd` at a stale path rewrites every mk entry's anchor to the primary checkout; a second run reports no further change. |
| REQ-002 | Superset/unknown entries are preserved verbatim | The three `notify.sh` entries and any non-mk entry are byte-identical before and after a reconcile run. |
| REQ-003 | The installer refuses to anchor at a linked worktree | Running from a linked worktree (`git rev-parse --git-common-dir` ≠ `<toplevel>/.git`) aborts with a clear message unless `--allow-worktree` is passed. |
### P1 - Required
| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-004 | Resolution failure of a generated entry becomes loud | Each generated command carries an inline `||` envelope that emits "mk codex hook unresolvable — run installer --check" when the `cd`/`node`/file target cannot resolve. |
| REQ-005 | The durable runtimes police the fragile global file | `install-codex-hooks.mjs --check` runs non-mutating inside the repo-local Claude/OpenCode SessionStart chain and reports drift without self-repairing. |
| REQ-006 | The source `.codex/hooks.json` has no duplicate groups | `worktree-guard.sh` and `check-git-hooks.sh` each appear exactly once in the source SessionStart groups; the reconcile is deterministic. |
### P2 - Nice to have
| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-007 | The reconcile is atomic | The installer writes via temp+rename only when content changes; an interrupted run never leaves a half-written `~/.codex/hooks.json`. |
| REQ-008 | No collateral change | Diff shows zero change to any neutral core, Claude hook, or OpenCode plugin, and no new global artifact is created. |
<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **Met** — The reap-to-silent-dormancy failure class is closed: the shipped installer re-anchors mk-owned entries on every run (self-test 9/9), and anchoring at a linked worktree is refused (`assertSafeRepoAnchor`).
- **Met** — `~/.codex/hooks.json` has 0 worktree-anchored mk entries (MAIN 16 / superset 3 / worktree 0) with a restorable timestamped backup; the durable reconcile now keeps it converged.
- **Met** — The probe resolved the Codex 0.144.4 non-zero-exit behavior (fail-open; fallback reaches the model) before the inline `||` fallback shipped.
- **Met** — No new always-on global artifact, dispatcher, or trust record was introduced; the neutral cores and the Codex guard adapters stay byte-unchanged (only the installer, the source hook file, and the durable-runtime SessionStart wiring changed).
<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Risk | A reaped worktree drops 14/16 Codex guardrails silently | Codex sessions run unguarded with no alert | Interim re-anchor (shipped); durable convergent installer + linked-worktree refusal (shipped). |
| Risk | The installer converges to the NEXT stale worktree | The recurrence class reopens at a new anchor | Linked-worktree anchor refusal (D3): anchor only at the primary checkout. |
| Risk | A cwd-resolving global runner would be an ACE regression | Arbitrary code execution surface on every session | Dispatcher rejected (ADR-001); no global runner is introduced. |
| Dependency | Codex 0.144.x non-zero hook-exit behavior | The inline `||` fail-loud shape depends on it | Probe resolved on 0.144.4 (fail-open; fallback reaches the model) before D4 shipped (ADR-007). |
<!-- /ANCHOR:risks -->
<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS
### Performance
- **NFR-P01**: `--check` is read-only and completes within the SessionStart budget; it parses `~/.codex/hooks.json`, compares the mk-owned subset against the expected anchor, and reports — it performs no network or build work.
### Reliability
- **NFR-R01**: The reconcile is idempotent and atomic — repeated runs converge to one entry per key, and a write happens only on change via temp+rename, so an interrupted run never corrupts the user-global file.
### Security
- **NFR-S01**: No new global artifact, dispatcher, or trust record is added. `~/.codex/hooks.json` stays the one out-of-repo write, backed up before every mutating run and merged rather than replaced.
### Portability
- **NFR-PO1**: The installer stays a plain `.mjs` with no build step; the linked-worktree refusal uses `git rev-parse` only, so the behavior is reproducible on any machine and checkout.
<!-- /ANCHOR:nfr -->
<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES
- **Stale worktree anchor present**: reconcile rewrites every mk entry to the primary checkout; the second run is a no-op.
- **Running from a linked worktree**: abort with guidance unless `--allow-worktree`; never anchor policy at a disposable checkout.
- **Duplicate source groups**: the reconcile dedupes deterministically so a doubled `worktree-guard.sh` cannot produce two installed entries.
- **Superset/user entry present**: preserved verbatim; only mk-owned keys are reconciled.
- **Generated target unresolvable at runtime**: the inline `||` envelope emits the "run installer --check" message instead of silently no-opping (probe-confirmed on Codex 0.144.4: the fallback surfaces to the model).
- **`~/.codex/hooks.json` missing**: the installer creates it (backing up any existing file first), same as 007.
<!-- /ANCHOR:edge-cases -->
<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT
Level 3. The complexity is in **correctness and blast radius**, not volume: the durable fix touches one installer, one versioned source file, and the two durable runtimes' SessionStart wiring, but it changes how every Codex session resolves its guardrails and it edits user-global machine config. The load-bearing risk is that a convergent installer must repair without clobbering Superset/user entries and must not reintroduce dormancy (the reason SOL's gitignored-dist dispatcher was rejected). The two-model consult and the adjudicated decisions are the substance; the code delta is bounded.
<!-- /ANCHOR:complexity -->
<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX
| Risk ID | Description | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| R-001 | Reaped worktree silently drops 14/16 Codex guardrails | H | M | Interim re-anchor shipped; durable convergent installer shipped + verified |
| R-002 | Installer re-converges to the next stale worktree anchor | H | M | Linked-worktree anchor refusal (D3) |
| R-003 | A global cwd-resolving runner introduces an ACE surface | H | L | Dispatcher rejected (ADR-001); no global runner |
| R-004 | Inline `||` fallback ships against wrong Codex exit semantics | M | M | Probe (ADR-007) resolved the D4 fallback shape on 0.144.4 before it shipped |
| R-005 | Reconcile clobbers Superset/user entries | H | L | Reconcile only mk-owned keys; preserve unknown verbatim; backup + atomic write |
<!-- /ANCHOR:risk-matrix -->
<!-- ANCHOR:user-stories -->
## 11. USER STORIES
### US-001: A reaped worktree never silently disarms Codex (Priority: P0)
**As a** developer who prunes disposable git worktrees, **I want** the Codex installer to re-anchor its guardrails on the next run, **so that** removing a worktree can never leave Codex running unguarded without any signal.
### US-002: The installer anchors only at the primary checkout (Priority: P0)
**As a** maintainer, **I want** the installer to refuse to anchor policy at a linked worktree unless I force it, **so that** the stale-anchor recurrence class stays closed.
### US-003: Drift on the fragile global file is visible (Priority: P1)
**As a** developer, **I want** the durable Claude/OpenCode SessionStart chain to run `--check` against `~/.codex/hooks.json`, **so that** unresolvable Codex hooks surface loudly instead of failing open in silence.
<!-- /ANCHOR:user-stories -->
<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS
- **RESOLVED (probe)**: how does Codex 0.144.x treat a hook command's non-zero exit? A live probe on Codex 0.144.4 confirmed it marks the hook "Failed" but does NOT abort the session (fail-open holds), and `node <adapter> || printf <additionalContext>` reaches the model. The inline `||` fail-loud envelope was shaped to that behavior and shipped in D4a. See `decision-record.md` ADR-007.
<!-- /ANCHOR:questions -->
<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Records**: `decision-record.md`
- **Predecessor**: `../007-codex-hook-parity/spec.md`
<!-- /ANCHOR:related-docs -->
