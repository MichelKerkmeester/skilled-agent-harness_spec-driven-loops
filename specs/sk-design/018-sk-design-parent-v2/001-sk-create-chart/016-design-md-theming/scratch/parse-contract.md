# DESIGN.md parse contract

The parser follows the v3 format reference and does not infer values from prose.

| Input | Required heading or columns | Observed fixture coverage |
|---|---|---|
| Colours | `## Tokens — Colors`; table columns `Name`, `Value`, `Token`, `Role` | stripe, vercel, linear, supabase |
| Typography | `## Tokens — Typography`; primary `### <Font Family> — ... · \`--font-...\`` heading followed by `- **Substitute:** ...` | stripe, vercel, linear, supabase |
| Radius | `## Tokens — Spacing & Shapes`; `### Border Radius`; table columns `Element`, `Value` | stripe, vercel, linear, supabase |

The CLI reads a local path, optionally reads a sibling or explicit `tokens.json`, and reports the
missing named section before it writes anything. The four fixtures derive two gated themes in the
test run; Stripe has no declared dark mode, so its dark output keeps the stock dark chrome and
re-derives the series against that ground.
