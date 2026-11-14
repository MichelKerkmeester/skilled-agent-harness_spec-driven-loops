---
title: "Scripts: drift-guard gate runner"
description: "Single entry point that runs all sk-code drift guards as one completion gate."
version: 1.0.4.0
---

# Scripts

---

## 1. OVERVIEW

`scripts/` holds the one drift-guard entrypoint for the `sk-code-skilled` surface. It runs four drift guards (alignment-drift, stack-folder, router-sync, doc-claims) in sequence and exits non-zero if any fails, so a completion gate never has to remember separate commands. The router-sync guard (`assets/scripts/verify-router-sync.cjs`) runs as five legs. [`alignment-verification-automation.md`](../references/shared/alignment-verification-automation.md) lists the four checks behind them, what covers each and what the orphan-doc leg does when Git is missing. The doc-claims guard (`assets/scripts/verify-doc-claims.cjs`) checks the sk-code prose: path references resolve, no retired packet name remains, every surface count matches the surface modes in `mode-registry.json` and the `ROUTER.md` load-tier claims match `DEFAULT_RESOURCE`.

---

## 2. CONTENTS

```text
scripts/
+-- run-all-drift-guards.sh
`-- tests/                  # nine test files, one table row each below
```

| File | Purpose |
|------|---------|
| `run-all-drift-guards.sh` | Runs `verify_alignment_drift.py --check-router`, `verify_stack_folders.py`, `verify-router-sync.cjs --checks 1a,1b,2,3,4` and `verify-doc-claims.cjs` in order, printing a PASS/FAIL line per guard; a comment after the router-sync guard records what it covers and what stays in CI. The script counts each guard's `[WARN]` lines and shows the total in the summary without failing the gate |
| `tests/verify-router-sync.test.cjs` | Builds a throwaway hub and proves router check 1b stays quiet for a doc reached through a surface symlink, skips a Git-ignored doc, reports an untracked doc that is not ignored, runs without `--checks`, proves check 2 reads the `ROUTER.md` shared-controls block and proves check 2 fails when a mirrored surface's keyword copies or a registry alias disagree with `hub-router.json`. Run it with `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs`. |
| `tests/verify-doc-claims.test.cjs` | Builds a throwaway hub and proves each check of `verify-doc-claims.cjs` passes on a clean tree and fails on its own known-bad input, and that an allowlisted line stays quiet. Run it with `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs`. |
| `tests/run-all-drift-guards.test.cjs` | Proves the wrapper's pass, warn and fail aggregation, including the exit 1 path. |
| `tests/verify-router-sync-git-timeout.test.cjs` | Proves the orphan-doc leg bounds its `git check-ignore` call, with a stub git first on `PATH`. |
| `tests/declared-surfaces-parity.test.cjs` | Proves the replay library and the plugin declare the same surfaces for the live hub. |
| `tests/quality-checklist-map.test.cjs` | Proves the `SKILLED` quality checklist map in `SKILL.md` matches the quality defaults and the surface declarations. |
| `tests/router-stage-two-quality.test.cjs` | Proves stage-two intent selection for a restraint request. |
| `tests/router-file-resolver.test.cjs` | Proves the machine router resolver picks the one document that declares a skill's router. |
| `tests/router-replay-lib-resolver.test.cjs` | Proves `parseRouter` in the replay library reads the document the resolver names. |

---

## 3. VALIDATION

Run from any working directory, the script resolves its own paths:

```bash
bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh
```

Expected: a `PASS: router-sync` line, a `PASS: doc-claims` line, an output ending with `run-all-drift-guards: all 4 guards PASSED` followed by `, N non-blocking warning(s)` when any guard printed `[WARN]` lines, and exit code 0.

---

## 4. RELATED

- [`sk-code-skilled SKILL.md`](../SKILL.md)
- [`sk-code-skilled README.md`](../README.md)
