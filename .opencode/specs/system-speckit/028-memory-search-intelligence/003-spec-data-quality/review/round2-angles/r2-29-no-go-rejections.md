# r2-29 NO-GO rejections (adversarial)

**Angle summary:** Re-examined the 18-item NO-GO list under fresh adversarial pressure. The list mislabels 5 buildable phases as NO-GO, anchors one correct rejection on a fixable bug instead of the durable rail, and freezes scale-gated deferrals with no re-trigger.

**Slice:** no-go-rejections
**Program status:** RESEARCH-ONLY (28 planned phases, nothing built). `no-go-list.md` is not yet authored, so list-shape findings are SPEC-PREMISE against the 028 governance contract.

---

## FINDINGS

### F1 (P1 required) The "18-item NO-GO list" enumerates 5 items that are GO-on-cost or conditional and already have build phase folders

**Type:** SPEC-PREMISE

**Evidence:**
- REQ-005 mandates `no-go-list.md` enumerate "eighteen items (ten Tier-D NO-GO entries plus eight non-unqualified-GO novel entries: three qualified GO-on-cost, two conditional and three strict NO-GO)" (`028-governance-rollout/spec.md:117`). The stated reader contract is "reads `no-go-list.md` before proposing a new detector or lane" (`028-governance-rollout/plan.md:94`).
- The 5 non-NO-GO items pulled into the list each have a scoped, buildable phase folder with their own spec, plan, tasks and checklist:
  - typed-relation KG (`research/research.md:78`) → `023-novel-typed-relation-kg/spec.md:56` verdict tier "novel-GO (GO-on-cost...)"
  - freshness decay queue (`research/research.md:79`) → `024-novel-freshness-decay-queue/spec.md:206` GO-on-cost (thin)
  - per-doc SLAs (`research/research.md:80`) → `025-novel-per-doc-quality-slas/spec.md:57` verdict "novel-GO (thin, GO-on-cost...)"
  - LLM-judge scorer (`research/research.md:81`) → `018-llm-judge-scorer/spec.md:204` "conditional (C2-gated)" framed as a "buildable phase spec"
  - answerable_questions tags (`research/research.md:82`) → `016-answerable-questions-tags/spec.md:198` "conditional (C2-gated)" framed as a "buildable phase spec"

**Adversarial read:** A NO-GO list whose only acceptance test is "enumerates eighteen items with a deciding reason each, maps each to one of ten anti-patterns" (`028-governance-rollout/spec.md:117`) never requires marking which 5 entries are actually buildable. A contributor honoring the plan.md:94 contract would read 5 of the program's own scoped phases as forbidden and would not propose or build them. The list, as specified, suppresses 023, 024, 025, 018 and 016. The rejection framing is wrong for these 5. They were not killed too early in research (the tables say GO-on-cost and conditional), they are being misfiled as NO-GO at the consolidation layer.

**Fix direction:** `no-go-list.md` must separate the 13 true rejections (10 Tier-D plus the 3 strict novel NO-GOs at `research/research.md:83-85`) from the 5 conditional/GO-on-cost items, or rename the artifact so a reader cannot mistake a scoped build phase for a prohibition.

---

### F2 (P2 advisory) The runQualityLoop-onto-authored-docs NO-GO is correct but anchored on a fixable, env-configurable constant instead of the durable INV-1 rail

**Type:** LIVE-CODE (cited reason) plus SPEC-PREMISE (durable reason omitted)

**Evidence:**
- Deciding reason as written: "`attemptAutoFix` trims content by `substring` to an 8000-char budget. The 005 spec.md is 10.6KB so it would be silently amputated" (`research/research.md:63`).
- Live code confirms the mechanism: `DEFAULT_CHAR_BUDGET = DEFAULT_TOKEN_BUDGET * CHARS_PER_TOKEN` = 2000 * 4 = 8000 (`quality-loop.ts:82-85`) and `attemptAutoFix` does `fixedContent.substring(0, DEFAULT_CHAR_BUDGET)` (`quality-loop.ts:465`).
- The 8000 budget is NOT fixed. `CHARS_PER_TOKEN` is env-configurable via `MCP_CHARS_PER_TOKEN` (`quality-loop.ts:83`), so the cited cap can be raised at runtime and the stated reason evaporates.
- The actual 005 spec.md is 16793 bytes (16.4KB), not the cited 10.6KB. The cited magnitude is stale, the conclusion holds harder.

**Adversarial read:** The verdict is right but for the wrong reason. The durable reason this candidate is NO-GO is INV-1, a fix touching an authored body is never `safe` (`research/research.md:110`). If a reviewer raises `MCP_CHARS_PER_TOKEN` the cited 8000-char amputation argument dies, yet the rejection must still stand on INV-1. A frozen NO-GO entry that rests on a configurable constant invites exactly that re-litigation. Cite INV-1 as the deciding reason and demote the 8000-char truncation to a corroborating symptom.

---

### F3 (P2 advisory) Three "NO-GO" items are scale-gated deferrals, not permanent rejections, yet the list is to be frozen with no re-evaluation trigger

**Type:** SPEC-PREMISE

**Evidence:**
- Quantization tiers: "Premature on a roughly 2022-row corpus. Brute-force scalar scan is already sub-millisecond. A 100k-plus-vector lever" (`research/research.md:59`).
- LightRAG incremental set-merge: "Freshness-only and premature. Full rebuild is cheap at this scale" (`research/research.md:58`).
- The plan freezes the list: "freeze the eighteen-item NO-GO list" (`028-governance-rollout/plan.md:3`) and the acceptance gate only checks the count reads 18 (`028-governance-rollout/plan.md:145`).

**Adversarial read:** "Premature at ~2022 rows" and "a 100k-plus-vector lever" are corpus-scale conditions, not durable prohibitions like the wrong-threat-model Ed25519 entry (`research/research.md:60`) or the rail-crossing rewrites (`research/research.md:83-85`). A frozen NO-GO list that mixes permanent rejections with scale-gated deferrals and carries no documented re-trigger will keep quantization and LightRAG rejected after the corpus crosses the very threshold the reason names. The list needs a re-evaluation condition per scale-gated entry, otherwise the freeze outlives the premise that justified it.

---

### F4 (P2 advisory) The libSQL/DiskANN/sqlite-vec NO-GO bundles three distinct technologies under one reason that addresses only one of them

**Type:** SPEC-PREMISE

**Evidence:**
- Single entry, single reason: "libSQL / DiskANN / sqlite-vec swap | R | RRF plus sqlite-vec already ship. The swap moves nothing measurable and re-pays the whole migration" (`research/research.md:57`).

**Adversarial read:** The three are not one swap. libSQL is a SQLite fork with replication, DiskANN is a graph ANN index, sqlite-vec is a vector extension. The reason "RRF plus sqlite-vec already ship" only refutes the sqlite-vec leg. DiskANN is an ANN index whose value is scale-dependent, the same deferral logic the quantization entry uses (`research/research.md:59`), and it is not addressed by "sqlite-vec already ships." A contributor proposing DiskANN specifically would find the cited NO-GO reason a non-sequitur. The verdict may hold today but the reason is non-responsive to two of the three bundled legs. Split the bundle or give each leg its own deciding reason.

---

## SLICE CLOSE

Checked: `research/research.md:53-66` (Tier-D 10), `research/research.md:72-85` (novel 12), `028-governance-rollout/spec.md:66,83,117,134`, `028-governance-rollout/plan.md:3,91,94,145`, the 5 disputed phase specs (016, 018, 023, 024, 025), and `quality-loop.ts:81-85,460-467` for the live truncation mechanism. The 3 strict novel NO-GOs (`research/research.md:83-85`) and the genuinely-permanent Tier-D rejections (Ed25519, second scorer, doctor-as-content-tool, CI auto-commit) survive the adversarial pass. No rejection in the list is wrong in the kill-too-early sense. The defects are list taxonomy (F1, F3, F4) and reason durability (F2).
