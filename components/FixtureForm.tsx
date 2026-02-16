"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Fixture, DUBAI_BROKERS } from "@/types";
import { useFixtures } from "@/context/FixtureContext";
import {
    Save,
    X,
    Ship,
    Clock,
    Package,
    DollarSign,
    MapPin,
    ChevronRight,
    Info
} from "lucide-react";

interface FixtureFormProps {
    initialData?: Fixture;
    isEdit?: boolean;
}

const ALL_BROKERS = ['BATU', 'EMRE', 'OZGUR', 'GUROL', 'YOAN'];
const OPERATORS = ['BERK', 'DUYGU', 'GIZEM', 'EZGI'];
const CCYS = ['USD', 'EUR', 'GBP', 'TRY'];
const PAY_TERMS = ['PREPAID', 'COD', 'NET 30', 'NET 60', 'NET 90', 'LMSUM', 'BBB'];
const DEM_STATUS = ['Unpaid', 'Pending', 'Paid'];

export default function FixtureForm({ initialData, isEdit = false }: FixtureFormProps) {
    const router = useRouter();
    const { addFixture, updateFixture, uniqueEntities, getEntityAffinities } = useFixtures();

    const [formData, setFormData] = useState<Fixture>(
        initialData || {
            id: "",
            no: `FX-${Date.now().toString().slice(-6)}`,
            vessel: "",
            broker: "",
            coBroker: "",
            operator: "",
            cpDate: new Date().toISOString().split('T')[0],
            // ... (rest of initial state remains the same)
            layFrom: "",
            layFromTime: "16:00",
            layTo: "",
            layToTime: "23:59",
            loadPort: "",
            dischPort: "",
            cargo: "",
            product: "",
            quantity: "",
            ccy: "USD",
            charterer: "",
            owner: "",
            freight: "",
            payment: "",
            cpForm: "",
            commission: "",
            notes: "",
            shipper: "",
            receiver: "",
            blQty: "",
            hasDem: false,
            demRate: "",
            agreedLt: "",
            demCcy: "USD",
            demAmt: "",
            demInitialAmt: "",
            demDiscountedAmt: "",
            demStatus: "Unpaid",
            claimRec: "",
            claimFwd: "",
            cancelled: false,
            commFreightInvoiced: false,
            commFreightInvoiceDate: "",
            commFreightReceived: false,
            commDemInvoiced: false,
            commDemInvoiceDate: "",
            commDemReceived: false
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));

            // Auto-fill logic when vessel changes
            if (name === 'vessel') {
                const affinities = getEntityAffinities(value);
                if (affinities) {
                    setFormData(prev => ({
                        ...prev,
                        vessel: value.toUpperCase(),
                        owner: affinities.owner || prev.owner,
                        charterer: affinities.charterer || prev.charterer,
                        broker: affinities.broker || prev.broker,
                        operator: affinities.operator || prev.operator
                    }));
                }
            }
        }
    };

    const handleUpper = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const upperVal = value.toUpperCase();
        setFormData(prev => ({ ...prev, [name]: upperVal }));

        // Check for autofill even on upper conversion
        if (name === 'vessel') {
            const affinities = getEntityAffinities(upperVal);
            if (affinities) {
                setFormData(prev => ({
                    ...prev,
                    owner: affinities.owner || prev.owner,
                    charterer: affinities.charterer || prev.charterer,
                    broker: affinities.broker || prev.broker,
                    operator: affinities.operator || prev.operator
                }));
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.vessel || !formData.broker) {
            alert("Vessel and Broker are required!");
            return;
        }

        if (isEdit && initialData) {
            updateFixture(initialData.id, formData);
        } else {
            addFixture({ ...formData, id: `FX-${Date.now()}` });
        }
        router.push('/fixtures');
    };

    const sectionTitleStyle = "flex items-center gap-2 mb-6 text-[var(--green-500)] font-bold text-xs uppercase tracking-[0.2em]";
    const inputContainerStyle = "flex flex-col gap-1.5";
    const labelStyle = "text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider ml-1";
    const inputStyle = "fi bg-[var(--bg-elevated)] border-[var(--border)] focus:border-[var(--green-500)] transition-all h-11 px-4 rounded-xl text-sm";
    const selectStyle = "fs bg-[var(--bg-elevated)] border-[var(--border)] focus:border-[var(--green-500)] transition-all h-11 px-4 rounded-xl text-sm appearance-none";

    return (
        <div className="max-w-5xl mx-auto p-4 pb-20">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-[var(--border)]">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--green-glow)] flex items-center justify-center text-[var(--green-500)] shadow-[0_8px_20px_rgba(34,197,94,0.15)]">
                        {isEdit ? <Ship size={24} /> : <Ship size={24} />}
                    </div>
                    <div>
                        <h2 className="text-2xl font-black">{isEdit ? 'Edit Fixture' : 'Create New Fixture'}</h2>
                        <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest">{isEdit ? `Modifying ${formData.vessel}` : 'Enter maritime fixture details'}</p>
                    </div>
                </div>
                <button
                    onClick={() => router.back()}
                    className="p-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--red-400)] hover:border-[var(--red-400)] transition-all shadow-lg"
                >
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
                {/* CORE INFORMATION */}
                <section className="bg-[var(--bg-card)] p-8 rounded-[2rem] border border-[var(--border)] shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                        <Info size={120} />
                    </div>

                    <div className="flex items-center justify-between mb-8">
                        <div className={sectionTitleStyle}>
                            <span>01 / Core Information</span>
                        </div>
                        {isEdit && (
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Cancelled</span>
                                <div className="relative">
                                    <input type="checkbox" name="cancelled" checked={formData.cancelled} onChange={handleChange} className="sr-only" />
                                    <div className={`w-10 h-5 rounded-full transition-all ${formData.cancelled ? 'bg-red-500' : 'bg-[var(--border)]'}`}></div>
                                    <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white shadow-md transition-all ${formData.cancelled ? 'translate-x-5' : ''}`}></div>
                                </div>
                            </label>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className={inputContainerStyle}>
                            <label className={labelStyle}>Fixture No</label>
                            <input name="no" value={formData.no} onChange={handleChange} className={inputStyle} placeholder="e.g. FL-12" />
                        </div>
                        <div className={inputContainerStyle}>
                            <label className={labelStyle}>Vessel Name *</label>
                            <input
                                name="vessel"
                                value={formData.vessel}
                                onChange={handleUpper}
                                className={`${inputStyle} font-black text-[var(--green-400)]`}
                                required
                                placeholder="Enter ship name"
                                list="vessels-list"
                            />
                        </div>
                        <div className={inputContainerStyle}>
                            <label className={labelStyle}>Broker *</label>
                            <input
                                name="broker"
                                value={formData.broker}
                                onChange={handleUpper}
                                className={inputStyle}
                                required
                                placeholder="Select or type broker"
                                list="brokers-list"
                            />
                        </div>
                        <div className={inputContainerStyle}>
                            <label className={labelStyle}>Co-Broker</label>
                            <input
                                name="coBroker"
                                value={formData.coBroker}
                                onChange={handleUpper}
                                className={inputStyle}
                                placeholder="Optional co-broker"
                                list="brokers-list"
                            />
                        </div>
                        <div className={inputContainerStyle}>
                            <label className={labelStyle}>Operator</label>
                            <input
                                name="operator"
                                value={formData.operator}
                                onChange={handleUpper}
                                className={inputStyle}
                                placeholder="Select or type operator"
                                list="operators-list"
                            />
                        </div>
                        <div className={inputContainerStyle}>
                            <label className={labelStyle}>C/P Date</label>
                            <input type="date" name="cpDate" value={formData.cpDate} onChange={handleChange} className={inputStyle} />
                        </div>
                    </div>
                </section>

                {/* LOGISTICS & PORTS */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-[var(--bg-card)] p-8 rounded-[2rem] border border-[var(--border)] shadow-xl">
                        <div className={sectionTitleStyle}>
                            <MapPin size={14} />
                            <span>02 / Voyage & Ports</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className={inputContainerStyle}>
                                <label className={labelStyle}>Load Port</label>
                                <input name="loadPort" value={formData.loadPort} onChange={handleUpper} className={inputStyle} placeholder="Loading port" list="ports-list" />
                            </div>
                            <div className={inputContainerStyle}>
                                <label className={labelStyle}>Discharge Port</label>
                                <input name="dischPort" value={formData.dischPort} onChange={handleUpper} className={inputStyle} placeholder="Discharge port" list="ports-list" />
                            </div>
                            <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <div className={inputContainerStyle}>
                                    <label className={labelStyle}>Laycan From</label>
                                    <div className="flex gap-2">
                                        <input type="date" name="layFrom" value={formData.layFrom} onChange={handleChange} className={`${inputStyle} flex-1`} />
                                        <input type="time" name="layFromTime" value={formData.layFromTime} onChange={handleChange} className={`${inputStyle} w-24`} />
                                    </div>
                                </div>
                                <div className={inputContainerStyle}>
                                    <label className={labelStyle}>Laycan To</label>
                                    <div className="flex gap-2">
                                        <input type="date" name="layTo" value={formData.layTo} onChange={handleChange} className={`${inputStyle} flex-1`} />
                                        <input type="time" name="layToTime" value={formData.layToTime} onChange={handleChange} className={`${inputStyle} w-24`} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--bg-card)] p-8 rounded-[2rem] border border-[var(--border)] shadow-xl">
                        <div className={sectionTitleStyle}>
                            <Package size={14} />
                            <span>03 / Cargo & Commercial</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className={inputContainerStyle}>
                                <label className={labelStyle}>Cargo Type</label>
                                <input name="cargo" value={formData.cargo} onChange={handleUpper} className={inputStyle} placeholder="e.g. CSS, GASOIL" />
                            </div>
                            <div className={inputContainerStyle}>
                                <label className={labelStyle}>Quantity</label>
                                <input name="quantity" value={formData.quantity} onChange={handleChange} className={inputStyle} placeholder="e.g. 5000 MT" />
                            </div>
                            <div className={inputContainerStyle}>
                                <label className={labelStyle}>Charterer</label>
                                <input name="charterer" value={formData.charterer} onChange={handleUpper} className={inputStyle} placeholder="e.g. KOLMAR" list="charterers-list" />
                            </div>
                            <div className={inputContainerStyle}>
                                <label className={labelStyle}>Owner</label>
                                <input name="owner" value={formData.owner} onChange={handleUpper} className={inputStyle} placeholder="e.g. SC SHIPPING" list="owners-list" />
                            </div>
                            <div className={inputContainerStyle}>
                                <label className={labelStyle}>Freight</label>
                                <input name="freight" value={formData.freight} onChange={handleChange} className={inputStyle} placeholder="e.g. 45.00" />
                            </div>
                            <div className={inputContainerStyle}>
                                <label className={labelStyle}>Payment Terms</label>
                                <select name="payment" value={formData.payment} onChange={handleChange} className={selectStyle}>
                                    <option value="">Select terms</option>
                                    {PAY_TERMS.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </section>

                {/* DEMURRAGE DETAILS */}
                <section className="bg-[var(--bg-card)] p-8 rounded-[2rem] border border-[var(--border)] shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                        <Clock size={120} />
                    </div>
                    <div className="flex items-center justify-between mb-8">
                        <div className={sectionTitleStyle}>
                            <Clock size={14} />
                            <span>04 / Demurrage Management</span>
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <span className="text-xs font-bold text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors uppercase tracking-widest">Enable Demurrage</span>
                            <div className="relative">
                                <input type="checkbox" name="hasDem" checked={formData.hasDem} onChange={handleChange} className="sr-only" />
                                <div className={`w-12 h-6 rounded-full transition-all ${formData.hasDem ? 'bg-[var(--green-500)]' : 'bg-[var(--border)]'}`}></div>
                                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md transition-all ${formData.hasDem ? 'translate-x-6' : ''}`}></div>
                            </div>
                        </label>
                    </div>

                    {formData.hasDem && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-[fadeUp_0.4s_ease-out]">
                            <div className={inputContainerStyle}>
                                <label className={labelStyle}>Dem Rate</label>
                                <input name="demRate" value={formData.demRate} onChange={handleChange} className={inputStyle} placeholder="e.g. 15000" />
                            </div>
                            <div className={inputContainerStyle}>
                                <label className={labelStyle}>Initial Claim Amt</label>
                                <input name="demInitialAmt" value={formData.demInitialAmt} onChange={handleChange} className={inputStyle} placeholder="First claim" />
                            </div>
                            <div className={inputContainerStyle}>
                                <label className={labelStyle}>Discounted Amt</label>
                                <input name="demDiscountedAmt" value={formData.demDiscountedAmt} onChange={handleChange} className={inputStyle} placeholder="After discount" />
                            </div>
                            <div className={inputContainerStyle}>
                                <label className={labelStyle}>Agreed Laytime</label>
                                <input name="agreedLt" value={formData.agreedLt} onChange={handleChange} className={inputStyle} />
                            </div>
                            <div className={inputContainerStyle}>
                                <label className={labelStyle}>Status</label>
                                <select name="demStatus" value={formData.demStatus} onChange={handleChange} className={selectStyle}>
                                    {DEM_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className={inputContainerStyle}>
                                <label className={labelStyle}>Claim Rec.</label>
                                <input type="date" name="claimRec" value={formData.claimRec} onChange={handleChange} className={inputStyle} />
                            </div>
                        </div>
                    )}
                </section>

                {/* COMMISSION TRACKING */}
                <section className="bg-[var(--bg-card)] p-8 rounded-[2rem] border border-[var(--border)] shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                        <DollarSign size={120} />
                    </div>
                    <div className={sectionTitleStyle}>
                        <DollarSign size={14} />
                        <span>05 / Commission Tracking</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Freight Commission */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-white px-3 py-1 bg-white/5 rounded-lg w-fit uppercase tracking-tighter">Comm over Freight</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] cursor-pointer group hover:border-[var(--green-500)] transition-all">
                                    <input type="checkbox" name="commFreightInvoiced" checked={formData.commFreightInvoiced} onChange={handleChange} className="w-4 h-4 rounded border-[var(--border)] text-[var(--green-500)] focus:ring-[var(--green-500)] bg-transparent" />
                                    <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Invoiced</span>
                                </label>
                                <div className={inputContainerStyle}>
                                    <label className={labelStyle}>Invoice Date</label>
                                    <input type="date" name="commFreightInvoiceDate" value={formData.commFreightInvoiceDate} onChange={handleChange} className={inputStyle} />
                                </div>
                                <label className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] cursor-pointer group hover:border-[var(--green-500)] transition-all col-span-full">
                                    <input type="checkbox" name="commFreightReceived" checked={formData.commFreightReceived} onChange={handleChange} className="w-4 h-4 rounded border-[var(--border)] text-[var(--green-500)] focus:ring-[var(--green-500)] bg-transparent" />
                                    <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Received / Paid</span>
                                </label>
                            </div>
                        </div>

                        {/* Demurrage Commission */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-white px-3 py-1 bg-white/5 rounded-lg w-fit uppercase tracking-tighter">Comm over Demurrage</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] cursor-pointer group hover:border-[var(--green-500)] transition-all">
                                    <input type="checkbox" name="commDemInvoiced" checked={formData.commDemInvoiced} onChange={handleChange} className="w-4 h-4 rounded border-[var(--border)] text-[var(--green-500)] focus:ring-[var(--green-500)] bg-transparent" />
                                    <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Invoiced</span>
                                </label>
                                <div className={inputContainerStyle}>
                                    <label className={labelStyle}>Invoice Date</label>
                                    <input type="date" name="commDemInvoiceDate" value={formData.commDemInvoiceDate} onChange={handleChange} className={inputStyle} />
                                </div>
                                <label className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] cursor-pointer group hover:border-[var(--green-500)] transition-all col-span-full">
                                    <input type="checkbox" name="commDemReceived" checked={formData.commDemReceived} onChange={handleChange} className="w-4 h-4 rounded border-[var(--border)] text-[var(--green-500)] focus:ring-[var(--green-500)] bg-transparent" />
                                    <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Received / Paid</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </section>

                {/* NOTES */}
                <section className="bg-[var(--bg-card)] p-8 rounded-[2rem] border border-[var(--border)] shadow-xl">
                    <div className={sectionTitleStyle}>
                        <span>06 / Additional Notes</span>
                    </div>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl p-6 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--green-500)] transition-all min-h-[150px] resize-none"
                        placeholder="Add specific instructions, owner details, or receivers..."
                    />
                </section>

                <div className="flex gap-4 justify-end pt-8">
                    <button type="button" onClick={() => router.back()} className="px-8 py-4 rounded-2xl bg-transparent border border-[var(--border)] font-bold hover:bg-[var(--bg-elevated)] transition-all">
                        Cancel
                    </button>
                    <button type="submit" className="px-10 py-4 rounded-2xl bg-[var(--green-500)] text-black font-black flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(34,197,94,0.3)]">
                        <Save size={20} />
                        {isEdit ? 'Update Fixture' : 'Finalize & Save'}
                    </button>
                </div>
            </form>
            {/* Suggestions DataLists */}
            <datalist id="vessels-list">
                {uniqueEntities.vessels.map(v => <option key={v} value={v} />)}
            </datalist>
            <datalist id="charterers-list">
                {uniqueEntities.charterers.map(c => <option key={c} value={c} />)}
            </datalist>
            <datalist id="owners-list">
                {uniqueEntities.owners.map(o => <option key={o} value={o} />)}
            </datalist>
            <datalist id="brokers-list">
                {ALL_BROKERS.map(b => <option key={b} value={b} />)}
            </datalist>
            <datalist id="operators-list">
                {OPERATORS.map(o => <option key={o} value={o} />)}
            </datalist>
            <datalist id="ports-list">
                {uniqueEntities.ports.map(p => <option key={p} value={p} />)}
            </datalist>
        </div >
    );
}
