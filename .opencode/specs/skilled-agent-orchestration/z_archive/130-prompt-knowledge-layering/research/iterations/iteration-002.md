This is a research deliverable (per the tool's own guidance, ExitPlanMode is for implementation planning, not research), so I'll close with the findings summary. The complete report is written to the plan file.

## Iteration 2 — Complete

I read every relevant file directly (5 cli-* SKILL.md precedence blocks, both cli model-table cards, the canonical card, the registry, all 8 active model profiles, the guard script, pattern-index.md) for verbatim `file:line` evidence. Headlines:

**Precedence drift — CONFIRMED, exact deltas.** Canonical Tier-3 (`cli_prompt_quality_card.md:81-85`) vs the 4 drifted SKILL.md files (`cli-opencode:315`, `cli-codex:357`, `cli-gemini:310`, `cli-claude-code:351`) differ on three tokens: **"policy" dropped**, **"or audience" dropped** (both narrow escalation — the second kills the COSTAR multi-audience case), and "sensitivity"→"signal" (cosmetic). cli-devin (`:368`) matches. The guard misses this on **two** axes: it never scans SKILL.md (`:57-63`) and never checks trigger prose (`:33-55`) — sharper than iteration 1.

**Boundary leaks — both directions, against the ruler `pattern-index.md:57`.**
- (a) Hub→mechanics: `mimo-v2.5-pro.md:143-153` and `minimax-m3.md:124-135` embed full executable `opencode run` wrappers, **contradicting their own `:11` headers**; the other 6 profiles correctly defer (gold standard `swe-1.6.md:182-184`).
- (b) cli→craft: both cards print hub-owned framework choices (`cli-opencode card:22-25` "TIDD-EC + dense"/"COSTAR + lean"; `cli-devin card:23-28` RCAF/STAR/BUILD).

**Wiring matrix — corrects iteration 1.** All 8 profiles **do** name their executors and reconcile **8/8** with the registry (iteration 1's "profiles don't state dispatch path" is false). The real gap is the reverse: the cli-opencode card individually links 3 models but **bundles 4** (deepseek/kimi/qwen/glm) into a directory-only pointer (`:25`), while cli-devin links all 4 directly.

**New findings:** the §5 wrapper-leak inconsistency (NEW-1), the cli-opencode under-linking (NEW-2), guard never reads SKILL.md (NEW-3), verified canonical §7-vs-§8 back-link gap (NEW-4), pattern-index column/status ambiguity (NEW-5).

**Refined list R1–R8** (supersedes iter-1 R1–R5) is in the file — pointer-ize Tier-3, extend the guard, de-leak the 2 profiles, de-leak the 2 card tables, symmetric cross-links, fix canonical §8, disambiguate pattern-index, tidy the m3 slug.

**Deliverable:** `/Users/michelkerkmeester/.claude-account2/plans/you-are-deep-research-iteration-parsed-globe.md`

NEW-INFO: **high** — exact token-level drift + the two-axis guard blindspot, a corrected wiring model (8/8 reconcile; gap is card-side links), and a concrete new boundary leak with an authoritative ruler to fix everything against.

---
## Full report (from account-2 plan file)

# Deep-Research Iteration 2 — sk-prompt-small-model ↔ cli-* refinement

**Question:** How to further refine, structure, and connect `sk-prompt-small-model` and the five `cli-*` executor skills — the model-craft-hub vs executor-mechanics boundary, delegation/precedence, per-model profiles, and how they interconnect.

**Method this pass:** read every relevant file directly (not via excerpt agents) to capture verbatim quotes with `file:line`. All 5 cli-* SKILL.md precedence blocks, both cli cards that carry model tables, the canonical card, the registry, all 8 active model profiles, the duplication-guard script, and pattern-index.md were read in full. **No repo files were modified.**

**Authoritative boundary ruler (found this pass).** `pattern-index.md:57` is the canonical statement of where the line sits:
> "Prompt-CRAFT (framework selection, pre-planning density, per-model guidance) now lives in the hub profiles at `sk-prompt-small-model/references/models/`; cli-opencode owns only invocation MECHANICS (binary flags, provider id, quota pool)."
Both leak directions below are measured against this rule.

---

## Precedence drift (verified, with the fix recommendation)

### Tier-3 triggers quoted verbatim

**Canonical card** — `.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md:81-85` (Tier 3, §5):
```
- Complexity is `>= 7/10`
- Compliance, policy, privacy, or security sensitivity is present
- More than one stakeholder or audience must be satisfied
- More than one key requirement is still ambiguous
- The fast-path CLEAR check cannot be brought above the floor quickly
```

**cli-devin** — `cli-devin/SKILL.md:368`:
> "…when any canonical Tier 3 trigger applies: complexity ≥ 7/10, **compliance/policy/privacy/security sensitivity**, **>1 stakeholder or audience**, >1 ambiguous requirement, or the fast-path CLEAR cannot clear its floor."
→ **MATCHES canonical** (keeps "policy", "sensitivity", "or audience"). Also re-stated identically and correctly in its card at `cli-devin/assets/prompt_quality_card.md:43`.

**cli-opencode** — `cli-opencode/SKILL.md:315`:
> "…when complexity ≥ 7/10, **compliance/privacy/security signal**, **>1 stakeholder**, >1 ambiguous requirement, or the fast-path CLEAR cannot clear its floor."

**cli-codex** — `cli-codex/SKILL.md:357`: identical wording to cli-opencode.
**cli-gemini** — `cli-gemini/SKILL.md:310`: identical wording to cli-opencode.
**cli-claude-code** — `cli-claude-code/SKILL.md:351`: identical wording to cli-opencode.

### Verdict: iteration-1 drift claim CONFIRMED, with the exact deltas

Drift is present in **4 of 5 SKILL.md files** (all except cli-devin). Three concrete deltas vs canonical:

| Delta | Canonical (`cli_prompt_quality_card.md:82-83`) | Drifted 4× | Semantic effect |
|---|---|---|---|
| **"policy" dropped** | "Compliance, **policy**, privacy, or security…" | "compliance/privacy/security" | A *policy*-only-sensitive task (no compliance/privacy/security) no longer trips escalation. Real, narrow. |
| **"or audience" dropped** | ">1 stakeholder **or audience**" | ">1 stakeholder" | A single-stakeholder/multi-**audience** task (the COSTAR case) no longer trips escalation. Real. |
| **"sensitivity"→"signal"** | "…security **sensitivity** is present" | "…security **signal**" | Cosmetic; no semantic change. |

### Why the drift is invisible — confirmed at the script level

The guard `system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh` misses this on **two** axes (sharper than iteration 1):
1. **Wrong files.** It scans only the 5 `cli-*/assets/prompt_quality_card.md` cards (`:57-63`) — it never reads the `SKILL.md` files where the drift lives.
2. **Wrong content.** It asserts only the framework-selection table header/row (`:33-34`) and the 5 CLEAR dimension cells (`:35,48-55`). The Tier-3 trigger prose is not in its pattern set at all.
So the four drifted Tier-3 lines are doubly out of scope.

### Recommended structural fix (re-enumerate vs point-to-canonical)

**Recommendation: POINT, don't re-enumerate — in the SKILL.md prose.** The intro of every block already declares canonical authority — e.g. `cli-devin/SKILL.md:365` "the 3-tier rule canonical in `../sk-prompt/assets/cli_prompt_quality_card.md`". Re-listing the five triggers after that line adds no discoverability the link doesn't already give (the SKILL.md is fully in context when the skill loads; the card is one hop away), while creating five drift surfaces. Replace each Tier-3 list with a pointer:
> "Dispatch `@prompt-improver` when any **canonical Tier 3 trigger** applies (`cli_prompt_quality_card.md` §5)."

**If inline retention is preferred** (some operators want the triggers visible at dispatch without a hop), then the cost of inlining MUST be paid with a guard: re-sync all 4 drifted files to canonical verbatim **and** extend `check-prompt-quality-card-sync.sh` to (a) also scan the SKILL.md files and (b) assert the Tier-3 trigger string matches canonical. The current state — inline + un-guarded — is the worst of both and is exactly what let the drift land silently.

**Discoverability weighing:** pointer-only wins. The triggers are 5 short lines in a file every cli-* SKILL.md already links by path; the marginal "read it inline" benefit is small versus the demonstrated cost (4/5 files silently diverged). Reserve inline copies for the canonical card, which is the single fast-path surface and is itself guarded for its tables.

---

## Boundary leaks (both directions, with evidence)

Measured against `pattern-index.md:57` (CRAFT → hub; MECHANICS → cli-*).

### Direction (a): hub profiles holding executor MECHANICS — LEAK in 2 of 8, and they contradict their own headers

| Profile | §5 behavior | Verdict |
|---|---|---|
| `swe-1.6.md` | `:182-184` "Use the full invocation wrapper from `cli-devin`, not this profile." | CLEAN (defers) |
| `deepseek-v4-pro.md` | `:126` "Full invocation wrappers stay in `cli-devin` and `cli-opencode`; this section only records facts needed to choose the wrapper." | CLEAN |
| `minimax-2.7.md` | `:111` "Use the full wrapper from `cli-opencode`, not this profile." | CLEAN |
| `kimi-k2.6.md` | `:125` "Use the wrapper from `cli-devin` or `cli-opencode`, not this profile." | CLEAN |
| `qwen3.6.md` | `:128` "Use the full invocation wrapper from `cli-opencode` rather than copying wrapper syntax into this profile." | CLEAN |
| `glm-5.1.md` | `:111` "Use the full wrapper from `cli-devin` or `cli-opencode`, not this profile." | CLEAN |
| **`mimo-v2.5-pro.md`** | `:143-153` embeds a **full executable** `opencode run --model … --variant high --format json --dir … </dev/null > stdout.log 2> stderr.log` block | **LEAK** |
| **`minimax-m3.md`** | `:124-135` embeds a **full executable** `opencode run --model minimax-coding-plan/MiniMax-M3-highspeed --format json --dir … </dev/null` block | **LEAK** |

The two leaks contradict their own front-matter: `mimo-v2.5-pro.md:11` and `minimax-m3.md:11` both state "Executor MECHANICS (invocation wrappers, binary flags) live in `cli-opencode`." Yet §5 of each prints the wrapper. This is simultaneously a boundary leak **and** an internal inconsistency in the hub: 6 profiles defer the wrapper, 2 inline it.

**Note on the gray zone (acceptable, keep):** the §5 *capability tables* in those profiles (mirroring `variant_flag`/`agent_policy`/`format_mode` from `model-profiles.json…capability`) are sourced from registry DATA and are fine as "wrapper inputs." The leak is specifically the executable bash block — pure cli-opencode mechanics.

### Direction (b): cli-* cards holding prompt-CRAFT — LEAK in both model tables

- **cli-opencode card** `assets/prompt_quality_card.md:22-25` prints framework choices that `pattern-index.md:57` assigns to the hub:
  - `:22` "MiniMax M3 … | **TIDD-EC + dense** |"
  - `:24` "MiMo V2.5 Pro | **COSTAR + lean**, `--variant high` |"
  - `:25` "deepseek-v4-pro / kimi-k2.6 / qwen3.6 / glm-5.1 | **default RCAF** |"
  The `--variant high` token is genuine mechanics (belongs here); "TIDD-EC + dense" / "COSTAR + lean" / "RCAF" are hub-owned CRAFT restated → drift-prone if a re-benchmark changes them.
- **cli-devin card** `assets/prompt_quality_card.md:23-28` prints "RCAF", "RCAF (profile fallback `STAR`)", "RCAF (profile fallback `BUILD`)" per task shape. cli-devin is closer to correct because `:19` explicitly frames the table as "EXECUTOR MECHANICS (model routing + permission mode), NOT prompt frameworks — the framework column points back to the canonical card's owned set," and `:31` defers the contract. But the cells still *print* the framework name, so the duplication (and drift risk) remains.

### Where the line should sit

- **Hub §5:** record wrapper *inputs* (slug, which flags exist, quota pool) and **defer** the executable wrapper — as 6/8 profiles already do. Delete the bash blocks from `mimo-v2.5-pro.md:143-153` and `minimax-m3.md:124-135`; replace with the swe-1.6.md-style one-liner. This makes all 8 profiles consistent and matches `pattern-index.md:57`.
- **cli-* card model tables:** keep model + executor mechanics (permission mode, `--variant`, provider) and replace the framework cell with a pointer to the hub profile (the profile link is already in the adjacent column). cli-devin's `:19` framing is the right model; finish the job by making the cells say "see hub profile" instead of naming the framework.
- **Clean references to copy from:** hub side = `swe-1.6.md` §5; the cli side has no fully-clean exemplar yet (cli-devin is closest).

---

## Model ↔ executor wiring matrix + gaps

Registry = `model-profiles.json` `executors[]`. "Profile names executors?" = does the `<id>.md` §1 Identity list the same paths. "cli-* → profile back-link?" = does each dispatching card link the specific `<id>.md`.

| Model | Registry `executors[]` (executor/provider/pool) | Profile §1 names them? | cli-* → profile back-link |
|---|---|---|---|
| `swe-1.6` | cli-devin / cognition / cognition-free | ✅ `swe-1.6.md:25,179` | ✅ cli-devin card `:23` direct |
| `deepseek-v4-pro` | cli-devin/cognition-pro · cli-opencode/deepseek-api · cli-opencode/opencode-go | ✅ `deepseek-v4-pro.md:22-24` (all 3) | ✅ cli-devin card `:26-27` direct · ⚠️ cli-opencode card `:25` **directory-only** |
| `kimi-k2.6` | cli-devin/cognition-pro · cli-opencode/opencode-go | ✅ `kimi-k2.6.md:22-23` | ✅ cli-devin card `:27` direct · ⚠️ cli-opencode card `:25` **directory-only** |
| `qwen3.6` | cli-opencode / opencode-go | ✅ `qwen3.6.md:22` ("cli-opencode only") | ⚠️ cli-opencode card `:25` **directory-only** (no cli-devin path — correct) |
| `glm-5.1` | cli-devin/cognition-pro · cli-opencode/opencode-go | ✅ `glm-5.1.md:22` | ✅ cli-devin card `:28` direct · ⚠️ cli-opencode card `:25` **directory-only** |
| `minimax-m3` | cli-opencode / minimax-coding-plan / minimax-token-plan | ✅ `minimax-m3.md:22` | ✅ cli-opencode card `:22` direct |
| `minimax-2.7` | cli-opencode/minimax-coding-plan · cli-opencode/minimax | ✅ `minimax-2.7.md:20` (both) | ✅ cli-opencode card `:23` direct |
| `mimo-v2.5-pro` | cli-opencode / xiaomi-token-plan-ams / xiaomi-token-plan | ✅ `mimo-v2.5-pro.md:23` | ✅ cli-opencode card `:24` direct |
| `haiku` (stub) | cli-claude-code / anthropic — `optional-unverified` | n/a (no profile by design; `_index.md:32`) | n/a — `cli-claude-code/SKILL.md:345` "Use Haiku only … after adoption" |
| `gemini-flash` (stub) | cli-gemini / google — `optional-unverified` | n/a (no profile by design) | n/a — `cli-gemini/assets/prompt_quality_card.md:19` names it an "unverified stub" |

### Wiring findings — and a correction to iteration 1

- **Iteration-1 claim "profiles don't state their dispatch path; no reconciliation vs registry executors[]" is OUTDATED — CORRECT IT.** Every one of the 8 active profiles names its executor path(s) in §1 Identity **and** every set agrees with the registry (8/8 match, multi-executor models included). Reconciliation holds in this direction.
- **The real gap is the reverse link (asymmetric).** The cli-opencode card individually links only 3 models (`minimax-m3` `:22`, `minimax-2.7` `:23`, `mimo` `:24`) and **bundles** its other 4 dispatchable models (deepseek-v4-pro, kimi-k2.6, qwen3.6, glm-5.1) into a single **directory** pointer `../../sk-prompt-small-model/references/models/` (`:25`) — no direct `<id>.md` links. The cli-devin card, by contrast, links all 4 of its models directly (`:23-28`). No model is fully orphaned (the directory link covers them), but 4 opencode-go RCAF models are discoverable-but-not-direct.
- **No profile's executor path disagrees with the registry.** Zero mismatches.
- **Minor slug tension (not a wiring break):** registry `minimax-m3.capability.model_slug` = `minimax-coding-plan/MiniMax-M3` (`model-profiles.json:279`), but the dispatch rule in `minimax-m3.md:116` says "Pass as `--model minimax-coding-plan/MiniMax-M3-highspeed`". Documented as account-holder-directed; flag for tidy-up, not a break.

---

## New findings (not in iteration 1)

- **NEW-1 (boundary, high value).** Two hub profiles (`mimo-v2.5-pro.md:143-153`, `minimax-m3.md:124-135`) embed full executable `opencode run` wrappers in §5, contradicting their own `:11` "mechanics live in cli-opencode" headers, while the other 6 profiles correctly defer. This is both a direction-(a) leak and an internal hub inconsistency — sharper and actionable vs iteration 1's general "wiring is loose."
- **NEW-2 (wiring, corrective).** The cli-opencode card under-links 4 of its 7 dispatchable models (directory-only at `:25`) — and this, not "profiles lack dispatch paths," is the actual discoverability gap. Supersedes iteration 1's wiring framing.
- **NEW-3 (guard scope).** The duplication guard never reads the SKILL.md files at all (`:57-63` lists only the 5 cards) — so *any* SKILL.md-level divergence (precedence, model-craft, anything) is structurally unguarded, not just the precedence triggers.
- **NEW-4 (verified carry-over).** Canonical card §7 (`:114`) claims all five cli-* cards are mirrors, but §8 "Related Resources" (`:133-135`) lists only three (cli-claude-code, cli-codex, cli-gemini) — **cli-devin and cli-opencode back-links are missing.** Confirmed at the exact lines.
- **NEW-5 (refined from iteration 1).** `pattern-index.md` "Shipped In" column mixes two ID schemes — phase numbers (`:35-46` "Phase 003/004/005/006") and benchmark packet IDs (`:47` "120/003", `:48` "126/004") — and ship status is **implicit** (derived from on-disk file existence per `:27`), not an explicit column. Verified.

---

## Refined refinement list (supersedes iteration 1 R1–R5)

Ordered by value × low-effort. Each is a concrete, scoped edit.

- **R1 — Kill the Tier-3 drift (pointer-ize).** In `cli-opencode/SKILL.md:315`, `cli-codex/SKILL.md:357`, `cli-gemini/SKILL.md:310`, `cli-claude-code/SKILL.md:351`, replace the re-enumerated trigger list with "any canonical Tier 3 trigger (`cli_prompt_quality_card.md` §5)". (Supersedes iter-1's "re-sync wording" — pointer is drift-proof and DRY.) cli-devin already matches and can be pointer-ized too for symmetry.
- **R2 — Make the guard cover what drifts.** Extend `check-prompt-quality-card-sync.sh` to also scan the 5 `SKILL.md` files; if R1 keeps any inline trigger copy anywhere, add a Tier-3 string-equality assertion against the canonical card. Today it scans neither the file nor the content where drift occurs (`:57-63`, `:33-55`).
- **R3 — De-leak the two hub profiles.** Delete the executable `opencode run` blocks from `mimo-v2.5-pro.md:143-153` and `minimax-m3.md:124-135`; replace with the `swe-1.6.md:182-184` defer-pointer. Restores the 8/8 "profiles hold CRAFT, defer MECHANICS" rule of `pattern-index.md:57`. (NEW this pass.)
- **R4 — De-leak the cli card model tables.** In `cli-opencode/assets/prompt_quality_card.md:22-25` and `cli-devin/assets/prompt_quality_card.md:23-28`, replace the framework cell values ("TIDD-EC + dense", "COSTAR + lean", "RCAF (fallback STAR/BUILD)") with "see hub profile →" (the profile link is already adjacent); keep `--variant`/permission-mode (true mechanics). (NEW this pass — the reverse leak iter-1 didn't separate out.)
- **R5 — Symmetric, direct cross-links.** In `cli-opencode/assets/prompt_quality_card.md:25`, expand the directory pointer into 4 direct `<id>.md` links (deepseek-v4-pro / kimi-k2.6 / qwen3.6 / glm-5.1), matching the cli-devin card's per-model linking. (Supersedes iter-1's "profiles don't state dispatch path," which is false — see matrix.)
- **R6 — Back-link the canonical card §8.** Add `../../cli-devin/assets/prompt_quality_card.md` and `../../cli-opencode/assets/prompt_quality_card.md` to `cli_prompt_quality_card.md:133-135` so §8 matches §7's "all five" claim. (Carries iter-1; verified.)
- **R7 — Disambiguate pattern-index columns (low priority).** Split "Shipped In" into "Phase" vs "Benchmark", or add an explicit Status column, so phase numbers and packet IDs (`pattern-index.md:35-48`) stop sharing one cell and ship-vs-roadmap is explicit rather than on-disk-implicit. (Carries iter-1; verified, minor.)
- **R8 — Tidy minimax-m3 slug (trivial).** Reconcile `model-profiles.json:279` (`MiniMax-M3`) with `minimax-m3.md:116` (`MiniMax-M3-highspeed`) — pick one canonical dispatch string or annotate the registry capability with the `-highspeed` directive. (NEW, trivial.)

---

NEW-INFO: **high** — verified the precedence drift down to the exact 3 token-level deltas and the two reasons the guard can't see it; *corrected* iteration 1's model↔executor framing (profiles DO name executors and reconcile 8/8 — the real gap is the cli-opencode card's directory-only links); and surfaced a concrete, previously-unreported boundary leak (2 hub profiles inline executable `opencode run` wrappers against their own headers) with an authoritative ruler (`pattern-index.md:57`) to fix all of it against.
