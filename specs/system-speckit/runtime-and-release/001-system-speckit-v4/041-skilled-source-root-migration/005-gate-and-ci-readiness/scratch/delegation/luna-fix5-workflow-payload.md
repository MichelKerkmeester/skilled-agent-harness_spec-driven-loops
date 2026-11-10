# Edits for unit luna-fix5-workflow

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.github/workflows/gate-inputs.yml`

OLD:

~~~~text
      - name: Check the inputs of every hook, workflow and dependabot entry
        run: bash .github/scripts/check-gate-inputs.sh
~~~~

NEW:

~~~~text
      - name: Check the inputs of every hook, workflow and dependabot entry
        run: bash .github/scripts/check-gate-inputs.sh
      # The check reads the gates as text, so a shape it cannot parse could still hide a
      # one-root filter. The hook test scripts run the real hooks against staged changes
      # under both roots, which covers the gates' behavior whatever their spelling.
      - name: Run the hook test scripts against the real hooks
        run: |
          status=0
          for suite in .opencode/scripts/git-hooks/tests/*.test.sh .opencode/bin/tests/check-git-hooks.test.sh; do
            echo "::group::$suite"
            bash "$suite" || status=1
            echo "::endgroup::"
          done
          exit "$status"
~~~~
