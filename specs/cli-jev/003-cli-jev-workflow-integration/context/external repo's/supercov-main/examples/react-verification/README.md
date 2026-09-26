# What do your React tests actually check?

The starter suite renders a checkout, submits it, and exercises an error. **All
15 executable lines run.** It still passes when the displayed total is wrong,
the accessible name describes deletion, the empty-order button is enabled, or
the failure message says payment succeeded.

Four small assertions make those expectations explicit:

| UI behavior | Assertion | Source mapped by Supercov |
| --- | --- | --- |
| Exact displayed total | `toHaveTextContent(/^25\.00$/)` | Price formatting inside `<output>` |
| Accessible payment name | `toHaveAccessibleName('Pay for 2 items')` | The `aria-label` template |
| Disabled empty order | `toBeDisabled()` | The `disabled` expression, for quantity zero |
| Useful error message | An anchored text matcher on the alert | The error text expression |

## Reproduce

From the repository root:

```sh
cargo build -p supercov
npm --prefix examples/react-verification ci
npm --prefix examples/react-verification run demo
```

The script measures the before/after suites, writes four reviewed assertion
maps, validates passing assertions and same-test execution, and checks four
deliberately broken copies. It changes only a temporary copy; output goes to
`recorded/`. Set `SUPERCOV_BINARY` to test another built CLI.

These are deliberately narrow, authored explanations. Supercov does not infer
that text is correct merely because it rendered, and it does not perform the
mutation checks itself. The script supplies those checks independently. The
empty-order assertion does not establish the saving-state branch, and four
credited expressions do not mean the whole component is assertion-covered.

## Why this adds something to existing coverage

Keep Vitest, Testing Library and your current assertions. Traditional execution
coverage answers whether code ran. Supercov also gives an agent small source
queries, observed passing assertion identities and reviewable mappings between
assertions and measured JSX expressions. That makes “what checks this value?” a
specific, inspectable question. The map is an explanation backed by execution,
not a proof that a test rejects every possible bug.

`recorded/result.json` and `recorded/ui-assertions.json` contain the verified
results. This is a reproducible teaching example, not a production-app case
study or a token-savings benchmark.

Separate compatibility tests in `compat/` check SSR hydration, preservation of
server DOM, the first interaction, and recovery from mismatched HTML in both
jsdom and Chromium. Run `node scripts/react-hydration-compatibility.mjs` from the
repository root after installing dependencies and Chromium. These tests do not
establish Next.js App Router, streaming, or server-action support.
