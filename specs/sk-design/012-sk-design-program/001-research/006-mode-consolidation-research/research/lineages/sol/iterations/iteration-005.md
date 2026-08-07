# Iteration 005 — Build-Ready Migration Plan

## Focus

Consolidate the iter 1-4 verdicts into a build-ready migration plan that a follow-up `/speckit:plan` + `/speckit:implement` packet can execute without further research. The plan must name the post-consolidation destination for every current surface, enumerate every compatibility consumer that must stay green during the migration, propose an ordered stage plan with explicit rollback conditions and verification gates, classify blast radius per stage, register residual risks, and conclude with actionable next steps.

Three decisions are still open and are closed or narrowed here:
- **Styles ownership fate** — confirmed in iter 2 as a shared non-mode hub asset; this iteration ratifies the bundle-shim policy (single shared manifest, no per-consumer per-bundle shims).
- **Audit topology** — confirmed in iter 4 as a standalone skill outside the four-survivor hub; this iteration ratifies the staged alias, the `cross-mode polish-gate-orchestration.md` reviewer ownership, and the parity-test repointing.
- **Four-survivor hub identity** — confirmed in iter 1 + iter 3 as one advisor-visible `sk-design` identity with the four surviving modes (`interface`, `motion`, `md-generator`, `design-mcp-open-design`) plus the shared styles package and the `foundations` subworkflow folded under interface.

## Actions Taken

1. Read the prompt pack, strategy, findings registry, and the four prior iteration files in full to lock the decision base.
2. Read `interface-command-contract.test.mjs` (140 lines) and `design-command-surface-check.test.mjs` (191 lines) end-to-end to enumerate every assertion that encodes the current topology.
3. Read `command-metadata.json` (907 lines) to confirm the four `preferSiblingWhen` discriminator edges for each of the five canonical commands.
4. Read `mode-registry.json` (166 lines) and `hub-router.json` (415 lines) to confirm what stays advisor-visible after audit extraction and what folds under interface.
5. Read `shared/procedures/polish-gate-orchestration.md` (51 lines) to confirm the cross-mode `owning reviewer: design-audit` contract.
6. Read `styles/README.md` to confirm the engine/adapter compatibility boundary is the load-bearing artefact, not the directory layout.
7. Synthesized the topology decision matrix, the six ordered migration stages, per-stage rollback conditions, the verification gates, the risk register, and the next-step recommendations.

## Findings

### 1. Topology decision matrix (post-consolidation destinations)

For each current surface, the post-consolidation destination is fixed. The matrix is the single source of truth a build packet must consume before any file move.

| Current surface | Post-consolidation destination | Hub mode vs standalone skill | Staged `/interface:*` aliases that stay live | Advisor-visible identity |
|---|---|---|---|---|
| `design-interface` (62 files) | `.opencode/skills/sk-design/design-interface/` (unchanged) | Hub mode | `/interface:design` (unchanged) | `sk-design` (hub) with `workflowMode=interface` |
| `design-foundations` (48 files) | Folded into `design-interface/foundations/` as a named internal subworkflow; the foundation-specific procedure cards (`tweakable-design-controls`, `component-system-inventory`, `hierarchy-rhythm-review`), `relationships-blueprint.mjs`, and the foundations-owned validators move with the subworkflow | Internal subworkflow of `interface` (not a hub mode) | `/interface:foundations` (staged alias → `workflowMode=interface` + typed `leaf=foundations`) | `sk-design` (hub); the advisor does not expose a separate `design-foundations` packet |
| `design-motion` (39 files) | `.opencode/skills/sk-design/design-motion/` (unchanged) | Hub mode | `/interface:motion` (unchanged) | `sk-design` (hub) with `workflowMode=motion` |
| `design-audit` (70 files) | Extracted to a new standalone skill `.opencode/skills/design-audit/`; the hub no longer lists it as a mode | Standalone skill, outside the four-survivor hub | `/interface:audit` (staged alias → forward to standalone skill) | Standalone `design-audit` skill (its own advisor entry); the hub keeps the alias for transition |
| `design-md-generator` (115 files + backend) | `.opencode/skills/sk-design/design-md-generator/` (unchanged) | Hub mode | `/interface:design-reference` (unchanged) | `sk-design` (hub) with `workflowMode=md-generator` |
| `design-mcp-open-design` (43 files) | `.opencode/skills/sk-design/design-mcp-open-design/` (unchanged) | Transport packet inside the hub (kept paired with a workflow mode) | `command:null` (unchanged — no `/interface:design-mcp-open-design` exists) | `sk-design` (hub) with `workflowMode=design-mcp-open-design` |
| `styles/` (7,812 files) | Hub-shared package at `.opencode/skills/sk-design/styles/` (engine + committed corpus + rebuildable database lifecycle); the path stays inside the hub so five consumers import it unchanged | Shared non-mode hub asset (not a hub mode) | n/a (no command) | Not advisor-visible; the engine facade is loaded on demand by the five consumers |

**Rationale (cited):** the four-survivor hub satisfies the iter 1 verdict that the advisor routes to one `sk-design` identity and the hub picks the mode. The standalone `design-audit` extraction satisfies the iter 4 verdict that audit carries a corpus, deterministic Python gates, and an AI-fingerprint registry that the hub-internal modes cannot host. The `foundations` subworkflow fold satisfies the iter 3 verdict that the procedure cards and the `relationship-blueprint.mjs` corpus are invoked only by the foundations workflow, not by ordinary interface work. The styles-as-shared-package verdict satisfies the iter 2 finding that five consumers depend on one storage-neutral contract.

[INFERENCE: this matrix is the single source of truth; a build packet must not invent a seventh destination or move a packet outside the listed paths] [SOURCE: research/lineages/sol/iterations/iteration-001.md:17-27] [SOURCE: research/lineages/sol/iterations/iteration-002.md:16-26] [SOURCE: research/lineages/sol/iterations/iteration-003.md:17-39] [SOURCE: research/lineages/sol/iterations/iteration-004.md:18-86]

### 2. Compatibility consumers (every migrated stage must keep these working)

The compatibility consumers are the files and contract items that encode the current topology and must be repointed OR proven still green during every stage. Each item names the file, the line range, and the named assertion.

#### 2.1 Command-contract parity test (`shared/scripts/interface-command-contract.test.mjs`)

- `EXPECTED` array at lines 10-16 lists `{ mode, canonical, action }` for all five canonical commands. The build packet must either keep all five entries (compatible alias strategy) or repoint `foundations` and `audit` to a new `ownerMode` that matches the alias's true destination.
- Line 38 asserts `registry.modes` deep-equals `["audit", "design-mcp-open-design", "foundations", "interface", "md-generator", "motion"]`. After extraction, the `audit` entry is removed from the hub registry; the test must be repointed to read the new hub registry (four entries) or split into a hub-only test plus audit-only test.
- Lines 40-49 assert that each canonical command resolves to a stable internal mode. The `foundations` and `audit` entries become "alias → forward" rows; the test must accept the alias forward.
- Lines 53-62 assert that every canonical command exposes the eight shared visible output blocks. The alias rows must keep all eight blocks in the wrapper / presentation / auto / confirm artefacts.
- Lines 64-75 assert shared contract ownership of lifecycle, proof labels, authority, and amendment behaviour. These do not change.
- Lines 77-100 assert live-command hygiene: no copied taste tables, no nested command dispatch, no evidence-free `verified=true`, no silent downstream amendment. These do not change.

[SOURCE: .opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs:10-100]

#### 2.2 Design command surface parity test (`shared/scripts/design-command-surface-check.test.mjs`)

- Lines 47-77 assert that the `allowedSiblingTokens` set equals `["/interface:audit", "/interface:design", "/interface:design-reference", "/interface:foundations", "/interface:motion", "design-mcp-open-design"]`. After audit extraction, the test must continue to include `/interface:audit` because the alias still routes; after the `foundations` fold, the test must continue to include `/interface:foundations` for the same reason. The transport token `design-mcp-open-design` stays.
- Lines 79-93 assert that mistyped real-command siblings fail validation. The test fixture uses `/interface:foundations` and `/interface:audit`; both must remain valid exact tokens.
- Lines 95-105 assert that renamed transport tokens fail validation. The fixture uses `/interface:audit` to find a record whose sibling points at `design-mcp-open-design`. After extraction, the audit metadata row still exists in the alias file, and the test must keep working.
- Lines 107-118 assert that renamed YAML `step_N` keys fail structural validation. The fixture uses `/interface:audit`; the alias artefacts must keep the expected `step_N_load_mode` shape.
- Lines 120-135 assert auto/confirm business-step drift on `/interface:foundations`. The alias artefacts must keep the same `step_3_route_proof` shape.
- Lines 137-156 assert choreography resource/action mutations on `/interface:audit`. The alias must keep the same `choreography[0].resource` shape.
- Lines 158-165 assert the `confirm-only step_0_show_prompt` rule on `/interface:motion`. Unchanged.

[SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.test.mjs:47-165]

#### 2.3 Sibling `preferSiblingWhen` discriminator edges in `command-metadata.json`

The four sibling discriminators (each re-asserts that audit is the external review surface, and that foundations is the staged alias target) are:

- `/interface:foundations` → `/interface:audit` (line 300-302): "Prefer audit when the request is to review, score, accessibility-check, or harden a design surface."
- `/interface:design` → `/interface:audit` (line 570-572): "Prefer audit when the request is findings-first review, accessibility, performance, scoring, or production hardening."
- `/interface:design-reference` → `/interface:audit` (line 717-719): "Prefer audit when the request is to review or score an existing design rather than extract its measured CSS."
- `/interface:motion` → `/interface:audit` (line 864-866): "Prefer audit when the request is findings-first quality review, release scoring, or motion-performance assessment."

All four discriminator edges must keep pointing at `/interface:audit` because the alias preserves the public surface. The internal `ownerMode` of the audit metadata record becomes a forward alias rather than a hub mode key.

[SOURCE: .opencode/skills/sk-design/command-metadata.json:300-302] [SOURCE: .opencode/skills/sk-design/command-metadata.json:570-572] [SOURCE: .opencode/skills/sk-design/command-metadata.json:717-719] [SOURCE: .opencode/skills/sk-design/command-metadata.json:864-866]

#### 2.4 Transform-verb framing/application split

- `mode-registry.json` lines 27-38 declare the `transformVerbRouting` block: `interfaceFrame: "make it"`, `auditFrame: "should it be"`, `interfaceAliases: ["bolder", "quieter", "distill", "clarify", "delight"]`, `aliasOnly: ["clarify"]`, `commandProjectionParity: ["bolder", "quieter", "distill", "delight"]`, `excludedAliases: { foundations: ["typeset", "colorize"], audit: ["harden", "polish"] }`. The split is the load-bearing contract: any consolidation that collapses it loses the framing/application distinction.
- `design-interface/references/design-process/transform-application.md` lines 25, 183, 193 resolve the verbs: `clarify` is interface-alias-only; `bolder/quieter/distill/delight` route to audit for the framing decision ("is this the right remedy?") and to interface for application. The split must be preserved by staging the audit-alias to forward the framing-question to the standalone skill.

[SOURCE: .opencode/skills/sk-design/mode-registry.json:27-38] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/transform-application.md:25-193]

#### 2.5 Cross-mode `polish-gate-orchestration.md` reviewer identity

- Lines 17, 22, 31: `owning mode: shared; owning reviewer: design-audit`. The orchestration card "spans four existing modes: design-audit owns findings and severity, design-foundations owns hierarchy and rhythm fixes, design-motion owns interaction-state and transition standards, and design-interface owns visual-direction repair." After the audit extraction, the `owning reviewer` text must keep naming `design-audit` (now the standalone skill's identity) rather than relabel it. The card explicitly states the move was to "avoid duplicating the same final-gate workflow in multiple mode folders while preserving design-audit as the reviewer."

[SOURCE: .opencode/skills/sk-design/shared/procedures/polish-gate-orchestration.md:17-31]

#### 2.6 Staged `/interface:foundations` and `/interface:audit` aliases

- `command-metadata.json` rows preserve the canonical commands `/interface:foundations` (line 174-342) and `/interface:audit` (line 3-172). Both rows must remain in the alias file so the public surface is preserved.
- The auto/confirm YAML artefacts at `.opencode/commands/interface/assets/interface-foundations-auto.yaml` and `interface-audit-auto.yaml` keep their `workflowMode=foundations` / `workflowMode=audit` lines during the alias stage; the build packet updates the workflowMode to a forward token (`alias:foundations` / `alias:audit`) only after the staged cutoff date.
- The hub SKILL.md (`sk-design/SKILL.md`) and the hub router (`hub-router.json`) keep both aliases in the router signal tables until the final stage.

[SOURCE: .opencode/skills/sk-design/command-metadata.json:3-172,174-342] [SOURCE: .opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs:10-49]

#### 2.7 AI-fingerprint registry parity contract

- `shared/scripts/ai-fingerprint-fixture-check.mjs` line 11 and `shared/scripts/ai-fingerprint-registry-check.mjs` lines 26-27 validate catalog-to-registry parity. The catalogue lives at `design-audit/assets/ai-fingerprint-registry.json` plus `assets/ai-fingerprint-fixtures/`. After audit extraction, these checks must continue to read the catalogue from the standalone skill's `assets/` directory; the two checks must move with the catalogue or accept a new path argument.

[SOURCE: .opencode/skills/sk-design/shared/scripts/ai-fingerprint-fixture-check.mjs:11] [SOURCE: .opencode/skills/sk-design/shared/scripts/ai-fingerprint-registry-check.mjs:26-27]

#### 2.8 Styles facade + adapter boundary

- `style-library.mjs` exports `runQuery` and `runHydrate` (lines 178-204). `persistent-adapter.mjs` resolves `SK_DESIGN_STYLE_DB_MODE` then defaults to `legacy` (lines 97-111, 144-170). Five consumers (interface, foundations, motion, audit, md-generator) import the facade and never the database. The facade path and the default backend mode are the load-bearing compatibility boundary; any relocation that keeps the facade path stable preserves compatibility without rewriting five consumers.

[SOURCE: .opencode/skills/sk-design/styles/lib/engine/style-library.mjs:178-204] [SOURCE: .opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs:97-170]

#### 2.9 Hub-registry six-entry invariant

- `mode-registry.json` exposes `modes` with six entries (`interface`, `foundations`, `motion`, `audit`, `md-generator`, `design-mcp-open-design`). After audit extraction, the hub shrinks to five entries (the four workflow/transport modes plus the `foundations` subworkflow must be removed from the `modes` array because the workflow passes to `design-interface`). The contract test at line 38 must be repointed to assert the new five-entry invariant.

[SOURCE: .opencode/skills/sk-design/mode-registry.json:39-165] [SOURCE: .opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs:38]

### 3. Ordered migration stages (six stages)

The migration is six stages. Each stage names the action, the files touched, the compatibility consumers that must stay green, the rollback condition, and the verification gate.

#### Stage 0 — Preflight (no topology change)

- **Action:** Capture the current green state for every shared-script test and record the current hub registry / commands / advisor metadata as a snapshot.
- **Files touched:** none. Pure read.
- **Consumers green:** the entire test suite for `interface-command-contract.test.mjs`, `design-command-surface-check.test.mjs`, `ai-fingerprint-fixture-check.mjs`, `ai-fingerprint-registry-check.mjs`, the four styles `runQuery`/`runHydrate` test files, and the procedural tests under `design-foundations/corpus/tests/`, `design-interface/corpus/tests/`, `design-motion/corpus/tests/`, `design-audit/corpus/tests/`, `design-md-generator/backend/tests/`.
- **Rollback condition:** the snapshot itself cannot revert; rollback to this stage means "stop the migration here, ship the snapshot as the current state."
- **Verification gate:** a recorded `tests-passing.txt` snapshot that names every test file and its pass count. The snapshot is the rollback anchor.

#### Stage 1 — Fold `design-foundations` into `design-interface` as a named subworkflow, keep `/interface:foundations` as a staged alias

- **Action:** move the `design-foundations/` packet contents into `design-interface/foundations/`. The packet decomposition: under `design-interface/foundations/`, place `SKILL.md` (a slimmed subworkflow contract), `procedures/` (the three foundations procedure cards), `references/` (the foundations-only static-axis references), `corpus/relationship-blueprint.mjs` (the only executable corpus asset), `corpus/tests/`, `assets/`. Update the four foundation-consumers to import the corpus from the new path. Update `hub-router.json` to drop the `foundations` router signal block (or rename it to the alias forward). Update `mode-registry.json` to drop the `foundations` mode entry. Update `command-metadata.json` to set `ownerMode: "interface"` and add a `leaf: "foundations"` discriminator on the foundations row. Update `shared/scripts/interface-command-contract.test.mjs` line 38 to assert the new five-entry hub-registry invariant (`!foundations`) and add a separate assertion that the alias row still exists. Update `shared/scripts/design-command-surface-check.test.mjs` lines 47-77 to remove `foundations` from the `allowedSiblingTokens` set used in the registry assertion but keep the alias fixture as a valid exact-token assert.
- **Files touched:** `desi…/design-foundations/` (moved), `desi…/design-interface/foundations/` (created), `desi…/design-interface/corpus/relational-exemplar.mjs` (import path), `desi…/design-interface/SKILL.md` (intent-signal lane list), `desi…/shared/scripts/interface-command-contract.test.mjs`, `desi…/shared/scripts/design-command-surface-check.test.mjs`, `desi…/mode-registry.json`, `desi…/hub-router.json`, `desi…/command-metadata.json` (foundations row).
- **Consumers green:** the four siblings' `preferSiblingWhen` discriminators for `/interface:foundations` (line 300, 570, 717, 864) must still resolve; the staged alias forward must keep the `choreography` block reachable. The `command-metadata.json` row for `/interface:audit` carries the `acceptsFrom: ["/interface:foundations", ...]` and `nextCommands: ["/interface:foundations", ...]` (lines 67, 167, 169) — these must remain resolvable. The `interface-foundations-auto.yaml` and `interface-foundations-confirm.yaml` artefacts must keep the eight visible output blocks. The `polish-gate-orchestration.md` cross-mode card's reference to `../design-foundations/procedures/hierarchy-rhythm-review.md` (line 50) must update to the new path; the test on the path is a smoke command.
- **Rollback condition:** if any of the four `preferSiblingWhen` discriminators fails validation, or the `interface-foundations-auto.yaml` / `-confirm.yaml` workflow steps lose parity, or the `interface-foundations-confirm.yaml` business-step drift test at `design-command-surface-check.test.mjs:120-135` fails, the build packet reverts to Stage 0. The revert path is `git restore` plus the snapshot.
- **Verification gate:** `design-command-surface-check.test.mjs` and `interface-command-contract.test.mjs` both pass; the `nested-command-dispatch` and `evidence-free-verified` adversarial tests at lines 90-95 stay green; the `relationship-blueprint.test.mjs` corpus tests pass; the staged `/interface:foundations` smoke command (`node …/sk-design.js alias-foundations`) routes to the interface subworkflow and produces the eight visible output blocks.

#### Stage 2 — Extract `design-audit` to a standalone skill, keep `/interface:audit` as a staged alias inside the hub

- **Action:** copy the `design-audit/` packet tree to `.opencode/skills/design-audit/` (a new top-level standalone skill). The standalone skill carries its own `SKILL.md`, `references/`, `assets/`, `procedures/`, `scripts/`, `corpus/`, and parity tests. Inside the hub, keep `design-audit/` as a thin alias packet: a `SKILL.md` that forwards to the standalone skill, the existing `command-metadata.json` row with `ownerMode: "interface"` and a `leaf: "audit"` discriminator pointing at the standalone skill, the existing `/interface:audit` command wrapper, the existing auto/confirm YAML artefacts (forwarding to the standalone skill), and the existing presentation asset. Update `hub-router.json` to drop the `audit` router signal block (or rename it to the alias forward). Update `mode-registry.json` to drop the `audit` entry from the `modes` array. Update `shared/scripts/interface-command-contract.test.mjs` line 38 to assert the new five-entry hub-registry invariant (`!audit`). Keep the `/interface:audit` alias fixture assertion in `design-command-surface-check.test.mjs`. Move `shared/scripts/ai-fingerprint-fixture-check.mjs` and `ai-fingerprint-registry-check.mjs` to the standalone skill's `scripts/` directory; update the parity tests to read the catalogue from the standalone skill's `assets/` directory. Update `shared/procedures/polish-gate-orchestration.md` to keep the `owning reviewer: design-audit` text (now a standalone skill identity) and update the relative path to `../design-audit/procedures/...` (still resolves to the alias packet, which forwards to the standalone).
- **Files touched:** new `.opencode/skills/design-audit/` (created), `desi…/design-audit/` (becomes a thin alias packet), `desi…/shared/scripts/ai-fingerprint-fixture-check.mjs` (moved), `desi…/shared/scripts/ai-fingerprint-registry-check.mjs` (moved), `desi…/shared/procedures/polish-gate-orchestration.md` (path references), `desi…/shared/scripts/interface-command-contract.test.mjs`, `desi…/shared/scripts/design-command-surface-check.test.mjs`, `desi…/mode-registry.json`, `desi…/hub-router.json`, `desi…/command-metadata.json` (audit row).
- **Consumers green:** the four siblings' `preferSiblingWhen` discriminators for `/interface:audit` (lines 300, 570, 717, 864) must still resolve; the staged alias forward must keep the `choreography` block reachable. The `pairWithHubWhen` text on the four siblings (line 320, 590, 737, 884) and the `sequence.typicallyAfter` / `typicallyBefore` rows (lines 152-153, 322-323, 592-593, 739-740, 886-887) must keep `/interface:audit` as a valid sibling token. The `mode-registry.json` `transformVerbRouting.excludedAliases.audit` entry (line 36) must keep listing audit as the framing verb for `harden` and `polish` even after the extraction. The `interface-audit-auto.yaml` and `interface-audit-confirm.yaml` artefacts must keep the eight visible output blocks. The standalone skill's `corpus/tests/comparison-lane.test.mjs` must pass.
- **Rollback condition:** if any of the four sibling discriminators fails validation, if the `transform-application.md` framing verbs lose their audit counterpart, if the polish-gate-orchestration card's reviewer identity changes, or if the AI-fingerprint parity tests fail, the build packet reverts to Stage 1. The revert path is `git restore` plus the Stage 1 snapshot.
- **Verification gate:** `design-command-surface-check.test.mjs` and `interface-command-contract.test.mjs` both pass; the `mistyped real-command sibling` test at lines 79-93 stays green; the `renamed transport token` test at lines 95-105 stays green; the `choreography resource and action mutations` test at lines 137-156 stays green; the standalone skill's `corpus/tests/comparison-lane.test.mjs` passes; the AI-fingerprint registry fixture parity checks pass; the staged `/interface:audit` smoke command (`node …/sk-design.js alias-audit`) routes to the standalone skill and produces the eight visible output blocks.

#### Stage 3 — Repoint the four `preferSiblingWhen` discriminator edges to the new audit identity

- **Action:** no public surface change. Update the four sibling `command-metadata.json` rows to keep the `sibling: "/interface:audit"` token (the alias is still the surfaced token) but add an `auditIdentity: "design-audit"` hint field that resolves to the standalone skill's `packetSkillName`. The discriminator `when` text stays the same. Update `design-command-surface-check.test.mjs` to assert the new `auditIdentity` hint resolves to the standalone skill's identity.
- **Files touched:** `desi…/command-metadata.json` (four rows), `desi…/shared/scripts/design-command-surface-check.test.mjs` (new assertion).
- **Consumers green:** the `acceptsFrom` and `nextCommands` arrays on the audit metadata row (lines 67, 167, 169) stay green; the `sequence.typicallyAfter` / `typicallyBefore` rows (lines 152-153, 322-323, 592-593, 739-740, 886-887) stay green; the advisor metadata `.opencode/skills/sk-design/graph-metadata.json` (already routing the hub identity) stays green.
- **Rollback condition:** if the new `auditIdentity` hint fails parity, or any sibling's `preferSiblingWhen` block loses the audit row, revert to Stage 2.
- **Verification gate:** the new parity test passes; the four sibling discriminators all still resolve to a valid alias; the advisor still routes a generic design keyword to the hub and the hub still picks the sibling.

#### Stage 4 — Move the shared styles package to a hub-shared package with a single manifest

- **Action:** keep `styles/` inside the hub (the path is the load-bearing boundary). Add a `<harness>/_manifest.json` policy that makes the bundle shim policy explicit: a single shared manifest enumerates which bundles are queryable; no per-consumer per-bundle shim files. Update the engine README to declare the policy. The five consumers (interface, foundations, motion, audit, md-generator) keep importing the facade unchanged; the manifest lives at the engine root.
- **Files touched:** `desi…/styles/_manifest.json` (policy field added), `desi…/styles/lib/engine/README.md` (policy paragraph added).
- **Consumers green:** the `runQuery` and `runHydrate` return shape stays the same; the byte caps and the include allowlists stay the same; the `SK_DESIGN_STYLE_DB_MODE` default stays `legacy`; the four styles test files (`relational-exemplar.test.mjs`, `relationship-blueprint.test.mjs`, `motion-evidence.test.mjs`, `comparison-lane.test.mjs`) keep passing.
- **Rollback condition:** if the manifest policy contradicts the engine's documented allowed-include behaviour, or any of the five consumers sees a different query/hydrate response shape, revert the manifest change.
- **Verification gate:** running `node .opencode/skills/sk-design/styles/lib/engine/style-library.mjs build --check` returns zero errors; the engine query/hydrate smoke commands return the same shape on the same input; the five corpus tests pass.

#### Stage 5 — Final stage: drop the staged aliases after a deprecation window

- **Action:** after a 30-day deprecation window (operator-set), remove the `/interface:foundations` and `/interface:audit` staged aliases. Update `command-metadata.json` to remove the alias rows. Update `hub-router.json` to remove the alias router signal blocks. Update `interface-command-contract.test.mjs` line 38 to assert the four-entry hub-registry invariant. Update `design-command-surface-check.test.mjs` to assert the four sibling token set (no alias). Update the polish-gate-orchestration card's reference paths to point at the standalone skill. Update the four sibling `preferSiblingWhen` rows to point at the standalone skill's `design-audit` identity.
- **Files touched:** `desi…/command-metadata.json`, `desi…/hub-router.json`, `desi…/shared/scripts/interface-command-contract.test.mjs`, `desi…/shared/scripts/design-command-surface-check.test.mjs`, `desi…/shared/procedures/polish-gate-orchestration.md`.
- **Consumers green:** operator-run history shows no in-flight work that depends on the alias; the staged smoke commands (`alias-foundations`, `alias-audit`) return "deprecated" instead of routing. The standalone skill's `corpus/tests/comparison-lane.test.mjs` passes; the interface subworkflow owns the foundations procedure cards.
- **Rollback condition:** not applicable — the deprecation window is the operator's choice. The operator can extend the window rather than revert.
- **Verification gate:** the four-entry hub-registry invariant test passes; the deprecation warnings fire on every alias invocation; the standalone `design-audit` skill is reachable directly; the interface subworkflow owns the foundations procedure cards.

### 4. Rollback + abort criteria

| Stage | Per-stage rollback | Whole-plan abort criteria |
|---|---|---|
| Stage 0 (preflight) | Stop the migration; ship the snapshot as the current state. | Test suite is not green at the snapshot moment; abort the whole plan. |
| Stage 1 (foundations fold) | `git restore` plus the Stage 0 snapshot. | The `interface-foundations-auto.yaml` / `-confirm.yaml` step-3 drift test fails after two attempts; abort the whole plan. |
| Stage 2 (audit extraction) | `git restore` plus the Stage 1 snapshot. | The AI-fingerprint registry fixture parity fails after two attempts, or the polish-gate-orchestration card's `owning reviewer` identity changes; abort the whole plan. |
| Stage 3 (discriminator repointing) | `git restore` plus the Stage 2 snapshot. | Any of the four sibling discriminators fails validation after two attempts; abort the whole plan. |
| Stage 4 (styles manifest) | Revert the manifest change only. | The engine's `build --check` command returns non-zero after two attempts; abort the whole plan. |
| Stage 5 (deprecation window) | Extend the window; do not revert. | The deprecation warnings fire on every alias invocation but traffic stays non-zero after 30 days; abort the deprecation, restore the alias. |

**Blast radius per stage:**

- Stage 1: zero external consumers. The hub's advisor identity stays the same; the only on-disk change is the packet folder move and the test/`command-metadata`/`hub-router`/`mode-registry` updates. No deployed server, no installed client, no API consumer sees the change.
- Stage 2: zero external consumers. The standalone skill is added; the alias keeps the public surface. The shared scripts that read the AI-fingerprint registry fixture path move with the catalogue. Again, no external caller sees the change.
- Stage 3: zero external consumers. The discriminator hint is a new field; existing consumers ignore unknown fields. The `acceptsFrom` and `nextCommands` arrays keep the same tokens.
- Stage 4: zero external consumers. The manifest policy is a new field; the engine response shape is unchanged.
- Stage 5: alias deprecation. Anyone running `/interface:foundations` or `/interface:audit` post-cutoff sees a "deprecated" message instead of a route. The deprecation window is the blast radius; the operator's choice to extend it is the rollback path.

### 5. Verification gates

#### 5.1 Test suites that must stay green end-to-end

- `node --test .opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs` (full file, 140 lines, 7 tests)
- `node --test .opencode/skills/sk-design/shared/scripts/design-command-surface-check.test.mjs` (full file, 191 lines, 7 tests)
- `node --test .opencode/skills/sk-design/design-interface/corpus/tests/relational-exemplar.test.mjs`
- `node --test .opencode/skills/sk-design/design-foundations/corpus/tests/relationship-blueprint.test.mjs` (repointed to the new interface/foundations/ path before any consumer rewrite)
- `node --test .opencode/skills/sk-design/design-motion/corpus/tests/motion-evidence.test.mjs`
- `node --test .opencode/skills/sk-design/design-audit/corpus/tests/comparison-lane.test.mjs` (moves with the standalone skill at Stage 2)
- `node --test .opencode/skills/sk-design/design-md-generator/backend/tests/study-exemplars.test.ts`
- `node --test .opencode/skills/sk-design/styles/tests/database/adapter.test.mjs`
- `node .opencode/skills/sk-design/styles/scripts/ai-fingerprint-fixture-check.mjs` (moves with the standalone skill at Stage 2)
- `node .opencode/skills/sk-design/styles/scripts/ai-fingerprint-registry-check.mjs` (moves with the standalone skill at Stage 2)

[SOURCE: .opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs:1-140] [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.test.mjs:1-191]

#### 5.2 Smoke commands the operator runs between stages

- `node .opencode/skills/sk-design/styles/lib/engine/style-library.mjs build --check` — confirms the committed corpus is consistent before and after each stage.
- `node .opencode/skills/sk-design/styles/lib/engine/style-library.mjs query --request '{"text":"product interface restrained motion","useFts":false,"limit":2}'` — confirms the facade contract is unchanged.
- `node .opencode/skills/sk-design/styles/lib/engine/style-library.mjs hydrate --request '{"slug":"getburnt"}'` — confirms hydration byte caps and manifest policy are unchanged.
- `node .opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs` — parity gate (Stage 1, 2, 5).
- `node .opencode/skills/sk-design/shared/scripts/design-command-surface-check.test.mjs` — parity gate (Stage 1, 2, 3, 5).
- `node .opencode/skills/sk-design/shared/scripts/ai-fingerprint-fixture-check.mjs` — catalogue parity gate (Stage 2, 5).
- `node .opencode/skills/sk-design/shared/scripts/ai-fingerprint-registry-check.mjs` — registry parity gate (Stage 2, 5).
- `node .opencode/skills/sk-design/style-test-alias.js alias-foundations` — staged alias smoke (Stage 1, 5).
- `node .opencode/skills/sk-design/style-test-alias.js alias-audit` — staged alias smoke (Stage 2, 5).

[SOURCE: .opencode/skills/sk-design/styles/lib/engine/style-library.mjs:178-204] [SOURCE: .opencode/skills/sk-design/styles/README.md:16-19]

#### 5.3 Observability signals that indicate a stage has settled

- All listed test files pass with their documented pass count.
- The engine `build --check` returns zero errors.
- The staged alias smoke commands return the eight visible output blocks (Route Proof, Resolved Brief, Context Manifest, Grounding Record, Creation/Remediation Artifact, Critique/Validation, Evidence Ledger, Next Action/Handoff).
- The advisor metadata `.opencode/skills/sk-design/graph-metadata.json` still routes the single `sk-design` identity.
- The `mode-registry.json` `modes` array contains the expected number of entries at each stage (six at Stage 0, five at Stage 1, four at Stage 2 onward).
- The `command-metadata.json` `ownerMode` values match the stage-specific contract (foundations → `interface`, audit → `interface` until Stage 5 cuts the alias).

### 6. Risk register

| # | Risk | Probability | Impact | Mitigation | Stage at risk |
|---|---|---|---|---|---|
| 1 | `interface-foundations-auto.yaml` step-3 drift after the foundations fold causes the `design-command-surface-check.test.mjs:120-135` test to fail | Med | High — the foundations alias is the public surface; a drift here breaks the alias contract | Repoint the workflowMode and re-run the drift test twice; if still failing, revert to Stage 0 via `git restore` plus the snapshot | Stage 1 |
| 2 | AI-fingerprint registry catalogue does not move cleanly with the standalone skill; the parity scripts fail | Low | High — the parity contract is the cross-mode contract that locks the audit identity | Move the catalogue and the two parity scripts atomically; both checks must pass before the standalone skill is reachable; if either fails, revert to Stage 1 | Stage 2 |
| 3 | The four sibling `preferSiblingWhen` discriminators lose the audit row after the audit extraction, silently breaking the advisor routing | Med | High — the cross-mode polish orchestration depends on the audit row | Stage 3 explicitly repoints the discriminators; the new `auditIdentity` hint field is the safety net; verify by running the `mistyped real-command sibling` test at `design-command-surface-check.test.mjs:79-93` | Stage 2-3 |
| 4 | The transform-verb framing split (`mode-registry.json:27-38`) is lost when the audit mode is removed from the hub; `harden` and `polish` lose their audit counterpart | Low | Medium — the verbs are still routed, but the framing/application split is data-model lost | Stage 2 keeps the `mode-registry.json` `transformVerbRouting.excludedAliases.audit` row even after the audit mode is removed; the row is a registry-level declaration that does not depend on a registered mode | Stage 2 |
| 5 | The shared styles package is relocated out of the hub by an unrelated cleanup, breaking the five consumers' import paths | Low | High — five consumers depend on the facade path; a path change requires rewriting every consumer | The migration implicitly ratifies the path inside the hub; the build packet's Stage 4 adds a policy row to the manifest that asserts the facade path; the engine's `build --check` command is the gate | Stage 4 |
| 6 | The deprecation window in Stage 5 expires while in-flight work still depends on the alias; operators see "deprecated" instead of a route | Med | Medium — operator experience; the work is recoverable by extending the window | The 30-day window is operator-set; the build packet's Stage 5 verification gate includes a traffic-observation check; if non-zero alias traffic persists, the window extends | Stage 5 |
| 7 | The orchestrator (this deep-research loop) hands the plan to a build packet that misreads the staged-alias contract and moves the audit workflow into the interface packet | Low | High — collides with the iter 4 verdict | The plan's topology decision matrix names the standalone-skill destination explicitly; the build packet's Stage 2 verification gate (standalone-skill reachability test) is the safety net | Stage 2 |

### 7. Final recommendations (sized for a build packet)

Five next steps, sized so a follow-up `/speckit:plan` + `/speckit:implement` packet can execute them without further research.

1. **Adopt the topology decision matrix (Section 1) as the build packet's contract.** The matrix is the single source of truth for where every surface lands. The build packet must not invent a seventh destination or move a packet outside the listed paths. The deliverables are: the four `design-*` survivor packets remain at `.opencode/skills/sk-design/design-{interface,motion,md-generator,mcp-open-design}/`; `design-foundations/` becomes `design-interface/foundations/`; `design-audit/` becomes a new top-level standalone skill at `.opencode/skills/design-audit/`; `styles/` stays inside the hub as a shared non-mode package.

2. **Execute Stage 1 (foundations fold) before Stage 2 (audit extraction).** The two stages are independent in principle, but the foundation-fold is a smaller blast radius and validates the staged-alias pattern that Stage 2 reuses. If the foundations fold fails, the audit extraction is paused; this is the safer ordering.

3. **Keep the staged aliases as the public surface for 30 days minimum.** The two aliases (`/interface:foundations`, `/interface:audit`) are the public contract. Cutting them too early breaks operator workflow. The build packet's Stage 5 includes a traffic-observation check that the operator must run before the cutoff date.

4. **Move the AI-fingerprint registry catalogue and the two parity scripts atomically with the standalone skill.** The catalogue and the scripts are a single contract; splitting them across two moves creates a transient window where the catalogue exists in the new place but the parity scripts still read the old path. The build packet's Stage 2 must move them in one atomic commit.

5. **Run the staged alias smoke commands between every stage.** The eight visible output blocks (Route Proof, Resolved Brief, Context Manifest, Grounding Record, Creation/Remediation Artifact, Critique/Validation, Evidence Ledger, Next Action/Handoff) are the public contract. The smoke commands are the build packet's between-stage gate; failing the smoke command aborts the stage.

## Questions Answered

- **What ordered compatibility, rollback, and verification stages should the build packet execute?** Answered. Six stages (Stage 0 preflight, Stage 1 foundations fold, Stage 2 audit extraction, Stage 3 discriminator repointing, Stage 4 styles manifest, Stage 5 deprecation). Each stage names the action, the files touched, the compatibility consumers that must stay green, the rollback condition, and the verification gate.
- **Should styles ownership remain hub-shared, become a separate asset package, or be dependency-injected into surviving skills?** Answered. Hub-shared at `styles/`, with a single shared manifest policy and the engine facade as the compatibility boundary. No per-consumer per-bundle shims. Dependency injection is rejected because five consumers depend on one storage-neutral contract, and the facade path is the load-bearing boundary.
- **Does the four-survivor topology preserve the single advisor identity or intentionally split it?** Answered. The hub identity preserves the single `sk-design` advisor entry. The audit extraction is a standalone skill with its own advisor entry (per the iter 4 verdict), but the alias `/interface:audit` keeps the public surface continuous for the transition window. The hub identity is intentional split-by-extraction (audit becomes its own advisor entry) plus continuous-by-alias (the public surface still routes through the hub).

## Questions Remaining

- Does the `design-md-generator` packet need any structural separation from `design-interface` beyond the current packet layout? (carried forward from iter 4)
- How does the build packet validate that the staged aliases (`/interface:foundations`, `/interface:audit`) continue to route correctly during each migration stage? (carried forward from iter 4) — partially answered by Stage 5's smoke commands; the operator's responsibility for the actual alias forward implementation.
- Is the build packet's atomic-commit ordering sufficient for the AI-fingerprint catalogue move, or is the move better protected by a feature-flag that switches the parity scripts' path on commit? (open; the build packet decides).
- Production invocation frequency remains unavailable; prior iterations established bounded call cardinality but not telemetry. (carried forward; no in-scope change.)

## Next Focus

This is the final iteration. The workflow reducer will refresh the strategy, registry, and dashboard; the auto workflow will proceed to synthesis (`phase_synthesis`) where the migration plan is consolidated into `research.md`. The synthesis inherits the six open questions remaining (three from the prior iterations + three from this iteration) and the topology decision matrix as the central deliverable.

## Ruled-Out Directions

- **Move `design-audit` to `design-interface/audit/` as a subworkflow.** Ruled out by iter 4: audit carries its own corpus, deterministic Python gates, and an AI-fingerprint registry that the hub-internal modes cannot host. The standalone skill is the only topology that preserves those capabilities.
- **Eliminate the polish-gate-orchestration cross-mode reviewer identity.** Ruled out by iter 4: the card's `owning reviewer: design-audit` is the cross-mode contract that locks the audit identity. Removing it would lose the shared orchestrator's authority.
- **Combine the foundations fold and the audit extraction into a single stage.** Ruled out: the two stages have different blast radius and different verification gates. Combining them hides failure attribution and complicates rollback.
- **Repoint the four `preferSiblingWhen` discriminators in Stage 1 before the audit extraction.** Ruled out: Stage 1 changes the foundations token, Stage 3 changes the audit identity hint. Doing both in one stage creates a transient window where the discriminators point at a non-existent row.
- **Move the styles package outside the hub to a separate asset package.** Ruled out by iter 2: five consumers depend on the facade path; relocating the package requires rewriting every consumer. The hub-shared package is the smallest, safest destination.
- **Dependency-inject the styles package into each surviving skill.** Ruled out by iter 2: dependency injection duplicates the storage-neutral contract across five consumers and forces every consumer to bundle the same engine code. The hub-shared package keeps the contract singular.

## Sources Consulted

- `.opencode/specs/sk-design/012-sk-design-program/001-research/006-mode-consolidation-research/research/lineages/sol/prompts/iteration-5.md:1-92`
- `.opencode/specs/sk-design/012-sk-design-program/001-research/006-mode-consolidation-research/research/lineages/sol/deep-research-strategy.md:1-107`
- `.opencode/specs/sk-design/012-sk-design-program/001-research/006-mode-consolidation-research/research/lineages/sol/findings-registry.json:1-213`
- `research/lineages/sol/iterations/iteration-001.md:1-95`
- `research/lineages/sol/iterations/iteration-002.md:1-50`
- `research/lineages/sol/iterations/iteration-003.md:1-60`
- `research/lineages/sol/iterations/iteration-004.md:1-96`
- `.opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs:1-140`
- `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.test.mjs:1-191`
- `.opencode/skills/sk-design/command-metadata.json:1-907`
- `.opencode/skills/sk-design/mode-registry.json:1-166`
- `.opencode/skills/sk-design/hub-router.json:1-415`
- `.opencode/skills/sk-design/shared/procedures/polish-gate-orchestration.md:1-51`
- `.opencode/skills/sk-design/styles/README.md:1-21`
- `.opencode/skills/sk-design/styles/lib/engine/style-library.mjs:178-204`
- `.opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs:97-170`

## Assessment

- **New information ratio:** 0.65
- **Novelty justification:** Six fully new findings (topology decision matrix, compatibility consumer enumeration with line ranges, six ordered migration stages with per-stage rollback and verification gates, per-stage blast radius, six-risk register, five actionable next steps) plus three partial-new findings (styles placement final, audit topology final, four-survivor hub identity final). The synthesis closes the iter 4 open questions about how the staged aliases route during each stage (smoke commands + per-stage verification gates) and the per-stage blast radius.
- **Questions addressed:** 3 of 6 open questions closed (migration plan, styles placement final, hub identity vs split).
- **Questions answered:** 3 (the three above).
- **Questions remaining:** 3 carried forward + 1 new open (atomic-commit vs feature-flag for the AI-fingerprint move).

## Reflection

- **What worked and why:** Reading the parity tests in full (140 + 191 lines) plus the 907-line `command-metadata.json` and the 166-line `mode-registry.json` made every compatibility consumer enumerable with exact line ranges. The prior iteration files (1-4) gave a tight decision base that this iteration only had to organize, not re-derive.
- **What did not work and why:** The first attempt to count style consumers would have been ambiguous without the iter 2 cap-and-cardinality verdict. Reusing iter 2's finding (five consumers, bounded query/hydration) saved a re-investigation.
- **What I would do differently:** If Stage 5's deprecation window were more than 30 days, I would split it into a "deprecation warning" stage and a "deprecation removal" stage. The 30-day window keeps the plan to six stages; longer windows would justify seven.

## Recommended Next Focus

The build packet picks up the plan; the synthesis consolidates it into `research.md`. The follow-up deep-review of the plan (if requested) should check the build packet's atomic commits against the per-stage rollback conditions.
