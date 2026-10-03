# Generated-artifact inventory

Walked from the writers, not guessed from names (`rg -n "writeFileSync|writeJsonAtomic" .skilled/skills/sk-doc/sk-create-skill/scripts/*.cjs .skilled/skills/system-skill-advisor/runtime/lib/derived/*.ts`, plus the trigger-index generator).

| Artifact | Writer | Owns | Engine rule |
|----------|--------|------|-------------|
| `.skilled/skills/**/leaf-manifest.json` | `sk-create-skill/scripts/generate-leaf-manifest.cjs:406`, `ci-skill-root-metadata.cjs:211,224` (`--fix`) | whole file | `scope: 'file'` |
| `.skilled/skills/**/graph-metadata.json` | `system-skill-advisor/runtime/lib/derived/sync.ts:144`, `sk-create-skill/scripts/regenerate-skill-derived.cjs:208` | the top-level `derived` key only | `scope: 'derived'`: generated only when the JSON outside `derived` equals the base |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | `runtime/cli/retrieval/generate-trigger-index.mjs` | whole file | `scope: 'file'` |
| `runtime/cli/retrieval/fixtures/{corpus-manifest,generation-diagnostics,phrase-variants}.json` | same generator run | whole file | `scope: 'file'` |

Considered and left out:

| Artifact | Why it is not generated |
|----------|-------------------------|
| `mode-registry.json`, `hub-router.json`, skill `description.json`, `ROUTER.md` | No non-test writer exists; they are authored. The planning count of local-only copies of these files is therefore authored drift, not generator noise. |
| `graph-metadata.json` `intent_signals` | `generate-router-intent-signals.cjs:67` appends to an authored list; the authored order is kept, so it is a hybrid edit, not a regeneration. |
| `leaf-aliases.json` | Generated for standalone roots only (`ci-skill-root-metadata.cjs:271,280`); hub copies are authored. A path rule cannot tell the two apart. |
| `.skilled/bin/lib/compiled-routing/*/activation/*/manifest.json` | The build harnesses sometimes write back prior bytes (`build-artifacts.cjs:193,220`); not proven to be a pure regeneration. |

Answer to the parent's open question: a path allowlist, plus a content rule for the one hybrid file (`graph-metadata.json`).
