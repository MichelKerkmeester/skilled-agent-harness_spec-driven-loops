# Iteration 5: context-gates

**Dimensions**: correctness
**Files reviewed**: .opencode/commands/deep/start-context-loop.md
**Findings**: P0=0 P1=2 P2=0

## Findings
### [P1] Phase 0 recovery restart command drops the attached mode suffix (S05-001)
- **Dimension**: correctness | **Class**: instance-only
- **Location**: `.opencode/commands/deep/start-context-loop.md:60`
- **Evidence**: The Phase 0 failure block tells users to restart with `/deep:start-context-loop [arguments]`, but this file defines canonical mode syntax as attached suffixes (`/deep:start-context-loop:auto`, `/deep:start-context-loop:confirm`) at line 80 and uses those forms in the execution-mode table. Restarting an `:auto` or `:confirm` invocation with the shown command can change setup behavior or force mode re-selection.
- **Recommendation**: Change the recovery text to preserve the original attached command form, for example `/deep:start-context-loop[:auto|:confirm] [original arguments]`, or explicitly tell the user to rerun the exact original command under @general.
- **Scope proof**: Bounded to the requested file; verified the Phase 0 restart block against the same file's canonical mode syntax and execution-mode table.

### [P1] `:restart` is advertised without setup or mode-routing support (S05-002)
- **Dimension**: consistency | **Class**: instance-only
- **Location**: `.opencode/commands/deep/start-context-loop.md:333`
- **Evidence**: Line 333 says a `:restart` request archives the current packet and starts a new lineage segment, but the command metadata and setup flow only recognize `:auto`, `:confirm`, or no suffix: description/argument hint at lines 2-3, setup mode switch at lines 150-153, and execution-mode table at lines 349-353. There is no documented first-action/setup branch for `:restart`.
- **Recommendation**: Either remove the `:restart` sentence or add `:restart` consistently to the argument hint, setup mode detection, required input binding, and YAML execution path.
- **Scope proof**: Bounded to the requested file; searched for `:restart`, `:auto`, and `:confirm` occurrences and found only the single restart promise with no matching routing branch.

## Status
complete
