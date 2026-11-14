# Iteration 1: Correctness of phase 006-010 behaviour against the manifest docs

## Dispatcher

- Agent: @deep-review (LEAF), lineage `dsh-2`, session `fanout-dsh-2-1794652127582-mfqldk`, generation 1.
- Route: mode=review, target_agent=deep-review, single review iteration.
- Target: `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach`; scope exactly `goal-file-manifest.txt` (74 files).
- Budget profile: verify (11-13 calls).
- Operator review focus: documentation alignment, highest yield the docs never updated for phases 006-010. This iteration addressed the focus by tracing each named phase 006-010 behaviour to the code that ships it and then to the manifest document that states it, so every narrative claim below is anchored on both sides of the doc/code pair.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs:34-38,79,1307-1329,1461-1472,1633-1653,1661`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1637-1662,1808-1829`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:358-396,432-447,743-770`
- `.skilled/skills/system-spec-kit/SKILL.md:280-317`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-packet-relocation.md:38-68`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md:43-47`
- `.skilled/skills/system-spec-kit/changelog/v2.13.0.0.md:59-75,139-149,218-222`
- `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/goal-file-manifest.txt:1-75`
- `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/006-relocate-resume-and-preflight/spec.md`, `007-.../spec.md`, `008-.../spec.md`, `009-.../spec.md`, `010-.../spec.md` (behaviour claims)

## Findings

### P0 Findings

[None]

### P1 Findings

1. **F001: The SKILL.md next-number helper still ignores archived packets** — `.skilled/skills/system-spec-kit/SKILL.md:295` — The Quick Reference command `ls -d specs/[0-9]*/ | sed ... | sort -n | tail -1` counts only live top-level packet folders. Decision D4, `create.sh` at `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1637-1662` (root numbering walks `"$SPECS_DIR"/*` and `"$SPECS_DIR"/z_archive/*`) and the phase path at `create.sh:1808-1829` all count archived packets. The documented helper therefore hands an operator a number an archived packet already owns.
   Finding class: cross-consumer
   Scope proof: `grep -rn "next spec number\|Next spec number" .skilled/skills/system-spec-kit` returns only `SKILL.md:295`; `create.sh` is the only other allocation surface and it counts the archive at both the root and phase paths (`create.sh:1644`, `create.sh:1813`).
   Affected surface hints: ["SKILL.md quick-reference row", "create.sh numbering", "archive-aware next-number contract"]
   Case: With `specs/006-live/` live and `specs/z_archive/007-old/` archived, the documented one-liner prints `006`, so the operator allocates `007` and collides with the archived packet.

```json
{
  "findingId": "F001",
  "claim": "SKILL.md documents a next-number one-liner that only lists live root folders, while create.sh counts archived packets at the root and phase paths.",
  "evidenceRefs": [
    ".skilled/skills/system-spec-kit/SKILL.md:295",
    ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1637-1662",
    ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1808-1829"
  ],
  "counterevidenceSought": "Searched for a second documented next-number helper and for a note saying the one-liner is deliberately live-only; found neither. Checked whether create.sh still ignores the archive on any path; it includes it at both the root and phase paths.",
  "alternativeExplanation": "The one-liner may be intended only as a read-only diagnostic for the specs root, not as an allocation command. The heading 'Next spec number' and the D4 decision make it an allocation surface, so the alternative does not retire the mismatch.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "If the one-liner is relabeled as a live-only diagnostic and the quick reference points allocation at create.sh, downgrade to P2."
}
```

2. **F002: The relocation feature catalog enumerates three exit statuses and omits status 3** — `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-packet-relocation.md:66` — The catalog says status 2 covers "a failed close". Since phase 008, `relocate.mjs` exits 3 when the sweep passed and only a moved packet's own validation failed (`.skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs:34-38` and `:1661`), and a rerun then finds nothing to do. A caller that reads the catalog treats the landed move as a hard failure.
   Finding class: cross-consumer
   Scope proof: `runtime/cli/spec/README.md:120` already states status 3 and the rerun semantics, so the current-state catalog is the stale consumer; `grep -n "Status 2 means" feature-catalog/tooling-and-scripts/spec-packet-relocation.md` shows the omission is local to the catalog's exit-code paragraph.
   Affected surface hints: ["feature-catalog exit-code contract", "relocate closeRun", "changelog exit-code paragraph"]
   Case: A map moves a packet whose pre-existing strict failure survives; the run exits 3, but the catalog promises status 2 for a failed close, so the operator reruns and then rolls back a move that in fact finished.

```json
{
  "findingId": "F002",
  "claim": "The relocation feature catalog lists statuses 0, 1 and 2 only and assigns every failed close to status 2, while relocate.mjs returns 3 for a landed move whose packet validation failed.",
  "evidenceRefs": [
    ".skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-packet-relocation.md:66",
    ".skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs:34-38",
    ".skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs:1661",
    ".skilled/skills/system-spec-kit/runtime/cli/spec/README.md:120"
  ],
  "counterevidenceSought": "Checked the changelog and the full CLI README for a status-3 note; the README has one, the catalog and changelog do not. Checked whether closeRun can return 2 for a validation-only failure; it returns 3 only when the sweep passed, so the catalog's 'failed close' wording is not a safe catch-all.",
  "alternativeExplanation": "The catalog may describe the phase 001 behaviour and consider status 3 an amendment recorded elsewhere. The catalog is a current-state reference, not a phase log, so the omission is still a live doc/code mismatch.",
  "finalSeverity": "P1",
  "confidence": 0.92,
  "downgradeTrigger": "If the catalog gains a status-3 row and the changelog notes the amendment, downgrade to P2."
}
```

3. **F003: The lifecycle catalog's restore paragraph contradicts the phase 008 restore verdict and omits the mixed-track refusal** — `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md:45` — The paragraph says "If relocate.mjs is missing or its run fails, the restore exits with status 1". `archive.sh:432-440` treats `relocate.mjs` status 3 as a completed restore and exits 0 with a warning. `archive.sh:363-395` also refuses a flat restore into a track that now holds sub-tracks, a refusal the paragraph does not name.
   Finding class: cross-consumer
   Scope proof: The same paragraph is the only restore-verdict text in the manifest's lifecycle catalog; `runtime/cli/spec/README.md:114` and `archive.sh` help carry the next-number behaviour but neither names the status-3 verdict or the mixed-track refusal, so the omission is not duplicated by an aligned surface.
   Affected surface hints: ["feature-catalog restore contract", "archive.sh restore_spec", "archive.sh help", "changelog Archives section"]
   Case: A restore onto a taken number lands the packet but its strict validation fails; `relocate.mjs` exits 3, `archive.sh` exits 0 with a warning, and the catalog says the restore exited 1, so the operator retries a restore that already succeeded. A second case is a flat restore into a track that has since gained sub-tracks: archive.sh refuses with exit 1, but the catalog says nothing about it.

```json
{
  "findingId": "F003",
  "claim": "The lifecycle catalog says a failed relocate run makes a restore exit 1 and does not document the mixed-track restore refusal, while archive.sh treats relocate status 3 as success and refuses a mixed-track restore.",
  "evidenceRefs": [
    ".skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md:45",
    ".skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:363-395",
    ".skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:432-440"
  ],
  "counterevidenceSought": "Read the archive.sh restore path end to end and checked the changelog and CLI README for a status-3 or mixed-track note; the code has both, the docs do not. Considered whether status 3 is a 'failure' in the catalog's sense; archive.sh explicitly distinguishes it from a failed step and exits 0.",
  "alternativeExplanation": "The paragraph may be describing the pre-phase-008 contract and leave the amendment to the changelog. The changelog's Archives section also omits both behaviours, so no manifest doc carries the correction.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "If the catalog names the status-3 success verdict and the mixed-track refusal, and the changelog is amended, downgrade to P2."
}
```

### P2 Findings

[None]

## Traceability Checks

| Protocol | Level | Status | Evidence | Notes |
|----------|-------|--------|----------|-------|
| `spec_code` | core | partial | `relocate.mjs:1661`, `create.sh:1644`, `archive.sh:437` vs the three doc lines above | The three doc/code pairs disagree on observable behaviour; six other behaviour pairs matched (see Confirmed-Clean). |
| `checklist_evidence` | core | pass | `006/plan.md`, `008/implementation-summary.md` and `goal.md:138` claim the status-3 and mixed-track work; code matches the claims | The gap is in the outward docs, not in the phase evidence. |
| `feature_catalog_code` | overlay | partial | `feature-catalog/tooling-and-scripts/spec-packet-relocation.md:66`, `spec-lifecycle-automation.md:45` | Two current-state catalog pages lag their code. |
| `playbook_capability` | overlay | notApplicable this iteration | Playbooks deferred to iteration 4 | No playbook claim was used to support a finding here. |

## Integration Evidence

- `sk-doc/sk-create-feature-catalog/SKILL.md:347` requires per-feature files to carry source anchors for every feature claim; the omitted exit status and restore verdict are feature claims in the two catalog pages.
- `sk-doc/sk-create-readme/SKILL.md` README structure standard is not implicated by this iteration; the root README roundup is read-only context here.
- `kg`/coverage graph: not run. This lineage records `graphCoverageMode` as unavailable in the synthesis note; all findings cite direct reads.

## Edge Cases

- `runtime/cli/spec/README.md:120` is current and must not be edited for exit status; it already documents status 3, the rerun, and the NNN-slug refusal.
- `changelog/v2.13.0.0.md:221` says a stopped `--renumber` run does not finish on a rerun. I checked the code: `relocate.mjs:1746-1749` returns before reading the ledger when the renumber pass finds no entries, so the changelog statement remains true for `--renumber`. It is not a finding; it is a survived claim.
- The reworded archive signal lives in `graph-metadata.json`, which the manifest deliberately excludes as generated JSON. It is not reviewable in this scope; the exclusion is recorded rather than treated as a pass.
- The manifest has 74 paths and all exist; the validation script in `step_scope_discovery` would accept them.

## Confirmed-Clean Surfaces

- `relocate.mjs` late-step ledger marks (`:79`, `:1316`, `:1634`, `:1639`, `:1648`) and the resume path (`:1362-1411`, `:1772-1793`) match the phase 006 claim, and the feature catalog at `spec-packet-relocation.md:68` already tells the operator to rerun the same map. No new finding.
- The case-folded duplicate check exists at `relocate.mjs:472-490`; no manifest doc enumerates it, but the refusal is an edge case handled below in iteration 4, not a correctness break in this pass.
- `create.sh:1813` proves the archive-aware phase numbering required by phase 008; the phase-definitions doc gap is deferred to the traceability pass rather than double-counted here.
- `archive.sh:437-440` and `:363-395` are coherent code, not code defects; the defect is in the catalog text.

## Ruled Out

- **P0 classification for the stale exit status**: no data loss or security breach follows; the cost is a misdiagnosed exit, so P1 is the supported ceiling.
- **An `--apply` rollback claim**: `relocate.mjs:34` says status 0 after apply means every step landed; status 3 is explicitly a landed move, so the code does not invite a destructive retry.
- **A general "all docs are stale" finding**: the CLI README is current, so the gap is specific pages, not the whole documentation set.

## Next Focus

- Dimension: security.
- Focus area: archive search path handling and restore/refusal documentation; does any manifest doc understate a path-safety or refusal boundary introduced in phases 006-010?
- Reason: correctness pass found three observable doc/code contradictions; security is the next uncovered dimension and follows the risk order.
- Rotation status: D1 correctness covered; D2 security, D3 traceability, D4 maintainability remain.
- Blocked/productive carry-forward: productive direct-read pairing of code behaviour to doc lines; carry the same method into the security pass.
- Required evidence: exact `file:line` for each doc claim and the matching code guard; do not convert an undocumented edge case into a pass.
- Recovery note: none.

Review verdict: CONDITIONAL
