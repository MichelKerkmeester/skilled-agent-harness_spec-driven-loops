---
title: "Feature Specification: Phase 15: dsh-hook-parity"
description: "DSH ran 14 repo-guards adapters with the skill advisor off and no goal management, decision capture, session-start guards, compaction or stop context. This phase brings DSH to hook parity with OpenCode and Pi, splits interactive sessions from fan-out leaves and moves every adapter into the hook library layout the other runtimes use."
trigger_phrases:
  - "dsh hook parity"
  - "phase 15 dsh hook parity"
  - "dsh lineage leaf marker"
  - "dsh adapter layout"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.4 -->
# Feature Specification: Phase 15: dsh-hook-parity

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

DSH shipped 14 repo-guards adapters with the skill advisor switched off for every session, no goal management and no decision capture, session-start guards, compaction context or stop autosave. This phase adds those concerns, turns the advisor on for interactive sessions while a lineage marker keeps it and the other writer adapters off in fan-out leaves, and moves every adapter into the `.skilled/hooks/<concern>/dsh/` layout Pi uses. The bundle suite went from 37 to 75 passing tests, and keyless boots of both compositions show the advisor brief and the `dsh_goal` tool in the interactive session and neither in the leaf.

**Key Decisions**: a lineage-inserted marker plugin read at event time (ADR-001), the goal surface as a command plus a scoped tool over the shared manage CLI (ADR-002), interactive-only writer adapters (ADR-003), Pi's link layout with real-path imports (ADR-004).

**Critical Dependencies**: `@deepseek-ai/dsh` 0.2.2-rc.1 event contracts (`agent/pre-step`, `tools/result`, `session/event`, `agent/disposed`), the shared goal, capture and session-prime cores.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-11-06 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 15 |
| **Predecessor** | 014-playbook-docs-and-closeout |
| **Successor** | None |
| **Handoff Criteria** | All bundle, sweep, mirror and matrix tests pass, both keyless compositions are recorded under `evidence/`, and recursive strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the DSH hook and plugin parity with the OpenCode and Pi runtimes specification.

**Scope Boundary**: the DSH repo-guards bundle, its patches, its adapters wherever they live in the hook library, the DSH session sweep, the runtime-mirror check for the adapter links and the docs that describe them. Runtime READMEs, the root README, changelogs and `injection-contract.md` belong to the parallel docs work.

**Dependencies**:
- Phase 009 and 010 built the original bundle, `goal-context` and the MCP route guard.
- Phase 013 pinned the live contract the adapters rely on.

**Deliverables**:
- Six new adapters, a leaf marker plugin, the DSH session sweep and the advisor split.
- The adapter move into the hook library with links, and the `dsh-adapters` mirror tree.
- The DSH column in the coverage matrix and the rationale, bundle and harness reference docs.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An operator running `dsh web` with the guards patch got no skill-advisor brief, no way to bind or log a goal, no session-start warnings and no capture of the answers they gave, because the guards patch set `promptAdvisor: false` and four Pi concerns stayed deferred. The adapters also lived only in `.dsh/plugins/repo-guards/adapters/`, outside the hook library every other runtime indexes.

### Purpose
DSH carries every hook concern OpenCode and Pi carry, or a checkable reason it does not, with interactive sessions fully guided and fan-out leaves kept free of writers.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node --test .dsh/plugins/repo-guards/tests/        # before this phase
ℹ tests 37
ℹ pass 37
ℹ fail 0

$ grep promptAdvisor .dsh/patches/guards.patch.yml    # before this phase
          promptAdvisor: false

# keyless headless boot, route + guards, prompt "Reply with OK", before this phase
request/header tools(23): bash, create_goal, edit, get_goal, glob, grep, interrupt_agent, job_kill, job_list, job_output, list_agents, read, read_image, send_message, skill, subagent, subagent_fork, todo_write, update_goal, web_fetch, workflow, working_directory, write

# --dump-config with a lineage patch that overrides the repo-guards row, applied before guards
dsh: [<scratchpad>/probe/lineage-off.patch.yml] patch: entry "repo-guards" not found
exit=0

# one real 5-frame session.v4.jsonl.zstd
zstd -dc lines: 19 bytes: 55939
zlib.zstdDecompressSync alone lines: 1
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Turn the skill advisor on in the guards patch and keep it off in fan-out leaves through a lineage marker plugin.
- Add `overlay-guard`, `decision-capture`, `goal-manage`, `session-start-advisories`, `session-compact-context` and `session-stop-context` adapters, plus `sweep-dsh.mjs` wired into `/speckit:save`.
- Move every adapter into `.skilled/hooks/<concern>/dsh/` or its skill's `hooks/dsh/` with index links, and leave relative links in `.dsh/plugins/repo-guards/adapters/`.
- Add the `dsh-adapters` tree to `sync-runtime-mirrors.cjs` so `/doctor:runtime-mirrors` checks the links.
- Add the DSH column to the coverage matrix and DSH rows to the rationale, bundle README, harness reference and playbook.

### Out of Scope
- A Hermes column in the coverage matrix - each cell needs its own probe of the Hermes plugin's events, which this phase did not run.
- `injection-contract.md`, `save-workflow.md`, the decision-capture feature catalog entry and the runtime READMEs - the parallel docs work owns them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.dsh/patches/guards.patch.yml`, `.dsh/patches/lineage.patch.yml` | Modify | Advisor on, leaf marker row |
| `.dsh/plugins/repo-guards/index.mjs`, `lineage-leaf.mjs` | Modify, Create | Registers 20 adapters, marker plugin |
| `.dsh/plugins/repo-guards/adapters/*.mjs` | Replace with links | 22 relative links into the hook library |
| `.skilled/hooks/{classifier-injection-screen,decision-capture,dispatch,goal,mcp-route-guard,overlay-guard,post-edit-quality,shared,task-dispatch}/dsh/` | Create | Real library-owned adapters and helpers |
| `.skilled/skills/{system-spec-kit/runtime,system-skill-advisor,sk-git/scripts}/hooks/dsh/` | Create | Real skill-owned adapters, each with a README |
| `.skilled/hooks/{completion,session-lifecycle,skill-advisor,spec-gate,git-preflight,git-message-gate,git-live-follow,git-primary-reconcile}/dsh/` | Create | Index links |
| `.skilled/hooks/decision-capture/bin/sweep-dsh.mjs` | Create | Session-log sweep with a Zstandard frame walker |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs` | Modify | `dsh-adapters` tree |
| `.dsh/plugins/repo-guards/tests/*.mjs` and sweep, mirror and matrix tests | Create, Modify | Fixture tests written before the code |
| Hooks README, coverage rationale, bundle README, `SYNC.md`, `guards-and-hooks.md`, GRD-001, save command, doctor step | Modify | Layout, matrix column and composition docs |
| `spec-gate-classify.mjs`, `prompt-advisor.mjs`, `advisor-runtime-values.ts` | Modify | Follow-up: classify only operator messages, report the advisor runtime as `dsh` |
| `.skilled/scripts/orphan-mcp-sweeper.sh`, `.skilled/commands/doctor/scripts/git-setup-check.cjs` and their tests | Modify, Create | Follow-up: DSH sessions count as live, `/doctor:git setup` checks the DSH advisory registration |
| `/doctor:git` command docs, sk-git hooks README | Modify | Follow-up: the `dsh` tool name and the DSH registration entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The guards patch sets `promptAdvisor: true`, and a session composed with the lineage patch gets no advisor brief. |
| REQ-002 | An interactive DSH session can bind, show, log, resend, pause, clear and complete a goal through the shared goal core, and a leaf keeps only the packet slice. |
| REQ-003 | Every concern OpenCode or Pi carries has a DSH adapter or a checkable by-design or n/a reason in the parity table. |
| REQ-004 | Each new adapter has a fixture test that failed before the adapter existed, and the whole bundle suite passes. |
| REQ-005 | Every DSH adapter's real file lives in the hook library or its owning skill, and `.dsh/plugins/repo-guards/adapters/` holds only relative links. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Keyless isolated boots and `--dump-config` for the interactive and lineage compositions are saved under `evidence/`. |
| REQ-007 | `sync-runtime-mirrors.cjs --check` reports a missing, stale or real-file adapter link, so `/doctor:runtime-mirrors` covers `.dsh`. |
| REQ-008 | The coverage matrix carries a DSH column, and the rationale, bundle README and harness reference describe the layout and both compositions. |
| REQ-009 | The spec-gate classifier reads only a message the operator typed, never an injected notice or runtime-context snapshot. |
| REQ-010 | The prompt advisor reports its runtime as `dsh`, and the advisor's runtime list accepts it. |
| REQ-011 | A fan-out leaf exposes no native `get_goal`, `create_goal` or `update_goal` tool. |
| REQ-012 | The orphan MCP sweeper treats a running DSH session as a live operator session. |
| REQ-013 | `/doctor:git setup` checks the DSH git-preflight registration and accepts `--tool dsh`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .dsh/plugins/repo-guards/tests/` reports 75 tests, 75 pass, 0 fail.
- **SC-002**: The interactive keyless boot's request header lists `dsh_goal` and its session log holds an `Advisor:` notice. The lineage boot holds neither.
- **SC-003**: `sync-runtime-mirrors.cjs --check` prints `PASS` over 10 trees, the new one holding 22 DSH adapter links.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | dsh 0.2.2-rc.1 event names and payloads | A renamed event silently drops an adapter | Each adapter is read against the installed type declarations, and the keyless boots show the registrations live |
| Risk | Node resolves a link to its real path, so a moved adapter's relative imports could miss | High | A script rewrote every relative literal from the old to the new folder, a resolution check confirmed every target exists, and the suite imports every adapter through its link |
| Risk | A bundle-level `inject` would hold every guard until the named services exist | High | Only `goal-manage` and `session-compact-context` wait, through `ctx.inject` |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Session-start guards run in parallel with a 5 s timeout each, and primary reconcile runs detached.

### Security
- **NFR-S01**: No adapter reads a `.env` file or prints a key. Every keyless boot ran with model keys unset, in a `mktemp -d` cwd and `DSH_HOME`.

### Reliability
- **NFR-R01**: Every new adapter fails open, except `overlay-guard`, which denies only a path an overlay owns, the same policy every other runtime uses.

---

## 8. EDGE CASES

- Empty input: a session log with no answered question makes `sweep-dsh.mjs` print nothing and exit 0.
- Maximum input: a multi-frame Zstandard log, including a skippable frame, decodes to every line.
- Failure path: an unreadable `--session` path makes the sweep print `{"error": ...}` and exit 1.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 21/25 | Files: about 60, LOC: about 2,000, Systems: DSH bundle, hook library, mirror sync |
| Risk | 15/25 | Auth: N, API: N, Breaking: N, import resolution after the move |
| Research | 14/20 | Event payloads, patch order, cordis inject, Zstandard frames |
| Multi-Agent | 3/15 | Workstreams: 1, beside a parallel docs agent |
| Coordination | 10/15 | Dependencies: shared checkout, docs agent's dirty files |
| **Total** | **63/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A leaf runs a writer adapter because the marker row is missing | H | L | `session-role.test.mjs` pins the marker row in the lineage patch, and the lineage boot shows no advisor or goal tool |
| R-002 | An adapter link goes stale after a rename | M | M | `sync-runtime-mirrors.cjs --check` reports it, and `/doctor:runtime-mirrors` runs that check |
| R-003 | A timed question's late answer is missed live | L | M | The live adapter reads `user-question-reply` from the session feed, and the sweep recovers it at save time |

---

## 11. USER STORIES

### US-001: Guided interactive session (Priority: P0)

**As a** DSH operator in `dsh web`, **I want** the skill-advisor brief, goal commands and session-start warnings Pi gives me, **so that** a DSH session follows the same repository workflow as every other runtime.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Quiet fan-out leaf (Priority: P1)

**As a** deep-loop runner dispatching DSH lineages, **I want** each leaf to keep every guard but run no advisor, goal writer, background git work or autosave, **so that** a disposable child never writes the operator's state.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. PARITY TABLE

Evidence paths are relative to this folder unless they start with a dot. "Tests" means `.dsh/plugins/repo-guards/tests/`.

| Concern | OpenCode | Pi | DSH before | DSH after | Evidence |
|---|---|---|---|---|---|
| `skill-advisor` | `system-skill-advisor.js` | `prompt-advisor.ts` | registered, off by `promptAdvisor: false` | on for interactive, off in a leaf by the marker, reported to the advisor as runtime `dsh` | `evidence/keyless-boot-interactive.txt`, `evidence/keyless-boot-lineage.txt`, `evidence/followup-fixes-2026-11-06.txt`, Tests `session-role.test.mjs` |
| `directive-lifecycle` | plugin lifecycle state | `prompt-advisor.ts` de-dup | none | full block once per start or compaction, head alone on repeat | Tests `session-role.test.mjs` |
| `goal` | `opencode-goal.js`, `/goal-opencode` | `goal-context.ts`, `/goal-pi` | packet slice only (`goal-context`) | `/goal-dsh`, `dsh_goal`, brief with resend reminder, verify note, interactive. A leaf has no native goal tools | Tests `goal-manage.test.mjs`, `evidence/keyless-boot-interactive.txt`, `evidence/leaf-goal-tools-off.txt` |
| `decision-capture` | `decision-capture.js` | `decision-capture.ts`, `sweep-pi.mjs` | none | `decision-capture.mjs`, `sweep-dsh.mjs`, `/speckit:save` | Tests `decision-capture.test.mjs`, `.skilled/hooks/decision-capture/bin/sweep-dsh.test.mjs`, `evidence/sweep-frame-walker.txt` |
| `overlay-guard` | by-design: none | `overlay-guard.ts` | none | `overlay-guard.mjs` | Tests `overlay-guard.test.mjs` |
| `session-lifecycle` start | concern plugins | `session-start-context.ts` | `session-start-context` | unchanged | Tests `repo-guards.test.mjs` |
| `session-lifecycle` compact | concern plugins | `session-compact-context.ts` | deferred | `session-compact-context.mjs` on `compaction/end` | Tests `session-lifecycle.test.mjs` |
| `session-lifecycle` stop | `session-cleanup.js` | `session-stop-context.ts` | deferred | `session-stop-context.mjs` on `agent/disposed`, interactive | Tests `session-lifecycle.test.mjs` |
| `git-worktree-guard` | `session-cleanup.js` | `session-start-advisories.ts` | deferred | `session-start-advisories.mjs`, interactive | `evidence/keyless-boot-interactive.txt` (worktree warning) |
| `git-hooks-check` | `session-cleanup.js` | `session-start-advisories.ts` | deferred | same adapter, own switch | Tests `session-lifecycle.test.mjs` |
| `dist-freshness` | `system-dist-freshness-guard.js` | `session-start-advisories.ts` | deferred | same adapter, `python3` runner | Tests `session-lifecycle.test.mjs` |
| `hook-install` | `codex-hooks-watchdog.js` | `session-start-advisories.ts` | deferred | same adapter, `--check` | Tests `session-lifecycle.test.mjs` |
| `live-follow` | `session-cleanup.js` | `session-start-advisories.ts` | deferred | same adapter, interactive | Tests `session-lifecycle.test.mjs` |
| `primary-reconcile` | `session-cleanup.js` | `session-start-advisories.ts` | deferred | same adapter, detached, interactive | Tests `session-lifecycle.test.mjs` |
| `spec-gate` | `system-spec-gate.js` | `spec-gate-*.ts` | covered, but classified any user-role message | moved, classifies only what the operator typed | Tests `repo-guards.test.mjs` |
| `completion` | `system-completion-sentinel.js` | `completion-evidence.ts` | covered | moved, unchanged | Tests `repo-guards.test.mjs` |
| `dispatch` | `cli-dispatch-audit.js` | `dispatch-*.ts` | covered | moved, unchanged | Tests `repo-guards.test.mjs` |
| `task-dispatch` | `system-deep-loop-guard.js` | `task-dispatch-guard.ts` (partial) | covered | moved, unchanged | Tests `repo-guards.test.mjs` |
| `mcp-route-guard` | `mcp-route-guard.js` | `mcp-route-guard.ts` | covered | moved, unchanged | Tests `mcp-route-guard.test.mjs` |
| `post-edit-quality` | `sk-code-post-edit-quality.js` | `post-edit-quality.ts` | covered | moved, unchanged | Tests `repo-guards.test.mjs` |
| `injection-screen` | `classifier-injection-screen.js` | `classifier-injection-screen.ts` | covered | moved, unchanged | Tests `repo-guards.test.mjs` |
| `git-preflight` | `sk-git-preflight-advisory.js` | `git-preflight-advisory.ts` | covered, no `/doctor:git` row | moved, and `/doctor:git setup` checks its registration | Tests `repo-guards.test.mjs`, `git-setup-check.test.cjs` |
| `git-message-gate` | `sk-git-message-gate.js` | `git-message-gate.ts` | covered | moved, unchanged | Tests `repo-guards.test.mjs` |
| `codex-watchdog` | `codex-hooks-watchdog.js` | by-design | none | by-design: only a long-lived OpenCode process can poll, and DSH runs `install-codex-hooks.mjs --check` once at start | `.skilled/hooks/coverage-rationale.md` |
| `permission-policy` | by-design | by-design | none | by-design: `tools/pre-execute` already carries the decision, and `approval/request` carries no tool arguments | `ApprovalRequestEvent` in `@deepseek-ai/dsh-user-approval` types |
| `session-relaunch` | `session-relaunch.js` | `session-relaunch.ts` | none | by-design: `/speckit:handoff` prompt only, `skilled-loop` launches no DSH session | `.skilled/bin/skilled-loop` runtime list, `.dsh/prompts/speckit-handoff.md` |
| `session-cleanup` teardown | `session-cleanup.js` | startup half only | none | by-design: startup guards plus stop autosave, as on Pi | `.skilled/hooks/coverage-rationale.md` |
| speckit completion tool | `system-speckit-completion.js` | none | none | by-design: the same core runs as `.skilled/bin/speckit-completion.cjs` over bash | `.skilled/bin/speckit-completion.cjs` |
| `git-commit-hooks` | git | git | git | by-design: fires from git, no runtime axis | `.skilled/hooks/git/README.md` |
| Pi cache and fast-mode extensions | none | `pi-cache-optimizer/`, `pi-fast-mode-w-subagent-support/` | none | n/a: they tune Pi's own provider requests and appear in no hook concern table or kill-switch index | `.skilled/hooks/README.md` section 1 |
| orphan MCP sweep | session-tree pattern | session-tree pattern | not a session root | a DSH session is a live root, so its MCP helpers are kept | `orphan-sweeper-session-runtimes.vitest.ts` |

---

<!-- ANCHOR:questions -->
## 13. OPEN QUESTIONS

- Does a `subagent` call nested in a `workflow` run reach `tools/pre-execute` live? The installed pipeline routes it through the same call, but no live nested dispatch has been observed.
- Should the Hermes column be added to the coverage matrix? It needs a probe per concern first.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Record**: See `decision-record.md`
