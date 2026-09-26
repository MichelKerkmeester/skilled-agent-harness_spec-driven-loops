# Coverage-model declaration v1

Status: **frozen**. The persisted entry is `coverage-model.json` in evidence
archive v3.

The declaration identifies which language semantics a run's manifest and
observations use. It prevents the shared analyzer from interpreting a set of
generic-looking points, alternatives and ternary vectors under the wrong
language denominator.

```json
{
  "schemaVersion": 1,
  "language": "rust",
  "variant": "rust-source-v1",
  "name": "Supercov Rust source coverage v1",
  "completenessMeaning": "...",
  "measured": ["..."],
  "notMeasured": ["..."]
}
```

## Validation

- Unknown fields and unsupported schema versions are fatal.
- `language` and `variant` are stable lowercase identifiers. They are not
  inferred from filenames, runners, commands or obligation IDs.
- `name`, `completenessMeaning`, and every surface description are trimmed,
  non-empty, single-line UTF-8 strings with bounded encoded size.
- `measured` is non-empty. Both surface lists are duplicate-free and disjoint.
  Their order is contract order and writers must emit it deterministically.
- `language` must exactly equal the language in `frontend.json`.
- A model variant fixes semantic meaning; changing obligation semantics needs
  a new variant even when the enclosing schema remains version 1.
- `notMeasured` is not a waiver. If an unmeasured surface occurs in the frozen
  source scope, the manifest must carry a located blocking limitation and the
  frontend declaration must reference its ID. A report with any such blocker
  cannot claim measurement completeness.

`measured` and `notMeasured` describe the model's capabilities and boundaries;
they do not contain coverage verdicts. The Rust engine alone calculates all
percentages, witnesses, filters, minimization and queries.
