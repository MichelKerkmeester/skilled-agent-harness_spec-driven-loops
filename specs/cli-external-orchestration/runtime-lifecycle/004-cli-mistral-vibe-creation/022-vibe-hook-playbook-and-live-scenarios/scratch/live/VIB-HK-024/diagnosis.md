# VIB-HK-024 diagnosis: the mirrored agent profiles are never subagents

Verdict: **FAIL** (product bug). The subject names the mirrored profile in an
`agents.spawn` call, and Vibe rejects the call: `Unknown subagent type`
(`subagent_type_not_found`) because every generated `.vibe/agents/*.toml`
profile omits `agent_type`. The final run's delegation check fails on that
rejection.

---

## 1. CAUSE

`sync-agents-vibe.cjs` keeps only two frontmatter values, `description` and the
markdown body, and renders them as `description` and `instructions`. The
canonical sources declare `mode: subagent`, but the generator drops it, so the
mirrored profile has no `agent_type` key. Vibe's `AgentProfile` defaults
`agent_type` to `AgentType.AGENT`, which makes every mirrored profile a primary
agent rather than a subagent. `agents.spawn` with `config_name` therefore
refuses the mirrored name.

The mirror is in sync (the generator's own `--check` exits 0), so this is not
drift: the generator's contract drops the one key Vibe needs to advertise a
spawnable profile.

---

## 2. FILE AND LINE

| File | Line | What it does |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/vibe/sync-agents-vibe.cjs` | 65-76 | `splitSource()` reads `description` and the body only; `mode` is never read |
| `.skilled/skills/system-spec-kit/runtime/cli/vibe/sync-agents-vibe.cjs` | 83-91 | `renderAgentProfile()` emits `description` and `instructions` only |
| `vibe/core/agents/models.py` (installed Vibe 3.1.2) | 36, 69 | `agent_type: AgentType = AgentType.AGENT` is the default when the key is absent |
| `.skilled/agents/prompt-improver.md` | 4 | The source declares `mode: subagent` |
| `.vibe/agents/prompt-improver.toml` | 1-4 | The generated profile has no `agent_type` |

`references/runtime-folder-and-sync.md` and `.vibe/SYNC.md` document the
two-key render as intended, so the documentation and the generator agree with
each other and disagree with Vibe's subagent contract.

---

## 3. MINIMAL REPRO

Static repro, run from the checkout:

```bash
$ node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-agents-vibe.cjs --check
$ echo "check=$?"
check=0
$ grep -c '^agent_type' .vibe/agents/prompt-improver.toml
0
$ grep -n '^mode:' .skilled/agents/prompt-improver.md
4:mode: subagent
$ python3 -c "import vibe, os; print(os.path.dirname(vibe.__file__))" | xargs -I{} grep -n 'agent_type: AgentType = AgentType.AGENT' {}/core/agents/models.py
36:    agent_type: AgentType = AgentType.AGENT
```

Runtime repro, from this run's home (`VIBE_HOME` is recorded in result.json's
project sibling; the journal path below is the session's):

```bash
$ grep -o 'Unknown subagent type' "$VIBE_HOME"/logs/session/unified/*/journal/*.jsonl | head -1
Unknown subagent type
$ grep -o '"config_name":"prompt-improver"' "$VIBE_HOME"/logs/session/unified/*/journal/*.jsonl | head -1
"config_name":"prompt-improver"
```

The model's own `run_typescript` call and its result, as the journal records
them:

```text
tools.agents.spawn({ name: 'prompt-improver', config_name: 'prompt-improver',
                     message: 'Rewrite this rough request into a dispatch-ready prompt: ...' })
run_typescript failed: {"name":"ToolError","message":"Unknown subagent type", ...}

The subject's own reading of the failure in the final run:
The spawn failed: "Unknown subagent type" with code subagent_type_not_found.
```

---

## 4. PROPOSED FIX

In `splitSource()`, read the source frontmatter's `mode` as well as
`description`. In `renderAgentProfile()`, emit the mapped key:

- `mode: subagent` -> `agent_type = "subagent"`
- `mode: primary` or `mode: all` -> `agent_type = "agent"` (or omit it, which
  is Vibe's default)

Then update the generator's tests, the write-run fixtures and the two-key
statements in `.vibe/SYNC.md` and `references/runtime-folder-and-sync.md`.

After the fix, rerun this scenario. The delegation check requires a
post-restart spawn carrying `config_name` `prompt-improver` with no
`Unknown subagent type` in the same window, so a successful rerun proves the
mirrored profile was actually spawned, not merely attempted.

---

## 5. RUN EVIDENCE

- `vibe/checkpoints.tsv`: `delegate` FAIL on CHECK_FAILED. The check found the
  post-restart `config_name` attempt and the `Unknown subagent type` rejection
  in the same window, so the matrix reads FAIL for the product cause.
- `vibe/turns/delegate/screen.txt`: the subject reports the missing
  `agent_type` and refuses to hand-edit the generated file.
- An earlier run with the weaker check recorded `delegate` PASS on
  `agent-spawned-from-mirror`; that PASS was on the attempt, not a spawn, and
  the strengthened check exists so a rerun after the fix proves acceptance.
