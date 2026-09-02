function setActiveTab() {
  const route = location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.folder-tab').forEach(a => a.classList.toggle('active', (a.getAttribute('href') || '') === route));
}
function formatNumber(value, digits = 8) {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('ro-RO', { maximumFractionDigits: digits }).format(value);
}
document.addEventListener('DOMContentLoaded', setActiveTab);
