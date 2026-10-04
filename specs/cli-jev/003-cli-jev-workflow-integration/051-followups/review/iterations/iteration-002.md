# Deep Review Iteration 2 — Traceability

## Dimension
D3 Traceability. Question: after the kill-list deletion and the Jev-arm strip, does any live artifact outside `specs/` and `changelog/` still describe, link, count or route a deleted scorer, deleted leaf doc, deleted scenario or the removed Jev arms? Swept classes: generated metadata (`leaf-manifest.json`, `leaf-aliases.json`, `graph-metadata.json`, `description.json`, `mode-registry.json`, `hub-router.json`), routing gold and benchmark scenario files, markdown links with dead targets, and counts of scripts, tests, scenarios or features that no longer match disk. Read-only; the review target was not modified.

## Files Reviewed
- `.skilled/skills/sk-doc/feature-catalog/packet-authored-registry-routing/leaf-route-replay.md:26` and `.skilled/skills/sk-doc/feature-catalog/feature-catalog.md:53` — stale gold-row count, see R2-P2-001.
- `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs:267` — gold rows derive from committed playbook scenario files; ran the replay (zero model calls, no report dir) → `total gold=59 scored=58`.
- `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:33` — usage read; ran check mode (never `--fix`) scoped to five roots and fleet-wide.
- `.skilled/skills/system-skill-advisor/leaf-manifest.json:46,96` and `leaf-aliases.json:209,459` — R1-P1-001 re-confirmed active (gate exit 1); not re-reported as new.
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json:79695-79893`, `corpus-manifest.json:8630-8771`, `generation-diagnostics.json:65944`, `runtime/data/trigger-index.json:2810` — generated retrieval fixtures; tokens and paths trace to surviving spec folders.
- `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json:10599` — committed baseline keyed to `specs/.../scratch/README.md` paths.
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md` — SC scenario index checked; no dead target and no link to a deleted `scorer-fusion/*` doc.
- The in-scope READMEs and catalog/playbook docs whose relative links were resolved against disk.

Sweep method: repo-wide search for every deleted basename recovered from `git show --name-status` over the eight deletion commits (nine scorers, their tests, four docs, READMEs and fixtures) plus `DLR-056|DLR-057|DLR-058|DRV-069`, excluding `specs/`, `**/changelog/**` and labeled `.jsonl` data; existence check of every relative markdown link in the in-scope docs; the metadata class gate in check mode across all 14 skill roots; and a live run of `leaf-route-replay.cjs` to test the documented gold count.

## Findings by Severity

### P0
None.

### P1
No new P1. R1-P1-001 (system-skill-advisor generated leaf registries citing four deleted leaf docs) remains active and was re-confirmed this iteration: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --skill system-skill-advisor` exits 1 with `STALE_GENERATED_FILE` for both `leaf-manifest.json` and `leaf-aliases.json`; fleet-wide `checked=14 passed=13 failed=1`. Per the iteration brief it is not re-reported as a new finding.

### P2 — R2-P2-001 Two sk-doc catalog docs claim a 56-row leaf-route gold while the replay reports 59
- Files: `.skilled/skills/sk-doc/feature-catalog/packet-authored-registry-routing/leaf-route-replay.md:26`, `.skilled/skills/sk-doc/feature-catalog/feature-catalog.md:53`.
- Evidence: both docs say the replay scores "the 56-row committed gold ... one row per committed scenario that carries a prompt and leaf pairs". Running `node .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` prints `total gold=59 scored=58 tied=2 mean_f1=0.9249 exact=52` (exit 0). Neither 59 nor 58 equals 56, so the documented count is stale against the owning script.
- Counterevidence sought: whether 56 counts only scored rows (scored=58 — no), only rows with prompt and leaf pairs (gold=59 is exactly that definition per the doc itself), or a committed baseline the replay disagrees with (no repository file carries 56; these two lines are the only "56-row" claims).
- Alternative explanation: the count was accurate when written and scenario rows were added later; the deletion removed no gold-carrying scenario and added none, so this is pre-existing drift surfaced by the traceability sweep, not deletion breakage.
- Final severity P2, confidence 0.9. Downgrade trigger: evidence that the gold set is deliberately frozen at 56 (a committed frozen-gold artifact) would make this a snapshot-naming issue rather than drift; it remains P2.
- Recommendation: update both docs to the replay's current total (59) or replace the literal with the replay's `total gold=` line; if the count is meant to be frozen, name the frozen artifact.

No other P2.

## Traceability Checks
| Protocol | Level | Status | Note |
|---|---|---|---|
| spec_code | core | pass | Replay run + disk counts tested against catalog claims; deleted basenames absent from the live tree (iteration 2) |
| checklist_evidence | core | partial | No packet checklist names a deleted artifact; deletion commits cross-checked via `git show --name-status` (iteration 2) |
| skill_agent | overlay | pass | SKILL.md/README/commands/agents searches clean for deleted artifacts (iteration 2) |
| agent_cross_runtime | overlay | pass | Runtime mirrors (`.opencode`, `.hermes`, `.claude`, `.codex`, `.cursor`, `.pi`, `.devin`) carry no deleted file and no independent stale copy (iterations 1-2) |
| feature_catalog_code | overlay | partial | R2-P2-001 open: two sk-doc catalog docs claim 56 gold rows, replay reports 59 (iteration 2) |
| playbook_capability | overlay | pass | No surviving playbook names a deleted scorer or scenario; the advisor SC index carries no dead target (iteration 2) |

## Verdict
CONDITIONAL — no new P0 and no new P1, one new P2 (R2-P2-001), and the carried active P1 R1-P1-001 re-confirmed by the metadata gate. Everything else swept this iteration is clean: no other skill root carries the same stale generated manifest pattern (four roots pass check mode), no live doc/index/gold/benchmark file names a deleted scorer, leaf doc or scenario id, no broken relative links in the in-scope docs, and the generated retrieval fixtures and README baselines key to surviving spec-tree paths.

## Next Dimension
Iteration 3 — maintainability: whether the deletion left the surviving structure harder to extend or verify, dead helper surface in `replay-helpers.mjs`, stale counts beyond the leaf-route case, and whether CI entry points still describe the removed features.

Review verdict: CONDITIONAL
