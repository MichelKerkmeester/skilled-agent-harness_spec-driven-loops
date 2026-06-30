# Iteration 32 — gpt55

**Angle:** Audit packet 028 docs for `_V1` env names after the 009 flag-name cleanup and verify each has an ENV_REFERENCE legacy mapping.

**Findings:** 3

- **[P1] undocumented** `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:550` — ENV_REFERENCE has no legacy rows for renamed 028 `_V1` flags
  - evidence: ENV_REFERENCE deprecated section says, "These variables are no longer active but may still appear in compatibility code." The table shown at lines 554-560 contains no `_V1` aliases, and `rg -n '_V1\b' ENV_REFERENCE.md` returned no matches, while 028 cleanup maps twelve `_V1` names at `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/009-flag-name-cleanup/implementation-summary.md:54`.
  - fix: Add a dedicated legacy-alias mapping table or deprecated rows for all twelve `_V1` names with their unsuffixed replacements.
- **[P2] undocumented** `.opencode/specs/system-spec-kit/028-memory-search-intelligence/benchmark-status.md:251` — Benchmark status still names graduated legacy env vars with no ENV_REFERENCE aliases
  - evidence: `SPECKIT_LEXICAL_GROUNDING_V1` and line 252 `SPECKIT_NOISE_FLOOR_SUBTRACTION_V1` are recorded as graduated flags, but ENV_REFERENCE documents only `SPECKIT_LEXICAL_GROUNDING` at line 298 and `SPECKIT_NOISE_FLOOR_SUBTRACTION` at line 270, with no legacy `_V1` mapping rows.
  - fix: Either rewrite these benchmark-status rows to the canonical unsuffixed env names with `formerly *_V1` notes, or add explicit ENV_REFERENCE legacy rows for the old names.
- **[P2] contradiction** `.opencode/specs/system-spec-kit/028-memory-search-intelligence/keep-off-flag-roadmap.md:69` — Roadmap says `SPECKIT_GROUNDING_SIGNAL_V1` stays off after benchmark says deleted
  - evidence: Roadmap row says `SPECKIT_GROUNDING_SIGNAL_V1` is `STAY-OFF, neutral`, but `.opencode/specs/system-spec-kit/028-memory-search-intelligence/benchmark-status.md:276` says `SPECKIT_GROUNDING_SIGNAL_V1` is `DELETED` and "Deleted with its flag, reader, fixture and test".
  - fix: Update the roadmap row to `DELETED` or move it to a historical/deleted-flags section; if the historical env name remains in docs, add an ENV_REFERENCE deleted legacy row.
