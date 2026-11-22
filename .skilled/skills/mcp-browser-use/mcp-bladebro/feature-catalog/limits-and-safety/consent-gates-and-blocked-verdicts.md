---
title: "Consent gates and blocked verdicts"
description: "Real-browser lanes and stealth runs need an explicit operator request, a chosen profile and a confirmed site, and a `blocked:` verdict ends the task without a retry."
trigger_phrases:
  - "consent gates and blocked verdicts"
  - "bladebro blocked verdict"
  - "bladebro stealth consent"
  - "bladebro safety rules"
version: 1.0.0.0
---

# Consent gates and blocked verdicts (R-SEC-1, R-SEC-2, R-SEC-3)

## 1. OVERVIEW

Real-browser lanes and stealth runs need an explicit operator request, a chosen profile and a confirmed site, and a `blocked:` verdict ends the task without a retry.

The packet's three safety rules bind every lane and both transports. They decide which actions an agent refuses, regardless of what the binary would accept.

---

## 2. HOW IT WORKS

### Consent Checklist

Before control passes to an `rb` lane, five things hold. The operator asked for a real-browser lane in this request. The operator chose the profile and the account. For a stealth run, the operator confirmed the target site's terms of service and access rules. Only one writer acts on that account or profile. Detection output is captured fresh, with cookie and credential values redacted.

### Blocked Verdicts

A `blocked:` verdict is terminal. The agent reports it and stops. It never re-issues the action, swaps fingerprints or otherwise routes around the challenge. A pause on MFA, a CAPTCHA or an approval goes back to the operator.

### Install Gate

Installing, updating or rolling back Bladebro needs an operator yes, and the version stays pinned to 4.8.2 with a digest check against the release sidecars.

### Recorded Results

The playbook's global preconditions put these gates in front of every real-browser scenario. The two 2026-11-21 records document the operator's approval of the browser, the profile and the target before the real-browser steps ran, and the 14-step record states that `profile` mode was never used. The 2026-11-22 record keeps verdicts only, so it neither confirms nor contradicts the gates. No recorded run met a `blocked:` verdict, so the stop rule is binding packet guidance rather than observed behavior.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md` | Shared | The verbatim safety rules and the escalation list |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/browser-lanes.md` | Shared | The consent checklist before an `rb` lane |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/manual-testing-playbook.md` | Manual playbook | Global preconditions that gate the real-browser scenarios |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md` | Benchmark | Records the operator approvals behind the run |

---

## 4. SOURCE METADATA

- Group: Limits and Safety
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `limits-and-safety/consent-gates-and-blocked-verdicts.md`

Related references:
- [capability-gaps-and-handoffs.md](capability-gaps-and-handoffs.md) - Requests Bladebro routes away
