---
title: Hermes CLI Prompt Templates
description: Copy-ready Hermes dispatch templates for write, read-only review, generation, and deep-loop fan-out tasks.
trigger_phrases:
  - "hermes prompt templates"
  - "hermes write template"
  - "hermes review template"
  - "hermes fan-out template"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Hermes CLI Prompt Templates

Copy-ready templates for the common Hermes dispatch shapes. Replace `[placeholders]` with your values. Apply the canonical prompt-quality card before using them.

## 1. OVERVIEW

### Purpose

Structured, copy-paste ready dispatch templates for `hermes chat` in quiet oneshot mode. Each template pairs the full command with the prompt-file skeleton it expects.

### Usage

1. Pick the template matching the task's write posture.
2. Write the prompt file: preamble, persona, task, scope, verification.
3. Run the command with stdin closed or fed by `--query-file -`.
4. Read the exit code, stdout and stderr; verify with the named command.

---

## 2. WRITE DISPATCH

```bash
cat > /tmp/hermes-task.md <<'EOF'
GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.
[child-dispatch preamble, spec folder: specs/<track>/<packet>]

[resolved agent persona, inlined]

TASK: [one sentence]
FILES: [exact paths the leaf may change]
ACCEPTANCE: [observable outcome]
VERIFY: [command whose output proves completion]
EOF

hermes chat -Q --oneshot --query-file /tmp/hermes-task.md --provider llmgateway --model deepseek-v4.1-flash \
  --reasoning max --ignore-rules --source tool --max-turns 200 --run-budget 840 \
  -t terminal,file,skills,todo,web --yolo --in "$PWD" </dev/null
```

Example: "Add a unit test for `parseFanoutConfig` rejecting a duplicate label; FILES: `tests/unit/executor-config.vitest.ts`; VERIFY: `npx vitest run tests/unit/executor-config.vitest.ts`."

---

## 3. READ-ONLY REVIEW

```bash
hermes chat -Q --oneshot --query-file /tmp/hermes-review.md --provider llmgateway --model glm-5.3-flash \
  --reasoning max --ignore-rules --source tool --max-turns 60 --run-budget 300 \
  -t file,todo --in "$PWD" </dev/null
```

No `--yolo`: the single-query approval gate denies dangerous calls, and the toolset carries no file writes. The prompt asks for findings with `file:line` citations and a severity per finding, and states that no file may be changed.

---

## 4. GENERATION

Same command as the write dispatch with the prompt naming the new file's exact path, the conventions file to read first, and the test that proves the generated code. Prefer `deepseek-v4.1-flash` for volume and `glm-5.3-flash` for a second opinion on the same brief.

---

## 5. DEEP-LOOP FAN-OUT

The runtime builds the command; the caller supplies the lineage configuration.

```bash
/deep:research:auto "<topic>" \
  --executor=cli-hermes --model=deepseek-v4.1-flash --label=hermes --iters=5 \
  --stop-policy=max-iterations
```

The builder emits `chat -Q --oneshot --query-file -` with the prompt on stdin, `--yolo`, `--ignore-rules`, `--source tool`, `--max-turns 200`, `--run-budget` one margin under the lineage timeout, `-t terminal,file,skills,todo` plus `web` per the web-search policy, and `--reasoning max` (the roster's pinned tier). `--worktree` and `-z` never appear.

---

## 6. CROSS-VALIDATION PAIR

Run the same review prompt through Hermes and through a sibling runtime, then compare findings rather than averaging them:

```bash
hermes chat -Q --oneshot --query-file /tmp/review.md --provider llmgateway --model glm-5.3-flash --ignore-rules --source tool -t file,todo </dev/null > hermes.out 2> hermes.err
pi -p --offline --model llmgateway/glm-5.3-flash --thinking max "$(cat /tmp/review.md)" </dev/null > pi.out
```

Disagreements name what would settle them; a tally is not a finding.
