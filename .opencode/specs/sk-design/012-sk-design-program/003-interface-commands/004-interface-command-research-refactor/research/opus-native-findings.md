# Native Opus-4.8 Research Findings — Design Commands

> The 2–3 "native Opus-4.8 (max)" research passes, run directly by the orchestrator (Opus 4.8) with
> WebSearch + WebFetch, complementing the 10-iteration cli-opencode SOL-fast lineage. Evidence-cited;
> to be merged with the lineage `research.md` in Phase-2 synthesis.

## Findings (ranked by leverage)

### F1 — Registry/structured grounding is the single biggest evidence-backed lever [HIGH]
A CHI-2026 study compared three ways to feed a design system to an LLM: **instruction-based** (embed the
full style guide in the prompt), **context-based** (inject task-relevant guides), and **registry-based**
(assemble from pre-built components/tokens). Registry-based reached **95.08% design-system compliance —
the highest — at only moderate overhead**. Implication: the `/interface:*` commands should **ground in
real, structured registry data** (sk-design's own styles library + design tokens), not just *describe*
taste in prose. Grounding is what makes output on-brand and non-generic.
Source: *Design System-Compliant UI Generation with LLM Agents* (CHI 2026), doi 10.1145/3772363.3798616;
corroborated by UXPin, "Connect Your Design System to LLMs."

### F2 — "One thing well, opinionated, focused" is the command-design north star [HIGH]
Community + docs consensus: *a command that does five things badly is worse than one that does one thing
well*; build incrementally from prompts you actually repeat. Implication: keep each of the five commands
sharply scoped to its mode; resist bloat; let the shared contract carry the cross-cutting lifecycle.
Source: Claude Code slash-command guides (DataCamp, thepromptshelf, claudedirectory).

### F3 — The authoring contract: `description` is the load-bearing field [HIGH]
Claude Code's slash-command contract: frontmatter = `description` (drives autocomplete **and** autonomous
routing — the most important field), plus `allowed-tools`, `model`, `argument-hint`; body = a markdown
prompt; arguments via `$ARGUMENTS` / `$0`/`$1`; first-class `@file` includes and inline `` !`cmd` `` bash.
Skills (`.claude/skills/<name>/SKILL.md`) are the recommended evolution (bundled files + auto-invoke +
subagent). Implication: our `@`-include of `creation-contract.md` is a **supported first-class feature**
(good); each command's `description` + `argument-hint` deserve deliberate authoring; the sk-doc
create-command standard is the right internal analog to conform to.
Source: code.claude.com/docs — "Slash Commands in the SDK."

### F4 — Anti-slop is a genuine differentiator, and it lives in taste, not the command [MED]
Lovable's stated philosophy: *"AI-generated software shouldn't look like an AI built it"* — emphasis on
motion (Framer Motion), sophisticated palettes, and non-trivial state. This validates sk-design's
audit/anti-slop mode and the "taste stays in the modes, not the command bodies" stance. The command's job
is to *invoke* distinctive, grounded work, not to encode the taste itself.
Source: Lovable vs Bolt vs v0 comparisons (lovable.dev, uibakery.io, addyo.substack).

### F5 — Effective design intake has a known shape [MED]
Across v0 / Bolt / Lovable, strong prompts specify: the idea/goal, target audience, the specific
pages/features/artifact, UI-style preferences, and technical constraints. Implication: each command's
intake should elicit the mode-appropriate subset (purpose/audience, the concrete artifact, style
grounding, constraints) — and no more.
Source: v0/Bolt/Lovable prompt guides.

### F6 — Move from static templates → structured, component-level, iterative [MED]
Research consensus: one-off static prompts drift; DSL/component-level specs plus iterative refinement hold
coherence. Implication: keep the `:auto` / `:confirm` (iterative) split; have commands emit
editable, component/token-grounded specs rather than prose blobs.
Source: arXiv 2412.20071 (Human-AI Synergy in UI Design); CHI-2026 study above.

## Refactor recommendations (native-Opus view)

1. **Ground in the registry.** Highest-leverage change: each command should pull **real tokens / reference
   styles from the styles library** (sk-design's asset) into the working context, not just describe them.
   This is F1's 95%-compliance lever and directly answers "useless/unverified."
2. **Sharpen `description` + `argument-hint`** per command (routing + intake legibility).
3. **Keep exactly one `@`-include of the lifecycle contract** (F3 confirms it is first-class) and keep
   taste in the modes (F4).
4. **Right-size intake** to the mode-appropriate subset (F5); do not over-ask.
5. **Conform to sk-doc create-command** — it is the internal equivalent of F3's authoring contract; use
   its templates/standards as the spec.
6. **Make output verifiable:** pair each command with a checkable artifact (the audit mode + the
   contract test suite), so "benchmarked/verified" is structural, not asserted.

## Sources

- CHI 2026 — Design System-Compliant UI Generation with LLM Agents (doi 10.1145/3772363.3798616)
- code.claude.com/docs — Slash Commands in the SDK
- UXPin — Connect Your Design System to LLMs
- arXiv 2412.20071 — Towards Human-AI Synergy in UI Design
- lovable.dev / uibakery.io / addyo.substack — v0 vs Bolt vs Lovable comparisons
- Claude Code slash-command guides (DataCamp, thepromptshelf, claudedirectory)
