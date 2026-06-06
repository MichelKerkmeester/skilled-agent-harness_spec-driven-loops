Iteration 009 complete. I've successfully:

1. **Aggregated 3 loop-prevention layers** from prior iterations:
   - Layer 1: Marker scan (REVIEW_MARKERS array + SELF_ASSESSMENT_MARKER + FEEDBACK_MARKER)
   - Layer 2: Session set (reviewSessionIDs Set)
   - Layer 3: Dedup map (reviewedMessageBySession Map with message signatures)

2. **Documented the recursion-prevention combinator** as ASCII flowchart showing the complete gate sequence from session.idle → session-set check → abort cooldown → marker check → dedup check → tool-call gate → child dispatch

3. **Analyzed our local skills** for runtime recursion checks:
   - deep-research: NO (contract-only LEAF-only)
   - deep-review: NO (contract-only LEAF-only)
   - deep-agent-improvement: NO (no patterns found)
   - sk-code-review: NO (documentation-only security checklist item)

4. **Identified critical gap**: Our skills lack runtime recursion detection—if an iteration accidentally dispatched another loop, nothing would stop it at runtime. The upstream plugin's 3-layer combinator provides defense-in-depth we lack.

5. **Proposed generalization**: Concrete implementation path for adding marker + session-tag + dedup layers to our deep-research/deep-review YAML workflows using existing state file infrastructure.

Output: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/106-opencode-auto-review-teachings-research/research/iterations/iteration-009.md" /> (103 lines)

State updated: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/106-opencode-auto-review-teachings-research/research/deep-research-state.jsonl" />

All acceptance criteria met. Ready for iteration 010.
ID })` returns, the child's id is `.add()`-ed
- Checked: top of event handler — `if (reviewSessionIDs.has(sessionID)) return`
- Effect: child review session's own session.idle never fires its own review

### Layer 3 — Dedup Map (signature-based)
**reviewedMessageBySession**: `Map<string, string>` — parentSessionID → message signature
- Populated: when promptAsync succeeds OR on all-fail fallback
- Checked: in runReview — `reviewedMessageBySession.get(parentSessionID) === currentSignature` → skip
- Signature derivation (from iter-004): prefer `msg.id`, else `<role>:<time>:<textPrefix40>`

### Combinator Flowchart (ASCII)
```text
session.idle fires for sessionID X
       │
       ▼
   reviewSessionIDs.has(X)?
       │
       ├── YES → skip (child session)
       │
       └── NO  → check abort cooldown → sleep race → re-check abort
                     │
                     ▼
                runReview(X)
                     │
                     ▼
                Find boundary → get last user + assistant + tool count
                     │
                     ▼
                hasReviewMarker(lastUserText) || hasReviewMarker(lastAssistantText)?
                     │
                     ├── YES → skip (marker found → likely review-of-review)
                     │
                     └── NO  → reviewedMessageBySession.get(X) === signature?
                                     │
                                     ├── YES → skip (already reviewed)
                                     │
                                     └── NO  → toolCalls < MIN_TOOL_CALLS?
                                                     │
                                                     ├── YES → skip (trivial turn)
                                                     │
                                                     └── NO  → create child, dispatch review
```

### Our Skills — Runtime Recursion Checks?
| Skill | Recursion check? | Evidence (file:line or "not found") | Mechanism |
|-------|------------------|-------------------------------------|-----------|
| deep-research | NO | SKILL.md:5 "The @deep-research agent itself does NOT have Task (LEAF-only)" | Contract-only (agent definition prohibits Task tool) |
| deep-review | NO | SKILL.md:5 "The @deep-research agent itself does NOT have Task (LEAF-only)" | Contract-only (agent definition prohibits Task tool) |
| deep-agent-improvement | NO | grep returned no matches for recursion/LEAF patterns | None found |
| sk-code-review | NO | security_checklist.md:72 mentions "Unbounded loops, recursion" as a security CHECK ITEM, not a runtime guard | Documentation-only (security checklist item, not enforcement) |

**Critical gap**: None of our skills have runtime recursion detection. The LEAF-only contract exists only in agent definitions—if a deep-research iteration accidentally dispatched another deep-research via a shell command or CLI wrapper, nothing would stop it at runtime. The upstream plugin's 3-layer combinator provides defense-in-depth that we lack.

### Proposed Generalization
A marker-based + session-tagged + dedup-keyed combinator could apply to `/deep:start-research-loop` and `/deep:start-review-loop` by adding runtime guards to the YAML workflow dispatcher. Concretely:

1. **Marker layer**: Add a `RESEARCH_LOOP_MARKER` constant (e.g., "DEEP-RESEARCH-ITERATION") and inject it into each iteration's output file header. The dispatcher would scan the last iteration output for this marker before dispatching another—if found, skip with a "nested loop detected" error.

2. **Session-set layer**: The YAML workflow already tracks iteration state in `deep-research-state.jsonl`. Add a `dispatchingSessionID` field populated when the workflow starts, and check it before each iteration dispatch to prevent re-entry from the same session.

3. **Dedup-map layer**: Use the existing `iteration` field in the state JSONL as a dedup key—the dispatcher already increments this. Add a signature field combining `normalized_topic + iteration_count + phase` to prevent duplicate dispatches with the same parameters.

Implementation would require modifying `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` to add these checks at the dispatch gate, and updating the agent definitions to emit the marker in their output headers. The existing state file format already supports the metadata needed for layers 2 and 3.

## Convergence Signal
`newInfoRatio: 0.40` — Moderate: most content is aggregation from prior iters (marker strings, function signatures, flowchart). New information is the gap analysis showing our skills lack runtime recursion prevention, plus the concrete generalization proposal with implementation paths.
