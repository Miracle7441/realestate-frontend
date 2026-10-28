"use client";
import { useEffect, useState } from 'react'

export default function Home(){
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const API = "https://realestate-backend-8-coc6.onrender.com"

  useEffect(()=>{
    const tryFetch = (url) => fetch(url).then(r=>r.json())
    
    // Try listings first (your real data), then properties
    tryFetch(`${API}/api/listings/`)
      .then(d=>{
        const arr = Array.isArray(d) ? d : d.results || d.data || []
        if(arr.length > 0){
          setProperties(arr)
          setLoading(false)
        } else {
          // fallback to properties endpoint
          return tryFetch(`${API}/api/properties/`).then(d2=>{
            setProperties(Array.isArray(d2) ? d2 : d2.results || [])
            setLoading(false)
          })
        }
      })
      .catch(()=>{
        tryFetch(`${API}/api/properties/`).then(d=>{
          setProperties(Array.isArray(d) ? d : d.results || [])
          setLoading(false)
        }).catch(()=>setLoading(false))
      })
  },[])

  return (
    <div style={{fontFamily:'system-ui', background:'#f7f7f8', minHeight:'100vh'}}>
      <div style={{background:'#0f172a', color:'white', padding:'18px 24px', fontWeight:800, fontSize:20}}>Lagos Homes - Ikeja LIVE 🏠</div>
      {loading && <p style={{textAlign:'center', marginTop:40}}>Loading houses from Render...</p>}
      {!loading && properties.length===0 && <p style={{textAlign:'center', marginTop:40}}>No properties found. Add some in Django admin!</p>}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:20, padding:24, maxWidth:1200, margin:'0 auto'}}>
        {properties.map((p,i)=>(
          <div key={p.id||i} style={{background:'white', borderRadius:16, overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.06)'}}>
            <div style={{height:180, background:'#e2e8f0', display:'flex', alignItems:'center', justifyContent:'center'}}>
              {p.image ? <img src={p.image.startsWith('http')?p.image:`${API}${p.image}`} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <span>🏠</span>}
            </div>
            <div style={{padding:16}}>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:14, color:'#64748b'}}><span>{p.location||p.city||'Lagos'}</span><b style={{color:'#0f172a'}}>₦{p.price?.toLocaleString()}</b></div>
              <h3 style={{margin:'8px 0 0', fontSize:16}}>{p.title}</h3>
              <p style={{margin:'4px 0 0', fontSize:13, color:'#64748b'}}>{p.bedrooms} beds • {p.bathrooms||p.baths} baths</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}