---
title: "Implementation Summary: worktree, baseline, and census (020 phase 000)"
description: "Phase 000 outcome: isolated worktree pinned to BASE, reproducible install hardened, and the green baseline captured."
trigger_phrases:
  - "hyphen naming phase 000 summary"
  - "worktree baseline census summary"
  - "020 baseline implementation summary"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/000-worktree-baseline-and-census"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/000-worktree-baseline-and-census"
    last_updated_at: "2026-07-18T05:15:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Captured the green BASE baseline and hardened the install"
    next_safe_action: "Begin phase 001 policy work"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-000-baseline"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 000-worktree-baseline-and-census |
| **Completed** | 2026-07-18 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 000 gives the naming migration a safe place to run and a truthful starting
line. The migration executes on an isolated worktree pinned to an immutable BASE,
away from the actively-raced main checkout, and every later phase now has a
green baseline to prove itself against.

### Isolated, pinned worktree

The work runs in `.worktrees/0068-sk-doc-020-migration-exec`, a worktree with its
own git index, pinned to BASE `1ec0ad2947b`. The tree at BASE is clean; the only
commits on the branch carry phase-000 evidence, so no rename has touched the repo.

### A reproducible install

The migration toolchain lives in the `system-spec-kit` npm workspaces monorepo.
A clean checkout could not build it: the workspace-root `package.json`,
`shared/package.json`, and `scripts/package.json` were untracked, so `npm ci`
could not find the root manifest and `mcp_server`'s `file:../shared` dependency
could not resolve. Tracking those three manifests makes a fresh checkout install
and build deterministically; the workspace lockfile was already committed, and the
fresh install reproduced it byte-for-byte. You can now run `npm ci && npm run build`
at the workspace root and get a working toolchain.

### The green baseline

The census, symlink and file-mode manifest, collision report, strict-validation
result, build and typecheck results, test-discovery counts, and Lane C corpus are
all captured under `baseline/`, keyed to BASE. Later phases compare against these
numbers to prove they changed only what they intended to.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/package.json` | Tracked | Make the workspace root installable from a clean checkout |
| `.opencode/skills/system-spec-kit/shared/package.json` | Tracked | Resolve the shared workspace package |
| `.opencode/skills/system-spec-kit/scripts/package.json` | Tracked | Resolve the scripts workspace package |
| `.opencode/skills/system-spec-kit/package-lock.json` | Unchanged | Already committed; the fresh install reproduced it byte-for-byte |
| `baseline/gates/baseline.json` | Rewritten | Record the green install + gate results (was "install blocked") |
| `baseline/gates/install-summary.md` | Rewritten | Human-readable install-gate outcome |
| `baseline/gates/realpath-proof.txt` | Rewritten | Prove deps + dist resolve inside the worktree |
| `baseline/gates/reproducible-install.md` | Created | The proven install + build recipe |
| `baseline/gates/lane-c-baseline.json` | Created | BASE Lane C corpus for the phase-002 parity check |
| `baseline/census/*` | Present | Census, symlink/mode manifest, collision report |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The install was driven directly rather than through the codex sandbox, whose
network block produced the earlier false `ENOTFOUND`. A fresh `npm install` at the
workspace root, a `tsc --build`, and a `rm -rf node_modules */dist && npm ci &&
npm run build` replay all exited 0, and `realpath` confirmed every output resolved
inside the worktree. Strict validation ran over all 177 nodes with a `spec.md`,
and Lane C scenario IDs were captured with the playbook loader.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Harden the worktree build rather than symlink from main | A fresh deterministic install avoids the wrong-workspace false pass the phase-000 decision warned about, and the network was reachable directly |
| Track the three workspace manifests | They were the actual reproducibility hole; the lockfile was already committed, so without the root manifest a clean checkout still cannot install |
| Drop the per-package lockfiles from an earlier attempt | An npm workspaces monorepo has one canonical lockfile at the root |
| Treat the 34 PHASE_LINKS warnings as baseline noise | They are non-blocking sorted-order nav references, pre-existing at BASE, zero errors |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fresh install (`npm install`, workspace root) | PASS, exit 0, 539 packages |
| Build (`npm run build`, `tsc --build`) | PASS, exit 0, shared/scripts/mcp_server dist emitted |
| Reproducibility replay (`npm ci` + build) | PASS, exit 0 both steps |
| realpath deps + dist inside worktree | PASS, all IN-WORKTREE |
| Strict validation, 177 nodes | PASS, Errors: 0 (34 non-blocking PHASE_LINKS warnings) |
| Typecheck (`npm run typecheck`) | PASS, exit 0, 0 TS errors |
| Test discovery | 12 `.test.ts`, 883 `.vitest.ts`, 21 `test-*.js` |
| Lane C corpus | sk-doc 32 scenarios, sk-code 30 scenarios |
| Census | 3,882 candidates, 0 collisions |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The full `npm test` suite was not run at BASE.** Discovery counts are captured for parity; running the 883-file vitest suite (which pulls embedding models and native modules) is deferred to the phases that touch those surfaces.
2. **Lane C scores are corpus IDs, not scored runs.** The BASE capture records the discovered scenario set; scoring against the router runs when phase 002 migrates the consumers.
3. **`.node-version-marker` is environment-specific.** Written by the postinstall hook; intentionally left untracked.
<!-- /ANCHOR:limitations -->

---

<!--
Post-implementation documentation, created after phase 000 completed.
HVR rules: .opencode/skills/sk-doc/shared/references/hvr_rules.md
-->
