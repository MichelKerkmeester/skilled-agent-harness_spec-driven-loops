---
title: "Implementation Plan: Implement the improvement-research findings (make C-plus real + hardening)"
description: "Implementation Plan for phase 004 of the parent-nested-skill-pattern epic: make the C-plus routing guarantee real (CI gate + /doctor advisor-sync coverage), give deep-loop-runtime its own dependency manifest, unify loop-locking across the graph-backed modes, and land a set of low-regret hardening — all across four independent clusters plus the orchestrator."
trigger_phrases:
  - "implement improvement research findings plan"
  - "make C-plus real CI advisor-sync plan"
  - "deep-loop runtime self-contained loop-lock plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/117-parent-nested-skill-pattern/004-improvement-implementation"
    last_updated_at: "2026-06-15T16:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored implementation plan for the improvement-implementation phase"
    next_safe_action: "Track the codegen follow-on; close out validation"
    blockers: []
    key_files:
      - ".github/workflows/routing-registry-drift.yml"
      - ".opencode/commands/doctor/scripts/parent-skill-check.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-155-004-improvement-implementation-implementationplan"
      parent_session_id: null
    completion_pct: 95
    open_questions:
      - "Codegen the projection maps from the registry (P1) — staged as a follow-on; A3+A4 already make drift reliably caught"
    answered_questions: []
---
# Implementation Plan: Implement the improvement-research findings

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-architecture | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | `.cjs`/`.ts` runtime scripts, GitHub Actions YAML, JSON registry/manifest, Markdown skill docs |
| **Framework** | `deep-loop-workflows` parent skill over the frozen `deep-loop-runtime` backend; `/doctor` command surface; `system-skill-advisor` routing |
| **Storage** | `.github/workflows/`, `.opencode/skills/deep-loop-runtime/`, `.opencode/commands/doctor/`, `.opencode/skills/deep-loop-workflows/` |
| **Testing** | `deep-loop-runtime` vitest (349/349), system-spec-kit mcp_server changed-import tests (17), `npm ci`, routing drift-guard + parity (19/19), `parent-skill-check.cjs`, skill-benchmark Lane C (71/71), `validate.sh --strict` |

### Overview
This phase implements the actionable findings from the 5-iteration improvement research (`../improvement-research/improvement-research.md`). The architecture was judged SOUND, so there is no rearchitecture; the dominant theme is making the "C-plus" routing guarantee REAL (it existed only as an unrun test), plus runtime self-containment, loop-lock unification, and low-regret hardening. The work was decomposed into four independent clusters (A — make C-plus real; B — runtime self-containment; C — loop-locking; D — hardening) executed in parallel and integrated by the orchestrator, with the single codegen item (#3) deliberately deferred as a tracked follow-on because the CI gate and advisor-sync coverage already make drift reliably caught.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The 5-iteration improvement research is complete with a per-finding verdict (`../improvement-research/improvement-research.md`).
- [x] Architecture judged SOUND — scope is implement-findings, not rearchitect.
- [x] Findings decomposed into independent clusters with explicit out-of-scope "do NOT" list.

### Definition of Done
- [x] C-plus is real: a PR-triggered CI gate runs the drift-guard + parity + `/doctor`; `/doctor` surfaces the inert-lexical gap.
- [x] `deep-loop-runtime` resolves its deps from its own manifest; zero `system-spec-kit/node_modules` reach-ins (both forms); suite green.
- [x] All four graph-backed modes acquire a real lock via the promoted CLI; lock primitive race-safe; fan-out-merge atomic.
- [x] Hardening items land with guard tests; no mode behavior changes beyond added safety.
- [x] `validate.sh --strict` green on this phase (close-out, this turn).

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Parallel cluster decomposition over invariant-preserving changes. Each cluster is independent and individually reversible via `git restore`; the orchestrator integrates and verifies. No new abstraction is introduced — existing primitives (the promoted `loop-lock.cjs`, the registry, the runtime manifest precedent) are wired into the surfaces that lacked them.

### Key Components
- **Cluster A (orchestrator)**: `.github/workflows/routing-registry-drift.yml` CI gate + `/doctor` advisor-sync coverage in `parent-skill-check.cjs`.
- **Cluster B (agent, worktree)**: `deep-loop-runtime` own `package.json` + `package-lock.json` + bare specifiers replacing the `system-spec-kit/node_modules` reach-ins + a seam guard test.
- **Cluster C (agent)**: route research/review/ai-council through the promoted `deep-loop-runtime/scripts/loop-lock.cjs`; race-safe stale-reclaim; atomic fan-out-merge write.
- **Cluster D (agent)**: lifecycle-taxonomy drift-guard + `userPaused` reconcile; advisory benchmark mode-precision signal; stale `@deep-ai-council` doc fix; `runtime_capabilities` conformance test.

### Data Flow
The advisor keeps its hardcoded projection maps at runtime (no registry read), and a CI drift-guard plus the `/doctor` coverage check assert those maps stay in sync with `mode-registry.json` — drift is caught in CI rather than silently shipped. The runtime resolves every dependency from its own `node_modules` at pinned versions rather than reaching into a sibling skill's tree.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase touches path handling (runtime dependency resolution), schema boundaries (registry vs advisor maps), env precedence (skills-root depth resolution), and shared policy (loop-lock across modes), so the surface inventory is required.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.github/workflows/routing-registry-drift.yml` | (new) PR CI gate for routing surface | create | workflow YAML valid; `npx vitest@4.1.6` + `actions/setup-python` install path is dependency-free |
| `commands/doctor/scripts/parent-skill-check.cjs` | `/doctor:parent-skill` structural validator | update (add check 4b canonical exact-match + 4c non-canonical coverage WARN) | all invariants pass, 0 warnings on the canonical skill |
| `deep-loop-runtime/lib/*.ts` (5 files) | runtime execution primitives importing zod/better-sqlite3 via sibling path | update to bare specifiers | tests green; resolve from runtime's own node_modules |
| `deep-loop-runtime/scripts/*.cjs` (7 files) | tsx-loader boot via `path.resolve(...system-spec-kit...)` | update to `require.resolve('tsx')` | 3 tsx-boot `.cjs` scripts run end-to-end |
| `deep-loop-runtime/package.json` (+ lock, vitest.config.ts) | (new) runtime dependency manifest | create (force-add past `.opencode/.gitignore`) | `npm ci` clean (88 pkgs); pinned better-sqlite3 12.10.0 / zod 4.4.3 / tsx 4.21.0 |
| `deep-loop-runtime/scripts/loop-lock.cjs` | promoted lock primitive | wire research/review/ai-council; add `tryReclaimStaleLoopLock` atomic rename | lock + fan-out tests green |
| `deep-loop-runtime/scripts/fanout-merge.cjs` | fan-out merge writer | atomic write | dependency-seams guard catches the array-form reach-in |
| advisor maps (`skill_advisor.py`, `aliases.ts`) | hardcoded mode projection | unchanged (guarded, not codegen) — runtime must not read the registry | routing drift-guard + parity 19/19 |

Required inventories:
- Same-class producers: `rg -n "require\('tsx'\)|path.resolve\(.*system-spec-kit" .opencode/skills/deep-loop-runtime`.
- Consumers of changed symbols: `rg -n "loop-lock|tryReclaimStaleLoopLock|fanout-merge" .opencode/skills/deep-loop-runtime --glob '*.cjs' --glob '*.ts'`.
- Matrix axes: per-mode lock acquisition (research, review, ai-council, improvement) and dependency-resolution form (`.ts` contiguous path vs `.cjs` `path.resolve(...)` array).
- Algorithm invariant: stale-lock reclaim must be race-safe (atomic rename, single winner); fan-out-merge must write atomically.

<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the per-finding research verdict and confirm the SOUND-architecture / no-rearchitecture framing.
- [x] Confirm the four clusters are independent and assign A to the orchestrator, B/C/D to worktree agents.

### Phase 2: Core Implementation
- [x] Cluster A: author the CI workflow + the `/doctor` advisor-sync coverage check (`b08346a9bc`).
- [x] Clusters C+D: loop-lock unification + hardening in 20 files (`3b60619fd5`).
- [x] Cluster B: runtime dependency self-containment in 17 files (`07fda483b8`).

### Phase 3: Verification
- [x] CI viability fix: rewrite the gate off `npm ci` onto `npx vitest` + `setup-python` (`71a066c004`).
- [x] Phase-1 rename completion: repoint 4 stale runtime references left by the 152→155 rename (`808b746366`).
- [x] skill-benchmark Lane C restore: fix the 5-file depth resolution + e2e fixture + stale parser anchors (`216e9448d8`).
- [x] `validate.sh --strict` on this phase folder (close-out).

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/Integration | `deep-loop-runtime` full suite | vitest standalone config — 349/349 pass |
| Regression | system-spec-kit changed-import surface | mcp_server config — green on 17 changed-import tests |
| Dependency integrity | runtime manifest | `npm ci` clean (88 pkgs); zero `system-spec-kit/node_modules` reach-ins (both forms); 3 tsx-boot `.cjs` run e2e |
| Routing | drift-guard + parity + `/doctor` | drift-guard + parity 19/19; `parent-skill-check.cjs` all invariants pass, 0 warnings; workflow YAML valid |
| Benchmark | skill-benchmark Lane C | 71/71 (was 22 failed) |
| Structural | Spec docs | `validate.sh --strict` |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../improvement-research/improvement-research.md` | Internal (research) | Green | The findings being implemented |
| `../001-rename-fix-and-shared-decision` | Internal (phase) | Green | The frozen-boundary + shared/ decision this phase builds on |
| `system-spec-kit` (zod / better-sqlite3 ABI) | Internal skill | Green | Runtime deps pinned to match for native-binding ABI safety |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a cluster fails its own verification, `npm ci` is infeasible / native-binding mismatch (Cluster B), the lock test suite regresses (Cluster C), or `validate.sh --strict` errors.
- **Procedure**: per-cluster `git restore`; the clusters are independent so a single failing cluster reverts without touching the others. Cluster B carried an explicit "revert + report if infeasible" mandate rather than shipping a half-working runtime.

<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core: A, B, C, D in parallel) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | research complete + 001 decision | Core Implementation |
| Core Implementation | Setup | Verification |
| Verification | Core Implementation | Close-out |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | read research verdict + assign clusters |
| Core Implementation | High | 4 parallel clusters across ~37 files + CI workflow |
| Verification | Medium | full runtime suite + npm ci + routing + benchmark + strict validate |
| **Total** | | **~6 commits, parallelized** |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Runtime deps pinned to match `system-spec-kit` (better-sqlite3 12.10.0 / zod 4.4.3 / tsx 4.21.0) for ABI safety.
- [x] `deep-loop-runtime/package.json` force-added past the local-only `.opencode/.gitignore` so CI can install it.
- [x] CI install path verified dependency-free (`aliases.ts` no imports, `workspace-root.ts` node-only, suites shell to stdlib python3).

### Rollback Procedure
1. **A cluster regresses its own suite.** -> `git restore` that cluster's files; the other three clusters are unaffected.
2. **`npm ci` infeasible or native-binding ABI mismatch (Cluster B).** -> revert the manifest + bare-specifier edits and report rather than ship a half-working runtime.
3. **Loop-lock concurrency regression (Cluster C).** -> `git restore` `loop-lock.cjs` / `fanout-merge.cjs` and re-route the modes to their prior locking.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: `git restore` the cluster files; no data migration (config/manifest/script/doc edits only).

<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌──────────────────────┐     ┌─────────────┐
│   Phase 1   │────►│      Phase 2         │────►│   Phase 3   │
│   Setup     │     │  A / B / C / D       │     │   Verify    │
└─────────────┘     │  (parallel clusters) │     └─────────────┘
                    └──────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Cluster A (CI + /doctor) | research verdict | drift-catching guarantee | Phase 3 viability fix |
| Cluster B (runtime manifest) | system-spec-kit ABI pins | self-contained runtime | Phase 3 verify |
| Cluster C (loop-lock) | promoted `loop-lock.cjs` | unified locking | Phase 3 verify |
| Cluster D (hardening) | None | guard tests + doc fix | Phase 3 verify |

<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Cluster A core (`b08346a9bc`)** - CI gate + `/doctor` coverage - CRITICAL (makes C-plus real)
2. **CI viability fix (`71a066c004`)** - lightweight install path - CRITICAL (a fresh CI clone would otherwise fail on `npm ci`)
3. **Rename completion (`808b746366`) + Lane C restore (`216e9448d8`)** - green the canonical + benchmark suites - CRITICAL (HEAD was failing)

**Total Critical Path**: 4 of the 6 commits sit on the critical path; B/C/D core landed in parallel off it.

**Parallel Opportunities**:
- Clusters B, C, and D ran simultaneously against the orchestrator's Cluster A.
- The hardening items in Cluster D are mutually independent.

<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | C-plus made real | CI gate present + YAML-valid; `/doctor` coverage check live | `b08346a9bc` |
| M2 | Runtime self-contained | zero node_modules reach-ins; `npm ci` clean (88 pkgs) | `07fda483b8` |
| M3 | Suites green at HEAD | runtime 349/349; routing 19/19; Lane C 71/71; strict validate green | `216e9448d8` + close-out |

<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Lightweight CI over heavy `npm ci`

**Status**: Accepted

**Context**: The Cluster-A CI gate originally ran `npm ci` in `system-skill-advisor/mcp_server`, but that skill's `package.json` is untracked and its deps pull a `file:` sibling plus `@huggingface/transformers` and native better-sqlite3 — a fresh CI clone would fail on install.

**Decision**: Rewrite the gate to `npx --yes vitest@4.1.6` + `actions/setup-python`, justified by the verified dependency-free routing surface (`aliases.ts` has no imports, `workspace-root.ts` is node-only, the suites shell to a stdlib-only `python3` dump).

**Consequences**:
- Positive: avoids a broad manifest-tracking convention change and heavy native/ML downloads in CI.
- Negative + mitigation: the gate exercises only the routing surface; mitigated because that surface is exactly what the drift-guard protects.

**Alternatives Rejected**:
- Track `system-skill-advisor/mcp_server/package.json` and run `npm ci`: rejected — a broad convention change plus heavy native/ML install for no routing-coverage gain.

---

<!--
LEVEL 3 PLAN (~200 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->
