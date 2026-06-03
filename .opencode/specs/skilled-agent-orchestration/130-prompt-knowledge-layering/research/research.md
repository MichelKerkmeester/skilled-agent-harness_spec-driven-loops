---
title: "Deep Research — Refining & Connecting sk-prompt-small-model ↔ cli-* Executors"
status: converged
executor: "claude2 (Claude account #2, claude-opus-4-8, read-only plan-mode)"
iterations: 5
converged: true
date: 2026-06-03
---

# Deep Research — Refining & Connecting `sk-prompt-small-model` ↔ the five `cli-*` executors

## 1. Research question

How to further refine, structure, and connect `sk-prompt-small-model` and the five `cli-*`
executor skills (`cli-devin`, `cli-codex`, `cli-claude-code`, `cli-gemini`, `cli-opencode`) —
the model-craft-hub ↔ executor-mechanics boundary, delegation/precedence, the per-model
profiles, and how they all interconnect.

This research investigates the 3-layer prompt-knowledge architecture **delivered by spec 130**
(`sk-prompt` framework engine → `sk-prompt-small-model` per-model hub → `cli-*` executor
mechanics) and asks where the seams have drifted and how to make the structure self-enforcing.

## 2. Method

- **Executor:** 5 sequential iterations dispatched to **claude2** — a separate Claude account
  (`CLAUDE_CONFIG_DIR=$HOME/.claude-account2`, `claude-opus-4-8`, `--permission-mode plan`,
  read-only). The native deep-research loop's `cli-claude-code` executor cannot target a second
  account (its config exposes only `model`/`reasoningEffort`/`sandboxMode`/`timeoutSeconds`), so
  the loop was driven manually while preserving the standard packet artifacts
  (`iterations/iteration-NNN.md`, accumulating `deep-research-state.jsonl`, this `research.md`,
  `resource-map.md`).
- **Per-iteration accumulation:** each iteration was seeded with the prior iterations' verified
  findings and pointed at a fresh lens, so iterations built forward rather than repeating.
- **Operator verification:** the main loop (this session) independently ground-truthed the two
  highest-impact finding clusters — the precedence drift and the STAR-phantom — by direct file
  reads, rather than trusting the sub-agent reports. Both confirmed.
- **Dispatch note:** the inline prompt initially suffered backtick command-substitution under
  `zsh -ic "...$P..."`; fixed by passing the prompt via a file (`"$(cat /tmp/iterN.txt)"` inside
  a single-quoted `zsh -ic`). With `--permission-mode plan`, claude2 streams the full report to
  account 2's plan file and returns a summary; the full reports were retrieved and appended to
  each `iteration-NNN.md`.

### Iteration trail

| Iter | Lens | NEW-INFO | Headline |
|------|------|----------|----------|
| 1 | Current-state map | high | Tier-3 precedence rule drifted in 4/5 SKILL.md; the sync guard never checks the precedence rule |
| 2 | Drift verify + boundary leaks + wiring matrix | high | Token-level drift confirmed; guard blind on 2 axes; **8/8 profiles reconcile** with the registry (corrected iter 1) |
| 3 | Navigability + DRY policy + scaling | high | **Guardable-restatement rule** (DRY keystone); new-provider checklist builds zero-hub-weight entries; bidirectional dead-spot on 4 models |
| 4 | Data↔prose + Layer-1↔2 seam + discovery | high | `swe-1.6` registry-fallback drift; **STAR phantom framework**; `qwen3.6` unreachable by model name |
| 5 | Completeness-critic + synthesis | medium · **converged** | R1–R22 collapse to C1–C10 under 3 keystones; corrected 3 accumulated conclusions |

## 3. Verified findings

Evidence is `file:line` at time of research (2026-06-03). ✅ = independently re-verified by the
main loop; ◇ = verified by the iteration agent (claude2) with file:line.

### F1 — Precedence-rule drift (the headline defect) ✅
Spec 130's intended "one identical 3-tier precedence rule in all 5 `cli-*/SKILL.md`" holds for
Tiers 1–2 but **drifted at Tier 3 in 4 of 5**:
- Canonical: `sk-prompt/assets/cli_prompt_quality_card.md:82-83` — *"Compliance, **policy**,
  privacy, or security **sensitivity**… More than one stakeholder **or audience**."*
- `cli-devin/SKILL.md:368` ✅ matches (hybrid: names *"any canonical Tier 3 trigger"* **and**
  enumerates the full list).
- `cli-opencode:315`, `cli-codex:357`, `cli-gemini:310`, `cli-claude-code:351` ✅ — all four
  **identical to each other but drifted**: dropped *"policy"*, dropped *"or audience"*, use
  *"signal"* instead of *"sensitivity"*.
- The *"or audience"* omission is the sharp one: COSTAR is the audience-aware framework and
  MiMo-V2.5-Pro's empirical winner, so the drop weakens escalation for exactly the model that
  needs it.

### F2 — The sync guard is blind and unautomated ✅◇
`system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh` checks only the
framework table + CLEAR table across the 5 cli cards. It is blind on multiple axes: **never
scans SKILL.md, never checks the Tier-3 trigger prose, never checks card↔profile links, never
checks registry fidelity** — which is why F1 went unnoticed. Iteration 5 confirmed it is
**manual-only**: zero references in `.github/workflows`, hooks, Makefile, or package.json.

### F3 — STAR "phantom framework" (one root cause, three surfaces) ✅
`sk-prompt` defines a **closed set of 7 frameworks** (RCAF/COSTAR/RACE/CIDI/TIDD-EC/CRISPE/CRAFT;
`sk-prompt/SKILL.md:38`, matrix `:257-265`) — STAR is **not** among them. STAR/BUILD are genuine
**`cli-devin` task-shapes**. The overloaded word "fallback" leaked STAR into hub surfaces as if
it were a registry fallback / canonical framework:
- `sk-prompt-small-model/SKILL.md:150` ✅ lists `STAR` among frameworks "defined once in
  sk-prompt" — false.
- `references/models/swe-1.6.md:84` ✅ — *"The registry names RCAF as primary and STAR as
  fallback"* — false; registry `recommended_frameworks.fallback` is `null`, and it contradicts
  the profile's **own** §2 (`:40-41`).
- `references/models/_index.md:21` ✅ — column reads `RCAF; STAR fallback` vs siblings'
  `RCAF; no fallback`.

### F4 — Boundary leaks (re-pointed by iter 5) ◇
- **Hub → mechanics:** `mimo-v2.5-pro.md:143-153` and `minimax-m3.md:124-135` embed full
  executable `opencode run` wrappers, contradicting their own §1 "mechanics live in cli-*"
  headers. The other 6 profiles defer correctly (gold standard `swe-1.6.md:182-184`).
- **cli → craft:** the live leak is **`cli-devin/SKILL.md:191` + `:372`** (restates
  RCAF/STAR/BUILD). Iteration 5 **refuted** the earlier suspicion that `cli-opencode`'s card
  leaks — that card explicitly delegates (*"Do NOT copy them here"*, `:8-14`) and is the exemplar.

### F5 — Wiring reconciles; the gap is card-side links ◇
All **8/8** profiles name their executors and reconcile with `model-profiles.json` `executors[]`
(this corrected iter 1's claim that profiles omit their dispatch path). The real gap is
navigation **into** the profiles: the `cli-opencode` card bundles deepseek/kimi/qwen/glm into a
directory-only pointer while `cli-devin` links all four directly → a **bidirectional card↔profile
dead-spot** on those four models.

### F6 — The `{deepseek, kimi, qwen, glm}` cluster is one structural object ◇
The four models are simultaneously: templated clones (identical `status: default-unverified`,
verbatim-shared rationale), the card↔profile navigability dead-spot (F5), and absent from
`cli-opencode` `trigger_phrases`. Refinement from iter 5: the *discovery* leg bites hardest on
**`qwen3.6` alone** — it is `cli-opencode`-exclusive and named in no executor's triggers (the
sole true orphan); deepseek/kimi/glm remain reachable via `cli-devin` triggers. `default-unverified`
is a **superset** (it also covers the gold-standard `swe-1.6`) — the cluster is defined by
"templated clone," not by status.

### F7 — New-provider scaling builds zero-weight entries ◇
There are **two divergent** new-provider checklists: the README-endorsed `pattern-index.md §4`
(`:66-77`) and a conflicting one at `SKILL.md §3` (`:131-133`). The `pattern-index` version omits
"author the profile + add the `_index.md` row + add the SKILL.md matrix row," so following it
literally creates a registry entry with **zero hub weight**. A real 9th model touches ~6–9 files.

### F8 — Discovery-metadata rot ◇
`sk-prompt-small-model/graph-metadata.json`: minimax/mimo are present in `trigger_phrases` but
**absent** from `intent_signals` and `enhances[].context`; `last_updated_at` frozen at
`2026-05-18`. The `enhances` edge graph itself is complete and bidirectional (iter 3's "stale" was
freshness, not missing edges).

## 4. Convergence map

**Thesis (confirmed):** `{deepseek, kimi, qwen, glm}` = navigability dead-spot =
cli-opencode-invisible = templated clones — **one** structural cluster fixable by one coordinated
change (with qwen3.6 prioritized for discovery). The R1–R22 backlog collapses:
- F3 (STAR-phantom + swe-1.6 drift + `_index` mis-column) = one root cause → **C3** (+C4 tail).
- F1 (precedence drift) + "re-sync the rule" = same symptom; the cure is pointer-ization → **C1**.
- F5/F6 (navigability + discovery + clones) = one cluster → **C6 + C7**.
- F7 (checklist gaps + divergent checklists) → **C8**, enforced by the guard → **C9**.
- F2 (guard blind + manual) + DRY-enforcement → **C9**.

## 5. Consolidated prioritized plan (C1–C10)

No P0s. Sequence runs top-to-bottom; later items depend on earlier ones as noted.

| ID | Action | Files | Priority | Type | Depends on |
|----|--------|-------|----------|------|-----------|
| **C3** | Fix the "fallback" overload: relabel STAR/BUILD as **cli-devin task-shapes** at `SKILL.md:150` (remove from the sk-prompt framework list); fix `swe-1.6.md:84` to match `fallback: null` | hub `SKILL.md`, `swe-1.6.md` | **P1** | structural | — |
| **C4** | Fix `_index.md:21` fallback mis-column (tail of C3) | `_index.md` | P3 | cosmetic | C3 |
| **C1** | Pointer-ize the Tier-3 precedence trigger in all 5 cli `SKILL.md` — delete the inlined list, point to the canonical card | 5× `cli-*/SKILL.md` | **P1** | **K1** | C3 |
| **C2** | Pointer-ize cli-devin's framework-choice restatement (`SKILL.md:191,:372`) — keep the "OWNED by" link, drop the RCAF/STAR/BUILD enumeration | `cli-devin/SKILL.md` | P2 | K1 | C3 |
| **C5** | Defer mechanics: replace embedded `opencode run` wrappers in `mimo-v2.5-pro.md:143-153` + `minimax-m3.md:124-135` with rule + pointer (gold: `swe-1.6.md:182-184`) | 2 profiles | P2 | structural | — |
| **C6** | Cluster DRY + navigability: extract the shared `default-unverified` note + one card-link block for the 4 clones; add bidirectional card↔profile links — **do not merge profiles** | 4 profiles, 2 cards | P2 | **K3** | — |
| **C7** | Discovery: add dispatchable model names to executor `trigger_phrases` — **qwen3.6 → cli-opencode** (orphan); confirm deepseek/kimi/glm coverage | `cli-opencode/graph-metadata.json` (+cli-devin if gaps) | P2 | K3 | confirm dispatch matrix |
| **C8** | Complete + reconcile the new-provider checklist: `pattern-index §4` must include author-profile + `_index` row + SKILL.md matrix row; delete/merge the divergent `SKILL.md §3` copy | `pattern-index.md`, hub `SKILL.md` | **P1** | structural (K2 prep) | — |
| **C9** | Extend + **CI-wire** the sync guard: add (a) pointer-only / no-inlined-Tier-3-list check incl. SKILL.md, (b) registry↔profile↔`_index` 3-way completeness, (c) discovery-reachability check; wire into CI/hook | guard script, CI/hook config | **P1** | **K2** | C1, C8 |
| **C10** | Refresh `graph-metadata.json`: `last_updated_at` + `intent_signals` + `enhances[].context` (add minimax/mimo) | hub `graph-metadata.json` | P3 | cosmetic | — |

## 6. Keystone changes (do these first)

1. **K1 — Apply the guardable-restatement (pointer-ization) rule.** Restate a fact only at the
   one 1:1 machine-diffable surface (profile↔registry row; the canonical card holds the single
   precedence list). Everywhere many-to-one (5 SKILL.md, cli-devin framework choices) → pointer.
   Mechanical test: *"if the source changed tomorrow, would this line be wrong? → pointer-ize."*
   Dissolves C1, C2, and the precedence-drift symptom; pre-empts future drift. Do before C9.
2. **K2 — Extend the guard and wire it into CI (C8 → C9).** Converts K1 + the corrected checklist
   from "true today" into "cannot regress." Without it, every other fix re-drifts. Keep it
   **structural** (pointer-presence, table-absence, registry-completeness, trigger-membership) —
   no semantic NLP.
3. **K3 — One coordinated cluster treatment for `{deepseek, kimi, qwen, glm}` (C6 + C7).** Shared
   DRY note + single card-link block + bidirectional links + the qwen3.6 discovery trigger.
   Keeps four distinct profiles (registry 1:1 fidelity + future independent benchmarking).

## 7. Ruled-out directions

- **Do NOT collapse the 4 profiles into one** — the profile↔registry row is the one legitimate
  machine-diffable restatement surface; the completeness guard depends on the 1:1 mapping, and
  each profile must stay ready to diverge once benchmarked. DRY the shared **note**, not the
  profiles.
- **Do NOT re-sync the 5 hand-copies of the precedence rule** — that treats the symptom and
  re-drifts. Pointer-ize (K1).
- **Do NOT move `model-profiles.json`** — it is the canonical registry at the hub; every profile
  link and the guard depend on its location.
- **Do NOT add STAR/BUILD as sk-prompt frameworks** — the 7-set is deliberately closed; STAR/BUILD
  are cli-devin task-shapes. Relabel, keep them cli-devin-local.
- **Do NOT make the guard parse prose semantically** — over-engineering and brittle; keep C9
  structural.
- **Do NOT blanket-add the 4 models to every executor's triggers** — add a model name only to the
  executor that actually dispatches it (avoid mis-routing). The real gap is qwen3.6 in cli-opencode.
- **Do NOT sweep `swe-1.6` into the cluster treatment** — it shares the status but is the
  gold-standard, non-clone profile.

## 8. Target structure (refined end-state)

`sk-prompt` owns the closed 7-framework definitions + CLEAR + the canonical
`cli_prompt_quality_card.md` (single precedence list + Tier-3 trigger prose).
`sk-prompt-small-model` owns the per-model prompt-craft profiles (`references/models/*.md`), the
registry (`assets/model-profiles.json`), and the always-loaded `_index.md` — restating only at the
one 1:1 machine-diffable surface (profile↔registry row). The five `cli-*` executors own **only
mechanics** and **point** to the canonical card for craft and to the hub profiles for per-model
choices — restating nothing craft-side. STAR/BUILD live solely as cli-devin task-shapes. An
extended, CI-wired guard protects three invariants: (a) no `cli-*` card/SKILL.md inlines the
framework table, CLEAR table, or Tier-3 trigger list (pointer-only); (b) registry↔profile↔`_index`
3-way completeness (no zero-weight entries); (c) every dispatchable model name is reachable via its
executor's `trigger_phrases`.

## 9. Residual risk (still unchecked)

| Gap | Follow-up? | Risk |
|-----|-----------|------|
| `cli-codex/cli-gemini/cli-claude-code` card internals not read line-by-line | At implementation | Low — guard covers table-inlining for all 5; only trigger prose uncovered (C1's job) |
| Whether the guard currently passes (manual, last-run unknown) | Run once during C9 | Low |
| Whether the 4 cluster models are cli-devin-dispatchable (qwen absence inferred) | **Yes — confirm before C7** | **Medium** — sets C7's exact scope |
| `sk-prompt/references/patterns_evaluation.md` not read in full | No | Low — header + matrix corroborate the closed-7 |

**Honest residual:** no unexamined surface is likely to hide a new *class* of defect. The one
material implementation-time unknown is the C7 dispatch-matrix confirmation (Medium).

## 10. Verification plan (for the eventual implementation)

1. **Guard, extended (C9):** run the guard from repo root → exit 0; deliberately inline a
   framework table / Tier-3 list / drop an `_index` row → expect non-zero exit; confirm the
   CI/hook entry runs it.
2. **STAR phantom (C3):** grep the repo for `STAR` near "sk-prompt"/"registry"/"framework"; every
   hit must read as a cli-devin task-shape. `swe-1.6.md:84` must agree with `fallback: null`.
3. **Pointer-ization (C1/C2):** no `cli-*` SKILL.md contains the Tier-3 enumeration or
   RCAF/STAR/BUILD choices — only links.
4. **Cluster + discovery (C6/C7):** each of the 4 clones has a card↔profile round-trip link; the
   skill advisor on a prompt naming "qwen3.6" surfaces cli-opencode.
5. **Metadata (C10):** `last_updated_at` current; `intent_signals` + `enhances[].context` include
   minimax/mimo; re-run advisor rebuild → no rot warnings.

## 11. Provenance

- Iteration reports (summary + full account-2 plan-file report appended):
  `research/iterations/iteration-001.md` … `iteration-005.md`.
- Accumulating state + operator-verification records: `research/deep-research-state.jsonl`.
- Source account-2 plan files (claude2): `synthetic-toast` (1), `parsed-globe` (2),
  `valiant-sprout` (3), `keen-brook` (4), `lovely-tome` (5).
- Operator-verified clusters: F1 (precedence drift) and F3 (STAR-phantom) re-read directly by the
  main loop.
