---
title: "Feature Specification: Phase 1: residue-check-and-cleanup-tool"
description: "Nothing can prove that the Ollama lane is gone, and nothing deletes what it left on a user's machine. This phase adds one script that reports every remnant in the repository and on the machine, deletes the machine leftovers in an apply mode, and records the gate baselines the later phases are checked against."
trigger_phrases:
  - "residue check and cleanup tool"
  - "phase 1 residue check and cleanup tool"
  - "lane residue sweep"
  - "sweep lane residue"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.4 -->
# Feature Specification: Phase 1: residue-check-and-cleanup-tool

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

332 tracked files outside `specs/` still name the Ollama lane, and no command says which ones or proves when the count reaches zero. This phase adds `sweep-lane-residue.mjs`, which reports every remnant in the repository and on the machine and, in an apply mode, deletes the machine leftovers. With the lane still present, its repo mode exits 1 and lists the 332 files, and a planted-term fixture shows it cannot pass by accident.

**Key Decisions**: one script holds the vocabulary, the check and the cleanup, so the vocabulary survives in exactly three files (script, allowlist, test); the allowlist holds exact paths, never folders.

**Critical Dependencies**: `git` for the tracked-file list and `node:sqlite` for reading advisor databases.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-20 |
| **Branch** | `worktrees/497-ollama-lane-removal` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 8 |
| **Predecessor** | None |
| **Successor** | 002-doctor-surface |
| **Handoff Criteria** | The check exits 1 with live plus allowlisted equal to 336 (the 332-file baseline, the embeddings symlink and its own three files), its tests pass, and the gate baselines sit in `implementation-summary.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Ollama lane removal specification.

**Scope Boundary**: One new script with its allowlist and test, plus one README row. No lane code, doc or doctor file changes in this phase.

**Dependencies**:
- `../../023-ollama-deprecation-research/research/research.md` sections 5.4 and 5.5, the cleanup and check design
- `../../023-ollama-deprecation-research/decision-record.md` Q005 (keep the sweeper guard with an allowlist row) and Q006 (ask about the pulled model on every run)

**Deliverables**:
- `sweep-lane-residue.mjs` with a repo mode, a machine mode and an apply mode, report-only and not wired into any workflow
- Its allowlist and its test
- The gate baselines every later phase is checked against
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The lane is to be deleted with no backup, and the deletion has to be provably complete. Today a reviewer has only ad hoc greps, which have already given three different counts (262, 279, 332) depending on the pattern. A user machine that ran the embedder route holds vector tables, compiled lane output, maybe a model-server socket and a pulled Ollama model, and no code removes any of them.

### Purpose
One command answers "is anything of the lane left?" with an exit code, in the repository and on a machine, and the same command deletes the machine leftovers.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ID='ollama|semantic_shadow|nomic-embed|vec_768|vec_cmd_|vec_metadata|EMBED_REFRESH|EXACT_SEMANTIC_RERANK|DISABLE_BUILTIN_SEMANTIC|shared/embeddings|hf-model-server|model-server-supervision|EMBEDDINGS_PROVIDER|embedder'
$ PR='semantic lane|meaning match|vector coverage|vector refresh|five-lane|5-lane|five lanes|semanticHealth|embeddingText|HF_EMBED|hf-local|@huggingface/transformers|sqlite-vec'
$ git rev-parse --short HEAD; git grep -l -i -E "$ID" -- . ':!specs' | wc -l; git grep -l -i -E "$PR" -- . ':!specs' | wc -l; union count
bf6806ad4b3
identifier=     279 prose=     163 union=     332 changelog=25
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `sweep-lane-residue.mjs` whose repo mode lists every tracked file outside `specs/` that matches either vocabulary or carries a lane word in its path, plus the dependency rows and the embeddings symlink, and exits 1 while any remain.
- Add its machine mode, which reports compiled lane output, installed HuggingFace modules, vector objects in every advisor database, `.bak` and `.corrupt` copies, the model-server process and socket directory, the exact HuggingFace cache folder, the pulled Ollama model and lane keys in dotenv files.
- Add its apply mode, which deletes the repo-owned leftovers without asking and asks before deleting the HuggingFace folder or the Ollama model, every run, remembering no answer.
- Add the exact-path allowlist and a test that plants a term in a fixture repository and proves exit 1.
- Record every gate's current result as the baseline the later phases compare against.

### Out of Scope
- Wiring the script into `/doctor:update apply` or CI - phase 008 does it once the repo is clean, because a gating check that fails today blocks every unrelated commit.
- Generator check modes, trigger-index assertions and `advisor_status` probes (research R3, R4 and R7) - phase 008 adds them when it flips the check to gating, since today they would only restate the 332-file failure.
- Running apply mode on the operator's machine - it would ask about a shared model the operator may want; tests use fixture directories.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs` | Create | Repo, machine and apply modes |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/lane-residue-allowlist.json` | Create | Exact-path exemptions with a reason each |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts` | Create | Planted-term, clean, allowlist, machine and apply cases |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md` | Modify | One row for the new script |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `node sweep-lane-residue.mjs repo` at the worktree root exits 1 and reports every file both vocabularies match (332 before this phase), plus the tracked embeddings symlink that `git grep` cannot see, minus the allowlisted ones, each with the term that matched. |
| REQ-002 | In a temporary git repository holding one tracked file with a lane term, repo mode exits 1; after the file is removed it exits 0; with the file allowlisted by exact path it exits 0. |
| REQ-003 | An unknown flag, a missing flag value or a malformed allowlist exits 2. |
| REQ-004 | Apply mode, against a fixture database directory, deletes `skill-graph.sqlite` with its `-wal` and `-shm` files and every `.bak` and `.corrupt` sibling, and copies nothing. |
| REQ-005 | Apply mode never deletes the HuggingFace folder or the Ollama model without an answer of yes on a terminal; without a terminal it reports them and leaves them. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Machine mode reports each leftover by path or name and exits 1 while any remain, 0 when none do. |
| REQ-007 | Every allowlist row is an exact tracked path with a non-empty reason, and the loader refuses a row ending in `/` or holding a glob character. |
| REQ-008 | Every gate named in research section 5.1 has its current result recorded in `implementation-summary.md`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs repo` exits 1 at this phase's commit and its live plus allowlisted count equals 336: the 332 measured files, the embeddings symlink and the check's own three files.
- **SC-002**: `npx vitest run --config ../../vitest.config.ts --project cli tests/sweep-lane-residue.vitest.ts` in `runtime/cli` passes, including the planted-term case.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `git` in the repo root | Without it repo mode cannot list tracked files | Exit 2 with the git error, never exit 0 |
| Risk | Apply mode deletes a file outside the advisor database directory | High | Deletes only names it built from the resolved directory and a fixed suffix list; tests assert an unrelated file survives |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Repo mode finishes in under 10 seconds on this repository, because it runs two `git grep -l` calls.

### Security
- **NFR-S01**: Dotenv files are read only through `env-secret.cjs keys`, so no value is ever read or printed.

### Reliability
- **NFR-R01**: A step that cannot run (no git, an unreadable database) exits 2 or reports the step as not checked; it never reports clean.

---

## 8. EDGE CASES

- Empty input: a fixture repository with no tracked files exits 0.
- Maximum input: the full repository with 332 matching files lists every one in `--json` and caps the human list at 50 lines.
- Failure path: an unreadable database file is reported as not checked and machine mode exits 2.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Files: 4, LOC: about 600, Systems: git, SQLite, processes |
| Risk | 10/25 | Auth: N, API: N, Breaking: N; apply mode deletes files |
| Research | 4/20 | Design done in 023 |
| Multi-Agent | 2/15 | Workstreams: 1 |
| Coordination | 6/15 | Dependencies: every later phase reads this check |
| **Total** | **30/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A vocabulary gap lets a remnant through | H | M | Both vocabularies plus path names; phase 008 adds generator and behavior probes |
| R-002 | Apply mode deletes a shared model without consent | H | L | Ask on a terminal only; a test runs apply without a terminal and asserts the model fixture survives |

---

## 11. USER STORIES

### US-001: Prove the repository is clean (Priority: P0)

**As a** maintainer removing the lane, **I want** one command that lists every remnant and exits 0 only when none is left, **so that** "zero remnants" is a checked fact instead of a claim.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Clean an updated machine (Priority: P1)

**As a** user who once ran the embedder route, **I want** the update to delete what the lane left on my machine and ask before touching shared model stores, **so that** nothing of the lane stays behind and nothing of mine is removed without asking.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None. The daemon scans at every start and creates a missing database (`advisor-server.ts:413`, `skill-graph-db.ts:513`), so deleting the database is enough for a rescan.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
