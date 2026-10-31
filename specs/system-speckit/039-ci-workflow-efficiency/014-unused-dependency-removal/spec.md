---
title: "Feature Specification: Phase 14: unused-dependency-removal"
description: "The sk-design-md-generator backend declared playwright-extra and puppeteer-extra-plugin-stealth but imports neither, and the stealth plugin pulled a deepmerge copy that GitHub flags for prototype pollution with no patched version. This phase removes both packages, lets the output rule accept the specs/ folder the README documents, and corrects the help text and guides that named stale paths and packages."
trigger_phrases:
  - "unused dependency removal"
  - "phase 14 unused dependency removal"
  - "dependabot deepmerge alert"
  - "md generator stealth dependency"
  - "md generator output path policy"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 14: unused-dependency-removal

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `worktrees/243-md-generator-unused-deps` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 14 |
| **Predecessor** | 011-ci-health-followups |
| **Successor** | None |
| **Handoff Criteria** | `npm ls deepmerge` in the backend prints an empty tree, typecheck and build exit 0, the vitest suite passes with its two new policy tests, and `--output specs/...` is accepted |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the CI workflow efficiency packet. It follows phase 011, which also handled a Dependabot-driven `npm audit` finding, and it addresses the open Dependabot alert on the md-generator backend.

**Scope Boundary**: the `sk-design-md-generator` backend (manifest, lockfile, the output-path rule, the usage text and the tests beside them), the doc lines that named the removed packages or a stale tool, and the mode's own version and changelog.

**Dependencies**: npm and the registry, for the lockfile regeneration.

**Deliverables**:
- `backend/package.json` and `backend/package-lock.json` without the two packages.
- An output rule that accepts the `specs/` folder, and usage text with the real script path.
- The install guide and the troubleshooting page corrected.
- Release v1.1.6.0 with its changelog entry.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Dependabot alert 1410 (`deepmerge` 4.3.1 and older, prototype poisoning, low severity) has no patched version, so it cannot be cleared by an upgrade. It reaches the md-generator backend only through `puppeteer-extra-plugin-stealth`, which `package.json` declares next to `playwright-extra`. No source, test or script imports either package, because the crawler uses plain `playwright`. The install guide and the troubleshooting page still say the tool ships them.

Two nearby defects sit in the same skill. The usage text printed by `--help` names a script path and a spec folder that no longer exist. Behind that text, the output rule allows only `<repo>/.opencode/specs`, a folder this repository does not have, so the `--output specs/<track>/<packet>/output` command the README gives is refused before the crawl starts. The install guide also lists `ts-node` among the runtime dependencies, though it is a dev dependency.

The same two stale paths sit in the docs. Thirteen files print `.skilled/skills/sk-design-md-generator/...`, a skill folder that does not exist, so a pasted command fails. Eleven docs show `.opencode/specs/<track>/<packet>/output` as the place to write output, where the repo's spec tree is `specs/`.

### Purpose
Remove the two unused packages so the flagged `deepmerge` copy leaves the dependency tree, and make the documented output command and the usage text true, without changing how the backend crawls.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run in `.skilled/skills/sk-design/sk-design-md-generator/backend` before the change:

```text
$ npm ls deepmerge
design-system-extractor@0.0.4 .../sk-design-md-generator/backend
└─┬ puppeteer-extra-plugin-stealth@2.11.2
  └─┬ puppeteer-extra-plugin-user-preferences@2.4.1
    └── deepmerge@4.3.1
```

Every tracked mention of either package, read from `HEAD` so the edits do not hide it (the pattern excludes `playwright-extract`, the backend kind name):

```text
$ git grep -n -I -P "playwright-extra(?!ct)|puppeteer-extra" HEAD -- . ':(exclude)**/package-lock.json'
.skilled/skills/sk-design/sk-design-md-generator/INSTALL-GUIDE.md:40
.skilled/skills/sk-design/sk-design-md-generator/backend/package.json:26
.skilled/skills/sk-design/sk-design-md-generator/backend/package.json:27
.skilled/skills/sk-design/sk-design-md-generator/references/troubleshooting.md:41
```

The non-relative import specifiers across `backend/scripts` and `backend/tests` are `vitest`, `fs`, `path`, `playwright`, `os`, `node:*`, `child_process`, `culori` and `css-tree`. `playwright` appears 9 times as `from` and once as `import('playwright')`. Neither removed package appears, and no `.use(` call exists. The fresh `dist/` has no reference either.

The usage text and the output rule, before the change (`resolveOutputPath` from `dist/output-policy.js` with the repo root as cwd):

```text
$ ls -d .opencode .opencode/specs specs
ls: .opencode/specs: No such file or directory
.opencode
specs

$ node dist/cli.js --help   (lines that name a path)
  npx ts-node .skilled/skills/sk-design-md-generator/backend/scripts/extract.ts <url1> [url2] ...
                         like .opencode/specs/<track>/<packet>/output resolves correctly)

$ resolveOutputPath("specs/system-speckit/053/x/output")
{"requested":"specs/system-speckit/053/x/output","ok":false,"boundary":null,"reason":"output path must be inside a spec folder (.../.opencode/specs) or an appr..."}
$ resolveOutputPath(".opencode/specs/system-speckit/053/x/output")
{"requested":".opencode/specs/system-speckit/053/x/output","ok":true,"boundary":"spec-folder"}
```

The stale doc paths, counted before the doc sweep (`rg` over the skill and its Hermes copy, excluding `node_modules` and `dist`):

```text
$ rg -n 'skills/sk-design-md-generator/' <skill> .hermes/skills/sk-design-md-generator | wc -l
49          (13 files: 2 references and 11 playbook pages)
$ rg -c '\.opencode' <skill> <docs only: INSTALL-GUIDE, references, playbook>
32 lines    (11 docs)
$ playbook validator, before:
PASS package=sk-design/sk-design-md-generator tier=FAIL_CLOSED scenarios=18 categories=16 operator=18 routing_gold_excluded=0 violations=0 warnings=0
```

Baseline before the change, all in `backend/` on the default node: `npm run typecheck` exit 0, `npm run build` exit 0, `npm test` prints `Test Files  20 passed (20)` and `Tests  176 passed (176)`, and `npm audit` prints `found 0 vulnerabilities`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove `playwright-extra` and `puppeteer-extra-plugin-stealth` from `backend/package.json` and regenerate `backend/package-lock.json`.
- Make the output rule accept `<repo>/specs`, keep accepting `<repo>/.opencode/specs`, and cover both with tests.
- Correct the usage text, the missing-output hints and the `cli.ts` header comment to the real script path and the `specs/` folder.
- Correct the install guide and the troubleshooting page so neither says the tool ships stealth, and the install guide names `ts-node` as a dev dependency.
- Point the 13 docs that print the wrong skill path at `.skilled/skills/sk-design/sk-design-md-generator/`, switch every doc example that writes output under `.opencode/specs` to `specs/<track>/<packet>/output`, and raise each changed doc's own version.
- Release the change as `sk-design-md-generator` v1.1.6.0 with a changelog entry.

### Out of Scope
- Adding stealth or anti-bot measures to the crawler - nobody asked, and the crawler runs without them today.
- Overriding or upgrading `deepmerge` - no patched version exists, and nothing needs it once the chain is gone.
- Dropping the `.opencode/specs` root - the install guide, `guided-run.md` and the playbooks still print commands that use it.
- The `.opencode/specs` strings in `tests/guided-run.test.ts` - they are option values the parser reads, never checked against the output rule, so they are harmless test data.
- Anything else in the playbook pages - only the skill path, the output example and the page version change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-design/sk-design-md-generator/backend/package.json` | Modify | Drop the two dependencies |
| `.skilled/skills/sk-design/sk-design-md-generator/backend/package-lock.json` | Modify | Regenerated: 42 package entries removed, none added |
| `.skilled/skills/sk-design/sk-design-md-generator/backend/scripts/output-policy.ts` | Modify | `specs/` becomes the spec root, `.opencode/specs` stays allowed |
| `.skilled/skills/sk-design/sk-design-md-generator/backend/scripts/extract.ts` | Modify | Usage text and two error hints name the real path and `specs/` |
| `.skilled/skills/sk-design/sk-design-md-generator/backend/scripts/cli.ts` | Modify | Header comment names the real path and `specs/` |
| `.skilled/skills/sk-design/sk-design-md-generator/backend/tests/output-policy.test.ts` | Modify | Two tests: the documented `specs/` path, and the `.opencode` root kept |
| `.skilled/skills/sk-design/sk-design-md-generator/backend/tests/guided-run.test.ts` | Modify | The "inside the skill" case uses the real skill path, so it reaches the skills-directory branch |
| `.skilled/skills/sk-design/sk-design-md-generator/INSTALL-GUIDE.md` | Modify | Package list drops both names and names `ts-node` as a dev dependency, doc version 1.0.1.0 |
| `.skilled/skills/sk-design/sk-design-md-generator/references/troubleshooting.md` | Modify | The blocked-crawl note no longer claims stealth, doc version 1.0.1.0 |
| `.skilled/skills/sk-design/sk-design-md-generator/references/extraction-workflow.md`, `references/guided-run.md` | Modify | Real skill path, `specs/` output example, doc version 1.0.1.0 |
| `.skilled/skills/sk-design/sk-design-md-generator/manual-testing-playbook/manual-testing-playbook.md` and 8 scenario pages under `cluster/`, `detectors/`, `escalation/`, `extract/`, `interaction/`, `report/`, `setup/`, `validate/` | Modify | Real skill path, `specs/` output example, doc version 1.0.1.0 |
| `.skilled/skills/sk-design/sk-design-md-generator/manual-testing-playbook/study/editorial-exemplar-study.md`, `guided-run/guided-run-smoke-lane.md` | Modify | Real skill path (and `specs/` example in the smoke lane), doc version 1.0.2.0 |
| `.skilled/skills/sk-design/sk-design-md-generator/SKILL.md` | Modify | Version 1.1.6.0 |
| `.skilled/skills/sk-design/sk-design-md-generator/changelog/v1.1.6.0.md` | Create | Release entry |
| `.hermes/skills/sk-design-md-generator/SKILL.md` | Modify | Hermes sync copy of the version step |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Neither package is declared or installed, and the flagged `deepmerge` copy is gone from the tree | After `npm ci` in `backend/`, `npm ls deepmerge` prints `(empty)` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The backend behaves as before on a clean install | `npm run typecheck` and `npm run build` exit 0, and `npm test` passes every pre-existing test |
| REQ-003 | No doc outside `specs/` says the tool ships either package | The `git grep` above prints nothing for paths outside `specs/` and outside the lockfile |
| REQ-004 | The output rule accepts the documented `specs/<packet>/output` path and still accepts `.opencode/specs` | The new policy test fails on the old rule and passes on the new one, and `/etc/nope` is still refused |
| REQ-005 | The usage text and error hints name the real script path and the `specs/` folder | `node dist/cli.js --help` prints `.skilled/skills/sk-design/sk-design-md-generator/backend/scripts/extract.ts` and the text `.opencode` appears nowhere in it |
| REQ-006 | The install guide lists `ts-node` as a dev dependency, not a runtime one | `INSTALL-GUIDE.md` line 40 names `playwright`, `css-tree` and `culori` as runtime and `ts-node` as dev |
| REQ-007 | No doc in the skill or its Hermes copy prints the wrong skill path or tells the reader to write output under `.opencode/specs`, and each changed doc's version is raised | `rg -q 'skills/sk-design-md-generator/'` over both exits 1, `rg -c '\.opencode'` over the docs finds nothing, the playbook validator prints `PASS ... violations=0 warnings=0`, and `validate_document.py --json` prints `"total_issues": 0` for every changed doc |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npm ls deepmerge` in `backend/` prints `(empty)` and `npm audit` still prints `found 0 vulnerabilities`.
- **SC-002**: The lockfile diff removes 42 package entries and adds none, so no other package changed version.
- **SC-003**: `npm test` prints `Tests  178 passed (178)`, the 176 baseline plus the two policy tests.
- **SC-004**: The playbook package validator still prints `PASS package=sk-design/sk-design-md-generator ... scenarios=18 ... violations=0 warnings=0` after the sweep.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The npm registry, for `npm install --package-lock-only` | Low: a failed call leaves the lockfile as it was | Compare the old and new lockfile package sets before the clean install |
| Risk | Something outside the repo imports the packages through this backend's `node_modules` | Low: the package is `private`, and the repo-wide grep found no consumer | Re-add the two lines and run `npm ci` if a consumer appears |
| Risk | The output rule now allows writes under `<repo>/specs` as well as `<repo>/.opencode/specs` | Low: the skills directory is still refused first, and a path outside both roots and the sandbox is still refused | The new tests cover the `specs/` path, the `.opencode` path and the existing refusals |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocks the work. `npm audit` reported 0 vulnerabilities before and after, so it cannot show the alert closing. GitHub should close alert 1410 once the lockfile reaches the default branch and its dependency graph rescans. That is inferred, and only the Dependabot page can confirm it.
<!-- /ANCHOR:questions -->

---
