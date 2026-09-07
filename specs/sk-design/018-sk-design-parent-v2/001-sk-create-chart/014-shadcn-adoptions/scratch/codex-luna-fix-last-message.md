SUMMARY

Fixed `READOUT.key` wiring across all 22 tooltip-bearing files. Registrations now read `READOUT.label(datum[READOUT.key])`; the checker rejects decorative alias readbacks. References, evidence, acceptance criteria, goals, and metadata were updated.

FILES CHANGED

- 18 template HTML files under `.opencode/skills/sk-design/sk-design-chart/assets/templates/`
- 4 example HTML files under `.opencode/skills/sk-design/sk-design-chart/assets/examples/`
- `.opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs`
- `.opencode/skills/sk-design/sk-design-chart/references/template-contract.md`
- `acceptance-criteria.md`
- `goal.md`
- `implementation-summary.md`
- `scratch/mutations.md`
- `description.json`
- `graph-metadata.json`
- Refreshed `scratch/mutation-readout/` mirror; retained the intentional `box-plot.html` mutation.

NEW ASSERTION

`FAIL [number-format] assets/templates/box-plot.html: tooltip readout code builds an object keyed by READOUT.key and immediately reads that alias back. The card must read READOUT.key from the registered datum`

VERIFICATION

- Live checker: `number-format: 320 assertion(s), 0 failure(s)`; `RESULT: PASSED`
- Mutation checker: exit `1`; exact failure recorded in `scratch/mutations.md:41`; `RESULT: FAILED`
- Strict spec validation: `Summary: Errors: 0 Warnings: 0`; `RESULT: PASSED`
- Syntax check: `node --check` exit `0`

Computed labels use minimal keyed records in eight forms: calendar, daily-line, daily-range, heat-matrix, histogram, stacked-bars, calls-by-day-and-hour, and orders-after-the-price-change. Visible labels remain unchanged.