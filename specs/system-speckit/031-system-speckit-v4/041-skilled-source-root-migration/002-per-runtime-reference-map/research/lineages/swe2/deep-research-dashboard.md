# Deep-Research Dashboard — lineage `swe2`

**Status:** ✅ CONVERGED (run 10/10) — exact seed closure, synthesis written.

**Topic:** Per-runtime reference map for `.opencode/` → `.skilled/` source-root migration (GATE PRE-RESOLVED — spec folder pre-approved).

## Coverage

| map | seed | mapped | status |
|---|---|---|---|
| A — symlinks | 435 | 435 | ✅ closed (runs 1–3) |
| B — runtime files | 231 | 231 | ✅ closed (run 4) |
| B — home-level | 36 | 36 | ✅ closed (run 4) |
| C — all other tracked refs | 4,027 | 4,027 | ✅ closed (runs 5–9) |
| **total** | **4,729** | **4,729** | ✅ verified run 10 (`working/verify_coverage.py`) |

## Classification totals

`mechanical` 3,041 · `regenerate` 351 · `freeze` 978 · `none` 274 · `manual` 78 · `blocker` 7

## Run log

| run | focus | rows | newInfoRatio |
|---|---|---|---|
| 1 | Map A claude/codex/hermes/root | 80 | 1.0 |
| 2 | Map A cursor/devin/pi | 118 | 1.0 |
| 3 | Map A opencode internal + specs | 237 | 1.0 |
| 4 | Map B runtimes + home | 267 | 1.0 |
| 5 | Map C system-spec-kit | 729 | 1.0 |
| 6 | Map C deep-loop + ext-orch | 1543 | 1.0 |
| 7 | Map C advisor + sk-code + sk-doc | 868 | 1.0 |
| 8 | Map C six leaf skills | 552 | 1.0 |
| 9 | Map C opencode:* + root + ci | 335 | 1.0 |
| 10 | convergence verification + UNKNOWNs | 0 | 0.0 (closure proof) |

## Open questions

None blocking. 7 residual UNKNOWNs recorded (U1–U7 in `research.md`) — manifest/tree divergences, runtime symlink-following probes, untracked refs, live state, other machines.

## Key artifacts

- `research.md` — the working map (start here)
- `convergence-report.md` — closure evidence
- `working/map-{a,b,c}-*.md` — per-row cited tables (canonical)
- `findings-registry.json` — KF1–KF8
