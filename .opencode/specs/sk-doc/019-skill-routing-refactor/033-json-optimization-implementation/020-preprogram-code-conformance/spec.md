---
title: "Feature Specification: Pre-Program Code Conformance"
description: "Fix the four code-conformance findings the audit raised against lines this program never touched — an ephemeral label in a code comment, a misplaced strict-mode directive, a manifest path join without a containment guard, and missing JSDoc on exported functions."
trigger_phrases:
  - "pre-program code conformance"
  - "ephemeral label in code comment"
  - "strict mode directive placement"
  - "manifest path containment guard"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/020-preprogram-code-conformance"
    last_updated_at: "2026-07-30T11:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase spec"
    next_safe_action: "Begin execution per plan.md"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/020-preprogram-code-conformance"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether the comment-hygiene gate should be extended to catch bare packet numbers, or whether the doctrine is deliberately broader than the gate, is a policy question for the gate's owner"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Pre-Program Code Conformance

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P3 |
| **Status** | Planned |
| **Created** | 2026-07-30 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor/033-json-optimization-implementation` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

These four findings are real, and none of them belongs to this program.

The independent reviewer established by line-blame that every one of them lands on code outside the program's commit range — one file appears in no program commit at all, and two had already been raised and closed by an earlier review. The recommendation was to move them to a backlog rather than carry them here. They are scoped into this packet anyway, deliberately, because the instruction was to fix all findings and a backlog with no owner is how findings disappear. The phase records their provenance so the record stays honest about who introduced them.

Two of the four are smaller than the audit rated them. The ephemeral packet label in a code comment violates the written doctrine, but the repository's own enforcement tool returns clean on that file — none of its violation patterns matches a bare packet number. That gap between doctrine and gate is more interesting than the comment itself, and nobody reported it. The strict-mode directive sits below the header prose rather than immediately after the box as the style guide requires, but it remains the first statement in the file, so strict mode is genuinely active; the defect is cosmetic.

The remaining two carry more weight. Hub manifest generation joins an authored packet path to the skill directory without the containment guard its standalone counterpart uses, so a registry entry could enumerate resources outside the skill root. The input is authored in-repo rather than attacker-supplied, which caps the severity, but the cited standard does require the guard. And several exported functions across four modules lack the JSDoc the standard requires.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope — removing the ephemeral label from the code comment while keeping the durable reason it was recording; moving the strict-mode directive to its required position; adding the containment guard to hub manifest generation to match the standalone path; adding the missing JSDoc to the exported functions the audit named; and recording the doctrine-versus-gate divergence the comment-hygiene finding exposed.

Out of scope — extending the comment-hygiene enforcement tool, which belongs to that tool's owner and is recorded here as a referral rather than done here; the path-containment finding the reviewer refuted, whose sink is a boolean existence check that opens nothing; and every finding owned by a sibling phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No ephemeral artifact label remains in the flagged code comment | The packet reference is gone and the comment states the durable reason the check exists, so the next reader gains the rationale without inheriting a pointer that rots. The repository's comment-hygiene tool still returns clean |
| REQ-002 | The strict-mode directive sits where the style guide requires | The directive immediately follows the boxed header, matching the sibling modules that already comply, and the module's behaviour is unchanged |
| REQ-003 | Hub manifest generation validates containment before enumerating | The authored packet path is checked to resolve inside the skill root before it is walked, matching the guard the standalone path already applies. A path escaping the root is rejected, proven by a test that supplies one |
| REQ-004 | The exported functions the audit named carry JSDoc | Each named export documents its parameters and return value per the standard. Functions beyond those named are out of scope, so the change stays reviewable rather than becoming a directory-wide sweep |
| REQ-005 | Provenance is recorded rather than implied | The phase records that all four findings predate this program, with the evidence that establishes it, so a future reader does not attribute them to the program that fixed them |
| REQ-006 | The doctrine-versus-gate divergence is referred, not silently absorbed | The gap — that the enforcement tool passes a comment the written doctrine forbids — is written down and referred to the gate's owner. Fixing the one comment without recording the gap leaves every other instance undetected |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

The flagged comment carries its durable reason without the ephemeral label and the hygiene tool stays clean; the strict-mode directive sits in its required position with behaviour unchanged; hub manifest generation rejects a path escaping the skill root, proven by a test that supplies one; the named exports carry JSDoc; the pre-program provenance of all four is recorded with evidence; and the doctrine-versus-gate divergence is referred to the gate's owner in writing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Adding a containment guard could reject a packet path that is legitimately unusual and currently works | REQ-003 requires the guard to match the standalone path's existing semantics rather than inventing stricter ones, and the full manifest generation is run across every hub before the change is accepted |
| Risk | The JSDoc requirement expands into a directory-wide sweep that buries the real fixes in noise | REQ-004 bounds the change to the exports the audit actually named; broader coverage is a separate concern |
| Risk | Fixing code outside the program's range blurs the record of what this program did and did not cause | REQ-005 makes provenance an explicit deliverable rather than something a reader has to reconstruct from line blame |
| Risk | Moving the strict-mode directive in a file another session is editing produces a conflict | The change is one line in one file and is landed separately from the containment work, so a conflict is trivial to resolve |
| Dependency | None. This phase is independent of every sibling and can run at any point | — |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Whether the comment-hygiene gate should be extended to catch bare packet numbers, or whether the written doctrine is deliberately broader than what the gate mechanically enforces, is a policy question for that gate's owner and is referred rather than decided here.
<!-- /ANCHOR:questions -->
