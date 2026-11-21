---
title: "Feature Specification: Phase 3: mode-relocation"
description: "Move the Chrome DevTools and Aside packets into mcp-browser-use with their ids unchanged, unregister them from mcp-tooling, widen the mutation guard to the new hub, rewrite path references, regenerate generated files and leave history alone."
trigger_phrases:
  - "phase 3 mode relocation"
  - "move chrome devtools and aside modes"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: mode-relocation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-21 |
| **Branch** | `worktrees/505-mcp-browser-use-hub` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 6 |
| **Predecessor** | 002-hub-scaffold |
| **Successor** | 004-bladebro-mode |
| **Handoff Criteria** | The old-path `rg` pair, changelogs and benchmark reports excluded, prints no match |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the mcp-browser-use hub: Bladebro, Aside and Chrome DevTools browser modes specification.

Scope is refined from `../001-research/research/research.md` §6 (KQ4 blast radius), §7 (KQ5 naming) and §11, and from `../001-research/research/iterations/iteration-011.md`, which classifies every live file outside `mcp-tooling` as rewrite path, mode name unchanged, or historical.

**Scope Boundary**: The two mode packets, the `mcp-tooling` hub files that list them, the mutation-guard hub pattern, and the referencing files in the inventory below. Advisor vocabulary, graph rebuild and mirrors wait for 005.

**Dependencies**:
- 002-hub-scaffold complete: the hub exists with stub packets for both modes.
- None outstanding: the operator answered both section 10 questions on 2026-11-21.

**Deliverables**:
- Both packets under `.skilled/skills/mcp-browser-use/` with folder, `workflowMode` and `packetSkillName` unchanged.
- `mcp-tooling` registering six modes.
- A pre-commit hook and mutation guard that send scripts under `mcp-browser-use/` to the guard, landing with the move so the guard is never blind to them.
- Every live path reference rewritten, every generated file regenerated, history untouched.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Chrome DevTools and Aside packets live under `.skilled/skills/mcp-tooling/`. Live files across `.skilled` name them in three different ways: as a filesystem path, as a bare mode id, or as generated data. KQ5 kept the `mcp-` prefix, so the ids survive the move and only the `mcp-tooling/` path segment changes (`research.md` §7). A blind search-and-replace would rewrite stable ids, hand-edit files that must be regenerated, and alter history.

### Purpose
Both modes resolve from the new hub, `mcp-tooling` lists its six remaining modes, and no live file points at the old paths.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Measured 2026-11-21. The earlier count of 45 outside files did not exclude `benchmark/reports/`; these commands do.
```text
$ rg -l 'mcp-chrome-devtools|mcp-aside-devtools' .skilled -g '!**/changelog/**' -g '!**/benchmark/reports/**' | grep -v '^.skilled/skills/mcp-tooling/' | wc -l
      41
$ rg -l 'mcp-tooling/mcp-(chrome|aside)-devtools' .skilled -g '!**/changelog/**' -g '!**/benchmark/reports/**' | grep -v '^.skilled/skills/mcp-tooling/' | wc -l
      14
$ rg -l 'mcp-chrome-devtools|mcp-aside-devtools' .skilled/skills/mcp-tooling -g '!**/changelog/**' -g '!**/benchmark/reports/**' | grep -vE '^.skilled/skills/mcp-tooling/mcp-(chrome|aside)-devtools/' | wc -l
      29
$ rg -n 'mcp-tooling/\)\?' .skilled/scripts/git-hooks/pre-commit .skilled/commands/doctor/scripts/check-mcp-mutation-class.sh
.skilled/scripts/git-hooks/pre-commit:632:  ... grep -Eq '^\.(opencode|skilled)/(skills/(mcp-tooling/)?mcp-[a-z-]+/(scripts/...
.skilled/commands/doctor/scripts/check-mcp-mutation-class.sh:124:    r"^skills/(mcp-tooling/)?mcp-[a-z-]+/"
$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 400 --files 70 --no-recommend-phases
Recommended Level: 2 (Verification)
Score: 48/100 | Confidence: 80%
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete the two 002 scaffold stubs, then `git mv` `.skilled/skills/mcp-tooling/mcp-chrome-devtools/` and `.skilled/skills/mcp-tooling/mcp-aside-devtools/` into `.skilled/skills/mcp-browser-use/` without renaming (`research.md` §7, §11).
- Remove the two modes from `mcp-tooling`'s registry, router, root `ROUTER.md`, `SKILL.md`, `README.md`, `description.json`, mode-id entities in `graph-metadata.json`, feature catalog and hub-routing playbook, then regenerate its `leaf-manifest.json` (`research.md` §6).
- Register both in the new hub's registry and routers; regenerate the new hub's `leaf-manifest.json`.
- Rewrite every path reference, regenerate every generated file, and leave historical files alone, per the inventory below (`iteration-011.md` findings 2-6).
- Widen the hub segment from `(mcp-tooling/)?` to `(mcp-tooling/|mcp-browser-use/)?` in the pre-commit hook regex (`.skilled/scripts/git-hooks/pre-commit:632`), and the guard's `HOOK_PATTERN` (`check-mcp-mutation-class.sh`), add the two matching `skills/mcp-browser-use/mcp-*` entries to its `DISCOVERY_GLOBS`, update the manifest header's coverage comment to match, and add a test case for a script under `skills/mcp-browser-use/mcp-*`. Without this, the moved packets' `install.sh` and `doctor.sh` are never sent to the guard.
- `.claude`, `.opencode` and `.pi` skill directories are symlinks into `.skilled/skills` and follow the move with no edit (`research.md` §6).

### Out of Scope
- Advisor vocabulary in `mcp-tooling/graph-metadata.json`, advisor graph rebuild, compiled routing and runtime mirrors: 005 owns them.
- Changelogs, benchmark reports and every `specs/**` artifact: they record past state (`research.md` §6).
- Renaming any mode id: KQ5 keeps them (`research.md` §7).

### Files to Change

**Highest-risk edit:** the doctor mutation-class manifest. Its two `skill_dir` values hard-code the old paths, and a stale `skill_dir` silently drops mutation-class coverage (`iteration-011.md` finding 7). Re-point it first and re-run its test before calling anything else done.

| File Path | Change Type | Class | Description |
|-----------|-------------|-------|-------------|
| .skilled/skills/mcp-tooling/mcp-chrome-devtools/ | Move | Packet | `git mv` to `mcp-browser-use/mcp-chrome-devtools/` |
| .skilled/skills/mcp-tooling/mcp-aside-devtools/ | Move | Packet | `git mv` to `mcp-browser-use/mcp-aside-devtools/` |
| .skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml | Modify | Rewrite path | Both `skill_dir` values, highest risk; the header coverage comment names the new hub |
| .skilled/scripts/git-hooks/pre-commit | Modify | Guard pattern | Line 632 hook regex sees `mcp-browser-use/` |
| .skilled/commands/doctor/scripts/check-mcp-mutation-class.sh | Modify | Guard pattern | `HOOK_PATTERN` and `DISCOVERY_GLOBS` see `mcp-browser-use/` |
| .skilled/commands/doctor/scripts/tests/check-mcp-mutation-class.test.sh | Modify | Guard pattern | One case for a script under `skills/mcp-browser-use/mcp-*` |
| .skilled/bin/tests/mcp-installers.test.cjs | Modify | Rewrite path | `path.join(SKILLS, 'mcp-tooling', 'mcp-chrome-devtools', 'scripts')` at line 29 |
| .skilled/skills/mcp-code-mode/scripts/README.md | Modify | Rewrite path | The `_utils.sh` byte-identical coupling names the Chrome packet path |
| .skilled/skills/mcp-code-mode/manual-testing-playbook/clickup-and-chrome-via-cm/{chrome-navigate-screenshot,sibling-pair-handover}.md | Modify | Rewrite path | Two playbook rows |
| .skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt | Modify | Rewrite path | Both packet playbook directories |
| .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md | Modify | Rewrite path | Relative link into the Chrome packet |
| .skilled/skills/sk-doc/scripts/tests/render/web-markup-and-css.md | Modify | Rewrite path | Relative link into the Chrome packet |
| .skilled/skills/system-spec-kit/runtime/data/trigger-index.json and `runtime/cli/retrieval/fixtures/{corpus-manifest,generation-diagnostics,phrase-variants}.json` | Regenerate | Generated | One `generate-trigger-index.mjs` run rewrites all four |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/semantic-probes.json | No change | Historical | Captured once with no runtime reader; regeneration does not refresh it (`runtime/cli/retrieval/README.md`) |
| .skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-measurement-{report.md,results.jsonl} | Regenerate | Generated | `observability/smart-router-measurement.ts` |
| .skilled/skills/sk-doc/scripts/tests/code-folder/{baseline-readme-verdicts,durable-directory-manifest}.json | Regenerate | Generated | Path-bearing test snapshots read by `test_readme_verdict_parity.py`; name the exact regeneration command in `implementation-summary.md` when the phase runs |
| .skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json | Regenerate | Generated | Built from `git log -M` rename records, so it only sees the move once the operator commits it (D8) |
| .skilled/skills/mcp-tooling/{SKILL.md,ROUTER.md,README.md,mode-registry.json,hub-router.json,description.json,graph-metadata.json} | Modify | Hub, hand-edit | Drop both modes; `graph-metadata.json` loses the mode-id entities here and its browser vocabulary in 005 |
| .skilled/skills/mcp-tooling/feature-catalog/{feature-catalog.md,workflow-vs-transport-routing/workflow-vs-transport-routing.md} | Modify | Hub, hand-edit | Drop browser-mode rows |
| .skilled/skills/mcp-tooling/manual-testing-playbook/manual-testing-playbook.md and six `hub-routing/*.md` scenarios | Modify | Hub, hand-edit | Browser scenarios leave this hub; 006 recreates them for the new hub |
| .skilled/skills/mcp-tooling/leaf-manifest.json | Regenerate | Generated | `generate-leaf-manifest.cjs --write .skilled/skills/mcp-tooling` |
| .skilled/skills/mcp-browser-use/{mode-registry.json,hub-router.json,leaf-manifest.json} | Modify / Regenerate | New hub | Real packets replace the stubs; manifest regenerated |
| 12 files in `mcp-tooling/mcp-{click-up,figma,mobbin,refero}/` (`SKILL.md`, `README.md`, `ROUTER.md`, `references/*.md`) | No change | Sibling, bare id | Cross-reference ids stay valid; parent D3 keeps these packets unchanged (operator, 2026-11-21) |
| 22 files outside `mcp-tooling`: seven `cli-orca` docs, `.skilled/skills/README.txt`, the compiled-routing canary fixture, advisor golden and labeled prompt fixtures, two advisor tests, the divergence-ledger script, `mcp-code-mode` `SKILL.md` and `graph-metadata.json`, `sk-code` and `sk-code-frontend` READMEs, `sk-design-md-generator` `SKILL.md` and `README.md`, the advisor `native-validate-slices.md` playbook, the `skill-md-template.md` example | No change | Mode name unchanged | Bare ids stay valid under KQ5 (`iteration-011.md` finding 4) |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs`, changelogs, `benchmark/reports/**`, `specs/**` | No change | Historical | The only hit in `corpus.mjs` is a `specs/` folder name |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | mcp-tooling lists six modes | `jq '.modes | length' .skilled/skills/mcp-tooling/mode-registry.json` prints 6 |
| REQ-002 | No live reference to the old paths remains, and the old hub's own files drop both ids | `rg -l 'mcp-tooling/mcp-(chrome|aside)-devtools' .skilled -g '!**/changelog/**' -g '!**/benchmark/reports/**'` and `rg -l 'mcp-(chrome|aside)-devtools' .skilled/skills/mcp-tooling/{mode-registry.json,hub-router.json,leaf-manifest.json,ROUTER.md,SKILL.md,README.md}` print nothing. Bare ids in the four sibling packets are not checked |
| REQ-003 | Both hubs pass their own check | `parent-skill-check.cjs` exits 0 for `.skilled/skills/mcp-tooling` and for `.skilled/skills/mcp-browser-use` |
| REQ-005 | The doctor mutation-class guard covers the moved packets | Both `skill_dir` values in `mcp-mutation-class-manifest.yaml` point under `.skilled/skills/mcp-browser-use/`, and `bash .skilled/commands/doctor/scripts/tests/check-mcp-mutation-class.test.sh` exits 0 |
| REQ-006 | The installer test and its byte-identical `_utils.sh` coupling hold | `node --test .skilled/bin/tests/mcp-installers.test.cjs` exits 0 |
| REQ-008 | The mutation guard sees the moved scripts | `rg -n 'mcp-browser-use' .skilled/scripts/git-hooks/pre-commit .skilled/commands/doctor/scripts/check-mcp-mutation-class.sh` prints the hook line, the `HOOK_PATTERN` line and two `DISCOVERY_GLOBS` lines; `bash .skilled/commands/doctor/scripts/tests/check-mcp-mutation-class.test.sh` exits 0 including the new `mcp-browser-use/` case; `check-mcp-mutation-class.sh` lists the Chrome DevTools and Aside scripts under their new paths |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Generated files are regenerated, not hand-edited | Each file of class Generated in section 3 is rebuilt by its generator, named in `implementation-summary.md` |
| REQ-007 | Mode ids are unchanged | `jq -r '.modes[].packetSkillName'` on the new registry prints `mcp-chrome-devtools` and `mcp-aside-devtools` among its ids, and the 22 no-change files show no diff |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The old-path `rg` pair prints no match outside changelogs and benchmark reports.
- **SC-002**: Both per-hub checks end with `OK: parent-skill-check`.
- **SC-003**: The mutation-class and installer tests both exit 0 after the move, the mutation-class test with a case for a script under `mcp-browser-use/`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A stale `skill_dir` in the doctor mutation-class manifest drops coverage with no error | High | Edit it first; REQ-005 runs its test |
| Risk | The hook and guard patterns match only `skills/(mcp-tooling/)?mcp-*/`, so moved scripts go unchecked | High | Widen both before the `git mv`; REQ-008 runs the test with a new-hub case |
| Risk | `_utils.sh` must stay byte-identical between `mcp-code-mode` and the Chrome packet | High | Move with `git mv` so bytes do not change; REQ-006 runs the enforcing test |
| Risk | Advisor fixtures assert `mcp-chrome-devtools` as a route label | Med | Ids are unchanged, so fixtures stay; 005 checks they still resolve under hub-membership routing (`research.md` §11) |
| Risk | The divergence-ledger script special-cases `'mcp-chrome-devtools' \|\| 'mcp-tooling'` at line 181 | Med | No edit here; 005 decides whether `mcp-browser-use` joins that check |
| Dependency | `cite-drift-redirects.json` reads git rename history | Low | Regenerate after the operator commits the move; record it as pending until then |
| Dependency | The inventory drifts as other work lands | Med | Re-run the Measured Behavior commands at the start and diff against section 3 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. The change moves documents and metadata and runs no service.

### Security
- **NFR-S01**: No file under either packet changes bytes during the move: `git diff -M --stat` reports each packet file as a pure rename.

### Reliability
- **NFR-R01**: Every hand-edit, regeneration and test listed in section 3 and REQ-001 to REQ-008 reruns clean from the final tree.

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: if the Measured Behavior commands find a new file not in section 3, classify it with the same three rules before editing it.
- Maximum input: the 128 files inside the two packets move as two `git mv` operations, never as per-file edits.
- Failure path: if either per-hub check or either test fails after the move, roll back with the plan's rollback and leave the hubs as they were.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | About 70 live files plus two packet moves; most are regenerations or no-ops |
| Risk | 15/25 | A shared doctor guard, a byte-identical test coupling, advisor fixtures |
| Research | 5/20 | Inventory classified by `iteration-011.md`; re-run only |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No question is open.

### Answered

- **Do cross-reference edits in four sibling packets count as changing them?** Answered by the operator 2026-11-21: **no edit (Option B).** The twelve files in `mcp-click-up`, `mcp-figma`, `mcp-mobbin` and `mcp-refero` keep their bare `mcp-chrome-devtools` and `mcp-aside-devtools` cross-references, and parent D3 holds. REQ-002's second `rg` checks only the old hub's own registry, routers, leaf manifest, `SKILL.md` and `README.md`. The parent goal's third criterion was amended to match.
- **Which phase carries the mutation-guard pattern edits?** Answered by the operator 2026-11-21: **this phase.** The pre-commit hook regex, the guard's `HOOK_PATTERN` and `DISCOVERY_GLOBS`, the manifest header comment and a test case for `skills/mcp-browser-use/mcp-*` land here together with the move, so the guard is never blind to the moved scripts (REQ-008).
- Re-levelled to Level 2 on 2026-11-21 with `upgrade-level.sh`, after `recommend-level.sh --loc 400 --files 70` returned Level 2.
<!-- /ANCHOR:questions -->

---
