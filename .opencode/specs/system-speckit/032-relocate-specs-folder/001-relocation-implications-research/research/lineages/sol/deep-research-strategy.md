# Deep Research Strategy — Relocating `.opencode/specs`

## 1. OVERVIEW

This detached lineage investigates the path, mirror, Git, memory-server, and migration consequences of moving the canonical specs tree from `.opencode/specs/` to top-level `specs/`.

## 2. TOPIC

Determine the complete implications and safest migration shape for relocating the root `.opencode/specs` folder to `specs/`, without implementing the relocation.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] Which Spec Kit tools and scripts encode `.opencode/specs` assumptions, directly or through shared resolvers?
- [x] How do `.claude`, `.codex`, `.cursor`, `.devin`, and `.pi` mirror or symlink the canonical specs surface, and what changes after relocation?
- [x] How do repository and global ignore rules interact with the existing root `specs` symlink and downstream symlinked repositories?
- [x] How does Spec Kit Memory MCP resolve spec roots, and which server/config/indexing paths must change?
- [x] What is the scale, coupling, risk, and verification plan for repointing in-repo references?
<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Do not move, delete, or rewrite the specs tree.
- Do not modify tooling, mirrors, Git configuration, global ignores, MCP configuration, or packet documentation.
- Do not write outside this detached lineage artifact directory.

## 5. STOP CONDITIONS

- Stop at legal convergence after at least three iterations, or after five iterations.
- Stop earlier only for unrecoverable state corruption or a scope-containment failure.
- Synthesis must distinguish confirmed path evidence from migration inferences and preserve eliminated alternatives.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- Runtime mirror topology: no runtime-specific specs paths exist; the live dependency is the root `specs -> .opencode/specs` link, and the runtime-mirror generator does not own specs links (iteration 2).
- Git and ignore topology: the source repository locally negates global ignores for both roots, while downstream repos globally hide both shared entry points; `specs` is currently a tracked relative symlink blob (iteration 3).
- Tooling topology: the named scripts range from direct old-root writers to input-driven readers, and the maintained resolver registry exposes intentionally mixed precedence contracts (iteration 1).
- Memory MCP topology: logical `spec_folder` identity is root-relative, but discovery precedence and physical indexed file paths are mixed and require a staged cutover plus controlled reindex (iteration 4).
- Migration risk: 300 active-surface files contain the old-root literal, but only 54 are source; existing manifest, collision, quarantine, freeze, rollback, and fixture infrastructure should be inverted and reused (iteration 5).
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Literal-path search plus the maintained resolver registry separated direct writer coupling from parameterized readers (iteration 1).
- Filesystem-first mirror inspection exposed stale `.claude` documentation and showed that runtime generation is not the specs relocation mechanism (iteration 2).
- Git index/blob inspection plus ignore precedence corrected stale alias assumptions and exposed downstream ownership as a policy decision (iteration 3).
- Per-consumer Memory MCP tracing separated stable logical packet identity from changed physical file identity (iteration 4).
- Reference classification plus migration-source inspection converted a raw upper bound into a prioritized cutover and proof plan (iteration 5).
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- Startup `memory_context` retrieval was cancelled by the MCP layer; repository evidence is the primary source.
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

None yet.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- Treating the named tools as equally hard-coded: their path coupling differs materially (iteration 1).
- Blind string replacement: resolver precedence is intentional and must migrate by role (iteration 1).
- Repointing five runtime-specific specs symlinks: none exist in the live tree (iteration 2).
- Relying on runtime mirror sync for specs topology: it owns agents, commands, and hooks only (iteration 2).
- Preserving the current tracked `specs` object unchanged: canonical relocation requires a symlink-to-tree mode transition (iteration 3).
- Treating global ignores as a blocker in the source repo: repository negations win there (iteration 3).
- Moving the Memory MCP database: storage configuration is independent of the specs root (iteration 4).
- Assuming stable `spec_folder` values avoid reindexing: physical `file_path` and `canonical_file_path` values still change (iteration 4).
- Removing the reverse alias before old-root-only startup-repair and continuity consumers migrate (iteration 4).
- Blindly rewriting all literal hits, including historical evidence and negative fixtures (iteration 5).
- Retiring the reverse alias during root inversion or using a symlink-only rollback after new writes (iteration 5).
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER

- Completed pivots: 0
- Failed pivots: 0
- Saturated: none yet
- Pivot lineage: none yet
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

- Implementation-time classification of each executable/configuration hit.
- Operator decision on downstream project-local specs ownership.
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Terminal: synthesis complete. Next work belongs in an implementation plan after the downstream ownership decision.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- Memory context: unavailable because the startup MCP retrieval was cancelled.
- Code graph: unavailable in the session startup context.
- Resource map: `resource-map.md` not present; skipping coverage gate.
- Source pointers: `.opencode/skills/system-spec-kit/`, `.opencode/skills/system-deep-loop/`, runtime mirror directories, repository `.gitignore`, and the Spec Kit Memory MCP server.
- Existing topology: a root `specs` path exists and must be classified as file, directory, or symlink before migration conclusions are made.

## 13. RESEARCH BOUNDARIES

- Max iterations: 5
- Minimum iterations before convergence: 3
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Allowed write root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/032-relocate-specs-folder/001-relocation-implications-research/research/lineages/sol`
- Session: `fanout-sol-1786019208170-r5nald`
