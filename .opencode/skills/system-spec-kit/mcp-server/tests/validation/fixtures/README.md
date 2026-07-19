---
title: "Validation Fixtures: Evidence Marker Fence Edge Cases"
description: "Test fixtures for evidence marker parsing robustness, providing markdown samples that test [EVIDENCE:...] marker extraction against indented, mismatched and nested fence block configurations."
trigger_phrases:
  - "evidence marker fixtures"
  - "fence edge case fixtures"
  - "parseMarkers fixtures"
  - "evidence marker audit test data"
---

# Validation Fixtures: Evidence Marker Fence Edge Cases

> Fixture-only directory that provides markdown samples for testing the evidence marker parser against fence block edge cases that can appear in spec documentation.

---

## 1. OVERVIEW

`tests/validation/fixtures/` owns markdown fixture files that test the `parseMarkers` function against fence block edge cases. The fixtures ensure that `[EVIDENCE:...]` markers inside fenced code blocks are correctly ignored while markers outside fence context are properly extracted.

Current state:

- 3 markdown files provide the full fixture surface. No subdirectories or executable code exist.
- `evidence-indented-fence.md` tests that markers inside indented triple-backtick blocks with paren-heavy content return empty results.
- `evidence-mismatched-fence.md` tests the documented false-negative behavior for unclosed fence blocks, where markers after an unclosed opening fence may be incorrectly suppressed.
- `evidence-nested-fence.md` tests that inner triple-backtick lines inside an outer four-backtick fence are preserved as content and markers after the outer fence closes are correctly parsed.
- The consumer test `tests/validation/evidence-marker-audit.vitest.ts` loads fixtures through a `loadFixture()` helper and validates that `parseMarkers` returns the expected marker arrays.
- Each fixture must include `[EVIDENCE:...]` markers to test parsing behavior.
- The fixtures represent real-world markdown edge cases that can occur in spec documentation.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `evidence-indented-fence.md` | Tests that evidence markers inside indented fenced code blocks are correctly ignored by the parser. |
| `evidence-mismatched-fence.md` | Tests the documented false-negative behavior where unclosed fence blocks cause markers after the opening fence to be suppressed. |
| `evidence-nested-fence.md` | Tests that inner triple-backtick blocks inside outer four-backtick fences are preserved as content and markers outside the outer fence are parsed correctly. |

---

## 3. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `evidence-indented-fence.md` | Fixture | Markdown fixture with indented fence blocks, loaded by `tests/validation/evidence-marker-audit.vitest.ts`. |
| `evidence-mismatched-fence.md` | Fixture | Markdown fixture with unclosed fence blocks, loaded by `tests/validation/evidence-marker-audit.vitest.ts`. |
| `evidence-nested-fence.md` | Fixture | Markdown fixture with nested four-backtick and triple-backtick fences, loaded by `tests/validation/evidence-marker-audit.vitest.ts`. |

---

## 4. VALIDATION

Run from the repository root.

```bash
cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/validation/evidence-marker-audit.vitest.ts
```

Expected result: exit code 0, all 4 tests pass.

---

## 5. RELATED

- [Parent: Validation Tests](../README.md)
- [Tests: tests/](../../README.md)
- [Skill README](../../../README.md)
