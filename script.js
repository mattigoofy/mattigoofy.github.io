// Small helper: set the footer year
document.addEventListener('DOMContentLoaded', () => {
  const y = new Date().getFullYear();
  const el = document.getElementById('year');
  if (el) el.textContent = y;
});