# Iteration 002 - Hook stdin deadlines (correctness)

BINDING: target=Commits ba56b03412..5d9c970447 on main (focus: hook stdin deadline commits c33f9d1984, 60d7e5d15b, 6842756e2d, 3163ee231e)
BINDING: maxIterations=10
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness,security,traceability,maintainability
BINDING: specFolder=specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review

## Dimension

correctness - do the four hook-deadline commits give every hook stdin reader a deadline, timer cleanup, partial-input handling and the short-timeout margin, and does the known item hold (500 ms deadline on 3 s hosts; no test for a late write after the deadline)?

The four commits replaced unbounded reads in .skilled/hooks (14 ESM hooks, one shared CJS reader) and in system-spec-kit/runtime/hooks (15 readers, one ESM + one TS twin), then gave the seven 3-second-host entries a 500 ms deadline. Reviewed the readers, all three test suites end to end, the known item, and - because the commit subject claims "every hook stdin reader" - the repository's own runtime hook registrations.

## Files Reviewed

| File | Result |
| --- | --- |
| .skilled/hooks/shared/hook-adapter-shared.cjs | 3000 ms default deadline; settles on end or deadline with the bytes read so far; release() clears the timer, removes listeners and pauses stdin on every settle path [SOURCE: .skilled/hooks/shared/hook-adapter-shared.cjs:20]. No byte cap (its TS sibling has one). |
| .skilled/hooks/shared/hook-adapter-shared.test.cjs | Two tests: never-closed stdin resolves at the deadline with bytes read so far and the process exits; ended input comes back whole. No late-write case. |
| .skilled/hooks/shared/hook-stdin-deadline.test.mjs | 14 ESM entries spawned with stdin held open: exit 0 with fail-open output, floor 2900 ms, latest 8000 ms; payload tests; no late-write case. |
| system-spec-kit/runtime/hooks/shared-stdin.ts | 3000 ms default, SHORT_HOST_STDIN_TIMEOUT_MS 500 [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts:23], 1 MB cap; overflow destroys stdin and resolves null; listeners are attached before the timer so a listener failure leaves no timer; release() clears the timer [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts:53]. |
| system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs | ESM twin of the CJS reader, same settle semantics and timer cleanup, no cap. |
| system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts | Inline bounded reader, 500 ms deadline, 1 MB cap; child budget 2500 ms with a 300 ms start margin; registered from dist by .claude/settings.json [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:27]. |
| system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs | 34 entries: deadline settle and fail-open output, short-host bound 400 ms / 2500 ms [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs:37], payload-written-but-never-closed test, byte-cap test. No late-write case. |
| .skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs | Unbounded readStdin [SOURCE: .skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:364], awaited in main at :393; registered in all four runtime configs. Finding R2-COR-001. |
| .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs | Unbounded reader [SOURCE: .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:53]; registered in all four runtime configs. Finding R2-COR-001. |
| .skilled/skills/sk-vision/hooks/devin/sk-vision.mjs | Unbounded reader [:44], awaited at :68 [SOURCE: .skilled/skills/sk-vision/hooks/devin/sk-vision.mjs:68]; reached through the tracked symlink .skilled/hooks/sk-vision/devin/sk-vision.mjs registered by .devin/hooks.v1.json:70. Finding R2-COR-001. |
| .claude/settings.json, .codex/hooks.json, .cursor/hooks.json, .devin/hooks.v1.json | Registered adapter inventory extracted; contains both sk-git hooks in all four runtimes. |
| .skilled/hooks/task-dispatch/claude/fable-subagent-guard.mjs | readSync is a transcript file read, not stdin; ruled out as a residual reader [SOURCE: .skilled/hooks/task-dispatch/claude/fable-subagent-guard.mjs:38]. |

## Findings by Severity

### P0

None.

### P1

None.

### P2

**R2-COR-001 - Registered hook entrypoints still read stdin with no deadline (P2)**

- claim: "give every hook stdin reader a deadline" is complete, verified by "unbounded reader search over .skilled/hooks -> no output, exit 1" (c33f9d1984 body).
- evidence: git-message-gate (unbounded read at :364, awaited at :393) is registered in .claude/settings.json:64, .codex/hooks.json:79, .cursor/hooks.json:88, .devin/hooks.v1.json:97; git-preflight-advisory (unbounded at :53) in .claude/settings.json:59, .codex/hooks.json:74, .cursor/hooks.json:76, .devin/hooks.v1.json:92; the sk-vision devin hook in .devin/hooks.v1.json:70 resolves through a tracked symlink (git mode 120000) under .skilled/hooks to the unbounded reader at .skilled/skills/sk-vision/hooks/devin/sk-vision.mjs:44. The sweep's search pattern missed symlinked files: recursive rg over .skilled/hooks/git-message-gate/ returns no "for await" while an explicit-file search of the same path returns :366; git ls-files -s shows 120000. The changed set (four commits) never touched these paths and they are absent from scope-files.txt.
- counterevidence sought: is this a documented deferral? Phase 009/005 implementation-summary.md:106 records only the system-spec-kit readers as a follow-up (later built by 6842756e2d); no equivalent note for sk-git/sk-vision.
- alternative explanation: the sweep's charter was only .skilled/hooks plus the spec-kit runtime hooks; the sk-git/sk-vision work is a separate planned effort. Plausible but undocumented, so unconfirmed.
- finalSeverity: P2. confidence: high on the facts; medium on host impact (host stdin-hold behavior is not observable in this read-only review).
- downgradeTrigger: an explicit follow-up packet covering these paths. Upgrade trigger: a host observed holding these gates' stdin open, or a fleet-wide coverage acceptance claim.

**R2-COR-002 - No test covers a write arriving after the stdin deadline (P2)**

- claim (known item): no test for a late write arriving after the deadline.
- evidence: all three suites read end to end. Entries either hold stdin open with no write, or write before settle (holdOpen writes immediately). No suite delays a write past the deadline; rg for late/deadline-write phrasing hits only the margin assertion [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs:143]. The harness already swallows writer-side errors because a settled reader stops reading [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs:117], yet no test pins the behavior.
- behavior probes (actual reader, no files written): probe A - readStdin({timeoutMs:500}) with the writer held open and writing at +1200 ms: settledAtMs=500 raw="" and node_exit_at_ms=501 (process exits at the deadline; a late write meets a closed pipe). probe B - same with the process kept alive 1600 ms after settle: settledAtMs=500 raw="" parsed=null; the late write is discarded; alive_1600ms_after_settle_late_write_ignored=true; exit 0.
- finalSeverity: P2 (coverage gap; behavior is benign fail-open, no defect observed). confidence: high.
- downgradeTrigger: n/a. Upgrade trigger: a host shown to fault (unhandled write error or block) on a post-settle write.

## Known Item Adjudication

- "500 ms stdin deadline on 3 s hosts": CONFIRMED as implemented and deliberate - SHORT_HOST_STDIN_TIMEOUT_MS 500 at shared-stdin.ts:23 and lib/hook-adapter-shared.mjs:17, the shim at user-prompt-submit.ts:27, passed at the seven short-host call sites; the suite asserts exit < 2500 ms against the 3 s host kill, leaving >= 500 ms margin [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs:38]. No margin defect proven. The suite itself was not re-executed (compiled entries require a build; dist is gitignored); the pass counts remain the commit's claim.
- "no test for a late write arriving after the deadline": CONFIRMED absent; behavior probed benign (see R2-COR-002).

## Traceability Checks

- spec_code: partial - the four commits' reader, deadline, cap and margin claims were checked against code and tests at HEAD for this slice; the fleet-wide coverage claim is refuted at registered entrypoints (R2-COR-001). The phase 010/011 spec-versus-code walk remains iteration 8's scope.
- checklist_evidence: partial - deadline suites' assertions encode the checklist (settle at deadline, exit 0, fail-open output, short-host bound); suites not re-executed (build required).
- skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability: not exercised this iteration.

## Evidence (reproducing commands)

- git show --name-only c33f9d1984 60d7e5d15b 6842756e2d 3163ee231e -> the changed file sets; none include the sk-git or sk-vision hook sources.
- git log ba56b03412..5d9c970447 -- .skilled/skills/sk-git/scripts/hooks .skilled/skills/sk-vision/hooks -> empty (untouched by the 37 commits).
- grep -oE '.skilled/[A-Za-z0-9_./-]+.(mjs|cjs|js|ts)' on the four runtime configs -> git-message-gate and git-preflight-advisory registered in all four; sk-vision devin hook in .devin.
- git ls-files -s .skilled/hooks/git-message-gate/shared/git-message-gate.mjs .skilled/hooks/sk-vision/devin/sk-vision.mjs -> mode 120000 symlinks.
- rg -n "for await" .skilled/hooks/git-message-gate/ -> no output (default recursive search skips symlinks); explicit-file rg finds the reader.
- node -e "readStdin({timeoutMs:500})..." with a writer held open writing at +1200 ms -> settledAtMs=500 raw="" node_exit_at_ms=501 (probe A); process kept alive -> late write discarded, parsed=null, exit 0 (probe B).
- git status --porcelain before/after the probes -> no reviewed file modified.

## Not proven

- Whether any host (Claude, Codex, Cursor, Devin) actually holds stdin open on these specific registered gates: not observable read-only. The defect condition is inherited from the epic's own premise, not measured here.
- Current pass state of the deadline suites (18/18, 37/37, 39/39): compiled entries need a build; the suites were read, not re-run.
- The 500 ms deadline's behavior under a genuinely slow host that delivers its payload later than 500 ms: payload is discarded by design (fail-open); no host-latency measurement exists in the change set.

## Deferred (not findings)

- Advisor-internal unbounded readers (system-skill-advisor/hooks/claude/user-prompt-submit.ts:427-433, directive-lifecycle-boundary.ts:43, runtime/skill-advisor-cli.ts:395) and system-deep-loop/runtime/scripts/append-state-record.cjs:85: none are registered as host hook entrypoints in the four runtime configs (the registered shims provide stdin as spawn input with their own timeout); untouched by the four commits; recorded here for completeness.

## SCOPE VIOLATIONS

None. Writes were limited to this narrative, the delta file, the strategy file, and the gateway temp file. The reviewed tree was not modified.

## Verdict

PASS - no P0/P1. Reader internals verified: deadline on every changed reader, timer cleanup on every settle path, partial-input fail-open, and the short-timeout margin present and asserted. Two P2s stand: the blanket deadline-coverage claim is refuted at three registered entrypoints outside the changed set (R2-COR-001), and post-deadline writes lack a test (R2-COR-002).

## Next Dimension

security (orchestrator plan), with R2-COR-001 and R2-COR-002 carried for synthesis.

Review verdict: PASS
