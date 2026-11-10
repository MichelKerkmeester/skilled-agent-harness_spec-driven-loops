---
title: "Feature Specification: Let a host repository name its trigger index folder"
description: "A host names its trigger index folder in .skilled-host.json at its root, so Barter can use .index. A host that names nothing keeps .speckit-index."
trigger_phrases:
  - "configurable host index folder"
  - "let a host repository name its trigger index"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Let a host repository name its trigger index folder

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-09 |
| **Branch** | `worktrees/334-v4-release-remediation` |
| **Parent Spec** | ../spec.md |
| **Handoff Criteria** | A host that names `.index` generates into it and reads it, a project linked into that host reads it, and a host with no setting keeps `.speckit-index/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The host trigger index folder is fixed at `.speckit-index/`. `lib/host-index.mjs` hard-codes that path in `HOST_INDEX_RELATIVE` and again in `isHostRepository()`, so a host repository cannot rename the folder. Barter, a host that vendors Skilled, wants the folder named `.index`. Its only route today is an overlay on these scripts, and that overlay blocks every re-pin that touches them.

### Purpose
A host names its index folder in one file at its root. The generator, the lookup, the host check and linked projects all follow that name, and a host that names nothing keeps `.speckit-index/`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git show HEAD:.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/host-index.mjs | rg -n "speckit-index|HOST_INDEX_RELATIVE"
13:// its index at `.speckit-index/`, or points `.skilled` at a tree that lives
35:export const HOST_INDEX_RELATIVE = '.speckit-index/trigger-index.json';
84:  if (isDirectory(path.join(absolute, '.speckit-index'))) return true;
109:  return path.resolve(root, HOST_INDEX_RELATIVE);
```

The command ran against HEAD, the commit before this change, and exited 0. The fixed folder is the literal on line 35, and line 84 repeats it in the host check. Changing the constant alone would leave the host check counting the old folder.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `hostIndexDir(root)`, which reads `indexDir` from `.skilled-host.json` at the root and falls back to `.speckit-index`.
- Route `hostIndexPath()` and `isHostRepository()` through that folder, so the generator, the lookup and the host check agree.
- Refuse a setting that the scripts cannot honor, with exit 2 and a message that names the file.
- Cover the named folder, the default folder and the rejected values in `host-trigger-index.vitest.ts`.
- Update the three docs that name the folder.
- Check where the named folder really lands, so a link, a differently cased name, a tool-owned folder or a file cannot stand in for it.
- Say on stderr when a host's setting names a folder with no index while the default folder still holds one.
- Name the setting in the root `README.md`, the spec-kit `README.md` and the `speckit` command README.
- Make `upgrade-legacy.mjs` exit 2 on a setting it cannot honor, the way the generator and the lookup do.
- Correct `.skilled/commands/speckit/search.md`, which still told a host to pass the default index path by hand, and name the exit-2 setting error there.
- Name the setting in `.skilled/changelog/skilled/v4.0.2.0.md`, on the operator's direction after the change landed, so the republished release describes the code its tag holds.
- Give the change its own `system-spec-kit` changelog entry, `v2.12.40.0`, and raise the version in the skill's `SKILL.md` to match.

### Out of Scope
- Barter-side steps - the re-pin through `/doctor:overlay repin`, adding `.skilled-host.json`, regenerating and removing `.speckit-index/` belong to Barter.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/host-index.mjs` | Modify | `hostIndexDir()` reads and checks the setting. `hostIndexPath()` and `isHostRepository()` resolve through it. |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` | Modify | `keepsOwnIndexDirectory()` uses `hostIndexDir()`. A setting error exits 2 with a prefixed message. Header comment updated. |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` | Modify | A setting error exits 2 with the message. Header and function comments name the configured folder. |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/host-trigger-index.vitest.ts` | Modify | New `host-named index directory` block of 27 cases, and one linked-project case. |
| `.skilled/skills/system-spec-kit/runtime/data/README.md` | Modify | Describes `.skilled-host.json` and how linked projects read it. |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/README.md` | Modify | Documents the new exports and the error rules. |
| `.skilled/skills/system-spec-kit/references/structure/folder-structure.md` | Modify | Section 7 names the configured folder. |
| `.skilled/commands/speckit/search.md` | Modify | Describes automatic host index selection, including the named folder, and adds the setting error to exit 2. The `.claude` and `.opencode` copies reach this file through symlinks. |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Modify | A setting error at start-up exits 2 with the message instead of crashing with exit 1. |
| `README.md` | Modify | "How search works" names the host index folder and the setting. |
| `.skilled/skills/system-spec-kit/README.md` | Modify | The Gate 1 capability row names the host index folder and the setting. |
| `.skilled/commands/speckit/README.txt` | Modify | Two troubleshooting rows: the exit-2 setting error and the index not yet regenerated. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A host that names `"indexDir": ".index"` in `.skilled-host.json` at its root generates its index to `<root>/.index/trigger-index.json`, and a bare lookup from that root names `.index/trigger-index.json` in its `source` line. |
| REQ-002 | A host with no settings file, or a settings file with no `indexDir`, keeps `.speckit-index/` for generation, lookup and the host check, so no existing host changes. |
| REQ-003 | The host check counts the configured folder. A root that holds `.index/` is a host, and a root that holds only the stale default `.speckit-index/` is not, once `.index` is named. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A project linked into a host reads the folder that the owning host names, and the project needs no settings file of its own. |
| REQ-005 | An `indexDir` that is not a non-empty string, is absolute, is `.`, escapes the root, or lies inside `.skilled/` or `specs/` makes both scripts exit 2 and name `.skilled-host.json` on stderr. No default folder is used in its place. |
| REQ-006 | A settings file that is not valid JSON makes `hostIndexDir()` throw an error that names the file. |
| REQ-007 | The 15 related cli test files keep every baseline pass. |
| REQ-008 | An `indexDir` is judged by where it lands, not only by its spelling. A name that reaches outside the root or into `.skilled/` or `specs/` through a link or a different letter case, a name inside `.git/` or `node_modules/`, and a name that belongs to a regular file all make `hostIndexDir()` throw. Blank space around the name is ignored. |
| REQ-009 | `upgrade-legacy.mjs` run from a host whose setting cannot be honored exits 2 and names `.skilled-host.json` on stderr, with no stack trace. |
| REQ-010 | A bare lookup from a host whose setting names a folder holding no index, while `.speckit-index/trigger-index.json` still exists, prints one stderr line that names the leftover index and the named folder. Stdout and the exit status do not change. |
| REQ-011 | A project linked into a host that keeps an index of its own reads its own index. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With `{ "indexDir": ".index" }` at a host root, a bare generation writes `.index/trigger-index.json` and a bare lookup from that root reads it, with no flag.
- **SC-002**: A host with no settings file still resolves to `.speckit-index/`, and every one of the 20 original cases in `host-trigger-index.vitest.ts` keeps passing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `owningHostRoot()` from phase 022 | A wrong owner reads another repository's folder | The owner is the git toplevel of the vendored tree, with no ancestor walk, as phase 022 set it |
| Risk | A malformed or unsafe setting falls back to `.speckit-index/` without a word | High, because the scripts would read or publish an index the host did not ask for | Both scripts throw on a malformed or unsafe setting and exit 2 with the file named, and tests cover it |
| Risk | A host renames its folder but leaves the old `.speckit-index/` behind | Med | The host check counts only the configured folder, so the stale folder does not change the verdict, and one test covers it |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Each call that resolves the folder reads `.skilled-host.json` once. That adds one small file read per call and no subprocess. No timing is claimed.

### Security
- **NFR-S01**: A settings file cannot place the index outside the host root, inside `.skilled/` or inside `specs/`.
- **NFR-S02**: A settings file that is not valid JSON makes `hostIndexDir()` throw, and both scripts exit 2 on that error, so neither script reads or publishes a folder the host did not name.

### Reliability
- **NFR-R01**: A root with no settings file resolves exactly as it did before this change.
- **NFR-R02**: The 15 related cli test files keep every baseline pass.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a settings file with no `indexDir` key keeps `.speckit-index/`, while an empty or whitespace-only `indexDir` is refused with exit 2.
- Maximum input: the setting is one path string. The code adds no length check, so the file system's own path limit applies.
- Failure path: a settings file that is not valid JSON, or an unsafe `indexDir`, makes both scripts exit 2 and name `.skilled-host.json` on stderr, and no default folder is written.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 11/25 | Twelve files, 494 changed lines, one new contract function |
| Risk | 13/25 | The index location for every host and linked project, plus path-safety checks |
| Research | 4/20 | Handover, a HEAD measurement and a linked-layout check |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

