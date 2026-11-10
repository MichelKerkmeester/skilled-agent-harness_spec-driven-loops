GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/system-deep-loop/039-deprecate-improvement-modes/009-existing-issue-fixes
It lives in the main checkout; you do not write to it. You write only in the current directory, which is a git worktree.

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.

ROLE: You fix three small existing defects. Nothing else.

FIX 1. Citation paths that contain a plus sign.
  File: .skilled/skills/sk-doc/shared/scripts/classifier-cite-drift-scan.mjs, the `CITATION_RE` constant near line 23.
  Old: /(?<![\w./-])([A-Za-z0-9_./-]+\.(?:ts|cjs|mjs|js|py|md|json|sh)):(\d+)(?:-(\d+))?/g
  New: /(?<![\w./+-])([A-Za-z0-9_./+-]+\.(?:ts|cjs|mjs|js|py|md|json|sh)):(\d+)(?:-(\d+))?/g
  Both character classes gain `+`: the capture so a path like `a+b/x.ts:3` is taken whole, the lookbehind so the match cannot start after the `+`.
  Test: in .skilled/skills/system-spec-kit/runtime/cli/tests/check-source-tags.vitest.ts, inside `describe('SOURCE_TAGS helper'`, add one `it` modelled on the first test in that block: write a real file at `src/a+b/real.ts` with at least 3 lines, a research.md containing `Claim [SOURCE: src/a+b/real.ts:3].`, and expect no warnings and `CHECKED\t1`. Read the file's `makeRepo` and `write` helpers first and use them as the other tests do.

FIX 2. Stale note in .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md, line 77.
  Old sentence: The cline-pass DeepSeek entry is a direct-dispatch roster entry only; it is not wired into the fan-out executor registry (which would force the unsupported `--variant max`).
  New sentence: The fan-out runner accepts this route too: `pinReasoningEffortForModel` in the deep-loop runtime's `executor-config.ts` pins any `cline-pass/` DeepSeek V4.1 Flash id to `xhigh`, so a fan-out lineage here never sends the unsupported `max`.
  Change nothing else in the file.

FIX 3. CI job that cannot load the checker's parser.
  File: .github/workflows/agent-mirror-sync.yml. The checker requires the built `system-spec-kit/shared/dist`, which is gitignored, and the job installs nothing.
  Between the checkout step and the "Check changed agent files" step, insert these two steps, copied from the pattern in .github/workflows/deep-loop-runtime.yml:
      - name: Setup Node
        uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
        with:
          node-version: '22'

      # The checker loads the frontmatter parser from the built shared package.
      - name: Build the shared package the checker loads
        run: |
          set -euo pipefail
          npm --prefix .opencode/skills/system-spec-kit ci
          ( cd .opencode/skills/system-spec-kit/shared && ../node_modules/.bin/tsc --build )
  Keep the existing steps unchanged.

DON'T
- BANNED OPERATIONS: git commit, git push, git checkout, git reset, git stash, git rebase, git branch, git mv, rm -rf, npm install, editing anything under specs/.
- ALLOWED WRITE PATHS: the four files named above, nothing else.
- Do not put spec paths, phase numbers or ticket ids in code comments.

VERIFY (run these; report each exit status)
  (cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli tests/check-source-tags.vitest.ts)
  node --test .skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs
  python3 -c 'import yaml; yaml.safe_load(open(".github/workflows/agent-mirror-sync.yml"))'

HANDBACK: list every file you changed, then each VERIFY command with its exit status and the last lines of any failure.
