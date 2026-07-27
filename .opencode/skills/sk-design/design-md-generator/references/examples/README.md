# Examples: Output Exemplars, Not Skill Reference Docs

This directory holds gold-standard `DESIGN.md` outputs (`linear/`, `stripe/`, `supabase/`, `vercel/`) plus their `writing-notes.md` companions, and a separate authoring guide, `editorial-exemplar.md`.

## Documented Exemption

The four `{brand}/DESIGN.md` files and their `{brand}/writing-notes.md` companions are **literal exemplars of the v3 Style Reference output format**, not agent-facing workflow documentation. Each `DESIGN.md` intentionally mirrors the exact structure specified by [`../design-md-format.md`](../design-md-format.md) — starting with `# <Brand> — Style Reference`, not an H1 + `## 1. OVERVIEW` — because that structure is the thing being demonstrated. Rewriting them to the `skill-reference-template.md` shape (numbered ALL-CAPS H2s, an `## 1. OVERVIEW` section) would destroy their purpose: they exist to be studied verbatim as what a passing DESIGN.md looks like. The paired `writing-notes.md` files are short editorial annotations on that specific example and inherit the same exemption for the same reason.

**What is still enforced on these 8 files:** the 5-field frontmatter block (`title`, `description`, `trigger_phrases`, `importance_tier`, `contextType`, `version`) is a universal parser/advisor contract for anything under `references/`, independent of body content — so `contextType` must still be a valid enum value (`general`, not `reference`) even though the body structure is exempt.

`editorial-exemplar.md` is not part of this exemption. It is genuine agent guidance (how to study a non-SaaS site), not an output mockup, so it follows the reference template in full: numbered ALL-CAPS H2s starting with `## 1. OVERVIEW`.

## Contents

| File | Role |
|---|---|
| `linear/DESIGN.md`, `stripe/DESIGN.md`, `supabase/DESIGN.md`, `vercel/DESIGN.md` | Exempt — literal output exemplars |
| `linear/writing-notes.md`, `stripe/writing-notes.md`, `supabase/writing-notes.md`, `vercel/writing-notes.md` | Exempt — editorial notes on the paired exemplar |
| `editorial-exemplar.md` | Conformant — agent guidance, follows the reference template |
