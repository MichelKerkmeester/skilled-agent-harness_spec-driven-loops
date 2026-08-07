# Frozen rename contract: `sk-` mode and packet prefixes

This contract is governed by the frozen 21-row map in
`.opencode/specs/sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename/assets/rename-map.json`.
It covers the four parent hubs `sk-prompt`, `sk-design`, `sk-code`, and `sk-doc`.
The map has 21 workflow-mode rows, 20 distinct packet directories, and one deliberate
many-to-one exception: `create-skill-parent` becomes `sk-create-skill-parent`, while its
shared packet becomes `sk-create-skill`.

The citations below are freeze-time evidence from the two research lineages and the live
files they cited. A claim without a verifiable source line is not part of this contract.

## 1. Merged consumer-class inventory

The two lineage catalogs are merged here by behavior rather than by lettered ID. The
action column is summarized here and made exact in §2.

| Class | Consumer surface and verified shape | Freeze evidence | Action |
| --- | --- | --- | --- |
| Mode registry identity | Four `mode-registry.json` files; `modes[].workflowMode`, `modes[].packet`, `modes[].packetSkillName`, `modes[].advisorRouting.packetSkillName`; mapped extension arrays only when they contain an exact mapped identity | `.opencode/skills/sk-code/mode-registry.json:22-98`; `.opencode/skills/sk-design/mode-registry.json:34-94`; `.opencode/skills/sk-doc/mode-registry.json:17-160`; `.opencode/skills/sk-prompt/mode-registry.json:17-40` | EDITED |
| Hub router keys and packet paths | `routerPolicy.tieBreak[]`, `bundleRules[].whenAll[]`, `routerSignals.<workflowMode>` keys, and `routerSignals.*.resources[]` packet paths; vocabulary keywords and class labels are not identity fields | `.opencode/skills/sk-code/hub-router.json:7-35`; `.opencode/skills/sk-design/hub-router.json:7-60`; `.opencode/skills/sk-doc/hub-router.json:7-49`; `.opencode/skills/sk-prompt/hub-router.json:7-18`; `.opencode/skills/sk-doc/create-skill/references/parent-skill/parent-hub-router-schema.md:162-165` | EDITED |
| Packet directories and packet `SKILL.md` names | Packet directory basenames and packet frontmatter `name:` are the same identity surface | `.opencode/skills/sk-code/code-quality/SKILL.md:1-3`; `.opencode/skills/sk-design/design-interface/SKILL.md:1-3`; `.opencode/skills/sk-doc/create-skill/SKILL.md:1-3`; `.opencode/skills/sk-prompt/prompt-improve/SKILL.md:1-3` | EDITED, in the identity commit |
| Leaf manifest | Generated `leaf-manifest.json`; generated entries carry `workflowMode`, `packet`, and discovered leaf paths | `.opencode/skills/sk-code/leaf-manifest.json:71-72,218-219`; `.opencode/skills/sk-design/leaf-manifest.json:15-16,58-59`; `.opencode/skills/sk-doc/leaf-manifest.json:185-186,216-217`; `.opencode/skills/sk-prompt/leaf-manifest.json:13-14` | REGENERATED |
| Leaf aliases | `sk-doc/leaf-aliases.json` entries carry `[].workflowMode`; `diskPath` is a path slot only if a mapped packet segment occurs | `.opencode/skills/sk-doc/leaf-aliases.json:1-30` | EDITED |
| Hub advisor metadata | `description.json` is prose/keyword metadata; `graph-metadata.json` has explicit path-bearing fields such as `key_files[]` and `entities[].path`; do not sweep `description`, `category`, `domains[]`, `key_topics[]`, `keywords[]`, or `causal_summary` prose | `.opencode/skills/sk-code/description.json:2-43`; `.opencode/skills/sk-design/description.json:2-45`; `.opencode/skills/sk-doc/description.json:2-32`; `.opencode/skills/sk-prompt/description.json:2-25`; `.opencode/skills/sk-code/graph-metadata.json:207-228`; `.opencode/skills/sk-doc/graph-metadata.json:112-153`; `.opencode/skills/sk-prompt/graph-metadata.json:121-160` | EDITED for verified graph path slots; LEFT ALONE for description/prose and keyword vocabulary |
| Manual-testing playbook route gold | Markdown frontmatter `expected_intent:` scalars, including `+`/`→` multi-intent forms; adjacent narrative is a different class | `.opencode/skills/sk-code/manual-testing-playbook/compiled-routing/surface-bundle-compiled-routing.md:1-15`; `.opencode/skills/sk-design/manual-testing-playbook/compiled-routing/bundle-rules-compiled-routing.md:1-15`; `.opencode/skills/sk-prompt/manual-testing-playbook/compiled-routing/default-mode-compiled-routing.md:1-14`; `.opencode/skills/sk-doc/manual-testing-playbook/intent-detection/doc-quality.md:1-8` | EDITED only at `expected_intent:` |
| Manual-testing playbook narrative | Markdown prose, examples, titles, and quoted assertions such as `workflowMode: interface`; these can contain ordinary English collisions | `.opencode/skills/sk-code/hub-router.json:42-49`; `.opencode/skills/sk-design/SKILL.md:168-171` | LEFT ALONE |
| Benchmark archives, route-gold reports, and compiled-serving snapshots | Historical `benchmark/reports/**` JSON/Markdown, including `workflowMode` and `packet` telemetry; compiled-serving snapshots are a separate derived surface | `.opencode/skills/sk-code/benchmark/reports/baseline/skill-benchmark-report.json:1042-1062`; `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:256-267`; `.opencode/bin/README.md:28,177` | LEFT ALONE for history and snapshots; REGENERATED additively for post-rename benchmark reports |
| Lane C benchmark fixtures | JSON fixture `expected` fields such as `workflowMode`, `packet`, `routeOutcome`, `resources`, and `forbiddenWorkflowModes` | `.opencode/skills/system-deep-loop/deep-improvement/assets/skill-benchmark/fixtures/sk-design/sk-design-alias-interface-001.private.json:3-13`; `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:269-295` | EDITED for exact mapped JSON fields; unmapped historical modes stay unchanged |
| Command routers | Command Markdown/YAML path literals and structured route fields; narrative statements such as `workflowMode=interface` are not generic rewrite targets | `.opencode/commands/interface/design.md:7-29,44-61`; `.opencode/commands/create/skill.md:7-24`; `.opencode/commands/prompt/improve.md:7-13,87` | EDITED only for typed fields and bounded path literals |
| Command metadata | `sk-design/command-metadata.json.ownerMode`, `choreography[].skill`, and `choreography[].resource`; command names in `command`/`next[]` remain slash-command contracts | `.opencode/skills/sk-design/command-metadata.json:1-5,75-104` | EDITED |
| Agent definitions | Canonical `.opencode/agents/` and real runtime copies; exact packet path literals and explicit typed route fields only | `.opencode/agents/markdown.md:186-203`; `.opencode/agents/prompt-improver.md:55-67`; `.claude/agents/prompt-improver.md:47-49` | EDITED only for typed fields and bounded path literals |
| Runtime skill mirrors | `.claude/skills` is a symlink to `.opencode/skills` in this checkout; `.devin/skills` is a separate naming layer, while `.codex`/`.cursor` agent and hook consumers are handled by the agent/path classes | `.claude/skills` symlink target verified at freeze; `.codex/hooks.json:24-29`; `.cursor/hooks.json:20-29`; `.devin/hooks.v1.json:22-28` | LEFT ALONE for the symlink and directory naming layer; edit actual path consumers |
| Cross-skill hardcoded paths | Any path-bearing string containing a packet segment, including runtime hooks and system-skill references | `.codex/hooks.json:27`; `.cursor/hooks.json:26`; `.claude/settings.json:111-114`; `.opencode/skills/system-deep-loop/SKILL.md:165` | EDITED with path-segment matching |
| Authoring templates | Parent-skill templates use placeholders such as `[hub-prefix]`, `[mode-a]`, and generic `workflowMode`; they are authoring inputs, not live registrations | `.opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-registry-template.json:24-45`; `.opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-hub-router-template.json:2-4` | LEFT ALONE |
| Advisor DB/cache/state | The cited embeddings fixture has no mapped-token match; no cache rewrite is authorized by the frozen map | `.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/fixtures/.embeddings-cache/skill-embeddings.json` (zero mapped-token matches at freeze) | LEFT ALONE |
| `.devin/skills` naming layer | Runtime directory names are not one of the frozen workflowMode/packet fields; content path references remain subject to the bounded-path rule | `.devin/skills/create-skill/SKILL.md:1-20` | LEFT ALONE for directory names; edit qualifying content paths |
| Drift guards, graph compilers, and routing tests | Tests that read live registry fields or typed fixture fields must follow the map; historical fixtures and snapshots are not broad-swept | `.opencode/commands/doctor/scripts/parent-skill-check.cjs:300-312`; `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/route-gold-gate.vitest.ts:238-261` | EDITED only at typed live assertions; LEFT ALONE for historical fixtures |

## 2. Exact rewrite rules and posture

The frozen map is the only mapping source. For each row, apply exact equality to the
declared field; do not infer a mapping from spelling or prefix similarity.

### 2.1 JSON fields

The approved JSON rewrite positions are:

* `mode-registry.json`: `modes[].workflowMode` uses `oldWorkflowMode → newWorkflowMode`;
  `modes[].packet`, `modes[].packetSkillName`, and
  `modes[].advisorRouting.packetSkillName` use `oldPacket → newPacket`.
  `command`, `aliases[]`, descriptions, and other free-text values are not swept.
* `hub-router.json`: replace exact old workflow-mode values in
  `routerPolicy.tieBreak[]`, `routerPolicy.bundleRules[].whenAll[]`, and object keys
  under `routerSignals`. In each `routerSignals` entry, replace only packet-directory
  segments in `resources[]`. Leave `vocabularyClasses` keywords and class labels alone.
* `leaf-aliases.json`: replace exact `[].workflowMode` values. Replace `diskPath` only
  when a mapped packet name is a slash-bounded path segment; the current `shared/...`
  paths do not become packet paths merely because the mode changes.
* `command-metadata.json`: replace exact `ownerMode` values, exact packet values in
  `choreography[].skill`, and slash-bounded packet segments in `choreography[].resource`.
  Do not change slash command names in `command` or `next[]`.
* `graph-metadata.json`: replace only mapped packet segments in `key_files[]` and
  `entities[].path`. Do not rename ordinary terms in `category`, `domains[]`,
  `key_topics[]`, `causal_summary`, or other narrative fields.
* Lane C JSON fixtures: replace exact mapped values only in typed `expected` fields
  (`workflowMode`, `packet`, `mode`, `intentKeys`, `forbiddenWorkflowModes`, and
  equivalent schema-declared fields). Do not touch an unmapped mode such as a retired
  or unrelated fixture label.
* Command router YAML/JSON assets: when a structured field is present, use the same
  exact-value rule for `workflowMode`, `packet`, `packetSkillName`, `ownerMode`,
  `skill`, and `resource`; slash-command strings such as `/create:skill` are not
  workflow-mode keys. Markdown command prose is handled by the no-sweep rule.
* Agent and test consumers: rewrite only explicit typed route fields and path literals
  in canonical agent definitions, runtime copies, drift guards, and live registry/test
  fixtures. Do not rewrite narrative agent instructions or historical expected output.

`leaf-manifest.json` is not hand-edited. Regenerate it after the identity commit with:

```text
node .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs --write .opencode/skills/<hub>
```

The generator contract is documented at
`.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:8-19` and its
freshness check compares the generated bytes rather than accepting hand edits
(`ci-leaf-manifest-freshness.cjs:8-29,74-91`). Run the command once for each hub.

### 2.2 Paths and Markdown/YAML

The only path rewrite is a slash-bounded segment replacement, conceptually:

```text
(^|/)oldPacket(?=/|$)  →  $1newPacket
```

It applies only in a field or file position already known to contain a path: packet
directory basenames, `resources[]`, `key_files[]`, `entities[].path`, command/agent
resource paths, hook paths, and `expected_resources` path values. It does not apply to
ordinary prose, filenames that merely contain a word, or a whole file's raw text.

For playbook route gold, parse the frontmatter `expected_intent:` key and replace only
whole labels equal to a mapped workflowMode. The loader accepts `+`, `→`, and `->` as
multi-intent separators (`load-playbook-scenarios.cjs:238-256`). `expected_intent:
quality` therefore becomes `expected_intent: sk-code-quality` only when `quality` is the
typed scalar under that key. Markdown outside that key is not rewritten.

No bare-string sweep is permitted anywhere. `quality`, `interface`, `review`, and
`create-skill` are ordinary English unless they occur in one of the approved JSON field
positions, as a slash-bounded path segment, or as a whole label in YAML
`expected_intent`. Never run a repository-wide replacement such as `s/quality/sk-code-quality/g`.

### 2.3 Posture by consumer class

* **EDITED:** registries, routers, packet directory/frontmatter identity, aliases,
  metadata path slots, playbook `expected_intent`, typed command metadata, typed agent
  fields, cross-skill path strings, and live typed tests/fixtures.
* **REGENERATED:** `leaf-manifest.json` with `generate-leaf-manifest.cjs`; new benchmark
  reports with the required `run-skill-benchmark.cjs` command in §5. Existing reports are
  historical records and are not rewritten in place.
* **LEFT ALONE:** prose and keyword vocabulary, historical benchmark records, template
  placeholders, advisor identity stores, the `.claude/skills` symlink, `.devin/skills`
  directory names, and assertions for unmapped retired modes.

The spec-kit commands `generate-description.js` and `backfill-graph-metadata.js` are
scoped to spec folders, not these `.opencode/skills/<hub>/description.json` and
`graph-metadata.json` files (`generate-description.ts:8-13`; `backfill-graph-metadata.ts:3-18`).
No skill-hub metadata generator was verified here, so the contract does not invent one:
edit only the verified path slots and preserve metadata prose.

## 3. Identity ordering: one commit per hub, then derived output, then consumers

Every hub follows this sequence. The first commit is intentionally atomic: no consumer
may observe a moved directory with an old registry or a new registry pointing at an old
directory.

1. Capture the pre-rename Markdown-link broken-link set and the hub's benchmark verdict
   and aggregate. Keep the frozen map unchanged.
2. In **one commit**, move every mapped packet directory, update each moved packet's
   `SKILL.md` frontmatter `name:`, and update that hub's `mode-registry.json` and
   `hub-router.json` typed identity fields together. For `sk-doc`, move `create-skill`
   once and update both `create-skill` and `create-skill-parent` registry rows together;
   the latter key remains distinct from its shared packet.
3. Regenerate the hub's `leaf-manifest.json` with the command in §2.1. Do not hand-edit
   generated manifest bytes.
4. Update the hub's remaining typed consumers in this order: `leaf-aliases.json`,
   command metadata, playbook `expected_intent`, command/agent path slots, graph
   `key_files[]`/`entities[].path`, and cross-skill hook paths. Leave historical and
   authoring surfaces alone.
5. Produce a new benchmark report without rewriting the pre-rename archive, then run
   both verification levers in §5. Stop on a new broken link, a verdict change, or an
   aggregate change.

## 4. Per-hub execution checklists

### 4.1 `sk-prompt` — 2 packets, 2 keys

1. `prompt-improve` → key `sk-prompt-improve`, packet `sk-prompt-improve`.
2. `prompt-models` → key `sk-prompt-models`, packet `sk-prompt-models`.
3. Apply the atomic identity commit to the registry, router, both directories, and
   both packet `SKILL.md` names.
4. Regenerate `sk-prompt/leaf-manifest.json`.
5. Update playbook `expected_intent`, command/agent path slots, and any typed benchmark
   fixture values. Do not change prompt prose or model names.
6. Verify the link-set delta and require `PASS 100` from the router-trace benchmark.

### 4.2 `sk-design` — 3 packets, 3 keys

1. `interface` + `design-interface` → `sk-design-interface`.
2. `md-generator` + `design-md-generator` → `sk-design-md-generator`.
3. `design-mcp-open-design` + `design-mcp-open-design` →
   **`sk-design-mcp-open-design`**. The existing `design-` prefix is not preserved as
   the complete identity; the map explicitly adds the `sk-design-` hub prefix.
4. Apply the atomic identity commit to the registry, router, all three directories, and
   all three packet `SKILL.md` names. Update `command-metadata.json.ownerMode`,
   `choreography[].skill`, and bounded resources after the identity commit.
5. Regenerate `sk-design/leaf-manifest.json`.
6. Update the three-mode playbook gold and typed Lane C JSON fields. Leave fixtures for
   unmapped retired modes such as `foundations`, `motion`, and `audit` unchanged.
7. Verify the link-set delta and require `BLOCKED-BY-ROUTE-GOLD 91` from the router-trace
   benchmark; a status change is a failure even if the numeric aggregate remains 91.

### 4.3 `sk-code` — 4 packets, 4 keys

1. `quality` + `code-quality` → `sk-code-quality`.
2. `code-review` + `code-review` → `sk-code-review`.
3. `code-webflow` + `code-webflow` → `sk-code-webflow`.
4. `code-opencode` + `code-opencode` → `sk-code-opencode`.
5. Apply the atomic identity commit to the registry, router, all four directories, and
   all four packet `SKILL.md` names.
6. Regenerate `sk-code/leaf-manifest.json`.
7. Update playbook `expected_intent`, typed Lane C JSON fields, agent path literals, and
   hook path literals such as `.opencode/skills/sk-code/code-quality/...`.
8. Do not rename the ordinary words `quality` or `review` in prose, vocabulary classes,
   or historical reports.
9. Verify the link-set delta and require `BLOCKED-BY-ROUTE-GOLD 91` from the router-trace
   benchmark.

### 4.4 `sk-doc` — 11 packets, 12 keys

1. Shared packet and two keys: `create-skill` + `create-skill` →
   `sk-create-skill`; `create-skill-parent` + `create-skill` → key
   `sk-create-skill-parent`, packet `sk-create-skill`.
2. `create-readme` → `sk-create-readme`.
3. `create-agent` → `sk-create-agent`.
4. `create-command` → `sk-create-command`.
5. `create-feature-catalog` → `sk-create-feature-catalog`.
6. `create-manual-testing-playbook` → `sk-create-manual-testing-playbook`.
7. `create-benchmark` → `sk-create-benchmark`.
8. `create-flowchart` → `sk-create-flowchart`.
9. `create-changelog` → `sk-create-changelog`.
10. `create-diff` → `sk-create-diff`.
11. `create-quality-control` → `sk-create-quality-control`.
12. Apply the atomic identity commit to the registry, router, the 11 packet directories,
    and their `SKILL.md` names. Update both shared-packet rows in the same registry edit.
13. Regenerate `sk-doc/leaf-manifest.json` after the shared packet is moved.
14. Update `leaf-aliases.json`, playbook `expected_intent`, typed command/agent paths,
    graph path slots, and typed benchmark fixtures. Preserve authoring templates and
    all ordinary uses of `create-skill` in prose.
15. Record, but do not repair, the existing `/doc:quality` drift: the registry declares
    `/doc:quality` at `.opencode/skills/sk-doc/mode-registry.json:151-160`, while no
    corresponding command file exists under `.opencode/commands/`. Do not create it as
    part of this rename.
16. Verify the link-set delta and require `PASS 98` from the router-trace benchmark.

## 5. Verification levers and frozen gates

Run these gates after each hub, against the pre-rename baseline captured in step 1 of
§3.

### A. Markdown-link set delta

Run:

```text
node .opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs
```

Compare the complete broken-link set with the pre-rename baseline. The set difference
must be empty. The checker intentionally walks the whole active skills/commands/agents
surface because unchanged referrers can break when a target moves
(`check-markdown-links.cjs:7-20,168-192`).

### B. Router-trace benchmark parity

Run once per hub:

```text
node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs --skill <hub> --trace-mode router
```

The post-rename run must reproduce the pre-rename verdict and aggregate exactly:

| Hub | Required verdict | Required aggregate |
| --- | --- | ---: |
| `sk-prompt` | `PASS` | `100` |
| `sk-design` | `BLOCKED-BY-ROUTE-GOLD` | `91` |
| `sk-code` | `BLOCKED-BY-ROUTE-GOLD` | `91` |
| `sk-doc` | `PASS` | `98` |

`--trace-mode router` is a supported runner mode (`run-skill-benchmark.cjs:430-436,734`).
For parent hubs, route-gold is enforced by the presence of `hub-router.json`
(`run-skill-benchmark.cjs:207-231`), so a changed block reason is not equivalent to a
matching score.

## 6. Known drift held constant

The `sk-doc` registry declares `/doc:quality`, but the command file is absent. This is
pre-existing drift, not a rename defect. Record it in the execution evidence and do
not create or silently repair `/doc:quality` during this phase.

## 7. Not carried forward

The following research statements are omitted from the contract because the cited
evidence did not verify them as stated:

* The assertion that `.claude/skills`, `.devin/skills`, `.cursor/skills`, and
  `.codex/skills` are all independent real directory mirrors is false for this
  checkout: `.claude/skills` is a symlink to `.opencode/skills`, and the other named
  `skills` roots are not present as independent hub trees. The contract records the
  observed topology instead.
* The claim that the four hub-level `description.json` and `graph-metadata.json` files
  are regenerated by the spec-kit `generate-description` and `backfill-graph-metadata`
  commands is not carried forward. Those commands document spec-folder inputs, so this
  contract edits only verified hub metadata path slots and does not invent a generator.
* The exhaustive claim that no database, cache, or prompt-label store can contain a
  mode key is not carried forward. The cited embeddings fixture had no mapped-token
  match, but the lineage itself flagged the full label scan as incomplete.
* No claim that parent-skill template placeholders are live rename targets is carried
  forward; the template evidence shows placeholders and generic schema fields.

---

## 8. Amendments from execution (sk-prompt, first hub)

The first hub's gate falsified three contract claims; later hubs inherit the corrections.

1. **Playbook gold is wider than `expected_intent:`.** The scenario loader also reads
   `expected_resources` (packet-prefixed paths), `expected_leaf_resources` (`- workflow_mode:` /
   `leaf_resource_id:` typed pairs — note the list-item dash), `expected_workflow_mode:`, and
   `workflow_mode:`. A stale typed pair excludes every scenario as `fixture_topology_error`, which
   reads as NO-SCENARIOS. All of these are typed positions and move with the hub.
2. **`shared/references/smart-routing.md` is a path surface, not prose.** Its resource arrays carry
   slash-bounded packet paths that the router replay emits verbatim; leaving them produces
   `intentOk=true, resourceOk=false` across the board. One lineage classified this file as bare-word
   prose; that classification was wrong.
3. **Cross-hub inbound path links move in the hub's own commit.** The link gate does not wait for the
   consumer phase; deferring path-shaped inbound references breaks CI at the commit boundary.
   Phase 007 keeps only non-link consumers: hooks, agents, metadata, mirrors, gold regeneration.
