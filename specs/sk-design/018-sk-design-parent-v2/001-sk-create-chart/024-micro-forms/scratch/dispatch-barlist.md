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

STEP 1 — author one new chart form: bar-list
Create .opencode/skills/sk-design/sk-design-chart/assets/templates/bar-list.html by copying
assets/templates/bar-rows.html and changing what the question needs. The reader question is "which
of these is biggest, when the names are long": a compact ranked list where the label sits inside the
bar and the value at the right edge, so a long name costs no horizontal room.
Differences from bar-rows:
  a. identity meta: chart-template content="bar-list", chart-color-system content="neutral".
     Palette blocks and the GEOMETRY DEFAULTS comment block stay byte-identical to bar-rows.
  b. viewBox="0 0 720 320". Eight rows, each a full-width track at the track radius holding a filled
     bar whose width is the value's share of the largest; the category label is drawn inside the bar
     at its left edge in the surface colour when the bar is wide enough to hold it and in ink just
     outside the bar end when it is not; the value is right-aligned at the frame's right edge in the
     mono stack. No axis, no ticks, no gridlines: the ranking is the reading.
  c. CHART_DATA is 8 entries with a `label` and a `value`, plausible referrer traffic with long
     source names, sorted descending in the data block itself so the file ships ranked.
  d. the emphasised row is the largest, using the emphasis token as bar-columns does.
  e. METRIC.present is true: the value is the total across all rows, the delta is the largest row's
     share of that total, the period names the span.
  f. the form has a tooltip card per row through READOUT, so the disclosure ships closed; the table
     lists every row with its value; READOUT.unit is 'visits'.
Accept when: the corpus check prints RESULT: PASSED with 29 chart forms scanned.

STEP 2 — register it in the catalogue
Add one row inside <!-- CHART_CATALOG:BEGIN --> in the `comparison` family group:
  | bar-list | comparison | Which of these is biggest, when the names are long | 5 to 10 categories, one value each, ranked | neutral | assets/templates/bar-list.html |
Keep the prose sections true if they enumerate forms. Section 6 lists forms this corpus does not
draw and why; if it claims a ranked list is covered by bar-rows alone, correct that line to say
bar-rows carries short names beside the bar and bar-list carries long names inside it.
Accept when: catalog and catalog-system pass with 29 rows.

STEP 3 — no new checker family
Every existing family already binds a new form. Do not add one.

VERIFY — paste each command with its result line
  node --check .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs
  node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs      # must print RESULT: PASSED
  rg -c "chart-template\" content=\"bar-list\"" .opencode/skills/sk-design/sk-design-chart/assets/templates/bar-list.html   # 1
  rg -c "^\| bar-list \|" .opencode/skills/sk-design/sk-design-chart/references/catalog.md   # 1

HANDBACK — emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count, by group>
assertion: <name | what it errors on | exact FAIL line from the mutated copy>
verification: <each command with its result line>
failures: <none, or what blocked and where you stopped>
