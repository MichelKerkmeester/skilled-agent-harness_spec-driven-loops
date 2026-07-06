# AI Slop Check

| Field | Value |
|---|---|
| Purpose | Let `design-audit` detect generic AI-template aesthetics and route corrections without treating style tropes as neutral defaults. |
| Owning mode | `design-audit` |
| Source reference | `ai-slop-check.md` |
| Trigger | Use when a surface looks generic, AI-generated, templated, over-decorated, or when the user asks for anti-slop review. |
| Output contract | A findings list covering gradients, emoji, default cards, imagery, type defaults, harsh whites/blacks, untraced colors, off-scale spacing, and default warm-editorial patterns. |
| Proof gate | Each finding names the detected pattern, evidence location or artifact, design impact, severity, owner, and a concrete fix direction. |
| Privacy rule | This is private audit guidance and does not create a public AI-slop skill. |

## Read-Only Compatibility

`design-audit` can report findings from files or supplied artifacts and route fixes without requiring edits or command execution.

## Procedure

1. Resolve the surface to review and read relevant styles or artifacts.
2. Scan for generic gradients, decorative emoji, default card patterns, weak imagery, overused type defaults, harsh black/white pairing, untraced colors, off-scale spacing, and overfamiliar warm-editorial combinations.
3. Treat each detection as a hypothesis backed by evidence, not as a blanket ban.
4. Keep legitimate brand or system choices when evidence supports them.
5. Map each correction to interface, foundations, motion, or `sk-code`.

## Related Cards

- `../design-foundations/procedures/hierarchy_rhythm_review.md` for scale and hierarchy cleanup.
- `../shared/procedures/polish_gate_orchestration.md` for final delivery review.
