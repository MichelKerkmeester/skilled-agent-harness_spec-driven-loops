// Registers two probe tools on OpenCode 2 and records what the host keeps.
import { writeFileSync } from "node:fs";
import { tool } from "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/143-opencode-dual-compat-build/.skilled/skills/sk-vision/vision-runtime/node_modules/@opencode-ai/plugin/dist/index.js";

const z = tool.schema;
const shape = { text: z.string().describe("Text to echo back.") };
const out = process.env.TOOL_PROBE_OUT;

export default {
  id: "tool-probe",
  setup: async (ctx) => {
    const record = {};
    try {
      await ctx.tool.transform((editor) => {
        editor.add({
          name: "probe_json",
          description: "Echo the given text back, prefixed with JSON:.",
          input: z.toJSONSchema(z.object(shape)),
          execute: async (input) => ({ content: "JSON:" + String(input?.text) }),
        });
        editor.add({
          name: "probe_zod",
          description: "Echo the given text back, prefixed with ZOD:.",
          input: z.object(shape),
          execute: async (input) => ({ content: "ZOD:" + String(input?.text) }),
        });
      });
      record.registered = true;
    } catch (e) { record.registerError = String(e?.stack || e); }
    try {
      const list = await ctx.tool.list();
      record.ids = list.map((t) => t.id);
      record.probe = list.filter((t) => /probe_/.test(t.id)).map((t) => ({ id: t.id, name: t.name, input: t.input && (t.input["~standard"] ? "standard:" + t.input["~standard"].vendor : t.input) }));
    } catch (e) { record.listError = String(e?.stack || e); }
    if (out) writeFileSync(out, JSON.stringify(record, null, 2));
  },
};
