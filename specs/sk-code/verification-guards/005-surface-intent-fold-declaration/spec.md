---
title: "Feature Specification: Let a hub declare that a surface folds its child intents into one hub intent so the router sync check accepts it"
description: "Leg 2 of the sk-code router sync check requires every child surface intent to exist under the same name in the parent RESOURCE_MAP. A host hub that folds all intents of a surface into one hub intent fails that leg with one problem per child path. An optional surfaceIntentFolds key in hub-router.json declares the fold, and leg 2 then compares the surface's whole path set with that one hub intent."
trigger_phrases:
  - "surface intent fold declaration"
  - "let a hub declare that a surface folds"
  - "surface intent folds key"
  - "router sync fold"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Let a hub declare that a surface folds its child intents into one hub intent so the router sync check accepts it

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
| **Branch** | `worktrees/368-host-tree-portability-fixes` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`legSurfaceMap` in `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` builds one intent set from the parent `RESOURCE_MAP` and every surface child, then requires each child intent's paths under the same intent name in the parent map. A host repository that vendors Skilled folds all intents of a surface into one hub intent named after the surface, for example surface `sk-code-bartender` with child intent `URL` and hub intent `BARTENDER`. Leg 2 then reports every child path of that surface as missing, so the two real defects in the host hub are buried under 123 problems the fold alone causes, and the check can never pass there.

### Purpose
A host hub can declare each fold once in `hub-router.json`, leg 2 accepts the declared fold and still reports a child path the hub intent omits and a parent path no surface owns.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs
PASS check 1a: machine-router paths exist and the prose maps are routed
PASS check 1b: every routable reference or asset doc is routed
PASS check 2: surface RESOURCE_MAP equals the children union plus the parent tier
PASS check 3: compiled destinations, leaf-manifest and code-skilled RESOURCE_MAP agree
PASS check 4: playbook expected_resource is emitted by the router
router-sync: 5/5 checks passed
exit=0

$ node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs
tests 13
pass 13
fail 0

$ node --test .skilled/bin/tests/
tests 180
pass 179
fail 0
skipped 1

In the host's vendored tree, 16 surfaces, leg 2 as reported by the host and not rerun here:
125 problems
123 of the form `parent map <intent> is missing child path ...`, caused only by the fold
2 of the form `parent map <INTENT> cites <path>, which no surface child owns`, real defects
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read an optional top-level `surfaceIntentFolds` object from the hub's `hub-router.json` in leg 2, keyed by surface packet with one hub intent name as the value.
- Compare every child path of a folded surface, across all its intents, with the declared hub intent, and keep the folded surface's own intent keys out of the per-intent walk.
- Report a declaration whose surface is not a registered surface packet on disk, or whose hub intent is not a key of the parent map, and leave that surface unfolded.
- Add two cases to the existing `verify-router-sync.test.cjs`, one where a declared fold passes and one where a folded child path is missing from the hub intent.
- Name the new key in the `hub-router.json` row of the sk-code hub `README.md`.

### Out of Scope
- The orphan `shared/references/mode-packet-skeleton.md` in the host tree - it is a host overlay file, and the host must route it itself.
- The 2 real defects in the host hub - they are host content, and this change keeps them reported so the host can fix them.
- Any change in the host tree, including adding the `surfaceIntentFolds` declarations - the host adds them when it re-pins to the Skilled commit that carries this change.
- Skilled's own `hub-router.json` - its parent map and child intent keys match, so it declares no fold.
- A doc edit in the sk-code hub `SKILL.md` - that file is a hashed source of the sk-code compiled policy, and editing it would change the sk-code policy hash and stale its activation manifest. `plan.md` section 3 records the probe.
- Any registry compiler, served copy or activation manifest - no reader rejects the new key, so none of them changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | Modify | Add `surfaceIntentFolds` and apply the folds in `legSurfaceMap` |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` | Modify | Let `writeSurfaceRouting` take extra keys and add the two fold cases |
| `.skilled/skills/sk-code/README.md` | Modify | Name `surfaceIntentFolds` in the `hub-router.json` row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A declared fold whose hub intent holds every child path of the surface passes leg 2 | The new case `leg 2 accepts a declared fold whose parent intent holds every child path` passes, and the same hub without the declaration reports `parent map URL is missing child path sk-code-demo/references/routed.md` |
| REQ-002 | A folded child path the hub intent omits is reported under the hub intent | The new case `leg 2 reports a folded child path the declared parent intent omits` passes. The output holds `parent map DEMO is missing child path sk-code-demo/references/forms.md` and no `parent map URL` or `parent map FORMS` line |
| REQ-003 | With no `surfaceIntentFolds` key the guard behaves as today | `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` prints `router-sync: 5/5 checks passed` and exits 0, and the 13 existing cases in `verify-router-sync.test.cjs` still pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A fold cannot make leg 2 vacuous | A declaration naming a surface that is not a registered surface packet on disk prints `surfaceIntentFolds names <surface>, which is not a registered surface packet on disk`, and one naming a hub intent that is not a parent map key prints `surfaceIntentFolds maps <surface> to <intent>, which is not a parent map intent` |
| REQ-005 | Nothing outside the guard and its test changes behavior | `node --test .skilled/bin/tests/` reports `fail 0` and 180 tests, and `node .skilled/bin/compiled-route-manifest.cjs freshness --hub sk-code --skill-root .skilled/skills/sk-code` prints `"fresh":true` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` reports 15 tests and `fail 0`, and both new cases fail when run against the unchanged guard.
- **SC-002**: `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` prints `router-sync: 5/5 checks passed` and exits 0 after the change.
- **SC-003**: Once the host declares its folds, leg 2 there reports the 2 real defects and none of the 123 fold problems. This runs in the host tree and is not checked here.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `lib.loadSurfaceRouter` and `readSkillRouter` in `router-replay-lib.cjs` supply the parent map and each child map | If they change shape, the fold compares the wrong path sets | The two new cases build a real hub through those readers, so a shape change fails them |
| Risk | A host that adds the key to its `hub-router.json` changes that file's bytes, and the sk-code compiler hashes those bytes into the policy | Med | Known effect, measured in `plan.md` section 3. The host refreshes its sk-code activation manifest in the same re-pin. Skilled's file does not change, so Skilled's hash stays |
| Risk | A fold hides a child path that the hub intent cites under a different hub intent | Low | A folded path must sit under the declared hub intent or it is reported as missing there, so a path cited only elsewhere still fails |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should an invalid declaration still fold the surface? Decision: no. It is reported once and the surface is checked as if undeclared, so the check fails loudly instead of passing on a guessed intent.
- Should a folded surface's path cited under another hub intent be reported? Decision: no change. The existing rule already accepts a surface-declared path under an intent no unfolded child owns, and the fold does not narrow that rule.
- Does any reader of `hub-router.json` reject the new key? Decision: no. `plan.md` section 3 lists each reader with file and line.
<!-- /ANCHOR:questions -->

---
