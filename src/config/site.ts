export const SITE = {
  url: 'https://cenphx.com',
  name: 'CenPHX',
  domain: 'CenPHX.com',
  seller: 'Desert Rich',
  email: 'sales@desertrich.com',
  price: '50000',
  priceDisplay: '$50,000',
  priceCurrency: 'USD',
  priceValidUntil: '2027-12-31',
  googleSiteVerification: 'uyGsoglH4u51F_k_gILnmJ4HuIP4YrvX0FlaLMCPAaY',
  ogImage:
    'https://customer-wa9cpywo3l4jte5c.cloudflarestream.com/c705a45d6d8c23cb22503949ffe8e4a6/thumbnails/thumbnail.jpg?time=&height=600',
  ogImageAlt: 'CenPHX.com — Central Phoenix domain for sale',
  escrow: 'https://www.escrow.com',
  streamId: 'c705a45d6d8c23cb22503949ffe8e4a6',
  streamHost: 'customer-wa9cpywo3l4jte5c.cloudflarestream.com',
} as const;

export const ACQUISITION_MAILTO = (subject?: string, body?: string) => {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const qs = params.toString();
  return `mailto:${SITE.email}${qs ? `?${qs}` : ''}`;
};
