---
title: "Code Graph 009/002: README Problem-First Rewrite"
description: "Full rewrite of system-code-graph/README.md in a problem-first marketing arc. The README now opens with a concrete operator pain point, walks through solution and mechanism. It follows the exemplar structure from the Public root README and the system-spec-kit README."
trigger_phrases:
  - "system-code-graph readme rewrite"
  - "readme marketing voice rewrite"
  - "problem-first readme"
  - "code graph readme 002"
  - "readme key statistics table"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-16

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/009-system-code-graph-uplift-phase-parent/002-readme-problem-first-rewrite` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/009-system-code-graph-uplift-phase-parent`

### Summary

The `system-code-graph/README.md` previously opened with implementation prose ("Structural code indexing, SQLite-backed graph storage..."), giving a cold reader a technical map without a reason to care. Operators unfamiliar with the skill had no way to evaluate its value before reaching any usage detail.

The README was rewritten front-to-back in a problem-first marketing arc. It now opens with a concrete operator pain point ("AI assistants can read individual files but cannot reason about call graphs"), then walks through the solution and mechanism before any technical reference. A Key Statistics table in the overview section captures tool count (11 MCP tools), server name, runtime package, parser stack plus readiness states. A 3-column comparison table ("Manual grep", "Semantic search", "System Code Graph") lets operators evaluate the skill against their existing options. A Cross-Skill Integration table names the four owner skills in the surrounding ecosystem. Sections 2 through 9 follow the system-spec-kit section ordering: QUICK START, FEATURES, STRUCTURE, CONFIGURATION, USAGE EXAMPLES, TROUBLESHOOTING, FAQ, RELATED DOCUMENTS.

Voice anchored on the Public root README problem-hook pattern and the system-spec-kit README section ordering, per the D1 rule locked at the phase parent (accept resemblance to exemplars, banned words and phrases remain banned).

### Added

None. The rewrite replaced existing content in one file with no new files or fields.

### Changed

- `system-code-graph/README.md` rewritten from implementation-first prose to a problem-first marketing arc (290 lines to 365 lines)
- Opening section restructured: problem hook leads, followed by solution breakdown, Key Statistics table, 3-column comparison table plus Cross-Skill Integration table
- Section ordering aligned to the system-spec-kit exemplar pattern (OVERVIEW through RELATED DOCUMENTS)

### Fixed

None. The rewrite was a voice and structure improvement, not a defect correction.

### Verification

| Check | Result |
|-------|--------|
| Banned-word grep (`leverage`, `empower`, `seamless`, `disrupt`, `harness`, `delve`, `realm`, `tapestry`, `illuminate`, `unveil`, `cutting-edge`, `game-changer`, `revolutionise`, `groundbreaking`, `embark`) | PASS, zero hits |
| Banned-phrase grep (`It's important to`, `Dive into`, `When it comes to`, `Let me be clear`, `In today's world`, `Moving forward`, `Here's the thing`, `navigate the challenges`, `unlock the potential`) | PASS, zero hits |
| Em-dash count (allowed per D1 but counted for awareness) | 0 |
| Section arc matches exemplar (OVERVIEW through RELATED DOCUMENTS) | PASS |
| Strict-validate child 002 (`validate.sh --strict`) | PASS, exit 0 errors and 0 warnings |
| Strict-validate parent 019 (`validate.sh --strict`) | PASS, exit 0 errors and 0 warnings |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-code-graph/README.md` | Modified (full rewrite, 290 to 365 lines) | Problem-first arc. Key Statistics table. 3-column comparison. Cross-Skill Integration table. Sections 1 through 9 in system-spec-kit ordering. |

### Follow-Ups

- Child 003 may flag remaining stylistic carries during its `validate_document.py --type readme` pass. Review any findings against the D1 resemblance rule before acting on them.
- HVR score was not formally measured. D1 relaxed the strict score floor for this packet. A future operator may want to run the scorer and record the baseline for comparison.
