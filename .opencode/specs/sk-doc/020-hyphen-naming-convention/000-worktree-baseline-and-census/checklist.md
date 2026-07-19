---
title: "Checklist: worktree, baseline, and census (020 phase 000)"
description: "Checklist for phase 000 of the 020 kebab-case filesystem-naming program: worktree, baseline, and census."
trigger_phrases:
  - "worktree, baseline, and census checklist"
  - "hyphen naming phase 000 checklist"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/000-worktree-baseline-and-census"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/000-worktree-baseline-and-census"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "SOL verifier contract authored from the design review"
    next_safe_action: "Execute this phase on the pinned worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Worktree, baseline, and census

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 000. Every item is a check the paired
verify agent runs BEFORE the candidate commit lands; each SOL report pins the candidate SHA, BASE SHA, and rename-map
hash, records commands + exit codes + discovery counts, and fails on zero tests/scenarios or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-007 [P0] Predecessor phases have landed and the worktree is clean, pinned to BASE, with an isolated git index — 000 is the first phase (no predecessors); worktree `.worktrees/0068-sk-doc-020-migration-exec` has its own git index, pinned to BASE `1ec0ad2947b`; baseline.json records base/head/branch
- [ ] CHK-008 [P2] The pinned BASE SHA and rename-map hash for this phase are recorded in the candidate report — BASE SHA recorded in baseline.json; rename-map hash is a phase-006 artifact, N/A at 000
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-009 [P1] Changes are scoped to this phase; no adjacent cleanup; exemptions honored — changes confined to the 020 packet plus the three system-spec-kit workspace manifests (`package.json`) and the root `package-lock.json` required to make the fresh-install gate reproducible; no adjacent cleanup
- [x] CHK-010 [P2] No code identifier / JSON-YAML-TOML key / frontmatter field was altered by a filesystem rename — no renames performed in phase 000
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-001 [P0] Confirm the worktree has an isolated git dir/index and a clean tree at the exact BASE SHA — isolated worktree pinned to BASE `1ec0ad2947b`; tree at BASE clean; HEAD `e3fa05d2c9` carries phase-000 evidence only (no renames); baseline.json
- [x] CHK-002 [P0] A fresh local install/build succeeds; `realpath` proves deps + dist resolve inside the worktree — `npm install` (539 pkgs) + `tsc --build` exit 0; `npm ci` replay exit 0; realpath-proof.txt shows all node_modules/dist IN-WORKTREE; recipe in reproducible-install.md; baseline.json gates.systemSpecKitBuild
- [x] CHK-003 [P0] Capture recursive `validate.sh --strict` output, build/test/typecheck results, and test-discovery counts at BASE — 177 nodes validated, Errors: 0 (34 non-blocking PHASE_LINKS warnings); `npm run typecheck` exit 0, 0 TS errors; test-discovery 12 .test.ts / 883 .vitest.ts / 21 test-*.js; baseline.json gates
- [x] CHK-004 [P0] Capture the naming census (exemptions applied), symlink + mode manifest, and casefold/NFC collision report — `baseline/census/census.json` (3,882 candidates), `symlink-mode-manifest.json`, `collision-report.json` (0 collisions)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-005 [P1] Capture Lane C scenario IDs and scores at BASE for the later re-baseline — `baseline/gates/lane-c-baseline.json` records the BASE corpus IDs via `load-playbook-scenarios.cjs`: sk-doc 32 scenarios, sk-code 30 scenarios
- [x] CHK-006 [P1] Record BASE, tool versions, and submodule state in one baseline artifact — `baseline/gates/baseline.json` records baseSha, node v25.6.1 / npm 11.9.0 / git 2.50.1, submodules []
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-011 [P2] No executable behavior or allowlist changed beyond the intended logic/rename; sandbox and gate posture preserved — phase 000 adds only workspace manifests + lockfile + baseline evidence; no executable behavior or allowlist changed
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-012 [P2] The phase outcome is reflected in the packet docs and the convention doc where applicable — baseline/gates/{baseline.json, install-summary.md, reproducible-install.md, realpath-proof.txt, lane-c-baseline.json} record the phase outcome
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-013 [P1] Renames land in dependency-closed, path-scoped commits on the pinned worktree branch
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the candidate report pins the SHAs + map hash, and the gate
(validate/build/test/link/benchmark as applicable) is green with discovery-count parity against the 000 baseline.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract and `git diff-index --quiet HEAD --` shows no unexpected
tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
