# Iteration 011 — SYNTHESIS-1: concrete registry-driven routing design

- **Model**: opus-4.8 (claude2/account2, read-only)
- **Seat**: 011
- **model_pick**: A

## Analysis

I now have complete, verified ground truth. Writing the synthesis.

---

# SYNTHESIS-1 — Registry-Driven Routing for `deep-loop-workflows` (Seat 011/15)

## Bottom line

Model **A** is correct, but the stage‑1 framing of "make **BOTH** advisor routing layers derive" is asymmetric in a way that changes the migration: **the TypeScript deep‑mode layer is currently dormant — nothing consumes it**, and **mode-registry.json is read by zero code today**. All live deep‑loop routing that the parity fixtures guard is **100% Python** (the fixtures `execFileSync('python3', …)`, `routing-parity-deep-skills.vitest.ts:40`). So the registry shape must serve a Python‑first cutover with a self‑equality assertion, and the lexical weights should **stay in Python for migration step 1** — moving them into JSON now is risk without a second consumer.

The registry needs an explicit per‑mode **`advisorRouting`** block — deriving "solely from existing fields" provably regresses routing, because the legacy/command‑bridge aliases the routers depend on are **entirely absent** from the current `aliases[]` arrays.

---

## Ground-truth corrections to the digest (verified by read)

**(GT‑1) The TS deep-mode projection is dead code today.** `modeForAlias`, `mergedSkillForAlias`, `DEEP_MODE_BY_CANONICAL`, `ALIAS_TO_MODE`, `MERGED_DEEP_SKILL_ID` (`aliases.ts:90–130`) have **no consumer** anywhere in `lib/`, `handlers/`, `scripts/`, or `tests/` (repo‑wide grep). The only live exports of `aliases.ts` are `SKILL_ALIAS_GROUPS`, `canonicalSkillId`, `skillInAliasSet`, `skillMatchesAlias` — consumed by `handlers/advisor-validate.ts:15,386` and `tests/scorer/native-scorer.vitest.ts:15`. The deep‑mode layer is a forward‑looking scaffold ("once the old skill nodes leave the graph", `aliases.ts:82–84`). **Consequence: the TS half of "both layers derive" carries near‑zero fixture risk; the Python half carries all of it.**

**(GT‑2) `mode-registry.json` is read by nothing.** Code‑wide grep finds only a *comment* reference (`aliases.ts:78`). Today the registry is documentation, not a source of truth in the executing sense. Model A's whole value is making it load‑bearing.

**(GT‑3) The registry's `aliases[]` are lexical trigger phrases, NOT the routers' alias namespace.** Research mode aliases = `["deep-research","research loop","iterative investigation workflow","research convergence detection","autoresearch","iterative-research"]` (`mode-registry.json:29`) — these mirror `graph-metadata.json derived.trigger_phrases:68–100`, *not* the canonicalization aliases. The legacy/command‑bridge ids the routers actually resolve (`command-spec-kit-deep-research`, `/deep:start-research-loop`, `deep:start-research-loop`, `spec_kit:deep-research`, `sk-deep-research`) are **absent from the registry entirely**. A naive `aliases[]` loader would drop them and break `canonicalSkillId('spec_kit:deep-review') → 'deep-review'` (pinned by `native-scorer.vitest.ts:353–355`). **This settles tension 1: a per‑mode `advisorRouting` block is required; pure derivation from existing fields cannot work.**

**(GT‑4) Python and TS already diverge on the very aliases a registry would unify.** Python's `deep-research` group has `deep:start-research-loop` (non‑slash) that TS lacks (`skill_advisor.py:228+` vs `aliases.ts:13–19`); the `deep-ai-council` groups differ wildly (Python: 4 terse ids; TS: 7 incl. `@deep-ai-council`, `planning council`, `multi-ai-council`). This is independent evidence *for* a single registry source — and it means `legacyAliases` must be the **union** of both current sets, asserted as a superset.

**(GT‑5) The rename gap (CORRECTION #2) extends into `graph-metadata.json`.** `derived.source_docs` still lists bare `context/SKILL.md`, `research/SKILL.md`, `review/SKILL.md`, `improvement/SKILL.md` (`graph-metadata.json:148–157`) while `derived.key_files:117–126` already uses `deep-context/…` etc. So the sweep gap is three sites (SKILL.md, README, **and** graph‑metadata `source_docs`), not two. Not routing‑load‑bearing under one‑identity, but it should ride along.

---

## The registry shape (resolves tensions 1, 2, 3; reserves 5)

Add one `advisorRouting` object per mode. Keep the existing `aliases[]` as the human/metadata trigger‑phrase surface (it already feeds graph‑metadata); put the **machine** routing contract in `advisorRouting`. This separates the three namespaces the code keeps conflating: lexical phrases ≠ legacy canonical aliases ≠ command bridges.

```jsonc
// per mode, e.g. research:
"advisorRouting": {
  "routingClass": "lexical",              // lexical | metadata | command-bridge   (tension 2)
  "advisorDiscriminatorKey": "deep-research", // Candidate-3 internal key (legacy skill id);
                                          //   distinct from workflowMode AND packet — REQUIRED for lexical class
  "legacyAliases": [                      // UNION of current Python + TS hardcoded sets (tension 1, GT-4)
    "command-spec-kit-deep-research", "/deep:start-research-loop",
    "deep:start-research-loop", "spec_kit:deep-research",
    "deep-research", "sk-deep-research"
  ],
  "advisorDefaultMode": false             // true on exactly ONE improvement mode (tension 3)
  // "lexicalPatterns" / "structuralPatterns": OMITTED in step 1 — see tension 5. Field RESERVED in schema.
}
```

Per `routingClass` (tension 2 — the three cardinalities are made declarative, not 1:1):

| routingClass | modes | what derives from it |
|---|---|---|
| `lexical` | review, research, ai-council | seed `DEEP_ROUTING_SKILLS`, `DEEP_ROUTING_MODE_BY_KEY` (`advisorDiscriminatorKey → workflowMode`), and which modes carry pattern groups |
| `metadata` | context | **no** lexical/alias entry; resolved from `graph-metadata.json` trigger phrases (matches `skill_advisor.py:2316–2318`, `aliases.ts:86–89`) |
| `command-bridge` | agent-improvement, model-benchmark, skill-benchmark, ai-system-improvement | routed by `/deep:*` command, not lexical scoring; `legacyAliases` still feed canonicalization |

**Tension 3:** `advisorDefaultMode:true` goes on `agent-improvement` only. TS's `DEEP_MODE_BY_CANONICAL['deep-improvement'] = 'agent-improvement'` (`aliases.ts:100`) then derives as "the improvement‑packet mode flagged default" — never array order.

**`advisorDiscriminatorKey` must be explicit** because for ai‑council it is a *fourth* distinct string: `workflowMode='ai-council'`, `packet='ai-council'`, but discriminator key `='deep-ai-council'` (`skill_advisor.py:2323,2340`). It cannot be inferred from `workflowMode` or `packet`.

---

## How Python loads (mirrors the existing `COMPAT_CONTRACT` idiom)

Module‑init load, identical pattern to `skill_advisor.py:169–171`:

```python
MODE_REGISTRY_PATH = os.path.join(SKILLS_DIR, "deep-loop-workflows", "mode-registry.json")
with open(MODE_REGISTRY_PATH, "r", encoding="utf-8") as f:
    MODE_REGISTRY = json.load(f)
```
`SKILLS_DIR` already resolves to `.opencode/skills` (`skill_advisor.py:42`); I verified the path exists. Then **derive**:
- `DEEP_ROUTING_SKILLS` = tuple of `advisorDiscriminatorKey` for `routingClass=='lexical'` modes;
- `DEEP_ROUTING_MODE_BY_KEY` = `{discriminatorKey: workflowMode}`;
- the deep entries of `SKILL_ALIAS_GROUPS` rebuilt from each mode's `legacyAliases`.
**Keep** `DEEP_ROUTING_LEXICAL_PATTERNS` / `STRUCTURAL_PATTERNS` / incompatibility penalties hardcoded, keyed by `advisorDiscriminatorKey` (tension 5).

## How TS loads — runtime read, not compile-time import

`resolveJsonModule` is **off** (no tsconfig entry); the package convention is runtime `readFileSync(join(__dirname, '..', 'data', …)) + JSON.parse` (`lib/prompt-policy.ts:31–35`), with `parseJsonObject` available in `lib/utils/json-guard.ts`. **Recommendation: copy `mode-registry.json` into the advisor's `data/` via the existing `postbuild` `cp data/*.json` step** (`package.json` scripts) so `dist/` stays self‑contained — exactly the `prompt-policy.default.json` precedent. Then derive **only the dormant deep‑mode layer** (`DEEP_MODE_BY_CANONICAL`, `ALIAS_TO_MODE`) from the registry first. **Leave `RAW_ALIAS_GROUPS` literal** for now — it is live and pinned by `native-scorer.vitest.ts:349–352`; collapse it to derive‑from‑registry as a *separate* PR after a `registry ⊇ RAW_ALIAS_GROUPS` superset test passes. (Avoid compile‑time `import … from './mode-registry.json'`: it couples the advisor build graph to a file outside its `rootDir` and needs `resolveJsonModule`, a wider config change.)

---

## Migration order (every commit keeps the 14 parity invariants green)

1. **Author `advisorRouting` on all 8 modes** (no code change). Populate `legacyAliases` as the **union** of current Python `SKILL_ALIAS_GROUPS` + TS `RAW_ALIAS_GROUPS`. Add a test asserting union ⊇ both hardcoded sets. Behavior unchanged → fixtures green.
2. **Python derives projection, patterns stay in code.** Load registry at init; derive `DEEP_ROUTING_SKILLS`/`DEEP_ROUTING_MODE_BY_KEY`/deep `SKILL_ALIAS_GROUPS`. Add a **self‑equality assertion**: derived constants must equal the prior literals. Scoring math + pattern dicts are byte‑identical, so all 9+5 invariants stay green.
3. **TS derives the dormant layer** from the build‑copied registry. Zero fixture coverage today → zero regression surface; add a unit test for `modeForAlias`/`mergedSkillForAlias` now that it has a real source.
4. **Add registry‑coverage fixture** (tension 4): every `lexical` mode has a Python pattern group + a `DEEP_ROUTING_MODE_BY_KEY` entry; `context` is `metadata` with no lexical entry; exactly one improvement mode has `advisorDefaultMode`; `legacyAliases ⊇` both live alias sets.
5. *(Deferred, optional)* promote `lexicalPatterns` into the registry **only if** the TS deep layer is later activated to score lexically — then both sides read one source.

---

## Disagreements with stage-1 consensus

- **"Both layers derive" is asymmetric.** The TS deep‑mode layer is dormant (GT‑1); the parity fixtures exercise only Python. Sequence Python‑first with a self‑equality gate, don't cut both sides over simultaneously.
- **Tension 5's "Python↔TS shared lexical source" is a non‑problem today.** TS has **no** deep lexical scorer (only an unrelated BM25 shadow lane, `lib/scorer/lanes/bm25.ts`). There is no live divergence to prevent, so moving weighted regex into JSON now is pure regression risk against 14 invariants for zero benefit. Reserve the field; keep patterns in `skill_advisor.py`.

---

```
===RESEARCH-JSON===
{"angle":"registry-driven routing concrete design (Python-first)","verdict":"Model A holds: add an explicit per-mode advisorRouting block (routingClass+advisorDiscriminatorKey+legacyAliases-union+advisorDefaultMode), derive Python projections from it first with a self-equality gate, keep lexical regex/weights in Python for step 1 because the TS deep layer is dormant and no second consumer exists.","model_pick":"A","decisions":[{"question":"T1 registry shape — derive from existing fields or add advisorRouting?","resolution":"Add advisorRouting; existing aliases[] are lexical trigger phrases (mirror graph-metadata derived.trigger_phrases), legacy/command-bridge ids are absent, so pure derivation regresses canonicalization","evidence":"mode-registry.json:29 vs skill_advisor.py:228 / native-scorer.vitest.ts:353-355"},{"question":"T2 three cardinalities","resolution":"routingClass enum lexical|metadata|command-bridge; only lexical modes seed DEEP_ROUTING_SKILLS/MODE_BY_KEY; context=metadata (no lexical entry); 4 improvement lanes=command-bridge","evidence":"skill_advisor.py:2307,2316-2318 / aliases.ts:86-89"},{"question":"T3 deep-improvement one packet four modes","resolution":"advisorDefaultMode:true on agent-improvement only; TS deep-improvement->agent-improvement derives from the flag, never array order","evidence":"aliases.ts:96-101 / mode-registry.json:52-95"},{"question":"T5 lexical weights into registry?","resolution":"No (step 1) — TS does no deep lexical scoring, no divergence to prevent; keep regex in skill_advisor.py keyed by advisorDiscriminatorKey, reserve optional lexicalPatterns field for later","evidence":"grep lib/handlers: no DEEP_ROUTING lexical scorer in TS; skill_advisor.py:2326-2366"},{"question":"How TS loads registry","resolution":"runtime readFileSync+JSON.parse via build-copied data/mode-registry.json (postbuild cp), like prompt-policy; not compile-time import (resolveJsonModule off)","evidence":"lib/prompt-policy.ts:31-35 / package.json postbuild / tsconfig has no resolveJsonModule"},{"question":"How Python loads registry","resolution":"json.load at module init from os.path.join(SKILLS_DIR,'deep-loop-workflows','mode-registry.json'), same idiom as COMPAT_CONTRACT","evidence":"skill_advisor.py:42,169-171 (path verified to exist)"}],"refutations":[{"target":"Both advisor routing layers are live and must cut over together","held":false,"note":"TS deep-mode layer (modeForAlias/DEEP_MODE_BY_CANONICAL) has zero consumers repo-wide; only Python is exercised by the parity fixtures, so risk is Python-only and migration is Python-first"},{"target":"Registry can derive routing from existing fields without a new block","held":false,"note":"legacyAliases like spec_kit:deep-review / command-spec-kit-deep-research are absent from aliases[]; a naive loader breaks canonicalSkillId pinned by native-scorer.vitest.ts:353-355"},{"target":"mode-registry.json is already a source of truth","held":false,"note":"no code reads it; only a comment at aliases.ts:78 — it is documentation until Model A wires it"}],"standardize":["sk-doc: 'parent skill with nested sub-skills' pattern doc — one discoverable hub graph-metadata.json + verbatim mode packets that DROP per-mode graph-metadata, plus a mandatory mode-registry.json schema (workflowMode/runtimeLoopType/backendKind + advisorRouting{routingClass,advisorDiscriminatorKey,legacyAliases,advisorDefaultMode})","create: scaffold emits hub SKILL.md + mode-registry.json with advisorRouting stub + packets without graph-metadata.json","doctor: registry-coverage check — lexical modes have pattern groups + MODE_BY_KEY entries, context is metadata-class, exactly one improvement mode has advisorDefaultMode, legacyAliases superset of live Python+TS alias sets, derived==golden self-equality","benchmark: extend routing-parity fixtures to context + improvement command-bridge lanes (currently only research/review/ai-council covered)"],"risks":["lexicalPatterns left in Python means registry is not yet the FULL source of truth — tuning still lives in two conceptual places (code + JSON) until the deferred step 5","legacyAliases must be the UNION of Python+TS which already diverge (deep:start-research-loop non-slash; ai-council 4 vs 7 ids) — an incomplete union silently regresses canonicalization on one runtime","TS build-copy of registry into data/ adds a postbuild dependency; if the cp step is missed, dist/ resolves a stale or missing registry at runtime","rename-gap also hits graph-metadata.json derived.source_docs:148-157 (bare context/research/review/improvement) — if left, metadata-routing source_docs point at non-existent paths","context mode is metadata-routed with no parity fixture; a registry refactor could silently drop its trigger-phrase routing with nothing to catch it"]}
===END===

## Structured output

```json
{
  "angle": "registry-driven routing concrete design (Python-first)",
  "verdict": "Model A holds: add an explicit per-mode advisorRouting block (routingClass+advisorDiscriminatorKey+legacyAliases-union+advisorDefaultMode), derive Python projections from it first with a self-equality gate, keep lexical regex/weights in Python for step 1 because the TS deep layer is dormant and no second consumer exists.",
  "model_pick": "A",
  "decisions": [
    {
      "question": "T1 registry shape — derive from existing fields or add advisorRouting?",
      "resolution": "Add advisorRouting; existing aliases[] are lexical trigger phrases (mirror graph-metadata derived.trigger_phrases), legacy/command-bridge ids are absent, so pure derivation regresses canonicalization",
      "evidence": "mode-registry.json:29 vs skill_advisor.py:228 / native-scorer.vitest.ts:353-355"
    },
    {
      "question": "T2 three cardinalities",
      "resolution": "routingClass enum lexical|metadata|command-bridge; only lexical modes seed DEEP_ROUTING_SKILLS/MODE_BY_KEY; context=metadata (no lexical entry); 4 improvement lanes=command-bridge",
      "evidence": "skill_advisor.py:2307,2316-2318 / aliases.ts:86-89"
    },
    {
      "question": "T3 deep-improvement one packet four modes",
      "resolution": "advisorDefaultMode:true on agent-improvement only; TS deep-improvement->agent-improvement derives from the flag, never array order",
      "evidence": "aliases.ts:96-101 / mode-registry.json:52-95"
    },
    {
      "question": "T5 lexical weights into registry?",
      "resolution": "No (step 1) — TS does no deep lexical scoring, no divergence to prevent; keep regex in skill_advisor.py keyed by advisorDiscriminatorKey, reserve optional lexicalPatterns field for later",
      "evidence": "grep lib/handlers: no DEEP_ROUTING lexical scorer in TS; skill_advisor.py:2326-2366"
    },
    {
      "question": "How TS loads registry",
      "resolution": "runtime readFileSync+JSON.parse via build-copied data/mode-registry.json (postbuild cp), like prompt-policy; not compile-time import (resolveJsonModule off)",
      "evidence": "lib/prompt-policy.ts:31-35 / package.json postbuild / tsconfig has no resolveJsonModule"
    },
    {
      "question": "How Python loads registry",
      "resolution": "json.load at module init from os.path.join(SKILLS_DIR,'deep-loop-workflows','mode-registry.json'), same idiom as COMPAT_CONTRACT",
      "evidence": "skill_advisor.py:42,169-171 (path verified to exist)"
    }
  ],
  "refutations": [
    {
      "target": "Both advisor routing layers are live and must cut over together",
      "held": false,
      "note": "TS deep-mode layer (modeForAlias/DEEP_MODE_BY_CANONICAL) has zero consumers repo-wide; only Python is exercised by the parity fixtures, so risk is Python-only and migration is Python-first"
    },
    {
      "target": "Registry can derive routing from existing fields without a new block",
      "held": false,
      "note": "legacyAliases like spec_kit:deep-review / command-spec-kit-deep-research are absent from aliases[]; a naive loader breaks canonicalSkillId pinned by native-scorer.vitest.ts:353-355"
    },
    {
      "target": "mode-registry.json is already a source of truth",
      "held": false,
      "note": "no code reads it; only a comment at aliases.ts:78 — it is documentation until Model A wires it"
    }
  ],
  "standardize": [
    "sk-doc: 'parent skill with nested sub-skills' pattern doc — one discoverable hub graph-metadata.json + verbatim mode packets that DROP per-mode graph-metadata, plus a mandatory mode-registry.json schema (workflowMode/runtimeLoopType/backendKind + advisorRouting{routingClass,advisorDiscriminatorKey,legacyAliases,advisorDefaultMode})",
    "create: scaffold emits hub SKILL.md + mode-registry.json with advisorRouting stub + packets without graph-metadata.json",
    "doctor: registry-coverage check — lexical modes have pattern groups + MODE_BY_KEY entries, context is metadata-class, exactly one improvement mode has advisorDefaultMode, legacyAliases superset of live Python+TS alias sets, derived==golden self-equality",
    "benchmark: extend routing-parity fixtures to context + improvement command-bridge lanes (currently only research/review/ai-council covered)"
  ],
  "risks": [
    "lexicalPatterns left in Python means registry is not yet the FULL source of truth — tuning still lives in two conceptual places (code + JSON) until the deferred step 5",
    "legacyAliases must be the UNION of Python+TS which already diverge (deep:start-research-loop non-slash; ai-council 4 vs 7 ids) — an incomplete union silently regresses canonicalization on one runtime",
    "TS build-copy of registry into data/ adds a postbuild dependency; if the cp step is missed, dist/ resolves a stale or missing registry at runtime",
    "rename-gap also hits graph-metadata.json derived.source_docs:148-157 (bare context/research/review/improvement) — if left, metadata-routing source_docs point at non-existent paths",
    "context mode is metadata-routed with no parity fixture; a registry refactor could silently drop its trigger-phrase routing with nothing to catch it"
  ]
}
```
