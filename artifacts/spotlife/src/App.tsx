import { type ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter, Link } from 'wouter';
import { Home as HomeIcon, Compass, Map, Users, UserRound, MapPin, Search, Bell, ChevronRight, Star, Music2, CalendarDays, Heart, MessageCircle, Share2, X, Plus, ShieldCheck, SlidersHorizontal, ArrowUpRight, Building2, Check, Send, Sparkles, Navigation, Ticket } from 'lucide-react';

const queryClient = new QueryClient();
type Spot = { id: number; name: string; city: string; kind: string; genre: string; rating: string; reviews: number; area: string; };

const spots: Spot[] = [
  { id:1,name:'Club BASIS',city:'Utrecht',kind:'Club',genre:'Techno',rating:'4.8',reviews:328,area:'Oudegracht' },
  { id:2,name:'De School',city:'Amsterdam',kind:'Club',genre:'House',rating:'4.7',reviews:512,area:'West' },
  { id:3,name:'PIP Den Haag',city:'Den Haag',kind:'Club',genre:'Techno',rating:'4.6',reviews:184,area:'Binckhorst' },
  { id:4,name:'Annabel',city:'Rotterdam',kind:'Live music',genre:'Indie',rating:'4.5',reviews:267,area:'Delftseplein' },
  { id:5,name:'Bird',city:'Rotterdam',kind:'Lounge',genre:'Jazz',rating:'4.6',reviews:203,area:'Delftseplein' },
  { id:6,name:'Jimmy Woo',city:'Amsterdam',kind:'Club',genre:'House',rating:'4.4',reviews:416,area:'Leidseplein' },
  { id:7,name:'Danscentrum Swing Inn',city:'Eindhoven',kind:'Dance school',genre:'Salsa',rating:'4.9',reviews:91,area:'Strijp-S' },
  { id:8,name:'De Helling',city:'Utrecht',kind:'Live music',genre:'Electronic',rating:'4.5',reviews:146,area:'Rotsoord' },
  { id:9,name:'Plein Publiek',city:'Breda',kind:'Lounge',genre:'Disco',rating:'4.3',reviews:108,area:'Havenkwartier' },
];
const events = [
  { id:1, day:'14',month:'JUN',name:'Nachtcollege: Open Air',place:'Thuishaven · Amsterdam',type:'Party',genre:'Techno',time:'22:00' },
  { id:2, day:'15',month:'JUN',name:'Nederlands Kamerkoor: after dark',place:'TivoliVredenburg · Utrecht',type:'Concert',genre:'Live',time:'20:30' },
  { id:3, day:'21',month:'JUN',name:'Rotterdam Rave',place:'Maassilo · Rotterdam',type:'Party',genre:'Techno',time:'23:00' },
  { id:4, day:'22',month:'JUN',name:'Yussef Dayes',place:'BIRD · Rotterdam',type:'Concert',genre:'Jazz',time:'21:00' },
  { id:5, day:'28',month:'JUN',name:'Solomun at Wildeburg',place:'Netl · Kraggenburg',type:'DJ set',genre:'House',time:'18:00' },
];
const cities = [
  { name:'Amsterdam',count:'218 spots',city:'ams' },{ name:'Rotterdam',count:'94 spots',city:'rtd' },
  { name:'Utrecht',count:'76 spots',city:'utr' },{ name:'Den Haag',count:'62 spots',city:'dh' },{ name:'Eindhoven',count:'48 spots',city:'ehv' },
];
const nav = [
  { path:'/', label:'Home', Icon:HomeIcon },{ path:'/discover',label:'Discover',Icon:Compass },
  { path:'/map',label:'Map',Icon:Map },{ path:'/social',label:'Social',Icon:Users },{ path:'/profile',label:'Profile',Icon:UserRound },
];

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [noticeOpen,setNoticeOpen]=useState(false);
  const activePath = location === '/' ? '/' : `/${location.split('/')[1]}`;
  return <div className="app-shell">
    <aside className="sidebar">
      <Link href="/" className="brand"><span className="brand-mark"><Music2 size={18}/></span>SpotLife</Link>
      <div className="nav-label">Your night starts here</div>
      <nav>{nav.map(({path,label,Icon})=><Link key={path} href={path} className={`nav-link ${activePath===path?'active':''}`} data-testid={`link-nav-${label.toLowerCase()}`}><Icon size={18}/>{label}</Link>)}</nav>
      <div className="side-bottom">
        <div className="nav-label">Your SpotLife</div>
        <div className="user-pill"><span className="avatar small">MV</span><div><strong style={{fontSize:12}}>Mila van Dijk</strong><div style={{fontSize:10,color:'#938b9b',marginTop:2}}>Night owl · Utrecht</div></div></div>
      </div>
    </aside>
    <div className="main-area">
      <header className="topbar"><div className="crumb"><span>SpotLife</span><ChevronRight size={13}/><span style={{color:'#e5deea'}}>{nav.find(n=>n.path===activePath)?.label||'SpotLife'}</span></div>
        <div className="top-actions"><button className="location-button" onClick={()=>document.dispatchEvent(new CustomEvent('open-city'))} data-testid="button-change-city"><MapPin size={14}/> Utrecht <ChevronRight size={13}/></button><div style={{position:'relative'}}><button className="icon-button" aria-label="Notifications" onClick={()=>setNoticeOpen(!noticeOpen)} data-testid="button-notifications"><Bell size={16}/></button>{noticeOpen&&<div className="panel" style={{position:'absolute',right:0,top:46,width:250,padding:15,zIndex:10}}><div className="eyebrow">You’re all caught up</div><p className="subtle" style={{margin:'7px 0 0',fontSize:11}}>New community activity and saved-night updates will show here.</p></div>}</div></div>
      </header>
      {children}
    </div>
    <nav className="mobile-nav">{nav.map(({path,label,Icon})=><Link key={path} href={path} className={`nav-link ${activePath===path?'active':''}`} data-testid={`mobile-nav-${label.toLowerCase()}`}><Icon size={18}/>{label}</Link>)}</nav>
  </div>;
}

function CityPicker({ onChoose }: { onChoose:(city:string)=>void }) {
  const [query,setQuery]=useState('');
  const [close,setClose]=useState(false);
  useEffect(()=>{const open=()=>setClose(false);document.addEventListener('open-city',open);return()=>document.removeEventListener('open-city',open)},[]);
  if(close)return null;
  const options=['Utrecht','Amsterdam','Rotterdam','Den Haag','Eindhoven','Groningen','Breda','Maastricht'];
  const filtered=options.filter(city=>city.toLowerCase().includes(query.toLowerCase()));
  return <div className="modal-backdrop" onClick={()=>setClose(true)}><div className="modal" onClick={e=>e.stopPropagation()}>
    <div className="modal-head"><div><div className="eyebrow">Set your scene</div><h2 style={{marginTop:6}}>Where are we going?</h2></div><button className="icon-button" onClick={()=>setClose(true)} aria-label="Close city picker"><X size={16}/></button></div>
    <div className="search-wrap"><Search size={16}/><input placeholder="Search a Dutch city" value={query} onChange={e=>setQuery(e.target.value)} data-testid="input-city-search"/></div>
    <div className="filter-row">{filtered.length?filtered.map(city=><button className="chip" key={city} onClick={()=>{onChoose(city);setClose(true)}} data-testid={`city-option-${city.toLowerCase().replace(' ','-')}`}><MapPin size={12} style={{display:'inline',marginRight:5}}/>{city}</button>):<p className="subtle">No city found. Try Amsterdam, Utrecht or Rotterdam.</p>}</div>
    <p className="subtle" style={{margin:0}}>Browse sample nightlife across the Netherlands. Your city choice stays on this device.</p>
  </div></div>;
}

function PlaceCard({spot, onOpen}:{spot:Spot;onOpen:(s:Spot)=>void}) {
  return <button className="place-card" style={{textAlign:'left',color:'inherit',padding:0,cursor:'pointer'}} onClick={()=>onOpen(spot)} data-testid={`card-spot-${spot.id}`}>
    <div className={`place-art alt${(spot.id%3)+1}`}><span className="art-orb"/><span className="art-tag">{spot.kind}</span></div>
    <div className="card-body"><div className="card-title"><div><h3>{spot.name}</h3><div className="meta"><MapPin size={12}/>{spot.area}, {spot.city}</div></div><span className="rating"><Star size={12} fill="currentColor"/>{spot.rating}</span></div>
      <div className="tags"><span className="tag">{spot.genre}</span><span className="tag">{spot.reviews} reviews</span></div>
    </div>
  </button>;
}
function EventCard({event}:{event:typeof events[number]}) {
  return <div className="event-card" data-testid={`card-event-${event.id}`}><div className="event-date"><strong>{event.day}</strong><span>{event.month}</span></div><div className="event-info"><div style={{display:'flex',justifyContent:'space-between',gap:8}}><h3>{event.name}</h3><span className="tag">{event.type}</span></div><p>{event.place} · {event.time}</p></div></div>;
}
function SectionHead({title,desc,action}:{title:string;desc:string;action?:ReactNode}) {
  return <div className="section-head"><div><h2>{title}</h2><p>{desc}</p></div>{action}</div>;
}
function Home() {
  const [city,setCity]=useState('Utrecht');const [picker,setPicker]=useState(false);const [selected,setSelected]=useState<Spot|null>(null);
  useEffect(()=>{const open=()=>setPicker(true);document.addEventListener('open-city',open);return()=>document.removeEventListener('open-city',open)},[]);
  const nearby=spots.filter(s=>s.city===city);
  return <main className="content fade-in">
    <section className="hero"><div className="hero-copy"><div className="eyebrow">Your city after dark</div><h1>Tonight has<br/>good potential.</h1><p>Find the right room, the right sound, the right people. Start with what’s happening around {city}.</p><Link href="/discover" className="button-primary">Find your next spot <ArrowUpRight size={15}/></Link></div></section>
    <section className="section"><SectionHead title={`Around ${city}`} desc="Good nights, just around the corner." action={<Link href="/map" className="text-link">Explore map →</Link>}/>
      {nearby.length?<div className="cards">{nearby.map(s=><PlaceCard key={s.id} spot={s} onOpen={setSelected}/>)}</div>:<div className="empty-state"><MapPin size={20}/><strong>New city, new possibilities</strong><span>Explore all the places and events in {city}.</span></div>}
    </section>
    <section className="section"><SectionHead title="Popular across the Netherlands" desc="The places everyone is talking about." action={<Link href="/discover" className="text-link">All spots →</Link>}/><div className="grid-cities">{cities.map((c,i)=><button className="city-card" onClick={()=>setCity(c.name)} key={c.city} data-testid={`button-city-${c.city}`}><strong>{c.name}</strong><span>{c.count} to explore</span></button>)}</div></section>
    <section className="section"><SectionHead title="Coming up" desc="Plans worth putting on the calendar." action={<Link href="/discover" className="text-link">Browse events →</Link>}/><div className="event-list">{events.slice(0,4).map(e=><EventCard key={e.id} event={e}/>)}</div></section>
    <section className="section"><SectionHead title="The night, through your lens" desc="A little social proof from the dance floor." action={<Link href="/social" className="text-link">See the social pulse →</Link>}/><div className="post-card" style={{display:'flex',alignItems:'center',gap:16,padding:15}}><div className="post-image" style={{width:120,height:82,borderRadius:9,flex:'none'}}/><div><div className="eyebrow">Last night in Utrecht</div><p style={{fontSize:13,margin:'7px 0',color:'#e6dfe9'}}>“The kind of set that makes you forget what time it is.”</p><Link href="/social" className="text-link" style={{padding:0}}>See photos and stories →</Link></div></div></section>
    {picker&&<CityPicker onChoose={setCity}/>}
    {selected&&<SpotModal spot={selected} onClose={()=>setSelected(null)}/>}
  </main>;
}

function Discover() {
  const [search,setSearch]=useState('');const [city,setCity]=useState('All cities');const [genre,setGenre]=useState('All sounds');const [kind,setKind]=useState('All types');const [mode,setMode]=useState<'Spots'|'Events'>('Spots');const [selected,setSelected]=useState<Spot|null>(null);
  const genres=['All sounds','Techno','House','Indie','Jazz','Live','Salsa','Electronic','Disco'];
  const kinds=['All types','Club','Live music','Lounge','Dance school'];
  const filtered=spots.filter(s=>(city==='All cities'||s.city===city)&&`${s.name} ${s.city} ${s.area}`.toLowerCase().includes(search.toLowerCase())&&(genre==='All sounds'||s.genre===genre)&&(kind==='All types'||s.kind===kind));
  const filteredEvents=events.filter(e=>(search===''||`${e.name} ${e.place}`.toLowerCase().includes(search.toLowerCase()))&&(city==='All cities'||e.place.toLowerCase().includes(city.toLowerCase()))&&(kind==='All types'||e.type===kind)&&(genre==='All sounds'||e.genre===genre));
  return <main className="content fade-in"><div className="eyebrow">Find your next</div><h1 style={{marginBottom:8}}>A city full of<br/>good possibilities.</h1><p className="subtle">Search spots and events from Amsterdam to Maastricht.</p>
    <div className="searchbox"><div className="search-wrap"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search a place, event or city…" data-testid="input-discover-search"/></div><button className="button-primary" onClick={()=>setSearch(search.trim())}><Search size={15}/>Search</button></div>
    <div className="filter-row" style={{marginTop:18}}>{['Spots','Events'].map(m=><button key={m} className={`chip ${mode===m?'selected':''}`} onClick={()=>setMode(m as 'Spots'|'Events')} data-testid={`filter-mode-${m.toLowerCase()}`}>{m}</button>)}
      <span style={{width:1,background:'#39313f',margin:'0 4px'}}/>
      <select aria-label="Filter by city" className="chip" style={{appearance:'none'}} value={city} onChange={e=>setCity(e.target.value)} data-testid="filter-city">{['All cities',...cities.map(c=>c.name)].map(c=><option key={c}>{c}</option>)}</select>
      <select aria-label="Filter by genre" className="chip" style={{appearance:'none'}} value={genre} onChange={e=>setGenre(e.target.value)} data-testid="filter-genre">{genres.map(g=><option key={g}>{g}</option>)}</select>
      <select aria-label={mode==='Spots'?'Filter by venue type':'Filter by event type'} className="chip" style={{appearance:'none'}} value={kind} onChange={e=>setKind(e.target.value)} data-testid="filter-type">{(mode==='Spots'?kinds:['All types','Concert','DJ set','Party']).map(k=><option key={k}>{k}</option>)}</select>
    </div>
    <div className="section-head" style={{marginTop:10}}><div><h2>{mode==='Spots'?'Places for the mood':'Events worth going out for'}</h2><p>{mode==='Spots'?`${filtered.length} places in your results`:`${filteredEvents.length} upcoming events`}</p></div><SlidersHorizontal size={17} color="#918997"/></div>
    {mode==='Spots'?(filtered.length?<div className="cards">{filtered.map(s=><PlaceCard key={s.id} spot={s} onOpen={setSelected}/>)}</div>:<div className="empty-state"><Search size={20}/><strong>No spots in this filter</strong><span>Try another city, sound or type.</span><button className="text-link" onClick={()=>{setSearch('');setCity('All cities');setGenre('All sounds');setKind('All types')}}>Clear filters</button></div>)
      :filteredEvents.length?<div className="event-list">{filteredEvents.map(e=><EventCard key={e.id} event={e}/>)}</div>:<div className="empty-state"><CalendarDays size={20}/><strong>No events match just yet</strong><span>Clear a filter to see more of the calendar.</span></div>}
    {selected&&<SpotModal spot={selected} onClose={()=>setSelected(null)}/>}
  </main>;
}

function MapPage() {
  const [active,setActive]=useState(1);const [onlyEvents,setOnlyEvents]=useState(false);
  const selected=spots.find(s=>s.id===active)||spots[0];
  const selectedEvent=events.find(e=>e.id===active)||events[0];
  const positions=[['18%','32%'],['57%','22%'],['78%','56%'],['42%','64%'],['69%','73%'],['31%','51%'],['53%','43%'],['85%','31%'],['14%','69%']];
  return <main className="content fade-in"><div className="eyebrow">The Netherlands, after dark</div><h1 style={{fontSize:40}}>Find the right place.</h1><p className="subtle">A sample map of clubs, venues and the nights happening there. Select a pin to see the details.</p>
    <div className="filter-row"><button className={`chip ${!onlyEvents?'selected':''}`} onClick={()=>setOnlyEvents(false)} data-testid="map-filter-spots"><Building2 size={12} style={{display:'inline',marginRight:6}}/>Spots</button><button className={`chip ${onlyEvents?'selected':''}`} onClick={()=>setOnlyEvents(true)} data-testid="map-filter-events"><CalendarDays size={12} style={{display:'inline',marginRight:6}}/>Events</button><span className="chip" style={{cursor:'default'}}><Navigation size={12} style={{display:'inline',marginRight:6}}/>Netherlands view</span></div>
    <div className="map-layout"><div className="map-canvas" aria-label="Stylized sample nightlife map of the Netherlands">
      <span className="map-label" style={{left:'16%',top:'21%'}}>Amsterdam</span><span className="map-label" style={{left:'37%',top:'48%'}}>Utrecht</span><span className="map-label" style={{left:'60%',top:'70%'}}>Eindhoven</span><span className="map-label" style={{left:'68%',top:'40%'}}>Apeldoorn</span><span className="map-label" style={{left:'10%',top:'64%'}}>Rotterdam</span><span className="map-label" style={{left:'9%',top:'45%'}}>Den Haag</span>
      {onlyEvents?events.map((e,i)=><button className={`map-marker ${active===e.id?'active':''}`} key={`event-${e.id}`} style={{left:positions[i+1][0],top:positions[i+1][1]}} onClick={()=>setActive(e.id)} aria-label={`Show ${e.name}`} data-testid={`map-event-marker-${e.id}`}><span>{i+1}</span></button>):spots.map((s,i)=><button className={`map-marker ${active===s.id?'active':''}`} key={s.id} style={{left:positions[i][0],top:positions[i][1]}} onClick={()=>setActive(s.id)} aria-label={`Show ${s.name}`} data-testid={`map-marker-${s.id}`}><span>{s.id}</span></button>)}
    </div><div><SectionHead title={onlyEvents?'Upcoming events':'Nearby spots'} desc={onlyEvents?'5 events on this sample map':'9 places on this sample map'}/>
      <div className="map-list">{onlyEvents?events.map(e=><button key={e.id} className={`map-result ${active===e.id?'selected':''}`} onClick={()=>setActive(e.id)} data-testid={`map-event-result-${e.id}`}><strong>{e.name}</strong><span>{e.place} · {e.type} · {e.day} {e.month}</span></button>):spots.slice(0,6).map(s=><button key={s.id} className={`map-result ${active===s.id?'selected':''}`} onClick={()=>setActive(s.id)} data-testid={`map-result-${s.id}`}><strong>{s.name}</strong><span>{s.city} · {s.kind} · <span style={{color:'#d8b976'}}>★ {s.rating}</span></span></button>)}</div>
      <div className="panel" style={{marginTop:13,padding:15}}><div className="eyebrow">Selected {onlyEvents?'event':'spot'}</div><h3 style={{margin:'8px 0 4px'}}>{onlyEvents?selectedEvent.name:selected.name}</h3><p className="subtle" style={{marginBottom:12}}>{onlyEvents?`${selectedEvent.place} · ${selectedEvent.time}`:`${selected.area}, ${selected.city} · ${selected.genre}`}</p><Link href="/discover" className="text-link" style={{padding:0}}>View details <ArrowUpRight size={12}/></Link></div>
    </div></div>
  </main>;
}

type Post = {id:number; initials:string; name:string; city:string; ago:string; caption:string; likes:number; comments:string[]; image:string};
function Social() {
  const [posts,setPosts]=useState<Post[]>([
    {id:1,initials:'LV',name:'Luca Vermeer',city:'Amsterdam',ago:'38 min ago',caption:'That closing track at De School. Still somewhere between the smoke machine and the first tram home.',likes:86,comments:['That room was magic last night.','Need the track ID.'],image:''},
    {id:2,initials:'SK',name:'Sara Koster',city:'Utrecht',ago:'2 hours ago',caption:'A little bit of golden hour before doors open at BASIS. Who’s dancing tonight?',likes:42,comments:['On my way!'],image:'photo-two'},
    {id:3,initials:'JR',name:'Jules van Rijn',city:'Rotterdam',ago:'Yesterday',caption:'BIRD never misses. Live jazz, good people, and nowhere else to be.',likes:31,comments:[],image:''},
  ]);
  const [liked,setLiked]=useState<number[]>([]);const [comment,setComment]=useState<Record<number,string>>({});
  function toggleLike(id:number){setLiked(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id])}
  function addComment(id:number){const text=comment[id]?.trim();if(!text)return;setPosts(prev=>prev.map(p=>p.id===id?{...p,comments:[...p.comments,text]}:p));setComment(prev=>({...prev,[id]:''}))}
  return <main className="content fade-in"><div className="eyebrow">The social pulse</div><h1 style={{fontSize:42}}>Nights are better<br/>when they’re shared.</h1><p className="subtle">See what the city is listening to, and what your people are up to.</p>
    <div className="social-layout section"><div className="feed">{posts.map(post=><article key={post.id} className="post-card" data-testid={`post-${post.id}`}><div className="post-head"><span className="avatar small">{post.initials}</span><div className="post-user">{post.name}<small>{post.city} · {post.ago}</small></div><button className="icon-button" aria-label="More post options" style={{marginLeft:'auto'}}><span style={{letterSpacing:2}}>···</span></button></div>
      <div className={`post-image ${post.image}`} role="img" aria-label={`Nightlife photo shared by ${post.name}`}/>
      <div className="post-caption">{post.caption}</div>
      <div className="post-actions"><button className={`action ${liked.includes(post.id)?'liked':''}`} onClick={()=>toggleLike(post.id)} data-testid={`button-like-${post.id}`}><Heart size={15} fill={liked.includes(post.id)?'currentColor':'none'}/>{post.likes+(liked.includes(post.id)?1:0)} likes</button><span className="action"><MessageCircle size={15}/>{post.comments.length} comments</span><button className="action" onClick={()=>navigator.clipboard?.writeText('SpotLife · shared night')} data-testid={`button-share-${post.id}`}><Share2 size={14}/>Share</button></div>
      {post.comments.length>0&&<div style={{padding:'0 16px 10px',fontSize:11,color:'#a9a1b0'}}>{post.comments.slice(-2).map((c,i)=><p key={i} style={{margin:'0 0 4px'}}><strong style={{color:'#d9d0df'}}>Night owl</strong> {c}</p>)}</div>}
      <form className="comment-box" onSubmit={e=>{e.preventDefault();addComment(post.id)}}><input placeholder="Add a comment…" value={comment[post.id]||''} onChange={e=>setComment({...comment,[post.id]:e.target.value})} data-testid={`input-comment-${post.id}`}/><button type="submit" data-testid={`button-comment-${post.id}`}>Post</button></form>
    </article>)}</div>
    <aside><div className="panel" style={{padding:18}}><div className="eyebrow">In your orbit</div><h2 style={{marginTop:9,fontSize:18}}>What’s moving</h2><div style={{display:'grid',gap:14,marginTop:17}}><div><span className="meta"><Sparkles size={13} color="#c18bf0"/> Trending sound</span><strong style={{display:'block',fontSize:13,marginTop:5}}>Melodic techno</strong></div><div><span className="meta"><MapPin size={13} color="#c18bf0"/> Most shared city</span><strong style={{display:'block',fontSize:13,marginTop:5}}>Amsterdam</strong></div><div><span className="meta"><Ticket size={13} color="#c18bf0"/> This weekend</span><strong style={{display:'block',fontSize:13,marginTop:5}}>12 nights worth saving</strong></div></div><Link href="/discover" className="button-soft" style={{marginTop:18,width:'100%',justifyContent:'center'}}>Find your next night</Link></div>
    <div className="official-note"><ShieldCheck size={16} style={{flex:'none',marginTop:1}}/><span>Posts are community moments. Official venue details are managed only by verified business owners.</span></div></aside></div>
  </main>;
}

function Profile() {
  const [profile,setProfile]=useState<'Mila van Dijk'|'Club BASIS'|'Bird'|'Danscentrum Swing Inn'|'Nachtcollege'>('Mila van Dijk');
  const [tab,setTab]=useState('Activity');const [verifiedAttendee,setVerifiedAttendee]=useState(false);const [managerRequested,setManagerRequested]=useState(false);const [review,setReview]=useState(false);
  const isUser=profile==='Mila van Dijk';const org=spots.find(s=>s.name===profile);
  return <main className="content fade-in"><div className="eyebrow">Your SpotLife</div><div className="section-head" style={{alignItems:'center'}}><div><h1 style={{fontSize:38,marginBottom:4}}>Profile</h1><p className="subtle">Your nightlife identity, plus the places you love.</p></div><select className="chip" value={profile} onChange={e=>{setProfile(e.target.value as typeof profile);setTab('Activity')}} aria-label="Choose profile view" data-testid="select-profile-view">{['Mila van Dijk','Club BASIS','Bird','Danscentrum Swing Inn','Nachtcollege'].map(x=><option key={x}>{x}</option>)}</select></div>
    <div className="profile-hero"><span className="avatar">{isUser?'MV':profile.split(' ').map(p=>p[0]).slice(0,2).join('')}</span><div><div className="eyebrow">{isUser?'Night owl profile':'Official organization profile'} {!isUser&&<ShieldCheck size={13} style={{display:'inline',verticalAlign:'middle'}}/>}</div><h1>{profile}</h1><div className="meta"><MapPin size={13}/>{isUser?'Utrecht, Netherlands':`${org?.city||'Amsterdam'}, Netherlands`} · {isUser?'Member since 2023':org?.kind||'Event organizer'}</div></div>
      <div className="profile-stats"><div className="stat"><strong>{isUser?'18':'4.8'}</strong><span>{isUser?'nights logged':'community rating'}</span></div><div className="stat"><strong>{isUser?'236':'328'}</strong><span>{isUser?'followers':'reviews'}</span></div></div>
    </div>
    {!isUser&&<div className="official-note"><ShieldCheck size={17} style={{flex:'none'}}/><span><strong>Official information is protected.</strong> Community members can leave reviews, but only verified owners or managers can edit business details or publish official updates.</span></div>}
    <div className="profile-tabs">{['Activity',...(isUser?['Saved spots','Reviews']:['Reviews','About'])].map(t=><button key={t} className={`profile-tab ${tab===t?'selected':''}`} onClick={()=>setTab(t)} data-testid={`profile-tab-${t.toLowerCase().replace(' ','-')}`}>{t}</button>)}</div>
    {tab==='Activity'&&isUser&&<div className="social-layout"><div className="panel" style={{padding:20}}><SectionHead title="Your next nights" desc="A few ideas for your next plan."/><div className="event-list">{events.slice(0,2).map(e=><EventCard key={e.id} event={e}/>)}</div><button className="button-soft" style={{marginTop:15}} onClick={()=>setTab('Reviews')} data-testid="button-write-review"><Plus size={14}/> Review a completed night</button></div><div className="panel" style={{padding:20}}><div className="eyebrow">Your taste, lately</div><h2 style={{marginTop:8}}>Electronic nights</h2><p className="subtle">You’ve been saving late sets and intimate rooms around Utrecht.</p><div className="tags"><span className="tag">Techno</span><span className="tag">House</span><span className="tag">Live sets</span></div></div></div>}
    {tab==='Activity'&&!isUser&&<div className="panel" style={{padding:20,maxWidth:760}}><SectionHead title="About this place" desc="Sample information for this official profile."/><p className="subtle">{profile} is part of the Dutch nightlife community. Discover upcoming nights, share an attendee review, and see what visitors think of the organization, venue and event experience.</p><div className="tags"><span className="tag">{org?.kind||'Event organizer'}</span><span className="tag">{org?.genre||'Electronic'}</span><span className="tag">Verified listing</span></div><button className="button-soft" style={{marginTop:18}} onClick={()=>setReview(true)} data-testid="button-review-organization"><Star size={14}/> Leave a community review</button></div>}
    {tab==='Saved spots'&&<div className="cards">{spots.slice(0,3).map(s=><PlaceCard key={s.id} spot={s} onOpen={()=>{}}/>)}</div>}
    {tab==='Reviews'&&isUser&&<div className="panel" style={{padding:22,maxWidth:720}}><div className="eyebrow">Community reviews</div><h2 style={{marginTop:8}}>Review a night you attended</h2><p className="subtle">Reviews collect three separate scores: the organization, the venue, and the event itself. A completed event is available only to a verified attendee.</p><div className="panel" style={{padding:14,margin:'15px 0',background:'#201d26'}}><div style={{display:'flex',justifyContent:'space-between',gap:10}}><div><strong style={{fontSize:13}}>Nachtcollege: Open Air</strong><p className="subtle" style={{margin:'5px 0 0'}}>Completed · Amsterdam</p></div><label style={{fontSize:10,color:'#c8bdcf',display:'flex',alignItems:'center',gap:7}}><input type="checkbox" checked={verifiedAttendee} onChange={e=>setVerifiedAttendee(e.target.checked)} data-testid="checkbox-verified-attendee"/> Attendee verified</label></div></div><button className="button-primary" disabled={!verifiedAttendee} style={{opacity:verifiedAttendee?1:.45}} onClick={()=>setReview(true)} data-testid="button-review-completed-event"><Star size={14}/> Review completed event</button>{!verifiedAttendee&&<p style={{color:'#988f9d',fontSize:10,margin:'9px 0 0'}}>Mark the sample attendee as verified to unlock the event review form.</p>}</div>}
    {tab==='Reviews'&&!isUser&&<div className="panel" style={{padding:22,maxWidth:720}}><div className="eyebrow">Community reviews</div><h2 style={{marginTop:8}}>A 4.8 from the crowd</h2><p className="subtle">Visitors can leave an organization, venue and event experience rating. Official profile details remain owner-managed.</p><div className="tags"><span className="tag">Organization · 4.8</span><span className="tag">Venue · 4.7</span><span className="tag">Event · 4.9</span></div><button className="button-soft" style={{marginTop:16}} onClick={()=>setReview(true)} data-testid="button-review-organization"><Star size={14}/> Leave a community review</button></div>}
    {tab==='About'&&<div className="panel" style={{padding:20,maxWidth:700}}><div className="eyebrow">Official listing</div><h2 style={{marginTop:9}}>{profile}</h2><p className="subtle">Information on this organization profile is presented as sample data. Only verified business owners and managers can manage official details.</p><div className="official-note"><ShieldCheck size={16}/><span>Public visitors cannot edit official business information.</span></div></div>}
    {!isUser&&<div className="panel" style={{padding:18,marginTop:17,maxWidth:760}}><div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}><div><div className="eyebrow">Owner & manager access</div><strong style={{fontSize:13,display:'block',marginTop:6}}>Management tools are gated</strong><p className="subtle" style={{fontSize:11,margin:'5px 0 0'}}>This sample profile does not grant public edit or publishing access.</p></div><button className="button-soft" onClick={()=>setManagerRequested(true)} disabled={managerRequested} data-testid="button-manager-access">{managerRequested?'Request noted':'Request manager access'}</button></div>{managerRequested&&<div className="official-note"><ShieldCheck size={15}/><span>Request noted in this sample session. Official management remains locked pending verified ownership; no profile edits are available.</span></div>}</div>}
    {review&&<ReviewModal verified onClose={()=>setReview(false)}/>}
  </main>;
}

function ReviewModal({verified,onClose}:{verified:boolean;onClose:()=>void}) {
  const [submitted,setSubmitted]=useState(false);
  return <div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><div><div className="eyebrow">Your night, your take</div><h2 style={{marginTop:6}}>Write a review</h2></div><button className="icon-button" onClick={onClose} aria-label="Close review"><X size={16}/></button></div>
    {!verified?<div className="empty-state"><ShieldCheck size={20}/><strong>Attendee verification needed</strong><span>Only verified attendees can review a completed event.</span></div>:submitted?<div className="empty-state"><Check size={22} color="#b8d39a"/><strong>Review saved locally</strong><span>Your sample review is now part of this session.</span><button className="button-primary" style={{marginTop:12}} onClick={onClose}>Done</button></div>:<>
      <div className="rating-fields">{['Organization','Venue','Event'].map(item=><div className="rating-field" key={item}><label>{item} rating</label><select defaultValue="5" aria-label={`${item} rating`} data-testid={`rating-${item.toLowerCase()}`}>{[5,4,3,2,1].map(n=><option key={n} value={n}>{n} — {['','Not for me','Could be better','Good','Great','Unforgettable'][n]}</option>)}</select></div>)}</div>
      <textarea placeholder="What should other night owls know?" data-testid="input-review-text"/><div className="modal-actions"><button className="button-soft" onClick={onClose}>Cancel</button><button className="button-primary" onClick={()=>setSubmitted(true)} data-testid="button-submit-review">Publish review <Send size={13}/></button></div>
    </>}
  </div></div>;
}
function SpotModal({spot,onClose}:{spot:Spot;onClose:()=>void}) {
  const [saved,setSaved]=useState(false);const [review,setReview]=useState(false);
  return <div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><div><div className="eyebrow">{spot.kind} · {spot.city}</div><h2 style={{marginTop:6}}>{spot.name}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close spot details"><X size={16}/></button></div>
    <div className="place-art alt2" style={{height:125,borderRadius:10}}><span className="art-orb"/></div><p className="subtle" style={{margin:'14px 0 6px'}}><MapPin size={13} style={{display:'inline',verticalAlign:'middle'}}/> {spot.area}, {spot.city} · {spot.genre}</p><div className="rating"><Star size={13} fill="currentColor"/> {spot.rating} <span className="subtle">({spot.reviews} community reviews)</span></div>
    <div className="official-note"><ShieldCheck size={16}/><span>Official listing details are controlled by verified owners. Community members can share reviews, not edit this profile.</span></div>
    <div className="modal-actions"><button className="button-soft" onClick={()=>setSaved(!saved)} data-testid="button-save-spot"><Heart size={14} fill={saved?'currentColor':'none'}/>{saved?'Saved':'Save spot'}</button><button className="button-primary" onClick={()=>setReview(true)} data-testid="button-review-spot"><Star size={14}/> Write review</button></div>
    {review&&<ReviewModal verified onClose={()=>setReview(false)}/>}
  </div></div>;
}
function Router() {
  return <Shell><RoutedErrorBoundary><Switch>
    <Route path="/" component={Home}/><Route path="/discover" component={Discover}/><Route path="/map" component={MapPage}/><Route path="/social" component={Social}/><Route path="/profile" component={Profile}/><Route component={NotFound}/>
  </Switch></RoutedErrorBoundary></Shell>;
}
function RoutedErrorBoundary({children}:{children:ReactNode}) {
  const [location]=useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}
function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/,'')}><Router/></WouterRouter><Toaster/></TooltipProvider></QueryClientProvider>;
}
export default App;
