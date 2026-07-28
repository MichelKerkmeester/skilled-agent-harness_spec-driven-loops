# Iteration 004 — Maintainability (docs, metadata, test debt)

## Focus
D4 Maintainability: documentation and metadata that still teach or depend on the deleted skill, increasing follow-on change cost and false confidence.

## Method
- Diffed plugins README against actual plugin directory listing
- Read system-spec-kit graph-metadata sibling/prerequisite edges
- Checked sk-doc skill-root-metadata-contract S-tier roster
- Confirmed compact-merger.vitest.ts import path absent

## Findings

### P0 - Blockers
- **P0-004**: compact-merger test imports deleted WorkingSetTracker module — `.opencode/skills/system-spec-kit/mcp-server/tests/compact-merger.vitest.ts:4` — Unresolvable import into deleted skill. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/compact-merger.vitest.ts:4]

### P1 - Required
- **P1-007**: plugins README still documents deleted mk-code-graph plugins — `.opencode/plugins/README.md:103` — Tree/table list absent plugins. [SOURCE: .opencode/plugins/README.md:103]
- **P1-008**: system-spec-kit graph-metadata still edges to system-code-graph — `.opencode/skills/system-spec-kit/graph-metadata.json:27` — sibling + prerequisite_for remain. [SOURCE: .opencode/skills/system-spec-kit/graph-metadata.json:27]

### P2 - Advisories
- **P2-002**: sk-doc S-tier roster still lists system-code-graph — `skill-root-metadata-contract.md:52`. [SOURCE: .opencode/skills/sk-doc/create-skill/references/shared/skill-root-metadata-contract.md:52]

## Adversarial self-check (P0-004)
Confirmed: hard import, not a string fixture. Same class as P0-003.

## Ruled Out
- Entire plugins host broken — other plugins remain; only deleted pair is missing while docs lag.

## Recommended Next Focus
Iteration 5 broadened pass: stress-harness mk_code_index wiring, durability test imports, and re-check whether any prior P0 was overstated; sweep agent mirrors for residual grants.

Review verdict: FAIL
