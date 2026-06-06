# Deep Research Iteration 010 of 20 — Boundary detection + min-tool-call gate

## SITUATION

You are running as **cli-devin SWE-1.6** in non-interactive print mode, dispatched as iteration 10 of a 20-iteration deep-research campaign on the upstream `dzianisv/opencode-plugins` `auto-review` package.

**Prior context (REQUIRED)**:
- Iter 004 documented `findLastRelevantUserBoundaryIndex`, `findLastAssistantAfterIndex`, `countToolCallsAfterIndex`
- Iter 005 documented the runReview gates that consume these: boundary index, marker recheck, dedup recheck, tool-call threshold

**Why this iter exists**: the upstream plugin doesn't review the WHOLE session. It scopes review to "work AFTER the last relevant user message" and only fires when that scoped turn has at least `MIN_TOOL_CALLS` (default 3) tool calls. This is a meaningful design choice: it avoids reviewing chitchat ("hi, how are you?"), and it prevents the reviewer from being confused by stale earlier context.

**Why this matters for us**: our `sk-code-review` skill operates on the full diff (PR-level), not "last user boundary." Our `deep-review` operates on a whole packet's worth of code, not a scoped turn. There may be a useful design pattern here for an inline reviewer that runs DURING a session, where the boundary concept becomes important.

## TASK

### Step 1 — Aggregate boundary helpers from iter-004

```bash
sed -n '1,300p' .opencode/specs/skilled-agent-orchestration/106-opencode-auto-review-teachings-research/research/iterations/iteration-004.md
```

Extract verbatim signatures + algorithms for:
- `findLastRelevantUserBoundaryIndex(messages)`: reverse-scan to find the last user message that's NOT a review/feedback marker
- `findLastAssistantAfterIndex(messages, boundaryIndex)`: reverse-scan after boundary to find the last assistant message
- `countToolCallsAfterIndex(messages, boundaryIndex)`: slice after boundary, count `type === "tool"` parts

### Step 2 — Document MIN_TOOL_CALLS gate

From iter-005 runReview flow + iter-003 AutoReviewConfig:
- Default: `3`
- Configurable via `config.minToolCalls` (JSON file) OR via direct override
- Effect: if `countToolCallsAfterIndex(messages, boundaryIndex) < MIN_TOOL_CALLS` → skip review

Discuss design rationale:
- Why 3? Heuristic for "non-trivial turn" (a one-tool-call turn is often a single lookup; 3+ implies real work)
- Why not "any tool call at all"? Avoids reviewing every echo/status query
- Why not "any text output"? Tool calls are a better proxy for "agent did substantive work"

### Step 3 — Trace through an example session

Construct a hypothetical OpenCode session with 6 messages and walk through the boundary detection:

```text
Message 0: user — "Add a feature to parse CSV files"
Message 1: assistant — text + 4 tool calls (Read, Read, Write, Bash)
Message 2: user — "Now write tests for it"
Message 3: assistant — text + 3 tool calls (Read, Write, Bash)
Message 4: user — "AUTO-REVIEW [iteration tag]"  (← contains marker)
Message 5: assistant — text + 1 tool call (Bash test run)
```

Step-by-step:
1. `findLastRelevantUserBoundaryIndex`: reverse-scan from 5 to 0:
   - i=5: assistant → skip
   - i=4: user but has REVIEW_MARKER → skip (isRelevantUserBoundary returns false)
   - i=3: assistant → skip
   - i=2: user, no marker → return 2
2. `findLastAssistantAfterIndex(messages, 2)`: reverse-scan from 5 to 3:
   - i=5: assistant → return message 5
3. `countToolCallsAfterIndex(messages, 2)`: count tool calls in messages 3-5:
   - msg 3: 3 tool calls
   - msg 5: 1 tool call
   - Total: 4

Since 4 ≥ MIN_TOOL_CALLS (3), the review fires on message 5's work scoped against user msg 2.

Add 2-3 more example traces with edge cases:
- All messages are markers → boundaryIndex returns -1 → skip
- Boundary is index 0 → tool count covers entire session
- Single-tool-call turn → skipped

### Step 4 — Compare to our local skills' "scope" model

```bash
# Does sk-code-review define a scope concept?
rg -nC3 'scope|boundary|diff.range|since.last|recent.changes' .opencode/skills/sk-code-review/SKILL.md 2>&1 | head -20

# Does deep-review have a scope concept?
rg -nC3 'scope|boundary|file.list|target.files' .opencode/skills/deep-review/SKILL.md 2>&1 | head -20
```

Comparison table:

| Skill | Scope concept | Min-evidence gate | Where defined |
|-------|--------------|-------------------|---------------|
| Upstream auto-review | "after last relevant user message" | 3 tool calls | runReview function |
| sk-code-review | <full PR diff / whole branch / explicit file list> | <none / line-count threshold?> | <SKILL.md section> |
| deep-review | <packet directory / explicit target list> | <iteration cap only?> | <SKILL.md section> |

## SCOPE

- Iter outputs 003, 004, 005
- Local: `.opencode/skills/sk-code-review/SKILL.md`, `.opencode/skills/deep-review/SKILL.md`
- **No writes outside `research/iterations/iteration-010.md` and `research/deep-research-state.jsonl`**

## VERIFICATION COMMANDS

```bash
sed -n '1,300p' .opencode/specs/skilled-agent-orchestration/106-opencode-auto-review-teachings-research/research/iterations/iteration-004.md
sed -n '1,300p' .opencode/specs/skilled-agent-orchestration/106-opencode-auto-review-teachings-research/research/iterations/iteration-005.md

rg -nC3 'scope|boundary|diff.range|since.last|recent.changes|minToolCalls|min.evidence' \
  .opencode/skills/sk-code-review/SKILL.md .opencode/skills/deep-review/SKILL.md 2>&1 | head -40
```

## CONSTRAINTS

- READ-ONLY.
- Quote `findLastRelevantUserBoundaryIndex` etc. signatures VERBATIM (from iter-004).
- Render 3+ example session traces.
- Cite local file:line for every "we don't have X" claim.

## COMMON FAILURE MODES

1. **Off-by-one in reverse scan**: `messages.length - 1` to `0` inclusive; if you start at `messages.length` the first iter accesses an out-of-bounds index. Don't mis-state this.
2. **Tool-call counting includes only `type === "tool"` parts**: not all `parts[]` entries; only the tool-type ones. Be precise.
3. **isRelevantUserBoundary returns false for empty text too**: don't forget that gate.

## OUTPUT FORMAT

Write to `research/iterations/iteration-010.md`:

```markdown
<!-- PINNED_UPSTREAM_SHA: <sha> -->

# Iteration 010 — Boundary detection + min-tool-call gate

## Summary
<2-4 sentence verdict>

## Files/Commands Reviewed
- iter outputs 004, 005
- `.opencode/skills/sk-code-review/SKILL.md`
- `.opencode/skills/deep-review/SKILL.md`

## Findings

### Boundary Helpers (verbatim from iter-004)
| Function | Signature | Algorithm |
|----------|-----------|-----------|
| findLastRelevantUserBoundaryIndex | <signature> | reverse-scan, skip markers + non-user |
| findLastAssistantAfterIndex | <signature> | reverse-scan after boundary, return first assistant |
| countToolCallsAfterIndex | <signature> | slice, count parts.type === "tool" |

### MIN_TOOL_CALLS Gate
| Aspect | Value |
|--------|-------|
| Default | 3 |
| Config key | `minToolCalls` (in auto-review.json) |
| Effect | skip review if scoped tool count < threshold |
| Design rationale | proxy for "non-trivial turn" |

### Example Session Traces

#### Trace 1: Standard mid-session work
```text
<6-message session trace from Step 3, with step-by-step gate evaluation>
```

#### Trace 2: All-marker session (no real work)
```text
<trace showing boundaryIndex = -1 → skip>
```

#### Trace 3: Boundary at index 0
```text
<trace showing tool count covers entire session>
```

#### Trace 4: Single-tool-call turn
```text
<trace showing min-tool-call gate skip>
```

### Our Skills — Scope Concept Comparison
| Skill | Scope concept | Min-evidence gate | Where defined |
|-------|--------------|-------------------|---------------|
| Upstream auto-review | "after last relevant user message" | 3 tool calls | runReview function |
| sk-code-review | <answer> | <answer> | <file:line> |
| deep-review | <answer> | <answer> | <file:line> |

### Findings — Adoptable Pattern?
<1-2 paragraph assessment of whether the boundary + min-evidence gate translates to our review surfaces. If our skills operate at PR/packet level (not "scoped turn"), explain whether an inline-review variant would benefit.>

## Convergence Signal
`newInfoRatio: <0.0-1.0>` — moderate (0.4-0.6). `dimension status: FULLY EXTRACTED`.
```

Then append to `research/deep-research-state.jsonl`:

```jsonl
{"type":"iteration","run":10,"focus":"boundary + min-tool-call gate","mechanismsExtracted":2,"gapsIdentified":<N>,"newInfoRatio":<0.0-1.0>,"executor":"cli-devin","model":"swe-1.6","pinnedSha":"<sha>","durationSec":<N>,"timestamp":"<ISO8601>"}
```

## ACCEPTANCE CRITERIA FOR THIS ITER

- [ ] Boundary helpers documented with signatures + algorithms
- [ ] MIN_TOOL_CALLS gate documented with default + config key + rationale
- [ ] 4 example session traces with step-by-step gate evaluation
- [ ] Comparison table covers AT LEAST sk-code-review + deep-review
- [ ] Adoptable-pattern assessment paragraph
- [ ] Output file ≥ 90 lines

Begin.
