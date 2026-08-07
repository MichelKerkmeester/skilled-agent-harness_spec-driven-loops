---
title: "Decision Record: Specs-Root Migration Plan"
description: "Two accepted decisions: the existing spec-root-* migration functions need new orchestration code rather than a literal repoint, and downstream specs stay shared-by-default with an opt-in ownership override."
trigger_phrases:
  - "migration plan decision record"
  - "topology flip decision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-relocate-specs-folder/002-migration-plan"
    last_updated_at: "2026-08-06T18:04:13Z"
    last_updated_by: "claude-code"
    recent_action: "Fresh Opus recommended ADR-002; claims verified"
    next_safe_action: "Operator accepts or rejects the ADR-002 recommendation"
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
# Decision Record: Specs-Root Migration Plan

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Build a new topology-flip operation instead of repointing the existing migration function

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-06 |
| **Deciders** | Operator, Claude Code |

---

<!-- ANCHOR:adr-001-context -->
### Context

Phase 001's dual-round research (4 lineages: glm, grok, sol, luna) converged on "invert and reuse the existing `spec-root-*` migration subsystem." Sol and luna both cited `spec-root-migration.ts`, `spec-root-write-guard.ts`, and `spec-root-registry.ts` as real, existing infrastructure — verified true. Neither lineage read those files end to end; both inferred capability from what the citations described.

### Constraints

- `migrateLegacyOnlyToCanonical` and `restoreFromQuarantine` hardcode `canonicalRoot = .opencode/specs` and `legacyRoot = specs` as literal path joins inside the function body, not as parameters.
- `classifySpecRootCollision` classifies a packet by comparing `dev`/`ino` (inode) across roots — when `specs` is a symlink to `.opencode/specs` (today's actual state), every packet's inode is identical across "both" roots, so the classifier returns `same-inode-alias` for everything.
- The migration loop in `migrateLegacyOnlyToCanonical` only acts on packets classified `legacy-only`; everything else, including `same-inode-alias`, is skipped.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Reuse the direction-agnostic primitives (`classifySpecRootCollision`, `copyDirectoryVerified`, `moveDirectoryVerified`, `assertQuarantineLocation`, `assertWritersUnfrozen`, `buildMigrationManifest`) and write a new topology-flip function on top of them, rather than swapping the two hardcoded literals in the existing mutation functions.

**How it works**: The new function materializes `specs/` as a byte-verified copy of the current `.opencode/specs/` (reusing `copyDirectoryVerified`), then replaces `.opencode/specs` with a relative symlink `../specs`. `buildMigrationManifest` runs unchanged before the copy as a baseline proof (confirms zero divergent-duplicates today). `assertSpecWriteAllowed` gets a 2-line literal swap since its logic is otherwise correct for either direction.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Build new topology-flip function on existing primitives (chosen)** | Correct for the actual current state; reuses battle-tested byte-verification, quarantine, and manifest code | More work than a 2-line swap; requires new code and new tests | 8/10 |
| Swap the two hardcoded literals in `migrateLegacyOnlyToCanonical` and call it done | Minimal code change | Would be a silent no-op today — every packet classifies `same-inode-alias` and gets skipped, so nothing would actually move | 1/10 |
| Hand-write the flip from scratch, ignoring the existing subsystem | No dependency on understanding someone else's code | Rebuilds byte-verification, quarantine safety, and collision detection that already exist and are tested | 3/10 |

**Why this one**: It's the only option that is both correct for the current symlinked state and doesn't discard genuinely reusable, already-tested safety primitives.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A future execution phase has an accurate design instead of a plausible-sounding one that would have silently done nothing.
- The 7-vs-14 registry split gives a precise, verified list of what needs real code changes, cross-checked against phase 001's independent estimate.

**What it costs**:
- More code to write for an execution phase than "swap two literals" would have suggested. Mitigation: the new function is small and composes existing primitives — most of the hard safety logic (byte verification, quarantine, collision detection) is already written and tested.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The 61-test validation matrix may not translate cleanly to the new function's shape | Medium | Named as a carried-forward verification item in `plan.md` §4 Phase C, not assumed covered |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The existing function would silently no-op if used as-is; this design gap had to be caught before any execution phase |
| 2 | **Beyond Local Maxima?** | PASS | Considered a from-scratch rebuild and a literal-swap; both rejected with reasons above |
| 3 | **Sufficient?** | PASS | Reuses everything genuinely reusable; only writes what's actually new |
| 4 | **Fits Goal?** | PASS | Directly serves phase 001's "invert and reuse" recommendation, corrected for what the code actually does |
| 5 | **Open Horizons?** | PASS | The new function is direction-agnostic itself (takes roots as data, not hardcoded), so it doesn't repeat the original design flaw |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes** (for a future execution phase, not this one):
- New function in `spec-root-migration.ts` (or a sibling module) implementing the topology flip
- `spec-root-registry.ts` — 7 entries get real precedence changes, 14 get relabeled
- `spec-root-write-guard.ts` — 2-line literal swap

**How to roll back**: This phase itself changes only its own planning docs — reverting means deleting `002-migration-plan/`. For a future execution phase, rollback uses `restoreFromQuarantine`-equivalent logic, safe before any new canonical write lands; after that, rollback requires a full writer-freeze-and-migrate-back transaction (see `plan.md` §7).
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Downstream specs-ownership policy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-06 |
| **Deciders** | Operator, accepting the fresh-context Opus recommendation |

---

### Context

Phase 001's research (sol lineage, most detailed treatment) found that whether a downstream repo's project-local specs data stays framework-shared (globally ignored via `~/.gitignore_global`) or becomes repo-owned (needs a local `!specs/` negation) is a policy choice, not a technical one. `PUBLIC-RELEASE.md` currently instructs writing project data under `.opencode/specs`; after a flip, those instructions would write through a compatibility alias and need updating regardless of which way this decision goes.

### Constraints

- The migration design in ADR-001 works correctly either way — this decision does not block the design, only the execution.
- Whichever way this goes, `PUBLIC-RELEASE.md` needs an update before an execution phase closes.
- **New constraint, found by the fresh Opus review, verified real**: `PUBLIC-RELEASE.md` shows downstream projects symlink the *entire* `.opencode/` directory (`.opencode -> Public/.opencode`), not a specs-only symlink. A downstream project's spec packets are written through that symlink and physically land inside `Public/.opencode/specs/` on disk today — verified by the existing per-project `.gitignore` entries at lines 264-267 (`.opencode/specs/ai-systems`, `anobel.com`, `barter`, `z-future`). Git does not follow symlinks, so a downstream repo's own git literally cannot see or track anything under a symlinked `.opencode/` — Option 2 ("repo-owned by default") is **not implementable as originally framed** without first giving downstream projects a real (non-symlinked) location to write into.

### Decision

**Accepted: keep shared/framework-default as the baseline, and add an opt-in `SPEC_KIT_SPECS_DIR` (alias `SPECKIT_SPECS_DIR`) environment-variable override**, mirroring the already-shipped `SPEC_KIT_DB_DIR` pattern (verified real at `.opencode/bin/mk-spec-memory-launcher.cjs:365-366`, resolved via `path.resolve(process.cwd(), override)` — the same mechanism that already solves the identical symlink/`__dirname` problem for the database path). A downstream project that wants to own its specs sets this to a real project-local path (e.g. `.opencode-local/specs`) in its own config and adds its own local `!.opencode-local/specs/` negation. This ships "Option 2" as a per-project choice instead of a forced default, without requiring a separate relocation project to make it possible at all.

**A second, higher-priority finding from the same review**: the flip itself has a **silent data-exposure risk**, independent of which ownership option gets chosen. After the flip, git sees `.opencode/specs` as a symlink blob and stops traversing into it. The existing `.gitignore:264-267` entries (`.opencode/specs/ai-systems`, `anobel.com`, `barter`, `z-future`) would then match nothing, while those same project trees' real content sits at `specs/<project>/` — untracked **and unignored**, visible to `git add -A` in a repository that publishes to GitHub. **The flip must not land in a commit separate from the `.gitignore` rebase** (rewriting those 4 entries from `.opencode/specs/<project>` to `specs/<project>`) — the intermediate state between those two changes is the leak.

A related, independently-verified bug worth fixing in the same pass: `context-server.ts:1303-1307` (`getPendingRecoveryLocations`) checks `specs` before `.opencode/specs`, while `api/indexing.ts:82-87` (`resolveSpecFolderPath`) checks `.opencode/specs` before `specs` — two MCP-server resolvers disagree on precedence today. It's masked while `specs` is a symlink to `.opencode/specs` (both paths resolve identically); post-flip, once a downstream project has its own real root `specs/`, the two resolvers would silently pick different directories for the same lookup.

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| **Shared/framework-default + opt-in `SPEC_KIT_SPECS_DIR` override (chosen)** | Matches today's behavior by default; makes repo-ownership genuinely available per-project without forcing it; reuses an already-shipped, already-proven mechanism | Requires threading the env var through 5 known resolver call sites |
| Repo-owned by default (local `!specs/` negation), as originally framed | Downstream repos naturally track their own project specs | **Not implementable as framed** — git cannot track content behind a symlinked directory; would need the override mechanism anyway as a prerequisite |
| Keep shared/ignored, no override ever | Simplest; zero new code | Downstream repos permanently cannot own their specs, even if a future project genuinely wants to |

**Why this one**: it's the only option that is actually buildable against the real (symlink-based) downstream topology, and it doesn't foreclose repo-ownership for a project that wants it later.

### Consequences

**What improves**: Downstream repo-ownership becomes a real, available choice instead of a policy statement with no implementation path. The silent-leak risk gets named and gated before it can happen, not discovered after a `git push` to a public repo.

**What it costs**: The override mechanism is new code (5 call sites) not accounted for in the original 7-entry registry-inversion count from ADR-001 — `plan.md` §3 already carries an addendum naming these 5 sites for the execution phase to pick up.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The flip lands without the `.gitignore` rebase in the same commit | **High** — private downstream project data becomes untracked and unignored in a public GitHub repo | Treat as a single atomic change; verify with `git check-ignore -v specs/<project>` for all 4 known projects plus `git status --porcelain` showing no new untracked project trees, before considering the flip commit-ready |
| A downstream project's `.opencode` is not a plain symlink (e.g. a submodule or real copy) | Low — changes the calculus for that project only | Not verified against any real downstream checkout; flagged as an open assumption, not confirmed either way |
<!-- /ANCHOR:adr-002 -->
