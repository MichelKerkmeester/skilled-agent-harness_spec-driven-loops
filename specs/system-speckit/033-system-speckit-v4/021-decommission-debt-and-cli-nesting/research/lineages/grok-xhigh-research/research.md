---
title: "Research Synthesis: Memory-decommission residue the loops missed"
trigger_phrases: []
---
# Research Synthesis: Memory-decommission residue the loops missed

**Lineage:** grok-xhigh-research (`cli-cursor` / `cursor-grok-4.6-xhigh-fast`)
**Session:** `fanout-grok-xhigh-research-1788581555646-udzw72`
**Spec:** `.opencode/specs/system-speckit/054-decommission-debt-fixes`
**Stop reason:** `max_iterations` (20/20; `stopPolicy: max-iterations`; convergence was telemetry only)
**Mode:** Report-only — no product implementation; write surface is this lineage only.
**resource-map.md:** absent at init (`resource_map_present: false`); no placeholder reference invented.
**Continuity save:** skipped (fan-out containment forbids `generate-context.js`).

---

## 1. METADATA

- **Research ID:** RESEARCH-054-grok-xhigh-research
- **Feature/Spec:** `.opencode/specs/system-speckit/054-decommission-debt-fixes`
- **Charter sources:** `specs/system-speckit/052-memory-decommission-landing/goal.md` (D1–D11 + LOG); `.opencode/specs/system-speckit/053-spec-kit-runtime-rename/implementation-summary.md`; 054 `spec.md` / `tasks.md`; 053 review reports under `review/lineages/luna-max-pass3*`
- **Status:** Complete (lineage synthesis)
- **Date Started:** 2026-09-05
- **Date Completed:** 2026-09-05
- **Researcher(s):** fan-out lineage grok-xhigh-research
- **Shared fact:** 054 is a debt packet (T004–T008 done, T009–T012 open). It is not a second decommission and has not claimed complete.

---

## 2. INVESTIGATION REPORT

The programme landed the memory-database decommission (052), renamed `system-spec-kit/mcp-server` to `runtime` (053 / D8), and opened 054 to close recorded debt. Review loops reached PASS on the rename tree. This lineage asked what they missed.

Method: read the charter docs first, then rotate seven angles (live retired surfaces; registrations/hooks/CI/doctor; deps vs importers; weakened tests; doc drift; successor coverage; lying gates). Prefer `rg` and file:line citations. Dist, node_modules, trigger-index.json, playbooks, catalogs, changelogs were not read. No nested executor. No `validate.sh` / `generate-context.js`.

Result: there is **no live memory MCP, spec-memory plugin, zvec lane, or `/memory:manage`/`learn` command**. The misses are leftover writers and directories, unused vector deps, tests that pass on deleted modules, doctor assets that still snapshot `mcp-server/database`, code READMEs that describe deleted files, successor gaps the docs already declare, and gates that pass when opted out.

---

## 3. EXECUTIVE OVERVIEW

**Verdict:** The decommission removed the operator-facing server. It did not remove every writer, default filename, leftover compiled tree, or doctor snapshot that still serves or describes that store. 054 absorbed five recorded runner/docs rows (T004–T008) and left the larger residue set unscoped.

**Do not treat as misses:** skill-advisor MCP, shared HF server and `runtime/database` directory (D5), `/memory:save` + `/memory:search`, `/doctor memory` on the trigger index, Claude/Pi skill symlinks, the eleven restored session-lifecycle registrations.

**Do not close T012** by writing "zero debt" into the 052 log. T011 can pass on tracked-file sweep + default-off freshness while F-I19-003 remains.

**Highest-signal leftovers (P1):** leftover ignored `system-spec-kit/mcp-server/`; `storeEntities` / `rebuildAutoEntities` still mutating `memory_index`; default `context-index.sqlite` path; `sqlite-vec` with no importer; tests requiring deleted dist modules; doctor-update VACUUM of `mcp-server/database/*.sqlite`; extraction README ghost pipeline; CONTINUITY_FRESHNESS skip-as-pass; startup priming with no successor.

---

## 4. CORE ARCHITECTURE

### 4.1 What was retired vs what remains

| Surface | Status after 052/053 | This lineage |
|---------|----------------------|--------------|
| Memory MCP / spec-memory plugin / launchers | Removed (052 DONE WHEN) | Confirmed absent (F-I2-005, F-I10-004) |
| zvec lane / system-plugins / packets 050–051 | Retired (D11) | Confirmed absent (F-I3-001) |
| `system-spec-kit/mcp-server` authored package | Renamed to `runtime` (D8) | Leftover **untracked** compiled tree remains (F-I10-001) |
| `@spec-kit/runtime` | Library, not a service (F-I3-002) | Identity is clean; leftover dir is the miss |
| Trigger index + ripgrep + continuity writer | Successors | Declared lexical-only; startup has no successor (F-I8-001) |
| `runtime/database` | D5 HF default directory | Not a miss (F-I2-006). Default **filename** `context-index.sqlite` is a miss (F-I2-001, F-I18-003) |

### 4.2 Two spec trees

Public `specs/system-speckit/052-memory-decommission-landing/goal.md` holds D1–D11 and the LOG. `.opencode/specs/system-speckit/054-decommission-debt-fixes` is the debt packet this lineage is bound to. 053 review reports live under `.opencode/specs/.../053-.../review/lineages/`. The attempt-1 stalled report named in the 052 LOG was not found (F-I1-006).

---

## 5. TECHNICAL SPECIFICATIONS

### 5.1 Live leftover writers (angle 1)

- `rebuildAutoEntities` SELECTs/DELETEs `memory_index` / `memory_entities`. [SOURCE: runtime/lib/extraction/entity-extractor.ts:516-582]
- `storeEntities` INSERT OR REPLACE into `memory_entities`. [SOURCE: entity-extractor.ts:282-308]
- Production importer `graph-metadata-parser.ts` uses `extractEntities` only. [SOURCE: runtime/lib/graph/graph-metadata-parser.ts:11]
- `folder-detector.ts` still reads `session_learning` from `DB_PATH` with no live INSERT (F-I5-002, F-I8-002).
- `legacy-lane.mjs` still queries `memory_index` JOIN `active_memory_projection` and cites deleted `hybrid-search.ts` (F-I5-006).
- `runtime/shared/paths.js` / `profile.js` still default `DB_PATH` to `context-index.sqlite` (F-I2-001). `resolveDatabasePaths()` uses that basename (F-I18-003). HF leases still key on `MEMORY_DB_PATH` (F-I2-002).

### 5.2 Leftover directory and doctor registrations (angle 2)

- Untracked `.opencode/skills/system-spec-kit/mcp-server/` exists; `git ls-files` empty; `node_modules` symlink target missing (F-I10-001/002). Breaks skill-wide `rg`.
- Eleven session-lifecycle registrations from `273767431d` still resolve to `runtime/dist/hooks/<runtime>/` (F-I4-001). Not dropped again.
- `.devin/hooks.v1.json` fallbacks still say `run npm run build in mcp-server` (F-I4-002).
- `doctor-update.yaml` phase 3 still VACUUM-snapshots `mcp-server/database/*.sqlite` (F-I14-001). Step name `context-index` now runs `generate-trigger-index.mjs` (F-I14-002).
- Doctor assets still list ignored D5 sqlite files; `validate-command-references.cjs` `existsSync` fails on a fresh worktree (F-I14-003). 052 logged this; 054 did not absorb it.

### 5.3 Deps (angle 3)

- `scripts/package.json` declares `sqlite-vec` and `sqlite-vec-darwin-arm64` with no source importer (F-I5-001). Skill-root `sqlite-vec.d.ts` types that module (F-I12-001).
- `@modelcontextprotocol/sdk` stays on shared because the advisor imports IPC (F-I5-004). Do not drop.
- `better-sqlite3` still has leftover readers; do not drop first (F-I12-004).

---

## 6. CONSTRAINTS & LIMITATIONS

- Write surface was this lineage only. Findings are not implemented.
- `validate.sh`, `generate-context.js`, and git writes were forbidden. Gate behavior is read from source (F-I9), not re-run.
- Reading budget excluded dist contents, node_modules, trigger-index.json, playbooks, catalogs, changelogs. Dist leftovers were inferred from names and existence.
- `onnxruntime-common` fresh-install proof remains UNKNOWN (F-I15-002).
- 054 T009 five-agent alignment has not run; leftover code READMEs (F-I18-001) sit in that scope.

---

## 7. INTEGRATION PATTERNS

### 7.1 Successors vs retired coverage (angle 6)

Declared loss table is honest for semantic/vector/decay/access/causal/checkpoints. [SOURCE: references/memory/memory-system.md:207-218]
Gaps the successors do not cover and the harness still pretends to:

| Retired behavior | Successor | Residue |
|------------------|-----------|---------|
| Startup session continuity from index | Four-line fallback in `session-prime` | README still claims cached Session Continuity (F-I4-004, F-I8-001) |
| `session_learning` writer | Hook-state `lastSpecFolder` on resume only | folder-detector still reads the table (F-I5-002, F-I8-002) |
| Hybrid/sqlite retrieval | Trigger index + ripgrep | `legacy-lane` + doctor 3-arm parity still grade sqlite (F-I5-006, F-I8-003) |
| Search-result session dedup | None | Continuity still fingerprints (F-I8-004 vs loss table row) |

### 7.2 Mirrors

`.claude/skills` and `.pi/skills` are symlinks to `.opencode/skills`. Codex/Cursor/Devin have no skill-tree copies (F-I10-003). Hook registrations are the live mirror surface, not duplicated skill docs.

---

## 8. IMPLEMENTATION GUIDE

Smallest-fix order if a follow-on packet absorbs this lineage (not 054 T009 as written):

1. Delete leftover `system-spec-kit/mcp-server/` (untracked compiled state). Name rollback first.
2. Remove `storeEntities` / `rebuildAutoEntities` / `rebuildEntityCatalog` / `updateEntityCatalog` and their vitest describes. Keep `extractEntities` for graph-metadata-parser.
3. Drop `sqlite-vec` (+ darwin optional) and `sqlite-vec.d.ts`.
4. Point `DB_PATH` / `resolveDatabasePaths` at an honest D5 name or stop exporting a default db file.
5. Rewrite `doctor-update.yaml` snapshot globs; rename `context-index` step to `trigger-index`; skip generated sqlite in `validate-command-references.cjs`.
6. Delete or skip tests that `require` deleted cognitive / hybrid-search / retry-manager dist (F-I6-001/002). Fix naming-migration missing-file pass (F-I6-003).
7. Rewrite `runtime/lib/extraction/README.md` to the files that exist (F-I18-001). This is in T009's letter.
8. Do not set 052 DONE WHEN to "zero debt" from T012.

---

## 9. CODE EXAMPLES & SNIPPETS

Leftover writer (confirmed):

```ts
// entity-extractor.ts:533-536
const memories = db.prepare(`
  SELECT id, spec_folder, content_text
  FROM memory_index
```

Doctor snapshot (confirmed):

```yaml
# doctor-update.yaml:341
for src in mcp-server/database/*.sqlite mcp-server/database/*.db; do
```

Default filename (confirmed via F-I2-001 + config.ts:94-96): `path.basename(DB_PATH)` still joins `context-index.sqlite`.

Ghost README files (existence-checked ABSENT): `extraction-adapter.ts`, `redaction-gate.ts`, `ontology-hooks.ts`.

---

## 10. TESTING & DEBUGGING (angle 4)

Tests that stay green on a gone surface:

| Test | Why it lies | Finding |
|------|-------------|---------|
| `test-integration.vitest.ts` / playbook fixture | requires deleted cognitive + hybrid-search dist | F-I2-003, F-I6-001 |
| `test-retry-manager-behavioral.js` | requires deleted retry-manager / vector-index; asserts `vec_memories` | F-I6-002 |
| `test-naming-migration.js` | missing files report 0/budget and pass | F-I6-003 |
| `entity-extractor.vitest.ts` | certifies `storeEntities` / rebuild against sqlite | F-I11-003, F-I18-002 |
| `workflow-invariance.vitest.ts` | allowlists four ABSENT playbooks including `spec-memory-plugin.md` | F-I16-001 |
| `parity-check.vitest.ts` | still creates `memory_index` for the legacy arm | F-I6-005 |
| `test-folder-detector-functional.js` T-FD06a | certifies `session_learning` or skips if DB absent | F-I6-004 |

`sweep-memory-residue.vitest.ts` is a residue sweep, not a live server test (ruled out in iteration 6).

---

## 11. RECOMMENDATIONS

1. **Keep 054 T009 as README/standards alignment.** Put leftover writers, leftover `mcp-server/` dir, sqlite-vec, and doctor snapshot globs on explicit extra tasks or a new packet (F-I13-002).
2. **Change T011's sweep** to include untracked leftover package directories and the doctor-update glob. Tracked-only live-0 will miss F-I10-001.
3. **Change T012** to list remaining residue or open a follow-on. Do not satisfy 052 DONE WHEN from a green T011 (F-I19-004).
4. **Fix lying gates independently of 054 close:** CONTINUITY_FRESHNESS missing/zero fingerprint should not pass (F-I9-001); validate.sh helper failure should exit 3 (F-I9-002).
5. **Leave D5 alone.** Advisor MCP, HF server, shared IPC SDK, `/memory:save` name.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Treat last 053 review report as a live defect list | Pass-3 P2s already gone live | README.md:771 now stress-test/ + runtime/ | 1 |
| Treat advisor MCP / fixture phrases / `runtime/database` as a still-running memory MCP | D5 preserved set; no spec-memory in configs | F-I2-005, F-I2-006 | 2 |
| Treat advisor hook TARGET_REL mcp-server paths as runtime MCP identity | Those paths are the advisor package | F-I3-002, F-I9-005 | 3, 9 |
| Claim the eleven session-lifecycle registrations were dropped again | All eleven resolve to runtime/dist/hooks | F-I4-001 | 4 |
| Claim Pi was missed by the 273767431d restore | Pi uses `.pi/extensions` → runtime/hooks/pi | F-I4-001 | 4 |
| Drop `@modelcontextprotocol/sdk` from shared as D8 residue | Advisor IPC imports it (D5) | F-I5-004 | 5 |
| Treat sweep-memory-residue tests as live memory-server tests | They assert residue is gone | iteration 6 | 6 |
| Treat `/doctor memory` as a dangling memory-server command | It diagnoses the trigger index | F-I7-005 | 7 |
| Treat lexical-only retrieval over spec/skill docs as accidental residue | AGENTS.md declares the loss | AGENTS.md:330; F-I8-005 | 8 |
| Treat advisor routing-registry CI mcp-server paths as rename residue | Preserved advisor package | routing-registry-drift.yml | 9 |
| Treat missing Codex/Cursor/Devin skill copies as dropped registrations | Claude/Pi are symlinks; others have no skill tree | F-I10-003 | 10 |
| Delete all of entity-extractor | `extractEntities` is used by graph-metadata-parser | graph-metadata-parser.ts:11 | 11 |
| Drop `better-sqlite3` first | Leftover readers still type it | F-I12-004 | 12 |
| Treat T007 MCPResponse / rollback-runbook as still open | T007 done; files absent | tasks.md:50 | 13, 16 |
| Treat doctor `context-index` *action* as a sqlite rebuild | Action is generate-trigger-index.mjs | doctor-update.yaml:369-370 | 14 |
| Rediscover T004–T006 as open misses | Absorbed in 054 | tasks.md:47-49 | 15 |
| Treat `/memory:save` and `/memory:search` as dangling retired commands | Successor pair; manage/learn absent | F-I16-002 | 16 |
| Treat install-guide `/memory:* (2)` as manage/learn leftover | Matches live pair | install-guides/README.md:1350 | 17 |
| Treat transaction-manager as a leftover MCP handler | File+db recovery helper | transaction-manager.ts:1-8 | 18 |
| Treat advisor/HF/IPC/doctor-memory as residue | D5 | F-I19-001 | 19 |
| Escalate leftover set to a hidden live memory MCP (P0) | No live registration | F-I20-003 | 20 |

---

## 12. OPEN QUESTIONS

- Does a clean-worktree `npm install` produce `onnxruntime-common` for the HF provider? (F-I15-002, UNKNOWN)
- Is T011's residue sweep already scripted to see untracked leftover directories, or only git-tracked paths? (F-I13-003, INFERRED tracked-only)
- Where is the 052-named attempt-1 stalled review report? Path in the LOG was not found (F-I1-006).
- Should leftover sqlite writers be extra 054 tasks or a new packet? (F-I13-002, needs operator)
- Three sk-doc validator class defects remain owned by sk-doc (F-I15-001).

---

## 13. FUTURE-PROOFING & MAINTENANCE

- Any sweep that greps `system-spec-kit` must exclude leftover `mcp-server/node_modules` until that tree is deleted (F-I10-002).
- `--strict` no longer means warnings fail (F-I9-003). Completion claims that "validate.sh --strict passed" are not proof of freshness or continuity.
- Code READMEs that list files must be existence-checked (F-I18-001). T009 is the right home for that habit.
- Loss-table rows must be updated when a leftover writer is deleted so docs and code stay aligned (F-I20-001).

---

## 14. API REFERENCE

Surfaces this research treats as current (not residue):

| Surface | Role |
|---------|------|
| `/memory:search` | Trigger-index lookup + ripgrep recipes |
| `/memory:save` | Continuity writer (`scripts/memory/generate-context.ts`) |
| `/speckit:resume` | Recovery ladder |
| `/doctor memory` | Diagnoses `runtime/data/trigger-index.json` |
| `lookup-trigger-index.mjs` | Gate 1 retrieval |
| `@spec-kit/runtime` | Validation / metadata / hook-adapter library |

Retired names that must not be re-registered: spec-memory plugin, `/memory:manage`, `/memory:learn`, zvec lane, `system-plugins`, authored `system-spec-kit/mcp-server` package.

---

## 15. TROUBLESHOOTING GUIDE

| Symptom | Likely cause | Check |
|---------|--------------|-------|
| `rg` under system-spec-kit: `mcp-server/node_modules: No such file or directory` | Leftover broken symlink (F-I10-002) | `test -e .opencode/skills/system-spec-kit/mcp-server` |
| Integration tests fail requiring `working-memory` / `hybrid-search` | Deleted modules, tests not updated (F-I6-001) | `runtime/lib/cognitive/` existence |
| Doctor update snapshots unexpected sqlite | `mcp-server/database/*.sqlite` glob (F-I14-001) | doctor-update.yaml:341 |
| validate-command-references fails only on a fresh clone | Ignored D5 sqlite rows (F-I14-003) | doctor-update.yaml:104-107 |
| Packet "complete" with no continuity fingerprint | CONTINUITY_FRESHNESS off or missing_fingerprint pass (F-I9-001) | continuity-freshness.ts:305-319,542-544 |
| Startup shows four-line fallback | No successor for session index (F-I8-001) | session-prime.ts:141-142 |

---

## 16. ACKNOWLEDGEMENTS

Charter: 052 goal D1–D11 and LOG; 053 implementation-summary and luna-max-pass3 review reports; 054 spec/tasks. Prior iteration files in this lineage (001–020) are the evidence trail. D5 preserved-set owners (skill advisor, HF server, deep-loop) are intentionally out of the leftover list.

---

## 17. APPENDIX — Iteration trail

| # | Focus | Ratio | Status |
|---|-------|-------|--------|
| 1 | Programme charter | 1.00 | complete |
| 2 | Live memory surfaces | 0.85 | complete |
| 3 | zvec / plugins / mcp identity | 0.55 | complete |
| 4 | Session-lifecycle registrations | 0.70 | complete |
| 5 | Deps vs importers | 0.80 | complete |
| 6 | Tests of gone surfaces | 0.75 | complete |
| 7 | Documentation drift | 0.45 | complete |
| 8 | Successor coverage | 0.50 | complete |
| 9 | Lying gates | 0.70 | complete |
| 10 | Leftover mcp-server tree | 0.80 | complete |
| 11 | entity-extractor writers | 0.75 | complete |
| 12 | sqlite-vec + eval names | 0.55 | complete |
| 13 | 054 T009–T012 scope | 0.60 | complete |
| 14 | Doctor-update snapshots | 0.85 | complete |
| 15 | Unabsorbed 052 debt | 0.40 | complete |
| 16 | workflow-invariance allowlist | 0.50 | complete |
| 17 | ARCHITECTURE / install-guides | 0.35 | complete |
| 18 | Extraction README + DB path | 0.70 | complete |
| 19 | Contradiction sweep | 0.30 | complete |
| 20 | Loss table vs leftover harness | 0.25 | complete |

Last-3 ratio mean ≈ 0.42. Convergence threshold 3 was telemetry only under `max-iterations`.
