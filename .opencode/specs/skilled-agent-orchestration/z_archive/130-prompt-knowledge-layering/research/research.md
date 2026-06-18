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
