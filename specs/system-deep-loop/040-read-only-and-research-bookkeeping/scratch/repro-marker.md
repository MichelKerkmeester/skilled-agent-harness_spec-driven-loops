# Reproduction: marker guard matches the canonical header

`head -1 .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` prints `DEEP-RESEARCH`.
`printf 'DEEP-RESEARCH\n' | grep -E '^(DEEP-REVIEW|DEEP-RESEARCH|CODE-REVIEW)$'` matches (exit 0), so every iteration after the first would halt with exit 2 if the guard ran as written.

Verdict: holds. The same pattern is in `deep-review-auto.yaml` (out of scope for this packet).
