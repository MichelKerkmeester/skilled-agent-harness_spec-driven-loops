---
title: "Deep Research Strategy - GLM lineage - 036 drift census"
description: "Persistent research plan for the GLM detached fan-out lineage censusing drift across the 15 implementation phases (003-017) of packet 036-deep-loop-innovation against HEAD 739b85ac57, baseline 0ce43ff589."
trigger_phrases:
  - "036 drift census glm lineage"
  - "glm lineage strategy"
  - "drift census plan"
importance_tier: important
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - GLM Lineage

Session: `fanout-glm-1784463720850-qpa2w1`. Detached fan-out lineage over packet `036-deep-loop-innovation/018-drift-census-and-plan-revalidation`. This file is the persistent brain for the GLM lineage only; the SOL lineage keeps its own.

## 1. TOPIC

Drift census over packet `036-deep-loop-innovation`. The program authored 445 planning docs across 17 phases against a tree frozen at baseline `0ce43ff589` (2026-07-16) and has never executed. Since baseline, 205 commits landed on `skilled/v4.0.0.0` (183 AI-co-authored, 25 inside `.opencode/skills/system-deep-loop`). Pin HEAD at `739b85ac57` (current at init) so every verdict is stated against a known tree state.

Return a per-phase verdict for phases 003-017 (the 15 implementation phases), each verdict carrying a commit SHA and `path:line` evidence; no phase may be "unknown". Separate FIRST-ORDER drift (path no longer resolves) from SECOND-ORDER drift (path resolves but premise is false).

## 2. SCOPE OF THIS LINEAGE

The GLM lineage and SOL lineage both census all 15 phases independently. They may partition effort or duplicate it; reconciliation is the parent's job, not this lineage's. The GLM lineage's job is to produce a complete, evidence-backed verdict for every phase, and to resolve the two named open questions.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] [Q-001] What does the commit range `0ce43ff589..739b85ac57` actually touch, broken down by phase surface? (Triage pass.) **ANSWERED iter 1**: 205/25 commits, per-phase hit-list in iteration-001.md F1.3.
- [x] [Q-002] **Phase 003 drift?** POSITIVE CONTROL: do the two runtime reference files phase 003 names still resolve, and does its `behavior_benchmark/` glob still match dirs? **ANSWERED iter 1**: first-order drift reproduced; cc77a1e550a renamed all three; kebab siblings exist and preserve content; phase 003 verdict = needs refinement.
- [x] [Q-003] **Phases 004-006 drift?** Do the architecture/transition, fanout-unblock, and fanout fan-in paths phase plans name still resolve, and have any premises shifted? **ANSWERED iter 3**: all three still valid. Phases 004 + 006 = zero drift (negative-control candidates). Phase 005 = paths resolve, premise intact, deliverables unshipped (still needed).
- [x] [Q-004] **Phases 007-009 drift?** Do named scripts, registries, and event shapes still exist? **ANSWERED iter 4**: all three still valid. Phase 007 zero drift (negative-control candidate; iter 1 over-cautious). Phase 008 zero drift. Phase 009 zero drift; flat-pool-vs-wave guard still TRUE; deliverables unshipped.
- [x] [Q-005] **Phases 010-012 drift?** Have any taxonomy or routing-default premises flipped? **ANSWERED iter 5**: Phase 010 still valid (zero drift). Phase 011 still valid (zero drift; anchor intact). Phase 012 needs refinement (HIGH risk materialized as second-order; shared mode boundary grew by 5 components since baseline: resourceContractVersion, defaultMode null, signal restrictions, smart_routing.md, leaf-manifest.json).
- [x] [Q-006] **Phase 013 + OPEN QUESTION A:** Did `6cd8ab14e4e` / `708d25acf04` / `908efde8d8f` change the registered-mode count that phase 013's eight workstreams assume? **ANSWERED iter 2**: NO — count unchanged at 7 routing modes (8 = 7 routing + 1 shared backbone). Real second-order drift on defaults/signals; verdict = needs refinement.
- [x] [Q-007] **Phases 014-015 drift?** Are the named writer paths and shadow-rollback bridges still the ones in tree? **ANSWERED iter 6**: both still valid. Phase 014 zero drift (transitive second-order from phase 013 bounded to test fixtures). Phase 015 zero drift in plan; transitive dependency on phase-003 path refinement documented (execution readiness waits on phase-003, but phase-015 plan is well-formed).
- [x] [Q-008] **Phase 016-017 + OPEN QUESTION B:** Whole-system gate, drift-handling phase 017, and does the `packet-033` benchmark dependency survive its renumber? **ANSWERED iter 7**: Phase 016 still valid (transitive on phase-003 refinement). Phase 017 still valid (its charter is executing now). OPEN QUESTION B resolved: dependency SURVIVES (z_archive/027 has full content), but phase 003 MUST rebase "Packet 033" reference to z_archive/027 — additional first-order drift missed by iter 1, attributable to `7f3216fc502` (renumber commit, 12.5h after baseline, in census range).
- [x] [Q-009] NEGATIVE CONTROL: at least one phase must come back genuinely clean. **ANSWERED iter 7**: phase 004 locked as negative control (zero drift, no runtime citations, no transitive deps on drifted phases).
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Repairing drift. This lineage returns verdicts and evidence only; no edits to phases 003-017 or to runtime files.
- Re-running the 001/002 research. Frozen read-only inputs.
- Executing any implementation phase.
- Reconciling with the SOL lineage. That is the parent's job after both complete.
- Cataloguing the ~350 broken phase-number references already tracked as a separate defect class.

## 5. STOP CONDITIONS

- All 15 phases carry an explicit verdict backed by SHA + path:line OR an explicit "no drift found, surfaces checked" statement, AND both open questions (A: mode-count, B: packet-033 renumber) are answered.
- OR `maxIterations` (10) is reached.
- OR three consecutive iterations produce no new evidence (stuck threshold).

Hard floor: do not stop before iteration 3 (`antiConvergence.minIterations`).

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- **Q-001** (iter 1) 205 commits in range (25 in system-deep-loop), per-phase hit-list produced.
- **Q-002** (iter 1) Phase 003 first-order drift reproduced: `state_format.md`→`state-format.md`, `integration_points.md`→`integration-points.md`, `behavior_benchmark/`→`behavior-benchmark/` (6 dirs). Attribution: `cc77a1e550a`. Content preserved by rename. Verdict: **needs refinement** (path fixup only).
- **Q-006** (iter 2) Phase 013 + open question A: mode count UNCHANGED at 7 routing + 1 backbone. Second-order drift on `defaultMode` (research→null), `hub-identity` (dropped from all 7 modes), and `model-benchmark`/`skill-benchmark` signals (now command-bridge-only). Verdict: **needs refinement** (test/gold refresh, not migration-substrate redesign).
- **Q-003** (iter 3) Phases 004-006: all three still valid. Phase 004 zero drift (negative-control candidate). Phase 005 paths resolve, premise intact (cli-codex argv starts with `exec`), deliverables unshipped. Phase 006 zero drift (negative-control candidate).
- **Q-004** (iter 4) Phases 007-009: all three still valid. Phase 007 zero drift (negative-control candidate; iter 1's "low-medium" risk rating was over-cautious — typed-pair series touches the harness, not the shared services). Phase 008 zero drift. Phase 009 zero drift; flat-pool-vs-wave guard still TRUE at `fanout-run.cjs:331-334`; deliverables unshipped.
- **Q-005** (iter 5) Phases 010-012: 010 still valid (zero drift). 011 still valid (zero drift; council/convergence.cjs anchor intact). 012 needs refinement (HIGH risk materialized as second-order; shared mode boundary grew by 5 components: resourceContractVersion, defaultMode null, signal restrictions, smart_routing.md, leaf-manifest.json).
- **Q-007** (iter 6) Phases 014-015: both still valid. Phase 014 zero drift (transitive second-order from phase 013 bounded to test fixtures). Phase 015 zero drift in plan; transitive dependency on phase-003 path refinement documented (execution readiness waits on phase-003, plan well-formed).
- **Q-008** (iter 7) Phases 016-017 + OPEN QUESTION B: Phase 016 still valid (transitive on phase-003 refinement; `72c36121201` touches skill-benchmark harness not whole-system gate). Phase 017 still valid (its drift-handling charter is what's executing now). OPEN QUESTION B resolved: dependency SURVIVES (`z_archive/027` has full content) but phase 003 MUST rebase "Packet 033" reference to `z_archive/027-deep-loop-behavior-benchmarks` — additional first-order drift missed by iter 1, attributable to `7f3216fc502` (renumber commit, 12.5h after baseline, in census range, outside runtime subtree but inside scope).
- **Q-009** (iter 7) Negative control: phase 004 locked (zero drift, no runtime citations, no transitive deps on drifted phases; cleanest of three zero-drift candidates 004/006/007).
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- `git cat-file -e <sha>:<path>` (iter 1): cleanly distinguishes "absent at baseline" vs "absent at HEAD"; exactly the positive-control test the spec demands.
- Treating `cc77a1e550a` as a first-class "kebab drift engine" (iter 1): every snake_case path a phase cites becomes a candidate first-order hit without per-path archaeology.
- Pinning HEAD before counting commits (iter 1): explained the 204→205 discrepancy and froze the verdict anchor.
- Reading commit bodies BEFORE judging impact (iter 2): `908efde8d8f`, `6cd8ab14e4e`, `708d25acf04` each state their effect in plain language — collapsed the second-order analysis without inference.
- Decomposing "eight modes" into 7 routing + 1 backbone (iter 2): explained why `mode-registry.json` has 7 entries while phase 013 plans 8 children.
- Grepping phase plans for the changed concept (`defaultMode`, `hub-identity`, `/deep:`) and getting zero hits (iter 2): confines second-order drift to tests/gold, away from the migration substrate.
- Grepping for the deliverable keywords (`liveTools`, `webSearch`, `invocationFingerprint`) (iter 3): zero-hit result is positive evidence the phase is still needed, not just unchanged.
- Reading `739b85ac57`'s commit body before assuming "the commit named in a phase's bucket must have shipped that phase" (iter 3): the commit is a 17-line orthogonal fix, not phase 005's implementation.
- Treating iter 1's per-phase risk ratings as hypotheses to confirm, not conclusions (iter 4): phase 007's "low-medium" rating from the skill-benchmark typed-pair series did not materialize — the series touches the harness, not the shared services.
- Reading `fanout-run.cjs:331-334` to verify phase 009's premise semantics (iter 4): the rejection strings match the phase's stated assumption word-for-word.
- Inventing the boundary-component comparison table for phase 012 (iter 5): turned a vague "phase 012 depends on routing" intuition into a 5-row enumeration each tied to a specific commit. Made the refinement recommendation concrete.
- Distinguishing "claim continuity" (phase 010 concept) from "session continuity" (the renamed docs) (iter 5): protected phase 010 from a keyword-driven false-positive.
- Distinguishing transitive dependency from drift class for phase 015 (iter 6): protected phase 015 from inheriting phase 003's first-order drift verdict while still documenting that phase-015 execution readiness waits on phase-003 refinement.
- `git merge-base --is-ancestor <renumber-commit> <baseline>` (iter 7): definitively placed the renumber commit AFTER baseline without timestamp arithmetic. Used to resolve OPEN QUESTION B.
- Searching phase 003's spec.md for the LITERAL STRING "033" before assuming iter 1 had caught every drift instance (iter 7): iter 1 caught kebab renames but missed the packet-033 → z_archive/027 number-rebind drift — a different drift class on the same phase.
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Code graph for structural symbol resolution (iter 1): empty at init (`freshness=empty`, 0 nodes). Switched to Grep + `git show`. Code graph unavailable for this census.
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach has been tried from multiple angles without success]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Trust the spec's commit counts (204/22): live range at pinned HEAD is 205/25; spec snapshot drifted post-authoring. (iter 1)
- Conflate `modes` count in mode-registry.json with phase 013's eight workstreams: registry counts routing identities (7); phase 013's 8 = 7 routing + 1 shared backbone. (iter 2)
- Treat the defaultMode flip as first-order drift: no phase-013 path fails to resolve; it's a behavior change, not a path break. (iter 2)
- Mark phase 005 needs-refinement because `739b85ac57` touched `fanout-run.cjs`: the commit is a 17-line dispatch-env fix orthogonal to phase 005 scope; phase 005 deliverables unshipped. (iter 3)
- Carry iter 1's "low-medium" risk rating for phase 007 into a "needs refinement" verdict: the typed-pair series touches the skill-benchmark harness (phase 016/003 surface), not phase 007's shared services. (iter 4)
- Treat phase 012 as invalidated because the routing commits changed `mode-registry.json` and `hub-router.json`: phase 012's spec doesn't pin the boundary state; it freezes whatever the current boundary is. The work is still well-formed; only its scope expands. (iter 5)
- Mark phase 015 needs-refinement because phase 003 has first-order drift and phase 015 depends on phase 003: phase 015's own plan and citations resolve cleanly; transitive dependency is execution-readiness, not a phase-015 plan defect. (iter 6)
- Treat iter 1's phase-003 verdict as final: iter 1 caught kebab renames but missed the packet-033 → z_archive/027 number-rebind drift (different drift class, same phase). (iter 7)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[Self-owned open questions from iteration write-back]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Iteration 8 / Synthesis: all 15 phase verdicts locked, both open questions resolved, positive control reproduced, negative control locked. Proceed to `phase_synthesis` and compile `research/research.md` with the per-phase verdict table.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- **Source pointers (parent packet):** `.opencode/specs/system-deep-loop/036-deep-loop-innovation/{001..017}/` hold the 15 implementation phase plans (001/002 are read-only research inputs).
- **Target runtime:** `.opencode/skills/system-deep-loop/**` is the substrate every phase modifies; 25 commits since baseline touch it.
- **Baseline SHA:** `0ce43ff589` (2026-07-16), the merge that landed the normalized 036 packet on v4.
- **HEAD at init:** `739b85ac57` ("fix(deep-loop): unblock cli-opencode fan-out lineage dispatch").
- **Range size:** 205 commits (`git log --oneline 0ce43ff589..739b85ac57 | wc -l`).
- **Confirmed positive control (from spec SC-002):** `cc77a1e550a` "refactor(sk-doc): migrate filesystem names to kebab-case (020, squashed)" renamed the two runtime reference files phase 003 names as starting points; phase 003's `behavior_benchmark/` glob now matches zero dirs.
- **Open question A (mode count):** commits `6cd8ab14e4e` ("correct mode routing + reconcile stale route gold"), `708d25acf04` ("implement typed-pair routing surface + manifest + gold"), `908efde8d8f` ("flip four hubs to defaultMode null + fix sk-design over-emission") all touched routing after the plan froze. Phase 013's eight workstreams assume a specific registered-mode count.
- **Open question B (packet-033):** the 003 baseline and 016 gate depend on the behavior-benchmark harness; "packet-033" has been renumbered. Question: does the dependency survive the renumber, or must 003 rebase onto `z_archive/027-deep-loop-behavior-benchmarks`?
- **Other large migrations in range:** `e540db3d687` (sk-design snake_case -> hyphen-case), `9111d6c1e24` (mcp-tooling kebab-complete 3 new packets), `9259c23e313` (rename goal_opencode -> goal-opencode), plus several `skill-benchmark` typed-pair series commits.
- **Reusable tooling:** `git log`, `git show`, `git diff`, `rg`/Grep, Glob, Read. Code graph is empty at init (`status=ok; freshness=empty`), so structural queries are unavailable; use Grep + Read for symbol resolution.
- **Constraints:** This lineage writes ONLY inside `.opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/glm/`. No edits to phases 003-017 or to runtime files. No sub-agent dispatch (LEAF constraint). Resource map is NOT present in this folder; `resource_map_present=false`, coverage gate skipped.

### Resource-Map Integration

`resource-map.md` is NOT present in this spec folder; `resource_map_present=false`. Coverage gate is skipped per state-outputs.md §6.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05 (newInfoRatio)
- Per-iteration budget: 12 tool calls, 15 minutes
- Progressive synthesis: true (research.md updated as findings accumulate)
- Stop policy: convergence (legal stop OR max iterations, whichever first)
- Min iterations floor: 3
- HEAD pin: `739b85ac57`
- Allowed write paths: only `.opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/glm/**`
- Banned operations: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, output-redirect truncate against any file outside the allowed-write list.
- Current generation: 1
- Started: 2026-07-19T14:26:00Z
