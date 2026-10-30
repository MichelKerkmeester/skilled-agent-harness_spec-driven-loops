#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
python3 -B route_contract.py fixtures.json
