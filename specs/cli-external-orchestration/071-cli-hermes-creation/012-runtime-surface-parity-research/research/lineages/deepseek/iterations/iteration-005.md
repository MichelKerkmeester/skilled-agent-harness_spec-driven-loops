# Iteration 5: Agents Parity

## Focus

Verify the agents mirrors are actually in sync with the authored source, not merely present. Name the
gate that keeps them in sync and whether it covers every runtime. Report any runtime whose agent
files have drifted, with the diff shape.

## Findings

### F1. The roster is 12 agents, not 13 — every manifest counts a README as an agent

| Tree | Live entries |
|---|---|
| `.opencode/agents` | 12 `*.md` + `README.txt` |
| `.claude/agents` | 12 `*.md` + `README.txt` |
| `.codex/agents` | 12 `*.toml` (no README) |
| `.pi/agents` | 12 `*.md` (no README) |
| `.hermes/agents` | whole-dir symlink → `.opencode/agents` |
| `.cursor/agents` | 12 symlinks |
| `.devin/agents` | 12 nested symlinks (`<name>/AGENT.md`) |

`ls .opencode/agents/*.md | wc -l` → **12**; `.codex/agents/*.toml | wc -l` → **12**. The manifests
say 13 — `.codex/SYNC.md:25` "`agents/*.toml` (13)", `.pi/SYNC.md:26` "`agents/*.md` (13)",
`.devin/SYNC.md:29` "`agents/<name>/AGENT.md` (13)". The discrepancy is the source tree's
`README.txt`, which is a sibling of the agent files and is counted by a plain `ls`. The roster checker
itself filters correctly: `.filter((e) => (surface.ext === null ? isDirectory() : e.endsWith(surface.ext)))`
and its comment says "Only entries shaped like an agent count; sibling READMEs and stray notes".
[SOURCE: shell `ls | wc -l` across seven agent trees]
[SOURCE: file:.opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs:79-81]

The decommission commit from iteration 2 records "roster check PASS 13/13" — the same off-by-one,
propagated into a commit message.

### F2. There are two agent upstreams, and two scripts call a different one "canonical"

- **Authoring source:** `.opencode/agents/*.md`. Codex and Pi are *generated* from it;
  `.hermes/agents` is a whole-dir symlink to it. `.codex/SYNC.md:20`: "Canonical for agents is
  `.opencode/agents/` (note: *not* `.claude/agents/`, which is what Cursor and Devin use — the two
  upstreams differ)." `.pi/SYNC.md:16` repeats it: "Canonical for agents is `.opencode/agents/` —
  the same upstream Codex uses, *not* the `.claude/agents/` fork that Cursor and Devin symlink."
- **Symlink target for Cursor and Devin:** `.claude/agents/*.md`.

Both statements are correct about their own question, and the vocabulary collides:
`check-agent-mirror-sync.cjs:5-9` says agents are "authored once under `.opencode/agents/<name>.md` and
mirrored to `.claude/agents/<name>.md`", while `agent-roster-mirror-check.cjs:24` says "The Claude
tree is canonical: it holds the full agent bodies that the Cursor and Devin mirrors symlink back to."
A maintainer reading only the second would author in the wrong tree — which is exactly the drift the
first script exists to catch.
[SOURCE: file:.codex/SYNC.md:20] [SOURCE: file:.pi/SYNC.md:16]
[SOURCE: file:.opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs:5-9]
[SOURCE: file:.opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs:22-24]

### F3. Observed: the mirror gate passes today — 12 checked, all in sync, exit 0

```
$ node .opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs --all
agent-mirror-sync: 12 agent(s) checked — all mirrors in sync — OK
EXIT=0
```

This is an observed command result, not an inference. The OpenCode↔Claude pairs are in sync under the
gate's own contract.
[SOURCE: shell `check-agent-mirror-sync.cjs --all`, exit 0]

### F4. The gate compares **exact normalized token sets**, and that is a real blind spot live today

`compareBodyTokens` requires `missingTokens.length === 0 && unexpectedTokens.length === 0` after
`normalizeRuntimeSpecificText`, which rewrites per-runtime agent paths to `<runtime-agent-file>`,
deletes a `(this runtime's mirror; …)` parenthetical, and strips trailing whitespace. It always
compares **tokens, never order or proximity**.
[SOURCE: file:.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs:104-118,209-220]

The live proof that this is a blind spot, verified by direct computation with the gate's own
tokenizer:

| Pair | Body bytes | Token sets | Semantic difference | Gate verdict |
|---|---|---|---|---|
| `deep-research.md` | 37091 vs 37109 | **1188 vs 1188, identical after path normalization** | `.opencode`: "append `idea_observed` only when dispatch explicitly allows it"; `.claude`: "record `idea_observed` **through the gateway** only when dispatch explicitly allows it" | **passes** |
| `orchestrate.md` | differs | equal after normalization | `.claude` adds "(this runtime's mirror; the …)" — stripped by design | passes |
| `ai-council.md` | differs | equal | box-drawing padding widths differ (interior whitespace is not tokenized) | passes |

The `deep-research` case is a genuine behavioral instruction that diverged: one copy says the agent
appends `idea_observed` itself, the other says it goes through the gateway. Both words occur elsewhere
in both bodies, so the token sets are identical and the gate reports "in sync".
[SOURCE: shell `node -e` using `extractAgentBody`/`compareBodyTokens` from the gate's own lib]

**Generalized:** a rewrite that reuses vocabulary already present in the document is invisible to this
gate. Token-set equality is not semantic equality.

### F5. Coverage: the gate is change-scoped in both places it runs, and one generator pair is unwired

| Checker | Pre-commit | CI | Scope |
|---|---|---|---|
| `check-agent-mirror-sync.cjs` | `:87-104` staged `.opencode|.claude/agents` only | `agent-mirror-sync.yml:29` PR-range changed files only | OpenCode ↔ Claude pairs |
| `sync-agents.cjs --check` (Codex) | `pre-commit:148` | `spec-kit-check.yml:143` | Codex `.toml` derivation |
| `sync-agents-pi.cjs --check` (Pi) | **absent** | **absent** | Pi `.md` derivation |
| `agent-roster-mirror-check.cjs` | `pre-commit:151` | `spec-kit-check.yml:145` | presence + symlink resolution across five runtimes |

Both executions of the mirror gate skip entirely when no agent file changed: the pre-commit hook only
builds `STAGED_AGENTS` from `git diff --cached`, and the PR job exits 0 with "No agent files changed —
nothing to verify."
[SOURCE: file:.opencode/scripts/git-hooks/pre-commit:87-104,147-155]
[SOURCE: file:.github/workflows/agent-mirror-sync.yml:29-40]
[SOURCE: file:.github/workflows/spec-kit-check.yml:142-148]

**The gap that follows:** a one-sided edit to `.opencode/agents/x.md` is caught, and a one-sided edit
to `.claude/agents/x.md` is caught. But Pi's agent tree has no gate at all, and its own manifest
documents that its agents are *generated* (`.pi/SYNC.md:8`: "compiler output, never hand-edit them").
Nothing in either gate would notice a Pi agent falling behind the canonical tree. This is the same
class as iteration 1's unwired `--check` modes: `pi/sync-agents-pi.cjs`, `pi/sync-prompts-pi.cjs`,
`hermes/sync-prompts-hermes.cjs`, `hermes/sync-skills-hermes.cjs` — four generators with working
`--check` modes that no gate invokes.

### F6. Symlink trees cannot drift, and that is why they need no content gate

`.cursor/agents/*.md` and `.devin/agents/<name>/AGENT.md` resolve into `.claude/agents/`;
`.hermes/agents` is a whole-dir symlink onto `.opencode/agents`. For all three, the only failure mode
is a *broken or replaced* link, which is what `agent-roster-mirror-check.cjs` exists to catch — the
roster check requires the symlink to resolve to the canonical file, because "a real file here would be
a silent fork that drifts on the next canonical edit."
[SOURCE: file:.opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs:27-32]

**Consequence for the recommendation set:** asking for an "agents parity gate" for Cursor, Devin or
Hermes is asking for something already covered by link resolution. The uncovered agent surface is Pi.

### F7. Codex's derivation is lossy in one direction, by design

`.codex/SYNC.md:123`: "`sandbox_mode`, `model` and `model_reasoning_effort` cannot round-trip back to
`.opencode/agents/`. Codex is a one-way derivation." Anything relying on those fields in a Codex
session comes from Codex's own config, not the mirrored agent.
[SOURCE: file:.codex/SYNC.md:123]

## Sources Consulted

- `file:.opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs:5-35`
- `file:.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs:88-118,209-220`
- `file:.opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs:16-46,79-81`
- `file:.opencode/scripts/git-hooks/pre-commit:87-104,147-155`
- `file:.github/workflows/agent-mirror-sync.yml`, `file:.github/workflows/spec-kit-check.yml:142-148`
- `file:.codex/SYNC.md:20,25,123`; `file:.pi/SYNC.md:8,16,26`; `file:.devin/SYNC.md:29`; `file:.claude/SYNC.md:83`
- Shell: agent-tree listings and counts; per-name body diff with path normalization;
  `check-agent-mirror-sync.cjs --all`; a `node -e` computation using the gate's own exported
  `extractAgentBody`/`compareBodyTokens`.

## Assessment

`newInfoRatio: 0.85` — The charter's fact 3 ("all seven runtimes carry an `agents/` directory") is
confirmed and superseded: the surfaces exist, they are in sync under the gate (observed), and the
gate's actual comparison rule is a token-set equality whose blind spot has a live instance in the
repository. Also new: the 12-versus-13 roster count, the two-upstream naming collision, Pi as the only
ungated generated agent tree, and the change-scoped nature of both gate executions.

Confidence: **high**. The load-bearing claims here were produced by running the checker and by
computing with the gate's own exported functions, not by reading them — F3 is an exit-0 observation
and F4's token counts (1188/1188) are measured.

## Reflection

Worked: refusing to stop at "the pair differs" and "the pair passed". Those two observations
contradicted each other, and the resolution — that a semantic rewrite can preserve a token set — was
only visible by running the gate's own tokenizer against the real bodies. That turned a suspected
false negative into a demonstrated one with a live instance.

Failed: the body-diff pass first classified `deep-research` as plain "drift", which the checker then
disproved. The lesson is recorded: a byte diff and a gate verdict answer different questions, and a
token-set gate answering "in sync" is not the same claim as "the bodies say the same thing".

Ruled out: recommending an agents content gate for Cursor, Devin or Hermes. Their trees are symlinks;
link resolution is the correct check and it already exists.

## Recommended Next Focus

Iteration 6: Generator coverage — for every mirror, generated versus hand-maintained; for each
generated one, `--check` existence and gate wiring; for each hand-maintained one, the drift already
present and what a generator would cost. Carry forward the four confirmed unwired `--check` modes
(`pi/sync-agents-pi.cjs`, `pi/sync-prompts-pi.cjs`, `hermes/sync-prompts-hermes.cjs`,
`hermes/sync-skills-hermes.cjs`), the sixth pre-commit-vs-CI difference (`sync-gate1-pointers.cjs --check`
runs in CI only), and the hand-maintained set already named across iterations 1–5 (`.devin/hooks.v1.json`,
`.mcp.json`/`mcp_config.json`, `.cursor/hooks.json`, `.codex/hooks.json`, `.codex/config.toml`,
`.codex/AGENTS.md`, `.cursor/rules/skill-routing.md`).
