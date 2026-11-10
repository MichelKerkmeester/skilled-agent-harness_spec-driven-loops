# Review Iteration 5 — Maintainability and overlay protocols

## Dimension

Maintainability, plus the four overlay traceability protocols (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`). The pass asks whether the packet will still be readable and correct for the next packet that scopes work from it: which document is authoritative when two disagree, whether a change list still describes the change, whether a duplicated rule was updated everywhere it appears, and what stray files a reader inherits.

## Files Reviewed

- `specs/sk-code/014-code-modes-research/goal.md:31-50,96-116`
- `specs/sk-code/014-code-modes-research/spec.md:106-126,147-152`
- `specs/sk-code/014-code-modes-research/001-quality-mode-research/implementation-summary.md:64-74`
- `specs/sk-code/014-code-modes-research/002-review-mode-research/implementation-summary.md:64-74`
- `specs/sk-code/014-code-modes-research/scratch/` (working-tree status)
- `.skilled/skills/sk-code/mode-registry.json` (mode ids), `.skilled/skills/sk-code/feature-catalog/feature-catalog.md:1-20`
- `.skilled/agents/review.md`, `.claude/agents/review.md` (existence and parity of the named consumer)

## Findings

### P0 Findings

None.

### P1 Findings

None new this iteration. The three active P1 findings from iterations 2 and 3 stay active and are carried into synthesis; this pass found no additional must-fix defect.

### P2 Findings

1. **The durable directive still states the contract the packet did not execute, and the deviation lives only in the volatile log** -- `specs/sk-code/014-code-modes-research/goal.md:52` -- `goal.md` is the packet's durable directive, and its Decisions table still reads D3 "Each run holds exactly ten iterations" and D4 "alternate by iteration, odd on Luna and even on DeepSeek". The packet ran fifteen iterations per child and ran the first ten on Luna and the last five on DeepSeek, in two passes. The deviation is recorded in the Log section under "Deviations and findings", which the same file labels VOLATILE and "not part of the directive", and that entry says in terms "The directive text is left as written." A reader who opens the directive alone gets a contract that no child executed, and the amendment the parent spec carries inline (`spec.md:114`) is not visible from `goal.md`.
   Finding class: authority-drift
   Scope proof: directive and log sections of the packet's own goal file; child execution read from each child's state log and ADR-002.
   Affected surface hints: `goal.md` Decisions D3 and D4; `spec.md` Frozen Decisions D3 (amended inline) and D4 (not amended); both children's ADR-002.
   Case: the next packet scopes "ten iterations per mode" from the directive and re-runs a loop that the operator already ruled should be fifteen.

2. **The parent's change list does not describe the change** -- `specs/sk-code/014-code-modes-research/spec.md:119` -- The parent's Files to Change table lists two `research/` directories and `specs/sk-code/graph-metadata.json`, and nothing else. Both children's implementation summaries list `decision-record.md`, `spec.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`, the child implementation summary, the parent `spec.md` and the parent `goal.md` as created or modified (`002-review-mode-research/implementation-summary.md:70-73`). The parent's table is the scope statement a later reader trusts to know what this packet touched, and it is short by seven documents.
   Finding class: stale-change-list
   Scope proof: parent scope table and both child change tables read in place.
   Affected surface hints: `spec.md` Files to Change; any review or audit that derives scope from that table.
   Case: an auditor diffing the packet against its declared change list finds eight modified documents where the list names one.

3. **A rule duplicated from a child was updated in the child and not in the parent** -- `specs/sk-code/014-code-modes-research/spec.md:151` -- The parent's phase-handoff table sets the 001 → 002 verification to `grep -rc "001-quality-mode-research/research" 002-review-mode-research/research` printing 0 for every file. ADR-001 in both children narrowed that same check and the acceptance row records that it prints 2 before its skip clause. The parent therefore publishes a verification that fails today, in the same packet whose child records why it was narrowed. One rule written in two places, updated in one.
   Finding class: duplicated-rule-drift
   Scope proof: parent handoff table and child ADR-001 plus AC-011 read in place; the count verified by running the grep read-only from the child phase folder.
   Affected surface hints: `spec.md` Phase Handoff Criteria; AC-011 in both children; ADR-001 in both decision records.
   Case: a reviewer runs the parent's handoff verification, gets 2 non-zero files, and reopens a phase that was closed with a recorded decision.

4. **Four commit-message drafts sit untracked in the packet and none of them is in its change list** -- `specs/sk-code/014-code-modes-research/scratch/commit-message-001.txt:1` -- `scratch/` holds `commit-message.txt`, `commit-message-001.txt`, `commit-message-002.txt` and `commit-message-parent.txt`. Three are untracked in the working tree and none appears in either the parent change list or a child change table, so the packet's own inventory of what it left behind is incomplete and the operator inherits files whose ownership is unclear.
   Finding class: workspace-hygiene
   Scope proof: `git status --short` over the packet's `scratch/` directory; file list read in place.
   Affected surface hints: `scratch/`; the parent Files to Change table; the operator's commit step.
   Case: the operator commits the packet and either carries three orphan drafts into the commit or has to decide about them without a record of why they exist.

### Confirmed clean

- `skill_agent` (overlay): both modes the packet names are live registry entries. `mode-registry.json` carries a `modes` array whose entries include the two mode ids, and the hub catalog describes the same two-axis resolution the packet's integration findings rely on.
- `agent_cross_runtime` (overlay): the consumer the review spec names, `.skilled/agents/review.md`, exists, and its runtime mirror `.claude/agents/review.md` exists beside it. The packet names the canonical path only, which is the path convention the agent contract requires.
- `feature_catalog_code` (overlay): `feature-catalog.md:15` names both workflow modes and the registry-driven resolution. No claim in the packet contradicts the catalog; the packet simply does not cite it, which is a gap in its references rather than a contradiction.
- The children's change tables are accurate and specific, including the `research/containment/` deletion and the `synthesis-v1.md` retention, so the packet is maintainable at child level; the defects above are all at parent level or in the shared working tree.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | Carried: 291/301 citations resolve; one absolute-absence claim contradicted (`002/spec.md:71`). |
| `checklist_evidence` | core | fail | Carried: AC-009 and AC-011 close on commands weaker than the criteria they answer; three rows assert a superseded count. |
| `skill_agent` | overlay | pass | Both mode ids present in `mode-registry.json`; catalog describes the same resolution. |
| `agent_cross_runtime` | overlay | pass | `.skilled/agents/review.md` and its `.claude/agents/review.md` mirror both exist. |
| `feature_catalog_code` | overlay | pass | `feature-catalog.md:15` names both modes; no contradiction with the packet's routing claims. |
| `playbook_capability` | overlay | partial | The hub-level playbook documents the quality-to-review envelope handoff the review spec says does not exist (R2-P1-001); neither child lists that playbook among its sources. |

## Verdict

Four P2 advisories, no new P0/P1. The packet is well maintained at child level and drifts at parent level, where the directive, the change list and a duplicated verification were each left behind by a decision that was recorded elsewhere.

Review verdict: PASS
