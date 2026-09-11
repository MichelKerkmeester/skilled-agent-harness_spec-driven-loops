---
title: "Goal: Crawlable Commit History"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
  - "crawlable commit history goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-git/028-crawlable-commit-history"
    last_updated_at: "2026-09-11T09:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-skgit-028"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Crawlable Commit History

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every commit in this repository carries a numbered, searchable identity enforced by sk-git and its hook, and the 9,106 commits already on main and skilled/v4.0.0.0 are rewritten to the same format with their citations in specs remapped.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Research first. Phase 001 runs 10 iterations on cli-pi with deepseek-v4.1-flash at max thinking, convergence off. No implementation before research.md exists. |
| D2 | The grammar is frozen in 002's decision record and approved by the operator before any hook or skill file changes. |
| D3 | The rewrite targets main, skilled/v4.0.0.0 and the tags phase 005 lists from the live refs, pinned by SHA at execution time. Other branches and worktrees are rebased or archived, never rewritten. |
| D4 | Commit-hash citations under specs/ are remapped in the same phase as the rewrite. |
| D5 | The force-push in 005 needs a written rollback and a fresh yes from the operator. No approval transfers. |
| D6 | Implementation dispatches run on cli-pi with deepseek-v4.1-flash, high or max by task. Code follows sk-code opencode. Skill and README markdown follows sk-doc create-skill and create-readme. |
| D7 | Work lives on worktree branch worktrees/048-crawlable-commit-history until the operator merges. |
| D8 | A repo rule for the git discipline (commit identity, history rewrite, run-safe git behavior) is decided in 002 and, if needed, authored in 006 through sk-doc create-repo-rule, wired into REPO RULES.md and reflected in AGENTS.md section 5. |
| D9 | Phase 007 analyzes every git workflow that can fail an automated run (hooks, live-sync, write containment, push policy, worktree state) and adjusts sk-git and the hooks so a run does not fail on them. |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the full text
of this file in chat so the operator can update their copy. A child goal change
that alters a parent decision or criterion is an amendment to the parent: apply
it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-research | `001-research/goal.md` |
| 002-format-decision | `002-format-decision/goal.md` |
| 003-contract-and-hook | `003-contract-and-hook/goal.md` |
| 004-search-surface | `004-search-surface/goal.md` |
| 005-history-rewrite | `005-history-rewrite/goal.md` |
| 006-docs-and-release | `006-docs-and-release/goal.md` |
| 007-git-workflow-run-failures | `007-git-workflow-run-failures/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] 001-research/research/lineages/deepseek/deep-research-state.jsonl holds 10 iteration records and 001-research/research/research.md exists with file:line citations
- [x] 002-format-decision/decision-record.md records the grammar and an operator approval line
- [x] The commit-msg hook test and sk-git rule test pass under node --test, and run-all-drift-guards.sh exits 0
- [ ] git log --grep on the new identifier resolves a commit on the rewritten main and skilled/v4.0.0.0 on origin
- [ ] rg over specs/ finds zero pre-rewrite 10-hex hashes that existed in the old history
- [ ] validate.sh specs/sk-git/028-crawlable-commit-history --strict --recursive prints RESULT: PASSED for the parent and all six children
- [x] validate_document.py, package_skill.py --check and ci-skill-root-metadata.cjs exit 0 for sk-git
- [x] REPO RULES.md routes to a git repo rule that validate_document.py accepts, or 002's decision record says why none is needed, and AGENTS.md section 5 matches it
- [x] 007-git-workflow-run-failures/implementation-summary.md lists every git workflow that could fail a run with its adjustment and a passing test or reproduction
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
| Worktree allocated | Done | `worktrees/048-crawlable-commit-history` at `/Users/michelkerkmeester/worktrees/public/048-crawlable-commit-history` |
| Packet scaffolded | Done | `create.sh --track sk-git --phase --phases 6 --level 3 --with-goal` |
| Phase 001 research | Done |
| Deep review, 4 iterations on cli-pi deepseek max | Done | CONDITIONAL: 2 P1 and 13 P2; 14 fixed in the two review-fix commits, F005 (machine-wide hooks execute a repository path) deferred as pre-existing and systemic |
| Phase 006 docs and release | Done | `d6ca91f853`, `a8135ef83c`, `d4d6096ac1`; advisor probe after the merge |
| Phase 007 run failures | Done | ten producers fixed, four runtime seams named, proof lineage succeeded 1 |
| Phase 005 history rewrite | Rehearsed | tooling committed, two full-scale rehearsals PASS, push waits for the window |
| Phase 004 search surface | Done | `98be1cebc2`, queries proven on a stamped fixture commit |
| Phase 003 contract and hook | Done | four commits, three harnesses 9/35/43, drift guards PASSED, docs VALID |
| Phase 002 format decision | Done | decision-record.md, five ADRs approved 2026-09-11; identifier is a repository-wide ordinal, Spec: carries the full packet path | lineage `research/lineages/deepseek`: 10 iterations, synthesis stopReason maxIterationsReached, 16 state records |

### Deviations and findings

| Item | Note |
|------|------|
| Parent goal.md not produced by --with-goal | Rendered by hand with inline-gate-renderer at level phase |
| The brief said 5 tags, 20 worktrees, 59 branches, 9,106 commits | Live refs: 149 tags (8 backup), 28 worktrees, 60 branches, 9,110 and moving. D3 amended to pin by SHA at execution time. |
| Runner failed the lineage on write containment after all 10 iterations | The conductor edited planning docs outside the lineage while it ran. The runner reverted those edits and marked the lineage failed. Research artifacts were untouched. Rule for every later dispatch: change nothing in the repository while a lineage runs. |
<!-- /ANCHOR:log -->
