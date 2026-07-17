---
title: "Verification Checklist: create-benchmark audit remediation"
description: "Verification Date: 2026-07-14"
trigger_phrases:
  - "create-benchmark remediation checklist"
  - "benchmark audit verification"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-benchmark-authoring-centralization/003-create-benchmark-audit-remediation"
    last_updated_at: "2026-07-14T09:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified all findings fixed; gates green"
    next_safe_action: "Commit and push"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: create-benchmark audit remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` — REQ-001..005 each with acceptance criteria.
- [x] CHK-002 [P0] Technical approach defined in `plan.md` — four-surface parallel-agent plan + affected-surfaces addendum.
- [x] CHK-003 [P1] Findings orchestrator-confirmed against real files before fixing — the P0 path mismatch, `_shared` refs, README staleness, and index drift were all re-verified against files pre-fix.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No live reference regresses to a broken/dangling path — markdown-link resolver: create-benchmark 204/0, deep-improvement 249/0, deep-alignment 221/0.
- [x] CHK-011 [P0] Edited JSON stays valid — `json.load` on hub-router.json + mode-registry.json succeeds.
- [x] CHK-012 [P1] No ephemeral artifact markers in code comments — the `sweep-benchmark.cjs` comment states the durable WHY (prompt-improve sub-hub), no spec/task ids.
- [x] CHK-013 [P1] Changes follow create-skill canon and sibling patterns — Smart Router + new sections modeled on `create-readme` / `deep-research`; routing keywords mirror existing family shape.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `package_skill.py --check create-benchmark` PASS — 1 soft word-count warning only; INTEGRATION POINTS + RELATED RESOURCES warnings cleared.
- [x] CHK-021 [P0] Lane B vitest suites pass after the dir rename — optin-scorer + sweep-acceptance = 14/14 (after fixing the pre-existing registry path).
- [x] CHK-022 [P0] `grep -rn '_shared' create-benchmark` returns 0.
- [x] CHK-023 [P1] Resolver `DEFAULT_PROFILES_DIR` resolves on disk; no live underscore ref to the two dirs remains — `benchmark-profiles/default.json` valid; 0 live underscore refs.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each finding classified — P0 = cross-consumer path rename; `_shared`/README/prose = instance docs; index = evidence reconciliation.
- [x] CHK-FIX-002 [P0] Same-class producer inventory done for the hyphen rename — repo-wide `rg 'benchmark_profiles|benchmark_fixtures'` of both dir names across deep-improvement, commands/deep, and create-benchmark; all live refs updated.
- [x] CHK-FIX-003 [P0] Consumer inventory done — renamed dirs (`profile-resolve.cjs`/allowlist/tests), routing keywords (both hub files), and reconciled index (index + 5 scenarios) all reconciled.
- [x] CHK-FIX-007 [P1] Evidence pinned to the fix commit on `fix/create-benchmark-audit-remediation`, not a moving range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets introduced — doc/config/path edits only; `git diff` shows no secret literals.
- [x] CHK-031 [P1] Sandbox/allowlist posture unchanged except the intended dir rename — routing-allowlist paths already used hyphen (`benchmark-profiles`/`benchmark-fixtures`); no gate posture change.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`/`plan.md`/`tasks.md` synchronized with the delivered work.
- [x] CHK-041 [P1] `README.md` de-staled to the real five-family taxonomy and Lane A guide ownership.
- [x] CHK-042 [P2] deep-alignment index reconciled to its captured baseline — 0 stale `300000`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Dir rename done via `git mv`; frozen historical run-report JSONs (and their `.md` twins) untouched — `git status` on `deep-improvement/benchmark/` is clean.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

Every P0/P1/P2 finding plus the decorative items and two agent-surfaced pre-existing bugs are fixed and verified. The four surfaces are internally consistent, all gates are green (packager PASS, 0 broken links, Lane B 14/14, valid JSON, index reconciled).

**Status: COMPLETE.**
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## Sign-off

Orchestrator re-verified every finding against files; the test/link/packager gates are green. Sign-off is final once `validate.sh --strict` returns Errors 0 and the branch is committed and pushed.
<!-- /ANCHOR:sign-off -->
