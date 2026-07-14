Iteration 005 complete. I've successfully analyzed lines 281-end of auto-review.ts, documenting:

**Key findings:**
- **AutoReviewPlugin closure state**: 4 module-level variables for idempotency (`active`), loop prevention (`reviewSessionIDs`, `reviewedMessageBySession`), and abort race handling (`recentlyAbortedSessions`)
- **Config resolution**: 4 constants resolved at plugin init with config-file → env-var → default fallback chain
- **runReview flow**: 17-step gated pipeline with line ranges, from active-set gate through model fallback loop
- **REVIEW PROMPT TEMPLATE**: Quoted verbatim — the most reusable artifact with header, mission, rules, model metadata, truncated context, 5-item checklist, and strict final-line contract
- **Event handler branches**: `session.error` (abort tracking) and `session.idle` (review triggering with abort-cooldown and race-delay)
- **Cross-references**: 5 entries prepared for later iters (007, 009, 010, 011, 014)

**Output:**
- `research/iterations/iteration-005.md` (109 lines)
- `research/deep-research-state.jsonl` (appended iteration record)

All acceptance criteria met. Ready for iteration 006.
ecklist, and a strict final-line contract for PASS/FAIL signaling. The event handler branches on `session.error` (to record aborts for cooldown) and `session.idle` (to trigger reviews after abort-cooldown and race-delay checks).

## Files/Commands Reviewed
- `packages/auto-review/auto-review.ts:281-end` (at sha cc613a1b4d447b9c5f34e7dec2a1e8478e0572d9)
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
| 1 | 262-263 | Active-set gate: `if (active.has(parentSessionID)) return` |
| 2 | 264 | Mark active: `active.add(parentSessionID)` |
| 3 | 265-421 | Try-finally to ensure active-delete on exit |
| 4 | 267-273 | Fetch session info via `client.session.get` |
| 5 | 275-278 | Skip child sessions (`sessionInfo.parentID` present) |
| 6 | 285-293 | Fetch messages via `client.session.messages` |
| 7 | 295-298 | Boundary check: `findLastRelevantUserBoundaryIndex` |
| 8 | 300-303 | Marker check: skip if last user or last assistant has a REVIEW_MARKER |
| 9 | 305-308 | Dedup check: skip if `reviewedMessageBySession` already has this message signature |
| 10 | 310-313 | Tool-call gate: skip if `< MIN_TOOL_CALLS` |
| 11 | 315 | Resolve work model from last assistant message |
| 12 | 317-345 | Fetch available models via `client.config.providers` |
| 13 | 347-358 | Decide review models: use config-forced model OR `inferReviewModels` |
| 14 | 360-368 | Create child session via `client.session.create({ parentID })` |
| 15 | 370 | Tag child session in `reviewSessionIDs` Set |
| 16 | 372-413 | Iterate `reviewModels`: try each via `client.session.promptAsync`, break on success |
| 17 | 415-417 | On all-fail: record dedup signature anyway (don't retry endlessly) |

### REVIEW PROMPT TEMPLATE (verbatim, the most reusable artifact)
```text
AUTO-REVIEW

You are reviewing another model's just-completed task turn.
Validate completion quality and workflow gates, then report concrete risks only.

Rules:
- Scope review to work after the last relevant user message.
- Do not repeat the task.
- Focus on correctness, verification evidence, and missed edge cases.

Observed model: ${workModelText}
Review model: ${formatModelSpec(reviewModel)}
Tool calls in scoped turn: ${toolCalls}

Last relevant user message:
${lastUserText.slice(0, 2000) || "(none)"}

Last assistant message in scoped turn:
${lastAssistantText.slice(0, 3000) || "(none)"}

Checklist to validate:
- task completion
- tests run/pass
- PR exists if code changes were made
- CI passed if applicable
- obvious issues / bugs / missed edge cases

Return:
1) Checklist with PASS/FAIL/UNKNOWN and brief evidence
2) Issues (only real gaps)
3) Final line exactly one of:
   - Review passed — no issues found.
   - Review failed — <brief reason>.
```

### Final-line PASS/FAIL contract (verbatim, the structured-output contract)
```text
   - Review passed — no issues found.
   - Review failed — <brief reason>.
```

### Event Handler Branches
| event.type | Behavior | Line range |
|-----------|----------|-----------|
| session.error | If errorName === "MessageAbortedError", record sessionID → Date.now() in recentlyAbortedSessions | 424-430 |
| session.idle | Skip if reviewSessionIDs.has(sessionID), skip if abort-cooldown, sleep 1.5s, re-check, call runReview | 434-467 |
| other | (early return) | 434 |

### Cross-references prepared for later iters
- iter 007 (event-driven activation): uses session.idle + session.error branches above
- iter 009 (loop prevention): uses reviewSessionIDs + reviewedMessageBySession
- iter 010 (boundary + min-tool-call): runReview steps 7-10
- iter 011 (prompt template): the verbatim block above
- iter 014 (child sessions): client.session.create({ parentID }) call

## Convergence Signal
`newInfoRatio: 0.85` — typically 0.7-0.9. `dimension status: FULLY EXTRACTED for lines 281-end`.
