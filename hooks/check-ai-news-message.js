#!/usr/bin/env node
/**
 * PreToolUse hook — 카카오톡 나챗방(KakaotalkChat-MemoChat) 전송 직전에 돈다.
 *
 * 「[AI 뉴스]」로 시작하는 메시지만 검사한다. 다른 플러그인의 메시지는 그대로 통과시킨다.
 *
 * 막는 경우
 *   1. 200자를 넘는다 (나챗방 도구 한도)
 *   2. 첫 줄에 날짜(YYYY-MM-DD)가 없다
 *   3. 출처(링크 또는 「출처:」)가 없다 — 「소식 없음」 안내 메시지는 제외
 */

const PREFIX = '[AI 뉴스]';
const LIMIT = 200;
const DATE = /\d{4}-\d{2}-\d{2}/;
const EMPTY_NOTICE = /소식\s*없음/;
const SOURCE = /(https?:\/\/|출처\s*:)/;

function deny(reason) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: `${reason}\n고쳐서 다시 보내세요.`,
    },
  }));
  process.exit(0);
}

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => { raw += c; });
process.stdin.on('end', () => {
  let input;
  try { input = JSON.parse(raw); } catch { process.exit(0); }
  const args = input.tool_input || {};
  const msg = Object.values(args).find((v) => typeof v === 'string' && v.startsWith(PREFIX));
  if (!msg) process.exit(0);

  if (msg.length > LIMIT) deny(`메시지가 ${msg.length}자입니다. ${LIMIT}자 이내로 줄이세요.`);
  if (!DATE.test(msg.split('\n')[0])) deny('첫 줄에 날짜(YYYY-MM-DD)가 없습니다.');
  if (!EMPTY_NOTICE.test(msg) && !SOURCE.test(msg)) deny('링크(https://…) 또는 「출처: 매체명」이 없습니다.');
  process.exit(0);
});
