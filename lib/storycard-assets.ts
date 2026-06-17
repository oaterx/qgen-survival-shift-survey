import fs from "fs";
import path from "path";

function fileToBase64(filePath: string, mimeType: string): string {
  const buf = fs.readFileSync(filePath);
  return `data:${mimeType};base64,${buf.toString("base64")}`;
}

export function loadStorycardAssets() {
  const pub = path.join(process.cwd(), "public");

  const fontFace = [
    { file: "prompt-400-thai.woff2",  weight: 400, family: "Prompt", range: "U+0E01-0E5B,U+0303,U+0331" },
    { file: "prompt-600-thai.woff2",  weight: 600, family: "Prompt", range: "U+0E01-0E5B,U+0303,U+0331" },
    { file: "prompt-700-thai.woff2",  weight: 700, family: "Prompt", range: "U+0E01-0E5B,U+0303,U+0331" },
    { file: "prompt-400-latin.woff2", weight: 400, family: "Prompt", range: "U+0000-00FF,U+2000-206F" },
    { file: "prompt-600-latin.woff2", weight: 600, family: "Prompt", range: "U+0000-00FF,U+2000-206F" },
    { file: "prompt-700-latin.woff2", weight: 700, family: "Prompt", range: "U+0000-00FF,U+2000-206F" },
    { file: "inter-400.woff2",        weight: 400, family: "CardInter", range: "U+0000-00FF,U+2000-206F" },
    { file: "inter-600.woff2",        weight: 600, family: "CardInter", range: "U+0000-00FF,U+2000-206F" },
    { file: "inter-700.woff2",        weight: 700, family: "CardInter", range: "U+0000-00FF,U+2000-206F" },
  ]
    .map(({ file, weight, family, range }) => {
      const b64 = fileToBase64(path.join(pub, "fonts", file), "font/woff2");
      return `@font-face{font-family:'${family}';font-weight:${weight};font-style:normal;font-display:block;src:url('${b64}') format('woff2');unicode-range:${range};}`;
    })
    .join("");

  const logoDataUrl = fileToBase64(
    path.join(pub, "Element", "Logo.png"),
    "image/png"
  );

  const headingDataUrl = fileToBase64(
    path.join(pub, "Element", "Heading.png"),
    "image/png"
  );

  return { fontFace, logoDataUrl, headingDataUrl };
}

export function loadPersonaImageDataUrl(personaId: string): string {
  const pub = path.join(process.cwd(), "public");
  return fileToBase64(path.join(pub, "personas", `${personaId}.webp`), "image/webp");
}
