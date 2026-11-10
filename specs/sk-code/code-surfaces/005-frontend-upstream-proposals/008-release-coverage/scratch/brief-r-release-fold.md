GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/sk-code/018-frontend-upstream-proposals/008-release-coverage

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.


PERSONA: You are @markdown, a LEAF documentation agent. Load `sk-doc` first and follow the mode it selects (the changelog and README modes).
Edit only the files named below. Never dispatch another agent.
Never alter text, characters or tests to make a check pass. If a check flags a value you believe is legitimate, leave it and report it.
End with one status line: `STATUS=OK FILES=<n>` or `STATUS=FAIL ERROR=<reason>`.


ROLE: Fold this branch's frontend work into the open root release notes and the root README, the way the decision-capture series was folded in commit `2bd7158b9c` (read `git show 2bd7158b9c -- .skilled/changelog/skilled/v4.0.1.0.md README.md` first for the shape and voice).

Read these per-skill entries for the facts, and state nothing they do not support:
`.skilled/skills/sk-code/changelog/v3.10.0.0.md`, `.skilled/skills/sk-code/sk-code-frontend/changelog/v1.0.0.0.md` and `v1.0.1.0.md`,
`.skilled/skills/mcp-tooling/mcp-figma/changelog/v1.2.0.0.md`, `.skilled/skills/sk-design/sk-design-fundamentals/changelog/v1.1.0.0.md`,
`.skilled/skills/sk-doc/sk-create-skill/changelog/v1.10.0.0.md` and `v1.10.1.0.md`, `.skilled/skills/system-spec-kit/changelog/v2.12.31.0.md`.

The work: a web-only `sk-code-frontend` surface (core page, web layer, six web topic files, the five-pass Figma-to-code check where any skipped pass makes the verdict INCOMPLETE, per-mode Frontend overrides contract), bundled by sk-code from request vocabulary and ranked ahead of `sk-code-ci` in the tie-break; React Native stays out of canonical sk-code and lives in a project fork. mcp-figma points at the five-pass check. sk-code and mcp-figma hand open design values to `sk-design-fundamentals`, which gains a reduced-motion section and an optional project-profile slot with a four-step precedence. The intent-signal generator reports and prunes orphaned phrases (keep list `intent_signals_keep`, provenance seeded on a hub's first `--write`); router reach defaults to concurrency 2; the leaf replay reads `INTENT_MODEL` routers and tuple weights; every hub matcher treats a hyphen and a space alike and counts a folded keyword once; sk-design's router no longer throws on a same-mode intent tie. Spec Kit: the trigger-index generator warns when it would index another checkout than the caller's, and a save that is not full-auto says it left the continuity fields unwritten.

ACTION:
1. `.skilled/changelog/skilled/v4.0.1.0.md`:
   - Add one `What's New at a Glance` bullet for the frontend surface and one for the design hand-offs, in the file's bullet voice.
   - Add a `## Frontend Surface` section (after `## Skill Routing`, before `## Doctor Commands`) with `####` subsections for the surface and the Figma check, and the design hand-offs.
   - Add the router-tooling items to `## Skill Routing` as a `####` subsection, and the two Spec Kit items to `## Spec Kit` as a `####` subsection.
   - Append `specs/sk-code/018-frontend-upstream-proposals` (phases 001 to 008, Level 2) to the spec-folder blockquote.
   - Add an Upgrade Notes bullet: projects that want React Native guidance keep it in their own fork.
   - Update the frontmatter `description` and add three or four `trigger_phrases` only if the existing ones do not cover the frontend surface.
2. `README.md` (repo root): add one bullet each where the README already describes the skill, matching neighbouring bullets:
   - the `mcp-figma` transport bullet (~line 900): it points at the five-pass check in `sk-code-frontend/references/figma-to-code.md`;
   - the `sk-design-fundamentals` entry (~line 909) or the sk-design hub section (~line 1531): open values arrive from sk-code and mcp-figma, reduced-motion guidance, the optional `references/<project>-profile.md` slot;
   - the Spec Kit section (~line 571 or ~1656): the trigger-index root warning and the plan-only save line;
   - wherever the README describes router tooling or reach (search `reach`, `intent_signals`, `vocabulary`): orphan pruning with the keep list and the concurrency 2 default. If no such place exists, skip this item and say so.
   Leave lines 830, 831, 1518 and 1576 as they are.

ALLOWED WRITE PATHS: `.skilled/changelog/skilled/v4.0.1.0.md`, `README.md`.
BANNED OPERATIONS: no `git` write command (read-only `git show`/`git log` is allowed), no `rm`, no edit outside the allowed paths, no installs, no network. No text names Barter, a phase number other than in the spec-folder blockquote, a task or a finding id. Never write an em dash.

VERIFY, paste each command with output and exit code:
- `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/changelog/skilled/v4.0.1.0.md`
- `python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py README.md; python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py README.md`
- `rg -n "sk-code-frontend|sk-design-fundamentals|five-pass" .skilled/changelog/skilled/v4.0.1.0.md | head`
