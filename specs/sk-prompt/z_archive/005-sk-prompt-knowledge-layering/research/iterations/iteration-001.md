This is a research task (mapping current state, not planning code), so per the ExitPlanMode guidance I won't call it — the deliverable is the findings report, now written to the plan file.

## Iteration 1 complete — findings summary

I mapped the 3-layer architecture and verified the highest-value claims directly (the sub-agents' detailed quotes proved partly unreliable, so I confirmed the spine myself). Full report with file:line evidence is in the plan file.

**The headline finding (✅ verified across all 5 SKILL.md):** the "identical 3-tier precedence rule in each cli-*" premise holds for **Tier 1-2 but breaks at Tier 3 in 4 of 5 executors.**
- Canonical triggers (`sk-prompt/assets/cli_prompt_quality_card.md:82-83`): *"compliance, **policy**, privacy, or security **sensitivity** … >1 stakeholder **or audience**."*
- `cli-devin:368` **matches** canonical. `cli-opencode:315`, `cli-codex:357`, `cli-gemini:310`, `cli-claude-code:351` **all drifted** — dropped "policy" + "or audience", use "signal" not "sensitivity". This is the opposite of what one sub-agent assumed (it treated cli-opencode as canonical).
- The drift is invisible because the duplication guard (`check-prompt-quality-card-sync.sh`) only checks the framework/CLEAR tables, **not** the precedence rule.

**What works well:** Tier-2 hub link is perfectly identical across all 5 (`:314/:367/:356/:309/:350`); cards are genuinely thin (cli-codex = 28 lines) and delegate correctly; ownership boundary is explicitly written; benchmark relocation is complete (all 6 dirs present in `benchmarks/`).

**Top refinement opportunities (ranked):**
1. **R1** — Re-sync the 4 drifted Tier-3 lines; better, stop re-enumerating triggers in SKILL.md and point to the canonical card (kills the drift surface).
2. **R2** — Extend the sync guard to cover the precedence rule + fix canonical card §8 back-links (missing cli-devin + cli-opencode; §7 says 5, §8 lists 3).
3. **R3** — Make `pattern-index.md` status-explicit (shipped vs roadmap) and split the overloaded "Shipped In" column (mixes phase numbers with benchmark IDs).
4. **R4** — Tighten model⇄executor wiring: add a registry-derived "Dispatch path(s)" line to each profile + a reconciliation check against `executors[]`.
5. **R5** — Publish a one-page Layer 1/2/3 architecture map; label `sk-prompt` as the forkable Layer 1.

**Key open questions handed to later iterations:** DRY-vs-self-containment policy for the precedence rule; whether cli-opencode's card links all 7 models or only override models (sub-agent unreliable — read directly); whether profile benchmark citations resolve to in-hub paths; and whether the sync guard is wired into CI/hooks or manual-only.

NEW-INFO: high (first pass).

---
## Full report (from account-2 plan file)

# Deep-Research Iteration 1 — sk-prompt-models HUB ⇄ cli-* executor boundary

**Question:** How to further refine, structure, and connect `sk-prompt-models` (the per-model prompt-craft HUB) and the five `cli-*` executor skills — the hub⇄executor boundary, delegation/precedence rules, per-model profiles, and interconnection.

**Evidence provenance:** Items marked ✅VERIFIED were read directly this iteration. Items marked ⚠️SUBAGENT came from Explore sub-agents whose detailed quotes proved partly unreliable (line numbers / card structure) — treat as leads to confirm, not facts. The central precedence-drift finding is ✅VERIFIED across all 5 SKILL.md files.

---

## Current-state map (with file evidence)

**3-layer architecture (specs 130 → 131 → 133, all Complete):**

- **Layer 1 — `sk-prompt`** = framework engine. Owns the 7 frameworks, DEPTH, CLEAR, and the **canonical** card `sk-prompt/assets/cli_prompt_quality_card.md`. Model-agnostic / forkable (spec 131 evacuated `model-profiles.json` + benchmarks out of it). ✅VERIFIED card; ⚠️SUBAGENT spec history.
- **Layer 2 — `sk-prompt-models`** = per-model prompt-craft HUB. Owns `assets/model-profiles.json` (registry; each model carries an `executors[]` array of executor+provider+quota_pool), `references/models/<id>.md` (8 active profiles), `references/models/_index.md`, `references/pattern-index.md`, `README.md`, and `benchmarks/`. ✅VERIFIED pattern-index + benchmarks dir; ⚠️SUBAGENT profile internals.
- **Layer 3 — `cli-*`** (opencode, devin, codex, gemini, claude-code) = executor mechanics + a **thin** `assets/prompt_quality_card.md` that delegates the framework table + CLEAR to the canonical card, plus a 3-tier precedence rule restated in each `SKILL.md`.

**The precedence contract (the spine of the whole system), ✅VERIFIED:**

- Canonical 3-tier rule: `sk-prompt/assets/cli_prompt_quality_card.md:68-96`. Tier 1 = fast path (build from canonical card); Tier 2 = model override (a per-model profile OVERRIDES cross-model defaults — stated model-agnostically as "the executor's model-craft hub", `:75-76`); Tier 3 = escalate to `@prompt-improver`, triggers at `:79-85`.
- **Tier 2 is restated identically in all 5** SKILL.md files: `cli-opencode:314`, `cli-devin:367`, `cli-codex:356`, `cli-gemini:309`, `cli-claude-code:350`. All name `../sk-prompt-models/references/models/<id>.md` + `model-profiles.json recommended_frameworks`. This is the clean hub link.
- **Tier 3 has drifted** (see Gaps §1).

**Model → executor binding, ✅VERIFIED registry exists / ⚠️SUBAGENT field detail:**

- `model-profiles.json` is the single source mapping each model to its executor(s) via `executors[]` (executor, provider, quota_pool, status). 8 active profiled models route through **cli-devin** (swe-1.6, deepseek-v4-pro, kimi-k2.6, glm-5.1) and **cli-opencode** (deepseek-v4-pro, kimi-k2.6, qwen3.6, glm-5.1, minimax-m3, minimax-2.7, mimo-v2.5-pro). `haiku`→cli-claude-code and `gemini-flash`→cli-gemini exist only as `optional-unverified` stubs.
- cli-codex / cli-gemini / cli-claude-code dispatch **frontier** models (gpt-5.5, gemini-3.1-pro, sonnet/opus) with **no hub profile** — their cards say "No per-model overrides today" (`cli-codex card:18`, `cli-claude-code card:18`) and link only to the generic `references/models/` dir. ✅VERIFIED.
- cli-devin's card carries a rich task-shape → model → **specific** hub-profile table (`cli-devin/assets/prompt_quality_card.md:21-29`) — the strongest model⇄executor wiring in the set. ✅VERIFIED.

**benchmarks/ relocation is complete** (resolves a sub-agent discrepancy): `benchmarks/` contains all six — `113-003`, `113-005`, `120-003`, `126-004`, `127-004`, `127-006`. ✅VERIFIED via directory listing.

---

## What works well

1. **Tier-2 hub link is perfectly consistent** across all 5 executors (`:314/:367/:356/:309/:350`) — the "consult the per-model profile before composing" contract is the connective tissue and it is identical everywhere. ✅VERIFIED.
2. **Cards are genuinely thin and delegate correctly.** cli-codex card = 28 lines; all 5 point to `../../sk-prompt/assets/cli_prompt_quality_card.md` and explicitly forbid re-inlining the framework/CLEAR tables (e.g. `cli-codex card:8,12`). ✅VERIFIED.
3. **Ownership boundary is explicitly written down**, not just implied: hub SKILL.md states "OWNS per-model prompt-craft profiles + registry DATA; cli-devin/cli-opencode own MECHANICS; sk-prompt owns generic frameworks" (⚠️SUBAGENT `SKILL.md:127-129`), echoed in `pattern-index.md:52-62` (✅VERIFIED) and the canonical card's Mirror-Sync section (`:112-124`, ✅VERIFIED).
4. **A duplication guard exists** — `system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh` asserts no cli-* card re-inlines the framework/CLEAR tables (canonical card `:116-122`). ✅VERIFIED (reference; not executed).
5. **Layer 1 is clean for forking** — spec 131 evacuated all small-model coupling from `sk-prompt`; benchmarks now consolidated in the hub. ⚠️SUBAGENT (grep-clean claim) — worth a confirming grep in iter 2.

---

## Gaps & friction (each with file:line evidence)

**1. Tier-3 trigger list has silently drifted in 4 of 5 executors. ✅VERIFIED — highest-value finding.**
The canonical Tier-3 triggers (`cli_prompt_quality_card.md:82-83`) are: "compliance, **policy**, privacy, or security **sensitivity**" and ">1 stakeholder **or audience**".
- `cli-devin/SKILL.md:368` — **matches canonical** ("compliance/policy/privacy/security sensitivity, >1 stakeholder or audience").
- `cli-opencode/SKILL.md:315`, `cli-codex/SKILL.md:357`, `cli-gemini/SKILL.md:310`, `cli-claude-code/SKILL.md:351` — **all drifted**: "compliance/privacy/security **signal**, >1 stakeholder" (dropped "policy", dropped "or audience", "signal" not "sensitivity").
So the "identical 3-tier rule in each cli-*" premise holds for Tier 1-2 but **breaks at Tier 3 for 4/5**. The drift is invisible because the guard does not check it (see §2).

**2. The duplication guard is blind to the precedence rule. ✅VERIFIED.**
`check-prompt-quality-card-sync.sh` only asserts the framework/CLEAR tables are not re-inlined (canonical card `:118-122`). It does **not** verify the Tier-3 trigger wording — which is exactly the contract that drifted. The most safety-critical cross-skill rule has the least enforcement.

**3. The canonical card's back-links are incomplete and self-inconsistent. ✅VERIFIED.**
`cli_prompt_quality_card.md:114` (Mirror Sync) names **all five** cli-* cards, but §8 Related Resources (`:130-136`) lists only **three** (cli-claude-code, cli-codex, cli-gemini) — **cli-devin and cli-opencode are missing**, i.e. the two executors that actually use hub profiles are the two not linked back. §7 says 5, §8 lists 3.

**4. The precedence rule is triplicated per executor — a structural drift surface. ✅VERIFIED.**
Each executor states the rule in (a) the canonical card, (b) its own card, and (c) its SKILL.md. cli-devin's card restates the full 3 tiers verbatim (`cli-devin card:41-43`) while cli-codex's card instead *references* it ("Escalate on any canonical Tier 3 trigger", `cli-codex card:24`). So even the *delegation style* is inconsistent. Three copies × 5 executors = the exact condition that produced §1.

**5. pattern-index "contract vs roadmap" ambiguity + overloaded column. ✅VERIFIED.**
`pattern-index.md:27` declares "the index is the contract … if a path here is missing on disk, the linked phase has not shipped — that is a roadmap pointer, not a bug." But the table (`:33-48`) has **no per-row shipped/roadmap marker**, so an operator following a dead link cannot tell bug from roadmap. The "Shipped In" column also mixes semantics: phase numbers (`Phase 003-006`) for some rows vs benchmark IDs (`120/003`, `126/004` at `:47-48`) for others.

**6. Model⇄executor connection is one-directional and unchecked. ✅VERIFIED structure / ⚠️SUBAGENT profile detail.**
The registry `executors[]` array is the authoritative model→executor map, but: (a) per-model profiles point to executor files via a generic "See Also" rather than stating their concrete dispatch path(s) mirroring `executors[]`; and (b) nothing reconciles what each cli-* card *claims* to dispatch against the registry. A model added to `executors[]` for cli-opencode, or a model dropped from a card, drifts silently.

**7. Frontier executors link to an empty target. ✅VERIFIED.**
cli-codex/gemini/claude-code cards' §Related point to `../../sk-prompt-models/references/models/` but dispatch no profiled model and have no profile there (`cli-codex card:28`, `cli-claude-code card:44`). The link is currently noise; the `haiku`/`gemini-flash` registry stubs are unresolved (profile-less).

**8. Minor: cli-claude-code card re-states failure patterns. ✅VERIFIED.**
`cli-claude-code card:34-40` (§4 Failure Patterns) partially duplicates canonical card §6 (`:100-108`) — small content the thin card could delegate.

**9. Minor: hub SKILL.md at the size ceiling. ⚠️SUBAGENT.**
Reported 198/200 LOC — no headroom; any addition forces a refactor. Confirm in iter 2.

---

## Refinement opportunities (ranked, concrete, with rationale)

**R1 — Re-sync the 4 drifted Tier-3 lists to canonical, and stop re-enumerating triggers in SKILL.md.**
Fix `cli-opencode:315`, `cli-codex:357`, `cli-gemini:310`, `cli-claude-code:351` to match canonical (`:82-83`) / cli-devin (`:368`). *Better:* replace the verbatim 5-trigger enumeration in each SKILL.md with a pointer ("escalate on any canonical Tier-3 trigger — `cli_prompt_quality_card.md §5`"), keeping the canonical card as the single enumerated source. *Rationale:* eliminates the drift surface permanently instead of re-aligning copies that will drift again. Lowest risk, highest correctness payoff.

**R2 — Extend the sync guard to the precedence rule + complete the canonical back-links.**
Add a parity assertion to `check-prompt-quality-card-sync.sh` (Tier-3 trigger list appears once, canonically, or matches byte-for-byte), and add cli-devin + cli-opencode to canonical card §8 (`:130-136`) so §7 and §8 agree. *Rationale:* closes the precise hole that allowed R1's drift and makes canonical⇄mirror symmetric. Pairs with R1.

**R3 — Make pattern-index status-explicit and split the overloaded column.**
Add a `Status` column (✅ shipped / ⏳ roadmap) to `pattern-index.md:33-48` and separate "shipped-in provenance" (phase vs benchmark ID) into its own column. *Rationale:* removes the "dead link = bug or roadmap?" guesswork the prose caveat at `:27` currently pushes onto operators.

**R4 — Tighten model⇄executor wiring in both directions.**
(a) Add a one-line "Dispatch path(s)" to each `references/models/<id>.md` mirroring its registry `executors[]` (executor · provider · quota_pool); (b) add a reconciliation check that every `executors[]` entry is reflected in the named cli-* and every model a cli-* card claims has a registry entry + profile. *Rationale:* the registry is the only model↔executor source of truth today and the connection is unenforced; this is the weakest link in the question's part (c).

**R5 — Publish a one-page architecture map + label Layer 1.**
Add a compact Layer-1/2/3 + ownership + data-flow diagram (natural home: the hub's §5 Skill Boundary Map) and a one-line "Layer 1 (forkable framework engine)" label in `sk-prompt/SKILL.md`. *Rationale:* the 3-layer model lives scattered across specs 130/131 and SKILL.md sections with no canonical picture; cheap navigational + anti-erosion payoff for onboarding.

---

## Open questions for later iterations

- **DRY vs self-containment for the precedence rule:** should each SKILL.md stay self-contained (restate, accept drift risk) or reference-only (canonical single source)? Current state is the worst of both — restated *and* drifted. (Decision needed before R1's "better" variant.)
- **cli-opencode card depth:** does it link each of its 7 dispatched models to its *specific* profile, or only the override models (MiniMax/MiMo)? ⚠️SUBAGENT was unreliable here — read `cli-opencode/assets/prompt_quality_card.md` directly in iter 2.
- **Frontier-executor hub links:** keep the generic `references/models/` link as a future hook, or remove it as noise? Promote `haiku`/`gemini-flash` stubs to real profiles, or drop them from the registry until adopted?
- **Profile benchmark references:** do the `120/003` / `126/004` citations in the minimax/mimo profiles point to the relocated in-hub `benchmarks/120-003`, `benchmarks/126-004` paths, or to stale spec sub-phase paths? (Relocation is complete on disk; references unverified.)
- **Guard liveness:** is `check-prompt-quality-card-sync.sh` wired into any hook/CI, or manual-only? (Determines whether R2 actually prevents drift.)
- **spec 130:153 stale statement:** it says `recommended_frameworks` DATA lives in `sk-prompt/assets/model-profiles.json`, but spec 131 moved it to the hub. Correct the frozen spec doc, or leave as history? ⚠️SUBAGENT.

NEW-INFO: high (first pass).
