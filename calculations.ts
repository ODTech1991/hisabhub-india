export function gstExclusive(amount: number, rate: number) {
  const gst = amount * rate / 100;
  return { taxable: amount, gst, total: amount + gst };
}

export function gstInclusive(amount: number, rate: number) {
  const taxable = amount / (1 + rate / 100);
  const gst = amount - taxable;
  return { taxable, gst, total: amount };
}

export function emi(principal: number, annualRate: number, months: number) {
  if (!principal || !months) return { emi: 0, interest: 0, total: 0 };
  const r = annualRate / 12 / 100;
  const payment = r === 0
    ? principal / months
    : principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
  return { emi: payment, interest: payment * months - principal, total: payment * months };
}

export function sip(monthly: number, annualRate: number, years: number) {
  const n = years * 12;
  const r = annualRate / 12 / 100;
  const value = r === 0 ? monthly * n : monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  return { invested: monthly * n, returns: value - monthly * n, maturity: value };
}

export function profitMargin(cost: number, selling: number) {
  const profit = selling - cost;
  return { profit, margin: selling ? profit / selling * 100 : 0, markup: cost ? profit / cost * 100 : 0 };
}