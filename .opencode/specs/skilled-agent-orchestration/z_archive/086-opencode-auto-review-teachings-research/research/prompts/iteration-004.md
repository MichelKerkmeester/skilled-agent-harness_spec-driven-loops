# Deep Research Iteration 004 of 20 — auto-review.ts part 2 (model resolution, cross-AI inference, prompt builder helpers)

## SITUATION

You are running as **cli-devin SWE-1.6** in non-interactive print mode, dispatched as iteration 4 of a 20-iteration deep-research campaign on the upstream `dzianisv/opencode-plugins` `auto-review` package.

**Prior context**:
- Iter 001 pinned upstream SHA + extracted README
- Iter 002 extracted example.json config schema
- Iter 003 read auto-review.ts lines 1-120: imports, types, config loading, debug logger, abort constants, REVIEW_MARKERS

**Why this iter exists**: lines 121-280 contain the **business logic** of the plugin — how it picks a reviewer model, what "different family" means, how the fallback chain is ordered, how it counts tool calls, how it detects message boundaries. This is the most algorithmically interesting part of the codebase. Iter 008 will extract the cross-model selection algorithm in detail; your iter (004) is the FULL READING that iter 008 builds on.

**Critical functions in your range** (approximate line numbers; verify against the actual file):
1. `parseModelSpec(spec)` — string parser for `provider/model` format
2. `formatModelSpec(spec)` — inverse, formats `ModelSpec` to string
3. `resolveWorkModel(lastAssistant)` — extracts model info from the last assistant message (handles 3 SDK shapes)
4. `inferReviewModels(workModel, availableModels)` — THE cross-AI ranking algorithm
5. `extractText(msg)` — concatenates text parts from a session message
6. `hasReviewMarker(text)` — case-insensitive substring match against REVIEW_MARKERS
7. `countToolCalls(messages)` — counts `type === "tool"` parts in assistant messages
8. `isRelevantUserBoundary(msg)` — filters user messages, excluding review/feedback markers
9. `findLastRelevantUserBoundaryIndex(messages)` — reverse-scan helper
10. `findLastAssistantAfterIndex(messages, boundaryIndex)` — finds the assistant message just after the boundary
11. `countToolCallsAfterIndex(messages, boundaryIndex)` — bounded tool-call counter
12. `getMessageSignature(msg)` — dedup key: prefer `msg.id`, fall back to `role:time:textPrefix`

## TASK

### Step 1 — Reuse pinned SHA + fetch the file

```bash
SHA=$(rg -oP 'PINNED_UPSTREAM_SHA:\s*\K[0-9a-f]{40}' .opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-001.md | head -1)
gh api "repos/dzianisv/opencode-plugins/contents/packages/auto-review/auto-review.ts?ref=$SHA" \
  --jq '.content' 2>/dev/null | base64 -d > /tmp/upstream-auto-review-004.ts \
  || curl -sL "https://raw.githubusercontent.com/dzianisv/opencode-plugins/$SHA/packages/auto-review/auto-review.ts" > /tmp/upstream-auto-review-004.ts
sed -n '121,280p' /tmp/upstream-auto-review-004.ts
```

### Step 2 — Document each of the 12 functions

For each function above, fill the function table:

| ID | Function | Signature | Inputs | Returns | Algorithm summary |
|----|----------|-----------|--------|---------|-------------------|

### Step 3 — Deep-dive on `inferReviewModels` (the cross-AI ranking algorithm)

This function is THE most interesting algorithm in the package. Document it with EXTREME detail:

#### Family detectors
- `isClaude(m)`: matches `claude` in modelID (case-insensitive)
- `isGpt(m)`: matches `gpt` OR `codex` in modelID
- `isGemini(m)`: matches `gemini` in modelID

Are these mutually exclusive? What about a hypothetical "gpt-claude-fusion-1" model? (Hint: it would match both — first detector wins via the if-chain.)

#### Exclusion filters
- Same-spec filter: removes the model that did the work
- Weak-model filter: removes `haiku` or `flash` substrings
Document both with verbatim line ranges.

#### Family preference
- `differentFamily` cohort: models that don't share the work-model's family
- `sameFamily` cohort: the rest
- Cohort order: differentFamily first, then sameFamily

#### Rank function (within each cohort)
```text
rank(m):
  contains "opus"  → 0
  contains "codex" → 1
  contains "sonnet"→ 2
  contains "pro"   → 3
  else             → 4
```
Lower rank = preferred. Within rank, original order is preserved (stable sort assumed). Document edge cases:
- "gpt-5.5-pro" matches "pro" → rank 3
- "claude-3.5-sonnet" matches "sonnet" → rank 2
- "deepseek-v4-pro" matches "pro" → rank 3
- "kimi-k2.6" matches nothing → rank 4

#### Output
`return [...differentFamily, ...sameFamily]` — flat ordered list. Consumer (later in the file) iterates this list and tries `promptAsync` against each candidate in order, breaking on first success.

### Step 4 — Document the message-signature dedup key

`getMessageSignature(msg)`:
- Prefer `msg.id` if present
- Else build `<role>:<time>:<textPrefix40>` as the fingerprint

Why this design? (Hint: `msg.id` may not be stable across SDK versions; the fallback gives a content-based fingerprint that's resistant to minor edits.)

### Step 5 — Document the boundary detection scheme

`findLastRelevantUserBoundaryIndex(messages)`:
- Reverse-scan from `messages.length - 1` to `0`
- For each user-role message, check `isRelevantUserBoundary` (excludes review/self-assessment markers)
- Returns the first match index, or `-1`

`findLastAssistantAfterIndex(messages, boundaryIndex)`:
- Reverse-scan from `messages.length - 1` to `boundaryIndex + 1`
- Returns the first assistant message, or `undefined`

`countToolCallsAfterIndex(messages, boundaryIndex)`:
- Slice `messages` after boundary, count `type === "tool"` parts in assistant messages

These three functions together define "the scoped turn" — work that happened after the last relevant user message. The auto-reviewer only critiques the scoped turn, not the whole session.

## SCOPE

- `packages/auto-review/auto-review.ts:121-280`
- `research/iterations/iteration-001.md` (SHA)
- `research/iterations/iteration-003.md` (REVIEW_MARKERS verbatim, for `hasReviewMarker` cross-check)
- **No writes outside `research/iterations/iteration-004.md` and `research/deep-research-state.jsonl`**

## VERIFICATION COMMANDS

```bash
SHA=$(rg -oP 'PINNED_UPSTREAM_SHA:\s*\K[0-9a-f]{40}' .opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-001.md | head -1)
gh api "repos/dzianisv/opencode-plugins/contents/packages/auto-review/auto-review.ts?ref=$SHA" \
  --jq '.content' 2>/dev/null | base64 -d > /tmp/upstream-auto-review-004.ts \
  || curl -sL "https://raw.githubusercontent.com/dzianisv/opencode-plugins/$SHA/packages/auto-review/auto-review.ts" > /tmp/upstream-auto-review-004.ts

# Print your range
sed -n '121,280p' /tmp/upstream-auto-review-004.ts

# Locate each function signature
grep -nE 'function (parseModelSpec|formatModelSpec|resolveWorkModel|inferReviewModels|extractText|hasReviewMarker|countToolCalls|isRelevantUserBoundary|findLastRelevantUserBoundaryIndex|findLastAssistantAfterIndex|countToolCallsAfterIndex|getMessageSignature)' /tmp/upstream-auto-review-004.ts

# Verify family detectors
grep -nE '"claude"|"gpt"|"codex"|"gemini"|"opus"|"sonnet"|"haiku"|"flash"|"pro"' /tmp/upstream-auto-review-004.ts
```

## CONSTRAINTS

- READ-ONLY.
- Quote function signatures and the `inferReviewModels` rank function VERBATIM.
- Cite `packages/auto-review/auto-review.ts:<line>` for every claim.
- Reuse SHA from iter-001.
- Do NOT exceed lines 121-280; iter 005 covers the rest.
- Stop adding new probes past minute 5.

## COMMON FAILURE MODES

1. **Line-range drift**: actual line numbers may differ by ±10 from this prompt's estimates. Use `grep -n` to anchor yourself.
2. **Generic type parameters**: TypeScript generics (`<T>`, `Array<T>`) can confuse line-counting. Skip type-only lines when reading "logic."
3. **Stable-sort assumption**: V8's Array.sort is stable since 2019; the rank function relies on this. Don't claim non-determinism.

## OUTPUT FORMAT

Write to `research/iterations/iteration-004.md`:

```markdown
<!-- PINNED_UPSTREAM_SHA: <sha> -->

# Iteration 004 — auto-review.ts part 2 (lines 121-280)

## Summary
<2-4 sentence verdict on the 12 functions in your range; flag inferReviewModels as the most significant algorithm>

## Files/Commands Reviewed
- `packages/auto-review/auto-review.ts:121-280` (at sha <sha>)
- `research/iterations/iteration-001.md` (SHA reuse)
- `research/iterations/iteration-003.md` (REVIEW_MARKERS cross-check)

## Findings

### Function Inventory
| ID | Function | Line range | Signature | Inputs | Returns | Algorithm summary |
|----|----------|-----------|-----------|--------|---------|-------------------|
| F-1 | parseModelSpec | :NN-NN | `function parseModelSpec(spec: string | null | undefined): ModelSpec | null` | `"provider/model"` string | `ModelSpec | null` | Split on `/`; require both halves non-empty |
| F-2 | formatModelSpec | | | | | |
| F-3 | resolveWorkModel | | | | | Inspects 3 SDK shapes (direct providerID/modelID, model-as-string, model-as-object) |
| F-4 | inferReviewModels | | | | | See deep-dive below |
| F-5 | extractText | | | | | Concatenate `parts[].text` where `type === "text"` |
| F-6 | hasReviewMarker | | | | | toLowerCase contains-check against REVIEW_MARKERS |
| F-7 | countToolCalls | | | | | Iterate messages, count parts with `type === "tool"` in assistant roles |
| F-8 | isRelevantUserBoundary | | | | | User-role + non-empty text + no review/feedback markers |
| F-9 | findLastRelevantUserBoundaryIndex | | | | | Reverse-scan |
| F-10 | findLastAssistantAfterIndex | | | | | Reverse-scan from end to boundary+1 |
| F-11 | countToolCallsAfterIndex | | | | | Slice after boundary, delegate to countToolCalls |
| F-12 | getMessageSignature | | | | | id || `role:time:textPrefix(40)` |

### inferReviewModels Deep Dive

**Family detectors** (lines :NN-NN):
- `isClaude`: `modelID.toLowerCase().includes("claude")`
- `isGpt`: `modelID.toLowerCase().includes("gpt") || modelID.toLowerCase().includes("codex")`
- `isGemini`: `modelID.toLowerCase().includes("gemini")`

**Exclusion filters** (lines :NN-NN):
1. Same-spec filter: `formatModelSpec(m).toLowerCase() !== workSpec`
2. Weak-model filter: `!modelID.includes("haiku") && !modelID.includes("flash")`

**Family preference** (lines :NN-NN):
- `differentFamily`: candidates whose family ≠ work-model family
- `sameFamily`: candidates with the same family
- Output order: `[...differentFamily, ...sameFamily]`

**Rank function** (lines :NN-NN, verbatim):
```typescript
const rank = (m: ModelSpec) => {
  const id = m.modelID.toLowerCase()
  if (id.includes("opus")) return 0
  if (id.includes("codex")) return 1
  if (id.includes("sonnet")) return 2
  if (id.includes("pro")) return 3
  return 4
}
```

**Rank table for our common models**:
| Model ID | Substring hits | Rank |
|----------|---------------|------|
| claude-opus-4-7 | opus | 0 |
| gpt-5.5 | (none) | 4 |
| gpt-5.5-codex | codex | 1 |
| claude-sonnet-4-6 | sonnet | 2 |
| deepseek-v4-pro | pro | 3 |
| kimi-k2.6 | (none) | 4 |
| haiku-4-5 | (filtered out by weak-model filter) | n/a |
| gemini-2.5-flash | (filtered out by weak-model filter) | n/a |

### Boundary Detection Algorithm (referenced by iter 010)
1. Reverse-scan messages for last user message
2. Skip user messages that contain REVIEW_MARKERS / SELF_ASSESSMENT_MARKER / FEEDBACK_MARKER
3. The boundary index is the scope start
4. Find last assistant after boundary → the work being reviewed
5. Count tool calls between boundary and end → gate threshold

### Message Signature Dedup (referenced by iter 009)
```typescript
function getMessageSignature(msg: SessionMessage | undefined): string {
  if (!msg) return ""
  if (msg.id) return msg.id
  const role = msg.info?.role || "unknown"
  const time = msg.info?.time?.start || 0
  return `${role}:${time}:${extractText(msg).slice(0, 40)}`
}
```

Used as the key in `reviewedMessageBySession` Map to prevent re-reviewing the same message twice.

## Convergence Signal
`newInfoRatio: <0.0-1.0>` — high (0.7-0.9) since this is the first read of the algorithmic core. `dimension status: FULLY EXTRACTED for lines 121-280`.
```

Then append to `research/deep-research-state.jsonl`:

```jsonl
{"type":"iteration","run":4,"focus":"auto-review.ts part 2 (lines 121-280)","mechanismsExtracted":12,"gapsIdentified":0,"newInfoRatio":<0.0-1.0>,"executor":"cli-devin","model":"swe-1.6","pinnedSha":"<sha>","durationSec":<N>,"timestamp":"<ISO8601>"}
```

## ACCEPTANCE CRITERIA FOR THIS ITER

- [ ] Function inventory table has 12 rows
- [ ] `inferReviewModels` deep-dive includes family detectors, exclusion filters, family preference, rank function VERBATIM, and a rank table for our common models
- [ ] `getMessageSignature` quoted VERBATIM
- [ ] Boundary detection algorithm summarized in 5 numbered steps
- [ ] Output file ≥ 80 lines

Begin.
