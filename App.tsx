import { useMemo, useState } from "react";
import {
  Calculator, Search, ReceiptIndianRupee, Landmark, Percent,
  ShieldCheck, Moon, Sun, ArrowRight, Sparkles, History, Star,
  Menu, X, IndianRupee, BarChart3, FileCheck2, WalletCards
} from "lucide-react";
import { gstExclusive, gstInclusive, emi, sip, profitMargin } from "./utils/calculations";

type Tool = {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ReactNode;
};

const tools: Tool[] = [
  {id:"gst", name:"GST Calculator", category:"GST", description:"Calculate taxable value, CGST, SGST, IGST and total GST.", icon:<ReceiptIndianRupee/>},
  {id:"gstin", name:"GSTIN Checker", category:"GST", description:"Validate GSTIN format, state code, PAN portion and checksum.", icon:<ShieldCheck/>},
  {id:"inclusive", name:"GST Inclusive / Exclusive", category:"GST", description:"Convert between GST-inclusive and GST-exclusive amounts.", icon:<Percent/>},
  {id:"rcm", name:"Reverse Charge Calculator", category:"GST", description:"Calculate CGST, SGST or IGST liability under RCM.", icon:<FileCheck2/>},
  {id:"sip", name:"SIP Calculator", category:"Finance", description:"Estimate SIP investment, returns and maturity value.", icon:<BarChart3/>},
  {id:"emi", name:"Loan EMI Calculator", category:"Finance", description:"Calculate EMI, total interest and total repayment.", icon:<WalletCards/>},
  {id:"fd", name:"FD Calculator", category:"Finance", description:"Estimate fixed-deposit interest and maturity.", icon:<Landmark/>},
  {id:"rd", name:"RD Calculator", category:"Finance", description:"Estimate recurring-deposit maturity value.", icon:<Landmark/>},
  {id:"profit", name:"Profit Margin Calculator", category:"Accounting", description:"Calculate profit, margin and markup.", icon:<Calculator/>},
  {id:"discount", name:"Discount Calculator", category:"Accounting", description:"Calculate discount amount and final selling price.", icon:<Percent/>},
  {id:"percentage", name:"Percentage Calculator", category:"Accounting", description:"Calculate percentages, increases, decreases and differences.", icon:<Percent/>},
  {id:"tds", name:"TDS Calculator", category:"Tax", description:"Calculate TDS and net payment from amount and rate.", icon:<ReceiptIndianRupee/>},
];

const money = (n:number) => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2}).format(Number.isFinite(n)?n:0);

function App() {
  const [query,setQuery] = useState("");
  const [category,setCategory] = useState("All");
  const [dark,setDark] = useState(false);
  const [active,setActive] = useState("gst");
  const [mobile,setMobile] = useState(false);

  const filtered = useMemo(() => tools.filter(t =>
    (category==="All" || t.category===category) &&
    `${t.name} ${t.description} ${t.category}`.toLowerCase().includes(query.toLowerCase())
  ),[query,category]);

  return <div className={dark ? "app dark" : "app"}>
    <header className="topbar">
      <div className="brand" onClick={()=>setActive("gst")}><div className="brandmark">H</div><div><strong>HisabHub</strong><span>India's Smart Finance & Tax Toolkit</span></div></div>
      <nav className={mobile?"nav open":"nav"}>
        {["All","GST","Finance","Accounting","Tax"].map(c=><button key={c} className={category===c?"navlink active":"navlink"} onClick={()=>{setCategory(c);setMobile(false)}}>{c==="All"?"All Tools":c}</button>)}
      </nav>
      <div className="top-actions"><button className="iconbtn" onClick={()=>setDark(!dark)} aria-label="Toggle theme">{dark?<Sun/>:<Moon/>}</button><button className="iconbtn menu" onClick={()=>setMobile(!mobile)}>{mobile?<X/>:<Menu/>}</button></div>
    </header>

    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles/> BUILT FOR INDIAN PROFESSIONALS</div>
          <h1>Accounting, GST & finance tools.<br/><span>All in one place.</span></h1>
          <p>Calculate. Verify. Reconcile. Simplify. HisabHub brings everyday finance and tax calculations into one fast, privacy-first toolkit.</p>
          <div className="searchbox"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search a tool... e.g. GST, EMI, SIP" /></div>
          <div className="hero-tags"><span>⚡ Fast</span><span>🔒 Privacy-first</span><span>🇮🇳 India-focused</span></div>
        </div>
        <div className="hero-panel">
          <div className="mini-label">POPULAR TODAY</div>
          <div className="quick" onClick={()=>setActive("gst")}><div className="qicon"><ReceiptIndianRupee/></div><div><b>GST Calculator</b><small>CGST • SGST • IGST</small></div><ArrowRight/></div>
          <div className="quick" onClick={()=>setActive("emi")}><div className="qicon"><WalletCards/></div><div><b>Loan EMI Calculator</b><small>EMI • Interest • Schedule</small></div><ArrowRight/></div>
          <div className="quick" onClick={()=>setActive("sip")}><div className="qicon"><BarChart3/></div><div><b>SIP Calculator</b><small>Investment • Returns</small></div><ArrowRight/></div>
        </div>
      </section>

      <section className="section">
        <div className="section-head"><div><div className="eyebrow">TOOLKIT</div><h2>{category==="All"?"Popular tools":`${category} tools`}</h2></div><span className="count">{filtered.length} tools</span></div>
        <div className="toolgrid">{filtered.map(t=><article className="toolcard" key={t.id} onClick={()=>setActive(t.id)}><div className="toolicon">{t.icon}</div><span className="category">{t.category}</span><h3>{t.name}</h3><p>{t.description}</p><button>Open tool <ArrowRight/></button></article>)}</div>
      </section>

      <section className="calculator-section">
        <CalculatorPanel id={active}/>
      </section>

      <section className="privacy"><div className="privacy-icon"><ShieldCheck/></div><div><h3>Your calculations stay with you.</h3><p>HisabHub is designed privacy-first. Calculations run in your browser and are not sent to a server by this starter application.</p></div></section>
    </main>
    <footer><div><b>HisabHub</b><span>India's Smart Finance & Tax Toolkit</span></div><p>For general informational purposes. Verify current statutory provisions before making tax or financial decisions.</p><span>© 2026 HisabHub</span></footer>
  </div>
}

function CalculatorPanel({id}:{id:string}) {
  const [amount,setAmount]=useState(10000), [rate,setRate]=useState(18), [mode,setMode]=useState<"ex"|"in">("ex");
  const [principal,setPrincipal]=useState(1000000), [interest,setInterest]=useState(8.5), [tenure,setTenure]=useState(5);
  const [monthly,setMonthly]=useState(5000), [years,setYears]=useState(10);
  const [cost,setCost]=useState(100), [selling,setSelling]=useState(125);
  const result = id==="gst" ? (mode==="ex"?gstExclusive(amount,rate):gstInclusive(amount,rate))
    : id==="inclusive" ? (mode==="ex"?gstExclusive(amount,rate):gstInclusive(amount,rate))
    : id==="emi" ? emi(principal,interest,tenure*12)
    : id==="sip" ? sip(monthly,interest,years)
    : id==="profit" ? profitMargin(cost,selling)
    : null;

  const title = tools.find(t=>t.id===id)?.name || "Calculator";
  return <div className="calc-wrap">
    <div className="calc-header"><div><div className="eyebrow">LIVE CALCULATOR</div><h2>{title}</h2><p>Enter values and get an instant estimate.</p></div><button className="outline"><History/> History</button></div>
    {(id==="gst"||id==="inclusive") && <div className="calc-grid">
      <div className="inputs"><Field label="Amount" value={amount} set={setAmount}/><Field label="GST Rate (%)" value={rate} set={setRate}/><div className="seg"><button className={mode==="ex"?"selected":""} onClick={()=>setMode("ex")}>Exclusive</button><button className={mode==="in"?"selected":""} onClick={()=>setMode("in")}>Inclusive</button></div></div>
      <ResultCards values={[["Taxable Amount",result?.taxable],["GST Amount",result?.gst],["CGST", (result?.gst||0)/2],["SGST",(result?.gst||0)/2],["Grand Total",result?.total]]}/>
    </div>}
    {id==="emi" && <div className="calc-grid"><div className="inputs"><Field label="Loan Amount" value={principal} set={setPrincipal}/><Field label="Interest Rate (%)" value={interest} set={setInterest}/><Field label="Tenure (Years)" value={tenure} set={setTenure}/></div><ResultCards values={[["Monthly EMI",result?.emi],["Total Interest",result?.interest],["Total Payment",result?.total],["Principal",principal]]}/></div>}
    {id==="sip" && <div className="calc-grid"><div className="inputs"><Field label="Monthly SIP" value={monthly} set={setMonthly}/><Field label="Expected Annual Return (%)" value={interest} set={setInterest}/><Field label="Investment Period (Years)" value={years} set={setYears}/></div><ResultCards values={[["Total Investment",result?.invested],["Estimated Returns",result?.returns],["Maturity Value",result?.maturity]]}/></div>}
    {id==="profit" && <div className="calc-grid"><div className="inputs"><Field label="Cost" value={cost} set={setCost}/><Field label="Selling Price" value={selling} set={setSelling}/></div><ResultCards values={[["Gross Profit",result?.profit],["Profit Margin %",result?.margin],["Markup %",result?.markup]]}/></div>}
    {!["gst","inclusive","emi","sip","profit"].includes(id) && <div className="coming"><Sparkles/><h3>{title} is ready for the next module.</h3><p>The tool registry, routing structure and professional UI are already prepared for expansion.</p></div>}
  </div>
}

function Field({label,value,set}:{label:string,value:number,set:(n:number)=>void}) {
  return <label className="field"><span>{label}</span><div><IndianRupee size={16}/><input type="number" value={value} onChange={e=>set(Number(e.target.value))}/></div></label>
}
function ResultCards({values}:{values:Array<[string,number|undefined]>}) {
  return <div className="results">{values.map(([label,value])=><div className="result" key={label}><span>{label}</span><strong>{label.includes("%")||label.endsWith("%")?`${(value||0).toFixed(2)}%`:money(value||0)}</strong></div>)}</div>
}
export default App;