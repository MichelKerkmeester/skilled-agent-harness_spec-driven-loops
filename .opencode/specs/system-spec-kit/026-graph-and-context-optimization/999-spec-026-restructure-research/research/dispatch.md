# Dispatch Reference — How to Run an Iter

> Per-iter dispatch shape for the 999 deep-research run. Each prompt is self-contained — pick one, run one `devin` command. No bash loop. The 40 prompts under `prompts/iteration-NNN.md` are ready to dispatch in any order.

---

## One-time setup (run once before the first iter)

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

# Substitute <repo-root> in the agent-config recipe to a temp file
REPO_ROOT="$(pwd)"
sed "s|<repo-root>|$REPO_ROOT|g" \
  .opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json \
  > /tmp/agent-config-999-research-iter.json

# Verify Devin accepts the substituted recipe (one-shot probe)
devin -p \
  --agent-config /tmp/agent-config-999-research-iter.json \
  --model swe-1.6 \
  --permission-mode auto \
  -- "say ok then stop" </dev/null
# Expected: "ok" then exit 0
```

---

## Dispatch one iter

```bash
NNN=001  # change per iter (zero-padded 3 digits: 001..040)

cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

PACKET=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research
PROMPT="$PACKET/research/prompts/iteration-${NNN}.md"
OUTPUT="$PACKET/research/iterations/iteration-${NNN}.md"
LOG="$PACKET/research/logs/iteration-${NNN}.log"

mkdir -p "$PACKET/research/iterations" "$PACKET/research/logs"

devin -p \
  --prompt-file "$PROMPT" \
  --model swe-1.6 \
  --permission-mode auto \
  --agent-config /tmp/agent-config-999-research-iter.json \
  </dev/null \
  > "$LOG" 2>&1

# The iter writes its own output to research/iterations/iteration-NNN.md per the prompt's output contract.
# The log captures the dispatch stdout/stderr for debugging.
```

---

## Per-iter immediate commit

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

git add .opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-${NNN}.md \
        .opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/deep-research-state.jsonl

git commit -m "iter(999/${NNN}): cli-devin SWE-1.6 — track-N — <one-line topic>"
```

---

## Dispatch in batches (foreground or background)

### Sequential, foreground (recommended for first 3-5 iter so you can monitor)

```bash
for NNN in 001 002 003; do
  PROMPT="$PACKET/research/prompts/iteration-${NNN}.md"
  LOG="$PACKET/research/logs/iteration-${NNN}.log"
  echo "[${NNN}] starting at $(date +%T)"
  devin -p --prompt-file "$PROMPT" --model swe-1.6 --permission-mode auto \
    --agent-config /tmp/agent-config-999-research-iter.json \
    </dev/null > "$LOG" 2>&1
  echo "[${NNN}] done at $(date +%T)"
  git add "$PACKET/research/iterations/iteration-${NNN}.md" \
          "$PACKET/research/deep-research-state.jsonl"
  git commit -m "iter(999/${NNN}): cli-devin SWE-1.6"
done
```

### Sequential, background (after first few iter confirm shape is solid)

```bash
nohup bash -c '
  for NNN in $(seq -f "%03g" 4 22); do
    devin -p --prompt-file "$PACKET/research/prompts/iteration-${NNN}.md" \
      --model swe-1.6 --permission-mode auto \
      --agent-config /tmp/agent-config-999-research-iter.json \
      </dev/null > "$PACKET/research/logs/iteration-${NNN}.log" 2>&1
    git add "$PACKET/research/iterations/iteration-${NNN}.md" "$PACKET/research/deep-research-state.jsonl"
    git commit -m "iter(999/${NNN}): cli-devin SWE-1.6"
  done
' > /tmp/999-batch-A.log 2>&1 &
```

---

## Synthesis pass (after all 40 iter committed)

```bash
PACKET_ROOT=".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research"

# Substitute placeholders in the synthesis recipe
REPO_ROOT="$(pwd)"
sed -e "s|<repo-root>|$REPO_ROOT|g" -e "s|<packet-root>|$PACKET_ROOT|g" \
  .opencode/skills/cli-devin/assets/agent-config-synthesis.json \
  > /tmp/agent-config-999-synthesis.json

# Author the synthesis prompt (or use research/prompts/synthesis.md when authored)
devin -p \
  --prompt-file "$PACKET_ROOT/research/prompts/synthesis.md" \
  --model swe-1.6 \
  --permission-mode auto \
  --agent-config /tmp/agent-config-999-synthesis.json \
  </dev/null \
  > "$PACKET_ROOT/research/logs/synthesis.log" 2>&1
```

---

## Resource-map authoring (after synthesis)

Main agent reads `research/research.md` and authors `resource-map.md` directly. No devin dispatch needed — the human-readable target-state architecture is a Claude / main-agent deliverable.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `Failed to parse agent config` | Recipe placeholders not substituted | Re-run the sed step in "One-time setup" |
| Iter file not written | SWE-1.6 prompt missing output contract | Inspect the per-iter log; check the prompt has the `## Output contract` block |
| Iter hangs > 20 min | Per-iter timeout (1200s) hit | Kill the devin process; mark iter as `status: timeout` in JSONL; move on |
| Devin auth refused | Token expired | Run `devin auth login` outside the loop; resume |
| Backslash / quote in prompt | Devin's prompt parser quirk | Use `--prompt-file` not positional `--` (already the convention here) |
