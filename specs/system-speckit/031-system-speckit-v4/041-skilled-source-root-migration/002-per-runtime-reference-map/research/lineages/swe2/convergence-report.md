# Convergence Report — lineage `swe2`

**Session:** `fanout-swe2-1789561902822-scse4p` · **Loop:** research · **Stop policy:** convergence · **Runs used:** 10 / 10

## Convergence claim

Converged. A further iteration would add **zero** new rows: every seeded row is enumerated, cited, and classified.

| map | seed | mapped | evidence |
|---|---|---|---|
| A — symlinks | 435 | 435 | `working/map-a-*.md`, iterations 1–3 |
| B — runtime files | 231 | 231 | `working/map-b-*.md`, iteration 4 |
| B — home-level | 36 | 36 | `working/map-b-home.md`, iteration 4 |
| C — all other tracked refs | 4,027 | 4,027 | `working/map-c--*.md`, iterations 5–9 |
| overlap B∩C | — | 0 | `working/verify_coverage.py` |

**4,729 / 4,729 rows — exact closure**, verified programmatically in run 10 (`verify_coverage.py`: 0 missing in all three maps, 0 double-mapped).

## Per-run novelty

| run | focus | new rows | note |
|---|---|---|---|
| 1 | Map A: claude/codex/hermes/root | 80 | generator attribution established |
| 2 | Map A: cursor/devin/pi | 118 | pi extensions verified-not-generated |
| 3 | Map A: opencode internal + specs | 237 | Map A closed 435/435 |
| 4 | Map B: 6 runtimes + home | 267 | 7 blockers found (global git hooks) |
| 5 | Map C: system-spec-kit | 729 | sentinel family located (10 code + 3 docs) |
| 6 | Map C: deep-loop + ext-orch | 1543 | check-contract-drift gate found |
| 7 | Map C: advisor + sk-code + sk-doc | 868 | advisor workspace-root sentinel |
| 8 | Map C: 6 remaining skills | 552 | zero contract code in leaf skills |
| 9 | Map C: opencode:* + root + ci | 335 | Map C closed 4027/4027; git-hook + compat-gate family completed |
| 10 | convergence verification | 0 | coverage proof + UNKNOWN ledger |

## Classification totals

`mechanical` 3,041 · `regenerate` 351 · `freeze` 978 · `none` 274 · `manual` 78 · `blocker` 7.

## Residual UNKNOWNs

7 claims (U1–U7, `research.md` + `iterations/iteration-010.md`): two manifest/tree divergences, runtime symlink-following behavior, untracked refs, live `.state`/`logs` content, other machines' home state, and the pre-ruled-out dirs. None block the map's completeness — each names the evidence that would settle it.

## Corrections applied during the loop

- `templates/changelog/README.md` — living template, not history (freeze→mechanical rule fix).
- Extensionless git-hook entrypoints + `hooks/git*` gate dirs + `launchagents` + `check-no-spec-imports` — required a global `MANUAL_PAT` pass (mechanical→manual); earlier iteration tables patched (iter-005: 3 rows).
- `.cursor/mcp.json` — manifest says symlink, live file is regular (divergence → Map B row + U2).
- `.codex/AGENTS.md` — word-`opencode` runtime-name hits excluded (literal-needle rule).
