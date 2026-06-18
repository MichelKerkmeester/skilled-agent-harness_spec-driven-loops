# Iteration 012 — SYNTHESIS-2: standardization package (sk-doc + create + doctor + benchmark)

- **Model**: opus-4.8 (claude2/account2, read-only)
- **Seat**: 012
- **model_pick**: A

## Analysis

I have all the evidence I need. One notable finding: **CORRECTION #2 is now stale** — let me state that precisely. The hub `SKILL.md:64` and `:97` and `README:24` have *already* been swept to the new `deep-context/ deep-research/ deep-review/ ai-council/ deep-improvement/` names (commit `c84b7477d1 fix(155): repoint deep-loop-workflows packet rename`). My grep finds zero remaining bare-name packet refs in those files.

Here is my synthesis.

---

# SYNTHESIS-2 (Seat 012/15): The Parent-Skill Standardization Package

## 0. Position on the Stage-1 consensus

I **concur with MODEL A** (one discoverable hub identity; both routing layers derive their *mode projection* from `mode-registry.json`), with two evidence-based refinements and one correction:

- **Refine tension 5** — the registry should own the **alias→mode projection + routingClass**, *not* the hand-tuned lexical regex weights. Those stay in Python.
- **Refine tension 6** — grandfather `ai-council` via an explicit `packetSkillName`; do **not** rename it.
- **Correct ground-truth CORRECTION #2** — it is stale. `SKILL.md:64,97` and `README:24` already use the new names (verified: `rg` returns only `deep-context/ deep-research/ deep-review/ ai-council/ deep-improvement/`; the only "bare-name-shaped" hit at `SKILL.md:97` is in fact already `deep-research/SKILL.md` etc.). The doctor's "stale-rename" check below remains worth shipping as a *regression guard*, but the open instance the digest names is closed.

Why one identity is non-negotiable, re-verified at the keystone: `discoverGraphMetadataFiles` (skill-graph-db.ts:601) is a DFS that collects **every** file named `graph-metadata.json` at *any* depth (`SKILL_METADATA_FILENAME = 'graph-metadata.json'`, :129). A nested packet that kept its own `graph-metadata.json` would be discovered as a *second* skill; `isSkillGraphMetadata` (:644) would accept it on `skill_id || family || edges`. Nested `SKILL.md` files are never read by discovery — so **folder name is not advisor-load-bearing** (decisive for tension 6). `parseSkillMetadata` then enforces `skill_id === folderName` (:656) and `family ∈ ALLOWED_FAMILIES = {cli,mcp,sk-code,deep-loop,sk-util,system}` (:133, throw at :661).

---

## (a) `sk-doc/references/skill_creation.md` — new section "Parent Skills with Nested Mode Packets"

Insert as **§9.5** (after §9 "Skill Structure System", before §10). Slot rationale: §9 already teaches *layered* single-identity skills; parent skills are the multi-packet generalization.

### 9.5.1 Anatomy

```
<hub-skill>/                      # folder name == graph-metadata.skill_id == registry.skill
├── SKILL.md                      # THIN routing hub — no per-mode logic
├── mode-registry.json            # single source of truth (the routing contract)
├── graph-metadata.json           # the ONE advisor identity (only discoverable file)
├── README.md                     # human map (optional)
├── <packet-1>/ … <packet-N>/     # verbatim mode packets — EACH has its own SKILL.md,
│                                  #   references/, scripts/, assets/ … and NO graph-metadata.json
└── shared/                       # cross-packet helpers — non-discoverable (no graph-metadata.json)
```

Evidence this matches the live exemplar: `deep-loop-workflows/{SKILL.md, mode-registry.json, graph-metadata.json}` + 5 packets (`deep-context, deep-research, deep-review, ai-council, deep-improvement`) + `shared/synthesis/resource-map.cjs`; only one `graph-metadata.json` exists in the tree (the hub's, `graph-metadata.json:4` `skill_id: deep-loop-workflows`).

### 9.5.2 The ALWAYS / NEVER rules (lift verbatim into the standard)

**ALWAYS**
- Keep **exactly one** `graph-metadata.json` (the hub's) so the advisor discovers one skill (`SKILL.md:80`; keystone :601).
- Set hub `graph-metadata.skill_id` == hub folder name == `mode-registry.skill` (keystone :656).
- Use a `family` in `ALLOWED_FAMILIES` (keystone :133); a *new* family is an ESCALATE (requires editing `skill-graph-db.ts:133`).
- Resolve every mode through `mode-registry.json`; hub, commands, and **both** advisor layers read it and none re-derive the mapping (`SKILL.md:78`).
- Keep each packet's convergence/state/artifact/tool-permission contract *in its packet* — the hub stays logic-free (`SKILL.md:79`).

**NEVER**
- **NEVER** place a `graph-metadata.json` (or any file named that) inside a packet or `shared/` (`SKILL.md:86`; this is the keystone footgun).
- **NEVER** infer a backend key from the public mode key — read it from the registry (explicit `null` is load-bearing; `SKILL.md:84`).
- **NEVER** let a read-only packet reach another packet's mutating scripts (`SKILL.md:85`).
- **NEVER** hardcode a router mapping in Python or TS that the registry should own (`SKILL.md:78`).

### 9.5.3 The registry contract (resolves tensions 1, 2, 3, 6)

Each mode gets an explicit `advisorRouting` block. **Decision on tension 1: add the block; do not derive solely from existing `aliases`** — because the registry's `aliases` arrays are *not* a superset of the legacy advisor aliases that Python+TS hardcode, so a naive loader regresses routing. Proof: registry review `aliases` = `["deep-review","review loop","iterative code audit","severity weighted findings","code-audit","release-readiness"]` (`mode-registry.json`), but `aliases.ts:20-26` carries `['command-spec-kit-deep-review','/deep:start-review-loop','spec_kit:deep-review','deep-review','sk-deep-review']` and Python prior-art keys on `review-report|deep-review-findings-registry|p0|p1|p2` (`skill_advisor.py:2399`). Different vocabularies → the projection must be declared, not inferred.

```jsonc
{
  "skill": "<hub>",                       // == folder == graph-metadata.skill_id
  "advisorIdentity": { "graphMetadata": "graph-metadata.json", "family": "<allowed>" },
  "discriminator": { /* the three-tier keys, documented */ },
  "modes": [{
    "workflowMode": "review",             // public key (command/advisor)
    "packet": "deep-review",              // FOLDER name
    "packetSkillName": "deep-review",     // nested SKILL.md `name:` — bridge + Python legacy key
    "command": "/deep:review",
    "agent": "deep-review",
    "artifactRoot": "review/",
    "backendKind": "runtime-loop-type",   // runtime-loop-type | improvement-host | external-adapter
    "runtimeLoopType": "review",          // research|review|council|context  OR explicit null
    "advisorRouting": {
      "routingClass": "lexical",          // lexical | metadata | command-bridge  (tension 2)
      "advisorDefaultMode": "review",     // the one mode the advisor lands on (tension 3)
      "legacyAliases": ["command-spec-kit-deep-review","/deep:start-review-loop",
                        "spec_kit:deep-review","sk-deep-review"]
    }
  }]
}
```

**`routingClass` is the answer to "registry-driven routing is not 1:1" (tension 2).** Three classes, mapped to the three observed cardinalities:
- `lexical` — advisor scores it with a weighted regex group (review, research, ai-council = the 3 Python skills, `skill_advisor.py:2307`). **Requires** a pattern group in the scorer.
- `metadata` — `context`: intentionally no lexical entry; resolved from `graph-metadata` derived signals. (`aliases.ts:86-89` and `skill_advisor.py:2318` both document context's deliberate absence.) `legacyAliases` optional.
- `command-bridge` — the 4 improvement lanes route via `/deep:*` commands, not advisor lexical scoring. Only the **default** lane is folded into the alias→mode map.

**`advisorDefaultMode` is the answer to tension 3** (one `deep-improvement` packet → 4 workflowModes). It must be explicit, never array-order. Confirmed live: `aliases.ts:100` folds `deep-improvement → agent-improvement`; the other three lanes (`model-benchmark`, `skill-benchmark`, `ai-system-improvement`) keep their own command bridges and are **not** folded (`aliases.ts:92-95`).

**`packetSkillName` is the answer to tension 6** and does double duty:
1. It is the bridge for the `ai-council` folder/name mismatch (`ai-council/SKILL.md:2` `name: deep-ai-council`).
2. It is *already* the legacy discriminator key Python scores on (`deep-review`/`deep-research`/`deep-ai-council` = the nested SKILL.md names). So Python's `DEEP_ROUTING_SKILLS` and `DEEP_ROUTING_MODE_BY_KEY` can be derived as `{packetSkillName → workflowMode}` over `routingClass==lexical` modes — without putting regex in JSON.

### 9.5.4 What stays in code (decision on tension 5)

**The lexical/structural regex *weights* stay in `skill_advisor.py`; the registry owns only the alias→mode *projection* + `routingClass`.** Rationale, evidence-grounded:
- The weights are hand-tuned floats + Python-`re`-dialect patterns (`DEEP_ROUTING_LEXICAL_PATTERNS`, `DEEP_ROUTING_STRUCTURAL_PATTERNS`, `_score_prior_art` — `skill_advisor.py:2326-2392`). Encoding these as JSON strings would force a regex-dialect normalization layer and bump the registry version on every tuning tweak.
- The Python↔TS divergence the digest fears is *partly a phantom*: TS does **not** lexically score — `aliases.ts` only does the alias→canonical and alias→mode projection. The single artifact both layers share is exactly that projection, which is what the registry now owns. A registry-coverage fixture (below) guards "added a mode, forgot its pattern group," giving the safety without the JSON-regex coupling.

---

## (b) `/create:parent-skill`

Add as a `--type parent-skill` operation on the existing `/create:skill` router (`.opencode/commands/create/skill.md` is already a thin router with an operation/type axis), backed by two new sk-doc templates: `assets/skill/parent_skill_md_template.md` and `assets/skill/mode_registry_template.json`.

**Inputs**
| Input | Constraint (enforced by skeleton) |
|---|---|
| `hub-skill-id` | kebab-case; will be folder name and `graph-metadata.skill_id` (keystone :656) |
| `family` | must ∈ `{cli,mcp,sk-code,deep-loop,sk-util,system}` (keystone :133); else ESCALATE |
| `modes[]` | each: `workflowMode, packet, packetSkillName, command, agent, artifactRoot, backendKind, runtimeLoopType\|null, routingClass, advisorDefaultMode?, legacyAliases?` |
| `backend-skill` (opt) | becomes a `depends_on` edge (e.g. `deep-loop-runtime`, `graph-metadata.json:9-14`) |

**What it scaffolds**
1. `<hub>/SKILL.md` from `parent_skill_md_template.md` — the 5 required sections, with SMART ROUTING pre-filled to the registry-driven three-tier block and RULES pre-filled with §9.5.2.
2. `<hub>/mode-registry.json` from `mode_registry_template.json`, populated with each mode + its `advisorRouting` block.
3. `<hub>/graph-metadata.json` — the **one** identity, via the canonical `generate-context.js` path (so `derived`/`description.json` are produced, not hand-written).
4. `<hub>/<packet>/` per mode — each a verbatim packet skeleton with its own `SKILL.md` (`name: <packetSkillName>`), `references/`, `scripts/`, `assets/`, and **no `graph-metadata.json`**.
5. `<hub>/README.md` (human map) and optional `<hub>/shared/`.

**Invariants the skeleton MUST satisfy** (identical to the doctor checks — `/create` runs them as a post-scaffold gate, fail-closed):
- I1 — exactly one `graph-metadata.json` in the tree, at hub root.
- I2 — `graph-metadata.skill_id == <hub folder> == mode-registry.skill`; `family ∈ ALLOWED_FAMILIES`.
- I3 — no `graph-metadata.json` (nor any file named that) under any packet or `shared/`.
- I4 — for each mode: packet dir exists; `lexical ⇒ packetSkillName set` + advisor pattern group exists; `runtime-loop-type ⇒ runtimeLoopType ∈ {research,review,council,context}`; `improvement-host|external-adapter ⇒ runtimeLoopType === null`.
- I5 — each `command` file exists under `.opencode/commands/`; each `agent` exists in the active runtime agent dir.
- I6 — `advisorDefaultMode` present whenever >1 mode shares a `packet`.
- I7 — `packet == packetSkillName` UNLESS `packetSkillName` is explicitly declared (grandfather clause for `ai-council`).

---

## (c) `/doctor:parent-skill`

Add a **read-only** route to `.opencode/commands/doctor/_routes.yaml` (`target: parent-skill`, `mutation_class: read-only` — no spec folder needed per the router's read-only branch). It takes a hub skill path and runs I1–I7 plus the two derivation-parity checks, emitting a PASS/FAIL table. Exact checks + failure messages:

| # | Check | FAIL message |
|---|---|---|
| C1 | Exactly one `graph-metadata.json` in tree | `PARENT-SKILL-001: found N graph-metadata.json files; a parent skill must have exactly one (at hub root). Offenders: <paths>. The advisor would rank N skills, not 1 (skill-graph-db.ts:601).` |
| C2 | `skill_id == folder == registry.skill` | `PARENT-SKILL-002: skill_id "<x>" != folder "<y>" (parseSkillMetadata throws, skill-graph-db.ts:656).` |
| C3 | `family ∈ ALLOWED_FAMILIES` | `PARENT-SKILL-003: family "<f>" not in {cli,mcp,sk-code,deep-loop,sk-util,system}; extend ALLOWED_FAMILIES (skill-graph-db.ts:133) or change family — this is an ESCALATE.` |
| C4 | No nested graph-metadata.json | `PARENT-SKILL-004: nested graph-metadata.json at <path>; packets must drop theirs (SKILL.md:86).` |
| C5 | Each mode packet dir exists | `PARENT-SKILL-005: mode "<m>" references packet "<p>/" which does not exist.` |
| C6 | `runtimeLoopType` ↔ `backendKind` coherence | `PARENT-SKILL-006: mode "<m>" backendKind=<k> but runtimeLoopType=<v>; runtime-loop-type requires research\|review\|council\|context, host/adapter requires null (SKILL.md:84).` |
| C7 | lexical mode ⇒ advisor pattern group exists | `PARENT-SKILL-007: routingClass=lexical mode "<m>" (packetSkillName "<n>") has no pattern group in skill_advisor.py DEEP_ROUTING_LEXICAL_PATTERNS — advisor cannot score it.` |
| C8 | multi-mode packet ⇒ `advisorDefaultMode` set | `PARENT-SKILL-008: packet "<p>" maps to modes [...] but no advisorDefaultMode; advisor cannot pick a landing mode (array-order is not allowed).` |
| C9 | command + agent exist | `PARENT-SKILL-009: mode "<m>" command "<cmd>" / agent "<a>" not found on disk.` |
| C10 | **Derivation parity** — registry projection == code projection | `PARENT-SKILL-010: registry legacyAliases/advisorDefaultMode do not match aliases.ts DEEP_MODE_BY_CANONICAL + RAW_ALIAS_GROUPS / Python DEEP_ROUTING_MODE_BY_KEY. Routing drift detected. Diff: <...>.` |
| C11 | **Stale-rename guard** (regression-only) | `PARENT-SKILL-011: hub SKILL.md/README reference a packet dir that does not exist (<bare-name>); rename sweep incomplete.` |
| C12 | `packet != packetSkillName` w/o declaration | `PARENT-SKILL-012 [INFO]: packet "<p>" != packetSkillName "<n>"; allowed only as a declared grandfather exception (ai-council). New skills SHOULD use packet == packetSkillName == deep-<mode>.` |

C10 is the heart of MODEL A: it is the check that *forces* both routing layers to derive from the registry. C12 is INFO (not FAIL) when `packetSkillName` is explicitly declared — that is the documented tension-6 standard.

---

## (d) The routing/discovery benchmark, dogfooded through `skill-benchmark` mode

The parent-skill pattern is validated by pointing `deep-loop-workflows`' **own** Lane C at *itself* — `/deep:skill-benchmark` targeting `deep-loop-workflows`. This closes the loop: the skill that *implements* skill-benchmark is the harness that *certifies* the parent-skill pattern. Map the parent-skill assertions onto the existing dimensions (`deep-improvement/references/skill_benchmark/operator_guide.md`):

- **Pre-flight gate** — run C1–C9 (the doctor invariants) as a hard gate; a parent skill that fails one-identity scores **0 on D2** (you cannot be "discoverable as one skill" if you emit N graph-metadata files).
- **D1 / D1-inter (routing accuracy)** — gold set asserting `{skill: 'deep-loop-workflows', mode}` for one prompt per `routingClass`:
  - lexical: research / review / ai-council prompts (today covered by `routing-parity-deep-skills.vitest.ts`, INV-001..009).
  - **metadata: a "gather codebase context before planning" prompt → `{deep-loop-workflows, context}` — currently UNTESTED (tension 4).**
  - **command-bridge: "improve this agent" → agent-improvement; "benchmark this model/skill" → model/skill-benchmark; "refine the non-dev ai system" → ai-system-improvement — UNTESTED.**
- **D2 (discovery / over-routing recall)** — the keystone proof: for *any* deep-* prompt, assert the advisor surfaces **exactly one** skill id (`deep-loop-workflows`), never 5. This is the metric that would have caught Option B.
- **D3 (efficiency / over-routing)** — a generic "review my PR" must **not** lift `deep-loop-workflows` review above the non-deep code-review baseline (guards the lexical floor; `skill_advisor.py:_apply_deep_routing_incompatibility_penalties:2440`).

**Decision on tension 4: add a `registry-coverage` fixture** (`routing-parity-registry-coverage.vitest.ts`) that *is* the doctor invariant set in test form, iterating every registry mode (so context + the 4 improvement lanes stop being untested). It is the same gold set the benchmark's D1/D2 consume — author once, run in both CI (fixture) and benchmark (graded). This is the lower-blast choice over hand-extending the three existing parity files.

---

## Net standard (tension resolutions, one line each)

1. **Registry shape** → explicit `advisorRouting` block (derive-from-`aliases` regresses; proven by alias-vocabulary diff).
2. **Three cardinalities** → `routingClass: lexical|metadata|command-bridge`.
3. **One packet → N modes** → explicit `advisorDefaultMode` (never array-order).
4. **Fixture coverage** → add `registry-coverage` fixture = doctor invariants = benchmark gold set.
5. **Lexical weights** → stay in code; registry owns only the projection + `routingClass`; coverage fixture guards "mode added, patterns missing."
6. **ai-council** → grandfather via explicit `packet`/`packetSkillName`; standard is `packet == packetSkillName == deep-<mode>`; do not rename (folder name is non-load-bearing, keystone :601).

## Risks
- **High-blast misread**: anyone "fixing" the ai-council folder name would touch the agent id, command `skill:` refs, `artifactRoot`, and 9 changelog files for zero advisor benefit — the standard must say *don't*.
- **C10 false-greens** if the parity check only diffs Python (the live parity test shells Python only, `routing-parity-deep-skills.vitest.ts:40`); it must *also* diff `aliases.ts` exports, or TS drift goes unseen.
- **ESCALATE leakage**: a parent skill in a family outside `ALLOWED_FAMILIES` cannot be discovered until `skill-graph-db.ts:133` is edited; `/create` must hard-stop, not silently emit an invisible skill.
- **Weights-in-code drift across runtimes** remains possible if a future TS scorer is added; the registry-coverage fixture covers *existence*, not *weight equality* — note this boundary in the standard.

===RESEARCH-JSON===
{"angle":"standardization package (sk-doc + create + doctor + benchmark)","verdict":"Ship one-identity parent-skill standard: registry owns alias→mode projection + routingClass + advisorDefaultMode + packetSkillName; lexical weights stay in code; ai-council grandfathered, not renamed; doctor C1-C12 + a registry-coverage fixture enforce it, dogfooded through deep-loop-workflows' own skill-benchmark.","model_pick":"A","decisions":[{"question":"T1 registry shape: explicit advisorRouting block vs derive-from-aliases","resolution":"Add explicit advisorRouting{routingClass,advisorDefaultMode,legacyAliases}; deriving from registry.aliases regresses because they are not a superset of hardcoded advisor aliases","evidence":"mode-registry.json review aliases vs aliases.ts:20-26 vs skill_advisor.py:2399"},{"question":"T2 three cardinalities (Py 3 / TS 4 / registry 8)","resolution":"routingClass: lexical|metadata|command-bridge per mode","evidence":"skill_advisor.py:2307,2318; aliases.ts:86-101"},{"question":"T3 one packet -> 4 modes","resolution":"explicit advisorDefaultMode (deep-improvement->agent-improvement), never array-order","evidence":"aliases.ts:96-101"},{"question":"T4 fixture coverage","resolution":"add routing-parity-registry-coverage fixture iterating every mode = doctor invariants = benchmark gold set","evidence":"routing-parity-deep-skills.vitest.ts:27 covers only research|review|ai-council"},{"question":"T5 lexical weights in registry or code","resolution":"weights stay in skill_advisor.py; registry owns only projection+routingClass; coverage fixture guards missing pattern groups","evidence":"skill_advisor.py:2326-2392; aliases.ts does no lexical scoring"},{"question":"T6 ai-council folder!=name","resolution":"grandfather via explicit packetSkillName; standard packet==packetSkillName==deep-<mode>; do not rename (folder non-load-bearing)","evidence":"ai-council/SKILL.md:2; skill-graph-db.ts:601"}],"refutations":[{"target":"CORRECTION #2: hub SKILL.md:64,97 + README:24 still use bare packet names","held":false,"note":"Stale — rg finds only new names (deep-context/ deep-research/ deep-review/ ai-council/ deep-improvement/) at SKILL.md:64,97 and README:24; rename swept in commit c84b7477d1. Keep a regression guard (C11), but the named instance is closed."},{"target":"One-identity keystone: nested packets must drop graph-metadata.json","held":true,"note":"discoverGraphMetadataFiles:601 DFS-collects every file named graph-metadata.json at any depth; nested SKILL.md never read, so folder name is non-load-bearing and a nested metadata file would create a 2nd skill."},{"target":"Tension-5 claim that Python<->TS lexical divergence is the core risk","held":false,"note":"TS (aliases.ts) does no lexical scoring — only alias->mode projection; the sole shared artifact is the projection, which the registry now owns. Weight divergence across runtimes is a future boundary, not a current one."}],"standardize":["sk-doc/references/skill_creation.md §9.5 Parent Skills with Nested Mode Packets: anatomy + ALWAYS/NEVER + registry contract (advisorRouting/routingClass/advisorDefaultMode/packetSkillName)","/create:parent-skill (type on /create:skill) + parent_skill_md_template.md + mode_registry_template.json; scaffolds 1 hub graph-metadata + N packets with none; fail-closed I1-I7","/doctor:parent-skill read-only route in doctor/_routes.yaml with checks C1-C12 incl. C10 derivation-parity and C12 grandfather-INFO","routing/discovery benchmark via /deep:skill-benchmark on deep-loop-workflows itself: D1 per-routingClass gold (adds context+improvement), D2 exactly-one-skill discovery proof, D3 over-routing floor, pre-flight = doctor invariants","routing-parity-registry-coverage.vitest.ts iterating every registry mode (closes T4) shared as the benchmark gold set"],"risks":["Forced ai-council rename is high-blast (agent id, command skill: refs, artifactRoot, 9 changelogs) for zero advisor benefit — standard must forbid it","C10 parity check must diff BOTH Python and aliases.ts exports; live parity test shells Python only, so TS drift can false-green","Parent skill in a family outside ALLOWED_FAMILIES is invisible until skill-graph-db.ts:133 is edited — /create must hard-stop (ESCALATE), not emit silently","Coverage fixture guards pattern-group existence, not weight equality — cross-runtime weight drift stays uncovered if a future TS scorer lands"]}
===END===

## Structured output

```json
{
  "angle": "standardization package (sk-doc + create + doctor + benchmark)",
  "verdict": "Ship one-identity parent-skill standard: registry owns alias→mode projection + routingClass + advisorDefaultMode + packetSkillName; lexical weights stay in code; ai-council grandfathered, not renamed; doctor C1-C12 + a registry-coverage fixture enforce it, dogfooded through deep-loop-workflows' own skill-benchmark.",
  "model_pick": "A",
  "decisions": [
    {
      "question": "T1 registry shape: explicit advisorRouting block vs derive-from-aliases",
      "resolution": "Add explicit advisorRouting{routingClass,advisorDefaultMode,legacyAliases}; deriving from registry.aliases regresses because they are not a superset of hardcoded advisor aliases",
      "evidence": "mode-registry.json review aliases vs aliases.ts:20-26 vs skill_advisor.py:2399"
    },
    {
      "question": "T2 three cardinalities (Py 3 / TS 4 / registry 8)",
      "resolution": "routingClass: lexical|metadata|command-bridge per mode",
      "evidence": "skill_advisor.py:2307,2318; aliases.ts:86-101"
    },
    {
      "question": "T3 one packet -> 4 modes",
      "resolution": "explicit advisorDefaultMode (deep-improvement->agent-improvement), never array-order",
      "evidence": "aliases.ts:96-101"
    },
    {
      "question": "T4 fixture coverage",
      "resolution": "add routing-parity-registry-coverage fixture iterating every mode = doctor invariants = benchmark gold set",
      "evidence": "routing-parity-deep-skills.vitest.ts:27 covers only research|review|ai-council"
    },
    {
      "question": "T5 lexical weights in registry or code",
      "resolution": "weights stay in skill_advisor.py; registry owns only projection+routingClass; coverage fixture guards missing pattern groups",
      "evidence": "skill_advisor.py:2326-2392; aliases.ts does no lexical scoring"
    },
    {
      "question": "T6 ai-council folder!=name",
      "resolution": "grandfather via explicit packetSkillName; standard packet==packetSkillName==deep-<mode>; do not rename (folder non-load-bearing)",
      "evidence": "ai-council/SKILL.md:2; skill-graph-db.ts:601"
    }
  ],
  "refutations": [
    {
      "target": "CORRECTION #2: hub SKILL.md:64,97 + README:24 still use bare packet names",
      "held": false,
      "note": "Stale — rg finds only new names (deep-context/ deep-research/ deep-review/ ai-council/ deep-improvement/) at SKILL.md:64,97 and README:24; rename swept in commit c84b7477d1. Keep a regression guard (C11), but the named instance is closed."
    },
    {
      "target": "One-identity keystone: nested packets must drop graph-metadata.json",
      "held": true,
      "note": "discoverGraphMetadataFiles:601 DFS-collects every file named graph-metadata.json at any depth; nested SKILL.md never read, so folder name is non-load-bearing and a nested metadata file would create a 2nd skill."
    },
    {
      "target": "Tension-5 claim that Python<->TS lexical divergence is the core risk",
      "held": false,
      "note": "TS (aliases.ts) does no lexical scoring — only alias->mode projection; the sole shared artifact is the projection, which the registry now owns. Weight divergence across runtimes is a future boundary, not a current one."
    }
  ],
  "standardize": [
    "sk-doc/references/skill_creation.md §9.5 Parent Skills with Nested Mode Packets: anatomy + ALWAYS/NEVER + registry contract (advisorRouting/routingClass/advisorDefaultMode/packetSkillName)",
    "/create:parent-skill (type on /create:skill) + parent_skill_md_template.md + mode_registry_template.json; scaffolds 1 hub graph-metadata + N packets with none; fail-closed I1-I7",
    "/doctor:parent-skill read-only route in doctor/_routes.yaml with checks C1-C12 incl. C10 derivation-parity and C12 grandfather-INFO",
    "routing/discovery benchmark via /deep:skill-benchmark on deep-loop-workflows itself: D1 per-routingClass gold (adds context+improvement), D2 exactly-one-skill discovery proof, D3 over-routing floor, pre-flight = doctor invariants",
    "routing-parity-registry-coverage.vitest.ts iterating every registry mode (closes T4) shared as the benchmark gold set"
  ],
  "risks": [
    "Forced ai-council rename is high-blast (agent id, command skill: refs, artifactRoot, 9 changelogs) for zero advisor benefit — standard must forbid it",
    "C10 parity check must diff BOTH Python and aliases.ts exports; live parity test shells Python only, so TS drift can false-green",
    "Parent skill in a family outside ALLOWED_FAMILIES is invisible until skill-graph-db.ts:133 is edited — /create must hard-stop (ESCALATE), not emit silently",
    "Coverage fixture guards pattern-group existence, not weight equality — cross-runtime weight drift stays uncovered if a future TS scorer lands"
  ]
}
```
