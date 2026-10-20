ROLE: You make one documentation correction across the cli-opencode skill, add one Node test that keeps it corrected, and run that test from one CI step. Comments never name a spec folder, phase, row or task id.

FACT (verified live on 2026-10-20): `opencode models opencode-go` on OpenCode 1.19.3 lists `opencode-go/deepseek-v4.1-flash` and does NOT list `opencode-go/deepseek-v4-flash`. The skill's roster (`references/providers-and-models.md`, opencode-go table, the row marked ✓) already names `opencode-go/deepseek-v4.1-flash` as the default. Many other cli-opencode docs still show the dead id `opencode-go/deepseek-v4-flash` for OpenCode 1.

STEP 1. From the worktree root, run exactly this replacement (it only touches the exact dead id, never `deepseek-v4-flash-vision-exp`, `-latest` or any other provider's id, and skips the changelog and benchmark folders, which are historical records):

```
C=.skilled/skills/cli-external-orchestration/cli-opencode
rg -lP 'opencode-go/deepseek-v4-flash(?![\w.-])' "$C" | grep -vE '/(changelog|benchmark)/' \
  | xargs perl -0pi -e 's{opencode-go/deepseek-v4-flash(?![\w.-])}{opencode-go/deepseek-v4.1-flash}g'
```

STEP 2. One line is a dated record and must keep the old id: in `$C/manual-testing-playbook/manual-testing-playbook.md`, the line that starts `Coverage note (2026-04-26):`. Restore the old id on that one line only (`git diff` shows it), so it reads exactly as before.

STEP 3. Read every changed line (`git diff -U0 -- $C`). Where a sentence now says the same id twice for OpenCode 1 and OpenCode 2 (for example "On OpenCode 1 ... `opencode-go/deepseek-v4.1-flash --variant max` ... On OpenCode 2 ... `-m opencode-go/deepseek-v4.1-flash#max`"), keep both forms: they differ in the flag shape, which is correct. Do not rewrite any other wording.

STEP 4. Create `$C/scripts/tests/default-model-id.test.cjs` in the style of `$C/scripts/tests/opencode-setup-classify.test.cjs` (header banner, `'use strict'`, `node:test`, `node:assert/strict`, numbered section banners). It has these tests:
- `the roster names one opencode-go default`: in `references/providers-and-models.md`, exactly one table row under the `### opencode-go` heading has `✓` in its Default column, and its id is `opencode-go/deepseek-v4.1-flash`. Read the id from the file; keep the expected id in one constant `DEFAULT_ID`.
- `SKILL.md's default invocation names the roster default`: the `### Default Invocation` section of `SKILL.md` contains `DEFAULT_ID`.
- `no current doc names the retired opencode-go id`: walk `$C` recursively for `.md` and `.json` files, skipping the `changelog` and `benchmark` folders. No line may match `/opencode-go\/deepseek-v4-flash(?![\w.-])/`, except lines listed in a constant `DATED_RECORDS` (one entry: file `manual-testing-playbook/manual-testing-playbook.md`, line prefix `Coverage note (2026-04-26):`, with a comment saying a dated record keeps the id it recorded). On failure, the message lists every `file:line`.

STEP 5. In `.github/workflows/opencode-dual-version.yml`:
- add the new test file to the `node --test` list in the step `Run the config-shape and battery unit tests`, and rename that step `Run the config-shape, battery and cli-opencode doc unit tests`; update the comment above it so it no longer says "Two of the trigger paths".
- add these four paths to BOTH the `pull_request.paths` and the `push.paths` lists, next to the battery entries:
  `.skilled/skills/cli-external-orchestration/cli-opencode/**`
  `.opencode/skills/cli-external-orchestration/cli-opencode/**`
Then run `bash .github/scripts/check-gate-inputs.sh` and `actionlint .github/workflows/opencode-dual-version.yml` and fix what they report.

VERIFY (run each, report the tail and exit code):
1. `node --test .skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/default-model-id.test.cjs`
2. `rg -nP 'opencode-go/deepseek-v4-flash(?![\w.-])' .skilled/skills/cli-external-orchestration/cli-opencode | grep -vE '/(changelog|benchmark)/'` (expect exactly the one dated line)
3. `bash .github/scripts/check-gate-inputs.sh`
4. `actionlint .github/workflows/opencode-dual-version.yml`

REPORT: files changed with counts, the test names, and each verify result.
