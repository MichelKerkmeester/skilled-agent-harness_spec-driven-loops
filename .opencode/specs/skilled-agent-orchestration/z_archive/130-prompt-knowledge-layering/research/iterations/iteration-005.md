Understood — staying in plan mode. The iteration-5 deliverable is complete and persisted to the plan file; no repo files were touched (read-only synthesis pass, as required).

The plan file contains the full report in the mandated format: **Completeness audit** (with the three corrected conclusions + residual-risk table), **Convergence map** (thesis confirmed, qwen3.6 refinement), **Consolidated prioritized plan** (C1–C10 table, sequenced), **Keystone changes** (K1 pointer-ization, K2 guard+CI, K3 cluster), **Ruled-out directions**, **Target structure**, and a **Verification** section — ending with the convergence verdict:

> **NEW-INFO: medium** — no new defect class, but three accumulated conclusions corrected and two new facts surfaced.
> **CONVERGED: yes** — cluster thesis holds (one refinement), R1–R22 collapse to 10 items under 3 keystones, no surface likely hides a new defect class.

It's ready for your review in `/Users/michelkerkmeester/.claude-account2/plans/you-are-deep-research-iteration-lovely-tome.md`. Tell me how you'd like to proceed — e.g. approve to begin implementation (starting with keystone K1/C3), adjust priorities or scope, or have me first confirm the C7 dispatch-matrix unknown I flagged.

---
## Full report (from account-2 plan file)

# Deep-Research Iteration 5/5 — Consolidated Plan: sk-prompt-small-model ↔ cli-* refinement

## Context

**Research question:** How to further refine, structure, and connect `sk-prompt-small-model`
and the five `cli-*` executor skills (cli-devin, cli-codex, cli-claude-code, cli-gemini,
cli-opencode), and how they interconnect.

**Why this exists:** Iterations 1–4 found that the hub/executor split has drifted at its
seams — the same craft content is hand-copied into multiple cards (so it diverges), executor
mechanics have leaked back into hub profiles, four near-identical model profiles form a
navigability + discovery dead-spot, the new-provider checklist builds zero-weight entries,
and the one guard that exists is blind to most of these axes and is not even wired into CI.
The intended outcome is a single-ownership, pointer-based structure where each fact lives in
exactly one place and a guard makes that self-enforcing.

This iteration is the completeness-critic + synthesis pass: audit coverage, collapse the
R1–R22 backlog into a sequenced plan, lock in keystones, and rule out wrong turns. **The
plan below is the deliverable.** No repo files were modified.

Iteration-5 verification (this pass) **changed three accumulated conclusions** — see
Completeness audit; they are folded into the plan.

---

## Completeness audit (gaps + residual risk)

### Resolved this iteration (previously open / mis-stated)

| Item | Prior state | Verified result this pass |
|------|-------------|---------------------------|
| **STAR phantom locus** | Cited as `SKILL.md:150 asserts STAR canonical` | `sk-prompt/SKILL.md:38` + matrix `:257-265` confirm the **closed 7** = RCAF/COSTAR/RACE/CIDI/TIDD-EC/CRISPE/CRAFT — **STAR absent**. So `sk-prompt-small-model/SKILL.md:150` listing STAR among "defined once in sk-prompt" **is** the phantom; second locus `swe-1.6.md:83` ("registry names…STAR as fallback") contradicts `swe-1.6.md:40-41` (`fallback: null`). Root cause = "fallback" overloaded across cli-devin↔hub. R16 **confirmed**, re-located. |
| **Guard automation** | Unknown if CI/hook-wired | `check-prompt-quality-card-sync.sh` is **MANUAL-ONLY** — zero references in `.github/workflows`, hooks, Makefile, package.json. Scans only the 5 cli cards for the framework table + CLEAR table; **blind to SKILL.md, trigger prose, card↔profile links, registry fidelity**. Confirmed on all axes. |
| **cli-opencode craft leak** | Accumulated finding: `cli-opencode card:22-25 prints hub-owned framework choices` | **Refuted.** cli-opencode's `assets/prompt_quality_card.md` explicitly delegates ("Do NOT copy them here", `:8-14`) and is the exemplar. The live craft-leak is **cli-devin SKILL.md:191 + :372** (restates RCAF/STAR/BUILD, softened by an "OWNED by" link). Boundary-leak finding re-pointed. |
| **New-provider checklist** | One checklist, omits profile/_index | **Two divergent checklists**: README-endorsed `pattern-index.md §4 (:66-77)` omits "author profile + add `_index.md` row + SKILL.md matrix row" (→ zero-hub-weight entry); a **second, conflicting** checklist at `SKILL.md §3 (:131-133)`. Both must be reconciled. |
| **graph-metadata rot** | `last_updated_at` stale (2026-05-18) | Confirmed + **deeper**: minimax/mimo present in `trigger_phrases` but **absent** from `intent_signals` and `enhances[].context`. |
| **Discovery severity** | All 4 (deepseek/kimi/qwen/glm) cli-opencode-invisible | Refined: cli-devin triggers **do** carry deepseek-v4/glm-5.1/kimi-k2.6, so those three have a discovery path; **qwen3.6 is the sole true orphan** (cli-opencode-exclusive, named in no executor's `trigger_phrases`). |

### Still unchecked — residual risk

| Gap | Worth follow-up? | Residual risk |
|-----|------------------|---------------|
| `cli-codex / cli-gemini / cli-claude-code` **card internals** (`assets/prompt_quality_card.md`) not read line-by-line | At implementation only | **Low** — the guard structurally covers framework/CLEAR-table inlining for all 5 cards; only trigger prose is uncovered, and that is C1's job. |
| Whether the guard currently **passes** (manual, last-run state unknown) | Run once during C9 | **Low** |
| `cli-*` skill **READMEs** (only `sk-prompt-small-model/README.md` verified — it is accurate) | No | **Low** |
| `sk-prompt/references/patterns_evaluation.md` (canonical 7-framework + CLEAR source) not read in full | No | **Low** — header + matrix corroborate the closed-7. |
| Whether the 4 cluster models are **cli-devin-dispatchable** (qwen absence in cli-devin triggers inferred, not confirmed) | **Yes — confirm before C7** | **Medium** — sets C7's exact scope (which model name goes in which executor's triggers). |
| `enhances`-graph completeness (R18 claimed complete+bidirectional) not re-verified this pass | No | **Low** |

**Honest residual:** no unexamined surface is likely to hide a new *class* of defect. The one
material implementation-time unknown is the C7 dispatch-matrix confirmation (Medium).

---

## Convergence map

**Thesis (from prompt):** `{deepseek, kimi, qwen, glm}` = navigability dead-spot =
cli-opencode-invisible = templated clones = default-unverified → ONE structural cluster
fixable by ONE coordinated change.

**Verdict: CONFIRMED, with one refinement.** The four models are verifiably (a) **templated
clones** (identical `status: default-unverified`, verbatim-shared rationale), (b) a
**card↔profile navigability dead-spot**, and (c) absent from cli-opencode `trigger_phrases`.
The single refinement: the *discovery* leg bites hardest on **qwen3.6 alone** (the others
are reachable via cli-devin triggers). The cluster is still **one** structural object fixable
by one coordinated change (C6+C7) — the discovery fix simply prioritizes qwen3.6.

Note: `default-unverified` is a **superset** (it also covers swe-1.6, which is *not* a clone
and is the gold-standard profile). The cluster is defined by **"templated clone"**, not by
status alone — do not let the fix sweep swe-1.6 in.

**Backlog collapse (duplicates / subsets):**
- STAR-phantom (SKILL.md:150) + swe-1.6 registry-fallback drift (:83) + `_index.md:21`
  mis-column = **one** root cause ("fallback" overloaded) → **C3** (+C4 cosmetic tail).
- "Precedence drift across 5 cards" + "re-sync the precedence rule" = the **same** symptom;
  the DRY rule (R10) says the cure is pointer-ization, not re-sync → **C1**.
- "navigability dead-spot" + "discovery gap" + "default-unverified cluster" + "templated
  clones" = **one** cluster → **C6 + C7**.
- "scaling checklist omits profile/_index" + "registry-completeness guard" + "two divergent
  checklists" = **C8** (fix the checklist) feeding **C9** (guard enforces it).
- "guard blind on 2 axes" + "guard manual-only" + R10-enforcement = **C9**.

R1–R22 collapse to **10 consolidated items** under **3 keystones**.

---

## Consolidated prioritized plan (table)

No P0s exist. Sequence runs top-to-bottom; later items depend on earlier ones as noted.

| ID | Action (one line) | Files touched | Priority | Type | Depends on |
|----|-------------------|---------------|----------|------|-----------|
| **C3** | Fix "fallback" overload: relabel STAR/BUILD as **cli-devin task-shapes** at `SKILL.md:150` (remove from sk-prompt framework list); fix `swe-1.6.md:83` to match `fallback: null` | `sk-prompt-small-model/SKILL.md`, `references/models/swe-1.6.md` | **P1** | structural | — |
| **C4** | Fix `_index.md:21` fallback mis-column (tail of C3) | `references/models/_index.md` | P3 | cosmetic | C3 |
| **C1** | Pointer-ize the Tier-3 precedence/escalation trigger in all 5 cli SKILL.md — delete the inlined list (`signal` vs `policy/audience`), point to canonical card | `cli-{devin,codex,claude-code,gemini,opencode}/SKILL.md` | **P1** | **keystone K1** | C3 |
| **C2** | Pointer-ize cli-devin's framework-choice restatement (`SKILL.md:191,:372`) — keep the "OWNED by" link, drop the RCAF/STAR/BUILD enumeration | `cli-devin/SKILL.md` | P2 | keystone K1 | C3 |
| **C5** | Defer mechanics: replace embedded `opencode run` wrappers in `mimo-v2.5-pro.md:143-153` + `minimax-m3.md:124-135` with rule + pointer (gold pattern = `swe-1.6.md:182-184`) | `references/models/{mimo-v2.5-pro,minimax-m3}.md` | P2 | structural | — |
| **C6** | Cluster DRY + navigability: extract the shared `default-unverified` note + single card-link block for the 4 clones; add bidirectional card↔profile links — **do not merge profiles** | 4 cluster profiles, `cli-devin`/`cli-opencode` cards | P2 | **keystone K3** | — |
| **C7** | Discovery: add dispatchable model names to executor `trigger_phrases` — **qwen3.6 → cli-opencode** (orphan); confirm deepseek/kimi/glm coverage | `cli-opencode/graph-metadata.json` (+`cli-devin` if gaps) | P2 | keystone K3 | confirm dispatch matrix |
| **C8** | Complete + reconcile the new-provider checklist: `pattern-index §4` must include author-profile + `_index` row + SKILL.md matrix row; delete/merge the divergent `SKILL.md §3` copy | `references/pattern-index.md`, `SKILL.md` | **P1** | structural (K2 prep) | — |
| **C9** | Extend + **CI-wire** the sync guard: add (a) pointer-only / no-inlined-Tier-3-list check incl. SKILL.md, (b) registry↔profile↔`_index` 3-way completeness, (c) discovery-reachability check; add to CI/hook | `check-prompt-quality-card-sync.sh`, CI/hook config | **P1** | **keystone K2** | C1, C8 |
| **C10** | Refresh `graph-metadata.json`: `last_updated_at` + `intent_signals` + `enhances[].context` (add minimax/mimo) | `sk-prompt-small-model/graph-metadata.json` | P3 | cosmetic | — |

---

## Keystone changes (3)

These three, done first, make the remaining items mechanical or self-enforcing:

1. **K1 — Apply R10 guardable-restatement (pointer-ization).** Restate a fact only at the
   one 1:1 machine-diffable surface (profile↔registry row; canonical card holds the single
   precedence list). Everywhere else (5 SKILL.md, cli-devin framework choices) → pointer.
   Test: *"if the source changed tomorrow, would this line be wrong? → pointer-ize."* This
   single principle dissolves C1, C2, and the precedence-drift symptom, and pre-empts future
   drift. **Do this before C9** so the guard has a clean state to lock.

2. **K2 — Extend the guard and wire it into CI (C8 → C9).** Today the guard checks 2 table
   shapes across 5 cards, manually. Extend it to enforce pointer-only craft (incl. SKILL.md),
   registry↔profile↔`_index` 3-way completeness, and discovery reachability; then wire it
   into CI/a hook. This converts K1 and the corrected checklist from "true today" into
   "cannot regress." Without this, every other fix re-drifts.

3. **K3 — One coordinated cluster treatment for `{deepseek, kimi, qwen, glm}` (C6 + C7).**
   The navigability dead-spot, the discovery gap, and the templated-clone duplication are
   one object. Fix once: shared DRY note + single card-link block + bidirectional links +
   qwen3.6 discovery trigger. Keeps four distinct profiles (registry 1:1 fidelity + future
   independent benchmarking) while removing the duplication and the dead-spot.

---

## Ruled-out directions

- **Do NOT collapse the 4 profiles into one.** The profile↔registry row is the *one*
  legitimate machine-diffable restatement surface (R10); a 1:1 profile-per-registry-entry
  mapping is exactly what C9's completeness guard relies on, and each profile must stay ready
  to diverge once benchmarked. DRY the shared **note**, not the profiles.
- **Do NOT re-sync the 5 hand-copies of the precedence rule.** Re-aligning the `signal` vs
  `policy/audience` wording treats the symptom; hand-copies re-drift. Pointer-ize (K1).
- **Do NOT move `model-profiles.json`.** It is the canonical registry at the hub; every
  profile's relative link and the completeness guard depend on its location. Moving it breaks
  all links for no benefit.
- **Do NOT add STAR/BUILD as sk-prompt frameworks.** sk-prompt's 7-framework set
  (RCAF/COSTAR/RACE/CIDI/TIDD-EC/CRISPE/CRAFT) is deliberately closed. STAR/BUILD are
  cli-devin task-shapes; adding them would legitimize the phantom instead of fixing it.
  Relabel references; keep them cli-devin-local.
- **Do NOT make the guard parse prose semantically (NLP).** Keep C9 structural —
  pointer-presence, table-absence, registry-completeness, trigger-membership. A semantic
  prose-matcher is over-engineering and brittle.
- **Do NOT blanket-add deepseek/kimi/qwen/glm to every executor's triggers.** Add a model
  name only to the executor that actually dispatches it (avoid mis-routing). The real gap is
  qwen3.6 in cli-opencode; confirm the rest before touching.
- **Do NOT sweep swe-1.6 into the cluster treatment.** It shares `default-unverified` status
  but is the gold-standard, non-clone profile. The cluster is the 4 templated clones only.

---

## Target structure

`sk-prompt` owns the **closed 7-framework** definitions + CLEAR + the canonical
`cli_prompt_quality_card.md` (single precedence list + Tier-3 trigger prose).
`sk-prompt-small-model` owns the per-model **prompt-craft profiles** (`references/models/*.md`),
the **registry** (`assets/model-profiles.json`), and the always-loaded `_index.md` — and
restates only at the one 1:1 machine-diffable surface (profile↔registry row). The five
`cli-*` executors own **only mechanics** (binary flags, invocation wrappers, budgets,
permissions) and **point** to the canonical card for craft and to the hub profiles for
per-model choices — restating nothing craft-side. STAR/BUILD live solely as cli-devin
task-shapes. The extended, CI-wired guard protects three invariants: (a) no `cli-*`
card/SKILL.md inlines the framework table, CLEAR table, or Tier-3 trigger list (pointer-only);
(b) registry↔profile↔`_index` 3-way completeness (no zero-weight entries); (c) every
dispatchable model name is reachable via its executor's `trigger_phrases`. The
`{deepseek, kimi, qwen, glm}` cluster shares one DRY default-unverified note + one card-link
block with bidirectional card↔profile links, while remaining four distinct profiles.

---

## Verification (for the eventual implementation)

1. **Guard, extended (C9):** run `bash .../system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh`
   from repo root → exit 0; deliberately inline a framework table / Tier-3 list / drop an
   `_index` row → expect non-zero exit (proves new axes fire). Confirm the CI/hook entry runs it.
2. **STAR phantom (C3):** grep the repo for `STAR` near "sk-prompt"/"registry"/"framework";
   every hit must read as a cli-devin task-shape, none as a sk-prompt framework or registry
   fallback. `swe-1.6.md:83` must agree with `fallback: null`.
3. **Pointer-ization (C1/C2):** no `cli-*` SKILL.md contains the Tier-3 trigger enumeration
   or RCAF/STAR/BUILD choices — only links to the canonical card / profile.
4. **Cluster + discovery (C6/C7):** the 4 clones each have a card↔profile round-trip link;
   `advisor_recommend` (skill advisor) on a prompt naming "qwen3.6" surfaces cli-opencode.
5. **Metadata (C10):** `last_updated_at` current; `intent_signals` + `enhances[].context`
   include minimax/mimo; re-run advisor rebuild and confirm no rot warnings.

---

NEW-INFO: medium — no new defect *class*, but iteration 5 corrected three accumulated
conclusions (STAR locus, cli-opencode card is compliant, guard is manual-only) and surfaced
two new facts (divergent dual checklists, deeper graph-metadata rot).
CONVERGED: yes — the cluster thesis holds (one refinement: qwen3.6 is the sole discovery
orphan), R1–R22 collapse to 10 consolidated items under 3 keystones, and no surface remains
that is likely to hide a new defect class.
