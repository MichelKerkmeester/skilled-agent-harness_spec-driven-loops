---
title: "Goal: Phase 1: deep-research"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "jev deep research goal"
  - "three lineage jev research"
  - "jev research completion criteria"
  - "grok 4.7 research lane"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/001-deep-research"
    last_updated_at: "2026-09-26T16:15:00Z"
    last_updated_by: "orchestrator-session"
    recent_action: "Authored the durable directive"
    next_safe_action: "Write the four context digests and the research angles"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: deep-research

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet has one limit, 4000
> characters, measured from the frontmatter's closing fence to the log anchor.
> Up to 4000 passes and past it fails; the runtime goal surfaces cap what they
> hold, and a truncated objective loses its tail, which is where the criteria
> live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Produce 30 evidence-cited research iterations, 10 each from DeepSeek V4.1 Flash, MiMo V2.6 Pro and Grok 4.7, and one ranked synthesis of where Jev typed judgments earn a measured, opt-in place in `.skilled` skills, workflows and logic.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase writes research artifacts, the cli-cursor allowlist entry for `grok-4.7-xhigh-fast`, and the Planned build-phase scaffolds. Nothing it recommends is built |
| D2 | Lineages write only inside `research/lineages/<label>/` and make no live Jev call; Jev behavior is cited from its contract and the vendored code |
| D3 | Iteration N of a lineage takes angle `<label>-N` from `context/research-angles.md`, one angle per iteration and about 12 tool calls |
| D4 | From wave 2 an iteration reads the newest sibling iteration when one exists, so the synthesis treats agreement after iteration 4 as not independent |
| D5 | The Python `jev-cli` that `cli-usage` wraps and the vendored npm `jevctl` are named apart in every digest, brief and finding |
| D6 | No key or secret appears in any artifact |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend this file's
chat slice so the operator can update their copy. The chat slice is the
durable slice without its frontmatter, HTML comments, anchor markers, `---`
dividers or heading section numbers, and `goal.cjs packet` prints it as
`chat_slice`. Never send more than 4000 characters: cut this file first. Keep
reminding while the copy stays unset, and never stop work for it. A child goal
change that alters a parent decision or criterion is an amendment to the
parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] `context/` holds `repo-rules-digest.md`, `seam-map.md`, `jev-material-digest.md`, `measurement-digest.md` and `research-angles.md`, which defines 30 angles from `deepseek-01` to `grok-10`
- [ ] `grok-4.7-xhigh-fast` is in `CURSOR_SUPPORTED_MODELS` in `executor-config.ts` and in `CURSOR_ALLOWED_MODELS` in `fanout-run.cjs`, `executor-config.vitest.ts` and `fanout-run.vitest.ts` pass, and a live `Reply OK` probe replied `OK`
- [ ] `research/lineages/deepseek/`, `mimo/` and `grok/` each hold `iteration-001.md` to `iteration-010.md` and a state log with 10 iteration records whose last record has `stopReason` `maxIterationsReached`
- [ ] `research/research.md`, written by a fresh Opus 5.5 max leaf, answers RQ1 to RQ7 and ranks each recommendation build-now, next, later or drop with a seam `file:line`, a metric with baseline and harness, opt-in and no-key behavior and a smallest slice
- [ ] The synthesis marks every citation in its ranked list resolved, drifted or failed, and the orchestrator reopened five citations and three recommendations
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Phase opened | In Progress | Scaffolded by `create.sh --phase` on 2026-09-26 |

### Deviations and findings

| Item | Note |
|------|------|
| Grok 4.7 MAX fast | Cursor lists no Grok 4.7 MAX tier on 2026-09-26, so the highest-effort fast id `grok-4.7-xhigh-fast` runs the `grok` lineage |
<!-- /ANCHOR:log -->
