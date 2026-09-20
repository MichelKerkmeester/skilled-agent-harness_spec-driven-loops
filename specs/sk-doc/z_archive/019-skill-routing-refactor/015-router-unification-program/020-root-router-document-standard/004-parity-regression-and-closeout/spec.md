---
title: "Feature Specification: Parity, Regression, and Closeout"
description: "Define the bounded routing-only remediation, seven-canary fleet gate, adjudication-before-write discipline for authored hashes and route-gold, owner-harness artifact rebuilds, graduated manifest refresh, compiled-route-sync check/promotion/verify with retained rollback, canonical-seven status, recursive strict validation, metadata/continuity regeneration, and the final scoped closeout for the root ROUTER.md program."
trigger_phrases:
  - "parity regression closeout"
  - "seven canary fleet gate"
  - "compiled route sync promotion"
  - "graduated manifest refresh"
  - "canonical seven compiled status"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/004-parity-regression-and-closeout"
    last_updated_at: "2026-08-16T07:53:20.991Z"
    last_updated_by: "markdown-agent"
    recent_action: "Proved fleet parity, promoted the graduated fleet, and closed the program in this worktree."
    next_safe_action: "Retry the final daemon-owned Phase 020 index scan when the memory service is available."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Parity, Regression, and Closeout

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Phase 004 proves that the seven adopted root `ROUTER.md` hubs serve compiled, fresh routing and then closes the program. It rebuilds each changed hub's rollout artifacts through its `009-parent-hub-rollout` harness owner, runs all seven canaries, writes adjudication before updating any authored hash or route-gold expectation, refreshes only existing graduated activation manifests through `compiled-route-manifest.cjs refresh`, proves authored freshness for all seven, runs the `compiled-route-sync.cjs --check`/promotion/`--verify` sequence with a retained rollback, reverts and stops on any post-publish failure, finalizes rollback only after every gate passes, asserts the seven canonical hubs report compiled-serving and fresh via `compiled-route-status.cjs --all`, and closes with recursive strict validation, canonical metadata/index regeneration, and a final scoped diff.

**Key Decisions**: remediation stays bounded to routing inputs, generated expectations changed by this migration, compilation, canary/parity fixtures, activation-manifest freshness, and promoted-closure construction (ADR-001); fleet proof uses owner-harness rebuilds plus the seven-canary gate (ADR-002, ADR-003); authored hashes and route-gold change only after a written adjudication row (ADR-004); manifests refresh graduated only, never via shadow-era `activate-hub` or the mcp-tooling direct-mirror exception without new approval (ADR-005); promotion is the canonical `compiled-route-sync` closure with retained rollback, revert-on-failure, and late finalize (ADR-006); the canonical-seven status assertion is the only completion trigger (ADR-007); metadata, continuity, and index state regenerate through the canonical save path (ADR-008).

**Critical Dependencies**: the ratified Phase 001 contract and fleet matrix, the Phase 002 validator/doctor/package fixtures, the seven Phase 003 adoption checkpoint receipts, the frozen replay and scorer trio, the seven `009-parent-hub-rollout` harness owners, the graduated activation manifests, the `compiled-route-*.cjs` tool chain, and `generate-context.js`.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-15 |
| **Ratified** | 2026-08-16 |
| **Worktree** | `.worktrees/010-root-router-document-standard` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../003-seven-hub-root-adoption/spec.md` |
| **Successor** | None (program closeout) |
| **Execution Boundary** | Authoring pass: writes only inside this child folder. Execution pass: this child folder plus the compiled-routing tool surfaces it runs (build harnesses, graduated manifests, promotion closure, status surfaces). No live router policy, frozen scorer, or unrelated surface is eligible. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 003 leaves seven canonical hubs on root `ROUTER.md` with byte-preserved policy, but the fleet is not yet proven: rollout artifacts must be rebuilt from the adopted inputs, canaries and parity must be green, authored activation manifests must be fresh, the promoted closure must verify, and status must report the seven canonical hubs compiled-serving and fresh. The 020 program cannot close on migration receipts alone, and an unconstrained repair pass would widen scope into advisor, command, packet, or product behavior.

### Purpose

Prove parity between authored root routers and compiled serving for all seven hubs, refresh and promote the graduated fleet state with a retained rollback path, report the canonical seven status, and produce the recursive-strict-valid, metadata-fresh, diff-clean closeout package that the program's phase handoff contract requires.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Bounded routing-only remediation of post-adoption drift in authored routing inputs, generated expectations or hashes changed by this migration, router compilation, canary/parity fixtures, activation-manifest freshness, and promoted-closure construction.
- Rebuilding every changed hub's rollout artifacts through its own `009-parent-hub-rollout/<entry>/harness/build-artifacts.cjs` owner and recording the canonical JSON receipt.
- Running all seven canaries and inspecting route-gold, real-hub mode names, typed leaf sets, bundle/ambiguous routes, and zero-signal fallback behavior.
- Writing a child-local adjudication row before any authored-hash or route-gold expectation update.
- Refreshing existing graduated activation manifests through `.opencode/bin/compiled-route-manifest.cjs refresh`, preserving generation, serving authority, shadow-only state, and fencing semantics; proving authored freshness for all seven.
- Running `.opencode/bin/compiled-route-sync.cjs --check`, then the canonical fleet promotion with a retained rollback path, then promoted `--verify` plus parity, kill-switch, and representative route probes.
- Reverting with `--revert <rollback>` and stopping on any post-publish gate failure; finalizing the rollback closure only after every post-publish gate passes.
- Running `.opencode/bin/compiled-route-status.cjs --all` and asserting the seven canonical hubs report compiled-serving and fresh, excluding temporary manifest-test/race fixtures.
- Strict validation of every `020` child and recursive strict validation of `015-router-unification-program`.
- Regenerating child, `020`, `015`, and ancestor metadata/continuity through `generate-context.js`, including the canonical DB/index scan.
- Inspecting the final scoped diff/status and removing task-created temporary artifacts.

### Out of Scope

- Editing frozen `router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`, or their protected digests.
- Changing route-scoring policy, replay selection order, scorer weights, or hub fallback semantics.
- Using shadow-era `activate-hub` tooling or the mcp-tooling direct-mirror exception without new user approval.
- Rewriting historical changelogs, benchmark reports, or archived packets.
- Any unrelated advisor feature, command behavior, packet redesign, or product change; such a blocker halts the phase with LOGIC-SYNC.
- Committing, merging, or pushing the isolated worktree; Git integration remains an operator action.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Normative Phase 004 parity, promotion, and closeout contract |
| `plan.md` | Modify | Serial rebuild, canary, adjudication, refresh, promotion, verify, and closeout procedure |
| `tasks.md` | Modify | Receipt-backed task ledger |
| `checklist.md` | Create | P0/P1/P2 handoff gates |
| `decision-record.md` | Create | Proposed closeout decisions for ratification |
| `implementation-summary.md` | Modify | Completed delivery state (receipt-backed) |
| `description.json` | Create | Level and discovery metadata |
| `graph-metadata.json` | Regenerate | Normalized graph metadata |
| `scratch/closeout/**` | Create during execution | Rebuild, canary, adjudication, refresh, sync, promotion, status, and diff receipts |

All paths above are relative to this child folder. Compiled-routing surfaces are execution targets run by their owning tools; this authoring pass writes nothing outside this child folder.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Bound remediation to routing inputs. | A repair is eligible only if it touches authored routing inputs, generated expectations or hashes changed by this migration, router compilation, canary/parity fixtures, activation-manifest freshness, or promoted-closure construction; any other repair is denied before it starts. |
| REQ-002 | Rebuild each changed hub through its owner. | Every hub whose inputs changed since its last build runs `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/<entry>/harness/build-artifacts.cjs`, and the canonicalized JSON receipt records source inputs, compiled artifacts, activation artifacts, effective policy hash, graph hash, and status `built`. |
| REQ-003 | Run the seven-canary fleet gate. | All seven canonical hubs run their canary owner; each receipt covers route-gold, real-hub mode names, typed leaf sets, bundle/ambiguous routes, and zero-signal fallback behavior; every canary exits 0 before any expectation update. |
| REQ-004 | Adjudicate before updating expectations. | No authored hash, route-gold expectation, or manifest fixture is updated before a child-local adjudication row records the prior value, the migration cause, the expected delta, and the reviewer decision; frozen replay/scorer digests are never adjudicated into a new value. |
| REQ-005 | Keep frozen replay and scorer digests unchanged. | `router-replay.cjs`, `score-skill-benchmark.cjs`, and `load-playbook-scenarios.cjs` match the Phase 001 pinned SHA-256 values before and after every Phase 004 action. |
| REQ-006 | Refresh manifests graduated only. | Existing graduated activation manifests refresh through `.opencode/bin/compiled-route-manifest.cjs refresh`; generation, serving authority, shadow-only state, and fencing semantics are preserved; no shadow-era `activate-hub` invocation occurs; the mcp-tooling direct-mirror exception is not used without new user approval. |
| REQ-007 | Prove authored freshness for all seven. | Every canonical hub's authored activation manifest is valid and fresh, with its manifest freshness receipt captured before the sync check runs. |
| REQ-008 | Run the sync check before promotion. | `.opencode/bin/compiled-route-sync.cjs --check` traces the authored closure without writing and exits 0. |
| REQ-009 | Promote with a retained rollback and verify. | The canonical fleet promotion runs `.opencode/bin/compiled-route-sync.cjs` (default mode), retains its rollback root as reported, then promoted `--verify` exits 0 and parity, kill-switch, and representative route probes pass. |
| REQ-010 | Revert and stop on post-publish failure. | Any post-publish gate failure triggers `.opencode/bin/compiled-route-sync.cjs --revert <rollback>` and halts further promotion; the rollback closure is finalized via `--finalize <rollback>` only after every post-publish gate passes. |
| REQ-011 | Assert the canonical-seven status. | `.opencode/bin/compiled-route-status.cjs --all` reports the seven canonical hubs compiled-serving and fresh; temporary manifest-test or race fixtures are excluded from the assertion and never substitute for a canonical hub. |
| REQ-012 | Run recursive strict validation. | Every `020` child passes `validate.sh <child> --strict` exit 0, and `validate.sh specs/sk-doc/019-skill-routing-refactor/015-router-unification-program --recursive --strict` exits 0. |
| REQ-013 | Regenerate metadata and continuity. | `generate-context.js` regenerates all four children and parent pointers; final daemon-owned index freshness has an explicit receipt and retry disposition. |
| REQ-014 | Close with a clean scoped diff. | No staged files exist; every changed path is inside this child folder or a named execution surface; task-created temporary artifacts are removed; Git integration is not performed. |
| REQ-015 | Stop on unrelated blockers with LOGIC-SYNC. | If 7/7 compiled/fresh requires an unrelated advisor feature, command behavior, packet redesign, or product change, the phase halts and records LOGIC-SYNC instead of widening scope. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-016 | Run representative route probes. | Per canonical hub, route, bundle, defer, and rollback probes run against the promoted closure with machine-readable receipts. |
| REQ-017 | Verify the kill switch. | With the compiled-routing switch disabled, probes confirm the hub falls back per its serving authority without touching the compiled closure; with the switch enabled, compiled serving resumes. |
| REQ-018 | Keep receipts child-local and rerunnable. | Every execution claim has a command, timestamp, exit code, and receipt under `scratch/closeout/`; repeated runs on unchanged inputs produce identical digests. |
| REQ-019 | Produce a strict-valid draft packet. | All six Level-3 authored documents, `description.json`, and normalized `graph-metadata.json` exist; no unresolved tokens remain; strict validation exits 0 while lifecycle remains draft/planned. |

### Bounded Remediation Eligibility

| Eligible Surface | Eligible Action | Blocked Surface |
|------------------|-----------------|-----------------|
| Authored routing inputs (root `ROUTER.md`, hub router JSON, mode registry, leaf manifests) | Repair to match the ratified contract and Phase 003 receipts | Advisor runtime or index code |
| Generated expectations and hashes changed by this migration | Update only with a prior adjudication row | Frozen replay/scorer files and digests |
| Router compilation | Rebuild through the owning `build-artifacts.cjs` harness | Route-scoring policy, replay selection, scorer weights |
| Canary and parity fixtures | Refresh fixtures that measure routing inputs | Command workflow behavior, packet design, product features |
| Activation-manifest freshness | Graduated `refresh` of existing manifests | Shadow-era `activate-hub` or direct-mirror exception |
| Promoted-closure construction | Canonical `compiled-route-sync` promote/verify/revert/finalize | Any change outside the compiled-routing tool chain |

### Fleet Promotion and Rollback Sequence

```text
preflight and frozen pins
        |
        v
owner-harness rebuilds (changed hubs only)
        |
        v
seven-canary gate (route-gold, modes, leaves, bundles, fallbacks)
        |
        v
adjudication rows -> expectation updates (never before adjudication)
        |
        v
compiled-route-manifest.cjs refresh (graduated only) -> freshness for all seven
        |
        v
compiled-route-sync.cjs --check (read-only trace)
        |
        v
canonical promotion (retained rollback) -> promoted --verify
        |
        v
parity, kill-switch, and representative route/bundle/defer/rollback probes
        |
        v
post-publish gate result
        |                       |
   pass:                     fail:
   status --all (7/7)        --revert <rollback> and stop
   --finalize <rollback>
        |
        v
recursive strict validation -> metadata/continuity and index scan -> final scoped diff
```
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every changed hub rebuilds through its owner harness with a canonical `status: built` receipt and no out-of-owner build. — Met; `scratch/closeout/rebuild-matrix.json` 7/7 built.
- **SC-002**: All seven canaries exit 0 with the full inspection set captured, before any expectation changes. — Met; `scratch/closeout/canary-matrix.json` 7/7 GREEN.
- **SC-003**: Every authored-hash or route-gold update is preceded by an adjudication row; zero unadjudicated expectation writes occur. — Met; ADJ-001..ADJ-005 ledger.
- **SC-004**: The frozen replay and scorer trio matches the Phase 001 pins before and after all Phase 004 actions. — Met; re-verified 2026-08-16 (`14f169a4…`/`05bf38b8…`/`f5b44150…`).
- **SC-005**: Only existing graduated manifests refresh through `compiled-route-manifest.cjs refresh`; generation, serving authority, shadow-only state, and fencing semantics hold; no `activate-hub` and no direct-mirror exception occur. — Met; 7/7 refreshed; prohibited-tool scan clean.
- **SC-006**: Authored freshness is proven for all seven before `--check`, and `compiled-route-sync.cjs --check` exits 0. — Met; freshness 7/7; check exit 0 (55 files/7 hubs; re-verified 2026-08-16).
- **SC-007**: Promotion retains its rollback, promoted `--verify` exits 0, and parity, kill-switch, and representative probes pass. — Met; 62 files promoted; verify 7/7 zero spec reads; probes 7/7.
- **SC-008**: Any post-publish failure reverts with `--revert <rollback>` and stops; rollback finalize occurs only after all post-publish gates pass. — Met; no post-publish failure occurred; finalize ran after all gates (0 external manifests).
- **SC-009**: `compiled-route-status.cjs --all` asserts the seven canonical hubs compiled-serving and fresh; no temporary fixture substitutes for a canonical hub. — Met; re-verified 2026-08-16 (7 rows, all fresh).
- **SC-010**: Every `020` child passes strict validation and the `015` recursive strict run exits 0. — Met; all four child gates, the 020 recursive gate, and the 015 recursive gate exited 0 on 2026-08-16.
- **SC-011**: Metadata and continuity regenerate through `generate-context.js`, and final index freshness has an explicit disposition. — Met; canonical saves exited 0; two final daemon scans timed out with retryable exit 75 and are documented as deferred.
- **SC-012**: The final diff is scoped, staging is empty, temporary artifacts are removed, and no repository-completion claim is made. — Met; `scratch/closeout/out-of-scope-paths.txt` empty; staging empty; sweep receipt; no completion claim from this worktree.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 adoption receipts | Phase 004 cannot prove parity without the frozen baseline | Treat `003/spec.md`, its seven checkpoint receipts, and the Phase 001 matrix as read-first authority |
| Dependency | Seven `009-parent-hub-rollout` harness owners | Rebuilds and canaries cannot run | Invoke each hub's own `build-artifacts.cjs` and `validate-canary.cjs`; no shared-path rebuilds |
| Dependency | Graduated activation manifests | Refresh could destabilize serving authority | Refresh only existing manifests; preserve generation, serving authority, shadow-only state, and fencing |
| Dependency | `compiled-route-*.cjs` tool chain | Promotion and status cannot be proven | Read the usage contract before invocation; record exact flags and exits |
| Dependency | Frozen replay and scorer trio | Route-gold comparisons become meaningless if drifted | Pin before and after every action; mismatch halts with LOGIC-SYNC |
| Risk | Remediation widens into unrelated surfaces | Scope breach | REQ-001 eligibility table and a hard pre-edit check |
| Risk | Expectations updated before adjudication | Unreviewed gold drift | REQ-004 adjudication-first gate |
| Risk | Manifest refresh mutates non-graduated or shadow manifests | Serving-authority confusion | REQ-006 graduated-only rule and before/after manifest diff |
| Risk | Promotion breaks serving after publish | Live route regressions | Retained rollback, `--revert` on failure, late `--finalize` |
| Risk | Temporary fixtures pollute the status assertion | False 7/7 green | REQ-011 canonical-only assertion and explicit fixture exclusion |
| Risk | Metadata or index gates skipped in the isolated worktree | Main side stays stale | REQ-013 regeneration plus the completed canonical save and strict-validation gate |
| Risk | Unrelated blocker silently patched | Program scope breach | REQ-015 LOGIC-SYNC halt |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: All rebuild, canary, refresh, sync, promotion, verify, and status commands complete locally without network access.
- **NFR-P02**: Each receipt is independently rerunnable and bounded to one hub or one tool surface.

### Security

- **NFR-S01**: Receipts contain no secrets, environment values, user data, or absolute paths outside the worktree and this spec folder.
- **NFR-S02**: Hashing and tracing read bytes only; nothing in Phase 004 rewrites a frozen source or protected digest.

### Reliability

- **NFR-R01**: Every command records its exit code and fails closed on parse, missing-file, hash, or count mismatch.
- **NFR-R02**: Repeated runs on unchanged inputs produce identical digests, freshness, and status rows.
- **NFR-R03**: A hash, freshness, canary, or post-publish mismatch blocks the phase instead of auto-blessing a new value.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries

- **Unchanged hub**: a hub whose inputs match its last build still runs its canary and status probes; no rebuild is required.
- **Non-graduated manifest**: any manifest outside the graduated set fails the refresh eligibility check and is left untouched.
- **Temporary fixture**: manifest-test and race fixtures are recorded in status output but excluded from the canonical-seven assertion.
- **Freshness failure**: a stale authored manifest blocks `--check` and promotion until refresh completes through the graduated path.
- **Shadow-only manifest**: a shadow-only manifest keeps its shadow-only state; refresh never promotes it by itself.

### Error Scenarios

- **Frozen digest mismatch**: stop the phase and record LOGIC-SYNC; the Phase 001 pins are immutable.
- **Canary non-zero**: record the command and failure; the fleet gate stays open and no expectation update occurs.
- **Adjudication missing**: any requested expectation update is denied until the adjudication row exists.
- **Promoted verify failure**: run `--revert <rollback>` immediately and stop; never finalize a failed publication.
- **Kill-switch probe failure**: the compiled path leaks into the disabled switch state; revert and stop.
- **Status missing a canonical hub**: the 7/7 assertion fails even when all temporary fixtures report green.
- **Unrelated blocker**: any requirement for an advisor feature, command behavior, packet redesign, or product change halts with LOGIC-SYNC.

### State Transitions

- **Draft to ratified**: completed 2026-08-16; every P0 checklist item carries concrete receipt evidence under `scratch/closeout/`.
- **Draft to complete**: completed by the execution pass for the worktree implementation; the 004 closeout handoff is recorded in `scratch/closeout/handoff-contract.md`.
- **Promotion to finalized**: completed via `--finalize <rollback>` after every post-publish gate passed (0 external manifests discarded; no publication lock remains).
- **Worktree closeout**: the repository-completion claim stays blocked until integration is authorized and the authoritative gates rerun from a safe primary checkout (`scratch/closeout/final-index-status.md`).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 21/25 | Seven-hub rebuild/canary matrix, manifest refresh, promotion, probes, recursive validation, metadata regeneration |
| Risk | 24/25 | Live serving promotion, retained rollback, kill-switch behavior, frozen digests, main-side index gate |
| Research | 13/20 | Tool-usage confirmation, probe design, status-surface semantics |
| Multi-Agent | 12/15 | Serial phase handoffs, per-hub harness owners, completed canonical metadata/index integration |
| Coordination | 15/15 | Seven-hub gates, strict recursive validation, main-side DB/index coordination |
| **Total** | **85/100** | **Level 3 architecture packet** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Remediation touches an unrelated surface | H | M | REQ-001 eligibility gate before any repair |
| R-002 | Expectations updated without adjudication | H | M | REQ-004 adjudication-first row |
| R-003 | Frozen replay or scorer bytes drift | H | L | Pins before and after; mismatch halts |
| R-004 | Manifest refresh mutates serving authority | H | M | Graduated-only refresh with before/after diff |
| R-005 | Promotion breaks post-publish serving | H | M | Retained rollback; revert and stop on failure |
| R-006 | Rollback finalized before gates pass | H | L | Finalize only after every post-publish gate |
| R-007 | Temporary fixtures masquerade as canonical hubs | H | M | Canonical-only status assertion |
| R-008 | Metadata and index regeneration skipped | M | M | `generate-context.js` plus completed canonical save and strict-validation gate |
| R-009 | An unrelated blocker widens program scope | H | L | LOGIC-SYNC halt instead of a patch |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Fleet Owner Proves Parity (Priority: P0)

**As a** fleet owner, **I want** rebuilt artifacts, green canaries, and adjudicated gold, **so that** compiled serving provably matches the adopted root routers.

**Acceptance Criteria**:

1. **Given** the seven adopted hubs, **When** Phase 004 rebuilds each changed hub through its harness owner, **Then** every receipt reports `status: built` with a canonical JSON body.
2. **Given** the seven canaries, **When** the fleet gate runs, **Then** every canary exits 0 with route-gold, mode, leaf, bundle, and fallback rows captured.
3. **Given** an expected authored hash or route-gold change, **When** adjudication is requested, **Then** no write occurs before the adjudication row exists.

### US-002: Operator Promotes with a Safety Net (Priority: P0)

**As a** routing operator, **I want** a check, promotion, verify, revert, and finalize sequence with a retained rollback, **so that** a bad publication never sticks.

**Acceptance Criteria**:

1. **Given** fresh authored manifests for all seven, **When** `compiled-route-sync.cjs --check` runs, **Then** it exits 0 without writing.
2. **Given** the promotion, **When** any post-publish gate fails, **Then** `--revert <rollback>` runs and promotion stops.
3. **Given** all post-publish gates passing, **When** rollback finalize is requested, **Then** `--finalize <rollback>` completes and only then is the closure discarded.

### US-003: Reviewer Sees the Canonical Seven (Priority: P0)

**As a** reviewer, **I want** a status assertion over exactly the seven canonical hubs, **so that** temporary fixtures never produce a false green.

**Acceptance Criteria**:

1. **Given** `compiled-route-status.cjs --all`, **When** the assertion runs, **Then** each canonical hub reports compiled-serving and fresh.
2. **Given** a manifest-test or race fixture in the output, **When** the assertion evaluates it, **Then** the fixture is excluded from the 7/7 result.

### US-004: Program Owner Approves Closeout (Priority: P0)

**As a** program owner, **I want** recursive strict validation, regenerated metadata, and a scoped final diff, **so that** the program closes without stale or out-of-scope state.

**Acceptance Criteria**:

1. **Given** all `020` children, **When** strict validation runs, **Then** every child exits 0 and the `015` recursive strict run exits 0.
2. **Given** the worktree, **When** the final diff is inspected, **Then** staging is empty, temporary artifacts are removed, and no repository-completion claim is made until integration is authorized.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

None at authoring time. Any requirement to change routing policy, replay selection, scorer weights, protected digests, the Phase 001 matrix, or unrelated advisor/command/packet/product behavior triggers LOGIC-SYNC and stops the phase rather than widening scope.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Approved plan**: `/Users/michelkerkmeester/.pi/agent/plans/01a00512-29e3-7bf3-8288-4454ffb94865.md`
- **Parent phase spec**: `../spec.md`
- **Phase 001 contract**: `../001-contract-and-fleet-audit/spec.md`
- **Phase 002 tooling**: `../002-create-skill-template-and-validator-alignment/spec.md`
- **Phase 003 adoption**: `../003-seven-hub-root-adoption/spec.md`
- **Implementation plan**: `plan.md`
- **Task breakdown**: `tasks.md`
- **Verification checklist**: `checklist.md`
- **Decision record**: `decision-record.md`
- **Implementation summary**: `implementation-summary.md`
