@@PREAMBLE_MD@@

TASK: apply 1 literal text edit to one markdown file. Change nothing else in it.

FILE (edit): .skilled/skills/sk-doc/sk-create-skill/README.md

EDIT 1, starting at line 87. Replace exactly this text, whole lines, between the ~~~~ fences and not including them:
~~~~
`--compiled-routing legacy` and `--compiled-routing ready` produce genuinely different on-disk artifacts for the same hub shape. The authoring workflow asks which one you want rather than silently picking. Legacy leaves the router directive in place with no canonical manifest, which is backward compatible with every existing call. Ready mints a canonical manifest with `compiled-route-manifest.cjs mint`, then verifies it is fresh and only reports `compiled-ready` when both steps succeed. A failed mint or a stale manifest falls back to legacy rather than ever hand-authoring a manifest or a digest. Either way, a ready manifest stays inert onboarding evidence: it never activates compiled serving or changes the repository default on its own.
~~~~
with exactly this text:
~~~~
`--compiled-routing legacy` and `--compiled-routing ready` produce genuinely different on-disk artifacts for the same hub shape. The authoring workflow asks which one you want rather than silently picking. Legacy leaves the router directive in place with no canonical manifest, which is backward compatible with every existing call. Ready mints a canonical manifest with `compiled-route-manifest.cjs mint`, then verifies it is fresh and only reports `compiled-ready` when both steps succeed. A failed mint or a stale manifest falls back to legacy rather than ever hand-authoring a manifest or a digest. Either way, a ready manifest stays inert onboarding evidence: it never activates compiled serving or changes the repository default on its own.

### Measuring Clarify Defaults

When a compiled hub cannot choose between near-tied modes, it answers `clarify` with a short list of alternatives and suggests no default. [`scripts/score-clarify-default.cjs`](./scripts/score-clarify-default.cjs) measures whether a classifier could suggest one. With no switch it makes no model call. It replays the committed canary cases, hub playbook scenarios and routing-corpus prompts through each hub's compiled engine and counts `clarify` against the other outcomes per hub and source. `--rows-out <file>` writes each clarify row whose alternatives are modes, with an empty `label` for you to fill. `--transcripts <dir>` counts real front-door answers in a folder you name without printing any text.

```bash
node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --report <dir> --rows-out <file>
node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --score <file>
```

`--score` refuses to judge below 30 labeled rows and prints `stop: fewer than 30 labeled rows`. Past that gate, `--jev` or `--deem` with `--out <dir>` asks the classifier three times per row in rotated option order and prints one verdict per backend against the router's first alternative. A `keep` serves nothing, because the front door still prints no default.
~~~~

Accept when: 1 file changed, every EDIT applied once, and the checks below pass.

@@TAIL@@

Checks to run: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-skill/README.md` must print `Total issues: 0` and exit 0.

@@HANDBACK@@
