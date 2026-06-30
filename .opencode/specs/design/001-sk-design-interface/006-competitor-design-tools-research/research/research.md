---
title: "Research: Competitor AI design-tool ideas for sk-design-interface and mcp-magicpath"
description: "Canonical synthesis of a 10-iteration parallel-by-model web-heavy deep-research loop (opus-4.8 via account #2 + gpt-5.5-fast) on what v0, Lovable, Figma Make, Subframe and adjacent AI design tools do that our two skills could adopt, net-new vs the 005 Claude Design findings. Research-only."
trigger_phrases:
  - "competitor design tool research"
  - "v0 lovable figma make subframe ideas"
  - "ai ui generation tool comparison"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/001-sk-design-interface/006-competitor-design-tools-research"
    last_updated_at: "2026-06-14T09:25:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Both lineages merged and cross-checked; net-new ideas synthesized"
    next_safe_action: "Fold into the 007 keystone build alongside the hardened 005 rec"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-006-competitor-design-tools-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Research: Competitor AI design-tool ideas for sk-design-interface and mcp-magicpath

> Canonical synthesis of a 10-iteration deep-research loop, two parallel by-model lineages — `opus48-claude2` (`claude-opus-4-8` xhigh via account #2; **web was gated, so model-knowledge, cutoff 2026-01, UNVERIFIED**) and `gpt55fast` (`openai/gpt-5.5-fast` xhigh; **had web, cited primary docs**). The gpt lineage's web-verified claims take precedence on feature facts; the opus lineage's strength is the dedup-vs-005 mapping. This widens the 005 Claude Design lens; it does not replace it. **Research-only: no skill changed by this packet.**

---

## 1. Executive Summary

Surveying v0, Lovable, Bolt, Figma Make, Subframe (plus Onlook, Builder, Relume, Stitch, Uizard, tweakcn) adds a handful of **net-new, transferable mechanisms** beyond the 005 Claude Design parity findings — and **reconfirms the anti-default guardrail by counter-example.** Discovery saturated by iteration 4 (more tools, no new themes), so the carry-forward set is small and high-confidence.

**The single strongest net-new idea (both lineages, top P1): design-system adherence + reuse-before-generate.** Subframe, Builder, Relume, Lovable, and v0 all constrain generation to a *registered* design system and flag deviations. opus frames it as "reuse-before-generate" (compose from the system's real components/tokens before authoring net-new — anti-default *by construction*); gpt frames it as an "adherence scanner" (raw colors, arbitrary spacing, inline overrides, component bypass become explicit violation classes). They are the same idea from two ends; together: **when a design system is present, reuse it and scan output for violations.**

**Other net-new carry-forwards:**
- **Element-target revision grammar** (v0 Design Mode, Lovable preview toolbar, Figma Make annotations, Subframe quick edits): a precise feedback shape — target element/component, visual evidence, requested change, scope, verification, broad-vs-targeted. Sharpens 005's revision routing into an auditable grammar.
- **Generated/presentational boundary** (Subframe one-way sync): generated source vs wrapper/adaptation vs business logic; never copy generated markup, import installed components.
- **Build-error self-healing** (v0, Bolt): run -> read error -> auto-fix before presenting; a *correctness* loop distinct from 005's *fidelity* loop; maps onto `code submit --wait` status.
- **Pre-build direction gate** (Lovable's 2-3 directions): for open visual axes, show a few brief-specific directions and recommend one — **strictly brief-specific, never a preset menu.**

**Two corroborations of the 005 hardening:**
- **Browser/screenshot testing is unreliable for subtle visual/color differences** (Lovable's own docs). This confirms the fidelity check must rest on judgment + the `ux_quality_reference.md` floor + anti-default critique, not pixel-compare.
- **The field's most common consumer feature is the multi-variant "pick-a-vibe" / theme-swap menu** (v0, Stitch, Uizard) — exactly the templated-default chooser `sk-design-interface` forbids. SKIP. This independently reconfirms the harden's "delete the quality levers."

---

## 2. Method & Provenance

| Item | Value |
| --- | --- |
| Loop | 10 iterations, 2 parallel by-model lineages, concurrency 2; both stopped at maxIterations with descending newInfoRatio (saturation by iter 4) |
| `opus48-claude2` | opus-4.8 xhigh via account #2; **web gated** -> model knowledge (cutoff 2026-01), claims tagged UNVERIFIED |
| `gpt55fast` | gpt-5.5-fast xhigh; **web available** -> primary docs cited (v0, Lovable, Figma Make, Subframe) |
| Merge | `fanout-merge.cjs`: 2 merged, 0 skipped, 8 consolidated findings |
| Dedup baseline | `../005-claude-design-parity-research/research/research.md` |
| Reconciliation rule | gpt's web-verified facts win on feature claims; resolve verdict divergences toward the lower-risk / anti-default option |

---

## 3. Net-new ideas (deduped vs 005), ranked

| Rank | Idea | Source tools | sk-design-interface | mcp-magicpath | vs 005 |
|---|---|---|:--:|:--:|---|
| P1 | **Design-system adherence + reuse-before-generate** | Subframe, Builder, Relume, Lovable, v0 | ADAPT (reuse-vs-reinvent critique + adherence checklist as judgment) | ADOPT (reuse registered components first; post-output adherence scan: raw color / arbitrary spacing / inline override / component bypass) | NET-NEW (005 had soft "inherit-if-present"; this is a hard reuse + violation check) |
| P1 | **Element-target revision grammar** | v0, Lovable, Figma Make, Subframe | ADAPT (critique vocabulary: region, observed issue, principle, one-change) | ADOPT (revision-intake: target, evidence, change, scope, verification, broad-vs-targeted) | Sharpens 005's revision routing |
| P1 | **Generated/presentational boundary** | Subframe | ADAPT (state "visual direction only") | ADOPT (generated vs wrapper vs business-logic file rules; never copy generated markup) | NET-NEW |
| P2 | **Build-error self-healing loop** | v0, Bolt | n/a | ADOPT (after `code submit --wait`, if not `completed`: read error, fix within editable boundary, resubmit; cap retries) | NET-NEW (correctness loop, vs 005 fidelity loop) |
| P2 | **Pre-build direction gate** | Lovable, Subframe | ADOPT (2-3 brief-specific directions, critique vs defaults, recommend one) | ADAPT | NET-NEW; **guarded: brief-specific, never presets** |
| P2 | **Browser-test limitation caveat** | Lovable docs | ADOPT | ADOPT | Corrects 005/keystone overconfidence in visual diff |
| P3 | **Persisted design brief / optional plan block** | Lovable Knowledge, Figma Make plan mode | ADAPT (read-if-present brief at Step 0) | ADAPT (short plan block before complex `code start`) | Sharpens 005's per-task snapshot into persisted |
| P3 | **Diff-before-apply** | Bolt, v0 | n/a | ADAPT (show editable-boundary diff before submit) | Minor net-new |

**Overlaps with 005 (confirmations, not carried as new):** tokens-as-input + token export, image/screenshot -> UI brief, the broad context/iteration/handoff protocol.

---

## 4. Cross-lineage reconciliation

**Agreements (both lineages):** design-system adherence/reuse is the top net-new idea; element-target feedback grammar; the generated/presentational boundary; the anti-default + lean-CLI guardrails; SKIP the preset menu, full-stack/backend gen, hosted-product features, and Git/PR ownership.

**Divergence + resolution:** opus emphasized "reuse-before-generate" (prevent drift) and build-error self-healing; gpt emphasized the "adherence scanner" taxonomy and the direction gate. These are complementary, not conflicting — merged into the single P1 "adherence + reuse" item and kept self-healing + direction-gate as distinct P2s. On any feature-fact divergence, gpt's web-cited version is authoritative (opus was model-knowledge).

**Verification note:** opus's competitor claims were UNVERIFIED model knowledge; the gpt lineage independently web-verified the load-bearing ones (v0 Design Mode, Lovable preview toolbar + design-system adherence + browser-testing caveat, Figma Make plan mode, Subframe one-way sync), so the carried-forward set rests on cited primary docs.

---

## 5. Negative knowledge (ruled-out)

- **No multi-variant / "pick-a-vibe" / theme-swap menu** in sk-design-interface (the field's most common consumer feature; the templated-default chooser the anti-default mandate forbids; reconfirms 005 + the harden).
- **No full-stack / backend generation** (Lovable Supabase, Bolt) — these are design skills, not app generators.
- **No in-browser runtime / WebContainers, deploy/host, GitHub branch/PR ownership, publishing, billing/admin** — platform features; route Git to `sk-git`, app code to `sk-code`.
- **No Figma-plugin-native coupling** — keep the generalized tokens-as-input idea, drop the plugin dependency.
- **No subtle-visual-diff automation as the sole quality gate** — unreliable per Lovable's docs; judgment + quality floor remain the gate.
- **No two-way generated-source ownership** — one-way sync + wrapper boundary (Subframe pattern).
- **No new MCP server / hosted registry** — a local handoff manifest suffices.

---

## 6. Carry-forward into the 007 keystone build

This packet feeds the implementation packet alongside the **hardened** 005 recommendation. Combined P1 set:
1. Context-snapshot intake + design-system inheritance (005 hardened) **+ reuse-before-generate + adherence scan (006).**
2. Element-target revision grammar (006) — sharpens 005's revision routing.
3. `previewImageUrl`-based fidelity check (005 hardened) gated on the quality floor + anti-default critique, **with the browser-test-unreliable caveat (006).**
4. Generated/presentational boundary for mcp-magicpath (006).
5. One optional handoff block (005 hardened, trimmed).
P2: build-error self-healing; guarded pre-build direction gate; persisted brief / optional plan block.
SKIP: the preset menu / named levers, and the full negative-knowledge set above.

---

## 7. References

<!-- ANCHOR:references -->
- **Dedup baseline:** `../005-claude-design-parity-research/research/research.md`. [SOURCE: file:.opencode/specs/design/001-sk-design-interface/005-claude-design-parity-research/research/research.md]
- **Target skills:** `.opencode/skills/sk-design-interface/SKILL.md`, `.opencode/skills/mcp-magicpath/SKILL.md`. [SOURCE: file:.opencode/skills/mcp-magicpath/SKILL.md]
- **Competitor docs (gpt lineage, web-verified):** v0 https://vercel.com/docs/v0/design-mode , https://vercel.com/docs/v0/design-systems ; Lovable https://docs.lovable.dev/features/design-systems.md , https://docs.lovable.dev/features/preview-toolbar.md , https://docs.lovable.dev/features/browser-testing.md , https://docs.lovable.dev/features/design-guidance.md ; Figma Make https://help.figma.com/hc/en-us/articles/40830441709719-Use-plan-mode-in-Figma-Make ; Subframe https://docs.subframe.com/concepts/syncing-components.md , https://docs.subframe.com/concepts/code-generation.md
- **Lineage syntheses:** `lineages/opus48-claude2/research.md`, `lineages/gpt55fast/research.md`; merged registry `deep-research-findings-registry.json`, `fanout-attribution.md`.
<!-- /ANCHOR:references -->

---

## 8. Convergence Report

- Both lineages stopped at maxIterations (5/5); newInfoRatio descended monotonically (opus 1.00->0.25; gpt 1.00->0.31); discovery saturated at iteration 4 (more tools, zero new themes).
- Merge: 2 lineages, 0 skipped, 8 consolidated findings; 5 net-new carry-forwards, 3 overlaps with 005.
- Cross-check: strong agreement on the adherence/reuse keystone + the SKIP set; feature facts rest on the gpt lineage's web-cited docs (opus was model-knowledge, UNVERIFIED).
- Caveat: opus's claims were unverified model knowledge; the load-bearing ones were independently web-verified by the gpt lineage.
