# Iteration 2 - Opus 4.8 (high) cross-check - mk-deep-loop-guard

> **Executor:** Claude Opus 4.8 (`claude-opus-4-8 --effort high`, plan mode) via cli-claude-code through account2, read-only, 2026-07-10.
> **Purpose:** independently verify iteration-1 (GPT-5.6-Sol-Fast) findings and surface issues the first pass missed.

## Net assessment

8 of 9 prior findings hold against the real code; I refuted none outright but adjusted three: F3 (documented+tested intentional fail-open, not a P1 error), F2 (origin-check is a documented design limit — the real defect is prompt-improver being mis-placed in the loop-executor set), and downgraded F5/F7 to P2. F1 (multiplexed deep-improvement agent overwrite) and F8 (case-insensitive capture vs case-sensitive compare) are the strongest confirmed defects. New: O1 — the same casing hazard on the AGENT token silently bypasses BOTH guards (false-negative twin of F8); plus O2 (loose first-'mode=' match), O3 (unverified OpenCode input shape could dead-open the guard), and O4 (leaked .tmp files never pruned).

**Prior findings adjudicated:** 9 - 7 confirmed, 2 adjusted. **New findings this pass:** 4.

**Parity (Opus view):** Parity is genuinely one-sided: the entire mode-mismatch + loop-repeat Task guard exists only in the OpenCode plugin; .claude/settings.json has no PreToolUse Task hook (only Bash), so Claude's orchestrate dispatches are unguarded despite sharing the same Deep Route / general-subagent conventions (F7). Even within OpenCode, O3 shows the guard's activation rests on unverified input-shape assumptions, so a Claude counterpart should be built on a shared, transport-agnostic parsing+policy core (registry resolution, thresholds, exemptions, casing normalization) with only the hook I/O adapted per runtime.

## 1. Verification of iteration-1 findings

| Prior ID | GPT sev | Opus verdict | Opus sev | Adjudication note |
|----------|---------|--------------|----------|-------------------|
| F1 | P1 | **confirmed** | P1 | Confirmed at mk-deep-loop-guard.js:81 (map.set(mode.agent, mode)). mode-registry.json maps agent 'deep-improvement' from THREE modes (agent-improvement:103, model-benchmark:129, skill-benchmark:152); last-writer-wins leaves registry.get('deep-improvement').workflowMode === 'skill-benchmark'. Check 1 (line 391) then false-mismatches any dispatch that declares mode=agent-improvement\|model-benchmark against target deep-improvement — a false warn always, and a false BLOCK under MK_DEEP_LOOP_GUARD_REJECT=1. Defeats the mismatch guard for 2 of 3 improvement modes. Fix (agent→Set of modes) is correct. |
| F2 | P1 | **adjusted** | P2 | Split verdict. Origin-check absence (line 400-402 counts by targetAgent+sessionID+marker only, no proof orchestrate originated it) is a DOCUMENTED design limit — header lines 346-355 state it cannot create hard runtime identity and fails open as a detection layer; loopRepeatDetail() (line 203-210) merely over-claims 'orchestrate' in wording. NOT a P1 bug. The real defect is narrower: 'prompt-improver' in LOOP_EXECUTOR_AGENTS (line 60) has NO /deep:* command and NO iteration loop in mode-registry.json, so legitimately repeated prompt-improver dispatches get flagged 'loop-like ... dispatched by their parent /deep:* command' — a message that is simply false for that agent. Downgrade to P2. |
| F3 | P1 | **adjusted** | refinement | Behavior confirmed but it is INTENTIONAL and TESTED, not a bug. Header lines 353-355 explicitly document fail-open on missing/unreadable registry or state; test lines 104-109 assert 'registry unreadable, mismatch present, reject mode on -- must not throw'. writeLoopStateAtomic swallows write errors (line 167-170) by design (line 169 comment). The legitimate residue is a DESIGN observation — 'reject' modes are not truly fail-closed, so they cannot be relied on as a hard gate — worth surfacing to the user as a policy choice, but calling it a P1/error mislabels documented, covered behavior. |
| F4 | P1 | **confirmed** | P2 | Confirmed. pruneStaleWarningLog (line 242-251) is invoked only from appendWarningLog (line 220) immediately before an append, and deletes the WHOLE file only when mtime is older than the 90-day archive window — so active use (which keeps mtime fresh) never rotates it. The session.created sweep (sweepStaleLoopGuardStates, line 304) filters entry.name.endsWith('.json') (line 322) and never touches guard-warnings.log. No size cap exists. Real unbounded-growth path under sustained warn conditions, but slow (~150 bytes/line, append-only) so P2, not P1. |
| F5 | P1 | **confirmed** | P2 | Confirmed at line 66. ITERATION_MARKER_REGEX matches the bare substring 'STATE SUMMARY' anywhere (case-insensitive) or any 'Iteration: N of M' line, with no validation of the state-summary envelope, target mode, or route source. Any orchestrate prompt incidentally containing 'state summary' sets commandDriven=true (line 401) and suppresses loop counting entirely — a false-negative bypass of Check 2. Impact is bounded: the guard is warn-only by default and fail-open, so a bypass only means a missing warning, not a crash or wrong block. Downgrade from P1 to P2/refinement. |
| F6 | P2 | **confirmed** | P2 | Confirmed as a real multi-process TOCTOU, but low-impact. The concurrency rationale (lines 294-299) is valid only intra-process; the state dir is shared across all OpenCode processes. sweepStaleLoopGuardStates does statSync (line 325) then renameSync (line 327): a session that resumes and writes state between another process's stat and rename can have its now-fresh file archived, resetting its loop counter (readLoopState reads stateDir, not .archive). Two concurrent sweeps can also race on the same rename (ENOENT, caught line 328). Net effect is weakened detection / counter reset in a narrow window, never a crash — P2 leaning refinement. |
| F7 | P1 | **confirmed** | P2 | Factually confirmed: .claude/settings.json PreToolUse has a single matcher 'Bash' (line 16); no 'Task' matcher exists, and the Stop hook (line 78) only runs session-stop.js + session-cleanup.sh. So the entire mode-mismatch + loop-repeat guard is OpenCode-only with zero Claude counterpart. This is a genuine parity GAP, but it is a missing-feature/enhancement, not a defect in shipped code — 'P1' overstates it; treat as P2 parity. A Claude PreToolUse Task hook reusing shared registry/threshold logic would close it. |
| F8 | P2 | **confirmed** | P2 | Confirmed. declaredModeFromPrompt (line 90) uses /mode=([a-z0-9-]+)/i and returns match[1] with original casing; line 391 compares !== against the lowercase registry workflowMode. prompt 'mode=Research' → 'Research' !== 'research' → false mismatch (false BLOCK under reject). Real internal inconsistency (case-insensitive capture, case-sensitive compare). Note: the same casing hazard exists in resolveTargetIdentity — see new finding O1. |
| F9 | refinement | **confirmed** | refinement | Confirmed test-coverage gap. writeFixtureRegistry (test line 24-36) gives each mode a unique agent, so the production multiplexed shape (3 modes → deep-improvement) is never exercised and the F1 bug is invisible to the suite. Tests also omit: warning-log unbounded growth/rotation (F4), the uppercase-mode false mismatch (F8), the uppercase-agent bypass (O1), and cross-process sweep behavior (F6). All are genuinely absent from mk-deep-loop-guard.test.cjs. |

## 2. New findings (missed by iteration 1)

| ID | Sev | Category | Location | Title | Conf |
|----|-----|----------|----------|-------|------|
| O1 | P2 | bug | `.opencode/plugins/mk-deep-loop-guard.js:122` | Uppercase target-agent name silently bypasses BOTH guards | high |
| O2 | P2 | bug | `.opencode/plugins/mk-deep-loop-guard.js:90` | declaredModeFromPrompt matches the FIRST 'mode=' token anywhere, not the target-intended mode | med |
| O3 | P2 | parity | `.opencode/plugins/mk-deep-loop-guard.js:377` | Runtime input-shape assumptions unverified; a field/value drift silently disables the whole guard | low |
| O4 | refinement | bug | `.opencode/plugins/mk-deep-loop-guard.js:163` | Orphaned atomic-write temp files are never pruned by the sweep | med |

### Detail

#### O1 - Uppercase target-agent name silently bypasses BOTH guards
- **Severity / Category / Confidence:** P2 / bug / high
- **Location:** `.opencode/plugins/mk-deep-loop-guard.js:122`
- **Evidence:** resolveTargetIdentity's regexes (target_agent=@?([a-z0-9-]+), Agent: @?([a-z0-9-]+)) use the /i flag but return match[1] with ORIGINAL casing (lines 124-128). The consumers are case-sensitive: registry.get(targetAgent) (line 388) is a Map keyed by lowercase agent names, and LOOP_EXECUTOR_AGENTS.has(targetAgent) (line 400) is a Set of lowercase names. A prompt 'target_agent=@Deep-Research' resolves 'Deep-Research', so registry.get() → undefined (Check 1 skipped) AND the Set membership → false (Check 2 skipped). Both guards silently no-op.
- **Impact:** Complete, silent bypass of mode-mismatch AND loop-repeat detection via a trivial casing variation in the agent token — the false-negative sibling of F8's false-positive.
- **Proposed fix:** Lowercase the resolved identity (and the declared mode) at the boundary, e.g. return match[1].toLowerCase() in resolveTargetIdentity and declaredModeFromPrompt.

#### O2 - declaredModeFromPrompt matches the FIRST 'mode=' token anywhere, not the target-intended mode
- **Severity / Category / Confidence:** P2 / bug / med
- **Location:** `.opencode/plugins/mk-deep-loop-guard.js:90`
- **Evidence:** /mode=([a-z0-9-]+)/i.exec(promptText) returns the first match in the entire prompt. In a Deep Route prompt it grabs the header's 'mode=' (fine when it matches), but any incidental later or unrelated 'mode=' token — e.g. 'Agent: @deep-research\nrun in mode=verbose' — is treated as the declared route mode. 'verbose' !== 'research' produces a false mismatch warn (false BLOCK under REJECT). The prompt-body substring match has the same looseness class as F5.
- **Impact:** False-positive mode-mismatch warnings/blocks triggered by benign 'mode=' text anywhere in the Task prompt.
- **Proposed fix:** Anchor extraction to the Deep Route header envelope (parse the 'Deep Route:' line specifically) or require a dedicated machine marker, rather than a free-floating substring.

#### O3 - Runtime input-shape assumptions unverified; a field/value drift silently disables the whole guard
- **Severity / Category / Confidence:** P2 / parity / low
- **Location:** `.opencode/plugins/mk-deep-loop-guard.js:377`
- **Evidence:** tool.execute.before gates on input.tool !== 'task' (line 377) and Check 2 requires input.sessionID (line 400). The event hook by contrast defensively reads input?.event?.type || input?.type (line 369), signaling real uncertainty about OpenCode's input shapes. If OpenCode names the tool 'Task' (capitalized) or exposes the session id as input.session.id, the hook no-ops entirely (Check 1+2) or loop detection dies — fail-open and invisible. No test asserts against a real OpenCode payload; the fixtures hand-craft {tool:'task', sessionID}.
- **Impact:** A single upstream naming drift would silently neutralize the guard with zero signal, mirroring the Claude parity gap (F7) from the OpenCode side.
- **Proposed fix:** Normalize tool name case-insensitively and probe multiple session-id field paths (input.sessionID ?? input.session?.id), and add a fixture mirroring a captured real OpenCode tool.execute.before payload.

#### O4 - Orphaned atomic-write temp files are never pruned by the sweep
- **Severity / Category / Confidence:** refinement / bug / med
- **Location:** `.opencode/plugins/mk-deep-loop-guard.js:163`
- **Evidence:** writeLoopStateAtomic creates `${finalPath}.${process.pid}.${Date.now()}.tmp` (line 163); on a crash between writeFileSync (165) and renameSync (166) the catch/unlink (168) does not run, leaving a `.tmp` file. sweepStaleLoopGuardStates only archives entries matching endsWith('.json') (line 322), and pruneLoopGuardArchive only scans .archive/. So a leaked .tmp is never swept, archived, or pruned.
- **Impact:** Slow, unbounded accumulation of orphaned temp files in .loop-guard-state under repeated abnormal termination; cosmetic/disk only.
- **Proposed fix:** Have the sweep also unlink stale `*.tmp` files older than the active-retention window.
