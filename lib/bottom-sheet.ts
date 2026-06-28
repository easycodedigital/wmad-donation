/** Reset enter flag and run double-rAF slide-in (call when opening a bottom sheet). */
export function runBottomSheetEnter(setEntered: (open: boolean) => void) {
  setEntered(false);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => setEntered(true));
  });
}
