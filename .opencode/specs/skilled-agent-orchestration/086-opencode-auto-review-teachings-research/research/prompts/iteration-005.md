# Deep Research Iteration 005 of 20 — auto-review.ts part 3 (AutoReviewPlugin export, event handler, runReview flow, prompt template)

## SITUATION

You are running as **cli-devin SWE-1.6** in non-interactive print mode, dispatched as iteration 5 of a 20-iteration deep-research campaign on the upstream `dzianisv/opencode-plugins` `auto-review` package.

**Prior context**:
- Iter 001: pinned SHA, README extracted
- Iter 002: example.json schema
- Iter 003: auto-review.ts lines 1-120 (imports, types, config, debug logger, REVIEW_MARKERS)
- Iter 004: auto-review.ts lines 121-280 (12 helper functions, inferReviewModels deep dive)

**Why this iter exists**: lines 281-end contain the **plugin entry point** — the `AutoReviewPlugin` exported function, the `runReview` async helper, the event handler that listens for `session.idle` and `session.error`, the actual review prompt template (a multi-line template string), and the fallback chain that iterates over `reviewModels` and breaks on first success. This is the most operationally significant code in the package.

**Critical mechanisms in your range**:
1. `AutoReviewPlugin: Plugin = async ({ client, directory }) => { ... }` — plugin factory (entry point)
2. Module-level state: `active`, `reviewSessionIDs`, `recentlyAbortedSessions`, `reviewedMessageBySession`
3. `runReview(parentSessionID)` — the per-session review orchestration
4. Session fetching: `client.session.get`, `client.session.messages`
5. Child-session creation: `client.session.create({ parentID, title: "AUTO-REVIEW" })`
6. Model discovery: `client.config.providers({ query: { directory } })`
7. The REVIEW PROMPT TEMPLATE (multi-line template literal — quote verbatim)
8. The fallback loop: try each model in `reviewModels`, break on first `promptAsync` success
9. The event handler: `event.type === "session.idle"` vs `event.type === "session.error"` branches
10. Abort race handling: 1.5s sleep + re-check `recentlyAbortedSessions` map

## TASK

### Step 1 — Reuse pinned SHA + fetch the file

```bash
SHA=$(rg -oP 'PINNED_UPSTREAM_SHA:\s*\K[0-9a-f]{40}' .opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-001.md | head -1)
gh api "repos/dzianisv/opencode-plugins/contents/packages/auto-review/auto-review.ts?ref=$SHA" \
  --jq '.content' 2>/dev/null | base64 -d > /tmp/upstream-auto-review-005.ts \
  || curl -sL "https://raw.githubusercontent.com/dzianisv/opencode-plugins/$SHA/packages/auto-review/auto-review.ts" > /tmp/upstream-auto-review-005.ts
TOTAL=$(wc -l < /tmp/upstream-auto-review-005.ts)
echo "TOTAL_LINES=$TOTAL"
sed -n '281,'"$TOTAL"'p' /tmp/upstream-auto-review-005.ts
```

### Step 2 — Document AutoReviewPlugin scope

The plugin export is an async factory returning `{ event: async ({event}) => { ... } }`. Document:
- The closure-captured state: `active` Set, `reviewSessionIDs` Set, `recentlyAbortedSessions` Map, `reviewedMessageBySession` Map
- Config resolution at plugin-init time (`REVIEW_MODEL`, `REVIEW_REASONING`, `MIN_TOOL_CALLS`, `DEBUG_ENABLED`) — fields from config-file, env-var fallback, defaults
- `initDebugLogger(directory, true)` called when `DEBUG_ENABLED`

### Step 3 — Document runReview flow

Walk through `runReview(parentSessionID)` step-by-step:
1. Active-set gate: skip if already running for this session
2. Mark active
3. Try-finally to ensure active-delete on exit
4. Fetch session info via `client.session.get`
5. Skip child sessions (`sessionInfo.parentID` present)
6. Fetch messages via `client.session.messages`
7. Boundary check: `findLastRelevantUserBoundaryIndex`
8. Marker check: skip if last user or last assistant has a REVIEW_MARKER
9. Dedup check: skip if `reviewedMessageBySession` already has this message signature
10. Tool-call gate: skip if `< MIN_TOOL_CALLS`
11. Resolve work model
12. Fetch available models via `client.config.providers`
13. Decide review models: use config-forced model OR `inferReviewModels`
14. Create child session via `client.session.create({ parentID })`
15. Tag child session in `reviewSessionIDs` Set
16. Iterate `reviewModels`: try each via `client.session.promptAsync`, break on success
17. On all-fail: record dedup signature anyway (don't retry endlessly)

### Step 4 — Quote the REVIEW PROMPT TEMPLATE VERBATIM

This is the single most reusable artifact in the package. Quote the template literal verbatim. The template includes:
- Header: `"AUTO-REVIEW"` literal
- Mission statement: 2-3 sentences on what the reviewer is doing
- Rules list (3 rules: scope to after last user msg, don't repeat the task, focus on correctness/verification/edge-cases)
- Observed model + Review model + Tool call count
- Last user message (truncated at 2000 chars)
- Last assistant message (truncated at 3000 chars)
- Checklist (5 items: task completion / tests / PR / CI / obvious issues)
- Return contract:
  - 1) Checklist with PASS/FAIL/UNKNOWN + brief evidence
  - 2) Issues (only real gaps)
  - 3) Final line exactly one of two formats (record both formats verbatim)

### Step 5 — Document the event handler branches

```typescript
event: async ({ event }) => {
  if (event.type === "session.error") {
    // record MessageAbortedError → recentlyAbortedSessions Map
  }
  if (event.type !== "session.idle") return
  // Check reviewSessionIDs (skip if this is a review-session's own idle event)
  // Check abort cooldown (skip if within 10s)
  // Sleep 1.5s (race delay)
  // Re-check abort cooldown
  // Call runReview(sessionID)
}
```

Document each branch with line ranges and verbatim conditions.

## SCOPE

- `packages/auto-review/auto-review.ts:281-end`
- Prior iter outputs (001-004) for SHA + cross-references
- **No writes outside `research/iterations/iteration-005.md` and `research/deep-research-state.jsonl`**

## VERIFICATION COMMANDS

```bash
SHA=$(rg -oP 'PINNED_UPSTREAM_SHA:\s*\K[0-9a-f]{40}' .opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-001.md | head -1)
gh api "repos/dzianisv/opencode-plugins/contents/packages/auto-review/auto-review.ts?ref=$SHA" \
  --jq '.content' 2>/dev/null | base64 -d > /tmp/upstream-auto-review-005.ts \
  || curl -sL "https://raw.githubusercontent.com/dzianisv/opencode-plugins/$SHA/packages/auto-review/auto-review.ts" > /tmp/upstream-auto-review-005.ts

# Print the rest
TOTAL=$(wc -l < /tmp/upstream-auto-review-005.ts)
sed -n '281,'"$TOTAL"'p' /tmp/upstream-auto-review-005.ts

# Locate plugin entry
grep -nE 'AutoReviewPlugin|runReview|client\.session\.|client\.config\.providers|promptAsync|session\.idle|session\.error|ABORT_RACE|ABORT_COOLDOWN' /tmp/upstream-auto-review-005.ts

# Find the prompt template (look for "AUTO-REVIEW\n\n")
grep -n 'AUTO-REVIEW\\n\\n\|reviewPrompt\|Checklist' /tmp/upstream-auto-review-005.ts
```

## CONSTRAINTS

- READ-ONLY.
- The REVIEW PROMPT TEMPLATE must be quoted VERBATIM in a fenced block.
- Cite `packages/auto-review/auto-review.ts:<line>` for every claim.
- Reuse SHA from iter-001.
- Stop adding new probes past minute 5.

## COMMON FAILURE MODES

1. **Template literal escape**: TypeScript template strings use `${...}` interpolation; quote them with backticks correctly when extracting. If the raw template has actual backticks, escape them in your output.
2. **Multi-line string**: the prompt template is one giant template literal. Capture all of it; do not paraphrase.
3. **Event handler dispatch shape**: `event` arg is destructured; the discriminator is `event.type` (string). Don't claim a different shape.

## OUTPUT FORMAT

Write to `research/iterations/iteration-005.md`:

```markdown
<!-- PINNED_UPSTREAM_SHA: <sha> -->

# Iteration 005 — auto-review.ts part 3 (lines 281-end)

## Summary
<2-4 sentence verdict on the plugin entry, runReview flow, prompt template, event handler>

## Files/Commands Reviewed
- `packages/auto-review/auto-review.ts:281-end` (at sha <sha>)
- Prior iter outputs (001-004) — SHA + cross-references

## Findings

### AutoReviewPlugin Closure State
| Name | Type | Purpose |
|------|------|---------|
| active | Set<string> | parentSessionIDs currently being reviewed (idempotency) |
| reviewSessionIDs | Set<string> | child-review-session ids; skip their session.idle events |
| recentlyAbortedSessions | Map<string, number> | parentSessionID → abort timestamp; cooldown 10s |
| reviewedMessageBySession | Map<string, string> | parentSessionID → message-signature; dedup |

### Config Resolution at Plugin Init
| Const | Source priority | Default |
|-------|-----------------|---------|
| REVIEW_MODEL | config.model OR env AUTO_REVIEW_MODEL OR "" | "" |
| REVIEW_REASONING | config.reasoning OR env AUTO_REVIEW_REASONING OR "" | "" |
| MIN_TOOL_CALLS | config.minToolCalls (nullish coalesce) | 3 |
| DEBUG_ENABLED | config.debug OR env AUTO_REVIEW_DEBUG === "1" | false |

### runReview Flow (17 steps documented above) — line ranges
| Step | Line range | What |
|------|-----------|------|
| 1 | :NN | Active-set gate |
| 2 | :NN | Mark active |
| ... | ... | ... |
| 17 | :NN | On all-fail: record dedup signature anyway |

### REVIEW PROMPT TEMPLATE (verbatim, the most reusable artifact)
```text
<paste the complete template literal here, including ${...} interpolations>
```

### Final-line PASS/FAIL contract (verbatim, the structured-output contract)
```text
   - Review passed — no issues found.
   - Review failed — <brief reason>.
```

### Event Handler Branches
| event.type | Behavior | Line range |
|-----------|----------|-----------|
| session.error | If errorName === "MessageAbortedError", record sessionID → Date.now() in recentlyAbortedSessions | :NN-NN |
| session.idle | Skip if reviewSessionIDs.has(sessionID), skip if abort-cooldown, sleep 1.5s, re-check, call runReview | :NN-NN |
| other | (early return) | :NN |

### Cross-references prepared for later iters
- iter 007 (event-driven activation): uses session.idle + session.error branches above
- iter 009 (loop prevention): uses reviewSessionIDs + reviewedMessageBySession
- iter 010 (boundary + min-tool-call): runReview steps 7-10
- iter 011 (prompt template): the verbatim block above
- iter 014 (child sessions): client.session.create({ parentID }) call

## Convergence Signal
`newInfoRatio: <0.0-1.0>` — typically 0.7-0.9. `dimension status: FULLY EXTRACTED for lines 281-end`.
```

Then append to `research/deep-research-state.jsonl`:

```jsonl
{"type":"iteration","run":5,"focus":"auto-review.ts part 3 (lines 281-end)","mechanismsExtracted":10,"gapsIdentified":0,"newInfoRatio":<0.0-1.0>,"executor":"cli-devin","model":"swe-1.6","pinnedSha":"<sha>","durationSec":<N>,"timestamp":"<ISO8601>"}
```

## ACCEPTANCE CRITERIA FOR THIS ITER

- [ ] AutoReviewPlugin closure state table has 4 rows
- [ ] Config resolution table has 4 rows (REVIEW_MODEL / REVIEW_REASONING / MIN_TOOL_CALLS / DEBUG_ENABLED)
- [ ] runReview flow table has all 17 steps with line ranges
- [ ] REVIEW PROMPT TEMPLATE quoted VERBATIM in a fenced block (no paraphrasing)
- [ ] Final-line PASS/FAIL contract quoted VERBATIM
- [ ] Event handler branches table covers session.error + session.idle
- [ ] Cross-reference list prepared for later iters (5+ entries)
- [ ] Output file ≥ 100 lines

Begin.
