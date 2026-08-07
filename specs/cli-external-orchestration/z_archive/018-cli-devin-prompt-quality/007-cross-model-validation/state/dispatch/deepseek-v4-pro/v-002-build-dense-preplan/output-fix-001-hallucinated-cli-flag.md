Now let me examine an existing fixture to understand the conventions:Now I have full context. Let me create the fixture directory and implement.---

## `<pre-plan>`

**Step 1 — Create fixture directory**
- Inputs: `fixtures/` exists (confirmed)
- Outputs: `fixtures/fix-001-hallucinated-cli-flag/seed/` directory
- Acceptance: `test -d fixtures/fix-001-hallucinated-cli-flag/seed` exits 0
- Verify: `ls -d fixtures/fix-001-hallucinated-cli-flag/seed/`
- Stop: if `mkdir` fails (directory tree unreachable)

**Step 2 — Write `wrapper.sh`**
- Inputs: empty `seed/` directory, allowlist + cli-devin SKILL.md line 227 evidence
- Outputs: `wrapper.sh` (executable, `set -euo pipefail`, parses args, classifies against allowlist, rejects `--reasoning-effort`, builds clean dispatch, writes `flag-verify.json`)
- Acceptance: `bash -n wrapper.sh` exits 0 (no syntax errors); `grep -qF '--reasoning-effort' wrapper.sh` (flag handled in reject logic)
- Verify: `bash -n wrapper.sh && echo "SYNTAX OK"`
- Stop: if `bash -n` fails or file write errors

**Step 3 — Syntax-check `wrapper.sh`**
- Inputs: written `wrapper.sh`
- Outputs: unchanged file (read-only check)
- Acceptance: `bash -n seed/wrapper.sh` exit 0; shellcheck passes (if available) or at minimum no parse errors
- Verify: `bash -n seed/wrapper.sh`
- Stop: if syntax errors found

**Step 4 — Smoke-test with hallucinated flag**
- Inputs: `wrapper.sh` compiled and executable
- Outputs: `flag-verify.json` populated; dispatched command printed to stderr
- Acceptance: `flag-verify.json` exists, contains `--reasoning-effort` in rejected section, dispatched command does NOT contain `--reasoning-effort`
- Verify: `./wrapper.sh --model swe-1.6 --reasoning-effort high --prompt-file task.txt 2>cmd.log; jq . flag-verify.json`
- Stop: if any acceptance criterion fails

**Step 5 — Run acceptance verification commands**
- Inputs: completed wrapper.sh, generated flag-verify.json from smoke-test
- Outputs: pass/fail for each of [ac-001], [ac-002], [ac-003]
- Acceptance: all three grep/syntax checks return success
- Verify (inline):
  - [ac-001]: `grep -qv 'reasoning-effort' <<<"$DISPATCHED_CMD"` or check cmd.log
  - [ac-002]: `bash -n seed/wrapper.sh && echo PASS`
  - [ac-003]: `grep -q 'reasoning-effort' seed/flag-verify.json && echo PASS`
- Stop: if any fails, fix and re-test from Step 2

## `</pre-plan>`

---

Now writing the implementation:Now let me syntax-check and fix any issues:The JSON has malformed allowlist arrays. Let me fix the wrapper:JSON is valid. Now running all three acceptance criteria:Let me also run a valid-only smoke test and shellcheck:Bug found — unset variable error when no flags rejected. Let me fix:macOS bash 3.x bug — `set -u` rejects empty array iteration. Let me fix with length guards:Both cases pass. Now running all three acceptance criteria:All three acceptance criteria pass. Here's the summary:

- **`wrapper.sh`** written at `fixtures/fix-001-hallucinated-cli-flag/seed/wrapper.sh`
- **`flag-verify.json`** generated at runtime by the wrapper

**What it does:**
1. Parses all CLI args against the documented allowlist from cli-devin SKILL.md
2. Detects `--reasoning-effort` (and any undocumented flag) and rejects it, also consuming its value argument
3. Builds a clean `devin` command from only accepted flags
4. Emits `flag-verify.json` with received/accepted/rejected breakdown and the dispatched command
5. Prints `DISPATCHED:` line to stderr (grep-able for ac-001)

**Verification results:**
- `[ac-001]` PASS — `--reasoning-effort` absent from dispatched command
- `[ac-002]` PASS — `bash -n` reports zero syntax errors
- `[ac-003]` PASS — `--reasoning-effort` present in `flag-verify.json` rejected section