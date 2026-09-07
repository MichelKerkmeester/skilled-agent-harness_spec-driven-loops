# Iteration 003 — Placeholders that survive a scaffold

- Angle: `check-placeholders.sh`'s pattern block versus the bracketed tokens the templates actually ship (8 templates sampled per mandate), hand-read.
- Verdict: the checker detects exactly two shapes; the templates' dominant placeholder class is neither — it survives a scaffold untouched and invisible to the guard, while the one shape that IS detected (handover's `[YOUR_VALUE_HERE: ...]`) is destroyed by the scaffold's blanket substitution instead of being left for the author.
- Tool calls: 3 evidence reads + artifact writes.

## Findings (4: 2×P1, 2×P2)

### f-iter003-001 [P1] — the pattern block detects two shapes; the templates' left-to-fill tokens are everything else
- THE CLAIM (rule side): `runtime/cli/rules/check-placeholders.sh:65-84` — Pattern 1 is `\[YOUR_VALUE_HERE:` (`:71`) and Pattern 2 is `\[NEEDS[_ ]CLARIFICATION:` (`:82`), with backtick skips; `:11` describes the rule as "Detects unfilled spec-doc placeholders".
- WHAT THE TEMPLATES SHIP (visible body, all survive `finalize_scaffold_templates`, whose substitution list at `create.sh:639-648` covers only `[NAME]`, `[YOUR_VALUE_HERE: …]`, `[###-feature-name]`, `000-feature-name`, packet-pointer, the `system-spec-kit/templates/level-N` and `[YYYY-MM-DD]`/date/session/last_updated strings, and the piped Spec Folder/Level rows):
  - `templates/addons/acceptance-criteria.md.tmpl:44` `**Level:** [2/3/3+]`, `:45` `**Status:** [Draft/In Progress/Complete]`, `:58` the example row `Given [context], When [action], Then [observable outcome] | [command, file:line, or artifact that proves it] | Unmet`, `:83` `**Closeable:** [Yes/No]`.
  - `templates/addons/goal.md.tmpl:44` `**Objective:** [One sentence. What this packet is for. …]`, `:52` `[The decision, stated so a reader can tell whether work honors it]`.
  - `templates/core/implementation-summary.md.tmpl:101` `### [Feature Name]` (see f-iter003-003).
  - `templates/addons/decision-record.md.tmpl:37` `## ADR-001: [Decision Title]`, `:43` `| **Status** | [Proposed/Accepted/Deprecated/Superseded] |`, `:78` `[Chosen] | [Advantages] | [Disadvantages] | [X/10]`.
- CONSEQUENCE: a fresh scaffold passes "No unfilled placeholders found" while its acceptance table carries `Given [context]`, its objective line carries `[One sentence…]`, and its top heading carries `[Feature Name]` — the guard's stated purpose ("no unfilled placeholders") is defeated by the dominant token class of the very templates it exists to protect. Round two patched the *evidence-looking* tokens (clock times, ports) but never the *look* of the guard itself against the template corpus.
- SEVERITY: P1 (wrong/unused: a guard that reports clean on the template system's own fill-in tokens).
- RECOMMENDATION: fix — widen Pattern 1 to any `\[[A-Za-z][^\]*]*:[^]\]*\]`-style fill-in AND/OR make the scaffolder convert the known template token shapes (see the per-token substitution list below); the two should be pinned against each other by a test that renders every template at every level and asserts zero remaining un-replaced bracket shapes, with an explicit allowlist for checkbox `[x]`/`[ ]` and choice tokens like `[1/2/3/3+]`.

### f-iter003-002 [P1] — handover's `[YOUR_VALUE_HERE: …]` slots are overwritten with the feature description, so the one detected class becomes garbage content
- THE CLAIM (intent side): `[YOUR_VALUE_HERE: …]` is the canonical "author must fill this" shape, and the guard's pattern (`check-placeholders.sh:71`) is the backstop that catches any that stick.
- WHAT THE SCAFFOLDER DOES: `create.sh:646-647` — `s{\[YOUR_VALUE_HERE: [^\]]+\]}{$ENV{FEATURE_NAME}}g` replaces *every* such token with the feature description string. In `templates/addons/handover.md.tmpl` these are semantic slots in the visible body: `:42` `- **Handover Time:** [YOUR_VALUE_HERE: timestamp]` and `:62` `| [YOUR_VALUE_HERE: blocker_1] | [YOUR_VALUE_HERE: resolved/open] | [YOUR_VALUE_HERE: how it was handled] |`.
- CONSEQUENCE: a `--with-lazy-addons` scaffold writes `**Handover Time:** <feature description>` and three `<feature description>`s in every blocker row — the placeholder is not left for the author (intent) and not flagged (it no longer exists); it becomes silently wrong content. The one token class the guard does detect is exactly the class the scaffolder destroys before the guard can see it.
- SEVERITY: P1 (wrong: per-slot semantics destroyed by a blanket substitution; the guard's coverage is illusory for this document).
- RECOMMENDATION: fix — restrict the generic `[YOUR_VALUE_HERE: …]` → FEATURE_NAME substitution to documents whose slots genuinely describe the feature (spec/plan/tasks), and for handover.md either map each slot (name/session/date slots → real values, free-text slots → keep token) or delete the generic perl and let the guard catch what remains.

### f-iter003-003 [P2] — `[Feature Name]` is a distinct token shape the substitution list misses
- THE CLAIM (substitution side): the finalize list (`create.sh:639-648`) handles `[NAME]` and `[YOUR_VALUE_HERE: …]` but no other bare-name token.
- WHAT THE TEMPLATE DOES: `templates/core/implementation-summary.md.tmpl:101` heading `### [Feature Name]` — after scaffold the H2 remains `### [Feature Name]` (the `[NAME]` rule does not match, the pattern block does not match). Meanwhile `### [NAME]`-style renderings elsewhere get substituted.
- CONSEQUENCE: a scaffolded implementation-summary's primary heading is a literal bracketed token — one more shape outside both the substitution list and the detection patterns.
- SEVERITY: P2 (cosmetic-in-impact, same defect class as f-iter003-001).
- RECOMMENDATION: fix — add `[Feature Name]` to the perl list (or normalize the template to `[NAME]`); pinned by the rendered-template test in f-iter003-001.

### f-iter003-004 [P2] — `[template:level-N/doc.md]` provenance tokens survive into scaffolded frontmatter
- THE CLAIM (provenance side): the per-level-gated title variants (`templates/core/spec.md.tmpl:4-13`, `core/tasks.md.tmpl:4-13`, `core/implementation-summary.md.tmpl:4-13`) carry `[template:level-1/tasks.md]`-style annotations; `check-placeholders.sh:71` would not match them (`template:` is not `YOUR_VALUE_HERE:`), and the finalize substitutions target `system-spec-kit/templates/level-N` strings, not `template:level-N/…` (`create.sh:643-645`).
- WHAT THAT MEANS: the active gate's `title:` in a scaffolded file still reads e.g. `title: "Tasks: <feature> [template:level-1/tasks.md]"` — an internal-annotation token visible in frontmatter and invisible to every guard.
- SEVERITY: P2 (cosmetic — likely intentional provenance, but it is a third bracket shape neither substituted nor detected, and it leaks the level-gate internal naming into user-visible metadata).
- RECOMMENDATION: document — if intended as provenance, move it into the `SPECKIT_TEMPLATE_SOURCE` comment (where check-template-source already reads provenance) and drop it from the title; otherwise strip at finalize.

## Verified correct on this angle

- Checkbox tokens (`[x]`, `[ ]`) are legitimately not detected (`check-placeholders.sh:64-84`), and `check-files.sh:63-68` anchors implementation-detection to `^\s*[-*] \[[xX]\]` so the task-notation legend cannot masquerade as started work — the two stay consistent.
- Backtick-exclusions (`check-placeholders.sh:72-73,83-84`) correctly protect inline-code examples of the placeholder syntax; `check-placeholders.sh:45-47` correctly excludes scratch/memory/templates paths from the scan.
- The `[NAME]`/`[YYYY-MM-DD]`/`[###-feature-name]` substitutions (`create.sh:639-642`) work as designed for spec/plan/tasks; `[1/2/3/3+]` inside the piped Level row is substituted (`create.sh:641`), verified on spec.md.tmpl:77 and implementation-summary.md.tmpl:91.

## Open questions

1. Does `check-ac-coverage.sh`'s fixed `has_file_line` treat the scaffolded evidence cell `[command, file:line, or artifact that proves it]` as containing evidence (word "file" before a colon is not path-like per the round-two fix — expected no), and does `AC_CLOSURE` count the example AC-001 row as an unmet criterion on a packet that claims completion? Not read within budget — iteration 5's template surface and the round-two fixes suggest the former is correct, but unverified.
2. Whether the example AC-001 row (`acceptance-criteria.md.tmpl:58`) is meant to be deleted by the author or replaced in place — if the former, the template should mark it as deletable example.
3. Exact bracket inventory for `plan.md.tmpl` beyond the sampled tokens (sampled at head, not exhaustively re-derived) — the token list was captured but not line-vs-comment classified for plan.md.
