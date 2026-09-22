



Recon complete. The commit touched 41 files; the worktree also has uncommitted 049-packet state (excluded from findings). Now dispatching the four read-only sweep subagents in parallel.

While the sweep agents run, I'll do my own repo-wide term sweep and start the sk-code-opencode alignment check.

Grep timed out on the full root (node_modules). Scoping to relevant trees.









The 049 packet's own scope list (excluded from findings, usable as cross-check) names several known-stale surfaces. Verifying each independently:

Now the sk-code-opencode alignment check. Reading the exact header contracts and the touched files' headers:

















































All four sweeps are in. Before consolidating, I must re-verify every new STALE quote myself (the persona requires the cited line be re-read). Two subagent rows already look suspect — `.hermes/SYNC.md:79` contradicts my own earlier read. Verifying:













All verifications complete. Producing the consolidated report.

## Coverage

**Search terms (case-insensitive):** `SPEC FOLDER QUESTION`, `GATE_3_QUESTION`, `Gate-3 question`, `gate question`, `spec-gate`, `spec folder question`, `SYSTEM_SPEC_GATE_3_DELIVERY_SUPPRESSION`, `lifecycleEpoch`, `observed receipt`, `shadow`, `additionalContext`, `agent_message`, `appends/injects the question`, `question only`, `classify (advisory)`, plus widened vocabulary: `opt-in`, `default-off`, `per-turn`, `every write-intent turn`, `menu`, `deferral`, `hasUI`, `emit`, `suppress`, `receipt`, `epoch`, `system.transform`.

**Swept (me + 4 read-only subagents, disjoint areas):** `**/feature-catalog/**` and `**/manual-testing-playbook/**` across all skills; `**/SKILL.md`, `**/README.md`, `**/references/**` under `.skilled/skills/**` (+ `.claude/skills` = whole-dir symlink to `.skilled/skills`); runtime trees `.skilled/hooks/**`, `.skilled/skills/system-spec-kit/runtime/**`, `.skilled/plugins/**`, `.opencode/plugins/**`, `.pi/extensions/**`, `.claude/**`, `.codex/**`, `.cursor/**`, `.devin/**`, `.hermes/**`; registries/descriptors (`hook-registry.json`, `doctor-runtime-mirrors.yaml`, `**/graph-metadata.json`, `description.json`, `**/*.env.example`, `ENV-REFERENCE.md`, `environment-variables.md`, changelogs); root docs (`README.md`, `CONTRIBUTING.md`, `repo-rules/**`, `.skilled/repo-rules/**`).

**Excluded:** `node_modules/`, `dist/`, `.worktrees/`, `specs/**` archives (all `specs/` hits traced were archives; the trigger-index phrase "delivery receipt hashes injection bloat" resolves to `specs/hooks/002-…/spec.md`, an archive), root `AGENTS.md` Gate-3 prose (root `CLAUDE.md` is a symlink to it — same file), `dispatch-preflight-lint.ts` + test, `.hermes/plugins/repo-guards/**`, the 049 packet.

**Verification discipline:** every STALE row's cited line was re-read from the file before inclusion. One subagent-proposed STALE row (`.hermes/SYNC.md:79`) was **rebutted on re-read** — that line already says "The question itself never rides this channel: it reaches the model once, at the first mutation" — and is listed as current below. `git status` confirms this dispatch wrote nothing (the modified `033/spec.md` and untracked 049 folder pre-existed).

## Findings

| path:line | current claim (quoted) | verdict | correct text should say | conf |
|---|---|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:205` | "flag (opt-in) \| **Default OFF (shadow).** Opt-in suppression of a repeated Gate-3 question once its prior delivery is confirmed. Confirmable only by an observed receipt whose `lifecycleEpoch >= 1` matches the question hash — epoch 0 never confirms; unknown or unobserved state always emits (fail-open)." | STALE | Suppression is **default-ON** once the persisted per-session marker (`questionDeliveredAtMs`/`questionDeliveredChannel`/`questionDeliveredCount`) exists; `0`/`false`/`no`/`off` forces every in-gate mutation to carry the notice. The epoch/receipt path is telemetry only (`spec-gate-core.mjs:327-348`), not the suppression gate. | H |
| `.skilled/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md:55` | "on emission it records post-emission Gate-3 question delivery (observed receipt, `lifecycleEpoch >= 1`) feeding the default-off `SYSTEM_SPEC_GATE_3_DELIVERY_SUPPRESSION` shadow." | STALE | Cursor classify emits nothing; it silently opens/updates gate state. The once-per-session notice is delivered by `spec-gate-enforce.mjs` on `preToolUse`; suppression is default-ON via the persisted marker (`0`/`false`/`no`/`off` re-arms emission). | H |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/spec-mutation-gate-enforce.md:91` | "Expected: exit 0, one JSON object with `additionalContext` containing `SPEC FOLDER QUESTION`." (step 4, the classify call) | STALE | Step 4 expects exit 0 with **empty stdout** while gate state opens; the notice appears in step 5 (first enforce). The same file's line 41 already says "the Claude classify hook writes nothing for the turn" — step 4 contradicts it and will always FAIL as written. | H |
| `.skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md:111` | "Step 2: prints `{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"SPEC FOLDER QUESTION: …"}}`, `exit=0`." | STALE | Step 2 expects exit 0 with no emitted envelope; the gate-state file is still written. | H |
| `codex-hook-parity.md:49` | "`spec-gate-classify` emits the Gate-3 `additionalContext`" (+ "the model's first response acts on the injected A–E Gate-3 menu") | STALE | Codex classify emits nothing; the question reaches the model once at the first in-gate `apply_patch`/`edit` (advise notice or deny reason). | H |
| `codex-hook-parity.md:74` | "2. `spec-gate-classify` advisory on a mutation-intent prompt (fresh session dir → opens the gate, emits the Gate-3 menu)" | STALE | Drop "emits the Gate-3 menu"; classify only opens the gate. | H |
| `.pi/extensions/README.md:39` | "+-- spec-gate-classify.ts       # Appends the spec-folder gate question to a user turn" | STALE | "Opens the gate silently; appends only the one-shot deferral instruction when `ctx.hasUI` is false. The question is delivered at the first mutation (interactive dialog or enforce notice)." | H |
| `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:201-202` | "Distinct from spec-gate-classify.ts, which only appends the Gate-3 documentation question." | STALE | "…which opens the gate silently; it appends only the one-shot deferral instruction when the session has no UI." | H |
| `.skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/goal-hook/goal-hook.md:15` | "Three `UserPromptSubmit` hooks … write `hookSpecificOutput.additionalContext` (the spec-kit prompt adapter, the spec-gate classifier and this adapter). … reported both the advisor line … and the classifier's own sentence in the same turn." | STALE | Two `UserPromptSubmit` hooks write `additionalContext` now (spec-kit prompt adapter, this goal adapter); the spec-gate classifier writes nothing. Devin's Gate-3 question arrives on the first in-gate enforce. | H |
| `.skilled/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook/goal-hook/prompt-time-advisor-brief-and-gate-question.md:3` (also 15, 21, 27-31, 61) | "Confirm the skill-advisor brief and the spec-folder gate question reach a Hermes session's user message on a write-intent first turn" — expected `ADVISOR` then `GATE` for "an appended spec-folder question listing options A) to E)" | STALE | Prompt-time question appending is the retired design; Hermes delivery moves to the first non-exempt write (the 049 packet lists this page for repair). The recorded 2026-09-15 `GATE` result cannot reproduce as written. | H |
| `.skilled/skills/system-spec-kit/runtime/hooks/devin/README.md:55` | "Live-probed against `devin 3000.2.17`: `spec-gate-classify.mjs` delivered Gate-3 context on `UserPromptSubmit` …" | STALE | "the gate opens on `UserPromptSubmit`; context delivery moved to `PreToolUse` enforce" — the file's own table (line 59) says "Emits **nothing** … delivery now happens at enforce time." | M |
| `.skilled/plugins/system-spec-gate.js:154` (same inode/hardlink: `.opencode/plugins/system-spec-gate.js:154`) | "Advisory by default: classify surfaces the question, enforce advises." | STALE | "classify opens the gate silently and relays the one-shot deferral instruction; the question/notice is delivered at the first mutation." | M |
| `.skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/confirmed-non-delivery-documentation.md:19` | "the advisory classify step cannot be surfaced pre-emptively for Cursor the way it can for Codex/Claude" | STALE | "No runtime surfaces the question on the prompt turn anymore; Cursor reaches mutation-time delivery through `preToolUse` like its siblings." (The non-delivery finding itself — `beforeSubmitPrompt`/`stop` never fire — stays true.) | M |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3325` | "the classify step still injects the Gate-3 question, which a cli-opencode child then answers instead of doing its work" | STALE | Classify injects nothing; the remaining rationale is that an unbound child could still open the gate and meet the mutation-time notice. `SYSTEM_SPEC_GATE_DISABLED=1` + `AI_SESSION_CHILD=1` remains the correct pair. | M |
| `.skilled/skills/cli-external-orchestration/cli-hermes/feature-catalog/runtime-surface/repo-guards-project-plugin.md:28` | "Together they bridge every repo hook core Hermes's plugin API can reach: the skill advisor and spec gate at prompt time; …" | STALE | "the skill advisor at prompt time; the spec gate at the first non-exempt write (the prompt-time question read is retired)" — final wording depends on the Hermes repair seam. | M |
| `.env.example:146` | "# SYSTEM_SPEC_GATE_3_DELIVERY_SUPPRESSION= # Suppress a repeated Gate-3 question after confirmed delivery" | STALE | Under this file's own convention (commented line = default; "Opt-in OFF = disabled by default"), this reads as opt-in. Correct: "Default-on once delivered; set 0/false/no/off to re-ask every in-gate mutation." | M |
| `codex-hook-parity.md:41,50,113,185,249` | "the injected Gate-3 advisory is honored by the model" / "the Gate-3 advisory reaches the model" / "the model's response references choosing option E" / §4 "The injected Gate-3 `additionalContext` was honored by the model" / §7 "`spec-gate-classify` emits the Gate-3 `additionalContext`" | STALE (contract rows) / UNRESOLVED (§4 evidence) | Rewrite the Expected-signals and §7 PASS/FAIL rows to mutation-time delivery; the §4/§7 captured output is a 2026-07-13 pre-change run and needs historical framing or a re-run. | M |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:74` | "Disables spec-gate injection and enforcement." | STALE (wording) | "Disables Gate-3 delivery and enforcement" — its own Spec-Gate table (line 204) already says "no question, no denial, no state writes". | L |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:83` | "/** Independent opt-in for shadowing repeated Gate-3 delivery decisions. */" | UNRESOLVED | Ambiguous: `=1` only arms the legacy in-memory shadow telemetry; suppression is default-on via the persisted marker, and the operative override is `0`/`false`/`no`/`off`. Reword to name both effects. | M |
| `.skilled/skills/.state/spec-gate/README.md:21,41,55` | "It asks for an A-E choice before file mutation work" + state tables list only `status`/`askedAtMs`/`answeredAtMs`/… | UNRESOLVED | Nothing is positively wrong, but the structure table omits the persisted delivery-marker fields now carried in the same session file (`questionDeliveredAtMs`/`Channel`/`Count`). | L |

## Already-current surfaces checked

- `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/README.md` — full rewrite (mutation-time delivery; marker; default-on suppression; epoch/receipt = telemetry).
- `.skilled/skills/system-spec-kit/runtime/hooks/README.md:141-144`; `hooks/{claude,codex,cursor,devin,pi}/README.md` spec-gate rows (except devin:55 above).
- `.skilled/hooks/injection-contract.md:70-81,145-151`; `.skilled/hooks/README.md`; `.skilled/hooks/shared/README.md`; `hook-flags.env.example`.
- `spec-gate-core.mjs` header (10-20), `GATE_3_*` constants/comments (142-182), marker/emission contract (331-348), classify/enforce/observe docstrings.
- `.opencode/plugins/system-spec-gate.js` header (1-17) and body comments (204-244) — only the factory docstring at :154 is stale.
- `.skilled/skills/system-spec-kit/manual-testing-playbook/…/spec-mutation-gate-enforce.md:25-43,93-100,190-191` — only :91 stale.
- `.hermes/SYNC.md:79-81` (re-read and rebutted after a sweep agent flagged it); `.hermes/skills/**/SKILL.md` are generated mirrors ("generated by sync-skills-hermes.cjs; do not edit").
- `.cursor/hooks/README.md`, `.cursor/SYNC.md:107`, `.devin/hooks/README.md`, `.devin/SYNC.md`, `.claude/settings.json`.
- `.skilled/skills/cli-external-orchestration/cli-hermes/references/hook-contract.md:39-41` (already states mutation-time delivery); `shared/references/child-dispatch-preamble.md`; `cli-*/manual-testing-playbook/stress/child-spec-gate.md` cells (env-only).
- `references/config/environment-variables.md:179-181` (enumeration + pointer only); `hook-registry.json` concern strings; `doctor-runtime-mirrors.yaml` (file_exists only).
- `system-spec-kit/SKILL.md`, root `README.md`, `CONTRIBUTING.md` — policy-level Gate-3 language, mechanism-agnostic.
- All Gate-3 test suites assert the new behavior (`spec-gate-core.test.mjs`, per-runtime `.test.mjs`, Pi vitest, OpenCode `.test.cjs`).
- Changelogs and `specs/**` archives: historical by nature, excluded.

## sk-code-opencode alignment

- Ran the authoritative checker read-only: `python3 .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py --root .skilled/skills/system-spec-kit/runtime/hooks --root .skilled/skills/system-spec-kit/runtime/tests --root .opencode/plugins --check-exact-headers` → **FAIL, 11 EXACT-HEADER errors**. Commit-touched files among them: `hooks/{claude,codex,cursor,devin}/spec-gate-{classify,enforce}.mjs` (8), `hooks/devin/spec-gate-devin.test.mjs`, `hooks/lib/spec-gate/spec-gate-core.test.mjs` — all lack a `COMPONENT:`/`MODULE:` marker in the first 40 lines. One more (`devin/permission-request-policy.test.mjs`) is untouched. The check is opt-in; the **default run is clean**. `git show 8c63174469^:<file>` proves the headers were already absent pre-commit — pre-existing drift in touched files, not introduced by the commit.
- `.mjs` + `'use strict'`: correctly exempt (`check_javascript` returns early for `.mjs`; JS style guide §3). No violation.
- `.js`/`.cjs`: `.opencode/plugins/system-spec-gate.js` and `tests/system-spec-gate.test.cjs` carry box header + `'use strict'`. `hooks/claude/spec-gate-claude.test.mjs` keeps the older 78-char box — accepted where it already exists.
- `.ts`: `pi/spec-gate-classify.ts`, `pi/spec-gate-enforce.ts`, `spec-gate-pi-extension.vitest.ts`, `vitest.config.ts` all have `// MODULE:` headers. Minor: `vitest.config.ts:1` divider is 66 chars vs the standard 70 (`// ` + 67 box chars) — not verifier-detected, cosmetic only.
- Python: none of the touched files are Python → none found.
- Ephemeral ids in comments: none in touched code. Only test-data strings (`.opencode/specs/048-…` prompt fixtures in `spec-gate-core.test.mjs:1898-2560`) — data, not comments.
- JSON descriptors: `048/description.json`, `048/graph-metadata.json`, `033/graph-metadata.json` all parse (`json.load` OK). No JSONC/YAML in the commit.

## Uncertainty

- `codex-hook-parity.md` §4/§7 mixes a captured pre-change run with normative PASS/FAIL language; whether evidence sections are immutable history is an operator call (rows flagged with that caveat).
- Hermes wording: the implementation is excluded and the 049 fix is in flight, so replacement text for the HERMES-028 page / feature-catalog page / `hook-contract.md` depends on the chosen seam.
- `.skilled/skills/system-skill-advisor/runtime/lib/shadow/README.md:19` ("default-off suppression path") refers to the advisor's own shadow state machine; I did not verify whether that flag also flipped. Next: `rg -n "default-off suppression" .skilled/skills/system-skill-advisor`.
- Agent-level Gate-3 contracts still instruct the assistant to ask (`AGENTS.md`/`CLAUDE.md` symlink, `.skilled/commands/speckit/assets/speckit-implement.yaml:48-59`, `.skilled/agents/orchestrate.md:388-394`, `.pi/agents/*.md`). Excluded by the operator decision for AGENTS.md; flagged only as a consistency check.
- The advisor's `policy-plan.ts:203-229` still resolves the live `GATE_3_QUESTION` into a policy block; I did not verify whether/where the advisor emits it at runtime (no doc found describing it). Next: `rg -n "SPEC_FOLDER_QUESTION" .skilled/skills/system-skill-advisor --glob '!**/tests/**'`.
- Re-verify the whole report in one pass: `rg -n "SPEC FOLDER QUESTION|GATE_3_QUESTION|lifecycleEpoch|SPEC_GATE_3_DELIVERY" .skilled .opencode .pi .cursor .codex .devin .hermes .env.example --glob '!**/dist/**'`.
