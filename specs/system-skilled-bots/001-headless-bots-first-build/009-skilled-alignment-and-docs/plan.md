---
title: "Implementation Plan: Phase 9: skilled-alignment-and-docs"
description: "Document the bots skill to the sk-doc package shape, verify an independent review and a cross-surface alignment run, and fix every confirmed finding with its check."
trigger_phrases:
  - "skilled alignment and docs plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 9: skilled-alignment-and-docs

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (bots runtime), Markdown, JSON, GitHub Actions YAML |
| **Framework** | Skilled parent hub with compiled routing |
| **Storage** | None new. Bot state stays under the user state root |
| **Testing** | vitest, the post-commit shell harness, the sk-doc validators, the compiled-route gates |

### Overview
Six code-folder READMEs, a feature catalog and runtime playbook scenarios bring the skill to the sk-doc package shape. A fresh Opus xhigh review and a `/local-skilled-alignment` run produce findings that are verified one by one before any fix. Each confirmed finding is fixed with the check that proves it, and each refuted or deferred one is recorded with its reason.
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
- [ ] `npx vitest run --no-coverage` in the bots runtime prints `Test Files  35 passed (35)` and typecheck exits 0
- [ ] `validate.sh --strict` on this phase and the parent prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Other: verify, then fix at source.

### Key Components
- **Review and alignment findings**: hypotheses until a command confirms them. Triage lives in `scratch/review-triage.md` and `scratch/alignment-triage.md`.
- **The bots skill package**: READMEs, catalog, playbook, changelogs and the routing vocabulary the findings point at.

### Data Flow
A finding names a file and a claim. The claim is checked against the code, then fixed in the producer or recorded, and the check that confirmed it is rerun after the fix.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/lib/*.ts` | Owns run, queue, approval and install behavior | update for confirmed review findings | vitest 35 files |
| `assets/bot-template.txt` | The BOT.md template the parser and tests read | rename from `.md` | `definition.vitest.ts`, frontmatter coverage `violations=0` |
| `hub-router.json`, `ROUTER.md`, `graph-metadata.json` | Stage-two and stage-one routing vocabulary | update | compiled-route replay, advisor replay, admission |
| system-deep-loop and cli-external-orchestration docs | Describe the read-only executor behavior | update | grep for the old refusal wording returns nothing |
| `.github/workflows/bots-runtime.yml` | Runs the bots suites in CI | create | CI report no drift flags, `check-gate-inputs.sh` PASSED |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Runtime libraries | vitest |
| Integration | Post-commit leg, compiled routing, advisor | shell harness, compiled-route gates, advisor replay |
| Manual | New playbook scenario BOT-025 | Its own command block, dry-run in a temp world |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-devin DeepSeek quota | External | Red | Alignment lanes failed; the operator switched the run to cli-vibe |
| cli-vibe DeepSeek Flash | External | Green | The alignment lanes and critic ran |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: a gate that passed before this phase fails after it, or a routing change sends an out-of-domain prompt to the hub.
- **Procedure**: revert this phase's local commit. Nothing is pushed until the operator says yes.
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
| Setup | Phases 001 to 008 committed | Implementation |
| Implementation | Review and alignment reports | Verification |
| Verification | Every fix in place | Close |
<!-- /ANCHOR:phase-deps -->

---

