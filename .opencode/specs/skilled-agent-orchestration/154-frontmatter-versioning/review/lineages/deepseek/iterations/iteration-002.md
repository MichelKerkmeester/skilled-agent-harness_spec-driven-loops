# Iteration 2: Security

## Focus
D2 Security — reviewing the frontmatter-version engine, validators, and CI gate for injection vulnerabilities, secrets exposure, trust boundaries, and unsafe YAML manipulation.

## Scorecard
- Dimensions covered: security
- Files reviewed: 4 (frontmatter-version.mjs, check-frontmatter-versions.sh, quick_validate.py, package_skill.py)
- New findings: P0=0 P1=0 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.21

## Findings

### P2, Suggestion
- **F007**: Shell wrapper `check-frontmatter-versions.sh` dispatches to `node` without verifying that the `frontmatter-version.mjs` script exists. `set -euo pipefail` catches the failure at runtime, but a missing script produces a cryptic "No such file" error rather than a clear diagnostic. `check-frontmatter-versions.sh:12`

- **F008**: `maxBuffer: 64 * 1024 * 1024` (64MB) for `git log --follow --numstat` output is generous but heads-down for repos with very large per-file histories. A single file with >64MB of git log output would crash the engine with an unhandled ERR_CHILD_PROCESS_STDIO_MAXBUFFER. No real corpus file approaches this today, but a pathological re-commit history could. `frontmatter-version.mjs:69`

- **F009**: `reconcile` mode on `skill-md` auto-updates the version unconditionally in apply mode (`r.fileClass === 'skill-md'`). While designed behavior (SKILL.md reconciles up to anchor), this means `apply` silently overwrites a human-set SKILL.md version without the `--update` flag that other doc classes require. If an operator lacks `OPTSEC` awareness, they could accidentally shift a SKILL.md version. The design is documented, but asymmetry with non-skill-doc apply paths deserves an explicit warning. `frontmatter-version.mjs:411`

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | carried forward from iteration 1 | No new spec_code checks from security pass |
| checklist_evidence | notApplicable | hard | — | No checklist at parent |

## Assessment
- New findings ratio: 0.21 (3 P2 at weight 1 = 3, total possible = 14 points max, but relative to FINDINGS this iteration, all 3 new at weight 1 = 3 out of ~14 possible: 3/(3+0) ≈ 1.0 but severity-weighted: 3/14 = 0.21)
- Dimensions addressed: security
- Novelty justification: All findings are first-time in this dimension. The engine emerged from security review largely clean — uses `execFile` (not `exec`), no user-controlled git arguments, no network calls, write scope is bounded by `inScope()`. The P2s are audit advisories, not blockers.
- No P0/P1 security findings: the trust boundary is internal (local CI tool), no credentials are handled, all git commands are hardcoded, version values are regex-validated before insertion.

## Ruled Out
- YAML injection through version value: Ruled out — `derivedVersion` is always `X.Y.Z.W` (digits+periods only via `tupleStr`), making it safe YAML without quoting. `frontmatter-version.mjs:114-116`
- Git command injection: Ruled out — all git commands use `execFile`/`execFileSync` with hardcoded argument arrays; no user input reaches the command string. `frontmatter-version.mjs:55,66-69`
- Arbitrary file write: Ruled out — writes only target files discovered by `inScope()` which restricts to markdown files under `.opencode/skills/`. `frontmatter-version.mjs:208-219`
- Secrets exposure: Ruled out — no API keys, tokens, or credentials anywhere in the engine or validators.

## Dead Ends
- None in this iteration.

## Recommended Next Focus
D3 Traceability — verify spec/code alignment between the versioning standard (sk-doc/references/frontmatter_versioning.md), the engine implementation, and the parent spec claims. Check whether the engine's derivation rules match the documented standard, and whether cross-reference protocols (spec_code, checklist_evidence) can be validated from the phase-parent level.

Review verdict: PASS
