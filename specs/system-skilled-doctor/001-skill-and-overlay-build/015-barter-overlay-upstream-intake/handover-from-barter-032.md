---
title: "Handover to Skilled: overlay fixes that belong upstream after the audit against 25b09c99a3"
description: "The vendoring project audited every overlay against Skilled 25b09c99a3 and lists six items: failing hub-routing playbook pages, a re-pin that left five links unwritten, five upstream file fixes, two script changes, mcp-tooling router keywords and the family field."
trigger_phrases:
  - "barter overlay upstream handover"
  - "overlay legacy cleanup message"
importance_tier: "normal"
contextType: "reference"
---

Barter audited every overlay against Skilled 25b09c99a3 and dropped the ones with no Barter content. Several of the rest are fixes that belong upstream. Once Skilled carries them, Barter drops its copies at the next re-pin.

1. The mcp-tooling hub-routing playbook pages fail Skilled's own validator. `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py --type playbook_feature .skilled/skills/mcp-tooling/manual-testing-playbook/hub-routing/holdout-knowledge-base.md` reports 4 blocking `missing_required_section` errors: overview, scenario_contract, test_execution and source_metadata. All 16 pages share the layout. Barter had rewritten them to pass and has now reverted to upstream's copies, so either the pages or the validator's `playbook_feature` rule needs to change.

2. A re-pin can leave new upstream symlinks unwritten. Barter's re-pin from d0fc9d7 to d97c051 removed the old `README.md` files under `.skilled/hooks/dist-freshness/{claude,codex,cursor,devin,opencode}/` but never wrote the five links upstream put there (`check-dist-staleness.sh` four times and `system-dist-freshness-guard.js`). The `vibe` link, which existed before, survived. `overlay-engine.cjs status --audit` caught it as five `AUDIT missing` lines, but plain `status` passed through every later re-pin. Two asks: check why the re-pin did not write them, and consider a NOTE in plain `status` when the audit would fail.

3. Five upstream file fixes Barter carries as overlays:
   - `system-spec-kit` feature catalog `governance/feature-flag-governance`: it lists five hubs and calls sk-design retired, while `COMPILED_ROUTING_HUBS` in `compiled-routing-flag.ts` holds seven, including `cli-classifier` and `sk-design`.
   - `sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md`: it says parent-skill-check 9b warns when `benchmark/` is absent, but 9b fails by default and only warns with `PARENT_HUB_CHECK_STRICT=0`.
   - `sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-router-template.json`: `_pathContract` names `parent_skill_smart_routing_template.md`, which does not exist. The file is `parent-skill-root-router-template.md`.
   - `sk-doc/shared/scripts/validate_document.py` and its companion typing test: Barter exempts the compiled-routing `report.md` and `serving-snapshot.md`, worked payloads under `examples/` outside sk-design, adds a `rule` type for `repo-rules/` and an "at a glance" alias for a README overview.
   - `mcp-tooling/mcp-obsidian/examples/mcp-roundtrip.sh`: it should read the prefixed env names that `.env.example` declares.

4. Two sk-create-skill script changes Barter needs, which may suit upstream:
   - `ci-router-vocabulary-reach.cjs` reads a stage-one-only hub's phrases from `hub-router.json` when `INTENT_SIGNALS = {}`, and retries a degraded advisor probe up to four times. Upstream's copy fails Barter's stage-one-only sk-git hub with "router declared no multi-word phrases".
   - `generate-router-intent-signals.cjs` also covers router-less skills from their `SKILL.md` keyword comment. Upstream's copy checks 8 hubs on Barter's tree, Barter's checks 14.

5. The mcp-tooling router keywords. Barter removed the bare keywords "health" and "aside" and added "inspect the dom" and "capture repl evidence". Barter compiled both routers and ran the same prompts through each. All 16 playbook prompts route identically. On prompts outside the playbook, upstream's bare "health" sends "run a health check on the backend-system API" and "check the health of the gaia-services pods" to mcp-obsidian. Worth adopting upstream.

6. The family field. Skilled's parent-hub template says "parent hubs use sk-hub", but no Skilled skill uses it. sk-doc, sk-design and sk-git are parent hubs and carry sk-util. Barter now sets sk-hub on all three. Either apply the template's rule to Skilled's own hubs, so Barter can drop its family overlays, or change the template sentence.
