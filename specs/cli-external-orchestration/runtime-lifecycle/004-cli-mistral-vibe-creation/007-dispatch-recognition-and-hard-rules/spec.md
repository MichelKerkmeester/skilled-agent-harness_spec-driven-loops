---
title: "Feature Specification: Phase 7: dispatch-recognition-and-hard-rules"
description: "A `vibe -p` dispatch resolves to no packet in the shared dispatch hook library, so no hard rule checks it before launch. This phase teaches the library to recognize Vibe session starts and implements the checks that cli-mistral-vibe's hard-rules.json names."
trigger_phrases:
  - "dispatch recognition and hard rules"
  - "phase 7 dispatch recognition and hard rules"
  - "vibe dispatch preflight"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: dispatch-recognition-and-hard-rules

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 12 |
| **Predecessor** | 006-vibe-runtime-folder-and-mirrors |
| **Successor** | 008-vibe-repo-guards |
| **Handoff Criteria** | Each hard rule refuses its own violating command and accepts the documented shape |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Mistral Vibe runtime mode build specification.

**Scope Boundary**: Recognition of Vibe session starts and the checks behind cli-mistral-vibe's hard rules, inside `.skilled/hooks/dispatch/`. No change to the verdict on any command that contains no Vibe dispatch.

**Dependencies**:
- 005-cli-mistral-vibe-skill-packet. Its `hard-rules.json` declares the rule ids and check names this phase implements. The phase plan lists 005 as this phase's only dependency, so 007 does not wait on 006.

**Deliverables**:
- Vibe session starts recognized as cli-mistral-vibe dispatches, with the session-free forms left alone.
- One check per cli-mistral-vibe hard rule, each with a refusing and an accepting test case.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shared dispatch hook library maps each headless CLI shape to the packet whose `hard-rules.json` it enforces, and Vibe is not in that map. A `vibe -p` dispatch resolves to no packet, so it can launch with the operator's `~/.vibe` as its home, no `export.json`, an off-roster model or the repository root as its working directory, and nothing refuses it.

### Purpose
Every Vibe session start is checked against cli-mistral-vibe's hard rules before it launches, and each rule refuses its own violation.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -c vibe .skilled/hooks/dispatch/lib/dispatch-audit.mjs .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs; echo "exit=$?"
exit=1
$ node --input-type=module -e "import { resolveDispatchPackets } from './.skilled/hooks/dispatch/lib/dispatch-audit.mjs'; for (const c of ['VIBE_HOME=/tmp/v vibe -p hi --output-dir /tmp/o </dev/null', 'pi --offline -p hi </dev/null']) console.log(c, '->', JSON.stringify(resolveDispatchPackets(c).map((p) => p.skill)));"
VIBE_HOME=/tmp/v vibe -p hi --output-dir /tmp/o </dev/null -> []
pi --offline -p hi </dev/null -> ["cli-pi"]
$ cd .skilled/hooks/dispatch && node --test lib/dispatch-rule-checks.test.mjs tests/dsh-dispatch.test.mjs 2>&1 | rg '^ℹ (tests|pass|fail)'
ℹ tests 53
ℹ pass 53
ℹ fail 0
$ node --input-type=module -e "import { CHECKS } from './.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs'; console.log(CHECKS['closed-roster']('VIBE_HOME=/tmp/v vibe -p hi --model off-roster </dev/null', {}));"
true
$ .skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs 2>&1 | tail -6
 Test Files  1 passed (1)
      Tests  128 passed (128)
   Start at  14:08:05
   Duration  337ms (tests 82%, transform 12%, import 5%, worker 1%)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Recognize a `vibe`, `vibe-rs` or `vibe-acp` word in command position as a cli-mistral-vibe dispatch in `dispatch-audit.mjs`, except the session-free forms `-v`, `--version`, `-h`, `--help`, `config`, `mcp` and `help`. That lets `print-mode-only` see an interactive or ACP start, while phase 006's `vibe config schema` and phase 009's `vibe --version` preflight pass untouched. `vibe-rs` is included until phase 004 settles which name a dispatch shows.
- Implement one check per rule in cli-mistral-vibe's `hard-rules.json`. Phase 005's plan names six: `print-mode-only`, `isolated-vibe-home`, `output-dir-required`, `vibe-closed-roster`, `no-repo-root-cwd` and the shared `stdin-redirect-required`.
- Keep cli-mistral-vibe's roster check from resolving to dsh's check of the same name. `CHECKS` is one registry keyed by check name, and the existing `closed-roster` reads only dsh dispatches.
- Add the Vibe print shape to `HEADLESS_DISPATCH_SHAPES`, once phase 005 adds `stdin-redirect-required` to its rules. Without that rule the shared stdin check never runs on a Vibe dispatch.
- Add a refusing case and an accepting case per check to the dispatch hook tests, plus recognition cases for each binary name and each session-free form.

### Out of Scope
- An ACP dispatch path - the ACP supervisor is deferred as an optional second dispatch mode, worth building only after print mode is proven. `print-mode-only` refuses `vibe-acp` until then.
- A sandbox check - sandbox mode is deferred because Vibe has no CLI or config field for it. The executor kind in phase 009 fails closed on a sandbox request instead.
- Turn-stopping guards such as completion-evidence and ask-surface - deferred because Vibe has no strict `post_agent` event, so they are not portable.
- The session-relaunch loop - deferred because Vibe has no idle or compaction event and only an outer supervisor could drive it.
- Guards that run inside Vibe as hooks - phase 008 owns them.
- Any change to default models - DevPass stays the default.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Modify | Vibe dispatch shape, executor basenames and skill mapping |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Modify | One check per cli-mistral-vibe hard rule, and the Vibe headless shape |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Modify | Refusing and accepting case per check |
| `.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` | Modify | Recognition cases for each binary name and each session-free form |
| `.skilled/hooks/dispatch/README.md` | Modify | One row per new check in the check table |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A Vibe session start resolves to cli-mistral-vibe | `resolveDispatchPackets` returns `cli-mistral-vibe` for `vibe -p`, `vibe --prompt-file`, a bare `vibe`, `vibe-rs -p` and `vibe-acp` commands |
| REQ-002 | Every rule in cli-mistral-vibe's `hard-rules.json` names a check that exists and is not another executor's | Each rule's `check` value is in `KNOWN_CHECKS` and is not `closed-roster`, asserted by a test, because `evaluate` silently skips an unknown check |
| REQ-003 | Each rule refuses its own violation and accepts the documented shape | `evaluateDispatch` returns that rule id for its violating command and no violation for the documented command |
| REQ-004 | Session-free Vibe commands are not dispatches | `evaluateDispatch` returns `[]` for `vibe --version`, `vibe --help`, `vibe config schema` and `vibe mcp list`, and `resolveDispatchPackets('rg -c vibe file')` returns `[]` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Commands with no Vibe dispatch keep their verdict | The dispatch hook suites pass with no existing case edited |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A `vibe -p` dispatch without `VIBE_HOME` is refused by the preflight before launch.
- **SC-002**: The documented dispatch shape from cli-mistral-vibe's `SKILL.md` passes every rule, and `vibe config schema` passes untouched.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-mistral-vibe's `hard-rules.json` from phase 005 | High: no rule ids to implement without it | Setup reads the file and lists its check names before any code changes |
| Risk | A misspelled check name or a check that throws passes silently, because `evaluate` skips unknown checks and fails open on a throw | High | REQ-002's test plus a refusing case per rule, so a rule that never fires fails its test |
| Risk | Phase 005's `closed-roster` name already belongs to dsh's check, which returns `true` for an off-roster Vibe model (Measured Behavior) | High | Settled 2026-11-14: phase 005 names the Vibe check `vibe-closed-roster`, and T011 keeps the names apart |
| Risk | Adding Vibe to `HEADLESS_DISPATCH_SHAPES` changes how cli-opencode's stdin rule judges a chain such as `opencode run ... </dev/null && vibe -p hi`, which then needs a redirect on the Vibe half too | Low | Intended: the Vibe half can hang on an open stdin. A test pins the chain verdict, and the change waits on phase 005's stdin rule |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Answered by phase 004: the ancestor walk sees `vibe-rs` and its child `vibe-app-server`, never `vibe`, because the Python launcher execs away. Command-text recognition still matches the `vibe` word a dispatcher types.
- Answered by phase 004: stdin is a prompt source only behind a bare `-p` (`echo ... | vibe -p` exits 0); a pipe with no `-p` exits 1, "Interactive mode needs a terminal". The stdin check must accept a pipe into a bare `-p` and `-p TEXT </dev/null`.
- Answered by phase 004: `--prompt-file` alone runs print mode (exit 0, no `-p` needed), so `print-mode-only` accepts `vibe --prompt-file` without `-p`.
- Does phase 005 rename its roster check to `vibe-closed-roster`, or should the shared `closed-roster` check learn Vibe dispatches? The proposal is the rename, because one check per executor keeps the dsh roster logic untouched.
- Does vibe 3.1.2 load a `.env` from its working directory? UNKNOWN. The working-directory check refuses the repository root either way, and the answer only changes the rule message.
<!-- /ANCHOR:questions -->

---
