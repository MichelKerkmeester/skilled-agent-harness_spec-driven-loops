#!/usr/bin/env bash
# Worker: run ONE deep-review iteration for one model. Args: <model> <iter>
# READ-ONLY review: the agent inspects packet-122 work and reports findings; it
# writes nothing to the codebase. The agent ALSO echoes its full narrative as the
# reply, and this worker salvages that reply into the iteration .md (so the agent
# never needs write access to the repo). Per-iteration JSONL goes to state-parts/.
#
# Deviation note: the canonical /deep:start-review-loop runs one executor per
# invocation with convergence detection; the operator required a fixed
# multi-model split (N breadth iterations on a cheap model, then one
# strong-model verify) that the single command cannot express, so this uses a
# packet-local worker pool while preserving the externalized-state +
# fresh-context + per-iteration-JSONL + read-only review contracts.
set -uo pipefail
REPO=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
REL=.opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/006-deep-review/review
model="${1:?model}"; iter="${2:?iter}"
relRD="$REL/$model"
RD="$REPO/$relRD"
mkdir -p "$RD/iterations" "$RD/deltas" "$RD/state-parts" "$RD/logs"
STATUS="$REPO/$REL/orchestration-status.log"

case "$iter" in
 1) focus="DIMENSION: Lane C scorer correctness. Review .opencode/skills/deep-improvement/scripts/skill-benchmark/{router-replay.cjs,score-skill-benchmark.cjs,d5-connectivity.cjs}. Check: brace/dict parsing edge cases in router-replay extractDictBody/parseIntentSignals; recall/negative-activation math in score-skill-benchmark; D5 penalty/gate logic + score double-counting in d5-connectivity. Find logic bugs, off-by-one, wrong defaults.";;
 2) focus="DIMENSION: Lane C orchestrator + harness correctness. Review .opencode/skills/deep-improvement/scripts/skill-benchmark/{run-skill-benchmark.cjs,contamination-lint.cjs,advisor-probe.cjs,build-report.cjs,_args.cjs}. Check: malformed-fixture degradation, contamination banned-vocab breadth (false positives on common words), advisor-probe spawn/timeout/maxBuffer + rank math, build-report anti-drift (renders only from json), arg parsing.";;
 3) focus="DIMENSION: loop-host non-regression. Review .opencode/skills/deep-improvement/scripts/shared/loop-host.cjs. Verify the skill-benchmark arm is PURELY ADDITIVE: VALID_MODES, LANE_SKILL_BENCHMARK, resolveScriptPath branch, planInvocation arm. Confirm Lane A (agent-improvement default) + Lane B (model-benchmark) plans are byte-identical/unchanged. Flag any shared-function change (parseArgs/resolveMode) that could alter existing lanes.";;
 4) focus="DIMENSION: rename completeness (deep-agent-improvement -> deep-improvement). Grep across .opencode (exclude specs history/dist/archives) for residual 'deep-agent-improvement'. Verify advisor TS (aliases.ts/explicit.ts/fusion.ts) + Python (skill_advisor.py) canonical id is deep-improvement with legacy aliases kept; the Lane-B benchmark penalty target is deep-improvement (not inert); 4 agent mirrors + .codex/config.toml renamed. Flag any active dangling ref.";;
 5) focus="DIMENSION: sk-doc TEMPLATE ALIGNMENT (operator-flagged). Compare .opencode/skills/deep-improvement/references/skill-benchmark/*.md against the sk-doc reference template, and .opencode/skills/deep-improvement/assets/skill-benchmark/* against .opencode/skills/sk-doc/assets/skill/skill_asset_template.md (+ skill_md_template.md, template_rules.json). Find every structural/frontmatter/section deviation from the sk-doc templates. This is a PRIORITY dimension.";;
 6) focus="DIMENSION: three-lane consistency (operator-flagged). The skill now has 3 lanes (agent-improvement, model-benchmark, skill-benchmark). Check these still say/imply TWO lanes or omit Lane C: .opencode/agents/deep-improvement.md (line ~44 says 'two co-equal lanes'), .opencode/commands/deep/start-skill-benchmark-loop.md (line ~43 calls D1-inter 'follow-on/unscored' but it is built), the 3 runtime mirrors (.claude/.codex/.gemini agents), SKILL.md, README, feature_catalog. Flag every two-lane/stale-Lane-C statement. PRIORITY dimension.";;
 7) focus="DIMENSION: security + tests. Review the Lane C vitest (.opencode/skills/deep-improvement/scripts/tests/skill-benchmark.vitest.ts) for coverage gaps. Check security: contamination-lint path/identifier leakage, d5 path-escape detection, advisor-probe subprocess injection surface, any exec/eval. Verify fixtures (assets/skill-benchmark/fixtures) public/private split is sound (no gold leaking into public).";;
 8) focus="DIMENSION: spec-folder doc integrity + completion claims. Review packet 122 docs (002/003/004/005 spec.md + implementation-summary.md + graph-metadata.json). Check completion claims match reality (statuses, test counts, what shipped vs deferred), no contradictory states, continuity fields valid, no fabricated/overclaimed numbers. Flag any doc claiming done that isn't, or claiming a count not verifiable.";;
 9) focus="DIMENSION: docs-vs-code drift (cross-cutting). Verify SKILL.md scoring_contract + references/skill-benchmark/scoring_contract.md describe what score-skill-benchmark.cjs ACTUALLY computes (weights D1=25/D2=20/D3=15/D4=25/D5=15; which dims are scored vs unscored). Verify command file's documented invocation matches loop-host's real planInvocation args. Flag every doc claim contradicted by code.";;
 *) focus="general review synthesis";;
esac

read -r -d '' PROMPT <<PROMPTEOF
# Task
You are @deep-review, a LEAF code-review agent doing ONE iteration (iteration ${iter} of 9) of an autonomous deep-review loop over the work in packet 122 (the deep-improvement skill's new "skill-benchmark" Lane C, the deep-agent-improvement -> deep-improvement rename, and the three-lane docs). Fresh context. Working directory is the repo root: ${REPO}

# Instructions
Review ONLY this iteration's dimension. Be READ-ONLY: inspect files, do NOT modify any file under review. Target 8-11 tool calls (max 12). Breadth over depth.

# THIS ITERATION'S FOCUS
${focus}

# Do
- Cite EVERY finding with [SOURCE: <file>:<line>]. Re-read the cited code before recording a P0.
- Classify each finding: P0 (correctness/security/contradiction), P1 (degraded/incomplete/missing validation), P2 (style/naming/docs).
- Prefer concrete, fixable findings with a one-line remediation each.

# Don't
- Do NOT modify, fix, or edit any file. Report only.
- Do NOT record inference-only findings; every finding needs file:line evidence.
- Do NOT dispatch sub-agents (you are LEAF).

# Output (do BOTH)
(A) Write your iteration narrative to ${relRD}/iterations/iteration-00${iter}.md with headings: Focus | Findings (each: severity, file:line, issue, one-line fix) | Verdict. End with EXACTLY one final line: "Review verdict: PASS" or "Review verdict: CONDITIONAL" or "Review verdict: FAIL" (PASS=no P0/P1; CONDITIONAL=P1 but no P0; FAIL=any P0). Also write ${relRD}/state-parts/iter-00${iter}.jsonl with one line:
{"type":"iteration","iteration":${iter},"model":"${model}","newInfoRatio":0.6,"status":"complete","focus":"iter${iter}","findings":<count>}
and ${relRD}/deltas/iter-00${iter}.jsonl with that line plus one {"type":"finding","id":"f-${model}-i${iter}-NN","severity":"P0|P1|P2","file":"...","line":N,"issue":"...","fix":"..."} per finding.
(B) THEN paste the COMPLETE iteration narrative markdown again in your final reply (mandatory — so it survives a blocked file write).
PROMPTEOF

start=$(date +%s)
echo "${start} START ${model} iter${iter}" >> "$STATUS"
case "$model" in
 hs)   opencode run --model minimax/MiniMax-M2.7-highspeed --format json --dangerously-skip-permissions --pure --dir "$REPO" "$PROMPT" </dev/null > "$RD/logs/iter-00${iter}.out" 2>&1 ;;
 *) echo "unknown model $model" >> "$STATUS"; exit 0 ;;
esac
ec=$?

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
echo "${end} DONE ${model} iter${iter} exit=${ec} dur=$((end-start))s md=${mdok}" >> "$STATUS"
