---
title: "Research Record: OpenCode v1 and v2 dual compatibility research"
description: "Make every agent, command, plugin, skill, hook and config file in this repo run on OpenCode 1.19.x and 2.0.x at once, and teach cli-opencode to dispatch to either version. The research record in research/ informs the eleven build phases below."
trigger_phrases:
  - "opencode v1 v2 dual compat research spec"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat"
    last_updated_at: "2026-10-19T06:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed all eleven phases with the two-version proof"
    next_safe_action: "Packet complete. Pushing the branch waits for the operator"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-082-opencode-v1-v2-dual-compat"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: research-record | v2.2 -->
# Research Record: OpenCode v1 and v2 dual compatibility research

<!-- SPECKIT_LEVEL: research -->
<!--
SELF-CHECK:
- Confirm the record names the research question, the surfaces in scope, and where the findings live.
- The full findings live in research/research.md. This spec.md is the lean anchor.
FAILURE MODES:
- Restating the findings here instead of pointing to research/research.md.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | research |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-18 |
| **Findings** | `research/research.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
OpenCode now ships two lines that load plugins, read config and parse the `run` command differently. Version 1.19.3 calls a plugin's `server()` entry and version 2.0.32 calls its `setup()` entry. All 16 repo plugins load only on v1, the dispatch guards do not see `opencode2`, and cli-opencode builds a v1-only command line. A user who clones the repo with only v2 installed gets plugins that never load and guards that never fire, with no error.

### Purpose
Every repo surface loads and runs on both pinned versions, cli-opencode dispatches to either version and documents side-by-side and single-version installs, and the remaining capability gaps are listed where users will see them. The research findings live in `research/research.md`, and the build runs as the phase children in the map below: eleven, plus a twelfth added after the closeout that ports sk-vision's automatic image check.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The 16 plugins under `.opencode/plugins/`, their shared `lib/` and their tests.
- Agent frontmatter and bodies, the command tree and `opencode.json`.
- The dispatch guards under `.skilled/hooks/dispatch/` and `cli-opencode/hard-rules.json`.
- cli-opencode version detection and dispatch, and the deep-loop runtime's opencode executor in `fanout-run.cjs`.
- Install guidance, a setup helper, a `/doctor:opencode` battery and a two-version CI workflow.
- Alignment of all new and changed code with the sk-code OPENCODE surface, and every doc the change touches, through the matching sk-doc mode.

### Out of Scope
- Closing the nine gaps research marks irreducible, such as the server-side toast and per-agent `temperature` on v2. They are documented, not closed.
- OpenCode versions other than 1.19.3 and 2.0.32. Later versions are unsupported until re-verified.
- Pushing any branch. Every push needs a separate operator go-ahead.
<!-- /ANCHOR:scope -->


---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- how to make the skilled repo perfectly compatible with both opencode v1 (1.19.x) and opencode v2 (2.0.x) at the same time: every agent, command, plugin, skill, hook and config file, plus the cli-opencode skill dispatching to both versions and documenting side-by-side and single-version installs
- Research context: deep-research is active for this topic; `research/research.md` remains canonical.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
**Deep-research findings (abridged from `research/research.md`, which stays canonical).** The run stopped at 20 of 20 iterations (`maxIterationsReached`), with 5 of 5 key questions answered.

- Each plugin default-exports one plain object `{ id, setup, server }`. v1 1.19.3 calls `server()` and v2 2.0.32 calls `setup()`, and v2 loads flat `.opencode/plugins/*.js` files (confirmed by the orchestrator).
- `opencode.json` stays in the v1 shape. v1 refuses to start on the v2 `permissions` key, and v2 translates the v1 `permission` map one way (confirmed).
- Agent frontmatter stays in the v1 shape plus `browser: deny`. Per-agent `temperature` is not sent on v2. Agent bodies should stop naming the `Task` tool.
- Both versions register every `.md` file under the commands tree. Rename or move non-command Markdown. Skills are identical on both versions (60 ids).
- The dispatch guards fail open on `opencode2` (confirmed), and `command-flag-for-slash-prompt` blocks valid v2 runs. Detect the version from parsed `--version` output, never from the binary name.
- cli-opencode needs two invocation shapes, and every v2 child must use `run --standalone`, the only mode that passes the child environment to plugins (confirmed).
- Install: v1 and v2 go in separate npm prefixes, with an `opencode2` launcher that sets `OPENCODE_DB`. `opencode upgrade --major` removes v1 (confirmed). Homebrew carries only v2.
- Gap ledger: 47 rows. 9 are portable as-is, 21 need a mechanical change, 4 need a behavioural workaround, 9 are irreducible and 4 were never established.

Still open: `allowed-tools` semantics, `-m provider/model#variant` on v1, live v2 event delivery, `plugin.check` tolerance for extra keys, and `Tool.ValueSchema`. See `research/research.md` section 12.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, verification, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-unknowns-and-baseline/ | Settle the open questions and record the per-plugin, per-version baseline | Complete |
| 2 | 002-pins-imports-dual-export/ | Pin plugin dependencies and give the 11 mechanical plugins the dual export | Complete |
| 3 | 003-hard-plugins/ | Port the five hard plugins: sentinel, spec gate, skill advisor, goal and sk-vision | Complete |
| 4 | 004-agents-commands-config/ | One agent, command and config set that both versions read the same way | Complete |
| 5 | 005-version-aware-guards/ | Make the dispatch guards version-aware so they see `opencode2` | Complete |
| 6 | 006-cli-opencode-dual-dispatch/ | Version detection and two dispatch shapes in cli-opencode and the deep-loop runtime | Complete |
| 7 | 007-install-guidance-and-setup-helper/ | Install reference and `opencode-setup.sh` for side by side, v1 only and v2 only | Complete |
| 8 | 008-doctor-and-ci/ | `/doctor:opencode` battery and a two-prefix CI workflow | Complete |
| 9 | 009-sk-code-opencode-alignment/ | Align every new and changed code file with the sk-code OPENCODE surface | Complete |
| 10 | 010-documentation-sweep/ | Bring every touched doc up to its sk-doc mode | Complete |
| 11 | 011-two-version-proof-and-closeout/ | Prove the tree on both versions and close the packet | Complete |
| 12 | 012-sk-vision-v2-prompt-hook/ | Run sk-vision's automatic image check through the OpenCode 2 prompt hook | Complete |
| 13 | 013-sk-vision-v2-tools-and-loose-ends/ | Register sk-vision's tools on OpenCode 2 and close phase 012's loose ends | Complete |
| 14 | 014-post-merge-deep-research/ | Post-merge research: Pi fast-mode claim, plugin bridge and config drift, closing architecture synthesis | Complete |
| 15 | 015-post-merge-research-sk-vision/ | Post-merge research: sk-vision OpenCode 2 runtime | Complete |
| 16 | 016-post-merge-research-cli-opencode-ci/ | Post-merge research: cli-opencode, doctor battery and dual-version CI | Complete |
| 17 | 017-post-merge-research-provisioning/ | Post-merge research: worktree provisioning and the adapter suite runner | Complete |
| 18 | 018-post-merge-research-conformance/ | Post-merge research: sk-code-skilled and sk-doc conformance | Complete |
| 19 | 019-plugins-compat-docs/ | Plugins README v1 and v2 compatibility and ARCHITECTURE.md | Complete |
| 20 | 020-plugins-purity-dual-export/ | Let the plugins purity test load the dual OpenCode export, the last red Spec-Kit Check step | complete |
| 21 | 021-pi-fast-mode-trusted-flag/ | Register Pi's --fast flag in the trusted main checkout and correct the copy-claim comment and test counts | complete |
| 22 | 022-worktree-provision-completeness/ | List every tracked package tree for worktree provisioning, guard the list, and report drift and missing manifests | complete |
| 23 | 023-sk-vision-runtime-fixes/ | sk-vision runtime fixes from the post-merge research fix list, rows 4, 5, 13, 15, 20, 23, 24, 25 and 26 | Complete |
| 24 | 024-plugin-inventory-guards/ | Read the v2 plugin list from the folder and guard unmapped hooks, unrouted event names and stale counts | Complete |
| 25 | 025-cli-opencode-docs-and-listings/ | cli-opencode docs and command listings from the post-merge fix list, rows 9, 10, 11, 12 and 31: one default model id, one agent directory, --share as a deprecated no-op, refreshed flag tables and a command-listed battery leg | Complete |
| 26 | 026-ci-and-test-runners/ | Run the orphaned suites where a failure blocks, the hooks vitest tree in its own job, and give SECURITY.md a document type | complete |
| 27 | 027-opencode2-models-provider-check/ | Check an OpenCode 2 provider with a standalone listing filtered by provider prefix, never the rejected positional form or the service-bound bare form, and hold it with a doc scan test | Complete |
| 28 | 028-plugin-kill-switch-coverage/ | Make system-speckit-completion and the sk-vision plugin honor the shared kill switches, the master SYSTEM_HOOKS_DISABLED and their own concern switch, on both OpenCode lines | Complete |
| 29 | 029-unrun-tests-ci-coverage/ | Run the suites no blocking job ran: the two .pi extension suites, the sk-git worktree-naming suite and two sk-doc node tests; correct the dual-version bun comment | Complete |
| 30 | 030-nested-worktree-battery/ | Make the v2 battery judge a worktree nested inside another checkout: v2 merges every ancestor `.opencode`, so the outer checkout's plugins shadow the worktree's as duplicate IDs; the private server now reads with project config off and the worktree's `.opencode` as its config dir | Complete |
| 31 | 031-plugin-scanner-ast/ | Read plugin source with a parser so the inventory guard's four recorded blind spots close as a class, check the sk-vision symlink in the plugins purity test and build its bundle in Spec-Kit Check, and list every suite in the plugin tests README | Complete |
| 33 | 033-battery-mcp-prompt-commands/ | [Phase 33 scope] | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-unknowns-and-baseline | 002-pins-imports-dual-export | Every open question has a verdict, and the baseline lists all 16 plugins on both versions | `001/findings.md` and `001/baseline.json` |
| 002-pins-imports-dual-export | 003-hard-plugins | The 11 mechanical plugins load on both versions | v2 `/api/plugin` and the v1 plugin log lines |
| 003-hard-plugins | 004-agents-commands-config | The five hard plugins load on both versions, with v2 behaviour tests | The plugin test suites |
| 004-agents-commands-config | 005-version-aware-guards | No non-command file registers, and the mirrors are in sync | v2 `/api/command` and `check-agent-mirror-sync.cjs` |
| 005-version-aware-guards | 006-cli-opencode-dual-dispatch | `opencode2 run` is classified and evaluated | The guard test suite |
| 006-cli-opencode-dual-dispatch | 007-install-guidance-and-setup-helper | A smoke dispatch succeeds on each version | The smoke dispatch logs and the runtime suites |
| 007-install-guidance-and-setup-helper | 008-doctor-and-ci | `opencode-setup.sh both` builds a working pair in a throwaway prefix | The helper run log |
| 008-doctor-and-ci | 009-sk-code-opencode-alignment | The battery passes on both pinned versions | The battery output |
| 009-sk-code-opencode-alignment | 010-documentation-sweep | The drift guards exit 0 and no P0 or P1 finding is open | `run-all-drift-guards.sh` |
| 010-documentation-sweep | 011-two-version-proof-and-closeout | Every touched doc passes its sk-doc validator | `validate_document.py` and the package checks |
| 011-two-version-proof-and-closeout | 012-sk-vision-v2-prompt-hook | The closeout lists the OpenCode 2 image-inspection gap as limitation 5 | `011/implementation-summary.md` |
| 012-sk-vision-v2-prompt-hook | 013-sk-vision-v2-tools-and-loose-ends | Phase 012 lists the OpenCode 2 tools gap, the untested grace path and disposal during startup as open | `012/implementation-summary.md` |
| 013-sk-vision-v2-tools-and-loose-ends | 014-post-merge-deep-research | All four branches are merged on main and phase 013 is Complete | `git log origin/main` and `013/implementation-summary.md` |
| 015 to 018 (parallel siblings) | 014-post-merge-deep-research (A30) | Each sibling session has run its angles and written `research/research.md` | Each sibling `research/research.md` and steering log |
| 013-sk-vision-v2-tools-and-loose-ends | 019-plugins-compat-docs | Phase 013 closes with the sk-vision tools on both versions, so the plugin surface the docs describe is final | `013/implementation-summary.md` and the 17-plugin battery after the main merge |
| 019-plugins-compat-docs | 020-plugins-purity-dual-export | 019's docs are on main | The purity test and the Runtime vitest project pass locally; 019's README.md, ARCHITECTURE.md and spec.md are on main at 22f563b032 |
| 020-plugins-purity-dual-export | 021-pi-fast-mode-trusted-flag | 020 is on main | The extension vitest run passes 81 tests and the help probe lists --fast once in all six runs |
| 021-pi-fast-mode-trusted-flag | 022-worktree-provision-completeness | 021 is on main | The naming suite passes 109 tests and a fresh clone provisions 14 trees with 0 failed (`022-worktree-provision-completeness/scratch/mutation/new-code-run.txt`, `022-worktree-provision-completeness/scratch/mutation/fresh-clone.txt`) |
| 014-post-merge-deep-research | 023-sk-vision-runtime-fixes | The fix list in 014's research.md names rows 4, 5, 13, 15, 20, 23-26 for sk-vision | 014 research.md §9 and 023 scratch/mutation/ |
| 014-post-merge-deep-research | 025-cli-opencode-docs-and-listings | The fix list in 014's research.md names rows 9, 10, 11, 12 and 31 for cli-opencode docs and listings | 014 research.md §6 rows; the battery's command-listed leg passes on both families on CI at the pushed commit |
| 020-plugins-purity-dual-export | 026-ci-and-test-runners | 020's purity fix is on main and the post-merge fix list assigns rows 14, 16, 17, 28, 32, 33 and 34 to this group | `014-post-merge-deep-research/research/research.md` §6 rows; the `hooks-vitest` job passes on CI at the pushed commit |
| 014-post-merge-deep-research | 024-plugin-inventory-guards | The fix list names rows 6, 7, 8 and 30 for the plugin bridge and inventories | `014/research/research.md` fix list and `024/scratch/mutation/` |
| 025-cli-opencode-docs-and-listings | 027-opencode2-models-provider-check | 025's probes found 2.0.32 rejects `opencode2 models <provider>`, and the operator listed it as an open follow-up | `027/scratch/v2-positional.txt` and `027/scratch/preflight-live.txt`; `opencode2-models-form.test.cjs` passes in the battery job on CI at the pushed commit |
| 019-plugins-compat-docs | 028-plugin-kill-switch-coverage | ARCHITECTURE.md lists two plugins outside the shared kill switches | New tests under `.opencode/plugins/tests/` and `vision-runtime/tests/` fail on the old code and pass on the new; the battery passes on CI at the pushed commit |
| 026-ci-and-test-runners | 029-unrun-tests-ci-coverage | 026 recorded the `.pi` suites and three sk-doc tests as unrun, and the open-work list of 2026-10-20 assigns item 6 and the bun comment to this group | `029/scratch/mutation/`; the sk-git and Pi Extension jobs pass on CI at the pushed commit |
| 025-cli-opencode-docs-and-listings | 030-nested-worktree-battery | 025 recorded that the battery fails v2 plugin-active in a nested worktree, and the open-work list of 2026-10-20 assigns item 7 to this group | `030/scratch/`: the duplicate-ID probe and the plain-clone comparison; the nested-worktree battery passes v2 |
| 024-plugin-inventory-guards | 031-plugin-scanner-ast | 024 recorded four scanner spellings as follow-ups, and the open-work list of 2026-10-20 assigns item 8 and the last two item 9 fixes to this group | `031/scratch/mutation/`; Spec-Kit Check passes on CI at the pushed commit |
| 030-nested-worktree-battery | 033-battery-mcp-prompt-commands | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->
