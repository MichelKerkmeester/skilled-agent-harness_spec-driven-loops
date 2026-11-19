---
title: "Feature Specification: Remove OpenCode v1 support from the repository"
description: "Removes OpenCode 1.x support from the skilled repository so OpenCode 2.3.2 is the only supported version, in three child phases, with the Mac cleanup as a separate gated step."
trigger_phrases:
  - "opencode v1 removal phase parent spec"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal"
    last_updated_at: "2026-11-19T12:40:00Z"
    last_updated_by: "closure-run"
    recent_action: "All three phases In Progress; blockers recorded per phase"
    next_safe_action: "Operator: T004 capture, 002 CI push (T015), 003 AC-004 path (T019)"
    blockers:
      - "Phase 001: T004 live event capture not run (static scan stands in); CHK-003 and CHK-013 not met"
      - "Phase 002: the CI run needs the operator push go-ahead (AC-008 Unmet)"
      - "Phase 003: AC-004 needs a live deep-loop iteration and plugin scenario, or an ADR waiver (T019)"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.3 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Remove OpenCode v1 support from the repository

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-19 |
| **Branch** | `worktrees/477-opencode-v1-removal` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | scaffold/070-opencode-v1-removal |
| **Predecessor** | `../069-opencode-v1-pin-1-19-4/` |
| **Successor** | None |
| **Handoff Criteria** | All three child phases pass strict validation, the repo-side final grep returns only the justified hits listed in phase 003, and the Mac cleanup waits for a separate operator yes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
OpenCode 2.3.2 is the only version in use. Packet 002 (`../spec.md`) made OpenCode 1.x and 2.x run side by side: its description asks for every agent, command, plugin, skill, hook and config file to run on both lines at once. Its phases moved the v2 pin to 2.1.4 (phase 067) and the v1 pin to 1.19.4 (phase 069). Since then the v1 half has become dead weight. Version resolution, dispatch rules, the deep-loop runtime, the setup helper, the doctor battery, the plugins, the session readers, a two-version CI matrix and the install docs each still carry a v1 branch. None of those branches runs on the supported version, and the install guidance still tells a user to install a second OpenCode major. Two stale assumptions also remain: the `*.disposed` plugin branches wait for events that the plugin inventory records as never arriving on v2, and the session readers query legacy `session` and `message` tables that v2 does not write (v2 writes `session_v2` and `session_message`).

### Purpose
One supported OpenCode major, v2 pinned at 2.3.2, with no v1 branch, launcher, CI leg or doc in the repository, and a separately gated removal of v1 from this Mac.

### Measured Behavior
```text
$ rg -l -i 'opencode1\b|opencode-ai|OpenCode 1\b' . --glob '!specs/**' --glob '!**/changelog/**' --glob '!**/benchmark/**' --glob '!.git/**' --glob '!**/node_modules/**' | wc -l
103
```
The block counts the repository files that name the v1 package, launcher or product before any child phase runs. `specs/`, every `changelog/` folder and `benchmark/` are excluded because they hold history. The `--pure` flag is recorded in the inventory as absent from the v2 `run` command, and phases 001 and 003 verify that live before they remove it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Version resolution, dispatch rules, the deep-loop runtime, the skilled-loop wrapper, the setup helper, the doctor battery, the plugins and the session readers, with their tests (child 001).
- The v1 CI matrix leg and the `both` job, the `@opencode-ai/plugin` pins, and the v2 pin bump to 2.3.2 (child 002).
- The cli-opencode docs and playbooks, the plugin docs, the root and cross-skill mentions, the feature catalog entry, the regenerated trigger index and fixtures, and a cli-opencode changelog entry (child 003).

### Out of Scope
- The Mac cleanup. It removes the v1 launcher, the v1 npm package, the v1 data and two PATH lines in `~/.zshrc`. It is outside repo scope and waits for a separate operator yes after the repo work lands.
- Pushing the branch. Every push needs a separate operator go-ahead.
- OpenCode versions other than 2.3.2. Any later version needs a fresh verification before it is pinned.
- Historical files: `specs/**`, every `changelog/` folder and `benchmark/reports/`.

### What Stays (v2, not a remnant)
- `.opencode/plugins/lib/v2-bridge.js` is the v2 adapter that the plugins reach through `dualPlugin()`. It stays. Only its v1-facing `server` key goes.
- `EVENT_ALIASES` in `v2-bridge.js` (`session.idle` and `session.compacted`) runs on v2 and stays.
- Orca's `orca-opencode*-status` plugins in `~/.config/opencode/plugins` and `~/Library/Application Support/orca` belong to Orca and stay.
- `opencode.db.bak-20261115-vibe-budget`, `opencode-v2.db*` and `opencode-{next,rerun,shots}.db` are not v1 data and stay.
- Historical files stay untouched (see Out of Scope).
- Generated files (the trigger index, the compiled deep contracts and the spec-kit fixtures) are regenerated by their generators and never hand-edited.

### Operator Decisions (binding)
1. v2 is the only supported major. Major 1 resolves as "unsupported".
2. Native deep-loop lineages (the v1-only `run --command deep/<loop>` path in `fanout-run.cjs`) are dropped with no replacement.
3. The legacy `session` and `message` table branches in the session readers are removed. The inventory sweep found those tables still in the live v2 database, last written 2026-10-22, before v2 became the default on 2026-10-24. Sessions older than 2026-10-22 become invisible to the readers, and the operator accepted that.
4. The v1 data on this Mac is deleted, not archived.
5. The `--pure` flag text is removed from the deep-loop protocol docs and presentation files (phase 003), after phase 001 widens the test that guards it.

### Mac Cleanup (out of repo scope, gated)
This step runs only after the repo work lands and after a separate operator yes that restates the rollback. Pre-checks: `lsof` on `~/.local/share/opencode/opencode-v1.db*` must show no writer (the file was written 2026-11-19 at 09:30 and its writer is unknown), and `rg opencode1` over the shell rc files, launch agents and the repo must come back empty. Then remove `~/.local/bin/opencode1`, remove `~/.local/lib/node_modules/opencode-ai` and the empty `@opencode-ai` and `@earendil-works` directories, and delete `opencode-v1.db{,-shm,-wal}`, `storage/` and `pre-v2-default-20261024/` under `~/.local/share/opencode/`. Back up `~/.zshrc`, then remove the two dead `~/.opencode/bin` PATH exports (lines 2 to 3 and 31 to 32). Optionally remove the stale `models.json.*.tmp` files in `~/.cache/opencode`. Leave `~/.config/opencode/package.json` alone unless child 002 shows that v2 does not use its `@opencode-ai/plugin` pin.

Rollback: the repo side is `git revert` on the branch. On the Mac, `npm i -g --prefix ~/.local opencode-ai@1.19.4` reinstalls the old package, but the deleted databases and storage cannot be recovered, because the operator chose delete over archive.

### Files to Change
The table is an audit summary. Each child's `plan.md` and `tasks.md` hold the per-file detail.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs`, `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs` | Modify | 001 | Version resolution becomes v2-only; major 1 becomes "unsupported" |
| `.skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json`, `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs` | Modify | 001 | Two v1-only dispatch rules and their checks are removed |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, `.skilled/bin/skilled-loop` | Modify | 001 | The native-lineage path and the v1 argv are removed |
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh` | Modify | 001 and 002 | Phase 001 removes the v1 modes and adds `--remove-v1`; phase 002 bumps the v2 pin |
| `.skilled/commands/doctor/scripts/opencode-version-battery.cjs` | Modify | 001 | The battery runs the v2 family only |
| `.opencode/plugins/*.js`, `.opencode/plugins/lib/v2-bridge.js`, `.opencode/plugins/tests/*.test.cjs` | Modify | 001 | v1-only event branches and the bridge `server` key are removed; tests re-point to `setup` |
| `.skilled/hooks/shared/session-readers/opencode.mjs`, `.skilled/hooks/decision-capture/bin/sweep-opencode.mjs` | Modify | 001 | Legacy `session` and `message` table branches are removed |
| `.github/workflows/opencode-dual-version.yml` | Modify | 002 | The v1 matrix entry and the `both` job are removed; the workflow name becomes v2-only |
| `.opencode/package.json`, `.skilled/package.json` | Modify | 002 | The `@opencode-ai/plugin` pins are removed or replaced after a usage check |
| `.skilled/skills/cli-external-orchestration/cli-opencode/**`, `.opencode/plugins/*.md`, `README.md`, `.skilled/CROSS-CLI.md` | Modify | 003 | v2-only docs, playbooks and references |
| `.skilled/commands/deep/assets/*-presentation.txt`, deep-loop `loop-protocol.md` files | Modify | 003 | The `--pure` text is removed |
| `.skilled/commands/deep/assets/compiled/*.contract.markdown` | Regenerate | 003 | Compiled contracts come from `compile-command-contracts.cjs` |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`, `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/*.json` | Regenerate | 003 | Generated artifacts come from their generators |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-v1-runtime-code-and-tests/ | Version resolvers, dispatch rules, deep-loop runtime, skilled-loop wrapper, setup helper, doctor battery, plugins, session readers | In Progress (T004 live event capture not run; a static scan stands in; CHK-003 and CHK-013 not met) |
| 2 | 002-v1-ci-and-package-pins/ | v1 CI matrix leg and `both` job, workflow name, `@opencode-ai/plugin` pins, v2 pin bump to 2.3.2 | In Progress (the CI run waits for the operator push; AC-008 Unmet) |
| 3 | 003-v1-docs-and-playbooks-sweep/ | cli-opencode and plugin docs, playbooks, `--pure` text, feature catalog, generated artifacts, changelog entry | In Progress (AC-004 Unmet: the deep-loop iteration and plugin scenario are not run) |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- All three phases land on the branch before anything is pushed. Phase 001 removes the v1 battery legs and setup modes that the v1 CI matrix entry still calls, so CI is red between phases 001 and 002 and no CI result is claimed until phase 002 lands.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-v1-runtime-code-and-tests | 002-v1-ci-and-package-pins | Phase 001 passes strict validation. The suites named in its REQ-004, REQ-005, REQ-006 and REQ-008 pass on OpenCode 2.3.2. | `validate.sh` on phase 001 prints `RESULT: PASSED`; `node --test` on each named suite prints `# fail 0` |
| 002-v1-ci-and-package-pins | 003-v1-docs-and-playbooks-sweep | The workflow has no v1 entry and no `both` job, the v2 pin is 2.3.2 in both the setup helper and the workflow, and the package pins are decided. | `rg -l -F '2.3.0' .github/workflows/opencode-dual-version.yml .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh \| wc -l` prints 0 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- UNKNOWN: which process wrote `~/.local/share/opencode/opencode-v1.db` at 09:30 on 2026-11-19. The Mac cleanup pre-check (`lsof`) answers it, and the Mac step does not run until that check shows no writer.
- UNKNOWN: whether OpenCode 2.3.2 reads the `variant` key in the root `opencode.json`. Phase 002 answers it before any edit to that file.
- UNKNOWN: which of `session.resumed`, `session.compact`, `session.updated`, `session.status`, `permission.*` and `question.*` arrive on OpenCode 2.3.2. Phase 001 answers it with the live event capture, and a branch stays until then.
- UNKNOWN: whether OpenCode 2.3.2 uses the `@opencode-ai/plugin 1.18.11` pin in `~/.config/opencode/package.json`. Phase 002 answers it. The Mac step leaves that file alone until then.
- UNKNOWN: the target version of the cli-opencode changelog entry. Phase 003 decides it through `/create:changelog`.
- Open question: may the widened `--pure` scan in phase 001 stay red on the branch until phase 003 lands? The packet assumes yes, because the phases land on one branch before any push. The operator confirms or changes that order.
- Open question: which provider and model the live `opencode run` checks use. The hard rules require an explicit `-m` and a closed stdin for every ad-hoc run.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
