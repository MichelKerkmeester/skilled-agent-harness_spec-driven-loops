# Iteration 009 — Security and pinning hygiene

## Focus

Security and pinning hygiene across all 33 workflows: SHA pinning of third-party actions, least-privilege `permissions:` at workflow and job level, secret exposure on `pull_request` from forks, any use of `pull_request_target`, the safety of `dependabot-auto-merge.yml`, and shell-injection risk from `github.event.*` fields interpolated into `run:` blocks. Read-only pass; no workflow was modified.

Also closes the carried-forward question on `.skilled/hooks/vitest.config.ts` include globs.

## Actions Taken

1. Enumerated every `uses:` reference in `.github/workflows/` and resolved each ref by frequency (5 actions, 91 references), then tested for any non-SHA ref.
2. Enumerated `permissions:` blocks, `secrets.*` / `github.token` / `GITHUB_TOKEN` references, `pull_request_target`, and `workflow_run`.
3. Dumped every `github.event.*` reference and separated values reaching `run:` source directly from values passed through `env:`.
4. Read `dependabot-auto-merge.yml` end to end (40 lines) and the PR-body handling in `message-contract.yml`.
5. Cross-checked the 12 workflows that declare no `permissions:` for any write operation (`git push`, `git commit`, `gh`, `GH_TOKEN`).
6. Read `.skilled/hooks/vitest.config.ts` include and node_modules filter.
7. Counted `timeout-minutes` coverage across workflows.

## Findings

### F1 — Action pinning is already complete (P3, confirmed)

All 91 `uses:` references across 33 workflows resolve to exactly five actions:

| Action | Count |
|---|---|
| `actions/checkout` | 43 |
| `actions/setup-node` | 35 |
| `actions/setup-python` | 8 |
| `actions/upload-artifact` | 4 |
| `dependabot/fetch-metadata` | 1 |

Every reference is a full 40-hex commit SHA with a trailing version comment, for example `[SOURCE: .github/workflows/dependabot-auto-merge.yml:22]` and `[SOURCE: .github/workflows/strict-pass-freshness-report.yml:26]`. There are no tag refs, no branch refs, no `docker://` refs and no unpinned local action paths. Pinning is therefore not a remediation project; it is an invariant to lock with a guard so it cannot regress.

### F2 — 12 of 33 workflows declare no `permissions:` block (P2, confirmed)

Missing at top level in: `advisory-checks`, `agent-mirror-sync`, `chart-corpus`, `comment-hygiene`, `diagram-corpus`, `markdown-link-integrity`, `playbook-operator-contract`, `prompt-card-sync`, `repo-rules-corpus`, `rule-canary-sync`, `runtime-no-spec-import`, `skill-doc-frontmatter`. These inherit the repository default token scope.

The mitigating fact is confirmed: none of the twelve performs a write. A scan for `git push`, `git commit`, `gh`, `GH_TOKEN` and `contents:` found no write path in any of them. So this is a defense-in-depth and auditability gap, not an active write exposure. The cost of closing it is 12 identical two-line insertions (`permissions:` / `  contents: read`).

Contrast the good pattern already present: `trigger-index-rebuild.yml` sets workflow-level `permissions: {}` `[SOURCE: .github/workflows/trigger-index-rebuild.yml:12]` and grants `contents: read` only on the rebuild job `[SOURCE: .github/workflows/trigger-index-rebuild.yml:38]` with write scope confined to the separate push job `[SOURCE: .github/workflows/trigger-index-rebuild.yml:188]`. The README documents that split `[SOURCE: .github/workflows/README.md:58]`. Twenty of the other 21 declared blocks are `contents: read` only.

### F3 — Dependabot auto-merge grants write scope to a third-party step (P2, confirmed)

`dependabot-auto-merge.yml` declares workflow-level:

```
permissions:
  contents: write
  pull-requests: write
```
`[SOURCE: .github/workflows/dependabot-auto-merge.yml:10]`

Permissions in GitHub Actions are job-scoped, so both scopes are live for every step in the single `auto-merge` job, including the third-party `dependabot/fetch-metadata` step, which is handed the token explicitly at `[SOURCE: .github/workflows/dependabot-auto-merge.yml:24]`. Only the final `gh pr merge --auto --merge "$PR_URL"` step `[SOURCE: .github/workflows/dependabot-auto-merge.yml:40]` requires `contents: write`; `pull-requests: write` is what enables auto-merge. Least privilege therefore wants a read-only metadata job feeding a write-scoped merge job, or an explicit comment accepting the deviation. This is the only workflow whose token scope exceeds what one of its steps needs.

### F4 — The auto-merge gate itself is sound (P2, confirmed)

Four controls stack:

- trigger is `pull_request` with types `opened, reopened, synchronize` — never `pull_request_target` `[SOURCE: .github/workflows/dependabot-auto-merge.yml:7]`;
- author test `github.event.pull_request.user.login == 'dependabot[bot]'` reads server-set event data and is not spoofable by a fork `[SOURCE: .github/workflows/dependabot-auto-merge.yml:18]`;
- the merge is narrowed to `npm_and_yarn` and (`npm-security` or ungrouped) and `semver-patch` `[SOURCE: .github/workflows/dependabot-auto-merge.yml:31]`;
- `gh pr merge --auto` only enables auto-merge; the actual merge waits on required checks `[SOURCE: .github/workflows/dependabot-auto-merge.yml:40]`.

Residual risk is configuration-side: nothing in the repository pins that required status checks exist and cover the paths a bump touches. That is an audit item for `/doctor:ci`, not a YAML defect.

### F5 — Fork and secret attack classes are structurally absent (P3, confirmed)

`pull_request_target`: zero matches. `workflow_run`: zero matches. `secrets.*` appears in only two files:

- `TRIGGER_INDEX_PUSH_TOKEN`, guarded by a `|| github.token` fallback `[SOURCE: .github/workflows/trigger-index-rebuild.yml:274]`;
- `secrets.GITHUB_TOKEN` on the two Dependabot steps `[SOURCE: .github/workflows/dependabot-auto-merge.yml:24]` and `[SOURCE: .github/workflows/dependabot-auto-merge.yml:36]`.

No `pull_request`-triggered workflow reads a repository secret, and no workflow checks out `github.event.pull_request.head.sha`. A fork PR therefore runs with a read-only token and no secrets. Minor style note: `secrets.GITHUB_TOKEN` and `github.token` are the same token, and the latter is the preferred spelling; `trigger-index-rebuild.yml` already uses it for read paths.

### F6 — No exploitable shell-injection path found (P3, confirmed)

`github.event.*` reaches `run:` blocks in five workflows, but the only free-text field is handled correctly. The PR body is passed through `env:` at `[SOURCE: .github/workflows/message-contract.yml:74]` and written with `printf '%s'` at `[SOURCE: .github/workflows/message-contract.yml:90]`, with an inline comment explaining that the body never enters shell source. Direct `${{ }}` interpolation into `run:` source is limited to SHA fields: `[SOURCE: .github/workflows/comment-hygiene.yml:25]`, `[SOURCE: .github/workflows/agent-mirror-sync.yml:35]`, `[SOURCE: .github/workflows/changed-packet-validation.yml:46]`. `github.sha`, `github.ref_name`, `github.repository` and the head ref are all passed through `env:` `[SOURCE: .github/workflows/message-contract.yml:48]`, and the head-ref use is quoted as `--exclude-ref`, not evaluated.

Hex SHAs are not shell-injectable, so the direct interpolations are safe today. The finding is inconsistency, not vulnerability: the house rule should be "never interpolate expressions in `run:`; always route through `env:`", which is what `sk-code-ci` would encode.

### F7 — Only 6 of 33 workflows set `timeout-minutes` (P2, confirmed)

27 workflows can hold a runner for the 360-minute default if a test or network call hangs. This is the largest hygiene gap after permissions, and the cheapest to close: a per-job `timeout-minutes` line. It belongs in the same standards pass and in the `sk-code-ci` review checklist.

### F8 — Carried-forward answered: hooks test scope (P3, confirmed)

`.skilled/hooks/vitest.config.ts:38` sets `include` to `<hooks root>/**/*.{test,spec}.?(c|m)[jt]s?(x)` `[SOURCE: .skilled/hooks/vitest.config.ts:38]`, and line 19 filters out any path containing a `node_modules` segment `[SOURCE: .skilled/hooks/vitest.config.ts:19]`. So F3's `fileParallelism` question applies only to tests physically under `.skilled/hooks/`, not to the system-spec-kit runtime suite, and a hooks-side parallelism change cannot be credited with spec-kit test speedups.

### F9 — Synthesis for the ranked recommendations (P2, inferred from F1–F7)

The security angle contributes no remediation programme. It contributes three mechanical items and one guard:

| Item | Effort | Risk |
|---|---|---|
| 12 × `permissions: contents: read` | 12 two-line edits | none |
| Split `dependabot-auto-merge.yml` into read metadata + write merge jobs | one workflow rewrite | low, touches a merge path so needs a dry run |
| `timeout-minutes` on 27 workflows | one line per job | none if set above observed p95 |
| Guard test for four invariants (full-SHA pins, explicit read-only permissions, no `pull_request_target`/`workflow_run`, no secrets on `pull_request`) | one test file | none |

That guard belongs in the proposed `sk-code-ci` checklist and in `/doctor:ci`'s audit report, not in a new workflow.

## Questions Answered

- What security and pinning hygiene gaps exist in the workflows? — Answered: pinning is complete (F1); the gaps are 12 missing `permissions:` blocks (F2), a workflow-level write token spanning a third-party step (F3), and 27 workflows without `timeout-minutes` (F7); fork and injection classes are absent (F5, F6).
- Carried forward: what are the include globs of `.skilled/hooks/vitest.config.ts`? — Answered (F8).

## Questions Remaining

- What on/off control design lets a clone or base repo disable workflows or groups without editing YAML?
- What should a `/doctor:ci` command do, how is it made safe, and who owns it?
- What should an `sk-code-ci` mode contain, and what does registering a new `sk-code` mode require?
- How do the ranked recommendations group into ordered implementation phases 002 and later?
- Carried forward from iteration 5: are spec-kit tests fixture-collision-safe under `fileParallelism: true`, and does `.skilled/skills/system-spec-kit/runtime/vitest.config.ts` also set it?
- Carried forward from iteration 5/7: which jobs are overengineered, such as duplicates of pre-commit hooks or advisory jobs that never gate?

## Next Focus

On/off control design (key question 2): inventory the existing configuration surfaces a clone already has — `vars.*` usage, `workflow_dispatch` inputs, `.skilled/hook-flags.env`, `.env.example` — and measure how many jobs currently gate on repository variables. Then compare the three candidate designs (job-level `if:` on `vars.*`, a committed `.skilled/ci.json` read by a gate job, `workflow_dispatch` inputs) on skipped-job branch-protection behavior and fork/clone defaults, and recommend one defaulting to everything on.

## SCOPE VIOLATIONS

None. All reads; writes confined to this narrative and `deltas/iter-009.jsonl`, plus the required gateway call.
