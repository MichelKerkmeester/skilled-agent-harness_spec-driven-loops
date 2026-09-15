#!/bin/bash
cd "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
P="specs/cli-external-orchestration/071-cli-hermes-creation/011-dispatch-preflight-parity-research"
exec node .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs \
  --spec-folder "$P" \
  --loop-type research \
  --stop-policy max-iterations \
  --convergence-threshold 0.05 \
  --research-topic "Dispatch preflight parity and the Hermes caveat fixes. The preflight hook is the only surface that can force a correct cli-* dispatch; four defects and two runtime coverage gaps are already confirmed. Follow the charter at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/cli-external-orchestration/071-cli-hermes-creation/011-dispatch-preflight-parity-research/research/deep-research-strategy.md exactly, one angle per iteration for ten iterations, no early synthesis. Research only; write nothing outside the lineage directory." \
  --fanout-config-json '{"assignment_model":"flat_pool","concurrency":1,"maxRetries":3,"executors":[{"label":"deepseek","kind":"cli-pi","model":"deepseek-v4.1-flash","reasoningEffort":"max","count":1,"iterations":10,"timeoutSeconds":1800}]}' \
  --base-artifact-dir "$P/research"
