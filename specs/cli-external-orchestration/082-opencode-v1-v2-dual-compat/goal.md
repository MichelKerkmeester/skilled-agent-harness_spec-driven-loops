---
title: "Goal: OpenCode v1 and v2 dual compatibility"
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
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat"
    last_updated_at: "2026-10-18T15:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "opencode-dual-compat-build"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: OpenCode v1 and v2 dual compatibility

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every repo plugin, agent, command, skill, guard and config file run on OpenCode 1.19.3 and 2.0.32, and cli-opencode dispatch to both, so that: all 11 phase children report `RESULT: PASSED` under `validate.sh --recursive --strict` on this packet; all 16 plugins load on v1 and show active in v2 `/api/plugin`; the `/doctor:opencode` battery exits 0 on both versions; `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` classifies and evaluates `opencode2 run`; `run-all-drift-guards.sh` exits 0; and the cli-opencode `SKILL.md` names OpenCode 1.19.3, OpenCode 2.0.32 and a verification date.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each plugin default-exports one plain object `{ id, setup, server }` |
| D2 | `opencode.json` stays in the v1 shape: the singular `permission` map and `mcp.<name>` entries, with no `permissions`, `plugins` or `disabled` key |
| D3 | Version comes from parsed `--version`, never the binary name. Every v2 child uses `run --standalone` |
| D4 | No `opencode upgrade --major`, no change to operator installs, no v2 service restart; install proofs use throwaway prefixes |
| D5 | Targets are 1.19.3 and 2.0.32: `@opencode-ai/plugin` 1.19.3 exact, zod declared, `@opencode/plugin` 2.0.32 type-only |
| D6 | Code goes to GPT-6 Luna max fast via cli-codex. Docs, probes and review go to DeepSeek V4.1 Flash max via cli-devin. Each reviews the other, and the orchestrator reruns every test |
| D7 | Changed code follows the sk-code OPENCODE surface, and changed docs follow their sk-doc mode |
| D8 | The public claim names 1.19.3, 2.0.32, a date and the capability delta; later versions are unsupported until re-verified |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-unknowns-and-baseline | `001-unknowns-and-baseline/goal.md` |
| 002-pins-imports-dual-export | `002-pins-imports-dual-export/goal.md` |
| 003-hard-plugins | `003-hard-plugins/goal.md` |
| 004-agents-commands-config | `004-agents-commands-config/goal.md` |
| 005-version-aware-guards | `005-version-aware-guards/goal.md` |
| 006-cli-opencode-dual-dispatch | `006-cli-opencode-dual-dispatch/goal.md` |
| 007-install-guidance-and-setup-helper | `007-install-guidance-and-setup-helper/goal.md` |
| 008-doctor-and-ci | `008-doctor-and-ci/goal.md` |
| 009-sk-code-opencode-alignment | `009-sk-code-opencode-alignment/goal.md` |
| 010-documentation-sweep | `010-documentation-sweep/goal.md` |
| 011-two-version-proof-and-closeout | `011-two-version-proof-and-closeout/goal.md` |
| 012-sk-vision-v2-prompt-hook | `012-sk-vision-v2-prompt-hook/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] All 11 phase children report `RESULT: PASSED` under `validate.sh --recursive --strict` on this packet
- [ ] All 16 plugins load on v1 and show active in v2 `/api/plugin`
- [ ] The `/doctor:opencode` battery exits 0 on both versions
- [ ] `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` classifies and evaluates `opencode2 run`
- [ ] `run-all-drift-guards.sh` exits 0
- [ ] The cli-opencode `SKILL.md` names OpenCode 1.19.3, OpenCode 2.0.32 and a verification date
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
| Phase tree scaffolded | Done | 11 children created under this packet |
| 001 unknowns and baseline | Done | findings.md Q1 to Q11, baseline.json: v1 16 of 16 loaded, v2 0 of 16 active |
| 005 version-aware guards | Done | `opencode2 run` classified and evaluated by version; v1 verdicts unchanged on 23 commands; validate strict PASSED (005/scratch/evidence.md) |
| 002 pins, imports, dual export | Done | 11 of 11 ported plugins active on v2, 16 of 16 load on v1, plugin suite 331 of 331, validate strict PASSED (002/scratch/evidence.md) |
| 003 hard plugins | Done | 16 of 16 plugins active on v2 and 16 of 16 load on v1 (18 tool ids), plugin suite 353 of 353 with and without AI_SESSION_CHILD, sk-vision bun test 29 of 29, review P1s closed by verification, validate strict PASSED (003/scratch/evidence.md) |
| Live bridged-tool execute on v2 | Done | Operator-approved run: v2 2.0.32 executed the bridged `opencode_goal_status` tool and returned the plugin's output (scratch/live-tool-execute/notes.txt) |
| 004 agents, commands, config | Done | Ten browser keys, 23 delegation wording edits, mirrors synced, 12 non-command files moved out of the command tree (v1 51 to 39 commands), opencode.json unchanged and guarded by a shape test, deep-loop suite 2718 passed, validate strict PASSED (004/scratch/evidence.md) |
| 006 cli-opencode dual dispatch | Done | The runtime reads the major from `--version`: v1 argv unchanged, v2 `run --standalone -m model#variant`, native refuses on v2; builder smoke dispatch exit 0 on 1.19.3 and 2.0.32, v2 child saw AI_SESSION_CHILD=1, deep-loop suite 2741 passed 0 failed, validate strict PASSED (006/scratch/evidence.md) |
| 007 install guidance and setup helper | Done | `opencode-setup.sh` builds both, v1 or v2 under HOME; in a throwaway HOME `both` exits 0 with 1.19.3 and v2.0.32, a second run and `check` leave one tree hash, probes point XDG_DATA_HOME at a temp folder so the v2 log stays out of HOME, operator snapshot bracket clean apart from the live service's shm files, reference validates 0 issues (007/scratch/decisions.txt 16 to 19) |
| 008 doctor and CI | Done | `opencode-version-battery.cjs` passes every leg on 1.19.3 and 2.0.32 (16 of 16 plugins loaded on v1, 16 of 16 active in a private v2 server), a broken copy exits 1 naming the plugin, SIGTERM 143 and SIGINT 130 leave nothing behind, the shared service is never touched, the doctor suite goes from 350 of 353 to 380 of 380; the CI workflow passes actionlint and stays untracked (008/scratch/decisions.txt 14 to 23) |
| 009 sk-code-opencode alignment | Done | Four findings-first reviews of 75 changed code files; 5 P1 fixed (the dispatch guard read its args from the wrong argument and never refused on either version, v2 `/vision` was shadowed by `vision.md` and is now filled from the prompt hook, the manifest path, flag values, prompt-file images), 16 P2 deferred with reasons; drift guards exit 0, hygiene clean, every touched suite at or above its baseline, battery 16 of 16 on both versions (009/findings.md, 009/scratch/decisions.txt 4 to 12) |
| 010 documentation sweep | Done | 52 docs pass their validator, DQI 77 or more and HVR 0 (41 at closeout, 11 added by the event correction); every OpenCode 1 only flag is tagged and each v2 form sits beside it; cli-opencode, hub, playbook and catalog package checks exit 0; changelog v1.5.0.0; three Luna reviews and four verifies, the last PASS, then two event-correction reviews and verifies, both verifies PASS; validate strict PASSED (010 implementation-summary.md) |
| 011 two-version proof and closeout | Done | Ten suites at or above baseline from the final tree; the battery exits 0 three times on each version (v1 16 of 16 loaded, v2 16 of 16 active, 57 skills); `dispatch-audit.mjs` classifies and evaluates `opencode2 run`; one live dispatch per version exit 0; drift guards exit 0; the D8 claim, dated 2026-10-19, in the cli-opencode SKILL.md, README and eight references; recursive strict PASSED (011 proof.md) |
| 012 sk-vision v2 prompt hook | Done | With `SK_VISION_AUTOINSPECT=1`, OpenCode 2.0.32 runs the automatic image check in `session.hook("prompt")`; a live private-server run stored Scene, Caption, OCR and Atlas blocks with the flag on and none with it off; sk-vision bun test 46 to 50, plugins 356, battery exit 0 on both versions; Luna PASS (012 implementation-summary.md) |
| 013 sk-vision v2 tools and loose ends | Done | With `SK_VISION_AUTOINSPECT=1`, OpenCode 2.0.32 lists the 13 `sk_vision_*` tools and ran `sk_vision_status` live, and with it off lists none; `RuntimeClient.close()` stops a startup still provisioning; grace path unit-tested; sk-vision bun test 50 to 67, plugins 356, battery exit 0 on both versions; Luna PASS in round 7 (013 implementation-summary.md) |

### Deviations and findings

| Item | Note |
|------|------|
| sk-vision bundle | `vision-runtime/dist/` is a build output missing from a fresh worktree, so 001 builds it before the baseline |
| Bun-compiled v2 | OpenCode 2 is Bun-compiled, so `process.argv[1]` is a virtual path. An import-time `realpathSync(process.argv[1])` in a plugin import chain kills the plugin on v2 (002 decision 10) |
| 005 policy amendment | On `unknown`, version-specific rules warn instead of dropping (005 Q5), and the probe targets the binary the command runs (005 NFR-S01) |
| 006 binary order | PATH order first, `opencode2` before `opencode` only inside one directory, so test stubs keep winning over a real binary (006 decision 10). With both installed side by side, cli-opencode lineages go to v2 and native lineages refuse until `OPENCODE_BIN=opencode` |
| 006 v2 default model | v2 lists no opencode-go model on this machine, so a v2 lineage with no pinned model fails here until that credential is added to v2; carried to 007 (006 decision 12). Resolved in 043: v2 defaults to `llmgateway` |
| 007 executors | The operator asked for DeepSeek V4.1 Flash wherever possible: DeepSeek writes code and docs from 007 on, Luna cross-reviews (007 decision 0) |
| 007 v2 opencode-go | The install reference states that the skill's default model names the `opencode-go` provider, which v2 does not list here, so the default cannot be assumed to work on v2 (reference line 250). Adding that credential to v2 is the operator's. Resolved in 043, as for 006 |
| 008 v1 oracle | OpenCode 1.19.3 logs no plugin line and reports no broken plugin, so the v1 load check is an import harness, not a log window (008 decision 2) |
| 008 git-setup-check | Phase 002's `dualPlugin(...)` wrapper hid the git adapter from `/doctor:git`; fixed in 008 (decision 12) |
| 008 Q1 held | `/doctor:opencode` stays a script: a command file needs its route entry and catalog rows, which wait for the operator (008 decisions 4 and 15) |
| 009 model call | The live v2 `/vision` check ran one unapproved llmgateway turn, USD 0.0037, because the private server's config was not isolated; the fixture probes may have run four more (009 decision 9). Later probes isolate XDG_CONFIG_HOME |
| 009 cross-packet edit | One census row in `specs/system-deep-loop/036-deep-loop-innovation/` changed so a projection test matches the moved manifest path (009 decision 7) |
| 010 SKILL.md word limit | Phase 006 had taken SKILL.md past its 5,000-word limit; 010 cut it to 4,899, so phase 011's verification line has about 100 words of room (010 decision 11) |
| 010 routing manifest | SKILL.md bytes feed the hub's compiled routing policy, so 010 re-minted the live manifest and its authored copy under `specs/sk-doc/z_archive/` (010 decision 14); any later SKILL.md edit, phase 011's included, needs the same re-mint |
| 010 v2 twins unrun | The OpenCode 2 doc twins come from saved help; none was dispatched in 010. v2 `--agent` routing was later verified live in 011 (011 decision 10) |
| 010 event correction | 011's live runs showed both versions emit `step_start`, `tool_use`, `text` and `step_finish` with `sessionID`; the older names in 26 cli-opencode docs were wrong on OpenCode 1 too. Amended in 010 with 11 docs whose OpenCode 1 lines had no tag; DeepSeek wrote through cli-pi because the devin quota was spent (010 decision 18) |
| 010 harness slip | A mis-quoted test harness ran the operator's `opencode2 --version` once; it failed to exec and changed nothing (010 decision 16) |
| Phase 12 after closeout | The operator asked for the sk-vision OpenCode 2 port after the eleven phases closed. It is phase 012, outside the objective's eleven-phase count, which stays as written |
| Phase 13 has no child goal | The durable slice is 3,984 characters, so a 13th binding row would take it past the 4,000 limit. Phase 013 is bound by the phase map and its acceptance criteria. Like phase 012, it sits outside the objective's eleven-phase count |
<!-- /ANCHOR:log -->
