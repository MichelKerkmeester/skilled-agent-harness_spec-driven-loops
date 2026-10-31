| hook | line | literal text | kind |
|---|---|---|---|
| commit-msg | 5 | `# Install: bash .opencode/scripts/install-git-hooks.sh` | message |
| post-commit | 7 | `# Install: bash .opencode/scripts/install-git-hooks.sh` | message |
| post-commit | 8 | `# Uninstall: bash .opencode/scripts/install-git-hooks.sh --uninstall` | message |
| post-commit | 20 | `if [[ -f "$REPO_ROOT/.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh" ]]; then` | checker path |
| post-commit | 22 | `  source "$REPO_ROOT/.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh"` | checker path |
| post-commit | 37 | `  if [ -r "$REPO_ROOT/.opencode/hooks/shared/hook-flags.sh" ]; then` | checker path |
| post-commit | 41 | `    . "$REPO_ROOT/.opencode/hooks/shared/hook-flags.sh" 2>/dev/null` | checker path |
| post-commit | 54 | `      _as_sync="$REPO_ROOT/.opencode/bin/git-sync.sh"` | checker path |
| post-merge | 8 | `# Install: bash .opencode/scripts/install-git-hooks.sh` | message |
| post-merge | 9 | `# Uninstall: bash .opencode/scripts/install-git-hooks.sh --uninstall` | message |
| post-merge | 18 | `if [ -f "$REPO_ROOT/.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh" ]; then` | checker path |
| post-merge | 20 | `  source "$REPO_ROOT/.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh"` | checker path |
| post-rewrite | 9 | `# Install: bash .opencode/scripts/install-git-hooks.sh` | message |
| post-rewrite | 10 | `# Uninstall: bash .opencode/scripts/install-git-hooks.sh --uninstall` | message |
| post-rewrite | 19 | `if [ -f "$REPO_ROOT/.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh" ]; then` | checker path |
| post-rewrite | 21 | `  source "$REPO_ROOT/.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh"` | checker path |
| pre-commit | 9 | `# Install: bash .opencode/scripts/install-git-hooks.sh` | message |
| pre-commit | 17 | `if [ -n "$REPO_ROOT" ] && [ -r "$REPO_ROOT/.opencode/hooks/shared/hook-flags.sh" ]; then` | checker path |
| pre-commit | 20 | `  . "$REPO_ROOT/.opencode/hooks/shared/hook-flags.sh" 2>/dev/null` | checker path |
| pre-commit | 44 | `# See: .opencode/skills/sk-code/shared/references/universal/code-style-guide.md §4` | message |
| pre-commit | 45 | `COMMENT_CHECKER="${REPO_ROOT}/.opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh"` | checker path |
| pre-commit | 50 | `if [[ ! -x "$COMMENT_CHECKER" && -d "${REPO_ROOT}/.opencode/skills/sk-code" ]]; then` | checker path |
| pre-commit | 81 | `    echo "See: .opencode/skills/sk-code/shared/references/universal/code-style-guide.md §4"` | message |
| pre-commit | 88 | `# Agents are authored in .opencode/agents/ and mirrored to .claude.` | message |
| pre-commit | 90 | `MIRROR_CHECKER="$REPO_ROOT/.opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs"` | checker path |
| pre-commit | 95 | `done < <(git diff --cached --name-only --diff-filter=ACMD \| grep -E '^\.(opencode\|claude)/agents/' \|\| true)` | filter |
| pre-commit | 102 | `    echo "BLOCKED [gate:agent-mirror-sync]: staged agent files desync the .opencode / .claude mirrors."` | message |
| pre-commit | 131 | `    .opencode/commands/README.txt` | pathspec |
| pre-commit | 139 | `    .opencode/agents .opencode/commands .opencode/hooks` | pathspec |
| pre-commit | 140 | `    .opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors` | pathspec |
| pre-commit | 141 | `    .opencode/skills/system-spec-kit/runtime/cli/codex` | pathspec |
| pre-commit | 143 | `  UNSTAGED_MIRROR="$( { git diff --name-only -- "${MIRROR_OUTPUTS[@]}" '.opencode/commands/*/README.txt' '.opencode/skills/*/command-metadata.json'; git ls-files --others --exclude-standard -- "${MIRROR_OUTPUTS[@]}"; } 2>/dev/null )"` | pathspec |
| pre-commit | 145 | `    STAGED_MIRROR_RELATED="$(git diff --cached --name-only -- "${MIRROR_OUTPUTS[@]}" "${MIRROR_SOURCES[@]}" '.opencode/skills/*/command-metadata.json' 2>/dev/null)"` | pathspec |
| pre-commit | 169 | `    "$REPO_ROOT/.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs\|--check"` | checker path |
| pre-commit | 170 | `    "$REPO_ROOT/.opencode/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs\|--check"` | checker path |
| pre-commit | 171 | `    "$REPO_ROOT/.opencode/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs\|--check"` | checker path |
| pre-commit | 172 | `    "$REPO_ROOT/.opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs\|"` | checker path |
| pre-commit | 173 | `    "$REPO_ROOT/.opencode/commands/doctor/scripts/command-catalog-mirror-check.cjs\|"` | checker path |
| pre-commit | 174 | `    "$REPO_ROOT/.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs\|--check"` | checker path |
| pre-commit | 200 | `  CARD_GUARD="${REPO_ROOT}/.opencode/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh"` | checker path |
| pre-commit | 202 | `       \| grep -Eq '^\.opencode/skills/(cli-external-orchestration/cli-[a-z-]+/(SKILL\.md\|assets/prompt-quality-card\.md)\|sk-prompt/(assets/cli-prompt-quality-card\.md\|references/patterns-evaluation\.md))'; then` | filter |
| pre-commit | 207 | `      echo "     .opencode/skills/sk-prompt/assets/cli-prompt-quality-card.md." >&2` | message |
| pre-commit | 222 | `  MUTCLASS_GUARD="${REPO_ROOT}/.opencode/commands/doctor/scripts/check-mcp-mutation-class.sh"` | checker path |
| pre-commit | 224 | `       \| grep -Eq '^\.opencode/(skills/(mcp-tooling/)?mcp-[a-z-]+/(scripts/(doctor\|install)[a-z.-]*\.sh\|mcp-servers/[^/]+/setup\.sh)\|commands/doctor/assets/doctor-mcp-install\.yaml)$'; then` | filter |
| pre-commit | 254 | `  ROUTE_MINT="$REPO_ROOT/.opencode/bin/compiled-route-manifest.cjs"` | checker path |
| pre-commit | 259 | `        '.opencode/skills/*/SKILL.md' '.opencode/skills/*/*/SKILL.md' \` | pathspec |
| pre-commit | 260 | `        '.opencode/skills/*/hub-router.json' '.opencode/skills/*/mode-registry.json' 2>/dev/null)" ]]; then` | pathspec |
| pre-commit | 268 | `    ' "$REPO_ROOT/.opencode/bin/compiled-route-guard.cjs" 2>&1)"; then` | checker path |
| pre-commit | 278 | `      process.stdout.write(layout.activationRootFor(path.join(process.argv[2], ".opencode", "bin", "lib", "compiled-routing")));` | checker path |
| pre-commit | 279 | `    ' "$REPO_ROOT/.opencode/bin/lib/compiled-route-layout.cjs" "$REPO_ROOT" 2>&1)"; then` | checker path |
| pre-commit | 288 | `  ROUTE_AUTHORED="$REPO_ROOT/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/${ROUTE_RUNTIME#"$REPO_ROOT/.opencode/bin/lib/compiled-routing/"}"` | checker path |
| pre-commit | 302 | `      ".opencode/skills/$ROUTE_HUB/SKILL.md"` | pathspec |
| pre-commit | 303 | `      ".opencode/skills/$ROUTE_HUB/hub-router.json"` | pathspec |
| pre-commit | 304 | `      ".opencode/skills/$ROUTE_HUB/mode-registry.json"` | pathspec |
| pre-commit | 305 | `      ".opencode/skills/$ROUTE_HUB/*/SKILL.md"` | pathspec |
| pre-commit | 322 | `      echo "Fix: node .opencode/bin/compiled-route-manifest.cjs refresh --hub $ROUTE_HUB \\" >&2` | message |
| pre-commit | 323 | `      echo "       --skill-root .opencode/skills/$ROUTE_HUB" >&2` | message |
| pre-commit | 361 | `         --skill-root ".opencode/skills/$ROUTE_HUB" 2>&1)"; then` | checker path |
| pre-commit | 461 | `        printf '  node .opencode/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder %s --apply\n' $SPEC_PACKETS >&2` | message |
| pre-commit | 503 | `      SPEC_OUT="$(node "$REPO_ROOT/.opencode/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs" \` | checker path |
| pre-push | 23 | `# Allowlist file:         .opencode/skills/sk-git/scripts/remote-branch-allowlist.txt` | message |
| pre-push | 24 | `# Install: bash .opencode/scripts/install-git-hooks.sh` | message |
| pre-push | 37 | `_MASS_DEL_GUARD="$REPO_ROOT/.opencode/scripts/git-hooks/lib/mass-deletion-guard.sh"` | checker path |
| pre-push | 50 | `NAMING="$REPO_ROOT/.opencode/skills/sk-git/scripts/worktree-naming.sh"` | checker path |
| pre-push | 114 | `        echo "   Manual publish:  bash .opencode/bin/git-sync.sh --live $branch_name" >&2` | message |
| pre-push | 121 | `  if [[ "$is_new" -eq 0 ]] && ! git -C "$REPO_ROOT" diff --quiet "$remote_sha" "$local_sha" -- .opencode/skills 2>/dev/null; then` | pathspec |
| pre-push | 152 | `      echo "  .opencode/skills/sk-git/scripts/remote-branch-allowlist.txt"` | message |
| pre-push | 183 | `    echo "  .opencode/skills/sk-git/scripts/remote-branch-allowlist.txt)."` | message |
| pre-push | 209 | `  SKILL_GATE="$REPO_ROOT/.opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs"` | checker path |
| pre-push | 226 | `        echo "Fix with:  node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix"` | message |
| pre-push | 251 | `  ROUTE_GUARD="$REPO_ROOT/.opencode/bin/compiled-route-guard.cjs"` | checker path |
| pre-push | 281 | `    '.opencode/bin/lib/compiled-routing/013-live-activation/activation/*/manifest.json'` | pathspec |
| pre-push | 282 | `    '.opencode/skills/*/hub-router.json'` | pathspec |
| pre-push | 283 | `    '.opencode/skills/*/mode-registry.json'` | pathspec |
| pre-push | 284 | `    '.opencode/skills/*/leaf-manifest.json'` | pathspec |
| pre-push | 285 | `    '.opencode/skills/*/ROUTER.md'` | pathspec |
| pre-push | 286 | `    '.opencode/skills/*/SKILL.md'` | pathspec |
| pre-push | 299 | `        echo "  git diff ${pushed_sha:0:10} -- '.opencode/skills/*/hub-router.json' \\"` | message |
| pre-push | 300 | `        echo "      '.opencode/bin/lib/compiled-routing/013-live-activation/activation/*/manifest.json'"` | message |
| prepare-commit-msg | 16 | `# Install: bash .opencode/scripts/install-git-hooks.sh` | message |
| prepare-commit-msg | 17 | `# Uninstall: bash .opencode/scripts/install-git-hooks.sh --uninstall` | message |
| prepare-commit-msg | 47 | `ALLOCATOR="$REPO_ROOT/.opencode/skills/sk-git/scripts/commit-id-naming.sh"` | checker path |

## Orchestrator verification

Checked against `grep -n '\.opencode'` on each hook at `d26f0c60ca`. Six hooks match exactly. In `pre-commit`, the lane missed lines 102, 278 and 361; the orchestrator added them from the source above. It also listed line 95, whose regex `^\.(opencode|claude)/agents/` names the root without the literal string, and that row stays. Lines `pre-commit:50`, `pre-push:121` and `post-commit:7` were opened and match. Result: 82 rows, 79 from the lane.
