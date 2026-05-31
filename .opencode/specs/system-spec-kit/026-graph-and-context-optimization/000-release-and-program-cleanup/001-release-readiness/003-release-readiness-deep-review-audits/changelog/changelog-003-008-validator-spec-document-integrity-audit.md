---
title: "Release Readiness Audit 008: Validator and Spec-Doc Integrity"
description: "Release-readiness audit of the spec validator, phase-parent detectors and template rules. Detector parity across 1,550 folders was clean, but strict validation carries three P0 findings: a false negative for fenced structure plus two false positives blocking valid phase parents and custom research sections."
trigger_phrases:
  - "validator spec document integrity audit"
  - "strict validator false negative fenced structure"
  - "phase parent false positive SPEC_DOC_INTEGRITY"
  - "release readiness audit 008"
  - "validator P0 findings review"
importance_tier: "important"
contextType: "review"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/008-validator-spec-document-integrity-audit` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits`

### Summary

The spec validator is a release gate for system-spec-kit packets. Before the 026 release program could promote it as trustworthy, the phase-parent detectors needed a parity check and strict mode needed adversarial probing for false negatives and false positives.

The audit ran detector parity across 1,550 candidate folders, finding 94 phase parents with zero divergences between the shell and TypeScript implementations. Adversarial probes under `/tmp` then exposed three P0 findings. Strict mode accepted a Level 2 spec whose required headers and anchors were hidden inside a fenced code block. It also rejected a valid lean phase parent by treating prose mentions of `plan.md` and `tasks.md` as missing files. It also rejected a research packet that added a documented custom section. The audit is read-only by request, so the findings are recorded in `review-report.md` and routed to a follow-on remediation packet.

### Added

- None. Review-only phase.

### Changed

- None. Review-only phase.

### Fixed

- None. Review-only phase.

### Verification

| Check | Result |
|-------|--------|
| Shell/TS detector parity | PASS. 1,550 candidates checked, 94 phase parents, 0 divergences |
| Frontmatter narrative probe | PASS. Narrative `recent_action` value rejected by strict mode |
| Fenced structure probe | FAIL as product behavior. Strict validator passed malformed spec with anchors inside a fenced block |
| Phase-parent strict sample | FAIL as product behavior. Valid lean phase parent rejected by SPEC_DOC_INTEGRITY |
| Packet strict validation | PASS. Final packet docs pass `validate.sh --strict` |
| CHK-001 Requirements documented | PASS. `spec.md` anchors metadata through questions populated |
| CHK-002 Technical approach defined | PASS. `plan.md` lists read, probe and synthesis stages |
| CHK-003 Dependencies identified | PASS. Target validator files and related packets were read |

Active findings: P0=3, P1=1, P2=2. Verdict: FAIL. Remediation deferred to a follow-on packet.

Review report: `008-validator-spec-document-integrity-audit/review-report.md`

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `008-validator-spec-document-integrity-audit/review-report.md` (NEW) | Created | Nine-section release-readiness report with P0/P1/P2 findings and concrete fix seeds |
| `008-validator-spec-document-integrity-audit/spec.md` (NEW) | Created | Audit scope, requirements and acceptance scenarios |
| `008-validator-spec-document-integrity-audit/plan.md` (NEW) | Created | Audit execution plan with read, probe and synthesis phases |
| `008-validator-spec-document-integrity-audit/tasks.md` (NEW) | Created | Completed task ledger |
| `008-validator-spec-document-integrity-audit/checklist.md` (NEW) | Created | Verification evidence checklist |
| `008-validator-spec-document-integrity-audit/implementation-summary.md` (NEW) | Created | Completion summary and key decisions |
| `008-validator-spec-document-integrity-audit/description.json` (NEW) | Created | Discovery metadata |
| `008-validator-spec-document-integrity-audit/graph-metadata.json` (NEW) | Created | Graph metadata |

### Follow-Ups

- Plan and execute validator remediation for P0-001: move header and anchor extraction to a markdown-aware parser that ignores fenced blocks.
- Plan and execute validator remediation for P0-002: restrict `SPEC_DOC_INTEGRITY` to explicit Markdown links and declared metadata references rather than every backticked prose token.
- Plan and execute validator remediation for P0-003: add an allowed-extra-header registry keyed by `contextType` so research packets with documented custom sections pass strict mode.
- Decide release posture for `SPECKIT_VALIDATE_LINKS`: the P1 finding recommends keeping it default-off until the link scanner excludes unrelated skill docs.
