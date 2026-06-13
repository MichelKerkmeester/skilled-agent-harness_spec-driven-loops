# Review Iteration 3 — seat rv-3 (openai/gpt-5.5-fast, variant high)

- Dimension: ci-workflows-and-precommit
- Status: complete | exit=0 | duration=142s | P0=0 P1=2 P2=0
- Dispatch: cli-opencode opencode run, openai/gpt-5.5-fast --variant high (read-only)

## Seat output

Findings:
1. P1 `.github/workflows/agent-mirror-sync.yml:27` excludes deletions with `--diff-filter=ACM`; deleting `.claude/agents/foo.md` or `.codex/agents/foo.toml` can bypass the mirror check entirely. Same issue exists in `.opencode/hooks/pre-commit:45`.
2. P1 `.github/workflows/rule-canary-sync.yml:18` and `.github/workflows/agent-mirror-sync.yml:18` fail open when the checker file is missing, so a PR that deletes/moves the guard script can silently disable the CI gate. Local hook warning is reasonable; CI should fail closed.

Notes:
1. YAML shape is valid and jobs fail on checker non-zero: `.github/workflows/rule-canary-sync.yml:22-27`, `.github/workflows/agent-mirror-sync.yml:32-35`.
2. Spaces/quotes are safely preserved via arrays and quoted argv at `.github/workflows/agent-mirror-sync.yml:25-32` and `.opencode/hooks/pre-commit:43-50`; newline-containing filenames are not NUL-safe because both use newline-delimited `git diff --name-only`.
3. Existing comment-hygiene block is preserved before the new gate, and clean path still reaches `exit 0`: `.opencode/hooks/pre-commit:7-34`, `.opencode/hooks/pre-commit:58`.

```json
{"seat":"rv-3","dimension":"ci-workflows-and-precommit","findings":[{"id":"F1","severity":"P1","title":"Deleted agent files bypass the mirror gate","file":".github/workflows/agent-mirror-sync.yml","line":"27","evidence":"The workflow collects only ACM paths, so a PR that deletes a mirrored agent file produces no CHANGED entry and exits clean at lines 28-30; the pre-commit hook repeats the same ACM filter at .opencode/hooks/pre-commit:45.","recommendation":"Include deletions in the changed-path set and ensure the checker treats deleted canonical/mirror files as drift unless the whole mirrored agent set is intentionally removed."},{"id":"F2","severity":"P1","title":"CI guard scripts fail open when missing","file":".github/workflows/rule-canary-sync.yml","line":"18","evidence":"The workflow exits 0 when the checker file is absent; agent-mirror-sync.yml:18-20 does the same, so a PR-controlled deletion or move of the guard script silently disables the CI gate.","recommendation":"Fail closed in CI when required checker scripts are missing; keep warning-only behavior for local pre-commit if developer environment resilience is desired."}],"severityCounts":{"P0":0,"P1":2,"P2":0},"newInfoRatio":0.67}
```