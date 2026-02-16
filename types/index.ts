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
    claimRec: string;
    claimFwd: string;
    archived?: boolean;
    cancelled?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface Operator {
    name: string;
    email: string;
    role: string;
}

export const DUBAI_BROKERS = ['GUROL', 'YOAN'];
