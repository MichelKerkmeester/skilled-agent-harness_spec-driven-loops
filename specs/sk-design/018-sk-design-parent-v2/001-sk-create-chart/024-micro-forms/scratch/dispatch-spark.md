You are a mechanical editor in one repository. Do exactly the steps below, nothing more.
Repo root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public (all paths from there).

RUN CONTEXT
- You are a non-interactive child; AI_SESSION_CHILD=1 and SYSTEM_SPEC_GATE_ENFORCE=0 are set.
  Never ask the documentation-scope (A/B/C/D/E) question — no one is there to answer it.
- Write only under .opencode/skills/sk-design/sk-design-chart/ and
  specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/024-micro-forms/scratch/.

DON'T
- No git state change of any kind (no add, commit, checkout, stash, restore).
- No nested CLI, no agent dispatch, no subprocess beyond the verification commands below.
- No render gate, no --render, no screenshots.
- No external resource (font, CDN, image, script) in any template.
- No toLocaleString, no Intl.
- No spec path, requirement id or task id in a code comment — write the durable why.
- Palette values and gate thresholds are frozen. Never remove or weaken a checker assertion.

STEP 1 — author one new chart form: spark
Create .opencode/skills/sk-design/sk-design-chart/assets/templates/spark.html by copying
assets/templates/daily-line.html and reducing it. The reader question it answers is "what has this
number been doing lately", at the size of a KPI row rather than a full card. Keep every corpus
contract the copy already carries: doctype, lang, charset, viewport, title, the identity meta pair
(chart-template content="spark", chart-color-system content="neutral"), the CHART_PALETTE and
CHART_PALETTE_DARK blocks byte-identical to the source file's, the GEOMETRY DEFAULTS comment block
byte-identical, CHART_DATA, READOUT with its unit, FINDING, METRIC, the five card parts in order
(headline, subtitle, figure, footer, source), the data table inside <details class="data"> with its
summary, the empty notice, role="img" with aria-labelledby, the desc pair, unique ids, and the
no-external rule.
Differences from daily-line:
  a. viewBox="0 0 720 176". The drawing is a single trend line with no axis ticks, no gridlines and
     no y-axis labels: a spark is read against itself, and the numbers live in the metric header and
     the table. Keep a 12-unit inset on every side.
  b. three variants in one file, declared in the geometry region as
       /* VARIANTS:BEGIN */
       const VARIANT = 'area';   // 'line' | 'area' | 'bar'
       /* VARIANTS:END */
     and drawn accordingly: 'line' is the 2px stroke alone, 'area' adds the same 0.35-to-0.04
     gradient fill daily-line uses, 'bar' draws one column per reading at the mark radius with a
     2-unit gap. Ship the file with 'area'.
  c. METRIC.present is true: the value is the last reading, the delta compares it with the first,
     the period names the span.
  d. the highlighted mark is the last reading, not the lowest: a spark says where the number is now.
  e. data: 24 readings of a plausible weekly active-user count, rising then dipping, in CHART_DATA
     with a `week` key; the headline is the conclusion the shape supports and the finding states the
     first-to-last change with both numbers.
Accept when: node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs prints RESULT: PASSED with 27 chart forms scanned.

STEP 2 — register it in the catalogue
In .opencode/skills/sk-design/sk-design-chart/references/catalog.md, inside the
<!-- CHART_CATALOG:BEGIN --> table, add one row in the `time` family group, in the same column order
as its neighbours:
  | spark | time | What has this number been doing lately | 12 to 30 readings, one series, no axis | neutral | assets/templates/spark.html |
The prose outside the sentinels is free; if section 4 or section 5 names the families or the reader
phrases, add spark there in one line each so the page stays true.
Accept when: the catalog and catalog-system families pass with 27 rows.

STEP 3 — no new checker family
Every existing family already binds a new form. Do not add one.

VERIFY — paste each command with its result line
  node --check .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs
  node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs      # must print RESULT: PASSED
  rg -c "chart-template\" content=\"spark\"" .opencode/skills/sk-design/sk-design-chart/assets/templates/spark.html   # 1
  rg -c "^\| spark \|" .opencode/skills/sk-design/sk-design-chart/references/catalog.md   # 1

HANDBACK — emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count, by group>
assertion: <name | what it errors on | exact FAIL line from the mutated copy>
verification: <each command with its result line>
failures: <none, or what blocked and where you stopped>
