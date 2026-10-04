# Config v1 to v2

Version 1 read settings from `orbit.ini`. Version 2 reads environment variables.

- `ttl` in the ini file became `ORBIT_TTL_SECONDS`. The unit changed from
  minutes to seconds.
- `max_items` became `ORBIT_MAX_ENTRIES`. Same meaning.
- `backend` was removed. The in-memory backend is the only supported one now.
- `log_level` moved out of orbit-cache into the shared logging config.
- New in v2: `ORBIT_REGION`, unused until the second region ships.
