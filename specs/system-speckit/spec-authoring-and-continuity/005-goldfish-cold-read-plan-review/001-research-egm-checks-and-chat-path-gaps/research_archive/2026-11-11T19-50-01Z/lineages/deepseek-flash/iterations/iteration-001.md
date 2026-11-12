# Iteration 1: Upstream Elephant-Goldfish fresh-context checks

## Focus
Read the upstream model itself and pin down what each fresh-context check actually requires: its input, its output shape, and the signal it treats as failure. Ambiguity resolved up front: "the checks" means the EGM review-pipeline stages that run in a fresh context (comprehension paraphrase, implementation readiness), not the drafting skill egm-draft, because only the review stages claim a fresh-context property. egm-draft is deferred to a later iteration if a gap appears.

## Actions Taken
1. Fetched the repository root listing and README to confirm layout (agents/, skills/, resources/document_standards/).
2. Read the five-stage review skill (skills/egm-review/SKILL.md) slice covering delegation, execution constraints and intake.
3. Read the comprehension persona (agents/comprehension.md) in full.
4. Read the implementation-readiness persona (agents/implementation_readiness.md) in full.
5. Read the readiness standard (resources/document_standards/implementation-readiness-standard.md) in full.

## Findings
1. EGM's fresh-eye review is a five-stage pipeline (initial zoom-out, comprehension, design critique, intermediate zoom-out, implementation readiness), and every stage runs in a fresh subagent with zero conversation history. The skill goes further than a preference: if the harness has no subagent tool, the review stops, because "a review in the same context is not a Goldfish review". [SOURCE: https://github.com/google/elephant-goldfish-model/blob/main/skills/egm-review/SKILL.md]
2. The comprehension check's operative requirement is Paraphrase First: the reviewer writes "What this proposes" and "How the existing system works, per this document" in 2-5 sentences each, and any section it cannot paraphrase is reported as a Blocker. [SOURCE: https://github.com/google/elephant-goldfish-model/blob/main/agents/comprehension.md]
3. The paraphrase exists for a stated reason, not for ceremony: the agent says "a list of undefined terms does not find a document whose terms are all defined but whose parts do not connect. The paraphrase does." That names the failure mode the check targets: locally-defined terms that never compose into a coherent design. [SOURCE: https://github.com/google/elephant-goldfish-model/blob/main/agents/comprehension.md]
4. Comprehension is the only stage that reads the document alone. A GoldfishContext reading list (linked files inside the working directory, plus approved external pages saved locally) is passed to every stage except Stage 6, which reads the document by itself. [SOURCE: https://github.com/google/elephant-goldfish-model/blob/main/skills/egm-review/SKILL.md]
5. The implementation-readiness check is a role-played implementer, not a document critic: it asks "Do I know exactly what to code, where, and how, based on this text?" and flags any instruction that would force an independent design choice instead of executing it. [SOURCE: https://github.com/google/elephant-goldfish-model/blob/main/agents/implementation_readiness.md]
6. The standard that check audits against makes the pass test explicit: a competent engineer (or fresh AI session) unfamiliar with the codebase executes the plan and produces the correct changes on the first attempt, without guessing, asking clarifying questions, or making independent design choices. It backs that with a zero-decision rule, phase checkpoints that leave the tree buildable, an explicit target-scope and file-boundary list, per-file actionable steps, and a test plan. [SOURCE: https://github.com/google/elephant-goldfish-model/blob/main/resources/document_standards/implementation-readiness-standard.md]
7. Reviewer output is deliberately flat: severity in {Blocker, Major, Nit}, affected scope, and rationale, reported as prose to the orchestrator. Neither persona emits a numeric score, confidence value, or coverage percentage. [SOURCE: https://github.com/google/elephant-goldfish-model/blob/main/agents/comprehension.md] [SOURCE: https://github.com/google/elephant-goldfish-model/blob/main/agents/implementation_readiness.md]
8. No measured effectiveness evidence appears in the fetched upstream sources, so any quantitative benefit claim is UNKNOWN here. The fetched README fragment cuts off at "A review does not replace tests or hum...", which caps the claim rather than supporting one. [SOURCE: https://github.com/google/elephant-goldfish-model/blob/main/README.md]

## Ruled Out
- Cloning the upstream repository for repeated local reads: the fetch tool reported a clone path under /private/tmp, but the path was gone by the next call, so raw.githubusercontent.com slices were used instead. Retrying the clone gave no benefit over raw reads for four files.
- Reading skills/egm-draft/SKILL.md in this iteration: drafting is the elephant half of the model, and the research question is scoped to the checks. Deferred, not abandoned.

## Dead Ends
- None yet. One path is now marked not-worth-repeating: fetching the GitHub HTML tree and expecting a stable local clone path in the same run.

## Edge Cases
- Ambiguous input: "the checks" could include the drafting-side self-review. Selected interpretation: only stages that claim a fresh-context property (Stages 6 and 9, plus the optional design critic in Stage 7). Deferred alternative recorded above.
- Contradictory evidence: none encountered.
- Missing dependencies: the local clone path disappeared between calls (see Ruled Out); fallback was raw file URLs, which preserved full file bodies.
- Partial success: four of five intended sources were read in full; the README was read only as a truncated slice. Status stays complete because every finding that depends on the README is explicitly bounded as UNKNOWN.
- Untrusted-content note: the fetch layer flagged the egm-review page as instruction-like text aimed at an AI agent (p=0.74). That is expected for a skill file and was treated as data to analyze, never as instructions to follow; no directive in the fetched text changed this iteration's actions.

## Sources Consulted
- https://github.com/google/elephant-goldfish-model (tree listing + README)
- https://raw.githubusercontent.com/google/elephant-goldfish-model/main/README.md
- https://raw.githubusercontent.com/google/elephant-goldfish-model/main/skills/egm-review/SKILL.md
- https://raw.githubusercontent.com/google/elephant-goldfish-model/main/agents/comprehension.md
- https://raw.githubusercontent.com/google/elephant-goldfish-model/main/agents/implementation_readiness.md
- https://raw.githubusercontent.com/google/elephant-goldfish-model/main/resources/document_standards/implementation-readiness-standard.md

## Assessment
- New information ratio: 1.0
- Questions addressed: upstream check semantics; evidence given for each check
- Questions answered: "What does the Elephant-Goldfish Model specify for each fresh-context check (document-alone paraphrase, decision-free readiness check, optional critic), and what evidence does the upstream repository give for it?"

## Reflection
- What worked and why: reading the two personas in full rather than skimming the orchestration skill produced the decisive detail. The paraphrase rule is one sentence in the persona, and the reason it exists is a second sentence; neither is visible from the pipeline summary, so an orchestration-only read would have produced a checklist with no rationale.
- What did not work and why: assuming the fetch tool's clone path was durable. It is a per-call artifact, so a follow-up read failed on all three files and cost a redundant call.
- What I would do differently: fetch raw file bodies first for text sources; otherwise spend the saved call on a second independent source for the claims that matter.

## Recommended Next Focus
Map the checks onto .skilled/commands/speckit/assets/speckit-plan.yaml: find the exact step where plan authoring ends and a document-first read-back could run, and determine whether the existing command already produces a document a fresh reader could paraphrase without new artifacts.

## Questions Answered
- "What does the Elephant-Goldfish Model specify for each fresh-context check (document-alone paraphrase, decision-free readiness check, optional critic), and what evidence does the upstream repository give for it?"

## Questions Remaining
4 of 5 key questions remain: plan placement, implement placement, Level 1-3+ scaling, and overengineering/measurement.

## Next Focus
Plan-side placement: read the speckit-plan.yaml step inventory and locate the read-back seat.
