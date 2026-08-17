// Rewrites the auto-generated blocks in README.md from live GitHub data.
//
// Three blocks, all real data, none decorative:
//   <!-- work:start --> ... <!-- work:end -->         most recently pushed repos + their latest commit
//   <!-- essays:start --> ... <!-- essays:end -->     newest essays, from the site's Atom feed
//   <!-- releases:start --> ... <!-- releases:end --> latest release per featured repo, omitted entirely when there are none
//
// It also compares the essays listed on the live site against the ones named in the README
// and writes drift.txt when the site has one the README does not. The README's evidence
// column is a hand-written judgement, so a new essay is reported rather than auto-inserted.

import { readFile, writeFile, rm } from "node:fs/promises";

const USER = "quocdungTlu";
const SITE = "https://quocdungtlu.github.io";
const PROFILE_REPO = `${USER}/${USER}`;
const FEATURED = ["agent-evaluator", "C2-App-031", "UBNDAI", "quocdungtlu.github.io", "portfolio"];
const MAX_WORK_ROWS = 5;
const MAX_ESSAY_ROWS = 4;

const token = process.env.GITHUB_TOKEN;

async function gh(path) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      accept: "application/vnd.github+json",
      "user-agent": `${USER}-profile-builder`,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  });
  // 409 is what /commits returns for a repository with no commits yet.
  if (res.status === 404 || res.status === 409) return null;
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status} ${await res.text()}`);
  return res.json();
}

const isoDay = (s) => s.slice(0, 10);

// A commit subject is the only free-text field here, so keep it to one line and
// neutralise anything that would break out of the table cell.
function cell(text) {
  return text.split("\n")[0].trim().replace(/\|/g, "\\|").slice(0, 100);
}

async function recentWork() {
  const repos = await gh(`/users/${USER}/repos?type=owner&sort=pushed&direction=desc&per_page=100`);
  const candidates = repos.filter(
    (r) => !r.private && !r.fork && !r.archived && r.full_name !== PROFILE_REPO,
  );

  // Walk past any repo without commits rather than losing a row to it.
  const rows = [];
  for (const repo of candidates) {
    if (rows.length === MAX_WORK_ROWS) break;
    const commits = await gh(`/repos/${repo.full_name}/commits?per_page=1`);
    if (!commits?.length) continue;
    const c = commits[0];
    rows.push(
      `| [${repo.name}](${repo.html_url}) | ${cell(c.commit.message)} | ${isoDay(c.commit.author.date)} |`,
    );
  }
  if (!rows.length) return "";

  return [
    "| Repo | Latest commit | Date |",
    "|---|---|---|",
    ...rows,
  ].join("\n");
}

async function releases() {
  const items = [];
  for (const name of FEATURED) {
    const rels = await gh(`/repos/${USER}/${name}/releases?per_page=1`);
    if (!rels?.length) continue;
    const r = rels[0];
    if (r.draft) continue;
    items.push({ name, tag: r.tag_name, url: r.html_url, date: isoDay(r.published_at ?? r.created_at) });
  }
  if (!items.length) return ""; // no releases yet: the section disappears rather than rendering empty
  items.sort((a, b) => b.date.localeCompare(a.date));
  return [
    "### Releases",
    "",
    ...items.map((r) => `- [${r.name} ${r.tag}](${r.url}) — ${r.date}`),
  ].join("\n");
}

// The site lists each essay as <a class="card" href="work/<slug>/">.
async function essaysOnSite() {
  const res = await fetch(`${SITE}/`, { headers: { "user-agent": `${USER}-profile-builder` } });
  if (!res.ok) throw new Error(`GET ${SITE}/ -> ${res.status}`);
  const html = await res.text();
  return [...html.matchAll(/href="work\/([a-z0-9-]+)\/"/g)].map((m) => m[1]);
}

const unxml = (s) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .trim();

// The site publishes an Atom feed built from each essay's <meta name="date">.
async function latestEssays() {
  const res = await fetch(`${SITE}/feed.xml`, { headers: { "user-agent": `${USER}-profile-builder` } });
  if (!res.ok) throw new Error(`GET ${SITE}/feed.xml -> ${res.status}`);
  const feed = await res.text();

  const items = [...feed.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
    .map((m) => m[1])
    .map((entry) => ({
      title: unxml(entry.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? ""),
      url: entry.match(/<link href="([^"]+)"/)?.[1] ?? "",
      date: (entry.match(/<updated>([^<]+)<\/updated>/)?.[1] ?? "").slice(0, 10),
    }))
    .filter((e) => e.title && e.url);

  if (!items.length) return "";
  return items
    .slice(0, MAX_ESSAY_ROWS)
    .map((e) => `- [${e.title}](${e.url}) — ${e.date}`)
    .join("\n");
}

function replaceBlock(readme, name, body) {
  const start = `<!-- ${name}:start -->`;
  const end = `<!-- ${name}:end -->`;
  const re = new RegExp(`${start}[\\s\\S]*?${end}`);
  if (!re.test(readme)) throw new Error(`marker ${name} not found in README.md`);
  return readme.replace(re, `${start}\n${body}\n${end}`);
}

const [work, rels, essays, siteSlugs] = await Promise.all([
  recentWork(),
  releases(),
  latestEssays(),
  essaysOnSite(),
]);

let readme = await readFile("README.md", "utf8");
readme = replaceBlock(readme, "work", work);
readme = replaceBlock(readme, "releases", rels);
readme = replaceBlock(readme, "essays", essays);
await writeFile("README.md", readme);

const missing = siteSlugs.filter((slug) => !readme.includes(`/work/${slug}/`));
await rm("drift.txt", { force: true });
if (missing.length) {
  await writeFile("drift.txt", missing.join("\n") + "\n");
  console.log(`drift: essays on the site but not in README -> ${missing.join(", ")}`);
}

console.log(
  `work rows: ${work ? work.split("\n").length - 2 : 0}, ` +
    `essays: ${essays ? essays.split("\n").length : 0}, releases: ${rels ? "yes" : "none"}`,
);
