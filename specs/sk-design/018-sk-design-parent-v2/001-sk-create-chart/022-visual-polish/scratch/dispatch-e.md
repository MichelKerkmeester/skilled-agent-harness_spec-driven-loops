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

STEP 1 — declare the unit and format large ticks compactly (26 templates, 7 deliveries)
Anchors in assets/templates/daily-line.html: the READOUT block
  const READOUT = { label: ..., value: ..., key: 'day' };
and the number formatter function fmt(v, decimals) at about line 320, used by ticks, card and table.
In every file that has a READOUT block:
  a. add a field  unit: ''  (or the real unit as a short string when the data has one: '%', 'min',
     'pallets', 'GBP', 'orders'; read the headline and table header to decide) as the last field;
  b. in the tooltip card code where the value is written, append the unit after the value with a
     thin space ( ) when READOUT.unit is non-empty.
In every file that draws axis ticks with fmt (cartesian forms), add directly after fmt:
  // Ticks above four digits read as 12k or 1.2M; values in the card and the table keep every digit.
  function compact(v) {
    var a = Math.abs(v);
    if (a >= 1e6) return (Math.round(v / 1e5) / 10).toString().replace(/\.0$/, '') + 'M';
    if (a >= 1e4) return (Math.round(v / 100) / 10).toString().replace(/\.0$/, '') + 'k';
    return fmt(v);
  }
  and make the tick text use compact(value) where it used fmt(value) for the value axis only.
Accept when: every READOUT has a unit field; every cartesian tick uses compact; card and table unchanged.

STEP 2 — extend the number-format checker family
In scripts/check-corpus.cjs, inside the existing number-format check that already requires READOUT
on tooltip forms, add one assertion: a READOUT block without a unit field errors, with a message that
says the card prints the unit after the value and an empty string is the way to say there is none.
tally accordingly (one more per tooltip form). Do not add a new family.
Accept when: node --check passes and the corpus run prints RESULT: PASSED.

STEP 3 — prove it fires
Copy assets/templates/daily-line.html to
specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/022-visual-polish/scratch/mutant.html,
delete its unit field, run
  node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs --extra specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/022-visual-polish/scratch
Expect RESULT: FAILED plus unrelated copy findings; take only the number-format unit line.
Append it verbatim to scratch/mutations.md, then delete mutant.html.

VERIFY — paste each command with its result line
  node --check .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs
  node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs      # must print RESULT: PASSED
  rg -c "unit:" .opencode/skills/sk-design/sk-design-chart/assets/templates | rg -c ":[1-9]"   # 18 tooltip templates
  rg -l "function compact" .opencode/skills/sk-design/sk-design-chart/assets/templates | wc -l   # the cartesian forms

HANDBACK — emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count, by group>
assertion: <name | what it errors on | exact FAIL line from the mutated copy>
verification: <each command with its result line>
failures: <none, or what blocked and where you stopped>
