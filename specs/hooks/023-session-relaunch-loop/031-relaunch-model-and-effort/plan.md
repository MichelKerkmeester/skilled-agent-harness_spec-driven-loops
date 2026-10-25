---
title: "Implementation Plan: Phase 31: relaunch-model-and-effort"
description: "Replay each runtime's effort flag next to its model, and let the sender's own latest model and effort, read from its session log or handed in by its adapter, win for the next hop."
trigger_phrases:
  - "relaunch model and effort plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 31: relaunch-model-and-effort

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2 compatible shell, CommonJS, TypeScript for the Pi extension |
| **Framework** | None |
| **Storage** | The relaunch record under the runtime directory |
| **Testing** | `node --test`, vitest for Pi |

### Overview
The wrapper captures the effort flag from the first launch, as it already captures the model, and replays it in the runtime's syntax. `prepare` reads the sender's latest model and effort from the Claude session log or the Codex rollout, and the Pi extension hands its model, provider and thinking level to `arm`. Both land on the relaunch record, `consume` reports them, and the wrapper uses each one that passes its check.
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
Other: a shell wrapper fed by a CLI over a JSON record.

### Key Components
- **`resolveSessionSettings`**: reads the sender's latest model and effort, failing closed.
- **Wrapper checks**: `effort_is_valid` holds each runtime's level list from its help, and `model_is_valid` holds the model id shape.

### Data Flow
Session log or adapter, then the relaunch record, then `consume`, then the wrapper's checks, then the relaunch arguments and the exported `SKILLED_LOOP_MODEL`, `SKILLED_LOOP_PROVIDER` and `SKILLED_LOOP_EFFORT` that later hops fall back to.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `build_relaunch_arguments` | Builds the relaunch and the manual template | Update | Wrapper tests |
| `preparePending`, `arm` | Write the record | Update | CLI and Pi tests |
| `consume` | Reports the record to the wrapper | Update | CLI test |
| Claude, Codex, Hermes adapters | Arm the record | Unchanged, not a consumer | Their suites stay green |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Wrapper arguments, CLI record and consume, Pi arm | `node --test`, vitest |
| Integration | The whole relaunch gate | `node --test` |
| Live | One hop each on Claude, Codex and Pi | tmux harnesses in `scratch/harness/` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Runtime credentials | External | Yellow: Hermes and Cursor lack them | Their live hops cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A relaunch fails to start because of a carried flag.
- **Procedure**: Revert the commit. The record fields are optional, so older records still work.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Probe each runtime's flags |
| Core Implementation | Med | Wrapper, CLI, core, Pi adapter |
| Verification | Med | Three live hops |
| **Total** | | **Medium** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Gate baseline saved before the change

### Rollback Procedure
1. Revert the commit.
2. Rerun the relaunch gate.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

