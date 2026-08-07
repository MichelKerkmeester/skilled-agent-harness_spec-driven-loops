# Research Synthesis — Skill & Advisor JSON Optimization (grok-high lineage)

**Lineage:** `grok-high` · **Session:** `fanout-grok-high-1785305275596-oro54j`  
**Executor:** cli-cursor / `cursor-grok-4.5-high`  
**Stop reason:** `max_iterations` (5/5) — early convergence treated as telemetry only  
**Non-goals honored:** findings only; no scoring redesign; H/S class contract untouched

---

## 1. Executive verdict

The fleet **class/presence contract is healthy** (11/11 roots pass `ci-skill-root-metadata`), but **JSON leverage on Gate-2 selection is capped** by (a) unread/orphaned authored fields, (b) scaffold journeys that stop before generated artifacts exist, and (c) missing acceptance tests that would catch selection misses. Hub **post-selection** routing (mode-registry + hub-router → compiled-route-manifest) is comparatively solid when the right hub ranks.

Highest single-leverage theme: **close the scaffold→`--fix`→ingest→`advisor_recommend` loop with golden prompts**, while **deleting or migrating orphan `manual.*` and unread `description.json` fields** so authors stop maintaining dead data.

---

## 2. Ranked opportunity map

Leverage score = impact on routing correctness / author toil / CI catch-rate × feasibility without changing H/S or scorer math.

| Rank | Opportunity | Dim | Leverage | Evidence | Suggested follow-up (not implemented) |
|-----:|-------------|-----|----------|----------|----------------------------------------|
| **1** | **Gate-2 golden prompt suite in CI** asserting top-1/top-3 for create-skill, git, deep-research, etc. | Testing / Effectiveness | **P0** | Live miss: parent-hub scaffold ranked `sk-prompt` > `sk-doc` (iter4 F22); no GH `advisor_recommend` wiring (iter5 F30) | Packet: advisor selection fixtures + workflow step |
| **2** | **`init_skill` auto-runs class gate `--fix`** (H and S); land automated two-class journey proof | Automation / Integration | **P0** | Scaffold omits `--fix` (iter3 F15–F16); 024 CHK-005/CHK-009 still open (iter5 F29) | Finish 024 journey proof; one-command green scaffold |
| **3** | **Remove or migrate orphan `graph-metadata.manual.*` into typed `edges`** + unknown-key lint | Optimization / Effectiveness | **P0** | `parseSkillMetadata` ignores `manual` (iter2 F11); live drift e.g. cli-external-orchestration `manual.depends_on` vs empty `edges.depends_on`; **0 tests** for `manual.related` (iter5 F28) | Lint + migration script; feed graph_causal |
| **4** | **Shrink hub `description.json` to doctor quartet** (or generate from SKILL.md); drop unread fields | Optimization | **P1** | Doctor only requires name/description/version/keywords (iter2 F8–F9); `trigger_examples` / `opencode_languages` / `supported_surfaces` have no runtime readers | Template + doctor soft-fail on unknown keys |
| **5** | **Reconcile `intent_signals` ↔ `derived.trigger_phrases`** (or derived-only phrases + minimal authored intents) | Effectiveness / Automation | **P1** | Jaccard as low as 0.04 (sk-code); uneven coverage 3–64 intents (iter4 F24); `syncDerivedMetadata` off CI path (iter3 F18) | Fleet sync + overlap report gate |
| **6** | **Wire compiled-routing scenario validator into the same CI as class/freshness** | Testing | **P1** | Validator exists (`validate-compiled-routing-scenarios.cjs`) but not in `.github/workflows` grep (iter5 F30) | Extend `routing-registry-drift.yml` |
| **7** | **Stop scaffolding unread `manual` stubs** in `init_skill` | Automation | **P2** | init still emits `manual: {depends_on:[], related_to:[]}` (iter3 F17) | One-line scaffold cleanup after lint lands |
| **8** | **Document / split naming** of spec-folder `generate-description.js` / `backfill-graph-metadata.js` vs skill-root schemas | Inventory | **P2** | Same filenames, different domains (iter1 F5) | Operator doc + charter glossary |
| **9** | **command-metadata / leaf-aliases denser e2e** beyond presence | Testing | **P2** | Thin test counts (3 / 2 files) vs registry/router (iter5 F28) | Expand schema+disk fixtures |
| **10** | **Optional trusted CI smoke: `syncDerivedMetadata` + `skill_graph_scan`** after metadata PRs | Integration | **P2** | Ingest not on create journey (iter3 F20) | Trusted-only job |

---

## 3. Dimension rollup

### (1) Inventory — current state
- 7 H + 4 S; presence matrix matches contract; fleet gate green.
- Generated: `leaf-manifest.json` (all), `leaf-aliases.json` (S); remainder authored.
- Advisor identity path: `graph-metadata.json` → SQLite; `description.json` is doctor-scoped only.
- Pipeline charter conflates skill-root tools with spec-folder generators.

### (2) Optimization
- Dead description fields; triple keyword vocab (description / domains / SKILL.md).
- Orphan `manual.*` vs ingested `edges` with live drift.
- Parallel phrase banks (intent vs derived) without enforcement.

### (3) Automation
- Scaffold incomplete without manual `--fix`.
- Derived sync exists but not on CI/scaffold path.
- No unread-field / unknown-key validators.
- Create journey still lacks advisor acceptance step.

### (4) Effectiveness
- Load-bearing when ranked: domains, intent_signals, derived triggers, edges, registry/router→compiled routes.
- Selection diluted by hard-coded `explicit_author` tables (weight 0.42) — JSON-only fixes help but cannot fully overcome (scorer redesign out of scope).
- Sparse edges under-fuel `graph_causal`; live create-skill probe miss.

### (5) Testing / integration
- Strong: class contract unit tests + CI presence/freshness + doctor hub loop.
- Weak: journey proof open; no advisor golden prompts in GH; orphan fields untested; compiled-routing validator unwired.

---

## 4. Failure-mode chain (integration view)

```text
init_skill ──✗──> missing leaf-manifest (no --fix)
     │
     ▼
class gate / freshness / doctor ──✓──> presence green; ──✗──> unread/orphan fields
     │
     ▼
skill_graph_scan / watcher ──✗──> optional / undocumented on create path
     │
     ▼
advisor_recommend ──✗──> wrong top-1 possible; no CI golden
     │
     ▼
compiled-route-manifest ──✓──> correct packet when hub ranks
```

---

## 5. Answered research questions

1. **JSON inventory / authored vs generated / H·S** — answered (iter1).
2. **Redundant unused drift-prone fields** — answered (iter2); lead: `manual.*`, unread description fields.
3. **Hand-authoring vs automatable** — answered (iter3); lead: auto `--fix`, derived sync, dead-field lint.
4. **Do JSON fields drive routing well?** — partially (iter4); selection weak, post-selection hub routing stronger.
5. **Test/CI/e2e gaps** — answered (iter5); lead: golden prompts + journey proof.

---

## 6. Sources (primary)

- `.opencode/skills/sk-doc/create-skill/references/shared/skill-root-metadata-contract.md`
- `.opencode/skills/sk-doc/create-skill/scripts/{ci-skill-root-metadata,generate-leaf-manifest,init_skill,lib/skill-root-metadata-contract}.cjs|.py`
- `.opencode/commands/doctor/scripts/parent-skill-check.cjs`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/{skill-graph/skill-graph-db,scorer/projection,scorer/lanes/explicit,derived/sync}.ts`
- `.opencode/bin/lib/compiled-route-manifest.cjs`
- `.github/workflows/routing-registry-drift.yml`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/024-create-journey-gate-fixes/checklist.md`
- Live: `ci-skill-root-metadata --format json` (11/11); `advisor_recommend` probe 2026-07-29T06:14:15Z

---

## 7. Iteration index

| # | Focus | newInfoRatio | Key findings |
|---|-------|-------------:|--------------|
| 1 | Inventory | 1.00 | F1–F7 fleet matrix + pipeline domain split |
| 2 | Optimization | 0.85 | F8–F14 dead fields + manual orphan |
| 3 | Automation | 0.75 | F15–F21 scaffold/--fix/derived-CI gaps |
| 4 | Effectiveness | 0.80 | F22–F27 live miss + lane leverage |
| 5 | Testing/integration | 0.70 | F28–F32 journey/CI/orphan-test gaps |

Per-iteration narratives: `iterations/iteration-00N.md` · deltas: `deltas/iter-00N.jsonl`
