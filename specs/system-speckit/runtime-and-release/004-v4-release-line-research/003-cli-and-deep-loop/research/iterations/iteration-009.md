# Iteration 009 — Unread releases for CLI dispatch (v4.0.0.13 / v4.0.0.2 / v4.0.0.16)

## Focus

Settle three release claims against code, in the CLI-dispatch cluster only:

1. **v4.0.0.13** — "Dispatch prefers OpenCode 2 … `cli-opencode` runs OpenCode 2 whenever it is installed and falls back to OpenCode 1, and both default to DeepSeek V4.1 Flash 1017." Check the resolver, the fan-out builder and — the untested half — the single-executor `if_cli_opencode` branch of `deep-research-auto.yaml`.
2. **v4.0.0.2** — eight Grok 4.7 Cursor ids, "each confirmed by a live run". Compare with `CURSOR_SUPPORTED_MODELS` and the fan-out Cursor roster.
3. **v4.0.0.16** — pi runs GPT-6.1 Terra in deep loops and fast mode sends the priority tier. Check the pi builder surface and the Terra allowlists.

## Actions Taken

1. Read the run config for its stable identity (`lineage.sessionId = 2026-11-08T20:14:35.000Z`) and listed the v4 release-note directory.
2. Read the v4.0.0.13, v4.0.0.2 and v4.0.0.16 release notes in full (head sections).
3. Located the OpenCode resolver: **not** under `cli-opencode/runtime/scripts/`, but at `system-deep-loop/runtime/scripts/opencode-version.cjs`, and grepped its callers.
4. Read `if_cli_opencode` in the research auto variant end-to-end (1589–1673) and read the opening of `if_cli_codex` as its sibling for comparison.
5. Grepped the Terra / priority surface across `cli-external-orchestration`, `system-deep-loop` and `commands/deep`; diffed the two Cursor rosters by eye from full reads of both.

## Findings

### F1 — P1 — bug + drift: the single-executor `cli-opencode` branch never resolves the binary, so v4.0.0.13's preference does not apply there

`fanout-run.cjs` builds its OpenCode invocation from `resolveOpencodeBinary` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2391] and branches on `opencode.version === 'v2'` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2397]. The skill documents the same resolver contract — first `opencode2` on `PATH`, `opencode` only as fallback, `OPENCODE_BIN` overriding both [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:77].

The single-executor research branch does neither. It calls `runAuditedExecutorCommand` with the literal `command: 'opencode'` [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1642], and `opencode-version.cjs` has exactly one caller in the tree — `fanout-run.cjs` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:19]. A single-executor lineage therefore ignores `OPENCODE_BIN` and runs OpenCode 1 on a machine where both majors are installed, which is the one configuration v4.0.0.13 was written to change.

Asymmetry confirms intent was missed rather than chosen: its sibling `if_cli_codex` performs an explicit `command -v codex` preflight and exits 1 with a named error rather than dispatching blind.

- Introduced by: v4.0.0.13.
- Confidence: high.
- Verify: `grep -c "resolveOpencodeBinary" .skilled/commands/deep/assets/deep-research-auto.yaml` → `0`; `grep -rn "require('./opencode-version.cjs')" .skilled/skills/system-deep-loop/runtime/scripts/` → one hit, `fanout-run.cjs`.

### F2 — P0 on the path to fixing F1 — bug: the same branch passes the v1-only `--pure` flag unconditionally

The branch's argv contains `'--pure'` [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1619]. The skill says `--pure` is absent from OpenCode 2 `run` and available on OpenCode 1 only [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:180], and says it twice more in its anti-patterns, where disabling plugins "removes the entire point of cli-opencode dispatch" [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:266].

The two defects mask each other. Today the hardcoded `opencode` usually lands on a v1 binary, where `--pure` is accepted (while silently stripping the plugins); the moment F1 is repaired and the resolver picks OpenCode 2, the same argv carries a flag v2 `run` does not accept. Fixing F1 alone converts a silent plugin loss into a hard dispatch failure.

- Introduced by: v4.0.0.13 (the flag predates it; the contradiction it creates does not).
- Confidence: high for the contradiction; high for v2 rejection given the skill's two independent statements.
- Verify: `grep -n "'--pure'" .skilled/commands/deep/assets/deep-research-auto.yaml`; `opencode2 run --help | grep -c -- --pure` → `0`.

### F3 — P1 — bug: the model placeholder reaches argv unguarded, where the sibling branch guards it

`if_cli_opencode` passes `model: '{config.executor.model}'` straight through [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1600]. `if_cli_codex` guards the same placeholder with `'{config.executor.model}' === 'null' ? null : …` and only then pushes `--model`. The guard exists because a null model is a reachable template state; the OpenCode branch has no equivalent, so an unset model becomes a literal `--model null` argument instead of the documented default `llmgateway/deepseek-v4.1-flash-1017` at variant `max` [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:103]. That default lives only in the skill's prose, not in the branch.

- Introduced by: pre-v4.0.0.13 branch, unfixed by it.
- Confidence: medium-high (guard asymmetry confirmed; the literal-`null` outcome depends on the substitution engine's unknown-token policy, still open from iteration 8).
- Verify: `sed -n '1597,1607p;1698,1712p' .skilled/commands/deep/assets/deep-research-auto.yaml` and compare the two placeholder treatments.

### F4 — P2 — bug: the working directory is passed as `--dir`/`cwd` only, which v2 does not honour

The branch passes `'--dir', '{repo_root}'` [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1620] plus `cwd` to the audit wrapper. The skill states OpenCode 2 takes the model's working directory from `PWD`, not the process directory, and that a Node `spawn()` with `cwd` must also set `PWD` [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:233]. This is the third defect in the same five-line argv block and the second one that only fires once F1 is repaired.

- Introduced by: v4.0.0.13.
- Confidence: medium-high.
- Verify: `grep -n "PWD" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (the fan-out sets it) versus `grep -n "PWD" .skilled/commands/deep/assets/deep-research-auto.yaml` (no hit).

### F5 — P2 — improvement (duplication): the 28-entry Cursor roster exists twice, byte-identical

`CURSOR_SUPPORTED_MODELS` [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:353] and `CURSOR_ALLOWED_MODELS` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2562] both list the same 28 ids in the same order. v4.0.0.2's Grok 4.7 addition therefore had to be applied twice, and the fan-out copy carries the naming explanation the other copy lacks ("Cursor lists it without the `cursor-` prefix the older Grok ids carry") [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2561].

No drift today: I read both lists in full and they agree, including all eight `grok-4.7-*` ids the release note names. I did not find an equality assertion between them in the test files I opened, so the drift is latent, not present.

- Introduced by: pre-v4 teeth; last edited by v4.0.0.2.
- Confidence: high for duplication, medium for "no equality test" (not exhaustively grepped).
- Verify: `diff <(sed -n '353,383p' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts | grep -o "'[^']*'") <(sed -n '2562,2592p' .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | grep -o "'[^']*'")` → no output.

### F6 — P2 — drift (narrow): `cli-pi` advertises no `serviceTier`, so the v4.0.0.16 "fast mode sends priority" claim has no config surface

v4.0.0.16 says pi runs GPT-6.1 Terra in deep loops and that fast mode sends the priority tier. Terra is present on both allowlists [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:236] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2623] and in the provider map [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2850]. But `EXECUTOR_KIND_FLAG_SUPPORT['cli-pi']` accepts only `model`, `reasoningEffort`, `timeoutSeconds`, `liveTools` [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:128], while `SERVICE_TIERS` exists as a first-class type [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:31].

So either the priority routing is encoded in the model uid (as the OpenCode comment at `executor-config.ts:119` describes for `-max`/`-priority` suffixes) and the release sentence describes a uid, not a tier field — or the behaviour is unreachable from a config. The release note names a mechanism ("fast mode") that appears in no surface I opened. This is a documentation-to-schema naming gap, not a proven break.

- Introduced by: v4.0.0.16.
- Confidence: medium (one iteration of grep; the pi builder argv was not read).
- Verify: `grep -n "serviceTier" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | grep -i pi` and read the `cli-pi` builder's argv construction; then `grep -rn "fast" .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md`.

### Verified aligned (no finding)

- **v4.0.0.2 Grok 4.7**: the eight ids in the release note — `grok-4.7-{low,medium,high,xhigh}` each with a `-fast` twin — match both rosters exactly, prefix quirk documented at the roster. The claim holds.
- **v4.0.0.13 fan-out half**: "prefers OpenCode 2" is real in `fanout-run.cjs` (resolver, version branch, effort folded into the model id as `model#effort` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2523]). The release note is accurate about fan-out; it is silent that the single-executor branch is exempt.

## Questions Answered

- **Single-executor dispatch**: which `if_cli_*` branches in `.skilled/commands/deep/assets/deep-research-auto.yaml` and `deep-review-auto.yaml` carry placeholder, field-name or ordering defects that would break or mislabel a run? — Partially answered for `if_cli_opencode` in the research auto variant: three defects in one argv block (hardcoded binary, v1-only `--pure`, unguarded model placeholder) plus a `PWD` gap, with the first two masking each other. `deep-review-auto.yaml`'s twin branch is not yet checked.

## Questions Remaining

- **Single-executor dispatch (narrowed)**: does `deep-review-auto.yaml`'s `if_cli_opencode` carry the same four defects? A twin comparison is the cheapest close.
- **UX (narrowed, second instance)**: the branch's own `notes` block instructs `input: ''` citing the skill's §4 ALWAYS rule while the same argv passes a flag §266 forbids — an operator reading the notes gets a self-contradicting instruction. `deep-research-presentation.txt` still unexamined.
- **Executor failure handling** (v4.0.0.3, v4.0.0.16): quota errors and builder throws under the single-executor workflow — still open after four iterations of deferral.
- **Hub canon**: `package_skill.py --strict` conformance across the hub and its seven modes — structure present, conformance unproven.
- **Extension**: F1 + F2 + F4 now point at one change — make the single-executor branches consume the same resolver and argv builder as `fanout-run.cjs`, so a version rule is stated once.
- **Over-engineering**: F5 is a removal case (one roster, imported twice) but its blast radius needs a check for consumers outside the three files read.

## Next Focus

Iteration 10 (`max-iterations` ceiling): take the twin branch in `deep-review-auto.yaml`, then close the extension question by naming the single argv-builder seam that removes F1, F2 and F4 together. If budget allows, settle executor failure handling, the run's longest-deferred open question.
