---
title: "Goal: agent mirror parity"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/049-deep-loop-alignment-review/008-agent-mirror-parity"
    last_updated_at: "2026-09-16T01:50:00Z"
    last_updated_by: "agent-mirror-parity"
    recent_action: "Recorded the phase evidence and closed the criteria"
    next_safe_action: "Close the phase and hand off to 009-containment-promise-and-severity-scale"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/references/shared/agent-mirror-crosswalk.md"
      - ".opencode/skills/system-deep-loop/leaf-scopes.json"
      - ".opencode/skills/sk-doc/leaf-scopes.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-mirror-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: agent mirror parity

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

**Objective:** Make every agent's declarations survive translation into all four runtime mirrors, with the losses named where they cannot.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Sampling configuration, the permission deny half, the tool lexicon and model attraction each either translate into every mirror or are named as untranslatable in a crosswalk the mirrors point at; the two mirror families gain one comparison that covers both. |
| D2 | The leaf contract says the same thing in the agent file, the workflow and the state schema. |
| D3 | Fixed by DeepSeek V4.1 Flash at max through the gateway on cli-pi, one dispatch for this phase alone, verified by the deep-loop suite before the next phase starts. |

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


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] Every agent declaration either appears in all four mirrors or is named in a crosswalk the mirrors cite
- [x] One mechanism compares both mirror families, and the mirror-sync checks pass on its output
- [x] The deep-loop suite exits zero
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
| Crosswalk | Done | `references/shared/agent-mirror-crosswalk.md` covers five source keys across six trees, the sanctioned-delta list and the manual-invocation note; both agents READMEs and the packet README point at it |
| Per-mode leaf sets | Done | `agent-improvement` 23 and `model-benchmark` 47 leaves (was 61/61 identical); `sk-create-skill` 19 and `sk-create-skill-parent` 15 (was 34/34); `ci-leaf-manifest-freshness` reports checked=13 fresh=13 failed=0 |
| Collision refusal | Done | `MODE_LEAF_SET_COLLISION` proven pre-fix on both hubs, then covered by the scope fixtures and the contract helper tests |
| Router reachability | Done | `parent-skill-check.cjs` exits 0 for both touched hubs; `manifestLeafOwners` / `manifestOwnsLeafForPacket` teach the check that a same-packet mode may own the leaf |
| Contract licensing | Done | `budgetProfile` and `edgeCases` are gone from all four trees that demanded them, and both generators report `PASS: 12 agents are in sync` after regeneration |
| Mirror gates | Green | `check-agent-mirror-sync.cjs --all` and `agent-roster-mirror-check.cjs` both exit 0 |
| Full suite | Green | 154 files and 2677 of 2685 tests pass, 8 skipped, exit 0 - the same counts as before this change set |

### Deviations and findings

| Item | Note |
|------|------|
| One measured claim was wrong | The dispatch stated that `edgeCases` appears in exactly one file, `.opencode/agents/deep-review.md`. It appears in four deep-review agent bodies (`.opencode`, `.claude`, `.pi`, `.codex`), so the drop was applied to all four rather than to one |
| Contract choice | `budgetProfile` and `edgeCases` were dropped rather than carried through the prompt pack, the state record and the verifier: the two keys have no consumer, and carrying them would change a schema shared by two workflow variants and the verifier |
| Extra repair in scope | `.claude/agents/deep-review.md` was the one `.claude` agent whose path references pointed at the other tier; its three lines were normalised so the crosswalk's per-tier statement holds |
| Pre-existing suite failure | `skill-root-metadata-contract.test.cjs` fails on a fleet-discovery case that still expects the retired `sk-design-md-generator` hub. It belongs to the `sk-design` track and predates this packet |
| Pre-existing routing staleness | `compiled-route-guard.cjs` reports `system-deep-loop` as `stale-manifest`. No routing input of that hub changed here; the cause is a compiler-side change from another track |
<!-- /ANCHOR:log -->
