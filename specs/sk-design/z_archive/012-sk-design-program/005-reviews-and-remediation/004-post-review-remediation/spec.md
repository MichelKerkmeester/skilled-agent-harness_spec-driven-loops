---
title: "Spec: Post-Review Remediation of the sk-design Remediation Program"
description: "Remediate the verified findings from the 017 GPT-5.6-SOL review: fix stale _db/_engine path references in the styles playbook, the database README, the 015 parent phase-map, and the graph-metadata key_files pointers left behind by the 005 restructure. Documentation/metadata only; no shipped code behavior changes."
trigger_phrases:
  - "post review remediation stale db engine paths"
  - "017 review findings fix playbook readme phase-map"
  - "graph-metadata key_files pointer restructure remediation"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/005-reviews-and-remediation/004-post-review-remediation"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "remediation"
    recent_action: "Fixed stale _db/_engine doc + pointer references; refuted P1-006."
    next_safe_action: "Validate + commit; operator decides the P1-006 design question."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/docs/manual-testing-playbook.md"
      - ".opencode/skills/sk-design/styles/lib/database/README.md"
      - ".opencode/specs/sk-design/012-sk-design-program/002-style-database/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-012-sk-design-program/005-reviews-and-remediation/004-post-review-remediation-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: Post-Review Remediation of the sk-design Remediation Program

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-post-review-remediation |
| **Level** | 1 |
| **Status** | Complete |
| **Verification** | 0 residual dead refs in the flagged files; 4 edited packets validate `--strict` 0 errors; no code changed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The `017` GPT-5.6-SOL review confirmed a single root cause against the code: the `005-library-restructure`
renamed `_db → lib/database` and `_engine → lib/engine`, but several current-state documents and metadata
pointers were never updated. This packet remediates those references. It changes **no shipped code
behavior** and preserves all historical records.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope (the verified findings):**
- **P1-002** — `styles/docs/manual-testing-playbook.md` execution paths + test globs.
- **P1-003** — `015-styles-database-evolution/spec.md` phase-map (`001`/`005`/`006` `Planned`→`Complete`) + parent continuity.
- **P1-004** — `styles/lib/database/README.md` operator commands + tree references.
- **P1-005 (dead paths)** — the `key_files` continuity pointers in `015/001`/`015/004`; regenerated graph-metadata for `012`/`015`/`001`/`004`.

**Out of scope (and why):**
- **Historical prose** (`_db` in Files-Changed tables, scope/evidence citations) is preserved — it records what each packet did at its time.
- **P1-005 status half** — `derived.status` is generator-owned; its misfires are a generator-derivation concern, not durably hand-fixable.
- **P1-006** — refuted after code+test verification (the `requery-required` path is reachable and tested; the flagged line is a deliberate safe-degradation). No code change.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001** — Zero residual `_db`/`_engine` references in the styles playbook, the database README, and the three flagged graph-metadata files; every rewritten path resolves to a real on-disk file.
- **REQ-002** — The `015` phase-map reflects true child status (shipped `Complete`, unbuilt `Planned`); historical prose untouched.
- **REQ-003** — No shipped code file modified; the `design-audit` contract is unchanged.
- **REQ-004** — The four edited packets validate `--strict` with 0 errors.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `grep` for `_db`/`_engine` in the playbook + README returns 0; the 3 flagged graph-metadata files carry 0 dead paths.
- The four edited packets (`012`, `015`, `015/001`, `015/004`) report `Errors: 0` under `validate.sh --strict`.
- The commit stages docs + metadata only — no `.mjs`/`.ts`/`.js` files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|-----------|
| Falsifying history by rewriting Files-Changed tables | Scope path edits to `key_files` continuity + user-facing current-state docs only |
| Replacing stale refs with wrong new paths | Verify every rewritten path resolves to a real on-disk file |
| Altering intentional shipped behavior (P1-006) | Verify reachability + tests first; refute rather than fix |
| Concurrent branch churn | Fresh worktree at origin tip; conflict-free add-only packet |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **P1-006 design question:** whether post-query generation drift in `design-audit/comparison-lane.mjs`
  should also route to `requery-required` (it currently safe-degrades to `no-fit`) is a deliberate design
  decision for the operator, not a defect.
<!-- /ANCHOR:questions -->
