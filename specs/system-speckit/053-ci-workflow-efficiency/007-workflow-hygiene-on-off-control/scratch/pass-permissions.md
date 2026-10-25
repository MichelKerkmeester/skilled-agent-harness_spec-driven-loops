# Permissions pass

## Permissions pass

Observed on the working tree after the twelve permission headers and the Dependabot split (nothing committed yet).

- Gate: `bash .github/scripts/check-gate-inputs.sh` printed `files=45 inputs_resolved=250 dynamic_inputs=39 twin_pairs=336 failures=0` then `RESULT: PASSED`; recorded exit status `exit=0` in `gate-after-permissions.txt`. `grep -c 'RESULT: PASSED'` on that file returned `1`.
- Parse: `python3 -c "import yaml, glob; [yaml.safe_load(open(f)) for f in glob.glob('.github/workflows/*.yml')]; print('parse ok')"` printed `parse ok`.
- Missing blocks: `grep -L 'permissions:' .github/workflows/*.yml | wc -l` printed `0`. The `grep` here is ugrep 7.8.4, whose `-L` exits `0` even when it lists nothing, so the completion criterion that expects exit `1` cannot be read from the exit status on this machine; the empty output is the evidence.
- Changed files: `git diff --stat .github/workflows | tail -1` printed `13 files changed, 60 insertions(+), 8 deletions(-)`.
- Split: `['auto-merge', 'metadata'] {'contents': 'read'} {'contents': 'read', 'pull-requests': 'read'} {'contents': 'write', 'pull-requests': 'write'}`; `grep -c 'contents: write'` is `1`, `grep -c 'actions/checkout'` is `0`, `grep -c 'dependabot/fetch-metadata'` is `1`.

Scope derivation: each of the twelve files was read for what its steps do. Every job only runs `actions/checkout`, optionally `actions/setup-node`, and repository scripts. None calls `gh`, the API, a token, a secret, `git push` or a comment step, so `contents: read` is the whole requirement. `chart-corpus.yml` and `diagram-corpus.yml` carry a comment block directly above `jobs:`, so the block sits above that comment and the comment stays attached to `jobs:`.
