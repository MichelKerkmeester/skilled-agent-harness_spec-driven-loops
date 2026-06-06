---
round: 1
seat: seat-002
executor: simulated-holistic-lens
lens: Holistic (Systems / Architecture)
status: ok
timestamp: 2026-05-30T00:00:00Z
simulated: true
---

# Seat 002 — Holistic / Systems-Architecture

## Proposed Plan

There is exactly one architectural seam shared by all four runtimes: the advisor
brief pipeline (`buildSkillAdvisorBrief → renderAdvisorBrief`). Add a SECOND,
parallel injection channel — a "constitutional reminder" line — that rides the same
`additionalContext` / `system.transform` transport but is sourced from constitutional
memory, not from advisor scoring. Fix the seam once; all four runtimes inherit it.

## Reasoning (systems lens)

Map the surfaces (from hook_system.md §8 + actual hook files):

```
                       prompt-time injection (model-visible)        write-time
Runtime     transport                              payload today    post-write hook
--------    -----------------------------------    -------------    ---------------
Claude      UserPromptSubmit (settings.local)      advisor pointer  YES PostToolUse  ← only one
Gemini      BeforeAgent (settings.json)            advisor pointer  NONE  (ADR-003)
Codex       UserPromptSubmit (hooks.json)          advisor pointer  NONE  (ADR-002)
Devin       UserPromptSubmit (.devin/hooks.v1)     advisor pointer  NONE  (ADR-004)
OpenCode    experimental.chat.system.transform     advisor pointer  NONE  (ADR-001)
```

Two structural facts dominate the design:

1. **Only Claude has a write-time hook.** The PostToolUse hook
   (`claude-posttooluse.sh`) is the one place a violation is caught at the moment of
   writing, with the file content in hand. It runs the real checker
   (`check-comment-hygiene.sh`) and reports actual line-level violations. This is the
   gold-standard layer and it works. The other four runtimes have NO equivalent —
   ADR-001..004 already accepted this and fell back to pre-commit. So for
   Gemini/Codex/Devin/OpenCode, the ONLY model-visible lever before commit is the
   prompt-time advisor channel.

2. **All five prompt-time channels converge on one renderer.** Despite five
   different transports, they all call `renderAdvisorBrief()`. That convergence is
   the gift: I do not need five fixes for the prompt-time layer. I need to widen what
   that one pipeline can carry. Today the envelope (`skill-advisor-brief.ts`
   `buildSharedPayload`) carries a single `advisor-brief` section. The architecture
   already supports a `sections[]` array — it just only ever populates one element.

The cleanest architectural move is therefore: introduce a constitutional-reminder
producer that emits a short imperative section ("Code comments: no ADR/REQ/CHK/spec-
path/packet ids — keep the WHY, drop the label") and have each runtime hook append
it to `additionalContext` alongside the advisor pointer. Source of truth stays
`constitutional/comment-hygiene.md`; a tiny extractor pulls a one-line directive from
it so the rule and the injected reminder never drift.

## Why not "just inject the whole markdown file"

Architecturally wrong on three counts: (a) token budget — session-prime is capped at
2000 tokens, prompt advisor at 80-120; a 70-line markdown blows both; (b) coupling —
pasting file bodies couples transport to document formatting; (c) banner blindness —
a large always-present block gets tuned out. The durable design injects a *derived
directive*, not the *document*.

## Where the layers should sit (defense in depth, corrected)

| Tier | Layer | Status | Correct role |
| --- | --- | --- | --- |
| 0 | Hard imperative in prompt injection | MISSING | the actual behavioral nudge for non-Claude runtimes |
| 1 | Claude PostToolUse checker | WORKING | real-time line-level catch (Claude only) |
| 2 | Git pre-commit gate | WORKING | runtime-agnostic floor (the real guarantee) |
| 3 | AGENTS.md passive rule | WORKING (when read) | depends on the model reading project instructions |
| 4 | Constitutional memory entry | EXISTS, NOT PUSHED | retrievable, but nothing injects it |

The gap is Tier 0. Tier 4 was BUILT as if it were Tier 0 but the push mechanism was
never wired — the entry sits in a store that only `memory_search` consults on demand.

## Risks & Trade-offs

- Adding a second section to every prompt injection slightly raises latency and token
  cost on every turn across 5 runtimes. Mitigation: cap the reminder at ~25 tokens
  and cache it (the advisor pipeline already has `advisorPromptCache`).
- A new producer in the shared pipeline is a cross-runtime blast radius: a bug breaks
  all five prompt hooks. Mitigation: fail-open (same contract the advisor already
  uses — return `{}`/null on any error).

## Assumptions and Evidence Gaps

- ASSUMPTION: each runtime hook can emit more than one line of `additionalContext`.
  Verified for Gemini (free-form string), Codex/Devin (same shim contract). OpenCode
  `system.transform` returns a transformed system message — also free-form. Safe.
- GAP: I did not confirm whether the OpenCode plugin's transform output is truncated
  by OpenCode itself; worth a smoke test before relying on it.

## Alternative Challenged

REJECTED: "wire a write-time hook on the other four runtimes to match Claude." ADR-
001..004 already established those hooks do not exist in the runtimes' APIs. Pursuing
them is blocked by external runtime capability, not by our code. The achievable seam
is the prompt-time channel that already exists on all five.

## Confidence

84: The single-seam architecture is real and well-evidenced (one renderer, one
envelope with an underused sections array). Slight uncertainty on OpenCode transform
output handling, which is a test-it item, not a design blocker.
