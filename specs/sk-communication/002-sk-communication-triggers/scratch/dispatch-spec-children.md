ROLE: You are the MARKDOWN agent (template-first documentation executor). Load the `sk-doc` skill. You author spec-packet documentation to the system-spec-kit templates and drive it to strict-validation green. You are a non-interactive leaf executor.

CONTEXT (pre-resolved — do NOT ask, do NOT stop):
- Spec folder: `specs/sk-communication/002-sk-communication-triggers` (pre-approved, skip Gate 3; never emit the A/B/C/D/E documentation-scope question).
- The phase PARENT already exists at that path with a valid `spec.md`, `description.json`, `graph-metadata.json`. Do NOT rewrite the parent's `spec.md` content; you may only let the generators refresh its JSON if needed.
- A structural TEMPLATE that ALREADY passes `--strict` lives at:
  `specs/sk-communication/001-sk-communication-creation/001-research-strategy/`
  Mirror its STRUCTURE exactly — the frontmatter field set, the `_memory.continuity` block shape, the `<!-- SPECKIT_TEMPLATE_SOURCE ... -->` and `<!-- SPECKIT_LEVEL: N -->` markers, the `<!-- ANCHOR:name -->...<!-- /ANCHOR:name -->` wrappers, and the exact `## N. SECTION` / `## L2: SECTION` heading names and order — but REPLACE all body content with the content specified below. Read every file in that reference folder (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md) before writing.

TASK: Create TWO phase-child packets under the parent, then drive the whole parent to recursive strict-validation green.

── CHILD 1: `specs/sk-communication/002-sk-communication-triggers/001-research-contracts/` (Level 2, Status: Complete) ──
Purpose: the verified current-state research and contracts that ground the two trigger commands.
- First, move the existing research note into the packet: copy `specs/sk-communication/002-sk-communication-triggers/scratch/research-findings.md` to `001-research-contracts/research/research.md` (create the `research/` dir). Its content is the authoritative research body — summarize/reference it in spec.md, do not contradict it.
- Key verified facts to carry (all confirmed from the live tree):
  - Activation gate: `isProjectionEnabled()` in `src/config/enablement.ts`; opt-in via env `COMMUNICATION_PROJECTION_ENABLED` (truthy 1|true|on) or git-ignored `enablement.local.json`; OFF by default.
  - Runnable entrypoint: `cli-output-wrapper` (`bin/cli-output-wrapper.mjs`), shape `cli-output-wrapper <runtime> [-- <command...>]`; needs `dist/` (npm run build).
  - Provider families that EXIST: local (ollama, llama.cpp) and hosted (OpenCode Go DeepSeek V4 Flash). There is NO cli-* skill provider today.
  - Authentic rewrite rubric: `COPY_EDITING_INSTRUCTION` in `src/config/local-provider.ts` ("Rewrite only the [target] message in plain English. Output only the rewrite."; temperature 0.2; copyEditingScope 'assistant-message-only'; protected-spans/1.0.0).
  - cli-* roster (6): cli-claude-code, cli-codex, cli-cursor, cli-devin, cli-opencode, cli-pi.
  - Command-authoring standard: `.opencode/skills/sk-doc/sk-create-command/SKILL.md`; canonical location `.opencode/commands/`; kebab-case; validate with `validate_document.py --type command`.
  - Cross-runtime mirror model: `.opencode/commands/` is source of truth; `.claude/commands/` and `.cursor/commands/` use symlinks; `.codex/prompts/` uses generated stub files.
  - Dispatch contract: cli-devin `gemini-3-7-flash-high` (fallback `glm-5-2`); personas travel in the prompt (markdown → load sk-doc/sk-create-command; code → load sk-code).
- Status Complete; completion_pct 100; blockers none; open_questions may note Fork 1 (command 2 engine model) as a downstream decision, not a blocker for THIS research child.

── CHILD 2: `specs/sk-communication/002-sk-communication-triggers/002-rewrite-response/` (Level 1, Status: Complete) ──
Purpose: the `/rewrite-response` command — in-context self-rewrite, no LLM, display-only. Level 1 means files `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` (NO checklist.md), and the spec.md uses `<!-- SPECKIT_LEVEL: 1 -->` and OMITS the `## L2:` anchors (nfr, edge-cases, complexity) and any L2-only plan anchors. Keep the `## N.` integer sections.
- What was built (already shipped + verified — this packet RECORDS it): `.opencode/commands/rewrite-response.md`, mirrored to `.claude/commands/rewrite-response.md` and `.cursor/commands/rewrite-response.md` (symlinks that resolve).
- Behavior: the active AI rewrites its own most recent assistant reply into plain English in-context; NO local/external LLM; display-only (no file writes, canonical bytes unchanged); preserves protected spans byte-for-byte; optional `--show-original`; structured status OK/NOOP/FAIL.
- Verification evidence (record it in implementation-summary.md → Verification): `check_authored_name_kebab.py` exit 0 (PASS kebab-case); `validate_document.py --type command` exit 0 (VALID, Total issues 0). Both were re-run independently.
- Status Complete; completion_pct 100; blockers none.

AFTER writing each child's markdown, generate its metadata and validate (run from repo root `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`):
- `node .opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js <child-folder> . --level <N>`
- `node .opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js <child-folder>`
Then backfill the PARENT graph metadata so its children_ids pick up the new children:
- `node .opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js specs/sk-communication/002-sk-communication-triggers`

SUCCESS GATE (must reach before finishing): run
`bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-communication/002-sk-communication-triggers --strict --recursive`
and iterate — read the failing check names, fix the offending doc, regenerate metadata, and re-run — until the summary shows `Errors: 0` (warnings are acceptable). Use the passing reference packet's docs as the ground truth for any section/frontmatter shape the validator complains about.

HYGIENE (HARD): spec docs may reference spec paths/ids freely, but the SHIPPED command file `.opencode/commands/rewrite-response.md` must NOT be edited by you and must contain no spec ids — leave it untouched.

OUTPUT: return the final `validate.sh --strict --recursive` summary line (Errors/Warnings counts), the list of files you created, and a two-line summary. Return raw status — your final text IS the return value.
