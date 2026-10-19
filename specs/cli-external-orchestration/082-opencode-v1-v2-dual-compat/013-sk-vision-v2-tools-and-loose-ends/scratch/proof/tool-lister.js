// Waits for the other plugins' setup to finish, then records which
// sk_vision_* tools the OpenCode 2 host holds.
import { writeFileSync } from "node:fs";

export default {
  id: "tool-lister",
  setup: async (ctx) => {
    setTimeout(async () => {
      const out = process.env.TOOL_PROBE_OUT;
      const record = {};
      try {
        const list = await ctx.tool.list();
        record.skVision = list.map((t) => t.id).filter((id) => id.startsWith("sk_vision_")).sort();
        record.total = list.length;
      } catch (e) { record.listError = String(e?.stack || e); }
      if (out) writeFileSync(out, JSON.stringify(record, null, 2));
    }, 8000);
  },
};
