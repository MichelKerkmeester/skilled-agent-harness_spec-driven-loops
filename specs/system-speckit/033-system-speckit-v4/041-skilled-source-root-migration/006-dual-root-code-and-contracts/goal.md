---
title: "Goal: make the .opencode contract components work under either root"
description: "The durable directive for the phase that teaches root discovery, launchers, installers and two gates to resolve under .opencode, under .skilled and under an .opencode link before the tree moves, and the criteria that decide when it is done."
trigger_phrases:
  - "dual root phase goal"
  - "skilled contract components goal"
  - "either root completion criteria"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/006-dual-root-code-and-contracts"
    last_updated_at: "2026-09-17T13:05:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Closed every review finding and ran the final verification at dadf2d19dd"
    next_safe_action: "Start phase 007 per its goal after re-deriving its naming-guard expectation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-006-goal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 004 recorded L1, one .opencode -> .skilled link"
      - "This phase owns install-git-hooks.sh, the .gitignore twins and the publish step"
---
# Goal: make the .opencode contract components work under either root

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every component that defines what `.opencode` means resolves under `.opencode/`, under `.skilled/` and under an `.opencode -> .skilled` link, so the move can land as a pure rename.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Root names extend the existing sentinel logic. `repo-root.mjs` exports `.skilled` and `.opencode`, and resolvers test the sentinel under each name and hoist above either. Scripts resolve from their own directory. No new module is added. |
| D2 | The legacy spec alias keeps the single spelling `.opencode/specs`. Resolvers gain no `.skilled/specs` form and are proven in all three layouts. Detectors that must catch any on-disk spelling list all three. |
| D3 | The six MCP registrations name one path each, so they are proven by a launch probe and not edited here. Their retarget follows phase 004's shape and phase 009's rewrite. |
| D4 | DeepSeek V4.1 Flash drafts one file per short literal brief through three parallel lanes: cli-pi on the LLM Gateway at max, cli-pi on Cline at xhigh and cli-devin at max. GPT-5.6 Luna at xhigh on the fast tier through cli-codex reviews each component, several at a time. The orchestrator owns every design choice, verifies each batch and runs its tests before commit, and runs the move rehearsal. Amended 2026-09-17 by the operator's model decisions: Luna replaces GPT-5.6 sol, and later the same day the executor lanes were widened for parallelism, following parent D3 |

### Operator copy

A change here that alters a parent decision or criterion is applied to the parent first.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] All 15 contract components pass their tests in three layouts: real `.opencode/`, real `.skilled/` and real `.skilled/` with `.opencode -> .skilled`. If phase 004 selects per-entry links, they also pass with `.opencode/` holding one link per moved entry
- [x] Rows that fail on `728c4f3efc` and pass after the change cover a root resolved to its start directory, a zero-file guard pass, skipped worktree dependencies, a duplicated Codex hook, a workspace root at `.skilled` and drift sources lost to a `.skilled/` spelling
- [x] In a `.skilled`-only clone of the rebuilt tree, the drift checker prints `[CONTRACT DRIFT] OK` and the no-spec-import guard exits 1 beside a seeded import. `test ! -e .opencode` holds after the suites
- [x] `dist-freshness.cjs check --package <id> --json` reads `"stale":false` for every rebuilt package, and comment hygiene passes on every changed code file
- [x] The phase validates `RESULT: PASSED` with every acceptance criterion Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and this file, authored against `728c4f3efc` |
| Current-behavior probes | Done | Fixture probes in a session scratch directory covered root discovery, workspace identity, the advisor walk, the guard, the launcher paths, the hook installer, the worktree launcher, the relinker and drift-source derivation |
| Phase 005 gate | Validated | `validate.sh --strict` on `005-gate-and-ci-readiness` printed `RESULT: PASSED` on 2026-09-17 at `cfeba3e1fb`, the start commit of this phase |
| Phase 004 shape | L1, one `.opencode -> .skilled` link | `004-migration-design/decision-record.md` ADR-001 reads `Accepted`. The `entry-links` layout is therefore not required (REQ-015, AC-015), and the `skilled-only` launch row of REQ-012 is recorded, not required to pass |
| Executor readiness | Ready | `command -v pi` found Pi 0.85.1 and a read-only DeepSeek probe answered `PONG7` in 23 s. `command -v codex` found codex-cli 0.154.0, `codex login status` read `Logged in using ChatGPT` and a read-only Luna probe answered `PONG 7` in 16 s |
| Start commit | `cfeba3e1fb` | Between the planning commit `728c4f3efc` and this commit, the planned paths changed only in `check-git-hooks.sh`, its test and the sk-doc routing manifest, so the planning probes still describe the files this phase edits |
| Baseline | Recorded | `scratch/baseline-counts.md`, every command in `plan.md` §5 at `cfeba3e1fb` |
| Implementation | Done | 30 code and test commits from `1553cbbea5` to `dadf2d19dd`, one per component or review round |
| Contract reviews | Closed | 23 GPT-5.6 Luna reviews. Every finding was reproduced, then fixed with a row that fails first or answered with evidence, and every fix was reviewed again. Dispositions are in `implementation-summary.md` |
| Final verification | Green at `dadf2d19dd` | Builds and freshness, every command in `plan.md` §5, the twin suites, the rehearsal and the typechecks. Counts are in `implementation-summary.md` |
| Publish rollback | Written before the push | Both remotes sat at `cfeba3e1fb` and the main checkout at `cfeba3e1fb` with no uncommitted file in a phase commit. Rollback: revert `cfeba3e1fb..dadf2d19dd` in a clean clone, push the revert to `skilled/v4.0.0.0` and `main`, and fast-forward the main checkout again. The changes are backward compatible, so the revert restores the earlier behavior in full |
| Publish | Done at `dadf2d19dd` | Pushed to `skilled/v4.0.0.0` and `main` as fast-forwards. The main checkout sits on the tip with its 23 uncommitted files from other sessions untouched, a fresh `code_mode` launcher answered `initialize`, and a commit at `7085ec3290` ran the global hooks with no error line once the worktree launcher's shared dependencies were linked in. CI on the tip adds no failure: 12 of 17 runs passed and the three red workflows match their baseline runs line for line |

### Deviations and findings

| Item | Note |
|------|------|
| Five root-discovery twins the map classed `mechanical` | Decided 2026-09-16: they join this phase (T065). Each compares a path segment with `.opencode`, so leaving them to phase 009 would misresolve under the link between the move and the rewrite |
| The dist staleness hook is not evidence | `check-dist-staleness.sh --all` always exits 0 and rebuilds a stale package on its own, so verification reads `dist-freshness.cjs check --json` directly |
| Global commit-msg hook blocks fixture commits | Seen while probing. Fixtures set `core.hooksPath` to an empty directory |
| Phase 004's shape for `.opencode/` | UNKNOWN at planning time. Its ADR-001 was Proposed and conditional on phase 003's probes: one `.opencode -> .skilled` link, or per-entry links. T001 records the Accepted shape, and REQ-015 adds the per-entry layout to the proof only if 004 selects it |
| Phase 004's plan assigns more work to this phase | Decided 2026-09-16: `install-git-hooks.sh` (T066), the `.gitignore` twins (T067) and the publish step (T070) stay here, following phase 004's cutover steps 6 to 8 |
| Layout names | Phase 004 uses L1 to L4 for its layout options, so this phase names its test layouts `today`, `skilled-only`, `whole-link` and `entry-links` |
| The builder of edit payloads stalled DeepSeek once | The first dispatch of the parity-test unit spent eight minutes reasoning about OLD blocks that began with a blank line and wrote nothing. The payload builder now widens every block to non-blank boundary lines, the retry applied in six minutes and later units took about twenty seconds each |
| The runtime CLI imports the resolver through its hooks re-export | TypeScript callers under `runtime/cli` import `@spec-kit/runtime/hooks/lib/workspace/repo-root.mjs`, so that re-export and its declaration gained `SOURCE_ROOT_NAMES`. Two files beyond `spec.md` §3, both mechanical follow-ons of the planned export |
| Luna's review of C1 found a regression | Hoisting above the outermost source-root segment moved a capped walk past a repository that sits under a directory named `.skilled` (reproduced against both commits). Fixed in `4c8dd774f8`: a capped walk first takes the nearest source-root parent that holds the sentinel. The same step went into the advisor walk and its schema twin before C7 was dispatched. Two edge rows that passed on the parent commit were tightened |
| Luna's review of C6 found two anchor defects | A checkout whose own directory is named `.skilled` resolved to its parent, and today's layout chose the empty `.skilled` placeholder over the real `.opencode` tree as the anchor. Both reproduced. Fixed by preferring the source root whose tree carries the spec-kit skill wherever the anchor is ambiguous, which keeps a stray tree inside a source root a leak |
| A relative `.skilled/specs/<id>` argument resolves | The plan expected the folder detector to reject it. It resolves to the canonical packet through the detector's nested and child search instead. No resolver returns a `.skilled/specs` path, so the legacy-alias decision holds, and the row records the observed resolution |
| The Gate 3 classifier test reads a build | `runtime/shared` links to `shared/dist`, so the classifier rows only see a source change after a rebuild, and `npm run typecheck` rebuilds that tree as a side effect. Its controls were rerun with an explicit rebuild before each run |
| A Python test fails before this phase | `test_parent_templates_carry_the_same_exact_directive` in `sk-doc/scripts/tests/test_create_skill_contract.py` fails at the start commit, so the validator twin is judged on its own new test |
| Two twins had no test to extend | The advisor CLI's repository walk and the ledger capture script's workspace walk gained new test files. The other three twins and the git hook installer gained rows in existing tests |
| The git hook installer keeps its `.opencode` source literal | This phase makes a link into either root's `scripts/git-hooks/` count as owned, as phase 004's step 6 asks. The installer's source directory literal is phase 009's rewrite, so the harness proves that direction on a copy with the literal rewritten |
| One queue stop was the orchestrator's own write | The relink test unit stopped on a scope check because the orchestrator wrote the rehearsal script into the worktree during that dispatch. The unit's file matched byte for byte, and later queues kept the worktree untouched while they ran |
| Luna's review of C7 found four fixable defects | A walk capped at zero levels, as the skill-graph watcher uses, hoisted past a repository under a directory named `.skilled`, and a sentinel under `.opencode/specs` was also tried under `.skilled/specs`, against the rule that the spec alias keeps one spelling. Both reproduced and are fixed in all three resolvers: the capped fallback tests the start first, and a spec-alias sentinel is tested as written. The lockstep row now uses a fixture the old hoist fails, and the advisor walk's comment describes its fallback |
| Two C7 findings go to phase 009 | The skill-graph watcher joins a literal `.opencode/skills` onto the root (`lib/daemon/watcher.ts:132`), and `handlers/advisor-validate.ts:218-220`, `bench/scorer-bench.ts:27-30` and `bench/scorer-calibration.bench.ts:78-81` recheck a literal `.opencode` sentinel after the walk. Both resolve through the `.opencode -> .skilled` link that phase 004 chose and fail only in a checkout with no `.opencode` path at all. They are path constants, which phase 009 rewrites |
| Luna's reviews of C10 to C14 | Each finding was reproduced before any change. Fixed: the no-spec-import workflow's positive-fixture step (next row), an unreadable file passing the guard, spec-tree messages naming one alias, the compiler writing a new `.opencode` tree when a path is missing under both names, orphan rows for the Codex hook installer under either name, git-environment isolation in its fixtures, the worktree database directory assertion and today's `.skilled` placeholder in the worktree and relink fixtures. Answered without a change: the installer's labels follow the plan (my review brief misquoted it), a `.skilled`-only checkout whose source still names `.opencode` behaves the same on the parent installer, and the one-line import heuristic and the recorded-digest path behave the same on the parent commits |
| The no-spec-import workflow's exact exit check had no owner | The plan left it to phase 005, which closed without it, so once the guard exited 2 on an empty scan a moved positive fixture passed CI where it had failed before. Running the step from both workflow versions reproduced it. The orchestrator placed the fix here on 2026-09-17: the step requires exit 1 |
| Path literals left for phase 009 | Reviews named `.opencode` literals that fail only with no `.opencode` path and resolve through L1's link: the guard workflow's script path, the contract renderer's constants and the compiler test's expectations, the divergence ledger's Python scorer path, the Codex hook source file and the usage comments in the installer and relinker |
| Parallel lanes | On 2026-09-17 the operator widened D3. Units then ran one worker per lane, and a batch passed only when the changed set equaled the queued files and every file matched its expected bytes. One LLM Gateway dispatch hit an upstream 429 on all three retries and wrote nothing, the batch check caught the unchanged file, and the unit was re-run on the Cline lane. Luna ran up to four reviews at once |
| Follow-up reviews | Workspace identity: the linked `.opencode` spelling joined the variants. A stray tree inside a skill folder anchors there on the original module under either spelling, and a bare directory named `.skilled` is a source root by name, so neither changed. Lockstep: a `.skilled/specs` sentinel now also tests the legacy spelling, and the schema twin's comments were corrected. Its start-first fallback cannot be reached through `detectRepoRoot`'s fixed 14-level walk |
| Twins review | Fixed: the graph metadata walk accepted `.skilled/specs` as a specs root, against D2, and the git hook installer scanned a fixed `.opencode` directory, so a `.skilled`-only checkout installed nothing and reported success. It now falls back to `.skilled` and fails when neither holds hooks. Answered: the Gate 3 walk accepts a bare `.skilled` beside `AGENTS.md` as it accepted a bare `.opencode`, a `specs` directory nested inside a source tree behaves the same for `.opencode` on the start commit, and phase 005's SessionStart check warns rather than passing silently in a `.skilled`-only checkout |
| Spec-root review | The C2 to C4 rows gained real coverage: a thrown relative `.skilled/specs` argument now fails its row, a real `.skilled/specs` decoy must be rejected where `.opencode` does not lead to it, the migration manifest and migration run per layout, and fixture setup that can fail runs inside the cleanup guard. The manifest refuses a dangling legacy alias in today's layout and under the link alike |
| Guard follow-up | An allowlisted-only scan now exits 2, and an unreadable file outranks a violation. The real `bin` scan reports 26 read files where it counted 30 found files |
| Fail-before evidence | A copy of the worktree with the start commit's 23 changed source files and today's tests. The regression rows fail there and pass in the worktree. The hook installer harness needs the checkout's git toplevel, so its two new rows were proven against HEAD's installer in a scratch repository instead |
<!-- /ANCHOR:log -->
