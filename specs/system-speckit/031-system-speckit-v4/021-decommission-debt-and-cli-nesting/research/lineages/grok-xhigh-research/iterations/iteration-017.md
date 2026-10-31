# Iteration 17: Docs that still frame generated memory artifacts

## Focus
Angle 5. ARCHITECTURE.md, install-guides, and the extraction comment register after the command-tree negative.

## Findings

### F-I17-001 — ARCHITECTURE.md still calls continuity "generated memory artifacts". CONFIRMED. P2
The recovery paragraph says generated memory artifacts are supporting context only, not the primary continuity record. [SOURCE: .opencode/skills/system-spec-kit/ARCHITECTURE.md:28]
The rest of the section is the successor story (`/speckit:resume`, handover, `_memory.continuity`, canonical spec docs). The phrase is D7-adjacent residue: it keeps "memory artifacts" as the name of the continuity writer output.
Smallest fix: say "generated continuity metadata".

### F-I17-002 — Skill Advisor install guide still names a shipped `spec-memory` packet. CONFIRMED. P2
`.opencode/install-guides/MCP - Skill Advisor.md` cites packet `003/006-shared-embedder-logic-with-spec-memory` as a shipped architecture-gap follow-on. [SOURCE: .opencode/install-guides/MCP - Skill Advisor.md:386]
That is a historical packet name, not a live launcher. D5 keeps the shared embedder. The string still teaches operators that spec-memory is a current partner.
Smallest fix: keep the packet id if it is the real folder name; add "retired partner name" or point at the shared-embedder packet without spec-memory in the prose.

### F-I17-003 — Root install-guide `/memory:* (2)` matches the live pair. CONFIRMED. P2 (negative)
Install-guides README counts `/memory:* (2)` among commands and describes `/memory:save` as the continuity writer and `/memory:search` as trigger-index + ripgrep. [SOURCE: .opencode/install-guides/README.md:566,1131,1142,1350]
That matches F-I16-002. Not a manage/learn leftover.
Smallest fix: none.

### F-I17-004 — Compact-inject "Working memory attention" labels are local heuristics. CONFIRMED. P2 (negative)
Already F-I4-005. No new caller of deleted `working-memory.ts` appeared in this pass. Do not promote those labels to a live cognitive module.
Smallest fix: rename the log labels when touching that file.

## Sources Consulted
- .opencode/skills/system-spec-kit/ARCHITECTURE.md:13-28
- .opencode/install-guides/MCP - Skill Advisor.md:386
- .opencode/install-guides/README.md:566,1131,1142,1350

## Assessment
- newInfoRatio: 0.35
- Novelty justification: ARCHITECTURE phrasing and the advisor install-guide packet name are new. Command counts are corroboration.
- Confidence: high on citations. Historical packet folder existence not re-checked (specs path may have moved).

## Reflection
- Worked: distinguish historical packet names from live launchers.
- Failed: none.
- Ruled out: install-guide `/memory:* (2)` as a manage/learn leftover.

## Dead Ends
- None.

## Recommended Next Focus
`transaction-manager` still recovers against a database file path (`resolveDatabasePaths`). Check whether that is leftover store coupling or a generic file+db helper.
