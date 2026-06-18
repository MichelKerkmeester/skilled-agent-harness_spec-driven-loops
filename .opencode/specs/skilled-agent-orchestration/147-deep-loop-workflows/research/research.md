# Research: Merge 5 Deep-Loop Workflow Skills into `deep-loop-workflows`

<!-- ANCHOR:references -->
**Spec:** `.opencode/specs/skilled-agent-orchestration/147-deep-loop-workflows/`
**Iterations:** `research/iterations/iteration-001.md` … `iteration-015.md` (15 GPT-5.5 xhigh passes)
**Digest:** `/tmp/dlw-research/findings-digest.json`
**Verified ground truth (host-confirmed this session):** council + improvement `graph-metadata.json:4` both carry `"family": "sk-util"`; `convergence.cjs:310-312` validates exactly `research|review|council|context`; `loop-host.cjs:45` `VALID_MODES = {agent-improvement, model-benchmark, skill-benchmark, non-dev-ai-system-refine}`; two graph DBs at `deep-loop-runtime/database/{deep-loop-graph.sqlite, council-graph.sqlite}`; 10 runtime `.ts` modules under `deep-loop-runtime/lib/deep-loop/`; advisor scorer aliases at `system-skill-advisor/mcp_server/lib/scorer/aliases.ts`.
<!-- ANCHOR:references-end -->

---

## Executive Recommendation

Collapse the five public deep-loop skills (`deep-research`, `deep-review`, `deep-context`, `deep-ai-council`, `deep-improvement`) into **one** public skill, `deep-loop-workflows`, structured as a thin authoritative hub `SKILL.md` plus a **mandatory, declarative `mode-registry.json`** plus five verbatim mode packets under `deep-loop-workflows/{context,research,review,ai-council,improvement}/`. `deep-loop-runtime` stays the frozen, MCP-free backend; nothing public moves into it except the small, named promotions in §4. Routing is governed by a **three-tier discriminator** — `workflowMode` (all modes), `runtimeLoopType` (graph-backed modes only, explicit `null` for improvement, **never inferred** from `workflowMode`), and `backendKind` — sourced exclusively from the registry so no router re-derives the mapping. All five agent names and all eight `/deep:*` commands are preserved; only paths are repointed. Execution proceeds across **9 phases, each parity-gated**, deleting old skill directories LAST. Three verifier amendments are folded in and are load-bearing: (A) the `mode-registry.json` is now a **Phase-3 build artifact**, not a proposal, with an explicit nested-`SKILL.md`-discovery test as a Phase-0 gate; (B) **Phase 6 must correct the `deep-ai-council` and `deep-improvement` advisor family from `sk-util` to `deep-loop` BEFORE removing any old skill IDs from the graph**, and the Python↔TypeScript routing contract (`{skill, mode}` shape) must be designed before Phase 4; (C) "verbatim subtree move" is documented as a **multi-segment path rewrite** (e.g. `deep-review/references/protocol/loop_protocol.md` → `deep-loop-workflows/review/references/protocol/loop_protocol.md`), not a single-segment rename, across ~16 feature-catalog/spec-kit files and the command YAML. Lane C (skill-benchmark) is a first-class mode and Lane D (non-dev-ai-system-refine) stays an adapter-backed public mode with **no Barter contract-version bump** required.

---

## Target Architecture

### Two-skill split

| Skill | Role | Public surface | Mutability |
| --- | --- | --- | --- |
| **`deep-loop-workflows`** (NEW, v1.0.0) | Public hub + 5 mode packets | Commands, agents, advisor, governance | Active development target |
| **`deep-loop-runtime`** (FROZEN) | MCP-free backend: executor, prompt-pack, validation, atomic state, coverage-graph, Bayesian scoring, fallback routing | None public; consumed by workflows | Frozen except the §4 promotions |

### Hub + mandatory mode registry + 5 mode packets

```
.opencode/skills/deep-loop-workflows/
  SKILL.md                 # thin authoritative hub: routes by mode, no per-mode logic
  mode-registry.json       # MANDATORY single source of truth (built Phase 3)
  context/                 # verbatim from deep-context
  research/                # verbatim from deep-research
  review/                  # verbatim from deep-review
  ai-council/              # verbatim from deep-ai-council
  improvement/             # verbatim from deep-improvement (Lanes A/B/C/D)
```

The registry is the declarative contract that all routers (advisor, commands, hub) read. Per the high-confidence verdict on the discriminator, the registry — **not** ad-hoc router logic — enforces the three-tier mapping. `loop-host.cjs:145-174` already proves the registry/dispatcher seam (`resolveMode` → `planInvocation`) is established repo precedent, not speculation.

### Three-tier discriminator

| Tier | Definition | Domain | Carried by which modes |
| --- | --- | --- | --- |
| **`workflowMode`** | Public command/advisor/mode key. The stable identity used in commands, advisor aliases, and the registry key. | All 5 mode families (and the 4 improvement sub-lanes) | **ALL** modes: `context`, `research`, `review`, `ai-council`, plus improvement sub-lanes `agent-improvement`, `model-benchmark`, `skill-benchmark`, `non-dev-ai-system-refine` |
| **`runtimeLoopType`** | The graph-backed convergence loop key consumed by `convergence.cjs`. Validated against exactly `research\|review\|council\|context` (`convergence.cjs:310-312`). **Explicit `null` for improvement modes; never inferred from `workflowMode`.** | Graph-backed only | `context`, `research`, `review`, `ai-council` (→`council`). **`null`** for all 4 improvement sub-lanes. |
| **`backendKind`** | Which backend actually runs the mode: distinguishes a runtime convergence loop from the improvement host from the external adapter. | All modes | `runtime-loop-type` (context/research/review/council); `improvement-host` (agent-improvement, model-benchmark, skill-benchmark via `loop-host.cjs`); `external-adapter` (non-dev-ai-system-refine / Lane D) |

The load-bearing `null`: a router does `if (registry[mode].runtimeLoopType !== null) callConvergence(...) else callLoopHost(...)`. Two tiers would force the `runtimeLoopType==workflowMode` inference to live somewhere implicit and leak. **No improvement `loopType` is ever added to runtime convergence** — the two validation domains (`convergence.cjs` 4 values vs `loop-host.cjs:45` 4 values) never overlap and must stay separate.

---

## Per-Decision Resolutions

| # | Research angle | Resolution | Confidence | Applied amendment (if any) |
| --- | --- | --- | --- | --- |
| 1 | One-skill merge vs keep-5 | **MERGE** into `deep-loop-workflows` with 5 mode packets | High | **AMEND:** add Phase-0 gate proving nested `SKILL.md` files are NOT discovered as separate advisor skills before any move |
| 2 | Mode registry optional vs mandatory | **MANDATORY** `mode-registry.json`, built in Phase 3, single source for workflowMode/aliases/packet path/permissions/command names/artifact roots/backendKind/runtimeLoopType | High | **AMEND:** elevate from "proposed" to a Phase-3 build artifact with completeness test |
| 3 | Three-tier discriminator over-engineered? | **SOUND** — not over-engineered; solves real inference-leak, implementable via mandatory registry, has `loop-host.cjs` precedent | High | None |
| 4 | `runtimeLoopType` nullable for improvement | **SOUND** — explicit `null`, never inferred; keeps the two validation domains separate | High | None |
| 5 | Keep all 5 agents + 8 commands | **KEEP** all 5 agent names + 8 commands; repoint paths only; `loop-host` stays improvement-only | High | None |
| 6 | Backend promotions into runtime | **SELECTIVE** (see §4): capabilities resolver, loop-lock CLI adapter, `resolveArtifactRoot`, `emitResourceMap`→shared synthesis, terminal journal taxonomy | High | None — explicitly do NOT add improvement loopType |
| 7 | Keep 4 `reduce-state` bodies per-mode | **KEEP per-mode**; import only shared plumbing | High | None |
| 8 | Lane C (skill-benchmark) status | **First-class mode**; benchmark-by-mode handles Lane C self-reference | High | None |
| 9 | Lane D (non-dev-ai-system) status | **Adapter-backed public mode**; external Python loop/kill-switches/scoring stay externally owned; **no Barter contract bump** | High | None — only SYNC.md:32 + optional `loop.py:94` comment update |
| 10 | Advisor collapse to one skill_id | **COLLAPSE** to `deep-loop-workflows` + mode-alias/discriminator layer; parity must assert BOTH skill AND concrete mode | High | **AMEND (D5):** design Python↔TS `{skill,mode}` contract first; extend Candidate-3 for `deep-context` (or document it stays metadata-routed); define `aliases.ts` restructuring schema; fix PHRASE_BOOSTS/CATEGORY_HINTS hardcoded IDs |
| 11 | Advisor family for council/improvement | **Correct `sk-util`→`deep-loop`** for both (host-confirmed `graph-metadata.json:4`) | High | **AMEND (Phase 6):** family correction MUST precede old-skill-ID removal from graph |
| 12 | Governance tree structure | **One unified tree partitioned by mode**; mode-qualify CP- collisions at index (don't renumber files); normalize council casing | High | None |
| 13 | Versioning & changelog | **`deep-loop-workflows` v1.0.0**; preserve per-mode changelog history; rewrite docs 5-skill→2-skill | High | None |
| 14 | 9-phase ordering | **SOUND** linear 001→009 serial chain, delete old dirs LAST, parity-gate per phase | High | **AMEND:** (1) Phase-6 family fix before ID removal; (2) define Phase-4/5 file-ownership boundary; (3) clarify Lane D Phase-1 baseline live vs dry-run |
| 15 | Path-rewrite blast radius | **Multi-segment rewrites** across ~16 spec-kit files + command YAML (host-confirmed: `grep -rl '.opencode/skills/deep-' system-spec-kit/` = 16 files; 12 command YAML carry `skill: deep-*`) | Medium | **AMEND:** replace "single-segment rename" language with multi-segment reality; treat as Phase-0/Phase-4 scoped rewrite, not a trivial move |

---

## Backend-vs-Mode Line

### Promoted INTO `deep-loop-runtime` (frozen-backend additions)

| Promotion | What it becomes | Why runtime |
| --- | --- | --- |
| **Runtime-capabilities resolver** | Parameterized resolver (was per-skill) | Shared capability probe used by all graph-backed modes |
| **`loop-lock` CLI adapter** | CLI front-door over `lib/deep-loop/loop-lock.ts` | Single locking contract; avoids per-mode lock drift |
| **`resolveArtifactRoot`** | Artifact-topology resolver | One canonical artifact-root computation across modes |
| **`emitResourceMap`** | Shared synthesis primitive (workflows-shared) | De-duplicates resource-map emission |
| **Terminal journal taxonomy** | Shared lifecycle contract: **6 `stopReason` + 4 `sessionOutcome`** hoisted into runtime | One canonical enum; the external Lane-D loop already maps onto it (`loop.py:94` comment) |

### STAYS per-mode in `deep-loop-workflows` (NOT promoted)

| Kept per-mode | Where | Why not promoted |
| --- | --- | --- |
| **4 `reduce-state` bodies** | `{context,research,review,ai-council}/scripts/` | Mode-specific convergence semantics; import only shared plumbing |
| **Mode convergence contracts** | each mode packet | Five distinct convergence definitions are the reason to keep packets verbatim |
| **`loop-host.cjs` improvement dispatch** | `improvement/scripts/shared/` | Improvement is host-driven, not a runtime loopType — **no improvement `loopType` added to convergence** |
| **External Lane-D loop / kill-switches / scoring** | Barter packaging (external) | Owned by external packaging; zero skill-path coupling (env/argv contract only) |
| **Lane A/B `_auto`/`_confirm` YAML; Lane C/D wrapper contracts** | command assets | C/D invoke loop-host via command markdown directly — **do NOT add YAML for symmetry** |

**Hard line:** runtime gains shared *plumbing and contracts*; it never gains a mode's *convergence body* and never gains an improvement `loopType`.

---

## Phase Decomposition

Each phase is a spec child `[NNN-name]/`. Serial chain 001→009. **Old directories deleted LAST (Phase 9 only).** Every phase must pass its parity gate before the next starts.

| Phase | Child slug | One-line scope | Depends on | Parity gate |
| --- | --- | --- | --- | --- |
| **1** | `001-parity-baseline-and-runtime-ownership-adr` | Capture byte-level baseline of all 5 modes' artifacts + commands + advisor outputs; author runtime-ownership ADR; **nested-`SKILL.md` discovery test**; **decide Lane D baseline = dry-run-only** (live packaging not required for baseline) | — | Baseline snapshot recorded for all 8 commands + 5 modes; nested-SKILL.md test proves no extra advisor nodes |
| **2** | `002-runtime-backend-promotions` | Promote capabilities resolver, loop-lock CLI adapter, `resolveArtifactRoot`, `emitResourceMap`, terminal journal taxonomy (6+4) into `deep-loop-runtime`; **no improvement loopType added** | 001 | Runtime unit/contract tests green; `convergence.cjs` still validates exactly 4 loopTypes; no behavior delta in existing modes |
| **3** | `003-merged-hub-and-mode-packets` | Build `deep-loop-workflows/` hub `SKILL.md` + **`mode-registry.json` (build artifact)** + 5 verbatim mode packets (multi-segment path rewrites inside each packet) | 002 | Registry completeness test (every mode has workflowMode/runtimeLoopType/backendKind); each packet's internal refs resolve; `validate.sh --strict` clean |
| **4** | `004-command-repoint` | Repoint all 8 `/deep:*` commands + command YAML assets (`skill: deep-*` → `skill: deep-loop-workflows`/mode) to new packet paths; **command YAML only** (no agent body edits); requires Python↔TS `{skill,mode}` contract finalized | 003 | All 8 commands resolve to new paths; YAML `skill:` keys updated; byte-identical command output vs Phase-1 baseline |
| **5** | `005-agent-mirror-repoint` | Repoint 5 agent markdown bodies across 3 runtime mirrors (`.opencode/agents/` + `.claude/` + `.codex/`); **agent bodies only** (path refs that are Phase-4-gated already done) | 004 | 3-way mirror parity (identical bodies); agent-name dispatch unchanged; all 5 agents resolve |
| **6** | `006-advisor-graph-mode-routing-collapse` | Collapse 5 advisor skill IDs → `deep-loop-workflows` + mode-alias layer; **FIRST correct council+improvement family `sk-util`→`deep-loop`, THEN remove old IDs**; extend Candidate-3 for `deep-context` (or document metadata-routed); fix `aliases.ts`, PHRASE_BOOSTS, CATEGORY_HINTS | 005 | Routing-parity asserts BOTH `deep-loop-workflows` AND concrete mode; `rejectedEdges=0`; UNKNOWN-TARGET grep empty; family field = `deep-loop` for all |
| **7** | `007-governance-consolidation` | One unified governance tree partitioned by mode; mode-qualify CP- collisions at index (no file renumber); normalize council casing | 006 | Governance counts reconcile (pre vs post); no orphaned CP- IDs; index resolves every mode partition |
| **8** | `008-framework-docs-sweep` | Rewrite all framework docs 5-skill→2-skill model; update feature-catalog (~16 spec-kit files), SYNC.md:32, optional `loop.py:94` comment; preserve per-mode changelog history; stamp v1.0.0 | 007 | Zero stale `deep-{research,review,context,ai-council,improvement}` path refs (grep); changelog history intact; **no Barter contract-version bump** |
| **9** | `009-old-skill-deletion-and-full-surface-validation` | Delete 5 old skill directories; full-surface validation (all gates §6) | 008 | All Acceptance Gates pass; old dirs gone; full byte-identical parity across all 5 modes + 8 commands |

---

## Acceptance Gates (release-blocking)

- [ ] **Byte-identical parity per mode** — each of the 5 modes produces artifacts byte-identical to the Phase-1 baseline (Lane D compared on dry-run baseline, per Phase-1 decision).
- [ ] **Advisor mode+skill assertion** — routing-parity fixtures assert BOTH `deep-loop-workflows` AND the concrete mode; flat alias equality is explicitly insufficient.
- [ ] **`rejectedEdges = 0`** in the advisor skill graph after collapse.
- [ ] **Phase-0 grep clean** — no UNKNOWN-TARGET edges; no stale `deep-{research,review,context,ai-council,improvement}` skill-path references anywhere (`grep -rl '.opencode/skills/deep-{research,review,context,ai-council,improvement}/'` → empty, excluding `deep-loop-runtime`/`deep-loop-workflows`).
- [ ] **3-way mirror parity** — agent bodies identical across `.opencode/agents/`, `.claude/`, `.codex/`.
- [ ] **Governance counts reconcile** — pre/post CP- and mode-partition counts match; no file renumbering; council casing normalized.
- [ ] **`validate.sh --strict`** — `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` exit 0 on the spec folder and each phase child.
- [ ] **`/doctor` council-graph coverage** — `/doctor deep-loop` covers BOTH `deep-loop-graph.sqlite` AND `council-graph.sqlite` (see Blockers).
- [ ] **Registry completeness** — every mode in `mode-registry.json` carries non-ambiguous `workflowMode` + (`runtimeLoopType` value or explicit `null`) + `backendKind`.
- [ ] **Advisor family field** — `deep-ai-council` + `deep-improvement` (now folded modes) resolve under family `deep-loop`, not `sk-util`.
- [ ] **`convergence.cjs` invariant** — still validates exactly `research|review|council|context`; no improvement loopType present.

---

## Risk Register

Ranked severity × likelihood. **Rollback is per-strata (per-phase child), never whole-tree** — each phase is independently revertible because old dirs survive until Phase 9.

| # | Risk | Sev × Lik | Detection signal | Rollback (by strata) |
| --- | --- | --- | --- | --- |
| **R1** | **Nested `SKILL.md` discovered as separate advisor skills** — defeats consolidation (iteration-001:209 unresolved) | High × Med | Phase-0 discovery test shows >1 rankable node per packet; `skill_graph_scan` lists `deep-loop-workflows/research` etc. as skills | Abort at Phase 0; redesign packet layout (e.g. rename inner `SKILL.md` or registry-gated discovery) before any move — no dirs touched yet |
| **R2** | **Advisor routing breaks** — old IDs removed before family fix / before `{skill,mode}` contract finalized (D5 + Phase-6 amendments) | High × Med | `rejectedEdges>0`; routing-parity vitest cast failure; `winner` = nonexistent node | Revert Phase-6 child only; old skill IDs still present in graph until this phase commits |
| **R3** | **Multi-segment path-rewrite misses references** — understated as "single-segment rename" (verifier FLAW 1) | High × Med | Phase-8 grep finds residual `deep-*` paths; command/feature-catalog refs 404 | Revert Phase-4/Phase-8 child; baseline command output diff flags the break |
| **R4** | **`runtimeLoopType` inferred from `workflowMode`** — a router hardcodes the mapping, bypassing registry | High × Low | Improvement mode triggers a `convergence.cjs` call; `convergence.cjs` throws "loopType must be …" | Revert offending router change; registry-read is the single enforced path |
| **R5** | **3-way mirror drift** — one runtime mirror not repointed (silent native-seat failure) | Med × Med | Mirror-parity check diff; a runtime's agent dispatch yields empty/old path | Revert Phase-5 child; canonical `.opencode/agents/` body is source of truth |
| **R6** | **Lane D Barter coupling assumed broken** — needless contract bump | Med × Low | Reviewer flags SYNC.md/`loop.py` as "code dependency" (it is comment-only) | No rollback needed; documented as doc-only update — do NOT bump contract |
| **R7** | **Governance CP- collisions mishandled** — files renumbered instead of index-qualified | Med × Low | Governance count mismatch; broken CP- cross-refs | Revert Phase-7 child; mode-qualify at index only |
| **R8** | **`/doctor council-graph` coverage gap persists** — council mode unmonitored post-merge | Med × Med | `/doctor deep-loop` output omits `council-graph.sqlite` health | Ship doctor coverage fix (Blocker B1) within the epic; gate-blocks Phase 9 |

---

## Open Items / Blockers

- **B1 — `/doctor deep-loop` council-graph coverage gap (KNOWN BLOCKER).** `/doctor deep-loop` currently covers ONLY `deep-loop-graph.sqlite` (research/review), not `council-graph.sqlite`. Both DBs are host-confirmed present at `deep-loop-runtime/database/`. The council mode would merge with no doctor coverage. **Action:** extend the `/doctor` deep-loop route to probe `council-graph.sqlite`; this is an Acceptance Gate and must land before Phase 9.
- **B2 — Python↔TypeScript advisor contract undesigned (verifier D5).** Decide whether `RoutingResult` gains an explicit `mode` field (preferred) or derives mode from the winner string post-cast. **Must be finalized before Phase 4** so command repoint and fixture changes can be planned concretely. Affects `routing-parity-deep-skills.vitest.ts:20-23` and `skill_advisor.py:2307`.
- **B3 — `deep-context` Candidate-3 asymmetry (verifier D5).** `deep-context` is absent from `aliases.ts` (host-confirmed at `mcp_server/lib/scorer/aliases.ts`), the Python `DEEP_ROUTING_SKILLS` tuple, and the vitest `RoutingResult` type; it routes metadata-only today. **Decide in Phase 6:** either extend `DEEP_ROUTING_LEXICAL_PATTERNS`/`DEEP_ROUTING_STRUCTURAL_PATTERNS` (`skill_advisor.py` ~2317-2370) for context, OR explicitly document context stays metadata-routed and is NOT a Candidate-3 mode.
- **B4 — `mode-registry.json` does not yet exist (verifier FLAW 2).** The registry is mandatory but unbuilt. It is now a Phase-3 build artifact with a completeness test, not a proposal.
- **B5 — Nested-`SKILL.md` discoverability unproven (verifier FLAW 3 / iteration-001:209).** Resolve with a Phase-0 test before ANY directory move. If the advisor's scanner globs `**/SKILL.md`, the packet layout or discovery gating must change first.
- **B6 — `aliases.ts` restructuring schema undefined (verifier D5).** Choose flat two-level skill→mode map vs nested `{skill_id:{modes:[…]}}`; this determines how `PHRASE_BOOSTS` (`explicit.ts`) and `CATEGORY_HINTS` (`lexical.ts`) target the new structure. Include a test that the native-scorer `SKILL_ALIAS_GROUPS` assertion still passes after restructuring.
- **B7 — Family-correction ordering (verifier Phase-6 amendment).** `deep-ai-council` + `deep-improvement` are host-confirmed `"family": "sk-util"` (`graph-metadata.json:4`). Phase 6 MUST correct both to `deep-loop` BEFORE removing old skill IDs from the graph, or routing fails closed mid-migration.
- **B8 — Lane D baseline mode (verifier Phase-1 amendment).** Phase 1 captures Lane D parity as **dry-run-only** (live external packaging execution NOT required for baseline); Phase 9 acceptance compares Lane D on the same dry-run basis to avoid an asymmetric baseline.
