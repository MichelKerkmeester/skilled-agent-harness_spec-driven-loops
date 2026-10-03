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

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every commit in this repository carries a numbered, searchable identity enforced by sk-git and its hook, and the 9,106 commits already on main and skilled/v4.0.0.0 are rewritten to the same format with their citations in specs remapped.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Research first: phase 001 runs 10 iterations before any implementation. |
| D2 | The grammar is frozen in 002's decision record and operator-approved before any hook or skill change. |
| D3 | The rewrite targets main, skilled/v4.0.0.0 and 005's listed tags, pinned by SHA; other branches are never rewritten. |
| D4 | Commit-hash citations under specs/ are remapped in the rewrite phase. |
| D5 | The 005 force-push needs a written rollback and a fresh operator yes. |
| D6 | Implementation runs on cli-pi deepseek-v4.1-flash; code follows sk-code, markdown sk-doc. |
| D7 | Work stays on worktrees/048-crawlable-commit-history until the operator merges. |
| D8 | Phase 002 decides if a git repo rule is needed; 006 authors it and wires REPO RULES.md and AGENTS.md section 5. |
| D9 | Phase 007 adjusts sk-git and the hooks so no git workflow fails an automated run. |
| D10 | Phase 008 rewrites again: normalized subjects, one Spec line per packet, attribution lines stripped and refused by the hooks. |
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
| 008-second-pass-subjects-and-attribution | `008-second-pass-subjects-and-attribution/goal.md` |

**Precedence.** Decisions above outrank child detail, which outranks any summary of it. Name a conflict; never resolve it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] 001-research's deepseek lineage state file holds 10 iteration records and its research.md exists with file:line citations
- [x] 002-format-decision/decision-record.md records the grammar and an operator approval line
- [x] The commit-msg hook test and sk-git rule test pass under node --test, and run-all-drift-guards.sh exits 0
- [x] git log --grep on the new identifier resolves a commit on the rewritten main and skilled/v4.0.0.0 on origin
- [x] rg over specs/ finds zero pre-rewrite 10-hex hashes that existed in the old history
- [ ] validate.sh --strict --recursive on this packet prints RESULT: PASSED for the parent and every child
- [x] validate_document.py, package_skill.py --check and ci-skill-root-metadata.cjs exit 0 for sk-git
- [x] REPO RULES.md routes to a git repo rule that validate_document.py accepts, or 002's decision record says why none is needed, and AGENTS.md section 5 matches it
- [x] 007's implementation-summary.md lists every run-failing git workflow with its adjustment and a passing test or reproduction
- [ ] On origin after the second pass: every non-exempt subject passes the commit-msg grammar, every multi-packet commit carries one Spec line per packet, and zero Co-Authored-By, Claude-Session or Anthropic lines remain, with the hooks refusing new ones
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
| Phase 006 docs and release | Done | `dcdf2f8441`, `8d5acf93d5`, `581e2862a5`; advisor probe after the merge |
| Phase 007 run failures | Done | ten producers fixed, four runtime seams named, proof lineage succeeded 1 |
| Phase 005 history rewrite | Done | pushed on the operator's yes against 6358770875; origin v4 7bb115bd61, 9,165 ordinals extractable, residue 0 |
| Phase 004 search surface | Done | `9cb5e9c4a4`, queries proven on a stamped fixture commit |
| Phase 003 contract and hook | Done | four commits, three harnesses 9/35/43, drift guards PASSED, docs VALID |
| Phase 002 format decision | Done | decision-record.md, five ADRs approved 2026-09-11; identifier is a repository-wide ordinal, Spec: carries the full packet path | lineage `research/lineages/deepseek`: 10 iterations, synthesis stopReason maxIterationsReached, 16 state records |

### Deviations and findings

| Item | Note |
|------|------|
| Parent goal.md not produced by --with-goal | Rendered by hand with inline-gate-renderer at level phase |
| The brief said 5 tags, 20 worktrees, 59 branches, 9,106 commits | Live refs: 149 tags (8 backup), 28 worktrees, 60 branches, 9,110 and moving. D3 amended to pin by SHA at execution time. |
| Runner failed the lineage on write containment after all 10 iterations | The conductor edited planning docs outside the lineage while it ran. The runner reverted those edits and marked the lineage failed. Research artifacts were untouched. Rule for every later dispatch: change nothing in the repository while a lineage runs. |
| Durable slice over the 4,000-character budget | Cut to 3,994 by removing old template author instructions and shortening decision and criterion wording; all ten criteria kept |
<!-- /ANCHOR:log -->
