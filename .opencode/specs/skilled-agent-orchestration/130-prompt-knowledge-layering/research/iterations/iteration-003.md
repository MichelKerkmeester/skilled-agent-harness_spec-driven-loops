The iteration-3 deliverable is complete and written to the plan file. This is a read-only deep-research iteration (findings are the deliverable, no code to implement), so `ExitPlanMode` — which its own contract reserves for code-implementation plans, not research — does not apply here.

## Iteration 3 — summary of findings

**Navigability (3 routes traced with link lines):**
- `swe-1.6`/cli-devin and `minimax-m3`/cli-opencode are **clean, bidirectional** (gold standard — swe-1.6 has 3 forward links: card `:23` + SKILL `:191` + SKILL `:372`).
- `deepseek-v4-pro` is a **dead-spot**: on the cli-opencode leg the card↔profile link is broken in **both** directions — `cli-opencode card:25` is a dir-only pointer, and `deepseek-v4-pro.md:144-153` links only SKILL.md, never the card. Same for `kimi/qwen/glm` — the exact 4 "default-unverified" models.

**DRY rule (the open question, resolved):** the **guardable-restatement rule** — restate canonical content only at a surface with a 1:1, machine-diffable relationship to its source (the per-model profile mirrors the per-model registry row; the canonical card holds the single precedence list); everywhere many-to-one (5 cards, 5 SKILL.md), carry a pointer, not a copy. Mechanical test: "if the source changed tomorrow, would this line be wrong? → pointer-ize." This is the precondition for a registry-completeness guard.

**Hub entry-point:** good front door (dispatch matrix `:112-123`, loading levels `:89-94`) but the **matrix is a routing dead-end** (model names are plain text, no profile links) and the hub carries a **self-duplicated, divergent adoption checklist**.

**Scaling — severe new defect (NF-1):** the canonical, README-endorsed `pattern-index §4` checklist **omits authoring the profile and the `_index.md` row** — following it literally builds a registry entry with zero hub WEIGHT. A real 9th model touches **~6-9 files**, not "metadata-only." Seven concrete gaps (GAP-A..G), each tied to an iter-1-2 finding; the checklist provably can't catch the card-side under-linking, and `graph-metadata.json` proves it (minimax/mimo in `trigger_phrases:79` but absent from `intent_signals:38-51`, `last_updated_at` frozen `2026-05-18`).

**Refinements:** extended R1-R8 with **R9-R15** (R10 DRY rule = keystone; R15 registry-completeness guard = highest leverage, makes navigability + scaling invariants self-enforcing).

**NEW-INFO: high** — resolved the open DRY policy into a mechanically-applicable rule, found a severe new defect (canonical checklist omits the core artifact), and sharpened the established under-link into a bidirectional dead-spot on a precise 4-model cluster.

Full evidence-backed report is in `/Users/michelkerkmeester/.claude-account2/plans/you-are-deep-research-iteration-valiant-sprout.md` for iterations 4-5 / synthesis to build on.

---
## Full report (from account-2 plan file)

# Deep-Research Iteration 3 — Structural / Forward Lenses

**Question:** Refine, structure, and connect `sk-prompt-small-model` + the 5 `cli-*` executor skills.
**This iteration:** NAVIGABILITY · DRY-vs-self-containment policy · hub entry-point · SCALING. Builds on iter 1-2 (drifts/leaks taken as given, not re-derived).

**Method:** direct reads of the hub (`SKILL.md`, `references/pattern-index.md`, `references/models/_index.md`, `assets/model-profiles.json`, `graph-metadata.json`, `README.md`, 4 profiles), both cli cards, the canonical card, the relevant cli-`SKILL.md` precedence/forward-link blocks, and the sync guard. All claims carry `file:line`.

---

## Navigability traces (operator path end-to-end)

Path model = **cli-Y SKILL.md / card → hub profile (`references/models/X.md`) → registry (`model-profiles.json#X`) → back**. A route is "clean" only if every hop links the next AND the return links exist (profile→card, profile→SKILL).

### Route 1 — `minimax-m3` via `cli-opencode` — **CLEAN, bidirectional (gold standard)**

Forward:
- `cli-opencode/SKILL.md:314` (ALWAYS rule 7.2): *"If the target model has a profile at `../sk-prompt-small-model/references/models/<id>.md`, that profile OVERRIDES the cross-model default…"* — generic but resolvable.
- `cli-opencode/assets/prompt_quality_card.md:22`: `| MiniMax M3 (Token Plan default) | TIDD-EC + dense | ../../sk-prompt-small-model/references/models/minimax-m3.md |` — **direct per-model link**.
- Profile → registry: `minimax-m3.md:37-38` cites `model-profiles.json recommended_frameworks`; `minimax-m3.md:143` links `model-profiles.json#minimax-m3`.

Return:
- `minimax-m3.md:147` → `cli-opencode/assets/prompt_quality_card.md` ✓ · `:146` → `prompt_templates.md` ✓ · `:148` → hub `SKILL.md` ✓.

Verdict: **fully discoverable both ways.** Caveats are the *established* leaks, not navigability breaks: the card line prints the hub-owned choice "TIDD-EC + dense" (cli→craft leak), and `minimax-m3.md:124-135` embeds an `opencode run` wrapper (hub→mechanics leak). The *links themselves* are correct and complete.

### Route 2 — `deepseek-v4-pro` via `cli-devin` **AND** `cli-opencode` — **DEAD-SPOT (card↔profile broken both directions on the opencode leg)**

Via `cli-devin`:
- Forward: `cli-devin/assets/prompt_quality_card.md:26`: `… deepseek-v4-pro … ../../sk-prompt-small-model/references/models/deepseek-v4-pro.md` — direct ✓. Also `cli-devin/SKILL.md:367` generic profile link ✓.
- Return: `deepseek-v4-pro.md:150` → `cli-devin/SKILL.md` ✓ — but **NOT** the cli-devin card.

Via `cli-opencode`:
- Forward: `cli-opencode/assets/prompt_quality_card.md:25`: `| deepseek-v4-pro / kimi-k2.6 / qwen3.6 / glm-5.1 | default RCAF | ../../sk-prompt-small-model/references/models/ |` — **directory-only pointer; no per-file anchor** (operator must guess `deepseek-v4-pro.md`). Ambiguous fork.
- Return: `deepseek-v4-pro.md:151` → `cli-opencode/SKILL.md` ✓ — but **NOT** the cli-opencode card.

Registry reconciliation is fine: `SKILL.md:115` matrix enumerates 3 paths; `model-profiles.json:56-78` `executors[]` lists exactly those 3; profile §5 (`:126`,`:146`) cites the registry.

Verdict: **the card↔profile link is missing in BOTH directions for the opencode leg.** card→profile is dir-only (`card:25`), profile→card is absent (`deepseek-v4-pro.md:144-153` links only SKILL.md). New structural fact (below): this same 4-model cluster `{deepseek, kimi, qwen, glm}` is under-linked on *both* sides — they are second-class citizens in the link graph, exactly the "default-unverified" models.

### Route 3 — `swe-1.6` via `cli-devin` — **CLEAN, bidirectional, best-wired**

Forward (three independent forward links):
- `cli-devin/assets/prompt_quality_card.md:23`: `| … swe-1.6 | auto | RCAF | ../../sk-prompt-small-model/references/models/swe-1.6.md |` ✓
- `cli-devin/SKILL.md:191` (Default-Invocation contract) → `../sk-prompt-small-model/references/models/swe-1.6.md` ✓
- `cli-devin/SKILL.md:372` (ALWAYS rule 13 contract) → same profile ✓

Return:
- `swe-1.6.md:211` → cli-devin card ✓ · `:214` → templates ✓ · `:225` → `_index.md` ✓ · `:205` → `model-profiles.json#swe-1.6` ✓.

Verdict: **fully discoverable both ways; the strongest-wired model** (forward link appears 3×). Single-executor models with a dedicated contract or benchmark (swe-1.6, minimax-m3, mimo) are clean; the multi-executor default-unverified models are where the graph frays.

### Navigability summary

| Model (route) | card→profile | profile→card | profile→SKILL | Verdict |
|---|---|---|---|---|
| `swe-1.6` / cli-devin | per-file (`card:23`) | ✓ (`:211`) | ✓ (`:225` idx) | clean |
| `minimax-m3` / cli-opencode | per-file (`card:22`) | ✓ (`:147`) | ✓ (`:148`) | clean |
| `mimo-v2.5-pro` / cli-opencode | per-file (`card:24`) | ✓ (`:166`) | ✓ | clean |
| `deepseek-v4-pro` / cli-devin | per-file (`card:26`) | **✗** | ✓ (`:150`) | one-way |
| `deepseek-v4-pro` / cli-opencode | **dir-only (`card:25`)** | **✗** | ✓ (`:151`) | **dead-spot** |
| `kimi/qwen/glm` / cli-opencode | **dir-only (`card:25`)** | **✗** (`kimi:137`,`qwen:140` → templates only; `glm` → neither) | partial | **dead-spot** |

The link richness of a model tracks whether it earned an empirical benchmark / dedicated card row. Fix target = make the 4 default-unverified opencode-go models match the bidirectional template set by minimax/mimo/swe-1.6.

---

## DRY-vs-self-containment: the rule

**The open question:** should each `cli-*` SKILL.md/card RE-ENUMERATE the precedence rule + per-model framework choices (discoverable in place, drift-prone), or POINTER-IZE (DRY, indirection)?

**Evidence that decides it:**
- Re-enumeration of the **Tier-3 precedence list** across 5 SKILL.md is exactly where drift happened (iter 1-2: `cli-opencode:315`/`cli-codex:357`/`cli-gemini:310`/`cli-claude-code:351` dropped "policy"+"or audience"; only `cli-devin:368` matches canonical `cli_prompt_quality_card.md:81-85`).
- Re-enumeration of the **per-model framework choice** in the cards (`cli-opencode card:22-25` prints "TIDD-EC + dense"/"COSTAR + lean"/"default RCAF"; `cli-devin card:23-28` prints "RCAF") is the cli→craft leak.
- The sync guard (`check-prompt-quality-card-sync.sh:33-55`) protects **only** the 7-framework table + the CLEAR table, **only** in the 5 cards (`:57-63`). It does exact-table-shape matching — it structurally **cannot** cheaply verify a prose precedence list or a one-line framework label. So every re-enumeration outside those two tables is **unguarded → has drifted / will drift.**

### The rule (the "guardable-restatement" rule)

> **A downstream surface (cli-* SKILL.md or card) MAY restate canonical content ONLY at a surface that has a 1:1 relationship with its source AND can be machine-diffed against it. Everywhere the relationship is many-to-one, carry a POINTER, not a copy — because the only thing a cheap guard can verify there is the *presence of the pointer*, not the *fidelity of a copy*.**

Mechanical test, applied per candidate line:
> *"If `model-profiles.json` or the canonical precedence list changed tomorrow, would this line become wrong?"*
> **Yes → it is a copy of drift-prone DATA → replace with a pointer.** **No (pure routing/structure) → it may stay.**

Applied to the two cases in question:

1. **Precedence rule — POINTER-IZE.** Keep ONE canonical Tier-1/2/3 list in `sk-prompt/assets/cli_prompt_quality_card.md §5`. Each of the 5 cli surfaces carries a single pointer + a *value-free* one-line summary ("3 tiers: fast → model-override → @prompt-improver; trigger list canonical here →"). It must NOT restate the trigger values ("policy", "audience", "complexity ≥ 7"), which are the drift-prone specifics. The list is 5:1 (5 surfaces, 1 source) → uncheckable as copies → pointer only.

2. **Per-model framework choice — restate ONCE, in the profile only.** The choice is DATA (`model-profiles.json.recommended_frameworks`) and there is exactly ONE profile per model — a **1:1, machine-diffable** mapping. So the profile is the single legitimate restatement surface (it already cites the registry: e.g. `swe-1.6.md:52-57`, `minimax-m3.md:37-38`). The `cli-*` card must carry the **model→profile LINK only**, never the framework token/density. A label copied into N cards is an N:1 uncheckable fan-out — forbidden.

3. **Hybrid allowance (the discoverability concession):** a card MAY carry a one-line *routing* affordance ("MiniMax overrides cross-model defaults — read its profile"), but the line must be value-free (no framework name, no density, no trigger). Discoverability is served by the LINK landing the operator one hop away, not by duplicating the value.

**Why this resolves the tension:** discoverability-at-point-of-use is preserved (the card's per-model link is one click from the value); drift-risk is eliminated where it cannot be guarded (no value-bearing copies in many-to-one surfaces); and the guard's reach is *maximized* — it can be extended to diff the one profile against the one registry row (1:1) and to assert pointer-presence in the 5 surfaces (cheap), which is everything the policy needs. The rule is the precondition for R15 (registry-completeness guard) below.

---

## Hub entry-point assessment (`sk-prompt-small-model/SKILL.md`)

**Strong as a front door:**
- §1 WHEN TO USE (`:18-35`) — activation + keyword triggers, good discovery surface.
- §3 **Dispatch Matrix** (`:112-123`) — authoritative `model → executor → provider (quota pool) → status` table; this *is* the routing front door, and it reconciles 8/8 with `model-profiles.json` (`:125` footnote).
- §2 Resource Loading Levels (`:89-94`) — clear when-to-load trigger: ALWAYS `_index.md`; CONDITIONAL `<id>.md` "when dispatching a specific model". No ambiguity.
- §4 ALWAYS/NEVER/ESCALATE (`:139-158`) — crisp ownership rules.

**Structural gaps:**

1. **The dispatch matrix is a routing dead-end.** Model names in `:112-123` are plain text, not links — the operator who finds the model in the front-door table cannot click through to its profile; they must detour to `_index.md`. The natural entry artifact doesn't reach the WEIGHT. **Fix:** hyperlink each matrix model cell → `references/models/<id>.md` (profiles already back-link to SKILL.md, so this closes the loop).

2. **The hub duplicates its own adoption checklist — and the copies disagree.** `SKILL.md §3 "Adopting a New Provider" (:131-133)` inlines a 5-step checklist; `references/pattern-index.md §4 (:66-77)` has a *different* 6-step one; `README.md:29,234` endorses the pattern-index one; `SKILL.md:94` points a *third* way ("see README"). A front door must have ONE adoption path (this is itself an instance of the DRY rule). See Scaling for the concrete divergence.

3. **No stated "operator recipe."** The path "given model X + executor Y, read cli-Y SKILL/card → `references/models/X.md` → `model-profiles.json#X`" is reconstructable but never written as a numbered recipe. The §2 flow (`:62-69`) is generic. Adding the 3-step recipe (and the 3 worked routes above) would harden the front door.

Overall: a **good** front door for "which executor/provider/status" and "where's the prompt-craft," but a **dead-end into the profiles** and carrying a **self-duplicated, divergent** adoption checklist.

---

## Scaling / new-provider checklist gaps

**Two divergent checklists exist; the README-endorsed one is the *less* complete.**

`SKILL.md §3 (:131-133)`: registry stub → **profile** → **`_index.md` row** → optional fallback+trigger-phrases → re-index.
`pattern-index §4 (:66-77)`: registry stub → optional fallback → trigger-phrases → mark **pattern-index** rows → re-index → **verify routing**.

They do not even share the same steps. README (`:29`,`:190-191`,`:234`) sends operators to the pattern-index 6-step — which **omits authoring the profile and omits the `_index.md` row**. Following the canonical path literally yields a registry entry with **no hub WEIGHT and no always-loaded index row.** (`_index.md` is ALWAYS-loaded per `SKILL.md:91`.) This is the most severe scaling defect.

**For a real 9th model (`foo-1`, new provider, existing quota-pool, existing framework) the minimum file set is ~6-9 — NOT "metadata-only, no code edits" as both checklists claim (`pattern-index:77`, `SKILL.md:133`).** Dependency-correct order:

1. `assets/model-profiles.json` — registry entry. *(both ✓)*
2. `references/models/foo-1.md` — profile from template, mirrors+cites registry. *(SKILL ✓; **pattern-index ✗**)*
3. `references/models/_index.md` — new row. *(SKILL ✓; **pattern-index ✗**)*
4. `SKILL.md §3` dispatch-matrix row (`:112-123`). *(**neither**)*
5. `references/pattern-index.md` §2 row if model-specific guidance. *(pattern-index ✓ partial)*
6. `cli-X/assets/prompt_quality_card.md §2` override row with **per-model** profile link. *(**neither**)*
7. `foo-1.md §See Also` back-links: profile→card + profile→cli-X SKILL.md. *(**neither**)*
8. `graph-metadata.json`: `trigger_phrases` **AND** `intent_signals` (`:38-51`) **AND** `enhances[].context` (`:12,17`) **AND** `manual.related_to` (`:26-29`, if new executor) **AND** `causal_summary`+`last_updated_at` (`:119,125`). *(checklist says **trigger_phrases only**)*
9. *(if new framework)* `sk-prompt/assets/cli_prompt_quality_card.md` table + `sk-prompt/references/patterns_evaluation.md` definition. *(**neither**)*
10. Re-index advisor + verify routing. *(pattern-index ✓; SKILL partial)*

**Concrete gap list (each tied to an iter-1-2 finding):**

- **GAP-A (severe, NEW):** the canonical (README-endorsed) `pattern-index §4` never says to author the profile or add the `_index.md` row — it builds the registry without the hub's core artifact.
- **GAP-B (NEW):** neither checklist updates the `SKILL.md §3` dispatch matrix → front-door table goes stale (ties to entry-point gap #1).
- **GAP-C (NEW, the one iter prompt predicted):** neither creates the card override row nor the profile→card back-link → a new model is **born into the same dead-spot** `{deepseek,kimi,qwen,glm}` occupy. The checklist *cannot* catch the card-side under-linking — confirmed.
- **GAP-D (NEW):** `graph-metadata` step protects only `trigger_phrases`; `intent_signals`/`enhances.context`/`causal_summary` already rotted — minimax/mimo are in `trigger_phrases (:79-92)` but **absent** from `intent_signals (:38-51)` and `enhances[].context (:17)`, and `last_updated_at` is frozen at `2026-05-18 (:125)` despite minimax (120/003) + mimo (126/004) post-dating it. Live proof the gap bites.
- **GAP-E (NEW):** no "new-framework branch" — if `foo-1` wants a framework/density outside the canonical 7-set, there's no step to update `sk-prompt`'s table or the precedence card, and the guard won't catch a profile citing an undefined framework.
- **GAP-F:** the two checklists disagree and README endorses the weaker one → "follow the checklist" is ambiguous. Consolidate to one (pattern-index), make SKILL.md §3 + README + `SKILL.md:94` pointer to it (DRY-rule instance).
- **GAP-G:** "verify routing" (`pattern-index:75`) checks only that the advisor surfaces the skill — not that the new card↔profile links resolve. Upgrade to a link/registry-completeness check (→ R15).

---

## New findings (beyond iter 1-2)

- **NF-1 (severe):** `pattern-index §4` — the canonical, README-pointed adoption checklist — **omits authoring the profile and the `_index.md` row** (`:66-77` vs `SKILL.md:131-133`). It would produce a hub entry with zero WEIGHT and a missing always-loaded index row.
- **NF-2:** **Three** divergent adoption references in the hub (`SKILL.md §3 :131-133` 5-step · `pattern-index §4 :66-77` 6-step · `README :29` defer + `SKILL.md:94` "see README"); the 5-step and 6-step disagree on which steps exist.
- **NF-3 (sharpens the established card-side under-link):** the profile→card back-link is **absent for the same 4-model cluster** the card under-links — `deepseek-v4-pro.md:144-153`, `kimi-k2.6.md:137`, `qwen3.6.md:140` link templates/SKILL but not the card; `glm-5.1.md` links neither. The dead-spot is **bidirectional**, not one-way.
- **NF-4:** `graph-metadata.json` carries **two parallel keyword lists** (`intent_signals :38-51` and `derived.trigger_phrases :53-92`) with **different coverage**; only `trigger_phrases` was kept current. `enhances[].context (:12,17)` and `causal_summary (:119)` never mention MiniMax/MiMo/Xiaomi at all. Maintenance hazard the checklist doesn't address.
- **NF-5:** sync-guard scope confirmed precisely — `check-prompt-quality-card-sync.sh` scans **only** the 5 cards (`:57-63`) for **only** the framework table (`:33-34`) and CLEAR table (`:35,44-55`). It is blind to: SKILL.md, precedence prose, framework-choice labels, card↔profile links, `_index`/matrix rows, registry↔profile fidelity.
- **NF-6 (entry-point):** the `SKILL.md §3` dispatch matrix (`:112-123`) names models as plain text — no model→profile links — so the front-door table is a routing dead-end into the WEIGHT.

---

## Updated refinement list (R1-R8 reconstructed from ESTABLISHED; R9-R15 new — structural / cosmetic tagged)

| # | Refinement | Type |
|---|---|---|
| R1 | Restore/repair Tier-3 precedence ("policy"+"or audience") in cli-opencode:315 / cli-codex:357 / cli-gemini:310 / cli-claude-code:351 — **prefer pointer-izing over re-adding words** (see R10) | structural (cosmetic if merely re-added) |
| R2 | Extend sync guard to its 2 blind axes — scan SKILL.md + check trigger/precedence prose | structural |
| R3 | Remove hub→mechanics leak — strip `opencode run` wrappers from `mimo-v2.5-pro.md:143-153` + `minimax-m3.md:124-135`; replace with pointer to `cli-opencode` templates | structural |
| R4 | Remove cli→craft leak — drop hub-owned framework choices from `cli-opencode card:22-25` + `cli-devin card:23-28`; link only | structural |
| R5 | Fix card-side under-link — `cli-opencode card:25` → per-model links for deepseek/kimi/qwen/glm (match cli-devin) | structural |
| R6 | Split pattern-index "Shipped In" — separate phase# from benchmark IDs; explicit shipped-vs-roadmap status column | cosmetic |
| R7 | Reconcile canonical card §7 "5 mirrors" (`:114`) vs §8 lists 3 (`:133-135`) — add cli-devin + cli-opencode to §8 | cosmetic |
| R8 | Reconcile pattern-index §7 mirror count / status semantics with canonical card | cosmetic |
| **R9** | **Repair the bidirectional dead-spot for `{deepseek,kimi,qwen,glm}`:** card→profile per-model links (R5 from one side) **+** add profile→card back-link in each §See Also (NF-3). Use minimax/mimo/swe-1.6 as the bidirectional template. | **structural** |
| **R10** | **Adopt the guardable-restatement DRY rule:** precedence = one canonical list + value-free pointers (kills R1's drift class); per-model framework choice = profile-only mirror (1:1, machine-diffable); cards carry link not label. | **structural** |
| **R11** | **Consolidate the 3 adoption references into ONE** canonical checklist in `pattern-index §4`; `SKILL.md §3`+`:94`+README pointer to it. **Fix NF-1:** add the missing "author profile" + "`_index.md` row" steps. | **structural** |
| **R12** | **Complete the checklist** — add steps for SKILL.md matrix row (GAP-B), card override + profile back-link (GAP-C), full graph-metadata field set not just trigger_phrases (GAP-D), and a new-framework branch (GAP-E). | **structural** |
| **R13** | **Hyperlink the SKILL.md §3 dispatch-matrix model cells → `references/models/<id>.md`** (NF-6; closes the front-door→profile loop). | **structural** |
| **R14** | **Refresh stale `graph-metadata.json` now** — `intent_signals`, `enhances[].context`, `manual.related_to`, `causal_summary`, `last_updated_at` to include MiniMax/MiMo/Xiaomi/Qwen (NF-4). | cosmetic (data) |
| **R15** | **Registry-completeness guard (highest leverage):** extend the sync guard to assert every `model-profiles.json` model has (a) a profile file, (b) an `_index.md` row, (c) a card override row with a per-model link, (d) a profile→card back-link, (e) a SKILL.md matrix row. Converts the navigability (R9/R13) + scaling (R11/R12) invariants into machine-checked guarantees. **R10 is its precondition** (it only works once restatement is 1:1). | **structural** |

**Sequencing note:** R10 (DRY rule) is the policy keystone → unblocks R1/R4 (pointer-ize) and R15 (guardable). R11→R12 fix the checklist that *creates* future drift. R9/R13 fix the existing link graph. R15 makes all of it self-enforcing. Cosmetic items (R6/R7/R8/R14) are independent and cheap.

---

**NEW-INFO: high** — Resolved the explicit open question into a mechanically-applicable rule (R10), surfaced a *severe new* defect (NF-1: the canonical adoption checklist omits the hub's core artifact), sharpened the established under-link into a *bidirectional* dead-spot on a precise 4-model cluster (NF-3), and identified a single high-leverage structural fix (R15) that makes the navigability + scaling invariants self-enforcing — all new, actionable, and beyond iter 1-2's drift catalogue.
