## Verdict

REQUEST_CHANGES: the gate parser still has bypasses for hook, workflow and Dependabot inputs, plus false failures and an over-broad agent-path matcher.

## Findings

| ID | Severity (P0 blocks the phase, P1 must fix, P2 should fix) | File:line | Scenario (the inputs and the wrong outcome) | Suggested fix |
|---|---|---|---|---|
| P1-001 | P1 | `.github/scripts/check-gate-inputs.sh:106` | A hook array entry followed by an inline comment containing its `.skilled` twin records both roots, so an active one-root pathspec passes. | Strip shell comments outside quoted tokens before matching; add an inline-comment fixture. |
| P1-002 | P1 | `.github/scripts/check-gate-inputs.sh:115` | A pathspec followed by `\` and then `&& git ...` shares one group, so a twin in the second command satisfies the first command. | Split groups at shell command operators even across continuations. |
| P1-003 | P1 | `.github/scripts/check-gate-inputs.sh:130` | `PATHS=( ".opencode/skills/*/SKILL.md" )` is a valid inline array but yields no record; another parsed input suppresses `parser-miss`, so the missing twin passes. | Parse inline arrays and both quoted/unquoted array elements. |
| P1-004 | P1 | `.github/scripts/check-gate-inputs.sh:248` | A valid unquoted Dependabot directory such as `- /.opencode/**` is ignored; another quoted directory elsewhere makes the file pass without its twin. | Parse quoted and plain YAML scalars, or use a YAML parser. |
| P1-005 | P1 | `.github/scripts/check-gate-inputs.sh:194` | `run: echo "message" && node .opencode/missing.js` skips the entire line, so the real `node` input is never checked. | Skip only the echo/printf command and continue scanning subsequent shell commands. |
| P2-001 | P2 | `.github/scripts/check-gate-inputs.sh:194` | `- run: "echo .opencode/docs/not-a-gate.md"` is valid workflow syntax but is parsed as an executable path and fails when the message file is absent. | Recognize quoted YAML command scalars before classifying echo/printf text. |
| P2-002 | P2 | `.github/scripts/check-gate-inputs.sh:130` | A valid `local -a PATHS=(` array with twins split across lines is not grouped as an array; each element gets its own command group and the correct file fails `filter-twins`. | Support `local`/`declare -a` array declarations and retain one array group. |
| P2-003 | P2 | `.opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs:32` | The new pattern accepts `.skilled/agents/README.txt`, although the repository defines live agents as `.md` files (`.opencode/agents/README.txt:4-9`), and reports the basename as checked. | Restrict changed agent paths to `.md` files and optionally require valid agent frontmatter. |
Codex exit 0, 2026-09-17T06:06:42Z to 2026-09-17T06:18:01Z, --model gpt-5.6-luna, reasoning xhigh, service tier fast, --sandbox read-only.
