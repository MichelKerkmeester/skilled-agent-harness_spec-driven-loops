# Shadcn Reference Research: Synthesis

The canonical record is the lineage file `lineages/luna/research.md`, six angle sections and a final synthesis, every claim cited. This page is the reader's entry point.

## Verdict

Adopt three shadcn decisions selectively and keep the standalone decisions that measure better.

| Shadcn decision | Verdict | Where it lands |
|---|---|---|
| Semantic token indirection with per-key colours | Adopt the idea, keep the role palette and its gates | `014-shadcn-adoptions` |
| Local tooltip formatter and key-alias knobs | Adopt locally where a template needs them; indicator and hide choices stay per form | `014-shadcn-adoptions` |
| Explicit linear, step, monotone and normalized-stack variants | Adopt as declared intent; linear for measured trends, step for discrete states | `014-shadcn-adoptions` |
| Seventy charts as seventy forms | Eliminate; compare reader questions | recorded in `catalog.md` |
| Radar and arc pie | Keep ours: `parallel-axes`, `unit-grid`, `unit-ring` | recorded in `catalog.md` |
| Five-token oklch ramp | Keep ours: role split with numeric gates (92.9 degrees and 3.37:1 versus 16.0 degrees and 1.72:1 light minimums) | `color-system.md` |
| Natural interpolation as default | Eliminate; direct paths preserve observed gaps | `014-shadcn-adoptions` |
| `accessibilityLayer` as the accessibility contract | Keep ours: role, label and table floor on every form | unchanged |

## Waiting on policy

A browser-backed keyboard and pointer gate, a colour-vision-deficiency and hue threshold, metadata-driven data-accuracy checks and a retargetability manifest. Each is a checker assertion only once its policy exists; they are held as operator decisions in `014-shadcn-adoptions/spec.md`.
