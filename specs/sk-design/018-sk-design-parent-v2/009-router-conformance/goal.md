---
title: "Goal: the sk-design router reads like its peers"
description: "The durable directive this phase executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/009-router-conformance"
    last_updated_at: "2026-09-06T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Rewrote the root router onto the shape every other hub uses"
    next_safe_action: "None open; the replay confirmed the rewrite moved no routing"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/ROUTER.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-018-sk-design-parent-v2"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Goal: the sk-design router reads like its peers

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->

**Inherits the parent `goal.md`. Where this file and that one disagree, that one wins.**

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

A reader who knows one hub's router can read this one without relearning its shape.

### Decisions

**The validator is not the standard here.** All six hubs pass the root-router contract, and one of
them still diverged for weeks. The standard is the template plus what the peers actually do:
a numbered machine-readable section, an explicit `DEFAULT_RESOURCE`, and a bulleted closing contract.

**Change no keyword and no map path.** This phase moves prose and structure. Anything that would move
routing belongs to a different phase.

### Operator copy

The router gains the machine-readable section and closing contract every peer has.
<!-- /ANCHOR:directive -->

<!-- ANCHOR:binding -->
## 2. BINDING

1. Read two peers and the template before writing, since no gate encodes this convention.
2. Touch no `INTENT_SIGNALS` keyword and no `RESOURCE_MAP` path.
3. Replay the sixteen phrases and require them byte-identical.
4. Keep the machine-readable block and the prose in sync; the block is the replay source.
<!-- /ANCHOR:binding -->

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

| # | Criterion | How it is proven |
|---|-----------|------------------|
| 1 | Peer section skeleton | OVERVIEW, INTENT MODEL, MACHINE-READABLE ROUTER, HOW TO READ THIS |
| 2 | `DEFAULT_RESOURCE` declared | Present, empty, with the reason written down |
| 3 | Every path resolves | Checked against disk |
| 4 | Routing unchanged | Sixteen-phrase replay byte-identical |
<!-- /ANCHOR:completion -->

<!-- ANCHOR:log -->
## 4. LOG

### Progress

Done. The router is 115 lines with the peer skeleton; the replay at generation 653 was byte-identical.

### Deviations and findings

- **The contract validator passes for all six hubs, before and after.** It checks frontmatter,
  required sections and path resolution, not the section skeleton, so a router can diverge from every
  peer and stay green. That is what happened here.
- **The intent table is new.** The peers carry prose above their code block; sk-design now carries a
  table naming each intent, its mode and what the request asks for, because five intents across four
  modes is not obvious from the keyword lists alone.
<!-- /ANCHOR:log -->
