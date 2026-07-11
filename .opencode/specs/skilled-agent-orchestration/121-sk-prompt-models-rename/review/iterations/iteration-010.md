[0m
> build · mimo-v2.5-pro-ultraspeed
[0m
[0m$ [0mgit log --oneline -4
48b6cf15e9 feat(sk-design): land enforcement-spine Stage B (loading proof + pairing gate + route corpus)
bc06798143 docs(158): close out sk-prompt-models-rename packet (executed + verified)
bf79923bdb refactor(skills): rename sk-prompt-small-model -> sk-prompt-models
d5a5080dcb chore(155): deep-review final artifacts
[0m
[0m$ [0mgit show --stat bf79923bdb | tail -5
.../lineages/dq-skilldoc-cmd-ctx/research.md       |   2 +-
 .../007-advisor-rrf-fusion/results/metrics.json    |   8 +-
 .../scripts/labeled-routing-set.mjs                |   2 +-
 AGENTS.md                                          |   2 +-
 731 files changed, 3102 insertions(+), 3074 deletions(-)
[0m
[0m$ [0mgit show --stat bf79923bdb | head -20
commit bf79923bdb0e59b710e78d58ac9d15858439ee04
Author: Michel Kerkmeester <82775228+MichelKerkmeester@users.noreply.github.com>
Date:   Sun Jun 28 16:26:46 2026 +0200

    refactor(skills): rename sk-prompt-small-model -> sk-prompt-models
    
    The 'small' was inaccurate (GLM-5.2 / MiMo are 1M-context). Pure identity
    refactor: git mv the folder + repoint ~750 live references repo-wide (skills,
    commands, deep_*.yaml workflows, card-sync guard, CI workflow, .claude/.codex
    agent mirrors, AGENTS.md, model_profiles profile_refs, specs). Advisor
    force-refreshed (routes to sk-prompt-models, conf 0.95); card-sync exit 0.
    
    Frozen (history-care): changelogs + z_archive packets documenting the earlier
    sk-small-model -> sk-prompt-small-model rename; the legacy sk-small-model name;
    the 158-sk-prompt-models-rename spec packet (self-referential).
    
    Pre-existing graph-compiler symmetry validation failures are unrelated and
    flagged for a separate cleanup.
    
    Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
[0m
[0m$ [0mgit show --stat bf79923bdb | grep -v "sk-prompt-models\|sk-prompt-small-model\|sk-small-model\|AGENTS.md\|description.json\|graph-metadata.json\|\.opencode/specs\|z_archive\|changelog\|\.claude/\|\.codex/\|\.agents/" | head -30
commit bf79923bdb0e59b710e78d58ac9d15858439ee04
Author: Michel Kerkmeester <82775228+MichelKerkmeester@users.noreply.github.com>
Date:   Sun Jun 28 16:26:46 2026 +0200

    
    The 'small' was inaccurate (GLM-5.2 / MiMo are 1M-context). Pure identity
    refactor: git mv the folder + repoint ~750 live references repo-wide (skills,
    
    
    Pre-existing graph-compiler symmetry validation failures are unrelated and
    flagged for a separate cleanup.
    
    Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
    Claude-Session: https://claude.ai/code/session_01XeXEkNgXi9iKB7DCMSrJWj

 .github/workflows/prompt-card-sync.yml             |   2 +-
 .opencode/agents/deep-context.md                   |   2 +-
 .../commands/deep/assets/deep_context_auto.yaml    |   8 +-
 .../commands/deep/assets/deep_context_confirm.yaml |   8 +-
 .../deep/assets/deep_context_presentation.txt      |   4 +-
 .../deep/assets/deep_model-benchmark_auto.yaml     |  18 +-
 .../deep/assets/deep_model-benchmark_confirm.yaml  |  20 +-
 .../assets/deep_model-benchmark_presentation.txt   |  32 +-
 .opencode/commands/deep/model-benchmark.md         |   2 +-
 .opencode/scripts/git-hooks/pre-commit             |   6 +-
 .opencode/skills/README.md                         |   4 +-
 .opencode/skills/cli-claude-code/README.md         |   2 +-
 .opencode/skills/cli-claude-code/SKILL.md          |   6 +-
 .../cli-claude-code/assets/prompt_quality_card.md  |   6 +-
 .opencode/skills/cli-codex/README.md               |   2 +-
[0m
[0m$ [0mgit diff --name-only bf79923bdb^..bf79923bdb | grep -iv "sk-prompt-models\|sk-prompt-small-model\|sk-small-model" | grep -iv "z_archive\|changelog\|\.claude/\|\.codex/\|\.agents/\|\.opencode/specs\|158-" | head -40
.github/workflows/prompt-card-sync.yml
.opencode/agents/deep-context.md
.opencode/commands/deep/assets/deep_context_auto.yaml
.opencode/commands/deep/assets/deep_context_confirm.yaml
.opencode/commands/deep/assets/deep_context_presentation.txt
.opencode/commands/deep/assets/deep_model-benchmark_auto.yaml
.opencode/commands/deep/assets/deep_model-benchmark_confirm.yaml
.opencode/commands/deep/assets/deep_model-benchmark_presentation.txt
.opencode/commands/deep/model-benchmark.md
.opencode/scripts/git-hooks/pre-commit
.opencode/skills/README.md
.opencode/skills/cli-claude-code/README.md
.opencode/skills/cli-claude-code/SKILL.md
.opencode/skills/cli-claude-code/assets/prompt_quality_card.md
.opencode/skills/cli-codex/README.md
.opencode/skills/cli-codex/SKILL.md
.opencode/skills/cli-codex/assets/prompt_quality_card.md
.opencode/skills/cli-opencode/README.md
.opencode/skills/cli-opencode/SKILL.md
.opencode/skills/cli-opencode/assets/permissions-matrix.example-packet-local.json
.opencode/skills/cli-opencode/assets/prompt_quality_card.md
.opencode/skills/cli-opencode/assets/prompt_templates.md
.opencode/skills/cli-opencode/graph-metadata.json
.opencode/skills/cli-opencode/manual_testing_playbook/prompt-templates/minimax-design-context-manifest.md
.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/cli-opencode/references/context-budget.md
.opencode/skills/cli-opencode/references/permissions-matrix.md
.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts
.opencode/skills/deep-loop-workflows/deep-context/SKILL.md
.opencode/skills/deep-loop-workflows/deep-context/feature_catalog/02--by-model-parallel-sweep/per-model-prompt-framework.md
.opencode/skills/deep-loop-workflows/deep-context/feature_catalog/feature_catalog.md
.opencode/skills/deep-loop-workflows/deep-context/manual_testing_playbook/02--by-model-parallel-sweep/per-model-prompt-framework.md
.opencode/skills/deep-loop-workflows/deep-context/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/deep-loop-workflows/deep-context/references/guides/quick_reference.md
.opencode/skills/deep-loop-workflows/deep-context/references/protocol/loop_protocol.md
.opencode/skills/deep-loop-workflows/deep-improvement/README.md
.opencode/skills/deep-loop-workflows/deep-improvement/SKILL.md
.opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-profiles/reviewer-regression.json
.opencode/skills/sk-prompt/README.md
.opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh
[0m
[0m$ [0mgit diff bf79923bdb^..bf79923bdb -- .opencode/skills/README.md | head -30
diff --git a/.opencode/skills/README.md b/.opencode/skills/README.md
index 0db6334632..e44c30ecf4 100644
--- a/.opencode/skills/README.md
+++ b/.opencode/skills/README.md
@@ -77,7 +77,7 @@ Each skill name links to its own README. The one-line descriptions come from the
 | [`sk-git`](sk-git/README.md) | Move from a clean workspace to a merged PR, with worktree setup, Conventional Commits and branch discipline |
 | [`sk-design`](sk-design/README.md) | Set distinctive visual direction (palette, typography, layout, motion) that avoids templated AI defaults, grounding against real design systems (`mcp-open-design`) and shipped-UI references (Mobbin/Refero via Code Mode), then hand the build to sk-code |
 | [`sk-prompt`](sk-prompt/README.md) | Turn a vague ask into a structured prompt, auto-selected from seven frameworks |
-| [`sk-prompt-small-model`](sk-prompt-small-model/README.md) | Before you dispatch any small model, read that model's prompt-craft profile here |
+| [`sk-prompt-models`](sk-prompt-models/README.md) | Before you dispatch any small model, read that model's prompt-craft profile here |
 
 ### system-*: The Runtime Foundation
 
@@ -204,4 +204,4 @@ The family is the prefix before the first hyphen: `cli-*`, `deep-*`, `mcp-*`, `s
 | [`sk-git/README.md`](sk-git/README.md) | Git workflow: worktrees, Conventional Commits and PR integration |
 | [`sk-doc/README.md`](sk-doc/README.md) | Documentation quality, validation scripts and the DQI score |
 | [`sk-prompt/README.md`](sk-prompt/README.md) | Structured prompt engineering across seven frameworks |
-| [`sk-prompt-small-model/README.md`](sk-prompt-small-model/README.md) | Per-model prompt-craft profiles for small-model dispatch |
+| [`sk-prompt-models/README.md`](sk-prompt-models/README.md) | Per-model prompt-craft profiles for small-model dispatch |
[0m
[0m$ [0mgit diff bf79923bdb^..bf79923bdb -- .opencode/scripts/git-hooks/pre-commit
diff --git a/.opencode/scripts/git-hooks/pre-commit b/.opencode/scripts/git-hooks/pre-commit
index 635d57f581..eeceb178fe 100755
--- a/.opencode/scripts/git-hooks/pre-commit
+++ b/.opencode/scripts/git-hooks/pre-commit
@@ -58,17 +58,17 @@ fi
 # When a prompt-knowledge surface is staged, run the 3-layer drift guard so
 # table inlining, Tier-3 escalation-rule drift, registry/profile/_index gaps
 # (zero-hub-weight entries), or models unreachable by name cannot silently
-# regress across sk-prompt / sk-prompt-small-model / cli-*.
+# regress across sk-prompt / sk-prompt-models / cli-*.
 # Bypass: SPECKIT_SKIP_CARD_SYNC=1 git commit ...
 if [[ "${SPECKIT_SKIP_CARD_SYNC:-0}" != "1" ]]; then
   CARD_GUARD="${REPO_ROOT}/.opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh"
   if [[ -f "$CARD_GUARD" ]] && git diff --cached --name-only --diff-filter=ACM \
-       | grep -Eq '^\.opencode/skills/(cli-[a-z-]+/(SKILL\.md|assets/prompt_quality_card\.md|graph-metadata\.json)|sk-prompt/assets/cli_prompt_quality_card\.md|sk-prompt-small-model/)'; then
+       | grep -Eq '^\.opencode/skills/(cli-[a-z-]+/(SKILL\.md|assets/prompt_quality_card\.md|graph-metadata\.json)|sk-prompt/assets/cli_prompt_quality_card\.md|sk-prompt-models/)'; then
     if ! bash "$CARD_GUARD" "$REPO_ROOT"; then
       echo "" >&2
       echo "BLOCKED: prompt-knowledge drift guard failed (see FAIL lines above)." >&2
       echo "Fix: keep each fact in its one canonical home and point to it; see" >&2
-      echo "     .opencode/skills/sk-prompt-small-model/references/pattern_index.md." >&2
+      echo "     .opencode/skills/sk-prompt-models/references/pattern_index.md." >&2
       echo "Bypass: SPECKIT_SKIP_CARD_SYNC=1 git commit ..." >&2
       exit 1
     fi
[0m
[0m$ [0mgit diff --name-only bf79923bdb^..bf79923bdb | wc -l
731
[0m
[0m$ [0mgit diff bf79923bdb^..bf79923bdb --numstat | awk '{added+=$1; deleted+=$2} END {print "total added:", added, "total deleted:", deleted}'
total added: 3102 total deleted: 3074
[0m
[0m$ [0mgit diff bf79923bdb^..bf79923bdb -- ".opencode/specs/158-sk-prompt-models-rename/lineages/dq-skilldoc-cmd-ctx/research.md"
(no output)
[0m
[0m$ [0mgit diff bf79923bdb^..bf79923bdb -- ".opencode/specs/158-sk-prompt-models-rename/007-advisor-rrf-fusion/results/metrics.json"
(no output)
[0m
[0m$ [0mgit diff bf79923bdb^..bf79923bdb --numstat | grep -E "research\.md|metrics\.json" | head -10
8	8	.opencode/specs/design/008-sk-design-parent/029-design-context-loading/research/lineages/gpt55x/research.md
9	9	.opencode/specs/design/008-sk-design-parent/029-design-context-loading/research/research.md
2	2	.opencode/specs/design/008-sk-design-parent/037-design-routing-and-integration-research/research/research.md
2	2	.opencode/specs/deep-loops/z_archive/021-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime-release-cleanup/research/research.md
5	5	.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/002-minimax-efficiency-deep-research/research/research.md
5	5	.opencode/specs/skilled-agent-orchestration/z_archive/105-prompt-knowledge-layering/research/research.md
1	1	.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/001-frontmatter-benefit-investigation/research.md
1	1	.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/016-search-and-output-intelligence/research/002-ai-output-command-vs-conversation/research/lineages/ai-output-opus/research.md
1	1	.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/research/lineages/dq-skilldoc-cmd-ctx/research.md
4	4	.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/007-advisor-rrf-fusion/results/metrics.json
[0m
[0m$ [0mgit diff bf79923bdb^..bf79923bdb -- ".opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/research/lineages/dq-skilldoc-cmd-ctx/research.md"
diff --git a/.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/research/lineages/dq-skilldoc-cmd-ctx/research.md b/.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/research/lineages/dq-skilldoc-cmd-ctx/research.md
index 2683359a2a..ac97210f80 100644
--- a/.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/research/lineages/dq-skilldoc-cmd-ctx/research.md
+++ b/.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/research/lineages/dq-skilldoc-cmd-ctx/research.md
@@ -52,7 +52,7 @@ Reader tags: R retrieval, A adherence, L logic. Timing: on-write (pre-commit), P
 | X4 | **Resource-map corpus freshness.** `resource_map_present`/coverage is a per-research-packet concept only; no corpus-level check asserts a packet's `resource-map.md` still matches on-disk files. | gov, L | scheduled | bypass | grep `resource_map_present` → packet scope only |
 | X5 | **Telemetry→refine loop (the one retrieval-class item).** Feed truncation/never-matched-signal telemetry back as queued doc-refinement actions. Inherits the parent's exact unblock: only a **prod-mode completeRecall@3** read can promote it. | R | scheduled | **pays** | parent truncation law; `confidence-truncation.ts:35` |
 
-> Negative knowledge: `prompt-card-sync.yml` already gates the prompt-craft card layer (sk-prompt / sk-prompt-small-model / cli-*: table inlining, Tier-3 escalation drift, registry/profile completeness). Context-engineering is NOT ungated wholesale; the surgical gaps are X1–X4 only.
+> Negative knowledge: `prompt-card-sync.yml` already gates the prompt-craft card layer (sk-prompt / sk-prompt-models / cli-*: table inlining, Tier-3 escalation drift, registry/profile completeness). Context-engineering is NOT ungated wholesale; the surgical gaps are X1–X4 only.
 
 ## 3. The Most-Automated Architecture
[0m
The commit `bf79923bdb` is clean. All 731 file changes are string-level reference renames (`sk-prompt-small-model` → `sk-prompt-models` across docs, scripts, YAML, specs, and agent configs). The net delta (~28 lines) is consistent with a rename. No unrelated content was bundled.

```json
{"pass":"scope-adherence","findings":[]}
```
