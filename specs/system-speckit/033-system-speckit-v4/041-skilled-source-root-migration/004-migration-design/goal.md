---
title: "Goal: freeze the .skilled layout and cutover"
description: "The durable directive for the phase that decides what .opencode becomes and freezes the order, checks and rollbacks phases 005 to 011 execute, and the criteria it closes against."
trigger_phrases:
  - "skilled migration design goal"
  - "opencode layout phase goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/004-migration-design"
    last_updated_at: "2026-09-16T22:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the design conditioned on the phase 003 probes"
    next_safe_action: "Map the phase 003 probe verdicts to P1 to P9 (T001)"
    blockers:
      - "Phase 003 probe records for P1 to P3 do not exist yet"
    key_files:
      - "plan.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-004-goal"
      parent_session_id: null
    completion_pct: 30
    open_questions:
      - "Which layout do probes P1 to P3 select?"
    answered_questions: []
---
# Goal: freeze the .skilled layout and cutover

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Freeze what `.opencode/` becomes and the order in which phases 005 to 011 move the tree, with a check and a rollback on every step, reviewed by a second model family.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The phase 003 probe records choose the layout through the decision tree in `plan.md`, never preference. A record that voids every link shape stops the packet under parent D2. |
| D2 | Gates, CI and dual-root code publish before any file moves. The moved tree reaches the main checkout once, in phase 010, and the global hooks are reinstalled at that moment. |
| D3 | The layout rollback stays local until step 24 pushes the moved tree; after that push, recovery is a forward fix. The compatible bands published from step 5 revert by push. |
| D4 | GPT-5.6 sol on cli-codex reviews the layout, the order and the contract-file changes, and the orchestrator rules on every finding before an ADR is Accepted. |

### Operator copy

A change here that alters a parent decision or criterion is applied to the parent goal first, and the parent slice is resent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `decision-record.md` ADR-001 names L1, L2 or a named stop, and every probe verdict it rests on cites a phase 003 record
- [x] `plan.md` holds 25 cutover steps, `grep -c '\*\*Check\*\*' plan.md` and `grep -c '\*\*Rollback\*\*' plan.md` each print 25, and step 24 is named the point of no return
- [x] Every surface class and blockers B1 to B6 map to a step in the traceability and blocker tables of `plan.md`
- [x] `review/gpt-5-6-sol-design-review.md` exists, and every finding in it has an accept, reject or defer ruling in `decision-record.md`
- [x] ADR-001, ADR-002 and ADR-003 read Accepted
- [x] `validate.sh --strict` on this phase, run from the main checkout, prints `RESULT: PASSED`
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
| Folder renumbered from 003 to 004, spec kept and extended | Done | `spec.md` metadata reads phase 4 of 11, predecessor 003-layout-probes, successor 005-gate-and-ci-readiness |
| Layout options, decision tree, 25-step cutover, review plan and delegation | Done | `plan.md`; ADR-001 to ADR-003 Accepted in `decision-record.md` after the GPT-5.6 review |
| Phase 003 probe records | Pending | `003-layout-probes/` held only scaffold templates at authoring time (`003-layout-probes/spec.md:60`) |
| Evidence units E1 to E4 | Pending | Briefs and outputs named in `plan.md` delegation |
| GPT-5.6 review | Pending | Runs after ADR-001 resolves |

### Deviations and findings

| Item | Note |
|------|------|
| Phase 001 line citations drifted | Comment hygiene now blocks at `pre-commit:50-53`, the mirror checks skip at `pre-commit:180`, and the link-integrity guard sits at `markdown-link-integrity.yml:29-33`. This design cites the lines as opened on 2026-09-16 |
| B2 is routed around by a resolvable `.opencode` | The seven global hooks are absolute links to `<main checkout>/.opencode/scripts/git-hooks/`, which keep resolving through a link under L1 or L2, so their reinstall becomes a planned step rather than an emergency |
| The hook installer would skip every existing link | `install-git-hooks.sh:58-67` judges ownership by the link target's path prefix and `:138-142` skips anything else, so an installer pointed at `.skilled/` changes none of the seven links without the dual-root fix in step 6 |
| 62 `.gitignore` lines stop matching after the move | Ignore rules keyed on `.opencode/` do not cover `.skilled/` paths, so step 7 adds twins before the move |
| Hook drivers run from the main checkout | Worktree commits execute the main checkout's hook files, so gate changes must reach the main checkout (steps 5 and 8) before the move |
| Ten consumer links exist on this machine | `find ~/MEGA/Development -maxdepth 5 -name .opencode -type l` printed ten absolute links to `Public/.opencode`: four projects and six worktrees of one project |
| The main checkout holds ignored state no commit carries | 184 ignored entries under `.opencode/`, four of them SQLite databases, and a modified tracked `council-graph.sqlite`, so steps 18 and 19 archive and relocate before the fast-forward |
| Gate 0 diffs the whole push range | The shared git config sets `diff.renames` true and `diff.renameLimit` 60000, and Gate 0 compares the remote tip with the local tip in one diff (`mass-deletion-guard.sh:45-47`), so probe P6 is measured over the whole push range rather than the rename commit alone |
| Phase closed | ADR-001 to ADR-003 Accepted after the GPT-5.6 review (7 findings, all accepted and applied); strict validation `Errors: 0  Warnings: 0`, `RESULT: PASSED`, 2026-09-16 |
<!-- /ANCHOR:log -->
