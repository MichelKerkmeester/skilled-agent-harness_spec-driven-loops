import { createHash, randomUUID } from "node:crypto";
import { appendFile, chmod, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { daemonHome } from "./config.js";
import { currentTraceContext } from "../observability/trace-context.js";

export type LogFields = Record<string, string | number | boolean | undefined>;

export type DaemonLogger = {
  event(name: string, fields?: LogFields): void;
  flush(): Promise<void>;
};

export function createDaemonLogger(home?: string): DaemonLogger {
  const path = join(daemonHome(home), "logs", "server.log");
  let tail = Promise.resolve();
  return {
    event(name, fields = {}) {
      const trace = currentTraceContext();
      const record = JSON.stringify({
        timestamp: new Date().toISOString(),
        event: name,
        ...(trace ? { trace_id: trace.traceId } : {}),
        ...sanitizeFields(fields),
      });
      tail = tail
        .then(async () => {
          await mkdir(dirname(path), { recursive: true, mode: 0o700 });
          await appendFile(path, `${record}\n`, {
            encoding: "utf8",
            mode: 0o600,
          });
          await chmod(path, 0o600);
        })
        .catch(() => undefined);
    },
    flush: () => tail,
  };
}

export function rootIdentity(root: string): string {
  return createHash("sha256").update(root).digest("hex").slice(0, 16);
}

export function opaqueIdentity(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

export function requestId(): string {
  return randomUUID();
}

function sanitizeFields(fields: LogFields): LogFields {
  const safe: LogFields = {};
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || /token|api.?key|authorization|query/i.test(key))
      continue;
    safe[key] =
      typeof value === "string" && value.length > 512
        ? `${value.slice(0, 512)}…`
        : value;
  }
  return safe;
}
