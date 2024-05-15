/**
 * is mobile platform
 *
 * @author tangjiahui
 * @date 2024/5/15
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
}
