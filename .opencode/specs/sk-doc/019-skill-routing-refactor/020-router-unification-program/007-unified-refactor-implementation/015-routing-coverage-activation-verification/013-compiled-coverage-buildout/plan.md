---
title: "Implementation Plan: Compiled-Routing Coverage Build-Out & Genuine Default-On"
description: "Phased plan: sk-code pilot build-out, replicate to cli-external-orchestration/mcp-tooling/sk-prompt, fix 2 over-detection bugs, re-mint and build sk-doc/system-deep-loop, stage the default-on flip, verify the fleet."
trigger_phrases:
  - "compiled routing coverage plan"
  - "sk-code pilot build-out"
  - "staged default-on flip plan"
  - "compiled router rollout phases"
importance_tier: "critical"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/013-compiled-coverage-buildout"
    last_updated_at: "2026-07-21T12:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Reconciled status to Complete: all 6 phases shipped and serving (7/7 hubs compiled-serving, parity 49/49). Subsequent deep-review remediation hardened the runtime."
    next_safe_action: "None; core deliverable complete. Tracked follow-up: full 7-hub LUNA-HIGH acceptance sweep (checklist CHK-025)."
    blockers: []
    key_files:
      - ".opencode/bin/lib/compiled-routing/006-parent-hub-rollout/006-sk-design/lib/registry-compiler.cjs"
      - ".opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs"
      - ".opencode/bin/lib/compiled-route-manifest.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "packet-013-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should Phase 3 (re-mint) run fully in parallel with Phases 1-2, or gate on the sk-code pilot proving the pattern first?"
    answered_questions: []
---
# Implementation Plan: Compiled-Routing Coverage Build-Out & Genuine Default-On

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
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
| **Language/Stack** | Node.js (CommonJS `.cjs`) |
| **Framework** | Compiled skill-router runtime engine (`.opencode/bin/lib/compiled-routing/`) |
| **Storage** | JSON manifests (`compiled-route-manifest.cjs`), JSON canary fixtures |
| **Testing** | vitest (18-file / 247-test fleet suite), route-gold parity harness (`compiled-routing-parity.cjs`) |

### Overview

Grow each thin hub's compiled policy (detectors in `registry-compiler.cjs`, routing in `router.cjs`/`canary-router.cjs`, coverage in `fixtures/canary-cases.v1.json`) until compiled routing matches legacy on every scenario, modeled directly on sk-design's proven 562-line compiler. Fix the two over-detection bugs, re-mint the two stale manifests, then persist the staged per-hub default-on flip once every hub is genuinely `compiled-serving`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (verified diagnosis: `compiled-routing-coverage-diagnosis.md`)
- [x] Success criteria measurable (route-gold parity, byte-identical legacy, frozen scorer SHA)
- [x] Dependencies identified (sk-design reference compiler, non-frozen parity harness)
- [x] NFRs defined with targets (see `spec.md` section 7)
- [x] Architecture decisions documented (ADRs) (see `decision-record.md` ADR-001)

### Definition of Done
- [ ] All 7 hubs report `compiled-serving` parity
- [ ] Staged default-on flip lands for all 7 hubs
- [ ] 18-file / 247-test vitest suite green
- [ ] Frozen scorer SHA-256 unchanged
- [ ] `validate.sh --strict` Errors:0 for this packet and every touched hub packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Per-hub compiled policy compiler + typed router + canary fixture set, feeding a shared runtime engine (`compiled-route.cjs`) behind a cohort-gated resolver (`resolve.cjs`).

### Key Components
- **`registry-compiler.cjs` (per hub)**: Compiles authored `SKILL.md`/mode-registry signals into detectors. sk-design's version is the reference (562 lines, 36 matches, 0 defers).
- **`router.cjs` / `canary-router.cjs` (per hub)**: Routes a compiled decision to a destination using the compiled policy.
- **`fixtures/canary-cases.v1.json` (per hub)**: The canary scenario set exercised by the parity harness; sk-code's today is 5 cases with an empty `policy:{}` (thin).
- **`compiled-route-manifest.cjs`**: Mints and manages the per-hub manifest `{generation, effectivePolicyHash}`; currently create-if-absent only.
- **`resolve.cjs` (runtime + authored twin)**: Cohort gate; holds `DEFAULT_ON_HUBS`, synced via `compiled-route-sync.cjs`.
- **`compiled-routing-parity.cjs`**: Non-frozen parity harness that measures match / safe-defer / unsafe-misroute / stale per hub.

### Data Flow
```
Authored SKILL.md + mode-registry.json (per hub)
        |
        v
registry-compiler.cjs -> detectors -> compiled policy
        |
        v
router.cjs / canary-router.cjs --(route-gold scenario)--> decision
        |
        v
compiled-routing-parity.cjs --compare--> legacy decision
        |
        v
match | safe-defer | unsafe-misroute | stale
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| sk-design `006-sk-design/lib/registry-compiler.cjs` (TV-003) | Compiles the interface/foundations detector that over-fires on the TV-003 scenario | Update: narrow the detector so it stops adding `foundations` when only `interface` should match | Route-gold parity: TV-003 compiled == legacy `[interface]` |
| mcp-tooling compiler (MT-008) | Compiles the md-generator/mcp-refero detector that over-fires on MT-008 | Update: narrow the detector so it stops adding `md-generator` | Route-gold parity: MT-008 compiled == legacy `[mcp-refero]`, gold-pass |
| sk-code / cli-external-orchestration / mcp-tooling / sk-prompt compilers + routers + fixtures | Thin coverage (3, 3, 1, 0 matches respectively) | Update: grow detectors + canary cases to legacy parity | Route-gold parity: hub reaches `compiled-serving` |
| `compiled-route-manifest.cjs` | Mint is create-if-absent only; no refresh verb | Update: add a safe refresh path for stale manifests | sk-doc/system-deep-loop manifest `{gen, hash}` matches `compileCanonicalParent(current inputs)` |

Required inventories:
- Same-class producers: `rg -n 'registry-compiler|canary-router' .opencode/bin/lib/compiled-routing/006-parent-hub-rollout` - every hub's compiler/router pair, so the same over-detection class can be checked in each, not just the 2 known bugs.
- Consumers of changed symbols: `rg -n 'DEFAULT_ON_HUBS|compiled-route-sync' .opencode/bin --glob '*.cjs'` - resolver cohort consumers before the flip.
- Matrix axes: hub (7) x {coverage build-out, over-detection fix, re-mint, default-on flip} - not every hub needs every axis (sk-design only needs the fix; sk-doc/system-deep-loop need re-mint first).
- Algorithm invariant: the compiled route set must always be a subset of what legacy would route for the same prompt (never add, never drop) - verified per scenario by the route-gold parity harness.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: sk-code Pilot Build-Out
- [ ] Read sk-design's `006-sk-design/lib/registry-compiler.cjs` as the reference pattern
- [ ] Grow sk-code's detectors, router, and canary fixtures to legacy parity
- [ ] Route-gold parity run: sk-code reaches `compiled-serving`

### Phase 2: Replicate to cli-external-orchestration, mcp-tooling, sk-prompt
- [ ] Repeat the sk-code pattern per hub
- [ ] Fix the mcp-tooling MT-008 over-detection bug alongside its coverage build-out
- [ ] Route-gold parity run per hub: each reaches `compiled-serving`

### Phase 3: Fix sk-design TV-003 + Re-mint sk-doc/system-deep-loop
- [ ] Fix the sk-design TV-003 over-detection bug (sk-design otherwise keeps its existing coverage)
- [x] Build the safe manifest re-mint path (`refreshCanonicalManifest` + `refresh` CLI verb on `compiled-route-manifest.cjs`, 16/16 tests pass - see `tasks.md` T013 and `implementation-summary.md`)
- [B] Re-mint sk-doc (generation 5) and system-deep-loop (generation 3); confirm freshness - BLOCKED: both hubs' authored `SKILL.md` lack the literal `UNKNOWN_FALLBACK_CHECKLIST = [...]` array the shared compiler requires; refresh fails closed with `FALLBACK_CHECKLIST_MISSING`, zero bytes written. Fixing `SKILL.md` touches legacy routing surface and needs its own reviewed change (`tasks.md` T013b).

### Phase 4: Build sk-doc and system-deep-loop Coverage
- [ ] Grow sk-doc's detectors, router, and canary fixtures to legacy parity
- [ ] Grow system-deep-loop's detectors, router, and canary fixtures to legacy parity
- [ ] Route-gold parity run per hub: each reaches `compiled-serving`

### Phase 5: Staged Default-On Flip
- [ ] Persist `DEFAULT_ON_HUBS` in both resolver copies, synced via `compiled-route-sync.cjs`
- [ ] Move the 7 `SKILL.md` directives + 2 create-skill parent templates + catalog wording lockstep
- [ ] Flip hubs in the controller's recommended order, stop-on-first-failure

### Phase 6: Fleet Verification
- [ ] `=0` fleet kill-switch drill (all 7 hubs fall back to legacy)
- [ ] Per-hub cohort-removal drill (byte-exact restore)
- [ ] 18-file / 247-test vitest suite green
- [ ] Frozen scorer SHA-256 unchanged; `validate.sh --strict` Errors:0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Coverage Target |
|-----------|-------|-------|-----------------|
| Route-gold parity | Per-hub full scenario set | `compiled-routing-parity.cjs`, `run-skill-benchmark.cjs --compiled-routing-parity on` | 100% `compiled-serving`, 0 unsafe-misroute |
| Unit / fleet | Compiler, router, resolver, sync | vitest | 18-file / 247-test suite green |
| Manual acceptance | Routing + gold holdout | LUNA-HIGH two-plane acceptance | Archived under `<hub>/benchmark/compiled-routing/<run-label>/` |
| Reversibility | Kill-switch + per-hub cohort removal | Manual drill | Byte-exact restore in both cases |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-design `006-sk-design` reference compiler | Internal | Green | No proven pattern to copy per hub |
| Frozen scorer trio (`router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`) | Internal | Green, read-only | Parity measurement breaks if touched |
| `compiled-routing-parity.cjs` harness | Internal | Green, editable | Cannot measure `compiled-serving` per hub |
| `compiled-route-manifest.cjs` refresh path | Internal | Missing, must build | sk-doc/system-deep-loop stay unevaluable |
| Worktree `.worktrees/0089-sk-doc-default-routing-cutover` | Internal | Green | No isolated workspace for the build-out |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any hub fails route-gold parity after its default-on flip, or a frozen scorer hash changes unexpectedly.
- **Procedure**: Remove the hub from `DEFAULT_ON_HUBS` in both resolver copies for a byte-exact restore to legacy for that hub; for a fleet-wide issue, set `SPECKIT_COMPILED_ROUTING=0`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (sk-code pilot) ──────► Phase 2 (replicate: cli-ext, mcp-tooling, sk-prompt) ──┐
                                                                                        │
Phase 3 (TV-003 fix + re-mint) ────────────────────────────────────────────────────────┤
                                                                                        │
                                    Phase 4 (sk-doc, system-deep-loop coverage) ◄───────┘
                                                                                        │
                                                                                        ▼
                                    Phase 5 (staged flip) ────────► Phase 6 (fleet verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1: sk-code pilot | None | 2, 5 |
| 2: replicate | 1 | 5 |
| 3: TV-003 fix + re-mint | None (parallel to 1, 2) | 4, 5 |
| 4: sk-doc/system-deep-loop coverage | 3 | 5 |
| 5: staged flip | 2, 4 | 6 |
| 6: fleet verify | 5 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| 1: sk-code pilot | High | Establishes the pattern; largest unknown, converts 19 safe-defers to real matches |
| 2: replicate (3 hubs) | Medium | Repeats the proven pattern on 3 thinner hubs (3, 1, 0 matches today) |
| 3: TV-003 fix + re-mint | Low-Medium | 1 detector narrowing + 1 new manifest refresh path |
| 4: sk-doc/system-deep-loop coverage | High | 2 more hubs, post-remint coverage gap unknown until re-mint reveals it |
| 5: staged flip | Medium | Coordination-heavy: 2 resolvers, 7 `SKILL.md` files, 2 templates, catalog wording |
| 6: fleet verify | Low | Drills plus the existing 247-test suite |
| **Total** | | Multi-hub program sized by the verified per-hub scenario counts in `spec.md` section 2 |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Frozen scorer SHA-256 captured before Phase 1 starts
- [ ] `DEFAULT_ON_HUBS` confirmed empty (`new Set()`) in both resolvers before any flip
- [ ] Fleet vitest suite green baseline captured

### Rollback Procedure
1. Remove the affected hub from `DEFAULT_ON_HUBS` in both resolver copies.
2. Run `compiled-route-sync.cjs` to keep the authored twin and runtime copy in sync.
3. Re-run that hub's route-gold parity to confirm byte-exact legacy restore.
4. For a fleet-wide issue, set `SPECKIT_COMPILED_ROUTING=0` and confirm all 7 hubs fall back to legacy.

### Data Reversal
- **Has data migrations?** No - manifests and compiled policies are regenerated artifacts, not migrated data.
- **Reversal procedure**: Delete or ignore the regenerated `compiled/` artifacts for the affected hub; legacy serving resumes automatically once the cohort entry is removed.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌────────────────┐   ┌───────────────────────┐
│ sk-code pilot   │──►│ replicate (3 hubs)    │──┐
└────────────────┘   └───────────────────────┘  │
┌────────────────┐   ┌───────────────────────┐  ├─►┌──────────────┐   ┌──────────────┐
│ TV-003 + remint│──►│ sk-doc/system-deep-loop│──┘  │ staged flip  │──►│ fleet verify │
└────────────────┘   └───────────────────────┘     └──────────────┘   └──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| sk-code pilot | sk-design reference pattern | Proven per-hub build-out pattern | Replicate phase |
| Replicate (cli-ext, mcp-tooling, sk-prompt) | sk-code pilot | 3 more `compiled-serving` hubs | Staged flip |
| TV-003 fix + re-mint path | None | sk-design fully clean; sk-doc/system-deep-loop fresh manifests | sk-doc/system-deep-loop coverage |
| sk-doc/system-deep-loop coverage | Re-mint path | 2 more `compiled-serving` hubs | Staged flip |
| Staged flip | All 7 hubs `compiled-serving` | `DEFAULT_ON_HUBS` populated, directives moved | Fleet verify |
| Fleet verify | Staged flip | Kill-switch and reversibility proof | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **sk-code pilot** - establishes the reference pattern - CRITICAL
2. **Replicate to cli-external-orchestration, mcp-tooling, sk-prompt** - CRITICAL
3. **sk-doc/system-deep-loop coverage (post-remint)** - CRITICAL, blocked on re-mint which can run in parallel with 1-2
4. **Staged flip** - CRITICAL, blocked on all 5 preceding hub build-outs plus sk-design's existing coverage
5. **Fleet verify** - CRITICAL

**Parallel Opportunities**:
- The TV-003 fix and the manifest re-mint path (Phase 3) can run in parallel with the sk-code pilot and replicate phases (Phases 1-2).
- Once the sk-code pattern is proven, cli-external-orchestration, mcp-tooling, and sk-prompt build-outs are independent of each other.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|-------------------|--------|
| M1 | sk-code pilot proven | sk-code reaches `compiled-serving` | End of Phase 1 |
| M2 | Thin hubs replicated | cli-external-orchestration, mcp-tooling, sk-prompt reach `compiled-serving`; MT-008 fixed | End of Phase 2 |
| M3 | sk-design clean, manifests fresh | TV-003 fixed; sk-doc/system-deep-loop manifests fresh | End of Phase 3 |
| M4 | Stale hubs covered | sk-doc, system-deep-loop reach `compiled-serving` | End of Phase 4 |
| M5 | Fleet default-on | All 7 hubs flipped, fleet verified, reversibility proven | End of Phase 6 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm the worktree is `.worktrees/0089-sk-doc-default-routing-cutover` before touching any per-hub compiler, router, or fixture file.
- Capture the frozen-scorer digests (`router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`) and each hub's route-gold baseline before starting its phase.
- Read the target hub's `SKILL.md`, `mode-registry.json`, and sk-design's reference compiler before growing detectors.
- Confirm `DEFAULT_ON_HUBS` stays empty in both resolver copies until a hub's own parity run is 100% `compiled-serving`.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Ordered steps | Do not flip a hub's default-on directive until that hub's own route-gold parity run is 100% `compiled-serving` |
| Scope lock | Modify only the per-hub compiler/router/fixture files and the shared resolver/manifest/sync surfaces named in this plan's AFFECTED SURFACES table |
| Frozen scorer | Treat the three pinned scorer files as read-only; fail on any digest drift |
| Subset invariant | Compiled routes must stay a subset of what legacy routes for the same prompt — never add, never drop |
| Reversibility | Every hub keeps a byte-exact rollback (cohort removal) and the fleet keeps `SPECKIT_COMPILED_ROUTING=0` as kill-switch |
| Evidence | Keep checklist/task items unchecked until the named parity command or artifact exists |

### Status Reporting Format

```text
Hub: [sk-code|cli-external-orchestration|mcp-tooling|sk-prompt|sk-design|sk-doc|system-deep-loop|fleet]
Phase: [1-pilot|2-replicate|3-fix-and-remint|4-coverage|5-flip|6-verify]
Status: [planned|in-progress|blocked|verified]
Route-gold parity: [command + result]
Frozen scorer pin: [SHA-256 check result]
Rollback evidence: [command or artifact]
Next safe action: [single phase-local action]
```

### Blocked Task Protocol

If a hub's route-gold parity finds a new unsafe-misroute, a frozen scorer digest changes, a manifest re-mint fails freshness, or a hub is flipped before its own parity run is 100% `compiled-serving`, stop the current phase. Preserve the failing evidence and report the exact command, exit code, affected hub, and last verified rollback point before proposing a narrower remediation.
<!-- /ANCHOR:ai-execution -->

---

## L3: ARCHITECTURE DECISION SUMMARY

See `decision-record.md` for the full ADR:

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | Path 1 (build full coverage) over Path 2 (byte-identical via fallback) and Path 3 (hold) | Operator directive: no concessions. Path 2 leaves compiled routing serving unevenly with legacy backing the gaps; Path 3 was rejected outright. Path 1 is proven feasible by sk-design. |
