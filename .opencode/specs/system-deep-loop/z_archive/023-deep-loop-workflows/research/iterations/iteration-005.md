# Deep-Research Iteration 005: backend promotion and self-containment

> Engine: openai/gpt-5.5 --variant xhigh (read-only seat) · orchestrator-written.

Research-only scope confirmed. I’ll ground this in the existing context report first, then inspect only the named files and cite concrete line ranges.
SKILL ROUTING: advisor surfaced an ambiguous, partly off-target set (`sk-git`, `deep-research`, `sk-code`). I’m treating the user’s explicit read-only research instruction and the mandatory “first read” context report as controlling, so I will not run any write-capable deep-loop workflow.
The context report’s Q-BACKEND section confirms this is the central dedupe/self-containment decision, not a behavior-unification exercise. I’m now checking the concrete scripts and their consumers.
The duplicate resolver is not actually byte-identical: the scripts differ in the banner and the unknown-runtime error string, while the executable logic is otherwise the same. I’m checking whether the data they load or their callers are mode-specific.
The capability manifests are mode-specific data: research includes `WebFetch`, review omits it. That points to centralizing only the generic resolver, while leaving per-mode JSON manifests with the workflow mode.
`resolveArtifactRoot` is not just reducer-internal: six command YAMLs shell-require it directly, and three reducers import it. `emitResourceMap` is a separate `system-spec-kit` script used by research/review reducers only.
The runtime lock library already exports the three primitives the local context wrapper forwards to, so the CLI adapter itself is the duplicated/misplaced layer, not the lock semantics.
The actual file diff confirms a sharp split: resolver code is generic except labels; manifests encode per-mode agent paths and tool surfaces. Promotion should not absorb those manifests into a single flattened runtime capability set.
Only research and review have the duplicated resolver script; council has a different capability schema without that resolver, and context has no capability manifest in the current tree. That lowers the promotion blast radius.
A full move of `review-research-paths.cjs` has one non-workflow consumer inside `system-spec-kit`; that means the clean migration should either move the canonical implementation and update that consumer, or leave a temporary shim if legacy spec-kit tooling still needs the old path.
The resource-map emitter is mode-aware (`review`/`research`) and spec-kit-resource-map-specific, not a pure runtime primitive. The path resolver is broader and already has a `context` mode in addition to research/review.
The YAML verifier is cross-mode but it verifies workflow wiring, not backend behavior. I’m checking what it actually covers before deciding whether “runtime/scripts” is the right destination.
**Recommendation**

Promote `runtime-capabilities.cjs` and `loop-lock.cjs` into `deep-loop-runtime/scripts/`. Do not promote `verify-yaml-script-paths.sh` into runtime; move it to the merged `deep-loop-workflows` skill as workflow validation. Move `resolveArtifactRoot` out of `system-spec-kit` into `deep-loop-runtime` because it is shared deep-loop artifact topology used by commands and reducers. Move `emitResourceMap` out of `system-spec-kit`, but not into runtime; it belongs in `deep-loop-workflows` shared synthesis code because it renders mode deliverables, not backend state.

This preserves the frozen backend boundary: runtime owns generic process/path/lock/capability plumbing; workflows own per-mode capability manifests, reducers, resource-map rendering, YAML validation, convergence semantics, and artifacts.

**Evidence**

`runtime-capabilities.cjs` is generic resolver code, not mode behavior.

- `.opencode/skills/deep-research/scripts/runtime-capabilities.cjs:11-19` and `.opencode/skills/deep-review/scripts/runtime-capabilities.cjs:11-19` have the same imports and same local default shape.
- `.opencode/skills/deep-research/scripts/runtime-capabilities.cjs:32-79` and `.opencode/skills/deep-review/scripts/runtime-capabilities.cjs:32-79` implement the same load/list/resolve functions.
- The diff shows only two string differences: banner line 2 and the unknown-runtime error label at line 71.
- The manifests are not generic: research includes `WebFetch` in each runtime tool surface at `.opencode/skills/deep-research/assets/runtime_capabilities.json:10-19`, `28-37`, `46-55`; review omits `WebFetch` at `.opencode/skills/deep-review/assets/runtime_capabilities.json:10-18`, `27-35`, `44-52`.
- Council has a different capability schema entirely: `.opencode/skills/deep-ai-council/assets/runtime_capabilities.json:2-34`.

Conclusion: promote one parameterized resolver, but keep capability data mode-scoped under `deep-loop-workflows`.

`loop-lock.cjs` is already a runtime CLI adapter in the wrong folder.

- `.opencode/skills/deep-context/scripts/loop-lock.cjs:18-21` loads `deep-loop-runtime/lib/deep-loop/loop-lock.ts`.
- `.opencode/skills/deep-context/scripts/loop-lock.cjs:81-99` only maps CLI actions to `acquireLoopLock`, `refreshLoopLock`, and `releaseLoopLock`.
- The actual lock implementation lives in `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:205-259`.
- Context YAML already describes it as using runtime single source of truth at `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml:172-186` and releases through the same local wrapper at `727-730`.

Conclusion: move the CLI adapter to runtime and update YAML references to `.opencode/skills/deep-loop-runtime/scripts/loop-lock.cjs`.

`verify-yaml-script-paths.sh` is cross-mode, but not backend.

- `.opencode/skills/deep-research/scripts/verify-yaml-script-paths.sh:7-12` verifies research and review YAMLs.
- `.opencode/skills/deep-research/scripts/verify-yaml-script-paths.sh:32-36` greps YAML command strings for `node .opencode/**/*.cjs`, including both runtime scripts and workflow reducers.
- Running it read-only passed: `PASS checked 20 script references across 4 workflow YAMLs`.
- The matched paths include runtime scripts and workflow reducers, so runtime would be validating workflow-owned files if this moved there.

Conclusion: move it to `deep-loop-workflows/scripts/verify-yaml-script-paths.sh` or rename to `verify-workflow-script-paths.sh`, then expand coverage after the final command/mode layout is decided.

`resolveArtifactRoot` should become runtime-owned shared topology.

- `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:14-24` already knows deep-loop modes `research`, `review`, and `context`.
- `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:202-285` implements the artifact-root allocation contract.
- Six command YAMLs require it directly; examples are context at `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml:140-143`, research at `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:136-142`, and review at `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:126-132`.
- Three reducers depend on it: context `.opencode/skills/deep-context/scripts/reduce-state.cjs:15` and `670-671`, research `.opencode/skills/deep-research/scripts/reduce-state.cjs:15` and `899-900`, review `.opencode/skills/deep-review/scripts/reduce-state.cjs:14` and `1672-1673`.

Conclusion: runtime should own this as shared loop artifact topology, ideally with a library export plus a JSON stdout script so YAML stops using fragile `node -e`.

`emitResourceMap` should be self-contained, but workflow-owned.

- `.opencode/skills/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs:80-177` renders markdown resource maps.
- `.opencode/skills/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs:179-184` accepts only `review` and `research`.
- `.opencode/skills/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs:202-324` has review/research normalization logic.
- Only research/review reducers import it: `.opencode/skills/deep-research/scripts/reduce-state.cjs:14` and `.opencode/skills/deep-review/scripts/reduce-state.cjs:13`.
- The reducer call sites are deliverable synthesis, not backend state: research `.opencode/skills/deep-research/scripts/reduce-state.cjs:966-975`, review `.opencode/skills/deep-review/scripts/reduce-state.cjs:1732-1741`.

Conclusion: move it to `deep-loop-workflows/scripts/shared/resource-map.cjs`, not runtime.

**Concrete Change Set**

- Add `.opencode/skills/deep-loop-runtime/scripts/runtime-capabilities.cjs`.
- Remove or stop referencing `.opencode/skills/deep-research/scripts/runtime-capabilities.cjs`.
- Remove or stop referencing `.opencode/skills/deep-review/scripts/runtime-capabilities.cjs`.
- Keep mode-specific capability manifests under the merged workflow tree, not runtime.
- Update `runtimeCapabilityResolver` fields currently seen in `.opencode/skills/deep-research/assets/deep_research_config.json:54-56` and `.opencode/skills/deep-review/assets/deep_review_config.json:52`.
- Update `resolverScript` fields currently seen in `.opencode/skills/deep-research/assets/runtime_capabilities.json:3-5` and `.opencode/skills/deep-review/assets/runtime_capabilities.json:3-5`.
- Add `.opencode/skills/deep-loop-runtime/scripts/loop-lock.cjs`.
- Remove or stop referencing `.opencode/skills/deep-context/scripts/loop-lock.cjs`.
- Update context YAML lock commands in `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` and `.opencode/commands/deep/assets/deep_start-context-loop_confirm.yaml`.
- Add `.opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs` exporting `resolveArtifactRoot`, `allocateShortSubfolder`, and `normalizeSpecFolderReference`.
- Prefer adding `.opencode/skills/deep-loop-runtime/scripts/artifact-root.cjs` so YAML can call a normal runtime script instead of `node -e`.
- Update the six YAML `resolveArtifactRoot` requires from `system-spec-kit/shared/review-research-paths.cjs`.
- Update context/research/review reducers to import runtime artifact-root code.
- Update `.opencode/skills/system-spec-kit/scripts/migrate-deep-loop-local-owner.cjs:7` to import `normalizeSpecFolderReference` from the runtime location.
- Add `.opencode/skills/deep-loop-workflows/scripts/shared/resource-map.cjs`.
- Update research/review reducers to import `emitResourceMap` from the merged workflow skill.
- Add `.opencode/skills/deep-loop-workflows/scripts/verify-yaml-script-paths.sh`.
- Remove or stop referencing `.opencode/skills/deep-research/scripts/verify-yaml-script-paths.sh`.
- Update `.opencode/skills/deep-loop-runtime/references/script_interface_contract.md` if `runtime-capabilities.cjs`, `loop-lock.cjs`, or `artifact-root.cjs` become official runtime script interfaces.

**Rejected Alternatives**

- Reject keeping duplicate `runtime-capabilities.cjs` files. The code differs only in labels, while capability behavior is supplied by the JSON input.
- Reject moving capability manifests into runtime. The manifests encode per-mode tool permissions, agent paths, and schema differences; flattening them would violate the preservation constraint.
- Reject moving `verify-yaml-script-paths.sh` to runtime. It validates workflow YAML plus workflow reducers; runtime should not own workflow wiring tests.
- Reject leaving `resolveArtifactRoot` in `system-spec-kit`. It is now deep-loop artifact topology used by deep-loop commands and reducers, and it blocks the two-skill architecture from being self-contained.
- Reject moving `emitResourceMap` into runtime. It is review/research markdown synthesis and belongs with workflow deliverables.

**Risks**

- Existing generated packet configs may still point at old resolver paths. Decide whether migration must rewrite historical `deep-*-config.json` files or whether only new runs are covered.
- A central runtime capability resolver must not infer one default manifest from runtime location. It should require `--capability-path` or read the mode config’s `capabilityMatrixPath`.
- Council’s capability manifest uses an object-shaped schema, unlike research/review’s array schema. Do not silently force it through the old array resolver unless the resolver is explicitly extended.
- Replacing YAML `node -e` resolver calls with a runtime script must preserve the exact JSON fields: `rootDir`, `subfolder`, `artifactDir`, `artifactArchiveRoot`.
- The verifier currently covers only research/review. Expanding it to context/council/improvement depends on the final `deep-loop-workflows` layout and command migration scope.

**Dependencies**

- Q-ARCH must decide whether merged mode trees preserve old subtree shapes or move under `modes/<mode>/`; that determines exact relative import paths.
- Q-CMD must decide whether all 7 commands stay stable; that determines the final YAML verifier coverage.
- Q-AGENT affects capability manifest agent paths if agent names are consolidated instead of retained.
- Q-ADVISOR affects whether capability resolver paths are indexed as workflow metadata, runtime metadata, or both.
- Legacy resume policy must decide whether old generated configs are migrated or allowed to become archival.
