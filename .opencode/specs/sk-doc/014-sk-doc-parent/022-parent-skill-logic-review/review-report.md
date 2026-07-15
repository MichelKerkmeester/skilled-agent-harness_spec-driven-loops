# Parent-Skill (Parent-Hub) Pattern — Deep Review Report

> **Scope:** the canonical parent-hub doctrine (`sk-doc/create-skill`), its four live implementations (`sk-doc`, `sk-code`, `sk-design`, `deep-loop-workflows`), the enforcement layer (`parent-skill-check.cjs`, `parent-hub-vocab-sync.cjs`, drift guards), and the skill-advisor integration (`system-skill-advisor/mcp_server`).
> **Method:** every load-bearing claim below was verified against the file at the cited `file:line`; the read-only `parent-skill-check.cjs` audit was executed live against all four hubs (2026-07-07). Claims that would need a runtime scorer invocation to fully prove are marked **SUSPECTED**; everything else is **CONFIRMED**.
> **Reviewer:** Fable-5, single exhaustive deep-review round.

---

## Executive Verdict

The parent-hub pattern is in strong shape at its core — the one-identity invariant holds physically in all four hubs (exactly one `graph-metadata.json` each, zero nested copies), all 24 packets carry their required companion files, registry↔router bidirectionality and alias uniqueness hold everywhere, and the deep-loop advisor projection is the model citizen: generated, hash-guarded, and verified live against the running advisor map. But the pattern is fraying at exactly the edges where it is evolving fastest: **sk-design's new `transport` axis fails the canon checker today** (2 hard FAILs under default strict mode) because neither the doctrine's `workflow|surface` enum nor the checker was extended when the axis shipped; the doctrine's unconditional `surfaceBundle` requirement is contradicted by three of four hubs, by the checker, and by sk-doc's own NEVER rules; the advisor quietly carries **unguarded command-bridge identities** (`create:*`, `deep-model-benchmark`) that the hub registries either misclassify or explicitly disclaim, with the two scorer transports (TS daemon vs Python fallback) disagreeing on what "benchmark a model" routes to; and the TS skill-graph scanner would silently ingest a nested packet `graph-metadata.json` as a second advisor identity — the exact failure the invariant exists to prevent — because ingestion-time enforcement was never built (only the manually-run doctor script guards it). None of this is currently breaking users, but the doctrine, the enforcement, and the implementations have drifted into three different definitions of "canonical," and the next hub built from the templates will inherit the contradictions.

---

## Findings Table

| ID | Sev | Area | Summary |
|----|-----|------|---------|
| PS-01 | **P0** | sk-design / doctrine / checker | The `transport` packet axis is un-canonized: sk-design fails `parent-skill-check` today (invalid `packetKind "transport"` + unregistered `feature_catalog/`) |
| PS-02 | **P1** | doctrine vs 3 hubs | Doctrine demands the `surfaceBundle` outcome unconditionally; sk-doc/sk-design/deep-loop omit it, sk-doc forbids it, and the checker only requires it when surfaces exist |
| PS-03 | **P1** | advisor discovery | One-identity invariant is unenforced at ingestion: TS scanner recursively ingests any skill-shaped nested `graph-metadata.json`; Python compiler is depth-1 blind — the two pipelines would diverge |
| PS-04 | **P1** | sk-code registry | `code-review` toolSurface is self-contradictory: `Write` allowed while `mutatesWorkspace: false` |
| PS-05 | **P1** | sk-code hub | Hub `allowed-tools` includes `Task` although all four modes explicitly forbid Task — violates the union rule the hub template states |
| PS-06 | **P1** | advisor / deep-loop | `deep-model-benchmark` is registry-classified `command-bridge` ("not an advisor map entry") yet the TS scorer lexically scores 7 NL phrases for it (with negative boosts on `deep-loop-workflows`), outside any drift guard, keyed on a dead legacy command id; the Python scorer has none of this |
| PS-07 | **P1** | advisor / sk-doc | sk-doc's `create:*` command bridges are undeclared and unguarded: full advisor identities exist for 2 of 11 modes while the registry claims all modes are `metadata` ("never advisor-scored"); py covers 6 commands, TS covers 2, sk-doc has 11 |
| PS-08 | **P1** | sk-design registry | `advisorRoutingContract` prose contradicts the registry's own data (folder-mismatch story is false; "command … never null here" while mode 6 has `command: null`; "five modes" vs "six modes") |
| PS-09 | P2 | sk-doc / sk-design | Stale scaffold-era lifecycle prose shipped in live metadata ("SCAFFOLD STATE … deferred to cutover"; "packet folders are created when the flat skills move") |
| PS-10 | P2 | sk-design | Intra-hub version incoherence (registry 1.4.0.0 / router 1.3.0.0 / SKILL+description 1.2.0.0) and the hub SKILL.md discriminator omits the transport mode entirely |
| PS-11 | P2 | doctrine | Doctrine's bare-noun surface-folder naming rule contradicts the canonical live example it cites (`code-webflow`, `code-opencode`) |
| PS-12 | P2 | doctrine | "Three Hubs Extension Matrix" and router-schema worked examples are stale: sk-doc missing, deep-loop deprecated-modes claim false, live sk-code weights/classes differ from the "reflects sk-code" example |
| PS-13 | P2 | doctrine templates | Every live extension's field shape diverges from the registry template's promised shape; `transport-axis` and `advisorRoutingContract.driftGuard` are template-absent though checker-recognized |
| PS-14 | P2 | checker | Enforcement gaps vs doctrine: folder==packetSkillName never verified, alias uniqueness / tie-break order / defaultMode / packet files / base outcomes / unreferenced classes unchecked; stale `'context'` in `VALID_RUNTIME_LOOP_TYPES` |
| PS-15 | P2 | sk-design / deep-loop | Undeclared per-mode and identity fields with no extension declaring them (`proceduresPath`, `loopHostMode`, one-off `mutating`, spec-folder `packet_id` inside skill graph-metadata) |
| PS-16 | P2 | cross-hub | Metadata dialect drift: two description.json dialects (one duplicating `modes[]` — a second source of truth), inconsistent `deprecated`/`importance_tier`/frontmatter `metadata.family`, sk-design's `family: "sk-code"` taxonomy shoehorn, and sk-design's `command-metadata.json` third vocabulary surface |
| PS-17 | P2 | cross-hub vocab | Vocabulary-strategy fork: sk-doc leaves 34 registry aliases without a literal router-vocab home (others mirror verbatim); N-modes→1-packet multiplexing (sk-doc, deep-loop) is live but doctrine-undocumented; sk-design ships non-lowercase aliases |
| PS-18 | P2 | sk-code | "Surfaces carry stack knowledge, never process" (registry) vs "each surface owns the implement→debug→verify workflow doctrine" (SKILL.md) — one hub, two contradictory formulas for the same mechanism |

---

## Detailed Findings

### PS-01 — **P0** — The `transport` axis is un-canonized; sk-design fails the canon check today

**Evidence (CONFIRMED, checker executed live 2026-07-07):**

```
FAIL: 3d: mode "design-mcp-open-design" has invalid packetKind "transport" (expected "workflow" or "surface")
FAIL: 6a: child director(ies) neither registered as a packet nor allowlisted: [feature_catalog]
FAIL: parent-skill-check — 2 invariant failures, 0 warnings
```

- sk-design declares `packetKind: "transport"` on `design-mcp-open-design` — `sk-design/mode-registry.json:146` — plus a well-formed `transport-axis` extension at `mode-registry.json:21-24` ("entries bridge to an external tool's CLI/MCP surface … never perform design judgment themselves").
- The doctrine's packetKind enum is closed at two values: `parent_skills_nested_packets.md:53` ("every mode entry declares `packetKind: "workflow" | "surface"`"), mirrored by the hub template (`parent_skill_hub_template.md:58-61`), the registry template (all examples), and the checker header (`parent-skill-check.cjs:14`) and enforcement (`parent-skill-check.cjs:338`, softFail → hard FAIL under the default `PARENT_HUB_CHECK_STRICT` mode, line 96).
- The doctrine's extension table (`parent_skills_nested_packets.md:119-131`) lists five extensions; `transport-axis` is not one of them. The checker validates `surface-axis`/`runtime-loop`/`advisor-projection` shapes (`parent-skill-check.cjs:421-450`) and silently ignores `transport-axis` and `transform-verbs` — so the new axis is neither validated nor rejected as unknown, just failed at the packetKind gate.
- `feature_catalog/` at the sk-design hub root is not in `DIRECTORY_ALLOWLIST` (`parent-skill-check.cjs:68-71`) and is not a registered packet. The established convention elsewhere is packet-level feature catalogs (`deep-loop-workflows/SKILL.md:82` lists `feature_catalog/` as a *packet* companion).

**Why it matters:** This is the only hard canon failure in the system, and it is on the newest, most deliberate piece of hub evolution. The transport packet is *principled* (its extension text explains exactly why it is neither workflow nor surface: it bridges to an external mutating tool, never judges, and carries a mandatory-pairing contract), but it shipped without extending the contract that governs it. Every consumer that trusts "canon-clean" status (packet 124's promoted checks 5–9, benchmark gates, future hub scaffolds) now disagrees with reality.

**Recommendation (choose one, explicitly):**
1. **Canonize `transport` (recommended)** — add `transport` to the packetKind enum in `parent_skills_nested_packets.md:53`, the hub template two-axis table, the registry template (a sixth mode example), and `parent-skill-check.cjs:338`; add a `transport-axis` row to the doctrine extension table and a 3g-style check (transport must be `mutatesWorkspace:false`, `routingClass:"metadata"`, must declare a pairing contract); decide tie-break placement (sk-design correctly sorts it last, after workflows — codify that). Add `feature_catalog` to `DIRECTORY_ALLOWLIST` *or* (better, for consistency with deep-loop) move sk-design's catalog under a packet or `shared/`.
2. Remodel `design-mcp-open-design` as `packetKind: "surface"` — cheaper, but it is a worse model: the packet's `toolSurface.forbidden` (`mode-registry.json:150`) omits `Task` (surfaces must forbid it, `parent-skill-check.cjs:65,397-401`) and, more fundamentally, a transport that drives an external mutating CLI is not "read-only domain evidence." Option 1 preserves the semantics the hub already documents.

---

### PS-02 — **P1** — The doctrine's unconditional `surfaceBundle` requirement is fiction; three hubs omit it, one forbids it, and the checker agrees with the hubs

**Evidence (CONFIRMED):**
- Doctrine, three separate places, all unconditional: `parent_hub_router_schema.md:88` ("outcomes | Must include `single`, `orderedBundle`, `defer`, and `surfaceBundle`"), `:307` (conformance: "routerPolicy.outcomes includes surfaceBundle alongside…"), `create-skill/SKILL.md:245` (step 19), and the hub template checklist `parent_skill_hub_template.md:277`.
- Live routers: only sk-code declares it (`sk-code/hub-router.json:11`). sk-doc (`sk-doc/hub-router.json:8-12`), sk-design (`sk-design/hub-router.json:8-12`), and deep-loop (`deep-loop-workflows/hub-router.json:8-12`) all ship exactly `single`/`orderedBundle`/`defer`.
- sk-doc goes further and **forbids** it: `sk-doc/SKILL.md:96` ("there is no `surfaceBundle` (no surface axis)") and `:141` ("**NEVER** add a surface axis or a `surfaceBundle` outcome — sk-doc is workflow-only").
- The checker enforces it **conditionally**: `parent-skill-check.cjs:612-615` requires `outcomes.surfaceBundle` only when `surfaceCount > 0`. All three surface-less hubs pass check 5 clean (verified live).

**Why it matters:** Doctrine, enforcement, and majority practice each define a different contract. A new hub author following the reference/template will add a dead `surfaceBundle` outcome to a workflow-only hub (and then trip over sk-doc's NEVER rule if they copy from the live exemplar instead). Where the published contract and the enforcement point disagree, the "canon" is whichever file you happened to read.

**Recommendation:** Fix the doctrine, not the hubs — the checker's conditional rule is the sane one and 3/4 hubs already embody it. Amend `parent_hub_router_schema.md:88` and `:307`, `create-skill/SKILL.md:245`, and the hub-template checklist to: *"`single`, `orderedBundle`, `defer` always; `surfaceBundle` required iff the registry declares any `packetKind: "surface"` mode (and, once PS-01 lands, define the analogous rule for transports)."* Also make the checker assert the three base outcomes are present — today it checks none of them (see PS-14).

---

### PS-03 — **P1** — One-identity invariant is not enforced where identities are minted: the two discovery pipelines disagree and the TS one would ingest a nested packet identity

**Evidence (CONFIRMED by code reading; the violating-fixture scan itself was not executed — SUSPECTED at runtime only in that narrow sense):**
- Python compiler discovery is depth-1 by construction: `skill_graph_compiler.py:177-178` iterates `os.listdir(skills_dir)` and probes only `skills_dir/<entry>/graph-metadata.json`. A packet-level `graph-metadata.json` is structurally invisible to it — silently "safe," but also never *flagged*.
- TS discovery is fully recursive with no depth limit and no `node_modules` exclusion: `skill-graph-db.ts:610-635` (stack walk pushes every directory; `deep-loop-workflows/node_modules` exists and gets walked).
- The TS validator would *accept* a nested identity: `parseSkillMetadata` enforces `skill_id === basename(dirname(sourcePath))` (`skill-graph-db.ts:665-668`) — a stray `sk-code/code-review/graph-metadata.json` with `skill_id: "code-review"` **passes** that check and is indexed as a new skill node. `indexSkillMetadata` throws only on *duplicate* ids (`skill-graph-db.ts:884`).
- The non-skill filter is the only mitigation and it is lenient: `isSkillGraphMetadata` (`skill-graph-db.ts:655`) accepts anything with a `skill_id` string, `family` string, or `edges` object. It correctly skips the spec-folder-shaped fixtures inside the skills tree (verified: `system-spec-kit/scripts/test-fixtures/002-valid-level1/graph-metadata.json` has `packet_id`/`spec_folder`/no `skill_id` → `NON-SKILL-METADATA` skip path, `skill-graph-db.ts:863-867`), but a deliberately or accidentally skill-shaped packet file sails through.
- The only guard that actually detects a nested identity is the doctor script (`parent-skill-check.cjs:210-255`, checks 1a/2a) — manually run, not part of scan/index.

**Why it matters:** The invariant every hub SKILL.md swears by ("exactly one graph-metadata.json … so the advisor discovers exactly one identity" — e.g. `sk-code/SKILL.md:145`, `sk-design/SKILL.md:244`, `deep-loop-workflows/SKILL.md:124`) has no ingestion-time teeth. Worse, a violation produces *divergent* graph artifacts: the TS sqlite graph gains the phantom identity, the Python-compiled `skill-graph.json` does not, and the two advisor surfaces silently disagree.

**Recommendation:** Teach `discoverGraphMetadataFiles` the hub boundary: when a directory contains `graph-metadata.json`, do not descend into its children looking for more (or: hard-error on a second skill-shaped file beneath an already-identified skill root, naming the parent-hub invariant). Independently: skip `node_modules` in the walk. Optionally have the Python compiler emit a warning when a nested skill-shaped file exists (it currently cannot see one, which is enforcement by accident, not by design).

---

### PS-04 — **P1** — sk-code `code-review` toolSurface: `Write` allowed while `mutatesWorkspace: false`

**Evidence (CONFIRMED):** `sk-code/mode-registry.json:46-48`:

```json
"allowed": ["Read", "Bash", "Grep", "Glob", "Write"],
"forbidden": ["Edit", "Task"],
"mutatesWorkspace": false,
```

The hub explains the backend as "the code-review mode's **non-mutating** review output cache" (`sk-code/SKILL.md:148`), yet the mode's own contract grants the one tool whose entire purpose is creating files. Any consumer that trusts `mutatesWorkspace` as the mutation gate (the field the doctrine designates for exactly that: `parent_skills_nested_packets.md:65`, surface rules `:76`) will mis-classify this mode; any consumer that enforces `allowed` will let a "non-mutating" mode write.

**Why it matters:** `toolSurface` is the machine-readable safety contract of the pattern. This is the only mode in all four hubs whose two mutation signals point in opposite directions (verified by sweep: every other mode's `Write`/`Edit` grants align with `mutatesWorkspace`).

**Recommendation:** Owner decision, then encode it: if review reports/caches land inside the repo (spec folders), flip to `mutatesWorkspace: true` (and say the mutation scope is report artifacts only); if the cache is genuinely outside the workspace, keep `false` but add a registry note field explaining the `Write` grant (the transport packet shows the precedent: `sk-design/mode-registry.json:22` documents exactly this kind of "writes land elsewhere" reasoning). A checker rule "`Write`∈allowed ⇒ `mutatesWorkspace:true` unless annotated" would keep it honest (PS-14).

---

### PS-05 — **P1** — sk-code hub `allowed-tools` is not the union of its modes' tool surfaces

**Evidence (CONFIRMED):** `sk-code/SKILL.md:4` — `allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task]`. But **every** sk-code mode forbids `Task`: quality `mode-registry.json:28`, code-review `:47`, code-webflow `:66`, code-opencode `:85`. The union of mode-allowed tools is `{Read, Write, Edit, Bash, Grep, Glob}` — no mode contributes `Task`.

The hub template's rule: "`allowed-tools` is the union required by workflow modes; read-only surfaces do not justify mutating tools" (`parent_skill_hub_template.md:109`). The other three hubs honor it exactly: sk-doc `SKILL.md:4` (no Task; all modes forbid Task), sk-design `SKILL.md:4` (union of its six modes), deep-loop `SKILL.md:5` (Task+WebFetch — exactly what its modes allow, `deep-loop-workflows/mode-registry.json:37,61,85,…`).

**Why it matters:** The hub frontmatter is what the runtime actually grants when the skill loads. sk-code's grant is strictly wider than anything its registry authorizes — the one place in the whole pattern where the declarative tool contract is silently escalated.

**Recommendation:** Drop `Task` from `sk-code/SKILL.md:4` (or, if hub-level orchestration genuinely needs Task, declare which mode owns it in the registry). Add the union check to the checker (PS-14).

---

### PS-06 — **P1** — `deep-model-benchmark`: a command-bridge mode with an unguarded, transport-divergent advisor side-channel keyed on a dead command id

**Evidence (CONFIRMED at code level; the divergent-recommendation outcome is SUSPECTED pending a runtime A/B of the two scorers):**
- Registry contract: model-benchmark is `routingClass: "command-bridge"` (`deep-loop-workflows/mode-registry.json:148`), defined as "routed by its /deep:* command, **not an advisor map entry**" (`mode-registry.json:11`; same definition in doctrine `parent_skills_nested_packets.md:104`).
- TS scorer reality: `lanes/explicit.ts:138-143` lexically scores plain-NL phrases — `'benchmark a model': [['deep-model-benchmark', 1.6], ['deep-loop-workflows', -0.6]]`, `'benchmark a prompt framework'`, `'optimize a model'`, `'model benchmark loop'`, etc. — i.e., a weighted advisor entry in substance, which even **suppresses the hub identity** the registry says should carry the route.
- The alias group lives in hand-maintained `BASE_ALIAS_GROUPS` (`aliases.ts:13-18`), *outside* the generated block the drift guard hashes (`aliases.ts:21-63`; guard scope `routing-registry-drift-guard.vitest.ts:88-106` iterates `DEEP_MODE_BY_CANONICAL` only). No test ties any of it to the registry.
- The TS inline command projection describes and keys on the **legacy** command: `projection.ts:140-141` — "Deep command bridge for `/deep:start-model-benchmark-loop`", keywords `['/deep:start-model-benchmark-loop', 'benchmark a model', …]`. The live command is `/deep:model-benchmark` (`.opencode/commands/deep/model-benchmark.md`); the live id appears nowhere in the record. Same staleness in `command-spec-kit`'s keywords (`projection.ts:66`: `/deep:start-research-loop`, `/deep:start-review-loop`).
- Python scorer reality: **zero** handling — no `deep-model-benchmark` id, no "benchmark a model" phrase, no model-benchmark slash marker anywhere in `skill_advisor.py` (verified by exhaustive grep; the py command-record table at `skill_advisor.py:2020-2081` has deep-research/review/agent-improvement bridges but nothing for model-benchmark).

**Why it matters:** Three-way contradiction: the registry says "no advisor entry," the TS scorer maintains a rich one, the Python fallback has none. Gate-2 routing therefore depends on which transport answers (daemon vs `skill_advisor.py` fallback — both are blessed paths per the project CLAUDE.md). And because the entry is guard-free and keyed on a renamed command, it is exactly the class of silently-rotting projection the deep-loop `advisor-projection` extension was invented to prevent.

**Recommendation:** Decide the contract first: (a) if "benchmark a model" *should* advisor-route to the command bridge, upgrade model-benchmark's `routingClass` (or add an explicit `command-bridge-with-advisor-alias` note), move the alias group + explicit-lane phrases under a generated/guarded block, refresh the record to `/deep:model-benchmark` (keep the legacy id as a compat alias, not the description), and mirror minimal parity into the py scorer; (b) if the registry is right, delete the TS explicit-lane phrases and the inline projection, keeping only literal slash-marker matching for the live command. Either way, add a guard: no `BASE_ALIAS_GROUPS`/`INLINE_COMMAND_PROJECTIONS` entry may reference a command id that has no file under `.opencode/commands/`.

---

### PS-07 — **P1** — sk-doc's `create:*` advisor command bridges: undeclared by the registry, asymmetric across transports, guarded by nothing

**Evidence (CONFIRMED):**
- sk-doc's registry declares **all eleven** modes `routingClass: "metadata"` and justifies it explicitly: "No lexical/alias-fold modes (avoids the advisor-projection extension + CI drift-guard)" (`sk-doc/mode-registry.json:11`).
- The advisor nonetheless maintains full recommendable identities for two of them: graphless inline pseudo-skills `create:agent` / `create:manual-testing-playbook` (`skill_advisor.py:244-248` `GRAPHLESS_INLINE_SKILL_IDS`; TS `projection.ts:105-133` inline command projections), NL phrase scoring in both scorers (`skill_advisor.py:1797-1802` — "create agent" → `create:agent` 1.6 with sk-doc co-boost 0.45; `lanes/explicit.ts:206-211` same shape), and alias groups on both surfaces (`aliases.ts:6-11`, `skill_advisor.py:251-256`) with legacy `command-create-*` compat mappings (`skill_advisor.py:2087-2088`).
- Coverage is three different sets on three surfaces: TS bridges 2 commands; py slash-marker bridges 6 (`command-create-agent/-changelog/-skill/-feature-catalog/-manual-testing-playbook/-readme`, `skill_advisor.py:2055-2081`), of which **four carry neither `owning_skill` nor a `COMMAND_BRIDGE_OWNER_NORMALIZATION` entry** (`skill_advisor.py:2083-2090` normalizes only agent + manual-testing-playbook among the create set) — where a bare `/create:skill` invocation's recommendation lands is undefined by inspection (**SUSPECTED** dangling-id behavior, needs a runtime probe); and sk-doc actually has 11 command-bearing modes (`/create:skill-parent`, `/create:command`, `/create:flowchart`, `/create:benchmark`, `/doc:quality` have no bridge on either surface).
- No drift guard covers any of it: the only registry↔advisor guard in the repo is deep-loop's (`routing-registry-drift-guard.vitest.ts:26` hardcodes the deep-loop registry). The recent `/create:*` id rename is consistently applied in the files above (old `command-create-*` ids retained as aliases — correctly wired), but only convention keeps it that way; a future rename fails nothing.

**Why it matters:** The pattern's central promise — "the hub is the single advisor identity; the registry is the single source of routing truth" — is quietly false for sk-doc: two of its modes have advisor-scored identities the registry disclaims, and the registry's stated *reason* for choosing all-metadata routing ("avoids the drift-guard") is defeated by the existence of exactly the unguarded projections the guard exists for. The task-flagged rename risk is real: the wiring is currently correct but *only* accidentally durable.

**Recommendation:** Make the side-channel a declared contract: add an honest marker on the two modes (e.g. `advisorRouting.commandBridge: true` or reclassify to `command-bridge` with a note that the bridge *is* advisor-visible), declare a sk-doc `advisor-projection`-style extension with a `driftGuard` path, and write the small guard: for every sk-doc mode with a bridge, assert the advisor's inline id, phrases, and alias group agree with `mode-registry.json`'s `command` field, and that every bridged command file exists. Separately reconcile the py 6-command bridge set (give the four orphan bridges an owner — plausibly `sk-doc` itself — or delete them) and document why the other five commands are deliberately unbridged.

---

### PS-08 — **P1** — sk-design's `advisorRoutingContract` misdescribes its own registry

**Evidence (CONFIRMED, all within `sk-design/mode-registry.json`):**
- Line 12: "The original flat skill name is preserved as packetSkillName; **the packet folder is the short mode key, so folder != packetSkillName is grandfathered here** and recorded per mode via grandfatheredFolderMismatch." — False on all counts: every packet folder is the *prefixed* name (`packet: "design-interface"`, line 49, etc.), `folder == packetSkillName` for all six modes, and every `grandfatheredFolderMismatch` is `false`.
- Line 13 then contradicts line 12 within the same block ("…so none has a folder mismatch — grandfatheredFolderMismatch is false for all five (there is no mismatch to grandfather)") and gives `'interface'` as the example of **both** sides of the comparison.
- Line 14: "All five sk-design modes have a dedicated command …, so **this field is never null here**." — The sixth mode in this same file has `command: null` (line 157). Lines 11-14 say "five modes"/"all five" while the top-level description (line 4) says "All six modes route by hub membership."

**Why it matters:** `advisorRoutingContract` is the block the doctrine designates as the human-readable routing contract (`parent_skills_nested_packets.md:94`; registry template `:11-19`). sk-design's is a fossil of a pre-rename plan (short-key folders) that never shipped, updated piecemeal when the transport was added. Anyone (human or model) reading the contract to understand the hub's routing gets three false statements before reaching the data.

**Recommendation:** Rewrite the three prose fields to describe the shipped state: prefixed folders, `folder == packetSkillName` everywhere, six modes, and "command is null only for the transport packet (reached by pairing, not by a dedicated command)." One-file fix.

---

### PS-09 — P2 — Scaffold-era lifecycle prose shipped in live metadata

**Evidence (CONFIRMED):**
- `sk-doc/mode-registry.json:4` ends: "SCAFFOLD STATE: registry authored; packet bodies + shared/ populated in later phases; hub SKILL.md/graph-metadata/description swap deferred to cutover." The cutover happened: the hub SKILL.md is live at v2.0.0.0 (`sk-doc/SKILL.md:5`), all ten packets are populated (verified sweep: every packet has SKILL.md+README.md+changelog/), description.json is v2.0.0.0.
- `sk-design/SKILL.md:195`: "The mode packet folders **are created when** the flat skills move under the hub; the hub references those packet paths now." The move is long done (all six `design-*` packets exist and validate).

**Why it matters:** The registry `description` is advisor-adjacent, high-visibility text; declaring a live hub "scaffold state" invites an agent to treat the registry as provisional (or to "finish" a migration that already finished).

**Recommendation:** Delete the SCAFFOLD STATE sentence from sk-doc's registry description; rewrite sk-design's line 195 to present tense ("Each packet is self-contained … with no per-packet graph-metadata.json").

---

### PS-10 — P2 — sk-design version incoherence and a transport-blind hub discriminator

**Evidence (CONFIRMED):** Registry `1.4.0.0` (`mode-registry.json:3`) vs router `1.3.0.0` (`hub-router.json:3`) vs SKILL.md `1.2.0.0` (`SKILL.md:5`) vs description `1.2.0.0`. Every other hub keeps its trio in lockstep (sk-doc 2.0.0.0×3, sk-code 4.1.0.0×3, deep-loop 1.1.0.0×3 — verified). And the hub SKILL.md's own "The discriminator" section lists only five workflowModes and two backendKinds (`sk-design/SKILL.md:55-56`) — no `design-mcp-open-design`, no `od-cli-transport`, no `packetKind` line at all — even though the same file's layout (`:192`), references (`:232`), and integration points (`:258`) all know the transport. The transport is also absent from the §1 mode table (`:23-29`).

**Why it matters:** The discriminator section is the routing classifier's vocabulary in the hub contract; a mode that exists in the registry+router but not in the hub's own routing prose is routable only by the JSON, not by the documented behavior. The version fan-out means nobody can tell which artifacts a given "sk-design version" statement covers.

**Recommendation:** One alignment pass: bump router/SKILL/description to 1.4.0.0 (or adopt an explicit per-file versioning policy in the doctrine — today the doctrine is silent, which is why only sk-design drifted); add the transport row to §1 and the `packetKind`/transport lines to §2 of the hub SKILL.md.

---

### PS-11 — P2 — Doctrine's bare-noun surface naming contradicts its own canonical example

**Evidence (CONFIRMED):** `parent_skills_nested_packets.md:190`: "Surface packet folders are bare nouns such as `webflow`, `opencode`, or `animation`." Hub template `parent_skill_hub_template.md:61`: surface naming = "Bare noun such as `[surface]`". Registry template surface example `parent_skill_registry_template.json:123`: "bare-noun read-only evidence base." Meanwhile the *canonical live example* the same docs point at (`registry template:2`, `hub template:16,44`) ships `code-webflow` and `code-opencode` (`sk-code/mode-registry.json:70,89`), the router-schema doc uses those prefixed names throughout (`parent_hub_router_schema.md:27,151-157,236-249`) and even instructs "Retire ad-hoc names like `surface-webflow` into owned classes such as `code-webflow-aliases`" (`:223`). The `animation` example is doubly stale: that surface was deleted and folded into code-webflow (`sk-code/SKILL.md:15`; `parent_hub_router_schema.md:236` knows this).

**Why it matters:** A scaffolder following `parent_skills_nested_packets.md` and one following `parent_hub_router_schema.md` will name the same surface differently; the mission-statement invariant (`folder == packetSkillName == [hub-prefix]-<mode>`) matches the *live* practice, not the reference's bare-noun rule.

**Recommendation:** Pick the live convention (hub-prefixed surface folders) and rewrite `nested_packets.md:190`, `hub_template.md:61`, and the registry-template surface example accordingly; drop `animation` from the example lists.

---

### PS-12 — P2 — The doctrine's hub matrix and worked examples have drifted from the hubs they claim to describe

**Evidence (CONFIRMED):**
- "Three Hubs Extension Matrix" (`parent_skills_nested_packets.md:135-143`) covers sk-code/sk-design/deep-loop and omits **sk-doc** — a live ten-packet hub scaffolded *by this very doctrine* and cited nowhere in it.
- The deep-loop row (`:141`) claims "Declares deprecated standalone context routing as replacement guidance" — live deep-loop declares **nothing** deprecated: top-level `deprecatedModes: []` (`deep-loop-workflows/mode-registry.json:28`), no `deprecated-modes` extension; the context retirement survives only as a comment in the advisor (`aliases.ts:105-108`).
- The sk-design row (`:140`) says "Workflow-only design modes … no surface packets are required" — true when written, but silent on the transport packet that now exists (see PS-01).
- The router-schema §4 example is introduced as "the `sk-code` … entry" but shows `code-webflow` weight 3 without `hub-identity` (`parent_hub_router_schema.md:151-156`) while live sk-code has weight 4 with `hub-identity` (`sk-code/hub-router.json:27-31`).

**Why it matters:** These are the reference documents the SKILL routes authors to for "current hub behavior"; each stale cell is a future mis-scaffold.

**Recommendation:** Refresh the matrix to four hubs (add sk-doc: workflow-only, zero extensions, N-modes→1-packet multiplexing; update sk-design: + transport-axis; fix the deep-loop deprecated-modes cell) and re-sync the router-schema worked examples against the live files, or explicitly mark them "illustrative shape, not a live snapshot."

---

### PS-13 — P2 — The extensions template promises field shapes that no live extension uses

**Evidence (CONFIRMED):**

| Extension | Template shape (`parent_skill_registry_template.json`) | Live shape |
|---|---|---|
| `runtime-loop` | `{ "backend": "[runtime-backend-name]" }` (`:145-148`) | `{ description, runtimeLoopTypes: ["research","review","council"] }` — no `backend` (`deep-loop-workflows/mode-registry.json:19-22`) |
| `transform-verbs` | `{ "verbs": [...] }` (`:153-156`) | `{ description, declaredField: "transformVerbRouting" }` + top-level `transformVerbRouting` block (`sk-design/mode-registry.json:17-19, 26-37`) |
| `deprecated-modes` | `extensions["deprecated-modes"].modes[]` (`:157-160`) | top-level `deprecatedModes: []`, not under extensions (`deep-loop-workflows/mode-registry.json:28`) |
| `transport-axis` | absent | `{ description, transports: [...] }` (`sk-design/mode-registry.json:21-24`) |
| `surface-axis` | `{ surfaces: [...] }` (`:161-164`) | `{ description, surfaces: [...] }` (`sk-code/mode-registry.json:15-19`) — the only near-match |

Additionally `advisorRoutingContract.driftGuard` is a checker-recognized field (`parent-skill-check.cjs:472` reads it; deep-loop sets it, `mode-registry.json:16`) that the template's `advisorRoutingContract` block (`:11-19`) never mentions.

**Why it matters:** The checker only shape-checks `runtime-loop` (object) and `advisor-projection` (driftGuard string) (`parent-skill-check.cjs:430-444`), so template drift is invisible until a scaffolded hub and a consumer disagree. `transform-verbs` and `transport-axis` are validated by nothing at all.

**Recommendation:** Regenerate the template's `extensions` block from the live shapes (keep `description` + the live payload key per extension); move `deprecatedModes` under `extensions["deprecated-modes"]` in deep-loop (or bless the top-level location in doctrine — one or the other); add `driftGuard` to the template contract block; add checker shape-checks for `transform-verbs` (declaredField must exist top-level) and `transport-axis` (every listed transport must be a registered `packetKind:"transport"` mode).

---

### PS-14 — P2 — Checker enforcement gaps: doctrine rules with no teeth, plus one stale enum

**Evidence (CONFIRMED by reading `parent-skill-check.cjs` end-to-end; a live sweep confirms no hub currently violates the unchecked rules except as noted):**
- `folder == packetSkillName` is never verified — `grandfatheredFolderMismatch` is required as a boolean (`:342-345`) but its truth is never compared to reality; a hub could ship `false` with a real mismatch and pass. (The deep-loop drift guard *does* check `packetSkillName === packet` — but only for deep-loop, `routing-registry-drift-guard.vitest.ts:151`.)
- Alias presence/uniqueness: unchecked (doctrine `parent_skills_nested_packets.md:194`). Live sweep: unique in all four hubs today.
- Tie-break: only *coverage* is checked (`:587-593`); the doctrine's workflow-before-surface **order** rule (`parent_hub_router_schema.md:87`) is not.
- `routerPolicy.defaultMode`: never validated as a real mode or null.
- Base outcomes `single`/`orderedBundle`/`defer`: never checked (only `surfaceBundle`, conditionally, `:612-615`).
- Packet companion files (`SKILL.md`/`README.md`/`changelog/` per packet, doctrine `:200`): unchecked — only packet *directory* existence (`:316-318`). Live sweep: all 24 packets conform today.
- Vocabulary classes: referenced→defined is checked (`:558-567`); defined→referenced (doctrine `parent_hub_router_schema.md:208`) is not. Live sweep: clean today.
- `VALID_RUNTIME_LOOP_TYPES` still contains `'context'` (`:53`) although the deep-loop registry says runtimeLoopType is "Validated against exactly research|review|council" (`deep-loop-workflows/mode-registry.json:7`) and the extension declares only those three (`:21`) — the retired context loop would still pass the checker.
- Registry aliases ↔ router vocabulary sync is delegated to `parent-hub-vocab-sync.cjs` (a Lane-C skill-benchmark tool under `deep-improvement/scripts/skill-benchmark/`, not a CI/doctor gate) — so the sync that PS-17 examines runs only when someone benchmarks the hub.

**Why it matters:** Packet 124 promoted checks 5–9 WARN→FAIL precisely to make canon self-enforcing; these are the residual honor-system rules. Each is one hub-edit away from silent drift, and PS-01 shows what happens when canon relies on discipline during fast evolution.

**Recommendation:** Add the cheap ones to the checker now (folder==packetSkillName cross-check with the grandfathered flag; alias uniqueness; base-outcome presence; defaultMode validity; packet-file existence; tie-break ordering once packetKind ordering is settled per PS-01); delete `'context'` from `:53`; consider a `--vocab` flag that shells into the vocab-sync projection so alias↔vocabulary drift surfaces in `/doctor` runs, not just benchmarks.

---

### PS-15 — P2 — Undeclared fields: per-mode extras with no declaring extension, and a spec-folder field inside a skill identity file

**Evidence (CONFIRMED):**
- `proceduresPath` on five sk-design modes (`sk-design/mode-registry.json:50,71,92,113,134`) — no extension declares it; no other hub has it; the transport mode lacks it. The hub template's rule: "Never infer extension-only fields from workflowMode; declare the extension and field explicitly" (`parent_skill_hub_template.md:245`).
- `loopHostMode` on the three improvement modes (`deep-loop-workflows/mode-registry.json:115,142,165`) — implied by `backendKind: improvement-host` but declared by nothing.
- `mutating: true` appears on exactly **one** mode in the entire fleet (`deep-loop-workflows/mode-registry.json:119`, agent-improvement) — redundant with `toolSurface.mutatesWorkspace: true` (`:111`) and absent from its three sibling lanes that are equally mutating. Orphan field.
- `packet_id: "147-deep-loop-workflows"` inside the deep-loop **skill** graph-metadata (`deep-loop-workflows/graph-metadata.json`) — a spec-folder-schema field (compare the spec fixture shape: `packet_id`/`spec_folder`/`parent_id`) leaked into the skill-identity file. Both validators ignore unknown keys, so it is inert, but it blurs the two graph-metadata schemas that already share a filename (the ambiguity PS-03's `isSkillGraphMetadata` heuristic exists to paper over).
- The doctrine's own registry template also plants `command`/`agent`/`artifactRoot` on every mode (`parent_skill_registry_template.json:36-38` etc.) though the required-fields list (`parent_skills_nested_packets.md:60-70`) omits them — sk-code ships none of the three, sk-doc ships `command` only, deep-loop ships all three, sk-design ships `command` (+`proceduresPath`). Optionality is fine; undocumented optionality is how PS-08-style fossil prose happens.

**Recommendation:** Add an "optional per-mode fields" table to the doctrine (command/agent/artifactRoot/loopHostMode/proceduresPath — owner, meaning, which hubs use them); delete the orphan `mutating` (or set it on all three lanes with a defined meaning distinct from `mutatesWorkspace`); strip `packet_id` from deep-loop's skill graph-metadata; either declare `proceduresPath` via a small `procedures` extension or fold it into a documented optional field.

---

### PS-16 — P2 — Cross-hub metadata dialect drift (description.json, graph-metadata, frontmatter, and sk-design's third command surface)

**Evidence (CONFIRMED):**
- **description.json speaks two dialects:** sk-doc/sk-code carry `supported_surfaces` + `opencode_languages` + `trigger_examples`; sk-design/deep-loop instead carry `backend_kinds` + `modes` arrays. The `modes` array **duplicates the registry** — currently in perfect sync for both hubs (verified), but it is a second source of truth for the exact data `mode-registry.json` is designated to own ("single source of truth", every hub SKILL.md §2), with no guard.
- **graph-metadata optional-field lottery:** `deprecated: false` only in sk-code; top-level `importance_tier` only in sk-design/deep-loop; `derived.supported_surfaces`/`peer_resource_categories` only in sk-code; `derived.intent_signals` only sk-doc/sk-code; `packet_id` only deep-loop (PS-15).
- **Frontmatter `metadata.family` is a third, uncontrolled family vocabulary:** sk-doc says `family: sk-doc` (`sk-doc/SKILL.md:8`) while its graph family is `sk-util`; sk-design says `family: sk-code` (`sk-design/SKILL.md:8`) matching its graph family — which is itself the shoehorn: **sk-design's graph family is `sk-code`** because `ALLOWED_FAMILIES` (`skill_graph_compiler.py:38`, `skill-graph-db.ts:141`, mirrored `parent-skill-check.cjs:43`) contains no design (or generic hub) family, even though `ALLOWED_CATEGORIES` gained `design` (`skill_graph_compiler.py:39-43`). deep-loop has no `metadata` block at all.
- **sk-design's `command-metadata.json`** (hub root) is a third routing-adjacent vocabulary surface: per-command `ownerMode`, `aliases`, and `hubKeywordProjection` — its aliases (`"audit design quality"`, `"critique ui surface"`, `"score design readiness"`) appear in neither the registry's `aliases` nor the router's `vocabularyClasses` (verified). The doctrine's companion-file policy (`parent_skills_nested_packets.md:197-199`) doesn't know the file; no other hub has one; nothing syncs it.

**Why it matters:** Every dialect fork is a place where "update the hub" means different edits per hub, and where a consumer written against one hub silently under-reads another. The family shoehorn specifically pollutes graph semantics: any family-based reasoning (sibling inference, family filters) now treats a design hub as a code-family member.

**Recommendation:** (1) Either drop `modes`/`backend_kinds` from description.json or add a one-line vitest asserting they equal the registry projection. (2) Add a `design` (or generic `sk-hub`) family to `ALLOWED_FAMILIES` in all three mirrors and migrate sk-design; standardize `metadata.family` to equal the graph family or delete the frontmatter field. (3) Standardize `deprecated`/`importance_tier` presence via the graph-metadata template. (4) Register `command-metadata.json` in the doctrine (it is a good idea — the advisor-facing command projection — but it must be a *declared* surface with a sync rule to the registry's `command` fields, and ideally consumed by the PS-07 guard).

---

### PS-17 — P2 — Vocabulary-strategy fork and undocumented N-modes→1-packet multiplexing

**Evidence (CONFIRMED, mechanical sweep):**
- **Alias→vocabulary mirroring:** sk-code, sk-design, and deep-loop mirror every registry alias verbatim into router vocabulary classes (0 uncovered aliases each). sk-doc covers **0 of its 34 multi-word aliases literally** ("create skill", "scaffold a parent hub", "harden docs", …) — its router is compositional (`authoring-actions` verbs × per-mode noun classes, `sk-doc/hub-router.json:36-49`). Both strategies are defensible; having both un-labelled means `parent-hub-vocab-sync` semantics (which builds ownership from typed per-mode classes) and any replay tooling behave differently per hub without anything saying so.
- **Multiplexed packets:** two modes → one packet in sk-doc (`create-skill` + `create-skill-parent` → `create-skill/`, `sk-doc/mode-registry.json:22,34`; acknowledged by the packet itself, `create-skill/SKILL.md:12`) and three modes → one packet in deep-loop (all improvement lanes → `deep-improvement/`, discriminated by `loopHostMode`). The doctrine says "every packet is one entry in `mode-registry.json > modes[]`" (`parent_skills_nested_packets.md:52`) and its templates are strictly 1:1; deep-loop's contract even overstates the naming rule as "folder == packetSkillName == deep-<mode>" (`mode-registry.json:15`) which is false for the improvement lanes (packet is `deep-improvement`, not `deep-agent-improvement`).
- **Case drift:** sk-design ships the fleet's only non-lowercase registry aliases (`AnimatePresence`, `P0 P1 design findings`, `mode-registry.json:96,117`); its router classes carry the lowercased forms — a needless normalization dependency between the two surfaces (doctrine keyword rule: lowercase, `parent_hub_router_schema.md:209`).

**Recommendation:** Document both vocabulary strategies in the router schema (mirrored vs compositional, and which consumers assume which); amend the doctrine to define mode-multiplexed packets (N:1 allowed when the packet SKILL.md declares each workflowMode it serves — both live cases already do) and soften deep-loop's `== deep-<mode>` claim; lowercase the two sk-design aliases.

---

### PS-18 — P2 — sk-code: one mechanism, two contradictory formulas ("never process" vs "owns the workflow doctrine")

**Evidence (CONFIRMED):** The registry's surface-axis extension: surface packets "carry stack knowledge, **never process**" (`sk-code/mode-registry.json:17`); the backend section repeats "the packet mutates nothing and never carries process" (`sk-code/SKILL.md:148`). The same two files also say: the "Implement/debug/verify phase doctrine … symlinked into each surface" (`mode-registry.json:4`), "Each surface carries the shared implement → debug → verify workflow doctrine … symlinked in" (`SKILL.md:15`), and each surface "**Owns the implement → debug → verify workflow doctrine**" (`SKILL.md:34-35`; likewise the advisor-facing hub description, `SKILL.md:3`). On disk the six symlinks exist (`code-webflow/references/workflow_{implement,debug,verify}.md`, `code-opencode/references/workflow_*`→ `shared/references/`).

The intended resolution is discernible ("the acting agent applies the doctrine it bundles", `SKILL.md:148`): surfaces *bundle* process doctrine as read-only evidence but do not *execute* a process. But "never carries process" and "owns the workflow doctrine" are literal opposites, and the shared-directory doctrine ("never per-mode workflow logic" in shared/, `parent_skills_nested_packets.md:202`) plus the symlink mechanism itself are nowhere blessed in the parent-skill references — a scaffolder cannot reproduce sk-code's arrangement from the doctrine.

**Recommendation:** Pick one formula and use it everywhere: e.g. "surfaces bundle the shared workflow doctrine as read-only evidence; they never execute, mutate, or become primary." Add a short doctrine note that cross-surface doctrine may live once in `shared/` and be symlinked into surfaces (and that the changelog no-symlink rule is changelog-specific — the checker already scopes it correctly, `parent-skill-check.cjs:157-190`).

---

## Cross-Hub Consistency Matrix

Legend: ✅ conformant · ⚠️ drift (see note) · ❌ violation · — N/A. "Doctrine" = the create-skill references + templates; "checker" = `parent-skill-check.cjs` live run 2026-07-07.

| Doctrine requirement / invariant | sk-doc | sk-code | sk-design | deep-loop-workflows |
|---|---|---|---|---|
| Exactly one `graph-metadata.json`, at hub root | ✅ | ✅ | ✅ | ✅ |
| `skill_id` == folder; family in allowed set | ✅ (`sk-util`) | ✅ (`sk-code`) | ⚠️ family=`sk-code` shoehorn (PS-16) | ✅ (`deep-loop`) |
| One `modes[]` array, no parallel packet array | ✅ (11 modes) | ✅ (4) | ✅ (6) | ✅ (7) |
| `packetKind` ∈ {workflow, surface} on every mode | ✅ all workflow | ✅ 2+2 | ❌ `transport` (PS-01) | ✅ all workflow |
| `backendKind` on every mode | ✅ | ✅ | ✅ | ✅ |
| `toolSurface` complete on every mode | ✅ | ⚠️ code-review Write vs mutatesWorkspace:false (PS-04) | ✅ | ✅ |
| `grandfatheredFolderMismatch` on every mode | ✅ all false | ✅ all false | ✅ all false | ✅ all false |
| `folder == packetSkillName` (actual) | ✅ | ✅ | ✅ | ✅ |
| One mode ↔ one packet (doctrine's 1:1 reading) | ⚠️ 2→1 create-skill (PS-17) | ✅ | ✅ | ⚠️ 3→1 deep-improvement (PS-17) |
| `aliases` present + unique across modes | ✅ | ✅ | ⚠️ 2 non-lowercase (PS-17) | ✅ |
| `advisorRouting` + valid routingClass per mode | ✅ all metadata | ✅ all metadata | ✅ all metadata | ✅ lexical×3, alias-fold×1, command-bridge×3 |
| advisorRouting truthfulness vs live advisor | ⚠️ 2 modes advisor-bridged despite metadata claim (PS-07) | ✅ | ✅ | ⚠️ model-benchmark TS side-channel (PS-06) |
| `advisorRoutingContract` prose accuracy | ✅ | ✅ | ❌ contradicts own data (PS-08) | ✅ (⚠️ `== deep-<mode>` overstated, PS-17) |
| Extensions declared for extra semantics | ✅ none (pure 2-tier) | ✅ surface-axis | ⚠️ transform-verbs ✅, `transport-axis` un-canonized (PS-01) | ⚠️ runtime-loop + advisor-projection ✅; deprecated-modes as top-level array (PS-13) |
| Undeclared per-mode fields | ✅ (`command` only) | ✅ | ⚠️ `proceduresPath` (PS-15) | ⚠️ `loopHostMode`, `mutating` (PS-15) |
| `hub-router.json` present; signals ↔ registry bidirectional | ✅ (11/11) | ✅ (4/4) | ✅ (6/6) | ✅ (7/7) |
| tieBreak covers all modes once; workflow-first ordering | ✅ | ✅ | ✅ (transport last) | ✅ |
| Outcomes: `single`/`orderedBundle`/`defer` | ✅ | ✅ | ✅ | ✅ |
| Outcome: `surfaceBundle` (doctrine: always) | ❌ omitted **and forbidden** (PS-02) | ✅ | ❌ omitted (PS-02) | ❌ omitted (PS-02) |
| Vocab classes: referenced⊆defined and defined⊆referenced | ✅ | ✅ | ✅ | ✅ |
| Registry aliases mirrored in router vocabulary | ⚠️ compositional; 34 aliases no literal home (PS-17) | ✅ verbatim | ✅ verbatim (+case-fold) | ✅ verbatim |
| Router resources hub-relative + resolve on disk | ✅ | ✅ | ✅ | ✅ (⚠️ bare `README.md` defaultResource vs schema §8 wording) |
| `defaultMode` a real mode or null | ✅ null (workflow-only null not doctrine-blessed) | ✅ null (doctrine-blessed surface-primary) | ✅ `interface` | ✅ `research` |
| Hub companion files (SKILL/registry/router/description/graph/changelog/playbook/benchmark) | ✅ (+scripts facade) | ✅ | ✅ (+`command-metadata.json`, `feature_catalog/` ❌ unregistered, PS-01/16) | ✅ (+node_modules) |
| Packet companion files (SKILL.md/README.md/changelog per packet) | ✅ 10/10 | ✅ 4/4 | ✅ 6/6 | ✅ 4/4 |
| Changelogs real files, no symlinks | ✅ | ✅ | ✅ | ✅ |
| Hub `allowed-tools` == union of mode tool surfaces | ✅ | ❌ grants Task, all modes forbid it (PS-05) | ✅ exact union | ✅ exact union |
| Version lockstep (registry/router/description/SKILL) | ✅ 2.0.0.0×4 | ✅ 4.1.0.0×4 | ❌ 1.4/1.3/1.2/1.2 (PS-10) | ✅ 1.1.0.0×4 |
| Stale lifecycle prose | ❌ registry "SCAFFOLD STATE" (PS-09) | ✅ | ❌ SKILL.md:195 (PS-09) | ✅ |
| description.json dialect | surfaces+languages | surfaces+languages | ⚠️ `modes[]` duplicate (in sync) (PS-16) | ⚠️ `modes[]` duplicate (in sync) (PS-16) |
| `parent-skill-check` verdict (default strict, live run) | ✅ 0 fail / 0 warn | ✅ 0 / 0 | ❌ **2 failures** | ✅ 0 / 0 (incl. dynamic 4b projection match) |

Cross-hub style notes not scored above: sk-code is the only hub mixing bare (`quality`) and packet-shaped (`code-review`) workflowMode keys; sk-design/deep-loop point at each other as "canonical example" (`sk-design/SKILL.md:270`, `deep-loop-workflows/SKILL.md:146`) while the doctrine names sk-code; command/agent binding conventions differ per hub (registry-only vs registry+command-metadata.json vs registry `command`+`agent`).

---

## Advisor Integration

**Discovery and the one-identity claim.** Discovery keys on `graph-metadata.json` with `skill_id == folder`, family ∈ `ALLOWED_FAMILIES`, category ∈ `ALLOWED_CATEGORIES` — enforced in both pipelines (`skill_graph_compiler.py:225-260`; `skill-graph-db.ts:663-676`) and mirrored by the checker (`parent-skill-check.cjs:43`). All four hubs are discoverable, and each resolves to exactly one identity today (fleet-wide `find`: no nested skill-shaped metadata). **However** the invariant is honored, not enforced: the TS scanner would ingest a skill-shaped nested file while the Python compiler cannot see one, splitting the two graph artifacts (PS-03). The spec-folder/skill schema collision on the shared filename is mediated only by the lenient `isSkillGraphMetadata` heuristic — which works for today's fixtures and is one `skill_id` copy-paste away from not working.

**Hub routing model, as-built.** All sk-doc/sk-code/sk-design modes are `metadata`: the advisor scores the hub identity from graph metadata (derived triggers/keywords, domains, intent signals via `projection.ts:191-248`) plus hand-tuned lexical support — which is itself asymmetric: the Python scorer's keyword tables tune `sk-code` (heavily, `skill_advisor.py:1619-1700`) and `sk-doc` (moderately, `:1650-1657`), while `sk-design` has **zero** lexical keywords in either scorer (verified) and rides purely on its graph metadata. That is contract-legal (metadata routing) but a real scoring-support asymmetry worth knowing when comparing hub routing benchmarks.

**deep-loop: the reference integration — verified end-to-end.** The registry is the generator's source of truth (`skill_advisor.py:313-343` reads it **only** in the `--emit/--check-routing-projection` path — the hot path stays registry-free exactly as `mode-registry.json:4` promises). Generated blocks in both scorers carry the same projection hash (`aliases.ts:23` == `skill_advisor.py:291`); the drift guard asserts registry↔TS↔PY hash equality, generator freshness, `packetSkillName == packet`, exactly one `advisorDefaultMode` (agent-improvement), and legacyAdvisorId presence on both alias surfaces (`routing-registry-drift-guard.vitest.ts:144-207`). The checker's *dynamic* check 4b confirmed the live advisor map equals the registry projection during this review. Python's differing alias *values* are a documented design decision (`mode-registry.json:14`). The retired context route is consistently absent everywhere (`aliases.ts:105-108`) — only the doctrine matrix still remembers it (PS-12).

**Command bridges: the unguarded second lane.** Alongside skill identities the advisor maintains `kind: "command"` inline projections (`projection.ts:56-149`) and Python command records (`skill_advisor.py:2020-2081`). This lane has no registry, no generator, and no guard, and it is where every integration defect found lives: `deep-model-benchmark` scored lexically against its own hub with a dead command id in the record (PS-06); sk-doc's two `create:*` bridges contradicting the hub's all-metadata claim, with 2-vs-6-vs-11 coverage across TS/py/registry and four py bridges lacking owner normalization (PS-07). The recent `/create:*` id rename itself is **correctly wired** where it exists — `create:agent`/`create:manual-testing-playbook` are canonical on both surfaces with `command-create-*` retained as compat aliases (`aliases.ts:6-11`; `skill_advisor.py:251-256, 2087-2088`) and both live command files exist — but its durability rests entirely on convention.

**Hub metadata shapes the advisor actually reads.** `projectionFromRow` consumes `derived.trigger_phrases`, `key_topics`, `entities`, `key_files`, `source_docs` (`projection.ts:213-221`) through `stringArray()`. The doctrine template prescribes **object** entities (`parent_skill_graph_metadata_template.json:102-115`); whether object entities are name-flattened before this point depends on `sanitizeDerivedMetadata` — un-verified here, flagged as **SUSPECTED**: if the sanitizer does not flatten them, template-shaped `entities` contribute nothing to scoring for every hub. Worth a five-minute unit check when touching the sanitizer.

---

## Recommended Fixes (prioritized)

1. **Canonize the transport axis** (PS-01): extend the packetKind enum + extension table + templates + `parent-skill-check.cjs:338` to `transport`, add transport surface constraints (3g-analog), allowlist-or-relocate `feature_catalog/` — restores a 4/4 canon-clean fleet. *(Owner: sk-doc doctrine + doctor script; small, high-blast-radius-reduction.)*
2. **Fix the `surfaceBundle` doctrine text** to conditional (PS-02) and add base-outcome presence to the checker — one doc edit + three template edits + ~10 checker lines.
3. **Close the ingestion hole** (PS-03): hub-boundary stop (or nested-identity hard error) in `discoverGraphMetadataFiles`, plus `node_modules` skip.
4. **Repair sk-code's tool contracts** (PS-04, PS-05): resolve the code-review `Write`/`mutatesWorkspace` contradiction by owner decision; remove `Task` from the hub frontmatter; add the two corresponding checker rules.
5. **Put the command-bridge lane under contract** (PS-06, PS-07): declare the bridges in the owning registries, refresh `deep-model-benchmark` to the live command id (or delete its NL lanes per the registry's own contract), reconcile py/TS coverage, and write the create:*/command-bridge drift guard mirroring the deep-loop one.
6. **One-file truth pass on sk-design** (PS-08, PS-09, PS-10): rewrite `advisorRoutingContract`, delete stale scaffold prose, align the four versions, add the transport to the hub SKILL.md discriminator + mode table; lowercase the two aliases (PS-17).
7. **Doctrine refresh sweep** (PS-11, PS-12, PS-13, PS-17, PS-18): bare-noun rule → live prefixed convention; 4-hub matrix; regenerate the extensions template from live shapes (+`transport-axis`, +`driftGuard`); document N:1 mode-multiplexing and the two vocabulary strategies; unify sk-code's surface formula and bless the shared-doctrine symlink mechanism.
8. **Checker hardening batch** (PS-14): folder==packetSkillName, alias uniqueness, defaultMode validity, packet companion files, tie-break ordering, drop `'context'`.
9. **Metadata dialect convergence** (PS-15, PS-16): guard-or-drop the description.json `modes[]` duplicates; add a proper family for sk-design across the three `ALLOWED_FAMILIES` mirrors; strip `packet_id` and the orphan `mutating`; register `command-metadata.json` in the doctrine with a registry-sync rule.

---

*Report generated by a single-round Fable-5 deep review, 2026-07-07. All file:line citations verified against working-tree state on branch `system-speckit/028-memory-search-intelligence`. Live tool runs: `parent-skill-check.cjs` on all four hubs (sk-design: 2 FAIL, others clean); mechanical sweeps for alias uniqueness, vocab coverage, packet companion files, symlinks, and nested graph-metadata.*
