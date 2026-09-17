---
title: The Plugin Verification Gate
description: The exact command set (tsc, build, vitest, screenshots:verify, lint) and the measured baseline each must clear — including the honestly-red lint baseline of 115 problems.
trigger_phrases:
  - "obsidian plugin verification gate"
  - "tsc noemit build vitest baseline"
  - "screenshots verify entry count"
  - "lint known baseline 115 problems"
  - "completion claim proof plugin"
importance_tier: normal
contextType: implementation
version: 0.1.0.0
---

# The Plugin Verification Gate

Five commands prove a change against this plugin. Four must be clean; the fifth carries a
recorded, pre-existing baseline that a change must not silently claim as clean. This reference is
the exact command set and the measured numbers each compares against.

---

## 1. OVERVIEW

### Core Principle

A completion claim is only as good as the gate that produced it. Run every command from the
worktree root, read its output and exit status, and compare counts against the measured baseline
below rather than assuming "passing" means "unchanged from before."

### When to Use

- Before any completion claim on a change to `src/`, `tools/`, or `styles.css`
- After a rename, to prove `tsc`, `build`, `vitest`, and `screenshots` all stayed clean
- When a reviewer asks "did lint get worse"
- Deciding whether a change needs `npm run screenshots` before `screenshots:verify` can pass

### Key Sources

- `package.json` `scripts` — the five command definitions
- `002-repo-convention-audit/audit.json` → `gateBaseline` — the measured numbers below
- `REPO RULES.md` — the plugin repository's own stated verification rule

---

## 2. THE COMMAND SET

```bash
npx tsc --noEmit              # type check, no emit
npm run build                 # node esbuild.config.mjs production -> main.js
npx vitest run                # or: npm test
npm run screenshots:verify    # node tools/screenshots/verify.mjs
npm run lint                  # eslint "src/**/*.ts" (excludes src/__tests__/**)
```

`npm run lint:all` runs the same ESLint config over the whole `src/` tree including test files —
use it when a change specifically touches `src/__tests__/`.

---

## 3. THE MEASURED BASELINE

Measured at commit `6b3d77e` from the worktree (`002-repo-convention-audit/audit.json`):

| Command | Exit | Result |
| --- | --- | --- |
| `npx tsc --noEmit` | `0` | clean |
| `npm run build` | `0` | clean; produces no tracked diff — the committed `main.js` matches a fresh build |
| `npx vitest run` | `0` | **386 passing** across **49 files** |
| `npm run screenshots:verify` | `0` | **180 entries**, all fresh |
| `npm run lint` | `1` | **115 problems** (100 errors, 15 warnings), 42 auto-fixable |

Only `lint` is non-zero at baseline, and that is expected — see §4.

---

## 4. THE LINT BASELINE IS RECORDED, NOT CLEAN

`npm run lint` fails at baseline with 115 problems. This is a **known pre-existing state**, not a
regression to fix incidentally. When reporting a completion claim:

- Never state or imply the lint gate is clean.
- Never claim a change reduced the problem count without re-running `npm run lint` and reporting
  the new count against 115.
- If a change intentionally fixes lint problems, name how many and which rule; if a change
  happens to touch a linted file without intending to change lint state, confirm the count is
  still 115 before and after, or explain the delta.

`eslint-plugin-obsidianmd`'s `recommended` config plus one custom rule
(`obsidianmd/prefer-file-manager-trash-file: error`, `eslint.config.mjs`) supply the rule set.

---

## 5. THE BUILD PRODUCES NO TRACKED DIFF

`npm run build` writes `main.js` at the repository root — the same file the release workflow
uploads (see `release/release-verification.md`). "Clean" for this command means both exit `0`
**and** `git status` showing no diff on `main.js` after the run; a diff means the committed
bundle is stale relative to `src/`, which is itself a finding worth reporting even though the
command's own exit code stays `0`.

---

## 6. SEQUENCING A RENAME OR STYLESHEET CHANGE

A class rename or a `styles.css` structural edit invalidates the screenshot manifest before it
invalidates anything else. Run in this order: `npm run build` → `npx vitest run` →
`npm run screenshots` (regenerate, not verify) → `npm run screenshots:verify` (now clean) →
`npx tsc --noEmit`. Running `screenshots:verify` before regenerating reports every affected
capture as stale, which is correct but not yet the "done" state.

---

## 7. RELATED REFERENCES

- `screenshot-harness.md` — what `screenshots:verify` actually checks and does not check.
- `release/release-verification.md` — the same gate plus the tag-driven release build.
- `data-layer.md`, `view-renderer-architecture.md` — where `vitest` coverage concentrates (49
  test files, largely co-located `*.test.ts`).
