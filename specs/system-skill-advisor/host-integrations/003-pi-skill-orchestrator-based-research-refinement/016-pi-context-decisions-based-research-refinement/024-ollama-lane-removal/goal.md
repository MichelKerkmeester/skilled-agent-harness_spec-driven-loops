---
title: "Goal: Ollama lane removal"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal"
    last_updated_at: "2026-11-20T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-497-ollama-lane-removal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Ollama lane removal

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Delete the Ollama and embedding semantic lane whole, from this repository and from user machines, so the residue check finds nothing outside its own allowlist.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The lane goes with no backup. Packets under `specs/` stay as history and sit outside the residue check. |
| D2 | Phases run in map order on `worktrees/497-ollama-lane-removal`. Each is planned, built, validated strict and committed, and starts only after the previous handoff passes. Nothing merges to `main` and nothing is pushed. |
| D3 | All 23 released changelog entries that name the lane are rewritten. Shadow weights stay at 0.95. |
| D4 | The orphan sweeper's `ollama-preserve` guard stays, with an exact-path allowlist row. |
| D5 | The cleanup tool asks before removing the pulled Ollama model on every run and remembers no answer. |
| D6 | The cleanup tool's apply mode never runs on the operator's machine. It runs only against fixtures. |
| D7 | Existing advisor databases are discarded and rescanned by raising `SCHEMA_VERSION`. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-residue-check-and-cleanup-tool | `001-residue-check-and-cleanup-tool/goal.md` |
| 002-doctor-surface | `002-doctor-surface/goal.md` |
| 003-lane-feeders | `003-lane-feeders/goal.md` |
| 004-lane-core | `004-lane-core/goal.md` |
| 005-shared-embeddings-package | `005-shared-embeddings-package/goal.md` |
| 006-prose-docs-and-changelogs | `006-prose-docs-and-changelogs/goal.md` |
| 007-generated-surfaces | `007-generated-surfaces/goal.md` |
| 008-cleanup-wiring-and-gating | `008-cleanup-wiring-and-gating/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Each of phases 001 to 008 has a commit on `worktrees/497-ollama-lane-removal`, and `git log --reverse` shows them in folder order.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal --recursive --strict` prints `RESULT: PASSED`.
- [ ] The residue check in `.skilled/skills/system-spec-kit/runtime/cli/retrieval/` exits 0 in repo mode and in machine mode, and exits 1 on its planted-term fixture.
- [ ] Findings from `/local-doc-alignment` and `/local-skilled-alignment`, run after phase 008, are fixed and committed on `worktrees/497-ollama-lane-removal`.
- [ ] `git branch -a --contains <branch tip>` lists only `worktrees/497-ollama-lane-removal`, so nothing merged to `main` and nothing was pushed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phases 001 to 008 | Pending | Phase map in `spec.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Phase 001 sources | `001-residue-check-and-cleanup-tool/spec.md` and its implementation summary are unfilled scaffolds. Its goal follows the operator's direction: parent phase map row 1 and handoff row 001 to 002. |
| Changelog scope | Research 5.6 item 1 suggests excluding the changelogs. Operator decision Q002 rewrites all 23, and Q002 governs. |
| Orphan-check class | Phases 002 and 005 both name it, and research lines 95 and 147 place it in both. No goal decides it. |
| Baseline count | The 332-file count is recorded at commit `44251c5befd` in research 5.5. The parent records `bf6806ad4b3`. |
<!-- /ANCHOR:log -->
