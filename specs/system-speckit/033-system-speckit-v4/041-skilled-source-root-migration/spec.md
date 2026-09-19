---
title: "Feature Specification: Skilled Source-Root Migration"
description: "Move the authoring source root for skills, commands, agents, hooks and plugins from .opencode to .skilled, and symlink every CLI runtime — including opencode itself — back into it."
trigger_phrases:
  - "skilled source root"
  - "move opencode to skilled"
  - "source parent migration"
  - "runtime symlink inversion"
  - "dot-skilled migration"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration"
    last_updated_at: "2026-09-16T08:35:04Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Phase 001 research landed and verified; figures corrected against the live tree"
    next_safe_action: "Plan phases 003 to 011, then execute them in order"
    blockers: []
    key_files:
      - "001-deep-research/spec.md"
      - "002-per-runtime-reference-map/spec.md"
      - "003-migration-design/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-scaffold"
      parent_session_id: null
    completion_pct: 50
    open_questions:
      - "Does .opencode stay as a symlink farm, or can it shrink to only what the opencode runtime itself reads?"
      - "Can each runtime be pointed at a root other than its own directory name?"
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Skilled Source-Root Migration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-16 |
| **Branch** | `worktrees/055-skilled-source-root-migration` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-speckit/033-system-speckit-v4 |
| **Predecessor** | 040-gate-3-option-merge |
| **Successor** | None |
| **Handoff Criteria** | Every runtime resolves its skills, commands, agents, hooks and plugins through `.skilled`, and no gate reads a stale `.opencode` path |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`.opencode/` is the authoring home for every skill, command, agent, hook, plugin and runtime script in this repository, and the six other CLI runtimes reach it through 174 symlinks. That layout encodes a claim that is no longer true: that opencode is the primary runtime. It is now one of seven, and the least used of them. The name misleads every reader who opens the tree, and it couples a shared asset library to one vendor's directory convention — so a runtime that ever stops honouring that convention takes the whole library with it.

### Purpose

Make `.skilled/` the source root that holds the real files, and turn every runtime directory, `.opencode/` included, into a consumer that links into it. The asset library then carries a name that describes what it is rather than which tool read it first.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The authoring content under `.opencode/`: `skills/`, `commands/`, `agents/`, `hooks/`, `plugins/`, `bin/`, `scripts/`, `install-guides/`, `changelog/`, `manual-testing-playbook/`.
- The 174 symlinks that point into `.opencode/` from `.claude/`, `.cursor/`, `.devin/`, `.pi/`, `.codex/`, `.hermes/` and `specs/`, and the 207 internal links inside `.opencode/` that a literal grep does not find.
- Every hardcoded `.opencode` path in first-party code and configuration: 1,223 non-markdown tracked files, led by 405 JSON, 371 TypeScript, 111 CJS, 69 shell, 64 YAML, 44 MJS and 40 Python files, plus the three git hooks under `.opencode/scripts/git-hooks/`.
- The 19 GitHub Actions workflows that reference the path, and the 62 `.gitignore` entries that do.
- Documentation that names the path: roughly 3,000 further tracked markdown files, `AGENTS.md`, `REPO RULES.md`, `README.md`, `CONTRIBUTING.md` and `PUBLIC-RELEASE.md` among them.
- Whatever `.opencode/` must retain for the opencode runtime itself to keep working, including the root `opencode.json` that launches `.opencode/bin/mcp-code-mode-launcher.cjs`.
- References from outside the repository that resolve into it. Four are confirmed live: the global git hooks under `~/.config/git/hooks/`, `~/.codex/hooks.json`, `~/.hermes/config.yaml` and `~/.codex/config.toml`.

### Out of Scope

- `barter/` — its `.opencode` symlinks resolve to a different checkout (`Code_Environment/Barter/ai-speckit/coder/.opencode`), so this migration does not reach them.
- Renaming, splitting or reorganising any skill, command or agent. The move changes where the tree is rooted, nothing about its contents.
- Changing what any runtime does with the assets once it finds them.

### Files to Change

Per-phase detail lives in each child's plan. The surface is measured rather than estimated:

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/**` | Move | migration-design | Authoring content relocates to `.skilled/**` |
| `.claude/`, `.cursor/`, `.devin/`, `.pi/`, `.codex/`, `.hermes/` | Modify | migration-design | 174 symlinks retarget from `.opencode` to `.skilled` |
| `.github/workflows/*.yml` | Modify | migration-design | 19 workflows carry the path |
| `.gitignore` | Modify | migration-design | 62 entries carry the path |
| `opencode.json` | Modify | migration-design | Root config launches a script by path |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-deep-research/` | Map every surface the move touches, and find the ones that break | complete |
| 2 | `002-per-runtime-reference-map/` | Map every symlink and stale path reference per runtime, and across skills, code and docs | complete |
| 3 | `003-layout-probes/` | Settle the runtime and git behaviors that decide the layout, each by a live probe | complete |
| 4 | `004-migration-design/` | Choose what `.opencode/` becomes, and freeze the cutover sequence and its rollback | complete |
| 5 | `005-gate-and-ci-readiness/` | Teach hooks and CI the new root, and add a check that does not live under the moved tree | complete |
| 6 | `006-dual-root-code-and-contracts/` | Make root discovery, launchers and installers work under either root | complete |
| 7 | `007-source-root-move/` | Move the authored tree into `.skilled/` in rename-only commits | complete |
| 8 | `008-links-and-generated-state/` | Retarget hand-made links, and regenerate mirrors and every derived artifact | complete |
| 9 | `009-reference-rewrite/` | Rewrite the mechanical path references, leaving frozen records alone | complete |
| 10 | `010-machine-and-consumer-cutover/` | Reinstall the global hooks, update home configs, and keep consumer projects working | complete |
| 11 | `011-verification-and-rollout/` | Prove every runtime and gate on the new root, push, and clean up | complete |
| 12 | `012-fix-deep-review-p1-p2-findings-for-source-root-migration/` | Fix every finding the migration's deep review confirmed, starting with one source-root resolver | complete |
| 13 | `013-clear-pre-existing-ci-and-doc-debt/` | Turn the two CI workflows that were red before the migration green, guard the Hermes mirrors, and remove the retired skill-benchmark lane's live documents | complete |
| 14 | `014-fix-pre-existing-defects-found-by-migration/` | Fix the pre-existing defects phases 12 and 13 recorded: the red scaffold proof, unrun tests, the stale trigger index, test runs writing a tracked database, Codex hook drift, root-name hardcodes, and the deep-loop and sk-doc tests CI never ran | complete |
| 15 | `015-compiled-serving-admission-research/` | Research how a new hub can be admitted to compiled-serving now that the Lane C parity harness is retired, and recommend one path | complete |
| 16 | `016-fix-stale-compiled-routing-docs-and-research-workflow/` | Correct the seven-hub and pre-rename compiled-routing text phase 15 found, and stop the research workflows passing a retired validator rule | complete |
| 17 | `017-build-compiled-serving-gold-admission-checker/` | Build the checker that admits a hub to compiled-serving against its playbook routing gold, with coverage floors, and repair the flip step | in progress |
| 18 | `018-restore-advisor-suite-and-renew-scorer-freeze/` | Restore the advisor test suite phase 17 found red, and renew the compiled-routing scorer freeze once the routing battery passes | complete |
| 19 | `019-refresh-rollback-snapshots-on-re-mint/` | Keep each hub's rollback snapshot naming the policy it serves now, so a rollback restores that policy under legacy authority | planned |
| 20 | `020-fix-admission-baseline-and-block-ci/` | Fix the four admission baseline failures, then make the CI admission step blocking | planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- Every phase works in the dedicated worktree `worktrees/055-skilled-source-root-migration`, never in the main checkout. This is an operator decision (2026-09-16) and holds for the whole packet.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-deep-research | 002-per-runtime-reference-map | Findings name every category of reference with a file count, and every blocker carries a `file:line` citation | `research/research.md` exists and each claim resolves |
| 002-per-runtime-reference-map | 003-layout-probes | Every symlink, runtime file and reference the move touches is mapped and classified | The reconciled maps and `research/research.md` |
| 003-layout-probes | 004-migration-design | Every question that decides the layout has a probe result, or a recorded reason it cannot be probed | The probe records in phase 003 |
| 004-migration-design | 005-gate-and-ci-readiness | The layout, cutover order and rollback are frozen and reviewed by a second model family | Phase 004's decisions and review record |
| 005-gate-and-ci-readiness | 006-dual-root-code-and-contracts | Hooks and CI accept both roots, and an independent check catches a broken move | Gate tests and a deliberately broken dry run |
| 006-dual-root-code-and-contracts | 007-source-root-move | Root discovery, launchers and installers resolve under either root | Suites pass against both roots |
| 007-source-root-move | 008-links-and-generated-state | The authored tree sits under `.skilled/` in rename-only commits with history intact | `git log --follow` samples and no tracked file left at a moved path |
| 008-links-and-generated-state | 009-reference-rewrite | Every link resolves and every generated artifact is rebuilt by its owner | A link census with no dangling link and fresh generator checks |
| 009-reference-rewrite | 010-machine-and-consumer-cutover | No non-frozen tracked file names an `.opencode` path the design did not keep | A rescan against the reconciled maps |
| 010-machine-and-consumer-cutover | 011-verification-and-rollout | This machine's hooks and home configs point at the new root, with rollback recorded | Hook and config probes |
| 011-verification-and-rollout | 012-fix-deep-review-p1-p2-findings-for-source-root-migration | The migration is shipped and its deep review is recorded | `review/review-report.md` with every finding classed |
| 012-fix-deep-review-p1-p2-findings-for-source-root-migration | 013-clear-pre-existing-ci-and-doc-debt | Every review finding is closed, and the only red CI left is the failure set that predates the migration | Phase 012's acceptance criteria and CI at `5844a02227` |
| 013-clear-pre-existing-ci-and-doc-debt | 014-fix-pre-existing-defects-found-by-migration | Every phase 13 criterion is met and CI is green on both branches | Phase 013's acceptance criteria and its recorded CI runs |
| 014-fix-pre-existing-defects-found-by-migration | 015-compiled-serving-admission-research | Every phase 14 criterion is met and CI is green on both branches | Phase 014's acceptance criteria and its recorded CI runs |
| 015-compiled-serving-admission-research | 016-fix-stale-compiled-routing-docs-and-research-workflow | The research names the stale text and the operator has chosen what to fix | Phase 015's `research/research.md` and the operator's 2026-09-19 answers |
| 016-fix-stale-compiled-routing-docs-and-research-workflow | 017-build-compiled-serving-gold-admission-checker | The operator has chosen the gold bar and answered the questions in phase 017's section 10 | Phase 017's spec, with the answers recorded |
| 017-build-compiled-serving-gold-admission-checker | 018-restore-advisor-suite-and-renew-scorer-freeze | The admission gate is in place and the operator chose to fix the advisor suite before renewing the freeze | Phase 017's records and the operator's 2026-09-19 answers |
| 018-restore-advisor-suite-and-renew-scorer-freeze | 019-refresh-rollback-snapshots-on-re-mint | The scorer freeze is renewed and the stale snapshots are recorded | Phase 018's records |
| 019-refresh-rollback-snapshots-on-re-mint | 020-fix-admission-baseline-and-block-ci | Rollback restores each hub's current policy | Phase 019's acceptance criteria |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Does `.opencode/` remain as a full symlink farm after the move, or shrink to only the entry points the opencode runtime itself resolves?
- Can each runtime be pointed at a root other than its own directory name? Phase 001 could not establish this from repository files for any of the seven.
- Do opencode's plugin glob and Devin's skill scan follow a symlinked directory? This decides whether `.opencode/` can become a pure consumer.
- **Answered (2026-09-16):** the state-record contract uses `iteration`. The follow-up change lives in the shared deep-loop runtime rather than this packet; `001-deep-research/research/research.md` §10 names the files and lines.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
