---
title: "Bash Output Truncation — Make Verdicts Visible"
importanceTier: constitutional
contextType: decision
last_confirmed: "2026-05-31"
last_confirmed_source: "git-log-last-touch"
triggerPhrases:
  - bash output truncated
  - persisted-output
  - output too large
  - blank output
  - empty output
  - tool-results file
  - verdict not visible
  - did the command run
---

# Bash Output Truncation — Make Verdicts Visible

## Rule

Never infer a command's result from blank, truncated, or absent Bash output. When a Bash command's combined output exceeds ~2KB, the harness returns only a **preview (first ~2KB)** and writes the full output to a `tool-results/<id>.txt` file. Some calls also return apparently-empty output while the real result lands in the **preview of a *later* tool call** (display lag). Treat blank/lagged output as UNKNOWN, not success.

## Why

This repeatedly masked real verdicts — a FAILED strict-validate, an EINVAL daemon boot, a commit that never landed — and led to false "done" claims built on output that was never actually read. See the related rule on verifying before completion claims.

## How to apply

For any check whose verdict matters, make the verdict land in the FIRST ~2KB and confirm it:

1. **Verdict-first** — echo the one-line PASS/FAIL at the very TOP of the command, before any verbose body.
2. **Write-then-Read** — write the verdict to a small `/tmp/<name>.txt` file and `Read` that file, instead of trusting stdout.
3. **Pad to force render** — append a long pad so the harness switches to persisted-output and renders the preview deterministically: `node -e "process.stdout.write('.'.repeat(46500))"` after the real output.
4. **Re-derive from ground truth** — prefer `git rev-parse HEAD`, `git status --porcelain`, file existence, and direct DB/file reads over the command's own echo.
5. If a result file path is returned (`tool-results/<id>.txt`), `Read` it rather than re-running the command.
