# AI Council Review — Phase 005 lease-correctness-and-arc-traceability

**Council**: cli-codex gpt-5.5 xhigh
**Target commit**: bd8a90747
**Date**: 2026-05-18T16:29:15+02:00

## Council verdict summary

| Seat | Verdict | New P0 | New P1 | Notes |
|---|---|--:|--:|---|
| 1 Security Skeptic | CONDITIONAL | 0 | 2 | Ordinary shared override is improved, but alias paths and rolling-start migration still leave bypasses. |
| 2 Correctness Verifier | CONDITIONAL | 0 | 1 | Cleanup still does not run when the child exits by an uncatchable signal and the parent mirrors it. |
| 3 Traceability Auditor | CONDITIONAL | 0 | 2 | The packet claims completion while task state and REQ anchors still contradict the shipped docs. |
| 4 Scope-Creep Watcher | CONDITIONAL | 0 | 1 | The committed reference-doc set diverges from the frozen files-to-change list. |
| 5 Simplicity Advocate | CONDITIONAL | 0 | 0 | The code changes are mostly small; the doc/test scaffolding is the complexity risk. |

**Aggregate verdict**: CONDITIONAL

## Seat 1 — Security Skeptic

### Findings

### [P1] Skill-advisor lease identity is still bypassable through symlink, bind-mount, or case aliases

- **File**: `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts:59`
- **Evidence**: `resolveSkillAdvisorDbDir()` canonicalizes overrides with `path.resolve()` only, and `workspaceKey()` stores `dirname(resolveLeaseDbPath(...))` as the SQLite row key. The lease table enforces uniqueness on that text key, not on the real filesystem identity of the database directory (`lease.ts:82`, `lease.ts:190`, `lease.ts:218`). On macOS case-insensitive paths, two symlinks to one DB directory, or Linux bind mounts, two launchers can open the same underlying `skill-graph-daemon-lease.sqlite` but write different `workspace_key` rows.
- **Impact**: This reopens the P1-11 class for skill-advisor: two processes can pass the single-writer check while writing the same skill graph DB through different path spellings.
- **Suggested fix**: Canonicalize the DB directory with `fs.realpathSync.native()` after creating it, use that canonical path for the skill graph DB path and daemon lease `workspace_key`, and add a symlink-alias test where two override strings point to the same real directory.

### [P1] First launcher start after the commit can ignore a live pre-commit lease

- **File**: `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts:74`
- **Evidence**: The new `defaultLeaseDbPath()` only checks `skill-graph-daemon-lease.sqlite` beside the resolved DB directory. The prior version stored the lease DB at `.opencode/skills/.advisor-state/skill-graph-daemon-lease.sqlite` (`bd8a90747^:.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts:53`). Code-index has the same rolling-start shape for DB-dir overrides: `leasePath()` now reads the resolved override directory (`.opencode/bin/mk-code-index-launcher.cjs:125`), while the migration block only copies legacy DB files into the canonical DB dir and does not probe an old workspace-local launcher lease (`mk-code-index-launcher.cjs:380`).
- **Impact**: If an old launcher/daemon is still alive during rollout, a new launcher can see no lease in the new location and start a second writer against the same SQLite DB. That is a real corruption window, even if it is limited to rolling restarts.
- **Suggested fix**: Add a one-release compatibility probe for old lease locations before declaring the new lease absent. If a live old owner is found, exit with `LEASE_HELD_BY` and log that the lease was found at a legacy path; if dead, reclaim/migrate explicitly.

### [P2] Lease artifacts are created with default group/world-readable modes

- **File**: `.opencode/bin/mk-code-index-launcher.cjs:157`
- **Evidence**: PID files are written via `fs.writeFileSync(tmp, ...)` with no explicit mode, and directories are created with default recursive `mkdirSync` permissions. On this checkout the generated PID files are `-rw-r--r--` under `drwxr-xr-x` DB dirs. The same pattern exists in spec-memory (`.opencode/bin/mk-spec-memory-launcher.cjs:124`) and the skill-advisor lease DB directory (`.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts:110`).
- **Impact**: This is not a direct write bypass under the observed default perms, but it leaks process metadata to other local users and relies on ambient umask for lease hardening.
- **Suggested fix**: Use `mkdirSync(..., { recursive: true, mode: 0o700 })` for owned DB/lease dirs where compatible, and write lease files with mode `0o600`. Document any intentionally shared DB-dir exception.

## Seat 2 — Correctness Verifier

### Findings

### [P1] Child `SIGKILL` propagation bypasses the new exit cleanup

- **File**: `.opencode/bin/mk-code-index-launcher.cjs:321`
- **Evidence**: When the child exits due to a signal, the parent mirrors that signal to itself before clearing the lease: `process.kill(process.pid, signal)`. If the child was externally killed with `SIGKILL`, Node cannot run `process.on('exit')`, and the new handler at `mk-code-index-launcher.cjs:374` never fires. The same pattern exists in skill-advisor (`.opencode/bin/mk-skill-advisor-launcher.cjs:302`) and spec-memory (`.opencode/bin/mk-spec-memory-launcher.cjs:268`). The tests cover parent `SIGQUIT` cleanup, not an externally `SIGKILL`ed child (`.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:263`).
- **Impact**: P1-13 is not actually unconditional. A killed child can leave a stale launcher lease behind; stale reclaim handles the common dead-PID case, but PID reuse can still cause a false held lease until the unrelated process exits.
- **Suggested fix**: In each `childProcess.on('exit')` signal branch, call `clearLeaseFile()` synchronously before mirroring the signal. Add a test that sends `SIGKILL` to the child process and asserts the parent removes its own PID file before exiting.

### [P2] The SIGKILL backstop path is tested indirectly, not as the advertised termination mode

- **File**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/005-lease-correctness-and-arc-traceability/spec.md:178`
- **Evidence**: The edge-case list calls out "SIGKILL backstop path", but launcher tests only send normal signals to the parent process (`SIGTERM`/`SIGQUIT`) and wait for cleanup. They do not use a child fixture that ignores termination until the 5s backstop kills it.
- **Impact**: The most important new cleanup path can regress without failing tests.
- **Suggested fix**: Add one focused test per inline PID-file launcher with a child fixture that ignores `SIGTERM`, then assert the backstop sends `SIGKILL` and the lease file is gone.

## Seat 3 — Traceability Auditor

### Findings

### [P1] Phase 005 says Complete while its task list still blocks the commit step

- **File**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/005-lease-correctness-and-arc-traceability/tasks.md:82`
- **Evidence**: `spec.md` marks the packet `Complete` and REQ-015 requires "One conventional commit on main" (`spec.md:49`, `spec.md:134`), but `tasks.md` still has `T022 [B]` blocked because `git add` failed, and the completion criteria still say all tasks are not marked done and a blocker remains (`tasks.md:90`, `tasks.md:91`).
- **Impact**: The packet's own source-of-truth docs disagree about whether the committed state exists. Resume/review tooling will see a completed spec and an incomplete task graph at the same time.
- **Suggested fix**: Update T022 with the actual main-agent commit evidence for `bd8a90747`, mark the completion criteria complete, and record that the main agent performed the commit after the sandbox staging failure.

### [P1] REQ anchors added to tests do not identify which requirement namespace they belong to

- **File**: `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-lease.vitest.ts:308`
- **Evidence**: The test comment says `REQ-012` for the resolved DB directory boundary, while Phase 005 defines `REQ-012` as SQLite WAL fallback and `REQ-011` as resolved DB-dir lease ownership (`spec.md:125`, `spec.md:126`). A second example: the SIGQUIT cleanup comment says `REQ-002 / REQ-011` (`launcher-lease.vitest.ts:358`), but Phase 005 `REQ-002` is parent validate evidence and `REQ-011` is DB-dir lease ownership.
- **Impact**: P1-8 is only partially closed. The anchors exist, but a future reviewer cannot tell whether they refer to Phase 003, Phase 004, or Phase 005 requirements without reconstructing arc history.
- **Suggested fix**: Prefix anchors with the phase namespace, for example `003-REQ-009`, `004-REQ-002`, or `005-REQ-011`, and update the 005 checklist to state which namespace each test suite uses.

### [P2] The parent invariant describes a uniform PID-file model that skill-advisor does not implement

- **File**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/spec.md:70`
- **Evidence**: The parent says each launcher writes a PID file via atomic temp+rename. That is true for code-index and spec-memory (`mk-code-index-launcher.cjs:157`, `mk-spec-memory-launcher.cjs:124`), but skill-advisor checks `isLeaseHeld()` and then starts the child; its production single-writer state is the daemon lease DB acquired by `lease.ts`, not a launcher-written PID file (`mk-skill-advisor-launcher.cjs:360`, `lease.ts:190`).
- **Impact**: The central invariant is aspirational for one of the three launchers, which weakens the doc's value as a future maintenance guard.
- **Suggested fix**: Split the invariant into "inline PID-file lease" for code-index/spec-memory and "daemon SQLite lease DB" for skill-advisor.

### [P2] Child 002 still contains checked-but-pending validation text after its status flip

- **File**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/002-cross-launcher-lease-propagation/checklist.md:115`
- **Evidence**: The 002 spec now says `Complete` (`002-cross-launcher-lease-propagation/spec.md:48`), but its checklist still has a checked P1 item whose evidence says "Pending: re-run after this checklist + plan.md anchors land."
- **Impact**: This is lower impact than the 005 task contradiction, but it is the same doc-drift family that Phase 005 claimed to close.
- **Suggested fix**: Replace the stale pending sentence with actual validation evidence, or mark the item incomplete and explain the deferral.

## Seat 4 — Scope-Creep Watcher

### Findings

### [P1] The committed reference-doc changes do not match the frozen files-to-change list

- **File**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/005-lease-correctness-and-arc-traceability/spec.md:103`
- **Evidence**: The packet's scope lists `references/daemon-lease-contract.md` as the skill-advisor reference doc to modify, and the implementation summary claims it was modified (`implementation-summary.md:87`). The target commit did not include that file; at `bd8a90747`, it still says the daemon lease lives at `.opencode/skills/.advisor-state/skill-graph-daemon-lease.sqlite` and is workspace-keyed (`bd8a90747:.opencode/skills/system-skill-advisor/references/daemon-lease-contract.md:41`, `:119`). Instead, the commit modified `system-code-graph/references/launcher-lease.md` and `system-spec-kit/references/launcher-lease.md`, which are not named in the 005 file list.
- **Impact**: This is both an out-of-scope edit and a missed in-scope edit. The skill-advisor reference contract shipped stale for the exact P1-11 behavior the packet claims to close.
- **Suggested fix**: Commit the skill-advisor `daemon-lease-contract.md` update in a follow-on packet, and either add the two `launcher-lease.md` files to the scope ledger with rationale or revert their unrelated link edits.

### [P2] The reference-doc edits remove a concrete cross-link rather than improving lease correctness

- **File**: `.opencode/skills/system-code-graph/references/launcher-lease.md:80`
- **Evidence**: The code-graph and spec-memory reference diffs only replace a specific propagation-spec link with "Internal design notes define the propagation contract" (`system-code-graph/references/launcher-lease.md:82`, `system-spec-kit/references/launcher-lease.md:82`). They do not document the new resolved-DB-dir behavior.
- **Impact**: The edits add churn without increasing traceability for the 13 P1 closures.
- **Suggested fix**: Keep reference-doc edits tied to actual behavior changes: document override lease location where applicable, or leave unrelated link cleanup to a docs-only packet.

## Seat 5 — Simplicity Advocate

### Findings

### [P2] Static source assertions are a brittle substitute for the DB-open path guarantee

- **File**: `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-bootstrap.vitest.ts:195`
- **Evidence**: The watcher and rebuild tests assert source strings and regexes: `getDb()` calls `initDb(resolveSkillGraphDbDir())`, watcher contains a specific `defaultReindex` line, and rebuild contains a specific import/call string (`launcher-bootstrap.vitest.ts:199`, `:202`, `:210`, `:211`). This is simpler than booting the daemon harness, but it is also coupled to formatting and call-site text.
- **Impact**: A behavior-preserving refactor can fail the test, and a behavior-breaking change can pass if the checked strings remain while runtime control flow changes elsewhere.
- **Suggested fix**: Keep one static assertion if needed, but add a small injectable-path unit test that exercises watcher/rebuild dependencies through `initDb()` and observes `busy_timeout`/journal mode on the opened DB.

### [P2] The 8 KB checklist duplicates evidence but failed to keep packet state coherent

- **File**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/005-lease-correctness-and-arc-traceability/checklist.md:151`
- **Evidence**: The checklist records command evidence, including the failed `git add`, while `tasks.md` still leaves the commit task blocked. The checklist is 8160 bytes and repeats much of `implementation-summary.md`, but it did not catch the contradictory completion state.
- **Impact**: The doc volume is not buying enough safety. It increases review surface while allowing the key state machine mismatch to survive.
- **Suggested fix**: Collapse duplicated command evidence into one canonical verification table and make the checklist reference it, then add a completion consistency check for blocked tasks before marking the spec Complete.

### [P2] The helper additions are proportional; the complexity problem is documentation, not code

- **File**: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:144`
- **Evidence**: `isWalFallbackError()` is a compact helper for the exact SQLite code-family requirement, and `resolvedAdvisorDbDir()` removes duplicated DB-dir resolution in the launcher (`skill-graph-db.ts:144`, `.opencode/bin/mk-skill-advisor-launcher.cjs:118`). The 1319 insertions are mostly spec metadata and packet docs, not implementation churn.
- **Impact**: I would not revert the helpers for simplicity. The follow-on should target the path-canonicalization and doc-state issues, not collapse the code back into inline conditionals.
- **Suggested fix**: Preserve the helpers, but add the missing realpath/migration behavior in the same local style.

## Cross-seat synthesis

Three concerns repeat across seats. First, P1-11 is materially better for ordinary identical override strings, but "resolved DB dir" is still lexical, not filesystem-canonical, and rolling-start compatibility was not handled. Second, P1-13's cleanup claim is stronger than the code: normal exits and handled signals are covered, but child `SIGKILL` propagation bypasses cleanup unless cleanup runs before signal mirroring. Third, the docs overstate closure: the packet is marked Complete while task state, REQ anchors, and the committed reference-doc set still disagree.

The seats disagree on proportionality. The Simplicity seat does not see the small helpers as over-engineering; the Scope and Traceability seats see the surrounding spec-doc churn as the main source of new risk.

## Recommended follow-on

Ship with a follow-on packet before treating the arc as fully closed. Do not revert the commit wholesale: the ordinary shared-override case, WAL fallback helper, and focused launcher coverage are useful. The follow-on should canonicalize DB directory identity with `realpath`, bridge legacy lease locations for one release, clear leases before parent signal mirroring, and reconcile the packet docs/REQ anchors/reference-doc scope.
