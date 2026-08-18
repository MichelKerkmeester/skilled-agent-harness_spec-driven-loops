---
title: "Pi Remote Feature Catalog — canonical location"
description: "The Pi Remote feature catalog is maintained as a single source of truth at the app repository root."
version: 1.0.0.0
---

# Pi Remote Feature Catalog (canonical location)

The full Pi Remote feature catalog — every shipped capability across transport-and-state,
auth-and-boundary, approval-and-mutation, command-and-push, PWA, release, mobile UI features, and the
design system — is maintained as the single source of truth at the **app repository root**:

- `feature-catalog/feature-catalog.md` (in the Pi Remote app repository)

This surface intentionally keeps no duplicate copy, so the catalog cannot drift. When doing code work
on `apps/pi-remote-web/`, consult the app-root catalog. The matching deterministic validation scenarios
live at the same app root — see [`manual-testing-playbook.md`](manual-testing-playbook.md).
