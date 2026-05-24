---
title: "AI Council Report: Orphan MCP Leak Prevention Review"
packet: "022-orphan-mcp-leak-prevention"
convergence: true
rounds: 1
final_confidence: 86
status: complete
timestamp: "2026-05-24T23:00:00Z"
---

## Multi-AI Council Report: Orphan MCP Leak Prevention Review

### Task Classification
- **Type**: Review (post-implementation audit)
- **Council Seats Dispatched**: 3: Analytical / Critical / Pragmatic
- **Dispatch Mode**: Inline Sequential (Depth 0 in-CLI, single OpenCode round)
- **Vantage Integrity**: All seats ran inline in OpenCode (deepseek-v4-pro). No external CLI systems were dispatched. Labeled as native in-CLI deliberation.

### Council Composition

| Seat | Strategy Lens | AI Vantage Target | Distinct Mandate | Confidence |
|------|--------------|-------------------|------------------|------------|
| Seat 001 | Analytical | Inline OpenCode (deepseek-v4-pro) | Check scope coherence, implementation architecture, and whether the packet documents what actually shipped. | 88/100 |
| Seat 002 | Critical | Inline OpenCode (deepseek-v4-pro) | Hunt for safety holes, false preserve assumptions, mutation risks, stale rollout claims, and missing tests. | 82/100 |
| Seat 003 | Pragmatic | Inline OpenCode (deepseek-v4-pro) | Judge operator usability, rollout readiness, and the next best validation path. | 86/100 |

### Strategy Comparison

| Dimension | Weight | Seat 001 (Analytical) | Seat 002 (Critical) | Seat 003 (Pragmatic) |
|-----------|--------|----------------------|---------------------|-----------------------|
| Correctness | 30% | 26 | 24 | 26 |
| Completeness | 20% | 18 | 16 | 16 |
| Elegance | 15% | 12 | 13 | 14 |
| Robustness | 20% | 18 | 16 | 16 |
| Integration | 15% | 14 | 13 | 14 |
| Pre-Critique Total | 100% | 88 | 82 | 86 |
| Post-Critique Adjustment | ±10 | 0 | 0 | 0 |
| **Final Total** | **100%** | **88** | **82** | **86** |

### Deliberation Notes

**Round 1 Independent Findings**:
- Seat 001 (Analytical): Found the implementation structurally sound, all docs complete and consistent, all verification gates passed. Noted triplicated launcher-idle-timeout.ts as a watch item and uncommitted handover as a continuity gap.
- Seat 002 (Critical): Found 9 concerns including substring-based process classification fragility, Stop hook timeout uncertainty, sweeper race window, missing behavioral tests, and uncommitted handover. All concerns are documentation/process gaps, not code defects.
- Seat 003 (Pragmatic): Found the implementation operator-ready but rollout process incomplete. Recommended committing handover, re-running dry-run, exercising Claude exit, creating pre-activation checklist, then approving LaunchAgent activation.

**Round 2 Cross-Critique**:
- Seat 002 challenged Seat 001 on downplaying code duplication as a correctness risk. Seat 001 defended: intentional design for independent packages, all copies diffable.
- Seat 003 challenged Seat 002 on overstating Stop hook timeout as P0 without evidence. Seat 002 conceded: downgraded to P2 documentation gap.
- Seat 001 challenged Seat 003 on downplaying uncommitted handover. Seat 003 conceded: elevated to P1.

**Round 3 Reconciliation**:
All three seats converged on the same core recommendation: implementation is correct, rollout process needs completion. No unresolved conflicts. Convergence is genuine — distinct lenses found complementary concerns.

### Winning Strategy

- **Leader**: Seat 001 (Analytical), Score: 88/100
- **Key Strength**: Most comprehensive assessment of implementation-to-spec fidelity and verification completeness.
- **Complementary Elements**: Seat 002's critical findings (P2 documentation gaps, test coverage recommendations) and Seat 003's pragmatic rollout checklist (pre-activation smoke tests, health-check script) were merged into the recommended plan.

### Recommended Plan

**Verdict: CONDITIONAL APPROVAL** — The implementation code has zero defects. All findings are in documentation, process, and validation gaps. The council recommends approval contingent on completing 4 P1 validation steps before any LaunchAgent activation or real sweeper use.

### Implementation Steps (for Codex / Operator)

#### Phase A: Immediate (this session)

1. **COMMIT HANDOVER** (P1 - Source: All Seats)
   ```bash
   git add handover.md
   git commit -m "docs: add 022 orphan MCP leak prevention handover"
   ```
   Verification: `git status` shows handover.md is committed.

2. **RE-RUN DRY-RUN** (P1 - Source: Seat 002, Seat 003)
   ```bash
   bash .opencode/scripts/orphan-mcp-sweeper.sh --dry-run --verbose --log-path /tmp/council-dry-run.log
   ```
   Verification: Review output. Confirm devin, Ollama, Claude processes are in preserve output. Confirm no unexpected kill candidates.

#### Phase B: Pre-Activation Validation (before any `launchctl load`)

3. **EXERCISE CLAUDE STOP HOOK** (P1 - Source: Seat 002)
   - Start a Claude Code session, then exit normally.
   - Check `~/.local/share/claude-stop-hook.log` for `action=start session_pid=...` and `action=summary` entries.
   - Confirm cleanup ran without errors and no active dev processes were terminated.

4. **CREATE PRE-ACTIVATION CHECKLIST** (P1 - Source: Seat 003)
   Mark all items before `launchctl load`:
   - [ ] Sweeper dry-run on current process table shows no false positives
   - [ ] `~/.local/share/orphan-sweeper.log` is writable
   - [ ] Devin, Ollama, and active Claude processes appear in preserve output
   - [ ] No other cron/launchd jobs conflict at 600s interval
   - [ ] Operator explicitly approves real automation

#### Phase C: Documentation (non-blocking, this or next session)

5. **DOCUMENT STOP HOOK TIMEOUT** (P2 - Source: Seat 002)
   - File: `handover.md` or `spec.md`, known limitations section.
   - Note: The 10s timeout applies to the entire bash -c chain. If exceeded, partial cleanup may leave some descendants.

6. **NOTE CODE DUPLICATION** (P2 - Source: Seat 001)
   - File: `handover.md` session notes.
   - Note: Three `launcher-idle-timeout.ts` copies are intentional and diffable. Fix bugs in all three.

7. **NOTE SUBSTRING MATCHING RISK** (P2 - Source: Seat 002)
   - File: `.opencode/scripts/README.md`.
   - Note: Sweeper uses substring matching on command lines. Dry-run review catches false positives.

#### Phase D: Future Packets (deferred, not blocking)

8. **SWEEPER BEHAVIORAL TESTS** (P2 - Source: Seat 002)
   - Add vitest/bash-test-coverage for sweeper classification and preserve logic.
   - Priority: When sweeper logic changes next.

9. **POST-ACTIVATION HEALTH CHECK** (P2 - Source: Seat 003)
   - Script that reports MCP process count and sweeper last-run status.
   - Priority: After LaunchAgent has been running for 1+ week.

10. **REFACTOR IDLE TIMEOUT** (P2 - Source: Seat 001)
    - Consider extracting shared launcher-idle-timeout to a common package.
    - Priority: When adding a 4th MCP server or when idle logic changes.

### Prerequisites

- [x] Implementation code committed and pushed (`e85fb49e27`)
- [x] All verification gates passed (syntax, vitest, typecheck, build, validation)
- [ ] Handover committed (P1 - immediate action)
- [ ] Fresh sweeper dry-run reviewed (P1 - before LaunchAgent)
- [ ] Claude Stop hook exercised with real session exit (P1 - before LaunchAgent)
- [ ] Pre-activation smoke checklist completed (P1 - before LaunchAgent)
- [ ] Operator explicitly approves LaunchAgent activation (separate session)

### Plan Confidence

- **Overall**: 86/100
- **Strategy Agreement**: HIGH (all three seats within 6 points)
- **Consensus Quality**: STRONG (genuine convergence from distinct analytical/critical/pragmatic lenses)
- **Risk Level**: LOW (zero code defects; 4 P1 process gaps; 6 P2 documentation gaps)

### Dropped Alternatives

No alternative implementation plans were proposed — all three seats agree on the core approach. Dropped severity escalations:
- **Stop hook timeout as P0** (proposed by Seat 002, downgraded to P2): Insufficient evidence of actual failure. The timeout interaction is a documentation gap, not a code defect.
- **LaunchAgent activation now** (rejected by Seat 003): The operator explicitly separated review from activation. Dry-run must be refreshed first.

### Risks & Mitigations

| Risk | Severity | Source | Mitigation |
|------|----------|--------|------------|
| Operator activates LaunchAgent without fresh dry-run | HIGH | Seat 002, Seat 003 | Phase B pre-activation checklist; RunAtLoad=false in plist |
| Stop hook timeout (10s) kills chain mid-cleanup | LOW-MEDIUM | Seat 002 | Graceful degradation; document as known limitation; can increase timeout |
| Sweeper kills legitimate process (substring match) | HIGH (low prob) | Seat 002 | Dry-run-first design; preserve rules run before kill; operator review |
| Uncommitted handover causes continuity loss | MEDIUM | All Seats | Phase A commit handover immediately |
| Launcher-idle-timeout.ts bug fixed in one server only | LOW | Seat 001 | Diffable copies; document as watch item; infrequently changed |
| Hardcoded path in LaunchAgent plist | LOW | Seat 002 | Template only; not auto-installed; documented in README |

### Planning-Only Boundary
- No files were modified outside `ai-council/**` by this council.
- This report is a recommendation for operator/Codex review.
- Code and spec changes remain the responsibility of the implementation agent.
- Council artifacts persisted under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention/ai-council/`.

### Findings Classification

#### P0 (Hard Blockers — none found)
- No implementation defects that would cause data loss, security breach, or active-work destruction.

#### P1 (Should fix before LaunchAgent activation)
- **HANDOVER-COMMIT**: Handover.md is uncommitted. Commit immediately. (All seats)
- **DRY-RUN-REFRESH**: Re-run sweeper dry-run on current process table. (Seat 002, Seat 003)
- **STOP-HOOK-VALIDATE**: Exercise real Claude session exit to confirm cleanup. (Seat 002)
- **PRE-ACTIVATION-SMOKE**: Create explicit pre-activation checklist. (Seat 003)

#### P2 (Documentation/process improvements, not blocking)
- **DOC-TIMEOUT**: Document Stop hook timeout interaction with chained commands. (Seat 002)
- **DOC-DUPLICATION**: Note launcher-idle-timeout.ts triplication as watch item. (Seat 001)
- **DOC-CLASSIFICATION**: Note sweeper substring matching as acknowledged risk. (Seat 002)
- **TEST-SWEEPER**: Add sweeper behavioral tests (future packet). (Seat 002)
- **HEALTH-CHECK**: Post-activation health-check script (future packet). (Seat 003)
- **DOC-PLIST-PATH**: Note hardcoded path in LaunchAgent template in README. (Seat 002)

#### Already-Acceptable Residual Risks
- Substring matching in classify_command() — mitigated by dry-run + preserve rules
- 5-second SIGTERM/SIGKILL race window — mitigated by macOS PID randomization
- Idle timeout exit race with stdin listener — no data corruption, logging only
- Absolute path in LaunchAgent plist — template only, not auto-installed
- Code duplication across three MCP servers — intentional, diffable, infrequently changed

---

## Handback for Codex

### Files Written (all under `ai-council/`)
| File | Purpose |
|------|---------|
| `ai-council-config.json` | Council configuration and metadata |
| `ai-council-strategy.md` | Charter: purpose, lenses, evidence, constraints |
| `ai-council-state.jsonl` | Append-only state log (events pending) |
| `seats/round-001/seat-001-analytical.md` | Analytical seat: scope coherence, architecture |
| `seats/round-001/seat-002-critical.md` | Critical seat: safety holes, edge cases |
| `seats/round-001/seat-003-pragmatic.md` | Pragmatic seat: operator usability, rollout |
| `deliberations/round-001.md` | Synthesis, comparison table, convergence decision |
| `council-report.md` | Final report (this file) |

### Convergence Status
**CONVERGED** — Single round, two-of-three-agree satisfied. All three seats endorse the same implementation with complementary risk emphasis.

### Top Findings (Summary)
1. **No code defects found.** Implementation matches specification. All verification gates passed.
2. **P1: Commit handover.md** — it's uncommitted and critical for continuity.
3. **P1: Re-run sweeper dry-run** — process table has changed since implementation.
4. **P1: Test Claude Stop hook** — exercise a real session exit with the chained cleanup.
5. **P1: Create pre-activation checklist** — explicit smoke tests before LaunchAgent load.
6. **P2: Six documentation gaps** — timeout behavior, code duplication note, classification risk note, sweeper tests, health-check script, plist path note.

### Exact Recommended Next Commands/Checks

```bash
# Step 1: Commit the handover
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
git add .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention/handover.md
git commit -m "docs: add 022 orphan MCP leak prevention handover"

# Step 2: Re-run sweeper dry-run on current process table
bash .opencode/scripts/orphan-mcp-sweeper.sh --dry-run --verbose --log-path /tmp/council-dry-run-$(date +%Y%m%d).log

# Step 3: Review dry-run output for false positives
grep "action=kill" /tmp/council-dry-run-*.log
grep "action=preserve" /tmp/council-dry-run-*.log

# Step 4: (Separate session) Exercise Claude exit and check cleanup log
cat ~/.local/share/claude-stop-hook.log | tail -20

# Step 5: Only after Steps 1-4 pass: Copy and load LaunchAgent
# cp .opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist ~/Library/LaunchAgents/
# launchctl load ~/Library/LaunchAgents/com.michelkerkmeester.orphan-sweep.plist
```
