<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Per-Mode Executor Parity

<!-- ANCHOR:summary -->
## 1. SUMMARY
Give the three modes that run their own dispatch (model-benchmark, skill-benchmark, ai-council) cli-cursor/cli-devin/cli-pi parity by delegating those kinds' command construction to the shared `buildLineageCommand`. Built as three independent leaves, each verified by a stash-baseline delta (zero new failures) plus SOL cross-verify, and landed per leaf.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- Each leaf's targeted lane test passes (FULL output, never through `tail`).
- Stash-baseline delta: the post-change failure set is a strict subset of the pre-change set (zero new failures).
- Whole-runtime tsc is 0; the changed CJS module requires cleanly.
- Independent cli-opencode GPT-5.6-SOL review with no surviving P0/P1.
- `validate.sh --strict` passes.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
The fan-out builders in `fanout-run.cjs` are the single source of the hardened per-kind flags. `buildLineageCommand(lineage, prompt, resolvedSandbox, resolvedPermission, options)` returns `{command, args, input}` — exactly a spawn spec. Because `fanout-run.cjs` guards its `main()` behind `require.main === module`, a mode script can `require` it side-effect-free and call the builder. Each mode maps its own read-only/write-capable posture to a sandbox mode, calls the builder for cursor/devin/pi, and feeds `command`/`args`/`input` into its existing spawn — keeping its own I/O contract (envelope parsing, seat prompts). opencode/claude/codex stay on each mode's own logic (they have mode-specific arg divergence the fan-out shape does not serve).
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Audit per-mode executor coverage; confirm the shared builder fits cursor/devin/pi (no mode divergence) but not opencode.
2. Leaf 1 — model-benchmark: delegate cursor/devin/pi; register cli-devin; drop stale local allowlists.
3. Leaf 2 — skill-benchmark: route cursor/devin/pi/claude-code through the shared builder instead of the opencode-nailed branch.
4. Leaf 3 — ai-council: shared-builder seat spawn for cursor/devin/pi; extend the allowlist (keep the deliberate codex exclusion).
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Per leaf: update the mode's targeted tests to assert the real hardened args for cursor/devin/pi (read-only + write-capable); run the mode's full lane suite twice — once with the change stashed (baseline) and once with it applied — and require the post-change failure set to be a strict subset of the baseline. Whole-runtime tsc and a require smoke test guard the wiring. SOL adversarially checks the delegation, the posture mapping, allowlist parity, and no-regression.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- The shared `buildLineageCommand` (phases 002/003) with all seven builders wired and hardened.
- Each mode's own vitest config (e.g. `deep-improvement/scripts/vitest.config.mjs`, run from that dir).
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Each leaf is confined to one mode's dispatch script + validator + tests; rollback is reverting that leaf's hunks. The shared fan-out builders are never modified, so no leaf can regress the fan-out modes. The stash-baseline delta is the per-leaf tripwire.
<!-- /ANCHOR:rollback -->
