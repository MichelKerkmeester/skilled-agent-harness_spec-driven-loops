#!/usr/bin/env bash
# Serial deep-review driver dispatching GPT-5.5 (xhigh, fast) via codex exec.
#
# READ-ONLY: codex runs with --sandbox read-only, so the dispatched model cannot
# write to the repo. Each iteration's narrative is captured from codex stdout
# (salvage-as-primary), and structured findings come from a fenced marker block
# the prompt asks the model to emit. State + deltas JSONL are written by THIS
# driver, not the model.
#
# Deviation note: the canonical command runs one convergence-driven executor per
# invocation; the operator required a fixed model (GPT-5.5 xhigh fast) across a
# fixed iteration budget split over two targets, which the single command cannot
# express, so this uses a serial packet-local worker pool with kill-between
# (codex single-dispatch discipline) while preserving externalized-state +
# fresh-context-per-iteration + per-iteration-JSONL + read-only review contracts.
set -uo pipefail

REPO=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
REL123=.opencode/specs/skilled-agent-orchestration/123-deep-loop-parallel-fanout/008-deep-review/review
REL122=.opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/006-deep-review/gpt55
STATUS="$REPO/$REL123/orchestration-status.log"
PER_ITER_TIMEOUT=600

focus_for() {
  case "$1:$2" in
    p123:1) echo "DIMENSION: fanout-pool.cjs correctness. Review .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs. Check runCappedPool: concurrency-cap enforcement, Promise.allSettled per-item isolation (one lineage failure does not abort the pool), status-ledger JSONL correctness, off-by-one in the cap, and unhandled-rejection paths.";;
    p123:2) echo "DIMENSION: fanout-run.cjs per-lineage spawn. Review .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs. Check the per-lineage CLI driver, the --artifact-dir-override branch, per-lineage session_id assignment, cwd forwarding, and that a spawned lineage runs the existing loop verbatim (no divergence).";;
    p123:3) echo "DIMENSION: fanout-merge.cjs consumer merges. Review .opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs. Check the research merge (dedup + attribution) and the review merge (severity rollup + strongest-restriction: any active P0 forces merged FAIL). Find rollup bugs, attribution loss, dedup collisions.";;
    p123:4) echo "DIMENSION: fanout-salvage.cjs recovery. Review .opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs. Check stdout->md recovery, reuse of post-dispatch-validate, partial/empty output handling, and that salvage never fabricates an iteration that did not run.";;
    p123:5) echo "DIMENSION: executor-config.ts schema. Review .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts. Check lineageExecutorSchema, fanoutConfigSchema, parseFanoutConfig, expandLineages: validation completeness, conflict detection (--executor vs --executors), default handling, and type-safety of the expansion.";;
    p123:6) echo "DIMENSION: executor-audit.ts additivity. Review .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts. Verify the optional lineageId field is purely additive and does not change existing single-executor audit records. Flag any behavior change to the non-fanout path.";;
    p123:7) echo "DIMENSION: byte-identical parity (HARD GATE). Verify the single-executor path is unchanged when no fan-out flags are passed. Inspect the config/plan/state code paths and any conditional that could alter default-path output (config, state.jsonl modulo timestamps, iteration md, final report). This is the packet's non-negotiable gate; flag ANY default-path drift as P0.";;
    p123:8) echo "DIMENSION: coverage-graph isolation. Review how per-lineage session_id isolates the shared SQLite coverage graph (.opencode/skills/coverage-graph/ + how fanout-run sets session_id). Check for cross-lineage key collisions, missing isolation, or any schema change. Confirm zero destructive migration.";;
    p123:9) echo "DIMENSION: command flag parsing. Review the deep command flag handling for --executor (repeatable), --executors, --concurrency across .opencode/commands/deep/ and the deep-loop-runtime parse path. Check default policy (single-executor when absent), conflicting-flag handling, and validation error messages.";;
    p123:10) echo "DIMENSION: YAML workflow steps. Review .opencode/commands/deep/assets/*.yaml for step_fanout_spawn, the step_resolve_artifact_root override branch, and the recursion guard (a spawned lineage must not itself fan out). Check all four auto/confirm YAMLs for consistency and a missing guard.";;
    p123:11) echo "DIMENSION: docs-vs-code drift. Compare .opencode/skills/deep-loop-runtime/SKILL.md + deep-research/deep-review SKILL.md convergence/fan-out sections against the actual fanout code. Verify docs permit command-driven fan-out, keep intra-lineage wave parallelism deferred, and describe what the code actually does.";;
    p123:12) echo "DIMENSION: tests + security. Review .opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts + executor-config.vitest.ts for coverage gaps. Check security: spawn argument injection, path escape in artifact-dir-override, fd/process leaks on lineage failure, lock contention across lineages.";;
    p123:13) echo "DIMENSION: spec-folder doc integrity. Review the 001-006 child spec.md + implementation-summary.md + graph-metadata.json under the 123 packet. Check completion claims match reality (171/171 etc.), no contradictory states, no fabricated counts, continuity fields valid.";;
    p123:14) echo "DIMENSION: 007 design-phase soundness. Review the 007-native-per-iteration-model-schedule spec.md + plan.md + tasks.md. This is design-only. Check the iterationPlan desugaring contract is sound against the REAL fanout APIs (fanout-pool/run/merge, executor-config), the ordered-band sequencing gap is honestly scoped (not hand-waved as pure sugar), and merge-precedence preserves the severity-rollup invariant.";;
    p123:15) echo "DIMENSION: security + resource lifecycle (cross-cutting). Across all fanout scripts: spawn injection surface, path traversal, unbounded concurrency, orphaned child processes / file descriptors on partial failure, and lock/lease cleanup. Flag any resource that is acquired but not released on the error path.";;
    p123:16) echo "DIMENSION: integration synthesis. Holistic: does the end-to-end fan-out (config -> pool -> per-lineage spawn -> salvage -> coverage-graph -> merge) actually compose correctly across phases 001-006? Flag cross-phase contract mismatches, the single highest residual risk, and any gap a per-phase review would miss.";;
    p122:1) echo "DIMENSION: three-lane consistency (confirm remediation). Verify .opencode/agents/deep-improvement.md, .claude/agents/deep-improvement.md, .gemini/agents/deep-improvement.md, feature_catalog/feature_catalog.md, and commands/deep/start-skill-benchmark-loop.md now consistently describe THREE lanes (agent-improvement, model-benchmark, skill-benchmark) and that D1-inter is labeled built-but-opt-in. Flag any residual two-lane / stale statement.";;
    p122:2) echo "DIMENSION: Lane C code spot-check. Review .opencode/skills/deep-improvement/scripts/skill-benchmark/{d5-connectivity,score-skill-benchmark,run-skill-benchmark}.cjs and scripts/shared/loop-host.cjs. Confirm the d5 missing-SKILL.md early-return score is 60 (matches penalty path), SKILL_BENCHMARK_RUN_OPTIONS forwards only consumed flags, and find any real logic bug.";;
    p122:3) echo "DIMENSION: sk-doc template alignment + tests. Verify references/skill-benchmark/{scoring_contract,operator_guide,scenario_authoring}.md now carry title/type/status frontmatter + a numbered '## 1. OVERVIEW' matching the Lane A/B reference convention. Note: --advisor-mode should be documented. Confirm the vitest suite (scripts/tests/skill-benchmark.vitest.ts) covers a scored e2e scenario.";;
    p122:4) echo "DIMENSION: docs-vs-code + completion claims. Check scoring_contract weights (D1=25[12+13]/D2=20/D3=15/D4=25/D5=15) match score-skill-benchmark.cjs; the 003 implementation-summary stale 'not committed' note is corrected; default_profile.json weights are annotated as not-yet-consumed; no doc overclaims a count or completion state.";;
    *) echo "general review synthesis";;
  esac
}

out_base() { case "$1" in p123) echo "$REPO/$REL123";; p122) echo "$REPO/$REL122";; esac; }
rel_base() { case "$1" in p123) echo "$REL123";; p122) echo "$REL122";; esac; }

run_one() {
  local target="$1" iter="$2"
  local base relb focus md log dj sp it2
  base="$(out_base "$target")"; relb="$(rel_base "$target")"
  it2=$(printf '%03d' "$iter")
  mkdir -p "$base/iterations" "$base/deltas" "$base/state-parts" "$base/logs"
  md="$base/iterations/iteration-$it2.md"
  log="$base/logs/iter-$it2.out"
  dj="$base/deltas/iter-$it2.jsonl"
  sp="$base/state-parts/iter-$it2.jsonl"
  focus="$(focus_for "$target" "$iter")"

  local scope_line
  case "$target" in
    p123) scope_line="the work in packet 123 (deep-loop native parallel fan-out): the deep-loop-runtime fanout scripts, executor-config/audit libs, command flag surface, the four deep YAMLs, tests, and the 001-007 spec children.";;
    p122) scope_line="the remediated work in packet 122 (the deep-improvement skill's Lane C skill-benchmark, the deep-agent-improvement->deep-improvement rename, and three-lane docs). A prior review already fixed 4 P1 + 6 P2; THIS pass independently confirms the remediation held and looks for anything missed.";;
  esac

  local PROMPT
  PROMPT=$(cat <<PROMPTEOF
You are a senior code reviewer performing ONE iteration (iteration ${iter}) of an autonomous deep-review loop over ${scope_line}
Repo root (your workdir): ${REPO}

REVIEW ONLY THIS ITERATION'S DIMENSION. Be strictly READ-ONLY: inspect files; do NOT modify anything, just report. Be efficient: target 6 to 11 file reads, breadth over exhaustive depth.

THIS ITERATION'S FOCUS:
${focus}

Rules:
- Cite EVERY finding with an exact repo-relative file path and line number. Re-read the cited line before recording a P0.
- Classify each finding: P0 (correctness/security/contradiction that breaks behavior), P1 (degraded/incomplete/missing validation), P2 (style/naming/docs/polish).
- Be skeptical and precise. Do NOT invent line numbers. If you cannot confirm an issue from the actual file, do not report it.
- A clean dimension is a valid result. Report zero findings rather than padding.

OUTPUT (exactly this structure):
## Focus
<one line: the dimension>
## Findings
<for each: severity, file:line, issue (1-2 sentences), one-line fix. If none: "No findings.">
## Verdict
<one line>
Then a line that is EXACTLY one of: Review verdict: PASS | Review verdict: CONDITIONAL | Review verdict: FAIL

Then, AFTER the verdict line, emit the machine block:
===FINDINGS_JSON===
[{"id":"f-${target}-i${iter}-01","severity":"P0|P1|P2","file":"relative/path","line":123,"issue":"...","fix":"..."}]
===END_FINDINGS===
(emit [] between the markers if there are no findings)
PROMPTEOF
)

  local start end ec
  start=$(date +%s)
  echo "${start} START ${target} iter${iter}" >> "$STATUS"
  gtimeout "$PER_ITER_TIMEOUT" codex exec \
    --model gpt-5.5 \
    -c model_reasoning_effort="xhigh" \
    -c service_tier="fast" \
    --sandbox read-only \
    -c approval_policy=never \
    "$PROMPT" </dev/null > "$log" 2>&1
  ec=$?
  if [ -s "$log" ]; then
    awk 'BEGIN{last=0} /^--------$/{last=NR} {lines[NR]=$0} END{for(i=1;i<=NR;i++){if(i>last) print lines[i]}}' "$log" > "$md" 2>/dev/null
    [ -s "$md" ] || cp "$log" "$md"
  else
    printf '## Focus\n%s\n## Findings\nNO OUTPUT (codex produced no stdout; exit=%s).\n## Verdict\nReview verdict: CONDITIONAL\n' "$focus" "$ec" > "$md"
  fi
  # codex echoes the prompt back (so the transcript contains the FINDINGS_JSON
  # template with its literal "P0|P1|P2" placeholder and the instruction line
  # that names all three verdicts) AND reprints its final message — multiple
  # marker blocks per file. A between-markers awk concatenates them into invalid
  # JSON, and a global verdict grep matches the echoed instruction line. So:
  # collect every fenced block, parse each independently, drop the placeholder
  # echo, dedup, and derive the verdict from the surviving real findings.
  local fcount verdict parsed
  parsed=$(node -e '
    const fs = require("fs");
    const txt = fs.readFileSync(process.argv[1], "utf8");
    const re = /===FINDINGS_JSON===\s*([\s\S]*?)\s*===END_FINDINGS===/g;
    const seen = new Map();
    let m;
    while ((m = re.exec(txt)) !== null) {
      let arr;
      try { arr = JSON.parse(m[1].trim()); } catch { continue; }
      if (!Array.isArray(arr)) continue;
      for (const f of arr) {
        if (!f || typeof f !== "object") continue;
        if (f.severity === "P0|P1|P2") continue;
        if (!["P0", "P1", "P2"].includes(f.severity)) continue;
        const k = f.id || (f.file + ":" + f.line + ":" + f.issue);
        if (!seen.has(k)) seen.set(k, f);
      }
    }
    const out = [...seen.values()];
    fs.writeFileSync(process.argv[2], out.map((f) => JSON.stringify({ type: "finding", ...f })).join("\n") + (out.length ? "\n" : ""));
    const s = new Set(out.map((f) => f.severity));
    const v = s.has("P0") ? "FAIL" : s.has("P1") ? "CONDITIONAL" : "PASS";
    process.stdout.write(out.length + " " + v);
  ' "$md" "$dj" 2>/dev/null)
  fcount=${parsed%% *}
  verdict=${parsed#* }
  [ -z "$fcount" ] && fcount=0
  { [ -z "$verdict" ] || [ "$verdict" = "$parsed" ]; } && verdict="UNKNOWN"
  printf '{"type":"iteration","target":"%s","iteration":%s,"model":"gpt-5.5-xhigh","status":"complete","verdict":"%s","findings":%s,"exit":%s}\n' "$target" "$iter" "$verdict" "$fcount" "$ec" > "$sp"

  end=$(date +%s)
  echo "${end} DONE ${target} iter${iter} exit=${ec} dur=$((end-start))s verdict=${verdict} findings=${fcount} md=$([ -s "$md" ] && echo yes || echo no)" >> "$STATUS"
  pkill -9 -f "codex exec --model gpt-5.5" 2>/dev/null
  sleep 1
}

for i in 1 2 3 4; do run_one p122 "$i"; done
for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16; do run_one p123 "$i"; done
echo "$(date +%s) ALL_DONE" >> "$STATUS"
