# Iteration 8

## Focus

Angle 8: Consumers and contracts (Q8).

## Actions Taken

- Read the run config, state log, strategy, and reducer-owned registry without changing reducer state.
- Read the named reviewer agents, review mode contract, shared doctrine, final-line checker, and deep-loop marker guards.
- No live review invocation was run. The source docs name a final-line automation consumer but do not identify every downstream automation; consumers beyond the checked files remain UNKNOWN.

## Findings

### F-iter008-001 — Status-line consumers

**DERIVED — The status line is a fixed automation contract.** @review requires the status line at the absolute end, and its instruction says automation matches that final line. The final-line checker rejects a last line that does not match its exact status pattern. [SOURCE: .skilled/agents/review.md:295] `final line that automation matches`; [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:61] `final line is not an exact status line`. Recommendation: keep the canonical final line stable; map any repo-specific labels to canonical values before rendering. If syntax itself changes, update the reviewer, skill contract, checker, and every automation consumer together. Effort S for a mapping, M for a syntax change; risk medium; needs a decision on whether status labels are configurable. Hub files: none if routing stays fixed. Integrates with @review, the checker, the unnamed automation consumer, and any user-authored mode emitting this report format.

### F-iter008-002 — Prompt marker consumers

**DERIVED — `CODE-REVIEW` is both a prompt marker and a nested-loop guard value.** The prompt assembler must put it in the first two rendered-prompt lines. Deep-review auto and confirm workflows also treat that marker as foreign and use it to detect a nested review dispatch. Changing the marker without updating prompt assembly and both guards can disable mode selection or nested-loop detection. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:66] `first two lines of the rendered prompt`; [SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:1161] `foreign marker (DEEP-RESEARCH or CODE-REVIEW) is`; [SOURCE: .skilled/commands/deep/assets/deep-review-confirm.yaml:1214] `foreign marker (DEEP-RESEARCH or CODE-REVIEW) is`. Recommendation: keep one canonical marker. If aliases are required, synchronize all prompt assemblers and marker scans before enabling them. Effort M; risk high because a missed guard can let a nested review run. Needs a decision on whether another real caller needs a distinct marker. Hub files: none unless mode routing changes. Integrates with @review dispatch, deep-review auto/confirm workflows, and any user-authored mode that identifies review prompts.

### F-iter008-003 — Shared doctrine consumers

**DERIVED — Shared severity semantics cannot safely diverge by reviewer.** `review-core.md` is consumed by both `@review` and `@deep-review`, owns severity identifiers and meanings, and names the deep-review contract as an external consumer. That contract adds loop weights and evidence requirements while keeping the core severity definitions authoritative. A configurable reviewer that changes those meanings or weakens the common baseline would make the two consumers disagree. [SOURCE: .skilled/skills/sk-code/sk-code-review/references/review-core.md:18] `Shared doctrine consumed by both`; [SOURCE: .skilled/skills/sk-code/sk-code-review/references/review-core.md:20] `external consumer: it owns the deep-review loop`; [SOURCE: .skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml:4] `severity ids P0, P1 and P2`. Recommendation: keep P0/P1/P2 meanings and baseline evidence rules as shared floors; allow repo policy to add stricter checks. A configurable severity model would need coordinated changes to the shared doctrine, deep-review contract, agents, validators, and downstream verdict consumers. Effort M for stricter overlays, L for semantic changes; risk high; needs a decision on policy ownership. Hub files: none if the shared doctrine remains the routed resource. Integrates with @review, @deep-review, the deep-review contract, and custom modes that consume review-core.

## Questions Answered

- Q8 Consumers and contracts: which consumers depend on the status line, the CODE-REVIEW prompt prefix and the shared doctrine, and what would a configurable review break?

## Questions Remaining

- Q9 User-authored modes: what does a user's workflow or surface mode (for example a security-only reviewer) need from review, what does review need from it, and which of the eleven integration rows carries it?
- Q10 Repo-local policy and floors: where could a repository keep severity overrides, mandatory checks and ignore paths without forking the hub, which floors may no recommendation relax, and how would a later change be proven through both routing stages?

## Next Focus

Angle 9: User-authored modes (Q9).

