You are a mechanical editor in one repository. Do exactly the steps below, nothing more.
Repo root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public (all paths from there).

RUN CONTEXT
- You are a non-interactive child; AI_SESSION_CHILD=1 and SYSTEM_SPEC_GATE_ENFORCE=0 are set.
  Never ask the documentation-scope (A/B/C/D/E) question — no one is there to answer it.
- Write only under .opencode/skills/sk-design/sk-design-chart/ and
  specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/022-visual-polish/scratch/.

DON'T
- No git state change of any kind (no add, commit, checkout, stash, restore).
- No nested CLI, no agent dispatch, no subprocess beyond the verification commands below.
- No render gate, no --render, no screenshots.
- No external resource (font, CDN, image, script) in any template.
- No toLocaleString, no Intl.
- No spec path, requirement id or task id in a code comment — write the durable why.
- Palette values and gate thresholds are frozen. Never remove or weaken a checker assertion.

STEP 1 — fold the data table behind a native disclosure (33 files)
Scope: all 26 files at .opencode/skills/sk-design/sk-design-chart/assets/templates/*.html and all 7 at
assets/examples/*.html. Anchor: assets/templates/daily-line.html:248-249 shows the current shape:
  <div class="table-pan">
    <table data-chart-table>
In each file:
  a. wrap the existing <div class="table-pan"> ... </div> (the whole table block) in
       <details class="data" open>  <summary>Show the data</summary>  ...  </details>
     keeping the table element and its data-chart-table attribute exactly as they are;
  b. the open attribute is present only when the file has NO data-chart-tooltip element (the eight
     inert forms: bar-columns, bar-rows, independent-percentages, parallel-axes, progress-single,
     unit-grid, unit-ring, waterfall, plus the deliveries that derive from them); every tooltip form
     gets <details class="data"> without open;
  c. add these two rules to the stylesheet after the existing .table-pan rule:
       details.data > summary { cursor: pointer; font-size: 14px; color: var(--chart-muted); padding: 6px 0; list-style: none; }
       details.data > summary::-webkit-details-marker { display: none; }
     and give the summary a leading inline SVG chevron (12px, currentColor, aria-hidden="true") that
     rotates 90 degrees when the details is open, via details.data[open] > summary svg { transform: rotate(90deg); }.
Accept when: 33 files changed, each with one details wrapper, one summary, and the open attribute matching its tooltip register.

STEP 2 — add the table-disclosure checker family
In scripts/check-corpus.cjs add function checkTableDisclosure(file, src) modelled on checkLegend:
regionsOf(stripHtmlComments(src)), tally('table-disclosure', 3), record('table-disclosure', 'error', file, <message>).
It errors when (1) the data-chart-table element is not inside a <details class="data"> element,
(2) that details has no <summary>, or (3) the details carries open while the file has a data-chart-tooltip
element, or lacks open while the file has none. Messages state what is wrong and why the table is folded
but never removed. Register beside checkLegend(name, src); and checkTooltipCard(name, src);.
Accept when: node --check passes and the corpus run prints RESULT: PASSED.

STEP 3 — prove it fires
Copy assets/templates/daily-line.html to
specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/022-visual-polish/scratch/mutant.html,
add the open attribute to its details (it is a tooltip form), run
  node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs --extra specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/022-visual-polish/scratch
Expect RESULT: FAILED plus unrelated copy findings; take only the table-disclosure line.
Append it verbatim to scratch/mutations.md, then delete mutant.html.

VERIFY — paste each command with its result line
  node --check .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs
  node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs      # must print RESULT: PASSED
  rg -c "<details class=\"data\"" .opencode/skills/sk-design/sk-design-chart/assets/templates .opencode/skills/sk-design/sk-design-chart/assets/examples | rg -c ":1$"   # 33
  rg -c "table-disclosure" .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs   # >= 3

HANDBACK — emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count, by group>
assertion: <name | what it errors on | exact FAIL line from the mutated copy>
verification: <each command with its result line>
failures: <none, or what blocked and where you stopped>
