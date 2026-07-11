---
title: "Implementation Plan: Headless / subagent enforce scoping [template:level_2/plan.md]"
description: "Narrow the spec-gate deny predicate so dispatched/child sessions are advise-only via the AI_SESSION_CHILD signal, scope the operator's first enforce flip to the Claude interactive process env, and make cli-external dispatch surfaces export MK_SPEC_GATE_ENFORCE=0 for headless children."
trigger_phrases:
  - "headless enforce plan"
  - "child session deny predicate"
  - "AI_SESSION_CHILD isChildSession"
  - "evaluateMutation child suppression"
  - "spec gate who can deny"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/133-spec-gate-enforce-readiness/004-headless-enforce-scoping"
    last_updated_at: "2026-07-11T11:05:57.825Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 2 plan with the child-detection design choice resolved"
    next_safe_action: "Author tasks.md covering the core change, tests, and dispatch-surface edits"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs"
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs"
      - ".claude/settings.json"
      - ".opencode/bin/worktree-session.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-headless-enforce-scoping"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase 4 — Headless / subagent enforce scoping

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM (`spec-gate-core.mjs`), CommonJS plugin (`mk-spec-gate.js`), Bash (`worktree-session.sh`), JSON (`.claude/settings.json`) |
| **Framework** | OpenCode plugin hooks + Claude Code PreToolUse/UserPromptSubmit hooks over one runtime-neutral core |
| **Storage** | Per-session gate-state JSON under `.opencode/skills/.spec-gate-state/` (unchanged by this phase) |
| **Testing** | `node --test spec-gate-core.test.mjs`; adapter test `.opencode/plugins/tests/mk-spec-gate.test.cjs` |

### Overview
The deny decision is single-sourced in `evaluateMutation()` (`spec-gate-core.mjs:557`). This phase adds one narrowing clause to that predicate so a session marked `AI_SESSION_CHILD=1` resolves to `advise` even when enforce is on, then scopes the operator's first flip to the Claude interactive process env and makes the dispatch surfaces neutralize a leaked enforce env. No classify or classifier change.
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

### Design Choice: how a child/dispatched session is detected

**Chosen: reuse the `AI_SESSION_CHILD=1` env signal, and put the check inside the core deny predicate.**

Two independent sub-choices were resolved:

1. **Signal — `AI_SESSION_CHILD=1` (chosen) vs. "absence of an interactive-user signal" (rejected).**
   `AI_SESSION_CHILD=1` is the already-established, documented cross-runtime convention for exactly this concept: an orchestrated child / dispatched sub-session that must not act like a top-level session. It is checked by `worktree-session.sh:71`, `worktree-guard.sh:23`, and is required to be set at every cli-external dispatch site (cli-opencode SKILL rule 17, cli-claude-code SKILL rule 13). Reusing it means the child signal is already present wherever headless children are launched, and it is a positive, explicit signal rather than a brittle inference. "Absence of an interactive-user signal" was rejected: there is no reliable, portable "interactive" marker at hook time on both runtimes, and inferring interactivity from a missing signal inverts the safe-default (an unknown session would be treated as interactive and could deny).

2. **Location — inside `evaluateMutation()` in the core (chosen) vs. plugin-local in `mk-spec-gate.js` (rejected).**
   The invariant is that deny stays the single deterministic Write/Edit predicate. If child suppression lived in the plugin, the plugin would override the core's `deny` into an `advise`, splitting the predicate across two files and letting them drift. Putting `!isChildSession(env)` inside the core predicate keeps deny in one place, tested once, and both adapters inherit it because both already forward `process.env` (`mk-spec-gate.js:235`, `spec-gate-enforce.mjs:47`). The plugin needs no code change; the "child-detection" is the core clause the plugin invokes.

### Pattern
Runtime-neutral policy core with thin transport adapters; env-precedence guard.

### Key Components
- **`evaluateMutation()` (core)**: owns the single deny predicate; gains `&& !isChildSession(environment)`.
- **`isChildSession(env)` (core, new)**: pure predicate, `env[CHILD_SESSION_ENV] === '1'`.
- **`.claude/settings.json` env block**: scopes the enforce flip to the interactive Claude process.
- **`worktree-session.sh` child branch + cli-external dispatch recipes**: export `MK_SPEC_GATE_ENFORCE=0` for headless children (belt-and-suspenders).

### Data Flow
User turn → classify opens/binds gate → Write/Edit → adapter forwards `{tool, filePath, sessionID, projectDir, env}` to `evaluateMutation` → deny only when `denyCapable && enforceOn && !isChildSession && open && non-exempt`; otherwise advise/allow.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `evaluateMutation()` deny predicate (`spec-gate-core.mjs:580-585`) | Producer of allow/advise/deny | Update: add `&& !isChildSession(environment)` to the deny branch | `node --test spec-gate-core.test.mjs` child matrix rows |
| `isChildSession` + `CHILD_SESSION_ENV` (core, new) | New pure predicate + constant | Create alongside `ENFORCE_ENV`/`DISABLED_ENV` (`spec-gate-core.mjs:59-61`) | Unit assertion on `'1'` vs non-`'1'` values |
| `mk-spec-gate.js` `tool.execute.before` (`:220-248`) | Consumer of decision; forwards `process.env` (`:235`) | Unchanged - env flows through | `rg -n 'env: process.env' .opencode/plugins/mk-spec-gate.js`; adapter test with `AI_SESSION_CHILD=1` → no throw |
| `spec-gate-enforce.mjs` (Claude) (`:43-49`) | Consumer of decision; forwards `process.env` (`:47`) | Unchanged - inherits suppression | Grep confirms `env: process.env`; interactive (no child) still denies in core test |
| `.claude/settings.json` `env` (`:2-7`) | Process env for interactive Claude + its hooks | Update: add `MK_SPEC_GATE_ENFORCE` (ship `"0"`) | `rg -n 'MK_SPEC_GATE_ENFORCE' .claude/settings.json` |
| `worktree-session.sh` child branch (`:60-73`) | Executable dispatch chokepoint | Update: `export MK_SPEC_GATE_ENFORCE=0` in `exec_in_place` | `bash worktree-session.sh --dry-run` under `AI_SESSION_CHILD=1` |
| cli-external dispatch recipes (cli-opencode SKILL `:354`, cli-claude-code SKILL `:369`, both `assets/prompt_templates.md`) | Documented dispatch pattern | Update: prepend `MK_SPEC_GATE_ENFORCE=0` next to `AI_SESSION_CHILD=1` | `rg -n 'MK_SPEC_GATE_ENFORCE=0' .opencode/skills/cli-external` |
| `.opencode/plugins/README.md`, `.opencode/bin/README.md` | Docs / who-can-deny scoping | Update: document child-suppression + single deny surface | Read-back of the new scoping paragraph |

Required inventories:
- Same-class producers: `rg -n 'decision.*deny|return \{ decision' .opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs` - confirms `evaluateMutation` is the ONLY deny producer.
- Consumers of changed symbols: `rg -n 'evaluateMutation|MK_SPEC_GATE_ENFORCE|ENFORCE_ENV|AI_SESSION_CHILD' . --glob '*.mjs' --glob '*.js' --glob '*.cjs' --glob '*.md'`.
- Matrix axes: `MK_SPEC_GATE_DISABLED` {unset, `1`} x `MK_SPEC_GATE_ENFORCE` {unset, `0`, `1`} x `AI_SESSION_CHILD` {unset, `0`, `1`} x gate status {open, satisfied, skipped, none} x tool {write, edit, bash}. Required rows before implementation: disabled→allow (all); child+enforce+open+write→advise; no-child+enforce+open+write→deny; child+enforce+open+bash→advise; enforce-unset+open+write→advise.
- Algorithm invariant: child detection can only turn `deny`→`advise`; it can never turn `allow`→`deny` or `advise`→`deny`. Adversarial cases: `AI_SESSION_CHILD` in {`''`, `0`, `true`, `yes`, `2`} must NOT suppress (non-`1` → interactive); `DISABLED=1` outranks child + enforce; a throw inside detection resolves to `allow`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm both adapters forward `process.env` unchanged (grep evidence)
- [ ] Confirm `AI_SESSION_CHILD` exact-match semantics against `worktree-session.sh:71`
- [ ] Capture the current core-test baseline (green) before edits

### Phase 2: Core Implementation
- [ ] Add `CHILD_SESSION_ENV = 'AI_SESSION_CHILD'` constant and exported `isChildSession(env)` helper
- [ ] Narrow the deny predicate in `evaluateMutation()` to include `!isChildSession(environment)`
- [ ] Scope the enforce flip in `.claude/settings.json` `env` (ship `"0"`)
- [ ] Export `MK_SPEC_GATE_ENFORCE=0` in the `worktree-session.sh` child branch and prepend it to the cli-external dispatch patterns/templates
- [ ] Document who-can-deny scoping in the plugin + bin READMEs

### Phase 3: Verification
- [ ] Extend `spec-gate-core.test.mjs` with the child matrix and run `node --test`
- [ ] Extend the OpenCode adapter test for `AI_SESSION_CHILD=1` → no throw
- [ ] Re-run `validate.sh <phase> --strict`; confirm no `mcp_server/` dist rebuild occurred
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `evaluateMutation` child matrix + `isChildSession` value variants | `node --test spec-gate-core.test.mjs` |
| Integration | OpenCode `tool.execute.before` with `AI_SESSION_CHILD=1` + enforce → advise (no throw) | `node --test .opencode/plugins/tests/mk-spec-gate.test.cjs` |
| Manual | `worktree-session.sh --dry-run` under `AI_SESSION_CHILD=1`; confirm exec-in-place + enforce=0 | Shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `AI_SESSION_CHILD` convention (`worktree-session.sh`, cli-external SKILLs) | Internal | Green | None - convention already shipped and documented |
| WS1 advise telemetry (001-advise-telemetry) | Internal | Yellow | Flip timing is data-driven; this phase makes the flip safe regardless |
| Shared `gate-3-classifier.js` dist | Internal | Green | Consumed as-is; not rebuilt |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A child session is observed denying, or an interactive session stops denying under enforce.
- **Procedure**: Revert the `evaluateMutation` predicate clause + constant/helper and the `.claude/settings.json` env key; set `MK_SPEC_GATE_ENFORCE=0` (or `MK_SPEC_GATE_DISABLED=1` for an immediate full no-op). Deny defaults off, so reverting restores advise-only behavior.
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
| Setup | Low | 0.5-1 hour |
| Core Implementation | Med | 2-3 hours |
| Verification | Med | 1-2 hours |
| **Total** | | **3.5-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Core-test baseline captured green before edits
- [ ] Enforce flip shipped as `"0"` (deny stays default-off)
- [ ] `MK_SPEC_GATE_DISABLED=1` verified as an immediate full no-op

### Rollback Procedure
1. Set `MK_SPEC_GATE_ENFORCE=0` in `.claude/settings.json` (or `MK_SPEC_GATE_DISABLED=1` for a full no-op).
2. Revert the `evaluateMutation` predicate clause, `CHILD_SESSION_ENV`, and `isChildSession` in `spec-gate-core.mjs`.
3. Run `node --test spec-gate-core.test.mjs` to confirm the pre-change golden loop passes.
4. No stakeholder notification needed - the guard is advisory by default and this is not user-facing.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - no schema or persisted-state format changes; per-session gate-state files are unaffected.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
