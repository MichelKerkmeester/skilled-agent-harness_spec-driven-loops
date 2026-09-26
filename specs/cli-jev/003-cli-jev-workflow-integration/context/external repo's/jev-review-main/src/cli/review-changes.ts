import { printReview } from "./execute.ts";
import { runChangeReview } from "../review/changes.ts";

await printReview(runChangeReview);
