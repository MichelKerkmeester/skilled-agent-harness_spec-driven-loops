#!/bin/bash
# 014/007 Voyage Egress Verification (24h capture)
# ---------------------------------------------------------------------------
# Purpose: confirm zero outbound traffic to api.voyageai.com over a 24h window
# under Setup A (hf-local memory + EmbeddingGemma cocoindex).
#
# Run this AFTER 008 ships the bundled commit. Do NOT run during active 014 work
# (the capture is long-running and noisy).
#
# Requires: sudo for tcpdump on macOS.
# ---------------------------------------------------------------------------

set -euo pipefail

OUTPUT_DIR="${HOME}/.cocoindex_code"
mkdir -p "${OUTPUT_DIR}"
CAPTURE_FILE="${OUTPUT_DIR}/voyage-egress-$(date +%Y%m%d-%H%M%S).pcap"
LOG_FILE="${OUTPUT_DIR}/voyage-egress-$(date +%Y%m%d-%H%M%S).log"

echo "=== voyage egress capture ==="
echo "  start:        $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "  target host:  api.voyageai.com"
echo "  capture file: ${CAPTURE_FILE}"
echo "  log file:     ${LOG_FILE}"
echo ""
echo "Run for 24h then Ctrl+C. Expected: 0 packets captured."
echo ""

# pktap is Apple's pseudo-interface that captures across all NICs (Wi-Fi, Ethernet, VPN utun*).
# To capture on a specific interface only, override TCPDUMP_IFACE:
#   TCPDUMP_IFACE=en0 bash tcpdump-verify.sh
IFACE="${TCPDUMP_IFACE:-pktap}"

# `host api.voyageai.com` filter catches both A and AAAA records;
# `tcp port 443` narrows to HTTPS which is voyage's API surface.
sudo tcpdump -i "$IFACE" -nn \
  "(host api.voyageai.com) and tcp port 443" \
  -w "${CAPTURE_FILE}" \
  | tee "${LOG_FILE}"

# After Ctrl+C, summarize what was captured:
echo ""
echo "=== summary ==="
echo "  end: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
PKT_COUNT=$(tcpdump -r "${CAPTURE_FILE}" 2>/dev/null | wc -l | tr -d ' ')
echo "  packets captured: ${PKT_COUNT}"
if [ "${PKT_COUNT}" -eq 0 ]; then
  echo "  RESULT: PASS (no Voyage egress)"
else
  echo "  RESULT: FAIL — Voyage traffic detected, see ${CAPTURE_FILE}"
fi
