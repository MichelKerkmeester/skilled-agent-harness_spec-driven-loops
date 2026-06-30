# Iteration 20 — kimi

**Angle:** Scan graph-metadata.json key_files/source_docs paths across all 028 children for other dead or repo-misrelative entries.

**Findings:** 5

- **[P2] misalignment** `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/041-search-quality-fixes/graph-metadata.json:44` — key_files path spec/is-phase-parent.ts does not exist at listed location
  - evidence: "spec/is-phase-parent.ts" — actual file is at .opencode/skills/system-spec-kit/mcp_server/lib/spec/is-phase-parent.ts
  - fix: Change to "mcp_server/lib/spec/is-phase-parent.ts" to match the skill-root convention used by sibling entries.
- **[P2] misalignment** `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/001-multihop-tail-appends/graph-metadata.json:46` — key_files path lib/search/deterministic-multihop.ts missing mcp_server prefix
  - evidence: "lib/search/deterministic-multihop.ts" — actual file is at .opencode/skills/system-spec-kit/mcp_server/lib/search/deterministic-multihop.ts
  - fix: Prepend "mcp_server/" or use repo-absolute path ".opencode/skills/system-spec-kit/mcp_server/lib/search/deterministic-multihop.ts".
- **[P2] misalignment** `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/003-true-citation-ledger/graph-metadata.json:44` — key_files path handlers/memory-search.ts missing mcp_server prefix
  - evidence: "handlers/memory-search.ts" — actual file is at .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts
  - fix: Prepend "mcp_server/" or use repo-absolute path ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts".
- **[P2] misalignment** `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/004-save-reconsolidation/graph-metadata.json:48` — key_files path lib/storage/reconsolidation.ts missing mcp_server prefix
  - evidence: "lib/storage/reconsolidation.ts" — actual file is at .opencode/skills/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts
  - fix: Prepend "mcp_server/" or use repo-absolute path ".opencode/skills/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts".
- **[P2] misalignment** `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/009-flag-name-cleanup/graph-metadata.json:38` — key_files path lib/response/profile-formatters.ts missing mcp_server prefix
  - evidence: "lib/response/profile-formatters.ts" — actual file is at .opencode/skills/system-spec-kit/mcp_server/lib/response/profile-formatters.ts
  - fix: Prepend "mcp_server/" or use repo-absolute path ".opencode/skills/system-spec-kit/mcp_server/lib/response/profile-formatters.ts".
