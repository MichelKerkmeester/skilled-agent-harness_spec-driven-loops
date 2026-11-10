### .skilled/skills/system-spec-kit/references/cli/memory-handback.md

- [P2] .skilled/skills/system-spec-kit/references/cli/memory-handback.md:16 | 3 | The intro has three sentences, including a pointer to section 4, so it is not a 1–2 sentence hook. | Move the marker details into the overview and retain the per-template mapping in section 4; replace the intro with: “Use this procedure to preserve session context after a cli-* delegation.”
- [P2] .skilled/skills/system-spec-kit/references/cli/memory-handback.md:20 | 4 | The overview does not open with Purpose and When to Use. | Add `### Purpose` and `### When to Use` before the current overview text; use the procedure summary as Purpose and the delegation condition from line 16 as a When to Use bullet.
- [P2] .skilled/skills/system-spec-kit/references/cli/memory-handback.md:53 | 9 | “Post-010” is an ephemeral number in the body. | Replace `Post-010 save gates` with `Post-normalization save gates`.

### .skilled/skills/system-spec-kit/references/cli/shared-smart-router.md

- [P2] .skilled/skills/system-spec-kit/references/cli/shared-smart-router.md:17 | 3 | The intro gives several implementation details and line 19 points to another template; neither forms a 1–2 sentence hook. | Move the function-ownership details into the overview and move the template pointer into section 2 before the code; replace the intro with: “Use this reference when implementing shared helpers in a cli-* router.”
- [P2] .skilled/skills/system-spec-kit/references/cli/shared-smart-router.md:23 | 4 | The overview lacks Purpose and When to Use. | Add `### Purpose` and `### When to Use` before the current overview text; use the helper summary as Purpose and add a trigger for implementing or reviewing cli-* routing helpers.

### .skilled/skills/system-spec-kit/references/config/environment-variables.md

- [P2] .skilled/skills/system-spec-kit/references/config/environment-variables.md:16 | 3 | The intro restates the title and overview instead of giving a distinct hook. | Replace it with: “Use this reference when configuring a Spec Kit variable or tracing which component reads it.”
- [P2] .skilled/skills/system-spec-kit/references/config/environment-variables.md:20 | 4 | The overview lacks Purpose and When to Use. | Add `### Purpose` and `### When to Use` before line 22; use the current summary as Purpose and add a trigger for configuring variables or checking their source of truth.
- [P2] .skilled/skills/system-spec-kit/references/config/environment-variables.md:30 | 7 | This paragraph packs path resolution, the database-path change, and the telemetry and advisor database readers into one paragraph. | Split it into bullets covering `runtime/core/config.ts`, the directory-override readers in `shared/config.ts`, and the readers in `shared/embeddings/`.
- [P2] .skilled/skills/system-spec-kit/references/config/environment-variables.md:110 | 9 | The examples use the numeric spec-folder name `001-feature` at lines 110, 113, 116, 119 and 122. | Replace `001-feature` throughout with the generic placeholder `<NNN-feature>`.
- [P1] .skilled/skills/system-spec-kit/references/config/environment-variables.md:191 | 10 | The validator reports `render_section_order`: Related Resources is followed by another H2. | Move section 8 before Related Resources; renumber Clean Transport as section 7 and Related Resources as section 8.

### .skilled/skills/system-spec-kit/references/config/hook-system.md

- [P2] .skilled/skills/system-spec-kit/references/config/hook-system.md:21 | 4 | The overview opens with the source inventory rather than Purpose and When to Use. | Add `### Purpose` and `### When to Use` before line 23; put the reference’s outcome under Purpose and a runtime-hook inspection trigger under When to Use.
- [P2] .skilled/skills/system-spec-kit/references/config/hook-system.md:99 | 7 | This paragraph packs goal-transport mechanisms for OpenCode, Pi, Cursor, Devin, Claude Code and Codex together. | Split it into runtime-specific bullets, preserving each runtime’s injection and management details.

### .skilled/skills/system-spec-kit/references/config/launcher-lease.md

- [P2] .skilled/skills/system-spec-kit/references/config/launcher-lease.md:16 | 3 | The intro restates the Purpose at line 24. | Replace it with: “Open this reference when a launcher reports `LEASE_HELD_BY:<pid>` or stale lease state needs diagnosis.”
- [P2] .skilled/skills/system-spec-kit/references/config/launcher-lease.md:38 | 7 | This paragraph combines the live-owner bridge and fallback path with the stale-owner recovery path. | Split it into separate bullets for a live recorded PID and a missing recorded PID, preserving the existing bridge, fallback, logging and overwrite behavior.

### .skilled/skills/system-spec-kit/references/debugging/troubleshooting.md

- [P2] .skilled/skills/system-spec-kit/references/debugging/troubleshooting.md:23 | 4 | The overview opens with Core Principle and lacks Purpose and When to Use. | Add `### Purpose` and `### When to Use` before Core Principle; move the issue categories at lines 25–30 under Purpose and use them as the triggers.
- [P2] .skilled/skills/system-spec-kit/references/debugging/troubleshooting.md:32 | 7 | This paragraph combines the retrieval model, excluded mechanisms and miss-diagnosis categories. | Split it into bullets for how retrieval works and how to classify a miss by exit status.
- [P2] .skilled/skills/system-spec-kit/references/debugging/troubleshooting.md:65 | 9 | The examples contain the ephemeral packet number `122` in the full path at lines 65 and 81 and the glob at line 73. | Replace `122-skill-standardization` with `<NNN-skill-standardization>` and `122*` with `<NNN>*`.

### .skilled/skills/system-spec-kit/references/debugging/universal-debugging-methodology.md

- [P2] .skilled/skills/system-spec-kit/references/debugging/universal-debugging-methodology.md:16 | 3 | The intro restates the Purpose at line 24 and does not provide a distinct hook. | Replace it with: “Use this method when you need one debugging sequence across technology stacks.”
- [P1] .skilled/skills/system-spec-kit/references/debugging/universal-debugging-methodology.md:86 | 5 | The “Make minimal change” step appears before the Phase 3 rule that prohibits source edits. | Move the Rules block at lines 90–95 before the Phase 3 action table at line 83.

### .skilled/skills/system-spec-kit/references/memory/embedder-pluggability.md

- [P2] .skilled/skills/system-spec-kit/references/memory/embedder-pluggability.md:19 | 3 | The first intro sentence is a pointer to the canonical reference; the second sentence is the actual use hook. | Move the first sentence into Purpose at line 29 and keep the “Read this when…” sentence as the intro.
- [P1] .skilled/skills/system-spec-kit/references/memory/embedder-pluggability.md:183 | 5 | The advisor-ownership transport choice appears after the swap steps it governs, which can leave the reader following the retired surface. | Move the blockquote at line 192 before the swap-flow code block.
- [P2] .skilled/skills/system-spec-kit/references/memory/embedder-pluggability.md:111 | 7 | The paragraph packs the asynchronous job’s return, re-embedding and pointer-flip sequence. | Convert it to a numbered list with one item for each step.
- [P2] .skilled/skills/system-spec-kit/references/memory/embedder-pluggability.md:113 | 7 | This paragraph packs stack ownership, the advisor’s consumer components, configuration and health checks. | Split it into bullets for shared-stack ownership, the advisor’s current consumer components, configuration and health checks.
- [P2] .skilled/skills/system-spec-kit/references/memory/embedder-pluggability.md:39 | 9 | “After 014” is an ephemeral number in a heading. | Replace `### Scope after 014` with `### Scope`.
- [P2] .skilled/skills/system-spec-kit/references/memory/embedder-pluggability.md:145 | 9 | The ADR trail and rollback sentence at line 196 expose authoring history and status tokens in this evergreen reference; the heading also contains `016/004`, and line 241 records commit provenance. | Move the ADR trail, rollback count and commit provenance to the packet’s `implementation-summary.md`; retain a link to that record here.
- [P2] .skilled/skills/system-spec-kit/references/memory/embedder-pluggability.md:208 | 9 | The `016/004` packet/phase number also appears at line 228. | Replace `016/004 bake-off` with `bake-off` at both locations.
