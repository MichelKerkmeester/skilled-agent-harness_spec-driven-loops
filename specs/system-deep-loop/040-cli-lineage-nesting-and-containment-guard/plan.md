---
title: "Implementation Plan: Prevent a cli-codex fan-out lineage from nesting codex exec per iteration, and make write containment preserve concurrent operator edits instead of erasing them"
description: "Four disjoint work streams close two defects in the deep-loop runtime: an in-process execution directive plus a pre-spawn refusal stop a cli-codex lineage from re-entering codex, and write containment writes a recovery patch before it reverts a tracked file. Streams run in parallel on separate files, then one full runtime test suite gates the packet."
trigger_phrases:
  - "in-process execution directive"
  - "pre-spawn refusal"
  - "containment recovery patch"
  - "parallel work streams"
  - "deep-loop runtime plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Prevent a cli-codex fan-out lineage from nesting codex exec per iteration, and make write containment preserve concurrent operator edits instead of erasing them

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript for the runtime libraries, CommonJS Node for `fanout-run.cjs`, YAML for the two auto workflows |
| **Framework** | None. `.opencode/skills/system-deep-loop/runtime` is a plain Node package |
| **Storage** | Filesystem only: JSONL event logs and patch files under the lineage artifact directory |
| **Testing** | vitest (`npm test` in the runtime), `tsc --noEmit` via `npm run typecheck` |

### Overview

The nesting defect is an instruction conflict, so the fix is layered rather than singular: the prompt says what to do, the YAML says it again at the decision point and the executor guard refuses the spawn even when both are ignored. The containment defect is a recoverability gap, so containment keeps reverting and starts recording what it reverted. Four streams carry the work, and they touch disjoint files so they can run at the same time.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Layered refusal. Three independent surfaces state the same rule, and the last of them enforces it in code rather than in prose. Containment gains a write-before-mutate step, which is the standard shape for a destructive operation that must stay reversible.

### Key Components
- **`buildLoopPrompt` (`fanout-run.cjs` 1108-1205)**: composes the lineage prompt. Gains an in-process execution directive for every CLI lineage kind.
- **cli-codex executor step (both auto YAMLs)**: decides whether to dispatch codex. Gains a pre-dispatch rule and a refusal inside its embedded node script.
- **Recursion guard (`executor-audit.ts`)**: owns `CODEX_SESSION_ID` mapping and `SPECKIT_CLI_DISPATCH_STACK`. Becomes the enforcement point, checked before spawn.
- **`enforceWriteContainment` (`write-containment.ts` 511)**: reverts out-of-scope in-HEAD paths. Writes the diff first and reports where it went.

### Data Flow

A lineage starts, `buildLoopPrompt` hands it a prompt that names in-process execution. If the model still reaches the YAML codex step, the pre-dispatch rule stops it there. If it reaches the embedded script anyway, `executor-audit.ts` reads the dispatch stack and refuses before any process is created. Separately, when an iteration writes outside its artifact directory, containment diffs the offending in-HEAD paths, writes one patch, reverts, appends `containment_violation` carrying `revertedPatchPath` and returns a result carrying `recoveryHint`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet is a bug fix that touches env precedence, process spawning and a destructive filesystem policy, so the inventory below is required rather than optional.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `buildLoopPrompt` (producer) | Composes every fan-out lineage prompt | update | `tests/fanout-loop-prompt-in-process.test.ts` asserts the directive per lineage kind |
| cli-codex step in both auto YAMLs (policy) | Decides codex dispatch, fails closed when the binary is absent | update | YAML parse check plus a read of the refusal branch against the availability branch |
| `executor-audit.ts` recursion guard (policy) | Maps executor kind to session env, tracks the dispatch stack | update | `tests/unit/executor-audit.vitest.ts` covers refuse, allow and stale-session rows |
| `enforceWriteContainment` (producer) | Reverts out-of-scope in-HEAD paths and fails the lineage | update | `git apply` round trip in `tests/unit/write-containment.vitest.ts` |
| `containment_violation` event consumers (consumer) | Read the JSONL event stream | update | New `revertedPatchPath` field is additive, so existing readers stay valid |
| cli-codex `SKILL.md`, `loop-protocol.md`, hub `SKILL.md` (docs) | Tell a lineage author what an executor may do | update | Each names the in-process rule and the recovery-patch rule |
| Other executor kinds (cli-opencode, cli-devin, cli-cursor, cli-pi) | Dispatch their own CLIs | unchanged | Only the prompt directive reaches them, and it forbids nesting for all kinds |

Required inventories:
- Same-class producers: `rg -n 'codex exec|spawnSync|execFileSync' .opencode/skills/system-deep-loop/runtime/lib/deep-loop .opencode/commands/deep/assets`.
- Consumers of changed symbols: `rg -n 'enforceWriteContainment|containment_violation|CLI_DISPATCH_STACK_ENV|buildLoopPrompt' . --glob '*.ts' --glob '*.cjs' --glob '*.md'`.
- Matrix axes: lineage kind (5 executor kinds), dispatch depth (top level against nested), session env present or absent, path state (tracked in HEAD against untracked).
- Algorithm invariant: a dispatch is refused when and only when the current process already belongs to a lineage of the same executor kind. Adversarial cases are a stale session id with an empty dispatch stack, a dispatch stack naming a different kind and a nested dispatch whose session env was cleared.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Sequencing note: streams 1 through 4 run in parallel because their file sets are disjoint. Stream 1 owns `fanout-run.cjs`, stream 2 owns the two YAMLs and `executor-audit.ts`, stream 3 owns `write-containment.ts` and stream 4 owns the three markdown documents. Each stream runs its own targeted vitest during development. Only after all four land does the orchestrator run one full `npm test` in the runtime, and that single suite is the authoritative gate.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Prompt directive per lineage kind, recursion-guard decision matrix, patch path construction | vitest |
| Integration | Containment revert followed by a `git apply` of the emitted patch in a temporary repository | vitest with a real git checkout |
| Manual | YAML parse of both auto workflows and a read of the cli-codex step to confirm the refusal branch sits beside the availability branch | node YAML parse, direct file read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/skills/system-deep-loop/runtime` vitest suite | Internal | Green | No authoritative gate, so no completion claim |
| `git` available in the test environment | External | Green | The `git apply` round trip degrades to a string assertion, which weakens REQ-006 |
| Three sibling streams landing in this worktree | Internal | Yellow | The full suite cannot run until the last stream lands |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A legitimate top-level cli-codex dispatch is refused, or containment stops failing closed on a violation.
- **Procedure**: Revert the owning stream's commit. Each stream is a separate commit over disjoint files, so a single revert removes one layer and leaves the other three intact.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Stream 1 (prompt directive) ────┐
Stream 2 (YAML + guard) ────────┤
Stream 3 (containment patch) ───┼──► Full runtime npm test ──► validate.sh
Stream 4 (docs) ────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Streams 1-4 |
| Streams 1-4 | Setup | Full suite |
| Full suite | All four streams | Verification |
| Verification | Full suite | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Under 1 hour |
| Core Implementation | Medium | 4-6 hours across four parallel streams |
| Verification | Low | 1-2 hours |
| **Total** | | **6-9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Identify which layer misbehaved from the lineage dispatch records or the containment event stream.
2. Revert that stream's commit. The four commits touch disjoint files, so no rebase is needed.
3. Re-run the runtime `npm test` and confirm the remaining layers still pass.
4. Re-run one short cli-codex lineage and read its dispatch records before declaring the rollback good.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Recovery patches under `containment-reverted/` are additive artifacts. Deleting them is safe once the edits they hold have been restored or discarded.
<!-- /ANCHOR:enhanced-rollback -->

---
