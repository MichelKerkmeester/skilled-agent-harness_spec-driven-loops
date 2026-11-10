---
title: "Implementation Plan: Phase 32: opencode2-standalone-replay"
description: "Probe OpenCode's help for --standalone, add the flag to the first launch and every relaunch, and drop the -m replay that OpenCode 2 rejects."
trigger_phrases:
  - "opencode2 standalone replay plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 32: opencode2-standalone-replay

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2 compatible shell, Node test files |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test` with a stub runtime on the PATH |

### Overview
The wrapper runs `opencode --help` once and treats a help that lists `--standalone` as OpenCode 2. For OpenCode 2 it prepends `--standalone` to the first launch (as it already does for Codex `--no-daemon`) and puts it in the relaunch arguments, where it also leaves out `-m`. Capability, not version, decides, so a build that changes the flag falls back to the old launch.
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
Other: a shell wrapper with per-runtime launch rules.

### Key Components
- **Capability probe**: sets `opencode_two` once, before the manual command template is built.
- **`build_relaunch_arguments`**: the single place relaunch flags are assembled, shared with the manual claim command.

### Data Flow
The operator's arguments pass through unchanged, `--standalone` is prepended, and the relaunch is rebuilt from the carried model, provider and seed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `build_relaunch_arguments` | Builds the relaunch and the manual claim command | Update | New wrapper tests |
| Shim subcommand list | Decides which first words skip the wrapper | Update | New shim test rows |
| Plugin and killer | Arm and end the session | Unchanged, not a consumer | Previous phase tests |

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
| Unit | Launch and relaunch arguments per help text | `node --test` |
| Integration | The whole relaunch gate | `node --test` over the relaunch tests and the plugin test |
| Live | Two hops on OpenCode 2 with no shim | tmux harness in `scratch/` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| OpenCode 2 and model credentials | External | Green | The live proof cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A plain OpenCode 2 launch under the wrapper fails to start.
- **Procedure**: Revert the wrapper and shim commits. Nothing persistent changes.
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
| Setup | Low | Baseline the gate |
| Core Implementation | Low | One script and one shim |
| Verification | Med | The live run takes the longest |
| **Total** | | **Small** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Gate baseline saved before the change

### Rollback Procedure
1. Revert the wrapper and shim commits.
2. Rerun the relaunch gate.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

