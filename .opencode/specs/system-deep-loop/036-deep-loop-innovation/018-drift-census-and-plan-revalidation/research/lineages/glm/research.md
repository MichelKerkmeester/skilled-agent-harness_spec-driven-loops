---
title: "Drift Census over Packet 036-deep-loop-innovation - GLM Lineage Synthesis"
description: "GLM detached fan-out lineage synthesis: per-phase drift verdicts for the 15 implementation phases (003-017) of packet 036-deep-loop-innovation against pinned HEAD 739b85ac57, baseline 0ce43ff589. 205 commits in range, 25 in system-deep-loop. 12 still valid, 3 needs refinement, 0 invalidated. Both open questions resolved."
trigger_phrases:
  - "036 drift census glm synthesis"
  - "glm lineage verdict table"
  - "deep-loop plan revalidation glm"
importance_tier: critical
contextType: research
version: 1.0
_provenance:
  lineage: glm
  session_id: fanout-glm-1784463720850-qpa2w1
  executor: cli-opencode
  model: zai-coding-plan/glm-5.2
  pinned_head: 739b85ac57
  baseline_sha: 0ce43ff589
  total_iterations: 7
  total_questions: 9
  answered_questions: 9
  stop_reason: converged
---

# Drift Census over Packet 036-deep-loop-innovation — GLM Lineage Synthesis

> **Lineage note.** This is the GLM detached fan-out lineage's independent census. The SOL lineage runs its own census; the parent reconciles them. Disagreements between lineages, if any, surface in the parent's reconciliation step, not here.

---

## 1. EXECUTIVE SUMMARY

The packet-036 implementation program authored 445 planning documents across 17 phases against a tree state frozen on **2026-07-16 at baseline `0ce43ff589`**, and has never been executed. Since that baseline, **205 commits** have landed on `skilled/v4.0.0.0` (the spec said 204; the branch moved past spec authoring), 183 of them AI-co-authored, 25 of them inside `.opencode/skills/system-deep-loop/` (the spec said 22). This census pinned HEAD at **`739b85ac57`** and returned a per-phase verdict for every one of the 15 implementation phases (003-017).

**Headline:** the program is not invalidated anywhere. **12 phases are still valid**, **3 need refinement** (003, 012, 013), **0 are invalidated**. Both open questions are resolved (mode count unchanged; packet-033 dependency survives the renumber but requires a reference rebase). The positive control (phase 003 path drift) reproduced independently. The negative control (phase 004) came back genuinely clean, proving the census discriminates.

| Verdict | Count | Phases |
|---------|-------|--------|
| Still valid | 12 | 004, 005, 006, 007, 008, 009, 010, 011, 014, 015, 016, 017 |
| Needs refinement | 3 | 003, 012, 013 |
| Invalidated | 0 | — |

The three "needs refinement" verdicts split cleanly across the two drift classes defined in the spec:

- **Phase 003 (FIRST-ORDER, two engines):** `cc77a1e550a` (kebab migration) renamed the two runtime reference files phase 003 cites as starting points (`state_format.md`, `integration_points.md`) and the `behavior_benchmark/` glob (now `behavior-benchmark/`). AND `7f3216fc502` (renumber commit, 12.5 hours after baseline, in census range, OUTSIDE the runtime subtree but inside the census scope) rebound the number "033" — phase 003's `003/spec.md:57,119` "Packet 033" reference now points at `033-post-sync-verification-fixes` (a different packet); the behavior-benchmarks packet moved to `z_archive/027-deep-loop-behavior-benchmarks`.
- **Phase 012 (SECOND-ORDER):** the shared mode boundary phase 012 must freeze grew by 5 components since baseline (`resourceContractVersion`, `defaultMode: null`, signal restrictions on model/skill-benchmark, `shared/references/smart_routing.md`, `leaf-manifest.json`). The work is still well-formed; only its scope expands.
- **Phase 013 (SECOND-ORDER):** the registered-mode count is UNCHANGED at 7 routing modes (8 workstreams = 7 routing + 1 shared backbone `deep-improvement-common`). But `defaultMode` flipped `research → null`, `hub-identity` was dropped from all 7 modes, and `model-benchmark`/`skill-benchmark` signals were restricted to command-bridge-only. The mode-migration substrate is unaffected; route-gold fixtures and shadow-parity tests need refresh.

---

## 2. PER-PHASE VERDICT TABLE (SC-001)

Every one of the 15 phases carries an explicit verdict backed by either a commit SHA + `path:line` or an explicit "no drift found, surfaces checked" statement (REQ-001, REQ-002). No phase is left "unknown".

| Phase | Verdict | Drift class | Drift engine (commit) | Evidence anchor |
|-------|---------|-------------|------------------------|-----------------|
| **003** baseline-taxonomy-and-state-census | **needs refinement** | FIRST-ORDER (two engines) | `cc77a1e550a` (kebab migration) + `7f3216fc502` (renumber) | `003/plan.md:81,82`; `003/spec.md:93,144`; `003/plan.md:153`; `003/spec.md:57,119` |
| **004** architecture-coverage-and-transition-contract | **still valid** | NO DRIFT (NEGATIVE CONTROL) | — | surfaces checked: `004/spec.md`, all 3 children resolve; zero `runtime/` citations; no commits in range touch its surfaces; no transitive deps on drifted phases |
| **005** fanout-live-tools-unblock | **still valid** | NO DRIFT | `739b85ac57` orthogonal (17-line dispatch-env fix) | all 5 cited paths resolve; `fanout-run.cjs:1390` confirms premise (`args=['exec',...]`); deliverables (`liveTools`, `webSearch`, `invocationFingerprint`) unshipped |
| **006** transition-authorized-ledger-core | **still valid** | NO DRIFT | — | surfaces checked: `006/spec.md:48,54`; cited paths resolve; dark substrate untouched by routing commits |
| **007** shared-evidence-and-control-services | **still valid** | NO DRIFT | — | surfaces checked: `007/spec.md:52,54`; all 7 children resolve; skill-benchmark typed-pair series touches harness not shared services |
| **008** compatibility-shadow-and-rollback-bridge | **still valid** | NO DRIFT | — | surfaces checked: `008/spec.md:46,52,54`; all 5 cited paths resolve; scope untouched by routing commits; authority stays at phase 014 |
| **009** fanout-fanin-durable-orchestration | **still valid** | NO DRIFT | `739b85ac57` + `9259c23e313` (both orthogonal) | cited paths resolve; `fanout-run.cjs:331-334` confirms premise (`FLAT_POOL_ASSIGNMENT_MODEL` + `WAVE_*_REJECTION` strings); deliverables unshipped |
| **010** novelty-claims-continuity-and-projections | **still valid** | NO DRIFT | — | surfaces checked: `010/spec.md:54,56`; `002-.../research/research-modes.md` resolves; "claim continuity" concept is distinct from "session continuity" doc renames |
| **011** convergence-termination-and-health | **still valid** | NO DRIFT | — | surfaces checked: `011/spec.md:52,54`; `runtime/lib/council/convergence.cjs` resolves (already kebab-safe, not renamed); convergence scope untouched by routing commits |
| **012** shared-mode-contracts-and-fixtures | **needs refinement** | SECOND-ORDER | `708d25acf04` + `908efde8d8f` + `6cd8ab14e4e` | `mode-registry.json:resourceContractVersion` (added); `hub-router.json:defaultMode` (research→null); `hub-router.json:routerSignals.{model-benchmark,skill-benchmark}.classes` (restricted); `shared/references/smart_routing.md` (new); `leaf-manifest.json` (new) |
| **013** mode-and-lane-migrations | **needs refinement** | SECOND-ORDER | `908efde8d8f` + `6cd8ab14e4e` + `708d25acf04` | `hub-router.json:defaultMode` (research→null); `hub-router.json:routerSignals` `hub-identity` dropped from all 7 modes; `model-benchmark`+`skill-benchmark` signals command-bridge-only. **Mode count UNCHANGED** (OPEN QUESTION A) |
| **014** staged-state-migration-and-authority-cutover | **still valid** | NO DRIFT (transitive second-order from phase 013 bounded to test fixtures) | — | surfaces checked: `014/spec.md:46,52,54,56`; all 6 cited paths resolve; routing commits don't touch authority-cutover |
| **015** legacy-writer-retirement | **still valid** | NO DRIFT (transitive dependency on phase-003 refinement documented) | — | surfaces checked: `015/spec.md:50,52,58,60,79,116`; all cited paths resolve incl `013/008-deep-alignment`; zero snake_case citations; phase-015 plan well-formed, execution readiness waits on phase-003 refinement |
| **016** whole-system-gate | **still valid** | NO DRIFT (transitive dependency on phase-003 refinement documented) | `72c36121201` orthogonal (touches skill-benchmark harness not whole-system gate) | surfaces checked: `016/spec.md:59,68,88,100,115,135,151,164`; cites phase-003 baseline at 8 sites but not "Packet 033" directly |
| **017** integrate-latest-and-closeout | **still valid** | NO DRIFT | `1a5963e6b9d` + `71e18c224c3` (both reference-completion fixes) | surfaces checked: `017/spec.md:52,60,61,66,80,81,91`; the drift-handling charter is exactly what this census is executing (pulled forward as packet 018 per `018/spec.md:72`) |

---

## 3. POSITIVE CONTROL — REPRODUCED (SC-002)

The spec required this census to independently rediscover the confirmed phase-003 path drift. **Reproduced in iteration 1**, before reading any prior analysis file:

| Phase-003 cited path | Resolves at HEAD? | Kebab sibling resolves? | At baseline? | Attribution |
|----------------------|-------------------|-------------------------|--------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/references/state_format.md` (`003/plan.md:81`) | **NO** | `state-format.md` YES | snake_case PRESENT at baseline `0ce43ff589` | `cc77a1e550a` |
| `.opencode/skills/system-deep-loop/runtime/references/integration_points.md` (`003/plan.md:82`) | **NO** | `integration-points.md` YES | snake_case PRESENT at baseline | `cc77a1e550a` |
| `.opencode/skills/system-deep-loop/*/behavior_benchmark/` glob (`003/spec.md:93,144`; `003/plan.md:153`) | **0 dirs match** | `behavior-benchmark/` matches 6 dirs | snake_case PRESENT at baseline | `cc77a1e550a` |

All three first-order drift instances were found by resolving paths at HEAD with `git cat-file -e` and `find`. The new paths exist and the content was preserved verbatim through the rename — so the phase's investigation is still feasible with path fixup. The reproduction validates the census's positive control.

**Iteration 7 surfaced an ADDITIONAL first-order drift on phase 003** that iteration 1 had not caught (different drift class on the same phase):

| Phase-003 reference | Resolves at HEAD? | What it points to at HEAD | What it should point to | Attribution |
|---------------------|-------------------|---------------------------|-------------------------|-------------|
| "Packet 033" (`003/spec.md:57,119 REQ-007`) — "behavior evidence becomes an eight-workstream baseline" | AMBIGUOUS | `033-post-sync-verification-fixes` (different packet) | `z_archive/027-deep-loop-behavior-benchmarks` (where the behavior-evidence packet was relocated) | `7f3216fc502` (renumber commit, 12.5 hours after baseline) |

This second drift engine is NOT the kebab migration. It's a renumber commit that's INSIDE the census range (`0ce43ff589..739b85ac57`) but OUTSIDE the runtime subtree (touches `.opencode/specs/system-deep-loop/`, not `.opencode/skills/system-deep-loop/`). The census's scope explicitly includes such commits (`spec.md §3 In-Scope`: "the one confirmed drift hit to date originated outside the runtime").

---

## 4. NEGATIVE CONTROL — LOCKED (SC-002 partner)

The spec required at least one phase to come back genuinely clean, proving the census discriminates. Three phases qualified: **004**, **006**, **007**. **Phase 004 is locked as the negative control** as the cleanest:

- Zero `runtime/` path citations of any kind (its plan is pure architectural ADR work: `001-spine-architecture-adr`, `002-recommendation-ledger-bijective-map`, `003-transition-versioning-and-rollback-policy`).
- All intra-packet children resolve at HEAD.
- No commits in the census range touch its surfaces (architectural ADRs are stable decision records).
- No transitive dependencies on drifted phases (phase 004 produces the spine ADRs that OTHER phases depend on, not the other way).

A census that marked everything drifted would be non-discriminating; phase 004's clean verdict proves this census discriminates.

---

## 5. OPEN QUESTION A — RESOLVED (REGISTERED-MODE COUNT)

> Did `6cd8ab14e4e` / `708d25acf04` / `908efde8d8f` change the registered-mode count phase 013's eight workstreams assume?

**Resolution (iteration 2):** **NO. The count is UNCHANGED at 7 routing modes.**

At both baseline `0ce43ff589` and HEAD `739b85ac57`:
- `mode-registry.json` `modes` block: **7** entries (identical names).
- `hub-router.json` `routerSignals`: **7** keys (`agent-improvement`, `ai-council`, `alignment`, `model-benchmark`, `research`, `review`, `skill-benchmark`).
- `tieBreak` array: 7 entries (identical order).

Phase 013's "eight modes" decomposes as **7 routing modes + 1 shared backbone**. The shared backbone `deep-improvement-common` is reached internally by its three benchmark variants (agent/model/skill) and is NOT a routing identity in `mode-registry.json`. The decomposition is consistent at both baseline and HEAD.

The three routing commits changed DEFAULTS and SIGNAL RESTRICTIONS, not the count:

| Change | Commit | Old → New |
|--------|--------|-----------|
| `defaultMode` flip | `908efde8d8f` | `"research"` → `null` |
| `hub-identity` dropped from all 7 modes | `6cd8ab14e4e` | every mode carried `hub-identity` → none do |
| `model-benchmark` + `skill-benchmark` signal restriction | `6cd8ab14e4e` | bare advisor alias → command-bridge-only (`/deep:model-benchmark`, `/deep:skill-benchmark`) |
| typed-pair routing surface added | `708d25acf04` | (none) → `shared/references/smart_routing.md` + `leaf-manifest.json` + `resourceContractVersion` |

These are second-order drift on phase 013, not first-order. The migration substrate (typed-ledger schema, reducers, sealed artifacts — the per-mode children's actual work) is unaffected. The drift hits routing tests and route-gold fixtures, not the migration work itself.

---

## 6. OPEN QUESTION B — RESOLVED (PACKET-033 RENUMBER)

> Does the packet-033 benchmark dependency survive its renumber, or must 003 rebase onto `z_archive/027-deep-loop-behavior-benchmarks`?

**Resolution (iteration 7):** **The dependency SURVIVES; phase 003 MUST rebase its reference.**

The renumber commit `7f3216fc502` (2026-07-16 18:35:55, "refactor(system-deep-loop): compact archive to 001-029, renumber active to 030-036") is:
- **In the census range** (`git merge-base --is-ancestor 7f3216fc502 0ce43ff589` returns NON-ancestor).
- **12.5 hours AFTER baseline** (`0ce43ff589` is 2026-07-16 06:09:33).
- **Outside the runtime subtree** but inside the census scope (touches `.opencode/specs/system-deep-loop/`, the spec tree — the census scope explicitly covers the full commit range, not just `.opencode/skills/system-deep-loop/`).

The commit did two things:
1. Compacted the archive to `001-029`.
2. Renumbered active packets to `030-036`.

Effect on phase 003:
- The behavior-benchmarks packet that phase 003 calls "Packet 033" was relocated to `z_archive/027-deep-loop-behavior-benchmarks` (now archived, marked **Status: Complete**).
- The number "033" was reassigned to `033-post-sync-verification-fixes` — a completely different packet.

The **dependency survives**: `z_archive/027-deep-loop-behavior-benchmarks/spec.md` frontmatter and child scorecards confirm the 5-package behavior-benchmark framework is intact, with claude-cli baseline + GPT-5.5-fast medium/high comparisons, full scorecards, and implementation summaries. Phase 003's `REQ-007` ("Packet-033 behavior evidence becomes an eight-workstream baseline") can be satisfied by reading `z_archive/027`.

But the **number reference** in `003/spec.md:57,119` is now AMBIGUOUS. At HEAD, "packet 033" points to `post-sync-verification-fixes`. Phase 003 MUST rebase the reference to `z_archive/027-deep-loop-behavior-benchmarks`.

---

## 7. FIRST-ORDER vs SECOND-ORDER DRIFT (REQ-004)

The spec required first-order drift (path no longer resolves) be reported separately from second-order drift (path resolves but premise is now false).

### First-order drift instances (4 total, all on phase 003)

| # | Phase | Path / reference | Resolves at HEAD? | Kebab / renumber sibling | Attribution |
|---|-------|------------------|-------------------|--------------------------|-------------|
| 1 | 003 | `runtime/references/state_format.md` (`003/plan.md:81`) | NO | `state-format.md` resolves | `cc77a1e550a` |
| 2 | 003 | `runtime/references/integration_points.md` (`003/plan.md:82`) | NO | `integration-points.md` resolves | `cc77a1e550a` |
| 3 | 003 | `behavior_benchmark/` glob (`003/spec.md:93,144`; `003/plan.md:153`) | 0 dirs match | `behavior-benchmark/` matches 6 dirs | `cc77a1e550a` |
| 4 | 003 | "Packet 033" reference (`003/spec.md:57,119`) | AMBIGUOUS (points to wrong packet) | `z_archive/027-deep-loop-behavior-benchmarks` holds the actual content | `7f3216fc502` |

All four first-order drift instances are on the same phase (003). No other phase has first-order drift. This concentration is the positive-control evidence — the spec named phase 003 as the known-true drift target, and the census independently reproduced all four instances.

### Second-order drift instances (8 total, on phases 012 and 013)

| # | Phase | Premise now false | Replacement premise | Attribution |
|---|-------|-------------------|---------------------|-------------|
| 1 | 012 | "freeze a mode-registry.json without `resourceContractVersion`" | `resourceContractVersion: 1` is now part of the boundary | `708d25acf04` |
| 2 | 012 | "freeze a hub-router.json with `defaultMode: 'research'`" | `defaultMode: null` is now part of the boundary | `908efde8d8f` |
| 3 | 012 | "freeze signal restrictions allowing bare advisor alias for model/skill-benchmark" | command-bridge-only is now part of the boundary | `6cd8ab14e4e` |
| 4 | 012 | "freeze a boundary without `shared/references/smart_routing.md`" | `smart_routing.md` is now part of the boundary | `708d25acf04` |
| 5 | 012 | "freeze a boundary without `leaf-manifest.json`" | `leaf-manifest.json` is now part of the boundary | `708d25acf04` |
| 6 | 013 | "shadow-parity tests can assume `defaultMode: 'research'` for hub-generic prompts" | hub-generic prompts now defer to the routing helper | `908efde8d8f` |
| 7 | 013 | "shadow-parity tests can assume `hub-identity` fans out hub-generic prompts to all 7 modes" | hub-identity is dropped; hub-generic prompts no longer co-fire all modes | `6cd8ab14e4e` |
| 8 | 013 | "model-benchmark and skill-benchmark are reachable via bare advisor alias for shadow-parity" | they are reachable only via `/deep:model-benchmark` and `/deep:skill-benchmark` command bridge | `6cd8ab14e4e` |

Phase 012 absorbs 5 of the 8 second-order instances (its freeze scope grew). Phase 013 absorbs 3 (its test/gold fixtures need refresh). The two phases share the same three routing commits as their drift engines because phase 012 freezes the boundary phase 013 migrates onto.

---

## 8. KEY FINDINGS DEEP DIVE

### 8.1 The "Packet 033" rebind — drift outside the runtime subtree

The most consequential single finding is that **two different drift engines hit phase 003 from two different commit categories**. Iteration 1 caught the kebab migration (`cc77a1e550a`, which IS in `.opencode/skills/system-deep-loop/`'s commit count); iteration 7 caught the renumber (`7f3216fc502`, which is NOT in `.opencode/skills/system-deep-loop/`'s commit count — it touches `.opencode/specs/system-deep-loop/` instead). The spec's "22 system-deep-loop commits" header under-counts because it filters by skills path; the renumber lives in the specs path. The census's scope explicitly covers the full range, so the renumber was always in scope — but a triage that filtered to `-- .opencode/skills/system-deep-loop` would have missed it.

The lesson generalizes: **drift engines need not be in the same subtree as the phase they hit**. The spec's warning ("the one confirmed drift hit to date originated outside the runtime") was a true positive indicator that this census honored.

### 8.2 Why the HIGH-risk phase 012 materialized while the HIGH-risk phase 013 stayed bounded

Both phases 012 and 013 were flagged HIGH risk in iteration 1's triage. Their materializations differed:

- **Phase 012 materialized fully** (5-component boundary expansion) because phase 012's job is to FREEZE the boundary. The boundary itself moved, so the freeze scope moved with it. Every routing commit added a component phase 012 must now include.
- **Phase 013 stayed bounded** because phase 013's job is to MIGRATE modes onto the typed-ledger substrate. The substrate didn't move; only the routing surface above it did. So phase 013's migration work is intact, and the drift is confined to its test/gold fixtures.

This distinction is the analytical move that made phase 013 a "needs refinement (low-impact)" rather than a "needs refinement (HIGH-impact)" verdict.

### 8.3 The "transitive dependency is not drift class" distinction

Three phases (015, 016, and — at a different level — 014) were protected from inheriting upstream drift verdicts by distinguishing **transitive dependency** from **drift class**:

- **Phase 015** depends on phase 003's census as its starting inventory. Phase 003 has first-order drift. But phase 015's OWN plan and citations resolve cleanly; its `003/spec.md` citation resolves. So phase 015 is "still valid" with a documented execution-readiness dependency on phase 003's refinement.
- **Phase 016** depends on phase 003's BASE as the comparison authority. Same pattern: phase 016's plan is well-formed; its execution waits on phase 003's refinement.
- **Phase 014** depends on phase 013's per-mode migrations. Phase 013 has second-order drift. But phase 014's cutover mechanics don't depend on routing defaults; only its test fixtures do. So phase 014 is "still valid" with transitive second-order bounded to test fixtures.

Without this distinction, the census would have over-counted drift by 3 phases (014, 015, 016 all marked needs-refinement by inheritance). The refinement work would have been mis-attributed.

---

## 9. RECOMMENDATIONS

The census produces verdicts; repair is out of scope (`018/spec.md §3 Out-of-Scope: Repairing the drift`). But the verdicts imply a clear, prioritized refinement sequence for whoever picks up the repair:

| Priority | Phase | Refinement work | Justification |
|----------|-------|-----------------|---------------|
| **P0** | 003 | Fix the three snake_case path citations (`state_format.md`, `integration_points.md`, `behavior_benchmark/` → kebab siblings) AND rebase the "Packet 033" reference to `z_archive/027-deep-loop-behavior-benchmarks`. Two drift engines, four first-order instances. | Phase 003 is the starting inventory phases 015 and 016 transitively depend on. Without 003 refined, neither 015 nor 016 can complete. |
| **P1** | 012 | Expand the freeze scope to include the 5 new boundary components: `resourceContractVersion`, `defaultMode: null`, signal restrictions, `smart_routing.md`, `leaf-manifest.json`. Update `003-mixed-version-fixtures` to span the larger delta. Add `smart_routing.md` and `leaf-manifest.json` to the `004-write-set-conflict-graph`. | Phase 012 freezes the boundary phase 013 migrates onto. Until 012's freeze covers the current boundary, phase 013 cannot safely start. |
| **P1** | 013 | Refresh route-gold fixtures and shadow-parity tests that asserted `defaultMode: 'research'`, `hub-identity` fan-out, or bare-advisor-alias entry for `model-benchmark`/`skill-benchmark`. Acknowledge command-bridge-only entry in mode-migration plans 006 and 007. | Phase 013's mode-migration substrate is intact; only its tests/gold need refresh. Bounded scope, low-complexity refinement. |
| (none) | 004, 005, 006, 007, 008, 009, 010, 011, 014, 015, 016, 017 | No refinement required. | All came back still valid. Phase 015 and 016 execution waits on phase 003 refinement, but the plans themselves are well-formed. |

**Sequencing constraint:** Phase 003 refinement must land BEFORE phase 015 or 016 can execute. Phase 012 freeze-scope expansion must land BEFORE phase 013 migrations start. Other sequences are flexible.

---

## 10. METHODOLOGY

### Range and HEAD pin
- Baseline: `0ce43ff589` (2026-07-16 06:09:33) — the merge that landed the normalized 036 packet on v4.
- HEAD pin: `739b85ac57` ("fix(deep-loop): unblock cli-opencode fan-out lineage dispatch", 2026-07-19 14:13:22) — recorded at init, every verdict stated against this SHA.
- Range: `git log --oneline 0ce43ff589..739b85ac57 | wc -l` = **205** total (195 non-merge).
- Runtime subset: `git log --oneline 0ce43ff589..739b85ac57 -- .opencode/skills/system-deep-loop | wc -l` = **25** commits (spec said 22; branch moved past spec authoring).
- AI-co-authored: 183 of the 205 (per spec; not independently recounted).

### How non-runtime commits were triaged
The spec (`§3 In-Scope`) explicitly required the full commit range, not a runtime-only subset: "the one confirmed drift hit to date originated outside the runtime." The census honored this by:
1. Counting the full range (205) at iteration 1.
2. Building a per-phase triage map keyed by what each phase actually cites (paths, references, premises).
3. Resolving every cited path against pinned HEAD with `git cat-file -e 739b85ac57:<path>`.
4. For path failures, attributing to the commit that moved the path via `git show --stat <commit>` and rename extraction.
5. For resolved paths with stale premises, attributing to the commit that changed the premise via commit-body reading.

The `7f3216fc502` renumber commit was discovered at iteration 7 by searching phase-003 spec.md for the literal string "033" — not by filtering the commit range by path.

### Tooling
- `git log`, `git show`, `git diff`, `git cat-file -e`, `git merge-base --is-ancestor`, `git ls-tree` for commit and path resolution.
- `find` and `ls` for directory/glob resolution.
- Grep for snake_case path patterns across phase plan documents.
- Code graph was EMPTY at init (`freshness=empty`, 0 nodes) — unavailable for structural symbol resolution. Switched to Grep + `git show` for all symbol work.

### Iteration accounting
7 iterations consumed of 10 budget. Convergence achieved at iteration 7 with `stopReason=converged`:
- 9/9 key questions answered.
- 15/15 phase verdicts locked.
- Both open questions resolved.
- Positive control reproduced.
- Negative control locked.

newInfoRatio trend: [1.00, 0.85, 0.55, 0.45, 0.70, 0.35, 0.85] → average 0.68, well above the 0.05 threshold. Two iterations spiked high (1, 2, 5, 7) on resolving load-bearing questions or surfacing new verdicts; three iterations scored low (3, 4, 6) on extending the path-resolution pattern across phase batches.

---

## 11. ELIMINATED ALTERNATIVES (REQ: research.md "Eliminated Alternatives" section)

Per the deep-research contract, this section consolidates approaches that were investigated and definitively eliminated.

| Approach | Reason eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Trust the spec's commit counts (204/22) | Live range at pinned HEAD is 205/25; spec snapshot drifted post-authoring | `git log --oneline 0ce43ff589..739b85ac57 \| wc -l` = 205 | 1 |
| Conflate `modes` count in `mode-registry.json` with phase 013's eight workstreams | Registry counts routing identities (7); phase 013's 8 = 7 routing + 1 shared backbone (`deep-improvement-common`) | `013/spec.md:54`; `013/004-deep-improvement-common/` exists but `deep-improvement-common` is not a key in registry `modes` | 2 |
| Treat the `defaultMode` flip as first-order drift | No phase-013 path fails to resolve because of it; it's a behavior change, not a path break | grep for `defaultMode` in `013/**` = 0 hits | 2 |
| Mark phase 005 needs-refinement because `739b85ac57` touched `fanout-run.cjs` | `739b85ac57` is a 17-line dispatch-env fix orthogonal to phase 005 scope; phase 005 deliverables unshipped | `git show --stat 739b85ac57` = 17 lines; grep `liveTools\|webSearch\|invocationFingerprint` = 0 hits | 3 |
| Carry iteration 1's "low-medium" risk rating for phase 007 into a "needs refinement" verdict | Typed-pair series touches skill-benchmark harness (phase 016/003 surface), not phase 007 shared services | `git show --stat b5f26ecedc6`, `c067920890a`, `72bb0bc0c70` — all touch `deep-improvement/` or `shared/behavior-benchmark/` paths only | 4 |
| Treat phase 012 as invalidated because the routing commits changed `mode-registry.json` and `hub-router.json` | Phase 012 spec doesn't pin boundary state; it freezes whatever the current boundary is. Work is still well-formed; only its scope expands | `012/spec.md:47` forward-looking freeze language | 5 |
| Mark phase 015 needs-refinement because phase 003 has first-order drift and phase 015 depends on phase 003 | Phase 015's own plan and citations resolve cleanly; transitive dependency is execution-readiness concern, not phase-015 plan defect | `015/spec.md:60` cites `003/spec.md` (resolves); zero snake_case citations in `015/**` | 6 |
| Treat iteration 1's phase-003 verdict as final | Iteration 1 caught kebab renames but missed `packet-033` → `z_archive/027` number-rebind drift (different drift class on same phase) | `003/spec.md:57,119` "Packet 033" vs `ls .opencode/specs/system-deep-loop/033-post-sync-verification-fixes/` (different packet) | 7 |

---

## 12. OPEN QUESTIONS

**All 9 key questions are answered.** No open questions remain for this lineage.

The parent reconciliation step may surface disagreements between this lineage and the SOL lineage. Those are the parent's responsibility, not this lineage's.

---

## 13. REFERENCES

### Census target packet
- `.opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/{spec.md, plan.md, tasks.md, checklist.md}` — the census charter.

### Phase plan documents censused
- `.opencode/specs/system-deep-loop/036-deep-loop-innovation/003-baseline-taxonomy-and-state-census/{spec.md, plan.md}`
- `.opencode/specs/system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/spec.md` (+ 3 children)
- `.opencode/specs/system-deep-loop/036-deep-loop-innovation/005-fanout-live-tools-unblock/{spec.md, plan.md}`
- `.opencode/specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/spec.md`
- `.opencode/specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/spec.md`
- `.opencode/specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/spec.md`
- `.opencode/specs/system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/spec.md`
- `.opencode/specs/system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/spec.md`
- `.opencode/specs/system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/spec.md`
- `.opencode/specs/system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/spec.md`
- `.opencode/specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/spec.md` (+ 8 mode children)
- `.opencode/specs/system-deep-loop/036-deep-loop-innovation/014-staged-state-migration-and-authority-cutover/spec.md`
- `.opencode/specs/system-deep-loop/036-deep-loop-innovation/015-legacy-writer-retirement/{spec.md, plan.md}`
- `.opencode/specs/system-deep-loop/036-deep-loop-innovation/016-whole-system-gate/{spec.md, plan.md}`
- `.opencode/specs/system-deep-loop/036-deep-loop-innovation/017-integrate-latest-and-closeout/{spec.md, plan.md}`

### Drift-engine commits
- `cc77a1e550a` — kebab-case migration (~3,700 renames; renamed `state_format.md`, `integration_points.md`, `behavior_benchmark.md` family).
- `7f3216fc502` — packet renumber (compacted archive to 001-029, renumbered active to 030-036; rebound "Packet 033").
- `908efde8d8f` — flipped four hubs (incl. `system-deep-loop`) to `defaultMode: null`.
- `6cd8ab14e4e` — corrected mode routing (dropped `hub-identity` from all 7 modes; restricted `model-benchmark`/`skill-benchmark` to command-bridge-only).
- `708d25acf04` — implemented typed-pair routing surface (added `smart_routing.md`, `leaf-manifest.json`, `resourceContractVersion`).
- `739b85ac57` — cli-opencode fan-out dispatch unblock (orthogonal 17-line fix).
- `9259c23e313` — `goal_opencode` → `goal-opencode` rename.
- `72c36121201` — de-skill-specific harness classifier + manifest freshness gate.
- `1a5963e6b9d`, `71e18c224c3` — reference-completion fixes.

### Resolved-dependency content (OPEN QUESTION B)
- `.opencode/specs/system-deep-loop/z_archive/027-deep-loop-behavior-benchmarks/spec.md` — Status: Complete; 5-package behavior-benchmark framework preserved; claude-cli baseline + GPT-5.5-fast comparisons intact.

### State and provenance
- Lineage: `glm`
- Session: `fanout-glm-1784463720850-qpa2w1`
- Executor: `cli-opencode` model=`zai-coding-plan/glm-5.2`
- Artifact dir: `.opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/glm/`
- Iteration files: `iterations/iteration-001.md` through `iterations/iteration-007.md`
- State log: `deep-research-state.jsonl` (8 lines: 1 config + 7 iteration records)
- Strategy: `deep-research-strategy.md`
- Findings registry: `findings-registry.json`
- Dashboard: `deep-research-dashboard.md`
- Deltas: `deltas/iter-001.jsonl` through `deltas/iter-007.jsonl`
