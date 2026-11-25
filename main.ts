import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Museum of the Year 3000 — a deadpan museum label from the year 3000,
// placed beside an ordinary object from today: the weekly Screen Time
// Report. The humour is the year 3000 misreading: the glowing rectangle
// "confesses" each Sunday how long its human stared at it, and the human
// reacts by staring some more.
const ENTRY =
  "Screen Time Report, c. 2025. Every Sunday the glowing rectangle confessed how long its human had stared at it. The human gasped \u2014 then stared some more.";

// Gate from competition.yaml: /output/entry.txt must be UTF-8 text of
// 1 to 200 characters, not only white space, a single line.
const MIN_CHARS = 1;
const MAX_CHARS = 200;
const OUT_DIR = "/output";
const OUT_PATH = `${OUT_DIR}/entry.txt`;

function validateEntry(text: string, bytes: Buffer): void {
  const chars = [...text].length;
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(`entry is ${chars} characters, must be ${MIN_CHARS}-${MAX_CHARS}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (!Buffer.from(text, "utf8").equals(bytes)) {
    throw new Error("read-back mismatch: decoded text does not match written bytes");
  }
}

mkdirSync(OUT_DIR, { recursive: true });
const bytes = Buffer.from(ENTRY, "utf8");
writeFileSync(OUT_PATH, bytes);

// Read the file back and verify it byte for byte against what we wrote.
const back = readFileSync(OUT_PATH);
if (!back.equals(bytes)) {
  throw new Error("read-back mismatch: entry.txt bytes differ from entry");
}
validateEntry(back.toString("utf8"), back);
console.log(
  `Wrote ${OUT_PATH} (${[...back.toString("utf8")].length} characters, ${back.length} bytes, verified byte-for-byte)`,
);
console.log(back.toString("utf8"));
