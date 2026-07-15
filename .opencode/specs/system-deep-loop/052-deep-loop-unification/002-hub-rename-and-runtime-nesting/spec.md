---
title: "Feature Specification: Hub Rename + Runtime Nesting — system-deep-loop"
description: "Renames deep-loop-workflows to system-deep-loop and nests deep-loop-runtime inside it as runtime/, repairing bidirectional path coupling and the system-spec-kit tooling-borrow. The irreversible structural move."
trigger_phrases:
  - "hub rename runtime nesting"
  - "system-deep-loop structural merge"
  - "nest deep-loop-runtime into deep-loop-workflows"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting"
    last_updated_at: "2026-07-08T06:40:24.201Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Executed and verified; all stages complete"
    next_safe_action: "Commit scoped changes, then hand off to 003"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-unification-052-002-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Hub Rename + Runtime Nesting — system-deep-loop

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-08 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-reference-research |
| **Successor** | 003-external-reference-migration |
| **Handoff Criteria** | `system-deep-loop/` exists with `runtime/` nested inside, exactly one `graph-metadata.json`, both directions of internal path coupling repaired, `runtime`'s own vitest suite and `system-spec-kit`'s `test:council` both green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`deep-loop-workflows` is already Option-E-hub-shaped but carries the wrong top-level name; `deep-loop-runtime` is a separate skill folder that `deep-loop-workflows`' mode packets already reach into via hardcoded relative paths in 12+ files, and which itself reaches back into `deep-loop-workflows/shared/rollout/` in 5+ files, plus borrows TypeScript tooling from a third skill (`system-spec-kit`) via 4 more hardcoded relative paths. None of this is expressed as a formal dependency — it's silent, depth-sensitive relative addressing that a naive move breaks.

### Purpose
Execute the irreversible physical merge: rename `deep-loop-workflows` → `system-deep-loop`, nest `deep-loop-runtime` inside it as `runtime/` (infrastructure, not a mode — no `graph-metadata.json`, `SKILL.md` demoted to `README.md`), repair every coupling site at its new correct depth, and fresh-author the unified identity.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `git mv .opencode/skills/deep-loop-workflows .opencode/skills/system-deep-loop`; identity-field edits inside that tree only (Stage 1).
- `git mv .opencode/skills/deep-loop-runtime .opencode/skills/system-deep-loop/runtime`; delete its `graph-metadata.json`; demote `SKILL.md` → `README.md` (Stage 2).
- Repair 5+ forward-coupling sites (`runtime` → workflows-content, same hop-count, delete `deep-loop-workflows` segment) and 12+ reverse-coupling sites (workflows-content → `runtime`, minus-one hop, rename segment) (Stage 3a).
- Repair the 4-site `system-spec-kit` tooling-borrow (Stage 3b) — this is load-bearing test wiring, not documentation, and must land in this phase, not be handed to child 003.
- Fresh-author `system-deep-loop/graph-metadata.json`; bump to `2.0.0.0`; write `changelog/v2.0.0.0.md` (Stage 4).

### Out of Scope
- Any reference outside the `system-deep-loop/` tree itself (commands, agents, READMEs, advisor corpus, sibling `graph-metadata.json` edges) — that's child 003.
- Wiring `fallback-router.ts` — child 004, optional.
- Genuine TypeScript-tooling decoupling of `runtime/` from `system-spec-kit` (giving it its own local `typescript`/`@types`) — follow-up hardening, not this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/**` → `.opencode/skills/system-deep-loop/**` | Move + edit | Whole tree; identity fields updated |
| `.opencode/skills/deep-loop-runtime/**` → `.opencode/skills/system-deep-loop/runtime/**` | Move + edit | Whole tree incl. `database/`; `graph-metadata.json` deleted; `SKILL.md`→`README.md` |
| `runtime/scripts/{render-command-contract,compile-command-contracts,check-contract-drift,fanout-run}.cjs` | Edit | Forward-coupling path repair (delete segment) |
| 7 files in `runtime/tests/unit/*.vitest.ts` | Edit | Forward-coupling path repair (delete segment) |
| `{deep-research,deep-review,deep-improvement,deep-ai-council}/scripts/**` (12 files) | Edit | Reverse-coupling path repair (minus-one hop, rename segment) |
| `runtime/package.json`, `runtime/tsconfig.json` | Edit | `system-spec-kit` tooling-borrow, one more `..` |
| `system-spec-kit/mcp_server/package.json`, `system-spec-kit/mcp_server/vitest.config.ts` | Edit | Reverse half of the tooling-borrow, expand target path |
| `runtime/lib/deep-loop/artifact-root.cjs`, `runtime/tests/unit/artifact-root.vitest.ts` | Edit | Missed tooling-borrow sites, found by 001's research |
| `system-spec-kit/mcp_server/tests/council-playbook-anchor-integrity.vitest.ts` | Edit | `system-spec-kit`-owned but must fix in this phase — `test:council`'s own exit gate crashes on it otherwise |
| `.opencode/commands/deep/{research,review,ai-council}.md` | Edit (3 lines) | Pulled forward from child 003 to close the B.2 sequencing gap — needed for this phase's own live-verification step |
| `system-deep-loop/graph-metadata.json` | Create (fresh-author) | The one unified identity |
| `system-deep-loop/changelog/v2.0.0.0.md` | Create | Reunification changelog entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Physical move preserves git history | `git log --follow -- .opencode/skills/system-deep-loop/runtime/database/observability-events.jsonl` surfaces pre-move commits |
| REQ-002 | Both coupling directions repaired correctly (not backwards) | `cd .opencode/skills/system-deep-loop/runtime && npm test` green; a live `/deep:research` or `/deep:review` short run confirms reverse-direction `require()`s resolve at execution time |
| REQ-003 | `system-spec-kit` tooling-borrow repaired | `npm run typecheck` in `runtime/` succeeds; `npm run test:council` in `system-spec-kit/mcp_server/` succeeds |
| REQ-004 | Exactly one `graph-metadata.json` | `find .opencode/skills/system-deep-loop -iname graph-metadata.json \| wc -l` == 1 |
| REQ-005 | Durable state preserved byte-identical | SQLite checksums and `observability-events.jsonl` line count match pre-move snapshot |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | No in-flight loop or stale writer-lock at move time | Pre-move quiesce check passes |
| REQ-007 | `package_skill.py --check` passes on the renamed hub and all 4 mode packets | Clean check output |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `system-deep-loop/` exists with `runtime/` nested inside; `deep-loop-workflows/` and `deep-loop-runtime/` no longer exist.
- **SC-002**: `grep -rn "deep-loop-workflows\|deep-loop-runtime" .opencode/skills/system-deep-loop --include="*.cjs" --include="*.ts"` returns zero hits outside changelog/README prose.
- **SC-003**: Version `2.0.0.0` consistent across `SKILL.md`, `mode-registry.json`, `hub-router.json`, `description.json`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Directional asymmetry (Class A adds nothing/deletes a segment; Class B removes one hop) is the single highest-probability mechanical failure mode | High | Explicit before/after table per site (plan.md §3); exit gate is a real `npm test` run, not a grep |
| Risk | Live git-tracked state + 2 writer-locked SQLite DBs mid-move | Medium | Stage 0 quiesce: zero stale/live writer-lock files, zero running `convergence.cjs`/`fanout-run.cjs` process, checksum before/after |
| Risk | `system-spec-kit`'s tooling-borrow falls into the gap between this phase and child 003 | Medium (silent coverage hole, not a build failure) | Explicitly scoped INTO this phase (Stage 3b), not child 003 |
| Dependency | 001-reference-research's synthesis may revise this design before execution | — | This phase does not start until 001 completes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking; awaiting 001's research synthesis before execution.
<!-- /ANCHOR:questions -->

---

## 8. ARCHITECTURE ADDENDUM (Level 3)

### Target layout

```
system-deep-loop/
  SKILL.md  README.md  description.json  mode-registry.json  hub-router.json  graph-metadata.json
  changelog/                    # v1.0.0.0, v1.1.0.0 preserved + NEW v2.0.0.0
  deep-research/  deep-review/  deep-ai-council/  deep-improvement/   # untouched
  shared/{behavior-benchmark,progress,rollout,synthesis}/             # untouched, stays at hub level
  benchmark/  manual_testing_playbook/                                 # untouched
  runtime/                      # nested former deep-loop-runtime, NO graph-metadata.json
    README.md  package.json  tsconfig.json  vitest.config.ts  node_modules/
    lib/{deep-loop,coverage-graph,council}/  scripts/  tests/  database/
    feature_catalog/  references/  changelog/ (frozen at v1.5.0.1)  manual_testing_playbook/
```

`runtime/` is infrastructure, not a `workflowMode` — it has no command, no agent, no `artifactRoot`. Adding it as a seventh `mode-registry.json` entry would be a category error.

### Path-repair rule (the one insight that governs everything)

- **Forward** (`runtime` → workflows-content): both sides moved one level deeper in lockstep → hop-count **unchanged**, delete the `deep-loop-workflows` segment.
- **Reverse** (workflows-content → `runtime`): `runtime` got nearer (from top-level sibling to hub child) → **minus one hop**, rename the segment.

### Version strategy

`2.0.0.0`, not a continuation of either lineage (`1.1.0.0` workflows / `1.5.0.1` runtime) — signals "second era" of the family (era 1 = the FULL_ISOLATE_NO_MCP split into two skills; era 2 = reunification). Both prior changelogs preserved in place and frozen; one new changelog going forward.
