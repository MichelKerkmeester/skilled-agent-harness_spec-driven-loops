## Edit 1

File: `.github/workflows/runtime-no-spec-import.yml`

OLD:

~~~~text
          node .opencode/bin/check-no-spec-imports.cjs
          # fail on a seeded spec-import fixture,
          if node .opencode/bin/check-no-spec-imports.cjs .opencode/bin/tests/fixtures/no-spec-import/positive; then
            echo "expected the positive fixture to FAIL the guard, but it passed" >&2
            exit 1
~~~~

NEW:

~~~~text
          node .opencode/bin/check-no-spec-imports.cjs
          # fail on a seeded spec-import fixture with the violation code, since a
          # fixture that moved away scans no file and exits 2 instead,
          positive_status=0
          node .opencode/bin/check-no-spec-imports.cjs .opencode/bin/tests/fixtures/no-spec-import/positive || positive_status=$?
          if [ "$positive_status" -ne 1 ]; then
            echo "expected the positive fixture to FAIL the guard with exit 1, got exit $positive_status" >&2
            exit 1
~~~~
