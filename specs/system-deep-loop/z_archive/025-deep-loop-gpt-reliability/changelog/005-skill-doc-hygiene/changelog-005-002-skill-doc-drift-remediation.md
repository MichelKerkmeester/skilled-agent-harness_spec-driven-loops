---
title: "Changelog: Skill-Doc Drift Remediation [031-deep-loop-gpt-reliability/005-skill-doc-hygiene/002-skill-doc-drift-remediation]"
description: "Chronological changelog for the Skill-Doc Drift Remediation phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-01

> Spec folder: `.opencode/specs/deep-loops/031-deep-loop-gpt-reliability/005-skill-doc-hygiene/002-skill-doc-drift-remediation` (Level 2)
> Parent packet: `.opencode/specs/deep-loops/031-deep-loop-gpt-reliability`

### Summary

Patched all 6 confirmed drift clusters from phase 014. A dedicated Cluster 6 investigation found orchestrate's `@deep-review` row is load-bearing, so `cli-opencode/SKILL.md`'s internal self-contradiction was fixed instead of touching `orchestrate.md`. A follow-up 10-iteration dual-model review (GPT-5.5-fast + GLM-5.2-max, 5/5) confirmed 2 more real residuals, both fixed.

### Added

- No new files besides the follow-up review's own fan-out artifacts (`review/lineages/{gpt-fast-high,glm-max}/`).

### Changed

- `cli-opencode/SKILL.md`, templates, and playbooks — stale `ai-council` direct-invoke guidance corrected.
- 5 deep-loop `SKILL.md` docs — stale `.opencode/agents/*.toml` mirror claims removed (one code-coupled via `scan-integration.cjs:18`).
- `.opencode/plugins/README.md` — entrypoint count/table corrected to include `mk-deep-loop-guard.js`.
- `cli-opencode/SKILL.md:292` — orchestrate-routing self-contradiction fixed (wording only, not `orchestrate.md`).
- `manual_testing_playbook/manual_testing_playbook.md:362` — residual stale line fixed after the follow-up review.
- Packet-completion-state metadata drift fixed after the follow-up review.

### Fixed

- All 6 confirmed drift clusters from phase 014.
- 2 additional real residuals found by a follow-up 10-iteration dual-model review (5 GPT-5.5-fast + 5 GLM-5.2-max iterations): a missed Cluster-1 instance and stale packet-completion metadata.
- A pre-existing `REPO_ROOT` path bug in two sandbox scripts, found during live verification.

### Verification

- Post-fix re-scan found and fixed 13 additional real `.toml`-mirror references beyond phase 014's citation sample.
- `deep-improvement` vitest suite: 411/413 (2 pre-existing, unrelated failures).
- Follow-up 10-iteration dual-model review (5/5 GPT-5.5-fast + GLM-5.2-max): 2 more real residuals confirmed and fixed; 1 GLM claim (wrong interpreter for `check-comment-hygiene.sh`) independently verified false and rejected (the file's own shebang confirms `python3` is correct).
- 1 GPT finding partially miscited (2 of 5 cited lines were already correct); the genuinely-real part (a pre-existing, out-of-scope routing-matrix table contradiction in `agent_delegation.md`) was flagged, not fixed, as a deliberate scope decision.
- `validate.sh --strict` — PASS, 0 errors / 0 warnings.
- Checklist present with all items verified.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/cli-opencode/SKILL.md` | Modified | Ai-council invoke guidance + routing self-contradiction fixed |
| `.opencode/plugins/README.md` | Modified | Entrypoint table corrected |
| `.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md` | Modified | Residual stale line (line 362) fixed |
| `review/lineages/gpt-fast-high/review-report.md` | Created | Follow-up adversarial review synthesis |
| `review/lineages/glm-max/review-report.md` | Created | Follow-up adversarial review synthesis |
| `implementation-summary.md` | Modified | Added Follow-Up: Post-Implementation Adversarial Review section |

### Follow-Ups

- `agent_delegation.md`'s routing-matrix table contradiction (GPT's partially-miscited finding) flagged as genuinely real but pre-existing and out of this phase's scope — not fixed here.
