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

STEP 1 — raise the plot of the cartesian forms toward the reference proportion (16 templates)
Every form draws in a 720-unit-wide viewBox; the height sets the plot proportion. Change the viewBox
height and every constant that positions the baseline, ticks, legend and footer inside the SVG so the
drawing fills the new height, for these forms only, to these heights:
  bar-columns 320->392   bar-line-composed 300->392   bar-rows 292->392   box-plot 320->392
  candlestick 320->392   daily-line 292->392          daily-range 292->392  distribution-strip 268->380
  dumbbell 308->392      grouped-bars 330->392        histogram 320->392    scatter 316->392
  stacked-area 330->392  stacked-bars 330->392        waterfall 320->392    parallel-axes 300->392
Anchor: assets/templates/daily-line.html has viewBox="0 0 720 292", const TOP = 20 and const BASE = 244;
BASE and the x-axis label y must move down by the same amount the height grows (292->392 is +100), and
any legend row below the plot moves with it. The other ten forms (calendar-grid, heat-matrix, unit-grid,
unit-ring, treemap, progress-single, bullet, funnel, independent-percentages, population-pyramid) keep
their heights: a taller frame would only add empty ground. Deliveries under assets/examples/ that
derive from a changed form take the same height and offsets. Do not touch the GEOMETRY DEFAULTS
comment block: frame width, pan floor and card measurements do not change.
Write scratch/proportions.md: one line per form, old height, new height, ratio, and "kept" with a
reason for the ten unchanged.
Accept when: 16 templates and their deliveries changed; the checker's narrow-viewport family still passes.

STEP 2 — no new checker family for this move
The geometry is per form by contract. Only run the existing checker.

VERIFY — paste each command with its result line
  node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs      # must print RESULT: PASSED
  rg -c 'viewBox="0 0 720 392"' .opencode/skills/sk-design/sk-design-chart/assets/templates | rg -c ":1$"   # 15
  rg -c 'viewBox="0 0 720 380"' .opencode/skills/sk-design/sk-design-chart/assets/templates/distribution-strip.html   # 1

HANDBACK — emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count, by group>
assertion: <name | what it errors on | exact FAIL line from the mutated copy>
verification: <each command with its result line>
failures: <none, or what blocked and where you stopped>
