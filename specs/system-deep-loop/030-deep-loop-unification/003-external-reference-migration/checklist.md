---
title: "Verification Checklist: External Reference Migration"
description: "Verification checklist for migrating every deep-loop-workflows/deep-loop-runtime reference. All 20 items verified, symlinks removed."
trigger_phrases:
  - "external reference migration checklist"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/003-external-reference-migration"
    last_updated_at: "2026-07-08T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All items verified with evidence, symlinks removed"
    next_safe_action: "Write implementation-summary.md, run validate.sh --strict"
    blockers: []
    key_files:
      - "tasks.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-unification-052-003-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: External Reference Migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|--------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Stage-A baseline: 716 files/3244 matches (723 with `--hidden`, a default-`rg` gap root-caused via `--debug`), 137/911 external, advisor accuracy 0.3679 (71/193) (verified)
- [x] CHK-002 [P0] 002-hub-rename-and-runtime-nesting confirmed landed, `system-deep-loop/` real on disk prior to any Stage C-J edit (verified)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `parent-skill-check.cjs`'s `GLOBAL_MAP_OWNER`/`DEFAULT_TARGET` fixed; also fixed a real gap in the same file's `DIRECTORY_ALLOWLIST` (missing `runtime`), caught by the self-check gate itself (verified)
- [x] CHK-011 [P1] `MERGED_DEEP_SKILL_ID` updated in both `skill_advisor.py` and `aliases.ts`; caught and fixed a mid-execution revert of the `aliases.ts` value via `--check-routing-projection` returning `"fresh"` post-fix (verified)
- [x] CHK-012 [P1] All 3 compiled `.contract.md` files regenerated via `compile-command-contracts.cjs --write`, never hand-edited; re-ran a second time after Stage F touched their source inputs (stale-digest sequencing); determinism confirmed by a snapshot-diff of a third run (verified)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Residual-grep sweep: 14 files remain, each individually confirmed deliberate (real `deep-loop-runtime.json` filename, historical narrative, dual-keyword backward-compat, generated-artifact deferral) — none is an unresolved reference (verified)
- [x] CHK-021 [P0] `routing-registry-drift-guard.vitest.ts`: 7/7 passing (verified)
- [x] CHK-022 [P0] `score-routing-corpus.py --min-advisor-accuracy 0.3679`: live 0.5492, `overall_pass: true` — accuracy improved, not just held (verified)
- [x] CHK-023 [P0] `local-native-divergence-ratchet.vitest.ts`: 6/6 passing after 2 rounds of hand-verified, non-mechanical `reason`/entry updates as Stage F's later fixes cascaded into further accuracy improvement (verified)
- [x] CHK-024 [P1] `check-agent-mirror-sync.cjs`: 5/5 changed agents in sync across `.opencode/agents/**` and `.claude/agents/**` (verified)
- [x] CHK-025 [P1] Full vitest: `runtime/` 70/71, `system-skill-advisor` 691/692, `system-spec-kit test:council` 7/9 — every non-passing test individually confirmed pre-existing and unrelated (git-log/git-blame-verified, not assumed) (verified)
- [x] CHK-026 [P2] `create:skill-parent`'s prefix-exception caveat verified via `package_skill.py --check` PASS on the hub and all 4 mode packets, plus direct read-back of both asset YAMLs' rewritten `packet_prefix` example (verified)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-P0-001 [P0] Every Stage C-J item confirmed applied via its own verification command; self-corrected a genuine over-reach in Stage F's blanket sweep (found via full-test-suite failures, not assumed clean from sed's exit code — see `tasks.md` T007) (verified)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P2] No tool-surface or permission change introduced — reference/metadata edits plus one allowlist addition (`runtime` in `DIRECTORY_ALLOWLIST`), no tool-permission surface touched (verified)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Root README + all cross-skill READMEs updated (`system-deep-loop`, `system-spec-kit`, `sk-doc`, `sk-code`, `sk-design`, `sk-prompt-models`, `cli-opencode` — 2 more than the originally-named 6) (verified)
- [x] CHK-041 [P1] Grandfather-example files (`parent_skills_nested_packets.md`, `skill-parent.md`, both `create_skill_parent_{auto,confirm}.yaml`) updated with the explicit prefix-exception caveat, not a blind rename (verified)
- [x] CHK-042 [P1] Sibling `graph-metadata.json` edges collapsed to one per skill across 5 skills (`system-spec-kit`, `system-skill-advisor`, `cli-opencode`, `sk-code`, `sk-prompt`); a genuine phase-002 schema bug (`kind: "infrastructure"` not a valid enum value) found and fixed along the way (verified)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Pre-commit hook + GitHub Actions workflow updated as a matched pair, both confirmed pointing at the identical post-rename `check-agent-mirror-sync.cjs` path (verified)
- [x] CHK-051 [P2] Both temporary compat symlinks removed post-Stage-J; full `runtime/` + `system-skill-advisor` suites re-run afterward with zero new failures (the symlink-induced graph-health double-discovery failure is now gone, confirming correct timing) (verified)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 8 | 8/8 |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-07-08
<!-- /ANCHOR:summary -->
