---
title: "Tasks: Docs and Standards Alignment for the Advisor Refinements"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "docs alignment tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Docs and Standards Alignment for the Advisor Refinements

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run comment hygiene on every code file phases 2 to 5 changed. Evidence: `python3 .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh <file>` over 35 files: 31 clean, 0 violations, 4 workflow YAML files skipped by the checker; their added comment lines were scanned by hand for ids and none were found.
- [x] T002 Run the sk-code drift guards. Evidence: `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` exit 0, both guards PASS, no warning names a phase 2 to 5 file.
- [x] T003 Checklist audit of the added lines by MiMo v2.6 Pro high, read-only, and an orchestrator check of each finding. Evidence: 1 P1 and 6 P2 reported; the P1 confirmed at `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:262`; the P2 line-length items confirmed and deferred, reasons in `implementation-summary.md`.
- [x] T004 Document inventory by MiMo against the facts sheet, read-only, and an orchestrator check of each "wrong" item. Evidence: four "wrong" items confirmed in code, including the transport-down playbook's `hello` prompt, which the prompt gate declines (`shouldFireAdvisor("hello")` returns `short_casual_acknowledgement`).
- [x] T005 Record the validator baseline. Evidence: every target document `validate_document.py` exit 0; catalog packages system-skill-advisor 9 warn 0 fail and system-spec-kit 84 warn 0 fail; playbook packages 0 violations each.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 [P] Feature-catalog leaves: Claude hook, OpenCode plugin, `advisor_recommend`, skill-advisor CLI (`feature-catalog/hooks-and-plugin/`, `feature-catalog/cli-surface/`). Evidence: each changed sentence checked against its code, for example the parity test path against `runtime/tests/hooks/runtime-parity.vitest.ts` and the retry against `skill-advisor-cli.ts:1424-1437`.
- [x] T007 [P] Pi prompt advisor catalog leaf and its root row (`feature-catalog/hooks-and-plugin/pi-prompt-advisor.md`, `feature-catalog/feature-catalog.md`). Evidence: the leaf places the fallback below the user's prompt text, which matches the code, and the root counts read 43 features, 5 in hooks-and-plugin.
- [x] T008 [P] system-spec-kit catalog leaves for directive dedup and the CLI hook fallbacks (`.skilled/skills/system-spec-kit/feature-catalog/`). Evidence: outage, stale and skipped heads checked against `runtime/lib/render.ts:455-497`. The warm-only claims were rewritten to the bounded cold start at `skill-advisor-cli.ts:24-28`. A follow-up brief cleared the frontmatter, the H3, the source role and the root description.
- [x] T009 [P] Playbook scenarios CL-001 and 433 (`manual-testing-playbook/`). Evidence: 433 was run by hand in a `/tmp` sandbox before its brief. The work prompt passes the gate, the 300 ms budget gives the outage head and `hello` gives `Advisor: prompt skipped.`. A follow-up brief removed the false OpenCode `user-prompt-submit` claim.
- [x] T010 [P] READMEs: advisor skill, hook folders, runtime and test folders, spec-kit hook adapters, OpenCode plugins, repository front page. Evidence: the shim default checked against spec-kit `hooks/claude/user-prompt-submit.ts:104-116`, the runtime labels against `hooks/{codex,cursor,devin}/shared.ts`, the three test files by `ls`, the plugin fallback against `.opencode/plugins/system-skill-advisor.js:68-84,1319-1330,1403-1426`, and `thanks` against `CASUAL_ACKNOWLEDGEMENTS`.
- [x] T011 [P] Deep-review completion rule for fan-out runs (`.skilled/skills/system-deep-loop/deep-review/SKILL.md`). Evidence: `deep-review-auto.yaml:2419` requires the root dashboard only when no lineage state log exists.
- [x] T012 Pi budget: named default and the hook's positive-integer parse, with a test (`.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`). Evidence: `npx vitest run tests/hooks/prompt-advisor.vitest.ts` 11 of 11 pass. The negative control, with the fix reverted, fails only the new test: the fallback fires at 208 ms. `npm run typecheck` exit 0.
- [x] T013 Recheck `hooks/skill-advisor-hook.md` and `ARCHITECTURE.md` against the facts sheet and update what is stale. Evidence: both edited after the phase 6 review closed, and each changed sentence checked against the facts sheet's code lines.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Read every MiMo diff and check each changed sentence against its cited code. Evidence: all 21 writer diffs read. Three follow-up briefs fixed what the first pass left stale or false: warm-only wording in the fallback leaf, its root entry and the transport-down scenario, a false OpenCode `user-prompt-submit` claim, a doubled period, and the README's Pi fallback phrase.
- [x] T015 Rerun every validator from the baseline and record the delta. Evidence: `validate_document.py` exit 0 with 0 issues on all 26 edited documents. Catalog packages: system-skill-advisor 9 warn to 8 warn, system-spec-kit 84 warn to 84 warn, 0 fail in both. Playbook packages 0 violations in both, unchanged.
- [x] T016 Rerun comment hygiene and the drift guards on the final tree. Evidence: hygiene exit 0 on both code files changed since T001, drift guards 2 of 2 PASS, `npm run typecheck` exit 0. The advisor suite reports 949 passed, 1 failed, 6 skipped against a baseline of 947 passed and 2 failed. The one failure is the routing-divergence ratchet (`rr-iter3-093`), which failed at baseline too and involves no file this phase changed.
- [x] T017 Run `validate.sh --strict --recursive` on the packet and require `RESULT: PASSED`. Evidence: exit 0, all eight folders `RESULT: PASSED` with 0 errors and 0 warnings, after `repair-derived.cjs --apply` refreshed the stale graph fingerprints.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
