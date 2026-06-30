# Iteration 42 — gpt55

**Angle:** Check 005-spec-data-quality/03x-04x child graph-metadata files for additional repo-misrelative script paths (e.g., scripts/... that live under mcp_server/scripts/ or skills/system-spec-kit/scripts/).

**Findings:** 5

- **[P2] misalignment** `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/036-metadata-validator-status-enum/graph-metadata.json:38-39` — 036 graph metadata keeps repo-misrelative script paths
  - evidence: Lines 38-39 list "scripts/validation/generated-metadata-integrity.ts" and "scripts/lib/validator-registry.json" while lines 47-48 list the repo-rooted counterparts under ".opencode/skills/system-spec-kit/scripts/...".
  - fix: Replace the repo-misrelative script entries with the existing .opencode/skills/system-spec-kit/scripts/... paths and deduplicate key_files/entities.
- **[P2] misalignment** `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/037-drift-gate-synopsis-extractor/graph-metadata.json:39` — 037 drift validator path drops system-spec-kit prefix
  - evidence: Line 39 lists "scripts/validation/generated-metadata-drift.ts" while line 47 lists ".opencode/skills/system-spec-kit/scripts/validation/generated-metadata-drift.ts".
  - fix: Normalize the script path to .opencode/skills/system-spec-kit/scripts/validation/generated-metadata-drift.ts and remove the unrooted duplicate.
- **[P2] misalignment** `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/037-drift-gate-synopsis-extractor/graph-metadata.json:53` — 037 validator registry path is repo-misrelative
  - evidence: Line 53 lists "scripts/lib/validator-registry.json" while line 49 lists ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json".
  - fix: Keep only the .opencode/skills/system-spec-kit/scripts/lib/validator-registry.json entry in key_files/entities.
- **[P2] misalignment** `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/038-generator-hardening/graph-metadata.json:47` — 038 test script path is missing skills prefix
  - evidence: Line 47 lists "scripts/tests/phase-parent-pointer.vitest.ts"; the matching entity at line 114 repeats "path": "scripts/tests/phase-parent-pointer.vitest.ts".
  - fix: Rewrite both key_files and entity path to .opencode/skills/system-spec-kit/scripts/tests/phase-parent-pointer.vitest.ts.
- **[P2] misalignment** `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/039-full-repo-json-migration/graph-metadata.json:58` — 039 migration script is listed twice with one bad path
  - evidence: Line 58 lists "scripts/graph/migrate-generated-json.ts" while line 60 lists ".opencode/skills/system-spec-kit/scripts/graph/migrate-generated-json.ts"; line 72 repeats the bad entity path.
  - fix: Remove the unrooted scripts/graph/migrate-generated-json.ts key_files/entity entries and keep the .opencode/skills/system-spec-kit/scripts/graph/... path.
