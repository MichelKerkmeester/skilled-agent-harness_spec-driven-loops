---
title: "Spec: Dist Guard Skip Unprovisioned Packages"
description: "Teach the dist-staleness checker to report a package as unprovisioned (skip) instead of stale when it is not buildable in this checkout, so bare worktrees stop warning about work the guard cannot do."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "dist guard skip unprovisioned"
  - "dist freshness unprovisioned package"
  - "bare worktree dist warning"
  - "check-dist-staleness worktree noise"
importance_tier: "high"
contextType: "spec"
parent: "sk-code"
_memory:
  continuity:
    packet_pointer: "sk-code/023-dist-guard-skip-unprovisioned"
    last_updated_at: "2026-08-09T06:16:27Z"
    last_updated_by: "claude"
    recent_action: "Added the unprovisioned downgrade to the four stale/missing return paths"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs"
    session_dedup:
      fingerprint: "sha256:206a628a898151dcf5ef1af4135b07e98afb190f100dd9609ae6128b74e6c046"
      session_id: "2026-08-09-sk-code-023"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: Dist Guard Skip Unprovisioned Packages

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 023-dist-guard-skip-unprovisioned |
| **Status** | Complete |
| **Created** | 2026-08-09 |
| **Level** | 1 |
| **Predecessor** | 022-dist-staleness-rebuild-on-drift |
| **Successor** | None |
| **Priority** | P2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Each watched TypeScript package ships a gitignored `dist/` and `node_modules` that are built per-checkout — by a local build, or by the launch-wrapper symlinking them from the main tree. A bare worktree that ran neither has neither. The package's own source (e.g. `index.ts`) is tracked and present, but its `package.json` and `node_modules` are not, so its `rebuildCommand` (`npm run build`) cannot succeed there.

The dist-staleness guard flagged such a package as `missing`/`stale` and warned about it every session. After the predecessor packet made the guard self-heal, it also began *attempting* a doomed rebuild for these packages. Both are noise: the package is fully present and built in the main tree, and the guard is powerless to build it in a checkout that lacks its manifest and dependencies. This surfaced concretely as a recurring `STALE DIST WARNING: @utcp/code-mode-mcp` in a bare worktree whose main tree had code-mode built and working.

The purpose is to distinguish a provisioning gap from source drift: report the un-buildable package as `unprovisioned` (not stale) so the guard skips it, while leaving real staleness detection and self-heal fully intact where the package *is* buildable.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope: `dist-freshness.cjs` — a provisioning check (`package.json` and `node_modules` both present at the package root) that downgrades a would-be `missing`/`stale` result to a new `unprovisioned` status with `stale: false`, applied at each of the four stale/missing return paths in `checkPackageFreshness`. Out of scope: provisioning worktrees themselves (an operator/launch-wrapper concern); `check-dist-staleness.sh`, which needs no change because it already acts only on `stale: true`; which packages are watched; the auto-rebuild and kill-switch behavior from the predecessor packet; and committing any `dist/` output (all watched `dist/` remain gitignored).

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 [P2]** When `checkPackageFreshness` would report a package `missing` or `stale`, but its `package.json` or `node_modules` is absent at the package root in this checkout, it instead returns status `unprovisioned` with `stale: false`. The check gates all four stale/missing return paths (missing dist, source-hash drift, dist-hash drift, mtime drift).
- **REQ-002 [P2]** A provisioned package (both `package.json` and `node_modules` present) that is genuinely stale still returns `stale: true`, so real drift detection and the predecessor packet's session-start auto-rebuild are unaffected.
- **REQ-003 [P2]** A fresh package still returns `fresh`; the provisioning check only guards the stale/missing paths and never relabels a fresh result.
- **REQ-004 [P1]** No change is required in `check-dist-staleness.sh`: it acts only on `stale: true`, so an `unprovisioned` result is silently skipped (no warning, no rebuild attempt).

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** In a bare worktree lacking code-mode's build, `dist-freshness.cjs check-all` reports `mcp-code-mode/mcp-server` as `unprovisioned`/`stale:false`, the other five packages stay `fresh`, and the guard's `--all` sweep prints no warning about code-mode and exits 0.
- **SC-002** A fixture drives both variants of the same mtime-stale code path: with `node_modules` present the package reports `stale:true`; without it, `unprovisioned`/`stale:false`. Only provisioning — not source drift — changes the outcome.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Masking real staleness.** Mitigated: the downgrade requires the package to be un-buildable here (`package.json` or `node_modules` absent). In the main tree and launch-wrapper worktrees both are always present (the wrapper symlinks them), so real drift there still reports `stale:true` — proven by the fixture control.
- **Symlinked `node_modules`.** The launch-wrapper symlinks `node_modules` from the main tree. `fs.existsSync` follows symlinks, so a valid symlink counts as present; only a truly-absent or broken link reads as unprovisioned.
- **Dependencies.** `dist-freshness.cjs` alone; consumed unchanged by `check-dist-staleness.sh`. No new packages or network access.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The provisioning signal is `package.json` **and** `node_modules` both present, because the rebuild needs the manifest for its script and the installed dependencies for its compiler; either being absent means the checkout cannot build the package.

<!-- /ANCHOR:questions -->
