# Iteration 8: A8 — Budget and truncation arithmetic (D6)

## Focus

Measure the real caps: the 4000-character durable budget against every cap that actually applies, the cut
order when over, and where the budget should be enforced. Angle A8 / decision D6 (charter
`../../deep-research-strategy.md`:58).

## Actions Taken

1. Read the playbook's budget claims and worked example.
2. Read the cap constants and the preview/budget arithmetic in both renderers.
3. Verified whether the rule the playbook points at exists.
4. Collected real measured sizes from three packets.

## Findings

### F1. The durable budget is stated twice with two different numbers, and enforced nowhere

The playbook says "a 3,000 budget" (`[SOURCE: .opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:57]`,
worked example at `[SOURCE: .../goal-set-string-playbook.md:112]`) and points at
`validation-rules.md` for "the rule that checks the file's shape and the durable budget"
(`[SOURCE: .../goal-set-string-playbook.md:137]`). A search of that file for `goal` returns **nothing** —
the budget rule does not exist there. The charter's frozen constraint says the parent durable slice is at
most **4000** characters excluding frontmatter. So: two numbers, one frozen (4000), one stale (3000), and
zero enforcement.

### F2. What the runtime actually applies is a *chain* of sub-caps, each smaller than 4000

| Stage | Cap | Evidence |
|-------|-----|----------|
| Objective accepted at set time | 4000 chars | `[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:60]`, `[SOURCE: .opencode/plugins/opencode-goal.js:29]` |
| Build-time goal prompt | 4000 chars (`DEFAULT_MAX_GOAL_PROMPT_CHARS`) | `[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:61]` |
| Prompt's own Objective section | `max(240, min(1200, 4000 - 1900)) = 1200` chars | `[SOURCE: .../goal-core.cjs:343]`, overhead at `[SOURCE: .../goal-core.cjs:67]` |
| Injected `objective:` line | `min(600, floor(4800 * 0.12)) = 576` chars | `[SOURCE: .../goal-core.cjs:370]`, ratio at `[SOURCE: .../goal-core.cjs:68]` |
| Whole injected block | 4800 chars | `[SOURCE: .../goal-core.cjs:62]`, `[SOURCE: .opencode/plugins/opencode-goal.js:31]` |

The consequence is stark: a 4000-character durable slice **cannot be injected in full** even when it is
legal. The model sees a 576-character objective preview plus at most the prompt budget (≈2900 chars after
label overhead); the rest is truncated silently by `sanitizePromptText`
(`[SOURCE: .../goal-core.cjs:275]`). The template already warns that "a truncated objective loses its tail,
which is where the completion criteria live"
(`[SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:39]`).

### F3. Three real measurements show the durable slice outgrows the budget in practice

- 1,986 characters for a real four-phase packet's durable slice against the stated 3,000 budget
  (`[SOURCE: .../goal-set-string-playbook.md:112]`).
- The same packet's goal document is 4,243 characters while the set string is 529 — "the difference is what
  the pointer buys" (`[SOURCE: .../goal-set-string-playbook.md:120]`, `[SOURCE: .../goal-set-string-playbook.md:121]`).
- Packet 033's `goal.md` "reached 15,028 bytes across three phases while the objective an operator had set
  still described two" (`[SOURCE: specs/system-speckit/033-system-speckit-v4/010-goal-file-addon/spec.md:61]`).

That last row is the decisive one: the file legitimately grows past any per-session cap, which is why the
design must keep the file canonical and treat every injected/resend text as a **projection** of a bounded
slice.

### F4. The pointer is the mechanism that makes the small cap survivable

The playbook's own resolution is the set string — pointer plus binding sentence plus criteria copied
verbatim (`[SOURCE: .../goal-set-string-playbook.md:34]`), with the shape rule already fixed for the plan
command: "Pointer plus copied completion criteria; never a file body"
(`[SOURCE: .opencode/commands/speckit/assets/speckit-plan.yaml:172]`). The 529-character set string vs the
4,243-character document is the design working as intended; the failure mode is when something *else*
(resend, injection) tries to carry the body instead.

### F5. Cut order is already specified and should be reused verbatim

Log first, then restated child detail, then decision prose, and "criterion wording, never criterion count";
if it still will not fit, the packet is two goals and must be split
(`[SOURCE: .../goal-set-string-playbook.md:57]`, `[SOURCE: .../goal-set-string-playbook.md:63]`,
`[SOURCE: .../goal-set-string-playbook.md:65]`). Two additions this iteration argues for: the phase binding
table belongs with "restated child detail" (a pointer is enough), and the cut must never remove the
pointer.

### F6. The surviving enforcement site is the TS validator, not a shell script

The deleted `check-goal-shape.sh` (charter: commit `1cdc362aa62`) used to be that site; what remains is
`.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts`, which already knows
`goal.md` specifically: it is absent from `OPTIONAL_CONTINUITY_DOCS` so its continuity block is mandatory
(`[SOURCE: .../spec-doc-structure.ts:207]`) and present in `LAZY_DOCS_WITH_STATIC_ANCHORS` so its anchors
are required (`[SOURCE: .../spec-doc-structure.ts:229]`). Adding a deadline budget check there costs one
rule in a module that already resolves the document's contract.

## Budget options and enforcement (D6)

| Option | Rule | Cost today | What fails | Enforcement site |
|--------|------|-----------|------------|------------------|
| **O8-A** | Enforce **4000** on the measured durable slice (frontmatter and log excluded) as an error, no separate 3000 warning; rely on the existing cut order | One measurement + one threshold in a module that already parses the doc contract | A legal 4000-char slice still gets truncated at injection (F2) — the error says nothing about that | `spec-doc-structure.ts` beside the anchor rule |
| **O8-B** | Enforce a *two-tier* rule: warming at 3000, error at 4000, and record the injection ceiling (576/4800) as documentation | Same cost, more honest | Two numbers to maintain; risk of the 3000 tier becoming the de-facto cap again | same site |
| **O8-C** | Enforce nothing; document the chain | Zero | Today's state: a 15,028-byte file and no signal; the operator's copy silently lags | n/a |
| **O8-D** | Enforce at the consumer: refuse to set an objective longer than the cap and require the set-string shape | Catches the real failure at the point of use | Does not protect the file, only the objective; a resend of a 4000+ slice still fails at paste time | the goal set path (`setGoal`, core:897) + command-side objective_shape (`speckit-plan.yaml:172`) |

The recommendation is **O8-A with the O8-B warming tier**: the error threshold is the frozen 4000, the
playbook's 3000 is retired or re-labelled as a warming threshold, and the cut order stays the playbook's.
Additionally O8-D's consumer-side check is worth keeping because it is the only one that catches the
resend-paste failure directly.

## Assessment

- `newInfoRatio`: 0.72 — the cap chain arithmetic (576-char objective preview, 1200-char prompt objective
  section, 4800 block), the missing budget rule in validation-rules.md, and the three real measurements are
  new; the 4000/3000 numbers were in Known Context.
- Confidence: high on F1-F5 (constants and documents read directly; measurements quoted with sources).
  F6 is a design claim about the best enforcement site; the site exists but no rule is implemented there.
- One sentence: the durable slice can legally reach 4000 characters while every injected view of it is
  capped far below (576-char objective preview, ~2900-char prompt budget), so the file must stay canonical,
  the pointer must carry identity, and the budget belongs in the validator that already owns `goal.md`.

## Reflection

- What worked: computing the caps from constants instead of reading documentation — the 576-character
  objective preview is not mentioned in any document.
- What failed: the playbook's claimed budget rule is absent from `validation-rules.md`, matching the
  charter's note that the shape checker was deleted; the reference is now dangling.
- Ruled out: relying on runtime truncation as the guard (silent tail loss), and leaving the budget
  unenforced while a 15,028-byte file exists in the tree.

## Sources Consulted

- `.opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md` (34, 57, 63, 65, 112, 120, 121, 137)
- `.opencode/hooks/goal/lib/goal-core.cjs` (60-62, 67-70, 275, 343, 370, 897)
- `.opencode/plugins/opencode-goal.js` (29-31, 45-48)
- `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts` (207, 229)
- `.opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl` (39)
- `.opencode/commands/speckit/assets/speckit-plan.yaml` (172)
- `specs/system-speckit/033-system-speckit-v4/010-goal-file-addon/spec.md` (61)

## Recommended Next Focus

Iteration 9 (A1 + A3 second pass): binding and store fate designed as one mechanism, including the
migration of existing store records.
