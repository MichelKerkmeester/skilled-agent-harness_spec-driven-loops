# Iteration 005 — final parity and handoff audit

## Final audit result

The final read-only parity audit passed for the detached lineage snapshot. The same rg --json query used to create inventory.external.json returned 89,856 external matching lines across 18,587 paths. The inventory contains exactly 89,856 path-plus-line rows across exactly 18,587 paths: extra rows 0, stale rows 0, JSON parse errors 0, missing required hit fields 0, excluded-path violations 0, and colon-containing path keys 0.

The external scan used --no-ignore-global so root opencode.json was included despite the user's global ignore file. It excluded .git, node_modules, z_archive, the current lineage, and .opencode/skills/system-spec-kit/mcp-server. The target server remains represented by inventory.external.json.mcpServer, with representedSeparately true. The inventory is the exhaustive row-level record for the external surface set; its path-plus-line identity is the final parity key.

## Finding 1 — requested root coverage is explicit

The final artifact has these live configuration counts: .claude/mcp.json 19, .codex/config.toml 15, .cursor/mcp.json 19, .pi/mcp.json 13, root opencode.json 19, and .env.example 320. The requested root families are present with these live row counts: .opencode/commands 84 files/621 rows, .opencode/agents 8/48, .claude/agents 11/56, .codex/agents 8/46, .pi/agents 8/46, .opencode/hooks 24/95, .opencode/plugins 13/70, and .opencode/bin 34/282. AGENTS.md has 11 rows.

Negative controls are recorded: .devin, .claude/hooks, root CLAUDE.md, root REPO RULES.md, and .utcp_config.json have zero target rows. The absence of .utcp_config.json is expected and was verified after bypassing the global ignore. ENV-REFERENCE.md under the target MCP tree is covered by the aggregate rather than expanded.

## Finding 2 — final lifecycle and surface counts

The external snapshot has 58,641 live hit-lines in 15,890 live paths and 31,215 historical hit-lines in 2,697 historical paths. Historical classification is structural and intentionally conservative: paths under runs, research, reports, reviews, deltas, archive, fixtures, snapshots, and JSONL are historical narrative; all other matching rows are live instruction or implementation. The JSON row preserves the classification and action for audit.

| Surface type | Hit-lines all/live | Files all/live |
|---|---:|---:|
| spec packet | 71,602 / 44,441 | 15,042 / 12,597 |
| catalog/playbook/benchmark | 12,017 / 8,281 | 2,010 / 1,884 |
| documentation | 140 / 140 | 17 / 17 |
| config/metadata | 85 / 85 | 5 / 5 |
| hook | 1,484 / 1,358 | 494 / 442 |
| agent | 301 / 273 | 84 / 72 |
| command | 621 / 621 | 84 / 84 |
| skill/reference | 1,292 / 1,292 | 464 / 464 |
| code | 510 / 504 | 115 / 111 |
| bin launcher/shim | 267 / 267 | 30 / 30 |
| plugin/bridge | 25 / 25 | 5 / 5 |
| test | 718 / 605 | 140 / 87 |
| environment | 325 / 325 | 2 / 2 |
| package/script | 1 / 1 | 1 / 1 |
| CI | 0 / 0 | 0 / 0 |
| mcp-server external bucket | 468 / 423 | 94 / 89 |

The large spec-packet total is a repository-surface count, not a runtime-consumer count. The target server package itself is intentionally absent from this table and appears once in the MCP aggregate.

## Finding 3 — final phase and reference-kind counts

| Owner | Hit-lines all/live | Files all/live |
|---|---:|---:|
| 002 rewire | 39,570 / 27,776 | 10,097 / 8,987 |
| retain exception | 18,847 / 6,919 | 2,686 / 2,105 |
| 003 delete | 31,439 / 23,946 | 5,804 / 4,798 |

The reference-kind totals are: env flag 43,690/33,253 live lines; doc mention 30,477/13,975; config entry 6,282/5,703; code import 5,378/3,305; tool call 3,510/1,937; tool grant 146/115; and test 371/353. Every hit has a concrete action and break-risk label. A file can have multiple owners because mixed shared/server contracts are the primary risk.

## Finding 4 — MCP aggregate and parent estimate

The target tree aggregate is 3,203 regular worktree files, 32,456,976 bytes, and 618,794 newline-counted lines; 1,481 tracked files, 20,273,034 bytes, and 453,964 tracked newline-counted lines. Its target-term scan found 703 files and 7,756 matching lines. The server schema exposes exactly 41 tools, while 37 names occur literally in the current target-tree scan; the discrepancy is a schema/registration representation detail, not an omitted tool. The aggregate records all 41 names and 410 unique server-tree flag identifiers. The external inventory records 797 unique flag identifiers.

The parent estimate of 41 tools is confirmed. The tracked tree is +1 file and +151 lines against the parent’s 1,480-file/453,813-line estimate. The parent’s 373 flags is not reproducible on either the current server-tree scope (410) or external scope (797), and the scopes include different shared/advisor aliases. The approximately 167 consumer estimate is a logical ownership estimate, not an exhaustive file/hit count; the raw census cannot validate it because documents, specs, generated evidence, and multiple rows per consumer are mixed.

## Finding 5 — final handoff and break-risk conclusion

Phase 002 owns all live consumer rewiring: context/agent/command grants, deep-loop memory persistence, workflow indexing/daemon branches, generator/templates, tests/playbooks, and the split between server-only and retained advisor/HF/IPC infrastructure. Phase 003 owns deletion only after those replacements are present: the full target server tree, its package/bin/process lifecycle, runtime registrations, launchers/shims, memory plugin/bridge/hooks, memory-only grants/routes, server-only environment rows, install/catalog entries, and obsolete tests.

The old contract can break at five seams if deletion is broad: workflow.ts importing @spec-kit/mcp-server/api/indexing; orphan/session sweepers sharing launcher and HF socket logic; shared embeddings/IPC/HF-local serving system-skill-advisor; deep-loop YAML/reducer/ledger persistence; and generator/install/catalog producers that create future memory consumers. Retain system-skill-advisor, shared HF model-server socket capability, shared embeddings/IPC, deep-loop lock/projection state, and historical evidence unless a row is explicitly server-only.

## Final stop condition

All five mandatory research iterations completed. Convergence telemetry was recorded as 0.94, 0.80, 0.65, 0.45, and 0.25 for iterations 001–005 and was not used to synthesize early. This run stopped because config.maxIterations reached 5. No repository tests, validation, generated-context command, memory MCP call, or git write was run by this detached lineage; the final proof consisted of read-only source inspection, JSON parsing, target-tree census, and scan-to-inventory parity.

## New information ratio

0.25 — the final iteration adds parity proof and closes coverage questions; it confirms the classification and handoff produced by iterations 001–004.
