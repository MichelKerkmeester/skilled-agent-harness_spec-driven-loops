You are a mechanical editor in one repository. Do exactly the steps below, nothing more.
Repo root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public (all paths from there).

RUN CONTEXT
- You are a non-interactive child; AI_SESSION_CHILD=1 and SYSTEM_SPEC_GATE_ENFORCE=0 are set.
  Never ask the documentation-scope (A/B/C/D/E) question — no one is there to answer it.
- Write only under .opencode/skills/sk-design/sk-design-chart/ and
  specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/025-mark-and-indicator-policies/scratch/.

DON'T
- No git state change of any kind (no add, commit, checkout, stash, restore).
- No nested CLI, no agent dispatch, no subprocess beyond the verification commands below.
- No render gate, no --render, no screenshots.
- No external resource (font, CDN, image, script) in any template.
- No toLocaleString, no Intl.
- No spec path, requirement id or task id in a code comment — write the durable why.
- Palette values and gate thresholds are frozen. Never remove or weaken a checker assertion.

STEP 1 — declare every mark policy that carries meaning (29 templates, 7 deliveries)
Each form already declares CURVE where it draws a path. Add one MARKS block directly after the
CURVE block, or after READOUT where a form has no CURVE, in all 36 files:
  /* MARKS:BEGIN */
  const MARKS = {
    points: 'none',        // 'none' | 'sparse' | 'all'
    fill: 'none',          // 'none' | 'gradient' | 'flat'
    zero: 'baseline',      // 'baseline' | 'meaningful'
    why: 'one line naming what each choice protects for this form'
  };
  /* MARKS:END */
Fill each field from what the file already draws, never by changing the drawing:
  points  'all' when the form paints a visible dot at every reading, 'sparse' when it paints dots
          only on a short series or on the one emphasised reading, 'none' when it paints none.
  fill    'gradient' for a single area fading to the baseline (daily-line, spark), 'flat' for
          stacked bands at a flat opacity (stacked-area), 'none' for every form with no area.
  zero    'meaningful' only where the form's data crosses zero and the drawing splits positive
          from negative (waterfall, dumbbell if it does, bar-columns if any value is negative),
          'baseline' everywhere else.
Read each file before writing its block; a wrong declaration is worse than none.
Accept when: 36 files carry a MARKS block whose values match what the file draws.

STEP 2 — add the mark-policy checker family
In scripts/check-corpus.cjs add function checkMarkPolicy(file, src) modelled on checkFindingCue:
regionsOf(stripHtmlComments(src)), tally('mark-policy', 4), record('mark-policy', 'error', file, <message>).
It errors when (1) a chart form has no MARKS block, (2) points is not one of none, sparse, all,
(3) fill is not one of none, gradient, flat, or (4) zero is not one of baseline, meaningful.
Add one cross-check: fill 'gradient' or 'flat' requires a linearGradient or a fill-opacity rule in
the file, and fill 'none' requires neither. Register beside checkFindingCue(name, src);.
Accept when: node --check passes and the corpus run prints RESULT: PASSED.

STEP 3 — prove it fires
Copy assets/templates/daily-line.html to
specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/025-mark-and-indicator-policies/scratch/mutant.html,
set points: 'often', run
  node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs --extra specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/025-mark-and-indicator-policies/scratch
Expect RESULT: FAILED plus unrelated copy findings; take only the mark-policy line.
APPEND it verbatim to scratch/mutations.md (create if absent, never overwrite), delete mutant.html.

VERIFY — paste each command with its result line
  node --check .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs
  node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs      # must print RESULT: PASSED
  rg -c "MARKS:BEGIN" .opencode/skills/sk-design/sk-design-chart/assets/templates .opencode/skills/sk-design/sk-design-chart/assets/examples | rg -c ":1$"   # 36
  rg -c "mark-policy" .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs   # >= 3

HANDBACK — emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count, by group>
assertion: <name | what it errors on | exact FAIL line from the mutated copy>
verification: <each command with its result line>
failures: <none, or what blocked and where you stopped>
