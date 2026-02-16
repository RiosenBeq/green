"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Fixture, DUBAI_BROKERS } from "@/types";
import { useFixtures } from "@/context/FixtureContext";
import { Save, X } from "lucide-react";

interface FixtureFormProps {
    initialData?: Fixture;
    isEdit?: boolean;
}

const ALL_BROKERS = ['DUYGU', 'BERK', 'GUROL', 'YOAN', 'OZGUR', 'BATU', 'EMRE'];
const CCYS = ['USD', 'EUR', 'GBP', 'TRY'];
const PAY_TERMS = ['PREPAID', 'COD', 'NET 30', 'NET 60', 'NET 90', 'PMT', 'LMSUM', 'BBB'];

export default function FixtureForm({ initialData, isEdit = false }: FixtureFormProps) {
    const router = useRouter();
    const { addFixture, updateFixture } = useFixtures();

    const [formData, setFormData] = useState<Fixture>(
        initialData || {
            id: "",
            no: `FX-${Date.now().toString().slice(-6)}`,
            vessel: "",
            broker: "",
            coBroker: "",
            operator: "",
            cpDate: new Date().toISOString().split('T')[0],
            layFrom: "",
            layTo: "",
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
            claimRec: "",
            claimFwd: ""
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        // Handle checkbox manually if needed, but here we use boolean in state
        // For type="checkbox", we need custom handler or cast
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleUpper = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
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
        router.back();
    };

    return (
        <div className="panel animate-[fadeUp_0.4s_ease-out]">
            <div className="flex justify-between items-center mb-6 border-b border-[var(--border)] pb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    {isEdit ? '✏️ Edit Fixture' : '➕ New Fixture'}
                    {isEdit && <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded uppercase">Edit Mode</span>}
                </h2>
                <button onClick={() => router.back()} className="icon-btn ib-red">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* VESSEL DETAILS */}
                <section>
                    <div className="flex items-center gap-2 mb-4 text-[var(--green-500)] font-bold text-xs uppercase tracking-wider">
                        <span>🚢 Vessel Details</span>
                        <div className="h-px bg-[var(--border)] flex-1"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Fixture No</label>
                            <input name="no" value={formData.no} onChange={handleChange} className="fi" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Vessel Name *</label>
                            <input name="vessel" value={formData.vessel} onChange={handleUpper} className="fi font-bold" required />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Broker *</label>
                            <select name="broker" value={formData.broker} onChange={handleChange} className="fs" required>
                                <option value="">— Select —</option>
                                {ALL_BROKERS.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Operator</label>
                            <input name="operator" value={formData.operator} onChange={handleUpper} className="fi" />
                        </div>
                    </div>
                </section>

                {/* VOYAGE */}
                <section>
                    <div className="flex items-center gap-2 mb-4 text-[var(--green-500)] font-bold text-xs uppercase tracking-wider">
                        <span>🧭 Voyage</span>
                        <div className="h-px bg-[var(--border)] flex-1"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Laycan From</label>
                            <input type="date" name="layFrom" value={formData.layFrom} onChange={handleChange} className="fi" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Laycan To</label>
                            <input type="date" name="layTo" value={formData.layTo} onChange={handleChange} className="fi" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Load Port</label>
                            <input name="loadPort" value={formData.loadPort} onChange={handleUpper} className="fi" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Disch Port</label>
                            <input name="dischPort" value={formData.dischPort} onChange={handleUpper} className="fi" />
                        </div>
                    </div>
                </section>

                {/* CARGO */}
                <section>
                    <div className="flex items-center gap-2 mb-4 text-[var(--green-500)] font-bold text-xs uppercase tracking-wider">
                        <span>📦 Cargo & Commercial</span>
                        <div className="h-px bg-[var(--border)] flex-1"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Cargo</label>
                            <input name="cargo" value={formData.cargo} onChange={handleUpper} className="fi" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Quantity</label>
                            <input name="quantity" value={formData.quantity} onChange={handleChange} className="fi" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Freight</label>
                            <input name="freight" value={formData.freight} onChange={handleChange} className="fi" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Payment</label>
                            <select name="payment" value={formData.payment} onChange={handleChange} className="fs">
                                <option value="">— Select —</option>
                                {PAY_TERMS.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Charterer</label>
                            <input name="charterer" value={formData.charterer} onChange={handleUpper} className="fi" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Owner</label>
                            <input name="owner" value={formData.owner} onChange={handleUpper} className="fi" />
                        </div>
                    </div>
                </section>

                {/* DEMURRAGE */}
                <section>
                    <div className="flex items-center gap-2 mb-4 text-[var(--green-500)] font-bold text-xs uppercase tracking-wider">
                        <span>⏰ Demurrage</span>
                        <div className="h-px bg-[var(--border)] flex-1"></div>
                    </div>
                    <div className="mb-4">
                        <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
                            <input type="checkbox" name="hasDem" checked={formData.hasDem} onChange={handleChange} className="accent-[var(--green-500)] w-4 h-4" />
                            Demurrage Applicable
                        </label>
                    </div>
                    {formData.hasDem && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-[fadeUp_0.3s_ease]">
                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Dem Rate</label>
                                <input name="demRate" value={formData.demRate} onChange={handleChange} className="fi" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Agreed Laytime</label>
                                <input name="agreedLt" value={formData.agreedLt} onChange={handleChange} className="fi" />
                            </div>
                        </div>
                    )}
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-4 text-[var(--green-500)] font-bold text-xs uppercase tracking-wider">
                        <span>📝 Notes</span>
                        <div className="h-px bg-[var(--border)] flex-1"></div>
                    </div>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="ft min-h-[100px]"
                        placeholder="Add any additional notes here..."
                    />
                </section>

                <div className="flex gap-4 justify-end pt-6 border-t border-[var(--border)]">
                    <button type="button" onClick={() => router.back()} className="btn btn-ghost">Cancel</button>
                    <button type="submit" className="btn btn-primary min-w-[140px]">
                        <Save size={16} /> Save Fixture
                    </button>
                </div>
            </form>
        </div>
    );
}
