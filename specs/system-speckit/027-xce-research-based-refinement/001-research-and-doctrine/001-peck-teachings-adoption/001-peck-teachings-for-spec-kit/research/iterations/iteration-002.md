# Focus

Q2 / T4: decide severity, document scope, and false-positive controls for broadening the current-state-only content rule beyond phase parents. Opportunistically captured one Q3 signal about stale suppressions / rule-review diagnostics.

# Actions Taken

1. Read the existing `PHASE_PARENT_CONTENT` scanner, registry entry, and validation rule reference to confirm current behavior and strict-mode semantics.
2. Read the phase 003 current-state-discipline spec and sibling peck-teachings analysis to compare the planned scope with the original recommendation.
3. Checked external prose/doc linter prior art from Vale for regex phrase detection, severity levels, glob scoping, scopes, and ignore mechanisms.
4. Checked markdownlint and ESLint docs for inline suppression, severity, false-positive handling, and stale/unused suppression diagnostics.

# Findings

1. Initial T4 severity should be `INFO` unless rollout adds a strict-mode escape hatch or baseline window. The local validator defines `WARNING` as exit 0 normally but exit 2 under `--strict`, while `INFO` never changes the exit code [SOURCE: `.opencode/skills/system-spec-kit/references/validation/validation_rules.md:27-35`]. The phase spec already identifies this exact risk and says it is leaning `INFO` until adoption settles [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/003-current-state-discipline/spec.md:149-160`]. External linter prior art supports warning for uncertain/new rules when warnings do not block: ESLint says `warn` does not affect exit code and is typical for new rules, uncertain findings, or false-positive-prone checks [SOURCE: https://eslint.org/docs/latest/use/configure/rules]. Because spec-kit strict mode escalates warnings, `INFO` better matches an advisory first release; promote to `WARNING` only after baseline cleanup or an explicit rollout flag.

2. The safest first doc scope is `implementation-summary.md` plus phase-parent `spec.md` as already covered; non-parent `spec.md` should be opt-in or second-wave. The current phase spec proposes scanning `implementation-summary.md` and non-parent `spec.md` while exempting `decision-record.md` and `changelog/` [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/003-current-state-discipline/spec.md:93-103`]. The original analysis only recommended extending to `implementation-summary.md` of long-lived folders at warning severity, not all non-parent specs [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit/peck-teachings-analysis.md:249-262`]. Vale uses glob-specific sections where `[*]` can be overridden by narrower globs such as `[*.{md,txt}]`, supporting file-type/path-specific rule scope instead of one broad default [SOURCE: https://vale.sh/docs/topics/config/].

3. Exemptions should remain path-based and semantic: `decision-record.md`, `changelog/`, and `context-index.md` are legitimate history surfaces. The current rule docs explicitly route phase-parent migration history to optional `context-index.md` [SOURCE: `.opencode/skills/system-spec-kit/references/validation/validation_rules.md:171-179`], while the phase spec already exempts `decision-record.md` and `changelog/` because they are legitimately historical [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/003-current-state-discipline/spec.md:99-103`]. This mirrors Vale's format-specific settings and `BlockIgnores` / `TokenIgnores` escape hatches for known-safe contexts [SOURCE: https://vale.sh/docs/topics/config/].

4. Detection should stay conservative and token/regex based; do not try to infer all history narrative semantically. Vale's `existence` check is the closest prior art: it detects simple phrases or regular expressions, supports `ignorecase`, and allows exceptions [SOURCE: https://vale.sh/docs/checks/existence/]. The existing spec-kit rule already uses conservative forbidden tokens and skips fenced code plus HTML comments [SOURCE: `.opencode/skills/system-spec-kit/scripts/rules/check-phase-parent-content.sh:31-50`]. If broadened beyond phase parents, the broadest token `consolidat[a-z]*` should be reviewed or contextualized because phrases like "consolidated findings" can be current-state prose rather than migration history.

5. False-positive controls should include existing fence/comment awareness, frontmatter handling if the broadened rule scans whole files, and a documented suppression path with reason text for rare exceptions. The current scanner skips fenced code and HTML comments [SOURCE: `.opencode/skills/system-spec-kit/scripts/rules/check-phase-parent-content.sh:33-40`], and the docs call that out as intentional [SOURCE: `.opencode/skills/system-spec-kit/references/validation/validation_rules.md:160-172`]. Markdownlint similarly ignores HTML comments and front matter for most rules and supports inline disable/enable comments for specific rules or files [SOURCE: https://raw.githubusercontent.com/DavidAnson/markdownlint/main/README.md]. ESLint recommends documenting why disable comments are necessary, prefers config-file scoping where possible, and can report unused disable comments [SOURCE: https://eslint.org/docs/latest/use/configure/rules].

6. Q3 signal: stale-rule review should be read-only and diagnostic, not auto-pruning. ESLint handles stale suppressions by reporting unused inline configs or unused disable directives, with configurable severity, while keeping the rules/config intact [SOURCE: https://eslint.org/docs/latest/use/configure/rules]. That maps well to T2's planned constitutional-rule review surface: add metadata such as `last_confirmed_at` / `last_confirmed_by`, then report stale or unconfirmed rules without deleting or mutating the constitutional rule set.

# Questions Answered

- Q2 is mostly answered: use `INFO` for the initial always-on broadened rule unless strict-mode rollout is controlled; start with `implementation-summary.md`; keep historical docs exempt; preserve fence/comment awareness; add path and reasoned-suppression controls.
- Q3 has one useful signal: comparable always-on systems detect stale/unused suppressions diagnostically rather than mutating rule definitions.

# Questions Remaining

- Q3 still needs focused research on metadata shape for constitutional rules and whether `last_confirmed_at` belongs in rule metadata, registry metadata, or generated diagnostics only.
- Q4 remains deferred: mechanical AC-to-test coverage mapping and blocking thresholds.
- Q5 remains open for sequencing across T3/T4/T2/T1, especially whether T4 should have an opt-in scan flag before entering default validation.

# Next Focus

Q3 / T2: research rule metadata and read-only stale-rule diagnostics in comparable policy/linter systems, with special attention to expiry, last-reviewed fields, and diagnostics that avoid auto-deleting always-on rules.
