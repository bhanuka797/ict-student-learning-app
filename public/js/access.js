export function isAccessActive(accessEndDate) {
  if (!accessEndDate) return false;
  const endDate = new Date(accessEndDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today <= endDate;
}

export function paymentBadge(paymentStatus, accessEndDate) {
  if (paymentStatus === 'Paid' && isAccessActive(accessEndDate)) {
    return { className: 'success', label: 'Premium Active' };
  }
  if (paymentStatus === 'Expired' || !isAccessActive(accessEndDate)) {
    return { className: 'danger', label: 'Expired' };
  }
  return { className: 'warning', label: 'Free Plan' };
}
