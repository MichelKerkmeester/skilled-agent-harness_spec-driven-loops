---
title: "Cross-Runtime Hook Parity Release-Readiness Audit"
description: "Release-readiness audit for hook delivery parity across Claude, Codex, Copilot, Gemini, OpenCode. Produced one P0 silent feature gap in the Copilot live wrapper path, three P1 contract and evidence gaps, two P2 parity polish items."
trigger_phrases:
  - "cross-runtime hook parity audit"
  - "hook parity release readiness"
  - "copilot live wrapper spec kit gap"
  - "5-runtime hook review"
  - "hook parity P0 findings"
importance_tier: "important"
contextType: "review"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/005-cross-runtime-hook-parity-audit` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits`

### Summary

The release-readiness program needed a runtime-by-runtime truth check for Spec Kit hook delivery. Prior remediation had clarified the hook contract, but release confidence still depended on whether Claude, Codex, Copilot, Gemini, OpenCode each produce the documented signal, expose actionable fallback paths, avoid silent feature loss when an operator switches runtimes.

A read-only audit examined hook source under `.opencode/skills/system-spec-kit/mcp_server/hooks/`, the OpenCode skill-advisor plugin bridge, hook contract docs, per-runtime configs, plus prior evidence from packets 035, 043, 044. The audit produced a 9-section `review-report.md` with severity-classified findings and file:line evidence. The overall verdict is FAIL.

One P0 finding was surfaced: the checked-in Copilot live hook wrapper does not invoke the Spec Kit writer scripts, meaning operators switching to Copilot can silently lose Spec Kit context. Three P1 gaps cover missing normal-shell live CLI verdicts, an undocumented fallback path, a contract ambiguity. Two P2 items cover parity polish. This packet is read-only by design. Active findings require a follow-up remediation packet.

### Added

- None. Review-only phase.

### Changed

- None. Review-only phase.

### Fixed

- None. Review-only phase.

### Verification

| Check | Result |
|-------|--------|
| Evidence review | PASS. Source, docs, configs, packets 035/043/044 reviewed with file:line citations. |
| Packet scope | PASS. All authored files are packet-local. No hook source or runtime config was modified. |
| Strict validator | PASS. `validate.sh --strict` exits 0 with zero errors and zero warnings. |
| CHK-001 Requirements documented in spec.md | PASS. spec.md sections 2 through 5 present. |
| CHK-002 Technical approach defined in plan.md | PASS. plan.md sections 1 through 5 present. |
| CHK-010 Audited hook source remained read-only | PASS. Packet changes are limited to this folder. |
| Review verdict | FAIL. Active findings: P0=1, P1=3, P2=2. Remediation required before release. |
| Normal-shell live CLI evidence | UNKNOWN. Latest run-output cells are sandbox-skipped. No normal-shell verdict is available. |

### Files Changed

| File | What changed |
|------|--------------|
| `005-cross-runtime-hook-parity-audit/review-report.md` (NEW) | 9-section deep-review report. Verdict FAIL. P0=1, P1=3, P2=2. |
| `005-cross-runtime-hook-parity-audit/spec.md` (NEW) | Audit scope, acceptance criteria, requirements. |
| `005-cross-runtime-hook-parity-audit/plan.md` (NEW) | Evidence-first audit execution plan. |
| `005-cross-runtime-hook-parity-audit/tasks.md` (NEW) | Completed audit task ledger, 14 items. |
| `005-cross-runtime-hook-parity-audit/checklist.md` (NEW) | Verification checklist with evidence rows. |
| `005-cross-runtime-hook-parity-audit/implementation-summary.md` (NEW) | Audit deliverable summary and known limitations. |
| `005-cross-runtime-hook-parity-audit/description.json` (NEW) | Memory metadata for the packet. |
| `005-cross-runtime-hook-parity-audit/graph-metadata.json` (NEW) | Graph dependencies and status metadata. |

### Follow-Ups

- Open a remediation packet to fix the P0 Copilot live wrapper gap before any release gating that includes Copilot as a supported runtime.
- Collect normal-shell live CLI verdicts for all five runtimes outside the sandbox to close the P1 evidence gap.
- Document the Copilot fallback path in the hook contract so the gap cannot silently recur after remediation.
