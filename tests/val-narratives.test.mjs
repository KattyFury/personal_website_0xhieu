import { readFile } from 'node:fs/promises';
import test from 'node:test';
import assert from 'node:assert/strict';
const source = await readFile(new URL('../functions/api/val.js', import.meta.url), 'utf8');
const { onRequestPost } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const projects = [{ ticker:'TEST', cgId:'test', narrative:'infra', priceTGE:1.23456789, legacy:{ keep:true } }];
async function run(changes, pass='secret') {
  const writes=[];
  const env={ ADMIN_PASS:'secret', WORK:{get:async()=>JSON.stringify(projects),put:async(k,v)=>writes.push([k,JSON.parse(v)])} };
  const res=await onRequestPost({env,request:new Request('https://example.com/api/val',{method:'POST',body:JSON.stringify({pass,action:'narratives',changes})})});
  return {status:res.status,writes};
}
const change={ticker:'TEST',expectedNarrative:'infra',expectedCgId:'test',narrative:'zk'};
test('updates only narrative and preserves every other field',async()=>{
 const r=await run([change]);assert.equal(r.status,200);assert.deepEqual(r.writes,[['val-projects',[{...projects[0],narrative:'zk'}]]]);
 assert.equal((await run([{...change,narrative:'rwa'}])).status,200);
});
test('rejects stale identity or narrative with no partial write',async()=>{
 for(const c of [{...change,expectedNarrative:'ai'},{...change,expectedCgId:'wrong'},{...change,ticker:'MISSING'}]){
  const r=await run([c]);assert.equal(r.status,409);assert.deepEqual(r.writes,[]);
 }
});
test('rejects invalid, duplicate, empty batches and unauthorized writes',async()=>{
 for(const c of [[],[change,change],[{...change,narrative:'unknown'}],[change,null]]){const r=await run(c);assert.equal(r.status,400);assert.deepEqual(r.writes,[]);}
 const r=await run([change],'wrong');assert.equal(r.status,401);assert.deepEqual(r.writes,[]);
});
