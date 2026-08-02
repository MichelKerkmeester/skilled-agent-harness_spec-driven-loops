---
title: "PUBGATE-001: staging-only single-page publish"
description: "PB class: operator confirmation; staging subdomain only; receipt + rollback."
version: 1.0.0.0
---

# PUBGATE-001 — Staging-only single-page publish

1. Confirm test-site identity + `sites:write` scope.
2. Operator confirmation captured (explicit text).
3. `publish_site` with `publishToWebflowSubdomain: true` + single `pageIds`.
4. PASS: publish receipt + `*.webflow.io` URL; rollback plan stated; `customDomains` never used.
