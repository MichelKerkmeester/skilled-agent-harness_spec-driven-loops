## Source anchors

Read on the worktree on 2026-10-24 and re-derived after the gate-input script gained lines. Line numbers are current values, not the plan-time ones.

ANCHOR 1 twin function
`.github/scripts/check-gate-inputs.sh:116` `function twin(tok) {` maps a `.opencode/` token to its `.skilled/` twin and the reverse.

ANCHOR 2 twin-one verdict
`.github/scripts/check-gate-inputs.sh:339` `twin-one) fail filter-twins "$rel:$ln" "pathspec $tok has no twin $twin" ;;` The same verdict repeats at `:423` for path filters and `:478` for directories. The composite-action scan is the `if [[ -d "$ROOT/.github/actions" ]]` block at `:499-503`.

ANCHOR 3 inert twin comment
`.github/workflows/repo-rules-corpus.yml:9` `# No .opencode/repo-rules tree exists; the gate-input check requires every` and `:10` `# source-root filter to name both roots, so this twin is required and inert.` The `push:` filter repeats it at `:20-21`.

ANCHOR 4 push-only rebuild trigger
`.github/workflows/trigger-index-rebuild.yml:6-9` holds `on:`, `push:`, `branches: [main, 'skilled/**']` and `workflow_dispatch:`. There is no `pull_request:` key.

ANCHOR 5 four generated paths
`.github/workflows/trigger-index-rebuild.yml:79-84` holds `FILES=(` with `trigger-index.json`, `corpus-manifest.json`, `generation-diagnostics.json` and `phrase-variants.json`. The rebuild commit carries the skip token at `:151`: `-m "The pushed corpus changed the committed trigger index, so this job rebuilt it. [skip ci]" \`.

ANCHOR 6 message-contract trigger
`.github/workflows/message-contract.yml:2-6` is the comment `# Every local gate (commit-msg, pre-push, the agent gate) can be skipped by a ...` and `:8-9` is `push:` with `branches: ['**']`.

ANCHOR 7 README row
`.github/workflows/README.md:73` `| `message-contract.yml` | yes, every branch | yes, including edits | Holds commit messages, branch names and the pull request description to the templates even when local hooks were skipped. ...`. The contents row is at `:39`.

ANCHOR 8 timeouts
`grep -c 'timeout-minutes' .github/workflows/*.yml | grep -v ':0' | wc -l` prints `6`: seven lines across six workflows.

ANCHOR 9 permissions
`grep -L '^permissions:' .github/workflows/*.yml | wc -l` prints `12`, so 21 of 33 workflows declare permissions.

ANCHOR 10 concurrency
`grep -l '^concurrency:' .github/workflows/*.yml | wc -l` prints `31`. Thirty carry `cancel-in-progress: ${{ github.event_name == 'pull_request' }}` and `trigger-index-rebuild.yml` carries `cancel-in-progress: false`. `dependabot-auto-merge.yml` and `strict-pass-freshness-report.yml` carry none.
