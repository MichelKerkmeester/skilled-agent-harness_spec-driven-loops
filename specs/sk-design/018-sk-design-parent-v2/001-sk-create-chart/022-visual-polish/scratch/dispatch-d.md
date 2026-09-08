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

STEP 1 — declare the finding's direction and draw its cue (33 files)
Scope: all 26 files at .opencode/skills/sk-design/sk-design-chart/assets/templates/*.html and all 7 at
assets/examples/*.html. Anchors in assets/templates/daily-line.html: the READOUT block at
/* READOUT:BEGIN */ ... /* READOUT:END */ (shape to copy), and the footer line
  <p class="finding">The 212 high on day 4 is never matched again after day 11 drops to a low of 96.</p>
In each file:
  a. directly after /* READOUT:END */ add
       /* FINDING:BEGIN */
       const FINDING = {
         trend: 'down',
         why: 'one line: the number in the finding sentence fell, rose, or has no direction'
       };
       /* FINDING:END */
     choosing trend from the finding sentence's own number: 'up', 'down' or 'none'. Files with no
     READOUT block (the inert forms) put the FINDING block directly above /* CHART_DATA:BEGIN */.
  b. give the finding paragraph an id="finding" and, in the script after the table is built, insert
     before its text an inline <svg class="cue" aria-hidden="true" width="12" height="12" viewBox="0 0 12 12">
     with one path: an arrow pointing up for 'up', down for 'down', 1.5px stroke, currentColor,
     no fill; insert nothing for 'none'. Add the rule
       .finding .cue { color: var(--chart-emphasis); vertical-align: -1px; margin-right: 6px; }
Accept when: 33 files changed, each with one FINDING block and a cue matching its trend.

STEP 2 — add the finding-cue checker family
In scripts/check-corpus.cjs add function checkFindingCue(file, src) modelled on checkLegend:
regionsOf(stripHtmlComments(src)), tally('finding-cue', 3), record('finding-cue', 'error', file, <message>).
It errors when (1) a file with a <p class="finding"> has no FINDING block, (2) trend is not one of
'up', 'down', 'none', or (3) the script does not read FINDING.trend to decide the cue (look for
FINDING.trend in the code). Register beside checkLegend(name, src); and checkTooltipCard(name, src);.
Accept when: node --check passes and the corpus run prints RESULT: PASSED.

STEP 3 — prove it fires
Copy assets/templates/daily-line.html to
specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/022-visual-polish/scratch/mutant.html,
set trend: 'sideways', run
  node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs --extra specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/022-visual-polish/scratch
Expect RESULT: FAILED plus unrelated copy findings; take only the finding-cue line.
Append it verbatim to scratch/mutations.md, then delete mutant.html.

VERIFY — paste each command with its result line
  node --check .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs
  node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs      # must print RESULT: PASSED
  rg -c "FINDING:BEGIN" .opencode/skills/sk-design/sk-design-chart/assets/templates .opencode/skills/sk-design/sk-design-chart/assets/examples | rg -c ":1$"   # 33
  rg -c "finding-cue" .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs   # >= 3

HANDBACK — emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count, by group>
assertion: <name | what it errors on | exact FAIL line from the mutated copy>
verification: <each command with its result line>
failures: <none, or what blocked and where you stopped>
