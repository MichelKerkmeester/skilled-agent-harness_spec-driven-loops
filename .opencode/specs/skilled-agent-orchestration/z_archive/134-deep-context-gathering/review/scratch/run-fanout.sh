#!/usr/bin/env bash
# Deep-review parallel fan-out: 10 narrow-slice gpt-5.5-fast xhigh READ-ONLY reviews.
# Orchestrator-writes-state pattern: seats return findings JSON only; the orchestrator
# (next step) writes iteration files + deep-review-state.jsonl from these seat outputs.
set -uo pipefail

REPO="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
RDIR="$REPO/.opencode/specs/skilled-agent-orchestration/134-deep-context-gathering/review"
SEATS="$RDIR/seats"
mkdir -p "$SEATS" "$RDIR/iterations" "$RDIR/scratch"

MODEL="openai/gpt-5.5-fast"
VARIANT="xhigh"

# Slice labels, focuses, and file sets (narrow → avoids the xhigh broad-audit timeout).
LABELS=(claude-mirror codex-mirror canonical-and-config context-pool context-gates research-review-gates aicouncil-skillbench-gates crosscommand-uniformity yaml-skill-readme specdoc-accuracy)

FOCUS=(
"Claude runtime mirror correctness: read-only tools: frontmatter (no Write/Edit/Bash/Task/WebFetch), valid MCP tool ids, body parity with the canonical .opencode agent, LEAF read-only contract intact"
"Codex runtime mirror correctness: valid TOML, sandbox_mode read-only, '# Converted from' provenance header, model id, developer_instructions body parity with canonical, no escaping/'''-collision issues"
"Canonical agent soften edit + native-default config: agent body wording accuracy under native-only default, deep_context_config.json fanout.executors == 2 native, fanout.mode enum unchanged (by-model-shared-scope), agreementMin"
"start-context-loop.md native-default pool: Q-Pool A) Native only (default) / B) Custom wording, default-policy prose (no stale heterogeneous-as-default), PRE-BOUND marker + examples consistency, flag plumbing for --executor/--executors"
"start-context-loop.md hard-blocker gates: Phase 0 @general block correctness, BLOCKED unified setup phase, EXECUTION PROTOCOL first-action order (Phase 0 then setup), no internal contradictions, restart line"
"Phase 0 + setup gates in start-research-loop.md and start-review-loop.md: per-command skill name + restart line correct (no model-benchmark leftovers), setup STATUS: BLOCKED + STOP/wait + fail-fast, renumbered first-action steps"
"Phase 0 + setup gates in ask-ai-council.md and start-skill-benchmark-loop.md: ask-ai-council restart name (note /speckit:deep-council vs /deep:ask-ai-council dual naming); skill-benchmark added EXECUTION PROTOCOL + Phase 0 + BLOCKED Setup into a thin structure correctly"
"Cross-command gate uniformity across all 7 deep commands: start-model-benchmark-loop.md display-box alignment fix, STATUS marker consistency (all ☐ BLOCKED), each command names its OWN skill/restart, two gates present and ordered everywhere"
"YAML + skill/README de-naming: deep_start-context-loop_{auto,confirm}.yaml executor_pool description + agent_config (model/tools) consistency with native default; deep-context SKILL.md + README de-named (het only in Custom/example); deep-loop-runtime SKILL.md general mirror note correctness"
"Spec-doc accuracy across 005/006/007: do spec.md / implementation-summary.md / checklist.md claims match the actual implementation and each other? completion metadata (status complete) consistent across description.json/graph-metadata.json; any overclaim or stale reference"
)

FILES=(
".claude/agents/deep-context.md .opencode/agents/deep-context.md"
".codex/agents/deep-context.toml .opencode/agents/deep-context.md"
".opencode/agents/deep-context.md .opencode/skills/deep-context/assets/deep_context_config.json"
".opencode/commands/deep/start-context-loop.md"
".opencode/commands/deep/start-context-loop.md"
".opencode/commands/deep/start-research-loop.md .opencode/commands/deep/start-review-loop.md"
".opencode/commands/deep/ask-ai-council.md .opencode/commands/deep/start-skill-benchmark-loop.md"
".opencode/commands/deep/start-model-benchmark-loop.md .opencode/commands/deep/start-agent-improvement-loop.md .opencode/commands/deep/start-context-loop.md"
".opencode/commands/deep/assets/deep_start-context-loop_auto.yaml .opencode/commands/deep/assets/deep_start-context-loop_confirm.yaml .opencode/skills/deep-context/SKILL.md .opencode/skills/deep-context/README.md .opencode/skills/deep-loop-runtime/SKILL.md"
".opencode/specs/skilled-agent-orchestration/134-deep-context-gathering/005-runtime-mirror-parity .opencode/specs/skilled-agent-orchestration/134-deep-context-gathering/006-native-default-executor-pool .opencode/specs/skilled-agent-orchestration/134-deep-context-gathering/007-deep-command-gate-hardening"
)

PIDS=()
for i in "${!LABELS[@]}"; do
  n=$(printf "%02d" $((i+1)))
  label="${LABELS[$i]}"; focus="${FOCUS[$i]}"; files="${FILES[$i]}"
  prompt="Act as a deep-review analyzer. READ-ONLY: do not write, edit, or create any file; return findings ONLY.

Context: reviewing recently-committed work (git commit 531dd53028) across three spec packets in this repo: (005) deep-context native agent runtime mirrors, (006) native-only default executor pool, (007) Phase-0 @general + un-skippable setup hard-blocker gates on all 7 deep commands. The work is mostly markdown command/skill docs, agent definition files (.md / .toml), and a JSON config — so weight correctness, internal consistency, stale/contradictory wording, wrong tool/flag/model references, broken cross-references, and read-only-contract/security issues over classic runtime code bugs.

Your slice — review ONLY these paths: ${files}
Focus: ${focus}

Read the listed files (and only what you must to verify a claim). Report REAL issues only; if the slice is clean, say so honestly — do NOT invent findings to fill a quota.

Return ONLY a single JSON object, no prose before or after, of exactly this shape:
{\"slice\":\"${label}\",\"filesReviewed\":[\"...\"],\"findings\":[{\"severity\":\"P0|P1|P2\",\"title\":\"...\",\"dimension\":\"correctness|consistency|security|completeness|maintainability|traceability\",\"file\":\"path:line\",\"evidence\":\"what you observed\",\"recommendation\":\"the fix\",\"findingClass\":\"instance-only|class-of-bug|cross-consumer|algorithmic|matrix/evidence|test-isolation\",\"scopeProof\":\"how you bounded it\",\"affectedSurfaceHints\":[\"...\"]}],\"cleanNote\":\"present only if findings is empty\"}
Severity: P0 = breaks a runtime/contract or a security/read-only-boundary violation; P1 = real correctness/consistency defect that should be fixed; P2 = minor/advisory."

  printf '%s' "$prompt" > "$SEATS/seat-$n.prompt.txt"
  gtimeout -k 60 1200 opencode run -m "$MODEL" --variant "$VARIANT" --format json --dir "$REPO" \
    "$prompt" </dev/null > "$SEATS/seat-$n.json" 2> "$SEATS/seat-$n.err" &
  PIDS+=($!)
  echo "launched seat-$n ($label) pid=$! files=[$files]"
done

echo "ALL 10 SEATS LAUNCHED ($(date -u +%FT%TZ)). Waiting..."
fail=0
for i in "${!PIDS[@]}"; do
  n=$(printf "%02d" $((i+1)))
  if wait "${PIDS[$i]}"; then ec=0; else ec=$?; fi
  sz=$(wc -c < "$SEATS/seat-$n.json" 2>/dev/null || echo 0)
  echo "seat-$n done exit=$ec bytes=$sz"
  [ "$ec" != "0" ] && fail=$((fail+1))
done
echo "FANOUT COMPLETE ($(date -u +%FT%TZ)) failures=$fail"
# Best-effort orphan cleanup (exclude operator-owned interactive sessions is N/A here; these are our run seats)
pkill -9 -f "opencode run -m openai/gpt-5.5-fast" 2>/dev/null || true
