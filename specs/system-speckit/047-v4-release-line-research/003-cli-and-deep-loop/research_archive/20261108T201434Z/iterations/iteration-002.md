# Iteration 002 — v4.0.2.0 DSH Rule Enforcement and v4.0.0.13 OpenCode Default

## Focus

1. Count the dispatch rules in `cli-deepseek-harness` and determine which ones the fan-out builder actually enforces.
2. Compare the DSH model ids and the pinned `dsh` version across `executor-config.ts`, `fanout-run.cjs` and the packet; verify the installed binary against the pin.
3. Check the v4.0.0.13 claim that `cli-opencode` defaults to `llmgateway/deepseek-v4.1-flash-1017` at the `max` variant against `cli-opencode/SKILL.md` and the opencode builder.

## Actions Taken

1. Ran the Gate 1 trigger-index lookup for the focus phrase. Result: no rows (clean no-hit).
2. Opened `hard-rules.json` and counted the array: 13 entries.
3. Read `buildDshLineageCommand` (2973-3065), `validateDshCompletion` (3070-3097) and the adapter registry (3099-3120).
4. Read the DSH block in `executor-config.ts` (264-274); a targeted grep for `DSH_VERSION` in that file returned no match.
5. Ran `command -v dsh` and `dsh --version </dev/null`: `/Users/michelkerkmeester/.local/bin/dsh`, `0.2.2-rc.1`, exit 0.
6. Read the opencode builder (2466-2536), the `dshHome` creation and env injection (3540-3620, 3686), and the packet claims in `references/cli-reference.md`, `references/providers-and-models.md` and `references/fanout-executor.md`.
7. Read the v4.0.0.13 release note (line 103) and `cli-opencode/SKILL.md` (103-105).
8. Grepped `isDshModelAllowed` / `DSH_SUPPORTED_MODELS` usages: the predicate is test-only; the production builder uses its own `DSH_ALLOWED_MODELS` literal.

## Findings

### F4 — P2 drift + missing guard: thirteen rules are declared, twelve are enforced

- Type: drift (docs vs code) plus an unenforced guard (bug class).
- Release introduced: v4.0.2.0.
- `hard-rules.json` contains exactly 13 entries [SOURCE: .skilled/skills/cli-external-orchestration/cli-deepseek-harness/hard-rules.json:1], and the packet calls them "the thirteen rules this shape satisfies" [SOURCE: .skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/cli-reference.md:201].
- The builder enforces twelve of them. The mapping is:

| Rule id | Enforced | Evidence |
|---|---|---|
| `headless-only` | yes | `--profile headless` is the first arg [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3015] |
| `stdin-dash-required` | yes | args end with `-`, prompt travels as `input`, `promptArgIndexes` is empty [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3047] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3053] |
| `route-patch-required` | yes | route patch is selected from the two roster ids and must exist [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3006] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3011] |
| `closed-roster` | yes | model allowlist plus fixed patch paths under `repoRoot` and a persona-name regex [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2995] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3018] |
| `approval-never-required` | yes | `--approval-policy never`; permission mode can only be read-only or workspace-write, so it cannot pair with danger-full-access [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3046] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3047] |
| `dsh-home-isolated` | yes | `createDshHome()` uses `os.tmpdir()`, and `DSH_HOME` is injected into the child env [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2956] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3569] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3686] |
| `lineage-patch-required` | yes | lineage patch must exist before args are built [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3010] |
| `guards-patch-required` | yes | guards patch is mandatory [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3028] |
| `json-final-and-exit-required` | yes | `--json` plus exit-0 and last-`final`-completed validation [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3047] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3070] |
| `pinned-version-required` | yes | version probe runs in a throwaway home and must equal `0.2.2-rc.1` exactly [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2979] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2989] |
| `dsh-availability-required` | yes | `command -v dsh` is checked before the probe [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2975] |
| `no-repo-root-dotenv` | **no** | `cwd` is `path.resolve(options.lineageDir)`; `repoRoot` is in scope but never compared [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3005] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3056] |
| `mcp-opt-in-only` | yes | only `code_mode` is allowed, and the MCP patch is added only when named [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3034] |

- The unenforced rule is the same cwd gap iteration 1 recorded as F1. This iteration ties it to the rule inventory: `no-repo-root-dotenv` [SOURCE: .skilled/skills/cli-external-orchestration/cli-deepseek-harness/hard-rules.json:69] has no corresponding check in the builder.
- Impact: the packet's "thirteen rules this shape satisfies" overstates enforcement by one. The normal fan-out caller passes a lineage directory under `specs/`, so the gap is defense-in-depth, not a demonstrated live failure.
- Confidence: high. All 13 ids were checked against the builder body.
- Verify: `node -e "console.log(require('./.skilled/skills/cli-external-orchestration/cli-deepseek-harness/hard-rules.json').length)"` prints 13; `rg -n "cwd: path.resolve\\(options.lineageDir\\)" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`.

### F5 — P2 improvement: the DSH roster and version pin are split across the registry and the runner, and the registry predicate is test-only

- Type: improvement (parity and maintainability).
- Release introduced: v4.0.2.0.
- `executor-config.ts` exports `DSH_SUPPORTED_MODELS` with exactly two ids and `DSH_DEFAULT_MODEL` [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:264] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:270], plus `isDshModelAllowed` [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:272]. It exports no `DSH_VERSION`; the pin lives only in the runner [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2948] and the packet [SOURCE: .skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/cli-reference.md:53].
- The builder duplicates the roster in `DSH_ALLOWED_MODELS` and does not call the registry predicate [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2943]. `isDshModelAllowed` is exercised only by unit tests [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts:1058]; a test does assert that the two rosters and defaults are equal [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:1870].
- The three sources agree today: packet roster `deepseek-v4.1-flash-1017` and `deepseek-v4.1-flash` [SOURCE: .skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/providers-and-models.md:45], registry roster and default [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:264], runner roster and default [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2943]. The installed binary reports `0.2.2-rc.1`, matching the pin.
- Impact: no live behavior is wrong. A registry consumer cannot validate the binary pin without importing the 4,327-line runner, and a roster edit that misses the runner literal is caught only by the unit test.
- Confidence: high that the constants agree; medium on how much the split matters operationally.
- Verify: `rg -n "DSH_VERSION" .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` returns no match; `rg -n "DSH_ALLOWED_MODELS|DSH_VERSION" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`.

### F6 — P2 observation (negative drift check): the v4.0.0.13 OpenCode default claim holds

- Type: drift check; no defect found.
- Release introduced: v4.0.0.13.
- The note says the unpinned default is `llmgateway/deepseek-v4.1-flash-1017` at its `max` variant, with `#max` on OpenCode 2 and `--variant max` on OpenCode 1 [SOURCE: .skilled/changelog/skilled/v4.0.0.13.md:103].
- `cli-opencode/SKILL.md` states the same default, variant and format for both versions [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:103].
- The builder agrees: `OPENCODE_DEFAULT_MODEL` is `llmgateway/deepseek-v4.1-flash-1017` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2604]; `pinReasoningEffortForModel` returns `max` for the V4.1 Flash regex [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2457] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2462]; OpenCode 2 appends `#max` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2522], and OpenCode 1 pushes `--variant max` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2499].
- The note also claims `opencode.json` sets the same default for both versions. That file was not opened this iteration, so the claim is UNKNOWN, not contradicted.
- Confidence: high for the note/SKILL/builder parity.
- Verify: `rg -n "OPENCODE_DEFAULT_MODEL" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`; `rg -n "llmgateway/deepseek-v4.1-flash-1017" .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md`.

## Questions Answered

- "Does `hard-rules.json` contain exactly thirteen entries, and does the fan-out builder enforce all thirteen or a subset?" Yes, exactly 13; 12 are enforced, and `no-repo-root-dotenv` is not (F4).
- "What are the exact members of `DSH_ALLOWED_MODELS` and the value of `DSH_DEFAULT_MODEL`? Does the default match the verified LLM Gateway id?" The set is `deepseek-v4.1-flash-1017` and `deepseek-v4.1-flash`; the default is `deepseek-v4.1-flash-1017`, the verified LLM Gateway route (F5).
- The DeepSeek Harness key question is now closed: the 13 rules exist, the builder satisfies 12, the three core patches are always present, the pin is `0.2.2-rc.1` in packet, runner and installed binary, and the two-id roster is identical across packet, registry and runner.
- The v4.0.0.13 OpenCode default claim holds against both the packet and the builder (F6).

## Questions Remaining

- Fan-out parity: for every executor kind, do `LINEAGE_COMMAND_ADAPTERS`, `EXECUTOR_KINDS`, `EXECUTOR_KIND_FLAG_SUPPORT`, the model allowlists in `executor-config.ts`, and each `cli-*/SKILL.md` agree? (next focus)
- Does `opencode.json` carry the same default on both OpenCode versions, as the v4.0.0.13 note also claims?
- Is the `options.repoRoot` override on the DSH builder reachable from a production caller, or is it a test seam only?
- Can any caller pass a `lineageDir` that resolves to the repository root, making F4's missing guard reachable?
- Does the deep-loop prompt builder load the packet's `cli-reference.md` and `prompt-quality-card.md` as `SKILL.md` §2 says every run does?
- Are there live Hermes references outside the three focus directories, e.g. in `.skilled/hooks/**`, runtime mirrors, root commands or generated `.dsh/` adapters?
- Single-executor dispatch, mode retirement, convergence, write containment, cli-classifier/cli-jev, hub canon, over-engineering, UX and extension remain open from the strategy.

## Next Focus

Fan-out parity (v4.0.0.0, v4.0.0.16): compare `LINEAGE_COMMAND_ADAPTERS` in `fanout-run.cjs`, `EXECUTOR_KINDS` and `EXECUTOR_KIND_FLAG_SUPPORT` plus the model allowlists in `executor-config.ts`, and each `cli-*/SKILL.md`, executor kind by executor kind.
