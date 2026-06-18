---
title: "Research (opus48-claude2 lineage): Adoptable ideas from competitor AI design tools for sk-interface-design and mcp-magicpath"
description: "Per-lineage synthesis of a 5-iteration deep-research loop (claude-opus-4-8 xhigh, account #2) surveying v0, Lovable, Bolt, Figma Make, Subframe, and the broader AI UI-generation field for net-new adoptable ideas vs the 005 Claude Design baseline. Research-only."
importance_tier: important
contextType: implementation
---

# Research (opus48-claude2 lineage): Competitor AI design-tool ideas

> Per-lineage synthesis for the `opus48-claude2` fan-out lineage of packet 006 (`claude-opus-4-8` xhigh via the account-2 claude binary, 5 iterations). The reconciled cross-lineage document is `../../research.md` (host/merge step). **Research-only: no file in `sk-interface-design` or `mcp-magicpath` is changed by this packet.**

> **Verification status (read first):** Live web search/fetch was permission-gated in this autonomous fan-out sandbox, so every competitor-feature claim is drawn from model knowledge (claude-opus-4-8, knowledge cutoff 2026-01) and tagged **UNVERIFIED** with a canonical doc URL for host verification at the merge step. The packet spec anticipates this ("web access gated in a headless lineage → the host verifies key claims at synthesis"). Confidence is HIGH on the *mapping logic and dedup vs 005*; Medium on *exact current feature wording*.

---

## 1. Executive Summary

**The broader AI design-tool field adds two genuinely net-new ideas beyond the 005 Claude Design parity findings, plus three smaller ones — and confirms 005's anti-default guardrail by counter-example.**

The 005 research already gave the two skills the connective protocol (design-context snapshot → fidelity iteration ledger → handoff manifest). Widening the lens to v0, Lovable, Bolt, Figma Make, Subframe, Onlook, Builder Visual Copilot, Stitch, Uizard, Relume, and tweakcn surfaces what that Claude-Design-only lens missed:

1. **Keystone (T2) — constrain generation to a *registered* design system / component library (no drift).** Subframe, Builder Visual Copilot, and Relume all generate *only* from your real components/tokens, so output cannot drift into generic AI defaults. This is sharper than 005's soft "inherit-if-present": it is a **hard reuse constraint**, and it is anti-default *by construction*. For `mcp-magicpath` (which already has a component registry via `search`/`inspect`/`add` and `themes`) this becomes a concrete **"reuse-before-generate"** rule. ADOPT.

2. **Strong (T3) — build/runtime-error self-healing loop.** v0 and Bolt run the generated code, read errors, and auto-fix before presenting. This is a *correctness* loop, distinct from 005's *fidelity-to-intent* loop. It maps directly onto `mcp-magicpath`'s existing `code submit --wait` build status. ADOPT.

The three smaller net-new ideas: **direct-manipulation token/markup edits with no AI turn** (T1; v0 Design Mode, Lovable Visual Edits, Onlook), a **persistent project "Knowledge"/design-brief file** (T4; Lovable Knowledge — sharpens 005's per-task snapshot into a persisted, reused one), and a **diff-before-apply** review affordance (T5; Bolt).

**The guardrail holds, reinforced by counter-example:** the field's most common *consumer* feature — **multi-variant / theme-swap "pick-a-vibe" menus** (v0, Stitch, Uizard) — is exactly what `sk-interface-design` must NOT adopt; it is the templated-default chooser the anti-default mandate forbids. SKIP (agrees with 005).

**Single highest-value move (this lineage):** give `mcp-magicpath` a **reuse-before-generate rule** (T2) — search/compose from the active theme's registered components before authoring net-new markup. It is concrete, already-hostable, and prevents design drift by construction.

---

## 2. Method & Provenance

| Item | Value |
| --- | --- |
| Lineage | `opus48-claude2` — `cli-claude-code` / `claude-opus-4-8` xhigh via `~/.claude-account2` |
| Iterations | 5/5 (fan-out cap); newInfoRatio 1.00 → 0.70 → 0.55 → 0.40 → 0.25 (monotonic) |
| Stop reason | `maxIterationsReached` with genuine diminishing-novelty convergence (0 new themes at iter 4) |
| Tools surveyed | v0 (Vercel), Lovable, Bolt.new, Figma Make, Subframe, Onlook, Builder Visual Copilot, Google Stitch, Uizard, Relume, tweakcn |
| Dedup baseline | `../../../005-claude-design-parity-research/research/research.md` (Claude Design parity, COMPLETE) |
| Targets | `.opencode/skills/sk-interface-design/` (judgment), `.opencode/skills/mcp-magicpath/` (canvas/CLI) |
| Web verification | **Gated in this lineage** (WebSearch + WebFetch permission-denied) → model knowledge, UNVERIFIED, host verifies |

---

## 3. The eight themes (dedup vs 005)

0 = absent in field, ★ = keystone. "vs 005" classifies novelty against the Claude Design parity findings.

| Theme | Tool instances | vs 005 |
|---|---|---|
| **T1** Direct-manipulation edits written back to code/tokens, no AI turn | v0 Design Mode, Lovable Visual Edits, Figma Make point-edit, Onlook | **NET-NEW** (005 routing was AI-only: chat re-plan vs comment edit) |
| **T2 ★** Constrain generation to a *registered* design system / component library (no drift) | Subframe★, Builder Visual Copilot, Relume | **NET-NEW** (005 = soft "inherit-if-present"; this is a hard reuse constraint) |
| **T3** Build/runtime-error self-healing loop (run → error → auto-fix) | v0, Bolt | **NET-NEW** (005 loop = fidelity-to-intent; this = correctness) |
| **T4** Persistent project "Knowledge"/design-brief file grounding all work | Lovable Knowledge, v0 Sources | **NET-NEW (sharpened)** (005 = per-task snapshot; this = persisted, reused) |
| **T5** Diff-before-apply (preview change before committing) | Bolt | NET-NEW (minor) |
| **T6** Multi-variant generation / theme swap | v0, Stitch, Uizard | OVERLAP (005 quality-levers note) + **anti-default hazard** |
| **T7** Tokens-as-input + token export | Figma Make, tweakcn, Relume, Subframe | OVERLAP (005 inheritance + token export) |
| **T8** Image/screenshot → UI brief | v0, Uizard, Stitch | OVERLAP (005 image-brief) |

**Read:** discovery saturated at iteration 4 — four additional tools produced zero new themes. T6–T8 are confirmations of 005, not new opportunities; T1–T5 are the net-new carry-forward.

---

## 4. Recommendations (prioritized, per skill — net-new only)

Ranked by value × anti-default-safety × lean-CLI-hostability.

### mcp-magicpath (canvas/CLI)
| Pri | Class | Theme | Move + guardrail | Concrete next step |
|----|-------|-------|------------------|--------------------|
| **P1** | ADOPT | T2 ★ | **Reuse-before-generate.** Compose from the active theme's registered components before authoring net-new; prevents drift by construction (anti-default aligned). | Before `code start` net-new, `search`/`inspect` the theme's components; author net-new only when nothing fits. |
| **P1** | ADOPT | T3 | **Build-error self-healing.** Correctness loop on top of the existing build status. | After `code submit --wait`, if build != `completed`, read the error, fix within the editable boundary (`src/App.tsx`, `src/index.css`, `src/components/generated/**`), resubmit; cap retries (e.g. 2). |
| **P2** | ADAPT | T1 | **Direct token/markup edits.** Reserve AI turns for structural change. | Between revisions, edit `src/index.css` tokens / generated markup directly for targeted tweaks instead of re-prompting. |
| **P3** | ADAPT (small) | T5 | **Diff-before-apply.** | Surface a diff of edited editable-boundary files before `code submit` so the change is reviewable. |

### sk-interface-design (judgment)
| Pri | Class | Theme | Move + guardrail | Concrete next step |
|----|-------|-------|------------------|--------------------|
| **P1** | ADAPT | T2 ★ | **Reuse-vs-reinvent critique check.** Stays judgment; never becomes a generator. | When a component registry/token system is present, add a critique question: "am I reinventing a component the system already has?" |
| **P2** | ADAPT | T4 | **Persisted design brief.** Read-if-present; never authored as a style chooser. | Optionally read a persisted project design brief (subject/audience/brand/do-don'ts) at Step 0 to ground work across sessions. |
| - | **SKIP** | T6 | **No "pick-a-vibe" variant/theme menu** — violates the anti-default mandate (primary guardrail). | Only safe form: bounded variations *within the one grounded direction* for self-critique, never preset styles. |
| - | **SKIP** | T1 | Not its surface — direct-manipulation belongs to mcp-magicpath/sk-code. | — |

---

## 5. Negative knowledge (ruled-out directions)

- **No multi-variant / theme-swap "pick-a-vibe" menu in sk-interface-design** — the field's most common consumer feature is exactly the templated-default chooser the anti-default mandate forbids (primary; agrees with 005).
- **No full-stack/backend generation** (Lovable Supabase, Bolt) — these are UI-design skills, not app generators.
- **No in-browser runtime / WebContainers, deploy/host, GitHub sync, community remix galleries** — platform features, not lean-CLI-skill concerns.
- **No Figma-plugin-native coupling** (Figma Make libraries, Builder/Anima/Visual Copilot plugins) — the two skills are not Figma plugins; keep only the generalized *tokens-as-input* idea, drop the plugin coupling.
- **No heavyweight visual-regression / diff engine** — screenshot + judgment compare suffices (agrees with 005).
- **No pushing generated themes back to the MagicPath account / hosted canvas** — platform scope creep (agrees with 005).
- **Web verification gated in this lineage** — feature claims are UNVERIFIED model knowledge; the host must verify any claim that drives a verdict (T2/T3 especially).

---

## 6. Cross-lineage reconciliation hooks (vs `gpt55fast`)

- **Expected agreements:** T2 (constrain-to-system) and T3 (error self-healing) as the two strongest net-new ideas; the anti-default + lean-CLI guardrails; the negative-knowledge SKIP set.
- **Likely divergence:** the web-enabled `gpt55fast` lineage may carry more current/precise feature names and may weight a tool this lineage under-covered (Magic Patterns, Tempo, Polymet, Creatie, Stitch specifics).
- **Resolution rule** (per packet spec + 005 precedent): on divergence, resolve toward the **lower-risk option** and the **anti-default mandate**; the host spot-verifies any feature claim that drives a verdict.

---

## 7. References

<!-- ANCHOR:references -->
- **Dedup baseline:** `.opencode/specs/skilled-agent-orchestration/143-sk-interface-design/005-claude-design-parity-research/research/research.md` (Claude Design parity, COMPLETE). [SOURCE: file:.opencode/specs/skilled-agent-orchestration/143-sk-interface-design/005-claude-design-parity-research/research/research.md]
- **Target skill 1:** `.opencode/skills/sk-interface-design/SKILL.md` (judgment: ground → token system → critique-against-defaults → build → self-critique; anti-default mandate). [SOURCE: file:.opencode/skills/sk-interface-design/SKILL.md]
- **Target skill 2:** `.opencode/skills/mcp-magicpath/SKILL.md` (CLI canvas: search/inspect/add, code start/submit, repo import; editable boundary; auto-applies sk-interface-design). [SOURCE: file:.opencode/skills/mcp-magicpath/SKILL.md]
- **Competitor tools (UNVERIFIED model knowledge, cutoff 2026-01; host to verify):** v0 https://v0.app/docs · Lovable https://docs.lovable.dev · Bolt https://support.bolt.new · Figma Make https://help.figma.com/hc/en-us/articles/figma-make · Subframe https://www.subframe.com · Onlook https://onlook.com · Builder Visual Copilot https://www.builder.io/c/docs/visual-copilot · Google Stitch https://stitch.withgoogle.com · Uizard https://uizard.io · Relume https://www.relume.io · tweakcn https://tweakcn.com
- **Lineage state:** `iterations/iteration-00{1..5}.md`, `deep-research-state.jsonl`, `deltas/iter-00{1..5}.jsonl`, `deep-research-strategy.md`, `deep-research-findings-registry.json`, `deep-research-dashboard.md`.
<!-- /ANCHOR:references -->

---

## 8. Convergence Report

- **Stop reason:** `maxIterationsReached` (5/5) with genuine diminishing-novelty convergence — newInfoRatio descended monotonically 1.00 → 0.70 → 0.55 → 0.40 → 0.25, and iteration 4 surveyed four additional tools while producing **zero new themes**.
- **Iterations completed:** 5/5.
- **Questions answered:** 5/5 (Q1–Q5).
- **Average newInfoRatio:** 0.58; trend strictly descending (not premature).
- **Themes:** 8 total (T1–T8); 5 net-new vs 005 (T1–T5), 3 overlap (T6–T8); 1 keystone (T2).
- **Quality guards:** source diversity = 11 tools across 4 vendors' product families; focus alignment = every iteration mapped to the spec's open question; single-weak-source = no verdict rests on one tool (T2 has 3 instances, T3 has 2, T1 has 4).
- **Caveat:** web verification was gated in this lineage; competitor-feature claims are UNVERIFIED model knowledge handed to the host for verification and reconciliation with `gpt55fast`.
