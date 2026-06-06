Iteration 004 complete. I've successfully:

1. **Reused pinned SHA from iter-001**: `cc613a1b4d447b9c5f34e7dec2a1e8478e0572d9`

2. **Fetched and analyzed auto-review.ts lines 121-280**: 160 lines extracted at the pinned SHA

3. **Extracted 12 core utility functions** with complete documentation:
   - Model spec parsing/formatting (parseModelSpec, formatModelSpec)
   - Work model resolution from 3 SDK shapes (resolveWorkModel)
   - Cross-AI ranking algorithm (inferReviewModels) — the most significant algorithm
   - Text extraction and review marker detection (extractText, hasReviewMarker)
   - Tool call counting (countToolCalls, countToolCallsAfterIndex)
   - Boundary detection for scoped review (isRelevantUserBoundary, findLastRelevantUserBoundaryIndex, findLastAssistantAfterIndex)
   - Message signature deduplication (getMessageSignature)

4. **Deep-dived on inferReviewModels** with extreme detail:
   - Family detectors (isClaude, isGpt, isGemini) — documented non-mutual exclusivity and order-dependence
   - Exclusion filters (same-spec, weak-model) with verbatim line ranges
   - Family preference (differentFamily cohort first, then sameFamily)
   - Rank function quoted VERBATIM with if-chain precedence analysis
   - Rank table for common models including edge cases

5. **Documented boundary detection algorithm** in 5 numbered steps explaining how "scoped review" works

6. **Documented message signature deduplication** with getMessageSignature quoted VERBATIM and design rationale

7. **Updated state file**: Appended iteration record to `research/deep-research-state.jsonl`

Output file: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/106-opencode-auto-review-teachings-research/research/iterations/iteration-004.md" /> (121 lines)

All acceptance criteria met:
- ✅ Function inventory table has 12 rows
- ✅ `inferReviewModels` deep-dive includes family detectors, exclusion filters, family preference, rank function VERBATIM, and rank table
- ✅ `getMessageSignature` quoted VERBATIM
- ✅ Boundary detection algorithm summarized in 5 numbered steps
- ✅ Output file ≥ 80 lines (121 lines)

Ready for iteration 005.
anking with exclusion filters and capability ordering |
| F-5 | extractText | :189-194 | `function extractText(msg: SessionMessage): string` | Session message | `string` | Concatenate `parts[].text` where `type === "text"`; join with newlines; trim result |
| F-6 | hasReviewMarker | :196-199 | `function hasReviewMarker(text: string): boolean` | Text string | `boolean` | Case-insensitive contains-check against REVIEW_MARKERS array (from iter-003) |
| F-7 | countToolCalls | :201-210 | `function countToolCalls(messages: SessionMessage[]): number` | Message array | `number` | Iterate messages, count parts with `type === "tool"` in assistant-role messages only |
| F-8 | isRelevantUserBoundary | :212-219 | `function isRelevantUserBoundary(msg: SessionMessage): boolean` | Session message | `boolean` | User-role + non-empty text + no review/feedback markers (REVIEW_MARKERS, SELF_ASSESSMENT_MARKER, FEEDBACK_MARKER) |
| F-9 | findLastRelevantUserBoundaryIndex | :221-226 | `function findLastRelevantUserBoundaryIndex(messages: SessionMessage[]): number` | Message array | `number` index | Reverse-scan from end to 0; return first index where isRelevantUserBoundary is true; return -1 if none |
| F-10 | findLastAssistantAfterIndex | :228-233 | `function findLastAssistantAfterIndex(messages: SessionMessage[], boundaryIndex: number): SessionMessage | undefined` | Message array + boundary index | Session message or undefined | Reverse-scan from end to boundaryIndex+1; return first assistant-role message; return undefined if none |
| F-11 | countToolCallsAfterIndex | :235-237 | `function countToolCallsAfterIndex(messages: SessionMessage[], boundaryIndex: number): number` | Message array + boundary index | `number` | Slice messages after boundaryIndex, delegate to countToolCalls for the slice |
| F-12 | getMessageSignature | :239-245 | `function getMessageSignature(msg: SessionMessage | undefined): string` | Session message (optional) | `string` | id || `role:time:textPrefix(40)` — content-based fingerprint for deduplication |

### inferReviewModels Deep Dive

**Family detectors** (lines :155-157):
```typescript
const isClaude = (m: ModelSpec) => m.modelID.toLowerCase().includes("claude")
const isGpt = (m: ModelSpec) => m.modelID.toLowerCase().includes("gpt") || m.modelID.toLowerCase().includes("codex")
const isGemini = (m: ModelSpec) => m.modelID.toLowerCase().includes("gemini")
```

These detectors are **not mutually exclusive** — a hypothetical "gpt-claude-fusion-1" model would match both `isGpt` (via "gpt") and `isClaude` (via "claude"). The if-chain in the differentFamily filter (lines :164-169) gives precedence to the first matching detector: if the work model is Claude, the filter checks `!isClaude(m)` regardless of whether the candidate also matches Gpt or Gemini. This means family detection is order-dependent and may misclassify hybrid model names.

**Exclusion filters** (lines :160-162):
1. Same-spec filter (line :161): `formatModelSpec(m).toLowerCase() !== workSpec` — removes the exact model that performed the work
2. Weak-model filter (line :162): `!m.modelID.toLowerCase().includes("haiku") && !m.modelID.toLowerCase().includes("flash")` — removes lightweight/fast models (Claude Haiku, Gemini Flash) from consideration

Both filters are applied sequentially via `.filter()` chaining, so candidates must pass both to remain in the pool.

**Family preference** (lines :164-169):
```typescript
const differentFamily = candidates.filter((m) => {
  if (workModel && isClaude(workModel)) return !isClaude(m)
  if (workModel && isGpt(workModel)) return !isGpt(m)
  if (workModel && isGemini(workModel)) return !isGemini(m)
  return true
})

const sameFamily = candidates.filter((m) => !differentFamily.includes(m))
```

- `differentFamily`: candidates whose family ≠ work-model family (determined by the first matching detector)
- `sameFamily`: the complement — candidates with the same family as the work model
- Output order (line :187): `[...differentFamily, ...sameFamily]` — different-family cohort is tried first, then same-family cohort

This design prioritizes cross-family review (e.g., Claude reviewing GPT work) but falls back to same-family review if no cross-family candidates exist.

**Rank function** (lines :175-180, verbatim):
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

Lower rank = preferred. The if-chain gives precedence to earlier matches: "opus" beats "codex" even if a model ID contains both substrings. Within each rank, original order is preserved because V8's Array.sort has been stable since 2019 — the rank function relies on this stability for deterministic ordering.

**Rank table for our common models**:
| Model ID | Substring hits | Rank |
|----------|---------------|------|
| claude-opus-4-7 | opus | 0 |
| gpt-5.5-codex | codex | 1 |
| claude-sonnet-4-6 | sonnet | 2 |
| gpt-5.5-pro | pro | 3 |
| deepseek-v4-pro | pro | 3 |
| claude-3.5-haiku | (filtered out by weak-model filter) | n/a |
| gemini-2.5-flash | (filtered out by weak-model filter) | n/a |
| gpt-5.5 | (none) | 4 |
| kimi-k2.6 | (none) | 4 |

**Edge cases**:
- "gpt-claude-fusion-1-opus" would match "gpt" (isGpt), "claude" (isClaude), and "opus" (rank 0) — the family detector order matters
- "codex-pro" would match "codex" (rank 1) before "pro" (rank 3) due to if-chain order
- Models with no matching substrings get rank 4 and are tried last within their cohort

### Boundary Detection Algorithm (referenced by iter 010)
1. **Reverse-scan for user boundary**: `findLastRelevantUserBoundaryIndex` scans from `messages.length - 1` to `0`, returning the first index where `isRelevantUserBoundary` is true
2. **Filter irrelevant boundaries**: `isRelevantUserBoundary` excludes user messages that contain REVIEW_MARKERS, SELF_ASSESSMENT_MARKER, or FEEDBACK_MARKER (prevents the reviewer from treating review/feedback messages as work boundaries)
3. **Boundary index as scope start**: The returned index defines the start of the "scoped turn" — all work after this message is subject to review
4. **Find work message**: `findLastAssistantAfterIndex` reverse-scans from end to `boundaryIndex + 1`, returning the first assistant message (this is the work being reviewed)
5. **Count tool calls**: `countToolCallsAfterIndex` slices the message array after the boundary and delegates to `countToolCalls` to count tool usage in the scoped turn (used for gating against trivial edits)

These three functions together implement "scoped review" — the auto-reviewer only critiques the most recent turn after the last relevant user message, not the entire session history. This prevents re-reviewing old work and focuses on fresh changes.

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

Used as the key in `reviewedMessageBySession` Map (visible in iter-003 context) to prevent re-reviewing the same message twice. The design prefers `msg.id` if available (SDK-provided stable identifier), but falls back to a content-based fingerprint combining role, timestamp, and text prefix. This fallback ensures resilience across SDK versions where `msg.id` might be absent or unstable — the fingerprint is resistant to minor text edits while still being unique enough for deduplication.

## Convergence Signal
`newInfoRatio: 0.85` — This iteration extracted the complete algorithmic core of the plugin (12 functions including the critical `inferReviewModels` cross-AI ranking algorithm). All function signatures, line ranges, and algorithms are documented verbatim. No gaps identified in lines 121-280; all mechanisms fully extracted. `dimension status: FULLY EXTRACTED for lines 121-280`
