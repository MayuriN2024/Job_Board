const COMPANY_DOMAINS = {
  'Amazon India': 'amazon.in',
  Flipkart: 'flipkart.com',
  Swiggy: 'swiggy.com',
  Razorpay: 'razorpay.com',
  TCS: 'tcs.com',
  Infosys: 'infosys.com',
  Wipro: 'wipro.com',
  Zomato: 'zomato.com',
  Freshworks: 'freshworks.com',
  PhonePe: 'phonepe.com',
  'HDFC Bank': 'hdfcbank.com',
  Paytm: 'paytm.com',
  CRED: 'cred.club',
  'Google India': 'google.com',
  Meesho: 'meesho.com',
};

export const getCompanyLogoUrl = (company, applyUrl) => {
  const domain = COMPANY_DOMAINS[company];
  if (domain) {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  }
  if (applyUrl) {
    try {
      const hostname = new URL(applyUrl).hostname.replace(/^www\./, '');
      if (hostname) {
        return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
      }
    } catch {
      // ignore invalid URLs
    }
  }
  return null;
};

export const getCompanyInitial = (company) => company?.charAt(0)?.toUpperCase() || '?';
