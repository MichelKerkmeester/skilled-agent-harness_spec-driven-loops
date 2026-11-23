#!/bin/sh
# NOT RUN. Awaiting operator approval: this dispatches a real executor (cli-codex),
# which calls a model. The orchestrator barred live executor runs in this build.
# One real manual bot on one admitted kind, then a read of its record.
# The repository must have a HEAD commit: the result event binds it, and a checkout
# without one is refused before dispatch as result-ledger-unbound. Receipts sit under
# the state root at <identity key>/receipts/<run id>/, not in the run folder.
# For cli-claude-code, the stream-json decision reader is proven against a stub only.
set -eu
REPO="${1:?usage: live-run-awaiting-approval.sh <consumer repo with bots/<id>/BOT.md> <bot id>}"
BOT="${2:?bot id}"
node .skilled/bin/bots.cjs run "$BOT" --repo "$REPO"
echo "exit=$?"
# Then read the newest record under the user-level state root:
ls -t "${XDG_STATE_HOME:-$HOME/.local/state}/system-skilled-bots"/*/records/*.json | head -1 | xargs cat
# And its dispatch receipts:
ls -t "${XDG_STATE_HOME:-$HOME/.local/state}/system-skilled-bots"/*/receipts/ | head -3
