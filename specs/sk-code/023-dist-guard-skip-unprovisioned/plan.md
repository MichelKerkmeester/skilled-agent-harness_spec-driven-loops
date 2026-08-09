---
title: "Plan: Dist Guard Skip Unprovisioned Packages"
description: "Add a provisioning check to the checker and gate the four stale/missing return paths so an un-buildable package downgrades to unprovisioned instead of stale."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "dist guard skip unprovisioned plan"
  - "dist freshness provisioning check plan"
importance_tier: "high"
contextType: "plan"
parent: "sk-code"
_memory:
  continuity:
    packet_pointer: "sk-code/023-dist-guard-skip-unprovisioned"
    last_updated_at: "2026-08-09T06:16:27Z"
    last_updated_by: "claude"
    recent_action: "Added isPackageProvisioned + unprovisionedResult and gated the stale/missing paths"
    next_safe_action: "None; checker skips un-buildable packages"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs"
    session_dedup:
      fingerprint: "sha256:99a34f5b48f163c281c4c1e1632f2b229147c4ee37e675de720f971d085cd333"
      session_id: "2026-08-09-sk-code-023"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: Dist Guard Skip Unprovisioned Packages

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

`checkPackageFreshness` in `dist-freshness.cjs` returns a per-package result with a `stale` boolean. The guard `check-dist-staleness.sh` consumes it and acts only when `stale === true` (warn, or since the predecessor packet, self-heal). There are four return paths that set `stale: true`: missing dist entry, source-hash drift, dist-hash drift, and mtime drift.

### Overview

Add a provisioning check — `package.json` and `node_modules` both present at the package root — and, at each of the four stale/missing paths, downgrade to a new `unprovisioned` result (`stale: false`) when the package is not buildable in this checkout. Fresh results are untouched.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The four stale/missing return sites in `checkPackageFreshness` are located.
- The guard is confirmed to key on `stale: true`, so a `stale: false` status is skipped without touching the shell script.

### Definition of Done

- code-mode reports `unprovisioned`/`stale:false`; the guard sweep is silent about it; the other packages are unchanged.
- A fixture proves a provisioned-and-stale package still reports `stale:true`.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Classify-before-warn. Detection stays in the checker; the provisioning check reclassifies an un-actionable "stale" into an informational "unprovisioned" so the downstream guard has nothing to act on.

### Key Components

- `isPackageProvisioned(root)` — `package.json` and `node_modules` both present.
- `unprovisionedResult(pkg, root, distEntry, entry)` — the `stale: false` result object.
- `checkPackageFreshness` — computes `provisioned` once, then guards each of the four stale/missing returns.

### Data Flow

`check-all`/`check-file` → `checkPackageFreshness` → if a stale/missing path is hit and `!provisioned` → `unprovisionedResult` (`stale:false`) → guard skips it; otherwise the existing `stale:true` result flows through unchanged.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Locate the four stale/missing return paths and confirm the guard acts only on `stale: true`.

### Phase 2: Core Implementation

Add `isPackageProvisioned` and `unprovisionedResult`; compute `provisioned` once after entry validation; prepend `if (!provisioned) return unprovisionedResult(...)` to each of the four stale/missing returns.

### Phase 3: Verification

Run `node --check`, the `check-all` status table, the guard `--all` sweep, and a two-variant fixture proving the provisioned/unprovisioned discriminator.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Behavioral: `check-all --json` on the real workspace (code-mode → unprovisioned, others fresh) and the guard `--all` sweep (silent, exit 0). Controlled: a temp fixture that builds the same mtime-stale package twice — with and without `node_modules` — and asserts `stale:true` versus `unprovisioned`/`stale:false`. Plus `node --check` for syntax.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `dist-freshness.cjs` only; `check-dist-staleness.sh` consumes the result unchanged.
- No new packages or network access.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Single-file, reversible: `git checkout -- dist-freshness.cjs` restores the prior behavior (un-buildable packages warn again). No committed build artifacts to unwind (all watched `dist/` remain gitignored).

<!-- /ANCHOR:rollback -->
