---
title: "Implementation Summary: hub-surface-drift-sweep"
description: "Evidence ledger for the BUILD leaf covering link resolution, design/code/git/install drift, and archive-path ratification."
trigger_phrases:
  - "hub surface drift implementation"
  - "skd025-004 build receipts"
importance_tier: "important"
contextType: "implementation"
status: "In Progress"
_memory:
  continuity:
    packet_pointer: "sk-doc/025-skill-doc-currency/004-hub-surface-drift-sweep"
    last_updated_at: "2026-08-02T14:32:45Z"
    last_updated_by: "skd025-004-build"
    recent_action: "Recorded BUILD receipts and kept the child status In Progress"
    next_safe_action: "Run strict packet validation and preserve the receipts"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/resolve_skill_markdown_links.py"
      - ".opencode/skills/sk-doc/shared/scripts/check_install_entries.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skd025-004-BUILD"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "All locked operator rulings were applied."
---

# Implementation Summary: hub-surface-drift-sweep

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| Spec Folder | `sk-doc/025-skill-doc-currency/004-hub-surface-drift-sweep` |
| Status | In Progress |
| Verification Date | 2026-08-02 |
| Level | 2 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Status

In Progress. The locked BUILD scope is implemented and evidenced; child metadata remains explicitly In Progress as required by the leaf contract. No git commit was created.

### Baselines and deltas

The pre-edit repo-wide resolver receipt is in `baselines/link-resolver-pre-edit.txt`: 9,090 files, 11,760 entries, 789 failures, 1,155 anchor exclusions and 18,009 external exclusions. The post-edit receipt is in `baselines/link-resolver-post-edit.txt`: 9,090 files, 11,761 entries, 788 failures, 1,155 anchor exclusions and 18,010 external exclusions. Delta: one fewer failure.

The packet's changed-document subset moved from one known template-placeholder failure to zero: pre-edit `35/253/1`, post-edit `39/256/0` for files/entries/failures. The repo-wide residual failures are outside the named finding set; the phase makes no zero-failure claim for unrelated tree noise.

The install baseline was two failures across 15 entries. After target verification and symlink repair, `baselines/install-entries-post-edit.txt` records eight of eight guide entries and seven of seven script entries resolvable, 15 entries examined, zero failures and zero outside-root targets.

### Terminal-state ledger

Every scope item has exactly one terminal state. All 20 are repaired; no item is stale, already-fixed or deferred.

| Item | Terminal state | Evidence |
|---|---|---|
| RE-002-01 | repaired | Retired design ownership references now point to `sk-design-interface`, `sk-design-md-generator`, or the current temporal interaction lane in the confirmed affected documents. |
| RE-002-03 | repaired | `sk-design-md-generator/SKILL.md` always-loads only `references/design-md-format.md`, matching `DEFAULT_RESOURCE`. |
| RE-002-04 | repaired | Reachability was checked against the active choreography. `hierarchy-rhythm-review.md` is reachable from the routed final-polish orchestrator (`../shared/procedures/polish-gate-orchestration.md`), so it is canonicalised as a first-class card, not quarantined. Eight cards remain active; `component-system-inventory.md` and `tweakable-design-controls.md` are quarantined, not deleted. |
| RE-002-05 | repaired | README count, workflow selection count and active on-disk count are all eight; two retained cards carry `status: quarantined`. |
| RE-002-06 | repaired | Webflow human map now lists the exact split paths represented by its unchanged `RESOURCE_MAP`; comparison receipt is zero mismatches. |
| RE-002-07 | repaired | OpenCode human map now lists the exact split language, shared and authoring paths represented by its unchanged `RESOURCE_MAP`; comparison receipt is zero mismatches. |
| RE-002-08 | repaired | Shared smart-routing prose now uses current shared, Webflow and OpenCode packet paths. |
| RE-002-09 | repaired | Universal debugging references now use the split debugging, phase, recovery and verification filenames. |
| RE-002-10 | repaired | Motion quick-start sibling links now resolve to the split animation-workflow and performance-pattern files. |
| RE-002-11 | repaired | Absent `a_nobel_en_zn/2_javascript/` anchors are labelled external/historical across the affected motion references and assets; no replacement repo examples were added. |
| RE-002-12 | repaired | The unlabelled `12.15.0` style-guide outlier is reconciled to `12.38.0`; no Motion pin was invented in `performance/third-party.md`. |
| RE-002-13 | repaired | Cross-reference labels now name the split targets, including async-patterns, minification/debugging and observer resize guidance. |
| RE-008-01 | repaired | Quick-reference creation recipes use `worktree-naming.sh create` / `create-detached` and owner-first branch/directory grammar. |
| RE-010-01 | repaired | Benchmark canon names `benchmark/reports/compiled-routing/`, matching the live writer and existing archive location. |
| RE-010-02 | repaired | Chrome DevTools guide symlink now targets the verified `mcp-tooling/mcp-chrome-devtools/INSTALL-GUIDE.md`; README counts are derived as eight entries. |
| RE-010-03 | repaired | Chrome DevTools installer symlink now targets the verified `mcp-tooling/mcp-chrome-devtools/scripts/install.sh`; master dry-run reaches all four installers. |
| RE-010-04 | repaired | Benchmark README now documents the real `reports/` tree and no longer presents root `router-final/` or `live-final/` artifacts. |
| RE-006-03 | repaired | The three supplementary Git resources use allocator recipes; retained `wt/...` examples in finish-workflows are explicitly legacy. The quick-reference half is repaired once under RE-008-01. |
| RE-006-07 | repaired | Disk-derived inventory is 42 scenario files across eight category directories, including `git-preflight-advisory/GIT-042`; README, SKILL and playbook versions/counts are reconciled and the GitKraken map row is present. |
| RE-006-08 | repaired | Current `gk mcp --list-tools` verification was run on 2026-08-02; the document now states the reproducible check instead of freezing a tool count, and distinguishes review worktree creation from start-work branch creation. |

### Orphan reachability evidence

The eight cards listed by `sk-design-interface/SKILL.md` are reachable from active choreography: discovery-question-round, aesthetic-direction, wireframe-exploration, variation-set, prototype-flow-spec, deck-direction-spec, interaction-states-pass and hierarchy-rhythm-review (the last reached through the routed final-polish orchestrator's related-cards, so it is canonicalised rather than quarantined). The two quarantined cards were reachable only from the inventory catalog, not active choreography: component-system-inventory and tweakable-design-controls. They remain on disk with a quarantine status and historical explanation.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The build ran design-hub first, then code-hub, Git-hub, install and archive lanes. Confidence comes from the exact-case resolver delta, zero changed-document link failures, zero dangling install entries, the installer dry-run, allocator tests, map comparison, cardinality assertion and the captured current GitKraken tool-surface check.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|---|---|
| Quarantine two unreachable procedure cards; canonicalise the reachable one | Cards not reached by active choreography are quarantined (deleting them would destroy historical material); a card reachable from a routed orchestrator is retained as a first-class card. |
| Reconcile the Motion pin to `12.38.0` | The `12.15.0` outlier had no compatibility-fixture label, while five active examples use `12.38.0`. |
| Relabel absent animation examples external/historical | The bounded drift-sweep scope does not expand to invent new local examples. |
| Ratify `benchmark/reports/compiled-routing/` | The live writer and existing archive corpus already use that location. |
| Build both checks in `sk-doc/shared/scripts/` | Q7 explicitly selected fresh shared tooling using the landed path-resolution pattern. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Verification receipts

- New resolver: exact-case relative links only; anchor-only and external URLs are excluded and counted; outside-root symlink targets fail; self-test and AST parse pass.
- New install check: immediate guide/script entries are counted from disk; missing and outside-root symlink fixtures fail; self-test pass.
- Installer: `install-all.sh --help` rc 0, `--dry-run` rc 0 with four installed and zero failed, and tool-specific Chrome DevTools `--help` rc 0.
- Git allocator: `worktree-naming.test.sh` reports `PASS=47 FAIL=0`.
- Code maps: Webflow `human=92 machine=92 mismatches=0`; OpenCode `human=62 machine=62 mismatches=0`.
- Design cardinality: README 7, workflow 7, active disk 7, quarantined 3.
- First-phase fleet receipt: 11/11 clean; no remembered count is used as a no-regression claim.

One non-blocking adjacent receipt remains explicit: `package_skill.py --check .opencode/skills/sk-git` still reports the pre-existing 6,270-word SKILL.md over its 5,000-word package limit. This packet does not reduce unrelated content because that remediation is outside the locked drift findings.

### NFR Verification

| NFR | Result | Evidence |
|---|---|---|
| NFR-P01 | Pass | Repo-wide resolver completed in about eight seconds, below the one-minute bound. |
| NFR-S01 | Pass | Install check rejects outside-root targets before existence checks; outside-root self-test passes. |
| NFR-R01 | Pass | Both checks fail closed on scan/read errors and report examined-entry counts in their summaries. |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The repo-wide resolver still reports 788 unrelated failures after the phase; the changed-document scope is zero and the delta is recorded rather than hidden.
2. The sk-git package checker remains over its unrelated word-limit advisory; reducing that document was not in this packet's locked finding scope.

<!-- /ANCHOR:limitations -->

---

### Deviations from Plan

| Planned | Actual | Reason |
|---|---|---|
| Consume an existing link resolver if available | Built the two checks fresh | Q7 locked shared-tool ownership and no suitable resolver was present. |
| Report a zero repo-wide resolver count | Report the real 788 residual failures and a zero changed-scope subset | The requirement is delta-legible reporting; unrelated tree noise remains outside this phase. |
