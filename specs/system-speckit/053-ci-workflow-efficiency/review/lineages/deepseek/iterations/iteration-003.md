# Deep Review Iteration 3 — Security

**Iteration**: 3 of 5
**Dimension**: security
**Target**: `specs/system-speckit/053-ci-workflow-efficiency` and the 32-workflow tree it ships with
**Focus**: trust boundaries the packet moved — the write scopes it granted or removed, the third-party code it runs, the tokens it hands to them, the skip and switch mechanisms it introduced, and whether the packet's own standard states the rules its implementation relies on.

---

## 1. FILES REVIEWED

- All 32 `.github/workflows/*.yml` — parsed with PyYAML: `on:` triggers, workflow-level and job-level `permissions:`, every `uses:` reference and its pin, every step that reads a secret.
- `.github/actions/setup/action.yml:1-120` — the composite action's cache key, cached paths, and the pinned restore/save actions.
- `.github/workflows/trigger-index-rebuild.yml:1-20,40-60,186-290` — `permissions: {}`, the two job-level scope sets, `persist-credentials: false`, the push token.
- `.github/workflows/dependabot-auto-merge.yml:1-60` — the read/write job split.
- `.skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md`, `job-shape-rules.md`, `trigger-and-filter-rules.md` — the standard's stated rules.
- `specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/spec.md:186,239` — the skip token's stated risk.
- `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/spec.md:195,355` — the switch's stated risk and open question.

---

## 2. VERIFIED SECURITY PROPERTIES

These were checked mechanically, not read off the packet's own claims. Each is a property the packet's phases assert; all hold.

| Property | Check | Result |
|---|---|---|
| Every remote action is pinned to a full commit SHA | PyYAML walk of every `uses:` in every job step; `re.fullmatch('[0-9a-f]{40}')` on the ref | 94 `uses:` total, 89 remote, **0 unpinned**. Matches `ci-workflow-standards.md:37` ("32 of 32 workflows, 89 remote `uses:` lines") exactly |
| No privileged PR trigger | Trigger inventory across 32 workflows | `push` 27, `pull_request` 30, `workflow_dispatch` 11, `schedule` 3. **No `pull_request_target`, no `workflow_run`, no `issue_comment`, no `repository_dispatch`** |
| Least-privilege workflow scope | `permissions:` map per file | 30 × `{contents: read}`, 1 × `{actions: read, contents: read}`, 1 × `{}` (`trigger-index-rebuild.yml:12`, with scopes on the two jobs) |
| Write scopes confined to jobs that cannot run repository code | Read of the two write jobs | `dependabot-auto-merge.yml:41-42` holds the only `contents: write`/`pull-requests: write` pair, on a job whose single step is `gh pr merge`; `trigger-index-rebuild.yml:196` holds the other `contents: write`, on a push-only job |
| No untrusted value reaches a shell | `rg 'run:.*\$\{\{ *(github\.event|inputs)\.'` over all workflows | **0 matches** |
| Secrets are not interpolated into `run:` | `rg 'secrets\.'` over all workflows | 3 references, all in `env:` blocks: `dependabot-auto-merge.yml:31,54` and `trigger-index-rebuild.yml:278` |
| No workflow attempts a write it lacks scope for | `rg` for `gh pr comment`, `gh issue comment`, `gh api -X`, `git push`, `gh release`, `npm publish`, `gh pr review` | One hit, `trigger-index-rebuild.yml:284` — a comment, in the one workflow that holds `contents: write` |
| The write-scoped push job does not persist its credential | Read of both checkout steps | `persist-credentials: false` at `trigger-index-rebuild.yml:50` and `:203` |
| The cached setup action cannot poison a base-branch cache from a PR | Read of the cache key and paths | Key is `provision-${os}-node${major}-bun${version}-${hashFiles(...)}` and includes `.github/actions/setup/action.yml` itself, so a change to the action invalidates it; the cached `dist` trees are covered by the provisioning walk's stamp check, and the action's own description states the walk is not a check of every build input |

---

## 3. FINDINGS BY SEVERITY

### P0 Findings

None. No live vulnerability was found: every property in section 2 holds, and the two write-scoped workflows are the only two that can mutate the repository.

### P1 Findings

None.

### P2 Findings

#### R3-P2-001 — The CI standard states no rule for `persist-credentials`, and the one place it matters is convention rather than policy

42 checkout steps exist across the 32 workflows. Only two set `persist-credentials: false`, both in `trigger-index-rebuild.yml` (`:50`, `:203`), and that file is also the only one holding `contents: write`. The `sk-code-ci` standard has no rule for the flag: `rg -c 'persist-credentials' .skilled/skills/sk-code/sk-code-ci/references/*.md` returns nothing, while the neighbouring rules — SHA pinning, README rows, timeouts, permissions, concurrency — each carry a row in `ci-workflow-standards.md` or `job-shape-rules.md`.

The concrete failure mode is a future phase copying the push-job pattern: `actions/checkout` defaults to persisting the job token into `.git/config`, so a write-scoped job that runs repository code with the default would leave a writable credential on disk for the duration of the job. The packet's own R25 pass narrowed write scopes without adding the matching rule, so the safety of the one job that needs it rests on a reviewer remembering the flag.

[SOURCE: .github/workflows/trigger-index-rebuild.yml:203]
[SOURCE: .skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md:37]

#### R3-P2-002 — The packet documents one of its two skip semantics, and they fail in opposite directions

The packet introduces two ways a check can stop running, and each has the opposite effect on a required context:

- **A switched-off job** (`vars.SKILLED_CI*`). `007-.../spec.md:195` records it correctly: "A skipped job reports Success, so a switched-off required check stops blocking", with `SKILLED_CI_MESSAGES` documented as prohibited while its context is required, and `:355` repeats the open question.
- **A skipped workflow** (`[skip ci]`). R1 puts the token in the rebuild commit, and `002-.../spec.md:239` records only that "`main`'s HEAD carries no statuses after the change, so a status reader sees an empty list". GitHub's documented behaviour for a workflow skipped by a commit message is the opposite of the job case: the required checks stay **Pending** and block the merge rather than reporting success.

Neither document states the second half, and no single place in the packet compares them. The practical impact is small because the `[skip ci]` case fails closed, and the token only ever lands on a bot commit that no pull request carries as its head. What is missing is the note a maintainer needs when a pull request is stuck on a check that never appeared.

[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/spec.md:239]
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/spec.md:195]

---

## 4. TRACEABILITY CHECKS

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | Every security property the packet's phases assert holds in the tree (section 2). The two gaps are rules the packet relies on but does not state, not claims it makes and breaks. |
| `checklist_evidence` | core | partial | 002's CHK-030/031/032 and 007's R25 rows name the scopes they verified; no row covers `persist-credentials`, and no row compares the two skip semantics. |
| `skill_agent` | overlay | partial | The `sk-code-ci` standard carries SHA-pinning, timeout, permission and concurrency rules but no credential-persistence rule, so the standard is one row short of the implementation it governs. |
| `agent_cross_runtime` | overlay | notApplicable | No agent definition is in scope. |
| `feature_catalog_code` | overlay | notApplicable | No feature catalog entry is claimed. |
| `playbook_capability` | overlay | notApplicable | No playbook is claimed. |

---

## 5. RULED OUT

- **A write token is reachable from untrusted pull-request code.** Ruled out: the only `pull_request`-triggered write job runs `gh pr merge` and nothing else, its `if:` requires the Dependabot actor and three metadata outputs, and no `pull_request_target` or `workflow_run` trigger exists in the tree.
- **The composite action hands a token to an unpinned third party.** Ruled out: its three `uses:` are `actions/cache/restore@0057…`, `oven-sh/setup-bun@0c50…` and `actions/cache/save@0057…`, all 40-hex.
- **The cache key lets a stale `dist` tree outlive a source change.** Ruled out as a finding: the key includes the action file and every lockfile and tsconfig, the provisioning walk stamps five build outputs against their tracked sources, and the action's description states plainly that the walk is not a check of every build input. The limitation is disclosed where it is incurred.
- **A secret is printed or interpolated into a shell.** Ruled out: three secret references, all `env:`-scoped, and no `run:` interpolation of `github.event` or `inputs`.
- **`[skip ci]` is a merge bypass.** Ruled out: the documented behaviour leaves required checks Pending, which blocks the merge, so the mechanism fails closed (this is why R3-P2-002 is P2 and not P1).

---

## 6. VERDICT

No P0 and no P1. The security posture the packet claims is real and was checked mechanically: 89 of 89 remote actions pinned, no privileged PR trigger, write scopes confined to two jobs that cannot run repository code, no untrusted interpolation, and least-privilege scopes on all 32 workflows. Two P2 gaps remain: the standard states no `persist-credentials` rule for the 42 checkout steps, and the packet documents only one of its two skip semantics.

Review verdict: PASS
