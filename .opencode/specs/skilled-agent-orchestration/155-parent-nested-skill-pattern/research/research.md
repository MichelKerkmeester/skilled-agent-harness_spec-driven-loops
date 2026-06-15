# Research: Define & optimize the "parent skill with nested sub-skills" pattern

<!-- ANCHOR:references -->
**Spec:** `.opencode/specs/skilled-agent-orchestration/155-parent-nested-skill-pattern/`
**Iterations:** `research/iterations/iteration-001.md … iteration-015.md` — 10 × `gpt-5.5-fast --variant xhigh` (cli-opencode, read-only code analysis) + 5 × `opus-4.8` (claude2/account2; 2 synthesis, 2 adversarial, 1 meta). Per-seat structured output in `research/deltas/iter-N.jsonl`.
**Fleet result:** routing-model pick **A = 15/15 seats** (unanimous), with the implementation *mechanism* refined from "runtime-derive" to **C-plus (drift-guard)** by the adversarial pass.
**Host-verified ground truth (orchestrator read the real source this session):** discovery keys only on `graph-metadata.json` (`skill-graph-db.ts:601` `discoverGraphMetadataFiles`; `:644` `isSkillGraphMetadata` trips on `skill_id|family|edges`; `:656` throws `skill_id≠folder`; `:661` `family∉ALLOWED_FAMILIES`). Routing is hardcoded in three places with three cardinalities: Python `DEEP_ROUTING_SKILLS` = 3 (`skill_advisor.py:2307`), `DEEP_ROUTING_MODE_BY_KEY` = 3 (`:2320`); TS `DEEP_MODE_BY_CANONICAL` = 4 (`aliases.ts:96`); `mode-registry.json` = 8 modes. Parity contract: `routing-parity-deep-skills.vitest.ts` shells `python3 skill_advisor.py --deep-skill-routing-json` and asserts `{skill:'deep-loop-workflows', mode∈{research,review,ai-council}}` (9 invariants). Advisor already does an import-time `json.load` but of an **advisor-local** file (`skill_advisor.py:170-171` `COMPAT_CONTRACT`), not a foreign skill. Registry `aliases[]` are natural-language phrases (`"review loop"`, `"code-audit"`) and do **not** contain the advisor's system-ID aliases (`spec_kit:deep-review`, `command-spec-kit-deep-review`, `sk-deep-review` at `aliases.ts:13-25`). `deep-loop-runtime` already depends on `system-spec-kit` by design (`artifact-root.cjs:18` re-exports `system-spec-kit/shared/review-research-paths.cjs`; `executor-config.ts:3`/`prompt-pack.ts:4` import zod; `coverage-graph-db.ts:3`/`council-graph-db.ts:6` import better-sqlite3; runtime `graph-metadata.json` declares a `depends_on: system-spec-kit` edge).
<!-- ANCHOR:references-end -->

---

## Executive Recommendation

Adopt **Model A — one discoverable parent identity + the registry as the single declarative source of truth — implemented via the C-plus drift-guard mechanism, NOT runtime registry-loading.** Concretely:

1. **Keep exactly one `graph-metadata.json`** (the hub's). The five mode packets stay non-discoverable. This is the load-bearing keystone (`skill-graph-db.ts` throws on a nested `graph-metadata.json` whose `skill_id≠folder`). The reusable pattern's single hard invariant is *"exactly one `graph-metadata.json` per parent skill."*
2. **Enrich `mode-registry.json` with an explicit per-mode `advisorRouting` block** — `{ routingClass: lexical|alias-fold|metadata|command-bridge, legacyAdvisorId: string, advisorDefaultMode?: bool, legacyAliases: string[], packetSkillName: string }`. This makes the registry the authoritative declarative description of *how each mode routes*, including the system-ID aliases the advisor actually keys on (which the existing `aliases[]` phrases do not contain). (Implementation note: the four routing classes are `lexical` = Python+TS maps + regex scoring; `alias-fold` = the TS-only `deep-improvement → agent-improvement` projection; `metadata` = context; `command-bridge` = the improvement lanes. The research's earlier three-way framing folded `alias-fold` into "lexical+folded"; Phase 3 made it an explicit class.)
3. **Close the drift gap with a CI drift-guard test, not runtime coupling** (C-plus). Keep the hardcoded projection maps (`DEEP_ROUTING_MODE_BY_KEY`, `DEEP_MODE_BY_CANONICAL`) but add a test asserting `hardcoded maps == registry advisorRouting projection`. Same anti-drift guarantee as runtime-derive, with **zero** new advisor-runtime I/O and **no** novel cross-skill import coupling (the existing `COMPAT_CONTRACT` load is advisor-local — not a precedent for the advisor reaching into a skill directory).
4. **Lexical regex weights stay in Python** (`DEEP_ROUTING_LEXICAL_PATTERNS`). They are scorer-execution tuning; JSON regex double-escaping is a silent-corruption risk against the exact fixture thresholds (`≥0.75`/`<0.40`). The registry governs only the lexical *set* (which modes are lexical-routed), guarded by a coverage fixture.
5. **Do not widen the 3-mode parity contract.** Add *separate* fixtures: a registry-coverage / drift-guard fixture (Python + TS projection == registry) plus context (metadata) and improvement-lane (command-bridge) routing-class assertions.
6. **`shared/` stays in `deep-loop-workflows`** — on the **execution-vs-synthesis axis only**. Amend the phase-1 ADR-001: its "moving it would create a `runtime→system-spec-kit` dependency" rationale is **factually false** (that dependency already exists by design). The correct, sufficient reason: `deep-loop-runtime/lib` is execution-only (zero renderers); `emitResourceMap` is output-formatting synthesis; promoting it buys zero dedup and adds an out-of-class responsibility.
7. **Formalize** the pattern: an sk-doc "Parent Skills with Nested Mode Packets" section, a `/create:parent-skill` scaffolder, a `/doctor:parent-skill` route (in the doctor `_routes.yaml` router), and a routing/discovery benchmark dogfooded through `deep-loop-workflows`'s own `skill-benchmark` mode.

This is a structure/routing-identity + documentation + tooling change; it preserves every mode's behavior and keeps the existing parity fixtures green.

---

## The routing/identity decision (A vs B vs C vs D)

| Model | What it is | Verdict |
| --- | --- | --- |
| **A — one identity + registry source of truth** | One hub `graph-metadata.json`; registry is the authoritative mode/routing description; drift closed by guard | **CHOSEN (15/15).** Preserves the keystone + the parity fixtures; closes the drift gap. |
| B — discoverable-nested | Each packet gets its own `graph-metadata.json` (`skill_id==folder`) → advisor ranks 5 skills | **Rejected.** Re-creates the five-ID brittleness the merge removed; changes the `skill` field → **breaks** `routing-parity-deep-*.vitest.ts`; forces `ai-council` `skill_id` to equal its folder. |
| C — derived-mode-hints (status quo) | Hardcoded maps, no registry consumption, no guard | **Rejected as-is** — this *is* the drift gap. |
| **C-plus — hardcoded maps + drift-guard test** | C, plus a CI test asserting maps == registry | **CHOSEN as the *mechanism* for A.** The adversarial pass (iter-013) showed runtime-derive "buys nothing but hot-path I/O and coupling"; C-plus gives the same guarantee at lower risk. |
| D — hybrid discoverable/derived | Partial discoverable sub-surface | Rejected — no benefit over A; reintroduces B's discovery hazards partially. |

**A with the C-plus mechanism** is the synthesis: A is the *architecture* (one identity, registry as truth); C-plus is the *enforcement* (test-time, not runtime).

---

## Per-decision resolutions (the six tensions)

1. **Registry shape — add `advisorRouting`, don't derive from `aliases[]`.** Host-verified: registry `aliases[]` are NL phrases and omit the advisor's system-ID aliases (`spec_kit:deep-review`, `command-spec-kit-deep-review`, `sk-deep-review`). A naive derive would drop them → routing regression. Add explicit `advisorRouting.legacyAliases`. (iter-002/011/012/013/015; evidence `aliases.ts:13-25` vs `mode-registry.json` modes.)
2. **Three cardinalities are DATA, not drift.** `routingClass` makes the split explicit: `lexical` = research/review/ai-council (the Python 3); `alias-fold` = +deep-improvement→agent-improvement (extends to the TS 4); `metadata` = context (resolved by membership, no lexical entry); `command-bridge` = the four improvement lanes. (`skill_advisor.py:2307/2320`, `aliases.ts:96`.)
3. **deep-improvement = one packet, four modes → `advisorDefaultMode`.** Mark `agent-improvement` with `advisorDefaultMode: true`; the TS `deep-improvement→agent-improvement` fold derives from the flag, never array order. (iter-009/011/015.)
4. **Lexical weights stay in Python.** Moving the weighted regex to JSON risks escaping corruption against exact thresholds; TS holds no lexical copy, so there is no divergence to cure. Registry guards the *set*, not the weights. (iter-013 refutation `held=False` on "registry can losslessly absorb scoring".)
5. **Fixtures — don't widen the 3-mode contract.** Keep `--deep-skill-routing-json` at research/review/ai-council. Add a registry-coverage/drift-guard fixture + command-bridge + context routing-class fixtures. (iter-006/012/015.)
6. **ai-council — grandfather the instance, standardize folder==name.** Keep `ai-council/` here (folder is not advisor-load-bearing under one-identity) and record it in the registry via `packetSkillName: "deep-ai-council"`. But the *reusable standard* requires `folder == packetSkillName == deep-<mode>` so the pattern never codifies a one-accident-from-breaking exception (iter-014's point reconciled with iter-011/012/013/015's "grandfather, don't rename").

---

## The two Phase-1 corrections (surfaced by this research)

- **Correction #1 — stale bare packet paths (DONE this session).** Phase-1's broken-ref verification only checked the `deep-loop-workflows/…`-anchored form, so *bare-relative* packet paths went unverified. Seven genuine stragglers fixed: hub `SKILL.md` (the layout tree + the `improvement/scripts/…loop-host.cjs` ref + the `Mode packets:` list), `README.md` (×2), `mode-registry.json` description, and the hub `graph-metadata.json` `source_docs` (4 entries). Scan now clean; both JSON files valid.
- **Correction #2 — amend Phase-1 ADR-001 (TO APPLY).** ADR-001 gave two reasons to keep `shared/` in workflows; one is false. `deep-loop-runtime` already depends on `system-spec-kit` (host-verified: `artifact-root.cjs:18` re-exports a system-spec-kit path helper; runtime `graph-metadata.json` declares the `depends_on` edge; zod/better-sqlite3 imports). "Frozen" means **MCP-free**, not system-spec-kit-free. Strike the "would create a dependency / frozen-boundary" reason; keep **only** the execution-vs-synthesis reason (which the adversarial pass confirmed sufficient: runtime/lib is execution-only, zero renderers, zero dedup gain from moving `emitResourceMap`).

---

## Phase 3 plan (implement the chosen model) — research-gated, now unblocked

1. Add the per-mode `advisorRouting` block to `mode-registry.json` (all 8 modes): `routingClass`, `advisorDefaultMode` (on `agent-improvement`), `legacyAliases` (carry the system-ID aliases), `packetSkillName`.
2. Add a **drift-guard test** (`tests/`): load `mode-registry.json`, project the expected `{skill,mode}` map + lexical SET, assert it equals the Python `DEEP_ROUTING_MODE_BY_KEY` and the TS `DEEP_MODE_BY_CANONICAL`. Fail on any divergence.
3. Leave `DEEP_ROUTING_LEXICAL_PATTERNS` and the advisor runtime UNCHANGED (no registry load at import). Keep the existing 9 parity invariants green.
4. Add the registry-coverage + command-bridge + context routing-class fixtures.
5. Re-run `skill_graph_scan` (one identity) + the full routing-parity suite.

## Phase 4 plan (formalize) — all three deliverables

- **sk-doc:** new section "Parent Skills with Nested Mode Packets" in `sk-doc/references/skill_creation.md` (anatomy: hub `SKILL.md` + `mode-registry.json` + ONE hub `graph-metadata.json` + N packets + non-discoverable `shared/`; the registry+`advisorRouting` contract; ALWAYS/NEVER rules; `deep-loop-workflows` as the canonical example) + `sk-doc/assets/skill/parent_skill_hub_template.md` + `parent_skill_registry_template.json`.
- **`/create:parent-skill`** scaffolder (router `.opencode/commands/create/parent-skill.md` + `assets/`): generates the hub + registry (with `advisorRouting`) + N packet skeletons (folder == packetSkillName == `deep-<mode>`) + non-discoverable `shared/` + exactly one hub `graph-metadata.json`.
- **`/doctor:parent-skill`** as a route in the doctor `_routes.yaml` router. Invariants: exactly one hub `graph-metadata.json` (`skill_id==folder`, `family∈ALLOWED_FAMILIES`); NO per-packet `graph-metadata.json`; registry keys == packet folder names; every mode has a packet dir + the 3-tier discriminator + an `advisorRouting` entry; the drift-guard (maps == registry) passes.
- **Benchmark:** routing/discovery effectiveness (per-mode routing precision; discovery node count == 1; drift = registry-vs-maps), run *through* `deep-loop-workflows`'s `skill-benchmark` mode (dogfood), before/after the Phase-3 change.

---

## The reusable pattern (what gets standardized)

**"A parent skill that routes to nested sub-skills"** =
- A thin **hub `SKILL.md`** (routing only, no per-mode logic).
- A declarative **`mode-registry.json`**: the 3-tier discriminator (`workflowMode` / `runtimeLoopType` / `backendKind`) + the `advisorRouting` block. The single source of truth; routers/tests read it, none re-derive it.
- **Exactly one `graph-metadata.json`** (the hub's) — the one hard invariant. (All nested dirs are advisor-invisible; "non-discoverable `shared/`" is *incidental*, a consequence of nesting, not a special mechanism.)
- **N mode packets**, each verbatim self-contained, `folder == packetSkillName`, with **no** `graph-metadata.json`.
- A non-discoverable **`shared/`** for packet-shared workflow-layer helpers (synthesis, not execution primitives — those belong in the backend).
- **ALWAYS:** resolve modes through the registry; keep per-mode contracts in packets; keep one identity; enforce maps==registry with a drift-guard test.
- **NEVER:** add a `graph-metadata.json` inside a packet/`shared/`; infer `runtimeLoopType` from `workflowMode`; move synthesis into the execution backend; widen the behavior-parity contract to chase coverage.

---

## Risk register

| Risk | Mitigation |
| --- | --- |
| Registry `advisorRouting` omits a live alias → routing regresses | Seed `legacyAliases` from the *current* hardcoded sets; the drift-guard test fails until they match. |
| Drift-guard test asserts the wrong direction (registry follows code, not code follows registry) | Test treats the registry as authoritative; a map change without a registry change fails CI. |
| Someone "simplifies" by moving lexical weights into JSON | sk-doc NEVER rule + the coverage fixture (regex thresholds) guards it. |
| Future packet adds a `graph-metadata.json` (B-style drift) | `/doctor:parent-skill` + `skill_graph_scan` catch the extra identity. |
| ai-council rename pressure | Grandfathered via `packetSkillName`; standard requires folder==name for *new* parent skills only. |

## Adversarial verification (round 2, by the opus seats + host)

- **"Derive both layers at runtime is the right mechanism"** → refuted (iter-013, `held=False`); C-plus chosen. Host-verified the existing `json.load` is advisor-local, so runtime-derive *would* be novel cross-skill coupling.
- **"Registry can losslessly absorb the lexical scoring"** → refuted (iter-013, `held=False`); weights stay in Python.
- **"Moving shared/ would create a system-spec-kit dependency"** → refuted (iter-014, `held=False`); host-verified `artifact-root.cjs:18` + runtime `depends_on` edge. Decision stands on the semantic axis; ADR-001 amended.
- **"ai-council mismatch is harmless because folder is not load-bearing"** → refuted *for the standard* (iter-014, `held=False`): true only because the packet is non-discoverable; the reusable standard must require folder==name. Reconciled: grandfather the instance, standardize the rule.

## Open items / Blockers

- **Apply Correction #2** (amend ADR-001 in `001-rename-fix-and-shared-decision/decision-record.md` + impl-summary + parent spec).
- **Exact `advisorRouting` JSON schema** is specified above; the per-mode `legacyAliases` values must be transcribed from the live `RAW_ALIAS_GROUPS` + `DEEP_ROUTING_LEXICAL_PATTERNS` during Phase 3 (mechanical).
- **`/doctor` route style** — `_routes.yaml` route vs standalone colon command — resolve at Phase 4 against the live router manifest (lean: a `_routes.yaml` route, matching the existing doctor surface).
