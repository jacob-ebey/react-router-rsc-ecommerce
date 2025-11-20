export function incrementScrollLock(by: 1 | -1) {
  const doc = document.documentElement;
  let lock = Number.parseInt(doc.getAttribute("data-scroll-lock") || "0") + by;
  if (lock < 0) lock = 0;
  if (lock === 0) {
    doc.removeAttribute("data-scroll-lock");
  } else {
    doc.setAttribute("data-scroll-lock", String(lock));
  }
}
