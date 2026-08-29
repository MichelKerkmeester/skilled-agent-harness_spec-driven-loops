---
title: "Implementation Plan: cli-external-orchestration Activation Manifest Re-Mint"
description: "Reproduce the legacy fallback on pristine main, re-mint the activation manifest through the refresh verb, mirror the authored copy, and prove the repair with the same commands that showed the failure."
trigger_phrases:
  - "re-mint activation manifest plan"
  - "compiled routing refresh verb"
  - "stale manifest repair"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/024-cli-external-hub-manifest-remint"
    last_updated_at: "2026-08-29T22:45:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Executed the plan; guard exit 0 and 34/34 bin tests from the final state"
    next_safe_action: "None; repair live on main and v4 at the same commit"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "024-cli-external-hub-manifest-remint"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: cli-external-orchestration Activation Manifest Re-Mint

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js compiled-routing tooling, JSON activation manifests |
| **Framework** | 015 compiled-routing rollout, `compiled-route-manifest.cjs` |
| **Storage** | Two `manifest.json` copies — promoted runtime and authored program source |
| **Testing** | `compiled-route-guard.cjs`, `compiled-route-sync.cjs --verify`, `compiled-route-manifest.test.cjs`, `vitest.config.bin.ts` |

### Overview

Work in a detached worktree at `origin/main` so the failing state is the shipped state rather than a
local approximation. Reproduce the legacy fallback first, re-mint through the `refresh` verb, mirror
the result into the authored copy, then re-run every check that showed the failure. Land the same
two-line change on `main`, and on `v4` behind the source edits that produce the hash. Both branches
received exactly that change in `3a61fa96ac` while this ran, so the plan closed as verification.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The failing hub is identified by the guard rather than assumed.
- [x] The authored and promoted copies of the manifest are both located.
- [x] The distinction between the live activation manifest and the frozen rollout record is settled.

### Definition of Done

- [x] The hub resolves compiled with the current source hash.
- [x] The guard exits 0 with all five hubs fresh.
- [x] The routing suites pass from the final state.
- [x] No skill source, compiler or frozen artifact is modified, and no build residue is left behind.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Serving-state repair. The compiler, resolver and freshness contract all behaved correctly; only the
selected identity was stale. The repair therefore moves one field and touches no logic.

### Key Components

- **`build-artifacts.cjs` `sourceInputs()`**: the coupling — it reads all seven hub `SKILL.md` files as policy input bytes.
- **`compiled-route-manifest.cjs refresh`**: recompiles current inputs and overwrites the manifest in place, preserving `servingAuthority` and `shadowOnly` and publishing atomically through a temp-and-rename.
- **`resolve.cjs`**: the serve-time identity binding that turns drift into a silent legacy fallback.
- **`compiled-route-guard.cjs`**: the fleet check that names the hub needing a re-mint.

### Data Flow

`cli-*/SKILL.md` bytes -> `compileRegistry` -> `effectivePolicyHash` -> activation manifest
`selectedPolicy` -> `resolveRoute` identity comparison -> compiled route or legacy sentinel.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Create a detached worktree at `origin/main` so the shipped state is measured directly.
- [x] Record the guard's verdict and the true exit status, read without a pipe.
- [x] Capture the selected and current policy hashes from the freshness record.

### Phase 2: Core Implementation

- [x] Re-mint with `refresh --hub cli-external-orchestration --skill-root .opencode/skills/cli-external-orchestration`.
- [x] Copy the refreshed manifest over the authored program copy and confirm the two are byte-identical.

### Phase 3: Verification

- [x] Re-run the resolver, the guard, the freshness check, the sync move-simulation and both suites.
- [x] Negative-control the canary and the resolver by stashing the fix and reproducing the original state.
- [x] Remove build residue and confirm the diff is exactly two lines.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool | Pass Signal |
|-----------|-------|------|-------------|
| Reproduction | The shipped failure | `resolve.cjs --hub cli-external-orchestration` | Returns the legacy sentinel before the fix |
| Serving identity | The repaired hub | `resolve.cjs --hub cli-external-orchestration` | Returns `action: "route"` carrying `d307e097…` |
| Fleet freshness | All five hubs | `compiled-route-guard.cjs` | Exit 0, every hub `fresh` |
| Manifest freshness | The repaired hub | `compiled-route-manifest.cjs freshness` | `fresh: true`, selected hash equals current |
| Closure integrity | Promoted serving graph | `compiled-route-sync.cjs --verify` | All five hubs resolve, 0 reads under the spec tree |
| Regression | Routing runtime | `compiled-route-manifest.test.cjs`, `vitest.config.bin.ts` | 42/42 and 34/34 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `origin/main` worktree | Workspace | Available | The failure could only be approximated locally |
| `refresh` verb shadow-child path | Repository tool | Available | A generic recompile yields a hash the resolver rejects |
| Skill-advisor `dist/` build output | Untracked build artifact | Supplied for the run | One bin test throws `ENOENT` and coverage is incomplete |
| v4 source parity | Branch state | Satisfied | v4 carries the `SKILL.md` edits in all six packets and sits at the same commit as `main` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The guard fails, the resolver returns the legacy sentinel, or either suite regresses.
- **Procedure**: `git checkout HEAD --` both `manifest.json` paths. The change is two lines in two files with no generated companions, so restoring them returns the fleet to its prior serving state exactly.
- **Data reversal**: None. No database, no migration, no persisted runtime state beyond the manifests themselves.
<!-- /ANCHOR:rollback -->
