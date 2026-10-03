# Iteration 006 — Q1/Q1a: Release Detection and the Degradation Path

## Focus

Q1: how can the updater determine which release the operator's checkout is on and find the latest upstream release, and how is the delta between the two computed from repository evidence? Q1a: the fallback path when git metadata or `gh` auth is absent. Iteration 5 named Q1/Q1a the blocking dependency because Q3's base resolution needs per-file bytes at the detected release; this iteration closes that loop.

## Actions Taken

1. Inventoried the release surfaces: `.skilled/changelog/` layout (per-skill dirs plus `skilled/`), `.skilled/changelog/skilled/` entries, per-skill `version:` frontmatter across all 14 parent `SKILL.md` files, and `.skilled/package.json`.
2. Read `.skilled/changelog/skilled/README.md` (release authority and process) and the newest entry, `v4.0.0.3.md`.
3. Probed the git release surface: tag count, `git tag --list 'v4*' --sort=-v:refname`, `git describe --tags --always`, annotated-tag type check (`git cat-file -t`), tag dates via `for-each-ref`, and non-release namespaces via `git tag -n1`.
4. Searched `.skilled/bin` and `.skilled/scripts` for upstream/release machinery (`gh release`, `gh api`, `api.github.com`, `describe --tags`, `git tag`) and inspected the headers of `git-sync.sh` and `git-primary-reconcile.sh`.
5. Verified anonymous no-auth upstream paths: `GIT_TERMINAL_PROMPT=0 git ls-remote --tags origin` and `curl` against the GitHub REST `releases/latest` endpoint; confirmed local `gh` version.

All researched paths were read-only. No out-of-scope writes were attempted.

## Findings

### F-006-1 — Release identity is tag/release-authoritative; changelog entries exist before tags do

Evidence: `.skilled/changelog/skilled/README.md` §1: "An entry's version is the git tag and GitHub release of the same number." and "An entry lives here when a GitHub release carries its version number. The entry for the upcoming release lives here too, before its tag exists." §2 documents the writer: `/create:changelog skilled`, with `--release` tagging and publishing.

Observed state: `.skilled/changelog/skilled/` holds `v4.0.0.0.md`, `v4.0.0.1.md`, `v4.0.0.2.md`, `v4.0.0.3.md`, but `git tag --list 'v4*' --sort=-v:refname` returns `v4.0.0.2, v4.0.0.1, v4.0.0.0-beta.1, v4.0.0.0` — `v4.0.0.3` has no tag. The README prose is itself stale: it says "Today that is `v4.0.0.2.md`" while `v4.0.0.3.md` already exists.

Consequence: detection must compare the changelog file set against the tag set structurally — `max(tag matching the release pattern)` is the latest released version; entries above it are upcoming (untagged) releases. Never take the max changelog filename as "released", and never trust the README prose as the oracle.

### F-006-2 — Local release resolution: nearest annotated tag plus checkout class

Evidence: `git describe --tags --always` → `v4.0.0.2-261-g69cb472abac` (the checkout is 261 commits past `v4.0.0.2`). `git cat-file -t v4.0.0.2` → `tag` (annotated, so tag messages carry release titles, e.g. "v4.0.0.2: A Steadier Skill Advisor, Findable Changelogs and Leaner Goals"). `git for-each-ref --sort=-creatordate` gives v4.0.0.2 | tag | 2026-09-28 (v4.0.0.1 2026-09-25, v4.0.0.0 2026-09-21). `git tag -n1` also lists non-release namespaces: `backup/pre-v4-integration`, `backup/pre-031-push`, `backup/pre-integration-010`. sk-git's own release flow already prescribes `git tag --sort=-v:refname | head -5` (`references/finish-workflows.md:386`).

Consequence: local release = nearest ancestor tag matching the release pattern (`v<digits>.<digits>.<digits>.<digits>`), with `-N-g<sha>` distance and `--dirty` working-tree state distinguishing three checkout classes: at-tag (consumer, up to date or behind), ahead-of-tag (development/upcoming), behind-tag (consumer needing the update). The `backup/*` namespace must be excluded from release detection, and prerelease suffixes need an explicit policy (version sort placed `v4.0.0.0-beta.1` above `v4.0.0.0`).

### F-006-3 — Latest-upstream detection works without `gh` auth; two anonymous paths verified

Evidence: `GIT_TERMINAL_PROMPT=0 git ls-remote --tags origin` exited 0 with no credential prompt; output ended with `refs/tags/v4.0.0.2` and `refs/tags/v4.0.0.2^{}` (peeled refs). Anonymous `curl` to `https://api.github.com/repos/MichelKerkmeester/skilled-agent-harness_spec-driven-loops/releases/latest` exited 0 without a token, returning the release object (`url`, `assets_url`, `html_url`). `gh` 2.102.0 is installed on this machine, but `rg` found no `gh release`/`gh api` invocation anywhere in `.skilled/bin` or `.skilled/scripts` — only sk-git documentation.

Consequence: `gh`/`gh auth` is optional for a public upstream; anonymous HTTPS suffices. Parsing hazards: `ls-remote --tags` emits peeled `^{}` refs, so a naive last-line read returns a commit SHA instead of a tag name; the anonymous REST endpoint is rate-limited, so the resolter should cache per run; private upstreams degrade to the authenticated path.

### F-006-4 — No upstream-update machinery exists; the sync scripts are a different axis

Evidence: `.skilled/bin/git-sync.sh` publishes a session's committed work to the shared live branch (fast-forward when possible, rebase-on-move, abort-safe, durable log under the git common dir). `.skilled/bin/git-primary-reconcile.sh` reconciles the primary checkout on its live branch, always exits 0, and uses `SPECKIT_PRIMARY_RECONCILE_TIMEOUT:-12` plus a lock TTL. Neither fetches upstream releases. `.skilled/package.json` is `{}` — no version field.

Consequence: the updater introduces the fetch/inspect step; these scripts supply the house idioms (never fatal, bounded network timeout, lock+log under the common dir) but no ready-made release query. `package.json` is not a version signal.

### F-006-5 — Version axes are orthogonal: repo release vs per-skill version

Evidence: all 14 parent skills carry `version:` frontmatter (sk-git 1.8.0.0, sk-doc 2.2.5.0, system-spec-kit 2.6.1.0, sk-code 2.2.4.0, …). Per-skill changelog directories are version-keyed and mirrored at `.skilled/changelog/<skill>/` (iteration 5 verified sk-git: 23 identical files each side). `.skilled/changelog/skilled/` holds repo releases.

Consequence: "the repo moved to a new release" and "skill X changed" are different questions. Per-skill delta = compare that skill's frontmatter version and file inventory between the checkout's base tag and the target release tag; a release that never touched skill X leaves it byte-identical.

### F-006-6 — Degradation ladder and the safe-conclusion rule (Q1a)

Ordered by what degrades first:

1. `gh auth` — never required (F-006-3); only a private upstream needs it.
2. Git metadata (no `.git`) — lose `describe`/`diff`; the frontmatter+changelog inventory remains as local truth; release bytes come from the release archive (`codeload` / REST `tarball_url`); the delta is a path+sha256 inventory comparison, the compiled-route-sync fingerprint idiom from iteration 5.
3. Network — the update check is impossible. Safe conclusion: report the local base state only; upstream is UNKNOWN.

Invariant: absence of upstream evidence never proves "up to date". A run that cannot reach the upstream must report UNKNOWN/cannot-check, never OK. This keeps the check honest under degradation.

Base-bytes resolution (the Q3 dependency): with git, `git show <tag>:<path>` yields a file's exact bytes at the release; without git, the downloaded release archive does. Either way a per-file `(path, sha256)` manifest at the base release is constructible, closing the loop iteration 5 left open.

## SCOPE VIOLATIONS

None. All writes were confined to this run's research directory; all researched paths were read-only.

## Questions Answered

- **Q1 (core)**: Authority ladder grounded (F-006-1); local detection grounded (F-006-2); upstream detection grounded and no-auth verified (F-006-3); delta computation defined at both repo and skill granularity (F-006-5); per-file base bytes resolvable (F-006-6).
- **Q1a**: Degradation ladder and the safe-conclusion invariant (F-006-6).
- **Q3 blocker removed**: the release base's per-file bytes are obtainable (git object or release archive), so iteration 5's three-way classification can consume a concrete base manifest.

## Questions Remaining

- **Q3a**: exact hash input of `provenance_fingerprint` (`lib/derived/provenance.ts`) — cheap close-out.
- **Q1b**: composite child skills as independent update units; prior evidence says children carry their own frontmatter and changelogs — decision needed.
- **Q1c**: system-skill-advisor frontmatter/changelog mismatch — error or warning.
- **Q3b**: divergence ledger git-tracked vs gitignored — decision needed.
- **Q4**: final disposition of the DB rebuild — decision record.
- **Q5a**: exact flag surface and whether align ever applies.

## Next Focus

Close the remaining technical verifications (Q3a hash input; Q1b child-skill unit) and convert the pending design decisions (Q3b ledger location, Q4 DB rebuild, Q5a flags) into a decision record, so the `/doctor:check` contract can be specified with its full data path: local base → nearest release tag (+ branch distance, dirty state), upstream latest → anonymous tag/release query, delta → per-file manifest comparison.
