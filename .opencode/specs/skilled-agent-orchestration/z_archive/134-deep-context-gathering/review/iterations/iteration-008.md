# Iteration 8: crosscommand-uniformity

**Dimensions**: consistency, maintainability
**Files reviewed**: .opencode/commands/deep/start-model-benchmark-loop.md, .opencode/commands/deep/start-agent-improvement-loop.md, .opencode/commands/deep/start-context-loop.md
**Findings**: P0=0 P1=2 P2=1

## Findings
### [P1] Setup gate cannot collect required run_label in confirm mode (S08-001)
- **Dimension**: completeness | **Class**: instance-only
- **Location**: `.opencode/commands/deep/start-model-benchmark-loop.md:167`
- **Evidence**: The Default Resolution Table marks `run_label` required and line 200 stores it from `--run-label or Q1b`, but the consolidated prompt only asks Q0 profile, Q1 spec folder, Q2 mode, Q3 scorer, Q4 grader, and Q5 executor/model. There is no visible run-label question, and the frontmatter argument hint also omits `--run-label`.
- **Recommendation**: Add an explicit run-label setup question and include `--run-label=LABEL` in the argument hint, or fold run-label clearly into Q1 with parse instructions that match the prompt text.
- **Scope proof**: Bounded to the model-benchmark setup gate in the reviewed file; the other two reviewed commands do not require `run_label`.

### [P1] Context setup hard-block omits executor_pool from YAML start condition (S08-002)
- **Dimension**: consistency | **Class**: instance-only
- **Location**: `.opencode/commands/deep/start-context-loop.md:77`
- **Evidence**: The FIRST ACTION block requires the Unified Setup Phase to resolve `executor_pool`, and the setup parser later stores `executor_pool`; however the `YAML START CONDITION` list says YAML may not load until `scope`, `spec_folder`, `execution_mode`, `maxIterations`, and `convergenceThreshold` are bound, omitting `executor_pool`.
- **Recommendation**: Add `executor_pool` to the YAML start-condition required-input list so the native-only default or explicit pool is bound before YAML loads.
- **Scope proof**: Bounded to the start-context-loop gate sections in the reviewed file; model-benchmark and agent-improvement do not use an executor pool field.

### [P2] Model-benchmark setup display box still overflows on default profile line (S08-003)
- **Dimension**: maintainability | **Class**: instance-only
- **Location**: `.opencode/commands/deep/start-model-benchmark-loop.md:164`
- **Evidence**: The setup prompt box uses fixed-width padded rows, but the `A) Default - assets/model-benchmark/benchmark-profiles/default.json` row is longer than the surrounding box rows and pushes the closing border out of alignment.
- **Recommendation**: Wrap or shorten the default profile path inside the box, or move the full path outside the boxed prompt, so all rows share the same width.
- **Scope proof**: Bounded to the start-model-benchmark-loop setup display box; the reviewed Phase 0 restart boxes name their own commands.

## Status
complete
