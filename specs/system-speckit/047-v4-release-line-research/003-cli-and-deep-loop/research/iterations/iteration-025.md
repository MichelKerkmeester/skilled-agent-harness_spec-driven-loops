# Iteration 025 — `/deep` command flag bindings and deep-loop hub routing agreement

## Focus

Unread ground, closing the run: (1) every flag documented by the three `/deep` command
docs, checked against what `*-auto.yaml` and `fanout-run.cjs` actually parse, and the
reverse (flags the runner reads that no doc names); (2) agreement between
`hub-router.json`, `mode-registry.json` and `ROUTER.md` on modes, aliases and versions.
Registry projection findings already recorded in iterations 5–10 are not repeated; only
the three-way agreement asked for here is new.

## Actions Taken

1. Enumerated every documented flag in `.skilled/commands/deep/research.md` (line 3
   argument-hint, line 97 workflow-input list, lines 113–123 table), `review.md`
   (3, 70, 84–95) and `ai-council.md` (4, 69, 83–89), then grepped each flag across the
   matching `*-auto.yaml` and `runtime/scripts/fanout-run.cjs`.
2. Read `fanout-run.cjs`'s `parseArgs` (line 95) and its optional-number readers
   (lines 127, 3327–3332) to settle kebab-vs-camel binding; read the fan-out argv
   builder at `deep-research-auto.yaml:225–232` to see which flags the auto flow threads.
3. Diffed `ROUTER.md` §3 `INTENT_SIGNALS` keywords (lines 65–67) against
   `hub-router.json` `vocabularyClasses` and `mode-registry.json` `modes[].aliases`,
   order-insensitively, and compared all three `version` fields.
4. Grepped `deep-ai-council-auto.yaml` for its declared inputs and for any consumer of
   `executor.mode`; grepped `runtime/tests` + `shared` for a `ROUTER.md` version validator.

## Findings

### f-iter025-001 — drift, P2: the flags table and the "workflow inputs" list disagree in all three command docs

`research.md:116` documents `--convergence-mode` (`default|off|sliding-window|divergent`),
but the same file's enumeration of workflow inputs at `research.md:97` omits it, as does
the `argument-hint` at `research.md:3`. The twin is `review.md:87` documented against
`review.md:70` and `review.md:3`. The council doc repeats the shape once:
`ai-council.md:88` documents `--executor-mode` while `ai-council.md:69` and `ai-council.md:4`
omit it. Downstream both flags are live — `deep-research-auto.yaml:232` passes
`--convergence-mode {convergence_mode}`, `deep-review-presentation.txt:116` maps
`--convergence-mode` to `antiConvergence.convergenceMode`, and
`deep-ai-council-presentation.txt:70` maps `--executor-mode` to `executor.mode` — so the
omission is documentation lag in the enumeration, not a dead flag. An operator reading
only the enumeration builds an argv that silently drops the flag's value and gets the
default policy instead.

- Release: v4.0.0.x (`--convergence-mode` per `deep-review-confirm.yaml:752`).
- Confidence: high on the omission (three docs, both sides read); medium on the operator
  impact (the presentation table still parses the flag if argv carries it).
- Verify: `rg -n -- '--convergence-mode' .skilled/commands/deep/research.md` → hits at
  116 only; `rg -n -- '--executor-mode' .skilled/commands/deep/ai-council.md` → 88 only.
- [SOURCE: .skilled/commands/deep/research.md:97] [SOURCE: .skilled/commands/deep/research.md:116]
  [SOURCE: .skilled/commands/deep/ai-council.md:88]

### f-iter025-002 — drift, P1: `--lineage-timeout-hours` is documented and implemented, but no auto flow ever passes it

`research.md:117`/`research.md:132` and `review.md:88`/`review.md:105` document the flag as
the only way to cap a lineage below the 4-hour ceiling. `fanout-run.cjs:3330` reads it
(`parseOptionalNumber(args, 'lineageTimeoutHours')`), `fanout-run.cjs:1809` enforces the
hard maximum, and `fanout-run.vitest.ts:2935` tests the rejection path. But the fan-out
argv builder in `deep-research-auto.yaml:225–232` threads `--spec-folder`, `--loop-type`,
`--research-topic`, `--fanout-config-json`, `--base-artifact-dir`,
`--convergence-threshold`, `--stop-policy` and `--convergence-mode` — and not this flag;
no `lineage_timeout` / `lineageTimeout` token exists anywhere under
`.skilled/commands/deep/assets/*-auto.yaml`. The same is true of the review twin, whose
argv carries `--review-focus` (`deep-review-auto.yaml:231`) and `--stop-policy`
(`deep-review-auto.yaml:235`). So the only documented control over lineage wall-clock is
unreachable from either command: every run keeps the 4h ceiling, and the "pass a lower N
to cap a lineage more tightly" instruction at `review.md:105` cannot be executed.

- Release: v4.0.0.x (ceiling assertion path).
- Confidence: high — absence evidenced by grep over both auto assets plus the read argv
  builder; the flag is reachable only by invoking `fanout-run.cjs` by hand.
- Verify: `rg -n 'lineage[-_]?[Tt]imeout' .skilled/commands/deep/assets/*-auto.yaml` → 0.
- [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3330]
  [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:232]
  [SOURCE: .skilled/commands/deep/review.md:105]

### f-iter025-003 — drift, P2: `ROUTER.md` is 16 minor versions behind the two JSON routers it documents

`ROUTER.md` frontmatter carries `version: 1.6.7.0` and a description that still pins its
origin to `shared/references/smart-routing.md (v1.0.0.0)`, while
`hub-router.json` `version` and `mode-registry.json` `version` are both `1.6.23.0`.
The doc is the human contract the two machines are supposed to mirror, and nothing
compares them: `rg -l 'ROUTER.md'` over `runtime/tests` and `shared` returns exactly one
file (`fanout-run.vitest.ts`), and no version-equality assertion appears in it. Modes and
aliases agree (see f-iter025-004); only the version string and the origin paragraph have
decayed.

- Release: carried from the ROUTER relocation; last touched before 1.6.8.0.
- Confidence: high on the numbers; unknown whether any consumer reads the frontmatter
  version at all (no reader found).
- Verify: `rg -n '^version:' .skilled/skills/system-deep-loop/ROUTER.md` → 1.6.7.0;
  `rg -n '"version"' .skilled/skills/system-deep-loop/{hub-router,mode-registry}.json`.
- [SOURCE: .skilled/skills/system-deep-loop/ROUTER.md:8]
  [SOURCE: .skilled/skills/system-deep-loop/hub-router.json:3]
  [SOURCE: .skilled/skills/system-deep-loop/mode-registry.json:3]

### f-iter025-004 — drift, P2: `mode-registry.json` `aliases` is a strict subset of the router vocabulary — 18 of 36 keys missing

`ROUTER.md` §3 `INTENT_SIGNALS` (lines 65–67) and `hub-router.json`
`vocabularyClasses` agree exactly, order-insensitively, on all three modes: 11 research
keywords, 16 review keywords, 9 ai-council keywords. `mode-registry.json`'s
`modes[].aliases` arrays hold 6, 7 and 5 — every one present in the router set, so the
direction is one-way: the registry is missing 18 router keywords (`deep research`,
`research summary`, `iterative investigation`, `investigate why`, `research convergence`;
`deep review`, `before running deep review`, `review request`, `release readiness`,
`deep review of`, `iterative review`, `severity findings`, `review convergence`,
`audit the diff`; `ai council`, `council deliberation`, `multi-seat`, `seat diversity`)
and invents none. Two of the registry's `legacyAliases` entries for ai-council
(`@deep-ai-council`, `multi-ai-council`) appear in neither router file, which is
legitimate for an advisor-facing projection. Consequence: the alias set is authored in
three places, and the registry copy has silently fallen a third behind — the concrete
shape of the "generate all three from `ROUTER.md` §3" extension proposed in earlier
iterations, now with an exact 18-key delta to reconcile.

- Release: v4.0.1.0 hub canon.
- Confidence: high (three files read in full, compared set-wise).
- Verify: diff the three keyword arrays programmatically; expect 18 registry-side misses
  and 0 router-side misses.
- [SOURCE: .skilled/skills/system-deep-loop/ROUTER.md:65]
  [SOURCE: .skilled/skills/system-deep-loop/hub-router.json:53]
  [SOURCE: .skilled/skills/system-deep-loop/mode-registry.json:113]

### f-iter025-005 — improvement, P2: the council auto variant declares `executor.mode` and never reads it

`deep-ai-council-auto.yaml:25` declares the input `mode: "[in-cli|external-cli] - Default:
in-cli."`, `ai-council.md:88` documents `--executor-mode` as binding `executor.mode`, and
`deep-ai-council-presentation.txt:70` maps the flag to that field. Grepping the whole
auto asset for `executor.mode`/`executorMode`/`in-cli`/`external-cli` returns line 25 only
— no step branches on it, and the required-values gate at line 111 lists `executor` but
not `executor.mode`. This is the missing half of the iteration-16 question "is any
model-executed step contractually required to supply an in-cli `dispatchSeat`": the YAML
layer cannot tell an in-cli deliberation from an external spawn, so the declared default
`in-cli` is documentation rather than a binding. Adding one branch (or a
`required_values_present` entry on `executor.mode`) would make the distinction real.

- Release: v4.0.1.0 (council mode).
- Confidence: medium-high — absence is grep-proven in the asset; a consumer could exist in
  a leaf reference outside the three files read.
- Verify: `rg -n 'executor\.mode|in-cli' .skilled/commands/deep/assets/deep-ai-council-auto.yaml`
  → line 25 only.
- [SOURCE: .skilled/commands/deep/assets/deep-ai-council-auto.yaml:25]
  [SOURCE: .skilled/commands/deep/assets/deep-ai-council-presentation.txt:70]

### Ruled out this iteration

`ruled_out` — direction "fanout-run.cjs rejects the documented kebab-case flags (camel/snake
mismatch)". `parseArgs` at `fanout-run.cjs:98` camel-cases every `--kebab-flag` before the
lookup, so `--lineage-timeout-hours`, `--review-focus`, `--convergence-mode` and
`--no-resource-map` all bind to their camel keys. No naming defect exists; f-iter025-002
rests on the flag never being passed, not on it being misnamed.

## Questions Answered

- UX question, partly: the flag documentation itself is where the operator-visible
  contradictions live. f-iter025-001 (three docs whose enumeration contradicts their own
  table) and f-iter025-002 (a documented cap the command cannot pass) are both
  "unclear/contradictory for the operator" instances, and both are cheap to fix at the
  source document. The `cli-*/SKILL.md` dispatch half of that question remains unexamined.

## Questions Remaining

- Hub canon under `package_skill.py --strict` across the hub and its three modes — carried
  to the ceiling again. f-iter025-003 adds a concrete, separate conformance gap
  (`ROUTER.md` version) but the packaging check itself was not run.
- Mid-run executor failure (devin `resource_exhausted`, builder throw) — still unread
  across the whole run; only the pre-spawn refusal path is evidenced.
- `--executors=<json>` is named by `research.md:122`, `review.md:94` and
  `review-presentation.txt:85`, and appears in neither auto YAML nor `fanout-run.cjs`
  (which reads `--fanout-config-json` instead). Whether the presentation folds it into
  `fanoutConfigJson` was not verified — the last unbound documented fan-out surface.
- `--pure` validity for the installed OpenCode; unknown-token `{...}` render policy.
- The three `*-presentation.txt` assets: `deep-research-presentation.txt` was spot-read
  (flag table, config shape), `deep-ai-council-*` and `deep-review-*` only grepped.

## Next Focus

The run is at its iteration ceiling. The cheapest remaining closures, in order:
(1) `--executors` binding in the presentation config step, which would either retire the
last documented-but-unbound flag class or confirm it;
(2) run `package_skill.py --strict` across `system-deep-loop` plus its three packets, the
only unexplored hub-canon check;
(3) one fixture run of a CLI lineage against an exhausted quota, to close the
executor-failure question carried since iteration 3.
