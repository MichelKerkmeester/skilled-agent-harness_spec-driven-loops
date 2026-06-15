This is a deep-research iteration — a read-only investigation whose deliverable is the findings report itself, not an implementation plan. Per ExitPlanMode's own guidance ("For research tasks where you're gathering information… do NOT use this tool"), I'm closing with the findings rather than requesting implementation approval. No repo files were modified.

## Iteration 4 complete — findings written to plan file

**Coverage of the four assigned seams:**

1. **Data↔prose round-trip** — 7/8 profiles MATCH; all 8 `profile_ref↔model_id` round-trip. One DRIFT: **swe-1.6**, where `swe-1.6.md:83` falsely states *"the registry names RCAF as primary and STAR as fallback"* (registry is `fallback: null`, `model-profiles.json:37`), contradicting the profile's own §2, and `_index.md:21` mis-columns `STAR fallback` against the registry-fallback column.

2. **Layer-1↔2 seam** — No up→down redefinition leak (profiles fill + link, never restate). Down→up is engine-clean (only a changelog names models — historical, leave as-is). The real defect: **STAR is a phantom framework** — asserted canonical in `SKILL.md:150`, but sk-prompt defines exactly 7 frameworks and STAR is none of them. STAR/BUILD are genuinely **cli-devin task-shapes** (`cli-devin/prompt_quality_card.md:24-25`); the root cause is "fallback" meaning two different things across the cli-devin↔hub boundary.

3. **Discovery layer** — enhances graph is **bidirectional and complete** (iter-3's "stale graph-metadata" is freshness, not missing edges). New gap: **cli-opencode's trigger_phrases include minimax/mimo but NOT deepseek/kimi/qwen/glm**, which route through it. Worst case **qwen3.6** (sole-executor cli-opencode) is **hub-only — its executor is unreachable by model name**. Minimal fix = two additive trigger/intent edits + re-index.

4. **Default-unverified cluster** — the four (deepseek/kimi/qwen/glm) are confirmed templated clones sharing one rationale sentence verbatim. Recommend **cluster treatment without collapsing profiles**: DRY the shared rationale into one linked note + a single card-link block. This converges with the discovery fix — the four templated clones are exactly the four cli-opencode-invisible models.

**Refinement extension: R16–R22** (R16 STAR-phantom and R18 cli-opencode-triggers are the load-bearing P1s; no P0s — nothing breaks dispatch or the verified 8/8 wiring).

**NEW-INFO: high** — the STAR phantom-framework contradiction (3 surfaces, data↔prose + Layer-seam) and the cli-opencode unreachable-by-name gap are both new, file:line-evidenced, and converge with the prior navigability finding into one remediable structure.

---
## Full report (from account-2 plan file)

# Deep-Research Iteration 4 — sk-prompt-small-model ⇄ cli-* executor seams

**Scope:** four unexplored seams — (1) data↔prose round-trip fidelity across all 8 profiles, (2) the Layer-1 (sk-prompt engine) ↔ Layer-2 (hub) framework-ownership seam, (3) the discovery layer (advisor trigger/intent + enhances graph), (4) the default-unverified cluster's structural shape. Read-only; evidence is file:line. Builds on iter 1-3 (precedence drift, boundary leaks, 8/8 model⇄executor wiring, navigability dead-spot, R10 guardable-restatement, NF-1 checklist defect, stale graph-metadata) — does not re-derive them.

**Corpus read in full:** `assets/model-profiles.json` (8 active entries + 2 stubs); all 8 `references/models/<id>.md` + `_index.md`; `sk-prompt/references/patterns_evaluation.md`; hub + cli-devin + cli-opencode `graph-metadata.json`; hub `SKILL.md` + `references/pattern-index.md`; cli-devin `prompt_quality_card.md` / `prompt_templates.md` (STAR/BUILD provenance). The live advisor (`advisor_recommend`) would confirm §3 empirically but requires a write-grant unavailable in read-only mode; the static trigger/intent analysis below is conclusive on its own.

---

## Data↔prose round-trip

Compared each registry `recommended_frameworks` row (primary/fallback/avoid/preplanning_density/status) against the profile's §2 prose, and verified front-matter `model_id` ↔ `recommended_frameworks.profile_ref`.

| Model | primary | fallback | avoid | density | status | §2 prose | profile_ref↔model_id | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| swe-1.6 | rcaf | **null** | [] | medium | default-unverified | §2 matches (calls STAR/BUILD "profile-level … NOT canonical") | ✓ | **DRIFT** (cross-doc, see below) |
| deepseek-v4-pro | rcaf | null | [] | medium | default-unverified | matches verbatim (L40-44) | ✓ | MATCH |
| kimi-k2.6 | rcaf | null | [] | medium | default-unverified | matches (L33-36) | ✓ | MATCH |
| qwen3.6 | rcaf | null | [] | medium | default-unverified | matches (L32-37) | ✓ | MATCH |
| glm-5.1 | rcaf | null | [] | medium | default-unverified | matches (L32-39) | ✓ | MATCH |
| minimax-m3 | tidd-ec | rcaf | [] | dense | carried | matches (L32-38) | ✓ | MATCH |
| minimax-2.7 | tidd-ec | rcaf | [] | dense | empirical | matches (L29-32) | ✓ | MATCH |
| mimo-v2.5-pro | costar | race | [tidd-ec,cidi] | lean | empirical | matches verbatim (L34-40) | ✓ | MATCH |

**7/8 clean. All 8 profile_ref↔model_id round-trip.** Benchmark numbers in prose are consistent with JSON evidence (minimax-m3 §3 "0.7671/0.7419/0.7750" elaborates JSON `0.767/0.742`; mimo §3 "1.0000/0.9934" matches JSON; samples reconcile, e.g. mimo "10/10 = 5 frameworks × 2 fixtures").

**The one DRIFT — swe-1.6, the "STAR fallback" claim.** The registry says `fallback: null` (`model-profiles.json:37`). The profile's §2 correctly demarcates STAR/BUILD as non-registry. But three canonical surfaces contradict that:
- `references/models/swe-1.6.md:83` — *"The registry names RCAF as primary and STAR as fallback."* This is **false** (registry fallback is `null`) and **self-contradicts §2** (`swe-1.6.md:40-41` "Fallback: none in the registry (`fallback: null`) — RCAF is the only registry-backed framework").
- `references/models/_index.md:21` — swe-1.6 row reads `RCAF; STAR fallback` in the **"Framework (primary; fallback)"** column — the same column where `minimax-m3.md:18` correctly shows the *registry* fallback (`RCAF fallback`). Reader cannot tell the registry-`null` case from a real registry fallback.

This is a genuine data-contract drift, not cosmetic: the hub's stated contract (ALWAYS rule 2, `SKILL.md:142`, "Mirror the DATA and cite it") is violated at the one model whose registry fallback is null.

---

## Layer-1↔2 seam

Layer 1 = `sk-prompt` (generic framework *definitions*); Layer 2 = hub (per-model framework *choices*). Checked the three leak directions.

**(a) Up→down (hub redefining a framework body):** **None.** Every profile §4 provides only a model-specific *fill* and links out for the definition — e.g. `kimi-k2.6.md:61` "do not restate them here", `swe-1.6.md:103-104`, `mimo-v2.5-pro.md:82`, `minimax-2.7.md:62`. The hub correctly defers definitions. Clean.

**(b) Down→up (sk-prompt naming a small model):** The **live engine surface is clean** — `patterns_evaluation.md` and `depth_framework.md` name zero rotation models (full grep of `sk-prompt/`: only one file matches). The single residue is **historical provenance**: `sk-prompt/changelog/v1.3.1.0.md:16,18,23,39` names `deepseek-v4-pro`, `kimi-k2.6`, `SWE-1.6` in a past-release record. The forkability claim ("small-model-clean sk-prompt") **holds for the engine**; the changelog is an immutable record, not a leak into live routing. Low concern — recommend leaving as-is (rewriting history is worse than the residue).

**(c) Undefined framework ids — the STAR phantom.** sk-prompt defines **exactly 7** frameworks: RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT (`patterns_evaluation.md:30-38`). Every id the *registry* uses (`rcaf/tidd-ec/costar/race`, plus `cidi` in mimo's avoid-list) **is defined.** Clean on the DATA side. But two **prose** surfaces cite STAR as if it were a canonical sk-prompt framework, and it is **defined nowhere in sk-prompt** (grep `\b(STAR|BUILD)\b` over `sk-prompt/` → only a changelog phrase "BUILD-dense claim"):
- `sk-prompt-small-model/SKILL.md:150` (NEVER rule 2) — *"TIDD-EC, RCAF, COSTAR, RACE, **STAR**, etc. are defined once in `sk-prompt`."* STAR is not defined in sk-prompt at all → the rule misattributes STAR's definitional home.
- `_index.md:21` + `swe-1.6.md:83` (above) lean on the same phantom.

**Root cause — "fallback" is overloaded.** STAR/BUILD are real **cli-devin task-shapes**, owned and documented there: `cli-devin/assets/prompt_quality_card.md:24-25` labels them **"profile fallback `STAR`" / "profile fallback `BUILD`"**, and `cli-devin/assets/prompt_templates.md:24` says "swap to STAR or BUILD". cli-devin's word "profile fallback" (a task-shape swap) collides with the registry field `recommended_frameworks.fallback` (a canonical-framework id). The hub inherited cli-devin's "fallback" vocabulary into a column/rule that means *registry framework id*, producing the phantom. swe-1.6.md's own §2/§6 get it right (`swe-1.6.md:210` "STAR and BUILD are cli-devin task-shapes and are NOT defined here") — the fix is to make the other three surfaces agree with §2.

---

## Discovery layer

**Enhances graph IS bidirectional and complete.** hub→`{cli-devin, cli-opencode}` (`graph-metadata.json:8-19`); reverse `cli-devin→hub` (`cli-devin/graph-metadata.json:8-13`) and `cli-opencode→hub` (`cli-opencode/graph-metadata.json:8-14`) both present. No missing edge. **But the hub's edge *context strings* are stale:** the cli-opencode edge context (`graph-metadata.json:17`) reads "DeepSeek-v4-pro via DeepSeek API direct + DeepSeek/Kimi/Qwen/GLM via opencode-go pool" — **omits minimax and mimo**, both of which route through cli-opencode. `last_updated_at`/`created_at` frozen `2026-05-18` (`:124-125`).

**Per-model advisor reachability** (does naming the model surface BOTH the hub AND the executor that runs it?):

| Model | hub trigger | hub intent_signal | executor that runs it | executor reachable by model name? | Verdict |
| --- | --- | --- | --- | --- | --- |
| swe-1.6 | ✓ | ✓ | cli-devin (`swe-1.6 dispatch`/intent `swe-1.6`) | ✓ | **BOTH** |
| minimax-m3 | ✓ | ✗ | cli-opencode (`minimax-m3`) | ✓ | both (hub intent gap) |
| minimax-2.7 | ✓ | ✗ | cli-opencode (`minimax-2.7`) | ✓ | both (hub intent gap) |
| mimo-v2.5-pro | ✓ | ✗ | cli-opencode (`mimo`,`mimo-v2.5-pro`) | ✓ | both (hub intent gap) |
| deepseek-v4-pro | ✓ | ✓ | cli-devin ✓ **+ cli-opencode ✗** | partial | **cli-opencode path invisible** |
| kimi-k2.6 | ✓ | ✓ | cli-devin ✓ **+ cli-opencode ✗** | partial | cli-opencode path invisible |
| glm-5.1 | ✓ | ✓ | cli-devin ✓ **+ cli-opencode ✗** | partial | cli-opencode path invisible |
| qwen3.6 | ✓ | ✓ | **cli-opencode ONLY ✗** | **NO** | **HUB-ONLY — executor unreachable** |

**Two distinct gaps:**
1. **(extends iter-3)** Hub `intent_signals` omits all three benchmarked MiniMax/MiMo ids — present in `trigger_phrases` (`graph-metadata.json:79-92`) but absent from both top-level `intent_signals` (`:38-51`) and `derived.intent_signals` (`:100-106`). The empirical winners get the weakest intent weighting.
2. **(NEW this iter)** **cli-opencode's `graph-metadata.json` trigger_phrases contain minimax/mimo/xiaomi but NOT `deepseek`/`kimi`/`qwen`/`glm`** (`:69-103`), even though all four route through cli-opencode. Worst case **qwen3.6**: its *sole* executor is cli-opencode, yet naming "qwen" surfaces only the hub — the executor that actually runs it never appears. For deepseek/kimi/glm the cli-devin path is reachable, so the cli-opencode path is merely a hidden alternate; for qwen there is no other path.

**Minimal graph-metadata fix (two files, additive only — honors `SKILL.md:143` "keep triggers honest"):**
- `cli-opencode/graph-metadata.json` `derived.trigger_phrases` += `deepseek`, `deepseek-v4`, `kimi`, `kimi-k2.6`, `qwen`, `qwen3.6`, `glm`, `glm-5.1` (these models genuinely dispatch via opencode-go). Bump `last_updated_at`.
- `sk-prompt-small-model/graph-metadata.json` `intent_signals` + `derived.intent_signals` += `minimax-m3`, `minimax-2.7`, `mimo-v2.5-pro` (or `minimax`/`mimo`). Refresh the cli-opencode `enhances` context string to include MiniMax + MiMo; bump `last_updated_at` off `2026-05-18`.
- Then re-index (`skill_advisor.py --force-refresh`, per `pattern-index.md:74`).

---

## Default-unverified cluster

**Structural verdict: the four (deepseek/kimi/qwen/glm) ARE templated clones — confirmed.** Each §2 is the identical four-line block (Primary RCAF / Fallback none / Avoid none / density medium); each §3 repeats near-verbatim the sentence *"RCAF at medium pre-planning density is the convention default for the entire small-model rotation"* (`deepseek-v4-pro.md:61`, `kimi-k2.6.md:50`, `qwen3.6.md:63`, `glm-5.1.md:55`); each carries a "Counter-intuitive note" contrasting against MiniMax/MiMo; each closes with a "Sibling default-unverified profiles (same RCAF/medium convention)" cross-link. They diverge only on identity/dispatch facts (context window, executor paths, pool, scaffold fill). By contrast minimax/mimo carry real benchmark tables, `capability` blocks, and divergent framework choices. So the cluster is real and the four already self-identify as one.

**Recommendation: treat as a cluster, but do NOT collapse the profiles.** Collapsing fights the hub's design (`_index.md:8` "these per-model profiles are the WEIGHT") and the 1:1 registry mirror (`SKILL.md:142`). Instead:
1. **DRY the shared rationale (ties to iter-3 R10).** Factor the repeated "why RCAF + medium for an unverified small coding model" passage into ONE shared note — either a `references/models/_default-unverified-contract.md` or an expanded `_index.md` status-legend block — and have the four profiles' §2/§3 *link* to it rather than restate it. Cuts four copies of the same guardable claim to one, shrinking drift surface.
2. **Single card-link block for the cluster** in `_index.md` (they share framework, density, status, and — per §3 above — the same cli-opencode discovery gap). This is exactly the "shared note + single card link" shape, and it converges with the discovery fix: the same four models are the templated clones AND the cli-opencode-invisible set. swe-1.6 is default-unverified too but is NOT in this cluster — it is the documented entry/default model with a working cli-devin trigger, so keep it individual.

---

## New findings

- **NF-4-A (headline): STAR phantom-framework contradiction cluster.** A non-existent framework is asserted as canonical in three canonical surfaces (`swe-1.6.md:83` false registry claim; `_index.md:21` mis-columned; `SKILL.md:150` mis-attributed home), all traceable to "fallback" meaning two different things across the cli-devin↔hub boundary. This is simultaneously a data↔prose drift (Task 1) and a Layer-1↔2 seam defect (Task 2) — the cleanest single defect this iteration, and not in the iter 1-3 set.
- **NF-4-B: cli-opencode is unreachable-by-model-name for its own opencode-go models.** deepseek/kimi/qwen/glm route through cli-opencode but cannot be discovered through it; qwen3.6 (sole-executor) is fully hub-only. The defect is symmetric with the iter-3 hub-intent gap but lives on the *executor* side and was not previously flagged.
- **NF-4-C: cluster ⇄ discovery convergence.** The four templated default-unverified profiles are exactly the four cli-opencode-invisible models. One remediation (cluster card block + cli-opencode triggers) closes both the navigability dead-spot and the discovery gap — they are one structural problem, not two.
- **NF-4-D (positive): the enhances graph is already bidirectional and complete** (only the context strings + timestamps are stale). Iter-3's "stale graph-metadata" is about freshness/intent, not missing edges — worth narrowing so remediation doesn't over-scope to "rebuild edges."

---

## Refinement list extension (R16+)

| # | Refinement | Tag | Kind |
| --- | --- | --- | --- |
| **R16** | Kill the STAR phantom. `swe-1.6.md:83` → state `fallback: null`, STAR = cli-devin task-shape (not a registry fallback). `_index.md:21` → `RCAF; no registry fallback` (match the other default-unverified rows + JSON). `SKILL.md:150` → drop STAR from the "defined in sk-prompt" list or mark it "cli-devin task-shape." | **P1** | structural |
| **R17** | Disambiguate "fallback" hub-wide: reserve it for the registry `recommended_frameworks.fallback` id; rename cli-devin task-shape swaps to "task-shape option" in hub surfaces. Add one glossary line to `_index.md` status legend. Root-cause fix for R16; pairs with iter-3 R10. | **P2** | structural |
| **R18** | cli-opencode discovery: add `deepseek/deepseek-v4/kimi/kimi-k2.6/qwen/qwen3.6/glm/glm-5.1` to `cli-opencode/graph-metadata.json` `derived.trigger_phrases`; bump `last_updated_at`. Closes qwen3.6 hub-only gap + reveals the opencode-go alternate for the other three. | **P1** | structural |
| **R19** | Hub intent parity: add `minimax-m3`/`minimax-2.7`/`mimo-v2.5-pro` (or `minimax`/`mimo`) to `sk-prompt-small-model/graph-metadata.json` `intent_signals` + `derived.intent_signals`. Extends iter-3's trigger-only fix to the intent channel. | **P2** | structural |
| **R20** | Refresh stale hub `enhances` context (`graph-metadata.json:17`) to include MiniMax + MiMo on the cli-opencode edge; bump `last_updated_at`/`created_at` off `2026-05-18`. Re-index advisor after R18-R20. | **P2** | cosmetic |
| **R21** | Default-unverified cluster DRY: extract the shared RCAF+medium rationale to one `_default-unverified-contract.md` (or `_index.md` block) the four profiles link to; add a single cluster card-link block. Keep profiles individual. Converges with R18. | **P2** | structural |
| **R22** | Down→up provenance residue (`sk-prompt/changelog/v1.3.1.0.md` names deepseek/kimi/swe-1.6): engine surface is clean; recommend **no change** (changelog is immutable history) — log as accepted, not remediated. | **P2** | cosmetic |

**No P0s this iteration** — every defect is documentation/discovery integrity; none breaks dispatch, data, or the verified 8/8 model⇄executor wiring. R16 and R18 are the load-bearing fixes (one per seam: data-contract, discovery).

---

NEW-INFO: high — the STAR phantom-framework contradiction (3 canonical surfaces, data↔prose + Layer-seam) and the cli-opencode unreachable-by-model-name gap (qwen3.6 hub-only) are both new, both evidenced to file:line, and converge with the prior navigability finding into a single remediable structure.
