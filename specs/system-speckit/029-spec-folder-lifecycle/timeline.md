---
title: "Timeline: spec-folder-lifecycle"
description: "Chronology of root resolution, spec folder location, tooling, and write recipe changes."
trigger_phrases:
  - "canonical spec root timeline"
  - "spec folder tooling timeline"
  - "packet root resolution chronology"
  - "spec authoring recipe chronology"
importance_tier: "normal"
contextType: "general"
---
# Timeline: spec-folder-lifecycle

<!-- SPECKIT_TEMPLATE_SOURCE: timeline | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Tracks the dated work and outcomes for spec-root resolution, folder tooling, and authoring checks.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
**Subject:** Spec folder lifecycle: root, location, tooling and write recipe
**Status:** In Progress
**Started:** 2026-08-07
**Last updated:** 2026-10-30
**Owner:** regenerated from git log over each child's current and former paths
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:timeline -->
## 2. TIMELINE
**2026-08-07:** `001-spec-root-resolution-hardening` (was `029-spec-root-resolution-hardening`) started; 10 commits, 5 nested phases. Outcome: Deliver a regression-safe, data-before-writers rollout that unifies resolution on canonical-first, canonicalizes every automatic writer, normalizes readers, and retires the alias, proven with and without the symlink. Status Planned; last commit 2026-10-03. Key commits: `0ba706ba54`, `72d95664bb`, `03526f8f6f`.

**2026-08-07:** `002-relocate-specs-folder` (was `032-relocate-specs-folder`) started; 35 commits, 6 nested phases. Outcome: The six child phases researched, planned, executed, and checked the topology change, verified the Memory MCP reindex, audited the READMEs, and found no confirmed defect in the duplicate-row investigation. Status Complete — all 6 phases closed, T015 operator review confirmed 2026-08-08; last commit 2026-10-09. Key commits: `b8c2f5ff40`, `0ba706ba54`, `26f87c13c3`.

**2026-10-06:** `003-spec-folder-tooling` (was `034-spec-folder-tooling`) started; 61 commits, 21 nested phases. Outcome: Make `create.sh`, `archive.sh` and the track root lists agree with the tree: new packets are written under the canonical specs root, numbers count from the highest number in use, track-root children match packets on disk, and archive and restore keep packets inside their track or parent. Status Complete; last commit 2026-10-18. Key commits: `be234e6f94`, `98c7465b23`, `b30cc174a3`.

**2026-10-06:** `004-write-recipe-fixes` (was `041-write-recipe-fixes`) started; 9 commits, 6 nested phases. Outcome: Correct each recipe line so that following it literally produces a passing commit, with the right backfill argument, a commit step that matches the hook, workspace guidance that defers to sk-git, and post-checks that inspect the staged set. Status Complete; last commit 2026-10-30. Key commits: `4411b9da8a`, `14cd9aabcf`, `72001d694f`.
<!-- /ANCHOR:timeline -->

---

<!-- ANCHOR:milestones -->
## 3. MILESTONES
**Spec Root Resolution Hardening:** target 2026-10-03. Status: In Progress. Evidence: `001-spec-root-resolution-hardening/`.

**Relocate Specs Folder:** target 2026-10-09. Status: Done. Evidence: `002-relocate-specs-folder/`.

**Spec folder tooling: canonical root, numbering, track roots and archive:** target 2026-10-18. Status: Done. Evidence: `003-spec-folder-tooling/`.

**Write recipe fixes: backfill flag, commit step, workspace bullet, post-checks and verification gate:** target 2026-10-30. Status: Done. Evidence: `004-write-recipe-fixes/`.
<!-- /ANCHOR:milestones -->
