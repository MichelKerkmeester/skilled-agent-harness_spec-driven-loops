---
title: Deep Research Strategy - release-aware /doctor:update redesign
description: Session tracking for the research run on redesigning /doctor:update into a release-aware updater that updates uncustomized skills and proposes alignment for customized ones.
trigger_phrases:
  - "release-aware doctor update"
  - "doctor update redesign"
  - "skill customization detection"
  - "release alignment proposal"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking

Runtime state for the deep-research session bound to
`specs/system-speckit/048-doctor-command-audit/003-update`.

---

## 2. TOPIC

Redesign /doctor:update into a release-aware updater for this framework. It must smartly detect which release tag the operator's checkout is on (tags, changelog versions, skill version frontmatter), find the latest upstream release, and compute what changed between the operator's current state and that release. For skills the operator has NOT customized, it updates them to the release. For skills the operator HAS customized or overridden locally (for example sk-git or sk-code), it must not overwrite: it proposes fixes that align them with the latest release while keeping the repo's own override specifics. Detection of customization and the alignment proposals must be smart (three-way merge against the release base, provenance markers, hashes, git history), and where manual, guided and evidence-backed. Decide whether this is one command or several (for example check, apply, align), what happens to today's database-rebuild behaviour of /doctor:update, and specify each resulting command's workflow YAML to the sk-create-command contract (thin router, -presentation.txt, workflow YAML with approval gates, rollback, dry-run). Ground every claim in this repository: .skilled/commands/doctor/, .skilled/changelog/, skill changelogs and versions, sk-git, sk-doc/sk-create-command, the install and sync scripts.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: How can the updater determine which release the operator's checkout is on (git tags, `.skilled/changelog/` versions, skill `version` frontmatter, skill changelogs) and find the latest upstream release, and how is the delta between the two computed from repository evidence?
- [ ] Q2: How should the updater detect that a skill is customized or overridden locally (three-way merge against the release base, provenance markers, content hashes, git history), and which of those signals does this repository already produce or could produce cheaply?
- [ ] Q3: For a customized skill such as sk-git or sk-code, how should the updater build an alignment proposal against the latest release that keeps the repo's override specifics, and how is that proposal presented, approved and applied in a guided, evidence-backed way?
- [ ] Q4: Should this be one command or several (for example check, apply, align), and what happens to today's database-rebuild behaviour of /doctor:update (kept, moved, renamed or retired)?
- [ ] Q5: What does each resulting command look like under the sk-create-command contract (thin router, `-presentation.txt`, workflow YAML with approval gates, rollback and dry-run), and how does it reuse the existing install and sync scripts?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Implementing the redesigned commands. This run specifies them; building them is a later `/speckit:plan` and `/speckit:implement` step.
- Fixing the current `doctor-update.yaml` defects one by one. `scratch/proposal.md` already records those minimal fixes.
- Designing a package manager or registry service outside this repository's git and file layout.
- Changing other doctor targets, which belong to their own phases of packet 048.

---

## 5. STOP CONDITIONS

- Stop policy is `max-iterations`: all 10 iterations run, and convergence is telemetry only.
- Each key question has an answer grounded in cited repository paths, or is recorded as an open question with the evidence that would close it.
- A command split and a per-command workflow outline exist that a planner can turn into tasks without re-deriving the design.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Q1a: fallback path when the operator checkout has no git metadata or no gh auth — which signal degrades first and what conclusion is still safe? (iteration 1)
- Q5: each command's shape under the sk-create-command contract and reuse of install/sync scripts. (iteration 1)
- Q3: how to build and present an alignment proposal for a customized skill while keeping its override specifics. (iteration 1)
- Q1b: are composite child skills (sk-code-*, sk-doc-*) independent update units with their own versions, or updated only through the parent? (iteration 1)
- Q4: one command or several; what happens to today's database-rebuild behaviour of /doctor:update. (iteration 1)
- Q2 (next focus): which customization/override signals does this repository produce, or can produce cheaply (three-way merge against the release base, provenance markers, hashes, git history)? (iteration 1)
- Q1c: is the system-skill-advisor frontmatter/changelog mismatch accepted practice or drift — is reconciliation an error or a warning? (iteration 1)
- Q4: one command or several; what happens to today's database-rebuild behaviour of `/doctor:update`. (iteration 2)
- Q2 (next focus): which customization/override signals does this repository produce or could produce cheaply (three-way merge against the release base, provenance markers, hashes, git history)? (iteration 2)
- Q1a (carried): fallback path when the operator checkout has no git metadata or no gh auth. (iteration 2)
- Q1b (carried): whether composite child skills are independent update units — note that this iteration's 59-file scan confirms children do carry their own `version` frontmatter and changelog directories, which strengthens the case for treating them as independently versioned units (to be decided under Q1b). (iteration 2)
- Q4: one command or several, and what happens to today's database-rebuild behaviour of `/doctor:update`. (iteration 3)
- Q5: each command's shape under the sk-create-command contract and reuse of install/sync scripts. Q1b adds a sub-item: whether hub-projection regeneration belongs in the same apply transaction as the child update. (iteration 3)
- **Q5a**: exact flag surface (`--dry-run` default? `--accept <proposal>`?), and whether align ever applies or always hands off to apply. (iteration 4)
- **Q1**: release detection (local tag / changelog / frontmatter version vs latest upstream) — consumed by the proposed `/doctor:check`; needs the degradation path from Q1a. (iteration 4)
- **Q4**: final disposition of DB rebuild — evidence now favors retain-as-route or apply's final phase; needs a decision record. (iteration 4)
- **Q1c**: system-skill-advisor frontmatter/changelog mismatch — error or warning (carried). (iteration 4)
- **Q2**: customization/override detection signals (three-way merge against release base, provenance markers, hashes, git history) — next focus. (iteration 4)
- **Q3**: alignment-proposal mechanics for customized skills; the align route shape is sketched (proposals only, hand application to apply) but merge machinery is ungrounded. (iteration 4)
- **Q3b (new)**: whether the divergence ledger ships as a git-tracked file (audit, merge conflict risk) or a gitignored run-state file (clean tree, weaker audit). (iteration 5)
- **Q4**: final disposition of the DB rebuild — needs a decision record. (iteration 5)
- **Q5a**: exact flag surface (`--dry-run` default? `--accept <proposal>?`) and whether align ever applies or always hands off to apply. (iteration 5)
- **Q3a (new)**: exact hash input of `provenance_fingerprint` (`lib/derived/provenance.ts`) and whether it covers raw SKILL.md bytes closely enough to serve as a pre-filter. (iteration 5)
- **Q1 / Q1a**: release detection (local tag / changelog version / frontmatter version vs latest upstream) and the degradation path when git metadata or `gh` auth is absent — now the blocking dependency, because Q3's base resolution needs per-file bytes at the detected release. (iteration 5)
- **Q3b**: divergence ledger git-tracked vs gitignored — decision needed. (iteration 6)
- **Q1c**: system-skill-advisor frontmatter/changelog mismatch — error or warning. (iteration 6)
- **Q5a**: exact flag surface and whether align ever applies. (iteration 6)
- **Q3a**: exact hash input of `provenance_fingerprint` (`lib/derived/provenance.ts`) — cheap close-out. (iteration 6)
- **Q1b**: composite child skills as independent update units; prior evidence says children carry their own frontmatter and changelogs — decision needed. (iteration 6)
- **Q4**: final disposition of the DB rebuild — decision record. (iteration 6)
- **Q5**: each resulting command's shape under the sk-create-command contract and reuse of the (iteration 7)
- **Q1 / Q1a**: release detection and the no-git/no-`gh` degradation path (carried); note the (iteration 7)
- **Q4a** (new): rename mechanics and reference sweep for the rebuilt command (implementation-level). (iteration 7)
- **Q1b**: composite child skills as independent update units — decision needed. (iteration 7)
- **Q5a**: exact flag surface (`--dry-run` default? `--accept <proposal>?`) and whether align ever (iteration 7)
- **Q1 / Q1a**: release detection and the no-git/no-`gh` degradation path (carried; (iteration 8)
- **Q5**: remaining shape work — EXECUTION TARGETS rows, YAML phase structure per action, the (iteration 8)
- **Q3a**: exact hash input of `provenance_fingerprint` — cheap close-out. (iteration 8)
- **Q3b**: divergence ledger git-tracked vs gitignored (F-008-4 folds it into align's write class). (iteration 8)
- **Q4a**: rename mechanics and reference sweep for the rebuilt command (implementation-level). (iteration 8)
- **Q1c:** system-skill-advisor frontmatter/changelog mismatch severity (carried). (iteration 9)
- **Q3b:** divergence ledger git-tracked vs gitignored (carried). (iteration 9)
- **Q3a:** exact hash input of `provenance_fingerprint` (carried, cheap close-out). (iteration 9)
- **Q5 (residual):** EXECUTION TARGETS rows and per-action YAML phase structure for the new commands; `_routes.yaml` registration shape for a 3-command family (three `standalone:` entries vs a new family block). (iteration 9)
- **Q4 (residual):** whether the rebuilt family replaces `/doctor:update` outright or ships it as a deprecated alias for one release. The sweep is identical either way; only whether `update.md` survives changes. (iteration 9)
- **Q1 / Q1a:** release detection and the no-git/no-`gh` degradation path (carried). (iteration 9)
- **Q1b:** composite child skills as independent update units (carried). (iteration 9)
- **Q1 / Q1a:** release detection (git tag vs `.skilled/changelog/` version vs frontmatter versions) and the no-git/no-`gh` degradation path — carried; still the blocking dependency for `/doctor:check`'s data path. (iteration 10)
- **Q4 (residual):** whether the rebuilt family replaces `/doctor:update` outright or ships a deprecated alias for one release; DB-rebuild disposition decision record. (iteration 10)
- **Q3a:** exact `provenance_fingerprint` hash input — cheap close-out. (iteration 10)
- **Q3b:** divergence ledger git-tracked vs gitignored. (iteration 10)
- **Q1c:** system-skill-advisor frontmatter/changelog mismatch severity — error or warning. (iteration 10)
- **Q5 (residual):** EXECUTION TARGETS rows and per-action YAML phase structure for the new commands; `_routes.yaml` registration shape for a 3-command family (iteration 004 sketched both; iteration 009 fixed the registration surface). (iteration 10)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
**Q5 (residual):** EXECUTION TARGETS rows and per-action YAML phase structure for the new commands; `_routes.yaml` registration shape for a 3-command family (iteration 004 sketched both; iteration 009 fixed the registration surface).

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Continuity ladder: no `handover.md` or `decision-record.md`; `implementation-summary.md` is still the scaffold. `spec.md` scopes this phase to auditing `/doctor:update` (keep, fix or retire). The free-text ripgrep recipe over `specs` and `.skilled` returned a clean no-hit (exit 1) for the topic text.

### Bounded Context Snapshot

- Source pointers: `.skilled/commands/doctor/update.md`, `.skilled/commands/doctor/assets/doctor-update.yaml`, `.skilled/commands/doctor/assets/doctor-update-presentation.txt`, `.skilled/commands/doctor/_routes.yaml`, `.skilled/commands/doctor/scripts/doctor-runtime-bootstrap.sh`.
- Prior packet evidence: `specs/system-speckit/048-doctor-command-audit/003-update/scratch/proposal.md` (verdict "fix" for the current database-rebuild workflow, with minimal edits) and `scratch/reality-check.md` (inventory of every path, script, flag and variable the current workflow names, with present, moved or missing status). `scratch/doctor-run.log` holds the read-only run output.
- Reuse candidates: `.skilled/changelog/`, per-skill changelogs and `version` frontmatter, sk-git, `sk-doc/sk-create-command` (command contract, `assets/command-contract.json`), install and sync scripts.
- Integration points: the doctor route manifest and its validator `.skilled/commands/doctor/scripts/route-validate.sh`; runtime mirrors of commands under `.claude/commands/`, `.codex/prompts/`, `.cursor/commands/`, `.hermes/prompts/`, `.pi/prompts/`.
- Constraints and risks: the current command mutates runtime databases; the redesign must keep dry-run and rollback first-class and must never overwrite operator customizations.

Resource map: resource-map.md not present; skipping coverage gate.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Stop policy: max-iterations (convergence is telemetry only)
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `specs/system-speckit/048-doctor-command-audit/003-update/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-10-02T20:15:14.286Z
