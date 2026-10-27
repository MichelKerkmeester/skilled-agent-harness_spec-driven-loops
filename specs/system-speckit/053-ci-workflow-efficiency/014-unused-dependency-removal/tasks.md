---
title: "Tasks: Phase 14: unused-dependency-removal"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "unused dependency removal tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 14: unused-dependency-removal

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`S` is `.skilled/skills/sk-design/sk-design-md-generator`. `B` is `S/backend`. Every npm command runs in `B` on the default node.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the baseline (`B`). Verify: `npm ls deepmerge` prints the `puppeteer-extra-plugin-stealth@2.11.2` chain ending in `deepmerge@4.3.1`, `npm run typecheck` and `npm run build` exit 0, `npm test` prints `Test Files  20 passed (20)` and `Tests  176 passed (176)`, `npm audit` prints `found 0 vulnerabilities`.
- [x] T002 Confirm nothing uses either package (`S`). Verify: `git grep -n -I -P "playwright-extra(?!ct)|puppeteer-extra" HEAD -- . ':(exclude)**/package-lock.json'` prints 4 lines, `package.json:26`, `package.json:27`, `INSTALL-GUIDE.md:40` and `references/troubleshooting.md:41`. The import-specifier scan of `backend/scripts` and `backend/tests` lists `from 'playwright'` 9 times as the positive control and no `-extra` or stealth specifier. `grep -rlE "playwright-extra|puppeteer-extra|stealth" backend/dist` prints nothing.
- [x] T003 Keep a copy of the lockfile for the diff (scratch outside the repo). Verify: the copy has 2029 lines and 137 `packages` entries.
- [x] T004 Probe the output rule and the usage text before touching them (`B/dist`). Verify: `ls -d .opencode/specs specs` reports `.opencode/specs` missing, `resolveOutputPath("specs/...")` returns `ok:false` with the `.opencode/specs` reason, `resolveOutputPath(".opencode/specs/...")` returns `ok:true`, and `node dist/cli.js --help` prints `sk-design-md-generator/backend/scripts/extract.ts` without `sk-design/` and `.opencode/specs/<track>/<packet>/output`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Remove `playwright-extra` and `puppeteer-extra-plugin-stealth` from `dependencies` (`B/package.json`). Verify: `node -e` parses the file, and `grep -cE "playwright-extra|puppeteer-extra" package.json` prints 0.
- [x] T006 Regenerate the lockfile (`B/package-lock.json`). Verify: `npm --prefix backend install --package-lock-only` exits 0, the file drops from 2029 to 1516 lines, and a package-set diff reports 137 to 95 entries, 42 removed, 0 added, and only the root entry changed.
- [x] T007 Install clean from the lockfile (`B`). Verify: `npm --prefix backend ci` exits 0 with `added 70 packages`, and `ls node_modules | grep -E "playwright|puppeteer|deepmerge"` prints `playwright` and `playwright-core` only.
- [x] T008 Add two policy tests first, then run them against the old rule (`B/tests/output-policy.test.ts`). Verify: `npx vitest run tests/output-policy.test.ts` exits 1 with `Tests  1 failed | 14 passed (15)`, the failure being `accepts the repo-relative specs/<packet>/output path the README documents` with `expected false to be true`.
- [x] T009 Make `specs/` the spec root and keep `.opencode/specs` as a second allowed root (`B/scripts/output-policy.ts`). Verify: the same command exits 0, and with `tests/guided-run.test.ts` prints `Test Files  2 passed (2)` and `Tests  24 passed (24)`. A probe of `dist/output-policy.js` returns `ok:true` for `specs/...` and `.opencode/specs/...` and `ok:false` for `/etc/nope`.
- [x] T010 Correct the usage text, the two missing-output hints and the header comment (`B/scripts/extract.ts`, `B/scripts/cli.ts`), and the inside-the-skill case in `B/tests/guided-run.test.ts`. Verify: after `npm run build`, `diff` of the saved before and after `--help` output shows 2 changed lines, `node dist/cli.js --help | grep -c "\.opencode"` prints 0, and `grep -c "sk-design/sk-design-md-generator/backend/scripts/extract.ts"` prints 1. `rg -n "\.opencode" scripts` prints two lines, both in `output-policy.ts`, the comment and constant of the deliberate second root.
- [x] T011 Drop both removed names from the package list, name `ts-node` as a dev dependency, and step the doc version to 1.0.1.0 (`S/INSTALL-GUIDE.md`). Verify: `rg -n "playwright-extra|puppeteer-extra" INSTALL-GUIDE.md` prints nothing, and line 40 lists `playwright`, `css-tree` and `culori` as runtime dependencies and `ts-node` among the dev dependencies.
- [x] T012 Replace the stealth claim and step the doc version to 1.0.1.0 (`S/references/troubleshooting.md`). Verify: `rg -n "stealth" references/troubleshooting.md` prints one line, `crawls with plain Playwright and applies no stealth measures`.
- [x] T013 Write the changelog entry with a bullet for each of the output rule, the usage text and the `ts-node` wording, step `SKILL.md` to 1.1.6.0 and sync Hermes (`S/changelog/v1.1.6.0.md`, `S/SKILL.md`). Verify: `validate_document.py --json` prints `"total_issues": 0` for the entry, `INSTALL-GUIDE.md`, `troubleshooting.md` and `SKILL.md`, `hvr_scan.py` reports 0 hard blockers and no mechanical findings, `parent-skill-check.cjs` on `sk-design` exits 0 with `13d-packet-version` PASS, and the Hermes sync prints `Wrote 1 of 67 Hermes skill copies` (first run).
- [x] T014 Sweep the wrong skill path and the `.opencode/specs` examples out of the docs (`S/references/extraction-workflow.md`, `S/references/guided-run.md`, the 11 playbook pages under `S/manual-testing-playbook/`, and `S/INSTALL-GUIDE.md`), raise each changed doc's version, and add one changelog bullet. Verify: `rg -q 'skills/sk-design-md-generator/'` over `S` and `.hermes/skills/sk-design-md-generator` exits 1 (49 lines before). The same search for `skills/sk-design/sk-design-md-generator/` finds 89 lines in 24 files, which proves the search reads the tree. `rg -c '\.opencode'` over the install guide, references and playbook prints nothing (32 lines in 11 docs before), and over the skill lists only `output-policy.ts`, two test files and the changelog entry. Eleven docs moved from 1.0.0.x to 1.0.1.0 and two from 1.0.1.0 to 1.0.2.0. The playbook validator prints `PASS package=sk-design/sk-design-md-generator tier=FAIL_CLOSED scenarios=18 ... violations=0 warnings=0` before and after. `validate_document.py --json` prints `"total_issues": 0` for every changed doc, the playbook root with `--type reference`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Confirm the flagged copy is gone (`B`). Verify: `npm ls deepmerge` prints `(empty)` and exits 1, the exit code npm gives when nothing matches. `npm ls --depth=0` lists `@types/node`, `css-tree`, `culori`, `playwright`, `ts-node`, `typescript` and `vitest`.
- [x] T016 Run the whole backend gate on the clean install, from the final code (`B`). Verify: `npm run typecheck` exits 0, `npm run build` exits 0, `npm test` exits 0 with `Test Files  20 passed (20)` and `Tests  178 passed (178)`, and `npm audit` prints `found 0 vulnerabilities`. `node dist/cli.js --help` exits 0, and `require('./dist/crawl.js')` prints `crawl module loads`.
- [x] T017 Validate the folders. Verify: `validate.sh --recursive --strict` on this folder and on the parent print `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `npm ls deepmerge` prints `(empty)`, `--output specs/...` is accepted, and the backend gate passes 178 of 178
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
