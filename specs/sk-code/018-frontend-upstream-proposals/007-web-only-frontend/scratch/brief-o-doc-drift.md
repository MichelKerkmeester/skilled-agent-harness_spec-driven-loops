GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/sk-code/018-frontend-upstream-proposals/007-web-only-frontend

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.


PERSONA: You are @markdown, a LEAF documentation agent. Load `sk-doc` first and follow the mode it selects.
Edit only the files named below. Never dispatch another agent.
Never alter text, characters or tests to make a check pass. If a check flags a value you believe is legitimate, leave it and report it.
End with one status line: `STATUS=OK FILES=<n>` or `STATUS=FAIL ERROR=<reason>`.


ROLE: Fix the doc drift an alignment check found after the sk-code frontend surface went web-only.

ACTION (re-read each file before editing; each item is a small literal edit):
1. `README.md` lines ~831 and ~1576: in `(markup, CSS, accessibility, i18n, performance, native layout, and the five-pass Figma check)` drop `native layout, ` in both places.
2. Gold counts. Run `node .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` and read `total gold=<N>` and `hub=sk-code gold=<M>`.
   In `.skilled/skills/sk-doc/feature-catalog/feature-catalog.md` (~line 55), `.skilled/skills/sk-doc/feature-catalog/packet-authored-registry-routing/leaf-route-replay.md` (~line 24 and wherever it repeats)
   and `.skilled/skills/sk-doc/sk-create-skill/changelog/v1.10.1.0.md` (~line 24): set the gold row count to N, the quoted line to `hub=sk-code gold=<M> unscored=<M> surface slice not replayed`, and "sk-code's eight gold rows" to the word for M.
3. `.skilled/skills/sk-code/sk-code-frontend/SKILL.md` ~line 21: replace `This packet writes nothing. The paired workflow mode applies the guidance it loads.` with
   `This packet writes nothing. When the hub bundles it beside a workflow mode, that mode applies the guidance it loads. When no workflow mode scores, the hub routes this packet alone, and the acting agent applies the guidance and hands the author gates to `sk-code-quality` before it claims completion.`
   Also make line ~19 say the hub bundles it beside `sk-code-quality` or `sk-code-review`, or routes it alone when no workflow mode scores.
4. `.skilled/skills/sk-code/sk-code-frontend/README.md` ~lines 23 and 25: `Invoke with` says the hub bundles it beside a workflow mode, or routes it alone when no workflow mode scores; `Bundled with` adds `, or routed alone`.
5. `.skilled/skills/sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md` ~line 26 and `.skilled/skills/sk-code/feature-catalog/feature-catalog.md` ~line 37:
   replace `reached only when the hub bundles them alongside a workflow mode via `routerPolicy.outcomes.surfaceBundle`, workflow mode ordered first`
   (and its close variant in feature-catalog.md) with `reached only through the hub, which bundles them alongside a workflow mode via `routerPolicy.outcomes.surfaceBundle`, workflow mode ordered first, when a workflow mode scores, and routes a surface alone as the `single` outcome when none does`.
6. `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md`: line ~69 tieBreak becomes
   `["sk-code-quality", "sk-code-review", "sk-code-frontend", "sk-code-ci", "sk-code-skilled"]`, and line ~100 becomes
   `The surface packets `sk-code-frontend`, `sk-code-ci` and `sk-code-skilled` sort after every workflow mode, in that order.` (keep the next sentence). Leave the `bundleRules` example at ~line 123 alone.
7. Two-surface lists become three: `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` ~line 195
   `read-only evidence (`sk-code-ci`, `sk-code-skilled`)` -> `read-only evidence (`sk-code-ci`, `sk-code-frontend`, `sk-code-skilled`)`;
   `.skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md` ~line 75 `The surface packets `sk-code-skilled` and `sk-code-ci` are read-only evidence.` -> `The surface packets `sk-code-ci`, `sk-code-frontend` and `sk-code-skilled` are read-only evidence.`;
   `.skilled/skills/sk-code/sk-code-review/README.md` ~line 203 `The surface packets (`sk-code-skilled`, `sk-code-frontend`)` -> `The surface packets (`sk-code-ci`, `sk-code-frontend`, `sk-code-skilled`)`.
8. Spec-folder blockquotes. `sk-create-changelog` requires one when a release has spec folders; copy the form of `.skilled/skills/system-spec-kit/changelog/v2.12.31.0.md` line ~18 (blockquote, then a blank line and `&nbsp;` before `## What's New at a Glance`, matching where that file puts it). Add one to each:
   - `.skilled/skills/sk-code/changelog/v3.10.0.0.md`: `> Spec folders: `specs/sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode`, `006-open-items-and-alignment` and `007-web-only-frontend` (Level 2)`
   - `.skilled/skills/sk-code/sk-code-frontend/changelog/v1.0.0.0.md`: `> Spec folders: `specs/sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode` and `007-web-only-frontend` (Level 2)`
   - `.skilled/skills/sk-code/sk-code-frontend/changelog/v1.0.1.0.md`: `> Spec folders: `specs/sk-code/018-frontend-upstream-proposals/006-open-items-and-alignment` and `007-web-only-frontend` (Level 2)`
   - `.skilled/skills/mcp-tooling/mcp-figma/changelog/v1.2.0.0.md`: `> Spec folders: `specs/sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode`, `003-design-handoffs` and `004-playbook-scenarios` (Level 2)`
   - `.skilled/skills/sk-design/sk-design-fundamentals/changelog/v1.1.0.0.md`: `> Spec folders: `specs/sk-code/018-frontend-upstream-proposals/003-design-handoffs` and `004-playbook-scenarios` (Level 2)`
   - `.skilled/skills/sk-doc/sk-create-skill/changelog/v1.10.0.0.md`: `> Spec folder: `specs/sk-code/018-frontend-upstream-proposals/002-tooling-fixes` (Level 2)`
   - `.skilled/skills/sk-doc/sk-create-skill/changelog/v1.10.1.0.md`: `> Spec folders: `specs/sk-code/018-frontend-upstream-proposals/005-inferred-confirmations` and `006-open-items-and-alignment` (Level 2)`
   If a file already has a spec-folder blockquote, leave it.
9. `.skilled/skills/sk-code/sk-code-frontend/changelog/v1.0.1.0.md` ~line 33: the bullet claiming three aliases becomes
   `- **Routing adds two aliases.** `keyboard focus` joins `WEB_A11Y` and `figma frame` joins `FIGMA_TO_CODE`, in `ROUTER.md` and in the hub's mirrored vocabulary. The resource map is unchanged, and the playbook asserts the routes rather than changing them.`
   First confirm with `git show 1f9a9dea41~3:.skilled/skills/sk-code/sk-code-frontend/ROUTER.md | grep -c "figma frame check"` that `figma frame check` predates v1.0.1.0; if it prints 0, leave the bullet and report it.

ALLOWED WRITE PATHS: exactly the files named in items 1 to 9.

BANNED OPERATIONS: no `git`, no `rm`, no generator `--write`, no `compiled-route-sync.cjs`, no manifest refresh, no edit outside the allowed paths, no installs, no network. No text names a spec folder, phase, task or finding id, and none names Barter, except the changelog spec-folder blockquotes item 8 asks for. Never write an em dash.

VERIFY, paste each command with output and exit code:
- `rg -n "native layout" README.md` (expect no hit)
- `node .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs | tail -2`
- `rg -n "^> Spec" .skilled/skills/sk-code/changelog/v3.10.0.0.md .skilled/skills/sk-code/sk-code-frontend/changelog/*.md .skilled/skills/mcp-tooling/mcp-figma/changelog/v1.2.0.0.md .skilled/skills/sk-design/sk-design-fundamentals/changelog/v1.1.0.0.md .skilled/skills/sk-doc/sk-create-skill/changelog/v1.10.*.md`
- `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/SKILL.md`
