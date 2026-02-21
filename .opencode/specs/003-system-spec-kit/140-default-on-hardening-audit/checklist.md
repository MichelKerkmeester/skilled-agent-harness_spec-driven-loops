# Verification Checklist: 140 - Default-On Hardening Audit

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + checklist-extended | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR user-approved deferral |
| **[P2]** | Optional | Can defer with documented reason |

Evidence format: `[Evidence: command/file/result]`
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Scope frozen and documented in `spec.md` [Evidence: `spec.md` section 3]
- [x] CHK-002 [P0] Feature inventory matrix completed for specs 136/138/139 [Evidence: `spec.md` section 4]
- [x] CHK-003 [P0] Baseline findings recorded (typecheck + tests + gaps) [Evidence: `spec.md` section 5]
- [x] CHK-004 [P1] Mandatory verification command set documented exactly [Evidence: `spec.md` section 8, `plan.md` section 8]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Default-on behavior enforced (opt-out only `FLAG=false`) for covered features [Evidence: ]
- [ ] CHK-011 [P0] `create.sh` append mode updates existing phase-map rows correctly [Evidence: ]
- [ ] CHK-012 [P0] SGQS skill-root resolution fixed in both runtime and reindex script [Evidence: ]
- [ ] CHK-013 [P0] Source/shared import boundaries clean (no TS6059/TS2307) [Evidence: ]
- [ ] CHK-014 [P1] Source-adjacent generated artifacts removed for migrated modules outside `dist` [Evidence: ]
- [ ] CHK-015 [P1] Semantic bridge + AST/chunker runtime contracts explicitly aligned (code + docs + tests) [Evidence: ]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `node scripts/tests/test-phase-system.js` passes [Evidence: ]
- [ ] CHK-021 [P0] `node scripts/tests/test-phase-validation.js` passes [Evidence: ]
- [ ] CHK-022 [P0] `npm run test --workspace=mcp_server` passes [Evidence: ]
- [ ] CHK-023 [P0] `npm run typecheck` passes [Evidence: ]
- [ ] CHK-024 [P0] `npm test` passes [Evidence: ]
- [ ] CHK-025 [P1] `/spec_kit:phase` command-flow tests exist and pass [Evidence: ]
- [ ] CHK-026 [P1] `--phase-folder` path handling tests exist and pass [Evidence: ]
- [ ] CHK-027 [P1] SGQS handler runtime coverage exists and passes [Evidence: ]
- [ ] CHK-028 [P1] Deep-mode semantic bridge runtime decision is test-backed [Evidence: ]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security / Safety

- [ ] CHK-030 [P0] Hardening changes introduce no path traversal regressions [Evidence: ]
- [ ] CHK-031 [P1] Flag default-on change reviewed for unintended exposure risk [Evidence: ]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md` synchronized with final implementation state [Evidence: ]
- [ ] CHK-041 [P1] Baseline findings updated to final post-fix state [Evidence: ]
- [ ] CHK-042 [P1] Frozen scope and out-of-scope boundaries unchanged without approval [Evidence: ]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] Shared SGQS/chunker workspace placement consumed by both scripts and MCP server [Evidence: ]
- [ ] CHK-101 [P1] Runtime claims match executable code paths (no dead feature claims) [Evidence: ]
- [ ] CHK-102 [P1] Import graph free of cross-rootDir leakage for migrated modules [Evidence: ]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback path documented for default-on behavior changes [Evidence: ]
- [ ] CHK-121 [P0] Final verification command suite recorded with pass output snippets [Evidence: ]
- [ ] CHK-122 [P1] Known flaky/slow tests stabilized or documented with accepted mitigation [Evidence: ]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:verification-commands -->
## Verification Commands (Must Execute)

```bash
node scripts/tests/test-phase-system.js
node scripts/tests/test-phase-validation.js
npm run test --workspace=mcp_server
npm run typecheck
npm test
```
<!-- /ANCHOR:verification-commands -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | [ ]/16 |
| P1 Items | 12 | [ ]/12 |
| P2 Items | 0 | [ ]/0 |

**Verification Date**: 2026-02-21
**Current Status**: In Progress
<!-- /ANCHOR:summary -->
