---
title: "Feature Specification: Move a consumer's overlays out of the vendored tree into a sibling overlays folder with framework and root source roots"
description: "The doctor overlay engine keeps a project's overlays inside the vendored tree and names each source after its destination with the leading dot dropped, so Barter's overlay paths repeat skilled. This phased packet lets the overlay folder sit beside the tree, makes the framework/root source layout the default for every consumer, and moves Barter onto both."
trigger_phrases:
  - "overlay framework root layout phase parent spec"
  - "overlays folder beside the vendored tree"
  - "framework and root overlay sources default"
  - "barter overlays out of the vendored tree"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout"
    last_updated_at: "2026-11-20T14:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Replanned for the operator answers"
    next_safe_action: "Start phase 001 in Skilled"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/overlay-engine.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-007-overlay-framework-root-layout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Naming rule: default for every consumer, no opt-in field"
      - "Reach: a direct sibling ../<name> only"
      - "Overlay folder outside the git repository: refused"
      - "Stage layout: <dir>/<tree> and <dir>/<overlays>"
      - "Setting file stays inside the vendored copy"
      - "Phase 004 records the commit phase 003 produces"
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.3 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Move a consumer's overlays out of the vendored tree into a sibling overlays folder with framework and root source roots

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-20 |
| **Branch** | `main` |
| **Parent Spec** | None, the packet sits at the `system-skilled-doctor` track root |
| **Parent Packet** | system-skilled-doctor |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each child validates with `validate.sh --strict` and meets its own acceptance checks before the next child starts |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The doctor overlay engine refuses an overlay folder outside the vendored tree. `resolveOverlayDir` rejects any `overlayDir` that is `..` or starts with `../` (`.skilled/commands/doctor/scripts/overlay-engine.cjs:442-444`). The engine also names every overlay source after its destination with the leading dot dropped (`adoptSource`, `:5399-5401`). So Barter keeps its overlays at `ai-speckit/skilled/barter-overlays/`, inside the copy it vendors from Skilled, and every framework path repeats the word: `skilled/barter-overlays/skilled/skills/sk-git/sk-git-skilled/SKILL.md`. The overlay folder's own bookkeeping (`README.md`, `checks/`, `tests/`) also shares a namespace with mirrored content, so a root `README.md` or `tests/` overlay would collide with it.

### Purpose
Every engine consumer names overlay sources with one rule: `framework/` for `.skilled` content and `root/` for everything else. Barter keeps its overlays at `ai-speckit/overlays/`, beside the vendored tree. Existing consumers keep applying without change, but they now see a LAYOUT notice until they run one relayout, and new adopts land on the new paths.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Phase 1, Skilled.** Let `.skilled-overlays.json` name a direct sibling folder (`../<name>`). Make every engine path that assumes the overlay folder is inside the tree work when it is not.
- **Phase 2, Skilled.** Make the source rule the default for every consumer. Destination `.skilled/X` has source `framework/X`, and any other destination `X` has source `root/X` with the leading dot dropped. A source under `root/skilled/` is refused. Old-layout trees keep applying and get a capped LAYOUT notice.
- **Phase 3, Skilled.** Update the doctor overlay docs, the workflows that read LAYOUT, the system-skilled-doctor skill references and the release note. Together they state the one migration step: run `apply --relayout` once after the re-pin.
- **Phase 4, ai-speckit.** Re-pin Barter onto the Skilled commit that carries phases 1-3, then relay every source onto `framework/` and `root/`, in one session, while the folder is still inside the tree.
- **Phase 5, ai-speckit.** Move Barter's folder to `ai-speckit/overlays/` and point `.skilled-overlays.json` at it. Fix the hooks, checks, tests, scripts and docs that assume the old place.

### Out of Scope
- Removing the engine's support for reading old-layout sources or an in-tree overlay folder. Consumers that never relayout keep working with no deadline, and retiring that support needs its own packet.
- Any change to what an overlay contains, with three exceptions:
  - path strings;
  - the location lookup in Barter's three hook sources (phase 5, step A);
  - the rebase of Barter's `_routes.yaml` overlay onto phase 3's upstream text (phase 4).

  Every other change moves or renames files.
- Spec history under `ai-speckit/specs/`, including the `skilled-barter-overlays` track. It records past work and keeps its old paths.

### Files to Change
This table is an audit summary only. Each child's `plan.md` holds the per-phase detail and line evidence.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modify | 001, 002 | Sibling overlay folder, stage copy, backup areas, the default naming rule, the capped LAYOUT notice |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` and `overlay-engine-fixtures.cjs` | Modify | 001, 002 | Sibling-folder fixtures; expectations that change with the default |
| `.skilled/commands/doctor/overlay.md`, `assets/*.yaml`, `assets/doctor-overlay-presentation.txt`, `_routes.yaml`, `.skilled/skills/system-skilled-doctor/**` | Modify | 003 | Docs, the relayout plan read from `status --json`, playbook scenarios, version and changelog |
| `ai-speckit/skilled/barter-overlays/overlay-manifest.json`, `sync-state.json`, `skilled/commands/doctor/_routes.yaml` | Modify | 004 | New pin, the rebased routes overlay, rewritten source paths |
| `ai-speckit/skilled/barter-overlays/**` | Move | 004, 005 | Sources into `framework/` and `root/`, then the whole folder to `ai-speckit/overlays/` |
| `ai-speckit/skilled/.skilled-overlays.json` | Modify | 005 | `overlayDir` becomes `../overlays` |
| Barter hook sources (edit guard core, `pre-commit` commit gate, sk-git git-write gate) and their tests | Modify | 005 | They find the folder by the name `barter-overlays` under the tree. They first learn both places, then only the new one |
| `ai-speckit/overlays/checks/*.cjs`, overlay tests, `init-repository.sh`, `sync-skilled-specs.mjs`, `tests/*.test.sh`, `.gitignore`, READMEs, `CONTRIBUTING.md` | Modify | 004, 005 | Source prefix (004), then the hard-coded folder path (005) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-engine-out-of-tree-overlay-folder/ | Runs in Skilled. The engine accepts `overlayDir: "../<name>"`, and every status, apply, guard, pre-commit, adopt, relayout and re-pin path works with the folder beside the tree | Complete |
| 2 | 002-engine-framework-root-source-layout/ | Runs in Skilled. The `framework/` + `root/` rule becomes the default for every consumer. Old-layout trees keep applying and see a capped LAYOUT notice, and `apply --relayout` is the one migration step | Complete |
| 3 | 003-engine-docs-and-release/ | Runs in Skilled. Docs, workflows, playbook and release note describe the default change and its migration step | Complete |
| 4 | 004-barter-repin-and-relayout/ | Runs in ai-speckit, in one session. Barter re-pins onto the commit phase 3 produces, then relays every source with no adopt in between | Complete |
| 5 | 005-barter-move-overlays-out-of-tree/ | Runs in ai-speckit. The three hooks first learn both locations, in their own commit. Then the folder moves to `ai-speckit/overlays/`, the setting names `../overlays`, and the checks, tests, scripts and docs follow | Complete |
| 6 | 006-review-remediation/ | Runs in Skilled. Fixes the Skilled findings of the extended deep review in `review/review-report.md`: relayout rollback on a mid-run failure, the outside-repository refusal at resolution, two remedies, three engine readability items, and the phase 002, 004 and 005 records | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- Phases 4 and 5 run from an ai-speckit session. They read this packet from the Skilled checkout and write nothing in Skilled except their own phase docs.
- Phase 6 runs in Skilled, on the worktree branch the earlier engine phases used, and fixes only the Skilled findings of the review. The review's ai-speckit findings belong to an ai-speckit session.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-engine-out-of-tree-overlay-folder | 002-engine-framework-root-source-layout | Sibling-folder fixtures pass, and the existing in-tree suite passes unchanged | `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` exits 0 |
| 002-engine-framework-root-source-layout | 003-engine-docs-and-release | New-default fixtures pass, and an old-layout fixture still applies, with status `RESULT: PASSED` and capped LAYOUT notes | the same `node --test` command exits 0 |
| 003-engine-docs-and-release | 004-barter-repin-and-relayout | Phases 1-3 are committed in Skilled, and the commit id is on phase 4's `Target Skilled commit:` line | `git -C <Skilled> log -1 --format=%H` matches that line in `004-barter-repin-and-relayout/spec.md` |
| 004-barter-repin-and-relayout | 005-barter-move-overlays-out-of-tree | Barter is on the new pin, every source sits under `framework/` or `root/`, and status passes with no off-layout source | `node .skilled/commands/doctor/scripts/overlay-engine.cjs status --json` in `ai-speckit/skilled` reports `PASSED` and an empty `offLayout` |
| 005-barter-move-overlays-out-of-tree | 006-review-remediation | The extended deep review has run over phases 1-5 and its report names the findings this phase fixes | `review/review-report.md` exists and lists the active findings in §3 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None open. The operator answered every question on 2026-11-20.

### Resolved

- **Switch or flag day: flag day.** The `framework/` + `root/` rule is the default for every engine consumer, and there is no opt-in `sourceLayout` field.
  - The engine reads sources verbatim from the manifest, so old-layout trees keep applying. Status shows a capped, advisory LAYOUT notice until the consumer runs `apply --relayout` once.
  - Phase 002 records the migration decision and why.
  - Barter's re-pin and relayout merged into phase 004, so its folder is never left half-migrated across sessions.
- **How far outside the tree.** Only a direct sibling, `../<name>`, is allowed. Deeper paths are refused (phase 001).
- **Overlay folder outside the git repository.** It is refused. Pre-commit exits 2 with a same-repository line (phase 001).
- **Stage layout.** With a sibling folder, `repin --stage <dir>` holds `<dir>/<tree>` and `<dir>/<overlays>`, so a stage writes nothing live (phase 001).
- **Setting file location.** `ai-speckit/skilled/.skilled-overlays.json` stays inside the vendored copy and names `../overlays`. No re-pin touches it, because it is not in `repin.rootFiles` (phase 005).
- **Which Skilled commit Barter re-pins to.** Phase 004 records the commit that phase 003 produces, on its `Target Skilled commit:` line.

### Resolved for building phases 002 and 003 (operator, 2026-11-20)

- **Branch.** Phases 002 and 003 build on the worktree branch `worktrees/481-overlay-framework-root-layout`. Once both pass, the branch merges into Skilled `main` locally. Skilled is never pushed.
- **Release.** Phase 003 writes the version bump and the release note in the repository only: no GitHub release, no tag, no push.
- **Extra scope in phase 002.** It also closes phase 001's open P2 with a test: a broken sibling link pointing into the tree is accepted until its target exists. It updates the sk-create-goal docs left stale by the Level 1 goal fix (`SKILL.md`, `README.md`, the child template and the phase-add text), in a separate commit.
- **Workers.** Claude workers run on Opus at medium effort. DeepSeek runs through cli-pi on `llmgateway/deepseek-v4.1-flash-1017`, at thinking `high` for simple tasks and `max` for hard ones. Devin is out of quota.
- **Failure policy.** When a phase still fails its tests or checks after three fix attempts, work stops. Earlier phases stay committed, and the failing phase's work stays uncommitted in the worktree for the report.
- **Phases 004 and 005** run from a separate ai-speckit session, pinned to the merged `main` commit.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Related fix, goal authoring for Level 1 children**: phases 002 to 004 are Level 1 and have no `acceptance-criteria.md`, so sk-create-goal's nested-child and phase-parent stop blocked their goals. `sk-create-goal/references/parent-and-nested-goals.md` and both `create-goal-*.yaml` assets now let a Level 1 nested child take its criteria from its `spec.md` requirements and success criteria; a child at Level 2 or higher still stops without `acceptance-criteria.md`. Committed on this packet's branch apart from the phase work.
- **Design notes**: `scratch/design-notes.md` holds the verified engine facts, the migration decision and the Barter sequencing
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
