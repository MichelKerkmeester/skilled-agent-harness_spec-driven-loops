---
title: "Implementation Summary"
description: "Requests that named a DESIGN.md, a provider-neutral design search, a deep-loop phrase or a skill's own feature now reach the skill or mode built for them. The scorer holds at its baseline, and the replay gains one gold row for mcp-notion."
trigger_phrases:
  - "routing data alignment implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/015-routing-data-alignment"
    last_updated_at: "2026-10-29T23:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Fixed the routing-data items, refuted five and recorded the new baseline"
    next_safe_action: "Land the phase on main"
    blockers: []
    key_files:
      - "decision-record.md"
      - "scratch/probes-after.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0276-routing-data-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-routing-data-alignment |
| **Completed** | 2026-10-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A diagram repaint from a DESIGN.md now loads the diagram's theming reference instead of the extraction mode. A request that names neither Refero nor Mobbin defers between the two research transports, and "Extract DESIGN.md from the marketing site" reaches sk-design instead of the Figma transport. Eleven deep-loop phrases now pick their mode, and five standalone skills answer to phrases their routers already advertised.

### Phase 15: routing-data-alignment

Each item from the router-move alignment check was probed live before anything changed, and its verdict follows.

**Fixed:**
- **mcp-tooling D-01.** "screen examples for a paywall" routed to `mcp-mobbin` before and defers after.
- **mcp-tooling D-08.** "Extract DESIGN.md from the marketing site" went to mcp-tooling at 0.717833 before and to sk-design at 0.542293 after.
- **mcp-tooling D-06.** MT-011 gives `mcp-notion` routing gold. Admission reads 16 pass with no uncovered mode, and the replay gains one exact row.
- **sk-design D-01 and E-03.** The diagram repaint probe routed to the generator before and to `sk-design-diagram` after. The chart theming probe now reaches the chart as the second mode of an ordered bundle (ADR-002).
- **system-deep-loop D-10.** All six deep-loop probes deferred before and route to their mode after.
- **sk-prompt F-2.** "raw passthrough" selected RAW and still loaded DEPTH. Now the `$raw` token loads nothing wherever it sits, and the prose phrase no longer selects RAW.
- **sk-prompt D-03, design-generation half.** The probe went to sk-design before and reaches sk-prompt after, at 0.544444 against 0.461893.
- **cli-orca A-05.** "full ownership handoff" reached only cli-external-orchestration before and reaches cli-orca at 0.768801 after.
- **sk-git D-1.** "gitlens start review" went to sk-code before and reaches sk-git after, at 0.783751 against 0.727216.
- **system-spec-kit D-04 and D-05, in part.** The Hermes copy probe and the temp-path sweep probe reach system-spec-kit after, and so does a request that names `check-card-sync`.
- **sk-design probe gap.** The eleven probes that could not run now run with skill ids, and all eleven pass at stage one.

**Refuted** (ADR-001): cli-classifier D-05, mcp-tooling D-09 as a routing change, the sk-git router-reach allowlist entry, the YAML half of sk-prompt D-03, and the `memory:save` result for cli-classifier P14 and sk-doc P18.

**Left** with the cause named: mcp-tooling N-03, mcp-code-mode D-06 and system-skill-advisor P05 abstain under the advisor's read-only explainer floor (ADR-001). system-skill-advisor P01 to P04 and system-spec-kit P05 and P09 have no signal that passes its out-of-domain control (ADR-003). Widening the intent-signal check past hub roots was not cheap, at 118 phrases (ADR-003).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/mcp-tooling/hub-router.json`, `mode-registry.json`, `ROUTER.md`, `graph-metadata.json` | Modified | Two aliases leave Mobbin and Figma scoring |
| `.skilled/skills/mcp-tooling/manual-testing-playbook/hub-routing/notion-workspace-data.md` | Created | MT-011 notion gold |
| `.skilled/skills/mcp-tooling/manual-testing-playbook/manual-testing-playbook.md`, `hub-routing/ambiguous-defer.md` | Modified | Index counts and the MT-004 stage note |
| `.skilled/skills/sk-design/hub-router.json`, `mode-registry.json`, `ROUTER.md`, `SKILL.md`, `graph-metadata.json` | Modified | Theming routes reach the canvases |
| `.skilled/skills/sk-design/sk-design-diagram/ROUTER.md`, `references/foundations/router-pseudocode.md`, `feature-catalog/diagram-generation/type-selection-and-routing.md` | Modified | The `DESIGN_MD_THEME` intent |
| `.skilled/skills/system-deep-loop/hub-router.json` | Modified | Eleven mode phrases |
| `.skilled/skills/sk-prompt/ROUTER.md`, `graph-metadata.json` | Modified | NO_LOAD wiring and design-generation signals |
| `.skilled/skills/{cli-orca,sk-git,system-skill-advisor,system-spec-kit}/graph-metadata.json` | Modified | Narrow stage-one signals |
| Nine newest `changelog/` entries | Modified | One bullet each, and the "routing is unchanged" lines corrected |
| Three runtime route manifests and their authored twins, `skill-graph.json`, five `.hermes/skills/` copies | Modified | Regenerated |
| `.skilled/bin/tests/compiled-route-admission.test.cjs` | Modified | Live gold pin 95 to 96 for MT-011 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The scorer, the replay and 69 probes were captured before the first edit. Each fix then went into its authored source, followed by its regeneration and a probe rerun. Out-of-domain controls were added for every new signal, and four signals that pulled an unrelated prompt were dropped. The final captures, 78 probes and every gate ran from the final tree.

The scorer did not move: 155/195, 49/66 and 19/24 before and after. No corpus prompt contains a changed stage-one phrase, and the two rows with a changed stage-two phrase name their provider.

The replay moved by one row. `total gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49` became `total gold=65 scored=57 tied=3 mean_f1=0.9176 exact=50`, and the whole delta is MT-011 scoring exact under mcp-tooling, where the hub line went from 14 to 15. Every other hub line is identical.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Refute five items and leave the explainer-floor items | A vocabulary change that cannot move the probe still moves global routing (ADR-001) |
| Take "style reference" out of the generator's scoring | Both sides use the artifact name, so it cannot decide between them (ADR-002) |
| Drop signals that pulled an out-of-domain prompt | One wrong route traded for several is not a fix (ADR-003) |
| Carry all eleven deep-loop stage-two-reverse terms, not only the three named | They are the same defect, and the vocabulary check now reports 0 for the hub |
| Update the admission test's live gold pin | Earlier gold additions bumped it in the same change, and MT-011 is one more gold scenario |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Scorer baseline after | 155/195, 49/66 and 19/24, unchanged |
| Leaf replay after | `total gold=65 scored=57 tied=3 mean_f1=0.9176 exact=50` |
| Probes after | 68 of 78 rows with no FAIL. The ten FAIL rows are items left or refuted |
| `package_skill.py --check --strict`, nine skills | `Result: PASS` on each |
| `parent-skill-check.cjs`, three hubs | `OK` with all hard invariants passed and 0 warnings on each |
| `compiled-route-guard.cjs` | All hubs fresh, exit 0 |
| `generate-router-intent-signals.cjs --check` | `checked=7 hub(s), missing=0`, `RESULT: PASSED` |
| `ci-hub-vocabulary-source.cjs` | `drift=0`, `RESULT: PASSED`. system-deep-loop stage-two-reverse 11 to 0 |
| `ci-router-vocabulary-reach.cjs` | `wrong-hub=0, outranked=0, no-reach=0`, `RESULT: PASSED` |
| Compiled admission, three hubs | sk-design 4 pass, mcp-tooling 16 pass, system-deep-loop 20 pass and 1 n/a |
| Advisor vitest, scorer, parity and routing suites | 48 files, 431 passed, 4 skipped |
| sk-create-skill node tests | 90 pass, 0 fail |
| Compiled-route node tests | 95 pass, 0 fail |
| Bin compiled-routing vitest | 46 passed |
| sk-code SA-001 battery | 12/12 positives, 0/5 negatives, PASS |
| `sync-skills-hermes.cjs --check` | `PASS: 65 Hermes skill copies in sync` |
| `skill-graph-freshness.cjs` | No stale, ghost or drifted entry |
| `validate_document.py`, changed skill markdown | `Total issues: 0` on the nine changelog entries and the routers, SKILL.md and catalog files. The hub gold scenarios and the playbook index report the same counts as their base copies |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Chart theming routes as a bundle.** A chart request that names a DESIGN.md loads the generator first and the chart second. A chart-specific theming phrase in the request, such as "theme this chart", is what reaches the chart at all.
2. **Read-only prompts about a skill abstain.** "Show me screen examples for a paywall" and "Explain Code Mode's architecture" get no recommendation while their skill ranks first. Rephrasing with an action verb routes them. The floor stays as designed, so a request to explain something loads no skill (ADR-001).
3. **Hub gold files keep their compact shape.** Each hub-routing scenario, MT-011 included, reports 4 template issues under `validate_document.py`, the same as every existing sibling at the base commit.
<!-- /ANCHOR:limitations -->

---
