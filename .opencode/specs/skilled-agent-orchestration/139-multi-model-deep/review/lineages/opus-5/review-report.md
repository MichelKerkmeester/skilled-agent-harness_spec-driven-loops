# Deep Review Report — opus-5 lineage

**Spec folder:** `skilled-agent-orchestration/139-multi-model-deep`
**Lineage:** opus-5 (native, model=opus) · session `fanout-opus-5`
**Scope:** recent daemon-reliability + reap fix + hook-portability work (12 files)
**Iterations:** 1 (maxIterations=1) · **Stop reason:** maxIterations reached
**Dimensions covered:** correctness, security, traceability, maintainability (4/4)

---

## 1. Executive Summary

**Verdict: PASS** (`hasAdvisories: true`)
**Release readiness: converged**

| Severity | Active | 
|----------|--------|
| P0 | 0 |
| P1 | 0 |
| P2 | 9 |

The change set under review is a **defect fix**, not a feature: it reaps the released
re-election daemon on the stale-lease reclaim branch so a fresh session started after owner
disposal cannot spawn a second writer on the same WAL database, plus a cross-machine
hook-portability fix (resolve project root from the runtime env var with a `$PWD` fallback,
run `node` from PATH instead of a hardcoded `/opt/homebrew/bin/node`). The reap fix closes a
prior would-be P0 (double-writer / SQLite corruption) and is backed by a live two-launcher
durability test that asserts a single sqlite opener after a fresh-session reclaim. No new P0 or
P1 was found. The nine P2 findings are advisories: two low-probability correctness edges that
mirror already-accepted risk patterns, one config-hygiene exposure, three traceability/tooling
gaps, and three maintainability items.

Scope note: spec folder 139 is the review-orchestration packet (its `spec.md` is a Level-2
scaffold); the reviewed *code* traces to packets 028 (reap) and 138 (portability).

---

## 2. Planning Trigger

**PASS → no remediation plan required.** Route follow-ups as optional cleanup, not a blocking
plan. The single highest-value advisory is F007 (add a live test for the default-on combined
path) followed by F005 (close the hygiene-checker word-order gap so F004 is mechanically caught).
If a cleanup packet is opened, F003/F004/F005/F006/F008 are small, independent, and batchable.

---

## 3. Active Finding Registry

| ID | Sev | Dim | Title | Evidence |
|----|-----|-----|-------|----------|
| F001 | P2 | correctness | PID-reuse hazard in stale-reclaim reap; no under-lock lease re-confirm like the dead-socket path | `mk-spec-memory-launcher.cjs:1489-1501`, `:691-727` |
| F002 | P2 | correctness | Re-election release path fire-and-forgets model-server `SIGTERM` (no await/`SIGKILL` escalation) | `mk-spec-memory-launcher.cjs:1372-1385` (cf. `:1409-1417`) |
| F003 | P2 | security | Tracked `settings.local.json` ships ablation env + personal allowlist to all cloners | `.claude/settings.local.json:2-29` |
| F004 | P2 | traceability | Comment-hygiene rule violation: `// ... 096 packet ...` in launchers | `mk-spec-memory-launcher.cjs:1025`, `mk-code-index-launcher.cjs:715` |
| F005 | P2 | traceability | Hygiene checker matches `packet 096` but not `096 packet` ordering (F004 evades) | `check-comment-hygiene.sh:169` (verified: exit 0 vs 1) |
| F006 | P2 | traceability | Live test sets `SPEC_KIT_DB_DIR`, consumed only by `worktree-session.sh` (no-op isolation env) | `daemon-reelection-adoption-live.vitest.ts:138`; `worktree-session.sh:149` |
| F007 | P2 | maintainability | No live test for fresh-session reclaim *while a secondary is connected* (default-on combined path) | `daemon-reelection-adoption-live.vitest.ts:182-268` |
| F008 | P2 | maintainability | Python script with a `.sh` extension | `check-comment-hygiene.sh:1` |
| F009 | P2 | maintainability | Cross-runtime hook asymmetry (devin UserPromptSubmit→skill-advisor vs codex→spec-kit) | `.devin/hooks.v1.json:8` vs `.codex/hooks.json:20` |

All findings `status: active`, `firstSeen: 1`, `lastSeen: 1`. No severity transitions (single pass).

---

## 4. Remediation Workstreams

**WS-A — Daemon-reap hardening (optional, correctness)** · F001, F002
- F001: before reaping `orphanChildPid`, re-confirm it still matches the lease `childPid` (and
  optionally probe the daemon socket) so a recycled pid is not signalled — mirror the dead-socket
  path's under-respawn-lock re-check. Or document the accepted PID-reuse risk inline as the other
  reap sites do.
- F002: on the release branch, await the model-server exit with a `SIGKILL` escalation (as in the
  normal shutdown path) or have the fresh-session stale-reclaim also reap the lease's
  `modelServerPid`, not just `childPid`.

**WS-B — Comment-hygiene enforcement (traceability/tooling)** · F004, F005
- F005: extend `VIOLATION_PATTERNS` to catch `\b\d{3}\s+packet\b` (and/or a leading-number form) so
  the "NNN packet" ordering is detected.
- F004: rewrite the two launcher comments to drop the packet label (keep the durable WHY:
  "compatibility symlink removed once singular-path consumers were cleaned up").

**WS-C — Test fidelity & coverage (validation)** · F006, F007
- F006: drop the no-op `SPEC_KIT_DB_DIR` env (or replace with the env the launcher/daemon actually
  reads) and add a one-line comment that isolation comes from the launcher real-copy.
- F007: add a fourth live case — fresh session reclaims/reaps the released daemon while a secondary
  is bridged — asserting the secondary's proxy reattaches to the respawn and single-writer holds.

**WS-D — Config & naming hygiene** · F003, F008, F009
- F003: gitignore `settings.local.json` (or strip the experimental env + ephemeral allowlist entries
  before it ships in tracked Public).
- F008: rename `check-comment-hygiene.sh` → `.py` (update the one caller / docs reference).
- F009: confirm and document the intentional devin UserPromptSubmit→skill-advisor wiring, or align it.

---

## 5. Spec Seed

No spec change required for the reviewed fixes (they are already specified under packets 028 and 138).
If a cleanup packet is opened, its spec delta is: "Harden the re-election reap against pid reuse and
non-escalated model-server teardown; close the comment-hygiene checker word-order gap; add the
connected-secondary fresh-reclaim live test; de-personalize the tracked Claude settings file." All
items are P2 / non-blocking.

---

## 6. Plan Seed

1. (WS-B) Patch `check-comment-hygiene.sh:169` regex; re-run it over both launchers; fix the two
   comments at `mk-spec-memory-launcher.cjs:1025` / `mk-code-index-launcher.cjs:715`. [F004, F005]
2. (WS-C) Add the F007 combined-path live case; remove the no-op `SPEC_KIT_DB_DIR` env. [F006, F007]
3. (WS-A) Add lease re-confirm (or inline risk note) before the stale-reclaim reap; escalate the
   release-path model-server kill. [F001, F002]
4. (WS-D) Gitignore / de-personalize `settings.local.json`; rename the hygiene script; confirm the
   devin hook wiring. [F003, F008, F009]

Each step is independent; none blocks shipping the already-merged fixes.

---

## 7. Traceability Status

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| spec_code | core (hard) | pass | Reap → `028-live-session-reelection-validation`; portability → `138-portable-cross-machine`. Both have spec/plan/impl docs. Spec 139 is the review-orchestration scaffold. |
| checklist_evidence | core (hard) | partial | Commit `7c8b221cf3` asserts "Durability suite 18/18, launcher-lease 11/11"; not re-run in this read-only audit. |
| skill_agent | overlay | n/a | No skill/agent contract in scope. |
| agent_cross_runtime | overlay | partial | Claude/Codex/Devin hook configs are parallel; F009 flags one asymmetry to confirm. |
| feature_catalog_code | overlay | n/a | Not applicable to this file set. |
| playbook_capability | overlay | n/a | Not applicable to this file set. |

---

## 8. Deferred Items

- All 9 findings are P2 advisories (deferred by definition under a PASS verdict).
- **Known accepted limitation (not a new finding):** `launcher-session-proxy.cjs:146-153` documents a
  `memory_save` replay gap (secondary-index duplicate rows on commit-then-die). A fresh-session reap
  during a secondary's in-flight `memory_save` inherits this pre-existing, documented gap; out of
  scope for the reviewed change set.
- **Not independently verified:** the asserted test pass counts (checklist_evidence partial).

---

## 9. Audit Appendix

**Iteration table**

| Run | Status | Focus | Dims | New ratio | P0/P1/P2 |
|-----|--------|-------|------|-----------|----------|
| 1 | complete | all-dimension single pass | 4/4 | 1.00 | 0 / 0 / 9 |

**Convergence:** stop by `maxIterations=1` (not a convergence-score STOP). Dimension coverage
complete (4/4). No P0 override active. `releaseReadinessState: converged` (all dimensions covered,
no P0/P1).

**Adversarial replay:** 0 P0 asserted → 0 claim-adjudication packets required. F005 and F006 were
empirically verified (hygiene-checker exit codes; `SPEC_KIT_DB_DIR` consumer grep) rather than
asserted by inference. F001/F002 were down-rated to P2 after confirming low realistic impact and
consistency with documented accepted-risk patterns.

**File coverage matrix (12/12 read in full):**
`mk-spec-memory-launcher.cjs`, `lib/model-server-supervision.cjs`, `lib/launcher-ipc-bridge.cjs`,
`lib/launcher-session-proxy.cjs`, `mk-code-index-launcher.cjs`,
`daemon-reelection-adoption-live.vitest.ts`, `daemon-reelection-release-integration.vitest.ts`,
`session-cleanup.sh`, `check-comment-hygiene.sh`, `.claude/settings.local.json`, `.codex/hooks.json`,
`.devin/hooks.v1.json`.

**Notable strengths observed (no action):** `session-cleanup.sh` deliberately refuses a PPID fallback
and re-proves session ancestry immediately before each kill (`:86-101`) — a correct,
safety-first design; the IPC bridge's deep-probe (require a JSON-RPC reply, N consecutive failures
before reaping) correctly avoids false-reaping a busy-but-responsive daemon
(`launcher-ipc-bridge.cjs:360-424`); the release-integration test exercises the *real* exported
production decision functions rather than mocks (`daemon-reelection-release-integration.vitest.ts:191-197`).

Review verdict: PASS
