# Iteration 4: RQ4 — Route-manifest YAMLs (doctor), taxonomy naming, and executable-edge cycle parsing

## Focus
Characterize the distinct `doctor` route-manifest shape (`_routes.yaml` + per-route YAML + loader gating), determine how the taxonomy should name it, and design executable-edge parsing that traverses YAML dispatch fields so comments stop registering as false route cycles. Ground in 012 AL4 (YAML comments misread as route edges → the 3 benchmark "P0 cycles" are likely false) and AL5 (doctor route-manifest shape unnamed). This iteration produces the smoking-gun evidence for AL4.

## Findings

### F4.1 — The doctor `_routes.yaml` is a distinct, well-formed route-manifest schema (AL5: name it)
`doctor/_routes.yaml` is structurally unlike any triad asset. It is a **route manifest** with `schema_version: 1` and three sections:
- `routes:` — a list of per-target dispatch entries, each with `target` (positional name), `yaml` (per-route YAML filename), `setup_vars`, `allowed_flags`, `mutating` (enum `read-only|add-only|mutates`), `gate3_location`, `mcp_tools`, `script_invocations`, `trigger_phrases` (`_routes.yaml:33-206`). 10 routes: memory, embeddings, causal-graph, code-graph, deep-loop, skill-advisor, skill-budget, parent-skill, skill-graph-freshness, fable-mode.
- `mcp_subroutes:` — companion `/doctor:mcp` sub-actions (install/debug), parsed by a *different* command (`mcp.md`), tracked here "for advisor + CI visibility only" (`:208-235`).
- `standalone:` — `/doctor:update`, explicitly "NOT routed through /doctor" (`:237-252`).

Each per-route YAML (`doctor_memory.yaml`, `doctor_update.yaml`, … 13 files) is the executable workflow for one target. The router (`doctor/speckit.md` for `/doctor <target>`) resolves the target from argv, binds `setup_vars`, and loads the matching route YAML. This is a **route-manifest argv-router**: a manifest declares the route table; the router does argv→route binding; per-route YAMLs own execution. It is neither the triad (`_auto`/`_confirm`) nor direct-dispatch (memory). The canon's variant table (`command_router_template.md:112-116`) classifies doctor as "Direct-dispatch-script … No workflow YAML" — **factually wrong**: doctor owns 13 workflow YAMLs + a manifest.

[SOURCE: .opencode/commands/doctor/_routes.yaml:33-252]
[SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:112-116]
[SOURCE: 012/research/research.md:132-133 (AL5)]

**Candidate delta D4.1 (taxonomy name):** Name the fourth topology **route-manifest argv-router** in both vocabularies: the canon variant table (`command_router_template.md` §3) and the adapter's `classifyCommandTopology` (`validate-command-references.cjs:203-227`, which already returns `subaction router` for it via the `_routes.yaml`/`route manifest` regex at `:213`). Reconcile the two names: canon "route-manifest argv-router" ↔ adapter "subaction router" (alias). Required core for this topology: a route manifest (`_routes.yaml`) + owned per-route YAMLs + argv-binding router. Acceptance: a doctor-shaped command classifies canonically under both vocabularies without contradiction; the canon no longer claims doctor has "No workflow YAML".

### F4.2 — The route manifest is loader-gated ONLY by the router markdown, NOT harvested by the advisor
A subtle RQ4 finding: `_routes.yaml:6-14` documents (in its own header) that it is "Consumed by: NOT currently harvested by either Skill Advisor implementation." Both harvesters walk only `.opencode/skills/*/{references,assets}/*.md` frontmatter — a `.yaml` under `.opencode/commands/doctor/` is out of scope by **both file type and root**. So the manifest's `trigger_phrases` are inert today; `/doctor <target>` dispatch is presentation-menu/argv-driven by `doctor/speckit.md`, not advisor-driven. Implication: the route-manifest topology has a **loader contract that lives entirely in the router markdown** (the router reads `_routes.yaml` and binds routes) — there is no advisor/CI bridge to the manifest itself. This is why a taxonomy name + a loader-gating canon rule (the `<!-- skill_agent -->` directive, 012 F1.5) matter: the manifest's existence and shape must be declared in the router (typed, via `owned_assets` kind `route_manifest`) so tooling can find it without harvesting YAML.

[SOURCE: .opencode/commands/doctor/_routes.yaml:6-14]
[SOURCE: .opencode/commands/doctor/update.md:6 (`<!-- skill_agent: system-spec-kit -->`)]

**Candidate delta D4.2 (manifest as typed owned asset):** Add `route_manifest` as an owned-asset kind in the contract; the doctor router declares `owned_assets: [{ kind: route_manifest, path: "_routes.yaml" }, { kind: route_yaml, glob: "doctor_*.yaml" }]`. Target: contract spec + `command_router_template.md` route-manifest variant. Acceptance: a tool can discover the manifest from the router's contract without advisor YAML-harvesting; a missing manifest for a route-manifest topology fails an owned-asset check.

### F4.3 — AL4 SMOKING GUN: comments inside workflow/route YAMLs DO match the command-target regex
The route-cycle detector (`sk-doc-command.cjs:410-419`, `checkRouteGraph`) builds back-edges by running `referenceChecks.extractCommandTargets(targetText)` on each workflow target. `extractCommandTargets` (`validate-command-references.cjs:185-193`) applies the regex `COMMAND_TARGET = /\.opencode\/commands\/[A-Za-z0-9._/-]+\.(?:md|ya?ml|txt)/g` (`:55`) to the **raw text with no comment stripping**. The only `#` handling in the file is `normalizeSkillToken`'s `raw.split('#')[0]` (`:67`) — which strips `#anchor` code-anchors from already-extracted tokens, NOT YAML/markdown comment lines before extraction.

Concrete corpus instances where a **comment** contains a `.opencode/commands/.../*.{md,yaml}` path that the regex WILL match (creating a false dispatch edge):
- `doctor/_routes.yaml:5` — `# Read by: .opencode/commands/doctor/speckit.md (the router)` → regex matches `.opencode/commands/doctor/speckit.md`.
- `doctor/_routes.yaml:240` — `# /doctor:update is a STANDALONE command at .opencode/commands/doctor/update.md.` → matches `.opencode/commands/doctor/update.md`.
- `create/assets/create_readme_auto.yaml:37` — `# The setup phase in .opencode/commands/create/readme.md determines which operation` → matches `.opencode/commands/create/readme.md`.
- `create/assets/create_readme_confirm.yaml:9,40` — same router path in comments.

The cycle fires when the router references the YAML (normal) AND the YAML's comment references the router (false back-edge): e.g. `create/readme.md` → `create_readme_auto.yaml` (real) and `create_readme_auto.yaml:37` comment → `create/readme.md` (false) ⇒ `CMD-S3-ROUTE-CYCLE` P0 (`sk-doc-command.cjs:416-418`). This is the precise mechanism behind 012/GPT F05 ("some of 066's P0 cycle findings are false positives"). Additionally `_routes.yaml:87` carries a comment *inside* an `allowed_flags` list (`# apply-mode flags (--operation, --confirm) return when …`) — while `--operation`/`--confirm` are flags not paths, it demonstrates comments live inside structured YAML lists and any path-bearing comment there would be equally false.

[SOURCE: .opencode/commands/scripts/validate-command-references.cjs:55,185-193,67]
[SOURCE: .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs:410-419]
[SOURCE: .opencode/commands/doctor/_routes.yaml:5,87,240]
[SOURCE: .opencode/commands/create/assets/create_readme_auto.yaml:37, create_readme_confirm.yaml:9,40]
[SOURCE: 012/research/research.md:40,132 (AL4 / GPT F05)]

**Candidate delta D4.3 (executable-edge parsing):** Replace raw-text target extraction with **schema-aware executable-edge parsing**: (1) for `.yaml` targets, parse as YAML and traverse only declared dispatch fields (`yaml:`, `workflow:`, `mcp_tools`, `script_invocations`, `EXECUTION TARGETS`-equivalent), never keys/values inside comments; (2) strip YAML `#` comments and markdown `>`/`<!-- -->` comment lines before applying any fallback regex; (3) for `.md` routers, traverse only the EXECUTION TARGETS table + `workflowTargets`, not prose. Target: `validate-command-references.cjs:extractCommandTargets` + `sk-doc-command.cjs:checkRouteGraph`. Acceptance: a fixture YAML whose comment references its own router yields **zero** route edges (the `create_readme_*` + `_routes.yaml` cases go clean); a genuine two-YAML dispatch cycle still fails with the executable field path cited.

### F4.4 — The fix must preserve real-cycle detection (regression guard)
Executable-edge parsing must not over-correct into missing real cycles. The current raw-text approach is overly permissive (catches comments); a pure "only parse declared dispatch fields" approach could be overly strict if a family encodes dispatch in a non-canonical field. The safe design: parse YAML structurally for the *known* dispatch field set (D4.3), AND keep a raw-text fallback that runs **only after comment stripping** as a secondary signal (warn, not P0). The route-cycle finding stays P0 only when the back-edge is found via a declared dispatch field. This matches 012's "K3 — replace raw-text route inference with executable-edge parsing" and its acceptance: "Comment-only refs yield zero route edges; true cycles still fail with a path of executable fields."

[SOURCE: 012/research/research.md:62 (K3 acceptance)]
[SOURCE: .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs:416-418 (current P0 emission)]

**Candidate delta D4.4 (tiered detection):** Implement D4.3 with two tiers: structural dispatch-field match → P0 `CMD-S3-ROUTE-CYCLE`; comment-stripped-raw-text secondary match → P2 `CMD-S3-ROUTE-CYCLE-CANDIDATE` (advisory). Target: same files as D4.3 + a regression fixture with a real two-YAML cycle. Acceptance: real cycle fixture stays P0; the 3 current 066 comment-derived cycles downgrade to P2/advisory or vanish; no real cycle is missed.

### F4.5 — Topology classification also feeds on raw text (collateral AL4 effect)
`classifyCommandTopology` (`validate-command-references.cjs:203-227`) calls `extractCommandTargets(text)` at `:216` to decide "workflow router" (`extractCommandTargets(text).some(item => /\.ya?ml$/.test(item.target))`). Because that extraction includes comment paths, a router with a *comment* mentioning a `.yaml` could be misclassified as a workflow router (or inflate the workflow-router count). The same executable-edge/comment-stripping fix (D4.3) hardens topology classification for free. This is a collateral benefit and a reason to fix the extractor centrally rather than patch each call site.

[SOURCE: .opencode/commands/scripts/validate-command-references.cjs:216]

**Candidate delta D4.5:** Route all `extractCommandTargets` consumers (cycle detection, topology classification, reachability, presentation-ownership) through the single comment-stripped/structurally-aware extractor from D4.3. Acceptance: topology counts are stable when comment-only YAML paths are added/removed; no call site bypasses the hardened extractor.

## Sources Consulted
- Route manifest: `doctor/_routes.yaml` (full); census of 13 `doctor_*.yaml`.
- Adapter + validator: `sk-doc-command.cjs:387-421`; `validate-command-references.cjs:55,185-227`.
- Corpus smoking-gun comments: `_routes.yaml:5,87,240`; `create_readme_auto.yaml:37`; `create_readme_confirm.yaml:9,40`.
- Canon: `command_router_template.md:108-116`.
- Grounding: `012/research/research.md:40,62,132-133` (AL4, AL5, K3, GPT F05).

## Assessment
- **newInfoRatio: 0.82** — AL5 is confirmed at full schema detail (three-section manifest); the genuinely new contribution is the **smoking-gun proof** of AL4 (F4.3: four concrete comment→path matches that the regex WILL hit, including a router↔YAML pair that fires a real false P0) plus the tiered-detection regression-safe design (F4.4) and the collateral topology-classification hardening (F4.5).
- **Novelty justification:** Moves AL4 from "GPT hypothesized comments cause false cycles" to "here are the exact comment lines, the exact regex, and the exact router↔YAML pair that produces a false `CMD-S3-ROUTE-CYCLE` P0 today" — converting a hypothesis into filed evidence with a regression-safe fix design.
- **Confidence:** very high on F4.3 (regex + comment text + call chain all read directly); high on F4.1/F4.2 (manifest read in full); high on F4.4/F4.5 (design; the dispatch-field set needs the contract from D1.5 to be exhaustive).
- **Partial RQ4 answer:** the manifest shape is named, its loader-gating explained, the false-cycle mechanism proven, and the executable-edge fix designed tier-by-tier. Full close lands when RQ5 renders the route-manifest variant's owned-assets table.

## Reflection
- **What worked:** Grepping the workflow YAMLs for comment lines containing `.opencode/commands/` paths — the smoking gun appeared immediately (`create_readme_auto.yaml:37`, `_routes.yaml:5,240`) and tied the abstract AL4 to concrete lines + the exact regex.
- **What failed / ruled out:** Considering a pure "never read comments" regex tweak without structural parsing — rejected because prose dispatch (memory) and route tables still need raw-text fallback; the tiered structural+comment-stripped approach (F4.4) is the safe design.
- **Ruled out:** "Strip all `#` from every file globally before extraction" — too blunt (would corrupt non-comment `#` in code anchors and prose); strip per-line in YAML/markdown comment position only.
- **Recommended next focus (RQ5):** generation + ergonomics — rendering OWNED ASSETS / PRESENTATION BOUNDARY / mode table from the contract, decomposing the `deep/research.md` fat router (moving its inline PHASE-0 box + AUTONOMOUS DIRECTIVE into the presentation asset), and correcting/preventing the mislabeled `.txt` ownership entries (AL6) now that the triple-path root cause is known (F2.4).
