# Iteration 031 — NEW: validate.sh --strict --semantic Check Design (Tier 3 Specification)

**Focus:** Specify exactly what the 6 proposed semantic checks should assert.
**Angle:** Make the drift self-detecting per Root Causes A/B/C (iter 028).

## Findings

Round-1 F-017 proposed 6 checks. Round 2 specifies each as a concrete assertion:

1. **phase-map-status-consistency:** for each phase parent, every child row in the Phase Documentation Map MUST match the child's own spec.md Status. FAIL if parent says Complete but any child row says Draft (catches iter 002).

2. **cross-file-completion-pct-agreement:** within each spec folder, spec.md frontmatter `completion_pct`, plan.md frontmatter `completion_pct`, and implementation-summary.md `completion_pct` MUST agree within ±5. FAIL on >5 divergence (catches iter 003, 008's 0-vs-100).

3. **template-default-content-detection:** scan plan.md/tasks.md/implementation-summary.md for template markers (`[template:`, `last_updated_by: "template-author"`, `Replace template defaults on first save`). FAIL if a Complete-status folder contains any (catches iter 008, 022 — Root Cause C).

4. **packet-id-reference-consistency:** all `Parent Spec`/`Successor`/`Parent Packet`/`packet_pointer` fields and trigger_phrases must reference the CURRENT packet id (from spec.md frontmatter), not predecessor numbers. FAIL on `123-`/`156-` residue (catches iter 007).

5. **adr-folder-completeness:** any folder matching `*-adr/` MUST contain `decision-record.md`. FAIL otherwise (catches iter 009 — 2 of 3 ADRs missing).

6. **comment-hygiene-lint:** scan all `.yaml`/`.cjs`/`.ts` under skills/commands for ephemeral artifact-label patterns (`F-\d+-[A-Z]\d+-\d+`, `<!-- F-`, packet/phase ids in comments). FAIL on match (catches iter 001).

**Implementation:** these are read-only structural checks runnable by `validate.sh --strict --semantic <spec-folder>`. They need no code execution, only grep/parse. Estimated effort: 1-2 days. They would have caught EVERY drift symptom in this packet automatically. This is the highest-leverage prevention investment.

## Evidence
[SOURCE: iter 001,002,003,007,008,009,022 — each check maps to a confirmed live symptom]

## newInfoRatio: 0.9 (each check specified as a concrete assertion with a caught-symptom mapping)
