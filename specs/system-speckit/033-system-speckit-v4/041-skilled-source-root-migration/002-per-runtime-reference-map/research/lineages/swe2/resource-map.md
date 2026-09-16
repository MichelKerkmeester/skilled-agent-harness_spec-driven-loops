# Resource Map — lineage `swe2`

Everything this lineage produced, where to find it, and what it is for.

## Lineage root

`specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/002-per-runtime-reference-map/research/lineages/swe2/`

## Synthesis (start here)

| file | what it is |
|---|---|
| `research.md` | The map. Map A (435 links) + Map B (231 runtime files + 36 home) + Map C (4,027 tracked refs) with reconciliation, the contract-family enumeration, corrections ledger, and UNKNOWNs. |
| `convergence-report.md` | Why the loop stopped: exact seed closure 4,729/4,729, per-run novelty, class totals. |
| `resource-map.md` | This file. |

## Loop state

| file | what it is |
|---|---|
| `deep-research-config.json` | Bound config: artifact_dir override, stop policy, max iterations. |
| `init-config-event.json` | phase_init event. |
| `deep-research-state.jsonl` | One JSON record per run (`run`+`iteration` integers, timestamps, row counts, `newInfoRatio`). |
| `deep-research-strategy.md` | Strategy doc updated per phase. |
| `findings-registry.json` | `keyFindings` — the durable findings list. |
| `deep-research-dashboard.md` | Human dashboard: progress, coverage, open questions. |

## Iteration artifacts

| run | iteration file | delta | event | map rows added |
|---|---|---|---|---|
| 1 | `iterations/iteration-001.md` | `deltas/iter-001.jsonl` | `iteration-001-event.json` | A: claude/codex/hermes/root (80) |
| 2 | `iterations/iteration-002.md` | `deltas/iter-002.jsonl` | `iteration-002-event.json` | A: cursor/devin/pi (118) |
| 3 | `iterations/iteration-003.md` | `deltas/iter-003.jsonl` | `iteration-003-event.json` | A: opencode internal + specs (237) → A closed |
| 4 | `iterations/iteration-004.md` | `deltas/iter-004.jsonl` | `iteration-004-event.json` | B: 231 files + 36 home → B closed |
| 5 | `iterations/iteration-005.md` | `deltas/iter-005.jsonl` | `iteration-005-event.json` | C: system-spec-kit (729) |
| 6 | `iterations/iteration-006.md` | `deltas/iter-006.jsonl` | `iteration-006-event.json` | C: deep-loop + ext-orch (1543) |
| 7 | `iterations/iteration-007.md` | `deltas/iter-007.jsonl` | `iteration-007-event.json` | C: advisor + sk-code + sk-doc (868) |
| 8 | `iterations/iteration-008.md` | `deltas/iter-008.jsonl` | `iteration-008-event.json` | C: six leaf skills (552) |
| 9 | `iterations/iteration-009.md` | `deltas/iter-009.jsonl` | `iteration-009-event.json` | C: opencode:* + root + ci (335) → C closed |
| 10 | `iterations/iteration-010.md` | `deltas/iter-010.jsonl` | `iteration-010-event.json` | convergence verification + UNKNOWN ledger |

## Working files (`working/`)

| file | role |
|---|---|
| `build_map_a.py` | Map A row generator: seed TSV → per-section classified tables. |
| `build_map_b.py` | Map B row generator: runtime files + home paths → classified tables. |
| `build_map_c.py` | Map C classifier: freeze/regenerate/manual/mechanical ruleset (`MANUAL_PAT`, sentinel family, contract docs). **Canonical** — final uniform ruleset applied to all areas. |
| `verify_coverage.py` | Convergence proof: joins all three maps back to the seed, reports missing/overlap (all zero). |
| `map-a-iter{1,2,3-opencode,3-specs}.md` | Map A tables by section. |
| `map-b-{claude,codex,cursor,devin,hermes,pi,home}.md` | Map B tables by runtime + home. |
| `map-c--*.md` (~90 files) | Map C tables by area+subarea — the per-file `file:line` citations live here. |

## Read-side sources used (nothing modified)

- `scratch/seed-inventory/{summary.md,symlinks.tsv,tracked-refs.tsv,home-refs.tsv}` — the deterministic seed.
- `001-deep-research/research/research.md` — phase-001 verified findings.
- `*/SYNC.md` manifests, `sync-runtime-mirrors.cjs`, `hook-registry.json`, `sync-{agents,prompts}{,-pi}.cjs`, `sync-gate1-pointers.cjs`, `spec-root-migration.ts`, `check-no-spec-imports.cjs`, `check-contract-drift.cjs`, `install-{git-hooks,codex-hooks}.*`, `worktree-session.sh`, `repo-root.mjs`, `workspace-*.ts`, `folder-detector.ts` — the generator/sentinel/gate citations.
- `.claude/.cursor/.devin settings|hooks.json`, `.hermes/plugins/repo-guards/__init__.py`, `~/.config/git/hooks/*`, `opencode.json`, `.github/workflows/*`.
