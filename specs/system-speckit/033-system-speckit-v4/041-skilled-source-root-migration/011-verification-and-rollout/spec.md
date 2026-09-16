---
title: "Feature Specification: Phase 11: verification-and-rollout"
description: "Prove the .skilled source root on all seven runtimes and every gate, publish the verified tip to skilled/v4.0.0.0 and main with CI watched to completion, reconcile the main checkout and close the packet."
trigger_phrases:
  - "skilled migration verification"
  - "skilled rollout push plan"
  - "runtime canary smoke test"
  - "skilled residue scan"
  - "skilled migration closeout"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 11: verification-and-rollout

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-16 |
| **Branch** | `worktrees/055-skilled-source-root-migration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 11 |
| **Predecessor** | 010-machine-and-consumer-cutover |
| **Successor** | None |
| **Handoff Criteria** | The packet closes: the parent goal's six completion criteria are checked with evidence, `skilled/v4.0.0.0` and `main` carry the verified SHA with CI green and the main checkout carries it too or its blocker sits with the operator |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the skilled source-root migration specification.

**Scope Boundary**: This phase changes no design. It proves the state phases 003 to 010 produced, publishes it, reconciles this machine and closes the parent's six completion criteria (`../goal.md:86-91`). A gate that turns red gets a forward fix on the failing surface only, logged against the phase that owns that surface.

**Dependencies**:
- Phase 010 validates `RESULT: PASSED` with its acceptance criteria met, because phases run strictly in order (`../goal.md:46`).
- Phase 004's frozen layout: the `.opencode/` set it keeps, the reference allowlist, the freeze policy and the rollback window (`../spec.md:143`).
- Phase 005's independent check, which lives outside the moved tree (`../spec.md:120`, `../spec.md:144`).
- Phase 010's record of where the global hooks and home configs point, with their rollback (`../spec.md:149`).

**Deliverables**:
- A 21-cell canary record: seven runtimes, each loading one skill, one command and one agent.
- The 13-gate local matrix run at one pinned SHA, with the proof that each gate ran.
- A tree-shape census and a residue scan against the reconciled maps and 004's allowlist.
- Phase 005's independent check run on a control copy and on deliberately broken copies.
- Fast-forward pushes to `skilled/v4.0.0.0` and `main`, with CI watched to completion and censused on both.
- The main checkout reconciled, scratch and caches removed, worktree 055 retired and the parent goal marked.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Nothing yet proves that the `.skilled` source root works on the seven runtimes, in the local gates and in CI. When phase 010 ends, the authored tree sits under `.skilled/` with its links and generated state rebuilt, and this machine's hooks point at the new root. The usual proof does not work for this change. The repository's gates skip rather than fail when their scripts move: the pre-commit mirror checks `continue` past a missing script (`.opencode/scripts/git-hooks/pre-commit:180`), and CI steps warn and exit 0 when a guard is absent (`.github/workflows/markdown-link-integrity.yml:30-32`). Phase 001 therefore ruled that a green pre-commit or CI run on the migration is not evidence (`../001-deep-research/research/research.md:177`).

The seven runtimes also reach the tree in different ways. Claude Code links its skills directory, Codex gets generated pointer stubs, Hermes gets generated skill copies and three runtimes read agents from the hand-kept `.claude/agents` fork (`.claude/SYNC.md:27`, `.codex/SYNC.md:28-29`, `.hermes/SYNC.md:24`, `.cursor/SYNC.md:31`). One runtime passing says little about the other six.

### Purpose

Every parent completion criterion gets checked with evidence that could have come out the other way, the verified SHA lands on both branches with CI green and nothing this phase created is left behind.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- (a) Live canary smoke tests on Claude Code, Codex, Cursor, Devin, Pi, Hermes and opencode, each loading a skill, a command and an agent, proving the read came from `.skilled/` and not from a stale copy.
- (b) The 13-gate local matrix in `plan.md` §5.2, including how each silently skipping gate is shown to have run.
- (c) A tree-shape census and a residue scan of every tracked file naming `.opencode`, against the reconciled maps (`../002-per-runtime-reference-map/research/research.md:27-32`) and 004's allowlist.
- (d) Phase 005's independent check on an unbroken control copy and on one deliberately broken copy per breakage class.
- (e) Rebase onto the current tip, then fast-forward pushes to `skilled/v4.0.0.0` and `main` with CI watched to completion on both. Parent D2 pre-authorizes these pushes, with the rollback written first (`../goal.md:47`).
- (f) Reconciling the main checkout per sk-git Step 5b (`.opencode/skills/sk-git/references/finish-workflows.md:329-372`).
- (g) Cleanup and closure: scratch outputs and pytest caches first, then worktree 055 once its work is merged. The parent goal log and criteria are updated before either is removed.

### Out of Scope

- Design changes. The layout, cutover order and rollback belong to phase 004 and are frozen (`../spec.md:143`).
- `barter/`, whose links resolve into a different checkout (`../spec.md:90`).
- Home configs on other machines, because the home map covers this machine only (`../002-per-runtime-reference-map/research/research.md:84`).
- Rewriting frozen records such as changelogs, benchmark reports and dated run directories (`../002-per-runtime-reference-map/research/research.md:129`).
- Correcting `remote-branch-policy.md:38-39`, which still calls `skilled/v*` hardcoded. Both pushes work either way, so this phase logs it as a finding.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `011-verification-and-rollout/tasks.md`, `acceptance-criteria.md`, `goal.md`, `implementation-summary.md` | Modify | Checked tasks, met criteria and the evidence digest |
| `../goal.md` | Modify | Log rows for SHAs, CI runs and rollback, plus the six criteria marked |
| `../spec.md` | Modify | Phase 11 status in the phase map |
| `011-verification-and-rollout/description.json`, `graph-metadata.json` | Regenerate | Rebuilt by the repair command `validate.sh` prints, never hand-edited |
| `011-verification-and-rollout/scratch/evidence/*` | Create, then Delete | Raw logs, TSVs and query files, removed at cleanup |
| Files behind a red gate | Modify | Forward fixes only, each named when the gate fails |
| Remote `skilled/v4.0.0.0` and `main` | Push | Fast-forward to the verified SHA |
| Primary checkout `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public` | Fast-forward | Step 5b or an operator handback |
| Worktree `/Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration` | Remove | After its branch is merged and the operator says yes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each of the seven runtimes returns the canary token planted under `.skilled/` for one skill, one command and one agent through its documented consumption path, and a negative control without the load does not return it. Parent criterion 3. |
| REQ-002 | All 13 gates in `plan.md` §5.2 pass at one pinned SHA, and each shows its affirmative marker rather than only an exit status. Parent criterion 4. |
| REQ-003 | At that SHA, `.skilled/` holds the authored directories and `.opencode/` holds exactly the set phase 004 kept. Parent criterion 2. |
| REQ-004 | The residue scan finds zero tracked non-frozen files naming an `.opencode` path outside 004's allowlist, and the same scan finds a planted positive control. Parent criterion 5. |
| REQ-005 | Phase 005's independent check passes on an unbroken copy and fails on every deliberately broken copy, naming the broken path. Parent criterion 4. |
| REQ-006 | `origin/skilled/v4.0.0.0` and `origin/main` both fast-forward to the verified SHA, and CI completes with `success` on both, every expected workflow observed and no guard skipped. Parent criterion 4. |
| REQ-007 | The primary checkout carries the verified SHA, and all seven global hooks and the recorded home-config paths resolve from it. Parent criterion 6. |
| REQ-008 | All eleven phases validate `RESULT: PASSED` on their own runs, and the parent goal marks its six criteria with evidence. Parent criterion 1. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | A GPT-5.6 review on cli-codex, a second model family, reads the evidence set before the first push and leaves no row contradicted. |
| REQ-010 | Task-created scratch, evidence files, clones and pytest caches are gone, and worktree 055 is removed after its branch is merged and the operator says yes. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The parent goal's six completion criteria are all checked, each with a cited receipt (`../goal.md:86-91`).
- **SC-002**: `git rev-parse origin/skilled/v4.0.0.0` and `git rev-parse origin/main` both print the SHA the evidence was produced at, and every expected CI run for that SHA concluded `success`.
- **SC-003**: Every row in `acceptance-criteria.md` is `Met`, and `git status --porcelain` in the worktree lists no file this phase created.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 004 kept set, allowlist and freeze policy | REQ-003 and REQ-004 cannot be judged | Read before the scan (T002). Until then these are UNKNOWN (§10) |
| Dependency | Phase 005 independent check | REQ-005 has nothing to run | Read its contract first (T003) |
| Dependency | Seven runtime CLIs, `gh` and `rg` installed and authenticated | Smoke cells or CI census blocked | Pre-flight in T005 reads output text. An auth failure blocks the cell, it never skips it |
| Risk | Gates self-disengage when scripts move (`../001-deep-research/research/research.md:79-87`) | High | Every gate in the matrix names its proof of running, and the independent check runs against broken copies |
| Risk | Seven workflows run only on pull requests, so a direct push never runs them (`.github/workflows/comment-hygiene.yml:2-4`, `agent-mirror-sync.yml:2-4`, `markdown-link-integrity.yml:3-5`, `prompt-card-sync.yml:2-4`, `repo-rules-corpus.yml:2-4`, `rule-canary-sync.yml:2-4`, `skill-doc-frontmatter.yml:2-4`) | High | Gate G11 runs all seven locally before the push |
| Risk | Path-filtered push workflows may not start for a push this size. GitHub's filter behavior on a diff of about 17,767 renames is UNKNOWN | High | CI census compares expected runs with runs observed for the SHA, then dispatches or runs the missing job locally (plan §5.5) |
| Risk | A `.pytest_cache` inside a leaf root joins the manifest walk, which has no dot-directory exclusion (`.opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:104-108`). A pytest file already sits under `assets/` (`.opencode/skills/sk-code/sk-code-opencode/assets/scripts/test_verify_alignment_drift.py`) | Med | Delete caches before G02, run pytest with `-p no:cacheprovider`, never run the gate with `--fix` |
| Risk | The naming guard includes untracked files (`.opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py:175-176`), so over-long containment snapshots from other sessions crash it, and a crash exits 1 like a finding (`:359-361`) | Med | Run G03 in a clean detached checkout and read for the `PASS:` line |
| Risk | Four tracked names under `.opencode/` are grandfathered snake_case today, observed 2026-09-16: `prompt_improve_auto.yaml`, `prompt_improve_confirm.yaml`, `prompt_improve_presentation.txt` and fixture `Spec_Draft.md`. After a move the guard sees them as new | Med | If G03 or CI names exactly these, the fix belongs to phase 005 or 007, never to a bypass here |
| Risk | The pre-push mass-deletion ceiling counts `git diff --diff-filter=D` deletions against a ceiling of 100 (`.opencode/scripts/git-hooks/lib/mass-deletion-guard.sh:45-57`). A file moved and later edited may count as a deletion at the push endpoints. This is INFERRED, not measured | Med | Pairing precheck before each push (plan §4.2). The one-push bypass is used only when every counted deletion is a proven move |
| Risk | Concurrent sessions push to `skilled/v4.0.0.0` and may add files under `.opencode/` while this phase verifies | Med | Rebase first, check the upstream delta for new `.opencode/` files, re-verify when the tip moves, three rounds at most |
| Risk | The primary checkout had a tracked modification to `.opencode/skills/system-deep-loop/runtime/database/council-graph.sqlite` on 2026-09-16, and Step 5b forbids stash or reset on a dirty primary (`finish-workflows.md:361`) | High | Operator handback with the exact sync commands (T034). The global hooks point into that checkout, so REQ-007 waits on it |
| Risk | Hermes loads project skills only after an operator trust grant for the root path (`.hermes/SYNC.md:40`), and no dispatch performs that step (`.hermes/SYNC.md:44`) | Low | If the worktree root is untrusted, the Hermes skill and agent cells wait for the operator's grant |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Every live runtime dispatch runs under a 300-second alarm, the bound the Hermes playbook uses (`.opencode/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook/skills-and-plugins/project-skill-preload.md:32`). A hung dispatch counts as a failure.
- **NFR-P02**: Each gate log records its wall-clock time, so the next run of this matrix has a baseline to compare against.

### Security
- **NFR-S01**: No secret reaches an evidence log or a delegate brief. Home-config probes test path existence and named keys only.
- **NFR-S02**: `SPECKIT_ALLOW_REMOTE_PUSH` and `SPECKIT_ALLOW_MASS_DELETION` ride on the single push command they authorize and are never exported (`.opencode/skills/sk-git/references/remote-branch-policy.md:56`).

### Reliability
- **NFR-R01**: No verdict rests on an exit status. Each gate names the output marker that proves it ran (`repo-rules/evidence-and-proof.md:91-95`).
- **NFR-R02**: All evidence pins to one SHA. When the remote tip moves, the whole matrix re-runs at the new SHA.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty residue result: it counts only after the same scan finds a planted positive control.
- Zero skill roots: the metadata gate keeps only real directories (`.opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:112`), so `checked=0` at exit 0 fails the gate.
- A vitest filter that selects fewer files than it names fails the gate even when every selected test passes.

### Error Scenarios
- A runtime fails authentication: its cells are blocked, never skipped, because parent criterion 3 cannot close on a skip.
- The remote rejects a push as non-fast-forward: fetch, rebase, re-verify and retry, three rounds at most, then escalate.
- A CI job fails once without a code change: re-run it with `gh run rerun`. A second failure is treated as real.

### State Transitions
- A smoke run stops with canaries still planted: on resume, restore the canary files from git before any other step.
- `skilled/v4.0.0.0` is pushed but `main` is blocked: the release branch keeps the SHA, `main` is retried once the block clears and the rollback covers the pushed branch only.
- The primary checkout is dirty, diverged or busy at reconcile time: no stash and no reset. The blocker goes to the operator with the sync commands (`.opencode/skills/sk-git/references/finish-workflows.md:361-369`).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | 7 runtimes by 3 surfaces, 13 local gates, 2 remote branches, 1 primary checkout |
| Risk | 22/25 | Publishes to `main`. The global hooks serve every repository on this machine (`../001-deep-research/research/research.md:59`) |
| Research | 8/20 | Six questions stay open until phases 004, 005 and 010 are planned (§10) |
| **Total** | **50/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- UNKNOWN: the `.opencode/` set phase 004 keeps, its reference allowlist and its freeze policy for `specs/**`. The reconciled maps exclude `specs/` (`../002-per-runtime-reference-map/research/research.md:16`). Resolved by reading 004's frozen decisions (T002).
- UNKNOWN: the name, command and breakage classes of phase 005's independent check. Resolved by 005's contract (T003).
- UNKNOWN: whether `claude -p` and `codex exec` expand a project slash command in print mode. No repository file documents either. The canary cell answers it, and a failed expansion is recorded rather than worked around.
- UNKNOWN: whether parent criterion 3 accepts non-native proof paths. Codex agent personas are TUI-only (`.opencode/skills/cli-external-orchestration/cli-codex/SKILL.md:250`), `pi -p` has no persona surface (`.opencode/skills/cli-external-orchestration/cli-pi/SKILL.md:216`), Devin has no command surface (`.devin/SYNC.md:20`) and Claude Code, Cursor and Devin read agents from the `.claude/agents` fork rather than `.skilled/` (`.claude/SYNC.md:32`). If generated-copy and fork proofs are not enough, the criterion wording is a parent amendment, applied to the parent first.
- UNKNOWN: where phase 010 points the seven global hooks and whether they resolve before the primary checkout moves. Today all seven are absolute links into the primary checkout's `.opencode/scripts/git-hooks/`, observed 2026-09-16. Resolved by 010's record (T004).
- UNKNOWN: whether phase 005 or 006 recorded the deep-loop suite baseline of 154 files and 2,681 tests. No packet file holds that figure today, so T007 re-captures it from the pre-move SHA if needed.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown and Verification Checklist**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Phase Goal**: See `goal.md`
- **Parent Goal**: See `../goal.md`
