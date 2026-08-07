# Iteration 003 — Automation gaps

## Focus
Dimension (3): what still needs hand-authoring, what could be generated or auto-validated, scaffolder coverage.

## Actions Taken
1. Traced `init_skill.py` standalone vs parent write sets and post-scaffold hooks.
2. Confirmed CI wiring in `.github/workflows/routing-registry-drift.yml`.
3. Located `syncDerivedMetadata` (derived sync) vs scaffold/CI inclusion.
4. Cross-checked prior packet 024 journey findings against live scaffolder behavior.

## Findings

### F15 — Standalone scaffold stops before generated artifacts exist
`init_skill` for S writes `graph-metadata.json` + `leaf-manifest.config.json` (and SKILL.md/playbook/benchmark) then prints generic next steps. It does **not** invoke `ci-skill-root-metadata.cjs --fix`, so a fresh standalone is class-incomplete until a human runs the gate. The only `--fix` mention is inside `leaf-manifest.config.json`'s `_note` string.

[SOURCE: init_skill.py:325-340]
[SOURCE: init_skill.py:301-306]
[SOURCE: ci-skill-root-metadata.cjs:40-42]

### F16 — Parent scaffold mints compiled routes but still relies on manual `--fix` for leaf-manifest
Parent path writes registry/router/graph/description/`command-metadata.json=[]` and optionally runs `compiled-route-manifest.cjs` mint/freshness. Grep shows no `ci-skill-root-metadata` / `generate-leaf-manifest` invocation in `init_skill.py` beyond the config `_note`. Fresh hubs therefore hit `MISSING_GENERATED_FILE: leaf-manifest.json` unless the workflow remembers `--fix` — the exact journey gap packet 024 documented.

[SOURCE: init_skill.py:588-603]
[SOURCE: init_skill.py:618-650]
[SOURCE: 024-create-journey-gate-fixes/spec.md:65,80]

### F17 — Scaffolder still emits orphan `manual` block (automation perpetuates waste)
Standalone graph template hardcodes `"manual": {"depends_on": [], "related_to": []}` even though ingest ignores `manual` (iteration 2 F11). Automation gap: scaffold should stop minting unread fields; a lint gate should reject unknown top-level graph keys.

[SOURCE: init_skill.py:284-287]
[SOURCE: skill-graph-db.ts:779-828]

### F18 — Derived sync exists but is not on the scaffold→CI happy path
`syncDerivedMetadata` regenerates the V2 derived block from SKILL.md + graph sources, yet CI `routing-registry-drift.yml` only runs parent-skill-check + class gate + leaf-manifest freshness — not fleet derived sync or advisor ingest verification. Stale derived can pass file-presence gates while under-powering the derived_generated lane.

[SOURCE: sync.ts:92-124]
[SOURCE: routing-registry-drift.yml:95-110]

### F19 — No automated validator for unread description fields or intent_signal quality
Doctor rule 8 checks presence of name/description/version/keywords and forbids registry-owned keys; it does not flag dead fields (`trigger_examples`, `opencode_languages`, `supported_surfaces`) nor empty/stub `intent_signals` (scaffolds seed `[skill_name]` only). Class gate checks file presence/freshness, not routing usefulness.

[SOURCE: parent-skill-check.cjs:1030-1043]
[SOURCE: init_skill.py:286-287]

### F20 — Create-journey still lacks end-to-end advisor acceptance
Prior swarm evidence (packet 024 lens3): neither journey ends with `skill_graph_scan` / `advisor_rebuild` / representative `advisor_recommend`. That remains an automation/integration hole between metadata files becoming "green" and actually routing.

[SOURCE: 024 research/swarm/lens3-report.md:20]
[SOURCE: skill-graph-tools.ts:21-23]

### F21 — What remains necessarily hand-authored (appropriate) vs automatable
| Surface | Must stay authored | Automatable gap |
|---------|--------------------|-----------------|
| mode-registry + hub-router | Yes (policy) | Consistency already doctor-checked; examples historically drifted (024) |
| graph edges / intent_signals | Yes (semantics) | Could lint unused/orphan keys; seed from SKILL.md triggers |
| command-metadata entries | Yes (per command) | Empty `[]` scaffold OK; no generator from `.opencode/commands` ownership map |
| leaf-manifest / S aliases | Generated | Scaffold should auto `--fix` |
| description (H) | Presence required | Could generate doctor quartet from SKILL.md; drop unread fields |
| derived | Syncable | Should run syncDerivedMetadata in CI or post-scaffold |
| compiled-route-manifest | Mintable | Parent path already optional-mints |

## Questions Answered
- What still requires hand-authoring that scaffolder/generators could emit or auto-validate? → Answered (F15–F21).

## Ruled Out
- Auto-generating hub routing policy (registry/router) from packet folders alone — would invent meaning; contract forbids (ci-skill-root-metadata.cjs:40-42).

## Next Focus
Dimension (4) Effectiveness — whether JSON data actually drives advisor routing well: intent-signal coverage, load-bearing fields, routing quality evidence from projection/scorer and live recommend.
