---
title: "Feature Specification: Phase 9 — cutover and rollout"
description: "Final phase of the sk-code parent conversion. Branch portion: verified cleanup (harness migrations, vocab-sync generalization, CS-003 matcher, smart_routing 29-path fix) + fold-broken live fixes. Main-side rollout: the atomic advisor-rebuild that removes the sk-code-review identity (scorer source, graph regen, reindex), deletes the 4 alias sites, repoints ~350 NAME refs, and cuts the version release — staged because the worktree lacks the compiled dist that step requires."
trigger_phrases:
  - "sk-code cutover and rollout"
  - "sk-code-review alias removal"
  - "sk-code advisor-rebuild"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/009-cutover-and-rollout"
    last_updated_at: "2026-07-04T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Delivered the branch-side cutover prep and the main-side rollout runbook"
    next_safe_action: "Merge, then run the main-side rollout runbook"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9 — cutover and rollout

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Accepted / Complete |
| **Created** | 2026-07-04 |
| **Branch** | Worktree for `124-sk-code-parent` integration work |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | ../008-routing-benchmark-and-review/spec.md |
| **Successor** | None (final phase); main-side rollout runbook |
| **Handoff Criteria** | Branch: cleanup + fold-fixes verified, cutover runbook specified, child strict validation. Main: rollout runbook executed (alias removed, advisor rebuilt, reindexed, release cut, 0 live sk-code-review refs) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** — the final cutover-and-rollout. Investigation (three read-only agents) revealed the cutover is far larger than the packet plan assumed and, critically, that its load-bearing steps cannot run in the worktree:

- `sk-code-review` is not just a 3-file hub alias. It is a first-class identity in the **production advisor scorer** (~35 TS entries in `explicit.ts`/`lexical.ts`/`fusion.ts` + a 56-entry Python mirror), with ~11 coupled regression corpora asserting its current output. The alias in the hub registry is only the compatibility shim; the scorer + generated `skill-graph.json` independently sustain the identity.
- The **behavioral** cutover is regenerating `skill-graph.json` to drop the node (it has had no `graph-metadata.json` since 005, so the ~100 scorer entries are already inert — which is why `sk-code` already wins review routing). But the graph compiler **fails validation in the worktree** (17 errors — another skill's metadata references un-built `dist` paths), the TS scorer **can't load** (`@spec-kit/shared` unbuilt), and the SQLite/native reindex needs `dist`.

Therefore the phase splits at the verifiability seam. The **branch portion** does everything testable; the **main-side rollout** does the atomic advisor-rebuild where its toolchain exists.

**Scope Boundary**: Branch — cleanup, fold-broken live fixes, and the rollout runbook. Do NOT make blind, unverifiable edits to the TS advisor scorer. Do NOT delete the alias sites before the graph regen (coupling: an unresolvable recommendation). Do NOT pre-apply the version release bump (it belongs with the actual cutover).

**Deferred to the main-side rollout** (all in `implementation-summary.md` § Main-Side Rollout Runbook): advisor scorer source removal (TS + Python), 4 alias-site deletions, ~350 NAME-ref repoints, coupled corpora rebaseline, `skill-graph.json` regen, SQLite/native + memory reindex, and the version/changelog release.

**Deliverables (branch)**:
- Verified cleanup: 8 harness migrations, vocab-sync generalization, CS-003 matcher, smart_routing 29-path fix.
- Fold-broken live fixes: sandbox script + dead README link.
- Complete, ordered main-side rollout runbook.
- Phase 009 documentation and metadata.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The cutover removes `sk-code-review` as a routing identity and cuts the release. But its load-bearing steps (graph regen, TS scorer retune, reindex) require the compiled `dist` the worktree lacks, and blind edits to un-runnable production routing would ship unverifiable regressions. Meanwhile three cleanup items and two fold-broken live references were still outstanding.

### Purpose
Land everything mergeable and verifiable now (cleanup + fold-fixes), and specify the load-bearing cutover as one atomic, ordered main-side advisor-rebuild — keeping the alias a working shim until that rebuild lands it all at once, so routing is never left in a broken or unverifiable intermediate state.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (branch)
- Migrate the 8 flat-layout harness-test failures to the hub layout (no weakening).
- Generalize `parent-hub-vocab-sync` to derive mode prefixes from `mode-registry.json`.
- Fix the CS-003 substring matcher with a narrow word-boundary guard.
- Repoint the 29 drifted RESOURCE_MAP paths in `smart_routing.md`.
- Fix the two fold-broken live references (sandbox script, README link).
- Author the main-side rollout runbook + phase docs.

### Out of Scope (branch → main-side rollout)
- Advisor scorer source removal (TS + Python) — un-runnable in the worktree.
- The 4 alias-definition site deletions — coupled to the graph regen.
- The ~350 alias-covered NAME-ref repoints — bundled with alias removal (per 007).
- `skill-graph.json` regen, SQLite/native reindex, memory reindex — need `dist`.
- The version/changelog release bump — belongs with the actual cutover.
- The sk-design-owned `design-dispatch-boundary-proof` stale digest — different family.

### Files Changed (branch)
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `skill-benchmark/tests/{sk-code-router-sync,playbook-mode,skill-benchmark}.vitest.ts` | Update | Migrate 7 assertions to the hub layout |
| `skill-benchmark/playbook-generator.cjs` | Update | Hub-aware coverage intents |
| `skill-benchmark/router-replay.cjs` | Update | CS-003 word-boundary guard |
| `skill-benchmark/parent-hub-vocab-sync.cjs` | Update | Registry-derived mode prefixes |
| `sk-code/shared/references/smart_routing.md` | Update | 29 drifted paths repointed |
| `deep-review/.../setup-cp-sandbox.sh` | Update | Repoint fold-deleted `sk-code-review/` → `sk-code` |
| `skills/README.md` | Update | Remove dead `sk-code-review` link (folded) |
| `009-cutover-and-rollout/` | Create | Phase docs + rollout runbook |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No unverifiable production edits shipped | The TS advisor scorer is not blind-edited in the branch; it is staged in the runbook |
| REQ-002 | Cleanup verified | Harness suite `1 failed | 98 passed` (the 1 is sk-design-owned); CS-003 + vocab-sync verified by replay |
| REQ-003 | No broken intermediate routing | The alias stays a working shim; alias deletion is sequenced after graph regen in the runbook |

### P1 - Required (complete OR user-approved deferral)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | smart_routing drift fixed | `0` dead paths of 96 in the surface router |
| REQ-005 | Fold-broken live refs fixed | Sandbox script + README link resolve |
| REQ-006 | Rollout runbook complete + ordered | Every deferred step has an owner file set and a verification, in dependency order |
| REQ-007 | Coupling documented | Alias-before-regen risk and TS/Python parity are stated in the runbook |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: Harness suite `1 failed | 98 passed (99)`; the sole failure is `design-dispatch-boundary-proof` (sk-design-owned).
- **SC-002**: CS-003 scenario routes `[implement]`; genuine-review control routes `[review]`.
- **SC-003**: `parent-hub-vocab-sync` derives prefixes from the registry; sk-design output unchanged.
- **SC-004**: `smart_routing.md` has `0` dead RESOURCE_MAP paths.
- **SC-005**: `setup-cp-sandbox.sh` resolves + parses; the dead README link is gone.
- **SC-006**: `implementation-summary.md` § Main-Side Rollout Runbook lists all deferred steps in dependency order with per-step verification.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:research-questions -->
## 6. RESEARCH QUESTIONS (Track R) & CONTEXT TARGETS (Track C)

### Track R — deep-research
- Not a research phase; three read-only investigation agents supplied the cutover surface map, version state, and cleanup scoping.

### Track C — deep-context
- Confirm the alias's true surface (scorer + graph + corpora, not just 3 hub files) — done.
- Confirm the graph regen + TS scorer are un-runnable in the worktree — done (17 validation errors; `@spec-kit/shared` unbuilt).
- Confirm `sk-code` already wins review routing (node already gone) — done (Python advisor).
<!-- /ANCHOR:research-questions -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Blind TS scorer edits | Unverifiable routing regressions on main | Stage the retune for main; verify against the rebuilt toolchain |
| Risk | Alias deleted before graph regen | Advisor recommends an unresolvable name | Runbook sequences alias deletion after the scorer removal + regen |
| Risk | TS/Python scorer divergence | Parity test red on main | Edit both in the same main-side step; keep the branch untouched (both retain the alias, so parity stays green) |
| Risk | Half-repointed NAME refs | Confusing docs-vs-behavior mismatch | Bundle NAME refs with alias removal (atomic) |
| Dependency | Compiled `dist` on main | Blocking | Runbook step 1 builds it |
| Dependency | 008 benchmark | Complete | smart_routing fix lifts it; re-run in runbook step 8 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS
- None blocking. The main-side rollout is fully specified; its execution is post-merge where the toolchain exists.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- Add L2/L3 addendums for complexity
-->
