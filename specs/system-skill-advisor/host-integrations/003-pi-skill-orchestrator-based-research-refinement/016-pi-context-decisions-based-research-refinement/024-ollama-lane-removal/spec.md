---
title: "Feature Specification: Ollama lane removal"
description: "The skill advisor's Ollama and embedding semantic lane ships at weight 0, yet 332 tracked files outside specs/ still carry it. Eight ordered phases delete it whole, with no backup, and prove that nothing is left in the repo or on a user's machine."
trigger_phrases:
  - "ollama lane removal phase parent spec"
  - "remove the ollama lane"
  - "delete the semantic shadow lane"
  - "ollama residue check"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Phase parent created, child phases own continuity"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.3 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Ollama lane removal

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-20 |
| **Branch** | `worktrees/497-ollama-lane-removal` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | scaffold/024-ollama-lane-removal |
| **Predecessor** | 023-ollama-deprecation-research |
| **Successor** | None |
| **Handoff Criteria** | The residue check exits 0 in repo mode, exits 1 on its planted-term fixture, and in machine mode exits 0 on a fixture home and checkout after apply (operator decisions Q007 and Q010) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor's semantic lane, which scores prompts with Ollama or HuggingFace embeddings, ships at live weight 0 after three negative measurements. Its code, tests, vector tables, daemon refresh, doctor route, model server, npm dependency and docs remain: 332 tracked files outside `specs/` match the lane's vocabulary at `bf6806ad4b3`. Users who ran the embedder route also hold a pulled model, vector tables and compiled lane output that no current code removes.

### Purpose
Delete the lane whole, in the repository and on every user machine that updates, so that a residue check finds nothing outside its own allowlist.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete the lane's runtime code, tests, fixtures, database objects and public contract fields in the advisor.
- Delete the shared embeddings package, the HuggingFace model server, its launcher supervision and the `@huggingface/transformers` dependency.
- Delete the doctor embedder route and every doctor line that names the lane.
- Rewrite every doc, identity file, playbook and the 23 released changelog entries that name the lane, and rename the three "five-lane" files.
- Add one cleanup tool, run by `/doctor:update apply`, that deletes the lane's leftovers on a user machine, and one residue check that gates the result.

### Out of Scope
- Packets under `specs/`. They are history, and 7,541 tracked files there match.
- Renormalizing the remaining lane weights. They stay at 0.95.
- The orphan sweeper's `ollama-preserve` guard. It stays, with an allowlist row.
- Merging the branch to `main` and pushing. The operator does both after reviewing the branch.
- Running the cleanup tool's apply mode on the operator's own machine. It asks before deleting the shared Ollama model, so it runs only against fixtures here.

### How the Run Executes
The operator asked on 2026-11-20 for an unattended run from planning to the end:
- Each phase is planned with `/speckit:plan`, built with `/speckit:implement`, validated strict and committed on `worktrees/497-ollama-lane-removal`, in the order of the phase map.
- A phase starts only when the previous phase's handoff verification passes.
- After phase 008, `/local-doc-alignment` and `/local-skilled-alignment` run over the change, and their findings are fixed and committed on the same branch.

### Files to Change
Per-phase detail lives in each child's `spec.md` and `plan.md`. The research inventory with line numbers is `../023-ollama-deprecation-research/research/research.md`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/` (residue check, allowlist, test) | Create | 001-residue-check-and-cleanup-tool | The residue check and the cleanup tool, report-only and unwired |
| `.skilled/commands/doctor/` routes, assets, scripts, tests | Modify/Delete | 002-doctor-surface | The embedder route, setup leg, install step and coverage lines |
| `.skilled/skills/system-skill-advisor/runtime/` daemon, handlers, scorer | Modify | 003-lane-feeders | Vector refresh, prompt embedding, exact rerank, command meaning path |
| `.skilled/skills/system-skill-advisor/runtime/lib/` lane id, schema, embedders | Modify/Delete | 004-lane-core | Lane registry row, status contract, vector DDL, `lib/embedders/` |
| `.skilled/skills/system-spec-kit/shared/embeddings/`, `.skilled/bin/` | Delete | 005-shared-embeddings-package | Package, model server, supervision, dependency, lockfiles |
| Skill docs, changelogs, `.env.example`, install docs | Modify/Delete | 006-prose-docs-and-changelogs | Prose, identity files, trigger phrases, 23 changelog entries |
| Trigger index, fixtures, skill-graph export, cite-drift labels | Regenerate | 007-generated-surfaces | Each generator's output |
| `.skilled/commands/doctor/assets/doctor-update-apply.yaml`, the residue check | Modify | 008-cleanup-wiring-and-gating | Cleanup wired in, check flipped to gating |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-residue-check-and-cleanup-tool/ | The residue check in report-only mode, the unwired cleanup tool and the recorded gate baselines | Complete |
| 2 | 002-doctor-surface/ | The embedder route, asset, menu item, setup leg, install step, coverage lines, contract tests and cost script, with the bridge regeneration and the two install docs | Complete |
| 3 | 003-lane-feeders/ | Vector refresh, prompt embedding, exact rerank, the command meaning path, `embeddingText` and the forwarded env keys | Complete |
| 4 | 004-lane-core/ | The lane id, status contract, vector DDL, `lib/embedders/`, the dead env flag and the remaining lane tests and fixtures, in one commit | Complete |
| 5 | 005-shared-embeddings-package/ | The shared embeddings package, HF model server, launcher supervision, orphan check class, sk-doc validator, `chunking.ts`, `utils/retry.ts`, the npm dependency and lockfiles | Complete |
| 6 | 006-prose-docs-and-changelogs/ | Prose docs, identity files, trigger phrases, the "five-lane" renames and all 23 changelog rewrites | Complete |
| 7 | 007-generated-surfaces/ | Trigger index and its fixtures, the skill-graph export and the cite-drift labels | Complete |
| 8 | 008-cleanup-wiring-and-gating/ | The cleanup wired into `/doctor:update apply` and the residue check flipped to gating | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-residue-check-and-cleanup-tool | 002-doctor-surface | The check reports the baseline and every gate baseline is recorded | The check exits 1 with live plus allowlisted equal to 336; the gate baselines sit in 001's `implementation-summary.md` |
| 002-doctor-surface | 003-lane-feeders | No doctor file passes the semantic-health flag or names the embedder route | `run-all.sh` and `derive-command-bridges.cjs --check` exit 0 |
| 003-lane-feeders | 004-lane-core | Nothing writes or reads vectors on the prompt path | Advisor typecheck, tests and clean build pass; the four ratchets pass with baselines untouched |
| 004-lane-core | 005-shared-embeddings-package | The advisor imports nothing from the embeddings package | Advisor stress suite passes; `advisor_status` reports four lane keys |
| 005-shared-embeddings-package | 006-prose-docs-and-changelogs | The package, server and dependency are gone | Shared and spec-kit builds and tests pass; `npm ci` succeeds in each package |
| 006-prose-docs-and-changelogs | 007-generated-surfaces | Only generated files still match | The check lists only generated paths |
| 007-generated-surfaces | 008-cleanup-wiring-and-gating | Repo mode is clean | The check's repo mode exits 0 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- The changelog entry that announces the removal has to say what was removed. Does it get an exact-path allowlist row, or is it worded without the lane's vocabulary? Phase 006 decides.
- Is an empty advisor database rescanned at daemon start, so that discard-and-rescan needs no extra step? Phase 001 checks it before the cleanup tool relies on it.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Research**: See `../023-ollama-deprecation-research/research/research.md`
- **Operator decisions**: See `../023-ollama-deprecation-research/decision-record.md`, Q002 to Q008
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
