# Iteration 5: Repository gates and CI

## Focus

Trace the hooks and Actions that execute against `.opencode` paths, and identify
which ones can reject or silently miss the migration commit.

## Findings

### Surface: 5, repository gates

- **Finding:** The installed pre-commit gate loads `.opencode/hooks/shared/hook-flags.sh`, the comment-hygiene checker under `.opencode/skills/sk-code`, the agent mirror checker under `.opencode/skills/system-deep-loop`, and a mirror-parity list whose sources and outputs are all `.opencode`-named. It runs six mirror checks, including runtime mirrors, Codex prompts/agents and hook registrations. **Classification:** `blocker`. **Consequence for the cutover:** A single-directory `.opencode` symlink would remove the nested hook script path used by the installed hook and would make the pre-commit pathspecs see a different index shape; a directory of compatibility links can preserve execution, but the gate's source/output path lists still need to understand `.skilled` as the authoring root.
  - [SOURCE: `.opencode/scripts/git-hooks/pre-commit:14-27`]
  - [SOURCE: `.opencode/scripts/git-hooks/pre-commit:41-53`]
  - [SOURCE: `.opencode/scripts/git-hooks/pre-commit:87-105`]
  - [SOURCE: `.opencode/scripts/git-hooks/pre-commit:108-191`]

- **Finding:** The pre-commit gate also hardcodes `.opencode` in prompt-card checks, MCP mutation-class checks, compiled-route reminting and spec derived-metadata repair. The route remint path derives a runtime activation root from `.opencode/bin/lib/compiled-routing` and invokes the manifest refresher with `.opencode/skills/<hub>`. **Classification:** `blocker`. **Consequence for the cutover:** The migration commit itself cannot pass the current route and metadata gates unless those scripts continue to resolve through compatible `.opencode` paths or the gate logic is updated before the staged source move reaches the hook. The route and metadata gates also auto-write/stage outputs, so they are not passive validators.
  - [SOURCE: `.opencode/scripts/git-hooks/pre-commit:194-234`]
  - [SOURCE: `.opencode/scripts/git-hooks/pre-commit:236-380`]
  - [SOURCE: `.opencode/scripts/git-hooks/pre-commit:412-550`]

- **Finding:** The pre-push hook decides whether skill changes were pushed by diffing `.opencode/skills`, loads the skill metadata gate from `.opencode/skills/sk-doc/.../ci-skill-root-metadata.cjs`, invokes the compiled-route guard under `.opencode/bin`, and compares pushed routing bytes using `.opencode` pathspecs. **Classification:** `blocker`. **Consequence for the cutover:** Even if a commit passes locally, the pre-push gate can skip the new `.skilled` source tree, fail to classify the migration as a skill change, or compare the wrong routing bytes unless its path roots are taught together.
  - [SOURCE: `.opencode/scripts/git-hooks/pre-push:114-123`]
  - [SOURCE: `.opencode/scripts/git-hooks/pre-push:195-229`]
  - [SOURCE: `.opencode/scripts/git-hooks/pre-push:240-307`]

- **Finding:** Hook installation writes `.git/hooks/pre-commit` as a symlink to the repository's `.opencode/hooks/git/pre-commit`, while the primary installer contract points at `.opencode/scripts/install-git-hooks.sh`; the prepare-commit-msg hook uses `.opencode/skills/sk-git/scripts/commit-id-naming.sh` and deliberately exits zero on stamping failure. **Classification:** `manual`. **Consequence for the cutover:** Existing checkouts have an installed absolute or repository-relative hook target that does not move with a `git mv`; the installer and any global `core.hooksPath` wiring must be revalidated. If `.opencode` remains a compatible consumer path, the hook can continue to resolve; if it becomes a bare symlink with no nested hook path, the installed hook becomes stale. Prepare-commit-msg failure is non-blocking but silently removes commit-id/spec stamping.
  - [SOURCE: `.opencode/hooks/git/install-hooks.sh:5-18`]
  - [SOURCE: `.opencode/scripts/git-hooks/prepare-commit-msg:11-20`]
  - [SOURCE: `.opencode/scripts/git-hooks/prepare-commit-msg:39-49`]

- **Finding:** `.gitignore` explicitly says this repository is the source of `.opencode` content, negates a global `/.opencode/` ignore, ignores generic `dist/`, and ignores `.opencode/hooks/hook-flags.env`. **Classification:** `blocker`. **Consequence for the cutover:** The ignore contract is itself source text that must be changed for `.skilled`; otherwise the new real source tree can be globally ignored or generated outputs can be accidentally treated differently, while the runtime hook-flags state must remain transient.
  - [SOURCE: `.gitignore:5-10`]
  - [SOURCE: `.gitignore:47-52`]
  - [SOURCE: `.gitignore:284-287`]

- **Finding:** The Actions inventory covers mirror synchronization, packet validation, comment hygiene, links, naming, prompt cards, routing drift, rule canaries, runtime boundaries, skill frontmatter, command parity, dispatch enforcement, repo rules, design corpora, and spec-kit checks. Its documented trigger matrix distinguishes push, pull-request, path-filtered and scheduled coverage. Representative workflows hardcode `.opencode` in path filters and run commands from that root; the path-filtered routing and spec-kit checks enumerate `.opencode/skills`, `.opencode/commands`, `.opencode/agents`, `.opencode/bin` and runtime build paths. **Classification:** `blocker`. **Consequence for the cutover:** Source changes under `.skilled` can bypass workflows whose `on.paths` only mention `.opencode`, while jobs that still invoke `.opencode` fail if compatibility links are absent. The workflow path filters, job commands and any repository README inventory must be updated as one contract.
  - [SOURCE: `.github/workflows/README.md:14-18`]
  - [SOURCE: `.github/workflows/README.md:28-53`]
  - [SOURCE: `.github/workflows/spec-kit-check.yml:7-15`]
  - [SOURCE: `.github/workflows/spec-kit-check.yml:61-75`]
  - [SOURCE: `.github/workflows/spec-kit-check.yml:136-148`]
  - [SOURCE: `.github/workflows/routing-registry-drift.yml:26-43`]
  - [SOURCE: `.github/workflows/routing-registry-drift.yml:128-160`]

## Sources Consulted

- Installed pre-commit, pre-push, prepare-commit-msg and hook installer.
- `.gitignore` source-root and generated-state rules.
- Workflow inventory and representative mirror, routing and spec-kit jobs.

## Assessment

- `newInfoRatio`: 0.94
- Novelty justification: The hooks reveal a pre-commit/pre-push ordering constraint and CI path-filter blind spots that a literal-reference inventory alone cannot distinguish.
- Confidence: high for repository-owned gates; global hook installation state remains checkout-specific.

## Reflection

- Worked: reading the actual gate implementations, not only workflow names, exposed auto-writing gates and path-specific skip behavior.
- Ruled out: assuming CI is the only migration gate.
- Failed: the current worktree cannot prove how every operator's global hook path resolves after a root move.

## Recommended Next Focus

Audit the documentation and external-reference surfaces, including home-level runtime configuration and installed hooks that do not move with repository files.
