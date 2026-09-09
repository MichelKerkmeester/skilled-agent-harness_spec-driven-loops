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

STEP 1 — author one new chart form: tracker
Create .opencode/skills/sk-design/sk-design-chart/assets/templates/tracker.html by copying
assets/templates/spark.html, which already carries every corpus contract in its smallest form, and
changing what the question needs. The reader question is "did each period hold, and when did it
not": a row of equal blocks, one per period, coloured by status. This is not a quantity chart, so
nothing is measured against an axis.
Differences from spark:
  a. identity meta: chart-template content="tracker", chart-color-system content="categorical".
     The palette blocks must be the categorical system's, byte-identical to the ones in
     assets/templates/stacked-bars.html (which declares categorical), and the GEOMETRY DEFAULTS
     comment block stays byte-identical to every other file's.
  b. viewBox="0 0 720 176". Draw 60 equal blocks in one row: each 8 units wide with a 4-unit gap,
     the row vertically centred, each block the mark radius. A block takes series-1 for "held",
     series-2 for "degraded" and the emphasis token for "failed"; the class ladder must run
     .status-1, .status-2 from 1 without a gap so the series-mapping family accepts it, and the
     emphasis class is named separately, as bar-columns names its emphasised mark.
  c. CHART_DATA is 60 entries with a `day` key and a `status` of 'held', 'degraded' or 'failed';
     make it a plausible uptime record: mostly held, a short degraded run, two failed days.
  d. a legend below the row naming the three statuses, built like the legend in
     assets/templates/stacked-bars.html so the legend family accepts it, and a tooltip card per
     block reading the day and its status through READOUT, so the form is NOT inert: the table
     disclosure ships closed.
  e. METRIC.present is true: the value is the count of held days, the delta compares the last thirty
     days with the first thirty, the period names the span.
  f. the table lists every day and its status; READOUT.unit is ''.
Accept when: the corpus check prints RESULT: PASSED with 28 chart forms scanned.

STEP 2 — register it in the catalogue
Add one row inside <!-- CHART_CATALOG:BEGIN --> in the `time` family group:
  | tracker | time | Did each period hold, and when did it not | 30 to 90 periods, one status each from a set of three | categorical | assets/templates/tracker.html |
Keep the prose sections true if they enumerate forms.
Accept when: catalog and catalog-system pass with 28 rows.

STEP 3 — no new checker family
Every existing family already binds a new form. Do not add one.

VERIFY — paste each command with its result line
  node --check .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs
  node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs      # must print RESULT: PASSED
  rg -c "chart-template\" content=\"tracker\"" .opencode/skills/sk-design/sk-design-chart/assets/templates/tracker.html   # 1
  rg -c "^\| tracker \|" .opencode/skills/sk-design/sk-design-chart/references/catalog.md   # 1

HANDBACK — emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count, by group>
assertion: <name | what it errors on | exact FAIL line from the mutated copy>
verification: <each command with its result line>
failures: <none, or what blocked and where you stopped>
