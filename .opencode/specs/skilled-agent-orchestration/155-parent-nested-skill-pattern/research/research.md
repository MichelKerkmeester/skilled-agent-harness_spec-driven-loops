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
<!-- /ANCHOR: references -->
<!-- /ANCHOR: references-end -->