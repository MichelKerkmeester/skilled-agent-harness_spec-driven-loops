---
title: "Feature Specification: Phase 16: upstream code alignment for overlaid files"
description: "Barter overlays 24 Skilled code files, and where an overlay copy breaks sk-code's Skilled standard the flaw is often already in the Skilled file it copies. This phase audits each Skilled counterpart and fixes those flaws at source, with no change in behavior, so a fix Barter makes in its copy does not have to be redone on every repin."
trigger_phrases:
  - "upstream code alignment"
  - "phase 16 upstream code alignment"
  - "overlaid file sk-code alignment"
  - "overlay upstream handoff"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 16: upstream code alignment for overlaid files

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-11-20 |
| **Branch** | `worktrees/499-overlay-readmes-and-alignment` |
| **Parent Spec** | ../spec.md |
| **Phase** | 16 of 16 |
| **Predecessor** | 015-alignment-command-overlay-targets |
| **Successor** | None |
| **Handoff Criteria** | Each of the 24 counterparts is fixed, recorded as aligned, or recorded as skipped with a reason, and the suites covering every changed file pass unchanged |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the overlay framework/root layout packet. It runs in Skilled on the same worktree branch as phases 014 and 015.

**Scope Boundary**: the Skilled counterparts of the code files Barter's manifest overlays. Barter's own copies are aligned by the ai-speckit session in its record 040.

**Dependencies**:
- `barter/ai-speckit/overlays/overlay-manifest.json`, read only, for the list of overlaid code.
- The handoff list the ai-speckit session writes, of flaws its copy shares with upstream.
- sk-code's Skilled mode, `.skilled/skills/sk-code/sk-code-skilled/`.

**Deliverables**:
- Behavior-neutral fixes in the Skilled counterparts.
- A per-file record: fixed, aligned, or skipped with the reason.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
When a Barter overlay copy breaks sk-code's Skilled standard because the Skilled file it copies does, fixing only the copy leaves the source wrong. Every repin then brings the flaw back in the parts Barter does not overlay, and the next Skilled change to that file drifts further from the fixed copy. The operator's rule: "If origin is not aligned and if that was the cause than we should fix skilled and barter."

### Purpose
Each Skilled counterpart of an overlaid code file meets the standard's behavior-neutral rules, so Barter's copy and its source agree on the lines neither changes on purpose.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ wc -l < /tmp/ovl-gates/016-up-files.txt    # code destinations in Barter's manifest with a Skilled counterpart, links resolved
24
$ awk -F'\t' '$3=="none"' /tmp/ovl-gates/016-candidates.tsv | wc -l    # Barter-only destinations
26
$ git -C /Users/michelkerkmeester/MEGA/Development/Skilled status --short -- $(cat /tmp/ovl-gates/016-up-files.txt) | wc -l
0
```
None of the 24 counterparts is dirty on Skilled main, so none is skipped for that reason. The read-only audits in `/tmp/ovl-gates/pi/g1.out` and `g2.out` report, among others, missing `COMPONENT:` headers in five git hooks and a packet number in a `review-research-paths.cjs` comment.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit the 24 Skilled counterparts against sk-code's Skilled mode, in read-only sweeps.
- Fix the behavior-neutral classes: the file header, comment hygiene, TSDoc and JSDoc on exported functions, the numbered `EXPORTS` section, and comments the code no longer matches.
- Apply every handoff item from the ai-speckit session, with the same text Barter's copy carries on those lines.

### Out of Scope
- Identifier renames, `[ ]` to `[[ ]]` conversions, moving a `require`, and renumbering hook sections whose markers tests grep. Each changes code tokens or load order, so the existing suites would have to prove more than this phase claims.
- The three folder entries: `local-skilled-alignment` is a gitignored private command in Skilled, and `sk-code-frontend` and `sk-git` are whole skill trees that Barter replaces wholesale rather than overlaying file by file.
- Barter's copies. The ai-speckit session owns them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/scripts/git-hooks/*` and `tests/pre-push.test.sh` | Modify | `COMPONENT:` headers and stale comments |
| `.skilled/bin/compiled-route-guard.cjs`, `canary-router.cjs` | Modify | Module header, JSDoc, comment hygiene |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `scripts/fanout-run.cjs`, `scripts/append-mode-event.cjs` | Modify | TSDoc, the `EXPORTS` section, the non-null assertion comment |
| `.skilled/skills/system-spec-kit/shared/review-research-paths.cjs` | Modify | Comment hygiene and JSDoc |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No fix changes behavior | The hook tests, the compiled-route tests, the symlink-engine tests, and the deep-loop and spec-kit vitests touching each changed file pass with the same counts as before |
| REQ-002 | Every handoff item is applied upstream, or recorded with the reason it is not | Each item has a row in `implementation-summary.md` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Each of the 24 counterparts is recorded as fixed, aligned, or skipped with a reason | `implementation-summary.md` lists all 24 |
| REQ-004 | No code comment carries a spec path, packet number or finding id | `rg -n 'post-028\|019-system-hardening' .skilled/skills/system-spec-kit/shared/review-research-paths.cjs` prints nothing |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every suite covering a changed file exits 0 with its baseline count.
- **SC-002**: Each upstream fix that a handoff item names matches Barter's copy on the changed lines.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The ai-speckit session's handoff list | Items added after this phase closes are missed | Re-read the list before closing, and record the time it was read |
| Risk | An upstream fix worded differently from Barter's copy leaves a new diff on the next repin | Med | Copy the text from Barter's copy for every handoff item |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Directory entries? Decision: out of scope, for the reasons in §3.
<!-- /ANCHOR:questions -->

---
