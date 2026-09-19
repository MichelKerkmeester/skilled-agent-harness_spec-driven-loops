# Iteration 1: The checklist.md failure class

focusTrack: not-reality

## Focus

Class one, not reality: the confirmed specimen. Which AGENTS.md lines instruct loading, marking, or expecting `checklist.md`, what does the scaffolder actually produce at every level, and where does the closure decision actually live? (Strategy question Q1.)

## Actions Taken

1. Read the gateway's projected state log after the config record (1 line: the config record, gateway-canonicalized).
2. Inventory: `rg -n "checklist" AGENTS.md` over the full 496-line document.
3. Located the scaffolder: `.opencode/skills/system-spec-kit/runtime/cli/spec/create.sh`; read its level-architecture header and its contract-doc scaffolding function.
4. Located the level-requirements vocabulary: `template-mapping.md` (the acceptance-criteria / verification-checklist expectations and the AC_CLOSURE enforcement); confirmed `references/structure/folder-structure.md` (the authority AGENTS.md:372 routes to for "Which docs does that level require?") never mentions `checklist.md`.
5. Census over the whole specs tree, with a positive control for the finder itself.
6. Corroborated on this packet: 055's tasks.md verification sections, acceptance-criteria.md closure language, and spec.md's closure-gate sentence.

## Findings

Every finding below is OBSERVED (a path, line, or command output read this session) unless marked otherwise. Read time of AGENTS.md: 2026-09-14T03:59Z, this working tree.

- **F-001 (OBSERVED) — the occurrence inventory.** AGENTS.md references `checklist.md` as a completion artifact in exactly five places: [SOURCE: AGENTS.md:263] ("2. Load `checklist.md` → verify ALL items → mark `[x]` with evidence.", step 2 of the COMPLETION VERIFICATION RULE), [SOURCE: AGENTS.md:266] ("`plan.md` / `tasks.md` / `checklist.md` evidence rows"), [SOURCE: AGENTS.md:270] ("Skip: Level 1 tasks (checklist.md is optional at every level)"), [SOURCE: AGENTS.md:303] (Self-Check: "Claiming completion? `checklist.md` verified?"), and [SOURCE: AGENTS.md:463] (the claim-completion workflow row: "validate.sh <spec-folder> --strict → checklist all items → reconcile metadata", the verb form without the extension). A sixth hit at [SOURCE: AGENTS.md:213] is the unrelated phrase "a checklist to recite". The invocation's "at least five places" is confirmed: five counting the verb form at 463, four bearing the literal string `checklist.md`.
- **F-002 (OBSERVED) — what the scaffolder produces.** The scaffolder's own header states the level architecture and never lists a checklist document: "L1: Essential what/why/how - spec, plan, tasks; summary follows lifecycle"; "L2: +Quality gates, verification - merged into tasks.md"; "L3: +Architecture guidance - decision-record.md is on-demand" [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/spec/create.sh:12-16]; the L1 help text repeats it: "Files: spec.md, plan.md", "Lifecycle: implementation-summary.md after implementation starts", "Adds: verification/testing sections in tasks.md" [SOURCE: create.sh:304-308]. Its `scaffold_contract_docs` adds `acceptance-criteria.md` "at every level whose contract lists it", with the comment: "The closure gate needs this document at every level whose contract lists it as an optional add-on. Without it the scaffolder would emit packets that fail validation the moment they are created." [SOURCE: create.sh:450-456]. The templates tree carries the mechanism: `find .opencode/skills/system-spec-kit/templates -name "*checklist*"` returns nothing (all depths, this session).
- **F-003 (OBSERVED) — the verification checklist's new home and the closure gate.** The template contract says it directly: "acceptance-criteria.md: one row per criterion, each Met, Waived or Superseded before the packet may close; the verification checklist lives in tasks.md", with enforcement: "AC_CLOSURE fails when acceptance-criteria.md is absent from a packet created after 2026-08-30" [SOURCE: .opencode/skills/system-spec-kit/assets/template-mapping.md:159,161]. The packet's own documents agree: 055's tasks.md carries `## Verification Checklist` (line 109), `## Verification Protocol` (112), `## Testing Checklist` (145), and `## Verification Summary` (199) [SOURCE: specs/sk-doc/055-governance-doc-alignment/tasks.md:109-199]; 055's acceptance-criteria.md describes itself as "The criteria this packet must satisfy before it may be closed" [SOURCE: specs/sk-doc/055-governance-doc-alignment/acceptance-criteria.md:3]; and 055's spec.md states: "Acceptance criteria for these requirements live in `acceptance-criteria.md`, which is the document that decides whether this packet may close." [SOURCE: specs/sk-doc/055-governance-doc-alignment/spec.md:124-125].
- **F-004 (OBSERVED) — the census.** Across the entire specs tree: 1203 packet directories at depth 3, 0 files named `checklist.md`, 283 files named `acceptance-criteria.md`, and 4185 files named `spec.md` as the positive control proving the finder works [SOURCE: this session's find/rg census]. The depth-3 count excludes nested phase children, which raises the true packet count; the direction of the error is conservative for a 0-count claim.
- **F-005 (OBSERVED) — the requirements authority agrees.** `references/structure/folder-structure.md`, the exact reference AGENTS.md:372 sends readers to for "Which docs does that level require?", contains zero occurrences of the string `checklist.md` [SOURCE: rg -c over that file, this session]. `template-mapping.md:70` retains it only in the phase-parent prohibited/legacy list ("Prohibited at parent (live in children only): plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md"), which describes what must NOT sit at a phase parent, not what any level receives.

**Class verdict: class one (not reality), five occurrences, no other class-one instance inside this specimen's scope.** The completion rule (AGENTS.md:260-270) directs: run validate.sh, then "Load `checklist.md` → verify ALL items". Step 2 of that rule names a file the scaffolder never creates at any level, and the same rule's steps 1 and 3 never name `acceptance-criteria.md`, the document that decides closure. The referenced-but-unnamed reality: the verification checklist lives inside tasks.md and the closure gate is acceptance-criteria.md.

## Questions Answered

- Q1 answered: occurrence inventory (5 places), scaffolder reality (never a checklist.md at any level; verification merged into tasks.md; acceptance-criteria.md the closure gate), census (0/1203+), requirements-authority agreement.

## Questions Remaining

- Q2: class-one instances beyond checklist.md (next iteration).
- Q3, Q4, Q5: class-two specimens, the five named candidates, and the section 6 shape question.

## Sources Consulted

- AGENTS.md (496 lines, this working tree, read in full at 2026-09-14T03:59Z; targeted re-reads this iteration)
- .opencode/skills/system-spec-kit/runtime/cli/spec/create.sh (header, help text, scaffold_contract_docs)
- .opencode/skills/system-spec-kit/assets/template-mapping.md (lines 68-72, 157-161)
- .opencode/skills/system-spec-kit/references/structure/folder-structure.md (rg -c)
- .opencode/skills/system-spec-kit/templates/ (find, all depths)
- specs/ tree census (find); specs/sk-doc/055-governance-doc-alignment/{tasks.md,acceptance-criteria.md,spec.md}
- This lineage's gateway receipt and projected state log

## Assessment

- newInfoRatio: 1.0
- Novelty justification: first evidence iteration of this lineage; every finding, the census, and both ruled-out directions are new to this packet, nothing was previously recorded here.
- Confidence: the occurrence inventory, the scaffolder's header and comment, the template contract, and the census are OBSERVED. INFERRED, with what would confirm it: that no scaffolder code path writes checklist.md at runtime, because the census proves absence on this tree's current 1203-packet state but not future scaffolder versions; confirming it means reading every `copy_template` target, which the templates-tree finding (zero checklist templates, all depths) already constrains.

## Reflection

What worked: chaining the occurrence inventory (rg) into the producer's own evidence (the scaffolder header, the template contract) and then the consumption-side census; the scaffolder's own comments carried the closure-gate sentence, which is stronger than inferring it from the packet.
What failed: the first compound bash invocation (variable assignment plus a multi-branch chain) was rejected by the runner's dispatch wrapper ("Pi dispatch denied: the command does not prove one direct executor"); repaired by re-running it as a simpler `cd && command` chain. No finding was lost.
Ruled out (see deltas/iter-001.jsonl): checklist.md produced at some level; checklist.md required by the level-requirements authority.

## SCOPE VIOLATIONS

None. Every write this iteration stayed inside the lineage directory.

## Recommended Next Focus

Iteration 2: class one beyond checklist.md, the existence-and-behavior sweep. Every named path, script, command, flag, and threshold in AGENTS.md that has not yet been verified: the shared classifier, the retrieval and validation references, the compiled continuity writer, the agent-directory table, the command roster, and the referenced rule files. Mark each OBSERVED (exists, read) or INFERRED, and record the failures as the findings.
