# Deep Research Iteration 014 of 20 — Child-session model (session.create with parentID + isolation guarantees)

## SITUATION

You are running as **cli-devin SWE-1.6** in non-interactive print mode, dispatched as iteration 14 of a 20-iteration deep-research campaign on the upstream `dzianisv/opencode-plugins` `auto-review` package.

**Prior context (REQUIRED)**:
- Iter 005 documented the `client.session.create({ parentID: parentSessionID, title: "AUTO-REVIEW" })` call
- Iter 005 documented the `reviewSessionIDs.add(reviewSession.id)` tagging that prevents nested reviews

**Why this iter exists**: child sessions are the isolation primitive that makes auto-review safe. By creating a CHILD session for the review, the upstream plugin gets: (a) separate session log + message history, (b) separate model invocation that doesn't pollute the parent session's transcript, (c) clear parent-child lineage for billing/tracking, (d) the parent session's `session.idle` doesn't re-fire when the child completes. This is the OpenCode SDK's analogue of our `@deep-research` agent dispatch.

**Why this matters for us**: our deep-research / deep-review / deep-agent-improvement loops dispatch through Task tool (which can spawn agents in Claude Code) or cli-* executors (which spawn separate OS processes). We don't currently have a "child session" concept in our OpenCode plugins. If we built a `mk-auto-review` plugin similar to this upstream, we'd need to use the same `session.create` SDK call.

## TASK

### Step 1 — Re-document session.create call from iter-005

```bash
sed -n '1,400p' .opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-005.md
```

Pull verbatim:
- `client.session.create({ query: { directory }, body: { parentID: parentSessionID, title: "AUTO-REVIEW" } })`
- The reviewSession id capture: `reviewSession = data as SessionInfo`
- The tagging: `reviewSessionIDs.add(reviewSession.id)`

### Step 2 — Document the isolation guarantees

For each property of "isolation," indicate whether the upstream plugin achieves it:

| Property | Achieved? | Mechanism |
|----------|-----------|-----------|
| Separate session id | YES | session.create returns new id |
| Separate message log | YES | child session has own messages array (per SDK contract) |
| Separate model invocation | YES | session.promptAsync targets reviewSession.id |
| Parent transcript not polluted | YES | review messages live in child, not parent |
| Child session.idle doesn't re-fire review | YES | reviewSessionIDs.has(childID) skips |
| Billing/quota lineage | LIKELY | parentID set; SDK MAY track lineage (verify in @opencode-ai/plugin docs if accessible) |
| Resource limits (timeout, max tools) | NOT EXPLICITLY | inherits SDK defaults |

### Step 3 — Compare to our spawning primitives

```bash
# Look for Task tool / SpawnAgent / cli-* dispatch patterns in our skills
rg -nC2 'Task\\(|SpawnAgent|cli-codex|cli-devin|cli-opencode|cli-gemini' \
  .opencode/skills/deep-research/SKILL.md .opencode/skills/deep-review/SKILL.md \
  .opencode/skills/deep-agent-improvement/SKILL.md 2>&1 | head -30

# Look for session.create-equivalent in our plugins
rg -nC2 'session\.create|child.session|parentID' .opencode/plugins/ 2>&1 | head -10
```

Comparison table:

| Spawning primitive | Where used | Isolation properties achieved | Parent-child tracking |
|--------------------|-----------|------------------------------|----------------------|
| `client.session.create({ parentID })` | upstream auto-review | all 7 properties listed above | YES via parentID |
| Task tool (Claude Code) | our deep-research, deep-review | separate context, separate result | YES via tool call lineage |
| cli-* dispatch (sub-process) | our 015/037 packets | separate OS process | NO (sub-process is opaque to parent) |
| Direct SDK call (no child) | n/a in upstream | none — review runs in parent context | n/a |

### Step 4 — Identify when each primitive is appropriate

| Use case | Best primitive | Rationale |
|----------|---------------|-----------|
| Auto-review on session.idle | session.create | parent stays clean, can review during user session |
| Multi-iter deep-research | Task tool OR cli-* | iterations need fresh context; child session wouldn't reset context window |
| Single-shot cross-AI validation | cli-* OR session.create | depends on isolation needs |
| Inline review without isolation | Direct SDK call | risky — pollutes context |

## SCOPE

- Iter output 005
- Local: `.opencode/skills/deep-*/SKILL.md`, `.opencode/plugins/mk-*.js`
- **No writes outside `research/iterations/iteration-014.md` and `research/deep-research-state.jsonl`**

## VERIFICATION COMMANDS

```bash
sed -n '1,400p' .opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-005.md

rg -nC2 'Task\\(|SpawnAgent|cli-codex|cli-devin|cli-opencode|cli-gemini|session\.create|parentID' \
  .opencode/skills/deep-research/ .opencode/skills/deep-review/ .opencode/skills/deep-agent-improvement/ \
  .opencode/plugins/ 2>&1 | head -40
```

## CONSTRAINTS

- READ-ONLY.
- Quote the `session.create` call verbatim.
- Cite local file:line for every "we use X" claim.

## COMMON FAILURE MODES

1. **Confusing "child session" with "sub-agent"**: in OpenCode SDK, sessions are stateful conversation logs; in Claude Code, sub-agents are stateless task-runners. They have different isolation properties.
2. **parentID null vs unset**: in TypeScript, `parentID: undefined` vs absent property may have different SDK semantics. Don't claim either without checking SDK docs.

## OUTPUT FORMAT

Write to `research/iterations/iteration-014.md`:

```markdown
<!-- PINNED_UPSTREAM_SHA: <sha> -->

# Iteration 014 — Child-session model + isolation guarantees

## Summary
<2-4 sentence verdict>

## Findings

### session.create Call (verbatim)
```typescript
<verbatim block from auto-review.ts>
```

### Isolation Guarantees Table
| Property | Achieved? | Mechanism |
|----------|-----------|-----------|
| <7 rows from Step 2> | | |

### Spawning Primitive Comparison
| Primitive | Where used | Isolation | Parent-child tracking |
|-----------|-----------|-----------|----------------------|
| <4 rows from Step 3> | | | |

### Use-Case Matrix
| Use case | Best primitive | Rationale |
|----------|---------------|-----------|
| <4 rows from Step 4> | | |

## Convergence Signal
`newInfoRatio: <0.0-1.0>` — moderate.
```

Then append to `research/deep-research-state.jsonl`:

```jsonl
{"type":"iteration","run":14,"focus":"child session + isolation","mechanismsExtracted":1,"gapsIdentified":<N>,"newInfoRatio":<0.0-1.0>,"executor":"cli-devin","model":"swe-1.6","pinnedSha":"<sha>","durationSec":<N>,"timestamp":"<ISO8601>"}
```

## ACCEPTANCE CRITERIA FOR THIS ITER

- [ ] Verbatim session.create call
- [ ] Isolation guarantees table with 7 rows
- [ ] Spawning primitive comparison with 4 rows
- [ ] Use-case matrix with 4 rows
- [ ] Output file ≥ 70 lines

Begin.
