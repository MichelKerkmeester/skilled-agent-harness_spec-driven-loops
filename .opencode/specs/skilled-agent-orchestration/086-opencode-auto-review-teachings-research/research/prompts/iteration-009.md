# Deep Research Iteration 009 of 20 — Loop-prevention markers + reviewSessionIDs set + dedup map

## SITUATION

You are running as **cli-devin SWE-1.6** in non-interactive print mode, dispatched as iteration 9 of a 20-iteration deep-research campaign on the upstream `dzianisv/opencode-plugins` `auto-review` package.

**Prior context (REQUIRED)**:
- Iter 003 quoted REVIEW_MARKERS array (5 strings) + SELF_ASSESSMENT_MARKER + FEEDBACK_MARKER verbatim
- Iter 004 documented `hasReviewMarker` (case-insensitive contains-check) + `getMessageSignature` (id || role:time:textPrefix)
- Iter 005 documented `reviewSessionIDs` Set + `reviewedMessageBySession` Map + the runReview gates

**Why this iter exists**: this is the LOOP-PREVENTION mechanism — the design surface that protects the plugin from runaway recursion. Three independent layers cooperate:
1. **Marker layer**: text-based scan for review-marker substrings → if found, skip
2. **Session-set layer**: child sessions are tagged in `reviewSessionIDs` → their own session.idle events skip
3. **Dedup-map layer**: per-session message signature → don't review the same message twice

Together these prevent: A→A reviews itself, child session's idle event triggering its own review, repeated reviews of the same message after dedup-key match.

**Why this matters for us**: deep-research and deep-review loops in our skills are at risk of recursing if an iteration's output ever re-enters a Claude/agent context that then dispatches another iteration. Our current convention prevents this via skill-internal contracts (e.g. "@deep-research is LEAF"), but a marker-based or sessionID-tagged layer would be more robust against accidental recursion.

## TASK

### Step 1 — Aggregate the 3 layers from iter-003/004/005

```bash
# Pull verbatim markers from iter-003
sed -n '1,200p' .opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-003.md

# Pull hasReviewMarker + getMessageSignature from iter-004
sed -n '1,200p' .opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-004.md

# Pull reviewSessionIDs Set + reviewedMessageBySession Map + runReview gates from iter-005
sed -n '1,300p' .opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-005.md
```

### Step 2 — Document each layer

**Layer 1 — Marker scan**:
- Verbatim REVIEW_MARKERS array (5 strings)
- SELF_ASSESSMENT_MARKER and FEEDBACK_MARKER constants
- `hasReviewMarker(text)`: case-insensitive contains-check
- `isRelevantUserBoundary(msg)`: filters out user messages containing any marker
- Application points: (a) skip if last user message has a marker, (b) skip if last assistant message has a marker, (c) the boundary detector skips marker-tagged messages when finding the "last relevant user message"

**Layer 2 — Session set**:
- `reviewSessionIDs: Set<string>`
- Populated when `client.session.create({ parentID })` returns — the child's id is added
- Checked at the very top of the event handler: if `reviewSessionIDs.has(event.properties.sessionID)` → skip
- Effect: the child review session's own session.idle never fires its own review

**Layer 3 — Dedup map**:
- `reviewedMessageBySession: Map<string, string>` — parentSessionID → lastReviewedMessageSignature
- Populated when promptAsync succeeds (or on all-fail fallback path)
- Checked in runReview: if `reviewedMessageBySession.get(parentSessionID) === currentSignature` → skip
- Effect: re-firing session.idle for the same message doesn't trigger a duplicate review

### Step 3 — Draw the recursion-prevention combinator

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

### Step 4 — Apply to our deep-research / deep-review loops

```bash
# Check if our skills have any equivalent recursion-prevention
rg -nC2 'recursion|loop.prevent|self.invok|isLeaf|LEAF.only' .opencode/skills/deep-research/ .opencode/skills/deep-review/ .opencode/skills/deep-agent-improvement/ 2>&1 | head -30

# Check our agent definitions for "no Task tool / no SpawnAgent / LEAF" patterns
rg -nC2 'tools.*Task|allowed-tools|LEAF|no.sub.agent' .opencode/agents/deep-research.md .opencode/agents/deep-review.md .opencode/agents/code.md 2>&1 | head -30
```

Document: do our loops have ANY runtime recursion check (vs only contract-based "this agent is LEAF")? If a deep-research iter accidentally tried to dispatch another deep-research, would anything stop it at runtime?

### Step 5 — Identify generalizable design pattern

Propose: a marker-based + session-tagged + dedup-keyed combination could be applied to ANY long-running auto-loop in our codebase. Could the same three-layer pattern apply to:
- `/deep:start-research-loop` (currently relies on iteration cap + state.jsonl)
- `/deep:start-review-loop` (same)
- `@deep-agent-improvement` (same)

What would need to change in our SKILL.md or agent definitions to encode this defense-in-depth?

## SCOPE

- Iter outputs 003, 004, 005
- Local: `.opencode/skills/{deep-research,deep-review,deep-agent-improvement}/SKILL.md`
- Local agents: `.opencode/agents/{deep-research,deep-review,deep-agent-improvement,code}.md`
- **No writes outside `research/iterations/iteration-009.md` and `research/deep-research-state.jsonl`**

## VERIFICATION COMMANDS

```bash
sed -n '1,200p' .opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-003.md
sed -n '1,200p' .opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-004.md
sed -n '1,300p' .opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-005.md

rg -nC2 'recursion|loop.prevent|self.invok|isLeaf|LEAF.only|dedup|signature' \
  .opencode/skills/deep-research/ .opencode/skills/deep-review/ .opencode/skills/deep-agent-improvement/ 2>&1 | head -40
```

## CONSTRAINTS

- READ-ONLY.
- Quote markers, constants, and key sentences VERBATIM (from iters 003/004/005 outputs).
- Recursion-prevention combinator must be drawn as ASCII flowchart.
- Comparison vs our skills must cite specific file:line evidence (or "not found" with the grep that returned nothing).

## COMMON FAILURE MODES

1. **Confusing markers and types**: REVIEW_MARKERS is an array of 5 strings; SELF_ASSESSMENT_MARKER and FEEDBACK_MARKER are individual string constants. Don't conflate.
2. **Missing prior iter outputs**: if iter-003/004/005 are not done, you can't synthesize. Halt with `BLOCKED-ON-PRIOR-ITER`.
3. **Skill files reference recursion in docs but not in runtime**: don't claim runtime defense from documentation that only says "do not recurse." Real defense requires a code-level check.

## OUTPUT FORMAT

Write to `research/iterations/iteration-009.md`:

```markdown
<!-- PINNED_UPSTREAM_SHA: <sha> -->

# Iteration 009 — Loop-prevention markers + session-set + dedup-map

## Summary
<2-4 sentence verdict on the 3-layer defense + the gap in our skills>

## Files/Commands Reviewed
- iter outputs 003, 004, 005
- `.opencode/skills/{deep-research,deep-review,deep-agent-improvement}/SKILL.md`
- `.opencode/agents/{deep-*}.md`

## Findings

### Layer 1 — Marker Scan (text-based)
**REVIEW_MARKERS** (verbatim, 5 strings):
```typescript
const REVIEW_MARKERS = [
  "AUTO-REVIEW",
  "AUTO REVIEW",
  "REVIEW AUTO-REVIEW",
  "Review another model's work",
  "You are reviewing another session",
]
```

**SELF_ASSESSMENT_MARKER**: `"SELF-ASSESS REFLECTION-3"`
**FEEDBACK_MARKER**: `"REFLECTION FEEDBACK"`

**Application points** (from iter-005 runReview):
- Boundary detection: `isRelevantUserBoundary` filters out user messages containing markers
- Recheck after boundary: `hasReviewMarker(lastUserText) || hasReviewMarker(lastAssistantText)` → skip
- All marker matches use `text.toLowerCase().includes(marker.toLowerCase())`

### Layer 2 — Session Set (id-based)
**reviewSessionIDs**: `Set<string>`
- Populated: when `client.session.create({ parentID })` returns, the child's id is `.add()`-ed
- Checked: top of event handler — `if (reviewSessionIDs.has(sessionID)) return`
- Effect: child review session's own session.idle never fires its own review

### Layer 3 — Dedup Map (signature-based)
**reviewedMessageBySession**: `Map<string, string>` — parentSessionID → message signature
- Populated: when promptAsync succeeds OR on all-fail fallback
- Checked: in runReview — `reviewedMessageBySession.get(parentSessionID) === currentSignature` → skip
- Signature derivation (from iter-004): prefer `msg.id`, else `<role>:<time>:<textPrefix40>`

### Combinator Flowchart (ASCII)
```text
<full flowchart from Step 3 above>
```

### Our Skills — Runtime Recursion Checks?
| Skill | Recursion check? | Evidence (file:line or "not found") | Mechanism |
|-------|------------------|-------------------------------------|-----------|
| deep-research | <YES/NO/PARTIAL> | <evidence> | <mechanism or "contract-only"> |
| deep-review | <YES/NO/PARTIAL> | <evidence> | <mechanism or "contract-only"> |
| deep-agent-improvement | <YES/NO/PARTIAL> | <evidence> | <mechanism or "contract-only"> |
| sk-code-review | <YES/NO/PARTIAL> | <evidence> | <mechanism or "contract-only"> |

### Proposed Generalization
<1-2 paragraphs: could a marker + session-tag + dedup combinator apply to /deep:start-research-loop and /deep:start-review-loop? What concrete changes to SKILL.md or the dispatcher script would encode this? Provide pseudocode if helpful.>

## Convergence Signal
`newInfoRatio: <0.0-1.0>` — moderate (0.3-0.5) since most content is aggregation; new info is the combinator drawing + gap analysis.
```

Then append to `research/deep-research-state.jsonl`:

```jsonl
{"type":"iteration","run":9,"focus":"loop-prevention combinator","mechanismsExtracted":3,"gapsIdentified":<N>,"newInfoRatio":<0.0-1.0>,"executor":"cli-devin","model":"swe-1.6","pinnedSha":"<sha>","durationSec":<N>,"timestamp":"<ISO8601>"}
```

## ACCEPTANCE CRITERIA FOR THIS ITER

- [ ] All 3 layers documented (marker, session-set, dedup-map) with verbatim values
- [ ] Combinator ASCII flowchart rendered
- [ ] Gap-analysis table covers 4 local skills with YES/NO/PARTIAL + evidence
- [ ] Proposed generalization paragraph ≥ 100 words
- [ ] Output file ≥ 100 lines

Begin.
