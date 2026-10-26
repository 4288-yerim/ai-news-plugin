# ai-news-plugin

「AI 뉴스」라고 하면 **해외(Hacker News)** 와 **국내(GeekNews · 웹 검색)** 의 최근 24시간 AI 소식 3~5개를 골라
원문을 읽고 한국어로 요약해 터미널에 보여 주는 Claude Code 플러그인(`/ai-news`).
보여 준 뒤 「아티팩트로 만들어 카톡 나와의 채팅으로 보낼까요?」라고 묻고, **승인했을 때만** 요약을 아티팩트 페이지로 만들어 그 링크를 **카카오톡 나챗방**으로 보낸다.

```
[AI 뉴스] 2026-10-26 가장 상단 뉴스 헤드라인 외 4건
https://아티팩트 링크
```

## 설치

```
/plugin marketplace add 4288-yerim/ai-news-plugin
/plugin install ai-news-plugin@ai-news-plugin
```

## 전제조건

터미널에 출력하는 것만이라면 아래 준비는 필요 없다. 카톡으로 보내려면 승인하기 전에 준비한다.

1. **PlayMCP 도구함에 `카카오톡 나챗방`** 을 담는다 → https://playmcp.kakao.com/mcp/1
2. **claude.ai 커넥터에 PlayMCP 연결** → https://claude.ai/customize/connectors
   플러그인은 커넥터를 자동 설치하지 못한다. 연결이 없으면 스킬이 안내하고 멈춘다 (아티팩트도 만들지 않는다).

아티팩트는 실행할 때마다 새로 만든다. 처음에는 본인만 볼 수 있고, 폰에서 열 때 claude.ai 에 로그인되어 있어야 한다.

## 구성

| 파일 | 하는 일 |
|---|---|
| `skills/ai-news/SKILL.md` | 수집(24시간) → 선별 → 원문 읽고 한국어 요약 → 터미널 출력 → 승인 시 아티팩트 발행 · 카톡 전송 |
| `hooks/check-ai-news-message.js` | `[AI 뉴스]` 메시지만 검사 — 200자 · 날짜 · 링크/출처 |
| `.claude-plugin/marketplace.json` | 이 저장소를 장터로 등록 |

## 주의

- 카톡 도구는 한 번에 200자까지라, 긴 요약은 아티팩트에 담고 카톡에는 헤드라인과 링크만 보낸다.
- 어제 보낸 기록은 저장하지 않는다. 최근 24시간만 모으는 것으로 중복을 줄인다.
- `/ai-news` 는 Hacker News API · GeekNews RSS · 웹 검색을 함께 쓴다. 인기도(HN 점수) 기준은 HN 글에만 적용된다.
- 승인하기 전에는 아티팩트도 만들지 않고 카톡도 보내지 않는다.
