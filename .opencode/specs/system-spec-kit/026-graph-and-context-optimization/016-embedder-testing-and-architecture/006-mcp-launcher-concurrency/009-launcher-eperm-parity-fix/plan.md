---
title: "Plan: Launcher EPERM Parity Fix"
description: "Two-launcher patch propagating skill-advisor's EPERM handling to spec-memory + code-index."
trigger_phrases:
  - "009 plan eperm"
importance_tier: "useful"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency/009-launcher-eperm-parity-fix"
    last_updated_at: "2026-05-18T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Plan written"
    next_safe_action: "Execute per tasks.md"
    blockers: []
---
# Plan: Launcher EPERM Parity Fix

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

Mirror skill-advisor's `EPERM → held: true` branch into both other launchers. One-line addition each, byte-equivalent to the reference.

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Two files modified. No new files. No new tests. Pure parity patch.

**Language**: Node.js CommonJS
**Surface**: `.opencode/bin/mk-spec-memory-launcher.cjs` + `.opencode/bin/mk-code-index-launcher.cjs`
**Reference**: `.opencode/bin/mk-skill-advisor-launcher.cjs:171-180` (canonical pattern)
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Threshold | Verification |
|------|-----------|--------------|
| Syntax | exit 0 | `node --check` on each launcher |
| Pattern match | byte-equivalent EPERM branch | grep comparison vs skill-advisor |
| Strict spec validate | `RESULT: PASSED` | `validate.sh <009> --strict` |
| Scope | only 2 launcher files + 009 packet docs touched | `git diff --cached --name-only` |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The `leaseHeldFromFile()` function probes lease liveness via `process.kill(pid, 0)`. Three outcomes:

| `process.kill` result | Meaning | Correct handler |
|---|---|---|
| Success (returns void) | Process exists + we have permission | `held: true` |
| Throws `ESRCH` | No such process | `held: false, staleReclaimable: true` |
| Throws `EPERM` | Process exists but we lack permission (sandbox / different uid) | `held: true` (the **missing** branch) |
| Any other throw | Unknown error | re-throw |

skill-advisor's `mk-skill-advisor-launcher.cjs:171-180` has all 4 branches. spec-memory + code-index were missing the EPERM one.

<!-- ANCHOR:affected-surfaces -->
### Affected surfaces

- `mk-spec-memory-launcher.cjs:137-142` → add EPERM branch
- `mk-code-index-launcher.cjs:171-176` → add EPERM branch

No other call sites depend on these functions' error contracts beyond ESRCH/throw.
<!-- /ANCHOR:affected-surfaces -->
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | What | Output |
|-------|------|--------|
| 1 | Patch `mk-spec-memory-launcher.cjs` | EPERM branch added |
| 2 | Patch `mk-code-index-launcher.cjs` | EPERM branch added |
| 3 | `node --check` both files | exit 0 |
| 4 | Strict-validate 009 packet | PASSED |
| 5 | Commit + push | single commit on main |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No new automated tests. Rationale:

- The fix is byte-equivalent to skill-advisor's existing `EPERM` handler, which already has vitest coverage at `mk-skill-advisor-launcher.cjs`'s test suite (Phase 007 spawn-three test).
- The condition only triggers in cross-sandbox-PID scenarios that vitest can't reliably reproduce.
- Live verification: `/mcp` post-restart no longer reports `-32000`.

If a future regression appears, add a vitest case that mocks `process.kill` to throw `{ code: 'EPERM' }` and asserts `held: true`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Source dependencies: none.
- Spec-folder dependencies: predecessor `007-skill-advisor-zombie-launcher-fix` (shipped the canonical pattern being mirrored here).
- RCA: `<arc>/005-cross-cutting-quality/005-cocoindex-install-hygiene/scratch/mcp-disconnect-rca.md` (read-only diagnostic from parallel cli-codex; recommended this exact fix).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert via `git revert <009-commit-sha>`. Reverts only the EPERM branch in each launcher. Reverted state = pre-fix (launchers throw on EPERM in sandbox; `-32000` reconnect failures return). No data risk.
<!-- /ANCHOR:rollback -->
