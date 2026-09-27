---
title: "Goal: Phase 18: worktree-provision-shared-link"
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
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/018-worktree-provision-shared-link"
    last_updated_at: "2026-09-27T12:06:41Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "owner-fix-018-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 18: worktree-provision-shared-link

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet has one limit, 4000
> characters, measured from the frontmatter's closing fence to the log anchor.
> Up to 4000 passes and past it fails; the runtime goal surfaces cap what they
> hold, and a truncated objective loses its tail, which is where the criteria
> live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make `sk-git` worktree provisioning install a package whose only dependencies are `@spec-kit/*` links, so every provisioned worktree gets `sk-doc`'s `@spec-kit/shared` link and `parent-skill-check.cjs` can load its contract library, and repair this worktree's link once the operator says yes.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The fix changes only the dependency-name choice in `_wn_deps_satisfied` and the comment above it. A `@spec-kit/*` entry is checked only when a package declares nothing else. The `node_modules` walk, `provision_worktree` and `worktree-provision-paths.txt` stay unchanged |
| D2 | The repair is an install. It runs only after the operator's yes, installs `sk-doc` only and never links a tree from the main checkout. Its rollback is `rm -rf .skilled/skills/sk-doc/node_modules` |
| D3 | `sk-git` owns both files. The build follows its SKILL.md rule 8 and its hermetic harness, and writes the shell change and test to `sk-code`'s OpenCode shell standards. Kill: the harness fails or any listed package other than `sk-doc` changes its result. Revert both files |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend this file's
chat slice so the operator can update their copy. The chat slice is the
durable slice without its frontmatter, HTML comments, anchor markers, `---`
dividers or heading section numbers, and `goal.cjs packet` prints it as
`chat_slice`. Never send more than 4000 characters: cut this file first. Keep
reminding while the copy stays unset, and never stop work for it. A child goal
change that alters a parent decision or criterion is an amendment to the
parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] `bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` exits 0 and prints `FAIL=0` with a `PASS` count three higher than its pre-edit baseline, which was `PASS=80` on 2026-09-27
- [ ] With only the dependency-name change reverted, the same harness prints a `FAIL:` line for the `spec-kit-only` assertion and exits 1
- [ ] Before the repair, sourcing `.skilled/skills/sk-git/scripts/worktree-naming.sh` and calling `_wn_deps_satisfied` returns 1 for `.skilled/skills/sk-doc` and 0 for each of the other eight listed packages that have a `package.json`
- [ ] `rg -n -e 'specs/' -e 'REQ-[0-9]' -e 'AC-[0-9]' -e 'cli-jev' .skilled/skills/sk-git/scripts/worktree-naming.sh` returns no match
- [ ] `git diff --name-only -- .skilled` lists only `.skilled/skills/sk-git/scripts/worktree-naming.sh` and `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh`
- [ ] After the operator's yes and the repair, `readlink .skilled/skills/sk-doc/node_modules/@spec-kit/shared` prints `../../../system-spec-kit/shared` and `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc` prints `OK: parent-skill-check` and exits 0
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/018-worktree-provision-shared-link --strict` prints `RESULT: PASSED`
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
| Planning documents | Done | 2026-09-27: `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, this goal and `implementation-summary.md` authored from the orchestrator's phase brief and a reread of `worktree-naming.sh:471-499`, `worktree-provision-paths.txt:37-40` and `tests/worktree-naming.test.sh:218-289` |
| Symptom | Confirmed | 2026-09-27: `parent-skill-check.cjs .skilled/skills/sk-doc` exited 1 with the `12-lib` `Cannot find module '@spec-kit/shared/frontmatter/parse-frontmatter.js'` failure. `.skilled/skills/sk-doc/node_modules` is absent here, and the main checkout's link reads `shared -> ../../../system-spec-kit/shared` |
| Cause | Confirmed | A read-only loop over the path list with the sourced `_wn_deps_satisfied` reported all nine packages with a manifest as satisfied, `sk-doc` included |
| Build | Pending | Nothing is built. The phase is Planned |
| Repair | Pending | Waits for the operator's yes |

### Deviations and findings

| Item | Note |
|------|------|
| Harness run at authoring time | The brief says never to run the provisioning. The owner's hermetic harness was run twice to take the baseline (`worktree-naming tests: PASS=80 FAIL=0`). It calls `provision_worktree` only on fixtures in a `mktemp` repository with a stub `npm`. Afterwards `git worktree list` still showed 4 entries, `git status` under `sk-git` and `sk-doc` was empty and `sk-doc/node_modules` was still absent |
| Why `@spec-kit/` is filtered | No comment, commit message (`725d66c495`) or spec (`specs/sk-git/029-worktree-dependency-provisioning`) states it. The comment says the check looks for the package's "first real dependency". This phase reads a `@spec-kit/*` entry as a local link that can be found on the walk without proving an install, and D1 keeps that for any package with a real dependency |
| Three assertions, not two | The brief asks for a fixture with only a `file:` `@spec-kit` dependency. A third assertion guards the kept rule that a package declaring nothing is never installed, which no existing assertion checks |
| Parent handoff wording | The parent's handoff row asks for `parent-skill-check.cjs` to pass in a freshly provisioned worktree. This phase proves it in this worktree, where the fixed `provision` installs `sk-doc` from nothing. A throwaway worktree is an owner option in `spec.md` section 10 |
| Owner collision check | `git log -5` on the `sk-git` scripts lists `b946bc9e95` (2026-09-24) as the newest. No uncommitted change under `.skilled/skills/sk-git` at authoring time |
| Findings for the owner | 3 of the 4 checkouts in `git worktree list` lack the `sk-doc` link. The `.` line in the path list names a root `package.json` that git does not track, so provisioning skips it. Whether a new worktree gets `system-spec-kit/shared/dist` is UNKNOWN |
| Phase label | `create.sh` labeled this folder "Phase 1". Titles and `description.json` now say Phase 18 |
<!-- /ANCHOR:log -->
