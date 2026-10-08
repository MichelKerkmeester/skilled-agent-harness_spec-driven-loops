---
title: "Goal: Phase 6 evidence-gated-provenance"
description: "Make template version stamping evidence-gated so no document receives a version stamp without exact anchor signature match proof."
trigger_phrases:
  - "phase 6 evidence gated provenance goal"
  - "packet goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/006-evidence-gated-provenance"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Phase built and verified"
    next_safe_action: "Commit with wave 2"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/quality-audit.sh"
      - ".skilled/skills/system-spec-kit/templates/MIGRATION.md"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/heal-provenance.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 6 evidence-gated-provenance

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make provenance stamping evidence-gated: retire `--auto-upgrade`, and let heal-spec-docs stamp a template header only on an exact match against the anchor set rendered for the document's level, so no document receives invented history.

### Decisions

Frozen choices, decided 2026-10-08 by the operator. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `check-template-staleness.sh --auto-upgrade` is retired. For one release the flag prints "removed, use upgrade-legacy" and exits 2 |
| D2 | The dead `quality-audit.sh --fix` branch is removed or pointed at upgrade-legacy |
| D3 | heal-spec-docs stamps only on exact equality with the anchor set rendered for the document's level |
| D4 | No marker or comment is added to unknown-provenance documents |
| D5 | Built in wave 2 by DeepSeek V4.1 Flash max through cli-pi on the OpenCode Go route: `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 PI_BLACKHOLE_PASSIVE=true pi -p "<brief>" --model opencode-go/deepseek-v4.1-flash --thinking max --mode text --offline </dev/null`. One task from tasks.md per brief, in task order, and the diff is checked before the next brief |
| D6 | Reviewed read-only by Luna max fast through cli-codex with `--sandbox read-only`. The builder applies a finding only after confirming it in the code, for at most two rounds |
| D7 | The builder writes only the files in spec.md Files to Change, its tests and this folder. The orchestrator reverts any other write |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] A Vitest case runs `check-template-staleness.sh --auto-upgrade` on a fixture and sees "removed, use upgrade-legacy", exit code 2 and an unchanged file
- [x] A Vitest case shows heal-spec-docs stamps an exact level match and refuses a superset and a subset, exit code 0
- [x] `rg -n "auto-upgrade" .skilled/skills/system-spec-kit/runtime/cli/spec/quality-audit.sh` finds nothing
- [x] MIGRATION.md states the never-invent-history rule, verified by grep
- [x] `validate.sh --strict` on this packet prints RESULT: PASSED

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
| Planning documents written | Done | spec.md, plan.md, tasks.md, acceptance-criteria.md, implementation-summary.md all completed; repair-derived and goal checks passed after goal.md creation |
| `--auto-upgrade` retired | Done | `check-template-staleness.sh:39` prints "--auto-upgrade was removed, use upgrade-legacy" and exits 2; the `AUTO_UPGRADE` variable and the `sed -i ''` bump are gone; `bash -n` exits 0 |
| `quality-audit.sh --fix` | Done | Branch removed, flag exits 2 with a pointer; `rg -n "auto-upgrade" quality-audit.sh` finds nothing, rc 1 |
| Healer stamps only on an exact level match | Done | `TEMPLATE_SIGNATURES` and `matchesSignature` removed; `provenMarker` compares the required plus optional anchors of the level's contract and reads the header from the rendered template |
| MIGRATION.md rule | Done | Section 4 "NEVER INVENT PROVENANCE" at `MIGRATION.md:51`; `grep -i invent` finds it |
| Provenance tests | Done | `heal-provenance.vitest.ts`: 4 passed; the stamp case failed against the HEAD healer; with `create-root-numbering.vitest.ts` the pair reported 19 passed after the review fixes |
| Cross-family review | Done | Luna round 1: two P1 and two P2; three applied, one not applied (see below) |
| Wave 2 full gates | Done | cli suite rc 0 with 1,682 passed against a 1,639 baseline; `run check` and typecheck rc 0; hook tests 184 run, 181 pass, 0 fail |
| Validate changes | Done | `validate.sh --strict` prints `RESULT: PASSED`; `check-goal.cjs` passes |

### Deviations and findings

| Item | Note |
|------|------|
| Auto-upgrade decided | 2026-10-08, the operator chose to retire the flag. Restricting it was considered because outside scripts might pass it, and rejected because with no version bump the flag has nothing left to write. The one-release loud failure covers outside callers |
| Unknown-provenance marker decided | 2026-10-08, the operator chose no marker, because adding one is the rewrite MIGRATION.md forbids |
| Level-aware comparison | The healer's fixed signatures listed only Level 1 spec anchors, so the exact comparison uses the level's rendered anchor set, and the header it writes is read from that rendered template |
| `--fix` made loud | The plan allowed removing the branch or repointing it. The build removed it and also made the flag exit 2 with a pointer, matching `--auto-upgrade`. Recorded in spec.md section 10 |
| Local copy of the gate walk | `evaluateTemplateGate` and `renderManifestTemplate` are not exported from `template-structure.js`, so the healer mirrors them. Follow-up: export and reuse |
| Review F1 applied | The healer did not read a YAML `level:` key; `declaredLevel` now follows the validator's precedence and a fourth test pins it |
| Review F2 applied | The healer's gate grammar did not match the renderer's case rules; it is now identical to `evaluateTemplateGate` |
| Review F3 applied | The retired-flag fixture now carries a `plan-core \| v1.0` marker, so "unchanged" proves no bump happened |
| Review F4 not applied | No test pins the MIGRATION.md prose. The criterion is verified by grep, and a prose test is low value |
| REQ-003 and AC-003 reading | A markerless document that matches its level exactly is still named, per REQ-001 and the edge cases. The AC-003 Given clause now says old-marker documents and markerless documents that fail the exact check |
| AC-005 search command | The original `rg "auto-upgrade" .skilled` also matches unrelated text, so the row now searches for `--auto-upgrade` outside specs/ |
| Tests pin plan.md only | The other three document types and an old-marker document through the healer were traced by hand in a scratch copy, not pinned. Recorded as a follow-up |
<!-- /ANCHOR:log -->

---

