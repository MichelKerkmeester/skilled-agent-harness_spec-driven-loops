You are a mechanical editor in one repository. Do exactly the steps below, nothing more.
Repo root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public (all paths from there).

RUN CONTEXT
- You are a non-interactive child; AI_SESSION_CHILD=1 and SYSTEM_SPEC_GATE_ENFORCE=0 are set.
  Never ask the documentation-scope (A/B/C/D/E) question — no one is there to answer it.
- Write only under .opencode/skills/sk-design/sk-design-chart/ and
  specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/023-metric-delta-header/scratch/.

DON'T
- No git state change of any kind (no add, commit, checkout, stash, restore).
- No nested CLI, no agent dispatch, no subprocess beyond the verification commands below.
- No render gate, no --render, no screenshots.
- No external resource (font, CDN, image, script) in any template.
- No toLocaleString, no Intl.
- No spec path, requirement id or task id in a code comment — write the durable why.
- Palette values and gate thresholds are frozen. Never remove or weaken a checker assertion.

STEP 1 — publish the metric rung in the palette source
.opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json holds typeScale with
roles {headline 16px, body 14px, label 12px} and departures {hero 56px, monthStrip 10px, ringTotal 34px}.
Add one role: "metric": "26px", placed after "headline" so the object reads largest-first among roles.
Extend the note sentence so it says the metric rung is the value a card leads with when its data has a
meaningful baseline. Change nothing else in the file; every colour value and gate is frozen.
Accept when: python3 -c "import json;print(json.load(open('.opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json'))['typeScale']['roles'])" prints a dict containing 'metric': '26px'.

STEP 2 — add the METRIC block and the header to one form only
Edit exactly one file: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html.
  a. after /* FINDING:END */ add
       /* METRIC:BEGIN */
       const METRIC = {
         present: true,
         value: 3958,
         valueLabel: '3,958',
         delta: -12.4,
         deltaLabel: '12.4% below the first week',
         period: 'four weeks to the twenty-eighth',
         trend: 'down',
         why: 'one line: the value is the total the table sums to, and the delta compares the last week with the first'
       };
       /* METRIC:END */
     with value and valueLabel matching a number a reader can find in the table (the sum of the DATA
     values), and delta computed from the same data, not invented. Recompute both from DATA yourself.
  b. between the subtitle paragraph and the <div class="figure"> add
       <div class="metric" data-chart-part="metric">
         <p class="metric-value"></p>
         <p class="metric-delta"></p>
       </div>
     and fill both from METRIC in the script: the value paragraph prints METRIC.valueLabel followed by
     READOUT.unit with a thin space when the unit is non-empty; the delta paragraph prints the same
     arrow shape the finding cue uses (up or down), then METRIC.deltaLabel, then the period in muted
     text. When METRIC.present is false the whole div is removed from the DOM at start-up.
  c. add to the stylesheet after the .subtitle rule:
       .metric { margin: 0 0 18px; }
       .metric-value { margin: 0; font-size: 26px; line-height: 1.2; font-weight: 600; color: var(--chart-ink); font-variant-numeric: tabular-nums; }
       .metric-delta { margin: 4px 0 0; font-size: 12px; color: var(--chart-muted); }
       .metric-delta .cue { vertical-align: -1px; margin-right: 4px; }
     and colour the cue with var(--chart-emphasis) for down and var(--chart-series-2) for up.
  d. CARD_PARTS in scripts/check-corpus.cjs is ['headline','subtitle','figure','footer','source'] at
     line 64 and the card-parts family requires that exact order. Make 'metric' an optional part that
     may appear between 'subtitle' and 'figure': the expected list accepts either sequence, and no
     other position for 'metric' passes.
Accept when: daily-line renders a value, a delta and a period above its plot, and the corpus run prints RESULT: PASSED.

STEP 3 — add the metric-block checker family
In scripts/check-corpus.cjs add function checkMetricBlock(file, src) modelled on checkFindingCue:
regionsOf(stripHtmlComments(src)), tally('metric-block', 4), record('metric-block', 'error', file, <message>).
It errors when (1) a file carries data-chart-part="metric" but no METRIC block, (2) METRIC.present is
true and either valueLabel or deltaLabel is missing, (3) trend is not one of up, down, none, or
(4) the script never reads METRIC.valueLabel. Register beside checkFindingCue(name, src);.
Accept when: node --check passes and the corpus run prints RESULT: PASSED.

STEP 4 — prove it fires
Copy assets/templates/daily-line.html to
specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/023-metric-delta-header/scratch/mutant.html,
set trend: 'sideways', run
  node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs --extra specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/023-metric-delta-header/scratch
Expect RESULT: FAILED plus unrelated copy findings; take only the metric-block line.
APPEND it verbatim to scratch/mutations.md (create the file if absent; never overwrite an existing one),
then delete mutant.html.

VERIFY — paste each command with its result line
  node --check .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs
  node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs      # must print RESULT: PASSED
  rg -c "METRIC:BEGIN" .opencode/skills/sk-design/sk-design-chart/assets/templates   # 1
  rg -c "metric-block" .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs   # >= 3

HANDBACK — emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count, by group>
assertion: <name | what it errors on | exact FAIL line from the mutated copy>
verification: <each command with its result line>
failures: <none, or what blocked and where you stopped>
