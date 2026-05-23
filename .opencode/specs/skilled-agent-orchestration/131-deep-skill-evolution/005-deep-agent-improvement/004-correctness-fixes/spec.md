---
title: "Packet 124: deep-agent-improvement correctness fixes"
description: "Level 3 specification for closing 5 P0 and 3 P1 deep-agent-improvement correctness findings."
trigger_phrases:
  - "packet 124"
  - "deep-agent-improvement correctness fixes"
  - "DAI-009"
  - "DAI-010"
  - "DAI-021"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/005-deep-agent-improvement/004-correctness-fixes"
    recent_action: "Implemented packet 124 correctness fixes and authored Level 3 docs."
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    next_safe_action: "Run final validation and update completion evidence."
---
# Packet 124: deep-agent-improvement correctness fixes

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Packet 124 closes eight confirmed `deep-agent-improvement` findings from packet 123: five P0 operator-trust defects and three P1 path/scoring defects. The work repairs typed profile-generation failures, makes unscored scoring dimensions explicit instead of silently perfect, aligns stop-reason documentation to the shipped journal enum, updates version/changelog truth, corrects command/manifest paths, and adds a guarded runtime-mirror sync flag for the promotion path.

Key decisions are captured in ADR-001: profile failures use a typed `FILE_NOT_FOUND` / `PARSE_ERROR` / `SCRIPT_CRASH` taxonomy; empty dimensions resolve to `score: null`; and packet 124 only adds an opt-in runtime mirror sync abort with packet 127 retaining the full cross-runtime implementation.

Critical dependencies are the `deep-agent-improvement` scripts and `/improve:agent` YAML workflows. Validation requires script syntax checks, available Vitest tests, targeted behavior checks, OpenCode alignment drift verification, and strict Level 3 spec validation.

<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
| --- | --- |
| Level | 3 |
| Status | Complete |
| Priority | P0 |
| Spec Folder | `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/005-deep-agent-improvement/004-correctness-fixes/` |
| Target Skill | `.opencode/skills/deep-agent-improvement/` |
| Source Packet | `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/` |
| Date | 2026-05-23 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Packet 123 found that `deep-agent-improvement` could mislead operators in high-risk paths. Profile-generation failures collapsed into generic nulls, empty scoring dimensions reported perfect scores, runtime docs contradicted shipped stop-reason validation, the skill version lagged its changelog, one changelog contained a no-op placeholder, YAML workflows referenced a manifest filename that did not exist, the scanner searched singular `.opencode/command` and `.opencode/skill` paths, and promotion had no packet-local signal for four-runtime agent mirror drift.

These are correctness issues, not polish. Left open, they can hide infra failures, produce false-positive candidate quality, miss workflow surfaces, and make promotion appear safer than it is.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add typed error helpers and wire profile-generation failure discrimination.
- Replace silent perfect scores for zero-check dimensions with explicit null scoring.
- Align `SKILL.md` and `README.md` to the shipped `improvement-journal.cjs` stop-reason enum.
- Bump `SKILL.md` frontmatter version to the highest changelog entry.
- Rewrite `v1.4.0.0.md` with the real historical rename boundary.
- Add a packet-127 TODO plus opt-in runtime mirror sync abort in promotion.
- Fix manifest filename references in deep-agent-improvement workflow/config files.
- Fix singular `.opencode/command` and `.opencode/skill` scanner paths.
- Author full Level 3 packet documentation.

### Out of Scope

- Full four-runtime promotion implementation. Packet 127 owns that.
- DAI-022 promotion delta contract repair.
- Broader manual testing playbook rewrites beyond the defects above.
- Any changes to `deep-loop-runtime`, `deep-review`, `deep-research`, or packets 125-128.

### Files to Change

| File Path | Change Type | Purpose |
| --- | --- | --- |
| `.opencode/skills/deep-agent-improvement/scripts/lib/typed-errors.cjs` | Create | Shared typed error helper. |
| `.opencode/skills/deep-agent-improvement/scripts/generate-profile.cjs` | Modify | Emit typed profile-generation failures and exit codes. |
| `.opencode/skills/deep-agent-improvement/scripts/score-candidate.cjs` | Modify | Preserve profile error type and handle unscored dimensions as null. |
| `.opencode/skills/deep-agent-improvement/scripts/scan-integration.cjs` | Modify | Use plural `.opencode/commands` and `.opencode/skills`; include OpenCode mirror. |
| `.opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs` | Modify | Add opt-in runtime mirror sync abort and packet-127 TODO. |
| `.opencode/skills/deep-agent-improvement/SKILL.md` | Modify | Version bump and stop-reason truth preserved. |
| `.opencode/skills/deep-agent-improvement/README.md` | Modify | Replace false plateau stop-reason section. |
| `.opencode/skills/deep-agent-improvement/changelog/v1.4.0.0.md` | Modify | Replace placeholder no-op changelog. |
| `.opencode/skills/deep-agent-improvement/assets/improvement_config.json` | Modify | Align manifest filename. |
| `.opencode/commands/improve/assets/improve_deep-agent-improvement_auto.yaml` | Modify | Align manifest filename. |
| `.opencode/commands/improve/assets/improve_deep-agent-improvement_confirm.yaml` | Modify | Align manifest filename. |
| `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/005-deep-agent-improvement/004-correctness-fixes/*` | Create | Level 3 documentation and metadata. |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 Requirements

| ID | Finding | Acceptance Criteria |
| --- | --- | --- |
| REQ-P0-001 | DAI-009 profile generation error types | Missing agent files emit `FILE_NOT_FOUND`; malformed child output is `PARSE_ERROR`; crashed scripts are `SCRIPT_CRASH`; scorer output preserves the type. |
| REQ-P0-002 | DAI-013 plateau contradiction | README and SKILL.md agree that `plateau` is a reducer condition, not an accepted journal stop reason. |
| REQ-P0-003 | DAI-017 version drift | `SKILL.md` frontmatter version equals the highest changelog entry. |
| REQ-P0-004 | DAI-018 placeholder changelog | `v1.4.0.0.md` documents the actual `sk-improve-agent` to `deep-agent-improvement` rename boundary. |
| REQ-P0-005 | DAI-021 mirror drift risk | Promotion path has an explicit opt-in mirror sync abort and TODO for packet 127. |

### P1 Requirements

| ID | Finding | Acceptance Criteria |
| --- | --- | --- |
| REQ-P1-001 | DAI-010 silent NaN/perfect fallback | Empty structural, rule, or output dimensions return `score: null`; weighted score is null until all dimensions are scored. |
| REQ-P1-002 | DAI-014 manifest path mismatch | Workflow/config references use `target_manifest.jsonc`, matching the actual asset. |
| REQ-P1-003 | DAI-016 singular command path | Integration scanner reads `.opencode/commands` and `.opencode/skills`. |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- SC-001: All eight findings have a code or documentation change tied to an explicit file path.
- SC-002: Modified `.cjs` scripts pass `node --check`.
- SC-003: Existing `deep-agent-improvement` Vitest tests pass, if runnable in the local environment.
- SC-004: `verify_alignment_drift.py --root .opencode/skills/deep-agent-improvement` passes.
- SC-005: Strict spec validation exits with 0 errors and 0 warnings.
- SC-006: `implementation-summary.md` contains the requested Commit Handoff section.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Existing consumers assume every dimension score is numeric | Reducers or dashboards could need follow-up hardening | Limit null scores to zero-check dimensions; verify current real target still scores numerically. |
| Manifest filename changes miss a runtime copy step | Workflow may still materialize the old runtime filename | Update YAML state paths, score/promote command args, and skill config together. |
| Mirror sync flag is mistaken for full packet 127 implementation | False sense of complete runtime parity | Add packet-127 TODO and keep flag opt-in. |
| Changelog reconstruction is incomplete | Historical docs remain misleading | Base the rewrite on git log evidence and v1.5 predecessor notes. |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement | Target |
| --- | --- | --- |
| NFR-001 | Diagnostics | Profile failures must expose machine-readable error type. |
| NFR-002 | Determinism | Scoring must not fabricate perfect scores for unscored dimensions. |
| NFR-003 | Scope Control | No edits outside packet 124 docs, deep-agent-improvement files, and its `/improve:agent` workflow assets. |
| NFR-004 | Compatibility | Preserve existing public function signatures. |
| NFR-005 | Verifiability | Every completion claim must cite fresh command evidence. |

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Missing candidate or agent file: profile generation reports `FILE_NOT_FOUND` with exit code 3.
- Child script produces invalid JSON: scorer classifies it as `PARSE_ERROR` instead of returning null.
- Child script exits unexpectedly: scorer classifies it as `SCRIPT_CRASH`.
- Dynamic profile has no structural, rule, or output checks: affected dimension score is null and the candidate cannot be recommended as better.
- Agent has all four runtime mirrors present: opt-in mirror sync check passes.
- Agent lacks any runtime mirror: opt-in mirror sync check aborts promotion with missing paths.

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

This is Level 3 because the packet touches runtime script behavior, command workflow configuration, skill documentation truth, version/changelog history, and promotion guard policy. The code footprint is moderate, but the risk is architectural: scoring and promotion are trust boundaries. ADR-001 records the taxonomy and policy choices so later packets can build on a stable contract.

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Response |
| --- | --- | --- | --- | --- |
| R-001 | Null score breaks a downstream reducer | Medium | Low | Run current scorer on a real agent and existing tests. |
| R-002 | Error taxonomy overfits current scripts | Medium | Medium | Use generic typed helper and child stderr parsing. |
| R-003 | Runtime mirror flag remains optional too long | High | Medium | ADR and TODO explicitly assign full work to packet 127. |
| R-004 | Manual docs retain old target-manifest examples | Low | Medium | Packet 124 fixes executable workflow/config paths; broader playbook cleanup can follow. |

<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

| ID | Story | Acceptance |
| --- | --- | --- |
| US-001 | As an operator, I want profile-generation failures to identify the failure class so I can distinguish bad input from broken scripts. | Missing files report `FILE_NOT_FOUND`; child output parse errors report `PARSE_ERROR`. |
| US-002 | As an evaluator user, I want unscored dimensions to be visible so a candidate is not rewarded for missing checks. | Empty dimensions emit `score: null` and `unscoredDimensions`. |
| US-003 | As a maintainer, I want docs and changelogs to match shipped code so future packets start from real state. | README, SKILL.md, changelog, and version frontmatter align. |
| US-004 | As a release operator, I want an early warning when runtime mirrors are incomplete before promotion. | `--require-runtime-mirrors` / env / config flag aborts on missing mirror paths. |

<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

| Question | Resolution |
| --- | --- |
| Should empty dimensions throw instead of null? | Resolved in ADR-001: null preserves a structured score artifact while preventing a promotion-quality recommendation. |
| Should mirror sync be required by default now? | Resolved in ADR-001: no, packet 127 owns full implementation; packet 124 adds an opt-in abort and TODO. |
| Should `plateau` become a journal enum? | Resolved from source: no, `improvement-journal.cjs` rejects `plateau`; docs align to the helper enum. |

<!-- /ANCHOR:questions -->

---

## 13. RELATED DOCUMENTS

- `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/005-deep-agent-improvement/001-research-recent-updates/research/research-report.md`
- `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/005-deep-agent-improvement/003-recommendations/improvement-roadmap.md`
- `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/005-deep-agent-improvement/002-applicability-analysis/applicability-table.md`
- `.opencode/skills/deep-agent-improvement/SKILL.md`
- `.opencode/skills/deep-agent-improvement/README.md`
