# Edits for unit t032

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.github/workflows/README.md`

OLD:

~~~~text
| `comment-hygiene.yml` | Rejects forbidden ephemeral-artifact pointers in code comments. |
~~~~

NEW:

~~~~text
| `comment-hygiene.yml` | Rejects forbidden ephemeral-artifact pointers in code comments. |
| `gate-inputs.yml` | Checks that every hook and workflow input resolves and that every path filter names both `.opencode/` and `.skilled/`. |
~~~~

## Edit 2

File: `.github/workflows/README.md`

OLD:

~~~~text
| `advisory-checks.yml`, `command-tree-parity.yml`, `naming-standard-guard.yml`, `playbook-operator-contract.yml` | yes | yes | Cheap guards over the whole tree |
~~~~

NEW:

~~~~text
| `advisory-checks.yml`, `command-tree-parity.yml`, `naming-standard-guard.yml`, `playbook-operator-contract.yml` | yes | yes | Cheap guards over the whole tree |
| `gate-inputs.yml` | yes, no path filter | yes, no path filter | Guards a move of the source tree, the one change a path filter could miss |
~~~~

## Edit 3

File: `.github/workflows/README.md`

OLD:

~~~~text
The spec-root matrix installs its script dependencies, verifies collection and runs the configured resolution rows.
~~~~

NEW:

~~~~text
The spec-root matrix installs its script dependencies, verifies collection and runs the configured resolution rows.

The gate-input workflow runs `.github/scripts/tests/check-gate-inputs.test.sh` against its fixtures, then `.github/scripts/check-gate-inputs.sh` over the real tree. The broken-move drill, `.github/scripts/tests/broken-move-drill.sh`, runs locally rather than in CI because it clones the whole repository. A workflow whose guard script is missing fails that step instead of skipping it.
~~~~
