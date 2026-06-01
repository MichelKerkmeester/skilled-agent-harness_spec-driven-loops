

---
title: "Skill Advisor Scorer P0 Routing Fixes"
description: "Fixed two genuine P0 scorer and routing failures from the 028 playbook run in both the TypeScript scorer and the Python scorer, restoring behavioral parity on the regression contract."
trigger_phrases:
  - "scorer P0 routing fixes"
  - "F1b ambiguity abstention"
  - "skill advisor scorer parity"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/002-scorer-p0-routing-fixes` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation`

### Summary

The 028 playbook run exposed two genuine P0 scorer and routing failures. Low-information ambiguous prompts were mis-routing to sk-code instead of abstaining, and explicit slash commands were not reaching their owning skills. Both the TypeScript scorer and the Python scorer have been corrected, and the two implementations now stay at behavioral parity on the regression contract.

### Added

- None.

### Changed

- Explicit slash command routing now directs `/memory:save` to the owning skill `system-spec-kit` instead of the bridge alias `memory:save`. This applies to both the TypeScript scorer and the Python scorer.
- Toolchain-shaped vocabulary now disambiguates toward `mcp-code-mode` over the generic code skill. The phrases include "api chain", "call_tool_chain", "code mode", and "tool chain".
- A read-only route lifts `mcp-chrome-devtools` above the abstention floor when devtools vocabulary is present. This fixes a TypeScript-only divergence.

### Fixed

- Low-information abstention now fires only when the winner is built from ambiguous shared keywords rather than a distinctive phrase anchor. Terse but anchored prompts like "code audit" still route correctly.
- The Python `command-prompt-improver` bridge no longer fires on the bare word "prompt". The slash marker is now narrowed to the literal `/prompt`.

### Verification

- Regression P0 pass rate (TypeScript) - 12/12
- Regression P0 pass rate (Python) - 12/12
- Previously-passing regression cases - 0 regressed (both scorers)
- Python corpus accuracy (strict gold) - 45 to 62 correct, 0 lost rows
- TypeScript to Python parity tests - pass (regressions=0, tsAbstainsOnPythonCorrect=0)
- Python unit suite - 57/57 pass
- TypeScript vitest - 448 pass, 7 skipped (1 pre-existing unrelated failure: lane-weight-sweep stale 026 path)
- tsc --noEmit - clean

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `lib/scorer/fusion.ts` | Modified | code-mode disambiguation bonus, low-info abstention phrase-anchor guard, chrome-devtools read-only route allow |
| `lib/scorer/scoring-constants.ts` | Modified | mcpToolchain bonuses and lowInfoAmbiguityFloor calibration constants |
| `scripts/skill_advisor.py` | Modified | memory-save owner normalization (model B), prompt-improver bare-marker fix, code-mode disambiguation, low-info abstention ambiguous-ratio guard |
| `tests/python/test_skill_advisor.py` | Modified | T243-SA-017 owner updated to parity-correct system-spec-kit |
| `tests/parity/python-ts-parity.vitest.ts` | Modified | corpus baseline 45 to 62 (verified pure improvement, 0 lost rows) |
| `tests/legacy/advisor-corpus-parity.vitest.ts` | Modified | corpus baseline 45 to 62 (verified pure improvement, 0 lost rows) |

### Follow-Ups

- P1 alias drift remains for deep-research, deep-review, and deep-agent-improvement labels. The F1a alias fix covered advisor_validate but not these harnesses. Tracked separately.
- lane-weight-sweep.vitest.ts fails on a stale 026-packet path. This is pre-existing and unrelated to this phase.
