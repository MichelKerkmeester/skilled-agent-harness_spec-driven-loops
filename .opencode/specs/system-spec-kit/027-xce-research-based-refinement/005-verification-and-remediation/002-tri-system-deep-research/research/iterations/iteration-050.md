# Iteration 050 — Angle 50

**Angle:** Deep-loop integration surface: how deep loops save memory, exclusion policies (z_future), and whether loop artifacts feed retrieval well.

**Summary:** Deep-loop memory integration is mostly a canonical-continuity handoff, not direct indexing of loop artifacts. The main risks are stale save instructions, an unwritten JSON input in YAML save phases, and documentation that overstates retrieval coverage for iteration/review artifacts.

**Findings kept:** 6

## [P1][BROKEN-FEATURE] Deep-loop save phases reference an unwritten temp JSON file

- Evidence: .opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:978-987 and .opencode/skills/system-spec-kit/scripts/loaders/data-loader.ts:64-68,121-126
- Detail: The research/review/context save phases call generate-context.js with /tmp/save-context-data-<session-id>.json, but the workflow asset does not define a step that writes that structured JSON payload first. The loader requires --stdin, --json, or an existing JSON file and throws EXPLICIT_DATA_FILE_LOAD_FAILED when the file is absent, so the advertised automatic memory save depends on out-of-band behavior.
- Fix sketch: Add an explicit workflow step that composes the save payload and calls generate-context.js via --stdin/--json or a real buildSessionScopedSaveContextPath-derived file.

## [P1][DOC-DRIFT] Deep-review memory-save protocol documents a rejected CLI mode

- Evidence: .opencode/skills/deep-review/references/protocol/loop_protocol.md:539-546 versus .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:708-713
- Detail: The deep-review protocol still instructs operators to run generate-context.js with only {spec_folder} and then verify memory/*.md. The current generate-context parser explicitly rejects direct spec-folder mode and the live YAML says retired memory/ paths must not be authored.
- Fix sketch: Update the protocol to require structured JSON input and verify canonical docs/metadata rather than memory/*.md.

## [P1][README-MISALIGNMENT] Docs claim iteration artifacts are decay-indexed, but code excludes them

- Evidence: .opencode/skills/system-spec-kit/mcp_server/lib/utils/README.md:103-106 versus .opencode/skills/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts:22-27,48-53,107-113 and .opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:1164-1170
- Detail: The path-policy README says research/iterations/ and review/iterations/ are indexed with a decay-only multiplier. In code, discovery skips any iterations directory and memory parsing rejects working artifact paths, so iteration files are absent from retrieval rather than merely downweighted.
- Fix sketch: Either correct the docs to say iteration artifacts are excluded, or add an explicit decay-indexing path for selected iteration summaries.

## [P2][REFINEMENT] Review reports are not first-class retrieval documents

- Evidence: .opencode/skills/deep-review/README.md:61,87-91 and .opencode/skills/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts:7-18,29-37 plus .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3093-3106
- Detail: Deep-review treats review/review-report.md as the canonical handoff artifact, but the memory document allowlist omits review-report.md and excludes /review/ paths for spec documents. Retrieval therefore sees only whatever continuity summary is routed into canonical docs, not the full findings registry/planning packet in the final report.
- Fix sketch: Introduce a canonical review-report document type or require synthesis to copy a bounded findings summary into an indexable canonical spec document.

## [P2][BUG] Research and review staging commands use an undefined state_paths key

- Evidence: .opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:94-119,965-969 and .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:83-109,1300-1304
- Detail: Both YAMLs define state_paths.packet_dir but the staging step runs git add {state_paths.artifact_dir}. That placeholder is not defined in state_paths, so the non-fatal staging step cannot reliably preserve the loop artifact trail.
- Fix sketch: Change the staging command to use {state_paths.packet_dir} or define artifact_dir consistently in state_paths.

## [P2][REFINEMENT] Research iteration metadata backfill creates files under paths discovery ignores

- Evidence: .opencode/skills/system-spec-kit/scripts/memory/backfill-research-metadata.ts:5-6,146-148,182-209 and .opencode/skills/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts:48-53,152-165
- Detail: The backfill script creates description.json and graph-metadata.json under research iteration directories. Memory discovery skips iterations directories, and graph metadata classification only accepts graph-metadata.json whose parent is a spec leaf, so these generated metadata files do not improve retrieval under the current policy.
- Fix sketch: Either stop generating iteration-level metadata or add a dedicated consumer/indexing path for iteration-pack metadata.
