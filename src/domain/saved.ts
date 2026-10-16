export type SavedAction={type:'toggle';id:string}|{type:'replace';ids:string[];validIds?:string[]};
export function savedReducer(state:string[],action:SavedAction):string[]{ if(action.type==='toggle') return state.includes(action.id)?state.filter(id=>id!==action.id):[...state,action.id]; const valid=action.validIds?new Set(action.validIds):null; return [...new Set(action.ids.filter(id=>!valid||valid.has(id)))]; }
export const serializeSaved=(ids:string[])=>JSON.stringify(ids);
export function deserializeSaved(value:string|null):string[]{ if(!value)return[]; try { const p:unknown=JSON.parse(value); return Array.isArray(p)?p.filter((x):x is string=>typeof x==='string'):[]; }catch{return[];} }
