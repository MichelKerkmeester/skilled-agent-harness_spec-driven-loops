# Deep Research: What the `cli-mistral-vibe` deep-loop executor kind adds

> Lineage `oc-1` · session `fanout-oc-1-1794674533742-754r50` · 1 iteration · stop reason `max_iterations`

---

## 1. ANSWER

The `cli-mistral-vibe` executor kind makes Mistral Vibe a first-class deep-loop executor, so a fan-out run can name Vibe beside any other kind and get an independent lineage instead of the "no executor kind names Vibe" gap the phase opened with. It adds a deliberately narrow kind row — `model`, `timeoutSeconds` and `liveTools` only, no `reasoningEffort` because Vibe has no reasoning flag, and no sandbox support so a sandbox request fails closed — closed to a two-alias model allowlist (`deepseek-flash`, `glm-flash`). It adds a fan-out adapter that preflights the binary, pins `vibe --version` to `3.1.2`, refuses an off-roster model, and runs each lineage from a lineage-local `VIBE_HOME` seeded from `.vibe/config.toml` with its own trust store and `--output-dir`. It adds an audit posture that passes `VIBE_*` and `MISTRAL_API_KEY` while denying an inherited `VIBE_HOME`, and that detects recursion on `vibe`, `vibe-rs` and `vibe-app-server`. And it adds export-record scoring: a Vibe lineage counts as success only when the process exits 0 and `export.json` records `exit_code` 0 with `outcome` `finished`, with exit 3 recorded as `partial` rather than success.

---

## 2. FINDINGS

1. `cli-mistral-vibe` is a member of `EXECUTOR_KINDS`, so a fan-out run can name Vibe as an executor kind and get an independent lineage. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:20]
2. The kind's capability surface is narrow: `model`, `timeoutSeconds`, `liveTools`; no `reasoningEffort`; no sandbox support, so a sandbox request fails closed. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:141]
3. Model selection is closed by `VIBE_SUPPORTED_MODELS = ['deepseek-flash', 'glm-flash']`, enforced by `isVibeSupportedModel` and in config validation. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:301]
4. `buildVibeLineageCommand` preflights the binary, probes `vibe --version` in a throwaway home, refuses any version other than `3.1.2` and any off-roster model, and runs with a lineage-local `vibe-home`, `--output-dir`, `--trust` and `--auto-approve`. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3154]
5. The audit layer passes `VIBE_`-prefixed variables and `MISTRAL_API_KEY`, denies an inherited `VIBE_HOME`, registers `VIBE_HOME` as lineage state with `.vibe` as default home, and detects recursion on `vibe`, `vibe-rs` and `vibe-app-server`. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:77]
6. Vibe lineages are scored from `export.json`, not stdout or exit status alone: success requires exit 0 plus a record with `exit_code` 0 and `outcome` absent or `finished`; exit 3 with a record is `partial`; everything else is `failure`. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3126]
7. The kind is wired into the loop surface: `LINEAGE_COMMAND_ADAPTERS` registers the adapter, and both deep-loop workflow YAMLs carry an `if_cli_mistral_vibe` branch that fails closed with exit 2 for a single-executor run. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1223]
8. The kind ships with conformance coverage: a stress fixture pins the argv shape, clean-exit success, exit-3 partial and fail-closed exit 3 without an export record, and the adapter matrix manifest registers the kind. [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-mistral-vibe.vitest.ts:154]

---

## 3. CONVERGENCE REPORT

| Field | Value |
|---|---|
| Stop reason | `max_iterations` (config.maxIterations = 1) |
| Iterations completed | 1 |
| Questions answered | 1 of 3 |
| Average newInfoRatio | 0.90 |
| Corruption warnings | 0 |

---

## 4. OPEN QUESTIONS

- What isolation and scoring guarantees does a Vibe lineage get that no existing executor kind provides? Partially answered; a field-by-field comparison against `cli-deepseek-harness` remains open.
- Which runtime surfaces change when the kind is added? Answered in substance by findings 1-8, but the strategy question was scoped to the kind's contribution and is left unticked.

---

## 5. RECOMMENDED NEXT FOCUS

Diff the `cli-mistral-vibe` rows against `cli-deepseek-harness` in `executor-config.ts` and `executor-audit.ts` to separate Vibe-specific guarantees — export-record scoring, the two-name recursion guard, the `3.1.2` version pin — from the shared fan-out adapter boilerplate.
