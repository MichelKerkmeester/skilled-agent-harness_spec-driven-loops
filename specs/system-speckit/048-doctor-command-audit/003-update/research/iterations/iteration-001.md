# Iteration 001 — How this repository marks releases today

**Focus:** Q1 — how the updater can determine the release the operator's checkout is on (git tags, changelog versions, skill version frontmatter, skill changelogs), find the latest upstream release, and compute the delta between them from repository evidence.

## Actions Taken

1. Git release surface: git tag --sort=-v:refname, git describe --tags --dirty, git ls-remote --tags origin, git log, git remote -v.
2. Changelog/version surface: .skilled/changelog/skilled/README.md, .skilled/changelog/<skill>/ topology, .skilled/skills/<skill>/changelog/, SKILL.md version frontmatter across all 14 top-level skills, frontmatter-vs-changelog reconciliation scan.
3. Publication path: gh release list, PUBLIC-RELEASE.md sections 4-5, .skilled/commands/create/assets/create-changelog-confirm.yaml and create-changelog-auto.yaml.
4. Operator topology and update primitives: .opencode/SYNC.md, .pi/ listing, .skilled/bin listing, git-sync.sh header, .skilled/scripts listing.
5. Aggregate-changelog audit: entry listings for .skilled/changelog/sk-code, sk-doc and sk-git to distinguish canonical history from discovery indexes.

## Findings

### F1 — A release is a contract of three artifacts: annotated git tag, GitHub release, framework changelog entry

- Scheme: MAJOR.MINOR.SERIES.PATCH (4-part). Bump mapping: major→MAJOR, minor→MINOR, patch→SERIES, build→PATCH (.skilled/changelog/skilled/README.md section 3).
- Publication is explicit and approval-gated: git tag -a <tag> then git push origin <tag> then gh release create <tag> --title ... --notes-file ... (.skilled/commands/create/assets/create-changelog-confirm.yaml around lines 590-645; create-changelog-auto.yaml around lines 656-692). Tag collision is pre-checked with git tag --list. Publishing never happens silently: only when --release was explicitly requested and approved.
- PUBLIC-RELEASE.md section 4 Phase 5 states plainly that tags alone do not appear as releases; gh release create is what makes a release operator-visible.
- Live state: gh release list → v4.0.0.2 (Latest, 2026-09-28), v4.0.0.1 (2026-09-25), v4.0.0.0, v4.0.0.0-beta.1 (Pre-release), v3.6.0.0. Local git tag top: v4.0.0.2. Remote tag top: v4.0.0.2.
- Framework changelog: one file per release at .skilled/changelog/skilled/vX.Y.Z.W.md; an entry's version IS the git tag and GitHub release of the same number (README section 1).

### F2 — The operator's checkout position is computable with git describe --tags --dirty

- This worktree: v4.0.0.2-259-g83616db9ba2-dirty → last reachable tag v4.0.0.2, 259 commits ahead, exact SHA, dirty tree.
- Naive remote-tag sorting is unsafe: git ls-remote --tags origin includes peeled ^{} refs and one non-version tag (v047-cli-opencode-shipped), and prereleases exist (v4.0.0.0-beta.1). Latest-release resolution must filter non-version and peeled refs and decide prerelease handling explicitly.
- No manifest carries the version: .skilled/package.json has no "version" field; release identity lives only in git refs, changelog files and SKILL.md frontmatter.

### F3 — Changelog can lead the tag; only tags/GitHub releases prove publication

- The working tree carries .skilled/changelog/skilled/v4.0.0.3.md, but no v4.0.0.3 tag exists locally or remotely and gh release list has nothing above v4.0.0.2. git ls-tree v4.0.0.2 for .skilled/changelog/skilled/ ends at v4.0.0.2.md.
- The same README claims "The entry for the upcoming release lives here too, before its tag exists. Today that is v4.0.0.2.md" — stale, since v4.0.0.2 is published. PUBLIC-RELEASE.md section 5 (CURRENT RELEASE) still names v4.0.0.1.
- Consequence: latest upstream release must be read from GitHub releases or tags; untagged changelog entries are an upcoming hint only. Docs must never be the authority for release identity.

### F4 — Per-skill signal: SKILL.md version frontmatter plus canonical skill changelog directories

- All 14 top-level skills carry version: X.Y.Z.W frontmatter (examples: sk-code 2.2.4.0, sk-git 1.8.0.0, sk-doc 2.2.5.0, system-spec-kit 2.6.1.0).
- Canonical history: .skilled/skills/<skill>/changelog/vX.Y.Z.W.md.
- .skilled/changelog/<skill>/ is a discovery index, not a copy: single-package skills are a symlink onto the canonical changelog (sk-git -> ../skills/sk-git/changelog); composite skills hold per-entry relative symlinks (for example .skilled/changelog/sk-code/code-review -> ../../skills/sk-code/sk-code-review/changelog; parent -> ../../skills/sk-code/changelog).
- Composite skills nest child SKILL.md files with their own version and changelog (sk-code-review, sk-create-agent and so on); an updater comparing only top-level SKILL.md files would miss child drift.

### F5 — Frontmatter and changelog can disagree; reconcile instead of trusting one signal

- Scan result: 13 of 14 top-level skills have SKILL.md version equal to their newest changelog entry. system-skill-advisor is the exception: frontmatter 0.14.1.0 vs newest changelog v0.9.0.0.md.
- The updater should surface an inconsistent-version-evidence state for such components rather than pick a winner silently.

### F6 — There is no framework self-updater; consumers symlink into the clone, so update means git

- PUBLIC-RELEASE.md sections 1, 4 and 6: consumer projects link .opencode to the Public clone; edits in .skilled/ affect all linked projects instantly; the old sync step is eliminated.
- .opencode/SYNC.md: runtime surfaces are relative per-entry symlinks onto .skilled/; drift is impossible for linked entries because a symlink has no content of its own.
- .skilled/bin holds git-sync.sh (publishes committed session work to the shared live branch — a session workflow, not a release updater) and no fetch/tag-compare/apply tooling. .skilled/scripts holds git-hooks installation, launch agents, an orphan sweeper and cleanup. The new command must implement detection itself from git primitives plus gh.

### F7 — Delta material exists and is path-scoped per skill

- Changed files and commits between two refs for one component: git diff --stat <base>..<target> -- .skilled/skills/<skill>/ and git log <base>..<target> -- .skilled/skills/<skill>/.
- Version comparison: git show <ref>:.../SKILL.md frontmatter; changelog filename sets are sortable 4-part versions and give the release sequence.
- Ahead/behind/dirty must be reported separately: this checkout is 259 commits ahead of the latest release and dirty, while a consumer checkout may instead be behind.

## Questions Answered

**Q1 — answered.**
Operator current release: (1) git describe --tags --dirty gives base tag, commits ahead, SHA and dirty state; (2) per-skill version: frontmatter in each SKILL.md, including composite children; (3) canonical skill changelog file sets bound each component's release sequence. No manifest exists.
Latest upstream release: (1) gh release list when gh is available (authoritative, prerelease-aware); (2) git ls-remote --tags origin with a version-aware sort that filters peeled refs, non-version tags and, by default, prereleases, when gh is unavailable; (3) optionally inspect origin/<default-branch> for an untagged upcoming changelog entry — a hint only.
Delta: git fetch, then path-scoped git log/diff <operator-base>..<release-ref> per .skilled/skills/<skill>/, plus frontmatter version comparison and the changelog entries between the two versions; report operator-ahead-of-release and unreleased-upstream-work distinctly.
Caveats: detection presumes a git checkout with the origin remote (a copied or zipped checkout breaks it and needs a changelog/frontmatter fallback); gh may be unauthenticated; docs and frontmatter can be stale or inconsistent (F3, F5), so only git/GitHub data proves release identity.

## Questions Remaining

- Q2 (next focus): which customization/override signals does this repository produce, or can produce cheaply (three-way merge against the release base, provenance markers, hashes, git history)?
- Q3: how to build and present an alignment proposal for a customized skill while keeping its override specifics.
- Q4: one command or several; what happens to today's database-rebuild behaviour of /doctor:update.
- Q5: each command's shape under the sk-create-command contract and reuse of install/sync scripts.
New sub-questions raised here:
- Q1a: fallback path when the operator checkout has no git metadata or no gh auth — which signal degrades first and what conclusion is still safe?
- Q1b: are composite child skills (sk-code-*, sk-doc-*) independent update units with their own versions, or updated only through the parent?
- Q1c: is the system-skill-advisor frontmatter/changelog mismatch accepted practice or drift — is reconciliation an error or a warning?

## Next Focus

Q2: enumerate the customization/override detection signals available in this repository (per-skill path diffs against a release base, symlink topology that makes runtime copies drift-free, provenance markers in skills, content hashes, git history) and judge which are cheap and reliable enough for the updater.
