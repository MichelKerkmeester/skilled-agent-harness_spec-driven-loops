---
title: "Implementation Plan: Phase 2: quality-report-listing"
description: "List the ceiling report and its test in the sk-code-quality SKILL.md and README, move the skill from 1.0.1.0 to 1.1.0.0 with a matching changelog file, and confirm the compiled sk-code manifest and the leaf manifests stay fresh. The Hermes copy is regenerated later by the orchestrator."
trigger_phrases:
  - "quality report listing plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: quality-report-listing

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown edits to a skill package, checked with Python 3, Node.js and bash tools. No code is written |
| **Framework** | None. The skill package contract is `.skilled/skills/sk-doc/sk-create-skill/SKILL.md`, the changelog contract is `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` |
| **Storage** | None. Two generated manifests are only checked, and refreshed only if stale |
| **Testing** | `ceiling-report.test.sh`, `validate_document.py`, `package_skill.py --check --strict`, `compiled-route-guard.cjs`, `ci-leaf-manifest-freshness.cjs` |

### Overview
`ceiling-report.sh` lists the `ceiling:` and `intentional-limit:` comment markers in code and tags the ones whose trigger can never fire (`.skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh:2-25`). An earlier child added it and its test but could not edit `SKILL.md`, so the mode never names it. This phase lists both files at the three places `SKILL.md` already lists their neighbours (Resource Domains at lines 91-93, Resource Loading Levels at lines 100-110, Scripts at lines 315-318), bumps the version, adds the changelog file and lists the report in the two README tables that list the checkers. Then it confirms the manifests that other tools derive from the skill tree.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place documentation edit of one skill package, plus a changelog file and a freshness check of two derived manifests

### Key Components
- **The report (unchanged)**: `.skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh`, a Python 3 program with a `#!/usr/bin/env python3` line. Its usage is in the module docstring (lines 2-25) because the program has no help flag: `--help` prints `ceiling-report: unknown option --help` and exits 2 (line 191). With no argument it reads every tracked file ending in `.ts .tsx .js .mjs .cjs .py .sh .bash`, skipping `node_modules` and `specs/**/context/**`. With file arguments it reads exactly those. It prints one `path:line  text  [tags]` line per marker, then `markers=N no-trigger=N no-signal=N`. A marker is a comment that starts with the word `ceiling` or `intentional-limit` and a colon (line 35). The tag `no-trigger` means nothing follows the first `;` or `,` after the colon. The tag `no-signal` means the trigger has no digit, no `%` and no measurable term (lines 109-122). It exits 0 whatever it finds, and 2 for an unknown option, a missing path or a directory (lines 187-199). Run `bash ceiling-report.sh` and bash tries to parse the Python (`import: command not found`, exit 2), so the listing tells the agent to run it directly, the way `SKILL.md` line 136 already runs `scripts/check-comment-hygiene.sh <file>`.
- **The test (unchanged)**: `scripts/ceiling-report.test.sh`, a bash test script with eight cases that ends `All ceiling report test cases passed`. It is the only script of the pair that runs through `bash`.
- **The listing sites in `SKILL.md`**: Resource Domains (line 91 to 93, one bullet per script), Resource Loading Levels (lines 100 to 110, the `ON_DEMAND` hook row at line 110 is the model for a script the agent runs only when asked) and the Scripts reference list (lines 315 to 318, one link bullet per file, test files included). The Smart Routing diagram (lines 67 to 70) and the machine-readable router (lines 138 to 170) stay as they are. The report is an on-demand script, and a new keyword would move advisor and compiled routing.
- **The version rule**: `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` section 4 gives patch as `{MAJOR}.{MINOR}.{PATCH+1}.0` for "incremental improvement, bug fix, refactor, docs, cleanup" and minor as `{MAJOR}.{MINOR+1}.0.0` for "significant new feature or subsystem addition". `.skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md` section 3 (Versioning) gives minor for "new features, new bundled resources" and patch for "bug fixes, typo corrections". A script a mode lists and an agent can now run is a new bundled resource and a new capability of the mode, not a wording repair, so the bump is minor: 1.0.1.0 becomes 1.1.0.0. The same family took the same step when `sk-code-opencode` gained two checker flags (`.skilled/skills/sk-code/sk-code-opencode/changelog/v1.1.0.0.md`). Version 1.1.0.0 is strictly greater than the newest entry (`v1.0.1.0.md`) and no file exists at that path, as the changelog contract requires.
- **Version authority**: the `SKILL.md` `version:` matches the newest entry under `changelog/` (the hub rule at `.skilled/skills/sk-doc/SKILL.md:17`, applied to this mode). The README carries its own `version:`, and the README gate requires "a matching changelog entry" (`creation-workflow.md` post-authoring README gate, step 4). The README moves to 1.1.0.0 because this phase edits it, the way `sk-code-review` v1.6.0.0 aligned its README. `changelog/` is reached from `.skilled/changelog/code-quality`, a symlink to this folder, so the entry is written in the skill folder.
- **The README**: `.skilled/skills/sk-code/sk-code-quality/README.md` lists `check-comment-hygiene.sh` and `check-dist-staleness.sh` in the Verification table (section 6) and the Related Documents table (section 7), so the report gets one row in each. It does not list `check-comment-hygiene.test.sh`, so the new test file is not listed there either. `scripts/README.md` already lists the report, the test and the validation line (lines 2, 23, 24 and 36), so it needs no edit.
- **The compiled sk-code manifest**: `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` records a policy hash built from three files under the hub root only: `SKILL.md`, `hub-router.json` and `mode-registry.json` (`.skilled/bin/lib/compiled-route-manifest.cjs:435-438`). The file edited here is `sk-code-quality/SKILL.md`, a child file, so the hash should not move. The plan therefore checks freshness first and refreshes only on a stale result. A refresh also needs the archived authored copy under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json` kept byte-identical (`cmp`), the way the earlier surface-alignment phase did.
- **The leaf manifest**: `.skilled/skills/sk-code/leaf-manifest.json` lists only the `assets/` and `references/` leaves of each mode. `sk-code-quality` declares three checklist assets and no scripts, so a `SKILL.md` edit does not change it, and the earlier debt-report child recorded the same result. The freshness gate is rerun to prove it.
- **Hermes copy**: `.hermes/skills/sk-code-quality/SKILL.md` is a generated copy of `SKILL.md` and nothing else is mirrored for this skill. `sync-skills-hermes.cjs` in write mode is the orchestrator's, run once after every child is built. The builder runs only `--check`, which reports drift for `sk-code-quality` once `SKILL.md` changes.

### Data Flow
The agent reads `SKILL.md`, sees the report in the Resource Domains bullet and the loading table, and runs `scripts/ceiling-report.sh` with no argument or with file paths. The report prints marker lines to stdout, warnings for unreadable files to stderr, and exits 0. The skill version in `SKILL.md`, the changelog file name and the README version all read 1.1.0.0. The manifest tools read the hub-root files and the leaf directories, not this edit, and are checked only to prove that.

### Exact Text of the Edits
Every text below is final. The builder pastes it as written. The prose avoids em dashes, semicolons and Oxford commas, per the Human Voice Rules.

**E1, `SKILL.md` line 5.** Replace `version: 1.0.1.0` with:

```text
version: 1.1.0.0
```

**E2, `SKILL.md` Resource Domains.** Insert this bullet directly after the `scripts/check-dist-staleness.sh` bullet (line 92) and before the `scripts/hooks/claude-posttooluse.sh` bullet:

```text
- `scripts/ceiling-report.sh [<file>...]` lists the `ceiling:` and `intentional-limit:` comment markers and tags the ones with no trigger or no measurable signal. Run it for a debt pass, before a release or when a reviewer asks what limits the code knowingly accepts. It reads every tracked code file, or only the files named, prints one `path:line  text  [tags]` line per marker and a closing `markers=N no-trigger=N no-signal=N` line, and exits 0 because it reports and does not gate.
```

**E3, `SKILL.md` Resource Loading Levels.** Insert this row directly after the `CONDITIONAL` row for `scripts/check-dist-staleness.sh` (line 109) and before the `ON_DEMAND` hook row:

```text
| ON_DEMAND | Debt pass, before a release or a reviewer asks what limits the code knowingly accepts | `scripts/ceiling-report.sh` |
```

**E4, `SKILL.md` Scripts reference list.** Insert these two bullets directly after the `scripts/check-dist-staleness.sh` link bullet (line 317) and before the `scripts/hooks/claude-posttooluse.sh` link bullet:

```text
- [`scripts/ceiling-report.sh`](scripts/ceiling-report.sh) - Ceiling-marker report. Run it for a debt pass, before a release or when a reviewer asks what limits the code knowingly accepts.
- [`scripts/ceiling-report.test.sh`](scripts/ceiling-report.test.sh) - Ceiling-marker report tests.
```

**E5, `README.md` line 11.** Replace `version: 1.0.0.2` with:

```text
version: 1.1.0.0
```

**E6, `README.md` section 6 (Verification table).** Insert this row directly after the `Distribution drift` row:

```text
| Ceiling markers | `.skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh` prints one line per `ceiling:` or `intentional-limit:` marker and a closing `markers=N no-trigger=N no-signal=N` line, and exits 0 because it reports and does not gate |
```

**E7, `README.md` section 7 (Related Documents table).** Insert this row directly after the `scripts/check-dist-staleness.sh` row:

```text
| [`scripts/ceiling-report.sh`](./scripts/ceiling-report.sh) | Ceiling-marker report for debt passes and release checks |
```

**E8, new file `.skilled/skills/sk-code/sk-code-quality/changelog/v1.1.0.0.md`.** Compact format. The `version:` key is on line 11, after the five contract keys, as in the neighbouring entries.

```markdown
---
title: "sk-code-quality v1.1.0.0, The Quality Mode Lists Its Ceiling Report"
description: "The quality mode now lists its ceiling report and says when to run it. The report finds the ceiling and intentional-limit markers in code comments and tags the ones whose trigger can never fire."
trigger_phrases:
  - "sk-code-quality v1.1.0.0"
  - "sk-code-quality 1.1.0.0"
  - "ceiling marker report"
  - "quality mode scripts list"
importance_tier: "normal"
contextType: "general"
version: 1.1.0.0
---

# v1.1.0.0, The Quality Mode Lists Its Ceiling Report

The quality mode has a report on the shortcuts a codebase knowingly accepts, and its `SKILL.md` now lists it. The report finds every `ceiling:` and `intentional-limit:` marker in code comments and tags the ones whose trigger can never fire. An agent only runs the scripts its mode lists, so until this release nothing pointed to it.

> Spec folder: `specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/002-quality-report-listing` (Level 1)

&nbsp;

## What's New at a Glance

- **The ceiling report is available.** `scripts/ceiling-report.sh` prints one line per marker. It tags a marker `no-trigger` when it names no condition for revisiting the shortcut, and `no-signal` when that condition has no number or measurable term. It reports and never gates.
- **The mode now lists the report.** `SKILL.md` names the script and its test, and says to run it for a debt pass, before a release or when a reviewer asks what limits the code knowingly accepts.

&nbsp;

## Upgrade

No migration required. Run `.skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh` from the repository root to see the markers.
```

### Expected Diff of `SKILL.md`
Against the saved copy, `diff` prints exactly four hunks: `5c5`, `92a93`, `109a111` and `317a320,321`. The README diff prints exactly three hunks: `11c11`, `116a117` and `130a132`. The line numbers hold if no other child edits these two files, and no sibling phase lists them in its scope.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Report test**: `bash .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.test.sh` before and after. Expected both times: eight `PASS` lines (`measurable`, `no_trigger`, `no_signal`, `prefix`, `prose`, `missing_path`, `unknown_option`, `directory_path`), then `All ceiling report test cases passed`, exit 0.
- **Report output on a fixed input**: run the report on the tracked probe file `specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/004-debt-report-and-hermes-gate/scratch/after/probe.py`. Expected: three marker lines tagged `[no-trigger]`, `[no-signal]` and `[]`, then `markers=3 no-trigger=1 no-signal=1`, exit 0. This is the output the listing describes. A repository-wide run (no argument) finds the same three markers today, prints a stderr warning for a tracked file missing from the working tree, and exits 0, so only the last line's shape is checked there.
- **Direct versus bash**: the file starts with `#!/usr/bin/env python3` and has the executable bit, so the direct form works. Run through `bash` it fails with `import: command not found` and exit 2 at planning time. Phase 1 records the shebang line and the mode instead of running the `bash` form again, because bash would run the Python lines as shell commands.
- **Validators**: `python3 -I .skilled/skills/sk-doc/shared/scripts/validate_document.py` on `SKILL.md`, the new changelog file and (with `--type readme`) `README.md`, each expected `VALID` and `Total issues: 0`. All three returned that on 2026-10-10 before the edit (the changelog check ran on the neighbouring `v1.0.1.0.md`). `python3 -I .skilled/skills/sk-doc/scripts/package_skill.py --check --strict .skilled/skills/sk-code/sk-code-quality` expects `Result: PASS`. The Human Voice scan on the new changelog file, `python3 -I .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py`, expects `hard blockers: 0`. `bash .skilled/skills/sk-doc/scripts/check-frontmatter-versions.sh --skill sk-code` expects exit 0.
- **Manifests**: `compiled-route-manifest.cjs freshness` expects `"fresh": true` and the policy hash `a59ec9ff7f6a450ca96f1d81b4b3174930058e7fcb94babd4a077b8b058299e2` both before and after. `compiled-route-guard.cjs` lists seven hubs fresh. `ci-leaf-manifest-freshness.cjs` expects `checked=14 fresh=14 failed=0`, and `ci-skill-root-metadata.cjs` expects `checked=14 passed=14 failed=0 fixed=0`.
- **Links**: `node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs` expects `0 broken` (7927 files and 14026 links before the edit).
- **Hermes**: `sync-skills-hermes.cjs --check` expects `PASS: 70 Hermes skill copies in sync` before the edit and drift naming `sk-code-quality` after it, which is the deferred regeneration.
- **Gap**: the committed trigger index lists changelog files, so a new changelog file drifts it. `generate-trigger-index.mjs --check` already exits 1 at baseline on spec documents. The index is rebuilt by the trigger-index-rebuild workflow after merge, so this phase does not touch it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The earlier debt-report child, already committed: the report and its test exist and pass (`scripts/ceiling-report.sh` and `scripts/ceiling-report.test.sh`).
- Node.js and Python 3 for the checkers. `python3 -I` is used for every Python tool.
- Sibling children build in parallel, and the parent spec lists none of them against `sk-code-quality`. Phase 001 (router-orphan-docs) edits `sk-code-obsidian`, the hub routers and the router-sync script, which can make the compiled sk-code manifest or the leaf manifest stale for a reason this fix did not cause. The tasks name how to tell the two cases apart.
- The orchestrator owns the Hermes write run and the packet changelog refresh. A commit is blocked by the pre-commit mirror gate until the Hermes copy is regenerated.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Restore the two modified tracked files with `git restore .skilled/skills/sk-code/sk-code-quality/SKILL.md .skilled/skills/sk-code/sk-code-quality/README.md`.
- Delete the new file `.skilled/skills/sk-code/sk-code-quality/changelog/v1.1.0.0.md`. Nothing else refers to it.
- If the compiled manifest was refreshed, restore both copies with `git restore .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json`. If the leaf manifest was regenerated, restore `.skilled/skills/sk-code/leaf-manifest.json` the same way.
<!-- /ANCHOR:rollback -->

---
