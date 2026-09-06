---
title: "Goal: Phase 4: grep-convention-doc-retrofit"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit"
    last_updated_at: "2026-09-02T20:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Criteria re-baselined against the ripgrep research"
    next_safe_action: "Write and commit the convention before touching any document"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-049-memory-decommission"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 4: grep-convention-doc-retrofit

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Define a grep-optimized spec-doc convention, enforce it in templates and validate.sh, and retrofit it across every active spec document without changing any document body.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Retrofit all active documents, not new-only; z_archive is excluded |
| D2 | The convention governs canonical frontmatter keys and aliases, an author-controlled trigger allowlist with generic negatives, exact anchor grammar, one-fact-per-line for new structured sections only, and naming rules; prose is never reflowed |
| D3 | The body-preservation invariant is an exact preimage rule: the protected region is the body with whole-line anchor markers removed, hashed before and after |
| D4 | The convention is written and committed before any document is modified |
| D5 | The retrofit is mechanical and idempotent: enumerate every variant, dry-run, process, rescan for residue |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] The convention document exists and predates the first retrofitted file in git history
- [ ] `validate.sh` fails a fixture document that violates the convention
- [ ] Templates produce a conforming document with no manual step
- [ ] The retrofit residue rescan reports zero unresolved variants and no z_archive document was processed
- [ ] A second retrofit run produces no diff
- [ ] Every retrofitted document's body preimage hash is unchanged
- [ ] The trigger index regenerates cleanly with a phrase count at or above the pre-retrofit baseline
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
| Research input | Done | `../005-ripgrep-retrieval-research/research/lineages/luna-max/research.md` sections 6.3, 8, 12 and 16 |
| Spec, plan, tasks and acceptance amended | Done | convention contract sections 13 to 15, REQ-008 to REQ-015, T011 to T028, AC-001 to AC-016; validate --strict 0 errors |
| Convention written and committed first | Done | `grep-convention.md` at `89faec9717`, strictly before the tooling and every corpus pass; registered in the skill `SKILL.md` and README, sk-doc validator 0 issues; the seven points it surfaced resolved in `spec.md` section 13.7 |
| Pipeline, wrapper and validator rule | Done | `retrofit-convention.mjs` with five subcommands, `lib/grep-convention.mjs` holding the classifier, preimage hasher, anchor parser and shared severity table, `rg-wrapper.mjs` with three recipes, and `check-grep-convention.sh` registered always-on with staged severity; commits `d09294c2a9` and `2f3320a6b1` |
| Templates and harness | Done | core, addons and 16 examples conform, 16 scaffold goldens refreshed; suites grep-convention 66, pipeline 27, wrapper 16, rule 19, trigger-index 41 and sweep 29 pass, plus `test-validation.sh` 31/31 and `test-validation-system.cjs` 92 |
| Enumeration and dry-run | Done | 22,094 documents frozen and classified with zero unclassified — missing 10,187, malformed-or-unclosed 1, non-yaml 1, valid-empty 11,882, duplicate 23, oversized 0 — and the 3.96 MB plan diff read on the `specs/agents` track before the first write |
| Corpus retrofit | Done | 14 tracks in sequence, 10,210 written and 0 failures; rescan residue 0; `verify-preimage` 22,094 with 0 mismatches; the diff classifier put all 36,271 changed lines across 10,202 files inside frontmatter, 0 other; a second full run wrote 0 with the diff byte-identical |
| Refusals and repairs | Done | 55 canonical documents withdrawn to their prior content and refused, returning all 26 flipped packets to their prior verdict against the phase-002 commit; 8 flow-mapping policy cards refused; 7 malformed documents hand-repaired preimage-identical |
| Baselines and index | Done | `uniqueNormalizedPhrases` 26,743 before and after, declared members 38,331 to 38,308; the trigger index publishes and regenerates byte-identical at the same sha256, 33,791 unique phrases and 13,096 paths |
| Verification | Done | AC-001 to AC-016 Met; the fleet validator scan reads 7 fail (all malformed, since repaired), 207 warn and 2,585 pass across 2,799 packets, against 319 failing under a flat mapping; generated metadata refreshed for the 212 packets whose canonical documents changed |

### Deviations and findings

| Item | Note |
|------|------|
| Marker retrofit versus no body rewrite resolved | The preimage excludes whole-line anchor markers, so marker retrofit sits outside the protected region by construction |
| In-scope total corrected before the first write | The frozen manifest counts 22,094 documents, not the 22,127 the spec estimated: 184 under hidden backup directories are unreachable by the section 14 recipes and are excluded with a recorded reason |
| Tests are vitest, not the plan's `node:test` | The surrounding spec-kit suites are vitest, so the phase added one runner rather than a second |
| The plan cited an anchor parser deleted in phase 003 | The grammar now lives in `spec.md` section 13.4 and the convention document, and the retrofit parses markers itself against it |
| Large scratch artifacts not committed | `manifest.json`, `preimage-manifest.json` and `plan.diff` are 14 MB of regenerable output; their sha256 digests are recorded in the tasks instead, so the evidence is pinned without the bytes |
| The retrofit's frontmatter classifier is a line-shape heuristic | The validator uses `js-yaml`, so the retrofit's malformed count is a floor and the validator is the authority. The follow-up is to put `js-yaml` behind `classifyVariant` and collapse the two readings into one |
| 55 canonical documents and 8 flow-mapping cards remain reported as `missing` by design | A partial block fails those packets where an absent block only warns, and a block key after a flow mapping stops the parser. An authored block is the only conforming fix, and it is not this phase's work |
| Severity had to be staged before the rule could ship | A flat error mapping put 319 of 2,799 packets in error, most on classes this phase never rewrites, which would have failed unrelated packets' completion gates permanently |
| The 10,000-file commit broke a hook | The post-commit drift-marker hook passed the diff as an argument and overflowed the environment limit; it now streams, fixed in `2f3320a6b1` |
<!-- /ANCHOR:log -->
