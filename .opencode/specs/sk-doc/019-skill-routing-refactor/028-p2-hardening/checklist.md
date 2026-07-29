---
title: "Checklist: Skill-Metadata P2 Hardening"
description: "QA checklist for the ten P2 review fixes, with command and file:line evidence."
trigger_phrases:
  - "skill metadata p2 hardening checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/028-p2-hardening"
    last_updated_at: "2026-07-29T06:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "All items verified"
    next_safe_action: "Terminal validation then land"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Skill-Metadata P2 Hardening

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Every item carries a command or artifact reference. Each P2 (A–J) maps to a review-report finding.

| Priority | Meaning | Rule |
|----------|---------|------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P0] Baseline captured: fleet gates 11/11 both green before edits [evidence: `ci-skill-root-metadata.cjs` checked=11 passed=11; `ci-leaf-manifest-freshness.cjs` checked=11 fresh=11]
- [x] CHK-002 [P1] Each of the ten P2 findings re-read against source at its cited file:line before fixing [evidence: `../027-program-deep-review/review/review-report.md` §3]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-003 [P0] P2-A: `findSkillRoots` catch narrowed to ENOENT (rethrow others); `statSync` directory precheck in both `run()` → exit 2 [evidence: `ci-skill-root-metadata.cjs:80-92,388-402`, `ci-leaf-manifest-freshness.cjs:104-116`]
- [x] CHK-004 [P0] P2-B: `readStandaloneConfig` throws `PACKET_OUT_OF_ROOT` for an escaping packet before the walker [evidence: `generate-leaf-manifest.cjs:121-128`]
- [x] CHK-005 [P0] P2-C: within-entry dedup emits `DUPLICATE_OWNED_SIGNAL_WITHIN_ENTRY`, distinct from cross-command [evidence: `command-metadata-schema.cjs:143-155`]
- [x] CHK-006 [P0] P2-D: `isWithin` uses `isAbsolute` (cross-drive correct, POSIX-neutral); import added [evidence: `watcher.ts:166-175`]
- [x] CHK-007 [P1] P2-E: freshness gate "cannot run" code 1→2, aligned with sibling; both headers document code 2 [evidence: `ci-leaf-manifest-freshness.cjs` header]
- [x] CHK-008 [P0] P2-J: choreography probe resolves repo-root-relative only [evidence: `ci-skill-root-metadata.cjs:304-308`]
- [x] CHK-009 [P0] Comment hygiene: no spec paths, packet/phase numbers, or finding ids embedded in code comments [evidence: `git diff` comment review; validate COMMENT_HYGIENE_MARKER pass]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-010 [P0] `skill-root-metadata-contract.test.cjs` passes with two new negative cases (within-entry dedup, gate exit-2 on non-directory input) [evidence: suite prints "contract + fleet gate coverage passed"]
- [x] CHK-011 [P0] `leaf-resource-contract.test.cjs` passes with new `PACKET_OUT_OF_ROOT` case [evidence: suite prints "leaf-resource-contract unit coverage passed"]
- [x] CHK-012 [P0] `create-journey-proof.test.cjs` passes with scaffold-vs-template shape assertions [evidence: suite prints "create journey proof passed"]
- [x] CHK-013 [P0] Both `daemon-watcher-*.vitest.ts` files green (12 tests; real-chokidar integration included) [evidence: vitest "Test Files 2 passed (2) / Tests 12 passed"]
- [x] CHK-014 [P0] End-to-end: both gates exit 2 for a file and for a missing dir; exit 0 on the real tree [evidence: `ci-skill-root-metadata.cjs` + `ci-leaf-manifest-freshness.cjs` returned exit 2 for a file and a missing dir, exit 0 on the real tree]
- [x] CHK-015 [P0] Fleet 11/11 both gates; generated manifest bytes byte-identical (freshness gate reports fresh=11) [evidence: `checked=11 passed=11`; `checked=11 fresh=11`]
- [x] CHK-016 [P1] `parent-skill-check.cjs` 0 FAIL on sk-doc, sk-code, system-deep-loop [evidence: EXIT=0 FAIL-lines=0 each]
- [x] CHK-017 [P1] `run-all-drift-guards.sh` 3/3 PASS [evidence: "all 3 guards PASSED"]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-018 [P0] All ten P2 findings (A–J) closed at their cited sites [evidence: `tasks.md` T-03..T-12; 10/10 findings closed]
- [x] CHK-019 [P1] P2-F watcher-test chokidar resolved from a candidate list (advisor node_modules first) [evidence: `daemon-watcher-new-root-ingestion.vitest.ts:216-226`]
- [x] CHK-020 [P2] P2-G/H/I documentation-only fixes carry durable WHY comments [evidence: `create-journey-proof.test.cjs:43-99`, `ci-*.cjs` skip-continue comments, `pre-push:180-187`]
- [x] CHK-021 [P2] Report's declined lane-A `safeReaddir` refactor recorded as deliberate in spec §7 [evidence: spec.md ANCHOR:questions]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] CHK-022 [P1] P2-D containment predicate hardened; no new capability, tool, or permission surface [evidence: `watcher.ts:166-175` diff is a pure predicate]
- [x] CHK-023 [P0] No generated-byte change, no contract or schema change [evidence: freshness gate 11/11 fresh byte-identical; no template/contract file in `git diff`]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-024 [P1] Adversarial diff verify recorded in implementation-summary [evidence: `implementation-summary.md` How It Was Delivered — CLEAN verdict, HIGH confidence]
- [x] CHK-025 [P2] Each fix's file:line evidence carried in tasks.md [evidence: tasks.md Phase 2 items]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-026 [P0] Edits scoped to the ten cited files plus this packet's docs [evidence: `git diff --stat` = 10 code/doc files + packet]
- [x] CHK-027 [P1] No `.opencode/package.json` pin bump committed; no node_modules symlink tracked (gitignored) [evidence: `git status` clean of package.json; `git check-ignore` confirms symlink ignored]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P2 findings closed | 10 | 10/10 |
| New proving tests | 3 | 3/3 |
| Fleet gates green | 2 | 2/2 (11/11 each) |
| Watcher vitest files | 2 | 2/2 |
| Drift guards | 3 | 3/3 |

**Verification Date**: 2026-07-29
<!-- /ANCHOR:summary -->
