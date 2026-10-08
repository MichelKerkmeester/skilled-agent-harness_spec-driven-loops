---
title: "Goal: Phrase cleanup hardening"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/016-phrase-cleanup-hardening"
    last_updated_at: "2026-10-08T12:19:59Z"
    last_updated_by: "orchestrator"
    recent_action: "Phase built and verified"
    next_safe_action: "Commit with wave 2"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-census.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs"
      - ".skilled/scripts/git-hooks/pre-commit"
      - ".skilled/scripts/git-hooks/lib/gates.tsv"
      - ".skilled/scripts/git-hooks/README.md"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/template-phrase-cleanup-hardening.vitest.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/template-phrase-lint-hook.vitest.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/template-phrase-integration.vitest.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phrase cleanup hardening

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Implement atomic writes in the cleanup tool, add seed recipes for all 18 template document kinds, and integrate a pre-commit phrase-judge lint that validates staged frontmatter.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Atomic write strategy: write to temp file in the same directory, then rename (POSIX rename is atomic) |
| D2 | All 18 template kinds will have seed recipes in the pin test, not in a separate data file |
| D3 | The pre-commit lint blocks only `template-default` and `editor-fallback` on newly added phrases, warns on every other negative class, and is bypassed with `SPECKIT_SKIP_PHRASE_LINT=1`. Decided 2026-10-08 by the operator |
| D4 | No-frontmatter files are routed to a fixer, not silently skipped |
| D5 | Built in wave 2 by GPT-6 Luna max on the fast tier through cli-codex: `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 codex -a never exec --model gpt-6-luna -c model_reasoning_effort="max" -c service_tier="fast" --sandbox workspace-write "<brief>" </dev/null`. One brief per task group in tasks.md, each naming its files and the check that proves it |
| D6 | Reviewed read-only by DeepSeek V4.1 Flash max through cli-pi on the OpenCode Go route with `--tools read,grep,find,ls`. The builder applies a finding only after confirming it in the code, for at most two rounds |
| D7 | The builder writes only the files in spec.md Files to Change, its tests and this folder. The orchestrator reverts any other write |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] Atomic write test passes and confirms no partial writes on error
- [x] All 18 template document kinds have seed recipes in the pin test
- [x] Create.sh seeding recognizes all 18 kinds and applies the correct phrases
- [x] A hook test shows an added `template-default` phrase blocks the commit, an added `single-token` phrase only warns, and `SPECKIT_SKIP_PHRASE_LINT=1` skips the lint
- [x] All existing cleanup, census, and create.sh tests pass with no regression
- [x] Integration test confirms cleanup, seeding, and linting work together
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Discover 18 template kinds | Done | 18 templates carry `trigger_phrases`; `TEMPLATE_FILES` at `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-census.mjs:28` lists 18 kinds |
| Atomic write in the cleanup tool | Done | `writeFileAtomically` at `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:224`; hardening file 3 passed |
| Seed recipes in the pin test | Done | `.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts:402` pins 18 kinds; file 16 passed |
| create.sh seeding for the new kinds | Done | `seed_template_document` at `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:394`, 13 new lists, call sites at lines 546 to 550 and 692 to 701 |
| No-frontmatter routing | Done | `routed` list with the `fill-frontmatter` fixer; test at `.skilled/skills/system-spec-kit/runtime/cli/tests/template-phrase-cleanup-hardening.vitest.ts:84` |
| Pre-commit lint | Done | `template-phrase-lint.mjs` wired at `.skilled/scripts/git-hooks/pre-commit:146`; hook file 6 passed, including block, warn, HEAD and bypass cases |
| Cross-family review | Done | DeepSeek V4.1 Flash round 1: F1 P0, F2 P2 and F3 P2, all fixed |
| Integration | Done | `template-phrase-integration.vitest.ts` 1 passed: seed, clean, stage an added default, lint exits 1 |
| Wave 2 final gates | Done | cli suite rc 0 with 1,682 passed against a 1,639 baseline; `run check` rc 0; typecheck rc 0; hook tests 184 run, 0 fail; five phase files 43 passed |
| Validate changes | Done | `validate.sh --strict` prints `RESULT: PASSED`; `check-goal.cjs` passes |

### Deviations and findings

| Item | Note |
|------|------|
| Lint posture decided | 2026-10-08, the operator chose to block only `template-default` and `editor-fallback` on newly added phrases and warn on every other class, with a `SPECKIT_SKIP_*` bypass. A full block was considered and rejected because the research ruled out turning phrase warnings into errors on author-declared phrases. This replaces the earlier `--no-verify`-only bypass decision |
| Write set widened by the review | Finding F3 had the builder add `.skilled/scripts/git-hooks/lib/gates.tsv` and `.skilled/scripts/git-hooks/README.md`, so the new gate is registered like its neighbours. D7 limits the builder to the Files to Change; both files are now in spec.md |
| Lint module added to Files to Change | `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs` was planned in plan.md but missing from the spec table |
| Packet types keyed on file names at first | Finding F1: the phase-parent, review and research kinds were keyed on file names `create.sh` never writes. They are now resolved by packet type through `documentKindForPath` |
| Atomic write differs from the task text | The failure test injects a rename failure instead of killing a process, and the write has no pre-rename hash of the temp file. `afterHash` is read back from the target |
| Atomic write mode | Finding F2: the umask narrowed a `0664` file; the temp file now takes the target's mode and a test pins it |
| Routing reports, does not run | No-frontmatter files get a `routed` entry with a runnable command; the tool does not execute the fixer |
| Five kinds not scaffolded | `create.sh` does not scaffold resource-map, handover, debug-delegation, research or review-report, so their seeding is proven by the recipe pin and call-site check |
| Lint fails open | If the linter, `node` or git is unavailable the gate warns and lets the commit through |
| No changelog refresh | No `changelog/` folder exists under the parent or the track |
<!-- /ANCHOR:log -->
