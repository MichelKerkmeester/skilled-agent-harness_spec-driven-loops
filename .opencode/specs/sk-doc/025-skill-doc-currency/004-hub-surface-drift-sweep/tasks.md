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
    last_updated_at: "2026-08-02T14:32:45Z"
    last_updated_by: "skd025-004-build"
    recent_action: "Executed the locked build scope and recorded verification receipts"
    next_safe_action: "Review strict validation output and preserve In Progress status"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/resolve_skill_markdown_links.py"
      - ".opencode/skills/sk-doc/shared/scripts/check_install_entries.py"
      - ".opencode/specs/sk-doc/025-skill-doc-currency/004-hub-surface-drift-sweep/baselines/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending-first-save"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Orphan cards: quarantine the two cards unreachable from active choreography; canonicalise the reachable card (hierarchy-rhythm-review, reached from the routed final-polish orchestrator) as a first-class interface card."
      - "Version pin: reconcile the unlabelled 12.15.0 style-guide outlier to the majority 12.38.0 value."
      - "External examples: relabel the absent a_nobel_en_zn anchors as external/historical; do not add repo-local examples."
      - "Archive path: ratify benchmark/reports/compiled-routing/ because the live writer and existing archives use it."
      - "Q3: admit RE-006-03, RE-006-07, and RE-006-08; the quick-reference half of RE-006-03 is deduped to RE-008-01."
      - "Q7: build the fresh resolver and dangling-entry check in sk-doc/shared/scripts using the existing path-resolution pattern."
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

- [x] T001 Confirm every scope item against HEAD before any edit. Produce a per-ID table with one of: confirmed / stale-finding / already-fixed. **A finding is a hypothesis until this table says otherwise.** Order matters: **confirm the design-hub ownership group (`RE-002-01`, `RE-002-04`, `RE-002-05`) first** — it is the least-verified group in the whole program and the most likely to have moved with the consolidation; **expect the cardinality numbers specifically to have shifted.** Re-verify flags: the three `§` registry-supplementary items (`RE-006-03`, `-07`, `-08`) arrived through a dedupe collision and were never independently checked; each needs its own evidence line and **batch-editing them is forbidden** [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T002 Build or consume the repo-wide relative-link resolver over skill markdown. Case-sensitive; anchors and external URLs excluded by design, with the exclusion counts reported — **[OPERATOR-DECISION: Q7 — shared tooling ownership]** [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T003 Run the resolver **before any edit** and record the failure count, plus the subset attributable to this phase's findings (`<packet>/baselines/`) [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T004 [P] Build the dangling-entry check over the install surface: existence per entry, plus counts derived from the directory rather than retyped. Do not follow symlinks outside the repository root [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T005 [P] Run the dangling-entry check and record the result; run both installer paths and record their current behaviour (`<packet>/baselines/`) [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T006 [P] Cite the fleet-gate re-baseline captured by the first phase. **No no-regression claim in this phase may cite a remembered pass count** — `REQ-013` [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T007 Answer and record the four open forks: orphan-card disposition, the version-pin outlier, the external example anchors, and the archive-path ratification. **Answer before the edits they govern, not during** — `REQ-011` [evidence: `implementation-summary.md` Evidence Receipts]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Lane A — code hub

- [x] T008 [P] Match the human reference map to the machine resource map and to disk; the machine half is correct and does not move (`sk-code/sk-code-webflow/SKILL.md`) — `RE-002-06` [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T009 [P] Same treatment for the sibling surface document (`sk-code/sk-code-opencode/SKILL.md`) — `RE-002-07` [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T010 [P] Repoint the shared routing prose at current packet locations (`sk-code/shared/references/smart-routing.md`) — `RE-002-08` [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T011 [P] Repoint the universal debugging checklist (`sk-code/shared/references/universal-debugging-checklist.md`) — `RE-002-09` [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T012 [P] Repair the broken sibling path (`sk-code/sk-code-webflow/references/animation/quick-start.md`) — `RE-002-10` [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T013 [B] Apply the recorded fork answer to the external example anchors across the motion references and assets. Blocked on T007 (`sk-code/sk-code-webflow/references/animation/**`, `assets/animation/**`) — `RE-002-11` [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T014 [B] Apply the recorded fork answer to the version pin: one value everywhere, or the outlier explicitly labelled historical. Blocked on T007 (`sk-code/sk-code-webflow/references/html/style-guide.md`, `references/performance/third-party.md`) — `RE-002-12` [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T015 [P] Update the stale cross-reference labels (`sk-code/sk-code-webflow/references/`) — `RE-002-13` [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T016 [P] Remove the obsolete standalone artifact guidance (`sk-code/benchmark/README.md`) — `RE-010-04` [evidence: `implementation-summary.md` Evidence Receipts]

### Lane B — design hub

- [x] T017 [B] Remove retired lane ownership from the active guidance documents. Blocked on T001's design-group confirmation (`sk-design/sk-design-interface/`) — `RE-002-01` [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T018 [B] **Check reachability first**, then apply the recorded fork answer to the orphan procedure cards: a card reachable from any choreography is canonicalised, not quarantined. Blocked on T007 (`sk-design/sk-design-interface/procedures/`) — `RE-002-04` [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T019 [B] Reconcile the procedure cardinality: README count equals workflow-document count equals non-quarantined files on disk. Blocked on T018 (`sk-design/sk-design-interface/README.md` and its workflow document) — `RE-002-05` [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T020 [P] Match the declared always-loaded resources to the actual default (`sk-design/sk-design-md-generator/SKILL.md`) — `RE-002-03` [evidence: `implementation-summary.md` Evidence Receipts]

### Lane C — git hub

- [x] T021 Replace the retired branch recipe with the allocator command and the owner-first grammar (`sk-git/references/quick-reference.md`) — `RE-008-01`. **This file also appears in the supplementary finding below; it is repaired once, here** [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T022 § Replace the same recipes in the four other resources, and explicitly label any retained legacy example as legacy-migration-only (`sk-git/assets/worktree-checklist.md`, `sk-git/references/{shared-patterns,large-reorg-playbook,finish-workflows}.md`) — `RE-006-03`, minus the quick-reference half already covered by T021 [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T023 § Derive the scenario and category counts from the playbook inventory rather than retyping them, and complete the package map with the documented integration (`sk-git/README.md`, `sk-git/SKILL.md`) — `RE-006-07` [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T024 § Resolve the two sections that describe the same tool's side effects differently by checking the current tool surface, then make both sections agree; replace the frozen count with a verification date and a reproducible check (`sk-git/references/gitkraken-mcp-integration.md`) — `RE-006-08` [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T025 Do **not** edit the remote-branch policy document. Both supplementary findings touching it belong to the routing-and-hook phase, one of them safety-relevant [evidence: `implementation-summary.md` Evidence Receipts]

### Lane D — install surface

- [x] T026 **Verify the replacement targets exist** under their current location before any repointing. If a target is also missing, block the repoint and escalate rather than swapping one dangling entry for another [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T027 [B] Repoint the dangling guide entry and correct the file counts, deriving them from the directory. Blocked on T026 (`.opencode/install-guides/README.md`, `.opencode/install-guides/MCP - Chrome Dev Tools.md`) — `RE-010-02` [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T028 [B] Repair the master installer's invocation of the missing script. Blocked on T026 (`.opencode/install-guides/install-scripts/{install-all.sh,install-chrome-devtools.sh}`) — `RE-010-03` [evidence: `implementation-summary.md` Evidence Receipts]

### Lane E — benchmark archive path

- [x] T029 [B] Ratify the canon to the location the live writer already emits, and update the hub benchmark READMEs that state the other path. Blocked on T007 (`sk-doc/sk-create-benchmark/references/skill-benchmark/`) — `RE-010-01` [evidence: `implementation-summary.md` Evidence Receipts]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 Re-run the relative-link resolver; report the delta against T003, and report the phase-scoped subset separately from the repo-wide count so a partially-swept tree is visible [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T031 Re-run the dangling-entry check: zero, with the number of entries examined reported [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T032 Run the installer's help or dry-run path and the tool-specific path; both succeed [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T033 Run the prose-versus-machine drift check over the two code-hub surface documents: zero mismatches [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T034 Run the cardinality assertion for the design hub: README equals workflow document equals disk [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T035 Grep for the retired lane names in active design-hub documents: zero [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T036 Grep for the retired branch shape across the git hub: only labelled legacy examples remain [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T037 Confirm every one of the 20 scope items reached exactly one terminal state, each supplementary item with its own evidence line [evidence: `implementation-summary.md` Evidence Receipts]
- [x] T038 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` → Errors: 0 [evidence: `implementation-summary.md` Evidence Receipts]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] Every count on the touched surfaces derived from disk, not retyped
- [x] No symlink was repointed at an unverified target
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
