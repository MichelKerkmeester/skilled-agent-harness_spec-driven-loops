#!/bin/bash
# One keyed run that forces a compaction and proves the re-injection.
# The hooks are the rendered home copy (absolute paths, no git expression), the
# config is the journal reader's small-window compaction fixture, and VIBE_SPEC_FOLDER
# binds this packet so the detector can render its goal slice.
set -u
HERE=$(cd "$(dirname "$0")" && pwd -P)
REPO=$(cd "$HERE/../../../../../../.." && pwd -P)
PROMPT=$(cat "$HERE/prompt.txt")
export VIBE_SPEC_FOLDER="specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/018-vibe-compaction-context"
bash "$REPO/.vibe/plugins/repo-guards/fixtures/run-fixture.sh" \
  "$HERE/hooks.toml" "$PROMPT" compaction-probe \
  "$REPO/.vibe/plugins/repo-guards/fixtures/compaction/config.toml"
