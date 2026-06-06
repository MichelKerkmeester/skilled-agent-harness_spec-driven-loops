# Deep Research Iteration 003 of 20 — auto-review.ts part 1 (imports, types, config, debug logger, markers, abort constants)

## SITUATION

You are running as **cli-devin SWE-1.6** in non-interactive print mode, dispatched as iteration 3 of a 20-iteration deep-research campaign on the upstream `dzianisv/opencode-plugins` `auto-review` package.

**Prior context**:
- Iter 001 pinned an upstream commit SHA (recorded as `PINNED_UPSTREAM_SHA: <sha>` in iter-001.md) and extracted the README into a 12-row table.
- Iter 002 extracted the example.json config schema and predicted runtime defaults.

**Why this iter exists**: `auto-review.ts` is the heart of the plugin. It's ~430 lines and contains the entire plugin implementation. This campaign reads it across **three** iterations (003, 004, 005) to keep each iter focused and avoid context-window saturation. **Your iter (003) covers lines 1-120**: imports, type definitions, config loading, debug logger initialization, the review-marker constants, and the abort-cooldown constants.

**Critical mechanisms in your range**:
1. `loadConfig()` async function (~lines 20-30): reads `~/.config/opencode/plugin/auto-review.json`, returns `{}` on any error
2. `AutoReviewConfig` type (~lines 12-19): the canonical config schema — confirm or refute iter-002's predictions
3. `ABORT_COOLDOWN = 10_000` and `ABORT_RACE_DELAY = 1_500` (~lines 30-32): millisecond constants for abort handling
4. `REVIEW_MARKERS` array (~lines 33-40): 5 string markers that prevent review-of-review loops
5. `SELF_ASSESSMENT_MARKER` and `FEEDBACK_MARKER` constants (~lines 41-42): additional loop-prevention markers
6. `SessionInfo`, `SessionPart`, `SessionMessage`, `ModelSpec` types (~lines 43-80): the structural data the plugin manipulates
7. `initDebugLogger()` function (~lines 80-120): lazy-mkdir + ISO-timestamped append-only logging

## TASK

### Step 1 — Reuse pinned SHA + fetch the file

```bash
SHA=$(rg -oP 'PINNED_UPSTREAM_SHA:\s*\K[0-9a-f]{40}' .opencode/specs/skilled-agent-orchestration/106-opencode-auto-review-teachings-research/research/iterations/iteration-001.md | head -1)
echo "USING_SHA=$SHA"

gh api "repos/dzianisv/opencode-plugins/contents/packages/auto-review/auto-review.ts?ref=$SHA" \
  --jq '.content' 2>/dev/null | base64 -d > /tmp/upstream-auto-review-003.ts \
  || curl -sL "https://raw.githubusercontent.com/dzianisv/opencode-plugins/$SHA/packages/auto-review/auto-review.ts" > /tmp/upstream-auto-review-003.ts

wc -l /tmp/upstream-auto-review-003.ts
sed -n '1,120p' /tmp/upstream-auto-review-003.ts
```

### Step 2 — Extract each numbered mechanism above

For each of the 7 mechanisms in your range, document:
- **Line range** in the upstream file (e.g. `:12-19`)
- **Verbatim signature** (function declaration / type declaration / constant value)
- **Inferred purpose** in plain English
- **Notable design choices** (e.g. why `loadConfig` returns `{}` on any error rather than throwing — silent-failure pattern; why ABORT_COOLDOWN is 10s vs 30s — design tradeoff)

### Step 3 — Cross-check iter-002 config predictions

For each field iter-002 predicted, find the corresponding handling in `AutoReviewPlugin` (visible at the bottom of `auto-review.ts`, but you can already see the type definition in your range). Mark each iter-002 prediction as `CONFIRMED` or `REFUTED` with evidence.

### Step 4 — Document the 5 review markers VERBATIM

The `REVIEW_MARKERS` array is critical for loop prevention. Document each marker string exactly as written. Likewise SELF_ASSESSMENT_MARKER and FEEDBACK_MARKER. These will be referenced in iter 009 (loop-prevention mechanism).

### Step 5 — Note the debug-logger pattern

The `initDebugLogger` function uses a closure over `debug` (the module-level variable) to enable logging conditionally. Document:
- Where the log file lives (path expression)
- The lazy `mkdir -p` pattern
- The safe stringify wrapper (try JSON.stringify, fall back to String)
- The ISO-timestamp prefix format

## SCOPE (this iteration only)

- `packages/auto-review/auto-review.ts` lines 1-120 only
- `research/iterations/iteration-001.md` (SHA reuse)
- `research/iterations/iteration-002.md` (config-prediction cross-check)
- **No writes outside `research/iterations/iteration-003.md` and `research/deep-research-state.jsonl`**

## VERIFICATION COMMANDS

```bash
SHA=$(rg -oP 'PINNED_UPSTREAM_SHA:\s*\K[0-9a-f]{40}' .opencode/specs/skilled-agent-orchestration/106-opencode-auto-review-teachings-research/research/iterations/iteration-001.md | head -1)

# Fetch the file
gh api "repos/dzianisv/opencode-plugins/contents/packages/auto-review/auto-review.ts?ref=$SHA" \
  --jq '.content' 2>/dev/null | base64 -d > /tmp/upstream-auto-review-003.ts \
  || curl -sL "https://raw.githubusercontent.com/dzianisv/opencode-plugins/$SHA/packages/auto-review/auto-review.ts" > /tmp/upstream-auto-review-003.ts

# Print your range
sed -n '1,120p' /tmp/upstream-auto-review-003.ts

# Locate specific identifiers
grep -n 'loadConfig\|AutoReviewConfig\|ABORT_COOLDOWN\|ABORT_RACE_DELAY\|REVIEW_MARKERS\|SELF_ASSESSMENT_MARKER\|FEEDBACK_MARKER\|initDebugLogger' /tmp/upstream-auto-review-003.ts | head -30
```

## CONSTRAINTS

- READ-ONLY.
- Cite `packages/auto-review/auto-review.ts:<line>` for every claim.
- Quote constant values and array literals VERBATIM (no paraphrasing).
- Reuse the SHA from iter-001.
- Do NOT exceed lines 1-120 in your reading — iters 004 and 005 cover the rest.
- Stop adding new probes past minute 5; spend minute 5-6 writing output.

## COMMON FAILURE MODES

1. **File >120 lines but section boundaries unclear**: if a critical mechanism (e.g. `initDebugLogger`) crosses your line boundary, extend just enough to capture it and NOTE the overflow in your output so iter-004 knows to skip.
2. **TypeScript type imports**: don't get confused by `import type` syntax; treat type imports as no-ops at runtime.
3. **Async-IIFE in initDebugLogger**: the `;(async () => { ... })()` pattern is intentional — document why (lazy initialization without blocking the outer function).

## OUTPUT FORMAT

Write to `research/iterations/iteration-003.md`:

```markdown
<!-- PINNED_UPSTREAM_SHA: <sha> -->

# Iteration 003 — auto-review.ts part 1 (lines 1-120)

## Summary
<2-4 sentence verdict on the mechanisms in lines 1-120>

## Files/Commands Reviewed
- `packages/auto-review/auto-review.ts:1-120` (at sha <sha>)
- `research/iterations/iteration-001.md` (SHA reuse)
- `research/iterations/iteration-002.md` (config-prediction cross-check)

## Findings

### Mechanism Extraction
| ID | Mechanism | Line range | Signature / verbatim | Inferred purpose | Notable design choice |
|----|-----------|-----------|---------------------|------------------|----------------------|
| M-1 | loadConfig | :20-30 | `async function loadConfig(): Promise<AutoReviewConfig>` | Reads `~/.config/opencode/plugin/auto-review.json` | Silent-failure (returns `{}` on any throw) |
| M-2 | AutoReviewConfig type | :12-19 | `type AutoReviewConfig = { ... }` | Config schema (model/reasoning/minToolCalls/debug) | All fields optional |
| M-3 | Abort constants | :30-32 | `const ABORT_COOLDOWN = 10_000`, `const ABORT_RACE_DELAY = 1_500` | Millisecond timeouts | 10s cooldown after MessageAbortedError; 1.5s race window |
| M-4 | REVIEW_MARKERS | :33-40 | `["AUTO-REVIEW", "AUTO REVIEW", "REVIEW AUTO-REVIEW", "Review another model's work", "You are reviewing another session"]` | Substring matches that flag a message as already-being-reviewed | Case-insensitive comparison (via .toLowerCase) |
| M-5 | SELF_ASSESSMENT_MARKER | :41 | `"SELF-ASSESS REFLECTION-3"` | Loop-prevention for self-assessment surfaces | Single literal |
| M-6 | FEEDBACK_MARKER | :42 | `"REFLECTION FEEDBACK"` | Loop-prevention for feedback-message surfaces | Single literal |
| M-7 | Session* types | :43-80 | `type SessionInfo`, `type SessionPart`, `type SessionMessage`, `type ModelSpec` | OpenCode SDK message shape | Permissive (most fields optional) |
| M-8 | initDebugLogger | :80-120 | `function initDebugLogger(directory, enabled)` | Lazy debug-log writer | Lazy mkdir (dirReady flag), ISO-timestamp prefix, async-IIFE wrapper, safe JSON.stringify |

### Iter-002 Prediction Cross-Check
| Iter-002 field | Predicted default | Actual from M-2 type | Verdict |
|----------------|-------------------|----------------------|---------|
| model | `""` | optional string, defaults to env var or `""` | CONFIRMED |
| reasoning | `""` | optional string | CONFIRMED |
| minToolCalls | `3` | optional number, defaults to `3` (visible at AutoReviewPlugin scope, not yet read here — predict CONFIRMED until iter-005) | PREDICTED |
| debug | `false` | optional boolean | CONFIRMED |

### Verbatim Marker Strings (CRITICAL — referenced by iter 009)
```text
REVIEW_MARKERS = [
  "AUTO-REVIEW",
  "AUTO REVIEW",
  "REVIEW AUTO-REVIEW",
  "Review another model's work",
  "You are reviewing another session",
]
SELF_ASSESSMENT_MARKER = "SELF-ASSESS REFLECTION-3"
FEEDBACK_MARKER = "REFLECTION FEEDBACK"
```

### Debug Logger Pattern (referenced by iter 013)
- Log file: `<directory>/.reflection/debug.log`
- Lazy `mkdir -p` on first write (closure flag `dirReady`)
- Format: `[<ISO8601>] [AutoReview] <message>\n`
- Safe stringify: try `JSON.stringify(arg)`, fall back to `String(arg)`
- Async-IIFE wrapper to avoid blocking the synchronous `debug()` caller

## Convergence Signal
`newInfoRatio: <0.0-1.0>` — typically high (0.8+) since this is the first read of source code. `dimension status: FULLY EXTRACTED for lines 1-120`.
```

Then append to `research/deep-research-state.jsonl`:

```jsonl
{"type":"iteration","run":3,"focus":"auto-review.ts part 1 (lines 1-120)","mechanismsExtracted":8,"gapsIdentified":0,"newInfoRatio":<0.0-1.0>,"executor":"cli-devin","model":"swe-1.6","pinnedSha":"<sha>","durationSec":<N>,"timestamp":"<ISO8601>"}
```

## ACCEPTANCE CRITERIA FOR THIS ITER

- [ ] Mechanism table has ≥ 7 rows (one per numbered mechanism in your range)
- [ ] REVIEW_MARKERS array quoted VERBATIM (5 strings)
- [ ] SELF_ASSESSMENT_MARKER + FEEDBACK_MARKER quoted VERBATIM
- [ ] Iter-002 prediction cross-check table has one row per predicted default
- [ ] Debug-logger pattern documented with all 5 sub-points (path, lazy mkdir, format, safe stringify, async-IIFE)
- [ ] Output file ≥ 60 lines

Begin.
