# Iteration 7: Angle 7 — deep-loop executor support

## Focus

What a `cli-mistral-vibe` executor kind would need in the deep-loop runtime: the command builder, the environment allowlist, a closed model roster, dispatch-audit recognition and stress coverage.

## Actions Taken

1. Read the executor kind tuple, the per-kind flag-support table and the preventive-sandbox capability table (`executor-config.ts`).
2. Read the model-roster pattern for the four kinds that carry one (Pi, DSH, Cursor, Devin).
3. Read `LINEAGE_COMMAND_ADAPTERS` and one full adapter (`buildPiLineageCommand`) as the command-builder template.
4. Read `finalizeLineageCommand` for the effective-config and fail-closed rules.
5. Read the environment allowlist and the recursion guard in `executor-audit.ts`.
6. Read the stress-test layout and the branch-contract test that enforces a workflow branch per kind.

## Findings

1. `EXECUTOR_KINDS` is a closed eight-entry tuple (`native`, `cli-codex`, `cli-claude-code`, `cli-opencode`, `cli-cursor`, `cli-devin`, `cli-pi`, `cli-deepseek-harness`). Adding a kind means three table edits in this file: the tuple, `EXECUTOR_KIND_FLAG_SUPPORT`, and `EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY`. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:11-21]

2. Flag support is per-kind and enforced: a field a kind does not declare is rejected by the unsupported-field scan rather than silently ignored. Vibe's own surface says `cli-mistral-vibe` should declare `model`, `timeoutSeconds` and `liveTools`, and must **not** declare `reasoningEffort` — Vibe has no reasoning-effort CLI flag — which makes it behave like `cli-cursor` and `cli-devin`, where the tier is baked into the model id. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:111-139]

3. A closed model roster is a module-level constant plus a predicate (`PI_SUPPORTED_MODELS` / `isPiSupportedModel`, and the same shape for DSH, Cursor and Devin), with a default model and a provider mapping where the CLI needs one. `cli-mistral-vibe` needs `VIBE_SUPPORTED_MODELS`, `VIBE_DEFAULT_MODEL` and `isVibeSupportedModel`. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:227-278]

4. The command builder is a frozen `LINEAGE_COMMAND_ADAPTERS` map from kind to adapter; an absent entry throws `Unknown fan-out executor kind` before any dispatch. Each adapter follows the same five steps: PATH preflight, model allowlist check, provider/selector mapping, argument assembly, then `finalizeLineageCommand`. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3099-3118]

5. `finalizeLineageCommand` builds `effectiveConfig` and an `invocationFingerprint`, and it fails closed when a kind cannot honor a requested sandbox mode — the `cli-opencode` precedent rejects anything but `danger-full-access` with an explicit error rather than downgrading. Vibe exposes no OS-level confinement flag, so `cli-mistral-vibe` must take the same fail-closed path. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2280-2314]

6. The environment allowlist is three-layered: a common set (`PATH`, `HOME`, `LANG`, `TMPDIR`, `NODE_PATH`, `TERM`, `USER`, `LOGNAME`, `__CF_USER_TEXT_ENCODING`, `SYSTEM_SPEC_GATE_ENFORCE`, `AI_SESSION_CHILD`), per-kind exact keys, and per-kind prefixes. `cli-mistral-vibe` needs the `VIBE_` prefix (which covers `VIBE_HOME` and `VIBE_CWD`) **plus** `MISTRAL_API_KEY` as an explicit key, because that name carries no `VIBE_` prefix and the child would otherwise start unauthenticated. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:121-177]

7. Dispatch-audit recognition runs through `runAuditedExecutorCommand`: it validates the dispatch against the recursion guard, writes an INTENT receipt before spawn and a COMPLETION countersign after, and spawns with the filtered environment. The recursion guard combines a dispatch-stack environment variable with an ancestor-process walk (`/proc` on Linux, `ps` on macOS) that matches the executable's basename — so both `vibe` and the `vibe-rs` binary it execs must be recognised, or a leaf could re-dispatch itself undetected. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1198-1223]

8. Stress coverage is a per-kind file under `tests/stress/cli-adapter/` plus a shared `live-contracts.json` and `matrix-manifest.ts`, and `executor-branch-contract.vitest.ts` fails the build when a non-native kind has no `if_cli_*` branch in all four deep-loop workflow YAMLs. [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/executor-branch-contract.vitest.ts:1-40]

9. The inline research YAML carries explicit branches only for `native`, `cli-claude-code`, `cli-opencode` and `cli-codex`; `cli-cursor`, `cli-devin`, `cli-pi` and `cli-deepseek-harness` are handled by the shared fan-out adapters. A `cli-mistral-vibe` single-executor run therefore needs either a new inline branch or the documented fan-out-only path. [SOURCE: .skilled/skills/system-deep-loop/deep-research/SKILL.md:92-95]

## Ruled Out

- Declaring `reasoningEffort` for `cli-mistral-vibe`: Vibe has no flag for it, and the unsupported-field scan would reject the config or the kind would silently drop it. The honest mapping is a model-level `thinking` setting in the generated Vibe config.
- Reusing the `cli-opencode` adapter with a different binary: the argument grammar differs on every axis (prompt delivery, output format, approval flags, limits).

## Dead Ends

- Confirming that `vibe-rs` is the process name the ancestor walk sees. The launcher `execvpe`s the binary, so the process image is `vibe-rs` while the command the operator typed is `vibe`. Both names must be in the guard's match set; a live dispatch would confirm which one appears, and none was in budget.

## Edge Cases

- Ambiguous input: "the command builder" could mean the adapter function or the `finalizeLineageCommand` envelope. Answered both, because a new kind needs one of each.
- Contradictory evidence: none.
- Missing dependencies: no `cli-mistral-vibe` code was written, so every requirement is read from the existing kinds rather than demonstrated. Marked as a requirement list, not a verified implementation.
- Partial success: the requirement set is complete and cited; the two open items are the process-name question and the inline-branch choice. Status `complete` for the angle.

## Sources Consulted

- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-branch-contract.vitest.ts`
- `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/`
- `.skilled/skills/system-deep-loop/deep-research/SKILL.md`

## Questions Answered

- What would a `cli-mistral-vibe` executor kind need in the deep-loop runtime: the command builder, the environment allowlist, a closed model roster, dispatch-audit recognition and stress coverage? — Answered as a nine-item requirement list.

## Questions Remaining

- Whether the ancestor-process guard sees `vibe` or `vibe-rs`, and therefore which basenames the match set needs.

## Assessment

- New information ratio: 1.0
- Questions addressed: Angle 7 (deep-loop executor support)
- Questions answered: 7 of 8 strategy key questions

## Reflection

- What worked and why: reading one complete adapter (`cli-pi`) instead of all eight. The adapters are deliberately uniform — preflight, roster, mapping, args, finalize — so one full example plus the shared finalizer gives the whole contract, and the per-kind differences live in the tables that were read separately.
- What did not work and why: looking for the env allowlist in `fanout-run.cjs`. It lives in `executor-audit.ts`, because the audit owns the spawn. Splitting the read across the two files cost a call but produced the more useful fact: the allowlist and the recursion guard are the same module.
- What I would do differently: start from the branch-contract test. It names, in executable form, exactly which files a new kind must touch, which is a better map than reading the implementation first.

## Recommended Next Focus

Angle 8: ACP and other integration seams — whether the Agent Client Protocol is a better dispatch surface than print mode for this repository, and what it would change in the fan-out.
