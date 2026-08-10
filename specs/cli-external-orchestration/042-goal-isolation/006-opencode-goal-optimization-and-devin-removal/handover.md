---
title: "Handover: OpenCode Goal Optimization and Devin Goal Remnant Removal"
description: "Final handover for digest-keyed OpenCode goal persistence, compatibility migration, cross-runtime playbook alignment, and retired Devin goal-surface cleanup."
status: "complete"
trigger_phrases:
  - "opencode goal optimization handover"
  - "goal isolation phase 6 handover"
  - "devin goal remnant removal handover"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/042-goal-isolation/006-opencode-goal-optimization-and-devin-removal"
    last_updated_at: "2026-08-10T19:28:00Z"
    last_updated_by: "codex"
    recent_action: "Final handover and verification receipts authored"
    next_safe_action: "Monitor digest-keyed state and compatibility migration during normal use"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/hooks/goal/goal-plugin.md"
      - "implementation-summary.md"
    completion_pct: 100
---
# Handover: OpenCode Goal Optimization and Devin Goal Remnant Removal

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** `goal-isolation-phase-6-20260810`
- **To Session:** Normal maintenance or incident response
- **Phase Completed:** Implementation, documentation alignment, verification, and publication
- **Handover Time:** 2026-08-10T19:09:16Z
- **Recent action:** Reconciled Phase 6 and packet 042 after the final focused tests and goal-playbook validation.
- **Verdict:** Complete. OpenCode persistence is bounded and opaque, concurrent runtime goals remain isolated, active Devin goal remnants are absent, and the runtime playbooks agree with the shipped surfaces.

The main implementation landed in `1fa14a9153f` (`feat(goal)!: isolate sessions and harden persistence`). The accumulated implementation and packet repairs were pushed to both `main` and `skilled/v4.0.0.0` through `ee501b2ec7982b28dfa338ee2f8008fbecd0c981`. The closeout commit containing this handover and final playbook alignment is also published to both branches.
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Final Runtime Contract

| Runtime | Goal surface | Session isolation | Management boundary |
|---------|--------------|-------------------|---------------------|
| OpenCode | Native `.opencode/plugins/mk-goal.js` | One digest-keyed record per OpenCode session | `/goal-opencode` routes through `mk_goal` and `mk_goal_status` |
| Pi | Runtime-neutral core through `.opencode/hooks/goal/pi/goal-context.ts` | Workspace + runtime + native `getSessionId()` scope | Native `/goal-pi` command receives the same session identity as lifecycle hooks |
| Cursor | `.opencode/hooks/goal/cursor/goal-inject.mjs` | `session_id`, with `conversation_id` fallback | Injection only; `/goal-cursor` fails `UNSUPPORTED_SESSION_BINDING` |
| Claude Code | Product-native goal surface when available | Outside this repository's sibling core | No shared-core adapter or OpenCode tool substitution |
| Codex | No custom goal adapter in this repository | Unsupported | No repository goal command or injection hook |
| Devin | No goal adapter, command, or registration | Decommissioned | Generic Devin dispatch and hook infrastructure remains unrelated and intact |

### 2.2 Key Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Hash normalized OpenCode session ids with full SHA-256 | Fixed-size output avoids `ENAMETOOLONG` and removes reversible identity from filenames | `.opencode/plugins/mk-goal.js` and storage tests |
| Migrate valid earlier hex-keyed records lazily | Existing goals survive without scanning all state at startup | Active state, archive lookup, history, and cache invalidation |
| Keep an occupied digest target authoritative | Compatibility migration must never overwrite newer canonical state | Legacy source stays available for diagnosis |
| Validate embedded session identity before adoption | Filename presence alone cannot prove ownership | Mismatched and malformed sources fail closed without deletion |
| Preserve native OpenCode token accounting | `message.updated` already supplies exact usage; turn estimates would regress budgets | Native ledger and de-duplication tests remain unchanged |
| Remove only live Devin goal surfaces | The user requested retirement of the goal version, not deletion of Devin as a runtime | Historical specs/benchmarks and generic Devin support remain |
| Validate goal scenarios independently from package backlog | Large runtime playbook packages contain unrelated legacy violations | Goal files are clean without expanding Phase 6 into a repository-wide documentation repair |

### 2.3 Files and Areas Modified

| Area | Change Summary | Status |
|------|----------------|--------|
| `.opencode/plugins/mk-goal.js` | Fixed 64-hex session keys, validated active/archive compatibility adoption, target authority, and cache-safe migration | Complete |
| `.opencode/plugins/tests/mk-goal-state.test.cjs` | Fixed-key, long-id, privacy, migration, conflict, malformed, mismatch, and isolation coverage | Complete |
| `.opencode/plugins/tests/mk-goal-lifecycle.test.cjs` | Legacy archive and history compatibility coverage | Complete |
| Runtime-neutral goal core and Pi/Cursor adapters | Composite session scope, isolated lifecycle, native Pi management, and Cursor injection boundary | Complete |
| Goal architecture, policy, catalog, commands, and runtime-mirror comments | Current support truth and retired Devin goal cleanup | Complete |
| Five runtime/hub manual goal playbooks | Executable final-state scenarios, exact evidence requirements, and current suite counts | Complete |
| `specs/cli-external-orchestration/042-goal-isolation/` | Six-phase completion truth, evidence, metadata, and handover | Complete |

### 2.4 Traps and Scar Tissue

| Trap / blast site | Activation condition | Classification | How to avoid re-paying it |
|-------------------|----------------------|----------------|---------------------------|
| Reversible hex filename expansion | A native session id is long enough that the doubled hex basename exceeds the filesystem component limit | Load-bearing | Keep `sessionKeyForSession()` fixed at the full 64-character SHA-256 digest |
| Unsafe legacy adoption | A hex-keyed file exists for another embedded session or malformed JSON | Load-bearing | Validate the embedded session id before rename; preserve the source on every failure |
| Target overwrite during migration | Both digest and legacy layouts exist | Load-bearing | The digest target wins; never delete or overwrite the legacy source implicitly |
| Headless OpenCode visibility assumption | `opencode run` is used to prove the custom tool or system transform | Defensive documentation boundary | Use the direct shipped-plugin scenario; record the live headless path as SKIP until the runtime exposes it |
| Package validator overreach | A full runtime playbook package exits nonzero for unrelated legacy scenarios | Defensive scope boundary | Filter results to the goal feature and validate every goal root/feature document separately |
| Historical Devin evidence mistaken for live support | Broad repository search includes specs, benchmarks, or changelogs | Defensive audit boundary | Scan declared active goal surfaces; retain historical records unless an explicit history rewrite is approved |
| Dirty worktree contamination | Broad staging captures the user's Codex/config/fixture experiments | Load-bearing Git boundary | Stage explicit Phase 6 and playbook paths; inspect the staged diff before committing |

### 2.5 Preserved Unrelated Worktree State

These paths were deliberately excluded from the Phase 6 closeout:

- `.codex/AGENTS.md` deletion.
- `.codex/config.toml` local approval-mode edit.
- Three modified MCP discovery fixture JSON files under `mcp-aside-devtools`, `mcp-mobbin`, and `mcp-refero`.
- Untracked `specs/system-skill-advisor/019-codex-node-runtime-alignment/`, whose completion claims do not match the current config.

Do not restore, stage, or publish those paths as part of goal maintenance without a separate scope decision.
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point

- **File:** `.opencode/plugins/mk-goal.js`
- **Next safe action:** If a real OpenCode goal incident appears, reproduce it with an isolated `stateDir` and the matching native session id before changing persistence.
- **Cold-read order:** 1. `implementation-summary.md` -> 2. `.opencode/hooks/goal/goal-plugin.md` -> 3. `.opencode/plugins/mk-goal.js` -> 4. the failing focused test file -> 5. this handover.
- **Context:** Preserve the split between OpenCode's native plugin and the Pi/Cursor runtime-neutral core. They share a product concept, not a storage implementation.

### 3.2 Required Tasks Remaining

None. Phase 6 and packet 042 are complete.

### 3.3 Optional Follow-up

1. Run an interactive OpenCode TUI or `serve` session if product-level model-visibility evidence becomes necessary; the current headless runner does not expose the required surface.
2. Repair unrelated runtime playbook-package backlog in its own spec packet if full-package green status becomes a release gate.
3. Resolve or discard the excluded Codex, fixture, and packet 019 work under their own approved scopes.

### 3.4 Rollback

Set `MK_GOAL_PLUGIN_DISABLED=1` first if prompt injection or state ownership is suspect. Revert the plugin, tests, goal docs, and runtime-mirror changes as one reviewed bundle. Preserve both digest and legacy files. To reverse a migrated file, validate its embedded session id, derive the exact former hex basename, and move it only when that target is absent. Never merge two session records or select one as a global replacement.
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

- [x] Integrated core, CLI, Pi, and Cursor suite passes 82/82.
- [x] OpenCode `mk-goal` suite passes 125/125, up from the 119-test baseline.
- [x] `mk-goal.js` syntax and changed-code comment hygiene pass.
- [x] Alignment scans 42 goal/plugin files with zero findings.
- [x] The repository-wide wrapper was observed separately: 25,549 known findings across 807,694 files; stack folders pass and router-sync passes 10/10.
- [x] Runtime mirror sync passes 131 links across seven trees.
- [x] The executable OpenCode playbook snippet reports PASS, three opaque files, validated migration, and `tokensUsed:160`.
- [x] All ten goal root/feature playbook documents validate with zero document issues.
- [x] All five goal scenarios have zero goal-specific package violations.
- [x] Active Devin goal residue is zero and unrelated Devin runtime paths have zero worktree diff.
- [x] Phase 6 strict and packet 042 recursive strict validation pass with zero errors and zero warnings.
- [x] Task-created backup and renderer directories are removed.
- [x] Phase work is committed and pushed to both `main` and `skilled/v4.0.0.0`; unrelated dirty paths remain uncommitted.
- [x] This handover contains no raw live session id, secret, or production goal objective.
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Verification Commands

```bash
node --test \
  .opencode/hooks/goal/lib/goal-core.test.cjs \
  .opencode/hooks/goal/bin/goal.test.cjs \
  .opencode/hooks/goal/pi/goal-pi.test.mjs \
  .opencode/hooks/goal/cursor/goal-cursor.test.mjs

node --test .opencode/plugins/tests/mk-goal-*.test.cjs

python3 .opencode/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py \
  --root .opencode/hooks/goal \
  --root .opencode/plugins

node .opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs --check

bash .opencode/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh

bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  specs/cli-external-orchestration/042-goal-isolation --strict --recursive
```

Observed final results: cross-runtime 82/82; OpenCode 125/125; alignment 42 files and zero findings; runtime mirrors 131 across seven trees; recursive strict zero errors and zero warnings. The full workspace wrapper reports the known 25,549-finding global/worktree backlog, while its stack-folder check and 10-test router-sync suite pass.
<!-- /ANCHOR:session-notes -->
