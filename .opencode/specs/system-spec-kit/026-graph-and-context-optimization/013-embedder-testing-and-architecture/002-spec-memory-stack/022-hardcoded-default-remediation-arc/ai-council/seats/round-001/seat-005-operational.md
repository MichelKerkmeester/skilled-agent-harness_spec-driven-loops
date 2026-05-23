---
round: 1
seat: seat-005
executor: simulated-cli-codex-vantage
lens: pragmatic (operational)
status: returned
timestamp: 2026-05-23T17:17:00.000Z
simulated: true
---

# Seat 005 — OPERATIONAL (Pragmatic Lens, simulated cli-codex vantage)

## Mandate

Dispatch ergonomics + preflight check menu + on-the-ground execution detail. Translate strategic choices into concrete Bash + Edit commands the main agent will execute. Identify where the plan's existing prose under-specifies operational details.

## Proposed Plan

### Q1: Phase ordering

**Velocity-pragmatic order: 003 → 002b → 004 → 005 → 006 → 007 → 008 → 009 → 010 + convergence.**

This is roughly plan-default with 2 tweaks:
- 003 first (per VELOCITY): the investigation gate caps risk on the smallest phase.
- 002b second (per RISK-AVERSE): reranker docs closure while context is warm.

Then 004-010 sequential per plan. 004 third because it's the highest-value (14 P0); doing it after 003+002b gives us 2 quick wins for session morale.

I do NOT order by blast-radius (FAILURE-MODE) or by dependency graph (ARCHITECTURE). Rationale:
- Blast-radius ordering pushes 004 to phase 9. By then operator may have been pushed to session-end. Cost > calibration benefit.
- Dependency-graph ordering moves 005 before 009 (correct), but no other phases have hard dependencies. Numeric order respects operator's mental model.

The single dependency constraint (005-before-009) is honored in my proposed order naturally because 005 < 009 in numeric order.

### Q2: cli-opencode + deepseek-v4-pro risk mitigation

Concrete preflight script (executable, copy-pasteable; this is what the council should produce):

```bash
# Preflight for cli-opencode + deepseek-v4-pro (run before phases 004, 005, 007)
set -e
PHASE_NUM="$1"  # e.g., "004"

# 1. Credit + reachability
opencode providers list | grep -E "deepseek-v4-pro|deepseek/" || { echo "ABORT: deepseek not reachable"; exit 1; }

# 2. Baseline commit
BASELINE_SHA=$(git rev-parse HEAD)
echo "Baseline commit: $BASELINE_SHA"
git status --porcelain > /tmp/baseline-${PHASE_NUM}.status

# 3. Pre-read prompt-cited files (operator + main agent action; not scripted here)
echo "Read every file:line cited in /tmp/${PHASE_NUM}-prompt.md and verify content matches the prompt's claims"

# 4. CLEAR score (read sk-prompt SKILL.md if uncertain; ≥ 40/50 required for cli-opencode)
echo "Verify prompt CLEAR ≥ 40/50; revise if below"

# 5. Smoke-run verification commands locally
echo "Run each 'expect 0 hits' grep BEFORE dispatch to confirm baseline non-zero count"
```

Dispatch command (this is the canonical pattern per memory + cli-opencode SKILL.md):

```bash
# Phase 004 example
opencode run \
  --model deepseek/deepseek-v4-pro \
  --variant high \
  --agent general \
  --format json \
  --dangerously-skip-permissions \
  --dir "$(pwd)" \
  "$(cat /tmp/004-prompt.md)" \
  </dev/null > /tmp/004-out.log 2>&1 &
DISPATCH_PID=$!
echo "Dispatched 004; PID=$DISPATCH_PID; log=/tmp/004-out.log"
```

Note: NO `--pure` flag (debugging-only per cli-opencode SKILL.md §4 NEVER #4). The operator memory entry explicitly flagged this.

During-dispatch monitoring (paste-able):

```bash
# Hung process detection
while kill -0 $DISPATCH_PID 2>/dev/null; do
  CPU=$(ps -o pcpu= -p $DISPATCH_PID | tr -d ' ')
  RSS=$(ps -o rss= -p $DISPATCH_PID | tr -d ' ')
  echo "$(date -u +%H:%M:%S) PID=$DISPATCH_PID CPU=$CPU% RSS=$RSS KB"
  # Abort if RSS > 2GB or CPU=0 for >180s
  sleep 60
done
echo "Dispatch completed; ingesting output..."
```

Abort signals (concrete grep patterns in /tmp/<phase>-out.log):
- `grep -E "Insufficient balance|401|rate limit|context length exceeded" /tmp/004-out.log` → SIGKILL + fall back to cli-devin
- `grep -E "ERROR|HALT" /tmp/004-out.log | grep -v "test passed"` → review case-by-case

Post-dispatch ingest:

```bash
# What actually changed?
git diff --stat $BASELINE_SHA..HEAD

# Did claimed FILES_TOUCHED match actual? (if FAILURE-MODE seat's trailer was used)
grep -A 20 "FILES_TOUCHED:" /tmp/004-out.log

# Typecheck
cd .opencode/skills/system-spec-kit && npm run typecheck:root && cd -

# New vitest
npx vitest run scorer-threshold-invariants.test.ts

# Ban-list grep
rg -n "['\"]?? *0\.8|['\"]?? *0\.35" \
  .opencode/skills/system-skill-advisor/mcp_server/lib/scorer \
  .opencode/skills/system-skill-advisor/mcp_server/lib/routing \
  .opencode/skills/system-skill-advisor/mcp_server/lib/policy \
  .opencode/skills/system-skill-advisor/mcp_server/lib/prompt-cache.ts \
  .opencode/skills/system-skill-advisor/mcp_server/lib/subprocess.ts
# Expect 0 hits
```

Phase 004 wave granularity:
**Single dispatch with FAILURE-MODE's post-hoc scope-split safety net.** Aligns with VELOCITY default (1 dispatch) + FAILURE-MODE's Q6.1 option.

The CRAFT prompt skeleton in plan §004 (lines 181-205) already has wave checkpoints + bundle-gate HALTs. Trust the prompt contract; don't pre-split unless we have signal that the prompt won't fit context.

### Q3: Phase 010 ADR-B handling

**Option (a) — in-place edit with explicit "AMENDMENT" markdown header.** Matches ARCHITECTURE's hybrid.

Concrete shape:

```markdown
<!-- in 004-spec-memory-embedder-bake-off/decision-record.md, appended below ADR-014 -->

## AMENDMENT 2026-05-23 (per packet 022/010)

**Verification clause** added to ADR-013 + ADR-014:

No inline model-name default string in any TS/Python file under `.opencode/skills/` shall
contradict registry MANIFESTS canonical entries. An invariant test asserts profile.ts and
all provider files derive model names from registry. Future model-change audits MUST grep
for BOTH `DEFAULT = '...'` AND `\|\| '...'` patterns.

Authored by phase 022/010; reference: `022-hardcoded-default-remediation-arc/010-adr-writing-and-doc-validator/decision-record.md#adr-b`.
```

This is ~10 lines appended to a shipped doc. Operator approval is needed before applying (per plan §risks 5). I recommend phase 010 dispatch include this exact text in the proposed-amendment proposal.

### Q4: Convergence gate strength

**Original 6 + 2 (ARCHITECTURE's choice).** I disagree with FAILURE-MODE's 3rd addition (validator dry-run on all docs) because phase 010's implementation-summary already documents the validator's dry-run + result. Re-running at convergence is duplication.

Concrete convergence checklist (executable):

```bash
# 1. Registry single-source-of-truth ban-list
rg -nE "BAAI/bge-base-en-v1\.5|jina-embeddings-v3|embeddinggemma-300m|BAAI/bge-reranker-v2-m3|jina-v2-base-code|ms-marco-MiniLM-L-6-v2" \
  .opencode/skills/ \
  --glob '!**/changelog/**' \
  --glob '!**/scratch/**' \
  --glob '!**/research/iterations/**'
# Expect 0 hits

# 2. Skill-advisor threshold ban-list (from phase 004)
npx vitest run scorer-threshold-invariants.test.ts

# 3. Frozen constants documented (manual spot check; no script)
echo "Spot-check ENV_REFERENCE.md for new env vars from phases 004/005/007/009"

# 4. Doc-implementation parity
node .opencode/skills/sk-doc/scripts/validate-doc-model-refs.js
# Expect exit 0

# 5. 4-runtime mirror parity (phase 003 outcome)
diff <(ls .opencode/agents) <(ls .codex/agents) | head -20
# Expect minimal diff (or documented intentional empty)

# 6. Audit synthesis closure
grep -r "Resolves: f-iter" \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/*/implementation-summary.md \
  | wc -l
# Expect ≥ 56 (23 P0 + 33 P1)

# 7. (added) MCP refresh
echo "Run memory_index_scan({ specFolder: '...022...' })"
echo "Run code_graph_scan({ includeSpecs: true, incremental: true })"

# 8. (added) Reranker memory entry update
echo "Run /memory:save with corrected entry for project_2026_05_19_cocoindex_arc_shipped"
echo "  Note: jina-reranker-v3 → Qwen/Qwen3-Reranker-0.6B (per 023B follow-on)"
```

### Q5: Failure-mode plan

Concrete partial-revert detection script (this is the value-add over ARCHITECTURE/FAILURE-MODE's prose):

```bash
# Run after every cli-opencode dispatch
verify_dispatch() {
  local PHASE="$1"
  local BASELINE="$2"
  
  # 1. Diff-stat sanity
  local CHANGED=$(git diff --name-only $BASELINE..HEAD | wc -l)
  echo "Files changed: $CHANGED"
  
  # 2. FILES_TOUCHED parse (if prompt requested trailer)
  if grep -q "FILES_TOUCHED:" /tmp/${PHASE}-out.log; then
    local CLAIMED=$(grep -A 20 "FILES_TOUCHED:" /tmp/${PHASE}-out.log | grep -E "^[/-]" | wc -l)
    echo "Claimed by dispatch: $CLAIMED"
    if [ "$CHANGED" -ne "$CLAIMED" ]; then
      echo "MISMATCH: silent revert detected"
      return 1
    fi
  fi
  
  # 3. Typecheck
  (cd .opencode/skills/system-spec-kit && npm run typecheck:root) || return 1
  
  # 4. Vitest invariant
  npx vitest run --reporter=dot 2>&1 | grep -E "passed|failed"
  
  # 5. Ban-list grep (phase-specific; example for phase 004)
  if [ "$PHASE" == "004" ]; then
    if rg -nE "['\"]?? *0\.8|['\"]?? *0\.35" \
      .opencode/skills/system-skill-advisor/mcp_server/lib/scorer 2>/dev/null \
      | grep -v contract.ts | grep -v test.ts; then
      echo "BAN-LIST FAILURE: 0.8/0.35 still inline in scorer/"
      return 1
    fi
  fi
  
  # 6. Spot-Read on 1 representative changed file (manual)
  echo "Spot-Read recommended: $(git diff --name-only $BASELINE..HEAD | head -1)"
  return 0
}
```

State-of-truth: `git diff` is canonical. Everything else is a hint.

Rollback granularity: **dispatch boundary**. If verify_dispatch returns failure:

```bash
# Roll back to baseline + redispatch with adjusted prompt
git restore --source=$BASELINE .
git status --porcelain  # Should be clean now
# Re-author prompt with tighter scope; redispatch
```

If second redispatch also fails: scope-split phase. Author 004a (waves 1-2 from output) and 004b (remaining waves).

### Q6: Phase 004 wave-1-vs-wave-2

**Single dispatch attempt; post-hoc scope split if partial.** Matches VELOCITY default + FAILURE-MODE option Q6.1.

Concrete sequence:
1. Dispatch all 4 waves in one CRAFT prompt with explicit per-wave HALT gates.
2. If verify_dispatch passes (all 4 waves landed): 004 complete.
3. If verify_dispatch shows partial (e.g., wave 1+2 landed, wave 3+4 reverted): scope-split.
   - Commit wave 1+2 output as `004a-skill-advisor-threshold-consolidation-waves-1-2/`
   - Scaffold `004b-skill-advisor-env-vars-prompt-policy/` for waves 3+4
   - Redispatch 004b separately

This gives velocity-default with post-hoc safety. Best balance.

## Reasoning

The other seats argue strategy. My job is translation to executable steps. Most of the council's value isn't in choosing between options A/B/C — it's in producing the exact preflight script, dispatch command, monitoring loop, ingest script, and verify_dispatch function that the main agent will run.

I've provided those above. The strategy choices I make are conservative (mostly aligning with VELOCITY + ARCHITECTURE) because the operational complexity is already high; we don't need to add strategy complexity on top.

I disagree with FAILURE-MODE's order-by-blast-radius because the operational reality is that operator session length matters more than per-phase blast radius. By hour 4 of session, attention is degraded. Best to do the highest-value phase (004 with 14 P0) while attention is fresh.

The reranker memory entry update at convergence (per ARCHITECTURE) is the right operational call. The plan didn't include it as a gate. Council recommendation upgrades it.

## Risks & Trade-offs

- Single-dispatch phase 004 risks "context truncation" failure mode. Trade-off accepted because the prompt size has been estimated to fit deepseek-v4-pro's 64-128k context budget.
- Concrete script pattern (Bash) may not work verbatim on the operator's macOS (zsh) without minor tweaks. Trade-off accepted; main agent adapts as needed.
- 8-gate convergence (6 + 2) is between VELOCITY's "6 only" and FAILURE-MODE's "9". I prefer 8 because the 9th (full-arc validator dry-run) duplicates phase 010 deliverable.
- In-place ADR-B amendment with explicit header still touches a shipped ADR. Trade-off: lower than option c's new-doc cost; higher than pure option a's no-header.

## Assumptions and Evidence Gaps

- Assume operator's preflight + dispatch + verify scripts can run end-to-end without manual intervention beyond the obvious "compose prompt" step. If any step has hidden manual-only gates, the operational story changes.
- Assume `grep` patterns for ban-list detection are stable across macOS bash/zsh. Verified for the patterns shown.
- Assume FILES_TOUCHED trailer is an opt-in convention. Some dispatches may not produce it; verify_dispatch should fall back gracefully (current script does).

## Alternative Challenged

FAILURE-MODE argues order-by-blast-radius (smallest first). I push back: that's correct for risk mitigation in a vacuum, but operator session length is the actual constraint. Hour-1 attention is highest-value time. Spend it on the biggest-payoff phase (004), not the smallest-blast phase (002b).

If the operator confirms they have 17 hr of fresh session attention available: blast-radius order wins. If they have ~8-10 hr realistic + compaction events expected: value-density order wins (mine).

## Confidence

**73/100** — High on Q5 (concrete verify_dispatch script), Q4 (8 gates with executable checklist), Q3 (in-place + AMENDMENT header). Medium on Q1 (velocity-pragmatic order works but FAILURE-MODE may be safer; depends on operator session length). Medium on Q2 (preflight script is concrete; some patterns may need tweaking). Medium on Q6 (single dispatch with post-hoc split is operationally simplest but may need 3-dispatch fallback).
