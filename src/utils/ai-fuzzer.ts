/**
 * AiFuzzer
 * AI-Inspired Security, Unicode & Edge-Case Fuzzing Payload Generator.
 * Supplies dynamic boundary condition vectors for inputs (XSS, SQLi, Unicode, buffer limits).
 */
export class AiFuzzer {
  /**
   * Returns common XSS (Cross-Site Scripting) injection payloads for input sanitization testing
   */
  getXssPayloads(): string[] {
    return [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert(1)>',
      '"><svg/onload=alert(1)>',
      'javascript:/*--></title></style></textarea></script></xmp><svg/onload=\'+/"/+/onmouseover=1+(alert)(1)//\'>',
    ];
  }

  /**
   * Returns SQL injection strings to test database sanitization
   */
  getSqlInjectionPayloads(): string[] {
    return [
      "' OR '1'='1",
      "admin' --",
      "1; DROP TABLE users; --",
      "' UNION SELECT null, username, password FROM users --",
    ];
  }

  /**
   * Returns multi-language Unicode, RTL (Right-to-Left), and Emoji sequences
   */
  getUnicodeVectors(): Array<{ name: string; value: string }> {
    return [
      { name: 'Arabic RTL', value: 'مرحبا بك في تطبيق الاختبار' },
      { name: 'Japanese Kanji & Hiragana', value: 'テストユーザー 管理者 123' },
      { name: 'Hindi Devnagari', value: 'परीक्षण उपयोगकर्ता ऑटोमेशन' },
      { name: 'Accented European', value: 'Éléonore-François Müller & Søndergaard' },
      { name: 'Emoji Multi-byte', value: '🔥🚀 QA Engineer 💻✨' },
      { name: 'Zero-width space', value: 'User\u200BName\u200BWith\u200BZeroWidth' },
    ];
  }

  /**
   * Returns boundary length strings (1 char, 255 chars, 4000 chars)
   */
  getBoundaryLengths(): Array<{ label: string; value: string }> {
    return [
      { label: 'Single Character', value: 'A' },
      { label: 'Max 255 Characters', value: 'X'.repeat(255) },
      { label: 'Extreme 4096 Characters', value: 'L'.repeat(4096) },
      { label: 'Whitespace Only', value: '     ' },
    ];
  }
}
