Read-only observation of OpenCode v2.0.32 event delivery to a v2 plugin, 2026-10-20.

Host: a private `opencode2 serve --hostname 127.0.0.1 --port 48751` started in a scratch project outside the repository, with its own OPENCODE_DB, XDG_DATA_HOME and XDG_STATE_HOME and a throwaway OPENCODE_PASSWORD. The shared service (PID 46220) was not touched; its start time stayed Sun Oct 18 12:18:22 2026.

Probe: event-probe.js, the only plugin in the scratch project, appends every `ctx.event.subscribe()` event type to events.log.

Steps, marked inline in events.log:
1. GET /api/plugin loaded the plugin ("setup") and the config events followed.
2. session.create -> the plugin received `session.created`.
3. session.remove -> the plugin received `session.deleted`.
4. SIGTERM to the private server -> the plugin received `location.shutdown`, then its cleanup ran. Neither `server.instance.disposed` nor `global.disposed` arrived.

Not observed: events that need a model turn (session.status, permission.*, question.*, session.idle and its v2 source session.execution.succeeded) because the private host had no provider credentials.
