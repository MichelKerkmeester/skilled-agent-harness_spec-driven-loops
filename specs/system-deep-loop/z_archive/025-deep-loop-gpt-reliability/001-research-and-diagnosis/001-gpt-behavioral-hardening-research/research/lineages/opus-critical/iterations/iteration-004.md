# Iteration 4 — KQ4 orchestrate→deep: confirm the NDP violation, sharpen the attribution

**Focus:** KQ-OPUS-4 — Independently verify `sonnet-critical`'s KQ4 OVERTURN (that "orchestrate dispatches `@deep` and STOP" violates NDP) against `orchestrate.md` and `deep.md`, and locate exactly where the unsafe phrasing originates.

## What was read (this iteration)

- `.opencode/agents/orchestrate.md:42-47, 107-155, 184-207` — ILLEGAL NESTING, NDP, dispatch format
- `.opencode/agents/deep.md:1-18, 51-79` — frontmatter (`mode: primary`), hard boundaries, routing workflow
- `research/research.md:13` (consolidated §0) and `glm-max/research.md:55` — the two places the "dispatch @deep and STOP" recommendation appears

## Finding 1 — The NDP violation is real (independent confirmation)

`orchestrate.md` is `mode: primary` (`:4`) and enforces a hard 2-level depth cap: "Maximum agent depth is 2 (depth counter 0, 1). Only the depth-0 orchestrator may dispatch LEAF agents. Depth-1 agents MUST NOT dispatch sub-agents." (`:45-47`). Its own worked ILLEGAL example is `Orch(0) → Sub-Orch(1) → @leaf(2)` (`:148`).

`deep.md` is ALSO `mode: primary` (`:4`) and its entire purpose is to dispatch a leaf: "perform exactly one dispatch to the resolved target" (`:22`), "Dispatch at most one level from this primary router to the selected deep target" (`:56`). So orchestrate(0) Task-dispatching `@deep`(1), which then dispatches `@deep-research`(2), is exactly `Orch(0) → Sub-Orch(1) → @leaf(2)` — the `:148` ILLEGAL pattern, with `@deep` as the sub-orchestrator. **Confirmed:** the literal "dispatch `@deep` and STOP" reading is NDP-illegal. [SOURCE: .opencode/agents/orchestrate.md:45-47,148; .opencode/agents/deep.md:4,22,56]

## Finding 2 — The unsafe phrasing is glm-max's own, not just the consolidation's

sonnet-critical attributed the NDP-unsafe wording to "KQ4's top-ranked, full-agreement recommendation" and the consolidated synthesis (`research.md:13`: "dispatches `@deep` … and stops"). Tracing it further back: `glm-max/research.md:55` states the smallest edit as *"dispatch @deep with the Deep Route header resolved from mode-registry.json and STOP."* So the NDP-unsafe phrasing is present in glm-max's **own** lineage synthesis, not merely introduced by the consolidation step. This matters for the charter's "shared blind spot" mandate (§9.3): both glm-max and the consolidation carried an NDP-illegal recommendation, and `gpt-fast-high` (`:73`) used the vaguer, accidentally-safer "resolve via `deep.md` / `mode-registry.json`" phrasing — so the one lineage that happened NOT to state the violation is the GPT one, by vagueness rather than by catching it. [SOURCE: glm-max/research.md:55; gpt-fast-high/research.md:73; research/research.md:13]

## Finding 3 — deep.md already models the NDP-safe pattern orchestrate should copy

The corrected fix is not novel machinery: `deep.md:63-79` already does registry-resolution (read `mode-registry.json`, select entry, load `.opencode/agents/<agent>.md`, emit the `Deep Route:` header, dispatch the leaf once at Depth 1). orchestrate should reuse that **logic as reference**, resolving the route from the registry itself and dispatching the resolved LEAF directly at Depth 1 (`Orch(0) → @deep-research(1)`, legal per `:139`), never routing through `@deep`. This confirms sonnet-critical's Deliverable 3 intent. (Whether even that is minimal is examined in iter 5.)

## Ruled out this iteration

- Treating the "dispatch @deep and STOP" recommendation as safe under its literal Task-dispatch reading — RULED OUT, independently, via `orchestrate.md:148` + `deep.md:4` both being `mode: primary`.
- Attributing the NDP-unsafe phrasing solely to the consolidation layer — RULED OUT; it is in `glm-max/research.md:55` directly.

## Status

`insight` — confirms the prior critical finding from source and reassigns its origin to a specific prior-lineage line.

newInfoRatio: 0.60 — novelty: confirmation (not new direction) but with sharper provenance (glm-max:55 is the origin) and the observation that the GPT lineage's vaguer phrasing was accidentally the safe one.
