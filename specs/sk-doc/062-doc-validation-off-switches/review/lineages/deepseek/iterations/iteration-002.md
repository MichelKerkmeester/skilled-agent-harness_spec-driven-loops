---
title: "Deep Review Iteration 002 — security"
trigger_phrases: []
---

# Iteration 2: D2 Security — parser surface, injection refusal, enforcement boundary

## Focus

Dimension: security. Files read and assessed: `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` (the fourth reader), `.skilled/hooks/shared/hook-flags.sh` (eval surface), `.skilled/hooks/shared/hook-flags.cjs` (name lookup), `.skilled/skills/sk-doc/shared/scripts/validation_switch.py` (file parsing), `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` (argument handling and report emission), `.skilled/hooks/hook-flags.env.example`, `.env.example` (bypass-switch reference), plus repo-wide sweeps for readers, setters and CI references.

Scope investigated: the injection surface around the shell resolver's `eval`, the four readers' parse behavior on hostile input (quotes, comments, tabs, BOM, CRLF), the "CI keeps enforcing" claim, the `hook-flags.env` ignore status, and the write-free claim (NFR-S02).

## Scorecard

- Dimensions covered: security
- Files reviewed: 7 primary + 3 repo-wide sweeps
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0

## Findings

### P0, Blocker

None.

### P1, Required

None.

### P2, Suggestion

- **F002**: The repository's central bypass-switch reference (`.env.example` §16 "Git-hook bypasses") documents every sibling bypass but not the two validation switches this packet added, `.env.example:395-404`. Evidence: `.env.example:400-404` lists `SPECKIT_SKIP_COMMIT_MSG_VALIDATE`, `SPECKIT_SKIP_ROUTE_REMINT`, `SPECKIT_SKIP_PREPUSH_SKILL_GATE` and `SPECKIT_SKIP_PREPUSH_TRACK_GATE` as the git-hook bypass family, and a repo-wide search for `SPECKIT_SKIP_VALIDATION`/`SKDOC_SKIP_VALIDATION` in `.env.example` returns zero lines (positive control: the same pattern matches `validate.sh:75,125,129`). `SPECKIT_SKIP_VALIDATION` exists precisely to unblock the pre-commit spec re-mint gate, which is the family this section documents. The packet's own docs list (`spec.md:106-115`) does not include `.env.example`, so this is a discoverability gap rather than a missed requirement row (REQ-007 names the docs it updated). Recommendation: add the two switch lines to `.env.example` §16 beside the other bypasses, or record the omission as intentional. Note: `.env.example` sits outside the 127-file review manifest; it is cited here as evidence for the documentation-completeness observation on the reviewed change, not as a review target.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | not-run (scheduled) | hard | - | Iteration 3 owns the spec-vs-implementation pass |
| checklist_evidence | not-run (scheduled) | hard | - | Iteration 3 owns the evidence pass |

## Claim Adjudication

No new P0 or P1 findings in this iteration — no typed packets required. F002 is P2 and does not gate convergence.

## Assessment

- New findings ratio: 1.0 (one fully-new P2)
- Dimensions addressed: security
- Novelty justification: the security surface was read end to end. Verified by reading:
  - **Injection**: `hook_flag_on` refuses any name that is empty, digit-led or outside `[A-Za-z0-9_]` before the resolver's `eval` (`.skilled/hooks/shared/hook-flags.sh:55-60`), and the only other caller of `__hook_flags_resolve` in the repository passes a literal (`worktree-guard.sh:30`, `hook_enabled`'s constructed name at `hook-flags.sh:65` transforms every non-alphanumeric to `_`). The pinning test spawns `X}; touch <marker>; #` and asserts the marker is never created (`hook-flags.test.cjs:184-187`). No unguarded eval path found in the repo sweep.
  - **Parse safety**: the file is parsed as `KEY=value` text in all four readers — no sourcing, no evaluation (`hook-flags.sh:44-48` uses `grep`/`sed`; `hook-flags.cjs:107-133` uses `readFileSync`; `validation_switch.py:57-84` uses `read_text`; `check-dist-staleness.sh:28-52` uses `open`). NFR-S01 holds.
  - **Write-free**: the skip paths only print and exit (`.skilled/skills/sk-doc/shared/scripts/validation-switch.cjs:64-72`, `validation_switch.py:110-123`, `validate.sh:155-173`). NFR-S02 holds.
  - **Fail-open**: missing/unreadable file yields no values in all four readers (`hook-flags.cjs:111-113`, `validation_switch.py:65-68`, `check-dist-staleness.sh:51-52`, shell `:43-45`). NFR-R01 holds.
  - **CI boundary**: a repo-wide search over `.github` for `SKIP_VALIDATION|HOOK_FLAGS_CONFIG|SPECKIT_VALIDATION` exits 1 with zero matches (positive control on `validate.sh` shown); `.gitignore:352` ignores `.skilled/hooks/hook-flags.env` (`git check-ignore -v` resolves to that line) and `git ls-files` shows it untracked. REQ-006 / AC-006 hold.
  - **Env precedence boundary**: environment-first with set-but-empty winning is implemented identically in all three resolver mirrors (`hook-flags.cjs:181-193`, `hook-flags.sh:37-42`, `validation_switch.py:87-92`) and pinned by tests from either source.
- Report emission is injection-safe: the skip reason is passed to `node -e` as argv, not interpolated into the JavaScript source (`validate.sh:142-150`), and the report is built with `JSON.stringify`.

## Ruled Out

- "`eval` in the shell resolver is reachable with an attacker-controlled name": ruled out — the public entry validates the name, and the repo-wide caller sweep found only literal or constructed names.
- "The flags file can be sourced or evaluated": ruled out — all four readers parse text only.
- "A CI workflow can see either switch": ruled out — zero matches in `.github`, and the file is untracked and ignored.
- "A skip writes a file": ruled out — skip paths print and exit only.
- "A missing flags file turns a switch on": ruled out — fail-open to `{}` in all four readers.

## Dead Ends

- Executing the injection probe or the suites directly: not attempted (lineage containment). Evidence is the guard code plus the pinning tests, read, not run.

## Recommended Next Focus

D3 traceability: run `spec_code` (REQ-001..REQ-008 against the implementation just read) and `checklist_evidence` (tasks.md verification rows and acceptance-criteria AC-001..AC-008 against their cited evidence), plus the 061/062 packet-doc claims and the changelog entries.

Review verdict: PASS
