import { printReview } from "./execute.ts";
import { runCodebaseReview } from "../review/codebase.ts";

await printReview(runCodebaseReview);
