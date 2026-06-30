# AI Fingerprint Fixture Corpus

This corpus gives each AI fingerprint registry row one clean sample and one
tell-present sample. The registry remains authoritative: each `fixture_id` names
one directory, and each row's `deterministic_check` maps to one matcher in the
fixture runner.

The clean sample is a faithful near-twin that should fire no tell. The tell
sample is intentionally small and should fire exactly its own `tell_id`, with no
off-family matches.

| Fixture | Family | Tell |
| --- | --- | --- |
| `ai-fingerprint-ghost-card-border-plus-shadow` | opencode | `ghost-card-border-plus-shadow` |
| `ai-fingerprint-over-rounded-cards` | opencode | `over-rounded-cards` |
| `ai-fingerprint-sketchy-svg-illustration` | opencode | `sketchy-svg-illustration` |
| `ai-fingerprint-diagonal-stripe-background` | opencode | `diagonal-stripe-background` |
| `ai-fingerprint-element-tracking-on-display-type` | opencode | `element-tracking-on-display-type` |
| `ai-fingerprint-theater-meta-criticism-copy` | opencode | `theater-meta-criticism-copy` |
| `ai-fingerprint-image-hover-animation` | gemini | `image-hover-animation` |
| `ai-fingerprint-cream-or-sand-body-background` | general | `cream-or-sand-body-background` |
| `ai-fingerprint-eyebrow-above-every-section` | general | `eyebrow-above-every-section` |
| `ai-fingerprint-uniform-section-fade-and-rise` | general | `uniform-section-fade-and-rise` |

Run the corpus check from the repository root:

```bash
node .opencode/skills/sk-design/shared/scripts/ai-fingerprint-fixture-check.mjs
```
