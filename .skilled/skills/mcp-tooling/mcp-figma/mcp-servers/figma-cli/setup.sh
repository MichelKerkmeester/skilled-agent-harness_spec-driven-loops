#!/usr/bin/env bash
# Install the silships figma-cli (published to npm as figma-ds-cli), embedded in the
# mcp-figma skill. Delegates to the skill's canonical installer, which selects the full
# repo build over the minimal npm build and never installs the unrelated unic/figma-cli.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec "$HERE/../../scripts/install.sh" "$@"
