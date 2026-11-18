---
title: "Implementation Plan: Upstream fixes so Barter can drop four overlays: Code Mode disabled manuals, provider-neutral Pi config, doctor tests outside the source repo, overlay anchor placement"
description: "Port the consumer's Code Mode filter and Pi defaults upstream, make seven doctor test files host-independent, and give marked-section overlays an insertBefore anchor. Each fix is proven on a scratch copy of a vendored tree."
trigger_phrases:
  - "barter upstream fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Upstream fixes so Barter can drop four overlays: Code Mode disabled manuals, provider-neutral Pi config, doctor tests outside the source repo, overlay anchor placement

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Code Mode server), Node CommonJS (doctor scripts), JSON config, Markdown |
| **Framework** | MCP SDK and UTCP Code Mode |
| **Storage** | None |
| **Testing** | node:test, tsc, a scripted MCP client probe |

### Overview
Code Mode drops disabled manuals from its startup config, and the three OAuth remotes ship disabled. The Pi config loses its personal defaults, the doctor tests stop reading host facts, and the overlay engine learns `insertBefore`. The consumer's Pi entry load check moves upstream, and the 22 Pi entries are rendered from one template that imports the adapter inside the factory, so a stale shared tree costs one session notice. A full copy of the consumer's vendored tree in scratch proves each fix where the symptom appeared.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `bash .skilled/commands/doctor/scripts/tests/run-all.sh` reports every suite passed in the worktree
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Other: in-place fixes to existing modules, no new module.

### Key Components
- **`initializeUtcpClient`**: filters disabled manuals before the UTCP config is validated. `register_manual` still takes any entry.
- **`planMarkedSectionOverlay` and `extractMarkedSection`**: split at the `insertBefore` line on apply, rewrite and capture.
- **`renderPiEntry` in `sync-hook-registrations.cjs`**: the one Pi entry template. Write mode renders each entry from it, and `--check` holds every entry to it byte for byte.
- **`inspectPiEntry` in `hook-wiring-check.cjs`**: follows an entry's single relative import one hop, then checks the adapter's own imports.

### Data Flow
`.utcp_config.json` goes through the filter into the UTCP client. The manifest entry, base copy and fragment go through the planner into the destination file.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Code Mode startup | Registers every manual in `.utcp_config.json` | update | Dummy stdio manual probe, patched and unpatched |
| Mobbin, Refero and ClickUp modes | Tell agents how to reach their manuals | update Mobbin and Refero, ClickUp unchanged (its ask step fires on `not-connected`) | `sk-skill-check` on both modes |
| Overlay engine marked-section plan and capture | Writes and reads the block | update | `overlay-engine-sync.test.cjs` and the real review-core entry in scratch |
| Overlay pinned-upstream check | Compares the base copy against the pin | unchanged, it never strips the live file | Read of `staleRootFiles` |
| Pi extension entries | Load each hook adapter at session start | update to the rendered template | Pi's installed loader in scratch trees, 1.5.0 and 1.5.2 |
| `doctor:git` Pi leg (`git-setup-check.cjs`) | Reads the advisory adapter behind the Pi entry | update, follow the lazy import | `--tool pi` and its test suite |
| Hook adapter parity test and registration sync | Resolve every entry's adapter | update, hold entries to the template | parity and sync vitest, with a one-line-entry negative control |
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup builds a scratch copy of the vendored tree and reproduces the 24 test failures and the C3 finding. Implementation changes the files listed in `spec.md`. Verification reruns each probe and the full doctor runner. `tasks.md` owns the ordered work.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `insertBefore` place, rewrite, capture, move and refusal | node:test |
| Integration | Code Mode startup and `register_manual` over stdio, seven doctor test files on a vendored copy | MCP SDK client, node:test |
| Manual | No sign-in tab opens at startup without tokens | Operator browser |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node 24 with the primary checkout's Code Mode `node_modules` | Internal | Green | `isolated-vm` does not compile on Node 26, so the probe runs on Node 24 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: an operator needs ClickUp, Mobbin or Refero at startup again, or a consumer's overlay apply refuses after the engine change.
- **Procedure**: `git revert` the commit on the branch, or set the one `disabled` flag back to absent. For the Pi entries alone, revert `sync-hook-registrations.cjs` and the 22 entries together, because the old check rejects the rendered shape.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup's reproduced baselines | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
