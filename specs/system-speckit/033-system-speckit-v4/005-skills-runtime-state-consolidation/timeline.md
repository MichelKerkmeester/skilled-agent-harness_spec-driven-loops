---
title: "Timeline: skills-root state consolidation"
description: "Chronological record of the relocation, including the tooling that returned false results and the stale daemon that recreated an old directory."
trigger_phrases:
  - "state consolidation timeline"
  - "skills state chronology"
  - "relocation events"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: timeline | v2.2 -->
# Timeline: skills-root state consolidation

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> Tracks the relocation from ownership discovery to a green gate, including two false starts.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Subject:** skills-root state consolidation
**Status:** Complete
**Started:** 2026-08-28
**Last updated:** 2026-08-28
**Owner:** Operator
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:timeline -->
## 2. TIMELINE

List events in order. For each, give the date, what happened, then what it led to. Use prose, not a table.

**2026-08-28:** Operator asked whether the seven state directories could move under a `.state` subfolder, noting it would touch many plugins and hooks. Outcome: scoped as a question first, with read-only recon before any change.

**2026-08-28:** First ownership scan reported zero code references. Outcome: disbelieved and re-run. The `grep` and `rg` in this environment are wrapped shell functions returning false zeros; a Python scan found 56 referencing files, of which about eight were owning constants.

**2026-08-28:** Operator chose a new packet and state regeneration over migration. Outcome: no migration code needed; only the seven tracked READMEs would move.

**2026-08-28:** Rewrite dry-run reviewed, then applied to 72 files. Outcome: seven READMEs moved as renames, thirty untracked runtime files discarded, residual scan clean.

**2026-08-28:** Three build packages rebuilt from source. Outcome: zero old-path references in any build output.

**2026-08-28:** Test gate reported two failures in the spec-gate fail-open suite. Outcome: root cause was fixtures hardcoding the directory depth, not the relocation; both now derive the parent from the resolver.

**2026-08-28:** An old directory reappeared minutes after deletion. Outcome: diagnosed as advisor daemons started the previous day holding the pre-change resolver in memory, confirmed by process start times against file mtimes. Not a missed reference.

**2026-08-28:** The first `.gitignore` shape silently untracked all seven READMEs. Outcome: git cannot re-include a file under an excluded directory; the rule now matches one level inside, verified in both directions.

**2026-08-28:** `git add -A` swept in 341 files from another session mid-operation on `sk-prompt`. Outcome: index reset, staging redone by explicit pathspec, three concurrent sessions' changes identified and excluded.
<!-- /ANCHOR:timeline -->

---

<!-- ANCHOR:milestones -->
## 3. MILESTONES

**Ownership established:** target 2026-08-28. Status: Done. Evidence: seven directories, seven owning resolvers, four subsystems.

**Relocation applied:** target 2026-08-28. Status: Done. Evidence: residual scan returns zero; seven READMEs recorded as renames.

**Runtime verified:** target 2026-08-28. Status: Done. Evidence: the advisor wrote into `.state/advisor/`; no old directory recreated by current code.

**Gate green:** target 2026-08-28. Status: Done. Evidence: 750 node tests and 101 vitest pass, zero failures; link guard zero broken.

**Daemons restarted:** target operator action. Status: Planned. Evidence: pending; a pre-change daemon was observed recreating an old directory.
<!-- /ANCHOR:milestones -->
