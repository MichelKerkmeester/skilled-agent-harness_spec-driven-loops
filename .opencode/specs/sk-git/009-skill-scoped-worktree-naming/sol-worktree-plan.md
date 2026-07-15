# CHECK → REFINE → PLAN

**Recommendation:** replace the human `wt/{NNNN}-{name}` branch namespace with `<owner>/wt/{NNNN}-{name}`, while retaining one repository-wide counter and a flat matching directory `.worktrees/{NNNN}-{owner}-{name}`. Keep `work/{runtime}/{slug}` as a narrow, local-only launch-wrapper exception.

The existing tree must not be bulk-cleaned. The snapshot supports six low-risk branch-only deletion candidates; every registered worktree and every unmerged branch needs a fresh cleanliness, ancestry, and session-ownership check.

No repository or Git state was changed.

## A. CHECK

### Current convention

[ALWAYS #4 (SKILL.md line 302)](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-git/SKILL.md) currently says:

> “Name worktree-created branches with the unified numbered namespace” — branch `wt/{NNNN}-{name}`, matching directory `.worktrees/{NNNN}-{name}`, where `{NNNN}` is `max(existing NNNN under .worktrees/) + 1`, starting at `0001`. The `wt/` prefix groups feature-worktree branches in Git UIs. Launch-wrapper worktrees are separately named `work/{runtime}/{slug}` with `.worktrees/{runtime}-{slug}` and are intentionally unnumbered.

New branches may only be created atomically with `git worktree add -b`; direct `git branch`, `git checkout -b`, and `git switch -c` are prohibited by [NEVER #2 (SKILL.md line 469)](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-git/SKILL.md).

The wrapper implements the second namespace directly at [worktree-session.sh:118](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/worktree-session.sh:118):

```text
branch:    work/{runtime}/{YYYYMMDD-HHMMSS}-{pid}
directory: .worktrees/{runtime}-{YYYYMMDD-HHMMSS}-{pid}
```

### Tensions and defects

| Tension | Finding |
|---|---|
| `wt/` versus `<skill>/` | A Git branch has one first path component. It cannot simultaneously begin with `wt/` and `<skill>/`. Packet 137 records both requirements in the same sentence, so its ADR-006 (research decision-record.md line 267) is not directly implementable. |
| Git-UI grouping | Current branches form one top-level `wt` group. Moving ownership first produces top-level groups such as `sk-git`, `sk-doc`, and `skilled`. Retaining `wt` as the second component—`sk-git/wt/...`—preserves the lane marker while making ownership visible. |
| Global counter | Skill-scoped refs such as `sk-git/wt/0040-x` and `sk-doc/wt/0040-y` are both legal Git refs. Git therefore cannot enforce cross-owner number uniqueness. A centralized allocator must. |
| Current counter is not truly global | The copied shell expression scans only direct `.worktrees/` directory names. It misses external `/private/tmp/**` and `.claude/worktrees/**` worktrees, remaining branch refs after directory removal, and concurrent allocations. Removing the highest directory can also cause reuse. |
| No executable human-name generator | Human allocation exists only as repeated Markdown shell snippets in `README.md`, `worktree_workflows.md`, and `worktree_checklist.md`. The wrapper is the only executable name generator. No branch/worktree naming validator exists under `sk-git` or `.opencode/bin`. |
| Pair drift is already real | The snapshot contains directory `.worktrees/0006-028-cli-impl` checked out on branch `wt/0007-cli-impl`. It also contains nonnumbered `wt/goal*` branches. Nothing verifies branch/path pairing. |
| Detached worktrees are ambiguous | `worktree_workflows.md` says detached worktrees receive no number, while `quick_reference.md` and `shared_patterns.md` show numbered detached directories. Packet 137’s projection/resolver worktrees need one deterministic rule. |
| Wrapper conflict | The operator’s literal rule would reject `work/opencode/...`, but ALWAYS #4 explicitly makes it a separate, unnumbered machine namespace. Renaming wrapper sessions into `skilled/` would mix process identities with human branches and introduce counter allocation into concurrent startup. |
| Reaper uses the wrong integration base | [worktree-reaper.sh:85](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/worktree-reaper.sh:85) tests ancestry against local `main`. The snapshot says `main` is 1,408 commits behind `origin/skilled/v4.0.0.0`; therefore “merged into v4” does not imply the reaper will recognize it. |
| Reaper cannot prove inactivity | It removes any clean `.worktrees/*` entry merged into `main`, including human worktrees, without a session marker or ownership check. A clean worktree can still have a live AI session. |
| Cleanup ordering is inconsistent | Several examples delete the branch before removing the worktree. Git normally refuses to delete a branch still checked out in a linked worktree. The safe order is worktree removal first, then `git branch -d`. |
| Primary-tree safety | ALWAYS #15 forbids stashing, rebasing, resetting, or force-syncing a dirty/concurrent-owned primary checkout. The snapshot’s primary tree is on `fix/create-benchmark-audit-remediation`; the operator additionally states it has 150+ dirty files. Cleanup must run from a separate clean control worktree. |

### Snapshot classification

The supplied [snapshot](/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/48a7486b-cc91-4525-b512-a33deb064c41/scratchpad/git-state-snapshot.txt:1) contains 49 local branches and 41 worktrees.

#### Branches by ownership class

- **Already conformant:** `skilled/v4.0.0.0`.
- **Reserved exception:** `main`. It remains a permanent compatibility/default ref, not a task branch.
- **Machine-generated wrapper:** the eight `work/opencode/{timestamp-pid}` branches. Seven are ancestors of v4; `work/opencode/20260710-092819-30688` is two commits ahead and therefore protected.
- **Backup/safety:** `backup/primary-v4-97c3a7b330` and `backup/primary-working-97c3a7b330`. Both are unmerged and must be preserved pending operator adjudication.
- **Nonconformant human/legacy:** 37 branches:
  - `fix/create-benchmark-audit-remediation`
  - all four `system-speckit/*` branches; `system-speckit` is not the actual skill ID `system-spec-kit`
  - `wip/stage1-goal-hardening`
  - `work/021-graph-preservation`, which does not match wrapper grammar
  - all 30 `wt/*` branches. These follow or approximate the old convention, but not the refined owner-first rule.

#### Clearly stale branch-only candidates

These six are ancestors of `origin/skilled/v4.0.0.0` and are not checked out in any snapshot worktree:

```text
system-speckit/023-esm-module-compliance
system-speckit/024-compact-code-graph
system-speckit/026-graph-and-context-optimization
wt/0030-underscore-migration
wt/0031-sk-doc-foundation
wt/0032-skills-group2
```

They are the lowest-risk deletion phase, subject to a live re-check.

#### History-stale but still checked out

Twenty-three human/legacy branches are merged into v4 but still have registered worktrees:

```text
work/021-graph-preservation
wt/0002-followups
wt/0003-followup-sentinel
wt/0004-followup-memorysave
wt/0005-memory-followups
wt/0007-cli-impl
wt/0008-findings-remediation
wt/0010-016-012
wt/0012-016-002
wt/0013-016-003
wt/0014-016-004
wt/0015-016-005
wt/0016-016-006
wt/0017-016-007
wt/0029-daemon-reaper
wt/0033-benchmark-authoring
wt/0034-deep-review-059
wt/0037-sk-git-continuous-integration
wt/goal-integration
wt/goalAB-skdoc
wt/goalC-cli-rename
wt/goalD-codex
wt/opencode-doc-readmes
```

Seven merged wrapper worktrees are also stale candidates:

```text
work/opencode/20260710-062729-13488
work/opencode/20260710-062731-13877
work/opencode/20260710-062733-14181
work/opencode/20260710-063918-40658
work/opencode/20260710-063920-40725
work/opencode/20260710-063922-40872
work/opencode/20260710-063924-40916
```

These 30 worktrees are **not yet removable**. The snapshot does not prove cleanliness or session inactivity.

#### Detached/tool scratch worktrees

These six have no branch and therefore no snapshot ancestry classification:

```text
wt-stage1-recover          @ 907a189dd6
wt-v4-current              @ 607c32219e
wt-028                     @ 6ff2546493
.worktrees/0024-028-extract  @ 7dae42fc8a
.worktrees/0025-028-renumber @ 8b5f4167b7
.worktrees/view-latest-v4    @ 5535ad58f6
```

Each is active/uncertain until its HEAD containment, dirty state, and owner are checked.

#### Unmerged branches: confirmation required

“Ahead” means commits absent from `origin/skilled/v4.0.0.0`; it does not prove those commits lack another ref. Deleting the local branch would remove its local name and could orphan some or all of them.

| Branch | Ahead | Snapshot worktree/upstream | Potential loss |
|---|---:|---|---|
| `backup/primary-v4-97c3a7b330` | 14 | no worktree; no upstream | Highest orphan risk: local safety reachability for 14 commits |
| `backup/primary-working-97c3a7b330` | 15 | no worktree; no upstream | Highest orphan risk: local safety reachability for 15 commits |
| `fix/create-benchmark-audit-remediation` | 1 | primary checkout; remote upstream | Current dirty/concurrent work plus one commit |
| `system-speckit/027-xce-research-based-refinement` | 1 | no worktree; remote upstream | One commit; remote containment must be verified |
| `wip/stage1-goal-hardening` | 2 | no worktree; no upstream | Local reachability for two commits |
| `work/opencode/20260710-092819-30688` | 2 | wrapper worktree; no upstream | Two session commits |
| `wt/0001-mcp-front-proxy` | 4 | registered worktree; remote upstream | Four commits plus any uncommitted work |
| `wt/0006-deep-review-audit` | 1 | no worktree; remote upstream | One commit |
| `wt/0014-sk-code-parent` | 14 | no worktree; no upstream | Local reachability for 14 commits |
| `wt/0038-codex-hook-parity` | 16 | registered worktree; remote upstream | Sixteen commits plus any uncommitted work |
| `wt/0039-017-hyphen-naming` | 1 | registered worktree; remote upstream | One commit plus any uncommitted work |

## B. REFINE

### Recommended grammar

```text
SKILL_ID      := canonical first-party SKILL.md frontmatter name
OWNER         := SKILL_ID | "skilled"
NNNN          := "0001" … "9999"; "0000" is invalid
SLUG          := lowercase kebab-case, nonempty
TASK_BRANCH   := OWNER "/wt/" NNNN "-" SLUG
TASK_DIR      := ".worktrees/" NNNN "-" OWNER "-" SLUG

BACKUP_BRANCH := OWNER "/backup/" NNNN "-" SLUG
RELEASE       := "skilled/v" DIGITS "." DIGITS "." DIGITS "." DIGITS
RESERVED      := "main"

WRAPPER       := "work/" RUNTIME "/" YYYYMMDD-HHMMSS "-" PID
WRAPPER_DIR   := ".worktrees/" RUNTIME "-" YYYYMMDD-HHMMSS "-" PID
```

Every branch must additionally pass:

```bash
git check-ref-format --branch "$branch"
```

Examples:

```text
sk-git/wt/0040-skill-scoped-worktree-naming
sk-doc/wt/0041-refresh-readme-contract
system-spec-kit/wt/0042-memory-index-recovery
skilled/wt/0043-cross-skill-release-preparation
skilled/backup/0044-primary-v4-97c3a7b330
skilled/v4.0.0.0
```

This keeps the owning skill as GitKraken’s top-level branch group and retains `wt` as a second-level lane. The number remains global across every owner.

### What `<skill>` means

`<skill>` is the most specific canonical first-party `name:` from a version-controlled `.opencode/skills/**/SKILL.md`. Vendored/generated locations such as `node_modules`, `dist`, caches, archives, and third-party Playwright skills are excluded.

The current set is:

- Parents: `cli-external-orchestration`, `mcp-code-mode`, `mcp-tooling`, `sk-code`, `sk-design`, `sk-doc`, `sk-git`, `sk-prompt`, `system-code-graph`, `system-deep-loop`, `system-skill-advisor`, `system-spec-kit`.
- CLI/MCP leaves: `cli-claude-code`, `cli-codex`, `cli-opencode`, `mcp-chrome-devtools`, `mcp-click-up`, `mcp-figma`.
- Code leaves: `code-opencode`, `code-quality`, `code-review`, `code-webflow`.
- Design leaves: `design-audit`, `design-foundations`, `design-interface`, `design-mcp-open-design`, `design-md-generator`, `design-motion`.
- Documentation leaves: `create-agent`, `create-benchmark`, `create-changelog`, `create-command`, `create-diff`, `create-feature-catalog`, `create-flowchart`, `create-manual-testing-playbook`, `create-quality-control`, `create-readme`, `create-skill`.
- Prompt/deep leaves: `prompt-improve`, `prompt-models`, `deep-ai-council`, `deep-alignment`, `deep-improvement`, `deep-research`, `deep-review`.

Use the leaf owner when one leaf clearly owns the work. Use the parent when the work changes the parent contract or several children. Use `skilled` for inseparable cross-skill, repository-wide, release, publisher, or orchestration work.

### Counter semantics

The counter should become a real clone-wide high-water mark:

1. Allocate under an atomic lock in the common Git directory.
2. Seed the maximum from:
   - the stored high-water mark;
   - every registered worktree basename;
   - local and remote legacy `wt/{NNNN}-...` refs;
   - new `*/wt/{NNNN}-...` and `*/backup/{NNNN}-...` refs.
3. Write the new high-water mark before invoking `git worktree add`.
4. Permit gaps after failed creation; never reuse a consumed number.
5. Require the branch and directory to carry the same number.
6. Stop for a convention migration when `9999` is exhausted.

The snapshot makes `0040` the provisional next value. Execution must allocate again from live state.

### Wrapper decision

**The launch wrapper is exempt from the operator’s human-branch prefix rule.**

The exemption is narrow:

- only `.opencode/bin/worktree-session.sh` may create it;
- it must match the exact wrapper branch/directory pair;
- it is local-only and must not be pushed as a feature branch;
- it must carry an active-session marker;
- it is auto-reaped only after clean, merged, and inactive are all proven;
- a wrapper session needing a durable PR branch is promoted to a normal `<owner>/wt/{NNNN}-{slug}` worktree with `git worktree add -b`.

This preserves the explicit two-lane design in ALWAYS #4 and avoids a concurrent global-counter dependency during runtime launch.

### Architecture-worktree mapping

| Role | Required form |
|---|---|
| Wrapper-created authoring session | Exempt `work/{runtime}/{session}` lane |
| Non-wrapper/system authoring session | `skilled/wt/{NNNN}-session-{slug}` |
| Skill-specific authoring session | `<skill>/wt/{NNNN}-{slug}` |
| Projection worktree | Prefer detached HEAD at `.worktrees/{NNNN}-skilled-projection-{slug}`; if branch-bearing, use `skilled/wt/{NNNN}-projection-{slug}` |
| Validation/resolver worktree | Detached HEAD at `.worktrees/{NNNN}-skilled-{validator\|resolver}-{slug}` |
| External `/private/tmp/**` scratch | Allowed only when the owning runtime requires an external root; basename still follows `{NNNN}-{owner}-{slug}`, it remains registered, and ownership is recorded |
| Throwaway experiment | Detached HEAD, but still receives a numbered directory |
| Multi-skill/no single owner | `skilled/wt/{NNNN}-{slug}` |

Detached HEAD means the branch grammar is inapplicable, not that directory identity is optional.

### Edge cases

- **Backup branches:** use `<owner>/backup/{NNNN}-{slug}`. Because NEVER #2 prohibits direct branch creation, create the backup through a temporary worktree, verify the ref, then remove the worktree while retaining the branch.
- **`main`:** reserved and never renamed or deleted. It is not a valid new task branch.
- **Release/live branches:** repository releases use `skilled/vA.B.C.D`; they are long-lived and not counter-based.
- **Dirty primary checkout:** never rename, switch, stash, rebase, reset, or clean it during this migration.
- **External scratch worktrees:** path location never proves staleness. Treat `/private/tmp/**` and `.claude/worktrees/**` as active/uncertain until their owner confirms otherwise.
- **Remote branches:** outside the local-tree cleanup by default. An upstream configuration is not proof that the remote ref still exists or contains the local tip.

### Migration rule

- Enforce the new grammar for all newly allocated human/managed worktrees.
- Leave wrapper branches in their machine namespace.
- Delete merged legacy branches rather than renaming dead history.
- Preserve an existing valid four-digit `wt` number when an unmerged branch is retained and renamed.
- Allocate a fresh number for retained branches lacking a valid old worktree number.
- Rename only after the branch/worktree is clean and explicitly inactive.
- Preserve backup branches until their commits are audited.
- Never rename merely for aesthetics while a branch is active.
- Never delete an unmerged branch without an explicit per-branch operator decision and verified recovery artifact.

## C. PLAN

## 1. Deliverable: sk-git codification

### Phase 1 — Freeze the contract

**Blast radius:** medium; documentation and routing behavior.

Update [SKILL.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-git/SKILL.md):

- Replace ALWAYS #4 with the owner-first grammar, numbered detached directories, exact wrapper exception, and reserved branch classes.
- Tighten ALWAYS #6: cleanup requires successful integration into the intended base, clean worktree state, and confirmed inactivity.
- Keep ALWAYS #13 direct-push authority. Add that it does not authorize a new nonconformant branch; direct pushes to `skilled/v*` remain valid.
- Keep ALWAYS #15 unchanged as the primary-tree safety boundary.
- Clarify ALWAYS #16 that wrapper refs are local-only machine identities.
- Add ALWAYS #17: allocate non-wrapper worktrees through the locked canonical allocator.
- Add ALWAYS #18: merged legacy refs are deleted; retained legacy refs are renamed without rewriting history; unmerged deletion requires confirmation.
- Clarify NEVER #2: `git branch -m` is permitted only for an approved migration; new refs still require `git worktree add -b`.
- Rewrite NEVER #4 so cleanup is not unconditional.
- Add NEVER #9: never remove, rename, move, or auto-reap an active or ownership-uncertain worktree; never use `git worktree remove --force`.
- Update success criteria from `wt/{NNNN}-{name}` to the new branch/path pair.

Update the normative examples in:

- `.opencode/skills/sk-git/README.md`
- `references/worktree_workflows.md`
- `references/shared_patterns.md`
- `references/quick_reference.md`
- `references/continuous_integration.md`
- `references/large_reorg_playbook.md`
- `references/finish_workflows.md`
- `assets/worktree_checklist.md`

While touching cleanup examples, normalize the order to:

```bash
git worktree remove "$path"
git branch -d -- "$branch"
```

Do not retain examples that stash a dirty/concurrent worktree during cleanup.

Update advisor surfaces:

- `SKILL.md` description, `<!-- Keywords -->`, `<!-- Owns: -->`, owned keywords, router signals, and on-demand keywords.
- Add phrases such as `skill-scoped branch`, `skill-owned worktree`, `skilled branch`, `branch migration`, `stale worktree cleanup`, and `wrapper worktree`.
- Keep `wt branch` as a legacy/migration trigger.
- Refresh `graph-metadata.json` derived trigger phrases, key topics, and causal summary; then re-index through the existing trusted skill-advisor scan path.
- Update relevant reference frontmatter trigger phrases.

Update tests/docs:

- Correct `manual_testing_playbook/worktree_setup/fresh_feature_isolated_worktree.md`.
- Correct naming literals in `accidental_commit_wrong_branch.md`, `branch_cleanup_after_merge.md`, `finish_merge_to_main.md`, `finish_create_pr_with_template.md`, `failing_tests_block_merge.md`, and `merge_conflict_resolution.md`.
- Refresh the root `manual_testing_playbook.md`.
- Add a new `v1.2.0.0` sk-git changelog; do not rewrite historical `v1.1.2.0.md`.
- Keep code comments durable—no packet or requirement identifiers.

### Phase 2 — Central generator and validator

**Blast radius:** medium; new worktree creation path. Reversible by falling back to documented `git worktree add -b`.

No human naming script currently exists. Add:

```text
.opencode/skills/sk-git/scripts/worktree-naming.sh
```

Required functions:

- `load_skill_ids` — derive allowed first-party skill IDs.
- `validate_owner`
- `validate_slug`
- `validate_branch_name`
- `validate_worktree_pair`
- `allocate_number` — common-dir lock plus high-water logic.
- `create_named_worktree` — allocate and call `git worktree add -b`.
- `create_detached_worktree` — allocate a numbered directory without a branch.

Allocation and creation must remain inside the same lock. A `next`/preview mode may display a candidate number, but must label it nonbinding.

Add a shell harness covering:

- every valid branch class;
- invalid `fix/`, `wip/`, bare `wt/`, uppercase, `0000`, unknown skill IDs, number/path mismatch;
- duplicate number across different owners;
- simultaneous allocator calls;
- detached worktree numbering;
- wrapper local-only exception.

### Phase 3 — Harden wrapper/reaper boundaries

**Blast radius:** high because these scripts govern concurrent sessions. Rollback is a single commit revert; wrapper names remain unchanged.

In `.opencode/bin/worktree-session.sh`:

- Keep `BRANCH="work/${RUNTIME}/${SLUG}"` and its directory unchanged.
- Add `validate_runtime()` so runtime input cannot inject slashes, `..`, or invalid ref/path characters.
- Add `write_session_marker()` before the final `exec`. Record branch, directory, PID, process-start identity, live branch, and start time under the common Git directory. Because `exec` preserves the PID, the marker can follow the runtime process.
- Treat marker-write failure conservatively: launch may continue, but automatic reaping must be disabled for that session.

In `.opencode/bin/worktree-reaper.sh`:

- Add `is_wrapper_pair()` so only exact wrapper branch/path pairs are auto-reaped.
- Add `session_is_active()`; live, malformed, missing, or ambiguous legacy markers mean **keep**.
- Add `resolve_merge_target()` using the session’s recorded live branch, not hardcoded `main`.
- Make human/managed worktrees report-only; their cleanup stays explicit.
- Preserve `--dry-run` and non-force deletion.
- Legacy unmarked wrapper worktrees must be reported for manual adjudication, not automatically removed.

Update `.opencode/bin/README.md` accordingly.

### Phase 4 — Enforcement rollout

Add a versioned `.opencode/scripts/git-hooks/pre-push` that calls the validator:

- Validate only the creation of a new remote branch (`remote_sha` is all zeros).
- Accept task, backup, release, and reserved forms.
- Reject wrapper refs on push; wrapper branches are local-only.
- Permit updates to already-existing legacy remote branches during migration, with a warning.
- Do not interfere with ALWAYS #13 pushes to `skilled/v*`.

Update:

- `.opencode/scripts/install-git-hooks.sh`
- `.opencode/scripts/git-hooks/README.md`
- hook installation tests

Run the validator fixture matrix in CI. Do not make PR head-name enforcement blocking until existing same-repository legacy PR branches are inventoried; otherwise rollout would strand them.

### Verification

The implementation phase should run at least:

```bash
bash -n .opencode/skills/sk-git/scripts/worktree-naming.sh
bash -n .opencode/bin/worktree-session.sh
bash -n .opencode/bin/worktree-reaper.sh
bash -n .opencode/scripts/git-hooks/pre-push

bash .opencode/skills/sk-git/scripts/tests/worktree-naming-harness.sh
AI_SESSION_CHILD=1 bash .opencode/bin/worktree-session.sh --dry-run codex
bash .opencode/bin/worktree-reaper.sh --dry-run

python3 .opencode/skills/sk-doc/scripts/validate_document.py \
  .opencode/skills/sk-git/README.md --type readme
python3 .opencode/skills/sk-doc/scripts/validate_document.py \
  .opencode/skills/sk-git/manual_testing_playbook/manual_testing_playbook.md

jq empty .opencode/skills/sk-git/graph-metadata.json
```

Then:

- `rg` for stale normative `wt/{NNNN}` examples, excluding historical changelogs and benchmark artifacts;
- trusted advisor rebuild/graph scan and routing probes;
- strict packet validation;
- creation/cleanup tests in a disposable Git fixture;
- no test against the shared dirty primary checkout.

## 2. Deliverable: local-tree cleanup

### Phase 0 — Live preflight and ownership freeze

**Blast radius:** read-only.

Run from the new clean control worktree, never the primary checkout:

```bash
BASE=origin/skilled/v4.0.0.0

git fetch --prune origin
git rev-parse --verify "$BASE^{commit}"
git status --porcelain=v1 --untracked-files=all
git worktree list --porcelain
git for-each-ref \
  --format='%(refname:short)|%(objectname)|%(upstream:short)|%(worktreepath)' \
  refs/heads/
```

Requirements:

- control worktree status is empty;
- `origin/skilled/v4.0.0.0` resolves;
- capture every branch tip OID before mutation;
- require session-owner confirmation for every registered worktree;
- re-read each target ref immediately before its action;
- any changed tip, new worktree, dirty status, lock, or uncertain owner stops that item.

### Phase 1 — Delete six merged branch-only refs

**Blast radius:** low; local refs only. Rollback is possible from recorded OIDs via `git worktree add -b`.

Candidates:

```bash
candidates=(
  system-speckit/023-esm-module-compliance
  system-speckit/024-compact-code-graph
  system-speckit/026-graph-and-context-optimization
  wt/0030-underscore-migration
  wt/0031-sk-doc-foundation
  wt/0032-skills-group2
)
```

For each:

```bash
b="..."
oid_before=$(git rev-parse "refs/heads/$b")

git merge-base --is-ancestor "$oid_before" "$BASE"
! git worktree list --porcelain | grep -Fqx "branch refs/heads/$b"
test "$oid_before" = "$(git rev-parse "refs/heads/$b")"

git branch -d -- "$b"
```

Any failed check halts that branch. Do not substitute `-D`.

### Phase 2 — Remove merged, clean, inactive registered worktrees

**Blast radius:** medium; filesystem directories and shared local refs.

For every one of the 23 human/legacy and seven wrapper stale candidates listed in CHECK:

```bash
path="..."
branch=$(git -C "$path" symbolic-ref --quiet --short HEAD)

test -z "$(git -C "$path" status --porcelain=v1 --untracked-files=all)"
git merge-base --is-ancestor "$branch" "$BASE"
```

Then require explicit owner confirmation that no runtime, editor, daemon, or user still owns the path. Absence of a visible process is supporting evidence, not proof.

After confirmation:

```bash
git worktree remove "$path"       # never --force
git branch -d -- "$branch"
```

For wrapper entries, use the hardened reaper in `--dry-run` first. Do not use the current reaper against this snapshot because it checks `main` and has no activity marker.

### Phase 3 — Adjudicate detached worktrees

**Blast radius:** medium/high; detached commits can lose their last reachability anchor.

For each of the six detached paths:

```bash
path="..."
oid=$(git -C "$path" rev-parse HEAD)

git -C "$path" status --porcelain=v1 --untracked-files=all
git merge-base --is-ancestor "$oid" "$BASE"
```

Outcomes:

- **Clean + ancestor of base + confirmed inactive:** `git worktree remove "$path"`.
- **Commit not contained in base:** preserve it first in a conforming branch:

  ```bash
  git worktree add -b "$new_branch" "$new_path" "$oid"
  test "$(git -C "$new_path" rev-parse HEAD)" = "$oid"
  git worktree remove "$path"
  ```

- **Dirty:** stop. The owning session must commit or explicitly discard its changes. No stash/reset/clean.
- **Active or unknown owner:** leave untouched.

### Phase 4 — Unmerged branch decision gate

**Blast radius:** high. No default action.

For each of the 11 branches, produce:

```bash
git log --oneline --decorate "$BASE..$branch"
git for-each-ref --contains "$(git rev-parse "$branch")" \
  --format='%(refname)'
git ls-remote --heads origin "$branch"
```

Present one operator row per branch with four choices:

1. `KEEP`
2. `RENAME`
3. `ARCHIVE`
4. `DISCARD`

No grouped confirmation.

#### Rename

For a branch checked out in an inactive clean linked worktree:

```bash
git worktree move "$old_path" "$new_path"
git -C "$new_path" branch -m "$new_branch"
test "$(git -C "$new_path" rev-parse HEAD)" = "$old_oid"
```

For an unassociated local branch:

```bash
git branch -m "$old_branch" "$new_branch"
test "$(git rev-parse "$new_branch")" = "$old_oid"
```

Do not rename the dirty primary branch in place. Preserve its committed tip through a new conforming worktree only after its owner has made the primary clean:

```bash
git worktree add -b "$new_branch" "$new_path" "$old_branch"
```

Remote rename is a separate confirmation gate:

```bash
git push -u origin "$new_branch"
git ls-remote --exit-code --heads origin "$new_branch"
git push origin --delete "$old_branch"
```

No remote deletion should occur merely because the local tree is being cleaned.

#### Discard

Before any unmerged deletion, create and verify an operator-approved recovery bundle:

```bash
git bundle create "$archive/$safe_name.bundle" "$branch"
git bundle verify "$archive/$safe_name.bundle"
```

Then require an explicit confirmation naming the branch and the displayed commit list.

Only after that:

```bash
git worktree remove "$path"    # if clean, inactive, and registered
git branch -D -- "$branch"
```

`-D` is prohibited everywhere else.

### Phase 5 — Administrative cleanup and final audit

**Blast radius:** low after earlier gates.

```bash
git worktree prune --dry-run --verbose
```

Review the output, then:

```bash
git worktree prune --verbose
git worktree list --porcelain
git for-each-ref --format='%(refname:short)' refs/heads/
```

Acceptance:

- no missing/prunable worktree records;
- no deleted branch remains checked out;
- no active worktree was removed;
- every retained new human branch matches the refined grammar;
- only approved legacy branches remain;
- `main`, `skilled/v4.0.0.0`, backups awaiting adjudication, and active wrapper sessions remain intact;
- no remote branch changed without its own approval.

## Packet recommendation

Create a new **standard, non-phased Level 3** packet:

```text
Track:  .opencode/specs/sk-git
Folder: 009-skill-scoped-worktree-naming
Level:  3
```

This is not a child of packet 137: that packet explicitly deferred sk-git codification and local cleanup, while this change owns a cross-cutting Git policy, executable allocator, wrapper/reaper safety, hook enforcement, migration decision, and destructive cleanup evidence. Level 3 is warranted by the architecture decision and shared-repository blast radius even if the final implementation stays near the nominal LOC boundary.

The packet’s decision record should formally resolve the contradictory `wt/` plus `<skill>/` wording and document the wrapper exemption. Packet 137 can remain frozen and be referenced as provenance.

Provisional branch and directory for this work:

```text
Branch:    sk-git/wt/0040-skill-scoped-worktree-naming
Directory: .worktrees/0040-sk-git-skill-scoped-worktree-naming
Base:      origin/skilled/v4.0.0.0
```

`0040` must be replaced if the live allocator finds a newer high-water mark.