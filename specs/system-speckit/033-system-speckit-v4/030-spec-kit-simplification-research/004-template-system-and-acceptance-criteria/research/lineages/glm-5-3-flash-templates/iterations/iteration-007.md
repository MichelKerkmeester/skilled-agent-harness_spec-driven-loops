# Iteration 007 — Angle 7: template version fields vs SPECKIT_TEMPLATE_SOURCE headers — manifest↔shipped drift

- sessionId: fanout-glm-5-3-flash-templates-1788737392077-m8w16s
- Window opened: 2026-09-06T23:52:18Z (init) · iteration executed 2026-09-07T01:29Z–01:45Z
- Focus: Q7 — do template version fields vs SPECKIT_TEMPLATE_SOURCE headers show drift between the manifest and shipped files?
- Status: complete · newInfoRatio: 0.208 (5 new findings / 29 accumulated)
- Novelty justification (1 sentence): first-recorded — the per-file marker-version divergence inside the manifest, the dead default path of the staleness checker, the orphaned version machinery, the never-versioned multi-template markers, and the corpus self-misreporting by design — none restate angles 1-6.
- Executor: this process, inline · tool calls: 9 bash evidence + writes = within 12; research actions 6.
- Quality guards: source diversity 10 distinct files + corpus census; every finding ≥3 records; focus alignment 100%.

## Focus

Q7 per strategy §3. State read first: state log 7 records, registry 24 findings.

## Actions Taken

1. `runtime/cli/rules/check-template-source.sh` read: rule TEMPLATE_SOURCE, severity error (`:9-11`); collects docs from the LEVEL CONTRACT (`:35-44`); checks only PRESENCE of `SPECKIT_TEMPLATE_SOURCE:` within head -60 of each existing file (`:56-66`); fail = missing header, remediation shows format + "This header proves files were created from official templates" (`:78-93`). The NATIVE twin in the orchestrator is identical presence-only logic (`runtime/lib/validation/orchestrator.ts:664-672`, first 70 lines). NEITHER compares the marker VERSION to the manifest. [SOURCE: runtime/cli/rules/check-template-source.sh:9-11,35-66,78-93; runtime/lib/validation/orchestrator.ts:664-672]
2. Manifest versions: all 17 entries v2.2 (`templates/spec-kit-docs.json:4-22`, node dump). Template self-markers: 17/17 .tmpl files carry an inline marker, BUT five self-declare LOWER versions: research.md.tmpl `research | v1.0` (`:16`), resource-map.md.tmpl `resource-map | v1.1` (`:17`), handover.md.tmpl `handover | v1.0` (`:17`), debug-delegation.md.tmpl `debug-delegation | v1.0` (`:18`), context-index.md.tmpl `context-index | v1.0` (`:15`). Core/addons rendered at the top level (spec-core/plan-core/tasks-core/impl-summary-core v2.2; acceptance-criteria v2.2; before-after/timeline/roadmap/goal/decision-record v2.2; phase-parent/review-record v2.2). spec.md.tmpl carries THREE markers (v2.2 core `:36`; composed v2.2 variants `:39,:43`). [SOURCE: templates/spec-kit-docs.json:4-22; templates/addons/{research:16,resource-map:17,handover:17,debug-delegation:18,context-index:15}.md.tmpl; templates/core/spec.md.tmpl:36-43]
3. `runtime/cli/spec/check-template-staleness.sh` read: compares each spec.md's first marker version (grep v[0-9.]+, `:80-83`) against `manifest.versions["spec.md.tmpl"]` read from `$TEMPLATE_DIR/manifest/spec-kit-dos.json` — actually `manifest/spec-kit-docs.json` at `$TEMPLATE_DIR/manifest/` (`:61-71`); TEMPLATE_DIR defaults to `<root>/.opencode/skills/system-spec-kit/templates` (`:114-118`); stale/none folders reported (`:158-163`), --auto-upgrade rewrites markers (`:164-169`). FACT: `templates/manifest/` does NOT exist (ls: no such dir; fs.existsSync false) — the default manifest path is DEAD; `get_current_template_version` falls back to "unknown", which matches NOTHING, so every folder with a marker reads as `stale` or the script reports unknown-version noise. [SOURCE: runtime/cli/spec/check-template-staleness.sh:60-83,110-118,140-169; ls templates/ (no manifest/); fs.existsSync check]
4. Corpus census (evidence of shipped drift): `SPECKIT_TEMPLATE_SOURCE` markers across specs/ = 4340×v2.2 + 32×v1.0 (spec.md census); the 32 v1.0s include 14 LIVE (non-z_archive) packets (e.g. specs/system-speckit/026-graph-and-context-optimization/003-.../002-causal-graph-channel-routing/spec.md: `spec | v1.0`) and 18 archived; rendered sample packets (004, 019) carry v2.2 correctly. Note the marker NAME vocabulary also drifts: template names spec-core/plan-core/... vs corpus spec/plan/... (both v2.2-era). [SOURCE: rg census over specs/; specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/002-causal-graph-channel-routing/spec.md; specs/mcp-tooling/019-official-obsidian-cli/spec.md; specs/system-speckit/035-.../004-.../spec.md]
5. Version-consumption: `templateVersions` is resolved into the level contract (`level-contract-resolver.ts:34,65,264,288`) but has ZERO external consumers (rg over runtime .ts/.sh/.cjs outside the resolver: 0 hits); the only version COMPARE in the runtime is the broken staleness checker (action 3). EXTENSION-GUIDE.md:48-56 defines the policy ("Writers should emit markers with the current manifest version"; "Readers must accept legacy marker formats indefinitely, including v2.1"); MIGRATION.md:24,46 ("Legacy markers ... remain supported indefinitely", "no planned sunset date for v2.1 marker parsing"). [SOURCE: runtime/lib/templates/level-contract-resolver.ts:34,65,264,288; templates/EXTENSION-GUIDE.md:48-56; templates/MIGRATION.md:24,46]

## Findings

### f-iter007-001 — P1 — fix

`templates/spec-kit-docs.json:4-22` vs `templates/addons/research.md.tmpl:16`, `resource-map.md.tmpl:17`, `handover.md.tmpl:17`, `debug-delegation.md.tmpl:18`, `context-index.md.tmpl:15` — CLAIM: manifest versions{} declares all 17 templates v2.2; EXTENSION-GUIDE:49 says writers emit "the current manifest version". FACT: five addon templates carry self-markers at v1.0/v1.1 — the rendered files inherit the lower version, so any packet scaffolding research/handover/debug-delegation (workflow-owned docs) or rendering resource-map/context-index gets a marker that contradicts the manifest the same skill ships. Whether the manifest overstates (unbumped content) or the templates understate (unbumped markers) is UNDETERMINABLE from the repo — which is itself the defect: the version pair is supposed to make drift visible and instead both readings are plausible. SEVERITY: **P1** — the one mechanism whose purpose is manifest↔shipped consistency disagrees with itself in five places. RECOMMENDATION: **fix** — reconcile the five pairs (bump the markers to v2.2 or truthfully downgrade the manifest entries), then let the golden snapshots pin the choice.
[SOURCE: templates/spec-kit-docs.json:4-22; templates/addons/research.md.tmpl:16; templates/addons/resource-map.md.tmpl:17; templates/addons/handover.md.tmpl:17; templates/addons/debug-delegation.md.tmpl:18; templates/addons/context-index.md.tmpl:15; templates/EXTENSION-GUIDE.md:48-56]

### f-iter007-002 — P1 — fix

`runtime/cli/spec/check-template-staleness.sh:61-71,114-118` vs the actual tree (`templates/spec-kit-docs.json` at templates/ root; no `templates/manifest/`) — CLAIM: the staleness checker "Compares SPECKIT_TEMPLATE_SOURCE version in each spec folder against the current template version" (header `:5-6`). FACT: its default manifest path `templates/manifest/spec-kit-docs.json` does not exist in this repo layout (real path: `templates/spec-kit-docs.json`); `get_current_template_version` returns "unknown"; every folder then falls into the stale/none/unknown branches — the tool as shipped reports against a phantom manifest. Not in the validator registry (not a --strict rule), so the breakage is silent until an operator runs it manually. SEVERITY: **P1 (wrong-or-unused)**. RECOMMENDATION: **fix** — point TEMPLATE_DIR resolution at the real manifest path (or resolve via the resolver), and add one self-test to the golden snapshots.
[SOURCE: runtime/cli/spec/check-template-staleness.sh:5-6,60-71,114-118,140-169; ls templates/; runtime/cli/lib/validator-registry.json (absent)]

### f-iter007-003 — P2 — document (or remove)

`runtime/lib/templates/level-contract-resolver.ts:34,65,264,288` (templateVersions in the contract) vs zero consumers — FACT: the resolver faithfully exposes `templateVersions` from the manifest, but no rule, script, or validator reads it (0 rg hits outside the resolver); the only version comparison tool is f-iter007-002's broken checker, which re-reads the JSON itself. The versions{} block's entire consumer surface is: prose policy (EXTENSION-GUIDE:48-56, MIGRATION.md:24,46) + a dead script. SEVERITY: **P2** — the typed field is load-bearing only for a tool that cannot load it. RECOMMENDATION: **document** the intended consumer (staleness checker post-fix) or **remove** the field from the resolver contract until one exists.
[SOURCE: runtime/lib/templates/level-contract-resolver.ts:34,65,264,288; runtime/cli/spec/check-template-staleness.sh:61-71; templates/EXTENSION-GUIDE.md:48-56; templates/MIGRATION.md:24,46]

### f-iter007-004 — P2 — document

`templates/core/spec.md.tmpl:36-43` + check-template-source.sh:78-93 vs the corpus (`specs/mcp-tooling/019-official-obsidian-cli/spec.md` `spec-core | v2.2`; many files use `spec | v2.2`) — FACT: the LEVEL-CONTRACT validation checks marker PRESENCE only, so: (a) the remediation text's example format (`spec + plan + tasks + checklist + decision-record | v2.2`, `:90`) names a `checklist` template that no longer exists in the manifest (echoes f-iter003-005's phantom checklist) and a template-NAME vocabulary (spec vs spec-core) that nothing normalizes; (b) one template (spec.md.tmpl) legitimately renders DIFFERENT final markers depending on level, so "the" marker name is per-render, not per-template — the manifest versions{} keys on .tmpl basenames, which only matches one of the render outcomes. SEVERITY: **P2** — the version field's unit (per .tmpl file) does not match the marker's unit (per rendered document). RECOMMENDATION: **document** — state that marker names are render-composition names, versions are template basenames, and presence (not equality) is the contract; update the stale remediation example.
[SOURCE: templates/core/spec.md.tmpl:36-43; runtime/cli/rules/check-template-source.sh:78-93; specs/mcp-tooling/019-official-obsidian-cli/spec.md; templates/spec-kit-docs.json:4-22]

### f-iter007-005 — P2 — document

Corpus census (4340×v2.2 + 32×v1.0 markers; 14 live v1.0 packets) vs MIGRATION.md:24,46 + EXTENSION-GUIDE.md:50 — FACT: legacy v1.0/v2.1 markers are officially supported indefinitely (both docs), yet the staleness checker (once fixed) would classify every v1.0 packet as stale, and no rule reconciles the promise with the tool. The system's own audit lens (this run) cannot tell "grandfathered legacy" from "drift" for 14 live packets — the distinction lives only in tribal knowledge. SEVERITY: **P2**. RECOMMENDATION: **document** — one line in MIGRATION.md or the staleness checker's help: "folders below the current version are reported stale for INFORMATION; legacy support has no sunset" (and make the fixed checker's output say so).
[SOURCE: rg census over specs/; templates/MIGRATION.md:24,46; templates/EXTENSION-GUIDE.md:50; runtime/cli/spec/check-template-staleness.sh:158-169]

## Questions Answered

- **Q7 (angle 7) — ANSWERED**: YES, drift exists, in four distinct forms: (1) manifest-internal — five of 17 manifest-declared v2.2 templates self-declare v1.0/v1.1 in their own inline markers (f-iter007-001 P1); (2) tool-side — the one version-comparing tool reads a manifest path that does not exist and effectively cannot run (f-iter007-002 P1); (3) architecture — versions{} keys per-.tmpl while markers are per-rendered-document with composition names (spec vs spec-core) and presence-only enforcement (f-iter007-004 P2, f-iter007-003 P2); (4) corpus — 32 v1.0 markers (14 live packets) grandfathered by policy with no tool expressing that (f-iter007-005 P2).

## Questions Remaining

- Q8 (queued; next: Q8 — which templates or surfaces could merge or drop without losing a validated capability; synthesis of the run's merge/drop ledger).

## Ruled Out (do not retry)

- ro-iter007-001: "the validator compares marker versions to the manifest" — ruled out: check-template-source.sh:56-66 and orchestrator.ts:664-672 are presence-only. [SOURCE: runtime/cli/rules/check-template-source.sh:56-66; runtime/lib/validation/orchestrator.ts:664-672]
- ro-iter007-002: "templateVersions has a live consumer" — ruled out: 0 rg hits outside the resolver; the staleness checker re-reads the JSON itself via the dead path. [SOURCE: runtime/lib/templates/level-contract-resolver.ts:264,288; runtime/cli/spec/check-template-staleness.sh:61-71]

## SCOPE VIOLATIONS

None. Writes: `iterations/iteration-007.md`, `deltas/iter-007.jsonl`, `deltas/event-007.json` + gateway ledger/projection writes — all inside the lineage directory. No packet-level writes, no repo tooling.

## Next Focus

Iteration 8 — Angle 8: merge/drop candidates — the consolidation ledger across all seven angles: context-index.md.tmpl (packet-types; zero contract membership, zero prose), resource-map.md.tmpl (3 vocabularies, 0 enforcement), checklist.md (fully dead), the dual completion stacks, the goal naming conflation, documents[] (wire-or-drop), the staleness checker (fix-or-drop). Cross-check: which have a validated capability (golden snapshots, registry rules, pinned tests) vs prose-only existence. Deliverable toward research.md: the maintainer's fix/merge/drop table.

## Convergence telemetry (advisory only — stopPolicy=max-iterations)

newInfoRatio = 0.208 → NOT qualifying; consecutiveQualifying 0/3. Loop continues: 3 iterations remain, forced.
