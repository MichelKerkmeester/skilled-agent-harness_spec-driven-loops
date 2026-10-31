# Iteration 10: Q4 - hardening the CI trigger-index rebuild job and its token push

## Focus

Audit `.github/workflows/trigger-index-rebuild.yml` and commit 01b0773d067 (fine-grained token push) for correctness and security gaps.

## Actions Taken

1. Re-read `steer.md`.
2. Read `trigger-index-rebuild.yml` in full (58 lines).
3. Read `git show 01b0773d067` in full - the loop-guard and token changes.
4. Read `generate-trigger-index.mjs` artifact resolution (resolveArtifactPaths) and verified which sidecar files are git-tracked via `git ls-files`.

## Findings

1. GAP - sidecar drift committed incompletely: a routine `generate-trigger-index.mjs` run writes FOUR tracked files - `runtime/data/trigger-index.json` plus three fixture sidecars (`corpus-manifest.json`, `generation-diagnostics.json`, `phrase-variants.json`, all confirmed git-tracked) - but the job runs `git add` on the index alone and `git diff --quiet -- "$INDEX"` only gates the index. A push that changes only sidecars reports "Trigger index is current; nothing to commit" while the committed fixture set drifts from the index it describes. CONFIRMED [SOURCE: .github/workflows/trigger-index-rebuild.yml:44-52; .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:77-80,371-381; git ls-files fixtures/]
2. Loop guard is now subject-prefix matching: `!startsWith(github.event.head_commit.message, 'chore(system-spec-kit): rebuild the trigger index')` because the token push runs under the token owner's name, defeating the old `github.actor != 'github-actions[bot]'` check. Brittle edges: (a) a rename of the commit subject reopens the self-trigger loop; (b) manual `workflow_dispatch` on a rebuild-commit tip is silently skipped; (c) any human commit reusing the subject gets skipped for one cycle. CONFIRMED [SOURCE: trigger-index-rebuild.yml:21-24; git show 01b0773d067]
3. `set -uo pipefail` without `-e`: if `git commit` fails (hook refusal, identity, empty-tree edge), the script proceeds to `git push`, which succeeds trivially with nothing new - job reports green while index drift remains uncommitted. CONFIRMED [SOURCE: trigger-index-rebuild.yml:43-58]
4. Stale-event race: concurrency serializes rebuilds per ref but does not coalesce them; `actions/checkout` defaults to the event SHA, so a queued rebuild regenerates the index from a pre-rebuild tree and its push goes non-fast-forward - failing loudly with an error that wrongly blames the ruleset/token. CONFIRMED [SOURCE: trigger-index-rebuild.yml:14-16,29-32,55-57; actions/checkout default ref semantics]
5. The token design is a standing PAT owned by a ruleset-bypass admin on a personal-account repo (the commit explains the Actions app was refused as bypass actor). Checkout persists it in `.git/config` for the whole job while repo code (`generate-trigger-index.mjs`) executes. Mitigations present: push-only trigger (no fork PR code runs), pinned action SHAs, single-file scope. Residual: token scope is whatever the admin set - a GitHub App installation token would expire hourly and can't leak a standing credential. CONFIRMED design facts; INFERRED risk rating [SOURCE: trigger-index-rebuild.yml:6-9,29-32; git show 01b0773d067 message]
6. The commit body added "the message check requires" it - the workflow is coupled to the ruleset's required-commit-message policy; a ruleset wording change breaks or silently alters the job. CONFIRMED [SOURCE: git show 01b0773d067; trigger-index-rebuild.yml:53-54]

## Ruled Out

- Removing the job in favor of PR-time regeneration: the advisory check only reports drift and the corpus commits land without regenerating, so the repair job is the mechanism keeping main consistent; the fix is scope discipline, not removal.
- Blocking the push entirely: drift would accumulate silently - the workflow's own header comment says that is the failure it exists to prevent.

## Dead Ends

None.

## Edge Cases

- Sidecar-only drift (finding 1) is the worst kind: green CI, stale committed fixtures.
- The `if:` guard evaluates `github.event.head_commit.message` - null on some events; `startsWith(null, x)` is false so the job runs, which is the safe direction for dispatch.

## Recommendations

| ID | Recommendation | Q | Where it lives | Effort | Risk | Files touched | Evidence | Standing |
|----|----------------|---|----------------|--------|------|---------------|----------|----------|
| R10.1 | Commit all four published artifacts: `git add` the index + the three fixture sidecars (or `git status --porcelain` filtered to resolveArtifactPaths' outputs) so a rebuild commit is complete | Q4 | trigger-index-rebuild.yml commit step | S | Low: same commit shape, more paths | workflow yml | finding 1 | CONFIRMED |
| R10.2 | `set -euo pipefail` and verify post-commit: `git status --porcelain` must be empty for the four paths; fail loudly otherwise | Q4 | same step | S | Low: stricter script | workflow yml | finding 3 | CONFIRMED |
| R10.3 | Build on branch tip, not event sha (`ref: ${{ github.ref }}` on checkout or `git pull --rebase` before push); make the push-failure message distinguish non-fast-forward from auth failure | Q4 | checkout + push steps | S | Low: job-only | workflow yml | finding 4 | CONFIRMED |
| R10.4 | Prefer a GitHub App installation token (hourly expiry, no standing credential) over TRIGGER_INDEX_PUSH_TOKEN; if PAT stays, document required scope (Contents rw on this repo only, ruleset-bypass actor) in the workflow comment + workflows README, and set `persist-credentials: false` with the token used only in the push step | Q4 | workflow + README | S | Low-Med: token plumbing change; reversal = revert | workflow yml, README | finding 5 | CONFIRMED risk, INFERRED app-token feasibility |
| R10.5 | Let manual dispatch bypass the loop guard: `github.event_name == 'workflow_dispatch' || !startsWith(...)`; keep subject matching for pushes | Q4 | if: line | S | Low | workflow yml | finding 2b | CONFIRMED |

Idempotency/reversal/meaning: all are CI-behavior changes; no repo content semantics touched. R10.1/R10.2 make commits complete and honest; R10.4 reduces standing-credential exposure.

## Sources Consulted

- `steer.md`
- `.github/workflows/trigger-index-rebuild.yml` (full)
- `git show 01b0773d067` (full diff + message)
- `generate-trigger-index.mjs` (:26-80,352-399)
- `git ls-files` fixtures/ verification

## Assessment

- New information ratio: 0.95 (all findings carry fresh evidence)
- Questions addressed: Q4's CI/token leg fully evidenced
- Questions answered: Q1, Q3; Q4 partially (token/rebuild done; cleanup tools, seeder, Gate 3 wording remain for iteration 11)

## Reflection

- What worked: `git ls-files` on fixtures/ turned "sidecars probably committed" into a confirmed gap in one command.
- What did not: nothing.
- Do differently: none.

## Recommended Next Focus

Iteration 11 (Q4 continued): `template-phrase-cleanup.mjs` + `template-phrase-census.mjs` audit (what they write, idempotency, blast radius), the seeder change, and the Gate 3 wording edits from commit 4af470d1531.
