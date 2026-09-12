# Iteration 2: A2 — Every goal-text render surface and where a strip function sits (D3)

## Focus

Enumerate every surface that renders goal text today, decide where the durable/frontmatter boundary
lives (YAML parse versus an explicit marker), and name what breaks when a call site reads the file raw.
Angle A2 / decision D3 (charter `../../deep-research-strategy.md`:51).

## Actions Taken

1. Read both injection renderers end to end (hook core and opencode plugin).
2. Searched the goal surfaces for YAML/frontmatter handling (negative result).
3. Checked whether any runtime code path reads a packet `goal.md` today.
4. Read the template's durable/volatile boundary markers and the playbook's resend rule.

## Findings

### F1. There are exactly two renderers, and they are byte-compatible by design

`renderGoalBrief` (`.opencode/hooks/goal/lib/goal-core.cjs:383`) and `renderGoalInjection`
(`.opencode/plugins/opencode-goal.js:2614`) both emit:

```
[active_goal:<id>]
status: active
objective: <preview-clamped objective>
goal_prompt:
<goalPrompt text>
last_check: <verdict> ; reason: <reason>
usage: ...
directive: Continue toward this objective. ...
[/active_goal]
```

The core's comment states the field labels match the plugin byte-for-byte
(`[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:378]`), and both gate on the same predicate —
`goal.status !== 'active'` returns the empty string
(`[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:384]`,
`[SOURCE: .opencode/plugins/opencode-goal.js:2615]`). Two renderers means a strip contract must be
applied in **both**, or the drift is invisible until an operator compares two runtimes.

### F2. The injected text today is a *budget-shaped digest*, not a document

- Core caps: `DEFAULT_MAX_OBJECTIVE_CHARS = 4000`
  (`[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:60]`), `DEFAULT_MAX_INJECTION_CHARS = 4800`
  (`[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:62]`).
- Plugin caps: 4000 objective / 4000 goal_prompt / 4800 injection
  (`[SOURCE: .opencode/plugins/opencode-goal.js:29]`, `[SOURCE: .../opencode-goal.js:31]`).
- The objective is only a *preview*: `calculateObjectivePreviewChars` derives a ratio of the injection
  budget (`[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:366]`), and both renderers build a compact
  fallback block when the full shape exceeds the budget (`[SOURCE: .../goal-core.cjs:432]`,
  `[SOURCE: .../opencode-goal.js:2643]`).

Consequence: whatever slice of `goal.md` feeds `goal_prompt` is itself truncated by
`sanitizePromptText(promptText, promptBudget)` where `promptBudget = maxChars - blockOverhead`
(`[SOURCE: .../goal-core.cjs:428]`). If the frontmatter were included in that text, the metadata would
eat the budget *before* the completion criteria — the tail this template explicitly warns about
(`[SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:39]`).

### F3. No goal surface can parse YAML, and no runtime path reads a packet `goal.md`

A search across `goal-core.cjs`, `opencode-goal.js`, `bin/goal.cjs`, and `cursor/goal-inject.mjs` for
`yaml`/`frontmatter` returned **zero matches**. The hook reads its own JSON record through
`readGoalRecordForScope` (`[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:622]`) written by `setGoal`
(`[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:897]`); the plugin reads
`goalPathForSession(...)` under its own `DEFAULT_STATE_DIR`
(`[SOURCE: .opencode/plugins/opencode-goal.js:1131]`).

So the strip contract is **new surface area**, not a modification of an existing parse: any option that
requires a YAML parser adds a dependency to a `.cjs` hook and a plugin that today have none.

### F4. The template already carries the durable boundary as an explicit marker

`goal.md.tmpl` states the durable/volatile rule in prose ("Everything above the log is DURABLE",
`[SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:38]`) and encodes it as anchors:
`ANCHOR:directive`, `ANCHOR:binding` (phase only), `ANCHOR:completion`, `ANCHOR:log`
(`[SOURCE: .../goal.md.tmpl:48]`, `[SOURCE: .../goal.md.tmpl:71]`, `[SOURCE: .../goal.md.tmpl:88]`,
`[SOURCE: .../goal.md.tmpl:99]`). The YAML frontmatter carries `title`, `description`,
`trigger_phrases`, and the `_memory.continuity` block
(`[SOURCE: .../goal.md.tmpl:4]`, `[SOURCE: .../goal.md.tmpl:16]`).

The chat resend rule names its trigger and its content: resend "the full text of this file" when the
objective, a decision, the binding table, or a criterion changes
(`[SOURCE: .opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:74]`);
"Log entries never trigger a resend" (`[SOURCE: .../goal-set-string-playbook.md:79]`); a child change
inside its own phase needs no resend (`[SOURCE: .../goal-set-string-playbook.md:78]`).

That gives two distinct slices, and they are not the same slice:

| Slice | Boundary | Consumer |
|-------|----------|----------|
| **Durable slice** | body start after frontmatter, end at the log anchor | chat resend, injection `goal_prompt`, CLI show |
| **Objective slice** | pointer + completion criteria copied verbatim | the runtime goal tool's `objective` (`[SOURCE: .opencode/commands/speckit/assets/speckit-plan.yaml:172]`: "Pointer plus copied completion criteria; never a file body") |

### F5. Consumers that must strip, and the consequence of one raw read

| # | Surface | Today | If it read raw |
|---|---------|-------|----------------|
| 1 | Chat resend (speckit command) | playbook rule, prose only (`playbook.md:74`) | operator's completion copy carries `sha256:` fingerprints and `trigger_phrases` |
| 2 | Hook injection (`renderGoalBrief`) | reads JSON record (`goal-core.cjs:622`) | `_memory.continuity` consumes the 4800 budget before the criteria |
| 3 | Plugin injection (`renderGoalInjection`) | reads per-session JSON (`opencode-goal.js:1131`) | same, and drift from (2) |
| 4 | Runtime objective (`setGoal` → `objective`) | `objective_shape` rule already forbids a file body (`speckit-plan.yaml:172`) | the 4000 objective cap truncates a document that was never meant to fit |
| 5 | CLI show (`bin/goal.cjs`) | prints the brief | operator sees YAML where the directive should be |

Note the tension with (4): a *third* slice rule exists already. Reusing the raw durable slice as the
objective would satisfy "never a file body" only accidentally — for a short goal the durable slice is the
body; for a long one it is not. The objective path must keep its own "pointer + criteria" projection.

## Candidate strip placements (D3)

| Option | Where the boundary lives | Cost today | What fails | Enforcement site |
|--------|--------------------------|-----------|------------|------------------|
| **O2-A** | YAML parse: `parseFrontmatter(text)` splits on `---` delimiters and hands the body on | needs a parser the three files do not have | hand-rolled parsing of `_memory.continuity` (nested map, quoted values, `sha256:` colons) is a correctness risk; a real YAML dep lands inside a hook | a new module imported by both renderers |
| **O2-B** | Explicit marker: slice from body start to `ANCHOR:log`, using the anchors the template already emits | no parser; anchors exist in every scaffolded goal | a hand-edited goal that drops anchors yields either an empty slice or a full-file fallback — needs a documented fallback | shared `readGoalDurableSlice()` next to `readGoalRecordForScope` (`goal-core.cjs:622`) |
| **O2-C** | Frontmatter delimiter only (drop up to the second `---` line) | trivial to implement | still ships template scaffolding (`<!-- SPECKIT_TEMPLATE_SOURCE ... -->`, HVR blockquote, the "Everything above the log is DURABLE" prose) into chat and injection | same site as O2-B |
| **O2-D** | Materialized slice file written beside `goal.md` at update time | no read-time logic at all | two files drift; a stale slice resends superseded criteria — the exact failure the resend rule exists to prevent | n/a |

## Assessment

- `newInfoRatio`: 0.75 — the two-renderer byte-compatibility requirement, the preview/budget arithmetic,
  the absence of any YAML handling, and the marker encoding of the durable boundary are new; the
  template's durable/volatile prose was already in Known Context.
- Confidence: high on F1-F4 (read directly); F5 row 1 is a prose rule, not code — its enforcement site is
  the speckit command, which iteration 10 revisits as a pipeline.
- One sentence: the strip contract is cheaper as a marker slice than as YAML parsing, and it must be
  applied in both renderers plus the chat path.

## Reflection

- What worked: reading the *arithmetic* inside both renderers — the compact fallback and the prompt
  budget show that the frontmatter is not merely noise, it is budget the criteria need.
- What failed: the repo-wide search for code reading `goal.md` produced only template/doc hits; the
  mangled output made the negative result slightly expensive to confirm, so it is recorded as
  "no runtime path read found", not "provably none exists".
- Ruled out: (a) YAML parsing as the boundary (O2-A) given zero existing parser and a nested continuity
  block; (b) a materialized slice file (O2-D) because it re-creates the stale-copy failure the resend rule
  is designed to prevent.

## Sources Consulted

- `.opencode/hooks/goal/lib/goal-core.cjs` (60, 62, 338, 366, 378, 383, 384, 428, 432, 622, 897)
- `.opencode/plugins/opencode-goal.js` (29, 31, 1131, 2614, 2615, 2643)
- `.opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl` (4, 16, 38, 48, 71, 88, 99)
- `.opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md` (74, 78, 79)
- `.opencode/commands/speckit/assets/speckit-plan.yaml` (171, 172)

## Recommended Next Focus

Iteration 3 (A3 / KQ3 / D2): inventory what `.opencode/skills/.state/goal/` holds today and which fields
`goal.md` cannot carry — the store-fate decision.
