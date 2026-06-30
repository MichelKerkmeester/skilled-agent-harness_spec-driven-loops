---
title: "Research: Claude Design parity for sk-design-interface and mcp-magicpath"
description: "Canonical synthesis of a 10-iteration, parallel-by-model deep-research loop (5x claude-opus-4-8 xhigh via account #2 + 5x openai/gpt-5.5-fast xhigh) on how to improve sk-design-interface and mcp-magicpath toward Claude Design parity. Research-only: produces a prioritized recommendation; no change to either skill."
trigger_phrases:
  - "claude design parity research"
  - "sk-design-interface mcp-magicpath improvement"
  - "claude design gap analysis"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/001-sk-design-interface/005-claude-design-parity-research"
    last_updated_at: "2026-06-14T08:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "10-iteration parallel-by-model fan-out complete; both lineages merged and cross-checked"
    next_safe_action: "Operator reviews the parity recommendation; if accepted, open a follow-up implementation packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-005-claude-design-parity-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Research: Claude Design parity for sk-design-interface and mcp-magicpath

> Canonical synthesis of a 10-iteration deep-research loop run as two parallel by-model lineages — `opus48-claude2` (`claude-opus-4-8` xhigh via the account-2 claude binary, 5 iterations) and `gpt55fast` (`openai/gpt-5.5-fast` xhigh via cli-opencode, 5 iterations). This document reconciles them; per-lineage syntheses are under `lineages/{label}/research.md`. **Research-only: this produces a recommendation. No file in `sk-design-interface` or `mcp-magicpath` is changed by this packet.**

---

## 1. Executive Summary

**Don't clone Claude Design. Wire the two skills you already have into the loop it has.** Claude Design's advantage is not raw generation; it is that **design context, visual iteration, and handoff are first-class, visible workflow objects** in one conversational canvas. Locally those concerns are split across two skills with implicit transitions: `sk-design-interface` owns design judgment (ground -> token system -> critique-against-defaults -> build -> self-critique), `mcp-magicpath` owns the canvas/CLI (author, install, themes, repo import). They are already composed (`mcp-magicpath depends_on sk-design-interface`), so the gap is a **missing connective protocol, not missing infrastructure.**

Both model lineages reached this independently: the fix is **a shared "Claude Design parity" protocol**, not a product clone and not a merge of the two skills.

**The single highest-value move (both lineages agree):** give `mcp-magicpath` **fidelity verification** after `code submit`. Today both skills define "done" as *compiles + responsive*, never *matches intent* — which is exactly Claude Design's visual-iteration advantage. Screenshot the rendered result (`view`/`share` + `mcp-chrome-devtools`), compare it to the design intent, revise on divergence, stop at confidence. Every part already exists; only the protocol is missing.

**Top recommendation (reconciled):** one shared protocol built from three durable schemas (gpt55fast) driven by one feedback loop (opus48-claude2):
1. **design-context snapshot** (intake: brand/system, assets, code context, audience, viewport, output target),
2. **iteration ledger** (the visible revision loop: render -> screenshot -> compare-to-intent -> targeted revision -> stop),
3. **handoff manifest** (token system + theme vars + files changed + interactions + a11y/responsive checks + next `sk-code` steps).

**Hard guardrail (both lineages, primary negative knowledge):** none of this may turn `sk-design-interface` into a templated generator. No style presets, no "pick-a-vibe" menu, no converting the critique-against CSVs into a chooser.

---

## 2. Method & Provenance

| Item | Value |
| --- | --- |
| Loop | 10 iterations total, 2 parallel by-model lineages, concurrency 2 |
| `opus48-claude2` | `cli-claude-code` / `claude-opus-4-8` xhigh via `CLAUDE_CONFIG_DIR=~/.claude-account2` — 5/5 iters, wrote directly (salvage 0), newInfoRatio 1.00->0.25 |
| `gpt55fast` | `cli-opencode` / `openai/gpt-5.5-fast` xhigh — 5/5 iters, salvage-recovered 5, newInfoRatio descending to 0.18; **had web access and read 3 primary Claude Design support articles** |
| Runtime | `fanout-run.cjs` async pool -> `fanout-merge.cjs` (2 merged, 0 skipped; 15 consolidated key findings) |
| Verification | The opus lineage used the seeded capability summary (no web, by design); the gpt lineage web-verified from primary docs; the **host re-verified** the keystone design-system-inheritance claim against the Claude Design design-system-setup article |
| Inputs | Claude Design support articles; both skills' SKILL.md + references; the parent spec |

**Lineage division of labor proved complementary:** the opus lineage produced the sharper *loop mechanics + parity scorecard + negative knowledge*; the gpt lineage, with web access, produced the *primary-source baseline + the three workflow schemas + a governance dimension*. The seeded Claude Design summary was confirmed accurate by both the gpt lineage and host verification.

---

## 3. The parity target (host-verified)

Claude Design (Anthropic Labs conversational design tool): conversational generation of designs / prototypes / presentations, with **org design-system inheritance** (publish a system extracted from codebases/screenshots/prototypes/assets -> projects auto-inherit color palette, typography, components, layout patterns), **canvas + inline-comment iteration**, **context attachments**, **multi-format export** (ZIP/PDF/PPTX/Canva/HTML), **Claude Code handoff**, and named **quality levers** (variations, accessibility review, responsiveness). [SOURCE: https://support.claude.com/en/articles/14604416-get-started-with-claude-design] [SOURCE: https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design]

---

## 4. The organizing insight: the judgment-vs-canvas seam

`mcp-magicpath depends_on sk-design-interface`, so the parity gap splits cleanly: **judgment-side gaps belong to `sk-design-interface`; canvas/CLI-side gaps belong to `mcp-magicpath`**; the connective tissue is one shared protocol. `mcp-magicpath` already leads on the mechanical dimensions (it owns the canvas), `sk-design-interface` leads on judgment. Close the gap by giving `mcp-magicpath` the missing *loop + export* and `sk-design-interface` the missing *inherit + emit*, joined by the shared protocol. [SOURCE: file:.opencode/skills/mcp-magicpath/SKILL.md] [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md]

---

## 5. Parity scorecard (reconciled)

0 = absent, 1 = adjacent, 2 = partial, 3 = parity.

| # | Dimension | Claude Design target | sk-design-interface | mcp-magicpath | Headline move |
|---|---|---|:--:|:--:|---|
| 1 | Design-system inheritance | Publish + auto-inherit org system | 1 | 2 | sk: inherit-if-present + token emit; mp: repo->theme bridge + theme/context preflight |
| 2 | Iteration / visual feedback | Canvas + inline-comment loop | 1 | 2 | **mp: fidelity verification (P1)** + shared loop; mp: chat-vs-comment revision routing; sk: rendered self-critique |
| 3 | Context grounding | Attachments (refs, codebases, decks) | 1 | 2 | sk: design-context snapshot intake (inherit-from / critique-against, never copy); mp: image-as-visual-brief |
| 4 | Quality levers | Named dials (variations, a11y, responsive) | 2 | 1 | sk: already strong; keep judgment-owned; expose named levers only if guardrailed (else defer) |
| 5 | Output / handoff | Multi-format export + Claude Code | 0 | 2 | mp: token export + handoff manifest; sk: structured handoff brief |
| - | Governance (RBAC/rollout) | Team/enterprise admin | n/a | n/a | Out of scope for two CLI skills |

**Read:** mechanical dimensions (1,2,3,5) are `mcp-magicpath`'s to close; judgment (4) is `sk-design-interface`'s and already near-parity. Dimension 2 is the hardest and highest-value.

---

## 6. The shared protocol (reconciled: opus loop + gpt schemas)

A single shared `claude-design-parity` reference both skills consume. Three durable schemas, driven by one loop:

- **design-context snapshot** — captured at intake: brand/design system (if present), assets/screenshots/competitor refs, code context, audience, target viewport, output target, constraints. (Mirrors Claude Design attachments + design-system inheritance, but local and prompt/file-based.)
- **iteration ledger** — the visible feedback loop, one row per revision: feedback source, broad-vs-targeted classification, change made, the **render -> screenshot -> compare-to-intent** fidelity check, unresolved comments. (This is the keystone: it makes iteration observable instead of private.)
- **handoff manifest** — emitted at the end: token system + theme variables, files changed, interactions, accessibility/responsive checks, open risks, next `sk-code` steps. (Replaces Claude Design's multi-format export with an actionable local handoff.)

The loop that drives them: **intent (`sk-design-interface`) -> render (`mcp-magicpath` `view`/`share`) -> screenshot (`mcp-chrome-devtools`) -> compare to intent -> targeted revision -> stop at confidence.** No new rendering or diffing infrastructure — every part already exists across the two skills. [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md] [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md]

---

## 7. Recommendations (prioritized, per skill)

### mcp-magicpath
| Pri | Class | Move | Concrete next step |
|----|-------|------|--------------------|
| P1 | ADOPT | Fidelity verification after `code submit` | Post-submit: screenshot `view`/`share`, compare render to intent (snapshot + tokens), iterate on divergence |
| P1 | ADOPT | Shared visual-feedback-loop protocol | Document intent->render->screenshot->compare->targeted-revision->stop; shared with sk-design-interface |
| P1 | ADOPT | Chat-vs-comment revision routing | Broad feedback re-plans; targeted feedback scopes a component edit via `code start --component --revision <selectedRevisionId>` |
| P2 | ADOPT | Design-token + handoff-manifest export | Emit CSS vars / tailwind tokens + a post-submit manifest (theme, viewport, interactions, limitations, next steps) |
| P2 | ADAPT | Theme/context preflight + repo->theme bridge | Require project/theme/viewport/source-context preflight before canvas work; synthesize repo tokens into a theme object |
| P3 | ADAPT | Target-device lever | Surface `--width`/`--height` as an explicit device lever |

### sk-design-interface
| Pri | Class | Move | Concrete next step |
|----|-------|------|--------------------|
| P1 | ADOPT | Design-context snapshot intake | Optional Step 0.5: ingest brand refs / screenshots / existing token system as inherit-from / critique-against inputs (never copy) |
| P1 | ADOPT | Structured handoff manifest emit | Output token system + signature + copy rules + quality checks as a small structured block for `sk-code`/`mcp-magicpath` |
| P2 | ADAPT | Inherit-if-present token step | When a design system exists, ground in it and spend the one aesthetic risk within it |
| P3 | ADAPT | Rendered self-critique loop | When a render surface exists, run a bounded render->critique->one-revision loop via chrome-devtools |
| P3 | ADAPT (cautious) | Named bounded quality levers | Only if they can never become presets; otherwise defer. sk-design-interface is already near-parity on judgment |
| - | SKIP | Auto-generate from the design CSVs | Violates the critique-against catalog rule (primary guardrail) |

---

## 8. Cross-lineage reconciliation

**Agreements (both lineages, independently):**
- A shared cross-skill protocol, not a product clone and not a merge of the two skills.
- The depends_on judgment-vs-canvas seam is the organizing principle.
- The core gap is the missing connective protocol (context -> iteration -> handoff as visible objects), not missing infrastructure.
- A handoff manifest, a context-intake step, and a visible iteration/feedback mechanism are needed.
- SKIP multi-format export (PDF/PPTX/Canva) for CLI skills; SKIP turning the CSVs into a generator; preserve the anti-default philosophy.

**Resolved divergences:**
1. **Keystone framing.** opus emphasized the fidelity-verification *loop*; gpt emphasized the three *schemas*. Resolved as one unit: the schemas are the durable objects the loop produces and consumes.
2. **Quality levers.** opus proposed naming bounded levers (boldness/density/motion); gpt rated sk-design-interface already high and stayed conservative. **Resolved toward the lower-risk option** (opus's own resolution rule + the anti-default mandate): keep levers judgment-owned and minimal; expose named levers only if they provably cannot become presets, otherwise defer.
3. **Governance dimension.** gpt added it (from the admin guide); correctly out of scope for two CLI skills. Noted, not pursued.

---

## 9. Negative knowledge (ruled-out directions)

- **No style presets / "pick-a-vibe" menu in sk-design-interface** — reintroduces templated defaults; violates the core anti-default philosophy (primary).
- **No converting the design CSVs into a generator** — they are critique-against data only.
- **No merging the two skills** — the `depends_on` boundary is clean; keep per-skill + one shared protocol.
- **No multi-format export (PDF/PPTX/Canva) in the CLI skills** — code + token + manifest handoff suffices; export is the web product's job.
- **No hosted canvas / live inline-comment threads** — that is the Claude Design web product, out of scope for CLI skills.
- **No heavyweight visual-regression / diff engine** — screenshot + judgment compare is already afforded.
- **No self-owned rendering pipeline in sk-design-interface** — rendering belongs to sk-code / magicpath / chrome-devtools.
- **No duplicating quality levers inside magicpath** — the source of truth lives once, in sk-design-interface.
- **No pushing generated themes back to the MagicPath account** — no `create-theme` in the CLI surface; platform scope creep.

---

## 10. Recommended next steps (for operator decision)

1. **Open a follow-up implementation packet** scoped to the §7 P1 set first: the shared `claude-design-parity` reference (the three schemas) + `mcp-magicpath` fidelity verification + the loop protocol + revision routing, and `sk-design-interface` context-snapshot intake + handoff-manifest emit.
2. **Phase it:** (a) author the shared protocol reference + the three schemas; (b) wire `mcp-magicpath` fidelity verification + revision routing + manifest; (c) wire `sk-design-interface` intake + emit; (d) P2/P3 token export, theme preflight, rendered self-critique.
3. **Hold the guardrail:** every change extends an existing seam (memory-as-hint -> inheritance; existing principles -> bounded behavior; named screenshot tool -> rendered loop). No new chooser.
4. After implementation: re-validate both skills, re-run advisor discovery, add manual-test scenarios (on-brand generation, targeted-comment edit, repo-import fidelity, handoff to sk-code).

---

## 11. References

<!-- ANCHOR:references -->
- **Parity target (host-verified):** Claude Design getting-started [SOURCE: https://support.claude.com/en/articles/14604416-get-started-with-claude-design] and design-system setup [SOURCE: https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design]; admin guide (governance, gpt lineage) https://support.claude.com/en/articles/14604406-claude-design-admin-guide-for-team-and-enterprise-plans
- **Skill 1:** `.opencode/skills/sk-design-interface/` — SKILL.md, references/design_principles.md, ux_quality_reference.md, design_inventory.md. [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md]
- **Skill 2:** `.opencode/skills/mcp-magicpath/` — SKILL.md, references/magicpath_operations.md, cli_reference.md, working_with_repositories.md. [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md]
- **Lineage syntheses:** `lineages/opus48-claude2/research.md`, `lineages/gpt55fast/research.md`.
- **Per-lineage iterations:** `lineages/{label}/iterations/iteration-00N.md`; merged registry + attribution: `deep-research-findings-registry.json`, `fanout-attribution.md`.
<!-- /ANCHOR:references -->

---

## 12. Convergence Report

- Both lineages stopped at maxIterations (5/5), newInfoRatio descending (opus 1.00->0.25; gpt ->0.18) — genuine diminishing novelty, not premature convergence.
- Questions answered: 5/5 per lineage. Merge: 2 lineages, 0 skipped, 15 consolidated key findings.
- Cross-check: strong agreement on the shared-protocol thesis + the anti-default guardrail; the few divergences resolved toward the lower-risk option per the spec mandate (parity without turning either CLI skill into a web product).
- Caveat: Claude Design internals are not public; capabilities are taken from its support docs (gpt lineage + host verified). The protocol is a design proposal, not a built-and-measured loop.

---

## 13. Hardening Addendum (adversarial review, post-merge)

Two independent adversarial reviewers (a feasibility lens and a value/philosophy lens) stress-tested this recommendation against the real CLI surface. They independently surfaced the same correction. **This addendum supersedes the original keystone where they conflict.**

**Keystone mechanism corrected (the important one).** The proposed fidelity check — screenshot the canvas via `view`/`share` + `mcp-chrome-devtools` — is NOT feasible unattended: `share` returns a session-gated MagicPath URL that redirects to sign-in, and CLI auth does not carry to a fresh chrome-devtools browser; the skill's own references warn against automating the hosted canvas. [SOURCE: file:.opencode/skills/mcp-magicpath/references/working_with_embedded_browsers.md] [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md] **The fix is already in the CLI:** `previewImageUrl` is a backend-rendered screenshot of the latest revision returned by `list-components`/`search` (auth-safe, no browser). [SOURCE: file:.opencode/skills/mcp-magicpath/references/cli_reference.md] Rebuild the fidelity loop on `previewImageUrl` + `code status`; use chrome-devtools only for local (sk-code dev-server) render targets, never the MagicPath canvas.

**Fidelity pass/fail criterion.** "Compare render to intent" must be gated on the existing `ux_quality_reference.md` quality floor PLUS the anti-default critique — not a vague "looks like the brief," which would be a weaker bar than the skill already enforces.

**Re-prioritization.** Context-intake + design-system inheritance (dimensions 1 and 3) are co-keystone, arguably ahead of fidelity verification: the gap is widest there AND the affordances already exist reliably (`get-theme` CSS-variable maps, repo import, memory-as-hint). Ground the design in the right system/context before verifying the render.

**Trims (keep the skills lean and anti-default).**
- Collapse the three schemas to ONE optional handoff block; drop the iteration-ledger as a durable schema — it contradicts the skill's "iterate in thinking" stance; keep iteration in-thinking.
- **Drop** the named quality levers (boldness/density/motion) outright, not "defer": "provably can never become a preset" is unmeetable, and a boldness dial is a preset axis by construction — it violates the anti-default rule.
- Scope token export to LOCAL artifacts only (CSS vars / a manifest block); there is no `create-theme` in the CLI surface, so nothing is written back to MagicPath.

**Caveat on convergence.** The two lineages' agreement is weaker validation than it appears: both read the same skills + the same seeded framing and neither verified the keystone's runtime feasibility — which this hardening did, and found the original mechanism blocked.

**Net hardened keystone set:** (1) context-snapshot intake + design-system inheritance; (2) `previewImageUrl`-based fidelity check gated on the quality floor + anti-default critique; (3) chat-vs-comment revision routing; (4) one optional handoff block. Defer the rest; delete the levers.
