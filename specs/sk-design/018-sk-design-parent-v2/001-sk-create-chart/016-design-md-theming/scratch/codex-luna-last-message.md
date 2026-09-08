SUMMARY: Implemented deterministic `DESIGN.md` theming with shared gate arithmetic, provenance validation, `--extra` scanning, tests, documentation, and a Stripe proof delivery. Syntax, tests, static corpus, extra scan, refusal mutations, and strict packet validation pass. Render is UNKNOWN because headless Chrome returned no document; AC-006 remains Unmet and the packet remains In Progress.

FILES CHANGED:

`.opencode/skills/sk-design/sk-design-chart/scripts/apply-design-md.cjs` — new parser, mapper, gate refusal, and deterministic writer.  
`.opencode/skills/sk-design/sk-design-chart/scripts/color-gates.cjs` — shared contrast arithmetic.  
`.opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs` — `design-md` branch and `--extra`.  
`.opencode/skills/sk-design/sk-design-chart/scripts/tests/apply-design-md.test.cjs` — parser, refusal, and byte-identity tests.  
`.opencode/skills/sk-design/sk-design-chart/scripts/tests/fixtures/refusal-design.md` — refusal fixture.  
`.opencode/skills/sk-design/sk-design-chart/assets/examples/grouped-bars.html` — Stripe-themed proof delivery.  
`.opencode/skills/sk-design/sk-design-chart/screenshots/examples/grouped-bars.png` — local proof screenshot.  
`.opencode/skills/sk-design/sk-design-chart/references/design-md-theming.md` — theming contract.  
`.opencode/skills/sk-design/sk-design-chart/references/{README.md,color-system.md,template-contract.md}` — fourth-system documentation.  
`.opencode/skills/sk-design/sk-design-chart/{SKILL.md,README.md}` — routing and version 1.4.0.0.  
`.opencode/skills/sk-design/sk-design-chart/scripts/README.md` — script and `--extra` documentation.  
`.opencode/skills/sk-design/sk-design-chart/changelog/v1.4.0.0.md` — changelog entry.  
`specs/.../016-design-md-theming/{spec.md,goal.md,plan.md,tasks.md,acceptance-criteria.md,implementation-summary.md}` — packet close-out evidence and status.  
`specs/.../016-design-md-theming/{description.json,graph-metadata.json}` — regenerated metadata.  
`specs/.../016-design-md-theming/scratch/{parse-contract.md,checker-notes.md,mutations.md}` — proof receipts.  
`specs/.../016-design-md-theming/scratch/themed/{bar-columns.html,daily-line.html}` — generated themed fixtures.

MAPPING:

```text
MAPPING light surface: Snow (--color-snow) ratio=1:1
MAPPING light ink: Ink (--color-ink) ratio=21:1
MAPPING light muted: Azure 3 (--color-azure-3) ratio=4.75:1
MAPPING light rule: ink at 23 alpha (ink at 23 alpha) ratio=21:1
MAPPING light series-1: Azure (--color-azure) ratio=6.19:1
MAPPING light series-2: Deep Azure (--color-deep-azure) ratio=17.37:1
MAPPING light series-3: Azure 3 (--color-azure-3) ratio=4.75:1
MAPPING light series-4: Azure 4 (--color-azure-4) ratio=9.4:1
MAPPING light emphasis: Azure 11 (--color-azure-11) ratio=9.3:1
MAPPING dark surface: stock dark surface (stock dark surface) ratio=1:1
MAPPING dark ink: stock dark ink (stock dark ink) ratio=16.03:1
MAPPING dark muted: stock dark muted (stock dark muted) ratio=7.43:1
MAPPING dark rule: ink at 23 alpha (ink at 23 alpha) ratio=16.03:1
MAPPING dark series-1: Azure (--color-azure) ratio=3.02:1
MAPPING dark series-2: Ember (--color-ember) ratio=6.06:1
MAPPING dark series-3: Deep Azure 3 (--color-deep-azure-3) ratio=3.02:1
MAPPING dark series-4: Azure 6 (--color-azure-6) ratio=5.87:1
MAPPING dark emphasis: Azure 11 (--color-azure-11) ratio=4.56:1
```

ASSERTIONS ADDED:

- `design-md` branch: static scan passed 52 assertions; `--extra` passed 156 assertions, 0 failures.
- Malformed hash: `FAIL [design-md] --extra/bar-columns.html: design-md light provenance is missing or malformed directly under the begin marker; expected path, sha256=<64 hex> and generator=<version>`
- Below-mark series: `FAIL [design-md] --extra/bar-columns.html: design-md light series[0] reads 2.32:1 on the light ground, below the 3:1 mark gate`
- Stock one-byte edit: `FAIL [palette-block] assets/templates/daily-line.html: the light palette block drifted from the source: --chart-surface is #FAF8F4 and the palette source says #FAF8F5.`

VERIFICATION:

- `node --check .../apply-design-md.cjs` — exit 0.
- `node --test .../scripts/tests/` — 4 tests passed, 0 failed.
- Stripe apply command — wrote both files; `RESULT: PASSED`.
- `check-corpus.cjs --extra .../scratch/themed` — 38 files, 156 design-md assertions, errors 0; `RESULT: PASSED`.
- `check-corpus.cjs` — 36 files, 52 design-md assertions, errors 0; `RESULT: PASSED`.
- `check-corpus.cjs --render` — exit 1; 82 Chrome no-document failures; `RESULT: FAILED`.
- Render status: `UNKNOWN` — Chrome headless cannot return a document in this sandbox.
- Metadata generation — exit 0.
- Graph backfill — exit 0; refreshed 1, changed 1, drift empty.
- `validate.sh ... --strict --no-recursive` — exit 0; AC coverage 9/9, errors 0, warnings 0; `RESULT: PASSED`.
- Comment hygiene and scoped `git diff --check` — exit 0.
- `palettes.json` unchanged; stock templates contain no `design-md` markers.

UNKNOWNS AND DEVIATIONS: Render must be rerun by the conductor in a Chrome-capable environment before AC-006 can be marked Met. Independent second-agent review was unavailable under the leaf-worker constraint; Builder/Critic/Verifier self-review was recorded. The validator reported a nonblocking `prose_relationship_hints` review flag during graph backfill.