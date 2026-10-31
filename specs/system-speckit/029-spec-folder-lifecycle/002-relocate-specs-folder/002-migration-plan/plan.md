---
title: "Implementation Plan: Specs-Root Migration Plan"
description: "Concrete design for the topology-flip migration: which of the 21 resolver-registry entries need real changes, and how the existing spec-root-* primitives compose into a new topology-flip operation."
trigger_phrases:
  - "specs root migration design"
  - "resolver registry inversion"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-relocate-specs-folder/002-migration-plan"
    last_updated_at: "2026-08-06T18:04:13Z"
    last_updated_by: "claude-code"
    recent_action: "Added SPEC_KIT_SPECS_DIR mechanism per fresh Opus review"
    next_safe_action: "Operator accepts or rejects ADR-002"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-system-speckit-032-relocate-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Specs-Root Migration Plan

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (spec-root-* subsystem), Bash (create.sh, validate.sh), Node (Memory MCP server) |
| **Framework** | `.opencode/skills/system-spec-kit/scripts/core/spec-root-*.ts` |
| **Storage** | Filesystem (git-tracked packet trees), Spec Kit Memory MCP database |
| **Testing** | `spec-root-validation-matrix.vitest.ts` (61 cases), `spec-root-fault-injection.vitest.ts` — both need review, not assumed to transfer |

### Overview
Read the 5 `spec-root-*` files in full and confirmed: the reusable parts are primitives (collision classification, byte-verified copy/move, quarantine, deterministic manifest hashing, writer freeze), not the top-level mutation functions as-is. `migrateLegacyOnlyToCanonical` is hardcoded to move packets found only under `specs` (legacy) into `.opencode/specs` (canonical) — a packet-consolidation operation between two independently-real trees. Today `specs` is a **symlink** to `.opencode/specs`, so `classifySpecRootCollision`'s own logic (`haveSameInode`, comparing `dev`/`ino`) would classify every existing packet as `same-inode-alias`, and the migration loop explicitly skips anything that isn't `legacy-only`. Calling the existing function as-is today is a no-op — it doesn't perform a topology flip.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 001 research read and reconciled
- [x] All 5 spec-root-* files read in full
- [x] Registry entries grouped by real-change vs. no-change

### Definition of Done
- [x] Topology-flip operation design documented (this file, §4)
- [x] 21-entry registry grouped with rationale (§3)
- [x] decision-record.md names the open policy decision
- [x] `validate.sh --recursive --strict` on the parent packet passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Compose a new topology-flip operation on top of the existing `spec-root-*` primitives, rather than repointing `migrateLegacyOnlyToCanonical`'s hardcoded roots. The primitives (`classifySpecRootCollision`, `copyDirectoryVerified`, `moveDirectoryVerified`, `assertQuarantineLocation`, `assertWritersUnfrozen`, `buildMigrationManifest`) are direction-agnostic enough to reuse; the orchestration around them is not.

### Resolver registry — grouped by whether the flip needs a real code change

**Needs a real precedence change (7 of 21)** — these are `canonical-first` or `canonical-only`, meaning they actively prefer or require `.opencode/specs` today:

| File | Symbol | Current behavior | Change needed |
|------|--------|-------------------|----------------|
| `mcp-server/handlers/memory-index-discovery.ts:203-223,308-382` | `findSpecDocuments` / `findGraphMetadataFiles` | Uses legacy (`specs`) only when canonical (`.opencode/specs`) is absent | Flip which root is checked first |
| `shared/gate-3-classifier.ts:125-137,348-418` | `SPEC_ROOTS` / `findWorkspaceRoot` / `getSpecRoots` / `collectSpecFolderCandidates` | Enumerates canonical before legacy | Flip enumeration order |
| `scripts/graph/migrate-generated-json.ts:149-170,590-598` | `resolveRepoRoot` / `parseArgs` | Defaults directly to canonical, no fallback | Flip the hardcoded default |
| `scripts/graph/backfill-graph-metadata.ts:238-259,278-319` | `resolveRepoRoot` / `resolveScopedTarget` / `planBackfill` | Defaults directly to canonical, no fallback | Flip the hardcoded default |
| `mcp-server/startup-checks.ts:261-292` | `resolveWorkspaceSpecPath` / `resolveMovedFolder` | Accepts only paths under canonical root | Accept the new canonical root instead |
| `mcp-server/lib/resume/resume-ladder.ts:863-910` | `resolveFromFolderPath` / `resolveSpecFolder` | Checks canonical before legacy | Flip check order |
| `mcp-server/lib/continuity/authored-continuity-snapshot.ts:50-70` | `normalizeSpecFolder` / `resolveSpecFolderPath` | Checks canonical before legacy | Flip check order |

**Already flip-compatible or path-agnostic (14 of 21)** — `legacy-first`, `direct-path-first`, or `membership-only` entries already treat both roots symmetrically or already prefer the (currently) legacy `specs` spelling. These need **relabeling** (what today's code calls "legacy" becomes the new canonical, and vice versa) but not new precedence logic: `config.ts`, `subfolder-utils.ts`, `folder-detector.ts`, `generate-context.ts`, `collect-session-data.ts`, `workflow.ts`, `directory-setup.ts`, `nested-changelog.ts`, `create.sh` (`SPECS_DIR` selection — note: this registry entry describes explicit-destination handling, which is separate from `create.sh`'s *default* root when no destination is given — see phase 001 finding, still a real default-flip item, just not from this registry entry), `context-server.ts` pending-recovery, `folder-discovery.ts`, `indexing.ts`, `spec-affinity.ts`, `validate-memory-quality.ts`.

This 7-vs-14 split is a stronger cross-check than either research round produced alone: it lands almost exactly on phase 001's independent "~5-7 hardcoded literals" estimate, now backed by the actual registry rather than inferred from citations.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `spec-root-registry.ts` | Documents current canonical/legacy assumption per call site | Update `precedence` values and `consumerOrEffect` text for the 7 flipped entries | Registry `registryCoverageGaps()` still returns empty |
| `spec-root-collision-classifier.ts` | `haveSameInode` classification | No change needed — same-inode-alias detection is direction-agnostic | Existing behavior verified correct for the current (symlinked) state |
| `spec-root-migration.ts` | Packet-consolidation between two real roots | **New function needed**: a topology-flip operation, not a repoint of `migrateLegacyOnlyToCanonical`'s hardcoded roots | New function reuses `copyDirectoryVerified`/`moveDirectoryVerified`/`assertQuarantineLocation` |
| `spec-root-migration-manifest.ts` | Read-only baseline/audit | Reusable as-is for pre-flip baseline (confirms zero divergent-duplicates today) | `buildMigrationManifest` run before any mutation |
| `spec-root-write-guard.ts` | Blocks writes causing divergent-duplicate collisions | Flip which literal is `'canonical'` vs `'legacy'` (2-line change) | `assertSpecWriteAllowed` still rejects true divergence post-flip |

Required inventories: the 7-entry table above is the complete real-change surface derived directly from the registry, not sampled.

### Addendum from ADR-002 (downstream-ownership review): 5 more call sites, pending acceptance

A fresh Opus review of ADR-002 recommends a `SPEC_KIT_SPECS_DIR` env-var override (mirroring the already-shipped `SPEC_KIT_DB_DIR` pattern) so a downstream project can opt into owning its own specs. If ADR-002 is accepted, thread the override through these 5 additional call sites — on top of, not instead of, the 7-entry registry inversion above: `context-server.ts:1306-1307`, `api/indexing.ts:82,87`, `extractors/collect-session-data.ts:1205-1208`, `loaders/data-loader.ts:89`, `hooks/lib/spec-gate/spec-gate-core.mjs:853`. The same review found `context-server.ts:1303-1307` and `api/indexing.ts:82-87` already disagree on root-check order today (masked while `specs` is a symlink) — unify precedence to `explicit override → specs → .opencode/specs` while touching these files.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Named phases below are for a future execution phase — not run here.

### Phase A: Baseline & Design (would open the execution phase)
- [ ] Run `buildMigrationManifest` against the current tree; confirm zero divergent-duplicate entries (expected: everything classifies `same-inode-alias`, since `specs` is currently a symlink)
- [ ] Write the new topology-flip function: materialize `specs/` as a verified real copy of `.opencode/specs/`, then replace `.opencode/specs` with a relative symlink `../specs`, reusing `copyDirectoryVerified` for the byte-verified copy and `assertQuarantineLocation`-style safety checks
- [ ] Flip the 7 registry entries in §3, updating both the resolver logic and the registry's own `precedence` metadata

### Phase B: Reindex & Cutover
- [ ] Reindex Memory MCP against the new physical root; verify row counts and `spec_folder` identity stability before/after
- [ ] Update CI (`strict-pass-freshness-sweep.yml`'s `--roots` argument) and Gate 3 / `AGENTS.md` example paths
- [ ] **Atomic with the symlink flip, not a separate commit**: rewrite the 4 downstream-project `.gitignore` entries (`ai-systems`, `anobel.com`, `barter`, `z-future`) from `.opencode/specs/<project>` to `specs/<project>`, then verify with `git check-ignore -v specs/ai-systems specs/anobel.com specs/barter specs/z-future` and confirm `git status --porcelain` shows no new untracked project trees before the flip commit is considered done — per ADR-002, the intermediate state between the flip and this rebase silently exposes private downstream data as untracked-and-unignored in a public repo
- [ ] If ADR-002 is accepted: implement `SPEC_KIT_SPECS_DIR` override across the 5 call sites named in the FIX ADDENDUM addendum above, and update `PUBLIC-RELEASE.md` to document the opt-in

### Phase C: Verification
- [ ] Invert (not just relabel) the 61-test validation matrix; add the Git-index and Memory MCP assertions the current suite lacks
- [ ] Run the full proof plan from phase 001's research (`research/research.md` §5 in the original synthesis) plus this phase's registry-flip checklist
- [ ] Rehearse rollback via `restoreFromQuarantine`-equivalent logic before treating the cutover as final
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Baseline audit | Confirm zero divergent-duplicates pre-flip | `buildMigrationManifest` (reused as-is) |
| Unit | Inverted registry entries | Existing + new unit tests per flipped resolver |
| Fixture matrix | Topology-flip specific cases (only-`specs`, only-`.opencode/specs`, symlink-aliased, divergent) | Inverted `spec-root-validation-matrix.vitest.ts` + new cases |
| Structural | This packet's own docs | `validate.sh --recursive --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator answer on downstream-ownership policy | External (operator) | Open — see decision-record.md | Blocks scoping an execution phase, not this planning phase |
| `spec-root-*` subsystem stability | Internal | Green — read and verified in full this phase | An execution phase would need to re-verify after any unrelated changes to these files |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Not applicable to this phase — no mutations occur. For a future execution phase: any post-flip regression, failed reindex, or failed verification gate.
- **Procedure**: This phase changes only its own planning docs. A future execution phase's rollback would use `restoreFromQuarantine`-equivalent logic per phase 001's research §5 rollback boundary (safe before new canonical writes land; requires a full writer-freeze-and-migrate-back transaction after).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Phase A    │────►│  Phase B    │────►│  Phase C    │
│  Baseline   │     │  Reindex    │     │  Verify     │
│  & Design   │     │  & Cutover  │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Registry inversion (7 entries) | Baseline manifest | Updated resolver precedence | Reindex |
| Topology-flip function | Registry inversion | Real `specs/` tree + back-symlink | Reindex, cutover |
| Memory MCP reindex | Topology-flip function | Verified row counts | Verification |
| Downstream-ownership decision | Operator answer | `.gitignore`/`PUBLIC-RELEASE.md` update | Cutover completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Operator answers the downstream-ownership decision** - blocking, no estimate - CRITICAL
2. **Topology-flip function written and baseline-verified** - a future execution phase - CRITICAL
3. **Registry inversion (7 entries) + reindex** - a future execution phase - CRITICAL

**Total Critical Path**: Gated entirely on the operator decision; the technical work itself has no phase-001-style iteration cap.

**Parallel Opportunities**:
- Registry relabeling (14 no-change entries) and CI/docs updates can run alongside the topology-flip function's development
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|-------------------|--------|
| M1 | This planning phase complete | `decision-record.md` and `plan.md` reviewed | Phase 002 (this phase) |
| M2 | Downstream-ownership decision answered | `decision-record.md` ADR-002 status flips to Accepted | Before phase 003 is scoped |
| M3 | Execution phase scoped and baselined | `buildMigrationManifest` run, zero divergent-duplicates confirmed | Phase 003 (not yet created) |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for the full ADR-001 and ADR-002 records — this plan does not duplicate them.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
Before a future execution phase starts: (1) confirm this plan and `decision-record.md` are still current, (2) confirm `decision-record.md` ADR-002 status is Accepted, (3) run `buildMigrationManifest` fresh and confirm zero divergent-duplicates, (4) confirm no unrelated changes have landed in any of the 5 `spec-root-*` files since this phase was written.

### Execution Rules
| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Follow `plan.md` §4 Phase A → B → C in order; do not reindex Memory MCP before the topology-flip function is baseline-verified |
| TASK-SCOPE | Do not touch files outside the 7-entry registry list and the new topology-flip function without a documented reason |

### Status Reporting Format
Each execution-phase task reports: what ran, the real command output, and whether the check passed or failed — matching this planning phase's own evidence style in `tasks.md`.

### Blocked Task Protocol
If any task in `plan.md` §4 is BLOCKED, halt and report the blocker with evidence rather than working around it — consistent with this repo's Halt Conditions.
