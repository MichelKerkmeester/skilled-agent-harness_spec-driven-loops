# Iteration 1 — Repo-bound inventory

## Focus

Angle 1: Repo-bound inventory (Q1), limited to the review mode's .skilled/ markers, agent and tooling paths, cache location, and stack-specific path patterns.

## Actions Taken

1. Read the run config, state log, and strategy before selecting the focus. The run has no prior canonical iteration record; the strategy names Q1 as iteration 1's focus.
2. Inspected the review skill's surface detector, integration paths, cache contract, and minimum-evidence skip taxonomy.
3. Searched the review references, assets, and scripts README for .skilled/ paths, cache conventions, and file or directory patterns.
4. Compared internal resource resolution with the packet's documented agent, validator, and script invocation paths.

## Findings

### F-001 — Surface signal is framework-specific

DERIVED — The detector uses the fixed .skilled/ path marker as its positive surface signal. It returns SKILLED when a workspace or changed path starts with .skilled/ or contains /.skilled/; the fallback explicitly says generic package.json or src/ alone is UNKNOWN. The marker is a constant rather than a detector argument, so this entrypoint does not expose a per-repository marker setting. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:221] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:223] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:225] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:238] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:240]

### F-002 — Resource lookup travels with the packet; operational paths assume this repository layout

DERIVED — Review references and assets resolve from SKILL_ROOT, with the root derived from the skill file and resource directories kept relative to it. The integration and verification guidance also names .skilled/agents/review.md, .skilled/skills/sk-doc/scripts/validate_document.py, and root-relative .skilled/skills/sk-code/sk-code-review/scripts/... commands. This makes the packet's own resource lookup portable when installed as a unit, while those agent, validator, and command examples depend on the repository's .skilled/ layout. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:129] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:131] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:472] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:484] [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/README.md:31] [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/README.md:34]

### F-003 — Cache base is configurable; cache identity depends on the Git origin

OBSERVED — The M-1 cache path is XDG_CACHE_HOME or, by default, $HOME/.cache, followed by sk-code-review/<repo-ref>.jsonl, outside the reviewed repository. The base location can follow XDG_CACHE_HOME or fall back to $HOME/.cache; <repo-ref> is the first 12 hex characters of a SHA-256 hash of git remote get-url origin. The reviewed docs do not specify a fallback when origin is absent. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:502] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:503] [SOURCE: .skilled/skills/sk-code/sk-code-review/references/pr-state-dedup.md:43] [SOURCE: .skilled/skills/sk-code/sk-code-review/references/pr-state-dedup.md:47]

### F-004 — Sensitive-path rules are cross-repository globs with fixed stack-specific entries

DERIVED — M-2's sensitive-path table is written as literal filename and directory patterns: it includes manifests from npm, Rust, Python, and Ruby projects, plus TypeScript-specific *db*.ts and *.handler.ts patterns and /db/, /migrations/, /handlers/, /routes/, and /api/ directories. The asset checklist also uses a fixed *.ts, *.js, and *.md search for consumer coverage; its other file-location examples are generic placeholders. The minimum-line threshold is opt-in through SK_CODE_REVIEW_MIN_CHANGED_LINES, but the reviewed gate does not provide a repository-specific pattern override. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:522] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:530] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:534] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:539] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:548] [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/fix-completeness-checklist.md:69] [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/removal-plan.md:50]

## Questions Answered

- Q1 Repo-bound inventory: which `.skilled/` markers, agent paths, cache locations and stack-specific path patterns does the sk-code-review packet hold, and is each portable, configurable or repo-bound?

## Questions Remaining

- Q2 UNKNOWN-surface path: what does a review do when the surface is UNKNOWN, how much of the baseline stays useful, and how could a repository declare its own surface evidence?
- Q3 Output contract: which parts of the review output contract raise signal and which add ceremony or parse risk (Case line, finding class, scope proof, riskScore, Not checked line, final status line)?
- Q4 Usefulness evidence: what does review catch, cost and miss in the repository's own benchmark reports, playbook scenarios and changelog?
- Q5 PR-state efficiency gates: how portable and configurable are the content-hash dedup, the minimum-evidence gate and the depth alias for a repository with no remote, a monorepo or other file naming?
- Q6 Review and quality boundary: does review read what the quality gate checked, who reports and who fixes, and how do the shared checklist name and the tie-break order divide the work?
- Q7 Surface packets: how is surface evidence applied in review, does a workflow diff get the CI rules, and could a surface declare the evidence review should read?
- Q8 Consumers and contracts: which consumers depend on the status line, the CODE-REVIEW prompt prefix and the shared doctrine, and what would a configurable review break?
- Q9 User-authored modes: what does a user's workflow or surface mode (for example a security-only reviewer) need from review, what does review need from it, and which of the eleven integration rows carries it?
- Q10 Repo-local policy and floors: where could a repository keep severity overrides, mandatory checks and ignore paths without forking the hub, which floors may no recommendation relax, and how would a later change be proven through both routing stages?

## Next Focus

Iteration 2: Angle 2, UNKNOWN-surface path (Q2).

## Reflection

The review packet separates portable, packet-relative resource lookup from repository-specific integration pointers. Its cache location has one documented environment override, while the key depends on a Git remote; its safety path taxonomy remains a shared static list.

## SCOPE VIOLATIONS

- scope_violation: The research skill normally updates research/research.md when progressiveSynthesis is true, and this run config sets it to true. That synthesis file is outside the dispatch's explicit write allowlist, so it was left untouched. [SOURCE: specs/sk-code/014-code-modes-research/002-review-mode-research/research/deep-research-config.json:15] [SOURCE: .skilled/skills/system-deep-loop/deep-research/SKILL.md:308] [SOURCE: .skilled/skills/system-deep-loop/deep-research/SKILL.md:309]

## Status

- Findings: 4
- newInfoRatio: 1.0
- Questions answered: 1 of 10
- Status: insight

## Verification

- Append gateway committed event event-9f294002-fd7a-4960-a9da-52c6365a322e (sequence 4) and refreshed the state projection with one iteration 1 record. The gateway warned that trusted evidence yield was absent and remains zero.
- The required iteration verifier passed. It warned that route proof came from the delta because the state projection does not carry leaf dispatch fields.
