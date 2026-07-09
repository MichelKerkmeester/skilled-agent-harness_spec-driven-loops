#!/usr/bin/env bash
# Worker: run ONE deep-research iteration for one model. Args: <model> <iter>
# Each model writes to its own packet dir; per-iteration JSONL goes to state-parts/
# (no shared-file appends, so concurrent workers cannot corrupt state).
# Robustness: the model is told to ALSO echo its full narrative as the reply, and
# this worker salvages that reply into the md if the model did not write the file.
set -uo pipefail
REPO=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
REL=.opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/002-implementation-deep-research/research
model="${1:?model}"; iter="${2:?iter}"
relRD="$REL/$model"
RD="$REPO/$relRD"
mkdir -p "$RD/iterations" "$RD/deltas" "$RD/state-parts" "$RD/logs"
STATUS="$REPO/$REL/orchestration-status.log"

case "$iter" in
 1) focus="IQ1 — Lane C module architecture & seam reuse: given the FIXED per-lane layout (skill-benchmark/ subdir under assets/ references/ scripts/ + shared/ for cross-lane code), decide which logic is genuinely shared (-> shared/) vs Lane-C-specific (-> skill-benchmark/), and how much of Lane B's scorer/grader/cache (scripts/model-benchmark/scorer/) and dispatch-model.cjs Lane C reuses by importing from a shared location vs forking; keep the three seams (candidate-source/dispatcher/scorer) clean. PLUS IQ8 — which 2-3 real skills to dogfood Lane C on first, weight/verdict-band calibration method, vitest/integration test patterns for the new lane, and external prior art for harness implementation (golden traces, CI determinism, SARIF result->fix->location).";;
 2) focus="IQ2 — loop-host wiring + non-regression: how to extend scripts/shared/loop-host.cjs planInvocation() with --mode=skill-benchmark (materialize -> dispatch -> score -> report ordering, like Lane B's materialize-first contract) while proving Lane A/B stay byte-identical when the flag is absent (the TST-1 identity contract). PLUS IQ3 — trace-capture implementation: which of the 3 fidelity tiers (CLI .out parse / tool-proxy wrapper / MCP transport intercept) to build first; robust parsing of ALL file-touch verbs (Read, Bash cat/rg, Grep, Glob) across all 5 executors; canonicalization to resource keys (set-membership, not order); a golden-trace test fixture.";;
 3) focus="IQ4 — router-replay (Mode A) + live (Mode B): whether a pure route function (e.g. route_recursive_agent_resources(task)) exists in the smart-router/advisor code to call deterministically for the zero-leakage discovery proxy + CI path; how to capture advisor_recommend out-of-band for the D1 inter-skill signal; implementing Mode B live dispatch + detecting the A<->B divergence as a finding. PLUS IQ5 — contamination linter + 3-tier fixture pipeline: implement the pre-dispatch linter reusing the routers' OWN substring logic; the public/private fixture JSON schema + storage under assets/skill-benchmark/; the two-author-separation pipeline producing T1 (auto-derived+paraphrased), T2 (hand-authored holdout), T3 (adversarial); emit the T1<->T2 circularity meter + coverage assertion.";;
 4) focus="IQ6 — scorer + report-builder: concrete computation of D1-D5 (reuse the advisor 5-lane scorer for D1 inter12+intra13; Hit@k/Recall@k/MRR for D2; call/token counts for D3; pluggable-grader ablation for D4; static connectivity scan as the D5 hard-gate); render report.md FROM report.json (anti-drift); bottleneck ranking by funnel attrition (largest single-stage drop-off = headline); the remediation taxonomy mapping finding-class -> (file, locus, one-line fix, handoffLane).";;
 5) focus="IQ7 — rename execution runbook + decision-record resolution: turn the 001 impact map (research.md section 4) into an ordered, atomic runbook (reverse-safe moves; atomic advisor TS aliases.ts/explicit.ts/fusion.ts + Python skill_advisor.py + skill-graph.json + regression fixtures; index-regen LAST; validation gate). Resolve the 4 decision-record items: (1) agent identity @deep-agent-improvement -> @deep-improvement?, (2) deep-model-benchmark alias keep/rename/deprecate?, (3) command verbs (consensus: keep), (4) narrow vs wide rename scope (operator has chosen NARROW for execution; validate and document the recommendation with evidence).";;
 *) focus="general synthesis";;
esac

read -r -d '' PROMPT <<PROMPTEOF
You are @deep-research, a LEAF research agent doing ONE iteration (iteration ${iter} of 5) of an autonomous deep-research loop. Fresh context. Working directory is the repo root: ${REPO}

RESEARCH TOPIC: Determine the BEST WAY TO IMPLEMENT the deep-improvement rename (deep-agent-improvement -> deep-improvement) and Lane C ("skill-benchmark") — a third evaluation lane that benchmarks whether a SKILL is well-routed, discoverable, efficient, and useful in practice. The DESIGN is already converged (see the 001 research.md cited below); THIS loop produces a concrete, build-ready IMPLEMENTATION PLAYBOOK (code architecture, runtime wiring, trace capture, fixtures, scorer/report, and the rename runbook). Output must be build-ready and decision-ready, not a restated design.

THIS ITERATION'S FOCUS: ${focus}

FIXED CONSTRAINT (do not re-litigate): the skill organizes assets/, references/, and scripts/ with exactly ONE subdir per lane (agent-improvement/, model-benchmark/) + a shared/ subdir for cross-lane code. Lane C adds exactly one subdir per area: skill-benchmark/. Decide only what is shared vs Lane-C-specific, never the directory structure itself. The operator has also fixed the rename scope as NARROW (rename skill + agent id + advisor + cross-refs; keep command verbs and the agent-improvement token family); IQ7 validates and documents that choice rather than reopening it.

GROUND IN THE REPO (read what's relevant; do NOT modify anything):
- .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md  (AUTHORITATIVE converged design: D1-D5 dimensions+weights, hint-free harness, anti-circular fixtures, report taxonomy, rename impact map in section 4)
- .opencode/skills/deep-agent-improvement/SKILL.md  (target skill: Lanes A/B; smart router INTENT_SIGNALS/RESOURCE_MAP; the three seams)
- .opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs  (the mode router / planInvocation to extend)
- .opencode/skills/deep-agent-improvement/scripts/model-benchmark/  (Lane B: run-benchmark.cjs, dispatch-model.cjs, scorer/{deterministic,grader,lib} to reuse)
- .opencode/skills/deep-agent-improvement/scripts/agent-improvement/  (Lane A: score-candidate.cjs)
- .opencode/skills/deep-loop-runtime/  (shared runtime: executor-config, prompt-pack, validation, atomic state)
- .opencode/skills/system-skill-advisor/  (advisor TS aliases.ts/explicit.ts/fusion.ts + Python skill_advisor.py + skill-graph.json + regression fixtures; the smart-router / route function)
- .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/003-skill-rename-deep-improvement/spec.md and .../004-skill-benchmark-mode/spec.md  (the build phases this playbook feeds)
Also use web search/fetch for external prior art when it strengthens the answer.

CONSTRAINTS: LEAF — no sub-agents. Max 12 tool calls. Cite every finding with [SOURCE: <url>] or [SOURCE: <file:line>]. Report findings only; do NOT implement fixes or edit any skill or file outside your own iteration outputs.

OUTPUT — do BOTH:
(A) Write your full iteration narrative to ${relRD}/iterations/iteration-00${iter}.md with headings: Focus | Actions Taken | Findings (each cited) | Recommendations (build-ready) | Open Questions. Also write ${relRD}/state-parts/iter-00${iter}.jsonl containing exactly one line:
{"type":"iteration","iteration":${iter},"model":"${model}","newInfoRatio":0.6,"status":"complete","focus":"iter${iter}"}
and ${relRD}/deltas/iter-00${iter}.jsonl with that line plus one {"type":"finding","id":"f-${model}-i${iter}-NN","label":"...","iteration":${iter}} per key finding.
(B) THEN, in your final reply, PASTE THE COMPLETE iteration narrative markdown again (same content as the .md file). This is mandatory — your reply must contain the full narrative, not just a summary, so it is preserved even if the file write fails.
PROMPTEOF

start=$(date +%s)
echo "${start} START ${model} iter${iter}" >> "$STATUS"
case "$model" in
 minimax)  opencode run --model minimax/MiniMax-M2.7 --agent general --format json --dangerously-skip-permissions --pure --dir "$REPO" "$PROMPT" </dev/null > "$RD/logs/iter-00${iter}.out" 2>&1 ;;
 deepseek) opencode run --model opencode-go/deepseek-v4-pro --variant high --agent general --format json --dangerously-skip-permissions --pure --dir "$REPO" "$PROMPT" </dev/null > "$RD/logs/iter-00${iter}.out" 2>&1 ;;
 gpt55)    codex exec "$PROMPT" --model gpt-5.5 -c model_reasoning_effort="xhigh" -c service_tier="fast" > "$RD/logs/iter-00${iter}.out" 2>&1 ;;
 opus)     claude -p "$PROMPT" --model claude-opus-4-8 --permission-mode acceptEdits > "$RD/logs/iter-00${iter}.out" 2>&1 ;;
 *) echo "unknown model $model" >> "$STATUS"; exit 0 ;;
esac
ec=$?

# Salvage: if the model did not write the md itself, recover its reply from the log.
md="$RD/iterations/iteration-00${iter}.md"
log="$RD/logs/iter-00${iter}.out"
if [ ! -s "$md" ] && [ -s "$log" ]; then
  node -e 'const fs=require("fs");let out="";const raw=fs.readFileSync(process.argv[1],"utf8");let got=false;for(const ln of raw.split(/\r?\n/)){if(!ln.trim())continue;try{const o=JSON.parse(ln);if(o&&o.type==="text"&&o.part&&typeof o.part.text==="string"){out+=o.part.text;got=true;}}catch(e){}}if(!got)out=raw;process.stdout.write(out);' "$log" > "$md.tmp" 2>/dev/null
  if [ -s "$md.tmp" ]; then mv "$md.tmp" "$md"; else rm -f "$md.tmp"; fi
fi
sp="$RD/state-parts/iter-00${iter}.jsonl"
[ -s "$sp" ] || printf '{"type":"iteration","iteration":%s,"model":"%s","newInfoRatio":0.5,"status":"complete-salvaged","focus":"iter%s"}\n' "$iter" "$model" "$iter" > "$sp"

end=$(date +%s)
mdok=no; [ -s "$md" ] && mdok=yes
jsonok=no; [ -s "$sp" ] && jsonok=yes
echo "${end} DONE ${model} iter${iter} exit=${ec} dur=$((end-start))s md=${mdok} json=${jsonok}" >> "$STATUS"
