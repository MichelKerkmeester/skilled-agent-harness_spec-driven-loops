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
**Last updated:** 2026-09-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:now-next-later -->
## 2. PHASES: NOW / NEXT / LATER

**Now:** In Progress. Focus: closing phase `007-spec-kit-residue` against packet
`specs/system-speckit/049-memory-decommission`. That packet deletes
`.opencode/skills/system-spec-kit/mcp-server/` outright, 1,480 files and 453,813 lines, and
five of the eight recorded decisions live inside that tree. So the first move is not to
implement anything. It is to re-read each decision against 049 and mark it done or
superseded, with the reason in `decision-record.md`. ADR-005 and ADR-008 proceed either way,
because neither touches the deleted tree. Exit signal: every decision in
`007-spec-kit-residue/decision-record.md` carries an implementation commit or a superseded
note, and a full suite run leaves `git status` clean.

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

**Later:** Planned. Focus: a new packet under `specs/system-skill-advisor/` for the semantic
lane. Gate B measures 8 of 172 realistic phrasings, 4.7 percent, and the cause is structural
rather than lexical. The only lane that could match meaning instead of spelling carries
registry weight 0.05, is tagged shadow-only at the lane, and has zero of 14 skill nodes
embedded. Adding keywords cannot move that number. The packet is plan-only for now: a
baseline phase, a deep-research phase on lane weight and embedding coverage, then an enable
phase, each with its own goal.md. The next free number under that track is 023. Exit signal:
the packet exists with three planned phases and no code change, because enabling the lane is
a scoring change and this packet's D2 forbids one while its numbers stand.
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

**Semantic lane packet planned:** phase Later, target unset. Status: Planned. Evidence:
`.opencode/skills/system-skill-advisor/references/scoring/advisor-scorer.md` records the lane
live at weight 0.05.
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
Status: Blocked. Risk and mitigation: zero of 14 skill nodes are embedded, so the lane has no
data even if its weight rises. The research phase must settle weight and coverage together
rather than one at a time.
<!-- /ANCHOR:dependencies -->
