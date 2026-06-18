# Iteration 015 — META-SYNTHESIS: final recommendation + benchmark plan + risks

- **Model**: opus-4.8 (claude2/account2, read-only)
- **Seat**: 015
- **model_pick**: A

## Analysis

All claims verified against source. The committed **ADR-001** (`001-rename-fix-and-shared-decision/decision-record.md:52,63`) does rest its load-bearing rationale on a *false* premise — "moving it would create a runtime→system-spec-kit dependency" — when that dependency already exists (executor-config.ts:3, artifact-root.cjs:17-18). But line 71 already carries the correct *semantic* argument. I now have everything to synthesize.

---

# SEAT 015/15 — META-SYNTHESIS: Final Converged Recommendation (packet 155)

**Verdict:** Adopt **Model A** (one discoverable hub identity; both advisor layers derive their *mode projections* from `mode-registry.json`) — with two refinements where the stage-1 consensus over-reaches, and two Phase-1 corrections, one of which is **already substantially applied**. The design is sound and the parity fixtures stay green if and only if we (a) add an explicit per-mode `advisorRouting` block rather than naively reading `aliases`, and (b) do **not** widen the existing `--deep-skill-routing-json` contract.

Everything below is verified against the real code, not the digest.

---

## 1. Routing / Identity Model — **A, LOCKED**, with the registry shape decided

**Endorse A unconditionally.** The keystone is real and load-bearing: `discoverGraphMetadataFiles` (skill-graph-db.ts:601) walks the tree but only collects files literally named `graph-metadata.json` (:619, `SKILL_METADATA_FILENAME` :129) — nested `SKILL.md` is invisible. `isSkillGraphMetadata` trips on `skill_id` **OR** `family` **OR** `edges` (:644-646), so any packet that dropped a `graph-metadata.json` with even a `family` field would register as a *second* skill, and `parseSkillMetadata` would then throw unless `skill_id===folder` (:656) and `family∈{cli,mcp,sk-code,deep-loop,sk-util,system}` (:661). Confirmed: only the hub carries one (`find` returns exactly `deep-loop-workflows/graph-metadata.json`). **Option B (discoverable nested packets) directly fights db.ts:619 and would make the advisor rank 5 skills, breaking the 9 parity invariants.** A is the only model consistent with the keystone.

**The registry-shape decision (tension #1) — ADD an explicit `advisorRouting` block; do NOT derive from the current `aliases` arrays.** A naive loader that reads `registry[mode].aliases` *regresses routing*: the registry's research aliases (mode-registry.json:29) contain `"deep-research"`, `"research loop"`, `"autoresearch"`… but **not** the router-critical legacy ids that aliases.ts hardcodes — `command-spec-kit-deep-research`, `/deep:start-research-loop`, `spec_kit:deep-research`, `sk-deep-research` (aliases.ts:13-19). Those four are *load-bearing* router keys; the registry `aliases` are NL discovery phrases. Conflating them drops real routes.

**Locked registry extension** (purely additive — no existing field changes, so parity output shape is untouched):

```jsonc
"advisorRouting": {
  "routingClass": "lexical" | "metadata" | "command-bridge",
  "legacyAdvisorId": "deep-research",          // the id Python/TS key off; omit for context
  "legacyAliases": ["command-spec-kit-deep-research", "/deep:start-research-loop",
                    "spec_kit:deep-research", "sk-deep-research"],
  "foldsLegacyId": true,                        // does the legacy id project to merged skill?
  "advisorDefaultMode": false,                  // true only on agent-improvement
  "packetSkillName": "deep-ai-council"          // only when folder != SKILL.md name
}
```

**Per-mode `routingClass` (resolves tension #2 — the three cardinalities):**

| Mode | routingClass | legacyAdvisorId | folds? | In Python set (3) | In TS set (4) |
|---|---|---|---|---|---|
| context | `metadata` | — | — | no (intentional) | no (intentional) |
| research | `lexical` | deep-research | yes | ✓ | ✓ |
| review | `lexical` | deep-review | yes | ✓ | ✓ |
| ai-council | `lexical` | deep-ai-council | yes | ✓ | ✓ |
| agent-improvement | `command-bridge` | deep-improvement | yes | no | ✓ |
| model-benchmark | `command-bridge` | deep-model-benchmark | no | no | no |
| skill-benchmark | `command-bridge` | — | no | no | no |
| ai-system-improvement | `command-bridge` | — | no | no | no |

This is *exactly* what the code does today and explains the 3-vs-4 mismatch as **data, not drift**: Python's `DEEP_ROUTING_SKILLS` (skill_advisor.py:2307) = the 3 `lexical` modes; TS's `DEEP_MODE_BY_CANONICAL` (aliases.ts:96-101) = `lexical` ∪ `{agent-improvement}` (the one `command-bridge` mode with `foldsLegacyId:true`). context is the lone `metadata` mode (skill_advisor.py:2316-2318; aliases.ts:86-89).

**Derivation contract (the actual lock):**
- Python `DEEP_ROUTING_MODE_BY_KEY` / `DEEP_ROUTING_SKILLS` ← `{m.legacyAdvisorId → m.workflowMode : routingClass=='lexical'}`.
- TS `DEEP_MODE_BY_CANONICAL` ← `{m.legacyAdvisorId → m.workflowMode : legacyAdvisorId present AND (routingClass=='lexical' OR foldsLegacyId)}`.
- TS deep-* `RAW_ALIAS_GROUPS` strings ← `m.advisorRouting.legacyAliases` (non-deep groups like `create:agent`, `memory:save` stay literal in aliases.ts).
- `canonicalSkillId` (aliases.ts:59) stays **unchanged** — only the second projection (`modeForAlias`/`mergedSkillForAlias`, aliases.ts:119-130) becomes registry-fed.

**Tension #3 (deep-improvement → 4 modes) — `advisorDefaultMode:true` on the `agent-improvement` entry, never array order.** Today TS hardcodes the Lane-A default (aliases.ts:100, comment :92-95). Make it explicit registry data so a future reorder can't silently change the default.

**REFINEMENT vs stage-1 on tension #5 (lexical weights): KEEP the weighted regex in Python code; do NOT move it to JSON.** The 10 seats said "derive projections from the registry" — correct for the *mode-key maps*. But `DEEP_ROUTING_LEXICAL_PATTERNS` (skill_advisor.py:2326) and `DEEP_ROUTING_STRUCTURAL_PATTERNS` (:2347) are multi-line weighted regex with capture groups and lookarounds; JSON is a hostile host (escaping, no comments, no test ergonomics), and **TS never consumes them** (the parity test shells out to Python — aliases.ts has no lexical scorer). The registry should govern the *set* (`routingClass=='lexical'`) via a coverage fixture, not the *weights*. This keeps tuning where it's testable while still making the registry authoritative over which modes are lexically scored.

---

## 2. Naming / Discovery Convention — incl. the **ai-council ruling**

**Convention (for the reusable pattern):**
- Exactly **one** `graph-metadata.json`, at the hub, with `skill_id===folder` and `family∈ALLOWED_FAMILIES` (enforced by db.ts:656, :661).
- **No** `graph-metadata.json` and **no** other discoverable skill marker inside any packet or `shared/` (db.ts:619 keystone).
- Packet dir **SHOULD** equal the packet's `SKILL.md` `name:` field.

**ai-council ruling — KEEP the folder name; represent the asymmetry as registry data; do NOT rename.** ai-council is the only packet where folder (`ai-council`) ≠ `SKILL.md name` (`deep-ai-council`, ai-council/SKILL.md:2); the other four match (deep-context/-research/-review/-improvement). Under one identity, **folder names are not advisor-load-bearing** (db.ts:619 keys on the filename `graph-metadata.json`, never the folder; the folder-name check at :656 applies only to the hub's single file). Renaming would churn the verbatim packet, the `ai-council` agent, the `/deep:ai-council` command, and 5 alias references (aliases.ts:39-47) for **zero** routing benefit. Ruling: add `advisorRouting.packetSkillName:"deep-ai-council"` to the ai-council registry entry so the exception is explicit, greppable data — and document "dir SHOULD == name; when it doesn't, the registry MUST carry `packetSkillName`" as the generalized rule. `/create:parent-skill` defaults dir==name so new parents never inherit the exception.

Keep the registry's two alias concepts **distinct**: top-level `aliases[]` = NL trigger/discovery phrases (feed `graph-metadata.json.derived.trigger_phrases`); `advisorRouting.legacyAliases[]` = exact router keys (load-bearing). Do not conflate them.

---

## 3. Per-Mode Contract Preservation Rule

**Rule:** the hub routes; it never flattens. Each packet keeps its own convergence math, state shape, artifacts, and **tool-permission guards** (SKILL.md:52). The three-tier discriminator is the firewall:
- `runtimeLoopType` is validated against exactly `research|review|council|context` and is **explicit `null`** for all four improvement lanes (mode-registry.json:7; SKILL.md:84) — never inferred from `workflowMode`.
- `backendKind` selects the executor: `runtime-loop-type` → `convergence.cjs --loop-type`; `improvement-host` → `loop-host.cjs --mode`; `external-adapter` → external packaging (mode-registry.json:8).
- The mutation boundary is a hard guard: read-only modes (context/research/review/ai-council) must never reach `promote-candidate.cjs`/`rollback-candidate.cjs` (SKILL.md:85). Only the improvement family is `mutating:true` (mode-registry.json:60).

A `/doctor:parent-skill` assertion must verify every `runtimeLoopType` is either in the validated set or explicit `null`, and that no improvement lane has acquired a non-null loop type (the runtime must never gain an `improvement` loopType — SKILL.md:83).

---

## 4. shared/ + Backend-Boundary Rule — **CORRECTION #1 applied**

**Decision (unchanged): `shared/synthesis/` stays in deep-loop-workflows.** `resource-map.cjs` (verified at `shared/synthesis/resource-map.cjs`, consumed by deep-research/deep-review) is **workflow-output synthesis** — assembling a resource map from research output — not a runtime execution primitive.

**Rationale (CORRECTED): the decision rests ONLY on the semantic argument.** The committed ADR-001 (decision-record.md:52, :63) justifies it by claiming the runtime "deliberately carries no dependency on system-spec-kit" and that moving `shared/` "would create a runtime→system-spec-kit dependency." **That premise is false.** The runtime already depends on system-spec-kit by design:
- `executor-config.ts:3` and `prompt-pack.ts:4` import `zod` from `system-spec-kit/mcp_server/node_modules`;
- `coverage-graph-db.ts:3` and `council-graph-db.ts:6` import `better-sqlite3` from the same;
- `artifact-root.cjs:17-18` `require()`s `system-spec-kit/shared/review-research-paths.cjs`;
- the runtime's own `graph-metadata.json` declares `depends_on: system-spec-kit` (:11, :55).

So **"frozen" = MCP-free, not system-spec-kit-free.** The correct, sufficient distinction is *semantic role*: `artifact-root.cjs` is an **execution primitive** and correctly lives in the runtime (as a thin re-export); `emitResourceMap` is **output synthesis** and correctly lives in workflows. Notably, ADR-001:71 *already states this* as a secondary "semantic note." **The amendment is purely about which rationale is load-bearing — promote :71 to primary, strike the dependency claim at :52/:63 — the decision itself does not change.** This is a Logic-Sync amendment, not a re-decision (per the constitutional Logic-Sync Protocol).

**Generalized boundary rule:** runtime = loop *execution* primitives (MCP-free; may depend on system-spec-kit libs); workflows = personas + output *synthesis*. Co-locating synthesis with execution blurs the line "even if the dependency problem did not exist" (decision-record.md:71).

---

## 5. Standardization Deliverables

1. **sk-doc section — "Parent skill with nested mode packets":** the one-identity rule; the `mode-registry.json` schema (three-tier discriminator + `advisorRouting`); the **no-nested-`graph-metadata.json`** keystone (cite db.ts:619 behavior, not the code); the `dir==name` convention + `packetSkillName` exception; the runtime/workflows execution-vs-synthesis boundary.
2. **`/create:parent-skill` scaffolder:** emits hub `SKILL.md` + `mode-registry.json` (with `advisorRouting` stubs) + **one** hub `graph-metadata.json` (`skill_id==folder`, `family∈ALLOWED_FAMILIES`) + N packet stubs **without** per-packet `graph-metadata.json`; defaults packet dir == `SKILL.md name`; Gate-3 spec-folder discipline applies.
3. **`/doctor:parent-skill` validator (read-only route):** asserts (a) exactly one `graph-metadata.json` under the skill dir; (b) `skill_id==folder` & allowed `family`; (c) **no** nested `graph-metadata.json` in any packet/`shared/`; (d) every `registry[mode].packet` dir exists; (e) `packetSkillName` matches the packet `SKILL.md name` wherever folder≠name; (f) the **registry↔router derivation holds** (Python set == lexical modes; TS set == lexical∪folded); (g) every `runtimeLoopType` ∈ validated-set ∪ `{null}`.
4. **Benchmark (`/deep:skill-benchmark` lane):** assert the advisor ranks **exactly one** skill (`deep-loop-workflows`) for the trigger phrases of all 8 modes, and that each resolves to the correct `workflowMode` (research/review/ai-council via lexical; context via metadata; agent-improvement via command-bridge fold; the 3 pure command lanes via their `/deep:*`).

---

## 6. Phased Implementation Plan (packet-155 phase 3-4) — fixtures stay green

**Guiding invariant:** the parity contract `--deep-skill-routing-json` emits `{skill, mode∈research|review|ai-council, scores, winner}` with `DeepMode='research'|'review'|'ai-council'` (routing-parity-deep-skills.vitest.ts:27-37) across 9 invariants (:52-196). **Do not change its output shape.**

**Phase 1 (in `001-rename-fix-and-shared-decision` — see §8): apply the two corrections.** Mostly done; small residual.

**Phase 3 — registry-driven routing (behavior-preserving):**
- **3a.** Extend `mode-registry.json` with per-mode `advisorRouting` blocks (§1). *Purely additive* → parity output unchanged → 9/9 green.
- **3b.** Python: load the registry at module init; derive `DEEP_ROUTING_SKILLS` + `DEEP_ROUTING_MODE_BY_KEY` from `routingClass=='lexical'` entries; **keep** the weighted-regex tables in code. Add an init-time assertion: the derived set == regex-table keys. Run parity → must remain 9/9 (same 3 modes, identical projection).
- **3c.** TS: derive `DEEP_MODE_BY_CANONICAL` and the deep-* `RAW_ALIAS_GROUPS` alias strings from `advisorRouting`; leave `canonicalSkillId` untouched. Run advisor TS suite → green.
- **3d.** Add a **separate** registry-coverage fixture (registry↔Python regex-set parity; registry↔TS projection parity — pure assertions, no shell-out) and a **separate** command-bridge routing test covering context (metadata path) + agent-improvement (folded). **Do not widen** `--deep-skill-routing-json`.

**Phase 4 — standardize:** ship the four deliverables in §5; run `/doctor:parent-skill` against `deep-loop-workflows` as the first conformance case; record the benchmark baseline.

**Sequencing rule:** 3a (data) → 3b/3c (derive, one side at a time, re-run parity after each) → 3d (lock with fixtures) → Phase 4. Never let 3b and 3c land together unverified — the registry-coverage fixture is the regression net that makes the existing 3-vs-4 split *intended* rather than accidental.

---

## 7. Risk Register

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Registry JSON fails to load at advisor init → routing dead | Low | High | Fail-loud + frozen in-code snapshot fallback; init-time schema assertion |
| R2 | Widening `--deep-skill-routing-json` to 8 modes breaks the 9 green invariants | Med (tempting) | High | **Don't** widen it; add separate coverage + command-bridge fixtures (§3d) |
| R3 | Only one of Python/TS derives → the 3-vs-4 drift goes unguarded | Med | Med | Registry-coverage fixture asserts **both** sides against the registry |
| R4 | Regex tuning pushed into JSON → brittle, untestable | Med | Med | Keep weights in Python; registry governs only the `lexical` set |
| R5 | A future packet drops a `graph-metadata.json` → advisor sees 2 skills, parity breaks (db.ts:619/:656) | Med | High | `/doctor:parent-skill` guard + a unit test asserting one metadata file |
| R6 | ai-council folder gets renamed → churns command/agent/5 aliases for zero benefit | Med | Med | `packetSkillName` documents the exception; convention says don't rename |
| R7 | ADR-001 amendment misread as reversing the shared/ decision | Low | Med | Amendment note: decision unchanged, only the rationale corrected (§4) |
| R8 | `artifactRoot` bare names (`research/`, `improvement/`, mode-registry.json:19/35/59) "fixed" as if stale | Low | Low | They are artifact **output** roots, not packet dirs — explicitly out of scope for the rename sweep |
| R9 | Registry `aliases[]` vs `advisorRouting.legacyAliases[]` conflated → dropped routes (tension #1) | Med | High | Keep the two distinct; only `legacyAliases` is load-bearing |

---

## 8. The Two Phase-1 Corrections

**CORRECTION #2 (rename sweep) — LARGELY ALREADY APPLIED; only a 1-line residual remains.** I disagree with the digest's framing here, with evidence: the cited targets are *already* repointed to the new names — SKILL.md:64 reads `deep-context/ deep-research/ deep-review/ ai-council/ deep-improvement/`; SKILL.md:97 lists `deep-context/SKILL.md … deep-improvement/SKILL.md`; README:24 uses `deep-context/ · deep-research/ · …`. (The last commit `c84b7477` "fix(155): repoint deep-loop-workflows packet rename" did this.) The **only** surviving stale reference is **SKILL.md:47** — "(the 4 improvement modes all share the **improvement/** packet)" — which should read **`deep-improvement/`** (the packet field is `deep-improvement`, mode-registry.json:55). Action: a one-token fix, not a sweep. Do **not** touch the `artifactRoot` bare names (R8).

**CORRECTION #1 (ADR-001 rationale) — amend the committed decision-record.** Strike the dependency-creation rationale at decision-record.md:52 and :63 (false — the runtime already imports zod/better-sqlite3 and re-exports `review-research-paths.cjs` from system-spec-kit; runtime `graph-metadata.json:11,55` declares the edge). Promote the semantic argument at :71 to the sole load-bearing rationale. State explicitly: **the decision (shared/ stays in workflows) is unchanged; only its justification is corrected.** Route as a Logic-Sync amendment.

---

### Where I diverge from the stage-1 consensus (with evidence)
1. **Endorse A fully** — no divergence on the model.
2. **Tension #5:** lexical *weights* stay in Python code (skill_advisor.py:2326/2347), not JSON; registry governs only the `lexical` set. TS never reads them (aliases.ts has no lexical scorer), so "Python↔TS must share one source" applies to the *projection maps*, not the regex.
3. **Tension #4:** do **not** widen `--deep-skill-routing-json` — that risks the 9 green invariants (the keystone). Add separate fixtures instead.
4. **CORRECTION #2 is mostly stale:** the digest says SKILL.md:64,97 + README:24 still carry old names; the working tree shows them already fixed. Real residual = SKILL.md:47 only.
5. **ai-council:** keep the folder; encode `packetSkillName` — folder names are not advisor-load-bearing under one identity (db.ts:619).

===RESEARCH-JSON===
{"angle":"meta-synthesis: registry-driven one-identity routing","verdict":"Adopt Model A with an explicit advisorRouting block in mode-registry.json driving both layers; keep lexical regex in Python and never widen the 3-mode parity contract; ship two Phase-1 corrections (one already mostly applied).","model_pick":"A","decisions":[{"question":"Registry shape: derive from existing fields or add advisorRouting block","resolution":"Add explicit per-mode advisorRouting {routingClass,legacyAdvisorId,legacyAliases,foldsLegacyId,advisorDefaultMode,packetSkillName}; naive read of aliases[] drops load-bearing router keys","evidence":"mode-registry.json:29 vs aliases.ts:13-19"},{"question":"Three cardinalities (Python 3 / TS 4 / registry 8)","resolution":"routingClass explains the split as data: lexical=3 (Python), lexical+folded=4 (TS), metadata=context, command-bridge=improvement lanes","evidence":"skill_advisor.py:2307 vs aliases.ts:96-101"},{"question":"deep-improvement -> 4 modes default","resolution":"advisorDefaultMode:true on agent-improvement, never array order","evidence":"aliases.ts:96-101"},{"question":"Lexical weights in registry or code","resolution":"Keep weighted regex in Python; registry governs only the lexical SET via a coverage fixture","evidence":"skill_advisor.py:2326,2347"},{"question":"Fixture coverage for context/improvement","resolution":"Do NOT widen --deep-skill-routing-json; add separate registry-coverage + command-bridge fixtures","evidence":"routing-parity-deep-skills.vitest.ts:27-37"},{"question":"ai-council folder != SKILL.md name","resolution":"Keep folder; add packetSkillName to registry; folder names are not advisor-load-bearing","evidence":"ai-council/SKILL.md:2; skill-graph-db.ts:619"},{"question":"shared/ stays in workflows - on what grounds","resolution":"Keep shared/ in workflows on the SEMANTIC argument only; the dependency rationale is false","evidence":"executor-config.ts:3; artifact-root.cjs:17-18; decision-record.md:52,63,71"}],"refutations":[{"target":"Option B discoverable nested packets is viable","held":true,"note":"Survives as refuted: db.ts:619 collects only graph-metadata.json files; B makes advisor rank 5 skills and breaks the 9 invariants"},{"target":"CORRECTION #2 rename sweep still pending at SKILL.md:64,97+README:24","held":false,"note":"Already applied in working tree; only SKILL.md:47 'improvement/ packet' residual remains"},{"target":"Moving shared/ would create a runtime->system-spec-kit dependency","held":false,"note":"Dependency already exists (zod/better-sqlite3 imports + review-research-paths re-export + depends_on edge); ADR-001 rationale must be corrected to semantic-only"}],"standardize":["sk-doc section: parent-skill-with-nested-mode-packets (one-identity rule + mode-registry schema + no-nested-graph-metadata keystone + packetSkillName exception)","/create:parent-skill scaffolder: hub SKILL.md+mode-registry.json+one graph-metadata.json+packet stubs, dir==name default","/doctor:parent-skill validator: one metadata file, skill_id==folder, family allowlist, no nested markers, registry<->router derivation, runtimeLoopType in set-or-null","/deep:skill-benchmark: assert exactly one ranked skill for all 8 modes' triggers + correct mode resolution"],"risks":["Registry load failure kills routing -> fail-loud + frozen snapshot fallback","Widening the 3-mode parity contract breaks 9 invariants -> separate fixtures","One-sided derivation lets Python/TS drift -> coverage fixture on both","Regex pushed into JSON becomes brittle -> weights stay in code","Future packet drops graph-metadata.json -> advisor sees 2 skills -> doctor guard","ai-council rename churns command/agent/aliases for zero benefit -> packetSkillName instead","ADR-001 amendment misread as reversing the decision -> note decision unchanged","artifactRoot bare names mistaken as stale during rename sweep"]}
===END===

## Structured output

```json
{
  "angle": "meta-synthesis: registry-driven one-identity routing",
  "verdict": "Adopt Model A with an explicit advisorRouting block in mode-registry.json driving both layers; keep lexical regex in Python and never widen the 3-mode parity contract; ship two Phase-1 corrections (one already mostly applied).",
  "model_pick": "A",
  "decisions": [
    {
      "question": "Registry shape: derive from existing fields or add advisorRouting block",
      "resolution": "Add explicit per-mode advisorRouting {routingClass,legacyAdvisorId,legacyAliases,foldsLegacyId,advisorDefaultMode,packetSkillName}; naive read of aliases[] drops load-bearing router keys",
      "evidence": "mode-registry.json:29 vs aliases.ts:13-19"
    },
    {
      "question": "Three cardinalities (Python 3 / TS 4 / registry 8)",
      "resolution": "routingClass explains the split as data: lexical=3 (Python), lexical+folded=4 (TS), metadata=context, command-bridge=improvement lanes",
      "evidence": "skill_advisor.py:2307 vs aliases.ts:96-101"
    },
    {
      "question": "deep-improvement -> 4 modes default",
      "resolution": "advisorDefaultMode:true on agent-improvement, never array order",
      "evidence": "aliases.ts:96-101"
    },
    {
      "question": "Lexical weights in registry or code",
      "resolution": "Keep weighted regex in Python; registry governs only the lexical SET via a coverage fixture",
      "evidence": "skill_advisor.py:2326,2347"
    },
    {
      "question": "Fixture coverage for context/improvement",
      "resolution": "Do NOT widen --deep-skill-routing-json; add separate registry-coverage + command-bridge fixtures",
      "evidence": "routing-parity-deep-skills.vitest.ts:27-37"
    },
    {
      "question": "ai-council folder != SKILL.md name",
      "resolution": "Keep folder; add packetSkillName to registry; folder names are not advisor-load-bearing",
      "evidence": "ai-council/SKILL.md:2; skill-graph-db.ts:619"
    },
    {
      "question": "shared/ stays in workflows - on what grounds",
      "resolution": "Keep shared/ in workflows on the SEMANTIC argument only; the dependency rationale is false",
      "evidence": "executor-config.ts:3; artifact-root.cjs:17-18; decision-record.md:52,63,71"
    }
  ],
  "refutations": [
    {
      "target": "Option B discoverable nested packets is viable",
      "held": true,
      "note": "Survives as refuted: db.ts:619 collects only graph-metadata.json files; B makes advisor rank 5 skills and breaks the 9 invariants"
    },
    {
      "target": "CORRECTION #2 rename sweep still pending at SKILL.md:64,97+README:24",
      "held": false,
      "note": "Already applied in working tree; only SKILL.md:47 'improvement/ packet' residual remains"
    },
    {
      "target": "Moving shared/ would create a runtime->system-spec-kit dependency",
      "held": false,
      "note": "Dependency already exists (zod/better-sqlite3 imports + review-research-paths re-export + depends_on edge); ADR-001 rationale must be corrected to semantic-only"
    }
  ],
  "standardize": [
    "sk-doc section: parent-skill-with-nested-mode-packets (one-identity rule + mode-registry schema + no-nested-graph-metadata keystone + packetSkillName exception)",
    "/create:parent-skill scaffolder: hub SKILL.md+mode-registry.json+one graph-metadata.json+packet stubs, dir==name default",
    "/doctor:parent-skill validator: one metadata file, skill_id==folder, family allowlist, no nested markers, registry<->router derivation, runtimeLoopType in set-or-null",
    "/deep:skill-benchmark: assert exactly one ranked skill for all 8 modes' triggers + correct mode resolution"
  ],
  "risks": [
    "Registry load failure kills routing -> fail-loud + frozen snapshot fallback",
    "Widening the 3-mode parity contract breaks 9 invariants -> separate fixtures",
    "One-sided derivation lets Python/TS drift -> coverage fixture on both",
    "Regex pushed into JSON becomes brittle -> weights stay in code",
    "Future packet drops graph-metadata.json -> advisor sees 2 skills -> doctor guard",
    "ai-council rename churns command/agent/aliases for zero benefit -> packetSkillName instead",
    "ADR-001 amendment misread as reversing the decision -> note decision unchanged",
    "artifactRoot bare names mistaken as stale during rename sweep"
  ]
}
```
