#!/usr/bin/env bash
# Deep-review driver: 20 cli-codex iterations + synthesis.
# Read-only review against the repo; writes only inside review/.

set -uo pipefail

REPO_ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
PACKET="$REPO_ROOT/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/021-local-llm-legacy-review"
REVIEW="$PACKET/review"
ITER_DIR="$REVIEW/iterations"
PROMPT_DIR="$REVIEW/prompts"
STATE_LOG="$REVIEW/deep-review-state.jsonl"
RUN_LOG="$REVIEW/run.log"
REPORT="$REVIEW/review-report.md"
RESOURCE_MAP="$REVIEW/resource-map.md"
MAX_ITERS=10

cd "$REPO_ROOT"
mkdir -p "$ITER_DIR" "$PROMPT_DIR"
# Append to existing run.log; preserve iter-1+ history
[ -f "$STATE_LOG" ] || : > "$STATE_LOG"

log() { printf '[%s] %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*" | tee -a "$RUN_LOG" >&2; }

emit_jsonl() {
  printf '%s\n' "$1" >> "$STATE_LOG"
}

ts() { date -u +%Y-%m-%dT%H:%M:%SZ; }

emit_jsonl "{\"type\":\"event\",\"event\":\"run-resume\",\"ts\":\"$(ts)\",\"executor\":{\"kind\":\"cli-codex\",\"model\":\"gpt-5.5\",\"reasoning\":\"high\",\"serviceTier\":\"fast\",\"timeoutSeconds\":900},\"maxIterations\":$MAX_ITERS,\"convergenceThreshold\":0.05,\"note\":\"reduced from 20 to 10 per user; iter-1/iter-2 preserved\"}"

# ─── Static prompt template (quoted heredoc, no expansion) ───
PROMPT_TEMPLATE_FILE="$PROMPT_DIR/iter-template.txt"
cat > "$PROMPT_TEMPLATE_FILE" <<'TEMPLATE_EOF'
You are iteration __ITER__ of __MAX_ITERS__ in a /spec_kit:deep-review hunt for legacy residue from the local-LLM and embedding-default migration shipped in packet 014-local-embeddings-setup-a.

POST-014 CANONICAL DEFAULTS (treat as ground truth):
- Memory MCP: provider=hf-local, model=onnx-community/embeddinggemma-300m-ONNX, dtype=q8, dims=768
- CocoIndex: provider=sentence-transformers, model=google/embeddinggemma-300m, dtype=bf16, dims=768
- Provider resolution: EMBEDDINGS_PROVIDER=auto falls through to hf-local when no API keys present
- Optional: EMBEDDINGS_PROVIDER=llama-cpp (explicit opt-in) with synchronous auto-migrate on startup

PURGED FROM DEFAULTS (residue if asserted as active default):
- Voyage AI (voyageai, voyage-3, voyage-4, voyage-code-3) — kept as fallback in factory chain but NO LONGER the recommended/primary
- Qwen3 (qwen3, qwen-3, qwen-32k) — registry kept for opt-in, PURGED FROM DEFAULT DOCS
- MiniLM-384d — stale CocoIndex sqlite deleted in 004; no active code path
- Legacy generic context-index.sqlite (pre-filename-keyed) — deleted in 007
- ONNX runtime backend — REJECTED 2026-05-13 (014/014 sub-phase reverted)

SCOPE SURFACES (read-only):
1. Code .ts/.py/.cjs under: shared/, .opencode/skills/, scripts/, mcp_server/, cocoindex_code/
2. Markdown .md/SKILL.md/README/INSTALL_GUIDE under: .opencode/skills/**, .opencode/install_guides/, repo root
3. JSON/configs: description.json, graph-metadata.json (per packet), package.json, .utcp_config.json, .claude/mcp.json, root .mcp.json, opencode.json, _routes.yaml, .codex/config.toml, .gemini/settings.json, pyproject.toml, requirements*.txt, .opencode/settings*.json, .claude/settings*.json
4. Assets/templates/fixtures: assets/config_templates.md, prompt packs, test fixtures, frozen sample text
5. References: .opencode/skills/**/references/**

KNOWN STALE ANCHORS (must surface as P1 by iter 1-3):
- .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md — "prefers voyage-4 then openai then hf-local"
- .opencode/skills/system-spec-kit/references/memory/embedding_resilience.md — 1024-dim cache key references
- .opencode/skills/mcp-coco-index/INSTALL_GUIDE.md — voyage-code-3 as primary
- .opencode/skills/mcp-coco-index/references/settings_reference.md — voyage as default
- .opencode/install_guides/README.md — text-embedding-3-small default export

INTENTIONAL HISTORICAL CONTEXT (do NOT flag as residue):
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/** migration narrative
- shared/embeddings/factory.ts provider fallback chain — LIVING resolver (falls through to hf-local when no key)
- .opencode/commands/doctor/{_routes.yaml,doctor_memory.yaml} provider-detection
- vitest fixtures exercising Voyage/OpenAI fallback paths — regression safety
- Code-graph or spec-memory rows with old strings (data, not source)
- This packet (021-local-llm-legacy-review/**) — review artifacts, not target

REVIEW DIMENSIONS (categorize each finding under exactly one):
- correctness: dead/unreachable code, incorrect defaults asserted in code, config-drift between committed configs
- traceability: stale docs/READMEs/SKILL.md/INSTALL_GUIDE/references claiming outdated defaults
- maintainability: fixture rot, asset rot, orphaned templates, legacy prompt-pack residue

SEVERITY LEVELS:
- P0 (Blocker): default-asserting code/doc that BREAKS post-014 behavior or actively misleads users into wrong setup
- P1 (Required): visible/user-facing doc or config asserting a different default than canonical post-014
- P2 (Suggestion): commented-out residue, obsolete example, redundant fixture

BANNED OPERATIONS (RM-8 Layer 1):
- NO rm, NO rm -rf, NO git rm, NO mv, NO sed -i, NO rmdir
- NO writes outside the iteration file at the exact path given below
- NO commits, NO branch creation
- READ-ONLY against repo except your iteration file
If you detect a need to mutate, record it as a "scope_violation" finding instead of executing.

YOUR TASK FOR THIS ITERATION (#__ITER__):
1. Focus dimension for this iter: __DIM__
2. Use rg/grep + Read across the scope surfaces. Discriminate residue from intentional historical context.
3. Produce EXACTLY ONE file: __ITER_FILE__
4. The file must be markdown with this structure:

# Iteration __ITER_PAD__ — Local-LLM Legacy Hunt

## Focus
[one paragraph: what you scanned this iteration and why]

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-__ITER_PAD__-001 | P1 | traceability | path/to/file:N | "quoted snippet" | confirmed-residue | [short fix recommendation] |
| ... | ... | ... | ... | ... | ... | ... |

## Iteration summary
- Files scanned: N
- New findings: N (P0=N, P1=N, P2=N)
- Out-of-scope/historical noted but NOT flagged: N
- Notes: [anything for the synthesizer]

CONSTRAINTS:
- 5–15 NEW findings per iter (avoid duplicating prior iterations — see prior findings below)
- Each finding MUST have a real file:line evidence quote (no hallucinated paths)
- If you cannot find new genuine residue, output fewer findings + note "saturation" in iteration summary
- Skip files inside __PACKET_DIR__ (this review packet itself)
- Skip files inside .git/, node_modules/, __pycache__/, .venv/, dist/, build/, _sandbox/

WRITE ONLY __ITER_FILE__. DO NOT WRITE ANYWHERE ELSE.

__PRIOR_FINDINGS__
TEMPLATE_EOF

run_iter() {
  local iter="$1"
  local iter_pad
  iter_pad=$(printf '%03d' "$iter")
  local iter_file="$ITER_DIR/iteration-$iter_pad.md"
  local prompt_file="$PROMPT_DIR/iter-$iter_pad.txt"

  if [ -f "$iter_file" ]; then
    log "iter $iter: SKIP (iteration file already exists)"
    return 0
  fi

  local dim
  case $((iter % 3)) in
    1) dim="correctness" ;;
    2) dim="traceability" ;;
    0) dim="maintainability" ;;
  esac

  # Build prior-findings block (gathered from iter files 1..N-1)
  local prior_findings_file="$PROMPT_DIR/iter-$iter_pad-prior.txt"
  : > "$prior_findings_file"
  if [ "$iter" -gt 1 ]; then
    {
      echo ""
      echo "PRIOR ITERATIONS FINDINGS (avoid duplicate flags — these are already covered):"
      for f in "$ITER_DIR"/iteration-*.md; do
        [ -f "$f" ] || continue
        echo ""
        echo "--- $(basename "$f") ---"
        grep -E '^\| L-' "$f" 2>/dev/null | head -50 || true
      done
    } > "$prior_findings_file"
  fi

  # Materialize per-iter prompt by substituting placeholders
  python3 - "$PROMPT_TEMPLATE_FILE" "$prompt_file" "$iter" "$MAX_ITERS" "$dim" "$iter_file" "$iter_pad" "$PACKET" "$prior_findings_file" <<'PYEOF'
import sys, pathlib
tmpl_path, out_path, it, maxit, dim, iter_file, iter_pad, packet, prior_file = sys.argv[1:10]
tmpl = pathlib.Path(tmpl_path).read_text()
prior = pathlib.Path(prior_file).read_text() if pathlib.Path(prior_file).exists() else ""
out = (tmpl
    .replace("__ITER__", it)
    .replace("__MAX_ITERS__", maxit)
    .replace("__DIM__", dim)
    .replace("__ITER_FILE__", iter_file)
    .replace("__ITER_PAD__", iter_pad)
    .replace("__PACKET_DIR__", packet)
    .replace("__PRIOR_FINDINGS__", prior))
pathlib.Path(out_path).write_text(out)
PYEOF

  log "iter $iter ($dim): dispatching codex exec"
  local t0
  t0=$(date +%s)
  local exit_code=0
  timeout 900 codex exec \
      --model "gpt-5.5" \
      -c model_reasoning_effort="high" \
      -c service_tier="fast" \
      -c approval_policy=never \
      --sandbox workspace-write \
      --cd "$REPO_ROOT" \
      "$(cat "$prompt_file")" >> "$RUN_LOG" 2>&1
  exit_code=$?

  local t1
  t1=$(date +%s)
  local elapsed=$((t1 - t0))

  local status="complete"
  local file_present="false"
  if [ -f "$iter_file" ]; then file_present="true"; fi
  if [ "$exit_code" -ne 0 ]; then status="error_or_timeout"; fi
  if [ "$file_present" = "false" ]; then status="no_output"; fi

  local p0_count=0 p1_count=0 p2_count=0 total=0
  if [ -f "$iter_file" ]; then
    p0_count=$(grep -cE '\| P0 \|' "$iter_file" 2>/dev/null | head -1)
    p1_count=$(grep -cE '\| P1 \|' "$iter_file" 2>/dev/null | head -1)
    p2_count=$(grep -cE '\| P2 \|' "$iter_file" 2>/dev/null | head -1)
    p0_count=$((10#${p0_count:-0}))
    p1_count=$((10#${p1_count:-0}))
    p2_count=$((10#${p2_count:-0}))
    total=$((p0_count + p1_count + p2_count))
  fi

  emit_jsonl "{\"type\":\"iteration\",\"iteration\":$iter,\"ts\":\"$(ts)\",\"dimension\":\"$dim\",\"status\":\"$status\",\"elapsedSeconds\":$elapsed,\"exitCode\":$exit_code,\"iterationFile\":\"$iter_file\",\"filePresent\":$file_present,\"findingsSummary\":{\"P0\":$p0_count,\"P1\":$p1_count,\"P2\":$p2_count,\"total\":$total},\"executor\":{\"kind\":\"cli-codex\",\"model\":\"gpt-5.5\",\"reasoning\":\"high\",\"serviceTier\":\"fast\"}}"

  log "iter $iter: status=$status elapsed=${elapsed}s P0=$p0_count P1=$p1_count P2=$p2_count"
}

# ─────────────── Main loop ───────────────
for iter in $(seq 1 $MAX_ITERS); do
  run_iter "$iter"
done

# ─────────────── Synthesis pass ───────────────
log "synthesis: building synth prompt"
SYNTH_PROMPT_FILE="$PROMPT_DIR/synth.txt"
cat > "$SYNTH_PROMPT_FILE" <<SYNTH_EOF
You are the synthesizer for a /spec_kit:deep-review run that just completed 20 iterations of local-LLM legacy hunting.

Read all iteration files at $ITER_DIR/iteration-*.md. Deduplicate findings (same file:line collapsed). Produce TWO files:

1. $REPORT — canonical review report with these sections:
   ## 1. Stop Reason — "max_iterations_reached" (20/20)
   ## 2. Iteration Count — 20
   ## 3. Dimension Coverage — table: correctness/traceability/maintainability finding counts
   ## 4. Severity Counts — P0/P1/P2 totals AFTER dedup
   ## 5. Verdict — PASS / CONDITIONAL (P1 present) / FAIL (P0 present); include hasAdvisories=true when P2 present
   ## 6. Release-Readiness — short paragraph on whether canonical post-014 default state is consistent across the repo
   ## 7. Top P0 Findings (if any) — full table with evidence
   ## 8. Top P1 Findings — full table with evidence
   ## 9. Top P2 Findings (advisories) — abbreviated table
   ## 10. Recommendation — either "PASS-with-advisories, close 015 packet" or "Scaffold 022-local-llm-legacy-remediation packet"; if 016 is recommended, list top batch-able remediation groups

2. $RESOURCE_MAP — coverage map:
   | Surface | Files Scanned | P0 | P1 | P2 | Notes |
   One row per surface family from scope.

DEDUPLICATION RULES:
- Same file:line across iterations: keep highest-severity, merge evidence/recommendation
- Same file different lines: separate findings
- "intentional-historical" disposition: list in a separate appendix "Excluded as historical context"; do NOT count in main tables

Use iteration files as source of truth. Do NOT invent new findings.

After writing both files, output one line: "SYNTH_DONE p0=N p1=N p2=N verdict=X"
SYNTH_EOF

if timeout 1800 codex exec \
    --model "gpt-5.5" \
    -c model_reasoning_effort="high" \
    -c service_tier="fast" \
    -c approval_policy=never \
    --sandbox workspace-write \
    --cd "$REPO_ROOT" \
    "$(cat "$SYNTH_PROMPT_FILE")" >> "$RUN_LOG" 2>&1; then
  log "synthesis: complete"
else
  synth_exit=$?
  log "synthesis: failed (exit $synth_exit)"
fi

REPORT_PRESENT=false
RESOURCE_MAP_PRESENT=false
[ -f "$REPORT" ] && REPORT_PRESENT=true
[ -f "$RESOURCE_MAP" ] && RESOURCE_MAP_PRESENT=true

emit_jsonl "{\"type\":\"event\",\"event\":\"run-end\",\"ts\":\"$(ts)\",\"reportPresent\":$REPORT_PRESENT,\"resourceMapPresent\":$RESOURCE_MAP_PRESENT}"

log "RUN COMPLETE — see $REPORT"
