---
title: "483 -- Level 1 packet authored from the card"
description: "This scenario validates that a DeepSeek worker can scaffold and fill a Level 1 packet from the authoring card alone, with strict validation passing and no token left."
version: 1.0.0.0
id: template-authoring-level-1-packet-authored-from-card
---

# 483 -- Level 1 packet authored from the card

## 1. OVERVIEW

This scenario validates the card as an authoring instruction. It dispatches one DeepSeek worker with the card as its guidance and a throwaway track as its only write path. The worker scaffolds and fills a Level 1 packet. The operator then runs strict validation and counts the tokens left in the four documents.

### Why This Matters

A card that reads well but cannot drive a finished packet is a brochure. This scenario is the end to end check: one model, one card, one strict pass and zero tokens left.

---

## 2. SCENARIO CONTRACT

Operators dispatch one worker, then validate the packet it wrote.

- Objective: Prove that a DeepSeek worker writes a Level 1 packet from the card, that strict validation prints `RESULT: PASSED`, and that the four documents hold no value token or open question marker.
- Playbook ID: 483.
- Real user request: `Use the authoring card to write a complete Level 1 packet for a small feature, then prove it passes strict validation with nothing left to fill.`
- Prompt: `Use the authoring card to write a complete Level 1 packet for a small feature, then prove it passes strict validation with nothing left to fill.`
- Preconditions: A checkout with Node, bash, `rg` and `opencode2` on PATH, a provider login that lists `llmgateway/deepseek-v4.1-flash-1017`, and phase 5 closed so the card exists. The scenario needs network access and one model run.
- Expected execution process: Remove any earlier throwaway track, write the worker brief, dispatch the worker, validate the packet it wrote, count the tokens left, then remove the track.
- Expected signals: The dispatch exits 0. The packet holds `spec.md`. Strict validation prints `RESULT: PASSED`. The token count prints `0`. The track is gone at the end.
- Desired user-visible outcome: The operator sees a finished Level 1 packet that a strict run accepts, with no authoring hint left for a reader to fill.
- Pass/fail: PASS if the dispatch exits 0, strict validation prints `RESULT: PASSED`, the token count is `0` and the track is gone. FAIL if any of those checks fails.

---

## 3. TEST EXECUTION

### Prompt
