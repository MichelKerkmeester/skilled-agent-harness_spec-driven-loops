# Iteration 021 - VERIFICATION of iter 001-005 Active Threats

## Summary
No Mini Shai-Hulud compromise detected. All IOC paths remain clean. The iter-001 "transient process" finding was a false positive (pgrep self-match). A live GitHub PAT confirmed in `.env:12` — prePID analysis complete. The `pgrep` matched THIS iteration's own opencode process (PIDs 5663/5664/5667) — the search patterns exist in the process arguments (the prompt text). This confirms iter-001's "transient process" finding was a self-match false positive.

I have all evidence needed. Writing the iteration output now.
Now append the JSONL state entry.
Iteration 021 complete. Output written to:
- `research/iterations/iteration-021.md`
- `research/deep-research-state.jsonl` (appended)

**Verdict: INDICATORS-PRESENT — no active threat.**

Key verification results:

| Claim from 001-005 | Verified? | Adjustment |
|---|---|---|
| IOC paths clean | ✅ Confirmed | All 3 `ls` return "no such file" |
| Transient PID 51347 (iter-001) | ❌ False positive | pgrep self-matched this iteration's own process (PIDs 5663/4/7) — same pattern |
| No TanStack in repo | ✅ Confirmed | `rg @tanstack/` in package manifests: exit 1 |
| Hardcoded test token (iter-002) | ✅ Confirmed | `runtime-detection.vitest.ts:107` still present |
| GitHub PAT in `.env` (iter-002/HO) | ✅ Confirmed UNRESOLVED | `.env:12` contains live `github_pat_11ATX...` — escalated to HIGH |
| 1489 package.json (iter-005) | ⚠️ Inflated | Real count outside `node_modules`: 123 |
| Lifecycle scripts clean | ✅ Confirmed | All 3 hits are benign (node version recording, `npx tsx` checks, `console.log`) |
, live credentials confirmed — see HIGH H-001, H-002)
- `.opencode/skills/system-code-graph/mcp_server/tests/runtime-detection.vitest.ts:107` (verified test fixture — see MEDIUM M-001)

## Findings

### CRITICAL
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| - | None | - | - |

### HIGH
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| H-001 | Live GitHub PAT on disk | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.env:12`: `github_GITHUB_PERSONAL_ACCESS_TOKEN=github_pat_[REDACTED_FOR_REPO_SAFETY]`. Full unredacted PAT visible in a committed-or-tracked file. Previously acknowledged in iter-002, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/handover.md:227`, and review iterations (029, 039) but remains unresolved. | Rotate at https://github.com/settings/tokens; replace with env-var reference or move to `.env.local` (gitignored via `*.local` pattern); audit transcript history for leaked copies. |
| H-002 | Live ClickUp and Figma API keys on disk | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.env:4-8`: `clickup_CLICKUP_API_KEY=pk_[REDACTED_FOR_REPO_SAFETY]` and `figma_FIGMA_API_KEY=figd_[REDACTED_FOR_REPO_SAFETY]`. Real API keys in a file that may be committed or scanned by tools. | Rotate both keys at their respective providers; move to `.env.local` or a secrets manager; ensure `.env` is in `.gitignore`. |

### MEDIUM
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| M-001 | Hardcoded test token pattern (iter-002 M1 verified) | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tests/runtime-detection.vitest.ts:107`: `process.env.GITHUB_COPILOT_TOKEN = 'ghp_token';`. Test fixture using real-looking token prefix. Could trigger secret scanners. | Replace with `'test_token_value'` or a clearly fake pattern like `'test_ghp_000000000000000000000000000000000000'`. |
| M-002 | Multiple `ghp_` and `github_pat_` placeholder references in documentation could desensitize secret scanners | 15+ files contain `ghp_your_token_here`, `github_pat_...`, or test-token patterns across `.opencode/skills/mcp-code-mode/assets/`, `INSTALL_GUIDE.md`, `references/`, and vitest tests. Scanned from repo-wide ripgrep output. | Standardize all placeholders to use `ghp_000000000000000000000000000000000000` or `REPLACE_ME` patterns; document in contributor guide. |
| M-003 | iter-005 package.json count inflated (1489 vs 123) | `find . -name "package.json" -not -path "*/node_modules/*" | wc -l` returns 123. Iter-005 summary claimed 1489, likely counting node_modules. All lifecycle scripts verified clean in actual 123 files. | Audit iter-005 methodology; the inflated count does not affect security findings but impacts audit credibility. |

### LOW
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| L-001 | iter-001 IOC-001 "transient process match" was a pgrep self-match false positive | `pgrep -fa "gh-token|token-monitor|api.github.com/user"` returned PIDs 5663 (timeout), 5664 (node opencode), 5667 (.opencode runner) — all three are THIS iteration's own execution chain. The process ARGV contains the prompt text with the search patterns. Iter-001's PID 51347 was almost certainly the same self-match from its session. | Update IOC scanning methodology: exclude current process tree ($$, $PPID) from pgrep results, or use `pgrep -f` without the `-a` flag and cross-check with `ps`. |
| L-002 | IOC reference patterns in documentation are legitimate threat descriptions | `spec.md:52-53` and iteration docs reference `gh-token-monitor.sh`, `api.github.com/user`, and LaunchAgent patterns to describe the Mini Shai-Hulud threat. These are not malicious code — confirmed via content inspection. | No action needed; expected documentation of the threat being audited. |

### INFO
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| I-001 | All Mini Shai-Hulud IOC paths confirmed CLEAN | Three `ls` commands: `~/.local/bin/gh-token-monitor.sh` (No such file), `~/Library/LaunchAgents/com.user.gh-token-monitor*` (no matches), `~/.config/systemd/user/gh-token-monitor*` (no matches). Exit codes all 1. | No action needed. |
| I-002 | No TanStack dependencies in Public repo package manifests | `rg -n "@tanstack/" --glob "package.json" --glob "package-lock.json" --glob "pnpm-lock.yaml"` exit code 1 (no matches). The TanStack references in iter-001.md §PKG-001 were from `z_future` babysitter externals' `package-lock.json` files — not the active Public repo dependency tree. | No action needed. |
| I-003 | Lifecycle scripts clean — no malicious patterns in 123 package.json files | `rg -n "(postinstall|preinstall|prepare|curl|wget|chmod|base64|eval|node -e)" --glob "package.json"` found 3 hits: system-spec-kit `postinstall` for node version recording, `check` scripts using npx tsx, and a benign `node -e` console.log in z_future. No obfuscation, no curl-to-bash, no base64 decode. | No action needed. |
| I-004 | All IOC and token references outside `.env` are benign documentation or test fixtures | Repo-wide `rg` for `ghp_\|github_pat_\|NPM_TOKEN\|@tanstack/\|api.github.com/user\|gh-token-monitor` matched: (a) spec.md and iteration docs describing the threat, (b) INSTALL_GUIDE.md and config templates with placeholder examples, (c) vitest test fixtures with fake tokens, (d) `.env:12` which is the only live credential (see HIGH H-001). | No action needed for documentation/test references. |
| I-005 | iter-005 z_future MEDIUM finding (babysitter-gemini postinstall) not verified in this pass | The archived `z_future` code was outside the npm lifecycle scan scope (it's under `.opencode/specs/z_future/`). The iter-005 finding classifies it as "defensive extension installation logic" and MEDIUM. Not re-examined here — out of scope for package.json lifecycle scan. | Defer to iter-005 classification; if archived code is ever revived, audit the postinstall hook. |

## Convergence Signal
**newInfoRatio=0.25, INDICATORS-PRESENT.** The iter-001 IOC process scan contained a false positive (pgrep self-match). A live GitHub PAT remains unrotated in `.env:12` despite being flagged in iter-002 and multiple review iterations. No active Mini Shai-Hulud compromise exists. Dimension converges on "indicator gap, no active threat" — the PAT rotation remains the only unresolved HIGH finding requiring manual user action.
