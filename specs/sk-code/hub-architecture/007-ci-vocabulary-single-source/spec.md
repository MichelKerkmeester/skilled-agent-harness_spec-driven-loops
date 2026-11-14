---
title: "Feature Specification: Make hub-router.json the authority for the sk-code-ci keywords and guard the copies"
description: "The sk-code-ci routing keywords exist in three copies that disagree and no guard compares them. This packet aligns the two prose rows to hub-router.json and puts the surface under the vocabulary guard."
trigger_phrases:
  - "ci vocabulary single source"
  - "make hub router json the authority"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Make hub-router.json the authority for the sk-code-ci keywords and guard the copies

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/379-sk-code-audit-remediation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `sk-code-ci` routing keywords exist in three copies. The two CI classes in `hub-router.json` hold 72. The `CI_WORKFLOW` row of the hub `ROUTER.md` holds 58. The `CI_WORKFLOW` row of the packet `ROUTER.md` holds 12, and one of them, `.github/workflows/`, is in neither other copy. The hub routes requests from the JSON, and the replay library and the playbook checks read the two rows, so a replay can disagree with the live route. The router-sync guard compares such copies only for a surface listed under `vocabularyMirrors`, and `sk-code-ci` is not listed. The audit packet recorded this as ledger row `H7` and left it for a packet of its own.

### Purpose
The three copies hold one keyword set, the one in `hub-router.json`, and the router-sync guard fails when they differ again.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Captured on 2026-11-14 from the repository root, at commit `d5489b8930`. The second command prints the sizes of the JSON copy, the hub row and the packet row.

```text
$ node -e "const h=require('./.skilled/skills/sk-code/hub-router.json');console.log(h.routerSignals['sk-code-ci'].classes.flatMap(c=>h.vocabularyClasses[c].keywords).length)"
72
exit=0

$ node -e "const l=require('./.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs');const k=s=>s.intentSignals.CI_WORKFLOW.keywords.length;console.log(k(l.loadSurfaceRouter('.skilled/skills/sk-code')),k(l.parseRouter(null,'.skilled/skills/sk-code/sk-code-ci')))"
58 12
exit=0

$ grep -n 'vocabularyMirrors' .skilled/skills/sk-code/hub-router.json
20:  "vocabularyMirrors": ["sk-code-frontend"],
exit=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Write the 72 keywords of the two CI classes, in the JSON's order, into the `CI_WORKFLOW` row of the hub `ROUTER.md`.
- Write the same 72 keywords into the `CI_WORKFLOW` row of `sk-code-ci/ROUTER.md`.
- Add `sk-code-ci` to `vocabularyMirrors` in `hub-router.json`.
- Point the packet's intent model line at the row, so the keywords are not repeated in prose.
- Re-mint the route manifest, which follows from any change to `hub-router.json`.
- Carry the seven new multi-word phrases of the hub row into the hub's advisor signals with `generate-router-intent-signals.cjs`, which the commit gate requires.
- Raise the hub version and the `sk-code-ci` packet version and write one release note each.

### Out of Scope
- The keywords of the two CI classes in `hub-router.json`. The operator's answer of 2026-11-14 makes them the authority, so none is added, removed or reworded
- The guard's code and its test. The comparison exists and is tested with a throwaway hub
- The findings ledger of the audit packet. That packet is closed, and this packet cites its row `H7`

### Files to Change

| File Path | Change Type | Description |
|---|---|---|
| `.skilled/skills/sk-code/ROUTER.md` | Modify | The `CI_WORKFLOW` keyword row |
| `.skilled/skills/sk-code/sk-code-ci/ROUTER.md` | Modify | The `CI_WORKFLOW` keyword row, and the intent model line that repeated the keywords in prose |
| `.skilled/skills/sk-code/hub-router.json` | Modify | `vocabularyMirrors`, version |
| `.skilled/skills/sk-code/mode-registry.json`, `.skilled/skills/sk-code/description.json`, `.skilled/skills/sk-code/SKILL.md` | Modify | Hub version |
| `.skilled/skills/sk-code/sk-code-ci/SKILL.md` | Modify | Packet version |
| `.skilled/skills/sk-code/changelog/`, `.skilled/skills/sk-code/sk-code-ci/changelog/` | Create | One release note each |
| `.skilled/skills/sk-code/graph-metadata.json` | Modify | Seven generated advisor signals, written by `generate-router-intent-signals.cjs` |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` and its authored copy under `specs/sk-doc/z_archive/` | Modify | The route manifest, re-minted because `hub-router.json` changed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|---|---|
| REQ-001 | `grep -c '"vocabularyMirrors": \["sk-code-frontend", "sk-code-ci"\]' .skilled/skills/sk-code/hub-router.json` prints 1, and `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 2` prints `PASS check 2` and exits 0. |
| REQ-002 | `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` prints `all 4 guards PASSED` and exits 0. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|---|---|
| REQ-003 | The keyword count command in Measured Behavior still prints 72, and `git diff` of `hub-router.json` for this packet's code commit changes the `vocabularyMirrors` line and the `version` line only. |
| REQ-004 | `bash specs/sk-code/hub-architecture/007-ci-vocabulary-single-source/scratch/replay.sh` prints the same lines after the edit as before it, so `diff scratch/replay-before.txt scratch/replay-after.txt` prints nothing. |
| REQ-005 | With one keyword removed from the packet row, `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 2` prints `FAIL check 2` and exits 1, and it passes again after the restore. |
| REQ-006 | The newest file in `.skilled/skills/sk-code/changelog/` matches the `version` in `.skilled/skills/sk-code/SKILL.md`, `hub-router.json`, `mode-registry.json` and `description.json`, and the newest file in `.skilled/skills/sk-code/sk-code-ci/changelog/` matches the `version` in `.skilled/skills/sk-code/sk-code-ci/SKILL.md`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three copies of the `sk-code-ci` keywords are one set.
- **SC-002**: The router-sync guard fails when one copy changes alone.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Dependency | The vocabulary comparison the audit packet added to the router-sync guard | Without it nothing compares the copies | The packet is built on the branch that holds it |
| Risk | Sixty more keywords in the packet row change which requests a replay sends to `CI_WORKFLOW` | Med | The replay script runs before and after, and the playbook validators and guard leg 4 run after |
| Risk | The packet row loses `.github/workflows/` | Low | The JSON holds `.github/workflows`, which matches the same text. The replay script includes a prompt with a workflow path |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

N/A: this packet runs no service. Its limits are the counts and exit statuses in section 4.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a request with no CI word still selects no intent in the packet router, which the replay script's last prompt shows.
- Maximum input: all 72 keywords are in each row, in the JSON's order.
- Failure path: one keyword removed from the packet row makes guard check 2 fail, and it passes after the restore.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|---|---|---|
| Scope | 6/25 | Two keyword rows, one list entry, two releases |
| Risk | 8/25 | Routing vocabulary that replays and playbook checks read |
| Research | 2/20 | The three sets were compared before planning |
| **Total** | **16/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
