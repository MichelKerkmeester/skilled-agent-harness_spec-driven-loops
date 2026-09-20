---
title: "Roadmap: Rework four external UI-design skills into one standalone sk-design skill"
description: "Forward plan for the skill after its first release: confirm routing, then decide whether to score its benchmark corpus and whether further source categories deserve a home."
trigger_phrases:
  - "sk-design skill roadmap"
  - "design skill next steps"
  - "benchmark the sk-design skill"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: roadmap | v2.2 -->
# Roadmap: Rework four external UI-design skills into one standalone sk-design skill

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> Plans what happens to the skill between shipping and its first measured run.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Subject:** `sk-design` after v1.0.0.0
**Status:** Active
**Horizon:** from 2026-08-28 until the first benchmark run
**Owner:** Operator
**Last updated:** 2026-08-28
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:now-next-later -->
## 2. PHASES: NOW / NEXT / LATER

**Now:** Done. Focus: confirm routing, close every open note, and resolve the cross-source and cross-skill conflicts. Exit signal: reached — routing probed across all ten intents, both open questions answered, and the sibling skill reconciled on its own side.

**Next:** Planned. Focus: use the skill on real UI work and record where its guidance was wrong, missing, or lost an argument against a project's own system. Exit signal: enough observations to justify either a v1.1 revision or a decision that none is needed.

**Later:** Planned. Focus: score the manual-testing corpus once there are real failure modes to score against, and revisit the two intents where `sk-code` outranks this skill. Exit signal: a benchmark run in `benchmark/reports/`, and a decision on whether the routing second-place is worth changing.
<!-- /ANCHOR:now-next-later -->

---

<!-- ANCHOR:milestones-targets -->
## 3. MILESTONES & TARGETS

**Routing confirmed:** phase Now, target 2026-08-28. Status: Done. Evidence: advisor output for ten prompts covering every routed intent.

**Unused categories decided:** phase Now, target 2026-08-28. Status: Done. Evidence: five imported, one partly absorbed, six declined with a reason each in the changelog's coverage table.

**First real use:** phase Next, target the next UI task in this repo. Status: Planned. Evidence: the values the skill produced and whether they held.

**Benchmark run:** phase Later, target after several real uses. Status: Planned. Evidence: a dated folder in `benchmark/reports/` scoring the playbook corpus.
<!-- /ANCHOR:milestones-targets -->

---

<!-- ANCHOR:dependencies -->
## 4. DEPENDENCIES

**Skill advisor daemon:** needed by Routing confirmed, owner Operator. Status: Ready. Risk and mitigation: the daemon-backed CLI timed out during reindexing, so the probe ran through the Python advisor against the same skill graph. Both read the same metadata, so the result stands.

**Real UI work in this repo:** needed by First real use, owner Operator. Status: Open. Risk and mitigation: if no UI task arrives, the skill stays unexercised. Running the playbook corpus deliberately is the fallback.

**`sk-design-md-generator` stability:** needed by the boundary statement, owner Operator. Status: Ready. Risk and mitigation: if that skill's design-knowledge layer changes, the documented type-ratio tension may move. The tension names the exact file, so a later check is cheap.
<!-- /ANCHOR:dependencies -->
