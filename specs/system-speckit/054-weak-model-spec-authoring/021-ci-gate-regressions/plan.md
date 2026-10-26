---
title: "Implementation Plan: Phase 21: ci-gate-regressions"
description: "Fix the two CI gates the alignment run's critic found failing on main at their source: skip scratch packets in the changed-packet selection loop, and drop the advisor phrase that handed spec-kit the token auto. DeepSeek V4.1 Flash through cli-pi makes the literal in-range fixes, Opus makes the judgment ones, and each gate is replayed locally."
trigger_phrases:
  - "ci gate regressions plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 21: ci-gate-regressions

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | bash in a GitHub Actions workflow, TypeScript, JSON, YAML, Markdown |
| **Framework** | system-spec-kit CLI, system-skill-advisor runtime |
| **Storage** | None (the compiled skill graph is regenerated, not edited by hand) |
| **Testing** | vitest (spec-kit cli project, advisor runtime), shell guards, sk-doc validator |

### Overview
The X1 fix adds one `case` skip to the changed-packet selection loop and two tests that run the real workflow script. The X2 fix swaps one intent signal in system-spec-kit `graph-metadata.json` and recompiles the graph. The proof is a replay of the CI selection over the failing commit, the divergence ratchet at 9 of 9, and each in-range finding's own check.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] Problem statement clear and scope documented: `gh run view 40380947180` reports `"conclusion":"failure"` on `b51a341a07`
- [x] Success criteria measurable: the replay prints graded and scratch counts, the ratchet prints a test count
- [x] Dependencies identified: the scratch convention at `path-scoped-rules.md:57` and `validation-rules.md:322`

### Definition of Done
- [x] All acceptance criteria met
- [x] `npx vitest run tests/parity/local-native-divergence-ratchet.vitest.ts` from `system-skill-advisor/runtime` prints `Tests 9 passed (9)`, and `ci-rule-set-comparison.vitest.ts` prints `Tests 17 passed (17)`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Other: fix each gate at its producer.

### Key Components
- **Changed-packet selection loop**: the `while read` loop in `changed-packet-validation.yml` that turns changed files into packets to grade.
- **system-spec-kit intent signals**: the `intent_signals` and `derived.trigger_phrases` lists in `graph-metadata.json`, compiled into `skill-graph.json`.

### Data Flow
`git diff -z --name-only` feeds the selection loop, which now drops any path with a `/scratch/` segment before it maps a document to its packet. On the advisor side, the compiler reads `graph-metadata.json` into `skill-graph.json`, which the scorer and the ratchet read.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `changed-packet-validation.yml` selection loop | Producer of the packet list the gate grades | update | `ci-rule-set-comparison.vitest.ts` 17/17, and the replay grades 7 packets |
| `validate.sh` folder discovery | Already skips `scratch/` when it recurses | unchanged | `validation-rules.md:322` states the rule |
| `strict-pass-freshness-report.yml` | Weekly whole-tree report | not a consumer | it reads no changed-file list |
| system-spec-kit `graph-metadata.json` | Producer of the spec-kit intent signals | update | `skill-graph-freshness.cjs --strict` exits 0 |
| `skill-graph.json` | Compiled graph the scorer and ratchet read | regenerated | divergence ratchet 9/9 |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.

Invariant for X1: a changed file is skipped only when a whole path segment is `scratch`. Adversarial rows: a packet copied under `scratch/results/...` (skipped) and a packet named `001-scratch-notes` (graded).
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup confirms both failures, Implementation makes the two gate fixes and the in-range fixes, and Verification reruns each gate.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `ci-rule-set-comparison.vitest.ts` and `card-sync.vitest.ts` in the spec-kit cli project | `npx vitest run --config ../../vitest.config.ts --project cli` from `runtime/cli` |
| Integration | Divergence ratchet, drift guard and parity suites, scorer baseline ratchet, golden prompts, skill graph freshness | `npx vitest run` from `system-skill-advisor/runtime`, node |
| Manual | Selection-loop replay over `b51a341a07^2..b51a341a07`, advisor probes | bash, `skill-advisor.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-pi with `llmgateway/deepseek-v4.1-flash-1017` | External | Green | Literal fixes fall back to an Opus implementer |
| `gh` CLI, read-only | External | Green | The CI failure count is quoted from the conductor instead of observed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: a real packet stops being graded, or a sk-doc or deep-loop prompt changes its top skill.
- **Procedure**: the work is uncommitted, so revert the named file in the working tree. For X2, restore the old phrase in `graph-metadata.json` and recompile `skill-graph.json`.
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
| Setup (confirm both failures and the scratch convention) | Phase 020 | Implementation |
| Implementation (X1, X2 and the in-range fixes) | Setup | Verification |
| Verification (gate replays and this folder's validate) | Implementation | Closure |
<!-- /ANCHOR:phase-deps -->

---
