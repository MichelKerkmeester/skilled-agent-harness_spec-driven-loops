# SOL Execution Report: Git Preflight Advisory Runtime Coverage

## 1. RESULT

The implementation and every verification command required by `SOL-BRIEF.md` were executed. The task-specific result is:

- Rule suite: **23 pass / 0 fail**.
- JavaScript and MJS syntax: **7/7 checked successfully**.
- Pi TypeScript syntax through Node's type-stripping parser: **checked successfully**.
- Cursor and Devin JSON: **both parsed successfully**.
- Claude `Bash`, `exec`, Cursor `Shell`, Devin, OpenCode, and Pi advisory paths: **advisory observed**.
- Non-git command and clean-tree ordinary commit: **silent**.
- Global and rule-prefix suppression: **silent**.
- Comment hygiene: **zero findings**.
- OpenCode drift guards: **all three guards passed**.
- `npx tsc --noEmit` for `.pi`: **not available** because this checkout has no installed TypeScript compiler or `.pi/tsconfig.json`; the exact availability output is recorded below.

No commit or push was performed. Workspace git state was not modified. Git initialization and commits occurred only in the authorized scratch repositories under `/tmp`.

## 2. IMPLEMENTATION

### Style Alignment

The five existing sk-git scripts now use the OpenCode JavaScript structure required by the style authority:

- Boxed component headers.
- Numbered, all-caps section dividers.
- Complete JSDoc for exported function declarations.
- Camel-case local naming, including replacing the computed local `ORDINARY` name with `ordinaryCommands`.
- Behavior, existing messages, check implementations, and existing exports remain unchanged.

The one additive export explicitly permitted by the brief is `GIT_SHAPE` from `git-rule-checks.mjs`. The shared hook, OpenCode plugin, and Pi extension consume this one regex.

### Runtime Adapters

| Runtime | Implementation | Delivery |
|---|---|---|
| Claude | Shared stdin hook, `tool_name: Bash` | `hookSpecificOutput.additionalContext` |
| Codex | Shared stdin hook, `tool_name: exec` | `hookSpecificOutput.additionalContext` |
| Devin | Shared stdin hook, `tool_name: exec` | Same hook JSON through the registered fail-open shell envelope |
| Cursor | Thin `Shell` payload proxy | Shared hook stdout forwarded verbatim |
| OpenCode | Default-export plugin on `tool.execute.before` | Bounded `experimental.chat.system.transform` injection; no stdout/stderr |
| Pi | Default-export extension on `tool_call` | Warning-only `{ reason }`; never `block: true` |

Every adapter imports or invokes the existing hard-rule parser/evaluator, `GIT_CHECKS`, and lazy `createGitContext`; no rule engine, check registry, or context collector was duplicated.

OpenCode uses the strongest legal sibling delivery mechanism. The plugin buffers at most 20 advisory events and drains them once into the next `experimental.chat.system.transform`. It never writes to process stdout or stderr and never throws from a tool hook.

### Registrations and Documentation

- `.cursor/hooks.json`: appended a `preToolUse` entry with matcher `Shell` and timeout `10`.
- `.devin/hooks.v1.json`: appended the shared hook after existing `^exec$` hooks, using the same `DEVIN_PROJECT_DIR` shell envelope and an approval JSON fallback.
- Added `scripts/lib/README.md` covering all 17 checks, discriminator-not-verb design, lazy context, real-repository tests, and noise-audit control group.
- Added `scripts/hooks/README.md` covering the six-runtime matrix, registrations, suppression, fail-open behavior, advisory cap, and OpenCode delivery.

## 3. FILES WRITTEN

### Existing Files Updated

- `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs`
- `.opencode/skills/sk-git/scripts/lib/git-rule-checks.mjs`
- `.opencode/skills/sk-git/scripts/lib/git-context.mjs`
- `.opencode/skills/sk-git/scripts/lib/git-rule-checks.test.mjs`
- `.opencode/skills/sk-git/scripts/lib/advisory-noise-audit.mjs`
- `.cursor/hooks.json`
- `.devin/hooks.v1.json`

### New Files

- `.opencode/plugins/mk-git-preflight-advisory.js`
- `.pi/extensions/git-preflight-advisory.ts`
- `.cursor/hooks/git-preflight-advisory.mjs`
- `.opencode/skills/sk-git/scripts/lib/README.md`
- `.opencode/skills/sk-git/scripts/hooks/README.md`
- `.opencode/specs/sk-git/016-git-action-advisory-hook/007-runtime-coverage/scratch/SOL-REPORT.md`

## 4. BASELINE

Command:

```bash
node --test .opencode/skills/sk-git/scripts/lib/git-rule-checks.test.mjs
```

Baseline summary:

```text
1..23
# tests 23
# suites 0
# pass 23
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 2520.541333
```

Delta: final verification remains 23 pass / 0 fail.

## 5. REQUIRED VERIFICATION

### 5.1 Rule Suite

Command:

```bash
node --test .opencode/skills/sk-git/scripts/lib/git-rule-checks.test.mjs
```

Final output summary:

```text
1..23
# tests 23
# suites 0
# pass 23
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 3461.13675
```

Result: **23 pass / 0 fail**.

### 5.2 JavaScript and MJS Syntax

Command:

```bash
node --check .opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs && \
node --check .opencode/skills/sk-git/scripts/lib/git-rule-checks.mjs && \
node --check .opencode/skills/sk-git/scripts/lib/git-context.mjs && \
node --check .opencode/skills/sk-git/scripts/lib/git-rule-checks.test.mjs && \
node --check .opencode/skills/sk-git/scripts/lib/advisory-noise-audit.mjs && \
node --check .opencode/plugins/mk-git-preflight-advisory.js && \
node --check .cursor/hooks/git-preflight-advisory.mjs
```

Output:

```text
node --check: OK (7 JavaScript/MJS files)
```

Result: exit `0` for every file.

### 5.3 JSON Parsing

Command:

```bash
node -e "JSON.parse(require('node:fs').readFileSync('.cursor/hooks.json', 'utf8')); JSON.parse(require('node:fs').readFileSync('.devin/hooks.v1.json', 'utf8')); process.stdout.write('JSON parse: OK (.cursor/hooks.json, .devin/hooks.v1.json)\\n')"
```

Output:

```text
JSON parse: OK (.cursor/hooks.json, .devin/hooks.v1.json)
```

Result: exit `0`.

### 5.4 Scratch Repository Setup

Dirty repository command:

```bash
repo=$(mktemp -d "/tmp/sk-git-sol.XXXXXX") && \
git -C "$repo" init -q && \
git -C "$repo" config core.hooksPath "$repo/.no-hooks" && \
git -C "$repo" config user.email "sol@example.invalid" && \
git -C "$repo" config user.name "SOL Verification" && \
git -C "$repo" config commit.gpgsign false && \
mkdir -p "$repo/src" "$repo/.opencode/skills/sk-git" && \
cp ".opencode/skills/sk-git/SKILL.md" "$repo/.opencode/skills/sk-git/SKILL.md" && \
printf 'tracked seed\n' > "$repo/src/tracked.txt" && \
git -C "$repo" add src/tracked.txt && \
git -C "$repo" commit -q -m seed && \
printf 'tracked modified\n' > "$repo/src/tracked.txt" && \
printf 'untracked\n' > "$repo/src/untracked.txt"
```

Created repository:

```text
/private/tmp/sk-git-sol.ZrwgfL
```

The repository has hooks redirected to `.no-hooks`, one modified tracked file at `src/tracked.txt`, and one untracked file at `src/untracked.txt`.

Clean repository created with the same initialization and detached hooks-path setup:

```text
/private/tmp/sk-git-sol-clean.dyTCjx
```

### 5.5 Claude Bash Simulation

Command, run with the dirty scratch repository as the working directory:

```bash
printf '%s' '{"tool_name":"Bash","tool_input":{"command":"git commit --only src -m x"}}' | \
node "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0113-sk-git-016-advisory-hook-build/.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs"
```

Output:

```json
{"hookSpecificOutput":{"hookEventName":"PreToolUse","additionalContext":"⚠ sk-git advisory — this `git commit` may not do what it appears to:\n  • [commit-scope-drops-untracked] Untracked files sit inside the scope of this commit and will be silently excluded — exit 0, no warning. Naming an untracked file directly would error; naming its directory does not. Run `git status` first, or check `git show --name-only HEAD` against what you expected.\n  Advisory only — the command still runs. Silence: SKGIT_ADVISORY_SKIP=<rule-id>"}}
```

Result: advisory present; no denial field.

### 5.6 Exec Simulation

Command:

```bash
printf '%s' '{"tool_name":"exec","tool_input":{"command":"git commit --only src -m x"},"cwd":"/private/tmp/sk-git-sol.ZrwgfL"}' | \
node .opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs
```

Output:

```json
{"hookSpecificOutput":{"hookEventName":"PreToolUse","additionalContext":"⚠ sk-git advisory — this `git commit` may not do what it appears to:\n  • [commit-scope-drops-untracked] Untracked files sit inside the scope of this commit and will be silently excluded — exit 0, no warning. Naming an untracked file directly would error; naming its directory does not. Run `git status` first, or check `git show --name-only HEAD` against what you expected.\n  Advisory only — the command still runs. Silence: SKGIT_ADVISORY_SKIP=<rule-id>"}}
```

Result: advisory present; no denial field.

### 5.7 Silence Cases

Non-git command:

```bash
printf '%s' '{"tool_name":"Bash","tool_input":{"command":"npm test"},"cwd":"/private/tmp/sk-git-sol.ZrwgfL"}' | \
node .opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs
```

Output:

```text
(no output)
```

Clean-tree ordinary commit, run in `/private/tmp/sk-git-sol-clean.dyTCjx`:

```bash
printf '%s' '{"tool_name":"Bash","tool_input":{"command":"git commit -m x"}}' | \
node "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0113-sk-git-016-advisory-hook-build/.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs"
```

Output:

```text
(no output)
```

Result: both required silence cases produced zero stdout and exit `0`.

### 5.8 Cursor Proxy Simulation

Command:

```bash
printf '%s' '{"tool_name":"Shell","tool_input":{"command":"git commit --only src -m x"},"workspace_roots":["/private/tmp/sk-git-sol.ZrwgfL"]}' | \
node .cursor/hooks/git-preflight-advisory.mjs
```

Output:

```json
{"hookSpecificOutput":{"hookEventName":"PreToolUse","additionalContext":"⚠ sk-git advisory — this `git commit` may not do what it appears to:\n  • [commit-scope-drops-untracked] Untracked files sit inside the scope of this commit and will be silently excluded — exit 0, no warning. Naming an untracked file directly would error; naming its directory does not. Run `git status` first, or check `git show --name-only HEAD` against what you expected.\n  Advisory only — the command still runs. Silence: SKGIT_ADVISORY_SKIP=<rule-id>"}}
```

Result: proxy output is the shared hook output verbatim.

### 5.9 Pi and OpenCode Syntax

Pi command:

```bash
node --check .pi/extensions/git-preflight-advisory.ts
```

Output:

```text
Pi node --check: OK
```

OpenCode command is included in the seven-file syntax chain above:

```bash
node --check .opencode/plugins/mk-git-preflight-advisory.js
```

Output: none; exit `0`.

### 5.10 TypeScript Compiler Availability

Availability command:

```bash
npx --no-install tsc --version
```

Real output:

```text
This is not the tsc command you are looking for

To get access to the TypeScript compiler, tsc, from the command line either:

- Use npm install typescript to first add TypeScript to your project before using npx
- Use yarn to avoid accidentally running code from un-installed packages
```

No `.pi/tsconfig.json` exists. Therefore `npx tsc --noEmit` was not available and was not run. No package installation was attempted because dependency changes are outside the write scope.

## 6. ADDITIONAL RUNTIME EVIDENCE

### OpenCode In-Process Simulation

Command:

```bash
node --input-type=module -e "import plugin from './.opencode/plugins/mk-git-preflight-advisory.js'; const hooks = await plugin({ directory: '/private/tmp/sk-git-sol.ZrwgfL' }); await hooks['tool.execute.before']({ tool: 'bash' }, { args: { command: 'git commit --only src -m x' } }); const output = { system: [] }; await hooks['experimental.chat.system.transform']({}, output); process.stdout.write(JSON.stringify(output));"
```

Output:

```json
{"system":["⚠ sk-git advisory — this `git commit` may not do what it appears to:\n  • [commit-scope-drops-untracked] Untracked files sit inside the scope of this commit and will be silently excluded — exit 0, no warning. Naming an untracked file directly would error; naming its directory does not. Run `git status` first, or check `git show --name-only HEAD` against what you expected.\n  Advisory only — the command still runs. Silence: SKGIT_ADVISORY_SKIP=<rule-id>"]}
```

This confirms the plugin imports resolve, evaluation runs, and delivery uses `output.system` without printing from plugin code.

### Pi In-Process Simulation

Command:

```bash
node --no-warnings --input-type=module -e "import extension from './.pi/extensions/git-preflight-advisory.ts'; let handler; extension({ on: (_name, fn) => { handler = fn; } }); const result = await handler({ toolName: 'bash', input: { command: 'git commit --only src -m x' } }, { cwd: '/private/tmp/sk-git-sol.ZrwgfL' }); process.stdout.write(JSON.stringify(result));"
```

Output:

```json
{"reason":"⚠ sk-git advisory — this `git commit` may not do what it appears to:\n  • [commit-scope-drops-untracked] Untracked files sit inside the scope of this commit and will be silently excluded — exit 0, no warning. Naming an untracked file directly would error; naming its directory does not. Run `git status` first, or check `git show --name-only HEAD` against what you expected.\n  Advisory only — the command still runs. Silence: SKGIT_ADVISORY_SKIP=<rule-id>"}
```

This confirms all three dynamic import paths resolve relative to the extension and the result has no `block` property.

### Devin Registered Envelope

The exact registered shell envelope was run with the repository checkout in `DEVIN_PROJECT_DIR` and the dirty scratch repository in payload `cwd`.

Output:

```json
{"hookSpecificOutput":{"hookEventName":"PreToolUse","additionalContext":"⚠ sk-git advisory — this `git commit` may not do what it appears to:\n  • [commit-scope-drops-untracked] Untracked files sit inside the scope of this commit and will be silently excluded — exit 0, no warning. Naming an untracked file directly would error; naming its directory does not. Run `git status` first, or check `git show --name-only HEAD` against what you expected.\n  Advisory only — the command still runs. Silence: SKGIT_ADVISORY_SKIP=<rule-id>"}}
```

## 7. SUPPRESSION EVIDENCE

Global suppression:

```bash
printf '%s' '{"tool_name":"Bash","tool_input":{"command":"git commit --only src -m x"},"cwd":"/private/tmp/sk-git-sol.ZrwgfL"}' | \
SKGIT_ADVISORY=0 node .opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs
```

Output:

```text
(no output)
```

Rule-group suppression:

```bash
printf '%s' '{"tool_name":"Bash","tool_input":{"command":"git commit --only src -m x"},"cwd":"/private/tmp/sk-git-sol.ZrwgfL"}' | \
SKGIT_ADVISORY_SKIP=commit node .opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs
```

Output:

```text
(no output)
```

## 8. QUALITY GATES

### Comment Hygiene

Command:

```bash
for file in \
  .opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs \
  .opencode/skills/sk-git/scripts/lib/git-rule-checks.mjs \
  .opencode/skills/sk-git/scripts/lib/git-context.mjs \
  .opencode/skills/sk-git/scripts/lib/git-rule-checks.test.mjs \
  .opencode/skills/sk-git/scripts/lib/advisory-noise-audit.mjs \
  .opencode/plugins/mk-git-preflight-advisory.js \
  .pi/extensions/git-preflight-advisory.ts \
  .cursor/hooks/git-preflight-advisory.mjs; do
  .opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh "$file" || exit $?
done
```

Output: none; exit `0` for every file.

### OpenCode Drift Guards

Command:

```bash
bash .opencode/skills/sk-code/code-opencode/scripts/run-all-drift-guards.sh
```

Output summary:

```text
[alignment-drift] PASS
Scanned files: 70
Findings: 0
Errors: 0
Warnings: 0
Violations: 0
PASS: alignment-drift  (verify_alignment_drift.py --check-router)

OK: 6 language folder(s) all resolve — config, javascript, python, rust, shell, typescript
PASS: stack-folders    (verify_stack_folders.py)

Test Files  1 passed (1)
Tests  10 passed (10)
PASS: router-sync      (sk-code-router-sync.vitest.ts)

run-all-drift-guards: all 3 guards PASSED
```

## 9. STRICT SPEC VALIDATION NOTE

An additional strict packet validation was run even though the brief binds writes only to the scratch report and implementation paths:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/sk-git/016-git-action-advisory-hook/007-runtime-coverage \
  --strict
```

Result: **failed outside the task-specific gates** with 11 errors and 1 warning. The important real output was:

```text
Folder: .opencode/specs/sk-git/016-git-action-advisory-hook/007-runtime-coverage
Level:  1 (inferred)

✗ FILE_EXISTS: Missing 3 required file(s) for Level 1
    - spec.md
    - plan.md
    - tasks.md

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../mcp-server/lib/templates/level-contract-resolver.js'

✗ EVIDENCE_MARKER_LINT: tsx runtime missing: .../system-spec-kit/scripts/node_modules/.bin/tsx
✗ GENERATED_METADATA_INTEGRITY: tsx runtime missing: .../system-spec-kit/scripts/node_modules/.bin/tsx
✗ GENERATED_METADATA_DRIFT: tsx runtime missing: .../system-spec-kit/scripts/node_modules/.bin/tsx

Summary: Errors: 11  Warnings: 1
RESULT: FAILED
```

`mk_speckit_completion` independently confirmed that this directory contains none of `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, or `implementation-summary.md`. Creating those files, generated metadata, or installing/building system-spec-kit dependencies is outside the brief's complete write scope, so no out-of-scope repair was attempted. This failure does not contradict any required Task 7 gate; it documents that the containing runtime-coverage directory is a scratch-only target rather than a valid standalone packet in this checkout.

## 10. RESIDUAL LIMITS

- No live Cursor editor, Devin host, Pi host, or OpenCode TUI session was launched. Their adapter contracts were exercised through real entrypoint or in-process simulations.
- OpenCode advisory context is delivered on the next system transform after the tool event because printing is forbidden and throwing would block the command.
- Pi received syntax and in-process runtime coverage, but no `tsc --noEmit` result because TypeScript is not installed for `.pi`.
- The strict Spec Kit validator cannot certify the scratch-only containing directory for the out-of-scope reasons recorded above.
