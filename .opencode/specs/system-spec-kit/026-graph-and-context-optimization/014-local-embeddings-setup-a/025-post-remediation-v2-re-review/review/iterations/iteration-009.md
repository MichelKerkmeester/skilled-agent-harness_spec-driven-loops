# Iteration 009 — Local-LLM Legacy Hunt

## Focus
I scanned maintainability surfaces that can preserve stale setup knowledge after code fixes: command prompt packs, generated runtime command mirrors, manual playbooks, and tests/fixtures around embedding profile filenames. The goal was to separate intentional legacy lookup/test-temp usage from residue that keeps teaching the old singleton DB or dtype-less Voyage profile contract.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-009-001 | P2 | maintainability | .opencode/commands/doctor.md:43 | "`memory`        \| `mcp_server/database/context-index.sqlite` + voyage embedding DB" | confirmed-residue | Update the router prompt-pack Gate 3 table to describe resolved profile-keyed memory DBs rather than the singleton DB plus an unnamed Voyage sidecar. |
| L-009-002 | P2 | maintainability | .opencode/commands/doctor.md:44 | "`causal-graph`  \| `mcp_server/database/context-index.sqlite` causal_edges table" | confirmed-residue | Change the causal-graph command prompt source to refer to the active profile-keyed memory DB or resolver, not a fixed singleton file. |
| L-009-003 | P2 | maintainability | .opencode/commands/doctor/update.md:213 | "`context-index` \| `mcp_server/database/context-index.sqlite`" | confirmed-residue | Refresh the `/doctor:update` subsystem contract to use the active profile DB path contract. |
| L-009-004 | P2 | maintainability | .opencode/commands/doctor/update.md:214 | "`vector-index`  \| `mcp_server/database/context-index__voyage__voyage-4__1024.sqlite`" | confirmed-residue | Replace the dtype-less hardcoded Voyage filename with the profile-keyed pattern or runtime-resolved active DB path. |
| L-009-005 | P2 | maintainability | .opencode/commands/doctor/update.md:268 | "`mcp_server/database/context-index.sqlite` and `mcp_server/database/context-index.sqlite.pre-doctor-update.*.bak`" | confirmed-residue | Update mutation-boundary examples so snapshots are keyed from the resolved active profile filename. |
| L-009-006 | P2 | maintainability | .opencode/commands/doctor/update.md:269 | "`mcp_server/database/context-index__voyage__voyage-4__1024.sqlite` and `mcp_server/database/context-index__voyage__voyage-4__1024.sqlite.pre-doctor-update.*.bak`" | confirmed-residue | Replace the stale Voyage literal with `context-index__<provider>__<safe-model>__<dim>__<dtype>.sqlite` or a resolver-backed example. |
| L-009-007 | P2 | maintainability | .opencode/commands/doctor/update.md:323 | "`snapshot_path\": \"mcp_server/database/context-index.sqlite.pre-doctor-update.3.4.1.0.20260509T130100Z.bak`" | confirmed-residue | Regenerate the state-log example from a profile-keyed DB snapshot path. |
| L-009-008 | P2 | maintainability | .gemini/commands/doctor.toml:2 | "`memory`        \| `mcp_server/database/context-index.sqlite` + voyage embedding DB" | confirmed-residue | Regenerate the Gemini `/doctor` command mirror after fixing the OpenCode prompt source. |
| L-009-009 | P2 | maintainability | .gemini/commands/doctor/update.toml:2 | "`vector-index  \| `mcp_server/database/context-index__voyage__voyage-4__1024.sqlite`" | confirmed-residue | Regenerate the Gemini `/doctor update` command mirror so it stops shipping the dtype-less Voyage DB literal. |
| L-009-010 | P2 | maintainability | .opencode/skills/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:246 | "`expect(profile.getDatabasePath('/tmp/spec-kit-db')).toBe('/tmp/spec-kit-db/context-index__voyage__voyage-4__1024.sqlite');`" | confirmed-residue | Update the startup-profile assertion to the canonical dtype-bearing profile filename or make the expected path come from `resolveActiveProfileDbPath`. |
| L-009-011 | P2 | maintainability | .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/326-doctor-memory-sigint-cancellation.md:46 | "`.opencode/skills/system-spec-kit/mcp_server/database/context-index__voyage__voyage-4__1024.sqlite`" | confirmed-residue | Refresh the manual playbook example to a dtype-bearing Voyage profile filename or a wildcard that preserves the dtype segment. |

## Iteration summary
- Files scanned: 81
- New findings: 11 (P0=0, P1=0, P2=11)
- Out-of-scope/historical noted but NOT flagged: 18
- Notes: Saturation is close for maintainability. Most remaining hits were already covered in iterations 001-008, intentional legacy-model lookup support, allowed `test_backward_compat.py` assertions, vitest temp-dir `context-index.sqlite` idioms, or excluded forensic/history paths.
