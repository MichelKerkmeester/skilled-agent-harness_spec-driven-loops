# Iteration 9 — kimi

**Angle:** Spec metadata/graph integrity: description.json/graph-metadata.json across 028 children; phase-parent invariants; coverage gaps.

**Findings:** 5

- **[P1] drift** `.opencode/specs/system-spec-kit/028-memory-search-intelligence/graph-metadata.json:65` — Dead relative key_file path in root graph-metadata
  - evidence: derived.key_files includes \"lib/response/envelope.ts\", but the actual file is at .opencode/skills/system-spec-kit/mcp_server/lib/response/envelope.ts.
  - fix: Update the key_files entry to the real repo-relative path or remove the stale entry and regenerate graph-metadata.json.
- **[P1] drift** `.opencode/specs/system-spec-kit/028-memory-search-intelligence/006-review-remediation/graph-metadata.json:44` — Dead relative key_file path in review-remediation graph-metadata
  - evidence: derived.key_files lists \"shared/algorithms/rrf-fusion.ts\", but the file lives at .opencode/skills/system-spec-kit/shared/algorithms/rrf-fusion.ts.
  - fix: Correct the key_files path to the actual skill-relative location.
- **[P1] contradiction** `.opencode/specs/system-spec-kit/028-memory-search-intelligence/006-review-remediation/006-review-record-packet-type/spec.md:56` — Review-record packet carries waived docs
  - evidence: spec.md:56 states lean packets have \"nothing else: no plan, no tasks, no checklist, no implementation-summary\"; description.json:4 repeats this; yet plan.md, tasks.md and implementation-summary.md exist and graph-metadata.json:54-56 lists them in key_files.
  - fix: Delete the three waived docs from the review-record packet, or update the spec/description to abandon the lean-packet claim.
- **[P1] drift** `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/benchmark-and-test-status.md:1` — Non-migrated phase parent contains heavy doc
  - evidence: benchmark-and-test-status.md exists at the phase parent while phase_definitions.md:88 mandates only the lean trio (spec.md, description.json, graph-metadata.json) at phase parents; graph-metadata.json lacks migrated:true.
  - fix: Move benchmark-and-test-status.md into the relevant child phase, or mark the parent as legacy-migrated and regenerate metadata.
- **[P2] misalignment** `.opencode/specs/system-spec-kit/028-memory-search-intelligence/description.json:2` — Inconsistent phase-parent level metadata
  - evidence: Root description.json:2 declares \"level\": \"2\", 000-release-cleanup and 006-review-remediation declare \"level\": \"phase\", and 007-dark-flag-graduation/description.json:19 declares \"level\": \"3\".
  - fix: Standardize description.json level to \"phase\" for every phase parent under 028.
