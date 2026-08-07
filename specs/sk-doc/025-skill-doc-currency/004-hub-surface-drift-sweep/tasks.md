---
title: "Tasks: hub-surface-drift-sweep"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "surface sweep tasks"
  - "link resolver task"
  - "dangling symlink task"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/025-skill-doc-currency/004-hub-surface-drift-sweep"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "track-e-spec-author"
    recent_action: "Authored task breakdown"
    next_safe_action: "Execute T001"
    blockers:
      - "Soft-blocked on the canon rulings in the sibling canon phase"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending-first-save"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: hub-surface-drift-sweep

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm every scope item against HEAD before any edit. Produce a per-ID table with one of: confirmed / stale-finding / already-fixed. **A finding is a hypothesis until this table says otherwise.** Order matters: **confirm the design-hub ownership group (`RE-002-01`, `RE-002-04`, `RE-002-05`) first** — it is the least-verified group in the whole program and the most likely to have moved with the consolidation; **expect the cardinality numbers specifically to have shifted.** Re-verify flags: the three `§` registry-supplementary items (`RE-006-03`, `-07`, `-08`) arrived through a dedupe collision and were never independently checked; each needs its own evidence line and **batch-editing them is forbidden**
- [ ] T002 Build or consume the repo-wide relative-link resolver over skill markdown. Case-sensitive; anchors and external URLs excluded by design, with the exclusion counts reported — **[OPERATOR-DECISION: Q7 — shared tooling ownership]**
- [ ] T003 Run the resolver **before any edit** and record the failure count, plus the subset attributable to this phase's findings (`<packet>/baselines/`)
- [ ] T004 [P] Build the dangling-entry check over the install surface: existence per entry, plus counts derived from the directory rather than retyped. Do not follow symlinks outside the repository root
- [ ] T005 [P] Run the dangling-entry check and record the result; run both installer paths and record their current behaviour (`<packet>/baselines/`)
- [ ] T006 [P] Cite the fleet-gate re-baseline captured by the first phase. **No no-regression claim in this phase may cite a remembered pass count** — `REQ-013`
- [ ] T007 Answer and record the four open forks: orphan-card disposition, the version-pin outlier, the external example anchors, and the archive-path ratification. **Answer before the edits they govern, not during** — `REQ-011`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Lane A — code hub

- [ ] T008 [P] Match the human reference map to the machine resource map and to disk; the machine half is correct and does not move (`sk-code/sk-code-webflow/SKILL.md`) — `RE-002-06`
- [ ] T009 [P] Same treatment for the sibling surface document (`sk-code/sk-code-opencode/SKILL.md`) — `RE-002-07`
- [ ] T010 [P] Repoint the shared routing prose at current packet locations (`sk-code/shared/references/smart-routing.md`) — `RE-002-08`
- [ ] T011 [P] Repoint the universal debugging checklist (`sk-code/shared/references/universal-debugging-checklist.md`) — `RE-002-09`
- [ ] T012 [P] Repair the broken sibling path (`sk-code/sk-code-webflow/references/animation/quick-start.md`) — `RE-002-10`
- [ ] T013 [B] Apply the recorded fork answer to the external example anchors across the motion references and assets. Blocked on T007 (`sk-code/sk-code-webflow/references/animation/**`, `assets/animation/**`) — `RE-002-11`
- [ ] T014 [B] Apply the recorded fork answer to the version pin: one value everywhere, or the outlier explicitly labelled historical. Blocked on T007 (`sk-code/sk-code-webflow/references/html/style-guide.md`, `references/performance/third-party.md`) — `RE-002-12`
- [ ] T015 [P] Update the stale cross-reference labels (`sk-code/sk-code-webflow/references/`) — `RE-002-13`
- [ ] T016 [P] Remove the obsolete standalone artifact guidance (`sk-code/benchmark/README.md`) — `RE-010-04`

### Lane B — design hub

- [ ] T017 [B] Remove retired lane ownership from the active guidance documents. Blocked on T001's design-group confirmation (`sk-design/sk-design-interface/`) — `RE-002-01`
- [ ] T018 [B] **Check reachability first**, then apply the recorded fork answer to the orphan procedure cards: a card reachable from any choreography is canonicalised, not quarantined. Blocked on T007 (`sk-design/sk-design-interface/procedures/`) — `RE-002-04`
- [ ] T019 [B] Reconcile the procedure cardinality: README count equals workflow-document count equals non-quarantined files on disk. Blocked on T018 (`sk-design/sk-design-interface/README.md` and its workflow document) — `RE-002-05`
- [ ] T020 [P] Match the declared always-loaded resources to the actual default (`sk-design/sk-design-md-generator/SKILL.md`) — `RE-002-03`

### Lane C — git hub

- [ ] T021 Replace the retired branch recipe with the allocator command and the owner-first grammar (`sk-git/references/quick-reference.md`) — `RE-008-01`. **This file also appears in the supplementary finding below; it is repaired once, here**
- [ ] T022 § Replace the same recipes in the four other resources, and explicitly label any retained legacy example as legacy-migration-only (`sk-git/assets/worktree-checklist.md`, `sk-git/references/{shared-patterns,large-reorg-playbook,finish-workflows}.md`) — `RE-006-03`, minus the quick-reference half already covered by T021
- [ ] T023 § Derive the scenario and category counts from the playbook inventory rather than retyping them, and complete the package map with the documented integration (`sk-git/README.md`, `sk-git/SKILL.md`) — `RE-006-07`
- [ ] T024 § Resolve the two sections that describe the same tool's side effects differently by checking the current tool surface, then make both sections agree; replace the frozen count with a verification date and a reproducible check (`sk-git/references/gitkraken-mcp-integration.md`) — `RE-006-08`
- [ ] T025 Do **not** edit the remote-branch policy document. Both supplementary findings touching it belong to the routing-and-hook phase, one of them safety-relevant

### Lane D — install surface

- [ ] T026 **Verify the replacement targets exist** under their current location before any repointing. If a target is also missing, block the repoint and escalate rather than swapping one dangling entry for another
- [ ] T027 [B] Repoint the dangling guide entry and correct the file counts, deriving them from the directory. Blocked on T026 (`.opencode/install-guides/README.md`, `.opencode/install-guides/MCP - Chrome Dev Tools.md`) — `RE-010-02`
- [ ] T028 [B] Repair the master installer's invocation of the missing script. Blocked on T026 (`.opencode/install-guides/install-scripts/{install-all.sh,install-chrome-devtools.sh}`) — `RE-010-03`

### Lane E — benchmark archive path

- [ ] T029 [B] Ratify the canon to the location the live writer already emits, and update the hub benchmark READMEs that state the other path. Blocked on T007 (`sk-doc/sk-create-benchmark/references/skill-benchmark/`) — `RE-010-01`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T030 Re-run the relative-link resolver; report the delta against T003, and report the phase-scoped subset separately from the repo-wide count so a partially-swept tree is visible
- [ ] T031 Re-run the dangling-entry check: zero, with the number of entries examined reported
- [ ] T032 Run the installer's help or dry-run path and the tool-specific path; both succeed
- [ ] T033 Run the prose-versus-machine drift check over the two code-hub surface documents: zero mismatches
- [ ] T034 Run the cardinality assertion for the design hub: README equals workflow document equals disk
- [ ] T035 Grep for the retired lane names in active design-hub documents: zero
- [ ] T036 Grep for the retired branch shape across the git hub: only labelled legacy examples remain
- [ ] T037 Confirm every one of the 20 scope items reached exactly one terminal state, each supplementary item with its own evidence line
- [ ] T038 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` → Errors: 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Every count on the touched surfaces derived from disk, not retyped
- [ ] No symlink was repointed at an unverified target
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
