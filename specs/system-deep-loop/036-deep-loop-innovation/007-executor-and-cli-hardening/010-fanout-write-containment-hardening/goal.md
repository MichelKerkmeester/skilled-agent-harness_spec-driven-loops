---
title: "Goal: harden fan-out write containment for shared checkouts"
description: "The durable directive: a fan-out lineage must never destroy work it cannot prove it wrote, and a finished lane must keep its outcome."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening"
    last_updated_at: "2026-09-13T12:00:00Z"
    last_updated_by: "operator-session"
    recent_action: "Amended the durable decisions with the worktree default flip and its isolation tally (ADR-004)"
    next_safe_action: "None; signed off 2026-09-13; observe degraded counts on real-executor runs"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "acceptance-criteria.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-045-fanout-write-containment-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Whether the churn threshold of twelve newly-dirty out-of-lineage tracked paths per heartbeat is the right number — yes; REQ-004 carries the justification for both default thresholds"
      - "Whether the runner's ephemeral worktree lane is acceptable outside sk-git's numbered namespace — accepted; the lane is runner-owned and unnumbered (D5), and ADR-004 turned its default on"
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: harden fan-out write containment for shared checkouts

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the deep-loop fan-out guard preserve rather than destroy what it cannot attribute, keep a finished lane's outcome, and never halt a lane because of another session's writes.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Preserve-and-quarantine is the default remedy. Restore is opt-in through a runner flag and a config field, documented as safe only on a single-operator checkout. |
| D2 | Detection is unchanged: scope rules, unattributable carve-outs, symlink-escape handling and the regenerable-state exemption stay; this packet changes the remedy. |
| D3 | Under restore, a path dirty before dispatch returns to its pre-dispatch bytes, never to HEAD; the baseline stores content, bounded at 2 MiB per file and 64 MiB per lane. |
| D4 | A lane with complete artefacts and containment findings settles as completed with advisory, not failed; containment findings never overwrite a lane's verdict. |
| D5 | Superseded by D7: lineages ran in detached ephemeral worktrees. |
| D6 | Superseded by D7: isolation became opt-in first (ADR-006). |
| D7 | Attribution is not a requirement. Worktrees, the cone and their phases are removed; a neighbour's untracked write is advisory under preserve, never fatal (ADR-007). |
| D8 | Each defect the research surfaced is a phase, fixed by DeepSeek V4.1 Flash max via the gateway on cli-pi, one dispatch per phase, suite-verified before the next. |
| D9 | After remediation, phase 014 runs a 15-iteration alignment review (sk-code and OpenCode, feature catalog and playbooks, SKILL.md against references and assets, deep-loop commands and agents, architecture) against the repo rules; executors by fallback: DeepSeek V4.1 Flash max on cli-devin, LUNA max fast on cli-codex, DeepSeek V4.2 Flash max on cli-pi via the gateway. |

### Operator copy

The operator's copy judges completion, not this file. Resend this file in chat
whenever anything above the log changes.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase**; decisions above outrank it.

Phases 001 through 014 under this folder, each with its own `goal.md`: 008 to 013 remediate the first review, 014 is the alignment review.
<!-- /ANCHOR:binding -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] A default-run lane writing outside its lineage directory leaves every such file byte-identical, proven by a hashing test
- [x] A quarantine directory after such a lane holds the manifest, the content and the patch against HEAD
- [x] A complete lane with containment findings settles as completed with advisory, counted separately in the summary
- [x] A worktree-option fan-out completed against an uncommitted packet with every lineage in the main checkout and no worktree left
- [x] The deep-loop runtime Vitest suite exits zero, incident reproduction included
- [x] No command YAML or documentation surface still describes the revert-and-fail model
- [x] Every phase 001 through 007 validates PASSED with its criteria checked
- [x] The suite exits zero after the last phase lands
- [x] Each confirmed P0 and P1 review finding is closed by a phase, and a fresh review of the remediated tree has no active P0
- [x] The 15-iteration alignment review has run and each confirmed finding is bound to a phase or recorded as reviewed
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
| Packet authored at Level 3 | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `decision-record.md`, `goal.md` |
| Guard, runner and test suite read end to end | Done | `runtime/lib/deep-loop/write-containment.ts` 786 lines, the runner's containment block, `runtime/tests/unit/write-containment.vitest.ts` 1,331 lines |
| Incident evidence confirmed | Done | The `failed` event for label `luna` names 1,858 reverted paths; the research run record says the artefacts were complete |
| Implementation | Done | Preserve-by-default containment, per-lineage worktrees, concurrent-editor detection, the worktree default flip with its isolation tally, and the report-only checkout watch for isolated lanes whose cwd stays in the shared checkout; packet docs reconciled |
| Fix phases 001 to 007 | Done | Commits `5340e39233`, `bcb1333560`, `4581feb2bd`, `65ea476de3`, `a766c23a8f`, `cbb1e4ae53`, `ca713e3478`, each suite-verified; final suite 151 files, 2568 passed, exit 0; live two-lane run on this checkout with a neighbour and another session writing mid-run: both lanes fulfilled, nothing reverted |
| Deep review, 10 iterations | Done, verdict FAIL | Five LUNA at max fast on cli-codex, five DeepSeek V4.1 Flash at max on cli-pi, merged strongest-restriction: one P0 per lane, seven P1, twenty-one P2; verified findings bound to phases 008 to 013, parent doc findings fixed directly; `review/fanout-attribution.md` |
| Remediation 008 to 013 | Done | Commits `47bdca586a`, `efe974e6f0`, `2ba05e1a28`, `52959f1065`, `df7a1a2cf4`, `57c02b8592`, each suite-verified |
| Fresh review | Done, CONDITIONAL, P0 0 | LUNA 3 + DeepSeek 3 on cli-pi; residue bound to phase 015 (`02548faa76`) |
| Alignment review, 15 iterations | Done, CONDITIONAL, P0 0, P1 7 | Three cli-devin DeepSeek lanes of five, no fallback used; findings bound to phases 016 to 020 (`43d9f4a8ab`, `95b90296d2`, `45188c98ec`, `67b2171d03`, and this commit); three recorded as reviewed in `014-alignment-review/goal.md` |

### Deviations and findings

| Item | Note |
|------|------|
| The existing patch directory is `containment-reverted/`, not `containment/quarantine/` | The specification adds the quarantine tree and keeps the old directory for the restore path, so operators following current documentation still find what it names |
| The runner checks containment before artefact validation | This is why a complete lane never reached the code that would have called it complete; the outcome-separation phase reorders it rather than adding a special case |
| The guard's own comments already describe this failure mode | The module documents that a HEAD restore silently discards a concurrent session's work; the incident was a known risk that had never been acted on |
| Worktree isolation became the default (ADR-004) | The operator decided the flip on the delivered evidence. The per-attempt tally reports tree provisioning, not confinement: while a lane is isolated, containment watches its tree, and a flag-lever kind keeps its process cwd in the checkout |
| The checkout gap ADR-004 named is closed (ADR-005) | The operator directed the watch be built here. An isolated attempt whose process cwd stays in the checkout is snapshotted and diffed there; a change is reported as `checkout_write_detected` with the changed paths and counted in `isolation.checkout_watched` / `checkout_writes`, report-only, artifact plane exempted. Left open: an absolute-path write by a kind whose cwd is its tree, and a lane that fails before the comparison |
<!-- /ANCHOR:log -->
