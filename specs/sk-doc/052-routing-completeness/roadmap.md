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

> What is left after eight phases shipped, and where the routing number goes next.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Subject:** Routing completeness, findings closure, and what follows them
**Status:** Closed, with three owned follow-ups outside the packet
**Horizon:** 2026-09 onward
**Owner:** Operator
**Last updated:** 2026-09-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:now-next-later -->
## 2. PHASES: NOW / NEXT / LATER

**Now:** The packet is closed. Phase `008-drift-after-closure` re-measured both gates on
2026-09-05 against the tree as it stands after `b4c2484696` nested the spec-kit CLI under
`runtime/` and after `specs/system-speckit/049-memory-decommission` closed and removed
`mcp-server/`. Gate A reads 343 of 388, two rows off its 2026-09-04 recording, both ruled.
Gate B reads 20 of 180, one prompt off. The scaffolder the nesting had broken renders a full
packet again, proven by the suite that was red.

Three findings leave the packet with an owner rather than a fix, all recorded in phase 008's
decision record and in register rows 42 to 44. Two belong to `system-skill-advisor`: a
declared signal that returns nothing from both scorers with no known mechanism, and a parity
pin that reads three numbers in one session because the Python reference loads the daemon's
local skill graph. One belongs to `system-spec-kit`: the strict validator passed a parent
spec carrying 69 bracket placeholders and reports acceptance closure inactive on a Level 3
phase parent.

**Next:** Planned. Four items, three of them skill follow-ups already scaffolded and one
fleet sweep.

Chart fidelity and library research sits at
`specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/007-fidelity-and-library-research/goal.md`. Its packet
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
45 of 53 once the payload is scanned, and `cb9fdb44f3` swept thirty-seven of them. This is a
decision per template rather than a bulk rewrite, because a template's fenced block is the
deliverable and some of those characters are load-bearing. Exit signal: every one of the 53
templates has a recorded decision, fix or keep with the reason.

All three follow-up phases hold a goal.md, authored on 2026-09-02. Read the phase goal
before working the phase; its criteria bind.

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
nothing; `726af58b4c` closes the signal audit at 345 of 388.

**Gate B measured on a realistic corpus:** phase Now, target 2026-09-02. Status: Done.
Evidence: `4a5de9e52b` records 8 of 180; `8c6d6fd455` fixes the denominator to 172.

**Every finding owned:** phase Now, target 2026-09-02. Status: Done. Evidence: `d7f70069b9`,
"give every finding an owner and every phase a runnable gate", and
`research/findings-register.md`, forty-five rows on 2026-09-05.

**Hub surfaces reconciled with a check behind them:** phase Now, target 2026-09-02. Status:
Done. Evidence: `8bb9011584`.

**Suite completes:** phase Now, target 2026-09-02. Status: Done. Evidence: `59a597e37d`,
"the suite never completed because of an infinite loop on the save path".

**Residue decisions closed against 049:** phase Now, target on 049 phase 003 landing. Status:
Done. Evidence: `0467949fc8` and `4be7058385`; nine rulings in
`007-spec-kit-residue/decision-record.md`, and 049 has since closed with the tree removed in
`aef7852400`.

**Both gates re-measured after the tree moved:** phase Now, target 2026-09-05. Status: Done.
Evidence: `008-drift-after-closure/research/`, two artifacts with the recorded bucket beside
the re-run bucket, and the scaffold suite at 9 of 9.

**Three follow-up phases authored:** phase Next, target after the residue closes. Status: In
Progress. Evidence: a goal.md exists at each of the three paths above as of 2026-09-02; none
of the three phases has run yet.

**Fleet template sweep decided:** phase Next, target after the follow-up phases. Status:
Planned. Evidence: the 45 of 53 count from phase 006 payload scanning, and the thirty-seven
swept in `cb9fdb44f3`.

**Semantic lane packet planned:** phase Later, target 2026-09-03. Status: Done. Evidence:
`specs/system-skill-advisor/023-semantic-lane-enablement` at commit `c0ab5103fd`, six folders
validating strict and recursive at zero errors.
<!-- /ANCHOR:milestones-targets -->

---

<!-- ANCHOR:dependencies -->
## 4. DEPENDENCIES

**Packet 049 scope:** needed by the residue closure, owner Operator. Status: Closed. 049 is
Complete and `mcp-server/` is gone, so every superseded ruling in phase 007 now rests on a
delete that happened rather than one that was planned. Nothing remains to re-check.

**The advisor scorer holding still:** needed by every measurement in this packet, owner
Operator. Status: Ready. Risk and mitigation: changing the scorer voids Gate A and Gate B
together. The semantic lane work is deliberately a separate packet for this reason, and phase
008's parity finding is left for the advisor owner for the same reason.

**Goal documents for the three follow-up phases:** needed by the Next milestone, owner
whoever picks the phase up. Status: Ready. Risk and mitigation: all three exist as of
2026-09-02. Read the phase goal first, since a phase worked without its durable directive
drifts.

**Embedding coverage for the semantic lane:** needed by the Later packet, owner Operator.
Status: Planned in 023 phase 002. Risk and mitigation: 9 of 14 skill nodes are embedded and
the five without a vector include mcp-tooling and system-deep-loop, so the lane has no data for
the hubs that miss most even if its weight rises. The research phase settles weight and coverage
together rather than one at a time.

**A validator that reads the document, not only its registries:** needed before the next
packet closes on a green run, owner `system-spec-kit`. Status: Planned, register row 44. Risk
and mitigation: until the placeholder rule counts what `check-placeholders.sh` counts, run the
checker by hand beside the validator before any completion claim.
<!-- /ANCHOR:dependencies -->
