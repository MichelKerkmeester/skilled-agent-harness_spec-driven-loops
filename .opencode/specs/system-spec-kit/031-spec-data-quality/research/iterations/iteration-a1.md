# Iteration A1 - Adherence EARS plus Constraints (mimo, template-path feasibility)

## TITLE

Cohort A1 adherence angle. Model mimo. Angle tests whether EARS sentence patterns plus an Osmani three-tier constraint block in the spec templates reduce agent ambiguity, and what the honest adherence ceiling is.

## FINDINGS

Current state is prose tables with no structured requirement language. `spec.md.tmpl` requirements live in a `| ID | Requirement | Acceptance Criteria |` table with free-form prose in both columns (`:94-105` L1, `:239-250` L2, `:464-475` L3, `:711-722` L3+). The only structure is the REQ-NNN id prefix and P0/P1/P2 headings. Level 3 user stories use GIVEN/WHEN/THEN in acceptance criteria (`:554`) but the main requirements table does not. `checklist.md.tmpl:58-61,208-211,430-433` uses unstructured `- [ ] CHK-XXX [Priority] Description`. A real spec in the wild (`001-skreview-checklist-rows/spec.md:82-86`) faithfully follows the template with short noun-phrase requirements and prose acceptance criteria, no EARS, no constraint block. The template SELF-CHECK at `spec.md.tmpl:39` warns about vague acceptance criteria but gives no structural tool to prevent it, so the failure mode it names is the one the format permits.

EARS (Alistair Mavin, https://alistairmavin.com/ears/) provides five testable patterns: Ubiquitous (the system shall), State-driven (While), Event-driven (When), Optional (Where) and Unwanted (If-then). Osmani's three-tier block (`stage-0-external-findings.md:23`) adds always, ask-first and never behavioral tiers. The honest ceiling is explicit at `stage-0-external-findings.md:25`. No spec format fully guarantees agent adherence, pair structure with self-verification gates (Fowler and Bockeler cited). EARS makes requirements more parseable and less ambiguous, the improvement is ambiguity reduction not adherence guarantee.

## CONCRETE CHANGE

On-write template change:
1. Add an EARS pattern hint to the requirements table header in spec.md.tmpl, swapping `[Requirement description]` for `Requirement (EARS: Ubiquitous / While / When / Where / If-then)`.
2. Add a three-tier constraints section between requirements and success criteria with an ALWAYS / ASK-FIRST / NEVER table.
3. Add `- [ ] CHK-REQ-001 [P0] Requirements use EARS patterns; constraints block populated` to checklist.md.tmpl.

Retroactive lint pass:
4. A linter rule (validate.sh extension or markdownlint custom rule) that flags requirements rows whose Requirement column does not start with one of The system shall, While, When, Where or If. Soft warning not a blocker since existing specs will not match.

## EVIDENCE

- Prose requirement tables: `spec.md.tmpl:94-105,239-250,464-475,711-722`. Real spec follows prose: `001-skreview-checklist-rows/spec.md:82-86`. Unstructured checklist: `checklist.md.tmpl:58-61`.
- EARS five patterns: `stage-0-external-findings.md:20`, https://alistairmavin.com/ears/. Three-tier block: `:23` (Osmani always, ask-first, never). Adherence ceiling: `:25` (Fowler/Bockeler).
- 3-result floor preamble: production retrieval truncates every query to a 3-result floor.

## READER

Adherence primary beneficiary. An agent reading When [event], the system shall [response] has less room to hallucinate scope than [Requirement description], and the ALWAYS/NEVER block is directly enforceable as guardrails. Logic secondary since the constraints block makes behavioral invariants explicit and surfaces cross-artifact gaps (spec says NEVER but checklist does not check it). Retrieval modest since EARS produces more uniform chunk text but the benefit depends on how many chunks change.

## ON-WRITE OR RETROACTIVE

On-write template is the high-ROI path so every new spec gets structure by default, roughly 20 lines across 4 level variants. Retroactive is a soft linter warning only, do not block since existing specs are already consumed. Surface specs that would benefit on their next revision.

## RISK

Template bloat adds about 10 lines per spec which is meaningful for Level 1 (consider optional for L1, required for L2+). EARS rigidity can produce awkward phrasing for simple declarative requirements so the hint should be a guide not a hard gate. No adherence guarantee, the brief ceiling is real, an agent can still ignore a well-formed constraint block. Retroactive lint is noisy since existing specs hold hundreds of prose requirements, without a migration path the warnings become noise. The 028 lesson applies, if the retrieval improvement is modest (EARS does not change the top-3) it will not move the production path so the adherence gain (constraints block) is the more reliable win.
