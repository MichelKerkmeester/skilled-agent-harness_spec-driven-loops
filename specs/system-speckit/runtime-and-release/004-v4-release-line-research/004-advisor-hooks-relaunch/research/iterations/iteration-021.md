# Iteration 021 — Decision Capture Paths and DSH Registration

## Focus

Two unread surfaces, both read-only:

1. The decision-capture hook under `.skilled/hooks/decision-capture/**`: what it records, where it writes, whether every path resolves against the repository root or `process.cwd()`, and whether its README matches the code.
2. DSH hook registration: what `.dsh/plugins/repo-guards/index.mjs` registers, compared against every concern that ships a `dsh/` adapter under `.skilled/hooks/*/dsh/`, naming each adapter that is never registered.

Explicitly out of scope this iteration: registry findings already recorded (dispatch-audit cwd, goal slice, ask-surface).

## Actions Taken

1. Enumerated every `dsh/` concern folder under `.skilled/hooks` and every file inside it, separating real files from symlinks (`find -type f` vs `-type l`), then listed `.dsh/plugins/repo-guards/adapters/`.
2. Read the bundle entry point `.dsh/plugins/repo-guards/index.mjs` in full, plus the two install patches `.dsh/patches/guards.patch.yml` and `.dsh/patches/lineage.patch.yml`.
3. Read the decision-capture adapter `.skilled/hooks/decision-capture/dsh/decision-capture.mjs` and diffed it against its `.dsh/plugins/repo-guards/adapters/decision-capture.mjs` counterpart — the two are the same bytes, because the bundle file is a symlink back into the concern.
4. Read the path section of `.skilled/hooks/decision-capture/lib/capture-core.mjs` (lines 230-330) and the lock section, then compared its project token and queue segments against the save-time reader `.skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts`.
5. Ran the two `node:test` suites read-only: `node --test .skilled/hooks/decision-capture/tests/ .skilled/hooks/decision-capture/lib/ .skilled/hooks/decision-capture/dsh/` → 44 pass, 0 fail; `node --test .skilled/hooks/decision-capture/bin/` → 84 pass, 0 fail.
6. Checked broken symlinks across `.skilled/hooks` and `.dsh` (`find -type l ! -exec test -e {} \;`), and checked the ignore status of the queue directory with `git check-ignore -v` and `git status --porcelain --untracked-files=all`.

## Findings

### f-iter021-001 — P2 — the decision-capture concern has no README, and the shipped guard cannot notice

`.skilled/hooks/decision-capture/` carries six folder-level READMEs — `bin/README.md`, `dsh/README.md`, `claude/README.md`, `devin/README.md`, `lib/README.md`, `tests/README.md` — and no concern-level `README.md`. Twenty-five of the twenty-seven sibling concerns in `.skilled/hooks/` have one; the only other exception is `ask-surface-guard/`. Its own `dsh/README.md` §3 links upward to `../` with the label "the decision capture concern folder", which lands on a directory with no landing document. [SOURCE: .skilled/hooks/decision-capture/dsh/README.md:35]

The mechanism that should catch this does not. `bin/runtime-refusal.test.mjs` describes itself as the suite that "Checks that the concern README carries a coverage row for all seven runtimes" [SOURCE: .skilled/hooks/decision-capture/bin/README.md:26], and its name is "the README decision-capture row follows the runtime-cell convention" [SOURCE: .skilled/hooks/decision-capture/bin/runtime-refusal.test.mjs:43]. But it resolves its subject as `new URL('../../README.md', import.meta.url)` [SOURCE: .skilled/hooks/decision-capture/bin/runtime-refusal.test.mjs:12-13] — from `decision-capture/bin/`, `../../` is `.skilled/hooks/`, so it reads the **registry** README and asserts the `decision-capture` row of the concern table there [SOURCE: .skilled/hooks/README.md:47]. That assertion is green. The per-concern coverage document the test's own description names is never opened, which is why two concerns can ship without one and the suite stays 84/84.

Severity P2: nothing misbehaves at runtime; an operator or AI user arriving at the concern folder gets six sub-documents and no entry point. Confidence high — both reads and both test runs are direct.

Verify: `ls .skilled/hooks/decision-capture/README.md` (ENOENT) and `node --test .skilled/hooks/decision-capture/bin/runtime-refusal.test.mjs` (passes), then read the `../../` resolution at `runtime-refusal.test.mjs:13`.

Introduced by: not attributable to a v4.0.x release from this evidence — the folder shape predates the release line's hook consolidation, and `git log --follow -- .skilled/hooks/README.md` (path-limited) would place it. Recorded as a pre-existing docs gap this line inherited rather than introduced.

### f-iter021-002 — P2 — a test seam with no writer

`bin/runtime-refusal.test.mjs` accepts an override for its subject path: `process.env.DECISION_CAPTURE_README_PATH ?? fileURLToPath(new URL('../../README.md', import.meta.url))` [SOURCE: .skilled/hooks/decision-capture/bin/runtime-refusal.test.mjs:12-13]. A repository-wide search finds exactly one occurrence of that variable — the definition itself. No test runner, CI job, doctor command or fixture sets it, so the override has never selected a file and the test always reads `.skilled/hooks/README.md`.

This is the cheap half of f-iter021-001: the seam exists precisely because someone intended the subject to be configurable, and pointing it at `.skilled/hooks/decision-capture/README.md` is the one-line change that turns the guard into a real per-concern check. Removing the seam changes nothing today; **what breaks if removed** is the only route by which the missing concern README could ever be asserted, so it should be wired up, not deleted.

Confidence high. Verify: `grep -rn "DECISION_CAPTURE_README_PATH" .skilled .dsh .github` returns one line.

### f-iter021-003 — P2 — the DSH advisor is the one opt-in guard, and its only switch is a patch file

`apply()` registers twenty-one adapters, twenty of them with `config.adapters.<name>` passed straight through (which is `undefined` unless set, and every registration function defaults to on) [SOURCE: .dsh/plugins/repo-guards/index.mjs:45-68]. The advisor is the exception: `registerPromptAdvisor(ctx, { enabled: options.promptAdvisor === true })` [SOURCE: .dsh/plugins/repo-guards/index.mjs:52] — an explicit `=== true`, so absent config means no advisor brief on DSH.

The single place that sets it is the install patch: `config: adapters: promptAdvisor: true` [SOURCE: .dsh/patches/guards.patch.yml:4-6]. An operator who installs `repo-guards` by any other route — a hand-written plugin row, a copied bundle, a doctor path that does not reproduce `.dsh/patches/` — gets every guard except the advisor, silently, with no error and no log line, because the disabled branch returns before registering a handler. That is the operator-UX shape of the finding: the one guard whose absence is *invisible in the transcript* is also the one that requires an explicit opt-in.

Confidence medium: the code path and the patch are both read directly, but which install routes actually reproduce `.dsh/patches/guards.patch.yml` is unread this iteration, so "every other route loses the brief" is inference from the disabled branch, not a measured install.

Verify: `node -e "import('./.dsh/plugins/repo-guards/index.mjs').then(m=>console.log(m.name))"` after constructing a context stub without config, then confirm no `agent/pre-step` handler is registered; and compare `.dsh/patches/guards.patch.yml` against whatever `.dsh/README.md` tells an installer to do.

## Confirmations (positive results, no change requested)

- **No unregistered DSH adapter.** Twelve real adapter files ship under `.skilled/hooks/*/dsh/`: `ask-surface-guard.mjs`, `classifier-injection-screen.mjs`, `decision-capture.mjs`, `dispatch-audit.mjs`, `dispatch-preflight-lint.mjs`, `goal-context.mjs`, `goal-manage.mjs`, `mcp-route-guard.mjs`, `overlay-guard.mjs`, `post-edit-quality.mjs`, `task-dispatch-guard.mjs` plus the two shared helpers `dsh-llm.mjs` and `session-role.mjs`. Every one of them reaches `.dsh/plugins/repo-guards/adapters/` as a relative symlink, and every one appears in `apply()`. The remaining six concerns (`completion`, `git-message-gate`, `git-preflight`, `session-lifecycle`, `skill-advisor`, `spec-gate`) are README-only folders whose real modules live in `.skilled/skills/system-spec-kit/runtime/hooks/dsh/` and `.skilled/skills/system-skill-advisor/hooks/dsh/` and are linked into the same adapters folder. `git-live-follow/dsh/` and `git-primary-reconcile/dsh/` ship `.sh` links, not adapters, and their READMEs correctly say the bundle runs those scripts from `session-start-advisories.mjs`. [SOURCE: .skilled/hooks/git-live-follow/dsh/README.md:17] [SOURCE: .skilled/hooks/git-primary-reconcile/dsh/README.md:17]
- **Zero broken symlinks.** `find .skilled/hooks .dsh -type l ! -exec test -e {} \; -print` returns nothing across the twelve links in `dsh/` folders and the bundle's adapters.
- **The DSH decision-capture README matches its code.** The README promises exactly three handlers — `tools/result`, `session/event`, `agent/status` — a `fail-open` error policy, `source: 'hook'` record tagging, and `takeNudge` at idle [SOURCE: .skilled/hooks/decision-capture/dsh/README.md:25]; the adapter registers exactly those three [SOURCE: .skilled/hooks/decision-capture/dsh/decision-capture.mjs:67-113], tags with `source: 'hook'` at the queue boundary, and declares `ERROR_POLICY = 'fail-open'`. No drift.
- **The queue path is anchored at the repository root, not `process.cwd()`, and hook and reader agree.** `QUEUE_RELATIVE_DIR = '.skilled/skills/.state/decision-capture'` [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:40]; `queueDir` joins it under `canonicalRoot(projectDir)` [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:275-278]; `projectToken` is `sha256(canonicalRoot).slice(0,12)` [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:272-274]. `canonicalRoot` shells `git rev-parse --show-toplevel` with `GIT_DIR` and `GIT_WORK_TREE` deleted from the environment and a 5000 ms timeout, falling back to `realpathSync(input)` and then `resolve(input)` [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:242-268]. The save-time reader computes the identical segments and the identical token — `STATE_DIR_SEGMENTS = ['.skilled','skills','.state','decision-capture']` [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:125], `sha256(canonicalRoot(dir)).digest('hex').slice(0,12)` [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:164-165], joined under the project root [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:804-807]. Hook and reader cannot disagree about where a queued answer lives. This is the decision-capture half of the iteration-18 open question about goal-vs-capture agreement on a non-git directory; the goal half was not re-read.
- **The `cwd` default is a fallback, not the anchor.** `registerDecisionCapture` defaults `cwd = process.cwd()` [SOURCE: .skilled/hooks/decision-capture/dsh/decision-capture.mjs:58], but `sessionOf` prefers `agent.session.header?.cwd ?? cwd` [SOURCE: .skilled/hooks/decision-capture/dsh/decision-capture.mjs:38-42], and the value handed to the core is `session.projectDir`, which `canonicalRoot` then re-anchors through git. A DSH process started in a subdirectory still queues under the repository root.

## Questions Answered

None of the three strategy key questions was answered this iteration. Both focus surfaces were in the hook cluster adjacent to them, and the iteration was scoped read-only to those two surfaces.

## Questions Remaining

- **Advisor transport (v4.0.0.0, v4.0.0.16)** — degraded local scoring and the shared-daemon lease/two-launcher race remain unexercised. Now carried across **eleven** iterations of the run and still the largest untested claim in it.
- **UX and extension proper** — enabling relaunch, reading the advisor brief, recovering history after compaction. Sixteenth iteration unreached as a whole; this iteration produced UX findings only inside the hook cluster (f-iter021-003) and they should not be counted against it.
- **New — is `ask-surface-guard/`'s missing concern README the same gap as f-iter021-001, or deliberate?** The two README-less concerns are exactly the two whose coverage tables live in the registry README. One read of either folder's docs plan settles whether the omission was a decision.
- **New — which install routes reproduce `.dsh/patches/guards.patch.yml`?** This decides whether f-iter021-003 is a silent-loss bug or a non-issue for every supported install. `.dsh/README.md` and `.dsh/SYNC.md` are the two documents to read.
- **New — does the decision-capture queue ever get consumed for a session whose reader runs from a different checkout?** `projectToken` hashes the canonical root path, so a second clone of the same repository gets a different token and cannot see the first clone's queue. Whether a worktree counts as the same project is the untested case.
- Carried unchanged: which layer drops the advisor redirect (CLI handler vs `recommend_with_native_advisor()`); the generation-1 advisor follow-ups (`sk-create-skill-parent` shared-packet entry, duplicate `package_skill.py`); the hook git-call time limit; `hook-flags.sh` vs `hook-flags.cjs` differential; `leaf-scopes.json` optionality; the live Claude turn-end hang; the live Codex compaction.

## Next Focus

Iteration 22 of 22 — the final iteration. Two candidates, both cheap and both closing an item that has been carried for most of the run:

1. **The advisor degraded/daemon path** (carried eleven iterations, the run's largest untested claim). One read of the launcher's degraded branch plus one measured run with the daemon and its lock directory absent settles whether the documented behavior holds.
2. **`ask-surface-guard/`'s documentation shape** together with `.dsh/README.md`/`SYNC.md`'s patch-reproduction behavior — which converts f-iter021-001 from "one folder is missing a file" into either a deliberate pattern or a naming bug, and settles f-iter021-003's severity.

Prefer 1 if only one surface fits: it is the oldest and largest open claim, and the two new items above are P2 refinements of a cluster this iteration already mapped.

## SCOPE VIOLATIONS

None. All writes landed in `research/iterations/iteration-021.md`, `research/deltas/iter-021.jsonl` and the gateway's own ledger writes. Every researched path was read with `cat`, `sed -n`, `grep`, `find`, `ls` or `git status`/`git check-ignore`; the two `node --test` runs are read-only observers that write only to the OS temp directory.
