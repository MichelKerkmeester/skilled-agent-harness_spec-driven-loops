---
title: "Implementation Plan: Make hub-router.json the authority for the sk-code-ci keywords and guard the copies"
description: "Derive the 72 keywords from hub-router.json. Write them into the two prose rows and list the surface under vocabularyMirrors. Prove it with guard check 2 and a replay diff."
trigger_phrases:
  - "ci vocabulary single source plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Make hub-router.json the authority for the sk-code-ci keywords and guard the copies

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|---|---|
| **Language/Stack** | Markdown, JSON |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 2` |

### Overview
Derive the 72 keywords from `hub-router.json`. Write them into the two prose rows and list the surface under `vocabularyMirrors`. Prove it with guard check 2 and a replay diff.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `spec.md` section 2 states the problem and section 3 lists the files to change
- [ ] Every requirement in `spec.md` section 4 names a command and its expected output
- [ ] `scratch/replay-before.txt` exists

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`
- [ ] `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 2` prints `PASS check 2` with `sk-code-ci` under `vocabularyMirrors`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/hub-architecture/007-ci-vocabulary-single-source --strict --quiet` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One authority, two copies written from it

### Key Components
- **`.skilled/skills/sk-code/hub-router.json`**: The authority. Its two CI classes are read, never edited
- **`.skilled/skills/sk-code/ROUTER.md`** and **`.skilled/skills/sk-code/sk-code-ci/ROUTER.md`**: Each holds one `CI_WORKFLOW` keyword row
- **`.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs`**: Check 2 compares the three copies for a listed surface

### Data Flow
The keywords of `code-ci-aliases` and `code-ci-runtime` are joined in class order. That list replaces the keyword list of each row. The guard then reads all three and reports any keyword one copy lacks.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---|---|---|---|
| The two `CI_WORKFLOW` rows | Feed the replay library and the playbook checks | update | Guard check 2, and the replay diff |
| `hub-router.json` CI classes | Route live requests | unchanged | The keyword count stays 72 |
| Compiled routing | Reads `hub-router.json` | unchanged | The replay diff holds the hub decision for 27 prompts |
| Hub and packet playbooks | Replay scenarios through the rows | unchanged | `validate-playbook-package.cjs` and guard leg 4 |

Required inventories:
- Same-class producers: the two rows, both changed in this packet.
- Consumers of changed files: the rows above name each one and what proves it is unaffected.
- Matrix axes: N/A, one keyword set.
- Algorithm invariant: N/A, this packet changes no parser, resolver or security path.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the replay baseline and the guard baseline. Implementation writes the two rows, lists the surface and raises the two versions. Verification runs guard check 2, the replay diff, the mutation and the drift guards.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|---|---|---|
| Unit | The guard's existing tests | `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests` |
| Integration | Hub drift guards and the setup battery | `run-all-drift-guards.sh`, `sk-code-setup-check.cjs` |
| Manual | The replay diff and one mutation | `scratch/replay.sh`, `diff` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| The vocabulary comparison in guard check 2 | Internal | Green | No guard for the copies |
| The operator's answer of 2026-11-14 on row `H7` | Internal | Green | No authority among the copies |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A drift guard, a playbook validator or the replay diff fails after the edit.
- **Procedure**: Revert the packet's code commit with `git revert <sha>`.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|---|---|---|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Closing this packet |
<!-- /ANCHOR:phase-deps -->

---

