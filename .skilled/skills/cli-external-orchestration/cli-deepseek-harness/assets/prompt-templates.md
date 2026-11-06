---
title: DeepSeek Harness CLI Prompt Templates
description: Copy-ready dsh headless dispatch templates for the preflight, a dry composition check, a read-only review, an implementation, result validation and the structured handback.
trigger_phrases:
  - "dsh prompt templates"
  - "dsh review template"
  - "dsh implementation template"
  - "dsh dispatch template"
importance_tier: normal
contextType: implementation
version: 1.0.1.0
---

# DeepSeek Harness CLI Prompt Templates

Copy a template, replace each `[placeholder]` and apply the prompt-quality card before sending anything. Every template keeps the thirteen hard rules.

---

## 1. OVERVIEW

### Purpose

Gives each common dsh dispatch one tested shape, so a caller never improvises the argv, the cwd or the result check.

### Usage

1. Run the preflight in section 2.
2. Pick the dispatch template that matches the task.
3. Replace each `[placeholder]`, write the prompt to a file and pipe it in.
4. Validate the result with section 6 before reading the answer.

### Status

The `.dsh/patches/` files these templates name exist in the checkout. The LLM Gateway `deepseek-v4.1-flash-1017` run completed on 2026-11-06. OpenCode Go remains unverified because its key is not set.

---

## 2. PREFLIGHT

```bash
REPO="[absolute path of the checkout]"
RUN_DIR="$(mktemp -d)"
export DSH_HOME="$RUN_DIR/.dsh-home"
cd "$RUN_DIR"

command -v dsh || { echo "dsh not on PATH, refusing the route"; exit 1; }
[ "$(dsh --version </dev/null)" = "0.2.2-rc.1" ] || { echo "dsh is not the pinned version, re-pin first"; exit 1; }

```

`DSH_HOME` and the cwd are set before the first `dsh` call, so not even the version probe can touch `~/.dsh` or read the checkout's `.env`.

---

## 3. DRY COMPOSITION CHECK

Prove the patches compose before the first real dispatch with a new route or a new dsh version. No model is called.

```bash
DSH_HOME="$RUN_DIR/.dsh-home" dsh --profile headless --patch "$REPO/.dsh/patches/route-llmgateway-deepseek.patch.yml" --patch "$REPO/.dsh/patches/lineage.patch.yml" --dump-config \
  </dev/null >"$RUN_DIR/dump.txt" 2>"$RUN_DIR/dump.err"; echo "exit=$?"
grep -n -A3 'id: agent-default-model' "$RUN_DIR/dump.txt"
grep -n -A2 'id: session-telemetry-otel' "$RUN_DIR/dump.txt"
```

Expect exit 0, an empty `dump.err`, the route's provider and model under `agent-default-model` and `mode: DISABLED` under `session-telemetry-otel`.

---

## 4. READ-ONLY REVIEW

Prompt file `[review-prompt.md]`:

```markdown
[Inline persona block for the review agent]
[Child dispatch preamble]

Review [absolute file paths] for [the defect class].
You may read only. Do not edit, do not dispatch any CLI and do not ask questions.
Return: findings with absolute file path and line, the evidence for each, and anything you could not check.
```

Dispatch:

```bash
AI_SESSION_CHILD=1 DSH_HOME="$RUN_DIR/.dsh-home" dsh --profile headless --patch "$REPO/.dsh/patches/route-llmgateway-deepseek.patch.yml" --patch "$REPO/.dsh/patches/lineage.patch.yml" --patch "$REPO/.dsh/patches/guards.patch.yml" \
  --json --permission-mode read-only --approval-policy never - \
  <"[review-prompt.md]" >"$RUN_DIR/stdout.jsonl" 2>"$RUN_DIR/stderr.txt"
echo "exit=$?" >"$RUN_DIR/exit.txt"
```

---

## 5. IMPLEMENTATION

Prompt file `[build-prompt.md]`:

```markdown
[Inline persona block for the code agent]
[Child dispatch preamble, naming the established spec folder]

Change [one absolute file path]: [the one edit].
Prove it with: [the one command] and report its output and exit status.
Do not edit any other file, do not dispatch any CLI and do not ask questions.
Return: the diff, the command output with exit status, and any open question.
```

Dispatch:

```bash
AI_SESSION_CHILD=1 DSH_HOME="$RUN_DIR/.dsh-home" dsh --profile headless --patch "$REPO/.dsh/patches/route-llmgateway-deepseek.patch.yml" --patch "$REPO/.dsh/patches/lineage.patch.yml" --patch "$REPO/.dsh/patches/guards.patch.yml" \
  --json --permission-mode workspace-write --approval-policy never \
  --add-dir "[absolute directory the edit lives in]" - \
  <"[build-prompt.md]" >"$RUN_DIR/stdout.jsonl" 2>"$RUN_DIR/stderr.txt"
echo "exit=$?" >"$RUN_DIR/exit.txt"
```

Name the narrowest directory that holds the edit with `--add-dir`, never the checkout root, which holds the `.env`. Whether `workspace-write` confines the child to the cwd plus that directory is `documented, unconfirmed`, so check the diff of the whole checkout afterwards.

---

## 6. VALIDATE THE RESULT

```bash
node -e '
const fs = require("fs");
const lines = fs.readFileSync(process.argv[1], "utf8").trim().split("\n");
const last = JSON.parse(lines[lines.length - 1]);
const exit = fs.readFileSync(process.argv[2], "utf8").trim();
const ok = exit === "exit=0" && last.type === "final" && last.reason && last.reason.kind === "completed";
console.log(JSON.stringify({ exit, type: last.type, reason: last.reason && last.reason.kind, ok }));
process.exit(ok ? 0 : 1);
' "$RUN_DIR/stdout.jsonl" "$RUN_DIR/exit.txt"
```

The answer is the `final` event's `text`. A run is complete only when this prints `"ok":true`. Observed for comparison: the keyless offline run printed exit 1 with `type` `final` and reason `error`, code `MISSING_CREDENTIAL`.

---

## 7. STRUCTURED HANDBACK

Ask every child for this shape, and check each claim against the diff and the stream before quoting it:

```markdown
## Result
[one line: done, blocked or partial]

## Changed files
- [absolute path]: [what changed]

## Commands run
- `[command]` -> exit [code]: [the output line that matters]

## Open questions
- [question, or none]
```

---

## 8. SOURCE AND CONFIDENCE

The argv, the option set, the stream order and the keyless failure come from the offline contract pin under `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/002-dsh-offline-contract-pin/evidence/`. The LLM Gateway `deepseek-v4.1-flash-1017` answer and completed-run path are observed from 2026-11-06. OpenCode Go remains unverified because its key is not set. The sandbox boundary remains documented, unconfirmed.
