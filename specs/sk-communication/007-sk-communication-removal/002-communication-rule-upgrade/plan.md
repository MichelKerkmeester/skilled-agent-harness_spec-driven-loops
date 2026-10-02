---
title: "Implementation Plan: Phase 2: communication-rule-upgrade"
description: "Make the communication rules directly handle a plain-language re-render and prevent terse machine-register prose at the sentence source. Keep the Human Voice Rules as the wording authority and change only root trigger text that became false."
trigger_phrases:
  - "communication rule implementation plan"
  - "plain-language reply instruction"
  - "sentence-level communication guidance"
  - "rule upgrade verification"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: communication-rule-upgrade

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, shell and Node.js repository checks |
| **Framework** | Repository communication rules routed by `REPO RULES.md` and expanded by `AGENTS.md` |
| **Storage** | Version-controlled rule and routing documents; no application data store |
| **Testing** | Semantic review, `git grep`, mirror checks, trigger-index freshness, Vitest and sk-doc script tests |

### Overview
Update `communication.md` §4 with a direct plain-language re-render contract that retains every claim, number and caveat and keeps protected spans byte-exact. Add sentence-level guidance in `communication-prose.md` so plain, complete wording is the default at the source. Preserve the Human Voice Rules as the single detailed wording authority, and edit `REPO RULES.md` or `AGENTS.md` only where a sentence became false.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 1's deleted runtime surfaces and advisor mechanism have been checked.
- [x] The Human Voice Rules path resolves and remains the wording authority.
- [x] Current `communication.md` §4, `communication-prose.md`, `REPO RULES.md` and `AGENTS.md` are read before any edit.

### Definition of Done
- [x] All acceptance criteria are met with observed command output and exit status.
- [x] The scoped live-reference grep finds no dead runtime consumer; its sole expected match is the retained prompt-set pointer to an existing historical specification.
- [x] Mirror, advisor, trigger-index and touched sk-doc tests pass with recorded output and exit status.
- [x] The recursive strict validator prints `RESULT: PASSED` with 0 errors and 0 warnings.
- [x] `AGENTS.md` and `REPO RULES.md` contain no unrelated scope changes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Put the reply behavior in the rule that owns whole-reply delivery, place source-level prose guidance in the sentence rule and retain one external-to-these-rules authority for detailed wording standards.

### Key Components
- **`communication.md` §4**: Direct plain-language re-render instruction, content-preservation contract and reference to the Human Voice Rules.
- **`communication-prose.md`**: Sentence-level guidance that stops clipped machine output before it reaches a reply.
- **`REPO RULES.md`**: Trigger routing corrected only if a row points at behavior that no longer exists.
- **`AGENTS.md` §8**: Root communication wording corrected only where its existing sentence became false.
- **Human Voice Rules** (`.skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md`): Read-only wording authority; do not duplicate its rubric.

### Data Flow
A reader signals that wording is too terse or unclear. The communication rules govern the re-render directly and preserve claims and protected spans; the sentence-level rule guides ordinary prose at creation time. The Human Voice Rules supply the detailed standard from their existing owner.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This work changes shared policy and its routing, so the consumer inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/repo-rules/communication.md` §4 | Directs readers to the deleted skill and command | Replace with rule-owned plain-language re-render and preservation instruction | Read §4 and verify each required preservation term |
| `.skilled/repo-rules/communication-prose.md` | Governs sentence construction and plain words | Add source-level guidance against terse machine-register prose | Read the sentence/word guidance and review a terse example against it |
| `REPO RULES.md` communication trigger rows | Routes actions to communication rules | Change only a row made false by feature removal | Compare scoped diff against the current routing table |
| `AGENTS.md` §8 | Carries root-level communication requirements | Change only a sentence made false by feature removal | Compare scoped diff against §8 and retain true rules |
| Human Voice Rules | Owns the detailed wording standard | Read only; keep as one authority | Confirm file exists and rule references resolve to it |
| Historical specs outside this authorized packet and historical changelogs | Record prior work | Leave untouched | `git -c core.fsmonitor=false diff --name-only ecf2897455 -- specs ':(exclude)specs/sk-communication/007-sk-communication-removal/**' ':(glob)**/changelog/**' ':(exclude).skilled/changelog/sk-communication/**'` prints nothing |

Required inventories:
- Same-class sources: `rg -n 'plain-language|preserve|protected span|Human Voice Rules|hvr-rules' .skilled/repo-rules/communication.md .skilled/repo-rules/communication-prose.md .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md` to ensure the rules refer to, rather than reproduce, the standard.
- Consumers of changed references: run git grep with generated retrieval snapshots (runtime/data/trigger-index.json, corpus-manifest.json, generation-diagnostics.json, phrase-variants.json) excluded. The sole expected match is prompt-set.json:84, an existing pointer to a historical decision record whose target remains present.
- Matrix axes: source surface (whole-reply rule, sentence rule, root routing) by obligation (plain language, claim fidelity, protected spans, source-of-truth link); verify each applicable cell without widening unrelated behavior.
- Algorithm invariant: no runtime algorithm is introduced; the textual invariant is that re-rendering changes wording only while claims, numbers, caveats and protected bytes stay intact.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Advisor route-exclusion behavior retained after the empty-list update | `npm --prefix .skilled/skills/system-skill-advisor/runtime test -- tests/route-exclusions.vitest.ts` |
| Integration | Live references, mirror parity, generated trigger index and packet structure | Commands listed in `acceptance-criteria.md` |
| Manual | Read new rule sections against a caveated reply, protected spans and the HVR source; inspect root-rule diff for false-only edits | `sed`, `rg` and `git diff ecf2897455 -- ...` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 removal and route checks | Internal | Complete | The final live-reference sweep and route checks passed |
| Human Voice Rules source | Internal | Retained | Without it, the wording-standard ownership boundary is unclear |
| Trigger-index generator and fixture owner | Internal | Complete | Regeneration and freshness check passed; no dependency remains |
| Advisor route-exclusions Vitest package | Internal | Retained | The empty-list routing contract cannot be verified |
| sk-doc test runner and touched test files | Internal | Retained | Active documentation-routing cleanup lacks test evidence |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The new instruction loses content or alters protected bytes, the sentence rule fails to prevent terse output, or a root trigger change alters behavior that remains valid.
- **Procedure**: Restore only the affected communication or router document from `ecf2897455`, preserve concurrent work outside those paths, then rerun the live-reference, mirror, trigger-index, focused test and recursive validation commands.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Read source rules and HVR ──► Update whole-reply contract ──┐
                              Update sentence rule ─────────┼──► Root trigger review ──► Final checks
                              Inspect AGENTS/REPO RULES ────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Source review | Phase 1 paths, current rules and HVR | Rule edits |
| Whole-reply and sentence-rule updates | Source review | Root trigger review |
| Root trigger review | Exact changed rule behavior | Final global gates |
| Final checks | Rule edits and orchestrator index/test work | Packet closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20-30 minutes to compare owners and current trigger wording |
| Core Implementation | Medium | 1-2 hours for two rules and conditional router edits |
| Verification | Medium | 45-90 minutes for semantic review, tests and strict recursive validation |
| **Total** | | **2.5-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] List only the affected rule and router paths before restoring any file.
- [ ] Confirm no data migration, runtime dependency or deployment change is introduced.
- [ ] Keep the HVR source and all historical specs/changelogs outside rollback scope.

### Rollback Procedure
1. Restore only the affected communication rule or root routing file from `ecf2897455`.
2. Re-read `communication.md` §4 and `communication-prose.md` to confirm the prior contract is restored.
3. Rerun the live-reference and mirror checks, then regenerate and check the trigger index if frontmatter changed.
4. Rerun the advisor and touched sk-doc tests plus recursive strict validation.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Not applicable; this phase changes repository documentation only.
<!-- /ANCHOR:enhanced-rollback -->

---
