#!/usr/bin/env bash
# Live desktop-notice check for the bots delivery channel.
#
# NOT RUN by the builder: it shows a real macOS notification, which needs the
# operator's approval. It sends exactly one notice through the real channel
# and prints the state the channel records. Expected: state "attempted",
# evidence "osascript exit 0", and one notice titled "Skilled bot live-check"
# on screen. Nothing else is written; no bot runs and no model is called.
#
# Run it with bash from anywhere inside the checkout; it finds the runtime
# through git rev-parse.
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
runtime="$root/.skilled/skills/system-skilled-bots/runtime"

cd "$runtime"
node --import tsx --input-type=module -e '
import { desktopSender } from "./lib/delivery.ts";
const result = desktopSender({
  channel: "desktop",
  target: "desktop",
  title: "Skilled bot live-check",
  body: "Run live-check: completed\nReason: converged",
});
const state = result.outcome === "attempted" ? "attempted" : result.outcome;
console.log(JSON.stringify({ state, evidence: result.evidence }));
'
