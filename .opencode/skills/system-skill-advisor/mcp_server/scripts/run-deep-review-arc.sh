#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# SCRIPT: run-deep-review-arc.sh
# ─────────────────────────────────────────────────────────────
# Minimal-viable driver for a 30-iter deep review across the 5 scopes
# of the 006-mcp-launcher-concurrency-arc phase parent. Uses cli-devin
# with SWE-1.6 as the per-iter executor.
#
# NON-CANONICAL: this driver handles init + iter loop + simple
# convergence + basic synthesis. It does NOT run the YAML reducer,
# dashboard, or composite-convergence math. Iter content (the actual
# review value) is identical to a canonical dispatch. The
# review-report.md is a simplified concatenation, not a full 9-section
# synthesis.
#
# Usage:
#   bash run-deep-review-arc.sh > /tmp/deep-review-arc.log 2>&1 &
# Or attended:
#   bash run-deep-review-arc.sh
#
# Total wall-clock: ~3-4 hours unattended.

set -euo pipefail

REPO_ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
ARC="${REPO_ROOT}/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency-arc"
DEVIN="$(command -v devin)"
GTIMEOUT="$(command -v gtimeout)"
LOG="/tmp/deep-review-arc-$(date -u +%Y%m%d-%H%M%S).log"

if [ -z "$DEVIN" ] || [ -z "$GTIMEOUT" ]; then
  echo "ERROR: devin or gtimeout not on PATH" >&2
  exit 1
fi

# ─── scope plan (allocated iters; redistributed below) ─────────
declare -a SCOPES=(
  "$ARC|4|phase-parent"
  "$ARC/001-concurrent-daemon-corruption-fix|8|001"
  "$ARC/002-cross-launcher-lease-propagation|8|002"
  "$ARC/003-launcher-race-and-error-surface-hardening|5|003"
  "$ARC/004-launcher-diagnostics-and-signal-coverage|5|004"
)

# ─── dimensions rotate per iter ────────────────────────────────
declare -a DIMENSIONS=(correctness security traceability maintainability)

# ─── helpers ────────────────────────────────────────────────────
ts() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }

# Render an iter prompt per the cli-devin SWE-1.6 5-block contract:
# (1) framework tag, (2) pre-planning, (3) scoped dimension,
# (4) sequential_thinking mandate, (5) output contract.
render_prompt() {
  local SCOPE_PATH="$1"
  local SCOPE_REL="${SCOPE_PATH#$REPO_ROOT/}"
  local ITER="$2"
  local TOTAL="$3"
  local DIM="$4"
  local PRIOR_PATH="$5"
  local SCOPE_TYPE="${6:-phase-child}"   # phase-parent | phase-child
  local PRIOR=""
  if [ -d "$PRIOR_PATH" ]; then
    local PRIOR_COUNT
    PRIOR_COUNT=$(ls "$PRIOR_PATH"/iteration-*.md 2>/dev/null | wc -l | tr -d '[:space:]')
    PRIOR_COUNT=${PRIOR_COUNT:-0}
    if [ "$PRIOR_COUNT" -gt 0 ]; then
      PRIOR="${PRIOR_COUNT} prior iteration files exist at \`${PRIOR_PATH}/\`; read them first and avoid duplicating findings."
    else
      PRIOR="No prior iterations in this packet."
    fi
  else
    PRIOR="No prior iterations in this packet."
  fi

  local ANCHORS
  local SCOPE_HEADER
  if [ "$SCOPE_TYPE" = "phase-parent" ]; then
    SCOPE_HEADER="**SCOPE TYPE: PHASE PARENT (lean trio).** Do NOT review individual phase children's code or heavy docs — they have their own dispatches. Focus on ARC-LEVEL invariants, cross-phase consistency, lean-trio doc quality, and arc changelog."
    ANCHORS="$(cat <<EOF
Anchor materials for a PHASE-PARENT review (read in order):
1. \`${SCOPE_PATH}/spec.md\` — root spec; what the arc as a whole shipped + which children own which slice
2. \`${SCOPE_PATH}/description.json\` — metadata, importance tier, derived state
3. \`${SCOPE_PATH}/graph-metadata.json\` — manual + derived fields, last_active_child_id, parent_id
4. \`${SCOPE_PATH}/changelog/\` — arc-level changelog (if present)
5. Each phase child spec.md ONLY (titles, REQs, status) for cross-phase consistency — do NOT walk the code under children:
   - \`${SCOPE_PATH}/001-concurrent-daemon-corruption-fix/spec.md\`
   - \`${SCOPE_PATH}/002-cross-launcher-lease-propagation/spec.md\`
   - \`${SCOPE_PATH}/003-launcher-race-and-error-surface-hardening/spec.md\`
   - \`${SCOPE_PATH}/004-launcher-diagnostics-and-signal-coverage/spec.md\`

What to look for at PHASE-PARENT level:
- Does the arc spec.md narrative match what each child claims to have shipped?
- Are cross-cutting invariants (single-writer lease, SQLite WAL, signal-handler parity) stated consistently in parent spec + the 4 children specs?
- Does \`graph-metadata.json\` carry the right \`status\` (lowercase), \`last_active_child_id\`, \`parent_id\`, and survive a save without getting stomped?
- Is \`description.json\` accurate (importance_tier, trigger_phrases)?
- Are children numbered consistently (001..004 with no gaps, no duplicates)?
- Are arc-level docs free of phase-specific narrative drift (per the rule that phase parents must not narrate consolidation history)?

EXPLICIT NON-GOALS for this dispatch:
- Do NOT open child code under \`mcp_server/\`, \`scripts/\`, \`tests/\` — each child has its own dispatch for that.
- Do NOT re-litigate individual REQs of any one child.
EOF
)"
  else
    SCOPE_HEADER="**SCOPE TYPE: PHASE CHILD.** This is one phase of the \`006-mcp-launcher-concurrency-arc\` arc. Focus on the REQs, code surface, and tests for THIS child only; cite cross-phase context only where it surfaces a real defect in THIS phase."
    ANCHORS="$(cat <<EOF
Anchor materials for a PHASE-CHILD review (read in order):
1. \`${SCOPE_PATH}/spec.md\` (always)
2. \`${SCOPE_PATH}/plan.md\` if present
3. \`${SCOPE_PATH}/implementation-summary.md\` if present
4. \`${SCOPE_PATH}/checklist.md\` if present
5. \`${SCOPE_PATH}/changelog/\` entries if present, OR the parent arc changelog at \`${ARC}/changelog/\`
6. Code surface mentioned in the spec \`§3 Files to Change\` table — open each and visually trace at least one for this dimension

The arc this child belongs to: \`${ARC}\`.
Sibling phases (for cross-phase context): 001, 002, 003, 004 under that arc.
EOF
)"
  fi

  cat <<PROMPT
Framework: RCAF

# Deep-Review Iteration ${ITER} of ${TOTAL} — Dimension: ${DIM}

## ROLE

You are a senior code+spec reviewer auditing a shipped packet. Read-only intent. SWE-1.6 default model. Output one iter file per the contract below.

## CONTEXT

Scope under review (absolute path): \`${SCOPE_PATH}\`
Repo root: \`${REPO_ROOT}\`
Scope relative path: \`${SCOPE_REL}\`

${SCOPE_HEADER}

This iter focuses on the **${DIM}** dimension. Previous iter coverage: ${PRIOR}

${ANCHORS}

## ACTION (medium-density pre-planning)

Execute these 4 ordered steps. Each has acceptance criteria. Stop and emit the iter file when all 4 are satisfied OR when a P0 finding is surfaced and verified.

**Step 1.** Read the anchor materials in the order listed above. Build a mental model of what this scope shipped (or, for the phase parent, what invariants hold across the arc).
- Acceptance: you can name (a) specific REQ IDs or invariants in scope, and (b) the file paths or doc paths you opened.
- Verification: cite at least 2 REQ IDs or invariants and 2 file paths in your iter output's Findings or Notes section.

**Step 2.** Focus on the **${DIM}** dimension. Find issues specific to this dimension:
- correctness: race windows, error-surface mishandling, edge cases the spec didn't list, behavior under adversarial inputs
- security: secret handling, injection surfaces, privilege boundaries, file-path traversal, signal-handling for cleanup
- traceability: spec→code→test alignment, REQs without test coverage, tests without REQ anchors, evidence trails for claimed verifications
- maintainability: code clarity, duplication, hard-coded constants, missing documentation, drift between docs and code
- Acceptance: at least one file in scope has been opened and visually traced.
- Verification: cite file:line for any finding.

**Step 3.** Classify each finding as P0 / P1 / P2:
- P0 = blocker; the shipped work has a correctness or security defect that must be fixed before further work proceeds.
- P1 = required; a real gap or correctness issue, but workable around or non-blocking for the immediate goal.
- P2 = suggestion; hygiene, style, future-proofing, or low-impact polish.
- Acceptance: every finding has a severity tag.
- Verification: severity tags appear inline in the Findings section.

**Step 4.** Decide a verdict for this iter based on the findings:
- FAIL if any P0
- CONDITIONAL if any P1, no P0
- PASS otherwise (P2-only or no findings)
- Acceptance: one verdict line is emitted, exact format required by the output contract.

Bundle-gate: standard. Do not over-constrain with strict wording; produce direct findings.

## SEQUENTIAL-THINKING MANDATE

Before producing the iter output you MUST call the sequential_thinking MCP tool with at least 5 thoughts covering:
1. Which anchor files you'll read and in what order.
2. What you discovered from reading them.
3. Findings extracted with severity classification.
4. Cross-reference against any prior iter findings (avoid duplicates).
5. Final verdict and the rationale.

The recipe's allowed_tools include \`mcp__sequential_thinking__*\`. The MCP server is globally registered via \`devin mcp add sequential_thinking\`.

## OUTPUT FORMAT

Emit a single markdown file with this exact structure:

\`\`\`markdown
# Iteration ${ITER} — ${DIM}

## Summary

<3–5 sentence overview of what you reviewed and what you found this iter.>

## Findings

### [P0] <one-line title>
- File: <path>:<line-range>
- Evidence: <quote or grep result>
- Impact: <what could break>
- Suggested fix: <concrete pointer>

### [P1] <one-line title>
...

### [P2] <one-line title>
...

(Omit severity sub-section if no findings of that severity.)

## Notes

<Any non-finding observations: dimension coverage status, areas not yet audited, cross-phase observations.>

Review verdict: <PASS|CONDITIONAL|FAIL>
\`\`\`

The verdict line MUST be the LAST line of the file. Exact format. No trailing whitespace.

## CONSTRAINTS

- Read-only intent. Do NOT modify any file in the scope being reviewed.
- Write ONLY to the iter file path provided via stdout capture by the dispatcher.
- Stop at the verdict line. Do not summarize further.
PROMPT
}

# Render the agent-config recipe per iter with placeholder substitution.
render_agent_config() {
  local SCOPE_PATH="$1"
  cat <<JSON
{
  "system_instructions": [
    "Before producing the output, you MUST call the sequential_thinking tool (mcp__sequential_thinking__sequentialthinking) with at least 5 thoughts covering: (1) pre-planning what evidence to read, (2) reading the evidence, (3) extracting findings with file:line citations, (4) cross-referencing prior iters, (5) composing the verdict. Only after these 5 thoughts complete do you emit the final iter output.",
    "You are a SWE-1.6 deep-review iteration worker.",
    "Stay read-only. Cite evidence with file:line.",
    "Produce findings tagged P0 / P1 / P2 with explicit reproduction evidence.",
    "Honor the scoped review angle stated in the prompt body — one dimension per iter.",
    "Stop conditions: emit findings then exit."
  ],
  "allowed_tools": ["Read", "Grep", "Glob", "Write"],
  "permissions": {
    "allow": [
      "Read(${REPO_ROOT}/**)",
      "mcp__sequential_thinking__*",
      "Write(${SCOPE_PATH}/review/iterations/iteration-*.md)"
    ]
  }
}
JSON
}

# Parse iter output for findings counts + verdict.
# Emits ONE single-line: "P0=N P1=N P2=N VERDICT=X NEW_FINDINGS_RATIO=R"
# Uses grep|wc -l (always emits clean integer) instead of grep -c (exits 1 on no match).
parse_iter() {
  local FILE="$1"
  if [ ! -s "$FILE" ]; then
    echo "P0=0 P1=0 P2=0 VERDICT=EMPTY NEW_FINDINGS_RATIO=0.0"
    return
  fi
  local P0 P1 P2 V TOTAL RATIO
  P0=$(grep -E '^### \[P0\]' "$FILE" 2>/dev/null | wc -l | tr -d '[:space:]')
  P1=$(grep -E '^### \[P1\]' "$FILE" 2>/dev/null | wc -l | tr -d '[:space:]')
  P2=$(grep -E '^### \[P2\]' "$FILE" 2>/dev/null | wc -l | tr -d '[:space:]')
  P0=${P0:-0}; P1=${P1:-0}; P2=${P2:-0}
  V=$(grep -E '^Review verdict: (PASS|CONDITIONAL|FAIL)' "$FILE" 2>/dev/null | tail -1 | awk -F': ' '{print $2}' | tr -d '[:space:]')
  V="${V:-UNKNOWN}"
  TOTAL=$((P0 + P1 + P2))
  RATIO="1.0"
  if [ "$TOTAL" -eq 0 ]; then RATIO="0.0"; fi
  echo "P0=${P0} P1=${P1} P2=${P2} VERDICT=${V} NEW_FINDINGS_RATIO=${RATIO}"
}

# Simple convergence: 2 consecutive iters with zero findings AND no P0/P1 carried.
should_converge() {
  local STATE_LOG="$1"
  local LAST_TWO_RATIOS=$(grep '"newFindingsRatio"' "$STATE_LOG" 2>/dev/null | tail -2 | grep -oE '"newFindingsRatio":[0-9.]+' | awk -F':' '{print $2}')
  local CNT=$(echo "$LAST_TWO_RATIOS" | wc -l | tr -d ' ')
  if [ "$CNT" -lt 2 ]; then return 1; fi
  local ALL_ZERO=$(echo "$LAST_TWO_RATIOS" | grep -v '^0.0$' | wc -l | tr -d ' ')
  if [ "$ALL_ZERO" -eq 0 ]; then return 0; fi
  return 1
}

# ─── Per-scope driver ──────────────────────────────────────────
# Sets global RUN_SCOPE_SAVED = unused iter slots (do NOT echo any return value).
# All status output goes to $LOG via `>>"$LOG"` redirects, never stdout, to keep
# stdout reserved for callers that capture (we no longer do, but keep clean).
run_scope() {
  local SCOPE_PATH="$1"
  local ALLOC="$2"
  local LABEL="$3"
  RUN_SCOPE_SAVED=0

  {
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "SCOPE: ${LABEL}   ($(ts))"
    echo "Path:  ${SCOPE_PATH}"
    echo "Allocated iters: ${ALLOC}"
    echo "═══════════════════════════════════════════════════════════════"
  } | tee -a "$LOG" >&2

  local REVIEW="${SCOPE_PATH}/review"
  local PROMPTS="${REVIEW}/prompts"
  local ITERS="${REVIEW}/iterations"
  local DELTAS="${REVIEW}/deltas"
  local STATE="${REVIEW}/deep-review-state.jsonl"
  local CONFIG="${REVIEW}/deep-review-config.json"
  local SESSION_ID="rvw-${LABEL}-$(date -u +%Y%m%d-%H%M%S)"

  # Resume guard: if review-report.md exists, scope already completed in a prior run.
  if [ -f "${REVIEW}/review-report.md" ]; then
    local DONE_ITERS
    DONE_ITERS=$(grep -E '^- Iterations: [0-9]+ of [0-9]+' "${REVIEW}/review-report.md" 2>/dev/null | head -1 | awk '{print $3}')
    DONE_ITERS=${DONE_ITERS:-0}
    echo "Scope ${LABEL}: already complete (${DONE_ITERS} iters); skipping." | tee -a "$LOG" >&2
    RUN_SCOPE_SAVED=$(( ALLOC - DONE_ITERS ))
    if [ "$RUN_SCOPE_SAVED" -lt 0 ]; then RUN_SCOPE_SAVED=0; fi
    return 0
  fi

  mkdir -p "$PROMPTS" "$ITERS" "$DELTAS"

  # Write minimal config
  cat > "$CONFIG" <<JSON
{
  "sessionId": "${SESSION_ID}",
  "reviewTarget": "${SCOPE_PATH}",
  "reviewTargetType": "spec-folder",
  "reviewDimensions": ["correctness","security","traceability","maintainability"],
  "specFolder": "${SCOPE_PATH}",
  "maxIterations": ${ALLOC},
  "convergenceThreshold": 0.10,
  "executionMode": "auto",
  "executor": {
    "kind": "cli-devin",
    "model": "swe-1.6",
    "permissionMode": "auto",
    "timeoutSeconds": 900
  },
  "createdAt": "$(ts)",
  "status": "initialized",
  "driver": "run-deep-review-arc.sh (non-canonical minimal driver)"
}
JSON

  # Append session-start event to state log
  echo "{\"type\":\"event\",\"event\":\"session_start\",\"sessionId\":\"${SESSION_ID}\",\"timestamp\":\"$(ts)\"}" >> "$STATE"

  local USED=0
  local CONVERGED=0
  local I=1
  while [ "$I" -le "$ALLOC" ]; do
    local DIM_IDX=$(( (I - 1) % 4 ))
    local DIM="${DIMENSIONS[$DIM_IDX]}"
    local ITER_NUM=$(printf "%03d" "$I")
    local ITER_PROMPT="${PROMPTS}/iteration-${ITER_NUM}.md"
    local ITER_AGENT_CFG="${PROMPTS}/agent-config-iter-${ITER_NUM}.json"
    local ITER_OUT="${ITERS}/iteration-${ITER_NUM}.md"

    {
      echo ""
      echo "── Iter ${I}/${ALLOC} — ${DIM} ($(ts)) ──"
    } | tee -a "$LOG" >&2

    local SCOPE_TYPE_HINT="phase-child"
    if [ "$LABEL" = "phase-parent" ]; then SCOPE_TYPE_HINT="phase-parent"; fi
    render_prompt "$SCOPE_PATH" "$I" "$ALLOC" "$DIM" "$ITERS" "$SCOPE_TYPE_HINT" > "$ITER_PROMPT"
    render_agent_config "$SCOPE_PATH" > "$ITER_AGENT_CFG"

    echo "Dispatching cli-devin (max 900s)..." | tee -a "$LOG" >&2
    local ITER_START=$(date +%s)
    set +e
    "$GTIMEOUT" 900 "$DEVIN" --print \
      --prompt-file "$ITER_PROMPT" \
      --model swe-1.6 \
      --permission-mode auto \
      --agent-config "$ITER_AGENT_CFG" \
      > "$ITER_OUT" 2>>"$LOG" </dev/null
    local EXIT_CODE=$?
    set -e
    local ITER_END=$(date +%s)
    local ITER_DUR=$(( ITER_END - ITER_START ))

    echo "Iter ${I} finished in ${ITER_DUR}s, exit=${EXIT_CODE}" | tee -a "$LOG" >&2

    if [ "$EXIT_CODE" -eq 124 ]; then
      echo "{\"type\":\"event\",\"event\":\"iter_timeout\",\"iteration\":${I},\"timestamp\":\"$(ts)\"}" >> "$STATE"
      echo "ITER TIMEOUT — recording and continuing" | tee -a "$LOG" >&2
    fi

    local P0=0 P1=0 P2=0 VERDICT=UNKNOWN NEW_FINDINGS_RATIO=0.0
    local PARSED=$(parse_iter "$ITER_OUT")
    echo "Parsed: ${PARSED}" | tee -a "$LOG" >&2
    eval "$PARSED" || true

    # Append iter event to state log
    echo "{\"type\":\"iteration\",\"iteration\":${I},\"dimension\":\"${DIM}\",\"findingsByP0\":${P0},\"findingsByP1\":${P1},\"findingsByP2\":${P2},\"verdict\":\"${VERDICT}\",\"newFindingsRatio\":${NEW_FINDINGS_RATIO},\"durationSec\":${ITER_DUR},\"exitCode\":${EXIT_CODE},\"timestamp\":\"$(ts)\"}" >> "$STATE"

    USED=$((USED + 1))

    if [ "$I" -ge 2 ] && should_converge "$STATE"; then
      echo "Converged after iter ${I} — stopping early" | tee -a "$LOG" >&2
      CONVERGED=1
      break
    fi

    I=$((I + 1))
  done

  # Compose simple review-report.md
  local REPORT="${REVIEW}/review-report.md"
  {
    echo "# Deep-Review Report — ${LABEL}"
    echo ""
    echo "- Scope: \`${SCOPE_PATH}\`"
    echo "- Session: ${SESSION_ID}"
    echo "- Iterations: ${USED} of ${ALLOC} allocated"
    if [ "$CONVERGED" -eq 1 ]; then
      echo "- Stop reason: converged (2 consecutive zero-finding iters)"
    else
      echo "- Stop reason: max-iterations reached"
    fi
    echo "- Completed: $(ts)"
    echo ""
    echo "## Per-Iter Verdicts"
    echo ""
    echo "| Iter | Dimension | P0 | P1 | P2 | Verdict |"
    echo "|---|---|--:|--:|--:|---|"
    for f in "${ITERS}"/iteration-*.md; do
      [ -f "$f" ] || continue
      local FN=$(basename "$f")
      local N=$(echo "$FN" | grep -oE '[0-9]+' | head -1)
      local DIM_IDX=$(( (10#$N - 1) % 4 ))
      local D="${DIMENSIONS[$DIM_IDX]}"
      local P0=0 P1=0 P2=0 VERDICT=UNKNOWN NEW_FINDINGS_RATIO=0.0
      local LINE=$(parse_iter "$f")
      eval "$LINE" || true
      echo "| ${N} | ${D} | ${P0} | ${P1} | ${P2} | ${VERDICT} |"
    done
    echo ""
    echo "## Findings Aggregate"
    echo ""
    echo "(Concatenated findings from all iters; review individual iter files for full evidence.)"
    echo ""
    for f in "${ITERS}"/iteration-*.md; do
      [ -f "$f" ] || continue
      local FN=$(basename "$f")
      echo ""
      echo "### From ${FN}"
      echo ""
      # Extract Findings section: turn flag on AFTER seeing '## Findings'; off on the next '## ' heading.
      awk '/^## Findings[[:space:]]*$/{flag=1;next} flag && /^## /{flag=0} flag' "$f"
    done
    echo ""
    echo "## Notes"
    echo ""
    echo "This report was generated by the minimal-viable driver \`run-deep-review-arc.sh\`. It does NOT run the canonical YAML reducer / dashboard / composite-convergence math. Per-iter findings are equally valid as a canonical dispatch would produce; the simplified concatenation here is the only deviation from canonical synthesis."
  } > "$REPORT"

  # Final scope verdict
  local TOTAL_P0=$(grep '"findingsByP0"' "$STATE" | grep -oE '"findingsByP0":[0-9]+' | awk -F':' '{s+=$2} END {print s}')
  local TOTAL_P1=$(grep '"findingsByP1"' "$STATE" | grep -oE '"findingsByP1":[0-9]+' | awk -F':' '{s+=$2} END {print s}')
  local SCOPE_VERDICT="PASS"
  if [ "${TOTAL_P0:-0}" -gt 0 ]; then SCOPE_VERDICT="FAIL"
  elif [ "${TOTAL_P1:-0}" -gt 0 ]; then SCOPE_VERDICT="CONDITIONAL"
  fi

  {
    echo ""
    echo "Scope ${LABEL} complete: ${USED}/${ALLOC} iters; verdict ${SCOPE_VERDICT} (P0=${TOTAL_P0:-0}, P1=${TOTAL_P1:-0})"
    echo "Report: ${REPORT}"
  } | tee -a "$LOG" >&2

  echo "{\"type\":\"event\",\"event\":\"session_complete\",\"sessionId\":\"${SESSION_ID}\",\"itersUsed\":${USED},\"itersAllocated\":${ALLOC},\"converged\":${CONVERGED},\"verdict\":\"${SCOPE_VERDICT}\",\"timestamp\":\"$(ts)\"}" >> "$STATE"

  RUN_SCOPE_SAVED=$(( ALLOC - USED ))
}

# ─── Main loop with redistribution ─────────────────────────────
echo "═══════════════════════════════════════════════════════════════" | tee "$LOG"
echo "Deep Review Arc Driver — START $(ts)" | tee -a "$LOG"
echo "Total allocated: 30 iters across 5 scopes" | tee -a "$LOG"
echo "Log: ${LOG}" | tee -a "$LOG"
echo "═══════════════════════════════════════════════════════════════" | tee -a "$LOG"

SAVED=0
RUN_SCOPE_SAVED=0
GRAND_TOTAL=0
for SCOPE_ENTRY in "${SCOPES[@]}"; do
  IFS='|' read -r SCOPE_PATH BASE_ALLOC LABEL <<< "$SCOPE_ENTRY"
  EFFECTIVE_ALLOC=$(( BASE_ALLOC + SAVED ))
  echo "" | tee -a "$LOG"
  echo "Next scope: ${LABEL} | base ${BASE_ALLOC} + saved ${SAVED} = ${EFFECTIVE_ALLOC}" | tee -a "$LOG"
  run_scope "$SCOPE_PATH" "$EFFECTIVE_ALLOC" "$LABEL"
  SAVED=$RUN_SCOPE_SAVED
  GRAND_TOTAL=$(( GRAND_TOTAL + EFFECTIVE_ALLOC - SAVED ))
  echo "Scope returned saved=${SAVED}; running total iters used: ${GRAND_TOTAL}" | tee -a "$LOG"
done

echo "" | tee -a "$LOG"
echo "═══════════════════════════════════════════════════════════════" | tee -a "$LOG"
echo "Deep Review Arc Driver — COMPLETE $(ts)" | tee -a "$LOG"
echo "Total iters used: ${GRAND_TOTAL} / 30 allocated" | tee -a "$LOG"
echo "Final SAVED (unused): ${SAVED}" | tee -a "$LOG"
echo "Log: ${LOG}" | tee -a "$LOG"
echo "═══════════════════════════════════════════════════════════════" | tee -a "$LOG"
