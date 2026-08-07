# Iteration 7: MiniMax Variant Ablation And Verification Hardening

## Focus

This iteration hardens the remaining MiniMax 2.7 recommendations by specifying:

- the concrete `--variant` ablation rig for `cli-opencode` direct MiniMax.io dispatches;
- the MiniMax output-verification recipe using the 114/Phase 004 compile -> execute -> smoke-test -> lint pipeline;
- whether the permissions matrix and fallback design require MiniMax-specific runtime logic.

## Actions Taken

1. Read the current `cli-opencode` permissions matrix reference and schema.
2. Checked the expected runtime helper paths for `fallback-router.ts` and `permissions-gate.ts`.
3. Read the 114-derived output-verification reference and current MiniMax registry entry.
4. Cross-checked `cli-opencode` provider and variant documentation plus the existing CO-012 variant test shape.

## Findings

### Finding 1: MiniMax `--variant` mapping needs an ablation before any default mapping

`cli-opencode` currently documents `--variant` as a core flag and defaults the OpenCode Go route to `--variant high`, but the MiniMax direct path is only selected when explicitly requested and currently uses `--model minimax/minimax-2.7` without a proven variant policy. [SOURCE: file:.opencode/skills/cli-opencode/SKILL.md:197] [SOURCE: file:.opencode/skills/cli-opencode/SKILL.md:200] [SOURCE: file:.opencode/skills/cli-opencode/SKILL.md:237] The model registry also still marks MiniMax context and reasoning behavior as unverified. [SOURCE: file:.opencode/skills/sk-prompt/assets/model-profiles.json:187] [SOURCE: file:.opencode/skills/sk-prompt/assets/model-profiles.json:197]

Concrete ablation rig:

```bash
PROMPT='Compare event sourcing vs traditional CRUD for an order management system across consistency, query performance, learning curve, scalability, and ops cost. Recommend one with confidence. Return: decision, 5 trade-off bullets, risk, verification step.'

/usr/bin/time -p opencode run \
  --model minimax/minimax-2.7 \
  --agent general \
  --format json \
  --dir "$(pwd)" \
  "$PROMPT" \
  </dev/null > /tmp/minimax-27-ablation-none.jsonl 2> /tmp/minimax-27-ablation-none.stderr

/usr/bin/time -p opencode run \
  --model minimax/minimax-2.7 \
  --agent general \
  --variant high \
  --format json \
  --dir "$(pwd)" \
  "$PROMPT" \
  </dev/null > /tmp/minimax-27-ablation-high.jsonl 2> /tmp/minimax-27-ablation-high.stderr
```

Run each pair three times and compare medians, not single samples. Measure:

- exit status for both runs;
- response byte count from `message.delta` plus `session.completed` payloads;
- visible reasoning or thinking trace bytes if the event stream exposes `reasoning.delta` or `thinking.delta`;
- `tool.call` count;
- wall-clock latency from `/usr/bin/time -p`;
- output quality on a 10-point rubric: all five requested trade-off dimensions covered, explicit recommendation present, confidence calibrated, no fabricated model/provider claim, and verification step actionable.

Promotion rule: keep MiniMax default as no `--variant` unless `--variant high` exits cleanly on all paired runs, keeps the same model id, improves median quality by at least 2/10 or adds at least one meaningful trade-off dimension, and stays within 1.75x median latency. If `high` only increases length or latency without quality gain, document it as unsupported/no-op for MiniMax and keep omitting `--variant`.

This should become a MiniMax-specific variant scenario modeled after CO-012, but with `none` vs `high` rather than `minimal` vs `max`, because the current open question is whether any MiniMax provider mapping exists at all. CO-012 already defines the older variant-effect test shape: fixed prompt, paired dispatches, byte counts, dimension counts, and a pass/fail threshold. [SOURCE: file:.opencode/skills/cli-opencode/manual_testing_playbook/03--multi-provider/004-variant-levels-comparison.md:26] [SOURCE: file:.opencode/skills/cli-opencode/manual_testing_playbook/03--multi-provider/004-variant-levels-comparison.md:30] [SOURCE: file:.opencode/skills/cli-opencode/manual_testing_playbook/03--multi-provider/004-variant-levels-comparison.md:48]

### Finding 2: MiniMax output verification should reuse 114's stages, with stage applicability based on output type

The existing output-verification reference is explicit: the operator-facing 4-stage pipeline is compile, execute, smoke-test, and lint. [SOURCE: file:.opencode/skills/cli-devin/references/output-verification.md:31] [SOURCE: file:.opencode/skills/cli-devin/references/output-verification.md:35] For pure research markdown, the same reference says verification is skipped when no supported fenced code blocks exist, and it provides a research-output rubric mapping compile/run/test/lint terms to cite-accuracy, structure-pass, recommendation-actionability, and anti-hallucination. [SOURCE: file:.opencode/skills/cli-devin/references/output-verification.md:80] [SOURCE: file:.opencode/skills/cli-devin/references/output-verification.md:86] [SOURCE: file:.opencode/skills/cli-devin/references/output-verification.md:92]

MiniMax recipe:

- Pure research or planning dispatch: do not run code verification. Apply the research-output rubric manually or in the post-dispatch validator when available.
- Code-generating dispatch with supported fenced code: apply compile/syntax validation and static lint scoring.
- Execute and smoke-test apply only when the prompt requests runnable behavior and the dispatcher has a sandboxed command, timeout, and artifact path constraints.
- Lint remains quality signal, not a hard-fail by itself.

Hard-fail gate:

- If `verification_enabled` is true and a supported code block is present, compile failure is a hard fail for reusable code.
- If execution was in scope, execute failure is a hard fail.
- If behavior was specified and a smoke test is available, smoke-test failure is a hard fail.
- Lint-only failure degrades confidence but does not hard-fail.
- Score below 0.50 emits/degrades; score below 0.30 is the hard-fail candidate threshold for retry/escalation. [SOURCE: file:.opencode/skills/cli-devin/references/output-verification.md:116] [SOURCE: file:.opencode/skills/cli-devin/references/output-verification.md:120] [SOURCE: file:.opencode/skills/cli-devin/references/output-verification.md:122]

No MiniMax-specific verifier is needed. The model-specific part is the dispatch recipe and model profile; the verification stages are output-shape-specific.

### Finding 3: Permissions matrix is provider-neutral; MiniMax does not need a matrix fork

The permissions matrix schema has only `target_glob`, `operation_class`, `scope`, `effect`, and `rationale` on rules; there is no provider/model field. [SOURCE: file:.opencode/skills/cli-opencode/assets/permissions-matrix.schema.json:29] [SOURCE: file:.opencode/skills/cli-opencode/assets/permissions-matrix.schema.json:42] [SOURCE: file:.opencode/skills/cli-opencode/assets/permissions-matrix.schema.json:53] [SOURCE: file:.opencode/skills/cli-opencode/assets/permissions-matrix.schema.json:62] The reference similarly defines resolution around tool operation and target matching, not model identity. [SOURCE: file:.opencode/skills/cli-opencode/references/permissions-matrix.md:55] [SOURCE: file:.opencode/skills/cli-opencode/references/permissions-matrix.md:57] [SOURCE: file:.opencode/skills/cli-opencode/references/permissions-matrix.md:74]

The examples reinforce that the matrix gates tool calls and shell commands: broad reads can be allowed, destructive commands denied, and packet-local writes scoped by path. [SOURCE: file:.opencode/skills/cli-opencode/assets/permissions-matrix.example-readonly.json:6] [SOURCE: file:.opencode/skills/cli-opencode/assets/permissions-matrix.example-readonly.json:97] [SOURCE: file:.opencode/skills/cli-opencode/assets/permissions-matrix.example-packet-local.json:13] [SOURCE: file:.opencode/skills/cli-opencode/assets/permissions-matrix.example-packet-local.json:55]

Conclusion: MiniMax direct-provider dispatches should use the same read-only, packet-local, or repo-wide matrices selected by workflow scope. Adding MiniMax-specific permission rules would be a category error unless MiniMax introduces a different tool target shape, which the current schema does not model.

### Finding 4: The documented fallback-router and permissions-gate runtime anchors are stale or absent in this checkout

The prompt asked to verify against `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/fallback-router.ts` and `permissions-gate.ts`. Direct reads failed because those files do not exist at the referenced paths, and `rg --files .opencode/skills/system-spec-kit | rg 'deep-loop|fallback|permissions'` found no matching runtime helper files. The stale references are still present in the pattern index and example matrix. [SOURCE: file:.opencode/skills/sk-prompt-models/references/pattern-index.md:43] [SOURCE: file:.opencode/skills/sk-prompt-models/references/pattern-index.md:46] [SOURCE: file:.opencode/skills/cli-opencode/assets/permissions-matrix.example-packet-local.json:55]

This does not imply MiniMax needs new runtime code. It implies the implementation follow-up should first decide whether to restore/recreate those runtime helper files, update the references to their actual current locations, or explicitly mark those helpers as planned-but-absent. The MiniMax-specific delta should stay in documentation, model-profile metadata, and manual test coverage until the runtime anchor is reconciled.

### Finding 5: Fallback remains fail-fast for MiniMax

The current registry entry gives MiniMax a separate `minimax-api` quota pool and `fallback_target: null`. [SOURCE: file:.opencode/skills/sk-prompt/assets/model-profiles.json:193] [SOURCE: file:.opencode/skills/sk-prompt/assets/model-profiles.json:200] [SOURCE: file:.opencode/skills/sk-prompt/assets/model-profiles.json:201] The quota-fallback reference says fallback is one-step, opt-in, off when `fallback_target` is null, and should fail fast when no separate-pool target exists. [SOURCE: file:.opencode/skills/cli-devin/references/quota-fallback.md:19] [SOURCE: file:.opencode/skills/cli-devin/references/quota-fallback.md:21] [SOURCE: file:.opencode/skills/cli-devin/references/quota-fallback.md:23] [SOURCE: file:.opencode/skills/cli-devin/references/quota-fallback.md:25]

Conclusion: no MiniMax-specific fallback code or mapping is needed. Keep `fallback_target: null` unless a concrete, authenticated, separate-pool fallback is adopted later.

## Questions Answered

- The `--variant` ablation rig should compare `minimax/minimax-2.7` with no variant against the same model with `--variant high`, using the same prompt, three paired runs, median metrics, and a promotion rule based on quality gain versus latency cost.
- MiniMax output verification should reuse the existing 114/Phase 004 pipeline. Compile/execute/smoke-test/lint applicability depends on whether MiniMax produced reusable code, not on the MiniMax provider itself.
- The permissions matrix and fallback policy do not need MiniMax-specific runtime logic. They are provider-neutral and registry-driven respectively.
- The expected runtime helper file anchors are currently absent, so the implementation packet must not blindly edit those paths.

## Questions Remaining

- Does the real MiniMax provider event stream expose any `reasoning.delta` or `thinking.delta` fields, or only final/message payload text?
- Does `--variant high` change MiniMax behavior at all on this OpenCode provider, or is it ignored/rejected?
- Should the implementation follow-up restore the documented runtime helper files or update the pattern index to a currently valid runtime location?

## Next Focus

Iteration 8 should convert the now-hardened findings into a patch-ready implementation checklist: exact file-level edits for `sk-prompt/assets/model-profiles.json`, `cli-opencode/SKILL.md`, `cli-opencode/references/context-budget.md`, `cli-opencode/manual_testing_playbook`, and `sk-prompt-models/references/pattern-index.md`, including how to handle the stale runtime-helper anchors.
