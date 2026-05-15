# Implementation Dispatch Reference

> Operator reference for executing the 026 restructure after multi-AI council approves `resource-map.md`. Executor preference per ADR-006: deepseek-v4-pro via cli-opencode (primary) → cli-devin DeepSeek v4 (fallback) → SWE-1.6 (last resort).

---

## Pre-execution gate

Before dispatching ANY restructure operation:

1. CHK-008..018 in checklist.md all marked complete
2. Council verdict captured at `research/council-review.md` is APPROVE or APPROVE_WITH_ADJUSTMENTS
3. Adjustments (if any) merged into `resource-map.md`
4. `git log --oneline -1` recorded as recovery baseline → `RECOVERY_BASELINE=<sha>` exported in shell

---

## Primary: deepseek-v4-pro via cli-opencode

### Why primary

- Strongest reasoning + structured-output for multi-file refactors
- Per memory `feedback_rm8_mitigation_works_under_deepseek`, four-layer RM-8 mitigation proven on this exact stack
- Verified destructive-scope safe with prompt hardening + worktree isolation + commit baseline + model awareness

### Dispatch shape

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

opencode run \
  --model deepseek-v4-pro \
  --agent general \
  --format json \
  --dangerously-skip-permissions \
  --pure \
  --dir "$(pwd)" \
  --variant high \
  "$(cat path/to/restructure-batch-NNN-prompt.md)" \
  </dev/null
```

### Key flags

| Flag | Why |
|------|-----|
| `--model deepseek-v4-pro` | Primary executor model |
| `--agent general` | General agent for multi-tool work |
| `--format json` | Structured output the orchestrator can parse |
| `--dangerously-skip-permissions` | Required for file write/delete operations during execution |
| `--pure` | Required for DeepSeek per memory `feedback_opencode_pure_flag_required_for_deepseek` — tool-name regex compliance |
| `--dir` | Pin working directory |
| `--variant high` | Maps to reasoning effort |
| `</dev/null` | Required per memory `feedback_opencode_run_requires_dev_null_stdin` — closed stdin |

### Prompt skeleton for a restructure batch

```markdown
# Restructure Batch NNN — <operation>

## Context

Recovery baseline: <SHA>
Active resource-map: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/resource-map.md
Working directory: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
Branch: main (NEVER feature branch)
Spec folder for THIS batch: 999-spec-026-restructure-research (Gate 3 pre-approved)

## RM-8 prevention (mandatory four-layer)

1. Read `.opencode/skills/cli-opencode/references/destructive_scope_violations.md` before any destructive operation
2. Worktree isolation: confirm current branch is `main` AND no in-progress merge (`git status` clean except 999/)
3. Per-operation immediate commit (don't batch destructive operations across files)
4. Model awareness: this dispatch is deepseek-v4-pro; honor its tool-name regex compliance via --pure

## Batch scope (from resource-map.md Migration Plan, section <X>)

- Operation 1: <merge / delete / rename> — <packet path> — <target>
- Operation 2: ...
...

## Acceptance criteria

- Every operation in this batch completed
- Per-operation commit on main
- No file outside the batch's explicit scope modified
- Post-batch strict-validate exits 0 on every touched spec folder

## Verification

- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <touched-folder> --strict` exits 0 per touched folder
- `git diff --stat HEAD~N..HEAD` matches the planned operation count
- `git status` clean after the batch

## Stop conditions

- All operations complete → success
- Any operation fails → halt the batch; log to `999/research/restructure-failures.log`; revert THIS batch (`git reset --hard $RECOVERY_BASELINE_FOR_BATCH`); request operator review
```

---

## Fallback 1: cli-devin with DeepSeek v4

### When to use

- cli-opencode dispatch hangs or errors
- DeepSeek API via cli-opencode unavailable
- Operator explicitly requests the Devin variant

### Dispatch shape

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

# Substitute the agent-config recipe placeholders
REPO_ROOT="$(pwd)"
PACKET_ROOT=".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research"
sed -e "s|<repo-root>|$REPO_ROOT|g" -e "s|<packet-root>|$PACKET_ROOT|g" \
  .opencode/skills/cli-devin/assets/agent-config-synthesis.json \
  > /tmp/agent-config-restructure-batch-NNN.json

# Dispatch
devin --print \
  --prompt-file path/to/restructure-batch-NNN-prompt.md \
  --model deepseek-v4 \
  --permission-mode auto \
  --agent-config /tmp/agent-config-restructure-batch-NNN.json \
  </dev/null
```

### Key differences from primary

- Model is `deepseek-v4` (Devin's variant), not `deepseek-v4-pro`
- Permission mode `auto` (Devin's permission gating)
- Agent-config recipe needs Write scope; reuse the synthesis recipe (already has scoped Write) OR author a `agent-config-restructure.json` with the same shape pointing at the right packet paths
- Per memory `feedback_codex_sandbox_blocks_network`: not applicable here (cli-devin doesn't use codex sandbox)

---

## Last resort: SWE-1.6 with smaller scoped operations

### When to use

- Both deepseek-v4-pro AND cli-devin DeepSeek v4 dispatches fail
- Operator explicitly accepts the slower, more granular fallback

### Strategy

SWE-1.6 is coding-specialized but smaller than DeepSeek v4 / deepseek-v4-pro. Multi-step refactors need to be BROKEN INTO SMALLER OPERATIONS:

- One merge per dispatch (not multiple merges)
- One delete per dispatch (not multiple deletes)
- One rename per dispatch
- Each dispatch has tighter pre-planning + per-step acceptance criteria

### Dispatch shape

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

# Substituted agent-config with Write scope (synthesis recipe variant)
sed -e "s|<repo-root>|$(pwd)|g" -e "s|<packet-root>|<packet-being-merged>|g" \
  .opencode/skills/cli-devin/assets/agent-config-synthesis.json \
  > /tmp/agent-config-swe16-restructure-op-NNN.json

devin --print \
  --prompt-file path/to/single-op-NNN-prompt.md \
  --model swe-1.6 \
  --permission-mode auto \
  --agent-config /tmp/agent-config-swe16-restructure-op-NNN.json \
  </dev/null
```

### Prompt strictness for SWE-1.6

Per the cli-devin SKILL §4 ALWAYS #12 (SWE-1.6 Prompt-Quality Contract):

1. Apply STAR / RCAF / BUILD framework — tag in line 1
2. Pre-planning block with ordered steps + per-step acceptance criteria + stop conditions + verification approach
3. Single scoped operation per prompt
4. Output contract (what file paths get touched, what content goes where)

---

## Per-operation commit pattern

After every executor dispatch returns successfully:

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

# Per-operation strict-validate
for folder in $TOUCHED_FOLDERS; do
  bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh "$folder" --strict || {
    echo "VALIDATE FAILED on $folder — halting batch"
    exit 2
  }
done

# Commit
git add $TOUCHED_PATHS
git commit -m "restructure(026): <operation-summary> — batch NNN op MMM"
```

---

## Failure / rollback path

If a batch fails partway through:

1. Log the failure to `999/research/restructure-failures.log` with:
   - batch number, operation number, executor used, exact dispatch command, log file
2. Revert the partial work: `git reset --hard <BATCH_START_SHA>`
3. Surface the failure to the operator with a summary of what survived vs what reverted
4. Wait for operator direction (retry with different executor / skip / abort)

DO NOT retry blindly — RM-8 destructive-scope risk increases with retries on the same operation.

---

## Final cleanup

After the restructure executes and is verified:

1. `git rm -rf .opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/`
2. Confirm 999 is gone: `ls .opencode/specs/system-spec-kit/026-graph-and-context-optimization/ | grep 999` → empty
3. Final commit: `chore(026): remove 999 restructure research packet — work executed in <follow-on-packet-ID>`
4. The follow-on packet's implementation-summary captures the completion
