# Iteration 4: Angle 4, SYSTEM-SKILL-ADVISOR

## Focus

Audit the advisor daemon, CLI front door, scorer thresholds, graph metadata, hook brief, state containment and MCP tool IDs; compare only the advisor claims visible in the draft.

## Actions Taken

- Read the state log and strategy before this angle.
- Read the advisor skill contract, CLI shim, hook reference, graph metadata/leaf manifest and selected native scorer/tool descriptors.
- Read the draft’s advisor section and the current workspace-root/database path policies.

## Findings

## INVENTORY

| Surface | Value | Source |
|---|---|---|
| Advisor package shape | `system-skill-advisor` is a standalone single-mode skill with workflow mode `system-skill-advisor`; it has no `mode-registry.json`. The package owns an MCP server, handlers, schemas, scripts, tests, libraries and package-local database. | [SOURCE: `.opencode/skills/system-skill-advisor/SKILL.md:35`] [SOURCE: `.opencode/skills/system-skill-advisor/SKILL.md:85`] [SOURCE: `.opencode/skills/system-skill-advisor/SKILL.md:87`] |
| Graph identity | `graph-metadata.json` identifies `system-skill-advisor` as the `system` family and records `enhances` edges to the nine routed hubs/skills, including `system-spec-kit` and `system-deep-loop`. | [SOURCE: `.opencode/skills/system-skill-advisor/graph-metadata.json:3`] [SOURCE: `.opencode/skills/system-skill-advisor/graph-metadata.json:10`] |
| Leaf manifest | The generated manifest projects one mode, `system-skill-advisor`, and enumerates typed leaves from feature-catalog, manual-testing-playbook and references; the MCP engine is intentionally outside the leaf roots. | [SOURCE: `.opencode/skills/system-skill-advisor/leaf-manifest.json:1`] [SOURCE: `.opencode/skills/system-skill-advisor/leaf-manifest.json:109`] [SOURCE: `.opencode/skills/system-skill-advisor/SKILL.md:87`] |
| MCP tool IDs | Nine tools are exposed: `advisor_recommend`, `advisor_rebuild`, `advisor_status`, `advisor_validate`, `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, `skill_graph_validate`, and `skill_graph_propagate_enhances`. | [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/tools/index.ts:43`] [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/tools/skill-graph-tools.ts:18`] [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/tools/skill-graph-tools.ts:75`] |
| Graph tool behavior | Scan indexes metadata into SQLite; query supports ten structural query types; status reports graph health; validate checks schema/edges/weights/symmetry/cycles; propagation defaults to report mode and exposes propose/apply modes. | [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/tools/skill-graph-tools.ts:18`] [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/tools/skill-graph-tools.ts:33`] [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/tools/skill-graph-tools.ts:53`] [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/tools/skill-graph-tools.ts:75`] |
| Scoring thresholds | Native advisor requests default to confidence `0.8` and uncertainty `0.35`; recommendations pass only when both comparisons succeed. The Python compatibility shim exposes the same defaults and a `--confidence-only` bypass. | [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:842`] [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:845`] [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/fusion.ts:785`] [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:4722`] |
| Scorer calibration | The native scorer maintains explicit confidence and uncertainty calibration, including a `0.82` read-only route floor, `0.82` task-intent floor, and `0.42` low-information ambiguity floor. | [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/scoring-constants.ts:175`] [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/scoring-constants.ts:197`] |
| CLI front door | `.opencode/bin/skill-advisor.cjs` resolves the package-local compiled CLI, checks dist freshness, supports JSON/JSONL error envelopes, defaults the IPC socket to `/tmp/system-skill-advisor/daemon-ipc.sock`, and returns protocol exit `69` or retryable exit `75`. | [SOURCE: `.opencode/bin/skill-advisor.cjs:19`] [SOURCE: `.opencode/bin/skill-advisor.cjs:27`] [SOURCE: `.opencode/bin/skill-advisor.cjs:43`] [SOURCE: `.opencode/bin/skill-advisor.cjs:100`] |
| Daemon/state containment | The advisor graph state is package-local at `.opencode/skills/system-skill-advisor/mcp-server/database/skill-graph.sqlite`; the shared root resolver anchors on the real system-spec-kit sentinel and hoists above the outermost `.opencode` tree if a walk-up fails, preventing nested `.opencode` state leaks. | [SOURCE: `.opencode/skills/system-skill-advisor/references/config/db-path-policy.md:47`] [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/utils/workspace-root.ts:15`] [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/utils/workspace-root.ts:31`] [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/utils/workspace-root.ts:84`] |
| Freshness and lease | The daemon reports `live`, `stale`, `absent` or `unavailable` trust states; graph DB access uses a single-writer lease with a 30-second heartbeat and WAL/busy-timeout settings. | [SOURCE: `.opencode/skills/system-skill-advisor/references/runtime/freshness-contract.md:52`] [SOURCE: `.opencode/skills/system-skill-advisor/references/runtime/daemon-lease-contract.md:58`] [SOURCE: `.opencode/skills/system-skill-advisor/references/runtime/daemon-lease-contract.md:67`] [SOURCE: `.opencode/skills/system-skill-advisor/references/runtime/daemon-lease-contract.md:79`] |
| Hook brief | Hooks are advisory and fail-open; they never replace explicit skill loading, persist raw prompt text or block prompts. The hook uses a shared package, freshness status, deduplication, runtime-specific delivery and a warm-only Python fallback. | [SOURCE: `.opencode/skills/system-skill-advisor/hooks/skill-advisor-hook.md:20`] [SOURCE: `.opencode/skills/system-skill-advisor/hooks/skill-advisor-hook.md:29`] [SOURCE: `.opencode/skills/system-skill-advisor/hooks/skill-advisor-hook.md:55`] |
| CLI mutation boundary | CLI calls are untrusted by default. Read tools need no trust flag; `advisor_rebuild`, `skill_graph_scan` and apply-mode propagation require `--trusted` or the maintainer environment flag. | [SOURCE: `.opencode/skills/system-skill-advisor/SKILL.md:302`] [SOURCE: `.opencode/skills/system-skill-advisor/SKILL.md:304`] |

## DRIFT

| Draft line | Claim | Verdict | Actual state | Severity | One-line correction | Source |
|---|---|---|---|---|---|---|
| 32 | The advisor is already standalone and its skill graph was tidied/freshened. | TRUE | The package is a standalone single-mode skill with a native MCP server and graph metadata/leaf projection. | P2 | Retain the standalone and graph-freshness description, but add the exact MCP/CLI surface. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:32`] [SOURCE: `.opencode/skills/system-skill-advisor/SKILL.md:87`] |
| 94 | v4 changes are narrower: stricter anchoring, graph tidying and clean Codex launch. | TRUE | The current advisor has a shared workspace-root resolver, native graph package and a compiled CLI shim with freshness checks. | P2 | Keep as a high-level summary; replace “cleanly” with the observable Node/ABI or CLI freshness contract if operator detail is needed. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:94`] [SOURCE: `.opencode/bin/skill-advisor.cjs:61`] |
| 98 | State can still leak a stray `.advisor-state` file from a session started inside a spec folder; cleanup remains open. | STALE | Current policy stores the graph DB in the advisor package, and the resolver structurally hoists above the outermost `.opencode` tree on fallback; no current source read showed the claimed `.advisor-state` path. | P1 | Say state containment is enforced by package-local DB ownership and structural `.opencode` hoisting; only retain a residual warning if a reproduction finds a live stray-file producer. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:98`] [SOURCE: `.opencode/skills/system-skill-advisor/references/config/db-path-policy.md:92`] [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/utils/workspace-root.ts:31`] |
| 104 | Codex starts the advisor with the Node runtime whose ABI 141 matches native SQLite. | MISSING | The draft claim is operationally specific, but this angle confirmed only the CLI’s compiled-entry freshness check and did not inspect the installed native module ABI. | P1 | Reproduction pass must inspect the package build metadata and a Codex startup trace before retaining the ABI number. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:104`] [SOURCE: `.opencode/bin/skill-advisor.cjs:61`] |

## DISAGREEMENTS

The draft’s line 98 describes an unresolved `.advisor-state` leak, while current advisor code and package-local policy define structural `.opencode` hoisting and a package-local SQLite state path; a reproduction pass must settle whether any hook-specific producer still bypasses the shared resolver. [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/utils/workspace-root.ts:31`] [SOURCE: `.opencode/skills/system-skill-advisor/references/config/db-path-policy.md:92`]

## CONFIDENCE

Confirmed: package topology, single workflow mode, graph identity, nine tool IDs, dual thresholds, scorer floors, CLI exit classes, package-local database policy, structural resolver, freshness states, lease cadence and hook fail-open behavior were opened directly. Inferred: the draft’s ABI-141 claim remains unverified in this angle because the installed native module/build metadata and a live Codex startup were not opened; the `.advisor-state` residual leak is treated as stale based on current producers, pending reproduction.

## Questions Answered

- How is system-skill-advisor routed, scored and contained?

## Questions Remaining

- What does sk-doc ship for create modes, templates and quality gates?
- Does the ABI-141 statement reproduce from current package metadata and runtime startup?

## Next Focus

SK-DOC: inspect sk-create-* modes, /create:* commands, naming guard, templates and quality gates.

## Reflection

This pass separated the advisor’s current runtime contract from the draft’s narrative. The most material correction is that containment is now a structural boundary in code; the only open advisor-specific question is the ABI number and any producer that could still create a stray `.advisor-state` file.
