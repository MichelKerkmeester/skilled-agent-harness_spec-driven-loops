#!/usr/bin/env bash
# One build brief to DeepSeek V4.1 Flash on cli-pi, wrapped in the child-dispatch preamble and an inlined code persona.
# Usage: dispatch.sh <task-id> <brief-file>   (run from the worktree root)
set -u
id=$1; brief=$2
D=specs/sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/002-exempt-and-rewrite-guard
out=$D/scratch/runs/$id; mkdir -p "$out"
command -v pi >/dev/null || { echo "pi missing"; exit 2; }
{
cat <<'EOF'
GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/002-exempt-and-rewrite-guard

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

PERSONA: You are @code, the stack-aware implementation leaf (Depth: 1, dispatched by the orchestrator).
You are LEAF-only: never dispatch sub-agents. Edit only the files the task names. Keep the change minimal
and match the surrounding code style. Before claiming done, re-read your diff (Builder, Critic, Verifier),
run the verification command the task names and read its output. Never comment code with ticket, task,
spec or phase ids; keep the durable reason only. End with a RETURN block: files changed, the verification
command, its last lines of output, and anything you could not do.

TASK:
EOF
cat "$brief"
} > "$out/prompt.txt"
SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 PI_BLACKHOLE_PASSIVE=true PI_OFFLINE=1 \
  pi -p "$(cat "$out/prompt.txt")" --model llmgateway/deepseek-v4.1-flash-1017 --thinking high --mode text --offline \
  </dev/null > "$out/stdout.log" 2> "$out/stderr.log"
echo "exit=$? $(date +%H:%M:%S)" > "$out/exit.txt"
grep -iE 'No API key|quota|rate.?limit|usage limit|insufficient|429' "$out/stdout.log" "$out/stderr.log" | head -3
tail -25 "$out/stdout.log"
