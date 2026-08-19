## Lương Quốc Dũng

AI Engineer. I put agents into production, then write about what broke.

Everything below is listed with the kind of evidence behind it. "I designed this system" and
"I ran it against real traffic" are not the same claim, and most engineering writing blurs them.

### Running

**[TripNest AI](https://github.com/quocdungTlu/C2-App-031)** — AI travel agent in production.
11 tools via LLM tool calling, RAG retrieval, VietQR flow that takes real bookings.
FastAPI · Next.js 14 · Claude Haiku 4.5 / GPT-4.1 mini.

**[agent-evaluator](https://github.com/quocdungTlu/agent-evaluator)** — a grader that never trusts
a score the model reports. Asked to grade the same 5-criterion vector three times, the LLM wrote
three different totals and once omitted one entirely. So the normalizer recomputes the sum itself
and fails closed on a malformed vector; security flags stay a separate channel from the quality
score, so a technically correct output can still be blocked. Node.js · Claude API.

**[TTHC Assist](https://github.com/quocdungTlu/UBNDAI)** — assistant that checks Vietnamese
public-administration filings before they are submitted. FastAPI · LangGraph · React.

### Written

[**quocdungtlu.github.io**](https://quocdungtlu.github.io) — six essays on taking agents to
production, in Vietnamese. Each ends with a section naming what would prove it wrong.

| Evidence behind it | Essay |
|---|---|
| Public sources, every claim linked | [Platform strategy and reverse-engineered unit economics](https://quocdungtlu.github.io/work/mindpal-strategy/) for a no-code agent platform |
| Public sources + 4 probes I ran | [Tool Gateway and capability tokens](https://quocdungtlu.github.io/work/mindpal-governance/) — the probes found three deployment-governance gaps |
| Design only, no runtime data | [Five infrastructure designs](https://quocdungtlu.github.io/work/agent-infrastructure/) — sandbox, video pipeline, collaborative canvas, 1B-record system, agent browser |
| Ran it, with a control | [Ad production](https://quocdungtlu.github.io/work/ad-production/) — 7 placements, 3 controlled runs, 13 logged failures, rubric revised v1 → v2 |
| Measured across 12 real runs | [Lead-qualification one-pager](https://quocdungtlu.github.io/work/client-delivery/) + workspace dashboard concept |
| Transcripts, SHA-256 hashed corpus | [Grading the grader](https://quocdungtlu.github.io/work/agent-evaluation/) — 9 runs, 2 attacks aimed at the evaluator itself |

### Latest essays

<!-- essays:start -->
- [Chấm giám khảo trước khi chấm thí sinh — meta-agent](https://quocdungtlu.github.io/work/agent-evaluation/) — 2026-08-13
- [Hai ranh giới còn thiếu — MindPal](https://quocdungtlu.github.io/work/mindpal-governance/) — 2026-08-11
- [Cửa sổ đi trước và đường biên hòa vốn — MindPal](https://quocdungtlu.github.io/work/mindpal-strategy/) — 2026-08-05
- [Hạ tầng cho agent — tuyển tập 5 bài thiết kế](https://quocdungtlu.github.io/work/agent-infrastructure/) — 2026-08-03
<!-- essays:end -->

Full list with the evidence behind each one is the table above. [Atom feed](https://quocdungtlu.github.io/feed.xml).

### Recent work

Rebuilt daily from the GitHub API — most recently pushed repositories and where each one stands.

<!-- work:start -->
| Repo | Latest commit | Date |
|---|---|---|
| [agent-evaluator](https://github.com/quocdungTlu/agent-evaluator) | Merge OpenAI judge adapter: prove the provider contract | 2026-08-18 |
| [day26-wrong-problem-lab](https://github.com/quocdungTlu/day26-wrong-problem-lab) | Add Day 26 design thinking prototype | 2026-08-18 |
| [portfolio](https://github.com/quocdungTlu/portfolio) | Trigger Vercel deploy: verify GitHub integration is connected | 2026-08-17 |
| [quocdungtlu.github.io](https://github.com/quocdungTlu/quocdungtlu.github.io) | Fail the audit run when no essay could be audited at all | 2026-08-17 |
| [UBNDAI](https://github.com/quocdungTlu/UBNDAI) | TTHC Assist (UBNDAI): trợ lý AI hướng dẫn và kiểm tra hồ sơ thủ tục hành chính | 2026-07-20 |
<!-- work:end -->

<!-- releases:start -->

<!-- releases:end -->

### What I don't claim

No internal company data. Every analysis comes from public documentation and probes run on my own
accounts — never anyone else's account or data. Prices and capabilities in this field move fast, so
each essay states the date its data was frozen. None of it is official documentation for any company
it names.

### Elsewhere

[Portfolio](https://lqdung-portfolio.vercel.app) · [Blog](https://quocdungtlu.github.io) · [@quocdungTlu](https://github.com/quocdungTlu)
