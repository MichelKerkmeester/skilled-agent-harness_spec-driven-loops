---
title: "Implementation Summary"
description: "The cli-deepseek-harness mode packet exists, unregistered: SKILL.md, ROUTER.md, README.md, eleven fail-closed hard rules, six references tied to the offline pin, two assets and a v1.0.0.0 changelog entry, with checker, id-scan and flag-loop results recorded."
trigger_phrases:
  - "cli deepseek harness skill packet implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/085-cli-deepseek-harness-creation/003-cli-deepseek-harness-skill-packet"
    last_updated_at: "2026-11-06T04:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built the cli-deepseek-harness packet and recorded the checker, id-scan and flag-loop results"
    next_safe_action: "Phase 007 implements the eleven check ids"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-deepseek-harness/SKILL.md"
      - ".skilled/skills/cli-external-orchestration/cli-deepseek-harness/hard-rules.json"
      - ".skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/cli-reference.md"
      - ".skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/providers-and-models.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-003-cli-deepseek-harness-skill-packet"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "OpenCode Go endpoint, deferred to phase 013-dsh-live-contract-pin"
      - "The dispatch rule-check suite fails 2 of 42 until the eleven check ids are implemented, owned by phase 007"
    answered_questions:
      - "The packet carries no benchmark/ or manual-testing-playbook/ until phase 014"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-cli-deepseek-harness-skill-packet |
| **Completed** | 2026-11-06 |
| **Status** | Complete |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A caller now has one place that says how to dispatch to dsh and what a dispatch must never do. The mode is not registered in the hub, so nothing routes to it yet.

### Phase 3: cli-deepseek-harness-skill-packet

The packet fixes the dispatch shape `dsh --profile headless --patch <route> --patch <lineage> --json --permission-mode <preset> --approval-policy never -`, run from a scratch cwd with a disposable `DSH_HOME` and the prompt on stdin. It names the closed roster, LLM Gateway `deepseek-v4.1-flash-1017` and OpenCode Go `deepseek-v4.1-flash`, with the OpenCode Go endpoint marked UNKNOWN. It carries eleven rules at severity `error`. Every headless option it names was matched against `002-dsh-offline-contract-pin/evidence/headless-help.txt`, and the four launcher flags are grounded in their own table. Planned surfaces (`.dsh/` patches, the repo-guards plugin, the MCP patch and the executor kind) are labeled planned, and anything only a keyed run can prove is labeled `documented, unconfirmed`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/SKILL.md` | Created | Mode contract, dispatch shape, gotchas, rules |
| `.../cli-deepseek-harness/ROUTER.md` | Created | Seven intents with matching `INTENT_SIGNALS` and `RESOURCE_MAP` |
| `.../cli-deepseek-harness/README.md` | Created | Operator entry point |
| `.../cli-deepseek-harness/hard-rules.json` | Created | The eleven rules, `cli-pi` shape |
| `.../cli-deepseek-harness/references/cli-reference.md` | Created | Version pin, headless options, launcher flags, dispatch shape, exit contract |
| `.../cli-deepseek-harness/references/providers-and-models.md` | Created | Two-route roster and route patch shape |
| `.../cli-deepseek-harness/references/runtime-folder-and-sync.md` | Created | `.dsh/` layout, `DSH_HOME` isolation, skills, prompts, personas |
| `.../cli-deepseek-harness/references/guards-and-hooks.md` | Created | Seams, plugin delivery, port table |
| `.../cli-deepseek-harness/references/mcp.md` | Created | MCP off by default, the opt-in patch |
| `.../cli-deepseek-harness/references/fanout-executor.md` | Created | Planned executor kind |
| `.../cli-deepseek-harness/assets/prompt-quality-card.md`, `assets/prompt-templates.md` | Created | Prompt delegator and dispatch templates |
| `.../cli-deepseek-harness/changelog/v1.0.0.0.md` | Created | First changelog entry |
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`, `implementation-summary.md` | Modified | Results and closure |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A sub-agent of the orchestrating Claude session wrote every file, not the session itself as the plan says. It read the `sk-create-skill` contract, the `sk-create-changelog` template, `cli-pi` and `cli-hermes` as shape precedents, the research synthesis and the phase 002 captures first, and ran no `dsh` command. The checks ran on 2026-11-06 in this order.

1. `check_changelog_shape.py changelog/v1.0.0.0.md` printed `PASS` and `SUMMARY files=1 pass=1 fail=0`, exit 0.
2. The first `sk-skill-check.cjs` run found C3 FINDING: five references lacked a `### When to Use` subsection. Each got one, and the rerun printed the result below.
3. `node .skilled/commands/doctor/scripts/sk-skill-check.cjs .skilled/skills/cli-external-orchestration/cli-deepseek-harness`, exit 1:

```text
C3  PASS    Format: Strict package validation passed.
C4  PASS    Root metadata: Parent hub metadata contract passed.
C7  PASS    Router equivalence: Parsed 7 intent signal groups and 7 resource-map entries.
C8  FINDING Advisor home: compiled skill graph is stale Advisor queries completed; the skill appeared in 0 of 1 result(s).
C9  FINDING Runtime mirrors: Runtime mirror status: Claude:pass, OpenCode:pass, Pi:pass, Devin:pass, Hermes:finding, Codex:n/a, Cursor:n/a.
C10 FINDING Changelog: The changelog index link is missing or does not resolve.
C12 PASS    Collisions: No duplicate, reserved-prefix or runtime-persona collision found.
Result: FINDINGS (3)
```

   No row is ERROR. C8 and C9 read the same on `cli-pi` and `cli-hermes` in the same session. C10 wants `.skilled/changelog/cli-external-orchestration/cli-deepseek-harness`, a link outside this phase's write scope.
4. `node -e` parse of `hard-rules.json` exited 0 with 11 rules, and the `rg -q` loop over the eleven ids exited 0.
5. The flag loop: every double-dash token in `references/cli-reference.md`, minus the four launcher flags `--patch`, `--dump-config`, `--dump-default-config` and `--version`, checked with `rg -F -q` against the help capture. 7 app flags were found and the loop exited 0. A second loop found each launcher flag in `resource-map.md`, `research.md` or `phase-plan.md`, exit 0. A control loop with no exclusions reported exactly those four as missing, so the check can fail.
6. `rg -c 'deepseek-v4.1-flash' references/providers-and-models.md` printed 5, the roster table has two rows and `UNKNOWN` marks the OpenCode Go endpoint.
7. `validate_document.py README.md --type readme` reported 0 issues. A link scan over the packet found 0 broken relative links.
8. `parent-skill-check.cjs .skilled/skills/cli-external-orchestration` exited 1 with one failure, `FAIL: 6a: child director(ies) neither registered as a packet nor allowlisted: [cli-deepseek-harness]`. Every other invariant passed.
9. `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` went from 42 of 42 passing before the packet existed to 40 of 42 after. The two failures are the CI guard `unknown check "headless-only"` and the bijection guard `declared but never implemented`, naming all eleven check ids.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| No hub registration in this phase | The mode must not be selectable before the executor kind exists, so phase 011 registers it after phase 006 |
| References cite phase 002 captures, not harness docs | Docs can drift from the installed rc, and a flag the help text lacks would make a dispatch fail |
| The flag loop excludes exactly four launcher flags | `--patch`, `--dump-config`, `--dump-default-config` and `--version` are launcher flags, so the headless help cannot contain them. `cli-reference.md` section 4 grounds each in another source, and a second loop checks that grounding |
| Each rule's `check` id equals its rule id | `cli-pi` uses the same convention, and phase 007 implements those ids in the dispatch rule engine |
| No `benchmark/` or `manual-testing-playbook/` | They pair with a benchmarked skill, and the playbook belongs to phase 014 |
| No `description.json` or `graph-metadata.json` in the packet | A nested mode packet carries no advisor identity of its own |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `sk-skill-check.cjs` on the packet | No ERROR row, C3 strict format PASS, `Result: FINDINGS (3)`, exit 1 |
| `hard-rules.json` parse and eleven-id loop | Exit 0 and exit 0 |
| Flag loop against the help capture | 7 app flags found, exit 0 |
| Roster rows and UNKNOWN endpoint | Two rows, UNKNOWN present |
| `validate.sh <phase folder> --strict` | `RESULT: PASSED` |
| `parent-skill-check.cjs` on the hub | Exit 1, the one failure is 6a for the unregistered folder |
| `dispatch-rule-checks.test.mjs` | 40 of 42, down from 42 of 42 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live behavior stays unconfirmed.** The packet can only mark route answers, sandbox confinement and the OpenCode Go endpoint as `documented, unconfirmed` or UNKNOWN until phase `013-dsh-live-contract-pin` runs with an operator key.
2. **The dispatch rule-check suite is red until phase 007.** Its guards scan every `cli-*` folder and fail on any declared check id the engine does not implement. No shape fits inside this phase's write scope: without `check` ids the at-least-one-rule guard fails instead. Implementing the eleven checks in `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` clears both failures.
3. **The hub checker fails 6a until phase 011.** It wants the folder in `mode-registry.json` or an allowlist. The global changelog index link that sk-skill-check C10 wants is registration work too.
4. **The `.dsh/` paths are planned.** The dispatch shape names `.dsh/patches/` files that phase 004 creates. The packet tells a caller to confirm them with `ls` and a `--dump-config` run first.
<!-- /ANCHOR:limitations -->

---
