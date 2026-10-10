# Review Iteration 001 — Correctness: hook stdin deadlines

## Dispatcher
- Mode: review; target agent: @deep-review; iteration 1 of 5; stop policy max-iterations; run rvw-012-006-remediation-20261010T211804Z.
- Assigned focus: commit 1d078f3356 (phase 012-post-merge-deep-review/001-hook-stdin-deadlines) inside the review range 1d078f3356..d1741a28f7.
- Agent definition loaded: .skilled/agents/deep-review.md.

## Files Reviewed
- .skilled/hooks/shared/hook-adapter-shared.cjs — shared readStdin, default deadline 3000 ms [SOURCE: .skilled/hooks/shared/hook-adapter-shared.cjs:20]
- .skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs — shared-reader import at line 40, call site at line 388 [SOURCE: .skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:388]
- .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs — import at line 34, call site at line 84 [SOURCE: .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:84]
- .skilled/skills/sk-git/scripts/hooks/stdin-deadline.test.mjs — new open-stdin suite [SOURCE: .skilled/skills/sk-git/scripts/hooks/stdin-deadline.test.mjs:47]
- .skilled/skills/sk-vision/hooks/devin/sk-vision.mjs — require at line 31, call site at line 63 [SOURCE: .skilled/skills/sk-vision/hooks/devin/sk-vision.mjs:63]
- .skilled/skills/sk-vision/hooks/devin/sk-vision-devin.test.mjs — new open-stdin case [SOURCE: .skilled/skills/sk-vision/hooks/devin/sk-vision-devin.test.mjs:56]
- specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/001-hook-stdin-deadlines/spec.md and implementation-summary.md — traceability spot-check (read-only).

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
None. Every assigned focus question resolved in the change's favour with executable evidence; the remaining caveats are recorded under Edge Cases and Ruled Out and none carries a failing case.

### Focus Evidence
- Deadline value and source: helper default is 3000 ms [SOURCE: .skilled/hooks/shared/hook-adapter-shared.cjs:20]; all three hooks call readStdin() with no options override [SOURCE: .skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:388] [SOURCE: .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:84] [SOURCE: .skilled/skills/sk-vision/hooks/devin/sk-vision.mjs:63]. The suite measured 3030.6 ms and 3030.1 ms (sk-git hooks) and 3029.4 ms (Devin), each resolving on the deadline.
- Timer cleanup: release() clears the timer and detaches data/end/error listeners on every settle path (EOF, error, deadline) [SOURCE: .skilled/hooks/shared/hook-adapter-shared.cjs:39]. EOF probe resolved in 3 ms with payload "{}" — no post-EOF 3 s linger.
- Partial and empty input: empty stdin parses to an exception in each hook and exits 0 fail-open (malformed/empty cases pass in both suites); a partial payload on a pipe held open exits 0 fail-open, and the deadline resolves exactly the bytes received because onEnd concatenates accumulated chunks [SOURCE: .skilled/hooks/shared/hook-adapter-shared.cjs:27].
- Normal-input equivalence: byte-identical stdout and exit codes current vs pre-fix for one sample payload per hook (message-gate "" + 0; preflight "" + 0; Devin {} + 0); git-preflight-advisory.test.mjs 7 pass / 0 fail.
- New suites on current tree: stdin-deadline.test.mjs 2 pass / 0 fail at ~3.03 s per case; sk-vision-devin.test.mjs 8 pass / 1 fail — the failing case is only the known unbuilt-dist check, a declared non-goal.
- Pre-fix replay: replaying commit^ via git archive into /tmp with the current test files gives sk-git 0 pass / 2 fail, both SIGKILLed at 6005 ms, and the Devin open-stdin case SIGKILLed at 6004 ms (plus the same known dist failure). This matches the commit's recorded pre-fix result (fail 2, killed at about 6000 ms).

## Traceability Checks
- spec_code: partial — phase 001 spec names the shared hook-helper deadline (3000 ms) and the implementation matches it [SOURCE: .skilled/hooks/shared/hook-adapter-shared.cjs:20]. Full checklist evidence is left to the traceability iteration.
- checklist_evidence: pending.
- overlay protocols (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability): pending; not required by the assigned correctness focus.

## Integration Evidence
- Surfaces inside the change: sk-git PreToolUse message gate (git-message-gate.mjs), sk-git PreToolUse preflight advisory (git-preflight-advisory.mjs), and the Devin UserPromptSubmit vision adapter (hooks/devin/sk-vision.mjs). No caller, command, workflow, or mirror beyond the two .hermes SKILL.md version lines in the commit stat was modified by this commit.
- Runtime consumers named by the hooks themselves: Claude/Codex "Bash", older Codex and Devin "exec", Cursor "Shell"; Devin registers the vision adapter through .devin/hooks.v1.json. Those contracts are unchanged by this commit.

## Edge Cases
- Method deviation: the dispatch-mandated copy-based pre-fix setup (mktemp plus symlinks plus git show redirect plus cp) was denied twice by the harness dispatch guard ("Pi dispatch denied: the command does not prove one direct executor"). The isolated replay was achieved with git archive <commit>^ piped into tar -x under /tmp plus the current test files; no repository file was modified.
- The partial-payload probe proves fail-open exit 0 but its hook-only elapsed time was not measured separately; the 3030 ms deadline timing is measured by the suite's empty-open-stdin cases, which share the same timer path.
- Known and excluded: the "resolves a built entry" case in sk-vision-devin.test.mjs fails here because vision-runtime/dist is gitignored and unbuilt; it fails identically on the pre-fix replay and is a declared non-goal.

## Confirmed-Clean Surfaces
- Shared readStdin: deadline, timer cleanup, listener detach, EOF and error settle paths [SOURCE: .skilled/hooks/shared/hook-adapter-shared.cjs:47].
- All three hook call sites use the shared reader with no timeout override.
- New tests fail against the pre-fix hooks and pass against the fix.
- Normal-input output and exit codes unchanged in sample comparisons and the preflight regression suite.

## Ruled Out
- Deadline/EOF double-settle race: the settled flag plus listener removal make a double resolve unreachable, confirmed by read [SOURCE: .skilled/hooks/shared/hook-adapter-shared.cjs:28] and by the 3 ms EOF probe.
- Silent truncation producing a false block: a truncated payload cannot parse into a deny, so a deadline cut resolves to fail-open approval (probe exit 0), consistent with the hooks' documented fail-open contract.
- Vacuous pre-fix pass from an ambient kill-switch: git-preflight-advisory.mjs checks isHookEnabled before readStdin (line 81 before line 84), so an environment with SYSTEM_HOOKS_DISABLED or SK_GIT_PREFLIGHT_DISABLED would exit the preflight case instantly and pass against a regressed hook; message-gate has no kill switch and the default-environment run fails pre-fix as required. Not recorded as a finding: at most P2 test robustness, with no proven real-environment case, and the hook is operator-disabled in that scenario.
- Devin adapter reads stdin before its own kill-switch (line 63 before line 68): pre-existing ordering, unchanged by this commit; worst case is the bounded 3 s wait while the adapter is disabled.
- spawn() error events without a handler in the new sk-git test helper: no observed path; noted only.

## Verdict
All six assigned focus questions passed with executable evidence; zero new findings (P0=0, P1=0, P2=0); new findings ratio 0.0.

## Next Focus
- Dimension: security (rotation from correctness).
- Focus area: remaining remediation commits e0b32e5e11..d1741a28f7 — sk-code-webflow minified-runtime callback-cap reporting, sk-code-opencode drift-guard summary counts, sk-code hub doc pointers, claim corrections and mirror-checker header, trigger-index rebuild.
- Reason: the assigned correctness focus for the deadline commit is now covered; the orchestrator rotates dimensions while the commit range remains.
- Rotation status: D1 correctness complete (PASS).
- Carry-forward: productive — git archive replay plus source-anchored timing proved the deadline and the pre-fix failures; blocked: none.
- Required evidence: per-file reads plus targeted command proof per commit; pre-fix replay wherever a fix records a pre-fix failure.
- Recovery note: if prose-only commits yield nothing, prefer the executable changes (sk-code-webflow/assets/scripts/test-minified-runtime.mjs, sk-code-opencode/scripts/run-all-drift-guards.sh) before doc-only surfaces.

Review verdict: PASS
