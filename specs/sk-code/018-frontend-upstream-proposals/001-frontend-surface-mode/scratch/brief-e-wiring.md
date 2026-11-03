GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

PERSONA: You are @code, a LEAF implementation agent. Load `sk-code` first and follow the surface it
selects (SKILLED). Edit only the files named below. Never dispatch another agent or another codex.
Never alter text, characters or tests to make a check pass. If a check flags a value you believe is legitimate, leave it and report it.
End with one status line: `STATUS=OK FILES=<n>` or `STATUS=FAIL ERROR=<reason>`.

ROLE: Wire a new read-only surface packet, `sk-code-frontend`, into the sk-code parent hub, the same
way `sk-code-ci` is wired. `sk-code-frontend` already exists at `.skilled/skills/sk-code/sk-code-frontend/`
with SKILL.md, README.md, ROUTER.md and references/. Read its ROUTER.md for its three intents.

ACTION: In `.skilled/skills/sk-code/`:
1. `mode-registry.json`: add a `modes[]` entry for `sk-code-frontend` copied from the `sk-code-ci` entry
   (surface, evidence-base, read-only toolSurface, routingClass metadata, no surfaceDetection block, no
   quality block). Its `aliases` are the union of the three intents' keywords in
   `sk-code-frontend/ROUTER.md`. Add `"sk-code-frontend"` to the `surface-axis.surfaces` array, before
   `"sk-code-skilled"`. Update the top `description` text that names the surfaces.
2. `hub-router.json`: add mode `sk-code-frontend` (weight 4, classes `code-frontend-aliases`, resources
   `["sk-code-frontend/SKILL.md"]`), a `code-frontend-aliases` vocabulary class holding the same aliases,
   and put `"sk-code-frontend"` in `routerPolicy.tieBreak` right before `"sk-code-skilled"`.
3. `ROUTER.md` (hub root):
   - In `INTENT_SIGNALS`, add `FRONTEND_WEB`, `FRONTEND_NATIVE` and `FIGMA_TO_CODE` with exactly the
     packet ROUTER's weights and keywords.
   - In `RESOURCE_MAP`, add the same three keys with the packet's paths re-prefixed `sk-code-frontend/`.
   - Add a "### Frontend Map" subsection after the "### CI Workflow Map" subsection, in the same style.
   - Replace the sentence that begins "Do not load Go/NextJS/React Native resources from canonical sk-code"
     with: "Canonical sk-code owns the SKILLED surface, the `sk-code-ci` GitHub Actions surface and the
     stack-agnostic `sk-code-frontend` surface for web and React Native practice. Project-specific Go,
     Next.js or React Native surfaces live in a project fork."
   - Wherever the file lists the surfaces (`sk-code-ci`, `sk-code-skilled`), add `sk-code-frontend`, and say
     it is, like `sk-code-ci`, bundled from request vocabulary alone.
4. `SKILL.md` and `README.md`: add `sk-code-frontend` wherever the surfaces are listed (mode table,
   folder tree, "two surfaces" counts become three, related-packet tables).
5. `description.json`: add `"sk-code-frontend"` next to `"sk-code-ci"`.
6. `sk-code-skilled/assets/scripts/verify-router-sync.cjs`: add `'sk-code-frontend'` to the `SURFACES` list.
7. Regenerate, do not hand-edit: run
   `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --help` to learn its
   flags, then regenerate `leaf-manifest.json` for sk-code; then run
   `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --write` so
   `graph-metadata.json` gains the new phrases.
8. `.skilled/skills/mcp-tooling/mcp-figma/SKILL.md`: add one sentence where it lists related skills:
   a Figma read that feeds code ends at the five-pass check in
   `sk-code/sk-code-frontend/references/figma-to-code.md`. Change nothing else there.

No code comment may name a spec folder, phase, task or ADR id.

VERIFY before the status line, and paste each command with its output and exit code:
- `jq . .skilled/skills/sk-code/mode-registry.json .skilled/skills/sk-code/hub-router.json .skilled/skills/sk-code/leaf-manifest.json .skilled/skills/sk-code/graph-metadata.json > /dev/null`
- `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs`
- `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check`
- `node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests/` (record failures; do not edit tests to pass)
Leave router reach to the parent session: do not run `ci-router-vocabulary-reach.cjs`.
