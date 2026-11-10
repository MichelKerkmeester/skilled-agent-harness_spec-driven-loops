# Iteration 10: Constraints, differences and the phase plan

## Focus

Angle 10: where the harness costs more or less than Pi — dependencies, startup, telemetry,
release-candidate versioning, background services and cost per run — which constraints need a hard
rule in the skill packet, and the recommended phase plan for 002 and later with what stays `UNKNOWN`
until a live contract pin.

## Actions Taken

- Read the installed package metadata and measured two startup paths.
- Read the base telemetry row and the `subprocess-local` dependency chain behind the skipped install
  scripts.
- Compared the harness's dispatch, sandbox and exit contract with `cli-pi`'s.
- Assembled the hard-rule list and the phase plan from all ten angles.

## Findings

1. The installed package requires Node `>=24.9.0`, declares 90 dependencies and ships 319
   `@deepseek-ai/dsh-*` packages in a 896 MB install; its version is `0.2.2-rc.1`, the npm `latest`
   tag, so the runtime is a release candidate with no stability promise across rc bumps.
   [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@deepseek-ai/dsh/package.json:1]
   [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/resource-map.md:27-31]
2. Startup is cheap for the launcher and moderate for a profile: `dsh --version` measured 0.07 s and
   `dsh headless --help` 1.16 s on this machine, the latter booting the profile without a model
   request. A real dispatch adds provider latency on top; the number to pin is the full
   "task to final answer" time, not the launcher.
   [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/research/lineages/deepseek/.events/smoke-1.stderr]
3. Base mounts `session-telemetry-otel` in `FEEDBACK_ONLY` mode with a default collector URL
   (`https://dsh-otel-collector.deepseeksvc.com/v1/logs`). No telemetry leaves the process without an
   explicit feedback event, and a headless dispatch has no feedback channel, so the default is
   effectively silent. A hard guarantee still needs the row disabled or `DSH_TELEMETRY_MODE=DISABLED`
   in the lineage patch. [SOURCE: dsh-src/packages/bundle/base/cordis.patch.yml:218-228]
   [SOURCE: dsh-src/packages/session/session-telemetry-otel/README.md:12-26]
4. Base mounts `subprocess-local`, which declares both `node-pty` and `koffi`, and npm skipped the
   install scripts for both. Headless mounts no terminal and needs no PTY, so the dispatch shape
   itself does not require them; whether the `bash` tool's spawn path is affected by the skipped
   `koffi` build is `UNKNOWN` until a live tool call. [SOURCE: dsh-src/packages/bundle/base/cordis.patch.yml:234-235]
   [SOURCE: dsh-src/packages/subprocess/subprocess-local/package.json:1]
5. On cost, the harness adds no billing layer: token accounting is local, and the route bills at the
   gateway's own per-token rate, the same rate Pi pays for the same model. The extra cost is
   footprint (896 MB, Node 24.9+), profile boot per lineage and an rc upgrade cadence, not a markup.
   [SOURCE: dsh-src/packages/llm/token-meter/README.md:12]
6. The harness is ahead of Pi on four dispatch-relevant contracts: a deterministic two-value exit
   status, a machine-readable NDJSON stream with `final.reason`, a real per-subprocess sandbox that
   fails closed when no backend exists, and native goal, subagent, workflow, skill and MCP services.
   It is behind on per-dispatch model selection, prompt templates, agent files, project plugins and
   compaction-hook coverage. [SOURCE: dsh-src/packages/sandbox/sandbox/README.md:12]
   [SOURCE: dsh-src/packages/bundle/headless/README.md:136]
7. The packet needs these hard rules: `headless-dash-stdin-required`, `route-patch-required`
   (no `--model`; one checked-in patch per route), `approval-never-required`,
   `headless-only`, `dsh-home-isolated`, `goal-plan-disabled`, `json-exit-classification`,
   `telemetry-disabled`, `profile-version-check` and `route-compat-pinned`
   (`supportsDeveloperRole: false`, `thinkingFormat: deepseek` for both gateways).
   [SOURCE: dsh-src/docs/cli-help.md:100-132]
   [SOURCE: dsh-src/packages/bundle/headless/README.md:92]
   [SOURCE: dsh-src/packages/bundle/base/cordis.patch.yml:218-228]
8. The recommended phase plan, ranked by dependency:

| Rank | Phase | Outcome | Depends on | Risk | Mode | Required | Failure prevented |
|---|---|---|---|---|---|---|---|
| 1 | 002 live contract pin | One keyed headless write dispatch; verbatim stdout/stderr/exit; `--json` parse; bash and sandbox behavior | operator key | sandbox backend missing; skipped native builds | `sk-code` verify | required | building a mode on documentation only |
| 2 | 003 `cli-deepseek` skill packet | SKILL, ROUTER, hard rules, references, assets, prompt card | 002 | rule drift from observed behavior | `sk-doc` create-skill | required | ad-hoc dispatch composition |
| 3 | 004 executor kind and builder | `executor-config` tables, builder, audit, unit tests | 002 | route patch not applying; stdin misuse | `sk-code` implement | required | fan-out with unverified provenance |
| 4 | 005 `.dsh/` runtime folder | route patches, hooks config, MCP patch, SYNC, skill-link generator | 003, 004 | symlink farm misses skills | `sk-code` implement + `sk-doc` create-readme | required | configuration drift |
| 5 | 006 hub and routing registration | mode registry, hub files, advisor, doctor manifest, compiled fixtures | 003 | an unroutable eighth mode | `sk-doc` create-readme + `sk-code` tests | required | profile that cannot be selected |
| 6 | 007 command and agent bridges | prompt templates, persona patch, goal-context bridge | 005 | personas truncated or unreachable | `sk-doc` create-command/create-agent | required for parity, optional for fan-out | reinventing commands per dispatch |
| 7 | 008 hook bridge and repo guards | rewritten hooks config, `repo-guards` bundle, task-dispatch adapter | 005 | bridge package not installable | `sk-code` implement | optional | losing the repo's guard layer |
| 8 | 009 MCP translation | `.dsh/mcp.yml`, code-mode row, route guard matcher | 005 | scrubbed env or eager startup | `sk-code` implement | optional | MCP absence or leakage |
| 9 | 010 benchmark and playbook | manual-testing-playbook scenarios and a benchmark index | 002-009 | unverified claims | `sk-doc` create-benchmark | optional | claims without a live witness |
| 10 | 011 propagation and generated surfaces | trigger index, doctor manifest, sk-doc manifests, changelog | 006 | stale generated index | `sk-code` implement | required before merge | routing to a packet that does not exist |
| 11 | 012 re-pin on rc bump | refreshed contract pin and roster | 002 | silent rc breakage | `sk-code` verify | required per bump | an rc change breaking dispatch unnoticed |

  [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:11]
  [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json:1029]
9. What stays `UNKNOWN` until a configured key: whether a `--patch` overlay actually repoints
   `agent-default-model` in headless; whether LLM Gateway accepts the `thinkingFormat: deepseek`
   reasoning shape and reports `max`; whether the `bash` tool works after the skipped `koffi` and
   `node-pty` builds; whether a skill-link farm loads all 57 entries in one session; whether the
   Claude hook bridge installs from npm and fires with rewritten matchers; whether code-mode MCP
   connects under the scrubbed env; the real startup-plus-model latency; the per-run cost; and
   whether telemetry stays silent in `FEEDBACK_ONLY` on a headless exit.
   [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/resource-map.md:27-32]

## Ruled Out

- Treating the harness as cheaper than Pi per run: same gateway rate, larger footprint.
- Relying on `FEEDBACK_ONLY` as a telemetry hard rule: only `DISABLED` guarantees no export.
- Building the executor kind before the keyed contract pin: the patch and stdin behavior are the
  two risks that invalidate the builder.

## Dead Ends

- Looking for a harness-side billing or cost table: token accounting is local and route pricing stays
  with the gateway.

## Edge Cases

- Ambiguous input: "cost per run" could mean dollars or latency; both are addressed, and each is
  `UNKNOWN` in absolute terms until a live call.
- Contradictory evidence: the base policy default is `read-only` while the headless sandbox row
  defaults to `workspace-write`; the headless override is the one that governs a dispatch.
- Missing dependencies: no key, so the nine `UNKNOWN` items stay open.
- Partial success: footprint, startup and telemetry are measured or source-confirmed; cost and
  latency are not.

## Sources Consulted

- `/Users/michelkerkmeester/.local/lib/node_modules/@deepseek-ai/dsh/package.json:1`
- `dsh-src/packages/bundle/base/cordis.patch.yml:218-235`
- `dsh-src/packages/session/session-telemetry-otel/README.md:12-26`
- `dsh-src/packages/subprocess/subprocess-local/package.json:1`
- `dsh-src/packages/sandbox/sandbox/README.md:12`
- `dsh-src/packages/bundle/headless/README.md:92,136`
- `dsh-src/packages/llm/token-meter/README.md:12`
- `dsh-src/docs/cli-help.md:100-132`
- `resource-map.md:27-32`
- Live `dsh --version` (0.07 s) and `dsh headless --help` (1.16 s) timings
- The smoke stderr recorded in iteration 1

## Assessment

- New information ratio: 0.85 (five fully new footprint, telemetry and cost findings, two synthesis
  findings that turn nine angles into rules and phases, two that restate measured contract facts)
- Questions addressed: Angle 10 constraints, differences, hard rules and phase plan
- Questions answered: Where does the harness cost more or less than Pi, what hard rules follow, and what is the phase plan?

## Reflection

- What worked and why: measuring the two startup paths separated launcher cost from profile cost, and
  reading the telemetry row turned "does it phone home" into a mode question with a concrete patch.
- What did not work and why: the skipped install scripts cannot be tested without a model call, so
  the honest output is an `UNKNOWN` tied to a named phase rather than a guess.
- What I would do differently: collect the package metadata in iteration 1, since the Node floor and
  install size shape every later recommendation.

## Recommended Next Focus

The ten angles are complete. Synthesis consolidates the findings, the hard rules and the phase plan
into the lineage's `research.md`, with the `UNKNOWN` list preserved as open questions.

## SCOPE VIOLATIONS

- One measurement redirect wrote `/tmp/dsh-help-time.txt` while timing `dsh headless --help`. It is a
  process artifact, not a research target, and it was not removed because the containment contract
  bans `rm` against any path. Recorded here rather than hidden; no repository file outside the
  lineage and no harness file was touched.
