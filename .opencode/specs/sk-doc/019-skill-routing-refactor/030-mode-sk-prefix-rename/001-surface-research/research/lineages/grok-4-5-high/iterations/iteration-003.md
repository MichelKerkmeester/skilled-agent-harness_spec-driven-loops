# Iteration 003 — Benchmark gold, Lane C, and playbook expected_intent

## Focus
Locate Lane C / compiled-routing gold and playbook assertions that embed old workflowMode or packet path strings; classify edit vs regenerate.

## Actions Taken
1. Walked all four hub `benchmark/` trees for mode-key hits (37/265 files; overwhelmingly under `reports/`).
2. Inspected Lane C fixture shape (`*.private.json` expected blocks) and compiled-routing `results.csv` `gold_mode` column.
3. Grepped playbooks for `expected_intent:` YAML gold and `workflowMode:` prose assertions.
4. Read deep-improvement skill-benchmark README for route-gold / compiled-routing-parity gate contracts.

## Findings

### F11 — Consumer class: playbook `expected_intent` YAML gold
- **Class:** Typed scenario frontmatter gold consumed by Lane C route-gold gate
- **Classification:** typed / safe-to-sweep (exact-set assertion of workflowMode strings)
- **Collision risk:** Low inside the YAML field; high if sweeping the same tokens in surrounding Markdown narrative
- **Evidence:**
  - [SOURCE: .opencode/skills/sk-prompt/manual-testing-playbook/hub-routing/generic-prompt-improve.md:6] `expected_intent: prompt-improve`
  - [SOURCE: .opencode/skills/sk-doc/manual-testing-playbook/intent-detection/skill-creation.md:5] `expected_intent: create-skill`
  - [SOURCE: .opencode/skills/sk-code/manual-testing-playbook/compiled-routing/surface-bundle-compiled-routing.md:7] `expected_intent: code-webflow`
  - [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:176-178] route-gold treats expected_intent as hard exact-set gold

### F12 — Consumer class: compiled-routing reports / results.csv
- **Class:** Generated archival reports with `gold_mode` column and embedded mode strings
- **Classification:** regenerate / archive — do not hand-edit historical `reports/**` as live truth; re-run benchmarks after rename and keep additive run-label folders
- **Evidence:**
  - [SOURCE: .opencode/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/results.csv:1-2] header `gold_mode` and row `code-webflow`
  - [SOURCE: .opencode/skills/sk-doc/benchmark/README.md:61] compiled-routing archive convention (additive run labels, never overwrite baseline)

### F13 — Consumer class: playbook prose stating `workflowMode: <key>`
- **Class:** Free prose / scenario narrative that quotes typed keys
- **Classification:** requires-judgment — update assertions that encode expected routing, leave historical retirement notes carefully
- **Evidence:** Multiple sk-design mode-routing scenarios assert `workflowMode: interface` / `md-generator` / `design-mcp-open-design` in Setup/Pass criteria [SOURCE: .opencode/skills/sk-design/manual-testing-playbook/mode-routing/*.md]

### F14 — Consumer class: Lane C private fixture expected blocks
- **Class:** Fixture JSON under hub `benchmark/fixtures` and deep-improvement assets
- **Classification:** typed fields when present (`expected.skillId`, intentKeys/resources); sk-code Mode A fixtures often intentionally empty intentKeys — surface detection dominates [SOURCE: sk-code-loadspeed-001.private.json]
- **Verification:** `node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs --skill <hub> --route-gold on --compiled-routing-parity on`

### F15 — Ordering note (partial Q4)
Route-gold and compiled-routing parity cannot pass until mode-registry + hub-router + playbook `expected_intent` agree on the new keys. Reports are post-facto evidence, not prerequisites.

## Questions Answered
- Extended Q1/Q2/Q3 for benchmark/playbook gold surfaces
- Partial Q5: named Lane C runner with `--route-gold on` as verification lever

## Ruled Out / Dead Ends
- Ruled out treating historical `benchmark/reports/**` as editable rename targets — they are archives to re-generate. [SOURCE: sk-doc/benchmark/README.md:61]

## Next Focus
Command bindings, agent definitions, and runtime mirrors (`.claude/`, `.cursor/`, `.codex/`, `.devin/`) that hardcode packet paths or mode keys.

## SCOPE VIOLATIONS
None.
