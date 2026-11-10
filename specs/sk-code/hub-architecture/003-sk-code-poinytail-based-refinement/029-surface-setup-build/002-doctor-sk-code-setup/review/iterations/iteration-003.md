# Deep-Review Iteration 3 — Traceability

**Run:** `2026-10-13T21:11:31.000Z` (generation 1, lineage new) — iteration 3 of 5
**Target:** commit `79f5dacc52` on origin/main (diff `49cfd5c89f..79f5dacc52`, merged in `c5b3bd9355`) — the read-only `/doctor:sk-code` setup command
**Dimension:** traceability (core: `spec_code`, `checklist_evidence`; overlay: `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`)

## Files Reviewed

- `specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup/spec.md` — full read
- `specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup/acceptance-criteria.md` — full read
- `.skilled/commands/doctor/sk-code.md` — full read
- `.skilled/commands/doctor/_routes.yaml` — header schema, add-a-target recipe and the sk-code route stanza
- `.skilled/commands/doctor/scripts/sk-code-setup-check.cjs` — full read
- `.skilled/commands/doctor/scripts/tests/sk-code-setup-check.test.cjs` — full read
- `.skilled/commands/doctor/assets/doctor-sk-code-setup.yaml`, `.skilled/commands/doctor/assets/doctor-sk-code-presentation.txt` — matching lines
- `.skilled/commands/doctor/scripts/README.md`, `.skilled/commands/doctor/scripts/tests/README.md` — matching rows
- `.skilled/commands/README.txt` — index row
- `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` — matching entries
- `.skilled/skills/sk-code/README.md`, `.skilled/skills/sk-code/SKILL.md` — reference lines
- review state: `deep-review-config.json`, `deep-review-findings-registry.json`, `deltas/iter-002.jsonl`

## Findings by Severity

### P0

None.

### P1

None.

### P2

**R3-P2-001 — Spec section 3 Files to Change omits three files the change modifies**

- **Claim:** the commit modifies `.skilled/commands/doctor/scripts/README.md`, `.skilled/commands/doctor/scripts/tests/README.md` and `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` — all three carry new rows for this command — yet none appears in the spec's change surface.
- **Evidence:** the Files to Change table `[SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup/spec.md:83]` and the Scope Boundary `[SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup/spec.md:41]` list the command doc, route row, assets, script and test, README.txt rows, three reference lines and the mirrors only; the add-a-target recipe the spec cites `[SOURCE: .skilled/commands/doctor/_routes.yaml:36]` names route/router/presentation/route-validate only; the three omitted files carry new rows — `[SOURCE: .skilled/commands/doctor/scripts/README.md:61]`, `[SOURCE: .skilled/commands/doctor/scripts/tests/README.md:32]`, `[SOURCE: .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json:262]`.
- **Counterevidence sought:** the three files may be required by build conventions (script index, test index, command-contract registry) and their edits are correct; correctness of the edits does not close the gap that the packet's own change-surface table understates the diff.
- **Final severity:** P2 (documentation/bookkeeping; no runtime effect).
- **Confidence:** high.
- **Downgrade trigger:** spec amended to list the three files, or a decision record stating the conventions own them.

## Traceability Checks

### Core — spec_code (REQ to artifact)

| REQ | Artifact | Status |
|-----|----------|--------|
| REQ-001 route `setup`, `mutating: read-only` | route stanza `[SOURCE: .skilled/commands/doctor/_routes.yaml:220]` (target `[SOURCE: .skilled/commands/doctor/_routes.yaml:221]`, mutating `[SOURCE: .skilled/commands/doctor/_routes.yaml:225]`) | Verified |
| REQ-002 every leg passes, exit 0 | battery `[SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:89]`, exit mapping `[SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:325]`, suite case `[SOURCE: .skilled/commands/doctor/scripts/tests/sk-code-setup-check.test.cjs:107]` | Artifact present; run evidence pending ledger S-1 |
| REQ-003 guard leg repair + probe fails on legacy stub | guard judge `[SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:203]`, probe judge `[SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:239]`, suite case `[SOURCE: .skilled/commands/doctor/scripts/tests/sk-code-setup-check.test.cjs:126]` | Artifact present; pending S-2 |
| REQ-004 unprovisioned: precheck with provision command, no stack | provisioning leg `[SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:90]`, skip set `[SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:61]`, suite case `[SOURCE: .skilled/commands/doctor/scripts/tests/sk-code-setup-check.test.cjs:187]` | Artifact present; pending S-3 |
| REQ-005 mirrors + three reference files | README.txt row `[SOURCE: .skilled/commands/README.txt:166]`, sk-code README `[SOURCE: .skilled/skills/sk-code/README.md:122]`, SKILL.md `[SOURCE: .skilled/skills/sk-code/SKILL.md:40]`, contract path `[SOURCE: .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json:201]` | .skilled-side verified; root `README.md` and mirrors deferred |

No orphan requirement, and no requirement lacks an implementing artifact — the gap found is change-surface bookkeeping only (R3-P2-001). Doc, YAML, presentation and script agree on the same eight leg ids in the same order (`[SOURCE: .skilled/commands/doctor/sk-code.md:61]`, `[SOURCE: .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:34]`, `[SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:89]`).

### Core — checklist_evidence

- AC-001..AC-005 `[SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup/acceptance-criteria.md:52]` are 1:1 with REQ-001..005; every row is `Unmet` and the closure statement is `Closeable: No` — the correct pre-close state, since the ledger rows S-1..S-3 accrue after review (spec `[SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup/spec.md:119]`).
- Verification cells name `goal.md` criteria and ledger rows that do not exist yet; nothing is actionable while the packet is open. Not a finding.
- Related, not re-reported: the test-index row claims "one case per leg failure" `[SOURCE: .skilled/commands/doctor/scripts/tests/README.md:32]` while the suite lacks dedicated parent-skill, root-metadata and sync failure cases — the same underlying gap as active R1-P2-004 `[SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup/review/deep-review-findings-registry.json:100]`.

### Overlay

- `skill_agent`: the doc marker `<!-- skill_agent: sk-code -->` `[SOURCE: .skilled/commands/doctor/sk-code.md:6]` matches the owning skill, whose SKILL.md references the command `[SOURCE: .skilled/skills/sk-code/SKILL.md:40]`. Verified.
- `agent_cross_runtime`: runtime command mirrors were not enumerated this iteration (deferred); the spec names the sync script as their generator `[SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup/spec.md:93]`; AC-005 remains pending.
- `feature_catalog_code`: the command-contract lists the command doc path `[SOURCE: .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json:201]` and the invocation alias `[SOURCE: .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json:262]`. Verified.
- `playbook_capability`: no playbook asset in the reviewed surface — not applicable.

### Coverage limits (deferred)

- Root `README.md` reference line not re-read (AC-005 pending).
- Runtime command mirrors not enumerated.
- `goal.md` criteria not cross-read (the acceptance criteria cite them; statuses remain `Unmet`).

## Verdict

No P0 and no P1 this iteration; one new P2 advisory (R3-P2-001), with the six prior P2 advisories still active. PASS — advisories only.

## Next Dimension

maintainability — iteration 4 of 5; the only dimension still uncovered.

Review verdict: PASS
