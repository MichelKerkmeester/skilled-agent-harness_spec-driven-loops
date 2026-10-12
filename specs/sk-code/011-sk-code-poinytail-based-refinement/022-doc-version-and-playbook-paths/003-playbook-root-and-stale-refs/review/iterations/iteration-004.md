# Deep Review — Iteration 004 (D4 Security)

- Run: run-001 · Session: 2026-10-12T10:01:23.529Z · Generation 1 · Lineage: new
- Target: the playbook root and stale reference commits `b4d4e90192..HEAD` on `worktrees/121-playbook-root-refs` (56 files) — security pass over the validator's new root-file check, the rewritten operator commands and the corrected config examples

## Dimension

Security. Four dispatch questions: (1) can a root-file token resolve outside the repository or through a symlink in a way the scenario check would not; (2) does any rewritten command run in a different directory, with a different binary, or touch something destructive; (3) does the TOML example invite putting a secret in a committed file; (4) was any secret, token or personal absolute path introduced?

## Files Reviewed

- Validator and test: `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` — root call site [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:757], `backtickPathChecks` [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:401], token filter [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:416], base resolution [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:418], `pathPresent` [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:396], `isExpectedUnresolved` [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:383]; new test assertion [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:164]
- Rewritten operator commands: DAC-002 scenario command and note [SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/manual-testing-playbook/runtime-routing-and-rename/advisor-routes-council-prompts-to-skill.md:49] and [SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/manual-testing-playbook/runtime-routing-and-rename/advisor-routes-council-prompts-to-skill.md:51]; cli-opencode root summaries [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/manual-testing-playbook.md:370] and [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/manual-testing-playbook.md:451]
- Config example and its destination: `codex-tools.md` snippet [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/references/codex-tools.md:142], header [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/references/codex-tools.md:139], path claim [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/references/codex-tools.md:132]; the repo's tracked `.codex/config.toml` (16 lines, no `*_KEY`/`*_TOKEN`/`*_SECRET` identifier, `git check-ignore` reports it not ignored)
- Diff-wide scans over `git diff b4d4e90192..HEAD`: credentials (`secret|password|bearer |private key|/Users/|/home/<user>|ghp_|github_pat_|sk-[A-Za-z0-9]{20,}`), other absolute-path shapes (`/private/|/var/|/opt/|/Volumes/|C:\Users|home/<user>/`), and destructive or privileged flags (`--dangerously|--yolo|--full-auto|bypass|skip-permissions|--no-sandbox|chmod|777|sudo`)
- Release and spec surfaces: `sk-doc` changelog [SOURCE: .skilled/skills/sk-doc/changelog/v2.3.9.0.md:15]; spec checklist row [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/tasks.md:142]

## Findings by Severity

### P0 — none

No P0 findings this iteration.

### P1 — none

No P1 findings this iteration.

### P2

#### R4-P2-001 [P2] Codex MCP config snippet puts a literal key slot in a tracked project config file

- **Case:** an operator copies the `[mcp_servers.my-server]` snippet from the cli-codex reference into the repo's `.codex/config.toml` — the first path the snippet names — and replaces `<your key>` with a real credential; the tracked file is then committed with the key.
- **File:** [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/references/codex-tools.md:142] (`env = { MY_API_KEY = "<your key>" }`), with the project path named first at [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/references/codex-tools.md:132].
- **Evidence (OBSERVED):** the new snippet writes a literal value (`"<your key>"`) into the env table while naming `.codex/config.toml` before `~/.codex/config.toml`; in this repository `.codex/` is a tracked directory and `git ls-files .codex/config.toml` confirms the file is tracked while `git check-ignore -v .codex/config.toml` prints nothing (not ignored); the file currently carries no key-named field, so no secret exists today. The pre-change form suggested an indirection (`"MY_API_KEY": "${MY_API_KEY}"`), which JSON would not interpolate — the new form is the accurate Codex TOML shape, but it is also the form that reads as "paste the key here".
- **Counterevidence sought:** the user-level `~/.codex/config.toml` is offered in the same line, `<your key>` is an obvious placeholder, and `my-server`/`./mcp-server.js` mark the block as illustrative. All reduce likelihood; none removes the copy-paste path into a tracked, non-ignored file, and no adjacent line says to keep real keys out of the committed config.
- **Alternative explanation considered:** documentation conventions assume operators keep secrets in user scope. That is the mitigation, not a defense: the snippet itself places the value slot in a committable file, and the secret-hygiene note is absent.
- **User impact:** low, documentation-level; a credential pasted there can be committed and pushed, with no `.gitignore` cover in this repo. No runtime or checker effect.
- **Finding class:** instance-only (one config snippet; no other `env = {` example exists under cli-codex).
- **Scope proof:** `grep -rn 'env = {' .skilled/skills/cli-external-orchestration/cli-codex/` returns only the reviewed line; the other `mcp_servers` mentions ([SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/references/codex-tools.md:132], `:161`, `:320`) carry no value.
- **Affected surface hints:** ["cli-codex references/codex-tools.md", ".codex/config.toml", "SR-1 successor form"]
- **riskScore:** 2 (advisory only)
- **Confidence:** medium (doc-level invitation; no secret present in the tree).
- **Upgrade trigger:** a real key committed to `.codex/config.toml`, or the placeholder gaining a real-looking value → P1. **Downgrade trigger:** a one-line "keep real keys out of the committed project config" note under the snippet closes it to no finding.
- **Recommendation:** add that one-line note (prefer `~/.codex/config.toml` or an environment-sourced value) beneath the snippet; leave the snippet's TOML shape unchanged.

## Verified Clean (ruled out this iteration)

1. **The root-file check adds no new resolution capability (OBSERVED, direct read).** `validatePackage` now calls `backtickPathChecks(rootText, rootPath, playbookRoot, repoRoot, ROOT_FILENAME)` [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:757] — the same function scenarios already called with the same filter and bases. The filter does not exclude `..` [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:416], so a token can resolve outside the repository through a base [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:418], and `pathPresent` accepts any symlink — dangling or pointing outside — via `lstatSync` [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:396]. Both semantics predate this change and govern root and scenario calls identically, so the root check can escape exactly as far as the scenario check could — not further, and not in a new way. The consequence is bounded: the outcome is a `warning` [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:419], no file content is read and nothing is written. Answer to dispatch question 1: no new escape; the residual false-negative surface is pre-existing.
2. **The symlink leniency is deliberate and documented (OBSERVED).** The comment block states the link itself decides resolution for report-only backticked paths while the markdown-link check stays strict — and indeed `PATH_OUTSIDE_REPO` / `PATH_SYMLINK_OUTSIDE_REPO` remain errors on the link path [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:349] and [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:358]. The new test pins the report-only behavior for the root file [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:164]. No finding.
3. **The rewritten DAC-002 command carries no new privilege or destructive surface (OBSERVED).** It runs the repo-local `node_modules/.bin/vitest` symlink (→ `../vitest/vitest.mjs`) with no shell-escape beyond `cd`, no flags that weaken sandboxing or delete anything, and its config claim is true: `vitest.config.ts` and `tests/scorer/native-scorer.vitest.ts` exist at the named directory, and the prior iteration observed the command exit 0 with `1 passed | 21 skipped` (SR-4). The CWD and filter moved; the binary class did not. The diff-wide scan for `--dangerously|--yolo|--full-auto|bypass|skip-permissions|--no-sandbox|chmod|777|sudo` returns nothing. Answer to dispatch question 2: different directory, same class of local binary, nothing destructive.
4. **No secret, token or personal absolute path was introduced (OBSERVED).** The credential scan over the full diff returns only the checklist text `CHK-030 [P0] No hardcoded secrets` [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/tasks.md:142], which holds; the absolute-path scan returns nothing; no `/Users/`, home-directory, private-key or token-shaped string appears in any changed line. Answer to dispatch question 4: none.
5. **The two remaining `codex/settings.json` strings are history, not live references.** They sit in a changelog (`system-skill-advisor/changelog/v0.7.0.0.md`) and a dated benchmark report, both outside this diff; the strategy's non-goals exclude files outside the diff. Not a security surface and not a finding.
6. **The release changelog carries nothing sensitive.** It describes the root-file check as report-only [SOURCE: .skilled/skills/sk-doc/changelog/v2.3.9.0.md:15] and adds a spec-folder pointer; no credentials, tokens or developer paths.

## Traceability Checks

- **core `spec_code` — pass.** Every security-relevant change traces to a ledger row: the root check to RR-1, the Codex config correction to SR-1; the spec's own security row CHK-030 is checked and holds on the diff.
- **core `checklist_evidence` — pass (spot).** CHK-030 was re-derived by the credential scan rather than trusted; the remaining RR/SR rows were re-executed in iteration 3 and were not re-run here.
- **overlay `agent_cross_runtime` — partial.** SR-1's `.codex/config.toml` successor form is verified in place; the snippet itself now carries the R4-P2-001 advisory.

## Evidence Log

| # | Check | Command (verbatim where practical) | Result (OBSERVED) |
|---|-------|------------------------------------|-------------------|
| 1 | Root call site | `grep -n "backtickPathChecks(rootText" validate-playbook-package.cjs` | line 757, same signature as scenario calls |
| 2 | Token filter and resolution | read `validate-playbook-package.cjs:383-424` | no `..` exclusion; `path.resolve` over skill/playbook/repo bases; `warning` only |
| 3 | Tracked project config | `git ls-files .codex/config.toml; git check-ignore -v .codex/config.toml; wc -l < .codex/config.toml` | tracked, not ignored, 16 lines; no `*_KEY`/`*_TOKEN`/`*_SECRET` identifier |
| 4 | Rewritten binary and test | `ls -la node_modules/.bin/vitest tests/scorer/native-scorer.vitest.ts` from the advisor runtime; `ls .../vitest.config.ts` | symlink → `../vitest/vitest.mjs`; test file and config present |
| 5 | Destructive/privileged flags | `git diff … | grep -E '--dangerously|--yolo|--full-auto|bypass|skip-permissions|--no-sandbox|chmod|777|sudo'` | no output |
| 6 | Credentials and personal paths | `git diff … | grep -inE 'secret|password|bearer |private key|/Users/|/home/<user>|ghp_|github_pat_|sk-[A-Za-z0-9]{20,}'` and the `/private/|/var/|/opt/|/Volumes/|C:\Users` scan | only `CHK-030 … No hardcoded secrets`; second scan empty |
| 7 | DAC-002 command | prior iteration's SR-4 re-execution (this iteration is read-only; not re-run) | exit 0, `1 passed | 21 skipped` |

## Verdict

PASS. No P0 and no P1 findings. One new P2 (R4-P2-001, advisory only); cumulative open findings are four P2. `hasAdvisories=true`.

## Next Dimension

Maintainability (iteration 5 of 5).

Review verdict: PASS
