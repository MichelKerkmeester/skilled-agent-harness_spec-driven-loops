---
title: "Implementation Summary"
description: "The sk-design-md-generator backend no longer declares playwright-extra or puppeteer-extra-plugin-stealth, so a fresh install drops 42 packages including the deepmerge copy behind Dependabot alert 1410. The output rule now accepts the documented specs/ folder, and the help text and guides name real paths and packages."
trigger_phrases:
  - "unused dependency removal implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/014-unused-dependency-removal"
    last_updated_at: "2026-10-27T22:50:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Removed two unused dependencies, fixed the output rule and help paths"
    next_safe_action: "None; the conductor lands the commit"
    blockers: []
    key_files:
      - ".skilled/skills/sk-design/sk-design-md-generator/backend/package.json"
      - ".skilled/skills/sk-design/sk-design-md-generator/backend/scripts/output-policy.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-27-014-unused-dependency-removal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-unused-dependency-removal |
| **Completed** | 2026-10-27 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The md-generator backend no longer installs the stealth plugin chain, so the `deepmerge` 4.3.1 copy behind Dependabot alert 1410 is gone from its dependency tree. The crawl is unchanged, because nothing imported either removed package and the crawler always ran on plain `playwright`. The backend also now accepts the `--output specs/<track>/<packet>/output` command its README documents, which its own output rule used to refuse.

### Dependency removal

`playwright-extra` and `puppeteer-extra-plugin-stealth` left `backend/package.json`. The regenerated lockfile lost 42 package entries and gained none. The only route to `deepmerge` ran through `puppeteer-extra-plugin-stealth`, then `puppeteer-extra-plugin-user-preferences`.

### Output rule and usage text

`output-policy.ts` allowed writes only under `<repo>/.opencode/specs`, a folder this repository does not have, so the documented `specs/` command stopped before the crawl. The spec root is now `<repo>/specs`, and `.opencode/specs` stays allowed because the install guide, `guided-run.md` and the playbooks still show commands that use it. The skills directory is still refused first. The usage text, the two missing-output hints and the `cli.ts` header comment now print the real script path, `.skilled/skills/sk-design/sk-design-md-generator/backend/scripts/extract.ts`, and the `specs/` folder.

### Docs that named the wrong things

The install guide listed both removed packages as runtime dependencies, and listed `ts-node` there too, though it is a dev dependency. It now lists the three real runtime packages and names `ts-node` among the dev dependencies. The troubleshooting page said the tool ships stealth. It now says the crawl runs on plain Playwright with no stealth measures, so some sites block it. Both docs moved from their old edition to 1.0.1.0.

### Doc sweep

Thirteen docs (`references/extraction-workflow.md`, `references/guided-run.md` and 11 playbook pages) printed `.skilled/skills/sk-design-md-generator/...`, a script path that does not exist, so a pasted command failed. They now print `.skilled/skills/sk-design/sk-design-md-generator/...`. Eleven docs, the install guide among them, told the reader to write output under `.opencode/specs`, and they now show `specs/<track>/<packet>/output`. Each changed doc's own version went up, and the playbook package still validates with no violations or warnings.

### Release

The mode is now v1.1.6.0 with its changelog entry. It skips v1.1.5.0 because another lane holds that number, and origin/main stops at v1.1.4.0.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-design/sk-design-md-generator/backend/package.json` | Modified | Drop the two unused dependencies |
| `.skilled/skills/sk-design/sk-design-md-generator/backend/package-lock.json` | Modified | Regenerated, 42 entries removed |
| `.skilled/skills/sk-design/sk-design-md-generator/backend/scripts/output-policy.ts` | Modified | `specs/` is the spec root, `.opencode/specs` stays allowed |
| `.skilled/skills/sk-design/sk-design-md-generator/backend/scripts/extract.ts` | Modified | Usage text and two hints name the real path and `specs/` |
| `.skilled/skills/sk-design/sk-design-md-generator/backend/scripts/cli.ts` | Modified | Header comment names the real path and `specs/` |
| `.skilled/skills/sk-design/sk-design-md-generator/backend/tests/output-policy.test.ts` | Modified | Two tests for the `specs/` path and the kept `.opencode` root |
| `.skilled/skills/sk-design/sk-design-md-generator/backend/tests/guided-run.test.ts` | Modified | The inside-the-skill case uses the real skill path |
| `.skilled/skills/sk-design/sk-design-md-generator/INSTALL-GUIDE.md` | Modified | Package list matches the manifest, doc version 1.0.1.0 |
| `.skilled/skills/sk-design/sk-design-md-generator/references/troubleshooting.md` | Modified | No false stealth claim, doc version 1.0.1.0 |
| `.skilled/skills/sk-design/sk-design-md-generator/references/extraction-workflow.md`, `references/guided-run.md` | Modified | Real skill path, `specs/` output example, doc version 1.0.1.0 |
| `.skilled/skills/sk-design/sk-design-md-generator/manual-testing-playbook/manual-testing-playbook.md` and 8 scenario pages (`cluster`, `detectors`, `escalation`, `extract`, `interaction`, `report`, `setup`, `validate`) | Modified | Real skill path, `specs/` output example, doc version 1.0.1.0 |
| `.skilled/skills/sk-design/sk-design-md-generator/manual-testing-playbook/study/editorial-exemplar-study.md`, `guided-run/guided-run-smoke-lane.md` | Modified | Real skill path (and `specs/` example in the smoke lane), doc version 1.0.2.0 |
| `.skilled/skills/sk-design/sk-design-md-generator/SKILL.md` | Modified | Version 1.1.6.0 |
| `.skilled/skills/sk-design/sk-design-md-generator/changelog/v1.1.6.0.md` | Created | Release entry |
| `.hermes/skills/sk-design-md-generator/SKILL.md` | Modified | Hermes sync copy of the version step |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

I recorded the baseline first: the stealth chain in `npm ls deepmerge`, typecheck and build at exit 0, 176 tests, and a clean `npm audit`. Then I searched the whole repo for the two names, using a pattern that skips the `playwright-extract` backend kind, and scanned every import in the backend scripts and tests. Only the manifest and two doc lines matched. Then I edited the manifest, regenerated the lockfile, and installed from it with `npm ci`, and ran the whole backend gate on that clean install.

For the help text I found the source strings, then found that the output rule behind them enforced the same stale root. I probed the rule with the documented path, saw it refused, and wrote the failing test before changing the rule. Then I changed the rule, corrected the text, rebuilt, and diffed the `--help` output. Then I edited the docs, wrote the changelog, stepped the version and synced Hermes.

For the sweep I counted the stale hits first (49 lines in 13 files for the skill path, 32 lines in 11 docs for `.opencode`) and ran the playbook package validator for a baseline. One `replace_all` per file did the path and the example, then I raised each version and ran the counts, the validator and `validate_document.py` again. My first count run was invalid, because a shell variable of `rg` flags did not split and `rg` errored. The positive control (the correct path, 89 lines) exposed that, and I reran it with the globs written inline.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove the packages, add no test for it | The behavior is unchanged, and a test of the manifest would restate it. The before and after `npm ls deepmerge` pair is the proof |
| Do not override `deepmerge` | No patched version exists, and with the chain gone nothing in the tree needs it |
| Fix the output rule, not only the help text | Correcting the text alone would have advertised `specs/`, which the rule refused. The text echoed the rule's stale root, so the rule is the cause |
| Keep `.opencode/specs` allowed | A spec tree under `.opencode` is a valid layout in other repos, and dropping the root would refuse writes that worked. The coordinator confirmed keeping both |
| Switch every doc example to `specs/` | `specs/` is the primary root now, and it is the folder this repo has, so an example that writes there runs as written |
| Leave `.opencode/specs` in `tests/guided-run.test.ts` | Those strings are option values the parser reads and are never checked against the output rule, so they are harmless test data |
| No test for the usage text | No existing test covers it, and a test that matches the printed strings would mirror the source. The diffed before and after output is the proof |
| Take v1.1.6.0, not v1.1.5.0 | Another lane has v1.1.5.0 pending, and two lanes on one version collide at merge |
| Predecessor is phase 011 | Phases 012 and 013 are siblings that also fork from 011, and this one shares 011's Dependabot origin |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm ls deepmerge`, before | the `puppeteer-extra-plugin-stealth@2.11.2` chain ending in `deepmerge@4.3.1` |
| `npm ls deepmerge`, after `npm ci` | `(empty)`, exit 1 (npm's code for no match) |
| Lockfile package-set diff | 137 to 95 entries, 42 removed, 0 added, only the root entry changed |
| `npm run typecheck`, before and after | exit 0 both times |
| `npm run build`, before and after | exit 0 both times |
| `npm test`, before | exit 0, `Test Files  20 passed (20)`, `Tests  176 passed (176)` |
| `npm test`, after | exit 0, `Test Files  20 passed (20)`, `Tests  178 passed (178)` |
| New policy test on the old rule | exit 1, `Tests  1 failed \| 14 passed (15)`, `expected false to be true` |
| New policy tests on the new rule | exit 0 with the guided-run file: `Tests  24 passed (24)` |
| `resolveOutputPath` on `specs/...`, `.opencode/specs/...`, `/etc/nope` | `ok:true`, `ok:true`, `ok:false` |
| `node dist/cli.js --help`, diffed before and after | 2 lines changed, `.opencode` count 0, real script path count 1 |
| `npm audit`, before and after | `found 0 vulnerabilities` both times |
| `rg -q 'skills/sk-design-md-generator/'` over the skill and `.hermes/skills/sk-design-md-generator` | exit 1, no match (49 lines in 13 files before) |
| Positive control: `rg` for `skills/sk-design/sk-design-md-generator/` | 89 lines in 24 files, so the search reads the tree |
| `rg -c '\.opencode'` over the install guide, references and playbook | exit 1, nothing found (32 lines in 11 files at `HEAD`, by the same scan) |
| Playbook package validator, before and after | `PASS package=sk-design/sk-design-md-generator tier=FAIL_CLOSED scenarios=18 ... violations=0 warnings=0` both times |
| `validate_document.py --json` on every changed doc | `"total_issues": 0` each, the playbook root with `--type reference` (without it, one document-type fallback warning, the same on `HEAD`) |
| `node dist/cli.js --help` and `require('./dist/crawl.js')` | usage printed, `crawl module loads` |
| Changelog, `INSTALL-GUIDE.md`, `troubleshooting.md`, `SKILL.md` through `validate_document.py --json` | `"total_issues": 0` for each |
| Changelog `hvr_scan.py` | 0 hard blockers, no mechanical findings |
| `parent-skill-check.cjs` on `sk-design` | exit 0, `13d-packet-version` PASS |
| Hermes sync | `Wrote 1 of 67 Hermes skill copies; pruned 0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`npm audit` cannot show the alert closing.** It reported 0 vulnerabilities before the change too. Alert 1410 clears on GitHub once the lockfile reaches the default branch and the dependency graph rescans. That is inferred, and only the Dependabot page can confirm it.
2. **The two doc editions were raised by hand.** The pre-commit bump check reads staged files, so it had nothing to read here. The format gate passes, and the rule leaves a version that is already higher alone.
3. **One older path form remains by design.** `procedure-card-contract/card-selection-proof.md` names `sk-design-md-generator/SKILL.md`. That is the skill's name plus a file, not a path under `.skilled/`, so it is correct and the stricter lookbehind search reports it.
4. **A stale version note remains in the playbook root.** Its opening paragraph still says "Skill version 1.0.0", while the skill is 1.1.6.0. It was already stale before this phase and is outside the path sweep.
<!-- /ANCHOR:limitations -->

---
