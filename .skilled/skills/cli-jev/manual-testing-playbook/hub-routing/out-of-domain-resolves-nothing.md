---
id: CJ-003
category: hub_routing
stage: routing
title: "A request with no Jev signal resolves no mode"
expected_intent: none
expected_resources: []
expected_workflow_mode: null
expected_leaf_resources: []
created: 2026-09-20
version: 1.0.0.0
---

# CJ-003: A request with no Jev signal resolves no mode

Prompt: Summarize the open questions in this spec packet.

## Expected Behavior

The hub declares no hub-identity catch-all class, because it also declares `routerPolicy.defaultMode: null`. A request that carries no `cli-usage-aliases` or `jev-dispatch` phrase therefore scores nothing and resolves no mode: the hub neither invents a route nor falls back to `cli-usage`.

## Success Criteria

No workflow mode resolves, and no packet loads. The same prompt phrased as an explicitly out-of-domain judgment ("score this flavor of ice cream") is the holdout form of this check: the words `score` and `judgment` alone must not be enough, since the signal classes carry the judgment nouns only in their Jev-dispatch phrasing.
