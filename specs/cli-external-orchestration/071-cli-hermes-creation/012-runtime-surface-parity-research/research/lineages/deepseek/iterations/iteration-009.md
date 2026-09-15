# Iteration 9: Drift Detection

## Focus

Is there a single gate that would notice a runtime falling behind on any surface? If several partial
gates exist, name each and its blind spot. Propose the cheapest detector that would have caught the
Devin command gap, and say what it would cost to run on every commit.

## Findings

### F1. There is no single gate. There are four automated entry points and one manual route.

| Entry point | Trigger | What it runs |
|---|---|---|
| `.opencode/scripts/git-hooks/pre-commit` | every commit | agent-mirror block (`:87-104`) + 6 mirror checkers (`:147-155`) |
| `.github/workflows/spec-kit-check.yml` | CI | the same 6 checkers **+** `sync-gate1-pointers.cjs --check` |
| `.github/workflows/agent-mirror-sync.yml` | PR to main | `check-agent-mirror-sync.cjs` over the PR range |
| `.github/workflows/command-tree-parity.yml` | CI | `validate-command-tree-parity.sh` |
| `/doctor runtime-mirrors` | manual, read-only | "Run the five mirror checkers plus the hook-adapter fallback health check → aggregate their verdicts → report per-surface drift" |

Seventeen other workflows exist (`.github/workflows/`), but they guard quality, not runtime parity:
`comment-hygiene`, `markdown-link-integrity`, `naming-standard-guard`, `skill-doc-frontmatter`,
`routing-registry-drift`, `rule-canary-sync`, `prompt-card-sync`, `advisory-checks`,
`repo-rules-corpus`, `strict-pass-freshness-report`, and others.
[SOURCE: shell `ls .github/workflows/` (19 entries)]
[SOURCE: file:.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml:3-7]

### F2. The widest coverage lives in the manual route, not in either automated gate

`doctor-runtime-mirrors.yaml` lists seven `upstream_assets`, and **two of them are never run by
pre-commit or CI**:

```yaml
  pi_agents: ".opencode/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs"
  pi_prompts: ".opencode/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs"
```

It also carries a per-host `hook_adapter_fallback_health_checks` table — one `file_exists` row per
adapter behind an `mkHookDrift` fallback chain in `.claude/settings.json`, `.cursor/hooks.json`,
`.devin/hooks.v1.json` and `.codex/hooks.json` — which is a *different* check from mirror structure: it
detects the degraded-adapter state a synthetic failure produces.
[SOURCE: file:.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml:28-40,44-46]

**The inverse of the usual assumption:** here the diagnostic is stronger than the gate. An operator who
runs `/doctor runtime-mirrors` sees Pi agent and Pi prompt drift that a commit would accept silently.

### F3. Gate-by-gate blind spots, collected from iterations 1–8

| Gate | Blind spot |
|---|---|
| `sync-runtime-mirrors.cjs --check` | symlink-tree shape only; says nothing about whether the runtime *loads* what the links point at |
| `codex/sync-agents.cjs --check`, `codex/sync-prompts.cjs --check` | Codex only |
| `agent-roster-mirror-check.cjs` | presence and link resolution only; independent surfaces (OpenCode, Codex, Pi) are checked for name coverage, never content |
| `check-agent-mirror-sync.cjs` | token-set equality, so a rewrite reusing existing vocabulary passes (iteration 5, live instance in `deep-research.md`); change-scoped in both executions |
| `command-catalog-mirror-check.cjs` | catalog and hub metadata only — a live 35-command tree that passes while a runtime mirror is missing entirely |
| `validate-command-tree-parity.sh` | command trees and their scope policy; **Devin has no entry**, and the policy file is consulted by generators rather than used to assert coverage |
| `sync-hook-registrations.cjs --check` | the four JSON registrations; not Pi's native extension layer and not Hermes's plugin |
| `sync-gate1-pointers.cjs --check` | one generated block in two files; absent from pre-commit |
| **Four `--check` modes invoked nowhere** | `pi/sync-agents-pi.cjs`, `pi/sync-prompts-pi.cjs`, `hermes/sync-prompts-hermes.cjs`, `hermes/sync-skills-hermes.cjs` (iteration 6) |
| **No gate at all** | strict-YAML frontmatter validity (iteration 8); Pi's hand-authored guard bridges (iteration 7); Hermes's scanner quarantine, 61 of 68 skills loadable (iteration 3); surface-level coverage for any runtime or surface |

**The structural gap:** every existing checker answers "is this mirror equal to its source?" None
answers "does this runtime have a mirror for every surface that should reach it?" A whole surface can
be absent — which is exactly what happened to Devin's 35 commands — and every gate passes.

### F4. Observed: the catalog checker is the one gate that states its canonical count, and it confirms 35

```
$ node .opencode/commands/doctor/scripts/command-catalog-mirror-check.cjs
canonical: .opencode/commands frontmatter (35 commands)
  OK   commands/README.txt                35/35 listed
  OK   commands/create/README.txt         12/12 listed
  OK   commands/speckit/README.txt         6/6 listed
  OK   sk-design/command-metadata.json     3 entries
  OK   sk-doc/command-metadata.json       12 entries
  OK   system-deep-loop/command-metadata.json 5 entries
STATUS=OK ... EXIT=0
```

This independently confirms iteration 1's correction (35 authored commands, not 46, not 39) and shows
the checkers' own prose can drift: the same file's header comment still says "the metadata covers 20 of
the 39 shipped commands", while its live output counts 35 and its metadata rows sum to 3 + 12 + 5 = 20.
[SOURCE: shell `command-catalog-mirror-check.cjs`, exit 0]
[SOURCE: file:.opencode/commands/doctor/scripts/command-catalog-mirror-check.cjs:17]

### F5. The cheapest detector that would have caught the Devin command gap

**A surface-coverage assertion table** — for every `(runtime × surface)` pair, require one of: a
present mirror, or a recorded exemption with a reason. The pattern already exists twice in this repo:

1. `agent-roster-mirror-check.cjs` is exactly this for one surface: it walks a canonical roster, asserts
   coverage per runtime, distinguishes symlink mirrors (must resolve to the canonical file) from
   independently-authored surfaces (presence only), and reports orphans in both directions.
   [SOURCE: file:.opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs:24-46,68-81]
2. `command-scope.cjs` already *is* the exemption registry for the command surface — `CANONICAL_MIRROR_EXCLUDES`
   and `RUNTIME_NATIVE_COMMANDS` are the two reasons a command is legitimately absent. It is consulted
   by generators to decide what to write, never by a checker to assert what must exist.
   [SOURCE: file:.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/command-scope.cjs:19-30]

So the detector is a generalization, not a new mechanism: one small table
(`runtime × surface → mechanism | exemption-reason`), one walk, exit 1 on an uncovered pair with no
recorded reason. For the command surface specifically it would have flagged "devin: commands → no
mirror, no recorded exemption" on the commit that removed it — and the *fix* at that moment would have
been a one-line exemption entry recording the operator directive, which is the outcome this report
actually wants.

**Cost:** the roster checker is a file-existence walk over seven directories and reports in
milliseconds; the pre-commit hook already runs six such node checkers in sequence. One more table-driven
walk is within the noise of the existing gate, and it needs no new dependency, no build, and no network.

**Second cheapest, and broader:** a strict-YAML frontmatter parse over every canonical agent and
command file (iteration 8's silent-drop class). It protects all seven runtimes' files at once because
the canonical files are what everyone mirrors, and the failure it catches is the only *silent* one
found in this research.

### F6. What "noticing" costs today versus what it would cost

| Detector | Would catch | Cost per commit |
|---|---|---|
| Surface-coverage assertion (F5) | any runtime missing a whole surface (the Devin class) | one file walk, ~ms |
| Strict-YAML frontmatter parse | files silently dropped by Devin's parser (the 12-of-36 class) | one parse per canonical file, ~ms |
| Wire the four existing `--check` modes | Pi agents/prompts, Hermes prompts/skills drift | four existing generators in check mode |
| Promote the doctor route's Pi checks into pre-commit | the same Pi drift, from the surface already written for it | editing one list |
| Semantic agent-body comparison | the `deep-research` instruction divergence token-set equality hides | not cheap — needs a review step, not a script |

The first three are additive and mechanical. The last one is the only entry on this list that a script
should not attempt.

## Sources Consulted

- Shell: `ls .github/workflows/`; `node command-catalog-mirror-check.cjs` (exit 0)
- `file:.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml:3-7,28-46`
- `file:.opencode/commands/doctor/scripts/command-catalog-mirror-check.cjs:1-40`
- `file:.opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs:24-46,68-81`
- `file:.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/command-scope.cjs:19-30`
- `file:.opencode/scripts/git-hooks/pre-commit:87-104,147-155`
- `file:.github/workflows/spec-kit-check.yml:142-148`, `agent-mirror-sync.yml`, `command-tree-parity.yml`

## Assessment

`newInfoRatio: 0.85` — The answer to "is there a single gate" is no, and the useful inversion is that
the manual `/doctor runtime-mirrors` route covers strictly more than either automated gate. New: the
structural gap (every checker asks "is this mirror equal?", none asks "does this surface exist here?"),
the observed 35-command confirmation from the catalog checker, and the discovery that the exemption
registry for commands already exists in `command-scope.cjs` but is wired to generators instead of to a
coverage assertion.

Confidence: **high** on F1, F2 and F4 (read plus one observed exit-0 run). **Moderate-to-high** on F5's
cost claim: it is grounded in the roster checker's actual structure and the hook's existing behaviour,
but the new detector was not written, so the per-commit cost is an estimate from the closest existing
analogue rather than a measurement.

## Reflection

Worked: asking what a gate *asks*, not what it checks. Enumerating the checkers gives a coverage map;
noticing that every one of them compares a mirror to its source, and none compares a runtime to its
expected surface set, is what produced the actionable finding — and it is the same question this
research was commissioned to answer, applied to the tooling rather than the runtimes.

Failed: nothing material, but one correction is logged — iteration 6 recorded `.opencode/commands/doctor/scripts/cmd-*`
coverage without noticing that the doctor route above it already runs the Pi checkers, so the claim
"four `--check` modes run nowhere" is true of automation and false of the repo as a whole. Corrected
here: they run nowhere automatically and everywhere manually.

Ruled out: recommending a script for the semantic-agent-drift class. That divergence needs a reviewer
who knows the instruction's meaning; a similarity score would either fire constantly or miss it.

## Recommended Next Focus

Iteration 10: Synthesis — rank every recommendation from iterations 1 to 9 by
`(operator impact × confidence) / cost`, group into do now / do next / do not with `file:line`
citations, then propose the phase decomposition: for each phase a name, a one-line scope, its
dependencies, and the gate that closes it. Produce the deliverables the charter names: the command
matrix, the surface parity table, the Devin boundary, the ranked list, and the phase plan.
