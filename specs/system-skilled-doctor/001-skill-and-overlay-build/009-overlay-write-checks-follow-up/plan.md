---
title: "Implementation Plan: Phase 9: overlay-write-checks-follow-up"
description: "Fix the red CI check, three engine bugs, four review defects and three gaps in the overlay engine, one change per dispatched build agent, then review, remediate, align and republish v4.0.2.1."
trigger_phrases:
  - "overlay write checks follow up plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 9: overlay-write-checks-follow-up

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, standard library only |
| **Framework** | None. `node:test` for tests |
| **Storage** | `overlay-manifest.json` and `sync-state.json` in the overlay folder |
| **Testing** | `node --test` |

### Overview
Each change is one brief to one DeepSeek V4.1 Flash agent at max thinking, run through `pi` on llmgateway, in series because most changes touch `overlay-engine.cjs`. The orchestrating session reads each diff and runs the named test before it sends the next brief. Proof is the doctor test folder at `fail 0`, a green `main` and a deep review with no open P0 or P1 finding.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test tests/` in `.skilled/commands/doctor/scripts` prints `fail 0`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single engine script

### Key Components
- **`acquireLock`**: reads the pid from an existing lock and takes over on `ESRCH`. Today a killed run blocks every later run.
- **`sync-state.json`**: gains `links` (path to target) and `items` (overlay id to the item values written). Today the engine has no record of either, so it cannot tell its own link or item from a person's.
- **`planLayoutLinks` and `applyLayoutLink`**: retarget a link whose current target is the recorded one.
- **The `json-entry` writer**: removes a recorded item the overlay dropped when the live value still equals the written one.
- **`globToRegExp`**: compiles `**/` to zero or more whole segments.
- **`strictWriteRefusal` and `stagedUnownedChanges`**: skip `repin.exclude` paths, and the commit check compares normalised content.
- **`status`**: two new report lines and an `--audit` flag.
- **`relayout`**: a new target beside `apply` and `repin`. Today each project writes a one-off move script.
- **`overlay-guard/opencode`**: a seventh adapter over the unchanged hook core.

### Data Flow
`apply` reads the manifest and `sync-state.json`, plans, writes under the lock and writes the state back with what it wrote. `status` and `--guard` only read.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `overlay-engine.cjs` | Owns every check and write | Update | The new test file and the doctor test folder |
| `sync-state.json` readers | `repin` and `apply` read `pin` and `files` | Unchanged readers, new keys beside them | A test that loads a state file without the new keys |
| `overlay-guard` core | Forwards each path to `--guard` | Unchanged | `git status --short .skilled/hooks/overlay-guard/lib/overlay-guard.cjs` prints nothing |
| `overlay-guard` adapters | Six runtime adapters | Add OpenCode | The adapter test |
| `/doctor:overlay` router, routes, workflows, presentation | Describe targets and flags | Update | `route-validate.sh` and the contract test |
| `command-contract.json`, both command lists | Mirror the argument hint | Update | `command-catalog-mirror-check.cjs` prints `STATUS=OK` |
| Runtime mirrors | Generated from the command files | Regenerate | `sync-runtime-mirrors.cjs --check` prints `PASS` |

Required inventories:
- Same-class producers: `rg -n 'globToRegExp|acquireLock|readSyncState|writeSyncState' .skilled/commands/doctor/scripts`.
- Consumers of changed symbols: `rg -n 'sync-state|build-lock|relayout|--audit' .skilled --glob '*.cjs' --glob '*.md' --glob '*.yaml'`.
- Matrix axes: lock (dead pid, live pid, no pid, malformed), link (own, foreign, regular file), item (dropped and unchanged, dropped and hand-edited, kept), glob (zero, one and two segments, name prefix).
- Algorithm invariant: the engine removes or replaces only what its own state file says it wrote and what still equals what it wrote.

### Rejected or deferred recommendations

| Recommendation | Decision | Reason |
|----------------|----------|--------|
| Make the edit hook fail closed | Deferred to `handover-to-barter.md` | Fail-open is the hook's stated contract across seven runtimes, and the commit check still blocks |
| Check a commit that moves the pin | Rejected | A re-pin commit carries upstream's own changes, so the check would refuse every re-pin. `status --audit` covers the gap |
| The four Barter items | Moved to `handover-to-barter.md` | Barter's tree is read-only for this session |
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup saves the review and the baseline. Implementation sends one brief per change. Verification runs the gates, the deep review, the remediation, the alignment run and the release.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each engine change on a temp fixture tree | `node --test tests/overlay-engine-follow-up.test.cjs` |
| Integration | The whole doctor folder and the hook tests | `node --test tests/` and `node --test` on the hook test files |
| Manual | The playbook scenarios, read for accuracy against the engine's output | The engine on a fixture tree |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `pi` with llmgateway and `deepseek-v4.1-flash-1017` | External | Green | The build stops, by decision |
| `git` and `gh` | External | Green | No commit check test, no CI read, no release |
| `/deep:review` and `/local-skilled-alignment` | Internal | Green | No review or alignment evidence |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A doctor test that passed at the baseline fails and three fixes do not clear it, or a vendoring project reports a lost link or item.
- **Procedure**: Revert the commit that carries the change. For the tag, push the object kept under `refs/backup-tags/` back as `v4.0.2.1` and recreate the release from the entry at that commit.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The review and the handover | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Close and the tag |
<!-- /ANCHOR:phase-deps -->

---
