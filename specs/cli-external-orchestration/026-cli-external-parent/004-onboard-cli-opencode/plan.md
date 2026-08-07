---
title: "Implementation Plan: Phase 4: onboard-cli-opencode"
description: "Plan the history-preserving git mv of the ~70-file cli-opencode tree into the hub packet and the atomic repoint of the fail-open PreToolUse dispatch hook that lives inside it, without touching cli-claude-code or the scorer."
trigger_phrases:
  - "onboard cli-opencode plan"
  - "cli-opencode relocation"
  - "dispatch hook repoint plan"
  - "phase 004 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/026-cli-external-parent/004-onboard-cli-opencode"
    last_updated_at: "2026-07-09T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the cli-opencode relocation plan"
    next_safe_action: "Execute the move and hook repoint after phase 003"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external/cli-opencode/"
      - ".claude/settings.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-onboard-cli-opencode"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: onboard-cli-opencode

<!-- SPECKIT_LEVEL: 1 -->
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
| **Language/Stack** | Markdown/JSON skill tree, one Node hook script, one JSON settings file |
| **Framework** | OpenCode skill hub with workflow packets |
| **Storage** | Filesystem skill tree |
| **Testing** | `git status` rename audit, an active Bash-call hook smoke check, and `validate.sh` for this phase folder |

### Overview
This phase moves the cli-opencode tree into `cli-external/cli-opencode` and repoints the fail-open PreToolUse dispatch hook in the same change so dispatch-rule enforcement is never silently lost. It does not fold in cli-claude-code, dissolve graph identities, or rewrite the scorer.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 003 left an empty `cli-opencode/` packet ready to receive the tree
- [ ] The current cli-opencode file set and the hook path are inventoried from the live worktree
- [ ] The `.claude/settings.json` PreToolUse hook path is confirmed

### Definition of Done
- [ ] cli-opencode tree moved with `git mv`, history preserved
- [ ] `.claude/settings.json` hook path repointed atomically with the move
- [ ] An active Bash-call smoke check confirms the dispatch-preflight lint still fires
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Workflow-packet onboarding inside a parent hub, matching the two-tier shape; the shared hook travels with the packet and is made hub-aware.

### Key Components
- **cli-opencode packet tree**: The former flat skill contents, moved under `cli-external/cli-opencode/` including `scripts/`.
- **Fail-open PreToolUse hook**: `dispatch-preflight-lint.mjs`, whose new path must be reflected in `.claude/settings.json` and whose internal resolution must reach `cli-external/cli-opencode/SKILL.md`.
- **Hub advisor identity**: The single `cli-external/graph-metadata.json`; the packet-local graph metadata is not duplicated as a competing identity.

### Data Flow
Every Bash call triggers the PreToolUse hook, which lints dispatch prompts against per-skill hard rules read from `SKILL.md`. After this phase the hook path resolves under `cli-external/cli-opencode`; the cli-claude-code branch resolves at its flat path until phase 005.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/cli-opencode/` | Live OpenCode dispatch skill and host of the shared hook | Move into `.opencode/skills/cli-external/cli-opencode/` with `git mv` | Destination contains the moved tree; old flat folder absent |
| `.claude/settings.json` PreToolUse hook | Fail-open dispatch-rule linter on every Bash call | Repoint the hook path atomically with the move | Active Bash-call smoke check confirms the lint fires |
| `dispatch-preflight-lint.mjs` | Resolves per-skill `SKILL.md` via a flat-layout path.join | Make hub-aware for cli-opencode; cli-claude-code entry finalizes in phase 005 | Hook resolves `cli-external/cli-opencode/SKILL.md` |
| cli-opencode self-invocation guard | Refuses self-dispatch via runtime signals | Unchanged (runtime-signal-based, not path-based) | Guard still trips on env/ancestry/lockfile signals |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase 003 left `.opencode/skills/cli-external/cli-opencode/` empty and ready
- [ ] Inventory the current cli-opencode tree and the `.claude/settings.json` hook path from the live worktree
- [ ] Confirm the hook's internal `DISPATCH_SKILLS` registry and path.join resolution as the hub-aware target

### Phase 2: Core Implementation
- [ ] `git mv` the cli-opencode tree into `cli-external/cli-opencode/`, excluding the packet-local graph metadata from surviving as a competing identity
- [ ] Rewrite cli-opencode's ~54 internal outbound relative cross-skill paths (add the extra `../`) and any absolute self-refs, in the same move
- [ ] Repoint the `.claude/settings.json` PreToolUse hook path and `check-prompt-quality-card-sync.sh`'s cli-opencode card path in the same change
- [ ] Make the hook resolve cli-opencode from `cli-external/cli-opencode/SKILL.md`; leave the cli-claude-code entry for phase 005
- [ ] Confirm no dispatch behavior, guard, or provider logic changed

### Phase 3: Verification
- [ ] Confirm `git status --short` shows renames, not copy/delete churn
- [ ] Run an active Bash-call smoke check that the dispatch-preflight lint still fires from the new path
- [ ] Run a link-resolve check that every rewritten internal outbound path resolves (no dangling `../sk-`/`../system-`)
- [ ] Run `check-prompt-quality-card-sync.sh` to confirm the CI gate is green after the cli-opencode card-path repoint
- [ ] Run phase-folder validation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Rename audit | Moved tree preserves history | `git status --short`, `git log --follow` |
| Hook smoke | Fail-open PreToolUse hook still fires | An active Bash call that trips a dispatch-rule advisory |
| Template validation | Phase 004 spec docs | `validate.sh` against this phase folder |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 hub skeleton | Internal | Yellow until confirmed | The destination packet may not be ready |
| `.claude/settings.json` PreToolUse hook | Internal | Green from phase 001 research | Moving without a same-change path repoint silently loses enforcement |
| Phase 005 fold-in and dissolution | Internal | Sequenced | The hook's cli-claude-code entry and the scorer rewrite finalize there |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The hook 404s or stops firing after the move, or the move introduces behavior drift.
- **Procedure**: Revert the phase commit as one unit so the tree move and the settings.json/hook repoint return together; do not partially restore only the directory or only the settings path.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
