# Iteration 1 - Clarity rules 01-05

## Focus

This pass tests whether Clarity's first five rules add obligations before sentence-level editing. The current stack's strongest comparison point is reader triage and first-line payload ordering.

## Findings

- **Clarity 01, write for one pictured person, already-covered.** The source asks the writer to choose a specific audience and role before drafting. `presenting-decisions.md` already says to decide who will read, what they hold and what they need before the first sentence. Candidate owner is the named existing repo rule `repo-rules/presenting-decisions.md`, with no new clause required. [SOURCE: `specs/sk-communication/006-sk-communication-clarity/context/clarity.md:34-42`; `repo-rules/presenting-decisions.md:90-100`]

- **Clarity 02, model what the reader brings and needs, already-covered.** The source defines the gap between existing and needed context as the piece's obligation. The repository uses the same gap as its reader-triage test. Candidate owner is `repo-rules/presenting-decisions.md`. [SOURCE: `specs/sk-communication/006-sk-communication-clarity/context/clarity.md:45-50`; `repo-rules/presenting-decisions.md:92-100`]

- **Clarity 03, choose one arguable takeaway, new.** The source requires one central claim, stated near the beginning and open to disagreement. The current stack requires a first-line payload and a verdict-first decision, but it does not require one claim for every piece of prose. Candidate owner is the named existing repo rule `repo-rules/presenting-decisions.md` if the requirement is limited to decision-bearing work. A general article-level rule would need a new repo rule because the current communication rule governs reply shape rather than the number of claims. [SOURCE: `specs/sk-communication/006-sk-communication-clarity/context/clarity.md:52-61`; `repo-rules/communication.md:136-145`; `repo-rules/presenting-decisions.md:48-63`]

- **Clarity 04, say something only the author could say, already-covered.** The source tests borrowability and asks for observed details, measured numbers, incidents and changed beliefs. The wording standard has the same borrowability test and asks for facts or examples. Candidate owner is the wording standard at `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md`. [SOURCE: `specs/sk-communication/006-sk-communication-clarity/context/clarity.md:62-69`; `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:93-103`]

- **Clarity 05, make every sentence pay, already-covered.** The source rejects repetition, throat clearing and empty introductions or conclusions. `communication.md` removes empty openers and restated summaries, while the prose rule requires information-bearing sentences. Candidate owner is `repo-rules/communication.md`, with `repo-rules/prose-mechanics.md` as the sentence-level companion. [SOURCE: `specs/sk-communication/006-sk-communication-clarity/context/clarity.md:71-78`; `repo-rules/communication.md:101-116`; `repo-rules/prose-mechanics.md:38-47`]

## Boundary decision

The reader-model rules are not new merely because they occur before drafting. The repository's decision rule explicitly places reader triage before the first sentence. The single-arguable-takeaway rule remains new because first-line payload and verdict-first order describe placement and decision handoff, not a one-claim content constraint. [SOURCE: `repo-rules/presenting-decisions.md:90-100`; `repo-rules/communication.md:136-145`]

## Convergence telemetry

Pre-cap convergence is treated as continue. New-information estimate is 0.72 because rules 01 and 02 were resolved by an explicit pre-draft stack clause, while rule 03 exposed a content-level gap. The max-iterations policy keeps the loop open. [SOURCE: `deep-research-config.json`; `deep-research-strategy.md`]

## Next focus

Map Clarity rules 06-18, with special attention to explicit relations, paragraph progression and the rewrite-by-cutting rule.
