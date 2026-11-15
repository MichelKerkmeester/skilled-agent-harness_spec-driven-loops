# Iteration 1: What the `cli-mistral-vibe` deep-loop executor kind adds

## Focus

The dispatch question: in one short paragraph, what does the deep-loop executor kind
`cli-mistral-vibe` add? The selected interpretation is the **as-built** surface in this
checkout (phase 009 of the Mistral Vibe runtime build), not the phase plan's forward-looking
intent. Deferred alternative: a behavioural evaluation of the two roster models, which this
iteration does not attempt because the question asks what the *kind* adds, not how the models
perform.

## Actions Taken

1. Read the phase packet's `spec.md` to recover the declared scope, requirements and risks.
2. Located every non-spec file naming `cli-mistral-vibe` to establish the changed surface set.
3. Read the executor-kind registry rows (`EXECUTOR_KINDS`, flag support, sandbox and web-search
   rows, `VIBE_SUPPORTED_MODELS`, `isVibeSupportedModel`, the config validator).
4. Read the executor-audit rows (recursion names, state-dir table, default home, env prefix,
   env keys, env deny table).
5. Read `buildVibeLineageCommand` and the Vibe scoring helpers in `fanout-run.cjs`.
6. Confirmed the `if_cli_mistral_vibe` branch exists in both deep-loop workflow YAMLs and that
   the stress fixture and matrix manifest register the kind.

## Findings

1. The kind makes Mistral Vibe a first-class deep-loop executor: `cli-mistral-vibe` is a member
   of `EXECUTOR_KINDS`, so a fan-out run can name it beside any other kind and get an
   independent lineage instead of the "no executor kind names Vibe" gap the phase opened with.
   [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:20]
   [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind/spec.md:59]

2. Its capability surface is deliberately narrow: the kind accepts only `model`, `timeoutSeconds`
   and `liveTools`. It has no `reasoningEffort` field because Vibe has no reasoning flag — the
   effort pin lives on the roster row — and it declares no sandbox support, so a sandbox request
   fails closed rather than pretending to confine the process.
   [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:141]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:168]

3. Model selection is closed by an enforced two-alias allowlist, `VIBE_SUPPORTED_MODELS =
   ['deepseek-flash', 'glm-flash']`, checked by `isVibeSupportedModel` and rejected in config
   validation with a message naming the allowlist. A caller cannot route a Vibe lineage to an
   arbitrary Mistral model.
   [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:301]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:705]

4. The adapter `buildVibeLineageCommand` gives each lineage its own runtime state: it preflights
   the binary, probes `vibe --version` in a throwaway home, refuses any version other than
   `3.1.2`, refuses an off-roster model, then writes a lineage-local `vibe-home` seeded from
   `.vibe/config.toml` plus a `trusted_folders.toml` naming the resolved lineage directory, and
   runs `vibe --prompt-file … --output-dir <lineage>/vibe-output --trust --model … --auto-approve`
   with cwd set to the lineage.
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3154]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3200]

5. The audit layer admits Vibe without leaking operator state: `VIBE_`-prefixed variables and
   `MISTRAL_API_KEY` pass through, while an inherited `VIBE_HOME` is explicitly denied so the
   runner's per-lineage home wins, and `VIBE_HOME` is registered as lineage state with `.vibe` as
   the default home directory. Recursion is detected on `vibe`, `vibe-rs` and `vibe-app-server`.
   [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:77]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:174]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:199]

6. Vibe lineages are scored from the run's own export record rather than from stdout or exit
   status alone: `resolveVibeLineageOutcome` returns `success` only when the process exits 0,
   `export.json` exists, its `exit_code` is 0 and its `outcome` is absent or `finished`; exit 3
   with an export record is `partial`; everything else is `failure`. That is what separates a
   stopped-but-recorded Vibe run from a genuine success.
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3126]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3137]

7. The kind is wired into the loop surface, not just the runtime: `buildVibeLineageCommand` is
   registered in `LINEAGE_COMMAND_ADAPTERS`, and both `deep-research-auto.yaml` and
   `deep-review-auto.yaml` carry an `if_cli_mistral_vibe` branch that fails closed with exit 2
   when a single-executor run names Vibe, directing the caller to a fan-out invocation.
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3256]
   [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1223]
   [SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:1252]

8. The kind ships with its own conformance coverage: a stress fixture asserts the shipped argv
   shape, clean-exit success, exit-3 partial, and fail-closed exit 3 without an export record, and
   the adapter matrix manifest registers `cli-mistral-vibe` so the kind cannot silently drop out
   of the cross-kind matrix.
   [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-mistral-vibe.vitest.ts:154]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/matrix-manifest.ts:13]

## Questions Answered

- What does the deep-loop executor kind cli-mistral-vibe add?

## Questions Remaining

- Which runtime surfaces change when the kind is added — answered in substance by findings 1-8,
  but not ticked in this iteration because the run's iteration budget is one and the strategy
  question was scoped to the kind's contribution.
- What isolation and scoring guarantees does a Vibe lineage get that no existing executor kind
  provides — partially answered (lineage-local home, export-record scoring, two-name recursion
  guard); a cross-kind comparison against `cli-deepseek-harness` remains open.

## Ruled Out

- Reading the phase plan (`plan.md`) as the answer source: it states intended design, and the
  question asks what the kind *adds* in the code that exists. The plan was used only as
  cross-check, and the as-built code was preferred wherever the two could differ.
- Evaluating model quality of `deepseek-flash` / `glm-flash`: out of scope for a question about
  the kind's contribution.

## Dead Ends

- None. Every targeted surface existed and answered the question.

## Edge Cases

- Ambiguous input: the question admits a plan-intent reading and an as-built reading. Selected
  as-built; plan-intent deferred.
- Contradictory evidence: none found. The spec's REQ rows and the code agree on the flag set,
  the allowlist and the exit-3 handling.
- Missing dependencies: none. The `.vibe/config.toml` seed that the adapter requires exists in
  the checkout, so the adapter's precondition is satisfiable.
- Partial success: none.

## Sources Consulted

- specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind/spec.md
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs
- .skilled/commands/deep/assets/deep-research-auto.yaml
- .skilled/commands/deep/assets/deep-review-auto.yaml
- .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-mistral-vibe.vitest.ts
- .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/matrix-manifest.ts
- specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind/research/keyed-lineage-run/lineages/oc-1/steer.md (absent; no lead ruling to apply)

## Assessment

- New information ratio: 0.90
- Questions addressed: 3
- Questions answered: 1

## Reflection

- What worked and why: starting from the phase spec and then walking the exact files the spec's
  measured-behaviour row names meant every code read landed on a surface the phase actually
  changed, so eight findings came out of six targeted reads with no dead ends.
- What did not work and why: nothing failed. The only friction was that the lineage directory
  holds no config or strategy at start — phase_init had to author them before the gateway would
  accept a run-opening row, which is expected for a detached lineage.
- What I would do differently: with a second iteration, I would compare this kind field-by-field
  against `cli-deepseek-harness`, the closest existing kind, to isolate what is genuinely new
  about Vibe rather than what follows the shared adapter pattern.

## Recommended Next Focus

Cross-kind comparison: diff the `cli-mistral-vibe` rows against `cli-deepseek-harness` in
`executor-config.ts` and `executor-audit.ts` to separate Vibe-specific guarantees (export-record
scoring, two-name recursion guard, version pin) from the shared fan-out adapter boilerplate.
