---
title: "Feature Specification: Phase 2: router-file-tooling"
description: "Every reader that needs a skill's machine router parses it out of SKILL.md, so the move into a sibling ROUTER.md has nowhere to land. This phase builds one resolver that finds the router in ROUTER.md and falls back to the SKILL.md section during the migration, moves router replay, router sync and the dead-route scan onto it, teaches the Hermes generator to carry the file, and fixes the skill advisor's freshness signature so a router edit is noticed."
trigger_phrases:
  - "router file tooling"
  - "phase 2 router file tooling"
  - "router file resolver"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: router-file-tooling

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-29 |
| **Branch** | `worktrees/269-skill-router-files` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 6 |
| **Predecessor** | 001-deep-research |
| **Successor** | 003-check-and-template-canon |
| **Handoff Criteria** | Every reader resolves a sibling `ROUTER.md`, a skill that declares assignments in two documents is rejected instead of guessed at, and a router-only edit turns advisor freshness stale |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Skill router files specification. Phase 1 fixed the design: the research in `001-deep-research/research/research.md` names every reader of the machine router, how each runtime loads a skill, and the advisor defects. This phase changes the code those findings name and moves no router file.

**Scope Boundary**: the shared resolver and its three script callers, the Hermes generator, the advisor freshness signature, the plugin copy of that signature, the daemon watcher target list and one parity test between the two signatures.

**Dependencies**:
- `001-deep-research/research/research.md` section 4 for the reader inventory, section 5 for runtime loading and section 9 for the advisor defects.

**Deliverables**:
- One resolver module with a unit set that covers all three verdicts.
- Router replay, router sync and the dead-route scan reading through the resolver.
- The Hermes generator carrying `ROUTER.md` beside `SKILL.md`.
- A `ROUTER.md` probe in both freshness signatures, a watcher target and a parity test.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A skill's machine router sits at the end of its `SKILL.md`, and every reader that needs it reads that file. Router replay parses the block out of the file text and router sync calls the replay parser. The dead-route scan walks fenced blocks in `SKILL.md` with its own extractor. Because each reader decides for itself where the router lives, the parent specification's move into a sibling `ROUTER.md` cannot start: a skill whose router had moved would read as a skill with no router.

The skill advisor carries the same defect on the freshness side. Its signature hashes `SKILL.md` and `graph-metadata.json` for each skill and nothing else, so an edit to `ROUTER.md` alone leaves the graph reporting `live` while its router content is stale.

### Purpose
One resolver says where a skill's machine router lives and refuses to guess when a skill declares one in two places, every reader asks it, and the advisor notices a router edit.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run in this worktree before the phase started:
```text
$ grep -rl "MACHINE ROUTER" --include=SKILL.md .skilled/skills | wc -l
54
$ ls .skilled/skills/*/ROUTER.md | wc -l
7
$ grep -l "MACHINE ROUTER" .skilled/skills/*/ROUTER.md | wc -l
0
$ grep -rn "^## .*MACHINE-READABLE ROUTER" .skilled/skills/*/ROUTER.md | wc -l
7
$ node -e 'const p=require("path"),f=require("fs"),l=require("./.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs");const c={};for(const d of f.readdirSync(".skilled/skills",{withFileTypes:true}).filter(e=>e.isDirectory()).map(e=>e.name)){const r=p.join(".skilled/skills",d);if(!f.existsSync(p.join(r,"SKILL.md")))continue;const o=l.parseRouter(f.readFileSync(p.join(r,"SKILL.md"),"utf8"),r);c[o.routerSource]=(c[o.routerSource]||0)+1}console.log(JSON.stringify(c))'
{"hub-router.json":7,"inline":6}
$ node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs
router-sync: 5/5 checks passed
$ python3 .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py --root .skilled/skills --check-router
[alignment-drift] PASS
Scanned files: 5419
Findings: 0
```
The 7 skills that carry `ROUTER.md` today are the seven hubs, and all 7 resolve through `hub-router.json`. No skill declares assignments in two documents, so the rejection rule has no live case to break.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Build one resolver module that returns the `ROUTER.md` machine-router section, the `SKILL.md` machine-router section, or a dual-declaration verdict.
- Move router replay, router sync and the dead-route scan onto that resolver.
- Make the Hermes generator write `ROUTER.md` into every generated copy whose source skill has one.
- Add a `ROUTER.md` probe to the advisor freshness signature and to the plugin copy of it, add a watcher target, and add a parity test that fails when either signature loses the probe.

### Out of Scope
- Moving any router file: phases 004 and 005 move them, and this phase only makes their move readable.
- Reversing RS-004, rewriting RS-005, and moving `package_skill.py` and doctor check 12b onto the resolver: phase 003 owns the canon change, and it reuses the precedence rule this phase fixes.
- Changing any routing decision: the move changes where the router lives, not what it selects.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-file-resolver.cjs` | Create | The shared resolver: section grammar, precedence, dual-declaration verdict |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/router-file-resolver.test.cjs` | Create | One case per verdict, plus the heading grammar |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs` | Modify | `parseRouter` resolves through the resolver |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | Modify | `readSkillRouter` asks the resolver for the document |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` | Modify | A router-in-`ROUTER.md` case and a dual-declaration case |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py` | Modify | Reads `ROUTER.md` when it holds a machine-router section |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/test_verify_alignment_drift.py` | Modify | One case for a router in `ROUTER.md`, one for a dual declaration |
| `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` | Modify | Carries `ROUTER.md` and checks it for drift |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs` | Modify | A source skill with a router file lands it in the copy |
| `.skilled/skills/system-skill-advisor/runtime/lib/freshness.ts` | Modify | A third per-skill probe in `buildSourceSnapshot` |
| `.opencode/plugins/system-skill-advisor.js` | Modify | The same probe in `advisorSourceSignature` |
| `.skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts` | Modify | A `router-md` watch target |
| `.skilled/skills/system-skill-advisor/runtime/tests/daemon-watcher-new-root-ingestion.vitest.ts` | Modify | A discovered `ROUTER.md` becomes a target |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/router-signature-parity.vitest.ts` | Create | Both signatures change on a router-only edit |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `router-file-resolver.cjs` exports one function that returns the `ROUTER.md` machine-router section when that file declares assignments, the `SKILL.md` machine-router section when only `SKILL.md` does, and a dual-declaration verdict when both do | The resolver unit set prints one passing case per verdict |
| REQ-002 | Router replay resolves its router through the resolver, and a fixture skill whose router sits only in `ROUTER.md` parses from that file | `node --test` on the replay and sync suites passes, and the fixture reports `routerSource` `ROUTER.md` |
| REQ-003 | A skill that declares assignments in both `ROUTER.md` and `SKILL.md` yields `parseable` false with `routerSource` `dual-declaration`, and no reader picks a side | A dual-declaration fixture reports the verdict through replay and through the dead-route scan |
| REQ-004 | The 7 skills that carry `ROUTER.md` today still resolve through `hub-router.json` | The source probe prints `{"hub-router.json":7,"inline":6}` after the change, the same as before it |
| REQ-005 | The dead-route scan reads its declarations from `ROUTER.md` when that file holds a machine-router section, keeps every path rooted at the skill, and still reports `ROUTER-DEAD-PATH` for a named leaf with no file | The scan over `.skilled/skills` prints `Findings: 0` and a fixture with a dead leaf in `ROUTER.md` prints one |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Router sync asks the resolver for the document instead of reading `SKILL.md` itself | `verify-router-sync.cjs` prints `5/5 checks passed` and no call site builds a `SKILL.md` path |
| REQ-007 | `sync-skills-hermes.cjs` writes `ROUTER.md` beside `SKILL.md` in each generated copy whose source skill has one, and `--check` reports drift on it | The generator suite passes, and a copy whose `ROUTER.md` is edited reports `DRIFT` |
| REQ-008 | The freshness signature carries a `ROUTER.md` probe per skill, and a skill with no `ROUTER.md` keeps the signature byte-identical to today | The freshness suite passes and a fixture without the file reports the same signature string |
| REQ-009 | The plugin signature carries the same third probe, and a parity test fails when either side loses it | The parity suite passes, and removing the plugin probe fails it |
| REQ-010 | The watcher discovers `ROUTER.md` as a target with reason `router-md` | The watcher suite prints a target whose path ends in `ROUTER.md` and whose reason is `router-md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The resolver unit set passes with one case per verdict, and a skill whose router sits only in `ROUTER.md` reports that file as its source.
- **SC-002**: The 7 `ROUTER.md` skills still report `hub-router.json`, `verify-router-sync.cjs` prints `5/5 checks passed`, and the scan over `.skilled/skills` prints `Findings: 0`.
- **SC-003**: A router-only edit changes the freshness signature, and the parity suite fails when the plugin probe is removed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The `## MACHINE ROUTER` heading this resolver reads | A `ROUTER.md` written without the heading resolves to nothing after phase 005 | Phase 003's template and phase 004's merge carry the heading, and the resolver unit set fails a file without it |
| Risk | A hub's stage-two assignment block in `ROUTER.md` takes over the mode projection | High: the seven hubs would route to different files | The resolver reads only the machine-router section, and no hub `ROUTER.md` carries that heading today |
| Risk | The Python scan repeats the precedence rule and drifts from the JavaScript one | Medium: the scan and replay would disagree about where a router lives | One parity case runs both over the same fixture trees, and the scan keeps its opt-in `--check-router` switch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocks this phase. The parent phase map also names the reach check, compiled routing and the leaf manifest for this phase, and research section 4 records that the registry compiler hashes `ROUTER.md` as source bytes already, that the root-router gate reads the hub root, and that the leaf manifest walks leaf roots without parsing `SKILL.md`. Those three need no change, and the parent row reads as stale once this phase closes.
<!-- /ANCHOR:questions -->

---
