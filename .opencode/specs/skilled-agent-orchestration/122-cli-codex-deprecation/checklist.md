---
title: "Verification Checklist: Deprecate cli-codex skill and operational references"
description: "Verification checklist for retiring cli-codex from active OpenCode skill, executor, advisor, command, agent, docs, and metadata surfaces."
trigger_phrases:
  - "cli-codex deprecation checklist"
  - "codex cli retirement verification"
  - "executor deprecation validation"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/122-cli-codex-deprecation"
    last_updated_at: "2026-06-30T15:05:00Z"
    last_updated_by: "opencode"
    recent_action: "Verified initial Codex Desktop App bridge symlink and TOML checks"
    next_safe_action: "Run final strict packet validation after metadata refresh"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/122-cli-codex-deprecation/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/122-cli-codex-deprecation/plan.md"
      - ".opencode/specs/skilled-agent-orchestration/122-cli-codex-deprecation/tasks.md"
    session_dedup:
      fingerprint: "sha256:951b82df8b7b03d01f3aecac83cfb367798059f3291c5484a195365fe50d8a33"
      session_id: "159-cli-codex-deprecation-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Verification must include final scoped grep and strict packet validation."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Deprecate cli-codex skill and operational references

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | HARD BLOCKER | Cannot claim done until complete |
| **P1** | Required | Must complete OR get user approval |
| **P2** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`; evidence: `spec.md` sections 2-5 define problem, scope, requirements, and success criteria.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`; evidence: `plan.md` sections 3-5 define source-first retirement and tests.
- [x] CHK-003 [P1] Dependencies identified and available; evidence: `plan.md` section 6 lists graph rebuild, targeted tests, and grep dependencies.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Changed TypeScript/JavaScript code passes targeted typecheck and test gates; evidence: system-spec-kit, system-skill-advisor, system-code-graph, and deep-loop-runtime typechecks passed; targeted system-spec-kit tests passed 3 files / 412 tests; system-code-graph runtime-detection passed 1 file / 11 tests; advisor targeted tests passed 4 files / 60 tests with `--testTimeout=90000`; deep-loop-runtime targeted tests passed 4 files / 73 tests.
- [x] CHK-011 [P0] Command YAML and JSON metadata parse after edits; evidence: skill graph compiler validation passed with 19 skills and zero conflicts; matrix adapter vitest passed 2 files / 5 tests.
- [x] CHK-012 [P1] Deprecated executor requests fail closed or route to supported alternatives; evidence: runtime `cli-matrix` retired-kind rejection test passed and `skill_advisor.py "use cli-codex to review this repository" --threshold 0.0` returned `sk-code-review`, `deep-loop-workflows`, and `sk-design`, not `cli-codex`.
- [x] CHK-013 [P1] Changed files follow project patterns and comment hygiene; evidence: `verify_alignment_drift.py --root .opencode/skills` exited PASS with warnings only, no errors.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All P0 acceptance criteria in `spec.md` are met; evidence: active skill folder retired to archive, residual empty active directories removed from disk, executor kind removed, advisor graph rebuilt, Codex hook trees deleted, active grep clean outside archive/changelog scopes.
- [x] CHK-021 [P0] Final active grep finds no unapproved operational `codex` or `cli-codex` references in requested active paths; evidence: scoped `rg --hidden -i "codex|cli-codex|\.codex|hooks/codex|if_cli_codex|codex exec|CODEX_" README.md .opencode/hooks .opencode/commands .opencode/skills` with archive/changelog/node_modules exclusions returned no output.
- [x] CHK-022 [P1] Advisor and deep-loop tests cover removed route/executor expectations; evidence: runtime executor config/audit/fanout/cli-matrix tests passed and advisor scorer/recommend/registry/cross-edge tests passed.
- [x] CHK-023 [P1] Generic Codex runtime references in requested active scopes are removed after AI Council review; evidence: Codex hook trees, command branches, doctor config support, runtime detection fixtures, and active docs/playbooks were removed or retargeted to supported OpenCode/Claude surfaces.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each changed surface has a finding class: `cross-consumer` for active references, `matrix/evidence` for tests, or `instance-only` for single docs; evidence: implementation summary lists affected surfaces and classes.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed with scoped grep; evidence: baseline active grep found 213 files / 998 exact occurrences before cleanup, final active grep returned no output.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed executor kinds, advisor routes, docs, and tests; evidence: runtime executor, matrix runner, advisor scorer/graph, deep command assets, agents, mirrors, docs, and playbooks were swept.
- [x] CHK-FIX-004 [P0] Executor validation includes unsupported-kind or absent-kind coverage where applicable; evidence: `parseExecutorConfig` retired-kind rejection and active graph absence checks passed.
- [x] CHK-FIX-005 [P1] Matrix axes are listed before completion is claimed; evidence: matrix runner now covers `cli-claude-code` and `cli-opencode`; removed adapter cells for `cli-codex`.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant is not applicable unless touched tests read process-wide state; evidence: no new process-global state behavior introduced for retired executor routing.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the explicit diff and command outputs in this session; evidence: implementation summary verification table records command names and outcomes.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets added; evidence: changes are docs, routing metadata, tests, and executor enum cleanup only.
- [x] CHK-031 [P0] Retired executor requests cannot bypass remaining permission guidance; evidence: retired executor kind is no longer accepted by runtime config and no active dispatch path remains.
- [x] CHK-032 [P1] Cross-CLI safety guidance remains intact for supported executor skills; evidence: final active docs route to `cli-opencode` / `cli-claude-code` and preserve safety guidance.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, decision record, and implementation summary are synchronized; evidence: closeout edits update completion state and verification evidence.
- [x] CHK-041 [P1] Active README/hooks/commands/skills no longer advertise Codex support; evidence: active content and filename sweeps returned no `codex`/`cli-codex` hits outside archive/changelog scopes.
- [x] CHK-042 [P2] Historical archive exceptions are documented if final grep reports any; evidence: remaining filename/content hits are in `.opencode/specs/**`, `.opencode/skills/z_archive/**`, changelogs, or runtime/generated state and are excluded from active routing.
- [x] CHK-043 [P1] Codex Desktop App bridge documents supported discovery paths; evidence: `.codex/README.md` states config/context roles, `.agents -> .codex`, and `.codex/skills -> .opencode/skills` for repository skill discovery.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files stay in `scratch/` or approved tool-output locations; evidence: test temp output remained under system temp/tool-output paths.
- [x] CHK-051 [P1] Removed skill tree does not leave orphaned discoverable `SKILL.md` files; evidence: active `.opencode/skills/cli-codex/` path now returns file-not-found, active `SKILL.md` discovery finds no `/cli-codex/`, and archive uses `SKILL.retired.md`.
- [x] CHK-052 [P1] Codex Desktop symlinks resolve to intended canonical paths; evidence: `test -L .agents && test -d .agents/skills/system-spec-kit && test -f .agents/skills/system-spec-kit/SKILL.md && test -L .agents/skills && test -L .codex/skills && test -L .codex/specs && test -L .codex/changelog && test ! -e .codex/agents` exited 0.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 15 | 15/15 |
| P2/N/A Items | 9 | 9/9 |

**Verification Date**: 2026-06-30
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decision documented in `decision-record.md`.
- [x] CHK-101 [P1] ADR has accepted status.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale.
- [x] CHK-103 [P2] Migration path documented in final implementation summary; evidence: rollback and restart notes are documented.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] No runtime performance target applies; this is source and docs deprecation.
- [x] CHK-111 [P1] No throughput target applies.
- [x] CHK-112 [P2] Load testing not required unless runtime dispatch code changes introduce new path; evidence: this packet removes a retired dispatch path and runs targeted runtime tests instead.
- [x] CHK-113 [P2] Benchmarks not required; targeted tests and grep are authoritative for this packet.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented and reviewed; evidence: decision record and implementation summary include restore archive / rebuild graph rollback path.
- [x] CHK-121 [P0] Feature flag not applicable; no runtime rollout flag is introduced.
- [x] CHK-122 [P1] Monitoring/alerting not applicable unless runtime executor errors are changed; evidence: no deployed service or alerting surface changed.
- [x] CHK-123 [P1] Restart note prepared for OpenCode skill/config changes; evidence: implementation summary says restart OpenCode to reload skill discovery and graph metadata.
- [x] CHK-124 [P2] Deployment runbook not required for source-only local deprecation.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Security review completed for remaining cross-CLI safety guidance; evidence: supported executor docs preserve cross-CLI dispatch safety guidance.
- [x] CHK-131 [P1] Dependency licenses unchanged; evidence: no dependency files changed.
- [x] CHK-132 [P2] OWASP checklist not applicable; no web/API surface changes.
- [x] CHK-133 [P2] Data handling unchanged.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized after implementation; evidence: tasks, checklist, and implementation summary updated with actual outcomes.
- [x] CHK-141 [P1] API documentation not applicable; no public API changed.
- [x] CHK-142 [P2] User-facing root and install documentation updated; evidence: active README/install guide references no longer advertise `cli-codex`.
- [x] CHK-143 [P2] Knowledge transfer captured in implementation summary.
- [x] CHK-144 [P1] Codex Desktop App project config parses; evidence: `python3.11 -c 'import pathlib, tomllib; tomllib.loads(pathlib.Path(".codex/config.toml").read_text()); print("toml-ok")'` printed `toml-ok`.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| User | Scope owner | Approved new packet path | 2026-06-30 |
| OpenCode | Implementer | Verified with documented blockers | 2026-06-30 |
<!-- /ANCHOR:sign-off -->
