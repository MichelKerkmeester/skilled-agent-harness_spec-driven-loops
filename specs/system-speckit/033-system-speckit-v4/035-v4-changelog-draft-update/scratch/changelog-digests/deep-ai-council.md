# deep-ai-council changelog digest

Skill path: `.opencode/skills/system-deep-loop/deep-ai-council/`
Versions covered: v1.1.0.0 (oldest) to v2.4.1.0 (newest), 10 of the 11 entries present. Only `v1.0.0.0.md` is outside this digest.
Date range: 2026-05-21 to 2026-05-24 for the entries that carry dates. `v1.1.0.0.md` and `v2.3.0.0.md` carry no date, and `v2.4.0.0.md` and `v2.4.1.0.md` carry frontmatter but no date field.

---

## Per version, newest first

### v2.4.1.0 (`v2.4.1.0.md`)

The README was rewritten purpose-first against the refined skill README template, with the mcp-obsidian pilot as the exemplar. It now opens with a one-line pitch and a problem-first overview, then carries the round flow, the six strategy lenses, the three critique roles, the two-of-three convergence rule, the artifact tree and the command surface in narrative voice. The rewrite cleared measured HVR drift of two semicolons and nine Oxford comma patterns, and added a capability table for the six lenses. The README `version:` field went from 2.4.0.0 to 2.4.1.0 while the SKILL.md version deliberately stayed at 2.4.0.0 because no runtime behavior changed. Every command, trigger phrase and reference path behaves as before.

### v2.4.0.0 (`v2.4.0.0.md`)

RENAME: the mode packet folder `deep-loop-workflows/ai-council/` was renamed to `deep-loop-workflows/deep-ai-council/` so the folder name matches the SKILL.md `name` field, which is the invariant `package_skill.py --check` enforces. The rename is structural only. The `workflowMode` key, the `/deep:ai-council` command, the `@ai-council` agent and the `<packet>/ai-council/` artifact root are all preserved, so no command, agent or stored-artifact path breaks. Spec folder cited: `155-parent-skill-native-invocability/002-deep-loop-alignment`.

### v2.3.0.0 (`v2.3.0.0.md`)

The fifteen files under `references/` were regrouped from one flat directory into five topic subfolders: `convergence/`, `scoring/`, `structure/`, `patterns/` and `integration/`. MOVED PATH: every inbound link was repointed, covering the SKILL.md REFERENCES paths and intent map, the README structure diagram and the `@ai-council` agent mirrors across four runtimes. The smart router discovers references recursively, so routing behavior is unchanged and a workspace sweep confirmed zero stale flat reference paths in live consumers.

### v2.2.0.0 (`v2.2.0.0.md`)

Reference and asset alignment with the shared deep-skill resource model, so operators see the same resource shape as deep-research and deep-review without borrowing their loop vocabulary. Added `references/quick-reference.md` and `references/loop-protocol.md`. Added five assets: `deep-ai-council-config.json`, `deep-ai-council-strategy.md`, `deep-ai-council-dashboard.md`, `prompt_pack_round.md.tmpl` and `runtime-capabilities.json`. The config template's convergence signal was normalized to the canonical `two-of-three-agree` value used by runtime persistence and the reference docs. SKILL.md went to 2.2.0.0. No runtime script or workflow behavior changed.

### v2.1.1.0 (`v2.1.1.0.md`)

Documentation and tests only, closing the five follow-ons deferred by the v2.1.0.0 phase-5 deep-research loop. Added `references/deep-mode.md` documenting the session to topic to round hierarchy, the `session-state.jsonl` and `round-state.jsonl` state files, the cost guards and the `deep-loop-runtime/lib/council/` dependency. Added `references/findings-registry.md` for the cross-topic registry schema, fingerprint dedup, cross-topic priors and filesystem locking. Added `scripts/tests/` with five vitest files and 60 test cases covering `persist-artifacts.cjs`, `rollback.cjs`, `audit-trail.cjs`, `advise-council-completion.cjs` and `replay-graph-from-artifacts.cjs`. The feature-catalog DAC-001 narrative was reconciled to state that the agent files are `ai-council.*` while the skill keeps the `deep-ai-council` name. A full `vitest run` of the five new tests was deferred because the skill's `scripts/` has no local vitest config.

### v2.1.0.0 (`v2.1.0.0.md`)

Release-cleanup pass against the sk-doc templates and HVR standards. Added the missing root `feature-catalog/feature-catalog.md` inventory with 32 per-feature summaries across 9 categories. The README was fully rewritten to a marketing-leaning HVR voice. CHANGED DEFAULT: all 32 per-feature `Canonical catalog source` back-links now point at `feature_catalog.md` instead of the playbook. Fixed a stale SKILL.md §7 count of "18 scenarios across 7 categories" to the real "32 scenarios across 9 categories", removed a stale Phase 001 spec-folder reference and corrected the README runtime-parity references to the real `ai-council.*` agent files. The operator declined the proposed `ai-council.*` to `deep-ai-council.*` agent-file rename to avoid breaking live `--agent ai-council` callers. SKILL.md went 2.0.0.0 to 2.1.0.0. No backward-incompatible changes.

### v2.0.0.0 (`v2.0.0.0.md`)

Deep Mode, the iterative multi-topic council, shipped behind `/deep:ai-council` with `:auto` and `:confirm` modes. Added five deep-loop-runtime council primitives under `lib/council/`: `adjudicator-verdict-scoring.cjs`, `cost-guards.cjs`, `multi-seat-dispatch.cjs`, `round-state-jsonl.cjs` and `session-state-hierarchy.cjs`. Added the orchestration scripts `orchestrate-topic.cjs`, `orchestrate-session.cjs` and `scripts/lib/findings-registry.cjs`, plus the `deep_ai-council_auto.yaml` and `deep_ai-council_confirm.yaml` workflow assets, and mirrored the runtime-agent contract across the OpenCode, Claude and Codex agent surfaces. Deep mode runs a session to topic to round hierarchy, stops a topic on adjudicator-verdict stability or max rounds or failure, and writes `deep-ai-council-findings-registry.json` so later topics get compact cross-topic priors by registry fingerprint. Default cost guards: `max_rounds_per_topic = 3`, `max_topics_per_session = 5`, `saturation_threshold = 0.20` and `seats_per_round = 3`. Packet 129 added 35 tests. Single-round council behavior was preserved as an additive path, so deep mode does not replace existing `ai-council` usage.

### v1.3.0.0 (`v1.3.0.0.md`, 2026-05-23)

RENAME: the skill folder `.opencode/skills/sk-ai-council/` was renamed to the deep-loop-workflows council folder, and the SKILL.md frontmatter was bumped to `name: deep-ai-council` and `version: 1.3.0.0`. Internal references were updated across SKILL.md, README.md, `graph-metadata.json`, `references/`, `scripts/`, `feature-catalog/` and `manual-testing-playbook/`. The council rejoined the `deep-*` family alongside deep-review, deep-research, deep-agent-improvement and deep-loop-runtime, following the 130 research verdict. The runtime agent slug stayed `ai-council` because agent identity is already decoupled from the skill folder slug. This is a point release in the v1.x single-round-council era because the runtime model did not change.

### v1.2.0.0 (`v1.2.0.0.md`, 2026-05-21)

RENAME: the skill folder and the three runtime agent mirrors were renamed. Note that this entry was itself caught by the later global rename sed, so both sides of the arrow now read `deep-ai-council` and the original slug is no longer legible in the file. What is legible: the agent went from `deep-ai-council.{md,toml}` to `ai-council.{md,toml}` across the OpenCode, Claude and Codex mirrors, dropping the `deep-` prefix so the agent identity is bare `@ai-council`. REMOVED: the skill left the `deep-loop` family for `sk-util` with `category` changing from `autonomous-loop` to `utility`, which left the `deep-loop` family as strictly deep-research plus deep-review in the recompiled `skill-graph.json` of 22 skills across 6 families. About 78 skill-body files were substituted, plus sibling skill graph edges, the advisor scorer code and fixtures under `system-skill-advisor`, the council MCP test surface, three runtime agent README.txt inventories, AGENTS.md, CLAUDE.md, the root README.md and `.codex/config.toml`. Behavior, trigger phrases, MCP wiring, the council graph projection and the deliberation logic were all unchanged. Historical surfaces were deliberately not edited, including `v1.0.0.0.md` and `v1.1.0.0.md`, the originating 101 packet and the frozen benchmark fixtures. Advisor confidence for the new name measured 0.95.

### v1.1.0.0 (`v1.1.0.0.md`)

The first major iteration after the initial v1.0.0.0 release, landing seven additive child packets under packet 101. Phase 003 added a dedicated council graph as a derived SQLite projection with four MCP tools, `council_graph_upsert`, `council_graph_query`, `council_graph_status` and `council_graph_convergence`, registered as a distinct family from the existing `deep_loop_graph_*` research and review graph. The graph models eight node kinds, ten relation kinds, five query modes and three convergence buckets, and ADR-001 records the choice of a dedicated projection over deep-loop graph reuse. Artifacts under `ai-council/**` stay authoritative and the graph rebuilds from them. Phases 004 and 005 grew the manual testing playbook from 18 to 32 scenarios across 9 categories, adding eight functional graph scenarios DAC-019 to DAC-026 and six value-comparison scenarios DAC-027 to DAC-032, and repaired two pre-existing vitest failures. Phase 006 turned the value scenarios into a fixture-driven vitest that writes measured baseline-versus-graph ratios to `council-graph-value-report.json`, showing 7x to 13x fewer file reads on speed-driven scenarios. Phase 007 added a one-command test gate, a 32-entry feature catalog replacing the "No feature catalog exists yet" placeholders, a reverse-anchor meta-test, the `replay-graph-from-artifacts.cjs` helper and Codex TOML parity assertions. Phase 008 surfaced the new artifacts through SKILL.md and added a smoke vitest, bringing `test:council` to ten vitest files, 53 tests and 0 failures. No migration was required. REMOVED: the literal "No feature catalog exists yet" placeholder text in the playbook §17 is gone, and downstream consumers must follow the real feature-catalog paths instead.

---

## Facts the v4 draft gets wrong or misses

- MISSED, packet folder rename. `v2.4.0.0.md` records the mode packet folder rename from `ai-council/` to `deep-ai-council/`, with the `workflowMode` key, the `/deep:ai-council` command, the `@ai-council` agent and the `<packet>/ai-council/` artifact root all preserved. The draft never mentions it. Draft line 165 lists the mode as "ai-council" and draft line 26 does the same, which is correct for the public command and mode key but leaves a reader with no way to know the on-disk packet is now `deep-ai-council`. Anyone scripting against the old skill path gets no upgrade note. The Upgrade Notes "Repoint what moved" bullet at draft line 444 lists other moved paths but not this one.

- MISSED, the council graph MCP tool family. `v1.1.0.0.md` ships four MCP tools, `council_graph_upsert`, `council_graph_query`, `council_graph_status` and `council_graph_convergence`, as a family distinct from `deep_loop_graph_*`, plus the derived-projection contract where `ai-council/**` artifacts stay authoritative. The draft mentions no council graph anywhere. A grep of the draft for `council_graph` returns nothing.

- MISSED, Deep Mode itself. `v2.0.0.0.md` introduces iterative multi-topic council deliberation with a session to topic to round hierarchy, adjudicator-verdict stability as a stop condition, a cross-topic findings registry and the four default cost guards. The draft's deep-loop section, lines 159 to 193, describes fan-out and the evidence ledger but never says the council became iterative and multi-topic. Draft line 165's "The modes you already use behave as before" understates this for the council specifically.

- POSSIBLE MISMATCH, "behave as before" at draft line 165. Across `v2.0.0.0.md`, `v2.2.0.0.md`, `v2.3.0.0.md` and `v2.4.0.0.md` the council gained a deep mode, a new asset family, a five-subfolder reference tree and a renamed packet folder inside this release window. The claim that the modes behave as before is true for the command surface and false for the package surface. It is worth a qualifier.

- MISSED, the reference tree regrouping. `v2.3.0.0.md` moved fifteen reference files into five topic subfolders and repointed the SKILL.md intent map, the README tree and the agent mirrors across four runtimes. The draft's Upgrade Notes at line 444 do not list this, so a consumer holding a flat `references/<file>.md` path has no signpost.

- NOT A DRAFT ERROR, but worth recording. `v1.2.0.0.md` is self-contradictory as written because a later global sed rewrote both sides of its rename arrow to the same string. Its title reads "rename from deep-ai-council" and its body renames `deep-ai-council/` to `deep-ai-council/`. The real source slug is inferable from the surviving references to packet `101-deep-multi-ai-council-skill` and the `multi-ai-council-*.vitest.ts` test names. Do not quote that entry's rename arrow in the release notes.

- The draft's factual claims about the deep-loop hub merge, the executor roster and the evidence ledger are outside what these ten entries cover, so this digest neither confirms nor contradicts them.

---

## Current version and identity

- SKILL.md frontmatter version: `2.4.0.0`, at `.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md`. This trails the newest changelog entry `v2.4.1.0.md` on purpose. That entry states the bump applied to the README `version:` field and that the SKILL.md version stays put because no runtime behavior changed.
- SKILL.md frontmatter name: `deep-ai-council`, matching the folder name after the v2.4.0.0 rename.
- Identity: a MODE, not a hub and not standalone. There is no `mode-registry.json`, `hub-router.json`, `description.json` or `graph-metadata.json` at the mode root. All four live one level up at `.opencode/skills/system-deep-loop/`, which is the parent hub.
- The parent `mode-registry.json` entry for this mode reads `workflowMode: ai-council`, `packet: deep-ai-council`, `packetSkillName: deep-ai-council`, `command: /deep:ai-council`, `agent: ai-council`, `artifactRoot: ai-council/`, `runtimeLoopType: council`, `backendKind: runtime-loop-type` and `advisorRouting.routingClass: lexical`. The registry itself notes that the legacy public key `ai-council` is preserved on the command and agent surfaces only, not on the packet folder or name.
