---
title: "Deep Research Strategy: classifier backends, round 3 (swe lineage)"
trigger_phrases: []
---
# Deep Research Strategy: classifier backends, round 3 (swe lineage)

## Research Topic

Find where a classifier model, Jev hosted or local Deem 0.8B, cuts the main AI's context and manual review work in this repository. Brief and questions A-H: `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/spec.md`. This lineage answers with the code-level slice-design lens: exact files, function names and signatures, imports, test cases with fixtures, rough LOC per function, and keep or kill rules as checkable logic. It owns the validator and template-alignment maps in code terms. Baselines: BASE2 (`004-deep-research-expansion/research/research.md`, R1-R22, rows 44-72) and BASE1 (`001-deep-research/research/research.md`, rows 1-43).

## Known Context

- The detached lineage is bound directly to `config.fanout_lineage_artifact_dir`; `resolveArtifactRoot` is intentionally skipped.
- All writes are bounded to this lineage directory. Spec writeback, parent/shared telemetry, continuity/memory save and git staging are out of scope.
- Gate 3 is pre-resolved to the existing packet `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research`.
- Two backends under parent D1: Jev (available when `command -v jev` succeeds, `jev --version` prints `jev 0.6.2`, `jev auth status --provider <p>` exits 0) and Deem (available when the local server passes a health check that refuses the `stub` backend). With neither, behavior is exactly today's. Each feature keeps its own switch; no global switch; no path returns a default score.
- Two `jev` packages named apart everywhere: the Python `jev-cli` 0.6.2 wrapped by `.skilled/skills/cli-jev/cli-usage/`, and the npm `jevctl` 0.2.3 vendored under `context/external repo's/jev-cli-main`. Their exit-2 meanings collide.
- Deem: served 0.8B is `deem-0.8-v1` at HF commit `8cbabbb2c4a7ef13c6b43f0ef3ae4157983c6d21`, bf16 on `deem_server.py` with `DEEM_DEVICE=mps`, `127.0.0.1:8300`, ~60 ms p50, uncalibrated, quality unmeasured (`context/deem-local.md`). No Deem CLI exists; `deem-ctl` is the tested operator script at `~/.local/share/deem/bin/deem-ctl` — read it, never run it.
- No live `jev` call of either package, no Deem server call, no `.env` file, no repository module, test suite, `validate.sh`, `generate-context.js`, eval script or install run, no network call, no git write. Read-only commands allowed.
- Transcripts and goal state are the operator's: counts, lengths, field names and record types only.
- Wave rule: iterations 1-3 read no sibling round-3 file; iterations 4-6 read the newest sibling iteration of each lineage first; 7-8 same plus measured-value bar for new workflows; 9-10 read all own plus newest siblings.
- Vendor claims (Deem card figures, 9B figures, Jev prices/latencies) stay labeled. `deem-local.md` figures are orchestrator measurements of speed and memory only.
- Refinements ALL-1 through ALL-8 and the per-angle lines in research-angles.md §7 bind as part of each angle.

## Key Questions

- [ ] swe-01: `cli-deem`'s smallest slice as code: wrapper, translator or client (A, G)
- [ ] swe-02: sk-doc's validators as code: every template-alignment check and its residue (D)
- [ ] swe-03: Resource routing as code: ROUTER leaves and the compiled router (C)
- [ ] swe-04: The top reduction seam as a slice (C)
- [ ] swe-05: sk-prompt and sk-design routers as code (E, F)
- [ ] swe-06: The best validator residue as a slice (D)
- [ ] swe-07: `cli-classifier` as files (G, A)
- [ ] swe-08: The two-backend probe: shared or duplicated (A, G)
- [ ] swe-09: Build order in code (H)
- [ ] swe-10: The first PR-sized slice (H)

## What Worked

[Populated as iterations complete]

## What Failed

[Populated as iterations complete]

## Exhausted Approaches

[Populated when an approach has been tried from multiple angles without success]

## Ruled Out Directions

[Consolidated from iteration dead-end data]

## Next Focus

swe-01: `cli-deem`'s smallest slice as code — read `deem-ctl` first (ALL-1); the design is a wrap-or-vendor decision about that script, not a redesign.
