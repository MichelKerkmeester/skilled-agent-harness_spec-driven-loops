# Iteration 004 — The human-voice reference and the templates that cite it

- Angle: `hvr-rules.md` rules versus the boilerplate of the templates carrying an `HVR_REFERENCE` comment (10 files carry it; 7 unique templates + sample of the examples read per mandate), hand-read.
- Verdict: the templates that cite the human-voice standard as their voice authority ship their own hard-blocker punctuation violations (an em dash, an Oxford comma, a semicolon) in visible boilerplate, and the rules file itself points at template paths that no longer exist.
- Tool calls: 4 evidence reads + artifact writes.

## Findings (5: 4×P1, 1×P2)

### f-iter004-001 [P1] — goal.md's own boilerplate contains an em dash, two lines under its HVR_REFERENCE
- THE CLAIM (rule side): `hvr-rules.md` Section 3 — "**Em Dash Ban** | — | NEVER use" and Section 9 checklist "No em dashes".
- WHAT THE TEMPLATE CONTAINS: `templates/addons/goal.md.tmpl:35` — the blockquote directly under the `<!-- HVR_REFERENCE -->` comment at `:32` reads "…Keep it short — the runtime goal surfaces cap what they will hold…" (em dash in visible, scaffolded boilerplate).
- CONSEQUENCE: every scaffolded goal.md inherits a hard punctuation violation (-5 per occurrence, "automatic failure" per Section 6 mechanics) of the standard it cites; a voice-scoring pass on a goal.md would immediately deduct for the template's own text.
- SEVERITY: P1 (wrong: template boilerplate contradicts the cited standard in its most hard-banned class).
- RECOMMENDATION: fix — replace the em dash with a comma or colon; add a punctuation lint (em dash/semicolon/Oxford comma scan) to the template-parity or golden suite so the class cannot recur.

### f-iter004-002 [P1] — decision-record.md and goal.md headers ship Oxford commas
- THE CLAIM (rule side): `hvr-rules.md` Section 3 — "**Oxford Comma Ban** | , and | NEVER use | Drop the comma before 'and'/'or'".
- WHAT THE TEMPLATES CONTAIN: `templates/addons/decision-record.md.tmpl:3` — `"…architectural choices, alternatives, consequences, and implementation notes."` (Oxford comma in a four-item enumeration); `templates/addons/goal.md.tmpl:4` — `"…this packet executes against, and the criteria that decide…"` (comma before "and" in a two-item compound).
- CONSEQUENCE: both shipped descriptions carry the banned comma; decision-record's description is the canonical one a reader sees first.
- SEVERITY: P1 for decision-record (hard-banned punctuation in a shipped description), P2 for goal (two-item, borderline) — rowed together at P1.
- RECOMMENDATION: fix — drop the commas; same lint as f-iter004-001.

### f-iter004-003 [P1] — goal.md body contains a semicolon
- THE CLAIM (rule side): `hvr-rules.md` Section 3 — "**Semicolon Ban** | ; | NEVER use | Two sentences, or a conjunction".
- WHAT THE TEMPLATE CONTAINS: `templates/addons/goal.md.tmpl:77` — "**Precedence.** Decisions above outrank child detail; child detail outranks any…" (visible body, not a comment).
- CONSEQUENCE: the template's own guidance text for the precedence rule uses the one punctuation mark the standard bans outright, in the same document that carries the em dash (f-iter004-001).
- SEVERITY: P1 (wrong: two of the three hard punctuation bans are violated in one template).
- RECOMMENDATION: fix — split the sentence; fold into the lint.

### f-iter004-004 [P1] — hvr-rules.md's "Templates That Apply HVR" table names template paths that do not exist
- THE CLAIM (reference side): `sk-doc/sk-create-with-human-voice/references/hvr-rules.md:496-504` (Section 10) lists "Implementation Summary — `.opencode/skills/system-spec-kit/templates/*/implementation-summary.md`" and "Decision Record — `.opencode/skills/system-spec-kit/templates/level-3*/decision-record.md`".
- WHAT THE TREE HAS: `system-spec-kit/templates/` contains `core/`, `addons/`, `packet-types/` only — no `level-1/2/3/3+` directories (verified by listing), no `*`-wildcard real path, and the actual files are `templates/core/implementation-summary.md.tmpl` and `templates/addons/decision-record.md.tmpl`. The same reference is cited by all ten HVR_REFERENCE comments inside the system-spec-kit templates.
- CONSEQUENCE: the voice standard's own registry of the templates it applies to describes the pre-remediation layout that rounds one and two removed everywhere else (the round-two census f-iter008-004 removed `templates/stress-test/` and the level dirs were flattened); the sk-doc side was not touched.
- SEVERITY: P1 (wrong: the cited reference file is stale at its most concrete claim; every template that points at it points at a file whose own table lies about them).
- RECOMMENDATION: fix — correct the two rows to `templates/core/implementation-summary.md.tmpl` and `templates/addons/decision-record.md.tmpl`, or drop the table and reference the HVR_REFERENCE comments as the authoritative binding.

### f-iter004-005 [P2] — the HVR checklist bans `<!-- ANCHOR -->` comments that every citing template requires
- THE CLAIM (rule side): `hvr-rules.md:57-58` (Section 9 checklist) — "No Table of Contents and no `<!-- ANCHOR -->` navigation comments; navigate by the numbered H2 hierarchy".
- WHAT THE TEMPLATES REQUIRE: every HVR-citing template carries structural `<!-- ANCHOR:… -->` markers that the system-spec-kit `sectionGates` machinery enforces (`acceptance-criteria.md.tmpl:41`, `goal.md.tmpl` anchor region, `timeline.md.tmpl:19`, `roadmap.md.tmpl:19`, `before-after.md.tmpl:19`, `implementation-summary.md.tmpl:82`). Relatedly, Section 4's "exactly three items" rule is violated by natural-ternary boilerplate: `goal.md.tmpl:94` ("an exit code, a count, or a named artifact") and `acceptance-criteria.md.tmpl:37-38` ("every row below is `Met`, `Waived` or `Superseded`").
- CONSEQUENCE: the two standards conflict at the structural layer; a strict HVR pass on any scaffolded spec-kit document would flag the anchor comments the spec-kit validator requires.
- SEVERITY: P2 (cosmetic-conflict today — no machine enforces the HVR checklist against spec-kit docs — but the standard's own checklist is inapplicable as written to the documents it claims to cover).
- RECOMMENDATION: document — scope the HVR checklist's anchor rule (exempt structural `ANCHOR:` markers required by spec-kit gates; ban only free-form navigation comments), and add an exemption note for genuine ternary enumerations; otherwise a strict HVR gate cannot coexist with spec-kit validation.

## Verified correct on this angle

- The `HVR_REFERENCE` path the templates cite exists and resolves: `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md` read in full; the reference's own `hvr-rules.md:31-33` (rules "apply to all AI-generated documentation … spec folder docs") matches the templates' binding.
- No hard-blocker words (delve, leverage, seamless, robust, journey, etc.) appear in the scanned boilerplate regions of the seven templates; no em dash or semicolon in the headers of implementation-summary, acceptance-criteria, timeline, roadmap, decision-record or before-after beyond the two findings above.
- The templates' straight quotes and lack of curly quotes match the HVR quotation rule; `trigger_phrases` lists use four items where sampled (within the 2/4/5 preference).

## Open questions

1. Whether any machine consumes the HVR scoring against spec-kit templates or scaffolded docs (the `sk-create-with-human-voice` scoring-and-verification reference would say; not read within budget).
2. Full-line (non-header) scan of the remaining lines of each of the seven templates for further violations — the scan covered approximately the first 120 lines per template; the templates are longer than that.
3. Whether the em dash in `goal.md.tmpl:35` was introduced by the 010 remediation or predates it (no git history consulted, per mandate).
