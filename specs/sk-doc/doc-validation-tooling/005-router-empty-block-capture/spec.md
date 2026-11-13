---
title: "Feature Specification: Stop the router block patterns from capturing past a one-line empty INTENT_SIGNALS or RESOURCE_MAP block"
description: "The pattern that reads a router's INTENT_SIGNALS block needs a closing brace on its own line. A block written as one line has none, so the capture runs on into the next literal and its strings are recorded as the hub's routing phrases."
trigger_phrases:
  - "router empty block capture"
  - "intent signals generator empty block"
  - "INTENT_SIGNALS one line block"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Stop the router block patterns from capturing past a one-line empty INTENT_SIGNALS or RESOURCE_MAP block

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/365-git-lift-and-router-capture-plans` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Four scripts read a router's `INTENT_SIGNALS` block with the pattern `/INTENT_SIGNALS\s*=\s*\{([\s\S]*?)\n\}/`, which ends only at a closing brace that starts a line. A block declared on one line, such as `INTENT_SIGNALS = {}`, has no such brace, so the capture continues to the closing brace of a later literal. Every quoted string in between is then read as a phrase the router declared. Three scripts read `RESOURCE_MAP` with the same shape and have the same fault. That makes seven sites in five scripts.

Barter hit this first. Its sk-git `ROUTER.md` declares `INTENT_SIGNALS = {}`, and the generator wrote two questions from a later checklist literal into sk-git's `intent_signals`. The scaffold in this repository, `parent-skill-root-router-template.md`, carries the same one-line form, so a hub scaffolded in its pointer state is exposed here too.

### Purpose
A one-line block yields exactly its own contents, an empty one yields nothing, and every multi-line block reads as it does today.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node -e 'const t=require("fs").readFileSync(".skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-root-router-template.md","utf8");const m=/INTENT_SIGNALS\s*=\s*\{([\s\S]*?)\n\}/.exec(t.slice(t.indexOf("INTENT_SIGNALS = {}")));console.log("captured characters:",m[1].length);console.log("captured lines:",m[1].split("\n").length)'
captured characters: 2792
captured lines: 58

$ node specs/sk-doc/doc-validation-tooling/005-router-empty-block-capture/scratch/compare-captures.cjs
INTENT_SIGNALS: files=57 identical=56 differ=1
  sk-doc/scripts/tests/skill-router/ROUTER.md
RESOURCE_MAP: files=57 identical=56 differ=1
  sk-doc/scripts/tests/skill-router/ROUTER.md
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the `INTENT_SIGNALS` pattern at its four sites with one that ends a one-line block on its own line.
- Replace the `RESOURCE_MAP` pattern at its three sites the same way.
- Edit the two registry compilers in their authored files under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout`, then rebuild the served closure with `compiled-route-sync.cjs` so the served copies match.
- Add one test case to each of the three existing sk-doc test files, using a router whose one-line empty block is followed by another literal.
- Rerun the capture comparison over every `ROUTER.md` to show that only one-line blocks change.

### Out of Scope
- A shared helper for the pattern - seven copies is a real duplication, but a new module changes five scripts' imports and two of them live outside sk-doc. It is noted here and not built.
- A one-line block followed by a trailing comment, such as `INTENT_SIGNALS = {} # none` - the new pattern still over-captures it, and no router in the repository writes one.
- The authored-only compiler `004-compiler-n1-shadow/compiler/source-model.cjs`, which carries the same `INTENT_SIGNALS` pattern - it is not part of the served closure, so nothing runs it at routing time.
- Barter's sk-git metadata - Barter regenerates it after it re-pins.
- Rewriting the scaffold template's one-line block - the pattern fix makes that form safe.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs` | Modify | `INTENT_SIGNALS` pattern in `declaredPhrases` |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs` | Modify | `INTENT_SIGNALS` pattern in `declaredPhrases` |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-hub-vocabulary-source.cjs` | Modify | `INTENT_SIGNALS` and `RESOURCE_MAP` patterns in `parseRouter` |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/009-sk-design/lib/registry-compiler.cjs` | Modify | `INTENT_SIGNALS` and `RESOURCE_MAP` patterns in `parseIntentLayer`, in the authored file |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/lib/registry-compiler.cjs` | Rebuild | Served copy, written by `compiled-route-sync.cjs` |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs` | Modify | `RESOURCE_MAP` pattern at its one site, in the authored file |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs` | Rebuild | Served copy, written by `compiled-route-sync.cjs` |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-router-intent-signals-orphans.test.cjs` | Modify | One case: an empty one-line block generates no signals |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/ci-router-vocabulary-reach.test.cjs` | Modify | One case: an empty one-line block declares no phrases |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/ci-hub-vocabulary-source.test.cjs` | Modify | One case: an empty one-line block and map yield no intents |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A router with `INTENT_SIGNALS = {}` followed by another literal generates no signals from that literal | The new generator test case passes, and it fails against the old pattern |
| REQ-002 | A one-line block that is not empty yields its own contents and nothing after it | `compare-captures.cjs` lists `sk-doc/scripts/tests/skill-router/ROUTER.md` as the only file that differs, for both block names |
| REQ-003 | Every multi-line block reads as before | `compare-captures.cjs` prints `identical=56` of 57 files for both block names |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The reach check treats a router with an empty one-line block as declaring nothing | The new reach test case passes |
| REQ-005 | The sk-design and deep-loop registry compilers still build from their routers | `node .skilled/bin/compiled-route-sync.cjs --verify` exits 0, `--check` prints that all served copies match their authored files, and `node --test .skilled/bin/tests/` fails no test that passed before the edit |
| REQ-006 | The existing sk-doc script tests pass | `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/` exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On the scaffold template's one-line block, the new pattern captures 0 characters, where the Measured Behavior block shows 2792 today.
- **SC-002**: `rg -c 'INTENT_SIGNALS\\s\*=\\s\*\\\{\(\[\\s\\S\]\*\?\)\\n\\\}' .skilled --glob '*.cjs'` finds no file, so no copy of the old pattern remains.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `node --test`, which the existing test files already use | None expected | No new package |
| Risk | The new pattern reads a multi-line block differently and a hub's generated signals change | Med | REQ-003 compares old and new captures over all 57 routers before the change is kept |
| Risk | The two registry compilers feed compiled routing artifacts that a freshness check compares | Med | REQ-005 runs its tests. The served copies are byte-checked against authored files in the archived router program, so the edit goes into the authored files and the closure is rebuilt, verified and finalized, with `--revert` as the way back |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does editing a `registry-compiler.cjs` require regenerating a compiled routing artifact? Decision: yes. Each served compiler is a byte copy of an authored file under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout`, and `compiled-route-sync.cjs --check` fails when they differ. The operator chose on 2026-11-13 to include them: edit the authored files, rebuild the closure, verify and finalize.
- Should the seven copies become one helper? Decision: not in this packet. The generator's own comment says it keeps one definition with the reach check, and that is already untrue. It is raised here for a later packet.
<!-- /ANCHOR:questions -->

---
