---
title: "Implementation Plan: Phase 5: source-resolver"
description: "A warn-only validate.sh rule resolves [SOURCE: path:line] tags in new research and review artifacts through sk-doc's citation resolver, behind a creation-date cutoff."
trigger_phrases:
  - "implementation plan"
  - "source tags rule plan"
  - "source tag cutoff"
  - "citation resolver reuse"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: source-resolver

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash rule, Node ESM helper |
| **Framework** | spec-kit validator registry and orchestrator |
| **Storage** | None; the rule writes nothing |
| **Testing** | Vitest fixtures in a throwaway git repository, plus a 20-packet before and after comparison |

### Overview
A new rule, `SOURCE_TAGS`, reads the `path:line` citations inside `[SOURCE: ...]` tags in a packet's `research/` and `review/` artifacts and resolves each one with `resolveCitation` from sk-doc's `cite-drift-scan.mjs`. It warns on a gone file, a moved file (naming its new path), a line past the end, or a match by file name only. It runs only on packets created after `SPECKIT_SOURCE_TAG_CUTOFF`, so no existing packet sees it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] D2 approved by the operator in phase 002, with the cutoff precedent named
- [x] The phase 004 resolver exported and tested
- [x] The 20 comparison packets chosen and validated before the rule existed

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Fixture tests passing, CLI suite at its baseline
- [ ] Docs updated: the rule reference, both env tables, the writer prompts and the command notes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Registry shell rule plus a helper, the same shape as `FRONTMATTER_VALUES` from phase 003.

### Key Components
- **`check-source-tags.sh`**: the rule. Runs the helper, turns its records into `RULE_STATUS`, and states in every message that a pass proves existence only.
- **`check-source-tags-helper.mjs`**: finds the tags, applies the cutoff, builds the file set and calls the shared resolver. It holds no resolution logic of its own.
- **`cite-drift-scan.mjs`** (sk-doc, unchanged here): `CITATION_RE`, `FENCE_RE`, `listTrackedFiles`, `loadRedirects`, `resolveCitation`.

### Data Flow
Packet folder, then the `Created` date against the cutoff, then every `.md` under `research/` and `review/` except `prompts/`, then the `[SOURCE: ...]` spans outside fences, then each `path:line` inside them through `resolveCitation` with the packet folder as an extra base. Untracked files outside `.gitignore` join the tracked set, so a packet can be checked before its first commit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `validator-registry.json` | Lists the rules the orchestrator runs | Add `SOURCE_TAGS` at warn | Registry count test, now 42 |
| `README.md`, `ARCHITECTURE.md` | State the registry size | 41 to 42 | `validator-registry-doc-count.vitest.ts` |
| Deep-research and deep-review prompt packs | What the iteration writer reads | One paragraph naming the check | Contracts regenerated; contract and prompt-pack tests |
| `/speckit:plan`, `/speckit:complete` assets | Teach the citation format | One line naming the check | YAML parses; their tests pass |
| `/doctor:deep-loop` | Reports deep-loop health | Per-lineage tag summary | `route-validate.sh` and its tests |
| `validation-rules.md`, both env tables | Rule and flag references | New section and rows | `env-reference-drift.vitest.ts` |

Algorithm invariant: a tag is reported only when the resolver says it does not resolve in range. In range and refused stay silent. Adversarial cases in the fixtures: a fenced example, a `prompts/` file, a URL tag, a prose tag, a packet-root path from a lineage folder, an uncommitted target, a malformed cutoff, and a machine-wide gitignore that hides `specs/`.
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
| Unit | Helper verdicts and the shell rule's messages | Vitest, `tests/check-source-tags.vitest.ts` |
| Integration | 20 existing packets, default cutoff and cutoff forced to 2000 | `scratch/p005_capture.py` |
| Manual | The rule on this packet's own research phase with the cutoff lifted | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 004 resolver and redirect table | Internal | Green | The rule would need its own resolver, which REQ-004 forbids |
| D2 in the phase 002 decision record | Decision | Green, approved | No product change without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the rule warns on packets it should skip, or slows validation noticeably.
- **Procedure**: remove the `SOURCE_TAGS` entry from `validator-registry.json` and set the counts back to 41. The helper and docs can stay; nothing runs them.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 004 resolver | Core |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | Phase 007 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Baseline of 20 packets, about 15 minutes of runtime |
| Core Implementation | Medium | Rule, helper, registry, docs |
| Verification | Medium | Fixtures, two comparison passes, CLI suite |
| **Total** | | **One session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes; the rule writes nothing
- [x] Cutoff flag documented in both env tables
- [ ] Monitoring alerts set: not applicable to a local validator

### Rollback Procedure
1. Remove the registry entry.
2. Set the two registry counts back to 41.
3. Rerun the count test and the 20-packet comparison.
4. Not user-facing beyond the warning itself.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
