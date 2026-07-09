# Iteration 1 Narrative — Lane C Scorer Correctness

## Focus
Lane C scorer correctness: brace/dict parsing edge cases in `router-replay.cjs`; recall/negative-activation math in `score-skill-benchmark.cjs`; D5 penalty/gate logic and score double-counting in `d5-connectivity.cjs`.

---

## Findings

### F-HS-I1-01
- **severity:** P1
- **file:** `router-replay.cjs`
- **line:** 59
- **issue:** `parseIntentSignals` entry regex `[^}]*` cannot parse nested braces in intent-signal values. For `KEY: {"weight": 1, "keywords": ["a"], "meta": {"priority": "high"}}`, `[^}]*` stops at the first `}` (inside `"meta":{...}`), truncating `"meta": {"priority": "high"` as the inner block — `weightMatch` finds `1` but `kwMatch` never matches because the `"keywords"` key was truncated before it.
- **one-line fix:** Replace `[^}]*` with a brace-depth-tracking parser or `\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}` to handle one level of nesting, or switch to `Function('return{'+body+'}')` with try/catch fallback.

### F-HS-I1-02
- **severity:** P1
- **file:** `router-replay.cjs`
- **line:** 65
- **issue:** `kwMatch` regex `[^\]]*` cannot parse nested brackets in keyword arrays. For `keywords: ["a", ["b", "c"]]`, `[^\]]*` stops at the inner `]`, producing ` "a", ["b", "c` — `quotedStrings` then extracts `"a"` and `"b"`, dropping `"c"` and corrupting keyword coverage.
- **one-line fix:** Use a bracket-depth-tracking parser for the keywords array, or restrict the format to forbid nested arrays in SKILL.md (enforce flat `["a","b"]` only) and document the constraint.

### F-HS-I1-03
- **severity:** P1
- **file:** `router-replay.cjs`
- **line:** 31–45
- **issue:** `extractDictBody` does not distinguish literal `{`/`}` inside strings from structural braces. If a DEFAULT_RESOURCE path contains a brace character (e.g., `DEFAULT_RESOURCE = "style/{id}.css"`), `indexOf('{')` finds the brace inside the string, not the opening brace of the dict body, causing depth tracking to start at the wrong position and return `null` or a wrong substring.
- **one-line fix:** Track whether the current character is inside a quoted string; skip string content when searching for structural braces, or escape/normalize brace sequences in paths before lookup.

### F-HS-I1-04
- **severity:** P2
- **file:** `d5-connectivity.cjs`
- **line:** 47–52 vs 91–92
- **issue:** Early-return path (missing SKILL.md) sets `score: 0`. Normal path for the same condition (if early return were removed) would produce `score: 60` (one P0 penalty of 40 from `missing_skill_md`). The `gateFailed: true` masks the inconsistency, but the returned `score` is inconsistent with the penalty formula — confusing for debugging and score-comparison logic.
- **one-line fix:** Harmonize the early-return `score` with the penalty formula (e.g., `score: 60`) or refactor so both paths share the same scoring logic.

### F-HS-I1-05
- **severity:** P2
- **file:** `score-skill-benchmark.cjs`
- **line:** 49
- **issue:** D1-intra uses hard-coded `0.4`/`0.6` weights for intentRecall/resourceRecall with no justification comment. If a future skill has very sparse intent signals but dense resource signals, the 0.6 resource weight may over-credit the D1 score. The comment at line 16 says "D1=25 (inter12+intra13)" but does not explain how 0.4/0.6 maps to the 13 intra points.
- **one-line fix:** Add a comment explaining the 0.4/0.6 rationale and confirm it sums correctly to the 13-point D1-intra allocation.

---

## Verdict

**Review verdict: CONDITIONAL**

Reasoning: No P0 bugs found. Three P1 latent-parsing issues that would silently corrupt scoring for non-trivial SKILL.md router blocks. Two P2 style/inconsistency issues. The gate/double-count logic in `d5-connectivity` is sound; negative-activation math in `score-skill-benchmark` is correct (D2 at line 55 correctly uses `dims.d1intra.score` for negative cases, contrary to an initial misread).

**Risk summary:** Lane C scorers will mis-score skills that use nested dict/array structures in their INTENT_SIGNALS keywords or meta fields — a real-world vector since many skills already use nested metadata objects.
