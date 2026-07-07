---
title: "Feature Specification: Migration From system-speckit"
description: "Consolidate every skill-advisor-scoped spec folder scattered across system-speckit/026, 027, and 028 into the dedicated system-skill-advisor track, numbered in true chronological order, then reconcile the registry fallout left behind in system-speckit."
trigger_phrases:
  - "system-skill-advisor migration"
  - "extract skill-advisor specs"
  - "026 027 028 skill-advisor split"
  - "skill-advisor track consolidation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/000-migration-from-system-speckit"
    last_updated_at: "2026-07-07T11:01:53Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec.md with full migration manifest"
    next_safe_action: "Dispatch the /deep:review 20-iteration loop"
    blockers: []
    key_files:
      - ".opencode/specs/system-skill-advisor/000-migration-from-system-speckit/spec.md"
      - ".opencode/specs/system-skill-advisor/012-skill-advisor-tuning"
      - ".opencode/specs/system-skill-advisor/001-skill-graph"
      - ".opencode/specs/system-skill-advisor/009-advisor-and-codegraph-migrated-items"
      - ".opencode/specs/system-skill-advisor/011-skill-advisor-phase-parent"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-07-07-skill-advisor-extraction"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The 25 z_archive/001-025 folders under system-speckit were checked and contain zero genuine skill-advisor content, confirmed by a dedicated Explore pass. Nothing moves from there."
      - "Chronological order for the destination track is derived from git log --follow on representative spec.md files per hub, not from the folders' current numbers."
---
# Feature Specification: Migration From system-speckit

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The skill-advisor subsystem's spec history is scattered across three unrelated `system-speckit` packets (026, 027, 028) plus a partially built dedicated track at `system-skill-advisor/`. This spec consolidates every genuinely skill-advisor-scoped folder into `system-skill-advisor/`, numbered in true chronological order, then reconciles the numbering and regrouping fallout the extraction leaves behind in 026/027/028.

**Key Decisions**: chronological numbering derived from `git log --follow`, not current folder numbers. Genuinely shared or joint infra (a BFS helper, a daemon bridge, one joint research packet) stays in place with a reference pointer rather than being fragmented out.

**Critical Dependencies**: the destination track's newest packet is currently `001-skill-advisor-tuning`, which must renumber to `012` as part of this pass so it lands after (not before) the older 026/027/028 content being migrated in.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Skill-advisor spec history lives in four different places under `system-speckit` (026, 027, 028, plus a half-built `system-skill-advisor` track), with no single folder a reader can open to understand the subsystem's full history. One packet already tried this exact extraction once (`026/.../006-system-skill-advisor-package-extraction`, scaffolded 2026-05-14) and never finished moving the spec folders themselves.

### Purpose
One track, `system-skill-advisor/`, holds every skill-advisor-scoped spec folder in true chronological order, and the 3 source packets have their registries reconciled so nothing points at a stale path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Move — 026 primary hub (whole subtree, becomes `system-skill-advisor/001`-`006`)**

| Destination | Source | Notes |
|---|---|---|
| `001-skill-graph/` | `026/002-spec-kit-internals/002-skill-advisor/001-skill-graph/` | incl. the 30-item `006-system-skill-advisor-package-extraction` arc unchanged |
| `002-skill-advisor-scoring-engine/` | `.../002-skill-advisor-scoring-engine/` | 8 children, as-is |
| `003-skill-advisor-routing-engine/` | `.../003-skill-advisor-routing-engine/` | 5 children, plus a new appended child `006-skill-advisor-affordance-evidence` (moved in from `026/005-graph-impact-and-affordance/003-...`, Apr 25 2026, its subject is advisor graph-causal routing) |
| `004-skill-advisor-production-hardening/` | `.../004-skill-advisor-production-hardening/` | 4 children, plus 4 new appended children (all Apr 2026 hardening/bugfix leaves): `005-fail-open-fallback` (was `026/000-.../001-release-readiness/001-...`), `006-codex-native-startup-advisor-hooks` (was `026/006-operator-tooling/001-hook-parity/003-...`), `007-skill-advisor-freshness-audit` (was `026/000-.../003-release-readiness-deep-review-audits/003-...`), `008-fix-skill-advisor-quality` (was `026/000-.../006-research/004-.../003-...`, date unconfirmed, verify content fit before filing here) |
| `005-skill-advisor-documentation/` | `.../005-skill-advisor-documentation/` | 7 children incl. nested 8-child `004-documentation-quality-refactor`, as-is |
| `006-playbook-run-and-remediation/` | `.../006-playbook-run-and-remediation/` | 6 children, as-is |

**Move — May 2026 embedder-stack cluster (new `007-skill-advisor-embedder-stack/`)**

Merges 3 scattered 026 folders (all first touched May 17-18 2026):
- `026/.../003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack/` (+ 5 children) becomes `007/001`-`005`
- `.../006-mcp-launcher-concurrency/007-skill-advisor-zombie-launcher-fix` becomes `007/006`
- `.../002-spec-memory-stack/022-hardcoded-default-remediation-arc/004a-skill-advisor-compat-contract-consolidation` becomes `007/007`
- `.../002-spec-memory-stack/022-hardcoded-default-remediation-arc/004b-skill-advisor-interface-and-env-vars` becomes `007/008`
- Judgment call: `003-skill-advisor-stack`'s own child `006-shared-embedder-logic-with-spec-memory` is dual-scoped (advisor deliverable, reuses spec-memory's embedder logic). Move it with its parent since the deliverable's subject is the advisor's stack, but re-read its spec.md at execution time to confirm before filing.

**Move — 027 content (new `008`, `009`, `010`)**
- `008-skill-advisor-cli/` from `027/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/` (whole, 4 children plus research)
- `009-advisor-and-codegraph-migrated-items/` from the advisor-only slice of `027/003-advisor-and-codegraph/`: its 3 direct advisor-only children (`003-skill-advisor-cross-session-reconnect`, `004-skill-advisor-suite-repair`, `005-advisor-state-spec-folder-leak`) plus 5 advisor items pulled out of its nested `002-xce-feature-adoption-advisor-codegraph` (`001-advisor-observability`, `002-advisor-provenance-guard`, `003-advisor-packed-bm25-lexical`, `004-advisor-bfs-consolidation`, `005-advisor-feedback-calibration`)
- `010-skill-advisor-frontmatter-alignment/` from `027/000-release-cleanup/009-skill-frontmatter-alignment/021-system-skill-advisor` (single leaf)

**Move — 028 hub (new `011`)**
- `011-skill-advisor-phase-parent/` from `028/002-skill-advisor/` (whole, plus its 1 child)

**Renumber existing destination content (becomes `012`)**
- Rename `system-skill-advisor/001-skill-advisor-tuning/` to `012-skill-advisor-tuning/`, fixing every internal metadata and frontmatter reference from `001` to `012` (its 8 existing children keep their own numbers, only the parent slot number changes). Reconcile the destination track's own stale `descriptions.json` cache entries for this packet while touching it.

### Out of Scope (deviation from a literal "move everything" reading)

| Path | Why it stays |
|---|---|
| `027/003-advisor-and-codegraph/001-causal-traversal-bfs` | Shared BFS helper genuinely used by both advisor's skill-graph queries and code-graph's recursive-CTE consumers. Moving it would misrepresent joint ownership. |
| `027/003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/006-009` | Pure code-graph siblings under the same parent as the advisor items above. Renumbered to `001-004` after the advisor items leave. |
| `026/004-code-graph/005-resilience-and-advisor/*` | Coherent joint research packet (4 of 5 children are code-graph-only). Fragmenting it to extract 1 shared-research child would break more context than it preserves. |
| `026/.../006-mcp-launcher-concurrency/012-daemon-bridge-socket-for-skill-advisor-and-code-index` | Explicitly shared daemon bridge (both subsystems). |
| `026/006-operator-tooling/003-install-scripts-doctor-realignment/003-advisor-adjacent-116-realignment` | Content unconfirmed, still template-scaffold prose. Leave, flag for a follow-up read rather than guess. |
| `027/005-.../L5-advisor-correctness`, `027/review/fresh-regression-75/lineages/opus-advisor-daemon` | Not spec folders. Finding-tracking and deep-review-regression artifacts keyed into their parent's own state machine. Moving them breaks that tracking. |

The 25 archived folders (`system-speckit/z_archive/001` through `025`) were checked and contain zero genuine skill-advisor content. Nothing moves from there.

A short `context-index.md` in `system-skill-advisor/` points at each left-in-place item so the historical-context goal is not lost.

### Files to Change

| File Path | Change Type | Description |
|---|---|---|
| `system-skill-advisor/description.json`, `graph-metadata.json` | Modify | Reflect new children 001-012 |
| `system-skill-advisor/001-skill-advisor-tuning/**` | Rename to `012-skill-advisor-tuning/**` | Chronological renumber, this is the newest wave (July 2026) and must land last |
| `026/002-spec-kit-internals/description.json`, `graph-metadata.json` | Modify | Drop `002-skill-advisor` child |
| `026/005-graph-impact-and-affordance/description.json`, `graph-metadata.json` | Modify | Drop `003-...-affordance-evidence` child |
| `026/006-operator-tooling/001-hook-parity/description.json`, `graph-metadata.json` | Modify | Drop `003-codex-native-...` child |
| `026/.../006-mcp-launcher-concurrency/description.json`, `graph-metadata.json` | Modify | Drop `007-...` child, keep shared `012-...` |
| `026/.../002-spec-memory-stack/022-hardcoded-default-remediation-arc/description.json`, `graph-metadata.json` | Modify | Drop `004a`/`004b` children |
| `026/000-release-and-program-cleanup/001-release-readiness/description.json`, `graph-metadata.json` (+ nested `003-release-readiness-deep-review-audits/`) | Modify | Drop `001-...` and nested `003-...` children |
| `026/000-.../006-research/004-fix-deep-research-findings/description.json`, `graph-metadata.json` | Modify | Drop `003-...` child |
| `027/003-advisor-and-codegraph/spec.md`, `description.json`, `graph-metadata.json` | Modify | Shrinks from 5 children to 2, prose updated to reflect the narrower code-graph-weighted remaining scope |
| `027/004-shared-infrastructure/001-mcp-to-cli-tool-transition/description.json`, `graph-metadata.json` | Modify | Drop `003-skill-advisor-cli` child |
| `027/000-release-cleanup/009-skill-frontmatter-alignment/description.json`, `graph-metadata.json` | Modify | Drop `021-system-skill-advisor`, renumber the 20+ remaining siblings contiguous |
| `028/graph-metadata.json` | Modify | `002-skill-advisor` removal renumbers `003→002, 004→003, 005→004, 006→005` (matches the precedent already set in this exact packet) |

**Top-level check**: none of 026/027/028 themselves need renumbering or merging. Each retains substantial unrelated content, so this is nested-child renumbering only.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every folder in the "Move" tables above lands at its new path via `git mv`, preserving file history | `git log --follow` on the new path still shows the pre-move commits |
| REQ-002 | Every cross-reference to a moved old path is rewritten | Repo-wide `rg` for each old path fragment returns zero hits outside `.git/` history |
| REQ-003 | Every touched parent's `children_ids` is reconciled | `validate.sh --strict --recursive` is clean on every touched folder |
| REQ-004 | The destination track's newest packet renumbers from `001` to `012` as part of the same pass | `system-skill-advisor/012-skill-advisor-tuning/` metadata consistently says `012` everywhere (disk name, `graph-metadata.json`, spec.md frontmatter `packet_pointer`) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The destination track root `spec.md` narrates the full 001-012 history coherently | Manual spot-read confirms it reads as one system, not a dump |
| REQ-006 | A `context-index.md` documents the left-in-place shared/joint items | File exists and lists all 6 out-of-scope paths with rationale |
| REQ-007 | Scoped `memory_index_scan` runs per moved path after commits land | No full-tree scan attempted (this corpus SIGBUS's on those) |
| REQ-008 | Every parent that loses a child gets contiguous renumbering, not a left-open gap | Manual diff review confirms no numbering gaps remain in any touched parent |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash validate.sh .opencode/specs/system-skill-advisor --strict --recursive` reports Errors: 0.
- **SC-002**: `bash validate.sh .opencode/specs/system-speckit/026-graph-and-context-optimization --strict --recursive` (and same for 027, 028) reports Errors: 0.
- **SC-003**: repo-wide `rg` for each old path fragment returns zero live hits.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Working tree currently has ~2,700 unrelated dirty paths from a concurrent session (sk-doc/sk-design work) | A broad commit could sweep in unrelated changes | Never `git add -A`. Explicit paths only, rebase-aware scoped commits, same technique used in the prior 028 renumber session |
| Risk | 20-iteration budget may not be enough for ~115+ folder moves plus registry fallout | Loop stops before full convergence | Commit progress per iteration so a follow-up invocation continues from wherever it stops, same pattern already used for prior deep-review migrations in this repo |
| Dependency | `backfill-graph-metadata.js`, `generate-description.js`, `generate-context.js`, `validate.sh` under `system-spec-kit/scripts/` | If any script is missing or its interface changed | Re-verify each script's CLI flags before first use, per the tooling section in plan.md |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: every commit in this migration must be independently revertible (`git revert` on a single scoped commit undoes exactly one batch, never a mix of this migration and the concurrent session's unrelated work).

---

## 8. EDGE CASES

### Data Boundaries
- Long sibling list (`027/000-release-cleanup/009-skill-frontmatter-alignment` has 20+ children): still renumber contiguous per the "perfect historical context" instruction, budget more diff for it rather than leaving a gap.
- Content-unconfirmed folders (`003-advisor-adjacent-116-realignment`, the `006-shared-embedder-logic-with-spec-memory` judgment call): re-read the full spec.md before filing, do not guess from the folder name alone.

### Error Scenarios
- If a `git mv` target path collision is discovered mid-migration (e.g. `system-skill-advisor/007` already claimed by something else), stop and re-derive the next free slot rather than overwriting.
- If `validate.sh --strict` fails on a touched folder after a batch, fix before proceeding to the next batch rather than accumulating failures.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 25/25 | ~115+ spec folders, 4 packets touched |
| Risk | 15/25 | No breaking runtime changes, but high blast-radius on shared spec-doc metadata and a dirty concurrent working tree |
| Research | 20/20 | 3 parallel Explore agents plus git log --follow archaeology already completed |
| Multi-Agent | 10/15 | Single 20-iteration deep-review loop, not multiple parallel workstreams |
| Coordination | 10/15 | Sequenced batches (extraction then registry fallout), not independent parallel tracks |
| **Total** | **80/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Scoped commit accidentally includes concurrent session's dirty files | High | Low | Explicit paths only, never `git add -A`, verify `git status` before each commit |
| R-002 | 20 iterations insufficient for full scope | Medium | Medium | Checkpoint-commit per iteration, safe to resume in a follow-up invocation |
| R-003 | Full-tree `memory_index_scan` SIGBUS on this corpus | Medium | Low (avoidable) | Always scope to `{specFolder}`, never full-tree |

---

## 11. USER STORIES

### US-001: One home for skill-advisor history (Priority: P0)

**As a** maintainer, **I want** every skill-advisor spec folder in one track numbered chronologically, **so that** I can understand the subsystem's full history from one place instead of hunting across 3 unrelated packets.

**Acceptance Criteria**:
1. Given the migration has run, When I open `system-skill-advisor/`, Then I see folders `001` through `012` in true chronological order with no gaps.

### US-002: No stale registry pointers (Priority: P0)

**As a** maintainer, **I want** 026/027/028's own registries to reflect the extraction, **so that** `children_ids` and cross-references never point at a path that no longer exists.

**Acceptance Criteria**:
1. Given the migration has run, When I run `validate.sh --strict --recursive` on any touched folder, Then it reports Errors: 0.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

None outstanding. Judgment calls flagged inline in the Scope tables above are execution-time content checks, not open questions blocking the plan.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
