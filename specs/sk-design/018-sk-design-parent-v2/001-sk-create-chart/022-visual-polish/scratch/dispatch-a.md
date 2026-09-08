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

STEP 1 — take the retarget sentence out of the reader-visible source line (21 files)
Exactly 21 files under .opencode/skills/sk-design/sk-design-chart/assets/templates/*.html carry,
inside <p class="source" data-chart-part="source">...</p>, the trailing sentence
  " Replace the data block at the top of the script and nothing else."
Anchor: assets/templates/daily-line.html:244. assets/examples/*.html carry none — do not open them.
In each of the 21 files:
  a. delete that sentence and the single space before it; leave the rest of the source text,
     the element and its attributes untouched;
  b. add one comment line directly above the /* CHART_DATA:BEGIN */ line
     (anchor: daily-line.html:257), reading exactly:
     // Retargeting this chart means replacing the data block below and nothing else.
Accept when: 21 files changed, each with one deletion and one inserted comment line.

STEP 2 — add the source-line checker family
In .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs add
  function checkSourceLine(file, src)
modelled on checkLegend (line 1566): destructure regionsOf(stripHtmlComments(src)), call
tally('source-line', 1), and report with record('source-line', 'error', file, <message>).
It errors when the text of the <p class="source" data-chart-part="source"> element contains
"Replace the data block". The message states what is wrong and why the retarget instruction
belongs in the script comment rather than in the line the reader sees.
Register the call beside checkLegend(name, src); and checkTooltipCard(name, src); at lines 2543-2544.
Accept when: node --check passes and the corpus run prints RESULT: PASSED.

STEP 3 — prove the assertion fires, on a mutated copy
  a. Copy one template to
     specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/022-visual-polish/scratch/mutant.html
     and put the deleted sentence back into its source element.
  b. Run: node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs \
       --extra specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/022-visual-polish/scratch
     This run is EXPECTED to print RESULT: FAILED and to report unrelated findings against the
     copy (duplicate identity, duplicate ids). Ignore those; take only the source-line line.
  c. Create scratch/mutations.md recording the assertion name and that FAIL line verbatim.
  d. Delete mutant.html. The clean run in VERIFY then proves the scratch directory is empty of it.
Accept when: mutations.md holds the verbatim source-line FAIL line and mutant.html is gone.

STEP 4 — correct the fade figures in the contract
.opencode/skills/sk-design/sk-design-chart/references/template-contract.md:134-135 currently says
the frozen area examples "use a vertical 0.8-to-0.1 gradient and 0.4 flat opacity for stacked areas
(chart-area-gradient.tsx:72-112)". Our shipped single-area fade is 0.35 to 0.04
(daily-line.html:137-138); our stacked bands are 0.4 flat. Rewrite that sentence so the shipped
figures are stated as ours and 0.8-to-0.1 survives only as the frozen shadcn measurement we
derived them from. Change nothing else in the file.
Accept when: the paragraph names 0.35/0.04 as ours and keeps 0.8-to-0.1 attributed to shadcn.

VERIFY — run these four, paste each command with its result line
  node --check .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs
  node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs      # must print RESULT: PASSED
  rg -c "Replace the data block" .opencode/skills/sk-design/sk-design-chart/assets/templates \
     .opencode/skills/sk-design/sk-design-chart/assets/examples                 # no matches; exit 1 is the pass
  rg -c "source-line" .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs   # >= 3

HANDBACK — emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count, by group>
assertion: <name | what it errors on | exact FAIL line from the mutated copy>
verification: <each command with its result line>
failures: <none, or what blocked and where you stopped>
