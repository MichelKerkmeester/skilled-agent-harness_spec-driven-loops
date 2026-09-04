---
title: "Roadmap: Routing Completeness"
description: "Level-agnostic forward plan for near-term, next-step and later work."
trigger_phrases:
  - "roadmap"
  - "forward plan"
  - "now next later"
  - "strategic milestones"
importance_tier: "normal"
contextType: "general"
---
# Roadmap: Routing Completeness

<!-- SPECKIT_TEMPLATE_SOURCE: roadmap | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> What is left after six of seven phases shipped, and where the routing number goes next.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Subject:** Routing completeness, findings closure, and what follows them
**Status:** Active
**Horizon:** 2026-09 onward
**Owner:** Operator
**Last updated:** 2026-09-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:now-next-later -->
## 2. PHASES: NOW / NEXT / LATER

**Now:** Phase `007-spec-kit-residue` is closed. It was worked against packet
`specs/system-speckit/049-memory-decommission`, which deletes
`.opencode/skills/system-spec-kit/mcp-server/` outright, 1,480 files and 453,813 lines. Five of
the eight recorded decisions lived inside that tree, so the first move was not to implement
anything. Each was re-read against 049 and marked done or superseded, with the reason in
`decision-record.md`. ADR-005 and ADR-008 proceeded either way, because neither touches the
deleted tree.

The same test then closed the three criteria those decisions left open. The suite runs to the end
sharded, 12 of 12 shards in 34 minutes, and its 181 failures split into 31 in surviving trees,
each in a named mechanism group, and 150 inside the delete that carry a count rather than a
diagnosis. A full suite run does not leave `git status` clean: it rewrites 20 generated metadata
files under `specs/` through a module that goes with 049. They were restored.

**Next:** Planned. Four items, three of them skill follow-ups already scaffolded and one
fleet sweep.

Chart fidelity and library research sits at
`specs/sk-doc/051-sk-create-chart/007-fidelity-and-library-research/goal.md`. Its packet
last moved in `abf77df9d0`. Exit signal: the research question is answered against a named
library rather than an impression.

Human-voice utilization review sits at
`specs/sk-doc/039-create-with-human-voice/001-utilization-review/goal.md`. Its packet last
moved in `f92c84a673`, which made the mode hold itself to its own standard. Exit signal: the
review reports how often the mode is actually reached, with a number.

Frontmatter utilization review sits at
`specs/sk-doc/049-sk-create-frontmatter/008-utilization-review/goal.md`. Its packet last
moved in `8ad1f98d09`, the first run of its own playbook. Exit signal: the same, a
utilization number rather than an assumption.

The fleet template sweep has no folder yet. Phase 006 measured 24 of 40 templates in this
tree hiding voice blockers inside their own fenced payload. Across the fleet the figure is
45 of 53 once the payload is scanned. This is a decision per template rather than a bulk
rewrite, because a template's fenced block is the deliverable and some of those characters
are load-bearing. Exit signal: every one of the 53 templates has a recorded decision, fix or
keep with the reason.

All three follow-up phases now hold a goal.md, authored alongside this roadmap on 2026-09-02.
Read the phase goal before working the phase; its criteria bind.

**Later:** Done as a plan. Focus: `specs/system-skill-advisor/023-semantic-lane-enablement`,
five planned phases, no code change. Gate B measures 8 of 172 realistic phrasings, 4.7 percent,
and the cause is structural rather than lexical. Two premises were corrected while planning it:
the semantic lane is live at weight 0.05 rather than shadow-only (`lane-registry.ts:12`), and 9
of 14 skill nodes carry a vector in `vec_768`, and the five without one include the two hubs that
scored zero. Adding keywords cannot move that number. Exit signal reached: the packet exists,
validates strict and recursive with zero errors, and each phase carries its own goal.md.
Enabling the lane stays outside this packet because it is a scoring change and D2 forbids one
while these numbers stand.
<!-- /ANCHOR:now-next-later -->

---

<!-- ANCHOR:milestones-targets -->
## 3. MILESTONES & TARGETS

**Packet planned and transport settled:** phase Now, target 2026-09-02. Status: Done.
Evidence: `03f5db4876`, "plan routing completeness, and settle which scorer governs it".

**Gate A measured across five hubs:** phase Now, target 2026-09-02. Status: Done. Evidence:
`dbc8678c9d` records 234 of 444; `08eb67a0de` resolves half the vocabulary that reached
nothing.

**Gate B measured on a realistic corpus:** phase Now, target 2026-09-02. Status: Done.
Evidence: `4a5de9e52b` records 8 of 180; `8c6d6fd455` fixes the denominator to 172.

**Every finding owned:** phase Now, target 2026-09-02. Status: Done. Evidence: `d7f70069b9`,
"give every finding an owner and every phase a runnable gate", and
`research/findings-register.md`.

**Hub surfaces reconciled with a check behind them:** phase Now, target 2026-09-02. Status:
Done. Evidence: `8bb9011584`.

**Suite completes:** phase Now, target 2026-09-02. Status: Done. Evidence: `59a597e37d`,
"the suite never completed because of an infinite loop on the save path".

**Residue decisions closed against 049:** phase Now, target on 049 phase 003 landing. Status:
In Progress. Evidence: none yet; seven of eight decisions are still open.

**Three follow-up phases authored:** phase Next, target after the residue closes. Status: In
Progress. Evidence: a goal.md exists at each of the three paths above as of 2026-09-02; none
of the three phases has run yet.

**Fleet template sweep decided:** phase Next, target after the follow-up phases. Status:
Planned. Evidence: the 45 of 53 count from phase 006 payload scanning.

**Semantic lane packet planned:** phase Later, target 2026-09-03. Status: Done. Evidence:
`specs/system-skill-advisor/023-semantic-lane-enablement` at commit `c0ab5103fd`, six folders
validating strict and recursive at zero errors.
<!-- /ANCHOR:milestones-targets -->

---

<!-- ANCHOR:dependencies -->
## 4. DEPENDENCIES

**Packet 049 scope:** needed by the residue closure, owner Operator. Status: Open. Risk and
mitigation: 049 is still Pending and its scope can move, so a decision closed as superseded
today could be wrong tomorrow. Re-check each path against 049 immediately before acting, and
record the check date beside the note.

**The advisor scorer holding still:** needed by every measurement in this packet, owner
Operator. Status: Ready. Risk and mitigation: changing the scorer voids Gate A and Gate B
together. The semantic lane work is deliberately a separate packet for this reason.

**Goal documents for the three follow-up phases:** needed by the Next milestone, owner
whoever picks the phase up. Status: Ready. Risk and mitigation: all three exist as of
2026-09-02. Read the phase goal first, since a phase worked without its durable directive
drifts.

**Embedding coverage for the semantic lane:** needed by the Later packet, owner Operator.
Status: Planned in 023 phase 002. Risk and mitigation: 9 of 14 skill nodes are embedded and
the five without a vector include mcp-tooling and system-deep-loop, so the lane has no data for
the hubs that miss most even if its weight rises. The research phase settles weight and coverage
together rather than one at a time.
<!-- /ANCHOR:dependencies -->
