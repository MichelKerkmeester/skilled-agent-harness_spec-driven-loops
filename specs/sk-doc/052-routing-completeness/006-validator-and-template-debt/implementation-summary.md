---
title: "Implementation Summary: Validator and template debt"
description: "Three checks passed because they never looked. The voice scanner skipped the fenced payload that is a template's entire output, the document validator blocked on fixtures the packaging gate already exempts, and a corrected template left 56 documents carrying what it used to emit."
trigger_phrases:
  - "validator template debt summary"
  - "template payload scanning"
  - "fixture exemption validator"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/006-validator-and-template-debt"
    last_updated_at: "2026-09-04T00:00:00Z"
    last_updated_by: "phase-6-validator-and-template-debt"
    recent_action: "Swept the template backlog and recorded the exemptions that stay"
    next_safe_action: "Build the exemption mechanism the scanner still lacks"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/templates/core/plan.md.tmpl"
      - ".opencode/skills/sk-doc/sk-create-repo-rule/assets/repo-rule-template.md"
      - ".opencode/skills/sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-006-validator-and-template-debt"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "The scanner cannot express an exemption, so the fourteen recorded ones are re-reported by every scan"
    answered_questions:
      - "The template backlog is swept: 509 blockers across 41 detected templates fall to 22 across 8"
      - "The document validator now carries the fixture exemption the packaging gate already had"
      - "The boilerplate count was 56 planning documents, not 48"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/052-routing-completeness/006-validator-and-template-debt |
| **Level** | 3 |
| **Status** | Complete |
| **Delivery** | Shipped. The parent goal LOG records this phase Done |
| **Date** | 2026-09-02 (git author dates of `c1b3b780c3`, `9ae247d772`, `d87e8dd162` and `d229b0a24d`) |
| **Register findings** | 29 and 30 read Fixed. 26, 27 and 28 remain Planned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three instances of one pattern, and the pattern is worth more than any of the three: a check
that passes because it never looked.

### A template scores clean and seeds what it emits

The voice scanner skips fenced content by default. That is right for a document quoting a
command and exactly wrong for a template whose entire output is a fence. **Twenty-four of
forty templates in this tree scored clean while seeding blockers into everything authored
from them.** One of them scores zero blockers and emits forty-three.

Two seeded blockers were found and fixed at the template first. `c1b3b780c3` corrected a rule
template that emitted the binding sentence with an em dash on the one line its own contract
calls fixed and verbatim, which every rule authored from it would have inherited. All nine
shipped rules use the other form. `9ae247d772` removed a semicolon and a serial comma from
the plan template's scaffold line, which is why three files in one packet failed on the same
line at the same column.

`d229b0a24d` then made a template detectable by name and location so its payload is read.
Measured properly, **45 of 53 templates carry a real blocker**. That backlog is recorded
rather than swept, because rewriting a payload changes what the template emits.

### A validator blocking on the fixtures it should exempt

The document validator blocked on scanner fixtures whose bytes are pinned by tests asserting
findings on specific line numbers. Padding a scanner input to satisfy a validator breaks the
thing it exists to test, and the packaging gate already exempted fixture trees on exactly
that reasoning. `d229b0a24d` moved the same exemption into the validator. Across every
tracked markdown file it releases **485 files**, and every one of the 485 carries a
fixture-tree reason checked by program rather than by eye.

### Sixteen documents with no overview section

The shared validator blocks on a missing overview and the packaging gate passes the same
files, so nothing caught this. `d87e8dd162` fixed fourteen and left two alone, both scanner
fixtures covered by the exemption above.

The obvious fix was wrong and got reverted. Renumbering each document to open on section one
silently breaks addresses, because section numbers are cited across files including from
documents this change was not allowed to touch. Where a number is cited anywhere, the
overview went into a zero slot the tree already uses elsewhere. Where nothing cites it, the
prescribed numbering applies. Every citation still resolves. Content was reorganised rather
than re-argued: in ten files the overview body is the document's own second paragraph
promoted under a heading, and five short sentences were authored where no overview existed.

### The boilerplate count was wrong

The finding said forty-eight planning documents carried a line the plan template stopped
emitting. **It was fifty-six.** Every one dropped by exactly one blocker and none rose. The
fifty-seventh match is the acceptance criterion describing this very task, which is why a
grep for the phrase still returns one file today.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/sk-create-repo-rule/assets/repo-rule-template.md` | Modified (`c1b3b780c3`, `d87e8dd162`) | Em dash removed from the verbatim binding line, and an overview section added |
| `.opencode/skills/sk-doc/sk-create-repo-rule/references/rule-anatomy.md` | Modified (`c1b3b780c3`) | Measured table re-derived after five of nine rows drifted as the corpus grew |
| `.../sk-create-with-human-voice/references/scope-and-exemptions.md` | Modified (`c1b3b780c3`) | The mode now says to scan a template with `--include-code`, and to read a zero without it as unmeasured |
| `.opencode/skills/system-spec-kit/templates/core/plan.md.tmpl` | Modified (`9ae247d772`) | Scaffold line stripped of a semicolon and a serial comma |
| `.../tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap` | Modified (`9ae247d772`) | Golden snapshots re-captured against the corrected template |
| Thirteen reference and readme files under `sk-create-chart`, `sk-create-repo-rule` and `sk-create-with-human-voice` | Modified (`d87e8dd162`) | Overview sections added, ten promoted from existing prose and five authored |
| Fifty-six `plan.md` files across `specs/` | Modified (`d229b0a24d`) | The superseded scaffold line replaced, each dropping exactly one blocker |
| The document validator and the voice scanner | Modified (`d229b0a24d`) | Fixture-tree exemption added, and template payload scanning enabled by name and location |
| Thirty-seven templates across `sk-doc`, `cli-external-orchestration`, `sk-design-md-generator` and `sk-git` | Modified (2026-09-04) | The authorized sweep. 501 blockers under `.opencode/` fall to 14 exemptions, 354 of them guidance and 147 emitted |
| `.../sk-create-skill/assets/parent-skill/scaffold/hub-skill-scaffold.md` | Modified (2026-09-04) | The compiled-routing directive is asserted byte-identical against the hub template, so it took the same edit |
| `.../cli-opencode/manual-testing-playbook/prompt-templates/templates-inventory.md` | Modified (2026-09-04) | Its scenario greps for the template heading separator, which the sweep changed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each fix went to the thing that keeps producing the defect before it went to the documents
the defect had already reached. The template was corrected first, then the files it seeded.
That ordering is why the plan-template commit deliberately left the existing plans alone and
called them a backlog: rewriting shipped planning documents is a different act from fixing
the generator.

Every count in this phase was re-derived rather than inherited. The forty-eight became
fifty-six, the anatomy contract's measured table was re-derived and survived, and the
template blocker count went from an unmeasured zero to forty-five of fifty-three once the
payload was read. That habit is the phase's actual output.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A template's fenced block is the deliverable, so the scanner reads the payload | A template is the one document where the fence is the output. A clean score without payload scanning means unmeasured, not clean |
| The document validator exempts what the packaging gate already exempts | The packaging gate's reasoning was already right, that a fixture holds the shape it exercises. Two gates disagreeing about what a fixture is was the defect |
| Boilerplate is corrected at the template first, then in the documents it seeded | Fixing the copies while the generator keeps emitting them buys nothing |
| The template payload backlog is recorded, not swept | Rewriting a payload changes what the template emits, which is a review-bearing change rather than a cleanup |
| Overviews go in a zero slot where a section number is cited | Renumbering to open at one silently breaks citations from files this change could not touch. That attempt was made and reverted |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Every command below was run and its output read.

| Check | Result |
|-------|--------|
| Seeded-blocker negative control on a template | An em dash inserted inside a template fence is caught, and removing it passes. This is what AC-002 asks for |
| `validate_document.py` on both voice fixtures after the exemption | Exits 0, and the packaging gate still exempts fixture trees. This is what AC-001 asks for |
| Fixture exemption breadth, across every tracked markdown file | Releases 485 files, each carrying a fixture-tree reason verified by program rather than by eye |
| Full template re-score with payload scanning on | 45 of 53 carry a real blocker, against 24 of 40 in this tree before the scanner change |
| `grep -rl` for the superseded plan-template scaffold sentence across `specs/` | Returns one file, `006-validator-and-template-debt/acceptance-criteria.md`, which is the criterion describing this task. AC-003 is materially met. The literal is not repeated here, so that this summary does not become a second match |
| Blocker delta across the 56 rewritten plans | Every file dropped by exactly one and none rose |
| Rule anatomy contract re-derivation | Five of nine rows had drifted, and the conclusion survived re-derivation |
| `scaffold-golden-snapshots.vitest.ts` after the plan template change | Snapshots re-captured and passing |
| `validate.sh specs/sk-doc/052-routing-completeness --strict --recursive` | PASS for this folder, Errors 0 |
| Full fleet re-scan before and after the sweep | 509 blockers across 41 of 54 detected templates fall to 22 across 8. Under `.opencode/`, 501 to 14 |
| Fence-position comparison against a pre-sweep copy of all 37 swept templates | Every changed line sits in the same position class before and after. No fence boundary moved and no `json` payload changed |
| `validate_document.py` issue count, file by file across all 37 | Identical before and after |
| Nine consumer suites, each run before and after | All identical to baseline, including the pre-existing exit 1 from `validate_catalog_package.py` on the same 1162 lines |
| `hvr_scan.py` on this document | 0 hard blockers |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

**The template backlog is swept, and fourteen occurrences stay on purpose.** The operator
authorized the rewrite on 2026-09-04 with one condition: each emitted change has to be an
improvement, not a quieter scan. 509 blockers across 41 of 54 detected templates fell to 22
across 8. `research/template-triage.md` section 12 carries the result per file, a one-line
improvement judgment for every template whose payload changed, and the class and reason for
each of the fourteen that remain under `.opencode/`. Those fourteen are a component name the
standard bans, a line that quotes the ban list to teach it, a verbatim historical description,
two heading identifiers hardcoded in a builder, and an HTML entity.

**The recorded count moved four times, and one leg of it does not reproduce.** The 45 of 53 was
repo-wide. Re-running the pre-fix scanner over the same file set returns 44 of 53, one file lower,
with the rule set held fixed as a control. The masking fix in `82938b3e1c` took the fleet to 41
of 53 repo-wide and 38 of 50 under `.opencode/`, the emitted-frontmatter ruling in `cac56b9082`
took the occurrence count from 530 to 509 without moving the file count, and the sweep then took
it to 22 across 8.

**Three detected templates under `specs/` were left alone.** Two sit in a `z_archive` tree and
the third is a shipped research asset. `scope-and-exemptions.md` section 3 puts a shipped spec
document out of scope because its bytes are the record of what was decided, and they are outside
this packet's write scope besides. They hold eight occurrences between them.

**The scanner still cannot express an exemption.** Every one of the fourteen will be re-reported
by the next scan, because the record lives in a research document the tooling never reads. The
triage names the two candidate mechanisms and argues for the allowlist.

**The acceptance criteria rows read Met.** All four conditions hold, and each row's Verification
cell names the run that observed it.

**Findings 26, 27 and 28 remain Planned in the register.** Finding 27, the fixture exemption,
is closed by `d229b0a24d`. Finding 28's count was corrected from forty-eight to fifty-six and
the rewrite shipped. Finding 26 is the live backlog. The register was not revised to match.

**Two scanner fixtures still have no overview section, on purpose.** Their bytes are pinned
by tests that assert findings on specific line numbers, and the exemption is the fix rather
than the workaround.

**The fleet figure and the tree figure are different numbers.** Twenty-four of forty described
this tree before the sweep. The fleet figure is now 8 of 54, and 5 of those 8 are exemption files
under `.opencode/`. Quoting one for the other overstates or understates the debt.

**The documents these templates already seeded are still uncorrected.** Fixing a generator does
not fix its copies, and phase 6 fixed the generator first on purpose. No count of affected
documents was taken, and the shipped behavior-benchmark scenarios are the visible case: their H1
separator now differs from what the template emits.
<!-- /ANCHOR:limitations -->
