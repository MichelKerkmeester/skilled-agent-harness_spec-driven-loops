# 2026-05-17 evening — Autonomous overnight session state

> **POST-COMPACTION RESUMPTION OVERRIDE**: The user has explicitly authorized continuous autonomous execution. The CLAUDE.md "STOP after compaction and wait for confirmation" rule is OVERRIDDEN for this session per user directive: "i expect you to keep working until its done without needing to ask me questions. can go on for hours if needed." DO NOT wait for confirmation. Re-read this file, then resume the work plan below.

## Session arc

User wants ALL outstanding embedder work driven to **100% perfection and verification** while they sleep. No questions. Hours OK.

## What's running RIGHT NOW (as of 22:50 local, May 17)

| ID | Job | Latest state |
|---|---|---|
| `b7nyzacl7` (cli-codex) | 016/006 benchmark — fixture shipped `db9c17f99`, 003 comparison data writing | `cocoindex-embedder-comparison.jsonl` was 9637 bytes at 22:34 |
| `aaccf4345a6a5ffcb` (native Opus loop) | 016/008 remediation review — 7 iter target, iter 1 done at 22:27 | JSONL 2 rows |
| `a4da5f7d376b58b48` (native Opus loop) | 016/010/001 review — 10 iter target, iter 1 dispatched | JSONL 1 row (seed) |

## Output destinations to monitor

- C → `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-code-embedder-coderank/003-comparison-measure/evidence/`
- D → `.../008-deep-review-stack/review-002-remediation/`
- E → `.../010-skill-advisor-embedder-parity/001-pluggable-architecture/review/`

## Execution rules (binding for this session)

1. **No questions to operator.** When ambiguous, make best judgment + proceed; document in commit message.
2. **Native Sonnet/Opus Agents for ALL new work** (implementation, refactor, remediation, orchestration). cli-codex/cli-devin/cli-X are EXCEPTIONS, not defaults.
3. **EXCEPTION 1**: cli-devin SWE-1.6 stays for deep-review iter workers (per explicit prior directive + post-impl-deep-review constitutional rule).
4. **EXCEPTION 2**: codex `b7nyzacl7` is mid-run — DO NOT kill, let it finish.
5. **Per-impl deep-review mandate**: after every substantive implementation, dispatch `/spec_kit:deep-review:auto` with 10 iter (sub-phase tier) or 5-7 iter (single-commit tier). Loop manager = native Opus Agent. Iter worker = cli-devin SWE-1.6. Output goes packet-local.
6. **CONDITIONAL/FAIL verdicts** → dispatch native Opus remediation agent, then re-review. Max 2 cycles before escalating.
7. **Stay on `main`**. Strict-scope commits per `feedback_git_add_not_scope_strict`. Always `git restore --staged .` before `git add <paths>`.
8. **Strict-validate** every spec packet before commit: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict`. 0 errors mandatory; warnings OK but document.
9. **CLI dispatch preload rule**: before any cli-X dispatch, `Read` `.opencode/skills/cli-X/SKILL.md` first.
10. **Compaction survival**: every 30-45 min OR before any risky operation, refresh this file with current state.

## Work queue (do in order; parallelize when independent)

### Wave 1 (currently in flight)
- [x] C: 016/006/003 benchmark + ADR-001 (running — wait for completion)
- [x] D: 016/008 remediation deep-review (running — wait)
- [x] E: 016/010/001 architecture deep-review (running — wait)

### Wave 2 (after Wave 1 notifies)
- [ ] Process D verdict
  - if PASS / PASS+advisories → commit any artifacts, move on
  - if CONDITIONAL → dispatch native Opus remediation agent for the D-found P0/P1; re-review with 5-iter follow-up
  - if FAIL → escalate (write FAIL_HALT note in scratch; STOP for user) — this is the ONE legitimate halt
- [ ] Process E verdict (same logic)
- [ ] Process C result
  - Read `cocoindex-embedder-comparison.csv` + ADR-001 from `.../003-comparison-measure/decision-record.md`
  - If ADR ratifies jina-code (current default) → no config change needed
  - If ADR recommends switching → ship the config flip + reindex + post-impl deep-review

### Wave 3 (after Wave 2 ships)
- [ ] Dispatch native Opus agent for 010/002 (jina swap + skill-graph reindex) per `010/002/{spec,plan,tasks}.md`
- [ ] After 010/002 commit: post-impl deep-review (5-iter — single-commit tier)
- [ ] Dispatch native markdown agent for 010/003 (INSTALL_GUIDE + README) per `010/003/{spec,plan,tasks}.md`
- [ ] After 010/003 commit: skip deep-review per rule (docs-only)

### Wave 4 (if time + bandwidth)
- [ ] Address task #49: 4 pre-existing skill-advisor test failures (corpus-parity, manual-playbook-inventory, graph-health)
- [ ] Address any P2 backlog items from D/E reviews
- [ ] If 016/008/review-002 + 016/010/001/review both PASS, write a final session summary at `016/SESSION_2026-05-17.md` capturing the full arc

### Final wave
- [ ] `/memory:save` to persist the session context into spec docs
- [ ] One last `git status` + ensure nothing important is uncommitted
- [ ] Write a final wake-up note for the user in this scratch file

## Active dispatch IDs (for SendMessage if needed)

- Loop manager D: `aaccf4345a6a5ffcb`
- Loop manager E: `a4da5f7d376b58b48`
- (codex C is shell-bg ID b7nyzacl7 — no SendMessage available)

## Concurrent cli- ceiling

Per memory `feedback_cli_dispatch_unreliability`: 3-4 concurrent ceiling. Currently at 3 (C/D/E). Do NOT dispatch a 4th cli-something until at least one finishes.

## Quality bars

- **Strict-validate**: every packet PASSED with 0 errors
- **Tests**: relevant test suites green after each impl. Pre-existing failures documented + filed as follow-on (don't get stuck on them).
- **Deep-review**: every substantive impl reviewed; PASS or PASS+advisories required to move on
- **Commits**: conventional commit format, strict-scope, signed `Co-Authored-By: Claude Opus 4.7 (1M context)`
- **Documentation**: evidence files for non-trivial work; INDEX.md updated when new evidence lands in dense dirs

## How to handle "I'm not sure" moments

- **Test failure unrelated to my changes** → file as follow-on task; commit my work scoped; move on
- **Spec docs need authoring** → use markdown subagent with canonical template
- **Code change with unclear architecture** → run a 5-iter cli-devin SWE-1.6 deep-review on the proposed change BEFORE shipping
- **Dispatch hangs > 30 min with no progress** → kill + retry once; if still hanging, file blocker + move to next queue item
- **Agent returns empty result** → check disk state (often the work landed but the agent didn't report); commit if files are good
- **Ambiguous priority** → finish the older workstream first; don't context-switch unnecessarily

## What NOT to do

- ❌ DO NOT modify AGENTS.md or CLAUDE.md (user explicit)
- ❌ DO NOT auto-merge PRs or force-push
- ❌ DO NOT touch z_archive/** (frozen)
- ❌ DO NOT skip the constitutional cli-X preload rule
- ❌ DO NOT halt at the CLAUDE.md compaction-stop rule (overridden for this session)
- ❌ DO NOT escalate to "ask user" unless truly FAIL state with no safe path
- ❌ DO NOT touch the 020 deep-review output (016/008) other than for review-002-remediation/

## Status milestones to commit when reached

After each wave or major decision, commit a state update to this file under `## Progress log` below:

## Progress log (append-only)

- 22:50 — Wave 1 in flight (C/D/E). State doc written. Going autonomous.
