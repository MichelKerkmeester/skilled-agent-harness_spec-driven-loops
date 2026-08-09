---
title: "Spec: Dist Staleness Rebuild-on-Drift"
description: "Make the dist-staleness guard self-heal a stale checked-out build at session start instead of only printing a warning that persists across sessions."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "dist staleness rebuild on drift"
  - "check-dist-staleness auto rebuild"
  - "stale dist self heal"
  - "advisor dist drift hook error"
importance_tier: "high"
contextType: "spec"
parent: "sk-code"
_memory:
  continuity:
    packet_pointer: "sk-code/022-dist-staleness-rebuild-on-drift"
    last_updated_at: "2026-08-09T05:41:05Z"
    last_updated_by: "claude"
    recent_action: "Shipped sweep-unblock + fail-open auto-rebuild; verified stale-then-fresh"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs"
    session_dedup:
      fingerprint: "sha256:3b1f3a22418010d58bba08a485fb5e024c4e80f75114b2f37c48274f57b510d4"
      session_id: "2026-08-09-sk-code-022"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: Dist Staleness Rebuild-on-Drift

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 022-dist-staleness-rebuild-on-drift |
| **Status** | Complete |
| **Created** | 2026-08-09 |
| **Level** | 1 |
| **Predecessor** | None |
| **Successor** | None |
| **Priority** | P2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Several TypeScript packages ship a checked-out `dist/` that is gitignored and built per-checkout. When a package's source gains an export but its local `dist/` is not rebuilt, consumers that import the compiled entry fail at load time. This surfaced as a cross-session `UserPromptSubmit` failure: `spec-gate-core.mjs` imported `recordObservedPolicyDelivery` from the advisor's stale compiled `policy-plan.js`, and the hook threw on every prompt (fail-open, so it printed a non-blocking error rather than blocking).

The existing `check-dist-staleness` guard already detects this in principle: its `--all` mode runs at session start and its `check-file` mode runs per edit. But two gaps let the drift persist:

1. **Warn-only.** When a package is stale the guard prints `STALE DIST WARNING: <package> -- run: <cmd>` and exits 0. The warning is easy to miss in hook output, so nobody rebuilt and the stale build survived across sessions.
2. **The `--all` sweep was crashing silently.** `dist-freshness.cjs` carried a malformed `DIST_PACKAGES` entry — the code-graph package was removed but its identity fields (`id`/`name`/`root`/`rebuildCommand`) were only partially deleted, leaving `distEntries`/`sourceCandidates` behind. `checkAll` maps over every package, so that entry's `undefined` id resolved to itself and its missing `root` threw, aborting the whole sweep. The guard's fail-open then swallowed the error and exited 0 with no output. So the session-start sweep detected **nothing** — and at discovery time three packages (mcp-server, code-mode, sk-design backend) were silently stale.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope: `check-dist-staleness.sh` auto-rebuild in `--all` mode with its kill-switch and fail-open fallback, and deleting the orphaned `DIST_PACKAGES` entry in `dist-freshness.cjs` that crashed the sweep. Out of scope: the freshness-detection *logic* itself (the source/dist hash comparison), changing which valid packages are watched, committing any `dist/` output (all watched `dist/` trees remain gitignored), the specific advisor source that first drifted, and fixing the build of any package (e.g. code-mode) whose own compile fails — the guard correctly fail-open-warns those.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 [P2]** In `--all` mode (the once-per-session SessionStart sweep), when a watched package is stale, the guard runs that package's own `rebuildCommand` to self-heal the build rather than only printing a warning.
- **REQ-002 [P2]** The auto-rebuild fails open: a rebuild that errors or exceeds a bounded timeout falls back to the current `STALE DIST WARNING` line, and the guard still exits 0 so session start is never blocked.
- **REQ-003 [P2]** `check-file` mode (PostToolUse, per edit) stays warn-only so per-keystroke edits never trigger a compile; auto-rebuild is scoped to the session-start sweep.
- **REQ-004 [P2]** An operator kill-switch (`SPECKIT_DIST_AUTO_REBUILD=0`) reverts to the prior warn-only behavior for anyone who does not want an auto-build at session start.
- **REQ-005 [P2]** On a successful rebuild the guard emits a bounded confirmation line naming the rebuilt package, so the self-heal is visible and auditable.
- **REQ-006 [P1]** The orphaned `DIST_PACKAGES` entry left by the code-graph removal is deleted from `dist-freshness.cjs` so `checkAll` stops throwing and the session-start sweep actually runs. This is a prerequisite for every other requirement: auto-rebuild is inert while the sweep crashes.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** With a package's `dist/` made stale, running the guard in `--all` mode rebuilds it: a subsequent freshness check reports the package fresh, and the previously-failing import resolves. Proven with a stale-then-fresh control on the advisor package.
- **SC-002** A forced rebuild failure (or `SPECKIT_DIST_AUTO_REBUILD=0`) still exits 0 and prints the fallback warning, never blocking session start.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Slow session start when stale.** A session that opens with a stale package runs one bounded `npm run build`. Mitigated by scoping auto-rebuild to the once-per-session `--all` sweep, the 180s timeout, and the `SPECKIT_DIST_AUTO_REBUILD=0` opt-out.
- **A build that fails or hangs.** Mitigated by fail-open: a non-zero exit or timeout falls back to the warning and the guard still exits 0, so session start is never blocked.
- **Dependencies.** The freshness payload (`rebuildCommand`, `stale`, `packageName`) from `dist-freshness.cjs` and each package's own `npm run build`; no new packages or network access.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The kill-switch default (on) was chosen so the recurrence closes without operator configuration; an operator who prefers warn-only sets `SPECKIT_DIST_AUTO_REBUILD=0`.

<!-- /ANCHOR:questions -->
