---
title: "Implementation Plan: Phase 9: resume-contract-owned-assets"
description: "Replace the two stale resume owned-asset rows in the command contract with a /speckit:resume entry on the speckit workflow row, then prove it with the router drift check and the CLI vitest shard that failed."
trigger_phrases:
  - "resume contract owned assets plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 9: resume-contract-owned-assets

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON contract read by a Node.js generator |
| **Framework** | None |
| **Storage** | None |
| **Testing** | vitest (CLI project), node:test (doctor contract tests) |

### Overview
One JSON file changes: the speckit family's owned assets in `command-contract.json`. The two rows naming deleted resume workflow files go, and `/speckit:resume` joins the single-workflow row. The router drift check and CLI vitest shard 2 prove it.
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
- [x] All acceptance criteria met
- [x] `generate-command-routers.cjs --check` prints `routers=42 clean=42 path-drift=0 shape-drift=0` and exits 0
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Other: contract-driven drift check.

### Key Components
- **`command-contract.json`**: the single source of the asset paths each command router owns. This is the file that changes.
- **`generate-command-routers.cjs`**: reads the contract and compares the expected paths against each router. Unchanged.

### Data Flow
The generator expands each `owned_assets` path template per command, then checks that every expected path appears in the router file. A row naming a deleted file makes the expected path absent from the router, which is the drift.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup reproduces the drift check failure and the failing typo-flags test. Implementation edits the speckit owned assets in `command-contract.json`. Verification reruns the drift check, the typo-flags test, CLI vitest shard 2 and the doctor contract tests. Follow the ordered tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

`node .skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs --check` must print `routers=42 clean=42 path-drift=0 shape-drift=0` and exit 0. The CLI vitest shard that failed in CI must pass with 0 failures.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

None. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: a reader of the contract fails because the speckit resume rows are gone. Revert the one fix commit with `git revert`.
<!-- /ANCHOR:rollback -->

---

