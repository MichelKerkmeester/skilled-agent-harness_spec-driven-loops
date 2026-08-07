---
title: "Changelog: Multi-AI Council Persistence [089-multi-ai-council-persistence/root]"
description: "Chronological changelog for the Multi-AI Council Persistence spec root."
trigger_phrases:
  - "root changelog"
  - "packet changelog"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-05-06

> Spec folder: `specs/skilled-agent-orchestration/089-multi-ai-council-persistence` (Level 3)

### Summary

All 4 runtimes verified to have §16 CALLER PERSISTENCE PROTOCOL + §17 SUMMARY in identical normalized form.

### Added

- Create folder + description.json (via create.sh)
- Author plan.md (canonical template anchors with L2/L3 add-ons)
- Author implementation-summary.md placeholder (canonical anchors)
- Create directory .opencode/skills/system-spec-kit/scripts/multi-ai-council/
- Author persist-artifacts.cjs (Node CJS, parser/renderer/builder/state-line exports + CLI)
- Add §17 Caller Persistence Protocol to .opencode/agents/multi-ai-council.md

### Changed

- Move folder under skilled-agent-orchestration/
- Author spec.md (Level 3, canonical template anchors)
- Author tasks.md (this file)
- Author checklist.md (CHK-XXX [P*] format)
- Author decision-record.md (4 ADRs)
- Strict validation passes on packet 089

### Fixed

- [P] Author 3 fixtures under scripts/tests/fixtures/multi-ai-council/ (full / minimal / missing-required)
- CHK-062 Fixtures located under scripts/tests/fixtures/multi-ai-council/
- CHK-070 Helper architecture matches deep-research/deep-review reducer pattern (Node CJS, parser exports, fixture-driven)

### Verification

- Spec docs (Phase 1) - PASS
- Helper script (Phase 2A) - PASS
- Output schema (Phase 2A) - PASS
- Fixtures (Phase 2A) - PASS
- Helper vitest (Phase 2A) - PASS
- Agent body §16 (Phase 2B) - PASS
- Validator regression (Phase 2C) - PASS
- Mirror parity (Phase 2C) - PASS-DESIGN

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- CHK-100 Planning-only invariant preserved: agent retains write/edit/bash/patch deny across all 4 runtimes
- CHK-101 ADR-001 lightweight bound preserved: no .opencode/skills/multi-ai-council/ folder
- CHK-102 AGENTS.md / runtime mirror conventions followed (per memory feedback_new_agent_mirror_all_runtimes)
- Run bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet-089> --strict (exit 0)
- Generate nested changelog via nested-changelog.js
- Run /memory:save via generate-context.js
