#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: NPM CI RETRY
# ───────────────────────────────────────────────────────────────
# Runs `npm ci` for one package folder and repeats it when it fails.
#
# A dropped registry connection ends `npm ci` with ECONNRESET after npm's own
# request retries, and that one lost download fails the whole job. A clean
# install is safe to repeat because it removes node_modules before it starts,
# so a second attempt never builds on a half-written tree.
#
# Usage: npm-ci-retry.sh <package-folder>
# Exit:  0 once an attempt succeeds, otherwise the status of the last attempt.

set -uo pipefail

if [ "$#" -ne 1 ]; then
  echo "usage: npm-ci-retry.sh <package-folder>" >&2
  exit 2
fi

readonly PREFIX="$1"
readonly ATTEMPTS="${NPM_CI_RETRY_ATTEMPTS:-3}"
readonly PAUSE_SECONDS="${NPM_CI_RETRY_PAUSE_SECONDS:-10}"

status=0
attempt=1
while [ "$attempt" -le "$ATTEMPTS" ]; do
  npm --prefix "$PREFIX" ci
  status=$?
  if [ "$status" -eq 0 ]; then
    exit 0
  fi
  echo "npm ci in ${PREFIX} failed with status ${status} (attempt ${attempt} of ${ATTEMPTS})" >&2
  if [ "$attempt" -lt "$ATTEMPTS" ]; then
    sleep "$PAUSE_SECONDS"
  fi
  attempt=$((attempt + 1))
done

exit "$status"
