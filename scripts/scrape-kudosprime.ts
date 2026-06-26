import * as fs from "fs";
import * as path from "path";

const URL = "https://www.kudosprime.com/fh6/carlist.php?range=2000&start=0";

function getText(block: string, regex: RegExp): string {
  const m = block.match(regex);
  return m ? m[1].trim() : "";
}

function getFloat(block: string, regex: RegExp): number {
  const m = block.match(regex);
  return m ? parseFloat(m[1]) : 0;
}

function getInt(block: string, regex: RegExp): number {
  const m = block.match(regex);
  return m ? parseInt(m[1].replace(/,/g, ""), 10) : 0;
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  console.log("Fetching KudosPrime FH6 car list...");
  const res = await fetch(URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  console.log(`Fetched ${html.length} bytes`);

  // Split into sections: groupby headers interleaved with car divs
  // Strategy: scan linearly, tracking current make from groupby headers
  const cars: object[] = [];
  let currentMake = "";

  // Find all positions of make group headers
  const groupByRegex = /class="groupby"[^>]*>\s*<a[^>]*>([^<]+)<\/a>/g;
  const makePositions: Array<{ pos: number; make: string }> = [];
  let gm: RegExpExecArray | null;
  while ((gm = groupByRegex.exec(html)) !== null) {
    makePositions.push({ pos: gm.index, make: gm[1].trim() });
  }

  // Find all car blocks
  const carStartRegex = /<div class="car[^"]*"\s+data-carid="(\d+)"/g;
  let cm: RegExpExecArray | null;
  const carPositions: Array<{ pos: number; id: number }> = [];
  while ((cm = carStartRegex.exec(html)) !== null) {
    carPositions.push({ pos: cm.index, id: parseInt(cm[1], 10) });
  }

  console.log(`Found ${makePositions.length} make groups, ${carPositions.length} cars`);

  for (let i = 0; i < carPositions.length; i++) {
    const { pos, id } = carPositions[i];
    const nextPos = carPositions[i + 1]?.pos ?? html.length;
    const block = html.substring(pos, nextPos);

    // Determine current make based on position
    for (const mp of makePositions) {
      if (mp.pos < pos) currentMake = mp.make;
      else break;
    }

    // Full car name
    const name = getText(block, /class="name"[^>]*>([^<]+)<\/a>/);
    if (!name) continue;

    // Year from name (first word)
    const yearMatch = name.match(/^(\d{4})\s/);
    const year = yearMatch ? parseInt(yearMatch[1], 10) : 0;

    // Model: name without year prefix and make
    const nameWithoutYear = name.replace(/^\d{4}\s+/, "");
    const model = nameWithoutYear.startsWith(currentMake)
      ? nameWithoutYear.slice(currentMake.length).trim()
      : nameWithoutYear;

    // Division from .cty div text
    const division = getText(block, /class="cty"[^>]*>([^<]*)</);

    // Price
    const price = getInt(block, /class="price"[^>]*>\s*<b>\s*([\d,]+)\s*<\/b>/);

    // PI class and rating: <span class="pi D"><i>D</i><b>100</b></span>
    const piClassMatch = block.match(/class="pi ([A-Z0-9]+)"/);
    const piClass = piClassMatch ? piClassMatch[1] : "D";
    const piRating = getInt(block, /class="pi [A-Z0-9]+"[^>]*><i>[^<]+<\/i><b>(\d+)<\/b>/);

    // Drivetrain
    const drivetrain = getText(block, /class="tr">([^<]+)<\/span>/);

    // Power (kW) and weight (kg)
    const tpwItems = [...block.matchAll(/<span class="tpw_item">([\d.]+)\s*<i>([^<]+)<\/i>/g)];
    let powerKw = 0;
    let weightKg = 0;
    for (const item of tpwItems) {
      const unit = item[2].toLowerCase();
      if (unit.includes("kw")) powerKw = parseInt(item[1], 10);
      else if (unit.includes("kg")) weightKg = parseInt(item[1], 10);
    }

    // Stats in order: Launch, Acc., Speed, Hand., Braking, Offroad
    const statMatches = [...block.matchAll(/<b class="stat_value">([\d.]+)<\/b>/g)];
    const launch = statMatches[0] ? parseFloat(statMatches[0][1]) : 0;
    const acceleration = statMatches[1] ? parseFloat(statMatches[1][1]) : 0;
    const speed = statMatches[2] ? parseFloat(statMatches[2][1]) : 0;
    const handling = statMatches[3] ? parseFloat(statMatches[3][1]) : 0;
    const braking = statMatches[4] ? parseFloat(statMatches[4][1]) : 0;
    const offroad = statMatches[5] ? parseFloat(statMatches[5][1]) : 0;

    // Top speed from car_perfs
    const topSpeedKph = getFloat(block, /<span><b>([\d.]+)\s*Kph<\/b><\/span>/);

    // Source (acquisition method)
    const source = getText(block, /class='car_source'>\s*<b>([^<]+)<\/b>/);

    // DLC detection
    const isDlc =
      source.toLowerCase().includes("dlc") ||
      source.toLowerCase().includes("series pass");

    const slug = slugify(`${currentMake}-${model}-${year}-${id}`);

    cars.push({
      id,
      slug,
      name,
      make: currentMake,
      model,
      year,
      division,
      piRating,
      piClass,
      drivetrain: drivetrain || "RWD",
      price: price || 0,
      source,
      isDlc,
      rarity: "",
      country: "",
      speed,
      handling,
      acceleration,
      launch,
      braking,
      offroad,
      powerKw,
      weightKg,
      topSpeedKph,
    });
  }

  const outPath = path.join(process.cwd(), "prisma", "cars-data.json");
  fs.writeFileSync(outPath, JSON.stringify(cars, null, 2), "utf-8");
  console.log(`\nSaved ${cars.length} cars to ${outPath}`);

  // Quick sample
  console.log("\nSample (first 3):");
  cars.slice(0, 3).forEach((c) => console.log(JSON.stringify(c)));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
