export const formatDate = (dateString: string, withTime: boolean = false): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  const options: Intl.DateTimeFormatOptions = withTime
    ? { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

export const formatCurrency = (amount: number | string, currency: string = 'USD', locale: string = 'en-US'): string => {
  const value = typeof amount === 'string' ? Number(amount) : amount;
  if (Number.isNaN(value)) return '';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
};
