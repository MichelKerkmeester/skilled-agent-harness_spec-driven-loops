# Incident: stale balances on 2026-09-21

- 09:02 A deploy raised `ORBIT_TTL_SECONDS` from 30 to 600 by mistake.
- 09:40 Support reported customers seeing old balances after transfers.
- 09:55 On-call confirmed cache entries were living ten minutes.
- 10:05 Config reverted to 30 seconds. Existing entries kept their old expiry.
- 10:20 A manual flush cleared the stale entries.
- 10:45 Balances confirmed correct for all sampled accounts.

Cause: the deploy template took the TTL from the wrong environment file.
Follow-ups: validate the TTL range at startup, add a flush endpoint, and alert
when the mean entry age exceeds twice the TTL. None of the three is done yet.
