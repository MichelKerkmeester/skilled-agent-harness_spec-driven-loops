---
title: "Timeline: Phase 15: dsh-hook-parity"
description: "Order of work for DSH hook parity on 2026-11-06: probes, red tests, six adapters, the hook library move and the verification gates."
trigger_phrases:
  - "dsh hook parity timeline"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: timeline | v2.2 -->
# Timeline: Phase 15: dsh-hook-parity

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> The order in which DSH reached hook parity with OpenCode and Pi, and what each step proved.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Subject:** DSH hook and plugin parity, the interactive and leaf split and the hook library layout
**Status:** Complete
**Started:** 2026-11-06
**Last updated:** 2026-11-06
**Owner:** Implementing agent under the operator's dispatch brief
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:timeline -->
## 2. TIMELINE

**2026-11-06:** The concern inventory found four deferred Pi concerns, the advisor switched off and no goal surface. Outcome: the parity table in `spec.md` section 12, 30 rows.

**2026-11-06:** A lineage patch that overrode the `repo-guards` row printed `patch: entry "repo-guards" not found`. Outcome: the leaf marker plugin read at event time (ADR-001).

**2026-11-06:** Six new suites were written first and failed on their missing modules. Outcome: `evidence/tests-red.txt`.

**2026-11-06:** The six adapters, the sweep and the advisor split landed. Outcome: the bundle suite passed and the sweep's frame walker matched `zstd -dc` line for line (`evidence/sweep-frame-walker.txt`).

**2026-11-06:** The operator asked for the layout every other runtime uses. Outcome: every adapter moved into the hook library with relative links back, and the `dsh-adapters` mirror tree joined `/doctor:runtime-mirrors` (ADR-004).

**2026-11-06:** Keyless boots of both compositions and a live run of `/goal-dsh` against the real manage CLI. Outcome: the interactive boot showed the advisor, the worktree advisory and `dsh_goal`, the lineage boot showed none and every goal action returned `STATUS=OK`.

**2026-11-06:** The full gate set and strict recursive validation ran. Outcome: `evidence/gates-2026-11-06.txt` and `evidence/validate-strict-recursive.txt`.

**2026-11-06:** The operator asked for every reported drift item fixed. Outcome: five red tests, then the spec-gate source filter, the `dsh` advisor label, `tool-goal` off in leaves, DSH in the orphan sweeper and a DSH row in `/doctor:git setup` (`evidence/followup-fixes-2026-11-06.txt`, `evidence/leaf-goal-tools-off.txt`).
<!-- /ANCHOR:timeline -->

---

<!-- ANCHOR:milestones -->
## 3. MILESTONES

**M1 red tests recorded:** target Setup. Status: Done. Evidence: `evidence/tests-red.txt`.

**M2 adapters green:** target Implementation. Status: Done. Evidence: `evidence/gates-2026-11-06.txt` lines 6 to 8, 75 of 75.

**M3 layout parity:** target the layout move. Status: Done. Evidence: `evidence/gates-2026-11-06.txt` line 57, 243 mirrors across 10 trees.

**M4 drift closed:** target the follow-up. Status: Done. Evidence: `evidence/followup-fixes-2026-11-06.txt` lines 27 to 46.
<!-- /ANCHOR:milestones -->
