export interface Fixture {
    id: string;
    no: string;
    vessel: string;
    broker: string;
    coBroker: string;
    operator: string;
    cpDate: string;
    layFrom: string;
    layFromTime: string;
    layTo: string;
    layToTime: string;
    loadPort: string;
    dischPort: string;
    cargo: string;
    product: string;
    quantity: string;
    ccy: string;
    charterer: string;
    owner: string;
    freight: string;
    payment: string;
    cpForm: string;
    commission: string;
    notes: string;
    shipper: string;
    receiver: string;
    blQty: string;
    hasDem: boolean;
    demRate: string;
    agreedLt: string;
    demCcy: string;
    demAmt: string;
    demInitialAmt?: string;
    demDiscountedAmt?: string;
    demStatus?: "Paid" | "Pending" | "Unpaid";

    // Commission Tracking
    commFreightInvoiced?: boolean;
    commFreightInvoiceDate?: string;
    commFreightReceived?: boolean;
    commDemInvoiced?: boolean;
    commDemInvoiceDate?: string;
    commDemReceived?: boolean;

    // Status
    archived?: boolean;
    cancelled?: boolean;
}

export interface Operator {
    name: string;
    email: string;
    role: string;
}

export const BROKERS = ["GUROL", "YOAN", "BATU", "OZGUR", "EMRE"];
export const DUBAI_BROKERS = ["YOAN", "GUROL"];
export const ISTANBUL_BROKERS = ["BATU", "OZGUR", "EMRE"];
export const OPERATORS = ["BERK", "DUYGU", "GIZEM", "EZGI"];
export const DEM_STATUS = ["Paid", "Pending", "Unpaid"];
