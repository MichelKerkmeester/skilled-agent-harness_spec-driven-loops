---
title: "Verification Checklist: 131/007 — Deep-* Commands Relocation"
description: "Level 3 checklist for deep-* command asset relocation with per-wave gates."
trigger_phrases:
  - "131/007 checklist"
  - "deep commands relocation checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/006-deep-stack-cross-cutting/002-commands-relocation"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "deepseek-v4-pro"
    recent_action: "Authored checklist with per-wave verification items."
    next_safe_action: "Proceed to WAVE 1: asset relocation."
---
# Verification Checklist: 131/007 — Deep-* Commands Relocation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot claim complete until verified |
| **[P1]** | Required | Must complete or document deferral |
| **[P2]** | Optional | Track as follow-up |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`.
  - **Evidence**: spec.md contains REQ-001 through REQ-006 with per-wave acceptance criteria.
- [x] CHK-002 [P0] Plan phases documented in `plan.md`.
  - **Evidence**: plan.md contains 6 phases matching the wave structure from the canonical plan.
- [x] CHK-003 [P0] ADR created.
  - **Evidence**: `decision-record.md` ADR-001 documents asset co-location strategy + naming convention + alternatives + five-checks.
- [x] CHK-004 [P1] Canonical wave plan referenced.
  - **Evidence**: plan.md summary section cites `~/.claude/plans/fix-minor-drift-afterwards-twinkly-melody.md`.
- [x] CHK-005 [P1] Parent phase-map updated.
  - **Evidence**: `131/spec.md` phase-map anchor includes 007-deep-commands-relocation row.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] WAVE 1 asset paths resolve: `mv` operations successful, old paths empty.
  - **Evidence**: `ls commands/deep/assets/` shows 6 `deep_*.yaml`; `ls commands/speckit/assets/speckit_deep-*` returns 0 hits.
- [ ] CHK-011 [P0] WAVE 1 command MDs load from new asset paths.
  - **Evidence**: `rg "spec_kit/assets/" .opencode/commands/deep/` returns 0 hits.
- [ ] CHK-012 [P1] WAVE 1 Gemini TOMLs structurally valid.
  - **Evidence**: `python3 -c "import tomllib; ..."` (or equivalent TOML parser) parses all 3 files without error.
- [ ] CHK-013 [P1] WAVE 2 `skill_advisor.py` still parses as valid Python.
  - **Evidence**: `python3 -c "import ast; ast.parse(open('...skill_advisor.py').read())"` exits 0.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] WAVE 2 reference cleanliness: 0 old-path refs on live operator surfaces.
  - **Evidence**: `rg "/speckit:deep-(review|research|council|ai-council)" .opencode/agents/ .claude/agents/ .codex/agents/ .gemini/agents/ CLAUDE.md AGENTS.md README.md` returns 0 hits.
- [ ] CHK-021 [P0] WAVE 2 asset-path cleanliness: 0 old asset paths in commands or skills.
  - **Evidence**: `rg "spec_kit/assets/spec_kit_deep-" .opencode/commands/deep/ .opencode/skills/deep-*/SKILL.md` returns 0 hits.
- [ ] CHK-022 [P0] WAVE 3 skill-graph compiles clean.
  - **Evidence**: `skill_graph_compiler.py --export-json --pretty` exits 0.
- [ ] CHK-023 [P0] WAVE 3 advisor surfaces correct skills.
  - **Evidence**: 3 smoke prompts return their respective deep-* skill in top recommendations.
- [ ] CHK-024 [P0] WAVE 3 vitest sweep 100% PASS.
  - **Evidence**: All 4 vitest suites exit 0 with 0 failures.
- [ ] CHK-025 [P1] WAVE 3 no test imports reference old paths.
  - **Evidence**: `rg "spec_kit_deep-"` on test files returns 0 hits.
- [ ] CHK-026 [P1] WAVE 4 residual historical refs ≤ 10.
  - **Evidence**: `rg "/speckit:deep-(review|research|council)|spec_kit_deep-" .opencode/ --type-add 'docs:*.md' --type docs | grep -v "z_archive\|changelog/v[01]" | wc -l` returns ≤ 10.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] All 6 waves complete with verification gates passing.
  - **Evidence**: Each wave's gate task marked `[x]` with captured output.
- [ ] CHK-031 [P0] No files left at old `spec_kit/assets/spec_kit_deep-*` paths.
  - **Evidence**: `find .opencode/commands/speckit/assets/ -name "spec_kit_deep-*"` returns 0 results.
- [ ] CHK-032 [P1] New `gemini/commands/deep/ai-council.toml` exists and is valid.
  - **Evidence**: File exists and parses as valid TOML; content mirrors other deep-* TOMLs.
- [ ] CHK-033 [P1] All 9 `graph-metadata.json` files updated with new asset paths.
  - **Evidence**: `rg "spec_kit_deep-.*\.yaml" .opencode/skills/*/graph-metadata.json` returns 0 hits.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P1] No secret or credential surfaces changed.
  - **Evidence**: All changes are file relocations + path rewrites. No new secrets introduced. YAML + TOML files contain workflow instructions, not credentials.
- [ ] CHK-041 [P2] No executable permissions changed on relocated files.
  - **Evidence**: `stat` confirms permissions unchanged from source to destination.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] Spec/plan/tasks/checklist synchronized.
  - **Evidence**: All 4 documents match the same 6-wave structure with consistent phase/task IDs.
- [x] CHK-051 [P0] ADR-001 documented with context, alternatives, consequences, five-checks.
  - **Evidence**: `decision-record.md` ADR-001 is complete.
- [x] CHK-052 [P1] Parent spec phase-map updated.
  - **Evidence**: `131/spec.md` phase-map anchor includes 007 row.
- [x] CHK-053 [P1] `implementation-summary.md` placeholder structure ready for WAVE 5.
  - **Evidence**: All anchors present; body sections marked `[pending]` where appropriate.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P0] WAVE 1 files moved to `commands/deep/assets/` within `.opencode/commands/deep/` tree.
  - **Evidence**: `ls commands/deep/assets/` structure matches ADR-001 naming.
- [ ] CHK-061 [P1] WAVE 1 Gemini TOMLs at `.gemini/commands/deep/`.
  - **Evidence**: `ls .gemini/commands/deep/` shows `review.toml`, `research.toml`, `ai-council.toml`.
- [ ] CHK-062 [P1] No files outside approved scope modified.
  - **Evidence**: `git diff --stat` per wave shows only expected paths.
- [ ] CHK-063 [P2] WAVE 5 scratch leftovers removed.
  - **Evidence**: No temp files in `007-deep-commands-relocation/` beyond the canonical 8 spec files.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [x] CHK-100 [P0] ADR-001 has Accepted status.
  - **Evidence**: `decision-record.md` ADR-001 status is Accepted.
- [x] CHK-101 [P1] Alternatives documented with rejection rationale.
  - **Evidence**: ADR-001 alternatives table shows 4 rejected alternatives with explicit reasoning.
- [x] CHK-102 [P0] Strict spec validation passes for 131/007.
  - **Evidence**: `validate.sh .../007-deep-commands-relocation --strict` returned RESULT: PASSED (0 errors, 0 warnings).
- [x] CHK-103 [P1] Parent `131/graph-metadata.json` children_ids includes 007.
  - **Evidence**: `children_ids` array appends `007-deep-commands-relocation`.
- [ ] CHK-104 [P1] Runtime mirror relationships documented and verified.
  - **Evidence**: plan.md architecture section documents `.codex/`, `.claude/`, `.gemini/` mirror mechanics.
- [ ] CHK-105 [P1] Symlinks verified functional after WAVE 1.
  - **Evidence**: `.codex/commands/deep/assets/` resolves to `.opencode/commands/deep/assets/`; `.claude/commands/deep/` mirrors correctly.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

- [ ] CHK-110 [P1] WAVE 0-5 wall-clock ≤ 90 minutes.
  - **Evidence**: WAVE timestamps captured at each wave commit.
- [ ] CHK-111 [P2] No runtime performance regression.
  - **Evidence**: YAML/TOML file moves are path-only changes; no logic modified. Skill-graph compile time unchanged.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

- [ ] CHK-120 [P1] Per-wave rollback tested or documented.
  - **Evidence**: plan.md enhanced-rollback section documents per-wave revert procedure.
- [ ] CHK-121 [P1] No external state dependencies.
  - **Evidence**: All changes are file-system only. No databases, APIs, or services affected.
- [ ] CHK-122 [P2] WAVE 5 commit message follows conventional commit format.
  - **Evidence**: `feat(131/007): relocate deep-* command assets + cross-repo references — deep:* command family complete`.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [ ] CHK-130 [P0] Phase boundary respected: only 131/007 files + parent metadata modified.
  - **Evidence**: `git diff --stat` shows only `007-deep-commands-relocation/`, `131/spec.md`, `131/graph-metadata.json`.
- [ ] CHK-131 [P1] No deep-* skill source code modified.
  - **Evidence**: `git diff --stat` shows no changes to `.opencode/skills/deep-*/` beyond `SKILL.md` reference updates (WAVE 2) and `graph-metadata.json` (WAVE 2).
- [ ] CHK-132 [P1] No non-deep `commands/speckit/` workflows touched.
  - **Evidence**: `git diff --stat` shows no changes to `commands/speckit/` files except the 6 YAML removals.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [x] CHK-140 [P1] Level 3 required docs present.
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`.
- [x] CHK-141 [P1] Metadata files present.
  - **Evidence**: `description.json`, `graph-metadata.json`.
- [ ] CHK-142 [P1] `implementation-summary.md` filled at WAVE 5 closure.
  - **Evidence**: [pending — WAVE 5]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-Off

- [ ] CHK-150 [P0] Final validation evidence recorded.
  - **Evidence**: `validate.sh --strict` output captured in final response and `implementation-summary.md`.
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 5/12 |
| P1 Items | 14 | 9/14 |
| P2 Items | 4 | 0/4 |
<!-- /ANCHOR:summary -->
