---
title: "Verification Checklist: Deprecate sk-design mcp-open-design transport skill and remove all live references"
description: "Level 3 checklist with evidence for P0/P1 items and residue-gate verification."
trigger_phrases:
  - "deprecate open design"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/015-deprecate-open-design"
    last_updated_at: "2026-08-10T14:09:15Z"
    last_updated_by: "remnant-remediation"
    recent_action: "Removed residual transport contracts"
    next_safe_action: "None — remnant remediation verified"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/sk-design-mcp-open-design/"
      - ".utcp_config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deprecate-open-design-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Deprecate sk-design mcp-open-design transport skill and remove all live references

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

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

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001..009 with acceptance criteria — [evidence: spec.md §4, verified by validate.sh SECTION_COUNTS/SPEC_DOC_INTEGRITY pass] (verified by `validate.sh --strict` and `check-completion.sh`)
- [x] CHK-002 [P0] Technical approach defined in plan.md — phases, surfaces, gates, rollback — [evidence: plan.md §1-7 + AI EXECUTION PROTOCOL; verified by validate.sh] (verified by `validate.sh --strict` and `check-completion.sh`)
- [x] CHK-003 [P1] Dependencies identified and available — Luna model, pi-subagents, reducer verified — [evidence: `models-store.json` lists `openai-codex/gpt-5.6-luna`; `.pi/settings.json` enables `pi-subagents`; `reduce-state.cjs` present; 9 review iterations ran with model confirmed in `attemptedModels`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Edited JSON/YAML files parse — [evidence: `python3 -c json.load` OK on `.utcp_config.json`, mode-registry, leaf-manifest, hub-router, command-metadata, description, graph-metadata, skill-graph, canary fixture; YAML parses on doctor-mcp-install.yaml]
- [x] CHK-011 [P0] No dangling links to the removed skill tree — [evidence: `test ! -e .opencode/skills/sk-design/sk-design-mcp-open-design` passes; tracked symlink inventory reports zero broken retired-name symlinks; expanded residue sweep exit 1]
- [x] CHK-012 [P1] Error handling — [evidence: residue gate and `validate.sh --strict` rerun multiple times with stable exit codes (final: gate exit 1 zero-hits, validate exit 0)]
- [x] CHK-013 [P1] Surface conventions — [evidence: `validate.sh` COMMENT_HYGIENE_MARKER pass; no ephemeral ids added to code comments]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001..009) — [evidence: residue gate `grep -rniE` exit 1 (zero hits) for REQ-001..004; `review/review-report.md` + 9 iteration files for REQ-005; `validate.sh --strict` exit 0 for REQ-006; this checklist for REQ-007; `git status` diff review for REQ-008; `implementation-summary.md` for REQ-009]
- [x] CHK-021 [P0] Zero-residue grep gate passes — [evidence: expanded `git grep -E` sweep covers transport identifiers plus retired adapter aliases and returns exit 1 (no hits); exclusions documented in spec.md §3]
- [x] CHK-022 [P1] Variant coverage — [evidence: residue pattern set covers `mcp-open-design|mcp_open_design|design-mcp-open-design|sk-design-mcp-open-design|open_design|openDesign|OpenDesign|OPEN_DESIGN|Open Design|OD_*`; historical exclusions (specs/, changelogs, dated reports/fixtures, sqlite) verified untouched via `git status` review]
- [x] CHK-023 [P1] Error scenarios — [evidence: `.utcp_config.json` `json.load` passes; `skill-graph.json` regenerated with 0 open-design mentions; `skill_advisor.py` booster block removed and file parses]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding classes assigned — [evidence: all 19 review findings carry `findingClass` in `deep-review-findings-registry.json` (e.g. P1-001 `cross-consumer`, P1-002 `cross-consumer`, P1-015 `matrix/evidence`)]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed — [evidence: full-variant grep inventory across 15 surface classes; every hit classified live-vs-historical; final residue sweep exit 1 (zero hits)] (verified by `validate.sh --strict` and `check-completion.sh`)
- [x] CHK-FIX-003 [P0] Consumer inventory completed — [evidence: registry/manifest consumers (mode-registry, leaf-manifest, hub-router, command-metadata), proof-token consumers (design-token-lint.cjs, 4 dispatch fixtures, `openDesignLineageDigest`→`lineageDigest` rename), runtime-agent and command-contract consumers, and tests (sk-design 23/23 pass, deep-alignment 36/36 + scoping pass, runtime artifact writer 25/25)]
- [x] CHK-FIX-004 [P0] Path/env removals verified — [evidence: `grep -n OD_DATA_DIR|OD_SIDECAR_IPC_PATH` over live surfaces exit 1; `open_design` absent from `.utcp_config.json` (parse check)]
- [x] CHK-FIX-005 [P1] Matrix axes — [evidence: plan.md FIX ADDENDUM lists axes: surface (skill/config/agent/command/doc/root) × variant (hyphen/underscore/spaced/camel) × exclusion class (historical/archive/regenerated); ~94 files processed] (verified by `validate.sh --strict` and `check-completion.sh`)
- [x] CHK-FIX-006 [P1] Hostile env variant — [evidence: `.utcp_config.json` and `.claude/.utcp_config.json` verified clean of `open_design`/OD_ paths; `.codex/config.toml` verified contains no transport reference]
- [x] CHK-FIX-007 [P1] Final-state evidence — [evidence: GATE-1..8 proof batch rerun after the last edit (validate exit 0, residue 0 hits, reducer exit 0, tests 23/23)] (verified by `validate.sh --strict` and `check-completion.sh`)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:remnant-remediation -->
## Remnant Audit Remediation

- [x] CHK-060 [P0] Expanded live-surface residue gate passes — [evidence: `git grep -E` over tracked live surfaces returns exit 1 for transport, adapter, env, app-path, camelCase, and underscore variants]
- [x] CHK-061 [P0] Runtime and documented adapter contracts agree — [evidence: `scoping-adapter.test.cjs` passes and coverage-integrity reports `36/36`; agents, commands, catalogs, and playbooks no longer advertise the removed adapter]
- [x] CHK-062 [P1] Derived artifacts are fresh — [evidence: `generate-leaf-manifest.cjs --check` passes; regenerated command contract is byte-identical to a fresh `compile-command-contracts.cjs` render; `skill-graph.json` has no retired signals]
- [x] CHK-063 [P1] Focused compatibility checks pass — [evidence: targeted agent mirror sync passes; runtime `leaf-artifact-writer.vitest.ts` reports `25/25`; variant parameter gate passes with five rows]
<!-- /ANCHOR:remnant-remediation -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — [evidence: iteration-002 security sweep (grep for secret/token/credential/Bearer over transport scripts + configs) found no live credential; removed env block contained only paths/IPC socket, no secrets] (verified by `validate.sh --strict` and `check-completion.sh`)
- [x] CHK-031 [P0] OD_* env vars stripped — [evidence: final residue gate includes `OD_DATA_DIR|OD_SIDECAR_IPC_PATH` in the pattern set; exit 1 (zero hits) on live surfaces]
- [x] CHK-032 [P1] Auth/credential references — [evidence: security iteration (2) grep for Authorization/Bearer/token over transport scripts and configs found none; residue gate clean] (verified by `validate.sh --strict` and `check-completion.sh`)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — [evidence: validate.sh SPEC_DOC_INTEGRITY + LEVEL_MATCH + STATUS_CROSS_DOC_CONSISTENCY pass] (verified by `validate.sh --strict` and `check-completion.sh`)
- [x] CHK-041 [P1] Code comments — [evidence: COMMENT_HYGIENE_MARKER pass; edited test/script comments keep durable WHY only] (verified by `validate.sh --strict` and `check-completion.sh`)
- [ ] CHK-042 [P2] README updated (root + skill READMEs stripped of transport rows)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files — [evidence: all scratch output under `specs/sk-design/015-deprecate-open-design/scratch/` (allowlist draft); no temp files in live trees]
- [x] CHK-051 [P1] scratch/ cleaned — [evidence: scratch/ holds only `.gitkeep` + allowlist draft; no build residue]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 17/17 |
| P1 Items | 25 | 25/25 |
| P2 Items | 9 | 3/9 (remaining items are explicitly deferrable) |

**Verification Date**: 2026-08-10
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented — [evidence: `decision-record.md` ADR-001..003]
- [x] CHK-101 [P1] ADR statuses — [evidence: decision-record.md ADR-001..003 all marked Accepted] (verified by `validate.sh --strict` and `check-completion.sh`)
- [x] CHK-102 [P1] Alternatives — [evidence: each ADR has Alternatives Considered table with rejection rationale] (verified by `validate.sh --strict` and `check-completion.sh`)
- [ ] CHK-103 [P2] Migration path — deferred: md-generator verified standalone (transport pairing references stripped; no functional dependency) — [evidence: md-generator files cleaned, extraction pipeline untouched]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Review loop — [evidence: 9 iterations + operator-directed early convergence (iteration 10 dispatch aborted, recorded in state JSONL `converged` event); 9 iteration files, 9 deltas, registry, dashboard, report]
- [x] CHK-111 [P1] Reducer determinism — [evidence: reducer rerun after every iteration with matching registry state; final rerun exit 0 with convergenceScore 0.7105] (verified by `validate.sh --strict` and `check-completion.sh`)
- [ ] CHK-112 [P2] Performance benchmarks — deferred: N/A (docs/config deprecation, no runtime path)
- [x] CHK-113 [P2] Benchmark corpora — [evidence: dated 2026-07-21 reports untouched; only live fixture fields (forbiddenWorkflowModes, rankBelowSkillIds, digest rename) updated] (verified by `validate.sh --strict` and `check-completion.sh`)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented — [evidence: `plan.md` §7 git-checkout restore; all changes git-tracked]
- [x] CHK-121 [P0] Feature flag: N/A — full removal, no flag introduced — [evidence: plan.md §7 rollback via git restore; no flag surface exists] (verified by `validate.sh --strict` and `check-completion.sh`)
- [x] CHK-122 [P1] Monitoring/alerting — N/A — [evidence: no runtime service introduced/removed; `git status` diff shows docs/config changes only]
- [x] CHK-123 [P1] Runbook — [evidence: residue gate command + validate.sh documented in checklist CHK-020/CHK-021 evidence and implementation-summary] (verified by `validate.sh --strict` and `check-completion.sh`)
- [ ] CHK-124 [P2] Deployment runbook reviewed: n/a
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Security review — [evidence: review iteration-002 (security dimension, 3 P1 adjudicated) + CHK-030/031/032 evidence; no live credentials found] (verified by `validate.sh --strict` and `check-completion.sh`)
- [x] CHK-131 [P1] Dependency licenses — N/A — [evidence: no dependencies added; deleted transport had none (checked `sk-design-mcp-open-design` scripts for package manifests — none)]
- [ ] CHK-132 [P2] OWASP Top 10: n/a (docs/config deprecation)
- [ ] CHK-133 [P2] Data handling: n/a
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] Spec docs synchronized — [evidence: validate.sh --strict exit 0 (STATUS_CROSS_DOC_CONSISTENCY, LEVEL_MATCH, GENERATED_METADATA_DRIFT all pass)] (verified by `validate.sh --strict` and `check-completion.sh`)
- [x] CHK-141 [P1] API documentation — N/A — [evidence: no public API surface; `git diff --name-only` shows docs/config/tests only]
- [x] CHK-142 [P2] User-facing docs — [evidence: README.md, AGENTS.md, BARTER.md, CLAUDE.md stripped; residue gate exit 1] (verified by `validate.sh --strict` and `check-completion.sh`)
- [x] CHK-143 [P2] Knowledge transfer — [evidence: implementation-summary.md finalized with full delivery record] (verified by `validate.sh --strict` and `check-completion.sh`)
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Decision owner | [ ] Approved | |
| Deep review | Verdict | [ ] Recorded | |
| validate.sh | Quality gate | [ ] Exit 0 | |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
