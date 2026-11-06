---
title: "Implementation Plan: Phase 5: dsh-mirror-generators"
description: "Adds three Node generators under the spec-kit CLI that build the .dsh/ skill farm, prompt templates and persona patches, each with a --check mode. The Hermes and Pi generators are the precedent, and CI plus the runtime-mirrors doctor run the checks."
trigger_phrases:
  - "dsh mirror generators plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: dsh-mirror-generators

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs`) generators, ESM tests (`.mjs`), GitHub Actions YAML |
| **Framework** | None. Node built-ins `fs` and `path` only |
| **Storage** | Filesystem: relative symlinks and generated files under `.dsh/` |
| **Testing** | `node --test` for the generator and doctor contract tests |

### Overview
Three generators under `.skilled/skills/system-spec-kit/runtime/cli/dsh/` build `.dsh/skills/`, `.dsh/prompts/` and `.dsh/agents/` from `.skilled/`. Each has a `--check` mode that writes nothing and exits non-zero on drift. CI and the runtime-mirrors doctor run the checks, and `node --test` proves the duplicate-name and long-description cases.

Authoring mode is `sk-code` `sk-code-skilled` for the JavaScript generators and tests, and `sk-code-ci` for the workflow job. The executor is `cli-codex gpt-6-luna xhigh fast`, as the phase plan names it. [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/research/phase-plan.md:120-136]
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] `ls .dsh/SYNC.md` prints the path, so phase 004 has landed
- [ ] `git check-ignore -q .dsh/skills/local-probe` exits 0
- [ ] `find .skilled/skills -name SKILL.md -not -path '*/node_modules/*' | wc -l` recorded as the baseline count

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is Met
- [ ] `node --test .skilled/skills/system-spec-kit/runtime/cli/tests/sync-*-dsh.test.mjs` prints `# fail 0`
- [ ] `spec.md`, `plan.md` and `tasks.md` agree on files and commands
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Generate then check. Each generator has one write path and one read-only `--check` path that diffs the expected mirror against disk.

### Key Components
- **`sync-skills-dsh.cjs`**: walks `.skilled/skills` for every `SKILL.md`, reads frontmatter `name` and `description`, links `.dsh/skills/<name>` to the packet folder, fails on duplicate names and warns on descriptions over 500 characters.
- **`sync-prompts-dsh.cjs`**: flattens `.skilled/commands/**` into `.dsh/prompts/` templates, following `sync-prompts-pi.cjs` and `sync-prompts-hermes.cjs`.
- **`sync-agents-dsh.cjs`**: writes one persona patch per `.skilled/agents/*.md` that sets the `system-prompt` row's `personaPrefix`, following `sync-agents-pi.cjs`.

### Data Flow
`.skilled/skills`, `.skilled/commands` and `.skilled/agents` are read. The generators write `.dsh/skills`, `.dsh/prompts` and `.dsh/agents`. CI and the doctor call the same scripts with `--check` and fail on any difference.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

N/A: this phase adds new generators and mirrors. It fixes no reported finding, so no fix surface applies.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup records the baseline count and reads the precedent generators. Implementation writes the three generators, their tests, the CI job and the doctor entry. Verification runs every `--check`, the tests and the link-resolution count.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each generator's enumerate, write and `--check` paths, the duplicate-name failure and the long-description warning | `node --test .skilled/skills/system-spec-kit/runtime/cli/tests/sync-*-dsh.test.mjs` |
| Integration | The doctor contract for the `.dsh/` mirror | `node --test .skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs` |
| Manual | Link resolution across the whole farm | `ls .dsh/skills/*/SKILL.md \| wc -l` equals `ls -d .dsh/skills/*/ \| wc -l` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 004 `.dsh/` folder, `SYNC.md` and ignore rule | Internal | Yellow, not built yet | The generators have no target folder |
| Node.js built-ins | Internal | Green | None. No new package is installed |
| `cli-codex gpt-6-luna xhigh fast` | External | Green | The orchestrating session authors the code instead and records the deviation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: a `--check` run fails on a clean tree, or the `dsh-mirror` job breaks the existing `hermes-mirror` job.
- **Procedure**: revert the phase commit with `git revert <sha>`, which removes the generators, the generated `.dsh/` mirrors, the CI job and the doctor entry together.
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
| Setup | Phase 004 landed | Implementation |
| Implementation | Setup baseline count | Verification |
| Verification | All generators, tests and wiring written | Phase close |
<!-- /ANCHOR:phase-deps -->

---
