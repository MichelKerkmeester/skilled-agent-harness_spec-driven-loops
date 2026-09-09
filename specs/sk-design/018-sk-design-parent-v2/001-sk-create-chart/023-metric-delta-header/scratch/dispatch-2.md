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

STEP 1 — carry the metric header to the forms whose data has a meaningful baseline
daily-line.html already carries the pattern: a METRIC block after /* FINDING:END */, a
<div class="metric" data-chart-part="metric"> between the subtitle and the figure, the four .metric
CSS rules after .subtitle, and the script that fills value, unit, cue, delta and period from METRIC.
Copy that pattern into these eight files, computing every number from that file's own CHART_DATA and
never inventing one:
  assets/templates/bar-line-composed.html   value: the last week's orders; delta versus the first week
  assets/templates/candlestick.html         value: the closing level; delta versus the opening level
  assets/templates/daily-range.html         value: the last day's high; delta versus the first day's high
  assets/templates/dumbbell.html            value: the median after-value; delta versus the median before-value
  assets/templates/grouped-bars.html        value: this year's total; delta versus last year's total
  assets/templates/waterfall.html           value: the running total at the last step; delta versus the first
  assets/examples/orders-after-the-price-change.html  value: the last day's orders; delta versus the first day's
  assets/examples/where-the-budget-went.html          value: the largest category's share; delta present false
For each: valueLabel is the formatted number as the table prints it, deltaLabel is a short phrase
naming the comparison ("12% above last year", "4 points below the open"), period names the span the
data covers, and trend is up, down or none from the sign of the delta. When a form has no honest
baseline set present: false, delta: null, deltaLabel: '', and keep the block; the script then removes
the div and the card reads as it did before.
Also add the same METRIC block with present: false to the remaining 19 templates and 5 deliveries, so
every file declares the decision rather than leaving it unstated. Do not add the div to those files.
Accept when: 33 files carry a METRIC block, 8 of them present: true with a rendered header.

STEP 2 — tighten the assertion to the roll-out
In scripts/check-corpus.cjs the metric-block family already errors on a missing block, a missing
valueLabel or deltaLabel when present is true, a trend outside the set, and a script that never reads
METRIC.valueLabel. Add two: (1) every chart form must declare a METRIC block, present true or false;
(2) present: false must pair with no data-chart-part="metric" element in the markup. Raise the tally
to match. Do not weaken any existing check.
Accept when: node --check passes and the corpus run prints RESULT: PASSED.

STEP 3 — prove the new pair fires
Copy assets/templates/bar-columns.html to
specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/023-metric-delta-header/scratch/mutant.html,
delete its METRIC block, run
  node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs --extra specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/023-metric-delta-header/scratch
Expect RESULT: FAILED plus unrelated copy findings; take only the metric-block line.
APPEND it verbatim to scratch/mutations.md (never overwrite), then delete mutant.html.

VERIFY — paste each command with its result line
  node --check .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs
  node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs      # must print RESULT: PASSED
  rg -c "METRIC:BEGIN" .opencode/skills/sk-design/sk-design-chart/assets/templates .opencode/skills/sk-design/sk-design-chart/assets/examples | rg -c ":1$"   # 33
  rg -c "present: true" .opencode/skills/sk-design/sk-design-chart/assets/templates .opencode/skills/sk-design/sk-design-chart/assets/examples | rg -c ":1$"   # 8

HANDBACK — emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count, by group>
assertion: <name | what it errors on | exact FAIL line from the mutated copy>
verification: <each command with its result line>
failures: <none, or what blocked and where you stopped>
