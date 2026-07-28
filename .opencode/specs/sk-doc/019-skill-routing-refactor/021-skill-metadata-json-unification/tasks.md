---
title: "Task Breakdown: Skill Root Metadata JSON Unification"
description: "Ordered task list across the six implementation phases, with the verification command and observed result recorded against each."
trigger_phrases:
  - "skill metadata unification tasks"
  - "fleet class gate task list"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/021-skill-metadata-json-unification"
    last_updated_at: "2026-07-27T20:31:30Z"
    last_updated_by: "claude-code"
    recent_action: "All tasks executed and marked with observed evidence"
    next_safe_action: "Run the completion gate"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "021-skill-metadata-json-unification-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Task Breakdown: Skill Root Metadata JSON Unification

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` complete with evidence · `[ ]` outstanding · **P0** blocker · **P1** required · **P2** optimization

Evidence is the observed result of the named command, not a restatement of intent.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **P0** Census the eight metadata files across all 12 roots — 12 distinct shapes confirmed on disk
- [x] **P0** Trace each file's producer and consumers to file:line — recorded in `research/lineages/sol-high-fast/research.md` §5-7
- [x] **P0** Establish the root cause of invisibility — all three gates confirmed presence-conditional: `parent-skill-check.cjs:237-238` takes one dir per run and scopes description to hubs, its leaf block is opt-in (`:1067-1070`), and `ci-leaf-manifest-freshness.cjs:11` walks committed manifests only
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **P0** Write `lib/skill-root-metadata-contract.cjs` with the discriminator, required/forbidden/optional/overlay sets and `evaluateRoot()`
- [x] **P0** Write `ci-skill-root-metadata.cjs`: `SKILL.md`-first discovery, presence, nested-identity detection, generated freshness, `--fix`
- [x] **P0** Establish the fleet baseline — gate reported `checked=12 passed=11 failed=1`, `sk-git` the single failure
- [x] **P0** Measure the alias files to test the research's "always authored" claim — 4/4 standalone roots are pure identity maps (103/103, 48/48, 53/53, 7/7); `sk-doc` is 6 rows of real `shared/` relocation
- [x] **P0** Encode the per-class alias split (`GENERATED_BY_CLASS`, `isGenerated(file, class)`) and add `buildAliasBytes()` / `checkDerivedAliases()`
- [x] **P1** Author `sk-git/leaf-manifest.config.json`, the root's one missing authored file
- [x] **P1** Generate the derivable files — `--fix` wrote `sk-git` manifest (65 leaves) + aliases and canonicalized 2 alias files to manifest order
- [x] **P0** Verify the two rewritten alias files are set-identical — 48→48 and 7→7 rows, set comparison true
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **P0** Fleet gate passes — `checked=12 passed=12 failed=0`
- [x] **P0** Idempotent on re-run — `fixed=0`
- [x] **P0** Unit + gate suite passes — `[sk-doc] skill-root-metadata contract + fleet gate coverage passed` (21 tests)
- [x] **P0** Mutation-check the fleet assertions — removing `sk-git`'s config and planting a forbidden file on `sk-doc` each fail the suite with the expected message
- [x] **P0** Existing freshness gate still green — `checked=12 fresh=12 failed=0` (was 11 manifests, now 12)
- [x] **P1** Full create-skill suite — 5/5 pass
- [x] **P1** Doctor suite — `parent-skill-check-leaf-manifest.test.cjs` passes, 3/3 deterministic re-runs
- [x] **P1** `11a-class` PASS on all 7 hubs
- [x] **P1** XOR half-declaration rejected by package validation — synthetic root with registry-but-no-router fails with the partial-declaration message
- [x] **P2** Confirm `sk-doc` manifest picked up the new canonical doc as a leaf — 2 entries (one per consuming mode), digest fresh

### Documentation verification

- [x] **P0** Write `references/shared/skill-root-metadata-contract.md` as the single source of truth
- [x] **P1** Point `references/README.md` (reference map + related resources) at it
- [x] **P1** Point `create-skill/SKILL.md` at it from both the standalone shape and the parent-hub workflow
- [x] **P1** Point `scripts/README.md` and `scripts/lib/README.md` at it, and document the run-order rationale
- [x] **P1** Point `parent-skills-nested-packets.md` at it for the full per-class rule
- [x] **P2** Record the ADR-004 deviation from the research report explicitly rather than applying it silently
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- Fleet gate exits 0 across all 12 roots and is idempotent
- Every presence difference is explained by a written class rule
- One canonical document exists; no other doc restates the table
- The same class judgment is reached by the fleet gate, the per-hub audit, and package validation
- Every gate and test named in `plan.md` §2 passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Decisions: `decision-record.md`
- Verification: `checklist.md`
- Research: `research/lineages/sol-high-fast/research.md`
<!-- /ANCHOR:cross-refs -->
