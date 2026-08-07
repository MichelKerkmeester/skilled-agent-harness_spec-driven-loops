# Iteration 9: yaml-skill-readme

**Dimensions**: correctness, consistency
**Files reviewed**: .opencode/commands/deep/assets/deep_start-context-loop_auto.yaml, .opencode/commands/deep/assets/deep_start-context-loop_confirm.yaml, .opencode/skills/deep-context/SKILL.md, .opencode/skills/deep-context/README.md, .opencode/skills/deep-loop-runtime/SKILL.md
**Findings**: P0=0 P1=3 P2=1

## Findings
### [P1] YAML comments contradict the read-only seat contract (S09-001)
- **Dimension**: security | **Class**: cross-consumer
- **Location**: `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml:348`
- **Evidence**: The sweep comment says seats are READ-ONLY but also says they "write only their own seats/iter-NNN/{label}.json". The same file's host-writes-state contract says the HOST is the ONLY writer, and the dispatch step later says the host writes each seat return. The confirm YAML repeats the same contradiction at lines 376-379.
- **Recommendation**: Change both sweep comments to say seats return structured findings and the host writes `seats/iter-NNN/{label}.json`; remove any wording that grants seats write authority.
- **Scope proof**: Bounded to the two reviewed context-loop YAML files and cross-checked only against their own host-writes-state and dispatch wording.

### [P1] README documents the per-seat artifact path in the wrong order (S09-002)
- **Dimension**: consistency | **Class**: cross-consumer
- **Location**: `.opencode/skills/deep-context/README.md:171`
- **Evidence**: README packet layout shows `seats/{label}/iter-NNN/`, but both YAML assets define `seat_pattern: "{artifact_dir}/seats/iter-{NNN}/{label}.json"`. The documented layout is reversed relative to the workflow contract.
- **Recommendation**: Update the README packet layout to `seats/iter-NNN/{label}.json` or equivalent wording matching the YAML state_paths.
- **Scope proof**: Compared README layout only against the two reviewed YAML `state_paths.seat_pattern` entries.

### [P1] deep-loop-runtime still describes only deep-review and deep-research as supported consumers (S09-003)
- **Dimension**: completeness | **Class**: cross-consumer
- **Location**: `.opencode/skills/deep-loop-runtime/SKILL.md:10`
- **Evidence**: The runtime intro and usage sections say the runtime is for deep-review and deep-research workflows, while the same file's mirror note later lists deep-context and other deep-loop native agents as consumers. The reviewed deep-context SKILL also states deep-context is a consumer of deep-loop-runtime.
- **Recommendation**: Generalize the consumer wording or explicitly include deep-context and the other supported deep-loop consumers wherever the runtime scope, activation triggers, and escalation rules name consumers.
- **Scope proof**: Bounded to the reviewed deep-loop-runtime SKILL and the reviewed deep-context SKILL consumer statement.

### [P2] deep-context README still names the loop as heterogeneous by default-facing metadata (S09-004)
- **Dimension**: consistency | **Class**: instance-only
- **Location**: `.opencode/skills/deep-context/README.md:2`
- **Evidence**: The README title is `deep-context: Heterogeneous Codebase Context Loop`, and the overview says it runs a heterogeneous pool. The same README lists the default executor pool as `2 native @deep-context seats (native-only); add --executor for CLI/heterogeneous`. This leaves heterogeneous wording in default-facing title/overview rather than only in custom/optional examples.
- **Recommendation**: Rename default-facing README title/overview wording to native/default-neutral language, and keep heterogeneous wording only where describing opt-in CLI/custom pools.
- **Scope proof**: Reviewed only the README default-facing metadata/overview against its own default executor pool line and the de-named focus for this slice.

## Status
complete
