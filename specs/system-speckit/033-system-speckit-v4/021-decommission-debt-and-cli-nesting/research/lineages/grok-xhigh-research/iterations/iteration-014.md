# Iteration 14: Doctor-update still snapshots mcp-server/database

## Focus
Angle 2. Doctor assets that still name or snapshot the retired `context-index` / `mcp-server/database` surface.

## Findings

### F-I14-001 — `/doctor update` still VACUUM-snapshots `mcp-server/database/*.sqlite`. CONFIRMED. P1
Phase 3 post-snapshot hook iterates `mcp-server/database/*.sqlite` and `*.db`. [SOURCE: .opencode/commands/doctor/assets/doctor-update.yaml:331-347]
Phase 5.5 detect_command lists the same globs plus `*.pre-doctor-update.*.bak`. [SOURCE: .opencode/commands/doctor/assets/doctor-update.yaml:383-386]
Those paths are relative to the process cwd, not `system-spec-kit/runtime/database`. Combined with F-I10-001, a leftover compiled `system-spec-kit/mcp-server/database` (or a cwd-relative `mcp-server/`) can still be snapshotted. Combined with the 052 LOG deletion of the 13.8 GB store [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:202], the hook is a dangling registration: it describes a store the landing deleted.
Smallest fix: point snapshots at the D5 databases that still exist (advisor skill-graph, deep-loop graphs) or drop the spec-kit sqlite snapshot entirely. Remove the `mcp-server/database` glob.

### F-I14-002 — Dependency order still names `context-index` first, but the action is the trigger-index generator. CONFIRMED. P2
`dependency.order` is `["context-index", "skill-graph", "advisor", "deep-loop-graph"]`. [SOURCE: .opencode/commands/doctor/assets/doctor-update.yaml:165-166]
The `context-index` execute action is `generate-trigger-index.mjs` with a comment that there is no daemon. [SOURCE: .opencode/commands/doctor/assets/doctor-update.yaml:369-370]
Dashboard rows still include `context-index`. [SOURCE: .opencode/commands/doctor/assets/doctor-update.yaml:353-356]
The successor is wired; the retired name is what the operator sees. Presentation table still has a `context-index` row. [SOURCE: .opencode/commands/doctor/assets/doctor-update-presentation.txt:121]
Smallest fix: rename the step to `trigger-index`. Keep the generator action.

### F-I14-003 — Doctor-update still lists ignored D5 sqlite paths (052 command-references debt). CONFIRMED. P1
Concrete skill-asset rows still name ignored sqlite files: advisor `skill-graph.sqlite` and deep-loop `deep-loop-graph.sqlite`. [SOURCE: .opencode/commands/doctor/assets/doctor-update.yaml:104-107]
`validate-command-references.cjs` resolves those tokens with `existsSync` and skips only glob-truncated `*.bak` patterns, not the concrete `.sqlite` path. [SOURCE: .opencode/commands/scripts/validate-command-references.cjs:117-130]
052 recorded this as "passes where the daemons have run and fails in a fresh worktree". [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:201]
054 did not absorb it (T004-T008 list has no doctor-references row).
Smallest fix: mark generated sqlite paths as non-resolvable artifacts (same skip class as `.doctor-*` dotfiles), or stop listing them as concrete skill assets.

### F-I14-004 — `doctor-deep-loop.yaml` still ignore-lists `mcp-server/database/*context-index*`. CONFIRMED. P2
The ignore list still names `mcp-server/database/*context-index*` and related voyage/skill/eval globs. [SOURCE: .opencode/commands/doctor/assets/doctor-deep-loop.yaml:99-104]
Those are ignore patterns, not live readers. They document a directory D8 deleted.
Smallest fix: drop the `mcp-server/database/*` ignore rows.

## Sources Consulted
- .opencode/commands/doctor/assets/doctor-update.yaml:104-107,165-166,331-347,353-370,383-386
- .opencode/commands/doctor/assets/doctor-update-presentation.txt:121
- .opencode/commands/doctor/assets/doctor-deep-loop.yaml:99-104
- .opencode/commands/scripts/validate-command-references.cjs:117-130
- specs/system-speckit/052-memory-decommission-landing/goal.md:201-202

## Assessment
- newInfoRatio: 0.85
- Novelty justification: live doctor snapshot glob is new; command-references sqlite debt confirmed against the current checker.
- Confidence: high.

## Reflection
- Worked: read the execute action, not only the step name. context-index is renamed residue, not a second sqlite rebuild.
- Failed: none.
- Ruled out: treating the context-index *action* as a still-running memory reindex.

## Dead Ends
- None.

## Recommended Next Focus
Remaining 052 LOG debt 054 did not absorb: validator class defects, onnxruntime-common unproven, plus this doctor-references row now confirmed live.
