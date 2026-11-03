# Decision-record capture: analysis and design

Paths are relative to the Skilled root. SSK = `.skilled/skills/system-spec-kit`. [C] = confirmed by reading, [I] = inferred.

## 1. Current logic map

**Decision-record shape**
- `SSK/templates/addons/decision-record.md.tmpl:34-120` is ADR-only: Metadata, Context, Decision, Alternatives, Consequences, Five Checks. It has no Q&A section, so both live tables were invented by hand. [C]
- The same template's frontmatter (`:24-25`) carries `open_questions: []` and `answered_questions: []`. [C]
- A phase parent may now carry an optional `decision-record.md` (`SSK/references/structure/phase-definitions.md:142`, `SSK/references/validation/validation-rules.md:208`). [C]
- Level detection side effect: `SSK/runtime/lib/validation/orchestrator.ts:203` returns Level 3 when `decision-record.md` exists and `spec.md` has no level marker. Lines 196-201 check the marker first. [C] Creating the file automatically could therefore change a packet's validated level. [I]
- The only check on content is `SPECDOC_SUFFICIENCY_003`, which flags thin `adr-*-decision|alternatives|consequences` anchors (`SSK/runtime/lib/validation/spec-doc-structure.ts:1243-1252`). [C]

**The question fields**
- `answered_questions` and `open_questions` hold question ids only. Each entry must match `QNNN`, there can be at most 12, and the two sets must be disjoint (`SSK/runtime/lib/continuity/thin-continuity-record.ts:884-931`). [C] 44 questions cannot fit, and no field holds a question's text or answer. [C]
- Only a `--full-auto` save writes them, and only into the leaf's `implementation-summary.md`, never into `decision-record.md` (`SSK/runtime/cli/continuity/generate-context.ts:162-177`, `SSK/runtime/cli/core/workflow.ts:384-392,494,599`, `SSK/references/memory/save-workflow.md:236-248`). [C]
- Readers: the resume snapshot (`SSK/runtime/lib/continuity/authored-continuity-snapshot.ts:146-147`) and the rule that blocks 100% completion while questions are open (`thin-continuity-record.ts:877`). [C]

**The save path**
- `/speckit:save` lists `decision_log` as a route category (`.skilled/commands/speckit/save.md:52`, aliases at `spec-doc-structure.ts:178-179`, lexical `inferCategory` at `:1277`). [C] It only classifies; no writer emits decision-record content. [I, based on `workflow.ts` writing only `summaryPath`. A grep found no other `decision-record.md` write.]
- `keyDecisions` feeds `extractDecisions()` (`SSK/runtime/cli/extractors/decision-extractor.ts:227`), which is exported through `extractors/index.ts:12`. [C] No non-test caller writes its `DECISIONS` to a spec doc. [I]
- Precedent for an append-only packet log under a lock: `goal.cjs log` and `packet-log` (`.skilled/hooks/goal/bin/goal.cjs:196-235`), already called from save step 6 (`save.md:66-70`). [C]

**Capture surfaces**
- Claude registers a PostToolUse hook with matcher `""` (session-relaunch), so PostToolUse fires for every tool (`.claude/settings.json`, generated from `SSK/runtime/cli/runtime-mirrors/hook-registry.json`). [C] Existing hooks read `tool_name`, `tool_input` and `tool_response` (`.skilled/hooks/dispatch/claude/dispatch-audit-posttooluse.mjs:50-60`). [C]
- **The Claude transcript holds the answers.** In a real transcript (`~/.claude/projects/-Users-michelkerkmeester-MEGA-Admin-Purchases/29b8ff7e-….jsonl`), each AskUserQuestion result line carries `toolUseResult` with keys `questions`, `answers` (question text mapped to the chosen label or typed text) and `annotations`. [C]
- **Whether PostToolUse `tool_response` holds that same object for AskUserQuestion is UNKNOWN.** A probe would settle it: a temporary PostToolUse hook with matcher `AskUserQuestion` that dumps its stdin to `.skilled/skills/.state/`, then one question.
- The transcript fallback is real: `SSK/runtime/hooks/claude/claude-transcript.ts` already parses transcript JSONL for the Stop hook `session-stop.js`. [C]
- Other runtimes (question tools from `.skilled/repo-rules/communication-handoff.md:150-156`):

| Runtime | Question tool | Post-tool surface | Sees the answer? |
|---|---|---|---|
| Codex | `request_user_input`, Plan mode only | `.codex/hooks.json` has PostToolUse [C] | UNKNOWN |
| OpenCode | Built-in, name not recorded | `tool.execute.after` (`.opencode/plugins/classifier-injection-screen.js:58`) [C] | UNKNOWN |
| Pi | `rpiv-ask-user-question` extension (`.pi/PLUGINS.md:16`) | `pi.on('tool_result')` (`.pi/extensions/dispatch-audit.ts:25`) [C] | UNKNOWN |
| Devin | `ask_user_question` (`cli-devin/references/devin-tools.md:212`) | Devin PostToolUse bindings exist in the registry [C] | UNKNOWN |
| Cursor | None recorded | `postToolUse` [C] | n/a |

- **Plain chat questions** (Q40-Q44) pass through no tool, so no tool hook sees them. [C, they were chat messages per the Barter record.]

**State area**
- `.skilled/skills/.state/*/*` is gitignored (`.gitignore:132`, confirmed with `git check-ignore`). [C]
- The spec gate keeps per-session JSON there, including `boundSpecFolder` and `validatedResolvedPath` once Gate 3 is answered (`SSK/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:71-72,509-513`). [C] That is the natural default for the target folder.

## 2. Gaps against the goal

1. Nothing captures a question and its answer. Every row is hand-transcribed.
2. Nothing rewrites one. The live tables keep long question text and verbatim answers. Superseding is free text ("R2, superseded by R7").
3. The question frontmatter can neither hold the content nor scale past 12, and it lands in `implementation-summary.md`, not the decision record.
4. The template has no anchored, machine-owned operator-decisions section, so a writer would have to edit hand-authored ADR prose.
5. No routing rule says whether a decision belongs to the packet, the phase parent or a phase child.
6. Chat questions and non-Claude runtimes have no capture path.
7. Creating the file automatically can silently change the detected level.

## 3. Design options

### Option A: capture to a queue, rewrite at save (hook + save step)
- **Capture.** A new runtime-neutral core, `.skilled/hooks/decision-capture/lib/capture-core.mjs`, normalizes each runtime's payload to `{runtime, session_id, tool_use_id, ts, questions[], answers{}, annotations, bound_folder}`. It appends under a lock to `.skilled/skills/.state/decision-capture/<session-hash>.jsonl`. Thin adapters (Claude PostToolUse matcher `AskUserQuestion`, OpenCode plugin, Pi extension, Devin and Codex bindings) register through `hook-registry.json`, and `sync-hook-registrations.cjs` (named in the registry's `_note`) regenerates them.
- **Claude backfill.** A transcript sweep reusing `claude-transcript.ts` fills in missed entries.
- **Rewrite.** Runs inside `/speckit:save`, done by the session model, which still holds the reasoning. It reads the queue and drafts one entry per decision: decision, why, supersedes, carried by, verbatim ref. It passes them as `operatorDecisions[]` in the save payload. A deterministic writer upserts them into an anchored section.
- **Target.** Default to the spec gate's `boundSpecFolder`. On a phase parent, the model tags each entry as spanning phases (goes to the parent) or phase-local (goes to the child chosen by the existing rule in `generate-context.ts:173-177`).
- **Dedupe.** Capture is keyed on `session_id + tool_use_id`. The writer upserts on a stable `Q` id and records consumed keys in a cursor file, so a re-save changes nothing.
- **Audit.** Verbatim Q/A go to a second anchor, `operator-answers-verbatim`, in a collapsed appendix, linked by Q id.
- **Failure modes.** No save means no record (mitigation: a Stop-hook "N uncaptured decisions" nudge), an unconfirmed payload shape (probe plus transcript fallback), UNKNOWN runtimes, and the level flip.

### Option B: rewrite at capture time
- The hook calls a model (for example the hosted `cli-classifier` transport) and writes the polished row at once.
- Pros: the record is always current, with no save dependency.
- Cons:
  - Hooks are synchronous and short-timeout (registry bindings use about 5 s).
  - The hook model lacks the session's reasoning, so "why" and "supersedes" come out weak.
  - It needs credentials inside every hook.
  - It writes tracked files mid-turn, against the spec gate.
- Failure modes: timeouts drop answers, rows end up half-written, and costs land on every question.

### Option C: fold it into the continuity writer only, with no hook
- The save payload gains `operatorDecisions[]`, which the model writes from its own memory of the session.
- Pros: one change surface, identical on every runtime.
- Cons: the model's memory is the only source; after compaction or a relaunch answers are lost or paraphrased. That is today's failure minus the typing.

## 4. Recommendation

**Option A.** Option C's writer is its back half; the transcript sweep is the guaranteed Claude source until the probe lands. Rewriting at save means one model call with full context, and tracked writes stay inside the gated save.

**File-by-file change list**
1. `.skilled/hooks/decision-capture/lib/capture-core.mjs` (new): normalize, then a locked append. Plus a tracked `.skilled/skills/.state/decision-capture/README.md`, following the `.state/spec-gate/README.md` pattern.
2. Adapters (new):
   - `.skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs`
   - `.opencode/plugins/decision-capture.js`
   - `.pi/extensions/decision-capture.ts`
   - Devin and Codex bindings, each enabled only after its probe confirms.
3. `SSK/runtime/cli/runtime-mirrors/hook-registry.json`: add a `decision-capture` hook id, then regenerate `.claude/settings.json`, `.codex/hooks.json` and `.devin/hooks.v1.json`.
4. `.skilled/hooks/decision-capture/bin/sweep-transcript.mjs` (new): a Claude transcript backfill, reusing `SSK/runtime/hooks/claude/claude-transcript.ts`. It also lists candidate chat questions for the model to confirm.
5. `SSK/runtime/lib/continuity/decision-record-writer.ts` (new): upserts the `operator-decisions` and `operator-answers-verbatim` anchors by Q id. It refuses to create the file in a non-phase-parent packet whose `spec.md` has no level marker.
6. Payload and writer wiring:
   - `SSK/runtime/cli/utils/input-normalizer.ts`: accept `operatorDecisions` / `operator_decisions`.
   - `SSK/runtime/cli/core/workflow.ts`: call the writer in `--full-auto` and route each entry to parent or child.
   - `SSK/runtime/cli/continuity/generate-context.ts` `HELP_TEXT`: document the field.
7. `SSK/templates/addons/decision-record.md.tmpl`: add the two optional anchors. `SSK/runtime/lib/validation/spec-doc-structure.ts`: exempt them from ADR sufficiency.
8. Docs:
   - `.skilled/commands/speckit/save.md` step 3: read the queue, rewrite, include the entries, mark them consumed.
   - `SSK/references/memory/save-workflow.md`: the field table.
   - `SSK/references/structure/phase-definitions.md:142`: name the auto-maintained log.
9. Stop-hook nudge in `SSK/runtime/hooks/claude/session-stop.ts`, which reports unconsumed queue entries.

**Tests that would prove it**
- **Live probe:** a recorded PostToolUse stdin for AskUserQuestion becomes the fixture. That turns the UNKNOWN into a confirmation or a refutation.
- **`capture-core` unit tests:**
  - the Claude fixture normalizes correctly;
  - a duplicate `tool_use_id` is appended once;
  - a malformed payload exits 0 without writing;
  - concurrent appends do not interleave.
- **`decision-record-writer.vitest.ts`:**
  - an idempotent re-save gives a byte-identical file;
  - a supersedes link renders;
  - verbatim text is preserved exactly;
  - phase-parent versus child routing works;
  - the no-level-marker guard refuses;
  - hand-written ADR prose stays untouched.
- **`SSK/runtime/cli/tests/save-continuity-write.vitest.ts`:** extended for a full-auto save that carries `operatorDecisions`.
- **Transcript sweep:** run against a fixture transcript containing two AskUserQuestion rounds.
- **Mirror and validation checks:** `/doctor:runtime-mirrors` passes after regeneration, and `validate.sh --strict` passes on a packet with the new anchors.

## 5. Open questions for the operator

1. Verbatim answers: tracked appendix, or gitignored queue only (which loses audit on other machines)?
2. Should process questions (Gate 3, worktree choice, commit or push permission, like Q36-Q39, Q43 and Q44) be recorded, filtered out, or kept as a one-line class?
3. Should plain chat questions be captured, with model confirmation at save?
4. Should the rewrite run only on `/speckit:save`, or also automatically at `/speckit:handoff` or Stop?
5. On a phase parent, should the model's parent-or-child routing be final, or shown as a plan first, like save's default plan-only mode?
6. Should `answered_questions` keep its 12-id cap and its implementation-summary home, or start mirroring the record's Q ids?
7. Should Barter's vendored `coder/` copy get the hook too, given its records live in a separate repo?
