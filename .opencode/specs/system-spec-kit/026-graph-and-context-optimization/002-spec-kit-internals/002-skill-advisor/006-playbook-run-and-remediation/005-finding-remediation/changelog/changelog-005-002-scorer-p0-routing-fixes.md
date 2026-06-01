

---
title: "Changelog: Scorer P0 Routing Fixes (F1b) [005-finding-remediation/002-scorer-p0-routing-fixes]"
description: "Fixed genuine P0 scorer and routing failures in both the TypeScript and Python scorers so they stay at behavioral parity on the regression contract."
trigger_phrases:
  - "scorer P0 routing fixes"
  - "F1b ambiguity abstention"
  - "code-mode disambiguation"
  - "model-B owner normalization"
  - "low-information abstention"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/002-scorer-p0-routing-fixes` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation`

### Summary

The 028 playbook run uncovered genuine P0 scorer and routing failures in both the TypeScript scorer and the Python scorer. Model-B explicit slash commands like `/memory:save` were routing to a bridge alias instead of the owning skill. Low-information ambiguous prompts like "api chain mcp" were routing to sk-code instead of abstaining or selecting mcp-code-mode. Both issues were fixed so the two implementations stay at behavioral parity on the regression contract.

### Added

- None.

### Changed

- Low-information abstention fires in both scorers when a winner is driven by ambiguous shared keywords rather than a distinctive phrase or intent anchor, so terse-but-anchored prompts like "code audit" still route correctly.

### Fixed

- Model-B owner normalization corrected memory-save routing in the Python scorer so explicit `/memory:save` commands route to the owning skill system-spec-kit instead of the bridge alias.
- Prompt-improver slash marker in the Python scorer was narrowed to the literal `/prompt` so bare word "prompt" no longer mis-routes "improve this prompt" away from sk-prompt.
- Code-mode disambiguation bonus was added to both scorers so toolchain-shaped vocabulary like "api chain", "call_tool_chain", and "code mode" disambiguates toward mcp-code-mode over the generic code skill.
- Chrome-devtools read-only route allow rule lifts mcp-chrome-devtools off the abstention floor when devtools vocabulary is present, fixing a TS-only divergence.

### Verification

- Regression P0 pass rate (TS) - 12/12
- Regression P0 pass rate (Python) - 12/12
- Previously-passing regression cases - 0 regressed (both scorers)
- Python corpus accuracy (strict gold) - 45 to 62 correct, 0 lost rows
- TS and Python parity tests - pass (regressions=0, tsAbstainsOnPythonCorrect=0)
- Python unit suite - 57/57 pass
- TS vitest - 448 pass, 7 skipped (1 pre-existing unrelated failure: lane-weight-sweep stale 026 path)
- tsc --noEmit - clean
- verify_alignment_drift.py - PASS (0 violations)

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Modify | code-mode disambiguation bonus; low-info abstention (phrase-anchor guarded); chrome-devtools read-only route allow |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts` | Modify | mcpToolchain bonuses and lowInfoAmbiguityFloor calibration constants |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Modify | memory-save owner normalization (model B); prompt-improver bare-marker fix; code-mode disambiguation; low-info abstention (ambiguous-ratio guarded) |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/python/test_skill_advisor.py` | Modify | T243-SA-017 owner updated to parity-correct system-spec-kit |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/python-ts-parity.vitest.ts` | Modify | corpus baseline 45 to 62 (verified pure improvement, 0 lost rows) |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/legacy/advisor-corpus-parity.vitest.ts` | Modify | corpus baseline 45 to 62 (verified pure improvement, 0 lost rows) |

### Follow-Ups

- Out-of-scope P1 alias drift remains. Regression and corpus cases labeled sk-deep-research, sk-deep-review, or sk-deep-agent-improvement still fail strict matching against the live deep-* IDs in the regression harness. The F1a alias fix covered advisor_validate but not these harnesses. Tracked separately.
- lane-weight-sweep.vitest.ts fails on a stale 026-packet path. Pre-existing, unrelated to this phase. The referenced 002-skill-advisor-scoring-engine packet was renamed in the 026 reorg.
