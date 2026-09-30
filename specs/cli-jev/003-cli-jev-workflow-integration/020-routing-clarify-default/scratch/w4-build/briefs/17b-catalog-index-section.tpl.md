@@PREAMBLE_MD@@

TASK: apply 1 literal text edit to one markdown file. Change nothing else in it.

FILE (edit): .skilled/skills/sk-doc/feature-catalog/feature-catalog.md

EDIT 1, starting at line 60. Replace exactly this text, whole lines, between the ~~~~ fences and not including them:
~~~~
See [`compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md`](compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md) for resolution order, the tri-state flag, and serving-status anchors.
~~~~
with exactly this text:
~~~~
See [`compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md`](compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md) for resolution order, the tri-state flag, and serving-status anchors.

### Clarify Default Measurement

#### Description

Counts how often compiled hubs answer clarify with zero model calls and judges a suggested default only past 30 labeled rows.

#### Current Reality

`score-clarify-default.cjs` in `sk-create-skill` replays the committed canary cases, hub playbook scenarios and routing-corpus prompts through each hub's compiled engine, read only, and prints clarify counts per hub and source. It writes unlabeled clarify rows for the operator. `--score` stops below 30 labeled rows, and past that gate `--jev` and `--deem` each earn a verdict against the router's first alternative that serves nothing.

#### Source Files

See [`compiled-routing-and-legacy-fallback/clarify-default-measurement.md`](compiled-routing-and-legacy-fallback/clarify-default-measurement.md) for the census sources, the label gate, the keep rule and source anchors.
~~~~

Accept when: 1 file changed, every EDIT applied once, and the checks below pass.

@@TAIL@@

Checks to run: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-doc/feature-catalog/feature-catalog.md --type feature_catalog` must print `Total issues: 0` and exit 0. Without `--type` the same command prints one `document_type_fallback` warning that is already there at HEAD; report it, do not fix it.

@@HANDBACK@@
