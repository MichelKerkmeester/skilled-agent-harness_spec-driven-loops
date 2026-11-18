---
title: "Implementation Plan: Record-base in a vendored layout and overlay-engine loss reports"
description: "Changes the root choice, git reads and pin form in release-update.cjs and the upstream loss reports and key restores in overlay-engine.cjs. The doctor test suites are the proof."
trigger_phrases:
  - "vendored record base and overlay loss reports plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Record-base in a vendored layout and overlay-engine loss reports

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS scripts (`.cjs`), with Markdown, YAML and text assets |
| **Framework** | N/A: no framework. The scripts run with `node` directly. |
| **Storage** | The overlay state file `sync-state.json` and the git history of the project and the framework |
| **Testing** | `node --test` (Node's built-in runner) and `node --check` for syntax |

### Overview
This change makes `record-base` choose the right root and read the project's own HEAD in a vendored layout and it adds a commit-pin form for a framework commit between release tags. It also makes the overlay engine name each upstream content loss on re-pin and restore the keys it can. Proof is the named doctor test suites and the work record shows several new cases failing before their fix.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md sections 2 and 3)
- [x] Success criteria measurable (spec.md section 5)
- [x] Dependencies identified (spec.md section 6)

### Definition of Done
- [x] All acceptance criteria met (acceptance-criteria.md, every row Met)
- [x] `node --test` over the named doctor suites prints 368 tests, 368 pass, 0 fail, exit 0 (work record, line 33, recorded and not re-run for this packet)
- [x] Docs updated (spec/plan/tasks) and the command doc and overlay docs carry the new behavior (`update.md`, `overlays.md`, the YAML and presentation assets)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: Node command scripts that share one set of release and overlay helpers.

### Key Components
- **`release-update.cjs`**: `resolveRepo` picks the root, `headFilesAt()` reads the project's own HEAD, `releaseRenames` anchors its pathspec with `:(top)` and `record-base --pin` writes `{ commit, tree }`.
- **`overlay-engine.cjs`**: `jsonEntryLosses` and `upstreamLosses` run in `repinUnderLock` before the copy, `removedUpstreamChanges` covers directory and skill-root removals and `restoreDroppedKeys` restores or refuses dropped keys.

### Data Flow
An operator runs `record-base` or the overlay re-pin from the project. `resolveRepo` picks the root and git reads the project's HEAD at its subfolder prefix and the framework release commits at the top level. On re-pin, the engine computes the losses before it copies upstream content, prints them as `upstream-lost` and `NOTE` lines and then applies. The loss lines never block the apply. A dropped key is restored only when the pin can say what it was.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a fix packet. Both fixes change shared engine code, so the surfaces below are listed.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `release-update.cjs` `resolveRepo` and `safeResolve` | `resolveRepo` picks the `--repo` root. `safeResolve` is the unchanged guard that refuses a symlinked parent. | Update: the root is chosen before the guard runs. | The vendored record-base case and the symlink refusal case in `release-update.test.cjs` (work record, line 15). |
| `release-update.cjs` `headFilesAt`, `releaseRenames`, `recordRevision` | Read the project's HEAD, the release diff and the pinned units. | Update | Work record, line 12. No test in the record names `headFilesAt()` directly. |
| `overlay-engine.cjs` `repinUnderLock`, `jsonEntryLosses`, `upstreamLosses`, `removedUpstreamChanges` | Build the re-pin loss report before the copy. | Update | The four new re-pin cases in `overlay-engine-repin.test.cjs` and the fail-before proof (work record, line 27). |
| `overlay-engine.cjs` `setKeyOnItem`, `insertObjectKeys`, `restoreDroppedKeys` | Write keys and record and restore them. | Update | The new apply and status cases in `overlay-engine-sync.test.cjs` (work record, line 27). |
| `update.md`, `assets/doctor-update-record-base.yaml`, `assets/doctor-update-presentation.txt` | Command doc, dispatch YAML and presentation for `record-base`. | Update | The contract and compat suites pass (work record, line 15). The router contract test bans the word "commit" in `update.md`, so the flag is `--pin` (work record, line 13). |
| `assets/doctor-overlay-repin.yaml`, `assets/doctor-overlay-presentation.txt`, `assets/doctor-overlay-status.yaml`, `references/overlays.md` | Overlay repin, status and presentation surfaces. | Update | Work record, line 26. The contract test does not check the YAML keep lists against the line kinds the engine prints (work record, line 29). |

Required inventories:
- Same-class producers: N/A: the work record holds no grep output for them. Open for a future change to these helpers.
- Consumers of changed symbols: N/A: the work record holds no consumer grep. It names one consumer, the router contract test that bans the word "commit" in `update.md` (work record, line 13).
- Matrix axes: the work record names two axes. Root layout is a normal checkout, a symlinked `.skilled` in a vendored subfolder or a symlink that leaves the work tree or has another name. Record form is `--release` or `--pin`. The record gives no row count.
- Algorithm invariant: a `.skilled` symlink is followed only when its realpath is a directory named exactly `.skilled`, its parent sits inside the git top level and that parent reports the same top level. The work record names these fallback cases: a symlink outside the work tree, a wrongly named symlink, a file and a broken link (work record, line 10).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the request, the work record and the two engine scripts and maps fixes 1 and 2 to this packet. Implementation covers the root choice, the git reads, the pin form, the loss reports and the key restores, with their docs and tests. Verification runs the named suites and the fail-before proof, then `validate.sh --strict`. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Root choice, pin form, downgrade guard, loss reports and key restores, in `scripts/tests/release-update.test.cjs` and `scripts/tests/overlay-engine-*.test.cjs` | `node --test` |
| Integration | Contract, compat, agents-md contract and overlay contract suites (`doctor-update-contract`, `doctor-update-compat`, `doctor-agents-md-contract`, `doctor-overlay-contract`) | `node --test` |
| Manual | N/A: the work record names no manual run. The vendored layout is covered by the release-update test. | N/A |

The check is `node --test` over the suites above. It must report 368 tests, 368 pass and 0 fail, with exit 0, as the work record shows. `node --check` on both engine scripts must exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Git (top-level lookup, reads of HEAD and the release commits and `fetch --no-tags` for a pin) | External | Green | Root choice and HEAD reads fail. A pin that is not local cannot be fetched. |
| Node.js (`node --test`, `node --check`) | External | Green | No test or syntax check runs. |
| Overlay state file `sync-state.json` | Internal | Green | The first apply after the upgrade rewrites it, even at 0 changed. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a `record-base` run that picks a root outside the project's work tree or an overlay re-pin whose upstream-lost lines block an apply. Both are defects, since the design refuses the first and never blocks on the second.
- **Procedure**: nothing is committed, so the change lives in the working tree. To undo this: restore the eleven modified files under `.skilled/commands/doctor/` and the one under `.skilled/skills/system-skilled-doctor/references/` from git HEAD. That discards the change, so it waits for the operator's yes. Review the change with `git diff` first.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Closing the packet |
<!-- /ANCHOR:phase-deps -->
