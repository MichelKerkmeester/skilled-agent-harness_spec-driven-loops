#!/bin/bash
# Review fan-out launcher for the command-surfacing packet. Run it only after phases 012 and 013
# are built AND committed: the scope is the committed diff, so uncommitted work is not reviewed.
#
# Four lineages, one per code area, because fanout-run.cjs binds `review_dimensions: all` inside
# every review lineage (buildLoopPrompt), so each lineage covers correctness, security,
# traceability and maintainability over its own area. 5 iterations each, convergence 0.10
# (the /deep:review default), stop policy convergence, convergence mode default, concurrency 4.
#
# COORDINATOR CHECKLIST: what /deep:review:auto does around step_fanout_spawn that this bare
# runner call skips. P = the spec folder below, R = P/review.
#   1. Packet init (before launch). Resolve the packet dir, which is flat for this root packet:
#        node -e "const { resolveArtifactRoot } = require('./.skilled/skills/system-spec-kit/shared/review-research-paths.cjs'); console.log(JSON.stringify(resolveArtifactRoot('$SF', 'review')));"
#      This script then runs `mkdir -p $R`. phase_init (strategy, state log, registry, lock) is
#      skipped by the auto workflow itself on the fan-out path; each lineage builds its own.
#   2. Root config (presentation Tier 1, before launch): write $R/deep-review-config.json from
#      .skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json with
#      reviewTarget=$SF, reviewTargetType=spec-folder, the four reviewDimensions, reviewFocus=the
#      topic text, specFolder=$SF, maxIterations=5, convergenceThreshold=0.10,
#      antiConvergence.convergenceMode=default, stopPolicy=convergence, executionMode=auto,
#      lineageMode=new, resource_map.emit=true, fanout=the CFG below. No command owns this
#      write; this script records only the matrix in $R/deep-review-fanout-config.json.
#   3. Merge (after the runner exits 0):
#        node .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs --loop-type review --artifact-dir $R
#      Its active_p0 / active_p1 / active_p2 bind the verdict (any lineage P0 -> merged FAIL).
#   4. Synthesis (orchestrator-authored, no command): hydrate metrics from
#      $R/lineages/*/deep-review-state.jsonl, derive the verdict (P0 FAIL, P1 CONDITIONAL, else
#      PASS), run the adversarial self-check on every P0 and P1 (re-read file:line), and write
#      $R/review-report.md with the 9 core sections and the Planning Packet. Resource maps stay
#      per lineage at $R/lineages/*/resource-map.md (the root reducer is skipped on fan-out).
#   5. Convergence record: the step_convergence_report block of
#      .skilled/commands/deep/assets/deep-review-auto.yaml, i.e.
#        node .skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs --mode review --event-dir "$EVENT_DIR" --artifact-dir $R --state-log $R/deep-review-state.jsonl --registry $R/deep-review-findings-registry.json --output $R/review-report.md --dashboard $R/deep-review-dashboard.md --stop-reason <reason> --active-p0 <n> --active-p1 <n> --active-p2 <n> --dimension-coverage <ratio> --verdict <PASS|CONDITIONAL|FAIL> --release-readiness-state <state>
#      then each "$EVENT_DIR"/*.json through
#        node .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs --mode review --run-directory $R --event-json <file>
#   6. Mark $R/deep-review-config.json "status": "complete" (the one permitted config write).
#   7. Stage: `git add $R` (step_stage_artifact_dir). The operator's call; this script never touches git.
#   8. Save: write /tmp/save-context-data-<session-id>.json (specFolder, sessionSummary,
#      observations, recent_context, exchanges, toolCalls), then
#        node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js /tmp/save-context-data-<session-id>.json $SF
#      and confirm implementation-summary.md, decision-record.md or handover.md carries it.
#   9. Validate: bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $SF --strict (needs RESULT: PASSED).
S=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fddcf466-8e1f-44cf-a132-6f846b676c18/scratchpad
W=/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research
SF=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build
R=$SF/review
cd $W || exit 2

# Re-derive the scope at launch so it includes the commits of phases 012 and 013.
area_of() {
  case "$1" in
    .skilled/commands/doctor/*|INSTALL-SKILLED.md|*/INSTALL-GUIDE.md|*/runtime/cli/spec/create.sh) echo doctor-install ;;
    */routing-accuracy/*|*/scripts/measure-*.mjs|*/runtime/bench/*|*/runtime/scripts/fixtures/*|*/tests/command-offer*|*/tests/command-routing-slice*|*/tests/command-transcript-score*|*/tests/legacy/*|*/manual-testing-playbook/*) echo accuracy-runner ;;
    */runtime/lib/render.ts|*/hooks/*|*/runtime/skill-advisor-cli*.ts|*/runtime/lib/subprocess.ts|*/runtime/lib/advisor-runtime-values.ts|*/runtime/lib/embedders/*|*/runtime-mirrors/*|*/tests/hooks/*|*/tests/render-*|*/tests/command-brief-golden*|*/tests/command-head-length*|*/tests/doctor-brief-render*|*/tests/cli-degraded*|*/tests/skill-advisor-cli*|*/tests/semantic-prompt*|*/tests/gate1-pointer-sync*|*/tests/sync-runtime-mirrors*|*/feature-catalog/hooks-and-plugin/*|*/feature-catalog/cli-surface/*|.opencode/*|AGENTS.md) echo render-hooks-plugin ;;
    */runtime/lib/scorer/*|*/runtime/lib/command-attach.ts|*/runtime/handlers/*|*/runtime/tools/*|*/runtime/schemas/*|*/runtime/lib/skill-graph/*|*/command-bridges/*|*/command-metadata.json|*/leaf-aliases.json|*/leaf-manifest.json|*/skill_advisor.py|*/compiled-routing/*|*/ROUTER.md|*/hub-router.json|*/mode-registry.json|*/sk-create-skill/scripts/*|*/tests/scorer/*|*/tests/handlers/*|*/tests/command-*|*/tests/doctor-command-bridges*|*/tests/parity/*|*/tests/python/*|*/tests/schemas/*|*/tests/compat/*|*/feature-catalog/scorer-fusion/*) echo scorer-attach ;;
    *) echo shared ;;
  esac
}
{
  echo "# git -c core.fsmonitor=false diff --name-only origin/main...HEAD -- .skilled .opencode AGENTS.md INSTALL-SKILLED.md"
  echo "# HEAD $(git -c core.fsmonitor=false rev-parse HEAD) origin/main $(git -c core.fsmonitor=false rev-parse origin/main)"
  echo "# area<TAB>path; area = lineage label, shared = docs every lineage checks against its own area"
  git -c core.fsmonitor=false diff --name-only origin/main...HEAD -- .skilled .opencode AGENTS.md INSTALL-SKILLED.md \
    | while IFS= read -r f; do printf '%s\t%s\n' "$(area_of "$f")" "$f"; done
} > $S/review-scope.txt || exit 3

CFG='{"executors":[{"kind":"cli-opencode","model":"opencode-go/deepseek-v4.1-flash","reasoningEffort":"max","iterations":5,"label":"scorer-attach","count":1},{"kind":"cli-opencode","model":"opencode-go/deepseek-v4.1-flash","reasoningEffort":"max","iterations":5,"label":"render-hooks-plugin","count":1},{"kind":"cli-opencode","model":"opencode-go/deepseek-v4.1-flash","reasoningEffort":"max","iterations":5,"label":"accuracy-runner","count":1},{"kind":"cli-opencode","model":"opencode-go/deepseek-v4.1-flash","reasoningEffort":"max","iterations":5,"label":"doctor-install","count":1}],"concurrency":4}'
mkdir -p $R
printf '%s\n' "$CFG" > $R/deep-review-fanout-config.json
node .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs \
  --spec-folder $SF --loop-type review \
  --review-target $SF --review-target-type spec-folder \
  --review-focus "$(cat $S/review-topic1.txt)" \
  --fanout-config-json "$CFG" \
  --base-artifact-dir $R \
  --convergence-threshold 0.10 --stop-policy convergence --convergence-mode default \
  > $S/review1.out 2> $S/review1.err
echo "fanout exit=$?"
