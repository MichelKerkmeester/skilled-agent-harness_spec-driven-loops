---
title: "Goal: upgrade-reversibility"
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
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/010-upgrade-reversibility"
    last_updated_at: "2026-10-08T13:00:36Z"
    last_updated_by: "orchestrator"
    recent_action: "Phase built and verified on local evidence"
    next_safe_action: "Commit with wave 2"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: upgrade-reversibility

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give `upgrade-legacy --apply` a reversibility record so external users can validate the plan before and after.

### Decisions

Frozen choices, decided 2026-10-08 by the operator. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One manifest per worktree at `<git-dir>/upgrade-legacy.manifest.json`, with `<git-dir>` from `git -C <REPO> rev-parse --absolute-git-dir`, where REPO is the repository the script edits |
| D2 | On a dirty tree, `--apply` writes the manifest before its first change and refuses when it cannot write. Committed trees need no manifest |
| D3 | `--apply` refuses when REPO is not a git repository |
| D4 | The manifest stores real before-image content for each dirty file the run touches: a blob id from `git hash-object -w`, or the file bytes |
| D5 | Built in wave 2 by GPT-6 Luna max on the fast tier through cli-codex: `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 codex -a never exec --model gpt-6-luna -c model_reasoning_effort="max" -c service_tier="fast" --sandbox workspace-write "<brief>" </dev/null`. One brief per task group in tasks.md, each naming its files and the check that proves it |
| D6 | Reviewed read-only by DeepSeek V4.1 Flash max through cli-pi on the LLM Gateway route with `--tools read,grep,find,ls`. The builder applies a finding only after confirming it in the code, for at most two rounds |
| D7 | The builder writes only the files in spec.md Files to Change, its tests and this folder. The orchestrator reverts any other write |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] Test `upgrade-legacy.vitest.ts::dirty-tree-writes-manifest` passes: `--apply` on a dirty fixture writes the manifest under `git -C <REPO> rev-parse --absolute-git-dir` before any change
- [x] Test `upgrade-legacy.vitest.ts::manifest-before-image-restores` passes: a dirty file restored from the manifest matches its original bytes
- [x] Test `upgrade-legacy.vitest.ts::no-git-refuses-apply` passes: `--apply` without git refuses before any write
- [x] Dry run output includes a "Downgrades" section listing every finding that will transition from error to warning, and `::dirty-tree-idempotent` shows a second run reports zero plan changes
- [x] README at `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` documents manifest structure, location, before-image content and recovery procedure
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
| Spec and plan written | Done | spec.md, plan.md, tasks.md, acceptance-criteria.md and implementation-summary.md validated --strict before the build |
| Refusal without git | Done | `readRepositoryState()` and the `--apply` exit in `upgrade-legacy.mjs`; test `no-git-refuses-apply` passes |
| Manifest before the first change | Done | `prepareManifest()` runs before `repairPackets()` on a dirty tree; tests `dirty-tree-writes-manifest`, `dirty-tree-unwritable-manifest` and `manifest-before-image-restores` pass |
| Dry run Downgrades section | Done | `printDowngrades()` and `predictDowngradeFindings()`; the list equals the baseline `--apply` records, pinned by `dry-run Downgrades match the baseline recorded by apply` |
| Second run reports zero plan changes | Done | `dirty-tree-idempotent` passes: the second apply prints `plan changes=0` |
| Manifest recovery and stale refusal | Done | `manifest-recovery`, `stale-manifest-head-refuses-apply` and `stale-manifest-tree-refuses-apply` pass |
| README | Done | "Upgrade Legacy Reversibility" and "Recover an Interrupted Apply" in `spec/README.md`; `readme recovery resolves paths from the exported repository root` runs the script |
| Cross-family review | Done | Two rounds by DeepSeek V4.1 Flash max (DSL), eight findings, all applied; the round 2 symlink fix was redone by the orchestrator |
| Phase test files | Done | `upgrade-legacy.vitest.ts` and `repo-era.vitest.ts` rerun at close: 34 passed, exit 0 |
| Whole-tree gates | Done | rerun after round 2 and the symlink fix: cli test rc 0 with 167 files and 1685 tests passed (baseline 161 and 1639), `run check` and typecheck rc 0, hook tests 184 run, 0 fail |
| Validate changes | Done | `validate.sh --strict` on this folder prints `RESULT: PASSED`, `check-goal.cjs` passes |

### Deviations and findings

| Item | Note |
|------|------|
| Manifest design decided | 2026-10-08, the operator kept one manifest per worktree and added three fixes: resolve the git dir from REPO with `git -C <REPO> rev-parse --absolute-git-dir` rather than the current directory, refuse `--apply` without git, and store real before-image content. `--git-common-dir` and a path inside `specs/` were considered and rejected |
| Dependency | Phase 009 depends on this phase |
| Before-image is the file bytes | The manifest stores base64 bytes plus the mode, `absent` or a symlink target. `upgrade-legacy.mjs` never calls `git hash-object`; D4 allowed either |
| Function and fixture names | `isCommittedTree()` and `writeManifest()` became `readRepositoryState()`, `prepareManifest()`, `completeManifest()` and `writeManifestFile()`; the two fixture directories were not added because the cases build their trees in a throwaway git repository |
| Test titles | No test carries the title `dry-run-lists-downgrades`; two cases under other titles carry it. `no-git-refuses-apply` points `GIT_DIR` at a missing directory instead of using a sandbox without git |
| Review round 1 | F1 P1 a manifest at another HEAD was silently overwritten, fixed so `--apply` refuses; F2 P1 Downgrades listed errors the repair steps clear, fixed with a comparison test; F3 P2 an interrupted manifest blocked every later run, fixed with a dry-run report, an `--apply` refusal and a README recovery section; F4 P1 the tests AC-002 and AC-006 name were missing, added with a head-moved test |
| Review round 2 | F1 P1 the manifest baseline was never loaded, fixed; F2 P2 a moved checkout was rejected over `repoRoot`, fixed; F3 P2 the README script resolved paths against the working directory, fixed; F4 P2 the dry-run preview wrote through symlinks, builder fix failed outside its sandbox |
| Orchestrator code edit | Node v26.8.2 `fs.cpSync` with `recursive` and `dereference` keeps nested symlinks as links, so the builder's fix still wrote into the link target. The orchestrator wrote `materializeSymlinks()` because the review rounds were exhausted and the builder's sandbox could not observe the failure |
| Restore is a script | The tool loads the manifest's baselines; restoring dirty files from the before-images is the README script, not a command |
| Untested paths | An interrupted `in-progress` manifest, a run from a directory inside another checkout, concurrent runs and a path outside the repository have no test |
| Whole-tree gates first ran before round 2 | Rerun after round 2 and the symlink fix: 1685 passed, 0 failed |
<!-- /ANCHOR:log -->
