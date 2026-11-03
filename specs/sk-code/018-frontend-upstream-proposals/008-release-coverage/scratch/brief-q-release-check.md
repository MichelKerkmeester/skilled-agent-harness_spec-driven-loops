GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/sk-code/018-frontend-upstream-proposals/008-release-coverage

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.


PERSONA: You are @code, a LEAF implementation agent. Load `sk-code` first and follow the surface it selects (SKILLED).
Edit only the files named below. Never dispatch another agent.
Never alter text, characters or tests to make a check pass. If a check flags a value you believe is legitimate, leave it and report it.
End with one status line: `STATUS=OK FILES=<n>` or `STATUS=FAIL ERROR=<reason>`.


ROLE: Widen the operator-local alignment check so a branch's changes are also checked against the root README and the open root release notes, not only the lines the branch touched.

A = `.skilled/commands/assets/local-skilled-alignment` (a folder of node scripts; read `surface-map.yaml`, `run-battery.cjs` lines ~80-110 and ~230-250, and `tests/recheck.test.cjs` for house style before writing).

ACTION:
1. Create `A/check-release-coverage.cjs` (CommonJS, `'use strict'`, header and numbered section comments like the sibling scripts, no dependencies).
   Usage: `node check-release-coverage.cjs --scope <scope.json> [--repo <dir>]`; `--repo` defaults to the current directory.
   - Read `scope.json`; its `statuses` object maps each changed path to a git status letter (`A` added, `M`, `D`, ...).
   - The open release notes are the highest-versioned `<repo>/.skilled/changelog/skilled/v*.md`, comparing the dotted numbers numerically.
     If that folder or any `v*.md` is missing, print `STATUS=ERROR check-release-coverage: no root release notes under .skilled/changelog/skilled` and exit 2.
   - Rule 1: every ADDED path matching `^\.skilled/skills/(?:.+/)?([^/]+)/changelog/v[0-9.]+\.md$` requires its skill id (capture group 1, the folder that holds `changelog/`) to appear in the release notes.
   - Rule 2: every ADDED path matching `^\.skilled/skills/(?:.+/)?([^/]+)/SKILL\.md$` requires the skill id to appear in the release notes AND in `<repo>/README.md`. The id is the SKILL.md frontmatter `name:` when present, else the folder name.
   - "Appears" means a case-insensitive match of the id bounded by a non `[A-Za-z0-9_-]` character or line edge on both sides.
   - Each id is checked once per target file even when several paths require it; name the first path that required it.
   - Print one line per gap: `MISSING release-notes <id> required by <path>` or `MISSING readme <id> required by <path>`, then a summary line
     `STATUS=FINDINGS check-release-coverage: required=<n> missing=<m> notes=<relative notes path>` and exit 1; with no gap print
     `STATUS=OK check-release-coverage: required=<n> missing=0 notes=<relative notes path>` and exit 0. With nothing required, `required=0` and exit 0.
2. Create `A/tests/check-release-coverage.test.cjs` with `node:test`, temp-folder fixtures and `spawnSync`, in the style of `tests/recheck.test.cjs`. Cases:
   (a) an added skill changelog whose id the newest notes mention passes; (b) the same id missing fails with the `MISSING release-notes` line;
   (c) with `v1.0.0.0.md` and `v1.0.10.0.md` present, the check reads `v1.0.10.0.md` (numeric, not lexical order);
   (d) an added `SKILL.md` whose name is absent from `README.md` fails with `MISSING readme`; (e) no notes folder exits 2.
3. `A/surface-map.yaml`, surface `S6`: replace `checks: []` with one check:
   ```
       checks:
         - id: S6-release-coverage
           per: once
           cmd: [node, .skilled/commands/assets/local-skilled-alignment/check-release-coverage.cjs, --scope, "{scope}", --repo, "{repo}"]
           exit_map: { "2": cannot_run }
   ```
   (match the YAML indentation and the `exit_map` form other checks in the file use; if no check uses `exit_map`, read `run-battery.cjs` for the accepted shape).
   Replace S6's `lens` with:
   `A changed skill or a version bump carries a changelog entry for that version, and spec-folder changelogs match the commits that shipped. Read beyond the touched lines: every user-visible capability the scope adds, removes or renames is described in the open root release notes (the newest .skilled/changelog/skilled/v*.md) and in the root README section that covers that skill, and neither still describes what the scope removed.`
   Replace S5's `lens` with:
   `Root README.md and each touched skill, hub and command family README: counts, feature lists and version lines match what shipped. Do not stop at lines the scope touched: for each skill the scope changes, read the root README section that describes that skill and report a capability the scope added or removed that the section does not reflect.`
4. `.skilled/commands/local-skilled-alignment.md`, section 2 OWNED ASSETS table: add the row
   `| Release-coverage check | `.skilled/commands/assets/local-skilled-alignment/check-release-coverage.cjs` |` after the Env-token check row.

ALLOWED WRITE PATHS: `A/check-release-coverage.cjs`, `A/tests/check-release-coverage.test.cjs`, `A/surface-map.yaml`, `.skilled/commands/local-skilled-alignment.md`.
BANNED OPERATIONS: no `git`, no `rm`, no edit outside the allowed paths, no installs, no network. No code comment names a spec folder, phase, task or finding id. Never write an em dash.

VERIFY, paste each command with output and exit code:
- `node --test .skilled/commands/assets/local-skilled-alignment/tests/`
- `node -e "require('fs');" && python3 -c "import yaml,sys;yaml.safe_load(open('.skilled/commands/assets/local-skilled-alignment/surface-map.yaml'))" ; echo yaml=$?`
- `node .skilled/commands/assets/local-skilled-alignment/check-release-coverage.cjs --scope /dev/null; echo exit=$?` (a missing or unreadable scope must fail cleanly with a STATUS=ERROR line, not a stack trace; make it exit 2)
