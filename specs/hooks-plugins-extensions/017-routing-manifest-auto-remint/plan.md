---
title: "Implementation Plan: Auto re-mint a hub routing manifest at commit time"
description: "One blocking gate block in the pre-commit hook, patterned on the mirror-parity gate above it, that re-mints an affected hub and stages both manifests."
trigger_phrases:
  - "route remint plan"
  - "pre-commit auto remint"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Auto re-mint a hub routing manifest at commit time

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/scripts/git-hooks/pre-commit`, one added block |
| **Tools reused** | `compiled-route-manifest.cjs refresh`, already the tool the pre-push gate names |
| **Verification** | Three cases run against the real hook, then the route guard |

The trigger was measured rather than assumed. A probe touched one file at a time and read the guard after each: a `SKILL.md` at the hub root or in any nested mode stales the hub, and `ROUTER.md`, `references/`, `README.md` and `assets/` do not. `hub-router.json` and `mode-registry.json` are direct hash inputs by code inspection. The gate matches exactly that set and nothing wider.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:phases -->
## 2. PHASES

| Phase | Work | Output |
|-------|------|--------|
| 1 | Measure which file classes stale a hub | the trigger set |
| 2 | Add the gate block and prove three cases | the hook |
| 3 | Validate, commit, push | this packet closed |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:rollback -->
## 3. ROLLBACK

`git revert` the commit. The installed hook is a symlink to the tracked file, so the previous behavior returns for every session at once with no reinstall. `SPECKIT_SKIP_ROUTE_REMINT=1` disables the block for a single commit without touching the file.
<!-- /ANCHOR:rollback -->
