---
title: "Implementation Plan: Specs-Root Migration Execution"
description: "Literal, ordered runbook for the specs-root topology flip: exact commands, exact verification, exact rollback triggers. Not run in this phase."
trigger_phrases:
  - "migration execution runbook"
  - "topology flip steps"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-relocate-specs-folder/003-migration-execution"
    last_updated_at: "2026-08-06T19:31:37Z"
    last_updated_by: "claude-code"
    recent_action: "Runbook drafted from phase 002's accepted design"
    next_safe_action: "Operator reviews, then separately approves an actual run"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-system-speckit-032-relocate-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Specs-Root Migration Execution

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (spec-root-* subsystem, Memory MCP server), Bash (create.sh, validate.sh), Git |
| **Framework** | `.opencode/skills/system-spec-kit/scripts/core/spec-root-*.ts` |
| **Storage** | Filesystem (git-tracked packet trees), Spec Kit Memory MCP database |
| **Testing** | Inverted `spec-root-validation-matrix.vitest.ts` + new Git-index/Memory MCP assertions |

### Overview
This is the literal runbook phase 002 named but didn't write out. Eleven numbered steps, each with an exact command or code change and its own pass/fail check. Steps 1-3 are read-only or additive (safe to run and inspect). Step 4 is the one atomic, hard-to-reverse step (symlink flip + `.gitignore` rebase together). Steps 5-11 build on step 4. **None of these steps have been run.**
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 002's ADR-001 and ADR-002 both Accepted
- [x] All 21 registry entries' current behavior known (phase 002 §3)
- [x] The atomic-flip requirement (no split commits) named explicitly (ADR-002 risk table)

### Definition of Done (for RUNNING the runbook, not for this scoping phase)
- [ ] All 11 steps below executed in order, each verification passing before the next step starts
- [ ] `validate.sh --recursive --strict` passes across the whole repo, not just this packet
- [ ] `git status --porcelain` shows no untracked/unignored downstream project trees
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sequential runbook with a hard gate before the one atomic mutating step (step 4). Steps 1-3 are inspect/build-only (no repo mutation). Step 4 is the point of no easy return. Steps 5-11 assume step 4 succeeded and verified clean.

### Key Components
- **Baseline tooling**: `buildMigrationManifest` (reused as-is, read-only)
- **New function**: the topology-flip operation (step 3) — does not exist yet, this runbook is where its exact shape gets specified
- **Registry + call-site edits**: 7 registry entries (phase 002 §3) + 5 `SPEC_KIT_SPECS_DIR` call sites (phase 002 ADR-002 addendum)

### Data Flow
Manifest baseline → new tree materialized → symlink flipped + gitignore rebased atomically → registry/resolvers updated → CI/docs updated → Memory MCP reindexed → full verification.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Filesystem (`.opencode/specs/`, `specs/`) | `.opencode/specs` real, `specs` symlink | Flip: `specs` becomes real, `.opencode/specs` becomes symlink | `readlink specs` fails (not a symlink); `readlink .opencode/specs` returns `../specs` |
| `.gitignore` lines 264-267 | `.opencode/specs/<project>` entries | Rewrite to `specs/<project>` | `git check-ignore -v specs/ai-systems specs/anobel.com specs/barter specs/z-future` all match |
| 7 registry-flagged files (phase 002 §3) | Canonical-first/only | Flip precedence | Each file's own resolver returns `specs/...` first when both roots exist |
| 5 `SPEC_KIT_SPECS_DIR` call sites (ADR-002) | No override support | Add override, resolved via `path.resolve(process.cwd(), override)` | Setting the env var and calling each resolver returns the override path |
| Memory MCP database | Indexed against old physical root | Reindex | Row counts and `spec_folder` identity match pre/post |

Required inventories: the 7+5 = 12 call sites are the complete list carried from phase 002; not sampled.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

This is the runbook — not yet run.

### Phase A: Read-Only & Additive (Steps 1-3)

#### Step 1 — Pre-flight (read-only)
```bash
git status --porcelain   # must be clean before starting
devin auth status; cursor-agent about   # not needed for this phase, listed for completeness of prior patterns
grep -A3 "Status.*Accepted" .opencode/specs/system-speckit/032-relocate-specs-folder/002-migration-plan/decision-record.md
```
**Check**: both ADRs still show `Accepted`; `git status --porcelain` is empty outside expected work-in-progress.
**Rollback**: none needed — nothing mutated yet.

#### Step 2 — Baseline manifest (read-only)
```ts
import { buildMigrationManifest } from '.opencode/skills/system-spec-kit/scripts/core/spec-root-migration-manifest.js';
const manifest = buildMigrationManifest(process.cwd());
console.log(manifest.divergentCount, manifest.entries.length);
```
**Check**: `manifest.divergentCount === 0`. Expect every entry classified `same-inode-alias` (today's actual state, since `specs` is a symlink).
**Rollback**: none needed — read-only.

#### Step 3 — Write the topology-flip function (additive, not yet wired in)
New function, in `spec-root-migration.ts` or a sibling module, NOT called yet:
```ts
export function flipToTopLevelCanonical(workspacePath: string, opts: { quarantinePath: string }): void {
  // 1. Reuse copyDirectoryVerified to materialize `specs/` as a byte-verified copy of `.opencode/specs/`
  // 2. Reuse assertQuarantineLocation-style safety check before touching anything
  // 3. Remove the old `.opencode/specs` directory only after the copy verifies byte-for-byte
  // 4. Create `.opencode/specs` as a RELATIVE symlink to `../specs`
  // 5. Never touch `specs/` after step 1 — it is the new source of truth from that point on
}
```
**Check**: unit test against a fixture directory (not the real repo) — verify the function produces `specs/` real + `.opencode/specs -> ../specs`, and refuses to run if `manifest.divergentCount > 0`.
**Rollback**: delete the new function file. Nothing in the real repo touched yet.

### Phase B: The Atomic Mutation (Step 4)

#### Step 4 — THE ATOMIC STEP: flip + `.gitignore` rebase, one commit (irreversible past this point without a real rollback)
```bash
# In one commit, not two:
node -e "require('./spec-root-migration.js').flipToTopLevelCanonical(process.cwd(), {quarantinePath: '/tmp/specs-flip-quarantine'})"
sed -i '' 's#\.opencode/specs/ai-systems#specs/ai-systems#; s#\.opencode/specs/anobel\.com#specs/anobel.com#; s#\.opencode/specs/barter#specs/barter#; s#\.opencode/specs/z-future#specs/z-future#' .gitignore
git add specs .opencode/specs .gitignore
git status --porcelain   # inspect before committing
```
**Check (run BEFORE committing)**:
```bash
git check-ignore -v specs/ai-systems specs/anobel.com specs/barter specs/z-future   # all 4 must match
git status --porcelain   # must show NO untracked project trees
readlink .opencode/specs   # must print ../specs
```
**Only commit if all three checks pass.** This is the single named leak risk from ADR-002 — do not commit the flip and the `.gitignore` rebase separately.
**Rollback (pre-commit)**: `git checkout -- .gitignore; rm -rf specs; git checkout -- .opencode/specs` (or restore from the quarantine path). **Rollback (post-commit)**: `git revert` the commit; if any new canonical write already landed under `specs/` after the commit, use `restoreFromQuarantine`-equivalent logic instead of a bare revert (per phase 001 research §5 rollback boundary).

### Phase C: Build On The Flip (Steps 5-11)

#### Step 5 — Invert the 7 registry entries
Per phase 002 `plan.md` §3, flip precedence in: `memory-index-discovery.ts`, `gate-3-classifier.ts`, `migrate-generated-json.ts`, `backfill-graph-metadata.ts`, `startup-checks.ts`, `resume-ladder.ts`, `authored-continuity-snapshot.ts`. Update `spec-root-registry.ts`'s own `precedence` field for each.
**Check**: `registryCoverageGaps()` returns empty; each flipped resolver, run against a fixture with only a root-level `specs/`, resolves it (not `.opencode/specs`).
**Rollback**: `git revert` this commit; step 4's flip is unaffected since it's a separate commit.

#### Step 6 — Add the `SPEC_KIT_SPECS_DIR` override (ADR-002)
5 call sites: `context-server.ts:1306-1307`, `api/indexing.ts:82,87`, `extractors/collect-session-data.ts:1205-1208`, `loaders/data-loader.ts:89`, `hooks/lib/spec-gate/spec-gate-core.mjs:853`. Pattern (mirrors `SPEC_KIT_DB_DIR`, verified at `mk-spec-memory-launcher.cjs:365-366`):
```ts
const override = process.env.SPEC_KIT_SPECS_DIR?.trim() || process.env.SPECKIT_SPECS_DIR?.trim();
if (override) return path.resolve(process.cwd(), override);
```
**Check**: setting `SPEC_KIT_SPECS_DIR=/tmp/fixture-specs` and calling each of the 5 resolvers returns that path.
**Rollback**: `git revert` this commit.

#### Step 7 — Fix the resolver-precedence disagreement (ADR-002 finding)
Unify `context-server.ts:1303-1307` and `api/indexing.ts:82-87` to the same order: explicit override → `specs` → `.opencode/specs`.
**Check**: both resolvers, run against the same fixture with divergent content in both roots, pick the same directory.
**Rollback**: `git revert`.

#### Step 8 — Update CI and operator-facing docs
`.github/workflows/strict-pass-freshness-sweep.yml`'s `--roots` argument; Gate 3 examples; `AGENTS.md`; `PUBLIC-RELEASE.md` (document the `SPEC_KIT_SPECS_DIR` opt-in per ADR-002).
**Check**: CI workflow file diff reviewed; `grep -c ".opencode/specs" AGENTS.md PUBLIC-RELEASE.md` drops to only the legitimate historical/compat mentions.
**Rollback**: `git revert`.

#### Step 9 — Reindex Memory MCP
Run the Memory MCP server's reindex against the new physical root.
**Check**: row counts and distinct `spec_folder` values match the pre-flip baseline (step 2's manifest); no duplicate physical-path rows; a `memory_search` for a known packet returns the same result as before the flip.
**Rollback**: Memory MCP database is not touched by steps 1-8; restoring it means re-running the reindex against the pre-flip topology if step 4 gets reverted.

#### Step 10 — Invert the 61-test validation matrix
`spec-root-validation-matrix.vitest.ts` and `spec-root-fault-injection.vitest.ts` — flip expected canonical direction, add Git-index and Memory MCP assertions the current suite lacks.
**Check**: full suite green.
**Rollback**: `git revert`.

#### Step 11 — Full verification sweep
```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh . --recursive --strict
git status --porcelain
```
**Check**: exit 0, `Errors: 0 Warnings: 0`, no unexpected untracked files anywhere in the repo.
**Rollback**: N/A — this is the final check, not a mutating step.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Baseline audit | Zero divergent-duplicates before step 4 | `buildMigrationManifest` (step 2) |
| Fixture unit tests | New topology-flip function, in isolation | A throwaway fixture directory, never the real repo |
| Fixture matrix | Inverted validation matrix (61+ cases) | `spec-root-validation-matrix.vitest.ts` post-inversion |
| Integration | Real repo, after step 4 | Steps 4-11's own checks, run in order |
| Full sweep | Whole repo | `validate.sh --recursive --strict` (step 11) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator approval to actually run this runbook | External (operator) | Not yet given — this phase only scopes it | Blocks all 11 steps; scoping itself is unaffected |
| Both ADRs staying Accepted and unchanged since phase 002 | Internal | Green, re-verify at step 1 | Step 1's check would catch drift before mutation starts |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any step's verification fails, or the operator halts mid-run for any reason.
- **Pre-step-4 procedure**: Nothing has mutated the real repo yet (steps 1-3 are read-only or produce an unwired, untested function). Rollback is simply not proceeding.
- **Step-4 procedure (before commit)**: `git checkout -- .gitignore`, remove the newly-materialized `specs/` tree, restore `.opencode/specs` from git. No canonical writes have landed yet, so this is a clean discard.
- **Step-4 procedure (after commit, before any new write lands under `specs/`)**: `git revert` the commit. Safe — nothing downstream has depended on the new topology yet.
- **Step-4 procedure (after commit, after new writes have landed under `specs/`)**: Do NOT bare-revert — that would strand or overwrite the new writes. Freeze writers (`assertWritersUnfrozen`-guarded), treat the new tree as authoritative input, migrate it back to `.opencode/specs` transactionally, then revert the registry/CI/docs commits from steps 5-8.
- **Steps 5-10 procedure**: Each is its own commit; `git revert` any of them independently without touching step 4, since they're additive changes on top of the flipped topology.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌────────┐   ┌────────┐   ┌────────┐   ┌─────────────────┐   ┌─────────┐   ┌────────┐
│ Step 1 │──►│ Step 2 │──►│ Step 3 │──►│ Step 4 (ATOMIC)  │──►│ 5,6,7,8 │──►│ 9,10,11│
│Preflight│   │Baseline│   │New fn  │   │Flip + gitignore  │   │ Registry│   │Reindex │
└────────┘   └────────┘   └────────┘   └─────────────────┘   │ + docs  │   │+ verify│
                                                                └─────────┘   └────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Step 2 (baseline) | Step 1 (clean git state) | Zero-divergent-duplicate confirmation | Step 3 |
| Step 3 (new function) | Step 2 (baseline logic it will call) | Tested, unwired function | Step 4 |
| Step 4 (atomic flip) | Step 3 (the function) | New topology, live in the repo | Steps 5-11 |
| Steps 5-8 | Step 4 | Registry/CI/docs consistent with new topology | Step 9 |
| Step 9 (reindex) | Steps 5-8 | Memory MCP consistent with new topology | Step 10-11 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Step 4 (atomic flip + gitignore rebase)** - the one irreversible-if-botched step - CRITICAL
2. **Step 9 (Memory MCP reindex)** - the step most likely to reveal a design gap in practice - CRITICAL
3. **Step 11 (full verification sweep)** - the only thing that actually proves the migration worked - CRITICAL

**Total Critical Path**: Steps 1-11 are sequential by design — none are safely parallelizable, since each assumes the prior step's verification passed.

**Parallel Opportunities**:
- Steps 6 (SPEC_KIT_SPECS_DIR) and 7 (precedence fix) touch overlapping files and should NOT run in parallel; steps 8 (CI/docs) can be prepared alongside 5-7 and committed after, since it doesn't depend on their internals
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|-------------------|--------|
| M1 | This runbook scoped | `plan.md` and `tasks.md` complete, `validate.sh --recursive --strict` passes | Phase 003 (this phase) |
| M2 | Operator approves an actual run | Separate, explicit approval — not implied by accepting this scope | Before any step 1-11 actually executes |
| M3 | Runbook executed and verified | Step 11's full sweep passes | A future run, not part of this phase |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

No new ADRs in this phase — it executes ADR-001 and ADR-002 from `../002-migration-plan/decision-record.md`, both Accepted.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
Before running ANY step of this runbook for real: (1) confirm `git status --porcelain` is clean, (2) confirm both ADRs in `002-migration-plan/decision-record.md` still show Accepted, (3) confirm this is a separate, explicit operator approval to run — not inferred from this scope being accepted, (4) re-run step 2's baseline manifest fresh, not trusting this phase's snapshot.

### Execution Rules
| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Run steps 1 through 11 strictly in order; never skip ahead to step 4 without steps 1-3's checks passing |
| TASK-SCOPE | Step 4 commits ONLY the flip + gitignore rebase together — never split, never combine with steps 5-11's changes |

### Status Reporting Format
Each step reports: the exact command run, its real output, and PASS/FAIL against that step's named check — matching this phase's own runbook format, not a summary.

### Blocked Task Protocol
Any failed check halts immediately and triggers that step's named rollback procedure (§7) — never work around a failed check to keep moving.