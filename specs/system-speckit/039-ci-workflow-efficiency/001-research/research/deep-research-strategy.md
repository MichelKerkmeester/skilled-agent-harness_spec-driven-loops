---
title: Deep Research Strategy - CI workflow efficiency
description: Session strategy for the CI workflow efficiency deep research.
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - CI workflow efficiency

Runtime template copied to `specs/system-speckit/053-ci-workflow-efficiency/001-research/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `specs/system-speckit/053-ci-workflow-efficiency/001-research/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `specs/system-speckit/053-ci-workflow-efficiency/001-research/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

- `id`: stable inbox record identifier
- `text`: question text to promote
- `source`: concrete source label, such as an angle bank entry, analyst strategy, or operator note
- `origin`: one of `angle-bank`, `analyst-strategy`, `operator`, or `legacy-import`
- `injectedAtIteration`: iteration number when the question was introduced
- `promotedQuestionId`: promoted registry question id, or `null` until promotion

The reducer reads the inbox on every reduce step and carries `origin` into the question registry and dashboard badges. Direct edits to Section 3 still work as a compatibility path, but they are attributed as `legacy-import`.

Question ownership is explicit:

- Inbox rows are immutable input.
- The reducer registry is canonical question state.
- Section 3 is rendered only from the registry view.

When an inbox row targets an existing registry question but carries different text, the reducer keeps the registry value, records `operatorDecision: needs_decision`, and appends a `question_conflict` event with both `inboxValue` and `registryValue`.

---

## 2. TOPIC
Improve the efficiency and speed of every CI workflow in this repo (the 33 workflows in .github/workflows/, the README there, and the scripts and actions they call) and find overengineering, issues and optimization possibilities. Angles: (1) wall-clock and runner-minute cost per workflow measured from gh run list / gh run view --json jobs; (2) duplicate work across workflows, including the three workflows (opencode-dual-version.yml, opencode-plugin-tests.yml, hooks-node-tests.yml) that each source sk-git worktree-naming.sh and run provision_worktree with bun installed every time: measure cost per run and evaluate shared caching or one provisioning job feeding the others; (3) caching: npm, bun, provisioned trees, OpenCode installs, actions/cache and setup-node cache; (4) path filters and needless triggers, especially the Trigger Index Rebuild commit after every push to main that re-runs about 13 workflows; (5) parallelism, matrix design, fail-fast and concurrency cancel-in-progress groups; (6) flaky or slow tests and timeouts; (7) overengineering: duplicates of pre-commit hooks or each other, advisory jobs that never gate; (8) security and pinning hygiene; (9) an on/off control for clones and base repos: disable workflows or groups without editing YAML (vars.* in job-level if:, a committed config such as .skilled/ci.json or an env file read by a gate job, workflow_dispatch inputs), compare skipped-job branch-protection behavior, fork and clone defaults, pull_request_target security, reuse of hook-flags.env and .env.example, recommend one design defaulting to everything on; (10) a /doctor:ci command following the existing /doctor:* commands that lists workflows with on/off state, trigger and purpose, toggles them, customizes path filters, schedules and Node versions, and scaffolds a new pinned workflow with .skilled/ and .opencode/ path parity and a README row; specify its mode surface, safety rules (dry-run default, never edit a protected workflow without confirmation), advisor routing, and whether it lives with the doctor commands, sk-git, or splits between them; (11) a new sk-code mode sk-code-ci holding the standards for writing and reviewing workflow YAML (SHA-pinned actions, path parity per gate-inputs, README row, set -euo pipefail, timeouts, least-privilege permissions, fork and secret safety, caching, concurrency, matrix), registered in the sk-code hub (mode-registry.json, hub-router.json, leaf-manifest.json) with sk-code-review applying it, and /doctor:ci scaffolding from its templates. Every load-bearing claim cites file:line or a run id and is labelled confirmed, documented or inferred. End with ranked recommendations (saving, risk, effort) grouped into proposed implementation phases 002+.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What does each workflow cost in wall-clock and runner minutes, and which workflows dominate the total?
- [x] Which work is duplicated across workflows, and what does the repeated provision_worktree and bun install cost per run?
- [x] Where is caching missing or ineffective for npm, bun, provisioned trees and OpenCode installs?
- [x] Which triggers and path filters cause needless runs, including the run burst after each Trigger Index Rebuild commit?
- [x] Are parallelism, matrix design, fail-fast and concurrency cancel-in-progress groups set well?
- [x] Which tests or jobs are flaky or slow, and are job timeouts set and sized right?
- [x] Which workflows or jobs are overengineered, such as duplicates of pre-commit hooks or advisory jobs that never gate?
- [x] What security and pinning hygiene gaps exist in the workflows?
- [x] What on/off control design lets a clone or base repo disable workflows or groups without editing YAML?
- [x] What should a /doctor:ci command do, how is it made safe, and who owns it?
- [x] What should an sk-code-ci mode contain, and what does registering a new sk-code mode require?
- [x] How do the ranked recommendations group into ordered implementation phases 002 and later?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Editing any workflow, script, action or code. This session is research only; implementation belongs to phases 002 and later.
- Changing branch protection or repository settings on GitHub.

---

## 5. STOP CONDITIONS
- Stop policy is max-iterations: the run stops after iteration 20; convergence mode is off, so no early stop fires.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What does each workflow cost in wall-clock and runner minutes, and which workflows dominate the total?
- Which work is duplicated across workflows, and what does the repeated provision_worktree and bun install cost per run?
- Where is caching missing or ineffective for npm, bun, provisioned trees and OpenCode installs?
- Which triggers and path filters cause needless runs, including the run burst after each Trigger Index Rebuild commit?
- Are parallelism, matrix design, fail-fast and concurrency cancel-in-progress groups set well?
- Which tests or jobs are flaky or slow, and are job timeouts set and sized right?
- Which workflows or jobs are overengineered, such as duplicates of pre-commit hooks or advisory jobs that never gate?
- What security and pinning hygiene gaps exist in the workflows?
- What on/off control design lets a clone or base repo disable workflows or groups without editing YAML?
- What should a /doctor:ci command do, how is it made safe, and who owns it?
- What should an sk-code-ci mode contain, and what does registering a new sk-code mode require?
- How do the ranked recommendations group into ordered implementation phases 002 and later?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- What on/off control design lets a clone or base repo disable workflows or groups without editing YAML? (iteration 5)
- New, carried forward: are spec-kit tests fixture-collision-safe under `fileParallelism: true`? (iteration 5)
- What should a /doctor:ci command do, how is it made safe, and who owns it? (iteration 5)
- Which workflows or jobs are overengineered, such as duplicates of pre-commit hooks or advisory jobs that never gate? (iteration 5)
- What should an sk-code-ci mode contain, and what does registering a new sk-code mode require? (iteration 5)
- How do the ranked recommendations group into ordered implementation phases 002 and later? (iteration 5)
- New, carried forward: does `.skilled/skills/system-spec-kit/runtime/vitest.config.ts` also set (iteration 5)
- What security and pinning hygiene gaps exist in the workflows? (iteration 5)
- Which workflows or jobs are overengineered, such as duplicates of pre-commit hooks or advisory jobs (iteration 7)
- Carried forward: are spec-kit tests fixture-collision-safe under fileParallelism true, and does the spec-kit vitest config also set it (iteration 5). (iteration 8)
- Carried forward: what are the include globs of `.skilled/hooks/vitest.config.ts`, which decides how much of F3 is real. (iteration 8)
- What should a `/doctor:ci` command do, how is it made safe, and who owns it? (iteration 9)
- Carried forward from iteration 5/7: which jobs are overengineered, such as duplicates of pre-commit hooks or advisory jobs that never gate? (iteration 9)
- What should an `sk-code-ci` mode contain, and what does registering a new `sk-code` mode require? (iteration 9)
- Carried forward from iteration 5: are spec-kit tests fixture-collision-safe under `fileParallelism: true`, and does `.skilled/skills/system-spec-kit/runtime/vitest.config.ts` also set it? (iteration 9)
- What on/off control design lets a clone or base repo disable workflows or groups without editing YAML? *(half answered — the mechanism and limits are settled; the naming, master switch, branch-protection comparison and drift check move to part 2)* (iteration 10)
- **Carried forward, still open (iteration 5/7/9):** which jobs are overengineered — duplicates of pre-commit hooks, or advisory jobs that never gate? (iteration 10)
- **Carried forward, still open (iteration 8):** what are the include globs of `.skilled/hooks/vitest.config.ts`? (iteration 10)
- **Carried forward, still open (iteration 5):** are spec-kit tests fixture-collision-safe under `fileParallelism: true`, and does `.skilled/skills/system-spec-kit/runtime/vitest.config.ts` also set it? (iteration 10)
- What should a `/doctor:ci` command do, how is it made safe, and who owns it? *(untouched; now better constrained — it can read `vars` state but cannot write repository variables without a token.)* (iteration 10)
- Carried forward: are spec-kit tests fixture-collision-safe under `fileParallelism: true`, and does `.skilled/skills/system-spec-kit/runtime/vitest.config.ts` set it? (iteration 11)
- Carried forward: what are the include globs of `.skilled/hooks/vitest.config.ts`? (iteration 11)
- Carried forward: which jobs duplicate pre-commit hooks? (the advisory half of this is now partly closed by F8) (iteration 11)
- What should a `/doctor:ci` command do, how is it made safe, and who owns it? Now fully constrained: it can *read* `vars` state and report it, but writing repository variables needs an admin token the CLI does not have — so the command's toggle mode is a printed instruction plus a verification read, not a mutation. (iteration 11)
- What should an `sk-code-ci` mode contain, and what does registering a new `sk-code` mode require? The gate shape in F5 and the `off`-token rule in F4 are its first two rules. (iteration 11)
- **Blocking phase 002:** does a job skipped by `if:` satisfy a required status check? Two fetch attempts, both 404 (F6). Mitigated, not resolved, by shipping only the tests and reports groups first. (iteration 11)
- Carried forward: which jobs duplicate pre-commit hooks? (iteration 12)
- New: three components of the saving are inferred, not measured — cache restore throughput, the (iteration 12)
- **Blocking phase 002, unchanged:** does a job skipped by `if:` satisfy a required status check? (iteration 12)
- Carried forward: are spec-kit tests fixture-collision-safe under `fileParallelism: true`, and does (iteration 12)
- What should a `/doctor:ci` command do, how is it made safe, and who owns it? Fully constrained by (iteration 12)
- Carried forward: are spec-kit tests fixture-collision-safe under `fileParallelism: true`, and what are the (iteration 16)
- What should a `/doctor:ci` command do, how is it made safe, and who owns it? Now constrained by F16-9: a (iteration 16)
- `/doctor:ci` as a new router file versus a target on an existing doctor command: the route manifest allows (iteration 17)
- **Blocking phase 002, unchanged:** does a job skipped by `if:` satisfy a required status check? `paths-ignore` sidesteps it for the rebuild commit because that push bypasses the ruleset, but not for a real commit. (iteration 18)
- Which jobs duplicate pre-commit hooks? *(carried)* (iteration 18)
- New: what is the real per-job fixed floor (checkout + setup + scheduling) that F18-4's saving depends on? The dataset has no step timings, so the 700–900 min/day range is a model, not a measurement. (iteration 18)
- Are spec-kit tests fixture-collision-safe under `fileParallelism: true`, and what are the include globs of `.skilled/hooks/vitest.config.ts`? *(carried)* (iteration 18)
- How do the ranked recommendations group into ordered implementation phases 002 and later? *(now has three consolidation rows: paths-ignore, shared composite, job merge)* (iteration 18)
- New: does every one of the 13 downstream workflows tolerate `paths-ignore` on all four generated files, or does one of them consume the sidecars? (iteration 18)
- Carried: which jobs duplicate pre-commit hooks? (iteration 19)
- New: F19-2's residual - a future test that loads the committed index would be silently skipped on rebuild (iteration 19)
- Carried: are spec-kit tests fixture-collision-safe under `fileParallelism: true`, and what are the include (iteration 19)
- **Still blocking phase 004:** does a job skipped by `if:` satisfy a required status check? Unchanged. (iteration 19)
- New: what is the real per-job fixed floor? Partly answered by the 50-76 s checkout table, still a model for (iteration 19)
- Carried: what is the real per-job fixed floor? Partly answered by the 50-76 s checkout table, still (iteration 20)
- Carried: are spec-kit tests fixture-collision-safe under `fileParallelism: true`, and what are the (iteration 20)
- **Still blocking 006:** does a job skipped by `if:` satisfy a required status check? Unchanged. (iteration 20)
- Carried: F19-2's residual — a future test that loads the committed index would be silently skipped (iteration 20)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
- `.github/workflows/` holds 33 workflow files plus a README that lists each one's job and trigger.
- `opencode-dual-version.yml`, `opencode-plugin-tests.yml` and `hooks-node-tests.yml` each source `.skilled/skills/sk-git/scripts/worktree-naming.sh` and run `provision_worktree "$GITHUB_WORKSPACE"` (reported by the operator; to be confirmed with file:line).
- A Trigger Index Rebuild commit follows each push to main and re-runs about 13 workflows (reported by the operator; to be measured).
- sk-git owns no workflow; it supplies `validate-message.mjs` to `message-contract.yml`, the provisioning script, and its tests in `sk-git-script-tests.yml`.
- `/doctor:*` commands live in `.skilled/commands/doctor/`; sk-code modes are registered in `.skilled/skills/sk-code/mode-registry.json`, `hub-router.json` and `leaf-manifest.json`.
- resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 20
- Convergence threshold: 0, convergence mode off (no convergence-driven stop)
- Per-iteration budget: 24 tool calls, 10 minutes (advisory; the executor timeout is 2400 seconds)
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `specs/system-speckit/053-ci-workflow-efficiency/001-research/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-10-23T06:42:10.936Z
