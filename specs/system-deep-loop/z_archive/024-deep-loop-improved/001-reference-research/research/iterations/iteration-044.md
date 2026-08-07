# Iteration 44: S6-04 Cross-Mode Anti-Convergence Contract

## Focus

[S6-04] What ADR-level contract makes anti-convergence (`minIterations`/`convergenceMode`) consistent across research/review/context/council so the optimizer cannot tune past the floor? This builds on S4-02 by moving from the research-only config field design to a shared contract across all graph-backed loop modes and runtime capability metadata.

## Actions Taken

1. Read the deep-research workflow and output contracts to preserve leaf-agent state discipline.
2. Checked prior S4-02, S4-03, S6-03, and S6-07 outputs to avoid re-answering the research-only config and YAML stop-order questions.
3. Mined Kasper for the bounded minimum-evidence contract and enforcement point.
4. Mined loop-cli-main for the central typed loop-options contract and max-run cap behavior.
5. Mapped the ADR target onto our four loop config templates, runtime capability matrix/resolver, and optimizer manifest boundary.

## Findings

1. Define one ADR-owned `antiConvergence` contract, then project it into every graph-backed loop config.

   Reference mechanism: loop-cli-main defines a central `LoopOptions` shape before loop instances run [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/types.ts:20`] and builds those options through one adapter [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/loop-config.ts:86`]. Kasper likewise makes the minimum evidence floor a typed config field, not an incidental scoring constant [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/config.ts:46`].

   Exact OUR target files: `.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_config.json`, `.opencode/skills/deep-loop-workflows/deep-review/assets/deep_review_config.json`, `.opencode/skills/deep-loop-workflows/deep-context/assets/deep_context_config.json`, `.opencode/skills/deep-loop-workflows/deep-ai-council/assets/deep_ai_council_config.json`.

   Why it helps: research, review, and context already expose `maxIterations`, `convergenceThreshold`, and `stuckThreshold` in config [SOURCE: `.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_config.json:3`; `.opencode/skills/deep-loop-workflows/deep-review/assets/deep_review_config.json:9`; `.opencode/skills/deep-loop-workflows/deep-context/assets/deep_context_config.json:6`], while council uses `max_rounds` and `convergence_signal` [SOURCE: `.opencode/skills/deep-loop-workflows/deep-ai-council/assets/deep_ai_council_config.json:9`; `.opencode/skills/deep-loop-workflows/deep-ai-council/assets/deep_ai_council_config.json:11`]. The ADR should define the semantic contract once: a lower evidence floor plus a switch that disables only convergence-driven STOP, never hard caps, pause, invalid-state halts, or explicit completion gates.

   Port-difficulty: med. Tag: deep-rewrite.

2. Put `minIterations` in the config floor, but keep `convergenceMode` outside optimizer tunables.

   Reference mechanism: Kasper separates bounded numeric fields from semantic switches in one schema [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/config.ts:26`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/config.ts:46`] and carries defaults for both thresholds and switches in `DEFAULT_CONFIG` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/types.ts:31`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/types.ts:48`]. The enforcement path then returns before improvement side effects if the minimum observation floor is not met [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:1675`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:1682`].

   Exact OUR target files: `.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_config.json`, `.opencode/skills/deep-loop-workflows/deep-review/assets/deep_review_config.json`, `.opencode/skills/deep-loop-workflows/deep-context/assets/deep_context_config.json`, `.opencode/skills/system-spec-kit/scripts/optimizer/optimizer-manifest.json`.

   Why it helps: research and review currently let the optimizer tune `convergenceThreshold`, `stuckThreshold`, and `maxIterations` [SOURCE: `.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_config.json:70`; `.opencode/skills/deep-loop-workflows/deep-review/assets/deep_review_config.json:85`], while context has no `_optimizerManaged` boundary yet [SOURCE: `.opencode/skills/deep-loop-workflows/deep-context/assets/deep_context_config.json:6`]. The ADR should require `minIterations <= maxIterations`, allow `minIterations` to become tunable only after paired-constraint support exists, and lock `convergenceMode` because it changes stop semantics rather than numeric sensitivity.

   Port-difficulty: med. Tag: deep-rewrite.

3. Treat council as a glossary mapping, not a forced rename.

   Reference mechanism: loop-cli-main models a hard cap as `maxRuns: number | null` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/types.ts:27`] and parses invalid caps before the loop is constructed [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/loop-config.ts:22`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/loop-config.ts:112`]. Its controller test verifies that `maxRuns: 1` stops after one immediate run [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/tests/loop-controller.test.ts:75`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/tests/loop-controller.test.ts:82`].

   Exact OUR target file: `.opencode/skills/deep-loop-workflows/deep-ai-council/assets/deep_ai_council_config.json`.

   Why it helps: council already speaks rounds and agreement, not iterations and novelty. The ADR should define `minRounds` as the council projection of `minIterations`, and `convergenceMode` as a common semantic switch over `convergence_signal`, while preserving `max_rounds` and `two-of-three-agree` as council-native names. That keeps cross-mode safety consistent without pretending council and research use the same scoring math.

   Port-difficulty: med. Tag: quick-win.

4. Add stop-policy capability metadata so runtime parity checks can reject modes without the floor.

   Reference mechanism: Kasper validates each config key through `safeParse` and falls back only after warning on invalid fields [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/config.ts:59`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/config.ts:66`]. Loop-cli-main similarly rejects invalid run caps at parse time [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/loop-config.ts:27`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/loop-config.ts:29`].

   Exact OUR target files: `.opencode/skills/deep-loop-workflows/deep-research/assets/runtime_capabilities.json`, `.opencode/skills/deep-loop-workflows/deep-review/assets/runtime_capabilities.json`, `.opencode/skills/deep-loop-workflows/deep-ai-council/assets/runtime_capabilities.json`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/runtime-capabilities.cjs`.

   Why it helps: the current capability matrices describe tool surface and runtime mirrors [SOURCE: `.opencode/skills/deep-loop-workflows/deep-research/assets/runtime_capabilities.json:5`; `.opencode/skills/deep-loop-workflows/deep-review/assets/runtime_capabilities.json:5`], while council has invariants but no stop-policy field [SOURCE: `.opencode/skills/deep-loop-workflows/deep-ai-council/assets/runtime_capabilities.json:5`]. The shared resolver only validates that a `runtimes` collection exists [SOURCE: `.opencode/skills/deep-loop-runtime/lib/deep-loop/runtime-capabilities.cjs:61`; `.opencode/skills/deep-loop-runtime/lib/deep-loop/runtime-capabilities.cjs:65`]. Add a required capability such as `stopPolicy: { supportsMinIterations: true, supportsConvergenceMode: true, floorField: "minIterations" | "minRounds" }` and make the resolver fail closed when a graph-backed mode lacks it.

   Port-difficulty: med. Tag: deep-rewrite.

5. Extend the optimizer manifest from independent ranges to invariant groups before broadening products to context/council.

   Reference mechanism: Kasper's schema bounds each independent field [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/config.ts:17`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/config.ts:46`], but the minimum observation floor is consumed with aggregate evidence before update side effects [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:1675`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:1682`]. That is a cross-field behavioral invariant, not only a numeric range.

   Exact OUR target files: `.opencode/skills/system-spec-kit/scripts/optimizer/optimizer-manifest.json`, `.opencode/skills/system-spec-kit/scripts/optimizer/search.cjs`, `.opencode/skills/system-spec-kit/scripts/optimizer/promote.cjs`.

   Why it helps: the optimizer manifest currently lists independent ranges for `convergenceThreshold`, `stuckThreshold`, and `maxIterations` across research/review only [SOURCE: `.opencode/skills/system-spec-kit/scripts/optimizer/optimizer-manifest.json:7`; `.opencode/skills/system-spec-kit/scripts/optimizer/optimizer-manifest.json:31`]. Search derives a parameter space field by field [SOURCE: `.opencode/skills/system-spec-kit/scripts/optimizer/search.cjs:39`; `.opencode/skills/system-spec-kit/scripts/optimizer/search.cjs:63`], and promotion validates type/range one field at a time [SOURCE: `.opencode/skills/system-spec-kit/scripts/optimizer/promote.cjs:140`; `.opencode/skills/system-spec-kit/scripts/optimizer/promote.cjs:158`]. The ADR should add invariant groups before adding context/council products, otherwise a candidate can satisfy each range while violating `minIterations <= maxIterations` or silently enabling early convergence.

   Port-difficulty: hard. Tag: deep-rewrite.

## Questions Answered

- S6-04 is answered at ADR scope: anti-convergence should be a mode-neutral stop-policy contract projected into each graph-backed mode, not a research-only pair of fields.
- The shared contract should preserve mode-native vocabulary. Research/review/context can use `minIterations`; council should expose `minRounds` while declaring the same semantic capability.
- `convergenceMode` should be locked everywhere. `minIterations` or `minRounds` can become optimizer-managed only after the manifest, search, and promotion boundary understand paired invariants.
- Runtime capability matrices should become the cross-runtime fail-closed check that every graph-backed mode advertises the anti-convergence floor before the optimizer or dispatcher treats it as compatible.

## Questions Remaining

- Legacy default policy remains open: missing `minIterations` on old records could replay as `0` for byte-compatible history or migrate to `3` for safer future defaults.
- The ADR needs a final home. Candidate target: a deep-loop-runtime convergence profile ADR plus schema fixtures under the runtime tests.
- Context currently has no runtime capability matrix in the same shape as research/review. The ADR should decide whether to add one or route context through a shared graph-backed matrix.

## Next Focus

[S6-11] Layered config migration across config templates, runtime capabilities, and optimizer manifest, because anti-convergence floors need bounded loading and hot-reload semantics before broad rollout.
