---
title: "Implementation Summary: Dist Guard Skip Unprovisioned Packages"
description: "The checker now reports a package unprovisioned (skip) instead of stale when it cannot be built in this checkout; the guard is silent about it."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "dist guard skip unprovisioned implementation"
  - "dist freshness unprovisioned summary"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code"
_memory:
  continuity:
    packet_pointer: "sk-code/023-dist-guard-skip-unprovisioned"
    last_updated_at: "2026-08-09T06:16:27Z"
    last_updated_by: "claude"
    recent_action: "Shipped the provisioning downgrade; verified workspace + two-variant fixture"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs"
    session_dedup:
      fingerprint: "sha256:f63effcfdcdc19b73ebc43201a74f90e6f08ff0f7070809391d0f02a0de58b2f"
      session_id: "2026-08-09-sk-code-023"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Dist Guard Skip Unprovisioned Packages

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 023-dist-guard-skip-unprovisioned |
| **Status** | Complete |
| **Created** | 2026-08-09 |
| **Level** | 1 |
| **Completion** | 100% — checker distinguishes provisioning gaps from drift, verified with a fixture control |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

One edit to `dist-freshness.cjs` stops a bare worktree from warning about packages it cannot build.

1. **Two helpers.** `isPackageProvisioned(root)` returns true only when the package's `package.json` and `node_modules` are both present at its root. `unprovisionedResult(...)` builds a result with the new status `unprovisioned` and `stale: false`.

2. **Four guarded paths.** `checkPackageFreshness` computes `provisioned` once, then each of its four stale/missing return paths (missing dist, source-hash drift, dist-hash drift, mtime drift) is prefixed with `if (!provisioned) return unprovisionedResult(...)`. A package that cannot be built in this checkout is reported as unprovisioned rather than stale; a provisioned package is unaffected, and fresh results are never touched. The guard `check-dist-staleness.sh` needs no change — it acts only on `stale: true`, so `unprovisioned` is silently skipped.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Traced the recurring code-mode warning to a proven provisioning gap: `package.json`, `node_modules`, and `dist/` are gitignored and present in the main tree but absent in this bare worktree, so `npm run build` cannot run here. Rather than remove code-mode from the watch table (it is a real, buildable package elsewhere), taught the checker to tell "not buildable here" apart from "stale". Verified on the live workspace and with a temp fixture that runs the same mtime-stale package twice, differing only by `node_modules`, to prove provisioning — not drift — is the discriminator.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Require both `package.json` and `node_modules` | The rebuild needs the manifest for its build script and the installed deps for its compiler; either absent means the checkout cannot build the package. |
| Guard only the stale/missing paths, not a top-level short-circuit | A package with a fresh, present dist is genuinely fine even without `node_modules`; relabeling it would be misleading. The downgrade only touches results that would otherwise warn. |
| Report `unprovisioned` instead of dropping the package | Keeps the package visible and honest in `check-all --json` diagnostics while making `stale: false` so the guard skips it. |
| Leave `check-dist-staleness.sh` untouched | It already keys on `stale: true`; changing the checker's classification is sufficient and keeps the blast radius to one file. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Syntax | PASS — `node --check dist-freshness.cjs` |
| code-mode reclassified | PASS — `check-all` reports `mcp-code-mode/mcp-server` as `unprovisioned`/`stale:false` (was `missing`/`stale:true`) |
| No regression on other packages | PASS — the other five packages still report `fresh`; whole sweep `status:fresh, degraded:false, errors:[]` |
| Guard silent about code-mode | PASS — `check-dist-staleness.sh --all` prints no warning and exits 0 |
| Provisioned drift still fires | PASS — fixture: `node_modules` present + stale → `stale:true` |
| Unprovisioned downgrades | PASS — fixture: same stale path, `node_modules` absent → `unprovisioned`/`stale:false` |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Provisioning is still the operator's job.** This packet stops the noise; it does not build or symlink a bare worktree's dependencies. A worktree created outside the launch-wrapper still lacks code-mode's build — the guard is now simply honest that it cannot help there, instead of warning every session.
2. **A broken symlink reads as absent.** `node_modules` provided by a broken symlink counts as not present, so such a package is treated as unprovisioned. That is the safe outcome — a broken link cannot supply a working compiler.

<!-- /ANCHOR:limitations -->
