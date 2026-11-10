### V48
VERDICT: CONFIRMED
SEVERITY: agree P1
EVIDENCE: `.skilled/commands/doctor/assets/agents-md-manifest.json:1068` - the recorded body still includes Hermes; `--check` reports the derived key mismatch and that the recorded body is no longer released.
COMMAND: `node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check` -> exit 1
CORRECTED CLAIM: -

### V49
VERDICT: CONFIRMED
SEVERITY: agree P1
EVIDENCE: `.github/workflows/agent-mirror-sync.yml:57` - this workflow runs the agent mirror checker; `rg -n 'agents-md' .github/workflows` found no workflow references.
COMMAND: `rg -n 'agents-md' .github/workflows` -> exit 1
CORRECTED CLAIM: -

### V50
VERDICT: CHANGED
SEVERITY: agree P1
EVIDENCE: `.skilled/changelog/skilled/v4.0.1.0.md:102` - it says the advisor suggests doctor commands; the queried CLI returned `degraded: true` and `recommendations: []`, so no doctor command was suggested.
COMMAND: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"my hooks are not firing, what do I run"}' --format json` -> exit 0
CORRECTED CLAIM: The query returns no recommendations in degraded local-scorer mode; the “top three below 0.13” detail is not evidenced by this output.

### V51
VERDICT: CHANGED
SEVERITY: agree P1
EVIDENCE: `.skilled/commands/doctor/scripts/symlink-engine.cjs:1791-1801` - after building and emitting the check report, the valid check path returns literal `0`; the probe reported `.skilled` as missing and still exited 0.
COMMAND: `node .skilled/commands/doctor/scripts/symlink-engine.cjs check --root /var/empty --json` -> exit 0
CORRECTED CLAIM: A valid check invocation returns 0 regardless of reported drift; argument or context errors can still exit nonzero.

### V52
VERDICT: REFUTED
SEVERITY: propose P2 because the globally configured hooks resolve to active hook sources, and the checker explicitly accepts shared `core.hooksPath` installs.
EVIDENCE: `.skilled/commands/doctor/scripts/git-setup-check.cjs:350-353` - the checker documents shared `core.hooksPath` as an accepted install; lines 384-399 accept matching real paths and pass when there are no issues. Git resolved hooks to the global directory.
COMMAND: `git -C . rev-parse --git-path hooks` -> exit 0
CORRECTED CLAIM: -

### V53
VERDICT: CONFIRMED
SEVERITY: agree P1
EVIDENCE: `.github/workflows/sk-git-script-tests.yml:50-51` - the job runs only `worktree-naming.test.sh`; the four named suites are present in the tests directory but absent from workflow references.
COMMAND: `rg -n 'commit-id-naming\.test|migrate-legacy-branch-names\.test|stamp-branch\.test|validate-message-git-timeout\.test' .github/workflows` -> exit 1
CORRECTED CLAIM: -

### V54
VERDICT: CHANGED
SEVERITY: propose P2 because the parity check omits Pi, but the inspected Pi body currently matches the canonical body.
EVIDENCE: `.skilled/bin/lib/mirror-sync-verify.cjs:50-54` - only OpenCode, Claude, and Codex are listed; `.opencode/agents` is a symlink to `.skilled/agents`. The pure comparison found Pi’s raw file length differs, but its extracted body matches.
COMMAND: `node -e` pure body comparison and `wc -c` -> exit 0
CORRECTED CLAIM: The gate checks three runtime trees and omits Pi; the inspected Pi file differs in raw bytes, but no body drift was found in the sampled `code.md`.

### V55
VERDICT: CONFIRMED
SEVERITY: propose P2 because this is a misleading status warning; the hook still resolves to the same source through the alias.
EVIDENCE: `.skilled/scripts/install-git-hooks.sh:96-104` - `resolve_target` returns the alias path without canonicalizing it; line 136 compares that string with the `.skilled` source path. Status printed `SHADOWED` for the installed links.
COMMAND: `GIT_CONFIG_GLOBAL=/dev/null bash .skilled/scripts/install-git-hooks.sh --status` -> exit 0
CORRECTED CLAIM: -

BATCH DONE