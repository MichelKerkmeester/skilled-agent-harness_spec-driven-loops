---
title: "Implementation Plan: Phase 3: engine-docs-and-release"
description: "Rewrite the doctor overlay presentation, command, skill reference, workflows and playbook for the framework/ and root/ default and the sibling overlay folder, make the relayout route read its plan from status --json, ship system-skilled-doctor 1.2.0.0 with a release note that names the one migration step, then commit phases 1-3 and record the id for phase 4."
trigger_phrases:
  - "engine docs and release plan"
  - "doctor overlay docs rewrite plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: engine-docs-and-release

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, plain-text presentation contract, YAML workflow assets |
| **Framework** | The `/doctor:overlay` router with `_routes.yaml` and its workflow YAML, run by an agent |
| **Storage** | None |
| **Testing** | `node --test` on `doctor-overlay-contract.test.cjs`, `route-validate.sh`, `rg` residual checks, playbook scenarios `SKD-005` to `SKD-007`, `SKD-009`, `SKD-010` and `SKD-013` |

### Overview
The doc and workflow lines in `.skilled/commands/doctor/` and `.skilled/skills/system-skilled-doctor/` change so they state the `framework/` and `root/` rule as the default and the direct-sibling folder, and the relayout route reads its plan from `status --json`. Five playbook scenarios move to the new paths, one is added, and the skill ships `1.2.0.0` with a note that names the one migration step. The contract test, the route validator, three `rg` checks and six scenario runs prove it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` exits 0 with phases 001 and 002 in the working tree

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .skilled/commands/doctor/scripts/tests/doctor-overlay-contract.test.cjs` prints `# fail 0`, and `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Other: docs follow the engine. The engine is the source of truth, and each doc line restates one engine rule.

### Key Components
- **Presentation contract** (`doctor-overlay-presentation.txt`): owns every line the operator reads, so the refusal row, the LAYOUT row and its overflow line, and the naming-rule lines change here first.
- **Overlay reference** (`references/overlays.md`): gains the migration passage, the one place a consumer reads what the re-pin changes and what to do about it.
- **Relayout route** (`overlay.md:106`, `doctor-overlay-apply.yaml:85-86,125`): today it renders the text report's LAYOUT lines as the plan. With the 20-line cap that plan would hide every move past the twentieth, so it reads `offLayout` from `status --json` instead, which keeps the full list.
- **Workflow YAML** (`doctor-overlay-repin.yaml:76`, `doctor-update-apply.yaml:187`): the only two steps that read `.skilled-overlays.json` themselves instead of asking the engine. Without the change the rollback `find` and the overlay check look for `<tree>/../overlays` as a tree-relative name and miss the folder.
- **Playbook scenario `SKD-013`**: the only check that runs a sibling folder and an old-layout tree through the capped status and one relayout end to end.

### Data Flow
`.skilled-overlays.json` at the tree root names the folder. The engine resolves it, reads every source verbatim from the manifest, and prints status with capped LAYOUT lines while `status --json` carries the full `offLayout` list. The presentation contract and `overlay.md` describe those lines, the relayout route renders `offLayout`, and the two YAML steps resolve the same setting against the tree root.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup runs the engine suite and reads the engine's refusal messages, default rule and LAYOUT overflow line. Implementation rewrites the lines in the spec's Files to Change table, adds the migration passage and `SKD-013`, bumps `SKILL.md:5` and writes `changelog/v1.2.0.0.md`. Verification runs the contract test, `route-validate.sh`, the residual checks and the six scenarios, then commits and writes the commit id into phase 4's spec.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

The id write into `../004-barter-repin-and-relayout/spec.md` is the one write outside this phase folder. It is deliberate: the parent's 003-to-004 handoff requires it. The replace targets the single slot line `Target Skilled commit: <C>`.

**Version decision.** The bump is minor, `1.1.8.0` to `1.2.0.0`. `v1.1.0.0.md` confirms that a feature release bumps the minor part of the four-part version. A minor bump fits a default change here because nothing is refused and nothing breaks: every overlay keeps applying from its manifest source and status still passes. What changes is the default and a standing notice the consumer acts on once, which the release note leads with.

**Commit convention.** The version bump and changelog go in the same commit as the change, as `62e9beb3e25` did for `1.1.8.0` (`SKILL.md` plus `changelog/v1.1.8.0.md`). The docs land in their own commit, the last of phases 1-3, and its id is `<C>`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

- `node --test .skilled/commands/doctor/scripts/tests/doctor-overlay-contract.test.cjs` prints `# fail 0`. It reads the presentation contract (`:40`) and checks that the router, workflows and presentation agree.
- `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0. The script's usage is at `:10-12`, and it needs python3 with PyYAML (exit 3 otherwise). Its normal-run success line is UNKNOWN; only the self-test line `INFO: All self-tests passed.` (`:256`) was read.
- `rg -n -e 'leading dot dropped' -e 'without its leading dot' .skilled/commands/doctor .skilled/skills/system-skilled-doctor -g '!**/scripts/**' -g '!**/changelog/**'` prints only lines that also contain `root/`.
- `rg -n -e 'source[L]ayout' -e 'framework-root' -e 'opt[-]in' .skilled/commands/doctor .skilled/skills/system-skilled-doctor -g '!**/scripts/**' -g '!**/changelog/v1.1*'` prints nothing.
- `rg -c 'skilled-overlays/skilled|belongs at skilled|-> skilled/|source\\?":\\?"skilled/' .skilled/skills/system-skilled-doctor/manual-testing-playbook` prints nothing, where today it counts 23 lines.
- Scenarios `SKD-005`, `SKD-006`, `SKD-007`, `SKD-009`, `SKD-010` and `SKD-013` are each run once by hand on a `mktemp -d` tree.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

- `node` for the contract test and the playbook runs, `rg`, and `python3` with PyYAML for `route-validate.sh`. No new package.
- Phases 001 and 002 merged in the working tree. This phase states their behavior and cannot start before them.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: a doc states behavior the engine does not have, or the contract test fails after the commit.
- **Command**: `git revert <docs commit>`. The docs commit changes no engine code, so a revert has no runtime effect on the engine, and phases 001 and 002 keep their own commits. If phase 4 has already re-pinned onto `<C>`, revert with a follow-up commit and let Barter take it on its next re-pin.

### Compatibility
This phase documents a default change, not a breaking one. A tree on the old layout keeps applying every overlay after the re-pin, and its status passes with LAYOUT notes until one `/doctor:overlay apply --relayout`. The five rewritten scenarios expect the new default paths, and `SKD-013` proves an old-layout tree moves onto them.
<!-- /ANCHOR:rollback -->

---

