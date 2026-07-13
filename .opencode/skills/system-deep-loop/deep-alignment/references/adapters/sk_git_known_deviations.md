---
title: sk-git Known-Deviation Suppression List
description: The seeded sk-git known-deviation list for deep-alignment's ADR-005 suppression invariant, seeded from live git evidence (worktree list, branch list, commit history) gathered while building this adapter, not invented.
trigger_phrases:
  - "sk-git known deviations"
  - "known deviation suppression list sk-git"
  - "work runtime slug branch exemption"
  - "legacy packet-path scope commits"
importance_tier: important
contextType: reference
version: 1.0.0.2
---

# sk-git Known-Deviation Suppression List

The sk-git authority's known-deviation list for deep-alignment's ADR-005 suppression invariant: intentional repo conventions the mode must never flag as drift.

---

## 1. OVERVIEW

### Purpose

ADR-005 (`.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md`, ANCHOR `adr-005`) requires every authority adapter's `standardSource` to carry a known-deviation list so a real repo-wide convention is never flagged as drift. Every entry below traces to real, live-verified evidence gathered while this adapter was built (2026-07-11): `git worktree list`, `git branch --list` and `git log` output re-read at authoring time, not a hypothetical.

### Source of Truth

This document is the single source of truth for sk-git's suppression rules. The fenced `json` block in Section 4 is parsed directly by `scripts/adapters/sk-git.cjs`'s `loadKnownDeviations()` at runtime. There is no separate, hand-synced copy of this list in code. Editing a deviation means editing it here, once.

### Two Suppression Mechanisms, Not One

Unlike sk-doc's known-deviation list (`sk_doc_known_deviations.md`), which suppresses findings entirely via `sk-git.cjs`'s own post-hoc `suppressKnownDeviations()` filter, this authority has **two distinct exemption mechanisms**, and they are not interchangeable:

1. **Structural pre-check exemptions** (never produce a finding to suppress in the first place): the Git-generated-subject exemption (Section 2) and the `work/{runtime}/{slug}` launch-wrapper branch exemption (Section 3) are both hard-coded, early-return checks inside `checkCommit()`/`checkBranch()` (`scripts/adapters/sk-git.cjs`), because REQ-005's acceptance criteria requires the exemption be structurally guaranteed, not merely data-configured (a bug in a JSON suppression list could otherwise let an exempt commit leak through as a false positive). These two are documented here for the same reason sk-doc documents its exemptions in one place, even though the mechanism differs.
2. **Post-hoc suppression via the fenced JSON block** (Section 4): the legacy packet-path scope commits (Section 3... actually Section 4 below) use the standard `matchTypes`/`matchArtifactKinds` filter, the same mechanism sk-doc.cjs uses.

---

## 2. GIT-GENERATED SUBJECT EXEMPTION (STRUCTURAL, NOT A JSON RULE)

**Deviation name**: Git-generated commit subjects (`Merge `, `Revert "`, `fixup! `, `squash! `, `amend! `)

**Why it is not a violation**: these subjects are written by Git itself (merge commits, revert commits, autosquash markers), not by an author choosing a conventional-commit subject. `SKILL.md`'s own "Classify Special Git Messages" section states this exemption is the first classification step, before any authored-subject grammar applies.

**Evidence**:
- `.opencode/skills/sk-git/SKILL.md:322-323`: "Preserve Git-generated subjects unchanged when they begin with `Merge `, `Revert "`, `fixup! `, `squash! `, or `amend! `."
- `.opencode/scripts/git-hooks/commit-msg:44-48`: the live hook's own `case "$SUBJECT" in Merge\ *|Revert\ \"*\"|fixup!\ *|squash!\ *|amend!\ *) exit 0 ;;`. This is a structurally identical exemption, re-confirmed by direct read 2026-07-11.
- Live re-probe (2026-07-11): `git log --oneline -15` on this branch shows `308294ed4d Merge remote-tracking branch 'origin/skilled/v4.0.0.0' into skilled/v4.0.0.0` and `623a91061f Merge remote-tracking branch...`: real, current merge commits with exactly this shape.

**Mechanism**: `checkCommit()` (`scripts/adapters/sk-git.cjs`) tests the live subject against `EXEMPT_SUBJECT_PATTERNS` and returns an empty finding array immediately, before any grammar check runs, mirroring the hook's own `exit 0` short-circuit. This is REQ-005's structural guarantee, not a suppressible/configurable rule.

---

## 3. `work/{runtime}/{slug}` LAUNCH-WRAPPER BRANCH EXEMPTION (STRUCTURAL, NOT A JSON RULE)

**Deviation name**: Launch-wrapper ephemeral per-session worktree branches

**Why it is not a violation**: `SKILL.md`'s ALWAYS #4 explicitly distinguishes the numbered `wt/{NNNN}-{name}` namespace (user-created feature worktrees) from `.opencode/bin/worktree-session.sh`'s own ephemeral per-session worktrees, which use a `work/{runtime}/{slug}` branch naming shape and are "auto-managed, auto-reaped, and intentionally not numbered."

**Evidence**:
- `.opencode/skills/sk-git/SKILL.md:298`: "This is distinct from the launch wrapper's ephemeral per-session worktrees (`work/{runtime}/{slug}` + `.worktrees/{runtime}-{slug}`), which are auto-managed, auto-reaped, and intentionally not numbered."
- Live re-probe (2026-07-11), `git worktree list` on this repo: `/private/.../scratchpad/integration-worktree-019p1` backed by branch `work/021-graph-preservation` and eight `.worktrees/opencode-<timestamp>` directories each backed by a `work/opencode/<timestamp>` branch (for example `work/opencode/20260710-062729-13488`). These are real, currently-live worktrees whose branches would otherwise false-positive against the `wt/{NNNN}-{name}` rule.
- Live re-probe (2026-07-11), `git branch --list` on this repo: confirms `work/021-graph-preservation` and eight `work/opencode/*` branches exist locally, all `+`-marked (checked out in a linked worktree) in the `git branch --list` porcelain output.

**Mechanism**: `checkBranch()` (`scripts/adapters/sk-git.cjs`) tests the live branch name against `LAUNCH_WRAPPER_BRANCH_RE` (`^work\/`) and returns an empty finding array immediately, before the `wt/{NNNN}-{name}` regex is even evaluated. This is a real, currently-ACTIVE exemption (not dormant). Without it, every one of the nine live `work/*` branches this adapter observed while being built would false-positive as a naming violation, exactly the naive-linter failure mode ADR-005 exists to prevent.

---

## 4. LEGACY PACKET-PATH SCOPE COMMITS PREDATING THE COMMIT-MSG HOOK

**Deviation name**: Legacy `type(owner/NNN): ...`-shaped scope commits before hook installation

**Why it is not a violation**: `SKILL.md` §"Scope Selection Order" and the commit-msg hook's own scope grammar (`SUBJECT_RE`) both require a stable, non-numeric, slash-free kebab-case scope, deliberately rejecting the older convention of embedding a packet path or number in the scope (for example `(028/005)` or `(sk-code/024)`, per the hook's own comment at `commit-msg:69-71`). Commits made before the hook existed were never validated against this rule and legitimately used the older convention. Re-flagging them retroactively via a `branchRange` scope that reaches back before the hook's installation date is not a real drift finding.

**Evidence**:
- Hook installation commit: `7ea5cfb7c14103ca621601dd2f03508bc36209e2`, `feat(sk-git): add commit-msg hook enforcing the authored-subject contract`, authored `2026-07-10T15:17:16+02:00` (`git log -1 --format='%H %aI' 7ea5cfb7c1`, re-run 2026-07-11).
- Two real, pre-hook commits with the legacy packet-path scope shape, both dated before the hook's install timestamp (`git log --format='%H %aI %s'`, re-run 2026-07-11):
  - `463d748f12edbc26494d40edabd0d15658c05099`, `refactor(system-skill-advisor/012): remove redundant codeAuditDeepReviewPenalty`, `2026-07-08T06:08:07+02:00`.
  - `fd9fc599bec39920a2c6a235995e319b0e8edfe7`, `refactor(system-skill-advisor/012): delete the dormant self-recommendation guard`, `2026-07-08T06:32:56+02:00`.
- `.opencode/scripts/git-hooks/commit-msg:69-71`: "This deliberately rejects legacy packet-path scopes like `(028/005)` or `(sk-code/024)` — the contract wants a stable subsystem name, not a spec-folder path."

**Honest scope limit**: a third commit matching the same legacy-scope shape (`6620f62f93490f27b8c8bec87d7b7246d10f87f6`, `fix(commands/doctor/agents): recover + apply 132 command-agent conformance remediation (29/30)`, dated `2026-07-11T08:25:42+02:00`, *after* the hook's install timestamp) was also observed during evidence-gathering but is deliberately **not** cited as supporting evidence for this deviation and is **not** covered by its suppression rule below. Its post-hook-install date means it should have been caught by a locally-installed hook. This adapter did not investigate why it was not (a different worktree without the hook installed, a bypass flag or another cause), and citing it as "exempt" without that investigation would overclaim what was actually verified. It remains a live, un-suppressed `invalid-subject-format`/`numeric-only-scope`-shaped finding candidate if a lane's `branchRange` ever includes it. This is an honest, undecided data point, not a resolved one.

**Match rule**: suppresses `invalid-subject-format` findings (the SUBJECT_RE mismatch a slash-containing legacy scope produces) only when the commit's own authored date (`finding.detail.commitDate`, populated by `checkCommit()` from `git log --format=%aI`) is strictly earlier than the hook's install date. `sk-git.cjs`'s `matchesDeviation()` implements this via the `requiresCommitBeforeHookInstall` flag, comparing ISO-8601 date strings directly (both are `%aI`-formatted with a fixed-width offset, so lexical comparison is chronological comparison).

---

## 5. SCOPE OF THIS LIST

**In scope**: sk-git authority only. Each other authority adapter (sk-doc, sk-design, sk-code) owns its own known-deviation list under its own `standardSource`, per ADR-005's per-authority requirement. This document does not attempt to anticipate their conventions.

**Not a dumping ground**: every entry here traces to a real, live-re-probed piece of evidence gathered while this adapter was authored, per `spec.md` REQ-004's VERIFY-FIRST requirement, not a hypothetical convention. The Section 4 honest-scope-limit paragraph is itself an example of that discipline: a candidate piece of evidence that did not clear the verification bar was named and excluded, not silently folded in to make the deviation look more solid than it is.

---

## 6. MACHINE-READABLE DEVIATION LIST

`scripts/adapters/sk-git.cjs` parses this fenced block directly (see that file's `loadKnownDeviations()`). Keep it byte-consistent with Sections 2-4 above. Sections 2 and 3 are documented here for completeness but have **no** corresponding JSON entry. They are structural pre-check exemptions inside `sk-git.cjs` itself (see Section 1 "Two Suppression Mechanisms"), not post-hoc filter rules. Only Section 4's deviation is expressed as data below.

```json
{
  "authority": "sk-git",
  "version": "1.0.0",
  "generatedFrom": "sk_git_known_deviations.md Section 6, hand-maintained alongside Sections 2-4",
  "deviations": [
    {
      "id": "legacy-packet-path-scope-pre-hook",
      "name": "Legacy packet-path scope commits predating the commit-msg hook",
      "appliesToLayer": "deterministic",
      "matchTypes": ["invalid-subject-format", "numeric-only-scope"],
      "matchArtifactKinds": ["commit"],
      "requiresCommitBeforeHookInstall": true,
      "status": "active",
      "evidence": [
        "hook-install:7ea5cfb7c14103ca621601dd2f03508bc36209e2@2026-07-10T15:17:16+02:00",
        "463d748f12edbc26494d40edabd0d15658c05099@2026-07-08T06:08:07+02:00",
        "fd9fc599bec39920a2c6a235995e319b0e8edfe7@2026-07-08T06:32:56+02:00",
        "commit-msg:69-71"
      ]
    }
  ]
}
```

---

## 7. REFERENCES AND RELATED RESOURCES

- [sk_git_adapter.md](./sk_git_adapter.md): the full `standardSource`/`discover`/`check` specification this list is loaded by.
- [sk-git.cjs](../../scripts/adapters/sk-git.cjs): the reference wiring script. `loadKnownDeviations()` parses Section 6's fenced block. `EXEMPT_SUBJECT_PATTERNS`/`LAUNCH_WRAPPER_BRANCH_RE` implement Sections 2-3's structural exemptions.
- `.opencode/skills/sk-git/SKILL.md` (lines 298, 319-326, 310-457): the live rule sources this list's evidence is cited against.
- `.opencode/scripts/git-hooks/commit-msg`: the live enforcement hook this adapter's grammar is ported from.
- `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md` (ANCHOR `adr-005`): the alignment contract this list satisfies.
