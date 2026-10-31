# Iteration 3: Advisor and hub routing integration

## Focus

Trace the path from advisor recognition of a natural Jev prompt to the cli-classifier hub, then from its mode selection to the cli-jev leaf set. Review routing vocabulary, generated graph metadata, hub-router, mode-registry, ROUTER.md, leaf-manifest, and the hub's public skill metadata. Read only; no routing tests or validators ran.

## Actions Taken

- Compared the hub's trigger language and advisor-facing phrases with `hub-router.json`, `graph-metadata.json`, `description.json`, and the advisor runtime graph.
- Compared the registered mode and packet identity across `mode-registry.json`, `hub-router.json`, `ROUTER.md`, and `leaf-manifest.json`.
- Inspected the compiled-route front door and its documented fallback contract in the hub skill.
- Searched the advisor's labeled, holdout, and ambiguity prompt corpora for cli-classifier, cli-jev, Jev, and typed-judgment examples. No matching examples were present.

## Findings

No confirmed integration finding in this pass. The advisor runtime graph contains a cli-classifier hub node in the CLI family and carries the hub's Jev intent signals. Hub metadata consistently uses version 0.7.0.0, and the mode registry and router both identify cli-jev as the only current transport. ROUTER.md maps its four intents to five unique packet-local leaves, and each resolves to one of the five entries in the cli-jev leaf manifest.

This is static contract evidence, not a measured advisor-routing result. The searched advisor prompt corpora contain no Jev examples, and no router replay was run. Whether real prompts are recognized at the expected rate remains unverified.

## Questions Answered

- Advisor metadata advertises cli-classifier as the public hub with matching Jev vocabulary.
- Mode selection, surface routing, and the cli-jev leaf manifest agree on packet identity and exact leaf resources.

## Questions Remaining

- Do benchmark callers force the backend they name and preserve actual transport labels?
- Can an external repository user install the hub without Jev, and can an operator discover prerequisites and measured results?
- Do feature-catalog and manual-testing-playbook docs, changelogs, mirrors, and code agree?
- What findings remain after caller and file-surface reconciliation?

## Assessment

- **New-information ratio:** 0.22 (telemetry only; the maximum-iteration stop policy remains controlling).
- **Novelty:** This pass confirms consistency across the first-stage advisor metadata and the second-stage typed leaf router, and identifies a prompt-corpus coverage gap without treating it as a routing defect.
- **Negative knowledge:** No P0–P2 routing integration defect was confirmed in the inspected static metadata and routes. No routing tests, benchmarks, Jev calls, or validators ran.

## Sources

- `.skilled/skills/cli-classifier/SKILL.md:1-5, 18-24, 35-51, 100-110` — public trigger description, mode, compiled route and transport ownership.
- `.skilled/skills/cli-classifier/hub-router.json:1-21, 23-56` — router policy, cli-jev signal mapping and vocabulary.
- `.skilled/skills/cli-classifier/mode-registry.json:1-19, 21-58` — packet identity, metadata routing class, tool posture, aliases and transport axis.
- `.skilled/skills/cli-classifier/ROUTER.md:16-22, 34-48, 58-85` — second-stage route and machine-readable intent-to-leaf map.
- `.skilled/skills/cli-classifier/leaf-manifest.json:1-16` — exact registered cli-jev leaf set.
- `.skilled/skills/cli-classifier/graph-metadata.json:1-5, 32-43, 72-109` — advisor trigger signals, source files, entities and hub identity.
- `.skilled/skills/cli-classifier/description.json:1-25` — hub name, version, keywords and trigger examples.
- `.skilled/skills/system-skill-advisor/SKILL.md:54-99` — advisor recommendation and typed-leaf contracts.
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json:1` — generated graph includes cli-classifier in the CLI family and carries its graph signal mapping.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl:1` — searched corpus; no Jev/hub examples found.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl:1` — searched corpus; no Jev/hub examples found.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/ambiguity-prompts.jsonl:1` — searched corpus; no Jev/hub examples found.
- `.skilled/bin/compiled-route.cjs:4-13, 26-52` — compiled-route front door and legacy sentinel fallback contract.
