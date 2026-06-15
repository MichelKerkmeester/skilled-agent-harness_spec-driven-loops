#!/usr/bin/env bash
# Worker: run ONE deep-research iteration for one model. Args: <model> <iter>
# Each model writes to its own packet dir; per-iteration JSONL goes to state-parts/
# (no shared-file appends, so concurrent workers cannot corrupt state).
# Robustness: the model is told to ALSO echo its full narrative as the reply, and
# this worker salvages that reply into the md if the model did not write the file.
set -uo pipefail
REPO=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
REL=.opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research
model="${1:?model}"; iter="${2:?iter}"
relRD="$REL/$model"
RD="$REPO/$relRD"
mkdir -p "$RD/iterations" "$RD/deltas" "$RD/state-parts" "$RD/logs"
STATUS="$REPO/$REL/orchestration-status.log"

case "$iter" in
 1) focus="RQ1 — scoring dimensions for benchmarking a skill's REAL-WORLD utilization (routing/activation accuracy, unprompted reference/asset discovery, efficiency/bottlenecks, usefulness via skill-on/skill-off ablation, structural connectivity) + RQ7 prior art (retrieval precision/recall, tool-selection accuracy, ablation, LLM-as-judge, agent-eval harnesses).";;
 2) focus="RQ2 — design a credible HINT-FREE dispatch harness: run a realistic scenario against an AI and capture which references/assets it loaded plus its tool trace, WITHOUT leaking the expected answer/path. Resource-load instrumentation, held-out expected-resource keys, prompt-contamination avoidance.";;
 3) focus="RQ3 — score activation against the skill-advisor vs the in-SKILL.md smart router vs both as separate sub-scores; operational meaning of 'properly utilized'. PLUS RQ4 — scenario/fixture authoring (hand-authored vs generated-from-the-skill's-own-triggers) avoiding circularity.";;
 4) focus="RQ5 — the Skill Benchmark Report: rank bottlenecks and express concrete, actionable remediations a follow-up packet (or Lane A) can act on. Report shape, scoring rollup, remediation taxonomy.";;
 5) focus="RQ6 — exhaustive rename surface + SAFE ORDERING for deep-agent-improvement -> deep-improvement (skill dir, SKILL.md, commands, agent + runtime mirrors .claude/.codex/.gemini, skill-advisor graph, descriptions.json, sentinel sk-prompt-small-model, root docs, internal refs); dangling-reference risks.";;
 *) focus="general synthesis";;
esac

read -r -d '' PROMPT <<PROMPTEOF
You are @deep-research, a LEAF research agent doing ONE iteration (iteration ${iter} of 5) of an autonomous deep-research loop. Fresh context. Working directory is the repo root: ${REPO}

RESEARCH TOPIC: Design Lane C ("skill-benchmark") for the deep-improvement skill — benchmark whether a SKILL is well-structured, well-routed, efficient, and useful IN PRACTICE (how AIs actually discover and use it at the right moments), distinct from manual testing playbooks and sk-doc doc-shape validation. Also map the deep-agent-improvement -> deep-improvement rename surface. Results must be actionable/remediable.

THIS ITERATION'S FOCUS: ${focus}

GROUND IN THE REPO (read what's relevant; do not modify anything):
- .opencode/skills/deep-agent-improvement/SKILL.md  (target skill: Lane A + Lane B; smart router INTENT_SIGNALS/RESOURCE_MAP; three seams candidate-source/dispatcher/scorer)
- .opencode/skills/sk-doc/SKILL.md and .opencode/skills/system-skill-advisor/SKILL.md  (how skills are doc-validated and routed today)
- .opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/  (sibling that built Lane B)
Also use web search/fetch for external prior art when it strengthens the answer.

CONSTRAINTS: LEAF — no sub-agents. Max 12 tool calls. Cite every finding with [SOURCE: <url>] or [SOURCE: <file:line>]. Report findings only; do NOT implement fixes or edit any skill.

OUTPUT — do BOTH:
(A) Write your full iteration narrative to ${relRD}/iterations/iteration-00${iter}.md with headings: Focus | Actions Taken | Findings (each cited) | Recommendations | Open Questions. Also write ${relRD}/state-parts/iter-00${iter}.jsonl containing exactly one line:
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
