# Iteration 014 — ADVERSARIAL-2: stress shared/ decision + runtime-dependency + ai-council

- **Model**: opus-4.8 (claude2/account2, read-only)
- **Seat**: 014
- **model_pick**: A

## Analysis

I now have all the load-bearing evidence verified against the real code. Writing my adversarial synthesis.

---

# SEAT 014/15 — ADVERSARIAL-2: shared/ decision, the runtime-dependency correction, and ai-council

**Stance:** I tried to break the stage-1 consensus on three points. The Model-A keystone (one hub identity, registry-derived routing) survives untouched — it's orthogonal to my three targets. But I **partially refute the *recorded basis*** of the shared/ decision, **downgrade** "non-discoverable shared/" from pattern-element to incidental, and **reject** the ai-council mismatch as a defensible long-term standard. Details below, all cited.

---

## (a) shared/synthesis/resource-map.cjs — keep in workflows, but the ADR's rationale is wrong and must be amended

### What the code actually shows

Both files are 19-line re-export shims into **the same foreign skill**, system-spec-kit:

- `deep-loop-workflows/shared/synthesis/resource-map.cjs:17-18` → `system-spec-kit/scripts/resource-map/extract-from-evidence.cjs` (emitResourceMap)
- `deep-loop-runtime/lib/deep-loop/artifact-root.cjs:17-18` → `system-spec-kit/shared/review-research-paths.cjs` (resolveArtifactRoot, allocateShortSubfolder, normalizeSpecFolderReference)

So **CORRECTION #1 is confirmed by direct read**, and it is stronger than "the runtime depends on system-spec-kit somewhere": the *promoted runtime seam itself* (`artifact-root.cjs:18`) **literally re-exports a system-spec-kit path**. The runtime's `graph-metadata.json:11-13` declares `depends_on: system-spec-kit` with context *"imports zod, better-sqlite3, TSX loader, command YAML consumers, and shared test discovery from system-spec-kit paths."* **The "moving shared/ into the runtime would CREATE a system-spec-kit dependency" rationale is therefore void** — that dependency already exists, by design, in the very module resource-map would sit beside.

### Stressing the semantic argument

The 152 ADR records the split as a **bare assertion** with no rationale: *"`emitResourceMap` stays a workflows-shared synthesis primitive, not a backend module"* (`152.../decision-record.md:58`). That same decision **promoted `resolveArtifactRoot` into the runtime**. So the ADR drew exactly my line — but didn't justify it, and its *implied* justification (dependency avoidance) is the false one CORRECTION #1 kills.

I pushed hardest on the strongest pro-move argument: *"two near-identical re-export shims into system-spec-kit, sitting in two different skills, is confusing — consolidate both seams in `runtime/lib/` as the single 'system-spec-kit seam' home."* That has real pull. It **fails** against the code for three independent reasons:

1. **The runtime's lib is structurally execution-only.** `runtime/lib/deep-loop/` holds 13 modules: `artifact-root, atomic-state, bayesian-scorer, executor-audit, executor-config, fallback-router, jsonl-repair, lifecycle-taxonomy, loop-lock, permissions-gate, post-dispatch-validate, prompt-pack, runtime-capabilities`. **Every one serves loop execution; there is not a single output/report renderer.** Promoting `emitResourceMap` (a delta→markdown report writer) would make it the *sole* odd-man-out — the runtime would acquire an "output formatting" responsibility class it does not otherwise own. The execution-vs-synthesis line is not post-hoc; it's already the de-facto invariant of that directory.

2. **Zero dedup gain.** The single implementation stays in system-spec-kit either way (`resource-map.cjs:7` / `artifact-root.cjs:6` both say so). Moving resource-map relocates a **19-line shim**, not logic. No drift is removed; a directory boundary is just crossed differently.

3. **Consumer/charter asymmetry corroborates the split.** `artifact-root` is required by **3** reducers — `deep-research`, `deep-review`, **and `deep-context`** `reduce-state.cjs` — because *every graph-backed mode must resolve where to write* (a write-path execution primitive; atomic-state depends on it). `resource-map` is required by only **2** — `deep-research` + `deep-review` `reduce-state.cjs`; deep-context does not emit one. Universal write-path primitive → backend; mode-selective report renderer → workflow synthesis layer. The 1-mode delta is evidence, not noise.

### Honest call on (a)

**Keep `resource-map.cjs` in `deep-loop-workflows/shared/`.** The semantic argument is **sufficient — but only when restated correctly.** Packet 155 must **amend ADR-001** so the recorded rationale is the execution-vs-synthesis criterion + the explicit note that CORRECTION #1 voids the dependency-avoidance basis. The discriminator the standard should encode: *a re-export seam's home = the charter of the underlying capability — loop-execution primitive → `runtime/lib`; cross-mode output synthesis → `workflows/shared`.* The header comment at `resource-map.cjs:4-9` already states the right instinct ("workflow output rendering, NOT runtime backend plumbing"); lift it into the pattern doc and add a reciprocal cross-reference in `artifact-root.cjs` so the asymmetry reads as intentional, not accidental.

> Note one latent inconsistency I won't paper over: `artifact-root` has a runtime "promoted seam" test (`artifact-root.vitest.ts`); `resource-map`'s only test is the impl test in system-spec-kit (`resource-map-extractor.vitest.ts`) — there is **no workflows-side shim test**. That's consistent with "the shim is trivial," and is the correct outcome *if* we keep the split. It would become a gap only if we promoted it.

---

## (b) "Non-discoverable shared/" — incidental, not a pattern element

This framing conflates two things. Per the B5 keystone, discovery keys **only** on files named `graph-metadata.json` (`skill-graph-db.ts:601`), and I confirmed **exactly one exists** in the whole parent skill — the hub root (`find` returned only `deep-loop-workflows/graph-metadata.json`). Therefore **everything nested is advisor-invisible by construction** — the five mode packets just as much as `shared/`. `shared/` has **no special invisibility**; it inherits the universal property.

So "non-discoverable shared/" is **incidental**. The genuinely standardizable elements underneath it are:

1. **The real pattern element (load-bearing):** *one parent skill = exactly one `graph-metadata.json` at the hub root = one advisor identity; all nested content carries none.*
2. **A separate, optional affordance:** *a parent skill MAY host a `shared/` dir for code reused by ≥2 mode packets.* Today this is nearly vestigial — `shared/` holds **exactly one file** (`resource-map.cjs`); calling it a "pattern" is generous. Define it, don't oversell it.

**The risk the standard must encode** (and nothing currently enforces): `isSkillGraphMetadata` trips on `skill_id` **OR** `family` **OR** `edges` (`skill-graph-db.ts:644`). A contributor dropping any metadata-bearing file with a `family` field into `shared/` — or re-adding a nested `graph-metadata.json` — **mints a phantom advisor identity** and breaks the one-identity keystone. The count is correct *today* but unguarded. **Standardize a CI/fixture assertion: exactly one `graph-metadata.json` per parent skill.** That converts the B5 keystone from "currently true" to "enforced."

---

## (c) ai-council — the mismatch is NOT a defensible standard; folder==name must be required

### The mismatch is real and three-fold, not cosmetic

Confirmed names: 4 siblings satisfy folder==`name` (`deep-research`, `deep-review`, `deep-context`, `deep-improvement`). **ai-council is the lone outlier — and in three fields, not one.** From `mode-registry.json:42-50`: `packet:"ai-council"`, `agent:"ai-council"`, `artifactRoot:"ai-council/"`, `command:"/deep:ai-council"` — while `SKILL.md name: deep-ai-council`. So **folder, registry `packet`, and `agent` all dropped the `deep-` prefix that every sibling carries**; only the SKILL `name` kept it.

I stress-tested "just rename the folder" and found it's **not that simple** — there are two self-consistent end states, and they collide:
- **Bare suffixes are the sibling convention for command/artifact:** `/deep:research` ↔ `artifactRoot research/`, `/deep:review` ↔ `review/`. ai-council's `/deep:ai-council` + `ai-council/` **already conform** to that — renaming them to `/deep:deep-ai-council` / `deep-ai-council/` would be *ugly and wrong* ("deep:deep-").
- **The `deep-` prefix is the sibling convention for folder/name/packet/agent:** `deep-research/` folder, `name: deep-research`, `packet:"deep-research"`, `agent:"deep-research"`. ai-council **violates this** in folder/packet/agent.

### Honest call on (c)

The mismatch is **defensible only as a temporary pre-rename state, never as the encoded standard.** A reusable pattern with a baked-in "except ai-council" clause is an anti-pattern generator — and it's one accidental `graph-metadata.json` away from a hard failure: `parseSkillMetadata` **throws when `skill_id ≠ folder`** (`skill-graph-db.ts:656`). It's non-load-bearing *today* only because the packet is non-discoverable; the whole point of 155 is to make this **reusable**, so latent landmines must be removed, not codified.

**Encode in the standard:** *folder == SKILL.md `name`* is the load-bearing identity pair and is **required**; all packets carry the `deep-` prefix. This forces:
- rename folder `ai-council/` → `deep-ai-council/`, and update `mode-registry.json` `packet:"ai-council"` → `"deep-ai-council"`.

The registry already gives us the tool to absorb the *genuinely* higher-churn surfaces without re-introducing a mismatch: it carries explicit `command`, `agent`, `artifactRoot` fields. So:
- **`command:"/deep:ai-council"` and `artifactRoot:"ai-council/"` STAY** — they follow the bare-suffix sibling convention and are registry-recorded surface names, not folder-derived.
- **`agent:"ai-council"`** is the one remaining judgment call: renaming `@ai-council` → `@deep-ai-council` ripples across three runtime agent dirs (`.claude/.opencode/.codex/agents`) and CLAUDE.md §5. Because the registry records `agent` explicitly, the standard can permit it to **remain `ai-council` as a recorded surface alias** if the churn isn't worth it — *without* the folder/name pair ever diverging. The load-bearing pair gets standardized; the cosmetic surface stays a documented, registry-pinned exception rather than an implicit one.

This also closes **CORRECTION #2** in the same sweep: the hub still says e.g. *"the 3 improvement modes all share the improvement/ packet"* (`SKILL.md:47`) where the packet dir is `deep-improvement/`. The prior rename sweep was applied incompletely — exactly why the standard must be enforced (folder==name fixture), not just asserted.

---

## Where I disagree with / extend stage-1

I do **not** dispute Model A — registry-derived routing over one hub identity is right, and my three targets don't touch the fixtures. My deltas:
- On (a): "semantic argument is sufficient" is **true but under-recorded**; the ADR states it bare and its implied rationale is false. 155 must amend the ADR with the execution-vs-synthesis criterion (corroborated by the runtime-lib-is-execution-only fact), not just inherit the assertion.
- On (b): "non-discoverable shared/" is **incidental**, not a pattern element; the real, enforceable element is "exactly one graph-metadata.json per parent skill" — and it needs a CI guard it currently lacks.
- On (c): the mismatch is **not** a defensible documented exception (stage-1 tension #6 floats that option); the standard must require folder==name, with the registry absorbing legitimately-divergent surface names explicitly.

===RESEARCH-JSON===
{"angle":"ADVERSARIAL-2: stress shared/ home, runtime-dependency correction, ai-council mismatch","verdict":"Keep resource-map.cjs in workflows/shared on the execution-vs-synthesis axis (the runtime lib is 100% execution primitives, zero renderers; dedup gain is zero), but amend ADR-001 because its recorded basis is a bare assertion and CORRECTION #1 voids its implied dependency rationale; 'non-discoverable shared/' is incidental, and the ai-council folder!=name mismatch must be standardized away, not documented as an exception.","model_pick":"A","decisions":[{"question":"Is the semantic (synthesis vs execution) argument sufficient to keep resource-map.cjs in workflows, or move it beside artifact-root.cjs?","resolution":"Keep in workflows/shared; sufficient only when restated as execution-vs-synthesis (runtime lib is execution-only; move buys zero dedup; mode-selective 2/5 vs artifact-root's universal 3/5). Amend ADR-001 to record this and drop the false dependency-avoidance basis.","evidence":"resource-map.cjs:17-18; artifact-root.cjs:17-18; 152/001 decision-record.md:58; runtime graph-metadata.json:11-13"},{"question":"Is 'non-discoverable shared/' a real pattern element?","resolution":"Incidental — nesting is universally advisor-invisible (discovery keys only on graph-metadata.json). Real element: exactly one graph-metadata.json per parent skill; add a CI/fixture count==1 guard since isSkillGraphMetadata trips on skill_id|family|edges.","evidence":"skill-graph-db.ts:601,644; find: only hub graph-metadata.json"},{"question":"Is the ai-council folder/name mismatch defensible long-term?","resolution":"No. Require folder==SKILL-name (deep-* prefix): rename ai-council/ -> deep-ai-council/ and registry packet; keep /deep:ai-council command + ai-council/ artifactRoot as bare-suffix sibling convention; agent name may stay as a registry-recorded surface alias.","evidence":"mode-registry.json:42-50; SKILL.md name fields; skill-graph-db.ts:656"}],"refutations":[{"target":"Moving shared/ into the runtime would create a system-spec-kit dependency","held":false,"note":"False: artifact-root.cjs:18 (the runtime seam) literally re-exports system-spec-kit/shared/review-research-paths.cjs; runtime graph-metadata.json:11-13 declares depends_on system-spec-kit. Dependency already exists by design."},{"target":"resource-map.cjs should be co-located with artifact-root.cjs in runtime/lib for a single seam home","held":true,"note":"Split survives: runtime/lib is 13 execution-only modules with zero renderers; promoting emitResourceMap adds an output-formatting responsibility class for zero dedup (impl stays in system-spec-kit either way)."},{"target":"ai-council mismatch is harmless because folder name is not advisor-load-bearing under one-identity","held":false,"note":"True today only because the packet is non-discoverable; parseSkillMetadata throws on skill_id!=folder (skill-graph-db.ts:656). A reusable standard must not codify a one-accident-from-failure exception."}],"standardize":["sk-doc/pattern-standard: seam-home discriminator (execution primitive -> runtime/lib; cross-mode output synthesis -> workflows/shared) with reciprocal cross-ref comments in both shims","doctor/CI fixture: assert exactly one graph-metadata.json per parent skill (locks the one-identity keystone against phantom-identity regressions)","pattern-standard rule: folder == SKILL.md name (deep-* prefix) required for every mode packet; registry carries explicit command/agent/artifactRoot for legitimately-divergent surface names","create scaffold: parent-skill template with hub graph-metadata.json + mode-registry.json + optional empty shared/ (no metadata) + nested packets that drop graph-metadata.json","amend ADR-001 (152/001): record execution-vs-synthesis rationale and note CORRECTION #1 voids the dependency-avoidance basis"],"risks":["A future metadata-bearing file (family/skill_id/edges) dropped into shared/ or a re-added nested graph-metadata.json mints a phantom advisor identity and breaks one-identity (skill-graph-db.ts:644) — unguarded today","Renaming ai-council/ -> deep-ai-council/ without updating registry packet desyncs the packet pointer; the prior context/->deep-context/ sweep was already left incomplete in the hub (SKILL.md:47, CORRECTION #2)","Amending ADR-001's rationale without re-running parity fixtures could be mistaken for a behavior change; it is doc-only (shim location unchanged)"]}
===END===

## Structured output

```json
{
  "angle": "ADVERSARIAL-2: stress shared/ home, runtime-dependency correction, ai-council mismatch",
  "verdict": "Keep resource-map.cjs in workflows/shared on the execution-vs-synthesis axis (the runtime lib is 100% execution primitives, zero renderers; dedup gain is zero), but amend ADR-001 because its recorded basis is a bare assertion and CORRECTION #1 voids its implied dependency rationale; 'non-discoverable shared/' is incidental, and the ai-council folder!=name mismatch must be standardized away, not documented as an exception.",
  "model_pick": "A",
  "decisions": [
    {
      "question": "Is the semantic (synthesis vs execution) argument sufficient to keep resource-map.cjs in workflows, or move it beside artifact-root.cjs?",
      "resolution": "Keep in workflows/shared; sufficient only when restated as execution-vs-synthesis (runtime lib is execution-only; move buys zero dedup; mode-selective 2/5 vs artifact-root's universal 3/5). Amend ADR-001 to record this and drop the false dependency-avoidance basis.",
      "evidence": "resource-map.cjs:17-18; artifact-root.cjs:17-18; 152/001 decision-record.md:58; runtime graph-metadata.json:11-13"
    },
    {
      "question": "Is 'non-discoverable shared/' a real pattern element?",
      "resolution": "Incidental — nesting is universally advisor-invisible (discovery keys only on graph-metadata.json). Real element: exactly one graph-metadata.json per parent skill; add a CI/fixture count==1 guard since isSkillGraphMetadata trips on skill_id|family|edges.",
      "evidence": "skill-graph-db.ts:601,644; find: only hub graph-metadata.json"
    },
    {
      "question": "Is the ai-council folder/name mismatch defensible long-term?",
      "resolution": "No. Require folder==SKILL-name (deep-* prefix): rename ai-council/ -> deep-ai-council/ and registry packet; keep /deep:ai-council command + ai-council/ artifactRoot as bare-suffix sibling convention; agent name may stay as a registry-recorded surface alias.",
      "evidence": "mode-registry.json:42-50; SKILL.md name fields; skill-graph-db.ts:656"
    }
  ],
  "refutations": [
    {
      "target": "Moving shared/ into the runtime would create a system-spec-kit dependency",
      "held": false,
      "note": "False: artifact-root.cjs:18 (the runtime seam) literally re-exports system-spec-kit/shared/review-research-paths.cjs; runtime graph-metadata.json:11-13 declares depends_on system-spec-kit. Dependency already exists by design."
    },
    {
      "target": "resource-map.cjs should be co-located with artifact-root.cjs in runtime/lib for a single seam home",
      "held": true,
      "note": "Split survives: runtime/lib is 13 execution-only modules with zero renderers; promoting emitResourceMap adds an output-formatting responsibility class for zero dedup (impl stays in system-spec-kit either way)."
    },
    {
      "target": "ai-council mismatch is harmless because folder name is not advisor-load-bearing under one-identity",
      "held": false,
      "note": "True today only because the packet is non-discoverable; parseSkillMetadata throws on skill_id!=folder (skill-graph-db.ts:656). A reusable standard must not codify a one-accident-from-failure exception."
    }
  ],
  "standardize": [
    "sk-doc/pattern-standard: seam-home discriminator (execution primitive -> runtime/lib; cross-mode output synthesis -> workflows/shared) with reciprocal cross-ref comments in both shims",
    "doctor/CI fixture: assert exactly one graph-metadata.json per parent skill (locks the one-identity keystone against phantom-identity regressions)",
    "pattern-standard rule: folder == SKILL.md name (deep-* prefix) required for every mode packet; registry carries explicit command/agent/artifactRoot for legitimately-divergent surface names",
    "create scaffold: parent-skill template with hub graph-metadata.json + mode-registry.json + optional empty shared/ (no metadata) + nested packets that drop graph-metadata.json",
    "amend ADR-001 (152/001): record execution-vs-synthesis rationale and note CORRECTION #1 voids the dependency-avoidance basis"
  ],
  "risks": [
    "A future metadata-bearing file (family/skill_id/edges) dropped into shared/ or a re-added nested graph-metadata.json mints a phantom advisor identity and breaks one-identity (skill-graph-db.ts:644) — unguarded today",
    "Renaming ai-council/ -> deep-ai-council/ without updating registry packet desyncs the packet pointer; the prior context/->deep-context/ sweep was already left incomplete in the hub (SKILL.md:47, CORRECTION #2)",
    "Amending ADR-001's rationale without re-running parity fixtures could be mistaken for a behavior change; it is doc-only (shim location unchanged)"
  ]
}
```
