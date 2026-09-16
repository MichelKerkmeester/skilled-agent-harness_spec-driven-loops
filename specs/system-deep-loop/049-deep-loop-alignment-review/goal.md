---
title: "Goal: align the deep-loop system end to end"
description: "Every surface of the deep-loop system agrees with every other and with the code, proven by an angle-driven review whose every finding becomes a phase."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/049-deep-loop-alignment-review"
    last_updated_at: "2026-09-15T09:48:34Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: align the deep-loop system end to end

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet warns past 3000
> characters and fails past 4000, measured from the frontmatter's closing fence
> to the log anchor; the runtime goal surfaces cap what they hold, and a
> truncated objective loses its tail, which is where the criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every surface of the deep-loop system says the same thing as every other and as the code: routers and their JSON metadata, SKILL.md files against their references and assets, catalogs, playbooks and READMEs against the runtime, commands and agents against the runtime, executor parity across every CLI kind, the architecture read as one system, and all of it held to the repo rules.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Phase 001 ran twenty iterations as four lanes of five in two waves, max-iterations, convergence off, wave-two angles rewritten from wave one, on DeepSeek V4.1 Flash max and GLM 5.3 Flash max through the gateway on cli-pi. |
| D2 | Nothing is deferred: every confirmed finding at every tier the machinery carries becomes a phase, fixed by DeepSeek V4.1 Flash max on cli-pi, one dispatch per phase, suite-verified before the next; a refuted finding is recorded with its reason. |
| D3 | Routing artifacts agree exactly per hub: SKILL.md, ROUTER.md, mode-registry.json, hub-router.json, leaf-manifest.json, graph-metadata.json, description.json. |
| D4 | The repo rules bind the fixes: the smallest change that closes a finding, no abstraction a current requirement does not earn, comments carrying the durable why. |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the durable
slice of this file in chat, frontmatter excluded, so the operator can update
their copy. Keep reminding while it stays unset; never stop work for it. A
child goal change that alters a parent decision or criterion is an amendment
to the parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase**; decisions above outrank it.

Phase 001 is the review. Its findings bind to phases 002 to 012: rosters, version authority, leaf manifests and doctrine reachability, catalog and README truth, confirm-variant parity, ledger stem producers, agent mirror parity, the containment promise with the severity scale, the three an audit found unbound, and the defects earlier phases recorded but did not fix.
<!-- /ANCHOR:binding -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] Phase 001's twenty iterations ran across four lanes on both executors, each record carrying the route-proof fields
- [x] Wave-two angles were rewritten in the phase spec from wave-one findings before wave two ran
- [x] Every finding at every tier is verified against the tree and bound to a phase or recorded as refuted with the reason
- [x] Every bound phase validates PASSED with its criteria checked and the suite green
- [x] The routing artifacts of every hub in scope agree exactly at the end
- [x] The deep-loop suite exits zero after the last phase lands
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| [Item] | [Pending/In Progress/Done] | [Command output, file:line, or artifact] |

### Deviations and findings

| Item | Note |
|------|------|
| [What diverged from the directive] | [Why, and what was done instead] |
<!-- /ANCHOR:log -->
