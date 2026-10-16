import type { Offer } from '../data/offers';
export function filterOffers<T extends Offer>(items:T[],category:string,query:string):T[] { const q=query.trim().toLocaleLowerCase(); return items.filter(o=>(category==='All'||o.category===category)&&(!q||[o.name,o.address,o.category,o.description,o.discount].some(v=>v.toLocaleLowerCase().includes(q)))); }
