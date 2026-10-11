---
title: "Goal: Typo-proof parsers"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "typo proof parsers goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/001-typo-proof-parsers"
    last_updated_at: "2026-10-11T19:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-021-001"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Typo-proof parsers

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every script the silent input sweep flagged reject an unknown or misspelled option with a one-line error and exit 2, and make every detected problem exit non-zero.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | An unknown or misspelled option prints one line naming it on stderr and exits 2. Each script keeps its own option list. |
| D2 | A shared helper exists only per language with three or more callers that can import it without a new cross-skill dependency. |
| D3 | Only the pass-through wrappers listed in `spec.md` may forward unknown options. |
| D4 | The four unreproduced rows are proven in a throwaway worktree or `/tmp` copy before any change. |
| D5 | Every ledger row in `spec.md` ends Fixed with a command proof or Closed with a written reason that prevent-overengineering or an operator decision backs. |
| D6 | Changed behavior gets a test that fails before the change and passes after it. |
| D7 | Each touched skill is bumped once, with one changelog entry. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -cE '^\| (F[0-9]+|U[1-4]) \| (Fixed|Closed) \|' specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/001-typo-proof-parsers/implementation-summary.md`, run from the repository root, prints 68.
- [ ] `grep -E '^\| (F[0-9]+|U[1-4]) \| Fixed \|' specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/001-typo-proof-parsers/implementation-summary.md | grep -vcF "$(printf '\140')"` prints 0, and `grep -E '^\| (F[0-9]+|U[1-4]) \| Closed \|' specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/001-typo-proof-parsers/implementation-summary.md | grep -vcE 'prevent-overengineering|operator decision'` prints 0, both run from the repository root.
- [ ] `F=specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/001-typo-proof-parsers/implementation-summary.md; [ "$(grep -cE '^\| T[0-9]+ \| .+ \| before: exit [1-9][0-9]* \| after: exit 0 \|$' $F)" = "$(grep -cE '^\| T[0-9]+ \|' $F)" ] && grep -qE '^\| T1 \|' $F && echo ok`, run from the repository root, prints ok.
- [ ] `B=$(git log -1 --format=%H --grep='scaffold the open ends remediation phases'); for s in $(git diff --name-only $B HEAD -- .skilled/skills | cut -d/ -f3 | sort -u); do [ "$(git diff --name-only --diff-filter=A $B HEAD -- .skilled/skills/$s/changelog | wc -l | tr -d ' ')" = 1 ] && git diff $B HEAD -- .skilled/skills/$s/SKILL.md | grep -q '^+version:' || echo $s; done`, run from the repository root, prints nothing.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/001-typo-proof-parsers --strict`, run from the repository root, prints `RESULT: PASSED`.
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
| Packet scaffolded | Done | create.sh phase mode with `--with-goal`; spec.md lists every ledger row |
| Build | Done | 68 ledger rows Fixed in `implementation-summary.md`; ten typo-flag test files red before, green after |
| Release | Done | Seven skills bumped once, one changelog entry each |
| Deep review | Pending | Five cli-pi iterations over the build commit |

### Deviations and findings

| Item | Note |
|------|------|
| Exit codes | Operator decision: each script keeps its existing usage code (64, 1, deep-loop exit 3 JSON); 2 elsewhere |
| `resolve.cjs` | Left unchanged: served copy of an archived authored source; the live `compiled-route.cjs` carries the fix |
| Feature catalog caller | `mcp-tooling` feature catalog documents `ci-skill-root-metadata.cjs --skills-dir`, which now exits 2; listed, not edited |
<!-- /ANCHOR:log -->
