---
title: "Skill Advisor Freshness Release-Readiness Audit"
description: "Read-only deep-review audit of skill advisor freshness: status/rebuild split, cache invalidation, scoring trust boundary, Codex cold-start fallback marker, Python shim parity. Produced one P1 finding (rebuild workspace contract gap) plus two P2 findings (Python fallback parity, scorer weight doc drift). No P0 issues found."
trigger_phrases:
  - "skill advisor freshness audit"
  - "advisor rebuild contract gap"
  - "advisor freshness release readiness"
  - "P1 rebuild workspaceRoot"
  - "daemon freshness review"
importance_tier: "important"
contextType: "review"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/003-skill-advisor-freshness-audit` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits`

### Summary

Prior packets unified the skill advisor daemon and advisor paths, but the release program needed evidence-backed answers on freshness reporting, status side effects, explicit rebuild correctness. A read-only audit covered the skill advisor runtime surfaces, scoring tables, Codex cold-start fallback behavior, Python shim parity. The audit produced a 9-section review report with severity-classified findings.

No P0 evidence of silent stale-context fallback or runtime scoring corruption was found. The `advisor_status` handler is diagnostic-only, `advisor_rebuild({ force: true })` performs a real index and generation publish. Static boost tables are not prompt-controlled. One P1 finding was identified: the public `advisor_rebuild` MCP schema does not accept `workspaceRoot`, while the manual status/rebuild playbook instructs operators to pass it, making the explicit repair path unreliable for non-`process.cwd()` workspaces. Two P2 findings cover Python forced/local fallback non-equivalence to native TS scoring as well as scorer weight documentation drift in the README and manual playbook.

### Added

- None. Review-only phase.

### Changed

- None. Review-only phase.

### Fixed

- None. Review-only phase.

### Verification

- `review-report.md` 9-section audit document produced with file:line evidence for all findings.
- Active finding registry: 1 P1 (rebuild workspace contract), 2 P2 (Python fallback parity, scorer weight doc drift).
- Read-only scope confirmed: only files under this packet folder were authored.
- Strict packet validation passed: `validate.sh <packet> --strict` exits 0.
- Six advisor-specific questions answered in report sections 7 and 9 with file:line citations.

### Files Changed

| File | What changed |
|------|--------------|
| `003-skill-advisor-freshness-audit/review-report.md` (NEW) | 9-section release-readiness report with P1/P2 findings and file:line evidence |
| `003-skill-advisor-freshness-audit/spec.md` (NEW) | Audit scope. Constraints. Acceptance criteria |
| `003-skill-advisor-freshness-audit/plan.md` (NEW) | Evidence-first audit plan and validation strategy |
| `003-skill-advisor-freshness-audit/tasks.md` (NEW) | Completed audit task ledger |
| `003-skill-advisor-freshness-audit/checklist.md` (NEW) | Verification checklist with evidence |
| `003-skill-advisor-freshness-audit/implementation-summary.md` (NEW) | Audit deliverable summary |
| `003-skill-advisor-freshness-audit/description.json` (NEW) | Memory metadata for the packet |
| `003-skill-advisor-freshness-audit/graph-metadata.json` (NEW) | Graph dependencies and status metadata |

### Follow-Ups

- Add `workspaceRoot` to the `advisor_rebuild` input schema and tool descriptor. Alternatively update the playbook and status/rebuild docs to document a cwd-only contract.
- Label the forced/local Python scoring path as a legacy degraded fallback with explicit non-equivalence documentation. Alternatively add golden parity tests against the native TS scorer.
- Update the README and manual playbook lane-registry table to match the runtime weights in `lane-registry.ts` (derived lane is 0.15 at runtime, documented as 0.10 in several places).
