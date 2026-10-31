# Deep Review Iteration 1 — Correctness

## Dimension
D1 Correctness. Question: after the kill-list deletion and the Jev-arm strip, does any live code, test, doc, command, agent, mirror or generated file outside `specs/` (and outside release `changelog/` prose) still reference or depend on the deleted artifacts? Scope: nine deleted scorers (002 tie-break, 019 suggested order, 006 goal lint, 027 stop rater, 028 stop hint, 029 severity replay, 033 residue flagger, 026 completion claims, 031 debug next check), the Jev arm stripped from `leaf-route-replay.cjs` and `hvr_reader_lens.py`, and the Jev gate line stripped from `score-verifier-labeled-set.cjs`.

## Files Reviewed
- `.skilled/hooks/goal/lib/score-verifier-labeled-set.cjs`, `score-verifier-labeled-set.test.cjs:208` (strip coherence: file contains no `jev` token; test pins `--jev` as an unknown flag)
- `.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:34,39,1344`, `replay-helpers.mjs:44-255`, `tests/score-pi-transport.test.mjs:19`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs`, its test, README and playbook are grep-clean of the Jev arm
- `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py`, its test (both compile)
- `.skilled/skills/system-skill-advisor/leaf-manifest.json:46,96`, `leaf-aliases.json:209,459`, `leaf-manifest.config.json`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:191-236,586`; `.github/workflows/routing-registry-drift.yml:187-197`
- `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json:101985`; `runtime/cli/retrieval/fixtures/phrase-variants.json:79734`; `generate-trigger-index.mjs:80`
- `.opencode/skills/system-skill-advisor/leaf-manifest.json` (hardlink to the `.skilled` inode)

Sweep method: repo-wide `git grep` for all nine deleted scorer basenames plus the four deleted doc slugs, excluding `specs/` and `changelog/`; `find` across every runtime mirror; `node --check` on six surviving JS files and `python3 -m py_compile` on two Python files; export/import cross-check for the moved helpers.

## Findings by Severity

### P1 — R1-P1-001 Generated leaf registries for system-skill-advisor still cite four deleted leaf docs
- File: `.skilled/skills/system-skill-advisor/leaf-manifest.json:46` (also `:96`; `.opencode` view is the same inode)
- Evidence: `leaf-manifest.json:46-47,96-97` still list `feature-catalog/scorer-fusion/suggested-order-eval.md`, `feature-catalog/scorer-fusion/tie-break-eval.md` and their `manual-testing-playbook` copies; `leaf-aliases.json:209-215,459-465` project the same dead `diskPath` values. All four files are gone from disk. `leaf-manifest.config.json` declares both files generated ("regenerate both together via `ci-skill-root-metadata.cjs --fix`"), and `ci-skill-root-metadata.cjs` regenerates the manifest from a disk walk, byte-compares, and raises `STALE_GENERATED_FILE` (:227-236) with fail status (:586). `routing-registry-drift.yml:187-197` runs that checker for every skill root on any push touching `.skilled/skills/system-skill-advisor/runtime/**`, which the deletion commits did. The deletion commits (ec7be335a21, 0141a86303, 89a42bc0cde, 0fed879630, b01717623e, 0e0ba04131, d48913df93, d4d3d0e0b4) touched no `leaf-manifest`/`leaf-aliases`/`graph-metadata` file.
- Finding class: cross-consumer
- Scope proof: the repo-wide greps found no other live consumer of any deleted basename outside `specs/`, `changelog/` and label-data rows; this generated pair is the only remaining live reference.
- Affected surface hints: ["leaf-manifest.json", "leaf-aliases.json", "ci-skill-root-metadata.cjs freshness gate", "compiled-route-admission alias resolution"]
- Claim adjudication: counterevidence sought but not found — no commit regenerated the pair, `.opencode` is a hardlink not a fresh copy, no mirror ships deleted code, and the metadata step is a gate (only compiled-route admission runs `--warn-only`). Alternative explanation: the checker might skip standalone roots with no `mode-registry.json`, which would make the stale pair dead data rather than a failing gate.
- Final severity P1, confidence 0.85. Downgrade trigger: demonstrate the checker does not evaluate system-skill-advisor or the workflow filter excludes these commits → P2 (stale generated data).
- Recommendation: regenerate per the config note with `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix --skill system-skill-advisor`, then rerun the Routing Registry Drift Guard.

No P0 findings. No P2 findings.

## Traceability Checks
| Protocol | Level | Status | Note |
|---|---|---|---|
| spec_code | core | pending | scheduled for iteration 2 |
| checklist_evidence | core | pending | scheduled for iteration 2 |
| skill_agent | overlay | pending | scheduled for iteration 2 |
| agent_cross_runtime | overlay | pending | scheduled for iteration 2 |
| feature_catalog_code | overlay | partial | surviving feature-catalog docs grep-clean for deleted refs |
| playbook_capability | overlay | partial | no surviving playbook runs a deleted scorer |

## Verdict
CONDITIONAL — one P1 (stale generated leaf registries; must-fix before the next CI run on the affected paths), no P0. Everything else swept this iteration is clean: no live importer/spawner, no removed-flag caller, no mirror copy, no stale retrieval index, all surviving in-scope files parse and their helper imports resolve.

## Next Dimension
Iteration 2 — traceability (D3): spec/code alignment and checklist evidence for the deletions, cross-runtime agent/skill mirrors (skill_agent, agent_cross_runtime), and the feature-catalog/playbook capability claims (feature_catalog_code, playbook_capability).

Review verdict: CONDITIONAL