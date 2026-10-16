import type { Offer } from '../data/offers';
export type Coordinate={latitude:number;longitude:number};
export type OfferWithDistance=Offer & {distanceMiles:number};
export function distanceMiles(a:Coordinate,b:Coordinate):number { const rad=(n:number)=>n*Math.PI/180,R=3958.8; const dLat=rad(b.latitude-a.latitude),dLon=rad(b.longitude-a.longitude); const h=Math.sin(dLat/2)**2+Math.cos(rad(a.latitude))*Math.cos(rad(b.latitude))*Math.sin(dLon/2)**2; return R*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h)); }
export function withDistances(items:Offer[],origin:Coordinate):OfferWithDistance[] { return items.map(o=>({...o,distanceMiles:distanceMiles(origin,{latitude:o.lat,longitude:o.lng})})).sort((a,b)=>a.distanceMiles-b.distanceMiles); }
