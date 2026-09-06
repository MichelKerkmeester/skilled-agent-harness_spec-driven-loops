---
title: "Roadmap: skills-root state consolidation"
description: "What remains after the relocation: restarting the pre-change daemons and deciding whether a standing guard should protect the new layout."
trigger_phrases:
  - "state consolidation roadmap"
  - "daemon restart follow-up"
  - "state path guard"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: roadmap | v2.2 -->
# Roadmap: skills-root state consolidation

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> Plans the short tail after the relocation lands.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Subject:** `.opencode/skills/.state/` after the relocation
**Status:** Active
**Horizon:** from 2026-08-28 until the daemons have cycled
**Owner:** Operator
**Last updated:** 2026-08-28
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:now-next-later -->
## 2. PHASES: NOW / NEXT / LATER

Write one block per phase. State the status, the focus, then the signal that closes the phase. Use prose, not a table.

**Now:** Done. Focus: relocate the seven directories, update every reference, and verify a real write lands in the new location. Exit signal: reached — residual scan clean, gate green, advisor observed writing under `.state/`.

**Next:** Planned. Focus: restart the long-lived daemons so nothing keeps writing pre-change paths from memory. Exit signal: no old directory reappears at the skills root over a normal working session.

**Later:** Planned. Focus: decide whether a standing check should fail the gate when any code writes a pre-`.state` path. Exit signal: either a guard lands, or a written decision that the residual scan plus untracked-directory visibility is sufficient.
<!-- /ANCHOR:now-next-later -->

---

<!-- ANCHOR:milestones-targets -->
## 3. MILESTONES & TARGETS

**Relocation complete:** phase Now, target 2026-08-28. Status: Done. Evidence: recorded per check in `tasks.md`.

**Daemons cycled:** phase Next, target the next restart. Status: Planned. Evidence: absence of a recreated directory at the skills root.

**Guard decision:** phase Later, target after the daemons have cycled. Status: Planned. Evidence: a guard check in the gate, or a note here recording why none is needed.
<!-- /ANCHOR:milestones-targets -->

---

<!-- ANCHOR:dependencies -->
## 4. DEPENDENCIES

**Daemon restart:** needed by Daemons cycled, owner Operator. Status: Open. Risk and mitigation: several long-lived advisor processes predate the change and hold the old resolver. Until they cycle they recreate an old directory; because those paths are no longer ignored the recurrence is visible rather than silent.

**Concurrent sessions:** needed by the commit, owner Operator. Status: Open. Risk and mitigation: three other sessions were active in this checkout during the work. Staging was done by explicit pathspec, so their changes stayed out; a later `git add -A` by anyone would re-introduce the problem.
<!-- /ANCHOR:dependencies -->
